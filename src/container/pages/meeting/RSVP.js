import React, { useEffect } from "react";
import styles from "./RSVP.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbsUp from "../../../assets/images/RSVPThumsUp.svg";
import RedChair from "../../../assets/images/RSVPRedChair.svg";
import Clock from "../../../assets/images/RSVPClockIcon.svg";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { TextField } from "../../../components/elements";
import { useDispatch } from "react-redux";
import { validateEncryptedStringUserAvailibilityForMeetingApi } from "../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import {
  convertDateTimeRangeToGMT,
  newTimeFormaterAsPerUTCTalkDateTime,
} from "../../../commen/functions/date_formater";
const RSVP = () => {
  const currentUrl = window.location.href;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const UserAvalibilityState = useSelector(
    (state) => state.NewMeetingreducer.userAvailibilityData
  );

  useEffect(() => {
    if (localStorage.getItem("RSVP") !== null) {
      let Data = { EncryptedString: localStorage.getItem("RSVP") };
      dispatch(
        validateEncryptedStringUserAvailibilityForMeetingApi(navigate, Data, t)
      );
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
        localStorage.removeItem("RSVP");
      } else {
        // Handle the case when UserAvailabilityState is undefined or null
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerror");
    }
  }, [UserAvalibilityState]);

  return (
    <section>
      <Row>
        <Col lg={3} md={3} sm={3}></Col>
        {rsvpData && (
          <>
            <Col lg={6} md={6} sm={6}>
              <Row className='mt-5'>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex flex-column flex-wrap align-items-center'>
                  {rsvpData && (
                    <>
                      {rsvpData.userResponseStatus === 2 ? (
                        // Your rendering logic for userResponseStatus 2
                        <>
                          <img
                            src={ThumbsUp}
                            height='130.64px'
                            width='113.47px'
                            alt=''
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
                            height='130.64px'
                            width='113.47px'
                            alt=''
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
                            height='130.64px'
                            width='113.47px'
                            alt=''
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
                    labelclass={"d-none"}
                    name={"MeetingTitle"}
                    value={rsvpData.meetingTitle}
                    disable={true}
                  />
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col lg={6} md={6} sm={6}>
                  <Row className='mt-2'>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["MeetingTitle"]}>
                        {t("Meeting-date-and-time")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        labelclass={"d-none"}
                        name={"MeetingDateAndTime"}
                        value={convertDateTimeRangeToGMT(
                          rsvpData.meetingDate + rsvpData.startTime,
                          rsvpData.meetingDate + rsvpData.endTime
                        )}
                        disable={true}
                      />
                    </Col>
                  </Row>
                  <Row className='mt-2'>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["MeetingTitle"]}>
                        {t("Date-of-submitting-response")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        labelclass={"d-none"}
                        name={"DateOfSubmissionResponse"}
                        value={newTimeFormaterAsPerUTCTalkDateTime(
                          rsvpData.responseDate + rsvpData.responseTime
                        )}
                        disable={true}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={6}>
                  <Row className='mt-2'>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["MeetingTitle"]}>
                        {t("Meeting-location")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        labelclass={"d-none"}
                        name={"MeetingLocation"}
                        value={rsvpData.meetingLocation}
                        disable={true}
                      />
                    </Col>
                  </Row>
                  <Row className='mt-2'>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["MeetingTitle"]}>
                        {t("You-have-confirmed-your-attendance")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        labelclass={"d-none"}
                        name={"ConfirmedAttendance"}
                        value={rsvpData.userResponse}
                        disable={true}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </>
        )}

        <Col lg={3} md={3} sm={3}></Col>
      </Row>
    </section>
  );
};
export default RSVP;
