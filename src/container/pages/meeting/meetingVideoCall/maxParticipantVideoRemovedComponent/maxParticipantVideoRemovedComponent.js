import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideoEnd from "../../../../../assets/images/Recent Activity Icons/Video/VideoEnd.png";
import { Button } from "../../../../../components/elements";
import { participantVideoNavigationScreen } from "../../../../../store/actions/VideoFeature_actions";
import "./maxParticipantVideoRemovedComponent.css";

const MaxParticipantVideoRemovedComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickCloseModal = () => {
    dispatch(participantVideoNavigationScreen(1));
  };

  return (
    <Container fluid>
      <div className="Participant-Removed-Videopanel">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <>
              <div className="max-Participant-Removed-Video">
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

                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <p className="max-Participant-Removed-Main-Heading">
                      {t("Removed-from-the-meeting")}
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <p className="Sub-max-Participant-Removed-Main-Heading">
                      {t("The-host-has-removed-you-from-the-meeting")}
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2"
                  >
                    <Button
                      text={t("Close-modal")}
                      onClick={onClickCloseModal}
                      className="Participant-closeModal-Button-Class"
                    />
                    <Button
                      text={t("Request-to-rejoin")}
                      className="Participant-rejoin-Button-Class"
                    />
                  </Col>
                </Row>
              </div>
            </>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default MaxParticipantVideoRemovedComponent;
