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
  getMeetingStatusfromSocket,
  mqttCurrentMeetingEnded,
} from "../../../store/actions/GetMeetingUserId";
import { showMessage } from "../../../components/elements/snack_bar/utill";
const NewCalendar = () => {
  const calendarReducer = useSelector((state) => state.calendarReducer);
  const meetingIdReducer = useSelector((state) => state.meetingIdReducer);
  const NewMeetingreducer = useSelector((state) => state.NewMeetingreducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [dates, setDates] = useState([]);
  let currentDate = new Date(); // Get the current date

  let currentDateObject = new DateObject(currentDate);
  let lang = localStorage.getItem("i18nextLng");

  const calendarRef = useRef();
  const [calendarEvents, setCalendarEvents] = useState([]);
  let userID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  const [calenderData, setCalenderData] = useState([]);

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [events, setEvents] = useState([]);
  const [eventModal, setEventsModal] = useState(false);
  const [startDataUpdate, setStartDataUpdate] = useState("");
  const [endDataUpdate, setEndDataUpdate] = useState("");
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
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
      setCalendarEvents(Data);
      if (Object.keys(calenderData).length > 0) {
        let newList = calenderData;
        Data.map((cData, index) => {
          if (flag) {
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
    if (lang !== undefined) {
      if (lang === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (lang === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [lang]);

  const handleClickonDate = (dateSelect) => {
    let selectDate = dateSelect.toString().split("/").join("");
    if (calendarEvents.length > 0) {
      const findData = calendarEvents.filter(
        (data) =>
          startDateTimeMeetingCalendar(data.eventDate + data.startTime) ===
          selectDate
      );

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
        showMessage("No-events-available-on-this-date", "error", setOpen);
      }
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

        const formattedDate =
          meetingData.dateOfMeeting &&
          new DateObject(
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

        console.log(
          findPartcipantRoleID,
          "findPartcipantRoleIDfindPartcipantRoleIDfindPartcipantRoleID"
        );
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
              ? "Google"
              : meetingData.fK_CESID === 2
              ? "Office"
              : meetingData.fK_CESID === 3
              ? "Diskus"
              : meetingData.fK_CESID === 4
              ? "Microsoft"
              : "",
          calenderEventType:
            meetingData.fK_CETID === 1
              ? "None"
              : meetingData.fK_CETID === 2
              ? "Meeting"
              : meetingData.fK_CETID === 3
              ? "Task"
              : meetingData.fK_CETID === 4
              ? "Resolution"
              : meetingData.fK_CETID === 5
              ? "Polls"
              : "",
          timeZone: meetingData.timeZone,
          statusID: meetingData.status,
          participantRoleID: findPartcipantRoleID,
          isQuickMeeting: meetingData.isQuickMeeting,
        };
        // Check if the meeting ID already exists in the upComingEvents array
        const isExistAlready = calendarEvents.findIndex(
          (data) => data.pK_MDID === meetingData.pK_MDID
        );
        // Its Check if the event calendar modal is open and also a for a  same date  modal
        if (eventModal) {
          events.find((newData) => {
            if (newData.eventDate === dashboardData.eventDate) {
              setEvents([...events, dashboardData]);
            }
          });
        }
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
    } catch {}
  }, [NewMeetingreducer.meetingStatusPublishedMqttData]);
  //  Update Meeting Status Cancelled and Start Meeting
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
        updateCalendarData(true, meetingID);
        console.log("upComingEvents");

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
  }, [meetingIdReducer.MeetingStatusSocket]);

  return (
    <>
      {calendarReducer.Spinner === true ? (
        <section className="bg-white">
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
            className="custom-multi-date-picker"
            onMonthChange={handleMonthChange}
            currentDate={currentDateObject}
          />
        </>
      )}
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
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
