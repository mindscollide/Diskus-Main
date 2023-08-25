import React, { useState } from "react";
import "./VideoMaxOutgoing.css";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../../../../components/elements";
import videoEndIcon from "../../../../../assets/images/newElements/VideoEndIcon.png";
import videoAvatar from "../../../../../assets/images/newElements/VideoAvatar.png";

const VideoOutgoing = () => {
  const { VideoChatReducer } = useSelector((state) => state);
  const [minutes, setMinutes] = useState("");
  return (
    <Container className="videoOutgoing-max">
      <Row className="mt-0">
        <Col sm={12} md={12} lg={12} className="avatar-column-max mt-5">
          <img src={videoAvatar} width={150} alt="video Avatar" />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col sm={12} md={12} lg={12} className="outgoing-title-max">
          <p className="outgoing-call-text-max">Talha Qamar</p>
        </Col>
      </Row>

      <Row className="mt-0">
        <Col sm={12} md={12} lg={12} className="calling-title-max">
          <p className="Ringing-text-max">Ringing...</p>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center">
          <Button
            className="button-img-max"
            icon={
              <>
                <img src={videoEndIcon} width={50} alt="video EndIcon" />
              </>
            }
          ></Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoOutgoing;
