import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideoEnd from "../../../../../assets/images/Recent Activity Icons/Video/VideoEnd.png";
import { Button } from "../../../../../components/elements";
import {
  leaveCallModal,
  maximizeVideoPanelFlag,
  maxParticipantVideoCallPanel,
  maxParticipantVideoRemoved,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  participantPopup,
  participantVideoNavigationScreen,
  setAudioControlHost,
  setVideoControlHost,
} from "../../../../../store/actions/VideoFeature_actions";
import "./maxParticipantVideoRemovedComponent.css";

const MaxParticipantVideoRemovedComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickCloseModal = () => {
    dispatch(maxParticipantVideoRemoved(false));
    dispatch(maxParticipantVideoCallPanel(false));
    dispatch(setAudioControlHost(false));
    console.log("videoHideUnHideForHost");
    dispatch(setVideoControlHost(false));
    localStorage.setItem("isCaller", false);
    localStorage.setItem("isMeetingVideo", false);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    localStorage.setItem("activeCall", false);
    localStorage.setItem("isCaller", false);
    localStorage.setItem("acceptedRoomID", 0);
    localStorage.setItem("activeRoomID", 0);
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(participantPopup(false));
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const onCLickRejoin = () => {
    dispatch(maxParticipantVideoRemoved(false));
    dispatch(maxParticipantVideoCallPanel(true));
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
                      text={t("Close")}
                      onClick={onClickCloseModal}
                      className="Participant-closeModal-Button-Class"
                    />
                    <Button
                      text={t("Request-to-rejoin")}
                      className="Participant-rejoin-Button-Class"
                      onClick={onCLickRejoin}
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
