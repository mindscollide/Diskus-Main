import * as actions from "../action_types";

const initialState = {
  Loading: false,
  EmailValidationResponse: null,
  EmailValidationResponseMessage: "",
  EnterPasswordResponse: null,
  EnterPasswordResponseMessage: "",
  VerifyOTPEmailResponse: null,
  VerifyOTPEmailResponseMessage: "",
  CreatePasswordResponse: null,
  CreatePasswordResponseMessage: "",
  OrganizationCreateResponse: null,
  OrganizationCreateResponseMessage: "",
  GetSelectedPacakgeDetails: null,
  GetSelectedPackageResponseMessage: "",
  ChangeUserPasswordResponse: null,
  ChangeUserPasswordResponseMessage: "",
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.EMAILVALIDATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.LOADER: {
      return {
        ...state,
        Loading: action.response,
      };
    }
    case actions.RESEND_OTP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.RESEND_OTP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        message: action.response.responseMessage,
      };
    }

    case actions.RESEND_OTP_FAIL: {
      return {
        ...state,
        Loading: false,
        message: action.response.responseMessage,
      };
    }
    case actions.EMAILVALIDATION_SUCCESS: {
      localStorage.setItem("userID", action.response.userID);
      return {
        ...state,
        Loading: false,
        EmailValidationResponse: action.response,
        EmailValidationResponseMessage: action.message,
      };
    }
    case actions.EMAILVALIDATION_FAIL: {
      return {
        ...state,
        Loading: false,
        EmailValidationResponseMessage: action.message,
      };
    }
    case actions.PASSWORDVALIDATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.PASSWORDVALIDATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        EnterPasswordResponse: action.response,
        EnterPasswordResponseMessage: action.message,
      };
    }
    case actions.PASSWORDVALIDATION_FAIL: {
      return {
        ...state,
        Loading: false,
        EnterPasswordResponse: null,
        EnterPasswordResponseMessage: action.message,
      };
    }
    case actions.VERIFYOTPFOREMAIL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VERIFYOTPFOREMAIL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        VerifyOTPEmailResponse: action.response,
        VerifyOTPEmailResponseMessage: action.message,
      };
    }
    case actions.VERIFYOTPFOREMAIL_FAIL: {
      return {
        ...state,
        Loading: false,
        VerifyOTPEmailResponse: null,
        VerifyOTPEmailResponseMessage: action.message,
      };
    }
    case actions.PASSWORDCREATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.PASSWORDCREATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        CreatePasswordResponse: action.response,
        CreatePasswordResponseMessage: action.message,
      };
    }
    case actions.PASSWORDCREATION_FAIL: {
      return {
        ...state,
        Loading: false,
        CreatePasswordResponse: null,
        CreatePasswordResponseMessage: action.message,
      };
    }
    case actions.SIGNUPORGANIZATION_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.SIGNUPORGANIZATION_SUCCESS:
      return {
        ...state,
        Loading: false,
        OrganizationCreateResponse: action.response,
        OrganizationCreateResponseMessage: action.message,
      };
    case actions.SIGNUPORGANIZATION_FAIL:
      return {
        ...state,
        Loading: false,
        OrganizationCreateResponse: null,
        OrganizationCreateResponseMessage: action.message,
      };
    case actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_SUCCESS: {
      console.log(action, "action");
      return {
        ...state,
        Loading: false,
        GetSelectedPacakgeDetails: action.response,
        GetSelectedPackageResponseMessage: action.message,
      };
    }
    case actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        GetSelectedPacakgeDetails: null,
        GetSelectedPackageResponseMessage: action.message,
      };
    }
    case actions.CHANGEPASSWORD_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CHANGEPASSWORD_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ChangeUserPasswordResponse: action.response,
        ChangeUserPasswordResponseMessage: action.message,
      };
    }
    case actions.CHANGEPASSWORD_FAIL: {
      return {
        ...state,
        Loading: false,
        ChangeUserPasswordResponse: null,
        ChangeUserPasswordResponseMessage: action.message,
      };
    }
    case actions.RESELECTIONPACKAGE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.RESELECTIONPACKAGE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        OrganizationCreateResponseMessage: action.message,
      };
    }
    case actions.RESELECTIONPACKAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        OrganizationCreateResponseMessage: action.message,
      };
    }

    case actions.CLEARE_MESSAGE: {
      return {
        ...state,
        EmailValidationResponseMessage: "",
        EnterPasswordResponseMessage: "",
        VerifyOTPEmailResponseMessage: "",
        CreatePasswordResponseMessage: "",
        OrganizationCreateResponseMessage: "",
        GetSelectedPackageResponseMessage: "",
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default AuthReducer;
