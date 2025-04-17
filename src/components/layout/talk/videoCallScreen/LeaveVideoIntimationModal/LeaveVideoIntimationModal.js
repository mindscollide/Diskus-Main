import React from "react";
import styles from "./LeaveVideoIntimationModal.module.css";
import { Button, Modal } from "../../../../elements";
import { useSelector } from "react-redux";
import { LeaveInitmationMessegeVideoMeetAction } from "../../../../../store/actions/VideoMain_actions";
import { useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  actionsGlobalFlag,
  agendaContributorsGlobalFlag,
  agendaGlobalFlag,
  attendanceGlobalFlag,
  currentMeetingStatus,
  GetMeetingStatusDataAPI,
  LeaveCurrentMeetingOtherMenus,
  LeaveMeetingVideo,
  meetingDetailsGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  organizersGlobalFlag,
  participantsGlobalFlag,
  pollsGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  proposeNewMeetingPageFlag,
  scheduleMeetingPageFlag,
  searchNewUserMeeting,
  showCancelModalmeetingDeitals,
  uploadGlobalFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewMeetingFlag,
  viewProposeDateMeetingPageFlag,
  viewProposeOrganizerMeetingPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentDateTimeUTC } from "../../../../../commen/functions/date_formater";
import {
  createGroupPageFlag,
  updateGroupPageFlag,
  viewGroupPageFlag,
} from "../../../../../store/actions/Groups_actions";
import {
  createCommitteePageFlag,
  updateCommitteePageFlag,
  viewCommitteePageFlag,
} from "../../../../../store/actions/Committee_actions";
import {
  resultResolutionFlag,
  voteResolutionFlag,
  viewAttachmentFlag,
  createResolutionModal,
  viewResolutionModal,
} from "../../../../../store/actions/Resolution_actions";
import { useMeetingContext } from "../../../../../context/MeetingContext";
import { ViewMeeting } from "../../../../../store/actions/Get_List_Of_Assignees";
import {
  endMeetingStatusForQuickMeetingModal,
  endMeetingStatusForQuickMeetingVideo,
  leaveMeetingOnEndStatusMqtt,
  leaveMeetingVideoOnEndStatusMqtt,
  leavePresenterViewMainApiTest,
  participantWaitingListBox,
  setRaisedUnRaisedParticiant,
  stopPresenterViewMainApiTest,
  toggleParticipantsVisibility,
} from "../../../../../store/actions/VideoFeature_actions";

