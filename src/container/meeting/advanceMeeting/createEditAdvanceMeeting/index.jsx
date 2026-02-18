import React, { useState, useEffect, useContext } from "react";
import styles from "./SceduleMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
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
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
} from "../../../../store/actions/NewMeetingActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkFeatureIDAvailability } from "../../../../commen/functions/utils";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../context/MeetingContext";
import { useNewMeetingContext } from "../../../../context/NewMeetingContext";
const CreateEditAdvanceMeeting = (
  {
    //   setEditMeeting,
    //   isEditMeeting,
    //   setCurrentMeetingID,
    //   currentMeeting,
    //   setSceduleMeeting,
    //   setDataroomMapFolderId,
    //   dataroomMapFolderId,
  },
) => {
  const { t } = useTranslation();
  const { NewMeetingreducer } = useSelector((state) => state);

  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes,
  );
  const { editorRole, setEditorRole, setCurrentMeetingID, currentMeeting } =
    useMeetingContext();
  const { createdMeetingInfo, setCreatedMeetingInfo } = useNewMeetingContext();
  //   const [meetingDetails, setmeetingDetails] = useState(
  //     editorRole.role === "Agenda Contributor" ? false : true,
  //   );
  //   const [organizers, setorganizers] = useState(false);
  //   const [agendaContributors, setAgendaContributors] = useState(false);
  //   const [participants, setParticipants] = useState(false);
  //   const [agenda, setAgenda] = useState(
  //     editorRole.role === "Agenda Contributor" ? true : false,
  //   );
  //   const [meetingMaterial, setMeetingMaterial] = useState(false);
  //   const [minutes, setMinutes] = useState(false);
  //   const [proposedMeetingDates, setProposedMeetingDates] = useState(false);
  //   const [actionsPage, setactionsPage] = useState(false);
  //   const [polls, setPolls] = useState(false);
  //   const [attendance, setAttendance] = useState(false);

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let userID = localStorage.getItem("userID");

  const createEditMeetingDetailsTab = useSelector(
    (state) => state.NewMeetingreducer.meetingDetailsGlobalFlag,
  );
  const createEditOrganizersTab = useSelector(
    (state) => state.NewMeetingreducer.organizersGlobalFlag,
  );
  const createEditAgendaContributorsTab = useSelector(
    (state) => state.NewMeetingreducer.agendaContributorsGlobalFlag,
  );
  const createEditParticipantsTab = useSelector(
    (state) => state.NewMeetingreducer.participantsGlobalFlag,
  );
  const createEditAgendaTab = useSelector(
    (state) => state.NewMeetingreducer.agendaGlobalFlag,
  );
  const createEditMeetingMaterialTab = useSelector(
    (state) => state.NewMeetingreducer.meetingMaterialGlobalFlag,
  );
  const createEditMinutesTab = useSelector(
    (state) => state.NewMeetingreducer.minutesGlobalFlag,
  );
  const createEditProposedMeetingDatesTab = useSelector(
    (state) => state.NewMeetingreducer.proposedMeetingDatesGlobalFlag,
  );
  const createEditActionsPageTab = useSelector(
    (state) => state.NewMeetingreducer.actionsGlobalFlag,
  );
  const createEditPollsTab = useSelector(
    (state) => state.NewMeetingreducer.pollsGlobalFlag,
  );
  const createEditAttendanceTab = useSelector(
    (state) => state.NewMeetingreducer.attendanceGlobalFlag,
  );
  const createEditUploadTab = useSelector(
    (state) => state.NewMeetingreducer.uploadGlobalFlag,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiCallsForComponentMound = async () => {
    try {
      // // Meeting Type Drop Down API
      if (
        getALlMeetingTypes.length === 0 &&
        Object.keys(getALlMeetingTypes).length === 0
      ) {
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
      }
      // Reminder Frequency Drop Down API
      await dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
      // Recurring Drop Down API
      await dispatch(GetAllMeetingRecurringApiNew(navigate, t, false));
    } catch (error) {
      console.error("An error occurred during API calls:", error);
    }
  };
  useEffect(() => {
    if (createdMeetingInfo.meetingId === 0) {
      apiCallsForComponentMound();
    }
    return () => {
      setEditorRole({ status: null, role: null, isPrimaryOrganizer: false });
    };
  }, []);

  const showMeetingDeitals = () => {
    let Data = {
      MeetingID: Number(createdMeetingInfo.meetingId),
    };
    if (Data.MeetingID !== 0) {
      dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          true,
          setCurrentMeetingID,
          //   setSceduleMeeting,
          setCreatedMeetingInfo,
          0,
          1,
          false,
        ),
      );

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

  useEffect(() => {
    if (
      NewMeetingreducer.mqttMeetingAcRemoved !== null &&
      NewMeetingreducer.mqttMeetingAcRemoved !== undefined
    ) {
      try {
        const { pK_MDID } = NewMeetingreducer.mqttMeetingAcRemoved;
        if (Number(pK_MDID) === Number(currentMeeting)) {
          dispatch(scheduleMeetingPageFlag(false));
          setEditorRole({
            status: null,
            role: null,
            isPrimaryOrganizer: false,
          });

          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber:
              meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
            Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
            PublishedMeetings:
              Number(localStorage.getItem("MeetingCurrentView")) === 1
                ? true
                : false,
            ProposedMeetings:
              Number(localStorage.getItem("MeetingCurrentView")) === 2
                ? true
                : false,
          };
          localStorage.removeItem("folderDataRoomMeeting");

          console.log("chek search meeting");
          dispatch(searchNewUserMeeting(navigate, searchData, t));
        }
      } catch (error) {
        console.error(error, "error");
      }
    }
  }, [NewMeetingreducer.mqttMeetingAcRemoved]);
  console.log({ NewMeetingreducer, currentMeeting }, "NewMeetingreducer");
  useEffect(() => {
    if (
      NewMeetingreducer.mqttMeetingOrgRemoved !== null &&
      NewMeetingreducer.mqttMeetingOrgRemoved !== undefined
    ) {
      try {
        const { pK_MDID } = NewMeetingreducer.mqttMeetingOrgRemoved;
        if (Number(pK_MDID) === Number(currentMeeting)) {
          dispatch(scheduleMeetingPageFlag(false));
          setEditorRole({
            status: null,
            role: null,
            isPrimaryOrganizer: false,
          });

          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber:
              meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
            Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
            PublishedMeetings:
              Number(localStorage.getItem("MeetingCurrentView")) === 1
                ? true
                : false,
            ProposedMeetings:
              Number(localStorage.getItem("MeetingCurrentView")) === 2
                ? true
                : false,
          };
          localStorage.removeItem("folderDataRoomMeeting");

          console.log("chek search meeting");
          dispatch(searchNewUserMeeting(navigate, searchData, t));
        }
      } catch (error) {
        console.error(error, "error");
      }
    }
  }, [NewMeetingreducer.mqttMeetingOrgRemoved]);

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {createdMeetingInfo.meetingId !== 0 ? (
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
          <span className={styles["Scedule_meeting_paper"]}>
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
                    createEditMeetingDetailsTab === true
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showMeetingDeitals}
                />
                {createdMeetingInfo.meetingId !== 0 && (
                  <>
                    {" "}
                    {editorRole.role === "Agenda Contributor" ? null : (
                      <Button
                        disableBtn={
                          createdMeetingInfo.meetingId !== 0 ? true : false
                        }
                        text={t("Organizers")}
                        className={
                          createEditOrganizersTab === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showOrganizers}
                      />
                    )}
                    {editorRole.role === "Agenda Contributor" ? null : (
                      <Button
                        disableBtn={
                          createdMeetingInfo.meetingId !== 0 ? true : false
                        }
                        text={t("Agenda-contributors")}
                        className={
                          createEditAgendaContributorsTab === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showAgendaContributers}
                      />
                    )}
                    {editorRole.role === "Agenda Contributor" ? null : (
                      <Button
                        disableBtn={
                          createdMeetingInfo.meetingId !== 0 ? true : false
                        }
                        text={t("Participants")}
                        className={
                          createEditParticipantsTab === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showParticipants}
                      />
                    )}
                    <Button
                      disableBtn={
                        createdMeetingInfo.meetingId !== 0 ? true : false
                      }
                      text={t("Agenda-builder")}
                      className={
                        createEditAgendaTab === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAgenda}
                    />
                    <Button
                      disableBtn={
                        createdMeetingInfo.meetingId !== 0 ? true : false
                      }
                      text={t("Meeting-materials")}
                      className={
                        createEditMeetingMaterialTab === true
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showMeetingMaterial}
                    />
                    {editorRole.role === "Agenda Contributor" ? null : (
                      <Button
                        disableBtn={
                          Number(editorRole.status) === 10 ||
                          Number(editorRole.status) === 9
                            ? false
                            : true
                        }
                        text={t("Minutes")}
                        className={
                          createEditMinutesTab === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showMinutes}
                      />
                    )}
                    {checkFeatureIDAvailability(14) ? (
                      <Button
                        disableBtn={
                          Number(editorRole.status) === 10 ||
                          Number(editorRole.status) === 9
                            ? false
                            : true
                        }
                        text={t("Task")}
                        className={
                          createEditActionsPageTab === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showActions}
                      />
                    ) : null}
                    {checkFeatureIDAvailability(15) ? (
                      <Button
                        disableBtn={
                          Number(editorRole.status) === 10 ||
                          Number(editorRole.status) === 9
                            ? false
                            : true
                        }
                        text={t("Polls")}
                        className={
                          createEditPollsTab === true
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={ShowPolls}
                      />
                    ) : null}
                    {Number(editorRole.status) === 10 &&
                    editorRole.role === "Organizer" &&
                    createdMeetingInfo.meetingId !== 0 ? (
                      <Button
                        disableBtn={
                          createdMeetingInfo.meetingId !== 0 ? true : false
                        }
                        text={t("Attendence")}
                        className={
                          createEditAttendanceTab === true
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

            {createEditMeetingDetailsTab && (
              <MeetingDetails
              // setorganizers={setorganizers}
              // setmeetingDetails={setmeetingDetails}
              // setSceduleMeeting={setSceduleMeeting}
              // setAgendaContributors={setAgendaContributors}
              // setParticipants={setParticipants}
              // setAgenda={setAgenda}
              // setMinutes={setMinutes}
              // setactionsPage={setactionsPage}
              // setAttendance={setAttendance}
              // setPolls={setPolls}
              // setMeetingMaterial={setMeetingMaterial}
              // setCurrentMeetingID={setCurrentMeetingID}
              // currentMeeting={currentMeeting}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}

            {createEditOrganizersTab && (
              <Organizers
              // setorganizers={setorganizers}
              // setmeetingDetails={setmeetingDetails}
              // setSceduleMeeting={setSceduleMeeting}
              // setAgendaContributors={setAgendaContributors}
              // setParticipants={setParticipants}
              // setAgenda={setAgenda}
              // setMinutes={setMinutes}
              // setactionsPage={setactionsPage}
              // setAttendance={setAttendance}
              // setPolls={setPolls}
              // setMeetingMaterial={setMeetingMaterial}
              // currentMeeting={currentMeeting}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditAgendaContributorsTab && (
              <AgendaContributers
              //   setorganizers={setorganizers}
              //   setCurrentMeetingID={setCurrentMeetingID}
              //   currentMeeting={currentMeeting}
              //   setSceduleMeeting={setSceduleMeeting}
              //   setAgendaContributors={setAgendaContributors}
              //   setParticipants={setParticipants}
              //   setEditMeeting={setEditMeeting}
              //   isEditMeeting={isEditMeeting}
              //   editorRole={editorRole}
              //   setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditParticipantsTab && (
              <Participants
              // setParticipants={setParticipants}
              // setAgenda={setAgenda}
              // proposedMeetingDates={proposedMeetingDates}
              // setSceduleMeeting={setSceduleMeeting}
              // currentMeeting={currentMeeting}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setAgendaContributors={setAgendaContributors}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditAgendaTab && (
              <Agenda
              // setSceduleMeeting={setSceduleMeeting}
              // currentMeeting={currentMeeting}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setMeetingMaterial={setMeetingMaterial}
              // setAgenda={setAgenda}
              // setParticipants={setParticipants}
              // dataroomMapFolderId={dataroomMapFolderId}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditMeetingMaterialTab && (
              <MeetingMaterial
              // setSceduleMeeting={setSceduleMeeting}
              // setMeetingMaterial={setMeetingMaterial}
              // setMinutes={setMinutes}
              // currentMeeting={currentMeeting}
              // setactionsPage={setactionsPage}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setAgenda={setAgenda}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditMinutesTab && (
              <Minutes
              // setMinutes={setMinutes}
              // setMeetingMaterial={setMeetingMaterial}
              // setSceduleMeeting={setSceduleMeeting}
              // currentMeeting={currentMeeting}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setactionsPage={setactionsPage}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditActionsPageTab && (
              <Actions
              // setMinutes={setMinutes}
              // setSceduleMeeting={setSceduleMeeting}
              // setPolls={setPolls}
              // setactionsPage={setactionsPage}
              // currentMeeting={currentMeeting}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // dataroomMapFolderId={dataroomMapFolderId}
              // setMeetingMaterial={setMeetingMaterial}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditPollsTab && (
              <Polls
              // setSceduleMeeting={setSceduleMeeting}
              // setPolls={setPolls}
              // setAttendance={setAttendance}
              // currentMeeting={currentMeeting}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setactionsPage={setactionsPage}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
            {createEditAttendanceTab && (
              <Attendence
              // currentMeeting={currentMeeting}
              // setCurrentMeetingID={setCurrentMeetingID}
              // setEditMeeting={setEditMeeting}
              // isEditMeeting={isEditMeeting}
              // editorRole={editorRole}
              // setAttendance={setAttendance}
              // setPolls={setPolls}
              // setSceduleMeeting={setSceduleMeeting}
              // setDataroomMapFolderId={setDataroomMapFolderId}
              />
            )}
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default CreateEditAdvanceMeeting;
