import * as actions from '../action_types'
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
} from '../../commen/apis/Api_config'
import axios from 'axios'
import { talkApi } from '../../commen/apis/Api_ends_points'
import { signOut } from './Auth_Sign_Out'

// Refresh Token Talk Success
const refreshtokenTalkSuccess = (response, message) => {
  return {
    type: actions.REFRESH_TOKEN_TALK_SUCCESS,
    response: response,
    message: message,
  }
}

// Refresh Token Fail
const refreshtokenTalkFail = (response, message) => {
  return {
    type: actions.REFRESH_TOKEN_TALK_FAIL,
    response: response,
    message: message,
  }
}

//Refresh Tokenm
const RefreshTokenTalk = (props) => {
  // const navigate = useNavigate();
  console.log('RefreshTokenTalk', props)
  let Token = JSON.parse(localStorage.getItem('token'))
  let RefreshTokenTalk = JSON.parse(localStorage.getItem('RefreshTokenTalk'))
  console.log('RefreshTokenTalk', Token, RefreshTokenTalk)
  let Data = {
    Token: Token,
    RefreshTokenTalk: RefreshTokenTalk,
  }
  console.log('RefreshTokenTalk', Data)
  return async (dispatch) => {
    let form = new FormData()
    form.append('RequestMethod', refreshTokenTalk.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    await axios({
      method: 'post',
      url: talkApi,
      data: form,
    })
      .then(async (response) => {
        console.log('RefreshTokenTalk', response)
        if (response.data.responseCode === 200) {
          await dispatch(
            refreshtokenTalkSuccess(
              response.data.responseResult,
              'Refresh Token Update Successfully',
            ),
          )
        } else {
          console.log('RefreshTokenTalk', response)
          let message2 = 'Your Session has expired. Please login again'
          // dispatch(signOut(navigate, message2));
          await dispatch(
            refreshtokenTalkFail(
              response.data.responseResult,
              'Your Session has expired. Please login again.',
            ),
          )
        }
      })
      .catch((response) => {
        // dispatch(SomeThingWentWrong(response));
      })
  }
}

//get talk socket
const allTalkSockets = (response) => {
  console.log('responseresponseresponse', response)
  return {
    type: actions.ALL_TALK_SOCKET,
    response: response,
  }
}

//get all user chat init
const getAllUserChatsInit = (response) => {
  return {
    type: actions.GET_USERCHATS_INIT,
    response: response,
  }
}

//get user chats success
const getAllUserChatsSuccess = (response, message) => {
  return {
    type: actions.GET_USERCHATS_SUCCESS,
    response: response,
    message: message,
  }
}

//get user chats fail
const getAllUserChatsFail = (response, message) => {
  return {
    type: actions.GET_USERCHATS_FAIL,
    response: response,
    message: message,
  }
}

//Get all user chats
const GetAllUserChats = (currentUserId, currentOrganizationId, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
    },
  }
  return (dispatch) => {
    dispatch(getAllUserChatsInit())
    let form = new FormData()
    form.append('RequestMethod', getAllUserChats.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetAllUserChats', response)
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t));
          dispatch(GetAllUserChats(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentAllMessagesWithUserDetails_01'
          ) {
            let newError = t('Messages-found')
            await dispatch(
              getAllUserChatsSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentAllMessagesWithUserDetails_02'
          ) {
            let newError = t('No-messages-found')
            dispatch(getAllUserChatsFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentAllMessagesWithUserDetails_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getAllUserChatsFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getAllUserChatsFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getAllUserChatsFail(false, newError))
      })
  }
}

//get OTO user messages init
const getOTOUserMessagesInit = (response) => {
  return {
    type: actions.GET_OTOUSERMESSAGES_INIT,
    response: response,
  }
}

//get OTO user chats success
const getOTOUserMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_OTOUSERMESSAGES_SUCCESS,
    response: response,
    message: message,
  }
}

//get OTO user chats fail
const getOTOUserMessagesFail = (response, message) => {
  return {
    type: actions.GET_OTOUSERMESSAGES_FAIL,
    response: response,
    message: message,
  }
}

//Get OTO all user chats
const GetOTOUserMessages = (chatOTOData, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: parseInt(chatOTOData.UserID),
      ChannelID: parseInt(chatOTOData.ChannelID),
      OpponentUserId: chatOTOData.OpponentUserId,
      NumberOfMessages: chatOTOData.NumberOfMessages,
      OffsetMessage: chatOTOData.OffsetMessage,
    },
  }
  return (dispatch) => {
    dispatch(getOTOUserMessagesInit())
    let form = new FormData()
    form.append('RequestMethod', getUserOTOMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetOTOUserMessages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetOTOUserMessages(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetUserOTOMessages_01'
          ) {
            let newError = t('One-to-one-messages-found')
            await dispatch(
              getOTOUserMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetUserOTOMessages_02'
          ) {
            let newError = t('No-one-to-one-messages-found')
            dispatch(getOTOUserMessagesFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetUserOTOMessages_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getOTOUserMessagesFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getOTOUserMessagesFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getOTOUserMessagesFail(false, newError))
      })
  }
}

