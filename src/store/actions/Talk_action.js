import * as actions from "../action_types";
import {
  refreshTokenTalk,
  getAllUserChats,
  getUserOTOMessages,
  getUndeliveredUserOTOMessages,
  getGroupMessages,
  getBroadCastMessages,
  getArchivedDataByUserID,
  getFlagMessages,
  getFollowMessages,
  getAllRecentTags,
  getTagsMessages,
  getMessageSentReceivedTime,
  getRecentFlagCount,
  getRecentFollowDataCountByUserID,
  getAllRecentTagsCount,
  getRecentArchiveDataCountByUserID,
  getBlockedUsersCount,
  getBlockedUsers,
  getAllUsers,
  getAllUsersGroupsRoomsList,
  getActiveUsersByGroupID,
  getActiveUsersByBroadcastID,
  getActiveUsersByRoomID,
  insertOTOMessages,
  insertPrivateGroupMessage,
  blockUnblockUser,
  deleteSingleMessage,
  insertBroadcastMessage,
  createTalkPrivateGroup,
  getPrivateGroupMembers,
  markStarredMessage,
  updatePrivateGroup,
  leaveGroup,
  createShoutAll,
  deleteShoutAll,
  updateShoutAll,
  insertBulkMessages,
  downloadChat,
  updateMessageAcknowledgement,
  getAllStarredMessages,
  deleteMultipleGroupMessages,
  downloadAttachmentTalk,
} from "../../commen/apis/Api_config";
import { changeMQTTJSONOne } from "../../commen/functions/MQTTJson";
import axios from "axios";
import { talkApi, talkApiReport } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import { chatBoxActiveFlag, retryFlagState } from "./Talk_Feature_actions";

// Refresh Token Talk Success
const refreshtokenTalkSuccess = (response, message) => {
  return {
    type: actions.REFRESH_TOKEN_TALK_SUCCESS,
    response: response,
    message: message,
  };
};

// Refresh Token Fail
const refreshtokenTalkFail = (response, message) => {
  return {
    type: actions.REFRESH_TOKEN_TALK_FAIL,
    response: response,
    message: message,
  };
};

//Refresh Tokenm
const RefreshTokenTalk = (props) => {
  let Token = JSON.parse(localStorage.getItem("token"));
  let RefreshTokenTalk = JSON.parse(localStorage.getItem("RefreshTokenTalk"));

  let Data = {
    Token: Token,
    RefreshTokenTalk: RefreshTokenTalk,
  };

  return async (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", refreshTokenTalk.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: talkApi,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseCode === 200) {
          await dispatch(
            refreshtokenTalkSuccess(
              response.data.responseResult,
              "Refresh Token Update Successfully"
            )
          );
        } else {
          // dispatch(signOut(navigate, message2));
          await dispatch(
            refreshtokenTalkFail(
              response.data.responseResult,
              "Your Session has expired. Please login again."
            )
          );
        }
      })
      .catch((response) => {
        // dispatch(SomeThingWentWrong(response));
      });
  };
};

//Get Active Chat Value
const activeChatID = (response) => {
  return {
    type: actions.GET_ACTIVECHATID,
    response: response,
  };
};

const activeMessageID = (response) => {
  return {
    type: actions.GET_ACTIVEMESSAGEID,
    response: response,
  };
};

const activeChat = (response) => {
  return {
    type: actions.GET_ACTIVE_CHAT,
    response: response,
  };
};

//insert oto talk mqtt
const mqttInsertOtoMessage = (response) => {
  return {
    type: actions.MQTT_INSERT_OTO_MESSAGE,
    response: response,
  };
};

//insert private group talk mqtt
const mqttInsertPrivateGroupMessage = (response) => {
  return {
    type: actions.MQTT_INSERT_PRIVATEGROUP_MESSAGE,
    response: response,
  };
};

//insert broadcast talk mqtt
const mqttInsertBroadcastMessage = (response) => {
  return {
    type: actions.MQTT_INSERT_BROADCAST_MESSAGE,
    response: response,
  };
};

//Mqtt Block a User
const mqttBlockUser = (response) => {
  return {
    type: actions.MQTT_BLOCK_USER,
    response: response,
  };
};

//Mqtt Unblock a User
const mqttUnblockUser = (response) => {
  return {
    type: actions.MQTT_UNBLOCK_USER,
    response: response,
  };
};

//Mqtt Star A message
const mqttStarMessage = (response) => {
  return {
    type: actions.MQTT_STAR_MESSAGE,
    response: response,
  };
};

//Mqtt UnStar A message
const mqttUnstarMessage = (response) => {
  return {
    type: actions.MQTT_UNSTAR_MESSAGE,
    response: response,
  };
};

//Group is created MQTT Response
const mqttGroupCreated = (response) => {
  return {
    type: actions.MQTT_GROUP_CREATED,
    response: response,
  };
};

//Group is updated MQTT Response
const mqttGroupUpdated = (response) => {
  return {
    type: actions.MQTT_GROUP_UPDATED,
    response: response,
  };
};

//Unread Message Count
const mqttUnreadMessageCount = (response) => {
  return {
    type: actions.MQTT_UNREAD_MESSAGE_COUNT,
    response: response,
  };
};

//MQTT Message Deleted
const mqttMessageDeleted = (response) => {
  return {
    type: actions.MQTT_MESSAGE_DELETED,
    response: response,
  };
};

//Message Status Update
const mqttMessageStatusUpdate = (response) => {
  return {
    type: actions.MQTT_MESSAGE_STATUS_UPDATE,
    response: response,
  };
};

//get all user chat init
const getAllUserChatsInit = (response) => {
  return {
    type: actions.GET_USERCHATS_INIT,
    response: response,
  };
};

//get user chats success
const getAllUserChatsSuccess = (response, message) => {
  return {
    type: actions.GET_USERCHATS_SUCCESS,
    response: response,
    message: message,
  };
};

//get user chats fail
const getAllUserChatsFail = (response, message) => {
  return {
    type: actions.GET_USERCHATS_FAIL,
    response: response,
    message: message,
  };
};

//Get all user chats
const GetAllUserChats = (navigate, currentUserId, currentOrganizationId, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: parseInt(currentUserId),
      ChannelID: parseInt(currentOrganizationId),
    },
  };
  return (dispatch) => {
    dispatch(getAllUserChatsInit());
    let form = new FormData();
    form.append("RequestMethod", getAllUserChats.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(
            GetAllUserChats(navigate, currentUserId, currentOrganizationId, t)
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentAllMessagesWithUserDetails_01"
          ) {
            let newError = t("Messages-found");
            await dispatch(
              getAllUserChatsSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentAllMessagesWithUserDetails_02"
          ) {
            let newError = t("No-messages-found");
            dispatch(getAllUserChatsFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentAllMessagesWithUserDetails_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getAllUserChatsFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getAllUserChatsFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getAllUserChatsFail(false, newError));
      });
  };
};

//get OTO user messages init
const getOTOUserMessagesInit = (response) => {
  return {
    type: actions.GET_OTOUSERMESSAGES_INIT,
    response: response,
  };
};

//get OTO user chats success
const getOTOUserMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_OTOUSERMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//Get All Messages
const getAllMessagesInit = () => {
  return {
    type: actions.GET_ALL_MESSAGES_INIT,
  };
};

