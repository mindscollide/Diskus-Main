import React, { useContext } from "react";
import styles from "./CancelConfirmationModal.module.css";
import { Col, Modal, Row } from "react-bootstrap";
import CustomModal from "../../../../components/elements/modal/Modal";
import { MeetingContext } from "../../../../context/MeetingContext";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";
import {
  LeaveCurrentMeeting,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../store/actions/NewMeetingActions";
import { getCurrentDateTimeUTC } from "../../../../commen/functions/date_formater";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const CancelConfirmationModal = () => {
  const {
    cancelConfirmationModal,
    setCancelConfirmationModal,
    setEditorRole,
    setAdvanceMeetingModalID,
    setViewAdvanceMeetingModal,
  } = useContext(MeetingContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows") || 30;
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent") || 1;
  let userID = localStorage.getItem("userID");

  const handleClickContinue = async () => {
    setCancelConfirmationModal(false);

    if (localStorage.getItem("navigateLocation") === "resolution") {
      navigate("/Diskus/resolution");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "dataroom") {
      navigate("/Diskus/dataroom");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "committee") {
      navigate("/Diskus/committee");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "groups") {
      navigate("/Diskus/groups");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "polling") {
      navigate("/Diskus/polling");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "polling") {
      navigate("/Diskus/polling");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "calendar") {
      navigate("/Diskus/calendar");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "todolist") {
      navigate("/Diskus/todolist");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "Notes") {
      navigate("/Diskus/Notes");
      localStorage.removeItem("navigateLocation");
    } else if (localStorage.getItem("navigateLocation") === "MainDashBoard") {
      navigate("/Diskus/");
      
      localStorage.removeItem("navigateLocation");
    } else {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber: Number(meetingPageCurrent),
        Length: Number(meetingpageRow),
        PublishedMeetings:
          currentView && Number(currentView) === 1 ? true : false,
      };
      
      await dispatch(searchNewUserMeeting(navigate, searchData, t));
      localStorage.removeItem("folderDataRoomMeeting");
      setEditorRole({ status: null, role: null, isPrimaryOrganizer: false });
      setAdvanceMeetingModalID(null);
      setAdvanceMeetingModalID(0);
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));

      localStorage.removeItem("NotificationAdvanceMeetingID");
      localStorage.removeItem("QuickMeetingCheckNotification");
      localStorage.removeItem("viewadvanceMeetingPolls");
      localStorage.removeItem("NotificationClickPollID");
      localStorage.removeItem("AdvanceMeetingOperations");
      localStorage.removeItem("NotificationClickTaskID");
      localStorage.removeItem("viewadvanceMeetingTask");
    }
  };
  const handleClickDiscard = () => {
    setCancelConfirmationModal(false);
  };
  return (
    <CustomModal
      show={cancelConfirmationModal}
      setShow={setCancelConfirmationModal}
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
          <Row className="mt-2">
            <Col sm={12} md={12} lg={12}>
              <span className={styles["modalBodyText"]}>
                {t(
                  "You-have-unsaved-changes-if-you-leave-this-page-your-changes-will-be-lost-do-you-want-to-continue-without-saving"
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
              className="d-flex justify-content-end gap-2"
            >
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
