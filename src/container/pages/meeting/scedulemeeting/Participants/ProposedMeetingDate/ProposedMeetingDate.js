import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import styles from "./ProposedMeetingDate.module.css";
import {
  Button,
  Checkbox,
  Notification,
} from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import BackArrow from "../../../../../../assets/images/Back Arrow.svg";
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
import { Paper } from "@material-ui/core";
import moment from "moment";
import { style } from "@mui/system";
import UnsavedModal from "./UnsavedChangesModal/UnsavedModal";
import {
  GetAllProposedMeetingDateApiFunc,
  setProposedMeetingDateApiFunc,
  showPrposedMeetingUnsavedModal,
} from "../../../../../../store/actions/NewMeetingActions";
import {
  convertGMTDateintoUTC,
  resolutionResultTable,
} from "../../../../../../commen/functions/date_formater";
const ProposedMeetingDate = ({
  setProposedMeetingDates,
  setParticipants,
  setViewProposedMeetingDate,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  let currentLanguage = localStorage.getItem("i18nextLng");
  let currentMeetingID = Number(localStorage.getItem("meetingID"));
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { NewMeetingreducer } = useSelector((state) => state);
  const [error, seterror] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [proposedDatesData, setProposedDatesData] = useState([
    {
      deadLineDate: "",
      proposedDates: [
        {
          endTime: "",
          proposedDate: "",
          proposedDateID: 0,
          startTime: "",
        },
      ],
    },
  ]);
  console.log(proposedDatesData, "proposedDatesDataproposedDatesData");
  const [meetingDate, setMeetingDate] = useState("");
  const [sendResponseVal, setSendResponseVal] = useState("");
  const [sendResponseBy, setSendResponseBy] = useState({
    date: "",
  });
  console.log(sendResponseBy, "sendResponseBysendResponseBysendResponseBy");
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [endDateError, setEndDateError] = useState(false);
  const [options, setOptions] = useState([]);
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
  console.log({ rows }, "rowsrowsrows");
  const handleStartDateChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getUTCHours()).slice(-2);
      const minutes = ("0" + newDate.getUTCMinutes()).slice(-2);
      const seconds = ("0" + newDate.getUTCSeconds()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;
      console.log(formattedTime, "formattedTimeformattedTimeformattedTime");
      const updatedRows = [...rows];
      updatedRows[index].startDate = formattedTime;
      updatedRows[index].startDateView = newDate;
      setRows(updatedRows);
      // You can use 'formattedTime' as needed.
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  const handleEndDateChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getUTCHours()).slice(-2);
      const minutes = ("0" + newDate.getUTCMinutes()).slice(-2);
      const seconds = ("0" + newDate.getUTCSeconds()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;

      const updatedRows = [...rows];
      updatedRows[index].endDate = formattedTime;
      updatedRows[index].endDateView = newDate;
      setRows(updatedRows);
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
        message: t("You Cant enter more then Five Dates"),
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

  //Onchange Function For DatePicker inAdd datess First
  const changeDateStartHandler = (date, index) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = convertGMTDateintoUTC(date);
    console.log(DateDate, "updatedRows");
    setMeetingDate(meetingDateValueFormat);
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = DateDate.slice(0, 8);
    updatedRows[index].selectedOptionView = meetingDateValueFormat;

    console.log(updatedRows, "updatedRows");
    setRows(updatedRows);
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

  const handleSelectChange = (index, selectedOption) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = selectedOption;
    setRows(updatedRows);
    setSelectError(false); // Clear the select error
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

  const isAscendingOrder = () => {
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].selectedOption <= rows[i - 1].selectedOption) {
        return false;
      } else if (rows[i].startDate <= rows[i - 1].startDate) {
        return false;
      }
    }
    return true;
  };

  // Function to handle the save Proposed button click
  const handleSave = () => {
    let newArr = [];
    rows.map((data, index) => {
      newArr.push({
        ProposedDate: data.selectedOption,
        StartTime: data.startDate,
        EndTime: data.endDate,
      });
    });
    if (isAscendingOrder()) {
      let Data = {
        MeetingID: currentMeetingID,
        SendResponsebyDate: sendResponseBy.date,
        ProposedDates: newArr,
      };
      console.log(Data, "updatedRows");
      dispatch(setProposedMeetingDateApiFunc(Data, navigate, t));
    } else {
      // Rows are not in ascending order
      setOpen({
        flag: true,
        message: t(
          "Proposed-dates-should-be-in-increasing-order-of-date-and-start-time"
        ),
      });
    }
  };

  // Function to handle the save Proposed button click

  useEffect(() => {
    validate();
  }, [rows]);

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

  const handleSend = () => {
    // States For Error Handling
    // setSelectError(true);
    // setStartDateError(true);
    // setEndDateError(true);
  };

  const CancelModal = () => {
    setProposedMeetingDates(false);
    setParticipants(true);

    // dispatch(showPrposedMeetingUnsavedModal(true));
  };

  const handlebackButtonFunctionality = () => {
    setProposedMeetingDates(false);
    setParticipants(true);
  };

  useEffect(() => {
    let Data = {
      MeetingID: currentMeetingID,
    };
    dispatch(GetAllProposedMeetingDateApiFunc(Data, navigate, t));
  }, []);

  console.log(proposedDatesData, "proposedDatesDataproposedDatesData");

  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getAllProposedDates !== null &&
        NewMeetingreducer.getAllProposedDates !== undefined
      ) {
        const proposedMeetingData = NewMeetingreducer.getAllProposedDates;
        setSendResponseVal(
          resolutionResultTable(proposedMeetingData.deadLineDate + "000000")
        );
        const newDataforView = proposedMeetingData.meetingProposedDates.map(
          (dates) => ({
            endTimeforSend: dates.endTime,
            startTimeforSend: dates.startTime,
            selectDateforSend: dates.proposedDate,
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
          })
        );

        setRows(newDataforView);
        console.log({ newDataforView }, "newDatanewDatanewData");
      }
    } catch (error) {
      console.error(error);
    }
  }, [NewMeetingreducer.getAllProposedDates]);

  console.log(rows, "rowsrowsrowsrowsrows");

  const EnabletheViewProposedmeetingDates = () => {
    setProposedMeetingDates(false);
    setViewProposedMeetingDate(true);
  };

  return (
    <section>
      <Row className="mt-2">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex align-items-center align-items-center gap-3"
        >
          <img
            draggable={false}
            src={BackArrow}
            width="20.5px"
            height="18.13px"
            className="cursor-pointer"
            onClick={handlebackButtonFunctionality}
          />
          <span className={styles["Prposed_Meeting_heading"]}>
            {t("Propose-meeting-date")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["Paper_styling"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Heading_prposed_meeting"]}>
                  IT Departmental Meeting lorem. Aenean posuere libero vel ipsum
                  digniss IT Departmental Meeting lorem. Aenean posuere libero
                  vel ipsum digniss
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Staff_meeting_Heading"]}>
                  Staff Meeting <span>(Conference Room)</span>
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <p className={styles["Paragraph_Styles"]}>
                  Description fits in here. Proin at malesuada lorem. Aenean
                  posuere libero vel ipsum dignissim ultricies viverra non
                  tellus. Fusce aliquet finibus nisl, et hendrerit nisl
                  dignissim at. Praesent luctus rutrum lacinia. Nulla lacinia
                  feugiat sagittis. Aenean at magna aliquet, dignissim ligula
                  quis, ornare ante. Interdum et malesuada fames ac ante ipsum
                  primis in faucibus. Ut diam dui, iaculis nec dui vel, commodo
                  dapibus libero.Vivamus interdum purus sed pellentesque
                  ultricies. Nullam ut nulla libero. Nam libero urna, pharetra
                  et dignissim in, malesuada at urna. Aliquam erat volutpat.
                  Curabitur molestie congue ipsum vitae luctus. Cras sed dolor
                  eget turpis condimentum maximus et sit amet ipsum. Suspendisse
                  non nulla vitae metus tincidunt vulputate. Aenean malesuada
                  lacinia ipsum, vitae porta ex elementum ac. Nulla vestibulum
                  cursus felis, vel molestie nibh mollis sit amet. Suspendisse
                  nec dui semper, lobortis est nec, aliquet felis. Etiam sed
                  odio in diam faucibus pretium.
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
                          console.log(data, "datadatadatarows");
                          return (
                            <>
                              <Row>
                                <Col lg={12} md={12} sm={12} key={index}>
                                  <Row className="mt-2">
                                    <Col lg={4} md={4} sm={12}>
                                      <DatePicker
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
                                              error &&
                                              data.selectedOption === ""
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
                                        disableDayPicker
                                        inputClass="inputTImeMeeting"
                                        calendar={calendarValue}
                                        locale={localValue}
                                        format="HH:mm A"
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
                                        inputClass="inputTImeMeeting"
                                        calendar={calendarValue}
                                        locale={localValue}
                                        format="HH:mm A"
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
                                      <img
                                        draggable={false}
                                        src={redcrossIcon}
                                        width="23px"
                                        height="23px"
                                        className={styles["Cross_icon_class"]}
                                        onClick={() => {
                                          HandleCancelFunction(index);
                                        }}
                                      />
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
                <Button
                  text={t("View")}
                  className={styles["Save_Button_ProposedMeeting"]}
                  onClick={EnabletheViewProposedmeetingDates}
                />
                {rows.proposedDateID === 0 ? (
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
          </Paper>
        </Col>
      </Row>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {NewMeetingreducer.prposedMeetingUnsavedModal && (
        <UnsavedModal
          setProposedMeetingDates={setProposedMeetingDates}
          setParticipants={setParticipants}
        />
      )}
    </section>
  );
};

export default ProposedMeetingDate;
