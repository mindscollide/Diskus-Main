import React, { useEffect, useRef, useState } from "react";
import styles from "./MeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import MeetingVideoChatIcon from "../../../../../assets/images/ColoredVideo.svg";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import whiteVideIcon from "../../../../../assets/images/whiteVideoIcon.png";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Notification,
} from "../../../../../components/elements";
import desh from "../../../../../assets/images/desh.svg";
import {
  containsStringandNumericCharacters,
  regexOnlyCharacters,
  validateInput,
} from "../../../../../commen/functions/regex";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  SaveMeetingDetialsNewApiFunction,
  ShowNextConfirmationModal,
  clearResponseNewMeetingReducerMessage,
  showCancelModalmeetingDeitals,
} from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { Await, useNavigate } from "react-router-dom";
import {
  convertDateTimetoGMTMeetingDetail,
  createConvert,
  resolutionResultTable,
} from "../../../../../commen/functions/date_formater";
import CancelButtonModal from "./CancelButtonModal/CancelButtonModal";
import NextModal from "./NextModal/NextModal";
import { areAllValuesNotEmpty } from "../../../../../commen/functions/CompareArrayObjectValues";
import {
  getAgendaAndVotingInfo_success,
  GetCurrentAgendaDetails,
  getAgendaVotingDetails_success,
  saveFiles_success,
  saveAgendaVoting_success,
  addUpdateAdvanceMeetingAgenda_success,
  uploadDocument_success,
  getAllVotingResultDisplay_success,
  getAgendaWithMeetingIDForImport_success,
  getAllMeetingForAgendaImport_success,
} from "../../../../../store/actions/MeetingAgenda_action";
import {
  getCurrentDate,
  getEndTimeWitlCeilFunction,
  getStartTimeWithCeilFunction,
  getTimeWithCeilFunction,
  incrementDateforPropsedMeeting,
} from "../../../../../commen/functions/time_formatter";
import { endDateTimeMeetingCalender } from "../../../../../commen/functions/date_formater";

