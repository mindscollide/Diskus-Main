import {
  createWorkFlowRM,
  saveWorkFlowRM,
  getWorkFlowByFileIdRM,
} from "../../commen/apis/Api_config";
import { workflowApi } from "../../commen/apis/Api_ends_points";
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

const saveWorkflowApi = (Data, navigate, t) => {
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
          dispatch(saveWorkflowApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_01".toLowerCase()
                )
            ) {
              dispatch(
                saveWorkflow_success(
                  response.data.responseResult,
                  t("Created-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_02".toLowerCase()
                )
            ) {
              dispatch(saveWorkflow_fail(t("Dataroom-api-call-error")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveWorkFlow_03".toLowerCase()
                )
            ) {
              dispatch(createWorkflow_fail(t("Failed-to-save-file")));
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
                  t("Created-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetWorkFlowByFileID_02".toLowerCase()
                )
            ) {
              dispatch(getWorkFlowByFlodID_fail(t("Dataroom-api-call-error")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetWorkFlowByFileID_03".toLowerCase()
                )
            ) {
              dispatch(getWorkFlowByFlodID_fail(t("Failed-to-save-file")));
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
export { createWorkflowApi, saveWorkflowApi, getWorkFlowByWorkFlowIdwApi };
