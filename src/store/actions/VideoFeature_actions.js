import axios from "axios";
import {
  getVideoCallParticipantsAndWaitingList,
  getVideoCallParticipantsForGuest,
  hideUnHidePaticipantVideo,
  joinMeetingVideoRequest,
  muteUnMuteParticipant,
} from "../../commen/apis/Api_config";
import { meetingApi, videoApi } from "../../commen/apis/Api_ends_points";
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
  console.log(response, "responseDataDataData");
  return {
    type: actions.GUEST_PARTICIPANT_LEAVE_VIDEO,
    payload: response,
  };
};

const participanMuteUnMuteMeeting = (response, flag) => {
  console.log(response, "responseresponseresponsedatat");
  return {
    type: actions.PARTICIPANT_MUTEUNMUTE_VIDEO,
    payload: response,
    flag: flag,
  };
};

const participanRaisedUnRaisedHand = (response) => {
  return {
    type: actions.PARTICIPANT_RAISEDUNRAISEDHAND_VIDEO,
    payload: response,
  };
};

const participantHideUnhideVideo = (response) => {
  console.log(response, "responseresponse");
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

const muteUnMuteParticipantMainApi = (navigate, t, data) => {
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
          dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
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
              // setNewParticipants((prevState) =>
              //   prevState.map((stateData) => {
              //     console.log(stateData, "stateDatastateData");
              //     // Check if the current participant's UID exists in the MuteUnMuteList
              //     const findData = data.MuteUnMuteList.find(
              //       (uidData) => String(uidData.UID) === String(stateData.guid)
              //     );
              //     console.log(findData, flag, "findDatafindData");
              //     if (findData !== undefined) {
              //       // If found, return a new object with the updated 'isMuted' property
              //       return {
              //         ...stateData,
              //         mute: flag, // flag should be a boolean indicating mute/unmute
              //       };
              //     }
              //     console.log(stateData, "findDatafindData");

              //     // If not found, return the original stateData
              //     return stateData;
              //   })
              // );
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

const hideUnHideParticipantGuestMainApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log(data, "hdjvdasdvasjvhasjdv");
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
          dispatch(hideUnHideParticipantGuestMainApi(navigate, t, data));
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

              // setNewParticipants((prevState) =>
              //   prevState.map((stateData) => {
              //     console.log(stateData, "stateDatastateDatastateData");
              //     if (stateData.guid === data.UIDList[0]) {
              //       return {
              //         ...stateData,
              //         hideCamera: flag,
              //       };
              //     }
              //     return stateData;
              //   })
              // );
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

const getParticipantsNewJoin = (response) => {
  console.log(response, "responseresponseresponse");
  return {
    type: actions.GET_MEETING_NEW_PARTICIPANT_JOIN,
    response: response,
  };
};

const getParticipantMeetingJoinInit = () => {
  return {
    type: actions.JOIN_MEETING_VIDEO_REQUEST_INIT,
  };
};

const getParticipantMeetingJoinSuccess = (response, message) => {
  return {
    type: actions.JOIN_MEETING_VIDEO_REQUEST_SUCCESS,
    response: response,
    message: message,
  };
};

const getParticipantMeetingJoinFail = (message) => {
  return {
    type: actions.JOIN_MEETING_VIDEO_REQUEST_FAIL,
    message: message,
  };
};

const getParticipantMeetingJoinMainApi = (
  navigate,
  t,
  data,
  setIsWaiting,
  setGetReady,
  setJoinButton
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getParticipantMeetingJoinInit());
    let form = new FormData();
    form.append("RequestMethod", joinMeetingVideoRequest.RequestMethod);
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
            getParticipantMeetingJoinMainApi(
              navigate,
              t,
              data,
              setIsWaiting,
              setGetReady,
              setJoinButton
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeetingVideoRequest_01".toLowerCase()
                )
            ) {
              const meetingHost = {
                isHost: false,
                isHostId: 0,
                isDashboardVideo: true,
              };
              await dispatch(makeHostNow(meetingHost));
              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
              // await dispatch(maxHostVideoCallPanel(false));
              // dispatch(maximizeVideoPanelFlag(true));
              try {
                setIsWaiting(true);
                setGetReady(false);
                setJoinButton(false);
              } catch {}
              await dispatch(
                getParticipantMeetingJoinSuccess(
                  response.data.responseResult,
                  t("Join-request-sent-to-host")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeetingVideoRequest_02".toLowerCase()
                )
            ) {
              await dispatch(maxHostVideoCallPanel(false));
              localStorage.setItem("activeCall", true);
              localStorage.setItem("CallType", 2);
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("isMeetingVideo", true);

              let Data = { RoomID: response.data.responseResult.roomID };
              await dispatch(
                participantListWaitingListMainApi(Data, navigate, t)
              );
              dispatch(maximizeVideoPanelFlag(true));
              localStorage.setItem(
                "newRoomId",
                response.data.responseResult.roomID
              );
              localStorage.setItem(
                "isHost",
                response.data.responseResult.isHost
              );
              const meetingHost = {
                isHost: response.data.responseResult.isHost,
                isHostId: Number(localStorage.getItem("userID")),
                isDashboardVideo: true,
              };
              dispatch(makeHostNow(meetingHost));
              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
              localStorage.setItem("isGuid", response.data.responseResult.guid);
              localStorage.setItem(
                "isEmail",
                response.data.responseResult.email
              );
              localStorage.setItem(
                "hostUrl",
                response.data.responseResult.videoURL
              );
              await dispatch(
                getParticipantMeetingJoinSuccess(
                  t("ScheduleCall-joined-and-is-host")
                )
              );
              try {
                setJoinButton(false);
              } catch {}
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeetingVideoRequest_03".toLowerCase()
                )
            ) {
              try {
                setJoinButton(false);
              } catch {}
              await dispatch(
                getParticipantMeetingJoinFail(
                  t("invalid-video-call-url-provided")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeetingVideoRequest_04".toLowerCase()
                )
            ) {
              try {
                setJoinButton(false);
              } catch {}
              await dispatch(
                getParticipantMeetingJoinFail(t("Could-not-join-call"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeetingVideoRequest_05".toLowerCase()
                )
            ) {
              try {
                setJoinButton(false);
              } catch {}
              await dispatch(
                getParticipantMeetingJoinFail(t("Something-went-wrong"))
              );
            }
          } else {
            try {
              setJoinButton(false);
            } catch {}
            await dispatch(
              getParticipantMeetingJoinFail(t("Something-went-wrong"))
            );
          }
        } else {
          try {
            setJoinButton(false);
          } catch {}
          await dispatch(
            getParticipantMeetingJoinFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        try {
          setJoinButton(false);
        } catch {}
        dispatch(getParticipantMeetingJoinFail(t("Something-went-wrong")));
      });
  };
};

