import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./EditResolution.module.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useDispatch, useSelector } from "react-redux";
import featherupload from "../../../assets/images/featherupload.svg";
import GroupIcon from "../../../assets/images/GroupSetting.svg";
import committeeicon from "../../../assets/images/committeedropdown.svg";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { Upload } from "antd";
import Select from "react-select";
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
import ModalUpdateresolution from "../ModalUpdateResolution/ModalUpdateresolution";
import MOdalResolutionCirculated from "../ModalResolutionCirculated/ModalResolutionCirculated";
import ModalDiscardResolution from "../ModalDiscardResolution/ModalDiscardResolution";
import ModalResolutionUpdated from "../ModalResolutionUpdated/ModalResolutionUpdated";
import EmployeeinfoCard from "../../../components/elements/Employeeinfocard/EmployeeinfoCard";
import {
  createResolution,
  getAllResolutionStatus,
  getAllVotingMethods,
  cancelResolutionApi,
  clearResponseMessage,
  updateResolutionModal,
  updateResolution,
  uploadDocumentsResolutionApi,
  saveFilesResolutionApi,
  getAllGroupsandCommitteesforResolution,
} from "../../../store/actions/Resolution_actions";
import moment from "moment";
import {
  createConvert,
  editResolutionDate,
  editResolutionTime,
  editResolutionTimeView,
  removeDashesFromDate,
  RemoveTimeDashes,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { validateInput } from "../../../commen/functions/regex";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import { maxFileSize } from "../../../commen/functions/utils";
const EditResolution = ({ setCancelresolution }) => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");
  const { ResolutionReducer } = useSelector((state) => state);
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const currentDate = new Date();

  useEffect(() => {
    try {
      if (currentLanguage !== undefined) {
        if (currentLanguage === "en") {
          setCalendarValue(gregorian);
          setLocalValue(gregorian_en);
        } else if (currentLanguage === "ar") {
          setCalendarValue(gregorian);
          setLocalValue(gregorian_ar);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [currentLanguage]);
  const [attachments, setAttachments] = useState([]);

  const [isVoter, setVoter] = useState(true);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
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
  const [emailValue, setEmailValue] = useState("");
  const [isNonVoter, setNonVoter] = useState(false);
  const [resolutioncancel, setResolutioncancel] = useState(false);
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
  const [voterInfo, setVoterInfo] = useState({
    value: 0,
    label: "",
  });

  const [nonVoterInfo, setNonVoterInfo] = useState({
    value: 0,
    label: "",
  });
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

  useEffect(() => {
    dispatch(getAllVotingMethods(navigate, t, true));
    dispatch(getAllResolutionStatus(navigate, t, true));
    dispatch(getAllGroupsandCommitteesforResolution(navigate, t));
  }, []);

  const ShowVoter = () => {
    setVoter(true);
    setNonVoter(false);
    setEmailValue("");
    setNonVoterInfo({
      ...nonVoterInfo,
      value: 0,
      label: "",
    });
  };

  const ShowNonVoters = () => {
    setVoter(false);
    setNonVoter(true);
    setVoterInfo({
      ...voterInfo,
      value: 0,
      label: "",
    });
    setEmailValue("");
  };

  const resolutiondiscard = () => {
    setDsicardresolution(true);
  };
  const dateformatYYYYMMDD = (date) => {
    if (!!date && typeof date === "string") {
      return moment(date).add(1, "days").toDate();
    }
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
    setVotersForView((prevVoterState) =>
      prevVoterState.filter((data) => data.userID !== VoterID)
    );
    setVoters((prevVoter) =>
      prevVoter.filter((data) => data.FK_UID !== VoterID)
    );
    setVoterID(0);
    setVoterName("");
    setVoterModalRemove(false);
  };

  const removeNonVoterInfo = () => {
    setNonVotersForView((prevNonVoterState) =>
      prevNonVoterState.filter((data) => data.userID !== VoterID)
    );
    setNonVoters((prevNonVoter) =>
      prevNonVoter.filter((data) => data.FK_UID !== VoterID)
    );
    setNonVoterModalRemove(false);
    setVoterID(0);
    setVoterName("");
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

  const deleteFilefromAttachments = (data) => {
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
                organizationUsers.forEach((voeterdata, index) => {
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
                organizationUsers.forEach((voeterdata, index) => {
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
            (userData) => userData.userID === event.value
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
            (userData) => userData.userID === event.value
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

  let previousFileList = [];

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
      let totalFiles = fileList.length + attachments.length;
      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let sizezero = true;
      let size = true;

      if (totalFiles > 15) {
        showMessage(t("Not-allowed-more-than-15-files"), "error", setOpen);
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > maxFileSize) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = attachments.some(
          (oldFileData) => oldFileData.displayAttachmentName === fileData.name
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
      showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
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
    try {
      if (ResolutionReducer.updateResolutionDataroom !== 0) {
        let folderIDCreated = ResolutionReducer.updateResolutionDataroom;
        documentsUploadCall(folderIDCreated);
      }
    } catch (error) {
      console.log(error, "error");
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
        (data) =>
          data.value === resolutionData.fK_ResolutionReminderFrequency_ID
      )
      .map((reminderData) => {
        setReminderFrequencyValue({
          label: reminderData.label,
          value: reminderData.value,
        });
      });
    votingMethods
      .filter(
        (data) => data.value === resolutionData.fK_ResolutionVotingMethodID
      )
      .map((methodData) => {
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
      attachmentsResolution.map((data) => {
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
      votersResolutionMembers.map((voterMember) => {
        meetingAttendeesList
          .filter((assigneeData) => assigneeData.pK_UID === voterMember.fK_UID)
          .map((data) => {
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
      nonVotersResolutionMembers.map((voterMember) => {
        meetingAttendeesList
          .filter((assigneeData) => assigneeData.pK_UID === voterMember.fK_UID)
          .map((data) => {
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
      let newOrganizersData = ResolutionReducer.getAllCommitteesAndGroups;
      if (newOrganizersData !== null && newOrganizersData !== undefined) {
        console.log(newOrganizersData, "newOrganizersDatanewOrganizersData");
        let temp = [];
        let usersData = [];
        if (Object.keys(newOrganizersData).length > 0) {
          if (Object.keys(newOrganizersData.groups).length > 0) {
            newOrganizersData.groups.map((a, index) => {
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
                          height="16.45px"
                          width="18.32px"
                          draggable="false"
                          alt=""
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
            newOrganizersData.committees.map((a, index) => {
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
                          width="21.71px"
                          height="18.61px"
                          draggable="false"
                          alt=""
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
            newOrganizersData.organizationUsers.map((a, index) => {
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
                          // src={}
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
              usersData.push(a);
              temp.push(newData);
            });
          }
          setMeetingAttendeesList(temp);
          setUsersList(usersData);
        } else {
          setMeetingAttendeesList([]);
          setUsersList([]);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [ResolutionReducer.getAllCommitteesAndGroups]);
  // Get Voting Methods
  useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error, "error");
    }
  }, [ResolutionReducer.GetAllVotingMethods]);

  useEffect(() => {
    if (ResolutionReducer.ResponseMessage !== "") {
      showMessage(ResolutionReducer.ResponseMessage, "success", setOpen);
      dispatch(clearResponseMessage());
    }
  }, [ResolutionReducer.ResponseMessage]);

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
            (data) =>
              data.value === resolutionData.fK_ResolutionReminderFrequency_ID
          )
          .map((reminderData) => {
            setReminderFrequencyValue({
              label: reminderData.label,
              value: reminderData.value,
            });
          });
        votingMethods
          .filter(
            (data) => data.value === resolutionData.fK_ResolutionVotingMethodID
          )
          .map((methodData) => {
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
          attachmentsResolution.forEach((data) => {
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
        }
        if (
          votersResolutionMembers.length > 0 &&
          Object.keys(usersList).length > 0
        ) {
          let vTrs = [];
          let vTrsVie = [];
          votersResolutionMembers.forEach((voterMember, index) => {
            usersList
              .filter(
                (assigneeData) => assigneeData.userID === voterMember.fK_UID
              )
              .forEach((data) => {
                vTrs.push({
                  FK_UID: data.userID,
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

          nonVotersResolutionMembers.map((voterMember, index) => {
            usersList
              .filter(
                (assigneeData, index) =>
                  assigneeData.userID === voterMember.fK_UID
              )
              .forEach((data, index) => {
                nVtr.push({
                  FK_UID: data.userID,
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
                                  onFocusedDateChange={
                                    circulationDateChangeHandler
                                  }
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
                                      <Col lg={5} md={5} sm={5}>
                                        <Select
                                          placeholder={`${t("Add-attendees")}*`}
                                          className="mt-3"
                                          isSearchable={false}
                                          value={
                                            voterInfo.value === 0
                                              ? null
                                              : voterInfo
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
                                            voterInfo.value !== 0 ? false : true
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
                                                                data
                                                                  ?.profilePicture
                                                                  ?.displayProfilePictureName
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
                                            nonVoterInfo.value !== 0
                                              ? false
                                              : true
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
                                                                data
                                                                  ?.profilePicture
                                                                  ?.displayProfilePictureName
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
                                        {attachments.length > 0
                                          ? attachments.map((data, index) => {
                                              return (
                                                <Col sm={4} lg={4} md={4}>
                                                  <AttachmentViewer
                                                    id={0}
                                                    handleClickRemove={() =>
                                                      deleteFilefromAttachments(
                                                        data,
                                                        index
                                                      )
                                                    }
                                                    data={data}
                                                    name={
                                                      data.displayAttachmentName
                                                    }
                                                    fk_UID={Number(
                                                      localStorage.getItem(
                                                        "userID"
                                                      )
                                                    )}
                                                  />
                                                </Col>
                                              );
                                            })
                                          : null}
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
    </>
  );
};

export default EditResolution;
