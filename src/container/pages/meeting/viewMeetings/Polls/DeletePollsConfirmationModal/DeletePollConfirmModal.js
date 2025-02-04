import React from "react";
import styles from "./DeletePollConfirm.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../components/elements";
import { deleteSavedPollsMeeting } from "../../../../../../store/actions/NewMeetingActions";
import { deleteMeetingPollApi } from "../../../../../../store/actions/Polls_actions";
import { useMeetingContext } from "../../../../../../context/MeetingContext";
const DeletePollConfirmModal = ({ pollID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { advanceMeetingModalID } = useMeetingContext();
  const deletPollsMeeting = useSelector(
    (state) => state.NewMeetingreducer.deletPollsMeeting
  );
  const handleNOFunctionality = () => {
    dispatch(deleteSavedPollsMeeting(false));
  };

  const handleYesFunctionality = () => {
    console.log(pollID, "handleDeletePoll");
    let data = {
      PollID: Number(pollID),
      MeetingID: parseInt(advanceMeetingModalID),
    };
    dispatch(
      deleteMeetingPollApi(navigate, t, data, Number(advanceMeetingModalID))
    );
    dispatch(deleteSavedPollsMeeting(false));
  };

  return (
    <Modal
      show={deletPollsMeeting}
      setShow={dispatch(deleteSavedPollsMeeting)}
      modalHeaderClassName={"d-block"}
      modalFooterClassName={"d-block"}
      onHide={() => {
        dispatch(deleteSavedPollsMeeting(false));
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

export default DeletePollConfirmModal;
