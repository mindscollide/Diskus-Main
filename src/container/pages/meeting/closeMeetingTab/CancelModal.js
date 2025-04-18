import React from "react";
import styles from "./CancelModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../components/elements";
import { UploadTextField } from "../../../../components/elements";
import {
  searchNewUserMeeting,
  showCancelModalmeetingDeitals,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
  viewMeetingFlag,
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
import { Col, Row } from "react-bootstrap";

const CancelButtonModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let navigateLocation = localStorage.getItem("navigateLocation");
  const UploadGlobalFlags = useSelector(
    (state) => state.NewMeetingreducer.uploadGlobalFlag
  );
  const cancelModalMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.cancelModalMeetingDetails
  );
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");

  const handleNOFunctionality = () => {
    dispatch(showCancelModalmeetingDeitals(false));
  };

  const handleYesFunctionality = async (event) => {
    if (UploadGlobalFlags === true) {
      dispatch(showCancelModalmeetingDeitals(false));
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
      dispatch(viewMeetingFlag(false));
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
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
      navigate(`/Diskus/Meeting`);
      // Trigger the file input programmatically
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.onchange = handleUploadFile; // Assign the file upload handler
      fileInput.click(); // Click to trigger the file input
    } else {
      dispatch(showCancelModalmeetingDeitals(false));
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
      dispatch(viewMeetingFlag(false));
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
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
      navigate(`/Diskus/${navigateLocation}`);
      if (navigateLocation === "Meeting") {
        if (meetingpageRow !== null && meetingPageCurrent !== null) {
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber: Number(meetingPageCurrent),
            Length: Number(meetingpageRow),
            PublishedMeetings: Number(currentView) === 1 ? true : false,
          };
          dispatch(searchNewUserMeeting(navigate, searchData, t));
        } else {
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber: 1,
            Length: 50,
            PublishedMeetings: Number(currentView) === 1 ? true : false,
          };
          localStorage.setItem("MeetingPageRows", 30);
          localStorage.setItem("MeetingPageCurrent", 1);
          dispatch(searchNewUserMeeting(navigate, searchData, t));
        }
      }
    }
  };

  const handleUploadFile = async ({ file }) => {
    if (UploadGlobalFlags === true) {
      dispatch(showCancelModalmeetingDeitals(false));
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
      dispatch(viewMeetingFlag(false));
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
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
      navigate("/Diskus/dataroom", { state: file });
    } else {
      dispatch(showCancelModalmeetingDeitals(false));
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
      dispatch(viewMeetingFlag(false));
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
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
      navigate(`/Diskus/${navigateLocation}`);
      if (navigateLocation === "Meeting") {
        if (meetingpageRow !== null && meetingPageCurrent !== null) {
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber: Number(meetingPageCurrent),
            Length: Number(meetingpageRow),
            PublishedMeetings: Number(currentView) === 1 ? true : false,
          };
          dispatch(searchNewUserMeeting(navigate, searchData, t));
        } else {
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber: 1,
            Length: 50,
            PublishedMeetings: Number(currentView) === 1 ? true : false,
          };
          localStorage.setItem("MeetingPageRows", 30);
          localStorage.setItem("MeetingPageCurrent", 1);
          dispatch(searchNewUserMeeting(navigate, searchData, t));
        }
      }
    }
  };

  return (
    <section>
      {" "}
      <section>
        <Modal
          show={cancelModalMeetingDetails}
          setShow={dispatch(showCancelModalmeetingDeitals)}
          modalHeaderClassName={"d-block"}
          modalFooterClassName={"d-block"}
          onHide={() => {
            dispatch(showCancelModalmeetingDeitals(false));
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
                  {UploadGlobalFlags === true ? (
                    <UploadTextField
                      title={t("Yes")}
                      handleFileUploadRequest={handleUploadFile}
                      className={styles["No_unsave_File_Upload"]}
                    />
                  ) : (
                    <Button
                      text={t("Yes")}
                      className={styles["No_unsave_File_Upload"]}
                      onClick={handleYesFunctionality}
                    />
                  )}
                </Col>
              </Row>
            </>
          }
        />
      </section>
    </section>
  );
};

export default CancelButtonModal;
