import TalkChat2 from "../../components/layout/talk/talk-chat/talkChatBox/chat";
import React, { useState, useEffect, useRef } from "react";
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
  guestLeaveVideoMeeting,
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
  makeParticipantHost,
  endMeetingStatusForQuickMeetingVideo,
  endMeetingStatusForQuickMeetingModal,
  leaveMeetingVideoOnEndStatusMqtt,
  leaveMeetingOnEndStatusMqtt,
  leaveMeetingOnlogout,
  participantVideoButtonState,
  videoIconOrButtonState,
  setParticipantRemovedFromVideobyHost,
  openPresenterViewMainApi,
  joinPresenterViewMainApi,
  stopPresenterViewMainApi,
  presenterViewGlobalState,
  leavePresenterViewMainApi,
  stopMeetingVideoByPresenter,
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
} from "../../store/actions/VideoFeature_actions";
import {
  allMeetingsSocket,
  getMeetingStatusfromSocket,
  setMQTTRequestUpcomingEvents,
  createGroupMeeting,
  createCommitteeMeeting,
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
  LeaveCall,
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
  AgendaPollVotingStartedAction,
  AgendaPollVotingStartedMQTTObjectDataAction,
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
  transferMeetingHostSuccess,
} from "../../store/actions/Guest_Video";
import { DiskusGlobalUnreadNotificationCount } from "../../store/actions/UpdateUserNotificationSetting";
import VotingPollAgendaIntiminationModal from "../pages/meeting/scedulemeeting/Agenda/VotingPollAgendaInitimationModal/VotingPollAgendaIntiminationModal";
import CastVoteAgendaModal from "../pages/meeting/viewMeetings/Agenda/VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";
import CancelConfirmationModal from "../pages/meeting/cancelConfimationModal/CancelConfirmationModal";
import { useMeetingContext } from "../../context/MeetingContext";
import { DATAROOM_BREADCRUMBS } from "../../store/action_types";
import {
  SignatureDocumentActionByMe,
  SignatureDocumentReceived,
  SignatureDocumentReceivedMyMe,
  SignatureDocumentStatusChange,
  SignatureDocumentStatusChangeSignees,
} from "../../store/actions/workflow_actions";
import { showMessage } from "../../components/elements/snack_bar/utill";

