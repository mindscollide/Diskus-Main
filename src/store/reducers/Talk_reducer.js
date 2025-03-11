import * as actions from "../action_types";

const initialState = {
  isLoggedIn: false,
  ShowNotification: false,
  Token: "",
  Refresh: "",
  SessionExpireResponseMessage: "",
  OtoMessageFlag: false,

  AllMessagesData: [],
  Loading: false,

  ChatSpinner: false,

  activeChatIdData: {
    id: 0,
    messageType: "",
  },

  activeMessageIdData: {
    attachmentLocation: "",
    blockCount: 0,
    broadcastName: "",
    currDate: "",
    fileGeneratedName: "",
    fileName: "",
    frMessages: "",
    isFlag: 0,
    messageBody: "",
    messageCount: 0,
    messageID: 0,
    messageStatus: "",
    receivedDate: "",
    receiverID: 0,
    receiverName: "",
    seenDate: "",
    senderID: 0,
    senderName: "",
    sentDate: "",
    shoutAll: 0,
    uid: "",
  },

  UserDetails: [],

  AllUserChats: {
    ResponseMessage: "",
    AllUserChatsData: [],
    Loading: false,
  },

  UserOTOMessages: {
    ResponseMessage: "",
    UserOTOMessagesData: [],
    Loading: false,
  },

  UserOTOUndeliveredMessages: {
    ResponseMessage: "",
    UserOTOUndeliveredMessagesData: [],
  },

  GroupMessages: {
    ResponseMessage: "",
    GroupMessagesData: [],
    Loading: false,
  },

  BroadcastMessages: {
    ResponseMessage: "",
    BroadcastMessagesData: [],
    Loading: false,
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
    MessageSendResponseData: [],
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

  CreatePrivateGroup: {
    CreatePrivateGroupResponse: [],
    CreatePrivateGroupResponseMessage: "",
  },

  CreateShoutAllList: {
    CreateShoutAllListResponse: [],
    CreateShoutAllListResponseMessage: "",
  },

  UpdatePrivateGroup: {
    UpdatePrivateGroupResponse: [],
    UpdatePrivateGroupResponseMessage: "",
  },

  LeaveGroup: {
    LeaveGroupResponse: [],
    LeaveGroupResponseMessage: "",
  },

  DeleteShout: {
    DeleteShoutResponse: [],
    DeleteShoutResponseMessage: "",
  },

  GetPrivateGroupMembers: {
    GetPrivateGroupMembersResponse: [],
    GetPrivateGroupMembersResponseMessage: "",
  },

  InsertBulkMessageData: {
    InsertBulkMessageResponse: [],
    InsertBulkMessageResponseMessage: "",
  },

  MarkStarUnstarMessage: {
    MarkStarUnstarMessageResponseMessage: "",
  },

  talkSocketData: {
    socketInsertOTOMessageData: null,
    socketInsertGroupMessageData: null,
  },

  talkSocketDataUserBlockUnblock: {
    socketBlockUser: null,
    socketUnblockUser: null,
  },

  talkSocketDataStarUnstar: {
    socketStarMessage: {
      isFlag: 0,
      messageID: 0,
      messageType: "",
    },
    socketUnstarMessage: { isFlag: 0, messageID: 0, messageType: "" },
  },

  talkSocketGroupCreation: {
    groupCreatedData: [],
  },

  talkSocketGroupUpdation: {
    groupUpdatedData: null,
  },

  talkSocketUnreadMessageCount: {
    unreadMessageData: null,
  },

  // talkSocketInsertBroadcastMesage: {
  talkSocketInsertBroadcastMessage: {
    MessageSendBroadcastResponseData: [],
  },
  // }

  UpdateShoutAllData: {
    UpdateShoutAllResponse: [],
    UpdateShoutAllResponseMessage: "",
  },

  DownloadChatData: {
    DownloadChatResponse: [],
    DownloadChatResponseMessage: "",
  },

  EmailChatData: {
    EmailChatResponse: [],
    EmailChatResponseMessage: "",
  },

  UpdateMessageAcknowledgementData: {
    UpdateMessageAcknowledgementResponse: [],
    UpdateMessageAcknowledgementResponseMessage: "",
  },

  MessageStatusUpdateData: {
    MessageStatusUpdateResponse: [],
  },

  MqttMessageDeleteData: [],

  ActiveChatData: [],

  PushMessageData: [],

  PushChatData: [],

  FileUploadData: "",

  ActiveMessageData: [],

  MqttGroupLeftData: [],

  AllStarMessagesData: {
    AllStarMessagesResponse: [],
    AllStarMessagesResponseMessage: "",
    Loading: false,
  },

  MultipleMessagesDeletedData: {
    MultipleMessagesDeletedResponse: [],
    MultipleMessagesDeletedResponseMessage: "",
  },

  LastMessageDeletionObject: [],

  imageData: null,
};

const talkReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.REFRESH_TOKEN_TALK_SUCCESS: {
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
    }

    case actions.REFRESH_TOKEN_TALK_FAIL: {
      return {
        ...state,
        UserDetails: action.response,
        isLoggedIn: false,
        Loading: false,
        SessionExpireResponseMessage: action.message,
        Token: "",
        Refresh: "",
      };
    }

    case actions.GET_ACTIVECHATID: {
      return {
        ...state,
        activeChatIdData: {
          id: action.response.id,
          messageType: action.response.messageType,
        },
      };
    }

    case actions.GET_ACTIVEMESSAGEID: {
      return {
        ...state,
        activeMessageIdData: {
          attachmentLocation: action.response.attachmentLocation,
          blockCount: action.response.blockCount,
          broadcastName: action.response.broadcastName,
          currDate: action.response.currDate,
          fileGeneratedName: action.response.fileGeneratedName,
          fileName: action.response.fileName,
          frMessages: action.response.frMessages,
          isFlag: action.response.isFlag,
          messageBody: action.response.messageBody,
          messageCount: action.response.messageCount,
          messageID: action.response.messageID,
          messageStatus: action.response.messageStatus,
          receivedDate: action.response.receivedDate,
          receiverID: action.response.receiverID,
          receiverName: action.response.receiverName,
          seenDate: action.response.seenDate,
          senderID: action.response.senderID,
          senderName: action.response.senderName,
          sentDate: action.response.sentDate,
          shoutAll: action.response.shoutAll,
          uid: action.response.uid,
        },
      };
    }

    case actions.GET_USERCHATS_INIT: {
      return {
        ...state,
        AllUserChats: {
          Loading: true,
          AllUserChatsData: [],
          ResponseMessage: "",
        },
      };
    }

    case actions.GET_USERCHATS_SUCCESS: {
      return {
        ...state,
        AllUserChats: {
          Loading: false,
          AllUserChatsData: action.response,
          ResponseMessage: action.message,
        },
      };
    }

    case actions.GET_USERCHATS_FAIL: {
      return {
        ...state,
        AllUserChats: {
          Loading: false,
          AllUserChatsData: [],
          ResponseMessage: action.message,
        },
      };
    }

    case actions.GET_OTOUSERMESSAGES_INIT: {
      return {
        ...state,
        UserOTOMessages: {
          ResponseMessage: action.message,
          UserOTOMessagesData: action.response,
          Loading: true,
        },
        ChatSpinner: true,
      };
    }

    case actions.GET_OTOUSERMESSAGES_SUCCESS: {
      return {
        ...state,
        UserOTOMessages: {
          ResponseMessage: action.message,
          UserOTOMessagesData: action.response,
          Loading: false,
        },
        ChatSpinner: false,
      };
    }

    case actions.GET_OTOUSERMESSAGES_FAIL: {
      return {
        ...state,
        UserOTOMessages: {
          ResponseMessage: action.message,
          UserOTOMessagesData: [],
          Loading: false,
        },
        ChatSpinner: false,
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
        GroupMessages: {
          ResponseMessage: "",
          GroupMessagesData: [],
          Loading: true,
        },
        ChatSpinner: true,
      };
    }

    case actions.GET_GROUPMESSAGES_SUCCESS: {
      return {
        ...state,
        GroupMessages: {
          ResponseMessage: action.message,
          GroupMessagesData: action.response,
          Loading: false,
        },
        ChatSpinner: false,
      };
    }

    case actions.GET_GROUPMESSAGES_FAIL: {
      return {
        ...state,
        GroupMessages: {
          ResponseMessage: action.message,
          GroupMessagesData: [],
          Loading: false,
        },
        ChatSpinner: false,
      };
    }

    case actions.GET_BROADCASTMESSAGES_INIT: {
      return {
        ...state,
        BroadcastMessages: {
          ResponseMessage: "",
          BroadcastMessagesData: [],
          Loading: true,
        },
        ChatSpinner: true,
      };
    }

    case actions.GET_BROADCASTMESSAGES_SUCCESS: {
      return {
        ...state,
        BroadcastMessages: {
          ResponseMessage: action.message,
          BroadcastMessagesData: action.response,
          Loading: false,
        },
        ChatSpinner: false,
      };
    }

    case actions.GET_BROADCASTMESSAGES_FAIL: {
      return {
        ...state,
        BroadcastMessages: {
          ResponseMessage: action.message,
          BroadcastMessagesData: [],
          Loading: false,
        },
        ChatSpinner: false,
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
        BlockedUsers: {
          ResponseMessage: "",
          BlockedUsersData: [],
          Loading: true,
        },
      };
    }

    case actions.GET_BLOCKEDUSERS_SUCCESS: {
      return {
        ...state,
        BlockedUsers: {
          ResponseMessage: action.message,
          BlockedUsersData: action.response,
          Loading: false,
        },
      };
    }

    case actions.GET_BLOCKEDUSERS_FAIL: {
      return {
        ...state,
        BlockedUsers: {
          ResponseMessage: action.message,
          BlockedUsersData: [],
          Loading: false,
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
          MessageSendResponseData: [],
        },
      };

    case actions.OTO_RETRY_FLAG:
      return {
        ...state,
        OtoMessageFlag: action.response,
      };

    case actions.OTO_MESSAGESEND_SUCCESS:
      return {
        ...state,
        MessageSendOTO: {
          ResponseMessage: action.message,
          MessageSendResponseData: action.response,
        },
      };

    case actions.OTO_MESSAGESEND_FAIL:
      return {
        ...state,
        MessageSendOTO: {
          ResponseMessage: action.message,
          MessageSendResponseData: [],
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

    case actions.BROADCAST_MESSAGESEND_INIT: {
      return {
        ...state,
        MessageSendBroadcast: {
          ResponseMessage: "",
        },
      };
    }

    case actions.BROADCAST_MESSAGESEND_NOTIFICATION: {
      return {
        ...state,
        MessageSendBroadcast: {
          ResponseMessage: action.message,
        },
      };
    }

    case actions.CREATE_PRIVATEGROUP_INIT: {
      return {
        ...state,
        CreatePrivateGroup: {
          CreatePrivateGroupResponse: action.response,
          CreatePrivateGroupResponseMessage: action.message,
        },
      };
    }

    case actions.CREATE_PRIVATEGROUP_NOTIFICATION: {
      return {
        ...state,
        CreatePrivateGroup: {
          CreatePrivateGroupResponse: [],
          CreatePrivateGroupResponseMessage: action.message,
        },
      };
    }

    case actions.UPDATE_PRIVATEGROUP_INIT: {
      return {
        ...state,
        UpdatePrivateGroup: {
          UpdatePrivateGroupResponse: action.response,
          UpdatePrivateGroupResponseMessage: action.message,
        },
      };
    }

    case actions.UPDATE_PRIVATEGROUP_NOTIFICATION: {
      return {
        ...state,
        UpdatePrivateGroup: {
          UpdatePrivateGroupResponse: [],
          UpdatePrivateGroupResponseMessage: action.message,
        },
      };
    }

    case actions.LEAVE_GROUP_INIT: {
      return {
        ...state,
        LeaveGroup: {
          LeaveGroupResponse: action.response,
          LeaveGroupResponseMessage: action.message,
        },
      };
    }

    case actions.LEAVE_GROUP_NOTIFICATION: {
      return {
        ...state,
        LeaveGroup: {
          LeaveGroupResponse: [],
          LeaveGroupResponseMessage: action.message,
        },
      };
    }

    case actions.GET_PRIVATEGROUPMEMBERS_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }
    case actions.GET_PRIVATEGROUPMEMBERS_SUCCESS: {
      return {
        ...state,
        GetPrivateGroupMembers: {
          GetPrivateGroupMembersResponse: action.response,
          GetPrivateGroupMembersResponseMessage: action.message,
        },
      };
    }
    case actions.GET_PRIVATEGROUPMEMBERS_FAIL: {
      return {
        ...state,
        GetPrivateGroupMembers: {
          GetPrivateGroupMembersResponse: [],
          GetPrivateGroupMembersResponseMessage: action.message,
        },
      };
    }

    case actions.STAR_UNSTAR_MESSAGE_INIT: {
      return {
        ...state,
        MarkStarUnstarMessage: {
          MarkStarUnstarMessageResponseMessage: "",
        },
      };
    }

    case actions.STAR_UNSTAR_MESSAGE_NOTIFICATION: {
      return {
        ...state,

        MarkStarUnstarMessage: {
          MarkStarUnstarMessageResponseMessage: action.message,
        },
      };
    }

    case actions.MQTT_INSERT_OTO_MESSAGE: {
      return {
        ...state,
        talkSocketData: {
          socketInsertOTOMessageData: action.response,
          socketInsertGroupMessageData:
            initialState.talkSocketData.socketInsertGroupMessageData,
        },
      };
    }

    case actions.MQTT_INSERT_PRIVATEGROUP_MESSAGE: {
      // if (
      //   (parseInt(state.activeChatIdData.id) ===
      //     action.response.data[0].receiverID ||
      //     parseInt(state.activeChatIdData.id) ===
      //       action.response.data[0].senderID) &&
      //   state.activeChatIdData.messageType === action.response.data[0].mType
      // ) {
      return {
        ...state,
        talkSocketData: {
          socketInsertOTOMessageData:
            initialState.talkSocketData.socketInsertOTOMessageData,
          socketInsertGroupMessageData: action.response,
        },
      };
      // }
    }

    case actions.MQTT_BLOCK_USER: {
      // if (
      //   action.response.message !== 'NEW_ONE_TO_ONE_MESSAGE' &&
      //   action.response.message !== 'NEW_GROUP_MESSAGE'
      // ) {
      return {
        ...state,
        talkSocketDataUserBlockUnblock: {
          socketBlockUser: action.response,
          socketUnblockUser: null,
        },
      };
    }
    // }

    case actions.MQTT_UNBLOCK_USER: {
      // if (
      //   action.response.message !== 'NEW_ONE_TO_ONE_MESSAGE' &&
      //   action.response.message !== 'NEW_GROUP_MESSAGE'
      // ) {
      return {
        ...state,
        talkSocketDataUserBlockUnblock: {
          socketBlockUser: null,
          socketUnblockUser: action.response,
        },
      };
    }
    // }

    case actions.MQTT_STAR_MESSAGE: {
      return {
        ...state,
        talkSocketDataStarUnstar: {
          socketStarMessage: {
            isFlag: action.response.data[0].isFlag === true ? 1 : 0,
            messageID: action.response.data[0].messageID,
            messageType: action.response.data[0].messageType,
          },
          socketUnstarMessage: null,
        },
      };
    }

    case actions.MQTT_UNSTAR_MESSAGE: {
      return {
        ...state,
        talkSocketDataStarUnstar: {
          socketStarMessage: null,
          socketUnstarMessage: {
            isFlag: action.response.data[0].isFlag === true ? 1 : 0,
            messageID: action.response.data[0].messageID,
            messageType: action.response.data[0].messageType,
          },
        },
      };
    }

    case actions.MQTT_GROUP_CREATED: {
      return {
        ...state,
        talkSocketGroupCreation: {
          groupCreatedData: action.response,
        },
      };
    }

    case actions.MQTT_GROUP_UPDATED: {
      return {
        ...state,
        talkSocketGroupUpdation: {
          groupUpdatedData: action.response,
        },
      };
    }

    case actions.MQTT_UNREAD_MESSAGE_COUNT: {
      return {
        ...state,
        talkSocketUnreadMessageCount: {
          unreadMessageData: action.response,
        },
      };
    }

    case actions.RESET_LEAVE_GROUP_MESSAGE: {
      return {
        ...state,
        LeaveGroup: {
          LeaveGroupResponse: [],
          LeaveGroupResponseMessage: "",
        },
      };
    }

    case actions.RESET_GROUP_MODIFY_MESSAGE: {
      return {
        ...state,
        UpdatePrivateGroup: {
          UpdatePrivateGroupResponse: [],
          UpdatePrivateGroupResponseMessage: "",
        },
      };
    }

    case actions.CREATE_SHOUTALL_INIT: {
      return {
        ...state,
        CreateShoutAllList: {
          CreateShoutAllListResponse: [],
          CreateShoutAllListResponseMessage: "",
        },
      };
    }

    case actions.CREATE_SHOUTALL_SUCCESS: {
      return {
        ...state,
        CreateShoutAllList: {
          CreateShoutAllListResponse: action.response,
          CreateShoutAllListResponseMessage: action.message,
        },
      };
    }

    case actions.CREATE_SHOUTALL_FAIL: {
      return {
        ...state,
        CreateShoutAllList: {
          CreateShoutAllListResponse: [],
          CreateShoutAllListResponseMessage: action.message,
        },
      };
    }

    case actions.RESET_SHOUTALL_CREATED_MESSAGE: {
      return {
        ...state,
        CreateShoutAllList: {
          CreateShoutAllListResponse: [],
          CreateShoutAllListResponseMessage: "",
        },
      };
    }

    case actions.MQTT_INSERT_BROADCAST_MESSAGE: {
      return {
        ...state,
        talkSocketInsertBroadcastMessage: {
          MessageSendBroadcastResponseData: action.response,
        },
      };
    }

    case actions.DELETE_SHOUT_INIT: {
      return {
        ...state,
        DeleteShout: {
          DeleteShoutResponse: [],
          DeleteShoutResponseMessage: "",
        },
      };
    }

    case actions.DELETE_SHOUT_SUCCESS: {
      return {
        ...state,
        DeleteShout: {
          DeleteShoutResponse: action.response,
          DeleteShoutResponseMessage: action.message,
        },
      };
    }

    case actions.DELETE_SHOUT_FAIL: {
      return {
        ...state,
        DeleteShout: {
          DeleteShoutResponse: [],
          DeleteShoutResponseMessage: action.message,
        },
      };
    }

    case actions.UPDATE_SHOUTALL_INIT: {
      return {
        ...state,
        UpdateShoutAllData: {
          UpdateShoutAllResponse: [],
          UpdateShoutAllResponseMessage: "",
        },
      };
    }

    case actions.UPDATE_SHOUTALL_SUCCESS: {
      return {
        ...state,
        UpdateShoutAllData: {
          UpdateShoutAllResponse: action.response,
          UpdateShoutAllResponseMessage: action.message,
        },
      };
    }

    case actions.UPDATE_SHOUTALL_FAIL: {
      return {
        ...state,
        UpdateShoutAllData: {
          UpdateShoutAllResponse: [],
          UpdateShoutAllResponseMessage: action.message,
        },
      };
    }

    case actions.INSERT_BULKMESSAGES_INIT: {
      return {
        ...state,
        InsertBulkMessageData: {
          InsertBulkMessageResponse: [],
          InsertBulkMessageResponseMessage: "",
        },
      };
    }

    case actions.INSERT_BULKMESSAGES_SUCCESS: {
      return {
        ...state,
        InsertBulkMessageData: {
          InsertBulkMessageResponse: action.response,
          InsertBulkMessageResponseMessage: action.message,
        },
      };
    }

    case actions.INSERT_BULKMESSAGES_FAIL: {
      return {
        ...state,
        InsertBulkMessageData: {
          InsertBulkMessageResponse: [],
          InsertBulkMessageResponseMessage: action.message,
        },
      };
    }

    case actions.DOWNLOAD_CHAT_INIT: {
      return {
        ...state,
        DownloadChatData: {
          DownloadChatResponse: [],
          DownloadChatResponseMessage: "",
        },
      };
    }

    case actions.DOWNLOAD_CHAT_SUCCESS: {
      return {
        ...state,
        DownloadChatData: {
          DownloadChatResponse: action.response,
          DownloadChatResponseMessage: action.message,
        },
      };
    }

    case actions.DOWNLOAD_CHAT_FAIL: {
      return {
        ...state,
        DownloadChatData: {
          DownloadChatResponse: [],
          DownloadChatResponseMessage: action.message,
        },
      };
    }

    case actions.EMAIL_CHAT_INIT: {
      return {
        ...state,
        EmailChatData: {
          EmailChatResponse: [],
          EmailChatResponseMessage: "",
        },
      };
    }

    case actions.EMAIL_CHAT_SUCCESS: {
      return {
        ...state,
        EmailChatData: {
          EmailChatResponse: action.response,
          EmailChatResponseMessage: action.message,
        },
      };
    }

    case actions.EMAIL_CHAT_FAIL: {
      return {
        ...state,
        EmailChatData: {
          EmailChatResponse: [],
          EmailChatResponseMessage: action.message,
        },
      };
    }

    case actions.MQTT_MESSAGE_STATUS_UPDATE: {
      return {
        ...state,
        MessageStatusUpdateData: {
          MessageStatusUpdateResponse: action.response,
        },
      };
    }

    case actions.GET_ACTIVE_CHAT: {
      return {
        ...state,
        ActiveChatData: action.response,
      };
    }

    case actions.PUSH_MESSAGE_DATA: {
      return {
        ...state,
        PushMessageData: action.response,
      };
    }

    case actions.PUSH_CHAT_DATA: {
      return {
        ...state,
        PushChatData: action.response,
      };
    }

    case actions.FILE_UPLOAD_DATA: {
      return {
        ...state,
        FileUploadData: action.response,
      };
    }

    case actions.ACTIVE_MESSAGE_DATA: {
      return {
        ...state,
        ActiveMessageData: action.response,
      };
    }

    case actions.GET_ALL_STARRED_MESSAGES_INIT: {
      return {
        ...state,
        AllStarMessagesData: {
          AllStarMessagesResponse: [],
          AllStarMessagesResponseMessage: "",
          Loading: true,
        },
      };
    }

    case actions.GET_ALL_STARRED_MESSAGES_SUCCESS: {
      return {
        ...state,
        AllStarMessagesData: {
          AllStarMessagesResponse: action.response,
          AllStarMessagesResponseMessage: action.message,
          Loading: false,
        },
      };
    }

    case actions.GET_ALL_STARRED_MESSAGES_FAIL: {
      return {
        ...state,
        AllStarMessagesData: {
          AllStarMessagesResponse: [],
          AllStarMessagesResponseMessage: action.message,
          Loading: false,
        },
      };
    }

    case actions.MQTT_MESSAGE_DELETED: {
      return {
        ...state,
        MqttMessageDeleteData: action.response,
      };
    }

    case actions.DOWNLOAD_CHAT_EMPTY: {
      return {
        ...state,
        DownloadChatData: {
          DownloadChatResponse: action.response,
          DownloadChatResponseMessage: "",
        },
      };
    }

    case actions.GET_ALL_MESSAGES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_MESSAGES_SUCCESS: {
      return {
        ...state,
        AllMessagesData: action.response,
        Loading: false,
      };
    }

    case actions.GET_ALL_MESSAGES_FAIL: {
      return {
        ...state,
        AllMessagesData: action.response,
        Loading: false,
      };
    }

    case actions.MQTT_GROUP_LEFT: {
      // Update the reducer here if removed or any CRUD happens

      console.log(state, action.response, "talkStateDatatalkStateData");
      let copyAllMessages = [...state.AllUserChats.AllUserChatsData];

      let newData = copyAllMessages.allMessages.filter((stateData) => {
        console.log(stateData, action.response, "talkStateDatatalkStateData");
        return stateData.id !== action.response.data[0].groupgroupID;
      });

      console.log(
        state,
        action.response,
        newData,
        "talkStateDatatalkStateData"
      );

      return {
        ...state,
        AllUserChats: {
          Loading: false,
          AllUserChatsData: newData,
          ResponseMessage: action.message,
        },
        MqttGroupLeftData: action.response,
      };
    }

    case actions.DELETE_MULTIPLE_MESSAGES_INIT: {
      return {
        ...state,
        // Loading: true,
      };
    }

    case actions.DELETE_MULTIPLE_MESSAGES_SUCCESS: {
      return {
        ...state,
        MultipleMessagesDeletedData: {
          MultipleMessagesDeletedResponse: action.response,
          MultipleMessagesDeletedResponseMessage: action.message,
        },
      };
    }

    case actions.DELETE_MULTIPLE_MESSAGES_FAIL: {
      return {
        ...state,
        MultipleMessagesDeletedData: {
          MultipleMessagesDeletedResponse: [],
          MultipleMessagesDeletedResponseMessage: action.message,
        },
      };
    }

    case actions.LAST_MESSAGE_DELETION: {
      return {
        ...state,
        LastMessageDeletionObject: action.response,
      };
    }

    case actions.GET_IMAGE_DATA: {
      return {
        ...state,
        imageData: action.response,
      };
    }

    default:
      return { ...state };
  }
};
export default talkReducer;
