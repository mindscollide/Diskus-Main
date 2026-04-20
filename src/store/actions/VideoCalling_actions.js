/**
 * @file VideoCalling_actions.js
 * @description Redux action creators for video-call box UI state management.
 * Controls the open/close/minimize/maximize/normalize state of the floating video-call
 * panel, incoming-call notifications, and the group video panel.
 * Dispatches: VIDEO_BOX_OPEN / VIDEO_BOX_CLOSE / VIDEO_BOX_MINIMIZE /
 * VIDEO_BOX_MAXIMIZE / VIDEO_BOX_NORMAL / INCOMING_CALL_OPEN / OPENING_GROUP_CALL action types.
 */
import * as actions from "../action_types";

/**
 * Opens the video-call box.
 * @param {*} response - State payload.
 * @returns {{ type: string, response: * }}
 */
const setOpenVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_OPEN,
    response: response,
  };
};

/**
 * Closes the video-call box.
 * @param {*} response - State payload.
 * @returns {{ type: string, response: * }}
 */
const setCloseVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_CLOSE,
    response: response,
  };
};

/**
 * Minimizes the video-call box.
 * @param {*} response - State payload.
 * @returns {{ type: string, response: * }}
 */
const setMinimizeVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_MINIMIZE,
    response: response,
  };
};

/**
 * Maximizes the video-call box.
 * @param {*} response - State payload.
 * @returns {{ type: string, response: * }}
 */
const setMaximizeVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_MAXIMIZE,
    response: response,
  };
};

/**
 * Restores the video-call box to normal size.
 * @param {*} response - State payload.
 * @returns {{ type: string, response: * }}
 */
const setNormalVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_NORMAL,
    response: response,
  };
};

/**
 * Sets the incoming video-call notification state.
 * @param {*} response - Incoming call data.
 * @returns {{ type: string, response: * }}
 */
const setVideoIncomingCall = (response) => {
  return {
    type: actions.INCOMING_CALL_OPEN,
    response: response,
  };
};

/**
 * Sets the group video panel open/close state.
 * @param {*} response - Panel state.
 * @returns {{ type: string, response: * }}
 */
const setGroupVideoPanel = (response) => {
  return {
    type: actions.OPENING_GROUP_CALL,
    response: response,
  };
};

export {
  setOpenVideoCallBox,
  setCloseVideoCallBox,
  setMinimizeVideoCallBox,
  setMaximizeVideoCallBox,
  setVideoIncomingCall,
  setGroupVideoPanel,
  setNormalVideoCallBox,
};
