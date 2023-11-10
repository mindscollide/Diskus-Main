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
import { Col, Row, Spinner } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Notification,
} from "../../../../../components/elements";
import desh from "../../../../../assets/images/desh.svg";
import {
  regexOnlyCharacters,
  urlPatternValidation,
  validateInput,
} from "../../../../../commen/functions/regex";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  ClearMessegeMeetingdetails,
  FetchMeetingURLApi,
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  SaveMeetingDetialsNewApiFunction,
  ShowNextConfirmationModal,
  showCancelModalmeetingDeitals,
} from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  convertGMTDateintoUTC,
  resolutionResultTable,
} from "../../../../../commen/functions/date_formater";
import CancelButtonModal from "./CancelButtonModal/CancelButtonModal";
import NextModal from "./NextModal/NextModal";

const MeetingDetails = ({
  setorganizers,
  setmeetingDetails,
  setSceduleMeeting,
  setCurrentMeetingID,
  currentMeeting,
  ediorRole,
  setEditMeeting,
  isEditMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [meetingTypeDropdown, setmeetingTypeDropdown] = useState([]);
  const [reminderFrequencyOne, setReminderFrequencyOne] = useState([]);
  const [recurringDropDown, setRecurringDropDown] = useState([]);
  const [flag, setFlag] = useState(1);

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
  const [meetingDate, setMeetingDate] = useState("");
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
      updatedRows[index].startTime = newDate;
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
      updatedRows[index].endTime = newDate;
      setRows(updatedRows);
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //Onchange Function For DatePicker inAdd datess First
  const changeDateStartHandler = (date, index) => {
    let newDate = new Date(date);
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = convertGMTDateintoUTC(date);
    console.log(DateDate, "DateDateDateDateDateDate");
    setMeetingDate(meetingDateValueFormat);
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = DateDate.slice(0, 8);
    updatedRows[index].dateForView = newDate;
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

  const handlePublish = () => {
    //Enable the Error Handling From here
    // setSaveMeeting(!saveMeeting);
    let newArr = [];
    let newReminderData = [];
    if (meetingDetails.ReminderFrequency !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequency);
    }
    if (meetingDetails.ReminderFrequencyTwo !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyTwo);
    }
    if (meetingDetails.ReminderFrequencyThree !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyThree);
    }
    rows.map((data, index) => {
      newArr.push({
        MeetingDate: data.selectedOption,
        StartTime: data.startDate,
        EndTime: data.endDate,
      });
    });

    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      meetingDetails.Location !== "" &&
      meetingDetails.Description !== "" &&
      newArr.length > 0 &&
      newReminderData.length > 0 &&
      meetingDetails.Notes !== ""
    ) {
      console.log("test");
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
      console.log("test", data);

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
          meetingDetails
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

    console.log(newReminderData, "newReminderDatanewReminderData");

    rows.map((data, index) => {
      newArr.push({
        MeetingDate: data.selectedOption,
        StartTime: data.startDate,
        EndTime: data.endDate,
      });
    });
    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      meetingDetails.Location !== "" &&
      meetingDetails.Description !== "" &&
      newArr.length > 0 &&
      newReminderData.length > 0 &&
      meetingDetails.Notes !== ""
    ) {
      let organizationID = JSON.parse(localStorage.getItem("organizationID"));
      // Check if RecurringOptions.value is defined and use it
      let recurringMeetingID =
        meetingDetails.RecurringOptions.value !== 0
          ? meetingDetails.RecurringOptions.value
          : 1;

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
          ReucurringMeetingID: recurringMeetingID,
          VideoURL: meetingDetails.Link,
          MeetingStatusID: 11,
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
          meetingDetails
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
    rows.map((data, index) => {
      newArr.push({
        MeetingDate: data.selectedOption,
        StartTime: data.startDate,
        EndTime: data.endDate,
      });
    });
    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      meetingDetails.Location !== "" &&
      meetingDetails.Description !== "" &&
      newArr.length > 0 &&
      newReminderData.length > 0 &&
      meetingDetails.Notes !== ""
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
          ReucurringMeetingID: meetingDetails.RecurringOptions.value,
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
          meetingDetails
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

    let Data = {
      MeetingID: currentMeeting,
    };
    dispatch(FetchMeetingURLApi(Data, navigate, t));
  };

  useEffect(() => {
    if (
      NewMeetingreducer.getmeetingURL !== null &&
      NewMeetingreducer.getmeetingURL !== undefined
    ) {
      setMeetingDetails({
        ...meetingDetails,
        Link: NewMeetingreducer.getmeetingURL.videoURL,
      });
    }
  }, [NewMeetingreducer.getmeetingURL]);

  //funciton cancel button
  const handleCancelMeetingButton = () => {
    dispatch(showCancelModalmeetingDeitals(true));
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

  // UseEffect to set the default selected value when recurringDropDown changes
  useEffect(() => {
    if (recurringDropDown.length > 0) {
      // Set the default value to the first item in the recurringDropDown
      handleRecurringSelectoptions({
        value: recurringDropDown[0].value,
        label: recurringDropDown[0].label,
      });
    }
  }, [recurringDropDown]);

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
    console.log(
      NewMeetingreducer.getAllMeetingDetails,
      "getAllMeetingDetailsgetAllMeetingDetailsgetAllMeetingDetails"
    );
    try {
      if (
        NewMeetingreducer.getAllMeetingDetails !== null &&
        NewMeetingreducer.getAllMeetingDetails !== undefined
      ) {
        // setEditMeeting(true);
        let MeetingData =
          NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails;
        let getmeetingDates = MeetingData.meetingDates;
        let getmeetingRecurrance = MeetingData.meetingRecurrance;
        let getmeetingReminders = MeetingData.meetingReminders;
        let getmeetingStatus = MeetingData.meetingStatus;
        let getmeetingType = MeetingData.meetingType;
        let wasPublishedFlag = MeetingData.wasMeetingPublished;
        console.log(getmeetingType, "getmeetingTypegetmeetingType");
        // setCurrentMeetingID(getmeetingType.pK_MTID);
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
              selectedOption: data.meetingDate,
              startDate: data.startTime,
              endDate: data.endTime,
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
      }
    } catch {}
  }, [NewMeetingreducer.getAllMeetingDetails]);
  console.log("meetingDetailsmeetingDetails", meetingDetails);

  const handleUpdateNext = () => {
    try {
      let MeetingData =
        NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails;
      console.log(MeetingData, "MeetingDataMeetingDataMeetingData");

      let getmeetingType = MeetingData.meetingType;

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

      if (MeetingData.meetingTitle !== meetingDetails.MeetingTitle) {
        console.log("Title does not match");
      }

      if (getmeetingType.PK_MTID !== getmeetingType.PK_MTID) {
        console.log("PK_MTID does not match");
      }

      if (getmeetingType.Type !== meetingDetails.MeetingType.Type) {
        console.log("MeetingType Type does not match");
      }

      if (MeetingData.location !== meetingDetails.Location) {
        console.log("Location does not match");
      }

      if (MeetingData.description !== meetingDetails.Description) {
        console.log("Description does not match");
      }

      if (MeetingData.isTalkGroup !== meetingDetails.groupChat) {
        console.log("IsTalkGroup does not match");
      }

      if (MeetingData.videoCallURl !== meetingDetails.Link) {
        console.log("VideoCallURL does not match");
      }

      if (JSON.stringify(MeetingData.meetingDates) !== JSON.stringify(newArr)) {
        console.log("MeetingDates do not match");
      }

      if (
        JSON.stringify(MeetingData.meetingReminders) !==
        JSON.stringify(newReminderData)
      ) {
        console.log("MeetingReminders do not match");
      }

      if (MeetingData.notes !== meetingDetails.Notes) {
        console.log("Notes do not match");
      }

      if (MeetingData.allowRSVP !== meetingDetails.AllowRSPV) {
        console.log("AllowRSVP does not match");
      }

      if (
        MeetingData.notifyAdminOnRSVP !== meetingDetails.NotifyMeetingOrganizer
      ) {
        console.log("NotifyAdminOnRSVP does not match");
      }

      if (
        MeetingData.meetingRecurrance !== meetingDetails.RecurringOptions.value
      ) {
        console.log("MeetingRecurrance does not match");
      }

      if (MeetingData.isVideo !== meetingDetails.IsVideoCall) {
        console.log("IsVideo does not match");
      }

      if (
        MeetingData.meetingTitle === meetingDetails.MeetingTitle &&
        getmeetingType.PK_MTID === getmeetingType.PK_MTID &&
        MeetingData.location === meetingDetails.Location &&
        MeetingData.description === meetingDetails.Description &&
        MeetingData.isTalkGroup === meetingDetails.groupChat &&
        MeetingData.videoCallURl === meetingDetails.Link &&
        MeetingData.meetingDates === newArr.MeetingDate &&
        MeetingData.meetingReminders === newReminderData &&
        MeetingData.notes === meetingDetails.Notes &&
        MeetingData.allowRSVP === meetingDetails.AllowRSPV &&
        MeetingData.notifyAdminOnRSVP ===
          meetingDetails.NotifyMeetingOrganizer &&
        MeetingData.meetingRecurrance ===
          meetingDetails.RecurringOptions.value &&
        MeetingData.isVideo === meetingDetails.IsVideoCall
      ) {
        setmeetingDetails(false);
        setorganizers(true);
      } else {
        dispatch(ShowNextConfirmationModal(true));
      }
    } catch (error) {
      console.error("Error in handleUpdateNext:", error);
    }
  };

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
                    placeholder={t("Meeting-title")}
                    applyClass={"meetinInnerSearch"}
                    name={"Meetingtitle"}
                    labelClass="d-none"
                    change={HandleChange}
                    value={meetingDetails.MeetingTitle}
                    disable={
                      (Number(ediorRole.status) === 9 ||
                        Number(ediorRole.status) === 8 ||
                        Number(ediorRole.status) === 10) &&
                      ediorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : ediorRole.role === "Agenda Contributor" &&
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
                          (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : ediorRole.role === "Agenda Contributor" &&
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
                        disable={
                          (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : ediorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
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
                    disable={
                      (Number(ediorRole.status) === 9 ||
                        Number(ediorRole.status) === 8 ||
                        Number(ediorRole.status) === 10) &&
                      ediorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : ediorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
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
                      <Switch
                        onChange={handleGroupChat}
                        checkedValue={meetingDetails.groupChat}
                        disabled={
                          (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : ediorRole.role === "Agenda Contributor" &&
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
                <Col lg={8} md={8} sm={12}>
                  <Row>
                    <Col lg={1} md={1} sm={12} className="d-flex gap-3 m-0 p-0">
                      <Button
                        icon={
                          NewMeetingreducer.Loading ? (
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
                          (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : ediorRole.role === "Agenda Contributor" &&
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
                        change={HandleChange}
                        value={
                          meetingDetails.IsVideoCall ? meetingDetails.Link : ""
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
                                      onChange={(value) =>
                                        changeDateStartHandler(value, index)
                                      }
                                      disabled={
                                        (Number(ediorRole.status) === 9 ||
                                          Number(ediorRole.status) === 8 ||
                                          Number(ediorRole.status) === 10) &&
                                        ediorRole.role === "Organizer" &&
                                        isEditMeeting === true
                                          ? true
                                          : (Number(ediorRole.status) === 11 ||
                                              Number(ediorRole.status) === 2 ||
                                              Number(ediorRole.status) === 1 ||
                                              Number(ediorRole.status) === 12 ||
                                              Number(ediorRole.status) ===
                                                10) &&
                                            ediorRole.role ===
                                              "Agenda Contributor" &&
                                            isEditMeeting === true
                                          ? true
                                          : false
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
                                      disableDayPicker
                                      inputClass="inputTImeMeeting"
                                      calendar={calendarValue}
                                      locale={localValue}
                                      format="HH:mm A"
                                      selected={
                                        currentMeeting === 0
                                          ? data.startDate
                                          : rows.startDate
                                      }
                                      value={data.startTime}
                                      plugins={[<TimePicker hideSeconds />]}
                                      onChange={(date) =>
                                        handleStartDateChange(index, date)
                                      }
                                      disabled={
                                        (Number(ediorRole.status) === 9 ||
                                          Number(ediorRole.status) === 8 ||
                                          Number(ediorRole.status) === 10) &&
                                        ediorRole.role === "Organizer" &&
                                        isEditMeeting === true
                                          ? true
                                          : (Number(ediorRole.status) === 11 ||
                                              Number(ediorRole.status) === 2 ||
                                              Number(ediorRole.status) === 1 ||
                                              Number(ediorRole.status) === 12 ||
                                              Number(ediorRole.status) ===
                                                10) &&
                                            ediorRole.role ===
                                              "Agenda Contributor" &&
                                            isEditMeeting === true
                                          ? true
                                          : false
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
                                      value={data.endTime}
                                      format="HH:mm A"
                                      selected={data.endDate}
                                      plugins={[<TimePicker hideSeconds />]}
                                      onChange={(date) =>
                                        handleEndDateChange(index, date)
                                      }
                                      disabled={
                                        (Number(ediorRole.status) === 9 ||
                                          Number(ediorRole.status) === 8 ||
                                          Number(ediorRole.status) === 10) &&
                                        ediorRole.role === "Organizer" &&
                                        isEditMeeting === true
                                          ? true
                                          : (Number(ediorRole.status) === 11 ||
                                              Number(ediorRole.status) === 2 ||
                                              Number(ediorRole.status) === 1 ||
                                              Number(ediorRole.status) === 12 ||
                                              Number(ediorRole.status) ===
                                                10) &&
                                            ediorRole.role ===
                                              "Agenda Contributor" &&
                                            isEditMeeting === true
                                          ? true
                                          : false
                                      }
                                    />
                                  </Col>
                                  <Col
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    className="d-flex justify-content-end position-relative align-items-center"
                                  >
                                    {index === 0 ? null : Number(
                                        ediorRole.status
                                      ) === 9 &&
                                      isEditMeeting ===
                                        true ? null : ediorRole.role ===
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

              {(Number(ediorRole.status) === 9 ||
                Number(ediorRole.status) === 8 ||
                Number(ediorRole.status) === 10) &&
              ediorRole.role === "Organizer" &&
              isEditMeeting === true ? (
                <></>
              ) : ediorRole.role === "Agenda Contributor" &&
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
                    options={reminderFrequencyOne}
                    value={{
                      value: meetingDetails.ReminderFrequency.value,
                      label: meetingDetails.ReminderFrequency.label,
                    }}
                    isDisabled={
                      (Number(ediorRole.status) === 9 ||
                        Number(ediorRole.status) === 8 ||
                        Number(ediorRole.status) === 10) &&
                      ediorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : ediorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                  />
                </Col>
                <Col lg={4} md={4} sm={12}>
                  <Select
                    placeholder={t("Reminder")}
                    onChange={handleReminderFrequencyTwo}
                    options={reminderFrequencyOne}
                    value={{
                      value: meetingDetails.ReminderFrequencyTwo.value,
                      label: meetingDetails.ReminderFrequencyTwo.label,
                    }}
                    isDisabled={
                      meetingDetails.ReminderFrequency.value === 0
                        ? true
                        : (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                        ? true
                        : ediorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                  />
                </Col>
                <Col lg={4} md={4} sm={12}>
                  <Select
                    placeholder={t("Reminder")}
                    onChange={handleReminderFrequencyThree}
                    options={reminderFrequencyOne}
                    value={{
                      value: meetingDetails.ReminderFrequencyThree.value,
                      label: meetingDetails.ReminderFrequencyThree.label,
                    }}
                    isDisabled={
                      meetingDetails.ReminderFrequencyTwo.value === 0
                        ? true
                        : (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                        ? true
                        : ediorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
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
                    disable={
                      (Number(ediorRole.status) === 9 ||
                        Number(ediorRole.status) === 8 ||
                        Number(ediorRole.status) === 10) &&
                      ediorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : ediorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
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
                      <Switch
                        onChange={handleRSPV}
                        checkedValue={meetingDetails.AllowRSPV}
                        disabled={
                          (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : ediorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
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
                        onChange={handleNotifyOrganizers}
                        checkedValue={meetingDetails.NotifyMeetingOrganizer}
                        disabled={
                          (Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 8 ||
                            Number(ediorRole.status) === 10) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true
                            ? true
                            : ediorRole.role === "Agenda Contributor" &&
                              isEditMeeting === true
                            ? true
                            : false
                        }
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
                    onChange={handleRecurringSelectoptions}
                    options={recurringDropDown}
                    value={{
                      value: meetingDetails.RecurringOptions?.value,
                      label: meetingDetails.RecurringOptions?.label,
                    }}
                    isDisabled={
                      (Number(ediorRole.status) === 9 ||
                        Number(ediorRole.status) === 8 ||
                        Number(ediorRole.status) === 10) &&
                      ediorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : ediorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : false
                    }
                    styles={customStyles}
                    menuPlacement="top" // Set menuPlacement to 'top' to open the dropdown upwards
                    menuPortalTarget={document.body}
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
          {(Number(ediorRole.status) === 9 ||
            Number(ediorRole.status) === 8 ||
            Number(ediorRole.status) === 10) &&
          ediorRole.role === "Organizer" &&
          isEditMeeting === true ? null : ediorRole.role ===
              "Agenda Contributor" && isEditMeeting === true ? null : Number(
              currentMeeting
            ) === 0 ? (
            <>
              <Button
                text={t("Save")}
                className={styles["Published"]}
                onClick={SaveMeeting}
              />
            </>
          ) : (
            <>
              <Button
                text={t("Update")}
                className={styles["Published"]}
                onClick={UpdateMeetings}
              />
            </>
          )}

          <Button
            disableBtn={Number(currentMeeting) === 0 ? true : false}
            text={t("Next")}
            className={styles["Published"]}
            onClick={handleUpdateNext}
          />
          {(Number(ediorRole.status) === 9 ||
            Number(ediorRole.status) === 8 ||
            Number(ediorRole.status) === 10) &&
          ediorRole.role === "Organizer" &&
          isEditMeeting === true ? null : ediorRole.role ===
              "Agenda Contributor" && isEditMeeting === true ? null : (
            <Button
              disableBtn={
                Number(currentMeeting) === 0 && publishedFlag === true
                  ? true
                  : false
              }
              text={t("Publish")}
              className={styles["Update_Next"]}
              onClick={handlePublish}
            />
          )}
        </Col>
      </Row>

      {NewMeetingreducer.cancelModalMeetingDetails && (
        <CancelButtonModal
          setSceduleMeeting={setSceduleMeeting}
          setMeetingDetails={setMeetingDetails}
          setRows={setRows}
        />
      )}
      {NewMeetingreducer.nextConfirmModal && (
        <NextModal
          setmeetingDetails={setmeetingDetails}
          setorganizers={setorganizers}
          flag={flag}
        />
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default MeetingDetails;
