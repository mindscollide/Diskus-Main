import React, { useEffect, useState } from "react";
import { Col, Row, Container, Dropdown, DropdownButton } from "react-bootstrap";
import {
  Calendar,
  Button,
  DropdownforSelect,
  Loader,
  Notification,
} from "./../../components/elements";
import "./CalendarPage.css";
import { Plus } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  clearCalendarState,
  getCalendarDataResponse,
  getEventsDetails,
  getEventsTypes,
} from "../../store/actions/GetDataForCalendar";
import {
  covertDateForCalenderIntoUTC,
  dateTime,
  forMainCalendar,
  newDateFormaterAsPerUTC,
  newTimeFormaterAsPerUTC,
  _justShowDateformat,
  newTimeFormaterAsPerUTCTalkTime,
  formattedString,
  utcConvertintoGMT,
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
import MeetingViewModalCalendar from "../modalView/ModalView";
import { checkFeatureIDAvailability } from "../../commen/functions/utils";
import { meetingStatusPublishedMqtt } from "../../store/actions/NewMeetingActions";

const CalendarPage = () => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [meetingModalShow, setMeetingModalShow] = useState(false);
  const [EventTypes, setEventTypes] = useState([]);
  const [todolistModalShow, setTodolistModalShow] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [viewFlag, setViewFlag] = useState(false);
  const {
    calendarReducer,
    assignees,
    toDoListReducer,
    adminReducer,
    meetingIdReducer,
    getTodosStatus,
    NewMeetingreducer,
  } = state;
  const MeetingPublishData = NewMeetingreducer.meetingStatusPublishedMqttData;
  const [calenderData, setCalenderDatae] = useState([]);

  const [calendarView, setCalendarView] = useState(false);
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [editFlag, setEditFlag] = useState(false);
  const [defaultState, setDefaultState] = useState(false);

  const [openNotification, setOpenNotification] = useState({
    flag: false,
    message: "",
  });
  const [startDataUpdate, setStartDataUpdate] = useState("");
  const [endDataUpdate, setEndDataUpdate] = useState("");
  let CalenderMonthsSpan =
    localStorage.getItem("calenderMonthsSpan") !== null
      ? localStorage.getItem("calenderMonthsSpan")
      : 1;
  let OrganizationID = localStorage.getItem("organizationID");
  const userID = localStorage.getItem("userID");
  var currentDate = new Date(); // Get the current date

  // Calculate the start date
  let startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - Number(CalenderMonthsSpan),
    currentDate.getDate()
  );

  // Calculate the end date
  let endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + Number(CalenderMonthsSpan),
    currentDate.getDate()
  );

  // for view modal  handler
  const viewModalHandler = async (value) => {
    console.log(value, "valuevaluevaluevalues");
    if (value.calendarTypeId === 2) {
      if (value.isQuickMeeting === false) {
        let advancemeetingData = {
          id: value.id,
          isQuickMeeting: value.isQuickMeeting,
          statusID: value.statusID,
          participantRoleID: value.participantRoleID,
          attendeeRoleID: value.attendeeRoleID,
          isPrimaryOrganizer: value.isPrimaryOrganizer,
          meetingID: value.meetingID,
        };
        navigate("/DisKus/Meeting", {
          state: { advancemeetingData, CalendaradvanceMeeting: true },
        });
      } else {
        let Data = {
          CalendarEventId: value.id,
          CalendarEventTypeId: value.calendarTypeId,
        };
        dispatch(getEventsDetails(navigate, Data, t, setCalendarViewModal));
      }
    }
  };
  const callApi = async () => {
    try {
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate: newDateFormaterAsPerUTC(startDate) + "000000",
        EndDate: newDateFormaterAsPerUTC(endDate) + "000000",
      };

      setStartDataUpdate(newDateFormaterAsPerUTC(startDate));
      setEndDataUpdate(newDateFormaterAsPerUTC(endDate));
      await dispatch(getCalendarDataResponse(navigate, t, calendarData));
      if (!calendarReducer.getEventTypeIds?.length > 0) {
        await dispatch(getEventsTypes(navigate, t));
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // calling Api for getting data for calendar
  useEffect(() => {
    callApi();
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
        //
      } else {
        //

        if (open) {
        } else {
          if (clsname === "") {
          } else {
            // setCalendarView(false);
          }
        }
      }
    });
    return () => {
      dispatch(clearCalendarState());
    };
  }, []);

  function onChange(value) {
    console.log(value, "valuevaluevalueonChange");
    let newDAte = moment(value._d).format("YYYY-MM-DD");
    console.log(newDAte, "valuevaluevalueonChange");

    setCalendarView(false);
    if (startDataUpdate > value._d) {
      const date = new Date(value._d);
      let updateStartDate = new Date(
        date.getFullYear(),
        date.getMonth() - Number(CalenderMonthsSpan),
        1
      );
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate: newDateFormaterAsPerUTC(updateStartDate) + "000000",
        EndDate: newDateFormaterAsPerUTC(startDataUpdate) + "000000",
      };
      setStartDataUpdate(updateStartDate);
      dispatch(getCalendarDataResponse(navigate, t, calendarData, false));
    } else if (endDataUpdate < value._d) {
      const date = new Date(value._d);
      let updateEndDate = new Date(
        date.getFullYear(),
        date.getMonth() + Number(CalenderMonthsSpan)
      );
      let calendarData = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(OrganizationID),
        StartDate: newDateFormaterAsPerUTC(endDataUpdate) + "000000",
        EndDate: newDateFormaterAsPerUTC(updateEndDate) + "000000",
      };
      setEndDataUpdate(updateEndDate);
      dispatch(getCalendarDataResponse(navigate, t, calendarData, false));
    }
    setDefaultValue(newDAte);
    setOpen(false);
    setCalendarView(false);
  }

  // set Data for Calendar
  useEffect(() => {
    let Data = calendarReducer.CalenderData;
    let officeEventColor =
      localStorage.getItem("officeEventColor") !== null
        ? localStorage.getItem("officeEventColor")
        : "#000";
    let googleEventColor =
      localStorage.getItem("googleEventColor") !== null
        ? localStorage.getItem("googleEventColor")
        : "#000";
    let diskusEventColor =
      localStorage.getItem("diskusEventColor") !== null
        ? localStorage.getItem("diskusEventColor")
        : "#000";
    console.log(Data, "DataDataDataData");
    let newList;
    if (Object.keys(calenderData).length > 0) {
      if (defaultState) {
        newList = calenderData;
      } else {
        newList = [];
        setDefaultState(true);
      }
    } else {
      newList = [];
    }
    if (Object.keys(Data).length > 0) {
      Data.map((cData, index) => {
        let StartingTime = forMainCalendar(cData.eventDate + cData.startTime);
        let EndingTime = forMainCalendar(cData.eventDate + cData.endTime);
        let meetingStartTime = newTimeFormaterAsPerUTC(
          cData.eventDate + cData.startTime
        );
        if (cData.fK_CESID === 1) {
          newList.push({
            id: parseInt(cData.pK_CEID),
            eventID: parseInt(cData.fK_CESID),
            title: meetingStartTime + " - " + cData.title,
            allDay: true,
            start: new Date(StartingTime),
            end: new Date(EndingTime),
            border: `2px solid ${googleEventColor}`,
            // color: "#ffff",
            backgroundColor: googleEventColor,
            calendarTypeId: Number(cData.fK_CETID),
            isQuickMeeting: cData.isQuickMeeting,
            statusID: cData.statusID,
            participantRoleID: cData.participantRoleID,
            attendeeRoleID: cData.attendeeRoleID,
            isPrimaryOrganizer: cData.isPrimaryOrganizer,
            meetingID: cData.pK_MDID,
          });
        } else if (cData.fK_CESID === 2 || cData.fK_CESID === 4) {
          newList.push({
            id: parseInt(cData.pK_CEID),
            eventID: parseInt(cData.fK_CESID),
            title: meetingStartTime + " - " + cData.title,
            allDay: true,
            start: new Date(StartingTime),
            end: new Date(EndingTime),
            border: `2px solid ${officeEventColor}`,
            // color: "#ffff",
            backgroundColor: officeEventColor,
            calendarTypeId: Number(cData.fK_CETID),
            isQuickMeeting: cData.isQuickMeeting,
            statusID: cData.statusID,
            participantRoleID: cData.participantRoleID,
            attendeeRoleID: cData.attendeeRoleID,
            isPrimaryOrganizer: cData.isPrimaryOrganizer,
            meetingID: cData.pK_MDID,
          });
        } else if (cData.fK_CESID === 3) {
          newList.push({
            id: parseInt(cData.pK_CEID),
            eventID: parseInt(cData.fK_CESID),
            title: meetingStartTime + " - " + cData.title,
            allDay: true,
            start: new Date(StartingTime),
            end: new Date(EndingTime),
            border: `2px solid ${diskusEventColor}`,
            // color: "#ffff",
            backgroundColor: diskusEventColor,
            calendarTypeId: Number(cData.fK_CETID),
            isQuickMeeting: cData.isQuickMeeting,
            statusID: cData.statusID,
            participantRoleID: cData.participantRoleID,
            attendeeRoleID: cData.attendeeRoleID,
            isPrimaryOrganizer: cData.isPrimaryOrganizer,
            meetingID: cData.pK_MDID,
          });
        }
      });
      setCalenderDatae(newList);
    }
  }, [calendarReducer.CalenderData]);

  useEffect(() => {
    try {
      if (calendarReducer.googleEventCreate !== null) {
        // Google Calenadar Event Source ID # 01
        // Add New Event in State
        let googleEventColor = localStorage.getItem("googleEventColor");

        let calendarData = calendarReducer.googleEventCreate;
        let newData = {
          id: Number(calendarData.calendarEventID),
          eventID: Number(calendarData.calendarEventSourceID),
          title:
            newTimeFormaterAsPerUTCTalkTime(
              formattedString(calendarData.model?.start?.dateTime)
            ) +
            " - " +
            calendarData.model?.summary,
          allDay: true,
          start: utcConvertintoGMT(
            formattedString(calendarData.model?.start?.dateTime)
          ),
          end: utcConvertintoGMT(
            formattedString(calendarData.model?.end?.dateTime)
          ),
          border: `2px solid ${googleEventColor}`,
          // color: "#ffff",
          backgroundColor: googleEventColor,
          calendarTypeId: Number(calendarData.calendarEventTypeID),
          isQuickMeeting: true,
          statusID: 1,
          participantRoleID: 0,
          attendeeRoleID: 0,
          isPrimaryOrganizer: false,
          meetingID: 0,
        };
        setCalenderDatae([...calenderData, newData]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [calendarReducer.googleEventCreate]);

  useEffect(() => {
    try {
      if (calendarReducer.googleEventUpdate !== null) {
        // Google Calenadar Event Source ID # 01
        // Update Existing Event in State
        let googleEventColor = localStorage.getItem("googleEventColor");

        let calendarData = calendarReducer.googleEventUpdate;
        let newData = {
          id: Number(calendarData.calendarEventID),
          eventID: Number(calendarData.calendarEventSourceID),
          title:
            newTimeFormaterAsPerUTCTalkTime(
              formattedString(calendarData.model?.start?.dateTime)
            ) +
            " - " +
            calendarData.model?.summary,
          allDay: true,
          start: utcConvertintoGMT(
            formattedString(calendarData.model?.start?.dateTime)
          ),
          end: utcConvertintoGMT(
            formattedString(calendarData.model?.end?.dateTime)
          ),
          border: `2px solid ${googleEventColor}`,
          // color: "#ffff",
          backgroundColor: googleEventColor,
          calendarTypeId: Number(calendarData.calendarEventTypeID),
          isQuickMeeting: true,
          statusID: 1,
          participantRoleID: 0,
          attendeeRoleID: 0,
          isPrimaryOrganizer: false,
          meetingID: 0,
        };
        setCalenderDatae((calendarData2) =>
          calendarData2.map((data2, index) => {
            if (data2.id === newData.id) {
              return newData;
            } else {
              return data2;
            }
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [calendarReducer.googleEventUpdate]);

  useEffect(() => {
    try {
      if (calendarReducer.googleEventDelete !== null) {
        // Google Calenadar Event Source ID # 01
        // Remove Existing Event in State

        let calendarData = calendarReducer.googleEventDelete;
        setCalenderDatae((calendarData2) =>
          calendarData2.filter(
            (data2, index) => data2.id !== calendarData.calendarEventID
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [calendarReducer.googleEventDelete]);

  useEffect(() => {
    try {
      if (calendarReducer.microsoftEventCreate !== null) {
        // Microsoft Calenadar Event Source ID # 02 & 04
        // Add New Event in State
        let officeEventColor = localStorage.getItem("officeEventColor");
        let calendarData = calendarReducer.microsoftEventCreate;
        let newData = {
          id: Number(calendarData.calendarEventID),
          eventID: Number(calendarData.calendarEventSourceID),
          title:
            newTimeFormaterAsPerUTCTalkTime(
              formattedString(calendarData.model?.start?.dateTime)
            ) +
            " - " +
            calendarData.model?.subject,
          allDay: true,
          start: utcConvertintoGMT(
            formattedString(calendarData.model?.start?.dateTime)
          ),
          end: utcConvertintoGMT(
            formattedString(calendarData.model?.end?.dateTime)
          ),
          border: `2px solid ${officeEventColor}`,
          // color: "#ffff",
          backgroundColor: officeEventColor,
          calendarTypeId: Number(calendarData.calendarEventTypeID),
          isQuickMeeting: true,
          statusID: 1,
          participantRoleID: 0,
          attendeeRoleID: 0,
          isPrimaryOrganizer: false,
          meetingID: 0,
        };
        setCalenderDatae([...calenderData, newData]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [calendarReducer.microsoftEventCreate]);

  useEffect(() => {
    try {
      if (calendarReducer.microsoftEventUpdate !== null) {
        // Microsoft Calenadar Event Source ID # 02 & 04
        // Update Existing Event in State
        let officeEventColor = localStorage.getItem("officeEventColor");
        let calendarData = calendarReducer.microsoftEventUpdate;
        let newData = {
          id: Number(calendarData.calendarEventID),
          eventID: Number(calendarData.calendarEventSourceID),
          title:
            newTimeFormaterAsPerUTCTalkTime(
              formattedString(calendarData.model?.start?.dateTime)
            ) +
            " - " +
            calendarData.model?.subject,
          allDay: true,
          start: utcConvertintoGMT(
            formattedString(calendarData.model?.start?.dateTime)
          ),
          end: utcConvertintoGMT(
            formattedString(calendarData.model?.end?.dateTime)
          ),
          border: `2px solid ${officeEventColor}`,
          // color: "#ffff",
          backgroundColor: officeEventColor,
          calendarTypeId: Number(calendarData.calendarEventTypeID),
          isQuickMeeting: true,
          statusID: 1,
          participantRoleID: 0,
          attendeeRoleID: 0,
          isPrimaryOrganizer: false,
          meetingID: 0,
        };
        setCalenderDatae((calendarData2) =>
          calendarData2.map((data2, index) => {
            if (data2.id === newData.id) {
              return newData;
            } else {
              return data2;
            }
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [calendarReducer.microsoftEventUpdate]);

  useEffect(() => {
    try {
      if (calendarReducer.microsoftEventDelete !== null) {
        // Microsoft Calenadar Event Source ID # 02 & 04
        // Remove Existing Event in State

        let calendarData = calendarReducer.microsoftEventDelete;
        setCalenderDatae((calendarData2) =>
          calendarData2.filter(
            (data2, index) => data2.id !== calendarData.calendarEventID
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [calendarReducer.microsoftEventDelete]);

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
  useEffect(() => {
    try {
      if (MeetingPublishData !== null) {
        console.log(MeetingPublishData, "MeetingPublishDataMeetingPublishData");
        let StartingTime = forMainCalendar(
          MeetingPublishData.dateOfMeeting + MeetingPublishData.meetingStartTime
        );
        let EndingTime = forMainCalendar(
          MeetingPublishData.dateOfMeeting + MeetingPublishData.meetingEndTime
        );
        let meetingStartTime = newTimeFormaterAsPerUTC(
          MeetingPublishData.dateOfMeeting + MeetingPublishData.meetingStartTime
        );
        let findRoleID = MeetingPublishData.meetingAttendees.find(
          (attendeeData, index) =>
            Number(attendeeData?.fK_ParticipantRoleID) === Number(userID)
        );
        let diskusEventColor =
          localStorage.getItem("diskusEventColor") !== null
            ? localStorage.getItem("diskusEventColor")
            : "#000";
        let MeetingData = {
          id: parseInt(MeetingPublishData.pK_CEID),
          eventID: parseInt(MeetingPublishData.fK_CESID),
          title: meetingStartTime + " - " + MeetingPublishData.title,
          allDay: true,
          start: new Date(StartingTime),
          end: new Date(EndingTime),
          border: `2px solid ${diskusEventColor}`,
          // color: "#ffff",
          backgroundColor: diskusEventColor,
          calendarTypeId: Number(MeetingPublishData.fK_CETID),
          isQuickMeeting: MeetingPublishData.isQuickMeeting,
          statusID: Number(MeetingPublishData.statusID),
          participantRoleID:
            findRoleID !== undefined ? findRoleID.fK_ParticipantRoleID : 2,
          attendeeRoleID:
            findRoleID !== undefined
              ? findRoleID.meetingAttendeeRole.pK_MARID
              : 2,
          isPrimaryOrganizer:
            findRoleID !== undefined ? findRoleID.isPrimaryOrganizer : false,
          meetingID: MeetingPublishData.pK_MDID,
        };
        setCalenderDatae([...calenderData, MeetingData]);
        dispatch(meetingStatusPublishedMqtt(null));
      }
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  }, [MeetingPublishData]);
  console.log(calenderData, "calenderDatacalenderData");
  const handleCreateMeeting = () => {
    setMeetingModalShow(true);
  };

  const handleCreateTodo = () => {
    setTodolistModalShow(true);
  };

  //click handler for create events button
  const eventClickHandler = () => {};

  function handleAddEvent() {
    setOpen(true);
    setCalendarView(!calendarView);
  }

  useEffect(() => {
    if (
      adminReducer.UpdateOrganizationMessageResponseMessage != "" &&
      adminReducer.UpdateOrganizationMessageResponseMessage !=
        t("No-records-found") &&
      adminReducer.UpdateOrganizationMessageResponseMessage != ""
    ) {
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
    } else if (
      adminReducer.DeleteOrganizationMessageResponseMessage != "" &&
      adminReducer.DeleteOrganizationMessageResponseMessage !=
        t("No-records-found") &&
      adminReducer.DeleteOrganizationMessageResponseMessage != ""
    ) {
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
    } else if (
      adminReducer.AllOrganizationResponseMessage != "" &&
      adminReducer.AllOrganizationResponseMessage != t("No-records-found") &&
      adminReducer.AllOrganizationResponseMessage != ""
    ) {
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
    } else if (
      adminReducer.ResponseMessage != "" &&
      adminReducer.ResponseMessage != t("No-records-found") &&
      adminReducer.ResponseMessage != ""
    ) {
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
      meetingIdReducer.ResponseMessage != "" &&
      meetingIdReducer.ResponseMessage != t("No-records-found")
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
      assignees.ResponseMessage != "" &&
      assignees.ResponseMessage != t("No-records-found")
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
      dispatch(HideNotificationMeetings());
      dispatch(clearResponseMessage());
    }
  }, [meetingIdReducer.ResponseMessage, assignees.ResponseMessage]);

  useEffect(() => {
    if (
      toDoListReducer.ResponseMessage != "" &&
      toDoListReducer.ResponseMessage != undefined &&
      toDoListReducer.ResponseMessage != "" &&
      toDoListReducer.ResponseMessage != t("No-records-found")
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
      assignees.ResponseMessage != "" &&
      assignees.ResponseMessage != t("No-records-found")
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
    if (
      getTodosStatus.ResponseMessage != "" &&
      getTodosStatus.ResponseMessage != undefined &&
      getTodosStatus.ResponseMessage != "" &&
      getTodosStatus.ResponseMessage != t("No-records-found")
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
      getTodosStatus.UpdateTodoStatusMessage != "" &&
      getTodosStatus.UpdateTodoStatusMessage != t("No-records-found")
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
      getTodosStatus.UpdateTodoStatus != "" &&
      getTodosStatus.UpdateTodoStatus != t("No-records-found")
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

  useEffect(() => {
    if (
      calendarReducer.getEventTypeIds !== null &&
      calendarReducer.getEventTypeIds !== undefined &&
      calendarReducer.getEventTypeIds.length > 0
    ) {
      setEventTypes(calendarReducer.getEventTypeIds);
    }
  }, [calendarReducer.getEventTypeIds]);
  useEffect(() => {
    if (
      calendarReducer.eventsDetails !== null &&
      calendarReducer.eventsDetails !== undefined
    ) {
      setMeetingData(calendarReducer.eventsDetails.diskusCalendarEvent);
    }
  }, [calendarReducer.eventsDetails]);
  console.log(
    calenderData,
    calendarReducer,
    "calendarReducercalendarReducercalendarReducercalendarReducer"
  );
  return (
    <>
      <div className='calendar_container'>
        <Row className='d-flex justify-content-start align-items-center margin-bottom-15 mt-2'>
          <Col lg={2} md={2} sm={2} xs={12}>
            <span className='Calender-heading'>{t("Calendar")}</span>
          </Col>
          <Col
            lg={2}
            md={2}
            sm={2}
            // className=" mt-2 d-flex justify-content-center"
          >
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Dropdown
                  className='Calendar_CreateBtn'
                  onClick={eventClickHandler}
                  align={"start"}>
                  <Dropdown.Toggle title={t("Create")}>
                    <Row>
                      <Col lg={12} md={12} sm={12} className='heading_button'>
                        <Plus width={20} height={20} fontWeight={800} />
                        <span>{t("Create")}</span>
                      </Col>
                    </Row>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {checkFeatureIDAvailability(1) ? (
                      <>
                        <Dropdown.Item
                          className='dropdown-item'
                          onClick={handleCreateMeeting}>
                          {t("Schedule-a-meeting")}
                        </Dropdown.Item>
                      </>
                    ) : null}
                    {checkFeatureIDAvailability(14) ? (
                      <>
                        <Dropdown.Item
                          className='dropdown-item'
                          onClick={handleCreateTodo}>
                          {t("Create-a-to-do-list")}
                        </Dropdown.Item>
                      </>
                    ) : null}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='align-items-center'>
          <Calendar
            events={calenderData}
            startDataUpdate={startDataUpdate}
            setStartDataUpdate={setStartDataUpdate}
            endDataUpdate={endDataUpdate}
            setEndDataUpdate={setEndDataUpdate}
            handleEventSelect={viewModalHandler}
            className='calendar'
            onChange={onChange}
            handleAddEvent={handleAddEvent}
            setCalendarView={setCalendarView}
            calendarView={calendarView}
            defaultValue={defaultValue}
            setDefaultValue={setDefaultValue}
            setOpen={setOpen}
            selectable={true}
          />
        </Row>
      </div>

      <MeetingViewModalCalendar
        viewFlag={calendarViewModal}
        setViewFlag={setCalendarViewModal}
        data={meetingData}
      />
      {meetingModalShow && (
        <ModalMeeting
          // this is check from where its called 2 is from Calendar
          checkFlag={2}
          show={meetingModalShow}
          setShow={setMeetingModalShow}
        />
      )}

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
