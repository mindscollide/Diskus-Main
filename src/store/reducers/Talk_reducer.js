import * as actions from "../action_types";

const initialState = {
  Loading: false,
  isLoggedIn: false,
  ShowNotification: false,
  Token: "",
  Refresh: "",
  SessionExpireResponseMessage: "",

  UserDetails: [],

  AllUserChats: {
    ResponseMessage: "",
    AllUserChatsData: [],
  },

  UserOTOMessages: {
    ResponseMessage: "",
    UserOTOMessagesData: [],
  },

  UserOTOUndeliveredMessages: {
    ResponseMessage: "",
    UserOTOUndeliveredMessagesData: [],
  },

  GroupMessages: {
    ResponseMessage: "",
    GroupMessagesData: [],
  },

  BroadcastMessages: {
    ResponseMessage: "",
    BroadcastMessagesData: [],
  },

  ArchivedDataByUserID: {
    ResponseMessage: "",
    ArchivedDataByUserIDData: [],
  },

  FlagMessages: {
    ResponseMessage: "",
    FlagMessagesData: [],
  },

  FollowMessages: {
    ResponseMessage: "",
    FollowMessagesData: [],
  },

  RecentTags: {
    ResponseMessage: "",
    RecentTagsData: [],
  },

  TagsMessages: {
    ResponseMessage: "",
    TagsMessagesData: [],
  },

  MessageSentReceiveTime: {
    ResponseMessage: "",
    MessageSentReceiveTimeData: [],
  },

  RecentFlagCount: {
    ResponseMessage: "",
    RecentFlagCountData: [],
  },

  RecentFollowDataCountByUserID: {
    ResponseMessage: "",
    RecentFollowDataCountByUserIDData: [],
  },

  AllRecentTagsCount: {
    ResponseMessage: "",
    AllRecentTagsCountData: [],
  },

  RecentDataArchiveCountByUserID: {
    ResponseMessage: "",
    RecentDataArchiveCountByUserIDData: [],
  },

  BlockedUsersCount: {
    ResponseMessage: "",
    BlockedUsersCountData: [],
  },

  BlockedUsers: {
    ResponseMessage: "",
    BlockedUsersData: [],
  },

  AllUsers: {
    ResponseMessage: "",
    AllUsersData: [],
  },

  AllUsersGroupsRoomsList: {
    ResponseMessage: "",
    AllUsersGroupsRoomsListData: [],
  },

  ActiveUsersByGroupID: {
    ResponseMessage: "",
    ActiveUsersByGroupIDData: [],
  },

  ActiveUsersByRoomID: {
    ResponseMessage: "",
    ActiveUsersByRoomIDData: [],
  },

  ActiveUsersByBroadcastID: {
    ResponseMessage: "",
    ActiveUsersByBroadcastIDData: [],
  },

  MessageSendOTO: {
    ResponseMessage: "",
  },

  MessageSendPrivateGroup: {
    ResponseMessage: "",
  },

  BlockUnblockUser: {
    ResponseMessage: "",
  },

  DeleteSingleMessage: {
    DeleteMessageResponse: [],
    DeleteMessageResponseMessage: "",
  },

  MessageSendBroadcast: {
    ResponseMessage: "",
  },

  allTalkSocketsData: {
    insertOTOMessageData: [],
  },
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
        AllUserChats: {
          AllUserChatsData: action.response,
          ResponseMessage: action.message,
        },
      };
    }
    case actions.GET_USERCHATS_FAIL: {
      return {
        ...state,
        AllUserChats: {
          AllUserChatsData: [],
          ResponseMessage: action.message,
        },
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
        UserOTOMessages: {
          ResponseMessage: action.message,
          UserOTOMessagesData: action.response,
        },
      };
    }
    case actions.GET_OTOUSERMESSAGES_FAIL: {
      return {
        ...state,
        UserOTOMessages: {
          ResponseMessage: action.message,
          UserOTOMessagesData: [],
        },
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
        UserOTOUndeliveredMessages: {
          ResponseMessage: action.message,
          UserOTOUndeliveredMessagesData: action.response,
        },
      };
    }

    case actions.GET_OTOUSERUNDELIVEREDMESSAGES_FAIL: {
      return {
        ...state,
        UserOTOUndeliveredMessages: {
          ResponseMessage: action.message,
          UserOTOUndeliveredMessagesData: [],
        },
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
        GroupMessages: {
          ResponseMessage: action.message,
          GroupMessagesData: action.response,
        },
      };
    }

    case actions.GET_GROUPMESSAGES_FAIL: {
      return {
        ...state,
        GroupMessages: {
          ResponseMessage: action.message,
          GroupMessagesData: [],
        },
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
        BroadcastMessages: {
          ResponseMessage: action.message,
          BroadcastMessagesData: action.response,
        },
      };
    }

    case actions.GET_BROADCASTMESSAGES_FAIL: {
      return {
        ...state,
        BroadcastMessages: {
          ResponseMessage: action.message,
          BroadcastMessagesData: [],
        },
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
        ArchivedDataByUserID: {
          ResponseMessage: action.message,
          ArchivedDataByUserIDData: action.response,
        },
      };
    }

    case actions.GET_ARCHIVEDDATABYUSERID_FAIL: {
      return {
        ...state,
        ArchivedDataByUserID: {
          ResponseMessage: action.message,
          ArchivedDataByUserIDData: [],
        },
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
        FlagMessages: {
          ResponseMessage: action.message,
          FlagMessagesData: action.response,
        },
      };
    }

    case actions.GET_FLAGMESSAGES_FAIL: {
      return {
        ...state,
        FlagMessages: {
          ResponseMessage: action.message,
          FlagMessagesData: [],
        },
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
        FollowMessages: {
          ResponseMessage: action.message,
          FollowMessagesData: action.response,
        },
      };
    }

    case actions.GET_FOLLOWMESSAGES_FAIL: {
      return {
        ...state,
        FollowMessages: {
          ResponseMessage: action.message,
          FollowMessagesData: [],
        },
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
        RecentTags: {
          ResponseMessage: action.message,
          RecentTagsData: action.response,
        },
      };
    }

    case actions.GET_RECENTTAGS_FAIL: {
      return {
        ...state,
        RecentTags: {
          ResponseMessage: action.message,
          RecentTagsData: [],
        },
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
        TagsMessages: {
          ResponseMessage: action.message,
          TagsMessagesData: action.response,
        },
      };
    }

    case actions.GET_TAGSMESSAGES_FAIL: {
      return {
        ...state,
        TagsMessages: {
          ResponseMessage: action.message,
          TagsMessagesData: [],
        },
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
        MessageSentReceiveTime: {
          ResponseMessage: action.message,
          MessageSentReceiveTimeData: action.response,
        },
      };
    }

    case actions.GET_MESSAGESENTRECEIVETIME_FAIL: {
      return {
        ...state,
        MessageSentReceiveTime: {
          ResponseMessage: action.message,
          MessageSentReceiveTimeData: [],
        },
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
        RecentFlagCount: {
          ResponseMessage: action.response,
          RecentFlagCountData: action.message,
        },
      };
    }

    case actions.GET_RECENTFLAGCOUNT_FAIL: {
      return {
        ...state,
        RecentFlagCount: {
          ResponseMessage: action.message,
          RecentFlagCountData: [],
        },
      };
    }

    case actions.GET_RECENTFOLLOWDATACOUNT_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_RECENTFOLLOWDATACOUNT_SUCCESS: {
      return {
        ...state,
        RecentFollowDataCountByUserID: {
          ResponseMessage: action.message,
          RecentFollowDataCountByUserIDData: action.response,
        },
      };
    }

    case actions.GET_RECENTFOLLOWDATACOUNT_FAIL: {
      return {
        ...state,
        RecentFollowDataCountByUserID: {
          ResponseMessage: action.message,
          RecentFollowDataCountByUserIDData: [],
        },
      };
    }

    case actions.GET_ALLRECENTTAGSCOUNT_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_ALLRECENTTAGSCOUNT_SUCCESS: {
      return {
        ...state,
        AllRecentTagsCount: {
          ResponseMessage: action.message,
          AllRecentTagsCountData: action.response,
        },
      };
    }

    case actions.GET_ALLRECENTTAGSCOUNT_FAIL: {
      return {
        ...state,
        AllRecentTagsCount: {
          ResponseMessage: action.message,
          AllRecentTagsCountData: [],
        },
      };
    }

    case actions.GET_RECENTDATAARCHIVECOUNT_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_RECENTDATAARCHIVECOUNT_SUCCESS: {
      return {
        ...state,
        RecentDataArchiveCountByUserID: {
          ResponseMessage: action.message,
          RecentDataArchiveCountByUserIDData: action.response,
        },
      };
    }

    case actions.GET_RECENTDATAARCHIVECOUNT_FAIL: {
      return {
        ...state,
        RecentDataArchiveCountByUserID: {
          ResponseMessage: action.message,
          RecentDataArchiveCountByUserIDData: [],
        },
      };
    }

    case actions.GET_BLOCKEDUSERSCOUNT_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_BLOCKEDUSERSCOUNT_SUCCESS: {
      return {
        ...state,
        BlockedUsersCount: {
          ResponseMessage: action.message,
          BlockedUsersCountData: action.response,
        },
      };
    }

    case actions.GET_BLOCKEDUSERSCOUNT_FAIL: {
      return {
        ...state,
        BlockedUsersCount: {
          ResponseMessage: action.message,
          BlockedUsersCountData: [],
        },
      };
    }

    case actions.GET_BLOCKEDUSERS_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_BLOCKEDUSERS_SUCCESS: {
      console.log("GET_BLOCKEDUSERS", action);
      return {
        ...state,
        BlockedUsers: {
          ResponseMessage: action.message,
          BlockedUsersData: action.response,
        },
      };
    }

    case actions.GET_BLOCKEDUSERS_FAIL: {
      console.log("GET_BLOCKEDUSERS", action);
      return {
        ...state,
        BlockedUsers: {
          ResponseMessage: action.message,
          BlockedUsersData: [],
        },
      };
    }

    case actions.GET_ALLUSERS_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_ALLUSERS_SUCCESS: {
      return {
        ...state,
        AllUsers: {
          ResponseMessage: action.message,
          AllUsersData: action.response,
        },
      };
    }

    case actions.GET_ALLUSERS_FAIL: {
      return {
        ...state,
        AllUsers: {
          ResponseMessage: action.message,
          AllUsersData: [],
        },
      };
    }

    case actions.GET_ALLUSERSGROUPSROOMSLIST_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_ALLUSERSGROUPSROOMSLIST_SUCCESS: {
      return {
        ...state,
        AllUsersGroupsRoomsList: {
          ResponseMessage: action.message,
          AllUsersGroupsRoomsListData: action.response,
        },
      };
    }

    case actions.GET_ALLUSERSGROUPSROOMSLIST_FAIL: {
      return {
        ...state,
        AllUsersGroupsRoomsList: {
          ResponseMessage: action.message,
          AllUsersGroupsRoomsListData: [],
        },
      };
    }

    case actions.GET_ACTIVEUSERSBYGROUPID_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_ACTIVEUSERSBYGROUPID_SUCCESS: {
      return {
        ...state,
        ActiveUsersByGroupID: {
          ResponseMessage: action.response,
          ActiveUsersByGroupIDData: action.message,
        },
      };
    }

    case actions.GET_ACTIVEUSERSBYGROUPID_FAIL: {
      return {
        ...state,
        ActiveUsersByGroupID: {
          ResponseMessage: action.message,
          ActiveUsersByGroupIDData: [],
        },
      };
    }

    case actions.GET_ACTIVEUSERSBYROOMID_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_ACTIVEUSERSBYROOMID_SUCCESS: {
      return {
        ...state,
        ActiveUsersByRoomID: {
          ResponseMessage: action.message,
          ActiveUsersByRoomIDData: action.response,
        },
      };
    }

    case actions.GET_ACTIVEUSERSBYROOMID_FAIL: {
      return {
        ...state,
        ActiveUsersByRoomID: {
          ResponseMessage: action.message,
          ActiveUsersByRoomIDData: [],
        },
      };
    }

    case actions.GET_ACTIVEUSERSBYBROADCASTID_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }

    case actions.GET_ACTIVEUSERSBYBROADCASTID_SUCCESS: {
      return {
        ...state,
        ActiveUsersByBroadcastID: {
          ResponseMessage: action.message,
          ActiveUsersByBroadcastIDData: action.response,
        },
      };
    }

    case actions.GET_ACTIVEUSERSBYBROADCASTID_FAIL: {
      return {
        ...state,
        ActiveUsersByBroadcastID: {
          ResponseMessage: action.message,
          ActiveUsersByBroadcastIDData: [],
        },
      };
    }

    case actions.OTO_MESSAGESEND_INIT:
      return {
        ...state,
        MessageSendOTO: {
          ResponseMessage: "",
        },
      };

    case actions.OTO_MESSAGESEND_NOTIFICATION:
      return {
        ...state,
        MessageSendOTO: {
          ResponseMessage: action.message,
        },
      };

    case actions.PRIVATEGROUP_MESSAGESEND_INIT:
      return {
        ...state,
        MessageSendPrivateGroup: {
          ResponseMessage: "",
        },
      };

    case actions.PRIVATEGROUP_MESSAGESEND_NOTIFICATION:
      return {
        ...state,
        MessageSendPrivateGroup: {
          ResponseMessage: action.message,
        },
      };

    case actions.BLOCK_UNBLOCK_USER_INIT:
      return {
        ...state,
        BlockUnblockUser: {
          ResponseMessage: "",
        },
      };

    case actions.BLOCK_UNBLOCK_USER_NOTIFICATION:
      return {
        ...state,
        BlockUnblockUser: {
          ResponseMessage: action.message,
        },
      };

    case actions.DELETE_SINGLEMESSAGE_INIT: {
      return {
        ...state,
        // Loading: true,
      };
    }
    case actions.DELETE_SINGLEMESSAGE_SUCCESS: {
      return {
        ...state,
        DeleteSingleMessage: {
          DeleteMessageResponse: action.response,
          DeleteMessageResponseMessage: action.message,
        },
      };
    }
    case actions.DELETE_SINGLEMESSAGE_FAIL: {
      return {
        ...state,
        DeleteSingleMessage: {
          DeleteMessageResponse: [],
          DeleteMessageResponseMessage: action.message,
        },
      };
    }

    case actions.BROADCAST_MESSAGESEND_INIT:
      return {
        ...state,
        MessageSendBroadcast: {
          ResponseMessage: "",
        },
      };

    case actions.BROADCAST_MESSAGESEND_NOTIFICATION:
      return {
        ...state,
        MessageSendBroadcast: {
          ResponseMessage: action.message,
        },
      };

    case actions.ALL_TALK_SOCKET:
      console.log("allTalkSocket", action.response);
      return {
        ...state,
        allTalkSocketsData: {
          insertOTOMessageData: action.response,
        },
      };

    default:
      return { ...state };
  }
};
export default talkReducer;
