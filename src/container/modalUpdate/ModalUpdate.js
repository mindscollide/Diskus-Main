import React, { useState, useEffect } from "react";
import "./ModalUpdate.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import {
  convertTimetoGMT,
  createConvert,
  EditmeetingDateFormat,
  RemoveTimeDashes,
} from "../../commen/functions/date_formater";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import {
  TextField,
  Button,
  Modal,
  TimePickers,
  CustomDatePicker,
  SelectBox,
  Accordian,
  EmployeeCard,
  InputSearchFilter,
  Notification,
  Checkbox,
  Loader,
  MultiDatePicker,
} from "./../../components/elements";
import { FileUploadToDo } from "../../store/actions/Upload_action";
import {
  addMinutesofMeetings,
  HideMinuteMeetingMessage,
} from "../../store/actions/AddMinutesofMeeting_action";
import ErrorBar from "./../../container/authentication/sign_up/errorbar/ErrorBar";
import userImage from "../../assets/images/user.png";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import CustomUpload from "../../components/elements/upload/Upload";
import { CameraVideo } from "react-bootstrap-icons";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useSelector, useDispatch } from "react-redux";
import {
  allAssignessList,
  UpdateMeeting,
  cleareAssigneesState,
  CancelMeeting,
  GetAllReminders,
} from "../../store/actions/Get_List_Of_Assignees";
import { DownloadFile } from "../../store/actions/Download_action";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import InputIcon from "react-multi-date-picker/components/input_icon";
import TextFieldTime from "../../components/elements/input_field_time/Input_field";

