import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import imageChair from "../../../../../assets/images/Recent Activity Icons/Video/ChairImage.png";
import VideoEnd from "../../../../../assets/images/Recent Activity Icons/Video/VideoEnd.png";

import "./GuestVideoEnded.css";

const GuestVideoEnded = () => {
  const { t } = useTranslation();

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
                      <img src={VideoEnd} />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="main-heading">
                        {t("The-meeting-has-ended")}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center "
                    >
                      <p className="sub-Heading-main">
                        {t("The-host-has-ended-the-meeting")}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center "
                    >
                      <p className="sub-Heading-main">
                        {t("Thanks-for-joining")}
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
