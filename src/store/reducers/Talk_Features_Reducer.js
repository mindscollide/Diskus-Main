import * as actions from "../action_types";

const initialState = {
  RecentChatsFlag: false,
  PrivateChatsFlag: false,
  PrivateGroupChatsFlag: false,
  StarredMessageFlag: false,
  BlockedUsersFlag: false,
  ShoutAllMessageFlag: false,
  DeleteChatFlag: false,
  HeaderShowStatus: false,
  FooterShowStatus: false,
  FooterActionStatus: false,
  SecurityEncryption: false,
  AddNewChatScreen: false,
  CreateGroupScreen: false,
  CreateShoutAllScreen: false,
  ChatBoxActiveFlag: false,
  ChatMessagesSearchFlag: false,
  SaveModalFlag: false,
  PrintModalFlag: false,
  EmailModalFlag: false,
  FileUploadFlag: false,
  FileUploadType: "",
  GlobalChatsSearchFlag: false,
  ActiveChatBoxGS: false,
};

const talkFeatureReducer = (state = initialState, action) => {
  switch (action.type) {
    //CHAT FILTER GLOBAL STATES
    case actions.RECENT_CHAT_FLAG: {
      return {
        ...state,
        RecentChatsFlag: action.response,
      };
    }

    case actions.PRIVATE_CHAT_FLAG: {
      return {
        ...state,
        PrivateChatsFlag: action.response,
      };
    }

    case actions.PRIVATE_GROUPS_CHAT_FLAG: {
      return {
        ...state,
        PrivateGroupChatsFlag: action.response,
      };
    }

    case actions.STARRED_MESSAGE_FLAG: {
      return {
        ...state,
        StarredMessageFlag: action.response,
      };
    }

    case actions.BLOCKED_USERS_FLAG: {
      return {
        ...state,
        BlockedUsersFlag: action.response,
      };
    }

    case actions.SHOUTALL_CHAT_FLAG: {
      return {
        ...state,
        ShoutAllMessageFlag: action.response,
      };
    }

    case actions.DELETE_CHAT_FLAG: {
      return {
        ...state,
        DeleteChatFlag: action.response,
      };
    }

    case actions.HEADER_SHOW_HIDE_STATUS: {
      return {
        ...state,
        HeaderShowStatus: action.response,
      };
    }

    case actions.FOOTER_SHOW_HIDE_STATUS: {
      return {
        ...state,
        FooterShowStatus: action.response,
      };
    }

    case actions.FOOTER_ACTION_STATUS: {
      return {
        ...state,
        FooterActionStatus: action.response,
      };
    }

    case actions.SECURITY_ENCRYPTION_STATUS: {
      return {
        ...state,
        SecurityEncryption: action.response,
      };
    }

    case actions.ADD_NEW_CHAT_SCREEN: {
      return {
        ...state,
        AddNewChatScreen: action.response,
      };
    }

    case actions.CREATE_GROUP_SCREEN: {
      return {
        ...state,
        CreateGroupScreen: action.response,
      };
    }

    case actions.CREATE_SHOUTALL_SCREEN: {
      return {
        ...state,
        CreateShoutAllScreen: action.response,
      };
    }

    case actions.CHATBOX_ACTIVE_FLAG: {
      return {
        ...state,
        ChatBoxActiveFlag: action.response,
      };
    }

    case actions.CHAT_MESSAGE_SEARCH: {
      return {
        ...state,
        ChatMessagesSearchFlag: action.response,
      };
    }

    case actions.SAVE_MODAL_FLAG: {
      return {
        ...state,
        SaveModalFlag: action.response,
      };
    }

    case actions.PRINT_MODAL_FLAG: {
      return {
        ...state,
        PrintModalFlag: action.response,
      };
    }

    case actions.EMAIL_MODAL_FLAG: {
      return {
        ...state,
        EmailModalFlag: action.response,
      };
    }

    case actions.FILE_UPLOAD_FLAG: {
      return {
        ...state,
        FileUploadFlag: action.response,
        FileUploadType: action.uploadType,
      };
    }

    case actions.CHATS_SEARCH_FLAG: {
      return {
        ...state,
        GlobalChatsSearchFlag: action.response,
      };
    }

    case actions.ACTIVE_CHAT_BOX_GS: {
      return {
        ...state,
        ActiveChatBoxGS: action.response,
      };
    }

    case actions.RESET_CLOSE_CHAT_FLAGS: {
      return {
        ...state,
        ChatBoxActiveFlag: false,
        ChatMessagesSearchFlag: false,
        SaveModalFlag: false,
        PrintModalFlag: false,
        EmailModalFlag: false,
        FileUploadFlag: false,
      };
    }

    default:
      return { ...state };
  }
};
export default talkFeatureReducer;
