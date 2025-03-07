import * as actions from "../action_types";
import axios from "axios";
import { videoApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import {
  getAllVideoCallUsers,
  initiateVideoCall,
  videoCallResponse,
  getUserRecentCalls,
  callRequestReceived,
  getUserMissedCallCount,
  leaveCall,
} from "../../commen/apis/Api_config";
import {
  getParticipantMeetingJoinMainApi,
  incomingVideoCallFlag,
  leavePresenterJoinOneToOneOrOtherCall,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  nonMeetingVideoGlobalModal,
  normalizeVideoPanelFlag,
  videoOutgoingCallFlag,
} from "./VideoFeature_actions";

const getAllVideoCallUsersInitial = () => {
  return {
    type: actions.GET_ALL_VIDEOCALL_USERS_INITIAL,
  };
};

const getAllVideoCallUsersSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_VIDEOCALL_USERS_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllVideoCallUsersFail = (message) => {
  return {
    type: actions.GET_ALL_VIDEOCALL_USERS_FAIL,
    message: message,
  };
};

const GetAllVideoCallUsers = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllVideoCallUsersInitial());
    let form = new FormData();
    form.append("RequestMethod", getAllVideoCallUsers.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllVideoCallUsers(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetAllUsers_01".toLowerCase()
                )
            ) {
              await dispatch(
                getAllVideoCallUsersSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetAllUsers_02".toLowerCase()
                )
            ) {
              await dispatch(getAllVideoCallUsersFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetAllUsers_03".toLowerCase()
                )
            ) {
              await dispatch(
                getAllVideoCallUsersFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(getAllVideoCallUsersFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getAllVideoCallUsersFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllVideoCallUsersFail(t("Something-went-wrong")));
      });
  };
};

const initiateVideoCallInitial = () => {
  return {
    type: actions.INITIATE_VIDEO_CALL_INITIAL,
  };
};

const initiateVideoCallSuccess = (response, message) => {
  return {
    type: actions.INITIATE_VIDEO_CALL_SUCCESS,
    response: response,
    message: message,
  };
};

const initiateVideoCallFail = (message) => {
  return {
    type: actions.INITIATE_VIDEO_CALL_FAIL,
    message: message,
  };
};

