import * as actions from "../action_types";
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
  scheduleMeetingPageFlag,
  searchNewUserMeeting,
  LeaveCurrentMeeting,
  JoinCurrentMeeting,
} from "./NewMeetingActions";
import { getCurrentDateTimeUTC } from "../../commen/functions/date_formater";
import { videoIconOrButtonState } from "./VideoFeature_actions";
import axiosInstance from "../../commen/functions/axiosInstance";
import { isFunction } from "../../commen/functions/utils";
import { toggleViewMeetingModal } from "./ModalStates_actions";
import { getMeetingByCommitteeIdApi } from "./Committee_actions";
import { getMeetingbyGroupIdApi } from "./Groups_actions";
import { listOfMeetingsApi } from "./NewMeeting2.actions";

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
  return (dispatch) => {
    dispatch(getAllCommitteesUsersandGroups_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getAllGroupsUsersAndCommitteesByOrganizaitonID.RequestMethod,
    );
    axiosInstance
      .post(meetingApi, form)
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
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_01".toLowerCase(),
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_success(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_02".toLowerCase(),
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t("No-records-found")),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_03".toLowerCase(),
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t("Something-went-wrong")),
              );
            } else {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t("Something-went-wrong")),
              );
            }
          } else {
            dispatch(
              getAllCommitteesUsersandGroups_fail(t("Something-went-wrong")),
            );
          }
        } else {
          dispatch(
            getAllCommitteesUsersandGroups_fail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAllCommitteesUsersandGroups_fail(t("Something-went-wrong")),
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
  let Data2 = { MeetingID: currentMeeting };

  return async (dispatch) => {
    dispatch(saveMeetingOrganizers_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", saveMeetingOrganizers.RequestMethod);
    await axiosInstance
      .post(meetingApi, form)
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
                  "Meeting_MeetingServiceManager_SaveMeetingOrganizers_01".toLowerCase(),
                )
            ) {
              await dispatch(
                saveMeetingOrganizers_success(
                  response.data.responseResult,
                  "",
                ),
              );
              dispatch(GetAllMeetingOrganizers(Data2, navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingOrganizers_02".toLowerCase(),
                )
            ) {
              dispatch(
                saveMeetingOrganizers_fail(
                  t("Organizers-not-saved-successfully"),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingOrganizers_03".toLowerCase(),
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
  return (dispatch) => {
    dispatch(getAllMeetingOrganizers_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllMeetingOrganizers.RequestMethod);
    axiosInstance
      .post(meetingApi, form)
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
                  "Meeting_MeetingServiceManager_GetAllMeetingOrganizers_01".toLowerCase(),
                )
            ) {
              dispatch(
                getAllMeetingOrganizers_success(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingOrganizers_02".toLowerCase(),
                )
            ) {
              dispatch(getAllMeetingOrganizers_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingOrganizers_03".toLowerCase(),
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
  return (dispatch) => {
    dispatch(sendNotificationOrganizerInit());
    let form = new FormData();
    form.append("RequestMethod", sendNotification.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(meetingApi, form)
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
                  "Meeting_MeetingServiceManager_SendRecentNotifications_01".toLowerCase(),
                )
            ) {
              dispatch(
                sendNotificationOrganizerSuccess(
                  t("Notification-sent-successfully"),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SendRecentNotifications_02".toLowerCase(),
                )
            ) {
              dispatch(
                sendNotificationOrganizerFail(
                  t("Notification-not-sent-successfully"),
                ),
              );
            } else {
              dispatch(
                sendNotificationOrganizerFail(t("Something-went-wrong")),
              );
            }
          } else {
            dispatch(sendNotificationOrganizerFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(sendNotificationOrganizerFail(t("Something-went-wrong")));
        }
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
  GetAllMeetingOrganizers,
  saveMeetingFlag,
  editMeetingFlag,
  notificationSendData,
  sendNotificationOrganizer,
  notificationUpdateData,
  getAllMeetingOrganizers_fail,
};
