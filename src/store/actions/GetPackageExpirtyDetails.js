
import { IsPackageExpiryDetail } from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

const getExpiryDetailsInit = () => {
  return {
    type: actions.GETPACKAGEEXPIRYDETAILS_INIT,
  };
};

const getExpiryDetailsSuccess = (response, message) => {
  return {
    type: actions.GETPACKAGEEXPIRYDETAILS_SUCCESS,
    response: response,
    message: message,
  };
};
const getExpiryDetailFail = (message) => {
  return {
    type: actions.GETPACKAGEEXPIRYDETAILS_FAIL,
    message: message,
  };
};

const getPackageExpiryDetail = (navigate, id, t) => {
  const data = { OrganizationID: JSON.parse(id) };
  const token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    dispatch(getExpiryDetailsInit());
    const form = new FormData();
    form.append("RequestMethod", IsPackageExpiryDetail.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    try {
      const response = await axiosInstance.post(getAdminURLs, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(getPackageExpiryDetail(navigate, id, t));
      }

      if (
        response.data.responseCode !== 200 ||
        !response.data.responseResult.isExecuted
      ) {
        dispatch(getExpiryDetailFail(t("Something-went-wrong")));
        return;
      }

      const result = response.data.responseResult;
      const message = result.responseMessage.toLowerCase();
      await handleResponseMessage(result, dispatch, t, message);
    } catch (error) {
      console.error("Error fetching package expiry details:", error);
      dispatch(getExpiryDetailFail(t("Something-went-wrong")));
    }
  };
};

const handleResponseMessage = async (result, dispatch, t, message) => {
  try {
    if (
      message.includes(
        "admin_adminservicemanager_getorganizationsubscriptionexpirydetails_01"
      )
    ) {
      await Promise.all([
        localStorage.setItem("dateOfExpiry", result.dateOfExpiry),
        localStorage.setItem(
          "isExtensionAvailable",
          result.isExtensionAvailable
        ),
        localStorage.setItem("remainingDays", result.remainingDays),
        localStorage.setItem("isAlert", result.isAlert ?? false),
      ]);
      dispatch(getExpiryDetailsSuccess(t("successful")));
    } else if (
      message.includes(
        "admin_adminservicemanager_getorganizationsubscriptionexpirydetails_02"
      )
    ) {
      dispatch(getExpiryDetailsSuccess(result, t("Invalid-data-provided")));
    } else if (
      message.includes(
        "admin_adminservicemanager_getorganizationsubscriptionexpirydetails_03"
      )
    ) {
      dispatch(getExpiryDetailFail(t("Subscription-not-found")));
    } else if (
      message.includes(
        "admin_adminservicemanager_getorganizationsubscriptionexpirydetails_04"
      )
    ) {
      dispatch(getExpiryDetailFail(t("Something-went-wrong")));
    } else {
      dispatch(getExpiryDetailFail(t("Something-went-wrong")));
    }
  } catch (error) {
    console.error("Error handling response message:", error);
    dispatch(getExpiryDetailFail(t("Something-went-wrong")));
  }
};
export { getPackageExpiryDetail };
