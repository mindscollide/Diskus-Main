import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  TextArea,
  SelectComment,
  TextField,
} from "../../../../../../../../components/elements"; // Importing necessary components
import styles from "./ResendReview.module.css"; // Importing CSS styles
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import CrossIcon from "./../../../../../../../MinutesNewFlow/Images/avatar.png";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";

// Functional component for editing a comment
const ResendMinuteReviewModal = ({
  editMinute,
  setEditMinute,
  confirmationEdit,
  setConfirmationEdit,
  resendMinuteForReview,
  setResendMinuteForReview,
}) => {
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [reviewConfirmation, setReviewConfirmation] = useState(false);

  const [minuteDate, setMinuteDate] = useState("");

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  //DatePicker Stuff
  const minuteDateHandler = (date, format = "YYYYMMDD") => {
    let minuteDateValueFormat = new DateObject(date).format("DD MMMM YYYY");
    setMinuteDate(minuteDateValueFormat);
    if (calendRef.current.isOpen) {
      calendRef.current.closeCalendar();
    }
  };

  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  return (
    <>
      {reviewConfirmation ? (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <p className={styles["delete-comment-message"]}>
              {t(
                "Deadline will be revised for all minutes. Do you want to proceed?"
              )}
              {/* Translation for delete comment message */}
            </p>
          </div>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-center gap-2" // CSS class for flex layout
            >
              {/* Button for confirming deletion */}
              <Button
                text={t("Yes")} // Translation for "Yes" button
                className={styles["No_Modal"]} // CSS class for "Yes" button
                onClick={() => {
                  setEditMinute(false);
                  setConfirmationEdit(false);
                  setResendMinuteForReview(false);
                }}
              />
              {/* Button for canceling deletion */}
              <Button
                text={t("No")} // Translation for "No" button
                onClick={() => setReviewConfirmation(false)}
                className={styles["Yes_Modal"]} // CSS class for "No" button
              />
            </Col>
          </Row>
        </>
      ) : (
        <>
          {" "}
          <h1 className={styles["Edit-Heading"]}>{t("Resend")}</h1>
          <Row>
            <label className={styles["label-style"]}>{t("Reviewers")}</label>
            <Col lg={6} md={6} sm={12}>
              <div className={styles["profile-wrapper"]}>
                <div className={styles["image-profile-wrapper"]}>
                  <img
                    height={32}
                    width={32}
                    className={styles["image-style"]}
                    src={CrossIcon}
                    alt=""
                  />
                  <span>Alexis Martinez</span>
                </div>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <div className={styles["profile-wrapper"]}>
                <div className={styles["image-profile-wrapper"]}>
                  <img
                    height={32}
                    width={32}
                    className={styles["image-style"]}
                    src={CrossIcon}
                    alt=""
                  />
                  <span>Alexandar Johnson</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12}>
              <div className={styles["profile-wrapper"]}>
                <div className={styles["image-profile-wrapper"]}>
                  <img
                    height={32}
                    width={32}
                    className={styles["image-style"]}
                    src={CrossIcon}
                    alt=""
                  />
                  <span>Kibutsuji Muzan</span>
                </div>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <div className={styles["profile-wrapper"]}>
                <div className={styles["image-profile-wrapper"]}>
                  <img
                    height={32}
                    width={32}
                    className={styles["image-style"]}
                    src={CrossIcon}
                    alt=""
                  />
                  <span>Kamado Tanjiro</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <label className={styles["label-style"]}>{t("Deadline")}</label>
            <Col lg={6} md={6} sm={12} className="datepickerlength mt-2">
              <DatePicker
                onFocusedDateChange={minuteDateHandler}
                format={"DD MMMM YYYY"}
                value={minuteDate}
                minDate={moment().toDate()}
                placeholder={t("Select-date")}
                editable={false}
                className="datePickerTodoCreate2"
                onOpenPickNewDate={true}
                inputMode=""
                calendar={calendarValue}
                locale={localValue}
                ref={calendRef}
                render={
                  <InputIcon
                    placeholder={t("Select-date")}
                    className="datepicker_input_minute_sendreview"
                  />
                }
              />
            </Col>
            <Col lg={6} md={6} sm={12}></Col>
          </Row>
          <Row className="mt-4">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2" // CSS class for flex layout
            >
              <Button
                text={t("Send")} // Translation for button text
                className={styles["Resend_Button"]} // CSS class for button
                onClick={() => setReviewConfirmation(true)}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ResendMinuteReviewModal; // Exporting the component