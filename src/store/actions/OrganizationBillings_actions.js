import * as actions from "../action_types";
import {
  invoiceandPaymentHistoryRequestMethod,
  payOutStandingRequestMethod,
  getBillingInformationRequestMethod,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";

const getBillingInformation_init = () => {
  return {
    type: actions.GET_BLLINGINFORMATION_INIT,
  };
};
const getBillingInformation_success = (response, message) => {
  return {
    type: actions.GET_BLLINGINFORMATION_SUCCESS,
    response: response,
    message: message,
  };
};
const getBillingInformation_fail = (message) => {
  return {
    type: actions.GET_BLLINGINFORMATION_FAIL,
    message: message,
  };
};

const getBillingInformationapi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(getBillingInformation_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getBillingInformationRequestMethod.RequestMethod
    );
  axiosInstance.post(getAdminURLs,form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getBillingInformationapi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetBillingInformation_01".toLowerCase()
                )
            ) {
              dispatch(
                getBillingInformation_success(
                  response.data.responseResult.billingInfo,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetBillingInformation_02".toLowerCase()
                )
            ) {
              dispatch(getBillingInformation_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetBillingInformation_03".toLowerCase()
                )
            ) {
              dispatch(getBillingInformation_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getBillingInformation_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getBillingInformation_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getBillingInformation_fail(t("Something-went-wrong")));
      });
  };
};

const getPayoutstading_init = () => {
  return {
    type: actions.PAYOUTSTANDING_INIT,
  };
};
const getPayoutstading_success = (response, message) => {
  return {
    type: actions.PAYOUTSTANDING_SUCCESS,
    response: response,
    message: message,
  };
};
const getPayoutstading_fail = (message) => {
  return {
    type: actions.PAYOUTSTANDING_FAIL,
    message: message,
  };
};

const getPayoutStandingInformation = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(getPayoutstading_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", payOutStandingRequestMethod.RequestMethod);
  axiosInstance.post(getAdminURLs,form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getPayoutStandingInformation(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_PayOustanding_01".toLowerCase()
                )
            ) {
              dispatch(
                getPayoutstading_success(
                  response.data.responseResult.invoiceDetails,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_PayOustanding_02".toLowerCase()
                )
            ) {
              dispatch(getPayoutstading_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_PayOustanding_03".toLowerCase()
                )
            ) {
              dispatch(getPayoutstading_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getPayoutstading_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getPayoutstading_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getPayoutstading_fail(t("Something-went-wrong")));
      });
  };
};

const invoiceandpaymenthistory_init = () => {
  return {
    type: actions.INVOICEANDPAYMENTHISTORY_INIT,
  };
};
const invoiceandpaymenthistory_success = (response, message) => {
  return {
    type: actions.INVOICEANDPAYMENTHISTORY_SUCCESS,
    response: response,
    message: message,
  };
};
const invoiceandpaymenthistory_fail = (message) => {
  return {
    type: actions.INVOICEANDPAYMENTHISTORY_FAIL,
    message: message,
  };
};

const invoiceandpaymenthistory = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(invoiceandpaymenthistory_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      invoiceandPaymentHistoryRequestMethod.RequestMethod
    );
  axiosInstance.post(getAdminURLs,form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(invoiceandpaymenthistory(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_InvoicesAndPaymentHistory_01".toLowerCase()
                )
            ) {
              dispatch(
                invoiceandpaymenthistory_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_InvoicesAndPaymentHistory_02".toLowerCase()
                )
            ) {
              dispatch(invoiceandpaymenthistory_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_InvoicesAndPaymentHistory_03".toLowerCase()
                )
            ) {
              dispatch(
                invoiceandpaymenthistory_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(invoiceandpaymenthistory_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(invoiceandpaymenthistory_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(invoiceandpaymenthistory_fail(t("Something-went-wrong")));
      });
  };
};

export {
  getBillingInformationapi,
  getPayoutStandingInformation,
  invoiceandpaymenthistory,
};
