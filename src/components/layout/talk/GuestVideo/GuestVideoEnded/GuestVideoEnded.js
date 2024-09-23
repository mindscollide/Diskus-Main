import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import imageChair from "../../../../../assets/images/Recent Activity Icons/Video/ChairImage.png";
import "./GuestVideoEnded.css";

const GuestVideoEnded = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={1} md={1} sm={12} />
          <Col lg={10} md={10} sm={12}>
            <>
              <div className="guest-video-ended">
                <Container>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <img src={imageChair} />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="main-heading">We're Sorry!</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="sub-Heading-main">
                        The meeting has ended, and this link is no longer
                        active.
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
            </>
          </Col>
          <Col lg={1} md={1} sm={12} />
        </Row>
      </Container>
    </>
  );
};

export default GuestVideoEnded;
