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
import { Plus } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getCalendarDataResponse } from "../../store/actions/GetDataForCalendar";
import {
  dateTime,
  newDateFormaterAsPerUTC,
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
import { useNavigate } from "react-router-dom";

const CalendarPage = () => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  console.log("calendarReducer", calendarReducer.CalenderData);
  const [editFlag, setEditFlag] = useState(false);

  const [openNotification, setOpenNotification] = useState({
    flag: false,
    message: "",
  });
  const [startDataUpdate, setStartDataUpdate] = useState("");
  const [endDataUpdate, setEndDataUpdate] = useState("");
  let CalenderMonthsSpan = localStorage.getItem("calenderMonthsSpan");
  let OrganizationID = localStorage.getItem("organizationID");
  const userID = localStorage.getItem("userID");
  var currentDate = new Date(); // Get the current date
  // Add CalenderMonthsSpan months and set the day to the last day of the month
  var startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - parseInt(CalenderMonthsSpan),
    1
  ); // Subtract CalenderMonthsSpan months and set the day to the 1st
  var endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + parseInt(CalenderMonthsSpan),
    0
  );

  // for view modal  handler
  const viewModalHandler = async (value) => {
    if (value.eventID === 3) {
      let Data = { MeetingID: parseInt(value.id) };
      await dispatch(
        ViewMeeting(
          navigate,
          Data,
          t,
          setViewFlag,
          setEditFlag,
          setCalendarViewModal,
          3
        )
      );
    }
  };
  // calling Api for getting data for calendar
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    // dispatch(getCalendarDataResponse(navigate, userID,true, t));
    let calendarData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(OrganizationID),
      StartDate: newDateFormaterAsPerUTC(startDate) + "000000",
      EndDate: newDateFormaterAsPerUTC(endDate) + "000000",
    };
    setStartDataUpdate(startDate);
    setEndDataUpdate(endDate);
    dispatch(getCalendarDataResponse(navigate, calendarData, true, t));
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
  
  function onChange(value) {
    let newDAte = moment(value._d).format("YYYY-MM-DD");
    let formattedDate = moment(value._d).format("YYYYMMDD");
    // let formattedDate = moment(value._d).format("YYYYMMDD");

    console.log("navigate", formattedDate);
    console.log("navigate", value._d);
    if (startDataUpdate > value._d) {
      console.log("navigate", value._d);
      const date = new Date(value._d);
      let updateStartDate = new Date(
        date.getFullYear(),
        date.getMonth() - parseInt(CalenderMonthsSpan),
        1
      );
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate: newDateFormaterAsPerUTC(updateStartDate) + "000000",
        EndDate: newDateFormaterAsPerUTC(startDataUpdate) + "000000",
      };
      setStartDataUpdate(updateStartDate);
      dispatch(getCalendarDataResponse(navigate, calendarData, false, t));
    } else if (endDataUpdate < value._d) {
      console.log("navigate", value._d);
      const date = new Date(value._d);
      let updateEndDate = new Date(
        date.getFullYear(),
        date.getMonth() + parseInt(CalenderMonthsSpan),
        0
      );
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate: newDateFormaterAsPerUTC(endDataUpdate) + "000000",
        EndDate: newDateFormaterAsPerUTC(updateEndDate) + "000000",
      };
      setEndDataUpdate(updateEndDate);
      dispatch(getCalendarDataResponse(navigate, calendarData, false, t));
    }
    setDefaultValue(newDAte);
    setOpen(false);
    setCalendarView(false);
  }



  // set Data for Calendar
  useEffect(() => {
    let Data = calendarReducer.CalenderData;
    let officeEventColor = localStorage.getItem("officeEventColor");
    let googleEventColor = localStorage.getItem("googleEventColor");
    let diskusEventColor = localStorage.getItem("diskusEventColor");
    console.log("Data", Data);
    let newList;
    if (Object.keys(calenderData).length > 0) {
      newList = calenderData;
    } else {
      newList = [];
    }
    if (Object.keys(Data).length > 0) {
      Data.map((cData, index) => {
        console.log("cData", cData);
        let StartingTime = startDateTimeMeetingCalendar(
          cData.eventDate + cData.startTime
        );
        let EndingTime = startDateTimeMeetingCalendar(
          cData.eventDate + cData.endTime
        );
        let meetingStartTime = newTimeFormaterAsPerUTC(
          cData.eventDate + cData.startTime
        );
        console.log("newListnewListnewList", StartingTime, EndingTime);
        if (cData.fK_CESID === 1) {
          newList.push({
            id: parseInt(cData.pK_CEID),
            eventID: parseInt(cData.fK_CESID),
            title: meetingStartTime + " - " + cData.title,
            allDay: true,
            start: new Date(StartingTime),
            end: new Date(EndingTime),
            border: "2px solid" + googleEventColor,
          });
        } else if (cData.fK_CESID === 2) {
          newList.push({
            id: parseInt(cData.pK_CEID),
            eventID: parseInt(cData.fK_CESID),
            title: meetingStartTime + " - " + cData.title,
            allDay: true,
            start: new Date(StartingTime),
            end: new Date(EndingTime),
            border: "2px solid" + officeEventColor,
          });
        } else if (cData.fK_CESID === 3) {
          newList.push({
            id: parseInt(cData.pK_CEID),
            eventID: parseInt(cData.fK_CESID),
            title: meetingStartTime + " - " + cData.title,
            allDay: true,
            start: new Date(StartingTime),
            end: new Date(EndingTime),
            border: "2px solid" + diskusEventColor,
          });
        }
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
      // setViewFlag(false);
    }
  }, [assignees.ViewMeetingDetails]);
  console.log("viewFlag", viewFlag);
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
  console.log("meetingIdReducermeetingIdReducer", calendarReducer.Loading);
  console.log("meetingIdReducermeetingIdReducer", toDoListReducer.Loading);
  console.log("meetingIdReducermeetingIdReducer", assignees.Loading);
  return (
    <>
      <Container id={"calender"}>
        <Row>
          <Col lg={2} md={2} sm={2} xs={12}>
            <span className="Calender-heading">{t("Calendar")}</span>
          </Col>
          <Col
            lg={3}
            md={3}
            sm={12}
            xs={12}
            className=" mt-2 d-flex justify-content-center"
          >
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Dropdown
                  className="Calendar_CreateBtn"
                  onClick={eventClickHandler}
                  align={"start"}
                >
                  <Dropdown.Toggle title={t("Create")}>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="heading_button">
                        <Plus width={20} height={20} fontWeight={800} />
                        <span>{t("Create")}</span>
                      </Col>
                    </Row>
                  </Dropdown.Toggle>

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
          </Col>
        </Row>
        <Row>
          <Col>
            <Calendar
              events={calenderData}
              startDataUpdate={startDataUpdate}
              setStartDataUpdate={setStartDataUpdate}
              endDataUpdate={endDataUpdate}
              setEndDataUpdate={setEndDataUpdate}
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
      <ModalView
        viewFlag={calendarViewModal}
        setViewFlag={setCalendarViewModal}
      />
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
