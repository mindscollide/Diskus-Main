import React, { useEffect, useRef } from "react";
import styles from "./ProposedNewMeeting.module.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
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
} from "../../../../../components/elements";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import desh from "../../../../../assets/images/desh.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import InputIcon from "react-multi-date-picker/components/input_icon";
import moment from "moment";
import {
  forRecentActivity,
  multiDatePickerDateChangIntoUTC,
  resolutionResultTable,
} from "../../../../../commen/functions/date_formater";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import makeAnimated from "react-select/animated";
import { getAllCommitteesandGroups } from "../../../../../store/actions/Polls_actions";
import {
  getCurrentDate,
  getEndTimeWitlCeilFunction,
  getStartTimeWithCeilFunction,
  incrementDateforPropsedMeeting,
} from "../../../../../commen/functions/time_formatter";
import {
  clearResponseNewMeetingReducerMessage,
  GetAllMeetingDetialsData,
  GetAllMeetingTypesNewFunction,
  newMeetingGlobalLoader,
  ParticipantsData,
  proposedMeetingData,
  SaveMeetingDetialsNewApiFunction,
  searchNewUserMeeting,
} from "../../../../../store/actions/NewMeetingActions";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { useMeetingContext } from "../../../../../context/MeetingContext";
const ProposedNewMeeting = ({
  setProposedNewMeeting,
  isEditMeeting,
  isProposedMeetEdit,
  setSceduleMeeting,
  setorganizers,
  setmeetingDetails,
  setCurrentMeetingID,
  setDataroomMapFolderId,
  currentMeeting,
  setIsProposedMeetEdit,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editorRole } = useMeetingContext();

  const animatedComponents = makeAnimated();
  const userID = localStorage.getItem("userID");
  const calendRef = useRef();
  let OrganizationID = localStorage.getItem("organizationID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  const gellAllCommittesandGroups = useSelector(
    (state) => state.PollsReducer.gellAllCommittesandGroups
  );

  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );
  const getAllParticipants = useSelector(
    (state) => state.NewMeetingreducer.getAllSavedparticipants
  );
  const getAllProposedDatesEditFlow = useSelector(
    (state) => state.NewMeetingreducer.getAllProposedDates
  );
  const getAllMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.getAllMeetingDetails
  );

  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );

  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [error, seterror] = useState(false);
  const [participantUsers, setParticipantUsers] = useState([]);
  const [membersParticipants, setMembersParticipants] = useState([]);
  const [meetingTypeDropdown, setmeetingTypeDropdown] = useState([]);
  const [dropdowndata, setDropdowndata] = useState([]);
  const getStartTime = getStartTimeWithCeilFunction();
  const getEndTime = getEndTimeWitlCeilFunction();
  const getCurrentDateforMeeting = getCurrentDate();
  const [editProposedMeetingID, setEditProposedMeetingID] = useState(0);
  const [EditmeetingTypeDetails, setEditmeetingTypeDetails] = useState({
    MeetingType: {
      PK_MTID: 0,
      Type: "",
    },
  });
  console.log(isProposedMeetEdit, "isProposedMeetEditisProposedMeetEdit");
  const [meetingTypeDetails, setMeetingTypeDetails] = useState({
    MeetingType: {
      PK_MTID: isProposedMeetEdit
        ? EditmeetingTypeDetails.MeetingType.PK_MTID
        : 0,
      Type: isProposedMeetEdit
        ? EditmeetingTypeDetails.MeetingType.Type
        : t("Board-meeting"),
    },
  });

  const [proposedMeetingDetails, setProposedMeetingDetails] = useState({
    MeetingTitle: "",
    Description: "",
  });
  //Now Working on Edit Flow Proposed new  Meeting
  useEffect(() => {
    try {
      if (getAllMeetingDetails !== null && getAllMeetingDetails !== undefined) {
        const EditFlowData = getAllMeetingDetails.advanceMeetingDetails;
        console.log(EditFlowData, "EditFlowData");
        if (isProposedMeetEdit) {
          setEditmeetingTypeDetails({
            MeetingType: {
              PK_MTID: EditFlowData.meetingType.pK_MTID,
              Type: EditFlowData.meetingType.type,
            },
          });

          // Update meetingTypeDetails based on the edit flow
          setMeetingTypeDetails({
            MeetingType: {
              PK_MTID: EditFlowData.meetingType.pK_MTID,
              Type: EditFlowData.meetingType.type,
            },
          });

          setProposedMeetingDetails({
            MeetingTitle: EditFlowData.meetingTitle,
            Description: EditFlowData.description,
          });

          setEditProposedMeetingID(EditFlowData.meetingID);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [getAllMeetingDetails, isProposedMeetEdit]);

  //Getting All the Participants for edit flow
  useEffect(() => {
    try {
      if (
        getAllParticipants &&
        getAllParticipants.length > 0 &&
        getAllParticipants !== undefined
      ) {
        setMembersParticipants(getAllParticipants);
        setDropdowndata(getAllParticipants);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [getAllParticipants]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  //Send Response By Date
  const [sendResponseBy, setSendResponseBy] = useState({
    date: "",
  });

  //state for adding Date and Time Rows
  const [rows, setRows] = useState([
    {
      dateSelect: getCurrentDateforMeeting.DateGMT,
      startTime: getStartTime?.newFormatTime,
      endTime: getEndTime?.newFormatTime,
    },
  ]);

  //Getting All Groups And Committies By Organization ID
  useEffect(() => {
    dispatch(getAllCommitteesandGroups(navigate, t, false));
    dispatch(newMeetingGlobalLoader(false));
    return () => {
      dispatch(proposedMeetingData());
      dispatch(ParticipantsData());
      dispatch(GetAllMeetingDetialsData());
      setIsProposedMeetEdit(false);
      setProposedMeetingDetails({
        MeetingTitle: "",
        Description: "",
      });
      setSendResponseBy({
        date: "",
      });
    };
  }, []);

  // Getting all proposed Dates data
  useEffect(() => {
    try {
      if (
        getAllProposedDatesEditFlow &&
        getAllProposedDatesEditFlow !== undefined &&
        getAllProposedDatesEditFlow.meetingProposedDates.length > 0 &&
        isProposedMeetEdit
      ) {
        let DatesDataEditFlow =
          getAllProposedDatesEditFlow.meetingProposedDates;
        console.log(DatesDataEditFlow, "DatesDataEditFlowDatesDataEditFlow");

        let dateArray = DatesDataEditFlow.map((datedata) => {
          console.log(datedata, "datedata");
          if (
            datedata.proposedDate === "10000101" &&
            datedata.endTime === "000000" &&
            datedata.startTime === "000000"
          ) {
            return false;
          } else {
            return {
              dateSelect: resolutionResultTable(
                datedata.proposedDate + datedata.startTime
              ),
              startTime: resolutionResultTable(
                datedata.proposedDate + datedata.startTime
              ),
              endTime: resolutionResultTable(
                datedata.proposedDate + datedata.endTime
              ),
            };
          }
        });
        setRows(dateArray);
        let convertResponseDate = forRecentActivity(
          getAllProposedDatesEditFlow.deadLineDate + "000000"
        );

        setSendResponseBy({
          ...sendResponseBy,
          date: convertResponseDate,
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [getAllProposedDatesEditFlow]);

  //Getting All Groups And Committees and users data from polls api
  useEffect(() => {
    let newParticpantData = gellAllCommittesandGroups;
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
                ),
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
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={committeeicon}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                        alt=""
                      />
                      <span className={styles["NameDropDown"]}>
                        {a.committeeName}
                      </span>
                    </Col>
                  </Row>
                ),
                type: 2,
              };
              temp.push(newData);
            });
          }

          if (Object.keys(newParticpantData.organizationUsers).length > 0) {
            let filteredUsers = newParticpantData.organizationUsers;

            // Filter out the creator user
            let filterOutCreatorUser = filteredUsers.filter(
              (data, index) => Number(data?.userID) !== Number(userID)
            );

            filterOutCreatorUser.forEach((a, index) => {
              let newData = {
                value: a.userID,
                name: a.userName,
                label: (
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
                ),
                type: 3,
              };
              temp.push(newData);
            });

            // Check if isProposedMeetEdit is true
            if (isProposedMeetEdit && membersParticipants?.length > 0) {
              // Filter out the users that are already part of membersParticipants
              temp = temp.filter(
                (participant) =>
                  !membersParticipants.some(
                    (member) =>
                      Number(member.userID) === Number(participant.value)
                  )
              );
            }
          }

          setDropdowndata(temp);
        } else {
          setDropdowndata([]);
        }
      }
    } catch (error) {
      console.error("Error processing participant data:", error);
    }
  }, [
    gellAllCommittesandGroups,
    isProposedMeetEdit,
    membersParticipants,
    userID,
  ]);

  //Getting all meeting Types
  useEffect(() => {
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }
  }, []);

  //Getting Data of All meeting types
  useEffect(() => {
    try {
      if (
        getALlMeetingTypes.meetingTypes !== null &&
        getALlMeetingTypes.meetingTypes !== undefined
      ) {
        const Newdata = getALlMeetingTypes.meetingTypes.map((data) => ({
          value: data.pK_MTID,
          label: data.type,
        }));
        setmeetingTypeDropdown(Newdata);

        // Only set meetingTypeDetails if it wasn't set from the Edit flow
        if (!isProposedMeetEdit) {
          setMeetingTypeDetails({
            MeetingType: {
              PK_MTID: getALlMeetingTypes.meetingTypes[0].pK_MTID,
              Type: getALlMeetingTypes.meetingTypes[0].type,
            },
          });
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [getALlMeetingTypes.meetingTypes, isProposedMeetEdit]);

  //onChange function Search
  const onChangeSearch = (event) => {
    setParticipantUsers(event);
  };

  //Removing the Added Participants
  const hanleRemovingParticipants = (index) => {
    let removeParticipant = [...membersParticipants];
    removeParticipant.splice(index, 1);
    setMembersParticipants(removeParticipant);
  };

  //Adding the Dates Rows
  const addRow = () => {
    if (rows.length >= 5) {
      showMessage(t("Not-more-than-5-dates-are-allowed"), "error", setOpen);
      return;
    }
    const lastRow = rows[rows.length - 1];
    if (isValidRow(lastRow)) {
      let { DateGMT } = incrementDateforPropsedMeeting(lastRow.dateSelect);
      setRows([
        ...rows,
        {
          dateSelect: DateGMT,
          startTime: getStartTime?.newFormatTime,
          endTime: getEndTime?.newFormatTime,
        },
      ]);
    }
  };

  //Validating Row Function if its Empty or not
  const isValidRow = (row) => {
    return row.dateSelect !== "" && row.startTime !== "" && row.endTime !== "";
  };

  //Handle StartTime Change
  const handleStartTimeChange = (index, date) => {
    let newDate = new Date(date); //Getting the instance of the date

    if (newDate instanceof Date && !isNaN(newDate)) {
      const updatedRows = [...rows]; // Making copy of the array of object

      if (
        //Main Check of Checking that is the upper row and lower date are same along if the index is > 0
        index > 0 &&
        updatedRows[index - 1].dateSelect?.toDateString() ===
          updatedRows[index].dateSelect?.toDateString()
      ) {
        if (
          //Checks that if the start time of lower row is less then end time of upper row (same date scenario)
          updatedRows[index - 1].startTime <= updatedRows[index - 1].endTime
        ) {
          showMessage(
            t(
              "Selected-start-time-should-not-be-less-than-the-previous-endTime"
            ),
            "error",
            setOpen
          );
          //if the scnario gets exist paste the current value that is assigned to it already
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
          return;
        } else {
          if (
            //checks the condtion that the start time should not be greater then end time
            updatedRows[index].endTime !== "" &&
            newDate >= updatedRows[index].endTime
          ) {
            showMessage(
              t("Selected-start-time-should-not-be-greater-than-the-endTime"),
              "error",
              setOpen
            );
            updatedRows[index].startTime = newDate;
            setRows(updatedRows);
            return;
          } else {
            updatedRows[index].startTime = newDate;
            setRows(updatedRows);
          }
        }
      } else {
        if (
          updatedRows[index].endTime !== "" &&
          newDate >= updatedRows[index].endTime
        ) {
          showMessage(
            t("Selected-start-time-should-not-be-greater-than-the-endTime"),
            "error",
            setOpen
          );
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
          return;
        } else {
          updatedRows[index].startTime = newDate;
          setRows(updatedRows);
        }
      }
    } else {
    }
  };
  //Handle EndTime Change
  const handleEndTimeChange = (index, date) => {
    let newDate = new Date(date);

    if (newDate instanceof Date && !isNaN(newDate)) {
      const updatedRows = [...rows];

      if (
        index > 0 &&
        updatedRows[index - 1].dateSelect?.toDateString() ===
          updatedRows[index].dateSelect?.toDateString()
      ) {
        if (updatedRows[index - 1].endTime <= updatedRows[index].startTime) {
          showMessage(
            t("Selected-end-time-should-not-be-less-than-the-previous-one"),
            "error",
            setOpen
          );
          updatedRows[index].endTime = newDate;
          return;
        } else {
          updatedRows[index].endTime = newDate;
          setRows(updatedRows);
        }
      } else {
        if (newDate <= updatedRows[index].startTime) {
          showMessage(
            t("Selected-end-time-should-not-be-less-than-start-time"),
            "error",
            setOpen
          );
          updatedRows[index].endTime = newDate;
          return;
        } else {
          updatedRows[index].endTime = newDate;
          setRows(updatedRows);
        }
      }
    } else {
    }
  };
  //Handle Date Selection Change
  const handleDateSelector = (date, index) => {
    try {
      let newDate = new Date(date);
      const updatedRows = [...rows];
      updatedRows[index].dateSelect = newDate;
      setRows(updatedRows);
    } catch (error) {
      console.log(error, "error");
    }
  };

  //Removing the Date Time Rows
  const HandleCancelFunction = (index) => {
    if (index === 0) {
      showMessage(
        t("At-least-one-date-time-slot-is-mandatory"),
        "error",
        setOpen
      );
    } else {
      // Otherwise, remove the record at the given index
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    }
  };

  //Send Response By Handler
  const SendResponseHndler = (date) => {
    setSendResponseBy({
      ...sendResponseBy,
      date: new Date(date),
    });
  };
  //for handling Cancel the ProposedMeeting Page
  const handleCancelButtonProposedMeeting = () => {
    setProposedNewMeeting(false);
    setIsProposedMeetEdit(false);
    dispatch(proposedMeetingData());
    dispatch(ParticipantsData());
    dispatch(GetAllMeetingDetialsData());

    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
      PublishedMeetings: Number(currentView) === 1 ? true : false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
  };

  //For handling  Proposed button ProposedMeeting Page
  const handleProposedButtonProposedMeeting = () => {
    if (isProposedMeetEdit) {
      let Dates = [];

      rows.forEach((data, index) => {
        Dates.push({
          MeetingDate: multiDatePickerDateChangIntoUTC(data.dateSelect).slice(
            0,
            8
          ),
          StartTime: multiDatePickerDateChangIntoUTC(data.startTime).slice(
            8,
            14
          ),
          EndTime: multiDatePickerDateChangIntoUTC(data.endTime).slice(8, 14),
        });
      });

      let ProposedDates = [];
      rows.forEach((data, index) => {
        ProposedDates.push({
          ProposedDate: multiDatePickerDateChangIntoUTC(data.dateSelect).slice(
            0,
            8
          ),
          StartTime: multiDatePickerDateChangIntoUTC(data.startTime).slice(
            8,
            14
          ),
          EndTime: multiDatePickerDateChangIntoUTC(data.endTime).slice(8, 14),
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

      if (
        proposedMeetingDetails.MeetingTitle !== "" &&
        membersParticipants.length !== 0 &&
        sendResponseBy.date !== "" &&
        rows.length !== 1
      ) {
        let data = {
          MeetingDetails: {
            MeetingID: isProposedMeetEdit ? Number(editProposedMeetingID) : 0,
            MeetingTitle: proposedMeetingDetails.MeetingTitle,
            MeetingType: meetingTypeDetails.MeetingType,
            Location: "",
            Description: proposedMeetingDetails.Description,
            IsVideoChat: false,
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
        console.log(data, "datadatadata");
        console.log(sortedDates, "datadatadata");

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
            multiDatePickerDateChangIntoUTC(sendResponseBy.date).slice(0, 8),
            setProposedNewMeeting,
            true
          )
        );

        seterror(false);
      } else if (
        proposedMeetingDetails.MeetingTitle === "" &&
        membersParticipants.length !== 0
      ) {
        seterror(true);
      } else {
        seterror(true);
      }
    } else {
      let Dates = [];

      rows.forEach((data, index) => {
        Dates.push({
          MeetingDate: multiDatePickerDateChangIntoUTC(data.dateSelect).slice(
            0,
            8
          ),
          StartTime: multiDatePickerDateChangIntoUTC(data.startTime).slice(
            8,
            14
          ),
          EndTime: multiDatePickerDateChangIntoUTC(data.endTime).slice(8, 14),
        });
      });

      let ProposedDates = [];
      rows.forEach((data, index) => {
        ProposedDates.push({
          ProposedDate: multiDatePickerDateChangIntoUTC(data.dateSelect).slice(
            0,
            8
          ),
          StartTime: multiDatePickerDateChangIntoUTC(data.startTime).slice(
            8,
            14
          ),
          EndTime: multiDatePickerDateChangIntoUTC(data.endTime).slice(8, 14),
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

      if (
        proposedMeetingDetails.MeetingTitle !== "" &&
        membersParticipants.length !== 0 &&
        sendResponseBy.date !== "" &&
        rows.length !== 1
      ) {
        let data = {
          MeetingDetails: {
            MeetingID: isProposedMeetEdit ? Number(editProposedMeetingID) : 0,
            MeetingTitle: proposedMeetingDetails.MeetingTitle,
            MeetingType: meetingTypeDetails.MeetingType,
            Location: "",
            Description: proposedMeetingDetails.Description,
            IsVideoChat: false,
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
        console.log(data, "datadatadata");
        console.log(sortedDates, "datadatadata");

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
            multiDatePickerDateChangIntoUTC(sendResponseBy.date).slice(0, 8),
            setProposedNewMeeting,
            false
          )
        );

        seterror(false);
      } else if (
        proposedMeetingDetails.MeetingTitle === "" &&
        membersParticipants.length !== 0
      ) {
        seterror(true);
      } else {
        seterror(true);
      }
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
  const firstSelectedDate = moment(rows[0].dateSelect).startOf("day");
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

  //Click Function for adding the participants
  const handleClickAddParticipants = () => {
    let newOrganizersData = gellAllCommittesandGroups;
    console.log(newOrganizersData, "newOrganizersDatanewOrganizersData");

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
                  let check2 = tem.find(
                    (data, index) => data.userID === gUser.userID
                  );
                  if (check2 === undefined) {
                    let newUser = {
                      userName: gUser.userName,
                      userID: gUser.userID,
                      userProfilePicture: {
                        displayProfilePictureName:
                          gUser.profilePicture.displayProfilePictureName,
                      },
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
                  let check2 = tem.find(
                    (data, index) => data.userID === cUser.userID
                  );
                  if (check2 === undefined) {
                    let newUser = {
                      userName: cUser.userName,
                      userID: cUser.userID,
                      userProfilePicture: {
                        displayProfilePictureName:
                          cUser.profilePicture.displayProfilePictureName,
                      },
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
          let check1 = tem.find(
            (data, index) => data.userID === userData.value
          );
          if (check1 === undefined) {
            let check2 = newOrganizersData.organizationUsers.find(
              (data, index) => data.userID === userData.value
            );
            if (check2 !== undefined) {
              let newUser = {
                userName: check2.userName,
                userID: check2.userID,
                userProfilePicture: {
                  displayProfilePictureName:
                    check2.profilePicture.displayProfilePictureName,
                },
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
      });

      // Remove duplicates
      const uniqueData = new Set(tem.map(JSON.stringify));
      const result = Array.from(uniqueData).map(JSON.parse);

      // Set the appropriate state based on isProposedMeetEdit

      setMembersParticipants(result);

      setParticipantUsers([]);
    }
  };

  //Handling response Messege in Porposed New Meeting Will Using Meeting Response messege as the api is same
  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== undefined &&
      ResponseMessage !== null
    ) {
      showMessage(ResponseMessage, "success", setOpen);
      dispatch(clearResponseNewMeetingReducerMessage());
    }
  }, [ResponseMessage]);

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
          <span className={styles["ProposedNewMeetingPaper"]}>
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
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      name="MeetingDescription"
                      applyClass="TextAreaProposedMeetingDetails"
                      type="text"
                      placeholder={t("Description")}
                      as={"textarea"}
                      labelclass={"d-none"}
                      rows="7"
                      value={proposedMeetingDetails.Description}
                      change={HandleChange}
                      required
                    />
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
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_ProposedMeeting"]}
                  >
                    <>
                      <Row className="mt-2">
                        {membersParticipants.length > 0
                          ? membersParticipants.map((participant, index) => {
                              console.log(
                                participant,
                                "participantparticipant"
                              );
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
                                              src={`data:image/jpeg;base64,${participant.userProfilePicture.displayProfilePictureName}`}
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
                                error && membersParticipants.length === 0
                                  ? ` ${styles["errorMessage-inLogin"]} `
                                  : `${styles["errorMessage-inLogin_hidden"]}`
                              }
                            >
                              {t("Add-at-least-one-participant")}
                            </p>
                          </Col>
                        </Row>
                      </Row>
                    </>
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
                          console.log(data, "indexindexindex");
                          return (
                            <>
                              <Row key={index}>
                                <Col lg={12} md={12} sm={12} key={index}>
                                  <Row className="mt-2">
                                    <Col lg={4} md={4} sm={12}>
                                      <DatePicker
                                        value={data.dateSelect}
                                        format={"DD/MM/YYYY"}
                                        minDate={
                                          index > 0
                                            ? moment(
                                                rows[index - 1].dateSelect,
                                                "DD/MM/YYYY"
                                              ).toDate()
                                            : moment().startOf("day").toDate()
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
                                        onFocusedDateChange={(value) =>
                                          handleDateSelector(value, index)
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
                                        }
                                      >
                                        {t("Scheduled-date-is-required")}
                                      </p>
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
                                        value={data.startTime}
                                        editable={false}
                                        plugins={[<TimePicker hideSeconds />]}
                                        onChange={(date) =>
                                          handleStartTimeChange(index, date)
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
                                        }
                                      >
                                        {t("start-time-is-required")}
                                      </p>
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
                                    <Col lg={3} md={3} sm={12}>
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
                                        plugins={[<TimePicker hideSeconds />]}
                                        editable={false}
                                        onChange={(date) =>
                                          handleEndTimeChange(index, date)
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
                                        }
                                      >
                                        {t("end-time-is-required")}
                                      </p>
                                    </Col>
                                    <Col
                                      lg={1}
                                      md={1}
                                      sm={12}
                                      className="d-flex justify-content-end position-relative align-items-center"
                                    >
                                      {Number(editorRole.status) === 9 &&
                                      isEditMeeting ===
                                        true ? null : editorRole.role ===
                                          "Agenda Contributor" &&
                                        isEditMeeting === true ? null : (
                                        <img
                                          draggable={false}
                                          src={redcrossIcon}
                                          width="23px"
                                          alt=""
                                          height="23px"
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
                      disabled={rows.length >= 5}
                    />
                  </Col>
                  <Row>
                    <Col>
                      <p
                        className={
                          error && rows.length === 1
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {t("Add-at-least-two-proposed-dates")}
                      </p>
                    </Col>
                  </Row>
                </Row>
                <Row className="mt-3">
                  <Col lg={6} md={6} sm={6}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex flex-column flex-wrap"
                      >
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
                        className="d-flex flex-column flex-wrap justify-content-end"
                      >
                        <span className={styles["Sub_headings"]}>
                          {t("Send-response-by")}{" "}
                          <span className={styles["res_steric"]}>*</span>
                        </span>

                        <DatePicker
                          value={sendResponseBy.date}
                          format={"DD/MM/YYYY"}
                          minDate={minSelectableDate.toDate()}
                          maxDate={maxSelectableDate.toDate()}
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
                                error && sendResponseBy.date === ""
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
                      text={isProposedMeetEdit ? t("Update") : t("Propose")}
                      className={styles["Proposed_Button_Proposed_Meeting"]}
                      onClick={handleProposedButtonProposedMeeting}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </span>
        </Col>
      </Row>
      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default ProposedNewMeeting;
