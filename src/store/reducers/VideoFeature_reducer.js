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
};

const videoFeatureReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ACCEPT_AND_REMOVE_PARTICIPANTS: {
      const { payload } = action; // payload is expected to be an array of uids
      console.log(payload, state.participantWaitingList, "payloadpayload");

      // Filter out participants whose UID is included in the payload array
      const filteredParticipants = state.participantWaitingList.filter(
        (participant) => !payload.includes(participant.guid)
      );
      console.log(filteredParticipants, "payloadpayloadfilteredParticipants");

      return {
        ...state,
        participantWaitingList: filteredParticipants,
      };
    }

    case actions.PARTICIPANT_JOINT_REQUESTS: {
      return {
        ...state,
        participantWaitingList: [
          ...state.participantWaitingList,
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
      let copyState = [...state.getNewParticipantsMeetingJoin];
      let newData = copyState.filter(
        (videoParticipants, index) => videoParticipants.guid !== action.payload
      );
      return {
        ...state,
        getNewParticipantsMeetingJoin: newData,
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
      let { payload } = action;
      console.log(
        payload,
        state.getNewParticipantsMeetingJoin,
        "responseresponseresponse"
      );
      let updatedParticipantList = state.getNewParticipantsMeetingJoin.map(
        (participantData) => {
          console.log(participantData, "participantDataparticipantData");

          // Find the corresponding participant in the payload using UID
          let correspondingPayload =
            payload.uid === participantData.guid ? true : false;

          // If a corresponding participant is found in the payload, update the isMute value
          if (correspondingPayload) {
            return {
              ...participantData,
              mute: payload.isMuted, // Update isMute with the value from the payload
            };
          }
          // If no match is found, return the original participant data
          return participantData;
        }
      );
      console.log(updatedParticipantList, "updatedParticipantList");

      return {
        ...state,
        getNewParticipantsMeetingJoin: updatedParticipantList,
      };
    }

    case actions.PARTICIPANT_RAISEDUNRAISEDHAND_VIDEO: {
      let { payload } = action;
      console.log(
        payload,
        state.getNewParticipantsMeetingJoin,
        "getNewParticipantsMeetingJoinRaiseHand"
      );
      let updatedRaisedParticipant = state.getNewParticipantsMeetingJoin.map(
        (participantData) => {
          console.log(participantData, "participantDataparticipantData");

          let handraisedPayload =
            payload.participantGuid === participantData.guid ? true : false;
          if (handraisedPayload) {
            return {
              ...participantData,
              raiseHand: payload.isHandRaised,
            };
          }
          console.log(handraisedPayload, "handraisedPayloadhandraisedPayload");
          return participantData;
        }
      );
      console.log(
        updatedRaisedParticipant,
        "handraisedPayloadhandraisedPayload"
      );

      return {
        ...state,
        getNewParticipantsMeetingJoin: updatedRaisedParticipant,
      };
    }

    case actions.PARTICIPANT_HIDEUNHIDE_VIDEO: {
      let { payload } = action;
      console.log(
        payload,
        state.getNewParticipantsMeetingJoin,
        " hidehidehidheVideoDataa"
      );
      let updateHideVideo = state.getNewParticipantsMeetingJoin.map(
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
      console.log(updateHideVideo, "updateHideVideoupdateHideVideo");
      return {
        ...state,
        getNewParticipantsMeetingJoin: updateHideVideo,
      };
    }

    case actions.GET_MEETING_NEW_PARTICIPANT_JOIN: {
      let getPrevState = [
        ...state.getNewParticipantsMeetingJoin,
        ...action.response,
      ];
      return {
        ...state,
        getNewParticipantsMeetingJoin: getPrevState,
      };
    }

    default:
      return { ...state };
  }
};
export default videoFeatureReducer;
