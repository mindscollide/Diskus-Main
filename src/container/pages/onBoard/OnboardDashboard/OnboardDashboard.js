import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { Container, Row, Col } from "react-bootstrap";
// import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";
import TodoMessageIcon1 from "../../../../assets/images/Todomsg-1.png";
import NoRecentActivity from "../../../../assets/images/No-Recent-Activity.png";
import CancelMeetingSvg from "../../../../assets/images/cancel_meeting_icon.svg";
import MeetingChangesSvg from "../../../../assets/images/meeting_changes-icon.svg";
import TalkIcon from "../../../../assets/images/newElements/Diskus_TalkIcon.svg";
import Diskus_TimerIcon from "../../../../assets/images/newElements/Diskus_TimerIcon.svg";
import Diskus_VideoIcon from "../../../../assets/images/newElements/Diskus_VideoIcon.svg";
import Diskus_ChatIcon from "../../../../assets/images/newElements/Diskus_ChatIcon.svg";
import styles from "./OnboardDashboard.module.css";
// import TalkIcon from "../../../assets/images/newElemnts/Diskus_TalkIcon.svg";
import {
  CustomTableToDoDashboard,
  CustomTextProgressbar,
  ResultMessage,
  Paper,
  Notification,
  Modal,
  Button,
} from "../../../../components/elements";
import moment from "moment";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
// import Calendar from "react-calendar";
// Branch number 3;
// Branch number 3;
// Branch number 3;

import {
  getCalendarDataResponse,
  HideNotificationCalendarData,
} from "../../../../store/actions/GetDataForCalendar";
import { useTranslation } from "react-i18next";
// import "react-calendar/dist/Calendar.css";
import { Calendar, DateObject } from "react-multi-date-picker";
import ModalMeeting from "../../../modalmeeting/ModalMeeting";
import {
  Bell,
  Search,
  Mailbox,
  Paperclip,
  X,
  ChatSquareText,
  Paragraph,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";
import { dateTime } from "../../../../commen/functions/date_formater";
import TimeAgo from "timeago-react";
import {
  GetTodoListByUser,
  GetWeeklyToDoCount,
  HideNotificationTodo,
} from "../../../../store/actions/ToDoList_action";
import { HideNotificationAuth } from "../../../../store/actions/Auth_action";
import {
  GetWeeklyMeetingsCount,
  GetUpcomingEvents,
  HideNotificationMeetings,
} from "../../../../store/actions/GetMeetingUserId";
import {
  getNotifications,
  HideNotificationUserNotificationData,
} from "../../../../store/actions/GetUserNotification";
import {
  HideNotification,
  ViewMeeting,
} from "../../../../store/actions/Get_List_Of_Assignees";
import { Sidebar } from "../../../../components/layout";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  cleareMessage,
  setLoader,
} from "../../../../store/actions/Auth2_actions";

