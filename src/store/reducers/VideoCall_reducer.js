import * as actions from "../action_types";

const initialState = {
  closeVideoCall: false,
  minmizeVideoCall: false,
  maximizeVideoCall: false,
  openVideoCall: false,
  openIncomingCall: false,
};

const VideoCallReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.VIDEO_BOX_CLOSE: {
      return {
        ...state,
        closeVideoCall: action.response,
      };
    }

    case actions.VIDEO_BOX_MINIMIZE: {
      return {
        ...state,
        minmizeVideoCall: action.response,
      };
    }

    case actions.VIDEO_BOX_MAXIMIZE: {
      return {
        ...state,
        maximizeVideoCall: action.response,
      };
    }

    case actions.VIDEO_BOX_OPEN: {
      return {
        ...state,
        openVideoCall: action.response,
      };
    }

    case actions.INCOMING_CALL_OPEN: {
      return {
        ...state,
        openIncomingCall: action.response,
      };
    }
    default:
      return { ...state };
  }
};

export default VideoCallReducer;
