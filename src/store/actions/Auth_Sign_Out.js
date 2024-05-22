import * as actions from "../action_types";
import Helper from "../../commen/functions/history_logout";
import { BroadcastChannel } from "broadcast-channel";
import { UserLogout } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import { showUpgradeNowModal } from "./UserMangementModalActions";
import { LoginFlowRoutes } from "./UserManagementActions";

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
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(userlogOutInit());
    let form = new FormData();
    form.append("RequestMethod", UserLogout.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(userLogOutApiFunc(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("ERM_AuthService_AuthManager_LogOut_01".toLowerCase())
            ) {
              await dispatch(userlogOutSuccess(t("Successful")));
              signOut(dispatch);
              dispatch(showUpgradeNowModal(false));
              // navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("ERM_AuthService_AuthManager_LogOut_02".toLowerCase())
            ) {
              dispatch(userlogOutFailed(t("Invalid Token")));
              dispatch(showUpgradeNowModal(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("ERM_AuthService_AuthManager_LogOut_03".toLowerCase())
            ) {
              dispatch(userlogOutFailed(t("Something-went-wrong")));
              dispatch(showUpgradeNowModal(true));
            } else {
              dispatch(userlogOutFailed(t("Something-went-wrong")));
              dispatch(showUpgradeNowModal(true));
            }
          } else {
            dispatch(userlogOutFailed(t("Something-went-wrong")));
            dispatch(showUpgradeNowModal(true));
          }
        } else {
          dispatch(userlogOutFailed(t("Something-went-wrong")));
          dispatch(showUpgradeNowModal(true));
        }
      })
      .catch((response) => {
        dispatch(userlogOutFailed(t("Something-went-wrong")));
      });
  };
};

const signOut = (navigate, message, dispatch) => {
  logoutChannel.postMessage("Logout");
  // if (Helper.socket != null) {
  //   Helper.socket.disconnect(true);
  // }
  window.location.href = window.location.origin + "/";
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
    if (reLang != undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("remeberPassword", RememberPasswordLocal);
    localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
    localStorage.setItem("rememberEmail", RememberEmailLocal);
    localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
  } else if (RememberEmailLocal === true) {
    let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");
    localStorage.clear();
    if (reLang != undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("rememberEmail", RememberEmailLocal);
    localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
  } else if (RememberPasswordLocal === true) {
    let RememberPasswordLocalValue = localStorage.getItem(
      "rememberPasswordValue"
    );
    localStorage.clear();
    if (reLang != undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("remeberPassword", RememberPasswordLocal);
    localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
  } else {
    localStorage.clear();
    if (reLang != undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    localStorage.setItem("rememberEmail", false);
    localStorage.setItem("rememberEmailValue", "");
    localStorage.setItem("remeberPassword", false);
    localStorage.setItem("rememberPasswordValue", "");
  }
  localStorage.setItem("LoginFlowPageRoute", 1);
  dispatch(LoginFlowRoutes(1));
  // navigate("/");

  if (message != "") {
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

export { signOut, logoutAllTabs, userLogOutApiFunc };
