import React, { useEffect } from "react";
import styles from "./RSVP.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbsUp from "../../../assets/images/RSVPThumsUp.svg";
import RedChair from "../../../assets/images/RSVPRedChair.svg";
import Clock from "../../../assets/images/RSVPClockIcon.svg";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TextField } from "../../../components/elements";
import { useDispatch } from "react-redux";
import { validateEncryptedStringUserAvailibilityForMeetingApi } from "../../../store/actions/NewMeetingActions";
const RSVP = () => {
  const currentUrl = window.location.href;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rsvp, setRSVP] = useState("");

  useEffect(() => {
    console.log(currentUrl, "remainingStringremainingString");
    if (
      currentUrl.includes("DisKus/Meeting/Useravailabilityformeeting?action=")
    ) {
      console.log(currentUrl, "remainingStringremainingString");

      const remainingString = currentUrl.split("?action=")[1];
      console.log(remainingString, "remainingStringremainingString");
      if (remainingString) {
        setRSVP(remainingString);
        // APi call
        let Data = { EncryptedString: remainingString };
        console.log(Data, "EncryptedStringEncryptedString");
        dispatch(
          validateEncryptedStringUserAvailibilityForMeetingApi(
            navigate,
            Data,
            t
          )
        );
      }
      // Save something in local storage if the condition is true
    } else {
      let RSVP = localStorage.getItem("RSVP");
      if (RSVP !== undefined && RSVP !== null) {
        setRSVP(RSVP);
        alert("RSVP");
      } else {
        navigate("/Diskus/Meeting");
      }
    }
  }, []);

  useEffect(() => {
    if (rsvp !== "") {
      localStorage.removeItem("RSVP");
    }
  }, [rsvp]);

  return (
    <section>
      <Row>
        <Col lg={3} md={3} sm={3}></Col>

        <Col lg={6} md={6} sm={6}>
          <Row className="mt-5">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex flex-column flex-wrap align-items-center"
            >
              {/* <img src={ThumbsUp} height="130.64px" width="113.47px" alt="" />
              <span className={styles["ThankyouHeading"]}>
                {t("Thank-you")}!
              </span>
              <span className={styles["Subheading"]}>
                {t("Your-response-has-been-duly-noted")}.
              </span> */}

              {/* Red Chair */}
              {/* <img src={RedChair} height="130.64px" width="113.47px" alt="" />
              <span className={styles["RedThankyouHeading"]}>
                {t("Thank-you")}!
              </span>
              <span className={styles["Subheading"]}>
                {t("We-acknowledge-your-unavailability-for-the-meeting")}.
              </span> */}

              {/* Clock */}

              <img src={Clock} height="130.64px" width="113.47px" alt="" />
              <span className={styles["OrangeThankyouHeading"]}>
                {t("Thank-you")}!
              </span>
              <span className={styles["Subheading"]}>
                {t(
                  "We're-really-looking-forward-to-having-you-at-the-meeting-hopefully-you-can-make-it"
                )}
              </span>
              <span className={styles["Subheading"]}>
                {t("Hopefully-you-can-make-it")}
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["MeetingTitle"]}>
                {t("Meeting-title")}
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <TextField
                labelClass={"d-none"}
                name={"MeetingTitle"}
                disable={true}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={6} md={6} sm={6}>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["MeetingTitle"]}>
                    {t("Meeting-date-and-time")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    labelClass={"d-none"}
                    name={"MeetingDateAndTime"}
                    disable={true}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["MeetingTitle"]}>
                    {t("Date-of-submitting-response")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    labelClass={"d-none"}
                    name={"DateOfSubmissionResponse"}
                    disable={true}
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["MeetingTitle"]}>
                    {t("Meeting-location")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    labelClass={"d-none"}
                    name={"MeetingLocation"}
                    disable={true}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["MeetingTitle"]}>
                    {t("You-have-confirmed-your-attendance")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    labelClass={"d-none"}
                    name={"ConfirmedAttendance"}
                    disable={true}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button text={t("Back")} className={styles["BackButtonRSVP"]} />
            </Col>
          </Row>
        </Col>

        <Col lg={3} md={3} sm={3}></Col>
      </Row>
    </section>
  );
};
export default RSVP;