//get OTO user undelivered chat init
const getOTOUserUndeliveredMessagesInit = (response) => {
  return {
    type: actions.GET_OTOUSERUNDELIVEREDMESSAGES_INIT,
    response: response,
  }
}

//get OTO user undelivered chats success
const getOTOUserUndeliveredMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_OTOUSERUNDELIVEREDMESSAGES_SUCCESS,
    response: response,
    message: message,
  }
}

//get OTO user undelivered chats fail
const getOTOUserUndeliveredMessagesFail = (response, message) => {
  return {
    type: actions.GET_OTOUSERUNDELIVEREDMESSAGES_FAIL,
    response: response,
    message: message,
  }
}

//Get OTO undelivered user chats
const GetOTOUserUndeliveredMessages = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
      OpponentUserId: 4,
      Message: {
        MessageID: 12345,
      },
    },
  }
  return (dispatch) => {
    dispatch(getOTOUserUndeliveredMessagesInit())
    let form = new FormData()
    form.append('RequestMethod', getUndeliveredUserOTOMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetOTOUserMessages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetOTOUserUndeliveredMessages(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetUndeliveredUserOTOMessages_01'
          ) {
            let newError = t('Undelivered-OTO-messages-found')
            await dispatch(
              getOTOUserUndeliveredMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetUndeliveredUserOTOMessages_02'
          ) {
            let newError = t('Undelivered-OTO-messages-not-found')
            dispatch(getOTOUserUndeliveredMessagesFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetUndeliveredUserOTOMessages_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getOTOUserUndeliveredMessagesFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getOTOUserUndeliveredMessagesFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getOTOUserUndeliveredMessagesFail(false, newError))
      })
  }
}

//get Group Messages Init
const getGroupMessagesInit = (response) => {
  return {
    type: actions.GET_GROUPMESSAGES_INIT,
    response: response,
  }
}

//get Group Messages success
const getGroupMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_GROUPMESSAGES_SUCCESS,
    response: response,
    message: message,
  }
}

//get Group Messages fail
const getGroupMessagesFail = (response, message) => {
  return {
    type: actions.GET_GROUPMESSAGES_FAIL,
    response: response,
    message: message,
  }
}

//get Group Messages
const GetGroupMessages = (chatGroupData, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: chatGroupData.UserID,
      GroupID: chatGroupData.GroupID,
      NumberOfMessages: chatGroupData.NumberOfMessages,
      OffsetMessage: chatGroupData.OffsetMessage,
    },
  }
  return (dispatch) => {
    dispatch(getGroupMessagesInit())
    let form = new FormData()
    form.append('RequestMethod', getGroupMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetOTOUserMessages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetGroupMessages(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetGroupMessages_01'
          ) {
            let newError = t('Group-messages-found')
            await dispatch(
              getGroupMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetGroupMessages_02'
          ) {
            let newError = t('Group-messages-not-found')
            dispatch(getGroupMessagesFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetGroupMessages_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getGroupMessagesFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getGroupMessagesFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getGroupMessagesFail(false, newError))
      })
  }
}

//get Broadcast Messages Init
const getBroacastMessagesInit = (response) => {
  return {
    type: actions.GET_BROADCASTMESSAGES_INIT,
    response: response,
  }
}

//get Broadcast Messages success
const getBroacastMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_BROADCASTMESSAGES_SUCCESS,
    response: response,
    message: message,
  }
}

//get Broadcast Messages fail
const getBroacastMessagesFail = (response, message) => {
  return {
    type: actions.GET_BROADCASTMESSAGES_FAIL,
    response: response,
    message: message,
  }
}

//get Broadcast Messages
const GetBroadcastMessages = (broadcastMessagesData, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: broadcastMessagesData.UserID,
      BroadcastID: broadcastMessagesData.BroadcastID,
      NumberOfMessages: broadcastMessagesData.NumberOfMessages,
      OffsetMessage: broadcastMessagesData.OffsetMessage,
    },
  }
  return (dispatch) => {
    dispatch(getBroacastMessagesInit())
    let form = new FormData()
    form.append('RequestMethod', getBroadCastMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetBroadcastMessages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetBroadcastMessages(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBroadcastMessages_01'
          ) {
            let newError = t('Broadcast-messages-found')
            await dispatch(
              getBroacastMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBroadcastMessages_02'
          ) {
            let newError = t('Broadcast-messages-not-found')
            dispatch(getBroacastMessagesFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBroadcastMessages_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getBroacastMessagesFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getBroacastMessagesFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getBroacastMessagesFail(false, newError))
      })
  }
}

//get Archived Data by User id init
const getArchivedDataByUserIDInit = (response) => {
  return {
    type: actions.GET_ARCHIVEDDATABYUSERID_INIT,
    response: response,
  }
}

//get Archived Data by User id success
const getArchivedDataByUserIDSuccess = (response, message) => {
  return {
    type: actions.GET_ARCHIVEDDATABYUSERID_SUCCESS,
    response: response,
    message: message,
  }
}

