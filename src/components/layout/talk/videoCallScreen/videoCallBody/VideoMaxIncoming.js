import React, { useState } from "react";
import "./VideoMaxIncoming.css";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronRight, CameraVideo } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button } from "../../../../elements";
import videoEndIcon from "../../../../../assets/images/newElements/VideoEndIcon.png";
import videoAvatar from "../../../../../assets/images/newElements/VideoAvatar.png";
import videoAttendIcon from "../../../../../assets/images/newElements/VideoAttendIcon.png";
import setVideoIncomingCall from "../../../../../store/actions/VideoCalling_actions";

import avatar from "../../../../../assets/images/avatar.png";

import MeetingVideoChatIcon from "../../../../../assets/images/newElements/Icon feather-video1.png";

const VideoMaxIncoming = () => {
  const { VideoChatReducer } = useSelector((state) => state);
  const [minutes, setMinutes] = useState("");
  const { videoCall } = useSelector((state) => state);
  const dispatch = useDispatch();

  // const openVideoIncoming = (flag) => {
  //   dispatch(setVideoIncomingCall(false));
  // };

  return (
    <Container className="videoIncoming-max">
      <Row className="mt-0">
        <Col sm={12} md={12} lg={12} className="avatar-column-max mt-5">
          <img src={videoAvatar} width={150} alt="Avatar video" />
        </Col>
      </Row>

      <Row className="mt-0">
        <Col sm={12} md={12} lg={12} className="someone-calling-title-max">
          <p className="outgoing-call-text-max">Some One Calling</p>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col sm={12} md={12} lg={12} className="calling-title-max">
          <p className="calling-text-max">Calling...</p>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col sm={6} md={6} lg={6} className="d-flex justify-content-end">
          <Button
            className="button-img-max"
            icon={
              <>
                <img src={videoEndIcon} width={50} />
              </>
            }
          ></Button>
        </Col>

        <Col sm={6} md={6} lg={6} className="d-flex justify-content-start">
          <Button
            className="button-img"
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

export default VideoMaxIncoming;
