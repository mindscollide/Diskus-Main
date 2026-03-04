import React, { useEffect, useContext, useCallback } from "react";
import styles from "./SceduleMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";
import {
  GetAllMeetingDetailsApiFunc,
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  showCancelModalAgenda,
  setActiveCreateAndEditMeetingTab,
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../store/actions/NewMeetingActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkFeatureIDAvailability } from "../../../../commen/functions/utils";
import { MeetingContext } from "../../../../context/MeetingContext";
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

const SceduleMeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editorRole, setEditorRole } = useContext(MeetingContext);

  const { activeMeetingTab, getALlMeetingTypes } = useSelector(
    (state) => state.NewMeetingreducer,
  );
  const { meetingID = 0 } = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingInfo,
  );
  // ===============================
  // API CALLS
  // ===============================
  useEffect(() => {
    const loadInitialApis = async () => {
      if (!getALlMeetingTypes?.length) {
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
      }

      dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
      dispatch(GetAllMeetingRecurringApiNew(navigate, t, false));
    };

    if (meetingID === 0) {
      loadInitialApis();
    }

    return () => {
      setEditMeeting(false);
      setEditorRole({ status: null, role: null, isPrimaryOrganizer: false });
      setCurrentMeetingID(0);
    };
  }, []);

  // ===============================
  // CENTRAL TAB HANDLER
  // ===============================
  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "details" && Number(meetingID) !== 0) {
        dispatch(
          GetAllMeetingDetailsApiFunc(
            navigate,
            t,
            { MeetingID: Number(meetingID) },
            true,
            setCurrentMeetingID,
            setSceduleMeeting,
            setDataroomMapFolderId,
            0,
            1,
            false,
          ),
        );
      }

      if (tab === "agenda") {
        dispatch(showCancelModalAgenda(false));
      }

      dispatch(setActiveCreateAndEditMeetingTab(tab));
    },
    [meetingID],
  );

  // ===============================
  // BUTTON STYLE HELPER
  // ===============================
  const getBtnClass = (tab) =>
    activeMeetingTab === tab
      ? styles["Schedule_meetings_options_active"]
      : styles["Schedule_meetings_options"];

  return (
    <section>
      <Row className="mt-2">
        <Col lg={12}>
          <span className={styles["Scedule_newMeeting_Heading"]}>
            {isEditMeeting ? t("Edit-meeting") : t("Schedule-new-meeting")}
          </span>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mb-4">
          <span className={styles["Scedule_meeting_paper"]}>
            <Row>
              <Col className="py-2 d-flex gap-2 flex-wrap">
                <Button
                  text={t("Meeting-details")}
                  className={getBtnClass("details")}
                  onClick={() => handleTabChange("details")}
                />

                {Number(currentMeeting) !== 0 && (
                  <>
                    {editorRole.role !== "Agenda Contributor" && (
                      <>
                        <Button
                          text={t("Organizers")}
                          className={getBtnClass("organizers")}
                          onClick={() => handleTabChange("organizers")}
                        />

                        <Button
                          text={t("Agenda-contributors")}
                          className={getBtnClass("contributors")}
                          onClick={() => handleTabChange("contributors")}
                        />

                        <Button
                          text={t("Participants")}
                          className={getBtnClass("participants")}
                          onClick={() => handleTabChange("participants")}
                        />
                      </>
                    )}

                    <Button
                      text={t("Agenda-builder")}
                      className={getBtnClass("agenda")}
                      onClick={() => handleTabChange("agenda")}
                    />

                    <Button
                      text={t("Agenda-viewer")}
                      className={getBtnClass("material")}
                      onClick={() => handleTabChange("material")}
                    />

                    {editorRole.role !== "Agenda Contributor" && (
                      <Button
                        text={t("Minutes")}
                        className={getBtnClass("minutes")}
                        onClick={() => handleTabChange("minutes")}
                      />
                    )}

                    {checkFeatureIDAvailability(14) && (
                      <Button
                        text={t("Task")}
                        className={getBtnClass("actions")}
                        onClick={() => handleTabChange("actions")}
                      />
                    )}

                    {checkFeatureIDAvailability(15) && (
                      <Button
                        text={t("Polls")}
                        className={getBtnClass("polls")}
                        onClick={() => handleTabChange("polls")}
                      />
                    )}

                    {editorRole.status === 10 &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting && (
                        <Button
                          text={t("Attendence")}
                          className={getBtnClass("attendance")}
                          onClick={() => handleTabChange("attendance")}
                        />
                      )}
                  </>
                )}
              </Col>
            </Row>

            {/* ================= TAB RENDERING ================= */}

            {activeMeetingTab === "details" && <MeetingDetails />}
            {activeMeetingTab === "organizers" && <Organizers />}
            {activeMeetingTab === "contributors" && <AgendaContributers />}
            {activeMeetingTab === "participants" && <Participants />}
            {activeMeetingTab === "agenda" && <Agenda />}
            {activeMeetingTab === "material" && <MeetingMaterial />}
            {activeMeetingTab === "minutes" && <Minutes />}
            {activeMeetingTab === "actions" && <Actions />}
            {activeMeetingTab === "polls" && <Polls />}
            {activeMeetingTab === "attendance" && <Attendence />}
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default React.memo(SceduleMeeting);