const maxHostVideoCallPanel = (response) => {
  console.log(response, "responseresponse");
  return {
    type: actions.MAX_HOST_VIDEO_CALL_PANEL,
    response: response,
  };
};

const normalHostVideoCallPanel = (response) => {
  console.log(response, "True");

  return {
    type: actions.NORMAL_HOST_VIDEO_CALL_PANEL,
    response: response,
  };
};

// FOR PARTICIPANT MAX PANEL
const maxParticipantVideoCallPanel = (response) => {
  return {
    type: actions.MAX_PARTICIPANT_VIDEO_CALL_PANEL,
    response: response,
  };
};

// For Denied Max Patrticipant Video Compnent
const maxParticipantVideoDenied = (response) => {
  console.log(response, "MAX_PARTICIPANT_VIDEO_DENIED");
  return {
    type: actions.MAX_PARTICIPANT_VIDEO_DENIED,
    response: response,
  };
};

// For Removed Max Patrticipant Video Compnent
const maxParticipantVideoRemoved = (response) => {
  console.log(response, "MAX_PARTICIPANT_VIDEO_REMOVED");

  return {
    type: actions.MAX_PARTICIPANT_VIDEO_REMOVED,
    response: response,
  };
};

const participantListAndWaitingListInit = () => {
  return {
    type: actions.GET_VIDEO_CALL_PARTICIPANT_AND_WAITING_LIST_INIT,
  };
};

const participantListAndWaitingListSuccess = (response, message) => {
  return {
    type: actions.GET_VIDEO_CALL_PARTICIPANT_AND_WAITING_LIST_SUCCESS,
    response: response,
    message: message,
  };
};

