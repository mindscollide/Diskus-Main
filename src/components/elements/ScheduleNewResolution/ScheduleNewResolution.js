import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Paper } from "@material-ui/core";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
// import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import styles from "./ScheduleNewResolution.module.css";
import Leftploygon from "../../../assets/images/Polygon 3.svg";
import Rightploygon from "../../../assets/images/Polygon right.svg";
import FileIcon, { defaultStyles } from "react-file-icon";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";
import { FileUploadToDo } from "../../../store/actions/Upload_action";
import { useDispatch, useSelector } from "react-redux";
import featherupload from "../../../assets/images/featherupload.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { Upload } from "antd";
import {
  TextField,
  Button,
  Checkbox,
  InputSearchFilter,
  Notification,
  AttachmentViewer,
} from "./../../../components/elements";
import { useState } from "react";
import ModalresolutionRemove from "../../../container/ModalresolutionRemove/ModalresolutionRemove";
import ModalCancellResolution from "../../../container/ModalCancellResolution/ModalCancellResolution";
import ModalUpdateresolution from "../../../container/ModalUpdateResolution/ModalUpdateresolution";
import ModalDiscardResolution from "../../../container/ModalDiscardResolution/ModalDiscardResolution";
import EmployeeinfoCard from "../Employeeinfocard/EmployeeinfoCard";
import {
  getAllVotingMethods,
  getAllResolutionStatus,
  createResolution,
  clearResponseMessage,
  createResolutionModal,
  uploadDocumentsResolutionApi,
  saveFilesResolutionApi,
  updateResolution,
} from "../../../store/actions/Resolution_actions";
import {
  createConvert,
  removeDashesFromDate,
  RemoveTimeDashes,
} from "../../../commen/functions/date_formater";
import moment from "moment";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import TextFieldTime from "../input_field_time/Input_field";
import { validateInput } from "../../../commen/functions/regex";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  dateTimeforResolution,
  dateforSend,
  dateforView,
  timeforSend,
  timeforView,
  timeforViewScheduleResolution,
} from "../../../commen/functions/time_formatter";

