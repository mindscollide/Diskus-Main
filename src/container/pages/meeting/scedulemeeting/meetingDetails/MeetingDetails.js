import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./MeetingDetails.module.css";
import { useTranslation } from "react-i18next";
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
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Switch,
  TextField,
  Notification,
} from "../../../../../components/elements";
import desh from "../../../../../assets/images/desh.svg";
import { validateInput } from "../../../../../commen/functions/regex";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  SaveMeetingDetialsNewApiFunction,
  clearResponseNewMeetingReducerMessage,
  showCancelModalmeetingDeitals,
} from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  incrementDateforPropsedMeeting,
} from "../../../../../commen/functions/time_formatter";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { MeetingContext } from "../../../../../context/MeetingContext";

const MeetingDetails = ({
  setorganizers,
  setmeetingDetails,
  setSceduleMeeting,
  setCurrentMeetingID,
  currentMeeting,
  editorRole,
  isEditMeeting,
  setDataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setGoBackCancelModal } = useContext(MeetingContext);
  const nextConfirmModal = useSelector(
    (state) => state.NewMeetingreducer.nextConfirmModal
  );
  // const cancelModalMeetingDetails = useSelector(
  //   (state) => state.NewMeetingreducer.cancelModalMeetingDetails
  // );
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
  const [publishedFlag, setPublishedFlag] = useState(false);

  console.log(publishedFlag, "publishedFlagpublishedFlag");
  console.log(
    editorRole,
    currentMeeting,
    "editorRoleeditorRoleeditorRoleeditorRole"
  );

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [meetingDetails, setMeetingDetails] = useState({
    MeetingTitle: "",
    MeetingType: {
      PK_MTID: 0,
      Type: "",
    },
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
    AllowRSPV: true,
    NotifyMeetingOrganizer: true,
    RecurringOptions: {
      value: 0,
      label: "",
    },
    IsVideoCall: true,
    IsPublished: false,
  });

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
        IsPublished: false,
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

  console.log("MeetingDetailsMeetingDetails", meetingDetails);

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
          showMessage(
            t(
              "Selected-start-time-should-not-be-less-than-the-previous-endTime"
            ),
            "error",
            setOpen
          );
          updatedRows[index].startDate = getStartTime?.formattedTime;
          updatedRows[index].startTime = getStartTime?.newFormatTime;
          setRows(updatedRows);
          return;
        } else {
          if (
            updatedRows[index].endDate !== "" &&
            formattedTime >= updatedRows[index].endDate
          ) {
            showMessage(
              t("Selected-start-time-should-not-be-greater-than-the-endTime"),
              "error",
              setOpen
            );
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
          showMessage(
            t("Selected-start-time-should-not-be-greater-than-the-endTime"),
            "error",
            setOpen
          );
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
          showMessage(
            t("Selected-end-time-should-not-be-less-than-the-previous-one"),
            "error",
            setOpen
          );
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
          showMessage(
            t("Selected-end-time-should-not-be-less-than-start-time"),
            "error",
            setOpen
          );
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

  const changeDateStartHandler = (date, index) => {
    try {
      let newDate = new Date(date);
      let DateDate = new DateObject(date).format("YYYYMMDD");
      const updatedRows = [...rows];

      updatedRows[index].selectedOption = DateDate;
      updatedRows[index].dateForView = newDate;
      setRows(updatedRows);
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
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
      });
    });
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      newArr.length > 0 &&
      newReminderData.length > 0
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
          IsPublished: meetingDetails.IsPublished,
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
      });
    });

    // Sorting the newArr array
    newArr.sort((a, b) => {
      if (a.MeetingDate !== b.MeetingDate) {
        return a.MeetingDate.localeCompare(b.MeetingDate);
      } else if (a.StartTime !== b.StartTime) {
        return a.StartTime.localeCompare(b.StartTime);
      } else {
        return a.EndTime.localeCompare(b.EndTime);
      }
    });

    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      areAllValuesNotEmpty(newArr) &&
      newReminderData.length > 0
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
          IsPublished: meetingDetails.IsPublished,
          IsTalkGroup: meetingDetails.groupChat,
          OrganizationId: organizationID,
          MeetingDates: newArr,
          MeetingReminders: newReminderData,
          Notes: meetingDetails.Notes,
          AllowRSVP: meetingDetails.AllowRSPV,
          NotifyOrganizerOnRSVP: meetingDetails.NotifyMeetingOrganizer,
          ReucurringMeetingID: recurringMeetingID,
          VideoURL: meetingDetails.Link,
          MeetingStatusID: publishedFlag ? 1 : 11,
        },
      };
      console.log(data, "newArrnewArrnewArrnewArr");
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

    // Push reminder frequencies if they are not zero
    if (meetingDetails.ReminderFrequency.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequency.value);
    }
    if (meetingDetails.ReminderFrequencyTwo.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyTwo.value);
    }
    if (meetingDetails.ReminderFrequencyThree.value !== 0) {
      newReminderData.push(meetingDetails.ReminderFrequencyThree.value);
    }

    // Process each row to construct the newArr
    rows.forEach((data) => {
      const convertedStartDate = createConvert(
        data.selectedOption + data.startDate
      );
      const convertedEndDate = createConvert(
        data.selectedOption + data.endDate
      );

      newArr.push({
        MeetingDate: convertedStartDate.slice(0, 8), // YYYYMMDD
        StartTime: convertedStartDate.slice(8, 14), // HHmmss
        EndTime: convertedEndDate.slice(8, 14), // HHmmss
      });
    });

    // Sorting the newArr array based on MeetingDate, StartTime, and EndTime
    newArr.sort((a, b) => {
      const dateComparison = a.MeetingDate.localeCompare(b.MeetingDate);
      if (dateComparison !== 0) {
        return dateComparison;
      }

      const startTimeComparison = a.StartTime.localeCompare(b.StartTime);
      if (startTimeComparison !== 0) {
        return startTimeComparison;
      }

      return a.EndTime.localeCompare(b.EndTime);
    });

    let recurringMeetingID =
      meetingDetails.RecurringOptions.value !== 0
        ? meetingDetails.RecurringOptions.value
        : 1;

    // Check conditions and proceed if valid
    if (
      meetingDetails.MeetingTitle !== "" &&
      meetingDetails.MeetingType !== 0 &&
      areAllValuesNotEmpty(newArr) &&
      newReminderData.length > 0
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
          IsPublished: meetingDetails.IsPublished,
          IsTalkGroup: meetingDetails.groupChat,
          OrganizationId: organizationID,
          MeetingDates: newArr,
          MeetingReminders: newReminderData,
          Notes: meetingDetails.Notes,
          AllowRSVP: meetingDetails.AllowRSPV,
          NotifyOrganizerOnRSVP: meetingDetails.NotifyMeetingOrganizer,
          ReucurringMeetingID: recurringMeetingID,
          VideoURL: meetingDetails.Link,
          MeetingStatusID: publishedFlag ? 1 : 11,
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
      console.log("newArrnewArrnewArrnewArr", data);
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

  const handleNotifyOrganizers = () => {
    if (meetingDetails.AllowRSPV === true) {
      setMeetingDetails({
        ...meetingDetails,
        NotifyMeetingOrganizer: !meetingDetails.NotifyMeetingOrganizer,
      });
    }
  };

  const handleRSPV = () => {
    // Toggle AllowRSPV
    const newAllowRSPV = !meetingDetails.AllowRSPV;

    // Set AllowRSPV to its new value
    setMeetingDetails({
      ...meetingDetails,
      AllowRSPV: newAllowRSPV,
      // If AllowRSPV is set to false, also set NotifyMeetingOrganizer to false
      NotifyMeetingOrganizer: newAllowRSPV
        ? meetingDetails.NotifyMeetingOrganizer
        : false,
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
  // const handleCancelMeetingButton = () => {
  //   dispatch(showCancelModalmeetingDeitals(true));
  // };

  //Meeting Type Drop Down Data
  useEffect(() => {
    try {
      if (
        getALlMeetingTypes?.meetingTypes !== null &&
        getALlMeetingTypes?.meetingTypes !== undefined
      ) {
        let Newdata = [];
        getALlMeetingTypes?.meetingTypes.forEach((data, index) => {
          Newdata.push({
            value: data.pK_MTID,
            label: data.type,
          });
          setMeetingDetails({
            ...meetingDetails,
            MeetingType: {
              PK_MTID: getALlMeetingTypes?.meetingTypes[0].pK_MTID,
              Type: getALlMeetingTypes?.meetingTypes[0].type,
            },
          });
        });
        setmeetingTypeDropdown(Newdata);
      }
    } catch (error) {}
  }, [getALlMeetingTypes?.meetingTypes]);

  //Reminder Frequency Drop Down Data
  useEffect(() => {
    try {
      if (
        getAllReminderFrequency.meetingReminders !== null &&
        getAllReminderFrequency.meetingReminders !== undefined
      ) {
        let Newdata = [];
        getAllReminderFrequency.meetingReminders.forEach((data, index) => {
          if (Number(data.pK_MRID) === 2) {
            setMeetingDetails({
              ...meetingDetails,
              ReminderFrequency: {
                label: data.description,
                value: data.pK_MRID,
              },
            });
          }
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
        recurring.meetingRecurrances.forEach((data, index) => {
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
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== undefined &&
      ResponseMessage !== null
    ) {
      showMessage(ResponseMessage, "success", setOpen);
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
        let PublishedMeetingStatus = getAllMeetingDetails.isPublished;
        let MeetingData = getAllMeetingDetails.advanceMeetingDetails;
        console.log(MeetingData, "MeetingDataMeetingData");
        let isPublishedState = getAllMeetingDetails.isPublished;
        let getmeetingDates = MeetingData.meetingDates;
        let getmeetingRecurrance = MeetingData.meetingRecurrance;
        let getmeetingReminders = MeetingData.meetingReminders;
        let getmeetingType = MeetingData.meetingType;
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
          IsPublished: isPublishedState,
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
        setPublishedFlag(PublishedMeetingStatus);
      } else {
      }
    } catch {}
  }, [getAllMeetingDetails, currentMeeting]);

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
                    label={
                      <span className={styles["Meeting_type_heading"]}>
                        {t("Meeting-title")}
                        <span className={styles["steric"]}>*</span>
                      </span>
                    }
                    placeholder={t("Meeting-title") + "*"}
                    applyClass={"meetinInnerSearch"}
                    name={"Meetingtitle"}
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
                        {t("Location-Videourl")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TextField
                        placeholder={t("Location-Videourl")}
                        applyClass={"meetinInnerSearch"}
                        name={"Location"}
                        labelclass="d-none"
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
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex flex-column flex-wrap"
                  >
                    <TextField
                      label={
                        <span className={styles["Meeting_type_heading"]}>
                          {t("Add-notes")}
                        </span>
                      }
                      applyClass="text-area-create-meeting"
                      type="text"
                      as={"textarea"}
                      rows="5"
                      name={"Notes"}
                      change={HandleChange}
                      placeholder={t("Note-for-this-meeting")}
                      required={true}
                      maxLength={1100}
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
                  </Col>
                </Row>
              </Row>
              <Row className="mt-3">
                <Col lg={4} md={4} sm={12}>
                  <span className={styles["Scedule_heading"]}>
                    {t("Scheduled-on")}
                    <span className={styles["steric"]}>*</span>
                  </span>
                </Col>
                <Col lg={4} md={4} sm={12}>
                  <span className={styles["Scedule_heading"]}>
                    {t("Start-time")}
                    <span className={styles["steric"]}>*</span>
                  </span>
                </Col>
                <Col lg={4} md={4} sm={12}>
                  <span className={styles["Scedule_heading"]}>
                    {t("End-time")}
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
                                      onFocusedDateChange={(value) =>
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
                                  <Col lg={3} md={3} sm={12}>
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
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Meeting_type_heading"]}>
                    {t("Add-reminders")}
                  </span>
                </Col>
              </Row>
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
                    isDisabled={true}
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
                    label={
                      <span className={styles["Meeting_type_heading"]}>
                        {t("Add-description")}
                      </span>
                    }
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
                        labelclass="d-none"
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
                    // isDisabled={true} THIS IS TO BE DONE, When the build is to be done on production and comment the above isDisabled
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
            onClick={() => setGoBackCancelModal(true)}
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
              {(Number(editorRole.status) === 11 ||
                Number(editorRole.status) === 12) && (
                <>
                  {editorRole.role === "Organizer" && (
                    <Button
                      disableBtn={!meetingDetails.IsPublished}
                      text={t("Publish")}
                      className={styles["Update_Next"]}
                      onClick={handlePublish}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Col>
      </Row>

      <CancelButtonModal
        setSceduleMeeting={setSceduleMeeting}
        setMeetingDetails={setMeetingDetails}
        setRows={setRows}
        flag={true}
      />
      {nextConfirmModal && (
        <NextModal
          setmeetingDetails={setmeetingDetails}
          setorganizers={setorganizers}
          flag={1}
        />
      )}
      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default MeetingDetails;
