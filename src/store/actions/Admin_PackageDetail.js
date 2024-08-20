import axios from "axios";
import {
  GetOrganizationSeletedPackageByOrganizationID,
  paymentCompleteMethod,
  subscriptiondetailsRequestMethod,
  subscriptionPackageUpgradeAmount,
  subscriptionPackageUpgradePayment,
} from "../../commen/apis/Api_config";
import {
  getAdminURLs,
  authenticationApi,
} from "../../commen/apis/Api_ends_points";
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getSubscribeOrganizationPackage(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_01"
            ) {
              dispatch(
                packageDetailSuccess(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_02"
            ) {
              dispatch(packageDetailFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_03"
            ) {
              dispatch(packageDetailFail(t("No-records-found")));
            }
          } else {
            dispatch(packageDetailFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(packageDetailFail(t("No-records-found")));
        }
      })
      .catch((response) => {
        dispatch(packageDetailFail(t("Something-went-wrong")));
      });
  };
};

const getSubscriptionDetailPaymentDetails_init = () => {
  return {
    type: actions.GETSUBSCRIPTIONDETAIL_INIT,
  };
};
const getSubscriptionDetailPaymentDetails_success = (response, message) => {
  return {
    type: actions.GETSUBSCRIPTIONDETAIL_SUCCESS,
    response: response,
    message: message,
  };
};
const getSubscriptionDetailPaymentDetails_fail = (message) => {
  return {
    type: actions.GETSUBSCRIPTIONDETAIL_FAIL,
    message: message,
  };
};

const getSubscriptionPaymentDetail = (navigate, TenureID, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let Data = {
    OrganizationID: organizationID,
    TenureOfSuscriptionID: TenureID,
  };
  return (dispatch) => {
    dispatch(getSubscriptionDetailPaymentDetails_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      subscriptiondetailsRequestMethod.RequestMethod
    );
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(getSubscriptionPaymentDetail(navigate, TenureID, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SubscriptionDetail_01".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionDetailPaymentDetails_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SubscriptionDetail_02".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionDetailPaymentDetails_fail(t("No-data-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SubscriptionDetail_03".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionDetailPaymentDetails_fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getSubscriptionDetailPaymentDetails_fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            getSubscriptionDetailPaymentDetails_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getSubscriptionDetailPaymentDetails_fail(t("Something-went-wrong"))
        );
      });
  };
};

const getSubscriptionUpgradeAmountInfo_init = () => {
  return {
    type: actions.GETSUBSCRIPTIONUPGRADEAMOUNTDETAIL_INIT,
  };
};
const getSubscriptionUpgradeAmountInfo_success = (response, message) => {
  return {
    type: actions.GETSUBSCRIPTIONUPGRADEAMOUNTDETAIL_SUCCESS,
    response: response,
    message: message,
  };
};
const getSubscriptionUpgradeAmountInfo_fail = (message) => {
  return {
    type: actions.GETSUBSCRIPTIONUPGRADEAMOUNTDETAIL_FAIL,
    message: message,
  };
};
const getSubscriptionUpgradeAmountInfoApi = (
  navigate,
  packageID,
  tenureID,
  t
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let Data = {
    PackageID: packageID,
    OrganizationID: organizationID,
    TenureOfSuscriptionID: tenureID,
  };
  return (dispatch) => {
    dispatch(getSubscriptionUpgradeAmountInfo_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      subscriptionPackageUpgradeAmount.RequestMethod
    );
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getSubscriptionUpgradeAmountInfoApi(
              navigate,
              packageID,
              tenureID,
              t
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetPackageUpgradeTotalAmount_01".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradeAmountInfo_success(
                  response.data.responseResult,
                  ""
                )
              );
              localStorage.setItem("PackageIDforPayment", Data.PackageID);
              localStorage.setItem(
                "PaymentAmount",
                response.data.responseResult.totalBill
              );
              navigate("/Admin/paymentform");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetPackageUpgradeTotalAmount_02".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradeAmountInfo_fail(t("No-data-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetPackageUpgradeTotalAmount_03".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradeAmountInfo_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getSubscriptionUpgradeAmountInfo_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getSubscriptionUpgradeAmountInfo_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getSubscriptionUpgradeAmountInfo_fail(t("Something-went-wrong"))
        );
      });
  };
};

