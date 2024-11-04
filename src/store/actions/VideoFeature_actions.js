import axios from "axios";
import {
  hideUnHidePaticipantVideo,
  muteUnMuteParticipant,
} from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

const videoChatPanel = (response) => {
  return {
    type: actions.VIDEO_CHAT_FLAG,
    response: response,
  };
};

const contactVideoFlag = (response) => {
  return {
    type: actions.CONTACT_VIDEO_FLAG,
    response: response,
  };
};

const recentVideoFlag = (response) => {
  return {
    type: actions.RECENT_VIDEO_FLAG,
    response: response,
  };
};

const videoChatSearchFlag = (response) => {
  return {
    type: actions.VIDEO_CHAT_SEARCH_FLAG,
    response: response,
  };
};

const videoCallOTOFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_OTO_FLAG,
    response: response,
  };
};

const endVideoCallFlag = (response) => {
  return {
    type: actions.END_VIDEO_CALL_FLAG,
    response: response,
  };
};

const videoCallGroupFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_GROUP_FLAG,
    response: response,
  };
};

const videoCallNormalScreenFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_NORMAL_SCREEN_FLAG,
    response: response,
  };
};

const videoCallMinimizeScreenFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MINIMIZE_SCREEN_FLAG,
    response: response,
  };
};

const videoCallMaximizeScreenFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MAXIMIZE_SCREEN_FLAG,
    response: response,
  };
};

const videoCallNormalHeaderFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_NORMAL_HEADER_FLAG,
    response: response,
  };
};

const videoCallMinimizeHeaderFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MINIMIZE_HEADER_FLAG,
    response: response,
  };
};

const videoCallMaximizeHeaderFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MAXIMIZE_HEADER_FLAG,
    response: response,
  };
};

const videoIncomingCallFlag = (response) => {
  return {
    type: actions.VIDEO_INCOMING_CALL_MAX,
    response: response,
  };
};

const chatEnableNormalFlag = (response) => {
  return {
    type: actions.CHAT_ENABLE_NORMAL_FLAG,
    response: response,
  };
};

const agendaEnableNormalFlag = (response) => {
  return {
    type: actions.AGENDA_ENABLE_NORMAL_FLAG,
    response: response,
  };
};

const minutesMeetingEnableNormalFlag = (response) => {
  return {
    type: actions.MINUTES_MEETING_ENABLE_NORMAL_FLAG,
    response: response,
  };
};

const videoOutgoingCallFlag = (response) => {
  return {
    type: actions.VIDEO_OUTGOING_CALL_MAX,
    response: response,
  };
};

const videoMultipleCallFlag = (response) => {
  return {
    type: actions.VIDEO_MULTIPLE_CALL_MAX,
    response: response,
  };
};

const videoChatOpenFlag = (response) => {
  return {
    type: actions.VIDEO_MAX_CHAT_OPEN,
    response: response,
  };
};

const videoAgendaOpenFlag = (response) => {
  return {
    type: actions.VIDEO_MAX_AGENDA_OPEN,
    response: response,
  };
};

const videoMinutesOpenFlag = (response) => {
  return {
    type: actions.VIDEO_MAX_MINUTES_OPEN,
    response: response,
  };
};

const minimizeVideoPanelFlag = (response) => {
  return {
    type: actions.MINIMIZE_VIDEO_PANEL,
    response: response,
  };
};

const normalizeVideoPanelFlag = (response) => {
  return {
    type: actions.NORMALIZE_VIDEO_PANEL,
    response: response,
  };
};

const maximizeVideoPanelFlag = (response) => {
  return {
    type: actions.MAXIMIZE_VIDEO_PANEL,
    response: response,
  };
};

const incomingVideoCallFlag = (response) => {
  return {
    type: actions.INCOMING_VIDEO_FLAG,
    response: response,
  };
};

const leaveCallModal = (response) => {
  return {
    type: actions.LEAVE_CALL_MODAL,
    response: response,
  };
};

const participantPopup = (response) => {
  return {
    type: actions.PARTICIPANT_POPUP_FLAG,
    response: response,
  };
};

const minimizeParticipantPopup = (response) => {
  return {
    type: actions.MINIMIZE_PARTICIPANT_POPUP_FLAG,
    response: response,
  };
};

const videoChatMessagesFlag = (response) => {
  return {
    type: actions.VIDEO_CHAT_MESSAGES_FLAG,
    response: response,
  };
};

//Aun Work

const guestJoinPopup = (response) => {
  return {
    type: actions.GUEST_JOIN_POPUP,
    response: response,
  };
};

const participantWaitingListBox = (response) => {
  console.log(response, "responseresponseresponse");
  return {
    type: actions.PARTICIPANT_LIST_USERS,
    response: response,
  };
};

const participantWaitingList = (response) => {
  console.log(response, "responseresponse");
  return {
    type: actions.PARTICIPANT_JOINT_REQUESTS,
    response: response,
  };
};

const participantAcceptandReject = (response) => {
  return {
    type: actions.ACCEPT_AND_REMOVE_PARTICIPANTS,
    payload: response,
  };
};

const guestLeaveVideoMeeting = (response) => {
  return {
    type: actions.GUEST_PARTICIPANT_LEAVE_VIDEO,
    payload: response,
  };
};

const participanMuteUnMuteMeeting = (response) => {
  return {
    type: actions.PARTICIPANT_MUTEUNMUTE_VIDEO,
    payload: response,
  };
};

