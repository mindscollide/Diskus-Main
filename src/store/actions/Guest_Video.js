import * as actions from "../action_types";

import { meetingApi, videoApi } from "../../commen/apis/Api_ends_points";
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
  guestLeaveMeetingVideo,
  muteUnMuteSelf,
  hideUnHideVideoSelf,
  getVideoCallParticipantsForGuest,
} from "../../commen/apis/Api_config";
import copyToClipboard from "../../hooks/useClipBoard";
import { mqttConnectionGuestUser } from "../../commen/functions/mqttconnection_guest";
import {
  getVideoCallParticipantsMainApi,
  guestJoinPopup,
  guestLeaveVideoMeeting,
  makeHostNow,
  participantAcceptandReject,
  participantVideoNavigationScreen,
  participantWaitingListBox,
  setAudioControlHost,
  setRaisedUnRaisedParticiant,
  setVideoControlHost,
  toggleParticipantsVisibility,
} from "./VideoFeature_actions";
import { isArray } from "lodash";
import axiosInstance from "../../commen/functions/axiosInstance";

const guestVideoNavigationScreen = (response) => {
  return {
    type: actions.GUEST_VIDEO_SCREEN_NAVIGATION,
    response: response,
  };
};
const makeStreamStop = (response, flag) => {
  return {
    type: actions.GUEST_VIDEO_STREAM_STOP,
    response: response,
    flag: flag,
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

    axiosInstance
      .post(meetingApi, form)
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
                  // t("Meeting-link-copied")
                  t("")
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

    axiosInstance
      .post(meetingApi, form)
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
              sessionStorage.setItem("isLeftCheck", false);
              sessionStorage.setItem(
                "roomID",
                response.data.responseResult.roomID
              );

              sessionStorage.setItem(
                "MeetingId",
                response.data.responseResult.meetingId
              );
              dispatch(getValidateString(response.data.responseResult));
              console.log("reponsepreodjfdfds", response.data.responseResult);
              // sessionStorage.setItem("viewState", 1);
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

const joinGuestVideoMainApi = (navigate, t, data, setJoinButton) => {
  return (dispatch) => {
    dispatch(joinGuestVideoInit());
    let form = new FormData();
    form.append("RequestMethod", joinGuestVideo.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          //   await dispatch(RefreshToken(navigate, t));
          dispatch(joinGuestVideoMainApi(navigate, t, data, setJoinButton));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinGuestVideo_01".toLowerCase()
                )
            ) {
              try {
                setJoinButton(false);
              } catch {}
              // dispatch(guestVideoNavigationScreen(true));
              mqttConnectionGuestUser(
                response.data.responseResult.guestGuid,
                dispatch
                // response.data.responseResult.email
              );
              sessionStorage.setItem(
                "GuestEmail",
                response.data.responseResult.email
              );
              sessionStorage.setItem(
                "GuestUserID",
                response.data.responseResult.guestGuid
              );
              sessionStorage.setItem(
                "isZoomEnabled",
                response.data.responseResult.isZoomEnabled
              );
              await dispatch(
                joinGuestVideoSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              sessionStorage.setItem("hasJoined", true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinGuestVideo_02".toLowerCase()
                )
            ) {
              try {
                setJoinButton(false);
              } catch {}
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
              try {
                setJoinButton(false);
              } catch {}
              await dispatch(joinGuestVideoFail(t("Something-went-wrong")));
            }
          } else {
            try {
              setJoinButton(false);
            } catch {}
            await dispatch(joinGuestVideoFail(t("Something-went-wrong")));
          }
        } else {
          try {
            setJoinButton(false);
          } catch {}
          await dispatch(joinGuestVideoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        try {
          setJoinButton(false);
        } catch {}
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

const admitRejectAttendeeMainApi = (
  Data,
  navigate,
  t,
  flag,
  filteredParticipants,
  setLoadingAdmit,
  setLoadingDeny
) => {
  let filterGuids = Data.AttendeeResponseList.map(
    (guidMap, index) => guidMap.UID
  );
  console.log(filterGuids, "filterGuids");

  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(admitRejectInit());
    let form = new FormData();
    form.append("RequestMethod", admitRejectAttendee.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            admitRejectAttendeeMainApi(
              Data,
              navigate,
              t,
              flag,
              filteredParticipants,
              setLoadingAdmit,
              setLoadingDeny
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AdmitRejectAttendee_01".toLowerCase()
                )
            ) {
              //this will neglect where setLoadingAdmit is not define i other api dispatch
              if (typeof setLoadingAdmit === "function") {
                setLoadingAdmit(false);
                setLoadingDeny(false);
              }
              await dispatch(
                admitRejectSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );

              // when flag is true then after click on accept all participantWaitinglistbox closed
              if (flag === true) {
                dispatch(participantWaitingListBox(false));
              } else if (flag === false) {
                // when flag is false then after click on accept singly participantWaitinglistbox close if they have length 1
                if (
                  filteredParticipants !== undefined &&
                  filteredParticipants.length === 1
                ) {
                  dispatch(participantWaitingListBox(false));
                }
              }
              if (
                Data.IsRequestAccepted &&
                Data.AttendeeResponseList.length > 0
              ) {
                let roomIds = localStorage.getItem("activeRoomID");
                let getNames = Data.AttendeeResponseList.map((userData) => {
                  console.log(userData, "userDatauserData");
                  return {
                    Name: userData.Name,
                    UID: userData.UID,
                    // roomIds,
                    roomID: Data.RoomId,
                    // isMute: userData.IsMuted,
                    // hideVideo: userData.HideVideo,
                    // isHandRaise: false,
                    // isGuest: userData.IsGuest,
                  };
                });
                console.log(getNames, "getNamesgetNames");
                dispatch(setAdmittedParticipant(getNames));
              }
              dispatch(guestJoinPopup(false));
              dispatch(participantAcceptandReject(filterGuids));
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
              if (typeof setLoadingAdmit === "function") {
                setLoadingAdmit(false);
                setLoadingDeny(false);
              }
              dispatch(guestJoinPopup(false));
              await dispatch(admitRejectFail(t("Something-went-wrong")));
            }
          } else {
            if (typeof setLoadingAdmit === "function") {
              setLoadingAdmit(false);
              setLoadingDeny(false);
            }
            dispatch(guestJoinPopup(false));
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

    axiosInstance
      .post(meetingApi, form)
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
              console.log("handStatus", data.IsHandRaised);
              localStorage.setItem("handStatus", data.IsHandRaised);
              await dispatch(setRaisedUnRaisedParticiant(data.IsHandRaised));
              await dispatch(
                raiseUnRaisedSuccess(
                  response.data.responseResult,
                  // t("Successful")
                  t("")
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

const transferMeetingHostInit = () => {
  return {
    type: actions.TRANSFER_MEETING_HOST_INIT,
  };
};

const transferMeetingHostSuccess = (response) => {
  console.log("videoHideUnHideForHost", response);
  return {
    type: actions.TRANSFER_MEETING_HOST_SUCCESS,
    response: response,
  };
};

const transferMeetingHostFail = (message) => {
  return {
    type: actions.TRANSFER_MEETING_HOST_FAIL,
    message: message,
  };
};

const transferMeetingHostMainApi = (navigate, t, data, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(transferMeetingHostInit());
    let form = new FormData();
    form.append("RequestMethod", transferMeetingHost.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(transferMeetingHostMainApi(navigate, t, data, flag));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_TransferMeetingHost_01".toLowerCase()
                )
            ) {
              const meetingHost = {
                isHost: false,
                isHostId: 0,
                isDashboardVideo: true,
              };
              console.log("makeHostOnClick", meetingHost);
              let newRoomId = localStorage.getItem("newRoomId");
              let isGuid = localStorage.getItem("isGuid");
              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
              let refinedVideoUrl = localStorage.getItem("refinedVideoUrl");
              localStorage.setItem("hostUrl", refinedVideoUrl);
              localStorage.setItem("participantRoomId", newRoomId);
              localStorage.setItem("participantUID", isGuid);
              localStorage.setItem("isMeetingVideoHostCheck", false);
              localStorage.setItem("isHost", false);
              // localStorage.removeItem("isGuid");
              dispatch(participantWaitingListBox(false));
              dispatch(toggleParticipantsVisibility(false));

              let Data = {
                RoomID: String(newRoomId),
              };
              await dispatch(
                getVideoCallParticipantsMainApi(Data, navigate, t)
              );

              await dispatch(transferMeetingHostSuccess(true));
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

const removeParticipantMeetingMainApi = (navigate, t, data) => {
  console.log(data, "datadatadatadatakashan");
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(removeParticipantMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", removeParticipantMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(removeParticipantMeetingMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RemoveParticipantFromMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                removeParticipantMeetingSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              dispatch(guestLeaveVideoMeeting(data.UID));
              dispatch(removeParticipantFromVideo(data.UID));
              dispatch(participantVideoNavigationScreen(1));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RemoveParticipantFromMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                removeParticipantMeetingFail(t("Invalid-request-data-2"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RemoveParticipantFromMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(removeParticipantMeetingFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RemoveParticipantFromMeeting_04".toLowerCase()
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

const guestLeaveMeetingVideoInit = () => {
  return {
    type: actions.GUEST_VIDEO_LEAVE_MEETING_INIT,
  };
};

const guestLeaveMeetingVideoSuccess = (response, message) => {
  return {
    type: actions.GUEST_VIDEO_LEAVE_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const guestLeaveMeetingVideoFail = (message) => {
  return {
    type: actions.GUEST_VIDEO_LEAVE_MEETING_FAIL,
    message: message,
  };
};

const guestLeaveMeetingVideoApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log(data, "datadatadatadata");
  return (dispatch) => {
    dispatch(guestLeaveMeetingVideoInit());
    let form = new FormData();
    form.append("RequestMethod", guestLeaveMeetingVideo.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(guestLeaveMeetingVideoApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GuestLeaveMeetingVideo_01".toLowerCase()
                )
            ) {
              await dispatch(
                guestLeaveMeetingVideoSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              sessionStorage.setItem("isRejoining", "true");
              sessionStorage.removeItem("isZoomEnabled");
              let leftCheck = JSON.parse(sessionStorage.getItem("isLeftCheck"));
              if (leftCheck) {
                dispatch(guestVideoNavigationScreen(4));
              } else {
                dispatch(guestVideoNavigationScreen(1));
              }
              dispatch(setVideoCameraGuest(false));
              dispatch(setVoiceControleGuest(false));
              sessionStorage.setItem("hasJoined", false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GuestLeaveMeetingVideo_02".toLowerCase()
                )
            ) {
              sessionStorage.setItem("hasJoined", false);
              await dispatch(
                guestLeaveMeetingVideoFail(t("Invalid-request-data-2"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GuestLeaveMeetingVideo_03".toLowerCase()
                )
            ) {
              await dispatch(guestLeaveMeetingVideoFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GuestLeaveMeetingVideo_04".toLowerCase()
                )
            ) {
              await dispatch(
                guestLeaveMeetingVideoFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              guestLeaveMeetingVideoFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(guestLeaveMeetingVideoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(guestLeaveMeetingVideoFail(t("Something-went-wrong")));
      });
  };
};

const removeParticipantFromVideo = (response) => {
  console.log(response, "responseresponseresponse");
  return {
    type: actions.REMOVE_PARTICIPANTS_FROM_VIDEO,
    response: response,
  };
};

const muteUnmuteSelfInit = () => {
  return {
    type: actions.MUTE_UNMUTE_SELF_INIT,
  };
};

const muteUnmuteSelfSuccess = (response, message) => {
  return {
    type: actions.MUTE_UNMUTE_SELF_SUCCESS,
    response: response,
    message: message,
  };
};

const muteUnmuteSelfFail = (message) => {
  return {
    type: actions.MUTE_UNMUTE_SELF_FAIL,
    message: message,
  };
};

const muteUnMuteSelfMainApi = (navigate, t, data, check) => {
  return (dispatch) => {
    dispatch(muteUnmuteSelfInit());
    let form = new FormData();
    form.append("RequestMethod", muteUnMuteSelf.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(muteUnMuteSelfMainApi(navigate, t, data, check));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteSelf_01".toLowerCase()
                )
            ) {
              // await dispatch(setAudioControlHost(data.IsMuted));

              localStorage.setItem("isMicEnabled", data.IsMuted);
              await dispatch(
                muteUnmuteSelfSuccess(
                  response.data.responseResult,
                  // t("Successful")
                  t("")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteSelf_02".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteSelfFail(t("Invalid-request-data-2")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteSelf_03".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteSelfFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MuteUnMuteSelf_04".toLowerCase()
                )
            ) {
              await dispatch(muteUnmuteSelfFail(t("UnSuccessful")));
            }
          } else {
            await dispatch(muteUnmuteSelfFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(muteUnmuteSelfFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(muteUnmuteSelfFail(t("Something-went-wrong")));
      });
  };
};

const hideUnhideSelfInit = () => {
  return {
    type: actions.HIDE_UNHIDE_SELF_VIDEO_INIT,
  };
};

const hideUnhideSelfSuccess = (response, message) => {
  return {
    type: actions.HIDE_UNHIDE_SELF_VIDEO_SUCCESS,
    response: response,
    message: message,
  };
};

const hideUnhideSelfFail = (message) => {
  return {
    type: actions.HIDE_UNHIDE_SELF_VIDEO_FAIL,
    message: message,
  };
};

const hideUnhideSelfMainApi = (navigate, t, data, check) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(hideUnhideSelfInit());
    let form = new FormData();
    form.append("RequestMethod", hideUnHideVideoSelf.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(hideUnhideSelfMainApi(navigate, t, data, check));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideVideo_01".toLowerCase()
                )
            ) {
              localStorage.setItem("isWebCamEnabled", data.HideVideo);
              console.log("videoHideUnHideForHost", data.HideVideo);
              // await dispatch(setVideoControlHost(data.HideVideo));

              await dispatch(
                hideUnhideSelfSuccess(
                  response.data.responseResult,
                  // t("Successful")
                  t("")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideVideo_02".toLowerCase()
                )
            ) {
              await dispatch(hideUnhideSelfFail(t("Invalid-request-data-2")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideVideo_03".toLowerCase()
                )
            ) {
              localStorage.setItem("isWebCamEnabled", false);
              await dispatch(setVideoControlHost(false));

              await dispatch(hideUnhideSelfFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_HideUnHideVideo_04".toLowerCase()
                )
            ) {
              await dispatch(setVideoControlHost(false));
              localStorage.setItem("isWebCamEnabled", false);
              await dispatch(hideUnhideSelfFail(t("UnSuccessful")));
            }
          } else {
            await dispatch(hideUnhideSelfFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(hideUnhideSelfFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(hideUnhideSelfFail(t("Something-went-wrong")));
      });
  };
};

const muteUnMuteByHost = (response) => {
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANT_OR_GUEST,
    response: response,
  };
};

const hideUnHideVideoByHost = (response) => {
  console.log(response, "responseresponse");
  return {
    type: actions.HIDE_UNHIDE_VIDEO_BY_HOST,
    response: response,
  };
};
const setVideoCameraGuest = (response) => {
  return {
    type: actions.SET_MQTT_VIDEO_CAMERA_GUEST,
    response: response,
  };
};
const setVoiceControleGuest = (response) => {
  return {
    type: actions.SET_MQTT_VOICE_CONTROLE_GUEST,
    response: response,
  };
};
const setVoiceControleGuestForAllbyHost = (flag, response) => {
  return {
    type: actions.SET_MQTT_VOICE_CONTROLE_GUEST_FOR_ALL_BY_HOST,
    flag: flag,
    response: response,
  };
};
const getVideoCallParticipantGuestInit = () => {
  return {
    type: actions.GET_VIDEO_PARTICIPANTS_FOR_GUEST_INIT,
  };
};

const getVideoCallParticipantGuestSuccess = (response, message, flag) => {
  return {
    type: actions.GET_VIDEO_PARTICIPANTS_FOR_GUEST_SUCCESS,
    response: response,
    message: message,
    flag: flag,
  };
};

const getVideoCallParticipantGuestFail = (message) => {
  return {
    type: actions.GET_VIDEO_PARTICIPANTS_FOR_GUEST_FAIL,
    message: message,
  };
};

const getVideoCallParticipantsGuestMainApi = (Data, navigate, t) => {
  return (dispatch) => {
    dispatch(getVideoCallParticipantGuestInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getVideoCallParticipantsForGuest.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(videoApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getVideoCallParticipantsGuestMainApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_01".toLowerCase()
                )
            ) {
              function saveCurrentMeetingHost(data) {
                // Filter the data to get only participants where isHost is true
                const hosts = data
                  .filter((participant) => participant.isHost)
                  .map(({ guid, userID }) => ({ guid, userID }));

                // Save the result in session storage with the key 'currentmeetingHost'
                sessionStorage.setItem(
                  "currentmeetingHost",
                  JSON.stringify(hosts)
                );
              }
              saveCurrentMeetingHost(
                response.data.responseResult.participantList
              );
              await dispatch(
                getVideoCallParticipantGuestSuccess(
                  response.data.responseResult.participantList,
                  t("Successful"),
                  1
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_02".toLowerCase()
                )
            ) {
              await dispatch(
                getVideoCallParticipantGuestFail(t("No-record-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_03".toLowerCase()
                )
            ) {
              await dispatch(
                getVideoCallParticipantGuestFail(t("UnSuccessful"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Video_VideoServiceManager_GetVideoCallParticipants_04".toLowerCase()
                )
            ) {
              await dispatch(
                getVideoCallParticipantGuestFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              getVideoCallParticipantGuestFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            getVideoCallParticipantGuestFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getVideoCallParticipantGuestFail(t("Something-went-wrong")));
      });
  };
};

const getValidateString = (response) => {
  return {
    type: actions.GET_VALIDATE_STRING_DATA,
    response: response,
  };
};

const raisedUnRaisedParticipantsGuest = (response) => {
  return {
    type: actions.RAISE_UNRAISED_PARTICIPANTS_GUEST,
    response: response,
  };
};

const hideUnHideVideoParticipantsorGuest = (response) => {
  console.log(response, "firstfirstfirst");
  return {
    type: actions.HIDE_UNHIDE_VIDEO_PARTICIPANTS_GUEST,
    response: response,
  };
};

const muteUnMuteParticipantsorGuest = (response) => {
  console.log(response, "firstfirstfirst");
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANTS_GUEST,
    response: response,
  };
};
const muteUnMuteParticipantsorGuestbyHost = (response) => {
  console.log(response, "firstfirstfirst");
  return {
    type: actions.MUTE_UNMUTE_PARTICIPANTS_GUEST_BY_HOST,
    response: response,
  };
};

const participantHideUnhideVideo = (response) => {
  console.log("MQTT onMessageArrived");
  return {
    type: actions.PARTICIPANT_HIDEUNHIDE_VIDEO,
    payload: response,
  };
};

const clearGuestVideoReducerResponseMessage = () => {
  return {
    type: actions.CLEAR_RESPONSEMESSAGE_GUESTREDUCER,
  };
};
export {
  clearGuestVideoReducerResponseMessage,
  getMeetingGuestVideoMainApi,
  validateEncryptGuestVideoMainApi,
  joinGuestVideoMainApi,
  setClientGuest,
  ClearResponseMessageGuest,
  admitGuestUserRequest,
  admitRejectAttendeeMainApi,
  guestVideoNavigationScreen,
  raiseUnRaisedHandMainApi,
  transferMeetingHostMainApi,
  removeParticipantMeetingMainApi,
  setAdmittedParticipant,
  guestLeaveMeetingVideoApi,
  removeParticipantFromVideo,
  muteUnMuteSelfMainApi,
  hideUnhideSelfMainApi,
  muteUnMuteByHost,
  hideUnHideVideoByHost,
  setVideoCameraGuest,
  setVoiceControleGuest,
  getVideoCallParticipantsGuestMainApi,
  getValidateString,
  raisedUnRaisedParticipantsGuest,
  hideUnHideVideoParticipantsorGuest,
  muteUnMuteParticipantsorGuest,
  participantHideUnhideVideo,
  getVideoCallParticipantGuestSuccess,
  makeStreamStop,
  muteUnMuteParticipantsorGuestbyHost,
  setVoiceControleGuestForAllbyHost,
  transferMeetingHostSuccess,
};
