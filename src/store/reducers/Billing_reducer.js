/**
 * @file Billing_reducer.js
 * @description Redux reducer for the `billing` slice. Manages organisation
 * billing information: current bill details, pay-outstanding operations,
 * and invoice/payment history.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean}     Loading                      - Global loading flag.
 * @property {string}      ResponseMessage              - Last response message.
 * @property {object|null} getBillInformation           - Current billing information.
 * @property {object|null} getPayoutStanding            - Pay-outstanding result.
 * @property {object|null} getInvoiceAndPaymentHistory  - Invoice and payment history data.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  getBillInformation: null,
  getPayoutStanding: null,
  getInvoiceAndPaymentHistory: null,
};

/**
 * Reducer for the `billing` slice.
 * Handles fetching billing info, processing pay-outstanding, and retrieving
 * invoice and payment history.
 *
 * @param {object} state  - Current billing state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
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
      };
    }
    case actions.GET_BLLINGINFORMATION_FAIL: {
      return {
        ...state,
        Loading: false,
        getBillInformation: null,
        ResponseMessage: action.message,
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
      };
    }
    case actions.PAYOUTSTANDING_FAIL: {
      return {
        ...state,
        Loading: false,
        getPayoutStanding: null,
        ResponseMessage: action.message,
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
      };
    }

    case actions.INVOICEANDPAYMENTHISTORY_FAIL: {
      return {
        ...state,
        Loading: false,
        getInvoiceAndPaymentHistory: null,
        ResponseMessage: action.message,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default OrganizationBillingReducer;
