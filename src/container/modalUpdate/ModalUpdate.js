import React, { useState, useEffect } from "react";
import "./ModalUpdate.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import { RemoveTimeDashes } from "../../commen/functions/date_formater";
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
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import CustomUpload from "../../components/elements/upload/Upload";
import { CameraVideo } from "react-bootstrap-icons";
import { DateObject } from "react-multi-date-picker";
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

const ModalUpdate = ({ editFlag, setEditFlag, setModalsflag, ModalTitle }) => {
  //For Localization
  const { t } = useTranslation();

  let currentLanguage = localStorage.getItem("i18nextLng");

  const dispatch = useDispatch();
  const { assignees, uploadReducer, minuteofMeetingReducer } = useSelector(
    (state) => state
  );
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

  //Get Current User ID
  let createrID = localStorage.getItem("UserID");

  //Attendees States
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  // const [isValid, setValid] = useState(false);

  const [meetingDate, setMeetingDate] = useState("");

  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
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
    // MinutesOfMeeting: [],
  });
  const [minutesOfMeeting, setMinutesOfMeeting] = useState([]);
  function validateEmail(email) {
    const re =
      /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/;
    return re.test(String(email).toLowerCase());
  }

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

  useEffect(() => {
    if (currentLanguage != undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
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
    console.log("Pehla Buton");
  };

  const changeSelectAgenda = () => {
    console.log("fieldsvalue createmeeting", createMeeting);
    setModalField(false);
    if (
      createMeeting.MeetingStartTime != "" &&
      createMeeting.MeetingEndTime != "" &&
      createMeeting.MeetingDate != "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation != "" &&
      createMeeting.MeetingTitle != ""
    ) {
      console.log("fieldsvalue ifcheck");
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(true);
      setIsAttendees(false);
      setIsMinutes(false);
      setCancelMeetingModal(false);
    } else {
      console.log("fieldsvalue elseCheck");
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(false);
      setCancelMeetingModal(false);
    }
  };

  const changeSelectAttendees = () => {
    console.log("fieldsvalue createmeeting", createMeeting);
    setModalField(false);
    if (
      createMeeting.MeetingStartTime != "" &&
      createMeeting.MeetingEndTime != "" &&
      createMeeting.MeetingDate != "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation != "" &&
      createMeeting.MeetingTitle != ""
    ) {
      console.log("fieldsvalue ifcheck");
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(true);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
    } else {
      console.log("fieldsvalue elseCheck");
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
      createMeeting.MeetingStartTime != "" &&
      createMeeting.MeetingEndTime != "" &&
      createMeeting.MeetingDate != "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation != "" &&
      createMeeting.MeetingTitle != ""
    ) {
      console.log("fieldsvalue ifcheck");
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(true);
    } else {
      console.log("fieldsvalue elseCheck");
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
    console.log("fieldsvalue createmeeting", createMeeting);
    setModalField(false);
    if (
      createMeeting.MeetingStartTime != "" &&
      createMeeting.MeetingEndTime != "" &&
      createMeeting.MeetingDate != "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation != "" &&
      createMeeting.MeetingTitle != ""
    ) {
      console.log("fieldsvalue ifcheck");
      setModalField(false);
      setIsDetails(false);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
      setIsAgenda(true);
      setIsAttendees(false);
    } else {
      console.log("fieldsvalue elseCheck");
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsMinutes(false);
      setIsPublishMeeting(false);
      setCancelMeetingModal(false);
      setIsAttendees(false);
    }

    console.log("fieldsvalue");
  };

  const navigateToAttendees = () => {
    if (createMeeting.MeetingAgendas.length > 0) {
      setIsAgenda(false);
      setIsAttendees(true);
      console.log("agayaattendee");
    } else {
      setIsAgenda(true);
      setIsAttendees(false);
      setOpen({
        ...open,
        flag: true,
        message: t("Please-Atleast-Add-One-Agenda"),
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
    if (minutesOftheMeatingStatus) {
      if (endMeetingStatus2) {
        let Data = { MinutesOfMeeting: minutesOfMeeting };
        await setModalField(false);
        await setIsPublishMeeting(false);
        await setEditFlag(false);
        await seteditRecordIndex(null);
        await seteditRecordFlag(false);
        await setModalsflag(false);
        await setIsDetails(true);
        await setIsMinutes(false);
        await setIsAgenda(false);
        await setMinutesOftheMeatingStatus(false);
        // await dispatch(addMinutesofMeetings(Data));
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
      } else {
        let Data = { MinutesOfMeeting: minutesOfMeeting };
        await setModalField(false);
        await setIsPublishMeeting(false);
        await setEditFlag(false);
        await seteditRecordIndex(null);
        await seteditRecordFlag(false);
        await setModalsflag(false);
        await setIsDetails(true);
        await setIsMinutes(false);
        await setIsAgenda(false);
        await setMinutesOftheMeatingStatus(false);
        await dispatch(addMinutesofMeetings(Data));
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
      console.log("recordsMinutesOfTheMeeting", minutesOfMeeting);
    } else {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsMinutes(false);
      setIsPublishMeeting(true);
    }
  };

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Organizer"), id: 1 },
    { label: t("Participant-Dropdown"), id: 2 },
  ];

  // for Participant options
  const participantOptions = [t("Organizer"), t("Participant-Dropdown")];

  // Reminder handler
  const ReminderNameHandler = (e, value) => {
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
  };

  const [valueDate, setValueDate] = useState("");

  // for all details handler
  const detailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    setModalField(true);
    console.log("detailsHandler", name, value);
    if (name === "MeetingStartTime") {
      console.log("MeetingStartTime", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: RemoveTimeDashes(value),
        ["MeetingEndTime"]: RemoveTimeDashes(value),
      });
    }
    // else if (name === "MeetingDate") {
    //   console.log("MeetingDate", name, value);
    //   setCreateMeeting({
    //     ...createMeeting,
    //     [name]: value,
    //   });
    // }
    else if (name === "MeetingLocation") {
      console.log("MeetingLocation", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingTitle") {
      console.log("MeetingTitle", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingDescription") {
      console.log("MeetingDescription", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingTypeID" && (value === "" || value === 0)) {
      console.log("MeetingTypeID", name, value);
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
      recordsMinutesOfTheMeeting.Description != "" &&
      recordsMinutesOfTheMeeting.Description.trim() !== ""
    ) {
      let newMeeting = minutesOfMeeting;
      console.log("recordsMinutesOfTheMeeting", newMeeting);
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
    console.log("agendaHandler", name, value);
    if (name === "Title") {
      console.log("Title", name, value);
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        ["PK_MAID"]: objMeetingAgenda.PK_MAID,
        [name]: valueCheck.trimStart(),
        ["FK_MDID"]: assignees.ViewMeetingDetails.meetingDetails.pK_MDID,
      });
    } else if (name === "PresenterName") {
      console.log("PresenterName", name, value);
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
        ["FK_MDID"]: assignees.ViewMeetingDetails.meetingDetails.pK_MDID,
      });
    } else if (name === "URLs") {
      console.log("URLs", name, value);
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
    console.log("uploadedFile", uploadedFile, uploadFilePath);
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
      ext === "gif"
    ) {
      let data;
      let sizezero;
      let size;
      if (file.length > 0) {
        console.log("uploadFile ReducerData");
        file.map((filename, index) => {
          if (filename.DisplayFileName === uploadedFile.name) {
            console.log("uploadFile ReducerData");
            data = false;
          }
        });
        if (uploadedFile.size > 10000000) {
          console.log("uploadFile ReducerData");
          size = false;
        } else if (uploadedFile.size === 0) {
          console.log("uploadFile ReducerData");
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
          dispatch(FileUploadToDo(uploadedFile));
        }
      } else {
        console.log("uploadFile ReducerData");
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
            message: t("File-Size-is-0MB"),
          });
          console.log("uploadFile ReducerData");
          sizezero = false;
        }
        if (size === false) {
          console.log("uploadFile ReducerData");
        } else if (sizezero === false) {
          console.log("uploadFile ReducerData");
        } else {
          console.log("uploadFile ReducerData");

          dispatch(FileUploadToDo(uploadedFile));
        }
      }
    }
  };
  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    console.log("DownloadFile", data);
    dispatch(DownloadFile(data));
  };

  useEffect(() => {
    console.log("useEffect(() => {");
    let newData = uploadReducer.uploadDocumentsList;
    let MeetingAgendaAttachment =
      meetingAgendaAttachments.MeetingAgendaAttachments;
    console.log("uploadFile ReducerData", newData);
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
      console.log("addAnOtherAgenda", objMeetingAgenda);
      if (objMeetingAgenda.Title !== "") {
        if (objMeetingAgenda.URLs !== "") {
          if (urlPatternValidation(objMeetingAgenda.URLs)) {
            let newData = {
              ObjMeetingAgenda: objMeetingAgenda,
              MeetingAgendaAttachments:
                meetingAgendaAttachments.MeetingAgendaAttachments,
            };
            console.log("addAnOtherAgenda", previousAdendas);

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
              message: t("Enter-Valid-URL"),
            });
          }
        } else {
          let newData = {
            ObjMeetingAgenda: objMeetingAgenda,
            MeetingAgendaAttachments:
              meetingAgendaAttachments.MeetingAgendaAttachments,
          };
          console.log("addAnOtherAgenda", previousAdendas);

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
        console.log("addAnOtherAgenda");
        setModalField(true);
        setOpen({
          ...open,
          flag: true,
          message: t("Enter-Title-Information"),
        });
      }
      // if (objMeetingAgenda.Title === "") {
      //   setModalField(true);
      // } else if (objMeetingAgenda.URLs != "") {
      //   if (urlPatternValidation(objMeetingAgenda.URLs)) {
      //     let newData = {
      //       ObjMeetingAgenda: objMeetingAgenda,
      //       MeetingAgendaAttachments:
      //         meetingAgendaAttachments.MeetingAgendaAttachments,
      //     };
      //     previousAdendas[editRecordIndex] = newData;

      //     setCreateMeeting({
      //       ...createMeeting,
      //       ["MeetingAgendas"]: previousAdendas,
      //     });
      //     seteditRecordIndex(null);
      //     seteditRecordFlag(false);
      //     setObjMeetingAgenda({
      //       Title: "",
      //       PresenterName: "",
      //       URLs: "",
      //       FK_MDID: 0,
      //     });
      //     setMeetingAgendaAttachments({
      //       MeetingAgendaAttachments: [],
      //     });
      //   } else {
      //     setOpen({
      //       ...open,
      //       flag: true,
      //       message: "Enter Valid URL",
      //     });
      //   }
      // } else {
      //   setModalField(false);
      //   let newData = {
      //     ObjMeetingAgenda: objMeetingAgenda,
      //     MeetingAgendaAttachments:
      //       meetingAgendaAttachments.MeetingAgendaAttachments,
      //   };
      //   previousAdendas[editRecordIndex] = newData;

      //   setCreateMeeting({
      //     ...createMeeting,
      //     ["MeetingAgendas"]: previousAdendas,
      //   });
      //   seteditRecordIndex(null);
      //   setObjMeetingAgenda({
      //     Title: "",
      //     PresenterName: "",
      //     URLs: "",
      //     FK_MDID: 0,
      //   });
      //   setMeetingAgendaAttachments({
      //     MeetingAgendaAttachments: [],
      //   });
      // }
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
              message: t("Enter-Valid-URL"),
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
    console.log("checked ", e.target.checked);
    setCreateMeeting({
      ...createMeeting,
      ["IsChat"]: e.target.checked,
    });
    console.log("createMeetingChecked", createMeeting);
  }

  function videoEnableButton() {
    // console.log("videoEnableButton", e.target.name, e.target.value);
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
            console.log("meetingAttendees 1assigntRoleAttendies", newData);

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

      setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
      setAddedParticipantNameList(List);
      dispatch(allAssignessList(1));
      dispatch(GetAllReminders());
    } else {
      setEditFlag(false);
      seteditRecordIndex(null);
      seteditRecordFlag(false);
      dispatch(cleareAssigneesState());
      setModalsflag(false);
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
      // setMeetingReminderValue("");
      // setMeetingReminderID([]);
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
      console.log("assignees.user", assignees.user);
    }
  }, [assignees.user]);

  // for  list of all assignees  drop down
  useEffect(() => {
    let user = meetingAttendeesList;
    if (user != undefined) {
      if (meetingAttendeesList.length > 0) {
        console.log("meetingAttendeesList123123", meetingAttendeesList);

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
    if (addedParticipantNameList != undefined) {
      if (addedParticipantNameList.length > 0) {
        console.log("addedParticipantNameList", addedParticipantNameList);
      }
    }
  }, [addedParticipantNameList]);

  // for fetch data for edit from grid

  const meetingDateHandler = (date, format = "YYYYMMDD") => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let meetingDateSaveFormat = new DateObject(date).format("YYYYMMDD");
    setMeetingDate(meetingDateValueFormat);
    setCreateMeeting({
      ...createMeeting,
      MeetingDate: meetingDateSaveFormat,
    });
  };

  // for view data
  useEffect(() => {
    if (Object.keys(assignees.ViewMeetingDetails).length > 0) {
      console.log("ViewMeetingDetails", assignees.ViewMeetingDetails);
      let viewData = assignees.ViewMeetingDetails;
      console.log("ViewMeetingDetails", assignees.ViewMeetingDetails);

      let reminder = [];
      let meetingAgenAtc = [];
      let minutesOfMeetings = [];
      let externalMeetingAttendiesList = [];
      let meetingStatus = assignees.ViewMeetingDetails.meetingStatus.status;
      if (meetingStatus === "2") {
        console.log("meetingStatusmeetingStatusmeetingStatus", meetingStatus);
        setMinutesOftheMeatingStatus(true);
        setEndMeetingStatus(true);
        setEndMeetingStatusForMinutes(false);
        setEndMeetingStatus2(false);
      } else if (meetingStatus === "3") {
        console.log("meetingStatusmeetingStatusmeetingStatus", meetingStatus);
        setMinutesOftheMeatingStatus(true);
        setEndMeetingStatus(true);
        setEndMeetingStatus2(false);
        setEndMeetingStatusForMinutes(false);
      } else if (meetingStatus === "4") {
        console.log("meetingStatusmeetingStatusmeetingStatus", meetingStatus);
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
        if (viewData.meetingAttendees != undefined) {
          if (viewData.meetingAttendees.length > 0) {
            viewData.meetingAttendees.map((meetingdata, index) => {
              console.log("meetingdata", emptyList);
              List.push({
                name: meetingdata.user.name,
                designation: meetingdata.user.designation,
                profilePicture: meetingdata.user.profilePicture,
                organization: meetingdata.user.organization,
                role: meetingdata.meetingAttendeeRole.pK_MARID,
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
        if (viewData.externalMeetingAttendees != undefined) {
          if (viewData.externalMeetingAttendees.length > 0) {
            viewData.externalMeetingAttendees.map(
              (externalMeetingAttendeesMeetingdata, index) => {
                console.log("meetingdata", externalMeetingAttendeesMeetingdata);
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
          console.log("atchmenData", atchmenData);
          let opData = {
            PK_MAID: atchmenData.objMeetingAgenda.pK_MAID,
            Title: atchmenData.objMeetingAgenda.title,
            PresenterName: atchmenData.objMeetingAgenda.presenterName,
            URLs: atchmenData.objMeetingAgenda.urLs,
            FK_MDID: atchmenData.objMeetingAgenda.fK_MDID,
          };
          let file = [];
          if (atchmenData.meetingAgendaAttachments !== null) {
            atchmenData.meetingAgendaAttachments.map((atchmenDataaa, index) => {
              file.push({
                PK_MAAID: atchmenDataaa.pK_MAAID,
                DisplayAttachmentName: atchmenDataaa.displayAttachmentName,
                OriginalAttachmentName: atchmenDataaa.originalAttachmentName,
                CreationDateTime: atchmenDataaa.creationDateTime,
                FK_MAID: atchmenDataaa.fK_MAID,
              });
            });
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
      console.log("externalMeetingAttendiesList", externalMeetingAttendiesList);
      // let newUdate = moment(viewData.meetingEvent.meetingDate).format(
      //   "YYYY/MM/DD hh:mm:ss a"
      // );
      // console.log("newUdatenewUdatenewUdate", newUdate);
      // setValueDate(newUdate);
      // let format = "YYYYMMDD";
      // var year = moment(viewData.meetingEvent.meetingDate).format("YYYY");
      // var month = moment(viewData.meetingEvent.meetingDate).format("MM");
      // var day = moment(viewData.meetingEvent.meetingDate).format("DD");
      // var d = new DateObject().set({
      //   year: year,
      //   month: month,
      //   day: day,
      //   format,
      // });
      setMeetingDate(
        moment(viewData.meetingEvent.meetingDate, "YYYYMMDD").format(
          "DD/MM/YYYY"
        )
      );
      setCreateMeeting({
        MeetingID: viewData.meetingDetails.pK_MDID,
        MeetingTitle: viewData.meetingDetails.title,
        MeetingDescription: viewData.meetingDetails.description,
        MeetingTypeID: viewData.meetingDetails.fK_MTID,
        MeetingDate: viewData.meetingEvent.meetingDate,
        IsChat: viewData.meetingDetails.isChat,
        IsVideoCall: viewData.meetingDetails.isVideoCall,
        // MeetingDate: "",
        MeetingStartTime: viewData.meetingEvent.startTime,
        // MeetingStartTime: "",
        MeetingEndTime: viewData.meetingEvent.endTime,
        // MeetingEndTime: "",
        MeetingLocation: viewData.meetingEvent.location,
        MeetingReminderID: reminder,
        MeetingAgendas: meetingAgenAtc,
        MeetingAttendees: emptyList,
        ExternalMeetingAttendees: externalMeetingAttendiesList,
        // MinutesOfMeeting: minutesOfMeetings,
      });
      setMinutesOfMeeting(minutesOfMeetings);
    }
  }, [assignees.ViewMeetingDetails]);

  const editGrid = (datarecord, dataindex) => {
    console.log("editGrideditGrid", datarecord);
    seteditRecordIndex(dataindex);
    seteditRecordFlag(true);
    // Title: "",
    // PresenterName: "",
    // URLs: "",
    // FK_MDID: 0,
    // datarecord.ObjMeetingAgenda
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
  console.log("editGrid 12", meetingAgendaAttachments, objMeetingAgenda);

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
    let allAssignees = assignees.user;
    console.log("Input Value", value);
    if (
      allAssignees != undefined &&
      allAssignees != null &&
      allAssignees != NaN &&
      allAssignees != []
    ) {
      return allAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          return (
            searchTerm &&
            assigneesName.startsWith(searchTerm) &&
            assigneesName !== searchTerm
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex flex-row align-items-center"
            key={item.pK_UID}
          >
            {console.log("itemitem", item)}
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
      console.log("not found");
    }
  };

  // for add Attendees handler
  const addAttendees = () => {
    console.log(
      "Attendees values",
      taskAssignedToInput,
      taskAssignedName,
      taskAssignedTo
    );
    // let value = e.target.value;
    let user1 = createMeeting.MeetingAttendees;
    let List = addedParticipantNameList;
    let externaluser = externalMeetingAttendees;

    let found = user1.find((element) => element.User.PK_UID === taskAssignedTo);
    let found2 = externaluser.find(
      (element) => element.EmailAddress === taskAssignedToInput
    );

    if (taskAssignedTo !== 0) {
      if (found != undefined) {
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
        console.log("DESIGNATIONDESIGNATION", taskAssignedTo);
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
      if (validateEmail(taskAssignedToInput)) {
        if (found2 === undefined) {
          if (meetingAttendees.MeetingAttendeeRole.PK_MARID === 2) {
            externaluser.push({
              PK_EMAID: 0,
              EmailAddress: taskAssignedToInput,
              FK_MDID: 0,
            });
            List.push({
              name: taskAssignedToInput,
              designation: "Default Designation",
              profilePicture: "Default Picture",
              organization: "Default Organization",
              role: meetingAttendees.MeetingAttendeeRole.PK_MARID,
            });

            setCreateMeeting({
              ...createMeeting,
              ["ExternalMeetingAttendees"]: externaluser,
            });
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
          } else {
            setOpen({
              ...open,
              flag: true,
              message: t("External-attendees-can't-be-organizer"),
            });
            setTaskAssignedTo(0);
            setTaskAssignedName("");
            setParticipantRoleName("");
            setTaskAssignedToInput("");
          }
        } else {
          setOpen({
            ...open,
            flag: true,
            message: t("Email-already-exists"),
          });
          setTaskAssignedTo(0);
          setTaskAssignedName("");
          setParticipantRoleName("");
          setTaskAssignedToInput("");
        }
      } else {
        setTaskAssignedTo(0);
        setTaskAssignedName("");
        setParticipantRoleName("");
        setTaskAssignedToInput("");
        setOpen({
          ...open,
          flag: true,
          message: t("Enter-Valid-Email-Address"),
        });
      }
    }
  };

  // for attendies handler
  const handleSubmit = async () => {
    await setEditFlag(false);
    await seteditRecordIndex(null);
    await seteditRecordFlag(false);
    await setModalsflag(false);
    await setIsDetails(true);
    await setIsMinutes(false);
    await setIsAgenda(false);
    await setIsAttendees(false);
    await dispatch(UpdateMeeting(createMeeting));
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
    await setModalsflag(false);
    await setIsDetails(true);
    await setIsMinutes(false);
    await setIsAgenda(false);
    await setIsAttendees(false);
    let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    let Data = {
      MeetingID: meetingID,
    };
    // console.log("DATATTATATATATAT", Data);
    await dispatch(CancelMeeting(Data));
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
    setModalsflag(false);
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
    setModalsflag(false);
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
        await setModalsflag(false);
        await setIsDetails(false);
        await setIsMinutes(false);
        await setIsAgenda(false);
        await setMinutesOftheMeatingStatus(false);
        // await dispatch(addMinutesofMeetings(Data));
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
        await setModalsflag(false);
        await setIsDetails(true);
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

    // console.log("meetingAgendasmeetingAgendasmeetingAgendasmeetingAgendasmeetingAgendasmeetingAgendas", meetingAgendas)
    // console.log("meetingAgendasmeetingAgendasmeetingAgendasmeetingAgendasmeetingAgendasmeetingAgendas", attachmentdata.PK_MAAID)
  };
  const handleDeleteAttendee = (data, index) => {
    // let meetingAttendees = createMeeting.MeetingAttendees;
    let user1 = createMeeting.MeetingAttendees;
    let List = addedParticipantNameList;
    console.log("user1user1", user1);
    console.log("user1user1", List);
    console.log("Datadatadata", data, index);

    user1.splice(index, 1);
    addedParticipantNameList.splice(index, 1);
    setAddedParticipantNameList(addedParticipantNameList);
    console.log("Datadatadata", addedParticipantNameList);
    setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
    // setMeetingAgendaAttachments({
    //   ...meetingAgendaAttachments,
    //   ["MeetingAgendaAttachments"]: searchIndex,
    // });
    // console.log("datadatadata1123123", user1)
    // console.log("datadatadata1123123", addedParticipantNameList)
  };
  console.log(
    "assignees, uploadReducer, minuteofMeetingReducer",
    assignees,
    uploadReducer,
    minuteofMeetingReducer
  );

  useEffect(() => {
    if (
      minuteofMeetingReducer.AddMeetingofMinutesMessage !== "" &&
      minuteofMeetingReducer !== undefined
    ) {
      setOpen({
        ...open,
        flag: true,
        message: minuteofMeetingReducer.AddMeetingofMinutesMessage,
      });
    }
    dispatch(HideMinuteMeetingMessage());
  }, [minuteofMeetingReducer.AddMeetingofMinutesMessage]);

  console.log("createMeetingUpdate", createMeeting);

  return (
    <>
      <Container>
        <Modal
          show={editFlag}
          setShow={setEditFlag}
          className="modaldialog createModalMeeting"
          ButtonTitle={ModalTitle}
          setModalField={setModalField}
          modalField={modalField}
          modalBodyClassName="modalMeetingUpdateBody"
          modalFooterClassName="modalMeetingUpdateFooter"
          modalHeaderClassName={
            isPublishMeeting === true
              ? "d-none"
              : isCancelMeetingModal === true
              ? "d-none"
              : "modalMeetingUpdateHeader"
          }
          size={
            isPublishMeeting === true
              ? "sm"
              : isCancelMeetingModal === true
              ? "sm"
              : "lg"
          }
          ModalBody={
            <>
              {isPublishMeeting === false && isCancelMeetingModal === false ? (
                <Row>
                  <Col lg={2} md={2} xs={12} className="p-0 margin-left-10">
                    <Button
                      className={
                        isDetails
                          ? "btn btn-primary meeting"
                          : "btn btn-outline-primary meeting"
                      }
                      variant={"Primary"}
                      text={t("Details-Button-Heading")}
                      onClick={changeSelectDetails}
                    />
                  </Col>
                  <Col lg={2} md={2} xs={12} className="agenda-upper-button">
                    <Button
                      className={
                        isAgenda
                          ? "btn btn-primary meeting"
                          : "btn btn-outline-primary meeting"
                      }
                      variant={"Primary"}
                      text={t("Agendas-Button-Heading")}
                      onClick={changeSelectAgenda}
                      datatut="show-agenda"
                    />
                  </Col>
                  <Col lg={2} md={2} xs={12} className="attendees-upper-button">
                    <Button
                      className={
                        isAttendees
                          ? "btn btn-primary meeting"
                          : "btn btn-outline-primary meeting"
                      }
                      variant={"Primary"}
                      text={t("Attendees-Button-Heading")}
                      datatut="show-meeting-attendees"
                      onClick={changeSelectAttendees}
                    ></Button>
                  </Col>
                  {minutesOftheMeatingStatus ? (
                    <Col lg={2} md={2} xs={12} className="minutes-upper-btn">
                      <Button
                        className={
                          isMinutes
                            ? "btn btn-primary meeting"
                            : "btn btn-outline-primary meeting"
                        }
                        variant={"Primary"}
                        text={t("Minutes-Button")}
                        datatut="show-minutes"
                        onClick={changeSelectMinutes}
                      ></Button>
                    </Col>
                  ) : null}

                  <Col lg={4} md={4} xs={12} className="p-0"></Col>
                </Row>
              ) : null}
              {isDetails ? (
                <>
                  <Row className="udpateeetingtime-row-1">
                    <Col lg={2} md={2} xs={12} className="CreateMeetingTime">
                      <TimePickers
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        placeholder={"00:00"}
                        name="MeetingStartTime"
                        value={createMeeting.MeetingStartTime}
                        required
                      />
                      {modalField === true &&
                      createMeeting.MeetingStartTime === "" ? (
                        <ErrorBar errorText={t("SelectTime")} />
                      ) : null}
                    </Col>
                    <Col lg={2} md={2} xs={12} className="CreateMeetingDate">
                      <MultiDatePicker
                        onChange={meetingDateHandler}
                        name="MeetingDate"
                        value={meetingDate}
                        calendar={calendarValue}
                        locale={localValue}
                        disabled={endMeetingStatus}
                      />
                      {modalField === true &&
                      createMeeting.MeetingDate === "" ? (
                        <ErrorBar errorText={t("SelectDate")} />
                      ) : null}
                    </Col>
                    <Col lg={4} md={4} xs={12}></Col>
                    <Col
                      lg={4}
                      md={4}
                      xs={12}
                      className="CreateMeetingReminder"
                    >
                      <SelectBox
                        disable={endMeetingStatus}
                        name="MeetingReminderID"
                        placeholder={t("Reminder-Placeholder")}
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
                    <Col lg={1} md={1} xs={12} className="CreateMeetingInput">
                      <Button
                        disableBtn={endMeetingStatus}
                        text={<CameraVideo />}
                        name="IsVideoCall"
                        className={
                          createMeeting.IsVideoCall === false
                            ? "cameraButton"
                            : "cameraButton Enable"
                        }
                        onClick={videoEnableButton}
                      />
                    </Col>
                    <Col lg={7} md={7} xs={12} className="CreateMeetingInput">
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        name="MeetingLocation"
                        applyClass="form-control2"
                        type="text"
                        placeholder={t("Location-Placeholder")}
                        value={createMeeting.MeetingLocation}
                        required={true}
                      />
                      {modalField === true &&
                      createMeeting.MeetingLocation === "" ? (
                        <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                      ) : null}
                    </Col>
                    <Col lg={4} md={4} xs={12} className="CreateCheckbox">
                      <Checkbox
                        disabled={endMeetingStatus}
                        className="SearchCheckbox"
                        name="IsChat"
                        label={t("Group-Chat-Button")}
                        checked={createMeeting.IsChat}
                        onChange={onChange}
                        classNameDiv="checkboxParentClass"
                      ></Checkbox>
                    </Col>
                  </Row>

                  <Row className="updatemeetingvideoiconbtrrow">
                    <Col lg={12} md={12} xs={12} className="CreateMeetingInput">
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        value={createMeeting.MeetingTitle}
                        name="MeetingTitle"
                        applyClass={"form-control2"}
                        type="text"
                        size="small"
                        placeholder={t("Meeting-Title-Placeholder")}
                        required={true}
                        maxLength={200}
                      />
                      {modalField === true &&
                      createMeeting.MeetingTitle === "" ? (
                        <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="updatemeetingtextarearow">
                    <Col
                      lg={12}
                      md={12}
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
                        placeholder={t("Description-Placeholder")}
                        value={createMeeting.MeetingDescription}
                        required={true}
                      />
                      {modalField === true &&
                      createMeeting.MeetingDescription === "" ? (
                        <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                      ) : null}
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
                            xs={12}
                            className="CreateMeetingAgenda margin-bottom-10"
                          >
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"Title"}
                              value={objMeetingAgenda.Title}
                              applyClass="form-control2"
                              type="text"
                              placeholder={t("Agenda-Title-Placeholder")}
                            />
                            {modalField === true &&
                            objMeetingAgenda.Title === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                          <Col
                            lg={5}
                            md={5}
                            xs={12}
                            className="CreateMeetingAgenda"
                          >
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"PresenterName"}
                              value={objMeetingAgenda.PresenterName}
                              applyClass="form-control2"
                              type="text"
                              placeholder={t("Presenter-Title-Placeholder")}
                            />
                          </Col>
                        </Row>

                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="CreateMeetingAgenda"
                          >
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"URLs"}
                              value={objMeetingAgenda.URLs}
                              applyClass="form-control2"
                              type="text"
                              placeholder={t("URL-Title-Placeholder")}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="d-flex justify-content-start flex-column margin-left-15"
                          >
                            <label>{t("Attachement-Button-Icon")}</label>
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
                                              <FileIcon
                                                extension={ext}
                                                {...defaultStyles.ext}
                                              />
                                              <span className="deleteBtn">
                                                <img
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
                              ? t("Update-Agenda-Button")
                              : t("Add-Agenda-Button")
                          }
                        />
                      </Form>
                    </div>
                  ) : null}

                  {console.log(
                    "createMeeting.MeetingAgendasin out",
                    createMeeting.MeetingAgendas.length > 0
                  )}
                  <div
                    className={
                      endMeetingStatus
                        ? "agendaList update endmeeting"
                        : "agendaList update"
                    }
                  >
                    {createMeeting.MeetingAgendas.length > 0
                      ? createMeeting.MeetingAgendas.map((data, index) => {
                          {
                            console.log("createMeeting.MeetingAgendasin", data);
                          }
                          return (
                            <div className="margin-top-20">
                              <Accordian
                                AccordioonHeader={data.ObjMeetingAgenda.Title}
                                AccordioonBody={
                                  <>
                                    <Row>
                                      <Col lg={2} md={2} xs={6}>
                                        <Button
                                          disableBtn={endMeetingStatus}
                                          className={"btn btn-primary"}
                                          variant={"Primary"}
                                          text={t("Edit-Button")}
                                          onClick={() => editGrid(data, index)}
                                          datatut="show-agenda"
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={7} md={7} xs={12}>
                                        <TextField
                                          disable={true}
                                          name={"Title"}
                                          value={data.ObjMeetingAgenda.Title}
                                          applyClass="form-control2"
                                          type="text"
                                          placeholder={t("Agenda-Title")}
                                        />
                                      </Col>
                                      <Col lg={5} md={5} xs={12}>
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
                                      <Col lg={12} md={12} xs={12}>
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
                                                  <FileIcon
                                                    extension={ext}
                                                    {...defaultStyles.ext}
                                                  />
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
                    <Row className="updatemeeting-attendees-row">
                      <Col
                        lg={5}
                        md={5}
                        xs={12}
                        className="inputSearchFilter CreateMeetingParticipant margin-top-15 margin-bottom-10"
                      >
                        <InputSearchFilter
                          value={taskAssignedToInput}
                          filteredDataHandler={searchFilterHandler(
                            taskAssignedToInput
                          )}
                          change={onChangeSearch}
                        />
                      </Col>
                      <Col
                        lg={5}
                        md={5}
                        xs={12}
                        className="CreateMeetingReminder margin-top-10"
                      >
                        <SelectBox
                          name="Participant"
                          placeholder={t("Add-Participant-Placeholder")}
                          option={participantOptions}
                          value={participantRoleName}
                          change={assigntRoleAttendies}
                        />
                      </Col>
                      <Col
                        lg={2}
                        md={2}
                        xs={12}
                        className="modalupdatemeeting-add"
                      >
                        <Button
                          className={"btn btn-primary update-add-meeting-btn "}
                          text={t("Add-Button")}
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
                        <label>{t("Participant-Title")}</label>
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
                            placeholder={t("Enter-Meeting-Minutes-Placeholder")}
                            value={recordsMinutesOfTheMeeting.Description}
                            change={onChangeAddMinutes}
                            maxLength={65}
                          />
                        </Col>
                        <Col lg={2} md={2} sm={12} className="updateMinute">
                          <Button
                            className="btn btn-primary update-isminutes-addbtn"
                            text={t("Add-Button")}
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
                              <h3>
                                {t("There-Is-No-Minutes-Of-Meeting-Heading")}
                              </h3>
                            </Col>
                          </Row>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : isPublishMeeting ? (
                <>
                  <Row className="confirmationDialogue display-contents">
                    <Col lg={12} md={12} sm={12}>
                      <p className="publishMessageModal">
                        {t("Are-You-Sure-You-Want-To-Update-Meeting")}
                      </p>
                    </Col>
                  </Row>
                  <Row className="updatemeeting-publishMeeting-btn">
                    <Col lg={6} md={6} xs={12} className="text-end">
                      <Button
                        className={"btn btn-primary meeting next cancel"}
                        text={t("Cancel-Schedule-Meeting-Modal-Button")}
                        onClick={discardMeeting}
                      />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="text-start">
                      <Button
                        className={"btn btn-primary meeting next submit"}
                        text={t("Update-Modal-Button")}
                        onClick={handleSubmit}
                      />
                    </Col>
                  </Row>
                </>
              ) : isCancelMeetingModal ? (
                <>
                  <Row className="confirmationDialogue display-contents">
                    <Col lg={12} md={12} sm={12}>
                      <p className="publishMessageModal">
                        {/* Are you sure you want to cancel this meeting? */}
                        {t("Are-You-Sure-You-Want-To-Cancel-Meeting")}
                      </p>
                    </Col>
                  </Row>
                  <Row className="updatemeeting-cancel-btn">
                    <Col lg={6} md={6} xs={12} className="text-end">
                      <Button
                        className={
                          "btn btn-primary cancelmeetingmodalgoBackbtn"
                        }
                        text={t("Go-Back")}
                        onClick={goBack}
                      />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="text-start">
                      <Button
                        className={
                          "btn btn-primary cancelmeetingmodalcancelbtn "
                        }
                        text={t("Cancel-Schedule-Meeting-Modal-Button")}
                        onClick={cancelMeeting}
                      />
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
                        className={"btn btn-primary modal-update-meeting "}
                        variant={"Primary"}
                        text={t("NextBtn")}
                      />
                    </Col>
                  </Row>
                </>
              ) : isAgenda ? (
                <>
                  <Row className="display-contents">
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Button
                        disableBtn={endMeetingStatus}
                        onClick={addAnOtherAgenda}
                        className={
                          "modal-update-addagenda" + " " + currentLanguage
                        }
                        text={
                          editRecordFlag
                            ? t("Update-Agenda-Button")
                            : t("Add-Agenda-Button")
                        }
                      />
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        onClick={navigateToAttendees}
                        className={"btn btn-primary modal-update-meeting"}
                        text={t("Next-Button")}
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
                          className={"btn btn-primary modal-update-meeting"}
                          text={t("Next-Button")}
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
                            "btn btn-primary update-modal-discard-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Discard-Changes-Button")}
                          onClick={discardMeeting}
                        />
                        <Button
                          disableBtn={endMeetingStatus}
                          className={
                            "btn btn-primary cancel-meeting-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Cancel-Meeting-Button")}
                          onClick={cancelMeetingConfirmation}
                        />
                        <Button
                          className={"btn btn-primary publish-meeting-btn"}
                          text={t("Publish-Button")}
                          onClick={navigateToPublish}
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
                          className={"btn btn-primary ismeeting-finish-btn"}
                          text={t("Publish-Button")}
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
                            "btn btn-primary isminutes-discard-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Discard-Changes-Button")}
                          onClick={discardMeeting}
                        />
                        <Button
                          disableBtn={endMeetingStatus}
                          className={
                            "btn btn-primary isminutes-cancel-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Cancel-Meeting-Button")}
                          onClick={cancelMeetingConfirmation}
                        />
                        <Button
                          className={
                            "btn btn-primary ismeeting-finish-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Publish-Button")}
                          onClick={navigateToPublish}
                        />
                      </Col>
                    </Row>
                  )}
                </>
              ) : null}
            </>
          }
        />
      </Container>

      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {/* {assignees.Loading ? (
        <Loader />
      ) : minuteofMeetingReducer.Loading ? (
        <Loader />
      ) : null} */}
    </>
  );
};


export default ModalUpdate;
