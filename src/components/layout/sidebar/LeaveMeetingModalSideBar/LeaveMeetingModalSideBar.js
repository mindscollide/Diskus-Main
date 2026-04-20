/**
 * @file LeaveMeetingModalSideBar.js
 * @description Confirmation modal shown when a user attempts to navigate away from a
 * meeting sub-page via the sidebar while unsaved changes exist. Provides "Yes" / "No"
 * buttons to confirm or cancel the navigation.
 */
import React from "react";
import styles from "./LeaveMeetingModalSideBar.module.css";
import { Button, Modal } from "../../../elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  LeaveMeetingSideBarModalAction,
  proposeNewMeetingPageFlag,
  scheduleMeetingPageFlag,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewMeetingFlag,
  viewProposeDateMeetingPageFlag,
  viewProposeOrganizerMeetingPageFlag,
} from "../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * LeaveMeetingModalSideBar component.
 *
 * Reads `LeaveMeetingSidebarModal` from the Redux store to control visibility.
 * On confirmation ("Yes") it resets all meeting page-flags and triggers a fresh
 * meeting-search so the user lands on the meeting list.
 *
 * @returns {JSX.Element} A modal dialog warning about unsaved changes.
 */
const LeaveMeetingModalSideBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Pagination context for re-fetching the meeting list after leaving
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  const LeaveMeetingSideBarModalTrigger = useSelector(
    (state) => state.NewMeetingreducer.LeaveMeetingSidebarModal,
  );

  /** Closes the modal without performing any navigation. */
  const handleNOFunctionality = () => {
    dispatch(LeaveMeetingSideBarModalAction(false));
  };

  /**
   * Confirms leaving: resets all meeting page flags, hides the modal, and
   * re-fetches the user's meeting list so the list view is current.
   */
  const handleYesFunctionality = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      // Use stored pagination values or fall back to sensible defaults
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
      // Determine which meeting view tab was active (Published vs Proposed)
      PublishedMeetings:
        localStorage.getItem("MeetingCurrentView") &&
        Number(localStorage.getItem("MeetingCurrentView")) === 1
          ? true
          : false,
      ProposedMeetings:
        localStorage.getItem("MeetingCurrentView") &&
        Number(localStorage.getItem("MeetingCurrentView")) === 2
          ? true
          : false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    dispatch(LeaveMeetingSideBarModalAction(false));
    // Reset all meeting sub-page visibility flags
    dispatch(scheduleMeetingPageFlag(false));
    dispatch(viewProposeDateMeetingPageFlag(false));
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    dispatch(viewProposeOrganizerMeetingPageFlag(false));
    dispatch(proposeNewMeetingPageFlag(false));
    dispatch(viewMeetingFlag(false));
  };
  return (
    <section>
      <Modal
        show={LeaveMeetingSideBarModalTrigger}
        setShow={dispatch(LeaveMeetingSideBarModalAction(true))}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(LeaveMeetingSideBarModalAction(true));
        }}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["UnsaveheadingFileUpload"]}>
                  {t("Any-unsaved-changes-will-be")}
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["UnsaveheadingFileUpload"]}>
                  {t("Lost-continue")}
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
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("No")}
                  className={styles["Yes_unsave_File_Upload"]}
                  onClick={handleNOFunctionality}
                />
                <Button
                  text={t("Yes")}
                  className={styles["No_unsave_File_Upload"]}
                  onClick={handleYesFunctionality}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default LeaveMeetingModalSideBar;
