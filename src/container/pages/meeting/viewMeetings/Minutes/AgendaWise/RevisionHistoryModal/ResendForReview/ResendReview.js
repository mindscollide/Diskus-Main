import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../../../../../../components/elements"; // Importing necessary components
import styles from "./ResendReview.module.css"; // Importing CSS styles
import { useTranslation } from "react-i18next"; // Importing translation hook
import { useDispatch } from "react-redux"; // Importing Redux hooks
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap"; // Importing Bootstrap components
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  formatDateToUTCWithEndOfDay,
  multiDatePickerDateChangIntoUTC,
  utcConvertintoGMT,
} from "../../../../../../../../commen/functions/date_formater";
import {
  UpdateAgendaWiseMinutesApiFunc,
  UpdateMinutesGeneralApiFunc,
} from "../../../../../../../../store/actions/NewMeetingActions";

// Functional component for editing a comment
const ResendMinuteReviewModal = ({
  setEditMinute,
  setConfirmationEdit,
  setResendMinuteForReview,
  editMinuteData,
  updateMinuteData,
  minuteDate,
  setMinuteDate,
  advanceMeetingModalID,
  isAgenda,
  setShowRevisionHistory,
}) => {
  console.log(
    editMinuteData,
    "minuteDateminuteDateminuteDateminuteDateminuteDate"
  );
  const { t } = useTranslation(); // Translation hook

  const dispatch = useDispatch(); // Redux dispatch hook

  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");

  const [reviewConfirmation, setReviewConfirmation] = useState(false);

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  //DatePicker Stuff
  const minuteDateHandler = (date, format = "YYYYMMDD") => {
    let minuteDateValueFormat = new Date(date);
    setMinuteDate(minuteDateValueFormat);
    if (calendRef.current.isOpen) {
      calendRef.current.closeCalendar();
    }
  };
  console.log(minuteDate, "minuteDateminuteDateminuteDate");
  const resendForReview = () => {
    // let updateMinuteData;

    let resendReviewData = {
      MeetingID: Number(advanceMeetingModalID),
      Bundle: {
        ID: "0",
        Title: updateMinuteData.MinuteText,
        BundleDeadline: formatDateToUTCWithEndOfDay(minuteDate),
        ListOfUsers: editMinuteData.actors.map((item) => item.pK_UID),
        Entity: {
          EntityID: editMinuteData.entity.entityID,
          EntityTypeID: editMinuteData.entity.fK_EntityType_ID,
        },
      },
    };

    //The true in the below api stands for resend review is true or not
    if (isAgenda === false) {
      dispatch(
        UpdateMinutesGeneralApiFunc(
          navigate,
          updateMinuteData,
          t,
          true,
          resendReviewData,
          setEditMinute,
          setConfirmationEdit,
          setResendMinuteForReview,
          setShowRevisionHistory,
          isAgenda,
          false
        )
      );
    } else {
      dispatch(
        UpdateAgendaWiseMinutesApiFunc(
          navigate,
          updateMinuteData,
          t,
          true,
          resendReviewData,
          setEditMinute,
          setConfirmationEdit,
          setResendMinuteForReview,
          setShowRevisionHistory,
          isAgenda
        )
      );
    }

    console.log(
      "resendForReviewresendForReview",
      updateMinuteData,
      resendReviewData
    );

    setResendMinuteForReview(false);
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

  console.log(editMinuteData.bundleDeadline, "bundleDeadlinebundleDeadline");

  useEffect(() => {
    let date = utcConvertintoGMT(editMinuteData.bundleDeadline + "000000");
    setMinuteDate(date);
  }, []);

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
                onClick={resendForReview}
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
            <div className={styles["users-wrapper"]}>
              {editMinuteData.actors.map((users) => {
                return (
                  <>
                    <Col lg={6} md={6} sm={12}>
                      <div className={styles["profile-wrapper"]}>
                        <div className={styles["image-profile-wrapper"]}>
                          <img
                            height={32}
                            width={32}
                            className={styles["image-style"]}
                            src={`data:image/jpeg;base64,${users?.profilePicture.displayProfilePictureName}`}
                            alt=""
                          />
                          <span>{users.name}</span>
                        </div>
                      </div>
                    </Col>
                  </>
                );
              })}
            </div>
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