const participantListAndWaitingListFail = (message) => {
  return {
    type: actions.GET_VIDEO_CALL_PARTICIPANT_AND_WAITING_LIST_FAIL,
    message: message,
  };
};

const participantListWaitingListMainApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(participantListAndWaitingListInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getVideoCallParticipantsAndWaitingList.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(participantListWaitingListMainApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipantsAndWaitingList_01".toLowerCase()
                )
            ) {
              await dispatch(
                participantListAndWaitingListSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipantsAndWaitingList_02".toLowerCase()
                )
            ) {
              await dispatch(
                participantListAndWaitingListFail(t("UnSuccessful"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipantsAndWaitingList_03".toLowerCase()
                )
            ) {
              await dispatch(
                participantListAndWaitingListFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              participantListAndWaitingListFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            participantListAndWaitingListFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getParticipantMeetingJoinFail(t("Something-went-wrong")));
      });
  };
};

//FOR NAVIGATE PARTICIPANT SCREEN
const participantVideoNavigationScreen = (response) => {
  return {
    type: actions.PARTICIPANT_VIDEO_SCREEN_NAVIGATION,
    response: response,
  };
};

// SET HOST VIDEO CAMERA
const setVideoControlHost = (response) => {
  console.log(response, "datadtadttadtadta");
  return {
    type: actions.SET_MQTT_VIDEO_CONTROLE_HOST,
    response: response,
  };
};

// SET HOST AUDIO CONTROL
const setAudioControlHost = (response) => {
  console.log(response, "datadtadttadtadta");
  return {
    type: actions.SET_MQTT_VOICE_CONTROLE_HOST,
    response: response,
  };
};

// Get Video Url For Partcipants
const getVideoUrlForParticipant = (response) => {
  console.log(response, "urlurlurlurlurl");
  return {
    type: actions.GET_VIDEOURL_PARTICIPANT,
    response: response,
  };
};

// SET MQTTT FOR VOICE PARTICIPANT
const setAudioControlForParticipant = (response) => {
  console.log(response, "datadtadttadtadta");
  return {
    type: actions.SET_MQTT_VOICE_PARTICIPANT,
    response: response,
  };
};

// SET HOST VIDEO CAMERA
const setVideoControlForParticipant = (response) => {
  console.log(response, "datadtadttadtadta");
  return {
    type: actions.SET_MQTT_VIDEO_MEETING_PARTICIPANT,
    response: response,
  };
};

// SET MQTTT FOR VOICE PARTICIPANT
const setRaisedUnRaisedParticiant = (response) => {
  console.log(response, "datadtadttadtadta");
  return {
    type: actions.SET_RAISED_UNRAISED_PPARTICIPANT,
    response: response,
  };
};

//Normal Participant Video Component
const normalParticipantVideoCallPanel = (response) => {
  return {
    type: actions.PARTICIPANT_VIDEO_CALL_NORMAL_PANEL,
    response: response,
  };
};

// CHECK WHOSE IS THE HOST NOW
const checkHostNow = (response) => {
  console.log(response, "responseresponseMakeHost");
  return {
    type: actions.CHECK_HOST_HOST_NOW,
    response: response,
  };
};

const makeHostNow = (response) => {
  console.log(response, "responseresponseMakeHost");
  return {
    type: actions.MAKE_HOST_HOST_NOW,
    response: response,
  };
};
const setMicState = (isEnabled) => ({
  type: actions.MIC_ENABLE_WHEN_HOST_PANEL_MIC_ENABLE,
  payload: isEnabled,
});
const setVideoState = (isEnabled) => ({
  type: actions.VIDEO_ENABLE_WHEN_HOST_PANEL_VIDEO_ENABLE,
  payload: isEnabled,
});

const participantLeaveVideoMeeting = (response) => {
  console.log(response, "responseDataDataData");
  return {
    type: actions.VIDEO_PARTICIPANT_NON_GUEST_LEFT,
    payload: response,
  };
};

const getVideoCallParticipantInit = () => {
  return {
    type: actions.GET_VIDEO_PARTICIPANTS_FOR_INIT,
  };
};

const getVideoCallParticipantSuccess = (response, message) => {
  return {
    type: actions.GET_VIDEO_PARTICIPANTS_FOR_SUCCESS,
    response: response,
    message: message,
  };
};

