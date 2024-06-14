import React, { useEffect, useState } from "react";
import styles from "./ViewMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Button, Loader } from "../../../../components/elements";
import Organizers from "./Organizers/Organizers";
import AgendaContributers from "./AgendaContributors/AgendaContributers";
import {
  normalizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
} from "../../../../store/actions/VideoFeature_actions";
import {
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
  meetingOrganizerRemoved,
  meetingOrganizerAdded,
  meetingAgendaContributorRemoved,
  meetingAgendaContributorAdded,
  viewMeetingFlag,
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
import { useNavigate } from "react-router-dom";
import { checkFeatureIDAvailability } from "../../../../commen/functions/utils";
const ViewMeetingModal = ({
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setAdvanceMeetingModalID,
  unPublish,
  editorRole,
  setEdiorRole,
  dataroomMapFolderId,
  setDataroomMapFolderId,
  setCurrentMeetingID,
}) => {
  console.log(editorRole, "editorRoleeditorRoleeditorRoleeditorRole");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routeID = useSelector((state) => state.NewMeetingreducer.emailRouteID);
  const [meetingDetails, setmeetingDetails] = useState(
    (editorRole.role === "Organizer" || editorRole.role === "Participant") &&
      Number(editorRole.status) === 10
      ? false
      : true
  );
  const [organizers, setorganizers] = useState(false);
  const [agendaContributors, setAgendaContributors] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [agenda, setAgenda] = useState(false);
  const [meetingMaterial, setMeetingMaterial] = useState(
    (editorRole.role === "Organizer" || editorRole.role === "Participant") &&
      Number(editorRole.status) === 10
      ? true
      : false
  );
  const [minutes, setMinutes] = useState(false);
  const [actionsPage, setactionsPage] = useState(false);
  const [polls, setPolls] = useState(false);
  const [attendance, setAttendance] = useState(false);

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let userID = localStorage.getItem("userID");
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

  const dispatch = useDispatch();

  const { meetingIdReducer, NewMeetingreducer } = useSelector((state) => state);

  console.log(
    meetingIdReducer.meetingDetails,
    "meetingIdReducermeetingIdReducermeetingIdReducer"
  );
  useEffect(() => {
    if (routeID !== null) {
      if (Number(routeID) === 1) {
        // Agenda Contributor Tab
        setAgendaContributors(true);
        setmeetingDetails(false);
      } else if (Number(routeID) === 2) {
        setorganizers(true);
        setmeetingDetails(false);
      }
    }
  }, [routeID]);

  useEffect(() => {
    return () => {
      dispatch(cleareAllState());
      setEdiorRole({ status: null, role: null });
      setAdvanceMeetingModalID(null);
    };
  }, []);

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
    setactionsPage(false);
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
    setPolls(false);
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
    setmeetingDetails(false);
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
    setPolls(false);
  };
  useEffect(() => {
    if (
      NewMeetingreducer.mqttMeetingAcRemoved !== null &&
      NewMeetingreducer.mqttMeetingAcRemoved !== undefined
    ) {
      try {
        setEdiorRole({ status: null, role: null });
        setViewAdvanceMeetingModal(false);
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        // setCurrentMeetingID(0);
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
        setEdiorRole({ status: null, role: null });
        setViewAdvanceMeetingModal(false);
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        // setCurrentMeetingID(0);
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
        advanceMeetingModalID === endMeetingData.pK_MDID &&
        endMeetingData.status === "9"
      ) {
        setEdiorRole({ status: null, role: null });
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
        dispatch(searchNewUserMeeting(navigate, searchData, t));

        localStorage.setItem("folderDataRoomMeeting", 0);
      }
    }
  }, [meetingIdReducer.MeetingStatusEnded]);

  return (
    <>
      <section className="position-relative">
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["Scedule_newMeeting_Heading"]}>
              {t("Meeting-view")}
            </span>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className="mb-4">
            <Paper className={styles["Scedule_meeting_paper"]}>
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
                  {editorRole.role === "Participant" ? null : (
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
                  {editorRole.role === "Participant" ? null : (
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
                  {editorRole.role === "Participant" ? null : (
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
                    {editorRole.role === "Participant" ? null : (
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
                        // disableBtn={
                        //   unPublish
                        //     ? true
                        //     : Number(editorRole.status) === 1 ||
                        //       Number(editorRole.status) === 11 ||
                        //       Number(editorRole.status) === 12
                        //     ? true
                        //     : editorRole.role === "Organizer" &&
                        //       Number(editorRole.status) === 9
                        //     ? false
                        //     : Number(editorRole.status) === 10 &&
                        //       editorRole.role === "Organizer"
                        //     ? false
                        //     : true
                        // }
                      />
                    )}
                    {checkFeatureIDAvailability(14) ? (
                      <>
                        {editorRole.role === "Participant" ? null : (
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
                        )}
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
                    {Number(editorRole.status) === 10 &&
                    editorRole.role !== "Participant" ? (
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
                  </>
                  {/* )} */}
                </Col>
              </Row>
              {meetingDetails && (
                <ViewMeetingDetails
                  setorganizers={setorganizers}
                  setMeetingMaterial={setMeetingMaterial}
                  setmeetingDetails={setmeetingDetails}
                  advanceMeetingModalID={advanceMeetingModalID}
                  setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
                  setDataroomMapFolderId={setDataroomMapFolderId}
                />
              )}
              {organizers && (
                <Organizers
                  setmeetingDetails={setmeetingDetails}
                  setorganizers={setorganizers}
                  advanceMeetingModalID={advanceMeetingModalID}
                  setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                  setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  setAgendaContributors={setAgendaContributors}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
                />
              )}
              {agendaContributors && (
                <AgendaContributers
                  setorganizers={setorganizers}
                  setAgendaContributors={setAgendaContributors}
                  setParticipants={setParticipants}
                  setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                  setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  advanceMeetingModalID={advanceMeetingModalID}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
                />
              )}
              {participants && (
                <Participants
                  setParticipants={setParticipants}
                  setAgenda={setAgenda}
                  setAgendaContributors={setAgendaContributors}
                  setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                  advanceMeetingModalID={advanceMeetingModalID}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
                />
              )}
              {agenda && (
                <Agenda
                  setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  setMeetingMaterial={setMeetingMaterial}
                  setParticipants={setParticipants}
                  setAgenda={setAgenda}
                  setPolls={setPolls}
                  advanceMeetingModalID={advanceMeetingModalID}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
                  setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                />
              )}
              {meetingMaterial && (
                <AgendaViewer
                  setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  advanceMeetingModalID={advanceMeetingModalID}
                  setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                  setMeetingMaterial={setMeetingMaterial}
                  setAgenda={setAgenda}
                  setMinutes={setMinutes}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
                  setactionsPage={setactionsPage}
                />
              )}
              {unPublish ? null : (
                <>
                  {minutes && (
                    <Minutes
                      setMinutes={setMinutes}
                      setPolls={setPolls}
                      setAttendance={setAttendance}
                      setAgenda={setAgenda}
                      setactionsPage={setactionsPage}
                      setMeetingMaterial={setMeetingMaterial}
                      editorRole={editorRole}
                      setEdiorRole={setEdiorRole}
                      advanceMeetingModalID={advanceMeetingModalID}
                      setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                      setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                    />
                  )}
                  {actionsPage && (
                    <Actions
                      setPolls={setPolls}
                      setMinutes={setMinutes}
                      setactionsPage={setactionsPage}
                      editorRole={editorRole}
                      setEdiorRole={setEdiorRole}
                      currentMeeting={advanceMeetingModalID}
                      setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                      setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                      dataroomMapFolderId={dataroomMapFolderId}
                      setMeetingMaterial={setMeetingMaterial}
                    />
                  )}
                  {polls && (
                    <Polls
                      setPolls={setPolls}
                      setAgenda={setAgenda}
                      setactionsPage={setactionsPage}
                      setAttendance={setAttendance}
                      editorRole={editorRole}
                      setEdiorRole={setEdiorRole}
                      currentMeeting={advanceMeetingModalID}
                      setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                      setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    />
                  )}
                  {attendance && (
                    <Attendence
                      editorRole={editorRole}
                      setEdiorRole={setEdiorRole}
                      setMinutes={setMinutes}
                      setPolls={setPolls}
                      setAgenda={setAgenda}
                      advanceMeetingModalID={advanceMeetingModalID}
                      setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                      setAttendance={setAttendance}
                      setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                    />
                  )}
                </>
              )}
            </Paper>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default ViewMeetingModal;
