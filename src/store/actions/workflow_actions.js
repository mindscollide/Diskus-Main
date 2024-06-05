import {
  createWorkFlowRM,
  saveWorkFlowRM,
  getWorkFlowByFileIdRM,
  addUpdateFieldValueRM,
  getAllFieldsByWorkFlowIdRM,
  sendDocumentRM,
  saveSignatureDocumentRM,
  getAnnotationOfDataroomAttachment,
  addAnnotationOnDataroomAttachment,
  GetAllSignatureFlowDocumentsForCreatorRM,
} from "../../commen/apis/Api_config";
import { workflowApi, dataRoomApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import axios from "axios";
import { getAnnotationsOfDataroomAttachement } from "./webVieverApi_actions";

// crate workflow Init
const createWorkflow_init = () => {
  return {
    type: actions.CREATESIGNATUREFLOW_INIT,
  };
};

const createWorkflow_success = (response, message) => {
  console.log(
    { response, message },
    "CREATESIGNATUREFLOW_SUCCESSCREATESIGNATUREFLOW_SUCCESS"
  );
  return {
    type: actions.CREATESIGNATUREFLOW_SUCCESS,
    response: response,
    message: message,
  };
};

const createWorkflow_fail = (message) => {
  return {
    type: actions.CREATESIGNATUREFLOW_SUCCESS,
    message: message,
  };
};
// Create WorkFlow APi
const createWorkflowApi = (Data, navigate, t, pdfDataJson) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(createWorkflow_init());
    let form = new FormData();
    form.append("RequestMethod", createWorkFlowRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createWorkflowApi(Data, navigate, t, pdfDataJson));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_01".toLowerCase()
                )
            ) {
              console.log(
                response.data.responseResult,
                "createWorkflow_successcreateWorkflow_successcreateWorkflow_success"
              );
              let reponseData = JSON.stringify(
                response.data.responseResult.signatureDocument.documentID
              );

              window.open(
                `/#/DisKus/signatureviewer?documentID=${encodeURIComponent(
                  reponseData
                )}`,
                "_blank",
                "noopener noreferrer"
              );

              await dispatch(
                createWorkflow_success(
                  response.data.responseResult,
                  t("Created-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_02".toLowerCase()
                )
            ) {
              dispatch(createWorkflow_fail(t("Dataroom-api-call-error")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_03".toLowerCase()
                )
            ) {
              dispatch(createWorkflow_fail(t("Failed-to-save-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_04".toLowerCase()
                )
            ) {
              dispatch(createWorkflow_fail(t("Failed-to-save-workflow")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_05".toLowerCase()
                )
            ) {
              dispatch(
                createWorkflow_fail(t("Failed-to-save-signature-document"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_06".toLowerCase()
                )
            ) {
              dispatch(
                createWorkflow_fail(t("Failed-to-save-workflow-folder-mapping"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_07".toLowerCase()
                )
            ) {
              dispatch(createWorkflow_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createWorkflow_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createWorkflow_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(createWorkflow_fail(t("Something-went-wrong")));
      });
  };
};

// crate workflow Init
const saveWorkflow_init = () => {
  return {
    type: actions.SAVE_WORKFLOW_INT,
  };
};

const saveWorkflow_success = (response, message, loading = false) => {
  return {
    type: actions.SAVE_WORKFLOW_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};

const saveWorkflow_fail = (message) => {
  return {
    type: actions.SAVE_WORKFLOW_FAIL,
    message: message,
  };
};

const saveWorkflowApi = (
  Data,
  navigate,
  t,
  setOpenAddParticipentModal,
  value,
  updateFieldValueData,
  addAnnoatationofFilesAttachment,
  saveSignatureDocument
) => {
  console.log(
    Data,
    value,
    updateFieldValueData,
    addAnnoatationofFilesAttachment,
    saveSignatureDocument,
    "saveWorkflowApisaveWorkflowApi"
  );
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(saveWorkflow_init());
    let form = new FormData();
    form.append("RequestMethod", saveWorkFlowRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            saveWorkflowApi(
              Data,
              navigate,
              t,
              setOpenAddParticipentModal,
              value,
              updateFieldValueData,
              addAnnoatationofFilesAttachment,
              saveSignatureDocument
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_01".toLowerCase()
                )
            ) {
              if (value === 1) {
                dispatch(
                  saveWorkflow_success(
                    response.data.responseResult,
                    t("Insert-successfully"),
                    true
                  )
                );
                dispatch(
                  addUpdateFieldValueApi(
                    updateFieldValueData,
                    navigate,
                    t,
                    addAnnoatationofFilesAttachment,
                    saveSignatureDocument
                  )
                );
              } else {
                setOpenAddParticipentModal(false);
                dispatch(
                  saveWorkflow_success(
                    response.data.responseResult,
                    t("Insert-successfully"),
                    false
                  )
                );
              }

              // dispatch(
              //   saveWorkflow_success(
              //     response.data.responseResult,
              //     t("Insert-successfully"),
              //     false
              //   )
              // );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_02".toLowerCase()
                )
            ) {
              dispatch(saveWorkflow_fail(t("Failed-to-insert")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_03".toLowerCase()
                )
            ) {
              if (value === 1) {
                dispatch(
                  addUpdateFieldValueApi(
                    updateFieldValueData,
                    navigate,
                    t,
                    addAnnoatationofFilesAttachment,
                    saveSignatureDocument
                  )
                );
                dispatch(
                  saveWorkflow_success(
                    response.data.responseResult,
                    t("Insert-successfully"),
                    true
                  )
                );
              } else {
                setOpenAddParticipentModal(false);
                dispatch(
                  saveWorkflow_success(
                    response.data.responseResult,
                    t("Insert-successfully"),
                    false
                  )
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_04".toLowerCase()
                )
            ) {
              dispatch(saveWorkflow_fail(t("Failed-to-edit")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_05".toLowerCase()
                )
            ) {
              dispatch(saveWorkflow_fail(t("Something-went-wrong")));
            } else {
              dispatch(saveWorkflow_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveWorkflow_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveWorkflow_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveWorkflow_fail(t("Something-went-wrong")));
      });
  };
};

// crate workflow Init
const getWorkFlowByFlodID_init = () => {
  return {
    type: actions.GETWORKFLOWBYFILEID_INIT,
  };
};

const getWorkFlowByFlodID_success = (response, message, loading) => {
  return {
    type: actions.GETWORKFLOWBYFILEID_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};

const getWorkFlowByFlodID_fail = (message) => {
  return {
    type: actions.GETWORKFLOWBYFILEID_FAIL,
    message: message,
  };
};

const getWorkFlowByWorkFlowIdwApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getWorkFlowByFlodID_init());
    let form = new FormData();
    form.append("RequestMethod", getWorkFlowByFileIdRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getWorkFlowByWorkFlowIdwApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetWorkFlowByFileID_01".toLowerCase()
                )
            ) {
              dispatch(
                getWorkFlowByFlodID_success(
                  response.data.responseResult,
                  t("Data-available"),
                  false
                )
              );

              try {
                let workfFlowId =
                  response.data.responseResult.workFlow.workFlow.pK_WorkFlow_ID;
                let newData = { FK_WorkFlow_ID: Number(workfFlowId) };
                dispatch(
                  getAllFieldsByWorkflowIdApi(newData, navigate, t, Data)
                );
              } catch (error) {
                console.log(error, "errorerrorerror");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetWorkFlowByFileID_02".toLowerCase()
                )
            ) {
              dispatch(getWorkFlowByFlodID_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetWorkFlowByFileID_03".toLowerCase()
                )
            ) {
              dispatch(getWorkFlowByFlodID_fail(t("Something-went-wrong")));
            } else {
              dispatch(getWorkFlowByFlodID_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getWorkFlowByFlodID_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getWorkFlowByFlodID_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getWorkFlowByFlodID_fail(t("Something-went-wrong")));
      });
  };
};
// crate workflow Init
const addUpdateFieldValue_init = () => {
  return {
    type: actions.ADD_UPDATE_FIELD_VALUE_INIT,
  };
};

const addUpdateFieldValue_success = (response, message, loading = false) => {
  return {
    type: actions.ADD_UPDATE_FIELD_VALUE_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};

const addUpdateFieldValue_fail = (message) => {
  return {
    type: actions.ADD_UPDATE_FIELD_VALUE_FAIL,
    message: message,
  };
};

const addUpdateFieldValueApi = (
  Data,
  navigate,
  t,
  addAnnoatationofFilesAttachment,
  saveSignatureDocument
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(addUpdateFieldValue_init());
    let form = new FormData();
    form.append("RequestMethod", addUpdateFieldValueRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            addUpdateFieldValueApi(
              Data,
              navigate,
              t,
              addAnnoatationofFilesAttachment,
              saveSignatureDocument
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_01".toLowerCase()
                )
            ) {
              dispatch(
                addAnnoationSignatrueFlow(
                  navigate,
                  t,
                  addAnnoatationofFilesAttachment,
                  saveSignatureDocument
                )
              );
              dispatch(
                addUpdateFieldValue_success(
                  response.data.responseResult,
                  t("Saved-successfully"),
                  true
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_02".toLowerCase()
                )
            ) {
              dispatch(addUpdateFieldValue_fail(t("invalid-data-provided")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_03".toLowerCase()
                )
            ) {
              dispatch(addUpdateFieldValue_fail(t("Failed-to-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_04".toLowerCase()
                )
            ) {
              dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
            } else {
              dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
      });
  };
};
// crate workflow Init
const saveSignatureDocument_init = () => {
  return {
    type: actions.SAVE_SIGNATURE_DOCUMENT_INIT,
  };
};

const saveSignatureDocument_success = (response, message) => {
  return {
    type: actions.SAVE_SIGNATURE_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const saveSignatureDocument_fail = (message) => {
  return {
    type: actions.SAVE_SIGNATURE_DOCUMENT_FAIL,
    message: message,
  };
};

const saveSignatureDocumentApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(saveSignatureDocument_init());
    let form = new FormData();
    form.append("RequestMethod", saveSignatureDocumentRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(saveSignatureDocumentApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveSignatureDocument_01".toLowerCase()
                )
            ) {
              dispatch(
                saveSignatureDocument_success(
                  response.data.responseResult,
                  t("Signature-file-created-and-added-to-dataroom")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveSignatureDocument_02".toLowerCase()
                )
            ) {
              dispatch(saveSignatureDocument_fail(t("Invalid-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveSignatureDocument_03".toLowerCase()
                )
            ) {
              dispatch(saveSignatureDocument_fail(t("File-not-exist")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveSignatureDocument_04".toLowerCase()
                )
            ) {
              dispatch(
                saveSignatureDocument_fail(t("File-not-found-on-server"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveSignatureDocument_05".toLowerCase()
                )
            ) {
              dispatch(saveSignatureDocument_fail(t("Invalid-file-extension")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveSignatureDocument_06".toLowerCase()
                )
            ) {
              dispatch(
                saveSignatureDocument_fail(t("Failed-to-save-signature-file"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveSignatureDocument_07".toLowerCase()
                )
            ) {
              dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
            } else {
              dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
      });
  };
};

const getAnnotationDataRoom_init = () => {
  return {
    type: actions.GET_ANNOTATION_FILE_SIGNATUREFLOW_INIT,
  };
};
const getAnnotationDataRoom_success = (response, message) => {
  return {
    type: actions.GET_ANNOTATION_FILE_SIGNATUREFLOW_SUCCESS,
    response: response,
    message: message,
  };
};
const getAnnotationDataRoom_fail = (message) => {
  return {
    type: actions.GET_ANNOTATION_FILE_SIGNATUREFLOW_FAIL,
    message: message,
  };
};
const getAnnoationSignatrueFlow = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(getAnnotationDataRoom_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getAnnotationOfDataroomAttachment.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAnnoationSignatrueFlow(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAnnotationOfFilesAttachement_01".toLowerCase()
                )
            ) {
              dispatch(
                getAnnotationDataRoom_success(
                  response.data.responseResult,
                  t("Annotation-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAnnotationOfFilesAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                getAnnotationDataRoom_fail(t("No-annotation-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAnnotationOfFilesAttachement_03".toLowerCase()
                )
            ) {
              dispatch(getAnnotationDataRoom_fail(t("Something-went-wrong")));
            } else {
              dispatch(getAnnotationDataRoom_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAnnotationDataRoom_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAnnotationDataRoom_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAnnotationDataRoom_fail(t("Something-went-wrong")));
      });
  };
};

const addAnnotationDataRoom_init = () => {
  return {
    type: actions.ADD_ANNOTATION_FILE_SIGNATUREFLOW_INIT,
  };
};
const addAnnotationDataRoom_success = (response, message, loading = false) => {
  return {
    type: actions.ADD_ANNOTATION_FILE_SIGNATUREFLOW_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};
const addAnnotationDataRoom_fail = (message) => {
  return {
    type: actions.ADD_ANNOTATION_FILE_SIGNATUREFLOW_FAIL,
    message: message,
  };
};
const addAnnoationSignatrueFlow = (
  navigate,
  t,
  Data,
  saveSignatureDocument
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(addAnnotationDataRoom_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      addAnnotationOnDataroomAttachment.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            addAnnoationSignatrueFlow(navigate, t, Data, saveSignatureDocument)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_01".toLowerCase()
                )
            ) {
              dispatch(
                saveSignatureDocumentApi(saveSignatureDocument, navigate, t)
              );
              dispatch(
                addAnnotationDataRoom_success(
                  response.data.responseResult,
                  t("Record-Inserted"),
                  true
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                addAnnotationDataRoom_success(
                  response.data.responseResult,
                  t("Record-updated"),
                  true
                )
              );
              dispatch(
                saveSignatureDocumentApi(saveSignatureDocument, navigate, t)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_03".toLowerCase()
                )
            ) {
              dispatch(addAnnotationDataRoom_fail(t("No-record-inserted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_04".toLowerCase()
                )
            ) {
              dispatch(addAnnotationDataRoom_fail(t("No-record-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_05".toLowerCase()
                )
            ) {
              dispatch(addAnnotationDataRoom_fail(t("Something-went-wrong")));
            } else {
              dispatch(addAnnotationDataRoom_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(addAnnotationDataRoom_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(addAnnotationDataRoom_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(addAnnotationDataRoom_fail(t("Something-went-wrong")));
      });
  };
};
const getAllFieldsByWorkflowId_init = () => {
  return {
    type: actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_INIT,
  };
};

const getAllFieldsByWorkflowId_success = (response, message, loading) => {
  return {
    type: actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};

const getAllFieldsByWorkflowId_fail = (message) => {
  return {
    type: actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_FAIL,
    message: message,
  };
};

const getAllFieldsByWorkflowIdApi = (newData, navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getAllFieldsByWorkflowId_init());
    let form = new FormData();
    form.append("RequestMethod", getAllFieldsByWorkFlowIdRM.RequestMethod);
    form.append("RequestData", JSON.stringify(newData));

    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllFieldsByWorkflowIdApi(newData, navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllFieldsByWorkFlowID_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllFieldsByWorkflowId_success(
                  response.data.responseResult,
                  t("Data-available"),
                  false
                )
              );
              let Data2 = {
                FileID: Number(Data.FileID),
                UserID: Number(localStorage.getItem("userID")),
                OrganizationID: Number(localStorage.getItem("organizationID")),
              };
              dispatch(getAnnoationSignatrueFlow(navigate, t, Data2));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllFieldsByWorkFlowID_02".toLowerCase()
                )
            ) {
              let Data2 = {
                FileID: Number(Data.FileID),
                UserID: Number(localStorage.getItem("userID")),
                OrganizationID: Number(localStorage.getItem("organizationID")),
              };
              dispatch(getAnnoationSignatrueFlow(navigate, t, Data2));
              dispatch(getAllFieldsByWorkflowId_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllFieldsByWorkFlowID_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllFieldsByWorkflowId_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllFieldsByWorkflowId_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(getAllFieldsByWorkflowId_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllFieldsByWorkflowId_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllFieldsByWorkflowId_fail(t("Something-went-wrong")));
      });
  };
};

const sendDocument_init = () => {
  return {
    type: actions.SEND_DOCUMENT_INIT,
  };
};

const sendDocument_success = (response, message) => {
  return {
    type: actions.SEND_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const sendDocument_fail = (message) => {
  return {
    type: actions.SEND_DOCUMENT_FAIL,
    message: message,
  };
};

const sendDocumentIdApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return new Promise((resolve, reject) => {
    return (dispatch) => {
      dispatch(sendDocument_init());
      let form = new FormData();
      form.append("RequestMethod", sendDocumentRM.RequestMethod);
      form.append("RequestData", JSON.stringify(Data));

      axios({
        method: "post",
        url: workflowApi,
        data: form,
        headers: {
          _token: token,
        },
      })
        .then(async (response) => {
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(sendDocumentIdApi(Data, navigate, t));
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_SendDocument_01".toLowerCase()
                  )
              ) {
                resolve(response.data.responseResult);
                dispatch(
                  sendDocument_success(
                    response.data.responseResult,
                    t("Saved-successfully")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_SendDocument_02".toLowerCase()
                  )
              ) {
                reject(response.data.responseResult.responseMessage);
                dispatch(sendDocument_fail(t("Failed-to-save")));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_SendDocument_03".toLowerCase()
                  )
              ) {
                reject(response.data.responseResult.responseMessage);

                dispatch(sendDocument_fail(t("Something-went-wrong")));
              } else {
                dispatch(sendDocument_fail(t("Something-went-wrong")));
                reject(response.data.responseResult.responseMessage);
              }
            } else {
              dispatch(sendDocument_fail(t("Something-went-wrong")));
              reject(response.data.responseResult.responseMessage);
            }
          } else {
            dispatch(sendDocument_fail(t("Something-went-wrong")));
            reject(response.data.responseResult.responseMessage);
          }
        })
        .catch((response) => {
          dispatch(sendDocument_fail(t("Something-went-wrong")));
          reject(response.data.responseResult.responseMessage);
        });
    };
  });
};

const getAllSignaturesDocumentsforCreator_init = () => {
  return {
    type: actions.GETALLSIGNATUREFLOWDOCUMENTSFORCREATOR_INIT,
  };
};
const getAllSignaturesDocumentsforCreator_success = (response, message) => {
  return {
    type: actions.GETALLSIGNATUREFLOWDOCUMENTSFORCREATOR_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllSignaturesDocumentsforCreator_fail = (message) => {
  return {
    type: actions.GETALLSIGNATUREFLOWDOCUMENTSFORCREATOR_ISFAIL,
    message: message,
  };
};
const getAllSignaturesDocumentsforCreatorApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllSignaturesDocumentsforCreator_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetAllSignatureFlowDocumentsForCreatorRM.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatureFlowDocumentsForCreator_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllSignaturesDocumentsforCreator_success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatureFlowDocumentsForCreator_02".toLowerCase()
                )
            ) {
              dispatch(
                getAllSignaturesDocumentsforCreator_fail(t("No-data-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatureFlowDocumentsForCreator_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllSignaturesDocumentsforCreator_fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getAllSignaturesDocumentsforCreator_fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getAllSignaturesDocumentsforCreator_fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            getAllSignaturesDocumentsforCreator_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAllSignaturesDocumentsforCreator_fail(t("Something-went-wrong"))
        );
      });
  };
};

export {
  getAllSignaturesDocumentsforCreatorApi,
  createWorkflowApi,
  saveWorkflowApi,
  getWorkFlowByWorkFlowIdwApi,
  addUpdateFieldValueApi,
  saveSignatureDocumentApi,
  getAllFieldsByWorkflowIdApi,
  sendDocumentIdApi,
  getAnnoationSignatrueFlow,
  addAnnoationSignatrueFlow,
};
