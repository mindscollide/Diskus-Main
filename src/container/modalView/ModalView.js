import React, { useState, useEffect } from "react";
import "./ModalView.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import {
  EditmeetingDateFormat,
  newTimeFormaterAsPerUTCFullDate,
  RemoveTimeDashes,
} from "../../commen/functions/date_formater";
import {
  TextField,
  Button,
  Modal,
  EmployeeCard,
  Loader,
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

const ModalView = ({ viewFlag, setViewFlag, ModalTitle }) => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignees } = useSelector((state) => state);
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const [isMinutes, setIsMinutes] = useState(false);
  const [isAttachments, setIsAttachments] = useState(false);
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
  console.log(
    allMeetingDetails,
    "allMeetingDetailsallMeetingDetailsallMeetingDetails"
  );
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
        // dispatch(allAssignessList(navigate, t));
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
  };

  const endMeeting = async () => {
    await setViewFlag(false);
    let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(createrID),
    };
    // let Data2 = {
    //   Date: "",
    //   Title: "",
    //   HostName: "",
    //   UserID: parseInt(createrID),
    //   PageNumber: 1,
    //   Length: 50,
    //   PublishedMeetings: true,
    // };

    let meetingpageRow = localStorage.getItem("MeetingPageRows");
    let meetingPageCurrent = parseInt(
      localStorage.getItem("MeetingPageCurrent")
    );
    let currentView = localStorage.getItem("MeetingCurrentView");
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(createrID),
      PageNumber: Number(meetingPageCurrent),
      Length: Number(meetingpageRow),
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    await dispatch(EndMeeting(navigate, Data, t, searchData));
  };
  const leaveMeeting = async () => {
    await setViewFlag(false);
    // let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    // let Data = {
    //   MeetingID: meetingID,
    //   UserID: parseInt(createrID),
    // };
    // let Data2 = {
    //   Date: "",
    //   Title: "",
    //   HostName: "",
    //   UserID: parseInt(createrID),
    //   PageNumber: 1,
    //   Length: 50,
    //   PublishedMeetings: true,
    // };
    // await dispatch(EndMeeting(navigate, Data, t, Data2));
  };

  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    dispatch(DownloadFile(navigate, data, t));
  };

  return (
    <>
      <Container>
        <Modal
          onHide={() => {
            setViewFlag(false);
          }}
          show={viewFlag}
          size="lg"
          setShow={setViewFlag}
          modalParentClass="modaldialog MeetingView"
          className="MeetingView"
          ButtonTitle={ModalTitle}
          modalBodyClassName="modalMeetingViewBody"
          modalFooterClassName="modalMeetingViewFooter"
          modalHeaderClassName="modalMeetingViewHeader"
          // ModalTitle={"Modal Header"}
          ModalBody={
            <>
              <Row>
                <Col lg={3} md={3} sm={2} xs={12} className="isDetailBtn">
                  <Button
                    className={
                      isDetails
                        ? "MontserratSemiBold-600 btn btn-primary d-flex align-items-center isDetail-View-top-btn"
                        : "MontserratSemiBold-600 btn btn-outline-primary d-flex align-items-center isDetail-View-top-btn-Outline"
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
                        ? "MontserratSemiBold-600 btn btn-primary d-flex align-items-center isAgenda-View-top-btn"
                        : "MontserratSemiBold-600 btn btn-outline-primary  d-flex align-items-center isAgenda-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Agendas")}
                    onClick={changeSelectAgenda}
                    datatut="show-agenda"
                  />
                </Col>
                <Col
                  lg={3}
                  md={3}
                  sm={2}
                  xs={12}
                  className={
                    "MontserratSemiBold-600 AttendeeShowBtn" +
                    " " +
                    currentLanguage
                  }
                  // className={"attendees-upper-btn" + " " + currentLanguage}
                >
                  <Button
                    className={
                      isAttendees
                        ? "MontserratSemiBold-600 btn btn-primary d-flex align-items-center isAttendee-View-top-btn"
                        : "MontserratSemiBold-600 btn btn-outline-primary d-flex align-items-center isAttendee-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Attendees")}
                    datatut="show-meeting-attendees"
                    onClick={changeSelectAttendees}
                  ></Button>
                </Col>
                {minutesOftheMeatingStatus ? (
                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className={
                      "MontserratSemiBold-600 minutes-upper-btn" +
                      " " +
                      currentLanguage
                    }
                  >
                    <Button
                      className={
                        isMinutes
                          ? "MontserratSemiBold-600 btn btn-primary d-flex align-items-center isMinutes-View-top-btn"
                          : "MontserratSemiBold-600 btn btn-outline-primary d-flex align-items-center isMinutes-View-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Minutes")}
                      datatut="show-minutes"
                      onClick={navigateToMinutes}
                    ></Button>
                  </Col>
                ) : null}

                <Col
                  lg={2}
                  md={2}
                  sm={2}
                  xs={12}
                  className={
                    "MontserratSemiBold-600 DataRoomShowBtn" +
                    " " +
                    currentLanguage
                  }
                  // className={
                  //   "attachment-upper-btn view" + " " + currentLanguage
                  // }
                >
                  <Button
                    className={
                      isAttachments
                        ? "MontserratSemiBold-600 btn btn-primary isDataRoom-View-top-btn" +
                          " " +
                          currentLanguage
                        : "MontserratSemiBold-600 btn btn-outline-primary isDataRoom-View-top-btn-Outline" +
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
                  <Row className="my-4">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="MontserratRegular d-flex flex-column lh-sm my-3"
                    >
                      <span className="MeetingViewDateTimeTextField">
                        {createMeeting.MeetingDate}
                      </span>
                      <span className="MeetingViewLocationText_Field">
                        {createMeeting.MeetingLocation}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="MontserratSemiBold-600 MeetingViewTitleTextField p-0"
                    >
                      <p className="viewModalTitle">
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
                      className="MontserratRegular textAreaDivView p-0"
                    >
                      <TextField
                        change={detailsHandler}
                        name="MeetingDescription"
                        applyClass="form-control2 textbox-height-details-view"
                        type="text"
                        disable={true}
                        as={"textarea"}
                        rows="7"
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
                  <div className="agendaList">
                    {createMeeting.MeetingAgendas.length > 0
                      ? createMeeting.MeetingAgendas.map((data, index) => {
                          return (
                            <div className="margin-top-20">
                              <>
                                <Row className="mt-4">
                                  <Col lg={1} md={1} xs={12}>
                                    <span className="MontserratSemiBold-600 agendaIndex">
                                      {index + 1}
                                    </span>
                                  </Col>
                                  <Col
                                    lg={7}
                                    md={7}
                                    sm={7}
                                    xs={12}
                                    className="MeetingAgendaView p-0"
                                  >
                                    <p className="MontserratSemiBold-600 agendaTitle">
                                      {data.ObjMeetingAgenda.Title}
                                    </p>

                                    <div className="file-uploaded-section">
                                      {data.MeetingAgendaAttachments.length > 0
                                        ? data.MeetingAgendaAttachments.map(
                                            (
                                              MeetingAgendaAttachmentsData,
                                              index
                                            ) => {
                                              var ext =
                                                MeetingAgendaAttachmentsData.DisplayAttachmentName.split(
                                                  "."
                                                ).pop();
                                              const first =
                                                MeetingAgendaAttachmentsData.DisplayAttachmentName.split(
                                                  " "
                                                )[0];
                                              return (
                                                <Col
                                                  sm={12}
                                                  lg={3}
                                                  md={3}
                                                  className="meeting-view-file-icon"
                                                  onClick={(e) =>
                                                    downloadClick(
                                                      e,
                                                      MeetingAgendaAttachmentsData
                                                    )
                                                  }
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
                                                      type={"spreadsheet"}
                                                      size={78}
                                                      labelColor={
                                                        "rgba(16, 121, 63)"
                                                      }
                                                    />
                                                  ) : ext === "xlsx" ? (
                                                    <FileIcon
                                                      extension={"xls"}
                                                      type={"spreadsheet"}
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
                                                  <p className="fileUploadLabel">
                                                    {first}
                                                  </p>
                                                </Col>
                                              );
                                            }
                                          )
                                        : null}
                                    </div>
                                  </Col>
                                  {data.ObjMeetingAgenda.PresenterName !==
                                    "" && (
                                    <Col
                                      lg={4}
                                      md={4}
                                      xs={12}
                                      className="MeetingAgendaPresented MeetingAgendaURL"
                                    >
                                      <TextField
                                        disable={true}
                                        name={"PresenterName"}
                                        value={
                                          data.ObjMeetingAgenda.PresenterName
                                        }
                                        applyClass="form-control2"
                                        type="text"
                                        label={t("Presented-by")}
                                      />
                                      <p className="url">
                                        {data.ObjMeetingAgenda.URLs}
                                      </p>
                                    </Col>
                                  )}
                                </Row>
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
                      className="MontserratSemiBold-600 meeting-view-attendee-organizer-tab"
                    >
                      <label>{t("Organizer")}</label>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="meeting-view-attendee-organizer-list"
                    >
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
                      className="MontserratSemiBold-600 meeting-view-attendee-participant-tab"
                    >
                      <label>{t("Participants")}</label>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="meeting-view-attendee-participant-list"
                    >
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
                      <Row className="my-3 minutes-view px-3 d-flex flex-row ">
                        {createMeeting.MinutesOfMeeting.length > 0 ? (
                          createMeeting.MinutesOfMeeting.map(
                            (minutesOfMeetingLdata, index) => {
                              return (
                                <Col
                                  className="border p-2 minutes-box rounded my-2"
                                  sm={12}
                                  md={12}
                                  lg={12}
                                >
                                  <Row>
                                    <Col sm={12}>
                                      <Row>
                                        <Col sm={1}>
                                          <span className="agendaIndex">
                                            {index + 1}
                                          </span>
                                        </Col>
                                        <Col sm={11} className="fs-6">
                                          <p className="agendaTitle meeting-view-minutes-title">
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
                          <Row className="meeting-view-minutes-tab">
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className="d-flex justify-content-center align-items-center"
                            >
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
                  <Row className="data-room-file-upload-section mt-4">
                    {/* <div className="data-room-file-upload-section"> */}
                    {/* <Col lg={12} md={12} sm={12}> */}
                    {attachmentsList.length > 0
                      ? attachmentsList.map((data, index) => {
                          var ext = data.DisplayAttachmentName.split(".").pop();
                          const first =
                            data.DisplayAttachmentName.split(" ")[0];
                          return (
                            <Col
                              sm={6}
                              lg={3}
                              md={3}
                              className="meeting-view-dataroom-attachment"
                              onClick={(e) => downloadClick(e, data)}
                            >
                              <FileIcon
                                extension={ext}
                                {...defaultStyles.ext}
                              />
                              <p className="fileUploadLabel">{first}</p>
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
                        className="d-flex justify-content-end"
                      >
                        {meetingDifference <= 5 &&
                        meetingDifference > 0 &&
                        allMeetingDetails.meetingStatus.status === "1" ? (
                          <Button
                            onClick={startMeeting}
                            className={
                              "MontserratSemiBold-600 btn btn-primary start-meeting-button" +
                              " " +
                              currentLanguage
                            }
                            text={t("Start-meeting")}
                            disableBtn={startMeetingStatus}
                          />
                        ) : null}

                        {allMeetingDetails.meetingStatus.status === "10" ? (
                          <Button
                            onClick={endMeeting}
                            className={
                              "MontserratSemiBold-600 btn btn-primary end-meeting-btn_view" +
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
                          onClick={leaveMeeting}
                          className={
                            "MontserratSemiBold-600  end-meeting-btn_view" +
                            " " +
                            currentLanguage
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
      </Container>
    </>
  );
};

export default ModalView;
