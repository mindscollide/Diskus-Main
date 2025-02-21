import { Col, Row } from "react-bootstrap";
import CustomModal from "../../../../../components/elements/modal/Modal";
import styles from "./DownloadOptionsModal.module.css";
import DownloadRecording from "../../../../../assets/images/Download_video_icon.png";
import DownloadBoardDeck from "../../../../../assets/images/Download_boarddeck_icon.png";
import React, { useState } from "react";
import { Button } from "../../../../../components/elements";
import { useMeetingContext } from "../../../../../context/MeetingContext";
import {
  boardDeckModal,
  getMeetingRecordingFilesApi,
} from "../../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import MeetingRecording from "../../MeetingRecording/MeetingRecording";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DownloadOptionsModal = ({
  isDownloadAvailable,
  downloadMeetingRecord,
}) => {
  const {
    setBoardDeckMeetingID,
    setBoardDeckMeetingTitle,
    setStepDownloadModal,
    stepDownloadModal,
    downloadMeetinModal,
    setDownloadMeeting,
  } = useMeetingContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  //Board Deck Onclick function
  const boardDeckOnClick = () => {
    if (downloadMeetingRecord !== null) {
      setDownloadMeeting(false);
      setBoardDeckMeetingID(downloadMeetingRecord?.pK_MDID);
      setBoardDeckMeetingTitle(downloadMeetingRecord?.title);
      dispatch(boardDeckModal(true));
      localStorage.setItem("meetingTitle", downloadMeetingRecord?.title);
    }
  };

  const downloadMeetingDetails = () => {
    if (downloadMeetingRecord !== null) {
      let Data = { MeetingID: downloadMeetingRecord?.pK_MDID };

      dispatch(
        getMeetingRecordingFilesApi(navigate, t, Data, setStepDownloadModal)
      );
    }
  };
  if (stepDownloadModal === 2) {
    return <MeetingRecording title={downloadMeetingRecord?.title} />;
  } else {
    return (
      <CustomModal
        show={downloadMeetinModal}
        size={"md"}
        onHide={() => setDownloadMeeting(false)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-none"}
        ModalBody={
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className={styles["Download__Heading"]}>
                Download
              </Col>
            </Row>
            <Row className='my-3'>
              <Col sm={6} md={6} lg={6}>
                <div
                  className={
                    isDownloadAvailable
                      ? styles["Download___Button_recording"]
                      : styles["Download___Button_recording_disabled"]
                  }
                  onClick={downloadMeetingDetails}>
                  <img width={35} src={DownloadRecording} />
                  <span>Download Meeting Recording</span>
                </div>
              </Col>
              <Col sm={6} md={6} lg={6}>
                <div
                  className={styles["Download___Button"]}
                  onClick={boardDeckOnClick}>
                  <img width={35} src={DownloadBoardDeck} />
                  <span>Download Board Deck</span>
                </div>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className={"d-flex justify-content-end p-0 m-0"}>
                <Button
                  className={styles["Download___cancelBtn"]}
                  text={"Cancel"}
                  onClick={() => setDownloadMeeting(false)}
                />
              </Col>
            </Row>
          </>
        }
      />
    );
  }
};

export default DownloadOptionsModal;
