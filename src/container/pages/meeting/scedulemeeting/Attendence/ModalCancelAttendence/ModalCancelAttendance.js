import React from "react";
import styles from "./ModalCancelAttendance.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  searchNewUserMeeting,
  showAttendanceConfirmationModal,
} from "../../../../../../store/actions/NewMeetingActions";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const ModalCancelAttendance = ({
  setAttendance,
  setSceduleMeeting,
  useCase,
  setPolls,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");

  const handleNOFunctionality = () => {
    dispatch(showAttendanceConfirmationModal(false));
  };

  const handleYesFunctionality = () => {
    dispatch(showAttendanceConfirmationModal(false));
    if (useCase) {
      if (Number(useCase) === 1) {
        setAttendance(false);
        setPolls(true);
      } else {
        setAttendance(false);
        setSceduleMeeting(false);
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
      }
    }
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.attendanceConfirmationModal}
        setShow={dispatch(showAttendanceConfirmationModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAttendanceConfirmationModal(false));
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

export default ModalCancelAttendance;
