import React, { useEffect, useState } from "react";
import { Col, Row, Container, Dropdown, DropdownButton } from "react-bootstrap";
import {
  Calendar,
  Button,
  DropdownforSelect,
  Loader,
} from "./../../components/elements";

import "./CalendarPage.css";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getCalendarDataResponse } from "../../store/actions/GetDataForCalendar";
import {
  dateTime,
  TimeDisplayFormat,
} from "../../commen/functions/date_formater";
import ModalMeeting from "../modalmeeting/ModalMeeting";
import TodoListModal from "../todolistModal/ModalToDoList";
import ModalView from "../modalView/ModalView";
import { ViewMeeting } from "../../store/actions/Get_List_Of_Assignees";
import { useTranslation } from "react-i18next";

const CalendarPage = () => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [meetingModalShow, setMeetingModalShow] = useState(false);
  const [todolistModalShow, setTodolistModalShow] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const { calendarReducer, assignees } = state;
  const [value, setValue] = useState(moment("2017-01-25"));
  // const [selectedValue, setSelectedValue] = useState(moment("2017-01-25"));
  const [calenderData, setCalenderDatae] = useState([]);
  console.log("assignees", assignees);
  const [calendarView, setCalendarView] = useState(false);
  const [open, setOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  console.log("calendarReducer", calendarReducer.CalenderData);

  // for view modal  handler
  const viewModalHandler = async (value) => {
    let Data = { MeetingID: parseInt(value.id) };
    await dispatch(ViewMeeting(Data));
  };

  function onChange(value) {
    console.log("sdasdasdasd", value._d);
    let newDAte = moment(value._d).format("YYYY-MM-DD");
    setDefaultValue(newDAte);
    setOpen(false);
    setCalendarView(false);
  }

  // calling Api for getting data for calendar
  useEffect(() => {
    const userID = localStorage.getItem("UserID");
    dispatch(getCalendarDataResponse(userID));
    window.addEventListener("click", function (e) {
      var clsname = e.target.className;
      // console.log("dx", clsname);
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
            setCalendarView(false);
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
        let StartingTime = dateTime(cData.meetingDate + cData.startTime);
        let EndingTime = dateTime(cData.meetingDate + cData.endTime);
        let meetingStartTime = moment(cData.startTime, "hhmmss").format(
          "hh:mm a"
        );
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
      console.log("newListnewListnewList", calenderData);
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
  }

  return (
    <>
      <Container id={"calender"}>
        <Row className="d-flex">
          <Col md={1} sm={2} lg={1} className="calendar-heading mt-2">
            {t("Calendar-Title")}
          </Col>
          {/* <Col
            md={1}
            className="calendar-heading color-primary fw-600 fs-5 mt-2"
          >
            Calendar
          </Col> */}
          <Col md={10} sm={12} lg={10} className="">
            <DropdownButton
              title={t("Create-An-Event-Button")}
              className="text-white add-event calendar-dropdown"
              onClick={eventClickHandler}
              align={"start"}
            >
              <Dropdown.Item
                className="dropdown-item"
                onClick={handleCreateMeeting}
              >
                {/* Schedule a Meeting */}
                {t("Schedule-a-Meeting-Title")}
              </Dropdown.Item>
              <Dropdown.Item
                className="dropdown-item"
                onClick={handleCreateTodo}
              >
                {/* Create a To-Do List */}
                {t("Create-a-To-Do-List-Title")}
              </Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12}>
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
      ) : null}
      <ModalView viewFlag={viewFlag} setViewFlag={setViewFlag} />
      <ModalMeeting
        calenderFlag={true}
        show={meetingModalShow}
        setShow={setMeetingModalShow}
      />
      <TodoListModal show={todolistModalShow} setShow={setTodolistModalShow} />
    </>
  );
};

export default CalendarPage;
