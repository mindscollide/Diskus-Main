import * as actions from "../action_types";

const setOpenVideoCallBox = (response) => {
  console.log("closeButtonVideoCallFunc", response);
  return {
    type: actions.VIDEO_BOX_OPEN,
    response: response,
  };
};

const setCloseVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_CLOSE,
    response: response,
  };
};

const setMinimizeVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_MINIMIZE,
    response: response,
  };
};

const setMaximizeVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_MAXIMIZE,
    response: response,
  };
};

const setNormalVideoCallBox = (response) => {
  return {
    type: actions.VIDEO_BOX_NORMAL,
    response: response,
  };
};

//FOR OPEN VIDEO_INCOMING
const setVideoIncomingCall = (response) => {
  return {
    type: actions.INCOMING_CALL_OPEN,
    response: response,
  };
};

//FOR VIDEO GROUP PANEL

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
