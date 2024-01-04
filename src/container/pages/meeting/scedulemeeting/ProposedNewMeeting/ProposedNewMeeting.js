import React, { useEffect, useRef } from "react";
import styles from "./ProposedNewMeeting.module.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Paper } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import profile from "../../../../../assets/images/newprofile.png";
import plusFaddes from "../../../../../assets/images/SVGBlackPlusIcon.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import GroupIcon from "../../../../../assets/images/groupdropdown.svg";
import committeeicon from "../../../../../assets/images/committeedropdown.svg";
import {
  Button,
  TextField,
  Notification,
} from "../../../../../components/elements";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { DateObject } from "react-multi-date-picker";
import desh from "../../../../../assets/images/desh.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import InputIcon from "react-multi-date-picker/components/input_icon";
import moment from "moment";
import {
  convertGMTDateintoUTC,
  createConvert,
} from "../../../../../commen/functions/date_formater";
import { containsStringandNumericCharacters } from "../../../../../commen/functions/regex";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import makeAnimated from "react-select/animated";
import { getAllCommitteesandGroups } from "../../../../../store/actions/Polls_actions";
import {
  getCurrentDate,
  getCurrentDatewithIndexIncrement,
  getEndTimeWitlCeilFunction,
  getStartTimeWithCeilFunction,
} from "../../../../../commen/functions/time_formatter";
import { SaveMeetingDetialsNewApiFunction } from "../../../../../store/actions/NewMeetingActions";