//get Archived Data by User id fail
const getArchivedDataByUserIDFail = (response, message) => {
  return {
    type: actions.GET_ARCHIVEDDATABYUSERID_FAIL,
    response: response,
    message: message,
  }
}

//GetArchivedDataByUserID
const GetArchivedDataByUserID = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getArchivedDataByUserIDInit())
    let form = new FormData()
    form.append('RequestMethod', getArchivedDataByUserID.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetBroadcastMessages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetArchivedDataByUserID(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentArchiveDataByUserID_01'
          ) {
            let newError = t('Archive-data-found')
            await dispatch(
              getArchivedDataByUserIDSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentArchiveDataByUserID_02'
          ) {
            let newError = t('Archive-data-not-found')
            dispatch(getArchivedDataByUserIDFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentArchiveDataByUserID_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getArchivedDataByUserIDFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getArchivedDataByUserIDFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getArchivedDataByUserIDFail(false, newError))
      })
  }
}

//get flag messsages init
const getFlagMessagesInit = (response) => {
  return {
    type: actions.GET_FLAGMESSAGES_INIT,
    response: response,
  }
}

//get flag messsages success
const getFlagMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_FLAGMESSAGES_SUCCESS,
    response: response,
    message: message,
  }
}

//get flag messsages fail
const getFlagMessagesFail = (response, message) => {
  return {
    type: actions.GET_FLAGMESSAGES_FAIL,
    response: response,
    message: message,
  }
}

//get flag messsages
const GetFlagMessages = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getFlagMessagesInit())
    let form = new FormData()
    form.append('RequestMethod', getFlagMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetFlagMessages', response)
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t));
          dispatch(GetFlagMessages(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFlag_01'
          ) {
            let newError = t('Recent-flag-messages-found')
            await dispatch(
              getFlagMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFlag_02'
          ) {
            let newError = t('Recent-flag-messages-not-found')
            dispatch(getFlagMessagesFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFlag_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getFlagMessagesFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getFlagMessagesFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getFlagMessagesFail(false, newError))
      })
  }
}

//get follow messsages init
const getFollowMessagesInit = (response) => {
  return {
    type: actions.GET_FOLLOWMESSAGES_INIT,
    response: response,
  }
}

//get follow messsages success
const getFollowMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_FOLLOWMESSAGES_SUCCESS,
    response: response,
    message: message,
  }
}

//get follow messsages fail
const getFollowMessagesFail = (response, message) => {
  return {
    type: actions.GET_FOLLOWMESSAGES_FAIL,
    response: response,
    message: message,
  }
}

//get follow messsages
const GetFollowMessages = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getFollowMessagesInit())
    let form = new FormData()
    form.append('RequestMethod', getFollowMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetFollowMessages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetFollowMessages(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFollowDataByUserID_01'
          ) {
            let newError = t('Recent-follow-messages-found')
            await dispatch(
              getFollowMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFollowDataByUserID_02'
          ) {
            let newError = t('Recent-follow-messages-not-found')
            dispatch(getFollowMessagesFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFollowDataByUserID_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getFollowMessagesFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getFollowMessagesFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getFollowMessagesFail(false, newError))
      })
  }
}

//get recent tags init
const getRecentTagsInit = (response) => {
  return {
    type: actions.GET_RECENTTAGS_INIT,
    response: response,
  }
}

//get recent tags success
const getRecentTagsSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTTAGS_SUCCESS,
    response: response,
    message: message,
  }
}

//get recent tags fail
const getRecentTagsFail = (response, message) => {
  return {
    type: actions.GET_RECENTTAGS_FAIL,
    response: response,
    message: message,
  }
}

//get recent tags
const GetRecentTags = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getRecentTagsInit())
    let form = new FormData()
    form.append('RequestMethod', getAllRecentTags.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetRecentTags', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentTags(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllRecentTags_01'
          ) {
            let newError = t('Recent-tag-messages-found')
            await dispatch(
              getRecentTagsSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllRecentTags_02'
          ) {
            let newError = t('Recent-tag-messages-not-found')
            dispatch(getRecentTagsFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllRecentTags_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getRecentTagsFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getRecentTagsFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getRecentTagsFail(false, newError))
      })
  }
}

//get tags messages init
const getTagsMessagesInit = (response) => {
  return {
    type: actions.GET_TAGSMESSAGES_INIT,
    response: response,
  }
}

//get tags messages success
const getTagsMessagesSuccess = (response, message) => {
  return {
    type: actions.GET_TAGSMESSAGES_SUCCESS,
    response: response,
    message: message,
  }
}

//get tags messages fail
const getTagsMessagesFail = (response, message) => {
  return {
    type: actions.GET_TAGSMESSAGES_FAIL,
    response: response,
    message: message,
  }
}

//get tags messages
const GetTagsMessages = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
      Tag: 'inbox',
      TagID: 42,
    },
  }
  return (dispatch) => {
    dispatch(getTagsMessagesInit())
    let form = new FormData()
    form.append('RequestMethod', getTagsMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetTagsMessages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetTagsMessages(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetTagsMessages_01'
          ) {
            let newError = t('Users-tag-messages-found')
            await dispatch(
              getTagsMessagesSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetTagsMessages_02'
          ) {
            let newError = t('Users-tag-messages-not-found')
            dispatch(getTagsMessagesFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetTagsMessages_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getTagsMessagesFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getTagsMessagesFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getTagsMessagesFail(false, newError))
      })
  }
}

