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
import { useSelector } from "react-redux";
import moment from "moment";
import {
  newTimeFormaterAsPerUTCFullDate,
  resolutionResultTable,
} from "../../../commen/functions/date_formater";
const RSVP = () => {
  const currentUrl = window.location.href;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rsvp, setRSVP] = useState("");
  const [rsvpData, setrsvpData] = useState({
    meetingTitle: "",
    meetingDate: "",
    startTime: "",
    endTime: "",
    responseDate: "",
    responseTime: "",
    userResponse: "",
    userResponseStatus: 0,
    meetingLocation: "",
  });
  const { NewMeetingreducer } = useSelector((state) => state);

  const UserAvalibilityState = useSelector(
    (state) => state.NewMeetingreducer.userAvailibilityData
  );

  console.log(UserAvalibilityState, "UserAvalibilityState");

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");
    return newDate;
  };

  function convertToGMT(utcDate, utcStartTime, utcEndTime) {
    // Concatenating date and time strings to form ISO format
    const startDateISO = `${utcDate}T${utcStartTime}Z`;
    const endDateISO = `${utcDate}T${utcEndTime}Z`;

    // Creating Date objects in UTC
    const startDateUTC = new Date(startDateISO);
    const endDateUTC = new Date(endDateISO);

    // Getting GMT formatted strings
    const formattedStartDate = startDateUTC.toISOString().split("T")[0];
    const formattedStartTime = startDateUTC
      .toISOString()
      .split("T")[1]
      .slice(0, 5);
    const formattedEndTime = endDateUTC.toISOString().split("T")[1].slice(0, 5);

    return {
      formattedStartDate: formattedStartDate,
      formattedStartTime: formattedStartTime,
      formattedEndTime: formattedEndTime,
    };
  }

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
    try {
      if (UserAvalibilityState !== undefined && UserAvalibilityState !== null) {
        setrsvpData((prevState) => ({
          ...prevState,
          meetingTitle: UserAvalibilityState.meetingTitle || "",
          meetingDate: UserAvalibilityState.meetingDate || "",
          startTime: UserAvalibilityState.startTime || "",
          endTime: UserAvalibilityState.endTime || "",
          responseDate: UserAvalibilityState.responseDate || "",
          responseTime: UserAvalibilityState.responseTime || "",
          userResponse: UserAvalibilityState.userResponse || "",
          userResponseStatus: UserAvalibilityState.userResponseStatus || 0,
          meetingLocation: UserAvalibilityState.meetingLocation || "",
        }));
      } else {
        // Handle the case when UserAvailabilityState is undefined or null
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerror");
    }
  }, [UserAvalibilityState]);

  console.log(
    rsvpData.responseDate,
    rsvpData.responseTime,
    "responseDateresponseDate"
  );

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
              {rsvpData && (
                <>
                  {rsvpData.userResponseStatus === 2 ? (
                    // Your rendering logic for userResponseStatus 2
                    <>
                      <img
                        src={ThumbsUp}
                        height="130.64px"
                        width="113.47px"
                        alt=""
                      />
                      <span className={styles["ThankyouHeading"]}>
                        {t("Thank-you")}!
                      </span>
                      <span className={styles["Subheading"]}>
                        {t("Your-response-has-been-duly-noted")}.
                      </span>
                    </>
                  ) : rsvpData.userResponseStatus === 3 ? (
                    // Your rendering logic for userResponseStatus 3
                    <>
                      <img
                        src={RedChair}
                        height="130.64px"
                        width="113.47px"
                        alt=""
                      />
                      <span className={styles["RedThankyouHeading"]}>
                        {t("Thank-you")}!
                      </span>
                      <span className={styles["Subheading"]}>
                        {t(
                          "We-acknowledge-your-unavailability-for-the-meeting"
                        )}
                        .
                      </span>
                    </>
                  ) : rsvpData.userResponseStatus === 4 ? (
                    // Your rendering logic for userResponseStatus 4
                    <>
                      <img
                        src={Clock}
                        height="130.64px"
                        width="113.47px"
                        alt=""
                      />
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
                    </>
                  ) : null}
                </>
              )}
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
                value={rsvpData.meetingTitle}
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
                    value={
                      changeDateStartHandler2(rsvpData.meetingDate)
                      //   rsvpData.startTime,
                      //   rsvpData.endTime
                    }
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
                    value={newTimeFormaterAsPerUTCFullDate(
                      rsvpData.responseDate + rsvpData.responseTime
                    )}
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
                    value={rsvpData.meetingLocation}
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
                    value={rsvpData.userResponse}
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