const OnboardDashboard = () => {
  const dCheck = useLoaderData();
  console.log("dCheck", dCheck);
  //For Localization
  const { t } = useTranslation();
  const [viewFlag, setViewFlag] = useState(false);
  const state = useSelector((state) => state);
  const {
    settingReducer,
    calendarReducer,
    toDoListReducer,
    meetingIdReducer,
    auth,
    Authreducer,
  } = state;
  const { RecentActivityData } = settingReducer;

  console.log("RecentActivityData", settingReducer);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  // for sub menus Icons
  const [subIcons, setSubIcons] = useState(false);
  //For Calendar
  const dispatch = useDispatch();

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
        console.log("cData", cData);
        newList.push({
          meetingDate: cData.meetingDate,
        });
      });
      setCalenderData(newList);
      console.log("newListnewListnewList", calenderData);
    }
  }, [calendarReducer.CalenderData]);

  useEffect(() => {
    var temp = [];
    calenderData.map((cal, index) => {
      var year = moment(cal.meetingDate).format("YYYY");
      var month = moment(cal.meetingDate).format("MM");
      var day = moment(cal.meetingDate).format("DD");
      var d = new DateObject().set({
        year: year,
        month: month,
        day: day,
        format,
      });
      temp.push(d);
    });
    setDates(temp);
  }, [calenderData]);

  // calling Api for getting data for calendar
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    dispatch(getCalendarDataResponse(navigate, t, userID, true));
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
    if (lang != undefined) {
      if (lang === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (lang === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [lang]);

  //dispatch gettodolist api
  useEffect(() => {
    let data = { UserID: parseInt(createrID), NumberOfRecords: 300 };
    dispatch(GetTodoListByUser(navigate, data, t));
  }, []);

  // for view modal  handler
  const viewModalHandler = (id) => {
    console.log("viewID", id);
    // setViewFlag(true);
    // let Data = { MeetingID: id };
    // console.log("viewModalHandler", Data);
    // dispatch(ViewMeeting(Data));
  };

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
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "25%",
      className: "statusDashboard",
      //   render: (text) => {
      //     return toDoListReducer.AllTodolistData.map((data, index) => {
      //       if (index === 0) {
      //         if (text.status === "In progress") {
      //           return (
      //             <span className="MontserratMedium-500 color-D8A709">
      //               {text.status}
      //             </span>
      //           );
      //         } else if (text.status === "On hold") {
      //           return (
      //             <span className="MontserratMedium-500 color-F68732">
      //               {text.status}
      //             </span>
      //           );
      //         } else if (text.status === "Pending") {
      //           return (
      //             <span className="MontserratMedium-500 color-5F78D6">
      //               {text.status}
      //             </span>
      //           );
      //         } else if (text.status === "Cancelled") {
      //           return (
      //             <span className="MontserratMedium-500 color-F16B6B">
      //               {text.status}
      //             </span>
      //           );
      //         } else if (text.status === "Completed") {
      //           return (
      //             <span className="MontserratMedium-500 color-81DB86">
      //               {text.status}
      //             </span>
      //           );
      //         } else if (text.status === "Reopen") {
      //           return (
      //             <span className="MontserratMedium-500 color-F68732">
      //               {text.status}
      //             </span>
      //           );
      //         }
      //       }
      //     });
      //   },
    },
  ];

  // dummy data todolist
  const todoRow = [
    {
      title: <strong>{t("Lorum-Ipsum")}</strong>,
      deadlineDateTime: "12: 00 , 11 May 2020",
      status: (
        <p className={styles["status-color-todolist"]}>{t("In-progress")}</p>
      ),
    },
    {
      title: <strong>{t("Lorum-Ipsum")}</strong>,
      deadlineDateTime: "3: 00 , 16 May 2020",
      status: (
        <p className={styles["status-color-todolist"]}>{t("In-progress")}</p>
      ),
    },
    {
      title: <strong>{t("Meeting-Created")}</strong>,
      deadlineDateTime: "5: 00 , 18 May 2020",
      status: (
        <p className={styles["status-color-todolist"]}>{t("In-progress")}</p>
      ),
    },
    {
      title: <strong>{t("Todolist-Created")}</strong>,
      deadlineDateTime: "6: 00 , 17 May 2020",
      status: (
        <p className={styles["status-color-todolist"]}>{t("In-progress")}</p>
      ),
    },
    {
      title: <strong>{t("Lorum-Ipsum")}</strong>,
      deadlineDateTime: "1: 00 , 03 May 2020",
      status: (
        <p className={styles["status-color-todolist-completed"]}>
          {t("Completed")}
        </p>
      ),
    },
    {
      title: <strong>{t("Modal-Created")}</strong>,
      deadlineDateTime: "6: 00 , 16 June 2020",
      status: (
        <p className={styles["status-color-todolist-completed"]}>
          {t("Completed")}
        </p>
      ),
    },
    {
      title: <strong>{t("Date-Creation")}</strong>,
      deadlineDateTime: "7: 00 , 18 June 2020",
      status: (
        <p className={styles["status-color-todolist-completed"]}>
          {t("Completed")}
        </p>
      ),
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
    dispatch(GetWeeklyMeetingsCount(navigate, createrID, t));
    dispatch(GetWeeklyToDoCount(navigate, Data2, t));
    dispatch(GetUpcomingEvents(navigate, Data2, t));
  }, []);
  useEffect(() => {
    dispatch(getNotifications(navigate, createrID, t));
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
    // if (auth.ResponseMessage !== "") {
    //   // setSignInErrorField(true);
    //   setOpen({
    //     ...open,
    //     open: true,
    //     message: auth.ResponseMessage,
    //   });
    // }
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
    } else if (
      Authreducer.EnterPasswordResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
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
    } else if (
      Authreducer.CreatePasswordResponseMessage !== "" &&
      Authreducer.CreatePasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
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

  console.log("lang", lang);
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
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="event-details upcoming_events border-0">
                  <p className="events-description MontserratSemiBold-600">
                    Board Meeting
                  </p>
                  <p className="events-dateTime MontserratSemiBold-600">
                    {moment(
                      upcomingEventsData.meetingEvent.startTime,
                      "HH:mm:ss"
                    ).format("h:mm A") +
                      ", " +
                      moment(
                        upcomingEventsData.meetingEvent.meetingDate
                      ).format("Do MMM, YYYY")}
                  </p>
                </div>
              </Col>
            </Row>
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
                      {moment(
                        upcomingEventsData.meetingEvent.startTime,
                        "HH:mm:ss"
                      ).format("h:mm A") +
                        ", " +
                        moment(
                          upcomingEventsData.meetingEvent.meetingDate
                        ).format("Do MMM, YYYY")}
                    </p>
                  </div>
                </Col>
              </Row>
            </>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div
                  className="event-details"
                  onClick={() =>
                    viewModalHandler(upcomingEventsData.meetingDetails.pK_MDID)
                  }
                >
                  <p className="events-description">
                    {upcomingEventsData.meetingDetails.title}
                  </p>
                  <p className="events-dateTime">
                    {moment(
                      upcomingEventsData.meetingEvent.startTime,
                      "HH:mm:ss"
                    ).format("h:mm A") +
                      ", " +
                      moment(
                        upcomingEventsData.meetingEvent.meetingDate
                      ).format("Do MMM, YYYY")}
                  </p>
                </div>
              </Col>
            </Row>
          </>
        );
      }
    );
  };

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
                  <CustomTextProgressbar>
                    <div className="progressbar-count m-0 "></div>
                    <div className="home-meetingcount-text">
                      <strong className={styles["meeting-progress"]}>
                        {t("2/4")}
                      </strong>
                      <br />
                      {t("Meeting")} <br />
                      {t("This-week")}
                    </div>
                  </CustomTextProgressbar>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="Dashboard-Calendar  ">
                <div className="whiteBackground Spinner home-calendar-spinner border">
                  <>
                    <Row style={{ height: "37vh" }}>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <Calendar
                          disabled={false}
                          calendar={calendarValue}
                          locale={localValue}
                          multiple={false}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={1} md={1} sm={1} />
                      <Col lg={10} md={10} sm={10}>
                        <div className={styles["upcoming-event-main-heading"]}>
                          <h1 className="upcoming-events">
                            {t("Up-coming-event")}
                          </h1>
                        </div>
                        <div className={styles["upcoming-event-dummy-data"]}>
                          <strong
                            className={
                              styles["upcoming-event-dummy-data-Heading"]
                            }
                          >
                            {t("Board-Meeting")}
                          </strong>
                          <br />
                          <p
                            className={styles["upcoming-event-dummy-data-date"]}
                          >
                            {t("11:00-am-20-May-2022")}
                          </p>
                        </div>
                      </Col>
                      <Col lg={1} md={1} sm={1} />
                    </Row>
                  </>
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
                  <CustomTextProgressbar>
                    <div className="home-todocount-text">
                      <strong className={styles["meeting-progress"]}>
                        {t("3/3")}
                      </strong>
                      <br />
                      {t("Things")} <br />
                      {t("To-do")}
                    </div>
                  </CustomTextProgressbar>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} className="DashboardTodoTable ">
                <CustomTableToDoDashboard
                  //   loading={{
                  //     spinning: toDoListReducer.TableSpinner,
                  //     indicator: <Spin />,
                  //   }}
                  column={columnsToDo}
                  className="dashboard-todo_onboard"
                  rows={todoRow}
                  labelTitle={t("Tasks")}
                  scroll={{ y: 355 }}
                />
              </Col>
            </Row>
          </Col>
          <Col lg={4} md={4} sm={12} className="m-0 p-0">
            <h1 className="border recent-activity color-5a5a5a MontserratSemiBold-600">
              {t("Recent-activity")}
            </h1>
            <div className="whiteBackground Spinner home-recentactivity-scrollbar-container mt-2 border">
              {/* <h1 className="recent-activity">Recent Activity</h1> */}
              <div className="Recent-Activity-Box ">
                <>
                  <Row>
                    <Col sm={1}>
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
                    </Col>
                    <Col
                      sm={10}
                      className={styles["recent-activity-icon-text"]}
                    >
                      <p className={styles["recent-activity-paragraph"]}>
                        {t("Your-first-meeting-is-created")}
                      </p>
                    </Col>
                    <Row className="p-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <p className={styles["recent-activity-paragraph"]}>
                          {t("2-days-ago")}
                        </p>
                      </Col>
                      {/* <Col
                        sm={12}
                        className="desc-item-time d-flex justify-content-end"
                      >
                        {
                          <TimeAgo
                            datetime={dateTime(
                              recentActivityData.creationDateTime
                            )}
                            locale="en"
                          />
                        }
                      </Col> */}
                    </Row>
                  </Row>

                  <Row>
                    <Col sm={1}>
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
                    </Col>
                    <Col
                      sm={10}
                      className={styles["recent-activity-icon-text"]}
                    >
                      <p className={styles["recent-activity-paragraph"]}>
                        {t(
                          "Mr.Yaqoob-added-an-attachment-to-your-meeting-Finance-Breakdown."
                        )}
                      </p>
                    </Col>
                    <Row className="p-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <p className={styles["recent-activity-paragraph"]}>
                          {t("1-day-ago")}
                        </p>
                      </Col>
                    </Row>
                  </Row>

                  <Row>
                    <Col sm={1}>
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
                    </Col>
                    <Col
                      sm={10}
                      className={styles["recent-activity-icon-text"]}
                    >
                      <p className={styles["recent-activity-paragraph"]}>
                        {t(
                          "Mr-Yaqoob-added-an-attachment-to-your-meeting-Finance-Breakdown."
                        )}
                      </p>
                    </Col>
                    <Row className="p-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <p className={styles["recent-activity-paragraph"]}>
                          {t("2-Hours-ago")}
                        </p>
                      </Col>
                    </Row>
                  </Row>

                  <Row>
                    <Col sm={1}>
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
                    </Col>
                    <Col
                      sm={10}
                      className={styles["recent-activity-icon-text"]}
                    >
                      <p className={styles["recent-activity-paragraph"]}>
                        {t("Your-first-meeting-is-created")}
                      </p>
                    </Col>
                    <Row className="p-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <p className={styles["recent-activity-paragraph"]}>
                          {t("2-Hours-ago")}
                        </p>
                      </Col>
                    </Row>
                  </Row>

                  <Row>
                    <Col sm={1}>
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
                    </Col>
                    <Col
                      sm={10}
                      className={styles["recent-activity-icon-text"]}
                    >
                      <p className={styles["recent-activity-paragraph"]}>
                        {
                          "New-Computers-for-the-Office-did-not-pass-Go-to-Resolutions-Tab-for-details"
                        }
                      </p>
                    </Col>
                    <Row className="p-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <p className={styles["recent-activity-paragraph"]}>
                          {t("3-days-ago")}
                        </p>
                      </Col>
                    </Row>
                  </Row>

                  <Row>
                    <Col sm={1}>
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
                    </Col>
                    <Col
                      sm={10}
                      className={styles["recent-activity-icon-text"]}
                    >
                      <p className={styles["recent-activity-paragraph"]}>
                        {t(
                          "New-Computers-for-the-Office-did-not-pass-Go-to-Resolutions-Tab-for-details"
                        )}
                      </p>
                    </Col>
                    <Row className="p-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <p className={styles["recent-activity-paragraph"]}>
                          {t("3-days-ago")}
                        </p>
                      </Col>
                    </Row>
                  </Row>
                </>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      <ModalMeeting
        show={show}
        setShow={setShow}
        editFlag={editFlag}
        setEditFlag={setEditFlag}
        // this is check from where its called 5 is from OnboardDashboard
        checkFlag={5}
      />
      <Modal
        show={activateBlur}
        setShow={() => {
          setActivateBlur();
        }}
        ButtonTitle={"Block"}
        centered
        size={"md"}
        ModalBody={
          <>
            <>
              <Row className="mb-1">
                <Col lg={12} md={12} xs={12} sm={12}>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <ExclamationTriangleFill
                        className={"allowModalIcon"}
                        size={60}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <label className={"allow-limit-modal-p"}>
                        The organization subscription is not active. Please
                        contact your admin
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
    </>
  );
};
export default OnboardDashboard;
