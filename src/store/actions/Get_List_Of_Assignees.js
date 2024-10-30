import * as actions from "../action_types";
import axios from "axios";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import {
  getAllAssigneesToDoList,
  scheduleNewMeeting,
  getMeetingByMeetingID,
  updateMeeting,
  cancelMeeting,
  startMeeting,
  endMeeting,
  getAllReminders,
} from "../../commen/apis/Api_config";
import { getMeetingUserId, searchUserMeeting } from "./GetMeetingUserId";
import { RefreshToken } from "../actions/Auth_action";
import { getCalendarDataResponse } from "../actions/GetDataForCalendar";
import {
  searchNewUserMeeting,
  setMeetingByGroupIDApi,
  setMeetingbyCommitteeIDApi,
  getMeetingByCommitteeIDApi,
  getMeetingbyGroupApi,
  scheduleMeetingPageFlag,
} from "./NewMeetingActions";

const ShowNotification = (message) => {
  return {
    type: actions.SHOW,
    message: message,
  };
};
const meetingLoaderDashboard = (payload) => {
  return {
    type: actions.LOADER_CREATEMEETING_DASHBOARD,
    response: payload,
  };
};

const HideNotification = () => {
  return {
    type: actions.HIDE,
  };
};
// for cleare state
const cleareAssigneesState = () => {
  return {
    type: actions.CLEARE_STATE,
  };
};
const allassignesslistinit = () => {
  return {
    type: actions.ASSIGNESS_LIST_INIT,
  };
};

const allassignesslistsuccess = (response, message, loader) => {
  return {
    type: actions.ASSIGNESS_LIST_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const allassignesslistfail = (message) => {
  return {
    type: actions.ASSIGNESS_LIST_FAIL,
    message: message,
  };
};
const clearResponseMessage = () => {
  return {
    type: actions.LISTOFASSIGNEE_RESPONSE_MESSAGE,
  };
};

const allAssignessList = (navigate, t, loader ) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
  let Data = {
    // UserID: id,
    OrganizationID: OrganizationID,
  };
  return async (dispatch) => {
    dispatch(allassignesslistinit());
    let form = new FormData();
    form.append("RequestMethod", getAllAssigneesToDoList.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(allAssignessList(navigate, t, loader));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllAssignees_01".toLowerCase()
                )
            ) {
              await dispatch(
                allassignesslistsuccess(
                  response.data.responseResult.user,
                  "",
                  loader
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllAssignees_02".toLowerCase()
                )
            ) {
              await dispatch(allassignesslistfail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllAssignees_03".toLowerCase()
                )
            ) {
              await dispatch(allassignesslistfail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(allassignesslistfail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(allassignesslistfail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(allassignesslistfail(t("Something-went-wrong")));
      });
  };
};

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const ScheculeMeetingInit = () => {
  return {
    type: actions.SCHEDULE_NEW_MEETING_INIT,
  };
};

const ScheduleMeetingFail = (message) => {
  return {
    type: actions.SCHEDULE_NEW_MEETING_FAIL,
    message: message,
  };
};

//SaveNONAPIDisputes
const ScheduleNewMeeting = (navigate, t, checkFlag, object, value) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  // let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  let meetingpageRow = JSON.parse(localStorage.getItem("MeetingPageRows"));
  let meetingPageCurrent = JSON.parse(
    localStorage.getItem("MeetingPageCurrent")
  );

  let Data = {
    Date: "",
    Title: "",
    HostName: "",
    UserID: createrID,
    PageNumber: meetingPageCurrent,
    Length: meetingpageRow,
    PublishedMeetings: true,
  };
  return (dispatch) => {
    dispatch(ScheculeMeetingInit());
    dispatch(meetingLoaderDashboard(true));
    let form = new FormData();
    form.append("RequestMethod", scheduleNewMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ScheduleNewMeeting(navigate, t, checkFlag, object, value));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleNewMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(SetLoaderFalse(false));
              dispatch(meetingLoaderDashboard(false));
              // await dispatch(
              //   ShowNotification(t("The-record-has-been-saved-successfully"))
              // );

              if (checkFlag === 2) {
                await dispatch(getCalendarDataResponse(navigate, t, createrID));
              } else if (checkFlag === 4) {
                let meetingpageRow = localStorage.getItem("MeetingPageRows");
                let meetingPageCurrent = parseInt(
                  localStorage.getItem("MeetingPageCurrent")
                );
                let currentView = localStorage.getItem("MeetingCurrentView");

                let searchData = {
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(createrID),
                  PageNumber: Number(meetingPageCurrent),
                  Length: Number(meetingpageRow),
                  PublishedMeetings:
                    currentView && Number(currentView) === 1 ? true : false,
                };
        console.log("chek search meeting")
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
              } else if (checkFlag === 6) {
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

                let Data = {
                  MeetingID: Number(response.data.responseResult.mdid),
                  CommitteeID: Number(ViewCommitteeID),
                };
                dispatch(setMeetingbyCommitteeIDApi(navigate, t, Data));
              } else if (checkFlag === 7) {
                let ViewGroupID = localStorage.getItem("ViewGroupID");
                let Data = {
                  MeetingID: Number(response.data.responseResult.mdid),
                  GroupID: Number(ViewGroupID),
                };
                dispatch(setMeetingByGroupIDApi(navigate, t, Data));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleNewMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(ScheduleMeetingFail(t("No-record-save")));
              dispatch(meetingLoaderDashboard(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleNewMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
              dispatch(meetingLoaderDashboard(false));
            }
          } else {
            await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
            dispatch(meetingLoaderDashboard(false));
          }
        } else {
          dispatch(SetLoaderFalse());
          await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
          dispatch(meetingLoaderDashboard(false));
        }
      })
      .catch((response) => {
        dispatch(meetingLoaderDashboard(false));
        dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
      });
  };
};

