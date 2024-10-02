import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  guestVideoData: null,
};

const GuestVideoReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_MEETING_GUEST_URL_INIT: {
      return {
        ...state,
        Loading: true,
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

    default:
      return { ...state };
  }
};

export default GuestVideoReducer;
