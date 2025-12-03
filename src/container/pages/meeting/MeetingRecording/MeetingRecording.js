import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CustomModal from "../../../../components/elements/modal/Modal";
import { useMeetingContext } from "../../../../context/MeetingContext";
import { Button, Table } from "../../../../components/elements";
import styles from "./MeetingRecording.module.css";
import BackArrow from "../../../../assets/images/DownloadRecordingBackArrow.png";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  meetingTranscriptDownloaded,
  requestMeetingRecordingTranscriptApi,
  requestMeetingRecordingTranscript_clear,
} from "../../../../store/actions/NewMeetingActions";
import { DataRoomDownloadFileApiFunc } from "../../../../store/actions/DataRoom_actions";
import { convertToArabicNumerals } from "../../../../commen/functions/regex";
import {
  getFileExtension,
  getIconSource,
} from "../../../DataRoom/SearchFunctionality/option";
import SpinComponent from "../../../../components/elements/mainLoader/loader";

const MeetingRecording = ({ title }) => {
  const { setStepDownloadModal } = useMeetingContext();
  const meetingRecordingFiles = useSelector(
    (state) => state.NewMeetingreducer.meetingRecordingFiles
  );
  const meetingtranscribeResponse = useSelector(
    (state) => state.NewMeetingreducer.meetingTranscriptResponse
  );
  const meetingTranscriptDownload = useSelector(
    (state) => state.NewMeetingreducer.meetingTranscriptDownloaded
  );
  const meetingMinutesDownloaded = useSelector(
    (state) => state.NewMeetingreducer.meetingMinutesDownload
  );
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      if (meetingRecordingFiles !== null) {
        let MeetingData = [];
        const { MeetingID, response: ApiData } = meetingRecordingFiles.response;
        const {
          responseMessage,
          meetingMinutes,
          meetingRecording,
          meetingTranscript,
          transcriptionStatusID,
        } = ApiData;

        if (
          responseMessage.toLowerCase() ===
          "Meeting_MeetingServiceManager_GetMeetingRecordingFiles_01".toLowerCase()
        ) {
          MeetingData.push({
            fileID: meetingRecording.fileID,
            fileName: meetingRecording.fileName,
            fileSize: meetingRecording.fileSize,
            transcriptStatus: transcriptionStatusID,
            meetingID: MeetingID,
          });
        } else if (
          responseMessage.toLowerCase() ===
          "Meeting_MeetingServiceManager_GetMeetingRecordingFiles_02".toLowerCase()
        ) {
          if (meetingRecording?.fileID) {
            MeetingData.push({
              fileID: meetingRecording.fileID,
              fileName: meetingRecording.fileName,
              fileSize: meetingRecording.fileSize,
              transcriptStatus: transcriptionStatusID,
              meetingID: MeetingID,
            });
          }

          if (meetingMinutes?.fileID) {
            MeetingData.push({
              fileID: meetingMinutes.fileID,
              fileName: meetingMinutes.fileName,
              fileSize: meetingMinutes.fileSize,
              transcriptStatus: transcriptionStatusID,
              meetingID: MeetingID,
            });
          }

          if (meetingTranscript?.fileID) {
            MeetingData.push({
              fileID: meetingTranscript.fileID,
              fileName: meetingTranscript.fileName,
              fileSize: meetingTranscript.fileSize,
              transcriptStatus: transcriptionStatusID,
              meetingID: MeetingID,
            });
          }
        }

        setData(MeetingData);
      }
    } catch (error) {}
  }, [meetingRecordingFiles]);

  useEffect(() => {
    if (meetingtranscribeResponse !== null) {
      if (
        meetingtranscribeResponse.responseMessage.toLowerCase() ===
        "DataRoom_DataRoomManager_RequestMeetingRecordingTranscript_01".toLowerCase()
      ) {
        let copyData = [...data];
        if (copyData.length > 0) {
          copyData[0].transcriptStatus = 3;
          setData(copyData);
        }
        dispatch(requestMeetingRecordingTranscript_clear());
      }
    }
  }, [meetingtranscribeResponse]);

  useEffect(() => {
    if (meetingTranscriptDownload !== null) {
      try {
        const { fileDetails, meetingID } = meetingTranscriptDownload;
        let copyData = [...data];
        copyData[0].transcriptStatus = 4;
        copyData.push({
          fileID: fileDetails.pK_FileID,
          fileName: fileDetails.displayFileName,
          fileSize: fileDetails.fileSize,
          transcriptStatus: 4,
          meetingID: meetingID,
        });
        setData(copyData);
        dispatch(meetingTranscriptDownloaded(null));
        
      } catch (error) {
        
      }
    }
  }, [meetingTranscriptDownload]);

  // meetingMinutesDownloaded
  useEffect(() => {
    if (meetingMinutesDownloaded !== null) {
      try {
        const { fileDetails, meetingID } = meetingMinutesDownloaded;
        let copyData = [...data];
        copyData[0].transcriptStatus = 4;
        copyData.push({
          fileID: fileDetails.pK_FileID,
          fileName: fileDetails.displayFileName,
          fileSize: fileDetails.fileSize,
          transcriptStatus: 4,
          meetingID: meetingID,
        });
        setData(copyData);
        dispatch(meetingMinutesDownloaded(null));
        
      } catch (error) {
        
      }
    }
  }, [meetingMinutesDownloaded]);

  const handleClickTranscribe = (record) => {
    
    let Data = { MeetingID: record.meetingID, MeetingTitle: title };
    
    dispatch(requestMeetingRecordingTranscriptApi(Data, navigate, t));
  };

  const columns = [
    {
      title: t("File"),
      dataIndex: "fileName",
      key: "fileName",
      width: "45%",
      ellipsis: true,
      render: (text, record) => {
        return (
          <span className={styles["RecordingTable___title"]}>
            <img
              src={getIconSource(getFileExtension(text))}
              alt=''
              className='me-2'
              width={"17px"}
              height={"17px"}
            />
            {text}
          </span>
        );
      },
    },
    {
      title: t("Size"),
      dataIndex: "fileSize",
      key: "fileSize",
      width: "17%",
      ellipsis: true,

      render: (text, record) => {
        return (
          <>
            <span className={styles["RecordingTable___size"]}>
              {`${convertToArabicNumerals(
                text,
                localStorage.getItem("i18nextLng")
              )} MB`}
            </span>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: "38%",
      render: (text, record) => {
        if (record.transcriptStatus === 2) {
          return (
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className='d-flex justify-content-end gap-3'>
                <Button
                  className={styles["DownloadBtn"]}
                  text={t("Transcribe")}
                  onClick={() => handleClickTranscribe(record)}
                />
                <Button
                  className={styles["DownloadBtn"]}
                  text={t("Download")}
                  onClick={() => DownloadRecording(record)}
                />
              </Col>
            </Row>
          );
        } else if (
          record.transcriptStatus === 4 ||
          record.transcriptStatus === 1
        ) {
          return (
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className='d-flex justify-content-end gap-3'>
                <Button
                  className={styles["DownloadBtn"]}
                  text={t("Download")}
                  onClick={() => DownloadRecording(record)}
                />
              </Col>
            </Row>
          );
        } else if (record.transcriptStatus === 3) {
          return (
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className='d-flex justify-content-center align-items-center gap-3'>
                <span className={styles["TranscibingLabel"]}>
                  {`${t("Transcribing")}...`}
                </span>
                <Button
                  className={styles["DownloadBtn"]}
                  text={t("Download")}
                  onClick={() => DownloadRecording(record)}
                />
              </Col>
            </Row>
          );
        }
      },
    },
  ];
  
  const DownloadRecording = async (record) => {
    let data = {
      FileID: Number(record.fileID),
    };
    dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, record.fileName));
  };

  return (
    <CustomModal
      show={true}
      size={"md"}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-none"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["Download__Heading_MeetingRecording"]}>
                <img
                  src={BackArrow}
                  onClick={() => setStepDownloadModal(1)}
                  className='cursor-pointer'
                  alt=''
                />{" "}
                {t("Meeting-recording")}
              </span>
            </Col>
            <Col sm={12} md={12} lg={12}>
              <Table
                rows={data}
                className={"RecordingTable"}
                column={columns}
                pagination={false}
              />
            </Col>
            <div className='d-flex justify-content-center align-items-center'></div>
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
                onClick={() => setStepDownloadModal(1)}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default MeetingRecording;
