import * as actions from "../action_types";

const invoiceInit = (response, message) => {
  return {
    type: actions.ADMIN_INVOICE_INIT,
    response: response,
    message: message,
  };
};

const invoiceSuccess = (response, message) => {
  return {
    type: actions.ADMIN_INVOICE_SUCCESS,
    response: response,
    message: message,
  };
};

const invoiceFail = (response, message) => {
  return {
    type: actions.ADMIN_INVOICE_FAIL,
    response: response,
    message: message,
  };
};
