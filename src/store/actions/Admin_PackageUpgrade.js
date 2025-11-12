import * as actions from "../action_types";
import {
  GetSubscriptionPackagesByOrganizationID,
  updateSubscriptionPackage,
} from "../../commen/apis/Api_config";
import {
  authenticationApi,
  getAdminURLs,
} from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

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

const packagesforUpgrade = (navigate, t) => {
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
    axiosInstance
      .post(authenticationApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(packagesforUpgrade(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "ERM_AuthService_SignUpManager_GetSubscriptionPackagesForUpgrade_01"
            ) {
              navigate("/Admin/UpgradePackage");
              dispatch(
                packageUpgradeSuccess(
                  response.data.responseResult.subscriptionPackages,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "ERM_AuthService_SignUpManager_GetSubscriptionPackagesForUpgrade_02"
            ) {
              dispatch(packageUpgradeFail(""));
            } else if (
              response.data.responseResult.responseMessage ===
              "ERM_AuthService_SignUpManager_GetSubscriptionPackagesForUpgrade_03"
            ) {
              navigate("/Admin/EmptyState");

              dispatch(packageUpgradeFail(t("No-record-found")));
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

const updateSubscribePackage = (navigate, ID, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let tenureOfSuscriptionID = JSON.parse(
    localStorage.getItem("TenureOfSuscriptionID")
  );
  let data = {
    OrganizationID: organizationID,
    SelectedPackageID: JSON.parse(ID),
    TenureOfSuscriptionID: JSON.parse(tenureOfSuscriptionID),
  };
  return (dispatch) => {
    dispatch(updateSubscribePackageInit());
    let form = new FormData();
    form.append("RequestMethod", updateSubscriptionPackage.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(getAdminURLs, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateSubscribePackage(navigate, ID, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_UpgradeOrganizationSubscription_01".toLowerCase()
                )
            ) {
              dispatch(
                updateSubscribePackageSuccess(
                  response.data.responseResult,
                  t("Organization-subscription-update")
                )
              );
              navigate("/Admin/PackageDetail");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_UpgradeOrganizationSubscription_02".toLowerCase()
                )
            ) {
              dispatch(
                updateSubscribePackageFail(
                  t("Organization-subscription-not-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_UpgradeOrganizationSubscription_03".toLowerCase()
                )
            ) {
              dispatch(
                updateSubscribePackageFail(
                  t("Organization-subscription-not-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_UpgradeOrganizationSubscription_04".toLowerCase()
                )
            ) {
              dispatch(
                updateSubscribePackageFail(
                  t("Organization-subscription-not-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_UpgradeOrganizationSubscription_05".toLowerCase()
                )
            ) {
              dispatch(updateSubscribePackageFail(t("Something-went-wrong")));
            } else {
              dispatch(updateSubscribePackageFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(updateSubscribePackageFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateSubscribePackageFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updateSubscribePackageFail(t("Something-went-wrong")));
      });
  };
};
export { packagesforUpgrade, updateSubscribePackage, cleareMessage };
