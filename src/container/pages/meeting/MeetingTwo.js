import React, { useEffect, useState } from "react";
import styles from "./meetingTwo.module.css";
import searchicon from "../../../assets/images/searchicon.svg";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";

import ClipIcon from "../../../assets/images/ClipIcon.png";
import VideoIcon from "../../../assets/images/Video-Icon.png";
import {
  GetAllUsers,
  GetAllUsersGroupsRoomsList,
  GetGroupMessages,
  activeChat,
  GetAllUserChats,
} from "../../../store/actions/Talk_action";
import {
  recentChatFlag,
  headerShowHideStatus,
  footerShowHideStatus,
  createShoutAllScreen,
  addNewChatScreen,
  footerActionStatus,
  createGroupScreen,
  chatBoxActiveFlag,
  activeChatBoxGS,
} from "../../../store/actions/Talk_Feature_actions";
import CommentIcon from "../../../assets/images/Comment-Icon.png";
import {
  normalizeVideoPanelFlag,
  minimizeVideoPanelFlag,
} from "../../../store/actions/VideoFeature_actions";
import member from "../../../assets/images/member.svg";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import DatePicker, { DateObject } from "react-multi-date-picker";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import { truncateString } from "../../../commen/functions/regex";
import {
  Button,
  Table,
  TextField,
  ResultMessage,
  Notification,
} from "../../../components/elements";
import { Paper } from "@material-ui/core";
import CancelButtonModal from "./closeMeetingTab/CancelModal";
import { Col, Dropdown, Row } from "react-bootstrap";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import SceduleMeeting from "./scedulemeeting/SceduleMeeting";
import UnpublishedProposedMeeting from "./scedulemeeting/meetingDetails/UnpublishedProposedMeeting/UnpublishedProposedMeeting";
import NewEndMeetingModal from "./NewEndMeetingModal/NewEndMeetingModal";
import { useSelector } from "react-redux";
import {
  clearResponseNewMeetingReducerMessage,
  dashboardCalendarEvent,
  GetAllMeetingDetailsApiFunc,
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
  meetingNotConductedMQTT,
  viewMeetingFlag,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
  FetchMeetingURLClipboard,
  GetAllMeetingTypesNewFunction,
  JoinCurrentMeeting,
  LeaveCurrentMeeting,
  validateStringEmailApi,
  boardDeckModal,
} from "../../../store/actions/NewMeetingActions";
import { mqttCurrentMeetingEnded } from "../../../store/actions/GetMeetingUserId";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import { useDispatch } from "react-redux";
import NewEndLeaveMeeting from "./NewEndLeaveMeeting/NewEndLeaveMeeting";
import { useRef } from "react";

import {
  ViewMeeting,
  allAssignessList,
} from "../../../store/actions/Get_List_Of_Assignees";
import { useLocation, useNavigate } from "react-router-dom";
import {
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
  getCurrentDateTimeUTC,
} from "../../../commen/functions/date_formater";
import {
  getCurrentDate,
  getEndTimeWitlCeilFunction,
  getStartTimeWithCeilFunction,
} from "../../../commen/functions/time_formatter";
import { StatusValue } from "./statusJson";
import ModalMeeting from "../../modalmeeting/ModalMeeting";
import ModalUpdate from "../../modalUpdate/ModalUpdate";
import ModalView from "../../modalView/ModalView";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import ViewParticipantsDates from "./scedulemeeting/Participants/ViewParticipantsDates/ViewParticipantsDates";
import ViewMeetingModal from "./viewMeetings/ViewMeetingModal";
import OrganizerViewModal from "./scedulemeeting/Organizers/OrganizerViewModal/OrganizerViewModal";
import {
  UpdateOrganizersMeeting,
  clearResponseMessage,
} from "../../../store/actions/MeetingOrganizers_action";
import ProposedNewMeeting from "./scedulemeeting/ProposedNewMeeting/ProposedNewMeeting";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import { getAllUnpublishedMeetingData } from "../../../hooks/meetingResponse/response";
import { mqttMeetingData } from "../../../hooks/meetingResponse/response";
import BoardDeckModal from "../../BoardDeck/BoardDeckModal/BoardDeckModal";
import ShareModalBoarddeck from "../../BoardDeck/ShareModalBoardDeck/ShareModalBoarddeck";

