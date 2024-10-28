import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import styles from "./ScheduleNewResolution.module.css";
import { useDispatch, useSelector } from "react-redux";
import featherupload from "../../../assets/images/featherupload.svg";
import GroupIcon from "../../../assets/images/GroupSetting.svg";
import committeeicon from "../../../assets/images/committeedropdown.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { Upload } from "antd";
import {
  TextField,
  Button,
  Checkbox,
  Notification,
  AttachmentViewer,
} from "./../../../components/elements";
import { useState } from "react";
import ModalresolutionRemove from "../ModalresolutionRemove/ModalresolutionRemove";
import ModalCancellResolution from "../ModalCancellResolution/ModalCancellResolution";
import ModalDiscardResolution from "../ModalDiscardResolution/ModalDiscardResolution";
import EmployeeinfoCard from "../../../components/elements/Employeeinfocard/EmployeeinfoCard";
import {
  getAllVotingMethods,
  getAllResolutionStatus,
  createResolution,
  clearResponseMessage,
  createResolutionModal,
  uploadDocumentsResolutionApi,
  saveFilesResolutionApi,
  updateResolution,
  getAllGroupsandCommitteesforResolution,
} from "../../../store/actions/Resolution_actions";
import {
  createConvert,
  removeDashesFromDate,
  RemoveTimeDashes,
} from "../../../commen/functions/date_formater";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { validateInput } from "../../../commen/functions/regex";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  dateforSend,
  dateforView,
  timeforSend,
  timeforViewScheduleResolution,
} from "../../../commen/functions/time_formatter";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import { maxFileSize } from "../../../commen/functions/utils";

