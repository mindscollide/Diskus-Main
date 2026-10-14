import React from "react";
import styles from "./UnsavedActions.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../components/elements";
import { showUnsavedActionsModal } from "../../../../../../store/actions/NewMeetingActions";
import { getMeetingTaskMainApi } from "../../../../../../store/actions/Action_Meeting";

const UnsavedActions = ({ setCreateaTask, currentMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unsavedActions = useSelector(
    (state) => state.NewMeetingreducer.unsavedActions
  );
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");

  const handleNoFunctionlity = () => {
    dispatch(showUnsavedActionsModal(false));
  };

  const handleYesFunctionality = () => {
    setCreateaTask(false);
    let meetingTaskData = {
      MeetingID: Number(currentMeeting),
      Date: "",
      Title: "",
      AssignedToName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
    };
    dispatch(getMeetingTaskMainApi(navigate, t, meetingTaskData));
  };

  return (
    <section>
      <Modal
        show={unsavedActions}
        setShow={dispatch(showUnsavedActionsModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showUnsavedActionsModal(false));
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
                  onClick={handleNoFunctionlity}
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

export default UnsavedActions;
