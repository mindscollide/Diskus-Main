import React from "react";
import styles from "./EditDeletePollConfirm.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../components/elements";
import { deleteMeetingPollApi } from "../../../../../../store/actions/Polls_actions";
import { editFlowDeleteSavedPollsMeeting } from "../../../../../../store/actions/NewMeetingActions";

const EditDeletePollConfirm = ({ currentMeeting, pollID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editFlowDeletePollsMeeting = useSelector(
    (state) => state.NewMeetingreducer.editFlowDeletePollsMeeting
  );

  const handleNOFunctionality = () => {
    dispatch(editFlowDeleteSavedPollsMeeting(false));
  };

  const handleYesFunctionality = () => {
    let data = {
      PollID: Number(pollID),
      MeetingID: parseInt(currentMeeting),
    };
    dispatch(deleteMeetingPollApi(navigate, t, data, currentMeeting));
    dispatch(editFlowDeleteSavedPollsMeeting(false));
  };
  return (
    <Modal
      show={editFlowDeletePollsMeeting}
      setShow={dispatch(editFlowDeleteSavedPollsMeeting)}
      modalHeaderClassName={"d-block"}
      modalFooterClassName={"d-block"}
      onHide={() => {
        dispatch(editFlowDeleteSavedPollsMeeting(false));
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
                {t("Are-you-sure-you-want-to-delete-Poll")}
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
  );
};

export default EditDeletePollConfirm;
