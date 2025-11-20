import { Sa } from "react-flags-select";
import * as actions from "../action_types";
import { removeParticipantByGuid } from "../../commen/functions/regex";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  guestVideoData: null,
  validateData: null,
  joinGuestData: null,
  guestClient: null,
  admitRejectData: null,
  admitGuestUserRequestData: null,
  guestVideoNavigationData: 1,
  raiseUnRaiseData: null,
  transferMeetingData: null,
  removeParticipantMeetingData: null,
  participantNameDataAccept: [],
  guestLeaveMeetingList: [],
  guestLeaveVideoMeetingData: null,
  removeGuestParticipantUser: null,
  muteUnMuteSelfData: null,
  hideUnhideSelfVideo: null,
  muteUmMuteByHost: null,
  hideunHideByHost: null,
  videoCameraGuest: false,
  voiceControle: false,
  getAllParticipantGuest: null,
  validateStringData: null,
  raiseUnRaisedParticipantorGuest: null,
  hideUnHideParticpantorGuest: null,
  muteUnMuteParticpantorGuest: null,
  setStreamStop: false,
  setStreamTypeForNavigate: 0,
  muteUnMuteParticpantorGuestByHost: false,
  voiceControleForAllByHost: false,
  voiceControleForAllByHostFlag: false,
  hostTransferFlag: false,
};

const GuestVideoReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_MEETING_GUEST_URL_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.GET_MEETING_GUEST_URL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        guestVideoData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MEETING_GUEST_URL_FAIL: {
      return {
        ...state,
        Loading: false,
        guestVideoData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_SUCCESS: {
      return {
        ...state,
        Loading: false,
        validateData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_FAIL: {
      return {
        ...state,
        Loading: false,
        validateData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.JOIN_GUEST_VIDEO_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.JOIN_GUEST_VIDEO_SUCCESS: {
      return {
        ...state,
        Loading: false,
        joinGuestData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.JOIN_GUEST_VIDEO_FAIL: {
      return {
        ...state,
        Loading: false,
        joinGuestData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.SET_MQTT_GUEST: {
      return {
        ...state,
        guestClient: action.response,
      };
    }

    case actions.ADMIT_REJECT_ATTENDEE_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.ADMIT_REJECT_ATTENDEE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        admitRejectData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.ADMIT_REJECT_ATTENDEE_FAIL: {
      return {
        ...state,
        Loading: false,
        admitRejectData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CLEAR_GUEST_MEETING_MESSAGES: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

    case actions.ADMIT_GUEST_USER_REQUEST: {
      return {
        ...state,
        admitGuestUserRequestData: action.response,
      };
    }

    case actions.GUEST_VIDEO_SCREEN_NAVIGATION: {
      // sessionStorage.setItem("viewState", action.response);
      return {
        ...state,
        guestVideoNavigationData: action.response,
      };
    }

    case actions.GUEST_VIDEO_STREAM_STOP: {
      // sessionStorage.setItem("viewState", action.response);
      return {
        ...state,
        setStreamTypeForNavigate: action.flag,
        setStreamStop: action.response,
      };
    }

    case actions.RAISE_UNRAISED_HAND_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.RAISE_UNRAISED_HAND_SUCCESS: {
      return {
        ...state,
        Loading: false,
        raiseUnRaiseData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.RAISE_UNRAISED_HAND_FAIL: {
      return {
        ...state,
        Loading: false,
        raiseUnRaiseData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_PARTICIPANT_FROM_MEETING_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.TRANSFER_MEETING_HOST_SUCCESS: {
      console.log("videoHideUnHideForHost", action.response);
      return {
        ...state,
        hostTransferFlag: action.response,
      };
    }

    case actions.REMOVE_PARTICIPANT_FROM_MEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        removeParticipantMeetingData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_PARTICIPANT_FROM_MEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        removeParticipantMeetingData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GUEST_VIDEO_LEAVE_MEETING_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.GUEST_VIDEO_LEAVE_MEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        guestLeaveVideoMeetingData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GUEST_VIDEO_LEAVE_MEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        guestLeaveVideoMeetingData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.MUTE_UNMUTE_SELF_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.MUTE_UNMUTE_SELF_SUCCESS: {
      return {
        ...state,
        Loading: false,
        muteUnMuteSelfData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.MUTE_UNMUTE_SELF_FAIL: {
      return {
        ...state,
        Loading: false,
        muteUnMuteSelfData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_PARTICIPANTS_FROM_VIDEO: {
      // Filter out participants whose UID is included in the payload array
      console.log(action, "responseresponseresponse");
      const participantsFilterization = state.participantNameDataAccept.filter(
        (participant) => participant.UID !== action.response
      );
      console.log(participantsFilterization, "participantsFilterization");
      return {
        ...state,
        participantNameDataAccept: participantsFilterization,
      };
    }

    case actions.MUTE_UNMUTE_PARTICIPANT_OR_GUEST: {
      console.log(
        action,

        "MUTE_UNMUTE_PARTICIPANT_OR_GUESTMUTE_UNMUTE_PARTICIPANT_OR_GUEST"
      );
      return {
        ...state,
        muteUmMuteByHost: action.response,
      };
    }

    case actions.HIDE_UNHIDE_VIDEO_BY_HOST: {
      console.log(action, "responseresponse");
      return {
        ...state,
        hideunHideByHost: action.response,
      };
    }

    case actions.HIDE_UNHIDE_SELF_VIDEO_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.HIDE_UNHIDE_SELF_VIDEO_SUCCESS: {
      return {
        ...state,
        Loading: false,
        hideUnhideSelfVideo: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.HIDE_UNHIDE_SELF_VIDEO_FAIL: {
      return {
        ...state,
        Loading: false,
        hideUnhideSelfVideo: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_VIDEO_PARTICIPANTS_FOR_GUEST_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.GET_VIDEO_PARTICIPANTS_FOR_GUEST_SUCCESS: {
      console.log(action, "actionsactionsactions");
      let data = [];
      if (action.flag === 2) {
        data = [...state.getAllParticipantGuest];
        data.push(action.response);
      } else if (action.flag === 3) {
        let dublicate = [...state.getAllParticipantGuest];
        console.log(
          "hideUnHideParticpantorGuest123",
          removeParticipantByGuid(data, action.response)
        );
        data = removeParticipantByGuid(dublicate, action.response);
      } else {
        data = action.response;
      }
      console.log("hideUnHideParticpantorGuest123", data);
      return {
        ...state,
        Loading: false,
        getAllParticipantGuest: data,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_VIDEO_PARTICIPANTS_FOR_GUEST_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllParticipantGuest: null,
        ResponseMessage: action.message,
      };
    }

    case actions.PARTICIPANT_HIDEUNHIDE_VIDEO: {
      console.log("MQTT onMessageArrived", action.payload);

      // Safely handle null `getAllParticipantGuest`
      const updatedParticipants =
        state.getAllParticipantGuest?.participantList?.map((participant) =>
          participant.guid === action.payload.uid
            ? { ...participant, isVideoHidden: action.payload.isVideoHidden }
            : participant
        ) || [];

      console.log("Updated Participants:", updatedParticipants);

      return {
        ...state,
        getAllParticipantGuest: state.getAllParticipantGuest
          ? {
              ...state.getAllParticipantGuest,
              participantList: updatedParticipants,
            }
          : {
              participantList: updatedParticipants,
            },
      };
    }

    case actions.SET_MQTT_VIDEO_CAMERA_GUEST: {
      return {
        ...state,
        videoCameraGuest: action.response,
      };
    }
    case actions.SET_MQTT_VOICE_CONTROLE_GUEST: {
      return {
        ...state,
        voiceControle: action.response,
      };
    }
    case actions.SET_MQTT_VOICE_CONTROLE_GUEST_FOR_ALL_BY_HOST: {
      return {
        ...state,
        voiceControleForAllByHost: action.response,
        voiceControleForAllByHostFlag: action.flag,
      };
    }

    // to get validate room Id from Validate String
    case actions.GET_VALIDATE_STRING_DATA: {
      return {
        ...state,
        validateStringData: action.response,
      };
    }

    case actions.RAISE_UNRAISED_PARTICIPANTS_GUEST: {
      return {
        ...state,
        raiseUnRaisedParticipantorGuest: action.response,
      };
    }

    case actions.HIDE_UNHIDE_VIDEO_PARTICIPANTS_GUEST: {
      return {
        ...state,
        hideUnHideParticpantorGuest: action.response,
      };
    }

    case actions.MUTE_UNMUTE_PARTICIPANTS_GUEST: {
      return {
        ...state,
        muteUnMuteParticpantorGuest: action.response,
      };
    }
    case actions.MUTE_UNMUTE_PARTICIPANTS_GUEST_BY_HOST: {
      return {
        ...state,
        muteUnMuteParticpantorGuestByHost: action.response,
      };
    }
    case actions.CLEAR_RESPONSEMESSAGE_GUESTREDUCER:
      return {
        ...state,
        ResponseMessage: "",
      };
    default:
      return { ...state };
  }
};

export default GuestVideoReducer;
