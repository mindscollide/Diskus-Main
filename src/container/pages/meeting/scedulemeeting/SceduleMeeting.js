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
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  showCancelModalAgenda,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
} from "../../../../store/actions/NewMeetingActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const SceduleMeeting = ({
  setEdiorRole,
  setEditMeeting,
  isEditMeeting,
  editorRole,
  setCurrentMeetingID,
  currentMeeting,
  setSceduleMeeting,
  setDataroomMapFolderId,
  dataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const { NewMeetingreducer } = useSelector((state) => state);
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

  const apiCallsForComponentMound = async () => {
    try {
      // // Meeting Type Drop Down API
      // await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
      // Reminder Frequency Drop Down API
      await dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
      // Recurring Drop Down API
      await dispatch(GetAllMeetingRecurringApiNew(navigate, t, false));
    } catch (error) {
      console.error("An error occurred during API calls:", error);
    }
  };
  useEffect(() => {
    if (currentMeeting === 0) {
      apiCallsForComponentMound();
    }
    return () => {
      setEditMeeting(false);
      setEdiorRole({ status: null, role: null });
      setCurrentMeetingID(0);
      setProposedMeetingDates(false);
    };
  }, []);

  const showMeetingDeitals = () => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    if (Data.MeetingID !== 0) {
      dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          true,
          setCurrentMeetingID,
          setSceduleMeeting,
          setDataroomMapFolderId,
          0,
          1
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

      dispatch(meetingDetailsGlobalFlag(true));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(true));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(true));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(true));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(true));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(true));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(true));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(true));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
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

    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(true));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
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
    dispatch(attendanceGlobalFlag(true));
    dispatch(uploadGlobalFlag(false));
  };

  return (
    <section>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          {isEditMeeting ? (
            <span className={styles["Scedule_newMeeting_Heading"]}>
              {t("Edit-meeting")}
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
              <Col
                lg={12}
                md={12}
                sm={12}
                className="py-2 d-flex gap-2 flex-wrap"
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
                {Number(currentMeeting) !== 0 && (
                  <>
                    {" "}
                    <Button
                      disableBtn={Number(currentMeeting) === 0 ? true : false}
                      text={t("Organizers")}
                      className={
                        organizers === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      // onClick={handleClickOrganizers}
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
                      text={t("Agenda-builder")}
                      className={
                        agenda === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAgenda}
                    />
                    <Button
                      disableBtn={Number(currentMeeting) === 0 ? true : false}
                      text={t("Agenda-viewer")}
                      className={
                        meetingMaterial === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showMeetingMaterial}
                    />
                    <Button
                      // disableBtn={Number(currentMeeting) === 0 ? true : false}
                      disableBtn={
                        Number(editorRole.status) === 10 ||
                        Number(editorRole.status) === 9
                          ? false
                          : true
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
                      disableBtn={
                        Number(editorRole.status) === 10 ||
                        Number(editorRole.status) === 9
                          ? false
                          : true
                      }
                      text={t("Task")}
                      className={
                        actionsPage === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showActions}
                    />
                    <Button
                      disableBtn={
                        Number(editorRole.status) === 10 ||
                        Number(editorRole.status) === 9
                          ? false
                          : true
                      }
                      // disableBtn={
                      //   (Number(editorRole.status) === 1 ||
                      //     Number(editorRole.status) === 11 ||
                      //     Number(editorRole.status) === 12) &&
                      //   (editorRole.role === "Organizer" ||
                      //     editorRole.role === "Participant" ||
                      //     editorRole.role === "Agenda Contributor") &&
                      //   isEditMeeting === true
                      //     ? true
                      //     : Number(currentMeeting) === 0
                      //     ? true
                      //     : isEditMeeting === false
                      //     ? true
                      //     : false
                      // }
                      text={t("Polls")}
                      className={
                        polls === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={ShowPolls}
                    />
                    {Number(editorRole.status) === 10 &&
                    editorRole.role === "Organizer" &&
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
                    ) : null}{" "}
                  </>
                )}
              </Col>
            </Row>

            {meetingDetails && NewMeetingreducer.meetingDetailsGlobalFlag && (
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
                editorRole={editorRole}
                setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}

            {organizers && NewMeetingreducer.organizersGlobalFlag && (
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
                editorRole={editorRole}
                setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {agendaContributors &&
              NewMeetingreducer.agendaContributorsGlobalFlag && (
                <AgendaContributers
                  setorganizers={setorganizers}
                  setCurrentMeetingID={setCurrentMeetingID}
                  currentMeeting={currentMeeting}
                  setSceduleMeeting={setSceduleMeeting}
                  setAgendaContributors={setAgendaContributors}
                  setParticipants={setParticipants}
                  setEditMeeting={setEditMeeting}
                  isEditMeeting={isEditMeeting}
                  editorRole={editorRole}
                  setEdiorRole={setEdiorRole}
                  setDataroomMapFolderId={setDataroomMapFolderId}
                />
              )}
            {participants && NewMeetingreducer.participantsGlobalFlag && (
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
                editorRole={editorRole}
                setDataroomMapFolderId={setDataroomMapFolderId}
                setEdiorRole={setEdiorRole}
              />
            )}
            {agenda && NewMeetingreducer.agendaGlobalFlag && (
              <Agenda
                setSceduleMeeting={setSceduleMeeting}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                editorRole={editorRole}
                setMeetingMaterial={setMeetingMaterial}
                setAgenda={setAgenda}
                setParticipants={setParticipants}
                dataroomMapFolderId={dataroomMapFolderId}
                setDataroomMapFolderId={setDataroomMapFolderId}
                setEdiorRole={setEdiorRole}
              />
            )}
            {meetingMaterial && NewMeetingreducer.meetingMaterialGlobalFlag && (
              <MeetingMaterial
                setSceduleMeeting={setSceduleMeeting}
                setMeetingMaterial={setMeetingMaterial}
                setMinutes={setMinutes}
                currentMeeting={currentMeeting}
                setactionsPage={setactionsPage}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                editorRole={editorRole}
                setAgenda={setAgenda}
                setDataroomMapFolderId={setDataroomMapFolderId}
                setEdiorRole={setEdiorRole}
              />
            )}
            {minutes && NewMeetingreducer.minutesGlobalFlag && (
              <Minutes
                setMinutes={setMinutes}
                setMeetingMaterial={setMeetingMaterial}
                setSceduleMeeting={setSceduleMeeting}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                editorRole={editorRole}
                setactionsPage={setactionsPage}
                setDataroomMapFolderId={setDataroomMapFolderId}
                setEdiorRole={setEdiorRole}
              />
            )}
            {actionsPage && NewMeetingreducer.actionsGlobalFlag && (
              <Actions
                setMinutes={setMinutes}
                setSceduleMeeting={setSceduleMeeting}
                setPolls={setPolls}
                setactionsPage={setactionsPage}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                editorRole={editorRole}
                dataroomMapFolderId={dataroomMapFolderId}
                setMeetingMaterial={setMeetingMaterial}
                setDataroomMapFolderId={setDataroomMapFolderId}
                setEdiorRole={setEdiorRole}
              />
            )}
            {polls && NewMeetingreducer.pollsGlobalFlag && (
              <Polls
                setSceduleMeeting={setSceduleMeeting}
                setPolls={setPolls}
                setAttendance={setAttendance}
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                editorRole={editorRole}
                setactionsPage={setactionsPage}
                setDataroomMapFolderId={setDataroomMapFolderId}
                setEdiorRole={setEdiorRole}
              />
            )}
            {attendance && NewMeetingreducer.attendanceGlobalFlag && (
              <Attendence
                currentMeeting={currentMeeting}
                setCurrentMeetingID={setCurrentMeetingID}
                setEditMeeting={setEditMeeting}
                isEditMeeting={isEditMeeting}
                editorRole={editorRole}
                setAttendance={setAttendance}
                setPolls={setPolls}
                setSceduleMeeting={setSceduleMeeting}
                setDataroomMapFolderId={setDataroomMapFolderId}
                setEdiorRole={setEdiorRole}
              />
            )}
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default SceduleMeeting;