//get message send receive time init
const getMessageSentReceiveTimeInit = (response) => {
  return {
    type: actions.GET_MESSAGESENTRECEIVETIME_INIT,
    response: response,
  }
}

//get message send receive time success
const getMessageSentReceiveTimeSuccess = (response, message) => {
  return {
    type: actions.GET_MESSAGESENTRECEIVETIME_SUCCESS,
    response: response,
    message: message,
  }
}

//get message send receive time fail
const getMessageSentReceiveTimeFail = (response, message) => {
  return {
    type: actions.GET_MESSAGESENTRECEIVETIME_FAIL,
    response: response,
    message: message,
  }
}

//get message send receive time
const GetMessageSentReceiveTime = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      Message: {
        MessageID: 5270,
      },
    },
  }
  return (dispatch) => {
    dispatch(getMessageSentReceiveTimeInit())
    let form = new FormData()
    form.append('RequestMethod', getMessageSentReceivedTime.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetMessageSentReceiveTime', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetMessageSentReceiveTime(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetSentReceiveSeenTime_01'
          ) {
            let newError = t('Message-timestamps-found')
            await dispatch(
              getMessageSentReceiveTimeSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetSentReceiveSeenTime_02'
          ) {
            let newError = t('Message-timestamps-not-found')
            dispatch(getMessageSentReceiveTimeFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetSentReceiveSeenTime_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getMessageSentReceiveTimeFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getMessageSentReceiveTimeFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getMessageSentReceiveTimeFail(false, newError))
      })
  }
}

//get recent flag count init
const getRecentFlagCountInit = (response) => {
  return {
    type: actions.GET_RECENTFLAGCOUNT_INIT,
    response: response,
  }
}

//get recent flag count success
const getRecentFlagCountSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTFLAGCOUNT_SUCCESS,
    response: response,
    message: message,
  }
}

//get recent flag count fail
const getRecentFlagCountFail = (response, message) => {
  return {
    type: actions.GET_RECENTFLAGCOUNT_FAIL,
    response: response,
    message: message,
  }
}

//get recent flag count
const GetRecentFlagCount = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getRecentFlagCountInit())
    let form = new FormData()
    form.append('RequestMethod', getRecentFlagCount.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetRecentFlagCount', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentFlagCount(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFlagCount_01'
          ) {
            let newError = t('Recent-flag-messages-found')
            await dispatch(
              getRecentFlagCountSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFlagCount_02'
          ) {
            let newError = t('Recent-flag-messages-not-found')
            dispatch(getRecentFlagCountFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFlagCount_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getRecentFlagCountFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getRecentFlagCountFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getRecentFlagCountFail(false, newError))
      })
  }
}

//getRecentFollowDataCount init
const getRecentFollowDataCountInit = (response) => {
  return {
    type: actions.GET_RECENTFOLLOWDATACOUNT_INIT,
    response: response,
  }
}

//getRecentFollowDataCount success
const getRecentFollowDataCountSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTFOLLOWDATACOUNT_SUCCESS,
    response: response,
    message: message,
  }
}

//getRecentFollowDataCount fail
const getRecentFollowDataCountFail = (response, message) => {
  return {
    type: actions.GET_RECENTFOLLOWDATACOUNT_FAIL,
    response: response,
    message: message,
  }
}

//GetRecentFollowDataCount
const GetRecentFollowDataCount = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getRecentFollowDataCountInit())
    let form = new FormData()
    form.append('RequestMethod', getRecentFollowDataCountByUserID.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetRecentFollowDataCount', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentFollowDataCount(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFollowDataCountByUserID_01'
          ) {
            let newError = t('Recent-follow-messages-found')
            await dispatch(
              getRecentFollowDataCountSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFollowDataCountByUserID_02'
          ) {
            let newError = t('Recent-follow-messages-not-found')
            dispatch(getRecentFollowDataCountFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentFollowDataCountByUserID_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getRecentFollowDataCountFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getRecentFollowDataCountFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getRecentFollowDataCountFail(false, newError))
      })
  }
}

//getAllRecentTagsCount init
const getAllRecentTagsCountInit = (response) => {
  return {
    type: actions.GET_ALLRECENTTAGSCOUNT_INIT,
    response: response,
  }
}

//getAllRecentTagsCount success
const getAllRecentTagsCountSuccess = (response, message) => {
  return {
    type: actions.GET_ALLRECENTTAGSCOUNT_SUCCESS,
    response: response,
    message: message,
  }
}

//getAllRecentTagsCount fail
const getAllRecentTagsCountFail = (response, message) => {
  return {
    type: actions.GET_ALLRECENTTAGSCOUNT_FAIL,
    response: response,
    message: message,
  }
}

