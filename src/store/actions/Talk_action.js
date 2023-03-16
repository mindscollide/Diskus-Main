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
} from "../../commen/apis/Api_config";
import axios from "axios";
import { talkApi } from "../../commen/apis/Api_ends_points";
import { signOut } from "./Auth_Sign_Out";

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
  const navigate = useNavigate();
  console.log("RefreshTokenTalk", props);
  let Token = JSON.parse(localStorage.getItem("token"));
  let RefreshTokenTalk = JSON.parse(localStorage.getItem("RefreshTokenTalk"));
  console.log("RefreshTokenTalk", Token, RefreshTokenTalk);
  let Data = {
    Token: Token,
    RefreshTokenTalk: RefreshTokenTalk,
  };
  console.log("RefreshTokenTalk", Data);
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
        console.log("RefreshTokenTalk", response);
        if (response.data.responseCode === 200) {
          await dispatch(
            refreshtokenTalkSuccess(
              response.data.responseResult,
              "Refresh Token Update Successfully"
            )
          );
        } else {
          console.log("RefreshTokenTalk", response);
          let message2 = "Your Session has expired. Please login again";
          dispatch(signOut(navigate, message2));
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
const GetAllUserChats = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      // ChannelID: 1
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
        console.log("GetAllUserChats", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetAllUserChats(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getAllUserChatsSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getAllUserChatsFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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

//get OTO user chats fail
const getOTOUserMessagesFail = (response, message) => {
  return {
    type: actions.GET_OTOUSERMESSAGES_FAIL,
    response: response,
    message: message,
  };
};

//Get OTO all user chats
const GetOTOUserMessages = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      // "ChannelID": 1,
      OpponentUserId: 4,
      NumberOfMessages: 10,
      OffsetMessage: 5,
    },
  };
  return (dispatch) => {
    dispatch(getOTOUserMessagesInit());
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
        console.log("GetOTOUserMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetOTOUserMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getOTOUserMessagesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getOTOUserMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getOTOUserMessagesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getOTOUserMessagesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getOTOUserMessagesFail(false, newError));
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
        console.log("GetOTOUserMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetOTOUserUndeliveredMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getOTOUserUndeliveredMessagesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getOTOUserUndeliveredMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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
const GetGroupMessages = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      GroupID: 5,
      NumberOfMessages: 3,
      OffsetMessage: 5,
    },
  };
  return (dispatch) => {
    dispatch(getGroupMessagesInit());
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
        console.log("GetOTOUserMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetGroupMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getGroupMessagesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getGroupMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getGroupMessagesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getGroupMessagesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getGroupMessagesFail(false, newError));
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
const GetBroadcastMessages = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      BroadcastID: 18,
      NumberOfMessages: 10,
      OffsetMessage: 5,
    },
  };
  return (dispatch) => {
    dispatch(getBroacastMessagesInit());
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
        console.log("GetBroadcastMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetBroadcastMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getBroacastMessagesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getBroacastMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getBroacastMessagesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getBroacastMessagesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getBroacastMessagesFail(false, newError));
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
      // ChannelID: 1,
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
        console.log("GetBroadcastMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetArchivedDataByUserID(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getArchivedDataByUserIDSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getArchivedDataByUserIDFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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
const GetFlagMessages = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
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
        console.log("GetFlagMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetFlagMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getFlagMessagesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getFlagMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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
        console.log("GetFollowMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetFollowMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getFollowMessagesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getFollowMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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
        console.log("GetRecentTags", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetRecentTags(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getRecentTagsSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getRecentTagsFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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
        console.log("GetTagsMessages", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetTagsMessages(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getTagsMessagesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getTagsMessagesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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
        console.log("GetMessageSentReceiveTime", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetMessageSentReceiveTime(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getMessageSentReceiveTimeSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getMessageSentReceiveTimeFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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
        console.log("GetRecentFlagCount", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t));
          dispatch(GetRecentFlagCount(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getRecentFlagCountSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-record-found");
            dispatch(getRecentFlagCountFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
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

export {
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
};
