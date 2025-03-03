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
} from "../../../../store/actions/VideoFeature_actions";
import {
  AgendaPollVotingStartedAction,
  LeaveCurrentMeeting,
  LeaveMeetingVideo,
  emailRouteID,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../store/actions/NewMeetingActions";
import Participants from "./Participants/Participants";
import Agenda from "./Agenda/Agenda";
import AgendaViewer from "./AgendaViewer/AgendaViewer";
import Minutes from "./Minutes/Minutes";
import Actions from "./Actions/Actions";
import Polls from "./Polls/Polls";
import Attendence from "./Attendence/Attendence";
import ViewMeetingDetails from "./meetingDetails/ViewMeetingDetails";
import { cleareAllState } from "../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkFeatureIDAvailability,
  WebNotificationExportRoutFunc,
} from "../../../../commen/functions/utils";
import Attendees from "./attendees/Attendees";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../context/MeetingContext";
import { userLogOutApiFunc } from "../../../../store/actions/Auth_Sign_Out";
import { getCurrentDateTimeUTC } from "../../../../commen/functions/date_formater";
import VotingPollAgendaIntiminationModal from "../scedulemeeting/Agenda/VotingPollAgendaInitimationModal/VotingPollAgendaIntiminationModal";
import CastVoteAgendaModal from "../viewMeetings/Agenda/VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";
import PollsCastVoteInitimationModal from "../pollsCastVoteInitimationModal/pollsCastVoteInitimationModal";
import { useGroupsContext } from "../../../../context/GroupsContext";
import { webnotificationGlobalFlag } from "../../../../store/actions/UpdateUserNotificationSetting";
import { useResolutionContext } from "../../../../context/ResolutionContext";
import { clearResponseMessage } from "../../../../store/actions/MeetingOrganizers_action";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
import Recording from "./recording/Recording";
const ViewMeetingModal = ({
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
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
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const routeID = useSelector((state) => state.NewMeetingreducer.emailRouteID);
  const { setViewFlag, setViewProposeDatePoll } = useContext(MeetingContext);
  const advanceMeetingOperations =
    JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true;
  const ViewAdvanceMeetingPolls =
    JSON.parse(localStorage.getItem("viewadvanceMeetingPolls")) === true;
  const ViewAdvanceMeetingTask =
    JSON.parse(localStorage.getItem("viewadvanceMeetingTask")) === true;
  const { setViewGroupPage, setShowModal } = useGroupsContext();
  const { setResultresolution } = useResolutionContext();
  //Voting Poll Started in Agenda Intimination Modal
  const votingStartedAgendaIntiminationModalState = useSelector(
    (state) => state.NewMeetingreducer.agendavotingPollStartedData
  );
  //Agenda Voting Started PayLoad Data Fetching
  const AgendaVotingModalStartedData = useSelector(
    (state) => state.MeetingAgendaReducer.MeetingAgendaStartedData
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
  console.log(typeof advanceMeetingOperations);
  const {
    editorRole,
    setEditorRole,
    meetingDetails,
    setmeetingDetails,
    organizers,
    setorganizers,
    agendaContributors,
    setAgendaContributors,
    participants,
    setParticipants,
    agenda,
    setAgenda,
    meetingMaterial,
    setMeetingMaterial,
    minutes,
    setMinutes,
    actionsPage,
    setactionsPage,
    polls,
    setPolls,
    attendance,
    setAttendance,
    attendees,
    setAttendees,
    isRecording,
    setRecording,
  } = useMeetingContext();

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let userID = localStorage.getItem("userID");
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let isMinutePublished = localStorage.getItem("isMinutePublished");
  let meetingTitle = localStorage.getItem("meetingTitle");

  const dispatch = useDispatch();

  const { meetingIdReducer, NewMeetingreducer, MeetingAgendaReducer } =
    useSelector((state) => state);

  const leaveMeetingOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingOnLogoutResponse
  );

  const leaveMeetingOnEndStatusMqttFlag = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingOnEndStatusMqttFlag
  );

  const globalFunctionWebnotificationFlag = useSelector(
    (state) => state.settingReducer.globalFunctionWebnotificationFlag
  );

  const webNotifactionDataRoutecheckFlag = JSON.parse(
    localStorage.getItem("webNotifactionDataRoutecheckFlag")
  );

  const webNotificationData = useSelector(
    (state) => state.settingReducer.webNotificationDataVideoIntimination
  );

  const getJoinMeetingParticipantorHostrequest = useSelector(
    (state) => state.videoFeatureReducer.getJoinMeetingParticipantorHostrequest
  );

  console.log(
    {
      agendaContributors,
      meetingDetails,
      organizers,
      participants,
      agenda,
      minutes,
      attendance,
      polls,
      actionsPage,
      meetingDetails,
      meetingMaterial,
    },
    "routeIDrouteID"
  );

  useEffect(() => {
    if (
      (Number(editorRole?.status) === 10 || Number(editorRole?.status) === 9) &&
      editorRole.role !== ""
    ) {
      if (routeID !== null && routeID !== 0) {
        if (Number(routeID) === 1) {
          setMeetingMaterial(false);
          setAgendaContributors(true);
          setorganizers(false);
          setmeetingDetails(false);
          setMinutes(false);
          setAttendance(false);
          setAgenda(false);
          setParticipants(false);
          setPolls(false);
          setAttendees(false);
          setRecording(false);

          setactionsPage(false);
        } else if (Number(routeID) === 2) {
          setMeetingMaterial(false);
          setAgendaContributors(false);
          setorganizers(true);
          setmeetingDetails(false);
          setMinutes(false);
          setAttendance(false);
          setAgenda(false);
          setRecording(false);

          setParticipants(false);
          setPolls(false);
          setAttendees(false);
          setactionsPage(false);
        } else if (Number(routeID) === 3) {
          setMeetingMaterial(true);
          setAgendaContributors(false);
          setorganizers(false);
          setmeetingDetails(false);
          setMinutes(false);
          setAttendance(false);
          setAgenda(false);
          setParticipants(false);
          setPolls(false);
          setRecording(false);

          setAttendees(false);
          setactionsPage(false);
        } else if (Number(routeID) === 5) {
          setMeetingMaterial(false);
          setAgendaContributors(false);
          setorganizers(false);
          setmeetingDetails(false);
          setMinutes(true);
          setAttendance(false);
          setAgenda(false);
          setParticipants(false);
          setPolls(false);
          setRecording(false);

          setAttendees(false);
          setactionsPage(false);
        }
      } else if (ViewAdvanceMeetingPolls) {
        setMeetingMaterial(false);
        setAgendaContributors(false);
        setorganizers(false);
        setmeetingDetails(false);
        setMinutes(false);
        setAttendance(false);
        setAgenda(false);
        setParticipants(false);
        setPolls(true);
        setRecording(false);

        setAttendees(false);
        setactionsPage(false);
      } else if (ViewAdvanceMeetingTask) {
        setMeetingMaterial(false);
        setAgendaContributors(false);
        setorganizers(false);
        setmeetingDetails(false);
        setMinutes(false);
        setAttendance(false);
        setAgenda(false);
        setParticipants(false);
        setPolls(false);
        setAttendees(false);
        setRecording(false);

        setactionsPage(true);
      } else if (advanceMeetingOperations) {
        setMeetingMaterial(true);
        setAgendaContributors(false);
        setorganizers(false);
        setmeetingDetails(false);
        setMinutes(false);
        setAttendance(false);
        setAgenda(false);
        setParticipants(false);
        setPolls(false);
        setAttendees(false);
        setactionsPage(false);
        setRecording(false);
      } else {
        if (Number(editorRole.status) === 10) {
          if (
            editorRole.role === "Organizer" ||
            editorRole.role === "Agenda Contributor" ||
            editorRole.role === "Participant"
          ) {
            setMeetingMaterial(true);
            setAgendaContributors(false);
            setorganizers(false);
            setmeetingDetails(false);
            setMinutes(false);
            setAttendance(false);
            setAgenda(false);
            setParticipants(false);
            setPolls(false);
            setAttendees(false);
            setactionsPage(false);
            setRecording(false);
          }
        } else {
          setMeetingMaterial(false);
          setAgendaContributors(false);
          setorganizers(false);
          setmeetingDetails(true);
          setMinutes(false);
          setAttendance(false);
          setAgenda(false);
          setParticipants(false);
          setPolls(false);
          setAttendees(false);
          setactionsPage(false);
          setRecording(false);
        }
      }
    } else {
      setMeetingMaterial(false);
      setAgendaContributors(false);
      setorganizers(false);
      setmeetingDetails(true);
      setMinutes(false);
      setAttendance(false);
      setAgenda(false);
      setParticipants(false);
      setPolls(false);
      setAttendees(false);
      setactionsPage(false);
      setRecording(false);
    }

    return () => {
      dispatch(emailRouteID(0));
    };
  }, [routeID, editorRole, advanceMeetingOperations, ViewAdvanceMeetingPolls]);
  console.log(
    { routeID, editorRole, advanceMeetingOperations, ViewAdvanceMeetingPolls },
    "routeIDrouteIDrouteID"
  );
  const callBeforeLeave = () => {
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    if (isMeetingVideo) {
      localStorage.setItem("isMeeting", false);
      localStorage.setItem("isMeetingVideo", false);
      let newName = localStorage.getItem("name");
      let currentMeetingID = JSON.parse(
        localStorage.getItem("currentMeetingID")
      );
      const meetHostFlag = localStorage.getItem("meetinHostInfo");
      console.log(meetHostFlag, "meetHostFlagmeetHostFlag");
      if (meetHostFlag) {
        const parsedHostFlag = JSON.parse(meetHostFlag); // Parse the string into an object
        console.log(parsedHostFlag, "parsedHostFlag");
        if (parsedHostFlag.isHost) {
          let newRoomID = localStorage.getItem("newRoomId");
          let newUserGUID = localStorage.getItem("isGuid");

          let Data = {
            RoomID: String(newRoomID),
            UserGUID: String(newUserGUID),
            Name: String(newName),
            IsHost: parsedHostFlag?.isHost ? true : false,
            MeetingID: Number(currentMeetingID),
          };
          dispatch(LeaveMeetingVideo(Data, navigate, t));
          localStorage.setItem("isMeeting", false);
          let currentMeeting = localStorage.getItem("currentMeetingID");
          let leaveMeetingData = {
            FK_MDID: Number(currentMeeting),
            DateTime: getCurrentDateTimeUTC(),
          };
          dispatch(
            LeaveCurrentMeeting(
              navigate,
              t,
              leaveMeetingData,
              false,
              false,
              setEditorRole,
              setAdvanceMeetingModalID,
              setViewAdvanceMeetingModal
            )
          );
        } else {
          let participantUID = localStorage.getItem("participantUID");
          let participantRoomIds = localStorage.getItem("participantRoomId");
          let Data = {
            RoomID: String(participantRoomIds),
            UserGUID: String(participantUID),
            Name: String(newName),
            IsHost: parsedHostFlag?.isHost ? true : false,
            MeetingID: Number(currentMeetingID),
          };
          dispatch(setRaisedUnRaisedParticiant(false));
          dispatch(LeaveMeetingVideo(Data, navigate, t));
          localStorage.setItem("isMeeting", false);
          let currentMeeting = localStorage.getItem("currentMeetingID");
          let leaveMeetingData = {
            FK_MDID: Number(currentMeeting),
            DateTime: getCurrentDateTimeUTC(),
          };
          dispatch(
            LeaveCurrentMeeting(
              navigate,
              t,
              leaveMeetingData,
              false,
              false,
              setEditorRole,
              setAdvanceMeetingModalID,
              setViewAdvanceMeetingModal
            )
          );
        }
      }
      // dispatch(LeaveCall(Data, navigate, t));
      localStorage.setItem("isCaller", false);
      localStorage.setItem("isMeetingVideo", false);
      const emptyArray = [];
      localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
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
    } else {
      localStorage.setItem("isMeeting", false);
      let currentMeeting = localStorage.getItem("currentMeetingID");
      let leaveMeetingData = {
        FK_MDID: Number(currentMeeting),
        DateTime: getCurrentDateTimeUTC(),
      };
      dispatch(
        LeaveCurrentMeeting(
          navigate,
          t,
          leaveMeetingData,
          false,
          false,
          setEditorRole,
          setAdvanceMeetingModalID,
          setViewAdvanceMeetingModal
        )
      );
    }
  };

  useEffect(() => {
    // Handler for beforeunload event
    const handleBeforeUnload = async (event) => {
      let newName = localStorage.getItem("newName");
      let newRoomId = localStorage.getItem("newRoomId");
      let participantRoomId = localStorage.getItem("participantRoomId");
      let isGuid = localStorage.getItem("isGuid");
      let participantUID = localStorage.getItem("participantUID");
      let meetingVideoID = localStorage.getItem("currentMeetingID");
      let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );
      if (isMeeting) {
        console.log("cacacacacacacacacc");
        let isWaiting = JSON.parse(sessionStorage.getItem("isWaiting"));
        let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
        if (isWaiting || isMeetingVideo) {
   
          let Data = {
            RoomID: String(
              isMeetingVideoHostCheck ? newRoomId : participantRoomId
            ),
            UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
            Name: String(newName),
            IsHost: isMeetingVideoHostCheck ? true : false,
            MeetingID: Number(meetingVideoID),
          };
          await dispatch(LeaveMeetingVideo(Data, navigate, t));

          localStorage.removeItem("currentHostUserID");
          localStorage.removeItem("isHost");
          localStorage.removeItem("isNewHost");
          localStorage.setItem("isCaller", false);
          localStorage.setItem("isMeetingVideo", false);
          const emptyArray = [];
          localStorage.setItem(
            "callerStatusObject",
            JSON.stringify(emptyArray)
          );
          sessionStorage.removeItem("StopPresenterViewAwait");
          sessionStorage.removeItem("participantUID");
          sessionStorage.removeItem("participantRoomId");
          sessionStorage.removeItem("isGuid");
          sessionStorage.removeItem("newRoomId");
          sessionStorage.removeItem("alreadyInMeetingVideo");
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
        } else {
        }
        dispatch(presenterViewGlobalState(0, false, false, false));
        dispatch(setAudioControlHost(false));
        dispatch(setVideoControlHost(false));
        dispatch(cleareAllState());
        setEditorRole({ status: null, role: null });
        setAdvanceMeetingModalID(null);
        localStorage.setItem("isMeeting", false);
        setMeetingMaterial(false);
        setAgendaContributors(false);
        setorganizers(false);
        setmeetingDetails(false);
        setMinutes(false);
        setAttendance(false);
        setAgenda(false);
        setParticipants(false);
        setPolls(false);
        setAttendees(false);
        setactionsPage(false);
        setRecording(false);
        localStorage.setItem("isMeeting", false);
        callBeforeLeave();
      }
    };

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      console.log("cacacacacacacacacc");
    };
  }, [dispatch]);

  const showMeetingDeitals = () => {
    setmeetingDetails(true);
    setorganizers(false);
    setAgendaContributors(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setAttendees(false);
  };

  const showOrganizers = () => {
    setorganizers(true);
    setmeetingDetails(false);
    setAgendaContributors(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setAttendees(false);
  };

  const showAgendaContributers = () => {
    setAgendaContributors(true);
    setmeetingDetails(false);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setAttendees(false);
    setRecording(false);
  };

  const showParticipants = () => {
    setParticipants(true);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setAttendees(false);
    setRecording(false);
  };

  const showAgenda = () => {
    setAgenda(true);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setAttendees(false);
    setRecording(false);
  };

  const showAttendees = () => {
    setAttendees(true);
    setAgenda(false);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setRecording(false);
  };

  const showRecording = () => {
    setAttendees(false);
    setRecording(true);
    setAgenda(false);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
  };

  const showMeetingMaterial = () => {
    setMeetingMaterial(true);
    setAgenda(false);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setmeetingDetails(false);
    setAttendees(false);
    setRecording(false);
  };

  const showMinutes = () => {
    setMinutes(true);
    setMeetingMaterial(false);
    setParticipants(false);
    setAgendaContributors(false);
    setmeetingDetails(false);
    setorganizers(false);
    setAgenda(false);
    setAttendance(false);
    setPolls(false);
    setAttendees(false);
    setactionsPage(false);
    setRecording(false);
  };

  const showActions = () => {
    setactionsPage(true);
    setMinutes(false);
    setMeetingMaterial(false);
    setAgenda(false);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setAttendance(false);
    setAttendees(false);
    setPolls(false);
    setRecording(false);

    setmeetingDetails(false);
  };

  const ShowPolls = () => {
    setPolls(true);
    setactionsPage(false);
    setMinutes(false);
    setMeetingMaterial(false);
    setAgenda(false);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setAttendance(false);
    setAttendees(false);
    setmeetingDetails(false);
    setRecording(false);
  };

  const showAttendance = () => {
    setAttendance(true);
    setactionsPage(false);
    setMinutes(false);
    setMeetingMaterial(false);
    setAgenda(false);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
    setAttendees(false);
    setPolls(false);
    setRecording(false);
  };

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
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber:
            meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        console.log("chek search meeting");
        dispatch(searchNewUserMeeting(navigate, searchData, t));
      } catch (error) {
        console.error(error, "error");
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
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber:
            meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        console.log("chek search meeting");
        dispatch(searchNewUserMeeting(navigate, searchData, t));
      } catch (error) {
        console.error(error, "error");
      }
    }
  }, [NewMeetingreducer.mqttMeetingOrgRemoved]);

  useEffect(() => {
    if (
      meetingIdReducer.MeetingStatusEnded !== null &&
      meetingIdReducer.MeetingStatusEnded !== undefined &&
      meetingIdReducer.MeetingStatusEnded.length !== 0
    ) {
      let endMeetingData = meetingIdReducer.MeetingStatusEnded.meeting;
      if (
        advanceMeetingModalID === endMeetingData?.pK_MDID &&
        endMeetingData.status === "9"
      ) {
        setEditorRole({ status: null, role: null });
        setViewAdvanceMeetingModal(false);
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        if (isMeetingVideo === true) {
          localStorage.setItem("isCaller", false);
          localStorage.setItem("isMeetingVideo", false);
          const emptyArray = [];
          localStorage.setItem(
            "callerStatusObject",
            JSON.stringify(emptyArray)
          );
          localStorage.setItem("activeCall", false);
          localStorage.setItem("isCaller", false);
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
    }
  }, [meetingIdReducer.MeetingStatusEnded]);

  const leaveMeeting = async (flag, flag2) => {
    console.log(flag, flag2, "mqtt mqmqmqmqmqmq");

    let currentMeeting = localStorage.getItem("currentMeetingID");
    let leaveMeetingData = {
      FK_MDID: Number(currentMeeting),
      DateTime: getCurrentDateTimeUTC(),
    };
    await dispatch(
      LeaveCurrentMeeting(
        navigate,
        t,
        leaveMeetingData,
        false,
        false,
        setEditorRole,
        setAdvanceMeetingModalID,
        setViewAdvanceMeetingModal
      )
    );
    if (flag === true) {
      console.log("mqtt mqmqmqmqmqmq");
      await dispatch(leaveMeetingOnlogout(false));
      dispatch(userLogOutApiFunc(navigate, t));
    }
    if (flag2 === true) {
      console.log("mqtt mqmqmqmqmqmq");
      await dispatch(leaveMeetingOnEndStatusMqtt(false));
    }
  };

  useEffect(() => {
    try {
      if (leaveMeetingOnLogoutResponse) {
        console.log("mqtt mqmqmqmqmqmq");
        leaveMeeting(true, false);
      }
    } catch {}
  }, [leaveMeetingOnLogoutResponse]);

  useEffect(() => {
    try {
      if (leaveMeetingOnEndStatusMqttFlag) {
        console.log("mqtt mqmqmqmqmqmq");
        leaveMeeting(false, true);
      }
    } catch {}
  }, [leaveMeetingOnEndStatusMqttFlag]);

  //Agenda Voting Modal MQTT Data Extracting
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
          console.log(
            AgendaVotingModalStartedData,
            "AgendaVotingModalStartedDataAgendaVotingModalStartedData"
          );
          dispatch(AgendaPollVotingStartedAction(true));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [AgendaVotingModalStartedData]);

  useEffect(() => {
    try {
      if (globalFunctionWebnotificationFlag) {
        if (webNotifactionDataRoutecheckFlag) {
          console.log("webNotifactionDataRoutecheckFlag");
          let currentURL = window.location.href;
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
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
            setPolls
          );
          dispatch(webnotificationGlobalFlag(false));
        }
      }
      console.log("webNotifactionDataRoutecheckFlag");
    } catch (error) {}

    return () => {};
  }, [globalFunctionWebnotificationFlag]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.ResponseMessage === t("Vote-casted-successfully")
    ) {
      showMessage(
        t("Thank-you-for-participanting-in-voting"),
        "success",
        setOpen
      );
      dispatch(clearResponseMessage(""));
    }
  }, [MeetingAgendaReducer.ResponseMessage]);

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
                  onClick={leaveMeeting}
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
                      meetingDetails === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showMeetingDeitals}
                  />
                  {editorRole.role === "Participant" ||
                  editorRole.role === "Agenda Contributor" ? null : (
                    <Button
                      text={t("Organizers")}
                      className={
                        organizers === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showOrganizers}
                    />
                  )}
                  {editorRole.role === "Participant" ||
                  editorRole.role === "Agenda Contributor" ? null : (
                    <Button
                      text={t("Agenda-contributors")}
                      className={
                        agendaContributors === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAgendaContributers}
                    />
                  )}
                  {editorRole.role === "Participant" ||
                  editorRole.role === "Agenda Contributor" ? null : (
                    <Button
                      text={t("Participants")}
                      className={
                        participants === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showParticipants}
                    />
                  )}
                  {editorRole.role === "Participant" ? null : (
                    <Button
                      text={t("Agenda-builder")}
                      className={
                        agenda === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAgenda}
                    />
                  )}

                  <Button
                    text={t("Agenda-viewer")}
                    className={
                      meetingMaterial === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showMeetingMaterial}
                  />
                  <>
                    {isMinutePublished === "true" &&
                    Number(editorRole.status) === 9 ? (
                      <Button
                        text={t("Minutes")}
                        className={
                          minutes === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showMinutes}
                        // disableBtn={
                        //   Number(editorRole.status) === 10 ||
                        //   Number(editorRole.status) === 9
                        //     ? false
                        //     : true
                        // }
                      />
                    ) : editorRole.role === "Participant" ||
                      editorRole.role === "Agenda Contributor" ? null : (
                      <Button
                        text={t("Minutes")}
                        className={
                          minutes === true
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
                    )}
                    {checkFeatureIDAvailability(14) ? (
                      <>
                        <Button
                          text={t("Task")}
                          className={
                            actionsPage === true
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
                      </>
                    ) : null}
                    {checkFeatureIDAvailability(15) ? (
                      <Button
                        text={t("Polls")}
                        className={
                          polls === true
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
                    ) : null}
                    {/* editorRole.isPrimaryOrganizer Commented Due to CR 0011183 */}
                    {Number(editorRole.status) === 10 &&
                    editorRole.role === "Organizer" ? (
                      <Button
                        text={t("Attendence")}
                        className={
                          attendance === true
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
                    ) : null}
                    {editorRole.role !== "Organizer" && (
                      <Button
                        text={t("Attendees")}
                        className={
                          attendees === true
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
                            isRecording === true
                              ? styles["Schedule_meetings_options_active"]
                              : styles["Schedule_meetings_options"]
                          }
                          onClick={showRecording}
                        />
                      )}
                  </>
                </Col>
              </Row>
              {meetingDetails && <ViewMeetingDetails />}
              {attendees && <Attendees />}
              {organizers && <Organizers />}
              {agendaContributors && <AgendaContributers />}
              {participants && <Participants />}
              {agenda && <Agenda />}
              {meetingMaterial && <AgendaViewer />}

              {unPublish ? null : (
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
      <PollsCastVoteInitimationModal />
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
