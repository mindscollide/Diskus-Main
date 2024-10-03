import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import styles from "./GuestJoinRequest.module.css";
import { useTranslation } from "react-i18next";
import CrossIcon from "./../../layout/talk/talk-Video/video-images/CloseIcon.png";
import ProfileIcon from "./../../layout/talk/talk-Video/video-images/Avatar2.png";
import { guestJoinPopup } from "../../../store/actions/VideoFeature_actions";
import { admitRejectAttendeeMainApi } from "../../../store/actions/Guest_Video";

const GuestJoinRequest = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { GuestVideoReducer } = useSelector((state) => state);

  const {
    name = "",
    meetingID = "",
    uid = "",
    isGuest = true,
  } = GuestVideoReducer?.admitGuestUserRequestData || {};

  const handleAdmit = (flag) => {
    // let Data = {
    //   MeetingId: meetingID,
    //   GuestName: name,
    //   GuestGuid: [uid],
    //   IsGuest: isGuest,
    //   IsRequestAccepted: flag === 1 ? true : false,
    // };
    let Data = {
      MeetingId: meetingID,
      AttendeeResponseList: [
        {
          Name: name,
          UID: uid,
          IsRequestAccepted: flag === 1 ? true : false,
          IsGuest: isGuest,
        },
      ],
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
            <div>
              <img
                src={ProfileIcon}
                alt=""
                style={{
                  borderRadius: "50%",
                  width: "75px",
                  height: "75px",
                  objectFit: "cover",
                }}
              />
            </div>
            <p className={styles["title-alert"]}>
              {name + " "}
              {t("has-requested-to-join-this-video-call")}
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
