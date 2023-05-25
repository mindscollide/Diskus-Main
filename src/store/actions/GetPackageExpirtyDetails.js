import axios from "axios";
import { IsPackageExpiryDetail } from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from './Auth_action'

const getExpiryDetailsInit = () => {
  return {
    type: actions.GETPACKAGEEXPIRYDETAILS_INIT,
  };
};

const getExpiryDetailsSuccess = (response, message) => {
  console.log("isExpiry color", response)
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
  let data = { OrganizationID: JSON.parse(id) };
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getExpiryDetailsInit());
    let form = new FormData();
    form.append("RequestMethod", IsPackageExpiryDetail.RequestMethod);
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(getPackageExpiryDetail(navigate, id, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackageExpiryDetails_01".toLowerCase()
                )
            ) {
              dispatch(
                getExpiryDetailFail(
                  t("You-are-not-an-admin-Please-contact-support")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackageExpiryDetails_02".toLowerCase()
                )
            ) {
              await localStorage.setItem(
                "isAlert",
                response.data.responseResult.isAlert
              );
              await localStorage.setItem(
                "color",
                response.data.responseResult.color
              );
              await localStorage.setItem(
                "dateOfExpiry",
                response.data.responseResult.dateOfExpiry
              );
              await localStorage.setItem(
                "remainingDays",
                response.data.responseResult.remainingDays
              );
              dispatch(
                getExpiryDetailsSuccess(
                  response.data.responseResult,
                  t("Remaining-days-of-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackageExpiryDetails_03".toLowerCase()
                )
            ) {
              await localStorage.setItem(
                "isAlert",
                response.data.responseResult.isAlert
              );
              await localStorage.setItem(
                "color",
                response.data.responseResult.color
              );
              await localStorage.setItem(
                "dateOfExpiry",
                response.data.responseResult.dateOfExpiry
              );
              await localStorage.setItem(
                "remainingDays",
                response.data.responseResult.remainingDays
              );
              dispatch(getExpiryDetailFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackageExpiryDetails_04".toLowerCase()
                )
            ) {
              await localStorage.setItem(
                "isAlert",
                response.data.responseResult.isAlert
              );
              await localStorage.setItem(
                "color",
                response.data.responseResult.color
              );
              await localStorage.setItem(
                "dateOfExpiry",
                response.data.responseResult.dateOfExpiry
              );
              await localStorage.setItem(
                "remainingDays",
                response.data.responseResult.remainingDays
              );
              dispatch(
                getExpiryDetailFail(t("Enter-an-valid-organization-id"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackageExpiryDetails_05".toLowerCase()
                )
            ) {
              dispatch(getExpiryDetailFail(t("User-email-doesnt-exists")));
            }
          } else {
            dispatch(getExpiryDetailFail(t("User-email-doesnt-exists")));
          }
        }
        console.log("response", response);
      })
      .catch((response) => {
        dispatch(getExpiryDetailFail(t("User-email-doesnt-exists")));
        console.log("response", response);
      });
  };
};
export { getPackageExpiryDetail };
