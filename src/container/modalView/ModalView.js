import React, { useState, useEffect, useContext, useCallback } from "react";
import "./ModalView.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import {
  EditmeetingDateFormat,
  getCurrentDateTimeUTC,
  newTimeFormaterAsPerUTCFullDate,
  RemoveTimeDashes,
} from "../../commen/functions/date_formater";
import {
  TextField,
  Button,
  Modal,
  EmployeeCard,
  Notification,
  AttachmentViewer,
} from "./../../components/elements";

import { Row, Col, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Check2 } from "react-bootstrap-icons";
import {
  allAssignessList,
  cleareAssigneesState,
  StartMeeting,
  EndMeeting,
} from "../../store/actions/Get_List_Of_Assignees";
import { DownloadFile } from "../../store/actions/Download_action";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  CleareMessegeNewMeeting,
  endMeetingStatusApi,
  FetchMeetingURLApi,
  FetchMeetingURLClipboard,
  LeaveCurrentMeeting,
  searchNewUserMeeting,
} from "../../store/actions/NewMeetingActions";
import copyToClipboard from "../../hooks/useClipBoard";
import { callRequestReceivedMQTT } from "../../store/actions/VideoMain_actions";
import EndMeetingConfirmationModal from "../pages/meeting/EndMeetingConfirmationModal/EndMeetingConfirmationModal";
import { MeetingContext } from "../../context/MeetingContext";

