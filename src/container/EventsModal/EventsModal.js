import React, { useEffect, useState } from "react";
import styles from "./EventModal.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "../../components/elements";
import { Row, Col } from "react-bootstrap";
import {
  _justShowDateformat,
  newTimeFormaterAsPerUTC,
} from "../../commen/functions/date_formater";
import { dashboardCalendarEvent } from "../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";

const EventsModal = ({ eventModal, setEventsModal, events }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settingReducer, meetingIdReducer } = useSelector((state) => state);
  const [remainingMinutesAgo, setRemainingMinutesAgo] = useState(0);
  let diskusEventColor =
    localStorage.getItem("diskusEventColor") !== null
      ? localStorage.getItem("diskusEventColor")
      : "#000";
  let googleEventColor =
    localStorage.getItem("googleEventColor") !== null
      ? localStorage.getItem("googleEventColor")
      : "#000";
  let officeEventColor =
    localStorage.getItem("officeEventColor") !== null
      ? localStorage.getItem("officeEventColor")
      : "#000";
  let defaultColor = "#00000";
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  let lang = localStorage.getItem("i18nextLng");

  const meetingDashboardCalendarEvent = (data) => {
    dispatch(dashboardCalendarEvent(data));
    localStorage.setItem("meetingTitle", data.title);
    navigate("/DisKus/Meeting");
  };
  useEffect(() => {
    if (settingReducer?.UserProfileData !== null) {
      let settingConfigurations =
        settingReducer?.UserProfileData?.configurations;
      if (
        settingConfigurations !== null &&
        settingConfigurations !== undefined &&
        settingConfigurations.length > 0
      ) {
        let findReminingMinutesAgo = settingConfigurations.find(
          (remainsData, index) =>
            remainsData?.configKey?.toLowerCase() ===
            "Join_Meeting_Before_Minutes".toLowerCase()
        );
        console.log(
          findReminingMinutesAgo,
          "findReminingMinutesAgofindReminingMinutesAgo"
        );
        if (findReminingMinutesAgo !== undefined) {
          setRemainingMinutesAgo(Number(findReminingMinutesAgo.configValue));
        }
      }
    }
  }, [settingReducer?.UserProfileData]);

  return (
    <Modal
      show={eventModal}
      setShow={setEventsModal}
      closeButton={true}
      onHide={() => setEventsModal(false)}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["dateHeading_events__Modal"]}>
                {_justShowDateformat(events[0].eventDate + events[0].endTime)}
              </span>
            </Col>
            <Col sm={12} lg={12} md={12} className={styles["eventsBox"]}>
              {events.length > 0 &&
                events.map((eventData, index) => {
                  console.log("eventDataeventData", eventData);

                  let meetingDateTime =
                    eventData.eventDate + eventData.startTime;
                  const currentDateObj = new Date(
                    currentUTCDateTime.substring(0, 4), // Year
                    parseInt(currentUTCDateTime.substring(4, 6)) - 1, // Month (0-based)
                    currentUTCDateTime.substring(6, 8), // Day
                    currentUTCDateTime.substring(8, 10), // Hours
                    currentUTCDateTime.substring(10, 12), // Minutes
                    currentUTCDateTime.substring(12, 14) // Seconds
                  );

                  const meetingDateObj = new Date(
                    meetingDateTime.substring(0, 4), // Year
                    parseInt(meetingDateTime.substring(4, 6)) - 1, // Month (0-based)
                    meetingDateTime.substring(6, 8), // Day
                    meetingDateTime.substring(8, 10), // Hours
                    meetingDateTime.substring(10, 12), // Minutes
                    meetingDateTime.substring(12, 14) // Seconds
                  );

                  // Calculate the time difference in milliseconds
                  const timeDifference = meetingDateObj - currentDateObj;

                  // Convert milliseconds to minutes
                  const minutesDifference = Math.floor(
                    timeDifference / (1000 * 60)
                  );
                  console.log(
                    "eventDataeventData",
                    eventData,
                    Number(eventData.statusID) === 1,
                    eventData.participantRoleID === 1,
                    eventData.isQuickMeeting === true,
                    minutesDifference <= remainingMinutesAgo
                  );
                  return (
                    <section
                      key={index}
                      style={{
                        border:
                          eventData.calenderEventSource === "Diskus"
                            ? `1px solid ${diskusEventColor}`
                            : eventData.calenderEventSource === "Google"
                            ? `1px solid ${googleEventColor}`
                            : eventData.calenderEventSource === "Office"
                            ? `1px solid ${officeEventColor}`
                            : `1px solid #000`,
                      }}
                      className={styles["eventBox"]}>
                      <Row>
                        <Col
                          sm={12}
                          md={10}
                          lg={10}
                          className='d-flex flex-column '>
                          <span className={styles["event__title"]}>
                            {eventData.title}
                          </span>
                          <span className={styles["event_time"]}>
                            {newTimeFormaterAsPerUTC(
                              eventData.eventDate + eventData.startTime
                            )}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12} md={6} lg={6}>
                          {Number(eventData.statusID) === 1 &&
                          eventData.participantRoleID === 1 ? (
                            eventData.isQuickMeeting === true &&
                            minutesDifference <= remainingMinutesAgo ? (
                              // &&
                              // minutesDifference > 0
                              <Button
                                text={t("Start-meeting")}
                                className={styles["Start-Meeting"]}
                                onClick={() =>
                                  meetingDashboardCalendarEvent(eventData)
                                }
                              />
                            ) : eventData.isQuickMeeting === false &&
                              minutesDifference <= remainingMinutesAgo ? (
                              // &&
                              // minutesDifference > 0
                              //   &&
                              //     minutesDifference <= 99999999 &&
                              //     minutesDifference > 0
                              <Button
                                text={t("Start-meeting")}
                                className={styles["Start-Meeting"]}
                                onClick={() =>
                                  meetingDashboardCalendarEvent(eventData)
                                }
                              />
                            ) : null
                          ) : Number(eventData.statusID) === 10 ? (
                            eventData.participantRoleID === 2 ? (
                              <Button
                                text={t("Join-meeting")}
                                className={styles["joining-Meeting"]}
                                onClick={() =>
                                  meetingDashboardCalendarEvent(eventData)
                                }
                              />
                            ) : eventData.participantRoleID === 4 ? (
                              <Button
                                text={t("Join-meeting")}
                                className={styles["joining-Meeting"]}
                                onClick={() =>
                                  meetingDashboardCalendarEvent(eventData)
                                }
                              />
                            ) : eventData.participantRoleID === 1 ? (
                              <Button
                                text={t("Join-meeting")}
                                className={styles["joining-Meeting"]}
                                onClick={() =>
                                  meetingDashboardCalendarEvent(eventData)
                                }
                              />
                            ) : null
                          ) : null}
                        </Col>
                        <Col
                          sm={12}
                          md={6}
                          lg={6}
                          className='d-flex justify-content-end align-items-end'>
                          <p className={styles["event__type"]}>
                            {t(eventData.calenderEventType)}
                          </p>
                        </Col>
                      </Row>
                    </section>
                  );
                })}
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default EventsModal;
