import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RejectImage from "../../../../../assets/images/Recent Activity Icons/Video/RejectImage.png";
import "./maxParticipantVideoDeniedComponent.css";
import { useDispatch } from "react-redux";
import { maxParticipantVideoDenied } from "../../../../../store/actions/VideoFeature_actions";

const MaxParticipantVideoDeniedComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClickCLose = () => {
    dispatch(maxParticipantVideoDenied(false));
  };

  return (
    <>
      <Container fluid>
        <div className="max-Participant-Reject-Videopanel">
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <p onClick={onClickCLose}>X</p>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <>
                <div className="max-Participant-Reject-Video">
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
                      <p className="max-Participant-Denied-Main-Heading">
                        {t("Entry-denied")}
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
                      <p className="Sub-max-Participant-Denied-Main-Heading">
                        {t(
                          "The-meeting-organizer-has-not-granted-you-permission-to-join-this-meeting-at-this-time"
                        )}
                      </p>
                    </Col>
                  </Row>
                </div>
              </>
            </Col>
          </Row>
        </div>
      </Container>
      ;
    </>
  );
};

export default MaxParticipantVideoDeniedComponent;
