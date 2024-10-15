import * as actions from "../action_types";

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
  muteUnMuteData: null,
  transferMeetingData: null,
  removeParticipantMeetingData: null,
  participantNameDataAccept: [],
  guestLeaveVideoMeetingData: null,
  removeGuestParticipantUser: null,
  muteUnMuteSelfData: null,
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
      return {
        ...state,
        guestVideoNavigationData: action.response,
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
        muteUnMuteData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.MUTE_UNMUTE_PARTICIPANT_FAIL: {
      return {
        ...state,
        Loading: false,
        muteUnMuteData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_PARTICIPANT_FROM_MEETING_INIT: {
      return {
        ...state,
        Loading: false,
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

    default:
      return { ...state };
  }
};

export default GuestVideoReducer;
