import * as actions from '../action_types'
import axios from 'axios'
import { videoApi } from '../../commen/apis/Api_ends_points'
import { RefreshToken } from './Auth_action'
import {
  getAllVideoCallUsers,
  initiateVideoCall,
  videoCallResponse,
  getUserRecentCalls,
  callRequestReceived,
} from '../../commen/apis/Api_config'
import {
  normalizeVideoPanelFlag,
  videoOutgoingCallFlag,
} from './VideoFeature_actions'

const getAllVideoCallUsersInitial = () => {
  return {
    type: actions.GET_ALL_VIDEOCALL_USERS_INITIAL,
  }
}

const getAllVideoCallUsersSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_VIDEOCALL_USERS_SUCCESS,
    response: response,
    message: message,
  }
}

const getAllVideoCallUsersFail = (message) => {
  return {
    type: actions.GET_ALL_VIDEOCALL_USERS_FAIL,
    message: message,
  }
}

const GetAllVideoCallUsers = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(getAllVideoCallUsersInitial())
    let form = new FormData()
    form.append('RequestMethod', getAllVideoCallUsers.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetAllVideoCallUsers', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(GetAllVideoCallUsers(Data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_GetAllUsers_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                getAllVideoCallUsersSuccess(
                  response.data.responseResult,
                  t('Record-found'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_GetAllUsers_02'.toLowerCase(),
                )
            ) {
              await dispatch(getAllVideoCallUsersFail(t('No-records-found')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_GetAllUsers_03'.toLowerCase(),
                )
            ) {
              await dispatch(
                getAllVideoCallUsersFail(t('Something-went-wrong')),
              )
            }
          } else {
            await dispatch(getAllVideoCallUsersFail(t('Something-went-wrong')))
          }
        } else {
          await dispatch(getAllVideoCallUsersFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(getAllVideoCallUsersFail(t('Something-went-wrong')))
      })
  }
}

const initiateVideoCallInitial = () => {
  return {
    type: actions.INITIATE_VIDEO_CALL_INITIAL,
  }
}

const initiateVideoCallSuccess = (response, message) => {
  return {
    type: actions.INITIATE_VIDEO_CALL_SUCCESS,
    response: response,
    message: message,
  }
}

const initiateVideoCallFail = (message) => {
  return {
    type: actions.INITIATE_VIDEO_CALL_FAIL,
    message: message,
  }
}

const InitiateVideoCall = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(initiateVideoCallInitial())
    let form = new FormData()
    form.append('RequestMethod', initiateVideoCall.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('InitiateVideoCall', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(InitiateVideoCall(Data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_InitiateVideoCall_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                initiateVideoCallSuccess(
                  response.data.responseResult,
                  t('Call-initiated-successfully'),
                ),
              )
              await dispatch(videoOutgoingCallFlag(true))
              localStorage.setItem('initiateVideoCall', true)
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_InitiateVideoCall_02'.toLowerCase(),
                )
            ) {
              await dispatch(
                initiateVideoCallFail(t('Call-not-initiated-successfully')),
              )
              await dispatch(videoOutgoingCallFlag(false))
              await dispatch(normalizeVideoPanelFlag(false))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_InitiateVideoCall_03'.toLowerCase(),
                )
            ) {
              await dispatch(initiateVideoCallFail(t('Something-went-wrong')))
            }
          } else {
            await dispatch(initiateVideoCallFail(t('Something-went-wrong')))
          }
        } else {
          await dispatch(initiateVideoCallFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(initiateVideoCallFail(t('Something-went-wrong')))
      })
  }
}

const incomingVideoCallMQTT = (response, message) => {
  return {
    type: actions.INCOMING_VIDEO_CALL_MQTT,
    response: response,
    message: message,
  }
}

const videoCallAccepted = (response, message) => {
  return {
    type: actions.INCOMING_VIDEO_CALL_ACCEPTED_MQTT,
    response: response,
    message: message,
  }
}

const videoCallResponseInitial = () => {
  return {
    type: actions.VIDEO_CALL_RESPONSE_INITIAL,
  }
}

const videoCallResponseSuccess = (response, message) => {
  return {
    type: actions.VIDEO_CALL_RESPONSE_SUCCESS,
    response: response,
    message: message,
  }
}

