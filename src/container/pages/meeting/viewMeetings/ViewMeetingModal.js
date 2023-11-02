import React, { useState } from "react";
import styles from "./ViewMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import {
  Button,
  TextField,
  Loader,
  Notification,
} from "../../../../components/elements";
import Organizers from "./Organizers/Organizers";
import AgendaContributers from "./AgendaContributors/AgendaContributers";
import Participants from "./Participants/Participants";
import Agenda from "./Agenda/Agenda";
import MeetingMaterial from "./MeetingMaterial/MeetingMaterial";
import Minutes from "./Minutes/Minutes";
import ProposedMeetingDate from "./Participants/ProposedMeetingDate/ProposedMeetingDate";
import Actions from "./Actions/Actions";
import Polls from "./Polls/Polls";
import Attendence from "./Attendence/Attendence";
import ViewParticipantsDates from "./Participants/ViewParticipantsDates/ViewParticipantsDates";
import ViewMeetingDetails from "./meetingDetails/ViewMeetingDetails";
const ViewMeetingModal = ({
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
}) => {
  const { t } = useTranslation();
  let currentMeetingID = Number(localStorage.getItem("meetingID"));
  console.log(currentMeetingID, "currentMeetingIDcurrentMeetingID");
  const [meetingDetails, setmeetingDetails] = useState(true);
  const [organizers, setorganizers] = useState(false);
  const [agendaContributors, setAgendaContributors] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [agenda, setAgenda] = useState(false);
  const [meetingMaterial, setMeetingMaterial] = useState(false);
  const [minutes, setMinutes] = useState(false);
  const [proposedMeetingDates, setProposedMeetingDates] = useState(false);
  const [actionsPage, setactionsPage] = useState(false);
  const [polls, setPolls] = useState(false);
  const [attendance, setAttendance] = useState(false);

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
      {proposedMeetingDates ? (
        <ProposedMeetingDate
          setProposedMeetingDates={setProposedMeetingDates}
          setParticipants={setParticipants}
        />
      ) : (
        <section>
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
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex gap-2 flex-wrap"
                  >
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
                    <Button
                      text={t("Minutes")}
                      className={
                        minutes === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showMinutes}
                    />
                    <Button
                      text={t("Actions")}
                      className={
                        actionsPage === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showActions}
                    />
                    <Button
                      text={t("Polls")}
                      className={
                        polls === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={ShowPolls}
                    />
                    <Button
                      text={t("Attendence")}
                      className={
                        attendance === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAttendance}
                    />
                  </Col>
                </Row>

                {meetingDetails && (
                  <ViewMeetingDetails
                    setorganizers={setorganizers}
                    setmeetingDetails={setmeetingDetails}
                    advanceMeetingModalID={advanceMeetingModalID}
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  />
                )}
                {organizers && (
                  <Organizers
                    setorganizers={setorganizers}
                    setmeetingDetails={setmeetingDetails}
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    setAgendaContributors={setAgendaContributors}
                    setParticipants={setParticipants}
                    setAgenda={setAgenda}
                    setMinutes={setMinutes}
                    setactionsPage={setactionsPage}
                    setAttendance={setAttendance}
                    setPolls={setPolls}
                    setMeetingMaterial={setMeetingMaterial}
                    advanceMeetingModalID={advanceMeetingModalID}
                  />
                )}
                {agendaContributors && (
                  <AgendaContributers
                    setorganizers={setorganizers}
                    setmeetingDetails={setmeetingDetails}
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    setAgendaContributors={setAgendaContributors}
                    setParticipants={setParticipants}
                    setAgenda={setAgenda}
                    setMinutes={setMinutes}
                    setactionsPage={setactionsPage}
                    setAttendance={setAttendance}
                    setPolls={setPolls}
                    setMeetingMaterial={setMeetingMaterial}
                  />
                )}
                {participants && (
                  <Participants
                    setParticipants={setParticipants}
                    setAgenda={setAgenda}
                    setProposedMeetingDates={setProposedMeetingDates}
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  />
                )}

                {agenda && (
                  <Agenda
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                  />
                )}
                {meetingMaterial && (
                  <MeetingMaterial
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    setMeetingMaterial={setMeetingMaterial}
                    setMinutes={setMinutes}
                  />
                )}
                {minutes && <Minutes setMinutes={setMinutes} />}
                {actionsPage && (
                  <Actions
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    setPolls={setPolls}
                    setactionsPage={setactionsPage}
                  />
                )}
                {polls && (
                  <Polls
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    setPolls={setPolls}
                    setAttendance={setAttendance}
                  />
                )}
                {attendance && <Attendence />}
              </Paper>
            </Col>
          </Row>
        </section>
      )}
    </>
  );
};

export default ViewMeetingModal;
