import * as actions from "../action_types";
import axios from "axios";
import { GetSubscriptionPackagesByOrganizationID } from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

const packageUpgradeInit = () => {
  return {
    type: actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_INIT,
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
  let data = { OrganizationID: organizationID }
  return (dispatch) => {
    dispatch(packageUpgradeInit())
    let form = new FormData();
    form.append("RequestMethod", GetSubscriptionPackagesByOrganizationID.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then((response) => {
        if (response.data.responseCode === 417) {
          // dispatch(RefreshToken(props))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_GetSubscriptionPackagesByOrganizationID_01") {
              dispatch(packageUpgradeSuccess(response.data.responseResult.subscriptionPackages, t("Record-found")))
            } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_GetSubscriptionPackagesByOrganizationID_02") {
              dispatch(packageUpgradeFail(t("Record-found")))
            } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_GetSubscriptionPackagesByOrganizationID_03") {
              dispatch(packageUpgradeFail(t("Record-found")))
            }
          }
        } else if (response.data.responseCode === 400) {
          dispatch(packageUpgradeFail(t("Record-found")))
        }
      })
      .catch((response) => { dispatch(packageUpgradeFail(response)) })
  }
}

export { packagesforUpgrade }
