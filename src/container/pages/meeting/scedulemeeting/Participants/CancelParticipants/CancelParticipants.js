import React from "react";
import styles from "./CancelPartipants.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import {
  searchNewUserMeeting,
  showCancelModalPartipants,
} from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";

export const CancelParticipants = ({ setSceduleMeeting, setrspvRows }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cancelPartipants = useSelector(
    (state) => state.NewMeetingreducer.cancelPartipants
  );
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");
  const handleNOFunctionality = () => {
    dispatch(showCancelModalPartipants(false));
  };

  const handleYesFunctionality = () => {
    setrspvRows([]);
    dispatch(showCancelModalPartipants(false));
    setSceduleMeeting(false);
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));
  };
  return (
    <section>
      <Modal
        show={cancelPartipants}
        setShow={dispatch(showCancelModalPartipants)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showCancelModalPartipants(false));
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