// update meeting
const UpdateMeeting = (navigate, t, checkFlag, object, value) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = JSON.parse(localStorage.getItem("userID"));
  // let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 }
  let meetingpageRow = JSON.parse(localStorage.getItem("MeetingPageRows"));
  let meetingPageCurrent = JSON.parse(
    localStorage.getItem("MeetingPageCurrent")
  );

  let Data = {
    Date: "",
    Title: "",
    HostName: "",
    UserID: JSON.parse(createrID),
    PageNumber: meetingPageCurrent,
    Length: meetingpageRow,
  };
  return async (dispatch) => {
    dispatch(ScheculeMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", updateMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ScheduleNewMeeting(navigate, t, checkFlag, object, value));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateMeeting_01".toLowerCase()
                )
            ) {
              if (checkFlag === 4) {
                let meetingpageRow = localStorage.getItem("MeetingPageRows");
                let meetingPageCurrent = parseInt(
                  localStorage.getItem("MeetingPageCurrent")
                );
                let searchData = {
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(createrID),
                  PageNumber: Number(meetingPageCurrent),
                  Length: Number(meetingpageRow),
                  PublishedMeetings: true,
                };
        console.log("chek search meeting")
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
              } else if (checkFlag === 7) {
                let ViewGroupID = localStorage.getItem("ViewGroupID");
                let Data = {
                  GroupID: Number(ViewGroupID),
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(createrID),
                  PageNumber: 1,
                  Length: 50,
                  PublishedMeetings: true,
                };
                dispatch(getMeetingbyGroupApi(navigate, t, Data));
              } else if (checkFlag === 6) {
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
                let Data = {
                  CommitteeID: Number(ViewCommitteeID),
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(createrID),
                  PageNumber: 1,
                  Length: 50,
                  PublishedMeetings: true,
                };
                dispatch(getMeetingByCommitteeIDApi(navigate, t, Data));
              }
              // if (value === 1) {
              //   let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
              //   let Data = {
              //     CommitteeID: Number(ViewCommitteeID),
              //     Date: "",
              //     Title: "",
              //     HostName: "",
              //     UserID: Number(createrID),
              //     PageNumber: 1,
              //     Length: 50,
              //     PublishedMeetings: true,
              //   };
              //   dispatch(getMeetingByCommitteeIDApi(navigate, t, Data));
              // } else if (value === 2) {
              // } else {
              // }

              // await dispatch(
              //   ShowNotification(t("The-record-has-been-updated-successfully"))
              // );
              await dispatch(meetingLoaderDashboard(false));
              await dispatch(SetLoaderFalse(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                ScheduleMeetingFail(t("No-record-has-been-updated"))
              );
              await dispatch(searchUserMeeting(navigate, Data, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
              await dispatch(searchUserMeeting(navigate, Data, t));
            }
          } else {
            dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
            await dispatch(searchUserMeeting(navigate, Data, t));
          }
        } else {
          dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
          await dispatch(searchUserMeeting(navigate, Data, t));
        }
      })
      .catch(async (response) => {
        dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
      });
  };
};

