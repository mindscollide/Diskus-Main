import React, { useState, useEffect, useContext, useCallback } from "react";
import "./ModalView.css";
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
  cleareAssigneesState,
  StartMeeting,
} from "../../store/actions/Get_List_Of_Assignees";
import { DownloadFile } from "../../store/actions/Download_action";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  endMeetingStatusApi,
  LeaveCurrentMeeting,
  LeaveMeetingVideo,
} from "../../store/actions/NewMeetingActions";
import { getMeetingGuestVideoMainApi } from "../../store/actions/Guest_Video";
import EndMeetingConfirmationModal from "../pages/meeting/EndMeetingConfirmationModal/EndMeetingConfirmationModal";
import { MeetingContext } from "../../context/MeetingContext";
import { showMessage } from "../../components/elements/snack_bar/utill";
import { removeCalenderDataFunc } from "../../store/actions/GetDataForCalendar";
import {
  endMeetingStatusForQuickMeetingModal,
  getParticipantMeetingJoinMainApi,
  leaveMeetingOnlogout,
  maximizeVideoPanelFlag,
  maxParticipantVideoCallPanel,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  setRaisedUnRaisedParticiant,
  toggleParticipantsVisibility,
} from "../../store/actions/VideoFeature_actions";
import MaxHostVideoCallComponent from "../pages/meeting/meetingVideoCall/maxHostVideoCallComponent/MaxHostVideoCallComponent";
import NormalHostVideoCallComponent from "../pages/meeting/meetingVideoCall/normalHostVideoCallComponent/NormalHostVideoCallComponent";
import ParticipantVideoCallComponent from "../pages/meeting/meetingVideoCall/maxParticipantVideoCallComponent/maxParticipantVideoCallComponent";
import NormalParticipantVideoComponent from "../pages/meeting/meetingVideoCall/normalParticipantVideoComponent/NormalParticipantVideoComponent";
import MaxParticipantVideoDeniedComponent from "../pages/meeting/meetingVideoCall/maxParticipantVideoDeniedComponent/maxParticipantVideoDeniedComponent";
import MaxParticipantVideoRemovedComponent from "../pages/meeting/meetingVideoCall/maxParticipantVideoRemovedComponent/maxParticipantVideoRemovedComponent";
import { userLogOutApiFunc } from "../../store/actions/Auth_Sign_Out";

