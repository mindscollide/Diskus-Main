import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

// Context hooks
import { useMeetingContext } from "../../../context/MeetingContext";
import { useNewMeetingContext } from "../../../context/NewMeetingContext";

// Components
import { Table } from "../../../components/elements";
import CustomButton from "../../../components/elements/button/Button";
import EmptyTableComponent from "@/container/meeting/commonComponents/EmptyTableComponent/EmptyTableComponent";

// Status helper
import { StatusValue } from "@/container/meeting/commonComponents/statusJson";

// Date formatters
import {
  utcConvertintoGMT,
  getCurrentDateTimeUTC,
  forRecentActivity,
  resolutionResultTable,
} from "../../../commen/functions/date_formater";

// Redux actions
import {
  GetAllMeetingDetailsApiFunc,
  scheduleMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
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
  JoinCurrentMeeting,
  emailRouteID,
  boardDeckModal,
  getMeetingRecordingFilesApi,
  searchNewUserMeeting,
} from "../../../store/actions/NewMeetingActions";
import { UpdateOrganizersMeeting } from "../../../store/actions/MeetingOrganizers_action";
import { ViewMeeting } from "../../../store/actions/Get_List_Of_Assignees";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import { DownloadMeetingRecording } from "../../../store/actions/VideoChat_actions";

// Talk actions
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

// Icons
import EditIcon from "../../../assets/images/Edit-Icon.png";
import ChatIcon from "../../../assets/images/New Meeting Listing Icons/Talk.png";
import AgendaIcon from "../../../assets/images/New Meeting Listing Icons/ViewAgenda.png";
import ClipboardIcon from "../../../assets/images/New Meeting Listing Icons/Attendance.png";
import DownloadVideoIcon from "../../../assets/images/New Meeting Listing Icons/VideoRecording.png";
import ChevronDownIcon from "../../../assets/images/dropdown-icon.png";
import SortIconAscend from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import SortIconDescend from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";
import DoubleArrowIcon from "../../../assets/images/sortingIcons/Double Arrow2.svg";

// Styles (reuse MeetingTwo styles for consistency)
import styles from "./publishMeeting.module.css";

import { showMessage } from "@/components/elements/snack_bar/utill";
import { ChevronDown } from "react-bootstrap-icons";
import CustomPagination from "@/commen/functions/customPagination/Paginations";
import BoardDeckModal from "@/container/meeting/commonComponents/BoardDeck/BoardDeckModal/BoardDeckModal";
import BoardDeckSendEmail from "@/container/meeting/commonComponents/BoardDeck/BoardDeckSendEmail/BoardDeckSendEmail";
import ShareModalBoarddeck from "@/container/meeting/commonComponents//BoardDeck/ShareModalBoardDeck/ShareModalBoarddeck";
import DownloadOptionsModal from "@/container/meeting/commonComponents/DownloadMeetingTranscribeAndRecording/DownloadOptionsModal/DownloadOptionsModal";
import ShareViaDataRoomPathModal from "@/container/meeting/commonComponents/BoardDeck/ShareViaDataRoomPathModal/ShareViaDataRoomPathModal";
import MeetingRecording from "@/container/meeting/commonComponents/MeetingRecording/MeetingRecording";

