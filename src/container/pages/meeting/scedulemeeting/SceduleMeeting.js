import React, { useState, useEffect } from "react";
import styles from "./SceduleMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Button } from "../../../../components/elements";
import MeetingDetails from "./meetingDetails/MeetingDetails";
import Organizers from "./Organizers/Organizers";
import AgendaContributers from "./AgendaContributors/AgendaContributers";
import Participants from "./Participants/Participants";
import Agenda from "./Agenda/Agenda";
import MeetingMaterial from "./MeetingMaterial/MeetingMaterial";
import Minutes from "./Minutes/Minutes";
import Actions from "./Actions/Actions";
import Polls from "./Polls/Polls";
import Attendence from "./Attendence/Attendence";
import {
  GetAllMeetingDetailsApiFunc,
  showCancelModalAgenda,
} from "../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const SceduleMeeting = ({
  setEdiorRole,
  setEditMeeting,
  isEditMeeting,
  ediorRole,
  setCurrentMeetingID,
  currentMeeting,
  setSceduleMeeting,
  setDataroomMapFolderId,
  dataroomMapFolderId,
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Call all search meetings api
  useEffect(() => {
    return () => {
      setEditMeeting(false);
      setEdiorRole({ status: null, role: null });
      setCurrentMeetingID(0);
    };
  }, []);

  const showMeetingDeitals = () => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(
      GetAllMeetingDetailsApiFunc(
        Data,
        navigate,
        t,
        setCurrentMeetingID,
        setSceduleMeeting
      )
    );
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
    dispatch(showCancelModalAgenda(false));
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
    <section>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          {isEditMeeting ? (
            <span className={styles["Scedule_newMeeting_Heading"]}>
              {t("Edit-new-meeting")}
            </span>
          ) : (
            <span className={styles["Scedule_newMeeting_Heading"]}>
              {t("Schedule-new-meeting")}
            </span>
          )}
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
                  disableBtn={Number(currentMeeting) === 0 ? true : false}
                  text={t("Organizers")}
                  className={
                    organizers === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showOrganizers}
                />
                <Button
                  disableBtn={Number(currentMeeting) === 0 ? true : false}
                  text={t("Agenda-contributors")}
                  className={
                    agendaContributors === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showAgendaContributers}
                />
                <Button
                  disableBtn={Number(currentMeeting) === 0 ? true : false}
                  text={t("Participants")}
                  className={
                    participants === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showParticipants}
                />
                <Button
                  disableBtn={Number(currentMeeting) === 0 ? true : false}
                  text={t("Agenda")}
                  className={
                    agenda === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showAgenda}
                />
                <Button
                  disableBtn={Number(currentMeeting) === 0 ? true : false}
                  text={t("Meeting-material")}
                  className={
                    meetingMaterial === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showMeetingMaterial}
                />
                <Button
                  disableBtn={
                    (Number(ediorRole.status) === 1 ||
                      Number(ediorRole.status) === 11 ||
                      Number(ediorRole.status) === 12) &&
                    (ediorRole.role === "Organizer" ||
                      ediorRole.role === "Participant" ||
                      ediorRole.role === "Agenda Contributor") &&
                    isEditMeeting === true
                      ? true
                      : Number(currentMeeting) === 0
                      ? true
                      : isEditMeeting === false
                      ? true
                      : false
                  }
                  text={t("Minutes")}
                  className={
                    minutes === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showMinutes}
                />
                <Button
                  // disableBtn={
                  //   isEditMeeting === false
                  //     ? true
                  //     : Number(currentMeeting) === 0
                  //     ? true
                  //     : // : false
                  //       true
                  // }
                  text={t("Actions")}
                  className={
                    actionsPage === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showActions}
                />
                <Button
                  disableBtn={
                    (Number(ediorRole.status) === 1 ||
                      Number(ediorRole.status) === 11 ||
                      Number(ediorRole.status) === 12) &&
                    (ediorRole.role === "Organizer" ||
                      ediorRole.role === "Participant" ||
                      ediorRole.role === "Agenda Contributor") &&
                    isEditMeeting === true
                      ? true
                      : Number(currentMeeting) === 0
                      ? true
                      : isEditMeeting === false
                      ? true
                      : false
                  }
                  text={t("Polls")}
                  className={
                    polls === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={ShowPolls}
                />
                {(Number(ediorRole.status) === 10 ||
                  Number(ediorRole.status) === 9) &&
                ediorRole.role === "Organizer" &&
                isEditMeeting === true ? (
                  <Button
                    disableBtn={Number(currentMeeting) === 0 ? true : false}
                    text={t("Attendence")}
                    className={
                      attendance === true
                        ? styles["Schedule_meetings_options_active"]
                        : styles["Schedule_meetings_options"]
                    }
                    onClick={showAttendance}
                  />
                ) : null}
              </Col>
            </Row>

            {meetingDetails && (
              <MeetingDetails
                setorganizers={setorganizers}
                setmeetingDetails={setmeetingDetails}
                setSceduleMeeting={setSceduleMeeting}
                setAgendaContributors={setAgendaContributors}
                setParticipants={setParticipants}
                setAgenda={setAgenda}
                setMinutes={setMinutes}
                setactionsPage={setactionsPage}
                setAttendance={setAttendance}
                setPolls={setPolls}
                setMeetingMaterial={setMeetingMaterial}
                setCurrentMeetingID={setCurrentMeetingID}
                currentMeeting={currentMeeting}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
                setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {organizers && (
              <Organizers
                setorganizers={setorganizers}
                setmeetingDetails={setmeetingDetails}
                setSceduleMeeting={setSceduleMeeting}
                setAgendaContributors={setAgendaContributors}
                setParticipants={setParticipants}
                setAgenda={setAgenda}
                setMinutes={setMinutes}
                setactionsPage={setactionsPage}
                setAttendance={setAttendance}
                setPolls={setPolls}
                setMeetingMaterial={setMeetingMaterial}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
              />
            )}
            {agendaContributors && (
              <AgendaContributers
                setorganizers={setorganizers}
                setCurrentMeetingID={setCurrentMeetingID}
                currentMeeting={currentMeeting}
                setSceduleMeeting={setSceduleMeeting}
                setAgendaContributors={setAgendaContributors}
                setParticipants={setParticipants}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
              />
            )}
            {participants && (
              <Participants
                setParticipants={setParticipants}
                setAgenda={setAgenda}
                setProposedMeetingDates={setProposedMeetingDates}
                proposedMeetingDates={proposedMeetingDates}
                setSceduleMeeting={setSceduleMeeting}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setAgendaContributors={setAgendaContributors}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
              />
            )}

            {agenda && (
              <Agenda
                setSceduleMeeting={setSceduleMeeting}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
                setMeetingMaterial={setMeetingMaterial}
                setAgenda={setAgenda}
                setParticipants={setParticipants}
                dataroomMapFolderId={dataroomMapFolderId}
              />
            )}
            {meetingMaterial && (
              <MeetingMaterial
                setSceduleMeeting={setSceduleMeeting}
                setMeetingMaterial={setMeetingMaterial}
                setMinutes={setMinutes}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
                setAgenda={setAgenda}
              />
            )}
            {minutes && (
              <Minutes
                setMinutes={setMinutes}
                setMeetingMaterial={setMeetingMaterial}
                setSceduleMeeting={setSceduleMeeting}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
              />
            )}
            {actionsPage && (
              <Actions
                setSceduleMeeting={setSceduleMeeting}
                setPolls={setPolls}
                setactionsPage={setactionsPage}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
              />
            )}
            {polls && (
              <Polls
                setSceduleMeeting={setSceduleMeeting}
                setPolls={setPolls}
                setAttendance={setAttendance}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
              />
            )}
            {attendance && (
              <Attendence
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                ediorRole={ediorRole}
                setAttendance={setAttendance}
                setSceduleMeeting={setSceduleMeeting}
              />
            )}
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default SceduleMeeting;