//Get All Messages
const getAllMessagesGlobalSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_MESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//Get All Messages
const getAllMessagesGlobalFail = (response, message) => {
  return {
    type: actions.GET_ALL_MESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//get OTO user chats fail
const getOTOUserMessagesFail = (response, message) => {
  return {
    type: actions.GET_OTOUSERMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//Get OTO all user chats
const GetOTOUserMessages = (navigate, chatOTOData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: parseInt(chatOTOData.UserID),
      ChannelID: parseInt(chatOTOData.ChannelID),
      OpponentUserId: chatOTOData.OpponentUserId,
      NumberOfMessages: chatOTOData.NumberOfMessages,
      OffsetMessage: chatOTOData.OffsetMessage,
    },
  };
  return (dispatch) => {
    dispatch(getOTOUserMessagesInit());
    dispatch(getAllMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", getUserOTOMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(GetOTOUserMessages(navigate, chatOTOData, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetUserOTOMessages_01"
          ) {
            let newError = t("One-to-one-messages-found");
            dispatch(
              getOTOUserMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
            dispatch(
              getAllMessagesGlobalSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetUserOTOMessages_02"
          ) {
            let newError = t("No-one-to-one-messages-found");
            dispatch(getOTOUserMessagesFail(false, newError));
            dispatch(getAllMessagesGlobalFail([], newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetUserOTOMessages_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getOTOUserMessagesFail(true, newError));
            dispatch(getAllMessagesGlobalFail([], newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getOTOUserMessagesFail(false, newError));
          dispatch(getAllMessagesGlobalFail([], newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getOTOUserMessagesFail(false, newError));
        dispatch(getAllMessagesGlobalFail([], newError));
      });
  };
};

//get OTO user undelivered chat init
const getOTOUserUndeliveredMessagesInit = (response) => {
  return {
    type: actions.GET_OTOUSERUNDELIVEREDMESSAGES_INIT,
    response: response,
  };
};

//get OTO user undelivered chats success
const getOTOUserUndeliveredMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_OTOUSERUNDELIVEREDMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//get OTO user undelivered chats fail
const getOTOUserUndeliveredMessagesFail = (response, message) => {
  return {
    type: actions.GET_OTOUSERUNDELIVEREDMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//Get OTO undelivered user chats
const GetOTOUserUndeliveredMessages = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
      OpponentUserId: 4,
      Message: {
        MessageID: 12345,
      },
    },
  };
  return (dispatch) => {
    dispatch(getOTOUserUndeliveredMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", getUndeliveredUserOTOMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetOTOUserUndeliveredMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetUndeliveredUserOTOMessages_01"
          ) {
            let newError = t("Undelivered-OTO-messages-found");
            await dispatch(
              getOTOUserUndeliveredMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetUndeliveredUserOTOMessages_02"
          ) {
            let newError = t("Undelivered-OTO-messages-not-found");
            dispatch(getOTOUserUndeliveredMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetUndeliveredUserOTOMessages_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getOTOUserUndeliveredMessagesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getOTOUserUndeliveredMessagesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getOTOUserUndeliveredMessagesFail(false, newError));
      });
  };
};

//get Group Messages Init
const getGroupMessagesInit = (response) => {
  return {
    type: actions.GET_GROUPMESSAGES_INIT,
    response: response,
  };
};

//get Group Messages success
const getGroupMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_GROUPMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//get Group Messages fail
const getGroupMessagesFail = (response, message) => {
  return {
    type: actions.GET_GROUPMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//get Group Messages
const GetGroupMessages = (navigate, chatGroupData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: chatGroupData.UserID,
      GroupID: chatGroupData.GroupID,
      NumberOfMessages: chatGroupData.NumberOfMessages,
      OffsetMessage: chatGroupData.OffsetMessage,
      ChannelID: parseInt(chatGroupData.ChannelID),
    },
  };
  return (dispatch) => {
    dispatch(getGroupMessagesInit());
    dispatch(getAllMessagesInit());

    let form = new FormData();
    form.append("RequestMethod", getGroupMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(GetGroupMessages(navigate, chatGroupData, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetGroupMessages_01"
          ) {
            let newError = t("Group-messages-found");
            dispatch(
              getGroupMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
            dispatch(
              getAllMessagesGlobalSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetGroupMessages_02"
          ) {
            let newError = t("Group-messages-not-found");
            dispatch(getGroupMessagesFail(false, newError));
            dispatch(getAllMessagesGlobalFail([], newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetGroupMessages_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getGroupMessagesFail(true, newError));
            dispatch(getAllMessagesGlobalFail([], newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getGroupMessagesFail(false, newError));
          dispatch(getAllMessagesGlobalFail([], newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getGroupMessagesFail(false, newError));
        dispatch(getAllMessagesGlobalFail([], newError));
      });
  };
};

//get Broadcast Messages Init
const getBroacastMessagesInit = (response) => {
  return {
    type: actions.GET_BROADCASTMESSAGES_INIT,
    response: response,
  };
};

//get Broadcast Messages success
const getBroacastMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_BROADCASTMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//get Broadcast Messages fail
const getBroacastMessagesFail = (response, message) => {
  return {
    type: actions.GET_BROADCASTMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//get Broadcast Messages
const GetBroadcastMessages = (navigate, broadcastMessagesData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: parseInt(broadcastMessagesData.UserID),
      BroadcastID: broadcastMessagesData.BroadcastID,
      NumberOfMessages: broadcastMessagesData.NumberOfMessages,
      OffsetMessage: broadcastMessagesData.OffsetMessage,
    },
  };
  return (dispatch) => {
    dispatch(getBroacastMessagesInit());
    dispatch(getAllMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", getBroadCastMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(GetBroadcastMessages(navigate, broadcastMessagesData, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBroadcastMessages_01"
          ) {
            let newError = t("Broadcast-messages-found");
            dispatch(
              getBroacastMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
            dispatch(
              getAllMessagesGlobalSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBroadcastMessages_02"
          ) {
            let newError = t("Broadcast-messages-not-found");
            dispatch(getBroacastMessagesFail(false, newError));
            dispatch(getAllMessagesGlobalFail([], newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBroadcastMessages_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getBroacastMessagesFail(true, newError));
            dispatch(getAllMessagesGlobalFail([], newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getBroacastMessagesFail(false, newError));
          dispatch(getAllMessagesGlobalFail([], newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getBroacastMessagesFail(false, newError));
        dispatch(getAllMessagesGlobalFail([], newError));
      });
  };
};

//get Archived Data by User id init
const getArchivedDataByUserIDInit = (response) => {
  return {
    type: actions.GET_ARCHIVEDDATABYUSERID_INIT,
    response: response,
  };
};

//get Archived Data by User id success
const getArchivedDataByUserIDSuccess = (response, message) => {
  return {
    type: actions.GET_ARCHIVEDDATABYUSERID_SUCCESS,
    response: response,
    message: message,
  };
};

//get Archived Data by User id fail
const getArchivedDataByUserIDFail = (response, message) => {
  return {
    type: actions.GET_ARCHIVEDDATABYUSERID_FAIL,
    response: response,
    message: message,
  };
};

//GetArchivedDataByUserID
const GetArchivedDataByUserID = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getArchivedDataByUserIDInit());
    let form = new FormData();
    form.append("RequestMethod", getArchivedDataByUserID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetArchivedDataByUserID(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentArchiveDataByUserID_01"
          ) {
            let newError = t("Archive-data-found");
            await dispatch(
              getArchivedDataByUserIDSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentArchiveDataByUserID_02"
          ) {
            let newError = t("Archive-data-not-found");
            dispatch(getArchivedDataByUserIDFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentArchiveDataByUserID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getArchivedDataByUserIDFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getArchivedDataByUserIDFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getArchivedDataByUserIDFail(false, newError));
      });
  };
};

//get flag messsages init
const getFlagMessagesInit = (response) => {
  return {
    type: actions.GET_FLAGMESSAGES_INIT,
    response: response,
  };
};

//get flag messsages success
const getFlagMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_FLAGMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//get flag messsages fail
const getFlagMessagesFail = (response, message) => {
  return {
    type: actions.GET_FLAGMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//get flag messsages
const GetFlagMessages = (navigate, currentUserId, currentOrganizationId, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: parseInt(currentUserId),
      ChannelID: parseInt(currentOrganizationId),
    },
  };
  return (dispatch) => {
    dispatch(getFlagMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", getFlagMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(
            GetFlagMessages(navigate, currentUserId, currentOrganizationId, t)
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFlag_01"
          ) {
            let newError = t("Recent-flag-messages-found");
            await dispatch(
              getFlagMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFlag_02"
          ) {
            let newError = t("Recent-flag-messages-not-found");
            dispatch(getFlagMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFlag_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getFlagMessagesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getFlagMessagesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getFlagMessagesFail(false, newError));
      });
  };
};

//get follow messsages init
const getFollowMessagesInit = (response) => {
  return {
    type: actions.GET_FOLLOWMESSAGES_INIT,
    response: response,
  };
};

//get follow messsages success
const getFollowMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_FOLLOWMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//get follow messsages fail
const getFollowMessagesFail = (response, message) => {
  return {
    type: actions.GET_FOLLOWMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//get follow messsages
const GetFollowMessages = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getFollowMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", getFollowMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetFollowMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFollowDataByUserID_01"
          ) {
            let newError = t("Recent-follow-messages-found");
            await dispatch(
              getFollowMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFollowDataByUserID_02"
          ) {
            let newError = t("Recent-follow-messages-not-found");
            dispatch(getFollowMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFollowDataByUserID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getFollowMessagesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getFollowMessagesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getFollowMessagesFail(false, newError));
      });
  };
};

//get recent tags init
const getRecentTagsInit = (response) => {
  return {
    type: actions.GET_RECENTTAGS_INIT,
    response: response,
  };
};

//get recent tags success
const getRecentTagsSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTTAGS_SUCCESS,
    response: response,
    message: message,
  };
};

//get recent tags fail
const getRecentTagsFail = (response, message) => {
  return {
    type: actions.GET_RECENTTAGS_FAIL,
    response: response,
    message: message,
  };
};

//get recent tags
const GetRecentTags = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getRecentTagsInit());
    let form = new FormData();
    form.append("RequestMethod", getAllRecentTags.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentTags(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllRecentTags_01"
          ) {
            let newError = t("Recent-tag-messages-found");
            await dispatch(
              getRecentTagsSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllRecentTags_02"
          ) {
            let newError = t("Recent-tag-messages-not-found");
            dispatch(getRecentTagsFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllRecentTags_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getRecentTagsFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getRecentTagsFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getRecentTagsFail(false, newError));
      });
  };
};

//get tags messages init
const getTagsMessagesInit = (response) => {
  return {
    type: actions.GET_TAGSMESSAGES_INIT,
    response: response,
  };
};

//get tags messages success
const getTagsMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_TAGSMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

//get tags messages fail
const getTagsMessagesFail = (response, message) => {
  return {
    type: actions.GET_TAGSMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//get tags messages
const GetTagsMessages = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
      Tag: "inbox",
      TagID: 42,
    },
  };
  return (dispatch) => {
    dispatch(getTagsMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", getTagsMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetTagsMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetTagsMessages_01"
          ) {
            let newError = t("Users-tag-messages-found");
            await dispatch(
              getTagsMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetTagsMessages_02"
          ) {
            let newError = t("Users-tag-messages-not-found");
            dispatch(getTagsMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetTagsMessages_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getTagsMessagesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getTagsMessagesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getTagsMessagesFail(false, newError));
      });
  };
};

//get message send receive time init
const getMessageSentReceiveTimeInit = (response) => {
  return {
    type: actions.GET_MESSAGESENTRECEIVETIME_INIT,
    response: response,
  };
};

//get message send receive time success
const getMessageSentReceiveTimeSuccess = (response, message) => {
  return {
    type: actions.GET_MESSAGESENTRECEIVETIME_SUCCESS,
    response: response,
    message: message,
  };
};

//get message send receive time fail
const getMessageSentReceiveTimeFail = (response, message) => {
  return {
    type: actions.GET_MESSAGESENTRECEIVETIME_FAIL,
    response: response,
    message: message,
  };
};

//get message send receive time
const GetMessageSentReceiveTime = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      Message: {
        MessageID: 5270,
      },
    },
  };
  return (dispatch) => {
    dispatch(getMessageSentReceiveTimeInit());
    let form = new FormData();
    form.append("RequestMethod", getMessageSentReceivedTime.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetMessageSentReceiveTime(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetSentReceiveSeenTime_01"
          ) {
            let newError = t("Message-timestamps-found");
            await dispatch(
              getMessageSentReceiveTimeSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetSentReceiveSeenTime_02"
          ) {
            let newError = t("Message-timestamps-not-found");
            dispatch(getMessageSentReceiveTimeFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetSentReceiveSeenTime_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getMessageSentReceiveTimeFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getMessageSentReceiveTimeFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getMessageSentReceiveTimeFail(false, newError));
      });
  };
};

//get recent flag count init
const getRecentFlagCountInit = (response) => {
  return {
    type: actions.GET_RECENTFLAGCOUNT_INIT,
    response: response,
  };
};

//get recent flag count success
const getRecentFlagCountSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTFLAGCOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

//get recent flag count fail
const getRecentFlagCountFail = (response, message) => {
  return {
    type: actions.GET_RECENTFLAGCOUNT_FAIL,
    response: response,
    message: message,
  };
};

//get recent flag count
const GetRecentFlagCount = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getRecentFlagCountInit());
    let form = new FormData();
    form.append("RequestMethod", getRecentFlagCount.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentFlagCount(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFlagCount_01"
          ) {
            let newError = t("Recent-flag-messages-found");
            await dispatch(
              getRecentFlagCountSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFlagCount_02"
          ) {
            let newError = t("Recent-flag-messages-not-found");
            dispatch(getRecentFlagCountFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFlagCount_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getRecentFlagCountFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getRecentFlagCountFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getRecentFlagCountFail(false, newError));
      });
  };
};

//getRecentFollowDataCount init
const getRecentFollowDataCountInit = (response) => {
  return {
    type: actions.GET_RECENTFOLLOWDATACOUNT_INIT,
    response: response,
  };
};

//getRecentFollowDataCount success
const getRecentFollowDataCountSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTFOLLOWDATACOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

//getRecentFollowDataCount fail
const getRecentFollowDataCountFail = (response, message) => {
  return {
    type: actions.GET_RECENTFOLLOWDATACOUNT_FAIL,
    response: response,
    message: message,
  };
};

//GetRecentFollowDataCount
const GetRecentFollowDataCount = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getRecentFollowDataCountInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getRecentFollowDataCountByUserID.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentFollowDataCount(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFollowDataCountByUserID_01"
          ) {
            let newError = t("Recent-follow-messages-found");
            await dispatch(
              getRecentFollowDataCountSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFollowDataCountByUserID_02"
          ) {
            let newError = t("Recent-follow-messages-not-found");
            dispatch(getRecentFollowDataCountFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentFollowDataCountByUserID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getRecentFollowDataCountFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getRecentFollowDataCountFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getRecentFollowDataCountFail(false, newError));
      });
  };
};

//getAllRecentTagsCount init
const getAllRecentTagsCountInit = (response) => {
  return {
    type: actions.GET_ALLRECENTTAGSCOUNT_INIT,
    response: response,
  };
};

//getAllRecentTagsCount success
const getAllRecentTagsCountSuccess = (response, message) => {
  return {
    type: actions.GET_ALLRECENTTAGSCOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

//getAllRecentTagsCount fail
const getAllRecentTagsCountFail = (response, message) => {
  return {
    type: actions.GET_ALLRECENTTAGSCOUNT_FAIL,
    response: response,
    message: message,
  };
};

//getAllRecentTagsCount
const GetAllRecentTagsCount = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getAllRecentTagsCountInit());
    let form = new FormData();
    form.append("RequestMethod", getAllRecentTagsCount.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetAllRecentTagsCount(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllRecentTagsCount_01"
          ) {
            let newError = t("Recent-tag-messages-found");
            await dispatch(
              getAllRecentTagsCountSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllRecentTagsCount_02"
          ) {
            let newError = t("Recent-tag-messages-not-found");
            dispatch(getAllRecentTagsCountFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllRecentTagsCount_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getAllRecentTagsCountFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getAllRecentTagsCountFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getAllRecentTagsCountFail(false, newError));
      });
  };
};

//getRecentDataArchiveCount init
const getRecentDataArchiveCountInit = (response) => {
  return {
    type: actions.GET_RECENTDATAARCHIVECOUNT_INIT,
    response: response,
  };
};

//getRecentDataArchiveCount success
const getRecentDataArchiveCountSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTDATAARCHIVECOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

//getRecentDataArchiveCount fail
const getRecentDataArchiveCountFail = (response, message) => {
  return {
    type: actions.GET_RECENTDATAARCHIVECOUNT_FAIL,
    response: response,
    message: message,
  };
};

//getRecentDataArchiveCount
const GetRecentDataArchiveCount = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getRecentDataArchiveCountInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getRecentArchiveDataCountByUserID.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentDataArchiveCount(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentArchiveDataCountByUserID_01"
          ) {
            let newError = t("Recent-archive-messages-found");
            await dispatch(
              getRecentDataArchiveCountSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentArchiveDataCountByUserID_02"
          ) {
            let newError = t("Recent-archive-messages-not-found");
            dispatch(getRecentDataArchiveCountFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetRecentArchiveDataCountByUserID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getRecentDataArchiveCountFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getRecentDataArchiveCountFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getRecentDataArchiveCountFail(false, newError));
      });
  };
};

