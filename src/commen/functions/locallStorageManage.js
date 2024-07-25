import { LoginFlowRoutes } from "../../store/actions/UserManagementActions";

export const localStorageManage = (
  emailRef,
  dispatch,
  setErrorMessage,
  setErrorBar,
  setRemeberEmail,
  setEmail
) => {
  emailRef.current.focus();
  let RememberEmailLocal = JSON.parse(localStorage.getItem("rememberEmail"));
  let RememberPasswordLocal = JSON.parse(
    localStorage.getItem("remeberPassword")
  );
  let reLang = localStorage.getItem("i18nextLng");

  let RSVP = localStorage.getItem("RSVP");
  let DataRoomEmailValue = localStorage.getItem("DataRoomEmail");
  let LoginFlowPageRoute = JSON.parse(
    localStorage.getItem("LoginFlowPageRoute")
  );
  let AdOrg = localStorage.getItem("AdOrg");
  let AgCont = localStorage.getItem("AgCont");
  let MeetingStr = localStorage.getItem("meetingStr");
  let MeetinUpd = localStorage.getItem("meetingUpd");
  let MeetingMin = localStorage.getItem("meetingMin");
  let Meetingprop = localStorage.getItem("meetingprop");
  let poPub = localStorage.getItem("poPub");
  if (RememberEmailLocal === true && RememberPasswordLocal === true) {
    let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");

    let RememberPasswordLocalValue = localStorage.getItem(
      "rememberPasswordValue"
    );

    localStorage.clear();
    try {
      // if (Number(LoginFlowPageRoute) !== 1) {
      console.log("LoginFlowRoutes", LoginFlowPageRoute);
      localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
      dispatch(LoginFlowRoutes(LoginFlowPageRoute));
      // }
    } catch {}
    if (reLang !== undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    if (RSVP) {
      localStorage.setItem("RSVP", RSVP);
    }
    if (MeetingStr) {
      localStorage.setItem("meetingStr", MeetingStr);
    }
    if (MeetinUpd) {
      localStorage.setItem("meetingUpd", MeetinUpd);
    }
    if (Meetingprop) {
      localStorage.setItem("meetingprop", Meetingprop);
    }
    if (MeetingMin) {
      localStorage.setItem("meetingMin", MeetingMin);
    }
    if (AgCont) {
      localStorage.setItem("AgCont", AgCont);
    }
    if (poPub) {
      localStorage.setItem("poPub", poPub);
    }
    if (AdOrg) {
      localStorage.setItem("AdOrg", AdOrg);
    }
    if (DataRoomEmailValue) {
      localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
    }
    localStorage.setItem("remeberPassword", RememberPasswordLocal);
    localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
    localStorage.setItem("rememberEmail", RememberEmailLocal);
    localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
    setErrorMessage("");
    setErrorBar(false);
    setRemeberEmail(RememberEmailLocal);
    setEmail(RememberEmailLocalValue);
  } else if (RememberEmailLocal === true) {
    let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");
    localStorage.clear();
    try {
      // if (Number(LoginFlowPageRoute) !== 1) {
      localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
      console.log("LoginFlowRoutes", LoginFlowPageRoute);
      dispatch(LoginFlowRoutes(LoginFlowPageRoute));
      // }
    } catch {}
    if (reLang !== undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    if (RSVP) {
      localStorage.setItem("RSVP", RSVP);
    }
    if (MeetingStr) {
      localStorage.setItem("meetingStr", MeetingStr);
    }
    if (MeetinUpd) {
      localStorage.setItem("meetingUpd", MeetinUpd);
    }
    if (Meetingprop) {
      localStorage.setItem("meetingprop", Meetingprop);
    }
    if (MeetingMin) {
      localStorage.setItem("meetingMin", MeetingMin);
    }
    if (AgCont) {
      localStorage.setItem("AgCont", AgCont);
    }
    if (poPub) {
      localStorage.setItem("poPub", poPub);
    }
    if (AdOrg) {
      localStorage.setItem("AdOrg", AdOrg);
    }
    if (DataRoomEmailValue) {
      localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
    }
    localStorage.setItem("rememberEmail", RememberEmailLocal);
    localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
    setErrorMessage("");
    setErrorBar(false);
    setRemeberEmail(RememberEmailLocal);
    setEmail(RememberEmailLocalValue);
  } else if (RememberPasswordLocal === true) {
    let RememberPasswordLocalValue = localStorage.getItem(
      "rememberPasswordValue"
    );
    localStorage.clear();
    try {
      // if (Number(LoginFlowPageRoute) !== 1) {
      localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
      console.log("LoginFlowRoutes", LoginFlowPageRoute);
      dispatch(LoginFlowRoutes(LoginFlowPageRoute));
      // }
    } catch {}

    if (reLang != undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    if (RSVP) {
      localStorage.setItem("RSVP", RSVP);
    }
    if (AgCont) {
      localStorage.setItem("AgCont", AgCont);
    }
    if (MeetingStr) {
      localStorage.setItem("meetingStr", MeetingStr);
    }
    if (MeetinUpd) {
      localStorage.setItem("meetingUpd", MeetinUpd);
    }
    if (Meetingprop) {
      localStorage.setItem("meetingprop", Meetingprop);
    }
    if (MeetingMin) {
      localStorage.setItem("meetingMin", MeetingMin);
    }
    if (poPub) {
      localStorage.setItem("poPub", poPub);
    }
    if (AdOrg) {
      localStorage.setItem("AdOrg", AdOrg);
    }
    if (DataRoomEmailValue) {
      localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
    }
    localStorage.setItem("remeberPassword", RememberPasswordLocal);
    localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
    setErrorMessage("");
    setErrorBar(false);
  } else {
    localStorage.clear();
    try {
      // if (Number(LoginFlowPageRoute) !== 1) {
      localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
      console.log("LoginFlowRoutes", LoginFlowPageRoute);
      dispatch(LoginFlowRoutes(LoginFlowPageRoute));
      // }
    } catch {}
    if (reLang != undefined && reLang != null) {
      localStorage.setItem("i18nextLng", reLang);
    }
    if (RSVP) {
      localStorage.setItem("RSVP", RSVP);
    }
    if (AgCont) {
      localStorage.setItem("AgCont", AgCont);
    }
    if (MeetingStr) {
      localStorage.setItem("meetingStr", MeetingStr);
    }
    if (MeetinUpd) {
      localStorage.setItem("meetingUpd", MeetinUpd);
    }
    if (Meetingprop) {
      localStorage.setItem("meetingprop", Meetingprop);
    }
    if (MeetingMin) {
      localStorage.setItem("meetingMin", MeetingMin);
    }
    if (poPub) {
      localStorage.setItem("poPub", poPub);
    }
    if (AdOrg) {
      localStorage.setItem("AdOrg", AdOrg);
    }
    if (DataRoomEmailValue) {
      localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
    }
    localStorage.setItem("rememberEmail", false);
    localStorage.setItem("rememberEmailValue", "");
    localStorage.setItem("remeberPassword", false);
    localStorage.setItem("rememberPasswordValue", "");
    setErrorMessage("");
    setErrorBar(false);
  }
};
