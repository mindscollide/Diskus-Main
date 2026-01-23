import TalkChat2 from "../../components/layout/talk/talk-chat/talkChatBox/chat";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sidebar, Talk } from "../../components/layout";
import CancelButtonModal from "../pages/meeting/closeMeetingTab/CancelModal";
import {
  Button,
  Modal,
  Notification,
  NotificationBar,
  GuestJoinRequest,
} from "../../components/elements";
import Header2 from "../../components/layout/header2/Header2";
import { ConfigProvider, Layout } from "antd";
import ar_EG from "antd/es/locale/ar_EG";
import en_US from "antd/es/locale/en_US";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setRecentActivityDataNotification } from "../../store/actions/GetUserSetting";
import VideoCallScreen from "../../components/layout/talk/videoCallScreen/VideoCallScreen";
import VideoMaxIncoming from "../../components/layout/talk/videoCallScreen/videoCallBody/VideoMaxIncoming";
import { v4 as uuidv4 } from "uuid";
import {
  incomingVideoCallFlag,
  videoOutgoingCallFlag,
  normalizeVideoPanelFlag,
  videoChatMessagesFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  guestJoinPopup,
  participantWaitingList,
  participanMuteUnMuteMeeting,
  participanRaisedUnRaisedHand,
  participantHideUnhideVideo,
  getParticipantsNewJoin,
  getVideoUrlForParticipant,
  setAudioControlHost,
  setVideoControlHost,
  setRaisedUnRaisedParticiant,
  makeHostNow,
  maxParticipantVideoRemoved,
  participantLeaveVideoMeeting,
  globalStateForAudioStream,
  globalStateForVideoStream,
  globalNavigatorVideoStream,
  leaveMeetingVideoOnlogout,
  endMeetingStatusForQuickMeetingVideo,
  endMeetingStatusForQuickMeetingModal,
  leaveMeetingVideoOnEndStatusMqtt,
  leaveMeetingOnEndStatusMqtt,
  leaveMeetingOnlogout,
  participantVideoButtonState,
  videoIconOrButtonState,
  setParticipantRemovedFromVideobyHost,
  joinPresenterViewMainApi,
  presenterViewGlobalState,
  presenterNewParticipantJoin,
  participantWaitingListBox,
  toggleParticipantsVisibility,
  getVideoCallParticipantsMainApi,
  participantListWaitingListMainApi,
  maxParticipantVideoCallPanel,
  presenterLeaveParticipant,
  clearPresenterParticipants,
  nonMeetingVideoGlobalModal,
  acceptHostTransferAccessGlobalFunc,
  unansweredOneToOneCall,
  stopScreenShareOnPresenterStarting,
  maxParticipantVideoDenied,
  screenShareTriggeredGlobally,
  isSharedScreenTriggeredApi,
} from "../../store/actions/VideoFeature_actions";
import {
  allMeetingsSocket,
  getMeetingStatusfromSocket,
  setMQTTRequestUpcomingEvents,
  createGroupMeeting,
  createCommitteeMeeting,
  mqttCurrentMeetingEnded,
} from "../../store/actions/GetMeetingUserId";
import {
  mqttInsertOtoMessage,
  mqttInsertPrivateGroupMessage,
  mqttBlockUser,
  mqttUnblockUser,
  mqttStarMessage,
  mqttUnstarMessage,
  mqttGroupCreated,
  mqttGroupUpdated,
  mqttInsertBroadcastMessage,
  mqttUnreadMessageCount,
  mqttMessageStatusUpdate,
  UpdateMessageAcknowledgement,
  mqttMessageDeleted,
  GetAllUserChats,
  mqttGroupLeft,
  lastMessageDeletion,
} from "../../store/actions/Talk_action";
import {
  incomingVideoCallMQTT,
  videoCallAccepted,
  VideoCallResponse,
  CallRequestReceived,
  callRequestReceivedMQTT,
  GetUserMissedCallCount,
  missedCallCount,
  cleareResponceMessage,
} from "../../store/actions/VideoMain_actions";
import Helper from "../../commen/functions/history_logout";
import IconMetroAttachment from "../../assets/images/newElements/Icon metro-attachment.svg";
import VerificationFailedIcon from "../../assets/images/failed.png";
import { GetPendingApprovalsCount } from "../../store/actions/Minutes_action";
import {
  createTaskCommitteeMQTT,
  createTaskGroupMQTT,
  createTaskMeetingMQTT,
  getDashboardTaskCountMQTT,
  setTodoListActivityData,
  setTodoStatusDataFormSocket,
} from "../../store/actions/ToDoList_action";
import {
  meetingStatusProposedMqtt,
  meetingStatusPublishedMqtt,
  meetingNotConductedMQTT,
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
  meetingParticipantRemoved,
  meetingParticipantAdded,
  LeaveMeetingVideo,
  meetingReminderNotifcation,
  getDashboardMeetingCountMQTT,
  removeUpComingEvent,
  meetingTranscriptDownloaded,
  meetingMinutesDownloaded,
} from "../../store/actions/NewMeetingActions";
import {
  meetingAgendaStartedMQTT,
  meetingAgendaEndedMQTT,
  meetingAgendaUpdatedMQTT,
} from "../../store/actions/MeetingAgenda_action";
import {
  deleteCommentsMQTT,
  postComments,
} from "../../store/actions/Post_AssigneeComments";
import "./Dashboard.css";
import {
  realtimeGroupStatusResponse,
  realtimeGroupResponse,
  removeGroupMemberMQTT,
} from "../../store/actions/Groups_actions";
import {
  realtimeCommitteeResponse,
  realtimeCommitteeStatusResponse,
  removeCommitteeMemberMQTT,
} from "../../store/actions/Committee_actions";
import { mqttConnection } from "../../commen/functions/mqttconnection";
import { useTranslation } from "react-i18next";
import {
  castYourVotePollModal,
  createPollCommitteesMQTT,
  createPollGroupsMQTT,
  createPollMeetingMQTT,
  deletePollsMQTT,
  notifyPollingSocket,
} from "../../store/actions/Polls_actions";
import {
  changeMQTTJSONOne,
  changeMQQTTJSONTwo,
} from "../../commen/functions/MQTTJson";
import {
  resolutionMQTTCancelled,
  resolutionMQTTClosed,
  resolutionMQTTCreate,
  resolutionMQTTVoteCounter,
} from "../../store/actions/Resolution_actions";
import {
  createGoogleEventMQTT,
  createMicrosftEventMQTT,
  deleteGoogleEventMQTT,
  deleteMicrosftEventMQTT,
  updateGoogletEventMQTT,
  updateMicrosftEventMQTT,
} from "../../store/actions/GetDataForCalendar";
import { userLogOutApiFunc } from "../../store/actions/Auth_Sign_Out";
import {
  checkFeatureIDAvailability,
  getLocalStorageItemNonActiveCheck,
  getMeetingValues,
} from "../../commen/functions/utils";
import { Col, Row } from "react-bootstrap";
import InternetConnectivityModal from "../pages/UserMangement/ModalsUserManagement/InternetConnectivityModal/InternetConnectivityModal";
import { InsternetDisconnectModal } from "../../store/actions/UserMangementModalActions";
import {
  fileRemoveMQTT,
  fileSharedMQTT,
  folderRemoveMQTT,
  folderSharedMQTT,
} from "../../store/actions/DataRoom_actions";
import MobileAppPopUpModal from "../pages/UserMangement/ModalsUserManagement/MobileAppPopUpModal/MobileAppPopUpModal";
import LeaveVideoIntimationModal from "../../components/layout/talk/videoCallScreen/LeaveVideoIntimationModal/LeaveVideoIntimationModal";
import {
  admitGuestUserRequest,
  hideUnhideSelfMainApi,
  muteUnMuteSelfMainApi,
  raiseUnRaisedHandMainApi,
  transferMeetingHostSuccess,
} from "../../store/actions/Guest_Video";
import { DiskusGlobalUnreadNotificationCount } from "../../store/actions/UpdateUserNotificationSetting";
import CancelConfirmationModal from "../pages/meeting/cancelConfimationModal/CancelConfirmationModal";
import { useMeetingContext } from "../../context/MeetingContext";
import {
  MinuteReviwerCount,
  SignatureDocumentActionByMe,
  SignatureDocumentReceived,
  SignatureDocumentReceivedMyMe,
  SignatureDocumentStatusChange,
  SignatureDocumentStatusChangeSignees,
} from "../../store/actions/workflow_actions";
import { showMessage } from "../../components/elements/snack_bar/utill";
import {
  meetingVideoRecording,
  videoRecording,
} from "../../store/actions/DataRoom2_actions";

import AlreadyInMeeting from "../../components/elements/alreadyInMeeting/AlreadyInMeeting";
import { setInactiveStatusData } from "../../store/actions/ComplainSettingActions";

