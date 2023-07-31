import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
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
  AuthenticateAFAResponse: null,
  AuthenticateAFAResponseMessage: "",
  SendTwoFacOTPResponse: null,
  SendTwoFacOTPResponseMessage: "",
  VerifyTwoFacOTPResponse: null,
  VerifyTwoFacOTPResponseMessage: "",
  passwordUpdateOnForgotPasswordMessege: "",
  client: null,
  getSubscriptiondetails: null,
  getSubscriptionUpgradePaymentDetail: null,
  getSubscriptionPaymentComplete: null,
  paymentCompleteResponse: null
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.PAYMENTCOMPLETE_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.PAYMENTCOMPLETE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        paymentCompleteResponse: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.PAYMENTCOMPLETE_FAIL: {
      return {
        ...state,
        Loading: false,
        paymentCompleteResponse: null,
        ResponseMessage: action.message
      }
    }
    case actions.GETSUBSCRIPTIONUPGRADEAMOUNTDETAIL_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.GETSUBSCRIPTIONUPGRADEAMOUNTDETAIL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getSubscriptionUpgradePaymentDetail: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.GETSUBSCRIPTIONUPGRADEAMOUNTDETAIL_FAIL: {
      return {
        ...state,
        Loading: false,
        getSubscriptionUpgradePaymentDetail: null,
        ResponseMessage: action.message
      }
    }

    case actions.GETSUBSCRIPTIONUPGRADEPAYMENTCOMPLETE_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.GETSUBSCRIPTIONUPGRADEPAYMENTCOMPLETE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getSubscriptionPaymentComplete: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.GETSUBSCRIPTIONUPGRADEPAYMENTCOMPLETE_FAIL: {
      return {
        ...state,
        Loading: false,
        getSubscriptionPaymentComplete: null,
        ResponseMessage: action.message
      }
    }

    case actions.EMAILVALIDATION_INIT: {
      console.log(state, "action");
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
        message: action.message,
      };
    }

    case actions.RESEND_OTP_FAIL: {
      return {
        ...state,
        Loading: false,
        message: action.message,
      };
    }
    case actions.EMAILVALIDATION_SUCCESS: {
      console.log(action, "action");
      localStorage.setItem("userID", action.response.userID);
      return {
        ...state,
        Loading: false,
        EmailValidationResponse: action.response,
        EmailValidationResponseMessage: action.message,
      };
    }
    case actions.EMAILVALIDATION_FAIL: {
      console.log(action, "action");
      return {
        ...state,
        Loading: false,
        EmailValidationResponseMessage: action.message,
      };
    }
    case actions.PASSWORDVALIDATION_INIT: {
      console.log(action, "action");
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.PASSWORDVALIDATION_SUCCESS: {
      console.log(action, "action");
      return {
        ...state,
        Loading: false,
        EnterPasswordResponse: action.response,
        EnterPasswordResponseMessage: action.message,
      };
    }
    case actions.PASSWORDVALIDATION_FAIL: {
      console.log(action, "action");
      return {
        ...state,
        Loading:
          action.response != undefined &&
            action.response != null &&
            action.response === true
            ? true
            : false,
        EnterPasswordResponse: null,
        EnterPasswordResponseMessage: action.message,
      };
    }
    case actions.VERIFYOTPFOREMAIL_INIT: {
      console.log(action, "action");
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VERIFYOTPFOREMAIL_SUCCESS: {
      console.log(action, "action");
      return {
        ...state,
        Loading: false,
        VerifyOTPEmailResponse: action.response,
        VerifyOTPEmailResponseMessage: action.message,
      };
    }
    case actions.VERIFYOTPFOREMAIL_FAIL: {
      console.log(action, "action");
      return {
        ...state,
        Loading: false,
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
        // GetSelectedPackageResponseMessage: action.message,
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
      console.log("CHANGEPASSWORD_SUCCESS", action);
      return {
        ...state,
        Loading: false,
        // ChangeUserPasswordResponse: action.response,
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
    case actions.CHECKINGAUTHENTICATEAFA_INIT: {
      console.log("CHECKINGAUTHENTICATEAFA_SUCCESS", action);
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CHECKINGAUTHENTICATEAFA_SUCCESS: {
      console.log("CHECKINGAUTHENTICATEAFA_SUCCESS", action);
      return {
        Loading: false,
        AuthenticateAFAResponse: action.response,
        AuthenticateAFAResponseMessage: action.message,
      };
    }
    case actions.CHECKINGAUTHENTICATEAFA_FAIL: {
      console.log("CHECKINGAUTHENTICATEAFA_SUCCESS", action);
      return {
        ...state,
        Loading: false,
        AuthenticateAFAResponse: null,
        AuthenticateAFAResponseMessage: action.message,
      };
    }
    case actions.SENDTWOFACOTP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SENDTWOFACOTP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SendTwoFacOTPResponse: action.response,
        SendTwoFacOTPResponseMessage: action.message,
      };
    }
    case actions.SENDTWOFACOTP_FAIL: {
      return {
        ...state,
        Loading: false,
        SendTwoFacOTPResponse: null,
        SendTwoFacOTPResponseMessage: action.message,
      };
    }
    case actions.VERIFYTWOFACOTP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VERIFYTWOFACOTP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        VerifyTwoFacOTPResponse: action.response,
        VerifyTwoFacOTPResponseMessage: action.message,
      };
    }
    case actions.VERIFYTWOFACOTP_FAIL: {
      return {
        ...state,
        Loading: false,
        VerifyTwoFacOTPResponse: null,
        VerifyTwoFacOTPResponseMessage: action.message,
      };
    }
    case actions.PASSWORD_UPDATE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.PASSWORD_UPDATE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        passwordUpdateOnForgotPasswordMessege: action.message,
      };
    }
    case actions.PASSWORD_UPDATE_FAIL: {
      return {
        ...state,
        Loading: false,
        passwordUpdateOnForgotPasswordMessege: action.message,
      };
    }
    case actions.GETSUBSCRIPTIONDETAIL_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.GETSUBSCRIPTIONDETAIL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getSubscriptiondetails: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.GETSUBSCRIPTIONDETAIL_FAIL: {
      return {
        ...state,
        Loading: false,
        getSubscriptiondetails: null,
        ResponseMessage: action.message
      }
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
        ChangeUserPasswordResponseMessage: "",
        AuthenticateAFAResponseMessage: "",
        passwordUpdateOnForgotPasswordMessege: "",
        SendTwoFacOTPResponseMessage: "",
      };
    }

    case actions.AUTH2_REDUCER_LOADER: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.SET_MQTT_CLIENT: {
      return {
        ...state,
        client: action.response,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default AuthReducer;
