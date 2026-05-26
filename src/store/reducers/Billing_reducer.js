import * as actions from "../action_types";
const initialState = {
  Loading: false,
  ResponseMessage: "",
  errorSeverity: null,
  getBillInformation: null,
  getPayoutStanding: null,
  getInvoiceAndPaymentHistory: null,
};

const OrganizationBillingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_BLLINGINFORMATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_BLLINGINFORMATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getBillInformation: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.GET_BLLINGINFORMATION_FAIL: {
      return {
        ...state,
        Loading: false,
        getBillInformation: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.PAYOUTSTANDING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.PAYOUTSTANDING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getPayoutStanding: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.PAYOUTSTANDING_FAIL: {
      return {
        ...state,
        Loading: false,
        getPayoutStanding: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.INVOICEANDPAYMENTHISTORY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.INVOICEANDPAYMENTHISTORY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getInvoiceAndPaymentHistory: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }

    case actions.INVOICEANDPAYMENTHISTORY_FAIL: {
      return {
        ...state,
        Loading: false,
        getInvoiceAndPaymentHistory: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default OrganizationBillingReducer;