//getAllRecentTagsCount
const GetAllRecentTagsCount = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getAllRecentTagsCountInit())
    let form = new FormData()
    form.append('RequestMethod', getAllRecentTagsCount.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetAllRecentTagsCount', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetAllRecentTagsCount(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllRecentTagsCount_01'
          ) {
            let newError = t('Recent-tag-messages-found')
            await dispatch(
              getAllRecentTagsCountSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllRecentTagsCount_02'
          ) {
            let newError = t('Recent-tag-messages-not-found')
            dispatch(getAllRecentTagsCountFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllRecentTagsCount_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getAllRecentTagsCountFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getAllRecentTagsCountFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getAllRecentTagsCountFail(false, newError))
      })
  }
}

//getRecentDataArchiveCount init
const getRecentDataArchiveCountInit = (response) => {
  return {
    type: actions.GET_RECENTDATAARCHIVECOUNT_INIT,
    response: response,
  }
}

//getRecentDataArchiveCount success
const getRecentDataArchiveCountSuccess = (response, message) => {
  return {
    type: actions.GET_RECENTDATAARCHIVECOUNT_SUCCESS,
    response: response,
    message: message,
  }
}

//getRecentDataArchiveCount fail
const getRecentDataArchiveCountFail = (response, message) => {
  return {
    type: actions.GET_RECENTDATAARCHIVECOUNT_FAIL,
    response: response,
    message: message,
  }
}

//getRecentDataArchiveCount
const GetRecentDataArchiveCount = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getRecentDataArchiveCountInit())
    let form = new FormData()
    form.append(
      'RequestMethod',
      getRecentArchiveDataCountByUserID.RequestMethod,
    )
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetRecentDataArchiveCount', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetRecentDataArchiveCount(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentArchiveDataCountByUserID_01'
          ) {
            let newError = t('Recent-archive-messages-found')
            await dispatch(
              getRecentDataArchiveCountSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentArchiveDataCountByUserID_02'
          ) {
            let newError = t('Recent-archive-messages-not-found')
            dispatch(getRecentDataArchiveCountFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetRecentArchiveDataCountByUserID_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getRecentDataArchiveCountFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getRecentDataArchiveCountFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getRecentDataArchiveCountFail(false, newError))
      })
  }
}

//getBlockedUsersCountInit init
const getBlockedUsersCountInit = (response) => {
  return {
    type: actions.GET_BLOCKEDUSERSCOUNT_INIT,
    response: response,
  }
}

//getBlockedUsersCountSuccess success
const getBlockedUsersCountSuccess = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERSCOUNT_SUCCESS,
    response: response,
    message: message,
  }
}

//getBlockedUsersCountCount fail
const getBlockedUsersCountFail = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERSCOUNT_FAIL,
    response: response,
    message: message,
  }
}

//GetBlockedUsersCount
const GetBlockedUsersCount = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getBlockedUsersCountInit())
    let form = new FormData()
    form.append('RequestMethod', getBlockedUsersCount.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetBlockedUsersCount', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetBlockedUsersCount(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBlockedUsersCount_01'
          ) {
            let newError = t('Blocked-users-found')
            await dispatch(
              getBlockedUsersCountSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBlockedUsersCount_02'
          ) {
            let newError = t('Blocked-users-not-found')
            dispatch(getBlockedUsersCountFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBlockedUsersCount_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getBlockedUsersCountFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getBlockedUsersCountFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getBlockedUsersCountFail(false, newError))
      })
  }
}

//getBlockedUsersInit
const getBlockedUsersInit = (response) => {
  return {
    type: actions.GET_BLOCKEDUSERSCOUNT_INIT,
    response: response,
  }
}

//getBlockedUsersSuccess
const getBlockedUsersSuccess = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERS_SUCCESS,
    response: response,
    message: message,
  }
}

//getBlockedUsersFail
const getBlockedUsersFail = (response, message) => {
  return {
    type: actions.GET_BLOCKEDUSERS_FAIL,
    response: response,
    message: message,
  }
}

//GetBlockedUsers
const GetBlockedUsers = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getBlockedUsersInit())
    let form = new FormData()
    form.append('RequestMethod', getBlockedUsers.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetBlockedUsers', response)
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t));
          dispatch(GetBlockedUsers(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBlockedUsers_01'
          ) {
            let newError = t('Blocked-users-found')
            await dispatch(
              getBlockedUsersSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBlockedUsers_02'
          ) {
            let newError = t('Blocked-users-not-found')
            dispatch(getBlockedUsersFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetBlockedUsers_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getBlockedUsersFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getBlockedUsersFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getBlockedUsersFail(false, newError))
      })
  }
}

//getAllUsersInit
const getAllUsersInit = (response) => {
  return {
    type: actions.GET_ALLUSERS_INIT,
    response: response,
  }
}

//getAllUsersSuccess
const getAllUsersSuccess = (response, message) => {
  return {
    type: actions.GET_ALLUSERS_SUCCESS,
    response: response,
    message: message,
  }
}

//getAllUsersFail
const getAllUsersFail = (response, message) => {
  return {
    type: actions.GET_ALLUSERS_FAIL,
    response: response,
    message: message,
  }
}

