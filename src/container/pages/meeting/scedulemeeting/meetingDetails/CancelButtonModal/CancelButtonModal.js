import React from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import {
  searchNewUserMeeting,
  showCancelModalmeetingDeitals,
  showGetAllMeetingDetialsFailed,
} from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
const CancelButtonModal = ({
  setSceduleMeeting,
  setMeetingDetails,
  setRows,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  const handleNOFunctionality = () => {
    dispatch(showCancelModalmeetingDeitals(false));
  };

  const handleYesFunctionality = () => {
 
  };

  return (
    <section>
      {" "}
      <section>
        <Modal
          show={NewMeetingreducer.cancelModalMeetingDetails}
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
                    {t("You-have-unsaved-changes-if-you-leave-this-page-your-changes-will-be-lost-do-you-want-to-continue-without-saving")}
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
    </section>
  );
};

export default CancelButtonModal;
