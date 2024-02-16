import { createWorkFlowRM } from "../../commen/apis/Api_config";
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

export { createWorkflowApi };