//GetAllUsers
const GetAllUsers = (currentUserId, currentOrganizationId, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getAllUsersInit())
    let form = new FormData()
    form.append('RequestMethod', getAllUsers.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetAllUsers', response)
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t));
          dispatch(GetAllUsers(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllUsers_01'
          ) {
            let newError = t('Users-Found')
            await dispatch(
              getAllUsersSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllUsers_02'
          ) {
            let newError = t('Users-not-found')
            dispatch(getAllUsersFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllUsers_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getAllUsersFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getAllUsersFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getAllUsersFail(false, newError))
      })
  }
}

//getAllUsersGroupsRoomsListInit
const getAllUsersGroupsRoomsListInit = (response) => {
  return {
    type: actions.GET_ALLUSERSGROUPSROOMSLIST_INIT,
    response: response,
  }
}

//getAllUsersGroupsRoomsListSuccess
const getAllUsersGroupsRoomsListSuccess = (response, message) => {
  return {
    type: actions.GET_ALLUSERSGROUPSROOMSLIST_SUCCESS,
    response: response,
    message: message,
  }
}

//getAllUsersGroupsRoomsListFail
const getAllUsersGroupsRoomsListFail = (response, message) => {
  return {
    type: actions.GET_ALLUSERSGROUPSROOMSLIST_FAIL,
    response: response,
    message: message,
  }
}

//GetAllUsersGroupsRoomsList
const GetAllUsersGroupsRoomsList = (
  currentUserId,
  currentOrganizationId,
  t,
) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      UserID: 5,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getAllUsersGroupsRoomsListInit())
    let form = new FormData()
    form.append('RequestMethod', getAllUsersGroupsRoomsList.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetAllUsersGroupsRoomsList', response)
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshTokenTalk(t));
          dispatch(GetAllUsersGroupsRoomsList(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllUsersGroupsRoomsList_01'
          ) {
            let newError = t('Users-groups-rooms-&-lists-found')
            await dispatch(
              getAllUsersGroupsRoomsListSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllUsersGroupsRoomsList_02'
          ) {
            let newError = t('Users-groups-rooms-&-lists-not-found')
            dispatch(getAllUsersGroupsRoomsListFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetAllUsersGroupsRoomsList_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getAllUsersGroupsRoomsListFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getAllUsersGroupsRoomsListFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getAllUsersGroupsRoomsListFail(false, newError))
      })
  }
}

//getActiveUsersByGroupIDInit
const getActiveUsersByGroupIDInit = (response) => {
  return {
    type: actions.GET_ACTIVEUSERSBYGROUPID_INIT,
    response: response,
  }
}

//getActiveUsersByGroupIDSuccess
const getActiveUsersByGroupIDSuccess = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYGROUPID_SUCCESS,
    response: response,
    message: message,
  }
}

//getActiveUsersByGroupIDFail
const getActiveUsersByGroupIDFail = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYGROUPID_FAIL,
    response: response,
    message: message,
  }
}

//GetActiveUsersByGroupID
const GetActiveUsersByGroupID = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      GroupID: 14,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getActiveUsersByGroupIDInit())
    let form = new FormData()
    form.append('RequestMethod', getActiveUsersByGroupID.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetActiveUsersByGroupID', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetActiveUsersByGroupID(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByGroupID_01'
          ) {
            let newError = t('Groups-active-users-found')
            await dispatch(
              getActiveUsersByGroupIDSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByGroupID_02'
          ) {
            let newError = t('Groups-active-users-not-found')
            dispatch(getActiveUsersByGroupIDFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByGroupID_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getActiveUsersByGroupIDFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getActiveUsersByGroupIDFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getActiveUsersByGroupIDFail(false, newError))
      })
  }
}

//getActiveUsersByRoomIDInit
const getActiveUsersByRoomIDInit = (response) => {
  return {
    type: actions.GET_ACTIVEUSERSBYROOMID_INIT,
    response: response,
  }
}

//getActiveUsersByRoomIDSuccess
const getActiveUsersByRoomIDSuccess = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYROOMID_SUCCESS,
    response: response,
    message: message,
  }
}

//getActiveUsersByRoomIDFail
const getActiveUsersByRoomIDFail = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYROOMID_FAIL,
    response: response,
    message: message,
  }
}

//GetActiveUsersByRoomID
const GetActiveUsersByRoomID = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      RoomId: 324,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getActiveUsersByRoomIDInit())
    let form = new FormData()
    form.append('RequestMethod', getActiveUsersByRoomID.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetActiveUsersByRoomID', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetActiveUsersByRoomID(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByRoomID_01'
          ) {
            let newError = t('Rooms-active-users-found')
            await dispatch(
              getActiveUsersByRoomIDSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByRoomID_02'
          ) {
            let newError = t('Rooms-active-users-not-found')
            dispatch(getActiveUsersByRoomIDFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByRoomID_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getActiveUsersByRoomIDFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getActiveUsersByRoomIDFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getActiveUsersByRoomIDFail(false, newError))
      })
  }
}