const ModalView = ({ viewFlag, setViewFlag, ModalTitle }) => {
  //For Localization
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const assigneesViewMeetingDetails = useSelector(
    (state) => state.assignees.ViewMeetingDetails
  );

  const meetingIdReducerMeetingStatusEnded = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusEnded
  );

  const calendarReducereventsDetails = useSelector(
    (state) => state.calendarReducer.eventsDetails
  );

  const userProfileData = useSelector(
    (state) => state.settingReducer?.UserProfileData
  );

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );

  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
  );

  const maximizeParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.maximizeParticipantVideoFlag
  );

  const normalParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.normalParticipantVideoFlag
  );

  const maxParticipantVideoDeniedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoDeniedFlag
  );

  const maxParticipantVideoRemovedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoRemovedFlag
  );
  const endMeetingStatusForQuickMeetingModalFlag = useSelector(
    (state) =>
      state.videoFeatureReducer.endMeetingStatusForQuickMeetingModalFlag
  );
  const leaveMeetingOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingOnLogoutResponse
  );

  const assigneesuser = useSelector((state) => state.assignees.user);

  const { setEndMeetingConfirmationModal } = useContext(MeetingContext);

  const [getMeetID, setMeetID] = useState(0);
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const [isMinutes, setIsMinutes] = useState(false);
  const [isAttachments, setIsAttachments] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [meetStatus, setMeetStatus] = useState(0);
  // for   List Of Attachments
  const [attachmentsList, setattachmentsList] = useState([]);
  //all Meeting details
  const [allMeetingDetails, setAllMeetingDetails] = useState([]);
  const [meetingDifference, setMeetingDifference] = useState(0);
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [remainingMinutesAgo, setRemainingMinutesAgo] = useState(0);
  // for   added participant  Name list
  const [addedParticipantNameList, setAddedParticipantNameList] = useState([]);
  const [startMeetingStatus, setStartMeetingStatus] = useState(false);
  const [isOrganizer, setOrganizer] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [minutesOftheMeatingStatus, setMinutesOftheMeatingStatus] =
    useState(false);
  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
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
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  let currentMeeting = localStorage.getItem("currentMeetingID");

  let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  let currentLanguage = localStorage.getItem("i18nextLng");

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

  // for all details handler
  const detailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "MeetingStartTime") {
      setCreateMeeting({
        ...createMeeting,
        [name]: RemoveTimeDashes(value),
        MeetingEndTime: RemoveTimeDashes(value),
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

  // for view data
  useEffect(() => {
    try {
      if (Object.keys(assigneesViewMeetingDetails).length > 0) {
        let viewData = assigneesViewMeetingDetails;
        console.log(viewData, "viewDataviewDataviewData");
        let reminder = [];
        let meetingAgenAtc = [];
        let minutesOfMeeting = [];
        let externalMeetingAttendiesList = [];
        let meetingAgenAtclis = [];
        let rightsButtons = assigneesViewMeetingDetails.meetingAttendees;
        let meetingStatus = assigneesViewMeetingDetails.meetingStatus.status;
        let StatusCheck = assigneesViewMeetingDetails.meetingStatus.pK_MSID;
        setMeetStatus(StatusCheck);
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
          setMinutesOftheMeatingStatus(false);
        } else if (meetingStatus === "2") {
          setStartMeetingStatus(true);
          setMinutesOftheMeatingStatus(false);
        } else if (meetingStatus === "3") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "4") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "8") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(false);
        } else if (meetingStatus === "10") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(false);
        } else {
          setStartMeetingStatus(false);
          setStartMeetingStatus(false);
        }
        viewData.meetingReminders.map((rdata, index) => {
          let pkid = rdata.pK_MRID;
          reminder.push(pkid);
        });
        // for meeting attendies
        let List = [];
        let user = meetingAttendeesList;
        let emptyList = [];
        try {
          if (viewData.meetingAttendees !== undefined) {
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
          if (viewData.externalMeetingAttendees !== undefined) {
            if (viewData.externalMeetingAttendees.length > 0) {
              viewData.externalMeetingAttendees.forEach(
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
          viewData.meetingAgendas.forEach((atchmenData, index) => {
            let opData = {
              Title: atchmenData.objMeetingAgenda.title,
              PresenterName: atchmenData.objMeetingAgenda.presenterName,
              URLs: atchmenData.objMeetingAgenda.urLs,
              FK_MDID: atchmenData.objMeetingAgenda.fK_MDID,
            };
            let file = [];
            if (atchmenData.meetingAgendaAttachments !== null) {
              atchmenData.meetingAgendaAttachments.forEach(
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
          viewData.minutesOfMeeting.forEach((minutesOfMeetingData, index) => {
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
            viewData.meetingEvent.meetingDate + viewData.meetingEvent.startTime,
            currentLanguage
          ),
          currentLanguage,
          MeetingStartTime: moment(
            EditmeetingDateFormat(
              viewData.meetingEvent.meetingDate +
                viewData.meetingEvent.startTime
            )
          ).format("HH:mm:ss"),
          MeetingEndTime: viewData.meetingEvent.endTime,
          MeetingLocation: viewData.meetingEvent.location,
          MeetingReminderID: reminder,
          MeetingAgendas: meetingAgenAtc,
          MeetingAttendees: emptyList,
          ExternalMeetingAttendees: externalMeetingAttendiesList,
          MinutesOfMeeting: minutesOfMeeting,
        });
        setIsVideo(viewData.meetingDetails.isVideoCall);
        setMeetID(viewData.meetingDetails.pK_MDID);
        setAllMeetingDetails(assigneesViewMeetingDetails);
      }
    } catch (error) {}
  }, [assigneesViewMeetingDetails]);

  useEffect(() => {
    try {
      if (calendarReducereventsDetails !== null) {
        let calendarMeetingData =
          calendarReducereventsDetails.diskusCalendarEvent;
        let viewData = calendarReducereventsDetails;
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
          setMinutesOftheMeatingStatus(false);
        } else if (meetingStatus === "2") {
          setStartMeetingStatus(true);
          setMinutesOftheMeatingStatus(false);
        } else if (meetingStatus === "3") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "4") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "8") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(false);
        } else if (meetingStatus === "10") {
          setMinutesOftheMeatingStatus(false);
          setStartMeetingStatus(false);
        } else {
          setStartMeetingStatus(false);
          setStartMeetingStatus(false);
        }
        calendarMeetingData.meetingReminders.map((rdata, index) => {
          let pkid = rdata.pK_MRID;
          reminder.push(pkid);
        });
        // for meeting attendies
        let List = [];
        let emptyList = [];
        try {
          if (calendarMeetingData.meetingAttendees !== undefined) {
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
          if (viewData.externalMeetingAttendees !== undefined) {
            if (viewData.externalMeetingAttendees.length > 0) {
              viewData.externalMeetingAttendees.forEach(
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
          calendarMeetingData.meetingAgendas.forEach((atchmenData, index) => {
            let opData = {
              Title: atchmenData.objMeetingAgenda.title,
              PresenterName: atchmenData.objMeetingAgenda.presenterName,
              URLs: atchmenData.objMeetingAgenda.urLs,
              FK_MDID: atchmenData.objMeetingAgenda.fK_MDID,
            };
            let file = [];
            if (atchmenData.meetingAgendaAttachments !== null) {
              atchmenData.meetingAgendaAttachments.forEach(
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
          calendarMeetingData.minutesOfMeeting.forEach(
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
          calendarMeetingData.externalMeetingAttendees.forEach(
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
          MeetingID: calendarMeetingData.meetingDetails.pK_MDID,
          MeetingTitle: calendarMeetingData.meetingDetails.title,
          MeetingDescription: calendarMeetingData.meetingDetails.description,
          MeetingTypeID: calendarMeetingData.meetingDetails.fK_MTID,
          MeetingDate: newTimeFormaterAsPerUTCFullDate(
            calendarMeetingData.meetingEvent.meetingDate +
              calendarMeetingData.meetingEvent.startTime
          ),
          currentLanguage,
          MeetingStartTime: moment(
            EditmeetingDateFormat(
              calendarMeetingData.meetingEvent.meetingDate +
                calendarMeetingData.meetingEvent.startTime
            )
          ).format("HH:mm:ss"),
          MeetingEndTime: calendarMeetingData.meetingEvent.endTime,
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
  }, [calendarReducereventsDetails]);

  useEffect(() => {
    if (userProfileData !== null) {
      let settingConfigurations = userProfileData?.configurations;
      if (
        settingConfigurations !== null &&
        settingConfigurations !== undefined &&
        settingConfigurations.length > 0
      ) {
        let findReminingMinutesAgo = settingConfigurations.find(
          (remainsData, index) =>
            remainsData?.configKey?.toLowerCase() ===
            "Join_Meeting_Before_Minutes".toLowerCase()
        );
        console.log(
          findReminingMinutesAgo,
          "findReminingMinutesAgofindReminingMinutesAgo"
        );
        if (findReminingMinutesAgo !== undefined) {
          setRemainingMinutesAgo(Number(findReminingMinutesAgo.configValue));
        }
      }
    }
  }, [userProfileData]);

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

  useEffect(() => {
    return () => {
      console.log("isMeeting");
      localStorage.setItem("isMeeting", false);
      dispatch(removeCalenderDataFunc(null));
      setViewFlag(false);
      dispatch(cleareAssigneesState());
      setIsDetails(true);
      setIsMinutes(false);
      setIsAttachments(false);
      setIsAgenda(false);
      setIsAttendees(false);
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
        MeetingID: 0,
      });
    };
  }, []);

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assigneesuser).length > 0) {
        setMeetingAttendeesList(assigneesuser);
      }
    } catch (error) {}
  }, [assigneesuser]);

  const startMeeting = async () => {
    await setViewFlag(false);
    let checkMeetingID = null;
    if (
      assigneesViewMeetingDetails?.responseMessage ===
      "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_01"
    ) {
      checkMeetingID = assigneesViewMeetingDetails.meetingDetails.pK_MDID;
    } else if (
      calendarReducereventsDetails?.responseMessage ===
      "Calender_CalenderServiceManager_GetDiskusEventDetails_01"
    ) {
      checkMeetingID =
        calendarReducereventsDetails.diskusCalendarEvent.meetingDetails.pK_MDID;
    }
    console.log("meetingDetails", checkMeetingID);

    let meetingID = checkMeetingID;
    let Data = {
      MeetingID: Number(meetingID),
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
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    if (isMeetingVideo === true) {
      let getMeetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
      if (getMeetingHost.isHost && getMeetingHost.isDashboardVideo) {
        let newRoomID = localStorage.getItem("newRoomId");
        let newUserGUID = localStorage.getItem("isGuid");
        let newName = localStorage.getItem("name");
        let currentMeetingID = JSON.parse(
          localStorage.getItem("currentMeetingID")
        );

        let Data = {
          RoomID: String(newRoomID),
          UserGUID: String(newUserGUID),
          Name: String(newName),
          IsHost: getMeetingHost?.isHost ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        dispatch(LeaveMeetingVideo(Data, navigate, t));
      }
    }
    let checkMeetingID = null;
    if (
      assigneesViewMeetingDetails?.responseMessage ===
      "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_01"
    ) {
      checkMeetingID = assigneesViewMeetingDetails.meetingDetails.pK_MDID;
    } else if (
      calendarReducereventsDetails?.responseMessage ===
      "Calender_CalenderServiceManager_GetDiskusEventDetails_01"
    ) {
      checkMeetingID =
        calendarReducereventsDetails.diskusCalendarEvent.meetingDetails.pK_MDID;
    }
    let meetingID = checkMeetingID;
    let newData = {
      MeetingID: meetingID,
      StatusID: 9,
    };
    console.log("end meeting chaek");
    await dispatch(
      endMeetingStatusApi(
        navigate,
        t,
        newData,
        setViewFlag,
        setEndMeetingConfirmationModal
      )
    );
  }, []);

  const endMeeting = async () => {
    setEndMeetingConfirmationModal(true);
  };
  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (endMeetingStatusForQuickMeetingModalFlag) {
        let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
        console.log("mqtt mqmqmqmqmqmq");
        leaveMeeting(currentMeetingID, true, false);
      }
    } catch (error) {}
  }, [endMeetingStatusForQuickMeetingModalFlag]);

  useEffect(() => {
    try {
      if (leaveMeetingOnLogoutResponse) {
        console.log("mqtt mqmqmqmqmqmq");
        let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
        leaveMeeting(currentMeetingID, false, true);
      }
    } catch {}
  }, [leaveMeetingOnLogoutResponse]);

  const leaveMeeting = async (id, flag, flag2) => {
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let typeOfMeeting = localStorage.getItem("typeOfMeeting");

    if (isMeetingVideo === true && String(typeOfMeeting) === "isQuickMeeting") {
      const meetHostFlag = JSON.parse(localStorage.getItem("meetinHostInfo"));
      const currentMeetingID = JSON.parse(
        localStorage.getItem("currentMeetingID")
      );
      await dispatch(normalizeVideoPanelFlag(false));
      await dispatch(maximizeVideoPanelFlag(false));
      await dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("isMeeting", false);
      localStorage.setItem("meetingTitle", "");
      localStorage.setItem("acceptedRecipientID", 0);
      localStorage.setItem("acceptedRoomID", 0);
      localStorage.setItem("activeRoomID", 0);
      localStorage.setItem("meetingVideoID", 0);
      localStorage.setItem("MicOff", true);
      localStorage.setItem("VidOff", true);
      if (meetHostFlag?.isHost) {
        let newRoomID = localStorage.getItem("newRoomId");
        let newUserGUID = localStorage.getItem("isGuid");
        let newName = localStorage.getItem("name");
        let Data = {
          RoomID: String(newRoomID),
          UserGUID: String(newUserGUID),
          Name: String(newName),
          IsHost: meetHostFlag?.isHost ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        await dispatch(LeaveMeetingVideo(Data, navigate, t));
      } else {
        await dispatch(toggleParticipantsVisibility(false));
        let participantRoomIds = localStorage.getItem("participantRoomId");
        let participantUID = localStorage.getItem("participantUID");
        let newName = localStorage.getItem("name");
        let Data = {
          RoomID: String(participantRoomIds),
          UserGUID: String(participantUID),
          Name: String(newName),
          IsHost: meetHostFlag?.isHost ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        await dispatch(setRaisedUnRaisedParticiant(false));
        await dispatch(LeaveMeetingVideo(Data, navigate, t));
      }
      let leaveMeetingData = {
        FK_MDID: Number(id),
        DateTime: getCurrentDateTimeUTC(),
      };
      await dispatch(
        LeaveCurrentMeeting(navigate, t, leaveMeetingData, true, setViewFlag)
      );
    } else if (String(typeOfMeeting) === "isQuickMeeting") {
      console.log("mqtt mqmqmqmqmqmq");
      let leaveMeetingData = {
        FK_MDID: Number(id),
        DateTime: getCurrentDateTimeUTC(),
      };
      await dispatch(
        LeaveCurrentMeeting(navigate, t, leaveMeetingData, true, setViewFlag)
      );
    }
    if (flag) {
      console.log("mqtt mqmqmqmqmqmq");
      await dispatch(endMeetingStatusForQuickMeetingModal(false));
    }
    if (flag2) {
      console.log("mqtt mqmqmqmqmqmq");
      await dispatch(leaveMeetingOnlogout(false));
      dispatch(userLogOutApiFunc(navigate, t));
    }
  };

  const downloadClick = (record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    dispatch(DownloadFile(navigate, data, t));
  };

  const copyToClipboardd = () => {
    let MeetingData = allMeetingDetails?.meetingDetails;
    if (MeetingData.isVideoCall === true) {
      let meetingId = localStorage.getItem("currentMeetingID");

      let data = {
        MeetingId: Number(meetingId),
      };
      dispatch(getMeetingGuestVideoMainApi(navigate, t, data));
    }
    showMessage("Generating-meeting-link", "error", setOpen);
  };

  const joinMeetingCall = () => {
    // console.log("Agenda View Full");
    // let meetingVideoData = {
    //   roleID: editorRole.role === "Participant" ? 2 : 10,
    // };
    // console.log(meetingVideoData, "meetingVideoData");

    // if (meetingVideoData.roleID === 2) {
    //   dispatch(maxParticipantVideoCallPanel(true));
    // } else {
    let findRoleId = createMeeting.MeetingAttendees.find(
      (attendee, index) => attendee.User.PK_UID === parseInt(createrID)
    );
    console.log(findRoleId, "gadgetgadgetgadgetgadget");
    if (findRoleId !== undefined) {
      let isParticipant = findRoleId.MeetingAttendeeRole.PK_MARID === 2;
      console.log(isParticipant, "gadgetgadgetgadgetgadget");

      let getMeetingVideoHost = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );

      if (!getMeetingVideoHost) {
        dispatch(maxParticipantVideoCallPanel(true));
      } else {
        if (currentMeetingVideoURL !== null) {
          let data = {
            MeetingId: Number(currentMeeting),
            VideoCallURL: String(currentMeetingVideoURL),
            IsMuted: false,
            HideVideo: false,
          };
          dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
        }
      }
    }
  };

  useEffect(() => {
    try {
      if (
        meetingIdReducerMeetingStatusEnded !== null &&
        meetingIdReducerMeetingStatusEnded !== undefined &&
        meetingIdReducerMeetingStatusEnded.length !== 0
      ) {
        let endMeetingData = meetingIdReducerMeetingStatusEnded.meeting;
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
            MeetingID: 0,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [meetingIdReducerMeetingStatusEnded]);

  return (
    <>
      <Container>
        <Modal
          onHide={() => {
            if (
              JSON.parse(localStorage.getItem("QuicMeetingOperations")) === true
            ) {
              setViewFlag(false);
              localStorage.removeItem("QuicMeetingOperations");
              localStorage.removeItem("NotificationQuickMeetingID");
            } else {
              if (
                allMeetingDetails.meetingStatus.status === "10" ||
                allMeetingDetails.meetingStatus.status === 10
              ) {
                leaveMeeting(allMeetingDetails.meetingDetails.pK_MDID);
              } else {
                setViewFlag(false);
              }
            }
          }}
          show={viewFlag}
          size="md"
          setShow={setViewFlag}
          modalParentClass="modaldialog MeetingView"
          className="MeetingView"
          ButtonTitle={ModalTitle}
          modalBodyClassName="modalMeetingViewBody"
          modalFooterClassName="modalMeetingViewFooter"
          modalHeaderClassName="d-none"
          ModalBody={
            <>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12} className="d-flex gap-2">
                  <Button
                    className={
                      isDetails
                        ? "isDetail-View-top-btn"
                        : "isDetail-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Details")}
                    onClick={changeSelectDetails}
                  />
                  <Button
                    className={
                      isAgenda
                        ? "isAgenda-View-top-btn"
                        : "isAgenda-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Agendas")}
                    onClick={changeSelectAgenda}
                    datatut="show-agenda"
                  />
                  <Button
                    className={
                      isAttendees
                        ? "isAttendee-View-top-btn"
                        : "isAttendee-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Attendees")}
                    datatut="show-meeting-attendees"
                    onClick={changeSelectAttendees}
                  />
                  {minutesOftheMeatingStatus && (
                    <Button
                      className={
                        isMinutes
                          ? "isMinutes-View-top-btn"
                          : "isMinutes-View-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Minutes")}
                      datatut="show-minutes"
                      onClick={navigateToMinutes}
                    />
                  )}
                  <Button
                    className={
                      isAttachments
                        ? "isDataRoom-View-top-btn"
                        : "isDataRoom-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Data-room")}
                    onClick={changeSelectAttachments}
                  />
                </Col>
              </Row>
              {isDetails ? (
                <>
                  <Row className="mt-4">
                    <Col lg={6} md={6} xs={6}>
                      <span className="MeetingViewDateTimeTextField">
                        {createMeeting.MeetingDate}
                      </span>
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      xs={6}
                      className="MontserratRegular d-flex gap-2 align-items-start"
                    >
                      <Button
                        disableBtn={isVideo && meetStatus === 10 ? false : true}
                        text={t("Copy-link")}
                        className={"CopyLinkButton"}
                        onClick={() => copyToClipboardd()}
                      />
                      <Button
                        disableBtn={isVideo && meetStatus === 10 ? false : true}
                        text={t("Join-video-call")}
                        className={"JoinMeetingButton"}
                        onClick={joinMeetingCall}
                      />

                      {MaximizeHostVideoFlag && <MaxHostVideoCallComponent />}
                      {NormalHostVideoFlag && <NormalHostVideoCallComponent />}
                      {maximizeParticipantVideoFlag && (
                        <ParticipantVideoCallComponent />
                      )}
                      {normalParticipantVideoFlag && (
                        <NormalParticipantVideoComponent />
                      )}
                      {maxParticipantVideoDeniedFlag && (
                        <MaxParticipantVideoDeniedComponent />
                      )}
                      {maxParticipantVideoRemovedFlag && (
                        <MaxParticipantVideoRemovedComponent />
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
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
                      className=" MeetingViewTitleTextField p-0"
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
                            <>
                              <div>
                                <Row className="mt-4">
                                  <Col lg={1} md={1} xs={12}>
                                    <span className=" agendaIndex">
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
                                    <p className=" agendaTitle">
                                      {data.ObjMeetingAgenda.Title}
                                    </p>
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
                                      <p className="url m-0 p-0">
                                        {data.ObjMeetingAgenda.URLs}
                                      </p>
                                    </Col>
                                  )}
                                </Row>
                                <div className="meetingView_documents">
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
                              </div>
                            </>
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
                      className=" meeting-view-attendee-organizer-tab"
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
                      {addedParticipantNameList ? (
                        <>
                          <span>
                            {addedParticipantNameList.map((atList, index) => {
                              console.log(atList.name, "dtatadtatad");
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
                      className=" meeting-view-attendee-participant-tab"
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
                  <Row className="mt-2">
                    {attachmentsList.length > 0
                      ? attachmentsList.map((data, index) => {
                          return (
                            <Col sm={4} lg={4} md={4}>
                              <AttachmentViewer
                                id={1}
                                handleClickDownload={() => downloadClick(data)}
                                data={data}
                                name={data.DisplayAttachmentName}
                              />
                            </Col>
                          );
                        })
                      : null}
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isOrganizer ? (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    {meetingDifference <= remainingMinutesAgo &&
                    allMeetingDetails.meetingStatus.status === "1" &&
                    isDetails ? (
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
                          leaveMeeting(allMeetingDetails.meetingDetails.pK_MDID)
                        }
                        className={
                          "  end-meeting-btn_view-org" + " " + currentLanguage
                        }
                        text={t("Leave-meeting")}
                      />
                    ) : null}

                    {allMeetingDetails.meetingStatus.status === "10" &&
                    isDetails ? (
                      <Button
                        onClick={endMeeting}
                        className={
                          " btn btn-primary end-meeting-btn_view" +
                          " " +
                          currentLanguage
                        }
                        text={t("End-meeting")}
                      />
                    ) : null}
                  </Col>
                </Row>
              ) : isParticipant ? (
                <>
                  {allMeetingDetails.meetingStatus.status === "10" ? (
                    <Button
                      onClick={() =>
                        leaveMeeting(allMeetingDetails.meetingDetails.pK_MDID)
                      }
                      className={`end-meeting-btn_view ${currentLanguage}`}
                      text={t("Leave-meeting")}
                    />
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
        <Notification open={open} setOpen={setOpen} />
      </Container>

      {/* Max Component */}
    </>
  );
};

export default ModalView;
