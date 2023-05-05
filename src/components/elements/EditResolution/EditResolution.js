import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styles from "./EditResolution.module.css";
import line from "../../../assets/images/line.png";
import FileIcon, { defaultStyles } from "react-file-icon";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";
import userImage from "../../../assets/images/user.png";
import { FileUploadToDo } from "../../../store/actions/Upload_action";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import { UploadProps } from "antd";
import featherupload from "../../../assets/images/featherupload.svg";
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
import ModalDiscardResolution from "../../../container/ModalDiscardResolution/ModalDiscardResolution";
import EmployeeinfoCard from "../Employeeinfocard/EmployeeinfoCard";
import {
  createResolution,
  getAllResolutionStatus,
  getAllVotingMethods,
  cancelResolutionApi,
  closeResolutionApi,
} from "../../../store/actions/Resolution_actions";
import moment from "moment";
import {
  createConvert,
  createResolutionDateTime,
  editResolutionDate,
  editResolutionTime,
  removeDashesFromDate,
  RemoveTimeDashes,
} from "../../../commen/functions/date_formater";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
const EditResolution = ({
  setEditResoutionPage,
  editresolutionPage,
  setNewresolution,
}) => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ResolutionReducer, assignees, uploadReducer } = useSelector(
    (state) => state
  );
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [resolutionID, setResolutionID] = useState(0);
  console.log(
    ResolutionReducer,
    uploadReducer.uploadDocumentsList,
    meetingAttendeesList,
    "ResolutionReducerResolutionReducerResolutionReducer"
  );
  const [isVoter, setVoter] = useState(true);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [votingMethods, setVotingMethods] = useState([]);
  const [decision, setDecision] = useState({
    label: "Pending",
    value: 1,
  });
  const [voters, setVoters] = useState([]);
  const [nonVoter, setNonVoters] = useState([]);
  const [votersForView, setVotersForView] = useState([]);
  const [nonVoterForView, setNonVotersForView] = useState([]);
  const [VoterName, setVoterName] = useState("");
  const [VoterID, setVoterID] = useState(0);
  const [isVoterModalRemove, setVoterModalRemove] = useState(false);
  const [isNonVoterModalRemove, setNonVoterModalRemove] = useState(false);
  console.log(
    voters,
    votersForView,
    nonVoter,
    nonVoterForView,
    "nonVoterForViewnonVoterForViewnonVoterForView"
  );
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
  console.log("votingMethodsvotingMethods", votingMethods);
  //Attendees States
  const [circulationDateTime, setCirculationDateTime] = useState({
    date: "",
    time: "",
  });
  const [votingDateTime, setVotingDateTime] = useState({
    date: "",
    time: "",
  });
  const [decisionDateTime, setDecisionDateTime] = useState({
    date: "",
    time: "",
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
  const [resolutionupdate, setResolutionupdate] = useState(false);
  const [discardresolution, setDsicardresolution] = useState(false);
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [editResolutionData, setEditResolutionData] = useState({
    FK_ResolutionStatusID: 0,
    FK_ResolutionVotingMethodID: 0,
    Title: "",
    Description: "",
    NotesToVoter: "",
    CirculationDateTime: "",
    DeadlineDateTime: "",
    FK_ResolutionReminderFrequency_ID: 0,
    FK_ResolutionDecision_ID: 3,
    DecisionAnnouncementDateTime: "",
    IsResolutionPublic: false,
    pK_ResolutionID: 0,
    ResolutionStatus: "",
  });

  const ShowVoter = () => {
    setVoter(true);
    setNonVoter(false);
  };

  const ShowNonVoters = () => {
    setVoter(false);
    setNonVoter(true);
  };

  const resolutiondiscard = () => {
    setDsicardresolution(true);
  };

  const reslotionupdatemodal = () => {
    setResolutionupdate(true);
  };

  const resolutioncancell = () => {
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
    console.log(
      "votingMethodsvotingMethods",
      findIndexVoter,
      findIndexFromSendData
    );
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
    console.log(
      "votingMethodsvotingMethods",
      findIndexVoter,
      findIndexFromSendData
    );
  };

  useEffect(() => { }, []);
  //On Click Of Dropdown Value
  const onSearch = (name, id) => {
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
    console.log("idididid", id);
    if (meetingAttendeesList.length > 0) {
      let findAttendeeEmail = meetingAttendeesList.find(
        (data, index) => data.pK_UID === id
      );
      setEmailValue(findAttendeeEmail.emailAddress);
      console.log(
        "findAttendeeEmailfindAttendeeEmail",
        findAttendeeEmail.emailAddress
      );
    }
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    console.log(e.target.value, "eeeeeeee");
    setTaskAssignedToInput(e.target.value.trimStart());
    // setEmailValue
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
  const searchFilterHandler = (value) => {
    let allAssignees = assignees.user;
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
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
    }
  };

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments;
    searchIndex.splice(index, 1);
    setTasksAttachments([...tasksAttachments]);
  };

  const addVoters = () => {
    let findVoter = voters.findIndex(
      (data, index) => data.FK_UID === taskAssignedTo
    );
    console.log(
      "findVoterfindVoterfindVoterfindVoter",
      findVoter,
      voters,
      taskAssignedTo
    );
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
        message: "this Voter already Exist",
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
    console.log(
      "findVoterfindVoterfindVoterfindVoter",
      findVoter,
      nonVoter,
      taskAssignedTo
    );
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
        message: "this Voter already Exist",
      });
    }

    setTaskAssignedToInput("");
    setTaskAssignedTo(0);
    setTaskAssignedName("");
    setEmailValue("");
  };

  const createResolutionHandleClick = (id) => {
    if (
      editResolutionData.Title !== "" &&
      circulationDateTime.date !== "" &&
      decisionDateTime.date !== "" &&
      decisionDateTime.date !== "" &&
      circulationDateTime.time !== "" &&
      decisionDateTime.time !== ""
    ) {
      let Data = {
        ResolutionModel: {
          FK_ResolutionStatusID: editResolutionData.FK_ResolutionStatusID,
          FK_ResolutionVotingMethodID:
            editResolutionData.FK_ResolutionVotingMethodID,
          Title: editResolutionData.Title,
          NotesToVoter: editResolutionData.NotesToVoter,
          CirculationDateTime: createConvert(removeDashesFromDate(
            circulationDateTime.date
          ) + RemoveTimeDashes(
            circulationDateTime.time
          )
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
            RemoveTimeDashes(decisionDateTime.time)),
          IsResolutionPublic: editResolutionData.IsResolutionPublic,
          FK_OrganizationID: JSON.parse(localStorage.getItem("organizationID")),
          FK_UID: JSON.parse(localStorage.getItem("userID")),
        },
      };
      console.log(Data, "DataDataDataDataDataDataData");
      dispatch(
        createResolution(
          Data,
          voters,
          nonVoter,
          tasksAttachments,
          setNewresolution,
          setEditResoutionPage,
          t,
          2,
          id
        )
      );
    }
  };

  const props = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    showUploadList: false,
    onChange(data) {
      console.log(data, "daatadaad");
      const { status } = data.file;

      dispatch(FileUploadToDo(data.file.originFileObj, t));
      // setTasksAttachments(data.fileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest() { },
  };

  // Check is Resolution Checker Handler
  const handleChangeChecker = (e, checked) => {
    console.log(e.target.checked, checked, "testing1212");
    setEditResolutionData({
      ...editResolutionData,
      IsResolutionPublic: e.target.checked,
    });
  };

  // Resolution Voting Method ID
  const detailDropDownhandler = (e) => {
    console.log(" handleChangehandleChangehandleChangehandleChange", e);

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
    console.log("handleChangehandleChangehandleChange", name, value);
    if (name === "ResolutionTitle") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
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
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setEditResolutionData({
          ...editResolutionData,
          NotesToVoter: valueCheck,
        });
      } else {
        setEditResolutionData({
          ...editResolutionData,
          NotesToVoter: "",
        });
      }
    }
  };

  const handleDiscardBtnFunc = () => {
    if (ResolutionReducer.getResolutionbyID !== null) {
      let resolutionData = ResolutionReducer.getResolutionbyID.resolution;
      let votersResolutionMembers = ResolutionReducer.getResolutionbyID.voters;
      let nonVotersResolutionMembers =
        ResolutionReducer.getResolutionbyID.nonVoters;
      let attachmentsResolution =
        ResolutionReducer.getResolutionbyID.attachments;
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
      console.log(
        "resolutionData",
        resolutionData.circulationDateTime.slice(0, 4)
      );
      setCirculationDateTime({
        date: editResolutionDate(resolutionData.circulationDateTime),
        time: editResolutionTime(resolutionData.circulationDateTime),
      });
      setVotingDateTime({
        date: editResolutionDate(resolutionData.deadlineDateTime),
        time: editResolutionTime(resolutionData.deadlineDateTime),
      });
      setDecisionDateTime({
        date: editResolutionDate(resolutionData.decisionAnnouncementDateTime),
        time: editResolutionTime(resolutionData.decisionAnnouncementDateTime),
      });
      if (attachmentsResolution.length > 0) {
        attachmentsResolution.map((data, index) => {
          tasksAttachments.push({
            DisplayAttachmentName: data.displayAttachmentName,
            OriginalAttachmentName: data.originalAttachmentName,
            pK_RAID: 7,
          });
          setTasksAttachments([...tasksAttachments]);
        });
      }
      if (votersResolutionMembers.length > 0) {
        votersResolutionMembers.map((voterMember, index) => {
          meetingAttendeesList
            .filter(
              (assigneeData, index) =>
                assigneeData.pK_UID === voterMember.fK_UID
            )
            .map((data, index) => {
              voters.push({
                FK_UID: data.pK_UID,
                FK_VotingStatus_ID: 3,
                Notes: "",
                Email: data.emailAddress,
              });
              votersForView.push(data);
            });
          setVoters([...voters]);
          setVotersForView([...votersForView]);
        });
      }
      if (nonVotersResolutionMembers.length > 0) {
        nonVotersResolutionMembers.map((voterMember, index) => {
          meetingAttendeesList
            .filter(
              (assigneeData, index) =>
                assigneeData.pK_UID === voterMember.fK_UID
            )
            .map((data, index) => {
              nonVoter.push({
                FK_UID: data.pK_UID,
                FK_VotingStatus_ID: 3,
                Notes: "",
                Email: data.emailAddress,
              });
              nonVoterForView.push(data);
            });
          setNonVoters([...nonVoter]);
          setNonVotersForView([...nonVoterForView]);
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
    } catch (error) { }
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
    setTasksAttachments([]);
  }, []);

  useEffect(() => {
    if (uploadReducer.uploadDocumentsList !== null) {
      tasksAttachments.push({
        DisplayAttachmentName:
          uploadReducer.uploadDocumentsList.displayFileName,
        OriginalAttachmentName:
          uploadReducer.uploadDocumentsList.originalFileName,
      });
      setTasksAttachments([...tasksAttachments]);
    }
  }, [uploadReducer.uploadDocumentsList]);

  useEffect(() => {
    dispatch(getAllVotingMethods(t));
    dispatch(getAllResolutionStatus(t));
    dispatch(allAssignessList(t));
  }, []);
  useEffect(() => {
    if (ResolutionReducer.getResolutionbyID !== null) {
      let resolutionData = ResolutionReducer.getResolutionbyID.resolution;
      let votersResolutionMembers = ResolutionReducer.getResolutionbyID.voters;
      let nonVotersResolutionMembers =
        ResolutionReducer.getResolutionbyID.nonVoters;
      let attachmentsResolution =
        ResolutionReducer.getResolutionbyID.attachments;
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
      console.log(
        "resolutionData",
        resolutionData.circulationDateTime.slice(0, 4)
      );
      let acac = editResolutionDate(resolutionData.circulationDateTime)
      console.log(
        "resolutionData", acac
      );
      setCirculationDateTime({
        date: editResolutionDate(resolutionData.circulationDateTime),
        time: editResolutionTime(resolutionData.circulationDateTime),
      });
      setVotingDateTime({
        date: editResolutionDate(resolutionData.deadlineDateTime),
        time: editResolutionTime(resolutionData.deadlineDateTime),
      });
      setDecisionDateTime({
        date: editResolutionDate(resolutionData.decisionAnnouncementDateTime),
        time: editResolutionTime(resolutionData.decisionAnnouncementDateTime),
      });
      if (attachmentsResolution.length > 0) {
        attachmentsResolution.map((data, index) => {
          tasksAttachments.push({
            DisplayAttachmentName: data.displayAttachmentName,
            OriginalAttachmentName: data.originalAttachmentName,
            pK_RAID: 7,
          });
          setTasksAttachments([...tasksAttachments]);
        });
      }
      if (votersResolutionMembers.length > 0) {
        votersResolutionMembers.map((voterMember, index) => {
          meetingAttendeesList
            .filter(
              (assigneeData, index) =>
                assigneeData.pK_UID === voterMember.fK_UID
            )
            .map((data, index) => {
              voters.push({
                FK_UID: data.pK_UID,
                FK_VotingStatus_ID: 3,
                Notes: "",
                Email: data.emailAddress,
              });
              votersForView.push(data);
            });
          setVoters([...voters]);
          setVotersForView([...votersForView]);
        });
      }
      if (nonVotersResolutionMembers.length > 0) {
        nonVotersResolutionMembers.map((voterMember, index) => {
          meetingAttendeesList
            .filter(
              (assigneeData, index) =>
                assigneeData.pK_UID === voterMember.fK_UID
            )
            .map((data, index) => {
              nonVoter.push({
                FK_UID: data.pK_UID,
                FK_VotingStatus_ID: 3,
                Notes: "",
                Email: data.emailAddress,
              });
              nonVoterForView.push(data);
            });
          setNonVoters([...nonVoter]);
          setNonVotersForView([...nonVoterForView]);
        });
      }
    }
  }, [ResolutionReducer.getResolutionbyID, meetingAttendeesList]);
  return (
    <>
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Resolution_create_heading"]}>
                  {t("Edit-resolution")}
                </span>
              </Col>
            </Row>
            <Paper className={styles["Create_new_resolution_paper"]}>
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
                    <Col lg={5} md={5} sm={5}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Details_New_resolution"]}>
                            {t("Details")}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput"
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
                      </Row>
                      <Row className="mt-3">
                        <Col lg={6} md={6} sm={6}>
                          <Select
                            name="Participant"
                            placeholder={t("Voting-deadline")}
                            className="select-voting-deadline"
                            value={{
                              label: votingMethodValue.label,
                              value: votingMethodValue.value,
                            }}
                            options={votingMethods}
                            isSearchable={false}
                            onChange={detailDropDownhandler}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={6}>
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
                          className="CreateMeetingInput "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            rows="4"
                            placeholder={t("Notes")}
                            value={editResolutionData.NotesToVoter}
                            required={true}
                            maxLength={500}
                            name="ResolutionDescription"
                            change={handleChange}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Circulation_heading"]}>
                            {t("Circulation")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <TextField
                            type="date"
                            labelClass="d-none"
                            value={circulationDateTime.date}
                            change={(e) => {
                              setCirculationDateTime({
                                ...circulationDateTime,
                                date: e.target.value,
                              });
                            }}
                          />
                        </Col>
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <TextField
                            type="time"
                            labelClass="d-none"
                            value={circulationDateTime.time}
                            change={(e) => {
                              setCirculationDateTime({
                                ...circulationDateTime,
                                time: e.target.value,
                              });
                            }}
                          />
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
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <TextField
                            type="date"
                            labelClass="d-none"
                            value={votingDateTime.date}
                            change={(e) => {
                              setVotingDateTime({
                                ...votingDateTime,
                                date: e.target.value,
                              });
                            }}
                          />
                        </Col>
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <TextField
                            type="time"
                            labelClass="d-none"
                            value={votingDateTime.time}
                            change={(e) => {
                              setVotingDateTime({
                                ...votingDateTime,
                                time: e.target.value,
                              });
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={
                              styles["decision_annoucement_Createresoulution"]
                            }
                          >
                            {t("Descision-announcement")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <TextField
                            type="date"
                            labelClass="d-none"
                            value={decisionDateTime.date}
                            change={(e) => {
                              setDecisionDateTime({
                                ...decisionDateTime,
                                date: e.target.value,
                              });
                            }}
                          />
                        </Col>
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <TextField
                            type="time"
                            labelClass="d-none"
                            value={decisionDateTime.time}
                            change={(e) => {
                              setDecisionDateTime({
                                ...decisionDateTime,
                                time: e.target.value,
                              });
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Reminder"]}>
                            {t("Reminder-frequency")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className="CreateMeetingReminder "
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
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="UpdateCheckbox  d-flex justify-content-start"
                        >
                          <Checkbox
                            className="SearchCheckbox MontserratSemiBold-600"
                            name="IsChat"
                            checked={editResolutionData.IsResolutionPublic}
                            label={t("Make-resolution-public")}
                            onChange={handleChangeChecker}
                            classNameDiv="checkboxParentClass"
                          ></Checkbox>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={1}
                      md={1}
                      sm={false}
                      className="d-flex justify-content-center"
                    >
                      <img src={line} height="586px" />
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
                                ? styles["Voters_Btn_Createresolution_Active"]
                                : styles["Voters_Btn_Createresolution"]
                            }
                            onClick={ShowVoter}
                          />
                          <Button
                            text={t("Non-voters")}
                            className={
                              isNonVoter
                                ? styles[
                                "Non_Voters_Btn_Createresolution_Active"
                                ]
                                : styles["Non_Voters_Btn_Createresolution"]
                            }
                            onClick={ShowNonVoters}
                          />
                        </Col>
                      </Row>
                      <>
                        <Col lg={12} md={12} sm={12}>
                          {isVoter ? (
                            <>
                              <Row className="mt-2">
                                <Col
                                  lg={5}
                                  md={5}
                                  sm={5}
                                  className="CreateMeetingInput "
                                >
                                  <InputSearchFilter
                                    placeholder={t("Add-attendees")}
                                    className="taskassignee"
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
                                  sm={5}
                                  className="CreateMeetingInput "
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
                                    text={t("ADD")}
                                    className={
                                      styles["ADD_Button_Createresolution"]
                                    }
                                    onClick={addVoters}
                                  />
                                </Col>
                              </Row>

                              <Row className="mt-5">
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
                                            <Col lg={6} md={6} sm={6}>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <EmployeeinfoCard
                                                    Employeename={data?.name}
                                                    Employeeemail={
                                                      data?.emailAddress
                                                    }
                                                    Icon={
                                                      <img
                                                        src={CrossIcon}
                                                        width="18px"
                                                        height="18px"
                                                        onClick={() =>
                                                          removeUserForVoter(
                                                            data.pK_UID,
                                                            data.name
                                                          )
                                                        }
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
                              <Row className="mt-2">
                                <Col
                                  lg={5}
                                  md={5}
                                  sm={5}
                                  className="CreateMeetingInput "
                                >
                                  <InputSearchFilter
                                    placeholder={t("Add-attendees")}
                                    className="taskassignee"
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
                                  sm={5}
                                  className="CreateMeetingInput "
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
                                    text={t("ADD")}
                                    className={
                                      styles["ADD_Button_Createresolution"]
                                    }
                                    onClick={addNonVoter}
                                  />
                                </Col>
                              </Row>
                              <Row className="mt-5">
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
                                            <Col lg={6} md={6} sm={6}>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <EmployeeinfoCard
                                                    Employeename={data?.name}
                                                    Employeeemail={
                                                      data?.emailAddress
                                                    }
                                                    Icon={
                                                      <img
                                                        src={CrossIcon}
                                                        width="18px"
                                                        height="18px"
                                                        onClick={() =>
                                                          removeUserForNonVoter(
                                                            data.pK_UID,
                                                            data.name
                                                          )
                                                        }
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

                          <Row className="mt-5">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["Attachments_resolution"]}
                              >
                                {t("Attachments")}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Row>
                                <Col
                                  sm={12}
                                  lg={12}
                                  md={12}
                                  className="todoModalCreateModal"
                                >
                                  {tasksAttachments.length > 0
                                    ? tasksAttachments.map((data, index) => {
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
                                          sm={12}
                                          lg={2}
                                          md={2}
                                          className="modaltodolist-attachment-icon"
                                        >
                                          <FileIcon
                                            extension={ext}
                                            size={78}
                                            labelColor={"rgba(97,114,214,1)"}
                                          // {...defaultStyles.ext}
                                          />
                                          <span className="deleteBtn">
                                            <img
                                              src={deleteButtonCreateMeeting}
                                              width={15}
                                              height={15}
                                              onClick={() =>
                                                deleteFilefromAttachments(
                                                  data,
                                                  index
                                                )
                                              }
                                            />
                                          </span>
                                          <p className="modaltodolist-attachment-text">
                                            {first}
                                          </p>
                                        </Col>
                                      );
                                    })
                                    : null}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                  <span>
                                    <img
                                      src={featherupload}
                                      width="18.87px"
                                      height="18.87px"
                                    />
                                  </span>
                                </p>
                                <p className="ant-upload-text">
                                  {t("Drag-&-drop-or")}
                                  <span> {t("Choose-file")} </span> {t("Here")}
                                </p>
                              </Dragger>
                            </Col>
                          </Row>
                          {/* {isVoter ?
                          <> */}
                          <Row className="mt-5">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end gap-3"
                            >
                              <Button
                                text={t("Cancel")}
                                className={
                                  styles["Save_button_Createresolution"]
                                }
                                onClick={resolutioncancell}
                              />
                              <Button
                                text={t("Discard")}
                                className={
                                  styles["Discard_button_Createresolution"]
                                }
                                onClick={resolutiondiscard}
                              />

                              <Button
                                text={t("Update")}
                                className={
                                  styles["Update_button_Createresolution"]
                                }
                                onClick={() => createResolutionHandleClick(1)}
                              />

                              <Button
                                text={t("Circulate")}
                                className={
                                  styles["circulate_button_Createresolution"]
                                }
                                onClick={() => createResolutionHandleClick(2)}
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
      </Container>
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
          handleDiscardBtn={handleDiscardBtnFunc}
        />
      ) : null}
      <Notification message={open.message} setOpen={setOpen} open={open.flag} />
    </>
  );
};

export default EditResolution;
