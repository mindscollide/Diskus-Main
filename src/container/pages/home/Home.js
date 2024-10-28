import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import noTask from "../../../assets/images/DashBoardTask.svg";
import {
  ResultMessage,
  Notification,
  Modal,
  Button,
} from "../../../components/elements";
import moment from "moment";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  getCalendarDataInit,
  getCalendarDataResponse,
  HideNotificationCalendarData,
} from "../../../store/actions/GetDataForCalendar";
import { useTranslation } from "react-i18next";
import { Calendar, DateObject } from "react-multi-date-picker";
import ModalMeeting from "../../modalmeeting/ModalMeeting";
import {
  startDateTimeMeetingCalendar,
  newDateFormaterAsPerUTC,
  forHomeCalendar,
} from "../../../commen/functions/date_formater";
import {
  getTodoListInit,
  GetWeeklyToDoCount,
  HideNotificationTodo,
  SearchTodoListApi,
  SetSpinnersTrue,
} from "../../../store/actions/ToDoList_action";
import { HideNotificationAuth } from "../../../store/actions/Auth_action";
import {
  GetWeeklyMeetingsCount,
  GetUpcomingEvents,
  HideNotificationMeetings,
  SetSpinnerTrue,
  getMeetingStatusfromSocket,
  mqttCurrentMeetingEnded,
} from "../../../store/actions/GetMeetingUserId";
import "./dashboard-module.css";
import {
  getNotifications,
  getusernotificationinit,
  HideNotificationUserNotificationData,
} from "../../../store/actions/GetUserNotification";
import {
  cleareAssigneesState,
  HideNotification,
} from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import { cleareMessage, setLoader } from "../../../store/actions/Auth2_actions";
import VerificationFailedIcon from "./../../../assets/images/failed.png";
import { GetNotes, getNotes_Init } from "../../../store/actions/Notes_actions";
import ModalAddNote from "../../notes/modalAddNote/ModalAddNote";
import { getUserSetting } from "../../../store/actions/GetUserSetting";
import EventsModal from "../../EventsModal/EventsModal";
import ModalViewNote from "../../notes/modalViewNote/ModalViewNote";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalToDoList from "../../todolistModal/ModalToDoList";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import Stats from "../../NewDashboardLayout/Stats/Stats";
import { showMessage } from "../../../components/elements/snack_bar/utill";