const NewMeeting = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();

  const { talkStateData, NewMeetingreducer, meetingIdReducer } = useSelector(
    (state) => state
  );

  const { searchMeetings, endForAllMeeting, endMeetingModal } = useSelector(
    (state) => state.NewMeetingreducer
  );

  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );
  const ResponseMessages = useSelector(
    (state) => state.MeetingOrganizersReducer.ResponseMessage
  );

  let currentUserID = Number(localStorage.getItem("userID"));

  let currentOrganization = Number(localStorage.getItem("organizationID"));

  let currentLanguage = localStorage.getItem("i18nextLng");
  let AgCont = localStorage.getItem("AgCont");
  // let AdCont
  //Current User ID
  let currentUserId = localStorage.getItem("userID");
  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");
  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let userID = localStorage.getItem("userID");
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const getStartTime = getStartTimeWithCeilFunction();
  const getEndTime = getEndTimeWitlCeilFunction();
  const getCurrentDateforMeeting = getCurrentDate();
  const [quickMeeting, setQuickMeeting] = useState(false);
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  const [proposedNewMeeting, setProposedNewMeeting] = useState(false);
  const [searchMeeting, setSearchMeeting] = useState(false);
  const [isMeetingTypeFilter, setMeetingTypeFilter] = useState([]);
  const [defaultFiltersValues, setDefaultFilterValues] = useState([]);

  const [dataroomMapFolderId, setDataroomMapFolderId] = useState(0);
  //For Search Field Only
  const [searchText, setSearchText] = useState("");
  const [entereventIcon, setentereventIcon] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [currentMeetingID, setCurrentMeetingID] = useState(0);
  const [isEditMeeting, setEditMeeting] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [rows, setRow] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);
  const [minutesAgo, setMinutesAgo] = useState(null);
  const [searchFields, setSearchFeilds] = useState({
    MeetingTitle: "",
    Date: "",
    OrganizerName: "",
    DateView: "",
  });
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [startMeetingData, setStartMeetingData] = useState({
    meetingID: null,
    showButton: false,
  });
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [viewProposeDatePoll, setViewProposeDatePoll] = useState(false);
  const [viewProposeOrganizerPoll, setViewProposeOrganizerPoll] =
    useState(false);
  const [viewAdvanceMeetingModal, setViewAdvanceMeetingModal] = useState(false);
  const [advanceMeetingModalID, setAdvanceMeetingModalID] = useState(null);
  const [responseDate, setResponseDate] = useState("");
  const [responseByDate, setResponseByDate] = useState("");

  const [editorRole, setEdiorRole] = useState({
    status: null,
    role: null,
    isPrimaryOrganizer: false,
  });
  const [
    viewAdvanceMeetingModalUnpublish,
    setViewAdvanceMeetingModalUnpublish,
  ] = useState(false);

  const [dashboardEventData, setDashboardEventData] = useState(null);

  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  const callApi = async () => {
    try {
      if (meetingpageRow !== null && meetingPageCurrent !== null) {
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber: Number(meetingPageCurrent),
          Length: Number(meetingpageRow),
          PublishedMeetings: true,
        };
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
        await dispatch(allAssignessList(navigate, t));
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
        localStorage.setItem("MeetingCurrentView", 1);
      } else {
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber: 1,
          Length: 50,
          PublishedMeetings: true,
        };
        localStorage.setItem("MeetingPageRows", 50);
        localStorage.setItem("MeetingPageCurrent", 1);
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
        await dispatch(allAssignessList(navigate, t));
        await dispatch(searchNewUserMeeting(navigate, searchData, t));

        localStorage.setItem("MeetingCurrentView", 1);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (
      location.state !== null &&
      location.state?.CalendaradvanceMeeting === true
    ) {
      try {
        console.log("isWorking", location.state);

        const {
          statusID,
          id,
          isQuickMeeting,
          participantRoleID,
          attendeeRoleID,
          isPrimaryOrganizer,
          meetingID,
        } = location.state?.advancemeetingData;

        const fetchData = async () => {
          setEdiorRole({
            status: statusID,
            role:
              attendeeRoleID === 2
                ? "Participant"
                : attendeeRoleID === 4
                ? "Agenda Contributor"
                : "Organizer",
            isPrimaryOrganizer: isPrimaryOrganizer,
          });
          if (statusID === "10" || statusID === 10) {
            console.log("isWorking");

            let joinMeetingData = {
              FK_MDID: meetingID,
              DateTime: getCurrentDateTimeUTC(),
            };

            await dispatch(
              JoinCurrentMeeting(
                isQuickMeeting,
                navigate,
                t,
                joinMeetingData,
                setViewFlag,
                setEditFlag,
                setSceduleMeeting, // Fixed typo here, assuming it should be setScheduleMeeting instead of setSceduleMeeting
                1,
                setAdvanceMeetingModalID,
                setViewAdvanceMeetingModal
              )
            );

            dispatch(
              GetAllUserChats(
                navigate,
                parseInt(currentUserId),
                parseInt(currentOrganizationId),
                t
              )
            );
          } else {
            console.log("isWorking");
            setAdvanceMeetingModalID(meetingID);
            setViewAdvanceMeetingModal(true);
            dispatch(viewAdvanceMeetingPublishPageFlag(true));
            dispatch(viewMeetingFlag(true));
            dispatch(scheduleMeetingPageFlag(false));
            dispatch(viewProposeDateMeetingPageFlag(false));
            dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
            dispatch(viewProposeOrganizerMeetingPageFlag(false));
            dispatch(proposeNewMeetingPageFlag(false));
            localStorage.setItem("currentMeetingID", meetingID);
            dispatch(
              GetAllUserChats(
                navigate,
                parseInt(currentUserId),
                parseInt(currentOrganizationId),
                t
              )
            );
          }
        };
        fetchData();
      } catch (error) {
        console.error(error);
      }
    } else {
      setEditFlag(false);
      setViewFlag(false);
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
    }
  }, [location.state]);

  useEffect(() => {
    if (AgCont !== null) {
      // Usage example:
      validateStringEmailApi(AgCont, navigate, t, 1, dispatch)
        .then(async (result) => {
          console.log("Result:", result);
          // Handle the result here

          await setAdvanceMeetingModalID(Number(result.meetingID));
          await setViewAdvanceMeetingModalUnpublish(true);
          await dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
          setEdiorRole({
            ...editorRole,
            isPrimaryOrganizer: false,
            role:
              Number(result.attendeeId) === 2
                ? "Participant"
                : Number(result.attendeeId) === 4
                ? "Agenda Contributor"
                : "Organizer",
            status: Number(result.meetingStatusId),
          });
          localStorage.removeItem("AgCont");
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle errors here
        });
      console.log(AgCont, "AgContAgContAgContAgCont");
    }
  }, [AgCont]);

  //  Call all search meetings api
  useEffect(() => {
    callApi();
    return () => {
      setResponseByDate("");
      setDashboardEventData(null);
      setEditFlag(false);
      setViewFlag(false);
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
      // setRow([]);
      // setEdiorRole({
      //   status: null,
      //   role: null,
      //   isPrimaryOrganizer: false,
      // });
    };
  }, []);

  useEffect(() => {
    try {
      if (
        getALlMeetingTypes.meetingTypes !== null &&
        getALlMeetingTypes.meetingTypes !== undefined
      ) {
        let meetingtypeFilter = [];
        let byDefault = {
          value: "0",
          text: t("Quick-meeting"),
        };
        meetingtypeFilter.push(byDefault);
        getALlMeetingTypes.meetingTypes.forEach((data, index) => {
          meetingtypeFilter.push({
            text: data.type,
            value: String(data.pK_MTID),
          });
        });

        setMeetingTypeFilter(meetingtypeFilter);
      }
    } catch (error) {}
  }, [getALlMeetingTypes.meetingTypes]);

  useEffect(() => {
    if (isMeetingTypeFilter.length > 0) {
      const newData = isMeetingTypeFilter.map((meeting) =>
        String(meeting.value)
      );
      setDefaultFilterValues(newData);
    }
  }, [isMeetingTypeFilter]);

  const HandleShowSearch = () => {
    setSearchMeeting(!searchMeeting);
    setSearchText("");
  };

  const handleReset = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
  };

  const handleSearch = async () => {
    let searchData = {
      Date: searchFields.Date,
      Title: searchFields.MeetingTitle,
      HostName: searchFields.OrganizerName,
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setentereventIcon(true);
  };

  const HandleCloseSearchModalMeeting = () => {
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
  };

  const meetingDateChangeHandler = (date) => {
    let DateFormat = new DateObject(date).format("YYYYMMDD");
    let DateFormatView = new DateObject(date).format("DD/MM/YYYY");
    setSearchFeilds({
      ...searchFields,
      Date: DateFormat,
      DateView: DateFormatView,
    });
  };

  const searchMeetingChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "MeetingTitle") {
      setSearchFeilds({
        ...searchFields,
        MeetingTitle: value,
      });
    } else if (name === "OrganizerName") {
      setSearchFeilds({
        ...searchFields,
        OrganizerName: value,
      });
    }
  };

  const openSceduleMeetingPage = () => {
    setSceduleMeeting(true);
    dispatch(scheduleMeetingPageFlag(true));
    setCurrentMeetingID(0);
    dispatch(meetingDetailsGlobalFlag(true));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
  };

  const openProposedNewMeetingPage = () => {
    setProposedNewMeeting(true);
  };

  const groupChatInitiation = (data) => {
    if (data.talkGroupID !== 0) {
      dispatch(createShoutAllScreen(false));
      dispatch(addNewChatScreen(false));
      dispatch(footerActionStatus(false));
      dispatch(createGroupScreen(false));
      dispatch(chatBoxActiveFlag(false));
      dispatch(recentChatFlag(true));
      dispatch(activeChatBoxGS(true));
      dispatch(chatBoxActiveFlag(true));
      dispatch(headerShowHideStatus(true));
      dispatch(footerShowHideStatus(true));
      let chatGroupData = {
        UserID: parseInt(currentUserId),
        ChannelID: currentOrganizationId,
        GroupID: data.talkGroupID,
        NumberOfMessages: 50,
        OffsetMessage: 0,
      };
      dispatch(
        GetAllUserChats(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      dispatch(GetGroupMessages(navigate, chatGroupData, t));
      dispatch(
        GetAllUsers(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      dispatch(
        GetAllUsersGroupsRoomsList(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      let allChatMessages =
        talkStateData.AllUserChats.AllUserChatsData.allMessages;
      const foundRecord = allChatMessages.find(
        (item) => item.id === data.talkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", data.talkGroupID);
    }
  };

  const CreateQuickMeeting = async () => {
    setQuickMeeting(true);
  };

  const eventClickHandler = () => {};

  //Published Meeting Page
  const handlePublishedMeeting = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: true,
    };
    await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 1);
    localStorage.setItem("MeetingPageRows", 50);
    localStorage.setItem("MeetingPageCurrent", 1);
  };

  //UnPublished Meeting Page
  const handleUnPublishedMeeting = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: false,
    };
    await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 2);
    localStorage.setItem("MeetingPageRows", 50);
    localStorage.setItem("MeetingPageCurrent", 1);
  };

  const handleViewMeeting = async (id, isQuickMeeting, status) => {
    if (status === "10" || status === 10) {
      if (isQuickMeeting) {
        let joinMeetingData = {
          FK_MDID: id,
          DateTime: getCurrentDateTimeUTC(),
        };

        dispatch(
          JoinCurrentMeeting(
            isQuickMeeting,
            navigate,
            t,
            joinMeetingData,
            setViewFlag,
            setEditFlag,
            setSceduleMeeting,
            1,
            setAdvanceMeetingModalID,
            setViewAdvanceMeetingModal
          )
        );
        // let Data = { MeetingID: id };
        // await dispatch(
        //   ViewMeeting(
        //     navigate,
        //     Data,
        //     t,
        //     setViewFlag,
        //     setEditFlag,
        //     setSceduleMeeting,
        //     1
        //   )
        // );
      } else {
        let joinMeetingData = {
          FK_MDID: id,
          DateTime: getCurrentDateTimeUTC(),
        };

        dispatch(
          JoinCurrentMeeting(
            isQuickMeeting,
            navigate,
            t,
            joinMeetingData,
            setViewFlag,
            setEditFlag,
            setSceduleMeeting,
            1,
            setAdvanceMeetingModalID,
            setViewAdvanceMeetingModal
          )
        );

        dispatch(
          GetAllUserChats(
            navigate,
            parseInt(currentUserId),
            parseInt(currentOrganizationId),
            t
          )
        );

        // setAdvanceMeetingModalID(id);
        // setViewAdvanceMeetingModal(true);
        // dispatch(viewAdvanceMeetingPublishPageFlag(true));
        // dispatch(scheduleMeetingPageFlag(false));
        // localStorage.setItem("currentMeetingID", id);
      }
    } else {
      if (isQuickMeeting) {
        let Data = { MeetingID: id };
        await dispatch(
          ViewMeeting(
            navigate,
            Data,
            t,
            setViewFlag,
            setEditFlag,
            setSceduleMeeting,
            1
          )
        );
        // setViewFlag(true);
      } else {
        setAdvanceMeetingModalID(id);
        setViewAdvanceMeetingModal(true);
        dispatch(viewAdvanceMeetingPublishPageFlag(true));
        dispatch(scheduleMeetingPageFlag(false));
        localStorage.setItem("currentMeetingID", id);
        dispatch(
          GetAllUserChats(
            navigate,
            parseInt(currentUserId),
            parseInt(currentOrganizationId),
            t
          )
        );
      }
    }
  };

  const handleEditMeeting = async (id, isQuick, role, record) => {
    let Data = { MeetingID: Number(id) };

    if (isQuick) {
      await dispatch(
        ViewMeeting(
          navigate,
          Data,
          t,
          setViewFlag,
          setEditFlag,
          setSceduleMeeting,
          2
        )
      );
    } else if (isQuick === false) {
      if (role === "Agenda Contributor") {
        dispatch(scheduleMeetingPageFlag(true));
        dispatch(viewMeetingFlag(false));
        dispatch(meetingDetailsGlobalFlag(false));
        dispatch(organizersGlobalFlag(false));
        dispatch(agendaContributorsGlobalFlag(false));
        dispatch(participantsGlobalFlag(false));
        dispatch(agendaGlobalFlag(true));
        dispatch(meetingMaterialGlobalFlag(false));
        dispatch(minutesGlobalFlag(false));
        dispatch(proposedMeetingDatesGlobalFlag(false));
        dispatch(actionsGlobalFlag(false));
        dispatch(pollsGlobalFlag(false));
        dispatch(attendanceGlobalFlag(false));
        dispatch(uploadGlobalFlag(false));
        let Data = {
          MeetingID: Number(id),
        };
        await dispatch(
          GetAllMeetingDetailsApiFunc(
            navigate,
            t,
            Data,
            true,
            setCurrentMeetingID,
            setSceduleMeeting,
            setDataroomMapFolderId,
            0,
            1,
            role
          )
        );
      } else {
        let Data = {
          MeetingID: Number(id),
        };
        await dispatch(
          GetAllMeetingDetailsApiFunc(
            navigate,
            t,
            Data,
            true,
            setCurrentMeetingID,
            setSceduleMeeting,
            setDataroomMapFolderId,
            0,
            1,
            role
          )
        );
        dispatch(scheduleMeetingPageFlag(true));
        dispatch(viewMeetingFlag(false));
        dispatch(meetingDetailsGlobalFlag(true));
        dispatch(organizersGlobalFlag(false));
        dispatch(agendaContributorsGlobalFlag(false));
        dispatch(participantsGlobalFlag(false));
        dispatch(agendaGlobalFlag(false));
        dispatch(meetingMaterialGlobalFlag(false));
        dispatch(minutesGlobalFlag(false));
        dispatch(proposedMeetingDatesGlobalFlag(false));
        dispatch(actionsGlobalFlag(false));
        dispatch(pollsGlobalFlag(false));
        dispatch(attendanceGlobalFlag(false));
        dispatch(uploadGlobalFlag(false));
      }
    } else {
    }
  };

  // onClick to download Report Api on download Icon
  const onClickDownloadIcon = async (meetingID) => {
    let downloadData = {
      MeetingID: Number(meetingID),
    };
    dispatch(downloadAttendanceReportApi(navigate, t, downloadData));
  };

  const MeetingColoumns = [
    {
      title: <span>{t("Title")}</span>,
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: "115px",
      render: (text, record) => {
        return (
          <span
            className={styles["meetingTitle"]}
            onClick={() => {
              handleViewMeeting(
                record.pK_MDID,
                record.isQuickMeeting,
                record.status
              );
              setEdiorRole({
                status: record.status,
                role: record.isParticipant
                  ? "Participant"
                  : record.isAgendaContributor
                  ? "Agenda Contributor"
                  : "Organizer",
                isPrimaryOrganizer: record.isPrimaryOrganizer,
              });
              dispatch(viewMeetingFlag(true));
              // setIsOrganisers(isOrganiser);
            }}
          >
            {text}
          </span>
        );
      },
      sorter: (a, b) => {
        return a?.title.toLowerCase().localeCompare(b?.title.toLowerCase());
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "90px",
      ellipsis: true,
      align: "center",
      filters: [
        {
          text: t("Active"),
          value: "10",
        },
        // {
        //   text: t("Start"),
        //   value: "2",
        // },
        {
          text: t("Upcoming"),
          value: "1",
        },
        {
          text: t("Ended"),
          value: "9",
        },
        {
          text: t("Cancelled"),
          value: "4",
        },
        {
          text: t("Not-conducted"),
          value: "8",
        },
      ],
      defaultFilteredValue: ["10", "9", "8", "2", "1", "4"],
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) =>
        record.status.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => {
        return StatusValue(t, record.status);
      },
    },
    {
      title: t("Organizer"),
      dataIndex: "meetingAttendees",
      key: "meetingAttendees",
      width: "110px",
      sorter: (a, b) => {
        const nameA = a.userDetails?.name || "";
        const nameB = b.userDetails?.name || "";
        return nameA.localeCompare(nameB);
      },
      render: (text, record) => {
        return <span className={styles["orgaizer_value"]}>{record?.host}</span>;
      },
    },
    {
      title: t("Date-time"),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "155px",
      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span className="text-truncate d-block">
              {newTimeFormaterAsPerUTCFullDate(
                record.dateOfMeeting + record.meetingStartTime
              )}
            </span>
          );
        }
      },
      sorter: (a, b, sortOrder) => {
        const dateA = utcConvertintoGMT(
          `${a?.dateOfMeeting}${a?.meetingStartTime}`
        );
        const dateB = utcConvertintoGMT(
          `${b?.dateOfMeeting}${b?.meetingStartTime}`
        );
        return dateA - dateB;
      },
    },
    {
      title: t("Meeting-type"),
      dataIndex: "meetingType",
      key: "meetingType",
      width: "115px",
      align: "center",
      ellipsis: true,
      filters: isMeetingTypeFilter,
      defaultFilteredValue: defaultFiltersValues || null,
      filterResetToDefaultFilteredValue: true,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) => {
        const meetingType = Number(record.meetingType);
        return meetingType === Number(value);
      },
      render: (text, record) => {
        const meetingType = Number(record.meetingType);
        const matchedFilter = isMeetingTypeFilter.find(
          (data) => meetingType === Number(data.value)
        );
        return record.isQuickMeeting === true && meetingType === 1
          ? t("Quick-meeting")
          : matchedFilter
          ? matchedFilter.text
          : "";
      },
    },
    {
      dataIndex: "Chat",
      key: "Chat",
      width: "36px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex align-items-center justify-content-center"
              >
                {record.isAttachment ? (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "margin-right-10"
                    }
                  >
                    <Tooltip placement="topRight" title={t("ClipIcon")}>
                      <img
                        src={ClipIcon}
                        className="cursor-pointer"
                        alt=""
                        draggable="false"
                      />
                    </Tooltip>
                  </span>
                ) : (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-20"
                        : "margin-right-20"
                    }
                  ></span>
                )}
                {record.isChat ? (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "margin-right-10"
                    }
                    onClick={(e) => groupChatInitiation(record)}
                  >
                    <Tooltip placement="topLeft" title={t("Chat")}>
                      <img
                        src={CommentIcon}
                        className="cursor-pointer"
                        // width="20.06px"
                        // height="15.95px"
                        alt=""
                        draggable="false"
                      />
                    </Tooltip>
                  </span>
                ) : (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-20"
                        : "margin-right-20"
                    }
                  ></span>
                )}
                {/* {record.isVideoCall ? (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "margin-right-10"
                    }
                  >
                    <img src={VideoIcon} alt="" draggable="false" />
                  </span>
                ) : (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-20"
                        : "margin-right-20"
                    }
                  ></span>
                )} */}
                {record.status === "9" &&
                  record.isOrganizer &&
                  record.isQuickMeeting === false && (
                    <Tooltip placement="topLeft" title={t("Attendance")}>
                      <img
                        src={member}
                        className="cursor-pointer"
                        width="17.1px"
                        height="16.72px"
                        alt=""
                        draggable="false"
                        onClick={() => onClickDownloadIcon(record.pK_MDID)}
                      />
                    </Tooltip>
                  )}
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      dataIndex: "Join",
      key: "Join",
      width: "75px",
      render: (text, record) => {
        const startMeetingRequest = {
          MeetingID: Number(record.pK_MDID),
          StatusID: 10,
        };
        let meetingDateTime = record.dateOfMeeting + record.meetingStartTime;
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

        if (Number(record.status) === 1) {
          if (record.isParticipant) {
          } else if (record.isAgendaContributor) {
          } else {
            if (
              // startMeetingButton === true
              (record.isQuickMeeting === true &&
                minutesDifference < minutesAgo) ||
              (record.isQuickMeeting === true &&
                record.pK_MDID === startMeetingData.meetingID &&
                startMeetingData.showButton)
              // &&
              // minutesDifference > 0
            ) {
              return (
                <Button
                  text={t("Start-meeting")}
                  className={styles["Start-Meeting"]}
                  onClick={() => {
                    dispatch(
                      UpdateOrganizersMeeting(
                        navigate,
                        t,
                        4,
                        startMeetingRequest,
                        setEdiorRole,
                        setAdvanceMeetingModalID,
                        setDataroomMapFolderId,
                        setSceduleMeeting,
                        setViewFlag,
                        setEditFlag
                      )
                    );
                  }}
                />
              );
            } else if (
              (record.isQuickMeeting === false &&
                minutesDifference < minutesAgo) ||
              (record.isQuickMeeting === false &&
                record.pK_MDID === startMeetingData.meetingID &&
                startMeetingData.showButton)
            ) {
              return (
                <Button
                  text={t("Start-meeting")}
                  className={styles["Start-Meeting"]}
                  onClick={() => {
                    dispatch(
                      UpdateOrganizersMeeting(
                        navigate,
                        t,
                        3,
                        startMeetingRequest,
                        setEdiorRole,
                        // setAdvanceMeetingModalID,
                        setDataroomMapFolderId,
                        setViewAdvanceMeetingModal,
                        setAdvanceMeetingModalID,
                        setViewAdvanceMeetingModal,
                        record.isPrimaryOrganizer
                      )
                    );
                    localStorage.setItem("currentMeetingID", record.pK_MDID);
                    setAdvanceMeetingModalID(record.pK_MDID);
                    dispatch(viewMeetingFlag(true));
                    setViewAdvanceMeetingModal(true);
                    dispatch(viewAdvanceMeetingPublishPageFlag(true));
                    dispatch(scheduleMeetingPageFlag(false));
                    setEdiorRole({
                      status: 10,
                      role: "Organizer",
                      isPrimaryOrganizer: record.isPrimaryOrganizer,
                    });
                  }}
                />
              );
            }
          }
        } else if (Number(record.status) === 10) {
          if (record.isParticipant) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(
                    record.pK_MDID,
                    record.isQuickMeeting,
                    record.status
                  );
                  // setIsOrganisers(isOrganiser);
                  setEdiorRole({
                    status: record.status,
                    role: "Participant",
                    isPrimaryOrganizer: false,
                  });
                  dispatch(viewMeetingFlag(true));
                }}
              />
            );
          } else if (record.isAgendaContributor) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(
                    record.pK_MDID,
                    record.isQuickMeeting,
                    record.status
                  );
                  // setIsOrganisers(isOrganiser);
                  setEdiorRole({
                    status: record.status,
                    role: "Agenda Contributor",
                    isPrimaryOrganizer: false,
                  });
                  dispatch(viewMeetingFlag(true));
                }}
              />
            );
          } else if (record.isOrganizer) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(
                    record.pK_MDID,
                    record.isQuickMeeting,
                    record.status
                  );
                  // setIsOrganisers(isOrganiser);
                  setEdiorRole({
                    status: record.status,
                    role: "Organizer",
                    isPrimaryOrganizer: record.isPrimaryOrganizer,
                  });
                  dispatch(viewMeetingFlag(true));
                }}
              />
            );
          }
        } else if (Number(record.status) === 2) {
          if (record.isOrganizer) {
          } else if (record.isParticipant) {
          }
        } else {
          <Button
            text={t("Board-deck")}
            className={styles["BoardDeckButton"]}
          />;
        }
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      render: (text, record) => {
        const isQuickMeeting = record.isQuickMeeting;
        if (
          record.status === "8" ||
          record.status === "4" ||
          record.status === "9"
        ) {
          return null;
        } else {
          if (isQuickMeeting) {
            if (record.isOrganizer) {
              if (record.status !== "10") {
                return (
                  <>
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className="d-flex justify-content-center"
                      >
                        <Tooltip placement="topRight" title={t("Edit")}>
                          <img
                            src={EditIcon}
                            className="cursor-pointer"
                            width="17.11px"
                            height="17.11px"
                            alt=""
                            draggable="false"
                            onClick={() =>
                              handleEditMeeting(
                                record.pK_MDID,
                                record.isQuickMeeting,
                                "Organizer",
                                record
                              )
                            }
                          />
                        </Tooltip>
                      </Col>
                    </Row>
                  </>
                );
              }
            }
          } else {
            if (record.isParticipant) {
            } else if (record.isOrganizer) {
              return (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center"
                    >
                      <Tooltip placement="topRight" title={t("Edit")}>
                        <img
                          src={EditIcon}
                          className="cursor-pointer"
                          width="17.11px"
                          height="17.11px"
                          alt=""
                          draggable="false"
                          onClick={() => {
                            handleEditMeeting(
                              record.pK_MDID,
                              record.isQuickMeeting,
                              // record.isAgendaContributor,
                              "Organizer",
                              record
                            );
                            setEdiorRole({
                              status: record.status,
                              role: "Organizer",
                              isPrimaryOrganizer: record.isPrimaryOrganizer,
                            });
                            setEditMeeting(true);
                            dispatch(viewMeetingFlag(false));
                          }}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </>
              );
            } else if (record.isAgendaContributor) {
              return (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center"
                    >
                      <Tooltip placement="topRight" title={t("Edit")}>
                        <img
                          src={EditIcon}
                          className="cursor-pointer"
                          width="17.11px"
                          height="17.11px"
                          alt=""
                          draggable="false"
                          onClick={() => {
                            handleEditMeeting(
                              record.pK_MDID,
                              record.isQuickMeeting,
                              // record.isAgendaContributor,
                              "Agenda Contributor",
                              record
                            );
                            setEdiorRole({
                              status: record.status,
                              role: "Agenda Contributor",
                              isPrimaryOrganizer: record.isPrimaryOrganizer,
                            });
                            setEditMeeting(true);
                            dispatch(viewMeetingFlag(false));
                          }}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </>
              );
            }
          }
        }
      },
    },
  ];

  //For searching Filed Only
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Clear Search Input Value with reset all settings
  const handleClearSearch = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchText("");
    setentereventIcon(false);
  };

  // Enter Press click handler on input field
  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && searchText !== "") {
      let searchData = {
        Date: "",
        Title: searchText,
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
        PublishedMeetings: Number(currentView) === 1 ? true : false,
      };
      await dispatch(searchNewUserMeeting(navigate, searchData, t));
      setentereventIcon(true);
    }
  };

  //Board Deck Onclick function

  const boardDeckOnClick = () => {
    dispatch(boardDeckModal(true));
  };

  useEffect(() => {
    if (
      NewMeetingreducer.CalendarDashboardEventData !== null &&
      NewMeetingreducer.CalendarDashboardEventData !== undefined &&
      rows.length !== 0
    ) {
      console.log(
        "owais callApi on update rows add data in DashboardEventData if exsist"
      );

      setDashboardEventData(NewMeetingreducer.CalendarDashboardEventData);
    }
  }, [rows]);

  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        setTotalRecords(searchMeetings.totalRecords);
        setMinutesAgo(searchMeetings.meetingStartedMinuteAgo);
        if (Object.keys(searchMeetings.meetings).length > 0) {
          // });
          setRow(searchMeetings.meetings);
          // let newRowData = [];
          // searchMeetings.meetings.map((data, index) => {
          //   try {
          //     newRowData.push({
          //       dateOfMeeting: data.dateOfMeeting,
          //       host: data.host,
          //       isAttachment: data.isAttachment,
          //       isChat: data.isChat,
          //       isVideoCall: data.isVideoCall,
          //       isQuickMeeting: data.isQuickMeeting,
          //       meetingAgenda: data.meetingAgenda,
          //       meetingAttendees: data.meetingAttendees,
          //       meetingEndTime: data.meetingEndTime,
          //       meetingStartTime: data.meetingStartTime,
          //       meetingURL: data.meetingURL,
          //       orignalProfilePictureName: data.orignalProfilePictureName,
          //       pK_MDID: data.pK_MDID,
          //       meetingPoll: {
          //         totalNoOfDirectors:
          //           data.proposedMeetingDetail.totalNoOfDirectors,
          //         totalNoOfDirectorsVoted:
          //           data.proposedMeetingDetail.totalNoOfDirectorsVoted,
          //       },
          //       responseDeadLine: data.responseDeadLine,
          //       status: data.status,
          //       title: data.title,
          //       talkGroupID: data.talkGroupID,
          //       key: index,
          //       // meetingType: data.meetingTypeID,
          //       meetingType:
          //         data.meetingTypeID === 1 && data.isQuickMeeting === true
          //           ? 0
          //           : data.meetingTypeID,
          //     });
          //   } catch {}
          // });
          // setRow(newRowData);
        }
      } else {
        setRow([]);
      }
    } catch {}
  }, [searchMeetings]);
  console.log(rows, "rowsrowsrowsrowsrowsrows");

  useEffect(() => {
    if (NewMeetingreducer.mqttMeetingPrAdded !== null) {
    }
    if (NewMeetingreducer.mqtMeetingPrRemoved !== null) {
      try {
        let meetingID = NewMeetingreducer.mqtMeetingPrRemoved.meetingID;
        setRow((isRowData) => {
          return isRowData.filter((newData, index) => {
            return Number(newData.pK_MDID) !== Number(meetingID);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    NewMeetingreducer.mqttMeetingPrAdded,
    NewMeetingreducer.mqtMeetingPrRemoved,
  ]);
  useEffect(() => {
    try {
      if (
        getALlMeetingTypes.meetingTypes !== null &&
        getALlMeetingTypes.meetingTypes !== undefined
      ) {
        let meetingtypeFilter = [];
        let byDefault = {
          value: "0",
          text: t("Quick-meeting"),
        };
        meetingtypeFilter.push(byDefault);
        getALlMeetingTypes.meetingTypes.forEach((data, index) => {
          meetingtypeFilter.push({
            text: data.type,
            value: String(data.pK_MTID),
          });
        });
        let newData = meetingtypeFilter.map((meeting) => String(meeting.value));
        setDefaultFilterValues(newData);
        setMeetingTypeFilter(meetingtypeFilter);
      }
    } catch (error) {}
  }, [getALlMeetingTypes.meetingTypes]);

  // Empty text data
  const emptyText = () => {
    return (
      <ResultMessage
        icon={
          <img
            src={NoMeetingsIcon}
            alt=""
            draggable="false"
            className="nodata-table-icon"
          />
        }
        title={t("No-new-meetings")}
        subTitle={t("Anything-important-thats-needs-discussion")}
      />
    );
  };

  const handelChangePagination = async (current, PageSize) => {
    let searchData = {
      Date: searchFields.Date,
      Title: searchFields.MeetingTitle,
      HostName: searchFields.OrganizerName,
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(PageSize),
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    localStorage.setItem("MeetingPageRows", PageSize);
    localStorage.setItem("MeetingPageCurrent", current);
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
  };

  useEffect(() => {
    if (
      NewMeetingreducer.meetingStatusPublishedMqttData !== null &&
      NewMeetingreducer.meetingStatusPublishedMqttData !== undefined
    ) {
      const callMQTT = async () => {
        let meetingData = NewMeetingreducer.meetingStatusPublishedMqttData;
        try {
          const indexToUpdate = rows.findIndex(
            (obj) => Number(obj.pK_MDID) === Number(meetingData.pK_MDID)
          );
          let newMeetingData = await mqttMeetingData(meetingData, 1);

          if (indexToUpdate !== -1) {
            let updatedRows = [...rows];
            updatedRows[indexToUpdate] = newMeetingData;
            setRow(updatedRows);
          } else {
            setRow([newMeetingData, ...rows]);
          }
        } catch (error) {
          console.log(error, "Meeting Created and Published");
        }
      };

      callMQTT();
    }
  }, [NewMeetingreducer.meetingStatusPublishedMqttData]);
  useEffect(() => {
    if (
      meetingIdReducer.MeetingStatusSocket !== null &&
      meetingIdReducer.MeetingStatusSocket !== undefined
    ) {
      if (
        meetingIdReducer.MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_STARTED".toLowerCase())
      ) {
        let meetingStatusID =
          meetingIdReducer.MeetingStatusSocket.meeting.status;
        let meetingID = meetingIdReducer.MeetingStatusSocket.meeting.pK_MDID;
        try {
          setRow((rowsData) => {
            return rowsData.map((item) => {
              if (item.pK_MDID === meetingID) {
                return {
                  ...item,
                  status: String(meetingStatusID),
                };
              } else {
                return item; // Return the original item if the condition is not met
              }
            });
          });
        } catch (error) {
          console.log(
            error,
            "meetingIDmeetingIDmeetingIDmeetingIDmeetingIDmeetingID"
          );
        }
      } else if (
        meetingIdReducer.MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
      ) {
        let meetingStatusID =
          meetingIdReducer.MeetingStatusSocket?.meetingStatusID;
        let meetingID = meetingIdReducer.MeetingStatusSocket?.meetingID;
        try {
          setRow((rowsData) => {
            return rowsData.map((item) => {
              if (item.pK_MDID === meetingID) {
                return {
                  ...item,
                  status: String(meetingStatusID),
                };
              } else {
                return item; // Return the original item if the condition is not met
              }
            });
          });
        } catch {}
      }
    }
  }, [meetingIdReducer.MeetingStatusSocket]);

  useEffect(() => {
    if (
      meetingIdReducer.MeetingStatusEnded !== null &&
      meetingIdReducer.MeetingStatusEnded !== undefined &&
      meetingIdReducer.MeetingStatusEnded.length !== 0
    ) {
      let endMeetingData = meetingIdReducer.MeetingStatusEnded.meeting;
      const indexToUpdate = rows.findIndex(
        (obj) => obj.pK_MDID === endMeetingData.pK_MDID
      );
      let roomId;
      if (
        NewMeetingreducer.CurrentMeetingURL !== "" &&
        NewMeetingreducer.CurrentMeetingURL !== null &&
        NewMeetingreducer.CurrentMeetingURL !== undefined
      ) {
        let url = NewMeetingreducer.CurrentMeetingURL;
        let urlObject = new URL(url);
        let searchParams = new URLSearchParams(urlObject.search);
        roomId = Number(searchParams.get("RoomID"));
      } else {
        roomId = 0;
      }
      let acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));

      if (indexToUpdate !== -1) {
        let updatedRows = [...rows];
        updatedRows[indexToUpdate] = endMeetingData;
        setRow(updatedRows);
        if (
          advanceMeetingModalID === endMeetingData.pK_MDID &&
          endMeetingData.status === "9"
        ) {
          setEdiorRole({ status: null, role: null, isPrimaryOrganizer: false });
          setViewAdvanceMeetingModal(false);
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          setCurrentMeetingID(0);
          setAdvanceMeetingModalID(null);
          setDataroomMapFolderId(0);
          if (acceptedRoomID === roomId) {
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
            localStorage.setItem("activeCall", false);
            localStorage.setItem("activeRoomID", 0);
            localStorage.setItem("acceptedRoomID", 0);
            localStorage.setItem("isMeeting", false);
          }
        }
        dispatch(mqttCurrentMeetingEnded(null));
      } else {
        let updatedRows = [...rows, endMeetingData];
        setRow(updatedRows);
      }
    }
  }, [meetingIdReducer.MeetingStatusEnded, NewMeetingreducer]);

  useEffect(() => {
    if (
      meetingIdReducer.allMeetingsSocketData !== null &&
      meetingIdReducer.allMeetingsSocketData !== undefined
    ) {
      let meetingID = meetingIdReducer.allMeetingsSocketData.pK_MDID;
      let meetingData = meetingIdReducer.allMeetingsSocketData;
      setRow((rowsData) => {
        return rowsData.map((item) => {
          if (item.pK_MDID === meetingID) {
            return meetingData;
          } else {
            return item; // Return the original item if the condition is not met
          }
        });
      });
    }
  }, [meetingIdReducer.allMeetingsSocketData]);
  useEffect(() => {
    if (
      meetingIdReducer.CommitteeMeetingMQTT !== null &&
      meetingIdReducer.CommitteeMeetingMQTT !== undefined
    ) {
      let meetingID = meetingIdReducer.CommitteeMeetingMQTT.meeting.pK_MDID;
      let meetingData = meetingIdReducer.CommitteeMeetingMQTT.meeting;
      setRow((rowsData) => {
        return rowsData.map((item) => {
          if (item.pK_MDID === meetingID) {
            return meetingData;
          } else {
            return item; // Return the original item if the condition is not met
          }
        });
      });
    }
  }, [meetingIdReducer.CommitteeMeetingMQTT]);
  useEffect(() => {
    if (
      meetingIdReducer.GroupMeetingMQTT !== null &&
      meetingIdReducer.GroupMeetingMQTT !== undefined
    ) {
      let meetingID = meetingIdReducer.GroupMeetingMQTT.meeting.pK_MDID;
      let meetingData = meetingIdReducer.GroupMeetingMQTT.meeting;
      setRow((rowsData) => {
        return rowsData.map((item) => {
          if (item.pK_MDID === meetingID) {
            return meetingData;
          } else {
            return item; // Return the original item if the condition is not met
          }
        });
      });
    }
  }, [meetingIdReducer.GroupMeetingMQTT]);
  useEffect(() => {
    if (
      ResponseMessages !== "" &&
      ResponseMessages !== undefined &&
      ResponseMessages !== t("Record-found") &&
      ResponseMessages !== t("No-records-found") &&
      ResponseMessages !== t("No-record-found")
    ) {
      setOpen({
        message: ResponseMessages,
        open: true,
      });
      dispatch(clearResponseMessage(""));
    } else {
    }
  }, [ResponseMessages]);

  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== t("Record-found") &&
      ResponseMessage !== t("List-updated-successfully") &&
      ResponseMessage !== t("No-data-available") &&
      ResponseMessage !== t("Successful") &&
      ResponseMessage !== t("Record-updated") &&
      ResponseMessage !== t("Something-went-wrong") &&
      ResponseMessage !== undefined
    ) {
      setOpen({
        message: ResponseMessage,
        open: true,
      });
      setTimeout(() => {
        setOpen({
          message: "",
          open: false,
        });
        dispatch(clearResponseNewMeetingReducerMessage(""));
      }, 4000);
    } else {
      setTimeout(() => {
        setOpen({
          message: "",
          open: false,
        });
        dispatch(clearResponseNewMeetingReducerMessage(""));
      }, 4000);
    }
  }, [ResponseMessage]);

  useEffect(() => {
    if (dashboardEventData !== null && dashboardEventData !== undefined) {
      let startMeetingRequest = {
        MeetingID: Number(dashboardEventData.pK_MDID),
        StatusID: 10,
      };

      for (const meeting of rows) {
        if (Number(meeting.pK_MDID) === dashboardEventData.pK_MDID) {
          if (
            (meeting.status === "10" || meeting.status === 10) &&
            dashboardEventData.participantRoleID === 2
          ) {
            handleViewMeeting(
              meeting.pK_MDID,
              meeting.isQuickMeeting,
              meeting.status
            );
            setEdiorRole({
              status: meeting.status,
              role: "Participant",
              isPrimaryOrganizer: false,
            });
            dispatch(viewMeetingFlag(true));
          } else if (
            (meeting.status === "10" || meeting.status === 10) &&
            dashboardEventData.participantRoleID === 4
          ) {
            handleViewMeeting(
              meeting.pK_MDID,
              meeting.isQuickMeeting,
              meeting.status
            );
            setEdiorRole({
              status: meeting.status,
              role: "Agenda Contributor",
              isPrimaryOrganizer: false,
            });
            dispatch(viewMeetingFlag(true));
          } else if (
            (meeting.status === "10" || meeting.status === 10) &&
            dashboardEventData.participantRoleID === 1
          ) {
            setEdiorRole({
              status: meeting.status,
              role: "Organizer",
              isPrimaryOrganizer: false,
            });
            dispatch(viewMeetingFlag(true));
            handleViewMeeting(
              meeting.pK_MDID,
              meeting.isQuickMeeting,
              meeting.status
            );

            // setIsOrganisers(isOrganiser);
          } else if (meeting.status === "1" || meeting.status === 1) {
            if (meeting.isQuickMeeting === true) {
              dispatch(
                UpdateOrganizersMeeting(
                  navigate,
                  t,
                  4,
                  startMeetingRequest,
                  setEdiorRole,
                  setAdvanceMeetingModalID,
                  setDataroomMapFolderId,
                  setSceduleMeeting,
                  setViewFlag,
                  setEditFlag
                )
              );
            } else if (meeting.isQuickMeeting === false) {
              dispatch(
                UpdateOrganizersMeeting(
                  navigate,
                  t,
                  3,
                  startMeetingRequest,
                  setEdiorRole,
                  setAdvanceMeetingModalID,
                  setDataroomMapFolderId,
                  setViewAdvanceMeetingModal
                )
              );
              localStorage.setItem(
                "currentMeetingID",
                dashboardEventData.pK_MDID
              );
              setAdvanceMeetingModalID(dashboardEventData.pK_MDID);
              dispatch(viewMeetingFlag(true));
              setViewAdvanceMeetingModal(true);
              dispatch(viewAdvanceMeetingPublishPageFlag(true));
              dispatch(scheduleMeetingPageFlag(false));
              setEdiorRole({
                status: 10,
                role: "Organizer",
                isPrimaryOrganizer: false,
              });
            }
          }
          break;
        }
      }
      dispatch(dashboardCalendarEvent(null));
      setDashboardEventData(null);
    }
  }, [dashboardEventData]);

  useEffect(() => {
    if (
      NewMeetingreducer.meetingStatusNotConductedMqttData !== null &&
      NewMeetingreducer.meetingStatusNotConductedMqttData !== undefined &&
      NewMeetingreducer.meetingStatusNotConductedMqttData.length !== 0
    ) {
      let meetingDetailsMqtt =
        NewMeetingreducer.meetingStatusNotConductedMqttData.meetingDetails;
      const updatedRows = rows.map((row) => {
        if (row.pK_MDID === meetingDetailsMqtt.pK_MDID) {
          return {
            ...row,
            status: String(meetingDetailsMqtt.statusID),
          };
        }
        return row;
      });
      setRow(updatedRows);
      if (meetingDetailsMqtt.statusID === 1) {
        setStartMeetingData({
          ...startMeetingData,
          meetingID: meetingDetailsMqtt.pK_MDID,
          status: true,
        });
      } else {
        setStartMeetingData({
          ...startMeetingData,
          meetingID: null,
          status: false,
        });
      }
    }
    dispatch(meetingNotConductedMQTT(null));
  }, [NewMeetingreducer.meetingStatusNotConductedMqttData, rows]);

  console.log("NewMeetingReducerNewMeetingReducer", NewMeetingreducer);

  return (
    <section className={styles["NewMeeting_container"]}>
      {endForAllMeeting && <NewEndLeaveMeeting />}
      {endMeetingModal && <NewEndMeetingModal />}
      {quickMeeting && (
        <ModalMeeting
          setShow={setQuickMeeting}
          show={quickMeeting}
          // this is check from where its called 4 is from Meeting
          checkFlag={4}
        />
      )}
      {viewFlag ? (
        <ModalView viewFlag={viewFlag} setViewFlag={setViewFlag} />
      ) : null}
      {editFlag ? (
        <ModalUpdate
          editFlag={editFlag}
          setEditFlag={setEditFlag}
          // this is check from where its called 4 is from Meeting
          checkFlag={4}
        />
      ) : null}
      <Notification message={open.message} open={open.open} setOpen={setOpen} />
      {sceduleMeeting && NewMeetingreducer.scheduleMeetingPageFlag === true ? (
        <SceduleMeeting
          setSceduleMeeting={setSceduleMeeting}
          setCurrentMeetingID={setCurrentMeetingID}
          currentMeeting={currentMeetingID}
          editorRole={editorRole}
          setEdiorRole={setEdiorRole}
          setEditMeeting={setEditMeeting}
          isEditMeeting={isEditMeeting}
          setDataroomMapFolderId={setDataroomMapFolderId}
          dataroomMapFolderId={dataroomMapFolderId}
        />
      ) : viewProposeDatePoll &&
        NewMeetingreducer.viewProposeDateMeetingPageFlag === true ? (
        <ViewParticipantsDates
          setViewProposeDatePoll={setViewProposeDatePoll}
          responseByDate={responseByDate}
          setCurrentMeetingID={setCurrentMeetingID}
          setSceduleMeeting={setViewProposeDatePoll}
          setDataroomMapFolderId={setDataroomMapFolderId}
        />
      ) : viewAdvanceMeetingModal &&
        NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ? (
        <ViewMeetingModal
          advanceMeetingModalID={advanceMeetingModalID}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          unPublish={false}
          editorRole={editorRole}
          setEdiorRole={setEdiorRole}
          dataroomMapFolderId={dataroomMapFolderId}
          setDataroomMapFolderId={setDataroomMapFolderId}
          setCurrentMeetingID={setCurrentMeetingID}
        />
      ) : viewAdvanceMeetingModalUnpublish &&
        NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ? (
        <ViewMeetingModal
          advanceMeetingModalID={advanceMeetingModalID}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModalUnpublish}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          unPublish={true}
          editorRole={editorRole}
          setEdiorRole={setEdiorRole}
          dataroomMapFolderId={dataroomMapFolderId}
          setDataroomMapFolderId={setDataroomMapFolderId}
        />
      ) : viewProposeOrganizerPoll &&
        NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ? (
        <OrganizerViewModal
          setViewProposeOrganizerPoll={setViewProposeOrganizerPoll}
          currentMeeting={currentMeetingID}
        />
      ) : proposedNewMeeting ? (
        <ProposedNewMeeting
          setProposedNewMeeting={setProposedNewMeeting}
          setCurrentMeetingID={setCurrentMeetingID}
          currentMeeting={currentMeetingID}
          editorRole={editorRole}
          setEdiorRole={setEdiorRole}
          setEditMeeting={setEditMeeting}
          isEditMeeting={isEditMeeting}
          setDataroomMapFolderId={setDataroomMapFolderId}
          dataroomMapFolderId={dataroomMapFolderId}
        />
      ) : (
        <>
          <Row className="mt-2">
            <Col
              sm={12}
              md={8}
              lg={8}
              className="d-flex gap-3 align-items-center"
            >
              <span className={styles["NewMeetinHeading"]}>
                {t("Meetings")}
              </span>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Dropdown
                    className="SceduleMeetingButton"
                    onClick={eventClickHandler}
                  >
                    <Dropdown.Toggle title={t("Create")}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["schedule_button"]}
                        >
                          <Plus width={20} height={20} fontWeight={800} />
                          <span> {t("Schedule-a-meeting")}</span>
                        </Col>
                      </Row>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {checkFeatureIDAvailability(1) ? (
                        <Dropdown.Item
                          className="dropdown-item"
                          onClick={CreateQuickMeeting}
                        >
                          {t("Quick-meeting")}
                        </Dropdown.Item>
                      ) : null}

                      {checkFeatureIDAvailability(12) ? (
                        <Dropdown.Item
                          className="dropdown-item"
                          onClick={openSceduleMeetingPage}
                        >
                          {t("Advance-meeting")}
                        </Dropdown.Item>
                      ) : null}

                      {/* Proposed New Meeting */}
                      <Dropdown.Item
                        className="dropdown-item"
                        onClick={openProposedNewMeetingPage}
                      >
                        {t("Propose-new-meeting")}
                      </Dropdown.Item>

                      {/* BoardDeck For Time Being */}
                      {/* <Dropdown.Item
                        className="dropdown-item"
                        onClick={boardDeckOnClick}
                      >
                        {t("Board-deck")}
                      </Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Col>
            <Col
              sm={12}
              md={4}
              lg={4}
              className="d-flex justify-content-end align-items-center"
            >
              <span className="position-relative">
                <TextField
                  width={"502px"}
                  placeholder={t("Search")}
                  applyClass={"meetingSearch"}
                  name={"SearchVal"}
                  labelClass="d-none"
                  value={searchText}
                  change={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  inputicon={
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-2 align-items-center"
                      >
                        {entereventIcon === true ? (
                          <img
                            src={BlackCrossIcon}
                            className="cursor-pointer"
                            onClick={handleClearSearch}
                            alt=""
                            draggable="false"
                          />
                        ) : null}
                        <Tooltip
                          placement="bottomLeft"
                          title={t("Search-filters")}
                        >
                          <img
                            src={searchicon}
                            className={styles["Search_Bar_icon_class"]}
                            onClick={HandleShowSearch} // Add click functionality here
                            alt=""
                            draggable="false"
                          />
                        </Tooltip>
                      </Col>
                    </Row>
                  }
                  iconClassName={styles["polling_searchinput"]}
                />
                {searchMeeting ? (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Search-Box_meeting"]}
                      >
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end"
                          >
                            <img
                              src={BlackCrossIcon}
                              className={styles["Cross_Icon_Styling"]}
                              width="16px"
                              height="16px"
                              onClick={HandleCloseSearchModalMeeting}
                              alt=""
                              draggable="false"
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={12} md={12} sm={12}>
                            <TextField
                              placeholder={t("Meeting-title")}
                              applyClass={"meetinInnerSearch"}
                              labelClass="d-none"
                              name="MeetingTitle"
                              value={searchFields.MeetingTitle}
                              change={searchMeetingChangeHandler}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={6} md={6} sm={12}>
                            <DatePicker
                              value={searchFields.DateView}
                              format={"DD/MM/YYYY"}
                              placeholder="DD/MM/YYYY"
                              render={
                                <InputIcon
                                  placeholder="DD/MM/YYYY"
                                  className="datepicker_input"
                                />
                              }
                              editable={false}
                              className="datePickerTodoCreate2"
                              onOpenPickNewDate={false}
                              inputMode=""
                              calendar={calendarValue}
                              locale={localValue}
                              ref={calendRef}
                              onFocusedDateChange={meetingDateChangeHandler}
                            />
                          </Col>
                          <Col lg={6} md={6} sm={12}>
                            <TextField
                              placeholder={t("Organizer-name")}
                              labelClass="d-none"
                              name="OrganizerName"
                              applyClass={"meetinInnerSearch"}
                              value={searchFields.OrganizerName}
                              change={searchMeetingChangeHandler}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end gap-2"
                          >
                            <Button
                              text={t("Reset")}
                              className={styles["ResetButtonMeeting"]}
                              onClick={handleReset}
                            />
                            <Button
                              text={t("Search")}
                              className={styles["SearchButtonMeetings"]}
                              onClick={handleSearch}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <Paper className={styles["PaperStylesMeetingTwoPage"]}>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                    <Button
                      text={t("Published-meeting")}
                      className={
                        Number(currentView) === 1
                          ? styles["publishedMeetingButton-active"]
                          : styles["publishedMeetingButton"]
                      }
                      onClick={handlePublishedMeeting}
                    />
                    <Button
                      text={t("Unpublished-proposed-meetings")}
                      className={
                        Number(currentView) === 2
                          ? styles["UnpublishedMeetingButton-active"]
                          : styles["UnpublishedMeetingButton"]
                      }
                      onClick={handleUnPublishedMeeting}
                    />
                  </Col>
                </Row>
                {Number(currentView) === 2 ? (
                  <UnpublishedProposedMeeting
                    viewProposeDatePoll={viewProposeDatePoll}
                    setViewProposeDatePoll={setViewProposeDatePoll}
                    setViewProposeOrganizerPoll={setViewProposeOrganizerPoll}
                    setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                    setViewAdvanceMeetingModalUnpublish={
                      setViewAdvanceMeetingModalUnpublish
                    }
                    setResponseByDate={setResponseByDate}
                    setSceduleMeeting={setSceduleMeeting}
                    setEdiorRole={setEdiorRole}
                    setEditMeeting={setEditMeeting}
                    setCurrentMeetingID={setCurrentMeetingID}
                    currentMeeting={currentMeetingID}
                    editorRole={editorRole}
                    setDataroomMapFolderId={setDataroomMapFolderId}
                  />
                ) : Number(currentView) === 1 ? (
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <>
                        {defaultFiltersValues.length > 0 ? (
                          <Table
                            column={MeetingColoumns}
                            scroll={{ y: "54vh", x: false }}
                            pagination={false}
                            className="newMeetingTable"
                            rows={rows}
                            locale={{
                              emptyText: emptyText(), // Set your custom empty text here
                            }}
                            expandable={{
                              expandedRowRender: (record) => {
                                return (
                                  record.meetingAgenda.length > 0 &&
                                  record.meetingAgenda.map((data) => (
                                    <p
                                      className={styles["meeting-expanded-row"]}
                                    >
                                      {data.objMeetingAgenda.title}
                                    </p>
                                  ))
                                );
                              },
                              rowExpandable: (record) =>
                                record.meetingAgenda.length > 0 ? true : false,
                            }}
                          />
                        ) : null}
                      </>
                    </Col>
                  </Row>
                ) : null}
                {rows.length > 0 ? (
                  <>
                    <Row className="mt-5">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center "
                      >
                        <Row className={styles["PaginationStyle-Committee"]}>
                          <Col
                            className={"pagination-groups-table"}
                            sm={12}
                            md={12}
                            lg={12}
                          >
                            <CustomPagination
                              current={
                                meetingPageCurrent !== null &&
                                meetingPageCurrent !== undefined
                                  ? meetingPageCurrent
                                  : 1
                              }
                              pageSize={
                                meetingpageRow !== null &&
                                meetingpageRow !== undefined
                                  ? meetingpageRow
                                  : 50
                              }
                              onChange={handelChangePagination}
                              total={totalRecords}
                              showSizer={true}
                              pageSizeOptionsValues={["30", "50", "100", "200"]}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Paper>
            </Col>
          </Row>
          {NewMeetingreducer.boardDeckModalData && <BoardDeckModal />}
          {NewMeetingreducer.boarddeckShareModal && <ShareModalBoarddeck />}
        </>
      )}
    </section>
  );
};

export default NewMeeting;