//getActiveUsersByBroadcastIDInit
const getActiveUsersByBroadcastIDInit = (response) => {
  return {
    type: actions.GET_ACTIVEUSERSBYBROADCASTID_INIT,
    response: response,
  }
}

//getActiveUsersByBroadcastIDSuccess
const getActiveUsersByBroadcastIDSuccess = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYBROADCASTID_SUCCESS,
    response: response,
    message: message,
  }
}

//getActiveUsersByBroadcastIDFail
const getActiveUsersByBroadcastIDFail = (response, message) => {
  return {
    type: actions.GET_ACTIVEUSERSBYBROADCASTID_FAIL,
    response: response,
    message: message,
  }
}

//GetActiveUsersByBroadcastID
const GetActiveUsersByBroadcastID = (t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let Data = {
    TalkRequest: {
      BroadcastID: 2,
      ChannelID: 1,
    },
  }
  return (dispatch) => {
    dispatch(getActiveUsersByBroadcastIDInit())
    let form = new FormData()
    form.append('RequestMethod', getActiveUsersByBroadcastID.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetActiveUsersByBroadcastID', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshTokenTalk(t))
          dispatch(GetActiveUsersByBroadcastID(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByBroadcastID_01'
          ) {
            let newError = t('Broadcasts-active-users-found')
            await dispatch(
              getActiveUsersByBroadcastIDSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByBroadcastID_02'
          ) {
            let newError = t('Broadcasts-active-users-not-found')
            dispatch(getActiveUsersByBroadcastIDFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_GetActiveUsersByBroadcastID_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(getActiveUsersByBroadcastIDFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(getActiveUsersByBroadcastIDFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(getActiveUsersByBroadcastIDFail(false, newError))
      })
  }
}

const OTOMessageSendInit = () => {
  return {
    type: actions.OTO_MESSAGESEND_INIT,
  }
}

const OTOMessageSendNotification = (message) => {
  return {
    type: actions.OTO_MESSAGESEND_NOTIFICATION,
    message: message,
  }
}

//Insert OTO Messages
const InsertOTOMessages = (object, fileUploadData, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  console.log('InsertOTOMessages', object, fileUploadData)
  return (dispatch) => {
    dispatch(OTOMessageSendInit())
    let form = new FormData()
    form.append('RequestMethod', insertOTOMessages.RequestMethod)
    form.append('RequestData', JSON.stringify(object))
    form.append('Files', fileUploadData)
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshToken(t));
          dispatch(InsertOTOMessages(object, fileUploadData, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertOTOMessages_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                OTOMessageSendNotification(t('OTO-message-inserted')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertOTOMessages_02'.toLowerCase(),
                )
            ) {
              await dispatch(
                OTOMessageSendNotification(t('User-is-not-in-channel')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertOTOMessages_03'.toLowerCase(),
                )
            ) {
              await dispatch(OTOMessageSendNotification(t('User-is-blocked')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertOTOMessages_04'.toLowerCase(),
                )
            ) {
              await dispatch(
                OTOMessageSendNotification(t('OTO-message-not-inserted')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertOTOMessages_05'.toLowerCase(),
                )
            ) {
              await dispatch(
                OTOMessageSendNotification(t('Something-went-wrong')),
              )
            }
          } else {
            await dispatch(
              OTOMessageSendNotification(t('Something-went-wrong')),
            )
          }
        } else {
          await dispatch(OTOMessageSendNotification(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(OTOMessageSendNotification(t('Something-went-wrong')))
      })
  }
}

const GroupPrivateMessageSendInit = () => {
  return {
    type: actions.PRIVATEGROUP_MESSAGESEND_INIT,
  }
}

const GroupPrivateSendNotification = (message) => {
  return {
    type: actions.PRIVATEGROUP_MESSAGESEND_NOTIFICATION,
    message: message,
  }
}

//Insert Private Group Messages
const InsertPrivateGroupMessages = (object, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(GroupPrivateMessageSendInit())
    let form = new FormData()
    form.append('RequestMethod', insertPrivateGroupMessage.RequestMethod)
    form.append('RequestData', JSON.stringify(object))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshToken(t));
          dispatch(InsertPrivateGroupMessages(object, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertGroupMessage_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                GroupPrivateSendNotification(t('Group-message-inserted')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertGroupMessage_02'.toLowerCase(),
                )
            ) {
              await dispatch(
                GroupPrivateSendNotification(t('Group-message-not-inserted')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertGroupMessage_03'.toLowerCase(),
                )
            ) {
              await dispatch(
                GroupPrivateSendNotification(t('Something-went-wrong')),
              )
            }
          } else {
            await dispatch(
              GroupPrivateSendNotification(t('Something-went-wrong')),
            )
          }
        } else {
          await dispatch(
            GroupPrivateSendNotification(t('Something-went-wrong')),
          )
        }
      })
      .catch((response) => {
        dispatch(GroupPrivateSendNotification(t('Something-went-wrong')))
      })
  }
}

const BlockUnblockUserInit = () => {
  return {
    type: actions.BLOCK_UNBLOCK_USER_INIT,
  }
}

const BlockUnblockUserNotification = (message) => {
  return {
    type: actions.BLOCK_UNBLOCK_USER_NOTIFICATION,
    message: message,
  }
}

//Block Unblock a user
const BlockUnblockUser = (object, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  console.log('Blocked User', object)
  let Data = {
    TalkRequest: {
      UserID: object.senderID,
      OpponentUserId: object.opponentUserId,
      ChannelID: object.channelID,
    },
  }
  return (dispatch) => {
    dispatch(BlockUnblockUserInit())
    let form = new FormData()
    form.append('RequestMethod', blockUnblockUser.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshToken(t));
          dispatch(BlockUnblockUser(object, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_BlockUnBlockUser_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                BlockUnblockUserNotification(t('User-is-blocked-or-unblocked')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_BlockUnBlockUser_02'.toLowerCase(),
                )
            ) {
              await dispatch(
                BlockUnblockUserNotification(
                  t('User-is-not-blocked-or-unblocked'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_BlockUnBlockUser_03'.toLowerCase(),
                )
            ) {
              await dispatch(
                BlockUnblockUserNotification(t('Something-went-wrong')),
              )
            }
          } else {
            await dispatch(
              BlockUnblockUserNotification(t('Something-went-wrong')),
            )
          }
        } else {
          await dispatch(
            BlockUnblockUserNotification(t('Something-went-wrong')),
          )
        }
      })
      .catch((response) => {
        dispatch(BlockUnblockUserNotification(t('Something-went-wrong')))
      })
  }
}

const deleteSingleMessageInit = () => {
  return {
    type: actions.DELETE_SINGLEMESSAGE_INIT,
  }
}

const deleteSingleMessageSuccess = (response, message) => {
  return {
    type: actions.DELETE_SINGLEMESSAGE_SUCCESS,
    response: response,
    message: message,
  }
}

const deleteSingleMessageFail = (message) => {
  return {
    type: actions.DELETE_SINGLEMESSAGE_FAIL,
    message: message,
  }
}

const DeleteSingleMessage = (object, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  console.log('DeleteSingleMessage', object)
  let data = {
    TalkRequest: {
      UserID: 5,
      Message: {
        MessageID: object.MessageIds,
        MessageType: object.MessageType,
      },
    },
  }
  return (dispatch) => {
    dispatch(deleteSingleMessageInit())
    let form = new FormData()
    form.append('RequestMethod', deleteSingleMessage.RequestMethod)
    form.append('RequestData', JSON.stringify(data))

    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('DeleteSingleMessage', response)
        if (response.data.responseCode === 417) {
          dispatch(DeleteSingleMessage(t))
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_SetMessageDelete_01'
          ) {
            let newError = t('Message-deleted')
            await dispatch(
              deleteSingleMessageSuccess(
                response.data.responseResult.talkResponse,
                newError,
              ),
            )
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_SetMessageDelete_02'
          ) {
            let newError = t('Message-not-deleted')
            dispatch(deleteSingleMessageFail(false, newError))
          } else if (
            response.data.responseResult.responseMessage ===
            'Talk_TalkServiceManager_SetMessageDelete_03'
          ) {
            let newError = t('Something-went-wrong')
            dispatch(deleteSingleMessageFail(true, newError))
          }
        } else {
          let newError = t('Something-went-wrong')
          dispatch(deleteSingleMessageFail(false, newError))
        }
      })
      .catch((response) => {
        let newError = t('Something-went-wrong')
        dispatch(deleteSingleMessageFail(false, newError))
      })
  }
}

