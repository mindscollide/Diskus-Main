import * as actions from "../action_types";
import axios from "axios";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import {
  getMeetingGuestVideoURL,
  ValidateEncryptedStringGuestVideoLink,
  joinGuestVideo,
  admitRejectAttendee,
  raiseUnRaisedHand,
  muteUnMuteParticipant,
  transferMeetingHost,
  removeParticipantMeeting,
} from "../../commen/apis/Api_config";
import copyToClipboard from "../../hooks/useClipBoard";
import { mqttConnectionGuestUser } from "../../commen/functions/mqttconnection_guest";
import {
  guestJoinPopup,
  participantAcceptandReject,
  participantWaitingListBox,
} from "./VideoFeature_actions";

const guestVideoNavigationScreen = (response) => {
  return {
    type: actions.GUEST_VIDEO_SCREEN_NAVIGATION,
    response: response,
  };
};

const getMeetingGuestVideoInit = () => {
  return {
    type: actions.GET_MEETING_GUEST_URL_INIT,
  };
};

const getMeetingGuestVideoSuccess = (response, message) => {
  return {
    type: actions.GET_MEETING_GUEST_URL_SUCCESS,
    response: response,
    message: message,
  };
};

const getMeetingGuestVideoFail = (message) => {
  return {
    type: actions.GET_MEETING_GUEST_URL_FAIL,
    message: message,
  };
};

const getMeetingGuestVideoMainApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingGuestVideoInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingGuestVideoURL.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingGuestVideoMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingGuestVideoURL_01".toLowerCase()
                )
            ) {
              await dispatch(
                getMeetingGuestVideoSuccess(
                  response.data.responseResult.guestVideoURL,
                  t("Meeting-link-copied")
                )
              );
              copyToClipboard(response.data.responseResult.guestVideoURL);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingGuestVideoURL_02".toLowerCase()
                )
            ) {
              await dispatch(getMeetingGuestVideoFail(t("Meeting-not-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingGuestVideoURL_03".toLowerCase()
                )
            ) {
              await dispatch(
                getMeetingGuestVideoFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(getMeetingGuestVideoFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getMeetingGuestVideoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getMeetingGuestVideoFail(t("Something-went-wrong")));
      });
  };
};

const validateEncryptGuestVideoInit = () => {
  return {
    type: actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_INIT,
  };
};

const validateEncryptGuestVideoSuccess = (response, message) => {
  return {
    type: actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_SUCCESS,
    response: response,
    message: message,
  };
};

const validateEncryptGuestVideoFail = (message) => {
  return {
    type: actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_FAIL,
    message: message,
  };
};

const validateEncryptGuestVideoMainApi = (navigate, t, data) => {
  return (dispatch) => {
    dispatch(validateEncryptGuestVideoInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      ValidateEncryptedStringGuestVideoLink.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {},
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          // await dispatch(RefreshToken(navigate, t));
          dispatch(validateEncryptGuestVideoMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_01".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoSuccess(
                  response.data.responseResult,
                  t("Active-meeting")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_02".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoFail(t("Meeting-not-active"))
              );
              dispatch(guestVideoNavigationScreen(4));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_03".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoFail(t("Invalid-meeting"))
              );
              dispatch(guestVideoNavigationScreen(4));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_04".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoFail(t("Something-went-wrong"))
              );
              dispatch(guestVideoNavigationScreen(4));
            }
          } else {
            await dispatch(
              validateEncryptGuestVideoFail(t("Something-went-wrong"))
            );
            dispatch(guestVideoNavigationScreen(4));
          }
        } else {
          await dispatch(
            validateEncryptGuestVideoFail(t("Something-went-wrong"))
          );
          dispatch(guestVideoNavigationScreen(4));
        }
      })
      .catch((response) => {
        dispatch(validateEncryptGuestVideoFail(t("Something-went-wrong")));
        dispatch(guestVideoNavigationScreen(4));
      });
  };
};

const joinGuestVideoInit = () => {
  return {
    type: actions.JOIN_GUEST_VIDEO_INIT,
  };
};

const joinGuestVideoSuccess = (response, message) => {
  return {
    type: actions.JOIN_GUEST_VIDEO_SUCCESS,
    response: response,
    message: message,
  };
};

const joinGuestVideoFail = (message) => {
  return {
    type: actions.JOIN_GUEST_VIDEO_FAIL,
    message: message,
  };
};

