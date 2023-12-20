import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import {
  getAllGroupsUsersAndCommitteesByOrganizaitonID,
  saveMeetingOrganizers,
  meetingStatusUpdate,
  getAllMeetingOrganizers,
  sendNotification,
} from "../../commen/apis/Api_config";
import { setLoaderFalse } from "./MeetingAgenda_action";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import {
  GetAllMeetingDetailsApiFunc,
  searchNewUserMeeting,
} from "./NewMeetingActions";
import { ViewMeeting } from "./Get_List_Of_Assignees";

const getAllCommitteesUsersandGroups_init = () => {
  return {
    type: actions.GETALLCOMMITTEESUSERSANDGROUPS_INIT,
  };
};
const getAllCommitteesUsersandGroups_success = (response, message) => {
  return {
    type: actions.GETALLCOMMITTEESUSERSANDGROUPS_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllCommitteesUsersandGroups_fail = (message) => {
  return {
    type: actions.GETALLCOMMITTEESUSERSANDGROUPS_FAIL,
    message: message,
  };
};
const GetAllCommitteesUsersandGroups = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllCommitteesUsersandGroups_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getAllGroupsUsersAndCommitteesByOrganizaitonID.RequestMethod
    );
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
          dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_02".toLowerCase()
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t("No-records-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllCommitteesUsersandGroups_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getAllCommitteesUsersandGroups_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAllCommitteesUsersandGroups_fail(t("Something-went-wrong"))
        );
      });
  };
};

const meetingOrganizers = (response) => {
  return {
    type: actions.GET_MEETING_ORGANIZERS,
    response: response,
  };
};

const selectedMeetingOrganizers = (response) => {
  return {
    type: actions.SELECTED_MEETING_ORGANIZERS,
    response: response,
  };
};

// save meeting organizers Init
const saveMeetingOrganizers_init = () => {
  return {
    type: actions.SAVE_MEETINGORGANIZERS_INIT,
  };
};

// save meeting organizers success
const saveMeetingOrganizers_success = (response, message) => {
  return {
    type: actions.SAVE_MEETINGORGANIZERS_SUCCESS,
    response: response,
    message: message,
  };
};

// save meeting organizers fail
const saveMeetingOrganizers_fail = (message) => {
  return {
    type: actions.SAVE_MEETINGORGANIZERS_FAIL,
    message: message,
  };
};

// Save Meeting Organizers Api
const SaveMeetingOrganizers = (navigate, Data, t, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data2 = { MeetingID: currentMeeting };

  return async (dispatch) => {
    dispatch(saveMeetingOrganizers_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", saveMeetingOrganizers.RequestMethod);
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
          dispatch(SaveMeetingOrganizers(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingOrganizers_01".toLowerCase()
                )
            ) {
              await dispatch(
                saveMeetingOrganizers_success(
                  response.data.responseResult,
                  t("Organizers-saved-successfully")
                )
              );
              dispatch(GetAllMeetingOrganizers(Data2, navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingOrganizers_02".toLowerCase()
                )
            ) {
              dispatch(
                saveMeetingOrganizers_fail(
                  t("Organizers-not-saved-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingOrganizers_03".toLowerCase()
                )
            ) {
              dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
            } else {
              dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
      });
  };
};

// save meeting organizers Init
const updateOrganizerMeetingStatus_init = () => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_INIT,
  };
};

// save meeting organizers success
const updateOrganizerMeetingStatus_success = (response, message) => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_SUCCESS,
    response: response,
    message: message,
  };
};

// save meeting organizers fail
const updateOrganizerMeetingStatus_fail = (message) => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_FAIL,
    message: message,
  };
};

