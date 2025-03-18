import React, { useEffect, useState } from "react";
import styles from "./Events.module.css";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { Button } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  isSameAsToday,
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
import { convertToArabicNumerals } from "../../../commen/functions/regex";

const Events = () => {
  const UpcomingEventsDataReducerData = useSelector(
    (state) => state.meetingIdReducer.UpcomingEventsData
  );

  const userProfileData = useSelector(
    (state) => state.settingReducer?.UserProfileData
  );
  const MQTTUpcomingEvents = useSelector(
    (state) => state.meetingIdReducer.MQTTUpcomingEvents
  );

  const MeetingStatusSocket = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusSocket
  );
  const MeetingStatusEnded = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusEnded
  );
  const removeUpcomingEvents = useSelector(
    (state) => state.NewMeetingreducer.removeUpcomingEventMeeting
  );
  const Spinner = useSelector((state) => state.meetingIdReducer.Spinner);

  const { t } = useTranslation();
  let createrID = localStorage.getItem("userID");
  const [upComingEvents, setUpComingEvents] = useState([]);
  const [remainingMinutesAgo, setRemainingMinutesAgo] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUTCDateTime = multiDatePickerDateChangIntoUTC(new Date());
  const currentLanguage = localStorage.getItem("i18nextLng");
  useEffect(() => {
    let Data2 = {
      UserID: parseInt(createrID),
    };
    dispatch(GetUpcomingEvents(navigate, Data2, t));
  }, []);
  //  Set Upcoming Events
  useEffect(() => {
    try {
      if (UpcomingEventsDataReducerData?.length > 0) {
        // Create a new array with updated objects without mutating the original state
        const updatedUpcomingEvents = UpcomingEventsDataReducerData.map(
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

        setUpComingEvents(updatedUpcomingEvents); // Set the updated state
      } else {
        console.log("upComingEvents", upComingEvents);
        setUpComingEvents([]);
      }
    } catch (error) {
      // Log any errors for debugging
    }
  }, [UpcomingEventsDataReducerData]);
  // Function to add MQTT data to local data
  function addMQTTData(localData, mqttData) {
    // Check if localData is empty
    let highestKey =
      localData.length > 0
        ? localData.reduce((maxKey, item) => Math.max(maxKey, item.key), 0)
        : -1; // Set to -1 so the first key will be 0

    // Increment the key for new MQTT data
    const newKey = highestKey + 1;

    // Return a new MQTT data object with the incremented key
    return { ...mqttData, key: newKey };
  }

  useEffect(() => {
    try {
      if (MQTTUpcomingEvents) {
        console.log("upComingEventsmqtt", upComingEvents);
        console.log("upComingEventsmqtt", MQTTUpcomingEvents);

        // Ensure no duplicates by filtering out any existing record with the same pK_MDID
        let filteredEvents = upComingEvents.filter(
          (event) =>
            event.meetingDetails.pK_MDID !==
            MQTTUpcomingEvents.meetingDetails.pK_MDID
        );

        // Add new or replaced MQTT event
        filteredEvents.push(MQTTUpcomingEvents);

        // Ensure at most 3 records by keeping the earliest start times
        filteredEvents = filteredEvents
          .sort(
            (a, b) =>
              parseInt(a.meetingEvent.startTime) -
              parseInt(b.meetingEvent.startTime)
          )
          .slice(0, 3); // Keep only the 3 earliest meetings Sort by startTime

        if (
          Object.keys(upComingEvents).length < 3 &&
          MQTTUpcomingEvents.meetingDetails &&
          MQTTUpcomingEvents.meetingEvent
        ) {
          const newMQTTData = addMQTTData(upComingEvents, MQTTUpcomingEvents);
          if (
            !filteredEvents.some(
              (event) =>
                event.meetingDetails.pK_MDID ===
                newMQTTData.meetingDetails.pK_MDID
            )
          ) {
            filteredEvents.push(newMQTTData);
          }
        }

        // Update state with the final, filtered, sorted events
        setUpComingEvents(filteredEvents);
        console.log("Final updated events:", filteredEvents);
      }
    } catch (error) {
      console.error("Error processing MQTT data:", error);
    }
  }, [MQTTUpcomingEvents]);

  useEffect(() => {
    if (MeetingStatusSocket !== null) {
      if (
        MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
      ) {
        let meetingID = MeetingStatusSocket.meetingID;
        setUpComingEvents((upcomingeventData) =>
          upcomingeventData.filter(
            (meetingData) =>
              Number(meetingData?.meetingDetails?.pK_MDID) !== Number(meetingID)
          )
        );

        setUpComingEvents((upcomingeventData) =>
          upcomingeventData.map((meetingData) => {
            return (
              Number(meetingData.meetingDetails.pK_MDID) !== Number(meetingID)
            );
          })
        );
      } else if (
        MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_STARTED".toLowerCase())
      ) {
        let meetingID = MeetingStatusSocket.meeting.pK_MDID;

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
    }
  }, [MeetingStatusSocket]);

  useEffect(() => {
    if (userProfileData !== null) {
      let settingConfigurations = userProfileData?.configurations;
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
  }, [userProfileData]);

  const meetingDashboardCalendarEvent = (data) => {
    // Create a shallow copy of the data object to prevent mutation
    console.log("startMeetingRequest", data);
    const dashboardData = {
      isPrimaryOrganizer: data.isPrimaryOrganizer,
      isMinutePublished: data.meetingDetails.isMinutePublished,
      pK_MDID: data.meetingDetails.pK_MDID,
      pK_CEID: data.meetingEvent.pK_CEID,
      fK_TZID: 0,
      fK_CETID: data.meetingEvent.fK_CETID,
      fK_CESID: data.meetingEvent.fK_CESID,
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
      isChat: data.meetingDetails.isChat,
      isVideoCall: data.meetingDetails.isVideoCall,
      videoCallURL: data.meetingDetails.videoCallURL,
      talkGroupID: data.talkGroupID,
    };
    console.log("startMeetingRequest", dashboardData);
    // Dispatch and navigate with no mutation
    dispatch(dashboardCalendarEvent({ ...dashboardData }));
    navigate("/Diskus/Meeting");
  };

  const upcomingEventsHandler = (upComingEvents) => {
    console.log("upComingEvents", upComingEvents);
    let flag = false;
    let indexforUndeline = null;
    try {
      upComingEvents.map((upcomingEventsData, index) => {
        let { isSame } = isSameAsToday(
          `${upcomingEventsData.meetingEvent.meetingDate}${upcomingEventsData.meetingEvent.startTime}`
        );
        console.log(isSame, "isSameisSame");
        if (isSame) {
          flag = true;
          indexforUndeline = index;
        }
      });
    } catch (error) {
      console.log(error);
    }

    return upComingEvents.map((upcomingEventsData, index) => {
      console.log(upcomingEventsData, "upcomingEventsData");

      if (!upcomingEventsData?.meetingEvent) {
        console.warn("DataIsMissing", upcomingEventsData);
        return null;
      }
      let meetingDateTime =
        upcomingEventsData?.meetingEvent?.meetingDate +
        upcomingEventsData?.meetingEvent?.startTime;
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

      let checkisTodayorActive =
        upcomingEventsData?.meetingDetails?.statusID === 1 ||
        upcomingEventsData?.meetingDetails?.statusID === 10;

      let { isSame } = isSameAsToday(
        `${upcomingEventsData.meetingEvent.meetingDate}${upcomingEventsData.meetingEvent.startTime}`
      );
      console.log(isSame, "isSameisSame");
      return (
        <>
          {isSame ? (
            <>
              <div
                className={`${styles["upcoming_events"]} ${styles["event-details"]} ${styles["todayEvent"]} border-0 d-flex align-items-center`}
              >
                <div
                  className={
                    (upcomingEventsData.meetingDetails.statusID === 1 &&
                      minutesDifference < remainingMinutesAgo) ||
                    upcomingEventsData.meetingDetails.statusID === 10
                      ? `${styles["event-details-block"]}`
                      : `${styles["event-details-block"]}`
                  }
                >
                  <p className={styles["events-description"]}>
                    {upcomingEventsData.meetingDetails.title}
                  </p>
                  <p className={styles["events-dateTime"]}>
                    {newTimeFormaterAsPerUTCFullDate(
                      upcomingEventsData.meetingEvent.meetingDate +
                        upcomingEventsData.meetingEvent.startTime,
                      currentLanguage
                    )}
                  </p>
                </div>
                {upcomingEventsData.meetingDetails.statusID === 1 &&
                upcomingEventsData.participantRoleID === 1 ? (
                  upcomingEventsData.meetingDetails.isQuickMeeting === true &&
                  minutesDifference < remainingMinutesAgo ? (
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting-Upcoming"]}
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
                    minutesDifference < remainingMinutesAgo ? (
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting-Upcoming"]}
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
                      className={styles["joining-Meeting-Upcoming"]}
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
                      className={styles["joining-Meeting-Upcoming"]}
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
                      className={styles["joining-Meeting-Upcoming"]}
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
            <>
              {flag && <span className={styles["bordertop"]} />}

              <div
                className={
                  (upcomingEventsData.meetingDetails.statusID === 1 &&
                    minutesDifference < remainingMinutesAgo) ||
                  upcomingEventsData.meetingDetails.statusID === 10
                    ? `${styles["upcoming_events"]} ${styles["event-details"]} ${styles["todayEvent"]} border-0 d-flex align-items-center`
                    : ` ${styles["event-details"]}`
                }
              >
                <div
                  className={
                    (upcomingEventsData.meetingDetails.statusID === 1 &&
                      minutesDifference < remainingMinutesAgo) ||
                    upcomingEventsData.meetingDetails.statusID === 10
                      ? `${styles["event-details-block"]}`
                      : ""
                  }
                >
                  <p className={styles["events-description"]}>
                    {upcomingEventsData.meetingDetails.title}
                  </p>
                  <p className={styles["events-dateTime"]}>
                    {newTimeFormaterAsPerUTCFullDate(
                      upcomingEventsData.meetingEvent.meetingDate +
                        upcomingEventsData.meetingEvent.startTime,
                      currentLanguage
                    )}
                  </p>
                </div>
                {upcomingEventsData.meetingDetails.statusID === 1 &&
                upcomingEventsData.participantRoleID === 1 ? (
                  upcomingEventsData.meetingDetails.isQuickMeeting === true &&
                  minutesDifference < remainingMinutesAgo ? (
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting-Upcoming"]}
                      onClick={() => {
                        meetingDashboardCalendarEvent(upcomingEventsData);
                        localStorage.setItem(
                          "meetingTitle",
                          upcomingEventsData.meetingDetails.title
                        );
                      }}
                    />
                  ) : upcomingEventsData.meetingDetails.isQuickMeeting ===
                      false && minutesDifference < remainingMinutesAgo ? (
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting-Upcoming"]}
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
                      className={styles["joining-Meeting-Upcoming"]}
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
                      className={styles["joining-Meeting-Upcoming"]}
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
                      className={styles["joining-Meeting-Upcoming"]}
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
          )}
        </>
      );
    });
  };
  useEffect(() => {
    try {
      if (MeetingStatusEnded !== null) {
        try {
          let meetingID = MeetingStatusEnded?.meeting?.pK_MDID;
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
  }, [MeetingStatusEnded]);
  useEffect(() => {
    try {
      if (removeUpcomingEvents !== null) {
        setUpComingEvents((upcomingeventData) => {
          return upcomingeventData.filter((meetingData) => {
            return (
              Number(meetingData.meetingDetails.pK_MDID) !==
              Number(removeUpcomingEvents)
            );
          });
        });
      }
    } catch (error) {}
  }, [removeUpcomingEvents]);
  return (
    <>
      {Spinner === true ? (
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
