import React from "react";
import { Modal, Button } from "../../../../../../components/elements";
import styles from "./UnsavedMinutes.module.css";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import {
  searchNewUserMeeting,
  showUnsaveMinutesFileUpload,
} from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const UnsavedMinutes = ({
  setMinutes,
  setSceduleMeeting,
  setFileAttachments,
  useCase,
  setactionsPage,
  setMeetingMaterial,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  const handleYesFunctionality = () => {
    console.log(useCase, "useCaseuseCaseuseCase");
    if (useCase) {
      if (useCase === 1) {
        // Pervious Button
        setMinutes(false);
        setMeetingMaterial(true);
        dispatch(showUnsaveMinutesFileUpload(false));
      } else if (useCase === 2) {
        // Next Tab
        setactionsPage(true);
        setMinutes(false);
        dispatch(showUnsaveMinutesFileUpload(false));
      } else if (useCase === 3) {
        // Cancel Button
        setMinutes(false);
        setSceduleMeeting(false);
        dispatch(showUnsaveMinutesFileUpload(false));
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber:
            meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        console.log("chek search meeting")
        dispatch(searchNewUserMeeting(navigate, searchData, t));
        setFileAttachments([]);
      }
    }
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.unsaveFileUploadMinutes}
        setShow={dispatch(showUnsaveMinutesFileUpload)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showUnsaveMinutesFileUpload(false));
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
                  onClick={() => dispatch(showUnsaveMinutesFileUpload(false))}
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

export default UnsavedMinutes;
