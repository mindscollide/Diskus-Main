/**
 * @file VideoCall_reducer.js
 * @description Redux reducer for the `videoCall` slice. Manages the
 * visibility state of the video-call UI box: open, close, minimize,
 * normalize, maximize, incoming-call overlay, and group video panel.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} closeVideoCall        - Whether the call box is closed.
 * @property {boolean} minmizeVideoCall      - Whether the call box is minimized.
 * @property {boolean} normalVideoCall       - Whether the call box is in normal view.
 * @property {boolean} maximizeVideoCall     - Whether the call box is maximized.
 * @property {boolean} openVideoCall         - Whether the call box is open.
 * @property {boolean} openIncomingCall      - Whether the incoming-call overlay is visible.
 * @property {boolean} openGroupVideopanel   - Whether the group video panel is open.
 */
const initialState = {
  closeVideoCall: false,
  minmizeVideoCall: false,
  normalVideoCall: false,
  maximizeVideoCall: false,
  openVideoCall: false,
  openIncomingCall: false,
  openGroupVideopanel: false,
};

/**
 * Reducer for the `videoCall` slice.
 * Controls the open/close/minimize/maximize/normalize states of the
 * video-call UI box and the incoming-call / group video panel.
 *
 * @param {object} state  - Current videoCall state.
 * @param {{ type: string, response?: * }} action - Dispatched action.
 * @returns {object} Next state.
 */
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
