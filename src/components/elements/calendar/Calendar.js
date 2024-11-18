import { DatePicker } from "antd";
import { Row, Col } from "react-bootstrap";
import { ChevronRight, ChevronLeft } from "react-bootstrap-icons";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Calendar.module.css";
import moment from "moment";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "./../../../components/elements";
import { useTranslation } from "react-i18next";
import {
  convertintoGMTCalender,
  newDateFormaterAsPerUTC,
} from "../../../commen/functions/date_formater";
import { getCalendarDataResponse } from "../../../store/actions/GetDataForCalendar";
import CalendarFooter from "./calender_footer";
require("moment/locale/ar");
require("moment/locale/ar-sa");
require("moment/locale/fr");
require("moment/locale/en-gb");
moment.locale("en-US");
const localizer = momentLocalizer(moment);

const lang = {
  en: null,
  "en-GB": null,
  fr: {
    week: "La semaine",
    work_week: "Semaine de travail",
    day: "Jour",
    month: "Mois",
    previous: "Antérieur",
    next: "Prochain",
    today: `Aujourd'hui`,
    agenda: "Ordre du jour",

    showMore: (total) => (
      <span className={styles["calendarsowMore"]}>{`+${total} plus`}</span>
    ),
  },
  ar: {
    week: "أسبوع",
    work_week: "أسبوع العمل",
    day: "يوم",
    month: "شهر",
    previous: "سابق",
    next: "التالي",
    today: "اليوم",
    agenda: "جدول أعمال",
    showMore: (total) => (
      <span className={styles["calendarsowMore"]}>{`+${total} إضافي`}</span>
    ),
  },
  hijri: {
    week: "أسبوع",
    work_week: "أسبوع العمل",
    day: "يوم",
    month: "شهر",
    previous: "سابق",
    next: "التالي",
    today: "اليوم",
    agenda: "جدول أعمال",
    showMore: (total) => (
      <span className={styles["calendarsowMore"]}>{`+${total} إضافي`}</span>
    ),
  },
};