const ScheduleNewResolution = () => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const { ResolutionReducer } = useSelector((state) => state);
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [isVoter, setVoter] = useState(true);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [votingMethods, setVotingMethods] = useState([]);
  const [decision, setDecision] = useState({
    label: t("Decision-pending"),
    value: 1,
  });
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
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

  const [emailValue, setEmailValue] = useState("");
  const [isNonVoter, setNonVoter] = useState(false);
  const [resolutioncancel, setResolutioncancel] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [discardresolution, setDsicardresolution] = useState(false);
  const [tasksAttachments, setTasksAttachments] = useState([]);
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

  const [voterInfo, setVoterInfo] = useState({
    value: 0,
    label: "",
    type: 0,
  });

  const [nonVoterInfo, setNonVoterInfo] = useState({
    value: 0,
    label: "",
    type: 0,
  });

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
    dispatch(getAllVotingMethods(navigate, t, true));
    dispatch(getAllResolutionStatus(navigate, t, true));
    dispatch(getAllGroupsandCommitteesforResolution(navigate, t));
    return;
  }, []);

  const dateformatYYYYMMDD = (date) => {
    if (!!date && typeof date === "string") {
      return moment(date).add(1, "days").toDate();
    }
  };

  const ShowVoter = () => {
    setVoter(true);
    setNonVoter(false);
    setEmailValue("");
    setNonVoterInfo({
      ...nonVoterInfo,
      value: 0,
      label: "",
      type: 0,
    });
  };
  const ShowNonVoters = () => {
    setVoter(false);
    setNonVoter(true);
    setEmailValue("");
    setVoterInfo({
      ...voterInfo,
      value: 0,
      label: "",
      type: 0,
    });
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
    setVotersForView((prevVoterState) =>
      prevVoterState.filter((data, index) => data.userID !== VoterID)
    );
    setVoters((prevVoter) =>
      prevVoter.filter((data, index) => data.FK_UID !== VoterID)
    );

    setVoterID(0);
    setVoterName("");
    setVoterModalRemove(false);
  };

  const removeNonVoterInfo = () => {
    setNonVotersForView((prevNonVoterState) =>
      prevNonVoterState.filter((data, index) => data.userID !== VoterID)
    );
    setNonVoters((prevNonVoter) =>
      prevNonVoter.filter((data, index) => data.FK_UID !== VoterID)
    );

    setNonVoterModalRemove(false);
    setVoterID(0);
    setVoterName("");
  };

  const ReminderChangeHandler = (e) => {
    setCreateResolutionData({
      ...createResolutionData,
      FK_ResolutionReminderFrequency_ID: e.value,
    });
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
    let newOrganizersData = ResolutionReducer.getAllCommitteesAndGroups;
    let voters_Data = [...voters];
    let voters_DataView = [...votersForView];
    if (newOrganizersData !== null) {
      try {
        if (voterInfo.type === 1) {
          let { groups } = newOrganizersData;
          // find group data against the group ID which is user selected by the user
          let findGroupData = groups.find(
            (VoterGroupData) => VoterGroupData.groupID === voterInfo.value
          );
          // if group data finds
          if (findGroupData !== undefined) {
            // Filter out voters who do not exist in the findGroupData.groupUsers
            let checkIfExistInNonVoters = findGroupData.groupUsers.filter(
              (voterData) => {
                // Check if the user exists in non voters array
                let userExists = nonVoter.find(
                  (findData) => findData.FK_UID === voterData.userID
                );
                // Return only users who do not exist in voters array
                return !userExists;
              }
            );

            if (checkIfExistInNonVoters.length > 0) {
              // Filter out voters who do not exist in the findGroupData.groupUsers
              let checkIfExistInVoters = checkIfExistInNonVoters.filter(
                (voterData) => {
                  // Check if the user exists in voters array
                  let userExists = voters.find(
                    (findData) => findData.FK_UID === voterData.userID
                  );
                  // Return only users who do not exist in voters array
                  return !userExists;
                }
              );

              if (checkIfExistInVoters.length > 0) {
                checkIfExistInVoters.forEach((userData) => {
                  voters_Data.push({
                    FK_UID: userData.userID,
                    FK_VotingStatus_ID: 3,
                    Notes: "",
                    Email: userData.emailAddress,
                  });
                  voters_DataView.push(userData);
                });
              } else {
                showMessage(t("This-voter-already-exist"), "error", setOpen);
              }
            } else {
              showMessage(
                t("This-voter-is-already-exist-in-non-voter-list"),
                "error",
                setOpen
              );
            }
          }
        } else if (voterInfo.type === 2) {
          let { committees } = newOrganizersData;
          // find committee data against the committee ID which is user selected by the user

          let findCommitteeData = committees.find(
            (VoterCommitteeData) =>
              VoterCommitteeData.committeeID === voterInfo.value
          );
          // if committee finds
          if (findCommitteeData !== undefined) {
            // Filter out voters who do not exist in the findGroupData.groupUsers
            let checkIfExistInNonVoters =
              findCommitteeData.committeeUsers.filter((voterData) => {
                // Check if the user exists in voters array
                let userExists = nonVoter.find(
                  (findData) => findData.FK_UID === voterData.userID
                );
                // Return only users who do not exist in voters array
                return !userExists;
              });

            if (checkIfExistInNonVoters.length > 0) {
              // Filter out voters who do not exist in the findGroupData.groupUsers
              let checkIfExistInVoters = checkIfExistInNonVoters.filter(
                (voterData) => {
                  // Check if the user exists in voters array
                  let userExists = voters.find(
                    (findData) => findData.FK_UID === voterData.userID
                  );
                  // Return only users who do not exist in voters array
                  return !userExists;
                }
              );
              if (checkIfExistInVoters.length > 0) {
                checkIfExistInVoters.forEach((userData, index) => {
                  voters_Data.push({
                    FK_UID: userData.userID,
                    FK_VotingStatus_ID: 3,
                    Notes: "",
                    Email: userData.emailAddress,
                  });
                  voters_DataView.push(userData);
                });
              } else {
                showMessage(
                  t("User-already-exist-voter-list"),
                  "error",
                  setOpen
                );
              }
            } else {
              showMessage(
                t("User-already-exist-non-voter-list"),
                "error",
                setOpen
              );
            }
          }
        } else if (voterInfo.type === 3) {
          let { organizationUsers } = newOrganizersData;

          let isAlreadyExistInNonVoters = nonVoter.findIndex(
            (data) => data.FK_UID === voterInfo.value
          );
          let isAlreadyExistInVoters = voters.findIndex(
            (data) => data.FK_UID === voterInfo.value
          );

          if (isAlreadyExistInNonVoters === -1) {
            if (isAlreadyExistInVoters === -1) {
              if (organizationUsers.length > 0) {
                organizationUsers.forEach((voeterdata) => {
                  if (voeterdata.userID === voterInfo.value) {
                    voters_Data.push({
                      FK_UID: voeterdata.userID,
                      FK_VotingStatus_ID: 3,
                      Notes: "",
                      Email: voeterdata.emailAddress,
                    });
                    voters_DataView.push(voeterdata);
                  }
                });
              }
            } else {
              showMessage(
                t("This-user-already-exist-in-voter-list"),
                "error",
                setOpen
              );
            }
          } else {
            showMessage(
              t("This-voter-is-already-exist-in-non-voter-list"),
              "error",
              setOpen
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    setVoters(voters_Data);
    setVotersForView(voters_DataView);
    setVoterInfo({
      ...voterInfo,
      value: 0,
      label: "",
      type: 0,
    });
    setEmailValue("");
  };

  const addNonVoter = () => {
    let newOrganizersData = ResolutionReducer.getAllCommitteesAndGroups;

    let nonVotersData = [...nonVoter];
    let nonVotersDataView = [...nonVoterForView];
    if (newOrganizersData !== null) {
      try {
        if (nonVoterInfo.type === 1) {
          let { groups } = newOrganizersData;
          let findGroupData = groups.find(
            (nonVoterGroupData) =>
              nonVoterGroupData.groupID === nonVoterInfo.value
          );

          if (findGroupData !== undefined) {
            // Filter out voters who do not exist in the findGroupData.groupUsers
            let checkIfExistInVoters = findGroupData.groupUsers.filter(
              (voterData) => {
                // Check if the user exists in voters array
                let userExists = voters.find(
                  (findData) => findData.FK_UID === voterData.userID
                );
                // Return only users who do not exist in voters array
                return !userExists;
              }
            );

            if (checkIfExistInVoters.length > 0) {
              // Filter out voters who do not exist in the findGroupData.groupUsers
              let checkIfExistInNonVoters = checkIfExistInVoters.filter(
                (voterData) => {
                  // Check if the user exists in voters array
                  let userExists = nonVoter.find(
                    (findData) => findData.FK_UID === voterData.userID
                  );
                  // Return only users who do not exist in voters array
                  return !userExists;
                }
              );

              if (checkIfExistInNonVoters.length > 0) {
                checkIfExistInNonVoters.forEach((userData, index) => {
                  nonVotersData.push({
                    FK_UID: userData.userID,
                    FK_VotingStatus_ID: 3,
                    Notes: "",
                    Email: userData.emailAddress,
                  });
                  nonVotersDataView.push(userData);
                });
              } else {
                showMessage(
                  t("This-voter-is-already-exist-in-non-voter-list"),
                  "error",
                  setOpen
                );
                console.log("user Already Non Voter List");
              }
            } else {
              showMessage(t("This-voter-already-exist"), "error", setOpen);
            }
          }
        } else if (nonVoterInfo.type === 2) {
          let { committees } = newOrganizersData;
          let findCommitteeData = committees.find(
            (nonVoterCommitteesData) =>
              nonVoterCommitteesData.committeeID === nonVoterInfo.value
          );

          if (findCommitteeData !== undefined) {
            // Filter out voters who do not exist in the findGroupData.groupUsers
            let checkIfExistInVoters = findCommitteeData.committeeUsers.filter(
              (voterData) => {
                // Check if the user exists in voters array
                let userExists = voters.find(
                  (findData) => findData.FK_UID === voterData.userID
                );
                // Return only users who do not exist in voters array
                return !userExists;
              }
            );

            if (checkIfExistInVoters.length > 0) {
              // Filter out voters who do not exist in the findGroupData.groupUsers
              let checkIfExistInNonVoters = checkIfExistInVoters.filter(
                (voterData) => {
                  // Check if the user exists in voters array
                  let userExists = nonVoter.find(
                    (findData) => findData.FK_UID === voterData.userID
                  );
                  // Return only users who do not exist in voters array
                  return !userExists;
                }
              );
              if (checkIfExistInNonVoters.length > 0) {
                checkIfExistInNonVoters.forEach((userData) => {
                  nonVotersData.push({
                    FK_UID: userData.userID,
                    FK_VotingStatus_ID: 3,
                    Notes: "",
                    Email: userData.emailAddress,
                  });
                  nonVotersDataView.push(userData);
                });
              } else {
                showMessage(
                  t("This-voter-is-already-exist-in-non-voter-list"),
                  "error",
                  setOpen
                );
              }
            } else {
              showMessage(t("This-voter-already-exist"), "error", setOpen);
            }
          }
        } else if (nonVoterInfo.type === 3) {
          let { organizationUsers } = newOrganizersData;

          let findVoter = nonVoter.findIndex(
            (data) => data.FK_UID === nonVoterInfo.value
          );
          let findisAlreadyExist = voters.findIndex(
            (data) => data.FK_UID === nonVoterInfo.value
          );
          if (findisAlreadyExist === -1) {
            if (findVoter === -1) {
              if (organizationUsers.length > 0) {
                organizationUsers.forEach((voeterdata) => {
                  if (voeterdata.userID === nonVoterInfo.value) {
                    nonVotersData.push({
                      FK_UID: voeterdata.userID,
                      FK_VotingStatus_ID: 3,
                      Notes: "",
                      Email: voeterdata.emailAddress,
                    });
                    nonVotersDataView.push(voeterdata);
                  }
                });
              }
            } else {
              showMessage(
                t("This-voter-is-already-exist-in-non-voter-list"),
                "error",
                setOpen
              );
            }
          } else {
            showMessage(t("This-voter-already-exist"), "error", setOpen);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    setNonVoters(nonVotersData);
    setNonVotersForView(nonVotersDataView);
    setNonVoterInfo({
      ...nonVoterInfo,
      value: 0,
      label: "",
      type: 0,
    });
    setEmailValue("");
  };

  const handleChangeVoter = (event) => {
    let newOrganizersData = ResolutionReducer.getAllCommitteesAndGroups;
    if (newOrganizersData !== null) {
      if (event.type === 3) {
        let { organizationUsers } = newOrganizersData;
        if (organizationUsers?.length > 0) {
          let findUserData = organizationUsers.find(
            (userData, index) => userData.userID === event.value
          );
          setEmailValue(findUserData.emailAddress);
          setVoterInfo({
            ...voterInfo,
            label: event.label,
            value: event.value,
            type: event.type,
          });
        }
      } else if (event.type === 1 || event.type === 2) {
        // for Groups and Committees
        setEmailValue("");
        setVoterInfo({
          ...voterInfo,
          label: event.label,
          value: event.value,
          type: event.type,
        });
      }
    }
  };

  const handleChangeNonVoter = (event) => {
    let newOrganizersData = ResolutionReducer.getAllCommitteesAndGroups;
    if (newOrganizersData !== null) {
      if (event.type === 3) {
        let { organizationUsers } = newOrganizersData;
        if (organizationUsers?.length > 0) {
          let findUserData = organizationUsers.find(
            (userData, index) => userData.userID === event.value
          );
          setEmailValue(findUserData.emailAddress);
          setNonVoterInfo({
            ...voterInfo,
            label: event.label,
            value: event.value,
            type: event.type,
          });
        }
      } else if (event.type === 1 || event.type === 2) {
        // for Groups and Committees
        setEmailValue("");
        setNonVoterInfo({
          ...voterInfo,
          label: event.label,
          value: event.value,
          type: event.type,
        });
      }
    }
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
      showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
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
    ) {
      setsendStatus(2);
      if (fileForSend.length > 0) {
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
      showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
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
      let totalFiles = fileList.length + tasksAttachments.length;
      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let sizezero = true;
      let size = true;

      if (totalFiles > 10) {
        showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > maxFileSize) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = tasksAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          showMessage(
            t("File-size-should-not-be-greater-then-1-5GB"),
            "error",
            setOpen
          );
        } else if (!sizezero) {
          showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
        } else if (fileExists) {
          showMessage(t("File-already-exists"), "error", setOpen);
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

  useEffect(() => {
    let newOrganizersData = ResolutionReducer.getAllCommitteesAndGroups;
    if (newOrganizersData !== null && newOrganizersData !== undefined) {
      let temp = [];
      if (Object.keys(newOrganizersData).length > 0) {
        if (Object.keys(newOrganizersData.groups).length > 0) {
          newOrganizersData.groups.forEach((a) => {
            let newData = {
              value: a.groupID,
              name: a.groupName,
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
                        src={GroupIcon}
                        alt=""
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                      />
                      <span className={styles["NameDropDown"]}>
                        {a.groupName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 1,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(newOrganizersData.committees).length > 0) {
          newOrganizersData.committees.forEach((a) => {
            let newData = {
              value: a.committeeID,
              name: a.committeeName,
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
                        src={committeeicon}
                        alt=""
                        width="21.71px"
                        height="18.61px"
                        draggable="false"
                      />
                      <span className={styles["NameDropDown"]}>
                        {a.committeeName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 2,
            };
            temp.push(newData);
          });
        }
        if (Object.keys(newOrganizersData.organizationUsers).length > 0) {
          newOrganizersData.organizationUsers.forEach((a) => {
            let newData = {
              value: a.userID,
              name: a.userName,
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
                        src={`data:image/jpeg;base64,${a?.profilePicture?.displayProfilePictureName}`}
                        alt=""
                        className={styles["UserProfilepic"]}
                        width="18px"
                        height="18px"
                        draggable="false"
                      />
                      <span className={styles["NameDropDown"]}>
                        {a.userName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 3,
            };
            temp.push(newData);
          });
        }
        setMeetingAttendeesList(temp);
      } else {
        setMeetingAttendeesList([]);
      }
    }
  }, [ResolutionReducer.getAllCommitteesAndGroups]);

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
      ResolutionReducer.ResponseMessage !== undefined &&
      ResolutionReducer.ResponseMessage !== t("No-data-available")
    ) {
      showMessage(ResolutionReducer.ResponseMessage, "success", setOpen);
      dispatch(clearResponseMessage());
    }
  }, [ResolutionReducer.ResponseMessage]);

  // Get Voting Methods
  useEffect(() => {
    if (ResolutionReducer.GetAllVotingMethods !== null) {
      let newArr = [];
      ResolutionReducer.GetAllVotingMethods.forEach((data) => {
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
            <span className={styles["Create_new_resolution_paper"]}>
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
                              <TimePicker hideSeconds position="bottom" />,
                            ]}
                            render={<CustomInput />}
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
                            plugins={[<TimePicker hideSeconds />]}
                            render={<CustomInput />}
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
                            plugins={[<TimePicker hideSeconds />]}
                            render={<CustomInput />}
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
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          {isVoter ? (
                            <>
                              <Row>
                                <Col lg={5} md={5} sm={5}>
                                  <Select
                                    placeholder={`${t("Add-attendees")}*`}
                                    className="mt-3"
                                    isSearchable={false}
                                    value={
                                      voterInfo.value === 0 ? null : voterInfo
                                    }
                                    options={meetingAttendeesList}
                                    onChange={handleChangeVoter}
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
                                      voterInfo.value !== 0 ? false : true
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
                                  <Row className="mt-2">
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
                                                      EmployeePic={
                                                        data?.profilePicture
                                                          ?.displayProfilePictureName
                                                      }
                                                      Icon={
                                                        <img
                                                          src={CrossIcon}
                                                          width="18px"
                                                          height="18px"
                                                          alt=""
                                                          onClick={() =>
                                                            removeUserForVoter(
                                                              data.userID,
                                                              data.userName
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
                              <Row>
                                <Col lg={5} md={5} sm={5}>
                                  <Select
                                    placeholder={`${t("Add-attendees")}*`}
                                    className="mt-3"
                                    isSearchable={false}
                                    value={
                                      nonVoterInfo.value === 0
                                        ? null
                                        : nonVoterInfo
                                    }
                                    options={meetingAttendeesList}
                                    onChange={handleChangeNonVoter}
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
                                      nonVoterInfo.value !== 0 ? false : true
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
                                  <Row className="mt-2">
                                    {nonVoterForView.length > 0
                                      ? nonVoterForView.map((data, index) => {
                                          return (
                                            <>
                                              <Col
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                key={data.pK_UID}
                                              >
                                                <EmployeeinfoCard
                                                  Employeename={data?.name}
                                                  Employeeemail={
                                                    data?.emailAddress
                                                  }
                                                  EmployeePic={
                                                    data?.profilePicture
                                                      ?.displayProfilePictureName
                                                  }
                                                  Icon={
                                                    <img
                                                      src={CrossIcon}
                                                      width="18px"
                                                      height="18px"
                                                      alt=""
                                                      onClick={() =>
                                                        removeUserForNonVoter(
                                                          data.userID,
                                                          data.userName
                                                        )
                                                      }
                                                      draggable="false"
                                                    />
                                                  }
                                                />
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
                                  <Col lg={12} md={12} sm={12}>
                                    <Row>
                                      {tasksAttachments.length > 0
                                        ? tasksAttachments.map(
                                            (data, index) => {
                                              return (
                                                <Col
                                                  sm={4}
                                                  lg={4}
                                                  md={4}
                                                  key={data}
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
                                              );
                                            }
                                          )
                                        : null}
                                    </Row>
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
                                      alt=""
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
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </span>
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

      {discardresolution ? (
        <ModalDiscardResolution
          discardresolution={discardresolution}
          setDiscardresolution={setDsicardresolution}
        />
      ) : null}
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default ScheduleNewResolution;
