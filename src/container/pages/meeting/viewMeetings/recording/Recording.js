import React, { useEffect, useState } from "react";
import styles from "./Recording.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMeetingRecordingFilesApi,
  requestMeetingRecordingTranscriptApi,
} from "../../../../../store/actions/NewMeetingActions";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../../components/elements";
import { useMeetingContext } from "../../../../../context/MeetingContext";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option";
import { convertToArabicNumerals } from "../../../../../commen/functions/regex";

const Recording = () => {
  const meetingRecordingFiles = useSelector(
    (state) => state.NewMeetingreducer.meetingRecordingFiles
  );
  const { advanceMeetingModalID } = useMeetingContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  useEffect(() => {
    let Data = { MeetingID: advanceMeetingModalID };

    dispatch(getMeetingRecordingFilesApi(navigate, t, Data));
  }, []);

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
            transcriptStatus: 2,
            meetingID: MeetingID,
          });
        } else if (
          responseMessage.toLowerCase() ===
          "Meeting_MeetingServiceManager_GetMeetingRecordingFiles_02".toLowerCase()
        ) {
          MeetingData.push(
            {
              fileID: meetingRecording.fileID,
              fileName: meetingRecording.fileName,
              fileSize: meetingRecording.fileSize,
              transcriptStatus: transcriptionStatusID,
              meetingID: MeetingID,
            },
            {
              fileID: meetingMinutes.fileID,
              fileName: meetingMinutes.fileName,
              fileSize: meetingMinutes.fileSize,
              transcriptStatus: transcriptionStatusID,
              meetingID: MeetingID,
            },
            {
              fileID: meetingTranscript.fileID,
              fileName: meetingTranscript.fileName,
              fileSize: meetingTranscript.fileSize,
              transcriptStatus: transcriptionStatusID,
              meetingID: MeetingID,
            }
          );
        }

        setData(MeetingData);
      }
    } catch (error) {}
  }, [meetingRecordingFiles]);

  const handleClickTranscribe = (record) => {
    let Data = {
      MeetingID: record.meetingID,
      MeetingTitle: localStorage.getItem("meetingTitle"),
    };
    dispatch(requestMeetingRecordingTranscriptApi(Data, navigate, t));
  };

  const columns = [
    {
      title: "File",
      dataIndex: "fileName",
      key: "fileName",
      width: "50%",
      ellipsis: true,
      render: (text, record) => {
        return (
          <span className={styles["RecordingTable___title"]}>
            <img
              src={getIconSource(getFileExtension(text))}
              alt=''
              width={"17px"}
              height={"17px"}
            />
            {text}
          </span>
        );
      },
    },
    {
      title: "Size",
      dataIndex: "fileSize",
      key: "fileSize",
      width: "12%",
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
                  text={"Transcribe"}
                  onClick={() => handleClickTranscribe(record)}
                />
                <Button
                  className={styles["DownloadBtn"]}
                  text={"Download"}
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
                  text={"Download"}
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
                className='d-flex justify-content-center gap-3'>
                <span className={styles["TranscibingLabel"]}>
                  Transcibing....
                </span>
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
    <Row>
      <Col sm={12} md={12} lg={12}>
        <Table rows={data} column={columns} pagination={false} />
      </Col>
    </Row>
  );
};

export default Recording;