// Save Meeting Organizers Api
const UpdateOrganizersMeeting = (
  navigate,
  t,
  route,
  Data,
  setEdiorRole,
  setAdvanceMeetingModalID,
  setDataroomMapFolderId,
  // THIS IS FOR OPEN MODAL FOR QUICK OR FOR ADVANCE
  setSceduleMeeting,
  // THIS IS FOR QUICK MEETINGS CHECK
  setViewFlag,
  setEditFlag,
  setCalendarViewModal,
  dashboardFlag
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(updateOrganizerMeetingStatus_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", meetingStatusUpdate.RequestMethod);
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
          dispatch(
            UpdateOrganizersMeeting(
              navigate,
              t,
              route,
              Data,
              setEdiorRole,
              setAdvanceMeetingModalID,
              setDataroomMapFolderId,
              // THIS IS FOR OPEN MODAL FOR QUICK OR FOR ADVANCE
              setSceduleMeeting,
              // THIS IS FOR QUICK MEETINGS CHECK
              setViewFlag,
              setEditFlag,
              setCalendarViewModal,
              dashboardFlag
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_01".toLowerCase()
                )
            ) {
              try {
                await dispatch(
                  updateOrganizerMeetingStatus_success(
                    response.data.responseResult,
                    route === 5
                      ? t("Meeting-published-successfully")
                      : route === 4
                      ? t("Meeting-started-successfully")
                      : ""
                  )
                );
                dispatch(setLoaderFalse(false));
                if (route === 3) {
                  let requestDataForMeetingDetails = {
                    MeetingID: Number(Data.MeetingID),
                  };
                  await dispatch(
                    GetAllMeetingDetailsApiFunc(
                      navigate,
                      t,
                      requestDataForMeetingDetails,
                      true,
                      setAdvanceMeetingModalID,
                      setSceduleMeeting,
                      setDataroomMapFolderId
                    )
                  );
                  // setPublishState(true);
                  setEdiorRole({
                    status: "10",
                    role: "Organizer",
                  });
                } else if (route === 4) {
                  let requestDataForMeetingDetails = {
                    MeetingID: Number(Data.MeetingID),
                  };
                  await dispatch(
                    ViewMeeting(
                      navigate,
                      requestDataForMeetingDetails,
                      t,
                      setViewFlag,
                      setEditFlag,
                      setCalendarViewModal,
                      1
                    )
                  );
                  setAdvanceMeetingModalID(Data.MeetingID);
                  setEdiorRole({
                    status: "10",
                    role: "Organizer",
                  });
                  if (dashboardFlag) {
                    navigate("/Diskus/Meeting");
                  }
                } else if (route === 5) {
                  let currentView = localStorage.getItem("MeetingCurrentView");
                  let meetingpageRow = localStorage.getItem("MeetingPageRows");
                  let meetingPageCurrent = parseInt(
                    localStorage.getItem("MeetingPageCurrent")
                  );
                  let userID = localStorage.getItem("userID");
                  let searchData = {
                    Date: "",
                    Title: "",
                    HostName: "",
                    UserID: Number(userID),
                    PageNumber:
                      meetingPageCurrent !== null
                        ? Number(meetingPageCurrent)
                        : 1,
                    Length:
                      meetingpageRow !== null ? Number(meetingpageRow) : 50,
                    PublishedMeetings:
                      currentView && Number(currentView) === 1 ? true : false,
                  };
                  await dispatch(searchNewUserMeeting(navigate, searchData, t));
                  setSceduleMeeting(false);
                } else {
                  // setPublishState(Data.MeetingID);
                }
              } catch {}
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_02".toLowerCase()
                )
            ) {
              dispatch(
                updateOrganizerMeetingStatus_fail(t("Record-not-updated"))
              );
              dispatch(setLoaderFalse(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_03".toLowerCase()
                )
            ) {
              dispatch(
                updateOrganizerMeetingStatus_fail(t("Something-went-wrong"))
              );
              dispatch(setLoaderFalse(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_04".toLowerCase()
                )
            ) {
              dispatch(
                updateOrganizerMeetingStatus_fail(
                  t("Add-meeting-agenda-to-publish")
                )
              );
              dispatch(setLoaderFalse(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_05".toLowerCase()
                )
            ) {
              dispatch(
                updateOrganizerMeetingStatus_fail(
                  t("Add-meeting-organizers-to-publish")
                )
              );
              dispatch(setLoaderFalse(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_06".toLowerCase()
                )
            ) {
              dispatch(
                updateOrganizerMeetingStatus_fail(
                  t("Add-meeting-participants-to-publish")
                )
              );
              dispatch(setLoaderFalse(false));
            } else {
              dispatch(
                updateOrganizerMeetingStatus_fail(t("Something-went-wrong"))
              );
              dispatch(setLoaderFalse(false));
            }
          } else {
            dispatch(
              updateOrganizerMeetingStatus_fail(t("Something-went-wrong"))
            );
            dispatch(setLoaderFalse(false));
          }
        } else {
          dispatch(
            updateOrganizerMeetingStatus_fail(t("Something-went-wrong"))
          );
          dispatch(setLoaderFalse(false));
        }
      })
      .catch((response) => {
        dispatch(updateOrganizerMeetingStatus_fail(t("Something-went-wrong")));
        dispatch(setLoaderFalse(false));
      });
  };
};

