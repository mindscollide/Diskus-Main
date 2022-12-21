import * as actions from "../action_types";
import Helper from "../../commen/functions/history_logout";
import { BroadcastChannel } from "broadcast-channel";

const logoutChannel = new BroadcastChannel("logout");

const signOut = (navigate, message) => {
  logoutChannel.postMessage("Logout");
  if (Helper.socket != null) {
    Helper.socket.disconnect(true);
  }
  window.location.href = window.location.origin + "/";
  // navigate("/");
  localStorage.clear();
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

export { signOut, logoutAllTabs };
