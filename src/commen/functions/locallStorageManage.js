import { LoginFlowRoutes } from "../../store/actions/UserManagementActions";

const setLocalStorage = (key, value) => {
  if (value) {
    localStorage.setItem(key, value);
  }
};

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
  const LoginFlowPageRoute = localStorage.getItem("LoginFlowPageRoute") !== null ? JSON.parse(localStorage.getItem("LoginFlowPageRoute")) : 1
  const commonData = {
    i18nextLng: localStorage.getItem("i18nextLng"),
    RSVP: localStorage.getItem("RSVP"),
    DataRoomEmail: localStorage.getItem("DataRoomEmail"),
    meetingStr: localStorage.getItem("meetingStr"),
    meetingUpd: localStorage.getItem("meetingUpd"),
    meetingMin: localStorage.getItem("meetingMin"),
    meetingprop: localStorage.getItem("meetingprop"),
    mtAgUpdate: localStorage.getItem("mtAgUpdate"),
    poPub: localStorage.getItem("poPub"),
    poUpda: localStorage.getItem("poUpda"),
    UserMeetPropoDatPoll: localStorage.getItem("UserMeetPropoDatPoll"),
    pollExpire: localStorage.getItem("pollExpire"),
    AdOrg: localStorage.getItem("AdOrg"),
    AgCont: localStorage.getItem("AgCont"),
    meetingCanc: localStorage.getItem("meetingCanc"),
  };

  if (RememberEmailLocal || RememberPasswordLocal) {
    const RememberEmailLocalValue =
      localStorage.getItem("rememberEmailValue") || "";
    const RememberPasswordLocalValue =
      localStorage.getItem("rememberPasswordValue") || "";

    manageCommonLocalStorage(
      LoginFlowPageRoute,
      dispatch,
      commonData
    );

    setLocalStorage("rememberEmail", RememberEmailLocal);
    setLocalStorage("rememberEmailValue", RememberEmailLocalValue);
    setLocalStorage("remeberPassword", RememberPasswordLocal);
    setLocalStorage("rememberPasswordValue", RememberPasswordLocalValue);

    setErrorMessage("");
    setErrorBar(false);
    setRememberEmail(RememberEmailLocal);
    setEmail(RememberEmailLocalValue);

    // Remove specific items if applicable
    localStorage.removeItem("resVot");
    localStorage.removeItem("resNonVot");
  } else {
    manageCommonLocalStorage(
      LoginFlowPageRoute,
      dispatch,
      commonData
    );

    setLocalStorage("rememberEmail", false);
    setLocalStorage("rememberEmailValue", "");
    setLocalStorage("remeberPassword", false);
    setLocalStorage("rememberPasswordValue", "");

    setErrorMessage("");
    setErrorBar(false);
  }
};
