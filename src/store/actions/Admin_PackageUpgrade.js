import * as actions from "../action_types";
import axios from "axios";
import {
  GetSubscriptionPackagesByOrganizationID,
  updateSubscriptionPackage,
} from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

const packageUpgradeInit = () => {
  return {
    type: actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_INIT,
  };
};

const cleareMessage = () => {
  return {
    type: actions.ADMIN_CLEARE_MESSAGE,
  };
};

const packageUpgradeSuccess = (response, message) => {
  return {
    type: actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_SUCCESS,
    response: response,
    message: message,
  };
};

const packageUpgradeFail = (message) => {
  return {
    type: actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_FAIL,
    message: message,
  };
};

const packagesforUpgrade = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = { OrganizationID: organizationID };
  return (dispatch) => {
    dispatch(packageUpgradeInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetSubscriptionPackagesByOrganizationID.RequestMethod
    );
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
          await dispatch(RefreshToken(t));
          await dispatch(packagesforUpgrade(t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetSubscriptionPackagesByOrganizationID_01"
            ) {
              dispatch(
                packageUpgradeSuccess(
                  response.data.responseResult.subscriptionPackages,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetSubscriptionPackagesByOrganizationID_02"
            ) {
              dispatch(packageUpgradeFail(t("Record-found")));
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetSubscriptionPackagesByOrganizationID_03"
            ) {
              dispatch(packageUpgradeFail(t("Something-went-wrong")));
            } else {
              dispatch(packageUpgradeFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(packageUpgradeFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(packageUpgradeFail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(packageUpgradeFail(t("Something-went-wrong")));
      });
  };
};
const updateSubscribePackageInit = () => {
  return {
    type: actions.UPGRADESUBSRIPTIONPACKAGE_INIT,
  };
};
const updateSubscribePackageSuccess = (response, message) => {
  console.log("GetSubscriptionPackage", response, message);
  return {
    type: actions.UPGRADESUBSRIPTIONPACKAGE_SUCCESS,
    response: response,
    message: message,
  };
};
const updateSubscribePackageFail = (message) => {
  return {
    type: actions.UPGRADESUBSRIPTIONPACKAGE_FAIL,
    message: message,
  };
};

const updateSubscribePackage = (ID, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = {
    OrganizationID: organizationID,
    SelectedPackageID: JSON.parse(ID),
  };
  return (dispatch) => {
    dispatch(updateSubscribePackageInit());
    let form = new FormData();
    form.append("RequestMethod", updateSubscriptionPackage.RequestMethod);
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
          await dispatch(RefreshToken(t));
          await dispatch(updateSubscribePackage(ID, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_UpgradeOrganizationSubscription_01"
            ) {
              dispatch(
                updateSubscribePackageSuccess(
                  response.data.responseResult,
                  t("Organization-subscription-update")
                )
              );
              navigate("/Diskus/Admin/PackageDetail");
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_UpgradeOrganizationSubscription_02"
            ) {
              dispatch(
                updateSubscribePackageFail(
                  t("Organization-subscription-not-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_UpgradeOrganizationSubscription_03"
            ) {
              dispatch(
                updateSubscribePackageFail(
                  t("Organization-subscription-not-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_UpgradeOrganizationSubscription_04"
            ) {
              dispatch(
                updateSubscribePackageFail(
                  t("Organization-subscription-not-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_UpgradeOrganizationSubscription_05"
            ) {
              dispatch(
                updateSubscribePackageFail(
                  t("Organization-subscription-not-updated")
                )
              );
            }
          }
        } else if (response.data.responseCode === 400) {
          dispatch(
            updateSubscribePackageFail(
              t("Organization-subscription-not-updated")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          updateSubscribePackageFail(t("Organization-subscription-not-updated"))
        );
      });
  };
};
export { packagesforUpgrade, updateSubscribePackage, cleareMessage };
