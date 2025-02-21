import { filterHostData } from "../../commen/functions/regex";
import * as actions from "../action_types";

const initialState = {
  VideoChatPanel: false,
  ContactVideoFlag: false,
  RecentVideoFlag: false,
  VideoChatSearchFlag: false,
  VideoCallOTOFlag: false,
  EndVideoCallFlag: false,
  VideoCallGroupFlag: false,
  VideoCallNormalScreenFlag: false,
  VideoCallMinimizeScreenFlag: false,
  VideoCallMaximizeScreenFlag: false,
  VideoCallNormalHeaderFlag: false,
  VideoCallMinimizeHeaderFlag: false,
  VideoCallMaximizeHeaderFlag: false,
  VideoIncomingCallFlag: false,
  VideoChatNormalFlag: false,
  VideoAgendaNormalFlag: false,
  VideoMinutesMeetingNormalFlag: false,
  VideoOutgoingCallFlag: false,
  VideoMultipleCallFlag: false,
  VideoChatOpenFlag: false,
  VideoAgendaOpenFlag: false,
  VideoMinutesOpenFlag: false,
  MaximizeVideoFlag: false,
  MinimizeVideoFlag: false,
  NormalizeVideoFlag: false,
  IncomingVideoCallFlag: false,
  LeaveCallModalFlag: false,
  ParticipantPopupFlag: false,
  MinimizeParticipantPopupFlag: false,
  VideoChatMessagesFlag: false,
  ShowGuestPopup: false,
  participantWaitinglistBox: false,
  participantWaitingList: [],
  guestLeaveMeetingList: [],
  participantNameDataAccept: [],
  muteUnmuteSelf: [],
  raiseUnRaisedParticipant: [],
  hideUndieParticipantList: [],
  muteUnMuteParticipant: [],
  hideUnHideParticipantorGuest: [],
  getNewParticipantsMeetingJoin: [],
  getJoinMeetingParticipantorHostrequest: null,
  MaximizeHostVideoFlag: false,
  NormalHostVideoFlag: false,
  maximizeParticipantVideoFlag: false,
  normalParticipantVideoFlag: false,
  maxParticipantVideoDeniedFlag: false,
  maxParticipantVideoRemovedFlag: false,
  participantRemovedFromVideobyHost: false,
  participantLeaveCallForJoinNonMeetingCall: false,
  getVideoParticpantListandWaitingList: [], // Active participants list
  waitingParticipantsList: [],
  participantVideoNavigationData: 1,
  videoControlHost: false,
  audioControlHost: false,
  videoControlForParticipant: false,
  audioControlForParticipant: false,
  raisedUnRaisedParticipant: false,
  getParticipantsVideoUrl: null,
  checkHostNow: null,
  makeHostNow: null,
  isMicEnabled: true,
  isWebCamEnabled: true,
  isAudioGlobalStream: false,
  isVideoGlobalStream: false,
  allNavigatorVideoStream: 0,
  getAllParticipantMain: [],
  participantsVisible: false,
  leaveMeetingOnLogoutResponse: false,
  leaveMeetingVideoOnLogoutResponse: false,
  makeParticipantAsHost: false,
  makeParticipantAsHostData: [],
  nonMeetingVideo: false,
  endMeetingStatusForQuickMeetingVideoFlag: false,
  endMeetingStatusForQuickMeetingModalFlag: false,
  leaveMeetingOnEndStatusMqttFlag: false,
  leaveMeetingVideoOnEndStatusMqttFlag: false,
  enableDisableVideoState: false,
  participantEnableVideoState: false,
  disableBeforeJoinZoom: true,
  presenterMeetingId: 0,
  presenterViewFlag: false,
  presenterViewHostFlag: false,
  presenterViewJoinFlag: false,
  presenterOpenView: [],
  presenterViewStart: null,
  presenterViewStop: null,
  joinPresenterView: null,
  leavePresenterView: null,
  meetingStoppedByPresenter: false,
  presenterStartedFlag: false,
  presenterParticipantAlreadyInMeetingVideo: false,
  newJoinPresenterParticipant: [],
  leavePresenterParticipant: [],
  closeVideoStreamForParticipant: false,
  // startOrStopPresenter: false,
};

const videoFeatureReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ACCEPT_AND_REMOVE_PARTICIPANTS: {
      const { payload } = action; // payload is expected to be an array of uids
      console.log(payload, state.waitingParticipantsList, "payloadpayload");

      // Filter out participants whose UID is included in the payload array
      const filteredParticipants = state.waitingParticipantsList.filter(
        (participant) => !payload.includes(participant.guid)
      );
      console.log(filteredParticipants, "payloadpayloadfilteredParticipants");

      return {
        ...state,
        waitingParticipantsList: filteredParticipants,
      };
    }

    case actions.PARTICIPANT_JOINT_REQUESTS: {
      return {
        ...state,
        waitingParticipantsList: [
          ...state.waitingParticipantsList,
          action.response,
        ],
      };
    }

    case actions.SET_PARTICIPANT_NAME: {
      console.log(action, "datdtatdatdtatddatdtatdatdtatd");
      return {
        ...state,
        participantNameDataAccept: [
          ...state.participantNameDataAccept,
          ...action.response,
        ],
      };
    }
    case actions.GUEST_PARTICIPANT_LEAVE_VIDEO: {
      console.log(action, "actionactionactionactionaction");
      let copyState = [...state.getAllParticipantMain];
      let newData = copyState.filter(
        (videoParticipants, index) => videoParticipants.guid !== action.payload
      );
      return {
        ...state,
        getAllParticipantMain: newData,
      };
    }

    case actions.VIDEO_PARTICIPANT_NON_GUEST_LEFT: {
      console.log(action, "responseDataDataData");
      let copyState2 = [...state.waitingParticipantsList];
      let newData2 = copyState2.filter(
        (videoParticipants, index) => videoParticipants.guid !== action.payload
      );
      let updatedList = state.getAllParticipantMain.filter(
        (guest) => guest.guid !== action.payload
      );

      return {
        ...state,
        waitingParticipantsList: newData2,
        getAllParticipantMain: updatedList,
      };
    }

    case actions.VIDEO_CHAT_FLAG: {
      return {
        ...state,
        VideoChatPanel: action.response,
      };
    }

    case actions.CONTACT_VIDEO_FLAG: {
      return {
        ...state,
        ContactVideoFlag: action.response,
      };
    }

    case actions.RECENT_VIDEO_FLAG: {
      return {
        ...state,
        RecentVideoFlag: action.response,
      };
    }

    case actions.VIDEO_CHAT_SEARCH_FLAG: {
      return {
        ...state,
        VideoChatSearchFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_OTO_FLAG: {
      return {
        ...state,
        VideoCallOTOFlag: action.response,
      };
    }

    case actions.END_VIDEO_CALL_FLAG: {
      return {
        ...state,
        EndVideoCallFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_GROUP_FLAG: {
      return {
        ...state,
        VideoCallGroupFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_NORMAL_SCREEN_FLAG: {
      return {
        ...state,
        VideoCallNormalScreenFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_MINIMIZE_SCREEN_FLAG: {
      return {
        ...state,
        VideoCallMinimizeScreenFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_MAXIMIZE_SCREEN_FLAG: {
      return {
        ...state,
        VideoCallMaximizeScreenFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_NORMAL_HEADER_FLAG: {
      return {
        ...state,
        VideoCallNormalHeaderFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_MINIMIZE_HEADER_FLAG: {
      return {
        ...state,
        VideoCallMinimizeHeaderFlag: action.response,
      };
    }

    case actions.VIDEO_CALL_MAXIMIZE_HEADER_FLAG: {
      return {
        ...state,
        VideoCallMaximizeHeaderFlag: action.response,
      };
    }

    case actions.CHAT_ENABLE_NORMAL_FLAG: {
      return {
        ...state,
        VideoChatNormalFlag: action.response,
      };
    }

    case actions.AGENDA_ENABLE_NORMAL_FLAG: {
      return {
        ...state,
        VideoAgendaNormalFlag: action.response,
      };
    }

    case actions.MINUTES_MEETING_ENABLE_NORMAL_FLAG: {
      return {
        ...state,
        VideoMinutesMeetingNormalFlag: action.response,
      };
    }

    case actions.VIDEO_INCOMING_CALL_MAX: {
      return {
        ...state,
        VideoIncomingCallFlag: action.response,
      };
    }

    case actions.VIDEO_OUTGOING_CALL_MAX: {
      return {
        ...state,
        VideoOutgoingCallFlag: action.response,
      };
    }

    case actions.VIDEO_MULTIPLE_CALL_MAX: {
      return {
        ...state,
        VideoMultipleCallFlag: action.response,
      };
    }

    case actions.VIDEO_MAX_CHAT_OPEN: {
      return {
        ...state,
        VideoChatOpenFlag: action.response,
      };
    }

    case actions.VIDEO_MAX_AGENDA_OPEN: {
      return {
        ...state,
        VideoAgendaOpenFlag: action.response,
      };
    }

    case actions.VIDEO_MAX_MINUTES_OPEN: {
      return {
        ...state,
        VideoMinutesOpenFlag: action.response,
      };
    }

    case actions.TOGGLE_PARTICIPANTS_VISIBILITY: {
      return {
        ...state,
        participantsVisible: action.payload,
      };
    }

    case actions.MINIMIZE_VIDEO_PANEL: {
      return {
        ...state,
        MinimizeVideoFlag: action.response,
      };
    }

    case actions.NORMALIZE_VIDEO_PANEL: {
      return {
        ...state,
        NormalizeVideoFlag: action.response,
      };
    }

    case actions.MAXIMIZE_VIDEO_PANEL: {
      console.log(action, "MAXIMIZE_VIDEO_PANEL");
      return {
        ...state,
        MaximizeVideoFlag: action.response,
      };
    }

    case actions.INCOMING_VIDEO_FLAG: {
      return {
        ...state,
        IncomingVideoCallFlag: action.response,
      };
    }

    case actions.LEAVE_CALL_MODAL: {
      return {
        ...state,
        LeaveCallModalFlag: action.response,
      };
    }

    case actions.PARTICIPANT_POPUP_FLAG: {
      return {
        ...state,
        ParticipantPopupFlag: action.response,
      };
    }

    case actions.MINIMIZE_PARTICIPANT_POPUP_FLAG: {
      return {
        ...state,
        MinimizeParticipantPopupFlag: action.response,
      };
    }

    case actions.VIDEO_CHAT_MESSAGES_FLAG: {
      return {
        ...state,
        VideoChatMessagesFlag: action.response,
      };
    }

    case actions.GUEST_JOIN_POPUP: {
      return {
        ...state,
        ShowGuestPopup: action.response,
      };
    }

    case actions.PARTICIPANT_LIST_USERS: {
      console.log(
        action,
        "PARTICIPANT_LIST_USERSPARTICIPANT_LIST_USERSPARTICIPANT_LIST_USERS"
      );
      return {
        ...state,
        participantWaitinglistBox: action.response,
      };
    }

    case actions.MUTE_UNMUTE_PARTICIPANT_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.MUTE_UNMUTE_PARTICIPANT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        muteUnMuteParticipant: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.MUTE_UNMUTE_PARTICIPANT_FAIL: {
      return {
        ...state,
        Loading: false,
        muteUnMuteParticipant: [],
        ResponseMessage: action.message,
      };
    }

    case actions.HIDE_UNHIDE_PARTICIPANT_GUEST_VIDEO_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.HIDE_UNHIDE_PARTICIPANT_GUEST_VIDEO_SUCCESS: {
      return {
        ...state,
        Loading: false,
        hideUnHideParticipantorGuest: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.HIDE_UNHIDE_PARTICIPANT_GUEST_VIDEO_FAIL: {
      return {
        ...state,
        Loading: false,
        hideUnHideParticipantorGuest: [],
        ResponseMessage: action.message,
      };
    }

    case actions.PARTICIPANT_MUTEUNMUTE_VIDEO: {
      const { payload, isforAll, presenterViewHostFlag, presenterViewFlag } =
        action;
      console.log("allUidsallUids Payload:", isforAll);
      console.log("allUidsallUids Payload:", payload);
      console.log("allUidsallUids Payload:", presenterViewHostFlag);

      const meetingHostformeetingHost = JSON.parse(
        localStorage.getItem("meetinHostInfo")
      );

      // Ensure proper use of isForAll
      if (isforAll) {
        // Mute/Unmute all participants
        let updatedParticipantList = [];
        let participantUID = localStorage.getItem("participantUID");
        let isGuid = localStorage.getItem("isGuid");
        if (presenterViewFlag) {
          if (Object.keys(state.getAllParticipantMain).length > 0) {
            let uid = "";
            if (presenterViewHostFlag) {
              uid = meetingHostformeetingHost?.isHost ? isGuid : participantUID;
            }
            updatedParticipantList = state.getAllParticipantMain.map(
              (participant) =>
                participant.guid === uid
                  ? participant
                  : { ...participant, mute: payload } // Update only non-host participants
            );
          }
        } else {
          if (Object.keys(state.getAllParticipantMain).length > 0) {
            updatedParticipantList = state.getAllParticipantMain.map(
              (participant) =>
                participant.isHost
                  ? participant
                  : { ...participant, mute: payload } // Update only non-host participants
            );
          }
        }
        return {
          ...state,
          getAllParticipantMain: updatedParticipantList,
        };
      } else {
        // Individual participant mute/unmute
        if (!payload.uid) {
          console.error("Missing uid for individual mute/unmute action.");
          return state; // Return unchanged state if uid is not provided
        }
        const getMainMuteUnmuteParticipant = state.getAllParticipantMain.map(
          (participant) =>
            participant.guid === payload.uid
              ? { ...participant, mute: payload.isMuted }
              : participant
        );

        return {
          ...state,
          getAllParticipantMain: getMainMuteUnmuteParticipant,
        };
      }
    }

    case actions.PARTICIPANT_RAISEDUNRAISEDHAND_VIDEO: {
      let { payload } = action;
      let updatedRaisedParticipant = state.getAllParticipantMain.map(
        (participantData) => {
          let handraisedPayload =
            payload.participantGuid === participantData.guid ? true : false;
          if (handraisedPayload) {
            return {
              ...participantData,
              raiseHand: payload.isHandRaised,
            };
          }
          return participantData;
        }
      );

      return {
        ...state,
        getAllParticipantMain: updatedRaisedParticipant,
      };
    }

    case actions.PARTICIPANT_HIDEUNHIDE_VIDEO: {
      let { payload } = action;
      let updateParticipantHideUnHide = state.getAllParticipantMain.map(
        (hideUnHideParticipant) => {
          let hideUnHideVideoPayload =
            payload.uid === hideUnHideParticipant.guid ? true : false;
          if (hideUnHideVideoPayload) {
            return {
              ...hideUnHideParticipant,
              hideCamera: payload.isVideoHidden,
            };
          }
          return hideUnHideParticipant;
        }
      );
      return {
        ...state,
        getAllParticipantMain: updateParticipantHideUnHide,
      };
    }

    case actions.GET_VIDEO_PARTICIPANTS_FOR_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.GET_VIDEO_PARTICIPANTS_FOR_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllParticipantMain: action.response.participantList,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_VIDEO_PARTICIPANTS_FOR_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllParticipantMain: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MEETING_NEW_PARTICIPANT_JOIN: {
      console.log(action, "dtadtatatatatattata");
      let getPrevState = [...state.getAllParticipantMain, ...action.response];
      return {
        ...state,
        getAllParticipantMain: getPrevState,
      };
    }

    case actions.JOIN_MEETING_VIDEO_REQUEST_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.JOIN_MEETING_VIDEO_REQUEST_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getJoinMeetingParticipantorHostrequest: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.JOIN_MEETING_VIDEO_REQUEST_FAIL: {
      return {
        ...state,
        Loading: false,
        getJoinMeetingParticipantorHostrequest: null,
        ResponseMessage: action.message,
      };
    }

    case actions.MAX_HOST_VIDEO_CALL_PANEL: {
      console.log(action, "trurururuurururururuu");
      return {
        ...state,
        MaximizeHostVideoFlag: action.response,
        NormalHostVideoFlag: false,
      };
    }

    case actions.NORMAL_HOST_VIDEO_CALL_PANEL: {
      console.log(action, "trurururuurururururuu");

      return {
        ...state,
        NormalHostVideoFlag: action.response,
        MaximizeHostVideoFlag: false,
      };
    }

    //For Normal Participant Video Call
    case actions.PARTICIPANT_VIDEO_CALL_NORMAL_PANEL: {
      return {
        ...state,

        normalParticipantVideoFlag: action.response,
        maximizeParticipantVideoFlag: false,
      };
    }

    case actions.MAX_PARTICIPANT_VIDEO_CALL_PANEL: {
      console.log(action, "MAX_PARTICIPANT_VIDEO_CALL_PANEL");
      return {
        ...state,

        maximizeParticipantVideoFlag: action.response,
        normalParticipantVideoFlag: false,
      };
    }

    case actions.MAX_PARTICIPANT_VIDEO_DENIED:
      console.log(action, "MAX_PARTICIPANT_VIDEO_DENIED");

      return {
        ...state,
        maxParticipantVideoDeniedFlag: action.response,
        maximizeParticipantVideoFlag: false,
      };

    case actions.MAX_PARTICIPANT_VIDEO_REMOVED:
      return {
        ...state,
        maxParticipantVideoRemovedFlag: action.response,
        MaximizeVideoFlag: false,
      };

    case actions.PARTICIPANT_REMOVED_FROM_VIDEO_BY_HOST:
      return {
        ...state,
        participantRemovedFromVideobyHost: action.response,
      };
    case actions.PARTICIPANT_LEAVE_CALL_FOR_JOIN_NON_MEETING_CALL:
      return {
        ...state,
        participantLeaveCallForJoinNonMeetingCall: action.response,
      };

    case actions.GET_VIDEO_CALL_PARTICIPANT_AND_WAITING_LIST_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.GET_VIDEO_CALL_PARTICIPANT_AND_WAITING_LIST_SUCCESS: {
      console.log("API Response:", action.response);

      return {
        ...state,
        Loading: false,
        getAllParticipantMain: action.response.participantList,
        waitingParticipantsList: action.response.waitingParticipants,
      };
    }

    case actions.GET_VIDEO_CALL_PARTICIPANT_AND_WAITING_LIST_FAIL: {
      return {
        ...state,
        Loading: false,
        getVideoParticpantListandWaitingList: [],
        waitingParticipantsList: [],
        ResponseMessage: action.message,
      };
    }

    case actions.PARTICIPANT_VIDEO_SCREEN_NAVIGATION: {
      // sessionStorage.setItem("viewState", action.response);
      console.log("Updating participantVideoNavigationData:", action.response);
      return {
        ...state,
        MaximizeHostVideoFlag: false,
        participantVideoNavigationData: action.response,
      };
    }

    case actions.SET_MQTT_VIDEO_CONTROLE_HOST: {
      return {
        ...state,
        videoControlHost: action.response,
      };
    }
    case actions.SET_MQTT_VOICE_CONTROLE_HOST: {
      return {
        ...state,
        audioControlHost: action.response,
      };
    }

    // url for participants
    case actions.GET_VIDEOURL_PARTICIPANT: {
      console.log("GET_VIDEOURL_PARTICIPANT", action.response);

      return {
        ...state,
        getParticipantsVideoUrl: action.response,
      };
    }

    case actions.SET_MQTT_VIDEO_MEETING_PARTICIPANT: {
      console.log("SET_MQTT_VIDEO_MEETING_PARTICIPANT", action.response);
      return {
        ...state,
        videoControlForParticipant: action.response,
      };
    }
    case actions.SET_MQTT_VOICE_PARTICIPANT: {
      console.log("SET_MQTT_VOICE_PARTICIPANT", action.response);
      return {
        ...state,
        audioControlForParticipant: action.response,
      };
    }

    case actions.SET_RAISED_UNRAISED_PPARTICIPANT: {
      return {
        ...state,
        raisedUnRaisedParticipant: action.response,
      };
    }

    //Check host Now
    case actions.CHECK_HOST_HOST_NOW: {
      return {
        ...state,
        checkHostNow: action.response,
      };
    }

    //make host Now
    case actions.MAKE_HOST_HOST_NOW: {
      return {
        ...state,
        makeHostNow: action.response,
      };
    }

    case actions.MIC_ENABLE_WHEN_HOST_PANEL_MIC_ENABLE:
      return {
        ...state,
        isMicEnabled: action.payload,
      };
    case actions.VIDEO_ENABLE_WHEN_HOST_PANEL_VIDEO_ENABLE:
      return {
        ...state,
        isWebCamEnabled: action.payload,
      };

    // FOR AUDIO STREAM GLOBAL
    case actions.GLOBAL_STREAM_AUDIO:
      return {
        ...state,
        isAudioGlobalStream: action.response,
      };

    // FOR VIDEO STREAM GLOBAL
    case actions.GLOBAL_STREAM_VIDEO:
      return {
        ...state,
        isVideoGlobalStream: action.response,
      };

    // FOR ALL GLOBAL NAVIGATOR VIDEO STREAM
    case actions.GLOBAL_NAVIGATORE_VIDEO_STREAM:
      return {
        ...state,
        allNavigatorVideoStream: action.response,
      };

    // FOR MAKE A PARTICIPANT AS A HOST
    case actions.MAKE_A_PARTICIPANT_HOST:
      return {
        ...state,
        makeParticipantAsHost: action.flag,
        makeParticipantAsHostData: action.response,
      };

    //FOR NON MEETING VIDEO MODAL
    case actions.NON_MEETING_VIDEO_MODAL: {
      return {
        ...state,
        nonMeetingVideo: action.response,
      };
    }

    //For Close QuickMeeting Video Call
    case actions.CLOSE_VIDEOCALL_QUICK_MEETING: {
      return {
        ...state,
        endMeetingStatusForQuickMeetingVideoFlag: action.response,
      };
    }

    //For Close QuickMeeting Modal Call
    case actions.CLOSE_QUICK_MEETING_VIDEO_MODAL: {
      return {
        ...state,
        endMeetingStatusForQuickMeetingModalFlag: action.response,
      };
    }

    //For End Meeting Status Mqtt Response
    case actions.LEAVE_MEETING_END_STATUS_RESPONSE: {
      return {
        ...state,
        leaveMeetingOnEndStatusMqttFlag: action.response,
      };
    }

    //For End Video Status Mqtt Response
    case actions.LEAVE_MEETINGVIDEO_END_STATUS_RESPONSE: {
      return {
        ...state,
        leaveMeetingVideoOnEndStatusMqttFlag: action.response,
      };
    }

    // For videoIcon enable and disable or button
    case actions.VIDEO_BUTTON_OR_ICON_STATE: {
      return {
        ...state,
        enableDisableVideoState: action.response,
      };
    }

    //For VideoIcon Enable and Disable button From Participant Side
    case actions.PARTICIPANT_BUTTON_VIDEO_ENABLE_DISABLE: {
      return {
        ...state,
        participantEnableVideoState: action.response,
      };
    }

    case actions.LEAVE_MEETING_ON_LOGOUT:
      return {
        ...state,
        leaveMeetingOnLogoutResponse: action.response,
      };

    case actions.DISABLE_BUTTONS_ZOOM_BEFORE_JOIN_SESSION:
      return {
        ...state,
        disableBeforeJoinZoom: action.response,
      };

    // Stop Meeting Video By presenter View when Some one Already Join the meeting Video
    case actions.STOP_MEETING_VIDEO_BY_PRESENTER_VIEW:
      console.log("CheckStopMeetingVideo", action.response);
      return {
        ...state,
        meetingStoppedByPresenter: action.response,
      };

    // For Presenter Join Started Main State
    case actions.PRESENTER_STARTED_MAIN_FLAG:
      console.log("PRESENTER_STARTED_MAIN_FLAG", action.response);
      return {
        ...state,
        presenterStartedFlag: action.response,
      };

    //State for start presenter view flag for already In participant Meeting Video
    case actions.START_PRESENTER_VIEW_FLAG_FOR_ALREADYIN_PARTICIPANT_MEETINGVIDEO:
      return {
        ...state,
        presenterParticipantAlreadyInMeetingVideo: action.response,
      };

    // global state for Presenter Participants who joined Presenter Video
    case actions.PRESENTER_JOIN_PARTICIPANT_VIDEO:
      console.log("hell", action.response);
      return {
        ...state,
        newJoinPresenterParticipant: action.response,
      };

    case actions.PRESENTER_LEAVE_PARTICIPANT_VIDEO:
      console.log("hell", action);
      return {
        ...state,
        leavePresenterParticipant: action.response,
      };

    case actions.CLEAR_PRESENTER_PARTICIPANTS:
      console.log("MEETING_PRESENTATION_STOPPED - Clearing Participants");
      return {
        ...state,
        newJoinPresenterParticipant: [], // Empty the list
      };

    // Close max Participant Video Stream
    case actions.CLOSE_IS_WAITING_MAXPARTICIPANT_VIDEO_STREAM:
      console.log(
        "CLOSE_IS_WAITING_MAXPARTICIPANT_VIDEO_STREAM",
        action.response
      );
      return {
        ...state,
        closeVideoStreamForParticipant: action.response, // Add new participant
      };

    //For Presenter View Global State
    case actions.SET_MQTT_PRESENTER_RESPONSE:
      console.log(
        "presenterMeetingIdpresenterMeetingId",
        action.response,
        action.presenterMeetingId,
        action.presenterViewFlag
      );

      return {
        ...state,
        presenterMeetingId: action.payload.presenterMeetingId,
        presenterViewFlag: action.payload.presenterViewFlag,
        presenterViewHostFlag: action.payload.presenterViewHostFlag,
        presenterViewJoinFlag: action.payload.presenterViewJoinFlag,
      };

    // For Open Presenter View Api
    case actions.OPEN_PRESENTER_VIEW_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.OPEN_PRESENTER_VIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        presenterOpenView: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.OPEN_PRESENTER_VIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        presenterOpenView: null,
        ResponseMessage: action.message,
      };
    }

    // For Start Presenter View Api
    case actions.START_PRESENTER_VIEW_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.START_PRESENTER_VIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        presenterViewStart: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.START_PRESENTER_VIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        presenterViewStart: null,
        ResponseMessage: action.message,
      };
    }

    // For Stop Presenter View Api
    case actions.STOP_PRESENTER_VIEW_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.STOP_PRESENTER_VIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        presenterViewStop: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.STOP_PRESENTER_VIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        presenterViewStop: null,
        ResponseMessage: action.message,
      };
    }

    // For Join Presenter View Api
    case actions.JOIN_PRESENTER_VIEW_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.JOIN_PRESENTER_VIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        joinPresenterView: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.JOIN_PRESENTER_VIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        joinPresenterView: null,
        ResponseMessage: action.message,
      };
    }

    // For leave Presenter View Api
    case actions.LEAVE_PRESENTER_VIEW_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.LEAVE_PRESENTER_VIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        leavePresenterView: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.LEAVE_PRESENTER_VIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        leavePresenterView: null,
        ResponseMessage: action.message,
      };
    }

    case actions.LEAVE_MEETING_VIDEO_ON_LOGOUT:
      return {
        ...state,
        leaveMeetingVideoOnLogoutResponse: action.response,
      };

    case actions.CLEAR_VIDEOFEATURE_MESSAGES:
      return {
        ...state,
        ResponseMessage: "",
      };

    default:
      return { ...state };
  }
};
export default videoFeatureReducer;
