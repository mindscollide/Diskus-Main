import * as actions from "../action_types";

const recentChatFlag = (response) => {
  return {
    type: actions.RECENT_CHAT_FLAG,
    response: response,
  };
};

const privateChatFlag = (response) => {
  return {
    type: actions.PRIVATE_CHAT_FLAG,
    response: response,
  };
};

const privateGroupChatFlag = (response) => {
  return {
    type: actions.PRIVATE_GROUPS_CHAT_FLAG,
    response: response,
  };
};

const starredMessageFlag = (response) => {
  return {
    type: actions.STARRED_MESSAGE_FLAG,
    response: response,
  };
};

const blockedUsersFlag = (response) => {
  return {
    type: actions.BLOCKED_USERS_FLAG,
    response: response,
  };
};

const shoutallChatFlag = (response) => {
  return {
    type: actions.SHOUTALL_CHAT_FLAG,
    response: response,
  };
};

const deleteChatFlag = (response) => {
  return {
    type: actions.DELETE_CHAT_FLAG,
    response: response,
  };
};

const headerShowHideStatus = (response) => {
  return {
    type: actions.HEADER_SHOW_HIDE_STATUS,
    response: response,
  };
};

const footerShowHideStatus = (response) => {
  return {
    type: actions.FOOTER_SHOW_HIDE_STATUS,
    response: response,
  };
};

const footerActionStatus = (response) => {
  return {
    type: actions.FOOTER_ACTION_STATUS,
    response: response,
  };
};

const securityEncryptionStatus = (response) => {
  return {
    type: actions.SECURITY_ENCRYPTION_STATUS,
    response: response,
  };
};

const addNewChatScreen = (response) => {
  return {
    type: actions.ADD_NEW_CHAT_SCREEN,
    response: response,
  };
};

const createGroupScreen = (response) => {
  return {
    type: actions.CREATE_GROUP_SCREEN,
    response: response,
  };
};

const createShoutAllScreen = (response) => {
  return {
    type: actions.CREATE_SHOUTALL_SCREEN,
    response: response,
  };
};

const chatBoxActiveFlag = (response) => {
  return {
    type: actions.CHATBOX_ACTIVE_FLAG,
    response: response,
  };
};

const chatMessageSearchFlag = (response) => {
  return {
    type: actions.CHAT_MESSAGE_SEARCH,
    response: response,
  };
};

const saveFlag = (response) => {
  return {
    type: actions.SAVE_MODAL_FLAG,
    response: response,
  };
};

const printFlag = (response) => {
  return {
    type: actions.PRINT_MODAL_FLAG,
    response: response,
  };
};

const emailFlag = (response) => {
  return {
    type: actions.EMAIL_MODAL_FLAG,
    response: response,
  };
};

const fileUploadFlag = (response, uploadType) => {
  return {
    type: actions.FILE_UPLOAD_FLAG,
    response: response,
    uploadType: uploadType,
  };
};

const globalChatsSearchFlag = (response) => {
  return {
    type: actions.CHATS_SEARCH_FLAG,
    response: response,
  };
};

const resetCloseChatFlags = () => {
  return {
    type: actions.RESET_CLOSE_CHAT_FLAGS,
  };
};

const activeChatBoxGS = (response) => {
  return {
    type: actions.ACTIVE_CHAT_BOX_GS,
    response: response,
  };
};

const retryFlagState = (response) => {
  return {
    type: actions.RETRY_FLAG_STATE,
    response: response,
  };
};

export {
  //Chat Filter Global Actions
  recentChatFlag,
  privateChatFlag,
  privateGroupChatFlag,
  starredMessageFlag,
  blockedUsersFlag,
  shoutallChatFlag,
  deleteChatFlag,
  //Header Footer Actions
  headerShowHideStatus,
  footerShowHideStatus,
  footerActionStatus,
  //Encryption Status
  securityEncryptionStatus,
  //Footer Feature Actions
  addNewChatScreen,
  createGroupScreen,
  createShoutAllScreen,
  //ChatBox Active Inactive Action
  chatBoxActiveFlag,
  //Chat messages search
  chatMessageSearchFlag,
  //Modal Flags Chat Menus
  saveFlag,
  printFlag,
  emailFlag,
  fileUploadFlag,
  // Global Chats Search
  globalChatsSearchFlag,
  resetCloseChatFlags,
  activeChatBoxGS,
  retryFlagState,
};