const joinGuestVideoMainApi = (navigate, t, data) => {
  return (dispatch) => {
    dispatch(joinGuestVideoInit());
    let form = new FormData();
    form.append("RequestMethod", joinGuestVideo.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {},
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          //   await dispatch(RefreshToken(navigate, t));
          dispatch(joinGuestVideoMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinGuestVideo_01".toLowerCase()
                )
            ) {
              // dispatch(guestVideoNavigationScreen(true));
              mqttConnectionGuestUser(response.data.responseResult.guestGuid);
              sessionStorage.setItem(
                "GuestUserID",
                response.data.responseResult.guestGuid
              );
              await dispatch(
                joinGuestVideoSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinGuestVideo_02".toLowerCase()
                )
            ) {
              await dispatch(
                joinGuestVideoFail(t("meeting-organizers-not-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinGuestVideo_03".toLowerCase()
                )
            ) {
              await dispatch(joinGuestVideoFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(joinGuestVideoFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(joinGuestVideoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(joinGuestVideoFail(t("Something-went-wrong")));
      });
  };
};

const setClientGuest = (response) => {
  return {
    type: actions.SET_MQTT_GUEST,
    response: response,
  };
};

const admitRejectInit = () => {
  return {
    type: actions.ADMIT_REJECT_ATTENDEE_INIT,
  };
};

const admitRejectSuccess = (response, message) => {
  return {
    type: actions.ADMIT_REJECT_ATTENDEE_SUCCESS,
    response: response,
    message: message,
  };
};

const admitRejectFail = (message) => {
  return {
    type: actions.ADMIT_REJECT_ATTENDEE_FAIL,
    message: message,
  };
};

const admitRejectAttendeeMainApi = (Data, navigate, t) => {
  let filterGuids = Data.AttendeeResponseList.map(
    (guidMap, index) => guidMap.UID
  );
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(admitRejectInit());
    let form = new FormData();
    form.append("RequestMethod", admitRejectAttendee.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(admitRejectAttendeeMainApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AdmitRejectAttendee_01".toLowerCase()
                )
            ) {
              await dispatch(
                admitRejectSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              if (filterGuids.length > 1) {
                dispatch(participantWaitingListBox(false));
              }
              dispatch(participantAcceptandReject(filterGuids));
              dispatch(guestJoinPopup(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AdmitRejectAttendee_02".toLowerCase()
                )
            ) {
              await dispatch(admitRejectFail(t("Video-call-not-found")));
              dispatch(guestJoinPopup(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AdmitRejectAttendee_03".toLowerCase()
                )
            ) {
              dispatch(guestJoinPopup(false));
              await dispatch(admitRejectFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(admitRejectFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(admitRejectFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(admitRejectFail(t("Something-went-wrong")));
      });
  };
};

const ClearResponseMessageGuest = () => {
  return {
    type: actions.CLEAR_GUEST_MEETING_MESSAGES,
  };
};

const admitGuestUserRequest = (response) => {
  return {
    type: actions.ADMIT_GUEST_USER_REQUEST,
    response: response,
  };
};

const raiseUnRaisedInit = () => {
  return {
    type: actions.RAISE_UNRAISED_HAND_INIT,
  };
};

const raiseUnRaisedSuccess = (response, message) => {
  return {
    type: actions.RAISE_UNRAISED_HAND_SUCCESS,
    response: response,
    message: message,
  };
};

const raiseUnRaisedFail = (message) => {
  return {
    type: actions.RAISE_UNRAISED_HAND_FAIL,
    message: message,
  };
};

const raiseUnRaisedHandMainApi = (navigate, t, data) => {
  return (dispatch) => {
    dispatch(raiseUnRaisedInit());
    let form = new FormData();
    form.append("RequestMethod", raiseUnRaisedHand.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: meetingApi,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RaiseUnRaiseHand_01".toLowerCase()
                )
            ) {
              await dispatch(
                raiseUnRaisedSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RaiseUnRaiseHand_02".toLowerCase()
                )
            ) {
              await dispatch(raiseUnRaisedFail(t("Video-call-not-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RaiseUnRaiseHand_03".toLowerCase()
                )
            ) {
              await dispatch(raiseUnRaisedFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RaiseUnRaiseHand_04".toLowerCase()
                )
            ) {
              await dispatch(raiseUnRaisedFail(t("Invalid-data")));
            }
          } else {
            await dispatch(raiseUnRaisedFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(raiseUnRaisedFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(raiseUnRaisedFail(t("Something-went-wrong")));
      });
  };
};

const muteUnmuteInit = () => {
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANT_INIT,
  };
};

const muteUnmuteSuccess = (response, message) => {
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANT_SUCCESS,
    response: response,
    message: message,
  };
};

const muteUnmuteFail = (message) => {
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANT_FAIL,
    message: message,
  };
};

const muteUnMuteParticipantMainApi = (navigate, t, requestData) => {
  return (dispatch) => {
    dispatch(muteUnmuteInit());
    let form = new FormData();
    form.append("RequestMethod", muteUnMuteParticipant.RequestMethod);
    form.append("RequestData", JSON.stringify(requestData));

    axios({
      method: "post",
      url: meetingApi,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(muteUnMuteParticipantMainApi(navigate, t, requestData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteParticpant_01".toLowerCase()
                )
            ) {
              await dispatch(
                muteUnmuteSuccess(response.data.responseResult, t("Successful"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteParticpant_02".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteFail(t("Invalid-request-data-2")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteParticpant_03".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(muteUnmuteFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(muteUnmuteFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(muteUnmuteFail(t("Something-went-wrong")));
      });
  };
};

const transferMeetingHostInit = () => {
  return {
    type: actions.TRANSFER_MEETING_HOST_INIT,
  };
};

const transferMeetingHostSuccess = (response, message) => {
  return {
    type: actions.TRANSFER_MEETING_HOST_SUCCESS,
    response: response,
    message: message,
  };
};

const transferMeetingHostFail = (message) => {
  return {
    type: actions.TRANSFER_MEETING_HOST_FAIL,
    message: message,
  };
};

const transferMeetingHostMainApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(transferMeetingHostInit());
    let form = new FormData();
    form.append("RequestMethod", transferMeetingHost.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(transferMeetingHostMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_01".toLowerCase()
                )
            ) {
              await dispatch(
                transferMeetingHostSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_02".toLowerCase()
                )
            ) {
              await dispatch(
                transferMeetingHostFail(t("Invalid-request-data-2"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_03".toLowerCase()
                )
            ) {
              await dispatch(transferMeetingHostFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_04".toLowerCase()
                )
            ) {
              await dispatch(
                transferMeetingHostFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(transferMeetingHostFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(transferMeetingHostFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(transferMeetingHostFail(t("Something-went-wrong")));
      });
  };
};

const removeParticipantMeetingInit = () => {
  return {
    type: actions.REMOVE_PARTICIPANT_FROM_MEETING_INIT,
  };
};

const removeParticipantMeetingSuccess = (response, message) => {
  return {
    type: actions.REMOVE_PARTICIPANT_FROM_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const removeParticipantMeetingFail = (message) => {
  return {
    type: actions.REMOVE_PARTICIPANT_FROM_MEETING_FAIL,
    message: message,
  };
};

const removeParticipantMeetingMainApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(removeParticipantMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", removeParticipantMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify());
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(removeParticipantMeetingMainApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_01".toLowerCase()
                )
            ) {
              await dispatch(
                removeParticipantMeetingSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_02".toLowerCase()
                )
            ) {
              await dispatch(
                removeParticipantMeetingFail(t("Invalid-request-data-2"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_03".toLowerCase()
                )
            ) {
              await dispatch(removeParticipantMeetingFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_04".toLowerCase()
                )
            ) {
              await dispatch(
                removeParticipantMeetingFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              removeParticipantMeetingFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            removeParticipantMeetingFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(removeParticipantMeetingFail(t("Something-went-wrong")));
      });
  };
};

const setAdmittedParticipant = (response) => {
  console.log(response, "datdtatdatdtatddatdtatdatdtatd");
  return {
    type: actions.SET_PARTICIPANT_NAME,
    response: response,
  };
};

export {
  getMeetingGuestVideoMainApi,
  validateEncryptGuestVideoMainApi,
  joinGuestVideoMainApi,
  setClientGuest,
  ClearResponseMessageGuest,
  admitGuestUserRequest,
  admitRejectAttendeeMainApi,
  guestVideoNavigationScreen,
  raiseUnRaisedHandMainApi,
  muteUnMuteParticipantMainApi,
  transferMeetingHostMainApi,
  removeParticipantMeetingMainApi,
  setAdmittedParticipant,
};