const broadcastMessageSendInit = () => {
  return {
    type: actions.BROADCAST_MESSAGESEND_INIT,
  }
}

const broadcastMessageSendNotification = (message) => {
  return {
    type: actions.BROADCAST_MESSAGESEND_NOTIFICATION,
    message: message,
  }
}

//Insert Private Group Messages
const InsertBroadcastMessages = (object, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(broadcastMessageSendInit())
    let form = new FormData()
    form.append('RequestMethod', insertBroadcastMessage.RequestMethod)
    form.append('RequestData', JSON.stringify(object))
    axios({
      method: 'post',
      url: talkApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshToken(t));
          dispatch(InsertBroadcastMessages(object, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertBroadcastMessage_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                broadcastMessageSendNotification(
                  t('Broadcast-message-inserted'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertBroadcastMessage_02'.toLowerCase(),
                )
            ) {
              await dispatch(
                broadcastMessageSendNotification(
                  t('Broadcast-message-not-inserted'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Talk_TalkServiceManager_InsertBroadcastMessage_03'.toLowerCase(),
                )
            ) {
              await dispatch(
                broadcastMessageSendNotification(t('Something-went-wrong')),
              )
            }
          } else {
            await dispatch(
              broadcastMessageSendNotification(t('Something-went-wrong')),
            )
          }
        } else {
          await dispatch(
            broadcastMessageSendNotification(t('Something-went-wrong')),
          )
        }
      })
      .catch((response) => {
        dispatch(broadcastMessageSendNotification(t('Something-went-wrong')))
      })
  }
}

export {
  allTalkSockets,
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
}
