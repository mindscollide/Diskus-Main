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

const customerInfoOrganizationDetails = (t) => {
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
          await dispatch(RefreshToken(t));
          dispatch(customerInfoOrganizationDetails(t));
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
                  t("Record-found")
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

const updateCustomerInformationInit = (response, message) => {
  return {
    type: actions.ADMIN_UPDATE_CUSTOMERINFORMATION_INIT,
    response: response,
    message: message,
  };
};

const updateCustomerInformationSuccess = (response, message) => {
  return {
    type: actions.ADMIN_UPDATE_CUSTOMERINFORMATION_SUCCESS,
    response: response,
    message: message,
  };
};

const updateCustomerInformationFail = (response, message) => {
  return {
    type: actions.ADMIN_UPDATE_CUSTOMERINFORMATION_FAIL,
    response: response,
    message: message,
  };
};

const updateCustomerOrganizationProfileDetail = (updateData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let data = {
    updateData
  };
  console.log(data, "updateData");
  return (dispatch) => {
    dispatch(updateCustomerInformationInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      updateCustomerOrganizationProfile.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationProfile_01"
            ) {
              dispatch(
                updateCustomerInformationSuccess(
                  t("Record-updated-successfully")
                )
              );
              dispatch(customerInfoOrganizationDetails(t));
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationProfile_02"
            ) {
              dispatch(
                updateCustomerInformationSuccess(t("No-Records-updated"))
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationProfile_03"
            ) {
              dispatch(
                updateCustomerInformationFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(updateCustomerInformationFail(t("something-went-worng")));
          }
        } else if (response.data.responseCode === 400) {
          dispatch(updateCustomerInformationFail(t("Something-went-wrong")));
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
