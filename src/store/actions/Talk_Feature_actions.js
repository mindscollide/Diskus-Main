/**
 * @file Talk_Feature_actions.js
 * @description Redux action creators for Talk (chat) UI feature flags and panel visibility.
 * Handles chat filter toggles, header/footer visibility, footer feature screens,
 * modal flags, encryption status, and global chat search state.
 * Dispatches: RECENT_CHAT_FLAG / PRIVATE_CHAT_FLAG / PRIVATE_GROUPS_CHAT_FLAG /
 * STARRED_MESSAGE_FLAG / BLOCKED_USERS_FLAG / SHOUTALL_CHAT_FLAG / DELETE_CHAT_FLAG /
 * HEADER_SHOW_HIDE_STATUS / FOOTER_SHOW_HIDE_STATUS / FOOTER_ACTION_STATUS /
 * SECURITY_ENCRYPTION_STATUS / ADD_NEW_CHAT_SCREEN / CREATE_GROUP_SCREEN /
 * CREATE_SHOUTALL_SCREEN / CHATBOX_ACTIVE_FLAG / CHAT_MESSAGE_SEARCH /
 * SAVE_MODAL_FLAG / PRINT_MODAL_FLAG / EMAIL_MODAL_FLAG / FILE_UPLOAD_FLAG /
 * CHATS_SEARCH_FLAG / RESET_CLOSE_CHAT_FLAGS / ACTIVE_CHAT_BOX_GS / RETRY_FLAG_STATE action types.
 */
import * as actions from "../action_types";

/**
 * Sets the recent-chat filter flag.
 * @param {*} response - Flag value.
 * @returns {{ type: string, response: * }}
 */
const recentChatFlag = (response) => {
  return {
    type: actions.RECENT_CHAT_FLAG,
    response: response,
  };
};

/**
 * Sets the private-chat filter flag.
 * @param {*} response - Flag value.
 * @returns {{ type: string, response: * }}
 */
const privateChatFlag = (response) => {
  return {
    type: actions.PRIVATE_CHAT_FLAG,
    response: response,
  };
};

/**
 * Sets the private-groups chat filter flag.
 * @param {*} response - Flag value.
 * @returns {{ type: string, response: * }}
 */
const privateGroupChatFlag = (response) => {
  return {
    type: actions.PRIVATE_GROUPS_CHAT_FLAG,
    response: response,
  };
};

/**
 * Sets the starred-message filter flag.
 * @param {*} response - Flag value.
 * @returns {{ type: string, response: * }}
 */
const starredMessageFlag = (response) => {
  return {
    type: actions.STARRED_MESSAGE_FLAG,
    response: response,
  };
};

/**
 * Sets the blocked-users filter flag.
 * @param {*} response - Flag value.
 * @returns {{ type: string, response: * }}
 */
const blockedUsersFlag = (response) => {
  return {
    type: actions.BLOCKED_USERS_FLAG,
    response: response,
  };
};

/**
 * Sets the shout-all chat filter flag.
 * @param {*} response - Flag value.
 * @returns {{ type: string, response: * }}
 */
const shoutallChatFlag = (response) => {
  return {
    type: actions.SHOUTALL_CHAT_FLAG,
    response: response,
  };
};

/**
 * Sets the delete-chat filter flag.
 * @param {*} response - Flag value.
 * @returns {{ type: string, response: * }}
 */
const deleteChatFlag = (response) => {
  return {
    type: actions.DELETE_CHAT_FLAG,
    response: response,
  };
};

/**
 * Sets the header show/hide status.
 * @param {*} response - Visibility state.
 * @returns {{ type: string, response: * }}
 */
const headerShowHideStatus = (response) => {
  return {
    type: actions.HEADER_SHOW_HIDE_STATUS,
    response: response,
  };
};

/**
 * Sets the footer show/hide status.
 * @param {*} response - Visibility state.
 * @returns {{ type: string, response: * }}
 */
const footerShowHideStatus = (response) => {
  return {
    type: actions.FOOTER_SHOW_HIDE_STATUS,
    response: response,
  };
};

