import React, { useEffect, useRef, useState } from "react";
import styles from "./MeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import MeetingVideoChatIcon from "../../../../../assets/images/ColoredVideo.svg";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import InputIcon from "react-multi-date-picker/components/input_icon";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import whiteVideIcon from "../../../../../assets/images/whiteVideoIcon.png";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Notification,
} from "../../../../../components/elements";
import desh from "../../../../../assets/images/desh.svg";
import MeetingActive from "./MeetingActivePage/MeetingActive";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  ClearMessegeMeetingdetails,
  GetAllMeetingDetailsApiFunc,
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  showCancelViewModalmeetingDeitals,
} from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resolutionResultTable } from "../../../../../commen/functions/date_formater";
import CancelButtonModal from "./CancelButtonModal/CancelButtonModal";

const ViewMeetingDetails = ({
  setorganizers,
  setmeetingDetails,
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const [meetingTypeDropdown, setmeetingTypeDropdown] = useState([]);
  const [reminderFrequencyOne, setReminderFrequencyOne] = useState([]);
  const [recurringDropDown, setRecurringDropDown] = useState([]);

  const [rows, setRows] = useState([
    {
      selectedOption: "",
      dateForView: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  ]);

  //For Custom language datepicker
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();
  const [saveMeeting, setSaveMeeting] = useState(false);
  const [publishedFlag, setPublishedFlag] = useState(null);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [meetingDetails, setMeetingDetails] = useState({
    MeetingTitle: "",
    MeetingType: 0,
    Location: "",
    Description: "",
    Link: "",
    ReminderFrequency: {
      value: 0,
      label: "",
    },
    ReminderFrequencyTwo: {
      value: 0,
      label: "",
    },
    ReminderFrequencyThree: {
      value: 0,
      label: "",
    },
    Notes: "",
    groupChat: false,
    AllowRSPV: false,
    NotifyMeetingOrganizer: false,
    RecurringOptions: {
      value: 0,
      label: "",
    },
    Location: "",
    IsVideoCall: false,
  });

  let currentMeetingID = Number(localStorage.getItem("meetingID"));
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

  useEffect(() => {
    //Meeting Type Drop Down API
    dispatch(GetAllMeetingTypesNewFunction(navigate, t));
    //Reminder Frequency Drop Down API
    dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
    //Recurring Drop Down API
    dispatch(GetAllMeetingRecurringApiNew(navigate, t));
    //Calling getAll Meeting Details By Meeting ID
    if (advanceMeetingModalID > 0) {
      let Data = {
        MeetingID: Number(advanceMeetingModalID),
      };
      dispatch(GetAllMeetingDetailsApiFunc(Data, navigate, t));
    } else {
    }
  }, []);

  const HandleCancelFunction = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  const handleUpdateNext = () => {
    setmeetingDetails(false);
    setorganizers(true);
  };

  //funciton cancel button
  const handleCancelMeetingButton = (e) => {
    e.PreventDefault()
    console.log("handleCancelMeetingButton")
    dispatch(showCancelViewModalmeetingDeitals(true));
  };

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

  // Showing The reposnse messege
  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("Record-found") &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: NewMeetingreducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(ClearMessegeMeetingdetails());
    } else {
      dispatch(ClearMessegeMeetingdetails());
    }
  }, [NewMeetingreducer.ResponseMessage]);

  //For reminder frequency uniqueness
  useEffect(() => {
    const selectedValues = new Set([
      meetingDetails.ReminderFrequency.value,
      meetingDetails.ReminderFrequencyTwo.value,
      meetingDetails.ReminderFrequencyThree.value,
    ]);

    // Filter out the selected options from the initial options
    const updatedOptions = reminderFrequencyOne.filter(
      (option) => !selectedValues.has(option.value)
    );

    // Update the available options
    setReminderFrequencyOne(updatedOptions);
  }, [
    meetingDetails.ReminderFrequency,
    meetingDetails.ReminderFrequencyTwo,
    meetingDetails.ReminderFrequencyThree,
  ]);

  //Fetching All Saved Data
  useEffect(() => {
    try {
    } catch {}
    if (
      NewMeetingreducer.getAllMeetingDetails != null &&
      NewMeetingreducer.getAllMeetingDetails != undefined
    ) {
      let MeetingData =
        NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails;
      let getmeetingDates = MeetingData.meetingDates;
      let getmeetingRecurrance = MeetingData.meetingRecurrance;
      let getmeetingReminders = MeetingData.meetingReminders;
      let getmeetingStatus = MeetingData.meetingStatus;
      let getmeetingType = MeetingData.meetingType;
      let wasPublishedFlag = MeetingData.wasMeetingPublished;
      console.log(wasPublishedFlag, "getmeetingTypegetmeetingType");
      setMeetingDetails({
        MeetingTitle: MeetingData.meetingTitle,
        MeetingType: {
          PK_MTID: getmeetingType.pK_MTID,
          Type: getmeetingType.type,
        },
        Location: MeetingData.location,
        Description: MeetingData.description,
        Link: MeetingData.videoCallURl,
        ReminderFrequency: {
          value:
            getmeetingReminders[0] !== undefined
              ? getmeetingReminders[0]?.pK_MRID
              : 0,
          label:
            getmeetingReminders[0] !== undefined
              ? getmeetingReminders[0]?.description
              : "",
        },
        ReminderFrequencyTwo: {
          value:
            getmeetingReminders[1] !== undefined
              ? getmeetingReminders[1]?.pK_MRID
              : 0,
          label:
            getmeetingReminders[1] !== undefined
              ? getmeetingReminders[1]?.description
              : "",
        },
        ReminderFrequencyThree: {
          value:
            getmeetingReminders[2] !== undefined
              ? getmeetingReminders[2]?.pK_MRID
              : 0,
          label:
            getmeetingReminders[2] !== undefined
              ? getmeetingReminders[2]?.description
              : "",
        },
        Notes: MeetingData.notes,
        groupChat: MeetingData.isTalkGroup,
        AllowRSPV: MeetingData.allowRSVP,
        NotifyMeetingOrganizer: MeetingData.notifyAdminOnRSVP,
        RecurringOptions: {
          value: getmeetingRecurrance.recurranceID,
          label: getmeetingRecurrance.recurrance,
        },
        Location: MeetingData.location,
        IsVideoCall: MeetingData.isVideo,
      });
      let newDateTimeData = [];
      if (
        getmeetingDates !== null &&
        getmeetingDates !== undefined &&
        getmeetingDates.length > 0
      ) {
        getmeetingDates.forEach((data, index) => {
          newDateTimeData.push({
            selectedOption: data.meetingDate,
            startDate: data.startTime,
            endDate: data.endTime,
            endTime: resolutionResultTable(data.meetingDate + data.endTime),
            startTime: resolutionResultTable(data.meetingDate + data.startTime),
            dateForView: resolutionResultTable(
              data.meetingDate + data.startTime
            ),
          });
        });
      }
      setRows(newDateTimeData);
      setPublishedFlag(wasPublishedFlag);
    }
  }, [NewMeetingreducer.getAllMeetingDetails]);
  console.log("handleCancelMeetingButton",NewMeetingreducer.cancelViewModalMeetingDetails)

  return (
    <section>
      {saveMeeting ? (
        <MeetingActive />
      ) : (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Scroller_meeting_detials"]}
            >
              <Row>
                {/* First Half */}
                <Col lg={7} md={7} sm={12} className="mt-3">
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        placeholder={t("Meeting-title")}
                        applyClass={"meetinInnerSearch"}
                        name={"Meetingtitle"}
                        labelClass="d-none"
                        value={meetingDetails.MeetingTitle}
                        disable
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={12}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Meeting_type_heading"]}>
                            {t("Meeting-type")}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Select
                            options={meetingTypeDropdown}
                            placeholder={t("Meeting-type")}
                            value={{
                              value: meetingDetails.MeetingType?.PK_MTID,
                              label: meetingDetails.MeetingType?.Type,
                            }}
                            isSearchable={false}
                            isDisabled={true}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Meeting_type_heading"]}>
                            {t("Location")}
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
                            value={meetingDetails.Location}
                            disable
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
                        placeholder={t("Description")}
                        required={true}
                        name={"Description"}
                        value={meetingDetails.Description}
                        maxLength={500}
                        disable
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={4} md={4} sm={12}>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                          <Switch
                            checkedValue={meetingDetails.groupChat}
                            disabled={true}
                          />
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
                            disableBtn={true}
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
                                alt=""
                              />
                            }
                            className={
                              meetingDetails.IsVideoCall
                                ? styles["Camera_icon_Active"]
                                : styles["Button_not_active"]
                            }
                          />
                        </Col>
                        <Col lg={11} md={11} sm={12}>
                          <TextField
                            disable={true}
                            placeholder={t("Paste-microsoft-team-zoom-link")}
                            applyClass={"meetinInnerSearch"}
                            labelClass="d-none"
                            name={"Link"}
                            value={
                              meetingDetails.IsVideoCall
                                ? meetingDetails.Link
                                : ""
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["Scedule_heading"]}>
                        {t("Scheduled-on")}
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
                            console.log(data, "datadata");
                            return (
                              <>
                                <Row>
                                  <Col lg={12} md={12} sm={12} key={index}>
                                    <Row className="mt-2">
                                      <Col lg={4} md={4} sm={12}>
                                        <DatePicker
                                          selected={data.selectedOption}
                                          value={data.dateForView}
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
                                          disabled
                                        />
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
                                          selected={
                                            currentMeetingID === 0
                                              ? data.startDate
                                              : rows.startDate
                                          }
                                          value={data.startTime}
                                          plugins={[<TimePicker hideSeconds />]}
                                          disabled
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
                                          arrowClassName="arrowClass"
                                          containerClassName="containerClassTimePicker"
                                          className="timePicker"
                                          disableDayPicker
                                          inputClass="inputTImeMeeting"
                                          calendar={calendarValue}
                                          locale={localValue}
                                          value={data.endTime}
                                          format="HH:mm A"
                                          selected={data.endDate}
                                          plugins={[<TimePicker hideSeconds />]}
                                          disabled
                                        />
                                      </Col>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={12}
                                        className="d-flex justify-content-end position-relative align-items-center"
                                      >
                                        {index > 0 ? (
                                          <>
                                            <img
                                              draggable={false}
                                              src={redcrossIcon}
                                              width="23px"
                                              height="23px"
                                              className={
                                                styles["Cross_icon_class"]
                                              }
                                              onClick={() => {
                                                HandleCancelFunction(index);
                                              }}
                                              alt=""
                                            />
                                          </>
                                        ) : null}
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </>
                            );
                          })
                        : null}
                    </Col>
                  </Row>
                </Col>
                {/* Second Half */}
                <Col lg={5} md={5} sm={12} className="mt-3">
                  <Row>
                    <Col lg={4} md={4} sm={12}>
                      <Select
                        placeholder={t("Reminder")}
                        options={reminderFrequencyOne}
                        value={{
                          value: meetingDetails.ReminderFrequency.value,
                          label: meetingDetails.ReminderFrequency.label,
                        }}
                        isDisabled={true}
                      />
                    </Col>
                    <Col lg={4} md={4} sm={12}>
                      <Select
                        placeholder={t("Reminder")}
                        options={reminderFrequencyOne}
                        value={{
                          value: meetingDetails.ReminderFrequencyTwo.value,
                          label: meetingDetails.ReminderFrequencyTwo.label,
                        }}
                        isDisabled={true}
                      />
                    </Col>
                    <Col lg={4} md={4} sm={12}>
                      <Select
                        placeholder={t("Reminder")}
                        options={reminderFrequencyOne}
                        value={{
                          value: meetingDetails.ReminderFrequencyThree.value,
                          label: meetingDetails.ReminderFrequencyThree.label,
                        }}
                        isDisabled={true}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        applyClass="text-area-create-meeting"
                        type="text"
                        as={"textarea"}
                        rows="6"
                        name={"Notes"}
                        placeholder={t("Note-for-this-meeting")}
                        required={true}
                        maxLength={500}
                        value={meetingDetails.Notes}
                        disable
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={3} md={3} sm={12}>
                      <Row>
                        <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                          <Switch
                            checkedValue={meetingDetails.AllowRSPV}
                            disabled={true}
                          />
                          <span className={styles["Notify_heading"]}>
                            {t("Allow-rsvp")}
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
                          <Switch
                            checkedValue={meetingDetails.NotifyMeetingOrganizer}
                            disabled={true}
                          />
                          <span className={styles["Notify_heading"]}>
                            {t("Notify-meeting-organizer-when-members-rsvp")}
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
                        options={recurringDropDown}
                        value={{
                          value: meetingDetails.RecurringOptions?.value,
                          label: meetingDetails.RecurringOptions?.label,
                        }}
                        isDisabled={true}
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
                text={t("Cancel")}
                className={styles["Published"]}
                onClick={()=>handleCancelMeetingButton()}
              />

              <Button
                text={t("Next")}
                className={styles["Published"]}
                onClick={handleUpdateNext}
              />
            </Col>
          </Row>
        </>
      )}
      {NewMeetingreducer.cancelViewModalMeetingDetails && (
        <CancelButtonModal
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setMeetingDetails={setMeetingDetails}
        />
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default ViewMeetingDetails;