const ScheduleNewResolution = () => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { ResolutionReducer, assignees } = useSelector((state) => state);
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [isVoter, setVoter] = useState(true);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [votingMethods, setVotingMethods] = useState([]);
  const [decision, setDecision] = useState({
    label: t("Decision-pending"),
    value: 1,
  });
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [sendStatus, setsendStatus] = useState(0);
  const [folderID, setFolderID] = useState(0);
  const [error, setError] = useState(false);
  const [voters, setVoters] = useState([]);
  const [nonVoter, setNonVoters] = useState([]);
  const [votersForView, setVotersForView] = useState([]);
  const [nonVoterForView, setNonVotersForView] = useState([]);
  const [VoterName, setVoterName] = useState("");
  const [VoterID, setVoterID] = useState(0);
  const [isVoterModalRemove, setVoterModalRemove] = useState(false);
  const [isNonVoterModalRemove, setNonVoterModalRemove] = useState(false);
  const [reminderData, setReminderData] = useState([
    {
      label: "10 minutes before",
      value: 1,
    },
    {
      label: "30 minutes before",
      value: 2,
    },
    {
      label: "1 hour before",
      value: 3,
    },
    {
      label: "5 hours before",
      value: 4,
    },
    {
      label: "1 day before",
      value: 5,
    },
    {
      label: "7 days before",
      value: 6,
    },
  ]);
  const [circulationDateTime, setCirculationDateTime] = useState({
    date: dateforSend(new Date(), 1),
    time: timeforSend(new Date()),
    dateValue: dateforView(new Date(), 1),
    timeCirculationforView: timeforViewScheduleResolution(new Date()),
  });
  const [votingDateTime, setVotingDateTime] = useState({
    date: dateforSend(new Date(), 2),
    time: timeforSend(new Date()),
    dateValue: dateforView(new Date(), 2),
    timeVotingforView: timeforViewScheduleResolution(new Date()),
  });
  const [decisionDateTime, setDecisionDateTime] = useState({
    date: dateforSend(new Date(), 3),
    time: timeforSend(new Date()),
    dateValue: dateforView(new Date(), 3),
    timeDecisionforView: timeforViewScheduleResolution(new Date()),
  });
  console.log(
    { decisionDateTime, votingDateTime, circulationDateTime },
    "circulationDateTimecirculationDateTime"
  );
  //
  // const datetimevalues = dateTimeforResolution(new Date(), 1);
  //
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [emailValue, setEmailValue] = useState("");
  const [isNonVoter, setNonVoter] = useState(false);
  const [resolutioncancel, setResolutioncancel] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [showmodal, setShowmodal] = useState(false);
  const [resolutionupdate, setResolutionupdate] = useState(false);
  const [discardresolution, setDsicardresolution] = useState(false);
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [onclickFlag, setOnclickFlag] = useState(false);
  const [createResolutionData, setCreateResolutionData] = useState({
    FK_ResolutionStatusID: 0,
    FK_ResolutionVotingMethodID: 0,
    Title: "",
    Description: "",
    NotesToVoter: "",
    CirculationDateTime: "",
    DeadlineDateTime: "",
    FK_ResolutionReminderFrequency_ID: 0,
    FK_ResolutionDecision_ID: decision.value,
    DecisionAnnouncementDateTime: "",
    IsResolutionPublic: false,
  });
  const currentDate = new Date();

  useEffect(() => {
    if (currentLanguage !== null && currentLanguage !== undefined) {
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
    // setMinDate(moment(min_date).format("YYYY-MM-DD"));
    dispatch(getAllVotingMethods(navigate, t));
    dispatch(getAllResolutionStatus(navigate, t));
    dispatch(allAssignessList(navigate, t));
    return;
  }, []);

  const dateformatYYYYMMDD = (date) => {
    if (!!date && typeof date === "string") {
      return moment(date).add(1, "days").toDate();
    }
  };

  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };
  const ShowVoter = () => {
    setVoter(true);
    setNonVoter(false);
    setTaskAssignedToInput("");
    setTaskAssignedTo(0);
    setEmailValue("");
  };
  const ShowNonVoters = () => {
    setVoter(false);
    setNonVoter(true);
    setTaskAssignedToInput("");
    setTaskAssignedTo(0);
    setEmailValue("");
  };

  const removeUserForVoter = (id, name) => {
    setVoterModalRemove(true);
    setVoterID(id);
    setVoterName(name);
  };

  const removeUserForNonVoter = (id, name) => {
    setNonVoterModalRemove(true);
    setVoterID(id);
    setVoterName(name);
  };

  const RemoveVoterInfo = () => {
    let findIndexVoter = votersForView.findIndex(
      (data, index) => data.pK_UID === VoterID
    );
    let findIndexFromSendData = voters.findIndex(
      (data, index) => data.FK_UID === VoterID
    );
    if (findIndexVoter !== -1) {
      votersForView.splice(findIndexVoter, 1);
      voters.splice(findIndexFromSendData, 1);
      setVotersForView([...votersForView]);
      setVoters([...voters]);
    }
    setVoterID(0);
    setVoterName("");
    setVoterModalRemove(false);
  };

  const removeNonVoterInfo = () => {
    let findIndexVoter = nonVoterForView.findIndex(
      (data, index) => data.pK_UID === VoterID
    );
    let findIndexFromSendData = nonVoter.findIndex(
      (data, index) => data.FK_UID === VoterID
    );
    if (findIndexVoter !== -1) {
      nonVoterForView.splice(findIndexVoter, 1);
      nonVoter.splice(findIndexFromSendData, 1);
      setNonVotersForView([...nonVoterForView]);
      setNonVoters([...nonVoter]);
    }
    setNonVoterModalRemove(false);
    setVoterID(0);
    setVoterName("");
  };

  //On Click Of Dropdown Value
  const onSearch = (name, id) => {
    setOnclickFlag(true);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    if (meetingAttendeesList.length > 0) {
      let findAttendeeEmail = meetingAttendeesList.find(
        (data, index) => data.pK_UID === id
      );
      setEmailValue(findAttendeeEmail.emailAddress);
    }
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    if (e.target.value === "") {
      setEmailValue("");
      setTaskAssignedToInput("");
      setTaskAssignedTo(0);
    } else if (e.target.value !== "") {
      setOnclickFlag(false);
      setTaskAssignedToInput(e.target.value.trimStart());
    }

    // setEmailValue
  };

  const ReminderChangeHandler = (e) => {
    setCreateResolutionData({
      ...createResolutionData,
      FK_ResolutionReminderFrequency_ID: e.value,
    });
  };

  const searchFilterHandler = (value) => {
    if (meetingAttendeesList !== undefined && meetingAttendeesList !== null) {
      return meetingAttendeesList
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
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
            <img
              src={`data:image/jpeg;base64,${item.displayProfilePictureName}`}
              alt=""
              className="user-img"
              draggable="false"
            />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
      setEmailValue("");
    }
  };

  const deleteFilefromAttachments = (data, index) => {
    let fileSizefound = fileSize - data.fileSize;
    let fileForSendingIndex = fileForSend.findIndex(
      (newData, index) => newData.name === data.DisplayAttachmentName
    );
    fileForSend.splice(fileForSendingIndex, 1);
    setFileForSend(fileForSend);
    setFileSize(fileSizefound);
    let searchIndex = tasksAttachments;
    searchIndex.splice(index, 1);
    setTasksAttachments([...tasksAttachments]);
  };

  const addVoters = () => {
    let findVoter = voters.findIndex(
      (data, index) => data.FK_UID === taskAssignedTo
    );
    let findisAlreadyExist = nonVoter.findIndex(
      (data, index) => data.FK_UID === taskAssignedTo
    );
    if (findisAlreadyExist === -1) {
      if (findVoter === -1) {
        if (taskAssignedToInput !== 0) {
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList
              .filter((data, index) => data.pK_UID === taskAssignedTo)
              .map((voeterdata, index) => {
                voters.push({
                  FK_UID: voeterdata.pK_UID,
                  FK_VotingStatus_ID: 3,
                  Notes: "",
                  Email: voeterdata.emailAddress,
                });
                votersForView.push(voeterdata);
              });
            setVoters([...voters]);
            setVotersForView([...votersForView]);
          } else {
            setOpen({
              flag: true,
              message: t("this-voter-already-exist"),
            });
          }
        }
      } else {
        setOpen({
          flag: true,
          message: t("this-Voter-already-exist"),
        });
      }
    } else {
      setOpen({
        flag: true,
        message: t("This-voter-is-already-exist-in-non-voter-list"),
      });
    }

    setTaskAssignedToInput("");
    setTaskAssignedTo(0);
    setEmailValue("");
  };

  const addNonVoter = () => {
    let findVoter = nonVoter.findIndex(
      (data, index) => data.FK_UID === taskAssignedTo
    );
    let findisAlreadyExist = voters.findIndex(
      (data, index) => data.FK_UID === taskAssignedTo
    );
    if (findisAlreadyExist === -1) {
      if (findVoter === -1) {
        if (taskAssignedToInput !== 0) {
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList
              .filter((data, index) => data.pK_UID === taskAssignedTo)
              .forEach((voeterdata, index) => {
                nonVoter.push({
                  FK_UID: voeterdata.pK_UID,
                  FK_VotingStatus_ID: 3,
                  Notes: "",
                  Email: voeterdata.emailAddress,
                });
                nonVoterForView.push(voeterdata);
              });
            setNonVoters([...nonVoter]);
            setNonVotersForView([...nonVoterForView]);
          }
        }
      } else {
        setOpen({
          flag: true,
          message: t("This-voter-already-exist"),
        });
      }
    } else {
      setOpen({
        flag: true,
        message: t("This-user-already-exist-in-voter-list"),
      });
    }

    setTaskAssignedToInput("");
    setTaskAssignedTo(0);
    setEmailValue("");
  };

  const resolutionSaveHandler = async () => {
    if (
      createResolutionData.Title !== "" &&
      circulationDateTime.dateValue !== "" &&
      decisionDateTime.dateValue !== "" &&
      votingDateTime.dateValue !== "" &&
      decisionDateTime.time !== "" &&
      circulationDateTime.time !== "" &&
      votingDateTime.time !== "" &&
      createResolutionData.NotesToVoter !== "" &&
      createResolutionData.FK_ResolutionVotingMethodID !== 0 &&
      createResolutionData.FK_ResolutionReminderFrequency_ID !== 0
    ) {
      setsendStatus(1);
      if (fileForSend.length > 0) {
        // let folderID = [];
        // let tasksAttachments;
        let Data = {
          ResolutionModel: {
            FK_ResolutionStatusID: 1,
            FK_ResolutionVotingMethodID:
              createResolutionData.FK_ResolutionVotingMethodID,
            Title: createResolutionData.Title,
            NotesToVoter: createResolutionData.NotesToVoter,
            CirculationDateTime: createConvert(
              removeDashesFromDate(circulationDateTime.date) +
                RemoveTimeDashes(circulationDateTime.time)
            ),
            DeadlineDateTime: createConvert(
              removeDashesFromDate(votingDateTime.date) +
                RemoveTimeDashes(votingDateTime.time)
            ),
            FK_ResolutionReminderFrequency_ID:
              createResolutionData.FK_ResolutionReminderFrequency_ID,
            FK_ResolutionDecision_ID: decision.value,
            DecisionAnnouncementDateTime: createConvert(
              removeDashesFromDate(decisionDateTime.date) +
                RemoveTimeDashes(decisionDateTime.time)
            ),
            IsResolutionPublic: createResolutionData.IsResolutionPublic,
            FK_OrganizationID: JSON.parse(
              localStorage.getItem("organizationID")
            ),
            FK_UID: JSON.parse(localStorage.getItem("userID")),
          },
        };
        await dispatch(createResolution(navigate, Data, voters, t));
      } else {
        let Data = {
          ResolutionModel: {
            FK_ResolutionStatusID: 1,
            FK_ResolutionVotingMethodID:
              createResolutionData.FK_ResolutionVotingMethodID,
            Title: createResolutionData.Title,
            NotesToVoter: createResolutionData.NotesToVoter,
            CirculationDateTime: createConvert(
              removeDashesFromDate(circulationDateTime.date) +
                RemoveTimeDashes(circulationDateTime.time)
            ),
            DeadlineDateTime: createConvert(
              removeDashesFromDate(votingDateTime.date) +
                RemoveTimeDashes(votingDateTime.time)
            ),
            FK_ResolutionReminderFrequency_ID:
              createResolutionData.FK_ResolutionReminderFrequency_ID,
            FK_ResolutionDecision_ID: decision.value,
            DecisionAnnouncementDateTime: createConvert(
              removeDashesFromDate(decisionDateTime.date) +
                RemoveTimeDashes(decisionDateTime.time)
            ),
            IsResolutionPublic: createResolutionData.IsResolutionPublic,
            FK_OrganizationID: JSON.parse(
              localStorage.getItem("organizationID")
            ),
            FK_UID: JSON.parse(localStorage.getItem("userID")),
          },
        };
        dispatch(createResolution(navigate, Data, voters, t));
        setTasksAttachments([]);
      }
    } else {
      setError(true);
      setOpen({
        flag: true,
        message: t("Please-fill-all-the-fields"),
      });
    }
  };

  const resolutionCirculateHandler = async () => {
    if (
      createResolutionData.Title !== "" &&
      circulationDateTime.dateValue !== "" &&
      decisionDateTime.dateValue !== "" &&
      votingDateTime.dateValue !== "" &&
      decisionDateTime.time !== "" &&
      circulationDateTime.time !== "" &&
      votingDateTime.time !== "" &&
      createResolutionData.NotesToVoter !== "" &&
      createResolutionData.FK_ResolutionVotingMethodID !== 0 &&
      createResolutionData.FK_ResolutionReminderFrequency_ID !== 0
      // voters.length > 0
    ) {
      setsendStatus(2);
      if (fileForSend.length > 0) {
        // let newfile = [];
        // const uploadPromises = fileForSend.map((newData) => {
        //   return dispatch(FileUploadToDo(navigate, newData, t, newfile));
        // });
        // await Promise.all(uploadPromises);
        // let tasksAttachments = newfile;
        let Data = {
          ResolutionModel: {
            FK_ResolutionStatusID: 2,
            FK_ResolutionVotingMethodID:
              createResolutionData.FK_ResolutionVotingMethodID,
            Title: createResolutionData.Title,
            NotesToVoter: createResolutionData.NotesToVoter,
            CirculationDateTime: createConvert(
              removeDashesFromDate(circulationDateTime.date) +
                RemoveTimeDashes(circulationDateTime.time)
            ),
            DeadlineDateTime: createConvert(
              removeDashesFromDate(votingDateTime.date) +
                RemoveTimeDashes(votingDateTime.time)
            ),
            FK_ResolutionReminderFrequency_ID:
              createResolutionData.FK_ResolutionReminderFrequency_ID,
            FK_ResolutionDecision_ID: decision.value,
            DecisionAnnouncementDateTime: createConvert(
              removeDashesFromDate(decisionDateTime.date) +
                RemoveTimeDashes(decisionDateTime.time)
            ),
            IsResolutionPublic: createResolutionData.IsResolutionPublic,
            FK_OrganizationID: JSON.parse(
              localStorage.getItem("organizationID")
            ),
            FK_UID: JSON.parse(localStorage.getItem("userID")),
          },
        };
        if (Object.keys(voters).length <= 0) {
          setError(true);
          setVoter(true);
          setNonVoter(false);
        } else {
          dispatch(createResolution(navigate, Data, voters, t));
        }
      } else {
        let Data = {
          ResolutionModel: {
            FK_ResolutionStatusID: 2,
            FK_ResolutionVotingMethodID:
              createResolutionData.FK_ResolutionVotingMethodID,
            Title: createResolutionData.Title,
            NotesToVoter: createResolutionData.NotesToVoter,
            CirculationDateTime: createConvert(
              removeDashesFromDate(circulationDateTime.date) +
                RemoveTimeDashes(circulationDateTime.time)
            ),
            DeadlineDateTime: createConvert(
              removeDashesFromDate(votingDateTime.date) +
                RemoveTimeDashes(votingDateTime.time)
            ),
            FK_ResolutionReminderFrequency_ID:
              createResolutionData.FK_ResolutionReminderFrequency_ID,
            FK_ResolutionDecision_ID: decision.value,
            DecisionAnnouncementDateTime: createConvert(
              removeDashesFromDate(decisionDateTime.date) +
                RemoveTimeDashes(decisionDateTime.time)
            ),
            IsResolutionPublic: createResolutionData.IsResolutionPublic,
            FK_OrganizationID: JSON.parse(
              localStorage.getItem("organizationID")
            ),
            FK_UID: JSON.parse(localStorage.getItem("userID")),
          },
        };
        if (Object.keys(voters).length <= 0) {
          setError(true);
          setVoter(true);
          setNonVoter(false);
        } else {
          dispatch(createResolution(navigate, Data, voters, t));
        }
        setTasksAttachments([]);
      }
    } else {
      setError(true);
      setOpen({
        flag: true,
        message: t("Please-fill-all-the-fields"),
      });
    }
  };

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { fileList } = data;

      // Check if the fileList is the same as the previous one
      if (JSON.stringify(fileList) === JSON.stringify(previousFileList)) {
        return; // Skip processing if it's the same fileList
      }

      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let flag = false;
      let sizezero = true;
      let size = true;

      if (tasksAttachments.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > 10485760) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = tasksAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            });
          }, 3000);
        } else if (!sizezero) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            });
          }, 3000);
        } else if (fileExists) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            });
          }, 3000);
        } else {
          let file = {
            DisplayAttachmentName: fileData.name,
            OriginalAttachmentName: fileData.name,
            fileSize: fileData.originFileObj.size,
          };
          setTasksAttachments((prevAttachments) => [...prevAttachments, file]);
          fileSizeArr += fileData.originFileObj.size;
          setFileForSend((prevFiles) => [...prevFiles, fileData.originFileObj]);
          setFileSize(fileSizeArr);
        }
      });

      // Update previousFileList to current fileList
      previousFileList = fileList;
    },
    onDrop(e) {},
    customRequest() {},
  };
  // Initialize previousFileList to an empty array
  let previousFileList = [];
  // Check is Resolution Checker Handler
  const handleChangeChecker = (e, checked) => {
    setCreateResolutionData({
      ...createResolutionData,
      IsResolutionPublic: e.target.checked,
    });
  };

  // Resolution Voting Method ID
  const detailDropDownhandler = (e) => {
    setCreateResolutionData({
      ...createResolutionData,
      FK_ResolutionVotingMethodID: e.value,
    });
  };

  // title and description change Handler
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "ResolutionTitle") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setCreateResolutionData({
          ...createResolutionData,
          Title: valueCheck,
        });
      } else {
        setCreateResolutionData({
          ...createResolutionData,
          Title: "",
        });
      }
    }
    if (name === "ResolutionDescription") {
      // let valueCheck = value.replace(/[^a-zA-Z0-9!@#$%^&*() ]/g, "");
      if (value !== "") {
        setCreateResolutionData({
          ...createResolutionData,
          NotesToVoter: value.trimStart(),
        });
      } else {
        setCreateResolutionData({
          ...createResolutionData,
          NotesToVoter: "",
        });
      }
    }
  };

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) {}
  }, [assignees.user]);

  const documentsUploadCall = async (folderID) => {
    let newFolder = [];
    let newfile = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsResolutionApi(navigate, t, newData, folderID, newfile)
        );
      });

      // Wait for all promises to resolve
      await Promise.all(uploadPromises);
      await dispatch(
        saveFilesResolutionApi(navigate, t, newfile, folderID, newFolder)
      );
    }

    let resolutionID = localStorage.getItem("resolutionID");
    await dispatch(
      updateResolution(
        navigate,
        Number(resolutionID),
        voters,
        nonVoter,
        newFolder,
        t,
        sendStatus
      )
    );
  };

  useEffect(() => {
    if (ResolutionReducer.updateResolutionDataroom !== 0) {
      setFolderID(ResolutionReducer.updateResolutionDataroom);
      let folderIDCreated = ResolutionReducer.updateResolutionDataroom;
      documentsUploadCall(folderIDCreated);
    }
  }, [ResolutionReducer.updateResolutionDataroom]);

  useEffect(() => {
    if (
      ResolutionReducer.ResponseMessage !== "" &&
      ResolutionReducer.ResponseMessage !== t("Data-available") &&
      ResolutionReducer.ResponseMessage !== undefined &&
      ResolutionReducer.ResponseMessage !== t("No-data-available")
    ) {
      setOpen({
        flag: true,
        message: ResolutionReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          flag: false,
          message: "",
        });
      }, 4000);
      dispatch(clearResponseMessage());
    }
  }, [ResolutionReducer.ResponseMessage]);

  // Get Voting Methods
  useEffect(() => {
    if (ResolutionReducer.GetAllVotingMethods !== null) {
      let newArr = [];
      ResolutionReducer.GetAllVotingMethods.map((data, index) => {
        newArr.push({
          value: data.pK_ResolutionVotingMethodID,
          label: data.votingMethod,
        });
      });
      setVotingMethods(newArr);
    }
  }, [ResolutionReducer.GetAllVotingMethods]);

  //Circulation Time
  const handleCirculationTimeChange = (date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}:${minutes}`;
      // setCirculationDateTime(date);
      setCirculationDateTime({
        ...circulationDateTime,
        time: formattedTime,
        timeCirculationforView: date,
      });
    } else {
    }
  };

  //Voting Time
  const handleVotingTimeChange = (date) => {
    let newDate = new Date(date);

    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}:${minutes}`;

      setVotingDateTime({
        ...votingDateTime,
        time: formattedTime,
        timeVotingforView: date,
      });
    } else {
    }
  };

  //Decisions Time
  const handleDecisionTimeChange = (date) => {
    let newDate = new Date(date);

    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}:${minutes}`;
      setDecisionDateTime({
        ...decisionDateTime,
        time: formattedTime,
        timeCirculationforView: date,
      });
    } else {
    }
  };

  const circulationDateChangeHandler = (date) => {
    let meetingDateSaveFormat = new DateObject(date).format("YYYY-MM-DD");
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    setCirculationDateTime({
      ...circulationDateTime,
      date: meetingDateSaveFormat,
      dateValue: meetingDateValueFormat,
    });
  };

  const votingDateChangeHandler = (date) => {
    let meetingDateSaveFormat = new DateObject(date).format("YYYY-MM-DD");
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");

    setVotingDateTime({
      ...votingDateTime,
      date: meetingDateSaveFormat,
      dateValue: meetingDateValueFormat,
    });
  };

  const decisionChangeHandler = (date) => {
    let meetingDateSaveFormat = new DateObject(date).format("YYYY-MM-DD");
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    setDecisionDateTime({
      ...decisionDateTime,
      date: meetingDateSaveFormat,
      dateValue: meetingDateValueFormat,
    });
  };

  //Custom Input For Time selectors
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

  // custom react select styles Reminder Frequency
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
    <>
      <section>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Row className="my-2">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Resolution_create_heading"]}>
                  {t("Schedule-new-resolution")}
                  {/* {} */}
                </span>
              </Col>
            </Row>
            <Paper className={styles["Create_new_resolution_paper"]}>
              {/* <Row>
                <Col lg={12} md={12} sm={12} className={styles["IN_draft_Box"]}>
                  <Row className="mt-1">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["Draft_messege"]}>
                        {t("In-draft")}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row> */}
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={5} md={5} sm={12}>
                      {/* Resolution Detail */}
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Details_New_resolution"]}>
                            {t("Details")}
                          </span>
                        </Col>
                      </Row>
                      {/* Resolution Title */}
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput resolution-search-input"
                        >
                          <TextField
                            applyClass="form-control2"
                            type="text"
                            placeholder={t("Resolution-title") + "*"}
                            required={true}
                            value={createResolutionData.Title}
                            maxLength={300}
                            name="ResolutionTitle"
                            change={handleChange}
                          />
                        </Col>
                        <Row>
                          <Col>
                            <p
                              className={
                                createResolutionData.Title === "" && error
                                  ? ` ${styles["errorMessage"]}`
                                  : `${styles["errorMessage_hidden"]}`
                              }
                            >
                              {t("Resolution-Title-is-required")}
                            </p>
                          </Col>
                        </Row>
                      </Row>
                      <Row className="mt-3">
                        {/* Voting Methods */}
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className="resolution-search-input FontArabicRegular"
                        >
                          <Select
                            name="Participant"
                            placeholder={t("Voting-method") + "*"}
                            className="select-voting-deadline"
                            options={votingMethods}
                            isSearchable={false}
                            onChange={detailDropDownhandler}
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  createResolutionData.FK_ResolutionVotingMethodID ===
                                    0 && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Voting-method-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        {/* Decision Value */}
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className="resolution-search-input FontArabicRegular"
                        >
                          <Select
                            name=""
                            placeholder={t("Decision") + "*"}
                            className="select-voting-deadline"
                            defaultValue={{
                              label: decision.label,
                              value: decision.value,
                            }}
                            isDisabled={true}
                          />
                        </Col>
                      </Row>
                      <Row>
                        {/* Resolution Description */}
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput FontArabicRegular "
                        >
                          <TextField
                            applyClass="text-area-create-resolution"
                            type="text"
                            as={"textarea"}
                            rows="4"
                            placeholder={t("Notes-for-voters") + "*"}
                            value={createResolutionData.NotesToVoter}
                            required={true}
                            maxLength={500}
                            name="ResolutionDescription"
                            change={handleChange}
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  createResolutionData.NotesToVoter === "" &&
                                  error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Notes-to-voters-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {/* Circulation Date Heading */}
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Circulation_heading"]}>
                            {t("Circulation-date")}
                          </span>
                          <span style={{ color: "#F16B6B" }}>*</span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        {/* Circulation Date */}
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <div className="datepicker align-items-center ">
                            <DatePicker
                              format={"DD/MM/YYYY"}
                              minDate={currentDate}
                              placeholder="YYYY-MM-DD"
                              render={
                                <InputIcon
                                  placeholder="DD/MM/YYYY"
                                  className={styles["Resolution_datePicker"]}
                                />
                              }
                              editable={false}
                              className="datePickerTodoCreate2"
                              onOpenPickNewDate={true}
                              containerClassName={
                                styles["datePicker_Container"]
                              }
                              inputMode=""
                              name="circulation"
                              value={circulationDateTime.dateValue}
                              calendar={calendarValue}
                              locale={localValue}
                              onFocusedDateChange={circulationDateChangeHandler}
                            />
                          </div>
                          {/* <TextFieldDateTime
                            min={minDate}
                            labelClass="d-none"
                            name={"circulation"}
                            applyClass={"search_voterInput"}
                            change={(e) => {
                              handleChangeDateSelection(e);
                            }}
                          /> */}
                          <Row>
                            <Col>
                              <p
                                className={
                                  circulationDateTime.date === "" && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Circulation-date-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        {/* Circulation Time */}
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                        >
                          {/* Circualtion Time */}

                          <DatePicker
                            arrowClassName="arrowClass"
                            containerClassName="containerResolutionTimePicker"
                            className="timePicker"
                            disableDayPicker
                            inputClass="inputTImeMeeting"
                            calendar={calendarValue}
                            locale={localValue}
                            format="hh:mm A"
                            editable={false}
                            plugins={[
                              <TimePicker
                                hideSeconds
                                position="bottom"
                                onFocusCapture={false}
                              />,
                            ]}
                            render={<CustomInput />}
                            // selected={
                            //   circulationDateTime.timeCirculationforView
                            // }
                            value={circulationDateTime.timeCirculationforView}
                            onChange={(date) =>
                              handleCirculationTimeChange(date)
                            }
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  circulationDateTime.time === "" && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Circulation-time-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {/* Voting Deadline */}
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={
                              styles["Voting_deadline_Create_resolution"]
                            }
                          >
                            {t("Voting-deadline")}
                          </span>
                          <span style={{ color: "#F16B6B" }}>*</span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        {/* Voting Date */}
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                        >
                          <div className="datepicker align-items-center ">
                            <DatePicker
                              format={"DD/MM/YYYY"}
                              minDate={
                                circulationDateTime.date !== ""
                                  ? dateformatYYYYMMDD(circulationDateTime.date)
                                  : currentDate
                              }
                              placeholder="DD/MM/YYYY"
                              render={
                                <InputIcon
                                  placeholder="DD/MM/YYYY"
                                  className={styles["Resolution_datePicker"]}
                                />
                              }
                              editable={false}
                              className="datePickerTodoCreate2"
                              onOpenPickNewDate={true}
                              containerClassName={
                                styles["datePicker_Container"]
                              }
                              inputMode=""
                              name="voting"
                              value={votingDateTime.dateValue}
                              calendar={calendarValue}
                              locale={localValue}
                              onFocusedDateChange={votingDateChangeHandler}
                            />
                          </div>
                          <Row>
                            <Col>
                              <p
                                className={
                                  votingDateTime.date === "" && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Voting-deadline-date-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        {/* Voting Time */}
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                        >
                          {/* <TextFieldTime
                            type="time"
                            applyClass={"search_voterInput"}
                            labelClass="d-none"
                            value={votingDateTime.time}
                            name="voting"
                            onKeyDown={(e) => e.preventDefault()}
                            change={(e) => {
                              handleChangeTimeSelection(e);
                            }}
                            onClick={() => {
                              setVotingDateTime({
                                ...votingDateTime,
                                time: getcurrentTime,
                              });
                            }}
                          /> */}

                          <DatePicker
                            arrowClassName="arrowClass"
                            containerClassName="containerResolutionTimePicker"
                            className="timePicker"
                            disableDayPicker
                            inputClass="inputTImeMeeting"
                            calendar={calendarValue}
                            locale={localValue}
                            format="hh:mm A"
                            editable={false}
                            plugins={[
                              <TimePicker hideSeconds onFocusCapture={false} />,
                            ]}
                            render={<CustomInput />}
                            // selected={votingDateTime.timeVotingforView}
                            value={votingDateTime.timeVotingforView}
                            onChange={(date) => handleVotingTimeChange(date)}
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  votingDateTime.time === "" && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Voting-deadline-time-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {/* Decision Deadline */}
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={
                              styles["decision_annoucement_Createresoulution"]
                            }
                          >
                            {t("Decision-announcement")}
                          </span>
                          <span style={{ color: "#F16B6B" }}>*</span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        {/* Decision Date */}
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                        >
                          <div className="datepicker align-items-center ">
                            <DatePicker
                              format={"DD/MM/YYYY"}
                              minDate={
                                votingDateTime.date !== ""
                                  ? dateformatYYYYMMDD(votingDateTime.date)
                                  : currentDate
                              }
                              placeholder="DD/MM/YYYY"
                              render={
                                <InputIcon
                                  placeholder="DD/MM/YYYY"
                                  className={styles["Resolution_datePicker"]}
                                />
                              }
                              editable={false}
                              className="datePickerTodoCreate2"
                              onOpenPickNewDate={true}
                              containerClassName={
                                styles["datePicker_Container"]
                              }
                              inputMode=""
                              name="decision"
                              value={decisionDateTime.dateValue}
                              calendar={calendarValue}
                              locale={localValue}
                              onFocusedDateChange={decisionChangeHandler}
                            />
                          </div>
                          <Row>
                            <Col>
                              <p
                                className={
                                  decisionDateTime.date === "" && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Decision-announcement-date-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        {/* Decision Time */}
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                        >
                          {/* <TextFieldTime
                            applyClass={"search_voterInput"}
                            type="time"
                            onKeyDown={(e) => e.preventDefault()}
                            value={decisionDateTime.time}
                            name="decision"
                            labelClass="d-none"
                            change={(e) => {
                              handleChangeTimeSelection(e);
                            }}
                            onClick={() => {
                              setDecisionDateTime({
                                ...decisionDateTime,
                                time: getcurrentTime,
                              });
                            }}
                          /> */}
                          <DatePicker
                            arrowClassName="arrowClass"
                            containerClassName="containerResolutionTimePicker"
                            className="timePicker"
                            disableDayPicker
                            inputClass="inputTImeMeeting"
                            calendar={calendarValue}
                            locale={localValue}
                            format="hh:mm A"
                            // shouldCloseOnSelect={true}
                            editable={false}
                            plugins={[
                              <TimePicker hideSeconds onFocusCapture={false} />,
                            ]}
                            render={<CustomInput />}
                            // selected={decisionDateTime.timeDecisionforView}
                            value={decisionDateTime.timeDecisionforView}
                            onChange={(date) => handleDecisionTimeChange(date)}
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  decisionDateTime.time === "" && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Decision-announcement-time-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {/* Reminder Frequency */}
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Reminder"]}>
                            {t("Reminder-frequency")}
                          </span>
                          <span style={{ color: "#F16B6B" }}>*</span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        {/* Reminder List */}
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className="CreateMeetingReminder resolution-search-input select-dropdowns-height FontArabicMedium "
                        >
                          <Select
                            name="Participant"
                            placeholder={t("Time")}
                            className="select-voting-deadline"
                            styles={customStyles}
                            menuPlacement="top" // Set menuPlacement to 'top' to open the dropdown upwards
                            menuPortalTarget={document.body}
                            options={reminderData}
                            onChange={ReminderChangeHandler}
                          />
                          <Row>
                            <Col>
                              <p
                                className={
                                  createResolutionData.FK_ResolutionReminderFrequency_ID ===
                                    0 && error
                                    ? ` ${styles["errorMessage"]}`
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {t("Reminder-frequency-is-required")}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={
                            styles["Schedule_resolution_checkboxalign"]
                          }
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="UpdateCheckbox  d-flex justify-content-start FontArabicRegular"
                            >
                              <Checkbox
                                className="SearchCheckbox "
                                name="IsChat"
                                checked={
                                  createResolutionData.IsResolutionPublic
                                }
                                label2Class={
                                  styles["Class_for_label_resolution"]
                                }
                                label2={t("Make-resolution-public")}
                                onChange={handleChangeChecker}
                                classNameDiv="checkboxParentClass"
                              ></Checkbox>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={1}
                      md={1}
                      sm={false}
                      className="d-flex justify-content-center"
                    >
                      <span className={styles["line_createresolution"]}></span>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-start gap-3"
                        >
                          <Button
                            text={t("Voters")}
                            className={
                              isVoter
                                ? `${styles["Voters_Btn_Createresolution_Active"]}`
                                : `${styles["Voters_Btn_Createresolution"]}`
                            }
                            onClick={ShowVoter}
                          />
                          <Button
                            text={t("Non-voters")}
                            className={
                              isNonVoter
                                ? `${styles["Non_Voters_Btn_Createresolution_Active"]}`
                                : `${styles["Non_Voters_Btn_Createresolution"]}`
                            }
                            onClick={ShowNonVoters}
                          />
                        </Col>
                      </Row>
                      <>
                        <Col lg={12} md={12} sm={12}>
                          {isVoter ? (
                            <>
                              <Row className="mt-1">
                                <Col
                                  lg={5}
                                  md={5}
                                  sm={5}
                                  className="CreateMeetingInput resolution-search-input  "
                                >
                                  <InputSearchFilter
                                    placeholder={`${t("Add-attendees")}*`}
                                    className="taskassignee"
                                    value={taskAssignedToInput}
                                    filteredDataHandler={searchFilterHandler(
                                      taskAssignedToInput
                                    )}
                                    applyClass={"search_voterInput"}
                                    change={onChangeSearch}
                                    onclickFlag={onclickFlag}
                                  />
                                  <Row>
                                    <Col>
                                      <p
                                        className={
                                          voters.length === 0 && error
                                            ? ` ${styles["errorMessage"]}`
                                            : `${styles["errorMessage_hidden"]}`
                                        }
                                      >
                                        {t("At-least-add-one-voter")}
                                      </p>
                                    </Col>
                                  </Row>
                                </Col>

                                <Col
                                  lg={5}
                                  md={5}
                                  sm={5}
                                  className="CreateMeetingInput resolution-search-input "
                                >
                                  <TextField
                                    applyClass="text-area-create-group"
                                    type="text"
                                    placeholder={`${t("Email")}*`}
                                    required={true}
                                    value={emailValue}
                                    disable={true}
                                  />
                                </Col>
                                <Col lg={2} md={2} sm={2}>
                                  <Button
                                    text={t("Add")}
                                    disableBtn={
                                      taskAssignedTo !== 0 ? false : true
                                    }
                                    className={
                                      styles["ADD_Button_Createresolution"]
                                    }
                                    onClick={addVoters}
                                  />
                                </Col>
                              </Row>

                              <Row className="mt-1">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={
                                    styles["scroll-bar-Create-resolution"]
                                  }
                                >
                                  <Row>
                                    {votersForView.length > 0
                                      ? votersForView.map((data, index) => {
                                          return (
                                            <>
                                              <Col
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                // className="mt-2"
                                              >
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <EmployeeinfoCard
                                                      Employeename={data?.name}
                                                      Employeeemail={
                                                        data?.emailAddress
                                                      }
                                                      EmployeePic={
                                                        data?.displayProfilePictureName
                                                      }
                                                      Icon={
                                                        <img
                                                          src={CrossIcon}
                                                          width="18px"
                                                          height="18px"
                                                          alt=""
                                                          onClick={() =>
                                                            removeUserForVoter(
                                                              data.pK_UID,
                                                              data.name
                                                            )
                                                          }
                                                          draggable="false"
                                                        />
                                                      }
                                                    />
                                                  </Col>
                                                </Row>
                                              </Col>
                                            </>
                                          );
                                        })
                                      : null}
                                  </Row>
                                </Col>
                              </Row>
                            </>
                          ) : isNonVoter ? (
                            <>
                              <Row className="mt-1">
                                <Col
                                  lg={5}
                                  md={5}
                                  sm={5}
                                  className="CreateMeetingInput resolution-search-input "
                                >
                                  <InputSearchFilter
                                    applyClass={"search_voterInput"}
                                    placeholder={t("Add-attendees")}
                                    className="taskassignee"
                                    value={taskAssignedToInput}
                                    filteredDataHandler={searchFilterHandler(
                                      taskAssignedToInput
                                    )}
                                    change={onChangeSearch}
                                    onclickFlag={onclickFlag}
                                  />
                                </Col>

                                <Col
                                  lg={5}
                                  md={5}
                                  sm={5}
                                  className="CreateMeetingInput resolution-search-input "
                                >
                                  <TextField
                                    applyClass="text-area-create-group"
                                    type="text"
                                    placeholder={t("Email")}
                                    required={true}
                                    disable={true}
                                    value={emailValue}
                                  />
                                </Col>
                                <Col lg={2} md={2} sm={2}>
                                  <Button
                                    text={t("Add")}
                                    disableBtn={
                                      taskAssignedTo !== 0 ? false : true
                                    }
                                    className={
                                      styles["ADD_Button_Createresolution"]
                                    }
                                    onClick={addNonVoter}
                                  />
                                </Col>
                              </Row>
                              <Row className="mt-1">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={
                                    styles["scroll-bar-Create-resolution"]
                                  }
                                >
                                  <Row>
                                    {nonVoterForView.length > 0
                                      ? nonVoterForView.map((data, index) => {
                                          return (
                                            <>
                                              <Col
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                // className="mt-2"
                                              >
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <EmployeeinfoCard
                                                      Employeename={data?.name}
                                                      Employeeemail={
                                                        data?.emailAddress
                                                      }
                                                      EmployeePic={
                                                        data?.displayProfilePictureName
                                                      }
                                                      Icon={
                                                        <img
                                                          src={CrossIcon}
                                                          width="18px"
                                                          height="18px"
                                                          alt=""
                                                          onClick={() =>
                                                            removeUserForNonVoter(
                                                              data.pK_UID,
                                                              data.name
                                                            )
                                                          }
                                                          draggable="false"
                                                        />
                                                      }
                                                    />
                                                  </Col>
                                                </Row>
                                              </Col>
                                            </>
                                          );
                                        })
                                      : null}
                                  </Row>
                                </Col>
                              </Row>
                            </>
                          ) : null}

                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["Attachments_resolution"]}
                              >
                                {t("Attachments")}
                              </span>
                            </Col>
                          </Row>
                          <Row
                            className={
                              styles["create_resolution_attachmentattendeepart"]
                            }
                          >
                            {tasksAttachments.length > 0 && (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["attachments_height"]}
                              >
                                <Row>
                                  {/* <Col lg={1} md={1} sm={1} className="mt-4">
                                    {tasksAttachments.length > 6 ? (
                                      <>
                                        <Button
                                          icon={
                                            <img
                                              src={Leftploygon}
                                              width="20px"
                                              height="15px"
                                              alt=""
                                              draggable="false"
                                            />
                                          }
                                          onClick={SlideLeft}
                                          className={styles["Leftpolygon"]}
                                        />
                                      </>
                                    ) : null}
                                  </Col> */}
                                  <Col lg={12} md={12} sm={12}>
                                    <Row>
                                      {tasksAttachments.length > 0
                                        ? tasksAttachments.map(
                                            (data, index) => {
                                              var ext =
                                                data?.DisplayAttachmentName?.split(
                                                  "."
                                                ).pop();
                                              const first =
                                                data?.DisplayAttachmentName?.split(
                                                  " "
                                                )[0];
                                              return (
                                                <Col
                                                  sm={4}
                                                  lg={4}
                                                  md={4}
                                                  // className="Scroller-x-resolution"
                                                  id="Slider"
                                                >
                                                  <AttachmentViewer
                                                    data={data}
                                                    name={
                                                      data?.DisplayAttachmentName
                                                    }
                                                    handleClickRemove={() =>
                                                      deleteFilefromAttachments(
                                                        data,
                                                        index
                                                      )
                                                    }
                                                    fk_UID={Number(
                                                      localStorage.getItem(
                                                        "userID"
                                                      )
                                                    )}
                                                    id={0}
                                                  />
                                                </Col>

                                                // <Col
                                                //   sm={12}
                                                //   lg={2}
                                                //   md={2}
                                                //   className="modaltodolist-attachment-icon"
                                                // >
                                                //   {ext === "doc" ? (
                                                //     <FileIcon
                                                //       extension={"docx"}
                                                //       size={78}
                                                //       type={"document"}
                                                //       labelColor={
                                                //         "rgba(44, 88, 152)"
                                                //       }
                                                //     />
                                                //   ) : ext === "docx" ? (
                                                //     <FileIcon
                                                //       extension={"docx"}
                                                //       size={78}
                                                //       type={"font"}
                                                //       labelColor={
                                                //         "rgba(44, 88, 152)"
                                                //       }
                                                //     />
                                                //   ) : ext === "xls" ? (
                                                //     <FileIcon
                                                //       extension={"xls"}
                                                //       type={"spreadsheet"}
                                                //       size={78}
                                                //       labelColor={
                                                //         "rgba(16, 121, 63)"
                                                //       }
                                                //     />
                                                //   ) : ext === "xlsx" ? (
                                                //     <FileIcon
                                                //       extension={"xls"}
                                                //       type={"spreadsheet"}
                                                //       size={78}
                                                //       labelColor={
                                                //         "rgba(16, 121, 63)"
                                                //       }
                                                //     />
                                                //   ) : ext === "pdf" ? (
                                                //     <FileIcon
                                                //       extension={"pdf"}
                                                //       size={78}
                                                //       {...defaultStyles.pdf}
                                                //     />
                                                //   ) : ext === "png" ? (
                                                //     <FileIcon
                                                //       extension={"png"}
                                                //       size={78}
                                                //       type={"image"}
                                                //       labelColor={
                                                //         "rgba(102, 102, 224)"
                                                //       }
                                                //     />
                                                //   ) : ext === "txt" ? (
                                                //     <FileIcon
                                                //       extension={"txt"}
                                                //       size={78}
                                                //       type={"document"}
                                                //       labelColor={
                                                //         "rgba(52, 120, 199)"
                                                //       }
                                                //     />
                                                //   ) : ext === "jpg" ? (
                                                //     <FileIcon
                                                //       extension={"jpg"}
                                                //       size={78}
                                                //       type={"image"}
                                                //       labelColor={
                                                //         "rgba(102, 102, 224)"
                                                //       }
                                                //     />
                                                //   ) : ext === "jpeg" ? (
                                                //     <FileIcon
                                                //       extension={"jpeg"}
                                                //       size={78}
                                                //       type={"image"}
                                                //       labelColor={
                                                //         "rgba(102, 102, 224)"
                                                //       }
                                                //     />
                                                //   ) : ext === "gif" ? (
                                                //     <FileIcon
                                                //       extension={"gif"}
                                                //       size={78}
                                                //       {...defaultStyles.gif}
                                                //     />
                                                //   ) : (
                                                //     <FileIcon
                                                //       extension={ext}
                                                //       size={78}
                                                //       {...defaultStyles.ext}
                                                //     />
                                                //   )}
                                                //   <span className="deleteBtn">
                                                //     <img
                                                //       src={
                                                //         deleteButtonCreateMeeting
                                                //       }
                                                //       width={15}
                                                //       height={15}
                                                //       onClick={() =>
                                                //         deleteFilefromAttachments(
                                                //           data,
                                                //           index
                                                //         )
                                                //       }
                                                //       draggable="false"
                                                //     />
                                                //   </span>
                                                //   <p
                                                //     className="modaltodolist-attachment-text"
                                                //     title={
                                                //       data.DisplayAttachmentName
                                                //     }
                                                //   >
                                                //     {first}
                                                //   </p>
                                                // </Col>
                                              );
                                            }
                                          )
                                        : null}
                                    </Row>
                                  </Col>
                                  {/* <Col lg={1} md={1} sm={1} className="mt-4">
                                    {tasksAttachments.length > 6 ? (
                                      <>
                                        <Button
                                          icon={
                                            <img
                                              src={Rightploygon}
                                              width="20px"
                                              height="15px"
                                              draggable="false"
                                            />
                                          }
                                          onClick={Slideright}
                                          className={styles["Leftpolygon"]}
                                        />
                                      </>
                                    ) : null}
                                  </Col> */}
                                </Row>
                              </Col>
                            )}

                            <Col lg={12} md={12} sm={12}>
                              <Dragger
                                {...props}
                                fileList={[]}
                                className={
                                  styles[
                                    "dragdrop_attachment_create_resolution"
                                  ]
                                }
                              >
                                <p className="ant-upload-drag-icon">
                                  <span
                                    className={
                                      styles["create_resolution_dragger"]
                                    }
                                  >
                                    <img
                                      src={featherupload}
                                      width="18.87px"
                                      height="18.87px"
                                      draggable="false"
                                    />
                                  </span>
                                </p>
                                <p className={styles["ant-upload-text"]}>
                                  {t("Drag-&-drop-or")}
                                  <span className={styles["Choose_file_style"]}>
                                    {t("Choose-file")} {""}
                                  </span>
                                  <span className={styles["here_text"]}>
                                    {t("Here")}
                                  </span>
                                </p>
                              </Dragger>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end gap-3"
                            >
                              <Button
                                text={t("Discard")}
                                className={
                                  styles["Save_button_Createresolution"]
                                }
                                onClick={() =>
                                  dispatch(createResolutionModal(false))
                                }
                              />
                              <Button
                                text={t("Save")}
                                className={
                                  styles["Save_button_Createresolution"]
                                }
                                onClick={() => resolutionSaveHandler()}
                              />
                              <Button
                                text={t("Circulate")}
                                className={
                                  styles["circulate_button_Createresolution"]
                                }
                                onClick={() => resolutionCirculateHandler()}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Paper>
          </Col>
        </Row>
      </section>
      {isVoterModalRemove ? (
        <ModalresolutionRemove
          removeparticipant={isVoterModalRemove}
          setRemoveparticipant={setVoterModalRemove}
          VoterName={VoterName}
          ProceedBtnFunction={RemoveVoterInfo}
        />
      ) : null}
      {isNonVoterModalRemove ? (
        <ModalresolutionRemove
          removeparticipant={isNonVoterModalRemove}
          setRemoveparticipant={setNonVoterModalRemove}
          VoterName={VoterName}
          ProceedBtnFunction={removeNonVoterInfo}
        />
      ) : null}
      {resolutioncancel ? (
        <ModalCancellResolution
          cancelresolution={resolutioncancel}
          setCancelresolution={setResolutioncancel}
        />
      ) : null}
      {resolutionupdate ? (
        <ModalUpdateresolution
          updateresolution={resolutionupdate}
          setUpdateresolution={setResolutionupdate}
        />
      ) : null}

      {discardresolution ? (
        <ModalDiscardResolution
          discardresolution={discardresolution}
          setDiscardresolution={setDsicardresolution}
        />
      ) : null}
      <Notification message={open.message} setOpen={setOpen} open={open.flag} />
    </>
  );
};

export default ScheduleNewResolution;