const ViewMeetingInit = () => {
  return {
    type: actions.VIEW_MEETING_INIT,
  };
};

const ViewMeetingSuccess = (response, message) => {
  return {
    type: actions.VIEW_MEETING_SUCESS,
    response: response,
    message: message,
  };
};

const ViewMeetingFail = (message) => {
  return {
    type: actions.VIEW_MEETING_FAIL,
    message: message,
  };
};

// View Meeting
const ViewMeeting = (
  navigate,
  object,
  t,
  setViewFlag,
  setEditFlag,
  setCalendarViewModal,
  no,
  setViewMeetingModal,
  setEditMeetingModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(ViewMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingByMeetingID.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            ViewMeeting(
              navigate,
              object,
              t,
              setViewFlag,
              setEditFlag,
              setCalendarViewModal,
              no,
              setViewMeetingModal,
              setEditMeetingModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_01".toLowerCase()
                )
            ) {
              await dispatch(
                ViewMeetingSuccess(response.data.responseResult, "")
              );
              if (no === 1) {
                setViewFlag(true);
                dispatch(scheduleMeetingPageFlag(false));
              } else if (no === 2) {
                dispatch(GetAllReminders(navigate, t));
                setEditFlag(true);
              } else if (no === 3) {
                setCalendarViewModal(true);
              } else if (no === 4) {
                setViewMeetingModal(true);
                dispatch(scheduleMeetingPageFlag(false));
              } else if (no === 5) {
                setEditMeetingModal(true);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_02".toLowerCase()
                )
            ) {
              await dispatch(ViewMeetingFail(t("No-records-found")));
              dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_03".toLowerCase()
                )
            ) {
              await dispatch(ViewMeetingFail(t("Something-went-wrong")));
              dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(ViewMeetingFail(t("Something-went-wrong")));
            dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(ViewMeetingFail(t("Something-went-wrong")));
          dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(ViewMeetingFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

//Cancel Meeting Init
const CancelMeetingInit = () => {
  return {
    type: actions.CANCEL_MEETING_INIT,
  };
};

//Cancel Meeting Success
const CancelMeetingSuccess = (response, message) => {
  return {
    type: actions.CANCEL_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

//Cancel Meeting Fail
const CancelMeetingFail = (message) => {
  return {
    type: actions.CANCEL_MEETING_FAIL,
    message: message,
  };
};

//Cancel Meeting
const CancelMeeting = (navigate, object, t, value) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = JSON.parse(localStorage.getItem("userID"));

  // let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 }
  return (dispatch) => {
    dispatch(CancelMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", cancelMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CancelMeeting(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CancelMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                CancelMeetingSuccess(
                  response.data.responseResult,
                  t("The-meeting-has-been-cancelled")
                )
              );
              if (value === 6) {
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
                let Data = {
                  CommitteeID: Number(ViewCommitteeID),
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(createrID),
                  PageNumber: 1,
                  Length: 50,
                  PublishedMeetings: true,
                };
                dispatch(getMeetingByCommitteeIDApi(navigate, t, Data));
              } else if (value === 7) {
                let ViewGroupID = localStorage.getItem("ViewGroupID");
                let Data = {
                  GroupID: Number(ViewGroupID),
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(createrID),
                  PageNumber: 1,
                  Length: 50,
                  PublishedMeetings: true,
                };
                dispatch(getMeetingbyGroupApi(navigate, t, Data));
              } else if (value === 4) {
                let meetingpageRow = localStorage.getItem("MeetingPageRows");
                let meetingPageCurrent = parseInt(
                  localStorage.getItem("MeetingPageCurrent")
                );
                let currentView = localStorage.getItem("MeetingCurrentView");
                let searchData = {
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(createrID),
                  PageNumber: Number(meetingPageCurrent),
                  Length: Number(meetingpageRow),
                  PublishedMeetings:
                    currentView && Number(currentView) === 1 ? true : false,
                };
        console.log("chek search meeting")
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CancelMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                CancelMeetingFail(
                  t("The-meeting-has-not-been-cancelled-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CancelMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(CancelMeetingFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(CancelMeetingFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(CancelMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(CancelMeetingFail(t("Something-went-wrong")));
      });
  };
};

//START Meeting Init
const StartMeetingInit = () => {
  return {
    type: actions.START_MEETING_INIT,
  };
};

//START Meeting Success
const StartMeetingSuccess = (response, message) => {
  return {
    type: actions.START_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

//START Meeting Fail
const StartMeetingFail = (message) => {
  return {
    type: actions.START_MEETING_FAIL,
    message: message,
  };
};

//START Meeting
const StartMeeting = (navigate, object, t, searchData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(StartMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", startMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(StartMeeting(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartMeeting_01".toLowerCase()
                )
            ) {
              localStorage.setItem("MeetingId", object.MeetingID);
              await dispatch(
                StartMeetingSuccess(
                  response.data.responseResult,
                  t("The-meeting-has-been-started")
                )
              );
              await dispatch(searchUserMeeting(navigate, searchData, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                StartMeetingFail(
                  t("The-Meeting-Has-not-Been-Started-Successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(StartMeetingFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartMeeting_04".toLowerCase()
                )
            ) {
              await dispatch(
                StartMeetingFail(
                  t("You-cannot-start-the-meeting-5-minute-before")
                )
              );
            } else {
              dispatch(StartMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(StartMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(StartMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(StartMeetingFail(t("Something-went-wrong")));
      });
  };
};

//START Meeting Init
const EndMeetingInit = () => {
  return {
    type: actions.START_MEETING_INIT,
  };
};

//START Meeting Success
const EndMeetingSuccess = (response, message) => {
  return {
    type: actions.START_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

//START Meeting Fail
const EndMeetingFail = (message) => {
  return {
    type: actions.START_MEETING_FAIL,
    message: message,
  };
};

//START Meeting
const EndMeeting = (navigate, object, t, searchData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(EndMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", endMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(EndMeeting(navigate, object, t, searchData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_EndMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                EndMeetingSuccess(
                  response.data.responseResult,
                  t("The-meeting-has-been-ended")
                )
              );

        console.log("chek search meeting")
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_EndMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                EndMeetingFail(t("The-meeting-has-not-been-ended"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_EndMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(EndMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(EndMeetingFail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        dispatch(EndMeetingFail(t("Something-went-wrong")));
        // dispatch(SetLoaderFalse());
      });
  };
};

const getAllRemindersSuccess = (response, message) => {
  return {
    type: actions.GET_REMINDERS_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllRemindersFail = (message) => {
  return {
    type: actions.GET_REMINDERS_FAIL,
    message: message,
  };
};

const GetAllReminders = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", getAllReminders.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllReminders(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_01".toLowerCase()
                )
            ) {
              await dispatch(
                getAllRemindersSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_02".toLowerCase()
                )
            ) {
              await dispatch(getAllRemindersFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_03".toLowerCase()
                )
            ) {
              await dispatch(getAllRemindersFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(getAllRemindersFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getAllRemindersFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllRemindersFail(t("Something-went-wrong")));
      });
  };
};

export {
  HideNotification,
  allAssignessList,
  ScheduleNewMeeting,
  ViewMeeting,
  cleareAssigneesState,
  UpdateMeeting,
  CancelMeeting,
  SetLoaderFalse,
  StartMeeting,
  EndMeeting,
  GetAllReminders,
  clearResponseMessage,
  meetingLoaderDashboard,
};
