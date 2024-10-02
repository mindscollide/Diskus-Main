import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  guestVideoData: null,
  validateData: null,
  joinGuestData: null,
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

    default:
      return { ...state };
  }
};

export default GuestVideoReducer;