const LeaveVideoIntimationModal = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const location = useLocation();

  const {
    setEditorRole,
    setViewFlag,
    setViewAdvanceMeetingModal,
    setViewProposeDatePoll,
  } = useMeetingContext();

  //LocalStorage Entiites
  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let userID = localStorage.getItem("userID");
  let NavigationLocation = localStorage.getItem("navigateLocation");

  //Global States
  const scheduleMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.scheduleMeetingPageFlag
  );
  const viewProposeDateMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewProposeDateMeetingPageFlag
  );
  const viewAdvanceMeetingPublishPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingPublishPageFlag
  );
  const viewAdvanceMeetingUnpublishPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag
  );
  const viewProposeOrganizerMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewProposeOrganizerMeetingPageFlag
  );
  const proposeNewMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.proposeNewMeetingPageFlag
  );
  const viewMeetingFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewMeetingFlag
  );

  const showVideoIntimationMessegeModal = useSelector(
    (state) => state.VideoMainReducer.LeaveVideoIntimationMessegeGlobalState
  );

  const scheduleMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.scheduleMeetingPageFlag
  );
  const viewProposeDateMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewProposeDateMeetingPageFlag
  );
  const viewAdvanceMeetingsPublishPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingPublishPageFlag
  );
  const viewAdvanceMeetingsUnpublishPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag
  );
  const viewProposeOrganizerMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewProposeOrganizerMeetingPageFlag
  );
  const proposeNewMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.proposeNewMeetingPageFlag
  );
  const viewMeetingsFlag = useSelector(
    (state) => state.NewMeetingreducer.viewMeetingFlag
  );

  const LeaveVideoIntiminationNotificationClickData = useSelector(
    (state) => state.settingReducer.webNotificationDataVideoIntimination
  );
  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );
  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterStartedFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterStartedFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );
  console.log(LeaveVideoIntiminationNotificationClickData, "first");

  //Local States

  //handle NO button
  const handleNoButtonLeaveVideoMeeting = () => {
    dispatch(LeaveInitmationMessegeVideoMeetAction(false));
    localStorage.setItem("webNotifactionDataRoutecheckFlag", false);
  };

  const functionForMeetingVideoScenario = async () => {
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    if (isMeeting) {
      if (isMeetingVideo) {
        console.log("Saif Check Issue");
        if (!isMeetingVideoHostCheck) {
          let participantRoomId = localStorage.getItem("participantRoomId");
          let newMeetingTitle = localStorage.getItem("meetingTitle");
          let currentMeetingID = Number(
            localStorage.getItem("currentMeetingID")
          );
          let participantUID = localStorage.getItem("participantUID");

          console.log("busyCall");
          let Data = {
            RoomID: String(participantRoomId),
            UserGUID: String(participantUID),
            Name: String(newMeetingTitle),
            IsHost: isMeetingVideoHostCheck ? true : false,
            MeetingID: Number(currentMeetingID),
          };
          dispatch(setRaisedUnRaisedParticiant(false));
          dispatch(LeaveMeetingVideo(Data, navigate, t));
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(LeaveInitmationMessegeVideoMeetAction(false));
        }
      }
    }

    let currentMeeting = Number(localStorage.getItem("currentMeetingID"));
    let Data = {
      FK_MDID: currentMeeting,
      DateTime: getCurrentDateTimeUTC(),
    };
    await dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
    await dispatch(currentMeetingStatus(0));
  };

  //handle Yes button
  const handleYesButtonLeaveVideoMeeting = async () => {
    try {
      let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
      let typeOfMeeting = localStorage.getItem("typeOfMeeting");
      let webNotifactionDataRoutecheckFlag = JSON.parse(
        localStorage.getItem("webNotifactionDataRoutecheckFlag")
      );
      if (presenterViewHostFlag || presenterViewJoinFlag) {
        let participantRoomId = localStorage.getItem("participantRoomId");
        let newRoomID = localStorage.getItem("newRoomId");
        let isMeetingVideoHostCheck = JSON.parse(
          localStorage.getItem("isMeetingVideoHostCheck")
        );
        let participantUID = localStorage.getItem("participantUID");
        let roomID = localStorage.getItem("acceptedRoomID");
        let currentUserName = localStorage.getItem("name");
        let isGuid = localStorage.getItem("isGuid");
        let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
        let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
        let RoomID = presenterViewFlag
          ? roomID
          : isMeetingVideoHostCheck
          ? newRoomID
          : participantRoomId;
        let UID = isMeetingVideoHostCheck ? isGuid : participantUID;
        dispatch(participantWaitingListBox(false));
        dispatch(toggleParticipantsVisibility(false));
        // if (presenterMeetingId === currentMeeting) {
        console.log("Check Stop");
        if (presenterViewHostFlag) {
          if (presenterStartedFlag) {
            let data = {
              MeetingID: currentMeetingID,
              RoomID: RoomID,
            };
            sessionStorage.setItem("StopPresenterViewAwait", true);
            console.log(data, "presenterViewJoinFlag");
            await dispatch(stopPresenterViewMainApiTest(navigate, t, data, 0));
          } else {
            let data = {
              RoomID: String(RoomID),
              UserGUID: String(UID),
              Name: String(currentUserName),
            };
            await dispatch(leavePresenterViewMainApiTest(navigate, t, data, 2));
          }
        } else if (presenterViewJoinFlag) {
          sessionStorage.removeItem("alreadyInMeetingVideo");
          let data = {
            RoomID: String(callAcceptedRoomID),
            UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
            Name: String(currentUserName),
          };
          await dispatch(leavePresenterViewMainApiTest(navigate, t, data, 1));
        }
      }
      if (webNotifactionDataRoutecheckFlag) {
        if (String(typeOfMeeting) === "isQuickMeeting") {
          if (isMeetingVideo) {
            dispatch(endMeetingStatusForQuickMeetingVideo(true));
          } else {
            dispatch(endMeetingStatusForQuickMeetingModal(true));
          }
        } else if (String(typeOfMeeting) === "isAdvanceMeeting") {
          if (isMeetingVideo) {
            dispatch(leaveMeetingVideoOnEndStatusMqtt(true));
          } else {
            dispatch(leaveMeetingOnEndStatusMqtt(true));
          }
        }
        dispatch(LeaveInitmationMessegeVideoMeetAction(false));
      } else if (NavigationLocation === "Meeting") {
        console.log(NavigationLocation, "Check Where its occur");
        console.log("Check Where its occur");
        functionForMeetingVideoScenario();
        if (
          (scheduleMeetingPageFlagReducer === true ||
            viewProposeDateMeetingPageFlagReducer === true ||
            viewAdvanceMeetingPublishPageFlagReducer === true ||
            viewAdvanceMeetingUnpublishPageFlagReducer === true ||
            viewProposeOrganizerMeetingPageFlagReducer === true ||
            proposeNewMeetingPageFlagReducer === true) &&
          viewMeetingFlagReducer === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          console.log("Check It");

          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));

          if (
            (scheduleMeetingPageFlagReducer === true ||
              viewProposeDateMeetingPageFlagReducer === true ||
              viewAdvanceMeetingPublishPageFlagReducer === true ||
              viewAdvanceMeetingUnpublishPageFlagReducer === true ||
              viewProposeOrganizerMeetingPageFlagReducer === true ||
              proposeNewMeetingPageFlagReducer === true) &&
            viewMeetingFlagReducer === true
          ) {
            if (meetingpageRow !== null && meetingPageCurrent !== null) {
              let searchData = {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber: Number(meetingPageCurrent),
                Length: Number(meetingpageRow),
                PublishedMeetings: Number(currentView) === 1 ? true : false,
              };
              dispatch(searchNewUserMeeting(navigate, searchData, t));
            } else {
              let searchData = {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber: 1,
                Length: 50,
                PublishedMeetings: Number(currentView) === 1 ? true : false,
              };
              localStorage.setItem("MeetingPageRows", 30);
              localStorage.setItem("MeetingPageCurrent", 1);
              dispatch(searchNewUserMeeting(navigate, searchData, t));
            }
            dispatch(viewMeetingFlag(false));
            dispatch(meetingDetailsGlobalFlag(false));
            dispatch(organizersGlobalFlag(false));
            dispatch(agendaContributorsGlobalFlag(false));
            dispatch(participantsGlobalFlag(false));
            dispatch(agendaGlobalFlag(false));
            dispatch(meetingMaterialGlobalFlag(false));
            dispatch(minutesGlobalFlag(false));
            dispatch(proposedMeetingDatesGlobalFlag(false));
            dispatch(actionsGlobalFlag(false));
            dispatch(pollsGlobalFlag(false));
            dispatch(attendanceGlobalFlag(false));
            dispatch(uploadGlobalFlag(false));
          }
        }
      } else if (NavigationLocation === "todolist") {
        //If Navigating to Task Tab
        console.log(NavigationLocation, "Check Where its occur");
        console.log("Check Where its occur");
        functionForMeetingVideoScenario();

        if (
          (scheduleMeetingPageFlagReducer === true ||
            viewProposeDateMeetingPageFlagReducer === true ||
            viewAdvanceMeetingPublishPageFlagReducer === true ||
            viewAdvanceMeetingUnpublishPageFlagReducer === true ||
            viewProposeOrganizerMeetingPageFlagReducer === true ||
            proposeNewMeetingPageFlagReducer === true) &&
          viewMeetingFlagReducer === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/todolist");
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "calendar") {
        console.log(NavigationLocation, "Check Where its occur");
        console.log("Check Where its occur");
        functionForMeetingVideoScenario();

        if (
          (scheduleMeetingPageFlagReducer === true ||
            viewProposeDateMeetingPageFlagReducer === true ||
            viewAdvanceMeetingPublishPageFlagReducer === true ||
            viewAdvanceMeetingUnpublishPageFlagReducer === true ||
            viewProposeOrganizerMeetingPageFlagReducer === true ||
            proposeNewMeetingPageFlagReducer === true) &&
          viewMeetingFlagReducer === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/calendar");
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "Notes") {
        functionForMeetingVideoScenario();
        if (
          (scheduleMeetingPageFlagReducer === true ||
            viewProposeDateMeetingPageFlagReducer === true ||
            viewAdvanceMeetingPublishPageFlagReducer === true ||
            viewAdvanceMeetingUnpublishPageFlagReducer === true ||
            viewProposeOrganizerMeetingPageFlagReducer === true ||
            proposeNewMeetingPageFlagReducer === true) &&
          viewMeetingFlagReducer === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/Notes");
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "dataroom") {
        functionForMeetingVideoScenario();
        if (
          (scheduleMeetingsPageFlag === true ||
            viewProposeDateMeetingsPageFlag === true ||
            viewAdvanceMeetingsPublishPageFlag === true ||
            viewAdvanceMeetingsUnpublishPageFlag === true ||
            viewProposeOrganizerMeetingsPageFlag === true ||
            proposeNewMeetingsPageFlag === true) &&
          viewMeetingsFlag === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/dataroom");
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "groups") {
        functionForMeetingVideoScenario();
        if (
          (scheduleMeetingsPageFlag === true ||
            viewProposeDateMeetingsPageFlag === true ||
            viewAdvanceMeetingsPublishPageFlag === true ||
            viewAdvanceMeetingsUnpublishPageFlag === true ||
            viewProposeOrganizerMeetingsPageFlag === true ||
            proposeNewMeetingsPageFlag === true) &&
          viewMeetingsFlag === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/groups");
          dispatch(createGroupPageFlag(false));
          dispatch(updateGroupPageFlag(false));
          dispatch(viewGroupPageFlag(false));
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "committee") {
        functionForMeetingVideoScenario();
        if (
          (scheduleMeetingsPageFlag === true ||
            viewProposeDateMeetingsPageFlag === true ||
            viewAdvanceMeetingsPublishPageFlag === true ||
            viewAdvanceMeetingsUnpublishPageFlag === true ||
            viewProposeOrganizerMeetingsPageFlag === true ||
            proposeNewMeetingsPageFlag === true) &&
          viewMeetingsFlag === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/committee");
          dispatch(createCommitteePageFlag(false));
          dispatch(updateCommitteePageFlag(false));
          dispatch(viewCommitteePageFlag(false));
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "resolution") {
        console.log(NavigationLocation, "Check Where its occur");
        console.log("Check Where its occur");
        functionForMeetingVideoScenario();
        if (
          (scheduleMeetingsPageFlag === true ||
            viewProposeDateMeetingsPageFlag === true ||
            viewAdvanceMeetingsPublishPageFlag === true ||
            viewAdvanceMeetingsUnpublishPageFlag === true ||
            viewProposeOrganizerMeetingsPageFlag === true ||
            proposeNewMeetingsPageFlag === true) &&
          viewMeetingsFlag === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/resolution");
          dispatch(resultResolutionFlag(false));
          dispatch(voteResolutionFlag(false));
          dispatch(viewAttachmentFlag(false));
          dispatch(createResolutionModal(false));
          dispatch(viewResolutionModal(false));
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "polling") {
        console.log(NavigationLocation, "Check Where its occur");
        console.log("Check Where its occur");
        functionForMeetingVideoScenario();
        if (
          (scheduleMeetingsPageFlag === true ||
            viewProposeDateMeetingsPageFlag === true ||
            viewAdvanceMeetingsPublishPageFlag === true ||
            viewAdvanceMeetingsUnpublishPageFlag === true ||
            viewProposeOrganizerMeetingsPageFlag === true ||
            proposeNewMeetingsPageFlag === true) &&
          viewMeetingsFlag === false
        ) {
          navigate("/Diskus/Meeting");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          if (isMeeting && !isMeetingVideo) {
            console.log("Check It");
            dispatch(showCancelModalmeetingDeitals(true));
          }
          dispatch(uploadGlobalFlag(false));
        } else {
          navigate("/Diskus/polling");
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "dataroomRecentAddedFiles") {
        let currentMeeting = Number(localStorage.getItem("currentMeetingID"));
        let Data = {
          FK_MDID: currentMeeting,
          DateTime: getCurrentDateTimeUTC(),
        };
        dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
        if (
          (scheduleMeetingPageFlagReducer === true ||
            viewProposeDateMeetingPageFlagReducer === true ||
            viewAdvanceMeetingPublishPageFlagReducer === true ||
            viewAdvanceMeetingUnpublishPageFlagReducer === true ||
            viewProposeOrganizerMeetingPageFlagReducer === true ||
            proposeNewMeetingPageFlagReducer === true) &&
          viewMeetingFlagReducer === false
        ) {
          dispatch(showCancelModalmeetingDeitals(true));
        } else {
          localStorage.setItem("setTableView", 4);
          navigate("/Diskus/dataroom");
          dispatch(showCancelModalmeetingDeitals(false));
          dispatch(scheduleMeetingPageFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          dispatch(viewProposeOrganizerMeetingPageFlag(false));
          dispatch(proposeNewMeetingPageFlag(false));
          dispatch(viewMeetingFlag(false));
        }
      } else if (NavigationLocation === "home") {
        console.log(NavigationLocation, "Check Where its occur");
        console.log("Check Where its occur");
        functionForMeetingVideoScenario();
        if (location.pathname.includes("/Admin") === false) {
          if (
            (scheduleMeetingPageFlagReducer === true ||
              viewProposeDateMeetingPageFlagReducer === true ||
              viewAdvanceMeetingPublishPageFlagReducer === true ||
              viewAdvanceMeetingUnpublishPageFlagReducer === true ||
              viewProposeOrganizerMeetingPageFlagReducer === true ||
              proposeNewMeetingPageFlagReducer === true) &&
            viewMeetingFlagReducer === false
          ) {
            navigate("/Diskus/Meeting");

            let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
            let isMeetingVideo = JSON.parse(
              localStorage.getItem("isMeetingVideo")
            );
            if (isMeeting && !isMeetingVideo) {
              console.log("Check It");
              dispatch(showCancelModalmeetingDeitals(true));
            }
          } else {
            navigate("/Diskus/");
            dispatch(showCancelModalmeetingDeitals(false));
            dispatch(scheduleMeetingPageFlag(false));
            dispatch(viewProposeDateMeetingPageFlag(false));
            dispatch(viewAdvanceMeetingPublishPageFlag(false));
            dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
            dispatch(viewProposeOrganizerMeetingPageFlag(false));
            dispatch(proposeNewMeetingPageFlag(false));
            dispatch(viewMeetingFlag(false));
          }
        }
      } else if (NavigationLocation === "setting") {
        functionForMeetingVideoScenario();
        if (location.pathname.includes("/Admin") === false) {
          if (
            (scheduleMeetingPageFlagReducer === true ||
              viewProposeDateMeetingPageFlagReducer === true ||
              viewAdvanceMeetingPublishPageFlagReducer === true ||
              viewAdvanceMeetingUnpublishPageFlagReducer === true ||
              viewProposeOrganizerMeetingPageFlagReducer === true ||
              proposeNewMeetingPageFlagReducer === true) &&
            viewMeetingFlagReducer === false
          ) {
            navigate("/Diskus/Meeting");

            let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
            let isMeetingVideo = JSON.parse(
              localStorage.getItem("isMeetingVideo")
            );
            if (isMeeting && !isMeetingVideo) {
              console.log("Check It");
              dispatch(showCancelModalmeetingDeitals(true));
            }
          } else {
            navigate("/Diskus/setting");
            dispatch(showCancelModalmeetingDeitals(false));
            dispatch(scheduleMeetingPageFlag(false));
            dispatch(viewProposeDateMeetingPageFlag(false));
            dispatch(viewAdvanceMeetingPublishPageFlag(false));
            dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
            dispatch(viewProposeOrganizerMeetingPageFlag(false));
            dispatch(proposeNewMeetingPageFlag(false));
            dispatch(viewMeetingFlag(false));
          }
        }
      } else if (NavigationLocation === "Minutes") {
        functionForMeetingVideoScenario();
        if (location.pathname.includes("/Admin") === false) {
          if (
            (scheduleMeetingPageFlagReducer === true ||
              viewProposeDateMeetingPageFlagReducer === true ||
              viewAdvanceMeetingPublishPageFlagReducer === true ||
              viewAdvanceMeetingUnpublishPageFlagReducer === true ||
              viewProposeOrganizerMeetingPageFlagReducer === true ||
              proposeNewMeetingPageFlagReducer === true) &&
            viewMeetingFlagReducer === false
          ) {
            navigate("/Diskus/Meeting");

            let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
            let isMeetingVideo = JSON.parse(
              localStorage.getItem("isMeetingVideo")
            );
            if (isMeeting && !isMeetingVideo) {
              console.log("Check It");
              dispatch(showCancelModalmeetingDeitals(true));
            }
          } else {
            navigate("/Diskus/Minutes");
            dispatch(showCancelModalmeetingDeitals(false));
            dispatch(scheduleMeetingPageFlag(false));
            dispatch(viewProposeDateMeetingPageFlag(false));
            dispatch(viewAdvanceMeetingPublishPageFlag(false));
            dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
            dispatch(viewProposeOrganizerMeetingPageFlag(false));
            dispatch(proposeNewMeetingPageFlag(false));
            dispatch(viewMeetingFlag(false));
          }
        }
      } else if (NavigationLocation === "faq's") {
        functionForMeetingVideoScenario();
        if (location.pathname.includes("/Admin") === false) {
          if (
            (scheduleMeetingPageFlagReducer === true ||
              viewProposeDateMeetingPageFlagReducer === true ||
              viewAdvanceMeetingPublishPageFlagReducer === true ||
              viewAdvanceMeetingUnpublishPageFlagReducer === true ||
              viewProposeOrganizerMeetingPageFlagReducer === true ||
              proposeNewMeetingPageFlagReducer === true) &&
            viewMeetingFlagReducer === false
          ) {
            navigate("/Diskus/Meeting");

            let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
            let isMeetingVideo = JSON.parse(
              localStorage.getItem("isMeetingVideo")
            );
            if (isMeeting && !isMeetingVideo) {
              console.log("Check It");
              dispatch(showCancelModalmeetingDeitals(true));
            }
          } else {
            navigate("/Diskus/faq's");
            dispatch(showCancelModalmeetingDeitals(false));
            dispatch(scheduleMeetingPageFlag(false));
            dispatch(viewProposeDateMeetingPageFlag(false));
            dispatch(viewAdvanceMeetingPublishPageFlag(false));
            dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
            dispatch(viewProposeOrganizerMeetingPageFlag(false));
            dispatch(proposeNewMeetingPageFlag(false));
            dispatch(viewMeetingFlag(false));
          }
        }
      }
    } catch (error) {
      console.log(error, "NavigationError");
    }
  };
  return (
    <section>
      <Modal
        show={showVideoIntimationMessegeModal}
        setShow={dispatch(LeaveInitmationMessegeVideoMeetAction)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(LeaveInitmationMessegeVideoMeetAction(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["IntimationMessegeLeaveVideo"]}>
                  {t("Meeting-leave-confirmation")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("Yes")}
                  className={
                    styles["YesButtonLeaveIntimationMessegeMeetingModal"]
                  }
                  onClick={handleYesButtonLeaveVideoMeeting}
                />
                <Button
                  text={t("No")}
                  className={
                    styles["NoButtonLeaveIntimationMessegeMeetingModal"]
                  }
                  onClick={handleNoButtonLeaveVideoMeeting}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default LeaveVideoIntimationModal;
