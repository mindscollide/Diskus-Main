import React, { useState, useEffect } from "react";
import "./ModalUpdate.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import Select from "react-select";
import {
  convertDateTimeObject,
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
  AttachmentViewer,
} from "./../../components/elements";
import {
  FileUploadToDo,
  ResetAllFilesUpload,
} from "../../store/actions/Upload_action";
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
import {
  getCurrentDate,
  getCurrentDateTime,
  getHoursMinutesSec,
  getStartTimeWithCeilFunction,
} from "../../commen/functions/time_formatter";
import { ConvertFileSizeInMB } from "../../commen/functions/convertFileSizeInMB";

const ModalUpdate = ({ editFlag, setEditFlag, ModalTitle, checkFlag }) => {
  //For Localization
  const { t } = useTranslation();
  const getStartTime = getStartTimeWithCeilFunction();
  const getCurrentDateforMeeting = getCurrentDate();
  const [defaultPresenter, setDefaultPresenter] = useState(null);
  let currentLanguage = localStorage.getItem("i18nextLng");
  let createrID = Number(localStorage.getItem("userID"));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignees, uploadReducer, CommitteeReducer, GroupsReducer } =
    useSelector((state) => state);
  let OrganizationId = localStorage.getItem("organizationID");
  const [currentStep, setCurrentStep] = useState(1);
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
  const [editRecordFlag, seteditRecordFlag] = useState(false);
  const [editRecordIndex, seteditRecordIndex] = useState(null);
  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);
  console.log(closeConfirmationModal, "closeConfirmationModal");
  // for modal fields error
  const [modalField, setModalField] = useState(false);

  const [objMeetingAgenda, setObjMeetingAgenda] = useState({
    PK_MAID: 0,
    Title: "",
    PresenterName: "",
    URLs: "",
    FK_MDID: 0,
  });
  const [defaultMeetingAgenda, setDefaultObjMeetingAgenda] = useState({
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
  console.log(
    meetingAgendaAttachments,
    "meetingAgendaAttachmentsmeetingAgendaAttachments"
  );
  // for meatings  Attendees
  const [meetingAttendees, setMeetingAttendees] = useState({
    User: {
      PK_UID: 0,
    },
    MeetingAttendeeRole: {
      PK_MARID: 2,
    },
    AttendeeAvailability: {
      PK_AAID: 1,
    },
  });

  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);

  const [attendeesParticipant, setAttendeesParticipant] = useState([]);

  // for   dropdown Attendees List
  const [optiosnMeetingAttendeesList, setOptiosnMeetingAttendeesList] =
    useState([]);

  // for   selected Attendees Name
  const [selectedAttendeesName, setSelectedAttendeesName] = useState("");

  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("Participant");

  //Reminder Stats
  const [reminderValue, setReminderValue] = useState("");
  const [reminder, setReminder] = useState("");

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
  const [taskAssignedToInput, setTaskAssignedToInput] = useState({
    value: 0,
    label: "",
    name: "",
  });
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
  console.log(createMeeting, "createMeetingcreateMeetingcreateMeeting");
  const [minutesOfMeeting, setMinutesOfMeeting] = useState([]);
  const [createMeetingTime, setCreateMeetingTime] = useState("");
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });

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

  const changeSelectDetails = () => {
    setCurrentStep(1);
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
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== ""
      // createMeeting.MeetingReminderID.length != 0 &&
      // createMeeting.MeetingDescription != "" &&
      // createMeeting.MeetingLocation != ""
      //  &&
      // createMeeting.MeetingTitle != ""
    ) {
      setCurrentStep(2);
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(true);
      setIsAttendees(false);
      setIsMinutes(false);
      setCancelMeetingModal(false);
    } else {
      setCurrentStep(1);

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
      createMeeting.MeetingDate !== ""
      // createMeeting.MeetingReminderID.length != 0 &&
      // createMeeting.MeetingDescription != "" &&
      // createMeeting.MeetingLocation !== ""
      // &&
      // createMeeting.MeetingTitle !== ""
    ) {
      setCurrentStep(3);

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
      setCurrentStep(1);

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
      createMeeting.MeetingDate !== ""
      // createMeeting.MeetingDescription != "" &&
      // createMeeting.MeetingLocation !== ""
      // &&
      // createMeeting.MeetingTitle != ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(false);
      setCurrentStep(4);

      setIsMinutes(true);
    } else {
      setModalField(true);
      setCurrentStep(1);

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
      // createMeeting.MeetingLocation !== "" &&
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
      setCurrentStep(2);
    } else {
      setModalField(true);
      setIsDetails(true);
      setCurrentStep(1);
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
      setCurrentStep(3);
    } else {
      setIsAgenda(true);
      setCurrentStep(2);

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
    setCurrentStep(4);
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
    let finalDateTimeWithoutUTC =
      createMeeting.MeetingDate + createMeeting.MeetingStartTime;
    let newDate = finalDateTimeWithoutUTC.slice(0, 8);
    let newTime = finalDateTimeWithoutUTC.slice(8, 14);
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
    await setParticipantRoleName("Participant");
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
        PK_MARID: 2,
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
    } catch (error) {}
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
    //
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
    }
  };

  // for add another agenda main inputs handler
  const uploadFilesAgenda = (data) => {
    let filesArray = Object.values(data.target.files);
    let currentFiles = meetingAgendaAttachments.MeetingAgendaAttachments;
    let fileSizeArr = fileSize;

    // Check if adding the new files exceeds the limit
    if (currentFiles.length + filesArray.length > 10) {
      setTimeout(() => {
        setOpen({
          flag: true,
          message: t("You-can-not-upload-more-then-10-files"),
        });
      }, 3000);
      return;
    }

    filesArray.forEach((uploadedFile) => {
      let fileSizeinMB = ConvertFileSizeInMB(uploadedFile.size);
      let mergeFileSizes = ConvertFileSizeInMB(fileSizeArr);
      let ext = uploadedFile.name.split(".").pop().toLowerCase();

      // Check total size after adding each file
      if (mergeFileSizes + fileSizeinMB > 100) {
        setTimeout(() => {
          setOpen({
            flag: true,
            message: t("You-can-not-upload-more-then-100MB-files"),
          });
        }, 3000);
        return;
      }

      if (
        [
          "doc",
          "docx",
          "xls",
          "xlsx",
          "pdf",
          "png",
          "txt",
          "jpg",
          "jpeg",
          "gif",
          "csv",
        ].includes(ext)
      ) {
        let fileExists = currentFiles.some(
          (filename) => filename.DisplayAttachmentName === uploadedFile.name
        );

        if (fileExists) {
          setOpen({
            ...open,
            flag: true,
            message: t("This-file-already-exist"),
          });
        } else if (fileSizeinMB > 10) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("You-can-not-upload-more-then-10MB-file"),
            });
          }, 3000);
        } else if (fileSizeinMB === 0) {
          setOpen({
            ...open,
            flag: true,
            message: t("File-size-is-0mb"),
          });
        } else {
          dispatch(FileUploadToDo(navigate, uploadedFile, t, 2));
          fileSizeArr += uploadedFile.size;
          currentFiles.push({
            PK_MAAID: 0,
            DisplayAttachmentName: uploadedFile.name,
            OriginalAttachmentName: uploadedFile.name,
            CreationDateTime: "111111",
            FK_MAID: 0,
          });
          setFileSize(fileSizeArr);
        }
      }
    });

    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      MeetingAgendaAttachments: currentFiles,
    });
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
    if (newData !== undefined && newData?.length !== 0 && newData !== null) {
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
      dispatch(ResetAllFilesUpload());
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
            setObjMeetingAgenda(defaultMeetingAgenda);
            setPresenterValue(defaultPresenter);

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
          setPresenterValue(defaultPresenter);
          setObjMeetingAgenda(defaultMeetingAgenda);
          setMeetingAgendaAttachments({
            MeetingAgendaAttachments: [],
          });
          setFileSize(0);
        }
      } else {
        setModalField(true);
        // setOpen({
        //   ...open,
        //   flag: true,
        //   message: t("Enter-Title-Information"),
        // });
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
            setObjMeetingAgenda(defaultMeetingAgenda);
            setMeetingAgendaAttachments({
              MeetingAgendaAttachments: [],
            });
            setPresenterValue(defaultPresenter);
            setFileSize(0);
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
          setObjMeetingAgenda(defaultMeetingAgenda);
          setPresenterValue(defaultPresenter);
          setMeetingAgendaAttachments({
            MeetingAgendaAttachments: [],
          });
          setFileSize(0);
        }
      } else {
        // If Title is empty, create a numbered title and append the object
        const agendaCount = createMeeting.MeetingAgendas.length + 1;
        const newObjMeetingAgenda = {
          ...objMeetingAgenda,
          Title: `Agenda ${agendaCount}`,
        };

        let previousAdendas = [...createMeeting.MeetingAgendas];
        let newData = {
          ObjMeetingAgenda: newObjMeetingAgenda,
          MeetingAgendaAttachments: [],
        };
        previousAdendas.push(newData);
        setCreateMeeting({
          ...createMeeting,
          MeetingAgendas: previousAdendas,
        });

        // Show the modal and message if necessary
        setModalField(true);
        // setOpen({
        //   ...open,
        //   flag: true,
        //   message: t("Enter-Title-Information"),
        // });
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
      setParticipantRoleName(t("Participant"));
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
          PK_MARID: 2,
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
      let PresenterData = [];
      assignees.user.forEach((user, index) => {
        if (Number(user.pK_UID) === Number(createrID)) {
          setDefaultPresenter({
            label: (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    <img
                      src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                      height='16.45px'
                      width='18.32px'
                      draggable='false'
                      alt=''
                    />
                    <span>{user?.name}</span>
                  </Col>
                </Row>
              </>
            ),
            value: user?.pK_UID,
            name: user?.name,
          });
          setPresenterValue({
            label: (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    <img
                      src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                      height='16.45px'
                      width='18.32px'
                      draggable='false'
                      alt=''
                    />
                    <span>{user?.name}</span>
                  </Col>
                </Row>
              </>
            ),
            value: user?.pK_UID,
            name: user?.name,
          });
          setDefaultObjMeetingAgenda({
            ...defaultMeetingAgenda,
            PresenterName: user?.name,
          });
          setObjMeetingAgenda({
            ...objMeetingAgenda,
            PresenterName: user?.name,
          });
        }
      });
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
    if (createMeeting.MeetingStartTime !== "") {
      let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
      let meetingDateSaveFormat = new DateObject(date).format("YYYYMMDD");
      const getformattedDateTIme = getCurrentDateTime(new Date());
      const dateTimeFormat = convertDateTimeObject(
        `${meetingDateSaveFormat}${createMeeting.MeetingStartTime}`
      );
      const currentDateTime = convertDateTimeObject(getformattedDateTIme);
      if (dateTimeFormat < currentDateTime) {
        setOpen({
          flag: true,
          message: t(
            "Date-and-time-should-be-greater-than-current-system-time"
          ),
        });
        setTimeout(() => {
          setMeetingDate(getCurrentDateforMeeting.DateGMT);
          setCreateMeeting({
            ...createMeeting,
            MeetingDate: getCurrentDateforMeeting.dateFormat,
          });
        }, 1000);
      } else {
        setMeetingDate(meetingDateValueFormat);
        setCreateMeeting({
          ...createMeeting,
          MeetingDate: meetingDateSaveFormat,
        });
      }
    } else {
      let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
      let meetingDateSaveFormat = new DateObject(date).format("YYYYMMDD");

      setMeetingDate(meetingDateValueFormat);
      setCreateMeeting({
        ...createMeeting,
        MeetingDate: meetingDateSaveFormat,
      });
    }
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
        let emptyList = [];
        try {
          if (viewData.meetingAttendees !== undefined) {
            if (viewData.meetingAttendees.length > 0) {
              viewData.meetingAttendees.forEach((meetingdata, index) => {
                List.push({
                  name: meetingdata.user.name,
                  designation: meetingdata.user.designation,
                  profilePicture: meetingdata.user.profilePicture,
                  organization: meetingdata.user.organization,
                  role: meetingdata.meetingAttendeeRole.pK_MARID,
                  displayProfilePic: meetingdata.user.displayProfilePictureName,
                  isPrimaryOrganizer: meetingdata.isPrimaryOrganizer,
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
        } catch (error) {}
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
        } catch (error) {}
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
    } catch (error) {}
  }, [assignees.ViewMeetingDetails]);

  const editGrid = (datarecord, dataindex) => {
    let Data;
    assignees.user.forEach((user, index) => {
      if (user.name === datarecord.ObjMeetingAgenda.PresenterName) {
        Data = {
          label: (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex gap-2 align-items-center'>
                  <img
                    src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                    height='16.45px'
                    width='18.32px'
                    draggable='false'
                    alt=''
                  />
                  <span>{user.name}</span>
                </Col>
              </Row>
            </>
          ),
          value: user.pK_UID,
          name: user.name,
        };
      }
      setPresenterValue(Data);
    });
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
    if (Number(checkFlag) === 6) {
      let CommitteeMembers =
        CommitteeReducer?.getCommitteeByCommitteeID?.committeMembers;
      if (
        CommitteeMembers !== undefined &&
        CommitteeMembers !== null &&
        CommitteeMembers.length !== 0
      ) {
        return CommitteeMembers.filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.userName.toLowerCase();
          return searchTerm && assigneesName.startsWith(searchTerm);
        })
          .slice(0, 10)
          .map((item) => (
            <div
              onClick={() => onSearch(item.userName, item.pK_UID)}
              className='dropdown-row-assignee d-flex align-items-center flex-row'
              key={item.pK_UID}>
              <img
                src={`data:image/jpeg;base64,${item.userProfilePicture.displayProfilePictureName}`}
                alt=''
                className='user-img'
              />
              <p className='p-0 m-0'>{item.userName}</p>
            </div>
          ));
      }
    } else if (Number(checkFlag) === 7) {
      let GroupMembers = GroupsReducer?.getGroupByGroupIdResponse?.groupMembers;
      if (
        GroupMembers !== undefined &&
        GroupMembers !== null &&
        GroupMembers.length !== 0
      ) {
        return GroupMembers.filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.userName.toLowerCase();
          return searchTerm && assigneesName.startsWith(searchTerm);
        })
          .slice(0, 10)
          .map((item) => (
            <div
              onClick={() => onSearch(item.userName, item.pK_UID)}
              className='dropdown-row-assignee d-flex align-items-center flex-row'
              key={item.pK_UID}>
              <img
                src={`data:image/jpeg;base64,${item.userProfilePicture.displayProfilePictureName}`}
                alt=''
                className='user-img'
              />
              <p className='p-0 m-0'>{item.userName}</p>
            </div>
          ));
      }
    } else {
      let allAssignees = assignees.user;
      if (
        allAssignees !== undefined &&
        allAssignees !== null &&
        allAssignees.length !== 0
      ) {
        return allAssignees
          .filter((item) => {
            const searchTerm = value.toLowerCase();
            const assigneesName = item.name.toLowerCase();
            return searchTerm && assigneesName.startsWith(searchTerm);
          })
          .slice(0, 10)
          .map((item) => (
            <div
              onClick={() => onSearch(item.name, item.pK_UID)}
              className='dropdown-row-assignee d-flex align-items-center flex-row'
              key={item.pK_UID}>
              <img
                src={`data:image/jpeg;base64,${item.displayProfilePictureName}`}
                alt=''
                className='user-img'
              />
              <p className='p-0 m-0'>{item.name}</p>
            </div>
          ));
      }
    }
  };
  useEffect(() => {
    try {
      let membersData = [];
      if (Number(checkFlag) === 6) {
        // Committees MembersData
        let CommitteeMembers =
          CommitteeReducer?.getCommitteeByCommitteeID?.committeMembers;
        if (
          CommitteeMembers !== null &&
          CommitteeMembers !== undefined &&
          CommitteeMembers.length > 0
        ) {
          CommitteeMembers.forEach((committeesMember, index) => {
            membersData.push({
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className='d-flex gap-2 align-items-center'>
                      <img
                        src={`data:image/jpeg;base64,${committeesMember?.userProfilePicture.displayProfilePictureName}`}
                        height='16.45px'
                        width='18.32px'
                        draggable='false'
                        alt=''
                      />
                      <span>{committeesMember.userName}</span>
                    </Col>
                  </Row>
                </>
              ),
              value: committeesMember?.pK_UID,
              name: committeesMember?.userName,
            });
          });
        }
      } else if (Number(checkFlag) === 7) {
        let GroupMembers =
          GroupsReducer?.getGroupByGroupIdResponse?.groupMembers;
        if (
          GroupMembers !== null &&
          GroupMembers !== undefined &&
          GroupMembers.length > 0
        ) {
          GroupMembers.forEach((groupMemberData, index) => {
            membersData.push({
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className='d-flex gap-2 align-items-center'>
                      <img
                        src={`data:image/jpeg;base64,${groupMemberData?.userProfilePicture.displayProfilePictureName}`}
                        height='16.45px'
                        width='18.32px'
                        draggable='false'
                        alt=''
                      />
                      <span>{groupMemberData.userName}</span>
                    </Col>
                  </Row>
                </>
              ),
              value: groupMemberData?.pK_UID,
              name: groupMemberData?.userName,
            });
          });
        }
        // Group MembersData
      } else {
        let allAssignees = assignees.user;
        if (
          allAssignees !== undefined &&
          allAssignees !== null &&
          allAssignees.length !== 0
        ) {
          allAssignees.forEach((assigneeMember, index) => {
            membersData.push({
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className='d-flex gap-2 align-items-center'>
                      <img
                        src={`data:image/jpeg;base64,${assigneeMember?.displayProfilePictureName}`}
                        height='16.45px'
                        width='18.32px'
                        draggable='false'
                        alt=''
                      />
                      <span>{assigneeMember.name}</span>
                    </Col>
                  </Row>
                </>
              ),
              value: assigneeMember?.pK_UID,
              name: assigneeMember?.name,
            });
          });
        }
        // meeting Members
      }
      setAttendeesParticipant(membersData);
    } catch {}
  }, [checkFlag]);

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
        setParticipantRoleName("Participant");
        setTaskAssignedToInput("");
        let newData = {
          User: {
            PK_UID: 0,
          },
          MeetingAttendeeRole: {
            PK_MARID: 2,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        };
        setMeetingAttendees(newData);
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
            PK_MARID: 2,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        };
        setMeetingAttendees(newData);
        setTaskAssignedTo(0);
        setTaskAssignedName("");
        setParticipantRoleName("Participant");
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
        setParticipantRoleName("Participant");
        let newData = {
          User: {
            PK_UID: 0,
          },
          MeetingAttendeeRole: {
            PK_MARID: 2,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        };
        setMeetingAttendees(newData);
        setTaskAssignedToInput("");
      }
    }
  };

  // for attendies handler
  const handleSubmit = async () => {
    let hasOrganizer = createMeeting.MeetingAttendees.some(
      (attendee) => attendee.MeetingAttendeeRole.PK_MARID === 1
    );

    if (hasOrganizer) {
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
      let finalDateTimeWithoutUTC =
        createMeeting.MeetingDate + createMeeting.MeetingStartTime;
      let newDate = finalDateTimeWithoutUTC.slice(0, 8);
      let newTime = finalDateTimeWithoutUTC.slice(8, 14);
      let ifemptyTime = moment(newTime, "HHmmss").format("hh-mm-ss");
      let ifemptyDate = moment(newDate, "YYYYMMDD").format("MMM DD, YYYY");
      // let newDate = finalDateTime.slice(0, 8);
      // let newTime = finalDateTime.slice(8, 14);
      // let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
      let newData = {
        MeetingID: createMeeting.MeetingID,
        MeetingTitle:
          createMeeting.MeetingTitle !== ""
            ? createMeeting.MeetingTitle
            : `Untitled @ ${ifemptyDate} ${ifemptyTime}`,
        MeetingDescription: createMeeting.MeetingDescription,
        MeetingTypeID: 0,
        MeetingDate: finalDateTime.slice(0, 8),
        OrganizationId: parseInt(OrganizationId),
        MeetingStartTime: finalDateTime.slice(8, 14),
        MeetingEndTime: finalDateTime.slice(8, 14),
        MeetingLocation: createMeeting.MeetingLocation,
        IsVideoCall: createMeeting.IsVideoCall,
        IsChat: createMeeting.IsChat,
        MeetingReminderID: createMeeting.MeetingReminderID,
        MeetingAgendas: createMeeting.MeetingAgendas,
        MeetingAttendees: createMeeting.MeetingAttendees,
        ExternalMeetingAttendees: createMeeting.ExternalMeetingAttendees,
      };
      // if (hasOrganizer) {
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
      await setParticipantRoleName("Participant");
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
          PK_MARID: 2,
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
      setOpen({
        ...open,
        flag: true,
        message: t("Please-atleast-add-one-organizer"),
      });
    }
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
    await dispatch(CancelMeeting(navigate, Data, t, checkFlag));
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
    setParticipantRoleName("Participant");
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
        PK_MARID: 2,
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
    setParticipantRoleName("Participant");
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
        PK_MARID: 2,
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
        await setParticipantRoleName("Participant");
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
            PK_MARID: 2,
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
        await setParticipantRoleName("Participant");
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
            PK_MARID: 2,
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
    if (createMeeting.MeetingDate !== "") {
      let newDate = new Date(newTime);
      if (newDate instanceof Date && !isNaN(newDate)) {
        const getFormattedTime = getHoursMinutesSec(newDate);
        const getformattedDateTIme = getCurrentDateTime(new Date());
        const dateTimeFormat = convertDateTimeObject(
          `${createMeeting.MeetingDate}${getFormattedTime}`
        );
        const currentDateTime = convertDateTimeObject(getformattedDateTIme);

        if (dateTimeFormat < currentDateTime) {
          setCreateMeeting({
            ...createMeeting,
            MeetingStartTime: getStartTime.formattedTime,
            MeetingEndTime: getStartTime.formattedTime,
          });
          setCreateMeetingTime(getStartTime.newFormatTime);
        } else {
          setCreateMeeting({
            ...createMeeting,
            MeetingStartTime: getFormattedTime,
            MeetingEndTime: getFormattedTime,
          });
          setCreateMeetingTime(newTime);
        }
      }
      setSelectedTime(newTime);
    } else {
      let newDate = new Date(newTime);
      if (newDate instanceof Date && !isNaN(newDate)) {
        const getFormattedTime = getHoursMinutesSec(newDate);
        setCreateMeeting({
          ...createMeeting,
          MeetingStartTime: getFormattedTime,
          MeetingEndTime: getFormattedTime,
        });
        setCreateMeetingTime(newTime);
      }
      setSelectedTime(newTime);
    }
  };

  function CustomInput({ onFocus, value, onChange }) {
    return (
      <input
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        className='input-with-icon'
      />
    );
  }
  const onHideHandleModal = () => {
    setCloseConfirmationModal(true);
    // setModalField(false);
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(false);
    setIsPublishMeeting(false);
    setCancelMeetingModal(false);
  };
  const onHideCancelButton = () => {
    if (currentStep === 1) {
      setIsDetails(true);
      setIsAgenda(false);
      setIsAttendees(false);
      setCloseConfirmationModal(false);

      setIsMinutes(false);
    } else if (currentStep === 2) {
      setIsDetails(false);
      setIsAgenda(true);
      setCloseConfirmationModal(false);

      setIsAttendees(false);
      setIsMinutes(false);
    } else if (currentStep === 3) {
      setIsDetails(false);
      setCloseConfirmationModal(false);

      setIsAgenda(false);
      setIsAttendees(true);
      setIsMinutes(false);
    } else if (currentStep === 4) {
      setIsDetails(false);
      setIsAgenda(false);
      setCloseConfirmationModal(false);

      setIsAttendees(false);
      setIsMinutes(true);
    }
  };
  const handleCloseUpdateMeeting = () => {
    setEditFlag(false);
  };
  const handleDeleteAgenda = (data, indexValue) => {
    let copyMeetingAgenda = [...createMeeting.MeetingAgendas];
    let findIndexofMeetingAgenda = createMeeting.MeetingAgendas.findIndex(
      (data, index) => index === indexValue
    );
    if (findIndexofMeetingAgenda !== -1) {
      copyMeetingAgenda.splice(findIndexofMeetingAgenda, 1);
    }
    // copyMeetingData
    setCreateMeeting({
      ...createMeeting,
      MeetingAgendas: copyMeetingAgenda,
    });
  };
  console.log(createMeeting, "handleDeleteAgendahandleDeleteAgenda");

  const handleChangePresenter = (value) => {
    console.log(
      value,
      "handleChangePresenterhandleChangePresenterhandleChangePresenter"
    );
    setPresenterValue(value);
    setObjMeetingAgenda({
      ...objMeetingAgenda,
      PresenterName: value.name,
    });
  };
  const filterFunc = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  const handleChangeAttenddes = (attendeeData) => {
    setTaskAssignedToInput({
      ...taskAssignedToInput,
      label: attendeeData.label,
      value: attendeeData.value,
      name: attendeeData.name,
    });
    setTaskAssignedTo(attendeeData.value);
  };
  return (
    <>
      <Container>
        <Modal
          onHide={onHideHandleModal}
          show={editFlag}
          setShow={setEditFlag}
          className={closeConfirmationModal ? null : "meeting_update"}
          ButtonTitle={ModalTitle}
          // modalBodyClassName="modalMeetingUpdateBody"
          modalFooterClassName={
            isDetails
              ? "d-flex "
              : isAgenda
              ? "d-block "
              : isCancelMeetingModal
              ? "d-block"
              : closeConfirmationModal
              ? "d-block"
              : ""
          }
          modalHeaderClassName={"d-none"}
          size={
            isPublishMeeting || isCancelMeetingModal || closeConfirmationModal
              ? null
              : "md"
          }
          ModalBody={
            <>
              {isPublishMeeting === false &&
              isCancelMeetingModal === false &&
              closeConfirmationModal === false ? (
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className='d-flex gap-4'>
                    <Button
                      className={
                        isDetails
                          ? "  isDetail-Update-btn"
                          : "   isDetail-Update-Outline-btn"
                      }
                      variant={"Primary"}
                      text={t("Details")}
                      onClick={changeSelectDetails}
                    />
                    <Button
                      className={
                        isAgenda
                          ? "  isDetail-Update-btn"
                          : "   isDetail-Update-Outline-btn"
                      }
                      variant={"Primary"}
                      text={t("Agendas")}
                      onClick={changeSelectAgenda}
                      datatut='show-agenda'
                    />
                    <Button
                      className={
                        isAttendees
                          ? "  isDetail-Update-btn"
                          : "   isDetail-Update-Outline-btn"
                      }
                      variant={"Primary"}
                      text={t("Attendees")}
                      datatut='show-meeting-attendees'
                      onClick={changeSelectAttendees}
                    />
                    {minutesOftheMeatingStatus && (
                      <Button
                        className={
                          isMinutes
                            ? "  isDetail-Update-btn"
                            : "   isDetail-Update-Outline-btn"
                        }
                        variant={"Primary"}
                        text={t("Minutes")}
                        datatut='show-minutes'
                        onClick={changeSelectMinutes}
                      />
                    )}
                  </Col>
                </Row>
              ) : null}
              {isDetails ? (
                <>
                  <Row className='udpateeetingtime-row-1'>
                    <Col
                      lg={3}
                      md={3}
                      sm={3}
                      xs={12}
                      className='CreateMeetingTime'>
                      <DatePicker
                        arrowClassName='arrowClass'
                        value={createMeetingTime}
                        containerClassName='containerClassTimePicker'
                        className='timePicker'
                        disableDayPicker
                        inputClass='inputTImeMeeting'
                        calendar={calendarValue}
                        locale={localValue}
                        format='hh:mm A'
                        selected={selectedTime}
                        editable={false}
                        render={<CustomInput />}
                        plugins={[<TimePicker hideSeconds />]}
                        onChange={handleTimeChange}
                      />
                      {/* <TextFieldTime
                        type="time"
                        labelclass="d-none"
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
                      className='CreateMeetingDate'>
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        minDate={moment().toDate()}
                        placeholder='DD/MM/YYYY'
                        render={
                          <InputIcon
                            placeholder='DD/MM/YYYY'
                            className='datepicker_input'
                          />
                        }
                        editable={false}
                        className='datePickerTodoCreate2'
                        onOpenPickNewDate={true}
                        inputMode=''
                        value={meetingDate}
                        calendar={calendarValue}
                        locale={localValue}
                        onFocusedDateChange={meetingDateHandler}

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
                      className='createmeeting-schedule-reminder CreateMeetingReminder select-participant-update-box'>
                      <SelectBox
                        disable={endMeetingStatus}
                        name='MeetingReminderID'
                        placeholder={t("Reminder")}
                        option={reminder}
                        value={reminderValue}
                        change={ReminderNameHandler}
                        className='MeetingReminder'
                        required
                      />
                      {/* {  reminderValue === "" ? (
                        <ErrorBar errorText={"Select Reminder"} />
                      ) : null} */}
                    </Col>
                    {/* <Col lg={3} md={3} xs={12}></Col> */}
                  </Row>

                  <Row className='updatemeetingvideoiconbtrrow'>
                    <Col
                      lg={1}
                      md={1}
                      sm={2}
                      xs={12}
                      className='CreateMeetingInput'>
                      <Button
                        disableBtn={endMeetingStatus}
                        text={<CameraVideo />}
                        name='IsVideoCall'
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
                      className='location-textbox CreateMeetingInput'>
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        name='MeetingLocation'
                        applyClass='form-control2'
                        type='text'
                        placeholder={t("Location-Videourl")}
                        value={createMeeting.MeetingLocation}
                        required={true}
                        maxLength={245}
                      />
                      {/* {modalField === true &&
                      createMeeting.MeetingLocation === "" ? (
                        <ErrorBar errorText={t("This-field-is-empty")} />
                      ) : null} */}
                    </Col>
                    <Col
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      className='UpdateCheckbox mt-2'>
                      <Checkbox
                        disabled={endMeetingStatus}
                        className='SearchCheckbox'
                        name='IsChat'
                        label={t("Group-chat")}
                        checked={createMeeting.IsChat}
                        onChange={onChange}
                        classNameDiv='checkboxParentClass'></Checkbox>
                    </Col>
                  </Row>

                  <Row className='updatemeetingvideoiconbtrrow'>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className='location-textbox CreateMeetingInput'>
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        value={createMeeting.MeetingTitle}
                        name='MeetingTitle'
                        applyClass={"form-control2"}
                        type='text'
                        size='small'
                        placeholder={t("Meeting-title")}
                        required={true}
                        maxLength={245}
                      />
                      {/* {modalField === true &&
                      createMeeting.MeetingTitle === "" ? (
                        <ErrorBar errorText={t("This-field-is-empty")} />
                      ) : null} */}
                    </Col>
                  </Row>

                  <Row className='updatemeetingtextarearow'>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className='CreateMeetingInput textAreaDiv'>
                      <TextField
                        disable={endMeetingStatus}
                        change={detailsHandler}
                        name='MeetingDescription'
                        applyClass='form-control2 updatemeetingtextarea'
                        type='text'
                        as={"textarea"}
                        rows='7'
                        placeholder={t("Description")}
                        value={createMeeting.MeetingDescription}
                        required={true}
                        // maxLength={500}
                      />
                      {/* { 
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
                    <div className='agenda_container'>
                      <Form onSubmit={addAnOtherAgenda}>
                        <Row>
                          <Col
                            lg={7}
                            md={7}
                            sm={12}
                            xs={12}
                            className='agenda-title-field CreateMeetingAgenda margin-bottom-10'>
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"Title"}
                              value={objMeetingAgenda.Title}
                              applyClass='form-control2'
                              maxLength={300}
                              type='text'
                              placeholder={t("Agenda-title") + "*"}
                            />
                            {/* {modalField === true &&
                            objMeetingAgenda.Title === "" ? (
                              <ErrorBar errorText={t("This-field-is-empty")} />
                            ) : null} */}
                          </Col>
                          <Col
                            lg={5}
                            md={5}
                            sm={12}
                            xs={12}
                            className='agenda-title-field '>
                            <Select
                              options={allPresenters}
                              isDisabled={endMeetingStatus}
                              maxMenuHeight={140}
                              classNamePrefix={"ModalOrganizerSelect"}
                              onChange={handleChangePresenter}
                              value={
                                presenterValue?.value === 0
                                  ? null
                                  : presenterValue
                              }
                              placeholder='Select Presenter'
                              filterOption={filterFunc}
                            />
                            {/* <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"PresenterName"}
                              value={objMeetingAgenda.PresenterName}
                              applyClass="form-control2"
                              type="text"
                              maxLength={200}
                              placeholder={t("Presenter")}
                            /> */}
                          </Col>
                        </Row>

                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className='agenda-title-field CreateMeetingAgenda'>
                            <TextField
                              disable={endMeetingStatus}
                              change={agendaHandler}
                              name={"URLs"}
                              value={objMeetingAgenda.URLs}
                              applyClass='form-control2'
                              type='text'
                              placeholder={t("Url")}
                            />
                          </Col>
                        </Row>
                        <Row className='mt-4'>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className='d-flex justify-content-start flex-column '>
                            <label>{t("Attachement")}</label>
                            <span className='custom-upload-input'>
                              <CustomUpload
                                change={uploadFilesAgenda}
                                multiple={true}
                                onClick={(event) => {
                                  event.target.value = null;
                                }}
                                className='UploadFileButton'
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
                                        return (
                                          <Col sm={4} md={4} lg={4}>
                                            <AttachmentViewer
                                              data={data}
                                              handleClickRemove={() => {
                                                deleteAttachmentfromAgenda(
                                                  data,
                                                  index
                                                );
                                              }}
                                              name={data.DisplayAttachmentName}
                                              fk_UID={createrID}
                                              id={0}
                                            />
                                          </Col>
                                        );
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
                    }>
                    {createMeeting.MeetingAgendas.length > 0
                      ? createMeeting.MeetingAgendas.map((data, index) => {
                          return (
                            <div className='margin-top-20'>
                              <Accordian
                                AccordioonHeader={data.ObjMeetingAgenda.Title}
                                AccordioonBody={
                                  <>
                                    <Row>
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                        className='d-flex gap-2'>
                                        <Button
                                          disableBtn={endMeetingStatus}
                                          className={"btn editAgendaGridBtn"}
                                          variant={"Primary"}
                                          text={t("Edit")}
                                          onClick={() => editGrid(data, index)}
                                          datatut='show-agenda'
                                        />
                                        <Button
                                          disableBtn={endMeetingStatus}
                                          className={"btn deleteAgendaBtn"}
                                          variant={"Primary"}
                                          text={t("Delete")}
                                          onClick={() =>
                                            handleDeleteAgenda(data, index)
                                          }
                                          datatut='show-agenda'
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={7} md={7} sm={12} xs={12}>
                                        <TextField
                                          disable={true}
                                          name={"Title"}
                                          value={data.ObjMeetingAgenda.Title}
                                          applyClass='form-control2'
                                          type='text'
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
                                          applyClass='form-control2'
                                          type='text'
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
                                          applyClass='form-control2'
                                          type='text'
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
                                              return (
                                                <Col sm={4} md={4} lg={4}>
                                                  <AttachmentViewer
                                                    data={
                                                      MeetingAgendaAttachmentsData
                                                    }
                                                    name={
                                                      MeetingAgendaAttachmentsData.DisplayAttachmentName
                                                    }
                                                    id={0}
                                                  />
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
                    <Row className='updatemeeting-attendees-row '>
                      <Col
                        lg={5}
                        md={5}
                        sm={12}
                        xs={12}
                        className='attendee-title-field  addattendee-textfield-Update'>
                        <Select
                          options={attendeesParticipant}
                          classNamePrefix={"ModalOrganizerSelect"}
                          filterOption={filterFunc}
                          placeholder='Please Select'
                          onChange={handleChangeAttenddes}
                          isSearchable={true}
                          value={
                            taskAssignedToInput.value === 0
                              ? null
                              : taskAssignedToInput
                          }
                        />
                        {/* <InputSearchFilter
                          placeholder={t("Add-attendees")}
                          value={taskAssignedToInput}
                          filteredDataHandler={searchFilterHandler(
                            taskAssignedToInput
                          )}
                          change={onChangeSearch}
                          applyClass={"input_searchAttendees_createMeeting"}
                        /> */}
                      </Col>
                      <Col
                        lg={5}
                        md={5}
                        sm={12}
                        xs={12}
                        className='Atteendees-organizer-participant CreateMeetingReminder select-Update-participant-box'>
                        <SelectBox
                          name='Participant'
                          width='100%'
                          placeholder={t("Participant") + "*"}
                          option={participantOptions}
                          value={participantRoleName}
                          change={assigntRoleAttendies}
                        />
                      </Col>
                      <Col lg={2} md={2} sm={12} xs={12} className='p-0'>
                        <Button
                          className={"btn update-add-attendee-btn"}
                          text={t("Add")}
                          onClick={addAttendees}
                          disableBtn={!taskAssignedToInput}
                        />
                      </Col>
                    </Row>
                  ) : null}

                  <div className='updatemeeting-participant-scroll'>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className='updatemeeting-participant-scroll-organizer'>
                        <label>{t("Organizer")}</label>
                      </Col>
                      <Col lg={12} md={12} xs={12}>
                        {addedParticipantNameList.length > 0 ? (
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
                                        atList.isPrimaryOrganizer &&
                                        !endMeetingStatus
                                          ? false
                                          : true
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
                        className='updatemeeting-participant-scroll-participant'>
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
                      <Row className='align-items-center'>
                        <Col
                          lg={10}
                          md={10}
                          sm={12}
                          className='CreateMeetingInput'>
                          <TextField
                            placeholder={t("Enter-minutes")}
                            value={recordsMinutesOfTheMeeting.Description}
                            change={onChangeAddMinutes}
                            maxLength={65}
                          />
                        </Col>
                        <Col lg={2} md={2} sm={12} className='updateMinute'>
                          <Button
                            className='btn btn-primary update-isminutes-addbtn'
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

                  <Row className='updatemeetingofminutes-row'>
                    <Col sm={12}>
                      <Row className='mt-3 minutes-view-2  px-3 d-flex flex-row '>
                        {minutesOfMeeting.length > 0 ? (
                          minutesOfMeeting.map(
                            (minutesOfMeetingLdata, index) => {
                              return (
                                <Col
                                  className='border p-2 minutes-box rounded my-2'
                                  sm={12}
                                  md={12}
                                  lg={12}>
                                  <Row>
                                    <Col sm={1}>
                                      <span className='agendaIndex'>
                                        {index + 1}
                                      </span>
                                    </Col>
                                    <Col sm={11}>
                                      <p className='updatemeetingofminutes-agendaTitle'>
                                        {minutesOfMeetingLdata.Description}
                                      </p>
                                    </Col>
                                  </Row>
                                </Col>
                              );
                            }
                          )
                        ) : (
                          <Row className='updatemeeting-minutesofmeetings-none'>
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className='d-flex justify-content-center align-items-center'>
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
                  <Row className='confirmationDialogue '>
                    <Col lg={12} md={12} sm={12}>
                      <p className='publishMessageModal'>
                        {t("Are-you-sure-you-want-to-update-meeting")}
                      </p>
                    </Col>
                  </Row>
                </>
              ) : isCancelMeetingModal ? (
                <>
                  <Row className='confirmationDialogue'>
                    <Col lg={12} md={12} sm={12}>
                      <p className='publishMessageModal'>
                        {t("Are-you-sure-you-want-to-cancel-meeting")}
                      </p>
                    </Col>
                  </Row>
                </>
              ) : closeConfirmationModal ? (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className='Confirmationmodal_body_text_meeting_update'>
                      {t("Are-you-sure-note-reset-closed")}
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
                      className='d-flex justify-content-end'>
                      <Button
                        onClick={navigateToAgenda}
                        className={
                          " btn btn-primary modal-update-meeting-details "
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
                      className='d-flex justify-content-between'>
                      <Button
                        disableBtn={endMeetingStatus}
                        onClick={addAnOtherAgenda}
                        className={
                          " modal-update-addagenda" + " " + currentLanguage
                        }
                        text={
                          editRecordFlag
                            ? t("Update-agenda")
                            : " + " + t("Add-agenda")
                        }
                      />
                      <Button
                        onClick={navigateToAttendees}
                        className={" btn btn-primary modal-update-meeting"}
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
                        className='d-flex justify-content-end'>
                        <Button
                          className={" btn btn-primary modal-update-meeting"}
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
                        className='d-flex justify-content-end'>
                        <Button
                          className={
                            " btn btn-primary update-modal-discard-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Discard-changes")}
                          onClick={discardMeeting}
                        />
                        <Button
                          disableBtn={endMeetingStatus}
                          className={
                            " btn btn-primary cancel-meeting-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Cancel-meeting")}
                          onClick={cancelMeetingConfirmation}
                        />
                        <Button
                          className={" btn btn-primary publish-meeting-btn"}
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
                        className='d-flex justify-content-end'>
                        <Button
                          className={" btn btn-primary ismeeting-finish-btn"}
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
                        className='d-flex justify-content-end align-items-center'>
                        <Button
                          className={
                            " btn btn-primary isminutes-discard-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Discard-changes")}
                          onClick={discardMeeting}
                        />
                        <Button
                          disableBtn={endMeetingStatus}
                          className={
                            " btn btn-primary isminutes-cancel-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("Cancel-meeting")}
                          onClick={cancelMeetingConfirmation}
                        />
                        <Button
                          className={
                            " btn btn-primary ismeeting-finish-btn" +
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
                  <Row className='updatemeeting-publishMeeting-btn '>
                    <Col lg={6} md={6} xs={12} className='text-end'>
                      <Button
                        className={"modalupdate_CancelBtn"}
                        text={t("Cancel")}
                        onClick={discardMeeting}
                      />
                    </Col>
                    <Col lg={6} md={6} xs={12} className='text-start'>
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
                    className='d-flex justify-content-center gap-3 mt-4'>
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
              ) : closeConfirmationModal ? (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className='d-flex justify-content-center gap-3'>
                      <Button
                        onClick={onHideCancelButton}
                        className={
                          "Confirmationmodal_cancel_btn_meeting_update_"
                        }
                        text={t("Cancel")}
                      />
                      <Button
                        onClick={handleCloseUpdateMeeting}
                        className={
                          "Confirmationmodal_close_btn_meeting_update_"
                        }
                        text={t("Close")}
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
    </>
  );
};

export default ModalUpdate;
