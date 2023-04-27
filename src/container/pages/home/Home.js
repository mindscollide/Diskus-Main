import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";
import NoRecentActivity from "../../../assets/images/No-Recent-Activity.png";
import IconAttachment from "../../../assets/images/AttachmentNotes.svg";
import PlusButton from '../../../assets/images/PlusButton.svg'
import styles from "./dashboard-module.css";
import StarIcon from "../../../assets/images/Star.svg";
import hollowstar from "../../../assets/images/Hollowstar.svg";
import NotesMainEmpty from '../../../assets/images/Notes_Dashboard.svg';
// import TalkIcon from "../../../assets/images/newElemnts/Diskus_TalkIcon.svg";
import {
  CustomTableToDoDashboard,
  CustomTextProgressbar,
  ResultMessage,
  Paper,
  Notification,
  Modal,
  Button,
  Loader,
} from "../../../components/elements";
import moment from "moment";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
// import Calendar from "react-calendar";
// Branch number 3;
// Branch number 3;
// Branch number 3;

import {
  getCalendarDataResponse,
  HideNotificationCalendarData,
} from "../../../store/actions/GetDataForCalendar";
import { useTranslation } from "react-i18next";
import { Calendar, DateObject } from "react-multi-date-picker";
import ModalMeeting from "../../modalmeeting/ModalMeeting";
import {
  Mailbox,
} from "react-bootstrap-icons";
import { newTimeFormaterAsPerUTCFullDate, _justShowDateformat, _justShowDay, forRecentActivity, startDateTimeMeetingCalendar } from "../../../commen/functions/date_formater";
import TimeAgo from "timeago-react";
import {
  GetTodoListByUser,
  GetWeeklyToDoCount,
  HideNotificationTodo,
} from "../../../store/actions/ToDoList_action";
import { HideNotificationAuth } from "../../../store/actions/Auth_action";
import {
  GetWeeklyMeetingsCount,
  GetUpcomingEvents,
  HideNotificationMeetings,
} from "../../../store/actions/GetMeetingUserId";
import "./dashboard-module.css";
import {
  getNotifications,
  HideNotificationUserNotificationData,
} from "../../../store/actions/GetUserNotification";
import {
  HideNotification
} from "../../../store/actions/Get_List_Of_Assignees";
import { useLoaderData, useNavigate } from "react-router-dom";
import { cleareMessage, setLoader } from "../../../store/actions/Auth2_actions";
import VerificationFailedIcon from "./../../../assets/images/failed.png";
import { GetNotes, GetNotesByIdAPI } from "../../../store/actions/Notes_actions";
import ModalAddNote from "../../modalAddNote/ModalAddNote";
import ModalUpdateNote from "../../modalUpdateNote/ModalUpdateNote";