const Dashboard = () => {
  const location = useLocation();

  const { Sider, Content } = Layout;

  const navigate = useNavigate();

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const {
    editorRole,
    cancelConfirmationModal,
    setPresenterForOneToOneOrGroup,
    setLeaveOneToOne,
    setGroupVideoCallAccepted,
    setGroupCallParticipantList,
    setUnansweredCallParticipant,
    iframeRef,
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    setStopRecordingState,
    startRecordingState,
    pauseRecordingState,
    resumeRecordingState,
    stopRecordingState,
    setIsVisible,
    setUnReadCountNotification,
    setPendingApprovalTabCount,
    setInCallParticipantsList,
  } = useMeetingContext();

  let iframe = iframeRef.current;

  let i18nextLng = localStorage.getItem("i18nextLng");

  let createrID = localStorage.getItem("userID");

  let currentOrganization = localStorage.getItem("organizationID");

  let currentUserName = localStorage.getItem("name");

  const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

  const cancelModalMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.cancelModalMeetingDetails
  );
  const isInternetDisconnectModalVisible = useSelector(
    (state) => state.UserManagementModals.internetDisconnectModal
  );
  const mobileAppPopUp = useSelector(
    (state) => state.UserManagementModals.mobileAppPopUp
  );
  const IncomingVideoCallFlagReducer = useSelector(
    (state) => state.videoFeatureReducer.IncomingVideoCallFlag
  );

  const VideoMainReducerResponseMessage = useSelector(
    (state) => state.VideoMainReducer.ResponseMessage
  );

  const maxParticipantVideoRemovedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoRemovedFlag
  );

  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );

  const getJoinMeetingParticipantorHostrequest = useSelector(
    (state) => state.videoFeatureReducer.getJoinMeetingParticipantorHostrequest
  );

  const maximizeParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.maximizeParticipantVideoFlag
  );

  const MaximizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeVideoFlag
  );

  const ShowGuestPopup = useSelector(
    (state) => state.videoFeatureReducer.ShowGuestPopup
  );

  const VideoChatMessagesFlagReducer = useSelector(
    (state) => state.videoFeatureReducer.VideoChatMessagesFlag
  );

  const MinimizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MinimizeVideoFlag
  );

  const MeetingStatusEnded = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusEnded
  );

  const waitingParticipantsList = useSelector(
    (state) => state.videoFeatureReducer.waitingParticipantsList
  );

  const showInitimationMessegeModalLeaveVideoMeeting = useSelector(
    (state) => state.VideoMainReducer.LeaveVideoIntimationMessegeGlobalState
  );

  const videoControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.videoControlForParticipant
  );

  const audioControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.audioControlForParticipant
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const leavePresenterOrJoinOtherCalls = useSelector(
    (state) => state.videoFeatureReducer.leavePresenterOrJoinOtherCalls
  );

  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare
  );

  const raisedUnRaisedParticipant = useSelector(
    (state) => state.videoFeatureReducer.raisedUnRaisedParticipant
  );

  const disableBeforeJoinZoom = useSelector(
    (state) => state.videoFeatureReducer.disableBeforeJoinZoom
  );

  console.log(raisedUnRaisedParticipant, "raisedUnRaisedParticipant");

  console.log(
    {
      startRecordingState,
      pauseRecordingState,
      resumeRecordingState,
      stopRecordingState,
    },
    "CheckisPausedOccurOrNot"
  );

  const [checkInternet, setCheckInternet] = useState(navigator);

  // for real time Notification
  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });

  //State For Meeting Data
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [activateBlur, setActivateBlur] = useState(false);
  const [notificationID, setNotificationID] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  localStorage.setItem("MqttConnectionState", isOnline);

  let Blur = localStorage.getItem("blur");

  let newClient = Helper.socket;
  // for close the realtime Notification bar
  const presenterViewJoinFlagRef = useRef(presenterViewJoinFlag);
  const presenterViewHostFlagFlagRef = useRef(presenterViewHostFlag);
  const presenterViewFlagRef = useRef(presenterViewFlag);
  const maximizeParticipantVideoFlagRef = useRef(maximizeParticipantVideoFlag);
  const getJoinMeetingParticipantorHostrequestGuidRef = useRef(
    getJoinMeetingParticipantorHostrequest
  );
  const getJoinMeetingParticipantorHostrequestRoomIdRef = useRef(
    getJoinMeetingParticipantorHostrequest
  );

  // Update ref whenever presenterViewJoinFlag changes
  useEffect(() => {
    presenterViewJoinFlagRef.current = presenterViewJoinFlag;
  }, [presenterViewJoinFlag]);

  useEffect(() => {
    presenterViewHostFlagFlagRef.current = presenterViewHostFlag;
  }, [presenterViewHostFlag]);

  useEffect(() => {
    presenterViewFlagRef.current = presenterViewFlag;
  }, [presenterViewFlag]);

  useEffect(() => {
    maximizeParticipantVideoFlagRef.current = maximizeParticipantVideoFlag;
  }, [maximizeParticipantVideoFlag]);

  useEffect(() => {
    if (getJoinMeetingParticipantorHostrequest) {
      getJoinMeetingParticipantorHostrequestGuidRef.current =
        getJoinMeetingParticipantorHostrequest
          ? getJoinMeetingParticipantorHostrequest.roomID
          : 0;
      getJoinMeetingParticipantorHostrequestRoomIdRef.current =
        getJoinMeetingParticipantorHostrequest
          ? getJoinMeetingParticipantorHostrequest.roomID
          : 0;
    }
  }, [getJoinMeetingParticipantorHostrequest]);

  const leaveMeetingCall = async (data) => {
    let getUserID =
      localStorage.getItem("userID") !== null && localStorage.getItem("userID");
    if (
      Number(getUserID) === Number(data?.authToken?.userID) &&
      Number(data?.deviceID) === 1
    ) {
      let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
      let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
      if (isMeeting) {
        if (isMeetingVideo) {
          dispatch(leaveMeetingVideoOnlogout(true));
        } else {
          dispatch(leaveMeetingOnlogout(true));
        }
      } else {
        dispatch(userLogOutApiFunc(navigate, t));
      }
    }
  };

  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };

  function checkCallStatus(data) {
    return !data.some(
      (item) => item.CallStatus === "Accepted" || item.CallStatus === "ringing"
    );
  }

  const closeModal = () => {
    localStorage.removeItem("packageFeatureIDs");
    localStorage.removeItem("LocalUserRoutes");
    localStorage.removeItem("VERIFICATION");

    dispatch(userLogOutApiFunc(navigate, t));
  };

  useEffect(() => {
    if (checkInternet.onLine) {
      dispatch(InsternetDisconnectModal(false));
    } else {
      dispatch(InsternetDisconnectModal(true));
    }
  }, [checkInternet.onLine]);
  const activeCallsessionStorage =
    sessionStorage.getItem("activeCallSessionforOtoandGroup") !== null
      ? sessionStorage.getItem("activeCallSessionforOtoandGroup")
      : null;
  const activeCallLocalStorage =
    localStorage.getItem("activeCall") !== null &&
    JSON.parse(localStorage.getItem("activeCall"));
  // useEffect(() => {
  //   const activeCall = sessionStorage.getItem(
  //     "activeCallSessionforOtoandGroup"
  //   );

  //   if (activeCall === "true") {
  //     // Redirect to AlreadyInGroupAndOtoCall page
  //     navigate("Diskus/AlreadyInGroupAndOtoCall");
  //   }
  // }, [navigate]);

  // For End QUick Meeting

  const meetingEnded = (payload) => {
    console.log("mqtt mqmqmqmqmqmq", payload);
    let meetingVideoID = localStorage.getItem("currentMeetingID");
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    if (Number(meetingVideoID) === Number(payload?.meeting?.pK_MDID)) {
      if (isMeeting) {
        console.log("mqtt mqmqmqmqmqmq");
        let typeOfMeeting = localStorage.getItem("typeOfMeeting");
        if (String(typeOfMeeting) === "isQuickMeeting") {
          console.log("mqtt mqmqmqmqmqmq");
          if (isMeetingVideo) {
            console.log("mqtt mqmqmqmqmqmq");
            dispatch(endMeetingStatusForQuickMeetingVideo(true));
          } else {
            console.log("mqtt mqmqmqmqmqmq");
            dispatch(endMeetingStatusForQuickMeetingModal(true));
          }
        } else if (String(typeOfMeeting) === "isAdvanceMeeting") {
          console.log("mqtt mqmqmqmqmqmq");
          if (isMeetingVideo) {
            console.log("mqtt mqmqmqmqmqmq");
            dispatch(leaveMeetingVideoOnEndStatusMqtt(true));
            dispatch(leaveMeetingOnEndStatusMqtt(true));
          } else {
            console.log("mqtt mqmqmqmqmqmq");
            dispatch(leaveMeetingOnEndStatusMqtt(true));
          }
        }
      }
    }
  };

  const startPresenterView = async (payload) => {
    console.log("mqtt mqmqmqmqmqmq", payload);
    let meetingVideoID = localStorage.getItem("currentMeetingID");
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let alreadyInMeetingVideoStartPresenterCheck = JSON.parse(
      sessionStorage.getItem("alreadyInMeetingVideoStartPresenterCheck")
    );
    let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
    let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    let handStatus = JSON.parse(localStorage.getItem("handStatus"));
    let currentCallType = Number(localStorage.getItem("callTypeID"));
    let isGuid = localStorage.getItem("isGuid");
    let participantUID = localStorage.getItem("participantUID");
    let newRoomId = localStorage.getItem("newRoomId");
    let participantRoomId = localStorage.getItem("participantRoomId");
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    console.log("mqtt mqmqmqmqmqmq", activeCallState);
    console.log("mqtt mqmqmqmqmqmq", currentCallType);

    if (isMeeting) {
      console.log("mqtt mqmqmqmqmqmq", currentCallType);
      // denied screen should be closed when presentation is started
      dispatch(maxParticipantVideoDenied(false));

      if (String(meetingVideoID) === String(payload?.meetingID)) {
        if (maxParticipantVideoRemovedFlag) {
          // remove Screen Should be closed when presentation is started
          await dispatch(maxParticipantVideoRemoved(false));
        }
        console.log("maximizeParticipantVideoFlag");
        if (handStatus) {
          if (!isZoomEnabled || !disableBeforeJoinZoom) {
            console.log("maximizeParticipantVideoFlag");
            let data = {
              RoomID: String(
                isMeetingVideoHostCheck ? newRoomId : participantRoomId
              ),
              UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
              IsHandRaised: false,
            };
            await dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
          }
        }
        showMessage(t("Presenter-view-started"), "success", setOpen);
        console.log("mqtt mqmqmqmqmqmq", currentCallType);
        if (alreadyInMeetingVideoStartPresenterCheck) {
          console.log("mqtt mqmqmqmqmqmq");

          sessionStorage.removeItem("alreadyInMeetingVideoStartPresenterCheck");
        } else if (
          activeCallState &&
          (currentCallType === 1 || currentCallType === 2)
        ) {
          console.log("mqtt mqmqmqmqmqmq", payload);
          setPresenterForOneToOneOrGroup(true);
          await dispatch(nonMeetingVideoGlobalModal(true));
        } else if (isMeetingVideo) {
          console.log("mqtt mqmqmqmqmqmq");
          localStorage.setItem("isWebCamEnabled", true);
          localStorage.setItem("isMicEnabled", true);
          localStorage.removeItem("CallType");

          let isWaiting = JSON.parse(sessionStorage.getItem("isWaiting"));
          let leaveRoomId =
            getJoinMeetingParticipantorHostrequestRoomIdRef.current;
          let userGUID = getJoinMeetingParticipantorHostrequestGuidRef.current;
          let newName = localStorage.getItem("name");
          let currentMeetingID = localStorage.getItem("currentMeetingID");
          let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
          if (isWaiting) {
            console.log("mqtt mqmqmqmqmqmq");
            sessionStorage.removeItem("isWaiting");
            console.log("maximizeParticipantVideoFlag");
            let Data = {
              RoomID: leaveRoomId,
              UserGUID: userGUID,
              Name: String(newName),
              IsHost: false,
              MeetingID: Number(currentMeetingID),
            };
            console.log("maximizeParticipantVideoFlag");
            let data = {
              VideoCallURL: String(currentMeetingVideoURL || ""),
              Guid: "",
              WasInVideo: Boolean(isMeetingVideo),
            };
            console.log("maximizeParticipantVideoFlag");
            dispatch(LeaveMeetingVideo(Data, navigate, t, 2, data));
          } else {
            console.log("mqtt mqmqmqmqmqmq");
            dispatch(stopScreenShareOnPresenterStarting(true));
            // let newRoomID = localStorage.getItem("newRoomId");
            // let activeRoomID = localStorage.getItem("activeRoomID");
            // if (newRoomID) {
            //   localStorage.setItem("acceptedRoomID", newRoomID);
            // } else {
            //   localStorage.setItem("acceptedRoomID", activeRoomID);
            // }

            // console.log("maximizeParticipantVideoFlag");
            // sessionStorage.setItem("alreadyInMeetingVideo", true);
            // dispatch(participantWaitingListBox(false));
            // dispatch(toggleParticipantsVisibility(false));
            // await dispatch(
            //   presenterViewGlobalState(meetingVideoID, true, false, true)
            // );
            // dispatch(setAudioControlHost(true));
            // dispatch(setVideoControlHost(true));
            // dispatch(maximizeVideoPanelFlag(true));
            // dispatch(normalizeVideoPanelFlag(false));
            // dispatch(minimizeVideoPanelFlag(false));
          }
        } else if (
          !presenterViewFlagRef.current &&
          !presenterViewJoinFlagRef.current
        ) {
          console.log("mqtt mqmqmqmqmqmq");
          console.log("maximizeParticipantVideoFlag");
          if (maximizeParticipantVideoFlagRef.current) {
            console.log("maximizeParticipantVideoFlag");
            console.log("mqtt mqmqmqmqmqmq");

            console.log("maximizeParticipantVideoFlag");

            dispatch(videoIconOrButtonState(false));
            dispatch(participantVideoButtonState(false));
            dispatch(maxParticipantVideoCallPanel(false));
            let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
            let data = {
              VideoCallURL: String(currentMeetingVideoURL),
              WasInVideo: isMeetingVideo ? true : false,
            };
            dispatch(participantWaitingListBox(false));

            dispatch(joinPresenterViewMainApi(navigate, t, data));
          } else {
            console.log("mqtt mqmqmqmqmqmq");
            let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
            let data = {
              VideoCallURL: String(currentMeetingVideoURL),
              WasInVideo: isMeetingVideo ? true : false,
            };
            console.log("mqtt mqmqmqmqmqmq");
            dispatch(participantWaitingListBox(false));

            dispatch(joinPresenterViewMainApi(navigate, t, data));
          }
        }
      }
    }
  };

  const stopPresenterView = async (payload) => {
    console.log("mqtt mqmqmqmqmqmq");
    let StopPresenterViewAwait = JSON.parse(
      sessionStorage.getItem("StopPresenterViewAwait")
    );
    let userIDCurrent = Number(localStorage.getItem("userID"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
    let currentCallType = Number(localStorage.getItem("CallType"));
    let refinedVideoUrl = localStorage.getItem("refinedVideoUrl");
    let hostUrl = localStorage.getItem("hostUrl");
    let newRoomId = localStorage.getItem("newRoomId");
    let participantRoomId = localStorage.getItem("participantRoomId");
    let isGuid = localStorage.getItem("isGuid");
    let participantUID = localStorage.getItem("participantUID");
    let meetingVideoID = localStorage.getItem("currentMeetingID");
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let alreadyInMeetingVideo = JSON.parse(
      sessionStorage.getItem("alreadyInMeetingVideo")
        ? sessionStorage.getItem("alreadyInMeetingVideo")
        : false
    );
    console.log(
      String(meetingVideoID) === String(payload?.meetingID),
      "mqtt mqmqmqmqmqmq"
    );
    if (String(meetingVideoID) === String(payload?.meetingID)) {
      console.log("mqtt mqmqmqmqmqmq", payload);
      console.log("mqtt mqmqmqmqmqmq", isMeetingVideo);
      // dispatch(setAudioControlHost(false));
      // console.log("videoHideUnHideForHost");
      // dispatch(setVideoControlHost(true));
      dispatch(setRaisedUnRaisedParticiant(false));
      dispatch(clearPresenterParticipants());
      if (isMeeting) {
        console.log("mqtt mqmqmqmqmqmq", StopPresenterViewAwait);
        console.log("mqtt mqmqmqmqmqmq", currentCallType);
        console.log(
          "typeof StopPresenterViewAwait:",
          typeof StopPresenterViewAwait
        );
        console.log("value:", StopPresenterViewAwait);
        if (
          activeCallState &&
          (currentCallType === 1 || currentCallType === 2)
        ) {
          dispatch(presenterViewGlobalState(0, false, false, false));

          console.log("mqtt mqmqmqmqmqmq", payload);
        } else if (StopPresenterViewAwait == null) {
          console.log("mqtt mqmqmqmqmqmq", presenterViewJoinFlagRef.current);
          if (presenterViewFlagRef.current) {
            console.log("mqtt mqmqmqmqmqmq", alreadyInMeetingVideo);
            if (alreadyInMeetingVideo && presenterViewJoinFlagRef.current) {
              console.log("mqtt mqmqmqmqmqmq");
              sessionStorage.removeItem("alreadyInMeetingVideo");
              dispatch(setAudioControlHost(false));

              let dataAudio = {
                RoomID: String(
                  isMeetingVideoHostCheck ? newRoomId : participantRoomId
                ),
                IsMuted: false, // Ensuring it's a boolean
                UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
                MeetingID: payload?.meetingID,
              };

              // // Dispatch the API request with the data
              dispatch(muteUnMuteSelfMainApi(navigate, t, dataAudio, 1));
              let dataVideo = {
                RoomID: String(
                  isMeetingVideoHostCheck ? newRoomId : participantRoomId
                ),
                HideVideo: true, // Ensuring it's a boolean
                UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
                MeetingID: Number(payload?.meetingID),
              };

              // // Dispatch the API request with the data
              dispatch(hideUnhideSelfMainApi(navigate, t, dataVideo, 1));

              let data = {
                RoomID: String(
                  isMeetingVideoHostCheck ? newRoomId : participantRoomId
                ),
                UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
                IsHandRaised: false,
              };

              localStorage.setItem("isWebCamEnabled", true);
              localStorage.setItem("isMicEnabled", false);
              localStorage.setItem("isMeetingVideo", true);

              await dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
              console.log("videoHideUnHideForHost");
              dispatch(setVideoControlHost(true));
              dispatch(participantVideoButtonState(true));
              await dispatch(presenterViewGlobalState(0, false, false, false));
              dispatch(maximizeVideoPanelFlag(true));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              console.log("mqtt mqmqmqmqmqmq");
            } else {
              sessionStorage.removeItem("alreadyInMeetingVideo");
              console.log("mqtt mqmqmqmqmqmq");
              localStorage.removeItem("participantUID");
              localStorage.removeItem("isGuid");
              localStorage.removeItem("videoIframe");
              localStorage.removeItem("presenterViewvideoURL");
              localStorage.removeItem("acceptedRoomID");
              localStorage.removeItem("newRoomId");
              localStorage.removeItem("acceptedRoomID");
              dispatch(setAudioControlHost(false));
              console.log("videoHideUnHideForHost");
              dispatch(setVideoControlHost(false));
              dispatch(presenterViewGlobalState(0, false, false, false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
            }
          }
        } else {
          console.log("Check Console StopPresenterViewAwait");
          sessionStorage.removeItem("StopPresenterViewAwait");
        }

        if (alreadyInMeetingVideo) {
          if (isMeetingVideoHostCheck) {
            if (payload.hostID !== userIDCurrent) {
              // remove me from host
              const meetingHost = {
                isHost: false,
                isHostId: 0,
                isDashboardVideo: true,
              };
              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
              dispatch(makeHostNow(meetingHost));
              localStorage.setItem("hostUrl", refinedVideoUrl);
              localStorage.setItem("participantRoomId", newRoomId);
              localStorage.setItem("participantUID", isGuid);
              localStorage.setItem("isMeetingVideoHostCheck", false);
              localStorage.setItem("isHost", false);
              // localStorage.removeItem("isGuid");
              dispatch(participantWaitingListBox(false));
              dispatch(toggleParticipantsVisibility(false));
              console.log("check 22");
              if (!leavePresenterOrJoinOtherCalls) {
                let Data = {
                  RoomID: String(newRoomId),
                };
                await dispatch(
                  getVideoCallParticipantsMainApi(Data, navigate, t)
                );
              }
              await dispatch(transferMeetingHostSuccess(true));
            }
          } else {
            if (payload.hostID === userIDCurrent) {
              const meetingHost = {
                isHost: true,
                isHostId: userIDCurrent,
                isDashboardVideo: true,
              };
              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
              dispatch(makeHostNow(meetingHost));
              localStorage.setItem("refinedVideoUrl", hostUrl);
              localStorage.setItem("newRoomId", participantRoomId);
              localStorage.setItem("isGuid", participantUID);
              localStorage.setItem("isMeetingVideoHostCheck", true);
              localStorage.setItem("isHost", true);
              console.log("check 22");
              dispatch(videoIconOrButtonState(true));
              dispatch(participantVideoButtonState(false));
              let Data = {
                RoomID: String(participantRoomId),
              };
              dispatch(participantListWaitingListMainApi(Data, navigate, t));
              // make me host
            }
          }
          dispatch(participanMuteUnMuteMeeting(false, true, true, true, 1));
        }
      }
    }
  };

  // async function joinRequestForMeetingVideo(mqttData) {
  //   try {
  //     const currentMeetingID = localStorage.getItem("currentMeetingID");
  //     const isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  //     const isMeetingVideoHostCheck = JSON.parse(
  //       localStorage.getItem("isMeetingVideoHostCheck")
  //     );
  //     if (Number(mqttData.payload.meetingID) === Number(currentMeetingID))
  //       if (isMeetingVideo) {
  //         if (presenterViewJoinFlagRef.current) {
  //           console.log("Check PresenterIssue Once");
  //         } else {
  //           console.log("Check PresenterIssue Once");
  //           if (isMeetingVideoHostCheck) {
  //             console.log("Check PresenterIssue Once");
  //             if (mqttData.payload.isGuest) {
  //               dispatch(admitGuestUserRequest(mqttData.payload));
  //             } else {
  //               console.log("Check PresenterIssue Once");
  //               dispatch(participantWaitingList(mqttData.payload));
  //             }
  //             dispatch(guestJoinPopup(true));
  //           }
  //         }
  //       }
  //   } catch {}
  // }

  async function joinRequestForMeetingVideo(mqttData) {
    try {
      const currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
      const isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
      const isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );

      const { meetingID, userID } = mqttData.payload;

      if (Number(meetingID) !== currentMeetingID) return;

      // ✅ Check for duplicates in the Redux array
      const alreadyRequested = waitingParticipantsList?.some(
        (p) =>
          Number(p.userID) === Number(userID) &&
          Number(p.meetingID) === Number(meetingID)
      );
      console.log(alreadyRequested, "Filtered unique participants");

      if (alreadyRequested) {
        console.log("Duplicate join request ignored for user:", userID);
        return;
      }

      // ✅ Dispatch to Redux ONLY if not duplicate
      if (isMeetingVideo && isMeetingVideoHostCheck) {
        if (mqttData.payload.isGuest) {
          dispatch(admitGuestUserRequest(mqttData.payload));
        } else {
          dispatch(participantWaitingList(mqttData.payload));
        }
        dispatch(guestJoinPopup(true));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const sendStopRecordingMessageForMQTT = () => {
    let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    let CallType = Number(localStorage.getItem("CallType"));

    return new Promise((resolve) => {
      if (!isZoomEnabled) {
        resolve(); // Zoom not enabled, no need to send message
        return;
      }
      console.log("RecordingStopMsgFromIframe from MQTT");
      const iframe = iframeRef.current;

      if (CallType === 1 || CallType === 2) {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
          console.log("RecordingStopMsgFromIframe from MQTT");
        }

        // Short delay to ensure iframe handles message
        setTimeout(() => {
          resolve();
        }, 100);
      } else {
        resolve(); // Not a caller or irrelevant CallType
      }
    });
  };

  const onHandleClickForStartRecording = () => {
    return new Promise((resolve) => {
      const iframe = iframeRef.current;

      if (iframe && iframe.contentWindow) {
        console.log("Does Check Recording Start");
        iframe.contentWindow.postMessage("RecordingStartMsgFromIframe", "*");

        // Optional delay if iframe needs time to handle the message
        setTimeout(() => {
          resolve();
        }, 1000);
      } else {
        // Immediately resolve if iframe is not ready or Zoom isn't enabled
        resolve();
      }
    });
  };

  const onHandleClickForStopRecording = () => {
    return new Promise((resolve) => {
      const iframe = iframeRef.current;

      if (iframe && iframe.contentWindow) {
        console.log("Does Check Recording Start");
        iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");

        // Optional delay if iframe needs time to handle the message
        setTimeout(() => {
          resolve();
        }, 1000);
      } else {
        // Immediately resolve if iframe is not ready or Zoom isn't enabled
        resolve();
      }
    });
  };

  const handRaisedWhileHostTransferFunc = async () => {
    let participantRoomId = localStorage.getItem("participantRoomId");
    let participantUID = localStorage.getItem("participantUID");
    let newRoomId = localStorage.getItem("newRoomId");
    let isGuid = localStorage.getItem("isGuid");

    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let handStatus = JSON.parse(localStorage.getItem("handStatus"));

    if (isMeeting) {
      console.log("Check why host not transfer");
      if (isMeetingVideo) {
        console.log("Check why host not transfer");
        if (handStatus) {
          console.log("Check why host not transfer");

          let data = {
            RoomID: String(
              isMeetingVideoHostCheck ? newRoomId : participantRoomId
            ),
            UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
            IsHandRaised: false,
          };
          await dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
        }
      }
    }
  };

  const onMessageArrived = async (msg) => {
    let min = 10000;
    let max = 90000;
    let id = min + Math.random() * (max - min);
    let data = JSON.parse(msg.payloadString);
    try {
      if (data?.action?.toLowerCase() === "meeting" && data.payload) {
        try {
          const message = data.payload.message?.toLowerCase();

          switch (message) {
            case "new_meeting_creation": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_CREATION"),
                    "[Place holder]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(allMeetingsSocket(data.payload.meeting));
              break;
            }

            case "meeting_edited_host": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_EDITED_HOST"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(allMeetingsSocket(data.payload.meeting));
              break;
            }

            case "meeting_status_edited_started": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_STARTED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(getMeetingStatusfromSocket(data.payload));
              break;
            }

            case "meeting_status_edited_end": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_END"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              meetingEnded(data.payload);
              dispatch(mqttCurrentMeetingEnded(data.payload));
              break;
            }

            case "meeting_status_edited_cancelled": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_CANCELLED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(getMeetingStatusfromSocket(data.payload));
              break;
            }

            case "meeting_status_edited_admin": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_ADMIN"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(getMeetingStatusfromSocket(data.payload));
              break;
            }

            case "new_upcoming_events": {
              dispatch(
                setMQTTRequestUpcomingEvents(data.payload.upcomingEvents[0])
              );
              break;
            }

            case "meeting_status_edited_proposed": {
              dispatch(meetingStatusProposedMqtt(data.payload.meeting));
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_PROPOSED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
              }
              break;
            }

            case "meeting_status_edited_published": {
              const newMeeting = {
                ...data.payload.meeting,
                talkGroupID: data.payload.talkGroupID,
              };
              dispatch(meetingStatusPublishedMqtt(newMeeting));

              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_PUBLISHED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              break;
            }

            case "agenda_voting_started": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("AGENDA_VOTING_STARTED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaStartedMQTT(data.payload));
              break;
            }

            case "agenda_voting_ended": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("AGENDA_VOTING_ENDED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaEndedMQTT(data.payload));
              break;
            }

            case "new_meeting_agenda_added": {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("NEW_MEETING_AGENDA_ADDED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaUpdatedMQTT(data.payload));
              break;
            }

            case "new_meetings_count": {
              dispatch(getDashboardMeetingCountMQTT(data.payload));
              break;
            }

            default: {
              // Optional: log unhandled messages
              console.warn("Unhandled MQTT Meeting message:", message);
              break;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (data?.action?.toLowerCase() === "todo" && data.payload) {
        const message = data.payload.message?.toLowerCase();

        switch (message) {
          case "new_todo_creation": {
            dispatch(setTodoListActivityData(data.payload));

            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("NEW_TODO_CREATION"),
                  "[Task Title]",
                  data.payload.todoTitle.substring(0, 100)
                ),
              });
              setNotificationID(id);
            }
            break;
          }

          case "tdod_status_edited": {
            dispatch(setTodoStatusDataFormSocket(data.payload));

            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("TDOD_STATUS_EDITED"),
                  "[Task Title]",
                  data.payload.todoTitle.substring(0, 100)
                ),
              });
              setNotificationID(id);
            }
            break;
          }

          case "tdod_status_deleted": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("TDOD_STATUS_DELETED"),
                  "[Task Title]",
                  data.payload.todoTitle.substring(0, 100)
                ),
              });
              setNotificationID(id);
            }

            dispatch(setTodoStatusDataFormSocket(data.payload));
            break;
          }

          case "new_todo_deleted": {
            // No action defined (intentionally left blank)
            break;
          }

          case "new_todo_count": {
            dispatch(getDashboardTaskCountMQTT(data.payload));
            break;
          }

          case "new_comment_deletion": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQQTTJSONTwo(
                  t("NEW_COMMENT_DELETION"),
                  "[User]",
                  data.payload.comment.userName,
                  "[Task Title]",
                  data.payload.comment.todoTitle.substring(0, 100)
                ),
              });
              setNotificationID(id);
            }

            dispatch(deleteCommentsMQTT(data.payload));
            break;
          }

          default: {
            // Handle messages that require `includes`
            if (message?.includes("new_advance_meeting_todo")) {
              dispatch(createTaskMeetingMQTT(data.payload));

              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_TODO_CREATION"),
                    "[Task Title]",
                    data.payload.todoTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
            } else if (message?.includes("new_group_todo")) {
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_TODO_CREATION"),
                    "[Task Title]",
                    data.payload.todoTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(createTaskGroupMQTT(data.payload));
            } else if (message?.includes("new_committee_todo")) {
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_TODO_CREATION"),
                    "[Task Title]",
                    data.payload.todoTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(createTaskCommitteeMQTT(data.payload));
            } else {
              console.warn("Unhandled TODO MQTT message:", message);
            }

            break;
          }
        }
      }

      if (data?.action?.toLowerCase() === "comment" && data.payload) {
        const message = data.payload.message?.toLowerCase();

        switch (message) {
          case "new_comment_creation": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQQTTJSONTwo(
                  t("NEW_COMMENT_CREATION"),
                  "[User]",
                  data.payload.comment.userName,
                  "[Task Title]",
                  data.payload.todoTitle.substring(0, 100)
                ),
              });
              setNotificationID(id);
            }

            dispatch(postComments(data.payload.comment));
            break;
          }

          case "new_comment_deletion": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQQTTJSONTwo(
                  t("NEW_COMMENT_DELETION"),
                  "[User]",
                  data.payload.userName,
                  "[Task Title]",
                  data.payload.todoTitle.substring(0, 100)
                ),
              });
              setNotificationID(id);
            }

            dispatch(deleteCommentsMQTT(data.payload));
            break;
          }

          default: {
            console.warn("Unhandled COMMENT MQTT message:", message);
            break;
          }
        }
      }

      if (data?.action?.toLowerCase() === "notification" && data.payload) {
        const message = data.payload.message?.toLowerCase();

        const logoutWithDelay = () => {
          setTimeout(() => {
            if (data.payload.isLoggedOut) {
              dispatch(userLogOutApiFunc(navigate, t));
            }
          }, 4000);
        };

        const navigateHomeWithDelay = () => {
          setTimeout(() => {
            navigate("/");
          }, 4000);
        };

        const recentActivityDispatcher = (description) => {
          const payload = data.payload;
          if (!payload) return;

          dispatch(
            setRecentActivityDataNotification({
              creationDateTime: payload.creationDateTime,
              notificationTypes: {
                pK_NTID: payload.notificationStatusID,
                description,
                icon: "",
              },
              key: 0,
            })
          );
        };

        switch (message) {
          case "user_edited": {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("USER_ROLE_EDITED"),
                "[organizationName]",
                data.payload.organizationName
              ),
            });
            setNotificationID(id);
            logoutWithDelay();
            break;
          }

          case "user_deleted": {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("USER_DELETED"),
                "[organizationName]",
                data.payload.organizationName
              ),
            });
            setNotificationID(id);
            logoutWithDelay();
            break;
          }

          case "organization_subscription_cancelled": {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("ORGANIZATION_SUBSCRIPTION_CANCELLED"),
                "[organizationName]",
                data.payload.organizationName
              ),
            });
            setNotificationID(id);
            navigateHomeWithDelay();
            break;
          }

          case "organization_deleted": {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("ORGANIZATION_DELETED"),
                "[organizationName]",
                data.payload.organizationName
              ),
            });
            setNotificationID(id);
            navigateHomeWithDelay();
            break;
          }

          case "user_profile_edited": {
            setNotification({
              notificationShow: true,
              message: t("USER_PROFILE_EDITED"),
            });
            setNotificationID(id);
            break;
          }

          case "new_todo_creation_recent_activity": {
            recentActivityDispatcher(
              changeMQTTJSONOne(
                t("NEW_TODO_CREATION_RECENT_ACTIVITY"),
                "[Task Title]",
                data.payload.taskTitle
              )
            );
            break;
          }

          case "new_meetting_creation_recent_activity": {
            recentActivityDispatcher(
              t("NEW_MEETTING_CREATION_RECENT_ACTIVITY")
            );
            break;
          }

          case "new_poll_published_recent_activity": {
            recentActivityDispatcher(t("NEW_POLL_PUBLISHED_RECENT_ACTIVITY"));
            break;
          }

          case "poll_expired_recent_activity": {
            recentActivityDispatcher(t("POLL_EXPIRED_RECENT_ACTIVITY"));
            break;
          }

          case "poll_updated_recent_activity": {
            recentActivityDispatcher(t("POLL_UPDATED_RECENT_ACTIVITY"));
            break;
          }

          case "poll_deleted_recent_activity": {
            recentActivityDispatcher("The Poll has been deleted");
            break;
          }

          case "organization_subscription_inactive": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: t(
                  "Your-subscription-status-has-been-set-to-in-active"
                ),
              });
            }
            setNotificationID(id);
            logoutWithDelay();
            break;
          }

          case "organization_subscription_suspended": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: t("Your-subscription-has-been-suspended"),
              });
            }
            setNotificationID(id);
            logoutWithDelay();
            break;
          }

          case "organization_status_inactive": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: t(
                  "Your-organization-status-has-been-set-to-in-active"
                ),
              });
            }
            setNotificationID(id);
            logoutWithDelay();
            break;
          }

          case "organization_status_suspended": {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: t("Your-organization-status-has-been-suspended"),
              });
            }
            setNotificationID(id);
            logoutWithDelay();
            break;
          }

          case "new_group_creation_recent_activity":
          case "meeting_status_edited_started":
          case "new_todo_deleted_recent_activity": {
            // Intentionally left blank (future handling)
            break;
          }

          default: {
            console.warn("Unhandled NOTIFICATION MQTT message:", message);
            break;
          }
        }
      }

      if (data.action.toLowerCase() === "committee" && data.payload) {
        switch (data.payload.message.toLowerCase()) {
          case "new_committee_creation":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("NEW_COMMITTEE_CREATION"),
                  "[Committe Title]",
                  data.payload.committees.committeesTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeCommitteeResponse(data.payload.committees));
            setNotificationID(id);
            break;

          case "new_member_added_in_committee":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("NEW_MEMBER_ADDED_IN_COMMITTEE"),
                  "[Committee Title]",
                  data.payload.committees.committeesTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeCommitteeResponse(data.payload.committees));
            setNotificationID(id);
            break;

          case "committtee_status_edited_in_active":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("COMMITTTEE_STATUS_EDITED_IN_ACTIVE"),
                  "[Committee Title]",
                  data.payload.committeeTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeCommitteeStatusResponse(data.payload));
            setNotificationID(id);
            break;

          case "committtee_status_edited_archived":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("COMMITTTEE_STATUS_EDITED_ARCHIVED"),
                  "[Committee Title]",
                  data.payload.committeeTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeCommitteeStatusResponse(data.payload));
            setNotificationID(id);
            break;

          case "committtee_status_edited_active":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("COMMITTTEE_STATUS_EDITED_ACTIVE"),
                  "[Committee Title]",
                  data.payload.committeeTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeCommitteeStatusResponse(data.payload));
            setNotificationID(id);
            break;

          case "member_removed_from_committee":
            dispatch(removeCommitteeMemberMQTT(data.payload));
            setNotificationID(id);

            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("MEMBER_REMOVED_FROM_COMMITTEE"),
                  "[Committee Title]",
                  data.payload.committees.committeesTitle.substring(0, 100)
                ),
              });
            }
            break;

          default:
            break;
        }
      }
      if (data.action.toLowerCase() === "group") {
        console.log(data.action, "actionactionactionaction");

        switch (data.payload.message.toLowerCase()) {
          case "new_group_creation":
            console.log(data.payload.message, "actionactionactionaction");
            console.log(data.viewable, "actionactionactionaction");
            console.log(data.payload, "actionactionactionaction");

            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("NEW_GROUP_CREATION"),
                  "[Group Title]",
                  data.payload.groups.groupTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeGroupResponse(data.payload.groups));
            setNotificationID(id);
            break;

          case "new_group_member_added":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("NEW_GROUP_MEMBER_ADDED"),
                  "[Group Title]",
                  data.payload.groups.groupTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeGroupResponse(data.payload.groups));
            setNotificationID(id);
            break;

          case "group_status_edited_in-active":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("GROUP_STATUS_EDITED_IN-ACTIVE"),
                  "[Group Title]",
                  data.payload.groupTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeGroupStatusResponse(data.payload));
            setNotificationID(id);
            break;

          case "group_status_edited_archived":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("GROUP_STATUS_EDITED_ARCHIVED"),
                  "[Group Title]",
                  data.payload.groupTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeGroupStatusResponse(data.payload));
            setNotificationID(id);
            break;

          case "group_member_removed":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("GROUP_MEMBER_REMOVED"),
                  "[Group Title]",
                  data.payload.groups.groupTitle.substring(0, 100)
                ),
              });
            }
            dispatch(removeGroupMemberMQTT(data.payload));
            setNotificationID(id);
            break;

          case "group_status_edited_active":
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("GROUP_STATUS_EDITED_ACTIVE"),
                  "[Group Title]",
                  data.payload.groupTitle.substring(0, 100)
                ),
              });
            }
            dispatch(realtimeGroupStatusResponse(data.payload));
            setNotificationID(id);
            break;

          default:
            break;
        }
      }

      if (
        data.action.toLowerCase() === "talk" &&
        checkFeatureIDAvailability(3)
      ) {
        switch (data.payload.message.toLowerCase()) {
          case "new_one_to_one_message": {
            let newMessageData = data.payload.data[0];
            let activeOtoChatID = localStorage.getItem("activeOtoChatID");

            if (data.payload.data[0].senderID !== parseInt(createrID)) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: `You have received a new message from ${data.payload.data[0].senderName}`,
              });
            }

            dispatch(mqttInsertOtoMessage(data.payload));
            setNotificationID(id);

            if (
              data.payload.data[0].senderID !== parseInt(createrID) &&
              (parseInt(activeOtoChatID) !== data.payload.data[0].senderID ||
                parseInt(activeOtoChatID) === 0)
            ) {
              let apiAcknowledgementData = {
                TalkRequest: {
                  ChannelID: newMessageData.channelID,
                  Chat: {
                    ChatID: newMessageData.senderID,
                    MyID: parseInt(createrID),
                    MessageStatus: "Delivered",
                    SenderID: newMessageData.senderID,
                    MessageID: newMessageData.messageID,
                    ChatType: "O",
                  },
                },
              };
              dispatch(
                UpdateMessageAcknowledgement(
                  apiAcknowledgementData,
                  t,
                  navigate
                )
              );
            } else if (
              data.payload.data[0].senderID !== parseInt(createrID) &&
              (parseInt(activeOtoChatID) === data.payload.data[0].senderID ||
                parseInt(activeOtoChatID) !== 0)
            ) {
              let apiAcknowledgementData = {
                TalkRequest: {
                  ChannelID: newMessageData.channelID,
                  Chat: {
                    ChatID: newMessageData.senderID,
                    MyID: parseInt(createrID),
                    MessageStatus: "Seen",
                    SenderID: newMessageData.senderID,
                    MessageID: newMessageData.messageID,
                    ChatType: "O",
                  },
                },
              };
              dispatch(
                UpdateMessageAcknowledgement(
                  apiAcknowledgementData,
                  t,
                  navigate
                )
              );
            }
            break;
          }

          case "new_group_message":
            if (data.payload.data[0].senderID !== parseInt(createrID)) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: `${data.payload.data[0].senderName} has sent a message in group ${data.payload.data[0].groupName}`,
              });
            }
            dispatch(mqttInsertPrivateGroupMessage(data.payload));
            setNotificationID(id);
            break;

          case "user_is_blocked":
            setNotification({
              ...notification,
              notificationShow: true,
              message: "Selected user is blocked",
            });
            dispatch(mqttBlockUser(data.payload));
            setNotificationID(id);
            break;

          case "user_is_unblocked":
            setNotification({
              ...notification,
              notificationShow: true,
              message: "Selected user is Unblocked",
            });
            dispatch(mqttUnblockUser(data.payload));
            setNotificationID(id);
            break;

          case "message_flagged":
            setNotification({
              ...notification,
              notificationShow: true,
              message: "Message Starred",
            });
            dispatch(mqttStarMessage(data.payload));
            setNotificationID(id);
            break;

          case "message_unflagged":
            setNotification({
              ...notification,
              notificationShow: true,
              message: "Message Unstarred",
            });
            dispatch(mqttUnstarMessage(data.payload));
            setNotificationID(id);
            break;

          case "new_group_created":
            setNotification({
              ...notification,
              notificationShow: true,
              message: `You have been added in Talk Group for ${data.payload.data[0].fullName}`,
            });
            dispatch(mqttGroupCreated(data.payload));
            setNotificationID(id);
            break;

          case "group_modified":
            setNotification({
              ...notification,
              notificationShow: true,
              message: `Group ${data.payload.data[0].fullName} has updated`,
            });
            dispatch(mqttGroupUpdated(data.payload));
            setNotificationID(id);
            break;

          case "unread_messages_count":
            dispatch(mqttUnreadMessageCount(data.payload));
            break;

          case "new_broadcast_message":
            setNotification({
              ...notification,
              notificationShow: true,
              message: `You have sent a message in broadcast list ${data.payload.data[0].broadcastName}`,
            });
            dispatch(mqttInsertBroadcastMessage(data.payload));
            setNotificationID(id);
            break;

          case "message_delivered":
          case "message_seen":
            dispatch(mqttMessageStatusUpdate(data.payload));
            setNotificationID(id);
            break;

          case "message_deleted":
            dispatch(mqttMessageDeleted(data.payload));
            setNotification({
              ...notification,
              notificationShow: true,
              message: "Message Deleted",
            });
            setNotificationID(id);
            break;

          case "user_left_the_group":
            if (data.senderID === Number(createrID)) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: "You have left the group",
              });
              setNotificationID(id);
              dispatch(mqttGroupLeft(data.payload));
            } else {
              dispatch(mqttGroupLeft(data.payload));
              setNotification({
                ...notification,
                notificationShow: true,
                message: data.payload.data[0].notiMsg,
              });
              setNotificationID(id);
            }
            break;

          case "last_message_after_deletion":
            dispatch(lastMessageDeletion(data.payload));
            break;

          default:
            break;
        }
      }

      if (data.action.toLowerCase() === "polls") {
        switch (data.payload.message.toLowerCase()) {
          case "new_poll_published":
            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("NEW_POLL_PUBLISHED"),
                  "[Poll Title]",
                  data.payload.pollTitle.slice(0, 30)
                ),
              });
            }
            dispatch(notifyPollingSocket(data.payload));
            setNotificationID(id);
            break;

          case "poll_updated":
            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("POLL_UPDATED"),
                  "[Poll Title]",
                  data.payload.pollTitle
                ),
              });
            }
            dispatch(notifyPollingSocket(data.payload));
            setNotificationID(id);
            break;

          case "poll_expired":
            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("POLL_EXPIRED"),
                  "[Poll Title]",
                  data.payload.pollTitle
                ),
              });
            }
            dispatch(notifyPollingSocket(data.payload.polls));
            setNotificationID(id);
            break;

          case "published_poll_deleted":
            dispatch(deletePollsMQTT(data.payload.polls));
            setNotificationID(id);
            try {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("PUBLISHED_POLL_DELETED"),
                    "[Poll Title]",
                    data.payload.pollTitle
                  ),
                });
              }
            } catch {}
            break;

          default:
            if (
              data.payload.message
                .toLowerCase()
                .includes("new_poll_published_group")
            ) {
              dispatch(createPollGroupsMQTT(data.payload));
              setNotificationID(id);

              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_POLL_PUBLISHED"),
                    "[Poll Title]",
                    data.payload.pollTitle
                  ),
                });
              }
            } else if (
              data.payload.message
                .toLowerCase()
                .includes("new_poll_published_committee")
            ) {
              dispatch(createPollCommitteesMQTT(data.payload));
              setNotificationID(id);

              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_POLL_PUBLISHED"),
                    "[Poll Title]",
                    data.payload.pollTitle
                  ),
                });
              }
            } else if (
              data.payload.message
                .toLowerCase()
                .includes("new_poll_published_meeting")
            ) {
              dispatch(createPollMeetingMQTT(data.payload));
              setNotificationID(id);

              let currentMeetingActive =
                localStorage.getItem("currentMeetingID") !== null
                  ? Number(localStorage.getItem("currentMeetingID"))
                  : 0;

              if (
                Number(data?.payload?.meetingID) ===
                Number(currentMeetingActive)
              ) {
                dispatch(castYourVotePollModal(true));
              }

              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_POLL_PUBLISHED"),
                    "[Poll Title]",
                    data.payload.pollTitle
                  ),
                });
              }
            }
            break;
        }
      }

      if (data.action.toLowerCase() === "resolution") {
        switch (data.payload.message.toLowerCase()) {
          case "new_resolution_creation":
            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("NEW_RESOLUTION_CREATION"),
                  "[Resolution Title]",
                  data.payload.model.resolution.title
                ),
              });
            }
            dispatch(resolutionMQTTCreate(data.payload.model));
            break;

          case "resolution_cancelled":
            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("RESOLUTION_CANCELLED"),
                  "[Resolution Title]",
                  data.payload.model.resolution.title
                ),
              });
            }
            dispatch(resolutionMQTTCancelled(data.payload.model));
            break;

          case "resolution_closed":
            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: t("RESOLUTION_CLOSED"),
              });
            }
            dispatch(resolutionMQTTClosed(data.payload.model));
            break;

          case "resoulution_vote_counter":
            dispatch(resolutionMQTTVoteCounter(data.payload.data));
            break;

          default:
            break;
        }
      }

      if (
        data.action.toLowerCase() === "Video".toLowerCase() &&
        checkFeatureIDAvailability(4)
      ) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_VIDEO_CALL_INITIATED".toLowerCase()
        ) {
          console.log("Check active");
          setIsVisible(true);
          // localStorage.setItem("activeCall", false);
          let activeCall = JSON.parse(localStorage.getItem("activeCall"));
          let CallType = Number(localStorage.getItem("CallType"));
          let isCaller = JSON.parse(localStorage.getItem("isCaller"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          // localStorage.setItem("RingerCallCheckFlag", true);
          // localStorage.setItem("callType", data.payload.callType);
          // localStorage.setItem("callTypeID", data.payload.callTypeID);
          // localStorage.setItem("newCallerID", data.payload.callerID);

          localStorage.setItem("incommingCallType", data.payload.callType);
          localStorage.setItem("incommingCallTypeID", data.payload.callTypeID);
          localStorage.setItem("incommingNewCallerID", data.payload.callerID);

          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));

          if (isZoomEnabled) {
            console.log("Does Check Recording Start");
            // // Condition For Video Recording
            if (isCaller && (CallType === 1 || CallType === 2)) {
              console.log("Does Check Recording Start");
              await onHandleClickForStopRecording();
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }

          let Dataa = {
            OrganizationID: Number(currentOrganization),
            RoomID: data.payload.roomID,
          };
          dispatch(CallRequestReceived(Dataa, navigate, t));
          if (
            activeCall ||
            isMeetingVideo ||
            presenterViewHostFlag.current ||
            presenterViewJoinFlagRef.current
          ) {
            console.log(activeCall, "Check active");
            console.log("Check active");
            // dispatch(incomingVideoCallMQTT(data.payload, data.payload.message));
            dispatch(incomingVideoCallFlag(true));
            let timeValue = Number(localStorage.getItem("callRingerTimeout"));
            localStorage.setItem("NewRoomID", data.payload.roomID);
            timeValue = timeValue * 1000;
            const timeoutId = setTimeout(() => {
              console.log("Check active");

              let Data = {
                ReciepentID: Number(createrID),
                RoomID: data.payload.roomID,
                CallStatusID: 3,
                CallTypeID: data.payload.callTypeID,
              };
              if (IncomingVideoCallFlagReducer === true) {
                console.log("Check active");

                dispatch(VideoCallResponse(Data, navigate, t));
                localStorage.removeItem("NewRoomID");
              }
            }, timeValue);
            return () => clearTimeout(timeoutId);
          } else if (
            (activeCall === false ||
              activeCall === undefined ||
              activeCall === null) &&
            IncomingVideoCallFlagReducer === false
          ) {
            console.log("Check active");

            dispatch(incomingVideoCallFlag(true));
            console.log(data.payload.message, "Show me a message");
            dispatch(incomingVideoCallMQTT(data.payload, data.payload.message));
            localStorage.setItem("NewRoomID", data.payload.roomID);
            // localStorage.setItem("acceptedRoomID", 0);
            localStorage.setItem("callerID", data.payload.callerID);
            localStorage.setItem("callerNameInitiate", data.payload.callerName);
            localStorage.setItem("recipentID", data.receiverID[0]);
            localStorage.setItem("recipentName", currentUserName);
          }
          dispatch(callRequestReceivedMQTT({}, ""));
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_ACCEPTED".toLowerCase()
        ) {
          let NewRoomID = localStorage.getItem("NewRoomID");
          let activeRoomID = localStorage.getItem("activeRoomID");
          let userID = localStorage.getItem("userID");
          let isCaller = JSON.parse(localStorage.getItem("isCaller"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");

          let CallType = Number(localStorage.getItem("CallType"));

          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));

          if (isZoomEnabled) {
            console.log("Does Check Recording Start");
            // // Condition For Video Recording
            if (isCaller && (CallType === 1 || CallType === 2)) {
              console.log("Does Check Recording Start");
              await onHandleClickForStopRecording();
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }

          // NEW FILTER LOGIC FOR ZOOM + GROUP CALL (callType=2)
          if (isZoomEnabled && CallType === 2) {
            setInCallParticipantsList((prevList) => {
              console.log("Filtering participant:", data.payload.recepientID);

              return prevList.filter(
                (participant) => participant.userID !== data.payload.recepientID
              );
            });
          }

          if (CallType === 2) {
            console.log("mqtt");
            setGroupVideoCallAccepted((prevState) => {
              // Check if the user is already in the accepted list
              const userExists = prevState.some(
                (user) => user.recepientID === data.payload.recepientID
              );
              if (!userExists) {
                return [...prevState, data.payload];
              }
              return prevState;
            });
          }
          let falgCheck1 = false;
          if (isZoomEnabled) {
            falgCheck1 = String(activeRoomID) !== "" && !isCaller;
          } else {
            falgCheck1 = Number(activeRoomID) !== 0 && !isCaller;
          }
          let roomID = 0;
          console.log("mqtt", activeRoomID);
          if (activeRoomID) {
            console.log("mqtt");
            if (falgCheck1) {
              roomID = activeRoomID;
            } else {
              if (!isCaller) {
                roomID = NewRoomID;
              } else {
                roomID = isZoomEnabled
                  ? String(initiateCallRoomID)
                  : initiateCallRoomID;
              }
            }
          } else {
            if (!isCaller) {
              roomID = NewRoomID;
            } else {
              roomID = isZoomEnabled
                ? String(initiateCallRoomID)
                : initiateCallRoomID;
            }
          }
          console.log("mqtt", roomID);
          let RecipentIDsOninitiateVideoCall =
            JSON.parse(
              localStorage.getItem("RecipentIDsOninitiateVideoCall")
            ) || [];
          let falgCheck2 = false;
          if (isZoomEnabled) {
            console.log("mqtt", falgCheck2);
            falgCheck2 = String(data.payload.roomID) === String(roomID);
          } else {
            console.log("mqtt", falgCheck2);
            falgCheck2 = Number(data.payload.roomID) === Number(roomID);
          }
          console.log("mqtt", falgCheck2);
          if (!isMeetingVideo && falgCheck2 && userID !== data.senderID) {
            console.log("mqtt", roomID);
            dispatch(videoOutgoingCallFlag(false));
            dispatch(videoCallAccepted(data.payload, data.payload.message));
            localStorage.setItem("ringerRoomId", 0);
            localStorage.setItem("NewRoomID", 0);
            localStorage.setItem("callerID", data.receiverID[0]);
            localStorage.setItem("callerName", data.payload.callerName);
            localStorage.setItem("recipentID", data.payload.recepientID);
            localStorage.setItem("recipentName", data.payload.recepientName);
            localStorage.setItem("activeCall", true);
            sessionStorage.setItem("activeCallSessionforOtoandGroup", true);
            localStorage.setItem("activeRoomID", data.payload.roomID);
            localStorage.setItem("CallType", data.payload.callTypeID);
            console.log("leavecallMeetingVideo");
            localStorage.setItem("callTypeID", data.payload.callTypeID);
            if (data.payload.recepientID === Number(createrID)) {
              localStorage.setItem("initiateVideoCall", false);
            }

            let existingData =
              JSON.parse(localStorage.getItem("callerStatusObject")) || [];

            let newData = {
              RecipientName: data.payload.recepientName,
              RecipientID: data.payload.recepientID,
              CallStatus: "Accepted",
              RoomID: data.payload.roomID,
            };
            if (RecipentIDsOninitiateVideoCall.length > 0) {
              const index = RecipentIDsOninitiateVideoCall.indexOf(
                data.payload.recepientID
              );
              if (index !== -1) {
                // Remove the matching value
                RecipentIDsOninitiateVideoCall.splice(index, 1);
                localStorage.setItem(
                  "RecipentIDsOninitiateVideoCall",
                  JSON.stringify(RecipentIDsOninitiateVideoCall)
                );
                existingData.push(newData);
                localStorage.setItem(
                  "callerStatusObject",
                  JSON.stringify(existingData)
                );
                dispatch(callRequestReceivedMQTT({}, ""));
              }
            }
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_REJECTED".toLowerCase()
        ) {
          console.log("mqtt");
          //To make false sessionStorage which is set on VideoCall
          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));

          localStorage.setItem("ringerRoomId", 0);
          sessionStorage.setItem("NonMeetingVideoCall", false);
          let userID = Number(localStorage.getItem("userID"));
          let currentUserName = localStorage.getItem("name");
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];
          let NewRoomID = localStorage.getItem("NewRoomID");
          let activeRoomID = localStorage.getItem("activeRoomID");
          let isCaller = JSON.parse(localStorage.getItem("isCaller"));
          let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");

          let CallType = Number(localStorage.getItem("CallType"));
          console.log(existingData.length, "existingDatalength");
          sessionStorage.setItem("activeCallSessionforOtoandGroup", false);

          //For Stop Recording while user reject the call
          if (isZoomEnabled) {
            console.log("Does Check Recording Stop");
            if (isCaller && CallType === 1) {
              console.log("Does Check Recording Stop");
              const iframe = iframeRef.current;
              if (iframe && iframe.contentWindow) {
                console.log("Does Check Recording Stop");
                iframe.contentWindow.postMessage(
                  "RecordingStopMsgFromIframe",
                  "*"
                );
              }
            }
          }

          if (CallType === 2) {
            setGroupCallParticipantList((prevState) =>
              prevState.filter(
                (user) => user.userID !== data.payload.recepientID
              )
            );
          }
          let falgCheck1 = false;
          if (isZoomEnabled) {
            console.log("mqtt", falgCheck1);
            falgCheck1 = String(activeRoomID) !== "" && !isCaller;
          } else {
            console.log("mqtt", falgCheck1);
            falgCheck1 = Number(activeRoomID) !== 0 && !isCaller;
          }
          let roomID = 0;
          if (activeRoomID) {
            if (falgCheck1) {
              roomID = activeRoomID;
            } else {
              if (!isCaller) {
                roomID = isZoomEnabled ? String(NewRoomID) : Number(NewRoomID);
              } else {
                roomID = isZoomEnabled
                  ? String(initiateCallRoomID)
                  : Number(initiateCallRoomID);
              }
            }
          } else {
            if (!isCaller) {
              roomID = isZoomEnabled ? String(NewRoomID) : Number(NewRoomID);
            } else {
              roomID = isZoomEnabled
                ? String(initiateCallRoomID)
                : Number(initiateCallRoomID);
            }
          }
          console.log("mqtt", roomID);
          let RecipentIDsOninitiateVideoCall =
            JSON.parse(
              localStorage.getItem("RecipentIDsOninitiateVideoCall")
            ) || [];
          let falgCheck2 = false;
          if (isZoomEnabled) {
            console.log("mqtt", falgCheck2);
            falgCheck2 = String(data.payload.roomID) === String(roomID);
          } else {
            console.log("mqtt", falgCheck1);
            falgCheck2 = Number(data.payload.roomID) === Number(roomID);
          }
          if (!isMeetingVideo && falgCheck2 && userID !== data.senderID) {
            console.log("mqtt", data.payload.callTypeID);
            if (data.payload.callTypeID === 1) {
              if (userID !== data.recepientID) {
                localStorage.setItem("onlyLeaveCall", true);
                console.log("setLeaveOneToOne");

                setLeaveOneToOne(true);
                dispatch(videoChatMessagesFlag(false));
                dispatch(videoOutgoingCallFlag(false));
              }
            } else if (data.payload.callTypeID === 2) {
              let newData = {
                RecipientName: data.payload.recepientName,
                RecipientID: data.payload.recepientID,
                CallStatus: "Rejected",
                RoomID: data.payload.roomID,
              };

              existingData.push(newData);
              localStorage.setItem(
                "callerStatusObject",
                JSON.stringify(existingData)
              );
              let RecipentIDsOninitiateVideoCallflag = false;
              let remainingCount = 0;
              let existingDataflag = false;
              let existingDataremainingCount = 0;
              let existingObjectIndex = [];
              if (RecipentIDsOninitiateVideoCall.length > 0) {
                const index = RecipentIDsOninitiateVideoCall.indexOf(
                  data.payload.recepientID
                );
                if (index !== -1) {
                  // Remove the matching value
                  RecipentIDsOninitiateVideoCall.splice(index, 1);
                  localStorage.setItem(
                    "RecipentIDsOninitiateVideoCall",
                    JSON.stringify(RecipentIDsOninitiateVideoCall)
                  );
                  RecipentIDsOninitiateVideoCallflag = true;
                  remainingCount = RecipentIDsOninitiateVideoCall.length || 0;
                } else {
                }
                console.log("mqtt", RecipentIDsOninitiateVideoCall);
              } else {
                if (existingData.length > 0) {
                  existingObjectIndex = existingData.findIndex(
                    (item) =>
                      item.RecipientName === newData.RecipientName &&
                      item.RecipientID === newData.RecipientID &&
                      item.RoomID === newData.RoomID
                  );
                  if (existingObjectIndex !== -1) {
                    existingData.splice(existingObjectIndex, 1);
                    localStorage.setItem(
                      "callerStatusObject",
                      JSON.stringify(existingData)
                    );
                    existingDataflag = true;
                    existingDataremainingCount = existingData.length || 0;
                  }
                  if (existingDataflag) {
                    if (existingDataremainingCount === 0) {
                      if (RecipentIDsOninitiateVideoCall.length === 0) {
                        localStorage.setItem("onlyLeaveCall", true);

                        console.log("setLeaveOneToOne");
                        setLeaveOneToOne(true);
                        dispatch(videoChatMessagesFlag(false));
                        dispatch(videoOutgoingCallFlag(false));
                      }
                    }
                  }
                }
              }
              if (RecipentIDsOninitiateVideoCallflag) {
                if (remainingCount === 0) {
                  if (existingData.length === 0) {
                    localStorage.setItem("onlyLeaveCall", true);

                    console.log("setLeaveOneToOne");
                    setLeaveOneToOne(true);
                    dispatch(videoChatMessagesFlag(false));
                    dispatch(videoOutgoingCallFlag(false));
                  }
                }
              } else {
                if (existingData.length > 0) {
                  existingObjectIndex = existingData.findIndex(
                    (item) =>
                      item.RecipientName === newData.RecipientName &&
                      item.RecipientID === newData.RecipientID &&
                      item.RoomID === newData.RoomID
                  );
                  if (existingObjectIndex !== -1) {
                    existingData.splice(existingObjectIndex, 1);
                    localStorage.setItem(
                      "callerStatusObject",
                      JSON.stringify(existingData)
                    );
                    existingDataflag = true;
                    existingDataremainingCount = existingData.length || 0;
                  }
                  if (existingDataflag) {
                    if (existingDataremainingCount === 0) {
                      if (RecipentIDsOninitiateVideoCall.length === 0) {
                        localStorage.setItem("onlyLeaveCall", true);

                        console.log("setLeaveOneToOne");
                        setLeaveOneToOne(true);
                        dispatch(videoChatMessagesFlag(false));
                        dispatch(videoOutgoingCallFlag(false));
                      }
                    }
                  }
                }
              }
            }

            if (currentUserName !== data.payload.recepientName) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: `${data.payload.recepientName} has declined the call`,
              });
              setNotificationID(id);
            }
            dispatch(callRequestReceivedMQTT({}, ""));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_UNANSWERED".toLowerCase()
        ) {
          let roomID = localStorage.getItem("acceptedRoomID");
          let newRoomID = localStorage.getItem("newRoomId");
          let activeCall = JSON.parse(localStorage.getItem("activeCall"));
          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
          let isCaller = JSON.parse(localStorage.getItem("isCaller"));
          let CallType = Number(localStorage.getItem("CallType"));
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];

          let RoomID =
            presenterViewFlag &&
            (presenterViewHostFlag || presenterViewJoinFlag)
              ? roomID
              : JSON.parse(localStorage.getItem("activeCall"))
              ? localStorage.getItem("activeRoomID") != 0 &&
                localStorage.getItem("activeRoomID") != null
                ? localStorage.getItem("activeRoomID")
                : localStorage.getItem("initiateCallRoomID")
              : JSON.parse(localStorage.getItem("isMeetingVideoHostCheck"))
              ? newRoomID
              : localStorage.getItem("participantRoomId");
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          sessionStorage.setItem("activeCallSessionforOtoandGroup", false);

          console.log("mqtt");
          console.log("mqtt", typeof RoomID);
          console.log("mqtt", typeof data.payload.roomID);

          if (
            isZoomEnabled
              ? String(RoomID) === String(data.payload.roomID)
              : RoomID === data.payload.roomID && activeCall && !isMeetingVideo
          ) {
            //To make false sessionStorage which is set on VideoCall
            if (Number(data.senderID) !== Number(createrID)) {
              if (Number(createrID) !== data.payload.recepientID) {
                localStorage.setItem("unansweredFlag", true);
              }
            }
            console.log("mqtt");
            console.log(data.payload.message, "datapayloadmessage");

            setNotification({
              ...notification,
              notificationShow: true,
              message: t("VIDEO_CALL_UNANSWERED"),
            });
            setNotificationID(id);
            if (data.payload.callTypeID === 1) {
              sessionStorage.setItem("NonMeetingVideoCall", false);
              console.log("mqtt");
              dispatch(unansweredOneToOneCall(true));
              localStorage.setItem("onlyLeaveCall", true);
              console.log("setLeaveOneToOne");
              let initiateVideoCall = JSON.parse(
                localStorage.getItem("initiateVideoCall")
              );
              let initiateCallRoomID =
                localStorage.getItem("initiateCallRoomID");

              if (data.payload.recepientResponseCode === 3) {
                if (
                  initiateVideoCall &&
                  data.payload.roomID === initiateCallRoomID
                ) {
                  localStorage.setItem("initiateVideoCall", false);
                  localStorage.removeItem("initiateCallRoomID");
                  setLeaveOneToOne(true);
                }
                console.log("Check New Thing");
              } else {
                setLeaveOneToOne(true);
              }
              dispatch(videoChatMessagesFlag(false));
              dispatch(videoOutgoingCallFlag(false));
              dispatch(
                callRequestReceivedMQTT(data.payload, data.payload.message)
              );
              console.log(data.payload.message, "datapayloadmessage");
            } else {
              let CallType = Number(localStorage.getItem("CallType"));
              if (CallType === 2) {
                console.log("mqtt");
                setUnansweredCallParticipant((prevState) => {
                  // Check if the user is already in the accepted list
                  const userExists = prevState.some(
                    (user) => user.recepientID === data.payload.recepientID
                  );

                  console.log(userExists, "userExists");
                  if (!userExists) {
                    return [...prevState, data.payload];
                  }
                  return prevState;
                });
              }
              const participantWhoDidNotRespond = data.payload.recepientID;

              // Step 1: Update RecipentIDsOninitiateVideoCall
              let recipientIDsOnInitiate =
                JSON.parse(
                  localStorage.getItem("RecipentIDsOninitiateVideoCall")
                ) || [];

              const recipientIndex = recipientIDsOnInitiate.indexOf(
                participantWhoDidNotRespond
              );
              console.log("setLeaveOneToOne", recipientIndex);
              if (recipientIndex !== -1) {
                console.log("setLeaveOneToOne");
                recipientIDsOnInitiate.splice(recipientIndex, 1);
                localStorage.setItem(
                  "RecipentIDsOninitiateVideoCall",
                  JSON.stringify(recipientIDsOnInitiate)
                );
              }

              // Step 2: Filter out the participant who didn’t respond
              let callerStatusList =
                JSON.parse(localStorage.getItem("callerStatusObject")) || [];

              callerStatusList = callerStatusList.filter(
                (obj) =>
                  obj.participantId !== participantWhoDidNotRespond &&
                  obj.CallStatus !== "Rejected" // Remove all Rejected
              );

              console.log("setLeaveOneToOne", callerStatusList);
              localStorage.setItem(
                "callerStatusObject",
                JSON.stringify(callerStatusList)
              );

              // Step 3: Fetch updated arrays again
              const remainingRecipients =
                JSON.parse(
                  localStorage.getItem("RecipentIDsOninitiateVideoCall")
                ) || [];
              console.log("setLeaveOneToOne", remainingRecipients);

              const remainingCallerStatus =
                JSON.parse(localStorage.getItem("callerStatusObject")) || [];
              console.log(
                "setLeaveOneToOne",
                checkCallStatus(remainingCallerStatus)
              );

              // Step 4: Final condition
              if (
                remainingRecipients.length === 0 &&
                remainingCallerStatus.length === 0
              ) {
                sessionStorage.setItem("NonMeetingVideoCall", false);
                localStorage.setItem("onlyLeaveCall", true);
                console.log("setLeaveOneToOne");
                setLeaveOneToOne(true);
                dispatch(videoChatMessagesFlag(false));
                dispatch(videoOutgoingCallFlag(false));
                dispatch(
                  callRequestReceivedMQTT(data.payload, data.payload.message)
                );
              }
            }
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_RINGING".toLowerCase()
        ) {
          let userID = localStorage.getItem("userID");
          if (data.senderID === userID) {
            localStorage.setItem("initiateCallRoomID", data.payload.roomID);
            localStorage.setItem("ringerRoomId", data.payload.roomID);
            localStorage.setItem("initiateVideoCall", true);
            dispatch(
              callRequestReceivedMQTT(data.payload, data.payload.message)
            );
            let existingData =
              JSON.parse(localStorage.getItem("callerStatusObject")) || [];
            let newData = {
              RecipientName: data.payload.recepientName,
              RecipientID: data.payload.recepientID,
              CallStatus: "Ringing",
              RoomID: data.payload.roomID,
            };
            let existingObjectIndex = existingData.findIndex(
              (item) =>
                item.RecipientName === newData.RecipientName &&
                item.RecipientID === newData.RecipientID &&
                item.RoomID === newData.RoomID
            );
            if (existingObjectIndex !== -1) {
              existingData[existingObjectIndex] = newData;
            } else {
              existingData.push(newData);
            }
            localStorage.setItem(
              "callerStatusObject",
              JSON.stringify(existingData)
            );
            let Dataa = {
              OrganizationID: Number(currentOrganization),
              RoomID: data.payload.roomID,
            };
            dispatch(CallRequestReceived(Dataa, navigate, t));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_DISCONNECTED_CALLER".toLowerCase()
        ) {
          let activeRoomID = localStorage.getItem("activeRoomID");
          let NewRoomID = localStorage.getItem("NewRoomID");
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
          let isCaller = JSON.parse(localStorage.getItem("isCaller"));
          let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
          let CallType = Number(localStorage.getItem("CallType"));
          let callStatus = JSON.parse(localStorage.getItem("activeCall"));
          let roomID = 0;
          let flagCheck1 = false;
          localStorage.setItem("MicOff", true);
          sessionStorage.removeItem("activeCallSessionforOtoandGroup");

          if (isZoomEnabled) {
            if (String(initiateCallRoomID) !== String(data.payload.roomID)) {
              console.log("Check It");
              dispatch(incomingVideoCallFlag(false));
            }
          }

          if (isZoomEnabled) {
            console.log("Does Check Recording Stop");
            // Function For Stop Video Recording
            await sendStopRecordingMessageForMQTT();
            await new Promise((resolve) => setTimeout(resolve, 100));
            flagCheck1 = String(activeRoomID) !== "";
          } else {
            flagCheck1 = Number(activeRoomID) !== 0;
          }
          if (activeRoomID) {
            if (flagCheck1 && !isCaller) {
              roomID = activeRoomID;
            } else {
              if (!isCaller) {
                roomID = NewRoomID;
              } else {
                roomID = initiateCallRoomID;
              }
            }
          } else {
            if (!isCaller) {
              roomID = NewRoomID;
            } else {
              roomID = initiateCallRoomID;
            }
          }
          console.log("mqtt", roomID);
          let flagCheck2 = 0;

          if (isZoomEnabled) {
            console.log();
            flagCheck2 = String(roomID) === String(data.payload.roomID);
          } else {
            flagCheck2 = Number(roomID) === Number(data.payload.roomID);
          }
          if (
            flagCheck2 &&
            (isMeetingVideo === null || isMeetingVideo === false)
          ) {
            let callerID = JSON.parse(localStorage.getItem("callerID"));
            let newCallerID = JSON.parse(localStorage.getItem("newCallerID"));
            if (IncomingVideoCallFlagReducer === true && callStatus === false) {
              let callerID = Number(localStorage.getItem("callerID"));
              let newCallerID = Number(localStorage.getItem("newCallerID"));
              if (callerID === newCallerID) {
                localStorage.setItem("activeCall", false);
                sessionStorage.setItem(
                  "activeCallSessionforOtoandGroup",
                  false
                );
              }
              localStorage.setItem("newCallerID", callerID);
              localStorage.setItem("initiateVideoCall", false);
              let acceptedRoomID = 0;
              if (isZoomEnabled) {
                acceptedRoomID = String(localStorage.getItem("acceptedRoomID"));
              } else {
                acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));
              }

              dispatch(incomingVideoCallFlag(false));
              if (activeRoomID !== acceptedRoomID) {
                dispatch(incomingVideoCallFlag(false));
                localStorage.setItem("activeRoomID", acceptedRoomID);
              }
              if (activeRoomID === acceptedRoomID) {
                console.log("Check One To Three");
                if (
                  NormalizeVideoFlag === true ||
                  IncomingVideoCallFlagReducer === true ||
                  MaximizeVideoFlag === true
                ) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: `Call has been disconnected by ${data.payload.callerName}`,
                  });
                  setNotificationID(id);
                }
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(videoChatMessagesFlag(false));
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
              }
              console.log("Check 123");
              dispatch(leaveCallModal(false));
            } else if (
              IncomingVideoCallFlagReducer === false &&
              callStatus === true
            ) {
              console.log("Check 123");
              let callerID = Number(localStorage.getItem("callerID"));
              let newCallerID = Number(localStorage.getItem("newCallerID"));
              if (callerID === newCallerID) {
                console.log("Check 123");
                localStorage.setItem("activeCall", false);
                sessionStorage.setItem(
                  "activeCallSessionforOtoandGroup",
                  false
                );
              }
              localStorage.setItem("newCallerID", callerID);
              localStorage.setItem("initiateVideoCall", false);
              let acceptedRoomID = "";
              let activeRoomID = "";
              if (isZoomEnabled) {
                acceptedRoomID = String(localStorage.getItem("acceptedRoomID"));
                activeRoomID = String(localStorage.getItem("activeRoomID"));
              } else {
                acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));
                activeRoomID = Number(localStorage.getItem("activeRoomID"));
              }

              dispatch(incomingVideoCallFlag(false));
              if (activeRoomID !== acceptedRoomID) {
                console.log("Check 123");
                localStorage.setItem("activeCall", false);
                sessionStorage.setItem(
                  "activeCallSessionforOtoandGroup",
                  false
                );

                localStorage.removeItem("acceptedRoomID");
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(incomingVideoCallFlag(false));
                localStorage.setItem("activeRoomID", acceptedRoomID);
              }
              if (activeRoomID === acceptedRoomID) {
                console.log("Check One To Three");

                if (
                  NormalizeVideoFlag === true ||
                  IncomingVideoCallFlagReducer === true ||
                  MaximizeVideoFlag === true
                ) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: `Call has been disconnected by ${data.payload.callerName}`,
                  });
                  setNotificationID(id);
                }
                let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
                if (isMeeting) {
                  console.log("Check One To Three");
                  localStorage.removeItem("callTypeID");
                }
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(videoChatMessagesFlag(false));
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
              }
              dispatch(leaveCallModal(false));
            } else if (
              IncomingVideoCallFlagReducer === true &&
              callStatus === true
            ) {
              console.log("Check 123");
              if (
                data.payload.callerID === callerID &&
                data.payload.callerID === newCallerID
              ) {
                console.log("Check 123");
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(videoChatMessagesFlag(false));
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                localStorage.setItem("activeCall", false);
                sessionStorage.setItem(
                  "activeCallSessionforOtoandGroup",
                  false
                );
              } else if (data.payload.callerID === newCallerID) {
                console.log("Check 123");
                dispatch(incomingVideoCallFlag(false));
                let acceptedRoomID = "";
                if (isZoomEnabled) {
                  acceptedRoomID = String(
                    localStorage.getItem("acceptedRoomID")
                  );
                } else {
                  acceptedRoomID = Number(
                    localStorage.getItem("acceptedRoomID")
                  );
                }

                localStorage.setItem("newCallerID", callerID);
                localStorage.setItem("activeCall", true);
                sessionStorage.setItem("activeCallSessionforOtoandGroup", true);

                localStorage.setItem("activeRoomID", acceptedRoomID);
              } else if (data.payload.callerID === callerID) {
                console.log("Check 123");
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(videoChatMessagesFlag(false));
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                localStorage.setItem("activeCall", false);
                sessionStorage.setItem(
                  "activeCallSessionforOtoandGroup",
                  false
                );
              }
            } else {
            }
            console.log("Check 123");
            dispatch(leaveCallModal(false));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_DISCONNECTED_RECIPIENT".toLowerCase()
        ) {
          let roomID = localStorage.getItem("acceptedRoomID");
          let newRoomID = localStorage.getItem("newRoomId");
          let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
          let participantRoomId = localStorage.getItem("participantRoomId");
          let activeRoomID = localStorage.getItem("activeRoomID");
          let CallType = Number(localStorage.getItem("CallType"));
          let isCaller = JSON.parse(localStorage.getItem("isCaller"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let isMeetingVideoHostCheck = JSON.parse(
            localStorage.getItem("isMeetingVideoHostCheck")
          );
          let activeCall = JSON.parse(localStorage.getItem("activeCall"));
          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];

          let RoomID = "";
          if (isZoomEnabled) {
            console.log("Does Check Recording Stop");
            // // Condition For Video Recording
            if (isCaller && CallType === 1) {
              console.log("Does Check Recording Stop");
              const iframe = iframeRef.current;
              if (iframe && iframe.contentWindow) {
                console.log("Does Check Recording Stop");
                iframe.contentWindow.postMessage(
                  "RecordingStopMsgFromIframe",
                  "*"
                );
              }
            } else if (
              isCaller &&
              CallType === 2 &&
              existingData.length === 1
            ) {
              console.log("Does Check Recording Stop Call Type 2");

              // Assuming iframeRef is defined
              const iframe = iframeRef.current;
              if (iframe && iframe.contentWindow) {
                console.log("Does Check Recording Stop Call Type 2");
                iframe.contentWindow.postMessage(
                  "RecordingStopMsgFromIframe",
                  "*"
                );
              }
            }

            RoomID =
              presenterViewFlagRef.current &&
              (presenterViewHostFlagFlagRef.current ||
                presenterViewJoinFlagRef.current)
                ? String(roomID)
                : isMeetingVideo
                ? isMeetingVideoHostCheck
                  ? String(newRoomID)
                  : String(participantRoomId)
                : String(initiateCallRoomID)
                ? String(initiateCallRoomID)
                : String(activeRoomID);
          } else {
            RoomID =
              presenterViewFlagRef.current &&
              (presenterViewHostFlagFlagRef.current ||
                presenterViewJoinFlagRef.current)
                ? Number(roomID)
                : isMeetingVideo
                ? isMeetingVideoHostCheck
                  ? Number(newRoomID)
                  : Number(participantRoomId)
                : Number(initiateCallRoomID)
                ? Number(initiateCallRoomID)
                : Number(activeRoomID);
          }

          console.log("mqtt");
          console.log("mqtt", RoomID);

          if (CallType === 2) {
            // Also remove the user from groupCallParticipantList
            setGroupCallParticipantList((prevList) =>
              prevList.filter(
                (participant) => participant.userID !== data.payload.recipientID
              )
            );
          }

          if (RoomID === data.payload.roomID && activeCall) {
            if (data.payload.callTypeID === 1) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: `${data.payload.recipientName} has left the call`,
              });
              setNotificationID(id);
              localStorage.setItem("onlyLeaveCall", true);
              console.log("setLeaveOneToOne");
              setLeaveOneToOne(true);
              dispatch(videoChatMessagesFlag(false));
              dispatch(videoOutgoingCallFlag(false));
            } else {
              console.log("mqtt");
              let callerID = Number(localStorage.getItem("callerID"));
              localStorage.setItem("newCallerID", callerID);
              localStorage.setItem("initiateVideoCall", false);

              let existingData =
                JSON.parse(localStorage.getItem("callerStatusObject")) || [];
              let RecipentIDsOninitiateVideoCall =
                JSON.parse(
                  localStorage.getItem("RecipentIDsOninitiateVideoCall")
                ) || [];

              let newData = {
                RecipientName: data.payload.recipientName,
                RecipientID: data.payload.recipientID,
                CallStatus: "Disconnected",
                RoomID: data.payload.roomID,
              };

              let existingObjectIndex = existingData.findIndex(
                (item) =>
                  item.RecipientName === newData.RecipientName &&
                  item.RecipientID === newData.RecipientID &&
                  item.RoomID === newData.RoomID
              );
              // console.log("mqtt",RoomID)

              if (existingObjectIndex !== -1) {
                existingData.splice(existingObjectIndex, 1);
                localStorage.setItem(
                  "callerStatusObject",
                  JSON.stringify(existingData)
                );
                if (
                  RecipentIDsOninitiateVideoCall.length === 0 &&
                  existingData.length === 0
                ) {
                  localStorage.setItem("onlyLeaveCall", true);
                  console.log("setLeaveOneToOne");
                  setLeaveOneToOne(true);
                  dispatch(videoChatMessagesFlag(false));
                  dispatch(videoOutgoingCallFlag(false));
                }
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: `${data.payload.recipientName} has left the call`,
                });
                setNotificationID(id);
              }
            }
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "MISSED_CALLS_COUNT".toLowerCase()
        ) {
          dispatch(missedCallCount(data.payload, data.payload.message));
        } else if (
          data.payload.message.toLowerCase() === "VIDEO_CALL_BUSY".toLowerCase()
        ) {
          // if (data.payload.recepientID !== Number(createrID)) {
          //   localStorage.setItem("ringerRoomId", 0);
          //   dispatch(normalizeVideoPanelFlag(false));
          //   dispatch(videoChatMessagesFlag(false));
          //   dispatch(maximizeVideoPanelFlag(false));
          //   dispatch(minimizeVideoPanelFlag(false));
          //   setNotification({
          //     ...notification,
          //     notificationShow: true,
          //     message: `${data.payload.recepientName} is currently Busy`,
          //   });
          //   setNotificationID(id);
          //   let existingData =
          //     JSON.parse(localStorage.getItem("callerStatusObject")) || [];
          //   let newData = {
          //     RecipientName: data.payload.recepientName,
          //     RecipientID: data.payload.recepientID,
          //     CallStatus: "Busy",
          //     RoomID: data.payload.roomID,
          //   };
          //   let existingObjectIndex = existingData.findIndex(
          //     (item) =>
          //       item.RecipientName === newData.RecipientName &&
          //       item.RecipientID === newData.RecipientID &&
          //       item.RoomID === newData.RoomID
          //   );
          //   if (existingObjectIndex !== -1) {
          //     existingData[existingObjectIndex] = newData;
          //   } else {
          //     existingData.push(newData);
          //   }
          //   localStorage.setItem(
          //     "callerStatusObject",
          //     JSON.stringify(existingData)
          //   );
          //   localStorage.setItem("activeCall", false);
          // }
          console.log("mqtt");
          //To make false sessionStorage which is set on VideoCall
          localStorage.setItem("ringerRoomId", 0);
          sessionStorage.setItem("NonMeetingVideoCall", false);
          let userID = Number(localStorage.getItem("userID"));
          let currentUserName = localStorage.getItem("name");
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];
          let NewRoomID = localStorage.getItem("NewRoomID");
          let activeRoomID = localStorage.getItem("activeRoomID");
          let isCaller = JSON.parse(localStorage.getItem("isCaller"));
          let isZoomEnabled = localStorage.getItem("isZoomEnabled");
          let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
          let roomID = 0;
          if (activeRoomID) {
            if (Number(activeRoomID) !== 0 && !isCaller) {
              roomID = activeRoomID;
            } else {
              if (!isCaller) {
                roomID = NewRoomID;
              } else {
                roomID = initiateCallRoomID;
              }
            }
          } else {
            if (!isCaller) {
              roomID = NewRoomID;
            } else {
              roomID = initiateCallRoomID;
            }
          }
          console.log("mqtt", roomID);
          let RecipentIDsOninitiateVideoCall =
            JSON.parse(
              localStorage.getItem("RecipentIDsOninitiateVideoCall")
            ) || [];
          console.log(isMeetingVideo, "Check Is Mqtt");
          console.log(
            Number(data.payload.roomID) === Number(roomID),
            "Check Is Mqtt"
          );
          console.log(data.payload.roomID, "Check Is Mqtt");
          console.log(roomID, "Check Is Mqtt");
          console.log(userID !== data.senderID, "Check Is Mqtt");
          const isMqttCheck = isZoomEnabled
            ? String(data.payload.roomID) === String(roomID)
            : false;
          console.log({ isMqttCheck }, "Check Is Mqtt");

          if (
            !isMeetingVideo && isZoomEnabled
              ? String(data.payload.roomID) === String(roomID)
              : Number(data.payload.roomID) === Number(roomID) &&
                userID !== data.senderID
          ) {
            console.log("mqtt", data.payload.callTypeID);
            if (data.payload.callTypeID === 1) {
              if (userID !== data.recepientID) {
                localStorage.setItem("onlyLeaveCall", true);
                console.log("setLeaveOneToOne");
                let initiateVideoCall =
                  localStorage.getItem("initiateVideoCall");
                let initiateCallRoomID =
                  localStorage.getItem("initiateCallRoomID");
                if (data.payload.recepientResponseCode === 5) {
                  if (
                    initiateVideoCall &&
                    data.payload.roomID === initiateCallRoomID
                  ) {
                    localStorage.setItem("initiateVideoCall", false);
                    localStorage.removeItem("initiateCallRoomID");
                    setLeaveOneToOne(true);
                  }
                  console.log("Check New Thing");
                } else {
                  setLeaveOneToOne(true);
                }
                dispatch(videoChatMessagesFlag(false));
                dispatch(videoOutgoingCallFlag(false));
              }
            } else if (data.payload.callTypeID === 2) {
              let newData = {
                RecipientName: data.payload.recepientName,
                RecipientID: data.payload.recepientID,
                CallStatus: "Rejected",
                RoomID: data.payload.roomID,
              };
              let RecipentIDsOninitiateVideoCallflag = false;
              let remainingCount = 0;
              let existingDataflag = false;
              let existingDataremainingCount = 0;
              let existingObjectIndex = [];
              if (RecipentIDsOninitiateVideoCall.length > 0) {
                const index = RecipentIDsOninitiateVideoCall.indexOf(
                  data.payload.recepientID
                );
                if (index !== -1) {
                  // Remove the matching value
                  RecipentIDsOninitiateVideoCall.splice(index, 1);
                  localStorage.setItem(
                    "RecipentIDsOninitiateVideoCall",
                    JSON.stringify(RecipentIDsOninitiateVideoCall)
                  );
                  RecipentIDsOninitiateVideoCallflag = true;
                  remainingCount = RecipentIDsOninitiateVideoCall.length || 0;
                } else {
                }
                console.log("mqtt", RecipentIDsOninitiateVideoCall);
              } else {
                if (existingData.length > 0) {
                  existingObjectIndex = existingData.findIndex(
                    (item) =>
                      item.RecipientName === newData.RecipientName &&
                      item.RecipientID === newData.RecipientID &&
                      item.RoomID === newData.RoomID
                  );
                  if (existingObjectIndex !== -1) {
                    existingData.splice(existingObjectIndex, 1);
                    localStorage.setItem(
                      "callerStatusObject",
                      JSON.stringify(existingData)
                    );
                    existingDataflag = true;
                    existingDataremainingCount = existingData.length || 0;
                  }
                  if (existingDataflag) {
                    if (existingDataremainingCount === 0) {
                      if (RecipentIDsOninitiateVideoCall.length === 0) {
                        localStorage.setItem("onlyLeaveCall", true);
                        console.log("setLeaveOneToOne");
                        setLeaveOneToOne(true);
                        dispatch(videoChatMessagesFlag(false));
                        dispatch(videoOutgoingCallFlag(false));
                      }
                    }
                  }
                }
              }
              if (RecipentIDsOninitiateVideoCallflag) {
                if (remainingCount === 0) {
                  if (existingData.length === 0) {
                    localStorage.setItem("onlyLeaveCall", true);
                    console.log("setLeaveOneToOne");
                    setLeaveOneToOne(true);
                    dispatch(videoChatMessagesFlag(false));
                    dispatch(videoOutgoingCallFlag(false));
                  }
                }
              } else {
                if (existingData.length > 0) {
                  existingObjectIndex = existingData.findIndex(
                    (item) =>
                      item.RecipientName === newData.RecipientName &&
                      item.RecipientID === newData.RecipientID &&
                      item.RoomID === newData.RoomID
                  );
                  if (existingObjectIndex !== -1) {
                    existingData.splice(existingObjectIndex, 1);
                    localStorage.setItem(
                      "callerStatusObject",
                      JSON.stringify(existingData)
                    );
                    existingDataflag = true;
                    existingDataremainingCount = existingData.length || 0;
                  }
                  if (existingDataflag) {
                    if (existingDataremainingCount === 0) {
                      if (RecipentIDsOninitiateVideoCall.length === 0) {
                        localStorage.setItem("onlyLeaveCall", true);
                        console.log("setLeaveOneToOne");
                        setLeaveOneToOne(true);
                        dispatch(videoChatMessagesFlag(false));
                        dispatch(videoOutgoingCallFlag(false));
                      }
                    }
                  }
                }
              }
            }

            if (currentUserName !== data.payload.recepientName) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: `${data.payload.recepientName} has declined the call`,
              });
              setNotificationID(id);
            }
            dispatch(callRequestReceivedMQTT({}, ""));
          }
        }
      }
      if (data.action.toLowerCase() === "notes") {
        switch (data.payload.message.toLowerCase()) {
          case "new_notes_creation":
            const data2 = {
              creationDateTime: data.dateTime,
              notificationTypes: {
                pK_NTID: 10,
                description: changeMQTTJSONOne(
                  t("NOTES-RECENT-ACTIVITY"),
                  "[Notes Title]",
                  data.payload.model.title
                ),
                icon: "",
              },
              key: 0,
            };

            dispatch(setRecentActivityDataNotification(data2));
            break;

          default:
            break;
        }
      }

      if (data.action.toLowerCase() === "calendar") {
        const message = data.payload.message.toLowerCase();

        switch (true) {
          case message.includes("event_created_from_google_calendar"):
            dispatch(createGoogleEventMQTT(data.payload));
            break;

          case message.includes("event_updated_from_google_calendar"):
            dispatch(updateGoogletEventMQTT(data.payload));
            break;

          case message.includes("event_deleted_from_google_calendar"):
            dispatch(deleteGoogleEventMQTT(data.payload));
            break;

          case message.includes("new_microsoft_event_creation"):
            dispatch(createMicrosftEventMQTT(data.payload));
            break;

          case message.includes("new_microsoft_event_updated"):
            dispatch(updateMicrosftEventMQTT(data.payload));
            break;

          case message.includes("new_microsoft_event_deleted"):
            dispatch(deleteMicrosftEventMQTT(data.payload));
            break;

          default:
            break;
        }
      }

      if (data.action.toLowerCase() === "logout") {
        const message = data.payload.toLowerCase();

        switch (true) {
          case message.includes("user_logout_due_to_inactivity"):
            dispatch(userLogOutApiFunc(navigate, t));
            break;

          default:
            break;
        }
      }

      if (data.action.toLowerCase() === "login") {
        const message = data.message.toLowerCase();

        switch (message) {
          case "user_login_activity":
            leaveMeetingCall(data?.payload);
            break;

          default:
            break;
        }
      }

      if (data.action.toLowerCase() === "dataroom") {
        const message = data.payload.message.toLowerCase();

        try {
          switch (message) {
            case "file_shared":
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("FILE_SHARED"),
                    "[Place holder]",
                    data?.payload?.data?.displayFileName
                  ),
                });
              }
              setNotificationID(id);
              dispatch(fileSharedMQTT(data.payload));
              break;

            case "folder_shared":
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("FOLDER_SHARED"),
                    "[Place holder]",
                    data?.payload?.data?.displayFolderName
                  ),
                });
              }
              setNotificationID(id);
              dispatch(folderSharedMQTT(data.payload));
              break;

            case "file_sharing_removed":
            case "file_deleted":
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: `file remove to you`,
                });
              }
              setNotificationID(id);
              dispatch(fileRemoveMQTT(data?.payload?.fileID));
              break;

            case "folder_sharing_removed":
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: `folder remove to you`,
                });
              }
              setNotificationID(id);
              dispatch(folderRemoveMQTT(data?.payload?.fileID));
              break;

            case "folder_deleted":
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: `folder remove to you`,
                });
              }
              setNotificationID(id);
              dispatch(folderRemoveMQTT(data?.payload?.folderID));
              break;

            case "meeting_transcript_downloaded":
              dispatch(meetingTranscriptDownloaded(data.payload));
              console.log(data.payload, "datapayload");
              break;

            case "meeting_minutes_downloaded":
              dispatch(meetingMinutesDownloaded(data.payload));
              console.log(data.payload, "datapayload");
              break;

            case "meeting_video_recording_received":
              dispatch(meetingVideoRecording(data.payload));
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_VIDEO_RECORDING_RECEIVED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle
                  ),
                });
                setNotificationID(id);
              }
              break;

            case "video_recording_received":
              dispatch(videoRecording(data.payload));
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message:
                    data.payload.callTypeID === 1
                      ? changeMQTTJSONOne(
                          t("VIDEO_RECORDING_ONETO_ONE_RECEIVED"),
                          "[Participant Name]",
                          data.payload?.callReceipents[0]?.name
                        )
                      : changeMQTTJSONOne(
                          t("VIDEO_RECORDING_GROUP_RECEIVED"),
                          "[Participant Name]",
                          data.payload?.callReceipents[0]?.name
                        ),
                });
                setNotificationID(id);
              }
              break;

            default:
              break;
          }
        } catch (error) {
          console.log(error, "errorerrorerror");
        }
      }

      //Web Notification
      if (data.action.toLowerCase() === "webnotification") {
        const message = data.payload.message.toLowerCase();

        switch (message) {
          case "web_notification":
            console.log(data.payload, "datapayload");
            dispatch(DiskusGlobalUnreadNotificationCount(data.payload));
            setNotificationID(id);
            break;

          default:
            break;
        }
      }

      if (data.action.toLowerCase() === "workflow") {
        const message = data.payload.message.toLowerCase();

        switch (true) {
          case message.includes("signature_document_sent_by_me"):
            dispatch(SignatureDocumentReceivedMyMe(data.payload));
            break;

          case message.includes("signature_document_received"):
            dispatch(SignatureDocumentReceived(data.payload));
            if (data.payload?.workFlowStatusID === 3) return;
            setPendingApprovalTabCount((prev) => ({
              ...prev,
              pendingSignature: (prev.pendingSignature ?? 0) + 1,
            }));

            break;

          case message.includes("signature_document_status_change"):
            dispatch(SignatureDocumentStatusChange(data.payload));
            // If needed, decrease signature count here
            break;

          case message.includes("signature_document_action_by_me"):
            dispatch(SignatureDocumentActionByMe(data.payload));
            setPendingApprovalTabCount((prev) => ({
              ...prev,
              pendingSignature: Math.max((prev.pendingSignature ?? 0) - 1, 0),
            }));
            if (data.payload.data.status === "Signed") {
              showMessage(
                t("Document-has-been-signed-successfully"),
                "success",
                setOpen
              );
            } else if (data.payload.data.status === "Declined") {
              showMessage(
                t("Document-has-been-declined-successfully"),
                "success",
                setOpen
              );
            }
            break;

          case message.includes("signature_document_status_change_for_signees"):
            dispatch(SignatureDocumentStatusChangeSignees(data.payload));
            break;

          case message.includes("minute_reviewer_added"):
            dispatch(MinuteReviwerCount(data.payload));
            setPendingApprovalTabCount((prev) => ({
              ...prev,
              pendingMinutes: (prev.pendingMinutes ?? 0) + 1,
            }));
            break;

          case message.includes("minute_review_recieved_count"):
            console.log(data.payload.pendingMinute, "IOS");
            setPendingApprovalTabCount((prev) => {
              if (prev.pendingMinutes !== data.payload.pendingMinute) {
                return {
                  ...prev,
                  pendingMinutes: data.payload.pendingMinute,
                };
              }
              return prev;
            });
            break;

          default:
            break;
        }
      }

      if (data.action.toLowerCase() === "settings") {
        const message = data.payload.message.toLowerCase();

        switch (true) {
          case message.includes("notification_marked_as_read"):
            setUnReadCountNotification(0);
            break;

          default:
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onConnectionLost = () => {
    setTimeout(mqttConnection, 3000);
  };

  useEffect(() => {
    if (Helper.socket === null) {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID, dispatch);
      }
    }
    if (newClient !== null) {
      newClient.onConnectionLost = onConnectionLost;
      newClient.onMessageArrived = onMessageArrived;
    }
  }, [
    newClient,
    IncomingVideoCallFlagReducer,
    NormalizeVideoFlag,
    MaximizeVideoFlag,
  ]);

  useEffect(() => {
    try {
      if (
        VideoMainReducerResponseMessage !== "" &&
        VideoMainReducerResponseMessage !== t("No-record-found") &&
        VideoMainReducerResponseMessage !== t("No-records-found") &&
        VideoMainReducerResponseMessage !== "" &&
        VideoMainReducerResponseMessage !== t("List-updated-successfully") &&
        VideoMainReducerResponseMessage !== t("No-data-available") &&
        VideoMainReducerResponseMessage !== t("Successful") &&
        VideoMainReducerResponseMessage !== t("Record-updated") &&
        VideoMainReducerResponseMessage !== t("MISSED_CALLS_COUNT") &&
        VideoMainReducerResponseMessage !== undefined
      ) {
        showMessage(VideoMainReducerResponseMessage, "success", setOpen);
        dispatch(cleareResponceMessage(""));
      }
    } catch (error) {
      console.log(error);
    }
  }, [VideoMainReducerResponseMessage]);

  useEffect(() => {
    if (Blur !== null) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    dispatch(GetAllUserChats(navigate, createrID, currentOrganization, t));
    dispatch(GetUserMissedCallCount(navigate, t));
    //Owais Pending APproval Count
    dispatch(GetPendingApprovalsCount(navigate, t));
    localStorage.setItem("activeOtoChatID", 0);

    let activeCall = JSON.parse(localStorage.getItem("activeCall"));

    if (window.performance) {
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        const navigationType = navigationEntries[0].type;
        if (navigationType === "reload" && activeCall === true) {
          dispatch(normalizeVideoPanelFlag(true));
        } else {
        }
      }
    }
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    setCurrentLanguage(i18nextLng);
  }, [i18nextLng]);

  useEffect(() => {
    if (
      MeetingStatusEnded !== null &&
      MeetingStatusEnded !== undefined &&
      MeetingStatusEnded.length !== 0
    ) {
      let endMeetingData = MeetingStatusEnded?.meeting;
      let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
      let isMeetingVideo = localStorage.getItem("isMeetingVideo");
      isMeetingVideo = isMeetingVideo ? JSON.parse(isMeetingVideo) : false;
      if (endMeetingData) {
        if (
          currentMeetingID === endMeetingData?.pK_MDID &&
          Number(endMeetingData?.statusID) === 9
        ) {
          if (isMeetingVideo === true) {
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
          }
        }
      }
    }
  }, [MeetingStatusEnded]);

  const [isMeetingLocal, setIsMeetingLocal] = useState(false);
  const [isMeetingSession, setIsMeetingSession] = useState(false);
  const [activeCallOtoAndGroupCallLocal, setActiveCallOtoAndGroupCallLocal] =
    useState(false);
  const [
    activeCallOtoAndGroupCallSession,
    setActiveCallOtoAndGroupCallSession,
  ] = useState(false);
  // Function to read current values
  const getMeetingValues = () => {
    const local = localStorage.getItem("isMeeting");
    const session = sessionStorage.getItem("isMeeting");
    const isActiveOtoAndGroupCall = localStorage.getItem("activeCall");
    const isActiveOtoAndGroupCallTab = sessionStorage.getItem(
      "activeCallSessionforOtoandGroup"
    );

    setIsMeetingLocal(local ? JSON.parse(local) : false);
    setIsMeetingSession(session ? JSON.parse(session) : false);
    // setActiveCallOtoAndGroupCallLocal(
    //   isActiveOtoAndGroupCall ? JSON.parse(isActiveOtoAndGroupCall) : false
    // );
    // setActiveCallOtoAndGroupCallSession(
    //   isActiveOtoAndGroupCallTab
    //     ? JSON.parse(isActiveOtoAndGroupCallTab)
    //     : false
    // );
  };

  useEffect(() => {
    // Run once initially
    getMeetingValues();

    // Listen for changes to storage (fires across tabs)
    const handleStorageChange = (event) => {
      if (event.key === "isMeeting") {
        getMeetingValues();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleClickClose = useCallback(() => {
    window.close();
  }, []);

  useEffect(() => {
    if (activeCallLocalStorage && !activeCallsessionStorage) {
      navigate("/AlreadyInGroupAndOtoCall");
    }
  }, [activeCallLocalStorage, activeCallsessionStorage]);

  return (
    <>
      <ConfigProvider
        direction={currentLanguage === "ar" ? ar_EG : en_US}
        locale={currentLanguage === "ar" ? ar_EG : en_US}>
        {IncomingVideoCallFlagReducer === true && (
          <div className='overlay-incoming-videocall' />
        )}
        <Layout className='mainDashboardLayout'>
          {location.pathname === "/Diskus/videochat" ||
          location.pathname.includes("meetingDocumentViewer") ? null : (
            <Header2 />
          )}
          <Layout>
            {location.pathname.includes("meetingDocumentViewer") ? null : (
              <>
                <Sider className='sidebar_layout' width={60}>
                  <Sidebar />
                </Sider>
              </>
            )}

            <Content>
              <div
                className={
                  !location.pathname.includes("meetingDocumentViewer") &&
                  "dashbaord_data"
                }>
                <>
                  {/* When checking one and group call */}
                  {/* {isMeetingLocal || activeCallOtoAndGroupCallLocal
                    ? (!isMeetingSession ||
                        !activeCallOtoAndGroupCallSession) &&
                      !(
                        Number(editorRole.status) === 10 ||
                        location.pathname.includes("documentViewer")
                      ) && (
                        <AlreadyInMeeting handleClickClose={handleClickClose} />
                      )
                    : null} */}
                  {/* {isMeetingLocal
                    ? !isMeetingSession &&
                      !(
                        Number(editorRole.status) === 10 ||
                        location.pathname.includes("meetingDocumentViewer")
                      ) && (
                        <AlreadyInMeeting handleClickClose={handleClickClose} />
                      )
                    : null} */}
                  <Outlet />
                </>
              </div>
              {!location.pathname.includes("meetingDocumentViewer") && (
                <div className='talk_features_home'>
                  {activateBlur ? null : roleRoute ? null : <Talk />}
                </div>
              )}
            </Content>
          </Layout>
          {notificationID !== 0 && (
            <NotificationBar
              iconName={
                <img src={IconMetroAttachment} alt='' draggable='false' />
              }
              notificationMessage={notification.message}
              notificationState={notification.notificationShow}
              setNotification={setNotification}
              handleClose={closeNotification}
              id={notificationID}
            />
          )}

          {ShowGuestPopup && (
            <div>
              <GuestJoinRequest />
            </div>
          )}
          {IncomingVideoCallFlagReducer === true ? <VideoMaxIncoming /> : null}
          {VideoChatMessagesFlagReducer === true ? (
            <TalkChat2
              chatParentHead='chat-messenger-head-video'
              chatMessageClass='chat-messenger-head-video'
            />
          ) : null}
          {/* <Modal show={true} size="md" setShow={true} /> */}
          {NormalizeVideoFlag === true ||
          MinimizeVideoFlag === true ||
          MaximizeVideoFlag === true ? (
            <VideoCallScreen />
          ) : null}
          {/* Disconnectivity Modal  */}
          {isInternetDisconnectModalVisible && (
            <InternetConnectivityModal
              open={isInternetDisconnectModalVisible}
            />
          )}
          <Notification open={open} setOpen={setOpen} />
          {cancelModalMeetingDetails && <CancelButtonModal />}
          {roleRoute && (
            <Modal
              show={roleRoute}
              setShow={() => {
                setActivateBlur();
              }}
              ButtonTitle={"Block"}
              centered
              size={"md"}
              modalHeaderClassName='d-none'
              ModalBody={
                <>
                  <Row className='mb-1'>
                    <Col lg={12} md={12} xs={12} sm={12}>
                      <Row>
                        <Col className='d-flex justify-content-center'>
                          <img
                            src={VerificationFailedIcon}
                            width={60}
                            className={"allowModalIcon"}
                            alt=''
                            draggable='false'
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col className='text-center mt-4'>
                          <label className={"allow-limit-modal-p"}>
                            {t(
                              "The-organization-subscription-is-not-active-please-contact-your-admin"
                            )}
                          </label>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              }
              ModalFooter={
                <Row className='mb-3'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-center'>
                    <Button
                      className={"Ok-Successfull-btn"}
                      text={t("Ok")}
                      onClick={closeModal}
                    />
                  </Col>
                </Row>
              }
            />
          )}
          {cancelConfirmationModal && <CancelConfirmationModal />}
          {mobileAppPopUp && <MobileAppPopUpModal />}
          {showInitimationMessegeModalLeaveVideoMeeting && (
            <LeaveVideoIntimationModal />
          )}
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default Dashboard;
