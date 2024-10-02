import * as actions from "../action_types";

const videoChatPanel = (response) => {
  return {
    type: actions.VIDEO_CHAT_FLAG,
    response: response,
  };
};

const contactVideoFlag = (response) => {
  return {
    type: actions.CONTACT_VIDEO_FLAG,
    response: response,
  };
};

const recentVideoFlag = (response) => {
  return {
    type: actions.RECENT_VIDEO_FLAG,
    response: response,
  };
};

const videoChatSearchFlag = (response) => {
  return {
    type: actions.VIDEO_CHAT_SEARCH_FLAG,
    response: response,
  };
};

const videoCallOTOFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_OTO_FLAG,
    response: response,
  };
};

const endVideoCallFlag = (response) => {
  return {
    type: actions.END_VIDEO_CALL_FLAG,
    response: response,
  };
};

const videoCallGroupFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_GROUP_FLAG,
    response: response,
  };
};

const videoCallNormalScreenFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_NORMAL_SCREEN_FLAG,
    response: response,
  };
};

const videoCallMinimizeScreenFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MINIMIZE_SCREEN_FLAG,
    response: response,
  };
};

const videoCallMaximizeScreenFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MAXIMIZE_SCREEN_FLAG,
    response: response,
  };
};

const videoCallNormalHeaderFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_NORMAL_HEADER_FLAG,
    response: response,
  };
};

const videoCallMinimizeHeaderFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MINIMIZE_HEADER_FLAG,
    response: response,
  };
};

const videoCallMaximizeHeaderFlag = (response) => {
  return {
    type: actions.VIDEO_CALL_MAXIMIZE_HEADER_FLAG,
    response: response,
  };
};

const videoIncomingCallFlag = (response) => {
  return {
    type: actions.VIDEO_INCOMING_CALL_MAX,
    response: response,
  };
};

const chatEnableNormalFlag = (response) => {
  return {
    type: actions.CHAT_ENABLE_NORMAL_FLAG,
    response: response,
  };
};

const agendaEnableNormalFlag = (response) => {
  return {
    type: actions.AGENDA_ENABLE_NORMAL_FLAG,
    response: response,
  };
};

const minutesMeetingEnableNormalFlag = (response) => {
  return {
    type: actions.MINUTES_MEETING_ENABLE_NORMAL_FLAG,
    response: response,
  };
};

const videoOutgoingCallFlag = (response) => {
  return {
    type: actions.VIDEO_OUTGOING_CALL_MAX,
    response: response,
  };
};

const videoMultipleCallFlag = (response) => {
  return {
    type: actions.VIDEO_MULTIPLE_CALL_MAX,
    response: response,
  };
};

const videoChatOpenFlag = (response) => {
  return {
    type: actions.VIDEO_MAX_CHAT_OPEN,
    response: response,
  };
};

const videoAgendaOpenFlag = (response) => {
  return {
    type: actions.VIDEO_MAX_AGENDA_OPEN,
    response: response,
  };
};

const videoMinutesOpenFlag = (response) => {
  return {
    type: actions.VIDEO_MAX_MINUTES_OPEN,
    response: response,
  };
};

const minimizeVideoPanelFlag = (response) => {
  return {
    type: actions.MINIMIZE_VIDEO_PANEL,
    response: response,
  };
};

const normalizeVideoPanelFlag = (response) => {
  return {
    type: actions.NORMALIZE_VIDEO_PANEL,
    response: response,
  };
};

const maximizeVideoPanelFlag = (response) => {
  return {
    type: actions.MAXIMIZE_VIDEO_PANEL,
    response: response,
  };
};

const incomingVideoCallFlag = (response) => {
  return {
    type: actions.INCOMING_VIDEO_FLAG,
    response: response,
  };
};

const leaveCallModal = (response) => {
  return {
    type: actions.LEAVE_CALL_MODAL,
    response: response,
  };
};

const participantPopup = (response) => {
  return {
    type: actions.PARTICIPANT_POPUP_FLAG,
    response: response,
  };
};

const minimizeParticipantPopup = (response) => {
  return {
    type: actions.MINIMIZE_PARTICIPANT_POPUP_FLAG,
    response: response,
  };
};

const videoChatMessagesFlag = (response) => {
  return {
    type: actions.VIDEO_CHAT_MESSAGES_FLAG,
    response: response,
  };
};

//Aun Work

const guestJoinPopup = (response) => {
  return {
    type: actions.GUEST_JOIN_POPUP,
    response: response,
  };
};

// const videoMinimizePanel = (response) => {
//   return {
//     type: actions.MINIMIZE_VIDEO_PANEL,
//     response: response,
//   };
// };

export {
  videoChatPanel,
  contactVideoFlag,
  recentVideoFlag,
  videoChatSearchFlag,
  videoCallOTOFlag,
  endVideoCallFlag,
  videoCallGroupFlag,
  videoCallNormalScreenFlag,
  videoCallMinimizeScreenFlag,
  videoCallMaximizeScreenFlag,
  videoCallNormalHeaderFlag,
  videoCallMinimizeHeaderFlag,
  videoCallMaximizeHeaderFlag,
  videoIncomingCallFlag,
  chatEnableNormalFlag,
  agendaEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
  videoOutgoingCallFlag,
  videoMultipleCallFlag,
  videoChatOpenFlag,
  videoAgendaOpenFlag,
  videoMinutesOpenFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  incomingVideoCallFlag,
  leaveCallModal,
  participantPopup,
  minimizeParticipantPopup,
  videoChatMessagesFlag,
  guestJoinPopup,
};
