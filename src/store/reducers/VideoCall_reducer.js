import * as actions from "../action_types";

const initialState = {
  closeVideoCall: false,
  minmizeVideoCall: false,
  normalVideoCall: false,
  maximizeVideoCall: false,
  openVideoCall: false,
  openIncomingCall: false,
  openGroupVideopanel: false,
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

    case actions.VIDEO_BOX_NORMAL: {
      return {
        ...state,
        normalVideoCall: action.response,
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

    case actions.OPENING_GROUP_CALL: {
      return {
        ...state,
        openGroupVideopanel: action.response,
      };
    }
    default:
      return { ...state };
  }
};

export default VideoCallReducer;
