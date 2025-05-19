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
  GetAllPendingForApprovalStatsRM,
  ListOfPendingForApprovalSignaturesRM,
  GetPendingApprovalStatusforSignatureFlowRM,
  DeclineReason,
  DeleteSignatureDocumentRM,
  GetAllSignatoriesStatusRM,
  updateActorBundleStatusRM,
  getDashboardPendingApprovalStatsRM,
  GetSignatureFileAnnotationRM,
  AddUpdateSignatureFileAnnotationRM,
  ValidateEncryptedStringMinuteReviewDataRM,
  ValidateEncryptedStringSignatureDataRM,
} from "../../commen/apis/Api_config";
import { workflowApi, dataRoomApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import axios from "axios";

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
                `/Diskus/signatureviewer?documentID=${encodeURIComponent(
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
  saveSignatureDocument,
  status,
  sendDocumentData
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
              saveSignatureDocument,
              status,
              sendDocumentData
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
                  saveWorkflow_success(response.data.responseResult, "", true)
                );
                dispatch(
                  addUpdateFieldValueApi(
                    updateFieldValueData,
                    navigate,
                    t,
                    addAnnoatationofFilesAttachment,
                    saveSignatureDocument,
                    status,
                    sendDocumentData
                  )
                );
              } else {
                setOpenAddParticipentModal(false);
                dispatch(
                  saveWorkflow_success(response.data.responseResult, "", false)
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
                    saveSignatureDocument,
                    status,
                    sendDocumentData
                  )
                );
                dispatch(
                  saveWorkflow_success(response.data.responseResult, "", true)
                );
              } else {
                setOpenAddParticipentModal(false);
                dispatch(
                  saveWorkflow_success(response.data.responseResult, "", false)
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

const getWorkFlowByWorkFlowIdwApi = (Data, navigate, t, route) => {
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
          dispatch(getWorkFlowByWorkFlowIdwApi(Data, navigate, t, route));
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
                  "",
                  false
                )
              );

              try {
                let workfFlowId =
                  response.data.responseResult.workFlow.workFlow.pK_WorkFlow_ID;
                let creatorID =
                  response.data.responseResult.workFlow.workFlow.creatorID;
                let newData = { FK_WorkFlow_ID: Number(workfFlowId) };
                dispatch(
                  getAllFieldsByWorkflowIdApi(
                    newData,
                    navigate,
                    t,
                    Data,
                    creatorID,
                    route
                  )
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
              dispatch(getWorkFlowByFlodID_fail(""));
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
  saveSignatureDocument,
  status,
  sendDocumentData,
  UpdateActorBundle
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
              saveSignatureDocument,
              status,
              sendDocumentData,
              UpdateActorBundle
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
              if (Number(status) === 3) {
                dispatch(
                  addUpdateSignatureFileAnnotationApi(
                    navigate,
                    t,
                    addAnnoatationofFilesAttachment,

                    UpdateActorBundle
                  )
                );
              } else {
                dispatch(
                  addAnnoationSignatrueFlow(
                    navigate,
                    t,
                    addAnnoatationofFilesAttachment,
                    saveSignatureDocument,
                    status,
                    sendDocumentData,
                    UpdateActorBundle
                  )
                );
              }

              dispatch(
                addUpdateFieldValue_success(
                  response.data.responseResult,
                  "",
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

const saveSignatureDocumentApi = (
  Data,
  navigate,
  t,
  status,
  sendDocumentData
) => {
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
          dispatch(
            saveSignatureDocumentApi(Data, navigate, t, sendDocumentData)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveSignatureDocument_01".toLowerCase()
                )
            ) {
              if (Number(status) === 2) {
                console.log({ status }, "statusstatusValue");

                dispatch(sendDocumentIdApi(sendDocumentData, navigate, t));
              } else {
                dispatch(
                  saveSignatureDocument_success(
                    response.data.responseResult,
                    ""
                  )
                );
              }
              console.log({ status }, "statusstatusValue");
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
                  "DataRoom_DataRoomManager_SaveSignatureDocument_03".toLowerCase()
                )
            ) {
              dispatch(saveSignatureDocument_fail(t("File-not-exist")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveSignatureDocument_04".toLowerCase()
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
                  "DataRoom_DataRoomManager_SaveSignatureDocument_04".toLowerCase()
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
                getAnnotationDataRoom_success(response.data.responseResult, "")
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
  saveSignatureDocument,
  status,
  sendDocumentData,
  UpdateActorBundle
) => {
  console.log(status, "statusstatusstatus");
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
            addAnnoationSignatrueFlow(
              navigate,
              t,
              Data,
              saveSignatureDocument,
              status,
              sendDocumentData,
              UpdateActorBundle
            )
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
              if (Number(status) === 3) {
                dispatch(
                  UpdateActorBundleStatusApi(navigate, t, UpdateActorBundle)
                );
              } else {
                dispatch(
                  saveSignatureDocumentApi(
                    saveSignatureDocument,
                    navigate,
                    t,
                    status,
                    sendDocumentData
                  )
                );
              }

              dispatch(
                addAnnotationDataRoom_success(
                  response.data.responseResult,
                  "",
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
              if (Number(status) === 3) {
                dispatch(
                  UpdateActorBundleStatusApi(navigate, t, UpdateActorBundle)
                );
              } else {
                console.log(status, "statusstatusstatusstatusstatusstatus");
                dispatch(
                  saveSignatureDocumentApi(
                    saveSignatureDocument,
                    navigate,
                    t,
                    status,
                    sendDocumentData
                  )
                );
              }
              dispatch(
                addAnnotationDataRoom_success(
                  response.data.responseResult,
                  "",
                  true
                )
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

const getAllFieldsByWorkflowIdApi = (
  newData,
  navigate,
  t,
  Data,
  creatorID,
  route
) => {
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
          dispatch(
            getAllFieldsByWorkflowIdApi(
              newData,
              navigate,
              t,
              Data,
              creatorID,
              route
            )
          );
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
                  "",
                  false
                )
              );
              if (route && Number(route) === 1) {
                let Data2 = {
                  FileID: Number(Data.FileID),
                  UserID: Number(localStorage.getItem("userID")),
                  OrganizationID: Number(
                    localStorage.getItem("organizationID")
                  ),
                  CreatorID: Number(creatorID),
                };
                dispatch(getSignatureFileAnnotationApi(navigate, t, Data2));
              } else {
                let Data2 = {
                  FileID: Number(Data.FileID),
                  UserID: Number(localStorage.getItem("userID")),
                  OrganizationID: Number(
                    localStorage.getItem("organizationID")
                  ),
                };
                dispatch(getAnnoationSignatrueFlow(navigate, t, Data2));
              }
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
              dispatch(getAllFieldsByWorkflowId_fail(""));
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
              dispatch(
                sendDocument_success(
                  response.data.responseResult,
                  t("Saved-successfully")
                )
              );
              window.close();
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SendDocument_02".toLowerCase()
                )
            ) {
              dispatch(sendDocument_fail(t("Failed-to-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SendDocument_03".toLowerCase()
                )
            ) {
              dispatch(sendDocument_fail(t("Something-went-wrong")));
            } else {
              dispatch(sendDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(sendDocument_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(sendDocument_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(sendDocument_fail(t("Something-went-wrong")));
      });
  };
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
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatureFlowDocumentsForCreatorWithFilters_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllSignaturesDocumentsforCreator_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatureFlowDocumentsForCreatorWithFilters_02".toLowerCase()
                )
            ) {
              dispatch(getAllSignaturesDocumentsforCreator_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatureFlowDocumentsForCreatorWithFilters_03".toLowerCase()
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

const getAllPendingApprovalsStats_init = () => {
  return {
    type: actions.GETALLPENDINGAPPROVALSTATS_INIT,
  };
};
const getAllPendingApprovalsStats_success = (response, message, loader) => {
  return {
    type: actions.GETALLPENDINGAPPROVALSTATS_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const getAllPendingApprovalsStats_fail = (message) => {
  return {
    type: actions.GETALLPENDINGAPPROVALSTATS_FAIL,
    message: message,
  };
};

const getAllPendingApprovalsStatsApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllPendingApprovalsStats_init());
    let form = new FormData();
    form.append("RequestMethod", GetAllPendingForApprovalStatsRM.RequestMethod);

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
          dispatch(getAllPendingApprovalsStatsApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllPendingForApprovalStats_01".toLowerCase()
                )
            ) {
              await dispatch(
                getAllPendingApprovalsStats_success(
                  response.data.responseResult,
                  "",
                  true
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllPendingForApprovalStats_02".toLowerCase()
                )
            ) {
              dispatch(getAllPendingApprovalsStats_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllPendingForApprovalStats_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllPendingApprovalsStats_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllPendingApprovalsStats_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllPendingApprovalsStats_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(getAllPendingApprovalsStats_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllPendingApprovalsStats_fail(t("Something-went-wrong")));
      });
  };
};

const getAllPendingApprovalsSignatures_init = () => {
  return {
    type: actions.GETALLPENDINGAPPROVALSIGNATURES_INIT,
  };
};
const getAllPendingApprovalsSignatures_success = (response, message) => {
  return {
    type: actions.GETALLPENDINGAPPROVALSIGNATURES_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllPendingApprovalsSignatures_fail = (message) => {
  return {
    type: actions.GETALLPENDINGAPPROVALSIGNATURES_FAIL,
    message: message,
  };
};

const getAllPendingApprovalsSignaturesApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllPendingApprovalsSignatures_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      ListOfPendingForApprovalSignaturesRM.RequestMethod
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
          dispatch(getAllPendingApprovalsSignaturesApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ListOfPendingForApprovalSignatures_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllPendingApprovalsSignatures_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ListOfPendingForApprovalSignatures_02".toLowerCase()
                )
            ) {
              dispatch(getAllPendingApprovalsSignatures_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ListOfPendingForApprovalSignatures_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllPendingApprovalsSignatures_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllPendingApprovalsSignatures_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllPendingApprovalsSignatures_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getAllPendingApprovalsSignatures_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAllPendingApprovalsSignatures_fail(t("Something-went-wrong"))
        );
      });
  };
};

const getAllPendingApprovalStatus_init = () => {
  return {
    type: actions.GETPENDINGAPPROVALSTATUSFORSIGNATUREFLOW_INIT,
  };
};

const getAllPendingApprovalStatus_success = (response, message, loader) => {
  return {
    type: actions.GETPENDINGAPPROVALSTATUSFORSIGNATUREFLOW_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const getAllPendingApprovalStatus_fail = (message) => {
  return {
    type: actions.GETPENDINGAPPROVALSTATUSFORSIGNATUREFLOW_FAIL,
    message: message,
  };
};

const getAllPendingApprovalStatusApi = (navigate, t, Data, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllPendingApprovalStatus_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetPendingApprovalStatusforSignatureFlowRM.RequestMethod
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
          dispatch(getAllPendingApprovalStatusApi(navigate, t, Data, flag));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetPendingApprovalStatusesForSignatureFlow_01".toLowerCase()
                )
            ) {
              let loaderFlag = Number(flag) === 1 ? true : false;

              dispatch(
                getAllPendingApprovalStatus_success(
                  response.data.responseResult,
                  "",
                  loaderFlag
                )
              );
              console.log(
                Data.IsCreator,
                "isCreatorisCreatorisCreatorisCreator"
              );
              if (Data.IsCreator) {
                let Data = {
                  sRow: 0,
                  Length: 10,
                  SentOnSort: 0,
                  StatusIDs: [],
                  TitleSort: 0,
                };
                await dispatch(
                  getAllSignaturesDocumentsforCreatorApi(navigate, t, Data)
                );
              } else {
                let Data2 = { sRow: 0, Length: 10 };
                console.log(Data, "handleScrollhandleScrollhandleScroll");
                await dispatch(
                  getAllPendingApprovalsSignaturesApi(navigate, t, Data2)
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetPendingApprovalStatusesForSignatureFlow_02".toLowerCase()
                )
            ) {
              dispatch(getAllPendingApprovalStatus_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetPendingApprovalStatusesForSignatureFlow_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllPendingApprovalStatus_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllPendingApprovalStatus_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllPendingApprovalStatus_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(getAllPendingApprovalStatus_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllPendingApprovalStatus_fail(t("Something-went-wrong")));
      });
  };
};
const declineReason_init = () => {
  return {
    type: actions.DECLINE_REASON_INIT,
  };
};
const declineReason_success = (response, message) => {
  return {
    type: actions.DECLINE_REASON_SUCCESS,
    response: response,
    message: message,
  };
};
const declineReason_fail = (message) => {
  return {
    type: actions.DECLINE_REASON_FAIL,
    message: message,
  };
};

const declineReasonApi = (
  navigate,
  t,
  Data,
  setReasonModal,
  setDeclineConfirmationModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(declineReason_init());
    let form = new FormData();
    form.append("RequestMethod", DeclineReason.RequestMethod);
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
            declineReasonApi(
              navigate,
              t,
              Data,
              setReasonModal,
              setDeclineConfirmationModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeclineReason_01".toLowerCase()
                )
            ) {
              dispatch(
                declineReason_success(
                  response.data.responseResult,
                  t("Saved-successfully")
                )
              );
              setReasonModal(false);
              setDeclineConfirmationModal(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeclineReason_02".toLowerCase()
                )
            ) {
              dispatch(declineReason_fail("Failure-to-save"));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeclineReason_03".toLowerCase()
                )
            ) {
              dispatch(declineReason_fail(t("Something-went-wrong")));
            } else {
              dispatch(declineReason_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(declineReason_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(declineReason_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(declineReason_fail(t("Something-went-wrong")));
      });
  };
};

const deleteSignatureFlowDocument_init = () => {
  return {
    type: actions.DELETE_SIGNATURE_DOCUMENT_INIT,
  };
};
const deleteSignatureFlowDocument_success = (response, message) => {
  return {
    type: actions.DELETE_SIGNATURE_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteSignatureFlowDocument_fail = (message) => {
  return {
    type: actions.DELETE_SIGNATURE_DOCUMENT_FAIL,
    message: message,
  };
};
const deleteSignatureFlowDocumentApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(deleteSignatureFlowDocument_init());
    let form = new FormData();
    form.append("RequestMethod", DeleteSignatureDocumentRM.RequestMethod);
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
          dispatch(deleteSignatureFlowDocumentApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeleteSignatureFlowByWorkFlowId_01".toLowerCase()
                )
            ) {
              dispatch(
                deleteSignatureFlowDocument_success(
                  response.data.responseResult,
                  t("Signature-flow-deleted-successfully")
                )
              );
              let Data2 = {
                sRow: 0,
                Length: 10,
                SentOnSort: 0,
                StatusIDs: [],
                TitleSort: 0,
              };
              dispatch(
                getAllSignaturesDocumentsforCreatorApi(navigate, t, Data2)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeleteSignatureFlowByWorkFlowId_02".toLowerCase()
                )
            ) {
              dispatch(deleteSignatureFlowDocument_fail("WorkFlow-not-exists"));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeleteSignatureFlowByWorkFlowId_03".toLowerCase()
                )
            ) {
              dispatch(deleteSignatureFlowDocument_fail(t("Not-a-creator")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeleteSignatureFlowByWorkFlowId_04".toLowerCase()
                )
            ) {
              dispatch(
                deleteSignatureFlowDocument_fail(t("Only-draft-can-be-deleted"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeleteSignatureFlowByWorkFlowId_05".toLowerCase()
                )
            ) {
              dispatch(deleteSignatureFlowDocument_fail(t("Unsuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_DeleteSignatureFlowByWorkFlowId_06".toLowerCase()
                )
            ) {
              dispatch(
                deleteSignatureFlowDocument_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                deleteSignatureFlowDocument_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              deleteSignatureFlowDocument_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(deleteSignatureFlowDocument_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(deleteSignatureFlowDocument_fail(t("Something-went-wrong")));
      });
  };
};
const getAllSignatoriesStatusWise_init = () => {
  return {
    type: actions.GETALLSIGNATORIESSTATUS_INIT,
  };
};
const getAllSignatoriesStatusWise_success = (response, message) => {
  return {
    type: actions.GETALLSIGNATORIESSTATUS_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllSignatoriesStatusWise_fail = (message) => {
  return {
    type: actions.GETALLSIGNATORIESSTATUS_FAIL,
    message: message,
  };
};
const getAllSignatoriesStatusWise_Api = (
  navigate,
  t,
  Data,
  setSignatoriesList
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllSignatoriesStatusWise_init());
    let form = new FormData();
    form.append("RequestMethod", GetAllSignatoriesStatusRM.RequestMethod);
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
            getAllSignatoriesStatusWise_Api(
              navigate,
              t,
              Data,
              setSignatoriesList
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatoriesStatus_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllSignatoriesStatusWise_success(
                  response.data.responseResult,
                  ""
                )
              );
              setSignatoriesList(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatoriesStatus_02".toLowerCase()
                )
            ) {
              dispatch(getAllSignatoriesStatusWise_fail(t("No-data-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllSignatoriesStatus_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllSignatoriesStatusWise_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllSignatoriesStatusWise_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllSignatoriesStatusWise_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(getAllSignatoriesStatusWise_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllSignatoriesStatusWise_fail(t("Something-went-wrong")));
      });
  };
};

const UpdateActorBundleStatus_init = () => {
  return {
    type: actions.UPDATEACTORBUNDLESTATUS_INIT,
  };
};
const UpdateActorBundleStatus_success = (response, message) => {
  return {
    type: actions.UPDATEACTORBUNDLESTATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const UpdateActorBundleStatus_fail = (message) => {
  return {
    type: actions.UPDATEACTORBUNDLESTATUS_FAIL,
    message: message,
  };
};

const UpdateActorBundleStatusApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(UpdateActorBundleStatus_init());
    let form = new FormData();
    form.append("RequestMethod", updateActorBundleStatusRM.RequestMethod);
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
          dispatch(UpdateActorBundleStatusApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_UpdateActorBundleStatus_01".toLowerCase()
                )
            ) {
              dispatch(
                UpdateActorBundleStatus_success(
                  response.data.responseResult,
                  t("Document-has-been-signed-successfully")
                )
              );
              window.close();
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_UpdateActorBundleStatus_02".toLowerCase()
                )
            ) {
              dispatch(
                UpdateActorBundleStatus_fail(
                  t("Failed-to-update-actor-bundle-status")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_UpdateActorBundleStatus_03".toLowerCase()
                )
            ) {
              dispatch(
                UpdateActorBundleStatus_fail(
                  t("Failed-to-update-bundle-status")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_UpdateActorBundleStatus_04".toLowerCase()
                )
            ) {
              dispatch(UpdateActorBundleStatus_fail(t("Something-went-wrong")));
            } else {
              dispatch(UpdateActorBundleStatus_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(UpdateActorBundleStatus_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(UpdateActorBundleStatus_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(UpdateActorBundleStatus_fail(t("Something-went-wrong")));
      });
  };
};
const getDashbardPendingApprovalData_init = () => {
  return {
    type: actions.GETDASHBOARDPENDINGAPPROVALDATA_INIT,
  };
};
const getDashbardPendingApprovalData_success = (response, message = "") => {
  return {
    type: actions.GETDASHBOARDPENDINGAPPROVALDATA_SUCCESS,
    response: response,
    message: message,
  };
};
const getDashbardPendingApprovalData_fail = (message = "") => {
  return {
    type: actions.GETDASHBOARDPENDINGAPPROVALDATA_FAIL,
    message: message,
  };
};
const getDashbardPendingApprovalDataApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(getDashbardPendingApprovalData_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getDashboardPendingApprovalStatsRM.RequestMethod
    );
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
          dispatch(getDashbardPendingApprovalDataApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetDashboardMinuteAndSignatureApprovals_01".toLowerCase()
                )
            ) {
              dispatch(
                getDashbardPendingApprovalData_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetDashboardMinuteAndSignatureApprovals_02".toLowerCase()
                )
            ) {
              dispatch(getDashbardPendingApprovalData_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetDashboardMinuteAndSignatureApprovals_03".toLowerCase()
                )
            ) {
              dispatch(
                getDashbardPendingApprovalData_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getDashbardPendingApprovalData_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getDashbardPendingApprovalData_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getDashbardPendingApprovalData_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getDashbardPendingApprovalData_fail(t("Something-went-wrong"))
        );
      });
  };
};

// get Signature File Annotation
const getSignatureFileAnnotation_init = () => {
  return {
    type: actions.GETSIGNATUREFILEANNOTATION_INIT,
  };
};

const getSignatureFileAnnotation_success = (
  response,
  message,
  loading = false
) => {
  return {
    type: actions.GETSIGNATUREFILEANNOTATION_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};

const getSignatureFileAnnotation_fail = (message) => {
  return {
    type: actions.GETSIGNATUREFILEANNOTATION_FAIL,
    message: message,
  };
};

const getSignatureFileAnnotationApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(getSignatureFileAnnotation_init());
    let form = new FormData();
    form.append("RequestMethod", GetSignatureFileAnnotationRM.RequestMethod);
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
          dispatch(getSignatureFileAnnotationApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetSignatureFileAnnotation_01".toLowerCase()
                )
            ) {
              dispatch(
                getSignatureFileAnnotation_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetSignatureFileAnnotation_02".toLowerCase()
                )
            ) {
              dispatch(getSignatureFileAnnotation_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetSignatureFileAnnotation_03".toLowerCase()
                )
            ) {
              dispatch(
                getSignatureFileAnnotation_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getSignatureFileAnnotation_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getSignatureFileAnnotation_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(getSignatureFileAnnotation_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getSignatureFileAnnotation_fail(t("Something-went-wrong")));
      });
  };
};

// Add update Signature File Annotation
const addUpdateSignatureFileAnnotation_init = () => {
  return {
    type: actions.ADDUPDATESIGNATUREFILEANNOTATION_INIT,
  };
};
const addUpdateSignatureFileAnnotation_success = (
  response,
  message,
  loading = false
) => {
  return {
    type: actions.ADDUPDATESIGNATUREFILEANNOTATION_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};
const addUpdateSignatureFileAnnotation_fail = (message) => {
  return {
    type: actions.ADDUPDATESIGNATUREFILEANNOTATION_FAIL,
    message: message,
  };
};
const addUpdateSignatureFileAnnotationApi = (
  navigate,
  t,
  Data,
  UpdateActorBundle
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(addUpdateSignatureFileAnnotation_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      AddUpdateSignatureFileAnnotationRM.RequestMethod
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
            addUpdateSignatureFileAnnotationApi(
              navigate,
              t,
              Data,
              UpdateActorBundle
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddUpdateSignatureFileAnnotation_01".toLowerCase()
                )
            ) {
              dispatch(
                UpdateActorBundleStatusApi(navigate, t, UpdateActorBundle)
              );
              dispatch(
                addUpdateSignatureFileAnnotation_success(
                  response.data.responseResult,
                  t("Record-inserted")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddUpdateSignatureFileAnnotation_02".toLowerCase()
                )
            ) {
              dispatch(
                UpdateActorBundleStatusApi(navigate, t, UpdateActorBundle)
              );
              dispatch(
                addUpdateSignatureFileAnnotation_success(
                  response.data.responseResult,
                  t("Record-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddUpdateSignatureFileAnnotation_03".toLowerCase()
                )
            ) {
              dispatch(
                addUpdateSignatureFileAnnotation_fail(t("No-record-inserted"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddUpdateSignatureFileAnnotation_04".toLowerCase()
                )
            ) {
              dispatch(
                addUpdateSignatureFileAnnotation_fail(t("No-record-updated"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddUpdateSignatureFileAnnotation_05".toLowerCase()
                )
            ) {
              dispatch(
                addUpdateSignatureFileAnnotation_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                addUpdateSignatureFileAnnotation_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              addUpdateSignatureFileAnnotation_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            addUpdateSignatureFileAnnotation_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          addUpdateSignatureFileAnnotation_fail(t("Something-went-wrong"))
        );
      });
  };
};

const validateEncryptedMinutesReviewer_init = () => {
  return {
    type: actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_INIT,
  };
};
const validateEncryptedMinutesReviewer_success = (response, message) => {
  return {
    type: actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_SUCCESS,
    response: response,
    message: message,
  };
};

const validateEncryptedMinutesReviewer_fail = (message) => {
  return {
    type: actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_FAIL,
    message: message,
  };
};

const validateEncryptedMinutesReviewer_clear = () => {
  return {
    type: actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_CLEAR,
  };
};

const validateEncryptedMinutesReviewerApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(validateEncryptedMinutesReviewer_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      ValidateEncryptedStringMinuteReviewDataRM.RequestMethod
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
          dispatch(validateEncryptedMinutesReviewerApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ValidateEncryptedStringMinuteReviewData_01".toLowerCase()
                )
            ) {
              dispatch(
                validateEncryptedMinutesReviewer_success(
                  response.data.responseResult,
                  ""
                )
              );
              localStorage.removeItem("reviewMinutesLink");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ValidateEncryptedStringMinuteReviewData_02".toLowerCase()
                )
            ) {
              dispatch(validateEncryptedMinutesReviewer_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ValidateEncryptedStringMinuteReviewData_03".toLowerCase()
                )
            ) {
              dispatch(
                validateEncryptedMinutesReviewer_fail("Something-went-wrong")
              );
            } else {
              dispatch(
                validateEncryptedMinutesReviewer_fail("Something-went-wrong")
              );
            }
          } else {
            dispatch(
              validateEncryptedMinutesReviewer_fail("Something-went-wrong")
            );
          }
        } else {
          dispatch(
            validateEncryptedMinutesReviewer_fail("Something-went-wrong")
          );
        }
      })
      .catch((response) => {
        dispatch(validateEncryptedMinutesReviewer_fail("Something-went-wrong"));
      });
  };
};
const SignatureDocumentReceivedMyMe = (response) => {
  return {
    type: actions.WORKFLOW_SIGNATURE_DOCUMENT_RECEIVED_BY_ME,
    response: response,
  };
};

const SignatureDocumentReceived = (response) => {
  return {
    type: actions.WORKFLOW_SIGNATURE_DOCUMENT_RECEIVED,
    response: response,
  };
};

const SignatureDocumentStatusChange = (response) => {
  return {
    type: actions.SIGNATURE_DOCUMENT_STATUS_CHANGE,
    response: response,
  };
};

const SignatureDocumentActionByMe = (response) => {
  return {
    type: actions.SIGNATURE_DOCUMENT_ACTION_BY_ME,
    response: response,
  };
};
const SignatureDocumentStatusChangeSignees = (response) => {
  return {
    type: actions.SIGNATURE_DOCUMENT_STATUS_CHANGE_FOR_SIGNEES,
    response: response,
  };
};

const validateEncryptedStringSignatureData_init = () => {
  return {
    type: actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_INIT,
  };
};

const validateEncryptedStringSignatureData_success = (response, message) => {
  return {
    type: actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_SUCCESS,
    response: response,
    message: message,
  };
};

const validateEncryptedStringSignatureData_fail = (message) => {
  return {
    type: actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_FAIL,
    message: message,
  };
};

const validateEncryptedStringSignatureData_clear = () => {
  return {
    type: actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_CLEAR,
  };
};

const validateEncryptedStringSignatureDataApi = (Data, navigate, t, value) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(validateEncryptedStringSignatureData_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      ValidateEncryptedStringSignatureDataRM.RequestMethod
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
          dispatch(validateEncryptedStringSignatureDataApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ValidateEncryptedStringSignatureData_01".toLowerCase()
                )
            ) {
              dispatch(
                validateEncryptedStringSignatureData_success(
                  response.data.responseResult,
                  ""
                )
              );
              if (value === 1) {
                window.open(
                  `/Diskus/signeddocument?documentID=${encodeURIComponent(
                    JSON.stringify(response.data.responseResult.data.fileId)
                  )}`,
                  "_blank",
                  "noopener noreferrer"
                );
                localStorage.removeItem("docSignAction");
              } else if (value === 2) {
                window.open(
                  `/Diskus/viewSignDocument?documentID=${encodeURIComponent(
                    JSON.stringify(response.data.responseResult.data.fileId)
                  )}`,
                  "_blank",
                  "noopener noreferrer"
                );
                localStorage.removeItem("docSignedAction");
              } else {
                window.open(
                  `/Diskus/viewSignDocument?documentID=${encodeURIComponent(
                    JSON.stringify(response.data.responseResult.data.fileId)
                  )}`,
                  "_blank",
                  "noopener noreferrer"
                );
                localStorage.removeItem("docSignedCrAction");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ValidateEncryptedStringSignatureData_02".toLowerCase()
                )
            ) {
              dispatch(validateEncryptedStringSignatureData_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ValidateEncryptedStringSignatureData_03".toLowerCase()
                )
            ) {
              dispatch(
                validateEncryptedStringSignatureData_fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                validateEncryptedStringSignatureData_fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              validateEncryptedStringSignatureData_fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            validateEncryptedStringSignatureData_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch(() => {
        dispatch(
          validateEncryptedStringSignatureData_fail(t("Something-went-wrong"))
        );
      });
  };
};

const clearWorkFlowResponseMessage = (response) => {
  return {
    type: actions.CLEAR_RESPONSEMESSAGE_WORKFLOWREDUCER,
    response: response,
  };
};

export {
  SignatureDocumentStatusChangeSignees,
  SignatureDocumentStatusChange,
  SignatureDocumentActionByMe,
  SignatureDocumentReceived,
  SignatureDocumentReceivedMyMe,
  validateEncryptedMinutesReviewer_clear,
  validateEncryptedMinutesReviewerApi,
  addUpdateSignatureFileAnnotationApi,
  getSignatureFileAnnotationApi,
  getDashbardPendingApprovalDataApi,
  UpdateActorBundleStatusApi,
  getAllSignatoriesStatusWise_Api,
  deleteSignatureFlowDocumentApi,
  getAllPendingApprovalStatusApi,
  clearWorkFlowResponseMessage,
  getAllPendingApprovalsStatsApi,
  getAllPendingApprovalsSignaturesApi,
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
  declineReasonApi,
  validateEncryptedStringSignatureDataApi,
};
