import React, { useEffect, useState } from "react";
import { Col, Row, Container, Dropdown, DropdownButton } from "react-bootstrap";
import {
  Calendar,
  Button,
  DropdownforSelect,
  Loader,
  Notification,
} from "./../../components/elements";
import { ChevronBarDown, ChevronDown } from "react-bootstrap-icons";
import "./CalendarPage.css";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getCalendarDataResponse } from "../../store/actions/GetDataForCalendar";
import {
  dateTime,
  newTimeFormaterAsPerUTC,
  startDateTimeMeetingCalendar,
  TimeDisplayFormat,
  _justShowDateformat,
} from "../../commen/functions/date_formater";
import ModalMeeting from "../modalmeeting/ModalMeeting";
import TodoListModal from "../todolistModal/ModalToDoList";
import ModalView from "../modalView/ModalView";
import {
  clearResponseMessage,
  ViewMeeting,
} from "../../store/actions/Get_List_Of_Assignees";
import { useTranslation } from "react-i18next";
import { cleareMessage } from "../../store/actions/Admin_AddUser";
import { cleareMessage as cleareMessagetodo } from "../../store/actions/GetTodos";
import { HideNotificationMeetings } from "../../store/actions/GetMeetingUserId";
import { clearResponce } from "../../store/actions/ToDoList_action";

