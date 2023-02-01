import axios from "axios";
import { cancelSubscription } from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";

const cancelSubInit = () => {
  return {
    type: actions.CANCELSUBCRIPTIONPACKAGE_INIT
  };
};

const cancelSubSuccess = (response, message) => {
  return {
    type: actions.CANCELSUBCRIPTIONPACKAGE_SUCCESS,
    response: response,
    message: message,
  };
};

const cancelSubFail = (message) => {
  return {
    type: actions.CANCELSUBCRIPTIONPACKAGE_FAIL,
    message: message,
  };
};

const CancelSubscriptionPackage = (susbcriptionID, cancelReson, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = {
    OrganizationID: organizationID,
    SubscriptionStatusID: JSON.parse(susbcriptionID),
    CancellationReason: cancelReson
  }
  return (dispatch) => {
    dispatch(cancelSubInit())
    let form = new FormData();
    form.append("RequestMethod", cancelSubscription.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("CancelSubscriptionPackage", response);
        if (response.data.responseCode === 417) {
          // dispatch(RefreshToken(props))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse")
            if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_CancelOrganizationSubscription_01") {
              dispatch(cancelSubSuccess(response.data.responseResult, t("Organization-subscription-cancelled")))
            } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_CancelOrganizationSubscription_02") {
              dispatch(cancelSubSuccess(response.data.responseResult, t("Organization-subscription-not-cancelled")))
            } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_CancelOrganizationSubscription_03") {
              dispatch(cancelSubFail(response.data.responseResult, t("Organization-subscription-not-cancelled-exception")))
            } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_CancelOrganizationSubscription_04") {
              dispatch(cancelSubSuccess(response.data.responseResult, t("Invalid-subscription-status-provided-for-cancellation")))
            }
          }
        } else if (response.data.responseCode === 400) {
          dispatch(cancelSubFail(response.data.responseResult, t("Organization-subscription-not-cancelled-exception")))
        } else {
          dispatch(cancelSubFail(response.data.responseResult, t("Organization-subscription-not-cancelled-exception")))
        }
      })
      .catch((response) => {
        dispatch(cancelSubFail(response.data.responseResult, t("Organization-subscription-not-cancelled-exception")))
      });
  };
}


export { CancelSubscriptionPackage }