//getBlockedUsersCountInit init
const getBlockedUsersCountInit = (response) => {
  return {
    type: actions.GET_BLOCKEDUSERSCOUNT_INIT,
    response: response,
  };
};

//getBlockedUsersCountSuccess success
const getBlockedUsersCountSuccess = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERSCOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

//getBlockedUsersCountCount fail
const getBlockedUsersCountFail = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERSCOUNT_FAIL,
    response: response,
    message: message,
  };
};

//GetBlockedUsersCount
const GetBlockedUsersCount = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getBlockedUsersCountInit());
    let form = new FormData();
    form.append("RequestMethod", getBlockedUsersCount.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetBlockedUsersCount(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBlockedUsersCount_01"
          ) {
            let newError = t("Blocked-users-found");
            await dispatch(
              getBlockedUsersCountSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBlockedUsersCount_02"
          ) {
            let newError = t("Blocked-users-not-found");
            dispatch(getBlockedUsersCountFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBlockedUsersCount_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getBlockedUsersCountFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getBlockedUsersCountFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getBlockedUsersCountFail(false, newError));
      });
  };
};

//getBlockedUsersInit
const getBlockedUsersInit = () => {
  return {
    type: actions.GET_BLOCKEDUSERS_INIT,
  };
};

//getBlockedUsersSuccess
const getBlockedUsersSuccess = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERS_SUCCESS,
    response: response,
    message: message,
  };
};

//getBlockedUsersFail
const getBlockedUsersFail = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERS_FAIL,
    response: response,
    message: message,
  };
};

