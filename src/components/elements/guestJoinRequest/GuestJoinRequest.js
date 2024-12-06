import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { Button } from "./../../elements";
import styles from "./GuestJoinRequest.module.css";
import { useTranslation } from "react-i18next";
import CrossIcon from "./../../layout/talk/talk-Video/video-images/CloseIcon.png";
import ProfileIcon from "./../../layout/talk/talk-Video/video-images/Profile_Icon.png";
import {
  guestJoinPopup,
  participantWaitingListBox,
} from "../../../store/actions/VideoFeature_actions";
import {
  admitRejectAttendeeMainApi,
  setAdmittedParticipant,
} from "../../../store/actions/Guest_Video";

const GuestJoinRequest = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let roomID = localStorage.getItem("newRoomId");
  let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));

  const [waitingOnParticipant, setWaitingOnParticipant] = useState([]);
  const { GuestVideoReducer, videoFeatureReducer } = useSelector(
    (state) => state
  );

  const [loadingAdmit, setLoadingAdmit] = useState(false);
  const [loadingDeny, setLoadingDeny] = useState(false);

  const [filteredWaitingParticipants, setFilteredWaitingParticipants] =
    useState([]);

  const [getRoomId, setGetRoomId] = useState("");

  // let roomID = localStorage.getItem("activeRoomID");
  console.log(
    GuestVideoReducer?.admitGuestUserRequestData,
    "waitingOnParticipantwaitingOnParticipant"
  );
  const {
    name = "",
    meetingID = "",
    guid = "",
    UserID = 0,
    email = "",
    hideCamera = false,
    raiseHand = false,
    mute = false,
    isGuest = true,
  } = GuestVideoReducer?.admitGuestUserRequestData || {};

  console.log(GuestVideoReducer?.admitGuestUserRequestData, "Datatatacatcas");
  console.log(
    name,
    meetingID,
    guid,
    UserID,
    email,
    hideCamera,
    raiseHand,
    mute,
    isGuest,
    "Datatatacatcas"
  );

  useEffect(() => {
    if (GuestVideoReducer?.admitGuestUserRequestData !== null) {
      setGetRoomId(GuestVideoReducer.admitGuestUserRequestData.roomID);
    } else {
      setGetRoomId("");
    }
  }, [GuestVideoReducer?.admitGuestUserRequestData]);

  // Update filteredWaitingParticipants based on waitingParticipants
  useEffect(() => {
    console.log("hell");
    if (videoFeatureReducer.waitingParticipantsList?.length) {
      console.log(
        videoFeatureReducer.waitingParticipantsList,
        "usersDatausersData"
      );

      setFilteredWaitingParticipants(
        videoFeatureReducer.waitingParticipantsList
      );
    } else {
      setFilteredWaitingParticipants([]);
    }
  }, [videoFeatureReducer.waitingParticipantsList]);

  const handleAdmit = (flag) => {
    if (flag === 1) {
      setLoadingAdmit(true); // Admit button
    } else if (flag === 2) {
      setLoadingDeny(true); // Deny button
    }

    let Data = {
      MeetingId: filteredWaitingParticipants[0]?.meetingID,
      RoomId: String(roomID),
      IsRequestAccepted: flag === 1 ? true : false,
      AttendeeResponseList: filteredWaitingParticipants.map(
        (participantData, index) => {
          console.log(participantData, "mahdahahshahs");
          return {
            IsGuest: participantData.isGuest,
            UID: participantData.guid,
            UserID: participantData.userID,
          };
        }
      ),
    };

    dispatch(
      admitRejectAttendeeMainApi(
        Data,
        navigate,
        t,
        flag,
        "",
        setLoadingAdmit,
        setLoadingDeny
      )
    );
  };

  useEffect(() => {
    const audioElement = new Audio("/Admit-Request.wav");

    // Play audio after the user has interacted with the page
    const playAudio = () => {
      audioElement.loop = false;
      audioElement.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
      document.removeEventListener("click", playAudio); // Remove event listener after playing
    };

    document.addEventListener("click", playAudio);

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
      document.removeEventListener("click", playAudio); // Clean up
    };
  }, []);

  const handleCLickView = () => {
    dispatch(participantWaitingListBox(true));
    dispatch(guestJoinPopup(false));
  };

  useEffect(() => {
    if (
      videoFeatureReducer.waitingParticipantsList !== undefined &&
      videoFeatureReducer.waitingParticipantsList !== null &&
      videoFeatureReducer.waitingParticipantsList.length > 0
    ) {
      try {
        setWaitingOnParticipant(videoFeatureReducer.waitingParticipantsList);
      } catch (error) {
        setWaitingOnParticipant([]);
      }
    } else {
      setWaitingOnParticipant([]);
    }
  }, [videoFeatureReducer.waitingParticipantsList]);

  return (
    <div className={styles["box-positioning"]}>
      <Container className="d-flex justify-content-center align-items-center">
        {waitingOnParticipant?.length === 1 ? (
          <>
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
                  <strong>{name + " "}</strong>
                  {t("has-requested-to-join-this-video-call")}
                </p>
                <Row className="justify-content-center">
                  <Col xs={5}>
                    <Button
                      className={styles["title-deny"]}
                      onClick={() => handleAdmit(2)}
                      text={
                        loadingDeny ? (
                          <Spinner
                            animation="border"
                            size="sm"
                            variant="success"
                          />
                        ) : (
                          t("Deny")
                        )
                      }
                      disableBtn={loadingDeny}
                    />
                  </Col>
                  <Col xs={5}>
                    <Button
                      className={styles["title-admit"]}
                      onClick={() => handleAdmit(1)}
                      text={
                        loadingAdmit ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          t("Admit")
                        )
                      }
                      disableBtn={loadingAdmit}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </>
        ) : waitingOnParticipant?.length > 0 ? (
          <Card className={styles["card-ui-400"]}>
            <div className={styles["content-section"]}>
              <div className={styles["avatars"]}>
                {waitingOnParticipant.map((participantData, index) => {
                  return (
                    <img
                      src={ProfileIcon}
                      alt="Avatar 1"
                      className={styles["avatar"]}
                    />
                  );
                })}
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
        ) : null}
      </Container>
    </div>
  );
};

export default GuestJoinRequest;
