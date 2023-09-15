import React, { useState, useEffect } from "react";
import "./ModalMeeting.css";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import FileIcon, { defaultStyles } from "react-file-icon";
import {
  createConvert,
  removeDashesFromDate,
  RemoveTimeDashes,
} from "../../commen/functions/date_formater";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import MeetingVideoChatIcon from "../../assets/images/newElements/Icon feather-video1.png";
import MeetingVideoChatIconActive from "../../assets/images/newElements/Icon feather-video.png";
import currentUserImage from "../../assets/images/avatar.png";
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
import { CameraVideo, Plus } from "react-bootstrap-icons";
import CustomUpload from "../../components/elements/upload/Upload";
import { useSelector, useDispatch } from "react-redux";
import {
  allAssignessList,
  ScheduleNewMeeting,
  HideNotification,
  GetAllReminders,
} from "../../store/actions/Get_List_Of_Assignees";
import ErrorBar from "./../../container/authentication/sign_up/errorbar/ErrorBar";
import {
  FileUploadToDo,
  ResetAllFilesUpload,
} from "../../store/actions/Upload_action";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import TextFieldTime from "../../components/elements/input_field_time/Input_field";
import InputIcon from "react-multi-date-picker/components/input_icon";

const ModalMeeting = ({ ModalTitle, setShow, show, calenderFlag }) => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // for modal fields error
  const [modalField, setModalField] = useState(false);

  const [meetingReminderValue, setMeetingReminderValue] = useState("");

  const [externalMeetingAttendees, setExternalMeetingAttendees] = useState([]);

  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let UserName = localStorage.getItem("UserName");

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

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

  //Attendees States
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [createMeetingTime, setCreateMeetingTime] = useState("");
  // for Participant options
  const participantOptions = [t("Organizer"), t("Participant")];

  //Reminder Stats
  const [reminderValue, setReminderValue] = useState("");
  const [reminder, setReminder] = useState("");
  let OrganizationId = localStorage.getItem("organizationID");
  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
    MeetingTitle: "",
    MeetingDescription: "",
    MeetingTypeID: 0,
    MeetingDate: "",
    OrganizationId: parseInt(OrganizationId),
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
  };

  const changeSelectAgenda = async () => {
    setModalField(false);
    if (
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      createMeeting.MeetingDescription !== "" &&
      createMeeting.MeetingLocation !== "" &&
      createMeeting.MeetingTitle !== ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(true);
      setIsAttendees(false);
      setIsPublishMeeting(false);
    } else {
      setModalField(true);
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setIsPublishMeeting(false);
    }
  };

  const changeSelectAttendees = async () => {
    if (
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== "" &&
      // createMeeting.MeetingReminderID.length > 0 &&
      createMeeting.MeetingDescription !== "" &&
      createMeeting.MeetingLocation !== "" &&
      createMeeting.MeetingTitle !== "" &&
      createMeeting.MeetingAgendas.length > 0
    ) {
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
      setModalField(true);
      setIsAgenda(true);
      setIsAttendees(false);
      setIsDetails(false);
      setIsPublishMeeting(false);
      setOpen({
        ...open,
        flag: true,
        message: t("Please-atleast-add-one-agenda"),
      });
    } else {
    }
  };

  const navigateToAgenda = async () => {
    setModalField(false);
    if (
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== "" &&
      // createMeeting.MeetingReminderID.length != 0 &&
      // createMeeting.MeetingDescription !== "" &&
      createMeeting.MeetingLocation !== "" &&
      createMeeting.MeetingTitle !== ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAttendees(false);
      setIsAgenda(true);
      setIsPublishMeeting(false);
    } else {
      setModalField(true);
      setIsDetails(true);
      setIsAttendees(false);
      setIsAgenda(false);
      setIsPublishMeeting(false);
    }
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
    } else {
      setIsAgenda(true);
      setIsAttendees(false);
      setIsPublishMeeting(false);
      setOpen({
        ...open,
        flag: true,
        message: t("Please-atleast-add-one-agenda"),
      });
    }
  };

  const navigateToPublish = async () => {
    setModalField(false);
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsPublishMeeting(true);
  };

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Organizer"), id: 1 },
    { label: t("Participant"), id: 2 },
  ];

  //On Change Checkbox
  function onChange(e) {
    setCreateMeeting({
      ...createMeeting,
      ["IsChat"]: e.target.checked,
    });
  }

  // for all details handler
  const detailsHandler = (e) => {
    console.log(
      "dateHandler",
      e.target.value,
      RemoveTimeDashes(e.target.value)
    );
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    if (name === "MeetingStartTime") {
      setCreateMeeting({
        ...createMeeting,
        [name]: RemoveTimeDashes(value),
        ["MeetingEndTime"]: RemoveTimeDashes(value),
      });
      setCreateMeetingTime(value);
    } else if (name === "MeetingLocation") {
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
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    }
  };

  const [meetingDate, setMeetingDate] = useState("");
  console.log(meetingDate, "meetingDatemeetingDatemeetingDate");
  const meetingDateHandler = (date, format = "YYYYMMDD") => {
    console.log("meetingDateHandler", date);
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let meetingDateSaveFormat = new DateObject(date).format("YYYYMMDD");
    console.log("meetingDateHandler", meetingDateValueFormat);
    console.log("meetingDateHandler", meetingDateSaveFormat);
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
    if (name === "Title") {
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "PresenterName") {
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
      });
    } else if (name === "URLs") {
      setObjMeetingAgenda({
        ...objMeetingAgenda,
        [name]: valueCheck.trimStart(),
      });
    } else {
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
      ext === "gif"
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
        } else if (size === false) {
        } else if (sizezero === false) {
        } else {
          dispatch(FileUploadToDo(navigate, uploadedFile, t));
        }
      } else {
        let size;
        let sizezero;
        if (uploadedFile.size === 0) {
          setOpen({
            ...open,
            flag: true,
            message: t("File-size-is-0mb"),
          });
          sizezero = false;
        }
        if (size === false) {
        } else if (sizezero === false) {
        } else {
          dispatch(FileUploadToDo(navigate, uploadedFile, t));
        }
      }
    }
  };

  useEffect(() => {
    try {
      let newData = uploadReducer.uploadDocumentsList;
      let MeetingAgendaAttachment =
        meetingAgendaAttachments.MeetingAgendaAttachments;
      if (newData != undefined && newData.length != 0) {
        console.log("uploadDocumentsList error", newData);

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
        dispatch(ResetAllFilesUpload());
      }
    } catch (error) {
      console.log("uploadDocumentsList error");
    }
  }, [uploadReducer.uploadDocumentsList]);

  const editGrid = (datarecord, dataindex) => {
    seteditRecordIndex(dataindex);
    seteditRecordFlag(true);
    setObjMeetingAgenda(datarecord.ObjMeetingAgenda);
    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      ["MeetingAgendaAttachments"]: datarecord.MeetingAgendaAttachments,
    });
  };

  const deleteGrid = (datarecord, dataindex) => {
    let splicedArray = createMeeting.MeetingAgendas.indexOf(datarecord);
    createMeeting.MeetingAgendas.splice(splicedArray, 1);
    setCreateMeeting({
      ...createMeeting,
    });
  };

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

  useEffect(() => {
    try {
      let valueOfReminder = assignees.RemindersData;
      setReminder(
        valueOfReminder.map((data, index) => {
          return data.description;
        })
      );
      valueOfReminder.map((data, index) => {
        if (createMeeting.MeetingReminderID === data.pK_MRID) {
          setReminderValue(data.description);
          setCreateMeeting({
            ...createMeeting,
            ["MeetingReminderID"]: [parseInt(data.pK_MRID)],
          });
        }
      });
    } catch (error) {
      console.log("RemindersData error");
    }
  }, [assignees.RemindersData]);

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
    let user = participantOptionsWithIDs;
    if (user !== undefined) {
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

  // for list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
      } else {
        dispatch(allAssignessList(navigate, t));
      }
      if (show) {
        let user1 = createMeeting.MeetingAttendees;
        let List = addedParticipantNameList;
        user1.push({
          User: {
            PK_UID: parseInt(createrID),
          },
          MeetingAttendeeRole: {
            PK_MARID: 3,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        });
        console.log("add_assignee", user1);
        console.log("add_assignee", assignees);
        assignees.user.map((data, index) => {
          console.log(
            "add_assignee",
            data,
            createrID,
            data.pK_UID === parseInt(createrID)
          );
          if (data.pK_UID === parseInt(createrID)) {
            console.log("add_assignee", data);

            List.push({
              name: data.name,
              designation: data.designation,
              profilePicture: data.orignalProfilePictureName,
              organization: data.organization,
              role: 3,
              displayProfilePic: data.displayProfilePictureName,
            });
          }
        });
        console.log("ListListList", List);
        setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
        setAddedParticipantNameList(List);
        dispatch(GetAllReminders(navigate, t));
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
          OrganizationId: parseInt(OrganizationId),
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
    } catch (error) {
      console.log("allAssignessList error");
    }
  }, [show, assignees.user]);

  console.log("allAssignessList error", createMeeting);

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) {
      console.log("setMeetingAttendeesList error");
    }
  }, [assignees.user]);

  // for  list of all assignees  drop down
  useEffect(() => {
    try {
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
    } catch (error) {
      console.log("setMeetingAttendeesList error");
    }
  }, [meetingAttendeesList]);
  const [onclickFlag, setOnclickFlag] = useState(false);
  //On Click Of Dropdown Value
  const onSearch = (name, id) => {
    setOnclickFlag(true);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setOnclickFlag(false);
    setTaskAssignedToInput(e.target.value.trimStart());
  };

  const searchFilterHandler = (value) => {
    let allAssignees = assignees.user;
    console.log("Input Value", allAssignees);
    if (
      allAssignees !== undefined &&
      allAssignees !== null &&
      allAssignees !== []
    ) {
      return allAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          console.log("Input Value in searchTerm", searchTerm);
          console.log("Input Value in assigneesName", assigneesName);

          return (
            searchTerm && assigneesName.startsWith(searchTerm)
            // assigneesName !== searchTerm.toLowerCase()
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            {console.log("itemitem", item)}
            <img
              src={`data:image/jpeg;base64,${item.displayProfilePictureName}`}
              alt=""
              className="user-img"
            />
            <p className="p-0 m-0">{item.name}</p>
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
    let externaluser = externalMeetingAttendees;
    let found = user1.find((element) => element.User.PK_UID === taskAssignedTo);
    let found2 = externaluser.find(
      (element) => element.EmailAddress === taskAssignedToInput
    );

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
              message: t("External-attendees-cant-be-organizer"),
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
            message: t("Email-already-exist"),
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
          message: t("Enter-valid-email-address"),
        });
      }
    }
  };

  // for attendies handler
  const handleSubmit = async () => {
    let finalDateTime = createConvert(
      createMeeting.MeetingDate + createMeeting.MeetingStartTime
    );
    let newDate = finalDateTime.slice(0, 8);
    let newTime = finalDateTime.slice(8, 14);
    let newData = {
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
    console.log(createMeeting, "ScheduleNewMeetingDateTIme");
    console.log(newData, "ScheduleNewMeetingDateTIme");
    setShow(false);
    setIsDetails(true);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsPublishMeeting(false);
    dispatch(ScheduleNewMeeting(navigate, newData, calenderFlag, t));
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
      OrganizationId: parseInt(OrganizationId),
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
      OrganizationId: parseInt(OrganizationId),
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

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = meetingAgendaAttachments.MeetingAgendaAttachments;
    searchIndex.splice(index, 1);
    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      ["MeetingAgendaAttachments"]: searchIndex,
    });
  };

  const handleDeleteAttendee = (data, index) => {
    let user1 = createMeeting.MeetingAttendees;
    user1.splice(index, 1);
    addedParticipantNameList.splice(index, 1);
    setAddedParticipantNameList(addedParticipantNameList);
    setCreateMeeting({ ...createMeeting, ["MeetingAttendees"]: user1 });
  };

  return (
    <>
      <Container>
        <Modal
          show={show}
          onHide={() => {
            setShow(false);
          }}
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
                  <Col
                    lg={2}
                    md={2}
                    sm={3}
                    xs={12}
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "p-0 margin-left-10"
                    }
                  >
                    <Button
                      className={
                        isDetails
                          ? "btn btn-primary isDetail-Schedule-top-btn"
                          : "btn btn-outline-primary isDetail-Schedule-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Details")}
                      onClick={changeSelectDetails}
                    />
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={3}
                    xs={12}
                    className="agenda-upper-button"
                  >
                    <Button
                      className={
                        isAgenda
                          ? "btn btn-primary isAgenda-Schedule-top-btn"
                          : "btn btn-outline-primary isAgenda-Schedule-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Agendas")}
                      onClick={changeSelectAgenda}
                      datatut="show-agenda"
                    />
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={3}
                    xs={12}
                    className="attendees-upper-button"
                  >
                    <Button
                      className={
                        isAttendees
                          ? "btn btn-primary isAttendee-Schedule-top-btn"
                          : "btn btn-outline-primary isAttendee-Schedule-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Attendees")}
                      datatut="show-meeting-attendees"
                      onClick={changeSelectAttendees}
                    ></Button>
                  </Col>
                  <Col lg={6} md={6} sm={3} xs={12} className="p-0"></Col>
                </Row>
              ) : null}
              {isDetails ? (
                <>
                  <Row className="createmeetingtime-row-1">
                    <Col
                      lg={3}
                      md={3}
                      sm={3}
                      xs={12}
                      className="CreateMeetingTime"
                    >
                      <TextFieldTime
                        type="time"
                        labelClass="d-none"
                        value={createMeetingTime}
                        name="MeetingStartTime"
                        onKeyDown={(e) => e.preventDefault()}
                        applyClass={"quick_meeting_time"}
                        change={detailsHandler}
                        placeholder={"00:00"}
                      />
                      {/* <TimePickers
                        change={detailsHandler}
                        placeholder={"00:00"}
                        name="MeetingStartTime"
                        value={createMeetingTime}
                        required
                      /> */}
                      <div className="height-10">
                        {modalField === true &&
                        createMeeting.MeetingStartTime === "" ? (
                          <ErrorBar errorText={t("Select-time")} />
                        ) : null}
                      </div>
                    </Col>

                    <Col
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      className="CreateMeetingDate "
                    >
                      <div className="datepicker align-items-center ">
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
                          onOpenPickNewDate={false}
                          inputMode=""
                          value={meetingDate}
                          calendar={calendarValue}
                          locale={localValue}
                          onChange={meetingDateHandler}
                        />
                        {/* <MultiDatePicker
                          onChange={meetingDateHandler}
                          name="MeetingDate"
                          value={meetingDate}
                          calendar={calendarValue}
                          locale={localValue}
                          // newValue={createMeeting.MeetingDate}
                        /> */}
                      </div>
                      <div className="height-10">
                        {modalField === true &&
                        createMeeting.MeetingDate === "" ? (
                          <ErrorBar errorText={t("Select-date")} />
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={1} md={1} sm={1} xs={12}></Col>
                    <Col
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      className="createmeeting-schedule-reminder CreateMeetingReminder"
                    >
                      <SelectBox
                        name="MeetingReminderID"
                        placeholder={t("Reminder")}
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

                  <Row className="createmeetingInput-row mt-1">
                    <Col
                      lg={1}
                      md={2}
                      sm={3}
                      xs={12}
                      className="CreateMeetingInput"
                    >
                      <Button
                        text={
                          createMeeting.IsVideoCall === false ? (
                            <img src={MeetingVideoChatIcon} />
                          ) : (
                            <img src={MeetingVideoChatIconActive} />
                          )
                        }
                        name="IsVideoCall"
                        className={
                          createMeeting.IsVideoCall === false
                            ? "cameraButton"
                            : "cameraButton Enable"
                        }
                        onClick={videoEnableButton}
                      />
                    </Col>
                    <Col
                      lg={7}
                      md={5}
                      sm={5}
                      xs={12}
                      className="location-textbox CreateMeetingInput"
                    >
                      <TextField
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
                      className="UpdateCheckbox mt-2 "
                    >
                      <Checkbox
                        className="SearchCheckbox MontserratSemiBold-600"
                        name="IsChat"
                        label={t("Group-chat")}
                        checked={createMeeting.IsChat}
                        onChange={onChange}
                        classNameDiv="checkboxParentClass"
                      ></Checkbox>
                    </Col>
                  </Row>

                  <Row className="createmeetingInput-row ">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="location-textbox CreateMeetingInput"
                    >
                      <TextField
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
                          className="agenda-title-field CreateMeetingAgenda"
                        >
                          <TextField
                            change={agendaHandler}
                            name={"Title"}
                            value={objMeetingAgenda.Title}
                            applyClass="form-control2"
                            type="text"
                            maxLength={300}
                            placeholder={t("Agenda-title") + "*"}
                          />
                          {modalField === true &&
                          objMeetingAgenda.Title === "" ? (
                            <ErrorBar errorText={t("This-field-is-empty")} />
                          ) : null}
                        </Col>
                        <Col
                          lg={4}
                          md={4}
                          xs={12}
                          className="agenda-title-field CreateMeetingAgenda"
                        >
                          <TextField
                            change={agendaHandler}
                            name={"PresenterName"}
                            value={objMeetingAgenda.PresenterName}
                            applyClass="form-control2"
                            type="text"
                            maxLength={200}
                            placeholder={t("Presenter")}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="agenda-title-field CreateMeetingAgenda"
                        >
                          <TextField
                            change={agendaHandler}
                            name={"URLs"}
                            value={objMeetingAgenda.URLs}
                            applyClass="form-control2"
                            type="text"
                            placeholder={t("Url")}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="d-flex justify-content-start flex-column "
                        >
                          <label className="MontserratRegular ">
                            {t("Attachement")}
                          </label>
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
                            ? t("Update-agenda")
                            : "+ " + t("Add-agenda")
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
                                  {ext === "doc" ? (
                                    <FileIcon
                                      extension={"docx"}
                                      size={78}
                                      labelColor={"rgba(16, 121, 63)"}
                                    />
                                  ) : ext === "xlsx" ? (
                                    <FileIcon
                                      extension={"xls"}
                                      type={"spreadsheet"}
                                      size={78}
                                      labelColor={"rgba(16, 121, 63)"}
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
                                      labelColor={"rgba(102, 102, 224)"}
                                    />
                                  ) : ext === "txt" ? (
                                    <FileIcon
                                      extension={"txt"}
                                      size={78}
                                      type={"document"}
                                      labelColor={"rgba(52, 120, 199)"}
                                    />
                                  ) : ext === "jpg" ? (
                                    <FileIcon
                                      extension={"jpg"}
                                      size={78}
                                      type={"image"}
                                      labelColor={"rgba(102, 102, 224)"}
                                    />
                                  ) : ext === "jpeg" ? (
                                    <FileIcon
                                      extension={"jpeg"}
                                      size={78}
                                      type={"image"}
                                      labelColor={"rgba(102, 102, 224)"}
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
                                          className={"btn editAgendaGridBtn"}
                                          variant={"Primary"}
                                          text={t("Edit")}
                                          onClick={() => editGrid(data, index)}
                                          datatut="show-agenda"
                                        />
                                      </Col>
                                      <Col lg={2} md={2} xs={6}>
                                        <Button
                                          className={"btn  deleteAgendaGridBtn"}
                                          variant={"Primary"}
                                          text={t("Delete")}
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
                                          placeholder={t("Agenda-title")}
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
                  <Row className=" mt-3">
                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className={
                        "attendee-title-field inputSearchFilter m-0  CreateMeetingParticipant addattendee-textfield-width"
                      }
                    >
                      <InputSearchFilter
                        placeholder={t("Add-attendees")}
                        className="taskassignee"
                        value={taskAssignedToInput}
                        filteredDataHandler={searchFilterHandler(
                          taskAssignedToInput
                        )}
                        applyClass={"input_searchAttendees_createMeeting"}
                        change={onChangeSearch}
                        onclickFlag={onclickFlag}
                      />
                    </Col>
                    <Col
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      className="Atteendees-organizer-participant CreateMeetingReminder m-0 select-participant-box"
                    >
                      <SelectBox
                        name="Participant"
                        // width="100%"
                        placeholder={t("Participant") + "*"}
                        option={participantOptions}
                        value={participantRoleName}
                        change={assigntRoleAttendies}
                      />
                    </Col>
                    <Col lg={2} md={2} sm={12} xs={12}>
                      <Button
                        className={"addattendees-btn"}
                        text={t("Add")}
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
                        sm={12}
                        xs={12}
                        className="participant-heading-creatingmeeting"
                      >
                        <label className="MontserratSemiBold-600">
                          {t("Organizer")}
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        {addedParticipantNameList ? (
                          <>
                            {console.log(addedParticipantNameList, "Asdasd")}
                            <span>
                              {addedParticipantNameList.map((atList, index) => {
                                console.log(atList, "atListatListatListatList");
                                if (atList.role === 1) {
                                  return (
                                    <EmployeeCard
                                      employeeName={atList.name}
                                      employeeDesignation={atList.designation}
                                      organizer={
                                        atList.role === 1 ? true : false
                                      }
                                      UserProfilePic={atList.displayProfilePic}
                                      IconOnClick={() =>
                                        atList.role !== 3
                                          ? handleDeleteAttendee(atList, index)
                                          : null
                                      }
                                    />
                                  );
                                } else if (atList.role === 3) {
                                  return (
                                    <EmployeeCard
                                      employeeName={atList.name}
                                      employeeDesignation={atList.designation}
                                      organizer={
                                        atList.role === 3 ? false : true
                                      }
                                      UserProfilePic={atList.displayProfilePic}
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
                        sm={12}
                        xs={12}
                        className="participant-heading-creatingmeeting"
                      >
                        <label className="MontserratSemiBold-600">
                          {t("Participants")}
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
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
                                        UserProfilePic={
                                          atList.displayProfilePic
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
                        {t("Are-you-sure-you-want-to-schedule-this-meeting")}
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
                      className={
                        currentLanguage === "ar"
                          ? "d-flex justify-content-end mt-4 p-0"
                          : "d-flex justify-content-end mt-5 p-0"
                      }
                    >
                      <Button
                        onClick={navigateToAgenda}
                        className={"createmeeting_details_footer_NextBtn"}
                        variant={"Primary"}
                        text={t("Next")}
                        type="submit"
                      />
                    </Col>
                  </Row>
                </>
              ) : isAgenda ? (
                <>
                  <Row className="display-contents ">
                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className={
                        currentLanguage === "ar" ? "mt-4 p-0" : "mt-5 p-0"
                      }
                    >
                      <Button
                        onClick={addAnOtherAgenda}
                        className={
                          "modal-createMeeting-addagendaBtn" +
                          " " +
                          currentLanguage
                        }
                        text={
                          editRecordFlag
                            ? t("Update-agenda")
                            : `${"+"}  ${t("Add-agenda")}`
                        }
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className={
                        currentLanguage === "ar"
                          ? "d-flex justify-content-end mt-4 p-0"
                          : "d-flex justify-content-end mt-5 p-0"
                      }
                    >
                      <Button
                        onClick={navigateToAttendees}
                        className={
                          "btn btn-primary modal-createMeeting-addagendaBtn_Next"
                        }
                        text={t("Next")}
                        type="submit"
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
                      className={
                        currentLanguage === "ar"
                          ? "d-flex justify-content-end mt-4 p-0"
                          : "d-flex justify-content-end mt-5 p-0"
                      }
                    >
                      <Button
                        className={
                          "btn btn-primary modal-createMeeting-publish"
                        }
                        text={t("Publish")}
                        onClick={navigateToPublish}
                        type="submit"
                      />
                    </Col>
                  </Row>
                </>
              ) : isPublishMeeting ? (
                <Row className="confirmationDialogue-2 mb-3">
                  <Col lg={6} md={6} sm={6} xs={12} className="text-end">
                    <Button
                      className={"cancel-schedule-meeting"}
                      text={t("Cancel")}
                      onClick={handleCancel}
                    />
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12} className="text-start">
                    <Button
                      className={"btn btn-primary schedule-modal-meeting"}
                      text={t("Schedule")}
                      onClick={handleSubmit}
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

export default ModalMeeting;
