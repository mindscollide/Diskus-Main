import React, { useEffect, useState } from "react";
import styles from "./ViewMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Button, Loader } from "../../../../components/elements";
import Organizers from "./Organizers/Organizers";
import AgendaContributers from "./AgendaContributors/AgendaContributers";
import Participants from "./Participants/Participants";
import Agenda from "./Agenda/Agenda";
import MeetingMaterial from "./MeetingMaterial/MeetingMaterial";
import Minutes from "./Minutes/Minutes";
import Actions from "./Actions/Actions";
import Polls from "./Polls/Polls";
import Attendence from "./Attendence/Attendence";
import ViewMeetingDetails from "./meetingDetails/ViewMeetingDetails";
import { cleareAllState } from "../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const ViewMeetingModal = ({
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setAdvanceMeetingModalID,
  unPublish,
  editorRole,
  setEdiorRole,
  dataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const { Loading } = useSelector((state) => state.NewMeetingreducer);
  const [meetingDetails, setmeetingDetails] = useState(true);
  const [organizers, setorganizers] = useState(false);
  const [agendaContributors, setAgendaContributors] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [agenda, setAgenda] = useState(false);
  const [meetingMaterial, setMeetingMaterial] = useState(false);
  const [minutes, setMinutes] = useState(false);
  const [actionsPage, setactionsPage] = useState(false);
  const [polls, setPolls] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [seduleMeeting, setSceduleMeeting] = useState(false);

  const dispatch = useDispatch();

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
                  <Button
                    text={t("Organizers")}
                    className={
                      organizers === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showOrganizers}
                  />
                  <Button
                    text={t("Agenda-contributors")}
                    className={
                      agendaContributors === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showAgendaContributers}
                  />
                  <Button
                    text={t("Participants")}
                    className={
                      participants === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showParticipants}
                  />
                  <Button
                    text={t("Agenda")}
                    className={
                      agenda === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showAgenda}
                  />
                  <Button
                    text={t("Meeting-material")}
                    className={
                      meetingMaterial === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showMeetingMaterial}
                  />
                  <>
                    <Button
                      text={t("Minutes")}
                      className={
                        minutes === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showMinutes}
                      disableBtn={
                        unPublish
                          ? true
                          : Number(editorRole.status) === 1 ||
                            Number(editorRole.status) === 11 ||
                            Number(editorRole.status) === 12
                          ? true
                          : editorRole.role === "Organizer" &&
                            Number(editorRole.status) === 9
                          ? false
                          : Number(editorRole.status) === 10 &&
                            editorRole.role === "Organizer"
                          ? false
                          : true
                      }
                    />
                    <Button
                      text={t("Actions")}
                      className={
                        actionsPage === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showActions}
                      disableBtn={
                        unPublish
                          ? true
                          : Number(editorRole.status) === 1 ||
                            Number(editorRole.status) === 11 ||
                            Number(editorRole.status) === 12
                          ? true
                          : (editorRole.role === "Organizer" ||
                              editorRole.role === "Participant" ||
                              editorRole.role === "Agenda Contributor") &&
                            Number(editorRole.status) === 9
                          ? false
                          : Number(editorRole.status) === 10 &&
                            (editorRole.role === "Participant" ||
                              editorRole.role === "Agenda Contributor" ||
                              editorRole.role === "Organizer")
                          ? false
                          : true
                      }
                    />
                    <Button
                      text={t("Polls")}
                      className={
                        polls === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={ShowPolls}
                      disableBtn={
                        unPublish
                          ? true
                          : Number(editorRole.status) === 1 ||
                            Number(editorRole.status) === 11 ||
                            Number(editorRole.status) === 12 ||
                            Number(editorRole.status) === 9
                          ? true
                          : Number(editorRole.status) === 10 &&
                            (editorRole.role === "Participant" ||
                              editorRole.role === "Agenda Contributor" ||
                              editorRole.role === "Organizer")
                          ? false
                          : true
                      }
                    />
                    {Number(editorRole.status) === 10 ? (
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
                  setmeetingDetails={setmeetingDetails}
                  advanceMeetingModalID={advanceMeetingModalID}
                  setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
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
                />
              )}
              {meetingMaterial && (
                <MeetingMaterial
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
                      setSceduleMeeting={setSceduleMeeting}
                    />
                  )}
                  {actionsPage && (
                    <Actions
                      setPolls={setPolls}
                      setSceduleMeeting={setViewAdvanceMeetingModal}
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
                      setSceduleMeeting={setViewAdvanceMeetingModal}
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
      {/* {NewMeetingreducer.Loading && <Loader />} */}
    </>
  );
};

export default ViewMeetingModal;
