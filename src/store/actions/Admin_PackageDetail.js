import axios from "axios";
import { GetOrganizationSeletedPackageByOrganizationID, subscriptiondetailsRequestMethod } from "../../commen/apis/Api_config";
import { getAdminURLs, authenticationApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

const packageDetailInit = () => {
  return {
    type: actions.GETSUBSCRIBEORGANIZATIONPACKAGE_INIT,
  };
};

const packageDetailSuccess = (response, message) => {
  return {
    type: actions.GETSUBSCRIBEORGANIZATIONPACKAGE_SUCCESS,
    response: response,
    message: message,
  };
};

const packageDetailFail = (message) => {
  return {
    type: actions.GETSUBSCRIBEORGANIZATIONPACKAGE_FAIL,
    message: message,
  };
};

const getSubscribeOrganizationPackage = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = { OrganizationID: organizationID };
  return (dispatch) => {
    dispatch(packageDetailInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetOrganizationSeletedPackageByOrganizationID.RequestMethod
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
        console.log("getSubscribeOrganizationPackage", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(getSubscribeOrganizationPackage(navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_01"
            ) {
              dispatch(
                packageDetailSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_02"
            ) {
              dispatch(
                packageDetailFail(
                  t("No-records-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_03"
            ) {
              dispatch(
                packageDetailFail(
                  t("No-records-found")
                )
              );
            }
          } else {
            dispatch(
              packageDetailFail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            packageDetailFail(
              t("No-records-found")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          packageDetailFail(
            t("Something-went-wrong")
          )
        );
      });
  };
};

const getSubscriptionDetailPaymentDetails_init = () => {
  return {
    type: actions.GETSUBSCRIPTIONDETAIL_INIT
  }
}
const getSubscriptionDetailPaymentDetails_success = (response, message) => {
  return {
    type: actions.GETSUBSCRIPTIONDETAIL_SUCCESS,
    response: response,
    message: message
  }
}
const getSubscriptionDetailPaymentDetails_fail = (message) => {
  return {
    type: actions.GETSUBSCRIPTIONDETAIL_FAIL,
    message: message
  }
}

const getSubscriptionPaymentDetail = (navigate, TenureID, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let Data = { OrganizationID: organizationID, TenureOfSuscriptionID: TenureID }
  return (dispatch) => {
    dispatch(getSubscriptionDetailPaymentDetails_init());
    let form = new FormData();
    form.append("RequestMethod", subscriptiondetailsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(getSubscriptionPaymentDetail(navigate, TenureID, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_SignUpManager_SubscriptionDetail_01".toLowerCase())) {
              dispatch(getSubscriptionDetailPaymentDetails_success(response.data.responseResult, t("Data-available")))
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_SignUpManager_SubscriptionDetail_02".toLowerCase())) {
              dispatch(getSubscriptionDetailPaymentDetails_fail(t("No-data-available")))
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_SignUpManager_SubscriptionDetail_03".toLowerCase())) {
              dispatch(getSubscriptionDetailPaymentDetails_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getSubscriptionDetailPaymentDetails_fail(t("Something-went-wrong")))
          }
        }
      })
      .catch((response) => {
        dispatch(getSubscriptionDetailPaymentDetails_fail(t("Something-went-wrong"))
        );
      });
  };
}

export { getSubscribeOrganizationPackage, getSubscriptionPaymentDetail };
