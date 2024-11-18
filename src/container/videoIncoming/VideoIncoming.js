import React, { useState } from "react";
import styles from "./VideoIncoming.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronRight, CameraVideo } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button } from "../../components/elements";
import videoEndIcon from "../../assets/images/newElements/VideoEndIcon.png";
import videoAvatar from "../../assets/images/newElements/VideoAvatar.png";
import videoAttendIcon from "../../assets/images/newElements/VideoAttendIcon.png";
import setVideoIncomingCall from "../../store/actions/VideoCalling_actions";

import avatar from "../../assets/images/avatar.png";

import MeetingVideoChatIcon from "../../assets/images/newElements/Icon feather-video1.png";

const VideoIncoming = () => {
  const { VideoChatReducer } = useSelector((state) => state);
  const [minutes, setMinutes] = useState("");
  const { videoCall } = useSelector((state) => state);
  const dispatch = useDispatch();

  // const openVideoIncoming = (flag) => {
  //   dispatch(setVideoIncomingCall(false));
  // };

  return (
    <Container className={styles["videoIncoming"]}>
      <Row className="mt-5">
        <Col sm={12} md={12} lg={12} className={styles["avatar-column"]}>
          <img src={videoAvatar} width={150} />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col
          sm={12}
          md={12}
          lg={12}
          className={styles["someone-calling-title"]}
        >
          <p className={styles["outgoing-call-text"]}>Some One Calling</p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col sm={12} md={12} lg={12} className={styles["calling-title"]}>
          <p className={styles["calling-text"]}>Calling...</p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col sm={6} md={6} lg={6} className="d-flex justify-content-end">
          <Button
            className={styles["button-img"]}
            icon={
              <>
                <img src={videoEndIcon} width={50} />
              </>
            }
          ></Button>
        </Col>

        <Col sm={6} md={6} lg={6} className="d-flex justify-content-start">
          <Button
            className={styles["button-img"]}
            icon={
              <>
                <img src={videoAttendIcon} width={50} />
              </>
            }
          ></Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoIncoming;
