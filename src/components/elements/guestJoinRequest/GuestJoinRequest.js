import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import styles from "./GuestJoinRequest.module.css";
import { useTranslation } from "react-i18next";
import CrossIcon from "../../../assets/images/Cross_Icon.png";
import { guestJoinPopup } from "../../../store/actions/VideoFeature_actions";
import { admitRejectAttendeeMainApi } from "../../../store/actions/Guest_Video";

const GuestJoinRequest = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { GuestVideoReducer } = useSelector((state) => state);

  const {
    guestName = "",
    meetingID = "",
    guestGUID = "",
  } = GuestVideoReducer?.admitGuestUserRequestData || {};

  const handleAdmit = (flag) => {
    let Data = {
      MeetingId: meetingID,
      GuestName: guestName,
      GuestGuid: guestGUID,
      IsRequestAccepted: flag === 1 ? true : false,
    };
    dispatch(admitRejectAttendeeMainApi(Data, navigate, t));
  };

  useEffect(() => {
    const audioElement = new Audio("/Admit-Request.wav");

    audioElement.loop = false;

    audioElement.play();

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);

  return (
    <div className={styles["box-positioning"]}>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className={styles["card-ui"]}>
          <img
            onClick={() => dispatch(guestJoinPopup(false))}
            className={styles["handle-close"]}
            src={CrossIcon}
            alt=""
          />
          <Card.Body className="text-center">
            <p className={styles["title-alert"]}>
              <strong>{guestName}</strong> {t("wants-to-join-this-call")}
            </p>
            <Row className="justify-content-center">
              <Col xs={5}>
                <p
                  onClick={() => handleAdmit(1)}
                  className={styles["title-admit"]}
                >
                  {t("Admit")}
                </p>
              </Col>
              <Col xs={5}>
                <p
                  onClick={() => handleAdmit(2)}
                  className={styles["title-reject"]}
                >
                  {t("Reject")}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default GuestJoinRequest;
