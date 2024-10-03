import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RejectImage from "../../../../../assets/images/Recent Activity Icons/Video/RejectImage.png";
import "./GuestVideoReject.css";

const GuestVideoReject = () => {
  const { t } = useTranslation();

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={1} md={1} sm={12} />
          <Col lg={10} md={10} sm={12}>
            <>
              <div className="Guest-Reject-Video">
                <Container>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <img src={RejectImage} />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="Denied-Main-Heading">{t("Entry-denied")}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={1} md={1} sm={12} />
                    <Col
                      lg={9}
                      md={9}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="Sub-Denied-Main-Heading">
                        {t(
                          "The-meeting-organizer-has-not-granted-you-permission-to-join-this-meeting-at-this-time"
                        )}
                      </p>
                    </Col>
                    <Col lg={1} md={1} sm={12} />
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

export default GuestVideoReject;
