import * as actions from "../action_types";
import { BroadcastChannel } from "broadcast-channel";
import { UserLogout } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import { showUpgradeNowModal } from "./UserMangementModalActions";
import { LoginFlowRoutes } from "./UserManagementActions";
import axiosInstance from "../../commen/functions/axiosInstance";

const logoutChannel = new BroadcastChannel("logout");

//User Logout Api Section
const userlogOutInit = () => {
  return {
    type: actions.USER_LOGOUT_INIT,
  };
};

const userlogOutSuccess = (response, message) => {
  return {
    type: actions.USER_LOGOUT_SUCCESS,
    response: response,
    message: message,
  };
};

const userlogOutFailed = (message) => {
  return {
    type: actions.USER_LOGOUT_FAILED,
    message: message,
  };
};

const userLogOutApiFunc = (navigate, t) => {
  return (dispatch) => {
    try {
      dispatch(userlogOutInit());
      let form = new FormData();
      form.append("RequestMethod", UserLogout.RequestMethod);
      axiosInstance
        .post(authenticationApi, form)

        .then(async (response) => {
          if (response.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(userLogOutApiFunc(navigate, t));
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_AuthManager_LogOut_01".toLowerCase()
                  )
              ) {
                await dispatch(userlogOutSuccess(null, t("Successful")));
                dispatch(showUpgradeNowModal(false));
                await signOut(t("Successful"), dispatch);
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_AuthManager_LogOut_02".toLowerCase()
                  )
              ) {
                await signOut(t("Successful"), dispatch);
                dispatch(userlogOutFailed(t("Invalid Token")));
                dispatch(showUpgradeNowModal(true));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_AuthManager_LogOut_03".toLowerCase()
                  )
              ) {
                await signOut(t("Successful"), dispatch);
                dispatch(userlogOutFailed(t("Something-went-wrong")));
                dispatch(showUpgradeNowModal(true));
              } else {
                await signOut(t("Successful"), dispatch);
                dispatch(userlogOutFailed(t("Something-went-wrong")));
                dispatch(showUpgradeNowModal(true));
              }
            } else {
              await signOut(t("Successful"), dispatch);
              dispatch(userlogOutFailed(t("Something-went-wrong")));
              dispatch(showUpgradeNowModal(true));
            }
          } else {
            
            dispatch(userlogOutFailed(t("Something-went-wrong")));
            await signOut(t("Successful"), dispatch);
            dispatch(showUpgradeNowModal(false));
          }
        })
        .catch(async (response) => {
          dispatch(userlogOutFailed(t("Something-went-wrong")));
          await signOut(t("Successful"), dispatch);
        });
    } catch (error) {
      
    }
  };
};

export const signOut = async (message, dispatch) => {
  // logoutChannel.postMessage("Logout");
  dispatch(initaialStateFun());
  window.location.href = "/";
  let RememberEmailLocal = JSON.parse(localStorage.getItem("rememberEmail"));
  let RememberPasswordLocal = JSON.parse(
    localStorage.getItem("remeberPassword")
  );
  let reLang = localStorage.getItem("i18nextLng");
  if (RememberEmailLocal === true && RememberPasswordLocal === true) {
    let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");

    let RememberPasswordLocalValue = localStorage.getItem(
      "rememberPasswordValue"
    );

    localStorage.clear();
    if (reLang !== undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("remeberPassword", RememberPasswordLocal);
    localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
    localStorage.setItem("rememberEmail", RememberEmailLocal);
    localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
  } else if (RememberEmailLocal === true) {
    let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");

    localStorage.clear();
    if (reLang !== undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("rememberEmail", RememberEmailLocal);
    localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
  } else if (RememberPasswordLocal === true) {
    let RememberPasswordLocalValue = localStorage.getItem(
      "rememberPasswordValue"
    );

    localStorage.clear();
    if (reLang !== undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("remeberPassword", RememberPasswordLocal);
    localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
  } else {
    localStorage.clear();
    if (reLang !== undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("rememberEmail", false);
    localStorage.setItem("rememberEmailValue", "");
    localStorage.setItem("remeberPassword", false);
    localStorage.setItem("rememberPasswordValue", "");
  }
  localStorage.setItem("LoginFlowPageRoute", 1);
  dispatch(LoginFlowRoutes(1));

  if (message !== "") {
    return {
      type: actions.SIGN_OUT,
      message: message,
    };
  } else {
    return {
      type: actions.SIGN_OUT,
    };
  }
};

const logoutAllTabs = () => {
  logoutChannel.onmessage = () => {
    signOut();
    logoutChannel.close();
  };
};

const initaialStateFun = () => {
  return {
    type: actions.SET_INITIAL_ALLSTATE,
  };
};

export { logoutAllTabs, userLogOutApiFunc, initaialStateFun };
