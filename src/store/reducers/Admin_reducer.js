import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  OrganisationCheck: false,
  EmailCheck: false,
  AddUserResponse: null,
  EditUserResponse: null,
  ShowNotification: false,
  isError: true,
  TotalUserListsData: [],
  AllOrganizationUserList: [],
  OrganizationCheckSpinner: false,
  EmailCheckSpinner: false,
  AllOrganizationMeetingLoader: false,
  AllOrganizationMeeting: null,
  AllOrganizationResponseMessage: "",
  DeleteOrganizationMeetingResponse: null,
  DeleteOrganizationMessageResponseMessage: "",
  UpdateOrganizationMeetingResponse: null,
  UpdateOrganizationMessageResponseMessage: "",
  AllMeetingsStatus: [],
  revokeResponseMessege: "",
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    //action Case For Admin-AddUser
    case actions.ADMIN_ADDUSER_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.ADMIN_ADDUSER_SUCCESS:
      return {
        ...state,
        Loading: false,
        AddUserResponse: action.response,
        ResponseMessage: action.message,
      };

    case actions.ADMIN_ADDUSER_FAIL:
      console.log("ADMIN_ADDUSER_FAIL", action.message);
      return {
        ...state,
        Loading: false,
        AddUserResponse: null,
        ResponseMessage: action.message,
      };

    //action Case For Admin-AllMeeting
    case actions.ADMIN_ALLMEETING_INIT:
      return {
        ...state,
        Loading: true,
        AllOrganizationResponseMessage: "",
      };

    case actions.ADMIN_ALLMEETING_SUCCESS:
      console.log(action, "statestatemeeting");
      return {
        ...state,
        Loading: false,
        AllOrganizationMeeting: action.response,
        AllOrganizationResponseMessage: action.message,
      };

    case actions.ADMIN_ALLMEETING_FAIL:
      console.log(action, "statestatemeeting");
      return {
        ...state,
        Loading: false,
        AllOrganizationResponseMessage: action.message,
      };

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
      return {
        ...state,
        Loading: true,
      };

    case actions.ADMIN_EDITUSER_SUCCESS:
      return {
        ...state,
        Loading: false,
        EditUserResponse: action.response,
        ResponseMessage: action.message,
      };

    case actions.ADMIN_EDITUSER_FAIL:
      return {
        ...state,
        Loading: false,
        EditUserResponse: null,
        ResponseMessage: action.message,
      };

    //action Case For Admin-Invoice
    case actions.ADMIN_INVOICE_INIT:
      return {};

    case actions.ADMIN_INVOICE_SUCCESS:
      return {};

    case actions.ADMIN_INVOICE_FAIL:
      return {};

    //action Case For Admin-Organization
    case actions.ADMIN_ORGANIZATION_INIT:
      return {
        ...state,
        OrganizationCheckSpinner: true,
      };

    case actions.ADMIN_ORGANIZATION_SUCCESS:
      console.log("check", action);
      return {
        ...state,
        ResponseMessage: action.message,
        OrganisationCheck: action.response,
        OrganizationCheckSpinner: false,
      };

    case actions.ADMIN_ORGANIZATION_FAIL:
      console.log("check", action);

      return {
        ...state,
        ResponseMessage: action.message,
        OrganisationCheck: action.response,
        OrganizationCheckSpinner: false,
      };
    //action Case For Admin-Email
    case actions.ADMIN_EMAILVARIFICATION_INIT:
      return {
        ...state,
        EmailCheckSpinner: true,
      };

    case actions.ADMIN_EMAILVARIFICATION_SUCCESS:
      console.log("check", action);
      return {
        ...state,
        ResponseMessage: action.message,
        EmailCheck: action.response,
        EmailCheckSpinner: false,
      };

    case actions.ADMIN_EMAILVARIFICATION_FAIL:
      return {
        ...state,
        ResponseMessage: action.message,
        EmailCheck: action.response,
        EmailCheckSpinner: false,
      };
    // actionc ase for admin meeting update
    case actions.UPDATEORGANIZTIONMEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATEORGANIZTIONMEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UpdateOrganizationMeetingResponse: action.response,
        UpdateOrganizationMessageResponseMessage: action.message,
      };
    }
    case actions.UPDATEORGANIZTIONMEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateOrganizationMeetingResponse: null,
        UpdateOrganizationMessageResponseMessage: action.message,
      };
    }
    // action case for adming meeting delete
    case actions.DELETEORGANIZATIONMEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETEORGANIZATIONMEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        DeleteOrganizationMeetingResponse: action.response,
        DeleteOrganizationMessageResponseMessage: action.message,
      };
    }
    case actions.DELETEORGANIZATIONMEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        DeleteOrganizationMeetingResponse: null,
        DeleteOrganizationMessageResponseMessage: action.message,
      };
    }
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
    //action Case For OrganizationUserListStatistics
    case actions.ADMIN_USERLISTSTATIST_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.ADMIN_USERLISTSTATIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        TotalUserListsData: action.response,
        // ResponseMessage: action.message,
      };

    case actions.ADMIN_USERLISTSTATIST_FAIL:
      return {
        ...state,
        Loading: false,
        TotalUserListsData: [],
        ResponseMessage: action.message,
      };
    case actions.ADMIN_CLEARE_MESSAGE:
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
        UpdateOrganizationMessageResponseMessage: "",
        DeleteOrganizationMessageResponseMessage: "",
        AllOrganizationResponseMessage: "",
        revokeResponseMessege: "",
      };
    case actions.ADMIN_ALLUSERLIST_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.ADMIN_ALLUSERLIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        AllOrganizationUserList: action.response,
        ResponseMessage: action.message,
      };
    case actions.ADMIN_ALLUSERLIST_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    case actions.ADMIN_EDITORGANIZATIONUSER_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.ADMIN_EDITORGANIZATIONUSER_SUCCESS:
      return {
        ...state,
        // Loading: false,
        ResponseMessage: action.message,
      };
    case actions.ADMIN_EDITORGANIZATIONUSER_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    case actions.ADMIN_DELETEORGANIZATIONUSER_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.ADMIN_DELETEORGANIZATIONUSER_SUCCESS:
      return {
        ...state,
        // Loading: false,
        ResponseMessage: action.message,
      };
    case actions.ADMIN_DELETEORGANIZATIONUSER_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    case actions.ADMIN_MEETINGSTATUS_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.ADMIN_MEETINGSTATUS_SUCCESS:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        AllMeetingsStatus: action.response,
      };
    case actions.ADMIN_MEETINGSTATUS_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    case actions.ADD_USER_LOADER:
      return {
        ...state,
        Loading: action.response,
      };
    case actions.ADD_EMAIL_CHECK_FALSE:
      return {
        ...state,
        EmailCheck: action.response,
      };

    case actions.REVOKE_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.REVOKE_SUCCESS:
      return{
        ...state,
        Loading: false,
        revokeResponseMessege: action.message
      };

    case actions.REVOKE_FAIL:
      return{
        ...state,
        Loading: false,
        revokeResponseMessege: action.message
      }

    default:
      return { ...state };
  }
};

export default adminReducer;
