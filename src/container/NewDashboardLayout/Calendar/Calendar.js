import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  forHomeCalendar,
  newDateFormaterAsPerUTC,
  startDateTimeMeetingCalendar,
} from "../../../commen/functions/date_formater";
import { Notification } from "../../../components/elements";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  getCalendarDataInit,
  getCalendarDataResponse,
} from "../../../store/actions/GetDataForCalendar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import EventsModal from "../../EventsModal/EventsModal";
import {
  allMeetingsSocket,
  getMeetingStatusfromSocket,
  mqttCurrentMeetingEnded,
} from "../../../store/actions/GetMeetingUserId";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import styles from "./Calendar.module.css";
const NewCalendar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [dates, setDates] = useState([]);
  let currentDate = new Date(); // Get the current date
  let currentDateObject = new DateObject(currentDate);
  let lang = localStorage.getItem("i18nextLng");
  let userID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  const calendarReducer = useSelector((state) => state.calendarReducer);
  const meetingIdReducer = useSelector((state) => state.meetingIdReducer);
  const NewMeetingreducer = useSelector((state) => state.NewMeetingreducer);
  const calendarRef = useRef();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calenderData, setCalenderData] = useState([]);

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [events, setEvents] = useState([]);
  console.log(events, "eventseventseventsevents");
  const [eventModal, setEventsModal] = useState(false);
  const [startDataUpdate, setStartDataUpdate] = useState("");
  const [endDataUpdate, setEndDataUpdate] = useState("");
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  console.log(open, "openopen");
  let CalenderMonthsSpan =
    localStorage.getItem("calenderMonthsSpan") !== undefined &&
    localStorage.getItem("calenderMonthsSpan") !== null
      ? localStorage.getItem("calenderMonthsSpan")
      : 1;

  useEffect(() => {
    calendarApiCall();
  }, []);

  useEffect(() => {
    if (Object.keys(calenderData).length > 0) {
      let temp = [];
      calenderData.map((cal) => {
        let formattedDate = forHomeCalendar(cal.meetingDate);
        let d = new DateObject(formattedDate);

        temp.push(d);
      });
      setDates(temp);
    }
  }, [calenderData]);

  const calendarApiCall = async () => {
    if (CalenderMonthsSpan !== null && CalenderMonthsSpan !== undefined) {
      dispatch(getCalendarDataInit(true));

      let startDates = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() -
          parseInt(
            parseInt(CalenderMonthsSpan) === 0
              ? 1
              : parseInt(CalenderMonthsSpan)
          ),
        1
      );
      let endDates = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() +
          parseInt(
            parseInt(CalenderMonthsSpan) === 0
              ? 1
              : parseInt(CalenderMonthsSpan)
          ),
        0
      );
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate:
          startDates !== null && newDateFormaterAsPerUTC(startDates) + "000000",
        EndDate:
          endDates !== null && newDateFormaterAsPerUTC(endDates) + "000000",
      };
      setStartDataUpdate(newDateFormaterAsPerUTC(startDates));
      setEndDataUpdate(newDateFormaterAsPerUTC(endDates));
      if (startDates !== null && endDates !== null) {
        dispatch(getCalendarDataResponse(navigate, t, calendarData, true));
      }
    } else {
      dispatch(getCalendarDataInit(false));
    }
  };

  // set Data for Calendar
  useEffect(() => {
    let Data = calendarReducer.CalenderData;
    if (Object.keys(Data).length > 0) {
      updateCalendarData();
    }
  }, [calendarReducer.CalenderData]);

  //  Render Calendar Data
  const updateCalendarData = (flag, meetingID) => {
    let Data = calendarReducer.CalenderData;
    if (Object.keys(Data).length > 0) {
      console.log("findDatafindDatafindData", Data);
      let newCalendarData = [];
      Data.forEach((calenderData, index) => {
        newCalendarData.push({
          pK_MDID: calenderData.pK_MDID,
          pK_CEID: calenderData.pK_CEID,
          fK_TZID: calenderData.fK_TZID,
          fK_CETID: calenderData.fK_CETID,
          fK_CESID: calenderData.fK_CESID,
          location: calenderData.location,
          eventDate: calenderData.eventDate,
          startTime: calenderData.startTime,
          endTime: calenderData.endTime,
          title: calenderData.title,
          description: calenderData.description,
          calenderEventSource:
            calenderData.fK_CESID === 1
              ? t("Google")
              : calenderData.fK_CESID === 2
              ? t("Office")
              : calenderData.fK_CESID === 3
              ? t("Diskus")
              : calenderData.fK_CESID === 4
              ? t("Microsoft")
              : "",
          calenderEventType:
            calenderData.fK_CETID === 1
              ? t("None")
              : calenderData.fK_CETID === 2
              ? t("Meeting")
              : calenderData.fK_CETID === 3
              ? t("Task")
              : calenderData.fK_CETID === 4
              ? t("Resolution")
              : calenderData.fK_CETID === 5
              ? t("Polls")
              : "",
          timeZone: calenderData.timeZone,
          statusID: calenderData.statusID,
          participantRoleID: calenderData.participantRoleID,
          isQuickMeeting: calenderData.isQuickMeeting,
          videoCallURL: calenderData.videoCallURL,
          isChat: calenderData.isChat,
          isVideoCall: calenderData.isVideoCall,
          talkGroupID: calenderData.talkGroupID,
          isPrimaryOrganizer: calenderData.isPrimaryOrganizer,
          isMinutePublished: calenderData.isMinutePublished ? true : false,
          attendeeRoleID: calenderData.attendeeRoleID,
        });
      });
      setCalendarEvents(newCalendarData);
      if (Object.keys(calenderData).length > 0) {
        let newList = calenderData;
        Data.map((cData, index) => {
          if (flag) {
            // if flag true then remove the date from the list
            if (cData.pK_MDID === meetingID) {
              let date = startDateTimeMeetingCalendar(
                cData.eventDate + cData.startTime
              );

              // just remove the  data from list and add it to first position of
              // at there we needs to remove the date field.

              // Update Calendar Data
            } else {
              let date = startDateTimeMeetingCalendar(
                cData.eventDate + cData.startTime
              );
              return newList.push({
                meetingDate: date,
              });
            }
          } else {
            let date = startDateTimeMeetingCalendar(
              cData.eventDate + cData.startTime
            );
            return newList.push({
              meetingDate: date,
            });
          }
        });
      } else {
        let newList = [];
        Data.map((cData, index) => {
          if (flag) {
            if (cData.pK_MDID === meetingID) {
              return;
            } else {
              let date = moment(
                startDateTimeMeetingCalendar(cData.eventDate + cData.startTime)
              ).format("YYYYMMDDHHMMss");
              return newList.push({
                meetingDate: date,
              });
            }
          } else {
            let date = moment(
              startDateTimeMeetingCalendar(cData.eventDate + cData.startTime)
            ).format("YYYYMMDDHHMMss");
            return newList.push({
              meetingDate: date,
            });
          }
        });
        setCalenderData(newList);
      }
    }
  };

  useEffect(() => {
    if (lang !== null) {
      if (lang === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (lang === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [lang]);

  const handleClickonDate = (dateObject, dateSelect) => {
    let selectDate = dateSelect.toString().split("/").join("");
    try {
      if (calendarEvents.length > 0) {
        const findData = calendarEvents.filter(
          (data) =>
            startDateTimeMeetingCalendar(data.eventDate + data.startTime) ===
            selectDate
        );
        console.log({ findData, calendarEvents }, "findDatafindDatafindData");
        if (findData.length > 0) {
          setEvents(findData); // Assuming findData is already an array
          setEventsModal(true);
          // Check if the event's pK_MDID matches with MeetingStatusSocket's pK_MDID
          findData.forEach((event) => {
            if (
              event.pK_MDID ===
              meetingIdReducer.MeetingStatusSocket?.meeting?.pK_MDID
            ) {
              // Update the statusID to 10
              event.statusID = 10;
              // Dispatch an action to update the global state if needed
              // dispatch(updateEventStatus(event)); // Assuming you have a proper action
            }
          });
        } else {
          showMessage(t("No-events-available-on-this-date"), "error", setOpen);
        }
      }
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  };

  const calendarClickFunction = async (value) => {
    //
    if (!dates.includes(value)) {
      setDates([...dates, value]);
    }
  };

  const handleMonthChange = (value) => {
    const formattedDate = value.format("YYYYMMDD");
    const dateString = value.toDate().toString();
    let newStartDataUpdate = moment(startDataUpdate).format("YYYYMMDD");
    let newEndDataUpdate = moment(endDataUpdate).format("YYYYMMDD");

    let year = parseInt(newEndDataUpdate.substring(0, 4));
    let month = parseInt(newEndDataUpdate.substring(4, 6)) - 1; // Month is zero-based (0-11)
    let day = parseInt(newEndDataUpdate.substring(6, 8));

    let endDataUpdateNew = new Date(year, month, day);
    endDataUpdateNew.setDate(endDataUpdateNew.getDate() + 2);
    const date = new Date(dateString);
    if (newStartDataUpdate > formattedDate) {
      let updateStartDate = new Date(
        date.getFullYear(),
        date.getMonth() -
          parseInt(
            parseInt(CalenderMonthsSpan) === 0
              ? 1
              : parseInt(CalenderMonthsSpan)
          ),
        1
      );
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate: newDateFormaterAsPerUTC(updateStartDate) + "000000",
        EndDate: newDateFormaterAsPerUTC(newStartDataUpdate) + "000000",
      };
      setStartDataUpdate(newDateFormaterAsPerUTC(updateStartDate));
      dispatch(getCalendarDataResponse(navigate, t, calendarData, false));
    } else if (newEndDataUpdate < formattedDate) {
      let updateEndDate = new Date(
        date.getFullYear(),
        date.getMonth() +
          parseInt(
            parseInt(CalenderMonthsSpan) === 0
              ? 1
              : parseInt(CalenderMonthsSpan)
          ),
        0
      );
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate: newDateFormaterAsPerUTC(endDataUpdateNew) + "000000",
        EndDate: newDateFormaterAsPerUTC(updateEndDate) + "000000",
      };
      setEndDataUpdate(newDateFormaterAsPerUTC(updateEndDate));
      dispatch(getCalendarDataResponse(navigate, t, calendarData, false));
    }
  };

  useEffect(() => {
    try {
      if (meetingIdReducer.MeetingStatusEnded !== null) {
        try {
          let meetingID = meetingIdReducer.MeetingStatusEnded?.meeting?.pK_MDID;
          console.log(meetingID, "meetingIDmeetingIDmeetingID");
          console.log("upComingEvents");

          setCalendarEvents((calendarEventData) => {
            return calendarEventData.map((data) => {
              if (Number(data.pK_MDID) === Number(meetingID)) {
                // Assuming statusID is defined somewhere and you want to update it for this data item
                data.statusID = 9;
              }
              return data; // Always return the data item
            });
          });
          setEvents((event) =>
            event.map((eventData, index) => {
              if (eventData.pK_MDID === Number(meetingID)) {
                eventData.status = 9;
              }
              return eventData;
            })
          );
          // dispatch(getMeetingStatusfromSocket(null));
          dispatch(mqttCurrentMeetingEnded(null));
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [meetingIdReducer.MeetingStatusEnded]);
  // Set Meeting Data in Calendar and Events Modal
  useEffect(() => {
    try {
      if (NewMeetingreducer.meetingStatusPublishedMqttData !== null) {
        let meetingData = NewMeetingreducer.meetingStatusPublishedMqttData;
        console.log(meetingData, "meetingDatameetingDatameetingData");
        const formattedDate =
          meetingData.dateOfMeeting &&
          new Date(
            forHomeCalendar(
              meetingData.dateOfMeeting + meetingData.meetingStartTime
            )
          );
        console.log(formattedDate, "meetingDatameetingDatameetingData");

        let findPartcipantRoleID = meetingData.meetingAttendees.find(
          (attendeeData, index) => {
            if (attendeeData.user.pK_UID === parseInt(userID)) {
              return attendeeData.meetingAttendeeRole.pK_MARID;
            }
          }
        )?.meetingAttendeeRole.pK_MARID;
        console.log(findPartcipantRoleID, "meetingDatameetingDatameetingData");

        let dashboardData = {
          pK_MDID: meetingData.pK_MDID,
          pK_CEID: meetingData.pK_CEID,
          fK_TZID: meetingData.fK_TZID,
          fK_CETID: meetingData.fK_CETID,
          fK_CESID: meetingData.fK_CESID,
          location: meetingData.location,
          eventDate: meetingData.dateOfMeeting,
          startTime: meetingData.meetingStartTime,
          endTime: meetingData.meetingEndTime,
          title: meetingData.title,
          description: "",
          calenderEventSource:
            meetingData.fK_CESID === 1
              ? t("Google")
              : meetingData.fK_CESID === 2
              ? t("Office")
              : meetingData.fK_CESID === 3
              ? t("Diskus")
              : meetingData.fK_CESID === 4
              ? t("Microsoft")
              : "",
          calenderEventType:
            meetingData.fK_CETID === 1
              ? t("None")
              : meetingData.fK_CETID === 2
              ? t("Meeting")
              : meetingData.fK_CETID === 3
              ? t("Task")
              : meetingData.fK_CETID === 4
              ? t("Resolution")
              : meetingData.fK_CETID === 5
              ? t("Polls")
              : "",
          timeZone: meetingData.timeZone,
          statusID: meetingData.status,
          participantRoleID: findPartcipantRoleID,
          isQuickMeeting: meetingData.isQuickMeeting,
          videoCallURL: meetingData.videoCallURL,
          isChat: meetingData.isChat,
          isVideoCall: meetingData.isVideoCall,
          talkGroupID: meetingData.talkGroupID,
          isPrimaryOrganizer: meetingData.isPrimaryOrganizer,
          isMinutePublished: meetingData.isMinutePublished ? true : false,
          attendeeRoleID: findPartcipantRoleID,
        };
        console.log(dashboardData, "meetingDatameetingDatameetingData");

        // Check if the meeting ID already exists in the upComingEvents array
        const isExistAlready = calendarEvents.findIndex(
          (data) => data.pK_MDID === meetingData.pK_MDID
        );

        // Its Check if the event calendar modal is open and also a for a  same date  modal
        if (eventModal) {
          events.find((newData, index) => {
            if (newData.eventDate === dashboardData.eventDate) {
              setEvents([...events, dashboardData]);
            }
          });
        }
        console.log(isExistAlready, "meetingDatameetingDatameetingData");

        // If meeting ID doesn't exist, add the meeting data to upComingEvents
        if (isExistAlready === -1) {
          setCalendarEvents([...calendarEvents, dashboardData]);
          setDates((prev) => [...prev, formattedDate]);
        } else {
          setCalendarEvents((calendarEventData) => {
            return calendarEventData.map((data) => {
              if (Number(data.pK_MDID) === Number(dashboardData.pK_MDID)) {
                return dashboardData;
              } else {
                return data;
              }
            });
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [NewMeetingreducer.meetingStatusPublishedMqttData]);

  useEffect(() => {
    if (meetingIdReducer.allMeetingsSocketData !== null) {
      try {
        let meetingData = meetingIdReducer.allMeetingsSocketData;
        console.log(
          meetingData,
          "meetingDatameetingDatameetingData allMeetingsSocketData"
        );
        const formattedDate =
          meetingData.dateOfMeeting &&
          new Date(
            forHomeCalendar(
              meetingData.dateOfMeeting + meetingData.meetingStartTime
            )
          );
        let findPartcipantRoleID = meetingData.meetingAttendees.find(
          (attendeeData) => {
            if (attendeeData.user.pK_UID === parseInt(userID)) {
              return attendeeData.meetingAttendeeRole.pK_MARID;
            }
          }
        )?.meetingAttendeeRole.pK_MARID;
        console.log(findPartcipantRoleID, "meetingDatameetingDatameetingData");

        let dashboardData = {
          pK_MDID: meetingData.pK_MDID,
          pK_CEID: meetingData.pK_CEID,
          fK_TZID: meetingData.fK_TZID,
          fK_CETID: meetingData.fK_CETID,
          fK_CESID: meetingData.fK_CESID,
          location: meetingData.location,
          eventDate: meetingData.dateOfMeeting,
          startTime: meetingData.meetingStartTime,
          endTime: meetingData.meetingEndTime,
          title: meetingData.title,
          description: "",
          calenderEventSource:
            meetingData.fK_CESID === 1
              ? t("Google")
              : meetingData.fK_CESID === 2
              ? t("Office")
              : meetingData.fK_CESID === 3
              ? t("Diskus")
              : meetingData.fK_CESID === 4
              ? t("Microsoft")
              : "",
          calenderEventType:
            meetingData.fK_CETID === 1
              ? t("None")
              : meetingData.fK_CETID === 2
              ? t("Meeting")
              : meetingData.fK_CETID === 3
              ? t("Task")
              : meetingData.fK_CETID === 4
              ? t("Resolution")
              : meetingData.fK_CETID === 5
              ? t("Polls")
              : "",
          timeZone: meetingData.timeZone,
          statusID: meetingData.status,
          participantRoleID: findPartcipantRoleID,
          isQuickMeeting: meetingData.isQuickMeeting,
          videoCallURL: meetingData.videoCallURL,
          isChat: meetingData.isChat,
          isVideoCall: meetingData.isVideoCall,
          talkGroupID: meetingData.talkGroupID,
          isPrimaryOrganizer: meetingData.isPrimaryOrganizer,
          isMinutePublished: meetingData.isMinutePublished ? true : false,
          attendeeRoleID: meetingData.attendeeRoleID,
        };
        // Check if the meeting ID already exists in the upComingEvents array
        const isExistAlready = calendarEvents.findIndex(
          (data) => data.pK_MDID === meetingData.pK_MDID
        );
        console.log(eventModal, dashboardData, events, "eventseventsevents");
        // Its Check if the event calendar modal is open and also a for a  same date  modal
        if (eventModal) {
          // Check if any event already exists with the same event date
          let findisDateSame = events.find(
            (newData) => newData.eventDate === dashboardData.eventDate
          );

          if (findisDateSame) {
            // Check if an event with the same ID already exists
            let isAlreadyEventExist = events.find(
              (newData) => newData.pK_MDID === dashboardData.pK_MDID
            );

            if (isAlreadyEventExist) {
              // Update the existing event with new data
              setEvents((allevents) => {
                return allevents.map((data) => {
                  if (Number(data.pK_MDID) === Number(dashboardData.pK_MDID)) {
                    return dashboardData;
                  } else {
                    return data;
                  }
                });
              });
            } else {
              // Add new event if ID doesn't exist
              setEvents([...events, dashboardData]);
            }
          }
        }

        console.log(isExistAlready, "meetingDatameetingDatameetingData");

        // If meeting ID doesn't exist, add the meeting data to upComingEvents
        if (isExistAlready === -1) {
          setCalendarEvents([...calendarEvents, dashboardData]);
          setDates((prev) => [...prev, formattedDate]);
        } else {
          setCalendarEvents((calendarEventData) => {
            return calendarEventData.map((data) => {
              if (Number(data.pK_MDID) === Number(dashboardData.pK_MDID)) {
                return dashboardData;
              } else {
                return data;
              }
            });
          });
        }
        dispatch(allMeetingsSocket(null));
      } catch (error) {
        dispatch(allMeetingsSocket(null));
        console.log(error);
      }
    }
  }, [meetingIdReducer.allMeetingsSocketData]);
  console.log(calendarEvents, "meetingDatameetingDatameetingData");
  console.log({ events }, "meetingDatameetingDatameetingData");

  //  Update Meeting Status Cancelled and Start Meeting
  useEffect(() => {
    try {
      if (meetingIdReducer.MeetingStatusSocket !== null) {
        let meetingStatusID =
          meetingIdReducer.MeetingStatusSocket.meetingStatusID;
        if (
          meetingIdReducer.MeetingStatusSocket.message
            .toLowerCase()
            .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
        ) {
          let meetingID = meetingIdReducer.MeetingStatusSocket.meetingID;
          console.log("upComingEvents", meetingID);

          updateCalendarData(true, meetingID);
          console.log("upComingEvents", events);

          setEvents((event) =>
            event.filter((eventData, index) => {
              return eventData.pK_MDID !== Number(meetingID);
            })
          );
          console.log("upComingEvents");
        } else if (
          meetingIdReducer.MeetingStatusSocket.message
            .toLowerCase()
            .includes("MEETING_STATUS_EDITED_STARTED".toLowerCase())
        ) {
          let meetingID = meetingIdReducer.MeetingStatusSocket.meeting.pK_MDID;
          setCalendarEvents((calendarEventData) => {
            return calendarEventData.map((data) => {
              if (Number(data.pK_MDID) === Number(meetingID)) {
                // Assuming statusID is defined somewhere and you want to update it for this data item
                data.statusID = 10;
              }
              return data; // Always return the data item
            });
          });

          setEvents((event) =>
            event.map((eventData, index) => {
              if (eventData.pK_MDID === Number(meetingID)) {
                eventData.status = 10;
              }
              return eventData;
            })
          );
          console.log("upComingEvents", events);
        }

        dispatch(getMeetingStatusfromSocket(null));
      }
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  }, [meetingIdReducer.MeetingStatusSocket]);

  return (
    <>
      {calendarReducer.Spinner === true ? (
        <section className={styles["dashboard_calendar_empty"]}>
          <Spin />
        </section>
      ) : (
        <>
          <Calendar
            lazy
            value={dates}
            disabled={false}
            calendar={calendarValue}
            locale={localValue}
            ref={calendarRef}
            showOtherDays={true}
            onFocusedDateChange={(dateFocused, dateClicked) => {
              handleClickonDate(dateFocused, dateClicked);
            }}
            multiple={false}
            onChange={calendarClickFunction}
            className={styles["custom-multi-date-picker"]}
            onMonthChange={handleMonthChange}
            currentDate={currentDateObject}
          />
        </>
      )}
      <Notification
        open={open}
        setOpen={setOpen}
      />
      {eventModal && (
        <EventsModal
          events={events}
          eventModal={eventModal}
          setEventsModal={setEventsModal}
        />
      )}
    </>
  );
};

export default NewCalendar;
