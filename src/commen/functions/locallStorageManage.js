/**
 * @file locallStorageManage.js
 * @description Handles localStorage preservation during the login flow.
 * When a user signs in, certain deep-link tokens and notification flags that
 * were stored before authentication must survive the `localStorage.clear()`
 * call so the app can redirect to the correct screen after login.
 */
import { LoginFlowRoutes } from "../../store/actions/UserManagementActions";

/**
 * Writes a key/value pair to localStorage only when `value` is truthy,
 * preventing accidental overwrites with null or empty strings.
 * @param {string} key
 * @param {*} value
 */
const setLocalStorage = (key, value) => {
  if (value) {
    localStorage.setItem(key, value);
  }
};

/**
 * Clears localStorage, restores the LoginFlowPageRoute, dispatches it to
 * Redux, then re-writes every key in `dataMap` that has a truthy value.
 * @param {number} loginFlowPageRoute - Current login-flow step.
 * @param {Function} dispatch
 * @param {Object} dataMap - Key/value pairs to restore after the clear.
 */
const manageCommonLocalStorage = (loginFlowPageRoute, dispatch, dataMap) => {
  localStorage.clear();
  localStorage.setItem(
    "LoginFlowPageRoute",
    JSON.stringify(loginFlowPageRoute)
  );
  dispatch(LoginFlowRoutes(loginFlowPageRoute));

  Object.entries(dataMap).forEach(([key, value]) =>
    setLocalStorage(key, value)
  );
};

/**
 * Entry point called by the Sign-In form on mount. Focuses the email input,
 * then preserves all relevant deep-link tokens across a localStorage.clear()
 * so they are still available after login. Also restores "Remember Me"
 * credentials when applicable.
 *
 * @param {React.RefObject<HTMLInputElement>} emailRef - Ref to the email field.
 * @param {Function} dispatch - Redux dispatch.
 * @param {Function} setErrorMessage - Clears any existing error message.
 * @param {Function} setErrorBar - Hides the error bar.
 * @param {Function} setRememberEmail - Restores "remember email" checkbox state.
 * @param {Function} setEmail - Pre-fills the email field if "remember" was set.
 */
export const localStorageManage = (
  emailRef,
  dispatch,
  setErrorMessage,
  setErrorBar,
  setRememberEmail,
  setEmail
) => {
  emailRef.current.focus();

  const RememberEmailLocal = JSON.parse(localStorage.getItem("rememberEmail"));
  const RememberPasswordLocal = JSON.parse(
    localStorage.getItem("remeberPassword")
  );
  let LoginFlowPageRoute =
    localStorage.getItem("LoginFlowPageRoute") !== null ||
    localStorage.getItem("LoginFlowPageRoute") !== undefined
      ? JSON.parse(localStorage.getItem("LoginFlowPageRoute"))
      : 1;

  const commonData = {
    i18nextLng: localStorage.getItem("i18nextLng") || "en",
    RSVP: localStorage.getItem("RSVP"),
    DataRoomEmail: localStorage.getItem("DataRoomEmail"),
    meetingStr: localStorage.getItem("meetingStr"),
    meetingUpd: localStorage.getItem("meetingUpd"),
    meetingMin: localStorage.getItem("meetingMin"),
    meetingprop: localStorage.getItem("meetingprop"),
    mtAgUpdate: localStorage.getItem("mtAgUpdate"),
    meetingCanc: localStorage.getItem("meetingCanc"),
    poPub: localStorage.getItem("poPub"),
    poUpda: localStorage.getItem("poUpda"),
    UserMeetPropoDatPoll: localStorage.getItem("UserMeetPropoDatPoll"),
    pollExpire: localStorage.getItem("pollExpire"),
    AdOrg: localStorage.getItem("AdOrg"),
    AgCont: localStorage.getItem("AgCont"),
    resVot: localStorage.getItem("resVot"),
    resNonVot: localStorage.getItem("resNonVot"),
    committeeView_Id: localStorage.getItem("committeeView_Id"),
    committeeList: localStorage.getItem("committeeList"),
    groupView_Id: localStorage.getItem("groupView_Id"),
    groupList: localStorage.getItem("groupList"),
    taskListView_Id: localStorage.getItem("taskListView_Id"),
    taskListView: localStorage.getItem("taskListView"),
    documentViewer: localStorage.getItem("documentViewer"),
    viewFolderLink: localStorage.getItem("viewFolderLink"),
    mobilePopUpAppRoute: localStorage.getItem("mobilePopUpAppRoute"),
    reviewSubmittedMinutesLink: localStorage.getItem(
      "reviewSubmittedMinutesLink"
    ),
    reviewMinutesLink: localStorage.getItem("reviewMinutesLink"),
    viewMeetingLink: localStorage.getItem("viewMeetingLink"),
    docSignAction: localStorage.getItem("docSignAction"),
    viewPublishMinutesLink: localStorage.getItem("viewPublishMinutesLink"),
    docSignedAction: localStorage.getItem("docSignedAction"),
    docSignedCrAction: localStorage.getItem("docSignedCrAction")

  };

  if (RememberEmailLocal || RememberPasswordLocal) {
    const RememberEmailLocalValue =
      localStorage.getItem("rememberEmailValue") || "";
    const RememberPasswordLocalValue =
      localStorage.getItem("rememberPasswordValue") || "";

    manageCommonLocalStorage(LoginFlowPageRoute, dispatch, commonData);

    setLocalStorage("rememberEmail", RememberEmailLocal);
    setLocalStorage("rememberEmailValue", RememberEmailLocalValue);
    setLocalStorage("remeberPassword", RememberPasswordLocal);
    setLocalStorage("rememberPasswordValue", RememberPasswordLocalValue);

    setErrorMessage("");
    setErrorBar(false);
    setRememberEmail(RememberEmailLocal);
    setEmail(RememberEmailLocalValue);
  } else {
    manageCommonLocalStorage(LoginFlowPageRoute, dispatch, commonData);

    setLocalStorage("rememberEmail", false);
    setLocalStorage("rememberEmailValue", "");
    setLocalStorage("remeberPassword", false);
    setLocalStorage("rememberPasswordValue", "");

    setErrorMessage("");
    setErrorBar(false);
  }
};