const participanRaisedUnRaisedHand = (response) => {
  return {
    type: actions.PARTICIPANT_RAISEDUNRAISEDHAND_VIDEO,
    payload: response,
  };
};

const participantHideUnhideVideo = (response) => {
  return {
    type: actions.PARTICIPANT_HIDEUNHIDE_VIDEO,
    payload: response,
  };
};

const muteUnmuteInit = () => {
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANT_INIT,
  };
};

const muteUnmuteSuccess = (response, message) => {
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANT_SUCCESS,
    response: response,
    message: message,
  };
};

const muteUnmuteFail = (message) => {
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANT_FAIL,
    message: message,
  };
};

const muteUnMuteParticipantMainApi = (
  navigate,
  t,
  data,
  setParticipantData,
  flag
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(muteUnmuteInit());
    let form = new FormData();
    form.append("RequestMethod", muteUnMuteParticipant.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

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
            muteUnMuteParticipantMainApi(
              navigate,
              t,
              data,
              setParticipantData,
              flag
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteParticpant_01".toLowerCase()
                )
            ) {
              await dispatch(
                muteUnmuteSuccess(response.data.responseResult, t("Successful"))
              );
              setParticipantData((prevState) =>
                prevState.map((stateData) => {
                  // Check if the current participant's UID exists in the MuteUnMuteList
                  const findData = data.MuteUnMuteList.find(
                    (uidData) => String(uidData.UID) === String(stateData.UID)
                  );
                  console.log(findData, flag, "findDatafindData");
                  if (findData !== undefined) {
                    // If found, return a new object with the updated 'isMuted' property
                    return {
                      ...stateData,
                      isMute: flag, // flag should be a boolean indicating mute/unmute
                    };
                  }
                  console.log(stateData, "findDatafindData");

                  // If not found, return the original stateData
                  return stateData;
                })
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteParticpant_02".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteFail(t("Invalid-request-data-2")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteParticpant_03".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteParticpant_04".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteFail(t("UnSuccessful")));
            }
          } else {
            await dispatch(muteUnmuteFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(muteUnmuteFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(muteUnmuteFail(t("Something-went-wrong")));
      });
  };
};

const hideUnHideParticipantGuestInit = () => {
  return {
    type: actions.HIDE_UNHIDE_PARTICIPANT_GUEST_VIDEO_INIT,
  };
};

const hideUnHideParticipantGuestSuccess = (response, message) => {
  return {
    type: actions.HIDE_UNHIDE_PARTICIPANT_GUEST_VIDEO_SUCCESS,
    response: response,
    message: message,
  };
};

const hideUnHideParticipantGuestFail = (message) => {
  return {
    type: actions.HIDE_UNHIDE_PARTICIPANT_GUEST_VIDEO_FAIL,
    message: message,
  };
};

const hideUnHideParticipantGuestMainApi = (
  navigate,
  t,
  data,
  setParticipantData,
  flag
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(hideUnHideParticipantGuestInit());
    let form = new FormData();
    form.append("RequestMethod", hideUnHidePaticipantVideo.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

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
            hideUnHideParticipantGuestMainApi(
              navigate,
              t,
              data,
              setParticipantData,
              flag
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideParticpantVideo_01".toLowerCase()
                )
            ) {
              await dispatch(
                hideUnHideParticipantGuestSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );

              setParticipantData((prevState) =>
                prevState.map((stateData) => {
                  if (stateData.UID === data.UIDList[0]) {
                    return {
                      ...stateData,
                      hideVideo: flag,
                    };
                  }
                  return stateData;
                })
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideParticpantVideo_02".toLowerCase()
                )
            ) {
              await dispatch(
                hideUnHideParticipantGuestFail(t("Invalid-request-data-2"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideParticpantVideo_03".toLowerCase()
                )
            ) {
              await dispatch(
                hideUnHideParticipantGuestFail(t("Something-went-wrong"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideParticpantVideo_04".toLowerCase()
                )
            ) {
              await dispatch(hideUnHideParticipantGuestFail(t("UnSuccessful")));
            }
          } else {
            await dispatch(
              hideUnHideParticipantGuestFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            hideUnHideParticipantGuestFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(hideUnHideParticipantGuestFail(t("Something-went-wrong")));
      });
  };
};

export {
  participantAcceptandReject,
  participantWaitingList,
  participantWaitingListBox,
  videoChatPanel,
  contactVideoFlag,
  recentVideoFlag,
  videoChatSearchFlag,
  videoCallOTOFlag,
  endVideoCallFlag,
  videoCallGroupFlag,
  videoCallNormalScreenFlag,
  videoCallMinimizeScreenFlag,
  videoCallMaximizeScreenFlag,
  videoCallNormalHeaderFlag,
  videoCallMinimizeHeaderFlag,
  videoCallMaximizeHeaderFlag,
  videoIncomingCallFlag,
  chatEnableNormalFlag,
  agendaEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
  videoOutgoingCallFlag,
  videoMultipleCallFlag,
  videoChatOpenFlag,
  videoAgendaOpenFlag,
  videoMinutesOpenFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  incomingVideoCallFlag,
  leaveCallModal,
  participantPopup,
  minimizeParticipantPopup,
  videoChatMessagesFlag,
  guestJoinPopup,
  guestLeaveVideoMeeting,
  participanMuteUnMuteMeeting,
  participanRaisedUnRaisedHand,
  participantHideUnhideVideo,
  muteUnMuteParticipantMainApi,
  hideUnHideParticipantGuestMainApi,
};
