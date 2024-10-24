import React, { useState, useEffect } from "react";
import "./ModalMeeting.css";
import {
  convertDateTimeObject,
  createConvert,
  RemoveTimeDashes,
} from "../../commen/functions/date_formater";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import MeetingVideoChatIcon from "../../assets/images/newElements/Icon feather-video1.png";
import MeetingVideoChatIconActive from "../../assets/images/newElements/Icon feather-video.png";
import {
  TextField,
  Button,
  Modal,
  Checkbox,
  SelectBox,
  Accordian,
  EmployeeCard,
  Notification,
  AttachmentViewer,
} from "./../../components/elements";
import { useTranslation } from "react-i18next";
import { Row, Col, Container } from "react-bootstrap";
import CustomUpload from "../../components/elements/upload/Upload";
import { useSelector, useDispatch } from "react-redux";
import {
  ScheduleNewMeeting,
  GetAllReminders,
  allAssignessList,
} from "../../store/actions/Get_List_Of_Assignees";
import ErrorBar from "./../../container/authentication/sign_up/errorbar/ErrorBar";
import {
  FileUploadToDo,
  ResetAllFilesUpload,
  uploaddocumentloader,
} from "../../store/actions/Upload_action";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  getCurrentDate,
  getCurrentDateTime,
  getHoursMinutesSec,
  getStartTimeWithCeilFunction,
} from "../../commen/functions/time_formatter";
import { ConvertFileSizeInMB } from "../../commen/functions/convertFileSizeInMB";
import Select from "react-select";
import { Tooltip } from "antd";
import { showMessage } from "../../components/elements/snack_bar/utill";
import { maxFileSize } from "../../commen/functions/utils";
const ModalMeeting = ({ ModalTitle, setShow, show, checkFlag }) => {
  // checkFlag 6 is for Committee
  // checkFlag 7 is for Group
  // checkFlag 4 is for Meeting

  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignees, CommitteeReducer, GroupsReducer } = useSelector(
    (state) => state
  );
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);

  const [isPublishMeeting, setIsPublishMeeting] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // for modal fields error
  const [modalField, setModalField] = useState(false);

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

  const [objMeetingAgenda, setObjMeetingAgenda] = useState({
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
      PK_MARID: 2,
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

  const [defaultPresenter, setDefaultPresenter] = useState(null);

  const [attendeesParticipant, setAttendeesParticipant] = useState([]);
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("Participant");
  const [participantRoleID, setParticipantRoleID] = useState(2);

  // for   added participant  Name list
  const [addedParticipantNameList, setAddedParticipantNameList] = useState([]);

  const getStartTime = getStartTimeWithCeilFunction();
  //Attendees States
  const [taskAssignedToInput, setTaskAssignedToInput] = useState({
    value: 0,
    label: "",
    name: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [forUpdateAttachments, setForUpdateAttachent] = useState([]);
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [createMeetingTime, setCreateMeetingTime] = useState(
    getStartTime.newFormatTime
  );
  const getCurrentDateforMeeting = getCurrentDate();
  // for Participant options
  const participantOptions = [t("Organizer"), t("Participant")];
  const [meetingDate, setMeetingDate] = useState(
    getCurrentDateforMeeting.DateGMT
  );
  const [fileForSend, setFileForSend] = useState([]);
  const [fileSize, setFileSize] = useState(0);

  //Reminder Stats
  const [reminderValue, setReminderValue] = useState(t("1-hour-before"));
  const [reminder, setReminder] = useState("");
  let OrganizationId = localStorage.getItem("organizationID");

  const [allPresenters, setAllPresenters] = useState([]);
  console.log(allPresenters, "allPresentersallPresenters");
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });

  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
    MeetingTitle: "",
    MeetingDescription: "",
    MeetingTypeID: 0,
    MeetingDate: getCurrentDateforMeeting.dateFormat,
    OrganizationId: parseInt(OrganizationId),
    MeetingStartTime: getStartTime.formattedTime,
    MeetingEndTime: getStartTime.formattedTime,
    MeetingLocation: "",
    IsVideoCall: false,
    IsChat: false,
    MeetingReminderID: [4],
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
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  function urlPatternValidation(URL) {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  }

  const changeSelectDetails = () => {
    setCurrentStep(1);
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
      createMeeting.MeetingDate !== ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(true);
      setCurrentStep(2);
      setIsAttendees(false);
      setIsPublishMeeting(false);
    } else {
      setModalField(true);
      setIsDetails(true);
      setCurrentStep(1);
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
      createMeeting.MeetingAgendas.length > 0
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(true);
      setCurrentStep(3);

      setIsPublishMeeting(false);
    } else if (
      createMeeting.MeetingStartTime === "" ||
      createMeeting.MeetingEndTime === "" ||
      createMeeting.MeetingDate === ""
    ) {
      setModalField(true);
      setIsDetails(true);
      setCurrentStep(1);

      setIsAgenda(false);
      setIsAttendees(false);
      setIsPublishMeeting(true);
    } else if (createMeeting.MeetingAgendas.length > 0) {
      setModalField(false);
      setIsDetails(false);
      setIsAgenda(false);
      setIsAttendees(true);
      setCurrentStep(3);

      setIsPublishMeeting(false);
    } else if (createMeeting.MeetingAgendas.length === 0) {
      // If Title is empty, create a numbered title and append the object
      const newObjMeetingAgenda = {
        ...objMeetingAgenda,
        Title: t("No-agenda-available"),
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
      setModalField(true);
      setIsAgenda(false);
      setCurrentStep(3);

      setIsAttendees(true);
      setIsDetails(false);
      setIsPublishMeeting(false);
    } else {
    }
  };

  const navigateToAgenda = async () => {
    setModalField(false);
    if (
      createMeeting.MeetingStartTime !== "" &&
      createMeeting.MeetingEndTime !== "" &&
      createMeeting.MeetingDate !== ""
    ) {
      setModalField(false);
      setIsDetails(false);
      setIsAttendees(false);
      setIsAgenda(true);
      setCurrentStep(2);

      setIsPublishMeeting(false);
    } else {
      setModalField(true);
      setIsDetails(true);
      setCurrentStep(1);

      setIsAttendees(false);
      setIsAgenda(false);
      setIsPublishMeeting(false);
    }
  };

  // Reminder handler
  const ReminderNameHandler = (e, value) => {
    setReminderValue(value);
    let valueOfReminder = assignees.RemindersData;
    valueOfReminder.forEach((data) => {
      if (value === data.description) {
        let id = data.pK_MRID;
        setCreateMeeting({
          ...createMeeting,
          MeetingReminderID: [parseInt(id)],
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
      setCurrentStep(3);
    } else {
      // If Title is empty, create a numbered title and append the object
      const newObjMeetingAgenda = {
        ...objMeetingAgenda,
        Title: t("No-agenda-available"),
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
      setIsAgenda(false);
      setCurrentStep(3);
      setIsAttendees(true);
      setIsPublishMeeting(false);
    }
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
      IsChat: e.target.checked,
    });
  }

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
          showMessage(
            t("Time-should-be-greater-then-system-time"),
            "error",
            setOpen
          );
          setTimeout(() => {
            setCreateMeeting({
              ...createMeeting,
              MeetingStartTime: getStartTime.formattedTime,
              MeetingEndTime: getStartTime.formattedTime,
            });
            setCreateMeetingTime(getStartTime.newFormatTime);
          }, 1000);
        } else {
          setCreateMeeting({
            ...createMeeting,
            MeetingStartTime: getFormattedTime,
            MeetingEndTime: getFormattedTime,
          });
          setCreateMeetingTime(newTime);
        }
      }
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
    }
  };

  // for all details handler
  const detailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    if (name === "MeetingStartTime") {
      setCreateMeeting({
        ...createMeeting,
        [name]: RemoveTimeDashes(value),
        MeetingEndTime: RemoveTimeDashes(value),
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

  const meetingDateHandler = (date) => {
    if (createMeeting.MeetingStartTime !== "") {
      let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");

      let meetingDateSaveFormat = new DateObject(date).format("YYYYMMDD");

      const getformattedDateTIme = getCurrentDateTime(new Date());

      const dateTimeFormat = convertDateTimeObject(
        `${meetingDateSaveFormat}${createMeeting.MeetingStartTime}`
      );
      const currentDateTime = convertDateTimeObject(getformattedDateTIme);
      if (dateTimeFormat < currentDateTime) {
        showMessage(
          t("Date-and-time-should-be-greater-than-current-system-time"),
          "error",
          setOpen
        );
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
    let filesArray = Object.values(data.target.files);
    let fileSizeArr = fileSize;

    // Start with the existing files in fileForSend
    let updatedFilesForSend = [...fileForSend];

    let size = true;
    let sizezero = true;

    if (updatedFilesForSend.length + filesArray.length > 10) {
      showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
      return;
    }

    filesArray.forEach((uploadedFile) => {
      let fileSizeinMB = ConvertFileSizeInMB(uploadedFile.size);
      let mergeFileSizes = ConvertFileSizeInMB(fileSizeArr);

      if (mergeFileSizes + fileSizeinMB > maxFileSize) {
        showMessage(
          t("File-size-should-not-be-greater-then-1-5GB"),
          "error",
          setOpen
        );
        return;
      }

      let ext = uploadedFile.name.split(".").pop().toLowerCase();

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
        let fileExists = attachments.some(
          (filename) => filename.DisplayAttachmentName === uploadedFile.name
        );

        if (fileSizeinMB > 10) {
          size = false;
        } else if (fileSizeinMB === 0) {
          sizezero = false;
        }

        if (fileExists) {
          showMessage(t("This-file-already-exist"), "error", setOpen);
        } else if (!size) {
          showMessage(
            t("You-can-not-upload-more-then-10MB-file"),
            "error",
            setOpen
          );
        } else if (!sizezero) {
          showMessage(t("File-size-is-0mb"), "error", setOpen);
        } else {
          let fileData = {
            PK_MAAID: 0,
            DisplayAttachmentName: uploadedFile.name,
            OriginalAttachmentName: uploadedFile.name,
            CreationDateTime: "111111",
            FK_MAID: 0,
          };
          setAttachments((prev) => [...prev, fileData]);
          fileSizeArr += uploadedFile.size;
          updatedFilesForSend.push(uploadedFile); // Append new file to the existing ones
        }
      }
    });

    // Update the states with the accumulated values
    setFileForSend(updatedFilesForSend);
    setFileSize(fileSizeArr);
  };

  const editGrid = (datarecord, dataindex) => {
    let Data;
    meetingAttendeesList.forEach((user, index) => {
      const { PresenterName } = datarecord.ObjMeetingAgenda;
      if (user.name === PresenterName) {
        Data = {
          label: (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex gap-2 align-items-center"
                >
                  <img
                    src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                    height="16.45px"
                    width="18.32px"
                    draggable="false"
                    alt=""
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
    });

    setPresenterValue(Data);

    seteditRecordIndex(dataindex);
    seteditRecordFlag(true);
    setObjMeetingAgenda(datarecord.ObjMeetingAgenda);
    let filesData = [];
    if (datarecord.MeetingAgendaAttachments.length > 0) {
      datarecord.MeetingAgendaAttachments.forEach((uploadedFile) => {
        filesData.push({
          PK_MAAID: 0,
          DisplayAttachmentName: uploadedFile.DisplayAttachmentName,
          OriginalAttachmentName: uploadedFile.OriginalAttachmentName,
          CreationDateTime: "111111",
          FK_MAID: 0,
        });
      });
    }
    setAttachments(filesData);
    setForUpdateAttachent(filesData);
  };

  const deleteGrid = (datarecord, dataindex) => {
    let splicedArray = createMeeting.MeetingAgendas.indexOf(datarecord);
    createMeeting.MeetingAgendas.splice(splicedArray, 1);
    setCreateMeeting({
      ...createMeeting,
    });
  };

  // for add another agenda main inputs handler
  const addAnOtherAgenda = async (e) => {
    e.preventDefault();
    let previousAdendas = createMeeting.MeetingAgendas;
    if (editRecordFlag !== null && editRecordFlag === true) {
      if (objMeetingAgenda.Title !== "") {
        if (objMeetingAgenda.URLs !== "") {
          if (urlPatternValidation(objMeetingAgenda.URLs)) {
            if (fileForSend.length > 0) {
              setModalField(false);
              let fileforSend = [...forUpdateAttachments];
              console.log(fileForSend, "fileForSendfileForSend");
              let newfile = [];
              const uploadPromises = fileForSend.map((newData) => {
                // Return the promise from FileUploadToDo
                return dispatch(
                  FileUploadToDo(navigate, newData, t, newfile, 3)
                );
              });
              // Wait for all uploadPromises to resolve
              await Promise.all(uploadPromises);
              newfile.forEach((fileData, index) => {
                fileforSend.push({
                  PK_MAAID: 0,
                  DisplayAttachmentName: fileData.DisplayAttachmentName,
                  OriginalAttachmentName: fileData.OriginalAttachmentName,
                  CreationDateTime: "111111",
                  FK_MAID: 0,
                });
              });
              let newData = {
                ObjMeetingAgenda: objMeetingAgenda,
                MeetingAgendaAttachments: fileforSend,
              };
              previousAdendas[editRecordIndex] = newData;
              setCreateMeeting({
                ...createMeeting,
                MeetingAgendas: previousAdendas,
              });
              seteditRecordIndex(null);
              seteditRecordFlag(false);

              setMeetingAgendaAttachments({
                MeetingAgendaAttachments: [],
              });
              setPresenterValue(defaultPresenter);
              setObjMeetingAgenda(defaultMeetingAgenda);
              setFileForSend([]);
              setAttachments([]);
              dispatch(uploaddocumentloader(false));
            } else {
              let newData = {
                ObjMeetingAgenda: objMeetingAgenda,
                MeetingAgendaAttachments:
                  meetingAgendaAttachments.MeetingAgendaAttachments,
              };
              previousAdendas[editRecordIndex] = newData;
              setCreateMeeting({
                ...createMeeting,
                MeetingAgendas: previousAdendas,
              });
              seteditRecordIndex(null);
              seteditRecordFlag(false);
              setObjMeetingAgenda(defaultMeetingAgenda);

              setPresenterValue(defaultPresenter);

              setMeetingAgendaAttachments({
                MeetingAgendaAttachments: [],
              });
            }
          } else {
            setModalField(false);
            showMessage(t("Enter-valid-url"), "error", setOpen);
          }
        } else {
          if (fileForSend.length > 0) {
            setModalField(false);
            let fileforSend = [...forUpdateAttachments];
            let newfile = [];
            const uploadPromises = fileForSend.map((newData) => {
              // Return the promise from FileUploadToDo
              return dispatch(FileUploadToDo(navigate, newData, t, newfile, 3));
            });
            // Wait for all uploadPromises to resolve
            await Promise.all(uploadPromises);

            newfile.forEach((fileData, index) => {
              fileforSend.push({
                PK_MAAID: 0,
                DisplayAttachmentName: fileData.DisplayAttachmentName,
                OriginalAttachmentName: fileData.OriginalAttachmentName,
                CreationDateTime: "111111",
                FK_MAID: 0,
              });
            });
            let newData = {
              ObjMeetingAgenda: objMeetingAgenda,
              MeetingAgendaAttachments: fileforSend,
            };
            previousAdendas[editRecordIndex] = newData;
            setCreateMeeting({
              ...createMeeting,
              MeetingAgendas: previousAdendas,
            });
            seteditRecordIndex(null);
            seteditRecordFlag(false);
            setObjMeetingAgenda(defaultMeetingAgenda);

            setPresenterValue(defaultPresenter);

            setMeetingAgendaAttachments({
              MeetingAgendaAttachments: [],
            });
            setAttachments([]);
            setFileForSend([]);
            setForUpdateAttachent([]);
            dispatch(uploaddocumentloader(false));
          } else {
            let newData = {
              ObjMeetingAgenda: objMeetingAgenda,
              MeetingAgendaAttachments:
                meetingAgendaAttachments.MeetingAgendaAttachments,
            };
            previousAdendas[editRecordIndex] = newData;
            setCreateMeeting({
              ...createMeeting,
              MeetingAgendas: previousAdendas,
            });
            seteditRecordIndex(null);
            seteditRecordFlag(false);
            setObjMeetingAgenda(defaultMeetingAgenda);

            setPresenterValue(defaultPresenter);

            setMeetingAgendaAttachments({
              MeetingAgendaAttachments: [],
            });
          }
        }
      } else {
        setModalField(true);
      }
      setModalField(false);
    } else {
      if (objMeetingAgenda.Title) {
        if (fileForSend.length > 0) {
          setModalField(false);
          setObjMeetingAgenda(defaultMeetingAgenda);

          setFileForSend([]);
          setMeetingAgendaAttachments({
            ...meetingAgendaAttachments,
            MeetingAgendaAttachments: [],
          });
          setAttachments([]);
          let fileforSend = [];
          let newfile = [];

          const uploadPromises = fileForSend.map((newData) => {
            // Return the promise from FileUploadToDo
            return dispatch(FileUploadToDo(navigate, newData, t, newfile, 3));
          });
          // Wait for all uploadPromises to resolve
          await Promise.all(uploadPromises);
          newfile.forEach((fileData, index) => {
            fileforSend.push({
              PK_MAAID: 0,
              DisplayAttachmentName: fileData.DisplayAttachmentName,
              OriginalAttachmentName: fileData.OriginalAttachmentName,
              CreationDateTime: "111111",
              FK_MAID: 0,
            });
          });
          let previousAdendas = [...createMeeting.MeetingAgendas];
          let newData = {
            ObjMeetingAgenda: objMeetingAgenda,
            MeetingAgendaAttachments: fileforSend,
          };
          previousAdendas.push(newData);
          setCreateMeeting({
            ...createMeeting,
            MeetingAgendas: previousAdendas,
          });
          dispatch(uploaddocumentloader(false));
        } else {
          setModalField(false);
          let previousAdendas = [...createMeeting.MeetingAgendas];
          let newData = {
            ObjMeetingAgenda: objMeetingAgenda,
            MeetingAgendaAttachments: [],
          };
          previousAdendas.push(newData);
          setCreateMeeting({
            ...createMeeting,
            MeetingAgendas: previousAdendas,
          });
          setObjMeetingAgenda(defaultMeetingAgenda);

          setPresenterValue(defaultPresenter);

          setMeetingAgendaAttachments({
            ...meetingAgendaAttachments,
            MeetingAgendaAttachments: [],
          });
          setAttachments([]);
        }
        // }
      } else {
        if (createMeeting.MeetingAgendas) {
          // Get the current count of agendas (starting from 1)
          const agendaCount = createMeeting.MeetingAgendas.length + 1;

          // Modify the existing object to conditionally set the title
          let previousAdendas = [...createMeeting.MeetingAgendas].map(
            (agenda, index) => {
              if (agenda.ObjMeetingAgenda.Title === "No Agenda Available") {
                return {
                  ...agenda,
                  ObjMeetingAgenda: {
                    ...agenda.ObjMeetingAgenda,
                    Title: `Agenda ${index + 1}`,
                  },
                };
              }
              return agenda;
            }
          );

          const newObjMeetingAgenda = {
            ...objMeetingAgenda,
            Title: `Agenda ${agendaCount}`,
          };

          let newData = {
            ObjMeetingAgenda: newObjMeetingAgenda,
            MeetingAgendaAttachments: [],
          };

          previousAdendas.push(newData);

          setCreateMeeting({
            ...createMeeting,
            MeetingAgendas: previousAdendas,
          });

          setModalField(true);
        }
      }
    }
  };

  const videoEnableButton = () => {
    setCreateMeeting({
      ...createMeeting,
      IsVideoCall: !createMeeting.IsVideoCall,
    });
  };

  useEffect(() => {
    try {
      let valueOfReminder = assignees.RemindersData;
      setReminder(
        valueOfReminder.map((data, index) => {
          return data.description;
        })
      );
      valueOfReminder.forEach((data, index) => {
        if (createMeeting.MeetingReminderID === data.pK_MRID) {
          setReminderValue(data.description);
          setCreateMeeting({
            ...createMeeting,
            MeetingReminderID: [parseInt(data.pK_MRID)],
          });
        }
      });
    } catch (error) {}
  }, [assignees.RemindersData]);

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
    let user = participantOptionsWithIDs;
    if (user !== undefined) {
      if (participantOptionsWithIDs.length > 0) {
        participantOptionsWithIDs.forEach((data, index) => {
          if (data.label === value) {
            // setParticipantRoleID(data.id);
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
  const callApi = async () => {
    if (checkFlag !== 6 && checkFlag !== 7) {
      await dispatch(allAssignessList(navigate, t, true));
    }
    dispatch(GetAllReminders(navigate, t));
  };
  useEffect(() => {
    callApi();
    return () => {
      setModalField(false);
      setShow(false);
      setIsDetails(true);
      setCurrentStep(1);

      setIsAgenda(false);
      setIsAttendees(false);
      setIsPublishMeeting(false);
      setObjMeetingAgenda(defaultMeetingAgenda);
      setMeetingAgendaAttachments({
        MeetingAgendaAttachments: [],
      });
      setParticipantRoleName("Participant");
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
          PK_MARID: 2,
        },
        AttendeeAvailability: {
          PK_AAID: 1,
        },
      });
      setAddedParticipantNameList([]);
      setReminder("");
      setReminderValue("");
      setMeetingDate("");
      setCreateMeetingTime("");
      dispatch(ResetAllFilesUpload());
    };
  }, []);

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees?.user).length > 0) {
        try {
          let usersList = assignees?.user;
          setMeetingAttendeesList(usersList);
          let PresenterData = [];
          let newMemberData = [];
          let userData;

          usersList.forEach((user, index) => {
            console.log(user, "useruser");

            PresenterData.push({
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                        alt=""
                      />
                      <span>{user.name}</span>
                    </Col>
                  </Row>
                </>
              ),
              value: user?.pK_UID,
              name: user?.name,
            });

            if (Number(user.pK_UID) === Number(createrID)) {
              setDefaultPresenter({
                label: (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-2 align-items-center"
                      >
                        <img
                          src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                          height="16.45px"
                          width="18.32px"
                          draggable="false"
                          alt=""
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
                        className="d-flex gap-2 align-items-center"
                      >
                        <img
                          src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                          height="16.45px"
                          width="18.32px"
                          draggable="false"
                          alt=""
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
              newMemberData.push({
                name: user.name,
                designation: user.designation,
                profilePicture: user.orignalProfilePictureName,
                organization: user.organization,
                role: 3,
                displayProfilePic: user.displayProfilePictureName,
              });
              userData = {
                User: {
                  PK_UID: parseInt(createrID),
                },
                MeetingAttendeeRole: {
                  PK_MARID: 3,
                },
                AttendeeAvailability: {
                  PK_AAID: 1,
                },
              };
            }
          });
          setCreateMeeting({
            ...createMeeting,
            MeetingAttendees: [userData],
          });
          if (checkFlag !== 6 && checkFlag !== 7) {
            setAttendeesParticipant(PresenterData);
          }
          setAddedParticipantNameList(newMemberData);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [assignees.user, checkFlag]);
  console.log(assignees, "assigneesassigneesassignees");

  const handleChangeAttenddes = (attendeeData) => {
    setTaskAssignedToInput({
      ...taskAssignedToInput,
      label: attendeeData.label,
      value: attendeeData.value,
      name: attendeeData.name,
    });
    setTaskAssignedTo(attendeeData.value);
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
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={`data:image/jpeg;base64,${committeesMember?.userProfilePicture.displayProfilePictureName}`}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                        alt=""
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
          setAttendeesParticipant(membersData);
        }
      } else if (Number(checkFlag) === 7) {
        // Group Members
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
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={`data:image/jpeg;base64,${groupMemberData?.userProfilePicture.displayProfilePictureName}`}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                        alt=""
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
          setAttendeesParticipant(membersData);
        }
        // Group MembersData
      }
    } catch {}
  }, [checkFlag]);

  // for add Attendees handler
  const addAttendees = () => {
    console.log("I am clicked");
    let user1 = createMeeting.MeetingAttendees;
    let List = addedParticipantNameList;
    let found = user1.find((element) => element.User.PK_UID === taskAssignedTo);

    if (taskAssignedTo !== 0) {
      if (found !== undefined) {
        showMessage(t("User-already-exists"), "error", setOpen);
        setTaskAssignedTo(0);
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
        setParticipantRoleID(2);
        setTaskAssignedToInput({
          name: "",
          value: 0,
          lable: "",
        });
      } else {
        user1.push({
          User: {
            PK_UID: taskAssignedTo,
          },
          MeetingAttendeeRole: {
            PK_MARID: participantRoleID,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        });
        if (meetingAttendeesList.length > 0) {
          meetingAttendeesList.forEach((data, index) => {
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

        setCreateMeeting({ ...createMeeting, MeetingAttendees: user1 });
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
        setParticipantRoleName("Participant");
        setTaskAssignedToInput({
          name: "",
          value: 0,
          lable: "",
        });
      }
    } else {
      if (found === undefined) {
        showMessage(t("Please-add-valid-user"), "error", setOpen);
        setTaskAssignedTo(0);
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
        setTaskAssignedToInput({
          name: "",
          value: 0,
          lable: "",
        });
      }
    }
  };

  // for attendies handler
  const handleSubmit = async () => {
    if (createMeeting.IsVideoCall && addedParticipantNameList.length <= 1) {
      showMessage(t("Please-add-atleast-one-participant"), "error", setOpen);
      return;
    }
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
      MeetingTitle:
        createMeeting.MeetingTitle !== ""
          ? createMeeting.MeetingTitle
          : `Quick Meeting @ ${ifemptyDate} ${ifemptyTime}`,
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
    setShow(false);
    setIsDetails(true);
    setCurrentStep(1);

    setIsAgenda(false);
    setIsAttendees(false);
    setIsPublishMeeting(false);
    dispatch(ScheduleNewMeeting(navigate, t, checkFlag, newData));
    setObjMeetingAgenda(defaultMeetingAgenda);

    setPresenterValue(defaultPresenter);

    setMeetingAgendaAttachments({
      MeetingAgendaAttachments: [],
    });
    setParticipantRoleName("Participant");
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
        PK_MARID: 2,
      },
      AttendeeAvailability: {
        PK_AAID: 1,
      },
    });
    setAddedParticipantNameList([]);
    setCreateMeetingTime("");
    setModalField(false);
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
  };

  const deleteFilefromAttachments = (data, index) => {
    setFileForSend((prevFileForSend) =>
      prevFileForSend.filter(
        (newData, index) => newData.name !== data.DisplayAttachmentName
      )
    );
    let searchIndex = meetingAgendaAttachments.MeetingAgendaAttachments;
    let newAttachments = attachments.filter(
      (fileData, index) =>
        fileData.DisplayAttachmentName !== data.DisplayAttachmentName
    );
    setAttachments(newAttachments);
    searchIndex.splice(index, 1);
    setMeetingAgendaAttachments({
      ...meetingAgendaAttachments,
      MeetingAgendaAttachments: searchIndex,
    });
  };

  const handleDeleteAttendee = (data, index) => {
    let user1 = createMeeting.MeetingAttendees;
    user1.splice(index, 1);
    addedParticipantNameList.splice(index, 1);
    setAddedParticipantNameList(addedParticipantNameList);
    setCreateMeeting({ ...createMeeting, MeetingAttendees: user1 });
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

  const onHideHandleModal = () => {
    setCloseConfirmationModal(true);
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsPublishMeeting(false);
  };
  const onHideCancelButton = () => {
    if (currentStep === 1) {
      setIsDetails(true);

      setIsAgenda(false);
      setIsAttendees(false);
      setCloseConfirmationModal(false);
    } else if (currentStep === 2) {
      setIsDetails(false);
      setIsAgenda(true);
      setCloseConfirmationModal(false);

      setIsAttendees(false);
    } else if (currentStep === 3) {
      setIsDetails(false);
      setCloseConfirmationModal(false);

      setIsAgenda(false);
      setIsAttendees(true);
      setCurrentStep(3);
    }
  };

  const handleCloseUpdateMeeting = () => {
    setShow(false);
  };
  const handleChangePresenter = (value) => {
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
  return (
    <>
      <Container>
        <Modal
          show={show}
          onHide={onHideHandleModal}
          setShow={setShow}
          className={
            closeConfirmationModal === true
              ? null
              : "modaldialog createModalMeeting"
          }
          ButtonTitle={ModalTitle}
          modalBodyClassName={
            closeConfirmationModal === true
              ? "modalMeetingCreateBody_close_modal"
              : "modalMeetingCreateBody"
          }
          modalFooterClassName={
            closeConfirmationModal === true
              ? "d-block"
              : "modalMeetingCreateFooter"
          }
          modalHeaderClassName={"modalMeetingCreateHeader"}
          centered
          size={closeConfirmationModal === true ? null : "md"}
          ModalBody={
            <>
              {closeConfirmationModal === true ? null : (
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="d-flex gap-2">
                    <Button
                      className={
                        isDetails
                          ? "isDetail-Schedule-top-btn_active"
                          : "isDetail-Schedule-top-btn-NonActive"
                      }
                      text={t("Details")}
                      onClick={changeSelectDetails}
                    />
                    <Button
                      className={
                        isAgenda
                          ? "isAgenda-Schedule-top-btn_active"
                          : "isAgenda-Schedule-top-btn-NonActive"
                      }
                      text={t("Agenda")}
                      onClick={changeSelectAgenda}
                      datatut="show-agenda"
                    />
                    <Button
                      className={
                        isAttendees
                          ? "isAttendee-Schedule-top-btn_active"
                          : "isAttendee-Schedule-top-btn-NonActive"
                      }
                      text={t("Attendees")}
                      datatut="show-meeting-attendees"
                      onClick={changeSelectAttendees}
                    />
                  </Col>
                </Row>
              )}

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
                        selected={createMeetingTime}
                        render={<CustomInput />}
                        plugins={[<TimePicker hideSeconds />]}
                        editable={false}
                        onChange={handleTimeChange}
                      />

                      <div className="height-10">
                        {modalField === true &&
                        createMeeting.MeetingStartTime === null ? (
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
                          minDate={new Date()}
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
                          onFocusedDateChange={meetingDateHandler}
                        />
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
                      <div className="height-10"></div>
                    </Col>
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
                            <Tooltip
                              placement="bottomLeft"
                              title={t("Enable-video-call")}
                            >
                              <img src={MeetingVideoChatIcon} alt="" />
                            </Tooltip>
                          ) : (
                            <Tooltip
                              placement="bottomLeft"
                              title={t("Disable-video-call")}
                            >
                              <img src={MeetingVideoChatIconActive} alt="" />
                            </Tooltip>
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
                        placeholder={t("Location-Videourl")}
                        value={createMeeting.MeetingLocation}
                        required={true}
                        maxLength={245}
                      />
                    </Col>
                    <Col
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      className="UpdateCheckbox mt-2 "
                    >
                      <Checkbox
                        className="SearchCheckbox "
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
                        placeholder={t("Meeting-title")}
                        required={true}
                        maxLength={245}
                      />
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
                    </Col>
                  </Row>
                </>
              ) : isAgenda ? (
                <>
                  <div className="agenda_container">
                    <Form onSubmit={addAnOtherAgenda}>
                      <Row>
                        <Col
                          lg={7}
                          md={7}
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
                        </Col>
                        <Col
                          lg={5}
                          md={5}
                          xs={12}
                          className="agenda-title-field"
                        >
                          <Select
                            options={allPresenters}
                            maxMenuHeight={140}
                            classNamePrefix={"ModalOrganizerSelect"}
                            onChange={handleChangePresenter}
                            value={
                              presenterValue?.value === 0
                                ? null
                                : presenterValue
                            }
                            placeholder="Select Presenter"
                            filterOption={filterFunc}
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
                              multiple={true}
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
                        className={`modal-update-addagenda ${currentLanguage}`}
                        text={
                          editRecordFlag
                            ? t("Update-agenda")
                            : "+ " + t("Add-agenda")
                        }
                      />
                    </Form>
                    <Row>
                      {attachments.length > 0
                        ? attachments.map((data, index) => {
                            return (
                              <Col sm={4} md={4} lg={4}>
                                <AttachmentViewer
                                  data={data}
                                  handleClickRemove={() =>
                                    deleteFilefromAttachments(data, index)
                                  }
                                  fk_UID={Number(createrID)}
                                  id={0}
                                  name={data.DisplayAttachmentName}
                                />
                              </Col>
                            );
                          })
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
                                className={`Setting ${currentLanguage}`}
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
                                              return (
                                                <Col sm={4} lg={4} md={4}>
                                                  <AttachmentViewer
                                                    data={
                                                      MeetingAgendaAttachmentsData
                                                    }
                                                    id={0}
                                                    name={
                                                      MeetingAgendaAttachmentsData.DisplayAttachmentName
                                                    }
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
                        "attendee-title-field    addattendee-textfield-width"
                      }
                    >
                      <Select
                        options={attendeesParticipant}
                        classNamePrefix={"ModalOrganizerSelect"}
                        filterOption={filterFunc}
                        placeholder="Please Select"
                        onChange={handleChangeAttenddes}
                        isSearchable={true}
                        value={
                          taskAssignedToInput.value === 0
                            ? null
                            : taskAssignedToInput
                        }
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
                        disableBtn={!taskAssignedTo}
                      />
                    </Col>
                  </Row>
                  <section className="participant-scroll-creatingmeeting">
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="participant-heading-creatingmeeting"
                      >
                        <label className="">{t("Organizer")}</label>
                      </Col>
                      <Col lg={12} md={12} sm={12} xs={12}>
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
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="participant-heading-creatingmeeting"
                      >
                        <label className="">{t("Participants")}</label>
                      </Col>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        {addedParticipantNameList ? (
                          <>
                            <span>
                              {addedParticipantNameList.map((atList, index) => {
                                console.log(atList, "atListatList");
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
                  </section>
                </>
              ) : closeConfirmationModal ? (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="Confirmationmodal_body_text_meeting_update"
                    >
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
                      className="d-flex justify-content-end"
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
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-between"
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
                      sm={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        className={
                          "btn btn-primary modal-createMeeting-publish"
                        }
                        text={t("Publish")}
                        onClick={handleSubmit}
                        type="submit"
                      />
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
                      className="d-flex justify-content-center gap-3"
                    >
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default ModalMeeting;
