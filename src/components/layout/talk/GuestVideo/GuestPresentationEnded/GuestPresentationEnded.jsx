import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import imageChair from "../../../../../assets/images/Recent Activity Icons/Video/ChairImage.png";
import "../GuestVideoEnded/GuestVideoEnded.css";

/**
 * @component GuestPresentationEnded
 * @description Static screen (navigation state 8) shown to a guest when the
 * presentation has ended and the link is no longer active. No actions.
 */
const GuestPresentationEnded = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // The presentation is over, so a later lobby must not show the presentation view
    sessionStorage.removeItem("guestInPresentation");
    sessionStorage.removeItem("removedFromPresentation");
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={1} md={1} sm={12} />
        <Col lg={10} md={10} sm={12}>
          <div className="guest-video-ended">
            <Container>
              <Row>
                <Col className="d-flex justify-content-center">
                  <img src={imageChair} alt="" />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col className="d-flex justify-content-center">
                  <p className="sub-Heading-main text-center">
                    {t("Guest-presentation-ended")}
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
        </Col>
        <Col lg={1} md={1} sm={12} />
      </Row>
    </Container>
  );
};

export default GuestPresentationEnded;