const clearResponseMessage = (message) => {
  return {
    type: actions.CLEAR_RESPONSEMESSAGE_MO,
    message: message,
  };
};

const getAllMeetingOrganizers_init = () => {
  return {
    type: actions.GETALLMEETINGORGANIZERS_INIT,
  };
};
const getAllMeetingOrganizers_success = (response, message) => {
  return {
    type: actions.GETALLMEETINGORGANIZERS_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllMeetingOrganizers_fail = (message) => {
  return {
    type: actions.GETALLMEETINGORGANIZERS_FAIL,
    message: message,
  };
};
const GetAllMeetingOrganizers = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllMeetingOrganizers_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllMeetingOrganizers.RequestMethod);
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
          dispatch(GetAllMeetingOrganizers(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingOrganizers_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllMeetingOrganizers_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingOrganizers_02".toLowerCase()
                )
            ) {
              dispatch(getAllMeetingOrganizers_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingOrganizers_03".toLowerCase()
                )
            ) {
              dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
            } else {
              dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
      });
  };
};

const saveMeetingFlag = (response) => {
  return {
    type: actions.SAVE_MEETING_FLAG,
    response: response,
  };
};

const editMeetingFlag = (response) => {
  return {
    type: actions.EDIT_MEETING_FLAG,
    response: response,
  };
};

const notificationSendData = (response) => {
  return {
    type: actions.NOTIFICATION_SEND_DATA,
    response: response,
  };
};

const notificationUpdateData = (response) => {
  return {
    type: actions.NOTIFICATION_UPDATE_DATA,
    response: response,
  };
};

//Send Notification Api
const sendNotificationOrganizerInit = () => {
  return {
    type: actions.SEND_NOTIFICATION_ORGANIZER_INIT,
  };
};

const sendNotificationOrganizerSuccess = (message) => {
  return {
    type: actions.SEND_NOTIFICATION_ORGANIZER_SUCCESS,
    message: message,
  };
};

const sendNotificationOrganizerFail = (message) => {
  return {
    type: actions.SEND_NOTIFICATION_ORGANIZER_FAIL,
    message: message,
  };
};

//Send Notification API Function
const sendNotificationOrganizer = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(sendNotificationOrganizerInit());
    let form = new FormData();
    form.append("RequestMethod", sendNotification.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
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
          dispatch(sendNotificationOrganizer(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SendRecentNotifications_01".toLowerCase()
                )
            ) {
              dispatch(
                sendNotificationOrganizerSuccess(
                  t("Notification-sent-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SendRecentNotifications_02".toLowerCase()
                )
            ) {
              dispatch(
                sendNotificationOrganizerFail(
                  t("Notification-not-sent-successfully")
                )
              );
            } else {
              dispatch(
                sendNotificationOrganizerFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(sendNotificationOrganizerFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(sendNotificationOrganizerFail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(sendNotificationOrganizerFail(t("Something-went-wrong")));
      });
  };
};

export {
  GetAllCommitteesUsersandGroups,
  meetingOrganizers,
  selectedMeetingOrganizers,
  SaveMeetingOrganizers,
  clearResponseMessage,
  UpdateOrganizersMeeting,
  GetAllMeetingOrganizers,
  saveMeetingFlag,
  editMeetingFlag,
  notificationSendData,
  sendNotificationOrganizer,
  notificationUpdateData,
  getAllMeetingOrganizers_fail,
};
