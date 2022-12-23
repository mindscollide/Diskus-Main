import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  ShowNotification: false,
  isError: true,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    //action Case For Admin-AddUser
    case actions.ADMIN_ADDUSER_INIT:
      return {};

    case actions.ADMIN_ADDUSER_SUCCESS:
      return {};

    case actions.ADMIN_ADDUSER_FAIL:
      return {};

    //action Case For Admin-AllMeeting
    case actions.ADMIN_ALLMEETING_INIT:
      return {};

    case actions.ADMIN_ALLMEETING_SUCCESS:
      return {};

    case actions.ADMIN_ALLMEETING_FAIL:
      return {};

    //action Case For Admin-CancelSub
    case actions.ADMIN_CANCELSUB_INIT:
      return {};

    case actions.ADMIN_CANCELSUB_SUCCESS:
      return {};

    case actions.ADMIN_CANCELSUB_FAIL:
      return {};

    //action Case For Admin-CustomerInformation
    case actions.ADMIN_CUSTOMERINFORMATION_INIT:
      return {};

    case actions.ADMIN_CUSTOMERINFORMATION_SUCCESS:
      return {};

    case actions.ADMIN_CUSTOMERINFORMATION_FAIL:
      return {};

    //action Case For Admin-EDITUSER
    case actions.ADMIN_EDITUSER_INIT:
      return {};

    case actions.ADMIN_EDITUSER_SUCCESS:
      return {};

    case actions.ADMIN_EDITUSER_FAIL:
      return {};

    //action Case For Admin-Invoice
    case actions.ADMIN_INVOICE_INIT:
      return {};

    case actions.ADMIN_INVOICE_SUCCESS:
      return {};

    case actions.ADMIN_INVOICE_FAIL:
      return {};

    //action Case For Admin-Organization
    case actions.ADMIN_ORGANIZATION_INIT:
      return {};

    case actions.ADMIN_ORGANIZATION_SUCCESS:
      return {};

    case actions.ADMIN_ORGANIZATION_FAIL:
      return {};

    //action Case For Admin-Packagedetail
    case actions.ADMIN_PACKAGEDETAIL_INIT:
      return {};

    case actions.ADMIN_PACKAGEDETAIL_SUCCESS:
      return {};

    case actions.ADMIN_PACKAGEDETAIL_FAIL:
      return {};

    //action Case For Admin-PackageUpgrade
    case actions.ADMIN_PACKAGEUPGRADE_INIT:
      return {};

    case actions.ADMIN_PACKAGEUPGRADE_SUCCESS:
      return {};

    case actions.ADMIN_PACKAGEUPGRADE_FAIL:
      return {};

    //action Case For Admin-PayOutstanding
    case actions.ADMIN_PAYOUTSTANDING_INIT:
      return {};

    case actions.ADMIN_PAYOUTSTANDING_SUCCESS:
      return {};

    case actions.ADMIN_PAYOUTSTANDING_FAIL:
      return {};

    //action Case For Admin-Summary
    case actions.ADMIN_SUMMARY_INIT:
      return {};

    case actions.ADMIN_SUMMARY_SUCCESS:
      return {};

    case actions.ADMIN_SUMMARY_FAIL:
      return {};

    default:
      return { ...state };
  }
};

export default adminReducer;