const Dashboard = () => {
  const location = useLocation();

  const { Sider, Content } = Layout;

  const navigate = useNavigate();

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const {
    cancelConfirmationModal,
    setPresenterForOneToOneOrGroup,
    setLeaveOneToOne,
    groupVideoCallAccepted,
    setGroupVideoCallAccepted,
    groupCallParticipantList,
    setGroupCallParticipantList,
    unansweredCallParticipant,
    setUnansweredCallParticipant,
  } = useMeetingContext();

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

  console.log(IncomingVideoCallFlagReducer, "IncomingVideoCallFlagReducer");
  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );

  const getJoinMeetingParticipantorHostrequest = useSelector(
    (state) => state.videoFeatureReducer.getJoinMeetingParticipantorHostrequest
  );

  const maximizeParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.maximizeParticipantVideoFlag
  );
  console.log(NormalizeVideoFlag, "NormalizeVideoFlag");

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

  const getNewParticipantsMeetingJoin = useSelector(
    (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  );

  const getAllParticipantMain = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );
  console.log(
    getAllParticipantMain,
    "getAllParticipantMaingetAllParticipantMain"
  );

  const getVideoParticpantListandWaitingList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
  );
  const viewAdvanceMeetingsPublishPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingPublishPageFlag
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

  console.log(leavePresenterOrJoinOtherCalls, "leavePresenterOrJoinOtherCalls");

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

  // For End QUick Meeting

  const meetingEnded = (payload) => {
    console.log("mqtt mqmqmqmqmqmq", payload);
    let meetingVideoID = localStorage.getItem("currentMeetingID");
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    if (Number(meetingVideoID) === Number(payload?.meeting?.pK_MDID)) {
      if (isMeeting) {
        let typeOfMeeting = localStorage.getItem("typeOfMeeting");
        if (String(typeOfMeeting) === "isQuickMeeting") {
          if (isMeetingVideo) {
            dispatch(endMeetingStatusForQuickMeetingVideo(true));
          } else {
            dispatch(endMeetingStatusForQuickMeetingModal(true));
          }
        } else if (String(typeOfMeeting) === "isAdvanceMeeting") {
          console.log("mqtt mqmqmqmqmqmq");
          if (isMeetingVideo) {
            console.log("mqtt mqmqmqmqmqmq");
            dispatch(leaveMeetingVideoOnEndStatusMqtt(true));
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
    let currentCallType = Number(localStorage.getItem("CallType"));
    console.log("mqtt mqmqmqmqmqmq", activeCallState);
    console.log("mqtt mqmqmqmqmqmq", currentCallType);

    if (isMeeting) {
      console.log("mqtt mqmqmqmqmqmq", currentCallType);
      if (String(meetingVideoID) === String(payload?.meetingID)) {
        console.log("mqtt mqmqmqmqmqmq", currentCallType);
        if (alreadyInMeetingVideoStartPresenterCheck) {
          sessionStorage.removeItem("alreadyInMeetingVideoStartPresenterCheck");
        } else if (activeCallState && currentCallType === 1) {
          console.log("mqtt mqmqmqmqmqmq", payload);
          setPresenterForOneToOneOrGroup(true);
          await dispatch(nonMeetingVideoGlobalModal(true));
        } else if (isMeetingVideo) {
          let isWaiting = JSON.parse(sessionStorage.getItem("isWaiting"));
          let leaveRoomId =
            getJoinMeetingParticipantorHostrequestRoomIdRef.current;
          let userGUID = getJoinMeetingParticipantorHostrequestGuidRef.current;
          let newName = localStorage.getItem("name");
          let currentMeetingID = localStorage.getItem("currentMeetingID");
          let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
          if (isWaiting) {
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
          console.log("maximizeParticipantVideoFlag");
          if (maximizeParticipantVideoFlagRef.current) {
            console.log("maximizeParticipantVideoFlag");

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
            let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
            let data = {
              VideoCallURL: String(currentMeetingVideoURL),
              WasInVideo: isMeetingVideo ? true : false,
            };
            dispatch(participantWaitingListBox(false));

            dispatch(joinPresenterViewMainApi(navigate, t, data));
          }
        }
      }
    }
  };

  const stopPresenterView = async (payload) => {
    let StopPresenterViewAwait = JSON.parse(
      sessionStorage.getItem("StopPresenterViewAwait")
    );
    let userIDCurrent = Number(localStorage.getItem("userID"));
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
    if (String(meetingVideoID) === String(payload?.meetingID)) {
      if (isMeeting) {
        if (activeCallState && currentCallType === 1) {
          dispatch(presenterViewGlobalState(0, false, false, false));

          console.log("mqtt mqmqmqmqmqmq", payload);
        } else if (
          StopPresenterViewAwait === null ||
          StopPresenterViewAwait === undefined
        ) {
          console.log("mqtt mqmqmqmqmqmq", presenterViewJoinFlagRef.current);
          if (presenterViewFlagRef.current) {
            console.log("mqtt mqmqmqmqmqmq", alreadyInMeetingVideo);
            if (alreadyInMeetingVideo && presenterViewJoinFlagRef.current) {
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

              // Dispatch the API request with the data
              dispatch(muteUnMuteSelfMainApi(navigate, t, dataAudio, 1));
              let dataVideo = {
                RoomID: String(
                  isMeetingVideoHostCheck ? newRoomId : participantRoomId
                ),
                HideVideo: true, // Ensuring it's a boolean
                UID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
                MeetingID: Number(payload?.meetingID),
              };

              // Dispatch the API request with the data
              dispatch(hideUnhideSelfMainApi(navigate, t, dataVideo, 1));
              dispatch(setVideoControlHost(true));
              await dispatch(presenterViewGlobalState(0, false, false, false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(true));
              dispatch(minimizeVideoPanelFlag(false));
              console.log("mqtt mqmqmqmqmqmq");
            } else {
              sessionStorage.removeItem("alreadyInMeetingVideo");
              console.log("mqtt mqmqmqmqmqmq");
              localStorage.removeItem("participantUID");
              localStorage.removeItem("isGuid");
              localStorage.removeItem("videoIframe");
              localStorage.removeItem("acceptedRoomID");
              localStorage.removeItem("newRoomId");
              localStorage.removeItem("acceptedRoomID");
              dispatch(setAudioControlHost(false));
              dispatch(setVideoControlHost(false));
              dispatch(presenterViewGlobalState(0, false, false, false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
            }
          }
        } else {
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
              console.log("makeHostOnClick", meetingHost);
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
  async function joinRequestForMeetingVideo(mqttData) {
    try {
      const currentMeetingID = localStorage.getItem("currentMeetingID");
      const isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
      const isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );
      if (Number(mqttData.payload.meetingID) === Number(currentMeetingID))
        if (isMeetingVideo) {
          if (presenterViewJoinFlagRef.current) {
            console.log("Check PresenterIssue Once");
          } else {
            console.log("Check PresenterIssue Once");
            if (isMeetingVideoHostCheck) {
              console.log("Check PresenterIssue Once");
              if (mqttData.payload.isGuest) {
                dispatch(admitGuestUserRequest(mqttData.payload));
              } else {
                console.log("Check PresenterIssue Once");
                dispatch(participantWaitingList(mqttData.payload));
              }
              dispatch(guestJoinPopup(true));
            }
          }
        }
    } catch {}
  }
  const onMessageArrived = async (msg) => {
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    let data = JSON.parse(msg.payloadString);
    console.log(data, "MQTT onMessageArrived");
    try {
      if (data.action?.toLowerCase() === "Meeting".toLowerCase()) {
        if (data.action && data.payload) {
          try {
            if (
              data?.payload?.message.toLowerCase() ===
              "NEW_MEETING_CREATION".toLowerCase()
            ) {
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
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_EDITED_HOST".toLowerCase()
            ) {
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
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_STARTED".toLowerCase()
            ) {
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
            } else if (
              data.payload.message
                .toLowerCase()
                .includes("MEETING_STATUS_EDITED_END".toLowerCase())
            ) {
              try {
                let meetingVideoID = localStorage.getItem("currentMeetingID");

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
                console.log("mqtt mqmqmqmqmqmq", meetingVideoID);
                console.log(
                  "mqtt mqmqmqmqmqmq",
                  data?.payload?.meeting?.pK_MDID
                );
                meetingEnded(data.payload);
              } catch (error) {
                console.log(error);
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_CANCELLED".toLowerCase()
            ) {
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
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_ADMIN".toLowerCase()
            ) {
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
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_UPCOMING_EVENTS".toLowerCase()
            ) {
              dispatch(
                setMQTTRequestUpcomingEvents(data.payload.upcomingEvents[0])
              );
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PROPOSED".toLowerCase()
            ) {
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
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PUBLISHED".toLowerCase()
            ) {
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
              let newMeetting = {
                ...data.payload.meeting,
                talkGroupID: data.payload.talkGroupID,
              };
              dispatch(meetingStatusPublishedMqtt(newMeetting));
              setNotificationID(id);
            } else if (
              data.payload.message.toLowerCase() ===
              "AGENDA_VOTING_STARTED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("AGENDA_VOTING_STARTED"),
                });
                setNotificationID(id);
              }
              console.log(
                data.payload,
                "AgendaVotingModalStartedDataAgendaVotingModalStartedData"
              );
              dispatch(meetingAgendaStartedMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "AGENDA_VOTING_ENDED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("AGENDA_VOTING_ENDED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaEndedMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_MEETING_AGENDA_ADDED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("NEW_MEETING_AGENDA_ADDED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaUpdatedMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_MEETINGS_COUNT".toLowerCase()
            ) {
              dispatch(getDashboardMeetingCountMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PUBLISHED_GROUP".toLowerCase()
            ) {
              try {
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
                dispatch(createGroupMeeting(data.payload));
              } catch (error) {
                console.log(error);
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PUBLISHED_COMMITTEE".toLowerCase()
            ) {
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
              dispatch(createCommitteeMeeting(data.payload));
            } else if (
              data.payload.message?.toLowerCase() ===
              "NEW_MEETING_AGENDA_CONTRIBUTOR_ADDED".toLowerCase()
            ) {
              dispatch(meetingAgendaContributorAdded(data.payload));
            } else if (
              data.payload.message
                ?.toLowerCase()
                .includes(
                  "NEW_MEETING_AGENDA_CONTRIBUTOR_DELETED".toLowerCase()
                )
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_AGENDA_CONTRIBUTOR_DELETED"),
                    "[Place holder]",
                    data.payload.title.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }

              dispatch(meetingAgendaContributorRemoved(data.payload));
            } else if (
              data.payload.message
                ?.toLowerCase()
                .includes("NEW_MEETING_ORGANIZER_ADDED".toLowerCase())
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_CREATION"),
                    "[Place holder]",
                    data.payload.title.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(meetingOrganizerAdded(data.payload));
            } else if (
              data.payload.message
                ?.toLowerCase()
                .includes("MEETING_ORGANIZER_DELETED".toLowerCase())
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_CREATION"),
                    "[Place holder]",
                    data.payload.title.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(meetingOrganizerRemoved(data.payload));
            } else if (
              data?.payload?.message?.toLowerCase() ===
              "MeetingNotConductedNotification".toLowerCase()
            ) {
              try {
                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MEETING_STATUS_EDITED_NOTCONDUCTED"),
                      "[Meeting Title]",
                      data.payload.meetingTitle.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
                dispatch(meetingNotConductedMQTT(data.payload));
              } catch (error) {
                console.log(
                  error,
                  "MeetingReminderNotificationMeetingReminderNotification"
                );
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_GUEST_JOIN_REQUEST".toLowerCase()
            ) {
              dispatch(participantWaitingList(data.payload));
              dispatch(admitGuestUserRequest(data.payload));
              dispatch(guestJoinPopup(true));
            } else if (
              //when Participant or attendee send Request to Host
              data.payload.message.toLowerCase() ===
              "MEETING_VIDEO_PARTICIPANT_JOIN_REQUEST".toLowerCase()
            ) {
              joinRequestForMeetingVideo(data);
            } else if (
              data.payload.message.toLowerCase() ===
              "VIDEO_PARTICIPANT_LEFT".toLowerCase()
            ) {
              console.log(data.payload, "mqtt");
              console.log(waitingParticipantsList, "mqtt");

              // dispatch(setAudioControlHost(false));
              // dispatch(setVideoControlHost(false));
              if (data.payload.isGuest) {
                console.log("Is Guest True");
                // dispatch(guestLeaveVideoMeeting(data.payload.uid));
                const meetingHost = JSON.parse(
                  localStorage.getItem("meetinHostInfo")
                );
                let isGuid = "";
                if (meetingHost?.isHost) {
                  isGuid = localStorage.getItem("isGuid");
                } else {
                  isGuid = localStorage.getItem("participantUID");
                }
                if (isGuid !== data.payload.uid) {
                  dispatch(participantLeaveVideoMeeting(data.payload.uid)); // Dispatch for participants
                }
              } else {
                console.log("Is Guest True");

                const meetingHost = JSON.parse(
                  localStorage.getItem("meetinHostInfo")
                );
                let isGuid = "";
                if (meetingHost?.isHost) {
                  isGuid = localStorage.getItem("isGuid");
                } else {
                  isGuid = localStorage.getItem("participantUID");
                }
                if (isGuid !== data.payload.uid) {
                  dispatch(participantLeaveVideoMeeting(data.payload.uid)); // Dispatch for participants
                }
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MUTE_UNMUTE_AUDIO_BY_PARTICIPANT".toLowerCase()
            ) {
              dispatch(
                participanMuteUnMuteMeeting(
                  data.payload,
                  false,
                  presenterViewHostFlag,
                  presenterViewFlag
                )
              );
            } else if (
              data.payload.message.toLowerCase() ===
              "PARTICIPANT_RAISE_UNRAISE_HAND".toLowerCase()
            ) {
              dispatch(participanRaisedUnRaisedHand(data.payload));
              let isParticipantGuid = localStorage.getItem("participantUID");
              console.log(
                data.payload.participantGuid === isParticipantGuid,
                "checkchekc"
              );
              // if (
              //   data.payload.isHandRaised &&
              //   data.payload.participantGuid === isParticipantGuid
              // ) {
              //   console.log("handStatus");
              //   dispatch(setRaisedUnRaisedParticiant(true));
              // } else {
              //   console.log("handStatus");
              //   dispatch(setRaisedUnRaisedParticiant(false));
              // }
            } else if (
              data.payload.message.toLowerCase() ===
              "HIDE_UNHIDE_VIDEO_BY_PARTICIPANT".toLowerCase()
            ) {
              console.log(data.payload, "Partiicpantdatapayload");
              dispatch(participantHideUnhideVideo(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_NEW_PARTICIPANTS_JOINED".toLowerCase()
            ) {
              // localStorage.setItem(
              //   "isHost",
              //   data.payload.newParticipants.isHost
              // );
              dispatch(getParticipantsNewJoin(data.payload.newParticipants));
              console.log(data.payload, "JOINEDJOINEDJOINED");
            } else if (
              data.payload.message.toLowerCase() ===
              "REMOVED_FROM_MEETING".toLowerCase()
            ) {
              let isMeetingVideoCheck = JSON.parse(
                localStorage.getItem("isMeetingVideo")
              );
              let isZoomEnabled = JSON.parse(
                localStorage.getItem("isZoomEnabled")
              );
              console.log("leavecallMeetingVideo", isMeetingVideoCheck);
              if (isMeetingVideoCheck) {
                if (isZoomEnabled) {
                  dispatch(setAudioControlHost(false));
                  dispatch(setVideoControlHost(false));
                  await dispatch(setParticipantRemovedFromVideobyHost(true));
                } else {
                  const meetingHost = {
                    isHost: false,
                    isHostId: 0,
                    isDashboardVideo: true,
                  };
                  dispatch(makeHostNow(meetingHost));
                  localStorage.setItem("isMeeting", true);
                  localStorage.setItem("isMeetingVideo", false);
                  localStorage.removeItem("refinedVideoUrl");
                  localStorage.setItem("refinedVideoGiven", false);
                  localStorage.setItem("isWebCamEnabled", false);
                  localStorage.setItem("isMicEnabled", false);
                  dispatch(setAudioControlHost(false));
                  dispatch(setVideoControlHost(false));

                  localStorage.setItem(
                    "meetinHostInfo",
                    JSON.stringify(meetingHost)
                  );

                  dispatch(maximizeVideoPanelFlag(false));
                  dispatch(maxParticipantVideoRemoved(true));
                  // Participant room Id and usrrGuid
                  let participantRoomIds =
                    localStorage.getItem("participantRoomId");
                  let participantUID = localStorage.getItem("participantUID");
                  let currentMeetingID =
                    localStorage.getItem("currentMeetingID");
                  let newName = localStorage.getItem("name");
                  let Data = {
                    RoomID: String(participantRoomIds),
                    UserGUID: String(participantUID),
                    Name: String(newName),
                    IsHost: false,
                    MeetingID: Number(currentMeetingID),
                  };
                  dispatch(setRaisedUnRaisedParticiant(false));
                  dispatch(LeaveMeetingVideo(Data, navigate, t));
                }
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MUTE_UNMUTE_PARTICIPANT".toLowerCase()
            ) {
              const meetingHost = JSON.parse(
                localStorage.getItem("meetinHostInfo")
              );

              if (data.payload.isForAll) {
                if (presenterViewFlag) {
                  if (!presenterViewHostFlag) {
                    dispatch(setAudioControlHost(data.payload.isMuted));
                  }
                } else if (!meetingHost?.isHost) {
                  dispatch(setAudioControlHost(data.payload.isMuted));
                }
                // Dispatch action with all UIDs
                dispatch(
                  participanMuteUnMuteMeeting(
                    data.payload.isMuted,
                    true,
                    presenterViewHostFlag,
                    presenterViewFlag
                  )
                );
              } else {
                // Handle individual mute/unmute
                dispatch(
                  participanMuteUnMuteMeeting(
                    data.payload,
                    false,
                    presenterViewHostFlag,
                    presenterViewFlag
                  )
                );

                let isGuid = "";
                if (meetingHost?.isHost) {
                  isGuid = localStorage.getItem("isGuid");
                } else {
                  isGuid = localStorage.getItem("participantUID");
                }

                if (data.payload.uid === isGuid) {
                  dispatch(setAudioControlHost(data.payload.isMuted));
                }
              }

              console.log(data.payload, "guestDataGuestData");
            } else if (
              data.payload.message.toLowerCase() ===
              "HIDE_UNHIDE_PARTICIPANT_VIDEO".toLowerCase()
            ) {
              const meetingHost = JSON.parse(
                localStorage.getItem("meetinHostInfo")
              );
              let isGuid = "";
              if (meetingHost?.isHost) {
                isGuid = localStorage.getItem("isGuid");
              } else {
                isGuid = localStorage.getItem("participantUID");
              }
              //  dispatch(hideUnHideVideoByHost(data.payload));
              dispatch(participantHideUnhideVideo(data.payload));

              if (data.payload.uid === isGuid) {
                dispatch(setVideoControlHost(data.payload.isVideoHidden));
              }

              console.log(data.payload, "guestDataGuestDataVideo");
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_VIDEO_JOIN_REQUEST_REJECTED".toLowerCase()
            ) {
              dispatch(participantVideoButtonState(false));
              let currentMeetingID = 0;
              let isZoomEnabled = JSON.parse(
                localStorage.getItem("isZoomEnabled")
              );
              if (isZoomEnabled) {
                currentMeetingID = String(
                  localStorage.getItem("currentMeetingID")
                );
              } else {
                currentMeetingID = Number(
                  localStorage.getItem("currentMeetingID")
                );
              }

              let userIDCurrent = Number(localStorage.getItem("userID"));
              let isMeetingVideo = localStorage.getItem("isMeetingVideo");
              let flagForZoom1 = false;
              if (isZoomEnabled) {
                flagForZoom1 =
                  String(currentMeetingID) === String(data.payload.meetingID);
              } else {
                flagForZoom1 =
                  Number(currentMeetingID) === Number(data.payload.meetingID);
              }
              if (
                isMeetingVideo &&
                flagForZoom1 &&
                Number(userIDCurrent) === Number(data.payload.userID)
              ) {
                sessionStorage.removeItem("isWaiting");

                localStorage.setItem("isMeetingVideo", false);
                dispatch(globalNavigatorVideoStream(1));
                dispatch(globalStateForAudioStream(true));
                dispatch(globalStateForVideoStream(true));
                // dispatch(maxParticipantVideoCallPanel(false));
                // dispatch(maxParticipantVideoDenied(true));
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_VIDEO_JOIN_REQUEST_APPROVED".toLowerCase()
            ) {
              // dispatch(maxParticipantVideoCallPanel(false));
              // dispatch(maximizeVideoPanelFlag(true));
              dispatch(globalNavigatorVideoStream(2));

              dispatch(globalStateForAudioStream(true));
              dispatch(globalStateForVideoStream(true));
              localStorage.setItem("CallType", 2);
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("activeCall", true);
              console.log("iframeiframe", data.payload.userID);
              localStorage.setItem("acceptedRecipientID", data.payload.userID);
              localStorage.setItem("isMeetingVideo", true);
              localStorage.setItem(
                "currentMeetingVideoUrl",
                data.payload.videoUrl
              );
              console.log("iframeiframe", data.payload.userID);
              if (data?.payload?.videoUrl) {
                // Fetch values from localStorage and Redux
                console.log("iframeiframe", data.payload.userID);
                console.log("isMeetingVideo", audioControlForParticipant);
                console.log("isMeetingVideo", videoControlForParticipant);
                let videoControlForParticipantLoacl = JSON.parse(
                  localStorage.getItem("isWebCamEnabled")
                );
                let audioControlForParticipantLocal = JSON.parse(
                  localStorage.getItem("isMicEnabled")
                );
                console.log("iframeiframe", data.payload.userID);
                dispatch(setAudioControlHost(audioControlForParticipantLocal));
                console.log("iframeiframe", data.payload.userID);
                dispatch(setVideoControlHost(videoControlForParticipantLoacl));

                const currentParticipantUser = localStorage.getItem("name");
                // Refine the URL by replacing placeholders
                let refinedUrl = "";
                let isZoomEnabled = JSON.parse(
                  localStorage.getItem("isZoomEnabled")
                );
                if (isZoomEnabled) {
                  refinedUrl = data.payload.videoUrl;
                } else {
                  refinedUrl = data.payload.videoUrl
                    .replace("$ParticipantFullName$", currentParticipantUser)
                    .replace(
                      "$IsMute$",
                      audioControlForParticipantLocal.toString()
                    )
                    .replace(
                      "$IsHideCamera$",
                      videoControlForParticipantLoacl.toString()
                    );
                }

                // Store the refined URL in localStorage
                localStorage.setItem("refinedVideoUrl", refinedUrl);
                localStorage.setItem("refinedVideoGiven", true);
              } else {
                console.error("Invalid data or missing videoUrl in payload");
              }

              console.log("iframeiframe", data.payload);
              dispatch(getVideoUrlForParticipant(data.payload.videoUrl));
              localStorage.setItem("participantRoomId", data.payload.roomID);
              localStorage.setItem("participantUID", data.payload.uid);
              localStorage.setItem("activeRoomID", data.payload.roomID);
              // dispatch(participantVideoNavigationScreen(3));
            } else if (
              data.payload.message.toLowerCase() ===
              "TRANSFER_HOST_TO_PARTICIPANT_NOTIFY".toLowerCase()
            ) {
              // dispatch(makeParticipantHost(data.payload, true));
            } else if (
              data.payload.message.toLowerCase() ===
              "TRANSFER_HOST_TO_PARTICIPANT".toLowerCase()
            ) {
              let userID = Number(localStorage.getItem("userID"));
              let isMeetingVideo = JSON.parse(
                localStorage.getItem("isMeetingVideo")
              );
              console.log("mqtt check 22", userID);
              console.log("mqtt check 22", data.receiverID[0]);
              if (userID === data.receiverID[0] && isMeetingVideo) {
                console.log("mqtt check 22");

                const meetingHost = {
                  isHost: true,
                  isHostId: Number(localStorage.getItem("userID")),
                  isDashboardVideo: true,
                };
                localStorage.setItem(
                  "meetinHostInfo",
                  JSON.stringify(meetingHost)
                );
                console.log("mqtt check 22");
                dispatch(videoIconOrButtonState(true));
                dispatch(participantVideoButtonState(false));
                localStorage.setItem("isMeetingVideoHostCheck", true);
                localStorage.setItem("isHost", true);
                // change room id for host
                let participantRoomId =
                  localStorage.getItem("participantRoomId");
                console.log("mqtt check 22", participantRoomId);
                localStorage.setItem("newRoomId", participantRoomId);
                // remove room id of participant
                localStorage.removeItem("participantRoomId");
                // set host url
                let refinedVideoUrl = localStorage.getItem("refinedVideoUrl");
                localStorage.setItem("hostUrl", refinedVideoUrl);
                // remove host url
                localStorage.removeItem("refinedVideoUrl");
                // change participant id to host id
                let participantUID = localStorage.getItem("participantUID");
                localStorage.setItem("isGuid", participantUID);
                dispatch(participantWaitingListBox(false));
                dispatch(toggleParticipantsVisibility(false));
                dispatch(acceptHostTransferAccessGlobalFunc(true));
                let newRoomId = localStorage.getItem("newRoomId");
                console.log("mqtt check 22", newRoomId);
                let Data = {
                  RoomID: String(newRoomId),
                };
                await dispatch(
                  participantListWaitingListMainApi(Data, navigate, t)
                );
              }
            } else if (
              data?.payload?.message?.toLowerCase() ===
              "MeetingReminderNotification".toLowerCase()
            ) {
              try {
                dispatch(meetingReminderNotifcation(data.payload));
                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MeetingReminderNotification"),
                      "[Meeting Title]",
                      data.payload.calenderEvents.title.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
              } catch (error) {
                console.log(
                  error,
                  "MeetingReminderNotificationMeetingReminderNotification"
                );
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_PARTICIPANT_DELETED".toLowerCase()
            ) {
              dispatch(meetingParticipantRemoved(data.payload));

              if (data.viewable) {
                setNotificationID(id);
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_MEETING_PARTICIPANT_ADDED".toLowerCase()
            ) {
              if (
                Number(data.payload.status) !== 11 &&
                Number(data.payload.status) !== 12
              ) {
                dispatch(meetingParticipantAdded(data.payload));

                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MeetingReminderNotification"),
                      "[Meeting Title]",
                      data.payload.title.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_PRESENTATION_STARTED".toLowerCase()
            ) {
              startPresenterView(data.payload);
              // Dispatch action with all UIDs
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_PRESENTATION_STOPPED".toLowerCase()
            ) {
              dispatch(setAudioControlHost(false));
              dispatch(setVideoControlHost(false));
              dispatch(setRaisedUnRaisedParticiant(false));
              dispatch(clearPresenterParticipants());
              stopPresenterView(data.payload);
            } else if (
              data.payload.message.toLowerCase() ===
              "PRESENTATION_PARTICIPANT_JOINED".toLowerCase()
            ) {
              dispatch(
                presenterNewParticipantJoin(data.payload.newParticipant)
              );
              console.log(data.payload.newParticipant, "checkdatacheckdata");
            } else if (
              data.payload.message.toLowerCase() ===
              "PRESENTATION_PARTICIPANT_LEFT".toLowerCase()
            ) {
              dispatch(presenterLeaveParticipant(data.payload));
              console.log("Participant Left:", data.payload.uid);
            } else if (
              data.payload.message.toLowerCase() ===
              "UPCOMING_EVENTS_REMOVE".toLowerCase()
            ) {
              dispatch(
                removeUpComingEvent(
                  data.payload.upcomingEvents[0]?.meetingDetails?.pK_MDID
                )
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      if (data.action.toLowerCase() === "TODO".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_CREATION".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "TDOD_STATUS_EDITED".toLowerCase()
        ) {
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
          }
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "TDOD_STATUS_DELETED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_DELETED".toLowerCase()
        ) {
        } else if (
          data.payload.message.toLowerCase() === "NEW_TODO_COUNT".toLowerCase()
        ) {
          dispatch(getDashboardTaskCountMQTT(data.payload));
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMENT_DELETION".toLowerCase()
        ) {
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
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_ADVANCE_MEETING_TODO".toLowerCase())
        ) {
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
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_GROUP_TODO".toLowerCase())
        ) {
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
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_COMMITTEE_TODO".toLowerCase())
        ) {
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
        }
      }
      if (data.action.toLowerCase() === "COMMENT".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMENT_CREATION".toLowerCase()
        ) {
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
          }
          dispatch(postComments(data.payload.comment));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMENT_DELETION".toLowerCase()
        ) {
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
          }
          dispatch(deleteCommentsMQTT(data.payload));
          setNotificationID(id);
        }
      }
      if (data.action.toLowerCase() === "Notification".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() === "USER_EDITED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("USER_ROLE_EDITED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            if (data.payload.isLoggedOut === true) {
              //Apply Logout API here
              dispatch(userLogOutApiFunc(navigate, t));
            }
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() === "USER_DELETED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("USER_DELETED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            if (data.payload.isLoggedOut === true) {
              //Apply Logout API here
              dispatch(userLogOutApiFunc(navigate, t));
            }
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_SUBSCRIPTION_CANCELLED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("ORGANIZATION_SUBSCRIPTION_CANCELLED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            navigate("/");
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_DELETED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("ORGANIZATION_DELETED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            navigate("/");
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() ===
          "USER_PROFILE_EDITED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: t("USER_PROFILE_EDITED"),
          });
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_CREATION_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("NEW_TODO_CREATION_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_MEETTING_CREATION_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("NEW_MEETTING_CREATION_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_POLL_PUBLISHED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("NEW_POLL_PUBLISHED_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "POLL_EXPIRED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("POLL_EXPIRED_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "POLL_UPDATED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("POLL_UPDATED_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "POLL_DELETED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: "The Poll has been deleted",
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_SUBSCRIPTION_INACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-subscription-status-has-been-set-to-in-active"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_SUBSCRIPTION_SUSPENDED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-subscription-has-been-suspended"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_STATUS_INACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-organization-status-has-been-set-to-in-active"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_STATUS_SUSPENDED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-organization-status-has-been-suspended"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_CREATION_RECENT_ACTIVITY".toLowerCase()
        ) {
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_STATUS_EDITED_STARTED".toLowerCase()
        ) {
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_DELETED_RECENT_ACTIVITY".toLowerCase()
        ) {
        }
      }
      if (data.action.toLowerCase() === "Committee".toLowerCase()) {
        console.log(data.action, "actionactionactionaction");
        if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMITTEE_CREATION".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_COMMITTEE_CREATION"),
                "[Committe Title]",
                data.payload.committees.committeesTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Committee ${data.payload.committees.committeesTitle}`,
            });
          }
          dispatch(realtimeCommitteeResponse(data.payload.committees));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_MEMBER_ADDED_IN_COMMITTEE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_MEMBER_ADDED_IN_COMMITTEE"),
                "[Committee Title]",
                data.payload.committees.committeesTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Committee ${data.payload.committees.committeesTitle}`,
            });
          }
          dispatch(realtimeCommitteeResponse(data.payload.committees));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "COMMITTTEE_STATUS_EDITED_IN_ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("COMMITTTEE_STATUS_EDITED_IN_ACTIVE"),
                "[Committee Title]",
                data.payload.committeeTitle.substring(0, 100)
              ),
              // message: `Committee ${data.payload.committeeTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeCommitteeStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "COMMITTTEE_STATUS_EDITED_ARCHIVED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "COMMITTTEE_STATUS_EDITED_ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("COMMITTTEE_STATUS_EDITED_ACTIVE"),
                "[Committee Title]",
                data.payload.committeeTitle.substring(0, 100)
              ),
              // message: `Committee ${data.payload.committeeTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeCommitteeStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "MEMBER_REMOVED_FROM_COMMITTEE".toLowerCase()
        ) {
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
              // message: `Committee ${data.payload.committeeTitle} in which you are a member has been set as In-Active`,
            });
          }
        }
      }
      if (data.action.toLowerCase() === "Group".toLowerCase()) {
        console.log(data.action, "actionactionactionaction");
        if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_CREATION".toLowerCase()
        ) {
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
              // message: `You have been added as a member in Group  ${data.payload.groups.groupTitle}`,
            });
          }
          dispatch(realtimeGroupResponse(data.payload.groups));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_MEMBER_ADDED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_GROUP_MEMBER_ADDED"),
                "[Group Title]",
                data.payload.groups.groupTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Group  ${data.payload.groups.groupTitle}`,
            });
          }
          dispatch(realtimeGroupResponse(data.payload.groups));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_STATUS_EDITED_IN-ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("GROUP_STATUS_EDITED_IN-ACTIVE"),
                "[Group Title]",
                data.payload.groupTitle.substring(0, 100)
              ),
              // message: `Group ${data.payload.groupTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeGroupStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_STATUS_EDITED_ARCHIVED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_MEMBER_REMOVED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("GROUP_MEMBER_REMOVED"),
                "[Group Title]",
                data.payload.groups.groupTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Group  ${data.payload.groups.groupTitle}`,
            });
          }
          dispatch(removeGroupMemberMQTT(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_STATUS_EDITED_ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("GROUP_STATUS_EDITED_ACTIVE"),
                "[Group Title]",
                data.payload.groupTitle.substring(0, 100)
              ),
              // message: `Group ${data.payload.groupTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeGroupStatusResponse(data.payload));
          setNotificationID(id);
        }
      }
      if (
        data.action.toLowerCase() === "TALK".toLowerCase() &&
        checkFeatureIDAvailability(3)
      ) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_ONE_TO_ONE_MESSAGE".toLowerCase()
        ) {
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
              UpdateMessageAcknowledgement(apiAcknowledgementData, t, navigate)
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
              UpdateMessageAcknowledgement(apiAcknowledgementData, t, navigate)
            );
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_MESSAGE".toLowerCase()
        ) {
          if (data.payload.data[0].senderID !== parseInt(createrID)) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: `${data.payload.data[0].senderName} has sent a message in group ${data.payload.data[0].groupName}`,
            });
          }
          dispatch(mqttInsertPrivateGroupMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "USER_IS_BLOCKED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Selected user is blocked",
          });
          dispatch(mqttBlockUser(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "USER_IS_UNBLOCKED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Selected user is Unblocked",
          });
          dispatch(mqttUnblockUser(data.payload));
          setNotificationID(id);
        }
        //
        else if (
          data.payload.message.toLowerCase() === "MESSAGE_FLAGGED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Message Starred",
          });
          dispatch(mqttStarMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "MESSAGE_UNFLAGGED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Message Unstarred",
          });
          dispatch(mqttUnstarMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_CREATED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: `You have been added in Talk Group for ${data.payload.data[0].fullName}`,
          });
          dispatch(mqttGroupCreated(data.payload));

          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "GROUP_MODIFIED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: `Group ${data.payload.data[0].fullName} has updated`,
          });
          dispatch(mqttGroupUpdated(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "UNREAD_MESSAGES_COUNT".toLowerCase()
        ) {
          dispatch(mqttUnreadMessageCount(data.payload));
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_BROADCAST_MESSAGE".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: `You have sent a message in broadcast list ${data.payload.data[0].broadcastName}`,
          });
          dispatch(mqttInsertBroadcastMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "MESSAGE_DELIVERED".toLowerCase()
        ) {
          dispatch(mqttMessageStatusUpdate(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "MESSAGE_SEEN".toLowerCase()
        ) {
          dispatch(mqttMessageStatusUpdate(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "MESSAGE_DELETED".toLowerCase()
        ) {
          dispatch(mqttMessageDeleted(data.payload));
          setNotification({
            ...notification,
            notificationShow: true,
            message: `Message Deleted`,
          });
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "USER_LEFT_THE_GROUP".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "LAST_MESSAGE_AFTER_DELETION".toLowerCase()
        ) {
          dispatch(lastMessageDeletion(data.payload));
        }
      }
      if (data.action.toLowerCase() === "Polls".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_POLL_PUBLISHED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() === "POLL_UPDATED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() === "POLL_EXPIRED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "PUBLISHED_POLL_DELETED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_POLL_PUBLISHED_GROUP".toLowerCase())
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
            .includes("NEW_POLL_PUBLISHED_COMMITTEE".toLowerCase())
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
            .includes("NEW_POLL_PUBLISHED_MEETING".toLowerCase())
        ) {
          dispatch(createPollMeetingMQTT(data.payload));
          setNotificationID(id);
          let currentMeetingActive =
            localStorage.getItem("currentMeetingID") !== null
              ? Number(localStorage.getItem("currentMeetingID"))
              : 0;
          console.log(currentMeetingActive, "currentMeetingActive");
          if (
            Number(data?.payload?.meetingID) === Number(currentMeetingActive)
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
      }
      if (data.action.toLowerCase() === "Resolution".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_RESOLUTION_CREATION".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "RESOLUTION_CANCELLED".toLowerCase()
        ) {
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
        } else if (
          data.payload.message.toLowerCase() ===
          "RESOLUTION_CLOSED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("RESOLUTION_CLOSED"),
                "[Resolution Title]",
                data.payload.model.resolution.title
              ),
            });
          }
          dispatch(resolutionMQTTClosed(data.payload.model));
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
          // localStorage.setItem("activeCall", false);
          let activeCall = JSON.parse(localStorage.getItem("activeCall"));
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
            dispatch(incomingVideoCallMQTT(data.payload, data.payload.message));
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
          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
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
          console.log("mqtt");
          console.log("mqtt", typeof RoomID);
          console.log("mqtt", typeof data.payload.roomID);

          if (RoomID === data.payload.roomID && activeCall && !isMeetingVideo) {
            //To make false sessionStorage which is set on VideoCall
            if (Number(data.senderID) !== Number(createrID)) {
              if (Number(createrID) !== data.payload.recepientID) {
                localStorage.setItem("unansweredFlag", true);
              }
            }

            setNotification({
              ...notification,
              notificationShow: true,
              message: t("The-call-was-unanswered"),
            });
            setNotificationID(id);
            if (data.payload.callTypeID === 1) {
              sessionStorage.setItem("NonMeetingVideoCall", false);
              console.log("mqtt");
              dispatch(unansweredOneToOneCall(true));
              localStorage.setItem("onlyLeaveCall", true);
              console.log("setLeaveOneToOne");
              setLeaveOneToOne(true);
              dispatch(videoChatMessagesFlag(false));
              dispatch(videoOutgoingCallFlag(false));
              dispatch(
                callRequestReceivedMQTT(data.payload, data.payload.message)
              );
            } else {
              let CallType = Number(localStorage.getItem("CallType"));
              if (CallType === 2) {
                console.log("mqtt");
                setUnansweredCallParticipant((prevState) => {
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

              let RecipentIDsOninitiateVideoCall =
                JSON.parse(
                  localStorage.getItem("RecipentIDsOninitiateVideoCall")
                ) || [];

              let existingData =
                JSON.parse(localStorage.getItem("callerStatusObject")) || [];
              console.log("mqtt", checkCallStatus(existingData));

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
                  if (
                    RecipentIDsOninitiateVideoCall.length === 0 &&
                    existingData.length === 0
                  ) {
                    sessionStorage.setItem("NonMeetingVideoCall", false);
                    localStorage.setItem("onlyLeaveCall", true);
                    console.log("setLeaveOneToOne");
                    setLeaveOneToOne(true);
                    dispatch(videoChatMessagesFlag(false));
                    dispatch(videoOutgoingCallFlag(false));
                    dispatch(
                      callRequestReceivedMQTT(
                        data.payload,
                        data.payload.message
                      )
                    );
                  }
                }
              }
            }
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_RINGING".toLowerCase()
        ) {
          let userID = localStorage.setItem("userID");
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
          let callStatus = JSON.parse(localStorage.getItem("activeCall"));
          let roomID = 0;
          let flagCheck1 = false;
          if (isZoomEnabled) {
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
            flagCheck2 = String(roomID) === String(data.payload.roomID);
          } else {
            flagCheck2 = Number(roomID) === Number(data.payload.roomID);
          }
          if (flagCheck2 && !isMeetingVideo) {
            let callerID = JSON.parse(localStorage.getItem("callerID"));
            let newCallerID = JSON.parse(localStorage.getItem("newCallerID"));
            if (IncomingVideoCallFlagReducer === true && callStatus === false) {
              let callerID = Number(localStorage.getItem("callerID"));
              let newCallerID = Number(localStorage.getItem("newCallerID"));
              if (callerID === newCallerID) {
                localStorage.setItem("activeCall", false);
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
                localStorage.removeItem("acceptedRoomID");
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(incomingVideoCallFlag(false));
                localStorage.setItem("activeRoomID", acceptedRoomID);
              }
              if (activeRoomID === acceptedRoomID) {
                console.log("Check 123");
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
                localStorage.setItem("activeRoomID", acceptedRoomID);
              } else if (data.payload.callerID === callerID) {
                console.log("Check 123");
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(videoChatMessagesFlag(false));
                dispatch(maximizeVideoPanelFlag(false));
                dispatch(minimizeVideoPanelFlag(false));
                localStorage.setItem("activeCall", false);
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
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let isMeetingVideoHostCheck = JSON.parse(
            localStorage.getItem("isMeetingVideoHostCheck")
          );
          let activeCall = JSON.parse(localStorage.getItem("activeCall"));
          let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
          let RoomID = "";
          if (isZoomEnabled) {
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

          let CallType = Number(localStorage.getItem("CallType"));
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
          if (
            !isMeetingVideo &&
            Number(data.payload.roomID) === Number(roomID) &&
            userID !== data.senderID
          ) {
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
      if (data.action.toLowerCase() === "Notes".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_NOTES_CREATION".toLowerCase()
        ) {
          let data2 = {
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
        }
      }
      if (data.action.toLowerCase() === "Calendar".toLowerCase()) {
        if (
          data.payload.message
            .toLowerCase()
            .includes("EVENT_CREATED_FROM_GOOGLE_CALENDAR".toLowerCase())
        ) {
          dispatch(createGoogleEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("EVENT_UPDATED_FROM_GOOGLE_CALENDAR".toLowerCase())
        ) {
          dispatch(updateGoogletEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("EVENT_DELETED_FROM_GOOGLE_CALENDAR".toLowerCase())
        ) {
          // deleteGoogleEventMQTT;
          dispatch(deleteGoogleEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_MICROSOFT_EVENT_CREATION".toLowerCase())
        ) {
          dispatch(createMicrosftEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_MICROSOFT_EVENT_UPDATED".toLowerCase())
        ) {
          dispatch(updateMicrosftEventMQTT(data.payload));
          // updateMicrosftEventMQTT,
          //
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_MICROSOFT_EVENT_DELETED".toLowerCase())
        ) {
          dispatch(deleteMicrosftEventMQTT(data.payload));
          // deleteMicrosftEventMQTT;
        }
      }
      if (data.action.toLowerCase() === "LogOut".toLowerCase()) {
        if (
          data.payload
            .toLowerCase()
            .includes("USER_lOGOUT_DUE_TO_INACTIVITY".toLowerCase())
        ) {
          dispatch(userLogOutApiFunc(navigate, t));
        }
      }
      if (data.action.toLowerCase() === "Login".toLowerCase()) {
        if (
          data.message.toLowerCase() === "USER_LOGIN_ACTIVITY".toLowerCase()
        ) {
          leaveMeetingCall(data?.payload);
        }
      }
      if (data.action.toLowerCase() === "DATAROOM".toLowerCase()) {
        try {
          if (
            data.payload.message.toLowerCase() === "FILE_SHARED".toLowerCase()
          ) {
            try {
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
            } catch (error) {}
          } else if (
            data.payload.message.toLowerCase() === "FOLDER_SHARED".toLowerCase()
          ) {
            try {
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
            } catch (error) {}
          } else if (
            data.payload.message.toLowerCase() ===
              "FILE_SHARING_REMOVED".toLowerCase() ||
            "FILE_DELETED".toLowerCase()
          ) {
            try {
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: `file remove to you`,
                });
              }
              setNotificationID(id);
              dispatch(fileRemoveMQTT(data?.payload?.fileID));
            } catch (error) {}
          } else if (
            data.payload.message.toLowerCase() ===
            "FOLDER_SHARING_REMOVED".toLowerCase()
          ) {
            try {
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: `folder remove to you`,
                });
              }
              setNotificationID(id);
              dispatch(folderRemoveMQTT(data?.payload?.fileID));
            } catch (error) {}
          } else if (
            data.payload.message.toLowerCase() ===
            "FOLDER_DELETED".toLowerCase()
          ) {
            try {
              if (data.viewable) {
                setNotification({
                  notificationShow: true,
                  message: `folder remove to you`,
                });
              }
              setNotificationID(id);
              dispatch(folderRemoveMQTT(data?.payload?.folderID));
            } catch (error) {}
          }
          if (
            data.payload.message.toLowerCase() ===
            "MEETING_TRANSCRIPT_DOWNLOADED".toLowerCase()
          ) {
            dispatch(meetingTranscriptDownloaded(data.payload));
            console.log(data.payload, "datapayload");
          }
          if (
            data.payload.message.toLowerCase() ===
            "MEETING_MINUTES_DOWNLOADED".toLowerCase()
          ) {
            dispatch(meetingMinutesDownloaded(data.payload));
            console.log(data.payload, "datapayload");
          }
        } catch (error) {
          console.log(error, "errorerrorerror");
        }
      }
      //Web Notification
      if (data.action.toLowerCase() === "WEBNOTIFICATION".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "Web_Notification".toLowerCase()
        ) {
          console.log(data.payload, "datapayload");
          dispatch(DiskusGlobalUnreadNotificationCount(data.payload));
          setNotificationID(id);
        }
      }
      if (data.action.toLowerCase() === "WorkFlow".toLowerCase()) {
        if (
          data.payload.message
            .toLowerCase()
            .includes("SIGNATURE_DOCUMENT_SENT_BY_ME".toLowerCase())
        ) {
          dispatch(SignatureDocumentReceivedMyMe(data.payload));
        }

        if (
          data.payload.message
            .toLowerCase()
            .includes("SIGNATURE_DOCUMENT_RECEIVED".toLowerCase())
        ) {
          dispatch(SignatureDocumentReceived(data.payload));
        }
        if (
          data.payload.message
            .toLowerCase()
            .includes("SIGNATURE_DOCUMENT_STATUS_CHANGE".toLowerCase())
        ) {
          dispatch(SignatureDocumentStatusChange(data.payload));
        }
        if (
          data.payload.message
            .toLowerCase()
            .includes("SIGNATURE_DOCUMENT_ACTION_BY_ME".toLowerCase())
        ) {
          dispatch(SignatureDocumentActionByMe(data.payload));
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
        }
        if (
          data.payload.message
            .toLowerCase()
            .includes(
              "SIGNATURE_DOCUMENT_STATUS_CHANGE_FOR_SIGNEES".toLowerCase()
            )
        ) {
          dispatch(SignatureDocumentStatusChangeSignees(data.payload));
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

  return (
    <>
      <ConfigProvider
        direction={currentLanguage === "ar" ? ar_EG : en_US}
        locale={currentLanguage === "ar" ? ar_EG : en_US}
      >
        {IncomingVideoCallFlagReducer === true && (
          <div className="overlay-incoming-videocall" />
        )}
        <Layout className="mainDashboardLayout">
          {location.pathname === "/Diskus/videochat" ? null : <Header2 />}
          <Layout>
            <Sider className="sidebar_layout" width={"4%"}>
              <Sidebar />
            </Sider>
            <Content>
              <div className="dashbaord_data">
                <Outlet />
              </div>
              <div className="talk_features_home">
                {activateBlur ? null : roleRoute ? null : <Talk />}
              </div>
            </Content>
          </Layout>
          <NotificationBar
            iconName={
              <img src={IconMetroAttachment} alt="" draggable="false" />
            }
            notificationMessage={notification.message}
            notificationState={notification.notificationShow}
            setNotification={setNotification}
            handleClose={closeNotification}
            id={notificationID}
          />

          {ShowGuestPopup && (
            <div>
              <GuestJoinRequest />
            </div>
          )}
          {IncomingVideoCallFlagReducer === true ? <VideoMaxIncoming /> : null}
          {VideoChatMessagesFlagReducer === true ? (
            <TalkChat2
              chatParentHead="chat-messenger-head-video"
              chatMessageClass="chat-messenger-head-video"
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
              modalHeaderClassName="d-none"
              ModalBody={
                <>
                  <>
                    <Row className="mb-1">
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Row>
                          <Col className="d-flex justify-content-center">
                            <img
                              src={VerificationFailedIcon}
                              width={60}
                              className={"allowModalIcon"}
                              alt=""
                              draggable="false"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-center mt-4">
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
                </>
              }
              ModalFooter={
                <>
                  <Col sm={12} md={12} lg={12}>
                    <Row className="mb-3">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <Button
                          className={"Ok-Successfull-btn"}
                          text={t("Ok")}
                          onClick={closeModal}
                        />
                      </Col>
                    </Row>
                  </Col>
                </>
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
