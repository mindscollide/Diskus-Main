import React, { useContext, useEffect, useState } from "react";
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
import member from "../../../assets/images/member.svg";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import DatePicker, { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useTranslation } from "react-i18next";
import { Checkbox, Dropdown, Menu, Tooltip } from "antd";
import {
  Button,
  Table,
  TextField,
  Notification,
} from "../../../components/elements";
import ReactBootstrapDropdown from "react-bootstrap/Dropdown";
import { Col, Row } from "react-bootstrap";
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
  GetAllMeetingTypesNewFunction,
  JoinCurrentMeeting,
  validateStringEmailApi,
  meetingParticipantAdded,
  meetingParticipantRemoved,
  validateEncryptedStringViewMeetingLinkApi,
  clearMeetingState,
  emailRouteID,
  ProposedMeetingViewFlagAction,
} from "../../../store/actions/NewMeetingActions";
import { mqttCurrentMeetingEnded } from "../../../store/actions/GetMeetingUserId";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import { useDispatch } from "react-redux";
import NewEndLeaveMeeting from "./NewEndLeaveMeeting/NewEndLeaveMeeting";
import { useRef } from "react";
import DescendIcon from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";
import { ViewMeeting } from "../../../store/actions/Get_List_Of_Assignees";
import { useLocation, useNavigate } from "react-router-dom";
import {
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
  getCurrentDateTimeUTC,
  resolutionResultTable,
} from "../../../commen/functions/date_formater";

import { StatusValue } from "./statusJson";
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
import {
  checkFeatureIDAvailability,
  WebNotificationExportRoutFunc,
} from "../../../commen/functions/utils";
import { mqttMeetingData } from "../../../hooks/meetingResponse/response";
import BoardDeckModal from "../../BoardDeck/BoardDeckModal/BoardDeckModal";
import ShareModalBoarddeck from "../../BoardDeck/ShareModalBoardDeck/ShareModalBoarddeck";
import BoardDeckSendEmail from "../../BoardDeck/BoardDeckSendEmail/BoardDeckSendEmail";
import { MeetingContext } from "../../../context/MeetingContext";
import moment from "moment";
import { DownloadMeetingRecording } from "../../../store/actions/VideoChat_actions";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import ShareViaDataRoomPathModal from "../../BoardDeck/ShareViaDataRoomPathModal/ShareViaDataRoomPathModal";
import ViewProposedMeetingModal from "./scedulemeeting/meetingDetails/UnpublishedProposedMeeting/ViewProposedMeetingModal/ViewProposedMeetingModal";
import { useGroupsContext } from "../../../context/GroupsContext";
import { webnotificationGlobalFlag } from "../../../store/actions/UpdateUserNotificationSetting";
import CreateQuickMeeting from "../../QuickMeeting/CreateQuickMeeting/CreateQuickMeeting";
import UpdateQuickMeeting from "../../QuickMeeting/UpdateQuickMeeting/UpdateQuickMeeting";
import { useResolutionContext } from "../../../context/ResolutionContext";
import DownloadOptionsModal from "./DownloadMeetingTranscribeAndRecording/DownloadOptionsModal/DownloadOptionsModal";
import DeleteMeetingConfirmationModal from "./deleteMeetingConfirmationModal/deleteMeetingConfirmationModal";
import EmptyTableComponent from "./EmptyTableComponent/EmptyTableComponent";

