import * as actions from "../action_types";

const initialState = {
  ResponseMessage: "",
  Loading: false,
  isLoggedIn: false,
  ShowNotification: false,
  Token: "",
  Refresh: "",
  SessionExpireResponseMessage: "",
  UserDetails: [],
  AllUserChatsData: [],
  UserOTOMessagesData: [],
  UserOTOUndeliveredMessagesData: [],
  GroupMessagesData: [],
  BroadcastMessagesData: [],
  ArchivedDataByUserIDData: [],
  FlagMessagesData: [],
  FollowMessagesData: [],
  RecentTagsData: [],
  TagsMessagesData: [],
  MessageSentReceiveTimeData: [],
  RecentFlagCountData: [],
  RecentFollowDataCountByUserID: [],
};

const talkReducer = (state = initialState, action) => {
  console.log("talkReducer", state);
  switch (action.type) {
    case actions.REFRESH_TOKEN_TALK_SUCCESS:
      localStorage.setItem("token", JSON.stringify(action.response.token));
      localStorage.setItem(
        "RefreshToken",
        JSON.stringify(action.response.refreshToken)
      );
      return {
        ...state,
        ResponseMessage: action.message,
        Token: action.response.token,
        Refresh: action.response.refreshToken,
      };

    case actions.REFRESH_TOKEN_TALK_FAIL:
      console.log("RefreshToken", action);
      return {
        ...state,
        UserDetails: action.response,
        isLoggedIn: false,
        Loading: false,
        SessionExpireResponseMessage: action.message,
        Token: "",
        Refresh: "",
      };

    case actions.GET_USERCHATS_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }
    case actions.GET_USERCHATS_SUCCESS: {
      return {
        ...state,
        AllUserChatsData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_USERCHATS_FAIL: {
      return {
        ...state,
        AllUserChatsData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_OTOUSERMESSAGES_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }
    case actions.GET_OTOUSERMESSAGES_SUCCESS: {
      return {
        ...state,
        UserOTOMessagesData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_OTOUSERMESSAGES_FAIL: {
      return {
        ...state,
        UserOTOMessagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_OTOUSERUNDELIVEREDMESSAGES_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_OTOUSERUNDELIVEREDMESSAGES_SUCCESS: {
      return {
        ...state,
        UserOTOUndeliveredMessagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_OTOUSERUNDELIVEREDMESSAGES_FAIL: {
      return {
        ...state,
        UserOTOUndeliveredMessagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_GROUPMESSAGES_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_GROUPMESSAGES_SUCCESS: {
      return {
        ...state,
        GroupMessagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_GROUPMESSAGES_FAIL: {
      return {
        ...state,
        GroupMessagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_BROADCASTMESSAGES_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_BROADCASTMESSAGES_SUCCESS: {
      return {
        ...state,
        BroadcastMessagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_BROADCASTMESSAGES_FAIL: {
      return {
        ...state,
        BroadcastMessagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ARCHIVEDDATABYUSERID_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_ARCHIVEDDATABYUSERID_SUCCESS: {
      return {
        ...state,
        ArchivedDataByUserIDData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ARCHIVEDDATABYUSERID_FAIL: {
      return {
        ...state,
        ArchivedDataByUserIDData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_FLAGMESSAGES_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_FLAGMESSAGES_SUCCESS: {
      return {
        ...state,
        FlagMessagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_FLAGMESSAGES_FAIL: {
      return {
        ...state,
        FlagMessagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_FOLLOWMESSAGES_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_FOLLOWMESSAGES_SUCCESS: {
      return {
        ...state,
        FollowMessagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_FOLLOWMESSAGES_FAIL: {
      return {
        ...state,
        FollowMessagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_RECENTTAGS_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_RECENTTAGS_SUCCESS: {
      return {
        ...state,
        RecentTagsData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_RECENTTAGS_FAIL: {
      return {
        ...state,
        RecentTagsData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_TAGSMESSAGES_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_TAGSMESSAGES_SUCCESS: {
      return {
        ...state,
        TagsMessagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_TAGSMESSAGES_FAIL: {
      return {
        ...state,
        TagsMessagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MESSAGESENTRECEIVETIME_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_MESSAGESENTRECEIVETIME_SUCCESS: {
      return {
        ...state,
        MessageSentReceiveTimeData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MESSAGESENTRECEIVETIME_FAIL: {
      return {
        ...state,
        MessageSentReceiveTimeData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_RECENTFLAGCOUNT_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_RECENTFLAGCOUNT_SUCCESS: {
      return {
        ...state,
        RecentFlagCountData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_RECENTFLAGCOUNT_FAIL: {
      return {
        ...state,
        RecentFlagCountData: [],
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};
export default talkReducer;
