import React, { useEffect, useState } from "react";
import { Col, Row, Dropdown } from "react-bootstrap";
import { Calendar, Notification } from "./../../components/elements";
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
  forMainCalendar,
  newDateFormaterAsPerUTC,
  newTimeFormaterAsPerUTC,
  newTimeFormaterAsPerUTCTalkTime,
  formattedString,
  utcConvertintoGMT,
  getCurrentDateTimeUTC,
} from "../../commen/functions/date_formater";
import ModalMeeting from "../modalmeeting/ModalMeeting";
import TodoListModal from "../todolistModal/ModalToDoList";
import { clearResponseMessage } from "../../store/actions/Get_List_Of_Assignees";
import { useTranslation } from "react-i18next";
import { cleareMessage } from "../../store/actions/Admin_AddUser";
import { cleareMessage as cleareMessagetodo } from "../../store/actions/GetTodos";
import { HideNotificationMeetings } from "../../store/actions/GetMeetingUserId";
import { clearResponce } from "../../store/actions/ToDoList_action";
import { useNavigate } from "react-router-dom";
import MeetingViewModalCalendar from "../modalView/ModalView";
import { checkFeatureIDAvailability } from "../../commen/functions/utils";
import { showMessage } from "../../components/elements/snack_bar/utill";
import {
  JoinCurrentMeeting,
  meetingStatusPublishedMqtt,
} from "../../store/actions/NewMeetingActions";

const CalendarPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MeetingPublishData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData
  );
  const getEventTypeIds = useSelector(
    (state) => state.calendarReducer.getEventTypeIds
  );
  const eventsDetails = useSelector(
    (state) => state.calendarReducer.eventsDetails
  );
  const CalenderData = useSelector(
    (state) => state.calendarReducer.CalenderData
  );
  const googleEventCreate = useSelector(
    (state) => state.calendarReducer.googleEventCreate
  );
  const googleEventUpdate = useSelector(
    (state) => state.calendarReducer.googleEventUpdate
  );
  const googleEventDelete = useSelector(
    (state) => state.calendarReducer.googleEventDelete
  );
  const microsoftEventCreate = useSelector(
    (state) => state.calendarReducer.microsoftEventCreate
  );
  const microsoftEventUpdate = useSelector(
    (state) => state.calendarReducer.microsoftEventUpdate
  );
  const microsoftEventDelete = useSelector(
    (state) => state.calendarReducer.microsoftEventDelete
  );
  const ViewMeetingDetails = useSelector(
    (state) => state.assignees.ViewMeetingDetails
  );
  const ResponseMessageAssigneesReducer = useSelector(
    (state) => state.assignees.ResponseMessage
  );
  const ResponseMessageTodolistReducer = useSelector(
    (state) => state.toDoListReducer.ResponseMessage
  );
  const UpdateOrganizationMessageResponseMessage = useSelector(
    (state) => state.adminReducer.UpdateOrganizationMessageResponseMessage
  );
  const DeleteOrganizationMessageResponseMessage = useSelector(
    (state) => state.adminReducer.DeleteOrganizationMessageResponseMessage
  );
  const AllOrganizationResponseMessage = useSelector(
    (state) => state.adminReducer.AllOrganizationResponseMessage
  );
  const ResponseMessageAdminReducer = useSelector(
    (state) => state.adminReducer.ResponseMessage
  );
  const ResponseMessageMeetingReducer = useSelector(
    (state) => state.meetingIdReducer.ResponseMessage
  );
  const ResponseMessageTodoStatusReducer = useSelector(
    (state) => state.getTodosStatus.ResponseMessage
  );
  const UpdateTodoStatusMessage = useSelector(
    (state) => state.getTodosStatus.UpdateTodoStatusMessage
  );
  const UpdateTodoStatus = useSelector(
    (state) => state.getTodosStatus.UpdateTodoStatus
  );

  const [meetingModalShow, setMeetingModalShow] = useState(false);
  const [EventTypes, setEventTypes] = useState([]);
  const [todolistModalShow, setTodolistModalShow] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [viewFlag, setViewFlag] = useState(false);
  const [calenderData, setCalenderDatae] = useState([]);
  const [calendarView, setCalendarView] = useState(false);
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [defaultState, setDefaultState] = useState(false);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [startDataUpdate, setStartDataUpdate] = useState("");
  const [endDataUpdate, setEndDataUpdate] = useState("");
  let CalenderMonthsSpan =
    localStorage.getItem("calenderMonthsSpan") !== null
      ? localStorage.getItem("calenderMonthsSpan")
      : 1;
  let OrganizationID = localStorage.getItem("organizationID");
  const userID = localStorage.getItem("userID");
  var currentDate = new Date();

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
        if (Number(value.statusID) === 10) {
          let joinMeetingData = {
            FK_MDID: value.meetingID,
            DateTime: getCurrentDateTimeUTC(),
          };

          await dispatch(
            JoinCurrentMeeting(
              true,
              navigate,
              t,
              joinMeetingData,
              setCalendarViewModal,
              "",
              "", // Fixed typo here, assuming it should be setScheduleMeeting instead of setSceduleMeeting
              10, // Calendar View
              "",
              ""
            )
          );
        } else {
          dispatch(getEventsDetails(navigate, Data, t, setCalendarViewModal));
        }
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
      if (!getEventTypeIds?.length > 0) {
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
      } else {
        //

        if (open2) {
        } else {
          if (clsname === "") {
          } else {
          }
        }
      }
    });
    return () => {
      dispatch(clearCalendarState());
    };
  }, []);

  function onChange(value) {
    let newDAte = moment(value._d).format("YYYY-MM-DD");
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
    setOpen2(false);
    setCalendarView(false);
  }

  // set Data for Calendar
  useEffect(() => {
    let Data = CalenderData;
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
      Data.map((cData) => {
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
  }, [CalenderData]);

  useEffect(() => {
    try {
      if (googleEventCreate !== null) {
        // Google Calenadar Event Source ID # 01
        // Add New Event in State
        let googleEventColor = localStorage.getItem("googleEventColor");

        let calendarData = googleEventCreate;
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
  }, [googleEventCreate]);

  useEffect(() => {
    try {
      if (googleEventUpdate !== null) {
        // Google Calenadar Event Source ID # 01
        // Update Existing Event in State
        let googleEventColor = localStorage.getItem("googleEventColor");

        let calendarData = googleEventUpdate;
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
  }, [googleEventUpdate]);

  useEffect(() => {
    try {
      if (googleEventDelete !== null) {
        // Google Calenadar Event Source ID # 01
        // Remove Existing Event in State

        let calendarData = googleEventDelete;
        setCalenderDatae((calendarData2) =>
          calendarData2.filter(
            (data2, index) => data2.id !== calendarData.calendarEventID
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [googleEventDelete]);

  useEffect(() => {
    try {
      if (microsoftEventCreate !== null) {
        // Microsoft Calenadar Event Source ID # 02 & 04
        // Add New Event in State
        let officeEventColor = localStorage.getItem("officeEventColor");
        let calendarData = microsoftEventCreate;
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
  }, [microsoftEventCreate]);

  useEffect(() => {
    try {
      if (microsoftEventUpdate !== null) {
        // Microsoft Calenadar Event Source ID # 02 & 04
        // Update Existing Event in State
        let officeEventColor = localStorage.getItem("officeEventColor");
        let calendarData = microsoftEventUpdate;
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
  }, [microsoftEventUpdate]);

  useEffect(() => {
    try {
      if (microsoftEventDelete !== null) {
        // Microsoft Calenadar Event Source ID # 02 & 04
        // Remove Existing Event in State

        let calendarData = microsoftEventDelete;
        setCalenderDatae((calendarData2) =>
          calendarData2.filter(
            (data2, index) => data2.id !== calendarData.calendarEventID
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [microsoftEventDelete]);

  // setting view flag
  useEffect(() => {
    if (Object.keys(ViewMeetingDetails).length > 0) {
      setViewFlag(true);
    } else {
    }
  }, [ViewMeetingDetails]);
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
    setOpen2(true);
    setCalendarView(!calendarView);
  }

  useEffect(() => {
    if (
      UpdateOrganizationMessageResponseMessage !== "" &&
      UpdateOrganizationMessageResponseMessage !== t("No-records-found") &&
      UpdateOrganizationMessageResponseMessage !== ""
    ) {
      showMessage(UpdateOrganizationMessageResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (
      DeleteOrganizationMessageResponseMessage !== "" &&
      DeleteOrganizationMessageResponseMessage !== t("No-records-found") &&
      DeleteOrganizationMessageResponseMessage !== ""
    ) {
      showMessage(DeleteOrganizationMessageResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else if (
      AllOrganizationResponseMessage !== "" &&
      AllOrganizationResponseMessage !== t("No-records-found") &&
      AllOrganizationResponseMessage !== ""
    ) {
      showMessage(AllOrganizationResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else if (
      ResponseMessageAdminReducer !== "" &&
      ResponseMessageAdminReducer !== t("No-records-found") &&
      ResponseMessageAdminReducer !== ""
    ) {
      showMessage(ResponseMessageAdminReducer, "success", setOpen);

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    UpdateOrganizationMessageResponseMessage,
    DeleteOrganizationMessageResponseMessage,
    AllOrganizationResponseMessage,
    ResponseMessageAdminReducer,
  ]);

  useEffect(() => {
    if (
      ResponseMessageMeetingReducer !== "" &&
      ResponseMessageMeetingReducer !== "" &&
      ResponseMessageMeetingReducer !== t("No-records-found")
    ) {
      showMessage(ResponseMessageMeetingReducer, "success", setOpen);

      dispatch(HideNotificationMeetings());
    } else if (
      ResponseMessageAssigneesReducer !== "" &&
      ResponseMessageAssigneesReducer !== "" &&
      ResponseMessageAssigneesReducer !== t("No-records-found")
    ) {
      showMessage(ResponseMessageAssigneesReducer, "success", setOpen);

      dispatch(clearResponseMessage());
    } else {
      dispatch(HideNotificationMeetings());
      dispatch(clearResponseMessage());
    }
  }, [ResponseMessageMeetingReducer, ResponseMessageAssigneesReducer]);

  useEffect(() => {
    if (
      ResponseMessageTodolistReducer !== "" &&
      ResponseMessageTodolistReducer !== undefined &&
      ResponseMessageTodolistReducer !== "" &&
      ResponseMessageTodolistReducer !== t("No-records-found")
    ) {
      showMessage(ResponseMessageTodolistReducer, "success", setOpen);

      dispatch(clearResponce());
    } else if (
      ResponseMessageAssigneesReducer !== "" &&
      ResponseMessageAssigneesReducer !== "" &&
      ResponseMessageAssigneesReducer !== t("No-records-found")
    ) {
      showMessage(ResponseMessageAssigneesReducer, "success", setOpen);

      dispatch(clearResponseMessage());
    } else {
      dispatch(clearResponce());
      dispatch(clearResponseMessage());
    }
  }, [ResponseMessageTodolistReducer, ResponseMessageAssigneesReducer]);

  useEffect(() => {
    if (
      ResponseMessageTodoStatusReducer !== "" &&
      ResponseMessageTodoStatusReducer !== undefined &&
      ResponseMessageTodoStatusReducer !== "" &&
      ResponseMessageTodoStatusReducer !== t("No-records-found")
    ) {
      showMessage(ResponseMessageTodoStatusReducer, "success", setOpen);

      dispatch(cleareMessagetodo());
    } else if (
      UpdateTodoStatusMessage !== "" &&
      UpdateTodoStatusMessage !== undefined &&
      UpdateTodoStatusMessage !== "" &&
      UpdateTodoStatusMessage !== t("No-records-found")
    ) {
      showMessage(UpdateTodoStatusMessage, "success", setOpen);

      dispatch(cleareMessagetodo());
    } else if (
      UpdateTodoStatus !== "" &&
      UpdateTodoStatus !== undefined &&
      UpdateTodoStatus !== "" &&
      UpdateTodoStatus !== t("No-records-found")
    ) {
      showMessage(UpdateTodoStatus, "success", setOpen);

      dispatch(cleareMessagetodo());
    } else {
      dispatch(cleareMessagetodo());
    }
  }, [
    ResponseMessageTodoStatusReducer,
    UpdateTodoStatusMessage,
    UpdateTodoStatus,
  ]);

  useEffect(() => {
    if (
      getEventTypeIds !== null &&
      getEventTypeIds !== undefined &&
      getEventTypeIds.length > 0
    ) {
      setEventTypes(getEventTypeIds);
    }
  }, [getEventTypeIds]);
  useEffect(() => {
    if (eventsDetails !== null && eventsDetails !== undefined) {
      setMeetingData(eventsDetails.diskusCalendarEvent);
    }
  }, [eventsDetails]);

  return (
    <>
      <div className="calendar_container">
        <Row className="d-flex justify-content-start align-items-center margin-bottom-15 mt-2">
          <Col lg={2} md={2} sm={2} xs={12}>
            <span className="Calender-heading">{t("Calendar")}</span>
          </Col>
          <Col lg={2} md={2} sm={2}>
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
                    {checkFeatureIDAvailability(1) ? (
                      <>
                        <Dropdown.Item
                          className="dropdown-item"
                          onClick={handleCreateMeeting}
                        >
                          {t("Schedule-a-meeting")}
                        </Dropdown.Item>
                      </>
                    ) : null}
                    {checkFeatureIDAvailability(14) ? (
                      <>
                        <Dropdown.Item
                          className="dropdown-item"
                          onClick={handleCreateTodo}
                        >
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
        <Row className="align-items-center">
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
            setOpen2={setOpen2}
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
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default CalendarPage;