//GetBlockedUsers
const GetBlockedUsers = (navigate, currentUserId, currentOrganizationId, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: parseInt(currentUserId),
      ChannelID: parseInt(currentOrganizationId),
    },
  };
  return (dispatch) => {
    dispatch(getBlockedUsersInit());
    let form = new FormData();
    form.append("RequestMethod", getBlockedUsers.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(
            GetBlockedUsers(navigate, currentUserId, currentOrganizationId, t)
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBlockedUsers_01"
          ) {
            let newError = t("Blocked-users-found");
            await dispatch(
              getBlockedUsersSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBlockedUsers_02"
          ) {
            let newError = t("Blocked-users-not-found");
            dispatch(getBlockedUsersFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetBlockedUsers_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getBlockedUsersFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getBlockedUsersFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getBlockedUsersFail(false, newError));
      });
  };
};

//getAllUsersInit
const getAllUsersInit = (response) => {
  return {
    type: actions.GET_ALLUSERS_INIT,
    response: response,
  };
};

//getAllUsersSuccess
const getAllUsersSuccess = (response, message) => {
  return {
    type: actions.GET_ALLUSERS_SUCCESS,
    response: response,
    message: message,
  };
};

//getAllUsersFail
const getAllUsersFail = (response, message) => {
  return {
    type: actions.GET_ALLUSERS_FAIL,
    response: response,
    message: message,
  };
};

//GetAllUsers
const GetAllUsers = (navigate, currentUserId, currentOrganizationId, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
    },
  };
  return (dispatch) => {
    dispatch(getAllUsersInit());
    let form = new FormData();
    form.append("RequestMethod", getAllUsers.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(
            GetAllUsers(navigate, currentUserId, currentOrganizationId, t)
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllUsers_01"
          ) {
            let newError = t("Users-Found");
            await dispatch(
              getAllUsersSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllUsers_02"
          ) {
            let newError = t("Users-not-found");
            dispatch(getAllUsersFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllUsers_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getAllUsersFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getAllUsersFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getAllUsersFail(false, newError));
      });
  };
};

//getAllUsersGroupsRoomsListInit
const getAllUsersGroupsRoomsListInit = (response) => {
  return {
    type: actions.GET_ALLUSERSGROUPSROOMSLIST_INIT,
    response: response,
  };
};

//getAllUsersGroupsRoomsListSuccess
const getAllUsersGroupsRoomsListSuccess = (response, message) => {
  return {
    type: actions.GET_ALLUSERSGROUPSROOMSLIST_SUCCESS,
    response: response,
    message: message,
  };
};

//getAllUsersGroupsRoomsListFail
const getAllUsersGroupsRoomsListFail = (response, message) => {
  return {
    type: actions.GET_ALLUSERSGROUPSROOMSLIST_FAIL,
    response: response,
    message: message,
  };
};

//GetAllUsersGroupsRoomsList
const GetAllUsersGroupsRoomsList = (
  navigate,
  currentUserId,
  currentOrganizationId,
  t
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
    },
  };
  return (dispatch) => {
    dispatch(getAllUsersGroupsRoomsListInit());
    let form = new FormData();
    form.append("RequestMethod", getAllUsersGroupsRoomsList.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(
            GetAllUsersGroupsRoomsList(
              navigate,
              currentUserId,
              currentOrganizationId,
              t
            )
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllUsersGroupsRoomsList_01"
          ) {
            let newError = t("Users-groups-rooms-&-lists-found");
            await dispatch(
              getAllUsersGroupsRoomsListSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllUsersGroupsRoomsList_02"
          ) {
            let newError = t("Users-groups-rooms-&-lists-not-found");
            dispatch(getAllUsersGroupsRoomsListFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetAllUsersGroupsRoomsList_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getAllUsersGroupsRoomsListFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getAllUsersGroupsRoomsListFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getAllUsersGroupsRoomsListFail(false, newError));
      });
  };
};

//getActiveUsersByGroupIDInit
const getActiveUsersByGroupIDInit = (response) => {
  return {
    type: actions.GET_ACTIVEUSERSBYGROUPID_INIT,
    response: response,
  };
};

//getActiveUsersByGroupIDSuccess
const getActiveUsersByGroupIDSuccess = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYGROUPID_SUCCESS,
    response: response,
    message: message,
  };
};

//getActiveUsersByGroupIDFail
const getActiveUsersByGroupIDFail = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYGROUPID_FAIL,
    response: response,
    message: message,
  };
};

//GetActiveUsersByGroupID
const GetActiveUsersByGroupID = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      GroupID: 14,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getActiveUsersByGroupIDInit());
    let form = new FormData();
    form.append("RequestMethod", getActiveUsersByGroupID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetActiveUsersByGroupID(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByGroupID_01"
          ) {
            let newError = t("Groups-active-users-found");
            await dispatch(
              getActiveUsersByGroupIDSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByGroupID_02"
          ) {
            let newError = t("Groups-active-users-not-found");
            dispatch(getActiveUsersByGroupIDFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByGroupID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getActiveUsersByGroupIDFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getActiveUsersByGroupIDFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getActiveUsersByGroupIDFail(false, newError));
      });
  };
};

//getActiveUsersByRoomIDInit
const getActiveUsersByRoomIDInit = (response) => {
  return {
    type: actions.GET_ACTIVEUSERSBYROOMID_INIT,
    response: response,
  };
};

//getActiveUsersByRoomIDSuccess
const getActiveUsersByRoomIDSuccess = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYROOMID_SUCCESS,
    response: response,
    message: message,
  };
};

//getActiveUsersByRoomIDFail
const getActiveUsersByRoomIDFail = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYROOMID_FAIL,
    response: response,
    message: message,
  };
};

//GetActiveUsersByRoomID
const GetActiveUsersByRoomID = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      RoomId: 324,
      ChannelID: 1,
    },
  };
  return (dispatch) => {
    dispatch(getActiveUsersByRoomIDInit());
    let form = new FormData();
    form.append("RequestMethod", getActiveUsersByRoomID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t))
          dispatch(GetActiveUsersByRoomID(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByRoomID_01"
          ) {
            let newError = t("Rooms-active-users-found");
            await dispatch(
              getActiveUsersByRoomIDSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByRoomID_02"
          ) {
            let newError = t("Rooms-active-users-not-found");
            dispatch(getActiveUsersByRoomIDFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByRoomID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getActiveUsersByRoomIDFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getActiveUsersByRoomIDFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getActiveUsersByRoomIDFail(false, newError));
      });
  };
};

//getActiveUsersByBroadcastIDInit
const getActiveUsersByBroadcastIDInit = (response) => {
  return {
    type: actions.GET_ACTIVEUSERSBYBROADCASTID_INIT,
    response: response,
  };
};

//getActiveUsersByBroadcastIDSuccess
const getActiveUsersByBroadcastIDSuccess = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYBROADCASTID_SUCCESS,
    response: response,
    message: message,
  };
};

//getActiveUsersByBroadcastIDFail
const getActiveUsersByBroadcastIDFail = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYBROADCASTID_FAIL,
    response: response,
    message: message,
  };
};

//GetActiveUsersByBroadcastID
const GetActiveUsersByBroadcastID = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getActiveUsersByBroadcastIDInit());
    let form = new FormData();
    form.append("RequestMethod", getActiveUsersByBroadcastID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate));
          dispatch(GetActiveUsersByBroadcastID(navigate, Data, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByBroadcastID_01"
          ) {
            let newError = t("Broadcasts-active-users-found");
            await dispatch(
              getActiveUsersByBroadcastIDSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByBroadcastID_02"
          ) {
            let newError = t("Broadcasts-active-users-not-found");
            dispatch(getActiveUsersByBroadcastIDFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByBroadcastID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getActiveUsersByBroadcastIDFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getActiveUsersByBroadcastIDFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getActiveUsersByBroadcastIDFail(false, newError));
      });
  };
};

const OTOMessageSendInit = () => {
  return {
    type: actions.OTO_MESSAGESEND_INIT,
  };
};

const OTOMessageSendSuccess = (message, response) => {
  return {
    type: actions.OTO_MESSAGESEND_SUCCESS,
    message: message,
    response: response,
  };
};

const OTOMessageSendFail = (message) => {
  return {
    type: actions.OTO_MESSAGESEND_FAIL,
    message: message,
  };
};

const OtoMessageRetryFlag = (response) => {
  return {
    type: actions.OTO_RETRY_FLAG,
    response: response,
  };
};

