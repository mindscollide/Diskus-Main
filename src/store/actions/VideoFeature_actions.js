import axios from "axios";
import {
  getVideoCallParticipantsAndWaitingList,
  getVideoCallParticipantsForGuest,
  hideUnHidePaticipantVideo,
  isSharedScreenCall,
  joinMeetingVideoRequest,
  joinPresenterView,
  leavePresenterView,
  muteUnMuteParticipant,
  openPresenterView,
  OpenPresenterView,
  participantOfGroupCall,
  startPresenterView,
  stopPresenterView,
} from "../../commen/apis/Api_config";
import { meetingApi, videoApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import { LeaveMeetingVideo } from "./NewMeetingActions";
import { VideoCallResponse } from "./VideoMain_actions";
import { hideUnhideSelfMainApi, muteUnMuteSelfMainApi } from "./Guest_Video";
import { Store } from "emoji-mart";
import store from "../store";
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

const participanMuteUnMuteMeeting = (
  response,
  isforAll,
  presenterViewHostFlag,
  presenterViewFlag,
  check
) => {
  console.log(response, "responseresponseresponsedatat");
  return {
    type: actions.PARTICIPANT_MUTEUNMUTE_VIDEO,
    payload: response,
    isforAll: isforAll,
    presenterViewHostFlag: presenterViewHostFlag,
    presenterViewFlag: presenterViewFlag,
    check: check,
  };
};

const participanRaisedUnRaisedHand = (response) => {
  return {
    type: actions.PARTICIPANT_RAISEDUNRAISEDHAND_VIDEO,
    payload: response,
  };
};

const participantHideUnhideVideo = (response) => {
  console.log("MQTT onMessageArrived");
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

              localStorage.setItem(
                "isHost",
                response.data.responseResult.isHost
              );

              if (!response.data.responseResult.isHost) {
                localStorage.setItem(
                  "participantRoomId",
                  response.data.responseResult.roomID
                );
                localStorage.setItem(
                  "participantUID",
                  response.data.responseResult.guid
                );
                sessionStorage.setItem("isWaiting", true);
              }

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
              sessionStorage.setItem("NonMeetingVideoCall", false);
              localStorage.setItem("CallType", 2);
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("isMeetingVideo", true);
              sessionStorage.setItem("alreadyInMeetingVideo", true);
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
              await dispatch(participantVideoButtonState(false));
              await dispatch(videoIconOrButtonState(false));
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
              await dispatch(participantVideoButtonState(false));
              await dispatch(videoIconOrButtonState(false));
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
                dispatch(participantVideoButtonState(false));
                dispatch(videoIconOrButtonState(false));
              } catch {}
              await dispatch(
                getParticipantMeetingJoinFail(t("Something-went-wrong"))
              );
            }
          } else {
            try {
              setJoinButton(false);
              dispatch(participantVideoButtonState(false));
              dispatch(videoIconOrButtonState(false));
            } catch {}
            await dispatch(
              getParticipantMeetingJoinFail(t("Something-went-wrong"))
            );
          }
        } else {
          try {
            setJoinButton(false);
            dispatch(participantVideoButtonState(false));
            dispatch(videoIconOrButtonState(false));
          } catch {}
          await dispatch(
            getParticipantMeetingJoinFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        try {
          setJoinButton(false);
          dispatch(participantVideoButtonState(false));
          dispatch(videoIconOrButtonState(false));
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

// For Removed Max Patrticipant Video Compnent
const setParticipantRemovedFromVideobyHost = (response) => {
  return {
    type: actions.PARTICIPANT_REMOVED_FROM_VIDEO_BY_HOST,
    response: response,
  };
};

// For LeaveMeeting To join Different
const setParticipantLeaveCallForJoinNonMeetingCall = (response) => {
  return {
    type: actions.PARTICIPANT_LEAVE_CALL_FOR_JOIN_NON_MEETING_CALL,
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
              // function saveCurrentMeetingHost(data) {
              //   // Filter the data to get only participants where isHost is true
              //   const hosts = data
              //     .filter((participant) => participant.isHost)
              //     .map(({ guid, userID }) => ({ guid, userID }));

              //   // Save the result in session storage with the key 'currentmeetingHost'
              //   sessionStorage.setItem(
              //     "currentmeetingHost",
              //     JSON.stringify(hosts)
              //   );
              // }
              // saveCurrentMeetingHost(
              //   response.data.responseResult.participantList
              // );
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
  return {
    type: actions.LEAVE_MEETING_ON_LOGOUT,
    response: response,
  };
};
const leaveMeetingVideoOnlogout = (response) => {
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

//FOR NON-MEETING-VIDEO-MODAL
const nonMeetingVideoGlobalModal = (response) => {
  return {
    type: actions.NON_MEETING_VIDEO_MODAL,
    response: response,
  };
};

//For Close QuickMeeting Video Call
const endMeetingStatusForQuickMeetingVideo = (response) => {
  return {
    type: actions.CLOSE_VIDEOCALL_QUICK_MEETING,
    response: response,
  };
};

//For Close QuickMeeting Modal Call
const endMeetingStatusForQuickMeetingModal = (response) => {
  return {
    type: actions.CLOSE_QUICK_MEETING_VIDEO_MODAL,
    response: response,
  };
};

//For End Video Status Mqtt Response
const leaveMeetingVideoOnEndStatusMqtt = (response) => {
  return {
    type: actions.LEAVE_MEETINGVIDEO_END_STATUS_RESPONSE,
    response: response,
  };
};

//For End Meeting Status Mqtt Response
const leaveMeetingOnEndStatusMqtt = (response) => {
  return {
    type: actions.LEAVE_MEETING_END_STATUS_RESPONSE,
    response: response,
  };
};

// For videoIcon enable and disable or button
const videoIconOrButtonState = (response) => {
  console.log(response, "enableDisableVideoState");
  return {
    type: actions.VIDEO_BUTTON_OR_ICON_STATE,
    response: response,
  };
};

//For VideoIcon Enable and Disable button From Participant Side
const participantVideoButtonState = (response) => {
  console.log(response, "participantVideoButtonState");
  return {
    type: actions.PARTICIPANT_BUTTON_VIDEO_ENABLE_DISABLE,
    response: response,
  };
};

// For clear Message
const clearMessegesVideoFeature = (response) => {
  return {
    type: actions.CLEAR_VIDEOFEATURE_MESSAGES,
  };
};

//For VideoIcon Enable and Disable button From Participant Side
const disableZoomBeforeJoinSession = (response) => {
  console.log("disableZoomBeforeJoinSession", response);
  return {
    type: actions.DISABLE_BUTTONS_ZOOM_BEFORE_JOIN_SESSION,
    response: response,
  };
};

//For Presenter View Global State
const presenterViewGlobalState = (
  presenterMeetingId,
  presenterViewFlag,
  presenterViewHostFlag,
  presenterViewJoinFlag
) => {
  console.log(
    presenterMeetingId,
    presenterViewFlag,
    "responseresponseresponsedatat"
  );

  return {
    type: actions.SET_MQTT_PRESENTER_RESPONSE,
    payload: {
      presenterMeetingId,
      presenterViewFlag,
      presenterViewHostFlag,
      presenterViewJoinFlag,
    },
  };
};

// For Open Presenter View
const openPresenterInit = () => {
  return {
    type: actions.OPEN_PRESENTER_VIEW_INIT,
  };
};

const openPresenterSuccess = (response, message) => {
  return {
    type: actions.OPEN_PRESENTER_VIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const openPresenterFail = (message) => {
  return {
    type: actions.OPEN_PRESENTER_VIEW_FAIL,
    message: message,
  };
};

const openPresenterViewMainApi = (
  t,
  navigate,
  data,
  currentMeeting,
  actiontype
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let videoCallURL = String(localStorage.getItem("videoCallURL"));
  let newData = {
    VideoCallURL: videoCallURL,
    Guid: "",
    WasInVideo: data.WasInVideo,
  };
  return (dispatch) => {
    dispatch(openPresenterInit());
    let form = new FormData();
    form.append("RequestMethod", openPresenterView.RequestMethod);
    form.append("RequestData", JSON.stringify(newData));

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
            openPresenterViewMainApi(
              t,
              navigate,
              data,
              currentMeeting,
              actiontype
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_OpenPresenterView_01".toLowerCase()
                )
            ) {
              let isMeetingVideoHostCheck = JSON.parse(
                localStorage.getItem("isMeetingVideoHostCheck")
              );
              let isZoomEnabled = JSON.parse(
                localStorage.getItem("isZoomEnabled")
              );
              let isWaiting = JSON.parse(sessionStorage.getItem("isWaiting"));
              if (isZoomEnabled) {
                localStorage.setItem(
                  "presenterViewvideoURL",
                  response.data.responseResult.videoURL
                );
              }

              if (actiontype === 4) {
                let isMeetingVideo = JSON.parse(
                  localStorage.getItem("isMeetingVideo")
                );
                if (isMeetingVideo) {
                  if (isWaiting) {
                    const meetingHost = {
                      isHost: isMeetingVideoHostCheck,
                      isHostId: 0,
                      isDashboardVideo: true,
                    };
                    dispatch(makeHostNow(meetingHost));
                    localStorage.setItem(
                      "meetinHostInfo",
                      JSON.stringify(meetingHost)
                    );
                    if (isMeetingVideoHostCheck) {
                      localStorage.setItem(
                        "isGuid",
                        response.data.responseResult.guid
                      );
                    } else {
                      localStorage.setItem(
                        "participantUID",
                        response.data.responseResult.guid
                      );
                    }
                    localStorage.setItem(
                      "acceptedRoomID",
                      response.data.responseResult.roomID
                    );
                    sessionStorage.removeItem("alreadyInMeetingVideo");
                  } else {
                    console.log("maximizeParticipantVideoFlag");
                    sessionStorage.setItem("alreadyInMeetingVideo", true);
                  }
                } else {
                  const meetingHost = {
                    isHost: isMeetingVideoHostCheck,
                    isHostId: 0,
                    isDashboardVideo: true,
                  };
                  dispatch(makeHostNow(meetingHost));
                  localStorage.setItem(
                    "meetinHostInfo",
                    JSON.stringify(meetingHost)
                  );
                  if (isMeetingVideoHostCheck) {
                    localStorage.setItem(
                      "isGuid",
                      response.data.responseResult.guid
                    );
                  } else {
                    localStorage.setItem(
                      "participantUID",
                      response.data.responseResult.guid
                    );
                  }
                  localStorage.setItem(
                    "acceptedRoomID",
                    response.data.responseResult.roomID
                  );
                  sessionStorage.removeItem("alreadyInMeetingVideo");
                }
                await dispatch(
                  presenterViewGlobalState(currentMeeting, true, true, true)
                );
                await dispatch(maximizeVideoPanelFlag(true));
                await dispatch(normalizeVideoPanelFlag(false));
              }

              await dispatch(
                openPresenterSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_OpenPresenterView_02".toLowerCase()
                )
            ) {
              await dispatch(openPresenterFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_OpenPresenterView_03".toLowerCase()
                )
            ) {
              await dispatch(openPresenterFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(openPresenterFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(openPresenterFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(openPresenterFail(t("Something-went-wrong")));
      });
  };
};

//FOR START PRESENTER
const startPresenterInit = () => {
  return {
    type: actions.START_PRESENTER_VIEW_INIT,
  };
};

const startPresenterSuccess = (response, message) => {
  return {
    type: actions.START_PRESENTER_VIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const startPresenterFail = (message) => {
  return {
    type: actions.START_PRESENTER_VIEW_FAIL,
    message: message,
  };
};

const startPresenterViewMainApi = (navigate, t, data, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(startPresenterInit());
    let form = new FormData();
    form.append("RequestMethod", startPresenterView.RequestMethod);
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
          dispatch(startPresenterViewMainApi(navigate, t, data, flag));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartPresenterView_01".toLowerCase()
                )
            ) {
              try {
                localStorage.setItem("isWebCamEnabled", true);
                if (flag === 1) {
                  localStorage.removeItem("CallType");
                  let currentMeeting = localStorage.getItem("currentMeetingID");
                  await dispatch(
                    presenterViewGlobalState(currentMeeting, true, true, true)
                  );
                  dispatch(maximizeVideoPanelFlag(true));
                  dispatch(normalizeVideoPanelFlag(false));
                  dispatch(minimizeVideoPanelFlag(false));
                }
              } catch (error) {}

              dispatch(presenterStartedMainFlag(true));
              await dispatch(
                startPresenterSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartPresenterView_02".toLowerCase()
                )
            ) {
              await dispatch(
                startPresenterFail(t("Presentation-is-already-underway"))
              );
              let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
              let isMeetingVideo = JSON.parse(
                localStorage.getItem("isMeetingVideo")
              );
              let data = {
                VideoCallURL: String(currentMeetingVideoURL),
                WasInVideo: isMeetingVideo ? true : false,
              };
              dispatch(joinPresenterViewMainApi(navigate, t, data));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartPresenterView_03".toLowerCase()
                )
            ) {
              await dispatch(presenterViewGlobalState(0, false, false, false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              await dispatch(
                startPresenterFail(t("Error-while-starting-presentation"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartPresenterView_04".toLowerCase()
                )
            ) {
              await dispatch(startPresenterFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(startPresenterFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(startPresenterFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(startPresenterFail(t("Something-went-wrong")));
      });
  };
};

//FOR STop PRESENTER
const stopPresenterInit = () => {
  return {
    type: actions.STOP_PRESENTER_VIEW_INIT,
  };
};

const stopPresenterSuccess = (response, message) => {
  return {
    type: actions.STOP_PRESENTER_VIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const stopPresenterFail = (message) => {
  return {
    type: actions.STOP_PRESENTER_VIEW_FAIL,
    message: message,
  };
};

const stopPresenterViewMainApi = (
  navigate,
  t,
  data,
  flag,
  setLeaveMeetingVideoForOneToOneOrGroup,
  setJoiningOneToOneAfterLeavingPresenterView,
  setLeavePresenterViewToJoinOneToOne
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log(data, "presenterViewJoinFlag");
  let videoCallURL = Number(localStorage.getItem("videoCallURL"));
  let newdata = {
    MeetingID: data.MeetingID,
    RoomID: data.RoomID,
    VideoCallUrl: videoCallURL,
  };
  return (dispatch) => {
    dispatch(stopPresenterInit());
    let form = new FormData();
    form.append("RequestMethod", stopPresenterView.RequestMethod);
    form.append("RequestData", JSON.stringify(newdata));

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
            stopPresenterViewMainApi(
              navigate,
              t,
              data,
              flag,
              setLeaveMeetingVideoForOneToOneOrGroup,
              setJoiningOneToOneAfterLeavingPresenterView,
              setLeavePresenterViewToJoinOneToOne
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StopPresenterView_01".toLowerCase()
                )
            ) {
              let alreadyInMeetingVideo = JSON.parse(
                sessionStorage.getItem("alreadyInMeetingVideo")
                  ? sessionStorage.getItem("alreadyInMeetingVideo")
                  : false
              );

              if (flag === 1) {
                console.log("busyCall");
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(normalizeVideoPanelFlag(true));
                dispatch(minimizeVideoPanelFlag(false));
              } else if (flag === 3) {
                await setLeavePresenterViewToJoinOneToOne(false);
                if (alreadyInMeetingVideo) {
                  console.log("busyCall");
                  await setLeaveMeetingVideoForOneToOneOrGroup(true);
                } else {
                  console.log("busyCall");
                  setJoiningOneToOneAfterLeavingPresenterView(true);
                }
              }
              if (!alreadyInMeetingVideo) {
                console.log("busyCall");
                localStorage.removeItem("participantUID");
                localStorage.removeItem("isGuid");
                localStorage.removeItem("videoIframe");
                localStorage.removeItem("acceptedRoomID");
                // localStorage.removeItem("newRoomId");
                localStorage.removeItem("acceptedRoomID");
                localStorage.removeItem("presenterViewvideoURL");
                localStorage.removeItem("isWebCamEnabled");
                dispatch(setAudioControlHost(false));
                console.log("videoHideUnHideForHost");
                dispatch(setVideoControlHost(false));
                await dispatch(
                  presenterViewGlobalState(0, false, false, false)
                );
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
              } else if (alreadyInMeetingVideo) {
                console.log("busyCall");
                localStorage.removeItem("presenterViewvideoURL");
                localStorage.setItem("isMeetingVideo", true);
                dispatch(setVideoControlHost(true));
                dispatch(setAudioControlHost(false));
                dispatch(leaveCallModal(false));
                dispatch(
                  presenterFlagForAlreadyInParticipantMeetingVideo(false)
                );
                await dispatch(
                  presenterViewGlobalState(0, false, false, false)
                );
                let isMeetingVideoHostCheck = localStorage.getItem(
                  "isMeetingVideoHostCheck"
                )
                  ? JSON.parse(localStorage.getItem("isMeetingVideoHostCheck"))
                  : false;
                console.log("Check Presenter", isMeetingVideoHostCheck);
                let isGuid = localStorage.getItem("isGuid");
                let participantUID = localStorage.getItem("participantUID");

                // this what I get the leavePresenterOrJoinOtherCalls from videoReature_reducer
                let leavePresenterOrJoinOtherCallData =
                  store.getState().videoFeatureReducer
                    .leavePresenterOrJoinOtherCalls;
                console.log(
                  leavePresenterOrJoinOtherCallData,
                  "leavePresenterOrJoinOtherCallData"
                );

                if (!leavePresenterOrJoinOtherCallData) {
                  console.log(
                    leavePresenterOrJoinOtherCallData,
                    "leavePresenterOrJoinOtherCallData"
                  );
                  let dataAudio = {
                    RoomID: String(data.RoomID),
                    IsMuted: false, // Ensuring it's a boolean
                    UID: String(
                      isMeetingVideoHostCheck ? isGuid : participantUID
                    ),
                    MeetingID: data.MeetingID,
                  };
                  // Dispatch the API request with the data
                  dispatch(muteUnMuteSelfMainApi(navigate, t, dataAudio, 1));
                  let dataVideo = {
                    RoomID: String(data.RoomID),
                    HideVideo: true, // Ensuring it's a boolean
                    UID: String(
                      isMeetingVideoHostCheck ? isGuid : participantUID
                    ),
                    MeetingID: Number(data.MeetingID),
                  };
                  // Dispatch the API request with the data
                  dispatch(hideUnhideSelfMainApi(navigate, t, dataVideo, 1));
                  console.log("videoHideUnHideForHost");
                }
                dispatch(maximizeVideoPanelFlag(true));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                sessionStorage.removeItem("alreadyInMeetingVideo");
              }
              await dispatch(
                stopPresenterSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StopPresenterView_02".toLowerCase()
                )
            ) {
              await dispatch(stopPresenterFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StopPresenterView_03".toLowerCase()
                )
            ) {
              await dispatch(
                stopPresenterFail(t("Error-while-stop-presentation"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StopPresenterView_04".toLowerCase()
                )
            ) {
              await dispatch(stopPresenterFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(stopPresenterFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(stopPresenterFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(stopPresenterFail(t("Something-went-wrong")));
      });
  };
};
const stopPresenterViewMainApiTest = (
  navigate,
  t,
  data,
  flag,
  setLeaveMeetingVideoForOneToOneOrGroup,
  setJoiningOneToOneAfterLeavingPresenterView,
  setLeavePresenterViewToJoinOneToOne
) => {
  return async (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const videoCallURL = Number(localStorage.getItem("videoCallURL"));
        const newdata = {
          MeetingID: data.MeetingID,
          RoomID: data.RoomID,
          VideoCallUrl: videoCallURL,
        };

        dispatch(stopPresenterInit());

        const form = new FormData();
        form.append("RequestMethod", stopPresenterView.RequestMethod);
        form.append("RequestData", JSON.stringify(newdata));

        const response = await axios({
          method: "post",
          url: meetingApi,
          data: form,
          headers: {
            _token: token,
          },
        });

        const res = response.data;

        if (res.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          await dispatch(
            stopPresenterViewMainApi(
              navigate,
              t,
              data,
              flag,
              setLeaveMeetingVideoForOneToOneOrGroup,
              setJoiningOneToOneAfterLeavingPresenterView,
              setLeavePresenterViewToJoinOneToOne
            )
          );
          return resolve(); // resolve after retry
        }

        if (res.responseCode === 200 && res.responseResult.isExecuted) {
          const msg = res.responseResult.responseMessage.toLowerCase();

          if (
            msg.includes("meeting_meetingservicemanager_stoppresenterview_01")
          ) {
            let alreadyInMeetingVideo = JSON.parse(
              sessionStorage.getItem("alreadyInMeetingVideo") || false
            );

            if (flag === 1) {
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(true));
              dispatch(minimizeVideoPanelFlag(false));
            } else if (flag === 3) {
              await setLeavePresenterViewToJoinOneToOne(false);
              if (alreadyInMeetingVideo) {
                await setLeaveMeetingVideoForOneToOneOrGroup(true);
              } else {
                setJoiningOneToOneAfterLeavingPresenterView(true);
              }
            }

            if (!alreadyInMeetingVideo) {
              localStorage.removeItem("participantUID");
              localStorage.removeItem("isGuid");
              localStorage.removeItem("videoIframe");
              localStorage.removeItem("acceptedRoomID");
              localStorage.removeItem("presenterViewvideoURL");

              dispatch(setAudioControlHost(false));
              console.log("videoHideUnHideForHost");
              dispatch(setVideoControlHost(false));
              await dispatch(presenterViewGlobalState(0, false, false, false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
            } else {
              localStorage.removeItem("presenterViewvideoURL");
              localStorage.setItem("isMeetingVideo", true);
              dispatch(leaveCallModal(false));
              dispatch(presenterFlagForAlreadyInParticipantMeetingVideo(false));
              await dispatch(presenterViewGlobalState(0, false, false, false));

              const isMeetingVideoHostCheck = JSON.parse(
                localStorage.getItem("isMeetingVideoHostCheck") || false
              );
              const isGuid = localStorage.getItem("isGuid");
              const participantUID = localStorage.getItem("participantUID");

              const dataAudio = {
                RoomID: String(data.RoomID),
                IsMuted: false,
                UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
                MeetingID: data.MeetingID,
              };

              const dataVideo = {
                RoomID: String(data.RoomID),
                HideVideo: true,
                UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
                MeetingID: Number(data.MeetingID),
              };

              dispatch(muteUnMuteSelfMainApi(navigate, t, dataAudio, 1));
              dispatch(hideUnhideSelfMainApi(navigate, t, dataVideo, 1));
              console.log("videoHideUnHideForHost");
              dispatch(setVideoControlHost(true));
              dispatch(setAudioControlHost(false));
              dispatch(maximizeVideoPanelFlag(true));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              sessionStorage.removeItem("alreadyInMeetingVideo");
            }

            await dispatch(
              stopPresenterSuccess(res.responseResult, t("Successful"))
            );
            return resolve(); // 🎯 Everything done, resolve the promise
          } else if (msg.includes("stoppresenterview_02")) {
            await dispatch(stopPresenterFail(t("UnSuccessful")));
          } else if (msg.includes("stoppresenterview_03")) {
            await dispatch(
              stopPresenterFail(t("Error-while-stop-presentation"))
            );
          } else if (msg.includes("stoppresenterview_04")) {
            await dispatch(stopPresenterFail(t("Something-went-wrong")));
          }

          return resolve(); // Resolve even if some fail case occurred
        }

        await dispatch(stopPresenterFail(t("Something-went-wrong")));
        return resolve();
      } catch (error) {
        dispatch(stopPresenterFail(t("Something-went-wrong")));
        return reject(error);
      }
    });
  };
};

//FOR JOIN PRESENTER
const joinPresenterInit = () => {
  return {
    type: actions.JOIN_PRESENTER_VIEW_INIT,
  };
};

const joinPresenterSuccess = (response, message) => {
  return {
    type: actions.JOIN_PRESENTER_VIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const joinPresenterFail = (message) => {
  return {
    type: actions.JOIN_PRESENTER_VIEW_FAIL,
    message: message,
  };
};

const joinPresenterViewMainApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(joinPresenterInit());
    let form = new FormData();
    form.append("RequestMethod", joinPresenterView.RequestMethod);
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
          dispatch(joinPresenterViewMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinPresenterView_01".toLowerCase()
                )
            ) {
              let currentMeetingID = Number(
                localStorage.getItem("currentMeetingID")
              );
              let isMeetingVideo = JSON.parse(
                localStorage.getItem("isMeetingVideo")
              );
              let isMeetingVideoHostCheck = JSON.parse(
                localStorage.getItem("isMeetingVideoHostCheck")
              );
              console.log("Check 12");
              if (isMeetingVideo) {
                console.log("Check 12");

                console.log("maximizeParticipantVideoFlag");
                sessionStorage.setItem("alreadyInMeetingVideo", true);
              } else {
                console.log("Check 12");
                const meetingHost = {
                  isHost: isMeetingVideoHostCheck,
                  isHostId: 0,
                  isDashboardVideo: true,
                };
                dispatch(makeHostNow(meetingHost));
                localStorage.setItem(
                  "meetinHostInfo",
                  JSON.stringify(meetingHost)
                );
                if (isMeetingVideoHostCheck) {
                  console.log("Check 12");
                  localStorage.setItem(
                    "isGuid",
                    response.data.responseResult.guid
                  );
                } else {
                  console.log("Check 12");
                  localStorage.setItem(
                    "participantUID",
                    response.data.responseResult.guid
                  );
                }
                localStorage.setItem(
                  "acceptedRoomID",
                  response.data.responseResult.roomID
                );
                localStorage.setItem(
                  "acceptedRoomID",
                  response.data.responseResult.roomID
                );
                localStorage.setItem(
                  "presenterViewvideoURL",
                  response.data.responseResult.videoURL
                );
              }
              localStorage.removeItem("activeCall");

              await dispatch(
                presenterViewGlobalState(currentMeetingID, true, false, true)
              );
              dispatch(maximizeVideoPanelFlag(true));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              await dispatch(
                joinPresenterSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinPresenterView_02".toLowerCase()
                )
            ) {
              await dispatch(
                joinPresenterFail(t("could-not-join-schedule-call"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinPresenterView_03".toLowerCase()
                )
            ) {
              await dispatch(
                joinPresenterFail(t("invalid-video-call-url-provided"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinPresenterView_04".toLowerCase()
                )
            ) {
              await dispatch(
                joinPresenterFail(t("Could-not-join-presentation"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinPresenterView_05".toLowerCase()
                )
            ) {
              await dispatch(joinPresenterFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(joinPresenterFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(joinPresenterFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(joinPresenterFail(t("Something-went-wrong")));
      });
  };
};

//FOR LEAVE PRESENTER
const leavePresenterInit = () => {
  return {
    type: actions.LEAVE_PRESENTER_VIEW_INIT,
  };
};

const leavePresenterSuccess = (response, message) => {
  return {
    type: actions.LEAVE_PRESENTER_VIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const leavePresenterFail = (message) => {
  return {
    type: actions.LEAVE_PRESENTER_VIEW_FAIL,
    message: message,
  };
};

const leavePresenterViewMainApi = (
  navigate,
  t,
  data,
  flag,
  setLeaveMeetingVideoForOneToOneOrGroup,
  setJoiningOneToOneAfterLeavingPresenterView,
  setLeavePresenterViewToJoinOneToOne
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(leavePresenterInit());
    let form = new FormData();
    form.append("RequestMethod", leavePresenterView.RequestMethod);
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
            leavePresenterViewMainApi(
              navigate,
              t,
              data,
              flag,
              setLeaveMeetingVideoForOneToOneOrGroup,
              setJoiningOneToOneAfterLeavingPresenterView,
              setLeavePresenterViewToJoinOneToOne
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeavePresenterView_01".toLowerCase()
                )
            ) {
              let alreadyInMeetingVideo = JSON.parse(
                sessionStorage.getItem("alreadyInMeetingVideo")
              );
              dispatch(setRaisedUnRaisedParticiant(false));
              console.log(flag, "Check is participant Uid Removed?");
              console.log("Check is participant Uid Removed?");
              await dispatch(presenterStartedMainFlag(false));

              let currentMeetingID = localStorage.getItem("currentMeetingID");

              if (flag === 1) {
                console.log("Check is participant Uid Removed?");
                dispatch(
                  presenterViewGlobalState(currentMeetingID, true, false, false)
                );
                if (!alreadyInMeetingVideo) {
                  console.log("Check is participant Uid Removed?");
                  localStorage.removeItem("participantUID");
                  localStorage.removeItem("isGuid");
                  localStorage.removeItem("videoIframe");
                  localStorage.removeItem("acceptedRoomID");
                  localStorage.removeItem("newRoomId");
                  localStorage.removeItem("presenterViewvideoURL");
                }
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                dispatch(setAudioControlHost(false));
                console.log("videoHideUnHideForHost");
                dispatch(setVideoControlHost(false));
              } else if (flag === 2) {
                dispatch(participantVideoButtonState(false));
                console.log("Check is participant Uid Removed?");
                dispatch(
                  presenterViewGlobalState(currentMeetingID, true, false, false)
                );
                if (alreadyInMeetingVideo) {
                  // dispatch(participantVideoButtonState(true));
                  // dispatch(presenterViewGlobalState(0, false, false, false));
                  // console.log("Check is participant Uid Removed?");
                  // sessionStorage.removeItem("alreadyInMeetingVideo");
                  //  await dispatch(presenterStartedMainFlag(true));
                  // dispatch(maximizeVideoPanelFlag(true));
                  // dispatch(normalizeVideoPanelFlag(false));
                  // dispatch(minimizeVideoPanelFlag(false));
                  // localStorage.setItem("isMeetingVideo", true);

                  // Ye jb participant video Meeting ma ho aur presenter view ma join hojae tou jab wo presenter View ma ajaye toh leavePresenter
                  // krna par wo meetingVideo ma b Join nahi hoga
                  console.log("Check is participant Uid Removed?");
                  localStorage.removeItem("participantUID");
                  localStorage.removeItem("participantRoomId");
                  localStorage.removeItem("isGuid");
                  localStorage.removeItem("videoIframe");
                  localStorage.removeItem("acceptedRoomID");
                  localStorage.removeItem("newRoomId");
                  localStorage.removeItem("isMeetingVideo");
                  localStorage.removeItem("alreadyInMeetingVideo");
                  localStorage.removeItem("presenterViewvideoURL");
                  dispatch(maximizeVideoPanelFlag(false));
                  dispatch(normalizeVideoPanelFlag(false));
                  dispatch(minimizeVideoPanelFlag(false));
                  dispatch(setAudioControlHost(false));
                  console.log("videoHideUnHideForHost");
                  dispatch(setVideoControlHost(false));
                } else {
                  console.log("Check is participant Uid Removed?");
                  localStorage.removeItem("participantUID");
                  localStorage.removeItem("isGuid");
                  localStorage.removeItem("videoIframe");
                  localStorage.removeItem("acceptedRoomID");
                  localStorage.removeItem("newRoomId");
                  localStorage.removeItem("presenterViewvideoURL");
                  dispatch(maximizeVideoPanelFlag(false));
                  dispatch(normalizeVideoPanelFlag(false));
                  dispatch(minimizeVideoPanelFlag(false));
                  dispatch(setAudioControlHost(false));
                  console.log("videoHideUnHideForHost");
                  dispatch(setVideoControlHost(false));
                }
              } else if (flag === 3) {
                console.log("Check is participant Uid Removed?");
                if (!alreadyInMeetingVideo) {
                  console.log("Check is participant Uid Removed?");
                  // localStorage.removeItem("participantUID");
                  localStorage.removeItem("isGuid");
                  localStorage.removeItem("videoIframe");
                  localStorage.removeItem("acceptedRoomID");
                  localStorage.removeItem("newRoomId");
                  localStorage.removeItem("presenterViewvideoURL");
                } else if (alreadyInMeetingVideo) {
                  console.log("Check is participant Uid Removed?");
                  let newName = localStorage.getItem("name");
                  let participantRoomId =
                    localStorage.getItem("participantRoomId");
                  let participantUID = localStorage.getItem("participantUID");
                  let isGuid = localStorage.getItem("isGuid");
                  let currentMeetingID = Number(
                    localStorage.getItem("currentMeetingID")
                  );
                  const meetHostFlag = JSON.parse(
                    localStorage.getItem("meetinHostInfo")
                  );
                  let isMeetingVideoHostCheck = JSON.parse(
                    localStorage.getItem("isMeetingVideoHostCheck")
                  );
                  let UID = isMeetingVideoHostCheck ? isGuid : participantUID;
                  let Data = {
                    RoomID: String(participantRoomId),
                    UserGUID: String(UID),
                    Name: String(newName),
                    IsHost: meetHostFlag?.isHost ? true : false,
                    MeetingID: Number(currentMeetingID),
                  };
                  dispatch(setRaisedUnRaisedParticiant(false));
                  dispatch(LeaveMeetingVideo(Data, navigate, t));
                }
                await dispatch(
                  leavePresenterSuccess(
                    response.data.responseResult,
                    t("Successful")
                  )
                );
                await setLeavePresenterViewToJoinOneToOne(false);
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                dispatch(setAudioControlHost(false));
                console.log("videoHideUnHideForHost");
                dispatch(setVideoControlHost(false));
                dispatch(presenterViewGlobalState(0, true, false, false));
                sessionStorage.removeItem("alreadyInMeetingVideo");
                // if (alreadyInMeetingVideo) {
                //   console.log("busyCall");
                //   await setLeaveMeetingVideoForOneToOneOrGroup(true);
                // } else {
                console.log("busyCall");
                await setJoiningOneToOneAfterLeavingPresenterView(true);
                // }
              } else if (flag === 4) {
                console.log("Check is participant Uid Removed?");
                dispatch(participantVideoButtonState(false));
                console.log("Check");
                dispatch(presenterViewGlobalState(0, false, false, false));
                if (alreadyInMeetingVideo) {
                  console.log("Check is participant Uid Removed?");
                  console.log("Check");
                  sessionStorage.removeItem("alreadyInMeetingVideo");
                  dispatch(maximizeVideoPanelFlag(true));
                  dispatch(normalizeVideoPanelFlag(false));
                  dispatch(minimizeVideoPanelFlag(false));
                } else {
                  console.log("Check is participant Uid Removed?");
                  localStorage.removeItem("participantUID");
                  localStorage.removeItem("isGuid");
                  localStorage.removeItem("videoIframe");
                  localStorage.removeItem("acceptedRoomID");
                  localStorage.removeItem("newRoomId");
                  localStorage.removeItem("presenterViewvideoURL");
                  dispatch(maximizeVideoPanelFlag(false));
                  dispatch(normalizeVideoPanelFlag(false));
                  dispatch(minimizeVideoPanelFlag(false));
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeavePresenterView_02".toLowerCase()
                )
            ) {
              await dispatch(leavePresenterFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeavePresenterView_03".toLowerCase()
                )
            ) {
              await dispatch(leavePresenterFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(leavePresenterFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(leavePresenterFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(leavePresenterFail(t("Something-went-wrong")));
      });
  };
};
const leavePresenterViewMainApiTest = (
  navigate,
  t,
  data,
  flag,
  setLeaveMeetingVideoForOneToOneOrGroup,
  setJoiningOneToOneAfterLeavingPresenterView,
  setLeavePresenterViewToJoinOneToOne
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch(leavePresenterInit());
      let form = new FormData();
      form.append("RequestMethod", leavePresenterView.RequestMethod);
      form.append("RequestData", JSON.stringify(data));

      try {
        const response = await axios({
          method: "post",
          url: meetingApi,
          data: form,
          headers: {
            _token: token,
          },
        });

        const resData = response.data;

        if (resData.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          await dispatch(
            leavePresenterViewMainApi(
              navigate,
              t,
              data,
              flag,
              setLeaveMeetingVideoForOneToOneOrGroup,
              setJoiningOneToOneAfterLeavingPresenterView,
              setLeavePresenterViewToJoinOneToOne
            )
          );
          return resolve(); // Resolve after retry
        }

        if (resData.responseCode === 200 && resData.responseResult.isExecuted) {
          const msg = resData.responseResult.responseMessage.toLowerCase();

          let alreadyInMeetingVideo = JSON.parse(
            sessionStorage.getItem("alreadyInMeetingVideo")
          );
          await dispatch(setRaisedUnRaisedParticiant(false));
          await dispatch(presenterStartedMainFlag(false));
          let currentMeetingID = localStorage.getItem("currentMeetingID");

          const cleanUpLocalStorage = () => {
            localStorage.removeItem("participantUID");
            localStorage.removeItem("isGuid");
            localStorage.removeItem("videoIframe");
            localStorage.removeItem("acceptedRoomID");
            localStorage.removeItem("newRoomId");
            localStorage.removeItem("presenterViewvideoURL");
          };

          if (msg.includes("leavepresenterview_01")) {
            if (flag === 1) {
              dispatch(
                presenterViewGlobalState(currentMeetingID, true, false, false)
              );
              if (!alreadyInMeetingVideo) cleanUpLocalStorage();
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              dispatch(setAudioControlHost(false));
              console.log("videoHideUnHideForHost");
              dispatch(setVideoControlHost(false));
            } else if (flag === 2) {
              dispatch(participantVideoButtonState(false));
              dispatch(
                presenterViewGlobalState(currentMeetingID, true, false, false)
              );
              if (alreadyInMeetingVideo) {
                dispatch(participantVideoButtonState(true));
                dispatch(presenterViewGlobalState(0, false, false, false));
                sessionStorage.removeItem("alreadyInMeetingVideo");
                dispatch(maximizeVideoPanelFlag(true));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                localStorage.setItem("isMeetingVideo", true);
              } else {
                cleanUpLocalStorage();
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                dispatch(setAudioControlHost(false));
                console.log("videoHideUnHideForHost");
                dispatch(setVideoControlHost(false));
              }
            } else if (flag === 3) {
              if (!alreadyInMeetingVideo) cleanUpLocalStorage();
              await dispatch(
                leavePresenterSuccess(resData.responseResult, t("Successful"))
              );
              await setLeavePresenterViewToJoinOneToOne(false);
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              dispatch(setAudioControlHost(false));
              console.log("videoHideUnHideForHost");
              dispatch(setVideoControlHost(false));
              dispatch(presenterViewGlobalState(0, true, false, false));
              sessionStorage.removeItem("alreadyInMeetingVideo");
              await setJoiningOneToOneAfterLeavingPresenterView(true);
            } else if (flag === 4) {
              dispatch(participantVideoButtonState(false));
              dispatch(presenterViewGlobalState(0, false, false, false));
              if (alreadyInMeetingVideo) {
                sessionStorage.removeItem("alreadyInMeetingVideo");
                dispatch(maximizeVideoPanelFlag(true));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
              } else {
                cleanUpLocalStorage();
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
              }
            }

            return resolve(); // All state handled successfully
          } else if (msg.includes("leavepresenterview_02")) {
            await dispatch(leavePresenterFail(t("UnSuccessful")));
            return reject();
          } else if (msg.includes("leavepresenterview_03")) {
            await dispatch(leavePresenterFail(t("Something-went-wrong")));
            return reject();
          } else {
            await dispatch(leavePresenterFail(t("Something-went-wrong")));
            return reject();
          }
        } else {
          await dispatch(leavePresenterFail(t("Something-went-wrong")));
          return reject();
        }
      } catch (error) {
        dispatch(leavePresenterFail(t("Something-went-wrong")));
        return reject(error);
      }
    });
  };
};

// Stop Meeting Video By presenter View when Some one Already Join the meeting Video
const stopMeetingVideoByPresenter = (response) => {
  return {
    type: actions.STOP_MEETING_VIDEO_BY_PRESENTER_VIEW,
    response: response,
  };
};

// For Presenter Join Started Main State
const presenterStartedMainFlag = (response) => {
  return {
    type: actions.PRESENTER_STARTED_MAIN_FLAG,
    response: response,
  };
};

//Global State for start presenter view flag for already In participant Meeting Video
const presenterFlagForAlreadyInParticipantMeetingVideo = (response) => {
  console.log("checkMeetingResponse", response);
  return {
    type: actions.START_PRESENTER_VIEW_FLAG_FOR_ALREADYIN_PARTICIPANT_MEETINGVIDEO,
    response: response,
  };
};

// global state for Presenter Participants who joined Presenter Video
const presenterNewParticipantJoin = (response) => {
  console.log("PRESENTER_JOIN_PARTICIPANT_VIDEO", response);

  return {
    type: actions.PRESENTER_JOIN_PARTICIPANT_VIDEO,
    response: response,
  };
};

const presenterLeaveParticipant = (response) => {
  console.log("hell", response);
  return {
    type: actions.PRESENTER_LEAVE_PARTICIPANT_VIDEO,
    response: response, // Pass UID to reducer
  };
};

const clearPresenterParticipants = () => {
  return {
    type: actions.CLEAR_PRESENTER_PARTICIPANTS,
  };
};

// Close max Participant Video Stream
const closeWaitingParticipantVideoStream = (response) => {
  return {
    type: actions.CLOSE_IS_WAITING_MAXPARTICIPANT_VIDEO_STREAM,
    response: response,
  };
};

// state for leave Presenter View and Join one to one and other group calls
const leavePresenterJoinOneToOneOrOtherCall = (response) => {
  console.log("checkMeetingResponse", response);
  return {
    type: actions.LEAVE_PRESENTER_JOIN_ONE_TO_OR_GROUP_CALL,
    response: response,
  };
};

// state for ACCEPT HOST TRANSFER ACCESS
const acceptHostTransferAccessGlobalFunc = (response) => {
  console.log("checkHostTransfer", response);
  return {
    type: actions.ACCEPT_HOST_TRANSFER_ACCESS,
    response: response,
  };
};

// unanswered one To one call to close participant modal
const unansweredOneToOneCall = (response) => {
  console.log("UNANSWERED_ONE_TO_ONE_CALL_FLAG", response);
  return {
    type: actions.UNANSWERED_ONE_TO_ONE_CALL_FLAG,
    response: response,
  };
};

// Get Participants of Video Group Call
const getGroupCallParticipantsInit = () => {
  return {
    type: actions.GET_PARTICIPANTS_OF_GROUP_CALL_INIT,
  };
};

const getGroupCallParticipantsSuccess = (response, message) => {
  return {
    type: actions.GET_PARTICIPANTS_OF_GROUP_CALL_SUCCESS,
    response: response,
    message: message,
  };
};

const getGroupCallParticipantsFail = (message) => {
  return {
    type: actions.GET_PARTICIPANTS_OF_GROUP_CALL_FAIL,
    message: message,
  };
};

const getGroupCallParticipantsMainApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getGroupCallParticipantsInit());
    let form = new FormData();
    form.append("RequestMethod", participantOfGroupCall.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(getGroupCallParticipantsMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetGroupCallParticipants_01".toLowerCase()
                )
            ) {
              await dispatch(
                getGroupCallParticipantsSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetGroupCallParticipants_02".toLowerCase()
                )
            ) {
              await dispatch(getGroupCallParticipantsFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetGroupCallParticipants_03".toLowerCase()
                )
            ) {
              await dispatch(
                getGroupCallParticipantsFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              getGroupCallParticipantsFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            getGroupCallParticipantsFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getGroupCallParticipantsFail(t("Something-went-wrong")));
      });
  };
};

// For Start and Stop Presenter View
// const startOrStopPresenterGlobal = (response) => {
//   return {
//     type: actions.START_OR_STOP_PRESENTER_STATE,
//     response: response,
//   };
// };

//updated participants List For PRESENTER
const updatedParticipantListForPresenter = (response) => {
  console.log(response, "responseCheck List");
  return {
    type: actions.UPDATED_PARTICIPANTS_LIST_FOR_PRESENTER,
    response: response,
  };
};

// Global state for stop screen share on presenter view start
const stopScreenShareOnPresenterStarting = (response) => {
  console.log(response, "stopScreenShareOnPresenterStarting");
  return {
    type: actions.STOP_SCREENSHARE_ONPRESENTER_VIEWSTART,
    response: response,
  };
};

// For Screen Share for triggered when some share screen Init
const isSharedScreenInit = () => {
  return {
    type: actions.IS_SCREEN_SHARED_TRIGGERED_INIT,
  };
};

const isSharedScreenSuccess = (response, message) => {
  return {
    type: actions.IS_SCREEN_SHARED_TRIGGERED_SUCCESS,
    response: response,
    message: message,
  };
};

const isSharedScreenFail = (message) => {
  return {
    type: actions.IS_SCREEN_SHARED_TRIGGERED_FAIL,
    message: message,
  };
};

const isSharedScreenTriggeredApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(isSharedScreenInit());
    let form = new FormData();
    form.append("RequestMethod", isSharedScreenCall.RequestMethod);
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
          dispatch(isSharedScreenTriggeredApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_IsSharedScreen_01".toLowerCase()
                )
            ) {
              if (data.ShareScreen === true) {
                console.log("CheckDataCheckData");
                localStorage.setItem("isSharedSceenEnable", true);
              } else {
                console.log("CheckDataCheckData");
                localStorage.removeItem("isSharedSceenEnable");
              }
              await dispatch(
                isSharedScreenSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_IsSharedScreen_02".toLowerCase()
                )
            ) {
              await dispatch(isSharedScreenFail(t("Invalid-request-data-2")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_IsSharedScreen_03".toLowerCase()
                )
            ) {
              await dispatch(isSharedScreenFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_IsSharedScreen_04".toLowerCase()
                )
            ) {
              await dispatch(isSharedScreenFail(t("UnSuccessful")));
            }
          } else {
            await dispatch(isSharedScreenFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(isSharedScreenFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(isSharedScreenFail(t("Something-went-wrong")));
      });
  };
};

// Global state for Screen Shared triggered
const screenShareTriggeredGlobally = (response) => {
  console.log(response, "screenShareTriggeredGlobally");
  return {
    type: actions.GLOBAL_SCREEN_SHARE_TRIGGERED,
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
  nonMeetingVideoGlobalModal,
  endMeetingStatusForQuickMeetingVideo,
  endMeetingStatusForQuickMeetingModal,
  leaveMeetingVideoOnEndStatusMqtt,
  leaveMeetingOnEndStatusMqtt,
  videoIconOrButtonState,
  participantVideoButtonState,
  clearMessegesVideoFeature,
  // startOrStopPresenterGlobal,
  disableZoomBeforeJoinSession,
  setParticipantRemovedFromVideobyHost,
  setParticipantLeaveCallForJoinNonMeetingCall,
  presenterViewGlobalState,
  openPresenterViewMainApi,
  startPresenterViewMainApi,
  stopPresenterViewMainApi,
  stopPresenterViewMainApiTest,
  joinPresenterViewMainApi,
  leavePresenterViewMainApi,
  leavePresenterViewMainApiTest,
  stopMeetingVideoByPresenter,
  presenterStartedMainFlag,
  presenterFlagForAlreadyInParticipantMeetingVideo,
  presenterNewParticipantJoin,
  closeWaitingParticipantVideoStream,
  presenterLeaveParticipant,
  clearPresenterParticipants,
  leavePresenterJoinOneToOneOrOtherCall,
  acceptHostTransferAccessGlobalFunc,
  unansweredOneToOneCall,
  getGroupCallParticipantsMainApi,
  updatedParticipantListForPresenter,
  stopScreenShareOnPresenterStarting,
  isSharedScreenTriggeredApi,
  screenShareTriggeredGlobally,
};
