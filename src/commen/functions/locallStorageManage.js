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
    meetingCanc: localStorage.getItem("meetingCanc"),
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
    docSignAction: localStorage.getItem("docSignAction"),
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
