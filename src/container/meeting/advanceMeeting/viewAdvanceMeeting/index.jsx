import React, { useContext, useEffect, useState } from "react";
import styles from "./ViewMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, Notification } from "../../../../components/elements";
import Organizers from "./Organizers/Organizers";
import AgendaContributers from "./AgendaContributors/AgendaContributers";
import {
  normalizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
  leaveMeetingOnlogout,
  leaveMeetingOnEndStatusMqtt,
  setRaisedUnRaisedParticiant,
  presenterViewGlobalState,
  setAudioControlHost,
  setVideoControlHost,
  isSharedScreenTriggeredApi,
  screenShareTriggeredGlobally,
} from "../../../../store/actions/VideoFeature_actions";
import {
  AgendaPollVotingStartedAction,
  LeaveCurrentMeeting,
  LeaveMeetingVideo,
  emailRouteID,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "@/store/actions/NewMeetingActions";
import Participants from "./Participants/Participants";
import Agenda from "./Agenda/Agenda";
import AgendaViewer from "./AgendaViewer/AgendaViewer";
import Minutes from "./Minutes/Minutes";
import Actions from "./Actions/Actions";
import Polls from "./Polls/Polls";
import Attendence from "./Attendence/Attendence";
import ViewMeetingDetails from "./meetingDetails/ViewMeetingDetails";
import { cleareAllState } from "../../../../store/actions/NewMeetingActions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkFeatureIDAvailability,
  WebNotificationExportRoutFunc,
} from "@/commen/functions/utils";
import Attendees from "./attendees/Attendees";
import { MeetingContext, useMeetingContext } from "@/context/MeetingContext";
import { userLogOutApiFunc } from "@/store/actions/Auth_Sign_Out";
import { getCurrentDateTimeUTC } from "@/commen/functions/date_formater";
import VotingPollAgendaIntiminationModal from "@/container/meeting/advanceMeeting/createEditAdvanceMeeting/Agenda/VotingPollAgendaInitimationModal/VotingPollAgendaIntiminationModal";
import CastVoteAgendaModal from "@/container/meeting/advanceMeeting/createEditAdvanceMeeting/Agenda/VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";
import PollsCastVoteInitimationModal from "@/container/meeting/commonComponents/pollsCastVoteInitimationModal/pollsCastVoteInitimationModal";
import { useGroupsContext } from "@/context/GroupsContext";
import { webnotificationGlobalFlag } from "@/store/actions/UpdateUserNotificationSetting";
import { useResolutionContext } from "@/context/ResolutionContext";
import { clearResponseMessage } from "@/store/actions/MeetingOrganizers_action";
import { showMessage } from "@/components/elements/snack_bar/utill";
import Recording from "./recording/Recording";

// Fix: import Redux tab actions
import {
  setViewTab,
  resetViewTabs,
} from "../../../../store/actions/ModalStates_actions";

