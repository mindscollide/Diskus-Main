import React, { useEffect, useRef, useState } from "react";
import styles from "./ProposedMeetingDate.module.css";
import { Button, Notification } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../../assets/images/Artboard 9.png";
import DatePicker from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
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
  GetAllMeetingDetailsApiFunc,
  cleareAllProposedMeetingDates,
} from "../../../../../../store/actions/NewMeetingActions";
import {
  convertDateTimetoGMTMeetingDetail,
  convertToUTC,
  createConvert,
  resolutionResultTable,
} from "../../../../../../commen/functions/date_formater";
import {
  getCurrentDate,
  getEndTimeWitlCeilFunction,
  getStartTimeWithCeilFunction,
  incrementDateforPropsedMeeting,
} from "../../../../../../commen/functions/time_formatter";
const ProposedMeetingDate = ({
  setProposedMeetingDates,
  setParticipants,
  currentMeeting,
  setCurrentMeetingID,
  setSceduleMeeting,
  setDataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  const getStartTime = getStartTimeWithCeilFunction();
  const getEndTime = getEndTimeWitlCeilFunction();
  const getCurrentDateforMeeting = getCurrentDate();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [error, seterror] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [isApiData, setIsApiData] = useState(false);
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
    MeetingDate: [],
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
      selectedOption: getCurrentDateforMeeting?.dateFormat,
      selectedOptionView: getCurrentDateforMeeting?.DateGMT,
      startDate: getStartTime?.formattedTime,
      endDate: getEndTime?.formattedTime,
      endDateView: getEndTime?.newFormatTime,
      startDateView: getStartTime?.newFormatTime,
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
      setProposedMeetingDates(false);
      setViewProposedModal({
        Title: "",
        Description: "",
        Location: "",
        MeetingType: "",
        MeetingDate: [],
      });
      setSendResponseVal("");
      setSendResponseBy({
        date: "",
      });
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
      dispatch(cleareAllProposedMeetingDates());
    };
  }, []);

  useEffect(() => {
    if (currentLanguage !== undefined) {
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
    try {
      if (getAllMeetingDetails?.advanceMeetingDetails && getAllProposedDates) {
        setViewProposedModal({
          Title: getAllMeetingDetails?.advanceMeetingDetails?.meetingTitle,
          Description: getAllMeetingDetails?.advanceMeetingDetails?.description,
          Location: getAllMeetingDetails?.advanceMeetingDetails?.location,
          MeetingType:
            getAllMeetingDetails?.advanceMeetingDetails?.meetingType?.type,
          MeetingDate:
            getAllMeetingDetails?.advanceMeetingDetails?.meetingDates,
        });
        if (
          getAllProposedDates !== null &&
          getAllProposedDates !== undefined &&
          getAllProposedDates?.meetingProposedDates?.length > 0
        ) {
          let meetingDateValueFormat = new DateObject(
            getAllProposedDates.deadLineDate
          ).format("DD/MM/YYYY");
          let DateDate = convertToUTC(getAllProposedDates.deadLineDate);
          setSendResponseVal(meetingDateValueFormat);
          setSendResponseBy({
            ...sendResponseBy,
            date: getAllProposedDates.deadLineDate.slice(0, 8),
          });
          const newDataforView = getAllProposedDates.meetingProposedDates.map(
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
                  endDate: convertDateTimetoGMTMeetingDetail(
                    dates.proposedDate + dates.endTime
                  ).slice(8, 14),
                  startDate: convertDateTimetoGMTMeetingDetail(
                    dates.proposedDate + dates.startTime
                  ).slice(8, 14),
                  selectedOption: convertDateTimetoGMTMeetingDetail(
                    dates.proposedDate + dates.startTime
                  ).slice(0, 8),
                  endDateView: resolutionResultTable(
                    dates.proposedDate + dates.endTime
                  ),
                  selectedOptionView: resolutionResultTable(
                    dates.proposedDate + dates.startTime
                  ),
                  startDateView: resolutionResultTable(
                    dates.proposedDate + dates.startTime
                  ),
                  proposedDateID: 0,
                };
              }
            }
          );
          setRows(newDataforView);
        } else {
          const newDataforView =
            getAllMeetingDetails.advanceMeetingDetails.meetingDates.map(
              (dates) => {
                if (
                  dates.meetingDate === "10000101" &&
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
                    endDate: convertDateTimetoGMTMeetingDetail(
                      dates.meetingDate + dates.endTime
                    ).slice(8, 14),
                    startDate: convertDateTimetoGMTMeetingDetail(
                      dates.meetingDate + dates.startTime
                    ).slice(8, 14),
                    selectedOption: convertDateTimetoGMTMeetingDetail(
                      dates.meetingDate + dates.startTime
                    ).slice(0, 8),
                    endDateView: resolutionResultTable(
                      dates.meetingDate + dates.endTime
                    ),
                    selectedOptionView: resolutionResultTable(
                      dates.meetingDate + dates.startTime
                    ),
                    startDateView: resolutionResultTable(
                      dates.meetingDate + dates.startTime
                    ),
                    proposedDateID: 0,
                  };
                }
              }
            );
          setRows(newDataforView);
        }
      }
    } catch {}
  }, [getAllMeetingDetails, getAllProposedDates]);

  const changeDateStartHandler = (date, index) => {
    try {
      let newDate = new Date(date);
      let DateDate = new DateObject(date).format("YYYYMMDD");
      const updatedRows = [...rows];
      if (
        index > 0 &&
        Number(DateDate) < Number(updatedRows[index - 1].selectedOption)
      ) {
        setOpen({
          flag: true,
          message: t("Selected-date-should-not-be-less-than-the-previous-one"),
        });
        return;
      } else {
        updatedRows[index].selectedOption = DateDate;
        updatedRows[index].selectedOptionView = newDate;
        setRows(updatedRows);
      }
    } catch {}
  };

  const handleStartDateChange = (index, date) => {
    let newDate = new Date(date);

    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}${minutes}${"00"}`;

      const updatedRows = [...rows];

      if (
        index > 0 &&
        updatedRows[index - 1].selectedOption ===
          updatedRows[index].selectedOption
      ) {
        if (formattedTime <= updatedRows[index - 1].endDate) {
          setOpen({
            flag: true,
            message: t(
              "Selected-start-time-should-not-be-less-than-the-previous-endTime"
            ),
          });
          updatedRows[index].startDate = getStartTime?.formattedTime;
          updatedRows[index].startTime = getStartTime?.newFormatTime;
          setRows(updatedRows);
          return;
        } else {
          if (
            updatedRows[index].endDate !== "" &&
            formattedTime >= updatedRows[index].endDate
          ) {
            setOpen({
              flag: true,
              message: t(
                "Selected-start-time-should-not-be-greater-than-the-endTime"
              ),
            });
            updatedRows[index].startDate = formattedTime;
            updatedRows[index].startTime = newDate;
            setRows(updatedRows);
            return;
          } else {
            updatedRows[index].startDate = formattedTime;
            updatedRows[index].startTime = newDate;
            setRows(updatedRows);
          }
        }
      } else {
        if (
          updatedRows[index].endDate !== "" &&
          formattedTime >= updatedRows[index].endDate
        ) {
          setOpen({
            flag: true,
            message: t(
              "Selected-start-time-should-not-be-greater-than-the-endTime"
            ),
          });
          updatedRows[index].startDate = formattedTime;
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
          return;
        } else {
          updatedRows[index].startDate = formattedTime;
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
        }
      }
    } else {
    }
  };

  const handleEndDateChange = (index, date) => {
    let newDate = new Date(date);

    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}${minutes}${"00"}`;

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
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          return;
        } else {
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          setRows(updatedRows);
        }
      } else {
        if (formattedTime <= updatedRows[index].startDate) {
          setOpen({
            flag: true,
            message: t("Selected-end-time-should-not-be-less-than-start-time"),
          });
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          return;
        } else {
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          setRows(updatedRows);
        }
      }
      // }
    } else {
    }
  };

  //Meeting Details
  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    console.log(lastRow, "lastRowlastRowlastRow");
    if (isValidRow(lastRow)) {
      let { DateGMT, dateFormat } = incrementDateforPropsedMeeting(
        lastRow.selectedOptionView
      );
      console.log(DateGMT, "DateGMTDateGMTDateGMTDateGMT");
      setRows([
        ...rows,
        {
          selectedOption: dateFormat,
          selectedOptionView: DateGMT,
          startDate: getStartTime?.formattedTime,
          startDateView: getStartTime?.newFormatTime,
          endDate: getEndTime?.formattedTime,
          endDateView: getEndTime?.newFormatTime,
          proposedDateID: 0,
        },
      ]);
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
    let DateDate = convertToUTC(meetingDateValueFormat);
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
        ProposedDate: createConvert(data.selectedOption + data.startDate).slice(
          0,
          8
        ),
        StartTime: createConvert(data.selectedOption + data.startDate).slice(
          8,
          14
        ),
        EndTime: createConvert(data.selectedOption + data.endDate).slice(8, 14),
        proposedDateID: data.proposedDateID,
      });
    });

    let sortedDates = newArr.sort((a, b) => {
      if (a.ProposedDate !== b.ProposedDate) {
        return a.ProposedDate.localeCompare(b.ProposedDate);
      } else if (a.StartTime !== b.StartTime) {
        return a.StartTime.localeCompare(b.StartTime);
      } else {
        return a.EndTime.localeCompare(b.EndTime);
      }
    });
    console.log(sortedDates, "newDatenewDatenewDatenewDate");
    if (sendResponseVal !== "") {
      let Data = {
        MeetingID: currentMeeting,
        SendResponsebyDate: sendResponseBy.date,
        ProposedDates: newArr,
      };
      console.log(Data, "newDatenewDatenewDatenewDate");

      dispatch(setProposedMeetingDateApiFunc(Data, navigate, t, false, false));
    } else {
      setOpen({
        flag: true,
        message: t("Select-send-response-by-date"),
      });
    }
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
        if (Object.keys(getAllProposedDates).length > 0) {
          if (proposedMeetingData.deadLineDate === "10000101") {
            setSendResponseVal("");
          } else {
            if (proposedMeetingData.deadLineDate !== "") {
              setSendResponseVal(
                resolutionResultTable(
                  proposedMeetingData.deadLineDate + "000000"
                )
              );
              setSendResponseBy({
                ...sendResponseBy,
                date: proposedMeetingData.deadLineDate,
              });
            } else {
            }
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
                  endDate: convertDateTimetoGMTMeetingDetail(
                    dates.proposedDate + dates.endTime
                  ).slice(8, 14),
                  startDate: convertDateTimetoGMTMeetingDetail(
                    dates.proposedDate + dates.startTime
                  ).slice(8, 14),
                  selectedOption: convertDateTimetoGMTMeetingDetail(
                    dates.proposedDate + dates.startTime
                  ).slice(0, 8),
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
          setIsApiData(true);
          setRows(newDataforView);
        }
      } else {
        const updatedRows = [...rows];
        updatedRows[0].selectedOption = getCurrentDateforMeeting?.dateFormat;
        updatedRows[0].selectedOptionView = getCurrentDateforMeeting?.DateGMT;
        updatedRows[0].startDate = getStartTime?.formattedTime;
        updatedRows[0].startDateView = getStartTime?.newFormatTime;
        updatedRows[0].endDate = getEndTime?.formattedTime;
        updatedRows[0].endDateView = getEndTime?.newFormatTime;
        setRows(updatedRows);
      }
    } catch (error) {
      console.error(error);
    }
  }, [getAllProposedDates]);

  const today = moment().startOf("day");
  const firstSelectedDate = moment(rows[0].selectedOption, "YYYYMMDD").startOf(
    "day"
  ); // Date selected at zero index
  const minSelectableDate = today.isSameOrBefore(firstSelectedDate)
    ? today
    : firstSelectedDate;
  const maxSelectableDate = firstSelectedDate;

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
                {viewProposedModal?.Location !== "" && (
                  <span>({viewProposedModal?.Location})</span>
                )}
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
                                      minDate={
                                        index > 0
                                          ? rows[index - 1].selectedOption
                                          : moment().toDate()
                                      }
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
                                      onFocusedDateChange={(value) =>
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
                                        handleStartDateChange(index, date)
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
                                        handleEndDateChange(index, date)
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
                    disabled={!isValidRow(rows[rows.length - 1])}
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
                    value={sendResponseVal === "" ? "" : sendResponseVal}
                    selected={
                      sendResponseBy.date === "" ? "" : sendResponseBy.date
                    }
                    format={"DD/MM/YYYY"}
                    minDate={minSelectableDate.toDate()}
                    maxDate={maxSelectableDate.toDate()}
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
                    onFocusedDateChange={(value) => SendResponseHndler(value)}
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
