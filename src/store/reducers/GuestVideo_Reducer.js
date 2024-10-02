import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  guestVideoData: null,
  validateData: null,
  joinGuestData: null,
  guestClient: null,
  admitRejectData: null,
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
      }
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

    default:
      return { ...state };
  }
};

export default GuestVideoReducer;
