import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { getCurrentDateTimeUTC } from "../../../../../commen/functions/date_formater";
const LeaveVideoIntimationModal = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const navigate = useNavigate();

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

  //Local States
  const [meetingNavigation, setMeetingNavigation] = useState("Meeting");
  const [todoListNavigation, setTodoListNavigation] = useState("todolist");
  const [calendarNavigation, setCalendarNavigation] = useState("calendar");
  const [notesNavigation, setNotesNavigation] = useState("Notes");

  //handle NO button
  const handleNoButtonLeaveVideoMeeting = () => {
    dispatch(LeaveInitmationMessegeVideoMeetAction(false));
  };

  //handle Yes button
  const handleYesButtonLeaveVideoMeeting = () => {
    //If Navigating to Meeting Tab
    if (NavigationLocation === "Meeting") {
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
        setMeetingNavigation("Meeting");
        dispatch(showCancelModalmeetingDeitals(true));
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
    }

    //If Navigating to Task Tab
    if (NavigationLocation === "todolist") {
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
        navigate("/DisKus/Meeting");
        dispatch(showCancelModalmeetingDeitals(true));
        dispatch(uploadGlobalFlag(false));
      } else {
        navigate("/DisKus/todolist");
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

    //If Navigating to Calender Tab
    if (NavigationLocation === "calendar") {
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
        navigate("/DisKus/Meeting");
        dispatch(showCancelModalmeetingDeitals(true));
        dispatch(uploadGlobalFlag(false));
      } else {
        navigate("/DisKus/calendar");
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

    //If Navigating to Notes Tab
    if (NavigationLocation === "Notes") {
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
        navigate("/DisKus/Meeting");
        dispatch(showCancelModalmeetingDeitals(true));
        dispatch(uploadGlobalFlag(false));
      } else {
        navigate("/DisKus/Notes");
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
                  text={"Yes"}
                  className={
                    styles["YesButtonLeaveIntimationMessegeMeetingModal"]
                  }
                  onClick={handleYesButtonLeaveVideoMeeting}
                />
                <Button
                  text={"No"}
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
