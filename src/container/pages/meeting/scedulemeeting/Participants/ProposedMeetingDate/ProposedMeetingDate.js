import React, { useEffect, useRef, useState } from "react";
import styles from "./ProposedMeetingDate.module.css";
import { Button, Notification } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import DatePicker from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { DateObject } from "react-multi-date-picker";
import plusFaddes from "../../../../../../assets/images/BluePlus.svg";
import desh from "../../../../../../assets/images/desh.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useDispatch, useSelector } from "react-redux";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import UnsavedModal from "./UnsavedChangesModal/UnsavedModal";
import {
  GetAllProposedMeetingDateApiFunc,
  setProposedMeetingDateApiFunc,
  showPrposedMeetingUnsavedModal,
  GetAllMeetingDetailsApiFunc,
} from "../../../../../../store/actions/NewMeetingActions";
import {
  convertGMTDateintoUTC,
  resolutionResultTable,
} from "../../../../../../commen/functions/date_formater";
const ProposedMeetingDate = ({
  setProposedMeetingDates,
  setParticipants,
  setViewProposedMeetingDate,
  currentMeeting,
  setCurrentMeetingID,
  setSceduleMeeting,
  setDataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [error, seterror] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const getAllMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.getAllMeetingDetails
  );
  const getAllProposedDates = useSelector(
    (state) => state.NewMeetingreducer.getAllProposedDates
  );
  const prposedMeetingUnsavedModal = useSelector(
    (state) => state.NewMeetingreducer.prposedMeetingUnsavedModal
  );

  const [viewProposedModal, setViewProposedModal] = useState({
    Title: "",
    Description: "",
    Location: "",
    MeetingType: "",
  });

  const [sendResponseVal, setSendResponseVal] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [sendResponseBy, setSendResponseBy] = useState({
    date: "",
  });
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [endDateError, setEndDateError] = useState(false);
  const [rows, setRows] = useState([
    {
      selectedOption: "",
      startDate: "",
      endDate: "",
      selectedOptionView: "",
      endDateView: "",
      startDateView: "",
    },
  ]);

  const callApis = async () => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    await dispatch(GetAllProposedMeetingDateApiFunc(Data, navigate, t, true));
    await dispatch(
      GetAllMeetingDetailsApiFunc(
        navigate,
        t,
        Data,
        true,
        setCurrentMeetingID,
        setSceduleMeeting,
        setDataroomMapFolderId
      )
    );
  };
  useEffect(() => {
    callApis();
    return () => {
      setRows([
        {
          selectedOption: "",
          startDate: "",
          endDate: "",
          selectedOptionView: "",
          endDateView: "",
          startDateView: "",
        },
      ]);
    };
  }, []);

  useEffect(() => {
    if (currentLanguage !== undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    try {
      if (getAllMeetingDetails) {
        if (getAllMeetingDetails.advanceMeetingDetails) {
          setViewProposedModal({
            Title: getAllMeetingDetails.advanceMeetingDetails.meetingTitle,
            Description: getAllMeetingDetails.advanceMeetingDetails.description,
            Location: getAllMeetingDetails.advanceMeetingDetails.location,
            MeetingType:
              getAllMeetingDetails.advanceMeetingDetails.meetingType.type,
          });
        }
      }
    } catch {}
  }, [getAllMeetingDetails]);

  const changeDateStartHandler = (date, index) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = convertGMTDateintoUTC(date);
    const updatedRows = [...rows];

    if (index > 0 && DateDate < updatedRows[index - 1].selectedOption) {
      return;
    } else {
      updatedRows[index].selectedOption = DateDate.slice(0, 8);
      updatedRows[index].selectedOptionView = meetingDateValueFormat;
      updatedRows[index].isComing = false;
      updatedRows[index].proposedDateID = 0;

      setRows(updatedRows);
    }
  };

  const handleStartTimeChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getUTCHours()).slice(-2);
      const minutes = ("0" + newDate.getUTCMinutes()).slice(-2);
      const seconds = ("0" + newDate.getUTCSeconds()).slice(-2);

      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;

      const updatedRows = [...rows];

      if (
        index > 0 &&
        updatedRows[index - 1].selectedOption ===
          updatedRows[index].selectedOption
      ) {
        if (formattedTime < updatedRows[index - 1].endDate) {
          setOpen({
            flag: true,
            message: t(
              "Selected-start-time-should-not-be-less-than-the-previous-endTime"
            ),
          });
          return;
        } else {
          updatedRows[index].startDate = formattedTime;
          updatedRows[index].startDateView = newDate;
          updatedRows[index].isComing = false;
          updatedRows[index].proposedDateID = 0;

          setRows(updatedRows);
        }
      } else {
        updatedRows[index].startDate = formattedTime;
        updatedRows[index].startDateView = newDate;
        updatedRows[index].isComing = false;
        updatedRows[index].proposedDateID = 0;

        setRows(updatedRows);
      }
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  const handleEndTimeChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getUTCHours()).slice(-2);
      const minutes = ("0" + newDate.getUTCMinutes()).slice(-2);
      const seconds = ("0" + newDate.getUTCSeconds()).slice(-2);

      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;

      const updatedRows = [...rows];

      if (
        index > 0 &&
        updatedRows[index - 1].selectedOption ===
          updatedRows[index].selectedOption
      ) {
        if (formattedTime <= updatedRows[index].startDate) {
          setOpen({
            flag: true,
            message: t(
              "Selected-end-time-should-not-be-less-than-the-previous-one"
            ),
          });
          return;
        } else {
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endDateView = newDate;
          updatedRows[index].isComing = false;
          updatedRows[index].proposedDateID = 0;

          setRows(updatedRows);
        }
      } else {
        if (formattedTime <= updatedRows[index].startDate) {
          setOpen({
            flag: true,
            message: t(
              "Selected end time should be greater than the start time."
            ),
          });
          return;
        } else {
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endDateView = newDate;
          updatedRows[index].isComing = false;
          updatedRows[index].proposedDateID = 0;

          setRows(updatedRows);
        }
      }
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  const addRow = () => {
    if (rows.length < 5) {
      const lastRow = rows[rows.length - 1];
      if (isValidRow(lastRow)) {
        setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
      }
    } else {
      setOpen({
        flag: true,
        message: t("You-cant-enter-more-then-five-dates"),
      });
    }
  };

  const isValidRow = (row) => {
    return (
      row.selectedOption !== "" && row.startDate !== "" && row.endDate !== ""
    );
  };

  const HandleCancelFunction = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  //Send Response By Handler
  const SendResponseHndler = (date) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = convertGMTDateintoUTC(date);
    setSendResponseVal(meetingDateValueFormat);
    setSendResponseBy({
      ...sendResponseBy,
      date: DateDate.slice(0, 8),
    });
  };

  // Function to handle the save Proposed button click
  const handleSave = () => {
    let newArr = [];

    rows.forEach((data) => {
      newArr.push({
        ProposedDate: data.selectedOption,
        StartTime: data.startDate,
        EndTime: data.endDate,
        proposedDateID: data.proposedDateID,
      });
    });

    // if (isAscendingOrder()) {
    let Data = {
      MeetingID: currentMeeting,
      SendResponsebyDate: sendResponseBy.date,
      ProposedDates: newArr,
    };
    dispatch(setProposedMeetingDateApiFunc(Data, navigate, t));
  };

  const validate = () => {
    // Check if any of the fields are empty
    const hasSelectError = rows.some((row) => row.selectedOption === "");
    const hasStartDateError = rows.some((row) => row.startDate === "");
    const hasEndDateError = rows.some((row) => row.endDate === "");
    setSelectError(hasSelectError);
    setStartDateError(hasStartDateError);
    setEndDateError(hasEndDateError);
  };

  // Function to handle the save Proposed button click
  useEffect(() => {
    validate();
  }, [rows]);

  // useEffect(() => {
  //   if (rows.length > 0) {
  //     if (
  //       rows[0].selectedOption === "" &&
  //       rows[0].startDate === "" &&
  //       rows[0].endDate === ""
  //     ) {
  //       let getifTrue = rows.some((data, index) => data.isComing === false);
  //       setIsEdit(getifTrue);
  //     } else {
  //       setIsEdit(false);
  //     }
  //   } else {
  //     setIsEdit(false);
  //   }
  // }, [rows]);

  const CancelModal = () => {
    setProposedMeetingDates(false);
    // setParticipants(true);
    // setParticipants(true);

    // dispatch(showPrposedMeetingUnsavedModal(true));
  };

  useEffect(() => {
    try {
      if (getAllProposedDates !== null && getAllProposedDates !== undefined) {
        const proposedMeetingData = getAllProposedDates;
        if (proposedMeetingData.deadLineDate === "10000101") {
          setSendResponseVal("");
        } else {
          setSendResponseVal(
            resolutionResultTable(proposedMeetingData.deadLineDate + "000000")
          );
        }

        const newDataforView = proposedMeetingData.meetingProposedDates.map(
          (dates) => {
            if (
              dates.proposedDate === "10000101" &&
              dates.endTime === "000000" &&
              dates.startTime === "000000"
            ) {
              return {
                endTimeforSend: "",
                startTimeforSend: "",
                selectDateforSend: "",
                endDateView: "",
                selectedOptionView: "",
                proposedDateID: 0,
                startDateView: "",
                isComing: true,
              };
            } else {
              return {
                endDate: dates.endTime,
                startDate: dates.startTime,
                selectedOption: dates.proposedDate,
                endDateView: resolutionResultTable(
                  dates.proposedDate + dates.endTime
                ),
                selectedOptionView: resolutionResultTable(
                  dates.proposedDate + dates.startTime
                ),
                proposedDateID: dates.proposedDateID,
                startDateView: resolutionResultTable(
                  dates.proposedDate + dates.startTime
                ),
                isComing: true,
              };
            }
          }
        );

        setRows(newDataforView);
      }
    } catch (error) {
      console.error(error);
    }
  }, [getAllProposedDates]);

  return (
    <section>
      <Row className="mt-2">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex align-items-center align-items-center gap-3"
        >
          <span className={styles["Prposed_Meeting_heading"]}>
            {t("Propose-meeting-date")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Heading_prposed_meeting"]}>
                {viewProposedModal?.Title}
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Staff_meeting_Heading"]}>
                {viewProposedModal?.MeetingType}{" "}
                <span>({viewProposedModal?.Location})</span>
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <p className={styles["Paragraph_Styles"]}>
                {viewProposedModal?.Description}
              </p>
            </Col>
          </Row>

          <Row>
            <Col lg={8} md={8} sm={8}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Prposed_On_Heading"]}>
                    {t("Proposed-on")}{" "}
                    <span className={styles["Steric_Color"]}>*</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Scroller_meeting"]}
                >
                  {rows.length > 0
                    ? rows.map((data, index) => {
                        return (
                          <>
                            <Row>
                              <Col lg={12} md={12} sm={12} key={index}>
                                <Row className="mt-2">
                                  <Col lg={4} md={4} sm={12}>
                                    <DatePicker
                                      disabled={data.isComing ? true : false}
                                      value={data.selectedOptionView}
                                      selected={data.selectedOption}
                                      format={"DD/MM/YYYY"}
                                      minDate={moment().toDate()}
                                      placeholder="DD/MM/YYYY"
                                      render={
                                        <InputIcon
                                          placeholder="DD/MM/YYYY"
                                          className="datepicker_input"
                                        />
                                      }
                                      editable={false}
                                      className="datePickerTodoCreate2"
                                      onOpenPickNewDate={true}
                                      inputMode=""
                                      calendar={calendarValue}
                                      locale={localValue}
                                      ref={calendRef}
                                      onChange={(value) =>
                                        changeDateStartHandler(value, index)
                                      }
                                    />
                                    <Row>
                                      <Col>
                                        <p
                                          className={
                                            error && data.selectedOption === ""
                                              ? ` ${styles["errorMessage-inLogin"]} `
                                              : `${styles["errorMessage-inLogin_hidden"]}`
                                          }
                                        >
                                          {t("Please-select-data-and-time")}
                                        </p>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col
                                    lg={3}
                                    md={3}
                                    sm={3}
                                    className="timePicker"
                                  >
                                    <DatePicker
                                      arrowClassName="arrowClass"
                                      containerClassName="containerClassTimePicker"
                                      className="timePicker"
                                      disabled={data.isComing ? true : false}
                                      disableDayPicker
                                      inputClass="inputTImeMeeting"
                                      calendar={calendarValue}
                                      locale={localValue}
                                      format="hh:mm A"
                                      value={data.startDateView}
                                      selected={data.startDate}
                                      plugins={[<TimePicker hideSeconds />]}
                                      onChange={(date) =>
                                        handleStartTimeChange(index, date)
                                      }
                                    />
                                  </Col>
                                  <Col
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    className="d-flex justify-content-center align-items-center"
                                  >
                                    <img
                                      draggable={false}
                                      src={desh}
                                      width="19.02px"
                                      alt=""
                                    />
                                  </Col>
                                  <Col
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    // className="d-flex justify-content-end"
                                  >
                                    <DatePicker
                                      value={data.endDateView}
                                      arrowClassName="arrowClass"
                                      containerClassName="containerClassTimePicker"
                                      className="timePicker"
                                      disableDayPicker
                                      disabled={data.isComing ? true : false}
                                      inputClass="inputTImeMeeting"
                                      calendar={calendarValue}
                                      locale={localValue}
                                      format="hh:mm A"
                                      selected={data.startDate}
                                      plugins={[<TimePicker hideSeconds />]}
                                      onChange={(date) =>
                                        handleEndTimeChange(index, date)
                                      }
                                    />
                                  </Col>
                                  <Col
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    className="d-flex justify-content-end position-relative align-items-center"
                                  >
                                    <>
                                      {index === 0 ? null : (
                                        <>
                                          <img
                                            draggable={false}
                                            src={redcrossIcon}
                                            width="23px"
                                            height="23px"
                                            alt=""
                                            className={
                                              styles["Cross_icon_class"]
                                            }
                                            onClick={() => {
                                              HandleCancelFunction(index);
                                            }}
                                          />
                                        </>
                                      )}
                                    </>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <p
                                  className={
                                    error &&
                                    rows.selectedOption === "" &&
                                    rows.startDate === "" &&
                                    rows.endDate === ""
                                      ? ` ${styles["errorMessage-inLogin"]} `
                                      : `${styles["errorMessage-inLogin_hidden"]}`
                                  }
                                >
                                  {t("Please-select-data-and-time")}
                                </p>
                              </Col>
                            </Row>
                          </>
                        );
                      })
                    : null}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <Button
                    text={
                      <>
                        <Row className="mt-1">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center gap-2 align-items-center"
                          >
                            <img
                              draggable={false}
                              src={plusFaddes}
                              alt=""
                              width="15.87px"
                              height="15.87px"
                            />
                            <span className={styles["Add_dates_label"]}>
                              {t("Add-dates")}
                            </span>
                          </Col>
                        </Row>
                      </>
                    }
                    className={styles["Add_Dates_Btn_Class"]}
                    onClick={addRow}
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={4} md={4} sm={4}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Prposed_On_Heading"]}>
                    {t("Send-response-by")}{" "}
                    <span className={styles["Steric_Color"]}>*</span>
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Width_Date_SendResponseBy"]}
                >
                  <DatePicker
                    value={sendResponseVal}
                    format={"DD/MM/YYYY"}
                    minDate={moment().toDate()}
                    placeholder="DD/MM/YYYY"
                    render={
                      <InputIcon
                        placeholder="DD/MM/YYYY"
                        className="datepicker_input"
                      />
                    }
                    editable={false}
                    className="proposedMeetindatesDatePicker"
                    onOpenPickNewDate={true}
                    inputMode=""
                    calendar={calendarValue}
                    locale={localValue}
                    ref={calendRef}
                    onChange={(value) => SendResponseHndler(value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <p
                    className={
                      error && selectError && startDateError && endDateError
                        ? ` ${styles["errorMessage-inLogin"]} `
                        : `${styles["errorMessage-inLogin_hidden"]}`
                    }
                  >
                    {t("Please-select-date")}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              <Button
                text={t("Cancel")}
                className={styles["Cancel_Button_ProposedMeeting"]}
                onClick={CancelModal}
              />
              {/* <Button
                text={t("View")}
                className={styles["Save_Button_ProposedMeeting"]}
                onClick={EnabletheViewProposedmeetingDates}
              /> */}
              {!isEdit ? (
                <>
                  <Button
                    text={t("Save")}
                    className={styles["Save_Button_ProposedMeeting"]}
                    onClick={handleSave}
                  />
                </>
              ) : (
                <>
                  <Button
                    text={t("Update")}
                    className={styles["Save_Button_ProposedMeeting"]}
                    onClick={handleSave}
                  />
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {prposedMeetingUnsavedModal && (
        <UnsavedModal
          setProposedMeetingDates={setProposedMeetingDates}
          setParticipants={setParticipants}
        />
      )}
    </section>
  );
};

export default ProposedMeetingDate;
