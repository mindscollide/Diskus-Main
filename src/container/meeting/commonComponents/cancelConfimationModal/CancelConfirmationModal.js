import React, { useContext } from "react";
import styles from "./CancelConfirmationModal.module.css";
import { Col, Row } from "react-bootstrap";
import CustomModal from "../../../../components/elements/modal/Modal";
import { MeetingContext } from "../../../../context/MeetingContext";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  listOfMeetingsApi,
  resetCurrentMeetingInfo,
} from "../../../../store/actions/NewMeeting2.actions";
import {
  resetCreateEditTabs,
  toggleCreateEditMeetingModal,
} from "../../../../store/actions/ModalStates_actions";
import { getMeetingByCommitteeIdApi } from "../../../../store/actions/Committee_actions";
const CancelConfirmationModal = () => {
  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails,
  );

  const groupInfo = useSelector(
    (state) => state.GroupsReducer.viewGroupDetails,
  );

  const {
    unSaveChangesModalForMeeting,
    setEditorRole,
    setUnSaveChangesModalForMeeting,
  } = useContext(MeetingContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClickContinue = async () => {
    const navigateLocation = localStorage.getItem("navigateLocation");

    const routeMap = {
      resolution: "/Diskus/resolution",
      dataroom: "/Diskus/dataroom",
      committee: "/Diskus/committee",
      groups: "/Diskus/groups",
      polling: "/Diskus/polling",
      calendar: "/Diskus/calendar",
      todolist: "/Diskus/todolist",
      Notes: "/Diskus/Notes",
      MainDashBoard: "/Diskus/",
    };
    setUnSaveChangesModalForMeeting(false);
    setEditorRole({
      status: null,
      role: null,
      isPrimaryOrganizer: false,
    });
    // ✅ Reset states (only once)
    dispatch(resetCurrentMeetingInfo());
    // dispatch(toggleViewMeetingModal(false));
    // dispatch(resetViewTabs());
    dispatch(toggleCreateEditMeetingModal(false));
    dispatch(resetCreateEditTabs());

    [
      "NotificationAdvanceMeetingID",
      "QuickMeetingCheckNotification",
      "viewadvanceMeetingPolls",
      "NotificationClickPollID",
      "AdvanceMeetingOperations",
      "NotificationClickTaskID",
      "viewadvanceMeetingTask",
    ].forEach((key) => localStorage.removeItem(key));

    // ✅ If route exists → navigate directly
    if (navigateLocation && routeMap[navigateLocation]) {
      navigate(routeMap[navigateLocation]);
      localStorage.removeItem("navigateLocation");
      return;
    }

    if (committeeInfo !== null) {
      return;
    }
    if (groupInfo !== null) {
      return;
    }
    // ✅ Default flow (search meetings)
    const meetingpageRow = Number(
      localStorage.getItem("MeetingPageRows") || 30,
    );
    const meetingPageCurrent = Number(
      localStorage.getItem("MeetingPageCurrent") || 1,
    );
    const userID = Number(localStorage.getItem("userID"));
    const currentView = Number(localStorage.getItem("MeetingCurrentView"));

    await dispatch(
      listOfMeetingsApi(
        navigate,
        t,
        {
          Date: "",
          Title: "",
          HostName: "",
          UserID: userID,
          PageNumber: meetingPageCurrent,
          Length: meetingpageRow,
          PublishedMeetings: currentView === 1,
          ProposedMeetings: currentView === 2,
        },
        "",
        {},
      ),
    );

    // ✅ Clear localStorage keys
  };
  const handleClickDiscard = () => {
    setUnSaveChangesModalForMeeting(false);
  };
  return (
    <CustomModal
      show={unSaveChangesModalForMeeting}
      setShow={setUnSaveChangesModalForMeeting}
      modalFooterClassName={"d-block"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["modalBodyheading"]}>
                {t("Unsave-changes")}
              </span>
            </Col>
          </Row>
          <Row className='mt-2'>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["modalBodyText"]}>
                {t(
                  "You-have-unsaved-changes-if-you-leave-this-page-your-changes-will-be-lost-do-you-want-to-continue-without-saving",
                )}
              </span>
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='d-flex justify-content-end gap-2'>
              <Button
                text={t("Discard")}
                className={styles["No_unsave_File_Upload"]}
                onClick={handleClickDiscard}
              />

              <Button
                text={t("Continue")}
                className={styles["Yes_unsave_File_Upload"]}
                onClick={handleClickContinue}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default CancelConfirmationModal;
