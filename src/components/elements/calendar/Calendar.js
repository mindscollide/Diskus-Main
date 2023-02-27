import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import { DatePicker } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronRight, ChevronLeft } from "react-bootstrap-icons";
import startOfWeek from "date-fns/startOfWeek";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import {
  Calendar,
  dateFnsLocalizer,
  momentLocalizer,
  DateLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Calendar.module.css";
import moment from "moment";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "./../../../components/elements";
import Helper from "../../../commen/functions/history_logout";
import { useTranslation } from "react-i18next";
require("moment/locale/ar");
require("moment/locale/ar-sa");
require("moment/locale/fr");
require("moment/locale/en-gb");
moment.locale("en-US");
// require("moment-hijri");
// const locales = {
//   "en-US": require("date-fns/locale/en-US"),
// };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });
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

    showMore: (total) => `+${total} plus`,
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

    showMore: (total) => `+${total} إضافي`,
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

    showMore: (total) => `+${total} إضافي`,
  },
};
function CustomCalendar({
  events,
  handleEventSelect,
  className,
  onChange,
  handleAddEvent,
  setCalendarView,
  calendarView,
  defaultValue,
  setDefaultValue,
  pLanguage,
}) {
  const [culture, setCulture] = useState("fr");
  const [rightToLeft, setRightToLeft] = useState(false);

  let currentLanguage = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();
  const todayDate = new Date();
  const onNavigate = useCallback(
    (newDate) => setDefaultValue(newDate),
    [setDefaultValue]
  );
  let lan = localStorage.getItem("i18nextLng");
  const customToolbar = (props) => {
    const navigate = (action) => {
      props.onNavigate(action);
    };
    const goPrev = (value) => {
      navigate("PREV");
      console.log("navigate", navigate("PREV"));
    };
    const goNext = () => {
      navigate("NEXT");
    };
    const handleCurrent = () => {
      let date = moment(todayDate).format("YYYY-MM-DD");
      setDefaultValue(date);
      console.log("navigate", date, defaultValue);
    };

    return (
      <Container>
        <Row className="d-flex justify-content-center">
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
      </Container>
    );
  };

  useEffect(() => {
    setCulture(lan);

    console.log("hjsdhad", "hahahaah");

    if (lan === "hijri") {
      console.log("hjsdhad", "hahahaah");

      setRightToLeft(true);
      moment.locale(lan);

      // if (Helper.isReload) {
      //   window.location.reload();
      //   Helper.isReload = false;
      // }
    } else if (lan === "ar") {
      setRightToLeft(true);
      moment.locale(lan);

      // if (Helper.isReload) {
      //   window.location.reload();
      //   Helper.isReload = false;
      // }
    } else if (lan === "fr") {
      console.log("hjsdhad", "hahahaah");
      setRightToLeft(true);
      moment.locale(lan);

      // if (Helper.isReload) {
      //   window.location.reload();
      //   Helper.isReload = false;
      // }
    } else {
      console.log("hjsdhad", "hahahaah");
      setRightToLeft(false);
      moment.locale(lan);

      // if (Helper.isReload) {
      //   window.location.reload();
      //   Helper.isReload = false;
      // }
    }
  }, [lan]);

  const { messages } = useMemo(
    () => ({
      messages: lang[culture],
    }),
    [culture]
  );

  return (
    <Container className="bg-white border-radius-4 border ">
      <Row>
        <Col sm={12}>
          <Calendar
            selectable
            localizer={localizer}
            resizable
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={true}
            date={defaultValue}
            onSelectEvent={handleEventSelect}
            className={className}
            components={{
              toolbar: customToolbar,
              // header: customTimeSlotHeader,
              month: false,
            }}
            onNavigate={onNavigate}
            step={15}
            timeslots={15}
            popup={true}
            culture={culture}
            messages={messages}
            rtl={rightToLeft}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CustomCalendar;