const videoCallResponseFail = (message) => {
  return {
    type: actions.VIDEO_CALL_RESPONSE_FAIL,
    message: message,
  }
}

const VideoCallResponse = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(videoCallResponseInitial())
    let form = new FormData()
    form.append('RequestMethod', videoCallResponse.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('VideoCallResponse', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(VideoCallResponse(Data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_VideoCallResponse_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                videoCallResponseSuccess(
                  response.data.responseResult,
                  t('Video-Call-Status-Updated'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_VideoCallResponse_02'.toLowerCase(),
                )
            ) {
              await dispatch(
                videoCallResponseFail(t('Call-not-initiated-successfully')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_VideoCallResponse_03'.toLowerCase(),
                )
            ) {
              await dispatch(videoCallResponseFail(t('Something-went-wrong')))
            }
          } else {
            await dispatch(videoCallResponseFail(t('Something-went-wrong')))
          }
        } else {
          await dispatch(videoCallResponseFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(videoCallResponseFail(t('Something-went-wrong')))
      })
  }
}

const getVideoRecipentData = (response) => {
  return {
    type: actions.GET_VIDEO_RECIPENT_DATA,
    response: response,
  }
}

const getUserRecentCallsInitial = () => {
  return {
    type: actions.GET_ALL_RECENTCALLS_INITIAL,
  }
}

const getUserRecentCallsSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_RECENTCALLS_SUCCESS,
    response: response,
    message: message,
  }
}

const getUserRecentCallsFail = (message) => {
  return {
    type: actions.GET_ALL_RECENTCALLS_FAIL,
    message: message,
  }
}

const GetUserRecentCalls = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(getUserRecentCallsInitial())
    let form = new FormData()
    form.append('RequestMethod', getUserRecentCalls.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))

    axios({
      method: 'post',
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('GetUserRecentCalls', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(GetUserRecentCalls(Data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_GetUserRecetCalls_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                getUserRecentCallsSuccess(
                  response.data.responseResult,
                  t('Record-found'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_GetUserRecetCalls_02'.toLowerCase(),
                )
            ) {
              await dispatch(getUserRecentCallsFail(t('No-records-found')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_GetUserRecetCalls_03'.toLowerCase(),
                )
            ) {
              await dispatch(getUserRecentCallsFail(t('Something-went-wrong')))
            }
          } else {
            await dispatch(getUserRecentCallsFail(t('Something-went-wrong')))
          }
        } else {
          await dispatch(getUserRecentCallsFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(getUserRecentCallsFail(t('Something-went-wrong')))
      })
  }
}

const callRequestReceivedInitial = () => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_INITIAL,
  }
}

const callRequestReceivedSuccess = (response, message) => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_SUCCESS,
    response: response,
    message: message,
  }
}

const callRequestReceivedFail = (message) => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_FAIL,
    message: message,
  }
}

const CallRequestReceived = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(callRequestReceivedInitial())
    let form = new FormData()
    form.append('RequestMethod', callRequestReceived.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('CallRequestReceived', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(CallRequestReceived(Data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_CallRequestReceived_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                callRequestReceivedSuccess(
                  response.data.responseResult,
                  t('Record-Updated'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_CallRequestReceived_02'.toLowerCase(),
                )
            ) {
              await dispatch(callRequestReceivedFail(t('No-Record-Updated')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Video_VideoServiceManager_CallRequestReceived_03'.toLowerCase(),
                )
            ) {
              await dispatch(callRequestReceivedFail(t('Something-went-wrong')))
            }
          } else {
            await dispatch(callRequestReceivedFail(t('Something-went-wrong')))
          }
        } else {
          await dispatch(callRequestReceivedFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(callRequestReceivedFail(t('Something-went-wrong')))
      })
  }
}

const callRequestReceivedMQTT = (response, message) => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_MQTT,
    response: response,
    message: message,
  }
}

export {
  GetAllVideoCallUsers,
  InitiateVideoCall,
  incomingVideoCallMQTT,
  VideoCallResponse,
  getVideoRecipentData,
  videoCallAccepted,
  GetUserRecentCalls,
  CallRequestReceived,
  callRequestReceivedMQTT,
}