const InitiateVideoCall = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(initiateVideoCallInitial());
    let form = new FormData();
    form.append("RequestMethod", initiateVideoCall.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(InitiateVideoCall(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_InitiateVideoCall_01".toLowerCase()
                )
            ) {
              await dispatch(
                initiateVideoCallSuccess(
                  response.data.responseResult,
                  t("Call-initiated-successfully")
                )
              );
              await dispatch(videoOutgoingCallFlag(true));
              const meetingHost = {
                isHost: false,
                isHostId: 0,
                isDashboardVideo: false,
              };
              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
              localStorage.setItem("initiateVideoCall", true);
              localStorage.setItem("meetingTitle", "");
              if (Data.CallTypeID === 2) {
                localStorage.setItem(
                  "RecipentIDsOninitiateVideoCall",
                  JSON.stringify(Data.RecipentIDs)
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_InitiateVideoCall_02".toLowerCase()
                )
            ) {
              await dispatch(
                initiateVideoCallFail(t("Call-not-initiated-successfully"))
              );
              await dispatch(videoOutgoingCallFlag(false));
              await dispatch(normalizeVideoPanelFlag(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_InitiateVideoCall_03".toLowerCase()
                )
            ) {
              await dispatch(initiateVideoCallFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(initiateVideoCallFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(initiateVideoCallFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(initiateVideoCallFail(t("Something-went-wrong")));
      });
  };
};

const incomingVideoCallMQTT = (response, message) => {
  return {
    type: actions.INCOMING_VIDEO_CALL_MQTT,
    response: response,
    message: message,
  };
};

const videoCallAccepted = (response, message) => {
  return {
    type: actions.INCOMING_VIDEO_CALL_ACCEPTED_MQTT,
    response: response,
    message: message,
  };
};

const videoCallResponseInitial = () => {
  return {
    type: actions.VIDEO_CALL_RESPONSE_INITIAL,
  };
};

const videoCallResponseSuccess = (response, message) => {
  return {
    type: actions.VIDEO_CALL_RESPONSE_SUCCESS,
    response: response,
    message: message,
  };
};

const videoCallResponseFail = (message) => {
  return {
    type: actions.VIDEO_CALL_RESPONSE_FAIL,
    message: message,
  };
};

const VideoCallResponse = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(videoCallResponseInitial());
    let form = new FormData();
    form.append("RequestMethod", videoCallResponse.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(VideoCallResponse(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_VideoCallResponse_01".toLowerCase()
                )
            ) {
              console.log(Data, "responsedataresponseResult");
              sessionStorage.setItem("NonMeetingVideoCall", true);

              // call statusID 1 means call accepted and call statusID 5 means Busy and call StatusId 2
              if (Data.CallStatusID === 1) {
                const meetingHost = {
                  isHost: false,
                  isHostId: 0,
                  isDashboardVideo: false,
                };
                localStorage.setItem(
                  "meetinHostInfo",
                  JSON.stringify(meetingHost)
                );
              } else {
                console.log(Data, "CheckCheck");
              }

              await dispatch(
                videoCallResponseSuccess(
                  response.data.responseResult,
                  t("Video-Call-Status-Updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_VideoCallResponse_02".toLowerCase()
                )
            ) {
              await dispatch(
                videoCallResponseFail(t("Call-not-initiated-successfully"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_VideoCallResponse_03".toLowerCase()
                )
            ) {
              await dispatch(videoCallResponseFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(videoCallResponseFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(videoCallResponseFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(videoCallResponseFail(t("Something-went-wrong")));
      });
  };
};

const getVideoRecipentData = (response) => {
  return {
    type: actions.GET_VIDEO_RECIPENT_DATA,
    response: response,
  };
};

const getUserRecentCallsInitial = () => {
  return {
    type: actions.GET_ALL_RECENTCALLS_INITIAL,
  };
};

const getUserRecentCallsSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_RECENTCALLS_SUCCESS,
    response: response,
    message: message,
  };
};

const getUserRecentCallsFail = (message) => {
  return {
    type: actions.GET_ALL_RECENTCALLS_FAIL,
    message: message,
  };
};

const GetUserRecentCalls = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getUserRecentCallsInitial());
    let form = new FormData();
    form.append("RequestMethod", getUserRecentCalls.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetUserRecentCalls(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserRecetCalls_01".toLowerCase()
                )
            ) {
              await dispatch(
                getUserRecentCallsSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserRecetCalls_02".toLowerCase()
                )
            ) {
              await dispatch(getUserRecentCallsFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserRecetCalls_03".toLowerCase()
                )
            ) {
              await dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
      });
  };
};

const ScrollRecentCalls = (response) => {
  return {
    type: actions.SCROLL_BEHAVIOR_SPINNER,
    response: response,
  };
};
const GetUserRecentCallsScroll = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", getUserRecentCalls.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetUserRecentCalls(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserRecetCalls_01".toLowerCase()
                )
            ) {
              await dispatch(
                getUserRecentCallsSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserRecetCalls_02".toLowerCase()
                )
            ) {
              await dispatch(getUserRecentCallsFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserRecetCalls_03".toLowerCase()
                )
            ) {
              await dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getUserRecentCallsFail(t("Something-went-wrong")));
      });
  };
};

const callRequestReceivedInitial = () => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_INITIAL,
  };
};

const callRequestReceivedSuccess = (response, message) => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_SUCCESS,
    response: response,
    message: message,
  };
};

const callRequestReceivedFail = (message) => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_FAIL,
    message: message,
  };
};