const CalendarPage = () => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [meetingModalShow, setMeetingModalShow] = useState(false);
  const [todolistModalShow, setTodolistModalShow] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const {
    calendarReducer,
    assignees,
    toDoListReducer,
    adminReducer,
    meetingIdReducer,
    getTodosStatus,
  } = state;
  const [value, setValue] = useState(moment("2017-01-25"));
  // const [selectedValue, setSelectedValue] = useState(moment("2017-01-25"));
  const [calenderData, setCalenderDatae] = useState([]);
  console.log("assignees", assignees);
  const [calendarView, setCalendarView] = useState(false);
  const [open, setOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  console.log("calendarReducer", calendarReducer.CalenderData);

  const [openNotification, setOpenNotification] = useState({
    flag: false,
    message: "",
  });

  // for view modal  handler
  const viewModalHandler = async (value) => {
    let Data = { MeetingID: parseInt(value.id) };
    await dispatch(ViewMeeting(Data, t));
  };

  function onChange(value) {
    let newDAte = moment(value._d).format("YYYY-MM-DD");
    setDefaultValue(newDAte);
    setOpen(false);
    setCalendarView(false);
  }

  // calling Api for getting data for calendar
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    dispatch(getCalendarDataResponse(userID, t));
    window.addEventListener("click", function (e) {
      var clsname = e.target.className;
      let prev = "ant-picker-prev-icon";
      let prev2 = "ant-picker-header-prev-btn";
      let nex = "ant-picker-next-icon";
      let nex2 = "ant-picker-header-next-btn";
      let supernex = "ant-picker-super-next-icon";
      let supernex2 = "ant-picker-header-super-next-btn";
      let superprev = "ant-picker-super-prev-icon";
      let superprev2 = "ant-picker-header-super-prev-btn";
      let body = "ant-picker-body";
      let header = "ant-picker-header-view";
      let header2 = "ant-picker-header";
      let inner = "ant-picker-cell-inner";
      let month = "ant-picker-month-btn";
      let year = "ant-picker-year-btn";
      let decadeyear = "ant-picker-decade-btn";
      if (
        prev === clsname ||
        nex === clsname ||
        supernex === clsname ||
        superprev === clsname ||
        header === clsname ||
        inner === clsname ||
        month === clsname ||
        year === clsname ||
        decadeyear === clsname ||
        prev2 === clsname ||
        nex2 === clsname ||
        header2 === clsname ||
        supernex2 === clsname ||
        superprev2 === clsname ||
        body === clsname
      ) {
        // setCalendarView(true);
        // console.log("handleAddEventhandleAddEvent 5", open);
      } else {
        // console.log("dx", clsname);

        if (open) {
        } else {
          if (clsname === "") {
          } else {
            // setCalendarView(false);
          }
        }
      }
    });
  }, []);

  // set Data for Calendar
  useEffect(() => {
    let Data = calendarReducer.CalenderData;
    console.log("Data", Data);
    let newList = [];
    if (Object.keys(Data).length > 0) {
      Data.map((cData, index) => {
        console.log("cData", cData);
        let StartingTime = startDateTimeMeetingCalendar(
          cData.meetingDate + cData.startTime
        );
        let EndingTime = startDateTimeMeetingCalendar(
          cData.meetingDate + cData.endTime
        );
        let meetingStartTime = newTimeFormaterAsPerUTC(
          cData.meetingDate + cData.startTime
        );
        console.log("newListnewListnewList", StartingTime, EndingTime);
        newList.push({
          id: parseInt(cData.fK_MDID),
          title: meetingStartTime + " - " + cData.title,
          allDay: true,
          start: new Date(StartingTime),
          end: new Date(EndingTime),
          // startTime: meetingStartTime,
        });
      });
      setCalenderDatae(newList);
      console.log("newListnewListnewList", newList);
    }
  }, [calendarReducer.CalenderData]);

  // setting view flag
  useEffect(() => {
    if (Object.keys(assignees.ViewMeetingDetails).length > 0) {
      console.log(
        "ViewMeetingDetails",
        assignees,
        assignees.ViewMeetingDetails
      );
      setViewFlag(true);
    } else {
      setViewFlag(false);
    }
  }, [assignees.ViewMeetingDetails]);

  const handleCreateMeeting = () => {
    setMeetingModalShow(true);
  };

  const handleCreateTodo = () => {
    setTodolistModalShow(true);
  };

  //click handler for create events button
  const eventClickHandler = () => {};

  console.log("handleAddEventhandleAddEvent 4", open);

  useEffect(() => {}, [defaultValue]);

  function handleAddEvent() {
    setOpen(true);
    setCalendarView(!calendarView);
    console.log("calendarView", calendarView);
  }

  useEffect(() => {
    if (adminReducer.UpdateOrganizationMessageResponseMessage != "") {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: adminReducer.UpdateOrganizationMessageResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(cleareMessage());
    } else if (adminReducer.DeleteOrganizationMessageResponseMessage != "") {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: adminReducer.DeleteOrganizationMessageResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (adminReducer.AllOrganizationResponseMessage != "") {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: adminReducer.AllOrganizationResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (adminReducer.ResponseMessage != "") {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: adminReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    adminReducer.UpdateOrganizationMessageResponseMessage,
    adminReducer.DeleteOrganizationMessageResponseMessage,
    adminReducer.AllOrganizationResponseMessage,
    adminReducer.ResponseMessage,
  ]);
  useEffect(() => {
    if (
      meetingIdReducer.ResponseMessage != "" &&
      meetingIdReducer.ResponseMessage != t("Record-found")
    ) {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: meetingIdReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(HideNotificationMeetings());
    } else if (
      assignees.ResponseMessage != "" &&
      assignees.ResponseMessage != t("Record-found")
    ) {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: assignees.ResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(clearResponseMessage());
    } else {
      console.log("ResponseMessage Meeting");
      dispatch(HideNotificationMeetings());
      dispatch(clearResponseMessage());
    }
  }, [meetingIdReducer.ResponseMessage, assignees.ResponseMessage]);
  useEffect(() => {
    console.log("Setopen", toDoListReducer.ResponseMessage);
    console.log("Setopen", assignees.ResponseMessage);
    if (
      toDoListReducer.ResponseMessage != "" &&
      toDoListReducer.ResponseMessage != undefined &&
      toDoListReducer.ResponseMessage != t("Record-found")
    ) {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: toDoListReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(clearResponce());
    } else if (
      assignees.ResponseMessage != "" &&
      assignees.ResponseMessage != t("Record-found")
    ) {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: assignees.ResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(clearResponseMessage());
    } else {
      dispatch(clearResponce());
      dispatch(clearResponseMessage());
    }
  }, [toDoListReducer.ResponseMessage, assignees.ResponseMessage]);

  useEffect(() => {
    console.log("Setopen", getTodosStatus.ResponseMessage);
    console.log("Setopen", getTodosStatus.UpdateTodoStatusMessage);
    console.log("Setopen", getTodosStatus.UpdateTodoStatus);
    if (
      getTodosStatus.ResponseMessage != "" &&
      getTodosStatus.ResponseMessage != undefined &&
      getTodosStatus.ResponseMessage != t("Record-found")
    ) {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: getTodosStatus.ResponseMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessagetodo());
    } else if (
      getTodosStatus.UpdateTodoStatusMessage != "" &&
      getTodosStatus.UpdateTodoStatusMessage != undefined &&
      getTodosStatus.UpdateTodoStatusMessage != t("Record-found")
    ) {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: getTodosStatus.UpdateTodoStatusMessage,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessagetodo());
    } else if (
      getTodosStatus.UpdateTodoStatus != "" &&
      getTodosStatus.UpdateTodoStatus != undefined &&
      getTodosStatus.UpdateTodoStatus != t("Record-found")
    ) {
      setOpenNotification({
        ...openNotification,
        flag: true,
        message: getTodosStatus.UpdateTodoStatus,
      });
      setTimeout(() => {
        setOpenNotification({
          ...openNotification,
          flag: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessagetodo());
    } else {
      dispatch(cleareMessagetodo());
    }
  }, [
    getTodosStatus.ResponseMessage,
    getTodosStatus.UpdateTodoStatusMessage,
    getTodosStatus.UpdateTodoStatus,
  ]);
  return (
    <>
      <Container id={"calender"}>
        <Row className="d-flex">
          <Col
            lg={2}
            md={2}
            sm={12}
            xs={12}
            className="margin-bottom-20 mt-3 calendar-heading MontserratSemiBold-600"
          >
            <div className="mt-2">{t("Calendar")}</div>
          </Col>
          <Col
            lg={10}
            md={10}
            sm={12}
            xs={12}
            className="mt-2 align-items-center"
          >
            <Dropdown
              className="Calendar_CreateBtn"
              onClick={eventClickHandler}
              align={"start"}
            >
              <Dropdown.Toggle title={t("Create")}>
                {t("Create")}
                <ChevronDown />
              </Dropdown.Toggle>
              {/* <ChevronDown /> */}
              <Dropdown.Menu>
                <Dropdown.Item
                  className="dropdown-item"
                  onClick={handleCreateMeeting}
                >
                  {t("Schedule-a-meeting")}
                </Dropdown.Item>
                <Dropdown.Item
                  className="dropdown-item"
                  onClick={handleCreateTodo}
                >
                  {t("Create-a-to-do-list")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col>
            <Calendar
              events={calenderData}
              handleEventSelect={viewModalHandler}
              className="calendar"
              onChange={onChange}
              handleAddEvent={handleAddEvent}
              setCalendarView={setCalendarView}
              calendarView={calendarView}
              defaultValue={defaultValue}
              setDefaultValue={setDefaultValue}
              setOpen={setOpen}
              // onPanelChange={onPanelChange}
              // value={value}
              selectable={true}
            />
          </Col>
        </Row>
      </Container>
      {assignees.Loading ? (
        <Loader />
      ) : calendarReducer.Loading ? (
        <Loader />
      ) : toDoListReducer.Loading ? (
        <Loader />
      ) : null}
      <ModalView viewFlag={viewFlag} setViewFlag={setViewFlag} />
      <ModalMeeting
        calenderFlag={true}
        show={meetingModalShow}
        setShow={setMeetingModalShow}
      />
      <TodoListModal show={todolistModalShow} setShow={setTodolistModalShow} />
      <Notification
        setOpen={setOpenNotification}
        open={openNotification.flag}
        message={openNotification.message}
      />
    </>
  );
};

export default CalendarPage;