/**
 * Sets the footer action/active status.
 * @param {*} response - Action state.
 * @returns {{ type: string, response: * }}
 */
const footerActionStatus = (response) => {
  return {
    type: actions.FOOTER_ACTION_STATUS,
    response: response,
  };
};

/**
 * Sets the security encryption status flag.
 * @param {*} response - Encryption state.
 * @returns {{ type: string, response: * }}
 */
const securityEncryptionStatus = (response) => {
  return {
    type: actions.SECURITY_ENCRYPTION_STATUS,
    response: response,
  };
};

/**
 * Toggles the add-new-chat screen.
 * @param {*} response - Screen state.
 * @returns {{ type: string, response: * }}
 */
const addNewChatScreen = (response) => {
  return {
    type: actions.ADD_NEW_CHAT_SCREEN,
    response: response,
  };
};

/**
 * Toggles the create-group screen.
 * @param {*} response - Screen state.
 * @returns {{ type: string, response: * }}
 */
const createGroupScreen = (response) => {
  return {
    type: actions.CREATE_GROUP_SCREEN,
    response: response,
  };
};

/**
 * Toggles the create-shout-all screen.
 * @param {*} response - Screen state.
 * @returns {{ type: string, response: * }}
 */
const createShoutAllScreen = (response) => {
  return {
    type: actions.CREATE_SHOUTALL_SCREEN,
    response: response,
  };
};

/**
 * Sets the chatbox active/inactive flag.
 * @param {*} response - Active state.
 * @returns {{ type: string, response: * }}
 */
const chatBoxActiveFlag = (response) => {
  return {
    type: actions.CHATBOX_ACTIVE_FLAG,
    response: response,
  };
};

/**
 * Sets the chat-message search flag.
 * @param {*} response - Search state.
 * @returns {{ type: string, response: * }}
 */
const chatMessageSearchFlag = (response) => {
  return {
    type: actions.CHAT_MESSAGE_SEARCH,
    response: response,
  };
};

/**
 * Sets the save-modal flag.
 * @param {*} response - Modal visibility.
 * @returns {{ type: string, response: * }}
 */
const saveFlag = (response) => {
  return {
    type: actions.SAVE_MODAL_FLAG,
    response: response,
  };
};

/**
 * Sets the print-modal flag.
 * @param {*} response - Modal visibility.
 * @returns {{ type: string, response: * }}
 */
const printFlag = (response) => {
  return {
    type: actions.PRINT_MODAL_FLAG,
    response: response,
  };
};

/**
 * Sets the email-modal flag.
 * @param {*} response - Modal visibility.
 * @returns {{ type: string, response: * }}
 */
const emailFlag = (response) => {
  return {
    type: actions.EMAIL_MODAL_FLAG,
    response: response,
  };
};

/**
 * Sets the file-upload flag along with the upload type.
 * @param {*} response - Flag state.
 * @param {string} uploadType - Type of upload (e.g. image, document).
 * @returns {{ type: string, response: *, uploadType: string }}
 */
const fileUploadFlag = (response, uploadType) => {
  return {
    type: actions.FILE_UPLOAD_FLAG,
    response: response,
    uploadType: uploadType,
  };
};

/**
 * Sets the global chats search flag.
 * @param {*} response - Search state.
 * @returns {{ type: string, response: * }}
 */
const globalChatsSearchFlag = (response) => {
  return {
    type: actions.CHATS_SEARCH_FLAG,
    response: response,
  };
};

/**
 * Resets all close-chat flags to their default state.
 * @returns {{ type: string }}
 */
const resetCloseChatFlags = () => {
  return {
    type: actions.RESET_CLOSE_CHAT_FLAGS,
  };
};

/**
 * Sets the active chatbox state for group/shout-all screens.
 * @param {*} response - Active state.
 * @returns {{ type: string, response: * }}
 */
const activeChatBoxGS = (response) => {
  return {
    type: actions.ACTIVE_CHAT_BOX_GS,
    response: response,
  };
};

/**
 * Sets the retry flag state for failed message sends.
 * @param {*} response - Retry state.
 * @returns {{ type: string, response: * }}
 */
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