const CallRequestReceived = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(callRequestReceivedInitial());
    let form = new FormData();
    form.append("RequestMethod", callRequestReceived.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CallRequestReceived(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_CallRequestReceived_01".toLowerCase()
                )
            ) {
              await dispatch(
                callRequestReceivedSuccess(
                  response.data.responseResult,
                  t("Record-Updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_CallRequestReceived_02".toLowerCase()
                )
            ) {
              await dispatch(callRequestReceivedFail(t("No-Record-Updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_CallRequestReceived_03".toLowerCase()
                )
            ) {
              await dispatch(
                callRequestReceivedFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(callRequestReceivedFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(callRequestReceivedFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(callRequestReceivedFail(t("Something-went-wrong")));
      });
  };
};

const callRequestReceivedMQTT = (response, message) => {
  return {
    type: actions.CALL_REQUEST_RECEIVED_MQTT,
    response: response,
    message: message,
  };
};

const getUserMissedCallCountInitial = () => {
  return {
    type: actions.GET_MISSED_CALL_COUNT_INITIAL,
  };
};

const getUserMissedCallCountSuccess = (response, message) => {
  return {
    type: actions.GET_MISSED_CALL_COUNT_SUCCESS,
    response: response,
    message: message,
  };
};

const getUserMissedCallCountFail = (message) => {
  return {
    type: actions.GET_MISSED_CALL_COUNT_FAIL,
    message: message,
  };
};

const GetUserMissedCallCount = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getUserMissedCallCountInitial());
    let form = new FormData();
    form.append("RequestMethod", getUserMissedCallCount.RequestMethod);
    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetUserMissedCallCount(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserMissedCallCount_01".toLowerCase()
                )
            ) {
              await dispatch(
                getUserMissedCallCountSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserMissedCallCount_02".toLowerCase()
                )
            ) {
              await dispatch(
                getUserMissedCallCountSuccess(
                  response.data.responseResult,
                  t("No-records-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetUserMissedCallCount_03".toLowerCase()
                )
            ) {
              await dispatch(
                getUserMissedCallCountFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              getUserMissedCallCountFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(getUserMissedCallCountFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getUserMissedCallCountFail(t("Something-went-wrong")));
      });
  };
};

const leaveCallAction = (message) => {
  return {
    type: actions.LEAVE_CALL_ACTION,
    message: message,
  };
};

const LeaveCall = (Data, navigate, t, flag, setIsTimerRunning) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", leaveCall.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(LeaveCall(Data, navigate, t, flag, setIsTimerRunning));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_LeaveCall_01".toLowerCase()
                )
            ) {
              console.log("leavecallMeetingVideo");
              localStorage.setItem("callTypeID", 0);
              sessionStorage.setItem("NonMeetingVideoCall", false);
              localStorage.setItem("initiateVideoCall", false);
              localStorage.setItem("NewRoomID", 0);
              localStorage.setItem("newCallerID", 0);
              dispatch(leavePresenterJoinOneToOneOrOtherCall(false));
              await dispatch(leaveCallAction(t("Call-disconnected-by-caller")));
              if (flag === 1) {
                await dispatch(normalizeVideoPanelFlag(false));
                await dispatch(maximizeVideoPanelFlag(false));
                await dispatch(minimizeVideoPanelFlag(false));
                let NewRoomID = localStorage.getItem("NewRoomID");
                let userID = localStorage.getItem("userID");
                let incommingCallTypeID = localStorage.getItem(
                  "incommingCallTypeID"
                );
                let incommingCallType =
                  localStorage.getItem("incommingCallType");
                let incommingNewCallerID = localStorage.getItem(
                  "incommingNewCallerID"
                );
                localStorage.setItem("activeCall", false);
                localStorage.setItem("isMeetingVideo", false);
                localStorage.setItem("acceptedRoomID", 0);
                localStorage.setItem("activeRoomID", 0);
                localStorage.removeItem("currentHostUserID");
                localStorage.removeItem("isHost");
                localStorage.removeItem("isNewHost");
                localStorage.setItem("MicOff", true);
                localStorage.setItem("VidOff", true);
                localStorage.setItem("callTypeID", incommingCallTypeID);
                localStorage.setItem("callType", incommingCallType);
                localStorage.setItem("newCallerID", incommingNewCallerID);
                localStorage.setItem("isCaller", false);
                localStorage.setItem("activeRoomID", NewRoomID);
                let Data2 = {
                  ReciepentID: Number(userID),
                  RoomID: NewRoomID,
                  CallStatusID: 1,
                  CallTypeID: Number(incommingCallTypeID),
                };
                await dispatch(VideoCallResponse(Data2, navigate, t));
                dispatch(normalizeVideoPanelFlag(true));
                localStorage.removeItem("NewRoomID");

                localStorage.removeItem("incommingCallTypeID");
                localStorage.removeItem("incommingCallType");
                localStorage.removeItem("incommingNewCallerID");
                dispatch(incomingVideoCallFlag(false));
                setIsTimerRunning(false);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_LeaveCall_02".toLowerCase()
                )
            ) {
              dispatch(leavePresenterJoinOneToOneOrOtherCall(false));
              if (flag === 1) {
                await dispatch(normalizeVideoPanelFlag(false));
                await dispatch(maximizeVideoPanelFlag(false));
                await dispatch(minimizeVideoPanelFlag(false));
                let NewRoomID = localStorage.getItem("NewRoomID");
                let userID = localStorage.getItem("userID");
                let incommingCallTypeID = localStorage.getItem(
                  "incommingCallTypeID"
                );
                let incommingCallType =
                  localStorage.getItem("incommingCallType");
                let incommingNewCallerID = localStorage.getItem(
                  "incommingNewCallerID"
                );
                localStorage.setItem("activeCall", false);
                localStorage.setItem("isMeetingVideo", false);
                localStorage.setItem("acceptedRoomID", 0);
                localStorage.setItem("activeRoomID", 0);
                localStorage.removeItem("currentHostUserID");
                localStorage.removeItem("isHost");
                localStorage.removeItem("isNewHost");
                localStorage.setItem("MicOff", true);
                localStorage.setItem("VidOff", true);
                localStorage.setItem("callTypeID", incommingCallTypeID);
                localStorage.setItem("callType", incommingCallType);
                localStorage.setItem("newCallerID", incommingNewCallerID);
                localStorage.setItem("isCaller", false);
                localStorage.setItem("activeRoomID", NewRoomID);
                let Data2 = {
                  ReciepentID: Number(userID),
                  RoomID: NewRoomID,
                  CallStatusID: 1,
                  CallTypeID: Number(incommingCallTypeID),
                };
                await dispatch(VideoCallResponse(Data2, navigate, t));
                dispatch(normalizeVideoPanelFlag(true));

                localStorage.removeItem("NewRoomID");

                localStorage.removeItem("incommingCallTypeID");
                localStorage.removeItem("incommingCallType");
                localStorage.removeItem("incommingNewCallerID");
                dispatch(incomingVideoCallFlag(false));
                setIsTimerRunning(false);
              }
              await dispatch(
                leaveCallAction(t("Call-disconnected-by-recipient"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_LeaveCall_03".toLowerCase()
                )
            ) {
              await dispatch(leaveCallAction(t("Something-went-wrong")));
            }else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_LeaveCall_04".toLowerCase()
                )
            ) {
              await dispatch(leaveCallAction(t("Something-went-wrong")));
            }
          } else {
            await dispatch(leaveCallAction(t("Something-went-wrong")));
          }
        } else {
          await dispatch(leaveCallAction(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(leaveCallAction(t("Something-went-wrong")));
      });
  };
};

const missedCallCount = (response, message) => {
  return {
    type: actions.MISSED_CALL_COUNT_MQTT,
    response: response,
    message: message,
  };
};

const groupCallRecipients = (response) => {
  return {
    type: actions.GROUP_CALL_RECIPIENTS,
    response: response,
  };
};

const LeaveInitmationMessegeVideoMeetAction = (response) => {
  return {
    type: actions.INTIMATION_MESSEGE_LEAVE_MEETING_VIDEO,
    response: response,
  };
};

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
  GetUserMissedCallCount,
  GetUserRecentCallsScroll,
  ScrollRecentCalls,
  LeaveCall,
  missedCallCount,
  groupCallRecipients,
  LeaveInitmationMessegeVideoMeetAction,
  initiateVideoCallFail,
};
