import React, { useState } from "react";
import styles from "./SceduleMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import {
  Button,
  TextField,
  Loader,
  Notification,
} from "../../../../components/elements";
import MeetingDetails from "./meetingDetails/MeetingDetails";
import Organizers from "./Organizers/Organizers";
import AgendaContributers from "./AgendaContributors/AgendaContributers";
import Participants from "./Participants/Participants";
import Agenda from "./Agenda/Agenda";
import MeetingMaterial from "./MeetingMaterial/MeetingMaterial";
const SceduleMeeting = ({ setProposeMeetingDate }) => {
  const { t } = useTranslation();
  const [meetingDetails, setmeetingDetails] = useState(true);
  const [organizers, setorganizers] = useState(false);
  const [agendaContributors, setAgendaContributors] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [agenda, setAgenda] = useState(false);
  const [meetingMaterial, setMeetingMaterial] = useState(false);

  const showMeetingDeitals = () => {
    setmeetingDetails(true);
    setorganizers(false);
    setAgendaContributors(false);
    setParticipants(false);
    setAgenda(false);
    setMeetingMaterial(false);
  };
  const showOrganizers = () => {
    setorganizers(true);
    setmeetingDetails(false);
    setAgendaContributors(false);
    setParticipants(false);
    setAgenda(false);
    setMeetingMaterial(false);
  };
  const showAgendaContributers = () => {
    setAgendaContributors(true);
    setmeetingDetails(false);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMeetingMaterial(false);
  };

  const showParticipants = () => {
    setParticipants(true);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
    setAgenda(false);
    setMeetingMaterial(false);
  };

  const showAgenda = () => {
    setAgenda(true);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
    setMeetingMaterial(false);
  };

  const showMeetingMaterial = () => {
    setMeetingMaterial(true);
    setAgenda(false);
    setParticipants(false);
    setAgendaContributors(false);
    setorganizers(false);
    setmeetingDetails(false);
  };
  return (
    <section>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Scedule_newMeeting_Heading"]}>
            {t("Schedule-new-meeting")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["Scedule_meeting_paper"]}>
            <Row>
              <Col lg={12} md={12} sm={12} className="d-flex gap-2">
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
                  className={styles["Schedule_meetings_options"]}
                  onClick={showMeetingMaterial}
                />
                <Button
                  text={t("Minutes")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Actions")}
                  className={styles["Schedule_meetings_options"]}
                />
                <Button
                  text={t("Polls")}
                  className={styles["Schedule_meetings_options"]}
                />
              </Col>
            </Row>
            {meetingDetails && (
              <MeetingDetails
                setorganizers={setorganizers}
                setmeetingDetails={setmeetingDetails}
              />
            )}
            {organizers && (
              <Organizers
                setAgendaContributors={setAgendaContributors}
                setorganizers={setorganizers}
              />
            )}
            {agendaContributors && (
              <AgendaContributers
                setParticipants={setParticipants}
                setAgendaContributors={setAgendaContributors}
              />
            )}
            {participants && (
              <Participants
                setParticipants={setParticipants}
                setAgenda={setAgenda}
                setProposeMeetingDate={setProposeMeetingDate}
              />
            )}
            {agenda && <Agenda />}
            {meetingMaterial && <MeetingMaterial />}
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default SceduleMeeting;
