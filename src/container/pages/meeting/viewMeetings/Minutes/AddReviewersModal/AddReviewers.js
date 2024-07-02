import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import {
  GetAllAgendaWiseMinutesApiFunc,
  GetAllGeneralMinutesApiFunc,
} from "../../../../../../store/actions/NewMeetingActions";

const AddReviewers = ({
  addReviewers,
  setAddReviewers,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();

  const { MinutesReducer, NewMeetingreducer } = useSelector((state) => state);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");

  const [selectMinutes, setSelectMinutes] = useState(true);
  const [selectReviewers, setSelectReviewers] = useState(false);
  const [sendReviewers, setSendReviewers] = useState(false);
  const [editReviewer, setEditReviewer] = useState(false);
  const [addDateModal, setAddDateModal] = useState(false);
  const [minuteToEdit, setMinuteToEdit] = useState(null);

  const [minuteDate, setMinuteDate] = useState("");

  const [minuteDataAgenda, setMinuteDataAgenda] = useState(null);
  const [minuteDataGeneral, setMinuteDataGeneral] = useState(null);

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  const handleClose = () => {
    setAddReviewers(false);
  };

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

  useEffect(() => {
    let newData = {
      MeetingID: Number(advanceMeetingModalID),
    };

    // Call GetAllAgendaWiseMinutesApiFunc and wait for it to complete
    dispatch(
      GetAllAgendaWiseMinutesApiFunc(
        navigate,
        newData,
        t,
        Number(advanceMeetingModalID),
        false
      )
    );

    dispatch(
      GetAllGeneralMinutesApiFunc(
        navigate,
        t,
        newData,
        Number(advanceMeetingModalID)
      )
    );
  }, []);

  const transformDataGeneral = (data) => {
    return data.map((item) => ({
      minuteID: item.minuteID,
      description: item.minutesDetails,
      attachments: item.minutesAttachmets,
      uploader: {
        userID: item.userID,
        orignalProfilePictureName:
          item.userProfilePicture.orignalProfilePictureName,
        displayProfilePictureName:
          item.userProfilePicture.displayProfilePictureName,
      },
      lastUpdatedDate: item.lastUpdatedDate,
      lastUpdatedTime: item.lastUpdatedTime,
      userID: item.userID,
      userName: item.userName,
    }));
  };

  useEffect(() => {
    if (
      NewMeetingreducer.generalMinutes !== undefined &&
      NewMeetingreducer.generalMinutes !== null &&
      NewMeetingreducer.generalMinutes.length !== 0
    ) {
      let data = NewMeetingreducer?.generalMinutes?.meetingMinutes;
      const transformedData = transformDataGeneral(data);
      setMinuteDataGeneral(transformedData);
    } else {
      setMinuteDataGeneral(null);
    }
    return () => {
      setMinuteDataGeneral(null);
    };
  }, [NewMeetingreducer.generalMinutes]);

  useEffect(() => {
    try {
      // Check if agendaWiseMinutesReducer is not null, undefined, and has at least one key
      if (
        NewMeetingreducer.agendaWiseMinutesReducer !== null &&
        NewMeetingreducer.agendaWiseMinutesReducer !== undefined &&
        Object.keys(NewMeetingreducer.agendaWiseMinutesReducer).length > 0
      ) {
        // Store agendaWiseMinutesReducer in a local variable
        let reducerData = NewMeetingreducer.agendaWiseMinutesReducer;
        // Initialize an empty array to hold the transformed data
        let transformedData = [];

        // Iterate through each parent agenda in the agenda hierarchy list
        reducerData.agendaHierarchyList.forEach((parentAgenda) => {
          // Find the parent agenda details in the agendaWiseMinutes array
          let parentAgendaDetails = reducerData.agendaWiseMinutes.find(
            (minute) => minute.agendaID === parentAgenda.pK_MAID
          );

          // Initialize an array to hold sub-minutes of the parent agenda
          let subMinutes = [];
          // Iterate through each child agenda of the parent agenda
          parentAgenda.childAgendas.forEach((childAgenda) => {
            // Filter the minutes that match the child agenda ID and push to subMinutes
            let childMinutes = reducerData.agendaWiseMinutes.filter(
              (minute) => minute.agendaID === childAgenda.pK_MAID
            );
            subMinutes.push(...childMinutes);
          });

          // Check if parent agenda details exist to determine if it's parent data
          let isParentData = !!parentAgendaDetails;

          // If there are parent agenda details or sub-minutes, create a parent agenda object
          if (isParentData || subMinutes.length > 0) {
            // If parent agenda details exist, use them, otherwise use childAgenda's parentTitle
            let agendaTitle = isParentData
              ? parentAgendaDetails.agendaTitle
              : parentAgenda.childAgendas.find((childAgenda) =>
                  subMinutes.some(
                    (minute) => minute.agendaID === childAgenda.pK_MAID
                  )
                )?.parentTitle || "";
            let parentAgendaObj = {
              // Use parent agenda details if they exist, otherwise default to 0
              agendaID: isParentData ? parentAgendaDetails.agendaID : 0,
              minuteID: isParentData ? parentAgendaDetails.minuteID : 0,
              description: isParentData
                ? parentAgendaDetails.minutesDetails
                : "",
              // Use parent agenda title if it exists, otherwise fallback to a default title
              agendaTitle: agendaTitle,
              isParentData: isParentData,
              attachments: isParentData
                ? parentAgendaDetails.minutesAttachmets
                : [],
              uploader: isParentData
                ? parentAgendaDetails.userProfilePicture
                : [],
              lastUpdatedDate: isParentData
                ? parentAgendaDetails.lastUpdatedDate
                : "",
              lastUpdatedTime: isParentData
                ? parentAgendaDetails.lastUpdatedTime
                : "",
              userID: isParentData ? parentAgendaDetails.userID : 0,
              userName: isParentData ? parentAgendaDetails.userName : "",
              // Map subMinutes to include only the necessary properties
              subMinutes: subMinutes.map((subMinute) => ({
                agendaID: subMinute.agendaID,
                minuteID: subMinute.minuteID,
                description: subMinute.minutesDetails,
                // Use parent agenda title if it exists, otherwise fallback to a default title
                agendaTitle: subMinute.agendaTitle,
                attachments: subMinute.minutesAttachmets,
                uploader: subMinute.userProfilePicture,
                lastUpdatedDate: subMinute.lastUpdatedDate,
                lastUpdatedTime: subMinute.lastUpdatedTime,
                userID: subMinute.userID,
                userName: subMinute.userName,
              })),
            };

            // Push the parent agenda object to the transformed data array
            transformedData.push(parentAgendaObj);
          }
        });

        // Log the transformed data to the console
        setMinuteDataAgenda(transformedData);
        console.log("transformedData", transformedData);
      }
    } catch {}
  }, [NewMeetingreducer.agendaWiseMinutesReducer]);

  console.log(
    "SelectMinutesDataSelectMinutesData",
    minuteDataAgenda,
    minuteDataGeneral
  );

  return (
    <Modal
      show={true}
      modalBodyClassName={
        selectMinutes ? "scrollStyle mr-20 mt-16p" : "scrollStyle mr-20 "
      }
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-none"}
      onHide={handleClose}
      fullscreen={true}
      className={addDateModal === true ? "d-none" : "FullScreenModal"}
      ModalBody={
        selectMinutes === true &&
        selectReviewers === false &&
        sendReviewers === false &&
        editReviewer === false &&
        (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
          <SelectMinutes
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
            setEditReviewer={setEditReviewer}
            editReviewer={editReviewer}
            setMinuteDataAgenda={setMinuteDataAgenda}
            minuteDataAgenda={minuteDataAgenda}
            setMinuteDataGeneral={setMinuteDataGeneral}
            minuteDataGeneral={minuteDataGeneral}
          />
        ) : selectMinutes === false &&
          selectReviewers === true &&
          sendReviewers === false &&
          editReviewer === false &&
          (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
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
          editReviewer === false &&
          (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
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
          editReviewer === true &&
          (minuteDataAgenda !== null || minuteDataGeneral !== null) ? (
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
        ) : (
          <p>No minutes to send for review</p>
        )
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