const NewMeeting = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  const {
    editorRole,
    setEditorRole,
    setVideoTalk,
    videoTalk,
    viewAdvanceMeetingModal,
    setViewAdvanceMeetingModal,
    viewProposeDatePoll,
    setViewProposeDatePoll,
    viewFlag,
    setViewFlag,
    setAdvanceMeetingModalID,
    advanceMeetingModalID,
    setSceduleMeeting,
    sceduleMeeting,
    setDataroomMapFolderId,
    dataroomMapFolderId,
    isEditMeeting,
    setEditMeeting,
    setPolls,
    boardDeckMeetingID,
    setmeetingDetails,
    boardDeckMeetingTitle,
    setDownloadMeeting,
    setDeleteMeetingRecord,
    setDeleteMeetingConfirmationModal,
    deleteMeetingConfirmationModal,
    viewAdvanceMeetingModalUnpublish,
    setViewAdvanceMeetingModalUnpublish,
  } = useContext(MeetingContext);

  const { setResultresolution } = useResolutionContext();

  const meetingVideoRecording = useSelector(
    (state) => state.DataRoomReducer.meetingVideoRecording
  );
  const AllUserChats = useSelector((state) => state.talkStateData.AllUserChats);
  const MeetingStatusSocket = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusSocket
  );
  const MeetingStatusEnded = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusEnded
  );
  const allMeetingsSocketData = useSelector(
    (state) => state.meetingIdReducer.allMeetingsSocketData
  );
  const CommitteeMeetingMQTT = useSelector(
    (state) => state.meetingIdReducer.CommitteeMeetingMQTT
  );
  const GroupMeetingMQTT = useSelector(
    (state) => state.meetingIdReducer.GroupMeetingMQTT
  );
  const ResponseMessages = useSelector(
    (state) => state.MeetingOrganizersReducer.ResponseMessage
  );
  const scheduleMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.scheduleMeetingPageFlag
  );
  const mqtMeetingPrRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqtMeetingPrRemoved
  );
  const mqttMeetingPrAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingPrAdded
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );
  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );
  const CalendarDashboardEventData = useSelector(
    (state) => state.NewMeetingreducer.CalendarDashboardEventData
  );
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings
  );
  const endForAllMeeting = useSelector(
    (state) => state.NewMeetingreducer.endForAllMeeting
  );
  const endMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.endMeetingModal
  );
  const mqttMeetingAcRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcRemoved
  );
  const meetingStatusPublishedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData
  );
  const CurrentMeetingURL = useSelector(
    (state) => state.NewMeetingreducer.CurrentMeetingURL
  );
  const meetingStatusNotConductedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusNotConductedMqttData
  );
  const meetingReminderNotification = useSelector(
    (state) => state.NewMeetingreducer.meetingReminderNotification
  );
  const viewProposeDatesMeetingPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewProposeDateMeetingPageFlag
  );
  const viewAdvanceMeetingsPublishPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingPublishPageFlag
  );

  const viewAdvanceMeetingsUnpublishPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag
  );
  const viewProposeOrganizersMeetingPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewProposeOrganizerMeetingPageFlag
  );
  const boardDeckModalData = useSelector(
    (state) => state.NewMeetingreducer.boardDeckModalData
  );
  const boardDeckEmailModal = useSelector(
    (state) => state.NewMeetingreducer.boardDeckEmailModal
  );
  const boarddeckShareModal = useSelector(
    (state) => state.NewMeetingreducer.boarddeckShareModal
  );
  const shareViaDataRoomPathConfirmModal = useSelector(
    (state) => state.NewMeetingreducer.shareViaDataRoomPathConfirmation
  );
  //Proposed Meeting View Flag
  const ProposedMeetViewFlag = useSelector(
    (state) => state.NewMeetingreducer.ProposedMeetingViewFlag
  );

  let currentLanguage = localStorage.getItem("i18nextLng");
  let AgCont = localStorage.getItem("AgCont");
  let AdOrg = localStorage.getItem("AdOrg");
  let MeetingStr = localStorage.getItem("meetingStr");
  let MeetinUpd = localStorage.getItem("meetingUpd");
  let MeetingMin = localStorage.getItem("meetingMin");
  let MeetingProp = localStorage.getItem("meetingprop");
  let MtAgUpdate = localStorage.getItem("mtAgUpdate");
  let meetingCanc = localStorage.getItem("meetingCanc");
  let UserMeetPropoDatPoll = localStorage.getItem("UserMeetPropoDatPoll");
  // let AdCont
  //Current User ID
  let currentUserId = localStorage.getItem("userID");
  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");
  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let userID = localStorage.getItem("userID");
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [meetingOrganizerSort, setMeetingOrganizerSort] = useState(null);
  const [meetingDateTimeSort, setMeetingDateTimeSort] = useState(null);

  const [quickMeeting, setQuickMeeting] = useState(false);
  const [proposedNewMeeting, setProposedNewMeeting] = useState(false);
  //Edit proposed Meeting Flow
  const [isProposedMeetEdit, setIsProposedMeetEdit] = useState(false);
  const [searchMeeting, setSearchMeeting] = useState(false);
  const [isDownloadAvailable, setIsDownloadAvailable] = useState(false);
  const [downloadMeetingRecord, setDownloadMeetingRecord] = useState(null);

  const [isMeetingTypeFilter, setMeetingTypeFilter] = useState([]);
  const [defaultFiltersValues, setDefaultFilterValues] = useState([]);
  const [boarddeckOptions, setBoarddeckOptions] = useState({
    selectall: false,
    Organizer: false,
    AgendaContributor: false,
    Participants: false,
    Minutes: false,
    Task: false,
    polls: false,
    attendeceReport: false,
    video: false,
    Agenda: false,
  });
  //For Search Field Only
  const [searchText, setSearchText] = useState("");
  const [entereventIcon, setentereventIcon] = useState(false);
  const [editFlag, setEditFlag] = useState(false);

  const [currentMeetingID, setCurrentMeetingID] = useState(0);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [rows, setRow] = useState([]);
  const [dublicatedrows, setDublicatedrows] = useState([]);
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
  const [startMeetingButton, setStartMeetingButton] = useState([]);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [viewProposeOrganizerPoll, setViewProposeOrganizerPoll] =
    useState(false);
  const [responseByDate, setResponseByDate] = useState("");
  const [radioValue, setRadioValue] = useState(1);

  const [dashboardEventData, setDashboardEventData] = useState(null);

  //Filteration States Meeting Types
  const [selectedMeetingTypes, setSelectedMeetingTypes] = useState(
    isMeetingTypeFilter.map((filter) => filter.value)
  );
  const [visibleMeetingType, setVisibleMeetingType] = useState(false);
  //Filteration Work Meeting Status States
  const [visible, setVisible] = useState(false);
  const [talkGroupID, setTalkGroupID] = useState(0);
  const [selectedValues, setSelectedValues] = useState([
    "10",
    "1",
    "9",
    "4",
    "8",
  ]);

  const filters = [
    {
      value: "10",
      text: t("Active"),
    },
    {
      value: "1",
      text: t("Upcoming"),
    },
    {
      value: "9",
      text: t("Ended"),
    },
    {
      value: "4",
      text: t("Cancelled"),
    },
    {
      value: "8",
      text: t("Not-conducted"),
    },
  ];

  const globalFunctionWebnotificationFlag = useSelector(
    (state) => state.settingReducer.globalFunctionWebnotificationFlag
  );

  const webNotifactionDataRoutecheckFlag = JSON.parse(
    localStorage.getItem("webNotifactionDataRoutecheckFlag")
  );

  const viewPublishMinutesLink = localStorage.getItem("viewPublishMinutesLink");

  const webNotificationData = useSelector(
    (state) => state.settingReducer.webNotificationDataVideoIntimination
  );

  const { setViewGroupPage, setShowModal } = useGroupsContext();

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
  let viewMeetingRoute = localStorage.getItem("viewMeetingLink");
  const reviewSubmittedMinutesLink = localStorage.getItem(
    "reviewSubmittedMinutesLink"
  );

  useEffect(() => {
    if (meetingVideoRecording !== null) {
      try {
        const { meetingID, fileID } = meetingVideoRecording;

        console.log(meetingVideoRecording, "meetingIDmeetingID");
        setRow((prevRows) => {
          return prevRows.map((meetingRecord) => {
            if (
              Number(meetingRecord?.pK_MDID) === Number(meetingID) &&
              meetingRecord?.isPrimaryOrganizer === true
            ) {
              console.log(meetingRecord, "meetingIDmeetingID");

              return {
                ...meetingRecord,
                isRecordingAvailable: true,
              };
            }
            return meetingRecord;
          });
        });
        dispatch(meetingVideoRecording(null));

        console.log(rows, "meetingRecords");
      } catch (error) {}
    }
  }, [meetingVideoRecording]);
  console.log(rows, "meetingRecords");

  useEffect(() => {
    try {
      if (reviewSubmittedMinutesLink !== null) {
        const action = async () => {
          const getResponse = await dispatch(
            validateEncryptedStringViewMeetingLinkApi(
              reviewSubmittedMinutesLink,
              navigate,
              t
            )
          );
          console.log(getResponse, "viewFol_action");
          if (
            getResponse.isExecuted === true &&
            getResponse.responseCode === 1
          ) {
            const {
              attendeeId,
              isQuickMeeting,
              meetingID,
              meetingStatusId,
              organizationID,
              userID,
              isChat,
              talkGroupId,
              isVideo,
              videoCallUrl,
              isMinutePublished,
            } = getResponse.response;
            setEditorRole({
              status: String(meetingStatusId),
              role:
                attendeeId === 2
                  ? "Participant"
                  : attendeeId === 4
                  ? "Agenda Contributor"
                  : "Organizer",
              isPrimaryOrganizer: false,
            });
            setVideoTalk({
              isChat: isChat,
              isVideoCall: isVideo,
              talkGroupID: talkGroupId,
            });
            dispatch(emailRouteID(5));
            setAdvanceMeetingModalID(meetingID);
            setViewAdvanceMeetingModal(true);
            dispatch(viewAdvanceMeetingPublishPageFlag(true));
            dispatch(scheduleMeetingPageFlag(false));
            localStorage.setItem("currentMeetingID", meetingID);
            localStorage.setItem("isMinutePublished", isMinutePublished);
          }
          localStorage.removeItem("viewPublishMinutesLink");
        };
        action();
      }
    } catch (error) {
      console.log(error);
    }
  }, [reviewSubmittedMinutesLink]);

  useEffect(() => {
    if (viewMeetingRoute !== null) {
      const action = async () => {
        const getResponse = await dispatch(
          validateEncryptedStringViewMeetingLinkApi(
            viewMeetingRoute,
            navigate,
            t
          )
        );
        console.log(getResponse, "viewFol_action");

        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          const {
            attendeeId,
            isQuickMeeting,
            meetingID,
            meetingStatusId,
            organizationID,
            userID,
            isChat,
            talkGroupId,
            isVideo,
            videoCallUrl,
            isMinutePublished,
          } = getResponse.response;

          if (meetingStatusId === "10" || meetingStatusId === 10) {
            if (isQuickMeeting) {
              let joinMeetingData = {
                VideoCallURL: videoCallUrl,
                FK_MDID: meetingID,
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
            } else {
              let joinMeetingData = {
                VideoCallURL: videoCallUrl,
                FK_MDID: meetingID,
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
              setEditorRole({
                status: String(meetingStatusId),
                role:
                  attendeeId === 2
                    ? "Participant"
                    : attendeeId === 4
                    ? "Agenda Contributor"
                    : "Organizer",
                isPrimaryOrganizer: false,
              });
              setVideoTalk({
                isChat: isChat,
                isVideoCall: isVideo,
                talkGroupID: talkGroupId,
              });
              localStorage.setItem("videoCallURL", videoCallUrl);

              dispatch(viewMeetingFlag(true));
              localStorage.setItem("isMinutePublished", isMinutePublished);
            }
          } else {
            if (isQuickMeeting) {
              let Data = { MeetingID: meetingID };
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
              setEditorRole({
                status: String(meetingStatusId),
                role:
                  attendeeId === 2
                    ? "Participant"
                    : attendeeId === 4
                    ? "Agenda Contributor"
                    : "Organizer",
                isPrimaryOrganizer: false,
              });
              setVideoTalk({
                isChat: isChat,
                isVideoCall: isVideo,
                talkGroupID: talkGroupId,
              });
              setAdvanceMeetingModalID(meetingID);
              setViewAdvanceMeetingModal(true);
              setmeetingDetails(true);
              dispatch(viewAdvanceMeetingPublishPageFlag(true));
              dispatch(scheduleMeetingPageFlag(false));
              localStorage.setItem("currentMeetingID", meetingID);
              localStorage.setItem("isMinutePublished", isMinutePublished);
            }
          }
        }
        localStorage.removeItem("viewMeetingLink");
      };
      action();
    }
  }, [viewMeetingRoute]);

  //Notification Click Navigation work for Proposed meeting Participant request
  const callApi = async () => {
    try {
      if (
        JSON.parse(localStorage.getItem("ProposedMeetingOperations")) === true
      ) {
        //Here to implemented the logic when the prposed meeting dates are not selected
        if (
          JSON.parse(
            localStorage.getItem("BeforeProposedDateSelectedCheck")
          ) === true
        ) {
          dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
          setViewProposeDatePoll(true);
          dispatch(proposedMeetingDatesGlobalFlag(true));
          dispatch(viewProposeDateMeetingPageFlag(true));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
        }
        let StoredNotificationClickProposedMeetingDate = localStorage.getItem(
          "ProposedMeetOperationsDateSelectedSendResponseByDate"
        );
        //Here i will apply that if polls are not expired i will redirect it to the voting page
        // Get the current date in "YYYYMMDD" format
        const currentDate = new Date();
        const formattedCurrentDate = `${currentDate.getFullYear()}${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;
        console.log(
          StoredNotificationClickProposedMeetingDate,
          "storedDatestoredDatestoredDate"
        );
        console.log(formattedCurrentDate, "storedDatestoredDatestoredDate");
        // Compare stored date with the current date
        if (
          StoredNotificationClickProposedMeetingDate <= formattedCurrentDate
        ) {
          dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
          setViewProposeDatePoll(true);
          dispatch(proposedMeetingDatesGlobalFlag(true));
          dispatch(viewProposeDateMeetingPageFlag(true));
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
        } else {
          //Other wise Move to Proposed meeting listing page
          dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
          setViewProposeDatePoll(false);
          dispatch(proposedMeetingDatesGlobalFlag(false));
          dispatch(viewProposeDateMeetingPageFlag(false));
          //here After Navigating if the polls has been expired remove the date of the Proposed meeting from Local storage
          localStorage.removeItem(
            "ProposedMeetOperationsDateSelectedSendResponseByDate"
          );
        }
      } else if (
        JSON.parse(localStorage.getItem("ProposedMeetingOrganizer")) === true
      ) {
        console.log("ComingIN");
        //Notification if the Organizer clicks on the proposed meeting date submission Notification
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber: 1,
          Length: 30,
          PublishedMeetings: false,
        };
        dispatch(searchNewUserMeeting(navigate, searchData, t));
        localStorage.setItem("MeetingCurrentView", 2);
        localStorage.setItem("MeetingPageRows", 30);
        localStorage.setItem("MeetingPageCurrent", 1);
        setSearchFeilds({
          ...searchFields,
          Date: "",
          DateView: "",
          MeetingTitle: "",
          OrganizerName: "",
        });
        setSearchMeeting(false);
        setSearchText("");
        setentereventIcon(false);
      } else if (localStorage.getItem("reviewSubmittedMinutesLink") !== null) {
        let getURL = localStorage.getItem("reviewSubmittedMinutesLink");
        const getResponse = await dispatch(
          validateEncryptedStringViewMeetingLinkApi(getURL, navigate, t)
        );
        console.log(getResponse, "viewFol_action");
        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          const {
            attendeeId,
            isQuickMeeting,
            meetingID,
            meetingStatusId,
            organizationID,
            userID,
            isChat,
            talkGroupId,
            isVideo,
            videoCallUrl,
            isMinutePublished,
          } = getResponse.response;
          setEditorRole({
            status: String(meetingStatusId),
            role:
              attendeeId === 2
                ? "Participant"
                : attendeeId === 4
                ? "Agenda Contributor"
                : "Organizer",
            isPrimaryOrganizer: false,
          });
          setVideoTalk({
            isChat: isChat,
            isVideoCall: isVideo,
            talkGroupID: talkGroupId,
          });
          dispatch(emailRouteID(5));
          setAdvanceMeetingModalID(meetingID);
          setViewAdvanceMeetingModal(true);
          dispatch(viewAdvanceMeetingPublishPageFlag(true));
          dispatch(scheduleMeetingPageFlag(false));
          localStorage.setItem("currentMeetingID", meetingID);
          localStorage.setItem("isMinutePublished", isMinutePublished);
        }
        localStorage.removeItem("viewPublishMinutesLink");
      } else {
        if (meetingpageRow !== null && meetingPageCurrent !== null) {
          console.log(meetingpageRow, "QuicMeetingOperations");
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber: Number(meetingPageCurrent),
            Length: Number(meetingpageRow),
            PublishedMeetings:
              MeetingProp !== null
                ? false
                : UserMeetPropoDatPoll !== null
                ? false
                : true,
          };
          if (
            getALlMeetingTypes.length === 0 &&
            Object.keys(getALlMeetingTypes).length === 0
          ) {
            await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
          }
          await dispatch(searchNewUserMeeting(navigate, searchData, t));
          //Notification Trigger of Quick Meeting published
          if (
            JSON.parse(localStorage.getItem("QuicMeetingOperations")) === true
          ) {
            console.log("QuicMeetingOperations");
            let NotificationClickQuickMeetingID = localStorage.getItem(
              "NotificationQuickMeetingID"
            );
            let Data = { MeetingID: Number(NotificationClickQuickMeetingID) };
            await dispatch(
              ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6)
            );
          }
          //Notification if Published Advance meeting is Triggered
          if (
            JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) ===
            true
          ) {
            console.log("AdvanceOperations");
            setViewAdvanceMeetingModal(true);
            dispatch(viewAdvanceMeetingPublishPageFlag(true));
            dispatch(scheduleMeetingPageFlag(false));
          }
        } else {
          console.log("QuicMeetingOperations");
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber: 1,
            Length: 30,
            PublishedMeetings:
              MeetingProp !== null
                ? false
                : UserMeetPropoDatPoll !== null
                ? false
                : true,
          };

          await dispatch(searchNewUserMeeting(navigate, searchData, t));
        }

        if (
          localStorage.getItem("meetingprop") !== null ||
          localStorage.getItem("UserMeetPropoDatPoll") !== null
        ) {
          localStorage.setItem("MeetingCurrentView", 2);
        } else {
          localStorage.setItem("MeetingCurrentView", 1);
        }
        //Notification Trigger of Quick Meeting published
        if (
          JSON.parse(localStorage.getItem("QuicMeetingOperations")) === true
        ) {
          console.log("QuicMeetingOperations");
          let NotificationClickQuickMeetingID = localStorage.getItem(
            "NotificationQuickMeetingID"
          );
          let Data = { MeetingID: Number(NotificationClickQuickMeetingID) };
          await dispatch(
            ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6)
          );
        }
        //Notification if Published Advance meeting is Triggered
        if (
          JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true
        ) {
          console.log("AdvanceOperations");
          setViewAdvanceMeetingModal(true);
          dispatch(viewAdvanceMeetingPublishPageFlag(true));
          dispatch(scheduleMeetingPageFlag(false));
        }
      }
      if (
        getALlMeetingTypes.length === 0 &&
        Object.keys(getALlMeetingTypes).length === 0
      ) {
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  let calendarMainMeeting = location.state?.CalendaradvanceMeeting;

  useEffect(() => {
    if (viewPublishMinutesLink !== null) {
      const actionFunc = async () => {
        const getResponse = await dispatch(
          validateEncryptedStringViewMeetingLinkApi(
            viewPublishMinutesLink,
            navigate,
            t
          )
        );
        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          const {
            attendeeId,
            isQuickMeeting,
            meetingID,
            meetingStatusId,
            organizationID,
            userID,
            isChat,
            talkGroupId,
            isVideo,
            videoCallUrl,
            isMinutePublished,
          } = getResponse.response;
          setEditorRole({
            status: String(meetingStatusId),
            role:
              attendeeId === 2
                ? "Participant"
                : attendeeId === 4
                ? "Agenda Contributor"
                : "Organizer",
            isPrimaryOrganizer: false,
          });
          setVideoTalk({
            isChat: isChat,
            isVideoCall: isVideo,
            talkGroupID: talkGroupId,
          });
          dispatch(emailRouteID(5));
          setAdvanceMeetingModalID(meetingID);
          setViewAdvanceMeetingModal(true);
          dispatch(viewAdvanceMeetingPublishPageFlag(true));
          dispatch(scheduleMeetingPageFlag(false));
          localStorage.setItem("currentMeetingID", meetingID);
          localStorage.setItem("isMinutePublished", isMinutePublished);
        }
        localStorage.removeItem("viewPublishMinutesLink");
      };
      actionFunc();
    }
  }, [viewPublishMinutesLink]);

  useEffect(() => {
    if (
      location.state !== null &&
      location.state?.CalendaradvanceMeeting === true
    ) {
      try {
        const {
          statusID,
          isQuickMeeting,
          attendeeRoleID,
          isPrimaryOrganizer,
          meetingID,
          videoCallURL,
          isChat,
          isVideoCall,
          talkGroupID,
        } = location.state?.advancemeetingData;

        const fetchData = async () => {
          setEditorRole({
            status: statusID,
            role:
              attendeeRoleID === 2
                ? "Participant"
                : attendeeRoleID === 4
                ? "Agenda Contributor"
                : "Organizer",
            isPrimaryOrganizer: isPrimaryOrganizer,
          });
          setVideoTalk({
            isChat: isChat,
            isVideoCall: isVideoCall,
            talkGroupID: talkGroupID,
          });

          if (statusID === "10" || statusID === 10) {
            let joinMeetingData = {
              VideoCallURL: videoCallURL,
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
          } else {
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
    if (MtAgUpdate !== null) {
      try {
        validateStringEmailApi(MtAgUpdate, navigate, t, 3, dispatch)
          .then(async (result) => {
            const {
              isQuickMeeting,
              attendeeId,
              meetingStatusId,
              videoCallUrl,
              meetingID,
              isChat,
              isVideo,
              talkGroupId,
              isMinutePublished,
            } = result;

            if (meetingStatusId === "10" || meetingStatusId === 10) {
              let joinMeetingData = {
                VideoCallURL: videoCallUrl,
                FK_MDID: meetingID,
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
              setEditorRole({
                status: String(meetingStatusId),
                role:
                  attendeeId === 2
                    ? "Participant"
                    : attendeeId === 4
                    ? "Agenda Contributor"
                    : "Organizer",
                isPrimaryOrganizer: false,
              });
              setVideoTalk({
                isChat: isChat,
                isVideoCall: isVideo,
                talkGroupID: talkGroupId,
              });
              localStorage.setItem("videoCallURL", videoCallUrl);

              dispatch(viewMeetingFlag(true));
              localStorage.setItem("isMinutePublished", isMinutePublished);
            } else {
              setEditorRole({
                status: String(meetingStatusId),
                role:
                  attendeeId === 2
                    ? "Participant"
                    : attendeeId === 4
                    ? "Agenda Contributor"
                    : "Organizer",
                isPrimaryOrganizer: false,
              });
              setVideoTalk({
                isChat: isChat,
                isVideoCall: isVideo,
                talkGroupID: talkGroupId,
              });
              setAdvanceMeetingModalID(meetingID);
              setViewAdvanceMeetingModal(true);
              dispatch(viewAdvanceMeetingPublishPageFlag(true));
              dispatch(scheduleMeetingPageFlag(false));
              localStorage.setItem("currentMeetingID", meetingID);
              localStorage.setItem("isMinutePublished", isMinutePublished);
            }

            localStorage.removeItem("mtAgUpdate");
          })
          .catch((error) => {
            console.error("Error:", error);
            localStorage.removeItem("mtAgUpdate");
            // Handle errors here
          });
      } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem("mtAgUpdate");
      }
    }
  }, [MtAgUpdate]);

  const ViewMeetingThroughEmailFunc = (result) => {
    const {
      attendeeId,
      isQuickMeeting,
      meetingID,
      meetingStatusId,
      organizationID,
      userID,
      isChat,
      talkGroupId,
      isVideo,
      videoCallUrl,
      isMinutePublished,
    } = result;
    setEditorRole({
      status: String(meetingStatusId),
      role:
        attendeeId === 2
          ? "Participant"
          : attendeeId === 4
          ? "Agenda Contributor"
          : "Organizer",
      isPrimaryOrganizer: false,
    });
    setVideoTalk({
      isChat: isChat,
      isVideoCall: isVideo,
      talkGroupID: talkGroupId,
    });
    dispatch(emailRouteID(5));
    setAdvanceMeetingModalID(meetingID);
    setViewAdvanceMeetingModal(true);
    dispatch(viewAdvanceMeetingPublishPageFlag(true));
    dispatch(scheduleMeetingPageFlag(false));
    localStorage.setItem("currentMeetingID", meetingID);
    localStorage.setItem("isMinutePublished", isMinutePublished);
  };

  useEffect(() => {
    if (AgCont !== null) {
      // Usage example:
      validateStringEmailApi(AgCont, navigate, t, 1, dispatch)
        .then(async (result) => {
          // Handle the result here

          await setAdvanceMeetingModalID(Number(result.meetingID));
          await setViewAdvanceMeetingModalUnpublish(true);
          await dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
          setEditorRole({
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
          localStorage.removeItem("AgCont");
          // Handle errors here
        });
    }
  }, [AgCont]);

  useEffect(() => {
    if (AdOrg !== null) {
      validateStringEmailApi(AdOrg, navigate, t, 2, dispatch)
        .then(async (result) => {
          // Handle the result here

          await setAdvanceMeetingModalID(Number(result.meetingID));
          await setViewAdvanceMeetingModalUnpublish(true);
          await dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
          setEditorRole({
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
          localStorage.removeItem("AdOrg");
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle errors here
          localStorage.removeItem("AdOrg");
        });
    }
  }, [AdOrg]);

  useEffect(() => {
    if (MeetingStr !== null) {
      // Meeting Start Route 3
      validateStringEmailApi(MeetingStr, navigate, t, 3, dispatch)
        .then(async (result) => {
          // Handle the result here

          let Data = {
            VideoCallURL: result.videoCallURL,
            FK_MDID: Number(result.meetingID),
            DateTime: getCurrentDateTimeUTC(),
          };
          if (result.isQuickMeeting === true) {
            await dispatch(
              JoinCurrentMeeting(
                true,
                navigate,
                t,
                Data,
                setViewFlag,
                setEditFlag,
                setSceduleMeeting,
                1,
                setAdvanceMeetingModalID,
                setViewAdvanceMeetingModal
              )
            );
          } else {
            await setAdvanceMeetingModalID(Number(result.meetingID));
            await setViewAdvanceMeetingModalUnpublish(true);
            await dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
            setEditorRole({
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
          }
          localStorage.removeItem("MeetingStr");
        })
        .catch((error) => {
          console.error("Error:", error);
          localStorage.removeItem("meetingStr");
          //
        });
    }
  }, [MeetingStr]);

  useEffect(() => {
    if (meetingCanc !== null) {
      try {
        validateStringEmailApi(meetingCanc, navigate, t, 4, dispatch)
          .then(async (result) => {
            console.log(result, "resultresultresult");
            // Handle the result here
            if (result.isQuickMeeting === true) {
              let requestDataForMeetingDetails = {
                MeetingID: Number(result.meetingID),
              };
              await dispatch(
                ViewMeeting(
                  navigate,
                  requestDataForMeetingDetails,
                  t,
                  setViewFlag,
                  setEditFlag,
                  "",
                  1
                )
              );
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            localStorage.removeItem("meetingCanc");
            //
          });
      } catch (error) {
        localStorage.removeItem("meetingCanc");
      }
    }
  }, [meetingCanc]);

  useEffect(() => {
    if (MeetinUpd !== null) {
      // Meeting Update Route 4
      validateStringEmailApi(MeetinUpd, navigate, t, 4, dispatch)
        .then(async (result) => {
          console.log(result, "resultresultresult");
          // Handle the result here
          if (result.isQuickMeeting === true) {
            let requestDataForMeetingDetails = {
              MeetingID: Number(result.meetingID),
            };
            await dispatch(
              ViewMeeting(
                navigate,
                requestDataForMeetingDetails,
                t,
                setViewFlag,
                setEditFlag,
                "",
                1
              )
            );
          } else {
            await setAdvanceMeetingModalID(Number(result.meetingID));
            await setViewAdvanceMeetingModalUnpublish(true);
            await dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
            setEditorRole({
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
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          localStorage.removeItem("meetingUpd");
          //
        });
    }
  }, [MeetinUpd]);

  useEffect(() => {
    if (MeetingMin !== null) {
      // Email Route 5
      validateStringEmailApi(MeetingMin, navigate, t, 5, dispatch)
        .then(async (result) => {
          // Handle the result here

          await setAdvanceMeetingModalID(Number(result.meetingID));
          await setViewAdvanceMeetingModalUnpublish(true);
          await dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
          setEditorRole({
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
          localStorage.removeItem("meetingMin");
        })

        .catch((error) => {
          console.error("Error:", error);
          localStorage.removeItem("meetingMin");
          //
        });
    }
  }, [MeetingMin]);

  //  Call all search meetings api
  useEffect(() => {
    // if (
    //   CalendarDashboardEventData === null ||
    //   CalendarDashboardEventData === undefined
    // ) {
    callApi();
    // }
    return () => {
      localStorage.removeItem("meetingMin");
      localStorage.removeItem("meetingUpd");
      localStorage.removeItem("meetingCanc");
      localStorage.removeItem("MeetingStr");
      localStorage.removeItem("AdOrg");
      localStorage.removeItem("AgCont");
      localStorage.removeItem("mtAgUpdate");
      localStorage.removeItem("viewMeetingLink");
      localStorage.removeItem("viewPublishMinutesLink");
      dispatch(dashboardCalendarEvent(null));
      setResponseByDate("");
      setDashboardEventData(null);
      setEditFlag(false);
      setViewFlag(false);
      setViewAdvanceMeetingModal(false);
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(ProposedMeetingViewFlagAction(false));
      dispatch(proposeNewMeetingPageFlag(false));
      setSearchFeilds({
        ...searchFields,
        Date: "",
        DateView: "",
        MeetingTitle: "",
        OrganizerName: "",
      });
      setSearchMeeting(false);
      setSearchText("");
      setentereventIcon(false);
      dispatch(clearMeetingState());
    };
  }, []);

  useEffect(() => {
    try {
      if (
        getALlMeetingTypes?.meetingTypes !== null &&
        getALlMeetingTypes?.meetingTypes !== undefined
      ) {
        let meetingtypeFilter = [];
        let byDefault = {
          value: "0",
          text: "Quick-meeting",
        };
        meetingtypeFilter.push(byDefault);
        getALlMeetingTypes?.meetingTypes.forEach((data, index) => {
          meetingtypeFilter.push({
            text: data.type,
            value: String(data.pK_MTID),
          });
        });

        setMeetingTypeFilter(meetingtypeFilter);
      }
    } catch (error) {}
  }, [getALlMeetingTypes?.meetingTypes]);

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
    console.log("chek search meeting");
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setentereventIcon(false);
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
    console.log("chek search meeting");
    await dispatch(searchNewUserMeeting(navigate, searchData, t));

    setSearchMeeting(false);
    // setentereventIcon(true);
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
    // Always format the API date in a standard format
    let DateFormat = new DateObject(date).format("YYYY-MM-DD");

    // Format the display date based on the locale
    let DateFormatView = new DateObject(date)
      .setLocale(localValue)
      .format("DD/MM/YYYY");

    setSearchFeilds({
      ...searchFields,
      Date: DateFormat, // Standard date for API
      DateView: DateFormatView, // Localized display date
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

  const openSceduleMeetingPage = async () => {
    setSceduleMeeting(true);
    setEditorRole({
      ...editorRole,
      status: "11",
      role: "Organizer",
      isPrimaryOrganizer: true,
    });
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
    dispatch(viewMeetingFlag(true));
  };

  const openProposedNewMeetingPage = () => {
    setProposedNewMeeting(true);
  };

  const groupChatInitiation = async (data) => {
    console.log(data, "datadatadata");
    if (data.talkGroupID !== 0) {
      await dispatch(createShoutAllScreen(false));
      await dispatch(addNewChatScreen(false));
      await dispatch(footerActionStatus(false));
      await dispatch(createGroupScreen(false));
      await dispatch(chatBoxActiveFlag(false));
      await dispatch(recentChatFlag(true));
      await dispatch(activeChatBoxGS(true));
      await dispatch(chatBoxActiveFlag(true));
      await dispatch(headerShowHideStatus(true));
      await dispatch(footerShowHideStatus(true));
      setTalkGroupID(data.talkGroupID);
      let chatGroupData = {
        UserID: parseInt(currentUserId),
        ChannelID: currentOrganizationId,
        GroupID: data.talkGroupID,
        NumberOfMessages: 50,
        OffsetMessage: 0,
      };
      await dispatch(
        GetAllUserChats(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      await dispatch(GetGroupMessages(navigate, chatGroupData, t));
      await dispatch(
        GetAllUsers(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      await dispatch(
        GetAllUsersGroupsRoomsList(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
    }
  };

  useEffect(() => {
    if (
      AllUserChats?.AllUserChatsData !== null &&
      AllUserChats?.AllUserChatsData !== undefined &&
      Object.keys(AllUserChats?.AllUserChatsData).length > 0 &&
      talkGroupID !== 0
    ) {
      let allChatMessages = AllUserChats?.AllUserChatsData;
      const foundRecord = allChatMessages.allMessages.find(
        (item) => item.id === talkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", talkGroupID);
      setTalkGroupID(0);
    }
  }, [AllUserChats.AllUserChatsData, talkGroupID]);

  const CreateQuickMeetingFunc = async () => {
    setQuickMeeting(true);
  };

  //Published Meeting Page
  const handlePublishedMeeting = async () => {
    dispatch(clearMeetingState());
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: true,
    };
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }
    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 1);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setSearchText("");
    setentereventIcon(false);
  };

  //UnPublished Meeting Page
  const handleUnPublishedMeeting = async () => {
    dispatch(clearMeetingState());

    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: false,
    };
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }
    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 2);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setSearchText("");
    setentereventIcon(false);
  };

  const handleViewMeeting = async (
    videoCallURL,
    id,
    isQuickMeeting,
    status
  ) => {
    console.log("handleViewMeeting", videoCallURL, id, isQuickMeeting, status);
    try {
      if (status === "10" || status === 10) {
        if (isQuickMeeting) {
          let joinMeetingData = {
            VideoCallURL: videoCallURL,
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
        } else {
          let joinMeetingData = {
            VideoCallURL: videoCallURL,
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

          // dispatch(
          //   GetAllUserChats(
          //     navigate,
          //     parseInt(currentUserId),
          //     parseInt(currentOrganizationId),
          //     t
          //   )
          // );
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
          // dispatch(scheduleMeetingPageFlag(false));
          // localStorage.setItem("currentMeetingID", id);
          // dispatch(
          //   GetAllUserChats(
          //     navigate,
          //     parseInt(currentUserId),
          //     parseInt(currentOrganizationId),
          //     t
          //   )
          // );
        }
      }
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setSearchText("");
    setentereventIcon(false);
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
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setSearchText("");
    setentereventIcon(false);
  };

  // onClick to download Report Api on download Icon
  const onClickDownloadIcon = async (meetingID) => {
    let downloadData = {
      MeetingID: Number(meetingID),
    };
    dispatch(downloadAttendanceReportApi(navigate, t, downloadData));
  };

  const downloadVideoCall = (data) => {
    console.log("downloadVideoCalldownloadVideoCall");
    let utcDateTime = resolutionResultTable(
      data.dateOfMeeting + data.meetingStartTime
    );
    let utcDate = moment(utcDateTime).format("DDMMYYYY");
    let utcTime = moment(utcDateTime).format("HHmmss");
    let Data = { FK_MDID: data.pK_MDID };
    dispatch(
      DownloadMeetingRecording(Data, navigate, t, data.title, utcDate, utcTime)
    );
  };

  //Combine filteration starts
  const applyCombinedFilters = (statusFilters, meetingTypeFilters) => {
    const filtered = dublicatedrows.filter((record) => {
      const matchesStatus = statusFilters.includes(record.status.toString());
      const matchesMeetingType = meetingTypeFilters.includes(
        record.meetingType.toString()
      );
      return matchesStatus && matchesMeetingType;
    });
    setRow(filtered);
  };

  //Combine filteration Ends

  //Filteration Work Meeting Status Starts

  // Menu click handler for selecting filters
  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyFilter = () => {
    applyCombinedFilters(selectedValues, selectedMeetingTypes);
    setVisible(false);
  };

  const resetFilter = () => {
    const defaultStatusValues = ["10", "1", "9", "4", "8"];
    setSelectedValues(defaultStatusValues);
    applyCombinedFilters(defaultStatusValues, selectedMeetingTypes);
    setVisible(false);
  };

  const handleClickChevron = () => {
    if (visibleMeetingType) {
      setVisibleMeetingType(false);
    }
    setVisible((prevVisible) => !prevVisible);
  };

  const handleClickChevronMeetingType = () => {
    if (visible) {
      setVisible(false);
    }
    setVisibleMeetingType((prevVisible) => !prevVisible);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}>
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {t(filter.text)}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex  align-items-center justify-content-between p-1'>
        <Button
          text={t("Reset")}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text={t("Ok")}
          disableBtn={selectedValues.length === 0}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );
  //Filteration Work Meeting Status Ends
  //Filteration Work Meeting Type Starts
  useEffect(() => {
    const defaultStatusValues = ["10", "1", "9", "4", "8"];
    const defaultMeetingTypes = isMeetingTypeFilter.map((f) => f.value);
    setSelectedValues(defaultStatusValues);
    setSelectedMeetingTypes(defaultMeetingTypes);
    applyCombinedFilters(defaultStatusValues, defaultMeetingTypes);
  }, [isMeetingTypeFilter]);

  // Toggle checkbox selection for each filter item
  const handleMenuClickMeetingType = (filterValue) => {
    setSelectedMeetingTypes((prev) =>
      prev.includes(filterValue)
        ? prev.filter((value) => value !== filterValue)
        : [...prev, filterValue]
    );
  };

  // Apply the selected filters
  const handleApplyFilterMeetingType = () => {
    applyCombinedFilters(selectedValues, selectedMeetingTypes);
    setVisibleMeetingType(false);
  };

  // Reset filters to show all meeting types
  const resetFilterMeetingType = () => {
    const defaultMeetingTypes = isMeetingTypeFilter.map(
      (filter) => filter.value
    );
    setSelectedMeetingTypes(defaultMeetingTypes);
    applyCombinedFilters(selectedValues, defaultMeetingTypes);
    setVisibleMeetingType(false);
  };

  // Define the filter menu
  const filterMenu = (
    <Menu>
      {isMeetingTypeFilter.map((filter) => (
        <Menu.Item key={filter.value}>
          <Checkbox
            checked={selectedMeetingTypes.includes(filter.value)}
            onChange={() => handleMenuClickMeetingType(filter.value)}>
            {t(filter.text)}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex align-items-center justify-content-between p-1'>
        <Button
          onClick={resetFilterMeetingType}
          className={styles["FilterResetBtn"]}
          text={t("Reset")}
        />
        <Button
          onClick={handleApplyFilterMeetingType}
          className={styles["ResetOkBtn"]}
          text={t("Ok")}
          disableBtn={selectedMeetingTypes.length === 0 ? true : false}
        />
      </div>
    </Menu>
  );

  const handleClickDownloadBtn = (record) => {
    console.log("recordrecordrecord", record);
    if (record.isVideoCall && record.isRecordingAvailable) {
      setIsDownloadAvailable(true);
    }
    // downloadMeetinModal,
    setDownloadMeetingRecord(record);
    setDownloadMeeting(true);
  };
  //Filteration Work Meeting Type Ends

  const handleClickDeleteMeeting = async (record) => {
    let Data = {
      MeetingID: record.pK_MDID,
      StatusID: 4,
    };

    setDeleteMeetingRecord(Data);
    setDeleteMeetingConfirmationModal(true);
  };

  const MeetingColoumns = [
    {
      title: (
        <span className='d-flex gap-2 align-items-center'>
          {" "}
          {t("Title")}{" "}
          {meetingTitleSort === "descend" ? (
            <img src={DescendIcon} alt='' />
          ) : (
            <img src={AscendIcon} alt='' />
          )}
        </span>
      ),
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      align: currentLanguage === "en" ? "left" : "right",
      width: "115px",
      render: (text, record) => {
        console.log(text, record, "ashashkdgahsgashdgh");
        // if (record.isQuickMeeting) {
        //   dispatch(viewMeetingFlag(true));
        // }
        return (
          <span
            className={styles["meetingTitle"]}
            onClick={() => {
              handleViewMeeting(
                record.videoCallURL,
                record.pK_MDID,
                record.isQuickMeeting,
                record.status
              );
              localStorage.setItem("videoCallURL", record.videoCallURL);
              setVideoTalk({
                isChat: record.isChat,
                isVideoCall: record.isVideoCall,
                talkGroupID: record.talkGroupID,
              });
              setEditorRole({
                status: record.status,
                role: record.isParticipant
                  ? "Participant"
                  : record.isAgendaContributor
                  ? "Agenda Contributor"
                  : "Organizer",
                isPrimaryOrganizer: record.isPrimaryOrganizer,
              });
              localStorage.setItem(
                "isMinutePublished",
                record.isMinutePublished
              );
              localStorage.setItem("meetingTitle", record.title);
              // dispatch(viewMeetingFlag(true));
              // setIsOrganisers(isOrganiser);
            }}>
            {text}
          </span>
        );
      },
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingTitleSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
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
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown
          className='filter-chevron-icon-todolist'
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}>
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        return StatusValue(t, record.status);
      },
    },
    {
      title: (
        <span className='d-flex gap-2 align-items-center justify-content-center'>
          {t("Organizer")}
          {meetingOrganizerSort === "descend" ? (
            <img src={DescendIcon} alt='' />
          ) : (
            <img src={AscendIcon} alt='' />
          )}
        </span>
      ),
      dataIndex: "host",
      key: "host",
      width: "110px",
      align: "center",
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingOrganizerSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      sorter: (a, b) =>
        a.host.toLowerCase().localeCompare(b.host.toLowerCase()),
      render: (text, record) => {
        return <span className={styles["orgaizer_value"]}>{record?.host}</span>;
      },
    },
    {
      title: (
        <span className='d-flex gap-2 align-items-center justify-content-center'>
          {t("Date-time")}
          {meetingDateTimeSort === "descend" ? (
            <img src={ArrowDownIcon} alt='' />
          ) : (
            <img src={ArrowUpIcon} alt='' />
          )}
        </span>
      ),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "155px",
      align: "center",
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingDateTimeSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span className='text-truncate d-block'>
              {newTimeFormaterAsPerUTCFullDate(
                record.dateOfMeeting + record.meetingStartTime,
                currentLanguage
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
      filterIcon: (filtered) => (
        <ChevronDown
          className='filter-chevron-icon-todolist'
          onClick={handleClickChevronMeetingType}
          // onClick={() => setVisibleMeetingType(!visibleMeetingType)}
          defaultChecked
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={filterMenu}
          visible={visibleMeetingType}
          onVisibleChange={(open) => setVisibleMeetingType(!open)}>
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        const meetingType = Number(record.meetingType);
        const matchedFilter = isMeetingTypeFilter.find(
          (data) => meetingType === Number(data.value)
        );

        console.log(matchedFilter, "matchedFiltermatchedFilter");
        return record.isQuickMeeting && meetingType === 1
          ? t("Quick-meeting")
          : t(matchedFilter)
          ? t(matchedFilter.text)
          : "";
      },
    },
    {
      dataIndex: "Chat",
      key: "Chat",
      width: "85px",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <div className={styles["icon-wrapper"]}>
              {record.isAttachment ? (
                <span>
                  <Tooltip placement='topRight' title={t("ClipIcon")}>
                    <img
                      src={ClipIcon}
                      className='cursor-pointer'
                      alt=''
                      draggable='false'
                    />
                  </Tooltip>
                </span>
              ) : null}

              {record.isVideoCall ? (
                <span>
                  <img
                    src={VideoIcon}
                    alt=''
                    title={t("Video")}
                    draggable='false'
                  />
                </span>
              ) : null}
              {record.isChat ? (
                <span onClick={(e) => groupChatInitiation(record)}>
                  <Tooltip placement='topLeft' title={t("Chat")}>
                    <img
                      src={CommentIcon}
                      className='cursor-pointer'
                      alt=''
                      draggable='false'
                    />
                  </Tooltip>
                </span>
              ) : null}
              {record.status === "9" &&
              (record.isOrganizer || record.isPrimaryOrganizer) ? (
                <Tooltip placement='topLeft' title={t("Attendance")}>
                  <img
                    src={member}
                    className='cursor-pointer'
                    alt=''
                    draggable='false'
                    onClick={() => onClickDownloadIcon(record.pK_MDID)}
                  />
                </Tooltip>
              ) : null}
            </div>
          </>
        );
      },
    },
    {
      dataIndex: "Join",
      key: "Join",
      width: "80px",
      align: "center",
      render: (text, record) => {
        console.log("end meeting chaek", record);
        const startMeetingRequest = {
          VideoCallURL: record.videoCallURL,
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
        const isButtonShown = startMeetingButton.find(
          (btnData, index) =>
            Number(btnData.meetingID) === Number(record.pK_MDID)
        );
        if (Number(record.status) === 1) {
          if (record.isParticipant) {
          } else if (record.isAgendaContributor) {
          } else {
            if (
              // startMeetingButton === true
              (record.isQuickMeeting === true &&
                minutesDifference < minutesAgo) ||
              (record.isQuickMeeting === true &&
                record.pK_MDID === isButtonShown?.meetingID &&
                isButtonShown?.showButton)
            ) {
              return (
                <span className='d-flex justify-content-center'>
                  <Button
                    text={t("Start-meeting")}
                    className={styles["Start-Meeting"]}
                    onClick={() => {
                      dispatch(
                        UpdateOrganizersMeeting(
                          record.isQuickMeeting,
                          navigate,
                          t,
                          4,
                          startMeetingRequest,
                          setEditorRole,
                          setAdvanceMeetingModalID,
                          setDataroomMapFolderId,
                          setSceduleMeeting,
                          setViewFlag,
                          setEditFlag
                        )
                      );
                      setEditorRole({
                        status: record.status,
                        role: "Organizer",
                        isPrimaryOrganizer: record.isPrimaryOrganizer,
                      });
                      setVideoTalk({
                        isChat: record.isChat,
                        isVideoCall: record.isVideoCall,
                        talkGroupID: record.talkGroupID,
                      });
                      localStorage.setItem("videoCallURL", record.videoCallURL);
                      localStorage.setItem("meetingTitle", record.title);
                      localStorage.setItem(
                        "isMinutePublished",
                        record.isMinutePublished
                      );
                    }}
                  />
                </span>
              );
            } else if (
              (record.isQuickMeeting === false &&
                minutesDifference < minutesAgo) ||
              (record.isQuickMeeting === false &&
                record.pK_MDID === isButtonShown?.meetingID &&
                isButtonShown?.showButton)
            ) {
              return (
                <span className='d-flex justify-content-center'>
                  <Button
                    text={t("Start-meeting")}
                    className={styles["Start-Meeting"]}
                    onClick={() => {
                      console.log(
                        "end meeting chaek",
                        startMeetingRequest,
                        record
                      );
                      dispatch(
                        UpdateOrganizersMeeting(
                          record.isQuickMeeting,
                          navigate,
                          t,
                          3,
                          startMeetingRequest,
                          setEditorRole,
                          // setAdvanceMeetingModalID,
                          setDataroomMapFolderId,
                          setViewAdvanceMeetingModal,
                          setAdvanceMeetingModalID,
                          setViewAdvanceMeetingModal,
                          record.isPrimaryOrganizer
                        )
                      );
                      setVideoTalk({
                        isChat: record.isChat,
                        isVideoCall: record.isVideoCall,
                        talkGroupID: record.talkGroupID,
                      });
                      localStorage.setItem("videoCallURL", record.videoCallURL);
                      localStorage.setItem("currentMeetingID", record.pK_MDID);
                      localStorage.setItem(
                        "isMinutePublished",
                        record.isMinutePublished
                      );
                      localStorage.setItem("meetingTitle", record.title);
                      setAdvanceMeetingModalID(record.pK_MDID);
                      dispatch(viewMeetingFlag(true));
                      // setViewAdvanceMeetingModal(true);
                      // dispatch(viewAdvanceMeetingPublishPageFlag(true));
                      dispatch(scheduleMeetingPageFlag(false));
                      setEditorRole({
                        status: 10,
                        role: "Organizer",
                        isPrimaryOrganizer: record.isPrimaryOrganizer,
                      });
                    }}
                  />
                </span>
              );
            }
          }
        } else if (Number(record.status) === 10) {
          if (record.isParticipant) {
            return (
              <span className='d-flex justify-content-center'>
                <Button
                  text={t("Join-meeting")}
                  className={styles["joining-Meeting"]}
                  onClick={() => {
                    handleViewMeeting(
                      record.videoCallURL,
                      record.pK_MDID,
                      record.isQuickMeeting,
                      record.status
                    );
                    setEditorRole({
                      status: record.status,
                      role: "Participant",
                      isPrimaryOrganizer: false,
                    });
                    setVideoTalk({
                      isChat: record.isChat,
                      isVideoCall: record.isVideoCall,
                      talkGroupID: record.talkGroupID,
                    });
                    localStorage.setItem("videoCallURL", record.videoCallURL);

                    // dispatch(viewMeetingFlag(true));
                    localStorage.setItem(
                      "isMinutePublished",
                      record.isMinutePublished
                    );
                    localStorage.setItem("meetingTitle", record.title);
                  }}
                />
              </span>
            );
          } else if (record.isAgendaContributor) {
            return (
              <span className='d-flex justify-content-center'>
                <Button
                  text={t("Join-meeting")}
                  className={styles["joining-Meeting"]}
                  onClick={() => {
                    handleViewMeeting(
                      record.videoCallURL,
                      record.pK_MDID,
                      record.isQuickMeeting,
                      record.status
                    );
                    // setIsOrganisers(isOrganiser);
                    setEditorRole({
                      status: record.status,
                      role: "Agenda Contributor",
                      isPrimaryOrganizer: false,
                    });
                    setVideoTalk({
                      isChat: record.isChat,
                      isVideoCall: record.isVideoCall,
                      talkGroupID: record.talkGroupID,
                    });
                    localStorage.setItem("videoCallURL", record.videoCallURL);

                    dispatch(viewMeetingFlag(true));
                    localStorage.setItem(
                      "isMinutePublished",
                      record.isMinutePublished
                    );
                    localStorage.setItem("meetingTitle", record.title);
                  }}
                />
              </span>
            );
          } else if (record.isOrganizer) {
            return (
              <span className='d-flex justify-content-center'>
                <Button
                  text={t("Join-meeting")}
                  className={styles["joining-Meeting"]}
                  onClick={() => {
                    handleViewMeeting(
                      record.videoCallURL,
                      record.pK_MDID,
                      record.isQuickMeeting,
                      record.status
                    );
                    // setIsOrganisers(isOrganiser);
                    setEditorRole({
                      status: record.status,
                      role: "Organizer",
                      isPrimaryOrganizer: record.isPrimaryOrganizer,
                    });
                    setVideoTalk({
                      isChat: record.isChat,
                      isVideoCall: record.isVideoCall,
                      talkGroupID: record.talkGroupID,
                    });
                    localStorage.setItem("videoCallURL", record.videoCallURL);

                    dispatch(viewMeetingFlag(true));
                    localStorage.setItem(
                      "isMinutePublished",
                      record.isMinutePublished
                    );
                    localStorage.setItem("meetingTitle", record.title);
                  }}
                />
              </span>
            );
          }
        } else if (
          Number(record.status) === 9 &&
          record.isOrganizer &&
          record.isQuickMeeting === false
        ) {
          return (
            <>
              <span className='d-flex justify-content-center'>
                <Button
                  text={t("Download")}
                  className={styles["Board-Deck"]}
                  onClick={() => handleClickDownloadBtn(record)}
                  // onClick={() => {
                  //   boardDeckOnClick(record);
                  //   setEditorRole({
                  //     status: record.status,
                  //     role: record.isParticipant
                  //       ? "Participant"
                  //       : record.isAgendaContributor
                  //       ? "Agenda Contributor"
                  //       : "Organizer",
                  //     isPrimaryOrganizer: record.isPrimaryOrganizer,
                  //   });
                  //   setVideoTalk({
                  //     isChat: record.isChat,
                  //     isVideoCall: record.isVideoCall,
                  //     talkGroupID: record.talkGroupID,
                  //   });
                  //   localStorage.setItem("videoCallURL", record.videoCallURL);
                  // }}
                />
              </span>
            </>
          );
        } else {
        }
      },
    },

    {
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      render: (text, record) => {
        console.log(record, "checkIsPrimaryOrganizercheckIsPrimaryOrganizer");
        const isQuickMeeting = record.isQuickMeeting;
        let checkIsPrimaryOrganizer = record.isPrimaryOrganizer;
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
                        className='d-flex justify-content-center'>
                        <Tooltip placement='topRight' title={t("Edit")}>
                          <img
                            src={EditIcon}
                            className='cursor-pointer'
                            width='17.11px'
                            height='17.11px'
                            alt=''
                            draggable='false'
                            onClick={() => {
                              handleEditMeeting(
                                record.pK_MDID,
                                record.isQuickMeeting,
                                "Organizer",
                                record
                              );
                              setVideoTalk({
                                isChat: record.isChat,
                                isVideoCall: record.isVideoCall,
                                talkGroupID: record.talkGroupID,
                              });
                              localStorage.setItem(
                                "videoCallURL",
                                record.videoCallURL
                              );
                            }}
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
                      className='d-flex justify-content-center'>
                      <Tooltip placement='topRight' title={t("Edit")}>
                        <img
                          src={EditIcon}
                          className='cursor-pointer'
                          width='17.11px'
                          height='17.11px'
                          alt=''
                          draggable='false'
                          onClick={() => {
                            handleEditMeeting(
                              record.pK_MDID,
                              record.isQuickMeeting,
                              // record.isAgendaContributor,
                              "Organizer",
                              record
                            );
                            setVideoTalk({
                              isChat: record.isChat,
                              isVideoCall: record.isVideoCall,
                              talkGroupID: record.talkGroupID,
                            });
                            localStorage.setItem(
                              "videoCallURL",
                              record.videoCallURL
                            );
                            setEditorRole({
                              status: record.status,
                              role: "Organizer",
                              isPrimaryOrganizer: record.isPrimaryOrganizer,
                            });
                            setEditMeeting(true);
                            dispatch(viewMeetingFlag(true));
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
                      className='d-flex justify-content-center'>
                      <Tooltip placement='topRight' title={t("Edit")}>
                        <img
                          src={EditIcon}
                          className='cursor-pointer'
                          width='17.11px'
                          height='17.11px'
                          alt=''
                          draggable='false'
                          onClick={() => {
                            handleEditMeeting(
                              record.pK_MDID,
                              record.isQuickMeeting,
                              // record.isAgendaContributor,
                              "Agenda Contributor",
                              record
                            );
                            setVideoTalk({
                              isChat: record.isChat,
                              isVideoCall: record.isVideoCall,
                              talkGroupID: record.talkGroupID,
                            });
                            localStorage.setItem(
                              "videoCallURL",
                              record.videoCallURL
                            );
                            setEditorRole({
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
    console.log("chek search meeting");
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchText("");
    setentereventIcon(false);
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
  };

  // Enter Press click handler on input field
  const handleKeyPress = async (event) => {
    console.log(
      meetingPageCurrent,
      "meetingPageCurrentmeetingPageCurrentmeetingPageCurrent"
    );
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
      console.log("chek search meeting");
      await dispatch(searchNewUserMeeting(navigate, searchData, t));
      setentereventIcon(true);
    }
  };

  const callStartMeetingFromEvents = async (dashboardEventData) => {
    let startMeetingRequest = {
      VideoCallURL: dashboardEventData.videoCallURL,
      MeetingID: Number(dashboardEventData.pK_MDID),
      StatusID: 10,
    };
    console.log("startMeetingRequest", dashboardEventData);
    await dispatch(
      UpdateOrganizersMeeting(
        false,
        navigate,
        t,
        3,
        startMeetingRequest,
        setEditorRole,
        // setAdvanceMeetingModalID,
        setDataroomMapFolderId,
        setViewAdvanceMeetingModal,
        setAdvanceMeetingModalID,
        setViewAdvanceMeetingModal,
        dashboardEventData.isPrimaryOrganizer
      )
    );

    setEditorRole({
      status: 10,
      role: "Organizer",
      isPrimaryOrganizer: dashboardEventData.isPrimaryOrganizer,
    });
    setVideoTalk({
      isChat: dashboardEventData.isChat,
      isVideoCall: dashboardEventData.isVideoCall,
      talkGroupID: dashboardEventData.talkGroupID,
    });
    localStorage.setItem("videoCallURL", dashboardEventData.videoCallURL);
    localStorage.setItem("currentMeetingID", dashboardEventData.pK_MDID);
    localStorage.setItem(
      "isMinutePublished",
      dashboardEventData.isMinutePublished
    );
    localStorage.setItem("meetingTitle", dashboardEventData.title);
    setAdvanceMeetingModalID(Number(dashboardEventData.pK_MDID));
    dispatch(viewMeetingFlag(true));
    // setViewAdvanceMeetingModal(true);
    // dispatch(viewAdvanceMeetingPublishPageFlag(true));
    dispatch(scheduleMeetingPageFlag(false));
  };

  useEffect(() => {
    if (
      CalendarDashboardEventData !== null &&
      CalendarDashboardEventData !== undefined
    ) {
      console.log("specific");
      try {
        let dashboardEventData = CalendarDashboardEventData;

        let startMeetingRequest = {
          VideoCallURL: dashboardEventData.videoCallURL,
          MeetingID: Number(dashboardEventData.pK_MDID),
          StatusID: 10,
        };
        if (
          (dashboardEventData.statusID === "10" ||
            dashboardEventData.statusID === 10) &&
          dashboardEventData.participantRoleID === 2
        ) {
          console.log("startMeetingRequest", dashboardEventData);
          handleViewMeeting(
            dashboardEventData.videoCallURL,
            dashboardEventData.pK_MDID,
            dashboardEventData.isQuickMeeting,
            dashboardEventData.statusID
          );

          setEditorRole({
            status: dashboardEventData.statusID,
            role: "Participant",
            isPrimaryOrganizer: false,
          });
          setVideoTalk({
            isChat: dashboardEventData.isChat,
            isVideoCall: dashboardEventData.isVideoCall,
            talkGroupID: dashboardEventData.talkGroupID,
          });
          localStorage.setItem("videoCallURL", dashboardEventData.videoCallURL);
          dispatch(viewMeetingFlag(true));
        } else if (
          (dashboardEventData.statusID === "10" ||
            dashboardEventData.statusID === 10) &&
          dashboardEventData.participantRoleID === 4
        ) {
          console.log("startMeetingRequest", dashboardEventData);
          handleViewMeeting(
            dashboardEventData.videoCallURL,
            dashboardEventData.pK_MDID,
            dashboardEventData.isQuickMeeting,
            dashboardEventData.statusID
          );
          setVideoTalk({
            isChat: dashboardEventData.isChat,
            isVideoCall: dashboardEventData.isVideoCall,
            talkGroupID: dashboardEventData.talkGroupID,
          });
          localStorage.setItem("videoCallURL", dashboardEventData.videoCallURL);
          setEditorRole({
            status: dashboardEventData.statusID,
            role: "Agenda Contributor",
            isPrimaryOrganizer: false,
          });
          dispatch(viewMeetingFlag(true));
        } else if (
          (dashboardEventData.statusID === "10" ||
            dashboardEventData.statusID === 10) &&
          dashboardEventData.participantRoleID === 1
        ) {
          console.log("startMeetingRequest", dashboardEventData);
          setEditorRole({
            status: dashboardEventData.statusID,
            role: "Organizer",
            isPrimaryOrganizer: dashboardEventData.isPrimaryOrganizer,
          });
          setVideoTalk({
            isChat: dashboardEventData.isChat,
            isVideoCall: dashboardEventData.isVideoCall,
            talkGroupID: dashboardEventData.talkGroupID,
          });
          localStorage.setItem("videoCallURL", dashboardEventData.videoCallURL);
          dispatch(viewMeetingFlag(true));
          handleViewMeeting(
            dashboardEventData.videoCallURL,
            dashboardEventData.pK_MDID,
            dashboardEventData.isQuickMeeting,
            dashboardEventData.statusID
          );
        } else if (
          dashboardEventData.statusID === "1" ||
          dashboardEventData.statusID === 1
        ) {
          if (dashboardEventData.IsViewOpenOnly) {
            console.log("specific");
            if (dashboardEventData.isQuickMeeting === true) {
              let Data = { MeetingID: Number(dashboardEventData.pK_MDID) };
              dispatch(
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
            } else {
              console.log("specific");
              setAdvanceMeetingModalID(Number(dashboardEventData.pK_MDID));
              setViewAdvanceMeetingModal(true);
            }
            return;
          } else {
            console.log("startMeetingRequest", dashboardEventData);
            if (dashboardEventData.isQuickMeeting === true) {
              console.log("startMeetingRequest", dashboardEventData);
              console.log("end meeting chaek");
              dispatch(
                UpdateOrganizersMeeting(
                  true,
                  navigate,
                  t,
                  4,
                  startMeetingRequest,
                  setEditorRole,
                  setAdvanceMeetingModalID,
                  setDataroomMapFolderId,
                  setSceduleMeeting,
                  setViewFlag,
                  setEditFlag
                )
              );
            } else if (dashboardEventData.isQuickMeeting === false) {
              console.log("end meeting chaek", dashboardEventData);
              // ================== //
              // dispatch(
              //   UpdateOrganizersMeeting(
              //     false,
              //     navigate,
              //     t,
              //     3,
              //     startMeetingRequest,
              //     setEditorRole,
              //     setAdvanceMeetingModalID,
              //     setDataroomMapFolderId,
              //     setViewAdvanceMeetingModal
              //   )
              // );
              // localStorage.setItem(
              //   "currentMeetingID",
              //   dashboardEventData.pK_MDID
              // );
              // setAdvanceMeetingModalID(dashboardEventData.pK_MDID);
              // dispatch(viewMeetingFlag(true));
              // setViewAdvanceMeetingModal(true);
              // dispatch(viewAdvanceMeetingPublishPageFlag(true));
              // dispatch(scheduleMeetingPageFlag(false));
              // setEditorRole({
              //   status: 10,
              //   role: "Organizer",
              //   isPrimaryOrganizer: false,
              // });
              // ================== //
              console.log("startMeetingRequest", dashboardEventData);

              callStartMeetingFromEvents(dashboardEventData);
            }
          }
        }
        dispatch(dashboardCalendarEvent(null));
      } catch (error) {
        console.log("dashboardCalendarEvent", error);
        dispatch(dashboardCalendarEvent(null));
      }
    }
  }, [CalendarDashboardEventData]);

  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        setTotalRecords(searchMeetings.totalRecords);
        setMinutesAgo(searchMeetings.meetingStartedMinuteAgo);
        if (Object.keys(searchMeetings.meetings).length > 0) {
          // Create a deep copy of the meetings array
          let copyMeetingData = searchMeetings.meetings.map((meeting) => ({
            ...meeting,
            meetingAgenda: meeting.meetingAgenda.filter(
              (agenda) => agenda.objMeetingAgenda.canView
            ),
          }));
          copyMeetingData.forEach((data) => {
            data.meetingAgenda = data.meetingAgenda.filter((agenda) => {
              return agenda.objMeetingAgenda.canView === true;
            });
          });
          console.log("handleViewMeeting", copyMeetingData);
          setRow(copyMeetingData);
          setDublicatedrows(copyMeetingData);
        }
      } else {
        setRow([]);
        setDublicatedrows([]);
      }
    } catch {}
  }, [searchMeetings]);

  useEffect(() => {
    try {
      if (calendarMainMeeting !== undefined && rows.length > 0) {
        let currentMeetingIDCalendar = localStorage.getItem("currentMeetingID");
        let findMeeting = rows.find(
          (meetingData, index) =>
            Number(currentMeetingIDCalendar) === Number(meetingData.pK_MDID)
        );
        console.log(findMeeting, "findMeetingfindMeeting");
      }
    } catch (error) {
      console.log(error, "findMeetingfindMeeting");
    }
  }, [calendarMainMeeting]);

  useEffect(() => {
    if (mqttMeetingPrAdded !== null) {
      let meetingData = mqttMeetingPrAdded;
      let newData = {
        dateOfMeeting: meetingData?.dateOfMeeting,
        host: meetingData?.host,
        isAttachment: false,
        isChat: false,
        isVideoCall: false,
        videoCallURL: meetingData?.videoCallURL,
        isQuickMeeting: meetingData?.isQuickMeeting,
        meetingAgenda: [],
        isOrganizer: meetingData?.attendeeRoleID === 1 ? true : false,
        isAgendaContributor: meetingData?.attendeeRoleID === 4 ? true : false,
        isParticipant: meetingData?.attendeeRoleID === 2 ? true : false,
        talkGroupID: 0,
        meetingType: meetingData?.meetingTypeID,
        meetingEndTime: meetingData?.meetingEndTime,
        meetingStartTime: meetingData?.meetingStartTime,
        pK_MDID: meetingData?.meetingID,
        meetingPoll: {
          totalNoOfDirectors: 0,
          totalNoOfDirectorsVoted: 0,
        },
        responseDeadLine: "",
        status: String(meetingData?.status),
        title: meetingData?.title,
        key: 0,
        isPrimaryOrganizer: meetingData?.isPrimaryOrganizer,
        userDetails: null,
      };
      setRow([newData, ...rows]);
      dispatch(meetingParticipantAdded(null));
    }
    if (mqtMeetingPrRemoved !== null) {
      try {
        let meetingID = mqtMeetingPrRemoved.meetingID;
        setRow((isRowData) => {
          return isRowData.filter((newData, index) => {
            return Number(newData.pK_MDID) !== Number(meetingID);
          });
        });
        dispatch(meetingParticipantRemoved(null));
      } catch (error) {
        console.log(error);
      }
    }
  }, [mqttMeetingPrAdded, mqtMeetingPrRemoved]);

  useEffect(() => {
    if (mqttMeetingAcRemoved !== null && mqttMeetingAcRemoved !== undefined) {
      let meetingData = mqttMeetingAcRemoved;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID
        );

        setRow(updatedRows);
      } catch {}
    }
  }, [mqttMeetingAcRemoved]);

  useEffect(() => {
    try {
      if (
        getALlMeetingTypes?.meetingTypes !== null &&
        getALlMeetingTypes?.meetingTypes !== undefined
      ) {
        let meetingtypeFilter = [];
        let byDefault = {
          value: "0",
          text: "Quick-meeting",
        };
        meetingtypeFilter.push(byDefault);
        getALlMeetingTypes?.meetingTypes.forEach((data, index) => {
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
  }, [getALlMeetingTypes?.meetingTypes]);

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
    console.log("chek search meeting");
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
  };

  useEffect(() => {
    if (
      meetingStatusPublishedMqttData !== null &&
      meetingStatusPublishedMqttData !== undefined
    ) {
      const callMQTT = async () => {
        let meetingData = meetingStatusPublishedMqttData;
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
  }, [meetingStatusPublishedMqttData]);

  useEffect(() => {
    if (MeetingStatusSocket !== null && MeetingStatusSocket !== undefined) {
      if (
        MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_STARTED".toLowerCase())
      ) {
        console.log("meetingDetails", MeetingStatusSocket);
        let statusCheck = 0;
        let meetingIDCheck = 0;

        if (MeetingStatusSocket.hasOwnProperty("meeting")) {
          statusCheck = MeetingStatusSocket.meeting.status;
          meetingIDCheck = MeetingStatusSocket.meeting.pK_MDID;
          // If the 'meeting' key exists, do something
          console.log("Meeting key exists:", MeetingStatusSocket);
          // Your code for handling when 'meeting' key is present
        } else {
          // If the 'meeting' key does not exist, do something else
          statusCheck = MeetingStatusSocket.meetingStatusID;
          meetingIDCheck = MeetingStatusSocket.meetingID;
          console.log("Meeting key does not exist. Handling alternative case.");
          // Your
        }
        let meetingStatusID = statusCheck;
        let meetingID = meetingIDCheck;
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
          setStartMeetingButton((prevStateStartBtn) => {
            return prevStateStartBtn.filter(
              (newBtn, index) => Number(newBtn.meetingID) !== Number(meetingID)
            );
          });
        } catch (error) {
          console.log(
            error,
            "meetingIDmeetingIDmeetingIDmeetingIDmeetingIDmeetingID"
          );
        }
      } else if (
        MeetingStatusSocket.message
          .toLowerCase()
          .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
      ) {
        let meetingStatusID = MeetingStatusSocket?.meetingStatusID;
        let meetingID = MeetingStatusSocket?.meetingID;
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
          setStartMeetingButton((prevStateStartBtn) => {
            return prevStateStartBtn.filter(
              (newBtn, index) => Number(newBtn.meetingID) !== Number(meetingID)
            );
          });
        } catch {}
      }
    }
  }, [MeetingStatusSocket]);

  useEffect(() => {
    try {
      if (MeetingStatusEnded !== null && MeetingStatusEnded !== undefined) {
        let endMeetingData = MeetingStatusEnded.meeting;
        const indexToUpdate = rows.findIndex(
          (obj) => obj.pK_MDID === endMeetingData.pK_MDID
        );
        // let roomId;
        // if (
        //   CurrentMeetingURL !== "" &&
        //   CurrentMeetingURL !== null &&
        //   CurrentMeetingURL !== undefined
        // ) {
        //   let url = CurrentMeetingURL;
        //   let urlObject = new URL(url);
        //   let searchParams = new URLSearchParams(urlObject.search);
        //   roomId = Number(searchParams.get("RoomID"));
        // } else {
        //   roomId = 0;
        // }
        // let acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));

        if (indexToUpdate !== -1) {
          let updatedRows = [...rows];
          updatedRows[indexToUpdate] = endMeetingData;
          setRow(updatedRows);
          if (
            advanceMeetingModalID === endMeetingData.pK_MDID &&
            endMeetingData.status === "9"
          ) {
            setEditorRole({
              status: null,
              role: null,
              isPrimaryOrganizer: false,
            });
            setStartMeetingButton((prevStateStartBtn) => {
              return prevStateStartBtn.filter(
                (newBtn, index) =>
                  Number(newBtn.meetingID) !== Number(endMeetingData.pK_MDID)
              );
            });
            setViewAdvanceMeetingModal(false);
            dispatch(viewAdvanceMeetingPublishPageFlag(false));
            dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
            setCurrentMeetingID(0);
            setAdvanceMeetingModalID(null);
            setDataroomMapFolderId(0);
          }
          dispatch(mqttCurrentMeetingEnded(null));
        }
      }
    } catch (eror) {
      console.log(eror);
    }
  }, [MeetingStatusEnded, CurrentMeetingURL]);

  useEffect(() => {
    if (allMeetingsSocketData !== null && allMeetingsSocketData !== undefined) {
      try {
        const updateMeeting = async () => {
          let meetingID = allMeetingsSocketData.pK_MDID;
          let meetingData = allMeetingsSocketData;
          let newMeetingData = await mqttMeetingData(meetingData, 1);
          let checkifAlreadyExist = rows.find(
            (meetingRowsData, index) =>
              Number(meetingRowsData.pK_MDID) === Number(meetingID)
          );
          if (checkifAlreadyExist !== undefined) {
            setRow((rowsData) => {
              return rowsData.map((item) => {
                if (item.pK_MDID === meetingID) {
                  return newMeetingData;
                } else {
                  return item; // Return the original item if the condition is not met
                }
              });
            });
          } else {
            setRow([newMeetingData, ...rows]);
          }
        };
        updateMeeting();
      } catch (error) {
        console.log(error, "error");
      }
    }
  }, [allMeetingsSocketData]);

  useEffect(() => {
    if (CommitteeMeetingMQTT !== null && CommitteeMeetingMQTT !== undefined) {
      let meetingID = CommitteeMeetingMQTT.meeting.pK_MDID;
      let meetingData = CommitteeMeetingMQTT.meeting;
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
  }, [CommitteeMeetingMQTT]);

  useEffect(() => {
    try {
      if (GroupMeetingMQTT !== null && GroupMeetingMQTT !== undefined) {
        let meetingID = GroupMeetingMQTT.meeting.pK_MDID;
        let meetingData = GroupMeetingMQTT.meeting;
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
    } catch (error) {
      console.log(error);
    }
  }, [GroupMeetingMQTT]);

  useEffect(() => {
    try {
      if (
        ResponseMessages !== "" &&
        ResponseMessages !== undefined &&
        ResponseMessages !== "" &&
        ResponseMessages !== t("No-records-found") &&
        ResponseMessages !== t("No-record-found")
      ) {
        showMessage(ResponseMessages, "success", setOpen);
        dispatch(clearResponseMessage(""));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }, [ResponseMessages]);

  useEffect(() => {
    try {
      if (
        ResponseMessage !== "" &&
        ResponseMessage !== t("No-record-found") &&
        ResponseMessage !== t("No-records-found") &&
        ResponseMessage !== "" &&
        ResponseMessage !== t("List-updated-successfully") &&
        ResponseMessage !== t("No-data-available") &&
        ResponseMessage !== t("Successful") &&
        ResponseMessage !== t("Record-updated") &&
        ResponseMessage !== t("Something-went-wrong") &&
        ResponseMessage !== undefined
      ) {
        showMessage(ResponseMessages, "success", setOpen);
        dispatch(clearResponseNewMeetingReducerMessage(""));
      }
    } catch (error) {
      console.log(error);
    }
  }, [ResponseMessage]);

  useEffect(() => {
    try {
      if (dashboardEventData !== null && dashboardEventData !== undefined) {
        console.log(dashboardEventData, "dashboardEventDatadashboardEventData");
        let startMeetingRequest = {
          VideoCallURL: dashboardEventData.videoCallURL,
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
                dashboardEventData.videoCallURL,
                meeting.pK_MDID,
                meeting.isQuickMeeting,
                meeting.status
              );

              setEditorRole({
                status: meeting.status,
                role: "Participant",
                isPrimaryOrganizer: false,
              });
              setVideoTalk({
                isChat: meeting.isChat,
                isVideoCall: meeting.isVideoCall,
                talkGroupID: meeting.talkGroupID,
              });
              localStorage.setItem("videoCallURL", meeting.videoCallURL);
              // dispatch(viewMeetingFlag(true));
            } else if (
              (meeting.status === "10" || meeting.status === 10) &&
              dashboardEventData.participantRoleID === 4
            ) {
              handleViewMeeting(
                dashboardEventData.videoCallURL,
                meeting.pK_MDID,
                meeting.isQuickMeeting,
                meeting.status
              );
              setVideoTalk({
                isChat: meeting.isChat,
                isVideoCall: meeting.isVideoCall,
                talkGroupID: meeting.talkGroupID,
              });
              localStorage.setItem("videoCallURL", meeting.videoCallURL);
              setEditorRole({
                status: meeting.status,
                role: "Agenda Contributor",
                isPrimaryOrganizer: false,
              });
              // dispatch(viewMeetingFlag(true));
            } else if (
              (meeting.status === "10" || meeting.status === 10) &&
              dashboardEventData.participantRoleID === 1
            ) {
              setEditorRole({
                status: meeting.status,
                role: "Organizer",
                isPrimaryOrganizer: false,
              });
              setVideoTalk({
                isChat: meeting.isChat,
                isVideoCall: meeting.isVideoCall,
                talkGroupID: meeting.talkGroupID,
              });
              localStorage.setItem("videoCallURL", meeting.videoCallURL);
              // dispatch(viewMeetingFlag(true));
              handleViewMeeting(
                dashboardEventData.videoCallURL,
                meeting.pK_MDID,
                meeting.isQuickMeeting,
                meeting.status
              );

              // setIsOrganisers(isOrganiser);
            } else if (meeting.status === "1" || meeting.status === 1) {
              if (meeting.isQuickMeeting === true) {
                console.log("end meeting chaek");
                dispatch(
                  UpdateOrganizersMeeting(
                    true,
                    navigate,
                    t,
                    4,
                    startMeetingRequest,
                    setEditorRole,
                    setAdvanceMeetingModalID,
                    setDataroomMapFolderId,
                    setSceduleMeeting,
                    setViewFlag,
                    setEditFlag
                  )
                );
                console.log("end meeting chaek");
              } else if (meeting.isQuickMeeting === false) {
                console.log("end meeting chaek");
                dispatch(
                  UpdateOrganizersMeeting(
                    false,
                    navigate,
                    t,
                    3,
                    startMeetingRequest,
                    setEditorRole,
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
                // dispatch(viewMeetingFlag(true));
                // setViewAdvanceMeetingModal(true);
                // dispatch(viewAdvanceMeetingPublishPageFlag(true));
                dispatch(scheduleMeetingPageFlag(false));
                setEditorRole({
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
    } catch (error) {
      console.log(error);
    }
  }, [dashboardEventData]);

  useEffect(() => {
    try {
      if (
        meetingStatusNotConductedMqttData !== null &&
        meetingStatusNotConductedMqttData !== undefined &&
        meetingStatusNotConductedMqttData.length !== 0
      ) {
        let meetingDetailsMqtt =
          meetingStatusNotConductedMqttData.meetingDetails;

        setRow((rowsData) => {
          // Find the index of the row that matches the condition
          const rowIndex = rowsData.findIndex(
            (rowData) => rowData.pK_MDID === meetingDetailsMqtt.pK_MDID
          );

          // If a matching row is found, create a new array with the updated row
          if (rowIndex !== -1) {
            const updatedRowsData = [...rowsData];

            updatedRowsData[rowIndex] = {
              ...updatedRowsData[rowIndex],
              status: String(meetingDetailsMqtt.statusID),
            };
            return updatedRowsData;
          }
          setStartMeetingButton((prevStateStartBtn) => {
            return prevStateStartBtn.filter(
              (newBtn, index) =>
                Number(newBtn.meetingID) !== Number(meetingDetailsMqtt.pK_MDID)
            );
          });
          // Return the original rowsData if no matching row is found
          return rowsData;
        });
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(meetingNotConductedMQTT(null));
  }, [meetingStatusNotConductedMqttData]);

  useEffect(() => {
    if (meetingReminderNotification !== null) {
      try {
        const meetingData = meetingReminderNotification.meetingDetails;
        console.log(meetingData, "meetingDetailsmeetingDetails");
        setRow((rowsData) => {
          // Find the index of the row that matches the condition
          const rowIndex = rowsData.findIndex(
            (rowData) => rowData.pK_MDID === meetingData.pK_MDID
          );
          console.log(rowIndex, "rowIndexrowIndex");
          // If a matching row is found, create a new array with the updated row
          if (rowIndex !== -1) {
            const updatedRowsData = [...rowsData];

            updatedRowsData[rowIndex] = {
              ...updatedRowsData[rowIndex],
              status: String(meetingData.statusID),
            };
            if (meetingData.statusID === 1) {
              setStartMeetingButton([
                ...startMeetingButton,
                { meetingID: Number(meetingData.pK_MDID), showButton: true },
              ]);
              setStartMeetingData({
                ...startMeetingData,
                meetingID: Number(meetingData.pK_MDID),
                showButton: true,
              });
            } else {
              setStartMeetingData({
                ...startMeetingData,
                meetingID: null,
                showButton: false,
              });
            }

            return updatedRowsData;
          }

          // Return the original rowsData if no matching row is found
          return rowsData;
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [meetingReminderNotification]);

  useEffect(() => {
    try {
      if (globalFunctionWebnotificationFlag) {
        if (webNotifactionDataRoutecheckFlag) {
          console.log("webNotifactionDataRoutecheckFlag");
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let currentURL = window.location.href;
          WebNotificationExportRoutFunc(
            currentURL,
            dispatch,
            t,
            location,
            navigate,
            webNotificationData,
            setViewFlag,
            setEditorRole,
            setViewAdvanceMeetingModal,
            setViewProposeDatePoll,
            setViewGroupPage,
            setShowModal,
            setVideoTalk,
            setAdvanceMeetingModalID,
            setResultresolution,
            isMeeting,
            setPolls
          );
          dispatch(webnotificationGlobalFlag(false));
        }
      }
      console.log("webNotifactionDataRoutecheckFlag");
    } catch (error) {}

    return () => {};
  }, [globalFunctionWebnotificationFlag]);

  return (
    <>
      <section className={styles["NewMeeting_container"]}>
        {endForAllMeeting && <NewEndLeaveMeeting />}
        {endMeetingModal && <NewEndMeetingModal />}
        {quickMeeting && (
          <CreateQuickMeeting
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
          <UpdateQuickMeeting
            editFlag={editFlag}
            setEditFlag={setEditFlag}
            // this is check from where its called 4 is from Meeting
            checkFlag={4}
          />
        ) : null}
        <Notification open={open} setOpen={setOpen} />
        {sceduleMeeting && scheduleMeetingsPageFlag === true ? (
          <SceduleMeeting
            setSceduleMeeting={setSceduleMeeting}
            setCurrentMeetingID={setCurrentMeetingID}
            currentMeeting={currentMeetingID}
            setEditMeeting={setEditMeeting}
            isEditMeeting={isEditMeeting}
            setDataroomMapFolderId={setDataroomMapFolderId}
            dataroomMapFolderId={dataroomMapFolderId}
          />
        ) : viewProposeDatePoll && viewProposeDatesMeetingPageFlag === true ? (
          <ViewParticipantsDates
            setViewProposeDatePoll={setViewProposeDatePoll}
            responseByDate={responseByDate}
            setCurrentMeetingID={setCurrentMeetingID}
            setSceduleMeeting={setViewProposeDatePoll}
            setDataroomMapFolderId={setDataroomMapFolderId}
          />
        ) : viewAdvanceMeetingModal ? (
          <ViewMeetingModal
            advanceMeetingModalID={advanceMeetingModalID}
            setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
            setAdvanceMeetingModalID={setAdvanceMeetingModalID}
            unPublish={false}
            dataroomMapFolderId={dataroomMapFolderId}
            setDataroomMapFolderId={setDataroomMapFolderId}
            setCurrentMeetingID={setCurrentMeetingID}
            setVideoTalk={setVideoTalk}
            videoTalk={videoTalk}
          />
        ) : viewAdvanceMeetingsUnpublishPageFlag === true ? (
          <ViewMeetingModal
            advanceMeetingModalID={advanceMeetingModalID}
            setViewAdvanceMeetingModal={setViewAdvanceMeetingModalUnpublish}
            setAdvanceMeetingModalID={setAdvanceMeetingModalID}
            unPublish={true}
            editorRole={editorRole}
            dataroomMapFolderId={dataroomMapFolderId}
            setDataroomMapFolderId={setDataroomMapFolderId}
            setVideoTalk={setVideoTalk}
            videoTalk={videoTalk}
          />
        ) : viewProposeOrganizerPoll &&
          viewProposeOrganizersMeetingPageFlag === true ? (
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
            setEditorRole={setEditorRole}
            setEditMeeting={setEditMeeting}
            isEditMeeting={isEditMeeting}
            setDataroomMapFolderId={setDataroomMapFolderId}
            dataroomMapFolderId={dataroomMapFolderId}
            setIsProposedMeetEdit={setIsProposedMeetEdit}
            isProposedMeetEdit={isProposedMeetEdit}
          />
        ) : ProposedMeetViewFlag ? (
          <>
            <ViewProposedMeetingModal />
          </>
        ) : (
          <>
            <Row className='mt-2'>
              <Col sm={12} md={12} lg={6} className='d-flex '>
                <span className={styles["NewMeetinHeading"]}>
                  {t("Meetings")}
                </span>
                <span>
                  <ReactBootstrapDropdown
                    className='SceduleMeetingButton d-inline-block position-relative ms-2'
                    // onClick={eventClickHandler}
                  >
                    <ReactBootstrapDropdown.Toggle
                      title={t("Schedule-a-meeting")}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["schedule_button"]}>
                          <Plus width={20} height={20} fontWeight={800} />
                          <span> {t("Schedule-a-meeting")}</span>
                        </Col>
                      </Row>
                    </ReactBootstrapDropdown.Toggle>

                    <ReactBootstrapDropdown.Menu>
                      {checkFeatureIDAvailability(1) ? (
                        <ReactBootstrapDropdown.Item
                          className={styles["dropdown-item"]}
                          onClick={CreateQuickMeetingFunc}>
                          {t("Quick-meeting")}
                        </ReactBootstrapDropdown.Item>
                      ) : null}

                      {checkFeatureIDAvailability(9) ? (
                        <ReactBootstrapDropdown.Item
                          className={styles["dropdown-item"]}
                          onClick={openSceduleMeetingPage}>
                          {t("Advance-meeting")}
                        </ReactBootstrapDropdown.Item>
                      ) : null}

                      {checkFeatureIDAvailability(12) ? (
                        <>
                          <ReactBootstrapDropdown.Item
                            className={styles["dropdown-item"]}
                            onClick={openProposedNewMeetingPage}>
                            {t("Propose-new-meeting")}
                          </ReactBootstrapDropdown.Item>
                        </>
                      ) : null}
                    </ReactBootstrapDropdown.Menu>
                  </ReactBootstrapDropdown>
                </span>
              </Col>
              <Col sm={12} md={12} lg={6} className=''>
                <span className='position-relative'>
                  <TextField
                    width={"100%"}
                    placeholder={t("Search-on-meeting-title")}
                    applyClass={"meetingSearch"}
                    name={"SearchVal"}
                    labelclass='d-none'
                    value={searchText}
                    change={handleSearchChange}
                    onKeyDown={handleKeyPress}
                    inputicon={
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className='d-flex gap-2 align-items-center'>
                          {entereventIcon === true ? (
                            <img
                              src={BlackCrossIcon}
                              className='cursor-pointer'
                              onClick={handleClearSearch}
                              alt=''
                              draggable='false'
                            />
                          ) : null}
                          <Tooltip
                            placement='bottomLeft'
                            title={t("Search-filters")}>
                            <img
                              src={searchicon}
                              className={styles["Search_Bar_icon_class"]}
                              onClick={HandleShowSearch} // Add click functionality here
                              alt=''
                              draggable='false'
                            />
                          </Tooltip>
                        </Col>
                      </Row>
                    }
                    iconclassname={styles["polling_searchinput"]}
                  />
                  {searchMeeting ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Search-Box_meeting"]}>
                          <Row className='mt-2'>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='d-flex justify-content-end'>
                              <img
                                src={BlackCrossIcon}
                                className={styles["Cross_Icon_Styling"]}
                                width='16px'
                                height='16px'
                                onClick={HandleCloseSearchModalMeeting}
                                alt=''
                                draggable='false'
                              />
                            </Col>
                          </Row>
                          <Row className='mt-4'>
                            <Col lg={12} md={12} sm={12}>
                              <TextField
                                placeholder={t("Meeting-title")}
                                applyClass={"meetinInnerSearch"}
                                labelclass='d-none'
                                name='MeetingTitle'
                                value={searchFields.MeetingTitle}
                                change={searchMeetingChangeHandler}
                              />
                            </Col>
                          </Row>
                          <Row className='mt-3'>
                            <Col lg={6} md={6} sm={12}>
                              <DatePicker
                                value={searchFields.DateView}
                                format={"DD/MM/YYYY"}
                                placeholder='DD/MM/YYYY'
                                render={
                                  <InputIcon
                                    placeholder='DD/MM/YYYY'
                                    className='datepicker_input'
                                  />
                                }
                                editable={false}
                                className='datePickerTodoCreate2'
                                onOpenPickNewDate={false}
                                calendar={calendarValue} // Arabic calendar
                                locale={localValue} // Arabic locale
                                ref={calendRef}
                                onFocusedDateChange={meetingDateChangeHandler}
                              />
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                              <TextField
                                placeholder={t("Organizer-name")}
                                labelclass='d-none'
                                name='OrganizerName'
                                applyClass={"meetinInnerSearch"}
                                value={searchFields.OrganizerName}
                                change={searchMeetingChangeHandler}
                              />
                            </Col>
                          </Row>
                          <Row className='mt-4'>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='d-flex justify-content-end gap-2'>
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
            <Row className='mt-2'>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["PaperStylesMeetingTwoPage"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                      <Button
                        text={t("Published-meetings")}
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
                      setEditorRole={setEditorRole}
                      setEditMeeting={setEditMeeting}
                      setCurrentMeetingID={setCurrentMeetingID}
                      currentMeeting={currentMeetingID}
                      editorRole={editorRole}
                      setDataroomMapFolderId={setDataroomMapFolderId}
                      videoTalk={videoTalk}
                      setVideoTalk={setVideoTalk}
                      setProposedNewMeeting={setProposedNewMeeting}
                      setIsProposedMeetEdit={setIsProposedMeetEdit}
                    />
                  ) : Number(currentView) === 1 ? (
                    <Row className='mt-2'>
                      <Col lg={12} md={12} sm={12}>
                        <>
                          <Table
                            column={MeetingColoumns}
                            scroll={{ y: "54vh", x: false }}
                            pagination={false}
                            className='newMeetingTable'
                            rows={rows}
                            locale={{
                              emptyText: <EmptyTableComponent />, // Set your custom empty text here
                            }}
                          />
                        </>
                      </Col>
                    </Row>
                  ) : null}
                  {rows.length > 0 ? (
                    <>
                      <Row className='mt-5'>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className='d-flex justify-content-center '>
                          <Row className={styles["PaginationStyle-Committee"]}>
                            <Col
                              className={"pagination-groups-table"}
                              sm={12}
                              md={12}
                              lg={12}>
                              <CustomPagination
                                current={
                                  meetingPageCurrent !== null
                                    ? Number(meetingPageCurrent)
                                    : 1
                                }
                                pageSize={
                                  meetingpageRow !== null
                                    ? Number(meetingpageRow)
                                    : 50
                                }
                                onChange={handelChangePagination}
                                total={totalRecords}
                                showSizer={true}
                                pageSizeOptionsValues={[
                                  "30",
                                  "50",
                                  "100",
                                  "200",
                                ]}
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
          </>
        )}
      </section>

      {boardDeckModalData && (
        <BoardDeckModal
          boardDeckMeetingID={boardDeckMeetingID}
          boarddeckOptions={boarddeckOptions}
          setBoarddeckOptions={setBoarddeckOptions}
          editorRole={editorRole}
        />
      )}
      {boarddeckShareModal && (
        <ShareModalBoarddeck
          radioValue={radioValue}
          setRadioValue={setRadioValue}
          boarddeckOptions={boarddeckOptions}
        />
      )}
      {boardDeckEmailModal && (
        <BoardDeckSendEmail
          boardDeckMeetingTitle={boardDeckMeetingTitle}
          boardDeckMeetingID={boardDeckMeetingID}
          boarddeckOptions={boarddeckOptions}
          radioValue={radioValue}
          setBoarddeckOptions={setBoarddeckOptions}
        />
      )}
      <DownloadOptionsModal
        isDownloadAvailable={isDownloadAvailable}
        downloadMeetingRecord={downloadMeetingRecord}
      />
      {shareViaDataRoomPathConfirmModal && (
        <ShareViaDataRoomPathModal
          boardDeckMeetingTitle={boardDeckMeetingTitle}
        />
      )}
      {deleteMeetingConfirmationModal && <DeleteMeetingConfirmationModal />}
    </>
  );
};

export default NewMeeting;
