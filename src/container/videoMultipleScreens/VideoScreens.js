import React, { useState } from "react";
import styles from "./VideoScreens.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import { ChevronRight, CameraVideo, mic } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { TextField, Button, Modal } from "../../components/elements";
import videoEndIcon from "../../assets/images/newElements/VideoEndIcon.png";
import img10 from "../../assets/images/10.png";
import videoAvatar from "../../assets/images/newElements/VideoAvatar.png";
import MultipleAvatar1 from "../../assets/images/newElements/MultipleVideoAvatar-1.png";
import MultipleAvatar2 from "../../assets/images/newElements/MultipleVideoAvatar-2.png";
import MultipleAvatar3 from "../../assets/images/newElements/MultipleVideoAvatar-3.png";
import videoAttendIcon from "../../assets/images/newElements/VideoAttendIcon.png";

import ProfileAvatar from "../../assets/images/newElements/profileAvatar.svg";

import MeetingVideoChatIcon from "../../assets/images/newElements/Icon feather-video1.png";

const VideoScreens = ({ show, setShow, ModalTitle }) => {
  const { VideoChatReducer } = useSelector((state) => state);
  const [minutes, setMinutes] = useState("");

  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} />
          </Col>
          <Col lg={1} md={1} sm={1} />
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} />
          </Col>
          <Col lg={1} md={1} sm={1} />
        </Row>

        <Row className="mt-3">
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} />
          </Col>
          <Col lg={1} md={1} sm={1} />
          <Col
            lg={5}
            md={5}
            sm={5}
            className={styles["avatar-background-screens"]}
          >
            <img src={ProfileAvatar} width={140} />
          </Col>
          <Col lg={1} md={1} sm={1} />
        </Row>
      </Container>
    </>
  );
};

export default VideoScreens;