const ModalView = ({ viewFlag, setViewFlag, ModalTitle }) => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignees, NewMeetingreducer, meetingIdReducer, calendarReducer } =
    useSelector((state) => state);
  let activeCall = JSON.parse(localStorage.getItem("activeCall"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("acceptedRoomID"));
  let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
  const { setEndMeetingConfirmationModal } = useContext(MeetingContext);
  const [getMeetID, setMeetID] = useState(0);
  const [initiateVideoModalOto, setInitiateVideoModalOto] = useState(false);
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const [isMinutes, setIsMinutes] = useState(false);
  const [isAttachments, setIsAttachments] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [meetStatus, setMeetStatus] = useState(0);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [meetingReminderID, setMeetingReminderID] = useState([]);
  const [meetingReminderValue, setMeetingReminderValue] = useState("");
  const [objMeetingAgenda, setObjMeetingAgenda] = useState({
    Title: "",
    PresenterName: "",
    URLs: "",
    FK_MDID: 0,
  });

  //Attendees States

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
      PK_MARID: 0,
    },
    AttendeeAvailability: {
      PK_AAID: 1,
    },
  });

  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  // for   dropdown Attendees List
  const [optiosnMeetingAttendeesList, setOptiosnMeetingAttendeesList] =
    useState([]);

  // for   selected Attendees Name
  const [selectedAttendeesName, setSelectedAttendeesName] = useState("");

  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");

  // for   List Of Attachments
  const [attachmentsList, setattachmentsList] = useState([]);

  //all Meeting details
  const [allMeetingDetails, setAllMeetingDetails] = useState([]);
  const [meetingDifference, setMeetingDifference] = useState(0);
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

  let currentLanguage = localStorage.getItem("i18nextLng");

  // for   added participant  Name list
  const [addedParticipantNameList, setAddedParticipantNameList] = useState([]);
  const [startMeetingStatus, setStartMeetingStatus] = useState(false);
  const [endMeetingStatus, setEndMeetingStatus] = useState(false);
  const [isOrganizer, setOrganizer] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [minutesOftheMeatingStatus, setMinutesOftheMeatingStatus] =
    useState(false);
  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
    MeetingTitle: "",
    MeetingDescription: "",
    MeetingTypeID: 0,
    MeetingDate: "",
    MeetingStartTime: "",
    MeetingEndTime: "",
    MeetingLocation: "",
    MeetingReminderID: [],
    MeetingAgendas: [],
    MeetingAttendees: [],
    ExternalMeetingAttendees: [],
    MinutesOfMeeting: [],
    MeetingID: 0,
  });

  const changeSelectDetails = () => {
    setIsDetails(true);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(false);
    setIsAttachments(false);
  };

  const changeSelectAgenda = () => {
    setIsDetails(false);
    setIsAgenda(true);
    setIsAttendees(false);
    setIsMinutes(false);
    setIsAttachments(false);
  };

  const changeSelectAttendees = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(true);
    setIsMinutes(false);
    setIsAttachments(false);
  };

  const navigateToAgenda = () => {
    setIsDetails(false);
    setIsAttendees(false);
    setIsAgenda(true);
    setIsMinutes(false);
    setIsAttachments(false);
  };

  const navigateToAttendees = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsMinutes(false);
    setIsAttendees(true);
    setIsAttachments(false);
  };
  const navigateToMinutes = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(true);
    setIsAttachments(false);
  };
  const changeSelectAttachments = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(false);
    setIsAttachments(true);
  };
  // for reminder id's
  const optionsWithIDs = [
    { label: "On starting of meeting", id: 1 },
    { label: "10 minutes before", id: 2 },
    { label: "30 minutes before", id: 3 },
    { label: "1 hour before", id: 4 },
    { label: "5 hours before", id: 5 },
    { label: "1 day before", id: 6 },
    { label: "3 days before", id: 7 },
    { label: "7 days before", id: 8 },
  ];

  // for reinder options
  const options = [
    "On starting of meeting",
    "10 minutes before",
    "30 minutes before",
    "1 hour before",
    "5 hours before",
    "1 day before",
    "3 days before",
    "7 days before",
  ];

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: "Organizer", id: 1 },
    { label: "Participant", id: 2 },
  ];

  // for Participant options
  const participantOptions = ["Organizer", "Participant"];
  // Selected Dropdown value of Approval
  const reminderHandler = (e, value) => {
    setMeetingReminderValue(value);
    optionsWithIDs.map((data, index) => {
      if (value === data.label) {
        let id = data.id;
        setMeetingReminderID([id]);
        setCreateMeeting({
          ...createMeeting,
          ["MeetingReminderID"]: [id],
        });
      }
    });
  };

  // for all details handler
  const detailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "MeetingStartTime") {
      setCreateMeeting({
        ...createMeeting,
        [name]: RemoveTimeDashes(value),
        ["MeetingEndTime"]: RemoveTimeDashes(value),
      });
    } else if (name === "MeetingDate") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    } else if (name === "MeetingLocation") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    } else if (name === "MeetingTitle") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    } else if (name === "MeetingDescription") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
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

  //for  Join Meeting Copy Link Button State Check

  useEffect(() => {
    try {
      if (Object.keys(assignees.ViewMeetingDetails).length > 0) {
        let check = assignees.ViewMeetingDetails.meetingDetails.isVideoCall;
        let meetingID = Number(
          assignees.ViewMeetingDetails.meetingDetails.pK_MDID
        );
        let StatusCheck = assignees.ViewMeetingDetails.meetingStatus.pK_MSID;
        let Data2 = {
          VideoCallURL: currentMeetingVideoURL,
        };
        if (check) {
          // dispatch(
          //   FetchMeetingURLClipboard(
          //     Data2,
          //     navigate,
          //     t,
          //     currentUserID,
          //     currentOrganization
          //   )
          // );
        }
        setIsVideo(check);
        setMeetID(meetingID);
        setMeetStatus(StatusCheck);
      } else {
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerror");
    }
  }, [assignees.ViewMeetingDetails]);

  // for view data
  useEffect(() => {
    try {
      if (Object.keys(assignees.ViewMeetingDetails).length > 0) {
        let viewData = assignees.ViewMeetingDetails;
        let reminder = [];
        let meetingAgenAtc = [];
        let minutesOfMeeting = [];
        let externalMeetingAttendiesList = [];
        let meetingAgenAtclis = [];
        let rightsButtons = assignees.ViewMeetingDetails.meetingAttendees;
        let meetingStatus = assignees.ViewMeetingDetails.meetingStatus.status;
        const found = rightsButtons.find(
          (element) => element.user.pK_UID === parseInt(createrID)
        );

        if (Object.keys(found).length > 0) {
          const found2 = found.meetingAttendeeRole.pK_MARID;
          if (parseInt(found2) === 1 || parseInt(found2) === 3) {
            setOrganizer(true);
          } else if (parseInt(found2) === 2) {
            setIsParticipant(true);
          } else {
            setOrganizer(false);
            setIsParticipant(false);
          }
        } else {
          setOrganizer(false);
          setIsParticipant(false);
        }
        if (meetingStatus === "1") {
          setStartMeetingStatus(false);
          setEndMeetingStatus(true);
          setMinutesOftheMeatingStatus(false);
        } else if (meetingStatus === "2") {
          setStartMeetingStatus(true);
          setEndMeetingStatus(false);
          setMinutesOftheMeatingStatus(true);
        } else if (meetingStatus === "3") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "4") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "8") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(false);
          setStartMeetingStatus(false);
        } else if (meetingStatus === "10") {
          setMinutesOftheMeatingStatus(false);
          setEndMeetingStatus(false);
          setStartMeetingStatus(false);
        } else {
          setEndMeetingStatus(false);
          setStartMeetingStatus(false);
          setStartMeetingStatus(false);
        }
        viewData.meetingReminders.map((rdata, index) => {
          let pkid = rdata.pK_MRID;
          reminder.push(pkid);
        });
        let reminderoptionvalue = "";
        optionsWithIDs.map((opData, index) => {
          if (opData.id === reminder[0]) {
            reminderoptionvalue = opData.label;
          }
        });
        setMeetingReminderValue(reminderoptionvalue);
        // for meeting attendies
        let List = [];
        let user = meetingAttendeesList;
        let emptyList = [];
        try {
          if (viewData.meetingAttendees != undefined) {
            if (viewData.meetingAttendees.length > 0) {
              viewData.meetingAttendees.map((meetingdata, index) => {
                List.push({
                  name: meetingdata.user.name,
                  designation: meetingdata.user.designation,
                  profilePicture: meetingdata.user.profilePicture,
                  organization: meetingdata.user.organization,
                  role: meetingdata.meetingAttendeeRole.pK_MARID,
                  displayProfilePic: meetingdata.user.displayProfilePictureName,
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
          if (viewData.externalMeetingAttendees != undefined) {
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
                  meetingAgenAtclis.push({
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
            minutesOfMeeting.push({
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
        setattachmentsList(meetingAgenAtclis);
        setCreateMeeting({
          ...createMeeting,
          MeetingID: viewData.meetingDetails.pK_MDID,
          MeetingTitle: viewData.meetingDetails.title,
          MeetingDescription: viewData.meetingDetails.description,
          MeetingTypeID: viewData.meetingDetails.fK_MTID,
          MeetingDate: newTimeFormaterAsPerUTCFullDate(
            viewData.meetingEvent.meetingDate + viewData.meetingEvent.startTime
          ),
          // MeetingDate: "",
          MeetingStartTime: moment(
            EditmeetingDateFormat(
              viewData.meetingEvent.meetingDate +
                viewData.meetingEvent.startTime
            )
          ).format("HH:mm:ss"),
          // MeetingStartTime: "",
          MeetingEndTime: viewData.meetingEvent.endTime,
          // MeetingEndTime: "",
          MeetingLocation: viewData.meetingEvent.location,
          MeetingReminderID: reminder,
          MeetingAgendas: meetingAgenAtc,
          MeetingAttendees: emptyList,
          ExternalMeetingAttendees: externalMeetingAttendiesList,
          MinutesOfMeeting: minutesOfMeeting,
        });

        setAllMeetingDetails(assignees.ViewMeetingDetails);
      }
    } catch (error) {}
  }, [assignees.ViewMeetingDetails]);

  useEffect(() => {
    try {
      if (calendarReducer.eventsDetails !== null) {
        let calendarMeetingData =
          calendarReducer.eventsDetails.diskusCalendarEvent;
        let viewData = calendarReducer.eventsDetails;
        let reminder = [];
        let meetingAgenAtc = [];
        let minutesOfMeeting = [];
        let externalMeetingAttendiesList = [];
        let meetingAgenAtclis = [];
        let rightsButtons = calendarMeetingData.meetingAttendees;
        let meetingStatus = calendarMeetingData.meetingStatus.status;
        const found = rightsButtons.find(
          (element) => element.user.pK_UID === parseInt(createrID)
        );

        if (Object.keys(found).length > 0) {
          const found2 = found.meetingAttendeeRole.pK_MARID;
          if (parseInt(found2) === 1 || parseInt(found2) === 3) {
            setOrganizer(true);
          } else if (parseInt(found2) === 2) {
            setIsParticipant(true);
          } else {
            setOrganizer(false);
            setIsParticipant(false);
          }
        } else {
          setOrganizer(false);
          setIsParticipant(false);
        }
        if (meetingStatus === "1") {
          setStartMeetingStatus(false);
          setEndMeetingStatus(true);
          setMinutesOftheMeatingStatus(false);
        } else if (meetingStatus === "2") {
          setStartMeetingStatus(true);
          setEndMeetingStatus(false);
          setMinutesOftheMeatingStatus(true);
        } else if (meetingStatus === "3") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "4") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "8") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(false);
          setStartMeetingStatus(false);
        } else if (meetingStatus === "10") {
          setMinutesOftheMeatingStatus(false);
          setEndMeetingStatus(false);
          setStartMeetingStatus(false);
        } else {
          setEndMeetingStatus(false);
          setStartMeetingStatus(false);
          setStartMeetingStatus(false);
        }
        calendarMeetingData.meetingReminders.map((rdata, index) => {
          let pkid = rdata.pK_MRID;
          reminder.push(pkid);
        });
        let reminderoptionvalue = "";
        optionsWithIDs.map((opData, index) => {
          if (opData.id === reminder[0]) {
            reminderoptionvalue = opData.label;
          }
        });
        setMeetingReminderValue(reminderoptionvalue);
        // for meeting attendies
        let List = [];
        let user = meetingAttendeesList;
        let emptyList = [];
        try {
          if (calendarMeetingData.meetingAttendees != undefined) {
            if (calendarMeetingData.meetingAttendees.length > 0) {
              calendarMeetingData.meetingAttendees.map((meetingdata, index) => {
                List.push({
                  name: meetingdata.user.name,
                  designation: meetingdata.user.designation,
                  profilePicture: meetingdata.user.profilePicture,
                  organization: meetingdata.user.organization,
                  role: meetingdata.meetingAttendeeRole.pK_MARID,
                  displayProfilePic: meetingdata.user.displayProfilePictureName,
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
          if (viewData.externalMeetingAttendees != undefined) {
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
          calendarMeetingData.meetingAgendas.map((atchmenData, index) => {
            let opData = {
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
                  meetingAgenAtclis.push({
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
          calendarMeetingData.minutesOfMeeting.map(
            (minutesOfMeetingData, index) => {
              minutesOfMeeting.push({
                PK_MOMID: minutesOfMeetingData.pK_MOMID,
                Description: minutesOfMeetingData.description,
                CreationDate: minutesOfMeetingData.creationDate,
                CreationTime: minutesOfMeetingData.creationTime,
                FK_MDID: minutesOfMeetingData.fK_MDID,
              });
            }
          );
        } catch (error) {
          //  Block of code to handle errors
        }
        try {
          calendarMeetingData.externalMeetingAttendees.map(
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
        setattachmentsList(meetingAgenAtclis);
        setCreateMeeting({
          ...createMeeting,
          MeetingID: calendarMeetingData.meetingDetails.pK_MDID,
          MeetingTitle: calendarMeetingData.meetingDetails.title,
          MeetingDescription: calendarMeetingData.meetingDetails.description,
          MeetingTypeID: calendarMeetingData.meetingDetails.fK_MTID,
          MeetingDate: newTimeFormaterAsPerUTCFullDate(
            calendarMeetingData.meetingEvent.meetingDate +
              calendarMeetingData.meetingEvent.startTime
          ),
          // MeetingDate: "",
          MeetingStartTime: moment(
            EditmeetingDateFormat(
              calendarMeetingData.meetingEvent.meetingDate +
                calendarMeetingData.meetingEvent.startTime
            )
          ).format("HH:mm:ss"),
          // MeetingStartTime: "",
          MeetingEndTime: calendarMeetingData.meetingEvent.endTime,
          // MeetingEndTime: "",
          MeetingLocation: calendarMeetingData.meetingEvent.location,
          MeetingReminderID: reminder,
          MeetingAgendas: meetingAgenAtc,
          MeetingAttendees: emptyList,
          ExternalMeetingAttendees: externalMeetingAttendiesList,
          MinutesOfMeeting: minutesOfMeeting,
        });

        setAllMeetingDetails(calendarMeetingData);
      }
    } catch (error) {}
  }, [calendarReducer.eventsDetails]);

  useEffect(() => {
    if (
      allMeetingDetails !== null &&
      allMeetingDetails !== undefined &&
      allMeetingDetails.length !== 0
    ) {
      let meetingDateTime =
        allMeetingDetails.meetingEvent.meetingDate +
        allMeetingDetails.meetingEvent.startTime;
      const currentDateObj = new Date(
        currentUTCDateTime.substring(0, 4), // Year
        parseInt(currentUTCDateTime.substring(4, 6)) - 1, // Month (0-based)
        currentUTCDateTime.substring(6, 8), // Day
        currentUTCDateTime.substring(8, 10), // Hours
        currentUTCDateTime.substring(10, 12), // Minutes
        currentUTCDateTime.substring(12, 14) // Seconds
      );

      const meetingDateObj = new Date(
        meetingDateTime.substring(0, 4), // Year
        parseInt(meetingDateTime.substring(4, 6)) - 1, // Month (0-based)
        meetingDateTime.substring(6, 8), // Day
        meetingDateTime.substring(8, 10), // Hours
        meetingDateTime.substring(10, 12), // Minutes
        meetingDateTime.substring(12, 14) // Seconds
      );
      // Calculate the time difference in milliseconds
      const timeDifference = meetingDateObj - currentDateObj;

      // Convert milliseconds to minutes
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      setMeetingDifference(minutesDifference);
    }
  }, [allMeetingDetails]);

  // for list of all assignees
  useEffect(() => {
    try {
      if (viewFlag) {
        //     dispatch(allAssignessList(navigate, t,false));
      } else {
        setViewFlag(false);
        dispatch(cleareAssigneesState());
        setIsDetails(true);
        setIsMinutes(false);
        setIsAttachments(false);
        setIsAgenda(false);
        setIsAttendees(false);
        setObjMeetingAgenda({
          Title: "",
          PresenterName: "",
          URLs: "",
          FK_MDID: 0,
        });
        setMeetingAgendaAttachments({
          MeetingAgendaAttachments: [],
        });
        setParticipantRoleName("");
        setSelectedAttendeesName("");
        setCreateMeeting({
          ...createMeeting,
          MeetingID: 0,
          MeetingTitle: "",
          MeetingDescription: "",
          MeetingTypeID: 0,
          MeetingDate: "",
          MeetingStartTime: "",
          MeetingEndTime: "",
          MeetingLocation: "",
          MeetingReminderID: [],
          MeetingAgendas: [],
          MeetingAttendees: [],
          ExternalMeetingAttendees: [],
          MinutesOfMeeting: [],
        });
        setMeetingAttendees({
          User: {
            PK_UID: 0,
          },
          MeetingAttendeeRole: {
            PK_MARID: 0,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        });
        setMeetingReminderValue("");
        setMeetingReminderID([]);
      }
    } catch (error) {}
  }, [viewFlag]);

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) {}
  }, [assignees.user]);

  // for  list of all assignees  drop down
  useEffect(() => {
    try {
      let user = meetingAttendeesList;
      if (user != undefined) {
        if (meetingAttendeesList.length > 0) {
          setOptiosnMeetingAttendeesList(
            meetingAttendeesList.map((data, index) => {
              return data.name;
            })
          );
        }
      }
    } catch (error) {}
  }, [meetingAttendeesList]);

  // for  list of all assignees  drop down
  useEffect(() => {
    try {
      if (addedParticipantNameList != undefined) {
        if (addedParticipantNameList.length > 0) {
        }
      }
    } catch (error) {}
  }, [addedParticipantNameList]);

  let meetingDateTime =
    createMeeting.MeetingDate + createMeeting.MeetingStartTime;

  const startMeeting = async () => {
    await setViewFlag(false);
    let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(createrID),
    };
    let Data2 = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: parseInt(createrID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: true,
    };
    await dispatch(StartMeeting(navigate, Data, t, Data2));
    localStorage.setItem("meetingTitle", createMeeting.MeetingTitle);
  };

  const handleClickEndMeeting = useCallback(async () => {
    let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    let newData = {
      MeetingID: meetingID,
      StatusID: 9,
    };
    console.log("end meeting chaek")
    await dispatch(
      endMeetingStatusApi(
        navigate,
        t,
        newData,
        setViewFlag,
        setEndMeetingConfirmationModal,
      )
    );
  }, []);

  const endMeeting = async () => {
    setEndMeetingConfirmationModal(true);
    // setViewFlag(false);
    // await setViewFlag(false);
  };
  const leaveMeeting = async (id) => {
    let leaveMeetingData = {
      FK_MDID: id,
      DateTime: getCurrentDateTimeUTC(),
    };
    dispatch(
      LeaveCurrentMeeting(navigate, t, leaveMeetingData, true, setViewFlag)
    );
    // await setViewFlag(false);
  };

  const downloadClick = (record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    dispatch(DownloadFile(navigate, data, t));
  };

  //Copy link function

  // const copyToClipboardd = () => {
  //   if (
  //     NewMeetingreducer.CurrentMeetingURL !== undefined &&
  //     NewMeetingreducer.CurrentMeetingURL !== null &&
  //     NewMeetingreducer.CurrentMeetingURL !== ""
  //   ) {
  //     copyToClipboard(NewMeetingreducer.CurrentMeetingURL);
  //     setOpen({
  //       ...open,
  //       flag: true,
  //       message: "URL copied to clipboard",
  //     });
  //     setTimeout(() => {
  //       setOpen({
  //         ...open,
  //         flag: false,
  //         message: "",
  //       });
  //     }, 3000);
  //     dispatch(CleareMessegeNewMeeting());
  //   }
  // };

  const copyToClipboardd = () => {
    let MeetingData = allMeetingDetails?.meetingDetails;
    if (MeetingData.isVideoCall === true) {
      let Data2 = {
        VideoCallURL: currentMeetingVideoURL,
      };

      dispatch(
        FetchMeetingURLClipboard(
          Data2,
          navigate,
          t,
          currentUserID,
          currentOrganization
        )
      );
    }
    setOpen({
      ...open,
      flag: true,
      message: t("Generating-meeting-link"),
    });
    setTimeout(() => {
      setOpen({
        ...open,
        flag: false,
        message: "",
      });
    }, 3000);
  };

  const joinMeetingCall = () => {
    // setViewFlag(false);
    if (activeCall === false && isMeeting === false) {
      let Data = {
        VideoCallURL: currentMeetingVideoURL,
      };
      dispatch(
        FetchMeetingURLApi(
          Data,
          navigate,
          t,
          currentUserID,
          currentOrganization,
          0,
          createMeeting.MeetingTitle,
          createMeeting.MeetingID
        )
      );
      localStorage.setItem("meetingTitle", createMeeting.MeetingTitle);
    } else if (activeCall === true && isMeeting === false) {
      setInitiateVideoModalOto(true);
      dispatch(callRequestReceivedMQTT({}, ""));
    }
  };
  useEffect(() => {
    try {
      if (
        meetingIdReducer.MeetingStatusEnded !== null &&
        meetingIdReducer.MeetingStatusEnded !== undefined &&
        meetingIdReducer.MeetingStatusEnded.length !== 0
      ) {
        let currentView = localStorage.getItem("MeetingCurrentView");
        let meetingpageRow = localStorage.getItem("MeetingPageRows");
        let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");

        let endMeetingData = meetingIdReducer.MeetingStatusEnded.meeting;
        if (
          getMeetID === endMeetingData.pK_MDID &&
          endMeetingData.status === "9"
        ) {
          setViewFlag(false);
          setViewFlag(false);
          dispatch(cleareAssigneesState());
          setIsDetails(true);
          setIsMinutes(false);
          setIsAttachments(false);
          setIsAgenda(false);
          setIsAttendees(false);
          setObjMeetingAgenda({
            Title: "",
            PresenterName: "",
            URLs: "",
            FK_MDID: 0,
          });
          setMeetingAgendaAttachments({
            MeetingAgendaAttachments: [],
          });
          setParticipantRoleName("");
          setSelectedAttendeesName("");
          setCreateMeeting({
            ...createMeeting,
            MeetingID: 0,
            MeetingTitle: "",
            MeetingDescription: "",
            MeetingTypeID: 0,
            MeetingDate: "",
            MeetingStartTime: "",
            MeetingEndTime: "",
            MeetingLocation: "",
            MeetingReminderID: [],
            MeetingAgendas: [],
            MeetingAttendees: [],
            ExternalMeetingAttendees: [],
            MinutesOfMeeting: [],
          });
          setMeetingAttendees({
            User: {
              PK_UID: 0,
            },
            MeetingAttendeeRole: {
              PK_MARID: 0,
            },
            AttendeeAvailability: {
              PK_AAID: 1,
            },
          });
          setMeetingReminderValue("");
          setMeetingReminderID([]);

          // setEdiorRole({ status: null, role: null });
          // setViewAdvanceMeetingModal(false);
          // dispatch(viewAdvanceMeetingPublishPageFlag(false));
          // dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          // if (isMeetingVideo === true) {
          //   localStorage.setItem("isCaller", false);
          //   localStorage.setItem("isMeetingVideo", false);
          //   const emptyArray = [];
          //   localStorage.setItem(
          //     "callerStatusObject",
          //     JSON.stringify(emptyArray)
          //   );
          //   localStorage.setItem("activeCall", false);
          //   localStorage.setItem("isCaller", false);
          //   localStorage.setItem("acceptedRoomID", 0);
          //   localStorage.setItem("activeRoomID", 0);
          //   dispatch(normalizeVideoPanelFlag(false));
          //   dispatch(maximizeVideoPanelFlag(false));
          //   dispatch(minimizeVideoPanelFlag(false));
          //   dispatch(leaveCallModal(false));
          //   dispatch(participantPopup(false));
          // }
          // setCurrentMeetingID(0);
          // setAdvanceMeetingModalID(null);
          // setDataroomMapFolderId(0);
        //   let searchData = {
        //     Date: "",
        //     Title: "",
        //     HostName: "",
        //     UserID: currentUserID,
        //     PageNumber:
        //       meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        //     Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
        //     PublishedMeetings:
        //       currentView && Number(currentView) === 1 ? true : false,
        //   };
        // console.log("chek search meeting")
        // dispatch(searchNewUserMeeting(navigate, searchData, t));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [meetingIdReducer.MeetingStatusEnded]);

  console.log("MeetingDetailsMeetingDetails", allMeetingDetails);

  return (
    <>
      <Container>
        <Modal
          onHide={() => {
            if (
              allMeetingDetails.meetingStatus.status === "10" ||
              allMeetingDetails.meetingStatus.status === 10
            ) {
              setViewFlag(true);
            } else {
              setViewFlag(false);
            }
          }}
          show={viewFlag}
          size='lg'
          setShow={setViewFlag}
          modalParentClass='modaldialog MeetingView'
          className='MeetingView'
          ButtonTitle={ModalTitle}
          modalBodyClassName='modalMeetingViewBody'
          modalFooterClassName='modalMeetingViewFooter'
          modalHeaderClassName='modalMeetingViewHeader'
          // ModalTitle={"Modal Header"}
          ModalBody={
            <>
              <Row>
                <Col lg={3} md={3} sm={2} xs={12} className='isDetailBtn'>
                  <Button
                    className={
                      isDetails
                        ? " btn btn-primary d-flex align-items-center isDetail-View-top-btn"
                        : " btn btn-outline-primary d-flex align-items-center isDetail-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Details")}
                    onClick={changeSelectDetails}
                  />
                </Col>
                <Col
                  lg={3}
                  md={3}
                  sm={2}
                  xs={12}
                  className={"AgendaShowBtn" + " " + currentLanguage}
                  // className={"" + " " + currentLanguage}
                >
                  <Button
                    className={
                      isAgenda
                        ? " btn btn-primary d-flex align-items-center isAgenda-View-top-btn"
                        : " btn btn-outline-primary  d-flex align-items-center isAgenda-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Agendas")}
                    onClick={changeSelectAgenda}
                    datatut='show-agenda'
                  />
                </Col>
                <Col
                  lg={3}
                  md={3}
                  sm={2}
                  xs={12}
                  className={" AttendeeShowBtn" + " " + currentLanguage}
                  // className={"attendees-upper-btn" + " " + currentLanguage}
                >
                  <Button
                    className={
                      isAttendees
                        ? " btn btn-primary d-flex align-items-center isAttendee-View-top-btn"
                        : " btn btn-outline-primary d-flex align-items-center isAttendee-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Attendees")}
                    datatut='show-meeting-attendees'
                    onClick={changeSelectAttendees}></Button>
                </Col>
                {minutesOftheMeatingStatus ? (
                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className={" minutes-upper-btn" + " " + currentLanguage}>
                    <Button
                      className={
                        isMinutes
                          ? " btn btn-primary d-flex align-items-center isMinutes-View-top-btn"
                          : " btn btn-outline-primary d-flex align-items-center isMinutes-View-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Minutes")}
                      datatut='show-minutes'
                      onClick={navigateToMinutes}></Button>
                  </Col>
                ) : null}

                <Col
                  lg={2}
                  md={2}
                  sm={2}
                  xs={12}
                  className={" DataRoomShowBtn" + " " + currentLanguage}
                  // className={
                  //   "attachment-upper-btn view" + " " + currentLanguage
                  // }
                >
                  <Button
                    className={
                      isAttachments
                        ? " btn btn-primary isDataRoom-View-top-btn" +
                          " " +
                          currentLanguage
                        : " btn btn-outline-primary isDataRoom-View-top-btn-Outline" +
                          " " +
                          currentLanguage
                    }
                    variant={"Primary"}
                    text={t("Data-room")}
                    onClick={changeSelectAttachments}
                  />
                </Col>
                <Col lg={2} md={2} sm={2} xs={12}></Col>
              </Row>
              {isDetails ? (
                <>
                  <Row className='my-4'>
                    <Col
                      lg={6}
                      md={6}
                      xs={6}
                      className='MontserratRegular d-flex flex-column lh-sm my-3'>
                      <span className='MeetingViewDateTimeTextField'>
                        {createMeeting.MeetingDate}
                      </span>
                      <span className='MeetingViewLocationText_Field'>
                        {createMeeting.MeetingLocation}
                      </span>
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      xs={6}
                      className='MontserratRegular d-flex gap-2 align-items-center'>
                      <Button
                        disableBtn={isVideo && meetStatus === 10 ? false : true}
                        text={t("Copy-link")}
                        className={"CopyLinkButton"}
                        onClick={() => copyToClipboardd()}
                      />
                      <Button
                        disableBtn={isVideo && meetStatus === 10 ? false : true}
                        text={t("Join-Video-Call")}
                        className={"JoinMeetingButton"}
                        onClick={joinMeetingCall}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className=' MeetingViewTitleTextField p-0'>
                      <p className='viewModalTitle'>
                        {createMeeting.MeetingTitle.length < 100
                          ? `${createMeeting.MeetingTitle}`
                          : `${createMeeting.MeetingTitle.substring(
                              0,
                              110
                            )}...`}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className='MontserratRegular textAreaDivView p-0'>
                      <TextField
                        change={detailsHandler}
                        name='MeetingDescription'
                        applyClass='form-control2 textbox-height-details-view'
                        type='text'
                        disable={true}
                        as={"textarea"}
                        rows='7'
                        // label={}
                        // placeholder={t("Description") + "*"}
                        value={createMeeting.MeetingDescription}
                        required
                      />
                    </Col>
                  </Row>
                </>
              ) : isAgenda ? (
                <>
                  <div className='agendaList'>
                    {createMeeting.MeetingAgendas.length > 0
                      ? createMeeting.MeetingAgendas.map((data, index) => {
                          return (
                            <div className='margin-top-20'>
                              <>
                                <Row className='mt-4'>
                                  <Col lg={1} md={1} xs={12}>
                                    <span className=' agendaIndex'>
                                      {index + 1}
                                    </span>
                                  </Col>
                                  <Col
                                    lg={7}
                                    md={7}
                                    sm={7}
                                    xs={12}
                                    className='MeetingAgendaView p-0'>
                                    <p className=' agendaTitle'>
                                      {data.ObjMeetingAgenda.Title}
                                    </p>
                                  </Col>
                                  {data.ObjMeetingAgenda.PresenterName !==
                                    "" && (
                                    <Col
                                      lg={4}
                                      md={4}
                                      xs={12}
                                      className='MeetingAgendaPresented MeetingAgendaURL'>
                                      <TextField
                                        disable={true}
                                        name={"PresenterName"}
                                        value={
                                          data.ObjMeetingAgenda.PresenterName
                                        }
                                        applyClass='form-control2'
                                        type='text'
                                        label={t("Presented-by")}
                                      />
                                      <p className='url m-0 p-0'>
                                        {data.ObjMeetingAgenda.URLs}
                                      </p>
                                    </Col>
                                  )}
                                </Row>
                                <div className='meetingView_documents'>
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
                                                  id={1}
                                                  // fk_UID={}
                                                  isQuickMeeting={true}
                                                  handleClickDownload={() =>
                                                    downloadClick(
                                                      MeetingAgendaAttachmentsData
                                                    )
                                                  }
                                                  data={
                                                    MeetingAgendaAttachmentsData
                                                  }
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
                                </div>
                              </>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </>
              ) : isAttendees ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className=' meeting-view-attendee-organizer-tab'>
                      <label>{t("Organizer")}</label>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className='meeting-view-attendee-organizer-list'>
                      {/* <EmployeeCard
                        employeeName="Saad Fudda"
                        employeeDesignation="Founder, Diara Studio"
                      /> */}
                      {addedParticipantNameList ? (
                        <>
                          <span>
                            {addedParticipantNameList.map((atList, index) => {
                              if (atList.role === 1 || atList.role === 3) {
                                return (
                                  <EmployeeCard
                                    employeeName={atList.name}
                                    employeeDesignation={atList.designation}
                                    cardIcon={<Check2 />}
                                    UserProfilePic={atList.displayProfilePic}
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
                      className=' meeting-view-attendee-participant-tab'>
                      <label>{t("Participants")}</label>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className='meeting-view-attendee-participant-list'>
                      {addedParticipantNameList ? (
                        <>
                          <span>
                            {addedParticipantNameList.map((atList, index) => {
                              if (atList.role === 2) {
                                return (
                                  <EmployeeCard
                                    employeeName={atList.name}
                                    employeeDesignation={atList.designation}
                                    cardIcon={<Check2 />}
                                    UserProfilePic={atList.displayProfilePic}
                                  />
                                );
                              }
                            })}
                          </span>
                        </>
                      ) : null}
                    </Col>
                  </Row>
                </>
              ) : isMinutes && minutesOftheMeatingStatus ? (
                <>
                  <Row>
                    <Col sm={12}>
                      <Row className='my-3 minutes-view px-3 d-flex flex-row '>
                        {createMeeting.MinutesOfMeeting.length > 0 ? (
                          createMeeting.MinutesOfMeeting.map(
                            (minutesOfMeetingLdata, index) => {
                              return (
                                <Col
                                  className='border p-2 minutes-box rounded my-2'
                                  sm={12}
                                  md={12}
                                  lg={12}>
                                  <Row>
                                    <Col sm={12}>
                                      <Row>
                                        <Col sm={1}>
                                          <span className='agendaIndex'>
                                            {index + 1}
                                          </span>
                                        </Col>
                                        <Col sm={11} className='fs-6'>
                                          <p className='agendaTitle meeting-view-minutes-title'>
                                            {minutesOfMeetingLdata.Description}
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              );
                            }
                          )
                        ) : (
                          <Row className='meeting-view-minutes-tab'>
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className='d-flex justify-content-center align-items-center'>
                              <h3>{t("There-are-no-minutes-available")}</h3>
                            </Col>
                          </Row>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : isAttachments ? (
                <>
                  <Row className='mt-2'>
                    {attachmentsList.length > 0
                      ? attachmentsList.map((data, index) => {
                          return (
                            <Col sm={4} lg={4} md={4}>
                              <AttachmentViewer
                                id={1}
                                isQuickMeeting={true}
                                // fk_UID={}
                                handleClickDownload={() => downloadClick(data)}
                                data={data}
                                name={data.DisplayAttachmentName}
                              />
                            </Col>
                          );
                        })
                      : null}
                    {/* </div> */}
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isDetails ? (
                <>
                  {isOrganizer ? (
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className='d-flex justify-content-end'>
                        {meetingDifference <= 5 &&
                        meetingDifference > 0 &&
                        allMeetingDetails.meetingStatus.status === "1" ? (
                          <Button
                            onClick={startMeeting}
                            className={
                              " btn btn-primary start-meeting-button" +
                              " " +
                              currentLanguage
                            }
                            text={t("Start-meeting")}
                            disableBtn={startMeetingStatus}
                          />
                        ) : null}

                        {allMeetingDetails.meetingStatus.status === "10" ? (
                          <Button
                            onClick={() =>
                              leaveMeeting(
                                allMeetingDetails.meetingDetails.pK_MDID
                              )
                            }
                            className={
                              "  end-meeting-btn_view-org" +
                              " " +
                              currentLanguage
                            }
                            text={t("Leave-meeting")}
                            // disableBtn={endMeetingStatus}
                          />
                        ) : null}

                        {allMeetingDetails.meetingStatus.status === "10" ? (
                          <Button
                            onClick={endMeeting}
                            className={
                              " btn btn-primary end-meeting-btn_view" +
                              " " +
                              currentLanguage
                            }
                            text={t("End-meeting")}
                            // disableBtn={endMeetingStatus}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  ) : isParticipant ? (
                    <>
                      {allMeetingDetails.meetingStatus.status === "10" ? (
                        <Button
                          onClick={() =>
                            leaveMeeting(
                              allMeetingDetails.meetingDetails.pK_MDID
                            )
                          }
                          className={
                            "  end-meeting-btn_view" + " " + currentLanguage
                          }
                          text={t("Leave-meeting")}
                          // disableBtn={endMeetingStatus}
                        />
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
            </>
          }
        />
        <EndMeetingConfirmationModal
          handleClickContinue={handleClickEndMeeting}
          handleClickDiscard={() => setEndMeetingConfirmationModal(false)}
        />
        <Notification
          setOpen={setOpen}
          open={open.flag}
          message={open.message}
        />
      </Container>
    </>
  );
};

export default ModalView;
