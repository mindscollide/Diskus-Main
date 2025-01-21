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
  startPresenterReducer: false,
  stopPresenterReducer: false,
  minimizePresenterReducer: false,
  leavePresenterModal: false,
  slowPresenterInternet: "",
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
      let copyState = [...state.getVideoParticpantListandWaitingList];
      let newData = copyState.filter(
        (videoParticipants, index) => videoParticipants.guid !== action.payload
      );
      return {
        ...state,
        getVideoParticpantListandWaitingList: newData,
      };
    }

    case actions.VIDEO_PARTICIPANT_NON_GUEST_LEFT: {
      console.log(action, "responseDataDataData");
      let copyState = [...state.getVideoParticpantListandWaitingList];
      let newData = copyState.filter(
        (videoParticipants, index) => videoParticipants.guid !== action.payload
      );
      let copyState2 = [...state.waitingParticipantsList];
      let newData2 = copyState2.filter(
        (videoParticipants, index) => videoParticipants.guid !== action.payload
      );
      let updatedList = state.getAllParticipantMain.filter(
        (guest) => guest.guid !== action.payload
      );
      console.log(updatedList, "newDatanewDatanewDataasxas");

      return {
        ...state,
        waitingParticipantsList: newData2,
        getVideoParticpantListandWaitingList: newData,
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
      const { payload, flag } = action;
      console.log("allUidsallUids Payload:", flag);
      console.log("allUidsallUids Payload:", payload);
      let meetinHostInfo = false;
      let isGuid = "";
      let isuid = 0;
      const meetingHostformeetingHost = JSON.parse(
        localStorage.getItem("meetinHostInfo")
      );
      if (meetingHostformeetingHost?.isHost) {
        meetinHostInfo = true;
        isGuid = localStorage.getItem("isGuid");
        isuid = Number(localStorage.getItem("userID"));
      } else {
        const hostsData = sessionStorage.getItem("currentmeetingHost");
        // Parse it back to a JavaScript object
        const hosts = hostsData ? JSON.parse(hostsData) : [];
        meetinHostInfo = false;
        isGuid = hosts.guid;
        isuid = Number(hosts.userID);
      }
      // Ensure proper use of isForAll
      if (action.flag) {
        // Mute/Unmute all participants
        let updatedParticipantList = [];
        let newParticipantList = [];
        if (meetinHostInfo) {
          console.log("participanMuteUnMuteMeeting");
          if (
            Object.keys(state.getVideoParticpantListandWaitingList).length > 0
          ) {
            console.log("participanMuteUnMuteMeeting");
            updatedParticipantList =
              state.getVideoParticpantListandWaitingList.map(
                (participant) =>
                  participant.isHost
                    ? participant // Do not modify if the participant is a host
                    : { ...participant, mute: payload } // Update only non-host participants
              );
            console.log("participanMuteUnMuteMeeting", updatedParticipantList);

            updatedParticipantList = filterHostData(
              updatedParticipantList,
              isGuid
            );
            console.log("participanMuteUnMuteMeeting", updatedParticipantList);
          }
        } else {
          console.log("allUidsallUids");
          if (Object.keys(state.getAllParticipantMain).length > 0) {
            newParticipantList = state.getAllParticipantMain.map(
              (participant) =>
                participant.isHost
                  ? participant // Do not modify if the participant is a host
                  : { ...participant, mute: payload } // Update only non-host participants
            );
            console.log("participanMuteUnMuteMeeting", updatedParticipantList);

            newParticipantList = filterHostData(newParticipantList, isGuid);
            console.log("participanMuteUnMuteMeeting", updatedParticipantList);
          }
        }

        console.log(state.getAllParticipantMain, "participanMuteUnMuteMeeting");
        console.log(
          state.getVideoParticpantListandWaitingList,
          "participanMuteUnMuteMeeting"
        );

        return {
          ...state,
          getVideoParticpantListandWaitingList: updatedParticipantList,
          audioControlForParticipant: payload, // Update global state only for "Mute All"
          getAllParticipantMain: newParticipantList,
        };
      } else {
        // Individual participant mute/unmute
        if (!payload.uid) {
          console.error("Missing uid for individual mute/unmute action.");
          return state; // Return unchanged state if uid is not provided
        }

        const updatedParticipantList =
          state.getVideoParticpantListandWaitingList.map((participant) =>
            participant.guid === payload.uid
              ? { ...participant, mute: payload.isMuted }
              : participant
          );

        const getMainMuteUnmuteParticipant = state.getAllParticipantMain.map(
          (participant) =>
            participant.guid === payload.uid
              ? { ...participant, mute: payload.isMuted }
              : participant
        );

        return {
          ...state,
          getVideoParticpantListandWaitingList: updatedParticipantList,
          getAllParticipantMain: getMainMuteUnmuteParticipant,
        };
      }
    }

    case actions.PARTICIPANT_RAISEDUNRAISEDHAND_VIDEO: {
      let { payload } = action;
      console.log(
        payload,
        state.getVideoParticpantListandWaitingList,
        "getNewParticipantsMeetingJoinRaiseHand"
      );
      let updatedRaisedParticipant =
        state.getVideoParticpantListandWaitingList.map((participantData) => {
          let handraisedPayload =
            payload.participantGuid === participantData.guid ? true : false;
          if (handraisedPayload) {
            return {
              ...participantData,
              raiseHand: payload.isHandRaised,
            };
          }
          return participantData;
        });

      //For main Participant Hand Raised
      let updateParticipantHandRaised = state.getAllParticipantMain.map(
        (handRaiseMainarticipant) => {
          let handRaiseParticipant =
            payload.participantGuid === handRaiseMainarticipant.guid
              ? true
              : false;
          if (handRaiseParticipant) {
            return {
              ...handRaiseMainarticipant,
              raiseHand: payload.isHandRaised,
            };
          }
          return handRaiseMainarticipant;
        }
      );

      return {
        ...state,
        getVideoParticpantListandWaitingList: updatedRaisedParticipant,
        getAllParticipantMain: updateParticipantHandRaised,
      };
    }

    case actions.PARTICIPANT_HIDEUNHIDE_VIDEO: {
      let { payload } = action;
      console.log(
        payload,
        state.getVideoParticpantListandWaitingList,
        " hidehidehidheVideoDataa"
      );
      let updateHideVideo = state.getVideoParticpantListandWaitingList.map(
        (hideUnhideData) => {
          let hideUnHideVideoPayload =
            payload.uid === hideUnhideData.guid ? true : false;
          if (hideUnHideVideoPayload) {
            return {
              ...hideUnhideData,
              hideCamera: payload.isVideoHidden,
            };
          }
          return hideUnhideData;
        }
      );

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
      console.log(updateHideVideo, "updateHideVideoupdateHideVideo");
      return {
        ...state,
        getVideoParticpantListandWaitingList: updateHideVideo,
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
      console.log(
        action,
        "getAllParticipantMain-ForParticipacnt Video Reducer"
      );
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
      let getPrevState = [
        ...state.getVideoParticpantListandWaitingList,
        ...action.response,
      ];
      return {
        ...state,
        getVideoParticpantListandWaitingList: getPrevState,
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
      console.log(action, "MAX_PARTICIPANT_VIDEO_REMOVED");

      return {
        ...state,
        maxParticipantVideoRemovedFlag: action.response,
        MaximizeVideoFlag: false,
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
        getVideoParticpantListandWaitingList: action.response.participantList,
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

    // Start Presenter View Reducer
    case actions.START_PRESENTER_GLOBAL_STATE:
      return {
        ...state,
        startPresenterReducer: action.response,
      };

    // Stop Presenter View Reducer
    case actions.STOP_PRESENTER_GLOBAL_STATE:
      return {
        ...state,
        stopPresenterReducer: action.response,
      };

    // Minimize Presenter View Reducer
    case actions.MINIMIZE_PRESENETER_STATE:
      return {
        ...state,
        minimizePresenterReducer: action.response,
      };

    //  Presenter Leave Modal Reducer
    case actions.PRESENTER_LEAVE_MODAL:
      return {
        ...state,
        leavePresenterModal: action.response,
      };

    // For Slow Internet Presenter Connectivity
    case actions.PRESENTER_SLOW_INTERNET_CONNECTIVITY:
      return {
        ...state,
        slowPresenterInternet: action.response,
      };

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
