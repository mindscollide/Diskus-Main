import React, { useEffect, useState } from "react";
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
import ViewMeetingDetails from "./meetingDetails/ViewMeetingDetails";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const ViewMeetingModal = ({
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setAdvanceMeetingModalID,
  unPublish,
  ediorRole,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
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

  useEffect(() => {
    return () => {
      setEdiorRole({ status: null, role: null });
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
  console.log("ediorRole", ediorRole);
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
                    <>
                      <Button
                        text={t("Minutes")}
                        className={
                          minutes === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showMinutes}
                        disableBtn={unPublish ? true : false}
                      />
                      <Button
                        text={t("Actions")}
                        className={
                          actionsPage === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showActions}
                        disableBtn={true}
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
                            : Number(ediorRole.status) === 1 ||
                              Number(ediorRole.status) === 11 ||
                              Number(ediorRole.status) === 12
                            ? true
                            : false
                        }
                      />
                      {Number(ediorRole.status) === 10 ? (
                        <Button
                          text={t("Attendence")}
                          className={
                            attendance === true
                              ? styles["Schedule_meetings_options_active"]
                              : styles["Schedule_meetings_options"]
                          }
                          onClick={showAttendance}
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
                    ediorRole={ediorRole}
                  />
                )}
                {organizers && (
                  <Organizers
                    setmeetingDetails={setmeetingDetails}
                    setorganizers={setorganizers}
                    advanceMeetingModalID={advanceMeetingModalID}
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    setAgendaContributors={setAgendaContributors}
                    ediorRole={ediorRole}
                  />
                )}
                {agendaContributors && (
                  <AgendaContributers
                    setorganizers={setorganizers}
                    setAgendaContributors={setAgendaContributors}
                    setParticipants={setParticipants}
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    advanceMeetingModalID={advanceMeetingModalID}
                    ediorRole={ediorRole}
                  />
                )}
                {participants && (
                  <Participants
                    setParticipants={setParticipants}
                    setAgenda={setAgenda}
                    setAgendaContributors={setAgendaContributors}
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    advanceMeetingModalID={advanceMeetingModalID}
                    ediorRole={ediorRole}
                  />
                )}
                {agenda && (
                  <Agenda
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    setMeetingMaterial={setMeetingMaterial}
                    setParticipants={setParticipants}
                    setAgenda={setAgenda}
                    advanceMeetingModalID={advanceMeetingModalID}
                    ediorRole={ediorRole}
                  />
                )}
                {meetingMaterial && (
                  <MeetingMaterial
                    setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                    advanceMeetingModalID={advanceMeetingModalID}
                    setMeetingMaterial={setMeetingMaterial}
                    setAgenda={setAgenda}
                    setMinutes={setMinutes}
                    ediorRole={ediorRole}
                  />
                )}
                {unPublish ? null : (
                  <>
                    {minutes && (
                      <Minutes
                        setMinutes={setMinutes}
                        setactionsPage={setactionsPage}
                        setMeetingMaterial={setMeetingMaterial}
                        ediorRole={ediorRole}
                        advanceMeetingModalID={advanceMeetingModalID}
                      />
                    )}
                    {actionsPage && (
                      <Actions
                        setPolls={setPolls}
                        setMinutes={setMinutes}
                        setactionsPage={setactionsPage}
                        ediorRole={ediorRole}
                        advanceMeetingModalID={advanceMeetingModalID}
                        setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                        setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                      />
                    )}
                    {polls && (
                      <Polls
                        setPolls={setPolls}
                        setactionsPage={setactionsPage}
                        setAttendance={setAttendance}
                        ediorRole={ediorRole}
                        advanceMeetingModalID={advanceMeetingModalID}
                        setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                        setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
                      />
                    )}
                    {attendance && (
                      <Attendence
                        ediorRole={ediorRole}
                        advanceMeetingModalID={advanceMeetingModalID}
                      />
                    )}
                  </>
                )}
              </Paper>
            </Col>
          </Row>
        </section>
      )}
    </>
  );
};

export default ViewMeetingModal;