function CustomCalendar({
  events,
  startDataUpdate,
  setStartDataUpdate,
  endDataUpdate,
  setEndDataUpdate,
  handleEventSelect,
  className,
  onChange,
  handleAddEvent,
  setCalendarView,
  calendarView,
  defaultValue,
  setDefaultValue,
}) {
  const [culture, setCulture] = useState("fr");
  const [rightToLeft, setRightToLeft] = useState(false);
  const [prevCheck, setPrevCheck] = useState(false);
  const [nextCheck, setNextCheck] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const handleEventMouseLeave = () => {
    setHoveredEvent(null);
  };
  const [popupOffset, setPopupOffset] = useState({ x: 2, y: 6 });
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();
  const todayDate = new Date();
  const navigate = useNavigate();

  const onNavigate = useCallback(
    (newDate) => setDefaultValue(newDate),
    [setDefaultValue]
  );
  let CalenderMonthsSpan =
    localStorage.getItem("calenderMonthsSpan") !== null
      ? localStorage.getItem("calenderMonthsSpan")
      : 1;
  let OrganizationID = localStorage.getItem("organizationID");
  const userID = localStorage.getItem("userID");
  const dispatch = useDispatch();
  let lan = localStorage.getItem("i18nextLng");

  const customToolbar = (props) => {
    const navigate = (action) => {
      props.onNavigate(action);
    };
    const goPrev = () => {
      navigate("PREV");
      setPrevCheck(true);
    };
    const goNext = () => {
      navigate("NEXT");
      setNextCheck(true);
    };

    const handleCurrent = () => {
      let date = moment(todayDate).format("YYYY-MM-DD");
      setDefaultValue(date);
    };
    const handleMonthChange = (date, dateString) => {
      // Handle the month change event here
    };

    return (
      <Row className="d-flex justify-content-center calendar-header">
        <Col lg={3} md={3} sm={false}></Col>
        <Col
          lg={1}
          md={1}
          sm={3}
          className={
            "d-flex justify-content-end align-items-center" +
            " " +
            currentLanguage
          }
        >
          {" "}
          <ChevronLeft className={styles["icon"]} onClick={goPrev} />
        </Col>
        <Col lg={3} md={3} sm={6} className="d-flex justify-content-center">
          <div className={"clickbox"}>
            <DatePicker
              onChange={(e) => {
                onChange(e);
                setCalendarView(false);
              }}
              onPanelChange={handleMonthChange}
              open={calendarView}
              className="date-picker-style"
            />
          </div>
          <h3
            onClick={() => handleAddEvent()}
            className={styles["calendar-add-event-label"]}
          >
            {" "}
            {props.label}
          </h3>
        </Col>
        <Col
          lg={1}
          md={1}
          sm={3}
          className={
            "d-flex justify-content-start align-items-center" +
            " " +
            currentLanguage
          }
        >
          <ChevronRight className={styles["icon"]} onClick={goNext} />
        </Col>
        <Col lg={1} md={1} sm={false}></Col>

        <Col
          lg={3}
          md={3}
          sm={12}
          className={"TodayButton text-end p-0" + " " + currentLanguage}
        >
          <Button
            className="btn calendar-today"
            text={t("Today")}
            onClick={handleCurrent}
          />
        </Col>
      </Row>
    );
  };

  useEffect(() => {
    setCulture(lan);
    if (lan === "hijri") {
      setRightToLeft(true);
      moment.locale(lan);
    } else if (lan === "ar") {
      setRightToLeft(true);
      moment.locale(lan);
    } else if (lan === "fr") {
      setRightToLeft(true);
      moment.locale(lan);
    } else {
      setRightToLeft(false);
      moment.locale(lan);
    }
  }, [lan]);

  useEffect(() => {
    if (prevCheck) {
      let givenDate = new Date(defaultValue);
      let previousDate = new Date(givenDate);
      previousDate.setDate(givenDate.getDate() - 1);
      let newcheckDate = convertintoGMTCalender(startDataUpdate);
      const nextDay = new Date(newcheckDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Adding 2 days to the date
      const twoDaysLater = new Date(newcheckDate);
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      if (
        startDataUpdate >= newDateFormaterAsPerUTC(previousDate) ||
        nextDay <= newDateFormaterAsPerUTC(previousDate) ||
        twoDaysLater <= newDateFormaterAsPerUTC(previousDate)
      ) {
        setPrevCheck(false);
        let updateNewStartDates = convertintoGMTCalender(startDataUpdate);
        let updateNewStartDate = new Date(updateNewStartDates);
        let updateStartDate = new Date(
          updateNewStartDate.getFullYear(),
          updateNewStartDate.getMonth() -
            parseInt(
              parseInt(CalenderMonthsSpan) === 0
                ? 1
                : parseInt(CalenderMonthsSpan)
            ),
          updateNewStartDate.getDate()
        );
        let calendarData = {
          UserID: parseInt(userID),
          OrganizationID: parseInt(OrganizationID),
          StartDate: newDateFormaterAsPerUTC(updateStartDate) + "000000",
          EndDate: newDateFormaterAsPerUTC(startDataUpdate) + "000000",
        };
        setStartDataUpdate(newDateFormaterAsPerUTC(updateStartDate));
        dispatch(getCalendarDataResponse(navigate, t, calendarData, false));
      } else {
        setPrevCheck(false);
      }
    } else {
      setPrevCheck(false);
    }
    if (nextCheck) {
      if (endDataUpdate <= newDateFormaterAsPerUTC(defaultValue)) {
        setNextCheck(false);
        let updateNewEndDataUpdates = convertintoGMTCalender(endDataUpdate);
        let updateNewEndDataUpdate = new Date(updateNewEndDataUpdates);
        let nextDate = new Date(updateNewEndDataUpdate);
        nextDate.setDate(updateNewEndDataUpdate.getDate() + 1);
        let updateEndDate = new Date(
          nextDate.getFullYear(),
          nextDate.getMonth() +
            parseInt(
              parseInt(CalenderMonthsSpan) === 0
                ? 1
                : parseInt(CalenderMonthsSpan)
            ),
          nextDate.getDate()
        );

        let calendarData = {
          UserID: parseInt(userID),
          OrganizationID: parseInt(OrganizationID),
          StartDate: newDateFormaterAsPerUTC(nextDate) + "000000",
          EndDate: newDateFormaterAsPerUTC(updateEndDate) + "000000",
        };
        setEndDataUpdate(newDateFormaterAsPerUTC(updateEndDate));
        dispatch(getCalendarDataResponse(navigate, t, calendarData, false));
      } else {
        setNextCheck(false);
      }
    } else {
      setNextCheck(false);
    }
  }, [prevCheck, nextCheck]);

  const { messages } = useMemo(
    () => ({
      messages: lang[culture],
    }),
    [culture]
  );
  const eventStyleGetter = (event, start, end, isSelected, isHovered) => {
    let backgroundColor = isSelected ? "green" : "blue"; // Default and hover background color
    let textColor = isSelected ? "black" : isHovered ? "white" : "black"; // Default and hover text color
    let border = "none"; // Default border style

    if (event) {
      backgroundColor = event.backgroundColor || backgroundColor; // Use event's background color if defined
      textColor = event.textColor || textColor; // Use event's text color if defined
      border = event.border || border; // Use event's border if defined
    }
    if (isSelected) {
      textColor = "#fff";
    }
    if (isHovered) {
      textColor = "#fff";
      backgroundColor = "#000";
    }
    return {
      style: {
        backgroundColor,
        color: textColor,
        border,
      },
    };
  };

  const eventPropGetter = (event, start, end, isSelected) => {
    // const isPastEvent = event.start < currentDate;
    let style = {};

    if (event) {
      style = {
        // Disable pointer events for past events
        border: event.border,
        backgroundColor: event.backgroundColor, // Apply opacity to visually indicate past events
      };
    }

    return {
      style: style,
    };
  };

  const showMoreEvents = (dates) => {};

  return (
    <div className="bg-white border-radius-4 border">
      <Col sm={12}>
        <Calendar
          selectable
          localizer={localizer}
          // resizable
          events={events}
          startAccessor="start"
          endAccessor="end"
          popupOffset={popupOffset}
          views={false}
          date={defaultValue}
          onSelectEvent={handleEventSelect}
          className={className}
          components={{
            toolbar: customToolbar,
            month: false,
          }}
          eventPropGetter={eventStyleGetter}
          onNavigate={onNavigate}
          step={15}
          timeslots={15}
          culture={culture}
          popup={true}
          onShowMore={(events, date) => showMoreEvents(events)}
          messages={messages}
          rtl={rightToLeft}
          enableAutoScroll={true}
          style={{
            position: "relative",
          }}
        />
        <CalendarFooter />
      </Col>
    </div>
  );
}

export default CustomCalendar;
