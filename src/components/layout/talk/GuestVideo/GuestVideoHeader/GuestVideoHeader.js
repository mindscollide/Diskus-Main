import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import Screenshare from "../../../../../assets/images/Recent Activity Icons/Video/Screenshare.png";
import RaiseHand from "../../../../../assets/images/Recent Activity Icons/Video/RaiseHand.png";
import TileView from "../../../../../assets/images/Recent Activity Icons/Video/TileView.png";
import Participant from "../../../../../assets/images/Recent Activity Icons/Video/Participant.png";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import "./GuestVideoHeader.css";

const GuestVideoHeader = () => {
  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col lg={5} md={5} sm={12}>
            <p className="title-header-name">IT Departmental Meeting</p>
          </Col>

          <Col
            lg={7}
            md={7}
            sm={12}
            className="d-flex justify-content-end align-items-center gap-3"
          >
            <img src={MicOn2} width="14px" height="20px" />
            <img src={VideoOn2} width="20px" height="16px" />
            <img src={Screenshare} width="23px" height="18px" />
            <img src={RaiseHand} width="18px" height="23px" />
            <img src={TileView} width="25px" height="20px" />
            <img src={Participant} width="23px" height="18px" />
            <img src={EndCall} width="23x" height="9px" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GuestVideoHeader;