//Insert OTO Messages
const InsertOTOMessages = (navigate, object, fileUploadData, t, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserName = localStorage.getItem("userNameChat");

  // let unsentMessageObject =
  //   JSON.parse(localStorage.getItem("unsentMessage")) || [];
  // let messageUnsent = [];

  return async (dispatch) => {
    dispatch(OTOMessageSendInit());
    let form = new FormData();
    form.append("RequestMethod", insertOTOMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    form.append("Files", fileUploadData);
    await axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            InsertOTOMessages(navigate, object, fileUploadData, t, flag)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertOTOMessages_01".toLowerCase()
                )
            ) {
              await dispatch(
                OTOMessageSendSuccess(
                  t("OTO-message-inserted"),
                  response.data.responseResult.talkResponse
                )
              );
              dispatch(retryFlagState(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertOTOMessages_02".toLowerCase()
                )
            ) {
              await dispatch(
                OTOMessageSendSuccess(
                  t("User-is-not-in-channel"),
                  response.data.responseResult.talkResponse
                )
              );
              // if (unsentMessageObject) {
              //   messageUnsent = [...unsentMessageObject];
              //   messageUnsent.push(object.TalkRequest.Message.UID);
              // } else {
              //   messageUnsent = object.TalkRequest.Message.UID;
              // }

              // localStorage.setItem(
              //   "unsentMessage",
              //   JSON.stringify(messageUnsent)
              // );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertOTOMessages_03".toLowerCase()
                )
            ) {
              await dispatch(
                OTOMessageSendSuccess(
                  changeMQTTJSONOne(
                    t("You-have-been-blocked"),
                    "[User Name]",
                    currentUserName
                  ),
                  response.data.responseResult.talkResponse
                )
              );

              // if (unsentMessageObject) {
              //   messageUnsent = [...unsentMessageObject];
              //   messageUnsent.push(object.TalkRequest.Message.UID);
              // } else {
              //   messageUnsent = object.TalkRequest.Message.UID;
              // }

              // localStorage.setItem(
              //   "unsentMessage",
              //   JSON.stringify(messageUnsent)
              // );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertOTOMessages_04".toLowerCase()
                )
            ) {
              await dispatch(
                OTOMessageSendSuccess(
                  t("OTO-message-not-inserted"),
                  response.data.responseResult.talkResponse
                )
              );
              // if (unsentMessageObject) {
              //   messageUnsent = [...unsentMessageObject];
              //   messageUnsent.push(object.TalkRequest.Message.UID);
              // } else {
              //   messageUnsent = object.TalkRequest.Message.UID;
              // }

              // localStorage.setItem(
              //   "unsentMessage",
              //   JSON.stringify(messageUnsent)
              // );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertOTOMessages_05".toLowerCase()
                )
            ) {
              await dispatch(OTOMessageSendFail(t("Something-went-wrong")));

              // if (unsentMessageObject) {
              //   messageUnsent = [...unsentMessageObject];
              //   messageUnsent.push(object.TalkRequest.Message.UID);
              // } else {
              //   messageUnsent = object.TalkRequest.Message.UID;
              // }

              // localStorage.setItem(
              //   "unsentMessage",
              //   JSON.stringify(messageUnsent)
              // );
            }
          } else {
            await dispatch(OTOMessageSendFail(t("Something-went-wrong")));

            // if (unsentMessageObject) {
            //   messageUnsent = [...unsentMessageObject];
            //   messageUnsent.push(object.TalkRequest.Message.UID);
            // } else {
            //   messageUnsent = object.TalkRequest.Message.UID;
            // }

            // localStorage.setItem(
            //   "unsentMessage",
            //   JSON.stringify(messageUnsent)
            // );
          }
        } else {
          await dispatch(OTOMessageSendFail(t("Something-went-wrong")));

          // if (unsentMessageObject) {
          //   messageUnsent = [...unsentMessageObject];
          //   messageUnsent.push(object.TalkRequest.Message.UID);
          // } else {
          //   messageUnsent = object.TalkRequest.Message.UID;
          // }

          // localStorage.setItem("unsentMessage", JSON.stringify(messageUnsent));
        }
      })
      .catch((response) => {
        dispatch(OTOMessageSendFail(t("Something-went-wrong")));

        // if (unsentMessageObject) {
        //   messageUnsent = [...unsentMessageObject];
        //   messageUnsent.push(object.TalkRequest.Message.UID);
        // } else {
        //   messageUnsent = object.TalkRequest.Message.UID;
        // }

        // localStorage.setItem("unsentMessage", JSON.stringify(messageUnsent));
      });
  };
};

const GroupPrivateMessageSendInit = () => {
  return {
    type: actions.PRIVATEGROUP_MESSAGESEND_INIT,
  };
};

const GroupPrivateSendNotification = (message) => {
  return {
    type: actions.PRIVATEGROUP_MESSAGESEND_NOTIFICATION,
    message: message,
  };
};

//Insert Private Group Messages
const InsertPrivateGroupMessages = (navigate, object, fileUploadData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let unsentMessageObject =
    JSON.parse(localStorage.getItem("unsentMessage")) || [];
  let messageUnsent = [];
  return (dispatch) => {
    dispatch(GroupPrivateMessageSendInit());
    let form = new FormData();
    form.append("RequestMethod", insertPrivateGroupMessage.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    form.append("Files", fileUploadData);
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            InsertPrivateGroupMessages(navigate, object, fileUploadData, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertGroupMessage_01".toLowerCase()
                )
            ) {
              await dispatch(
                GroupPrivateSendNotification(t("Group-message-inserted"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertGroupMessage_02".toLowerCase()
                )
            ) {
              await dispatch(
                GroupPrivateSendNotification(t("Group-message-not-inserted"))
              );
              if (unsentMessageObject) {
                messageUnsent = [...unsentMessageObject];
                messageUnsent.push(object.TalkRequest.Message.UID);
              } else {
                messageUnsent = object.TalkRequest.Message.UID;
              }

              localStorage.setItem(
                "unsentMessage",
                JSON.stringify(messageUnsent)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertGroupMessage_03".toLowerCase()
                )
            ) {
              await dispatch(
                GroupPrivateSendNotification(t("Something-went-wrong"))
              );
              if (unsentMessageObject) {
                messageUnsent = [...unsentMessageObject];
                messageUnsent.push(object.TalkRequest.Message.UID);
              } else {
                messageUnsent = object.TalkRequest.Message.UID;
              }

              localStorage.setItem(
                "unsentMessage",
                JSON.stringify(messageUnsent)
              );
            }
          } else {
            await dispatch(
              GroupPrivateSendNotification(t("Something-went-wrong"))
            );
            if (unsentMessageObject) {
              messageUnsent = [...unsentMessageObject];
              messageUnsent.push(object.TalkRequest.Message.UID);
            } else {
              messageUnsent = object.TalkRequest.Message.UID;
            }

            localStorage.setItem(
              "unsentMessage",
              JSON.stringify(messageUnsent)
            );
          }
        } else {
          await dispatch(
            GroupPrivateSendNotification(t("Something-went-wrong"))
          );
          if (unsentMessageObject) {
            messageUnsent = [...unsentMessageObject];
            messageUnsent.push(object.TalkRequest.Message.UID);
          } else {
            messageUnsent = object.TalkRequest.Message.UID;
          }

          localStorage.setItem("unsentMessage", JSON.stringify(messageUnsent));
        }
      })
      .catch((response) => {
        dispatch(GroupPrivateSendNotification(t("Something-went-wrong")));
        if (unsentMessageObject) {
          messageUnsent = [...unsentMessageObject];
          messageUnsent.push(object.TalkRequest.Message.UID);
        } else {
          messageUnsent = object.TalkRequest.Message.UID;
        }

        localStorage.setItem("unsentMessage", JSON.stringify(messageUnsent));
      });
  };
};

const BlockUnblockUserInit = () => {
  return {
    type: actions.BLOCK_UNBLOCK_USER_INIT,
  };
};

const BlockUnblockUserNotification = (message) => {
  return {
    type: actions.BLOCK_UNBLOCK_USER_NOTIFICATION,
    message: message,
  };
};

