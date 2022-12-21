import React, { useState, useEffect } from "react";
import "./ModalMeeting.css";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import FileIcon, { defaultStyles } from "react-file-icon";
import { RemoveTimeDashes } from "../../commen/functions/date_formater";
import moment from "moment";
import { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  TextField,
  Button,
  Modal,
  Checkbox,
  TimePickers,
  CustomDatePicker,
  SelectBox,
  Accordian,
  EmployeeCard,
  Notification,
  InputSearchFilter,
  Loader,
  MultiDatePicker,
} from "./../../components/elements";
import { useTranslation } from "react-i18next";
import userImage from "../../assets/images/user.png";
import { Row, Col, Container } from "react-bootstrap";
import { CameraVideo } from "react-bootstrap-icons";
import CustomUpload from "../../components/elements/upload/Upload";
import { useSelector, useDispatch } from "react-redux";
import {
  allAssignessList,
  ScheduleNewMeeting,
  HideNotification,
  GetAllReminders,
} from "../../store/actions/Get_List_Of_Assignees";
import ErrorBar from "./../../container/authentication/sign_up/errorbar/ErrorBar";
import { FileUploadToDo } from "../../store/actions/Upload_action";
import Form from "react-bootstrap/Form";

const ModalMeeting = ({ ModalTitle, setShow, show, calenderFlag }) => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const dispatch = useDispatch();
  const { assignees, uploadReducer } = useSelector((state) => state);
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const [isPublishMeeting, setIsPublishMeeting] = useState(false);
  const [meetingReminderID, setMeetingReminderID] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  // console.log("assigneesassigneesassignees", assignees);
  // for modal fields error
  const [modalField, setModalField] = useState(false);

  const [meetingReminderValue, setMeetingReminderValue] = useState("");

  const [externalMeetingAttendees, setExternalMeetingAttendees] = useState([]);

  //Get Current User ID
  let createrID = localStorage.getItem("UserID");
  let UserName = localStorage.getItem("UserName");

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

  const [objMeetingAgenda, setObjMeetingAgenda] = useState({
    Title: "",
    PresenterName: "",
    URLs: "",
    FK_MDID: 0,
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
  // for edit agenda
  const [editRecordFlag, seteditRecordFlag] = useState(false);
  const [editRecordIndex, seteditRecordIndex] = useState(null);

  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);

  // for   dropdown Attendees List
  const [optiosnMeetingAttendeesList, setOptiosnMeetingAttendeesList] =
    useState([]);

  // for   selected Attendees Name
  const [selectedAttendeesName, setSelectedAttendeesName] = useState("");

  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");

  // for   added participant  Name list
  const [addedParticipantNameList, setAddedParticipantNameList] = useState([]);
  console.log(
    "addedParticipantNameListaddedParticipantNameListaddedParticipantNameList",
    addedParticipantNameList
  );
  //Attendees States
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");

  //Reminder Stats
  const [reminderValue, setReminderValue] = useState("");
  const [reminder, setReminder] = useState("");

  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
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

  function validateEmail(email) {
    const re =
      /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/;
    return re.test(String(email).toLowerCase());
  }

  function urlPatternValidation(URL) {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  }

  const changeSelectDetails = () => {
    setIsDetails(true);
    setIsAgenda(false);
    setIsAttendees(false);
    setModalField(false);
    setIsPublishMeeting(false);
    // console.log("Pehla Buton");
  };

  const changeSelectAgenda = async () => {
    // console.log("fieldsvalue createmeeting", createMeeting);
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
      // console.log("fieldsvalue ifcheck");
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(true);
      setIsAttendees(false);
      setIsPublishMeeting(false);
    } else {
      // console.log("fieldsvalue elseCheck");
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsPublishMeeting(false);
    }
  };

  const changeSelectAttendees = async () => {
    if (
      createMeeting.MeetingStartTime != "" &&
      createMeeting.MeetingEndTime != "" &&
      createMeeting.MeetingDate != "" &&
      // createMeeting.MeetingReminderID.length > 0 &&
      createMeeting.MeetingDescription != "" &&
      createMeeting.MeetingLocation != "" &&
      createMeeting.MeetingTitle != "" &&
      createMeeting.MeetingAgendas.length > 0
    ) {
      // console.log("fieldsvalue ifcheck");
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(true);
      setIsPublishMeeting(false);
    } else if (
      createMeeting.MeetingStartTime === "" ||
      createMeeting.MeetingEndTime === "" ||
      createMeeting.MeetingDate === "" ||
      // createMeeting.MeetingReminderID.length === 0 ||
      createMeeting.MeetingDescription === "" ||
      createMeeting.MeetingLocation === "" ||
      createMeeting.MeetingTitle === ""
    ) {
      // console.log("createMeeting else if check", createMeeting);
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsPublishMeeting(false);
    } else if (createMeeting.MeetingAgendas.length > 0) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(true);
      setIsPublishMeeting(false);
    } else if (createMeeting.MeetingAgendas.length === 0) {
      // console.log("Meeting Agenda Length");
      setModalField(true);
      setIsAgenda(true);
      setIsAttendees(false);
      setIsDetails(false);
      setIsPublishMeeting(false);
      setOpen({
        ...open,
        flag: true,
        message: t("Please-Atleast-Add-One-Agenda"),
      });
    } else {
      // console.log("fieldsvalue elseCheck");
    }
  };

  const navigateToAgenda = async () => {
    // console.log("fieldsvalue createmeeting", createMeeting);
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
      // console.log("fieldsvalue ifcheck");
      setModalField(false);
      setIsDetails(false);
      setIsAttendees(false);
      setIsAgenda(true);
      setIsPublishMeeting(false);
    } else {
      // console.log("fieldsvalue elseCheck");
      setModalField(true);
      setIsDetails(true);
      setIsAttendees(false);
      setIsAgenda(false);
      setIsPublishMeeting(false);
    }
    // console.log("fieldsvalue");
  };

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

  // navigate to attendee or show msg if user dont add one agenda
  const navigateToAttendees = async () => {
    if (createMeeting.MeetingAgendas.length > 0) {
      setIsPublishMeeting(false);
      setIsAgenda(false);
      setIsAttendees(true);
      // console.log("agayaattendee");
    } else {
      setIsAgenda(true);
      setIsAttendees(false);
      setIsPublishMeeting(false);
      setOpen({
        ...open,
        flag: true,
        message: t("Please-Atleast-Add-One-Agenda"),
      });
    }
  };

  const navigateToPublish = async () => {
    setModalField(false);
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsPublishMeeting(true);
    // console.log("agayaattendee");
  };

  // for reinder options
  const options = [
    "On starting of meeting",
    "10 minutes before",
    "30 minutes before",
    "1 hour before",
    "5 hours before",
    "1 day before",
    "3 days before",
    "7 days before",
  ];

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Organizer"), id: 1 },
    { label: t("Participant-Dropdown"), id: 2 },
  ];

  //On Change Checkbox
  function onChange(e) {
    // console.log(`checked = ${e.target.checked}`);
    setCreateMeeting({
      ...createMeeting,
      ["IsChat"]: e.target.checked,
    });
    // console.log("createMeetingChecked", createMeeting);
  }

  // for Participant options
  const participantOptions = [t("Organizer"), t("Participant-Dropdown")];

  console.log("createMeeting", createMeeting);
  // const [valueDate, setValueDate] = useState("");

  // useEffect(() => {
  //   if (valueDate != undefined && valueDate != "") {
  //     console.log("handleChangeDate", valueDate?.toDate?.().toString());
  //     let gmtDate = valueDate?.toDate?.().toString();
  //     let gmtDate2 = gmtDate.slice(0, 24);
  //     let meetingDateUpdated = moment(
  //       gmtDate2,
  //       "ddd MMM DD YYYY HH:mm:ss"
  //     ).format("YYYYMMDD");
  //     console.log("meetingDateUpdated", meetingDateUpdated);
  //     setCreateMeeting({
  //       ...createMeeting,
  //       ["MeetingDate"]: meetingDateUpdated,
  //     });
  //   }
  // }, [valueDate]);
  // console.log("handleChangeDate", createMeeting.MeetingDate);

  // for all details handler
  const detailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    // console.log("detailsHandler", name, value);
    if (name === "MeetingStartTime") {
      // console.log("MeetingStartTime", name, value);
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
      // console.log("MeetingLocation", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingTitle") {
      // console.log("MeetingTitle", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingDescription") {
      // console.log("MeetingDescription", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "MeetingTypeID" && (value === "" || value === 0)) {
      // console.log("MeetingTypeID", name, value);
      setCreateMeeting({
        ...createMeeting,
        [name]: parseInt(0),
      });
    } else {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    }
  };

  const [meetingDate, setMeetingDate] = useState("");

  const meetingDateHandler = (date, format = "YYYYMMDD") => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let meetingDateSaveFormat = new DateObject(date).format("YYYYMMDD");
    setMeetingDate(meetingDateValueFormat);
    setCreateMeeting({
      ...createMeeting,
      MeetingDate: meetingDateSaveFormat,
    });
  };

  // for agenda main inputs handler
  const agendaHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");

    // console.log("agendaHandler", name, value);
    if (name === "Title") {
      // console.log("Title", name, value);
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "PresenterName") {
      // console.log("PresenterName", name, value);
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "URLs") {
      // console.log("URLs", name, value);
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
      });
    } else {
      // console.log("agendaHandler not complete");
    }
  };

  // for add another agenda main inputs handler
  const uploadFilesAgenda = (data) => {
    const uploadFilePath = data.target.value;
    const uploadedFile = data.target.files[0];
    var ext = uploadedFile.name.split(".").pop();
    // console.log("uploadedFile", uploadedFile, uploadFilePath);
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
  // console.log("uploadFile ReducerData", uploadReducer.uploadDocumentsList);

  useEffect(() => {
    // console.log("useEffect(() => {");
    let newData = uploadReducer.uploadDocumentsList;
    let MeetingAgendaAttachment =
      meetingAgendaAttachments.MeetingAgendaAttachments;
    // console.log("uploadFile ReducerData", newData);
    if (newData != undefined && newData.length != 0) {
      MeetingAgendaAttachment.push({
        PK_MAAID: 0,
        DisplayAttachmentName: newData.displayFileName,
        OriginalAttachmentName: newData.originalFileName,
        CreationDateTime: "111111",
        FK_MAID: 0,
      });
      setMeetingAgendaAttachments({
        ...meetingAgendaAttachments,
        ["MeetingAgendaAttachments"]: MeetingAgendaAttachment,
      });
    }
  }, [uploadReducer.uploadDocumentsList]);

  const editGrid = (datarecord, dataindex) => {
    // console.log("editGrid", datarecord);
    seteditRecordIndex(dataindex);
    seteditRecordFlag(true);
    setObjMeetingAgenda(datarecord.ObjMeetingAgenda);
    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      ["MeetingAgendaAttachments"]: datarecord.MeetingAgendaAttachments,
    });
  };

  const deleteGrid = (datarecord, dataindex) => {
    console.log("deleteGrid", createMeeting.MeetingAgendas);
    let splicedArray = createMeeting.MeetingAgendas.indexOf(datarecord);
    createMeeting.MeetingAgendas.splice(splicedArray, 1);
    setCreateMeeting({
      ...createMeeting,
    });
    console.log("deleteGrid after Delete", createMeeting.MeetingAgendas);
  };

  // for add another agenda main inputs handler
  // const addAnOtherAgenda = () => {
  //   console.log("addAnOtherAgenda", objMeetingAgenda.URLs);
  //   if (objMeetingAgenda.Title !== "") {
  //     if (objMeetingAgenda.URLs !== "") {
  //       if (urlPatternValidation(objMeetingAgenda.URLs)) {
  //         setModalField(false);
  //         let previousAdendas = createMeeting.MeetingAgendas;
  //         let newData = {
  //           ObjMeetingAgenda: objMeetingAgenda,
  //           MeetingAgendaAttachments:
  //             meetingAgendaAttachments.MeetingAgendaAttachments,
  //         };
  //         previousAdendas.push(newData);
  //         setCreateMeeting({
  //           ...createMeeting,
  //           ["MeetingAgendas"]: previousAdendas,
  //         });
  //         setObjMeetingAgenda({
  //           Title: "",
  //           PresenterName: "",
  //           URLs: "",
  //           FK_MDID: 0,
  //         });
  //         setMeetingAgendaAttachments({
  //           MeetingAgendaAttachments: [],
  //         });
  //       } else {
  //         setModalField(false);
  //         setOpen({
  //           ...open,
  //           flag: true,
  //           message: "Enter Valid URL",
  //         });
  //       }
  //     } else {
  //       setModalField(false);
  //       let previousAdendas = createMeeting.MeetingAgendas;
  //       let newData = {
  //         ObjMeetingAgenda: objMeetingAgenda,
  //         MeetingAgendaAttachments:
  //           meetingAgendaAttachments.MeetingAgendaAttachments,
  //       };
  //       previousAdendas.push(newData);
  //       setCreateMeeting({
  //         ...createMeeting,
  //         ["MeetingAgendas"]: previousAdendas,
  //       });
  //       setObjMeetingAgenda({
  //         Title: "",
  //         PresenterName: "",
  //         URLs: "",
  //         FK_MDID: 0,
  //       });
  //       setMeetingAgendaAttachments({
  //         MeetingAgendaAttachments: [],
  //       });
  //     }
  //   } else {
  //     setModalField(true);
  //     setOpen({
  //       ...open,
  //       flag: true,
  //       message: "Enter Title Information",
  //     });
  //   }
  //   // if (
  //   //   urlPatternValidation(objMeetingAgenda.URLs) &&
  //   //   objMeetingAgenda.Title !== ""
  //   // ) {
  //   //   setModalField(false);
  //   //   let previousAdendas = createMeeting.MeetingAgendas;
  //   //   let newData = {
  //   //     ObjMeetingAgenda: objMeetingAgenda,
  //   //     MeetingAgendaAttachments:
  //   //       meetingAgendaAttachments.MeetingAgendaAttachments,
  //   //   };
  //   //   previousAdendas.push(newData);
  //   //   setCreateMeeting({
  //   //     ...createMeeting,
  //   //     ["MeetingAgendas"]: previousAdendas,
  //   //   });
  //   //   setObjMeetingAgenda({
  //   //     Title: "",
  //   //     PresenterName: "",
  //   //     URLs: "",
  //   //     FK_MDID: 0,
  //   //   });
  //   //   setMeetingAgendaAttachments({
  //   //     MeetingAgendaAttachments: [],
  //   //   });
  //   // } else if (objMeetingAgenda.Title === "") {
  //   //   setModalField(true);
  //   //   setOpen({
  //   //     ...open,
  //   //     flag: true,
  //   //     message: "Enter Title Information",
  //   //   });
  //   // } else {
  //   //   setModalField(false);
  //   //   setOpen({
  //   //     ...open,
  //   //     flag: true,
  //   //     message: "Enter Valid Information",
  //   //   });
  //   // }
  // };
  const addAnOtherAgenda = (e) => {
    e.preventDefault();
    console.log("addAnOtherAgenda");
    let previousAdendas = createMeeting.MeetingAgendas;
    if (editRecordFlag != null && editRecordFlag === true) {
      // console.log("addAnOtherAgenda", objMeetingAgenda);
      if (objMeetingAgenda.Title !== "") {
        if (objMeetingAgenda.URLs !== "") {
          if (urlPatternValidation(objMeetingAgenda.URLs)) {
            let newData = {
              ObjMeetingAgenda: objMeetingAgenda,
              MeetingAgendaAttachments:
                meetingAgendaAttachments.MeetingAgendaAttachments,
            };
            // console.log("addAnOtherAgenda", previousAdendas);

            previousAdendas[editRecordIndex] = newData;
            setCreateMeeting({
              ...createMeeting,
              ["MeetingAgendas"]: previousAdendas,
            });
            seteditRecordIndex(null);
            seteditRecordFlag(false);
            setObjMeetingAgenda({
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
          // console.log("addAnOtherAgenda", previousAdendas);

          previousAdendas[editRecordIndex] = newData;
          setCreateMeeting({
            ...createMeeting,
            ["MeetingAgendas"]: previousAdendas,
          });
          seteditRecordIndex(null);
          seteditRecordFlag(false);
          setObjMeetingAgenda({
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
        // console.log("addAnOtherAgenda");
        setModalField(true);
        setOpen({
          ...open,
          flag: true,
          message: t("Enter-Title-Information"),
        });
      }
      setModalField(false);
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
            // console.log("meetingAttendees 1assigntRoleAttendies", newData);

            setMeetingAttendees(newData);
          }
        });
      }
    }
  };

  // for list of all assignees
  useEffect(() => {
    // console.log("useEffect(() => {");
    dispatch(allAssignessList(1));

    if (show) {
      let user1 = createMeeting.MeetingAttendees;
      let List = addedParticipantNameList;
      user1.push({
        User: {
          PK_UID: parseInt(createrID),
        },
        MeetingAttendeeRole: {
          PK_MARID: 1,
        },
        AttendeeAvailability: {
          PK_AAID: 1,
        },
      });
      assignees.user.map((data, index) => {
        if (data.pK_UID === parseInt(createrID)) {
          // console.log("user1user1user1user1user1", data)

          List.push({
            name: data.name,
            designation: data.designation,
            profilePicture: data.orignalProfilePictureName,
            organization: data.organization,
            role: 1,
          });
        }
      });
      setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
      setAddedParticipantNameList(List);
      dispatch(GetAllReminders());
    } else {
      setModalField(false);
      setShow(false);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsPublishMeeting(false);
      setObjMeetingAgenda({
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
      setMeetingReminderValue("");
      setMeetingReminderID([]);
      setAddedParticipantNameList([]);
      setReminder("");
      setReminderValue("");
      setMeetingDate("");
    }
  }, [show]);

  // for api reponce of list of all assignees
  useEffect(() => {
    // console.log("useEffect(() => {");

    if (Object.keys(assignees.user).length > 0) {
      setMeetingAttendeesList(assignees.user);
      // console.log("assignees.user", assignees.user);
    }
  }, [assignees.user]);

  // for  list of all assignees  drop down
  useEffect(() => {
    // console.log("useEffect(() => {");

    let user = meetingAttendeesList;
    if (user != undefined) {
      if (meetingAttendeesList.length > 0) {
        // console.log("meetingAttendeesList123123", meetingAttendeesList);

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
    // console.log("useEffect(() => {");

    if (addedParticipantNameList != undefined) {
      if (addedParticipantNameList.length > 0) {
        // console.log("addedParticipantNameList", addedParticipantNameList);
      }
    }
  }, [addedParticipantNameList]);

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
    // console.log("Input Value", value);
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
        .slice(0, 3)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex flex-row align-items-center"
            key={item.pK_UID}
          >
            {/* {console.log("itemitem", item)} */}
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
      // console.log("not found");
    }
  };
  console.log("taskAssignedTotaskAssignedTotaskAssignedTo", taskAssignedTo);
  // for add Attendees handler
  const addAttendees = () => {
    let user1 = createMeeting.MeetingAttendees;
    let List = addedParticipantNameList;
    let externaluser = externalMeetingAttendees;
    console.log("ListListList List", List);
    console.log("ListListList externaluser", externaluser);
    console.log("ListListList user1", user1);

    let found = user1.find((element) => element.User.PK_UID === taskAssignedTo);
    let found2 = externaluser.find(
      (element) => element.EmailAddress === taskAssignedToInput
    );
    console.log("Attendees values found", taskAssignedTo, found);
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
          console.log("meetingAttendeesList12", meetingAttendeesList);
          meetingAttendeesList.map((data, index) => {
            console.log("meetingAttendeesList123", data.pK_UID, taskAssignedTo);
            if (data.pK_UID === taskAssignedTo) {
              console.log("meetingAttendeesList123");

              List.push({
                name: data.name,
                designation: data.designation,
                profilePicture: data.profilePicture,
                organization: data.organization,
                role: meetingAttendees.MeetingAttendeeRole.PK_MARID,
              });
            }
          });
          // console.log("datadatadata1123123", user1)
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
  const handleSubmit = () => {
    setShow(false);
    setIsDetails(true);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsPublishMeeting(false);
    dispatch(ScheduleNewMeeting(createMeeting, calenderFlag));
    // console.log("ScheduleNewMeetingObject", createMeeting);
    setObjMeetingAgenda({
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
    setMeetingDate("");
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
    setMeetingReminderValue("");
    setMeetingReminderID([]);
    setAddedParticipantNameList([]);
  };

  const handleCancel = () => {
    setModalField(false);
    setShow(false);
    setIsDetails(true);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsPublishMeeting(false);
    setObjMeetingAgenda({
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
    setMeetingDate("");
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
    setMeetingReminderValue("");
    setMeetingReminderID([]);
    setAddedParticipantNameList([]);
  };

  // console.log("SaveModalMeeting", createMeeting);

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = meetingAgendaAttachments.MeetingAgendaAttachments;
    console.log(
      "firdeleteFilefromAttachmentsdeleteFilefromAttachmentsst",
      index
    );
    searchIndex.splice(index, 1);
    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      ["MeetingAgendaAttachments"]: searchIndex,
    });
  };
  console.log("Datadatadata1234", createMeeting.MeetingAttendees);
  console.log("Datadatadata12345", addedParticipantNameList);

  const handleDeleteAttendee = (data, index) => {
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
  useEffect(() => {
    if (assignees.ResponseMessage) {
      setOpen({
        flag: true,
        message: assignees.ResponseMessage,
      });
      dispatch(HideNotification());
    }
  }, [assignees.ResponseMessage]);
  console.log(
    "addedParticipantNameListaddedParticipantNameListaddedParticipantNameList",
    addedParticipantNameList
  );
  console.log("ReducerValueAFterSave", meetingAgendaAttachments);

  return (
    <>
      <Container>
        <Modal
          show={show}
          setShow={setShow}
          className="modaldialog createModalMeeting"
          ButtonTitle={ModalTitle}
          modalBodyClassName="modalMeetingCreateBody"
          modalFooterClassName="modalMeetingCreateFooter"
          modalHeaderClassName={
            isPublishMeeting === true ? "d-none" : "modalMeetingCreateHeader"
          }
          centered
          size={isPublishMeeting === true ? "sm" : "lg"}
          ModalBody={
            <>
              {isPublishMeeting === false ? (
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
                  <Col lg={6} md={6} xs={12} className="p-0"></Col>
                </Row>
              ) : null}
              {isDetails ? (
                <>
                  <Row className="createmeetingtime-row-1">
                    <Col lg={2} md={2} xs={12} className="CreateMeetingTime">
                      <TimePickers
                        change={detailsHandler}
                        placeholder={"00:00"}
                        name="MeetingStartTime"
                        value={createMeeting.MeetingStartTime}
                        required
                      />
                      <div className="height-10">
                        {modalField === true &&
                        createMeeting.MeetingStartTime === "" ? (
                          <ErrorBar errorText={t("SelectTime")} />
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={2} md={2} xs={12} className="CreateMeetingDate">
                      <MultiDatePicker
                        onChange={meetingDateHandler}
                        name="MeetingDate"
                        value={meetingDate}
                        calendar={calendarValue}
                        locale={localValue}
                        // newValue={createMeeting.MeetingDate}
                      />
                      <div className="height-10">
                        {modalField === true &&
                        createMeeting.MeetingDate === "" ? (
                          <ErrorBar errorText={t("SelectDate")} />
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={4} md={4} xs={12}></Col>
                    <Col
                      lg={4}
                      md={4}
                      xs={12}
                      className="CreateMeetingReminder"
                    >
                      <SelectBox
                        name="MeetingReminderID"
                        placeholder={t("Reminder-Placeholder")}
                        option={reminder}
                        value={reminderValue}
                        change={ReminderNameHandler}
                        className="MeetingReminder"
                        required
                      />
                      <div className="height-10">
                        {/* {modalField === true && reminderValue === "" ? (
                          <ErrorBar errorText={"Select Reminder"} />
                        ) : null} */}
                      </div>
                    </Col>
                    {/* <Col lg={3} md={3} xs={12}></Col> */}
                  </Row>

                  <Row className="createmeetingInput-row">
                    <Col lg={1} md={1} xs={12} className="CreateMeetingInput">
                      <Button
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
                        className="SearchCheckbox"
                        name="IsChat"
                        label={t("Group-Chat-Button")}
                        checked={createMeeting.IsChat}
                        onChange={onChange}
                        classNameDiv="checkboxParentClass"
                      ></Checkbox>
                    </Col>
                  </Row>

                  <Row className="createmeetingInput-row ">
                    <Col lg={12} md={12} xs={12} className="CreateMeetingInput">
                      <TextField
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

                  <Row className="createmeetingtextarea-row">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="CreateMeetingInput textAreaDiv"
                    >
                      <TextField
                        change={detailsHandler}
                        name="MeetingDescription"
                        applyClass="form-control2 createmeetingtextarea"
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
                </>
              ) : isAgenda ? (
                <>
                  {/* <Form.Group></Form.Group> */}

                  <div className="agenda_container">
                    <Form onSubmit={addAnOtherAgenda}>
                      <Row>
                        <Col
                          lg={8}
                          md={8}
                          xs={12}
                          className="CreateMeetingAgenda"
                        >
                          <TextField
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
                          lg={4}
                          md={4}
                          xs={12}
                          className="CreateMeetingAgenda"
                        >
                          <TextField
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
                            change={agendaHandler}
                            name={"URLs"}
                            value={objMeetingAgenda.URLs}
                            applyClass="form-control2"
                            type="text"
                            placeholder={t("URL-Title-Placeholder")}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="d-flex justify-content-start flex-column margin-left-10"
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
                    <Row>
                      {meetingAgendaAttachments.MeetingAgendaAttachments
                        .length > 0
                        ? meetingAgendaAttachments.MeetingAgendaAttachments.map(
                            (data, index) => {
                              var ext =
                                data.DisplayAttachmentName.split(".").pop();
                              const first =
                                data.DisplayAttachmentName.split(" ")[0];
                              return (
                                <Col
                                  sm={12}
                                  lg={3}
                                  md={3}
                                  className="file-icon-modalmeeting"
                                >
                                  <FileIcon
                                    extension={ext}
                                    {...defaultStyles.ext}
                                  />
                                  <span className="deleteBtn">
                                    <img
                                      src={deleteButtonCreateMeeting}
                                      width={15}
                                      height={15}
                                      onClick={() =>
                                        deleteFilefromAttachments(data, index)
                                      }
                                    />
                                  </span>
                                  <p className="file-icon-modalmeeting-p">
                                    {first}
                                  </p>
                                </Col>
                              );
                            }
                          )
                        : null}
                    </Row>
                  </div>
                  <div className="modalmeeting-participant-scroll">
                    {createMeeting.MeetingAgendas.length > 0
                      ? createMeeting.MeetingAgendas.map((data, index) => {
                          return (
                            <div className="margin-top-20">
                              <Accordian
                                AccordioonHeader={data.ObjMeetingAgenda.Title}
                                className={"Setting" + " " + currentLanguage}
                                AccordioonBody={
                                  <>
                                    <Row>
                                      <Col lg={2} md={2} xs={6}>
                                        <Button
                                          className={"btn btn-primary"}
                                          variant={"Primary"}
                                          text={t("Edit-Button")}
                                          onClick={() => editGrid(data, index)}
                                          datatut="show-agenda"
                                        />
                                      </Col>
                                      <Col lg={2} md={2} xs={6}>
                                        <Button
                                          className={"btn btn-danger"}
                                          variant={"Primary"}
                                          text={t("Delete-Button")}
                                          onClick={() =>
                                            deleteGrid(data, index)
                                          }
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
                                          placeholder={t(
                                            "URL-Title-Placeholder"
                                          )}
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
                                                  className="file-icon-modalmeeting"
                                                >
                                                  <FileIcon
                                                    extension={ext}
                                                    {...defaultStyles.ext}
                                                  />
                                                  <p className="file-icon-modalmeeting-p">
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
                  {/* </Form> */}
                </>
              ) : isAttendees ? (
                <>
                  <Row className="modalmeeting-attendees-row">
                    <Col
                      lg={6}
                      md={6}
                      xs={12}
                      className={
                        "inputSearchFilter CreateMeetingParticipant addattendee-textfield-width"
                      }
                    >
                      <InputSearchFilter
                        className="taskassignee"
                        value={taskAssignedToInput}
                        filteredDataHandler={searchFilterHandler(
                          taskAssignedToInput
                        )}
                        change={onChangeSearch}
                      />
                    </Col>
                    <Col
                      lg={4}
                      md={4}
                      xs={12}
                      className="CreateMeetingReminder select-participant-box"
                    >
                      <SelectBox
                        name="Participant"
                        width="100%"
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
                      // className="margin-top-1 margin-bottom-1"
                      className="modalmeeting-add"
                    >
                      <Button
                        className={"add-button addattendees-btn"}
                        text={t("Add-Button")}
                        onClick={addAttendees}
                        disableBtn={
                          !taskAssignedToInput || !participantRoleName
                        }
                      />
                    </Col>
                  </Row>
                  <div className="participant-scroll-creatingmeeting">
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="participant-heading-creatingmeeting"
                      >
                        <label>{t("Organizer")}</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        {addedParticipantNameList ? (
                          <>
                            <span>
                              {addedParticipantNameList.map((atList, index) => {
                                console.log("atListatListatList", atList);
                                if (atList.role === 1) {
                                  return (
                                    <EmployeeCard
                                      employeeName={atList.name}
                                      employeeDesignation={atList.designation}
                                      organizer={
                                        atList.role === 1 ? true : false
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
                        className="participant-heading-creatingmeeting"
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
                                    <>
                                      <EmployeeCard
                                        employeeName={atList.name}
                                        employeeDesignation={atList.designation}
                                        organizer={true}
                                        IconOnClick={() =>
                                          handleDeleteAttendee(atList, index)
                                        }
                                      />
                                    </>
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
              ) : isPublishMeeting ? (
                <>
                  <Row className="confirmationDialogue">
                    <Col lg={12} md={12} sm={12}>
                      <p className="publishMessageModal">
                        {/* Are you sure you want to schedule this meeting? */}
                        {t("Are-You-Sure-You-Want-To-Schedule")}
                      </p>
                    </Col>
                  </Row>
                  <Row className="confirmationDialogue-2">
                    <Col lg={6} md={6} xs={12} className="text-end">
                      <Button
                        className={"btn btn-primary cancel-schedule-meeting"}
                        text={t("Cancel-Schedule-Meeting-Modal-Button")}
                        onClick={handleCancel}
                      />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="text-start">
                      <Button
                        className={"btn btn-primary schedule-modal-meeting"}
                        text={t("Schedule-Meeting-Modal-Button")}
                        onClick={handleSubmit}
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
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        className={"btn btn-primary publish-meeting-btn"}
                        text={t("Publish-Button")}
                        onClick={navigateToPublish}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {/* {assignees.Loading ? (
        <Loader />
      ) : uploadReducer.Loading ? (
        <Loader />
      ) : null} */}
    </>
  );
};

export default ModalMeeting;
