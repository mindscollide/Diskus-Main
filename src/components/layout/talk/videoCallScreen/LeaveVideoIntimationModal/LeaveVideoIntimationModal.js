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
    await dispatch(
      LeaveCurrentMeetingOtherMenus(
        navigate,
        t,
        Data,
        scheduleMeetingsPageFlag,
        viewProposeDateMeetingsPageFlag,
        viewAdvanceMeetingsPublishPageFlag,
        viewAdvanceMeetingsUnpublishPageFlag,
        viewProposeOrganizerMeetingsPageFlag,
        proposeNewMeetingsPageFlag,
        viewMeetingsFlag,
        scheduleMeetingPageFlagReducer,
        viewProposeDateMeetingPageFlagReducer,
        viewAdvanceMeetingPublishPageFlagReducer,
        viewAdvanceMeetingUnpublishPageFlagReducer,
        viewProposeOrganizerMeetingPageFlagReducer,
        proposeNewMeetingPageFlagReducer,
        viewMeetingFlagReducer,
        location
      )
    );
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
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "todolist") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "calendar") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "Notes") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "dataroom") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "groups") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "committee") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "resolution") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "polling") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "dataroomRecentAddedFiles") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "home") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "setting") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "Minutes") {
        functionForMeetingVideoScenario();
      } else if (NavigationLocation === "faq's") {
        functionForMeetingVideoScenario();
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
