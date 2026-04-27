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
} from "../../../commen/functions/date_formater";

// Redux actions
import {
  scheduleMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewMeetingFlag,
  JoinCurrentMeeting,
  emailRouteID,
  boardDeckModal,
  getMeetingRecordingFilesApi,
  searchNewUserMeeting,
} from "../../../store/actions/NewMeetingActions";
import { UpdateOrganizersMeeting } from "../../../store/actions/MeetingOrganizers_action";
import { ViewMeeting } from "../../../store/actions/Get_List_Of_Assignees";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";

import {
  setViewTab,
  toggleViewMeetingModal,
} from "../../../store/actions/ModalStates_actions";

// Talk actions
import {
  GetAllUsers,
  GetAllUsersGroupsRoomsList,
  GetGroupMessages,
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

import styles from "./publishMeeting.module.css";

import { ChevronDown, Record } from "react-bootstrap-icons";
import CustomPagination from "@/commen/functions/customPagination/Paginations";
import BoardDeckModal from "@/container/meeting/commonComponents/BoardDeck/BoardDeckModal/BoardDeckModal";
import BoardDeckSendEmail from "@/container/meeting/commonComponents/BoardDeck/BoardDeckSendEmail/BoardDeckSendEmail";
import ShareModalBoarddeck from "@/container/meeting/commonComponents/BoardDeck/ShareModalBoardDeck/ShareModalBoarddeck";
import DownloadOptionsModal from "@/container/meeting/commonComponents/DownloadMeetingTranscribeAndRecording/DownloadOptionsModal/DownloadOptionsModal";
import ShareViaDataRoomPathModal from "@/container/meeting/commonComponents/BoardDeck/ShareViaDataRoomPathModal/ShareViaDataRoomPathModal";
import MeetingRecording from "@/container/meeting/commonComponents/MeetingRecording/MeetingRecording";
import {
  getMeetingDetailsByMeetingIdApi,
  joinMeetingApi,
  setCurrentMeetingInfo,
  UpdateMeetingStatusApi,
} from "../../../store/actions/NewMeeting2.actions";

// ─── Module-level constants (avoid per-render recreation) ──────────────────

const STATUS = {
  UPCOMING: 1,
  ACTIVE: 10,
  ENDED: 9,
  NOT_CONDUCTED: 8,
  CANCELLED: 4,
};

const DEFAULT_STATUS_VALUES = ["10", "1", "9", "4", "8"];

// Parses "YYYYMMDDHHmmss" into a Date
const parseDateTime = (str) =>
  new Date(
    str.substring(0, 4),
    parseInt(str.substring(4, 6), 10) - 1,
    str.substring(6, 8),
    str.substring(8, 10),
    str.substring(10, 12),
    str.substring(12, 14)
  );

const PublishedMeetingList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ─── Redux selectors ──────────────────────────────────────────────────────

  const boardDeckModalData = useSelector(
    (s) => s.NewMeetingreducer.boardDeckModalData
  );
  const boardDeckEmailModal = useSelector(
    (s) => s.NewMeetingreducer.boardDeckEmailModal
  );
  const boarddeckShareModal = useSelector(
    (s) => s.NewMeetingreducer.boarddeckShareModal
  );
  const shareViaDataRoomPathConfirmModal = useSelector(
    (s) => s.NewMeetingreducer.shareViaDataRoomPathConfirmation
  );

  // ─── Context ──────────────────────────────────────────────────────────────

  const {
    editorRole,
    setEditorRole,
    setVideoTalk,
    setViewAdvanceMeetingModal,
    setAdvanceMeetingModalID,
    setSceduleMeeting,
    setDataroomMapFolderId,
    setViewFlag,
    setEditFlag,
    setDownloadMeeting,
    setDownloadVideoRecordingModal,
    boardDeckMeetingID,
    setBoardDeckMeetingID,
    boardDeckMeetingTitle,
    setBoardDeckMeetingTitle,
    downloadVideoRecordingModal,
  } = useMeetingContext();

  const {
    isMeetingTypeFilter,
    minutesAgo,
    startMeetingButton,
    publishedMeetingData,
    publishedMeetingDataRecord,
    setPublishedMeetingData,
    searchFilters,
    setIsCreateEditMeeting,
  } = useNewMeetingContext();

  console.log(minutesAgo, "minutesAgominutesAgo");

  // ─── Local state ──────────────────────────────────────────────────────────

  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [organizerNameSort, setOrganizerNameSort] = useState(null);
  const [meetingTimeSort, setMeetingTimeSort] = useState(null);
  const [meetingDateSort, setMeetingDateSort] = useState(null);
  const [duplicatedrows] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isDownloadAvailable] = useState(false);
  const [downloadMeetingRecord] = useState(null);
  const [selectedValues, setSelectedValues] = useState(DEFAULT_STATUS_VALUES);
  const [selectedMeetingTypes] = useState(
    isMeetingTypeFilter.map((f) => f.value)
  );
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

  // ─── localStorage reads ───────────────────────────────────────────────────

  const meetingpageRow = localStorage.getItem("MeetingPageRows");
  const meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  const userID = localStorage.getItem("userID");
  const currentOrganizationId = localStorage.getItem("organizationID");

  const statusFilters = useMemo(
    () => [
      { value: "10", text: t("Active") },
      { value: "1", text: t("Upcoming") },
      { value: "9", text: t("Ended") },
      { value: "4", text: t("Cancelled") },
      { value: "8", text: t("Not-conducted") },
    ],
    [t]
  );

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const buildEditorRole = (record) => ({
    status: record.status,
    role: record.isParticipant
      ? "Participant"
      : record.isAgendaContributor
      ? "Agenda Contributor"
      : "Organizer",
    isPrimaryOrganizer: record.isPrimaryOrganizer,
  });

  const buildVideoTalk = (record) => ({
    isChat: record.isChat,
    isVideoCall: record.isVideoCall,
    talkGroupID: record.talkGroupID,
  });

  const setMeetingLocalStorage = (record) => {
    localStorage.setItem("videoCallURL", record.videoCallURL);
    localStorage.setItem("isMinutePublished", record.isMinutePublished);
    localStorage.setItem("meetingTitle", record.title);
  };

  // ─── Combined filter ──────────────────────────────────────────────────────

  const applyCombinedFilters = (statuses, meetingTypes) => {
    setPublishedMeetingData(
      duplicatedrows.filter(
        (r) =>
          statuses.includes(r.status.toString()) &&
          meetingTypes.includes(r.meetingType.toString())
      )
    );
  };

  const handleMenuClick = (filterValue) => {
    setSelectedValues((prev) =>
      prev.includes(filterValue)
        ? prev.filter((v) => String(v) !== String(filterValue))
        : [...prev, String(filterValue)]
    );
  };

  const handleApplyFilter = () => {
    applyCombinedFilters(selectedValues, selectedMeetingTypes);
  };

  const resetFilter = () => {
    setSelectedValues(DEFAULT_STATUS_VALUES);
    applyCombinedFilters(DEFAULT_STATUS_VALUES, selectedMeetingTypes);
  };

  // ─── Group Chat ───────────────────────────────────────────────────────────

  const groupChatInitiation = async (data) => {
    if (data.talkGroupID === 0) return;

    dispatch(createShoutAllScreen(false));
    dispatch(addNewChatScreen(false));
    dispatch(footerActionStatus(false));
    dispatch(createGroupScreen(false));
    dispatch(recentChatFlag(true));
    dispatch(activeChatBoxGS(true));
    dispatch(headerShowHideStatus(true));
    dispatch(footerShowHideStatus(true));

    const uid = parseInt(userID);
    const orgId = parseInt(currentOrganizationId);

    await Promise.all([
      dispatch(GetAllUserChats(navigate, uid, orgId, t)),
      dispatch(
        GetGroupMessages(
          navigate,
          {
            UserID: uid,
            ChannelID: currentOrganizationId,
            GroupID: data.talkGroupID,
            NumberOfMessages: 50,
            OffsetMessage: 0,
          },
          t
        )
      ),
      dispatch(GetAllUsers(navigate, uid, orgId, t)),
      dispatch(GetAllUsersGroupsRoomsList(navigate, uid, orgId, t)),
    ]);
  };

  // ─── View Meeting ─────────────────────────────────────────────────────────

  const handleViewMeeting = async (
    videoCallURL,
    id,
    isQuickMeeting,
    status,
    record
  ) => {
    try {
      const statusNum = Number(status);

      if (statusNum === STATUS.ACTIVE) {
        handleJoinMeeting(record);

        return;
      }

      if (isQuickMeeting) {
        await dispatch(
          ViewMeeting(
            navigate,
            { MeetingID: id },
            t,
            setViewFlag,
            setEditFlag,
            setIsCreateEditMeeting,
            1
          )
        );
        return;
      }

      dispatch(toggleViewMeetingModal(true));
      dispatch(setViewTab("meetingDetails"));
      setEditorRole((prev) => ({
        ...prev,
        status: status,
        role: record.isParticipant
          ? "Participant"
          : record.isAgendaContributor
          ? "Agenda Contributor"
          : "Organizer",
        isPrimaryOrganizer: record.isPrimaryOrganizer,
      }));
      dispatch(setCurrentMeetingInfo({
        meetingID: record.pK_MDID,
      }))
    } catch (error) {
      console.error("handleViewMeeting:", error);
    }
  };

  // ─── Edit Meeting ─────────────────────────────────────────────────────────

  const handleEditMeeting = async (record) => {
    const role = record.isAgendaContributor
      ? "Agenda Contributor"
      : "Organizer";
    const meetingId = Number(record.pK_MDID);
    const context = "EditMeetingFromMainListing";

    if (record.isQuickMeeting) {
      await dispatch(
        ViewMeeting(navigate, t, { MeetingID: meetingId }, context, {
          setViewFlag,
          setEditFlag,
          setSceduleMeeting,
          no: 2,
        })
      );
      return;
    }

    // Set state synchronously BEFORE dispatch — no stale closure issue
    localStorage.setItem("videoCallURL", record.videoCallURL);
    setVideoTalk(buildVideoTalk(record));
    setEditorRole({
      status: record.status,
      role,
      isPrimaryOrganizer: record.isPrimaryOrganizer,
    });

    // callFunc now a no-op (or pass empty function if API requires it)
    await dispatch(
      getMeetingDetailsByMeetingIdApi(
        navigate,
        t,
        { MeetingID: meetingId },
        context,
        { role, callFunc: () => {} }
      )
    );
  };

  // ─── Join Meeting ─────────────────────────────────────────────────────────

  const handleJoinMeeting = async (record) => {
    const role = record.isAgendaContributor
      ? "Agenda Contributor"
      : "Organizer";
    const meetingId = Number(record.pK_MDID);
    const context = "JoinMeetingFromMainListing";

    if (record.isQuickMeeting) {
      await dispatch(
        ViewMeeting(navigate, t, { MeetingID: meetingId }, context, {
          setViewFlag,
          setEditFlag,
          setSceduleMeeting,
          no: 2,
        })
      );
      return;
    }

    // Set state synchronously BEFORE dispatch — no stale closure issue
    localStorage.setItem("videoCallURL", record.videoCallURL);
    setVideoTalk(buildVideoTalk(record));
    setEditorRole({
      status: record.status,
      role,
      isPrimaryOrganizer: record.isPrimaryOrganizer,
    });

    dispatch(
      joinMeetingApi(
        navigate,
        t,
        {
          VideoCallURL: record.videoCallURL,
          FK_MDID: Number(meetingId),
          DateTime: getCurrentDateTimeUTC(),
        },
        "JoinMeetingFromListing",
        {
          role,
          isQuickMeeting: record.isQuickMeeting,
          record,
        }
      )
    );
  };

  // ─── Other actions ────────────────────────────────────────────────────────

  const onClickDownloadIcon = (meetingID) => {
    dispatch(
      downloadAttendanceReportApi(navigate, t, {
        MeetingID: Number(meetingID),
      })
    );
  };

  const handleClickDownloadBtn = (record) => {
    setMeetingTitle(record.meetingTitle);
    dispatch(
      getMeetingRecordingFilesApi(
        navigate,
        t,
        { MeetingID: record?.pK_MDID },
        setDownloadVideoRecordingModal
      )
    );
  };

  const handleClickViewMinutes = (record) => {
    setEditorRole(buildEditorRole(record));
    setVideoTalk(buildVideoTalk(record));
    dispatch(emailRouteID(5));
    dispatch(setViewTab("minutes"));
    // setAdvanceMeetingModalID(record.pK_MDID);
    // setViewAdvanceMeetingModal(true);
    // dispatch(viewAdvanceMeetingPublishPageFlag(true));
    // dispatch(scheduleMeetingPageFlag(false));
    // localStorage.setItem("currentMeetingID", record.pK_MDID);
    localStorage.setItem("isMinutePublished", record.isMinutePublished);
  };

  const handleClickViewAgenda = (record) => {
    handleViewMeeting(
      record.videoCallURL,
      record.pK_MDID,
      record.isQuickMeeting,
      record.status,
      record
    );
    setVideoTalk(buildVideoTalk(record));
    setEditorRole(buildEditorRole(record));
    dispatch(emailRouteID(3));
    dispatch(setViewTab("Agenda"));
    setMeetingLocalStorage(record);
  };

  // handleEditMeeting already sets videoTalk via its callFunc
  const handleClickContributeAgenda = (record) => {
    handleEditMeeting(record);
  };

  // ─── More Buttons (Popover) ───────────────────────────────────────────────

  const moreButtons = (record) => {
    const status = Number(record.status);
    const { isOrganizer, isParticipant, isAgendaContributor } = record;

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
        status === STATUS.ENDED &&
        !record.isQuickMeeting &&
        record.isMinutePublished &&
        (isParticipant || isAgendaContributor),
    };

    if (!Object.values(canShow).some(Boolean)) return null;

    return (
      <div className={styles.morebuttons}>
        {canShow.edit && (
          <div
            className={styles.morebtn}
            onClick={() => handleEditMeeting(record)}>
            <img src={EditIcon} alt='' width='16' height='16' />
            <span>{t("Edit-meeting")}</span>
          </div>
        )}

        {canShow.talk && (
          <div
            className={styles.morebtn}
            onClick={() => groupChatInitiation(record)}>
            <img src={ChatIcon} alt='' width='16' height='16' />
            <span>{t("Talk")}</span>
          </div>
        )}

        {canShow.viewAgenda && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickViewAgenda(record)}>
            <img src={AgendaIcon} alt='' width='16' height='16' />
            <span>{t("View-agenda")}</span>
          </div>
        )}

        {canShow.attendance && (
          <div
            className={styles.morebtn}
            onClick={() => onClickDownloadIcon(record.pK_MDID)}>
            <img src={ClipboardIcon} alt='' width='16' height='16' />
            <span>{t("Attendance-report")}</span>
          </div>
        )}

        {canShow.recording && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickDownloadBtn(record)}>
            <img src={DownloadVideoIcon} alt='' width='16' height='16' />
            <span>{t("Download-video-recording")}</span>
          </div>
        )}

        {canShow.viewMinutes && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickViewMinutes(record)}>
            <img src={DownloadVideoIcon} alt='' width='16' height='16' />
            <span>{t("View-minutes")}</span>
          </div>
        )}

        {canShow.contributeAgenda && (
          <div
            className={styles.morebtn}
            onClick={() => handleClickContributeAgenda(record)}>
            <img src={AgendaIcon} alt='' width='16' height='16' />
            <span>{t("Contribute-agenda")}</span>
          </div>
        )}
      </div>
    );
  };

  // ─── Meeting Action Handler ───────────────────────────────────────────────

  const onMeetingAction = (actionType, record) => {
    switch (actionType) {
      case "BOARD_DECK":
        setDownloadMeeting(false);
        setBoardDeckMeetingID(record?.pK_MDID);
        setBoardDeckMeetingTitle(record?.title);
        dispatch(boardDeckModal(true));
        localStorage.setItem("meetingTitle", record?.title);
        break;

      case "START_MEETING": {
        if (!record.isQuickMeeting) {
          dispatch(
            UpdateMeetingStatusApi(
              navigate,
              t,
              {
                MeetingID: Number(record.pK_MDID),
                StatusID: 10,
              },
              "startMeetingFromMainListing",
              {
                record,
              }
            )
          );
          // dispatch(setViewTab("meetingDetails"));
          setVideoTalk(buildVideoTalk(record));
          setMeetingLocalStorage(record);
          // localStorage.setItem("currentMeetingID", record.pK_MDID);
          setEditorRole({
            status: "10",
            role: "Organizer",
            isPrimaryOrganizer: record.isPrimaryOrganizer,
          });
          return;
        }

        break;
      }

      case "EDIT_MEETING":
        handleEditMeeting(record);
        break;

      case "JOIN_MEETING":
        handleJoinMeeting(record);

        break;

      case "VIEW_MEETING":
        handleViewMeeting(
          record.videoCallURL,
          record.pK_MDID,
          record.isQuickMeeting,
          record.status,
          record
        );
        setVideoTalk(buildVideoTalk(record));
        setEditorRole(buildEditorRole(record));
        setMeetingLocalStorage(record);
        dispatch(setCurrentMeetingInfo({
          meetingID: record.pK_MDID,
        }))
        break;

      case "CONTRIBUTE_AGENDA":
        handleClickContributeAgenda(record);
        break;

      default:
        break;
    }
  };

  // ─── Table Columns ────────────────────────────────────────────────────────

  const columns = useMemo(() => {
    return [
      // ── Meeting Title ──
      {
        title: (
          <div className='d-flex align-items-center gap-2'>
            <span>{t("Meeting-title")}</span>
            <img
              src={
                meetingTitleSort === null
                  ? DoubleArrowIcon
                  : meetingTitleSort === "ascend"
                  ? SortIconAscend
                  : SortIconDescend
              }
              alt='Sort Icon'
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
            className={styles.tableRow}
            onClick={() => {
              handleViewMeeting(
                record.videoCallURL,
                record.pK_MDID,
                record.isQuickMeeting,
                record.status,
                record
              );
              setMeetingLocalStorage(record);
              setVideoTalk(buildVideoTalk(record));
              setEditorRole(buildEditorRole(record));
            }}>
            {text}
          </span>
        ),
      },

      // ── Status ──
      {
        title: t("Status"),
        dataIndex: "status",
        key: "status",
        align: "left",
        width: 120,
        ellipsis: true,
        filters: statusFilters,
        filterIcon: (filtered) => (
          <ChevronDown
            className={`status-filter-chevron ${filtered ? "active" : ""}`}
          />
        ),
        defaultFilteredValue: selectedValues,
        filterResetToDefaultFilteredValue: true,
        onFilter: (value, record) => record.status === value,
        render: (text) => (
          <div className='d-flex justify-content-start'>
            <span className={styles.columnValueStatus}>
              {StatusValue(t, text)}
            </span>
          </div>
        ),
      },

      // ── Organizer ──
      {
        title: (
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <span>{t("Organizer")}</span>
            <img
              src={
                organizerNameSort === null
                  ? DoubleArrowIcon
                  : organizerNameSort === "ascend"
                  ? SortIconAscend
                  : SortIconDescend
              }
              alt='Sort Icon'
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

      // ── Meeting Time ──
      {
        title: (
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <span>{t("Time")}</span>
            <img
              src={
                meetingTimeSort === null
                  ? DoubleArrowIcon
                  : meetingTimeSort === "ascend"
                  ? ArrowDownIcon
                  : ArrowUpIcon
              }
              alt='Sort Icon'
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
            `${a.dateOfMeeting}${a.meetingStartTime}`
          );
          const dateB = utcConvertintoGMT(
            `${b.dateOfMeeting}${b.meetingStartTime}`
          );
          return dateA - dateB;
        },
        sortOrder: meetingTimeSort,
        render: (text, record) => {
          const start = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime
          );
          const end = forRecentActivity(
            record.dateOfMeeting + record.meetingEndTime
          );
          if (!start || !end) return null;
          return (
            <span className={styles.columnValue}>
              {`${moment(start).format("hh:mm a")} - ${moment(end).format(
                "hh:mm a"
              )}`}
            </span>
          );
        },
      },

      // ── Meeting Date ──
      {
        title: (
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <span>{t("Date")}</span>
            <img
              src={
                meetingDateSort === null
                  ? DoubleArrowIcon
                  : meetingDateSort === "ascend"
                  ? ArrowDownIcon
                  : ArrowUpIcon
              }
              alt='Sort Icon'
            />
          </div>
        ),
        dataIndex: "date",
        key: "date",
        width: 95,
        align: "center",
        ellipsis: true,
        sorter: (a, b) =>
          parseDateTime(a.dateOfMeeting + a.meetingStartTime) -
          parseDateTime(b.dateOfMeeting + b.meetingStartTime),
        sortOrder: meetingDateSort,
        render: (text, record) => (
          <span className={styles.columnValue}>
            {moment(
              parseDateTime(record.dateOfMeeting + record.meetingStartTime)
            ).format("Do MMM, YYYY")}
          </span>
        ),
      },

      // ── Meeting Type ──
      {
        title: (
          <span className='d-flex justify-content-center align-items-center'>
            {t("Meeting-type")}
          </span>
        ),
        dataIndex: "meetingType",
        key: "meetingType",
        width: 140,
        align: "center",
        filters: isMeetingTypeFilter.map((f) => ({
          text: f.text,
          value: f.value,
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
            (f) => Number(f.value) === meetingType
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

      // ── Action Column ──
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

          const currentDateObj = parseDateTime(getCurrentDateTimeUTC());
          const meetingDateObj = parseDateTime(
            dateOfMeeting + meetingStartTime
          );
          const minutesDifference = Math.floor(
            (meetingDateObj - currentDateObj) / (1000 * 60)
          );
          const meetingCurrentStatus = Number(status);
          const isButtonShown = startMeetingButton.find(
            (btn) => Number(btn.meetingID) === Number(pK_MDID)
          );
          const canStartMeeting =
            (meetingCurrentStatus === STATUS.UPCOMING &&
              isOrganizer &&
              minutesDifference < minutesAgo) ||
            (pK_MDID === isButtonShown?.meetingID && isButtonShown?.showButton);

          const handleClick = (actionType) =>
            onMeetingAction(actionType, record);

          // UPCOMING
          if (meetingCurrentStatus === STATUS.UPCOMING) {
            if (isOrganizer) {
              return (
                <div className='d-flex justify-content-center align-items-center'>
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
                        canStartMeeting ? "START_MEETING" : "EDIT_MEETING"
                      )
                    }
                  />
                </div>
              );
            }
            if (isAgendaContributor) {
              return (
                <div className='d-flex justify-content-center align-items-center'>
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
                <div className='d-flex justify-content-center align-items-center'>
                  <CustomButton
                    text={t("View-meeting")}
                    className={styles.ViewMeetingButton}
                    onClick={() => handleClick("VIEW_MEETING")}
                  />
                </div>
              );
            }
          }

          // ACTIVE
          if (meetingCurrentStatus === STATUS.ACTIVE) {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <CustomButton
                  text={t("Join-meeting")}
                  className={styles.JoinMeetingButton}
                  onClick={() => handleClick("JOIN_MEETING")}
                />
              </div>
            );
          }

          // ENDED
          if (
            meetingCurrentStatus === STATUS.ENDED &&
            isOrganizer &&
            !isQuickMeeting
          ) {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <CustomButton
                  text={t("Board-deck")}
                  className={styles.BoardDeckButton}
                  onClick={() => handleClick("BOARD_DECK")}
                />
              </div>
            );
          }

          // NOT CONDUCTED
          if (meetingCurrentStatus === STATUS.NOT_CONDUCTED && isOrganizer) {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <CustomButton
                  text={t("Edit-meeting")}
                  className={styles.EditMeetingButton}
                  onClick={() => handleClick("EDIT_MEETING")}
                />
              </div>
            );
          }

          return null;
        },
      },

      // ── More Popover ──
      {
        title: "",
        dataIndex: "meetingAction",
        key: "meetingAction",
        width: 110,
        align: "center",
        render: (_, record) => {
          const statusNum = Number(record.status);
          const isCancelledOrNotConducted =
            (statusNum === STATUS.CANCELLED ||
              statusNum === STATUS.NOT_CONDUCTED) &&
            (record.isParticipant ||
              record.isOrganizer ||
              record.isAgendaContributor);

          if (isCancelledOrNotConducted) return null;

          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Popover
                content={moreButtons(record)}
                trigger='click'
                overlayClassName='MoreButtons_overlay'
                className='moreOptionsPopover'
                showArrow={false}
                placement='bottomRight'>
                <CustomButton
                  className={styles.MoreMeetingButton}
                  text={t("More")}
                  icon2={<img src={ChevronDownIcon} width={10} alt='' />}
                />
              </Popover>
            </div>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    meetingTitleSort,
    organizerNameSort,
    meetingTimeSort,
    meetingDateSort,
    isMeetingTypeFilter,
    minutesAgo,
    startMeetingButton,
    selectedValues,
    statusFilters,
    t,
  ]);

  // ─── Table Sort Handler ───────────────────────────────────────────────────

  const handleTableChange = (pagination, filters, sorter) => {
    setMeetingTitleSort(null);
    setOrganizerNameSort(null);
    setMeetingTimeSort(null);
    setMeetingDateSort(null);

    if (!sorter.order) return;

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
  };

  // ─── Pagination ───────────────────────────────────────────────────────────

  const handelChangePagination = async (current, PageSize) => {
    localStorage.setItem("MeetingPageRows", PageSize);
    localStorage.setItem("MeetingPageCurrent", current);
    await dispatch(
      searchNewUserMeeting(navigate, t, {
        Date: searchFilters.Date,
        Title: searchFilters.MeetingTitle,
        HostName: searchFilters.OrganizerName,
        UserID: Number(userID),
        PageNumber: Number(current),
        Length: Number(PageSize),
        PublishedMeetings: true,
        ProposedMeetings: false,
      })
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Row className='mt-2'>
        <Col
          lg={12}
          md={12}
          sm={12}
          className={styles["MainMeetingTablePublished"]}>
          <Table
            getPopupContainer={(node) => node.closest(".ant-table")}
            onChange={handleTableChange}
            className='MeetingTable'
            column={columns}
            size='small'
            rows={publishedMeetingData}
            sticky={true}
            pagination={false}
            locale={{ emptyText: <EmptyTableComponent /> }}
            scroll={{ y: 400 }}
          />
        </Col>
        <Col>
          {publishedMeetingData.length > 0 && (
            <Col
              lg={12}
              md={12}
              sm={12}
              className={`${styles["Meeting_Pagination"]} d-flex justify-content-center`}>
              <Row className={styles["PaginationStyle-Meeting"]}>
                <Col
                  className='pagination-groups-table'
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
          )}
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
