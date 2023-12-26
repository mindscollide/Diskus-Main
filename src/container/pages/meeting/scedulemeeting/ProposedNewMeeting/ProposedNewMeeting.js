import React, { useEffect, useRef } from "react";
import styles from "./ProposedNewMeeting.module.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Paper } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import profile from "../../../../../assets/images/newprofile.png";
import plusFaddes from "../../../../../assets/images/SVGBlackPlusIcon.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import {
  Button,
  TextField,
  Notification,
} from "../../../../../components/elements";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { DateObject } from "react-multi-date-picker";
import desh from "../../../../../assets/images/desh.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import InputIcon from "react-multi-date-picker/components/input_icon";
import moment from "moment";
import { convertGMTDateintoUTC } from "../../../../../commen/functions/date_formater";
import { containsStringandNumericCharacters } from "../../../../../commen/functions/regex";
import { GetAllCommitteesUsersandGroups } from "../../../../../store/actions/MeetingOrganizers_action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProposedNewMeeting = ({ setProposedNewMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  let currentLanguage = localStorage.getItem("i18nextLng");
  let OrganizationID = localStorage.getItem("organizationID");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [error, seterror] = useState(false);
  const [sendResponseVal, setSendResponseVal] = useState("");
  const [proposedMeetingDetails, setProposedMeetingDetails] = useState({
    MeetingTitle: "",
    Description: "",
  });
  const [participantsProposedMeeting, setParticipantsProposedMeeting] =
    useState([
      {
        name: "Saif ul Islam",
      },
      {
        name: "Aun Naqvi",
      },
      {
        name: "Ali Mamdani",
      },
      {
        name: "Owais Wajid khan",
      },
    ]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  //Send Response By Date
  const [sendResponseBy, setSendResponseBy] = useState({
    date: "",
  });

  //state for adding Date and Time Rows
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

  //Getting All Groups And Committies By Organization ID
  useEffect(() => {
    let Data = {
      OrganizationID: Number(OrganizationID),
    };
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t));
  }, []);

  //Removing the Added Participants
  const hanleRemovingParticipants = (index) => {
    let removeParticipant = [...participantsProposedMeeting];
    removeParticipant.splice(index, 1);
    setParticipantsProposedMeeting(removeParticipant);
  };

  //Adding the Dates Rows
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

  //Validation For Checking that the Row Should Not Be Empty Before Inserting the Another
  const isValidRow = (row) => {
    return (
      row.selectedOption !== "" && row.startDate !== "" && row.endDate !== ""
    );
  };

  //OnChange Function For Select Options
  const changeDateStartHandler = (date, index) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = new DateObject(date).format("YYYYMMDD");
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

  //OnChange Function For Start Time
  const handleStartTimeChange = (index, date) => {
    let newDate = new Date(date);
    console.log(newDate, "handleStartDateChangehandleStartDateChange");
    if (newDate instanceof Date && !isNaN(newDate)) {
      // Round up to the next hour
      const nextHour = Math.ceil(
        newDate.getHours() + newDate.getMinutes() / 60
      );
      newDate.setHours(nextHour, 0, 0, 0);

      // Format the time as HH:mm:ss
      const formattedTime = `${String(nextHour).padStart(2, "0")}0000`;

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
          return;
        } else {
          if (
            updatedRows[index].endDate !== "" &&
            formattedTime >= updatedRows[index].endDate
          ) {
            console.log("handleStartDateChange");
            setOpen({
              flag: true,
              message: t(
                "Selected-start-time-should-not-be-greater-than-the-endTime"
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
          return;
        } else {
          updatedRows[index].startDate = formattedTime;
          updatedRows[index].startDateView = newDate;
          updatedRows[index].isComing = false;
          updatedRows[index].proposedDateID = 0;

          setRows(updatedRows);
        }
      }
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //OnChange Function For End Time
  const handleEndTimeChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const nextHour = Math.ceil(
        newDate.getHours() + newDate.getMinutes() / 60
      );
      newDate.setHours(nextHour, 0, 0, 0);

      // Format the time as HH:mm:ss
      const formattedTime = `${String(nextHour).padStart(2, "0")}0000`;

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

  //Removing the Date Time Rows
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

  //for handling Cancel the ProposedMeeting Page
  const handleCancelButtonProposedMeeting = () => {
    setProposedNewMeeting(false);
  };

  //For handling  Proposed button ProposedMeeting Page
  const handleProposedButtonProposedMeeting = () => {
    if (
      proposedMeetingDetails.MeetingTitle === "" ||
      proposedMeetingDetails.Description === "" ||
      participantsProposedMeeting.length === 0 ||
      rows.length <= 1 ||
      sendResponseVal === ""
    ) {
      seterror(true);
    } else {
      alert("YOu can proposed now ");
      setProposedMeetingDetails({
        MeetingTitle: "",
        Description: "",
      });
      setParticipantsProposedMeeting([]);
      setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
      setSendResponseBy({
        date: "",
      });
    }
  };

  //handle Change for Decription and Title Of meeting
  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "MeetingTitle") {
      let valueCheck = containsStringandNumericCharacters(value);
      if (valueCheck !== "") {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          MeetingTitle: valueCheck.trimStart(),
        });
      } else {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          MeetingTitle: "",
        });
      }
    }

    if (name === "MeetingDescription") {
      if (value.trimStart() !== "") {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          Description: value,
        });
      } else {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          Description: "",
        });
      }
    }
  };

  //for handle Add Button Adding Participants

  const handleAddParitipantProposedDates = () => {};

  //For arabic Convertion of the Date Times
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
    return () => {
      setProposedMeetingDetails({
        MeetingTitle: "",
        Description: "",
      });
      setParticipantsProposedMeeting([]);
      setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
      setSendResponseBy({
        date: "",
      });
    };
  }, []);

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ProposedMeetingHeading"]}>
            {t("Propose-new-meeting")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["ProposedNewMeetingPaper"]}>
            <Row>
              <Col lg={5} md={5} sm={5}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Meeting-title")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      labelClass={"d-none"}
                      name={"MeetingTitle"}
                      change={HandleChange}
                      value={proposedMeetingDetails.MeetingTitle}
                    />
                    <Row>
                      <Col>
                        <p
                          className={
                            error && proposedMeetingDetails.MeetingTitle === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-enter-meeting-title")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Description")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      name="MeetingDescription"
                      applyClass="form-control2 textbox-height-details-view"
                      type="text"
                      as={"textarea"}
                      labelClass={"d-none"}
                      rows="7"
                      value={proposedMeetingDetails.Description}
                      change={HandleChange}
                      required
                    />

                    <Row>
                      <Col>
                        <p
                          className={
                            error && proposedMeetingDetails.Description === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-enter-meeting-description")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Participant")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={10} md={10} sm={10}>
                    <Select />
                  </Col>
                  <Col lg={2} md={2} sm={2} className="m-0 p-0">
                    <Button
                      text={"Add"}
                      className={styles["Add_Button_Proposed_Meeting"]}
                      onClick={handleAddParitipantProposedDates}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_ProposedMeeting"]}
                  >
                    <Row className="mt-2">
                      {participantsProposedMeeting.length > 0
                        ? participantsProposedMeeting.map(
                            (participant, index) => {
                              return (
                                <>
                                  <Col
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    className="mt-2"
                                    key={index}
                                  >
                                    <Row className="m-0 p-0">
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className={styles["Box_for_Assignee"]}
                                      >
                                        <Row className="mt-1">
                                          <Col
                                            lg={10}
                                            md={10}
                                            sm={12}
                                            className="d-flex gap-2 align-items-center"
                                          >
                                            <img
                                              draggable={false}
                                              src={profile}
                                              //   src={`data:image/jpeg;base64,${data.displayPicture}`}
                                              width="50px"
                                              alt=""
                                              height="50px"
                                              className={styles["ProfilePic"]}
                                            />
                                            <span
                                              className={
                                                styles["ParticipantName"]
                                              }
                                            >
                                              {participant.name}
                                            </span>
                                          </Col>
                                          <Col
                                            lg={2}
                                            md={2}
                                            sm={2}
                                            className="d-flex  align-items-center"
                                          >
                                            <img
                                              src={CrossIcon}
                                              width="14px"
                                              height="14px"
                                              draggable="false"
                                              style={{ cursor: "pointer" }}
                                              alt=""
                                              onClick={() =>
                                                hanleRemovingParticipants(index)
                                              }
                                            />
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                </>
                              );
                            }
                          )
                        : null}
                      <Row>
                        <Col>
                          <p
                            className={
                              error && participantsProposedMeeting.length === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }
                          >
                            {t("Add-at-least-one-participant")}
                          </p>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex align-items-center justify-content-center"
              >
                <span className={styles["VerticalSeperator"]}></span>
              </Col>
              <Col lg={5} md={5} sm={5}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Proposed-on")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_Proposed_Dates"]}
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
                                        onChange={(value) =>
                                          changeDateStartHandler(value, index)
                                        }
                                      />
                                      {/* <Row>
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
                                      </Row> */}
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
                                              src={CrossIcon}
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
                              {/* <Row>
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
                              </Row> */}
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
                  <Row>
                    <Col>
                      <p
                        className={
                          error &&
                          //   rows.selectedOption === "" &&
                          //   rows.startDate === "" &&
                          //   rows.endDate === "" &&
                          rows.length <= 1
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {t("Add-at-least-two-proposed-dates")}
                      </p>
                    </Col>
                  </Row>
                </Row>

                <Row className="mt-4">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Send-response-by")}{" "}
                      <span className={styles["res_steric"]}>*</span>
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

                    <Row>
                      <Col>
                        <p
                          className={
                            error && sendResponseVal === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-select-send-response-by-date")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_Button_Proposed_Meeting"]}
                      onClick={handleCancelButtonProposedMeeting}
                    />

                    <Button
                      text={t("Proposed")}
                      className={styles["Proposed_Button_Proposed_Meeting"]}
                      onClick={handleProposedButtonProposedMeeting}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default ProposedNewMeeting;