const PublishedMeetingList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const boardDeckModalData = useSelector(
    (state) => state.NewMeetingreducer.boardDeckModalData,
  );

  const boardDeckEmailModal = useSelector(
    (state) => state.NewMeetingreducer.boardDeckEmailModal,
  );
  const boarddeckShareModal = useSelector(
    (state) => state.NewMeetingreducer.boarddeckShareModal,
  );
  const shareViaDataRoomPathConfirmModal = useSelector(
    (state) => state.NewMeetingreducer.shareViaDataRoomPathConfirmation,
  );

  // ─── Context ───
  const {
    editorRole,
    setEditorRole,
    setVideoTalk,
    videoTalk,
    setViewAdvanceMeetingModal,
    setAdvanceMeetingModalID,
    advanceMeetingModalID,
    setSceduleMeeting,
    setDataroomMapFolderId,
    dataroomMapFolderId,
    setEditMeeting,
    viewFlag,
    setViewFlag,
    editFlag,
    setEditFlag,
    setDownloadMeeting,
    setCurrentMeetingID,
    setDownloadVideoRecordingModal,
    boardDeckMeetingID,
    setBoardDeckMeetingID,
    boardDeckMeetingTitle,
    setBoardDeckMeetingTitle,
    downloadVideoRecordingModal,
  } = useMeetingContext();

  const {
    meetingsRecords,
    isMeetingTypeFilter,
    minutesAgo,
    startMeetingButton,
    publishedMeetingData,
    publishedMeetingDataRecord,
    setPublishedMeetingData,
    searchFilters,
    setIsCreateEditMeeting,
    isMeetingCreateOrEdit,
    setIsMeetingCreateOrEdit,
  } = useNewMeetingContext();

  // ─── Redux selectors ───
  const AllUserChats = useSelector((state) => state.talkStateData.AllUserChats);

  // ─── Local state ───
  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [organizerNameSort, setOrganizerNameSort] = useState(null);
  const [meetingTimeSort, setMeetingTimeSort] = useState(null);
  const [meetingDateSort, setMeetingDateSort] = useState(null);

  const selectedStatusValues = ["10", "1", "9", "8", "4"];

  const [duplicatedrows, setDuplicatedrows] = useState([]);

  const [visibleMeetingType, setVisibleMeetingType] = useState(false);

  const [talkGroupID, setTalkGroupID] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  // Status Filter State
  const [statusFilterVisible, setStatusFilterVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([
    "10",
    "1",
    "9",
    "4",
    "8",
  ]);
  //Filteration States Meeting Types
  const [selectedMeetingTypes, setSelectedMeetingTypes] = useState(
    isMeetingTypeFilter.map((filter) => filter.value),
  );
  // Meeting Type Filter State
  const [meetingTypeFilterVisible, setMeetingTypeFilterVisible] =
    useState(false);
  const [selectedMeetingTypeValues, setSelectedMeetingTypeValues] = useState([
    "1",
    "2",
    "3",
  ]);
  // For BoardDeck Send Email Modal
  const [radioValue, setRadioValue] = useState(1);
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

  //Combine filteration starts
  const applyCombinedFilters = (statusFilters, meetingTypeFilters) => {
    const filtered = duplicatedrows.filter((record) => {
      const matchesStatus = statusFilters.includes(record.status.toString());
      const matchesMeetingType = meetingTypeFilters.includes(
        record.meetingType.toString(),
      );
      return matchesStatus && matchesMeetingType;
    });
    setPublishedMeetingData(filtered);
  };
  // Menu click handler for selecting filters
  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)],
    );
  };

  const handleApplyFilter = () => {
    applyCombinedFilters(selectedValues, selectedMeetingTypes);
  };

  const resetFilter = () => {
    const defaultStatusValues = ["10", "1", "9", "4", "8"];
    setSelectedValues(defaultStatusValues);
    applyCombinedFilters(defaultStatusValues, selectedMeetingTypes);
  };
  const [isDownloadAvailable, setIsDownloadAvailable] = useState(false);
  const [downloadMeetingRecord, setDownloadMeetingRecord] = useState(null);

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let userID = localStorage.getItem("userID");

  // ─── LocalStorage ───
  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");

  // ─── Status filters for the Status column ───
  const statusFilters = [
    { value: "10", text: t("Active") },
    { value: "1", text: t("Upcoming") },
    { value: "9", text: t("Ended") },
    { value: "4", text: t("Cancelled") },
    { value: "8", text: t("Not-conducted") },
  ];

  // ─── Talk / Group Chat ───
  const groupChatInitiation = async (data) => {
    if (data.talkGroupID !== 0) {
      await dispatch(createShoutAllScreen(false));
      await dispatch(addNewChatScreen(false));
      await dispatch(footerActionStatus(false));
      await dispatch(createGroupScreen(false));
      await dispatch(recentChatFlag(true));
      await dispatch(activeChatBoxGS(true));
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
          t,
        ),
      );
      await dispatch(GetGroupMessages(navigate, chatGroupData, t));
      await dispatch(
        GetAllUsers(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t,
        ),
      );
      await dispatch(
        GetAllUsersGroupsRoomsList(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t,
        ),
      );
    }
  };

  // ─── View meeting ───
  const handleViewMeeting = async (
    videoCallURL,
    id,
    isQuickMeeting,
    status,
  ) => {
    try {
      if (status === "10" || status === 10) {
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
            setIsCreateEditMeeting,
            1,
            setAdvanceMeetingModalID,
            setViewAdvanceMeetingModal,
          ),
        );
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
              setIsCreateEditMeeting,
              1,
            ),
          );
        } else {
          setAdvanceMeetingModalID(id);
          setViewAdvanceMeetingModal(true);
          dispatch(viewAdvanceMeetingPublishPageFlag(true));
        }
      }
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  };

  // ─── Edit meeting ───
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
          2,
        ),
      );
    } else if (isQuick === false) {
      setIsMeetingCreateOrEdit(2);
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
        let AgData = { MeetingID: Number(id) };
        await dispatch(
          GetAllMeetingDetailsApiFunc(
            navigate,
            t,
            AgData,
            true,
            setCurrentMeetingID,
            setSceduleMeeting,
            setDataroomMapFolderId,
            0,
            1,
            role,
          ),
        );
      } else {
        let OrgData = { MeetingID: Number(id) };
        await dispatch(
          GetAllMeetingDetailsApiFunc(
            navigate,
            t,
            OrgData,
            true,
            setCurrentMeetingID,
            setSceduleMeeting,
            setDataroomMapFolderId,
            0,
            1,
            role,
          ),
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
    }
  };

  // ─── Download attendance report ───
  const onClickDownloadIcon = async (meetingID) => {
    let downloadData = { MeetingID: Number(meetingID) };
    dispatch(downloadAttendanceReportApi(navigate, t, downloadData));
  };

  // ─── Download recording ───
  const handleClickDownloadBtn = (record) => {
    let Data = { MeetingID: record?.pK_MDID };
    setMeetingTitle(record.meetingTitle);
    dispatch(
      getMeetingRecordingFilesApi(
        navigate,
        t,
        Data,
        setDownloadVideoRecordingModal,
      ),
    );
  };

  // ─── View minutes ───
  const handleClickViewMinutes = (record) => {
    setEditorRole({
      status: String(record?.status),
      role: record.isParticipant
        ? "Participant"
        : record.isAgendaContributor
          ? "Agenda Contributor"
          : "Organizer",
      isPrimaryOrganizer: record.isPrimaryOrganizer,
    });
    setVideoTalk({
      isChat: record.isChat,
      isVideoCall: record.isVideoCall,
      talkGroupID: record.talkGroupID,
    });
    dispatch(emailRouteID(5));
    setAdvanceMeetingModalID(record.pK_MDID);
    setViewAdvanceMeetingModal(true);
    dispatch(viewAdvanceMeetingPublishPageFlag(true));
    dispatch(scheduleMeetingPageFlag(false));
    localStorage.setItem("currentMeetingID", record.pK_MDID);
    localStorage.setItem("isMinutePublished", record.isMinutePublished);
  };

  // ─── View agenda ───
  const handleClickViewAgenda = (record) => {
    handleViewMeeting(
      record.videoCallURL,
      record.pK_MDID,
      record.isQuickMeeting,
      record.status,
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
    dispatch(emailRouteID(3));
    localStorage.setItem("isMinutePublished", record.isMinutePublished);
    localStorage.setItem("meetingTitle", record.title);
  };
  const handleClickContributeAgenda = (record) => {
    console.log("Agenda", record);
    handleEditMeeting(
      record.pK_MDID,
      record.isQuickMeeting,
      "Agenda Contributor",
      record,
    );
    setVideoTalk({
      isChat: record.isChat,
      isVideoCall: record.isVideoCall,
      talkGroupID: record.talkGroupID,
    });
    localStorage.setItem("videoCallURL", record.videoCallURL);
    setEditorRole({
      status: record.status,
      role: "Agenda Contributor",
      isPrimaryOrganizer: record.isPrimaryOrganizer,
    });
    setEditMeeting(true);
    dispatch(viewMeetingFlag(false));
  };

  const moreButtons = (record) => {
    const STATUS = {
      UPCOMING: 1,
      ACTIVE: 10,
      ENDED: 9,
      NOT_CONDUCTED: 8,
      CANCELLED: 4,
    };
    const status = Number(record.status);

    const isOrganizer = record.isOrganizer;
    const isParticipant = record.isParticipant;
    const isAgendaContributor = record.isAgendaContributor;

    const canShow = {
      edit:
        (status === STATUS.UPCOMING ||
          status === STATUS.ACTIVE ||
          status === STATUS.NOT_CONDUCTED) &&
        isOrganizer,

      cancel: status === STATUS.UPCOMING && isOrganizer,
      contributeAgenda: status === STATUS.UPCOMING && isAgendaContributor,

      talk:
        status !== STATUS.NOT_CONDUCTED &&
        status !== STATUS.CANCELLED &&
        record.talkGroupID !== 0,

      viewAgenda:
        (status === STATUS.ENDED ||
          status === STATUS.UPCOMING ||
          status === STATUS.ACTIVE) &&
        (isOrganizer || isAgendaContributor || isParticipant),

      attendance: status === STATUS.ENDED && isOrganizer,

      recording:
        status === STATUS.ENDED && isOrganizer && record.isRecordingAvailable,
      viewMinutes:
        (status === STATUS.ENDED &&
          !record.isQuickMeeting &&
          isParticipant &&
          record.isMinutePublished) ||
        (status === STATUS.ENDED &&
          isAgendaContributor &&
          !record.isQuickMeeting &&
          status === STATUS.ENDED &&
          record.isMinutePublished),
    };
    const hasAnyAction = Object.values(canShow).some(Boolean);

    if (!hasAnyAction) {
      return null;
    }

    return (
      <div className={styles.morebuttons}>
        {canShow.edit && (
          <div
            className={styles.morebtn}
            onClick={() => {
              if (record.isOrganizer || record.isAgendaContributor) {
                handleEditMeeting(
                  record.pK_MDID,
                  record.isQuickMeeting,
                  record.isAgendaContributor
                    ? "Agenda Contributor"
                    : "Organizer",
                  record,
                );
                setVideoTalk({
                  isChat: record.isChat,
                  isVideoCall: record.isVideoCall,
                  talkGroupID: record.talkGroupID,
                });
                localStorage.setItem("videoCallURL", record.videoCallURL);
                setEditorRole({
                  status: record.status,
                  role: record.isAgendaContributor
                    ? "Agenda Contributor"
                    : "Organizer",
                  isPrimaryOrganizer: record.isPrimaryOrganizer,
                });
                // setEditMeeting(true);
                // dispatch(viewMeetingFlag(true));
              }
            }}
          >
            <img src={EditIcon} alt="" width="16" height="16" />
            <span>{t("Edit-meeting")}</span>
          </div>
        )}

        {/* {canShow.cancel && (
          <div
            className={styles.morebtn}
            onClick={() => console.log("Cancel", record)}>
            <img src={CancelMeetingIcon} alt='' width='16' height='16' />
            <span>{t("Cancel-meeting")}</span>
          </div>
        )} */}

        {canShow.talk && (
          <div
            className={styles.morebtn}
            onClick={() => groupChatInitiation(record)}
          >
            <img src={ChatIcon} alt="" width="16" height="16" />
            <span>{t("Talk")}</span>
          </div>
        )}

        {canShow.viewAgenda && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickViewAgenda(record)}
          >
            <img src={AgendaIcon} alt="" width="16" height="16" />
            <span>{t("View-agenda")}</span>
          </div>
        )}

        {canShow.attendance && (
          <div
            className={styles.morebtn}
            onClick={() => onClickDownloadIcon(record.pK_MDID)}
          >
            <img src={ClipboardIcon} alt="" width="16" height="16" />
            <span>{t("Attendance-report")}</span>
          </div>
        )}

        {canShow.recording && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickDownloadBtn(record)}
          >
            <img src={DownloadVideoIcon} alt="" width="16" height="16" />
            <span>{t("Download-video-recording")}</span>
          </div>
        )}
        {canShow.viewMinutes && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickViewMinutes(record)}
          >
            <img src={DownloadVideoIcon} alt="" width="16" height="16" />
            <span>{t("View-minutes")}</span>
          </div>
        )}
        {canShow.contributeAgenda && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickContributeAgenda(record)}
          >
            <img src={AgendaIcon} alt="" width="16" height="16" />
            <span>{t("Contribute-agenda")}</span>
          </div>
        )}
      </div>
    );
  };

  const onMeetingAction = (actionType, record) => {
    console.log(actionType, record);
    const startMeetingRequest = {
      VideoCallURL: record.videoCallURL,
      MeetingID: Number(record.pK_MDID),
      StatusID: 10,
    };
    switch (actionType) {
      case "BOARD_DECK":
        setDownloadMeeting(false);
        setBoardDeckMeetingID(record?.pK_MDID);
        setBoardDeckMeetingTitle(record?.title);
        dispatch(boardDeckModal(true));
        localStorage.setItem("meetingTitle", record?.title);
        break;
      case "START_MEETING":
        if (!record.isQuickMeeting) {
          setAdvanceMeetingModalID(record.pK_MDID);
          dispatch(viewMeetingFlag(true));
          dispatch(scheduleMeetingPageFlag(false));
        }
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
            record.isPrimaryOrganizer,
          ),
        );
        setVideoTalk({
          isChat: record.isChat,
          isVideoCall: record.isVideoCall,
          talkGroupID: record.talkGroupID,
        });
        localStorage.setItem("videoCallURL", record.videoCallURL);
        localStorage.setItem("currentMeetingID", record.pK_MDID);
        localStorage.setItem("isMinutePublished", record.isMinutePublished);
        localStorage.setItem("meetingTitle", record.title);
        setEditorRole({
          status: "10",
          role: "Organizer",
          isPrimaryOrganizer: record.isPrimaryOrganizer,
        });

        // startMeeting(record);
        break;
      case "EDIT_MEETING":
        if (record.isQuickMeeting === false) {
          handleEditMeeting(
            record.pK_MDID,
            record.isQuickMeeting,
            "Organizer",
            record,
          );
          setVideoTalk({
            isChat: record.isChat,
            isVideoCall: record.isVideoCall,
            talkGroupID: record.talkGroupID,
          });
          localStorage.setItem("videoCallURL", record.videoCallURL);
        } else {
          if (record.isOrganizer || record.isAgendaContributor) {
            handleEditMeeting(
              record.pK_MDID,
              record.isQuickMeeting,
              record.isAgendaContributor ? "Agenda Contributor" : "Organizer",
              record,
            );
            setVideoTalk({
              isChat: record.isChat,
              isVideoCall: record.isVideoCall,
              talkGroupID: record.talkGroupID,
            });
            localStorage.setItem("videoCallURL", record.videoCallURL);
            setEditorRole({
              status: record.status,
              role: record.isAgendaContributor
                ? "Agenda Contributor"
                : "Organizer",
              isPrimaryOrganizer: record.isPrimaryOrganizer,
            });
            setEditMeeting(true);
            dispatch(viewMeetingFlag(true));
            return;
          }
        }
        // editMeeting(record);
        break;
      case "JOIN_MEETING":
        // joinMeeting(record);
        if (
          record.isOrganizer ||
          record.isAgendaContributor ||
          record.isParticipant
        ) {
          handleViewMeeting(
            record.videoCallURL,
            record.pK_MDID,
            record.isQuickMeeting,
            record.status,
          );
          // setIsOrganisers(isOrganiser);
          setEditorRole({
            status: record.status,
            role: record.isAgendaContributor
              ? "Agenda Contributor"
              : record.isParticipant
                ? "Participant"
                : "Organizer",
            isPrimaryOrganizer: record.isPrimaryOrganizer,
          });
          setVideoTalk({
            isChat: record.isChat,
            isVideoCall: record.isVideoCall,
            talkGroupID: record.talkGroupID,
          });
          localStorage.setItem("videoCallURL", record.videoCallURL);

          dispatch(viewMeetingFlag(true));
          localStorage.setItem("isMinutePublished", record.isMinutePublished);
          localStorage.setItem("meetingTitle", record.title);
        }

        break;
      case "END_MEETING":
        // endMeeting(record);
        break;
      case "VIEW_MEETING":
        handleViewMeeting(
          record.videoCallURL,
          record.pK_MDID,
          record.isQuickMeeting,
          record.status,
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
        localStorage.setItem("isMinutePublished", record.isMinutePublished);
        localStorage.setItem("meetingTitle", record.title);
        break;
      case "CONTRIBUTE_AGENDA":
        handleClickContributeAgenda(record);
        break;
      default:
        break;
    }
  };

  // ─── Table columns ───
  const columns = useMemo(() => {
    return [
      // ===== Meeting Title =====
      {
        title: (
          <div className="d-flex align-items-center gap-2">
            <span>{t("Meeting-title")}</span>

            <img
              src={
                meetingTitleSort === null
                  ? DoubleArrowIcon
                  : meetingTitleSort === "ascend"
                    ? SortIconAscend
                    : SortIconDescend
              }
              alt="Sort Icon"
            />
          </div>
        ),
        dataIndex: "title",
        key: "title",
        width: 300,
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
        sortOrder: meetingTitleSort,
        render: (text, record) => (
          <span
            onClick={() => {
              handleViewMeeting(
                record.videoCallURL,
                record.pK_MDID,
                record.isQuickMeeting,
                record.status,
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
                record.isMinutePublished,
              );
              localStorage.setItem("meetingTitle", record.title);
            }}
            className={styles.tableRow}
          >
            {text}
          </span>
        ),
      },

      // ===== Status =====
      {
        title: t("Status"),
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 120,
        ellipsis: true,
        filters: statusFilters,
        filterIcon: (filtered) => (
          <ChevronDown
            className={`status-filter-chevron ${filtered ? "active" : ""}`}
          />
        ),
        defaultFilteredValue: selectedValues.map((value) => value),
        filterResetToDefaultFilteredValue: true,
        onFilter: (value, record) => record.status === value,
        render: (text) => (
          <div className="d-flex justify-content-start">
            <span className={styles.columnValueStatus}>
              {StatusValue(t, text)}
            </span>
          </div>
        ),
      },

      // ===== Organizer =====
      {
        title: (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <span>{t("Organizer")}</span>
            <img
              src={
                organizerNameSort === null
                  ? DoubleArrowIcon
                  : organizerNameSort === "ascend"
                    ? SortIconAscend
                    : SortIconDescend
              }
              alt="Sort Icon"
            />
          </div>
        ),
        dataIndex: "host",
        key: "host",
        width: 120,
        align: "center",
        ellipsis: true,
        sorter: (a, b) =>
          a.host.toLowerCase().localeCompare(b.host.toLowerCase()),
        sortOrder: organizerNameSort,
        render: (text) => <div className={styles.columnValue}>{text}</div>,
      },

      // ===== Meeting Time =====
      {
        title: (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <span>{t("Time")}</span>
            <img
              src={
                meetingTimeSort === null
                  ? DoubleArrowIcon
                  : meetingTimeSort === "ascend"
                    ? ArrowDownIcon
                    : ArrowUpIcon
              }
              alt="Sort Icon"
            />
          </div>
        ),
        dataIndex: "time",
        key: "time",
        width: 120,
        align: "center",
        ellipsis: true,
        sorter: (a, b) => {
          const dateA = utcConvertintoGMT(
            `${a.dateOfMeeting}${a.meetingStartTime}`,
          );
          const dateB = utcConvertintoGMT(
            `${b.dateOfMeeting}${b.meetingStartTime}`,
          );
          return dateA - dateB;
        },
        sortOrder: meetingTimeSort,
        render: (text, record) => {
          const start = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime,
          );
          const end = forRecentActivity(
            record.dateOfMeeting + record.meetingEndTime,
          );
          if (!start || !end) return null;
          return (
            <span className={styles.columnValue}>{`${moment(start).format(
              "hh:mm a",
            )} - ${moment(end).format("hh:mm a")}`}</span>
          );
        },
      },

      // ===== Meeting Date =====
      {
        title: (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <span>{t("Date")}</span>
            <img
              src={
                meetingDateSort === null
                  ? DoubleArrowIcon
                  : meetingDateSort === "ascend"
                    ? ArrowDownIcon
                    : ArrowUpIcon
              }
              alt="Sort Icon"
            />
          </div>
        ),
        dataIndex: "date",
        key: "date",
        width: 95,
        align: "center",
        ellipsis: true,
        sorter: (a, b) => {
          // Combine date + startTime into ISO-like format for comparison
          const dateA = new Date(
            a.dateOfMeeting.substring(0, 4), // Year
            parseInt(a.dateOfMeeting.substring(4, 6)) - 1, // Month (0-based)
            a.dateOfMeeting.substring(6, 8), // Day
            a.meetingStartTime.substring(0, 2), // Hours
            a.meetingStartTime.substring(2, 4), // Minutes
            a.meetingStartTime.substring(4, 6), // Seconds
          );

          const dateB = new Date(
            b.dateOfMeeting.substring(0, 4),
            parseInt(b.dateOfMeeting.substring(4, 6)) - 1,
            b.dateOfMeeting.substring(6, 8),
            b.meetingStartTime.substring(0, 2),
            b.meetingStartTime.substring(2, 4),
            b.meetingStartTime.substring(4, 6),
          );

          return dateA - dateB; // returns number for Ant Design sorter
        },
        sortOrder: meetingDateSort,
        render: (text, record) => {
          const meetingDate = new Date(
            record.dateOfMeeting.substring(0, 4),
            parseInt(record.dateOfMeeting.substring(4, 6)) - 1,
            record.dateOfMeeting.substring(6, 8),
            record.meetingStartTime.substring(0, 2),
            record.meetingStartTime.substring(2, 4),
            record.meetingStartTime.substring(4, 6),
          );

          return (
            <span className={styles.columnValue}>
              {moment(meetingDate).format("Do MMM, YYYY")}
            </span>
          );
        },
      },

      // ===== Meeting Type =====
      {
        title: (
          <span className="d-flex justify-content-center align-items-center">
            {t("Meeting-type")}
          </span>
        ),
        dataIndex: "meetingType",
        key: "meetingType",
        width: 140,
        align: "center",
        filters: isMeetingTypeFilter.map((filter) => ({
          text: filter.text,
          value: filter.value,
        })),
        defaultFilteredValue: isMeetingTypeFilter.map((f) => f.value),
        filterResetToDefaultFilteredValue: true,
        onFilter: (value, record) =>
          Number(record.meetingType) === Number(value),
        filterIcon: (filtered) => (
          <ChevronDown
            className={`filter-chevron-icon-todolist ${
              filtered ? "active" : ""
            }`}
          />
        ),
        render: (_, record) => {
          const meetingType = Number(record.meetingType);
          const matchedFilter = isMeetingTypeFilter.find(
            (f) => Number(f.value) === meetingType,
          );
          if (record.isQuickMeeting && meetingType === 1)
            return t("Quick-meeting");
          return matchedFilter ? (
            <span className={styles.columnValue}>{t(matchedFilter.text)}</span>
          ) : (
            ""
          );
        },
      },

      // ===== Action Column =====
      {
        title: "",
        width: 110,
        key: "action",
        align: "center",
        render: (_, record) => {
          const {
            dateOfMeeting,
            meetingStartTime,
            status,
            isQuickMeeting,
            isOrganizer,
            isParticipant,
            isAgendaContributor,
            pK_MDID,
          } = record;

          const meetingDateTime = dateOfMeeting + meetingStartTime;
          const currentUTCDateTime = getCurrentDateTimeUTC();

          // Convert string datetime to Date objects
          const parseDateTime = (dateTimeStr) =>
            new Date(
              dateTimeStr.substring(0, 4), // Year
              parseInt(dateTimeStr.substring(4, 6), 10) - 1, // Month
              dateTimeStr.substring(6, 8), // Day
              dateTimeStr.substring(8, 10), // Hours
              dateTimeStr.substring(10, 12), // Minutes
              dateTimeStr.substring(12, 14), // Seconds
            );

          const currentDateObj = parseDateTime(currentUTCDateTime);
          const meetingDateObj = parseDateTime(meetingDateTime);

          const minutesDifference = Math.floor(
            (meetingDateObj - currentDateObj) / (1000 * 60),
          );
          const meetingCurrentStatus = Number(status);

          const isButtonShown = startMeetingButton.find(
            (btnData) => Number(btnData.meetingID) === Number(pK_MDID),
          );

          const canStartMeeting =
            (meetingCurrentStatus === 1 &&
              isOrganizer &&
              minutesDifference < minutesAgo) ||
            (pK_MDID === isButtonShown?.meetingID && isButtonShown?.showButton);

          console.log(
            {
              canStartMeeting,
              meetingCurrentStatus,
              minutesDifference,
              minutesAgo,
              pK_MDID,
              isButtonShown,
            },
            "canStartMeetingcanStartMeeting",
          );

          const handleClick = (actionType) =>
            onMeetingAction(actionType, record);

          // ===== UPCOMING =====
          if (meetingCurrentStatus === 1) {
            if (isOrganizer) {
              return (
                <div className="d-flex justify-content-center align-items-center">
                  <CustomButton
                    text={
                      canStartMeeting ? t("Start-meeting") : t("Edit-meeting")
                    }
                    className={
                      canStartMeeting
                        ? styles.StartMeetingButton
                        : styles.EditMeetingButton
                    }
                    onClick={() =>
                      handleClick(
                        canStartMeeting ? "START_MEETING" : "EDIT_MEETING",
                      )
                    }
                  />
                </div>
              );
            }
            if (isAgendaContributor) {
              return (
                <div className="d-flex justify-content-center align-items-center">
                  <CustomButton
                    text={t("Contribute-agenda")}
                    className={styles.ContributeAgendaButton}
                    onClick={() => handleClick("CONTRIBUTE_AGENDA")}
                  />
                </div>
              );
            }
            if (isParticipant) {
              return (
                <div className="d-flex justify-content-center align-items-center">
                  <CustomButton
                    text={t("View-meeting")}
                    className={styles.ViewMeetingButton}
                    onClick={() => handleClick("VIEW_MEETING")}
                  />
                </div>
              );
            }
          }

          // ===== ACTIVE =====
          if (meetingCurrentStatus === 10) {
            return (
              <div className="d-flex justify-content-center align-items-center">
                <CustomButton
                  text={t("Join-meeting")}
                  className={styles.JoinMeetingButton}
                  onClick={() => handleClick("JOIN_MEETING")}
                />
              </div>
            );
          }

          // ===== ENDED =====
          if (meetingCurrentStatus === 9 && isOrganizer && !isQuickMeeting) {
            return (
              <div className="d-flex justify-content-center align-items-center">
                <CustomButton
                  text={t("Board-deck")}
                  className={styles.BoardDeckButton}
                  onClick={() => handleClick("BOARD_DECK")}
                />
              </div>
            );
          }

          // ===== NOT CONDUCTED =====
          if (meetingCurrentStatus === 8 && isOrganizer) {
            return (
              <div className="d-flex justify-content-center align-items-center">
                <CustomButton
                  text={t("Edit-meeting")}
                  className={styles.EditMeetingButton}
                  onClick={() => handleClick("EDIT_MEETING")}
                />
              </div>
            );
          }

          // ===== Cancelled or others =====
          return null;
        },
      },

      // ===== More Popover =====
      {
        title: "",
        dataIndex: "meetingAction",
        key: "meetingAction",
        width: 110,
        align: "center",
        render: (_, record) => {
          let checkifCancelledAndNotConducted =
            (Number(record.status) === 4 || Number(record.status) === 8) &&
            (record.isParticipant ||
              record.isOrganizer ||
              record.isAgendaContributor);

          return (
            !checkifCancelledAndNotConducted && (
              <div className="d-flex justify-content-center align-items-center">
                <Popover
                  content={moreButtons(record)}
                  trigger="click"
                  overlayClassName="MoreButtons_overlay"
                  className="moreOptionsPopover"
                  showArrow={false}
                  placement="bottomRight"
                >
                  <CustomButton
                    className={styles.MoreMeetingButton}
                    text={t("More")}
                    icon2={<img src={ChevronDownIcon} width={10} alt="" />}
                  />
                </Popover>
              </div>
            )
          );
        },
      },
    ];
  }, [
    meetingTitleSort,
    organizerNameSort,
    meetingTimeSort,
    meetingDateSort,
    statusFilterVisible,
    selectedStatusValues,
    meetingTypeFilterVisible,
    selectedMeetingTypeValues,
    isMeetingTypeFilter,
    minutesAgo,
    DoubleArrowIcon,
    SortIconAscend,
    SortIconDescend,
    startMeetingButton,
  ]);

  // ─── Handle table sorting ───
  const handleTableChange = (pagination, filters, sorter) => {
    setMeetingTitleSort(null);
    setOrganizerNameSort(null);
    setMeetingTimeSort(null);
    setMeetingDateSort(null);

    if (sorter.order) {
      switch (sorter.columnKey) {
        case "title":
          setMeetingTitleSort(sorter.order);
          break;
        case "host":
          setOrganizerNameSort(sorter.order);
          break;
        case "time":
          setMeetingTimeSort(sorter.order);
          break;
        case "date":
          setMeetingDateSort(sorter.order);
          break;
        default:
          break;
      }
    }
  };

  const handelChangePagination = async (current, PageSize) => {
    let searchData = {
      Date: searchFilters.Date,
      Title: searchFilters.MeetingTitle,
      HostName: searchFilters.OrganizerName,
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(PageSize),
      PublishedMeetings: true,
      ProposedMeetings: false,
    };
    localStorage.setItem("MeetingPageRows", PageSize);
    localStorage.setItem("MeetingPageCurrent", current);
    console.log("chek search meeting");
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
  };

  return (
    <>
      <Row className="mt-2 ">
        <Col
          lg={12}
          md={12}
          sm={12}
          className={styles["MainMeetingTablePublished"]}
        >
          <Table
            getPopupContainer={(node) => node.closest(".ant-table")}
            onChange={handleTableChange}
            className="MeetingTable"
            column={columns}
            size={"small"}
            rows={publishedMeetingData}
            sticky={true}
            pagination={false}
            locale={{
              emptyText: <EmptyTableComponent />,
            }}
            scroll={{
              y: 400,
            }}
          />
        </Col>
        <Col>
          {publishedMeetingData.length > 0 ? (
            <>
              {" "}
              <Col
                lg={12}
                md={12}
                sm={12}
                className={`${
                  styles["Meeting_Pagination"]
                } ${"d-flex justify-content-center "} `}
              >
                <Row className={styles["PaginationStyle-Meeting"]}>
                  <Col
                    className={"pagination-groups-table"}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                    <CustomPagination
                      current={
                        meetingPageCurrent !== null
                          ? Number(meetingPageCurrent)
                          : 1
                      }
                      pageSize={
                        meetingpageRow !== null ? Number(meetingpageRow) : 50
                      }
                      onChange={handelChangePagination}
                      total={publishedMeetingDataRecord}
                      showSizer={true}
                      pageSizeOptionsValues={["30", "50", "100", "200"]}
                    />
                  </Col>
                </Row>
              </Col>
            </>
          ) : null}
        </Col>
      </Row>
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
      {downloadVideoRecordingModal && <MeetingRecording title={meetingTitle} />}
    </>
  );
};

export default PublishedMeetingList;