const MeetingDetails = ({
  setorganizers,
  setmeetingDetails,
  setSceduleMeeting,
  setCurrentMeetingID,
  currentMeeting,
  editorRole,
  setEditMeeting,
  isEditMeeting,
  setDataroomMapFolderId,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nextConfirmModal = useSelector(
    (state) => state.NewMeetingreducer.nextConfirmModal
  );
  const cancelModalMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.cancelModalMeetingDetails
  );
  const getmeetingURL = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );
  const getAllReminderFrequency = useSelector(
    (state) => state.NewMeetingreducer.getAllReminderFrequency
  );
  const recurring = useSelector((state) => state.NewMeetingreducer.recurring);
  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );

  const getAllMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.getAllMeetingDetails
  );
  const Loading = useSelector((state) => state.NewMeetingreducer.Loading);

  const [meetingTypeDropdown, setmeetingTypeDropdown] = useState([]);
  const [reminderFrequencyOne, setReminderFrequencyOne] = useState([]);
  const [recurringDropDown, setRecurringDropDown] = useState([]);
  const getStartTime = getStartTimeWithCeilFunction();
  const getEndTime = getEndTimeWitlCeilFunction();
  const getCurrentDateforMeeting = getCurrentDate();
  const [rows, setRows] = useState([
    {
      selectedOption: getCurrentDateforMeeting.dateFormat,
      dateForView: getCurrentDateforMeeting.DateGMT,
      startDate: getStartTime?.formattedTime,
      startTime: getStartTime?.newFormatTime,
      endDate: getEndTime?.formattedTime,
      endTime: getEndTime?.newFormatTime,
    },
  ]);
  console.log(rows, "rowsrowsrowsrows");
  //For Custom language datepicker
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

  const calendRef = useRef();
  const [error, seterror] = useState(false);
  const [publishedFlag, setPublishedFlag] = useState(null);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [meetingDetails, setMeetingDetails] = useState({
    MeetingTitle: "",
    MeetingType: {
      PK_MTID: 1,
      Type: t("Board-meeting"),
    },
    Location: "",
    Description: "",
    Link: "",
    ReminderFrequency: {
      value: 4,
      label: t("1-hour-before"),
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
    AllowRSPV: true,
    NotifyMeetingOrganizer: true,
    RecurringOptions: {
      value: 0,
      label: "",
    },
    IsVideoCall: true,
  });

  // useEffect(() => {
  //   if (Number(currentMeeting) === 0) {
  //     const updatedRows = [...rows];
  //     updatedRows[0].selectedOption =
  //       currentMeeting === 0 ? getCurrentDateforMeeting.dateFormat : "";
  //     updatedRows[0].dateForView =
  //       currentMeeting === 0 ? getCurrentDateforMeeting.DateGMT : "";
  //     updatedRows[0].startDate =
  //       currentMeeting === 0 ? getStartTime?.formattedTime : "";
  //     updatedRows[0].startTime =
  //       currentMeeting === 0 ? getStartTime?.newFormatTime : "";
  //     updatedRows[0].endDate =
  //       currentMeeting === 0 ? getEndTime?.formattedTime : "";
  //     updatedRows[0].endTime =
  //       currentMeeting === 0 ? getEndTime?.newFormatTime : "";
  //     setRows(updatedRows);
  //   }
  // }, [currentMeeting]);
  // custom react select styles recurring
  const customStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensure the dropdown is rendered above other elements
    }),
    menu: (provided, state) => ({
      ...provided,
      marginTop: state.selectProps.menuPlacement === "top" ? "0" : null,
      marginBottom: state.selectProps.menuPlacement === "bottom" ? "0" : null,
    }),
  };

  //language UseEffect
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
    //Calling getAll Meeting Details By Meeting ID
    return () => {
      setMeetingDetails({
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
        IsVideoCall: false,
      });
      setRows([
        {
          selectedOption: "",
          dateForView: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
        },
      ]);
    };
  }, []);

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
      RecurringOptions: {
        value: selectedOption.value,
        label: selectedOption.label,
      },
    });
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
  // startDate: getStartTime?.formattedTime,
  //       startTime: getStartTime?.newFormatTime,

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
  // endDate: getEndTime?.formattedTime,
  // endTime: getEndTime?.newFormatTime,
  //Onchange Function For DatePicker inAdd datess First
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
        updatedRows[index].dateForView = newDate;
        setRows(updatedRows);
      }
    } catch {}
  };

  const addRow = () => {
    const lastRow = rows[rows.length - 1];

    if (isValidRow(lastRow)) {
      let { DateGMT, dateFormat } = incrementDateforPropsedMeeting(
        lastRow.dateForView
      );
      setRows([
        ...rows,
        {
          selectedOption: dateFormat,
          dateForView: DateGMT,
          startDate: getStartTime?.formattedTime,
          startTime: getStartTime?.newFormatTime,
          endDate: getEndTime?.formattedTime,
          endTime: getEndTime?.newFormatTime,
        },
      ]);
    }
  };

  //Validation For Checking that the Row Should Not Be Empty Before Inserting the Another
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

  const handlePublish = () => {
    //Enable the Error Handling From here
    // setSaveMeeting(!saveMeeting);
    let newArr = [];
    let newReminderData = [];
    if (meetingDetails.ReminderFrequency.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequency.value);
    }
    if (meetingDetails.ReminderFrequencyTwo.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyTwo.value);
    }
    if (meetingDetails.ReminderFrequencyThree.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyThree.value);
    }

    rows.forEach((data, index) => {
      newArr.push({
        MeetingDate: createConvert(data.selectedOption + data.startDate).slice(
          0,
          8
        ),
        StartTime: createConvert(data.selectedOption + data.startDate).slice(
          8,
          14
        ),
        EndTime: createConvert(data.selectedOption + data.endDate).slice(8, 14),
        // EndTime: data.endDate,
      });
    });
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      // meetingDetails.Description !== "" &&
      newArr.length > 0 &&
      newReminderData.length > 0
      // &&
      // meetingDetails.Notes !== ""
    ) {
      let recurringMeetingID =
        meetingDetails.RecurringOptions.value !== 0
          ? meetingDetails.RecurringOptions.value
          : 1;

      let data = {
        MeetingDetails: {
          MeetingID: Number(currentMeeting) !== 0 ? Number(currentMeeting) : 0,
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
          ReucurringMeetingID: recurringMeetingID,
          VideoURL: meetingDetails.Link,
          MeetingStatusID: 1,
        },
      };
      dispatch(
        SaveMeetingDetialsNewApiFunction(
          navigate,
          t,
          data,
          setSceduleMeeting,
          setorganizers,
          setmeetingDetails,
          2,
          setCurrentMeetingID,
          currentMeeting,
          meetingDetails,
          setDataroomMapFolderId
        )
      );
    } else {
      seterror(true);
    }
  };

  //Save Meeting
  const SaveMeeting = () => {
    // setSaveMeeting(!saveMeeting);
    let newArr = [];
    let newReminderData = [];
    if (meetingDetails.ReminderFrequency.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequency.value);
    }

    if (meetingDetails.ReminderFrequencyTwo.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyTwo.value);
    }
    if (meetingDetails.ReminderFrequencyThree.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyThree.value);
    }

    rows.forEach((data, index) => {
      newArr.push({
        MeetingDate: createConvert(data.selectedOption + data.startDate).slice(
          0,
          8
        ),
        StartTime: createConvert(data.selectedOption + data.startDate).slice(
          8,
          14
        ),
        EndTime: createConvert(data.selectedOption + data.endDate).slice(8, 14),
        // EndTime: data.endDate,
      });
    });

    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      // meetingDetails.Description !== "" &&
      areAllValuesNotEmpty(newArr) &&
      newReminderData.length > 0
      //  &&
      // meetingDetails.Notes !== ""
    ) {
      let organizationID = JSON.parse(localStorage.getItem("organizationID"));
      // Check if RecurringOptions.value is defined and use it
      let recurringMeetingID =
        meetingDetails.RecurringOptions.value !== 0
          ? meetingDetails.RecurringOptions.value
          : 1;

      let data = {
        MeetingDetails: {
          MeetingID: 0,
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
          ReucurringMeetingID: recurringMeetingID,
          VideoURL: meetingDetails.Link,
          MeetingStatusID:
            publishedFlag !== null && publishedFlag === true ? 1 : 11,
        },
      };

      dispatch(
        SaveMeetingDetialsNewApiFunction(
          navigate,
          t,
          data,
          setSceduleMeeting,
          setorganizers,
          setmeetingDetails,
          2,
          setCurrentMeetingID,
          currentMeeting,
          meetingDetails,
          setDataroomMapFolderId
        )
      );
      localStorage.setItem("MeetingTitle", meetingDetails.MeetingTitle);
    } else {
      seterror(true);
    }
  };

  //Update Meeting
  const UpdateMeetings = () => {
    // setSaveMeeting(!saveMeeting);
    let newArr = [];
    let newReminderData = [];
    if (meetingDetails.ReminderFrequency.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequency.value);
    }
    if (meetingDetails.ReminderFrequencyTwo.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyTwo.value);
    }
    if (meetingDetails.ReminderFrequencyThree.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyThree.value);
    }
    rows.forEach((data, index) => {
      newArr.push({
        MeetingDate: createConvert(data.selectedOption + data.startDate).slice(
          0,
          8
        ),
        StartTime: createConvert(data.selectedOption + data.startDate).slice(
          8,
          14
        ),
        EndTime: createConvert(data.selectedOption + data.endDate).slice(8, 14),
        // EndTime: data.endDate,
      });
    });
    let recurringMeetingID =
      meetingDetails.RecurringOptions.value !== 0
        ? meetingDetails.RecurringOptions.value
        : 1;
    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      // meetingDetails.Description !== "" &&
      areAllValuesNotEmpty(newArr) &&
      newReminderData.length > 0
      // &&
      // meetingDetails.Notes !== ""
    ) {
      let organizationID = JSON.parse(localStorage.getItem("organizationID"));
      let data = {
        MeetingDetails: {
          MeetingID: Number(currentMeeting),
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
          ReucurringMeetingID: recurringMeetingID,
          VideoURL: meetingDetails.Link,
          MeetingStatusID: 11,
          // IsComingFromApi: true,
        },
      };
      dispatch(
        SaveMeetingDetialsNewApiFunction(
          navigate,
          t,
          data,
          setSceduleMeeting,
          setorganizers,
          setmeetingDetails,
          4,
          setCurrentMeetingID,
          currentMeeting,
          meetingDetails,
          setDataroomMapFolderId
        )
      );
    } else {
      seterror(true);
    }
  };

  const handleReminderFrequency = (e) => {
    setMeetingDetails({
      ...meetingDetails,
      ReminderFrequency: {
        value: e.value,
        label: e.label,
      },
    });
  };

  const handleReminderFrequencyTwo = (e) => {
    setMeetingDetails({
      ...meetingDetails,
      ReminderFrequencyTwo: {
        value: e.value,
        label: e.label,
      },
    });
  };

  const handleReminderFrequencyThree = (e) => {
    setMeetingDetails({
      ...meetingDetails,
      ReminderFrequencyThree: {
        value: e.value,
        label: e.label,
      },
    });
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Meetingtitle") {
      // let valueCheck = containsStringandNumericCharacters(value);
      if (value.trimStart() !== "") {
        setMeetingDetails({
          ...meetingDetails,
          MeetingTitle: value,
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
      if (value.trimStart() !== "") {
        setMeetingDetails({
          ...meetingDetails,
          Description: value,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          Description: "",
        });
      }
    }
    if (name === "Notes") {
      if (value.trimStart() !== "") {
        setMeetingDetails({
          ...meetingDetails,
          Notes: value,
        });
      } else {
        setMeetingDetails({
          ...meetingDetails,
          Notes: "",
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

  useEffect(() => {
    if (getmeetingURL !== null && getmeetingURL !== undefined) {
      setMeetingDetails({
        ...meetingDetails,
        Link: getmeetingURL.videoURL,
      });
    }
  }, [getmeetingURL]);

  //funciton cancel button
  const handleCancelMeetingButton = () => {
    dispatch(showCancelModalmeetingDeitals(true));
  };

  //Meeting Type Drop Down Data
  useEffect(() => {
    try {
      if (
        getALlMeetingTypes.meetingTypes !== null &&
        getALlMeetingTypes.meetingTypes !== undefined
      ) {
        let Newdata = [];
        getALlMeetingTypes.meetingTypes.forEach((data, index) => {
          Newdata.push({
            value: data.pK_MTID,
            label: data.type,
          });
          setMeetingDetails({
            ...meetingDetails,
            MeetingType: {
              PK_MTID: getALlMeetingTypes.meetingTypes[0].pK_MTID,
              Type: getALlMeetingTypes.meetingTypes[0].type,
            },
          });
        });
        setmeetingTypeDropdown(Newdata);
      }
    } catch (error) {}
  }, [getALlMeetingTypes.meetingTypes]);

  //Reminder Frequency Drop Down Data
  useEffect(() => {
    try {
      if (
        getAllReminderFrequency.meetingReminders !== null &&
        getAllReminderFrequency.meetingReminders !== undefined
      ) {
        let Newdata = [];
        getAllReminderFrequency.meetingReminders.map((data, index) => {
          Newdata.push({
            value: data.pK_MRID,
            label: data.description,
          });
        });
        setReminderFrequencyOne(Newdata);
      }
    } catch (error) {}
  }, [getAllReminderFrequency.meetingReminders]);

  //Recurring Drop Down Data
  useEffect(() => {
    try {
      if (
        recurring.meetingRecurrances !== null &&
        recurring.meetingRecurrances !== undefined
      ) {
        let Newdata = [];
        recurring.meetingRecurrances.map((data, index) => {
          Newdata.push({
            value: data.recurranceID,
            label: data.recurrance,
          });
        });
        setRecurringDropDown(Newdata);
      }
    } catch (error) {}
  }, [recurring.meetingRecurrances]);

  useEffect(() => {
    // Check if the default value has not been set
    if (
      recurringDropDown.length > 0 &&
      !meetingDetails.RecurringOptions?.value &&
      !meetingDetails.RecurringOptions?.label
    ) {
      // Set the default value to the first item in the recurringDropDown
      handleRecurringSelectoptions({
        value: recurringDropDown[0].value,
        label: recurringDropDown[0].label,
      });
    }
  }, [recurringDropDown, meetingDetails.RecurringOptions]);

  // Showing The reposnse messege
  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== t("Record-found") &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== undefined &&
      ResponseMessage !== null
    ) {
      // setOpen({
      //   ...open,
      //   flag: true,
      //   message: ResponseMessage,
      // });
      // setTimeout(() => {
      setOpen({
        ...open,
        flag: true,
        message: ResponseMessage,
      });
      // }, 3000);
      dispatch(clearResponseNewMeetingReducerMessage());
    }
  }, [ResponseMessage]);

  //Fetching All Saved Data
  useEffect(() => {
    try {
      if (
        currentMeeting !== 0 &&
        getAllMeetingDetails !== null &&
        getAllMeetingDetails !== undefined
      ) {
        // setEditMeeting(true);
        let MeetingData = getAllMeetingDetails.advanceMeetingDetails;
        let getmeetingDates = MeetingData.meetingDates;
        let getmeetingRecurrance = MeetingData.meetingRecurrance;
        let getmeetingReminders = MeetingData.meetingReminders;
        let getmeetingType = MeetingData.meetingType;
        let wasPublishedFlag = MeetingData.wasMeetingPublished;
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
              selectedOption: convertDateTimetoGMTMeetingDetail(
                data.meetingDate + data.startTime
              ).slice(0, 8),
              startDate: convertDateTimetoGMTMeetingDetail(
                data.meetingDate + data.startTime
              ).slice(8, 14),
              endDate: convertDateTimetoGMTMeetingDetail(
                data.meetingDate + data.endTime
              ).slice(8, 14),
              endTime: resolutionResultTable(data.meetingDate + data.endTime),
              startTime: resolutionResultTable(
                data.meetingDate + data.startTime
              ),
              dateForView: resolutionResultTable(
                data.meetingDate + data.startTime
              ),
            });
          });
        }
        setRows(newDateTimeData);
        setPublishedFlag(wasPublishedFlag);
      } else {
      }
    } catch {}
  }, [getAllMeetingDetails, currentMeeting]);

  function compareMeetings(meetingsArray1, meetingsArray2) {
    if (meetingsArray1.length !== meetingsArray2.length) {
      return false; // If the arrays have different lengths, they can't be equal
    }

    for (let i = 0; i < meetingsArray1.length; i++) {
      const meeting1 = meetingsArray1[i];
      const meeting2 = meetingsArray2[i];
      console.log({ meeting1, meeting2 }, "meetingDataMeetingData");
      if (
        meeting1.MeetingDate !== meeting2.meetingDate ||
        meeting1.StartTime !== meeting2.startTime ||
        meeting1.EndTime !== meeting2.endTime
      ) {
        return false; // If any property is different, the meetings are not equal
      }
    }

    return true; // If no differences were found, the arrays are equal
  }
  function comparePKMRID(meetingArray, idArray) {
    // Check if the arrays have the same length
    if (meetingArray.length !== idArray.length) {
      return false;
    }

    // Iterate through the meetings in the first array
    for (let i = 0; i < meetingArray.length; i++) {
      const meeting = meetingArray[i];
      const id = idArray[i];

      // Compare the pK_MRID property with the corresponding value in the second array
      if (meeting.pK_MRID !== id) {
        return false;
      }
    }

    return true; // If no differences were found, the arrays are considered equal
  }

  const handleUpdateNext = () => {
    //Function For Next Checks ValidationS
    try {
      let MeetingData = getAllMeetingDetails.advanceMeetingDetails;

      let newArr = [];
      rows.forEach((data, index) => {
        newArr.push({
          MeetingDate: data.selectedOption,
          StartTime: data.startDate,
          EndTime: data.endDate,
        });
      });

      let newReminderData = [];
      if (meetingDetails.ReminderFrequency.value !== 0) {
        newReminderData.push(meetingDetails.ReminderFrequency.value);
      }
      if (meetingDetails.ReminderFrequencyTwo.value !== 0) {
        newReminderData.push(meetingDetails.ReminderFrequencyTwo.value);
      }
      if (meetingDetails.ReminderFrequencyThree.value !== 0) {
        newReminderData.push(meetingDetails.ReminderFrequencyThree.value);
      }
      if (
        MeetingData.meetingTitle === meetingDetails.MeetingTitle &&
        MeetingData.meetingType.pK_MTID ===
          meetingDetails.MeetingType.PK_MTID &&
        MeetingData.location === meetingDetails.Location &&
        MeetingData.description === meetingDetails.Description &&
        MeetingData.isTalkGroup === meetingDetails.groupChat &&
        MeetingData.videoCallURl === meetingDetails.Link &&
        compareMeetings(MeetingData.meetingDates, newArr) &&
        comparePKMRID(MeetingData.meetingReminders, newReminderData) &&
        MeetingData.notes === meetingDetails.Notes &&
        MeetingData.allowRSVP === meetingDetails.AllowRSPV &&
        MeetingData.notifyAdminOnRSVP ===
          meetingDetails.NotifyMeetingOrganizer &&
        MeetingData.meetingRecurrance.recurranceID ===
          meetingDetails.RecurringOptions.value &&
        MeetingData.meetingRecurrance.recurranceID ===
          meetingDetails.RecurringOptions.value &&
        MeetingData.isVideo === meetingDetails.IsVideoCall
      ) {
        setmeetingDetails(false);
        setorganizers(true);
      } else {
        dispatch(ShowNextConfirmationModal(true));
      }
    } catch (error) {}

    // dispatch(ShowNextConfirmationModal(true));
    // setmeetingDetails(false);
    // setorganizers(true);
  };

  useEffect(() => {
    dispatch(getAgendaAndVotingInfo_success([], ""));
    dispatch(GetCurrentAgendaDetails([]));
    dispatch(getAgendaVotingDetails_success([], ""));
    dispatch(saveFiles_success(null, ""));
    dispatch(saveAgendaVoting_success([], ""));
    dispatch(addUpdateAdvanceMeetingAgenda_success([], ""));
    dispatch(uploadDocument_success(null, ""));
    dispatch(getAllVotingResultDisplay_success([], ""));
    dispatch(getAgendaWithMeetingIDForImport_success(null, ""));
    dispatch(getAllMeetingForAgendaImport_success([], ""));
  }, []);

  console.log("MeetingDetailsMeetingDetails", meetingDetails);

  return (
    <section>
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
                    placeholder={t("Meeting-title") + "*"}
                    applyClass={"meetinInnerSearch"}
                    name={"Meetingtitle"}
                    labelClass="d-none"
                    maxLength={245}
                    change={HandleChange}
                    value={meetingDetails.MeetingTitle}
                    disable={
                      (Number(editorRole.status) === 9 ||
                        Number(editorRole.status) === 8 ||
                        Number(editorRole.status) === 10) &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
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
                        value={{
                          value: meetingDetails.MeetingType?.PK_MTID,
                          label: meetingDetails.MeetingType?.Type,
                        }}
                        onChange={handleMeetingSelectChange}
                        isSearchable={false}
                        isDisabled={
                          (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : editorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
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
                        {/* <span className={styles["steric"]}>*</span> */}
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
                        disable={
                          (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : editorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
                        maxLength={245}
                      />
                      {/* <Row>
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
                      </Row> */}
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
                    rows="2"
                    placeholder={t("Description")}
                    required={true}
                    name={"Description"}
                    change={HandleChange}
                    value={meetingDetails.Description}
                    // maxLength={300}
                    disable={
                      (Number(editorRole.status) === 9 ||
                        Number(editorRole.status) === 8 ||
                        Number(editorRole.status) === 10) &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                  />
                  {/* <Row>
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
                  </Row> */}
                </Col>
              </Row>
              <Row className="mt-3">
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
                            <Row key={index}>
                              <Col lg={12} md={12} sm={12} key={index}>
                                <Row className="mt-2">
                                  <Col lg={4} md={4} sm={12}>
                                    <DatePicker
                                      selected={data.selectedOption}
                                      value={data.dateForView}
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
                                      disabled={
                                        (Number(editorRole.status) === 9 ||
                                          Number(editorRole.status) === 8 ||
                                          Number(editorRole.status) === 10) &&
                                        editorRole.role === "Organizer" &&
                                        isEditMeeting === true
                                          ? true
                                          : (Number(editorRole.status) === 11 ||
                                              Number(editorRole.status) === 2 ||
                                              Number(editorRole.status) === 1 ||
                                              Number(editorRole.status) ===
                                                12 ||
                                              Number(editorRole.status) ===
                                                10) &&
                                            editorRole.role ===
                                              "Agenda Contributor" &&
                                            isEditMeeting === true
                                          ? true
                                          : false
                                      }
                                    />
                                    <p
                                      className={
                                        error && data.selectedOption === ""
                                          ? ` ${styles["errorMessage-inLogin"]} `
                                          : `${styles["errorMessage-inLogin_hidden"]}`
                                      }
                                    >
                                      {t("Scheduled-date-is-required")}
                                    </p>
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
                                      format="hh:mm A"
                                      selected={data.startDate}
                                      // onOpen={() => handleOpenStartTime(index)}
                                      value={data.startTime}
                                      editable={false}
                                      plugins={[<TimePicker hideSeconds />]}
                                      onChange={(date) =>
                                        handleStartDateChange(index, date)
                                      }
                                      disabled={
                                        (Number(editorRole.status) === 9 ||
                                          Number(editorRole.status) === 8 ||
                                          Number(editorRole.status) === 10) &&
                                        editorRole.role === "Organizer" &&
                                        isEditMeeting === true
                                          ? true
                                          : (Number(editorRole.status) === 11 ||
                                              Number(editorRole.status) === 2 ||
                                              Number(editorRole.status) === 1 ||
                                              Number(editorRole.status) ===
                                                12 ||
                                              Number(editorRole.status) ===
                                                10) &&
                                            editorRole.role ===
                                              "Agenda Contributor" &&
                                            isEditMeeting === true
                                          ? true
                                          : false
                                      }
                                    />
                                    <p
                                      className={
                                        error && data.startDate === ""
                                          ? ` ${styles["errorMessage-inLogin"]} `
                                          : `${styles["errorMessage-inLogin_hidden"]}`
                                      }
                                    >
                                      {t("start-time-is-required")}
                                    </p>
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
                                      arrowClassName="arrowClass"
                                      containerClassName="containerClassTimePicker"
                                      className="timePicker"
                                      disableDayPicker
                                      inputClass="inputTImeMeeting"
                                      calendar={calendarValue}
                                      locale={localValue}
                                      value={data.endTime}
                                      format="hh:mm A"
                                      // onOpen={() => handleOpenEndTime(index)}
                                      // onOpen={() => handleOpenStartTime()}
                                      selected={data.endDate}
                                      plugins={[<TimePicker hideSeconds />]}
                                      editable={false}
                                      onChange={(date) =>
                                        handleEndDateChange(index, date)
                                      }
                                      disabled={
                                        (Number(editorRole.status) === 9 ||
                                          Number(editorRole.status) === 8 ||
                                          Number(editorRole.status) === 10) &&
                                        editorRole.role === "Organizer" &&
                                        isEditMeeting === true
                                          ? true
                                          : (Number(editorRole.status) === 11 ||
                                              Number(editorRole.status) === 2 ||
                                              Number(editorRole.status) === 1 ||
                                              Number(editorRole.status) ===
                                                12 ||
                                              Number(editorRole.status) ===
                                                10) &&
                                            editorRole.role ===
                                              "Agenda Contributor" &&
                                            isEditMeeting === true
                                          ? true
                                          : false
                                      }
                                    />
                                    <p
                                      className={
                                        error && data.endDate === ""
                                          ? ` ${styles["errorMessage-inLogin"]} `
                                          : `${styles["errorMessage-inLogin_hidden"]}`
                                      }
                                    >
                                      {t("end-time-is-required")}
                                    </p>
                                  </Col>
                                  <Col
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    className="d-flex justify-content-end position-relative align-items-center"
                                  >
                                    {index === 0 ? null : Number(
                                        editorRole.status
                                      ) === 9 &&
                                      isEditMeeting ===
                                        true ? null : editorRole.role ===
                                        "Agenda Contributor" &&
                                      isEditMeeting === true ? null : (
                                      <img
                                        draggable={false}
                                        src={redcrossIcon}
                                        width="23px"
                                        alt=""
                                        height="23px"
                                        className={styles["Cross_icon_class"]}
                                        onClick={() => {
                                          HandleCancelFunction(index);
                                        }}
                                      />
                                    )}
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

              {(Number(editorRole.status) === 9 ||
                Number(editorRole.status) === 8 ||
                Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true ? (
                <></>
              ) : editorRole.role === "Agenda Contributor" &&
                isEditMeeting === true ? null : (
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
                                alt=""
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
              )}
            </Col>
            {/* Second Half */}
            <Col lg={5} md={5} sm={12} className="mt-3">
              <Row>
                <Col lg={4} md={4} sm={12}>
                  <Select
                    placeholder={t("Reminder*")}
                    onChange={handleReminderFrequency}
                    options={reminderFrequencyOne.map((data, index) => {
                      return {
                        ...data,
                        isDisabled:
                          data?.value ===
                            meetingDetails.ReminderFrequencyTwo?.value ||
                          data?.value ===
                            meetingDetails.ReminderFrequencyThree?.value,
                      };
                    })}
                    value={{
                      value: meetingDetails.ReminderFrequency.value,
                      label: meetingDetails.ReminderFrequency.label,
                    }}
                    isDisabled={
                      (Number(editorRole?.status) === 9 ||
                        Number(editorRole?.status) === 8 ||
                        Number(editorRole?.status) === 10) &&
                      editorRole?.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : editorRole?.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                    isSearchable={false}
                  />
                </Col>
                <Col lg={4} md={4} sm={12}>
                  <Select
                    placeholder={t("Reminder")}
                    onChange={handleReminderFrequencyTwo}
                    options={reminderFrequencyOne.map((data, index) => {
                      return {
                        ...data,
                        isDisabled:
                          data.value ===
                            meetingDetails.ReminderFrequency.value ||
                          data.value ===
                            meetingDetails.ReminderFrequencyThree.value,
                      };
                    })}
                    value={{
                      value: meetingDetails.ReminderFrequencyTwo.value,
                      label: meetingDetails.ReminderFrequencyTwo.label,
                    }}
                    isDisabled={
                      meetingDetails.ReminderFrequency.value === 0
                        ? true
                        : (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                    isSearchable={false}
                  />
                </Col>
                <Col lg={4} md={4} sm={12}>
                  <Select
                    placeholder={t("Reminder")}
                    onChange={handleReminderFrequencyThree}
                    options={reminderFrequencyOne.map((data, index) => {
                      return {
                        ...data,
                        isDisabled:
                          data.value ===
                            meetingDetails.ReminderFrequencyTwo.value ||
                          data.value === meetingDetails.ReminderFrequency.value,
                      };
                    })}
                    value={{
                      value: meetingDetails.ReminderFrequencyThree.value,
                      label: meetingDetails.ReminderFrequencyThree.label,
                    }}
                    isDisabled={
                      meetingDetails.ReminderFrequencyTwo.value === 0
                        ? true
                        : (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                    isSearchable={false}
                  />
                </Col>
                <Row>
                  <Col>
                    <p
                      className={
                        error && meetingDetails.ReminderFrequency.value === 0
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
                    rows="5"
                    name={"Notes"}
                    change={HandleChange}
                    placeholder={t("Note-for-this-meeting")}
                    required={true}
                    maxLength={145}
                    value={meetingDetails.Notes}
                    disable={
                      (Number(editorRole.status) === 9 ||
                        Number(editorRole.status) === 8 ||
                        Number(editorRole.status) === 10) &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                  />
                  {/* <Row>
                    <Col>
                      <p
                        className={
                          error && meetingDetails.Notes === ""
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {t("Please-enter-meeting-notes")}
                      </p>
                    </Col>
                  </Row> */}
                </Col>
              </Row>

              <Row className="mt-3">
                <Col lg={6} md={6} sm={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                      <Switch
                        onChange={handleRSPV}
                        checkedValue={meetingDetails.AllowRSPV}
                        disabled={
                          (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : editorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
                      />
                      <span className={styles["Create_group_chat_heading"]}>
                        {t("Allow-rsvp")}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 justify-content-start"
                    >
                      <Switch
                        onChange={handleNotifyOrganizers}
                        checkedValue={meetingDetails.NotifyMeetingOrganizer}
                        disabled={
                          (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : editorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
                      />
                      <span className={styles["Create_group_chat_heading"]}>
                        {t("Notify-meeting-organizer-when-members-rsvp")}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={6} md={6} sm={12}>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                      <Switch
                        onChange={handleGroupChat}
                        checkedValue={meetingDetails.groupChat}
                        disabled={
                          (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : editorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
                      />
                      <span className={styles["Create_group_chat_heading"]}>
                        {t("Create-group-chat")}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                      <Switch
                        onChange={handleVideoCameraButton}
                        checkedValue={meetingDetails.IsVideoCall}
                        disabled={
                          (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : editorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
                      />
                      <span className={styles["Create_group_chat_heading"]}>
                        {t("Video-session-enabled")}
                      </span>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col lg={1} md={1} sm={12} className="d-flex gap-3 m-0 p-0">
                      <Button
                        icon={
                          Loading ? (
                            <>
                              <Spinner
                                className={styles["checkEmailSpinner"]}
                              />
                            </>
                          ) : (
                            <>
                              <img
                                draggable={false}
                                src={
                                  meetingDetails.IsVideoCall
                                    ? whiteVideIcon
                                    : MeetingVideoChatIcon
                                }
                                width="22.32px"
                                height="14.75px"
                                alt=""
                                className={
                                  meetingDetails.IsVideoCall
                                    ? styles["Camera_icon_active_IconStyles"]
                                    : styles["Camera_icon"]
                                }
                              />
                            </>
                          )
                        }
                        className={
                          meetingDetails.IsVideoCall
                            ? styles["Camera_icon_Active"]
                            : styles["Button_not_active"]
                        }
                        disableBtn={
                          (Number(editorRole.status) === 9 ||
                            Number(editorRole.status) === 8 ||
                            Number(editorRole.status) === 10) &&
                          editorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : editorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
                        onClick={handleVideoCameraButton}
                      />
                    </Col>
                    <Col lg={11} md={11} sm={12}>
                      <TextField
                        disable={true}
                        placeholder={t("Paste-microsoft-team-zoom-link") + "*"}
                        applyClass={"meetinInnerSearch"}
                        labelClass="d-none"
                        name={"Link"}
                        // change={HandleChange}
                        value={
                          meetingDetails.IsVideoCall
                            ? t("Video-session-enabled")
                            : ""
                        }
                      />
                    </Col>
                  </Row> */}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["reccurring_heading"]}>
                    {t("Recurring")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <Select
                    onChange={handleRecurringSelectoptions}
                    options={recurringDropDown}
                    value={{
                      value: meetingDetails.RecurringOptions?.value,
                      label: meetingDetails.RecurringOptions?.label,
                    }}
                    isDisabled={
                      (Number(editorRole.status) === 9 ||
                        Number(editorRole.status) === 8 ||
                        Number(editorRole.status) === 10) &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                    styles={customStyles}
                    menuPlacement="top" // Set menuPlacement to 'top' to open the dropdown upwards
                    menuPortalTarget={document.body}
                    isSearchable={false}
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
            onClick={handleCancelMeetingButton}
          />
          {(Number(editorRole.status) === 9 ||
            Number(editorRole.status) === 8 ||
            Number(editorRole.status) === 10) &&
          editorRole.role === "Organizer" &&
          isEditMeeting === true ? null : editorRole.role ===
              "Agenda Contributor" && isEditMeeting === true ? null : Number(
              currentMeeting
            ) === 0 ? (
            <>
              <Button
                text={t("Next")}
                className={styles["Update_Next"]}
                onClick={SaveMeeting}
              />
            </>
          ) : (
            <>
              <Button
                text={t("Next")}
                className={styles["Update_Next"]}
                onClick={UpdateMeetings}
              />
            </>
          )}
          {Number(currentMeeting) !== 0 && (
            <>
              {/* <Button
                disableBtn={Number(currentMeeting) === 0 ? true : false}
                text={t("Next")}
                className={styles["Published"]}
                onClick={handleUpdateNext}
              /> */}

              {Number(editorRole.status) === 11 ||
              Number(editorRole.status) === 12 ? (
                <Button
                  disableBtn={true}
                  text={t("Publish")}
                  className={styles["Update_Next"]}
                  onClick={handlePublish}
                />
              ) : isEditMeeting === true ? null : (
                <Button
                  disableBtn={true}
                  text={t("Publish")}
                  className={styles["Update_Next"]}
                  onClick={handlePublish}
                />
              )}
            </>
          )}
        </Col>
      </Row>

      {cancelModalMeetingDetails && (
        <CancelButtonModal
          setSceduleMeeting={setSceduleMeeting}
          setMeetingDetails={setMeetingDetails}
          setRows={setRows}
        />
      )}
      {nextConfirmModal && (
        <NextModal
          setmeetingDetails={setmeetingDetails}
          setorganizers={setorganizers}
          flag={1}
        />
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default MeetingDetails;