const getVideoCallParticipantFail = (message) => {
  return {
    type: actions.GET_VIDEO_PARTICIPANTS_FOR_FAIL,
    message: message,
  };
};

const getVideoCallParticipantsMainApi = (Data, navigate, t) => {
  return (dispatch) => {
    dispatch(getVideoCallParticipantInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getVideoCallParticipantsForGuest.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: videoApi,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getVideoCallParticipantsMainApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_01".toLowerCase()
                )
            ) {
              function saveCurrentMeetingHost(data) {
                // Filter the data to get only participants where isHost is true
                const hosts = data
                  .filter((participant) => participant.isHost)
                  .map(({ guid, userID }) => ({ guid, userID }));

                // Save the result in session storage with the key 'currentmeetingHost'
                sessionStorage.setItem(
                  "currentmeetingHost",
                  JSON.stringify(hosts)
                );
              }
              saveCurrentMeetingHost(
                response.data.responseResult.participantList
              );
              await dispatch(
                getVideoCallParticipantSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_02".toLowerCase()
                )
            ) {
              await dispatch(getVideoCallParticipantFail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_03".toLowerCase()
                )
            ) {
              await dispatch(getVideoCallParticipantFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_04".toLowerCase()
                )
            ) {
              await dispatch(
                getVideoCallParticipantFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              getVideoCallParticipantFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            getVideoCallParticipantFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getVideoCallParticipantFail(t("Something-went-wrong")));
      });
  };
};

const toggleParticipantsVisibility = (isVisible) => {
  return {
    type: actions.TOGGLE_PARTICIPANTS_VISIBILITY,
    payload: isVisible,
  };
};

// FOR AUDIO STREAM GLOBAL
const globalStateForAudioStream = (response) => {
  return {
    type: actions.GLOBAL_STREAM_AUDIO,
    response: response,
  };
};

//FOR VIDEO STREAM GLOBAL
const globalStateForVideoStream = (response) => {
  return {
    type: actions.GLOBAL_STREAM_VIDEO,
    response: response,
  };
};

//FOR GLOBAL NAVIGATORE VIDEO STREAM
const globalNavigatorVideoStream = (response) => {
  return {
    type: actions.GLOBAL_NAVIGATORE_VIDEO_STREAM,
    response: response,
  };
};
// For Removed Max Patrticipant Video Compnent
const leaveMeetingOnlogout = (response) => {
  console.log(response, "MAX_PARTICIPANT_VIDEO_REMOVED");

  return {
    type: actions.LEAVE_MEETING_ON_LOGOUT,
    response: response,
  };
};
const leaveMeetingVideoOnlogout = (response) => {
  console.log(response, "MAX_PARTICIPANT_VIDEO_REMOVED");

  return {
    type: actions.LEAVE_MEETING_VIDEO_ON_LOGOUT,
    response: response,
  };
};

// FOR CONVERT PARTICIPANT TO HOST
const makeParticipantHost = (response, flag) => {
  console.log(response, "MAKE_A_PARTICIPANT_HOST");

  return {
    type: actions.MAKE_A_PARTICIPANT_HOST,
    flag: flag,
    response: response,
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
  getParticipantsNewJoin,
  getParticipantMeetingJoinMainApi,
  maxHostVideoCallPanel,
  normalHostVideoCallPanel,
  maxParticipantVideoCallPanel,
  maxParticipantVideoDenied,
  maxParticipantVideoRemoved,
  participantListWaitingListMainApi,
  participantVideoNavigationScreen,
  setVideoControlHost,
  setAudioControlHost,
  getVideoUrlForParticipant,
  setVideoControlForParticipant,
  setAudioControlForParticipant,
  setRaisedUnRaisedParticiant,
  normalParticipantVideoCallPanel,
  checkHostNow,
  makeHostNow,
  setMicState,
  setVideoState,
  participantLeaveVideoMeeting,
  getVideoCallParticipantsMainApi,
  toggleParticipantsVisibility,
  globalStateForAudioStream,
  globalStateForVideoStream,
  globalNavigatorVideoStream,
  leaveMeetingOnlogout,
  leaveMeetingVideoOnlogout,
  makeParticipantHost,
};