const ProposedNewMeeting = ({
  setProposedNewMeeting,
  setorganizers,
  setmeetingDetails,
  setSceduleMeeting,
  setCurrentMeetingID,
  currentMeeting,
  editorRole,
  setEditMeeting,
  isEditMeeting,
  setDataroomMapFolderId,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const calendRef = useRef();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [error, seterror] = useState(false);
  const [sendResponseVal, setSendResponseVal] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const startTime = getStartTimeWithCeilFunction();
  const getEndTime = getEndTimeWitlCeilFunction();
  const getCurrentDateforMeeting = getCurrentDate();
  const [proposedMeetingDetails, setProposedMeetingDetails] = useState({
    MeetingTitle: "",
    Description: "",
  });

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  //Getting Data from States
  const { PollsReducer } = useSelector((state) => state);

  //Send Response By Date
  const [sendResponseBy, setSendResponseBy] = useState({
    date: "",
  });

  //state for adding Date and Time Rows
  const [rows, setRows] = useState([
    {
      selectedOption: "",
      dateForView: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  ]);

  //Setting the Dates And Time Default
  // useEffect(() => {
  //   const updatedRows = [...rows];
  //   updatedRows[0].selectedOption = getCurrentDateforMeeting.dateFormat;
  //   updatedRows[0].dateForView = getCurrentDateforMeeting.DateGMT;
  //   updatedRows[0].startDate = startTime?.formattedTime;
  //   updatedRows[0].startTime = startTime?.newFormatTime;
  //   updatedRows[0].endDate = getEndTime?.formattedTime;
  //   updatedRows[0].endTime = getEndTime?.newFormatTime;
  //   setRows(updatedRows);
  // }, []);

  useEffect(() => {
    const updatedRows = rows.map((row, index) => {
      const currentDate = getCurrentDatewithIndexIncrement(index);
      return {
        ...row,
        selectedOption: currentDate.dateFormat,
        dateForView: currentDate.DateGMT,
        startDate: startTime?.formattedTime,
        startTime: startTime?.newFormatTime,
        endDate: getEndTime?.formattedTime,
        endTime: getEndTime?.newFormatTime,
      };
    });
    setRows(updatedRows);
  }, [rows.length]); // Run on every render due to the absence of specific dependencies

  // Later in your component, modify rows as needed:
  const handleRowModification = (index, newData) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], ...newData };
    setRows(updatedRows);
  };

  //Getting All Groups And Committies By Organization ID
  useEffect(() => {
    dispatch(getAllCommitteesandGroups(navigate, t));
    return () => {
      setMembers([]);
      setProposedMeetingDetails({
        MeetingTitle: "",
        Description: "",
      });
      setSendResponseBy({
        date: "",
      });
    };
  }, []);

  useEffect(() => {
    let pollsData = PollsReducer.gellAllCommittesandGroups;
    if (pollsData !== null && pollsData !== undefined) {
      let temp = [];
      if (Object.keys(pollsData).length > 0) {
        if (Object.keys(pollsData.groups).length > 0) {
          pollsData.groups.map((a, index) => {
            let newData = {
              value: a.groupID,
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
        if (Object.keys(pollsData.committees).length > 0) {
          pollsData.committees.map((a, index) => {
            let newData = {
              value: a.committeeID,
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
        if (Object.keys(pollsData.organizationUsers).length > 0) {
          console.log(
            pollsData.organizationUsers,
            "organizationUsersorganizationUsersorganizationUsers"
          );
          pollsData.organizationUsers.map((a, index) => {
            let newData = {
              value: a.userID,
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
            temp.push(newData);
          });
        }
        setDropdowndata(temp);
      } else {
        setDropdowndata([]);
      }
    }
  }, [PollsReducer.gellAllCommittesandGroups]);

  //handle Add Users
  const handleAddUsers = () => {
    let pollsData = PollsReducer.gellAllCommittesandGroups;
    let tem = [...members];
    if (Object.keys(selectedsearch).length > 0) {
      try {
        selectedsearch.forEach((seledtedData, index) => {
          console.log(
            seledtedData,
            "seledtedDataseledtedDataseledtedDataseledtedData"
          );
          if (seledtedData.type === 1) {
            let check1 = pollsData.groups.find(
              (data, index) => data.groupID === seledtedData.value
            );
            if (check1 !== undefined) {
              let groupUsers = check1.groupUsers;
              if (Object.keys(groupUsers).length > 0) {
                groupUsers.forEach((gUser, index) => {
                  let check2 = members.find(
                    (data, index) => data.UserID === gUser.userID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: gUser.userName,
                      userID: gUser.userID,
                      displayPicture: "",
                      Title: "",
                      ParticipantRoleID: 2,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 2) {
            console.log("members check");
            let check1 = pollsData.committees.find(
              (data, index) => data.committeeID === seledtedData.value
            );
            if (check1 !== undefined) {
              let committeesUsers = check1.committeeUsers;
              if (Object.keys(committeesUsers).length > 0) {
                committeesUsers.forEach((cUser, index) => {
                  let check2 = members.find(
                    (data, index) => data.UserID === cUser.userID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: cUser.userName,
                      userID: cUser.userID,
                      displayPicture: "",
                      Title: "",
                      ParticipantRoleID: 2,
                    };
                    tem.push(newUser);
                  }
                });
              }
            }
          } else if (seledtedData.type === 3) {
            let check1 = members.find(
              (data, index) => data.UserID === seledtedData.value
            );
            if (check1 !== undefined) {
            } else {
              let check2 = pollsData.organizationUsers.find(
                (data, index) => data.userID === seledtedData.value
              );
              console.log(check2, "check2check2check2");
              if (check2 !== undefined) {
                let newUser = {
                  userName: check2.userName,
                  userID: check2.userID,
                  displayPicture:
                    check2.profilePicture.displayProfilePictureName,
                  Title: "",
                  ParticipantRoleID: 2,
                };

                tem.push(newUser);
              }
            }
          } else {
          }
        });
      } catch {
        console.log("error in add");
      }
      console.log("members check", tem);
      const uniqueData = new Set(tem.map(JSON.stringify));

      // Convert the Set back to an array of objects
      const result = Array.from(uniqueData).map(JSON.parse);
      setMembers(result);
      setSelectedsearch([]);
    } else {
      // setopen notionation work here
    }
  };

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  //Removing the Added Participants
  const hanleRemovingParticipants = (index) => {
    let removeParticipant = [...members];
    removeParticipant.splice(index, 1);
    setMembers(removeParticipant);
  };

  //Adding the Dates Rows
  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    if (isValidRow(lastRow)) {
      setRows([
        ...rows,
        {
          selectedOption: "",
          dateForView: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
        },
      ]);
    }
  };

  //Validation For Checking that the Row Should Not Be Empty Before Inserting the Another
  const isValidRow = (row) => {
    return (
      row.selectedOption !== "" && row.startDate !== "" && row.endDate !== ""
    );
  };

  //OnChange Function For Select Options
  const changeDateStartHandler = (date, index) => {
    try {
      let newDate = new Date(date);
      let DateDate = new DateObject(date).format("YYYYMMDD");
      const updatedRows = [...rows];
      if (
        index > 0 &&
        Number(DateDate) < Number(updatedRows[index - 1].selectedOption)
      ) {
        setOpen({
          flag: true,
          message: t("Selected-date-should-not-be-less-than-the-previous-one"),
        });
        return;
      } else {
        updatedRows[index].selectedOption = DateDate;
        updatedRows[index].dateForView = newDate;
        setRows(updatedRows);
      }
    } catch {}
  };

  //OnChange Function For Start Time
  const handleStartTimeChange = (index, date) => {
    let newDate = new Date(date);
    console.log(newDate, "handleStartDateChangehandleStartDateChange");
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}${minutes}${"00"}`;

      const updatedRows = [...rows];

      if (
        index > 0 &&
        updatedRows[index - 1].selectedOption ===
          updatedRows[index].selectedOption
      ) {
        if (formattedTime <= updatedRows[index - 1].endDate) {
          setOpen({
            flag: true,
            message: t(
              "Selected-start-time-should-not-be-less-than-the-previous-endTime"
            ),
          });
          return;
        } else {
          if (
            updatedRows[index].endDate !== "" &&
            formattedTime >= updatedRows[index].endDate
          ) {
            setOpen({
              flag: true,
              message: t(
                "Selected-start-time-should-not-be-greater-than-the-endTime"
              ),
            });
            return;
          } else {
            updatedRows[index].startDate = formattedTime;
            updatedRows[index].startTime = newDate;
            setRows(updatedRows);
          }
        }
      } else {
        if (
          updatedRows[index].endDate !== "" &&
          formattedTime >= updatedRows[index].endDate
        ) {
          setOpen({
            flag: true,
            message: t(
              "Selected-start-time-should-not-be-greater-than-the-endTime"
            ),
          });
          return;
        } else {
          updatedRows[index].startDate = formattedTime;
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
        }
      }
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //OnChange Function For End Time
  const handleEndTimeChange = (index, date) => {
    let newDate = new Date(date);

    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours}${minutes}${"00"}`;

      const updatedRows = [...rows];

      if (
        index > 0 &&
        updatedRows[index - 1].selectedOption ===
          updatedRows[index].selectedOption
      ) {
        if (formattedTime <= updatedRows[index].startDate) {
          setOpen({
            flag: true,
            message: t(
              "Selected-end-time-should-not-be-less-than-the-previous-one"
            ),
          });
          return;
        } else {
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          setRows(updatedRows);
        }
      } else {
        if (formattedTime <= updatedRows[index].startDate) {
          setOpen({
            flag: true,
            message: t("Selected-end-time-should-not-be-less-than-start-time"),
          });
          return;
        } else {
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          setRows(updatedRows);
        }
      }
      // }
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //Removing the Date Time Rows
  const HandleCancelFunction = (index) => {
    let optionscross = [...rows];
    optionscross.splice(index, 1);
    setRows(optionscross);
  };

  //Send Response By Handler
  const SendResponseHndler = (date) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let DateDate = convertGMTDateintoUTC(date);
    setSendResponseVal(meetingDateValueFormat);
    setSendResponseBy({
      ...sendResponseBy,
      date: DateDate.slice(0, 8),
    });
  };

  //for handling Cancel the ProposedMeeting Page
  const handleCancelButtonProposedMeeting = () => {
    setProposedNewMeeting(false);
  };

  //For handling  Proposed button ProposedMeeting Page
  const handleProposedButtonProposedMeeting = () => {
    let Dates = [];
    rows.forEach((data, index) => {
      Dates.push({
        MeetingDate: createConvert(data.selectedOption + data.startDate).slice(
          0,
          8
        ),
        StartTime: createConvert(data.selectedOption + data.startDate).slice(
          8,
          14
        ),
        EndTime: createConvert(data.selectedOption + data.endDate).slice(8, 14),
      });
    });
    if (
      proposedMeetingDetails.MeetingTitle === "" ||
      proposedMeetingDetails.Description === "" ||
      members.length === 0 ||
      rows.length <= 1 ||
      sendResponseVal === ""
    ) {
      seterror(true);
    } else {
      let data = {
        MeetingDetails: {
          MeetingID: 0,
          MeetingTitle: proposedMeetingDetails.MeetingTitle,
          MeetingType: { PK_MTID: 27, Type: "BoardMeetings" },
          Location: "",
          Description: proposedMeetingDetails.Description,
          IsVideoChat: true,
          IsTalkGroup: false,
          OrganizationId: 411,
          MeetingDates: Dates,
          MeetingReminders: [4],
          Notes: "",
          AllowRSVP: true,
          NotifyOrganizerOnRSVP: true,
          ReucurringMeetingID: 1,
          VideoURL: "",
          MeetingStatusID: 11,
        },
      };
      dispatch(
        SaveMeetingDetialsNewApiFunction(
          navigate,
          t,
          data,
          setSceduleMeeting,
          setorganizers,
          setmeetingDetails,
          1,
          setCurrentMeetingID,
          currentMeeting,
          proposedMeetingDetails, //state in which title and description is present
          setDataroomMapFolderId,
          members,
          rows,
          sendResponseBy.date,
          setProposedNewMeeting
        )
      );

      setProposedMeetingDetails({
        MeetingTitle: "",
        Description: "",
      });
      setMembers([]);
      setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
      setSendResponseBy({
        date: "",
      });
    }
  };

  //handle Change for Decription and Title Of meeting
  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "MeetingTitle") {
      let valueCheck = containsStringandNumericCharacters(value);
      if (valueCheck !== "") {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          MeetingTitle: valueCheck.trimStart(),
        });
      } else {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          MeetingTitle: "",
        });
      }
    }

    if (name === "MeetingDescription") {
      if (value.trimStart() !== "") {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          Description: value,
        });
      } else {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          Description: "",
        });
      }
    }
  };

  //For arabic Convertion of the Date Times
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

  useEffect(() => {
    return () => {
      setProposedMeetingDetails({
        MeetingTitle: "",
        Description: "",
      });
      setMembers([]);
      setRows([...rows, { selectedOption: "", startDate: "", endDate: "" }]);
      setSendResponseBy({
        date: "",
      });
    };
  }, []);

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ProposedMeetingHeading"]}>
            {t("Propose-new-meeting")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["ProposedNewMeetingPaper"]}>
            <Row>
              <Col lg={5} md={5} sm={5}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Meeting-title")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      labelClass={"d-none"}
                      name={"MeetingTitle"}
                      change={HandleChange}
                      value={proposedMeetingDetails.MeetingTitle}
                    />
                    <Row>
                      <Col>
                        <p
                          className={
                            error && proposedMeetingDetails.MeetingTitle === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-enter-meeting-title")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Description")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      name="MeetingDescription"
                      applyClass="form-control2 textbox-height-details-view"
                      type="text"
                      as={"textarea"}
                      labelClass={"d-none"}
                      rows="7"
                      value={proposedMeetingDetails.Description}
                      change={HandleChange}
                      required
                    />

                    <Row>
                      <Col>
                        <p
                          className={
                            error && proposedMeetingDetails.Description === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-enter-meeting-description")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Participant")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={10} md={10} sm={10}>
                    <Select
                      onChange={handleSelectValue}
                      isDisabled={
                        PollsReducer.gellAllCommittesandGroups === null
                          ? true
                          : false
                      }
                      value={selectedsearch}
                      classNamePrefix={"selectMember"}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={dropdowndata}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={2} className="m-0 p-0">
                    <Button
                      text={"Add"}
                      className={styles["Add_Button_Proposed_Meeting"]}
                      onClick={handleAddUsers}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_ProposedMeeting"]}
                  >
                    <Row className="mt-2">
                      {members.length > 0
                        ? members.map((participant, index) => {
                            console.log(participant, "participantparticipant");
                            return (
                              <>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={12}
                                  className="mt-2"
                                  key={index}
                                >
                                  <Row className="m-0 p-0">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className={styles["Box_for_Assignee"]}
                                    >
                                      <Row className="mt-1">
                                        <Col
                                          lg={10}
                                          md={10}
                                          sm={12}
                                          className="d-flex gap-2 align-items-center"
                                        >
                                          <img
                                            draggable={false}
                                            src={profile}
                                            //   src={`data:image/jpeg;base64,${data.displayPicture}`}
                                            width="50px"
                                            alt=""
                                            height="50px"
                                            className={styles["ProfilePic"]}
                                          />
                                          <span
                                            className={
                                              styles["ParticipantName"]
                                            }
                                          >
                                            {participant.userName}
                                          </span>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={2}
                                          className="d-flex  align-items-center"
                                        >
                                          <img
                                            src={CrossIcon}
                                            width="14px"
                                            height="14px"
                                            draggable="false"
                                            style={{ cursor: "pointer" }}
                                            alt=""
                                            onClick={() =>
                                              hanleRemovingParticipants(index)
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              </>
                            );
                          })
                        : null}
                      <Row>
                        <Col>
                          <p
                            className={
                              error && members.length === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }
                          >
                            {t("Add-at-least-one-participant")}
                          </p>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex align-items-center justify-content-center"
              >
                <span className={styles["VerticalSeperator"]}></span>
              </Col>
              <Col lg={5} md={5} sm={5}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Proposed-on")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_Proposed_Dates"]}
                  >
                    {rows.length > 0
                      ? rows.map((data, index) => {
                          return (
                            <>
                              <Row>
                                <Col lg={12} md={12} sm={12} key={index}>
                                  <Row className="mt-2">
                                    <Col lg={4} md={4} sm={12}>
                                      <DatePicker
                                        selected={data.selectedOption}
                                        value={data.dateForView}
                                        format={"DD/MM/YYYY"}
                                        minDate={
                                          index > 0
                                            ? rows[index - 1].selectedOption
                                            : moment().toDate()
                                        }
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
                                        calendar={calendarValue}
                                        locale={localValue}
                                        ref={calendRef}
                                        onChange={(value) =>
                                          changeDateStartHandler(value, index)
                                        }
                                      />
                                      {/* <Row>
                                        <Col>
                                          <p
                                            className={
                                              error &&
                                              data.selectedOption === ""
                                                ? ` ${styles["errorMessage-inLogin"]} `
                                                : `${styles["errorMessage-inLogin_hidden"]}`
                                            }
                                          >
                                            {t("Please-select-data-and-time")}
                                          </p>
                                        </Col>
                                      </Row> */}
                                    </Col>
                                    <Col
                                      lg={3}
                                      md={3}
                                      sm={3}
                                      className="timePicker"
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
                                        selected={data.startDate}
                                        // onOpen={() => handleOpenStartTime(index)}
                                        value={data.startTime}
                                        editable={false}
                                        plugins={[<TimePicker hideSeconds />]}
                                        onChange={(date) =>
                                          handleStartTimeChange(index, date)
                                        }
                                      />
                                    </Col>
                                    <Col
                                      lg={1}
                                      md={1}
                                      sm={12}
                                      className="d-flex justify-content-center align-items-center"
                                    >
                                      <img
                                        draggable={false}
                                        src={desh}
                                        width="19.02px"
                                        alt=""
                                      />
                                    </Col>
                                    <Col
                                      lg={3}
                                      md={3}
                                      sm={12}
                                      // className="d-flex justify-content-end"
                                    >
                                      <DatePicker
                                        arrowClassName="arrowClass"
                                        containerClassName="containerClassTimePicker"
                                        className="timePicker"
                                        disableDayPicker
                                        inputClass="inputTImeMeeting"
                                        calendar={calendarValue}
                                        locale={localValue}
                                        value={data.endTime}
                                        format="hh:mm A"
                                        selected={data.endDate}
                                        plugins={[<TimePicker hideSeconds />]}
                                        editable={false}
                                        onChange={(date) =>
                                          handleEndTimeChange(index, date)
                                        }
                                      />
                                    </Col>
                                    <Col
                                      lg={1}
                                      md={1}
                                      sm={12}
                                      className="d-flex justify-content-end position-relative align-items-center"
                                    >
                                      <>
                                        {index === 0 ? null : (
                                          <>
                                            <img
                                              draggable={false}
                                              src={CrossIcon}
                                              width="23px"
                                              height="23px"
                                              alt=""
                                              className={
                                                styles["Cross_icon_class"]
                                              }
                                              onClick={() => {
                                                HandleCancelFunction(index);
                                              }}
                                            />
                                          </>
                                        )}
                                      </>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              {/* <Row>
                                <Col>
                                  <p
                                    className={
                                      error &&
                                      rows.selectedOption === "" &&
                                      rows.startDate === "" &&
                                      rows.endDate === ""
                                        ? ` ${styles["errorMessage-inLogin"]} `
                                        : `${styles["errorMessage-inLogin_hidden"]}`
                                    }
                                  >
                                    {t("Please-select-data-and-time")}
                                  </p>
                                </Col>
                              </Row> */}
                            </>
                          );
                        })
                      : null}
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <Button
                      text={
                        <>
                          <Row className="mt-1">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center gap-2 align-items-center"
                            >
                              <img
                                draggable={false}
                                src={plusFaddes}
                                alt=""
                                width="15.87px"
                                height="15.87px"
                              />
                              <span className={styles["Add_dates_label"]}>
                                {t("Add-dates")}
                              </span>
                            </Col>
                          </Row>
                        </>
                      }
                      className={styles["Add_Dates_Btn_Class"]}
                      onClick={addRow}
                    />
                  </Col>
                  <Row>
                    <Col>
                      <p
                        className={
                          error &&
                          //   rows.selectedOption === "" &&
                          //   rows.startDate === "" &&
                          //   rows.endDate === "" &&
                          rows.length === 1
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {t("Add-at-least-two-proposed-dates")}
                      </p>
                    </Col>
                  </Row>
                </Row>

                <Row className="mt-4">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Send-response-by")}{" "}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Width_Date_SendResponseBy"]}
                  >
                    <DatePicker
                      value={sendResponseVal}
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
                      className="proposedMeetindatesDatePicker"
                      onOpenPickNewDate={true}
                      inputMode=""
                      calendar={calendarValue}
                      locale={localValue}
                      ref={calendRef}
                      onChange={(value) => SendResponseHndler(value)}
                    />

                    <Row>
                      <Col>
                        <p
                          className={
                            error && sendResponseVal === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-select-send-response-by-date")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_Button_Proposed_Meeting"]}
                      onClick={handleCancelButtonProposedMeeting}
                    />

                    <Button
                      text={t("Proposed")}
                      className={styles["Proposed_Button_Proposed_Meeting"]}
                      onClick={handleProposedButtonProposedMeeting}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default ProposedNewMeeting;