const ViewMeetingModal = ({
  advanceMeetingModalID,
  setAdvanceMeetingModalID,
  unPublish,
  dataroomMapFolderId,
  setDataroomMapFolderId,
  setCurrentMeetingID,
  videoTalk,
  setVideoTalk,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const castYourVotePollModalState = useSelector(
    (state) => state.PollsReducer.castPollVoteModal,
  );

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Fix: read all tab states from Redux instead of context
  const viewTabs = useSelector((state) => state.ModalStatesReducer.viewTabs);

  const {
    meetingDetails,
    organizers,
    agendaContributors,
    participants,
    agenda,
    agendaViewer,
    minutes,
    actionsPage,
    polls,
    attendance,
    attendees,
    isRecording,
  } = viewTabs;

  const routeID = useSelector((state) => state.NewMeetingreducer.emailRouteID);

  const {
    setViewFlag,
    setViewProposeDatePoll,
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    setStopRecordingState,
    setViewAdvanceMeetingModal,
    iframeRef,
  } = useContext(MeetingContext);

  const { editorRole, setEditorRole } = useMeetingContext();

  const advanceMeetingOperations =
    JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true;
  const ViewAdvanceMeetingPolls =
    JSON.parse(localStorage.getItem("viewadvanceMeetingPolls")) === true;
  const ViewAdvanceMeetingTask =
    JSON.parse(localStorage.getItem("viewadvanceMeetingTask")) === true;

  const { setViewGroupPage, setShowModal } = useGroupsContext();
  const { setResultresolution } = useResolutionContext();

  const votingStartedAgendaIntiminationModalState = useSelector(
    (state) => state.NewMeetingreducer.agendavotingPollStartedData,
  );
  const AgendaVotingModalStartedData = useSelector(
    (state) => state.MeetingAgendaReducer.MeetingAgendaStartedData,
  );
  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag,
  );
  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag,
  );
  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag,
  );
  const { meetingIdReducer, NewMeetingreducer, MeetingAgendaReducer } =
    useSelector((state) => state);
  const { meetingID } = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingInfo,
  );

  console.log(meetingID, "meetingIDmeetingIDmeetingID");
  const leaveMeetingOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingOnLogoutResponse,
  );
  const leaveMeetingOnEndStatusMqttFlag = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingOnEndStatusMqttFlag,
  );
  const globalFunctionWebnotificationFlag = useSelector(
    (state) => state.settingReducer.globalFunctionWebnotificationFlag,
  );
  const webNotifactionDataRoutecheckFlag = JSON.parse(
    localStorage.getItem("webNotifactionDataRoutecheckFlag"),
  );
  const webNotificationData = useSelector(
    (state) => state.settingReducer.webNotificationDataVideoIntimination,
  );
  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare,
  );

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let userID = localStorage.getItem("userID");
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let isCaller = JSON.parse(localStorage.getItem("isCaller"));
  let isMinutePublished = localStorage.getItem("isMinutePublished");
  let meetingTitle = localStorage.getItem("meetingTitle");
  let CallType = Number(localStorage.getItem("CallType"));
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  let isMeetingVideoHostChecker = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck"),
  );

  // ─── Tab Switchers ────────────────────────────────────────────────────────
  // Fix: each handler replaced with single dispatch instead of 12 setter calls

  const showMeetingDeitals = () => dispatch(setViewTab("meetingDetails"));
  const showOrganizers = () => dispatch(setViewTab("organizers"));
  const showAgendaContributers = () =>
    dispatch(setViewTab("agendaContributors"));
  const showParticipants = () => dispatch(setViewTab("participants"));
  const showAgenda = () => dispatch(setViewTab("agenda"));
  const showMeetingMaterial = () => dispatch(setViewTab("agendaViewer"));
  const showMinutes = () => dispatch(setViewTab("minutes"));
  const showActions = () => dispatch(setViewTab("actionsPage"));
  const ShowPolls = () => dispatch(setViewTab("polls"));
  const showAttendance = () => dispatch(setViewTab("attendance"));
  const showAttendees = () => dispatch(setViewTab("attendees"));
  const showRecording = () => dispatch(setViewTab("isRecording"));

  // ─── Route-based Tab Selection ────────────────────────────────────────────
  // Fix: Note this file has a slightly different condition:
  // (status === 10 || status === 9) vs the other file which also included status === 1

  useEffect(() => {
    if (
      (Number(editorRole?.status) === 10 || Number(editorRole?.status) === 9) &&
      editorRole.role !== ""
    ) {
      if (routeID !== null && routeID !== 0) {
        if (Number(routeID) === 1) {
          dispatch(setViewTab("agendaContributors"));
        } else if (Number(routeID) === 2) {
          dispatch(setViewTab("organizers"));
        } else if (Number(routeID) === 3) {
          dispatch(setViewTab("agendaViewer"));
        } else if (Number(routeID) === 5) {
          dispatch(setViewTab("minutes"));
        }
      } else if (ViewAdvanceMeetingPolls) {
        dispatch(setViewTab("polls"));
      } else if (ViewAdvanceMeetingTask) {
        dispatch(setViewTab("actionsPage"));
      } else if (advanceMeetingOperations) {
        dispatch(setViewTab("agendaViewer"));
      } else {
        if (Number(editorRole.status) === 10) {
          if (
            editorRole.role === "Organizer" ||
            editorRole.role === "Agenda Contributor" ||
            editorRole.role === "Participant"
          ) {
            dispatch(setViewTab("agendaViewer"));
          }
        } else {
          dispatch(setViewTab("meetingDetails"));
        }
      }
    }
    // Fix: removed the empty else block with all commented-out setters

    return () => {
      dispatch(emailRouteID(0));
    };
  }, [routeID, editorRole, advanceMeetingOperations, ViewAdvanceMeetingPolls]);

  // ─── Recording Stop Handler ───────────────────────────────────────────────

  const onHandleClickForStopRecording = () => {
    return new Promise((resolve) => {
      setStartRecordingState(true);
      setPauseRecordingState(false);
      setResumeRecordingState(false);
      setStopRecordingState(false);

      if (isZoomEnabled) {
        const iframe = iframeRef.current;
        const sendMessage = () => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
          }
          setTimeout(() => resolve(), 100);
        };

        if (
          isMeeting &&
          isMeetingVideo &&
          isMeetingVideoHostChecker &&
          !presenterViewJoinFlag &&
          !presenterViewHostFlag
        ) {
          setTimeout(sendMessage, 1000);
        } else {
          if (isCaller && (CallType === 1 || CallType === 2)) {
            sendMessage();
          } else {
            resolve();
          }
        }
      } else {
        resolve();
      }
    });
  };

  // ─── Leave Meeting ────────────────────────────────────────────────────────

  const callBeforeLeave = async () => {
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    if (isMeetingVideo) {
      localStorage.setItem("isMeeting", false);
      sessionStorage.removeItem("isMeeting");
      localStorage.setItem("isMeetingVideo", false);
      let newName = localStorage.getItem("name");
      let currentMeetingID = JSON.parse(
        localStorage.getItem("currentMeetingID"),
      );
      const meetHostFlag = localStorage.getItem("meetinHostInfo");

      if (meetHostFlag) {
        const parsedHostFlag = JSON.parse(meetHostFlag);
        if (parsedHostFlag.isHost) {
          await onHandleClickForStopRecording();
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (isZoomEnabled) {
            let isSharedSceenEnable = JSON.parse(
              localStorage.getItem("isSharedSceenEnable"),
            );
            if (isSharedSceenEnable && !globallyScreenShare) {
              let isMeetingVideoHostCheck = JSON.parse(
                localStorage.getItem("isMeetingVideoHostCheck"),
              );
              let newRoomID = localStorage.getItem("newRoomId");
              let isGuid = localStorage.getItem("isGuid");
              dispatch(screenShareTriggeredGlobally(false));
              dispatch(
                isSharedScreenTriggeredApi(navigate, t, {
                  RoomID:
                    isMeetingVideo && isMeetingVideoHostCheck
                      ? newRoomID
                      : null,
                  ShareScreen: false,
                  UID:
                    isMeetingVideo && isMeetingVideoHostCheck ? isGuid : null,
                }),
              );
            }
          }

          let newRoomID = localStorage.getItem("newRoomId");
          let newUserGUID = localStorage.getItem("isGuid");
          dispatch(
            LeaveMeetingVideo(
              {
                RoomID: String(newRoomID),
                UserGUID: String(newUserGUID),
                Name: String(newName),
                IsHost: parsedHostFlag?.isHost ? true : false,
                MeetingID: Number(meetingID),
              },
              navigate,
              t,
            ),
          );

          localStorage.setItem("isMeeting", false);
          sessionStorage.removeItem("isMeeting");
          let currentMeeting = localStorage.getItem("currentMeetingID");
          dispatch(
            LeaveCurrentMeeting(
              navigate,
              t,
              {
                FK_MDID: Number(meetingID),
                DateTime: getCurrentDateTimeUTC(),
              },
              setEditorRole,
            ),
          );
        } else {
          if (isZoomEnabled) {
            let isSharedSceenEnable = JSON.parse(
              localStorage.getItem("isSharedSceenEnable"),
            );
            if (isSharedSceenEnable && !globallyScreenShare) {
              let participantUID = localStorage.getItem("participantUID");
              let participantRoomIds =
                localStorage.getItem("participantRoomId");
              dispatch(screenShareTriggeredGlobally(false));
              dispatch(
                isSharedScreenTriggeredApi(navigate, t, {
                  RoomID: participantRoomIds,
                  ShareScreen: false,
                  UID: participantUID,
                }),
              );
            }
          }

          let participantUID = localStorage.getItem("participantUID");
          let participantRoomIds = localStorage.getItem("participantRoomId");
          dispatch(setRaisedUnRaisedParticiant(false));
          dispatch(
            LeaveMeetingVideo(
              {
                RoomID: String(participantRoomIds),
                UserGUID: String(participantUID),
                Name: String(newName),
                IsHost: parsedHostFlag?.isHost ? true : false,
                MeetingID: Number(meetingID),
              },
              navigate,
              t,
            ),
          );

          localStorage.setItem("isMeeting", false);
          sessionStorage.removeItem("isMeeting");
          let currentMeeting = localStorage.getItem("currentMeetingID");
          dispatch(
            LeaveCurrentMeeting(
              navigate,
              t,
              {
                FK_MDID: Number(meetingID),
                DateTime: getCurrentDateTimeUTC(),
              },
              { setEditorRole },
            ),
          );
        }
      }

      localStorage.setItem("isCaller", false);
      localStorage.setItem("isMeetingVideo", false);
      localStorage.setItem("callerStatusObject", JSON.stringify([]));
      localStorage.setItem("activeCall", false);
      sessionStorage.setItem("activeCallSessionforOtoandGroup", false);
      localStorage.setItem("acceptedRoomID", 0);
      localStorage.setItem("activeRoomID", 0);
      localStorage.removeItem("navigateLocation");
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      dispatch(leaveCallModal(false));
      dispatch(participantPopup(false));
      localStorage.setItem("MicOff", true);
      localStorage.setItem("VidOff", true);
    } else {
      localStorage.removeItem("navigateLocation");
      localStorage.setItem("isMeeting", false);
      sessionStorage.removeItem("isMeeting");
      dispatch(
        LeaveCurrentMeeting(
          navigate,
          t,
          {
            FK_MDID: Number(meetingID),
            DateTime: getCurrentDateTimeUTC(),
          },
          "FromEndMeetingModal",
          { setEditorRole },
        ),
      );
    }
  };

  // ─── Before Unload ────────────────────────────────────────────────────────

  useEffect(() => {
    const handleBeforeUnload = async () => {
      let newName = localStorage.getItem("newName");
      let newRoomId = localStorage.getItem("newRoomId");
      let participantRoomId = localStorage.getItem("participantRoomId");
      let isGuid = localStorage.getItem("isGuid");
      let participantUID = localStorage.getItem("participantUID");
      let meetingVideoID = localStorage.getItem("currentMeetingID");
      let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck"),
      );

      if (isMeeting) {
        let isWaiting = JSON.parse(sessionStorage.getItem("isWaiting"));
        let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

        if (isWaiting || isMeetingVideo) {
          await dispatch(
            LeaveMeetingVideo(
              {
                RoomID: String(
                  isMeetingVideoHostCheck ? newRoomId : participantRoomId,
                ),
                UserGUID: String(
                  isMeetingVideoHostCheck ? isGuid : participantUID,
                ),
                Name: String(newName),
                IsHost: isMeetingVideoHostCheck ? true : false,
                MeetingID: Number(meetingVideoID),
              },
              navigate,
              t,
            ),
          );

          localStorage.removeItem("currentHostUserID");
          localStorage.removeItem("isHost");
          localStorage.removeItem("isNewHost");
          localStorage.setItem("isCaller", false);
          localStorage.setItem("isMeetingVideo", false);
          localStorage.setItem("callerStatusObject", JSON.stringify([]));
          sessionStorage.removeItem("StopPresenterViewAwait");
          sessionStorage.removeItem("participantUID");
          sessionStorage.removeItem("participantRoomId");
          sessionStorage.removeItem("isGuid");
          sessionStorage.removeItem("newRoomId");
          sessionStorage.removeItem("alreadyInMeetingVideo");
          sessionStorage.setItem("activeCallSessionforOtoandGroup", false);
          localStorage.setItem("activeCall", false);
          localStorage.setItem("isCaller", false);
          localStorage.setItem("acceptedRoomID", 0);
          localStorage.setItem("activeRoomID", 0);
          dispatch(normalizeVideoPanelFlag(false));
          dispatch(maximizeVideoPanelFlag(false));
          dispatch(minimizeVideoPanelFlag(false));
          dispatch(leaveCallModal(false));
          dispatch(participantPopup(false));
          localStorage.setItem("MicOff", true);
          localStorage.setItem("VidOff", true);
        }

        dispatch(presenterViewGlobalState(0, false, false, false));
        dispatch(setAudioControlHost(false));
        dispatch(setVideoControlHost(false));
        dispatch(cleareAllState());
        setEditorRole({ status: null, role: null });
        setAdvanceMeetingModalID(null);
        localStorage.setItem("isMeeting", false);
        sessionStorage.removeItem("isMeeting");

        // Fix: single reset instead of 12 individual setter calls
        dispatch(resetViewTabs());

        callBeforeLeave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dispatch]);

  // ─── MQTT: Meeting AC/Org Removed ─────────────────────────────────────────

  useEffect(() => {
    if (
      NewMeetingreducer.mqttMeetingAcRemoved !== null &&
      NewMeetingreducer.mqttMeetingAcRemoved !== undefined
    ) {
      try {
        setEditorRole({ status: null, role: null });
        setViewAdvanceMeetingModal(false);
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        setAdvanceMeetingModalID(null);
        setDataroomMapFolderId(0);
        dispatch(
          searchNewUserMeeting(
            navigate,
            {
              Date: "",
              Title: "",
              HostName: "",
              UserID: Number(userID),
              PageNumber:
                meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
              Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
              PublishedMeetings: currentView && Number(currentView) === 1,
              ProposedMeetings: currentView && Number(currentView) === 2,
            },
            t,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }, [NewMeetingreducer.mqttMeetingAcRemoved]);

  useEffect(() => {
    if (
      NewMeetingreducer.mqttMeetingOrgRemoved !== null &&
      NewMeetingreducer.mqttMeetingOrgRemoved !== undefined
    ) {
      try {
        setEditorRole({ status: null, role: null });
        setViewAdvanceMeetingModal(false);
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        setAdvanceMeetingModalID(null);
        setDataroomMapFolderId(0);
        dispatch(
          searchNewUserMeeting(
            navigate,
            {
              Date: "",
              Title: "",
              HostName: "",
              UserID: Number(userID),
              PageNumber:
                meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
              Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
              PublishedMeetings: currentView && Number(currentView) === 1,
              ProposedMeetings: currentView && Number(currentView) === 2,
            },
            t,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }, [NewMeetingreducer.mqttMeetingOrgRemoved]);

  // ─── MQTT: Meeting Status Ended ───────────────────────────────────────────

  useEffect(() => {
    if (
      meetingIdReducer.MeetingStatusEnded !== null &&
      meetingIdReducer.MeetingStatusEnded !== undefined &&
      meetingIdReducer.MeetingStatusEnded.length !== 0
    ) {
      try {
        const endMeetingData = meetingIdReducer.MeetingStatusEnded.meeting;
        if (
          advanceMeetingModalID === endMeetingData?.pK_MDID &&
          endMeetingData.status === "9" &&
          editorRole.status !== "9"
        ) {
          setEditorRole({ status: null, role: null });
          setViewAdvanceMeetingModal(false);
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          if (isMeetingVideo === true) {
            localStorage.setItem("isCaller", false);
            localStorage.setItem("isMeetingVideo", false);
            localStorage.setItem("callerStatusObject", JSON.stringify([]));
            localStorage.setItem("activeCall", false);
            sessionStorage.setItem("activeCallSessionforOtoandGroup", false);
            localStorage.setItem("acceptedRoomID", 0);
            localStorage.setItem("activeRoomID", 0);
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(maximizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
            dispatch(leaveCallModal(false));
            dispatch(participantPopup(false));
          }
          setCurrentMeetingID(0);
          setAdvanceMeetingModalID(null);
          setDataroomMapFolderId(0);
          localStorage.setItem("folderDataRoomMeeting", 0);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [meetingIdReducer.MeetingStatusEnded]);

  // ─── Leave Meeting Handler ────────────────────────────────────────────────

  const leaveMeeting = async (flag, flag2) => {
    const isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

    if (isMeeting) {
      callBeforeLeave();
    } else {
      await dispatch(
        LeaveCurrentMeeting(
          navigate,
          t,
          {
            FK_MDID: Number(meetingID),
            DateTime: getCurrentDateTimeUTC(),
          },
          "FromMeetingDetaislTabLeaveMeeting",
          {
            setEditorRole,
          },
        ),
      );
    }

    if (flag === true) {
      await dispatch(leaveMeetingOnlogout(false));
      dispatch(userLogOutApiFunc(navigate, t));
    }
    if (flag2 === true) {
      await dispatch(leaveMeetingOnEndStatusMqtt(false));
    }
  };

  useEffect(() => {
    try {
      if (leaveMeetingOnLogoutResponse) leaveMeeting(true, false);
    } catch {}
  }, [leaveMeetingOnLogoutResponse]);

  useEffect(() => {
    try {
      if (leaveMeetingOnEndStatusMqttFlag) leaveMeeting(false, true);
    } catch {}
  }, [leaveMeetingOnEndStatusMqttFlag]);

  // ─── Agenda Voting MQTT ───────────────────────────────────────────────────

  useEffect(() => {
    try {
      if (
        AgendaVotingModalStartedData !== null &&
        AgendaVotingModalStartedData !== undefined
      ) {
        if (
          Number(localStorage.getItem("currentMeetingID")) ===
            AgendaVotingModalStartedData.meetingID &&
          !editorRole.isPrimaryOrganizer
        ) {
          dispatch(AgendaPollVotingStartedAction(true));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [AgendaVotingModalStartedData]);

  // ─── Web Notification Routing ─────────────────────────────────────────────

  useEffect(() => {
    try {
      if (
        globalFunctionWebnotificationFlag &&
        webNotifactionDataRoutecheckFlag
      ) {
        const currentURL = window.location.href;
        const isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
        WebNotificationExportRoutFunc(
          currentURL,
          dispatch,
          t,
          location,
          navigate,
          webNotificationData,
          setViewFlag,
          setEditorRole,
          setViewAdvanceMeetingModal,
          setViewProposeDatePoll,
          setViewGroupPage,
          setShowModal,
          setVideoTalk,
          setAdvanceMeetingModalID,
          setResultresolution,
          isMeeting,
          ShowPolls,
        );
        dispatch(webnotificationGlobalFlag(false));
      }
    } catch (error) {
      console.error(error);
    }
  }, [globalFunctionWebnotificationFlag]);

  // ─── Vote Cast Success Message ────────────────────────────────────────────

  useEffect(() => {
    if (
      MeetingAgendaReducer.ResponseMessage === t("Vote-casted-successfully")
    ) {
      showMessage(
        t("Thank-you-for-participanting-in-voting"),
        "success",
        setOpen,
      );
      dispatch(clearResponseMessage(""));
    }
  }, [MeetingAgendaReducer.ResponseMessage]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <section className="position-relative">
        <Row className="my-2">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-between"
          >
            <span className={styles["Scedule_newMeeting_Heading"]}>
              {meetingTitle ? meetingTitle : ""}
            </span>
            {Number(editorRole?.status) === 10 && (
              <span>
                <Button
                  text={t("Leave-meeting")}
                  onClick={() => leaveMeeting(false, false)}
                  className={styles["LeavemeetingBtn"]}
                  disableBtn={
                    presenterViewFlag
                      ? presenterViewHostFlag
                        ? true
                        : presenterViewJoinFlag
                          ? true
                          : false
                      : false
                  }
                />
              </span>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className="mb-4">
            <span className={styles["Scedule_meeting_paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12} className="d-flex gap-2 flex-wrap">
                  <Button
                    text={t("Meeting-details")}
                    className={
                      meetingDetails
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showMeetingDeitals}
                  />

                  {editorRole.role !== "Participant" &&
                    editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Organizers")}
                        className={
                          organizers
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showOrganizers}
                      />
                    )}

                  {editorRole.role !== "Participant" &&
                    editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Agenda-contributors")}
                        className={
                          agendaContributors
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showAgendaContributers}
                      />
                    )}

                  {editorRole.role !== "Participant" &&
                    editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Participants")}
                        className={
                          participants
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showParticipants}
                      />
                    )}

                  {editorRole.role !== "Participant" && (
                    <Button
                      text={t("Agenda-builder")}
                      className={
                        agenda
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAgenda}
                    />
                  )}

                  <Button
                    text={t("Agenda-viewer")}
                    className={
                      agendaViewer
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showMeetingMaterial}
                  />

                  {isMinutePublished === "true" &&
                  Number(editorRole.status) === 9 ? (
                    <Button
                      text={t("Minutes")}
                      className={
                        minutes
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showMinutes}
                    />
                  ) : editorRole.role !== "Participant" &&
                    editorRole.role !== "Agenda Contributor" ? (
                    <Button
                      text={t("Minutes")}
                      className={
                        minutes
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showMinutes}
                      disableBtn={
                        Number(editorRole.status) === 10 ||
                        Number(editorRole.status) === 9
                          ? false
                          : true
                      }
                    />
                  ) : null}

                  {checkFeatureIDAvailability(14) && (
                    <Button
                      text={t("Task")}
                      className={
                        actionsPage
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showActions}
                      disableBtn={
                        Number(editorRole.status) === 10 ||
                        Number(editorRole.status) === 9
                          ? false
                          : true
                      }
                    />
                  )}

                  {checkFeatureIDAvailability(15) && (
                    <Button
                      text={t("Polls")}
                      className={
                        polls
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={ShowPolls}
                      disableBtn={
                        Number(editorRole.status) === 10 ||
                        Number(editorRole.status) === 9
                          ? false
                          : true
                      }
                    />
                  )}

                  {Number(editorRole.status) === 10 &&
                    editorRole.role === "Organizer" && (
                      <Button
                        text={t("Attendence")}
                        className={
                          attendance
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showAttendance}
                        disableBtn={
                          unPublish
                            ? true
                            : Number(editorRole.status) === 10 &&
                                editorRole.role === "Organizer"
                              ? false
                              : true
                        }
                      />
                    )}

                  {editorRole.role !== "Organizer" && (
                    <Button
                      text={t("Attendees")}
                      className={
                        attendees
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAttendees}
                    />
                  )}

                  {editorRole.role === "Organizer" &&
                    Number(editorRole.status) === 9 &&
                    editorRole?.isPrimaryOrganizer === true && (
                      <Button
                        text={t("Recording")}
                        className={
                          isRecording
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showRecording}
                      />
                    )}
                </Col>
              </Row>

              {meetingDetails && <ViewMeetingDetails />}
              {attendees && <Attendees />}
              {organizers && <Organizers />}
              {agendaContributors && <AgendaContributers />}
              {participants && <Participants />}
              {agenda && <Agenda />}
              {agendaViewer && <AgendaViewer />}

              {!unPublish && (
                <>
                  {minutes && <Minutes />}
                  {actionsPage && <Actions />}
                  {polls && <Polls />}
                  {attendance && <Attendence />}
                  {isRecording && <Recording />}
                </>
              )}
            </span>
          </Col>
        </Row>
      </section>

      {votingStartedAgendaIntiminationModalState && (
        <VotingPollAgendaIntiminationModal
          AgendaVotingModalStartedData={AgendaVotingModalStartedData}
        />
      )}
      {castYourVotePollModalState && <PollsCastVoteInitimationModal />}

      {NewMeetingreducer.castVoteAgendaPage && (
        <CastVoteAgendaModal
          AgendaVotingModalStartedData={AgendaVotingModalStartedData}
        />
      )}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ViewMeetingModal;
