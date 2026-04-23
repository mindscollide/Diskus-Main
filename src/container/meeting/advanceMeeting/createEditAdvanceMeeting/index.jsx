import React, { useEffect } from "react";
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
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
} from "../../../../store/actions/NewMeetingActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkFeatureIDAvailability } from "../../../../commen/functions/utils";
import { useMeetingContext } from "../../../../context/MeetingContext";

// Fix: import Redux tab actions
import { setCreateEditTab } from "../../../../store/actions/ModalStates_actions";
import { getMeetingDetailsByMeetingIdApi } from "../../../../store/actions/NewMeeting2.actions";
import { resetViewCommitteeDetails } from "../../../../store/actions/Committee_actions";
import { resetViewGroupDetails } from "../../../../store/actions/Groups_actions";
const CreateEditAdvanceMeeting = ({ route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ─── Redux State ──────────────────────────────────────────────────────────

  const { NewMeetingreducer } = useSelector((state) => state);

  const isCreateEditMeetingModal = useSelector(
    (state) => state.ModalStatesReducer.isCreateEditMeetingModal,
  );
  const isAdvanceMeetingRoute = useSelector(
    (state) => state.ModalStatesReducer.isAdvanceMeetingRoute,
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes,
  );
  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails,
  );

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails,
  );

  console.log(committeeInfo, "committeeInfo");
  console.log(groupInfo, "committeeInfo");

  // Fix: read all tab states from Redux MeetingModalsReducer instead of
  // individual NewMeetingreducer global flags
  const {
    meetingDetails: createEditMeetingDetailsTab,
    organizers: createEditOrganizersTab,
    agendaContributors: createEditAgendaContributorsTab,
    participants: createEditParticipantsTab,
    agenda: createEditAgendaTab,
    meetingMaterial: createEditMeetingMaterialTab,
    minutes: createEditMinutesTab,
    actionsPage: createEditActionsPageTab,
    polls: createEditPollsTab,
    attendance: createEditAttendanceTab,
  } = useSelector((state) => state.ModalStatesReducer.createEditTabs);

  // ─── Context ──────────────────────────────────────────────────────────────

  const { editorRole, setEditorRole, currentMeeting } = useMeetingContext();

  const { meetingID = 0 } = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingInfo,
  );

  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let userID = localStorage.getItem("userID");

  // ─── On Mount: API Calls ──────────────────────────────────────────────────

  const apiCallsForComponentMound = async () => {
    try {
      if (
        getALlMeetingTypes.length === 0 &&
        Object.keys(getALlMeetingTypes).length === 0
      ) {
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
      }
      await dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
      await dispatch(GetAllMeetingRecurringApiNew(navigate, t, false));
    } catch (error) {
      console.error("An error occurred during API calls:", error);
    }
  };

  useEffect(() => {
    if (meetingID === 0) {
      apiCallsForComponentMound();
    }
    return () => {
      dispatch(resetViewGroupDetails());
      dispatch(resetViewCommitteeDetails());
      setEditorRole({ status: null, role: null, isPrimaryOrganizer: false });
    };
  }, []);

  // ─── Tab Switchers ────────────────────────────────────────────────────────
  // Fix: each handler replaced with single dispatch instead of 10-12 flag dispatches

  const showMeetingDeitals = () => {
    // Fix: meeting details tab also fetches latest data if meeting exists
    if (meetingID !== 0) {
      dispatch(
        getMeetingDetailsByMeetingIdApi(
          navigate,
          t,
          { MeetingID: Number(meetingID) },
          "viewDetail",
          {},
        ),
      );
    }
    dispatch(setCreateEditTab("meetingDetails"));
  };

  const showOrganizers = () => dispatch(setCreateEditTab("organizers"));
  const showAgendaContributers = () =>
    dispatch(setCreateEditTab("agendaContributors"));
  const showParticipants = () => dispatch(setCreateEditTab("participants"));
  const showAgenda = () => dispatch(setCreateEditTab("agenda"));
  const showMeetingMaterial = () =>
    dispatch(setCreateEditTab("meetingMaterial"));
  const showMinutes = () => dispatch(setCreateEditTab("minutes"));
  const showActions = () => dispatch(setCreateEditTab("actionsPage"));
  const ShowPolls = () => dispatch(setCreateEditTab("polls"));
  const showAttendance = () => dispatch(setCreateEditTab("attendance"));

  // ─── MQTT: Meeting AC Removed ─────────────────────────────────────────────

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
          localStorage.removeItem("folderDataRoomMeeting");
          dispatch(
            searchNewUserMeeting(
              navigate,
              {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber:
                  meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
                Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
                PublishedMeetings:
                  Number(localStorage.getItem("MeetingCurrentView")) === 1,
                ProposedMeetings:
                  Number(localStorage.getItem("MeetingCurrentView")) === 2,
              },
              t,
            ),
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [NewMeetingreducer.mqttMeetingAcRemoved]);

  // ─── MQTT: Meeting Org Removed ────────────────────────────────────────────

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
          localStorage.removeItem("folderDataRoomMeeting");
          dispatch(
            searchNewUserMeeting(
              navigate,
              {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber:
                  meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
                Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
                PublishedMeetings:
                  Number(localStorage.getItem("MeetingCurrentView")) === 1,
                ProposedMeetings:
                  Number(localStorage.getItem("MeetingCurrentView")) === 2,
              },
              t,
            ),
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [NewMeetingreducer.mqttMeetingOrgRemoved]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {isCreateEditMeetingModal && (
            <span className={styles["Scedule_newMeeting_Heading"]}>
              {isAdvanceMeetingRoute === 1
                ? committeeInfo !== null
                  ? t("Schedule-new-committee-meeting")
                  : groupInfo !== null
                    ? t("Schedule-new-group-meeting")
                    : t("Schedule-new-meeting")
                : isAdvanceMeetingRoute === 2
                  ? t("Edit-meeting")
                  : null}
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
                    createEditMeetingDetailsTab
                      ? styles["Schedule_meetings_options_active"]
                      : styles["Schedule_meetings_options"]
                  }
                  onClick={showMeetingDeitals}
                />

                {meetingID !== 0 && (
                  <>
                    {editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Organizers")}
                        className={
                          createEditOrganizersTab
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showOrganizers}
                      />
                    )}

                    {editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Agenda-contributors")}
                        className={
                          createEditAgendaContributorsTab
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showAgendaContributers}
                      />
                    )}

                    {editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Participants")}
                        className={
                          createEditParticipantsTab
                            ? styles["Schedule_meetings_options_active"]
                            : styles["Schedule_meetings_options"]
                        }
                        onClick={showParticipants}
                      />
                    )}

                    <Button
                      text={t("Agenda-builder")}
                      className={
                        createEditAgendaTab
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showAgenda}
                    />

                    <Button
                      text={t("Meeting-material")}
                      className={
                        createEditMeetingMaterialTab
                          ? styles["Schedule_meetings_options_active"]
                          : styles["Schedule_meetings_options"]
                      }
                      onClick={showMeetingMaterial}
                    />

                    {editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Minutes")}
                        className={
                          createEditMinutesTab
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
                      />
                    )}

                    {checkFeatureIDAvailability(14) && (
                      <Button
                        text={t("Task")}
                        className={
                          createEditActionsPageTab
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

                    {checkFeatureIDAvailability(15) && (
                      <Button
                        text={t("Polls")}
                        className={
                          createEditPollsTab
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
                    )}

                    {Number(editorRole.status) === 10 &&
                      editorRole.role === "Organizer" && (
                        <Button
                          text={t("Attendence")}
                          className={
                            createEditAttendanceTab
                              ? styles["Schedule_meetings_options_active"]
                              : styles["Schedule_meetings_options"]
                          }
                          onClick={showAttendance}
                          // Fix: original had disableBtn={meetingID !== 0 ? true : false}
                          // which always disabled the button when meetingID exists — corrected to false
                          disableBtn={false}
                        />
                      )}
                  </>
                )}
              </Col>
            </Row>

            {createEditMeetingDetailsTab && <MeetingDetails />}
            {createEditOrganizersTab && <Organizers />}
            {createEditAgendaContributorsTab && <AgendaContributers />}
            {createEditParticipantsTab && <Participants />}
            {createEditAgendaTab && <Agenda />}
            {createEditMeetingMaterialTab && <MeetingMaterial />}
            {createEditMinutesTab && <Minutes />}
            {createEditActionsPageTab && <Actions />}
            {createEditPollsTab && <Polls />}
            {createEditAttendanceTab && <Attendence />}
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default CreateEditAdvanceMeeting;