//Block Unblock a user
const BlockUnblockUser = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let Data = {
    TalkRequest: {
      UserID: parseInt(object.senderID),
      OpponentUserId: object.opponentUserId,
      ChannelID: parseInt(object.channelID),
    },
  };
  return (dispatch) => {
    dispatch(BlockUnblockUserInit());
    let form = new FormData();
    form.append("RequestMethod", blockUnblockUser.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(BlockUnblockUser(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_BlockUnBlockUser_01".toLowerCase()
                )
            ) {
              await dispatch(
                BlockUnblockUserNotification(t("User-is-blocked-or-unblocked"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_BlockUnBlockUser_02".toLowerCase()
                )
            ) {
              await dispatch(
                BlockUnblockUserNotification(
                  t("User-is-not-blocked-or-unblocked")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_BlockUnBlockUser_03".toLowerCase()
                )
            ) {
              await dispatch(
                BlockUnblockUserNotification(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              BlockUnblockUserNotification(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            BlockUnblockUserNotification(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(BlockUnblockUserNotification(t("Something-went-wrong")));
      });
  };
};

const deleteSingleMessageInit = () => {
  return {
    type: actions.DELETE_SINGLEMESSAGE_INIT,
  };
};

const deleteSingleMessageSuccess = (response, message) => {
  return {
    type: actions.DELETE_SINGLEMESSAGE_SUCCESS,
    response: response,
    message: message,
  };
};

const deleteSingleMessageFail = (message) => {
  return {
    type: actions.DELETE_SINGLEMESSAGE_FAIL,
    message: message,
  };
};

const DeleteSingleMessage = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let data = {
    TalkRequest: {
      UserID: object.UserID,
      Message: {
        MessageID: object.MessageIds,
        MessageType: object.MessageType,
      },
    },
  };
  return (dispatch) => {
    dispatch(deleteSingleMessageInit());
    let form = new FormData();
    form.append("RequestMethod", deleteSingleMessage.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DeleteSingleMessage(navigate, object, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_SetMessageDelete_01"
          ) {
            let newError = t("Message-deleted");
            await dispatch(
              deleteSingleMessageSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_SetMessageDelete_02"
          ) {
            let newError = t("Message-not-deleted");
            dispatch(deleteSingleMessageFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_SetMessageDelete_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(deleteSingleMessageFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(deleteSingleMessageFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(deleteSingleMessageFail(false, newError));
      });
  };
};

const broadcastMessageSendInit = () => {
  return {
    type: actions.BROADCAST_MESSAGESEND_INIT,
  };
};

const broadcastMessageSendNotification = (message) => {
  return {
    type: actions.BROADCAST_MESSAGESEND_NOTIFICATION,
    message: message,
  };
};

//Insert Private Group Messages
const InsertBroadcastMessages = (navigate, object, fileUploadData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(broadcastMessageSendInit());
    let form = new FormData();
    form.append("RequestMethod", insertBroadcastMessage.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    form.append("Files", fileUploadData);
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            InsertBroadcastMessages(navigate, object, fileUploadData, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBroadcastMessage_01".toLowerCase()
                )
            ) {
              await dispatch(
                broadcastMessageSendNotification(
                  t("Broadcast-message-inserted")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBroadcastMessage_02".toLowerCase()
                )
            ) {
              await dispatch(
                broadcastMessageSendNotification(
                  t("Broadcast-message-not-inserted")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBroadcastMessage_03".toLowerCase()
                )
            ) {
              await dispatch(
                broadcastMessageSendNotification(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              broadcastMessageSendNotification(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            broadcastMessageSendNotification(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(broadcastMessageSendNotification(t("Something-went-wrong")));
      });
  };
};

const createShoutAllInit = (response, message) => {
  return {
    type: actions.CREATE_SHOUTALL_INIT,
    response: response,
    message: message,
  };
};

const createShoutAllSuccess = (response, message) => {
  return {
    type: actions.CREATE_SHOUTALL_SUCCESS,
    response: response,
    message: message,
  };
};

const createShoutAllFail = (message) => {
  return {
    type: actions.CREATE_SHOUTALL_FAIL,
    message: message,
  };
};

//CreatePrivateGroup
const CreateShoutAll = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");
  return (dispatch) => {
    dispatch(createShoutAllInit());
    let form = new FormData();
    form.append("RequestMethod", createShoutAll.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CreateShoutAll(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBroadcast_01".toLowerCase()
                )
            ) {
              await dispatch(
                createShoutAllSuccess(
                  response.data.responseResult.talkResponse,
                  t("Broadcast-list-created")
                )
              );
              dispatch(
                GetAllUserChats(
                  navigate,
                  currentUserId,
                  currentOrganizationId,
                  t
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBroadcast_02".toLowerCase()
                )
            ) {
              await dispatch(
                createShoutAllSuccess(
                  response.data.responseResult.talkResponse,
                  t("Broadcast-list-not-created")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBroadcast_03".toLowerCase()
                )
            ) {
              await dispatch(createShoutAllFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(createShoutAllFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(createShoutAllFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(createShoutAllFail(t("Something-went-wrong")));
      });
  };
};

const createPrivateGroupInit = (response, message) => {
  return {
    type: actions.CREATE_PRIVATEGROUP_INIT,
    response: response,
    message: message,
  };
};

const createPrivateGroupNotification = (response, message) => {
  return {
    type: actions.CREATE_PRIVATEGROUP_NOTIFICATION,
    response: response,
    message: message,
  };
};

//CreatePrivateGroup
const CreatePrivateGroup = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(createPrivateGroupInit());
    let form = new FormData();
    form.append("RequestMethod", createTalkPrivateGroup.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CreatePrivateGroup(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertGroup_01".toLowerCase()
                )
            ) {
              await dispatch(
                createPrivateGroupNotification(t("Group-created"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertGroup_02".toLowerCase()
                )
            ) {
              await dispatch(
                createPrivateGroupNotification(t("Group-not-created"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertGroup_03".toLowerCase()
                )
            ) {
              await dispatch(
                createPrivateGroupNotification(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              createPrivateGroupNotification(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            createPrivateGroupNotification(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(createPrivateGroupNotification(t("Something-went-wrong")));
      });
  };
};

//get private group members init
const getPrivateGroupMembersInit = (response) => {
  return {
    type: actions.GET_PRIVATEGROUPMEMBERS_INIT,
    response: response,
  };
};

//get private group members success
const getPrivateGroupMembersSuccess = (response, message) => {
  return {
    type: actions.GET_PRIVATEGROUPMEMBERS_SUCCESS,
    response: response,
    message: message,
  };
};

//get private group members fail
const getPrivateGroupMembersFail = (response, message) => {
  return {
    type: actions.GET_PRIVATEGROUPMEMBERS_FAIL,
    response: response,
    message: message,
  };
};

//Get all private group members
const GetAllPrivateGroupMembers = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let Data = {
    TalkRequest: {
      GroupID: object.GroupID,
      ChannelID: parseInt(object.ChannelID),
    },
  };

  return (dispatch) => {
    dispatch(getPrivateGroupMembersInit());
    let form = new FormData();
    form.append("RequestMethod", getPrivateGroupMembers.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(GetAllPrivateGroupMembers(navigate, object, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByGroupID_01"
          ) {
            let newError = t("Messages-found");
            await dispatch(
              getPrivateGroupMembersSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByGroupID_02"
          ) {
            let newError = t("No-messages-found");
            dispatch(getPrivateGroupMembersFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_GetActiveUsersByGroupID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getPrivateGroupMembersFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getPrivateGroupMembersFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getPrivateGroupMembersFail(false, newError));
      });
  };
};

const updatePrivateGroupInit = (response, message) => {
  return {
    type: actions.UPDATE_PRIVATEGROUP_INIT,
    response: response,
    message: message,
  };
};

const updatePrivateGroupNotification = (response, message) => {
  return {
    type: actions.UPDATE_PRIVATEGROUP_NOTIFICATION,
    response: response,
    message: message,
  };
};

//Update Private Group
const UpdatePrivateGroup = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(updatePrivateGroupInit());
    let form = new FormData();
    form.append("RequestMethod", updatePrivateGroup.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdatePrivateGroup(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_ModifyGroup_01".toLowerCase()
                )
            ) {
              await dispatch(
                updatePrivateGroupInit(response, t("Group-modified"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_ModifyGroup_02".toLowerCase()
                )
            ) {
              await dispatch(
                updatePrivateGroupInit(response, t("Group-not-modified"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_ModifyGroup_03".toLowerCase()
                )
            ) {
              await dispatch(
                updatePrivateGroupNotification(
                  response,
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            await dispatch(
              updatePrivateGroupNotification(
                response,
                t("Something-went-wrong")
              )
            );
          }
        } else {
          await dispatch(
            updatePrivateGroupNotification(response, t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          updatePrivateGroupNotification(response, t("Something-went-wrong"))
        );
      });
  };
};

const MarkStarredMessageInit = () => {
  return {
    type: actions.STAR_UNSTAR_MESSAGE_INIT,
  };
};

const MarkStarredMessageNotification = (message) => {
  return {
    type: actions.STAR_UNSTAR_MESSAGE_NOTIFICATION,
    message: message,
  };
};

//Star Unstar A message
const MarkStarredUnstarredMessage = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let Data = {
    TalkRequest: {
      UserID: object.UserID,
      Message: {
        MessageID: object.MessageID,
        MessageType: object.MessageType,
        IsFlag: object.IsFlag,
      },
    },
  };
  return (dispatch) => {
    dispatch(MarkStarredMessageInit());
    let form = new FormData();
    form.append("RequestMethod", markStarredMessage.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(MarkStarredUnstarredMessage(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_SetMessageFlag_01".toLowerCase()
                )
            ) {
              await dispatch(
                MarkStarredMessageNotification(t("Message-is-marked-as-flag"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_SetMessageFlag_02".toLowerCase()
                )
            ) {
              await dispatch(
                MarkStarredMessageNotification(
                  t("Message-is-not-marked-as-flag")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_SetMessageFlag_03".toLowerCase()
                )
            ) {
              await dispatch(
                MarkStarredMessageNotification(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              MarkStarredMessageNotification(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            MarkStarredMessageNotification(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(MarkStarredMessageNotification(t("Something-went-wrong")));
      });
  };
};

const LeaveGroupInit = (response, message) => {
  return {
    type: actions.LEAVE_GROUP_INIT,
    response: response,
    message: message,
  };
};

const LeaveGroupNotification = (response, message) => {
  return {
    type: actions.LEAVE_GROUP_NOTIFICATION,
    response: response,
    message: message,
  };
};

//Star Unstar A message
const LeaveGroup = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let Data = {
    TalkRequest: {
      UserID: object.UserID,
      GroupID: object.GroupID,
    },
  };
  return (dispatch) => {
    dispatch(LeaveGroupInit());
    let form = new FormData();
    form.append("RequestMethod", leaveGroup.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(LeaveGroup(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_RemoveUserFromGroup_01".toLowerCase()
                )
            ) {
              await dispatch(LeaveGroupInit(response, t("Group-left")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_RemoveUserFromGroup_02".toLowerCase()
                )
            ) {
              await dispatch(
                LeaveGroupInit(response, t("Group-left-didnt-work"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_RemoveUserFromGroup_03".toLowerCase()
                )
            ) {
              await dispatch(LeaveGroupNotification(t("Something-went-wrong")));
            }
          } else {
            await dispatch(LeaveGroupNotification(t("Something-went-wrong")));
          }
        } else {
          await dispatch(LeaveGroupNotification(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(LeaveGroupNotification(t("Something-went-wrong")));
      });
  };
};

const ResetLeaveGroupMessage = () => {
  return {
    type: actions.RESET_LEAVE_GROUP_MESSAGE,
  };
};

const ResetGroupModify = () => {
  return {
    type: actions.RESET_GROUP_MODIFY_MESSAGE,
  };
};

const ResetShoutAllCreated = () => {
  return {
    type: actions.RESET_SHOUTALL_CREATED_MESSAGE,
  };
};

const deletShoutInit = (response) => {
  return {
    type: actions.DELETE_SHOUT_INIT,
    response: response,
  };
};

//get user chats success
const deletShoutSuccess = (response, message) => {
  return {
    type: actions.DELETE_SHOUT_SUCCESS,
    response: response,
    message: message,
  };
};

//get user chats fail
const deletShoutFail = (message) => {
  return {
    type: actions.DELETE_SHOUT_FAIL,
    message: message,
  };
};

//Get all user chats
const DeleteShout = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");
  return (dispatch) => {
    dispatch(deletShoutInit());
    let form = new FormData();
    form.append("RequestMethod", deleteShoutAll.RequestMethod);
    form.append("RequestData", JSON.stringify(object));

    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(navigate, t));
          dispatch(DeleteShout(navigate, object, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_RemoveUserFromShout_01"
          ) {
            let newError = t("Users-removed-from-broadcast-list");
            await dispatch(
              deletShoutSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
            await dispatch(chatBoxActiveFlag(false));
            await dispatch(
              GetAllUserChats(navigate, currentUserId, currentOrganizationId, t)
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_RemoveUserFromShout_02"
          ) {
            let newError = t("Users-do-not-removed-from-broadcast-list");
            dispatch(
              deletShoutSuccess(
                response.data.responseResult.talkResponse,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Talk_TalkServiceManager_RemoveUserFromShout_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(deletShoutFail(newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(deletShoutFail(newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(deletShoutFail(newError));
      });
  };
};

const updateShoutAllInit = () => {
  return {
    type: actions.UPDATE_SHOUTALL_INIT,
  };
};

const updateShoutAllSuccess = (response, message) => {
  return {
    type: actions.UPDATE_SHOUTALL_SUCCESS,
    response: response,
    message: message,
  };
};

const updateShoutAllFail = (message) => {
  return {
    type: actions.UPDATE_SHOUTALL_FAIL,
    message: message,
  };
};

//Update Shout All
const UpdateShoutAll = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");
  return (dispatch) => {
    dispatch(updateShoutAllInit());
    let form = new FormData();
    form.append("RequestMethod", updateShoutAll.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdateShoutAll(object, t, navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_UpdateBroadcast_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateShoutAllSuccess(
                  response.data.responseResult.talkResponse,
                  t("Broadcast-list-modified")
                )
              );
              await dispatch(chatBoxActiveFlag(false));
              await dispatch(
                GetAllUserChats(
                  navigate,
                  currentUserId,
                  currentOrganizationId,
                  t
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_UpdateBroadcast_02".toLowerCase()
                )
            ) {
              await dispatch(
                updateShoutAllSuccess(
                  response.data.responseResult.talkResponse,
                  t("Broadcast-list-not-modified")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_UpdateBroadcast_03".toLowerCase()
                )
            ) {
              await dispatch(updateShoutAllFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(updateShoutAllFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(updateShoutAllFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updateShoutAllFail(t("Something-went-wrong")));
      });
  };
};

const insertBulkMessagesInit = () => {
  return {
    type: actions.INSERT_BULKMESSAGES_INIT,
  };
};

const insertBulkMessagesSuccess = (response, message) => {
  return {
    type: actions.INSERT_BULKMESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

const insertBulkMessagesFail = (message) => {
  return {
    type: actions.INSERT_BULKMESSAGES_FAIL,
    message: message,
  };
};

//Update Shout All
const InsertBulkMessages = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(insertBulkMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", insertBulkMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(InsertBulkMessages(object, t, navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBulkMessages_01".toLowerCase()
                )
            ) {
              await dispatch(
                insertBulkMessagesSuccess(
                  response.data.responseResult.talkResponse,
                  t("Bulk-messages-processed")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBulkMessages_02".toLowerCase()
                )
            ) {
              await dispatch(
                insertBulkMessagesSuccess(
                  response.data.responseResult.talkResponse,
                  t("Bulk-messages-not-processed")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_InsertBulkMessages_03".toLowerCase()
                )
            ) {
              await dispatch(insertBulkMessagesFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(insertBulkMessagesFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(insertBulkMessagesFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(insertBulkMessagesFail(t("Something-went-wrong")));
      });
  };
};

const downloadChatInit = () => {
  return {
    type: actions.DOWNLOAD_CHAT_INIT,
  };
};

const downloadChatFail = (message) => {
  return {
    type: actions.DOWNLOAD_CHAT_FAIL,
    message: message,
  };
};

//Download Chat
const DownloadChat = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(downloadChatInit());
    let form = new FormData();
    form.append("RequestMethod", downloadChat.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApiReport,
      data: form,
      headers: {
        _token: token,
      },
      // responseType: "blob",
    })
      .then(async (response) => {
        console.log("Talk Chat Response", response);
        const blob = new Blob([response.data], { type: "application/txt" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ChatMessages.txt");
        document.body.appendChild(link);
        link.click();
      })
      .catch((response) => {
        dispatch(downloadChatFail(t("Something-went-wrong")));
      });
  };
};

const PrintChat = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(downloadChatInit());
    let form = new FormData();
    form.append("RequestMethod", downloadChat.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApiReport,
      data: form,
      headers: {
        _token: token,
      },
      // responseType: "blob",
    })
      .then(async (response) => {
        console.log("Talk Chat Response", response);
        const printWindow = window.open("", "_blank");
        printWindow.document.write("<pre>" + response.data + "</pre>");
        printWindow.document.close();
        printWindow.print();
      })
      .catch((response) => {
        dispatch(downloadChatFail(t("Something-went-wrong")));
      });
  };
};

const emailChatInit = () => {
  return {
    type: actions.EMAIL_CHAT_INIT,
  };
};

const emailChatSuccess = (response, message) => {
  return {
    type: actions.EMAIL_CHAT_SUCCESS,
    response: response,
    message: message,
  };
};

const emailChatFail = (message) => {
  return {
    type: actions.EMAIL_CHAT_FAIL,
    message: message,
  };
};

//Email Chat
const EmailChat = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(emailChatInit());
    let form = new FormData();
    form.append("RequestMethod", downloadChat.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApiReport,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(EmailChat(object, t, navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Talk_TalkServiceManager_EmailChat_01".toLowerCase())
            ) {
              await dispatch(
                emailChatSuccess(
                  response.data.responseResult.talkResponse,
                  t("Chat-emailed-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Talk_TalkServiceManager_EmailChat_02".toLowerCase())
            ) {
              await dispatch(
                emailChatSuccess(
                  response.data.responseResult.talkResponse,
                  t("No-data-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Talk_TalkServiceManager_EmailChat_03".toLowerCase())
            ) {
              await dispatch(emailChatFail(t("Exception")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Talk_TalkServiceManager_EmailChat_04".toLowerCase())
            ) {
              await dispatch(
                emailChatFail(t("Exception-while-writing-to-stream"))
              );
            }
          } else {
            await dispatch(emailChatFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(emailChatFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(emailChatFail(t("Something-went-wrong")));
      });
  };
};

const updateMessageAcknowledgementInit = () => {
  return {
    type: actions.UPDATE_MESSAGE_ACKNOWLEDGEMENT_INIT,
  };
};

const updateMessageAcknowledgementSuccess = (response, message) => {
  return {
    type: actions.UPDATE_MESSAGE_ACKNOWLEDGEMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const updateMessageAcknowledgementFail = (message) => {
  return {
    type: actions.UPDATE_MESSAGE_ACKNOWLEDGEMENT_FAIL,
    message: message,
  };
};

//UpdateMessageAcknowledgement
const UpdateMessageAcknowledgement = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(updateMessageAcknowledgementInit());
    let form = new FormData();
    form.append("RequestMethod", updateMessageAcknowledgement.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdateMessageAcknowledgement(object, t, navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_UpdateMessageAcknowledgement_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateMessageAcknowledgementSuccess(
                  response.data.responseResult.talkResponse,
                  t("Message-acknowledged")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_UpdateMessageAcknowledgement_02".toLowerCase()
                )
            ) {
              await dispatch(
                updateMessageAcknowledgementFail(t("Message-not-acknowledged"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_UpdateMessageAcknowledgement_03".toLowerCase()
                )
            ) {
              await dispatch(updateMessageAcknowledgementFail(t("Exception")));
            }
          } else {
            await dispatch(updateMessageAcknowledgementFail(t("Exception")));
          }
        } else {
          await dispatch(updateMessageAcknowledgementFail(t("Exception")));
        }
      })
      .catch((response) => {
        dispatch(updateMessageAcknowledgementFail(t("Exception")));
      });
  };
};

const pushMessageData = (response) => {
  return {
    type: actions.PUSH_MESSAGE_DATA,
    response: response,
  };
};

const pushChatData = (response) => {
  return {
    type: actions.PUSH_CHAT_DATA,
    response: response,
  };
};

const fileUploadData = (response) => {
  return {
    type: actions.FILE_UPLOAD_DATA,
    response: response,
  };
};

const activeMessage = (response) => {
  return {
    type: actions.ACTIVE_MESSAGE_DATA,
    response: response,
  };
};

const getAllStarredMessagesInit = () => {
  return {
    type: actions.GET_ALL_STARRED_MESSAGES_INIT,
  };
};

const getAllStarredMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_STARRED_MESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllStarredMessagesFail = (message) => {
  return {
    type: actions.GET_ALL_STARRED_MESSAGES_FAIL,
    message: message,
  };
};

//Get All Starred Messages
const GetAllStarredMessages = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllStarredMessagesInit());
    let form = new FormData();
    form.append("RequestMethod", getAllStarredMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllStarredMessages(object, t, navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_GetAllFlaggedMessages_01".toLowerCase()
                )
            ) {
              await dispatch(
                getAllStarredMessagesSuccess(
                  response.data.responseResult.talkResponse,
                  t("Flag-messages-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_GetAllFlaggedMessages_02".toLowerCase()
                )
            ) {
              await dispatch(
                getAllStarredMessagesSuccess(
                  response.data.responseResult.talkResponse,
                  t("Flag-messages-not-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_GetAllFlaggedMessages_03".toLowerCase()
                )
            ) {
              await dispatch(getAllStarredMessagesFail(t("Exception")));
            }
          } else {
            await dispatch(getAllStarredMessagesFail(t("Exception")));
          }
        } else {
          await dispatch(getAllStarredMessagesFail(t("Exception")));
        }
      })
      .catch((response) => {
        dispatch(getAllStarredMessagesFail(t("Exception")));
      });
  };
};

const downloadChatEmptyObject = (response) => {
  return {
    type: actions.DOWNLOAD_CHAT_EMPTY,
    response: response,
  };
};

//insert oto talk mqtt
const mqttGroupLeft = (response) => {
  return {
    type: actions.MQTT_GROUP_LEFT,
    response: response,
  };
};

const multipleMessagesDeletedInit = () => {
  return {
    type: actions.DELETE_MULTIPLE_MESSAGES_INIT,
  };
};

const multipleMessagesDeletedSuccess = (response, message) => {
  return {
    type: actions.DELETE_MULTIPLE_MESSAGES_SUCCESS,
    response: response,
    message: message,
  };
};

const multipleMessagesDeletedFail = (message) => {
  return {
    type: actions.DELETE_MULTIPLE_MESSAGES_FAIL,
    message: message,
  };
};

//Delete Multiple Messages
const DeleteMultipleMessages = (object, t, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(multipleMessagesDeletedInit());
    let form = new FormData();
    form.append("RequestMethod", deleteMultipleGroupMessages.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DeleteMultipleMessages(object, t, navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_DeleteMultipleMessages_01".toLowerCase()
                )
            ) {
              await dispatch(
                multipleMessagesDeletedSuccess(
                  response.data.responseResult.talkResponse,
                  t("Multiple-messages-deleted")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_DeleteMultipleMessages_02".toLowerCase()
                )
            ) {
              await dispatch(
                multipleMessagesDeletedFail(t("Multiple-messages-not-deleted"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Talk_TalkServiceManager_DeleteMultipleMessages_03".toLowerCase()
                )
            ) {
              await dispatch(multipleMessagesDeletedFail(t("Exception")));
            }
          } else {
            await dispatch(multipleMessagesDeletedFail(t("Exception")));
          }
        } else {
          await dispatch(multipleMessagesDeletedFail(t("Exception")));
        }
      })
      .catch((response) => {
        dispatch(multipleMessagesDeletedFail(t("Exception")));
      });
  };
};

const lastMessageDeletion = (response) => {
  return {
    type: actions.LAST_MESSAGE_DELETION,
    response: response,
  };
};

//get Group Messages Init
const getImageData = (response) => {
  return {
    type: actions.GET_IMAGE_DATA,
    response: response,
  };
};

const DownloadTalkFile = (navigate, Data, ext, originalFileName, t) => {
  console.log("DataDataData", Data);
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", downloadAttachmentTalk.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  let contentType;
  if (ext === "doc") {
    contentType = "application/msword";
  } else if (ext === "docx") {
    contentType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  } else if (ext === "xls") {
    contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (ext === "xlsx") {
    contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (ext === "pdf") {
    contentType = "application/pdf";
  } else if (ext === "png") {
    contentType = "image/png";
  } else if (ext === "txt") {
    contentType = "text/plain";
  } else if (ext === "jpg") {
    contentType = "image/jpeg";
  } else if (ext === "jpeg") {
    contentType = "image/jpeg";
  } else {
  }
  return (dispatch) => {
    // dispatch(DownloadLoaderStart());
    axios({
      method: "post",
      url: talkApiReport,
      data: form,
      headers: {
        _token: token,
        "Content-Disposition": "attachment; filename=template." + ext,
        // "Content-Type":
        //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Type": contentType,
      },
      responseType: "blob",
    })
      .then(async (response) => {
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DownloadTalkFile(navigate, Data, ext, t));
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", originalFileName);
          document.body.appendChild(link);
          link.click();

          // dispatch(SetLoaderFalseDownload(false));
        }
      })
      .catch((response) => {
        // dispatch(downloadFail(response));
      });
  };
};

export {
  activeChatID,
  activeMessageID,
  mqttInsertOtoMessage,
  mqttInsertPrivateGroupMessage,
  mqttInsertBroadcastMessage,
  mqttBlockUser,
  mqttUnblockUser,
  mqttStarMessage,
  mqttUnstarMessage,
  mqttGroupCreated,
  mqttGroupUpdated,
  mqttUnreadMessageCount,
  GetAllUserChats,
  GetOTOUserMessages,
  GetOTOUserUndeliveredMessages,
  GetGroupMessages,
  GetBroadcastMessages,
  GetArchivedDataByUserID,
  GetFlagMessages,
  GetFollowMessages,
  GetRecentTags,
  GetTagsMessages,
  GetMessageSentReceiveTime,
  GetRecentFlagCount,
  GetRecentFollowDataCount,
  GetAllRecentTagsCount,
  GetRecentDataArchiveCount,
  GetBlockedUsersCount,
  GetBlockedUsers,
  GetAllUsers,
  GetActiveUsersByGroupID,
  GetActiveUsersByRoomID,
  InsertOTOMessages,
  InsertPrivateGroupMessages,
  BlockUnblockUser,
  DeleteSingleMessage,
  GetAllUsersGroupsRoomsList,
  InsertBroadcastMessages,
  CreatePrivateGroup,
  CreateShoutAll,
  UpdatePrivateGroup,
  GetAllPrivateGroupMembers,
  MarkStarredUnstarredMessage,
  LeaveGroup,
  ResetLeaveGroupMessage,
  ResetGroupModify,
  ResetShoutAllCreated,
  DeleteShout,
  GetActiveUsersByBroadcastID,
  UpdateShoutAll,
  OtoMessageRetryFlag,
  InsertBulkMessages,
  DownloadChat,
  EmailChat,
  UpdateMessageAcknowledgement,
  mqttMessageStatusUpdate,
  activeChat,
  pushMessageData,
  pushChatData,
  fileUploadData,
  activeMessage,
  GetAllStarredMessages,
  mqttMessageDeleted,
  downloadChatEmptyObject,
  mqttGroupLeft,
  DeleteMultipleMessages,
  lastMessageDeletion,
  OTOMessageSendSuccess,
  PrintChat,
  getAllUserChatsSuccess,
  getImageData,
  DownloadTalkFile,
};