const getSubscriptionUpgradePaymentComplete_init = () => {
  return {
    type: actions.GETSUBSCRIPTIONUPGRADEPAYMENTCOMPLETE_INIT,
  };
};
const getSubscriptionUpgradePaymentComplete_success = (response, message) => {
  return {
    type: actions.GETSUBSCRIPTIONUPGRADEPAYMENTCOMPLETE_SUCCESS,
    response: response,
    message: message,
  };
};
const getSubscriptionUpgradePaymentComplete_fail = (message) => {
  return {
    type: actions.GETSUBSCRIPTIONUPGRADEPAYMENTCOMPLETE_SUCCESS,
    message: message,
  };
};
const getSubscriptionUpgradePaymentCompleteApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let PaymentAmount = JSON.parse(localStorage.getItem("PaymentAmount"));
  let TenureOfSuscriptionID = JSON.parse(
    localStorage.getItem("TenureOfSuscriptionID")
  );
  let PackageID = JSON.parse(localStorage.getItem("PackageIDforPayment"));
  let Data = {
    PackageID: PackageID,
    OrganizationID: organizationID,
    TenureOfSuscriptionID: TenureOfSuscriptionID,
    PaidAmount: PaymentAmount,
    PaymentMethodID: 1,
    MethodDetails: "None",
  };
  return (dispatch) => {
    dispatch(getSubscriptionUpgradePaymentComplete_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      subscriptionPackageUpgradePayment.RequestMethod
    );
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(getSubscriptionUpgradePaymentCompleteApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PackageUpgradePaymentComplete_01".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradePaymentComplete_success(
                  response.data.responseResult,
                  t("Payment-complete-successfully")
                )
              );
              navigate("/Admin/PackageDetail");
              localStorage.removeItem("PaymentAmount");
              localStorage.removeItem("TenureOfSuscriptionID");
              localStorage.removeItem("PackageIDforPayment");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PackageUpgradePaymentComplete_02".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradePaymentComplete_fail(
                  t("Failed-to-update-organization-invoice")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PackageUpgradePaymentComplete_03".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradePaymentComplete_fail(
                  t("Failed-to-update-organziation-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PackageUpgradePaymentComplete_04".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradePaymentComplete_fail(
                  t("Failed-to-insert-organization-invoice")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PackageUpgradePaymentComplete_05".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradePaymentComplete_fail(
                  t("Failed-to-insert-organization-invoice-payment")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PackageUpgradePaymentComplete_06".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradePaymentComplete_fail(
                  t("Failed-to-updated-organization-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PackageUpgradePaymentComplete_07".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionUpgradePaymentComplete_fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getSubscriptionUpgradePaymentComplete_fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getSubscriptionUpgradePaymentComplete_fail(
                t("Something-went-wrong")
              )
            );
          }
        }
      })
      .catch((response) => {
        dispatch(
          getSubscriptionUpgradePaymentComplete_fail(t("Something-went-wrong"))
        );
      });
  };
};

const subscriptionPayment_init = () => {
  return {
    type: actions.PAYMENTCOMPLETE_INIT,
  };
};
const subscriptionPayment_success = (response, message) => {
  return {
    type: actions.PAYMENTCOMPLETE_SUCCESS,
    response: response,
    message: message,
  };
};
const subscriptionPayment_fail = (message) => {
  return {
    type: actions.PAYMENTCOMPLETE_FAIL,
    message: message,
  };
};

const subscriptionPaymentApi = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let Data = {
    OrganizationInvoiceID: data?.InvoiceID,
    OrganizationID: organizationID,
    PaymentMethodID: 1,
    MethodDetails: "None",
    OrganizationSubscriptionID: data?.OrganizationSubscriptionID,
    PaidAmount: data?.TotalBill,
  };
  return (dispatch) => {
    dispatch(subscriptionPayment_init());
    let form = new FormData();
    form.append("RequestMethod", paymentCompleteMethod.RequestMethod);
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(subscriptionPaymentApi(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentComplete_01".toLowerCase()
                )
            ) {
              dispatch(
                subscriptionPayment_success(
                  response.data.responseResult,
                  t("Payment-complete-successfully")
                )
              );
              navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentComplete_02".toLowerCase()
                )
            ) {
              dispatch(
                subscriptionPayment_fail(
                  t("Failed-to-update-organization-invoice")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentComplete_03".toLowerCase()
                )
            ) {
              dispatch(
                subscriptionPayment_fail(
                  t("Failed-to-update-organziation-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentComplete_04".toLowerCase()
                )
            ) {
              dispatch(
                subscriptionPayment_fail(
                  t("Failed-to-insert-organization-invoice-payment")
                )
              );
            } else {
              dispatch(subscriptionPayment_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(subscriptionPayment_fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        dispatch(subscriptionPayment_fail(t("Something-went-wrong")));
      });
  };
};

export {
  getSubscribeOrganizationPackage,
  subscriptionPaymentApi,
  getSubscriptionPaymentDetail,
  getSubscriptionUpgradePaymentCompleteApi,
  getSubscriptionUpgradeAmountInfoApi,
};
