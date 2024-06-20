import React, { useState, useEffect, useRef } from "react";
import styles from "./AddReviewers.module.css";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../components/elements";
import { ChevronDown } from "react-bootstrap-icons";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { get_CurrentDateTime } from "../../../../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";
import SelectMinutes from "./SelectMinutes/SelectMinutes";
import SelectReviewers from "./SelectReviewers/SelectReviewers";
import SendReviewers from "./SendReviewers/SendReviewers";
import EditReviewers from "./EditReviewers/EditReviewers";
import AddDateModal from "./AddDateModal/AddDateModal";

const AddReviewers = ({ addReviewers, setAddReviewers }) => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [selectMinutes, setSelectMinutes] = useState(true);
  const [selectReviewers, setSelectReviewers] = useState(false);
  const [sendReviewers, setSendReviewers] = useState(false);
  const [editReviewer, setEditReviewer] = useState(false);
  const [addDateModal, setAddDateModal] = useState(false);
  const [minuteToEdit, setMinuteToEdit] = useState(null);

  const [minuteDate, setMinuteDate] = useState("");

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  const addReviewerScreen = () => {
    if (selectMinutes) {
      setSelectMinutes(false);
      setSelectReviewers(true);
      setSendReviewers(false);
      setEditReviewer(false);
    } else if (selectReviewers) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
      setEditReviewer(false);
    } else if (sendReviewers) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
      setEditReviewer(false);
    } else if (editReviewer) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(false);
      setEditReviewer(true);
    }
  };

  const sendReviewerScreen = () => {
    if (minuteDate === "") {
      setAddDateModal(true);
    } else {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
      setEditReviewer(false);
    }
  };

  //DatePicker Stuff
  const toDoDateHandler = (date, format = "YYYYMMDD") => {
    let toDoDateValueFormat = new DateObject(date).format("DD MMMM YYYY");
    setMinuteDate(toDoDateValueFormat);
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

  console.log("minuteDateminuteDate", minuteDate);

  return (
    <Modal
      show={true}
      modalBodyClassName={
        selectMinutes ? "scrollStyle mr-20 mt-16p" : "scrollStyle mr-20 "
      }
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-none"}
      onHide={() => setAddReviewers(false)}
      fullscreen={true}
      className={addDateModal === true ? "d-none" : "FullScreenModal"}
      ModalBody={
        selectMinutes === true &&
        selectReviewers === false &&
        sendReviewers === false &&
        editReviewer === false ? (
          <SelectMinutes
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
          />
        ) : selectMinutes === false &&
          selectReviewers === true &&
          sendReviewers === false &&
          editReviewer === false ? (
          <SelectReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
          />
        ) : selectMinutes === false &&
          selectReviewers === false &&
          sendReviewers === true &&
          editReviewer === false ? (
          <SendReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
            setMinuteToEdit={setMinuteToEdit}
            minuteToEdit={minuteToEdit}
          />
        ) : selectMinutes === false &&
          selectReviewers === false &&
          sendReviewers === false &&
          editReviewer === true ? (
          <EditReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
            setMinuteToEdit={setMinuteToEdit}
            minuteToEdit={minuteToEdit}
          />
        ) : null
      }
      ModalFooter={
        <>
          {selectMinutes === true &&
          selectReviewers === false &&
          sendReviewers === false &&
          editReviewer === false ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button"]}
                  text={t("Add-reviewers")}
                  onClick={addReviewerScreen}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === true &&
            sendReviewers === false &&
            editReviewer === false ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Add")}
                  onClick={addReviewerScreen}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === false &&
            sendReviewers === true &&
            editReviewer === false ? (
            <Row>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="position-relative d-flex gap-3 justify-content-start"
              >
                <label className={styles["label-datePicker"]}>
                  {t("Deadline")} <span className="text-danger">*</span>
                </label>
                <DatePicker
                  onFocusedDateChange={toDoDateHandler}
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
                      className="datepicker_input_minute"
                    />
                  }
                />
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewerss"]}
                  text={t("Add-reviewers")}
                  onClick={addReviewerScreen}
                  disableBtn={true}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Send")}
                  onClick={sendReviewerScreen}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === false &&
            sendReviewers === false &&
            editReviewer === true ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={sendReviewerScreen}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Update")}
                  onClick={addReviewerScreen}
                />
              </Col>
            </Row>
          ) : null}
          {addDateModal ? (
            <AddDateModal
              addDateModal={addDateModal}
              setAddDateModal={setAddDateModal}
              sendReviewers={sendReviewers}
              setSendReviewers={setSendReviewers}
            />
          ) : null}
        </>
      }
    />
  );
};

export default AddReviewers;
