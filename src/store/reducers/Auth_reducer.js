import * as actions from "../action_types";

const initialState = {
  UserDetails: null,
  isLoggedIn: false,
  Loading: false,
  ResponseMessage: "",
  signUpResponseMessage: "",
  LoginResponseMessage: "",
  isSignUp: false,
  departments: null,
  roles: null,
  // change
  ForgotPasswordData: [],
  isError: true,
  isFail: true,
  isErrorPas: true,
  pendingError: false,
  Token: "",
  Refresh: "",
  SessionExpireResponseMessage: "",
  VerifyOTPData: [],
  VerifyOTPSignupData: [],
  ConfirmPasswordData: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.REFRESH_TOKEN_SUCCESS:
      // localStorage.setItem("token", JSON.stringify(action.response.token));
      // localStorage.setItem(
      //   "RefreshToken",
      //   JSON.stringify(action.response.refreshToken)
      // );
      return {
        ...state,
        ResponseMessage: action.message,
        Token: action.response.token,
        Refresh: action.response.refreshToken,
      };

    case actions.REFRESH_TOKEN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        Loading: false,
        SessionExpireResponseMessage: action.message,
        Token: "",
        Refresh: "",
      };

    case actions.SIGN_UP_INIT:
      return { ...state, Loading: true };
    case actions.SIGN_UP_SUCCESS:
      localStorage.setItem("Email", JSON.stringify(action.response.email));
      localStorage.setItem("userID", action.response.userID);
      return {
        ...state,
        isLoggedIn: true,
        Loading: false,
        pendingError: false,
      };
    case actions.SIGN_UP_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        Loading: false,
        pendingError: true,
        ResponseMessage: action.message,
      };

    case actions.SIGN_IN_INIT:
      return { ...state, Loading: true };

    case actions.SIGN_IN_SUCCESS:
      localStorage.setItem("token", JSON.stringify(action.response.token));
      localStorage.setItem(
        "RefreshToken",
        JSON.stringify(action.response.refreshToken)
      );
      localStorage.setItem("UserName", action.response.name);
      localStorage.setItem("Email", JSON.stringify(action.response.userName));
      localStorage.setItem("userID", JSON.stringify(action.response.userID));
      // localStorage.setItem("Email", JSON.stringify(action.response.userName))
      return {
        ...state,
        isLoggedIn: true,
        Loading: false,
        UserDetails: action.response,
        ResponseMessage: action.message,
      };

    case actions.SIGN_IN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        Loading: false,
        UserDetails: action.response,
        ResponseMessage: action.message,
      };

    case actions.FORGOT_PASSWORD_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoggedIn: true,
        Loading: false,
        ForgotPasswordData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.FORGOT_PASSWORD_FAIL: {
      return {
        ...state,
        isLoggedIn: false,
        Loading: false,
        ResponseMessage: action.message,
      };
    }
    case actions.VERIFY_OPT_INIT: {
      return { ...state, Loading: true };
    }
    case actions.VERIFY_OPT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        message: action.response.responseMessage,
        VerifyOTPData: action.response,
      };
    }
    case actions.VERIFY_OPT_FAIL: {
      return {
        ...state,
        Loading: false,
        message: action.response.responseMessage,
        VerifyOTPData: action.response,
      };
    }
    case actions.VERIFY_OTPSIGNUP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        message: action.response.responseMessage,
        VerifyOTPSignupData: action.response,
      };
    }
    case actions.VERIFY_OTPSIGNUP_FAIL: {
      return {
        ...state,
        Loading: false,
        message: action.response.responseMessage,
        VerifyOTPSignupData: action.response,
      };
    }

    case actions.RESEND_OTP_FORGOTPASSWORD_SUCCESS: {
      return {
        ...state,
        Loading: false,
        message: action.message,
      };
    }

    case actions.RESEND_OTP_FORGOTPASSWORD_FAIL: {
      return {
        ...state,
        Loading: false,
        message: action.message,
      };
    }

    case actions.SIGN_OUT:
      return {
        ...state,
        UserDetails: null,
        isLoggedIn: false,
        Loading: false,
        Token: "",
        Refresh: "",
      };

    case actions.CHANGE_PASSWORD_INIT: {
      return { ...state, Loading: true };
    }
    case actions.CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        Loading: false,
        message: action.response,
        ConfirmPasswordData: action.message,
      };
    }
    case actions.CHANGE_PASSWORD_FAIL: {
      return {
        ...state,
        Loading: false,
        message: action.response,
        ConfirmPasswordData: action.message,
      };
    }

    case actions.AUTH_RESPONSE_MESSAGE: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
      };
    }

    case actions.HIDE:
      return {
        ...state,
        ResponseMessage: "",
        signUpResponseMessage: "",
        LoginResponseMessage: "",
      };

    case actions.CLEAR_STATE_BACK:
      let RememberEmailLocal = JSON.parse(
        localStorage.getItem("rememberEmail")
      );
      let RememberPasswordLocal = JSON.parse(
        localStorage.getItem("remeberPassword")
      );
      let reLang = localStorage.getItem("i18nextLng");
      if (RememberEmailLocal === true && RememberPasswordLocal === true) {
        let RememberEmailLocalValue =
          localStorage.getItem("rememberEmailValue");

        let RememberPasswordLocalValue = localStorage.getItem(
          "rememberPasswordValue"
        );
        
        localStorage.clear();
        if (reLang !== undefined && reLang !== null) {
          localStorage.setItem("i18nextLng", reLang);
        }
        localStorage.setItem("remeberPassword", RememberPasswordLocal);
        localStorage.setItem(
          "rememberPasswordValue",
          RememberPasswordLocalValue
        );
        localStorage.setItem("rememberEmail", RememberEmailLocal);
        localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
      } else if (RememberEmailLocal === true) {
        let RememberEmailLocalValue =
          localStorage.getItem("rememberEmailValue");
        
        localStorage.clear();
        if (reLang !== undefined && reLang !== null) {
          localStorage.setItem("i18nextLng", reLang);
        }
        localStorage.setItem("rememberEmail", RememberEmailLocal);
        localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
      } else if (RememberPasswordLocal === true) {
        let RememberPasswordLocalValue = localStorage.getItem(
          "rememberPasswordValue"
        );
        
        localStorage.clear();
        if (reLang !== undefined && reLang !== null) {
          localStorage.setItem("i18nextLng", reLang);
        }
        localStorage.setItem("remeberPassword", RememberPasswordLocal);
        localStorage.setItem(
          "rememberPasswordValue",
          RememberPasswordLocalValue
        );
      } else {
        
        localStorage.clear();
        if (reLang !== undefined && reLang !== null) {
          localStorage.setItem("i18nextLng", reLang);
        }
        localStorage.setItem("rememberEmail", false);
        localStorage.setItem("rememberEmailValue", "");
        localStorage.setItem("remeberPassword", false);
        localStorage.setItem("rememberPasswordValue", "");
      }
      return {
        ...state,
        UserDetails: null,
        isLoggedIn: false,
        Loading: false,
        ResponseMessage: "",
        signUpResponseMessage: "",
        LoginResponseMessage: "",
        isSignUp: false,
        departments: null,
        roles: null,
        // change
        ForgotPasswordData: [],
        isError: true,
        isFail: true,
        isErrorPas: true,
        pendingError: false,
        Token: "",
        Refresh: "",
        SessionExpireResponseMessage: "",
        VerifyOTPData: [],
        VerifyOTPSignupData: [],
        ConfirmPasswordData: [],
      };

    case actions.CLEARE_CHANGE_PASSWORD_MESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
        SessionExpireResponseMessage: "",
        LoginResponseMessage: "",
        signUpResponseMessage: "",
      };
    }
    default:
      return { ...state };
  }
};
export default authReducer;
