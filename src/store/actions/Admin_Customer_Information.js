import axios from "axios";
import {
  CustomerInfoOrganization,
  updateCustomerOrganizationProfile,
} from "../../commen/apis/Api_config";
import { settingApi, settingURL } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const customerInformationInit = (response, message) => {
  return {
    type: actions.ADMIN_CUSTOMERINFORMATION_INIT,
    response: response,
    message: message,
  };
};

const customerInformationSuccess = (response, message) => {
  return {
    type: actions.ADMIN_CUSTOMERINFORMATION_SUCCESS,
    response: response,
    message: message,
  };
};

const customerInformationFail = (response, message) => {
  return {
    type: actions.ADMIN_CUSTOMERINFORMATION_FAIL,
    response: response,
    message: message,
  };
};

const customerInfoOrganizationDetails = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    OrganizationID: JSON.parse(localStorage.getItem("organizationID")),
  };
  return (dispatch) => {
    dispatch(customerInformationInit());
    let form = new FormData();
    form.append("RequestMethod", CustomerInfoOrganization.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(customerInfoOrganizationDetails(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetOrganizationDetails_01".toLowerCase()
                )
            ) {
              await dispatch(
                customerInformationSuccess(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetOrganizationDetails_02".toLowerCase()
                )
            ) {
              await dispatch(customerInformationFail(t("No-records-found")));
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetOrganizationDetails_03".toLowerCase()
                )
            ) {
              await dispatch(
                customerInformationFail(t("Something-went-wrong"))
              );
              await dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(customerInformationFail(t("Something-went-wrong")));
            await dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(customerInformationFail(t("Something-went-wrong")));
          await dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(customerInformationFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

const updateCustomerInformationInit = () => {
  return {
    type: actions.ADMIN_UPDATE_CUSTOMERINFORMATION_INIT,
  };
};

const updateCustomerInformationSuccess = (message) => {
  return {
    type: actions.ADMIN_UPDATE_CUSTOMERINFORMATION_SUCCESS,
    message: message,
  };
};

const updateCustomerInformationFail = (message) => {
  return {
    type: actions.ADMIN_UPDATE_CUSTOMERINFORMATION_FAIL,
    message: message,
  };
};

const updateCustomerOrganizationProfileDetail = (navigate, updateData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(updateCustomerInformationInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      updateCustomerOrganizationProfile.RequestMethod
    );
    form.append("RequestData", JSON.stringify(updateData));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            updateCustomerOrganizationProfileDetail(navigate, updateData, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationProfile_01"
            ) {
              dispatch(
                updateCustomerInformationSuccess(
                  t("Record-updated-successfully")
                )
              );
              dispatch(customerInfoOrganizationDetails(navigate, t));
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationProfile_02"
            ) {
              dispatch(updateCustomerInformationFail(t("No-records-updated")));
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationProfile_03"
            ) {
              dispatch(
                updateCustomerInformationFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(updateCustomerInformationFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateCustomerInformationFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updateCustomerInformationFail(t("Something-went-wrong")));
      });
  };
};

export {
  customerInfoOrganizationDetails,
  updateCustomerOrganizationProfileDetail,
};