const ModalUpdate = ({ editFlag, setEditFlag, ModalTitle, checkFlag }) => {
  //For Localization
  const { t } = useTranslation();

  let currentLanguage = localStorage.getItem("i18nextLng");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignees, uploadReducer, minuteofMeetingReducer, CommitteeReducer } =
    useSelector((state) => state);
  let OrganizationId = localStorage.getItem("organizationID");
  const [isMinutes, setIsMinutes] = useState(false);
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const [isPublishMeeting, setIsPublishMeeting] = useState(false);
  const [endMeetingStatus, setEndMeetingStatus] = useState(false);
  const [endMeetingStatus2, setEndMeetingStatus2] = useState(false);
  const [minutesOftheMeatingStatus, setMinutesOftheMeatingStatus] =
    useState(false);
  const [endMeetingStatusForMinutes, setEndMeetingStatusForMinutes] =
    useState(false);
  const [isCancelMeetingModal, setCancelMeetingModal] = useState(false);
  const [externalMeetingAttendees, setExternalMeetingAttendees] = useState([]);
  const [editRecordFlag, seteditRecordFlag] = useState(false);
  const [editRecordIndex, seteditRecordIndex] = useState(null);

  // for modal fields error
  const [modalField, setModalField] = useState(false);

  const [objMeetingAgenda, setObjMeetingAgenda] = useState({
    PK_MAID: 0,
    Title: "",
    PresenterName: "",
    URLs: "",
    FK_MDID: 0,
  });

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  // for upload documents
  const [meetingAgendaAttachments, setMeetingAgendaAttachments] = useState({
    MeetingAgendaAttachments: [],
  });

  // for meatings  Attendees
  const [meetingAttendees, setMeetingAttendees] = useState({
    User: {
      PK_UID: 0,
    },
    MeetingAttendeeRole: {
      PK_MARID: 0,
    },
    AttendeeAvailability: {
      PK_AAID: 1,
    },
  });

  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);

  // for   dropdown Attendees List
  const [optiosnMeetingAttendeesList, setOptiosnMeetingAttendeesList] =
    useState([]);

  // for   selected Attendees Name
  const [selectedAttendeesName, setSelectedAttendeesName] = useState("");

  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");

  //Reminder Stats
  const [reminderValue, setReminderValue] = useState("");
  const [reminder, setReminder] = useState("");

  //for attendees
  const [isValid, setIsValid] = useState({
    selectedAttendeesName: "",
    participantRoleName: 0,
  });

  // Minutes of the meeting
  const [recordsMinutesOfTheMeeting, setRecordMinutesOfTheMeeting] = useState({
    PK_MOMID: 0,
    Description: "",
    CreationDate: "",
    CreationTime: "",
    FK_MDID: 0,
  });

  // for   added participant  Name list
  const [addedParticipantNameList, setAddedParticipantNameList] = useState([]);
  //Attendees States
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  // const [isValid, setValid] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
    MeetingID: 0,
    MeetingTitle: "",
    MeetingDescription: "",
    MeetingTypeID: 0,
    OrganizationId: 0,
    MeetingDate: "",
    UTCMeetingDate: "",
    UTCMeetingTime: "",
    MeetingStartTime: "",
    MeetingEndTime: "",
    IsVideoCall: false,
    IsChat: false,
    MeetingLocation: "",
    MeetingReminderID: [],
    MeetingAgendas: [],
    MeetingAttendees: [],
    ExternalMeetingAttendees: [],
    // MinutesOfMeeting: [],
  });
  const [minutesOfMeeting, setMinutesOfMeeting] = useState([]);
  const [createMeetingTime, setCreateMeetingTime] = useState("");
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [valueDate, setValueDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  useEffect(() => {
    if (currentLanguage != undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  const changeSelectDetails = () => {
    setIsDetails(true);
    setIsAgenda(false);
    setIsMinutes(false);
    setIsAttendees(false);
    setIsPublishMeeting(false);
    setCancelMeetingModal(false);
    setModalField(false);
  };

  const changeSelectAgenda = () => {
    setModalField(false);
    if (
      createMeeting.MeetingStartTime != "" &&
      createMeeting.MeetingEndTime != "" &&
      createMeeting.MeetingDate != "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      // createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation != ""
      //  &&
      // createMeeting.MeetingTitle != ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(true);
      setIsAttendees(false);
      setIsMinutes(false);
      setCancelMeetingModal(false);
    } else {
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(false);
      setCancelMeetingModal(false);
    }
  };

  const changeSelectAttendees = () => {
    setModalField(false);
    if (
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      // createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation !== ""
      // &&
      // createMeeting.MeetingTitle !== ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(true);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
    } else {
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
    }
  };

  const changeSelectMinutes = () => {
    if (
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== "" &&
      // createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation !== ""
      // &&
      // createMeeting.MeetingTitle != ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(true);
    } else {
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
    }
  };

  const navigateToAgenda = async () => {
    setModalField(false);
    if (
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== "" &&
      // createMeeting.MeetingDescription !== "" &&
      createMeeting.MeetingLocation !== "" &&
      // createMeeting.MeetingTitle !== "" &&
      createMeetingTime !== "" &&
      meetingDate !== ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
      setIsAgenda(true);
      setIsAttendees(false);
    } else {
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
      setIsAttendees(false);
    }
  };

  const navigateToAttendees = () => {
    if (createMeeting.MeetingAgendas.length > 0) {
      setIsAgenda(false);
      setIsAttendees(true);
    } else {
      setIsAgenda(true);
      setIsAttendees(false);
      setOpen({
        ...open,
        flag: true,
        message: t("Please-atleast-add-one-agenda"),
      });
    }
  };

  const navigateToMinutes = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(true);
  };

  const navigateToPublish = async () => {
    await setEditFlag(false);
    await seteditRecordIndex(null);
    await seteditRecordFlag(false);
    // await
    await setIsDetails(true);
    await setIsMinutes(false);
    await setIsAgenda(false);
    await setIsAttendees(false);
    let finalDateTime = createConvert(
      createMeeting.MeetingDate + createMeeting.MeetingStartTime
    );
    let newDate = finalDateTime.slice(0, 8);
    let newTime = finalDateTime.slice(8, 14);
    let ifemptyTime = moment(newTime, "HHmmss").format("hh-mm-ss");
    let ifemptyDate = moment(newDate, "YYYYMMDD").format("MMM DD, YYYY");

    let newData = {
      MeetingID: createMeeting.MeetingID,
      MeetingTitle:
        createMeeting.MeetingTitle !== ""
          ? createMeeting.MeetingTitle
          : `Untitled @ ${ifemptyDate} ${ifemptyTime}`,
      MeetingDescription: createMeeting.MeetingDescription,
      MeetingTypeID: 0,
      MeetingDate: newDate,
      OrganizationId: parseInt(OrganizationId),
      MeetingStartTime: newTime,
      MeetingEndTime: newTime,
      MeetingLocation: createMeeting.MeetingLocation,
      IsVideoCall: createMeeting.IsVideoCall,
      IsChat: createMeeting.IsChat,
      MeetingReminderID: createMeeting.MeetingReminderID,
      MeetingAgendas: createMeeting.MeetingAgendas,
      MeetingAttendees: createMeeting.MeetingAttendees,
      ExternalMeetingAttendees: createMeeting.ExternalMeetingAttendees,
    };
    await dispatch(UpdateMeeting(navigate, t, checkFlag, newData));
    await setObjMeetingAgenda({
      PK_MAID: 0,
      Title: "",
      PresenterName: "",
      URLs: "",
      FK_MDID: 0,
    });
    await setMeetingAgendaAttachments({
      MeetingAgendaAttachments: [],
    });
    await setParticipantRoleName("");
    await setSelectedAttendeesName("");
    await setCreateMeeting({
      MeetingTitle: "",
      MeetingDescription: "",
      MeetingTypeID: 0,
      MeetingDate: "",
      MeetingStartTime: "",
      MeetingEndTime: "",
      MeetingLocation: "",
      IsVideoCall: false,
      IsChat: false,
      MeetingReminderID: [],
      MeetingAgendas: [],
      MeetingAttendees: [],
      ExternalMeetingAttendees: [],
    });
    await setMeetingAttendees({
      User: {
        PK_UID: 0,
      },
      MeetingAttendeeRole: {
        PK_MARID: 0,
      },
      AttendeeAvailability: {
        PK_AAID: 1,
      },
    });
    await setRecordMinutesOfTheMeeting({
      PK_MOMID: 0,
      Description: "",
      CreationDate: "",
      CreationTime: "",
      FK_MDID: 0,
    });
    // await setMeetingReminderValue("");
    // await setMeetingReminderID([]);
    setReminder("");
    setReminderValue("");
    setTaskAssignedToInput("");
  };

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Organizer"), id: 1 },
    { label: t("Participant"), id: 2 },
  ];

  // for Participant options
  const participantOptions = [t("Organizer"), t("Participant")];

  // Reminder handler
  const ReminderNameHandler = (e, value) => {
    try {
      setReminderValue(value);
      let valueOfReminder = assignees.RemindersData;
      valueOfReminder.map((data, index) => {
        if (value === data.description) {
          let id = data.pK_MRID;
          setCreateMeeting({
            ...createMeeting,
            ["MeetingReminderID"]: [parseInt(id)],
          });
        }
      });
    } catch (error) {
      console.log("ReminderNameHandler error");
    }
  };

  // for all details handler
  const detailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let valueCheck = value.replace(/^\s/g, "");
    // setModalField(true);
    if (name === "MeetingStartTime") {
      setCreateMeeting({
        ...createMeeting,
        [name]: RemoveTimeDashes(value),
        ["MeetingEndTime"]: RemoveTimeDashes(value),
      });
      setCreateMeetingTime(value);
    }
    // else if (name === "MeetingDate") {
    //   console.log("MeetingDate", name, value);
    //   setCreateMeeting({
    //     ...createMeeting,
    //     [name]: value,
    //   });
    // }
    else if (name === "MeetingLocation") {
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingTitle") {
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingDescription") {
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingTypeID" && (value === "" || value === 0)) {
      setCreateMeeting({
        ...createMeeting,
        [name]: parseInt(0),
      });
    } else {
      setModalField(false);
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    }
  };

  //Create add minutes in edit
  const addMinutes = (e) => {
    e.preventDefault();
    if (
      recordsMinutesOfTheMeeting.Description !== "" &&
      recordsMinutesOfTheMeeting.Description.trim() !== ""
    ) {
      let newMeeting = minutesOfMeeting;
      newMeeting.push(recordsMinutesOfTheMeeting);
      setMinutesOfMeeting(newMeeting);
      setRecordMinutesOfTheMeeting({
        PK_MOMID: 0,
        Description: "",
        CreationDate: recordsMinutesOfTheMeeting.CreationDate,
        CreationTime: recordsMinutesOfTheMeeting.CreationTime,
        FK_MDID: assignees.ViewMeetingDetails.meetingDetails.pK_MDID,
      });
    } else {
      setOpen({
        ...open,
        open: true,
        message: "",
      });
    }
  };

  //for onchange events  of the meeting
  const onChangeAddMinutes = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    setRecordMinutesOfTheMeeting({
      PK_MOMID: recordsMinutesOfTheMeeting.PK_MOMID,
      Description: valueCheck.trimStart(),
      CreationDate: recordsMinutesOfTheMeeting.CreationDate,
      CreationTime: recordsMinutesOfTheMeeting.CreationTime,
      FK_MDID: assignees.ViewMeetingDetails.meetingDetails.pK_MDID,
    });
  };

  // for agenda main inputs handler
  const agendaHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    if (name === "Title") {
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        ["PK_MAID"]: objMeetingAgenda.PK_MAID,
        [name]: valueCheck.trimStart(),
        ["FK_MDID"]: assignees.ViewMeetingDetails.meetingDetails.pK_MDID,
      });
    } else if (name === "PresenterName") {
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
        ["FK_MDID"]: assignees.ViewMeetingDetails.meetingDetails.pK_MDID,
      });
    } else if (name === "URLs") {
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
        ["FK_MDID"]: assignees.ViewMeetingDetails.meetingDetails.pK_MDID,
      });
    } else {
      console.log("agendaHandler not complete");
    }
  };

  // for add another agenda main inputs handler
  const uploadFilesAgenda = (data) => {
    const uploadFilePath = data.target.value;
    const uploadedFile = data.target.files[0];
    var ext = uploadedFile.name.split(".").pop();
    let file = meetingAgendaAttachments.MeetingAgendaAttachments;
    if (
      ext === "doc" ||
      ext === "docx" ||
      ext === "xls" ||
      ext === "xlsx" ||
      ext === "pdf" ||
      ext === "png" ||
      ext === "txt" ||
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "gif" ||
      ext === "csv"
    ) {
      let data;
      let sizezero;
      let size;
      if (file.length > 0) {
        file.map((filename, index) => {
          if (filename.DisplayFileName === uploadedFile.name) {
            data = false;
          }
        });
        if (uploadedFile.size > 10485760) {
          size = false;
        } else if (uploadedFile.size === 0) {
          sizezero = false;
        }
        if (data === false) {
          console.log("uploadFile ReducerData");
        } else if (size === false) {
          console.log("uploadFile ReducerData");
        } else if (sizezero === false) {
          console.log("uploadFile ReducerData");
        } else {
          console.log("uploadFile ReducerData");
          dispatch(FileUploadToDo(navigate, uploadedFile, t));
        }
      } else {
        let size;
        let sizezero;
        // if (uploadedFile.size > 10000000) {
        //   setOpen({
        //     ...open,
        //     flag: true,
        //     message: "File Size is larger than 10MB",
        //   });
        //   console.log("uploadFile ReducerData");
        //   size = false;
        // }
        if (uploadedFile.size === 0) {
          setOpen({
            ...open,
            flag: true,
            message: t("File-size-is-0mb"),
          });
          sizezero = false;
        }
        if (size === false) {
          console.log("uploadFile ReducerData");
        } else if (sizezero === false) {
          console.log("uploadFile ReducerData");
        } else {
          console.log("uploadFile ReducerData");

          dispatch(FileUploadToDo(navigate, uploadedFile, t));
        }
      }
    }
  };
  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    dispatch(DownloadFile(navigate, data));
  };

  useEffect(() => {
    let newData = uploadReducer.uploadDocumentsList;
    let MeetingAgendaAttachment =
      meetingAgendaAttachments.MeetingAgendaAttachments;
    if (newData != undefined && newData.length != 0) {
      MeetingAgendaAttachment.push({
        PK_MAAID: 0,
        DisplayAttachmentName: newData.displayFileName,
        OriginalAttachmentName: newData.originalFileName,
        CreationDateTime: "111111",
        FK_MAID: objMeetingAgenda.PK_MAID,
      });
      setMeetingAgendaAttachments({
        ...meetingAgendaAttachments,
        ["MeetingAgendaAttachments"]: MeetingAgendaAttachment,
      });
    }
  }, [uploadReducer.uploadDocumentsList]);

  function urlPatternValidation(URL) {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  }

  // for add another agenda main inputs handler
  const addAnOtherAgenda = (e) => {
    e.preventDefault();
    let previousAdendas = createMeeting.MeetingAgendas;
    if (editRecordFlag != null && editRecordFlag === true) {
      if (objMeetingAgenda.Title !== "") {
        if (objMeetingAgenda.URLs !== "") {
          if (urlPatternValidation(objMeetingAgenda.URLs)) {
            let newData = {
              ObjMeetingAgenda: objMeetingAgenda,
              MeetingAgendaAttachments:
                meetingAgendaAttachments.MeetingAgendaAttachments,
            };
            previousAdendas[editRecordIndex] = newData;
            setCreateMeeting({
              ...createMeeting,
              ["MeetingAgendas"]: previousAdendas,
            });
            seteditRecordIndex(null);
            seteditRecordFlag(false);
            setObjMeetingAgenda({
              PK_MAID: 0,
              Title: "",
              PresenterName: "",
              URLs: "",
              FK_MDID: 0,
            });
            setMeetingAgendaAttachments({
              MeetingAgendaAttachments: [],
            });
          } else {
            setModalField(false);
            setOpen({
              ...open,
              flag: true,
              message: t("Enter-valid-url"),
            });
          }
        } else {
          let newData = {
            ObjMeetingAgenda: objMeetingAgenda,
            MeetingAgendaAttachments:
              meetingAgendaAttachments.MeetingAgendaAttachments,
          };
          previousAdendas[editRecordIndex] = newData;
          setCreateMeeting({
            ...createMeeting,
            ["MeetingAgendas"]: previousAdendas,
          });
          seteditRecordIndex(null);
          seteditRecordFlag(false);
          setObjMeetingAgenda({
            PK_MAID: 0,
            Title: "",
            PresenterName: "",
            URLs: "",
            FK_MDID: 0,
          });
          setMeetingAgendaAttachments({
            MeetingAgendaAttachments: [],
          });
        }
      } else {
        setModalField(true);
        setOpen({
          ...open,
          flag: true,
          message: t("Enter-Title-Information"),
        });
      }
    } else {
      if (objMeetingAgenda.Title !== "") {
        if (objMeetingAgenda.URLs !== "") {
          if (urlPatternValidation(objMeetingAgenda.URLs)) {
            setModalField(false);
            let previousAdendas = createMeeting.MeetingAgendas;
            let newData = {
              ObjMeetingAgenda: objMeetingAgenda,
              MeetingAgendaAttachments:
                meetingAgendaAttachments.MeetingAgendaAttachments,
            };
            previousAdendas.push(newData);
            setCreateMeeting({
              ...createMeeting,
              ["MeetingAgendas"]: previousAdendas,
            });
            setObjMeetingAgenda({
              PK_MAID: 0,
              Title: "",
              PresenterName: "",
              URLs: "",
              FK_MDID: 0,
            });
            setMeetingAgendaAttachments({
              MeetingAgendaAttachments: [],
            });
          } else {
            setModalField(false);
            setOpen({
              ...open,
              flag: true,
              message: t("Enter-valid-url"),
            });
          }
        } else {
          setModalField(false);
          let previousAdendas = createMeeting.MeetingAgendas;
          let newData = {
            ObjMeetingAgenda: objMeetingAgenda,
            MeetingAgendaAttachments:
              meetingAgendaAttachments.MeetingAgendaAttachments,
          };
          previousAdendas.push(newData);
          setCreateMeeting({
            ...createMeeting,
            ["MeetingAgendas"]: previousAdendas,
          });
          setObjMeetingAgenda({
            PK_MAID: 0,
            Title: "",
            PresenterName: "",
            URLs: "",
            FK_MDID: 0,
          });
          setMeetingAgendaAttachments({
            MeetingAgendaAttachments: [],
          });
        }
      } else {
        setModalField(true);
        setOpen({
          ...open,
          flag: true,
          message: t("Enter-Title-Information"),
        });
      }
    }
  };

  //On Change Checkbox
  function onChange(e) {
    setCreateMeeting({
      ...createMeeting,
      ["IsChat"]: e.target.checked,
    });
  }

  function videoEnableButton() {
    if (createMeeting.IsVideoCall === true) {
      setCreateMeeting({
        ...createMeeting,
        ["IsVideoCall"]: false,
      });
    } else {
      setCreateMeeting({
        ...createMeeting,
        ["IsVideoCall"]: true,
      });
    }
  }

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    // let value = e.target.value;
    setParticipantRoleName(value);
    let user = participantOptionsWithIDs;
    if (user != undefined) {
      if (participantOptionsWithIDs.length > 0) {
        participantOptionsWithIDs.map((data, index) => {
          if (data.label === value) {
            let newData = {
              User: {
                PK_UID: meetingAttendees.User.PK_UID,
              },
              MeetingAttendeeRole: {
                PK_MARID: data.id,
              },
              AttendeeAvailability: {
                PK_AAID: 1,
              },
            };
            setMeetingAttendees(newData);
          }
        });
      }
    }
  };

  // Reminder selection for drop down
  useEffect(() => {
    let valueOfReminder = assignees.RemindersData;
    setReminder(
      valueOfReminder.map((data, index) => {
        return data.description;
      })
    );
  }, [assignees.RemindersData]);

  useEffect(() => {
    let valueOfReminder = assignees.RemindersData;
    valueOfReminder.map((data, index) => {
      if (createMeeting.MeetingReminderID === data.pK_MRID) {
        setReminderValue(data.description);
        setCreateMeeting({
          ...createMeeting,
          ["MeetingReminderID"]: [parseInt(data.pK_MRID)],
        });
      }
    });
  }, [assignees.RemindersData]);

  // for list of all assignees
  useEffect(() => {
    if (editFlag) {
      let user1 = createMeeting.MeetingAttendees;
      let List = addedParticipantNameList;
      // dispatch(allAssignessList(navigate, t));
      // dispatch(GetAllReminders(navigate, t));
      setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
      setAddedParticipantNameList(List);
    } else {
      setEditFlag(false);
      seteditRecordIndex(null);
      seteditRecordFlag(false);
      dispatch(cleareAssigneesState());
      setIsDetails(true);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
      setIsAgenda(false);
      setIsAttendees(false);
      setObjMeetingAgenda({
        PK_MAID: 0,
        Title: "",
        PresenterName: "",
        URLs: "",
        FK_MDID: 0,
      });
      setMeetingAgendaAttachments({
        MeetingAgendaAttachments: [],
      });
      setParticipantRoleName("");
      setSelectedAttendeesName("");
      setCreateMeeting({
        MeetingTitle: "",
        MeetingDescription: "",
        MeetingTypeID: 0,
        MeetingDate: "",
        MeetingStartTime: "",
        MeetingEndTime: "",
        IsVideoCall: false,
        IsChat: false,
        MeetingLocation: "",
        MeetingReminderID: [],
        MeetingAgendas: [],
        MeetingAttendees: [],
        ExternalMeetingAttendees: [],
      });
      setRecordMinutesOfTheMeeting({
        PK_MOMID: 0,
        Description: "",
        CreationDate: "",
        CreationTime: "",
        FK_MDID: 0,
      });
      setMeetingAttendees({
        User: {
          PK_UID: 0,
        },
        MeetingAttendeeRole: {
          PK_MARID: 0,
        },
        AttendeeAvailability: {
          PK_AAID: 1,
        },
      });
      setAddedParticipantNameList([]);
      setReminder("");
      setReminderValue("");
      setTaskAssignedToInput("");
    }
  }, [editFlag]);

  // for api reponce of list of all assignees
  useEffect(() => {
    if (Object.keys(assignees.user).length > 0) {
      setMeetingAttendeesList(assignees.user);
    }
  }, [assignees.user]);

  // for  list of all assignees  drop down
  useEffect(() => {
    let user = meetingAttendeesList;
    if (user !== undefined) {
      if (meetingAttendeesList.length > 0) {
        setOptiosnMeetingAttendeesList(
          meetingAttendeesList.map((data, index) => {
            return data.name;
          })
        );
      }
    }
  }, [meetingAttendeesList]);

  // for  list of all assignees  drop down
  useEffect(() => {
    if (addedParticipantNameList !== undefined) {
      if (addedParticipantNameList.length > 0) {
      }
    }
  }, [addedParticipantNameList]);

  // for fetch data for edit from grid

  const meetingDateHandler = (date, format = "YYYYMMDD") => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let meetingDateSaveFormat = new DateObject(date).format("YYYYMMDD");
    let meetingDateConvertUTC = moment(meetingDateSaveFormat, "YYYYMMDD")
      .utc()
      .format("YYYYMMDD");
    setMeetingDate(meetingDateValueFormat);
    setCreateMeeting({
      ...createMeeting,
      MeetingDate: meetingDateConvertUTC,
    });
  };

  // for view data
  useEffect(() => {
    try {
      if (Object.keys(assignees.ViewMeetingDetails).length > 0) {
        let viewData = assignees.ViewMeetingDetails;
        let reminder = [];
        let meetingAgenAtc = [];
        let minutesOfMeetings = [];
        let externalMeetingAttendiesList = [];
        let meetingStatus = assignees.ViewMeetingDetails.meetingStatus.status;
        if (meetingStatus === "2") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setEndMeetingStatusForMinutes(false);
          setEndMeetingStatus2(false);
        } else if (meetingStatus === "3") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setEndMeetingStatus2(false);
          setEndMeetingStatusForMinutes(false);
        } else if (meetingStatus === "4") {
          setEndMeetingStatusForMinutes(true);
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(false);
          setEndMeetingStatus2(true);
        } else {
          setEndMeetingStatusForMinutes(false);
          setMinutesOftheMeatingStatus(false);
          setEndMeetingStatus(false);
        }
        viewData.meetingReminders.map((rdata, index) => {
          let pkid = rdata.pK_MRID;
          reminder.push(pkid);
        });
        let valueOfReminder = assignees.RemindersData;
        valueOfReminder.map((data, index) => {
          if (data.pK_MRID === reminder[0]) {
            setReminderValue(data.description);
          }
        });
        // for meeting attendies
        let List = [];
        let user = meetingAttendeesList;
        let emptyList = [];
        try {
          if (viewData.meetingAttendees !== undefined) {
            if (viewData.meetingAttendees.length > 0) {
              viewData.meetingAttendees.map((meetingdata, index) => {
                List.push({
                  name: meetingdata.user.name,
                  designation: meetingdata.user.designation,
                  profilePicture: meetingdata.user.profilePicture,
                  organization: meetingdata.user.organization,
                  role: meetingdata.meetingAttendeeRole.pK_MARID,
                  displayProfilePic: meetingdata.user.displayProfilePictureName,
                });
                emptyList.push({
                  User: {
                    PK_UID: meetingdata.user.pK_UID,
                  },
                  MeetingAttendeeRole: {
                    PK_MARID: meetingdata.meetingAttendeeRole.pK_MARID,
                  },
                  AttendeeAvailability: {
                    PK_AAID: meetingdata.attendeeAvailability.pK_AAID,
                  },
                });
              });

              setAddedParticipantNameList(List);
            }
          }
          if (viewData.externalMeetingAttendees !== undefined) {
            if (viewData.externalMeetingAttendees.length > 0) {
              viewData.externalMeetingAttendees.map(
                (externalMeetingAttendeesMeetingdata, index) => {
                  List.push({
                    name: externalMeetingAttendeesMeetingdata.emailAddress,
                    designation: "Default",
                    profilePicture: "Default",
                    organization: "Default",
                    role: 2,
                  });
                }
              );
            }
          }
          setAddedParticipantNameList(List);
        } catch (error) {
          console.log("error");
        }
        try {
          viewData.meetingAgendas.map((atchmenData, index) => {
            let opData = {
              PK_MAID: atchmenData.objMeetingAgenda.pK_MAID,
              Title: atchmenData.objMeetingAgenda.title,
              PresenterName: atchmenData.objMeetingAgenda.presenterName,
              URLs: atchmenData.objMeetingAgenda.urLs,
              FK_MDID: atchmenData.objMeetingAgenda.fK_MDID,
            };
            let file = [];
            if (atchmenData.meetingAgendaAttachments !== null) {
              atchmenData.meetingAgendaAttachments.map(
                (atchmenDataaa, index) => {
                  file.push({
                    PK_MAAID: atchmenDataaa.pK_MAAID,
                    DisplayAttachmentName: atchmenDataaa.displayAttachmentName,
                    OriginalAttachmentName:
                      atchmenDataaa.originalAttachmentName,
                    CreationDateTime: atchmenDataaa.creationDateTime,
                    FK_MAID: atchmenDataaa.fK_MAID,
                  });
                }
              );
            }
            meetingAgenAtc.push({
              ObjMeetingAgenda: opData,
              MeetingAgendaAttachments: file,
            });
          });
        } catch (error) {
          console.log("error", error);
        }
        try {
          viewData.minutesOfMeeting.map((minutesOfMeetingData, index) => {
            minutesOfMeetings.push({
              PK_MOMID: minutesOfMeetingData.pK_MOMID,
              Description: minutesOfMeetingData.description,
              CreationDate: minutesOfMeetingData.creationDate,
              CreationTime: minutesOfMeetingData.creationTime,
              FK_MDID: minutesOfMeetingData.fK_MDID,
            });
          });
        } catch (error) {
          //  Block of code to handle errors
          console.log("error");
        }
        try {
          viewData.externalMeetingAttendees.map(
            (externalMeetingAttendeesData, index) => {
              externalMeetingAttendiesList.push({
                PK_EMAID: externalMeetingAttendeesData.pK_EMAID,
                EmailAddress: externalMeetingAttendeesData.emailAddress,
                FK_MDID: externalMeetingAttendeesData.fK_MDID,
              });
            }
          );
        } catch (error) {
          //  Block of code to handle errors
          console.log("error");
        }
        // setMeetingDate(
        //   moment(viewData.meetingEvent.meetingDate, "YYYYMMDD").format("DD/MM/YYYY").toString()
        // );
        setMeetingDate(
          moment(
            EditmeetingDateFormat(
              viewData.meetingEvent.meetingDate +
                viewData.meetingEvent.startTime
            )
          ).format("DD/MM/YYYY")
        );
        let newDate = new Date(
          EditmeetingDateFormat(
            viewData.meetingEvent.meetingDate + viewData.meetingEvent.startTime
          )
        );
        setCreateMeetingTime(newDate);
        setCreateMeeting({
          MeetingID: viewData.meetingDetails.pK_MDID,
          MeetingTitle: viewData.meetingDetails.title,
          MeetingDescription: viewData.meetingDetails.description,
          MeetingTypeID: viewData.meetingDetails.fK_MTID,
          MeetingDate: viewData.meetingEvent.meetingDate,
          IsChat: viewData.meetingDetails.isChat,
          IsVideoCall: viewData.meetingDetails.isVideoCall,
          MeetingStartTime: convertTimetoGMT(
            viewData.meetingEvent.meetingDate + viewData.meetingEvent.startTime
          ),
          MeetingEndTime: convertTimetoGMT(
            viewData.meetingEvent.meetingDate + viewData.meetingEvent.startTime
          ),
          MeetingLocation: viewData.meetingEvent.location,
          MeetingReminderID: reminder,
          MeetingAgendas: meetingAgenAtc,
          MeetingAttendees: emptyList,
          ExternalMeetingAttendees: externalMeetingAttendiesList,
        });
        setMinutesOfMeeting(minutesOfMeetings);
      }
    } catch (error) {
      console.log("error in responce in api");
    }
  }, [assignees.ViewMeetingDetails]);

  const editGrid = (datarecord, dataindex) => {
    seteditRecordIndex(dataindex);
    seteditRecordFlag(true);
    setObjMeetingAgenda({
      ...objMeetingAgenda,
      ["PK_MAID"]: datarecord.ObjMeetingAgenda.PK_MAID,
      ["Title"]: datarecord.ObjMeetingAgenda.Title,
      ["PresenterName"]: datarecord.ObjMeetingAgenda.PresenterName,
      ["URLs"]: datarecord.ObjMeetingAgenda.URLs,
      ["FK_MDID"]: datarecord.ObjMeetingAgenda.FK_MDID,
    });
    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      ["MeetingAgendaAttachments"]: datarecord.MeetingAgendaAttachments,
    });
  };

  //On Click Of Dropdown Value
  const onSearch = (name, id) => {
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setTaskAssignedToInput(e.target.value);
  };

  //Drop Down Values
  const searchFilterHandler = (value) => {
    let getUserDetails =
      CommitteeReducer?.getCommitteeByCommitteeID?.committeMembers;
    if (
      getUserDetails !== undefined &&
      getUserDetails !== null &&
      getUserDetails.length > 0
    ) {
      return getUserDetails
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.userName.toLowerCase();
          return (
            searchTerm && assigneesName.startsWith(searchTerm)
            // assigneesName !== searchTerm.toLowerCase()
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.userName, item.pK_UID)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            <img
              src={`data:image/jpeg;base64,${item.userProfilePicture.displayProfilePictureName}`}
              alt=""
              className="user-img"
            />
            <p className="p-0 m-0">{item.userName}</p>
          </div>
        ));
    } else {
      console.log("not found");
    }
  };

  // for add Attendees handler
  const addAttendees = () => {
    let user1 = createMeeting.MeetingAttendees;
    let List = addedParticipantNameList;

    let found = user1.find((element) => element.User.PK_UID === taskAssignedTo);

    if (taskAssignedTo !== 0) {
      if (found !== undefined) {
        setOpen({
          ...open,
          flag: true,
          message: t("User-already-exists"),
        });
        setTaskAssignedTo(0);
        setTaskAssignedName("");
        setParticipantRoleName("");
        setTaskAssignedToInput("");
      } else {
        user1.push({
          User: {
            PK_UID: taskAssignedTo,
          },
          MeetingAttendeeRole: {
            PK_MARID: meetingAttendees.MeetingAttendeeRole.PK_MARID,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        });
        if (meetingAttendeesList.length > 0) {
          meetingAttendeesList.map((data, index) => {
            if (data.pK_UID === taskAssignedTo) {
              List.push({
                name: data.name,
                designation: data.designation,
                profilePicture: data.profilePicture,
                organization: data.organization,
                role: meetingAttendees.MeetingAttendeeRole.PK_MARID,
                displayProfilePic: data.displayProfilePictureName,
              });
            }
          });
        }
        setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
        setAddedParticipantNameList(List);
        let newData = {
          User: {
            PK_UID: 0,
          },
          MeetingAttendeeRole: {
            PK_MARID: 0,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        };
        setMeetingAttendees(newData);
        setTaskAssignedTo(0);
        setTaskAssignedName("");
        setParticipantRoleName("");
        setTaskAssignedToInput("");
      }
    } else {
      if (found === undefined) {
        setOpen({
          message: t("Please-add-valid-user"),
          flag: true,
        });
        setTimeout(() => {
          setOpen({
            ...open,
            message: "",
            flag: false,
          });
        }, 4000);
        setTaskAssignedTo(0);
        setTaskAssignedName("");
        setParticipantRoleName("");
        setTaskAssignedToInput("");
      }
    }
  };

  // for attendies handler
  const handleSubmit = async () => {
    await setEditFlag(false);
    await seteditRecordIndex(null);
    await seteditRecordFlag(false);
    // await
    await setIsDetails(true);
    await setIsMinutes(false);
    await setIsAgenda(false);
    await setIsAttendees(false);
    let finalDateTime = createConvert(
      createMeeting.MeetingDate + createMeeting.MeetingStartTime
    );
    let newDate = finalDateTime.slice(0, 8);
    let newTime = finalDateTime.slice(8, 14);
    let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    let Data = {
      MeetingID: meetingID,
    };
    let newData = {
      MeetingID: createMeeting.MeetingID,
      MeetingTitle: createMeeting.MeetingTitle,
      MeetingDescription: createMeeting.MeetingDescription,
      MeetingTypeID: 0,
      MeetingDate: newDate,
      OrganizationId: parseInt(OrganizationId),
      MeetingStartTime: newTime,
      MeetingEndTime: newTime,
      MeetingLocation: createMeeting.MeetingLocation,
      IsVideoCall: createMeeting.IsVideoCall,
      IsChat: createMeeting.IsChat,
      MeetingReminderID: createMeeting.MeetingReminderID,
      MeetingAgendas: createMeeting.MeetingAgendas,
      MeetingAttendees: createMeeting.MeetingAttendees,
      ExternalMeetingAttendees: createMeeting.ExternalMeetingAttendees,
    };
    await dispatch(UpdateMeeting(navigate, t, checkFlag, newData));
    await setObjMeetingAgenda({
      PK_MAID: 0,
      Title: "",
      PresenterName: "",
      URLs: "",
      FK_MDID: 0,
    });
    await setMeetingAgendaAttachments({
      MeetingAgendaAttachments: [],
    });
    await setParticipantRoleName("");
    await setSelectedAttendeesName("");
    await setCreateMeeting({
      MeetingTitle: "",
      MeetingDescription: "",
      MeetingTypeID: 0,
      MeetingDate: "",
      MeetingStartTime: "",
      MeetingEndTime: "",
      MeetingLocation: "",
      IsVideoCall: false,
      IsChat: false,
      MeetingReminderID: [],
      MeetingAgendas: [],
      MeetingAttendees: [],
      ExternalMeetingAttendees: [],
    });
    await setMeetingAttendees({
      User: {
        PK_UID: 0,
      },
      MeetingAttendeeRole: {
        PK_MARID: 0,
      },
      AttendeeAvailability: {
        PK_AAID: 1,
      },
    });
    await setRecordMinutesOfTheMeeting({
      PK_MOMID: 0,
      Description: "",
      CreationDate: "",
      CreationTime: "",
      FK_MDID: 0,
    });
    // await setMeetingReminderValue("");
    // await setMeetingReminderID([]);
    setReminder("");
    setReminderValue("");
    setTaskAssignedToInput("");
  };

  // For Cancelling Meeting
  const cancelMeeting = async () => {
    await setEditFlag(false);
    await seteditRecordIndex(null);
    await seteditRecordFlag(false);
    await await setIsDetails(true);
    await setIsMinutes(false);
    await setIsAgenda(false);
    await setIsAttendees(false);
    let meetingID = createMeeting.MeetingID;
    let Data = {
      MeetingID: meetingID,
    };
    await dispatch(CancelMeeting(navigate, Data, t, 1));
    setObjMeetingAgenda({
      PK_MAID: 0,
      Title: "",
      PresenterName: "",
      URLs: "",
      FK_MDID: 0,
    });
    setMeetingAgendaAttachments({
      MeetingAgendaAttachments: [],
    });
    setParticipantRoleName("");
    setSelectedAttendeesName("");
    setCreateMeeting({
      MeetingTitle: "",
      MeetingDescription: "",
      MeetingTypeID: 0,
      MeetingDate: "",
      MeetingStartTime: "",
      MeetingEndTime: "",
      MeetingLocation: "",
      IsVideoCall: false,
      IsChat: false,
      MeetingReminderID: [],
      MeetingAgendas: [],
      MeetingAttendees: [],
      ExternalMeetingAttendees: [],
    });
    setRecordMinutesOfTheMeeting({
      PK_MOMID: 0,
      Description: "",
      CreationDate: "",
      CreationTime: "",
      FK_MDID: 0,
    });
    setMeetingAttendees({
      User: {
        PK_UID: 0,
      },
      MeetingAttendeeRole: {
        PK_MARID: 0,
      },
      AttendeeAvailability: {
        PK_AAID: 1,
      },
    });
    setReminder("");
    setReminderValue("");
    setTaskAssignedToInput("");
  };
  const goBack = () => {
    setEditFlag(true);
    seteditRecordIndex(null);
    seteditRecordFlag(false);

    setIsDetails(true);
    setIsMinutes(false);
    setCancelMeetingModal(false);
    setIsPublishMeeting(false);
    setIsAgenda(false);
    setIsAttendees(false);
  };
  // For Discard Meeting
  const discardMeeting = () => {
    setEditFlag(false);
    seteditRecordIndex(null);
    seteditRecordFlag(false);

    setIsDetails(true);
    setCancelMeetingModal(false);
    setIsMinutes(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setObjMeetingAgenda({
      PK_MAID: 0,
      Title: "",
      PresenterName: "",
      URLs: "",
      FK_MDID: 0,
    });
    setMeetingAgendaAttachments({
      MeetingAgendaAttachments: [],
    });
    setParticipantRoleName("");
    setSelectedAttendeesName("");
    setCreateMeeting({
      MeetingTitle: "",
      MeetingDescription: "",
      MeetingTypeID: 0,
      MeetingDate: "",
      MeetingStartTime: "",
      MeetingEndTime: "",
      MeetingLocation: "",
      IsVideoCall: false,
      IsChat: false,
      MeetingReminderID: [],
      MeetingAgendas: [],
      MeetingAttendees: [],
      ExternalMeetingAttendees: [],
    });
    setRecordMinutesOfTheMeeting({
      PK_MOMID: 0,
      Description: "",
      CreationDate: "",
      CreationTime: "",
      FK_MDID: 0,
    });
    setMeetingAttendees({
      User: {
        PK_UID: 0,
      },
      MeetingAttendeeRole: {
        PK_MARID: 0,
      },
      AttendeeAvailability: {
        PK_AAID: 1,
      },
    });
    setReminder("");
    setReminderValue("");
    setTaskAssignedToInput("");
  };

  const cancelMeetingConfirmation = async () => {
    if (minutesOftheMeatingStatus) {
      if (endMeetingStatus2) {
        // let Data = { MinutesOfMeeting: minutesOfMeeting };
        await setModalField(false);
        await setIsPublishMeeting(false);
        await setCancelMeetingModal(false);
        await setEditFlag(false);
        await seteditRecordIndex(null);
        await seteditRecordFlag(false);
        await await setIsDetails(false);
        await setIsMinutes(false);
        await setIsAgenda(false);
        await setMinutesOftheMeatingStatus(false);
        await setObjMeetingAgenda({
          PK_MAID: 0,
          Title: "",
          PresenterName: "",
          URLs: "",
          FK_MDID: 0,
        });
        await setMeetingAgendaAttachments({
          MeetingAgendaAttachments: [],
        });
        await setParticipantRoleName("");
        await setSelectedAttendeesName("");
        await setCreateMeeting({
          MeetingTitle: "",
          MeetingDescription: "",
          MeetingTypeID: 0,
          MeetingDate: "",
          MeetingStartTime: "",
          MeetingEndTime: "",
          MeetingLocation: "",
          IsVideoCall: false,
          IsChat: false,
          MeetingReminderID: [],
          MeetingAgendas: [],
          MeetingAttendees: [],
          ExternalMeetingAttendees: [],
        });
        await setMeetingAttendees({
          User: {
            PK_UID: 0,
          },
          MeetingAttendeeRole: {
            PK_MARID: 0,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        });
        await setRecordMinutesOfTheMeeting({
          PK_MOMID: 0,
          Description: "",
          CreationDate: "",
          CreationTime: "",
          FK_MDID: 0,
        });
        // await setMeetingReminderValue("");
        // await setMeetingReminderID([]);
        setReminder("");
        setReminderValue("");
      } else {
        // let Data = { MinutesOfMeeting: minutesOfMeeting };
        await setModalField(false);
        await setIsPublishMeeting(false);
        await setCancelMeetingModal(false);
        await setEditFlag(false);
        await seteditRecordIndex(null);
        await seteditRecordFlag(false);
        await await setIsDetails(true);
        await setIsMinutes(false);
        await setIsAgenda(false);
        await setMinutesOftheMeatingStatus(false);
        await setObjMeetingAgenda({
          PK_MAID: 0,
          Title: "",
          PresenterName: "",
          URLs: "",
          FK_MDID: 0,
        });
        await setMeetingAgendaAttachments({
          MeetingAgendaAttachments: [],
        });
        await setParticipantRoleName("");
        await setSelectedAttendeesName("");
        await setCreateMeeting({
          MeetingTitle: "",
          MeetingDescription: "",
          MeetingTypeID: 0,
          MeetingDate: "",
          MeetingStartTime: "",
          MeetingEndTime: "",
          MeetingLocation: "",
          IsVideoCall: false,
          IsChat: false,
          MeetingReminderID: [],
          MeetingAgendas: [],
          MeetingAttendees: [],
          ExternalMeetingAttendees: [],
        });
        await setMeetingAttendees({
          User: {
            PK_UID: 0,
          },
          MeetingAttendeeRole: {
            PK_MARID: 0,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        });
        await setRecordMinutesOfTheMeeting({
          PK_MOMID: 0,
          Description: "",
          CreationDate: "",
          CreationTime: "",
          FK_MDID: 0,
        });
        // await setMeetingReminderValue("");
        // await setMeetingReminderID([]);
        setReminder("");
        setReminderValue("");
        setTaskAssignedToInput("");
      }
    } else {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(true);
    }
  };

  const deleteAttachmentfromAgenda = (attachmentdata, index) => {
    let meetingAgendas = meetingAgendaAttachments.MeetingAgendaAttachments;

    let newArray = {};

    if (attachmentdata.PK_MAAID > 0) {
      newArray = {
        CreationDateTime: attachmentdata.CreationDateTime,
        DisplayAttachmentName: "",
        FK_MAID: attachmentdata.FK_MAID,
        OriginalAttachmentName: "",
        PK_MAAID: attachmentdata.PK_MAAID,
      };
      meetingAgendas[index] = newArray;
    } else {
      meetingAgendas.splice(index, 1);
    }

    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      ["MeetingAgendaAttachments"]: meetingAgendas,
    });
  };

  const handleDeleteAttendee = (data, index) => {
    let user1 = createMeeting.MeetingAttendees;
    let List = addedParticipantNameList;
    user1.splice(index, 1);
    addedParticipantNameList.splice(index, 1);
    setAddedParticipantNameList(addedParticipantNameList);
    setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
  };

  const handleTimeChange = (newTime) => {
    let newDate = new Date(newTime);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);
      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${"00"}`;
      setCreateMeeting({
        ...createMeeting,
        ["MeetingStartTime"]: formattedTime,
        ["MeetingEndTime"]: formattedTime,
      });
      setCreateMeetingTime(newTime);
    }
    setSelectedTime(newTime);
  };

  function CustomInput({ onFocus, value, onChange }) {
    return (
      <input
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        className="input-with-icon"
      />
    );
  }

  return (
    <>
      <Container>
        <Modal
          onHide={() => setEditFlag(false)}
          show={editFlag}
          setShow={setEditFlag}
          className="modaldialog createModalMeeting"
          ButtonTitle={ModalTitle}
          setModalField={setModalField}
          modalField={modalField}
          modalBodyClassName="modalMeetingUpdateBody"
          modalFooterClassName={
            isDetails
              ? "d-flex mt-4 "
              : isAgenda
              ? "d-block mt-4"
              : isCancelMeetingModal
              ? "d-block"
              : "modalMeetingUpdateFooter"
          }
          modalHeaderClassName={
            isPublishMeeting === true
              ? "d-none"
              : isCancelMeetingModal === true
              ? "d-none"
              : "modalMeetingUpdateHeader"
          }
          size={isPublishMeeting || isCancelMeetingModal ? null : "lg"}
          ModalBody={
            <>
              {isPublishMeeting === false && isCancelMeetingModal === false ? (
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="d-flex gap-4">
                    <Button
                      className={
                        isDetails
                          ? "MontserratSemiBold-600  isDetail-Update-btn"
                          : "MontserratSemiBold-600   isDetail-Update-Outline-btn"
                      }
                      variant={"Primary"}
                      text={t("Details")}
                      onClick={changeSelectDetails}
                    />
                    <Button
                      className={
                        isAgenda
                          ? "MontserratSemiBold-600  isDetail-Update-btn"
                          : "MontserratSemiBold-600   isDetail-Update-Outline-btn"
                      }
                      variant={"Primary"}
                      text={t("Agendas")}
                      onClick={changeSelectAgenda}
                      datatut="show-agenda"
                    />
                    <Button
                      className={
                        isAttendees
                          ? "MontserratSemiBold-600  isDetail-Update-btn"
                          : "MontserratSemiBold-600   isDetail-Update-Outline-btn"
                      }
                      variant={"Primary"}
                      text={t("Attendees")}
                      datatut="show-meeting-attendees"
                      onClick={changeSelectAttendees}
                    />
                    {minutesOftheMeatingStatus && (
                      <Button
                        className={
                          isMinutes
                            ? "MontserratSemiBold-600  isDetail-Update-btn"
                            : "MontserratSemiBold-600   isDetail-Update-Outline-btn"
                        }
                        variant={"Primary"}
                        text={t("Minutes")}
                        datatut="show-minutes"
                        onClick={changeSelectMinutes}
                      />
                    )}
                  </Col>
                </Row>
              ) : null}
              {isDetails ? (
                <>
                  <Row className="udpateeetingtime-row-1">
                    <Col
                      lg={3}
                      md={3}
                      sm={3}
                      xs={12}
                      className="CreateMeetingTime"
                    >
                      <DatePicker
                        arrowClassName="arrowClass"
                        value={createMeetingTime}
                        containerClassName="containerClassTimePicker"
                        className="timePicker"
                        disableDayPicker
                        inputClass="inputTImeMeeting"
                        calendar={calendarValue}
                        locale={localValue}
                        format="hh:mm A"
                        selected={selectedTime}
                        editable={false}
                        render={<CustomInput />}
                        plugins={[<TimePicker hideSeconds />]}
                        onChange={handleTimeChange}
                      />
                      {/* <TextFieldTime
                        type="time"
                        labelClass="d-none"
                        value={createMeetingTime}
                        name="MeetingStartTime"
                        onKeyDown={(e) => e.preventDefault()}
                        applyClass={"quick_meeting_time"}
                        change={detailsHandler}
                        placeholder={"00:00"}
                      /> */}
                      {/* <TimePickers
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        placeholder={"00:00"}
                        name="MeetingStartTime"
                        value={createMeeting.MeetingStartTime}
                        required
                      /> */}
                      {modalField === true &&
                      createMeeting.MeetingStartTime === "" ? (
                        <ErrorBar errorText={t("Select-time")} />
                      ) : null}
                    </Col>
                    <Col
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      className="CreateMeetingDate"
                    >
                      <DatePicker
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
                        value={meetingDate}
                        calendar={calendarValue}
                        locale={localValue}
                        onChange={meetingDateHandler}

                        // ref={calendRef}
                      />
                      {/* <MultiDatePicker
                        onChange={meetingDateHandler}
                        name="MeetingDate"
                        value={meetingDate}
                        calendar={calendarValue}
                        locale={localValue}
                        disabled={endMeetingStatus}
                      /> */}
                      {modalField === true &&
                      createMeeting.MeetingDate === "" ? (
                        <ErrorBar errorText={t("Select-date")} />
                      ) : null}
                    </Col>
                    <Col lg={1} md={1} sm={1} xs={12}></Col>
                    <Col
                      lg={4}
                      md={4}
                      sm={5}
                      xs={12}
                      className="createmeeting-schedule-reminder CreateMeetingReminder select-participant-update-box"
                    >
                      <SelectBox
                        disable={endMeetingStatus}
                        name="MeetingReminderID"
                        placeholder={t("Reminder")}
                        option={reminder}
                        value={reminderValue}
                        change={ReminderNameHandler}
                        className="MeetingReminder"
                        required
                      />
                      {/* {modalField === true && reminderValue === "" ? (
                        <ErrorBar errorText={"Select Reminder"} />
                      ) : null} */}
                    </Col>
                    {/* <Col lg={3} md={3} xs={12}></Col> */}
                  </Row>

                  <Row className="updatemeetingvideoiconbtrrow">
                    <Col
                      lg={1}
                      md={1}
                      sm={2}
                      xs={12}
                      className="CreateMeetingInput"
                    >
                      <Button
                        disableBtn={endMeetingStatus}
                        text={<CameraVideo />}
                        name="IsVideoCall"
                        className={
                          createMeeting.IsVideoCall === false
                            ? "cameraButton update"
                            : "cameraButton update Enable"
                        }
                        onClick={videoEnableButton}
                      />
                    </Col>
                    <Col
                      lg={7}
                      md={7}
                      sm={6}
                      xs={12}
                      className="location-textbox CreateMeetingInput"
                    >
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        name="MeetingLocation"
                        applyClass="form-control2"
                        type="text"
                        placeholder={t("Location") + "*"}
                        value={createMeeting.MeetingLocation}
                        required={true}
                      />
                      {modalField === true &&
                      createMeeting.MeetingLocation === "" ? (
                        <ErrorBar errorText={t("This-field-is-empty")} />
                      ) : null}
                    </Col>
                    <Col
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      className="UpdateCheckbox mt-2"
                    >
                      <Checkbox
                        disabled={endMeetingStatus}
                        className="SearchCheckbox"
                        name="IsChat"
                        label={t("Group-chat")}
                        checked={createMeeting.IsChat}
                        onChange={onChange}
                        classNameDiv="checkboxParentClass"
                      ></Checkbox>
                    </Col>
                  </Row>

                  <Row className="updatemeetingvideoiconbtrrow">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="location-textbox CreateMeetingInput"
                    >
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        value={createMeeting.MeetingTitle}
                        name="MeetingTitle"
                        applyClass={"form-control2"}
                        type="text"
                        size="small"
                        placeholder={t("Meeting-title") + "*"}
                        required={true}
                        maxLength={200}
                      />
                      {modalField === true &&
                      createMeeting.MeetingTitle === "" ? (
                        <ErrorBar errorText={t("This-field-is-empty")} />
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="updatemeetingtextarearow">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="CreateMeetingInput textAreaDiv"
                    >
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        name="MeetingDescription"
                        applyClass="form-control2 updatemeetingtextarea"
                        type="text"
                        as={"textarea"}
                        rows="7"
                        placeholder={t("Description")}
                        value={createMeeting.MeetingDescription}
                        required={true}
                      />
                      {/* {modalField === true &&
                      createMeeting.MeetingDescription === "" ? (
                        <ErrorBar errorText={t("This-field-is-empty")} />
                      ) : null} */}
                    </Col>
                  </Row>

                  {/* <Row className="mt-2">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        onClick={navigateToAgenda}
                        className={"btn btn-primary meeting next"}
                        variant={"Primary"}
                        text="Next"
                      />
                    </Col>
                  </Row> */}
                </>
              ) : isAgenda ? (
                <>
                  {!endMeetingStatus ? (
                    <div className="agenda_container">
                      <Form onSubmit={addAnOtherAgenda}>
                        <Row>
                          <Col
                            lg={7}
                            md={7}
                            sm={12}
                            xs={12}
                            className="agenda-title-field CreateMeetingAgenda margin-bottom-10"
                          >
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"Title"}
                              value={objMeetingAgenda.Title}
                              applyClass="form-control2"
                              type="text"
                              placeholder={t("Agenda-title") + "*"}
                            />
                            {modalField === true &&
                            objMeetingAgenda.Title === "" ? (
                              <ErrorBar errorText={t("This-field-is-empty")} />
                            ) : null}
                          </Col>
                          <Col
                            lg={5}
                            md={5}
                            sm={12}
                            xs={12}
                            className="agenda-title-field CreateMeetingAgenda"
                          >
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"PresenterName"}
                              value={objMeetingAgenda.PresenterName}
                              applyClass="form-control2"
                              type="text"
                              placeholder={t("Presenter")}
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="agenda-title-field CreateMeetingAgenda"
                          >
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"URLs"}
                              value={objMeetingAgenda.URLs}
                              applyClass="form-control2"
                              type="text"
                              placeholder={t("Url")}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="d-flex justify-content-start flex-column margin-left-15"
                          >
                            <label>{t("Attachement")}</label>
                            <span className="custom-upload-input">
                              <CustomUpload
                                change={uploadFilesAgenda}
                                onClick={(event) => {
                                  event.target.value = null;
                                }}
                                className="UploadFileButton"
                              />
                              <Row>
                                {meetingAgendaAttachments
                                  .MeetingAgendaAttachments.length > 0
                                  ? meetingAgendaAttachments.MeetingAgendaAttachments.map(
                                      (data, index) => {
                                        var ext =
                                          data.DisplayAttachmentName.split(
                                            "."
                                          ).pop();
                                        const first =
                                          data.DisplayAttachmentName.split(
                                            " "
                                          )[0];
                                        if (first !== "") {
                                          return (
                                            <Col
                                              sm={12}
                                              lg={3}
                                              md={3}
                                              className="file-icon-updateMeeting"
                                            >
                                              {ext === "doc" ? (
                                                <FileIcon
                                                  extension={"docx"}
                                                  size={78}
                                                  type={"document"}
                                                  labelColor={
                                                    "rgba(44, 88, 152)"
                                                  }
                                                />
                                              ) : ext === "docx" ? (
                                                <FileIcon
                                                  extension={"docx"}
                                                  size={78}
                                                  type={"font"}
                                                  labelColor={
                                                    "rgba(44, 88, 152)"
                                                  }
                                                />
                                              ) : ext === "xls" ? (
                                                <FileIcon
                                                  extension={"xls"}
                                                  type={"spreadsheet"}
                                                  size={78}
                                                  labelColor={
                                                    "rgba(16, 121, 63)"
                                                  }
                                                />
                                              ) : ext === "xlsx" ? (
                                                <FileIcon
                                                  extension={"xls"}
                                                  type={"spreadsheet"}
                                                  size={78}
                                                  labelColor={
                                                    "rgba(16, 121, 63)"
                                                  }
                                                />
                                              ) : ext === "pdf" ? (
                                                <FileIcon
                                                  extension={"pdf"}
                                                  size={78}
                                                  {...defaultStyles.pdf}
                                                />
                                              ) : ext === "png" ? (
                                                <FileIcon
                                                  extension={"png"}
                                                  size={78}
                                                  type={"image"}
                                                  labelColor={
                                                    "rgba(102, 102, 224)"
                                                  }
                                                />
                                              ) : ext === "txt" ? (
                                                <FileIcon
                                                  extension={"txt"}
                                                  size={78}
                                                  type={"document"}
                                                  labelColor={
                                                    "rgba(52, 120, 199)"
                                                  }
                                                />
                                              ) : ext === "jpg" ? (
                                                <FileIcon
                                                  extension={"jpg"}
                                                  size={78}
                                                  type={"image"}
                                                  labelColor={
                                                    "rgba(102, 102, 224)"
                                                  }
                                                />
                                              ) : ext === "jpeg" ? (
                                                <FileIcon
                                                  extension={"jpeg"}
                                                  size={78}
                                                  type={"image"}
                                                  labelColor={
                                                    "rgba(102, 102, 224)"
                                                  }
                                                />
                                              ) : ext === "gif" ? (
                                                <FileIcon
                                                  extension={"gif"}
                                                  size={78}
                                                  {...defaultStyles.gif}
                                                />
                                              ) : (
                                                <FileIcon
                                                  extension={ext}
                                                  size={78}
                                                  {...defaultStyles.ext}
                                                />
                                              )}
                                              <span className="deleteBtn">
                                                <img
                                                  draggable="false"
                                                  src={
                                                    deleteButtonCreateMeeting
                                                  }
                                                  width={15}
                                                  height={15}
                                                  onClick={() =>
                                                    deleteAttachmentfromAgenda(
                                                      data,
                                                      index
                                                    )
                                                  }
                                                />
                                              </span>
                                              <p className="file-icon-updatemeeting-p">
                                                {first}
                                              </p>
                                            </Col>
                                          );
                                        }
                                      }
                                    )
                                  : null}
                              </Row>
                            </span>
                          </Col>
                        </Row>
                        <Button
                          style={{ display: "none" }}
                          onClick={addAnOtherAgenda}
                          className={
                            "modal-update-addagenda" + " " + currentLanguage
                          }
                          text={
                            editRecordFlag
                              ? t("Update-agenda")
                              : "+" + t("Add-agenda")
                          }
                        />
                      </Form>
                    </div>
                  ) : null}
                  <div
                    className={
                      endMeetingStatus
                        ? "agendaList update endmeeting"
                        : "agendaList update"
                    }
                  >
                    {createMeeting.MeetingAgendas.length > 0
                      ? createMeeting.MeetingAgendas.map((data, index) => {
                          return (
                            <div className="margin-top-20">
                              <Accordian
                                AccordioonHeader={data.ObjMeetingAgenda.Title}
                                AccordioonBody={
                                  <>
                                    <Row>
                                      <Col lg={2} md={2} sm={12} xs={6}>
                                        <Button
                                          disableBtn={endMeetingStatus}
                                          className={"btn editAgendaGridBtn"}
                                          variant={"Primary"}
                                          text={t("Edit")}
                                          onClick={() => editGrid(data, index)}
                                          datatut="show-agenda"
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={7} md={7} sm={12} xs={12}>
                                        <TextField
                                          disable={true}
                                          name={"Title"}
                                          value={data.ObjMeetingAgenda.Title}
                                          applyClass="form-control2"
                                          type="text"
                                          placeholder={t("Agenda-title")}
                                        />
                                      </Col>
                                      <Col lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                          disable={true}
                                          name={"PresenterName"}
                                          value={
                                            data.ObjMeetingAgenda.PresenterName
                                          }
                                          applyClass="form-control2"
                                          type="text"
                                          placeholder={t(
                                            "Presenter-Title-Placeholder"
                                          )}
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                          disable={true}
                                          name={"URLs"}
                                          value={data.ObjMeetingAgenda.URLs}
                                          applyClass="form-control2"
                                          type="text"
                                          placeholder={"URL"}
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      {data.MeetingAgendaAttachments.length > 0
                                        ? data.MeetingAgendaAttachments.map(
                                            (
                                              MeetingAgendaAttachmentsData,
                                              index
                                            ) => {
                                              var ext =
                                                MeetingAgendaAttachmentsData.DisplayAttachmentName.split(
                                                  "."
                                                ).pop();
                                              const first =
                                                MeetingAgendaAttachmentsData.DisplayAttachmentName.split(
                                                  " "
                                                )[0];
                                              return (
                                                <Col
                                                  sm={12}
                                                  lg={3}
                                                  md={3}
                                                  className="file-icon-updateMeeting"
                                                  onClick={(e) =>
                                                    downloadClick(
                                                      e,
                                                      MeetingAgendaAttachmentsData
                                                    )
                                                  }
                                                >
                                                  {ext === "doc" ? (
                                                    <FileIcon
                                                      extension={"docx"}
                                                      size={78}
                                                      type={"document"}
                                                      labelColor={
                                                        "rgba(44, 88, 152)"
                                                      }
                                                    />
                                                  ) : ext === "docx" ? (
                                                    <FileIcon
                                                      extension={"docx"}
                                                      size={78}
                                                      type={"font"}
                                                      labelColor={
                                                        "rgba(44, 88, 152)"
                                                      }
                                                    />
                                                  ) : ext === "xls" ? (
                                                    <FileIcon
                                                      extension={"xls"}
                                                      type={"spreadsheet"}
                                                      size={78}
                                                      labelColor={
                                                        "rgba(16, 121, 63)"
                                                      }
                                                    />
                                                  ) : ext === "xlsx" ? (
                                                    <FileIcon
                                                      extension={"xls"}
                                                      type={"spreadsheet"}
                                                      size={78}
                                                      labelColor={
                                                        "rgba(16, 121, 63)"
                                                      }
                                                    />
                                                  ) : ext === "pdf" ? (
                                                    <FileIcon
                                                      extension={"pdf"}
                                                      size={78}
                                                      {...defaultStyles.pdf}
                                                    />
                                                  ) : ext === "png" ? (
                                                    <FileIcon
                                                      extension={"png"}
                                                      size={78}
                                                      type={"image"}
                                                      labelColor={
                                                        "rgba(102, 102, 224)"
                                                      }
                                                    />
                                                  ) : ext === "txt" ? (
                                                    <FileIcon
                                                      extension={"txt"}
                                                      size={78}
                                                      type={"document"}
                                                      labelColor={
                                                        "rgba(52, 120, 199)"
                                                      }
                                                    />
                                                  ) : ext === "jpg" ? (
                                                    <FileIcon
                                                      extension={"jpg"}
                                                      size={78}
                                                      type={"image"}
                                                      labelColor={
                                                        "rgba(102, 102, 224)"
                                                      }
                                                    />
                                                  ) : ext === "jpeg" ? (
                                                    <FileIcon
                                                      extension={"jpeg"}
                                                      size={78}
                                                      type={"image"}
                                                      labelColor={
                                                        "rgba(102, 102, 224)"
                                                      }
                                                    />
                                                  ) : ext === "gif" ? (
                                                    <FileIcon
                                                      extension={"gif"}
                                                      size={78}
                                                      {...defaultStyles.gif}
                                                    />
                                                  ) : null}
                                                  <p className="text-center">
                                                    {first}
                                                  </p>
                                                </Col>
                                              );
                                            }
                                          )
                                        : null}
                                    </Row>
                                  </>
                                }
                              />
                            </div>
                          );
                        })
                      : null}
                  </div>
                </>
              ) : isAttendees ? (
                <>
                  {!endMeetingStatus ? (
                    <Row className="updatemeeting-attendees-row ">
                      <Col
                        lg={5}
                        md={5}
                        sm={12}
                        xs={12}
                        className="attendee-title-field inputSearchFilter CreateMeetingParticipant addattendee-textfield-Update"
                      >
                        <InputSearchFilter
                          placeholder={t("Add-attendees")}
                          value={taskAssignedToInput}
                          filteredDataHandler={searchFilterHandler(
                            taskAssignedToInput
                          )}
                          change={onChangeSearch}
                          applyClass={"input_searchAttendees_createMeeting"}
                        />
                      </Col>
                      <Col
                        lg={5}
                        md={5}
                        sm={12}
                        xs={12}
                        className="Atteendees-organizer-participant CreateMeetingReminder select-Update-participant-box"
                      >
                        <SelectBox
                          name="Participant"
                          width="100%"
                          placeholder={t("Participant") + "*"}
                          option={participantOptions}
                          value={participantRoleName}
                          change={assigntRoleAttendies}
                        />
                      </Col>
                      <Col lg={2} md={2} sm={12} xs={12} className="p-0">
                        <Button
                          className={"btn update-add-attendee-btn"}
                          text={t("Add")}
                          onClick={addAttendees}
                          disableBtn={
                            !taskAssignedToInput || !participantRoleName
                          }
                        />
                      </Col>
                    </Row>
                  ) : null}

                  <div className="updatemeeting-participant-scroll">
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="updatemeeting-participant-scroll-organizer"
                      >
                        <label>{t("Organizer")}</label>
                      </Col>
                      <Col lg={12} md={12} xs={12}>
                        {addedParticipantNameList ? (
                          <>
                            <span>
                              {addedParticipantNameList.map((atList, index) => {
                                if (atList.role === 1) {
                                  return (
                                    <EmployeeCard
                                      employeeName={atList.name}
                                      employeeDesignation={atList.designation}
                                      UserProfilePic={atList.displayProfilePic}
                                      organizer={
                                        atList.role === 1 && !endMeetingStatus
                                          ? true
                                          : false
                                      }
                                      IconOnClick={() =>
                                        handleDeleteAttendee(atList, index)
                                      }
                                    />
                                  );
                                } else if (atList.role === 3) {
                                  return (
                                    <EmployeeCard
                                      employeeName={atList.name}
                                      employeeDesignation={atList.designation}
                                      UserProfilePic={atList.displayProfilePic}
                                      organizer={
                                        atList.role === 3 && !endMeetingStatus
                                          ? false
                                          : true
                                      }
                                    />
                                  );
                                }
                              })}
                            </span>
                          </>
                        ) : null}
                      </Col>
                    </Row>

                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="updatemeeting-participant-scroll-participant"
                      >
                        <label>{t("Participants")}</label>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        {addedParticipantNameList ? (
                          <>
                            <span>
                              {addedParticipantNameList.map((atList, index) => {
                                if (atList.role === 2) {
                                  return (
                                    <EmployeeCard
                                      employeeName={atList.name}
                                      employeeDesignation={atList.designation}
                                      UserProfilePic={atList.displayProfilePic}
                                      organizer={
                                        !endMeetingStatus ? true : false
                                      }
                                      IconOnClick={() =>
                                        handleDeleteAttendee(atList, index)
                                      }
                                    />
                                  );
                                }
                              })}
                            </span>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                </>
              ) : isMinutes && minutesOftheMeatingStatus ? (
                <>
                  {endMeetingStatusForMinutes ? null : (
                    <form onSubmit={addMinutes}>
                      <Row className="align-items-center">
                        <Col
                          lg={10}
                          md={10}
                          sm={12}
                          className="CreateMeetingInput"
                        >
                          <TextField
                            placeholder={t("Enter-minutes")}
                            value={recordsMinutesOfTheMeeting.Description}
                            change={onChangeAddMinutes}
                            maxLength={65}
                          />
                        </Col>
                        <Col lg={2} md={2} sm={12} className="updateMinute">
                          <Button
                            className="btn btn-primary update-isminutes-addbtn"
                            text={t("Add")}
                            disableBtn={
                              recordsMinutesOfTheMeeting.Description !== ""
                                ? false
                                : true
                            }
                          />
                        </Col>
                      </Row>
                    </form>
                  )}

                  <Row className="updatemeetingofminutes-row">
                    <Col sm={12}>
                      <Row className="mt-3 minutes-view-2  px-3 d-flex flex-row ">
                        {minutesOfMeeting.length > 0 ? (
                          minutesOfMeeting.map(
                            (minutesOfMeetingLdata, index) => {
                              return (
                                <Col
                                  className="border p-2 minutes-box rounded my-2"
                                  sm={12}
                                  md={12}
                                  lg={12}
                                >
                                  <Row>
                                    <Col sm={1}>
                                      <span className="agendaIndex">
                                        {index + 1}
                                      </span>
                                    </Col>
                                    <Col sm={11}>
                                      <p className="updatemeetingofminutes-agendaTitle">
                                        {minutesOfMeetingLdata.Description}
                                      </p>
                                    </Col>
                                  </Row>
                                </Col>
                              );
                            }
                          )
                        ) : (
                          <Row className="updatemeeting-minutesofmeetings-none">
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className="d-flex justify-content-center align-items-center"
                            >
                              {/* <h3>There is no Minutes of the meeting</h3> */}
                              <h3>{t("There-is-no-minutes-of-meeting")}</h3>
                            </Col>
                          </Row>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : isPublishMeeting ? (
                <>
                  <Row className="confirmationDialogue ">
                    <Col lg={12} md={12} sm={12}>
                      <p className="publishMessageModal">
                        {t("Are-you-sure-you-want-to-update-meeting")}
                      </p>
                    </Col>
                  </Row>
                  {/* <Row className="updatemeeting-publishMeeting-btn">
                    <Col lg={6} md={6} xs={12} className="text-end">
                      <Button
                        className={"btn btn-primary meeting next cancel"}
                        text={t("Cancel")}
                        onClick={discardMeeting}
                      />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="text-start">
                      <Button
                        className={"btn btn-primary meeting next submit"}
                        text={t("Update")}
                        onClick={handleSubmit}
                      />
                    </Col>
                  </Row> */}
                </>
              ) : isCancelMeetingModal ? (
                <>
                  <Row className="confirmationDialogue">
                    <Col lg={12} md={12} sm={12}>
                      <p className="publishMessageModal">
                        {t("Are-you-sure-you-want-to-cancel-meeting")}
                      </p>
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isDetails ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        onClick={navigateToAgenda}
                        className={
                          "MontserratSemiBold-600 btn btn-primary modal-update-meeting-details "
                        }
                        variant={"Primary"}
                        text={t("Next")}
                      />
                    </Col>
                  </Row>
                </>
              ) : isAgenda ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-between"
                    >
                      <Button
                        disableBtn={endMeetingStatus}
                        onClick={addAnOtherAgenda}
                        className={
                          "MontserratSemiBold-600 modal-update-addagenda" +
                          " " +
                          currentLanguage
                        }
                        text={
                          editRecordFlag
                            ? t("Update-agenda")
                            : " + " + t("Add-agenda")
                        }
                      />
                      <Button
                        onClick={navigateToAttendees}
                        className={
                          "MontserratSemiBold-600 btn btn-primary modal-update-meeting"
                        }
                        text={t("Next")}
                      />
                    </Col>
                  </Row>
                </>
              ) : isAttendees ? (
                <>
                  {minutesOftheMeatingStatus ? (
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          className={
                            "MontserratSemiBold-600 btn btn-primary modal-update-meeting"
                          }
                          text={t("Next")}
                          onClick={navigateToMinutes}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          className={
                            "MontserratSemiBold-600 btn btn-primary update-modal-discard-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Discard-changes")}
                          onClick={discardMeeting}
                        />
                        <Button
                          disableBtn={endMeetingStatus}
                          className={
                            "MontserratSemiBold-600 btn btn-primary cancel-meeting-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Cancel-meeting")}
                          onClick={cancelMeetingConfirmation}
                        />
                        <Button
                          className={
                            "MontserratSemiBold-600 btn btn-primary publish-meeting-btn"
                          }
                          text={t("Publish")}
                          onClick={handleSubmit}
                        />
                      </Col>
                    </Row>
                  )}
                </>
              ) : isMinutes && minutesOftheMeatingStatus ? (
                <>
                  {endMeetingStatusForMinutes ? (
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          className={
                            "MontserratSemiBold-600 btn btn-primary ismeeting-finish-btn"
                          }
                          text={t("Publish")}
                          onClick={navigateToPublish}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="d-flex justify-content-end align-items-center"
                      >
                        <Button
                          className={
                            "MontserratSemiBold-600 btn btn-primary isminutes-discard-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Discard-changes")}
                          onClick={discardMeeting}
                        />
                        <Button
                          disableBtn={endMeetingStatus}
                          className={
                            "MontserratSemiBold-600 btn btn-primary isminutes-cancel-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Cancel-meeting")}
                          onClick={cancelMeetingConfirmation}
                        />
                        <Button
                          className={
                            "MontserratSemiBold-600 btn btn-primary ismeeting-finish-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Publish")}
                          onClick={navigateToPublish}
                        />
                      </Col>
                    </Row>
                  )}
                </>
              ) : isPublishMeeting ? (
                <>
                  <Row className="updatemeeting-publishMeeting-btn ">
                    <Col lg={6} md={6} xs={12} className="text-end">
                      <Button
                        className={"modalupdate_CancelBtn"}
                        text={t("Cancel")}
                        onClick={discardMeeting}
                      />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="text-start">
                      <Button
                        className={"modalupdate_updatebtn"}
                        text={t("Update")}
                        onClick={handleSubmit}
                      />
                    </Col>
                  </Row>
                </>
              ) : isCancelMeetingModal ? (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center gap-3 mt-4"
                  >
                    <Button
                      className={"btn  cancelmeetingmodalgoBackbtn"}
                      text={t("Go-back")}
                      onClick={goBack}
                    />
                    <Button
                      className={"btn cancelmeetingmodalcancelbtn "}
                      text={t("Cancel")}
                      onClick={cancelMeeting}
                    />
                  </Col>
                </Row>
              ) : null}
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalUpdate;