const Home = () => {
  const { t } = useTranslation();
  const [updateNotesModalHomePage, setUpdateNotesModalHomePage] =
    useState(false);
  //Modal Todolist State
  const [showTodo, setShowTodo] = useState(false);
  // const [viewFlag, setViewFlag] = useState(false);
  const state = useSelector((state) => state);
  const {
    settingReducer,
    calendarReducer,
    toDoListReducer,
    meetingIdReducer,
    NewMeetingreducer,
    auth,
    Authreducer,
    NotesReducer,
    assignees,
  } = state;
  const { RecentActivityData, SocketRecentActivityData } = settingReducer;
  const [upComingEvents, setUpComingEvents] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  //For Calendar
  const dispatch = useDispatch();
  const [modalNote, setModalNote] = useState(false);
  //for view modal notes
  const calendarRef = useRef();
  const navigate = useNavigate();
  const [calenderData, setCalenderData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [recentActivityData, setRecentActivityData] = useState([]);
  // get new date
  let date = new Date();
  let currentDateObject = new DateObject(date);
  const [dates, setDates] = useState([]);
  const [activateBlur, setActivateBlur] = useState(false);
  let Blur = localStorage.getItem("blur");
  //ToDo Table Data
  const [rowsToDo, setRowToDo] = useState([]);
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [eventModal, setEventsModal] = useState(false);
  const [todoViewModal, setTodoViewModal] = useState(false);
  let lang = localStorage.getItem("i18nextLng");
  const [getNoteID, setGetNoteID] = useState(0);
  const [show, setShow] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [startDataUpdate, setStartDataUpdate] = useState("");
  const [endDataUpdate, setEndDataUpdate] = useState("");
  const [events, setEvents] = useState([]);

  const userID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let CalenderMonthsSpan =
    localStorage.getItem("calenderMonthsSpan") !== undefined &&
    localStorage.getItem("calenderMonthsSpan") !== null
      ? localStorage.getItem("calenderMonthsSpan")
      : 1;
  let currentDate = new Date(); // Get the current date

  // Add CalenderMonthsSpan months and set the day to the last day of the month

  useEffect(() => {
    if (lang === "ar") {
      moment.locale(lang);
    } else if (lang === "fr") {
      moment.locale(lang);
    } else if (lang === "en") {
      moment.locale(lang);
    } else {
      moment.locale("en");
    }
  }, [lang]);

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

  const callApi = async () => {
    dispatch(SetSpinnerTrue(true));
    dispatch(SetSpinnersTrue());
    dispatch(getusernotificationinit());
    dispatch(getCalendarDataInit(true));

    await dispatch(getUserSetting(navigate, t));
    // Notes Feature
    if (checkFeatureIDAvailability(6)) {
      await dispatch(getNotes_Init());

      let Data = {
        UserID: parseInt(createrID),
        OrganizationID: JSON.parse(OrganizationID),
        Title: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(GetNotes(navigate, Data, t));
    }

    let Data2 = {
      UserID: parseInt(createrID),
    };
    // todoList Feature
    if (checkFeatureIDAvailability(14)) {
      await dispatch(getTodoListInit());
      let searchData = {
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: 0,
      };
      await dispatch(SearchTodoListApi(navigate, searchData, 1, 50, t));
      dispatch(GetWeeklyToDoCount(navigate, Data2, t));
    }
    dispatch(GetWeeklyMeetingsCount(navigate, createrID, t));
    dispatch(GetUpcomingEvents(navigate, Data2, t));
    dispatch(getNotifications(navigate, createrID, t));
  };

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

  useEffect(() => {
    calendarApiCall();
    callApi();

    return () => {
      dispatch(cleareAssigneesState());
    };
  }, []);

  useEffect(() => {
    if (Blur !== null) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

  //  Render Calendar Data
  const updateCalendarData = (flag, meetingID) => {
    let Data = calendarReducer.CalenderData;
    if (Object.keys(Data).length > 0) {
      setCalendarEvents(Data);
      if (Object.keys(calenderData).length > 0) {
        let newList = calenderData;
        Data.map((cData) => {
          if (flag) {
            if (cData.pK_MDID === meetingID) {
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

  // set Data for Calendar
  useEffect(() => {
    let Data = calendarReducer.CalenderData;
    if (Object.keys(Data).length > 0) {
      updateCalendarData();
    }
  }, [calendarReducer.CalenderData]);

  //  Update Meeting Status Cancelled and Start Meeting
  useEffect(() => {
    if (meetingIdReducer.MeetingStatusSocket !== null) {
      if (
        meetingIdReducer.MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
      ) {
        let meetingID = meetingIdReducer.MeetingStatusSocket.meetingID;
        updateCalendarData(true, meetingID);
        console.log("upComingEvents");
        setUpComingEvents((upcomingeventData) =>
          upcomingeventData.filter(
            (meetingData) =>
              Number(meetingData.meetingDetails.pK_MDID) !== Number(meetingID)
          )
        );
        setEvents((event) =>
          event.filter((eventData, index) => {
            return eventData.pK_MDID !== Number(meetingID);
          })
        );
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
  }, [meetingIdReducer.MeetingStatusSocket]);

  useEffect(() => {
    if (Object.keys(calenderData).length > 0) {
      let temp = [];
      calenderData.map((cal, index) => {
        let formattedDate = forHomeCalendar(cal.meetingDate);
        let d = new DateObject(formattedDate);

        temp.push(d);
      });
      setDates(temp);
    }
  }, [calenderData]);

  useEffect(() => {
    if (
      SocketRecentActivityData !== null &&
      SocketRecentActivityData !== undefined &&
      Object.keys(SocketRecentActivityData).length > 0
    ) {
      setRecentActivityData([SocketRecentActivityData, ...recentActivityData]);
    }
  }, [SocketRecentActivityData]);

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

  useEffect(() => {
    try {
      if (meetingIdReducer.allMeetingsSocketData !== null) {
        let meetingData = meetingIdReducer.allMeetingsSocketData;

        let findPartcipantRoleID = meetingData.meetingAttendees.find(
          (attendeeData) => {
            if (attendeeData.user.pK_UID === parseInt(userID)) {
              return attendeeData.meetingAttendeeRole.pK_MARID;
            }
          }
        )?.meetingAttendeeRole.pK_MARID;

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
          const existingEvent = events.find(
            (newData) => newData.eventDate === dashboardData.eventDate
          );
          const isEventAlreadyExist = events.findIndex(
            (eventDetails) => eventDetails.pK_MDID === dashboardData.pK_MDID
          );
          if (existingEvent) {
            // If event with the same date already exists, update its details
            if (isEventAlreadyExist !== -1) {
              setEvents((eventDetails) =>
                eventDetails.map((event_data) => {
                  if (event_data.pK_MDID === dashboardData.pK_MDID) {
                    return dashboardData;
                  } else {
                    return event_data;
                  }
                })
              );
            } else {
              setEvents([...events, dashboardData]);
            }
          }
        }

        // If meeting ID doesn't exist, add the meeting data to upComingEvents
        if (isExistAlready !== -1) {
          setCalendarEvents((calendarEventData) => {
            return calendarEventData.map((data) => {
              return Number(data.pK_MDID) === Number(dashboardData.pK_MDID)
                ? dashboardData
                : data;
            });
          });
        }
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  }, [meetingIdReducer.allMeetingsSocketData]);
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

        setUpComingEvents(updatedUpcomingEvents); // Set the updated state
      } else {
        console.log("upComingEvents", upComingEvents);
        setUpComingEvents([]);
      }
    } catch (error) {
      // Log any errors for debugging
    }
  }, [meetingIdReducer.UpcomingEventsData]);

  // Remove task from mqtt response
  useEffect(() => {
    try {
      if (toDoListReducer.socketTodoStatusData !== null) {
        let payloadData = toDoListReducer.socketTodoStatusData;
        if (payloadData.todoStatusID === 6) {
          setRowToDo((rowsData) => {
            return rowsData.filter((newData, index) => {
              return newData.pK_TID !== payloadData.todoid;
            });
          });
        } else {
          setRowToDo((rowsData) => {
            return rowsData.map((newData, index) => {
              if (newData.pK_TID === payloadData.todoid) {
                const newObj = {
                  ...newData,
                  status: {
                    pK_TSID: payloadData.todoStatusID,
                    status:
                      payloadData.todoStatusID === 1
                        ? "In Progress"
                        : payloadData.todoStatusID === 2
                        ? "Pending"
                        : payloadData.todoStatusID === 3
                        ? "Upcoming"
                        : payloadData.todoStatusID === 4
                        ? "Cancelled"
                        : payloadData.todoStatusID === 5
                        ? "Completed"
                        : payloadData.todoStatusID === 6
                        ? "Deleted"
                        : payloadData.todoStatusID === 7,
                  },
                };
                return newObj;
              }
              return newData;
            });
          });
        }
      }
    } catch {}
  }, [toDoListReducer.socketTodoStatusData]);

  // render Notes Data
  useEffect(() => {
    try {
      if (
        NotesReducer.GetAllNotesResponse !== null &&
        NotesReducer.GetAllNotesResponse !== undefined
      ) {
        if (NotesReducer.GetAllNotesResponse.getNotes.length > 0) {
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data) => {
            notes.push(data);
          });
        }
      }
    } catch (error) {}
  }, [NotesReducer.GetAllNotesResponse]);

  useEffect(() => {
    try {
      if (
        toDoListReducer.SocketTodoActivityData !== null &&
        toDoListReducer.SocketTodoActivityData !== undefined
      ) {
        if (
          toDoListReducer.SocketTodoActivityData.comitteeID === -1 &&
          toDoListReducer.SocketTodoActivityData.groupID === -1 &&
          toDoListReducer.SocketTodoActivityData.meetingID === -1
        ) {
          let dataToSort = [
            toDoListReducer.SocketTodoActivityData.todoList,
            ...rowsToDo,
          ];

          const sortedTasks = dataToSort.sort((taskA, taskB) => {
            const deadlineA = taskA?.deadlineDateTime;
            const deadlineB = taskB?.deadlineDateTime;

            // Compare the deadlineDateTime values as numbers for sorting
            return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
          });

          setRowToDo(sortedTasks.slice(0, 15));
        }
      }
    } catch (error) {}
  }, [toDoListReducer.SocketTodoActivityData]);

  //get todolist reducer
  useEffect(() => {
    if (
      toDoListReducer.SearchTodolist !== null &&
      toDoListReducer.SearchTodolist !== undefined
    ) {
      if (toDoListReducer.SearchTodolist.toDoLists.length > 0) {
        let dataToSort = [...toDoListReducer.SearchTodolist.toDoLists];
        const sortedTasks = dataToSort.sort((taskA, taskB) => {
          const deadlineA = taskA?.deadlineDateTime;
          const deadlineB = taskB?.deadlineDateTime;

          // Compare the deadlineDateTime values as numbers for sorting
          return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
        });
        setRowToDo(sortedTasks.slice(0, 15));
      } else {
        setRowToDo([]);
      }
    } else {
      setRowToDo([]);
    }
  }, [toDoListReducer.SearchTodolist]);

  useEffect(() => {
    if (Object.keys(RecentActivityData).length > 0) {
      setRecentActivityData(RecentActivityData);
    }
  }, [RecentActivityData]);

  useEffect(() => {
    dispatch(HideNotificationAuth());
    dispatch(HideNotificationCalendarData());
    dispatch(HideNotificationTodo());
    dispatch(HideNotificationUserNotificationData());
    dispatch(HideNotificationMeetings());
    dispatch(HideNotification());
  }, [
    auth.ResponseMessage,
    meetingIdReducer.ResponseMessage,
    assignees.ResponseMessage,
    Authreducer.ResponseMessage,
  ]);

  useEffect(() => {
    if (
      Authreducer.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      showMessage(
        Authreducer.VerifyOTPEmailResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (
      Authreducer.EnterPasswordResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      dispatch(cleareMessage());
    } else if (
      Authreducer.OrganizationCreateResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      showMessage(
        Authreducer.OrganizationCreateResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (
      Authreducer.CreatePasswordResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      showMessage(
        Authreducer.CreatePasswordResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (
      Authreducer.GetSelectedPackageResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      showMessage(
        Authreducer.GetSelectedPackageResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    } else if (
      Authreducer.EmailValidationResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      showMessage(
        Authreducer.EmailValidationResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);

  const calendarClickFunction = async (value) => {
    //
    if (!dates.includes(value)) {
      setDates([...dates, value]);
    }
  };

  const closeModal = () => {
    setActivateBlur(false);
    setLoader(false);
    navigate("/");
  };

  // Meeting Status End Updated
  useEffect(() => {
    try {
      if (meetingIdReducer.MeetingStatusEnded !== null) {
        try {
          let meetingID = meetingIdReducer.MeetingStatusEnded?.meeting?.pK_MDID;

          setUpComingEvents((upcomingeventData) => {
            return upcomingeventData.filter((meetingData) => {
              return (
                Number(meetingData.meetingDetails.pK_MDID) !== Number(meetingID)
              );
            });
          });
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

  const handleMonthChange = (value) => {
    const formattedDate = value.format("YYYYMMDD");
    const dateString = value.toDate().toString();
    let newStartDataUpdate = moment(startDataUpdate).format("YYYYMMDD");
    let newEndDataUpdate = moment(endDataUpdate).format("YYYYMMDD");

    var year = parseInt(newEndDataUpdate.substring(0, 4));
    var month = parseInt(newEndDataUpdate.substring(4, 6)) - 1; // Month is zero-based (0-11)
    var day = parseInt(newEndDataUpdate.substring(6, 8));

    var endDataUpdateNew = new Date(year, month, day);
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
          }
        });
      } else {
        showMessage(t("No-events-available-on-this-date"), "error", setOpen);
      }
    }
  };

  return (
    <>
      <Container fluid className="Dashboard-Main-Container">
        <Row>
          <Col sm={12} md={12} lg={12}>
            <section className="StatsBox">
              <Stats />
            </section>
          </Col>
        </Row>
        <Row>
          <Col lg={4} md={4} sm={12} className="dashboard-container">
            <section className="dashboard-col-1">
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div className="whiteBackground Spinner home-calendar-spinner calendar_home   ">
                    {calendarReducer.Spinner === true ? (
                      <Spin />
                    ) : (
                      <>
                        <Row>
                          <Col lg={12} md={12} sm={12} xs={12}>
                            <Calendar
                              lazy
                              value={dates}
                              disabled={false}
                              calendar={calendarValue}
                              locale={localValue}
                              ref={calendarRef}
                              showOtherDays={true}
                              onFocusedDateChange={(
                                dateFocused,
                                dateClicked
                              ) => {
                                handleClickonDate(dateFocused, dateClicked);
                              }}
                              multiple={false}
                              onChange={calendarClickFunction}
                              className="custom-multi-date-picker"
                              onMonthChange={handleMonthChange}
                              currentDate={currentDateObject}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div className="whiteBackground Spinner home-meeting_event-spinner event_home ">
                    {meetingIdReducer.Spinner === true ? (
                      <Spin />
                    ) : (
                      <>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <h1 className="upcoming-events">
                              {t("Up-coming-event")}
                            </h1>

                            <div className="Upcoming-Events-Box">
                              {upComingEvents.length === 0 ? (
                                <ResultMessage
                                  icon={
                                    <img
                                      src={noTask}
                                      alt=""
                                      width={"100%"}
                                      draggable="false"
                                    />
                                  }
                                  subTitle={
                                    <span className="UpcomingEvent">
                                      {t("No-upcoming-events")}
                                    </span>
                                  }
                                  className="notification-text"
                                />
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </section>
          </Col>
          <Col lg={4} md={4} sm={12} className="m-0 "></Col>
        </Row>
      </Container>
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
      {show ? (
        <ModalMeeting
          show={show}
          setShow={setShow}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
          // this is check from where its called 3 is from Home
          checkFlag={3}
        />
      ) : activateBlur ? (
        <Modal
          show={activateBlur}
          setShow={() => {
            setActivateBlur();
          }}
          ButtonTitle={"Block"}
          centered
          size={"md"}
          modalHeaderClassName="d-none"
          ModalBody={
            <>
              <>
                <Row className="mb-1">
                  <Col lg={12} md={12} xs={12} sm={12}>
                    <Row>
                      <Col className="d-flex justify-content-center">
                        <img
                          src={VerificationFailedIcon}
                          width={60}
                          className={"allowModalIcon"}
                          alt=""
                          draggable="false"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center mt-4">
                        <label className={"allow-limit-modal-p"}>
                          {t(
                            "The-organization-subscription-is-not-active-please-contact-your-admin"
                          )}
                        </label>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            </>
          }
          ModalFooter={
            <>
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className={"Ok-Successfull-btn"}
                      text={t("Ok")}
                      onClick={closeModal}
                    />
                  </Col>
                </Row>
              </Col>
            </>
          }
        />
      ) : updateNotesModalHomePage ? (
        <ModalViewNote
          viewNotes={updateNotesModalHomePage}
          setViewNotes={setUpdateNotesModalHomePage}
          flag={true}
          setGetNoteID={setGetNoteID}
        />
      ) : modalNote ? (
        <ModalAddNote addNewModal={modalNote} setAddNewModal={setModalNote} />
      ) : eventModal ? (
        <EventsModal
          events={events}
          eventModal={eventModal}
          setEventsModal={setEventsModal}
        />
      ) : todoViewModal ? (
        <ModalViewToDo
          viewFlagToDo={todoViewModal}
          setViewFlagToDo={setTodoViewModal}
        />
      ) : showTodo ? (
        <ModalToDoList show={showTodo} setShow={setShowTodo} />
      ) : null}
    </>
  );
};
export default Home;