const Home = () => {
  const dCheck = useLoaderData();
  console.log("dCheck", dCheck);
  //For Localization
  const { t } = useTranslation();
  const [updateNotesModalHomePage, setUpdateNotesModalHomePage] = useState(false)
  // const [viewFlag, setViewFlag] = useState(false);
  const state = useSelector((state) => state);
  const {
    settingReducer,
    calendarReducer,
    toDoListReducer,
    meetingIdReducer,
    auth,
    Authreducer,
    NotesReducer
  } = state;
  const { RecentActivityData } = settingReducer;


  const [notes, setNotes] = useState([])
  console.log("notesnotesnotesnotes", notes);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  // for sub menus Icons
  const [subIcons, setSubIcons] = useState(false);
  //For Calendar
  const dispatch = useDispatch();
  const [modalNote, setModalNote] = useState(false)
  const [updateShow, setUpdateShow] = useState(false);

  //for view modal notes
  const [viewModalShow, setViewModalShow] = useState(false);
  const calendarRef = useRef();
  const navigate = useNavigate();
  const [calenderData, setCalenderData] = useState([]);
  const [recentActivityData, setRecentActivityData] = useState([]);
  // const [open, setOpen] = useState(false);
  // get new date
  let date = new Date();
  let getCurrentDate = moment(date).format("DD");
  console.log("date", getCurrentDate);
  let format = "YYYYMMDD";

  const [dates, setDates] = useState([]);
  const [activateBlur, setActivateBlur] = useState(false);

  let Blur = localStorage.getItem("blur");

  useEffect(() => {
    if (Blur != undefined) {
      console.log("Blur", Blur);

      setActivateBlur(true);
    } else {
      console.log("Blur", Blur);

      setActivateBlur(false);
    }
  }, [Blur]);
  // set Data for Calendar
  useEffect(() => {
    let Data = calendarReducer.CalenderData;
    console.log("Data", Data);
    let newList = [];
    if (Object.keys(Data).length > 0) {
      Data.map((cData, index) => {
        return newList.push({
          meetingDate: cData.meetingDate,
        });
      });
      setCalenderData(newList);
      console.log("newListnewListnewList", calenderData);
    }
  }, [calendarReducer.CalenderData]);

  useEffect(() => {
    var temp = [];
    console.log("calenderDatacalenderData", calenderData)
    calenderData.map((cal, index) => {
      var year = moment(startDateTimeMeetingCalendar(cal.meetingDate + "000000")).format("YYYY");
      var month = moment(startDateTimeMeetingCalendar(cal.meetingDate + "000000")).format("MM");
      var day = moment(startDateTimeMeetingCalendar(cal.meetingDate + "000000")).format("DD");
      console.log("calenderDatacalenderData", year, month, day)
      var d = new DateObject().set({
        year: year,
        month: month,
        day: day,
        format,
      });
      console.log("calenderDatacalenderData", d)
      temp.push(d);
    });
    setDates(temp);
  }, [calenderData]);

  // calling Api for getting data for calendar
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    dispatch(getCalendarDataResponse(userID, t));
  }, []);

  //ToDo Table Data
  const [rowsToDo, setRowToDo] = useState([]);
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

  let lang = localStorage.getItem("i18nextLng");

  useEffect(() => {
    if (lang !== undefined) {
      if (lang === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (lang === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
      }
    }
  }, [lang]);

  //dispatch gettodolist api
  useEffect(() => {
    let data = { UserID: parseInt(createrID), NumberOfRecords: 300 };
    dispatch(GetTodoListByUser(data, t));
  }, []);
  useEffect(() => {
    let OrganizationID = localStorage.getItem("organizationID")
    let Data = { UserID: parseInt(createrID), OrganizationID: JSON.parse(OrganizationID) }
    dispatch(GetNotes(Data, t))
  }, [])
  // for view modal  handler
  const viewModalHandler = (id) => {
    console.log("viewID", id);

  };
  const handleClickNoteModal = () => {
    setModalNote(true)
  }
  console.log(notes, "NotesReducerNotesReducer")
  // render Notes Data 
  useEffect(() => {
    if (NotesReducer.GetAllNotesResponse !== null && NotesReducer.GetAllNotesResponse.length > 0) {
      let notes = [];
      NotesReducer.GetAllNotesResponse.map((data, index) => {
        notes.push(data)
      })
      setNotes(notes)
    }
  }, [NotesReducer.GetAllNotesResponse])

  //get todolist reducer
  useEffect(() => {
    if (
      Object.keys(toDoListReducer.AllTodolistData).length > 0 &&
      toDoListReducer.AllTodolistData !== undefined
    ) {
      console.log(
        "todolistreducer.AllTodolistData",
        toDoListReducer,
        toDoListReducer.AllTodolistData
      );
      setRowToDo(toDoListReducer.AllTodolistData);
    } else {
      console.log(
        "todolistreducer.AllTodolistData",
        toDoListReducer.AllTodolistData
      );
      setRowToDo([]);
    }
  }, [toDoListReducer.AllTodolistData]);

  const columnsToDo = [
    {
      title: t("Task"),
      dataIndex: "title",
      key: "title",
      width: "35%",
      className: "titleDashboard",
      ellipsis: true,
      // render: (text) => <span className="fw-bold">{text}</span>,
    },
    {
      title: t("Deadline"),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      width: "40%",
      className: "deadlineDashboard",
      render: (text) => {
        return _justShowDateformat(text);
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "25%",
      className: "statusDashboard",
      render: (text) => {
        return toDoListReducer.AllTodolistData.map((data, index) => {
          if (index === 0) {
            if (text.status === "In progress") {
              return (
                <span className="MontserratMedium-500 color-D8A709">
                  {text.status}
                </span>
              );
            } else if (text.status === "On hold") {
              return (
                <span className="MontserratMedium-500 color-F68732">
                  {text.status}
                </span>
              );
            } else if (text.status === "Pending") {
              return (
                <span className="MontserratMedium-500 color-5F78D6">
                  {text.status}
                </span>
              );
            } else if (text.status === "Cancelled") {
              return (
                <span className="MontserratMedium-500 color-F16B6B">
                  {text.status}
                </span>
              );
            } else if (text.status === "Completed") {
              return (
                <span className="MontserratMedium-500 color-81DB86">
                  {text.status}
                </span>
              );
            } else if (text.status === "Reopen") {
              return (
                <span className="MontserratMedium-500 color-F68732">
                  {text.status}
                </span>
              );
            }
          }
        });
      },
    },
  ];

  // Api Hit Meeting Count
  useEffect(() => {
    let Data = {
      UserId: parseInt(createrID),
    };
    let Data2 = {
      UserID: parseInt(createrID),
    };
    dispatch(GetWeeklyMeetingsCount(createrID, t));
    dispatch(GetWeeklyToDoCount(Data2, t));
    dispatch(GetUpcomingEvents(Data2, t));
  }, []);
  useEffect(() => {
    dispatch(getNotifications(createrID, t));
  }, []);
  const [meetingCountThisWeek, setMeetingCountThisWeek] = useState(0);
  const [upcomingMeetingCountThisWeek, setUpcomingMeetingCountThisWeek] =
    useState(0);

  const [todoListThisWeek, setTodoListThisWeek] = useState(0);
  const [todoListAssignedThisWeek, setTodoListAssignedThisWeek] = useState(0);

  useEffect(() => {
    setMeetingCountThisWeek(meetingIdReducer.TotalMeetingCountThisWeek);
    setUpcomingMeetingCountThisWeek(
      meetingIdReducer.TotalNumberOfUpcommingMeetingsInWeek
    );
  }, [meetingIdReducer]);

  useEffect(() => {
    setTodoListThisWeek(toDoListReducer.TotalTodoCountThisWeek);
    setTodoListAssignedThisWeek(
      toDoListReducer.TotalNumberOfUpcommingTodoInWeek
    );
  }, [toDoListReducer]);


  useEffect(() => {
    if (Object.keys(RecentActivityData).length > 0) {
      setRecentActivityData(RecentActivityData);
    }
  }, [RecentActivityData]);
  let valueMeeting = meetingCountThisWeek - upcomingMeetingCountThisWeek;
  let toDoValue = todoListThisWeek - todoListAssignedThisWeek;
  useEffect(() => {
    dispatch(HideNotificationAuth());
    dispatch(HideNotificationCalendarData());
    dispatch(HideNotificationTodo());
    dispatch(HideNotificationUserNotificationData());
    dispatch(HideNotificationMeetings());
    dispatch(HideNotification());
  }, [auth.ResponseMessage]);
  const showsubTalkIcons = () => {
    setSubIcons(!subIcons);
  };
  
  useEffect(() => {
    if (Authreducer.VerifyOTPEmailResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.VerifyOTPEmailResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EnterPasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: false,
        message: "",
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.OrganizationCreateResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.CreatePasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.CreatePasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.GetSelectedPackageResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.GetSelectedPackageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EmailValidationResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EmailValidationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);

  const [show, setShow] = useState(false);

  const [editFlag, setEditFlag] = useState(false);

  const calendarClickFunction = async (e) => {
    console.log("Calendar Clicked");
    // await setShow(true);
  };

  const trackRtlStyle = lang === "ar" ? { left: "2px", right: "auto" } : {};

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

  console.log("updateNotesModalHomePage", updateNotesModalHomePage);
  console.log("updateNotesModalHomePage", modalNote);
  const closeModal = () => {
    setActivateBlur(false);
    setLoader(false);
    navigate("/");
  };

  const upcomingEventsHandler = (meetingIdReducer) => {
    let flag = false;
    let indexforUndeline = null;
    meetingIdReducer.UpcomingEventsData.map((upcomingEventsData, index) => {
      if (
        upcomingEventsData.meetingEvent.meetingDate.slice(6, 8) !=
        getCurrentDate
      ) {
        if (indexforUndeline === null && flag === false) {
          if (index - 1 >= 0) {
            flag = true;
            indexforUndeline = index;
            console.log("upcomingEventsupcomingEvents2323", index);
          }
        }
      }
    });

    return meetingIdReducer.UpcomingEventsData.map(
      (upcomingEventsData, index) => {
        console.log("upcomingEvents index", index);
        return (
          <>
            {upcomingEventsData.meetingEvent.meetingDate.slice(6, 8) ===
              getCurrentDate ? (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div
                    className="event-details upcoming_events  border-0"
                    onClick={() =>
                      viewModalHandler(
                        upcomingEventsData.meetingDetails.pK_MDID
                      )
                    }
                  >
                    <p className="events-description MontserratSemiBold-600">
                      {upcomingEventsData.meetingDetails.title}
                    </p>
                    <p className="events-dateTime MontserratSemiBold-600">
                      {newTimeFormaterAsPerUTCFullDate(upcomingEventsData.meetingEvent.meetingDate + upcomingEventsData.meetingEvent.startTime)}

                    </p>
                  </div>
                </Col>
              </Row>
            ) : indexforUndeline != null && indexforUndeline === index ? (
              <>
                {console.log(
                  "upcomingEventsupcomingEventsupcomingEventsupcomingEvents",
                  indexforUndeline,
                  index,
                  indexforUndeline === index
                )}
                <span className="bordertop" />
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <div
                      className="event-details"
                      onClick={() =>
                        viewModalHandler(
                          upcomingEventsData.meetingDetails.pK_MDID
                        )
                      }
                    >
                      <p className="events-description">
                        {upcomingEventsData.meetingDetails.title}
                      </p>
                      <p className="events-dateTime">
                        {newTimeFormaterAsPerUTCFullDate(upcomingEventsData.meetingEvent.meetingDate + upcomingEventsData.meetingEvent.startTime)}
                      </p>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div
                    className="event-details"
                    onClick={() =>
                      viewModalHandler(
                        upcomingEventsData.meetingDetails.pK_MDID
                      )
                    }
                  >
                    <p className="events-description">
                      {upcomingEventsData.meetingDetails.title}
                    </p>
                    <p className="events-dateTime">
                      {newTimeFormaterAsPerUTCFullDate(upcomingEventsData.meetingEvent.meetingDate + upcomingEventsData.meetingEvent.startTime)}
                    </p>
                  </div>
                </Col>
              </Row>
            )}
          </>
        );
      }
    );
  };
  const OpenUpdateNotesModal = (id) => {
    dispatch(GetNotesByIdAPI(id, t, setViewModalShow, setUpdateShow, setUpdateNotesModalHomePage, 3));
  }
  return (
    <>
      <Container fluid className="Dashboard-Main-Container">
        <Row>
          <Col lg={4} md={4} sm={12} className="dashboard-container">
            <Row className="mb-3">
              <Col
                lg={12}
                md={12}
                sm={false}
                xs={false}
                className="text-center mt-2 MontserratSemiBold-600 color-5a5a5a  "
              >
                <div className="whiteBackground home-meetingcount border">
                  {meetingIdReducer.Spinner === true ? (
                    <Spin />
                  ) : (
                    <CustomTextProgressbar
                      value={valueMeeting}
                      maxValue={meetingCountThisWeek}
                    >
                      <div className="progressbar-count m-0 ">
                        <strong>
                          {upcomingMeetingCountThisWeek}/{meetingCountThisWeek}
                        </strong>
                      </div>
                      <div className="home-meetingcount-text">
                        {t("Meeting")} <br />
                        {t("This-week")}
                      </div>
                    </CustomTextProgressbar>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="Dashboard-Calendar  ">
                <div className="whiteBackground Spinner home-calendar-spinner border">
                  {calendarReducer.Spinner === true ||
                    meetingIdReducer.Spinner === true ? (
                    <Spin />
                  ) : (
                    <>
                      <Row style={{ height: "37vh" }}>
                        <Col lg={12} md={12} sm={12} xs={12}>
                          <Calendar
                            value={dates}
                            disabled={false}
                            // onChange={setDates}
                            minDate={moment().toDate()}
                            calendar={calendarValue}
                            locale={localValue}
                            ref={calendarRef}
                            showOtherDays={true}
                            multiple={false}
                            onChange={calendarClickFunction}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                        // className="text-left"
                        >
                          <h1 className="upcoming-events">
                            {t("Up-coming-event")}
                          </h1>

                          <div className="Upcoming-Events-Box">
                            {meetingIdReducer.UpcomingEventsData.length ===
                              0 ? (
                              <ResultMessage
                                icon={<Mailbox className="notification-icon" />}
                                subTitle={t("No-upcoming-events")}
                                className="notification-text"
                              />
                            ) : (
                              upcomingEventsHandler(meetingIdReducer)
                            )}
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={4} md={4} sm={12} className="m-0 ">
            <Row className="mb-3">
              <Col
                lg={12}
                md={12}
                sm={false}
                className="text-center mt-2 color-5a5a5a  MontserratSemiBold-600  "
              >
                <div className="whiteBackground home-todolistcount border">
                  {toDoListReducer.Spinner === true ? (
                    <Spin />
                  ) : (
                    <CustomTextProgressbar
                      value={toDoValue}
                      maxValue={todoListThisWeek}
                    >
                      <div className="progressbar-count m-0">
                        <strong>
                          {todoListAssignedThisWeek}/{todoListThisWeek}
                        </strong>
                      </div>
                      <div className="home-todocount-text">
                        {t("Things")} <br />
                        {t("To-do")}
                      </div>
                    </CustomTextProgressbar>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="DashboardTodoTable ">
                {toDoListReducer.TableSpinner === true ? (
                  <CustomTableToDoDashboard
                    loading={{
                      spinning: toDoListReducer.TableSpinner,
                      indicator: <Spin />,
                    }}
                    column={columnsToDo}
                    className="dashboard-todo"
                    rows={rowsToDo}
                    labelTitle={t("Todo-list")}
                    scroll={{ y: 355 }}
                  />
                ) : rowsToDo.length > 0 &&
                  rowsToDo !== undefined &&
                  rowsToDo !== null ? (
                  <CustomTableToDoDashboard
                    column={columnsToDo}
                    className="dashboard-todo"
                    rows={rowsToDo}
                    labelTitle={t("Todo-list")}
                    pagination={
                      rowsToDo.length < 10
                        ? false
                        : {
                          total: rowsToDo.length,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total}`,
                        }
                    }
                  />
                ) : (
                  <Paper>
                    <h1 className="todo-Heading color-5a5a5a MontserratSemiBold-600">
                      {t("Todo-list")}
                    </h1>
                    <ResultMessage
                      // icon={<Paragraph className="nodata-table-icon" />}
                      icon={
                        <img src={TodoMessageIcon1} height={210} width={250} />
                      }
                      title="NO TASK"
                      className="NoTask"

                    // title={t("Nothing-to-do")}
                    // subTitle={t("Enjoy-or-discuss-with-your-colleagues")}
                    // extra={<Button text="+ Create New Meeting" />}
                    />
                  </Paper>
                )}
              </Col>
            </Row>
          </Col>
          <Col lg={4} md={4} sm={12} className="m-0 p-0">
            <h1 className="border recent-activity color-5a5a5a MontserratSemiBold-600">
              {t("Recent-activity")}
            </h1>
            <div className="whiteBackground Spinner home-recentactivity-scrollbar-container mt-2 border">
              {/* <h1 className="recent-activity">Recent Activity</h1> */}
              <div className={recentActivityData.length === 0 ?"Recent-Activity-Box-Empty ":"Recent-Activity-Box "}>
                {settingReducer.Spinner === true ? (
                  <Spin />
                ) : recentActivityData.length === 0 ? (
                  <ResultMessage
                    icon={
                      <img
                        src={NoRecentActivity}
                        className="recent-activity-icon"
                      />
                    }
                    subTitle={t("No-activity")}
                    className="recent-activity-text"
                  />
                ) : recentActivityData !== null &&
                  recentActivityData !== undefined ? (
                  recentActivityData.map((recentActivityData, index) => {
                    console.log(recentActivityData, "recentActivityData")
                    return (
                      <>
                        <Row>
                          <Col sm={1}>
                            {recentActivityData.notificationTypes.pK_NTID ===
                              1 ? (
                              <div className="desc-notification-user ">
                                {/* Bell Notification SVG Code */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="28.132"
                                  viewBox="0 0 22.476 28.132"
                                >
                                  <g
                                    id="Group_167"
                                    data-name="Group 167"
                                    transform="translate(-1407.762 -110)"
                                  >
                                    <g
                                      id="Icon_ionic-ios-notifications-outline"
                                      data-name="Icon ionic-ios-notifications-outline"
                                      transform="translate(1400.987 106.069)"
                                    >
                                      <path
                                        id="Path_2"
                                        data-name="Path 2"
                                        d="M20.37,28.336a.911.911,0,0,0-.893.717,1.762,1.762,0,0,1-.352.766,1.329,1.329,0,0,1-1.132.415,1.351,1.351,0,0,1-1.132-.415,1.762,1.762,0,0,1-.352-.766.911.911,0,0,0-.893-.717h0a.917.917,0,0,0-.893,1.118,3.142,3.142,0,0,0,3.27,2.609,3.136,3.136,0,0,0,3.27-2.609.92.92,0,0,0-.893-1.118Z"
                                        fill="#fff"
                                      />
                                      <path
                                        id="Path_3"
                                        data-name="Path 3"
                                        d="M28.969,24.764c-1.083-1.427-3.213-2.264-3.213-8.655,0-6.56-2.9-9.2-5.6-9.83-.253-.063-.436-.148-.436-.415v-.2a1.725,1.725,0,0,0-1.687-1.73h-.042a1.725,1.725,0,0,0-1.687,1.73v.2c0,.26-.183.352-.436.415-2.707.64-5.6,3.27-5.6,9.83,0,6.391-2.13,7.221-3.213,8.655A1.4,1.4,0,0,0,8.177,27H27.872A1.4,1.4,0,0,0,28.969,24.764Zm-2.742.408H9.83a.308.308,0,0,1-.232-.513,8.518,8.518,0,0,0,1.477-2.348,15.934,15.934,0,0,0,1.005-6.2,10.783,10.783,0,0,1,1.47-6.1A4.512,4.512,0,0,1,16.27,8.065a2.464,2.464,0,0,0,1.308-.738.556.556,0,0,1,.837-.014,2.547,2.547,0,0,0,1.322.752,4.512,4.512,0,0,1,2.721,1.941,10.783,10.783,0,0,1,1.47,6.1,15.934,15.934,0,0,0,1.005,6.2,8.615,8.615,0,0,0,1.512,2.384A.291.291,0,0,1,26.227,25.172Z"
                                        fill="#fff"
                                      />
                                    </g>
                                  </g>
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              2 ? (
                              <div className="desc-notification-user ">
                                {/* Meeting SVG COde */}
                                <svg
                                  id="Group_169"
                                  data-name="Group 169"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="25.206"
                                  viewBox="0 0 30.798 25.206"
                                >
                                  <path
                                    id="Path_20"
                                    data-name="Path 20"
                                    d="M144.506,13.372a4.143,4.143,0,0,0-4.161-4.146c-7.479-.022-15.029-.022-22.441,0a4.192,4.192,0,0,0-4.153,4.153c-.026,3.5-.028,7.192,0,11.284a4.168,4.168,0,0,0,3.441,4.079,8.947,8.947,0,0,0,1,.11c.179.015.36.028.542.047l.587.058v.591c0,.32,0,.639,0,.956,0,.738.009,1.437-.009,2.152a1.5,1.5,0,0,0,2.616,1.233c1.409-1.14,2.849-2.29,4.241-3.4l1.42-1.133a2.4,2.4,0,0,1,3.084,0l1.839,1.472q1.965,1.571,3.928,3.145a1.469,1.469,0,0,0,2.5-1.2c-.007-.74-.006-1.474,0-2.251v-1.7h.956c.17,0,.315,0,.46,0a4.219,4.219,0,0,0,4.155-4.176C144.538,20.773,144.536,16.978,144.506,13.372Zm-2.871,11.092a1.468,1.468,0,0,1-.4,1.088,1.538,1.538,0,0,1-1.124.4c-.747-.006-1.492,0-2.238,0l-.058,0c-1.226,0-1.751.525-1.755,1.75v2.26L135,29.121l-1.047-.831c-.784-.622-1.524-1.209-2.255-1.809a2.14,2.14,0,0,0-1.489-.533c-.632.009-1.127.007-1.526,0a4.728,4.728,0,0,0-1.427.091,5.271,5.271,0,0,0-1.226.872c-.289.233-.637.518-1.073.859-.348.274-.695.552-1.083.861L122.2,29.966V27.69c-.006-1.215-.537-1.733-1.774-1.737l-.548,0c-.548,0-1.116-.006-1.669.006a1.573,1.573,0,0,1-1.17-.4,1.59,1.59,0,0,1-.421-1.181q.006-2.884,0-5.769,0-2.448,0-4.895c0-1.418.838-1.614,1.744-1.614q7.935,0,15.871,0l5.124,0c.248,0,.5,0,.745,0h.026a1.5,1.5,0,0,1,1.1.4,1.48,1.48,0,0,1,.406,1.1Q141.637,19.026,141.635,24.464Z"
                                    transform="translate(-113.731 -9.21)"
                                    fill="#fff"
                                  />
                                  <path
                                    id="Path_89"
                                    data-name="Path 89"
                                    d="M7.666,8.328H22.7"
                                    fill="none"
                                    stroke="#fff"
                                    stroke-linecap="round"
                                    stroke-width="2"
                                  />
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              3 ? (
                              <div className="desc-notification-user ">
                                {/* Attachment Pin SVG COde */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="26.281"
                                  viewBox="0 0 22.996 26.281"
                                >
                                  <path
                                    id="Icon_metro-attachment"
                                    data-name="Icon metro-attachment"
                                    d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                                    transform="translate(-3.535 -1.928)"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              4 ? (
                              <div className="desc-notification-user">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="26.281"
                                  viewBox="0 0 22.996 26.281"
                                >
                                  <path
                                    id="Icon_metro-attachment"
                                    data-name="Icon metro-attachment"
                                    d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                                    transform="translate(-3.535 -1.928)"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              5 ? (
                              <div className="desc-notification-user ">
                                {/* Cancel SVG Code */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="27.036"
                                  viewBox="0 0 27.036 27.036"
                                >
                                  <g
                                    id="Group_170"
                                    data-name="Group 170"
                                    transform="translate(-1246.032 -210.482)"
                                  >
                                    <path
                                      id="Path_90"
                                      data-name="Path 90"
                                      d="M1268.654,210.448l-24.207,24.207"
                                      transform="translate(3 1.448)"
                                      fill="none"
                                      stroke="#fff"
                                      stroke-linecap="round"
                                      stroke-width="2"
                                    />
                                    <path
                                      id="Path_91"
                                      data-name="Path 91"
                                      d="M1268.654,210.448l-24.207,24.207"
                                      transform="translate(1036.998 1480.55) rotate(-90)"
                                      fill="none"
                                      stroke="#fff"
                                      stroke-linecap="round"
                                      stroke-width="2"
                                    />
                                  </g>
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              6 ? (
                              <div className="desc-notification-user ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="26.281"
                                  viewBox="0 0 22.996 26.281"
                                >
                                  <path
                                    id="Icon_metro-attachment"
                                    data-name="Icon metro-attachment"
                                    d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                                    transform="translate(-3.535 -1.928)"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              7 ? (
                              <div className="desc-notification-user ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="26.281"
                                  viewBox="0 0 22.996 26.281"
                                >
                                  <path
                                    id="Icon_metro-attachment"
                                    data-name="Icon metro-attachment"
                                    d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                                    transform="translate(-3.535 -1.928)"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              8 ? (
                              <div className="desc-notification-user ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="26.281"
                                  viewBox="0 0 22.996 26.281"
                                >
                                  <path
                                    id="Icon_metro-attachment"
                                    data-name="Icon metro-attachment"
                                    d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                                    transform="translate(-3.535 -1.928)"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            ) : recentActivityData.notificationTypes.pK_NTID ===
                              9 ? (
                              <div className="desc-notification-user ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="26.281"
                                  viewBox="0 0 22.996 26.281"
                                >
                                  <path
                                    id="Icon_metro-attachment"
                                    data-name="Icon metro-attachment"
                                    d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                                    transform="translate(-3.535 -1.928)"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="desc-notification-user ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="26.281"
                                  viewBox="0 0 22.996 26.281"
                                >
                                  <path
                                    id="Icon_metro-attachment"
                                    data-name="Icon metro-attachment"
                                    d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                                    transform="translate(-3.535 -1.928)"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            )}
                          </Col>
                          <Col sm={10}>
                            <p className="desc-item-text home-recentactivity-notification-description">
                              {recentActivityData.notificationTypes.description}
                            </p>
                          </Col>
                          <Row>
                            <Col
                              sm={12}
                              className="desc-item-time d-flex justify-content-end"
                            >
                              {
                                <TimeAgo
                                  datetime={forRecentActivity(
                                    recentActivityData.creationDateTime
                                  )}
                                  locale="en"
                                />
                              }
                            </Col>
                          </Row>
                        </Row>
                      </>
                    );
                  })
                ) : (
                  <Spin />
                )}
              </div>
            </div>
            <Row className="MontserratSemiBold-600 color-5a5a5a m-0 ">
              <Col
                className="Notes  whiteBackground-notes  mt-2"
              >
                <Row className="my-2 ">
                  <Col lg={12} md={12} sm={12} className=" d-flex align-items-center gap-3 justify-content-start">
                    <h1 className="noteheading color-5a5a5a MontserratSemiBold-600">
                      {t("Notes")}
                    </h1>
                    <img src={PlusButton} onClick={handleClickNoteModal} className="cursor-pointer" />
                  </Col>

                </Row>
                <Row className="notes-box mr-0">

                  <div className={notes.length > 0 ? "Notes-scrollbar" : "Notes-scrollbar-spinner"}>
                    {NotesReducer.Loading ? <Spin /> : notes !== null && notes !== undefined && notes.length > 0 ? (
                      notes.map((data, index) => {
                        console.log(data, "datadatadata")
                        return <div className="notesdescription" key={data.pK_NotesID}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              {/* <p className="notescontent" > */}
                              <p className="notescontent" onClick={() => OpenUpdateNotesModal(data.pK_NotesID)}>
                                {data.title.slice(0, 100)}
                              </p>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end  gap-2 align-items-center">
                              {data.isStarred ? (
                                <img
                                  src={hollowstar}
                                  width={15}
                                  className={
                                    styles["starIcon-In-Collapse-material"]
                                  }
                                />
                              ) : (
                                <img
                                  src={StarIcon}
                                  width={15}
                                  className={
                                    styles["starIcon-In-Collapse-material"]
                                  }
                                />
                              )}
                              {/* <Star /> */}
                              {data.isAttachment &&
                                <span><img
                                  src={IconAttachment}
                                  width={14}

                                /></span>}
                              {/* <img src={IconAttachment} alt="" /> */}
                              <span className="DataTimeDay">
                                {_justShowDateformat(data.date + data.time)} | {_justShowDay(data.date + data.time)}
                              </span>
                            </Col>
                          </Row>
                        </div>
                      })
                    ) : <Row>
                      <Col sm={12} lg={12} md={12} className="d-flex justify-content-center align-items-center flex-column">
                        <img src={NotesMainEmpty} width={150} height={150} />
                        <p className="emptystateNotesDashboard">{t("You-dont-have-any-notes")}</p>
                      </Col>
                    </Row>}
                  </div>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      <ModalMeeting
        show={show}
        setShow={setShow}
        editFlag={editFlag}
        setEditFlag={setEditFlag}
      />
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
                      <img src={VerificationFailedIcon} width={60} className={"allowModalIcon"} />

                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center mt-4">
                      <label className={"allow-limit-modal-p"}>
                        {t("The-organization-subscription-is-not-active-please-contact-your-admin")}
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
      {updateNotesModalHomePage ? (
        <ModalUpdateNote updateNotes={updateNotesModalHomePage} setUpdateNotes={setUpdateNotesModalHomePage} />) : null}
      {modalNote ? (
        <ModalAddNote addNewModal={modalNote} setAddNewModal={setModalNote} />) : null}
    </>
  );
};
export default Home;
