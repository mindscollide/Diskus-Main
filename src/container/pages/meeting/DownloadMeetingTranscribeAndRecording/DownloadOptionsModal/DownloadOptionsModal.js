import { Col, Row } from "react-bootstrap";
import CustomModal from "../../../../../components/elements/modal/Modal";
import styles from "./DownloadOptionsModal.module.css";
import DownloadRecording from "../../../../../assets/images/Download_video_icon.png";
import DownloadBoardDeck from "../../../../../assets/images/Download_boarddeck_icon.png";
import React, { useEffect, useState } from "react";
import WarningIcon from "../../../../../assets/images/WarningIcon.png";
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
import SpinComponent from "../../../../../components/elements/mainLoader/loader";
import { useSelector } from "react-redux";

const DownloadOptionsModal = ({
  isDownloadAvailable,
  downloadMeetingRecord: MeetingRecord,
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
  const meetingVideoRecording = useSelector(
    (state) => state.DataRoomReducer.meetingVideoRecording
  );
  const [meetingData, setMeetingData] = useState(null);
  console.log(
    MeetingRecord,
    meetingData,
    meetingVideoRecording,
    "downloadMeetingRecorddownloadMeetingRecord"
  );
  //Board Deck Onclick function
  const boardDeckOnClick = () => {
    if (MeetingRecord !== null) {
      setDownloadMeeting(false);
      setBoardDeckMeetingID(MeetingRecord?.pK_MDID);
      setBoardDeckMeetingTitle(MeetingRecord?.title);
      dispatch(boardDeckModal(true));
      localStorage.setItem("meetingTitle", MeetingRecord?.title);
    }
  };

  const downloadMeetingDetails = () => {
    if (MeetingRecord !== null) {
      let Data = { MeetingID: MeetingRecord?.pK_MDID };

      dispatch(
        getMeetingRecordingFilesApi(navigate, t, Data, setStepDownloadModal)
      );
    }
  };
  useEffect(() => {
    if (MeetingRecord !== null) {
      setMeetingData(MeetingRecord);
      console.log(
        MeetingRecord,
        meetingData,
        "downloadMeetingRecorddownloadMeetingRecord"
      );
    }
  }, [MeetingRecord]);
  useEffect(() => {
    if (meetingVideoRecording !== null) {
      if (meetingData) {
        if (meetingData.pK_MDID === meetingVideoRecording?.meetingID) {
          setMeetingData({
            ...meetingData,
            isRecordingAvailable: true,
          });
        }
        // setMeetingData()
        console.log(
          MeetingRecord,
          meetingData,
          "downloadMeetingRecorddownloadMeetingRecord"
        );
      }
    }
  }, [meetingVideoRecording]);
  if (stepDownloadModal === 2) {
    return <MeetingRecording title={MeetingRecord?.title} />;
  } else {
    return (
      <CustomModal
        show={downloadMeetinModal}
        size={"md"}
        onHide={() => setDownloadMeeting(false)}
        modalFooterClassName={styles["Download__ModalFooter"]}
        modalHeaderClassName={"d-none"}
        centered={true}
        modalBodyClassName={styles["Download__ModalBody"]}
        ModalBody={
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className={styles["Download__Heading"]}>
                {t("Download")}
              </Col>
            </Row>
            <Row className='my-3'>
              <Col sm={6} md={6} lg={6}>
                <div
                  className={
                    meetingData?.isVideoCall &&
                    meetingData?.isRecordingAvailable
                      ? styles["Download___Button_recording"]
                      : styles["Download___Button_recording_disabled"]
                  }
                  // className={styles["Download___Button_recording_disabled"]}
                  onClick={downloadMeetingDetails}>
                  <img width={35} src={DownloadRecording} alt='' />
                  <span>
                    {meetingData?.isVideoCall &&
                    meetingData?.isRecordingAvailable
                      ? t("Download-meeting-recording")
                      : meetingData?.isVideoCall === false
                      ? t("Video-was-not-recorded")
                      : meetingData?.isRecordingAvailable === false
                      ? t("Video-recording-not-available-yet")
                      : null}
                  </span>
                  {!meetingData?.isVideoCall ||
                    (!meetingData?.isRecordingAvailable && (
                      <img src={WarningIcon} alt='' />
                    ))}
                </div>
              </Col>
              <Col sm={6} md={6} lg={6}>
                <div
                  className={styles["Download___Button"]}
                  onClick={boardDeckOnClick}>
                  <img width={35} src={DownloadBoardDeck} alt='' />
                  <span>{t("Download-board-deck")}</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-center align-items-center'>
                <SpinComponent />
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
                  text={t("Cancel")}
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
