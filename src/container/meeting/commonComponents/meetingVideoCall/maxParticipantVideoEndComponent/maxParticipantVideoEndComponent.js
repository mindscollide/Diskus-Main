import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./maxParticipantVideoEndComponent.css";

const maxParticipantVideoEndComponent = () => {
  const { t } = useTranslation();

  return (
    <Container fluid>
      <div className="Participant-Ended-Videopanel">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <>
              <div className="max-Participant-Ended-Video">
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <img src={RemoveImage} />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <p className="max-Participant-End-Main-Heading">
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
                    <p className="Sub-max-Participant-End-Main-Heading">
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
                      className="Participant-End-closeModal-Button-Class"
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

export default maxParticipantVideoEndComponent;
