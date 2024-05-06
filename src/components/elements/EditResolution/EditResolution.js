import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styles from "./EditResolution.module.css";
import DatePicker, { DateObject } from "react-multi-date-picker";

import line from "../../../assets/images/line.png";
import FileIcon, { defaultStyles } from "react-file-icon";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";
import userImage from "../../../assets/images/user.png";
import { FileUploadToDo } from "../../../store/actions/Upload_action";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import featherupload from "../../../assets/images/featherupload.svg";
import Leftploygon from "../../../assets/images/Polygon 3.svg";
import Rightploygon from "../../../assets/images/Polygon right.svg";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import newprofile from "../../../assets/images/newprofile.png";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { message, Upload } from "antd";
import Select from "react-select";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  Notification,
  InputSearchFilter,
} from "./../../../components/elements";
import { useState } from "react";
import ModalresolutionRemove from "../../../container/ModalresolutionRemove/ModalresolutionRemove";
import ModalCancellResolution from "../../../container/ModalCancellResolution/ModalCancellResolution";
import ModalUpdateresolution from "../../../container/ModalUpdateResolution/ModalUpdateresolution";
import MOdalResolutionCirculated from "../../../container/ModalResolutionCirculated/ModalResolutionCirculated";
import ModalDiscardResolution from "../../../container/ModalDiscardResolution/ModalDiscardResolution";
import ModalResolutionUpdated from "../../../container/ModalResolutionUpdated/ModalResolutionUpdated";
import EmployeeinfoCard from "../Employeeinfocard/EmployeeinfoCard";
import {
  createResolution,
  getAllResolutionStatus,
  getAllVotingMethods,
  cancelResolutionApi,
  closeResolutionApi,
  clearResponseMessage,
  updateResolutionModal,
  updateResolution,
  uploadDocumentsResolutionApi,
  saveFilesResolutionApi,
} from "../../../store/actions/Resolution_actions";
import moment from "moment";
import {
  createConvert,
  createResolutionDateTime,
  editResolutionDate,
  editResolutionTime,
  editResolutionTimeView,
  removeDashesFromDate,
  RemoveTimeDashes,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import TextFieldDateTime from "../input_field_date/Input_field";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { validateInput } from "../../../commen/functions/regex";
import InputIcon from "react-multi-date-picker/components/input_icon";
const EditResolution = ({ setCancelresolution }) => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");
  const { ResolutionReducer, assignees } = useSelector((state) => state);
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const currentDate = new Date();
  const currentHours = currentDate.getHours().toString().padStart(2, "0");
  const currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
  const getcurrentTime = `${currentHours}:${currentMinutes}`;
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
  const [attachments, setAttachments] = useState([]);

  const [isVoter, setVoter] = useState(true);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [votingMethods, setVotingMethods] = useState([]);
  const [decision, setDecision] = useState({
    label: t("Decision-pending"),
    value: 1,
  });
  const [voters, setVoters] = useState([]);
  const [nonVoter, setNonVoters] = useState([]);
  const [votersForView, setVotersForView] = useState([]);
  const [nonVoterForView, setNonVotersForView] = useState([]);
  const [error, setError] = useState(false);
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
      label: "1 day before",
      value: 6,
    },
    {
      label: "7 days before",
      value: 7,
    },
  ]);

  const [circulationDateTime, setCirculationDateTime] = useState({
    date: "",
    time: new Date(),
    dateValue: "",
    timeCirculationforView: "",
  });

  const [votingDateTime, setVotingDateTime] = useState({
    date: "",
    time: new Date(),
    dateValue: "",
    timeVotingforView: "",
  });

  const [decisionDateTime, setDecisionDateTime] = useState({
    date: "",
    time: new Date(),
    dateValue: "",
    timeDecisionforView: "",
  });

  const [ReminderFrequncyValue, setReminderFrequencyValue] = useState({
    label: "",
    value: 0,
  });

  const [votingMethodValue, setVotingMethodValue] = useState({
    label: "",
    value: 0,
  });

  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [isNonVoter, setNonVoter] = useState(false);
  const [resolutioncancel, setResolutioncancel] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [cancelResolutionID, setCancelResolutionID] = useState(0);
  const [sendStatus, setsendStatus] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [resolutionupdate, setResolutionupdate] = useState(false);
  const [resolutionCirculate, setResolutionCirculate] = useState(false);
  const [resolutionUpdateSuccessfully, setResolutionUpdateSuccessfully] =
    useState(false);
  const [discardresolution, setDsicardresolution] = useState(false);
  const [tasksAttachments, setTasksAttachments] = useState([]);
  console.log(
    tasksAttachments,
    "tasksAttachmentstasksAttachmentstasksAttachments"
  );
  const [editResolutionData, setEditResolutionData] = useState({
    FK_ResolutionStatusID: 0,
    FK_ResolutionVotingMethodID: 0,
    Title: "",
    Description: "",
    NotesToVoter: "",
    CirculationDateTime: "",
    DeadlineDateTime: "",
    FK_ResolutionReminderFrequency_ID: 0,
    FK_ResolutionDecision_ID: 0,
    DecisionAnnouncementDateTime: "",
    IsResolutionPublic: false,
    pK_ResolutionID: 0,
    ResolutionStatus: "",
  });
  const [onclickFlag, setOnclickFlag] = useState(false);

  const ShowVoter = () => {
    setVoter(true);
    setNonVoter(false);
  };

  const ShowNonVoters = () => {
    setVoter(false);
    setNonVoter(true);
  };

  const SlideLeft = () => {
    let Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    let Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

  const resolutiondiscard = () => {
    setDsicardresolution(true);
  };
  const dateformatYYYYMMDD = (date) => {
    if (!!date && typeof date === "string") {
      return moment(date).add(1, "days").toDate();
    }
  };

  const reslotionupdatemodal = () => {
    setResolutionupdate(true);
  };

  const resolutioncancell = (id) => {
    setCancelResolutionID(id);
    setResolutioncancel(true);
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
    setTaskAssignedName(name);
    if (meetingAttendeesList.length > 0) {
      let findAttendeeEmail = meetingAttendeesList.find(
        (data, index) => data.pK_UID === id
      );
      setEmailValue(findAttendeeEmail.emailAddress);
    }
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setOnclickFlag(false);
    setTaskAssignedToInput(e.target.value.trimStart());
  };

  const ReminderChangeHandler = (e) => {
    setEditResolutionData({
      ...editResolutionData,
      FK_ResolutionReminderFrequency_ID: e.value,
    });
    setReminderFrequencyValue({
      label: e.label,
      value: e.value,
    });
  };

  //Drop Down Values for voters
  // const searchFilterHandler = (value) => {
  //   let allAssignees = assignees.user;
  //   if (
  //     allAssignees != undefined &&
  //     allAssignees != null &&
  //     allAssignees != NaN &&
  //     allAssignees != []
  //   ) {
  //     return allAssignees
  //       .filter((item) => {
  //         const searchTerm = value.toLowerCase();
  //         const assigneesName = item.name.toLowerCase();
  //         return (
  //           searchTerm &&
  //           assigneesName.startsWith(searchTerm) &&
  //           assigneesName !== searchTerm
  //         );
  //       })
  //       .slice(0, 3)
  //       .map((item) => (
  //         <div
  //           onClick={() => onSearch(item.name, item.pK_UID)}
  //           className="dropdown-row-assignee d-flex flex-row align-items-center"
  //           key={item.pK_UID}
  //         >
  //           <img src={userImage} />
  //           <p className="p-0 m-0">{item.name}</p>
  //         </div>
  //       ));
  //   } else {
  //   }
  // };
  const searchFilterHandler = (value) => {
    let allAssignees = assignees.user;
    if (allAssignees !== undefined && allAssignees !== null) {
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
    }
  };

  const deleteFilefromAttachments = (data, index) => {
    let fileSizefound = fileSize - data.fileSize;

    setAttachments((prevState) => {
      return prevState.filter((attacData, index) => {
        return attacData.displayAttachmentName !== data.displayAttachmentName;
      });
    });
    setFileForSend((prevFileSend) => {
      return prevFileSend.filter((attacData, index) => {
        return attacData.name !== data.displayAttachmentName;
      });
    });
    setTasksAttachments((prevState) => {
      return prevState.filter((newdata, index) => {
        return newdata.DisplayAttachmentName !== data.displayAttachmentName;
      });
    });

    setFileSize(fileSizefound);
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
        message: t("This-voter-is-already-exist-in-non-voter-list"),
      });
    }

    setTaskAssignedToInput("");
    setTaskAssignedTo(0);
    setTaskAssignedName("");
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
              .map((voeterdata, index) => {
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
    setTaskAssignedName("");
    setEmailValue("");
  };

  let previousFileList = [];

  const props = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
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

      if (attachments.length > 9) {
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

        let fileExists = attachments.some(
          (oldFileData) => oldFileData.displayAttachmentName === fileData.name
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
            displayAttachmentName: fileData.name,
            originalAttachmentName: fileData.name,
            fileSize: fileData.originFileObj.size,
          };

          setAttachments((prevAttachments) => [...prevAttachments, file]);
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

  const handleCirculateResolution = async () => {
    if (fileForSend.length > 0) {
      setsendStatus(2);
      // let newfiles = [...tasksAttachments];
      // let tasksAttachmentsData = [];
      // const uploadPromises = fileForSend.map((newData) => {
      //   // Return the promise from FileUploadToDo
      //   return dispatch(FileUploadToDo(navigate, newData, t, newfiles));
      // });

      // // Wait for all uploadPromises to resolve
      // await Promise.all(uploadPromises);
      // newfiles.map((attachmentData, index) => {
      //   tasksAttachmentsData.push({
      //     DisplayAttachmentName: attachmentData.DisplayAttachmentName,
      //     OriginalAttachmentName: attachmentData.OriginalAttachmentName,
      //   });
      // });
      let Data = {
        ResolutionModel: {
          FK_ResolutionStatusID: editResolutionData.FK_ResolutionStatusID,
          FK_ResolutionVotingMethodID:
            editResolutionData.FK_ResolutionVotingMethodID,
          Title: editResolutionData.Title,
          NotesToVoter: editResolutionData.NotesToVoter,
          CirculationDateTime: createConvert(
            removeDashesFromDate(circulationDateTime.date) +
              RemoveTimeDashes(circulationDateTime.time)
          ),
          DeadlineDateTime: createConvert(
            removeDashesFromDate(votingDateTime.date) +
              RemoveTimeDashes(votingDateTime.time)
          ),
          FK_ResolutionReminderFrequency_ID:
            editResolutionData.FK_ResolutionReminderFrequency_ID,
          FK_ResolutionDecision_ID: editResolutionData.FK_ResolutionDecision_ID,
          PK_ResolutionID: editResolutionData.pK_ResolutionID,
          DecisionAnnouncementDateTime: createConvert(
            removeDashesFromDate(decisionDateTime.date) +
              RemoveTimeDashes(decisionDateTime.time)
          ),
          IsResolutionPublic: editResolutionData.IsResolutionPublic,
          FK_OrganizationID: JSON.parse(localStorage.getItem("organizationID")),
          FK_UID: JSON.parse(localStorage.getItem("userID")),
        },
      };
      dispatch(createResolution(navigate, Data, voters, t));
    } else {
      setsendStatus(2);
      let Data = {
        ResolutionModel: {
          FK_ResolutionStatusID: editResolutionData.FK_ResolutionStatusID,
          FK_ResolutionVotingMethodID:
            editResolutionData.FK_ResolutionVotingMethodID,
          Title: editResolutionData.Title,
          NotesToVoter: editResolutionData.NotesToVoter,
          CirculationDateTime: createConvert(
            removeDashesFromDate(circulationDateTime.date) +
              RemoveTimeDashes(circulationDateTime.time)
          ),
          DeadlineDateTime: createConvert(
            removeDashesFromDate(votingDateTime.date) +
              RemoveTimeDashes(votingDateTime.time)
          ),
          FK_ResolutionReminderFrequency_ID:
            editResolutionData.FK_ResolutionReminderFrequency_ID,
          FK_ResolutionDecision_ID: editResolutionData.FK_ResolutionDecision_ID,
          PK_ResolutionID: editResolutionData.pK_ResolutionID,
          DecisionAnnouncementDateTime: createConvert(
            removeDashesFromDate(decisionDateTime.date) +
              RemoveTimeDashes(decisionDateTime.time)
          ),
          IsResolutionPublic: editResolutionData.IsResolutionPublic,
          FK_OrganizationID: JSON.parse(localStorage.getItem("organizationID")),
          FK_UID: JSON.parse(localStorage.getItem("userID")),
        },
      };
      dispatch(createResolution(navigate, Data, voters, t));
    }
  };

  const handleUpdateResolution = async () => {
    if (fileForSend.length > 0) {
      setsendStatus(1);
      // let newfiles = [...tasksAttachments];
      // let tasksAttachmentsData = [];
      // const uploadPromises = fileForSend.map((newData) => {
      //   // Return the promise from FileUploadToDo
      //   return dispatch(FileUploadToDo(navigate, newData, t, newfiles));
      // });

      // // Wait for all uploadPromises to resolve
      // await Promise.all(uploadPromises);
      // newfiles.map((attachmentData, index) => {
      //   tasksAttachmentsData.push({
      //     DisplayAttachmentName: attachmentData.DisplayAttachmentName,
      //     OriginalAttachmentName: attachmentData.OriginalAttachmentName,
      //   });
      // });
      let Data = {
        ResolutionModel: {
          FK_ResolutionStatusID: editResolutionData.FK_ResolutionStatusID,
          FK_ResolutionVotingMethodID:
            editResolutionData.FK_ResolutionVotingMethodID,
          Title: editResolutionData.Title,
          NotesToVoter: editResolutionData.NotesToVoter,
          CirculationDateTime: createConvert(
            removeDashesFromDate(circulationDateTime.date) +
              RemoveTimeDashes(circulationDateTime.time)
          ),
          DeadlineDateTime: createConvert(
            removeDashesFromDate(votingDateTime.date) +
              RemoveTimeDashes(votingDateTime.time)
          ),
          FK_ResolutionReminderFrequency_ID:
            editResolutionData.FK_ResolutionReminderFrequency_ID,
          FK_ResolutionDecision_ID: editResolutionData.FK_ResolutionDecision_ID,
          PK_ResolutionID: editResolutionData.pK_ResolutionID,
          DecisionAnnouncementDateTime: createConvert(
            removeDashesFromDate(decisionDateTime.date) +
              RemoveTimeDashes(decisionDateTime.time)
          ),
          IsResolutionPublic: editResolutionData.IsResolutionPublic,
          FK_OrganizationID: JSON.parse(localStorage.getItem("organizationID")),
          FK_UID: JSON.parse(localStorage.getItem("userID")),
        },
      };
      dispatch(createResolution(navigate, Data, voters, t));
    } else {
      setsendStatus(1);
      let Data = {
        ResolutionModel: {
          FK_ResolutionStatusID: editResolutionData.FK_ResolutionStatusID,
          FK_ResolutionVotingMethodID:
            editResolutionData.FK_ResolutionVotingMethodID,
          Title: editResolutionData.Title,
          NotesToVoter: editResolutionData.NotesToVoter,
          CirculationDateTime: createConvert(
            removeDashesFromDate(circulationDateTime.date) +
              RemoveTimeDashes(circulationDateTime.time)
          ),
          DeadlineDateTime: createConvert(
            removeDashesFromDate(votingDateTime.date) +
              RemoveTimeDashes(votingDateTime.time)
          ),
          FK_ResolutionReminderFrequency_ID:
            editResolutionData.FK_ResolutionReminderFrequency_ID,
          FK_ResolutionDecision_ID: editResolutionData.FK_ResolutionDecision_ID,
          PK_ResolutionID: editResolutionData.pK_ResolutionID,
          DecisionAnnouncementDateTime: createConvert(
            removeDashesFromDate(decisionDateTime.date) +
              RemoveTimeDashes(decisionDateTime.time)
          ),
          IsResolutionPublic: editResolutionData.IsResolutionPublic,
          FK_OrganizationID: JSON.parse(localStorage.getItem("organizationID")),
          FK_UID: JSON.parse(localStorage.getItem("userID")),
        },
      };
      dispatch(createResolution(navigate, Data, voters, t));
    }
  };

  const createResolutionHandleClick = async (id) => {
    if (
      editResolutionData.Title !== "" &&
      circulationDateTime.date !== "" &&
      decisionDateTime.date !== "" &&
      decisionDateTime.date !== "" &&
      circulationDateTime.time !== "" &&
      decisionDateTime.time !== "" &&
      editResolutionData.NotesToVoter !== "" &&
      editResolutionData.FK_ResolutionVotingMethodID !== 0 &&
      editResolutionData.FK_ResolutionReminderFrequency_ID !== 0
    ) {
      if (id === 1) {
        setResolutionupdate(true);
        setResolutionCirculate(false);
      } else {
        if (id === 2 && Object.keys(voters).length <= 0) {
          setError(true);
          setVoter(true);
          setNonVoter(false);
        } else {
          setResolutionupdate(false);
          setResolutionCirculate(true);
        }
      }
    } else {
      setError(true);
      setOpen({
        flag: true,
        message: t("Please-fill-all-the-fields"),
      });
    }
  };

  const documentsUploadCall = async (folderID) => {
    let newfile = [...tasksAttachments];

    let fileObj = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsResolutionApi(navigate, t, newData, folderID, fileObj)
        );
      });

      // Wait for all promises to resolve
      await Promise.all(uploadPromises);
      await dispatch(
        saveFilesResolutionApi(navigate, t, fileObj, folderID, newfile)
      );
    }

    await dispatch(
      updateResolution(
        navigate,
        editResolutionData.pK_ResolutionID,
        voters,
        nonVoter,
        newfile,
        t,
        sendStatus
      )
    );
  };

  useEffect(() => {
    if (ResolutionReducer.updateResolutionDataroom !== 0) {
      let folderIDCreated = ResolutionReducer.updateResolutionDataroom;
      documentsUploadCall(folderIDCreated);
    }
  }, [ResolutionReducer.updateResolutionDataroom]);

  const handleChangeChecker = (e, checked) => {
    setEditResolutionData({
      ...editResolutionData,
      IsResolutionPublic: e.target.checked,
    });
  };

  // Resolution Voting Method ID
  const detailDropDownhandler = (e) => {
    setEditResolutionData({
      ...editResolutionData,
      FK_ResolutionVotingMethodID: e.value,
    });
    setVotingMethodValue({
      label: e.label,
      value: e.value,
    });
  };

  // title and description change Handler
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "ResolutionTitle") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setEditResolutionData({
          ...editResolutionData,
          Title: valueCheck,
        });
      } else {
        setEditResolutionData({
          ...editResolutionData,
          Title: "",
        });
      }
    }
    if (name === "ResolutionDescription") {
      // let valueCheck = value.replace(/[^a-zA-Z0-9!@#$%^&*() ]/g, "");
      if (value !== "") {
        setEditResolutionData({
          ...editResolutionData,
          NotesToVoter: value,
        });
      } else {
        setEditResolutionData({
          ...editResolutionData,
          NotesToVoter: "",
        });
      }
    }
  };

  const handleClickCancelResolution = () => {
    if (cancelResolutionID !== 0) {
      dispatch(
        cancelResolutionApi(
          navigate,
          cancelResolutionID,
          t,
          setResolutioncancel,
          setCancelresolution
        )
      );
    }
  };

  const handleDiscardBtnFunc = () => {
    setDsicardresolution(false);
    let resolutionData = ResolutionReducer.getResolutionbyID.resolution;
    let votersResolutionMembers = ResolutionReducer.getResolutionbyID.voters;
    let nonVotersResolutionMembers =
      ResolutionReducer.getResolutionbyID.nonVoters;
    let attachmentsResolution = ResolutionReducer.getResolutionbyID.attachments;
    setEditResolutionData({
      FK_ResolutionStatusID: resolutionData.fK_ResolutionDecision_ID,
      FK_ResolutionVotingMethodID: resolutionData.fK_ResolutionVotingMethodID,
      Title: resolutionData.title,
      NotesToVoter: resolutionData.notesToVoter,
      CirculationDateTime: "",
      DeadlineDateTime: "",
      FK_ResolutionReminderFrequency_ID:
        resolutionData.fK_ResolutionReminderFrequency_ID,
      FK_ResolutionDecision_ID: resolutionData.fK_ResolutionDecision_ID,
      DecisionAnnouncementDateTime: "",
      IsResolutionPublic: resolutionData.isResolutionPublic,
      pK_ResolutionID: resolutionData.pK_ResolutionID,
      ResolutionStatus: resolutionData.status,
    });
    reminderData
      .filter(
        (data, index) =>
          data.value === resolutionData.fK_ResolutionReminderFrequency_ID
      )
      .map((reminderData, index) => {
        setReminderFrequencyValue({
          label: reminderData.label,
          value: reminderData.value,
        });
      });
    votingMethods
      .filter(
        (data, index) =>
          data.value === resolutionData.fK_ResolutionVotingMethodID
      )
      .map((methodData, index) => {
        setVotingMethodValue({
          label: methodData.label,
          value: methodData.value,
        });
      });
    setCirculationDateTime({
      date: editResolutionDate(resolutionData.circulationDateTime),
      time: editResolutionTime(resolutionData.circulationDateTime),
      dateValue: moment(
        utcConvertintoGMT(resolutionData.circulationDateTime)
      ).format("DD/MM/YYYY"),
    });
    setVotingDateTime({
      date: editResolutionDate(resolutionData?.votingDeadline),
      time: editResolutionTime(resolutionData?.votingDeadline),
      dateValue: moment(
        utcConvertintoGMT(resolutionData?.votingDeadline)
      ).format("DD/MM/YYYY"),
    });
    setDecisionDateTime({
      date: editResolutionDate(resolutionData.decisionAnnouncementDateTime),
      time: editResolutionTime(resolutionData.decisionAnnouncementDateTime),
      dateValue: moment(
        utcConvertintoGMT(resolutionData.decisionAnnouncementDateTime)
      ).format("DD/MM/YYYY"),
    });
    if (attachmentsResolution.length > 0) {
      let atCH = [];
      let newData = [];
      attachmentsResolution.map((data, index) => {
        atCH.push({
          DisplayAttachmentName: data.DisplayAttachmentName,
          OriginalAttachmentName: data.OriginalAttachmentName,
          pK_FileID: data.pK_FileID,
        });
        newData.push({
          displayAttachmentName: data.displayAttachmentName,
          originalAttachmentName: data.originalAttachmentName,
          pK_FileID: data.pK_FileID,
        });
      });
      setAttachments(newData);
      setTasksAttachments(atCH);
      // }
    }
    if (votersResolutionMembers.length > 0) {
      let viewVoter = [];
      let sendVoter = [];
      votersResolutionMembers.map((voterMember, index) => {
        meetingAttendeesList
          .filter(
            (assigneeData, index) => assigneeData.pK_UID === voterMember.fK_UID
          )
          .map((data, index) => {
            sendVoter.push({
              FK_UID: data.pK_UID,
              FK_VotingStatus_ID: 3,
              Notes: "",
              Email: data.emailAddress,
            });
            viewVoter.push(data);
          });
        setVoters(sendVoter);
        setVotersForView(viewVoter);
      });
    }
    if (nonVotersResolutionMembers.length > 0) {
      let viewVoter = [];
      let sendVoter = [];
      nonVotersResolutionMembers.map((voterMember, index) => {
        meetingAttendeesList
          .filter(
            (assigneeData, index) => assigneeData.pK_UID === voterMember.fK_UID
          )
          .map((data, index) => {
            sendVoter.push({
              FK_UID: data.pK_UID,
              FK_VotingStatus_ID: 3,
              Notes: "",
              Email: data.emailAddress,
            });
            viewVoter.push(data);
          });
        setNonVoters(sendVoter);
        setNonVotersForView(viewVoter);
      });
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

  useEffect(() => {
    if (
      ResolutionReducer.ResponseMessage !== "" &&
      ResolutionReducer.ResponseMessage !== t("Data-available")
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

  useEffect(() => {
    dispatch(getAllVotingMethods(navigate, t));
    dispatch(getAllResolutionStatus(navigate, t));
    dispatch(allAssignessList(navigate, t));
  }, []);

  useEffect(() => {
    try {
      if (ResolutionReducer.getResolutionbyID !== null) {
        let resolutionData = ResolutionReducer.getResolutionbyID.resolution;
        let votersResolutionMembers =
          ResolutionReducer.getResolutionbyID.voters;
        let nonVotersResolutionMembers =
          ResolutionReducer.getResolutionbyID.nonVoters;
        let attachmentsResolution =
          ResolutionReducer.getResolutionbyID.attachments;
        setEditResolutionData({
          FK_ResolutionStatusID: resolutionData.fK_ResolutionStatusID,
          FK_ResolutionVotingMethodID:
            resolutionData.fK_ResolutionVotingMethodID,
          Title: resolutionData.title,
          NotesToVoter: resolutionData.notesToVoter,
          CirculationDateTime: "",
          DeadlineDateTime: "",
          FK_ResolutionReminderFrequency_ID:
            resolutionData.fK_ResolutionReminderFrequency_ID,
          FK_ResolutionDecision_ID: resolutionData.fK_ResolutionDecision_ID,
          DecisionAnnouncementDateTime: "",
          IsResolutionPublic: resolutionData.isResolutionPublic,
          pK_ResolutionID: resolutionData.pK_ResolutionID,
          ResolutionStatus: resolutionData.status,
        });
        reminderData
          .filter(
            (data, index) =>
              data.value === resolutionData.fK_ResolutionReminderFrequency_ID
          )
          .map((reminderData, index) => {
            setReminderFrequencyValue({
              label: reminderData.label,
              value: reminderData.value,
            });
          });
        votingMethods
          .filter(
            (data, index) =>
              data.value === resolutionData.fK_ResolutionVotingMethodID
          )
          .map((methodData, index) => {
            setVotingMethodValue({
              label: methodData.label,
              value: methodData.value,
            });
          });
        setCirculationDateTime({
          date: editResolutionDate(resolutionData.circulationDateTime),
          time: editResolutionTime(resolutionData.circulationDateTime),
          timeCirculationforView: editResolutionTimeView(
            resolutionData.circulationDateTime
          ),
          dateValue: moment(
            utcConvertintoGMT(resolutionData.circulationDateTime)
          ).format("DD/MM/YYYY"),
        });
        setVotingDateTime({
          date: editResolutionDate(resolutionData?.votingDeadline),
          time: editResolutionTime(resolutionData?.votingDeadline),
          timeVotingforView: editResolutionTimeView(
            resolutionData?.votingDeadline
          ),
          dateValue: moment(
            utcConvertintoGMT(resolutionData.votingDeadline)
          ).format("DD/MM/YYYY"),
        });
        setDecisionDateTime({
          date: editResolutionDate(resolutionData.decisionAnnouncementDateTime),
          time: editResolutionTime(resolutionData.decisionAnnouncementDateTime),
          timeDecisionforView: editResolutionTimeView(
            resolutionData.decisionAnnouncementDateTime
          ),
          dateValue: moment(
            utcConvertintoGMT(resolutionData.decisionAnnouncementDateTime)
          ).format("DD/MM/YYYY"),
        });
        if (attachmentsResolution.length > 0) {
          let atCH = [];

          let newData = [];
          attachmentsResolution.forEach((data, index) => {
            atCH.push({
              DisplayFileName: data.displayAttachmentName,
              DiskusFileName: data.originalAttachmentName,
              PK_FileID: data.pK_RAID,
            });
            newData.push({
              displayAttachmentName: data.displayAttachmentName,
              originalAttachmentName: data.originalAttachmentName,
              PK_FileID: data.pK_RAID,
            });
          });
          setAttachments(newData);
          setTasksAttachments(atCH);
          // }
        }
        if (
          votersResolutionMembers.length > 0 &&
          Object.keys(meetingAttendeesList).length > 0
        ) {
          let vTrs = [];
          let vTrsVie = [];
          votersResolutionMembers.forEach((voterMember, index) => {
            meetingAttendeesList
              .filter(
                (assigneeData, index) =>
                  assigneeData.pK_UID === voterMember.fK_UID
              )
              .forEach((data, index) => {
                vTrs.push({
                  FK_UID: data.pK_UID,
                  FK_VotingStatus_ID: 3,
                  Notes: "",
                  Email: data.emailAddress,
                });
                vTrsVie.push(data);
              });
          });
          setVoters(vTrs);
          setVotersForView(vTrsVie);
          // }
        }
        if (nonVotersResolutionMembers.length > 0) {
          let nVtr = [];
          let nVtrVie = [];

          // if (nonVoterForView.length === 0 && nonVoter.length === 0) {
          nonVotersResolutionMembers.map((voterMember, index) => {
            meetingAttendeesList
              .filter(
                (assigneeData, index) =>
                  assigneeData.pK_UID === voterMember.fK_UID
              )
              .forEach((data, index) => {
                nVtr.push({
                  FK_UID: data.pK_UID,
                  FK_VotingStatus_ID: 3,
                  Notes: "",
                  Email: data.emailAddress,
                });
                nVtrVie.push(data);
              });
          });
          setNonVoters(nVtr);
          setNonVotersForView(nVtrVie);
          // }
        }
      }
    } catch (error) {}
  }, [ResolutionReducer.getResolutionbyID, meetingAttendeesList]);

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

  const handleChangeTimeSelection = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "circulation") {
      setCirculationDateTime({
        ...circulationDateTime,
        time: value,
      });
    } else if (name === "voting") {
      setVotingDateTime({
        ...votingDateTime,
        time: value,
      });
    } else if (name === "decision") {
      setDecisionDateTime({
        ...decisionDateTime,
        time: value,
      });
    }
  };

  //Circulation Time
  const handleCirculationTimeChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}:${minutes}`;

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
    if (date instanceof Date && !isNaN(date)) {
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);

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
    let newData = new Date(date);
    if (newData instanceof Date && !isNaN(newData)) {
      const hours = ("0" + newData.getHours()).slice(-2);
      const minutes = ("0" + newData.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}:${minutes}`;

      setDecisionDateTime({
        ...decisionDateTime,
        time: formattedTime,
        timeDecisionforView: date,
      });
    } else {
    }
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

  return (
    <>
      <section>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Resolution_create_heading"]}>
                  {t("Edit-resolution")}
                </span>
              </Col>
            </Row>

            <Paper className={styles["Create_new_resolution_paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={
                        editResolutionData.ResolutionStatus === "Circulated"
                          ? styles["Circulated_box_Edit"]
                          : styles["Draft_box_Edit"]
                      }
                    >
                      <span className={styles["Edit_draft_Tag"]}>
                        {editResolutionData.ResolutionStatus}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Row>
                        <Col lg={5} md={5} sm={12}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["Details_New_resolution"]}
                              >
                                {t("Details")}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="CreateMeetingInput  resolution-search-input "
                            >
                              <TextField
                                applyClass="form-control2"
                                type="text"
                                placeholder={t("Resolution-title")}
                                required={true}
                                value={editResolutionData.Title}
                                maxLength={300}
                                name="ResolutionTitle"
                                change={handleChange}
                              />
                            </Col>
                            <Row>
                              <Col>
                                <p
                                  className={
                                    editResolutionData.Title === "" && error
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
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="select-dropdowns-height FontArabicRegular"
                            >
                              <Select
                                name="Participant"
                                placeholder={t("Voting-method")}
                                className="select-voting-deadline"
                                value={{
                                  label: votingMethodValue.label,
                                  value: votingMethodValue.value,
                                }}
                                options={votingMethods}
                                isSearchable={false}
                                onChange={detailDropDownhandler}
                              />
                              <Row>
                                <Col>
                                  <p
                                    className={
                                      editResolutionData.FK_ResolutionVotingMethodID ===
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
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="select-dropdowns-height FontArabicRegular"
                            >
                              <Select
                                name=""
                                placeholder={t("Decision")}
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
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="CreateMeetingInput FontArabicRegular "
                            >
                              <TextField
                                applyClass="text-area-create-group"
                                type="text"
                                as={"textarea"}
                                rows="4"
                                placeholder={t("Notes-for-voters")}
                                value={editResolutionData.NotesToVoter}
                                required={true}
                                maxLength={500}
                                name="ResolutionDescription"
                                change={handleChange}
                              />

                              <Row>
                                <Col>
                                  <p
                                    className={
                                      editResolutionData.NotesToVoter === "" &&
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
                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Circulation_heading"]}>
                                {t("Circulation-date")}
                              </span>
                              <span style={{ color: "#F16B6B" }}>*</span>
                            </Col>
                          </Row>
                          <Row className="mt-0">
                            <Col
                              lg={6}
                              sm={6}
                              md={6}
                              className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                            >
                              <div className="datepicker ">
                                <DatePicker
                                  format={"DD/MM/YYYY"}
                                  minDate={currentDate}
                                  placeholder="YYYY-MM-DD"
                                  render={
                                    <InputIcon
                                      placeholder="DD/MM/YYYY"
                                      className={
                                        styles["Resolution_datePicker"]
                                      }
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
                            <Col
                              lg={6}
                              sm={6}
                              md={6}
                              className="CreateMeetingReminder resolution-search-input FontArabicRegular"
                            >
                              {/* <TextFieldTime
                                type="time"
                                name="circulation"
                                labelClass="d-none"
                                onKeyDown={(e) => e.preventDefault()}
                                applyClass={"search_voterInput"}
                                value={circulationDateTime.time}
                                change={(e) => {
                                  handleChangeTimeSelection(e);
                                }}
                              /> */}
                              <DatePicker
                                arrowClassName="arrowClass"
                                containerClassName="containerClassTimePicker"
                                className="timePicker"
                                disableDayPicker
                                inputClass="inputTImeMeeting"
                                calendar={calendarValue}
                                locale={localValue}
                                editable={false}
                                format="hh:mm A"
                                plugins={[<TimePicker hideSeconds />]}
                                render={<CustomInput />}
                                selected={
                                  circulationDateTime.timeCirculationforView
                                }
                                value={
                                  circulationDateTime.timeCirculationforView
                                }
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
                            <Col
                              lg={6}
                              sm={6}
                              md={6}
                              className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                            >
                              <div className="datepicker">
                                <DatePicker
                                  format={"DD/MM/YYYY"}
                                  minDate={
                                    circulationDateTime.date !== ""
                                      ? dateformatYYYYMMDD(
                                          circulationDateTime.date
                                        )
                                      : currentDate
                                  }
                                  render={
                                    <InputIcon
                                      placeholder="DD/MM/YYYY"
                                      className={
                                        styles["Resolution_datePicker"]
                                      }
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
                            <Col
                              lg={6}
                              sm={6}
                              md={6}
                              className="CreateMeetingReminder  resolution-search-input FontArabicRegular"
                            >
                              {/* <TextField
                                type="time"
                                labelClass="d-none"
                                name="voting"
                                onKeyDown={(e) => e.preventDefault()}
                                applyClass={"search_voterInput"}
                                value={votingDateTime.time}
                                change={(e) => {
                                  handleChangeTimeSelection(e);
                                }}
                              /> */}
                              <DatePicker
                                arrowClassName="arrowClass"
                                containerClassName="containerClassTimePicker"
                                className="timePicker"
                                disableDayPicker
                                inputClass="inputTImeMeeting"
                                calendar={calendarValue}
                                locale={localValue}
                                format="hh:mm A"
                                editable={false}
                                plugins={[<TimePicker hideSeconds />]}
                                render={<CustomInput />}
                                selected={votingDateTime.timeVotingforView}
                                value={votingDateTime.timeVotingforView}
                                onChange={(date) =>
                                  handleVotingTimeChange(date)
                                }
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
                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles[
                                    "decision_annoucement_Createresoulution"
                                  ]
                                }
                              >
                                {t("Decision-announcement")}
                              </span>
                              <span style={{ color: "#F16B6B" }}>*</span>
                            </Col>
                          </Row>
                          <Row className="mt-0">
                            <Col
                              lg={6}
                              sm={6}
                              md={6}
                              className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                            >
                              <div className="datepicker">
                                <DatePicker
                                  format={"DD/MM/YYYY"}
                                  minDate={
                                    votingDateTime.date !== ""
                                      ? dateformatYYYYMMDD(votingDateTime.date)
                                      : currentDate
                                  }
                                  placeholder="YYYY-MM-DD"
                                  render={
                                    <InputIcon
                                      placeholder="DD/MM/YYYY"
                                      className={
                                        styles["Resolution_datePicker"]
                                      }
                                    />
                                  }
                                  editable={false}
                                  className="datePickerTodoCreate2"
                                  onOpenPickNewDate={false}
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
                                    {t(
                                      "Decision-announcement-date-is-required"
                                    )}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                            <Col
                              lg={6}
                              sm={6}
                              md={6}
                              className="CreateMeetingReminder resolution-search-input FontArabicRegular "
                            >
                              {/* <TextField
                                type="time"
                                labelClass="d-none"
                                name="decision"
                                onKeyDown={(e) => e.preventDefault()}
                                applyClass={"search_voterInput"}
                                value={decisionDateTime.time}
                                change={(e) => {
                                  handleChangeTimeSelection(e);
                                }}
                              /> */}
                              <DatePicker
                                arrowClassName="arrowClass"
                                containerClassName="containerClassTimePicker"
                                className="timePicker"
                                disableDayPicker
                                inputClass="inputTImeMeeting"
                                calendar={calendarValue}
                                locale={localValue}
                                format="hh:mm A"
                                editable={false}
                                plugins={[<TimePicker hideSeconds />]}
                                render={<CustomInput />}
                                selected={decisionDateTime.timeDecisionforView}
                                value={decisionDateTime.timeDecisionforView}
                                onChange={(date) =>
                                  handleDecisionTimeChange(date)
                                }
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
                                    {t(
                                      "Decision-announcement-time-is-required"
                                    )}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Reminder"]}>
                                {t("Reminder-frequency")}
                              </span>
                              <span style={{ color: "#F16B6B" }}>*</span>
                            </Col>
                          </Row>
                          <Row className="mt-0">
                            <Col
                              lg={6}
                              md={6}
                              sm={12}
                              className="CreateMeetingReminder select-dropdowns-height FontArabicRegular "
                            >
                              <Select
                                name="Participant"
                                placeholder={t("Time")}
                                className="select-voting-deadline"
                                options={reminderData}
                                onChange={ReminderChangeHandler}
                                value={{
                                  value: ReminderFrequncyValue.value,
                                  label: ReminderFrequncyValue.label,
                                }}
                              />
                              <Row>
                                <Col>
                                  <p
                                    className={
                                      ReminderFrequncyValue.value === 0 && error
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
                          <Row className="mt-2">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["CheckBoxalign"]}
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
                                      editResolutionData.IsResolutionPublic
                                    }
                                    label2Class={
                                      styles["Class_for_label_Edit_resolution"]
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
                          <span
                            className={styles["line_Editresolution"]}
                          ></span>
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
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                {isVoter ? (
                                  <>
                                    <Row>
                                      <Col
                                        lg={5}
                                        md={5}
                                        sm={5}
                                        className="CreateMeetingInput resolution-search-input "
                                      >
                                        <InputSearchFilter
                                          placeholder={t("Add-attendees")}
                                          className="taskassignee"
                                          value={taskAssignedToInput}
                                          applyClass={"search_voterInput"}
                                          filteredDataHandler={searchFilterHandler(
                                            taskAssignedToInput
                                          )}
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
                                        className="CreateMeetingInput resolution-search-input"
                                      >
                                        <TextField
                                          applyClass="text-area-create-group"
                                          type="text"
                                          placeholder={t("Email")}
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
                                            styles[
                                              "ADD_Button_Createresolution"
                                            ]
                                          }
                                          onClick={addVoters}
                                        />
                                      </Col>
                                    </Row>

                                    <Row className="mt-3">
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
                                            ? votersForView.map(
                                                (data, index) => {
                                                  return (
                                                    <>
                                                      <Col
                                                        lg={6}
                                                        md={6}
                                                        sm={6}
                                                        className="mt-2"
                                                      >
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                          >
                                                            <EmployeeinfoCard
                                                              Employeename={
                                                                data?.name
                                                              }
                                                              Employeeemail={
                                                                data?.emailAddress
                                                              }
                                                              EmployeePic={
                                                                data?.displayProfilePictureName
                                                              }
                                                              Icon={
                                                                <img
                                                                  src={
                                                                    CrossIcon
                                                                  }
                                                                  alt=""
                                                                  width="18px"
                                                                  height="18px"
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
                                                }
                                              )
                                            : null}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </>
                                ) : isNonVoter ? (
                                  <>
                                    <Row>
                                      <Col
                                        lg={5}
                                        md={5}
                                        sm={5}
                                        className="CreateMeetingInput resolution-search-input "
                                      >
                                        <InputSearchFilter
                                          placeholder={t("Add-attendees")}
                                          className="taskassignee"
                                          value={taskAssignedToInput}
                                          filteredDataHandler={searchFilterHandler(
                                            taskAssignedToInput
                                          )}
                                          change={onChangeSearch}
                                          applyClass={"search_voterInput"}
                                          onclickFlag={onclickFlag}
                                        />
                                        {/* <Row>
                                        <Col>
                                          <p
                                            className={
                                              nonVoter.length === 0 && error
                                                ? ` ${styles["errorMessage"]}`
                                                : `${styles["errorMessage_hidden"]}`
                                            }
                                          >
                                            {t("At-least-add-one-voter")}
                                          </p>
                                        </Col>
                                      </Row> */}
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
                                            styles[
                                              "ADD_Button_Createresolution"
                                            ]
                                          }
                                          onClick={addNonVoter}
                                        />
                                      </Col>
                                    </Row>
                                    <Row className="mt-3">
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
                                            ? nonVoterForView.map(
                                                (data, index) => {
                                                  return (
                                                    <>
                                                      <Col
                                                        lg={6}
                                                        md={6}
                                                        sm={6}
                                                        className="mt-2"
                                                      >
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                          >
                                                            <EmployeeinfoCard
                                                              Employeename={
                                                                data?.name
                                                              }
                                                              Employeeemail={
                                                                data?.emailAddress
                                                              }
                                                              EmployeePic={
                                                                data?.displayProfilePictureName
                                                              }
                                                              Icon={
                                                                <img
                                                                  src={
                                                                    CrossIcon
                                                                  }
                                                                  alt=""
                                                                  width="18px"
                                                                  height="18px"
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
                                                }
                                              )
                                            : null}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </>
                                ) : null}

                                <Row>
                                  <Col lg={12} md={12} sm={12} className="mt-3">
                                    <span
                                      className={
                                        styles["Attachments_resolution"]
                                      }
                                    >
                                      {t("Attachments")}
                                    </span>
                                  </Col>
                                </Row>
                                <Row
                                  className={
                                    styles["edit_resolution_attachments"]
                                  }
                                >
                                  {attachments.length > 0 && (
                                    <Col
                                      className={styles["attachments_height"]}
                                      sm={12}
                                      md={12}
                                      lg={12}
                                    >
                                      <Row>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={1}
                                          className="mt-4"
                                        >
                                          {attachments.length > 6 ? (
                                            <>
                                              <Button
                                                icon={
                                                  <img
                                                    alt=""
                                                    src={Leftploygon}
                                                    width="20px"
                                                    height="15px"
                                                  />
                                                }
                                                onClick={SlideLeft}
                                                className={
                                                  styles["Leftpolygon"]
                                                }
                                                draggable="false"
                                              />
                                            </>
                                          ) : null}
                                        </Col>

                                        <Col sm={10} lg={10} md={10}>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="Scroller-x-resolution"
                                              id="Slider"
                                            >
                                              {attachments.length > 0
                                                ? attachments.map(
                                                    (data, index) => {
                                                      console.log(
                                                        data,
                                                        "attachmentsResolution"
                                                      );
                                                      var ext =
                                                        data?.displayAttachmentName
                                                          ?.split(".")
                                                          .pop();
                                                      const first =
                                                        data?.displayAttachmentName?.split(
                                                          " "
                                                        )[0];
                                                      return (
                                                        <Col
                                                          sm={12}
                                                          lg={2}
                                                          md={2}
                                                          className="modaltodolist-attachment-icon"
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
                                                              type={
                                                                "spreadsheet"
                                                              }
                                                              size={78}
                                                              labelColor={
                                                                "rgba(16, 121, 63)"
                                                              }
                                                            />
                                                          ) : ext === "xlsx" ? (
                                                            <FileIcon
                                                              extension={"xls"}
                                                              type={
                                                                "spreadsheet"
                                                              }
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
                                                              src={
                                                                deleteButtonCreateMeeting
                                                              }
                                                              width={15}
                                                              alt=""
                                                              height={15}
                                                              onClick={() =>
                                                                deleteFilefromAttachments(
                                                                  data,
                                                                  index
                                                                )
                                                              }
                                                              draggable="false"
                                                            />
                                                          </span>
                                                          <p
                                                            className="modaltodolist-attachment-text  FontArabicRegular"
                                                            title={
                                                              data.displayAttachmentName
                                                            }
                                                          >
                                                            {first}
                                                          </p>
                                                        </Col>
                                                      );
                                                    }
                                                  )
                                                : null}
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={1}
                                          className="mt-4"
                                        >
                                          {attachments.length > 6 ? (
                                            <>
                                              <Button
                                                icon={
                                                  <img
                                                    src={Rightploygon}
                                                    width="20px"
                                                    height="15px"
                                                    alt=""
                                                    draggable="false"
                                                  />
                                                }
                                                onClick={Slideright}
                                                className={
                                                  styles["Leftpolygon"]
                                                }
                                              />
                                            </>
                                          ) : null}
                                        </Col>
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
                                            alt=""
                                            draggable="false"
                                          />
                                        </span>
                                      </p>
                                      <p className={styles["ant-upload-text"]}>
                                        {t("Drag-&-drop-or")}
                                        <span
                                          className={
                                            styles["Choose_file_style"]
                                          }
                                        >
                                          {t("Choose-file")} {""}
                                        </span>
                                        <span className={styles["here_text"]}>
                                          {t("Here")}
                                        </span>
                                      </p>
                                    </Dragger>
                                  </Col>
                                </Row>
                                {/* <Row className="mt-3">
                               
                              </Row> */}
                                {/* {isVoter ?
                          <> */}
                                <Row className="mt-3">
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex justify-content-end gap-3"
                                  >
                                    <Button
                                      text={
                                        currentLanguage === "ar" ? (
                                          <ArrowRight size={30} color="#fff" />
                                        ) : (
                                          <ArrowLeft size={30} color="#fff" />
                                        )
                                      }
                                      onClick={() => {
                                        dispatch(updateResolutionModal(false));
                                      }}
                                      className={
                                        styles["Go_Back_EditResolution"]
                                      }
                                    />
                                    <Button
                                      text={t("Cancel-resolution")}
                                      className={
                                        styles["Cancel_button_Createresolution"]
                                      }
                                      onClick={() =>
                                        resolutioncancell(
                                          editResolutionData.pK_ResolutionID
                                        )
                                      }
                                    />
                                    <Button
                                      text={t("Discard")}
                                      className={
                                        styles[
                                          "Discard_button_Createresolution"
                                        ]
                                      }
                                      onClick={resolutiondiscard}
                                    />

                                    <Button
                                      text={t("Update")}
                                      className={
                                        styles["Update_button_Createresolution"]
                                      }
                                      onClick={() =>
                                        createResolutionHandleClick(1)
                                      }
                                    />

                                    <Button
                                      text={t("Circulate")}
                                      className={
                                        styles[
                                          "circulate_button_Createresolution"
                                        ]
                                      }
                                      onClick={() =>
                                        createResolutionHandleClick(2)
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </>
                        </Col>
                      </Row>
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
          handleCancelResolution={handleClickCancelResolution}
        />
      ) : null}
      {resolutionupdate ? (
        <ModalUpdateresolution
          updateresolution={resolutionupdate}
          setUpdateresolution={setResolutionupdate}
          handleUpdateResolution={handleUpdateResolution}
        />
      ) : null}
      {resolutionCirculate ? (
        <MOdalResolutionCirculated
          circulateresolution={resolutionCirculate}
          setcirculateresolution={setResolutionCirculate}
          handleCirculateResolution={handleCirculateResolution}
        />
      ) : null}
      {discardresolution ? (
        <ModalDiscardResolution
          discardresolution={discardresolution}
          setDiscardresolution={setDsicardresolution}
          handleDiscardBtn={handleDiscardBtnFunc}
        />
      ) : null}
      {resolutionUpdateSuccessfully && (
        <ModalResolutionUpdated
          resolutionupdated={resolutionUpdateSuccessfully}
          setResolutionupdated={setResolutionUpdateSuccessfully}
        />
      )}
      <Notification message={open.message} setOpen={setOpen} open={open.flag} />
    </>
  );
};

export default EditResolution;
