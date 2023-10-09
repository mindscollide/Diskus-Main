import React, { useEffect, useRef, useState } from "react";
import styles from "./MeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import MeetingVideoChatIcon from "../../../../../assets/images/ColoredVideo.svg";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import whiteVideIcon from "../../../../../assets/images/whiteVideoIcon.png";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Loader,
} from "../../../../../components/elements";
import desh from "../../../../../assets/images/desh.svg";
import {
  regexOnlyCharacters,
  urlPatternValidation,
  validateInput,
} from "../../../../../commen/functions/regex";
import MeetingActive from "./MeetingActivePage/MeetingActive";
import PublishedMeeting from "./PublishedMeeting/PublishedMeeting";
import moment from "moment";
import TextFieldTime from "../../../../../components/elements/input_field_time/Input_field";
import { useDispatch } from "react-redux";
import {
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  SaveMeetingDetialsNewApiFunction,
} from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  convertGMTDateintoUTC,
  convertGMTDateintoUTC2,
  formatDateToUTC,
  removeColFromTime,
} from "../../../../../commen/functions/date_formater";

const MeetingDetails = ({ setorganizers, setmeetingDetails }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const [options, setOptions] = useState([]);
  const [meetingTypeDropdown, setmeetingTypeDropdown] = useState([]);
  const [reminderFrequencyOne, setReminderFrequencyOne] = useState([]);
  const [reminderFrequencyTwo, setReminderFrequencyTwo] = useState([]);
  const [reminderFrequencyThree, setReminderFrequencyThree] = useState([]);
  const [recurringDropDown, setRecurringDropDown] = useState([]);

  const [rows, setRows] = useState([
    { selectedOption: "", startDate: "", endDate: "" },
  ]);

  //For Custom language datepicker
  const [meetingDate, setMeetingDate] = useState("");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();
  const [error, seterror] = useState(false);
  const [activeVideo, setActiveVideo] = useState(false);
  const [saveMeeting, setSaveMeeting] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    MeetingTitle: "",
    MeetingType: 0,
    Location: "",
    Description: "",
    Link: "https://portal.letsdiskus.com/Video?RoomID=5682AD",
    ReminderFrequency: 0,
    ReminderFrequencyTwo: 0,
    ReminderFrequencyThree: 0,
    Notes: "",
    groupChat: false,
    AllowRSPV: false,
    NotifyMeetingOrganizer: false,
    RecurringOptions: 0,
    Location: "",
    IsVideoCall: false,
  });

  const handleSelectChange = (selectedOption) => {
    setOptions({ ...options, selectedOption });
  };

  const handleMeetingSelectChange = (selectedOption) => {
    setMeetingDetails({
      ...meetingDetails,
      MeetingType: {
        PK_MTID: selectedOption.value,
        Type: selectedOption.label,
      },
    });
  };

  const handleRecurringSelectoptions = (selectedOption) => {
    setMeetingDetails({
      ...meetingDetails,
      RecurringOptions: selectedOption.value,
    });
  };

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
      setRows(updatedRows);
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //Onchange Function For DatePicker inAdd datess First
  const changeDateStartHandler = (date, index) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = convertGMTDateintoUTC(date);
    console.log(DateDate, "DateDateDateDateDateDate");
    setMeetingDate(meetingDateValueFormat);
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = DateDate.slice(0, 8);
    setRows(updatedRows);
  };
  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    if (isValidRow(lastRow)) {
      setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
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

  const handleUpdateNext = () => {
    setorganizers(true);
    setmeetingDetails(false);
    let newArr = [];
    let newReminderData = [];
    newReminderData.push(
      meetingDetails.ReminderFrequency,
      meetingDetails.ReminderFrequencyTwo,
      meetingDetails.ReminderFrequencyThree
    );
    rows.map((data, index) => {
      newArr.push({
        MeetingDate: data.selectedOption,
        StartTime: data.startDate,
        EndTime: data.endDate,
      });
    });

    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let data = {
      MeetingDetails: {
        MeetingTitle: meetingDetails.MeetingTitle,
        MeetingType: meetingDetails.MeetingType,
        Location: meetingDetails.Location,
        Description: meetingDetails.Description,
        IsVideoChat: meetingDetails.IsVideoCall,
        IsTalkGroup: meetingDetails.groupChat,
        OrganizationId: organizationID,
        MeetingDates: newArr,
        MeetingReminders: newReminderData,
        Notes: meetingDetails.Notes,
        AllowRSVP: meetingDetails.AllowRSPV,
        NotifyOrganizerOnRSVP: meetingDetails.NotifyMeetingOrganizer,
        ReucurringMeetingID: meetingDetails.RecurringOptions,
        VideoURL: meetingDetails.Link,
        MeetingStatusID: 2,
      },
    };
    console.log(data, "datadatadatadata");
  };

  const handlePublish = () => {
    //Enable the Error Handling From here
    // seterror(true);
    // setSaveMeeting(!saveMeeting);
    let newArr = [];
    let newReminderData = [];
    newReminderData.push(
      meetingDetails.ReminderFrequency,
      meetingDetails.ReminderFrequencyTwo,
      meetingDetails.ReminderFrequencyThree
    );
    rows.map((data, index) => {
      newArr.push({
        MeetingDate: data.selectedOption,
        StartTime: data.startDate,
        EndTime: data.endDate,
      });
    });

    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let data = {
      MeetingDetails: {
        MeetingTitle: meetingDetails.MeetingTitle,
        MeetingType: meetingDetails.MeetingType,
        Location: meetingDetails.Location,
        Description: meetingDetails.Description,
        IsVideoChat: meetingDetails.IsVideoCall,
        IsTalkGroup: meetingDetails.groupChat,
        OrganizationId: organizationID,
        MeetingDates: newArr,
        MeetingReminders: newReminderData,
        Notes: meetingDetails.Notes,
        AllowRSVP: meetingDetails.AllowRSPV,
        NotifyOrganizerOnRSVP: meetingDetails.NotifyMeetingOrganizer,
        ReucurringMeetingID: meetingDetails.RecurringOptions,
        VideoURL: meetingDetails.Link,
        MeetingStatusID: 1,
      },
    };
    dispatch(SaveMeetingDetialsNewApiFunction(navigate, t, data));
  };

  const handleReminderFrequency = (e) => {
    setMeetingDetails({
      ...meetingDetails,
      ReminderFrequency: e.value,
    });
  };

  const handleReminderFrequencyTwo = (e) => {
    setMeetingDetails({
      ...meetingDetails,
      ReminderFrequencyTwo: e.value,
    });
  };

  const handleReminderFrequencyThree = (e) => {
    setMeetingDetails({
      ...meetingDetails,
      ReminderFrequencyThree: e.value,
    });
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Meetingtitle") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setMeetingDetails({
          ...meetingDetails,
          MeetingTitle: valueCheck,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          MeetingTitle: "",
        });
      }
    }

    if (name === "Location") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setMeetingDetails({
          ...meetingDetails,
          Location: valueCheck,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          Location: "",
        });
      }
    }
    if (name === "Description") {
      let valueCheck = regexOnlyCharacters(value);
      if (valueCheck !== "") {
        setMeetingDetails({
          ...meetingDetails,
          Description: valueCheck,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          Description: "",
        });
      }
    }
    if (name === "Notes") {
      let valueCheck = regexOnlyCharacters(value);
      if (valueCheck !== "") {
        setMeetingDetails({
          ...meetingDetails,
          Notes: valueCheck,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          Notes: "",
        });
      }
    }
    if (name === "Link" && value !== "") {
      if (urlPatternValidation(value)) {
        setMeetingDetails({
          ...meetingDetails,
          Link: value,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          Link: "",
        });
      }
    }
  };

  const handleGroupChat = () => {
    setMeetingDetails({
      ...meetingDetails,
      groupChat: !meetingDetails.groupChat,
    });
  };

  const handleRSPV = () => {
    setMeetingDetails({
      ...meetingDetails,
      AllowRSPV: !meetingDetails.AllowRSPV,
    });
  };

  const handleNotifyOrganizers = () => {
    setMeetingDetails({
      ...meetingDetails,
      NotifyMeetingOrganizer: !meetingDetails.NotifyMeetingOrganizer,
    });
  };

  //Handle Video Call Option
  const handleVideoCameraButton = () => {
    setMeetingDetails({
      ...meetingDetails,
      IsVideoCall: !meetingDetails.IsVideoCall,
    });
  };

  //Meeting Type Drop Down API
  useEffect(() => {
    dispatch(GetAllMeetingTypesNewFunction(navigate, t));
  }, []);

  //Reminder Frequency Drop Down API
  useEffect(() => {
    dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
  }, []);

  //Recurring Drop Down API
  useEffect(() => {
    dispatch(GetAllMeetingRecurringApiNew(navigate, t));
  }, []);

  //Meeting Type Drop Down Data
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getALlMeetingTypes.meetingTypes !== null &&
        NewMeetingreducer.getALlMeetingTypes.meetingTypes !== undefined
      ) {
        let Newdata = [];
        NewMeetingreducer.getALlMeetingTypes.meetingTypes.map((data, index) => {
          Newdata.push({
            value: data.pK_MTID,
            label: data.type,
          });
        });
        setmeetingTypeDropdown(Newdata);
      }
    } catch (error) {}
  }, [NewMeetingreducer.getALlMeetingTypes.meetingTypes]);

  //Reminder Frequency Drop Down Data
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getAllReminderFrequency.meetingReminders !== null &&
        NewMeetingreducer.getAllReminderFrequency.meetingReminders !== undefined
      ) {
        let Newdata = [];
        NewMeetingreducer.getAllReminderFrequency.meetingReminders.map(
          (data, index) => {
            console.log(data, "datadatadatas");
            Newdata.push({
              value: data.pK_MRID,
              label: data.description,
            });
          }
        );
        setReminderFrequencyOne(Newdata);
      }
    } catch (error) {}
  }, [NewMeetingreducer.getAllReminderFrequency.meetingReminders]);

  //Recurring Drop Down Data
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.recurring.meetingRecurrances !== null &&
        NewMeetingreducer.recurring.meetingRecurrances !== undefined
      ) {
        let Newdata = [];
        NewMeetingreducer.recurring.meetingRecurrances.map((data, index) => {
          console.log(data, "datadatadatas");
          Newdata.push({
            value: data.recurranceID,
            label: data.recurrance,
          });
        });
        setRecurringDropDown(Newdata);
      }
    } catch (error) {}
  }, [NewMeetingreducer.recurring.meetingRecurrances]);

  //language UseEffect
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

  return (
    <section>
      {saveMeeting ? (
        <MeetingActive />
      ) : (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button
                text={t("Start-meeting")}
                className={styles["Published"]}
              />
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Scroller_meeting_detials"]}
            >
              <Row>
                {/* First Half */}
                <Col lg={7} md={7} sm={12}>
                  <Row className="mt-5">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        placeholder={t("Meeting-title")}
                        applyClass={"meetinInnerSearch"}
                        name={"Meetingtitle"}
                        labelClass="d-none"
                        change={HandleChange}
                        value={meetingDetails.MeetingTitle}
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              error && meetingDetails.MeetingTitle === ""
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
                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={12}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Meeting_type_heading"]}>
                            {t("Meeting-type")}
                            <span className={styles["steric"]}>*</span>
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Select
                            options={meetingTypeDropdown}
                            placeholder={t("Meeting-type")}
                            onChange={handleMeetingSelectChange}
                            isSearchable={false}
                          />

                          <Row>
                            <Col>
                              <p
                                className={
                                  error && meetingDetails.MeetingType === 0
                                    ? ` ${styles["errorMessage-inLogin"]} `
                                    : `${styles["errorMessage-inLogin_hidden"]}`
                                }
                              >
                                {t("Please-select-meeting-type")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Meeting_type_heading"]}>
                            {t("Location")}
                            <span className={styles["steric"]}>*</span>
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <TextField
                            placeholder={t("Location")}
                            applyClass={"meetinInnerSearch"}
                            name={"Location"}
                            labelClass="d-none"
                            change={HandleChange}
                            value={meetingDetails.Location}
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  error && meetingDetails.Location === ""
                                    ? ` ${styles["errorMessage-inLogin"]} `
                                    : `${styles["errorMessage-inLogin_hidden"]}`
                                }
                              >
                                {t("Please-select-location")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        applyClass="text-area-create-resolution"
                        type="text"
                        as={"textarea"}
                        rows="4"
                        placeholder={t("Description") + "*"}
                        required={true}
                        name={"Description"}
                        change={HandleChange}
                        value={meetingDetails.Description}
                        maxLength={500}
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              error && meetingDetails.Description === ""
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
                    <Col lg={4} md={4} sm={12}>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                          <Switch onChange={handleGroupChat} />
                          <span className={styles["Create_group_chat_heading"]}>
                            {t("Create-group-chat")}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                      <Row>
                        <Col
                          lg={1}
                          md={1}
                          sm={12}
                          className="d-flex gap-3 m-0 p-0"
                        >
                          <Button
                            icon={
                              <img
                                draggable={false}
                                src={
                                  meetingDetails.IsVideoCall
                                    ? whiteVideIcon
                                    : MeetingVideoChatIcon
                                }
                                width="22.32px"
                                height="14.75px"
                                className={
                                  meetingDetails.IsVideoCall
                                    ? styles["Camera_icon_active_IconStyles"]
                                    : styles["Camera_icon"]
                                }
                              />
                            }
                            className={
                              meetingDetails.IsVideoCall
                                ? styles["Camera_icon_Active"]
                                : styles["Button_not_active"]
                            }
                            onClick={handleVideoCameraButton}
                          />
                        </Col>
                        <Col lg={11} md={11} sm={12}>
                          <TextField
                            disable={true}
                            placeholder={
                              t("Paste-microsoft-team-zoom-link") + "*"
                            }
                            applyClass={"meetinInnerSearch"}
                            labelClass="d-none"
                            name={"Link"}
                            change={HandleChange}
                            value={
                              meetingDetails.IsVideoCall
                                ? meetingDetails.Link
                                : ""
                            }
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  error && meetingDetails.Link === ""
                                    ? ` ${styles["errorMessage-inLogin"]} `
                                    : `${styles["errorMessage-inLogin_hidden"]}`
                                }
                              >
                                {t("Please-enter-meeting-link")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["Scedule_heading"]}>
                        {t("Scheduled-on")}
                        <span className={styles["steric"]}>*</span>
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
                                          selected={rows.selectedOption}
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
                                        className="d-flex justify-content-end align-items-center"
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
                  <Row className="mt-1">
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
                        disabled={!isValidRow(rows[rows.length - 1])}
                      />
                    </Col>
                  </Row>
                </Col>
                {/* Second Half */}
                <Col lg={5} md={5} sm={12}>
                  <Row className="mt-4">
                    <Row className="mt-1">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Frequency_heading"]}>
                          {t("Reminder-frequency")}
                          <span className={styles["steric"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                    <Col lg={4} md={4} sm={12}>
                      <Select
                        onChange={handleReminderFrequency}
                        options={reminderFrequencyOne}
                        value={reminderFrequencyOne.find(
                          (option) =>
                            option.value === meetingDetails.ReminderFrequency
                        )}
                        isDisabled={false} // First dropdown should always be enabled
                      />
                    </Col>
                    <Col lg={4} md={4} sm={12}>
                      <Select
                        onChange={handleReminderFrequencyTwo}
                        options={reminderFrequencyOne}
                        value={reminderFrequencyOne.find(
                          (option) =>
                            option.value === meetingDetails.ReminderFrequencyTwo
                        )}
                        isDisabled={
                          meetingDetails.ReminderFrequency === 0 ? true : false
                        } // Disable if first dropdown is not selected
                      />
                    </Col>
                    <Col lg={4} md={4} sm={12}>
                      <Select
                        onChange={handleReminderFrequencyThree}
                        options={reminderFrequencyOne}
                        value={reminderFrequencyOne.find(
                          (option) =>
                            option.value ===
                            meetingDetails.ReminderFrequencyThree
                        )}
                        isDisabled={
                          meetingDetails.ReminderFrequencyTwo === 0
                            ? true
                            : false
                        } // Disable if second dropdown is not selected
                      />
                    </Col>
                    <Row>
                      <Col>
                        <p
                          className={
                            error &&
                            meetingDetails.ReminderFrequency === 0 &&
                            meetingDetails.ReminderFrequencyTwo === 0 &&
                            meetingDetails.ReminderFrequencyThree === 0
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-select-reminder-frequency")}
                        </p>
                      </Col>
                    </Row>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        applyClass="text-area-create-meeting"
                        type="text"
                        as={"textarea"}
                        rows="6"
                        name={"Notes"}
                        change={HandleChange}
                        placeholder={t("Note-for-this-meeting") + "*"}
                        required={true}
                        maxLength={500}
                        value={meetingDetails.Notes}
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              error && meetingDetails.Notes === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }
                          >
                            {t("Please-select-reminder-frequency")}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={3} md={3} sm={12}>
                      <Row>
                        <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                          <Switch onChange={handleRSPV} />
                          <span className={styles["Notify_heading"]}>
                            {t("Allow-rspv")}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={9} md={9} sm={12}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex gap-2 justify-content-start"
                        >
                          <Switch onChange={handleNotifyOrganizers} />
                          <span className={styles["Notify_heading"]}>
                            {t("Notify-meeting-organizer-when-members-rspv")}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["reccurring_heading"]}>
                        {t("Recurring")}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <Select
                        value={rows.RecurringOptions}
                        onChange={handleRecurringSelectoptions}
                        options={recurringDropDown}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-3 justify-content-end"
            >
              <Button
                text={t("Delete-meeting")}
                className={styles["Published"]}
                // onClick={handlePublish}
              />
              <Button
                text={t("Publish-the-meeting")}
                className={styles["Published"]}
                // onClick={handlePublish}
              />
              <Button
                text={t("Publish")}
                className={styles["Published"]}
                onClick={handlePublish}
              />
              <Button
                text={t("Update-and-next")}
                className={styles["Update_Next"]}
                onClick={handleUpdateNext}
              />
            </Col>
          </Row>
        </>
      )}
      {NewMeetingreducer.Loading ? <Loader /> : null}
    </section>
  );
};

export default MeetingDetails;
