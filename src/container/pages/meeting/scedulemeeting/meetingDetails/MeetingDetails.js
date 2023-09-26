import React, { useState } from "react";
import styles from "./MeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import MeetingVideoChatIcon from "../../../../../assets/images/ColoredVideo.svg";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import whiteplusicon from "../../../../../assets/images/white plus icon.svg";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Loader,
  Notification,
} from "../../../../../components/elements";
import { Plus } from "react-bootstrap-icons";
import desh from "../../../../../assets/images/desh.svg";
import {
  regexOnlyCharacters,
  urlPatternValidation,
  validateInput,
} from "../../../../../commen/functions/regex";

const MeetingDetails = ({ setorganizers, setmeetingDetails }) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [rows, setRows] = useState([
    { selectedOption: "", startDate: "", endDate: "" },
  ]);
  const [error, seterror] = useState(false);

  const [meetingDetails, setMeetingDetails] = useState({
    MeetingTitle: "",
    MeetingType: "",
    Location: "",
    Description: "",
    Link: "",
    ReminderFrequency: 0,
    ReminderFrequencyTwo: 0,
    ReminderFrequencyThree: 0,
    Notes: "",
    groupChat: false,
    AllowRSPV: false,
    NotifyMeetingOrganizer: false,
  });

  const handleSelectChange = (selectedOption) => {
    setOptions({ ...options, selectedOption });
  };

  const handleMeetingSelectChange = (selectedOption) => {
    setOptions({ ...options, selectedOption });
  };

  const handleStartDateChange = (date) => {
    setOptions({ ...options, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setOptions({ ...options, endDate: date });
  };

  const addRow = () => {
    setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
  };

  const HandleCancelFunction = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  const handleUpdateNext = () => {
    setorganizers(true);
    setmeetingDetails(false);
  };

  const handlePublish = () => {
    seterror(true);
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
    if (name === "MeetingType") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setMeetingDetails({
          ...meetingDetails,
          MeetingType: valueCheck,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          MeetingType: "",
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

  console.log(rows, "optionsoptionsoptions");
  return (
    <section>
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
            <Col lg={5} md={5} sm={12}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Meeting_type_heading"]}>
                    {t("Meeting-type")}
                    <span>*</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  {/* TO BE CHANGED */}
                  <Select
                    value={rows.MeetingType}
                    onChange={handleMeetingSelectChange}
                    isSearchable={false}
                  />

                  <Row>
                    <Col>
                      <p
                        className={
                          error && meetingDetails.MeetingType === ""
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
            <Col lg={5} md={5} sm={12}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Meeting_type_heading"]}>
                    {t("Location")}
                    <span>*</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    width={"350px"}
                    placeholder={t("Location")}
                    applyClass={"meetinInnerSearch"}
                    name={"Location"}
                    change={HandleChange}
                    labelClass="d-none"
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
            <Col lg={2} md={2} sm={12} className="d-flex justify-content-end">
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <Button
                    className={styles["Plus_Button_class"]}
                    icon={
                      <img
                        src={whiteplusicon}
                        height="23.88px"
                        width="23.55px"
                        className={styles["White_Icon_class"]}
                      />
                    }
                  />
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
                <Col lg={1} md={1} sm={12} className="d-flex gap-3 m-0 p-0">
                  <Button
                    icon={
                      <img
                        src={MeetingVideoChatIcon}
                        width="22.32px"
                        height="14.75px"
                        className={styles["Camera_icon"]}
                      />
                    }
                    className={styles["Button_not_active"]}
                  />
                </Col>
                <Col lg={11} md={11} sm={12}>
                  <TextField
                    placeholder={t("Paste-microsoft-team-zoom-link") + "*"}
                    applyClass={"meetinInnerSearch"}
                    labelClass="d-none"
                    name={"Link"}
                    change={HandleChange}
                    value={meetingDetails.Link}
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
                <span>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["Scroller_meeting"]}>
              {rows.length > 0
                ? rows.map((data, index) => {
                    return (
                      <>
                        {index <= 1 ? (
                          <Row>
                            <Col lg={12} md={12} sm={12} key={index}>
                              <Row className="mt-2">
                                <Col lg={4} md={4} sm={12}>
                                  <Select
                                    value={rows.selectedOption}
                                    onChange={handleSelectChange}
                                    isSearchable={false}
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
                                  sm={12}
                                  className="timePicker"
                                >
                                  <DatePicker
                                    arrowClassName="arrowClass"
                                    containerClassName="containerClassTimePicker"
                                    className="timePicker"
                                    disableDayPicker
                                    inputClass="inputTIme"
                                    format="HH:mm A"
                                    plugins={[<TimePicker hideSeconds />]}
                                    selected={rows.startDate}
                                    onChange={handleStartDateChange}
                                  />
                                </Col>
                                <Col
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  className="d-flex justify-content-end align-items-center"
                                >
                                  <img src={desh} width="19.02px" />
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
                                    inputClass="inputTIme"
                                    format="HH:mm A"
                                    plugins={[<TimePicker hideSeconds />]}
                                    selected={rows.endDate}
                                    onChange={handleEndDateChange}
                                  />
                                </Col>
                                <Col
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  className="d-flex justify-content-end position-relative align-items-center"
                                >
                                  <img
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
                        ) : (
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Row className="mt-2">
                                <Col lg={4} md={4} sm={12}>
                                  <Select
                                    value={data.value}
                                    isSearchable={false}
                                  />
                                </Col>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={12}
                                  className="timePicker"
                                >
                                  <DatePicker
                                    arrowClassName="arrowClass"
                                    containerClassName="containerClassTimePicker"
                                    className="timePicker"
                                    disableDayPicker
                                    inputClass="inputTIme"
                                    format="HH:mm A"
                                    plugins={[<TimePicker hideSeconds />]}
                                  />
                                </Col>
                                <Col
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  className="d-flex justify-content-end align-items-center"
                                >
                                  <img src={desh} width="19.02px" />
                                </Col>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={12}
                                  className="d-flex justify-content-start"
                                >
                                  <DatePicker
                                    arrowClassName="arrowClass"
                                    containerClassName="containerClassTimePicker"
                                    className="timePicker"
                                    disableDayPicker
                                    inputClass="inputTIme"
                                    format="HH:mm A"
                                    plugins={[<TimePicker hideSeconds />]}
                                  />
                                </Col>
                                <Col
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  className="d-flex justify-content-end position-relative align-items-center"
                                >
                                  <img
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
                        )}
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
        {/* Second Half */}
        <Col lg={5} md={5} sm={12}>
          <Row className="mt-4">
            <Row className="mt-1">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Frequency_heading"]}>
                  {t("Reminder-frequency")}
                  <span>*</span>
                </span>
              </Col>
            </Row>
            <Col lg={4} md={4} sm={12}>
              <Select onChange={handleReminderFrequency} />
            </Col>
            <Col lg={4} md={4} sm={12}>
              <Select onChange={handleReminderFrequencyTwo} />
            </Col>
            <Col lg={4} md={4} sm={12}>
              <Select onChange={handleReminderFrequencyThree} />
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
            <Col lg={4} md={4} sm={12}>
              <Row>
                <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                  <Switch onChange={handleRSPV} />
                  <span className={styles["Notify_heading"]}>
                    {t("Allow-rspv")}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col lg={8} md={8} sm={12}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex gap-3 justify-content-start"
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
              <Select />
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
        </Col>
      </Row>
    </section>
  );
};

export default MeetingDetails;
