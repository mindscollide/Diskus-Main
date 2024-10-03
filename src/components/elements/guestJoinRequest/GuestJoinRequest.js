import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Button } from "./../../elements";
import styles from "./GuestJoinRequest.module.css";
import { useTranslation } from "react-i18next";
import CrossIcon from "./../../layout/talk/talk-Video/video-images/CloseIcon.png";
import ProfileIcon from "./../../layout/talk/talk-Video/video-images/Profile_Icon.png";
import {
  guestJoinPopup,
  participantWaitingListBox,
} from "../../../store/actions/VideoFeature_actions";
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

  const handleCLickView = () => {
    dispatch(participantWaitingListBox(true));
    dispatch(guestJoinPopup(false));
  };

  return (
    <div className={styles["box-positioning"]}>
      <Container className='d-flex justify-content-center align-items-center'>
        {/* <Card className={styles["card-ui"]}> */}
        {/* <img
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
              <strong>{name + " "}</strong>
              {t("has-requested-to-join-this-video-call")}
            </p>
            <Row className="justify-content-center">
              <Col xs={5}>
                <Button
                  className={styles["title-deny"]}
                  onClick={() => handleAdmit(2)}
                  text={t("Deny")}
                />
              </Col>
              <Col xs={5}>
                <Button
                  className={styles["title-admit"]}
                  onClick={() => handleAdmit(1)}
                  text={t("Admit")}
                />
              </Col>
            </Row>
          </Card.Body> */}
        <Card className={styles["card-ui-400"]}>
          <div className={styles["content-section"]}>
            <div className={styles["avatars"]}>
              <img
                src={ProfileIcon}
                alt='Avatar 1'
                className={styles["avatar"]}
              />
              <img
                src={ProfileIcon}
                alt='Avatar 2'
                className={styles["avatar"]}
              />
              <img
                src={ProfileIcon}
                alt='Avatar 3'
                className={styles["avatar"]}
              />
            </div>
            <p className={styles["text"]}>
              Multiple people want to join the meeting.
            </p>
            <Button
              className={styles["title-deny"]}
              text={t("View")}
              onClick={handleCLickView}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default GuestJoinRequest;
