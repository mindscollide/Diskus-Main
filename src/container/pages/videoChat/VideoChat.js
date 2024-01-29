import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoChat.module.css";
import { ChevronRight } from "react-bootstrap-icons";
import Modal from "../../../components/elements/modal/Modal";
import { TextField, Button } from "../../../components/elements";
import VideoMeetingMinutes from "../../VideoMeetingMinutes/VideoMeetingMinutes";
import VideoMeeting from "../../VideoMeeting/VideoMeeting";
import { ViewMeeting } from "../../../store/actions/Get_List_Of_Assignees";
import { Loader } from "../../../components/elements";
import {
  getMeetingAgendas,
  getMeetingAttachments,
} from "../../../store/actions/VideoChat_actions";
const VideoChat = () => {
  const { assignees } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    let meetingID = localStorage.getItem("MeetingId");
    let obj = { MeetingID: JSON.parse(meetingID) };
    dispatch(ViewMeeting(obj));

    let Data = {
      MeetingID: JSON.parse(meetingID),
    };
    dispatch(getMeetingAgendas(Data));
    dispatch(getMeetingAttachments(Data));
  }, []);
  const [videoMeetingStart, setVideoMeetingStart] = useState(true);
  const [minutes, setMinutes] = useState("");
  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={12} lg={12} className={styles["videochatContainer"]}>
            {videoMeetingStart ? <VideoMeeting /> : <VideoMeetingMinutes />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VideoChat;
