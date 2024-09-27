import React, { useEffect, useRef } from "react";
import styles from "./ProposedNewMeeting.module.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Paper } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import plusFaddes from "../../../../../assets/images/SVGBlackPlusIcon.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import GroupIcon from "../../../../../assets/images/groupdropdown.svg";
import committeeicon from "../../../../../assets/images/committeedropdown.svg";
import {
  Button,
  TextField,
  Notification,
  InputSearchFilter,
} from "../../../../../components/elements";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { DateObject } from "react-multi-date-picker";
import desh from "../../../../../assets/images/desh.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import InputIcon from "react-multi-date-picker/components/input_icon";
import moment from "moment";
import {
  convertToUTC,
  createConvert,
} from "../../../../../commen/functions/date_formater";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import makeAnimated from "react-select/animated";
import { getAllCommitteesandGroups } from "../../../../../store/actions/Polls_actions";
import {
  getCurrentDate,
  getNextDay,
  getEndTimeWitlCeilFunction,
  getStartTimeWithCeilFunction,
  incrementDateforPropsedMeeting,
} from "../../../../../commen/functions/time_formatter";
import { SaveMeetingDetialsNewApiFunction, GetAllMeetingTypesNewFunction } from "../../../../../store/actions/NewMeetingActions";
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
  const userID = localStorage.getItem("userID");
  const calendRef = useRef();
  let OrganizationID = localStorage.getItem("organizationID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [error, seterror] = useState(false);
  const [sendResponseVal, setSendResponseVal] = useState("");
  const [participantUsers, setParticipantUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersParticipants, setMembersParticipants] = useState([]);
  const [selectedsearch, setSelectedsearch] = useState([]);
  const [meetingTypeDetails, setMeetingTypeDetails] = useState({
    MeetingType: {
      PK_MTID: 1,
      Type: t("Board-meeting"),
    },
  });
  const [meetingTypeDropdown, setmeetingTypeDropdown] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const getStartTime = getStartTimeWithCeilFunction();
  const getEndTime = getEndTimeWitlCeilFunction();
  const getCurrentDateforMeeting = getCurrentDate();
  const getNextDateforMeeting = {
    dateFormat: getNextDay(),
  };

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
      selectedOption: getCurrentDateforMeeting.dateFormat,
      dateForView: getCurrentDateforMeeting.DateGMT,
      startDate: getStartTime?.formattedTime,
      startTime: getStartTime?.newFormatTime,
      endDate: getEndTime?.formattedTime,
      endTime: getEndTime?.newFormatTime,
    },
  ]);

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
    let newParticpantData = PollsReducer.gellAllCommittesandGroups;
    try {
      if (newParticpantData !== null && newParticpantData !== undefined) {
        let temp = [];
        if (Object.keys(newParticpantData).length > 0) {
          if (Object.keys(newParticpantData.groups).length > 0) {
            newParticpantData.groups.forEach((a, index) => {
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
                        className='d-flex gap-2 align-items-center'>
                        <img
                          src={GroupIcon}
                          height='16.45px'
                          width='18.32px'
                          draggable='false'
                          alt=''
                        />
                        <span className={styles["NameDropDown"]}>
                          {a.groupName}
                        </span>
                      </Col>
                    </Row>
                  </>
                ),
                // profilePic: GroupIcon,
                type: 1,
              };
              temp.push(newData);
            });
          }
          if (Object.keys(newParticpantData.committees).length > 0) {
            newParticpantData.committees.forEach((a, index) => {
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
                        className='d-flex gap-2 align-items-center'>
                        <img
                          src={committeeicon}
                          height='16.45px'
                          width='18.32px'
                          draggable='false'
                          alt=''
                        />
                        <span className={styles["NameDropDown"]}>
                          {a.committeeName}
                        </span>
                      </Col>
                    </Row>
                  </>
                ),
                // profilePic: committeeicon,

                type: 2,
              };
              temp.push(newData);
            });
          }
          if (Object.keys(newParticpantData.organizationUsers).length > 0) {
            let filterOutCreatorUser =
              newParticpantData?.organizationUsers?.filter(
                (data, index) => Number(data?.userID) !== Number(userID)
              );
            filterOutCreatorUser.forEach((a, index) => {
              let newData = {
                value: a.userID,
                name: a.userName,
                // profilePic: a?.profilePicture?.displayProfilePictureName,
                label: (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className='d-flex gap-2 align-items-center'>
                        <img
                          src={`data:image/jpeg;base64,${a?.profilePicture?.displayProfilePictureName}`}
                          // src={}
                          alt=''
                          className={styles["UserProfilepic"]}
                          width='18px'
                          height='18px'
                          draggable='false'
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
    } catch {}
  }, [PollsReducer.gellAllCommittesandGroups]);

  useEffect(() => {
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }
  }, []);

  useEffect(() => {
    try {
      if (
        getALlMeetingTypes.meetingTypes !== null &&
        getALlMeetingTypes.meetingTypes !== undefined
      ) {
        let Newdata = [];
        getALlMeetingTypes.meetingTypes.forEach((data, index) => {
          Newdata.push({
            value: data.pK_MTID,
            label: data.type,
          });
          setMeetingTypeDetails({
            ...meetingTypeDetails,
            MeetingType: {
              PK_MTID: getALlMeetingTypes.meetingTypes[0].pK_MTID,
              Type: getALlMeetingTypes.meetingTypes[0].type,
            },
          });
        });
        setmeetingTypeDropdown(Newdata);
      }
    } catch (error) {}
  }, [getALlMeetingTypes.meetingTypes]);

  //onChange function Search
  const onChangeSearch = (event) => {
    console.log(event, "eventeventeventevent");
    setParticipantUsers(event);
    // setParticipantUsers(e.target.value.trimStart());
  };

  //onSearch function
  const onSearch = (name, id, type, item) => {
    let newOrganizersData = PollsReducer.gellAllCommittesandGroups;
    let tem = [...membersParticipants];
    if (type === 1) {
      // Groups Search
      let check1 = newOrganizersData.groups.find(
        (data, index) => data.groupID === id
      );
      if (check1 !== undefined) {
        let groupUsers = check1.groupUsers;
        if (Object.keys(groupUsers).length > 0) {
          groupUsers.forEach((gUser, index) => {
            let check2 = membersParticipants.find(
              (data, index) => data.UserID === gUser.userID
            );
            if (check2 !== undefined) {
            } else {
              let newUser = {
                userName: gUser.userName,
                userID: gUser.userID,
                displayPicture: gUser.profilePicture.displayProfilePictureName,
                email: gUser.emailAddress,
                IsPrimaryOrganizer: false,
                IsOrganizerNotified: false,
                Title: "",
                isRSVP: false,
                participantRole: {
                  participantRole: "Participant",
                  participantRoleID: 2,
                },
                isComingApi: false,
              };
              tem.push(newUser);
            }
          });
        }
      }
    } else if (type === 2) {
      // Committees Search
      let check1 = newOrganizersData.committees.find(
        (data, index) => data.committeeID === id
      );

      if (check1 !== undefined) {
        let committeesUsers = check1.committeeUsers;
        if (Object.keys(committeesUsers).length > 0) {
          committeesUsers.forEach((cUser, index) => {
            let check2 = membersParticipants.find(
              (data, index) => data.UserID === cUser.userID
            );
            if (check2 !== undefined) {
            } else {
              let newUser = {
                userName: cUser.userName,
                userID: cUser.userID,
                displayPicture: cUser.profilePicture.displayProfilePictureName,
                email: cUser.emailAddress,
                IsPrimaryOrganizer: false,
                IsOrganizerNotified: false,
                Title: "",
                isRSVP: false,
                participantRole: {
                  participantRole: "Participant",
                  participantRoleID: 2,
                },
                isComingApi: false,
              };
              tem.push(newUser);
            }
          });
        }
      }
    } else if (type === 3) {
      // User Search
      let check1 = membersParticipants.find(
        (data, index) => data.UserID === id
      );

      if (check1 !== undefined) {
      } else {
        let check2 = newOrganizersData.organizationUsers.find(
          (data, index) => data.userID === id
        );
        if (check2 !== undefined) {
          let newUser = {
            userName: check2.userName,
            userID: check2.userID,
            displayPicture: check2.profilePicture.displayProfilePictureName,
            email: check2.emailAddress,
            IsPrimaryOrganizer: false,
            IsOrganizerNotified: false,
            Title: "",
            isRSVP: false,
            participantRole: {
              participantRole: "Participant",
              participantRoleID: 2,
            },
            isComingApi: false,
          };
          tem.push(newUser);
        }
      }
    }
    const uniqueData = new Set(tem.map(JSON.stringify));

    const result = Array.from(uniqueData).map(JSON.parse);
    setMembersParticipants(result);
    setParticipantUsers([]);
  };

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  //Removing the Added Participants
  const hanleRemovingParticipants = (index) => {
    console.log(index, "indexindexindexindex");
    let removeParticipant = [...membersParticipants];
    removeParticipant.splice(index, 1);
    setMembersParticipants(removeParticipant);
  };

  //Adding the Dates Rows

  const addRow = () => {
    const lastRow = rows[rows.length - 1];

    if (isValidRow(lastRow)) {
      let { DateGMT, dateFormat } = incrementDateforPropsedMeeting(
        lastRow.dateForView
      );
      setRows([
        ...rows,
        {
          selectedOption: dateFormat,
          dateForView: DateGMT,
          startDate: getStartTime?.formattedTime,
          startTime: getStartTime?.newFormatTime,
          endDate: getEndTime?.formattedTime,
          endTime: getEndTime?.newFormatTime,
        },
      ]);
    }
  };
  //Validation For Checking that the Row Should Not Be Empty Before Inserting the Another
  const isValidRow = (row) => {
    console.log(row, "isValidRowisValidRowisValidRow");
    return (
      row.selectedOption !== "" && row.startDate !== "" && row.endDate !== ""
    );
  };

  //OnChange Function For Select Dates
  const handleStartDateChange = (index, date) => {
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
        if (formattedTime <= updatedRows[index - 1].endDate) {
          setOpen({
            flag: true,
            message: t(
              "Selected-start-time-should-not-be-less-than-the-previous-endTime"
            ),
          });
          updatedRows[index].startDate = getStartTime?.formattedTime;
          updatedRows[index].startTime = getStartTime?.newFormatTime;
          setRows(updatedRows);
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
            updatedRows[index].startDate = formattedTime;
            updatedRows[index].startTime = newDate;
            setRows(updatedRows);
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
          updatedRows[index].startDate = formattedTime;
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
          return;
        } else {
          updatedRows[index].startDate = formattedTime;
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
        }
      }
    } else {
    }
  };

  const handleEndDateChange = (index, date) => {
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
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
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
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          return;
        } else {
          updatedRows[index].endDate = formattedTime;
          updatedRows[index].endTime = newDate;
          setRows(updatedRows);
        }
      }
      // }
    } else {
    }
  };

  const changeDateStartHandler = (date, index) => {
    try {
      let newDate = new Date(date);
      let DateDate = new DateObject(date).format("YYYYMMDD");
      const updatedRows = [...rows];
      updatedRows[index].selectedOption = DateDate;
      updatedRows[index].dateForView = newDate;
      setRows(updatedRows);
      // if (
      //   index > 0 &&
      //   Number(DateDate) < Number(updatedRows[index - 1].selectedOption)
      // ) {
      //   setOpen({
      //     flag: true,
      //     message: t("Selected-date-should-not-be-less-than-the-previous-one"),
      //   });
      //   return;
      // } else {

      // }
    } catch {}
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
    let DateDate = convertToUTC(meetingDateValueFormat);
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

    console.log(rows, "sortedDatessortedDates");

    //For Set Proposed  Dates
    let ProposedDates = [];
    rows.forEach((data, index) => {
      ProposedDates.push({
        ProposedDate: createConvert(data.selectedOption + data.startDate).slice(
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

    // Sorting the Dates array
    let sortedDates = ProposedDates.sort((a, b) => {
      if (a.ProposedDate !== b.ProposedDate) {
        return a.ProposedDate.localeCompare(b.ProposedDate);
      } else if (a.StartTime !== b.StartTime) {
        return a.StartTime.localeCompare(b.StartTime);
      } else {
        return a.EndTime.localeCompare(b.EndTime);
      }
    });

    console.log(sortedDates, "sortedDatessortedDates");

    if (
      proposedMeetingDetails.MeetingTitle !== "" &&
      membersParticipants.length !== 0 &&
      sendResponseVal !== "" &&
      rows.length !== 1
    ) {
      let data = {
        MeetingDetails: {
          MeetingID: 0,
          MeetingTitle: proposedMeetingDetails.MeetingTitle,
          MeetingType: meetingTypeDetails.MeetingType,
          Location: "",
          Description: proposedMeetingDetails.Description,
          IsVideoChat: true,
          IsTalkGroup: false,
          OrganizationId: Number(OrganizationID),
          MeetingDates: Dates[0] ? [Dates[0]] : [],
          MeetingReminders: [4],
          Notes: "",
          AllowRSVP: true,
          NotifyOrganizerOnRSVP: true,
          ReucurringMeetingID: 1,
          VideoURL: "",
          MeetingStatusID: 11,
        },
      };
      console.log(data, "sortedDatessortedDates");

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
          proposedMeetingDetails,
          setDataroomMapFolderId,
          membersParticipants,
          sortedDates,
          sendResponseBy.date,
          setProposedNewMeeting
        )
      );

      seterror(false);
    } else if (
      proposedMeetingDetails.MeetingTitle === "" &&
      membersParticipants.length === 0 &&
      sendResponseVal === ""
    ) {
      seterror(true);
    } else {
      seterror(true);
    }
  };

  //handle Change for Decription and Title Of meeting
  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "MeetingTitle") {
      // let valueCheck = containsStringandNumericCharacters(value);
      if (value !== "") {
        setProposedMeetingDetails({
          ...proposedMeetingDetails,
          MeetingTitle: value.trimStart(),
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

  //handle change Meeting Type Selector
  const handleMeetingSelectChange = (selectedOption) => {
    setMeetingTypeDetails({
      ...meetingTypeDetails,
      MeetingType: {
        PK_MTID: selectedOption.value,
        Type: selectedOption.label,
      },
    });
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

  const today = moment().startOf("day");
  const firstSelectedDate = moment(rows[0].selectedOption, "YYYYMMDD").startOf(
    "day"
  ); // Date selected at zero index
  const minSelectableDate = today.isSameOrBefore(firstSelectedDate)
    ? today
    : firstSelectedDate;
  const maxSelectableDate = firstSelectedDate;

  //Custom Filter for Selector

  const customFilter = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  const handleClickAddParticipants = () => {
    let newOrganizersData = PollsReducer.gellAllCommittesandGroups;
    console.log(newOrganizersData, "newOrganizersDatanewOrganizersData")
    let tem = [...membersParticipants];
    if (participantUsers.length > 0) {
      participantUsers.forEach((userData, index) => {
        if (userData.type === 1) {
          // Groups Search
          let check1 = newOrganizersData.groups.find(
            (data, index) => data.groupID === userData.value
          );
          if (check1 !== undefined) {
            let groupUsers = check1.groupUsers;
            if (Object.keys(groupUsers).length > 0) {
              groupUsers
                .filter(
                  (groupFilter, index) =>
                    Number(groupFilter.userID) !== Number(userID)
                )
                .forEach((gUser, index) => {
                  let check2 = membersParticipants.find(
                    (data, index) => data.UserID === gUser.userID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: gUser.userName,
                      userID: gUser.userID,
                      displayPicture:
                        gUser.profilePicture.displayProfilePictureName,
                      email: gUser.emailAddress,
                      IsPrimaryOrganizer: false,
                      IsOrganizerNotified: false,
                      Title: "",
                      isRSVP: false,
                      participantRole: {
                        participantRole: "Participant",
                        participantRoleID: 2,
                      },
                      isComingApi: false,
                    };
                    tem.push(newUser);
                  }
                });
            }
          }
        } else if (userData.type === 2) {
          // Committees Search
          let check1 = newOrganizersData.committees.find(
            (data, index) => data.committeeID === userData.value
          );

          if (check1 !== undefined) {
            let committeesUsers = check1.committeeUsers;
            if (Object.keys(committeesUsers).length > 0) {
              committeesUsers
                .filter(
                  (filterData, index) =>
                    Number(filterData.userID) !== Number(userID)
                )
                .forEach((cUser, index) => {
                  let check2 = membersParticipants.find(
                    (data, index) => data.UserID === cUser.userID
                  );
                  if (check2 !== undefined) {
                  } else {
                    let newUser = {
                      userName: cUser.userName,
                      userID: cUser.userID,
                      displayPicture:
                        cUser.profilePicture.displayProfilePictureName,
                      email: cUser.emailAddress,
                      IsPrimaryOrganizer: false,
                      IsOrganizerNotified: false,
                      Title: "",
                      isRSVP: false,
                      participantRole: {
                        participantRole: "Participant",
                        participantRoleID: 2,
                      },
                      isComingApi: false,
                    };
                    tem.push(newUser);
                  }
                });
            }
          }
        } else if (userData.type === 3) {
          // User Search
          let check1 = membersParticipants.find(
            (data, index) => data.UserID === userData.value
          );

          if (check1 !== undefined) {
          } else {
            let check2 = newOrganizersData.organizationUsers.find(
              (data, index) => data.userID === userData.value
            );
            if (check2 !== undefined) {
              let newUser = {
                userName: check2.userName,
                userID: check2.userID,
                displayPicture: check2.profilePicture.displayProfilePictureName,
                email: check2.emailAddress,
                IsPrimaryOrganizer: false,
                IsOrganizerNotified: false,
                Title: "",
                isRSVP: false,
                participantRole: {
                  participantRole: "Participant",
                  participantRoleID: 2,
                },
                isComingApi: false,
              };
              tem.push(newUser);
            }
          }
        }
        const uniqueData = new Set(tem.map(JSON.stringify));
        const result = Array.from(uniqueData).map(JSON.parse);
        setMembersParticipants(result);
        setParticipantUsers([]);
      });
    }
  };

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
                <Row className='mt-1'>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      labelclass={"d-none"}
                      name={"MeetingTitle"}
                      change={HandleChange}
                      value={proposedMeetingDetails.MeetingTitle}
                      maxLength={250}
                    />
                    <Row>
                      <Col>
                        <p
                          className={
                            error && proposedMeetingDetails.MeetingTitle === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }>
                          {t("Please-enter-meeting-title")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className='mt-2'>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Description")}
                      {/* <span className={styles["res_steric"]}>*</span> */}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      name='MeetingDescription'
                      applyClass='TextAreaProposedMeetingDetails'
                      type='text'
                      placeholder={t("Description")}
                      as={"textarea"}
                      labelclass={"d-none"}
                      rows='7'
                      value={proposedMeetingDetails.Description}
                      change={HandleChange}
                      required
                    />
                  </Col>
                </Row>
                <Row className='mt-3'>
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
                      placeholder={t("Add-participant")}
                      classNamePrefix={"selectMember"}
                      isMulti={true}
                      isDisabled={dropdowndata.length === 0 ? true : false}
                      options={dropdowndata}
                      value={participantUsers}
                      components={animatedComponents}
                      onChange={onChangeSearch}
                      filterOption={customFilter}
                      closeMenuOnSelect={false}
                      isClearable={true}
                      isSearchable={true}
                      hideSelectedOptions={true}
                      maxMenuHeight={180}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={2}>
                    <Button
                      text={t("Add")}
                      onClick={handleClickAddParticipants}
                      className={styles["Add_participants"]}
                    />
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_ProposedMeeting"]}>
                    <Row className='mt-2'>
                      {membersParticipants.length > 0
                        ? membersParticipants.map((participant, index) => {
                            console.log(participant, "participantparticipant");
                            return (
                              <>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={12}
                                  className='mt-2'
                                  key={index}>
                                  <Row className='m-0 p-0'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className={styles["Box_for_Assignee"]}>
                                      <Row className='mt-1'>
                                        <Col
                                          lg={10}
                                          md={10}
                                          sm={12}
                                          className='d-flex gap-2 align-items-center'>
                                          <img
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${participant.displayPicture}`}
                                            width='50px'
                                            alt=''
                                            height='50px'
                                            className={styles["ProfilePic"]}
                                          />
                                          <span
                                            className={
                                              styles["ParticipantName"]
                                            }>
                                            {participant.userName}
                                          </span>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={2}
                                          className='d-flex  align-items-center'>
                                          <img
                                            src={CrossIcon}
                                            width='14px'
                                            height='14px'
                                            draggable='false'
                                            style={{ cursor: "pointer" }}
                                            alt=''
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
                              error && membersParticipants.length === 0
                                ? ` ${styles["errorMessage-inLogin"]} `
                                : `${styles["errorMessage-inLogin_hidden"]}`
                            }>
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
                className='d-flex align-items-center justify-content-center'>
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
                    className={styles["Scroller_Proposed_Dates"]}>
                    {rows.length > 0
                      ? rows.map((data, index) => {
                          return (
                            <>
                              <Row key={index}>
                                <Col lg={12} md={12} sm={12} key={index}>
                                  <Row className='mt-2'>
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
                                        calendar={calendarValue}
                                        locale={localValue}
                                        ref={calendRef}
                                        onFocusedDateChange={(value) =>
                                          changeDateStartHandler(value, index)
                                        }
                                        disabled={
                                          (Number(editorRole.status) === 9 ||
                                            Number(editorRole.status) === 8 ||
                                            Number(editorRole.status) === 10) &&
                                          editorRole.role === "Organizer" &&
                                          isEditMeeting === true
                                            ? true
                                            : (Number(editorRole.status) ===
                                                11 ||
                                                Number(editorRole.status) ===
                                                  2 ||
                                                Number(editorRole.status) ===
                                                  1 ||
                                                Number(editorRole.status) ===
                                                  12 ||
                                                Number(editorRole.status) ===
                                                  10) &&
                                              editorRole.role ===
                                                "Agenda Contributor" &&
                                              isEditMeeting === true
                                            ? true
                                            : false
                                        }
                                      />
                                      <p
                                        className={
                                          error && data.selectedOption === ""
                                            ? ` ${styles["errorMessage-inLogin"]} `
                                            : `${styles["errorMessage-inLogin_hidden"]}`
                                        }>
                                        {t("Scheduled-date-is-required")}
                                      </p>
                                    </Col>
                                    <Col
                                      lg={3}
                                      md={3}
                                      sm={3}
                                      className='timePicker'>
                                      <DatePicker
                                        arrowClassName='arrowClass'
                                        containerClassName='containerClassTimePicker'
                                        className='timePicker'
                                        disableDayPicker
                                        inputClass='inputTImeMeeting'
                                        calendar={calendarValue}
                                        locale={localValue}
                                        format='hh:mm A'
                                        selected={data.startDate}
                                        // onOpen={() => handleOpenStartTime(index)}
                                        value={data.startTime}
                                        editable={false}
                                        plugins={[<TimePicker hideSeconds />]}
                                        onChange={(date) =>
                                          handleStartDateChange(index, date)
                                        }
                                        disabled={
                                          (Number(editorRole.status) === 9 ||
                                            Number(editorRole.status) === 8 ||
                                            Number(editorRole.status) === 10) &&
                                          editorRole.role === "Organizer" &&
                                          isEditMeeting === true
                                            ? true
                                            : (Number(editorRole.status) ===
                                                11 ||
                                                Number(editorRole.status) ===
                                                  2 ||
                                                Number(editorRole.status) ===
                                                  1 ||
                                                Number(editorRole.status) ===
                                                  12 ||
                                                Number(editorRole.status) ===
                                                  10) &&
                                              editorRole.role ===
                                                "Agenda Contributor" &&
                                              isEditMeeting === true
                                            ? true
                                            : false
                                        }
                                      />
                                      <p
                                        className={
                                          error && data.startDate === ""
                                            ? ` ${styles["errorMessage-inLogin"]} `
                                            : `${styles["errorMessage-inLogin_hidden"]}`
                                        }>
                                        {t("start-time-is-required")}
                                      </p>
                                    </Col>
                                    <Col
                                      lg={1}
                                      md={1}
                                      sm={12}
                                      className='d-flex justify-content-center align-items-center'>
                                      <img
                                        draggable={false}
                                        src={desh}
                                        width='19.02px'
                                        alt=''
                                      />
                                    </Col>
                                    <Col
                                      lg={3}
                                      md={3}
                                      sm={12}
                                      // className="d-flex justify-content-end"
                                    >
                                      <DatePicker
                                        arrowClassName='arrowClass'
                                        containerClassName='containerClassTimePicker'
                                        className='timePicker'
                                        disableDayPicker
                                        inputClass='inputTImeMeeting'
                                        calendar={calendarValue}
                                        locale={localValue}
                                        value={data.endTime}
                                        format='hh:mm A'
                                        // onOpen={() => handleOpenEndTime(index)}
                                        // onOpen={() => handleOpenStartTime()}
                                        selected={data.endDate}
                                        plugins={[<TimePicker hideSeconds />]}
                                        editable={false}
                                        onChange={(date) =>
                                          handleEndDateChange(index, date)
                                        }
                                        disabled={
                                          (Number(editorRole.status) === 9 ||
                                            Number(editorRole.status) === 8 ||
                                            Number(editorRole.status) === 10) &&
                                          editorRole.role === "Organizer" &&
                                          isEditMeeting === true
                                            ? true
                                            : (Number(editorRole.status) ===
                                                11 ||
                                                Number(editorRole.status) ===
                                                  2 ||
                                                Number(editorRole.status) ===
                                                  1 ||
                                                Number(editorRole.status) ===
                                                  12 ||
                                                Number(editorRole.status) ===
                                                  10) &&
                                              editorRole.role ===
                                                "Agenda Contributor" &&
                                              isEditMeeting === true
                                            ? true
                                            : false
                                        }
                                      />
                                      <p
                                        className={
                                          error && data.endDate === ""
                                            ? ` ${styles["errorMessage-inLogin"]} `
                                            : `${styles["errorMessage-inLogin_hidden"]}`
                                        }>
                                        {t("end-time-is-required")}
                                      </p>
                                    </Col>
                                    <Col
                                      lg={1}
                                      md={1}
                                      sm={12}
                                      className='d-flex justify-content-end position-relative align-items-center'>
                                      {index === 0 ? null : Number(
                                          editorRole.status
                                        ) === 9 &&
                                        isEditMeeting ===
                                          true ? null : editorRole.role ===
                                          "Agenda Contributor" &&
                                        isEditMeeting === true ? null : (
                                        <img
                                          draggable={false}
                                          src={redcrossIcon}
                                          width='23px'
                                          alt=''
                                          height='23px'
                                          className={styles["Cross_icon_class"]}
                                          onClick={() => {
                                            HandleCancelFunction(index);
                                          }}
                                        />
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </>
                          );
                        })
                      : null}
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col lg={12} md={12} sm={12}>
                    <Button
                      text={
                        <>
                          <Row className='mt-1'>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='d-flex justify-content-center gap-2 align-items-center'>
                              <img
                                draggable={false}
                                src={plusFaddes}
                                alt=''
                                width='15.87px'
                                height='15.87px'
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
                      disabled={!isValidRow(rows[rows.length - 1])}
                    />
                  </Col>
                  <Row>
                    <Col>
                      <p
                        className={
                          error && rows.length === 1
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }>
                        {t("Add-at-least-two-proposed-dates")}
                      </p>
                    </Col>
                  </Row>
                </Row>
                <Row className='mt-3'>
                  <Col lg={6} md={6} sm={6}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className='d-flex flex-column flex-wrap'>
                        <span className={styles["Sub_headings"]}>
                          {t("Meeting-type")}{" "}
                          <span className={styles["res_steric"]}>*</span>
                        </span>
                        <Select
                          options={meetingTypeDropdown}
                          placeholder={t("Meeting-type")}
                          value={{
                            value: meetingTypeDetails.MeetingType?.PK_MTID,
                            label: meetingTypeDetails.MeetingType?.Type,
                          }}
                          onChange={handleMeetingSelectChange}
                          isSearchable={false}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className='d-flex flex-column flex-wrap justify-content-end'>
                        <span className={styles["Sub_headings"]}>
                          {t("Send-response-by")}{" "}
                          <span className={styles["res_steric"]}>*</span>
                        </span>

                        <DatePicker
                          value={sendResponseVal === "" ? "" : sendResponseVal}
                          selected={
                            sendResponseBy.date === ""
                              ? ""
                              : sendResponseBy.date
                          }
                          format={"DD/MM/YYYY"}
                          minDate={minSelectableDate.toDate()}
                          maxDate={maxSelectableDate.toDate()}
                          placeholder='DD/MM/YYYY'
                          render={
                            <InputIcon
                              placeholder='DD/MM/YYYY'
                              className='datepicker_input'
                            />
                          }
                          editable={false}
                          className='proposedMeetindatesDatePicker'
                          onOpenPickNewDate={true}
                          inputMode=''
                          calendar={calendarValue}
                          locale={localValue}
                          ref={calendRef}
                          onFocusedDateChange={(value) =>
                            SendResponseHndler(value)
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <Row>
                          <Col>
                            <p
                              className={
                                error && sendResponseVal === ""
                                  ? ` ${styles["errorMessage-inLogin"]} `
                                  : `${styles["errorMessage-inLogin_hidden"]}`
                              }>
                              {t("Please-select-send-response-by-date")}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className='mt-5'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-end gap-2'>
                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_Button_Proposed_Meeting"]}
                      onClick={handleCancelButtonProposedMeeting}
                    />

                    <Button
                      text={t("Propose")}
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
