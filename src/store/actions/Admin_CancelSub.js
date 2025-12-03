// import { type } from "@testing-library/user-event/dist/types/utility";
import {
  cancelSubscription,
  revokeProcess,
} from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

const cancelSubInit = () => {
  return {
    type: actions.CANCELSUBCRIPTIONPACKAGE_INIT,
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

const CancelSubscriptionPackage = (
  navigate,
  susbcriptionID,
  cancelReson,
  t
) => {
  
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = {
    OrganizationID: organizationID,
    SubscriptionStatusID: JSON.parse(susbcriptionID),
    CancellationReason: cancelReson,
  };
  return (dispatch) => {
    dispatch(cancelSubInit());
    let form = new FormData();
    form.append("RequestMethod", cancelSubscription.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance.post( getAdminURLs, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            CancelSubscriptionPackage(navigate, susbcriptionID, cancelReson, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_CancelOrganizationSubscription_01"
            ) {
              dispatch(
                cancelSubSuccess(
                  response.data.responseResult,
                  t("Organization-subscription-cancelled")
                )
              );
              if (susbcriptionID === 6) {
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_CancelOrganizationSubscription_02"
            ) {
              dispatch(
                cancelSubSuccess(
                  response.data.responseResult,
                  t("Organization-subscription-not-cancelled")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_CancelOrganizationSubscription_03"
            ) {
              dispatch(
                cancelSubFail(
                  response.data.responseResult,
                  t("Organization-subscription-not-cancelled-exception")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_CancelOrganizationSubscription_04"
            ) {
              dispatch(
                cancelSubSuccess(
                  response.data.responseResult,
                  t("Invalid-subscription-status-provided-for-cancellation")
                )
              );
            }
          }
        } else if (response.data.responseCode === 400) {
          dispatch(
            cancelSubFail(
              response.data.responseResult,
              t("Organization-subscription-not-cancelled-exception")
            )
          );
        } else {
          dispatch(
            cancelSubFail(
              response.data.responseResult,
              t("Organization-subscription-not-cancelled-exception")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          cancelSubFail(
            response.data.responseResult,
            t("Organization-subscription-not-cancelled-exception")
          )
        );
      });
  };
};

const revokeinit = () => {
  return {
    type: actions.REVOKE_INIT,
  };
};

const revokesuccess = (message) => {
  return {
    type: actions.REVOKE_SUCCESS,
    message: message,
  };
};

const revokefail = (message) => {
  return {
    type: actions.REVOKE_FAIL,
    message: message,
  };
};

const revokeprocess = (navigate, t) => {
  
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = {
    OrganizationID: organizationID,
  };
  return (dispatch) => {
    dispatch(revokeinit());
    let form = new FormData();
    form.append("RequestMethod", revokeProcess.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance.post( getAdminURLs, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(revokeprocess(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RevokeCancelation_02".toLowerCase()
                )
            ) {
              localStorage.setItem("revokeCancellation", false);
              dispatch(revokesuccess(t("Updated-successfully")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RevokeCancelation_03".toLowerCase()
                )
            ) {
              dispatch(revokefail(t("Failed-to-revoke-organization")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RevokeCancelation_04".toLowerCase()
                )
            ) {
              dispatch(revokefail(t("Something-went-wrong")));
            }
          } else {
            dispatch(revokefail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        dispatch(revokefail(t("Something-went-wrong")));
      });
  };
};

const adminClearMessege = () => {
  return {
    type: actions.ADMIN_CLEARE_MESSAGE,
  };
};

export { CancelSubscriptionPackage, revokeprocess, adminClearMessege };
