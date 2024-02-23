import {
  createWorkFlowRM,
  saveWorkFlowRM,
  getWorkFlowByFileIdRM,
  addUpdateFieldValueRM,
  getAllFieldsByWorkFlowIdRM,
  sendDocumentRM,
  saveSignatureDocumentRM,
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
const createWorkflowApi = (Data, navigate, t) => {
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
          dispatch(createWorkflowApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_CreateSignatureFlow_01".toLowerCase()
                )
            ) {
              dispatch(
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

const saveWorkflow_success = (response, message) => {
  return {
    type: actions.SAVE_WORKFLOW_SUCCESS,
    response: response,
    message: message,
  };
};

const saveWorkflow_fail = (message) => {
  return {
    type: actions.SAVE_WORKFLOW_FAIL,
    message: message,
  };
};

const saveWorkflowApi = (Data, navigate, t, setOpenAddParticipentModal) => {
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
            saveWorkflowApi(Data, navigate, t, setOpenAddParticipentModal)
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
              setOpenAddParticipentModal(false);
              dispatch(
                saveWorkflow_success(
                  response.data.responseResult,
                  t("Saved-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_02".toLowerCase()
                )
            ) {
              dispatch(saveWorkflow_fail(t("Failed-to-save-workflow")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_03".toLowerCase()
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

const getWorkFlowByFlodID_success = (response, message) => {
  return {
    type: actions.GETWORKFLOWBYFILEID_SUCCESS,
    response: response,
    message: message,
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
                  t("Data-available")
                )
              );
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

const addUpdateFieldValue_success = (response, message) => {
  return {
    type: actions.ADD_UPDATE_FIELD_VALUE_SUCCESS,
    response: response,
    message: message,
  };
};

const addUpdateFieldValue_fail = (message) => {
  return {
    type: actions.ADD_UPDATE_FIELD_VALUE_FAIL,
    message: message,
  };
};

const addUpdateFieldValueApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return new Promise((resolve, reject) => {
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
            dispatch(addUpdateFieldValueApi(Data, navigate, t));
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_01".toLowerCase()
                  )
              ) {
                resolve(response.data.responseResult);
                dispatch(
                  addUpdateFieldValue_success(
                    response.data.responseResult,
                    t("Saved-successfully")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_02".toLowerCase()
                  )
              ) {
                reject(response.data.responseResult.responseMessage);
                dispatch(addUpdateFieldValue_fail(t("invalid-data-provided")));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_03".toLowerCase()
                  )
              ) {
                reject(response.data.responseResult.responseMessage);

                dispatch(addUpdateFieldValue_fail(t("Failed-to-save")));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_AddUpdateFieldValue_04".toLowerCase()
                  )
              ) {
                dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
                reject(response.data.responseResult.responseMessage);
              } else {
                dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
                reject(response.data.responseResult.responseMessage);
              }
            } else {
              dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
              reject(response.data.responseResult.responseMessage);
            }
          } else {
            dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
            reject(response.data.responseResult.responseMessage);
          }
        })
        .catch((response) => {
          dispatch(addUpdateFieldValue_fail(t("Something-went-wrong")));
          reject(response.data.responseResult.responseMessage);
        });
    };
  });
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
  return new Promise((resolve, reject) => {
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
                resolve(response.data.responseResult);
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
                reject(response.data.responseResult.responseMessage);
                dispatch(saveSignatureDocument_fail(t("Invalid-data")));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_SaveSignatureDocument_03".toLowerCase()
                  )
              ) {
                reject(response.data.responseResult.responseMessage);

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
                reject(response.data.responseResult.responseMessage);
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_SaveSignatureDocument_05".toLowerCase()
                  )
              ) {
                dispatch(
                  saveSignatureDocument_fail(t("Invalid-file-extension"))
                );
                reject(response.data.responseResult.responseMessage);
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
                reject(response.data.responseResult.responseMessage);
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_SaveSignatureDocument_07".toLowerCase()
                  )
              ) {
                dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
                reject(response.data.responseResult.responseMessage);
              } else {
                dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
                reject(response.data.responseResult.responseMessage);
              }
            } else {
              dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
              reject(response.data.responseResult.responseMessage);
            }
          } else {
            dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
            reject(response.data.responseResult.responseMessage);
          }
        })
        .catch((response) => {
          dispatch(saveSignatureDocument_fail(t("Something-went-wrong")));
          reject(response.data.responseResult.responseMessage);
        });
    };
  });
};

const getAllFieldsByWorkflowId_init = () => {
  return {
    type: actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_INIT,
  };
};

const getAllFieldsByWorkflowId_success = (response, message) => {
  return {
    type: actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllFieldsByWorkflowId_fail = (message) => {
  return {
    type: actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_FAIL,
    message: message,
  };
};

const getAllFieldsByWorkflowIdApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return new Promise((resolve, reject) => {
    return (dispatch) => {
      dispatch(getAllFieldsByWorkflowId_init());
      let form = new FormData();
      form.append("RequestMethod", getAllFieldsByWorkFlowIdRM.RequestMethod);
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
            dispatch(getAllFieldsByWorkflowIdApi(Data, navigate, t));
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_GetAllFieldsByWorkFlowID_01".toLowerCase()
                  )
              ) {
                resolve(response.data.responseResult);
                dispatch(
                  getAllFieldsByWorkflowId_success(
                    response.data.responseResult,
                    t("Data-available")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_GetAllFieldsByWorkFlowID_02".toLowerCase()
                  )
              ) {
                reject(response.data.responseResult.responseMessage);
                dispatch(getAllFieldsByWorkflowId_fail(t("Np-data-available")));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_GetAllFieldsByWorkFlowID_03".toLowerCase()
                  )
              ) {
                reject(response.data.responseResult.responseMessage);

                dispatch(
                  getAllFieldsByWorkflowId_fail(t("Something-went-wrong"))
                );
              } else {
                dispatch(
                  getAllFieldsByWorkflowId_fail(t("Something-went-wrong"))
                );
                reject(response.data.responseResult.responseMessage);
              }
            } else {
              dispatch(
                getAllFieldsByWorkflowId_fail(t("Something-went-wrong"))
              );
              reject(response.data.responseResult.responseMessage);
            }
          } else {
            dispatch(getAllFieldsByWorkflowId_fail(t("Something-went-wrong")));
            reject(response.data.responseResult.responseMessage);
          }
        })
        .catch((response) => {
          dispatch(getAllFieldsByWorkflowId_fail(t("Something-went-wrong")));
          reject(response.data.responseResult.responseMessage);
        });
    };
  });
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
export {
  createWorkflowApi,
  saveWorkflowApi,
  getWorkFlowByWorkFlowIdwApi,
  addUpdateFieldValueApi,
  saveSignatureDocumentApi,
  getAllFieldsByWorkflowIdApi,
  sendDocumentIdApi,
};
