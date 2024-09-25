import React, { useEffect, useState } from "react";
import styles from "./Events.module.css";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { Button, ResultMessage } from "../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  multiDatePickerDateChangIntoUTC,
  newTimeFormaterAsPerUTCFullDate,
} from "../../../commen/functions/date_formater";
import noTask from "../../../assets/images/DashBoardTask.svg";
import { dashboardCalendarEvent } from "../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  GetUpcomingEvents,
  getMeetingStatusfromSocket,
  mqttCurrentMeetingEnded,
} from "../../../store/actions/GetMeetingUserId";

const Events = () => {
  const { meetingIdReducer } = useSelector((state) => state);
  const { t } = useTranslation();
  let createrID = localStorage.getItem("userID");
  const [upComingEvents, setUpComingEvents] = useState([]);
  let getCurrentDate = moment(new Date()).format("DD");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUTCDateTime = multiDatePickerDateChangIntoUTC(new Date());
  useEffect(() => {
    let Data2 = {
      UserID: parseInt(createrID),
    };
    dispatch(GetUpcomingEvents(navigate, Data2, t));
  }, []);
  //  Set Upcoming Events
  useEffect(() => {
    try {
      if (
        meetingIdReducer.UpcomingEventsData.length > 0 &&
        meetingIdReducer.UpcomingEventsData !== null &&
        meetingIdReducer.UpcomingEventsData !== undefined
      ) {
        // Create a new array with updated objects without mutating the original state
        const updatedUpcomingEvents = meetingIdReducer.UpcomingEventsData.map(
          (event) => {
            // Assuming statusID is within each event object
            return {
              ...event, // Spread the properties of the original event object
              meetingDetails: {
                ...event.meetingDetails, // Spread the properties of meetingDetails
                statusID: event.meetingDetails.statusID /* updated value */, // Update the statusID here
              },
            };
          }
        );

        console.log("upComingEvents", updatedUpcomingEvents);
        setUpComingEvents(updatedUpcomingEvents); // Set the updated state
      } else {
        console.log("upComingEvents", upComingEvents);
        setUpComingEvents([]);
      }
    } catch (error) {
      // Log any errors for debugging
    }
  }, [meetingIdReducer.UpcomingEventsData]);

  useEffect(() => {
    if (meetingIdReducer.MeetingStatusSocket !== null) {
      let meetingStatusID =
        meetingIdReducer.MeetingStatusSocket.meetingStatusID;
      if (
        meetingIdReducer.MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
      ) {
        let meetingID = meetingIdReducer.MeetingStatusSocket.meetingID;
        // updateCalendarData(true, meetingID);
        console.log("upComingEvents");
        setUpComingEvents((upcomingeventData) =>
          upcomingeventData.filter(
            (meetingData) =>
              Number(meetingData.meetingDetails.pK_MDID) !== Number(meetingID)
          )
        );

        console.log("upComingEvents");
        setUpComingEvents((upcomingeventData) =>
          upcomingeventData.map((meetingData) => {
            return (
              Number(meetingData.meetingDetails.pK_MDID) !== Number(meetingID)
            );
          })
        );
      } else if (
        meetingIdReducer.MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_STARTED".toLowerCase())
      ) {
        let meetingID = meetingIdReducer.MeetingStatusSocket.meeting.pK_MDID;

        setUpComingEvents((upcomingeventData) =>
          upcomingeventData.map((meetingData) => {
            if (
              Number(meetingData.meetingDetails.pK_MDID) === Number(meetingID)
            ) {
              // Update the statusID of the meeting data
              meetingData.meetingDetails.statusID = 10;
            }
            return meetingData; // Return the meeting data whether modified or not
          })
        );
      }

      dispatch(getMeetingStatusfromSocket(null));
      // if (meetingStatusID === 4) {
      //   updateCalendarData(true, meetingID);
      // }
    }
  }, [meetingIdReducer.MeetingStatusSocket]);

  const meetingDashboardCalendarEvent = (data) => {
    // Create a shallow copy of the data object to prevent mutation
    const dashboardData = {
      pK_MDID: data.meetingDetails.pK_MDID,
      pK_CEID: data.meetingEvent.pK_CEID,
      fK_TZID: 0,
      fK_CETID: 0,
      fK_CESID: 0,
      location: data.meetingEvent.location,
      eventDate: data.meetingEvent.meetingDate,
      startTime: data.meetingEvent.startTime,
      endTime: data.meetingEvent.endTime,
      title: data.meetingDetails.title,
      description: data.meetingDetails.description,
      calenderEventSource: "Diskus",
      calenderEventType: "Meeting",
      timeZone: "Asia/Karachi",
      statusID: data.meetingDetails.statusID,
      participantRoleID: data.participantRoleID,
      isQuickMeeting: data.meetingDetails.isQuickMeeting,
      isPrimaryOrganizer: data.isPrimaryOrganizer,
      isChat: data.meetingDetails.isChat,
      isVideoCall: data.meetingDetails.isVideoCall,
      videoCallURL: data.videoCallURL,
      talkGroupID: data.talkGroupID,
    };

    // Dispatch and navigate with no mutation
    dispatch(dashboardCalendarEvent({ ...dashboardData }));
    navigate("/DisKus/Meeting");
  };

  const upcomingEventsHandler = (upComingEvents) => {
    console.log("upComingEvents", upComingEvents);
    let flag = false;
    let indexforUndeline = null;
    try {
      upComingEvents.map((upcomingEventsData, index) => {
        if (
          upcomingEventsData.meetingEvent.meetingDate.slice(6, 8) ===
          getCurrentDate
        ) {
          if (indexforUndeline === null && flag === false) {
            // if (index - 1 >= 0) {
            flag = true;
            indexforUndeline = index;
            // }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }

    return upComingEvents.map((upcomingEventsData, index) => {
      let meetingDateTime =
        upcomingEventsData.meetingEvent.meetingDate +
        upcomingEventsData.meetingEvent.startTime;
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
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      return (
        <>
          {upcomingEventsData.meetingEvent.meetingDate.slice(6, 8) ===
          getCurrentDate ? (
            <div
              className={
                (upcomingEventsData.meetingDetails.statusID === 1 &&
                  minutesDifference < 15) ||
                upcomingEventsData.meetingDetails.statusID === 10
                  ? "event-details upcoming_events todayEvent border-0 d-flex justify-content-center align-items-center"
                  : "event-details upcoming_events todayEvent border-0"
              }
            >
              <div
                className={
                  (upcomingEventsData.meetingDetails.statusID === 1 &&
                    minutesDifference < 15) ||
                  upcomingEventsData.meetingDetails.statusID === 10
                    ? "event-details-block"
                    : ""
                }
              >
                <p className="events-description ">
                  {upcomingEventsData.meetingDetails.title}
                </p>
                <p className="events-dateTime ">
                  {newTimeFormaterAsPerUTCFullDate(
                    upcomingEventsData.meetingEvent.meetingDate +
                      upcomingEventsData.meetingEvent.startTime
                  )}
                </p>
              </div>
              {upcomingEventsData.meetingDetails.statusID === 1 &&
              upcomingEventsData.participantRoleID === 1 ? (
                upcomingEventsData.meetingDetails.isQuickMeeting === true &&
                minutesDifference < 15 ? (
                  // &&
                  // minutesDifference > 0
                  //   &&
                  //   minutesDifference <= 99999999 &&
                  //   minutesDifference > 0
                  <Button
                    text={t("Start-meeting")}
                    className="Start-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : upcomingEventsData.meetingDetails.isQuickMeeting ===
                    false &&
                  upcomingEventsData.participantRoleID === 1 &&
                  minutesDifference < 15 ? (
                  // &&
                  // minutesDifference > 0
                  //   &&
                  //     minutesDifference <= 99999999 &&
                  //     minutesDifference > 0
                  <Button
                    text={t("Start-meeting")}
                    className="Start-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : null
              ) : upcomingEventsData.meetingDetails.statusID === 10 ? (
                upcomingEventsData.participantRoleID === 2 ? (
                  <Button
                    text={t("Join-meeting")}
                    className="joining-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : upcomingEventsData.participantRoleID === 4 ? (
                  <Button
                    text={t("Join-meeting")}
                    className="joining-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : upcomingEventsData.participantRoleID === 1 ? (
                  <Button
                    text={t("Join-meeting")}
                    className="joining-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : null
              ) : null}
            </div>
          ) : indexforUndeline !== null && indexforUndeline === index ? (
            <>
              <span className="bordertop" />
              <div
                className={
                  (upcomingEventsData.meetingDetails.statusID === 1 &&
                    minutesDifference < 15) ||
                  upcomingEventsData.meetingDetails.statusID === 10
                    ? "event-details d-flex justify-content-center align-items-center"
                    : "event-details"
                }
              >
                <div
                  className={
                    (upcomingEventsData.meetingDetails.statusID === 1 &&
                      minutesDifference < 15) ||
                    upcomingEventsData.meetingDetails.statusID === 10
                      ? "event-details-block"
                      : ""
                  }
                >
                  <p className="events-description">
                    {upcomingEventsData.meetingDetails.title}
                  </p>
                  <p className="events-dateTime">
                    {newTimeFormaterAsPerUTCFullDate(
                      upcomingEventsData.meetingEvent.meetingDate +
                        upcomingEventsData.meetingEvent.startTime
                    )}
                  </p>
                </div>
                {upcomingEventsData.meetingDetails.statusID === 1 &&
                upcomingEventsData.participantRoleID === 1 ? (
                  upcomingEventsData.meetingDetails.isQuickMeeting === true &&
                  minutesDifference < 15 ? (
                    <Button
                      text={t("Start-meeting")}
                      className="Start-Meeting-Upcoming"
                      onClick={() => {
                        meetingDashboardCalendarEvent(upcomingEventsData);
                        localStorage.setItem(
                          "meetingTitle",
                          upcomingEventsData.meetingDetails.title
                        );
                      }}
                    />
                  ) : upcomingEventsData.meetingDetails.isQuickMeeting ===
                      false && minutesDifference < 15 ? (
                    <Button
                      text={t("Start-meeting")}
                      className="Start-Meeting-Upcoming"
                      onClick={() => {
                        meetingDashboardCalendarEvent(upcomingEventsData);

                        localStorage.setItem(
                          "meetingTitle",
                          upcomingEventsData.meetingDetails.title
                        );
                      }}
                    />
                  ) : null
                ) : upcomingEventsData.meetingDetails.statusID === 10 ? (
                  upcomingEventsData.participantRoleID === 2 ? (
                    <Button
                      text={t("Join-meeting")}
                      className="joining-Meeting-Upcoming"
                      onClick={() => {
                        meetingDashboardCalendarEvent(upcomingEventsData);
                        localStorage.setItem(
                          "meetingTitle",
                          upcomingEventsData.meetingDetails.title
                        );
                      }}
                    />
                  ) : upcomingEventsData.participantRoleID === 4 ? (
                    <Button
                      text={t("Join-meeting")}
                      className="joining-Meeting-Upcoming"
                      onClick={() => {
                        meetingDashboardCalendarEvent(upcomingEventsData);
                        localStorage.setItem(
                          "meetingTitle",
                          upcomingEventsData.meetingDetails.title
                        );
                      }}
                    />
                  ) : upcomingEventsData.participantRoleID === 1 ? (
                    <Button
                      text={t("Join-meeting")}
                      className="joining-Meeting-Upcoming"
                      onClick={() => {
                        meetingDashboardCalendarEvent(upcomingEventsData);
                        localStorage.setItem(
                          "meetingTitle",
                          upcomingEventsData.meetingDetails.title
                        );
                      }}
                    />
                  ) : null
                ) : null}
              </div>
            </>
          ) : (
            <div
              className={
                (upcomingEventsData.meetingDetails.statusID === 1 &&
                  minutesDifference < 15) ||
                upcomingEventsData.meetingDetails.statusID === 10
                  ? "event-details d-flex justify-content-center align-items-center"
                  : "event-details"
              }
            >
              <div
                className={
                  (upcomingEventsData.meetingDetails.statusID === 1 &&
                    minutesDifference < 15) ||
                  upcomingEventsData.meetingDetails.statusID === 10
                    ? "event-details-block"
                    : ""
                }
              >
                <p className="events-description">
                  {upcomingEventsData.meetingDetails.title}
                </p>
                <p className="events-dateTime">
                  {newTimeFormaterAsPerUTCFullDate(
                    upcomingEventsData.meetingEvent.meetingDate +
                      upcomingEventsData.meetingEvent.startTime
                  )}
                </p>
              </div>
              {upcomingEventsData.meetingDetails.statusID === 1 &&
              upcomingEventsData.participantRoleID === 1 ? (
                upcomingEventsData.meetingDetails.isQuickMeeting === true &&
                minutesDifference < 15 ? (
                  <Button
                    text={t("Start-meeting")}
                    className="Start-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : upcomingEventsData.meetingDetails.isQuickMeeting ===
                    false && minutesDifference < 15 ? (
                  <Button
                    text={t("Start-meeting")}
                    className="Start-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : null
              ) : upcomingEventsData.meetingDetails.statusID === 10 ? (
                upcomingEventsData.participantRoleID === 2 ? (
                  <Button
                    text={t("Join-meeting")}
                    className="joining-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : upcomingEventsData.participantRoleID === 4 ? (
                  <Button
                    text={t("Join-meeting")}
                    className="joining-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : upcomingEventsData.participantRoleID === 1 ? (
                  <Button
                    text={t("Join-meeting")}
                    className="joining-Meeting-Upcoming"
                    onClick={() => {
                      meetingDashboardCalendarEvent(upcomingEventsData);
                      localStorage.setItem(
                        "meetingTitle",
                        upcomingEventsData.meetingDetails.title
                      );
                    }}
                  />
                ) : null
              ) : null}
            </div>
          )}
        </>
      );
    });
  };
  useEffect(() => {
    try {
      if (meetingIdReducer.MeetingStatusEnded !== null) {
        try {
          let meetingID = meetingIdReducer.MeetingStatusEnded?.meeting?.pK_MDID;
          console.log(meetingID, "meetingIDmeetingIDmeetingID");
          setUpComingEvents((upcomingeventData) => {
            return upcomingeventData.filter((meetingData) => {
              return (
                Number(meetingData.meetingDetails.pK_MDID) !== Number(meetingID)
              );
            });
          });

          dispatch(mqttCurrentMeetingEnded(null));
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [meetingIdReducer.MeetingStatusEnded]);

  return (
    <>
      {meetingIdReducer.Spinner === true ? (
        <Spin />
      ) : (
        <>
          {upComingEvents.length === 0 ? (
            <section className={styles["Events_Empty"]}>
              <img src={noTask} alt="" width={300} draggable="false" />
              <span className={styles["No_UpcomingEvent_Text"]}>
                {t("No-upcoming-events")}
              </span>
            </section>
          ) : (
            <>{upcomingEventsHandler(upComingEvents)}</>
          )}
        </>
      )}
    </>
  );
};

export default Events;
