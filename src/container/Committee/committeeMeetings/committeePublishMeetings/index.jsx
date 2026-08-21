import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Popover } from "antd";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

// Context hooks
import { useMeetingContext } from "@/context/MeetingContext";
import { useNewMeetingContext } from "@/context/NewMeetingContext";

// Components
import { Table } from "@/components/elements";
import CustomButton from "@/components/elements/button/Button";
import EmptyTableComponent from "@/container/meeting/commonComponents/EmptyTableComponent/EmptyTableComponent";

// Status helper
import { StatusValue } from "@/container/meeting/commonComponents/statusJson";

// Date formatters
import {
  utcConvertintoGMT,
  getCurrentDateTimeUTC,
  forRecentActivity,
} from "@/commen/functions/date_formater";

// Redux actions
import { boardDeckModal } from "@/store/actions/NewMeetingActions";
import { ViewMeeting } from "@/store/actions/Get_List_Of_Assignees";

import {
  setViewTab,
  toggleViewMeetingModal,
} from "@/store/actions/ModalStates_actions";

// Talk actions
import {
  GetAllUsers,
  GetAllUsersGroupsRoomsList,
  GetGroupMessages,
  GetAllUserChats,
} from "@/store/actions/Talk_action";
import {
  recentChatFlag,
  headerShowHideStatus,
  footerShowHideStatus,
  createShoutAllScreen,
  addNewChatScreen,
  footerActionStatus,
  createGroupScreen,
  activeChatBoxGS,
} from "@/store/actions/Talk_Feature_actions";

// Icons
import EditIcon from "@/assets/images/Edit-Icon.png";
import ChatIcon from "@/assets/images/New Meeting Listing Icons/Talk.png";
import AgendaIcon from "@/assets/images/New Meeting Listing Icons/ViewAgenda.png";
import ClipboardIcon from "@/assets/images/New Meeting Listing Icons/Attendance.png";
import DownloadVideoIcon from "@/assets/images/New Meeting Listing Icons/VideoRecording.png";
import ChevronDownIcon from "@/assets/images/dropdown-icon.png";
import SortIconAscend from "@/assets/images/sortingIcons/SorterIconAscend.png";
import SortIconDescend from "@/assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "@/assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "@/assets/images/sortingIcons/Arrow-up.png";
import DoubleArrowIcon from "@/assets/images/sortingIcons/Double Arrow2.svg";

import styles from "./committeePublishMeeting.module.css";

import { ChevronDown } from "react-bootstrap-icons";
import BoardDeckModal from "@/container/meeting/commonComponents/BoardDeck/BoardDeckModal/BoardDeckModal";
import BoardDeckSendEmail from "@/container/meeting/commonComponents/BoardDeck/BoardDeckSendEmail/BoardDeckSendEmail";
import ShareModalBoarddeck from "@/container/meeting/commonComponents/BoardDeck/ShareModalBoardDeck/ShareModalBoarddeck";
import DownloadOptionsModal from "@/container/meeting/commonComponents/DownloadMeetingTranscribeAndRecording/DownloadOptionsModal/DownloadOptionsModal";
import ShareViaDataRoomPathModal from "@/container/meeting/commonComponents/BoardDeck/ShareViaDataRoomPathModal/ShareViaDataRoomPathModal";
import MeetingRecording from "@/container/meeting/commonComponents/MeetingRecording/MeetingRecording";
import {
  joinMeetingApi,
  setCurrentMeetingInfo,
  UpdateMeetingStatusApi,
} from "@/store/actions/NewMeeting2.actions";
import { useCommitteeContext } from "../../../../context/CommitteeContext";
import { getViewMeetingByMeetingIdApi } from "../../../../store/actions/NewMeeting2.actions";
import CustomPagination from "../../../../commen/functions/customPagination/Paginations";
import { getMeetingByCommitteeIdApi } from "../../../../store/actions/Committee_actions";
import {
  buildEditorRole,
  buildVideoTalk,
  setMeetingLocalStorage,
} from "../../../meeting/commonComponents/helpers";
import { useMeetingListActions } from "../../../meeting/commonComponents/useMeetingListActions";
import {
  validateStringEmail_success,
  validateStringMeetingEmail_clear,
} from "../../../../store/actions/NewMeetingActions";

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
    str.substring(12, 14),
  );

const CommitteePublishedMeetingList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();

  const committeeMeetingView = localStorage.getItem(
    "committee_viewMeeting_action",
  );

  // ─── Redux selectors ──────────────────────────────────────────────────────

  const boardDeckModalData = useSelector(
    (s) => s.NewMeetingreducer.boardDeckModalData,
  );
  const boardDeckEmailModal = useSelector(
    (s) => s.NewMeetingreducer.boardDeckEmailModal,
  );
  const boarddeckShareModal = useSelector(
    (s) => s.NewMeetingreducer.boarddeckShareModal,
  );
  const shareViaDataRoomPathConfirmModal = useSelector(
    (s) => s.NewMeetingreducer.shareViaDataRoomPathConfirmation,
  );

  const validatencryptedstringState = useSelector(
    (state) => state.NewMeetingreducer.validatencryptedstring,
  );

  // ─── Context ──────────────────────────────────────────────────────────────

  const {
    editorRole,
    setEditorRole,
    setVideoTalk,
    setDownloadMeeting,
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
    committeePublishedMeetingData,
    committeePublishedMeetingDataRecord,

    currentPagePublishCommitteeMeeting,
    setCurrentPagePublishCommitteeMeeting,
    currentLengthPublishCommitteeMeeting,
    setCurrentLengthPublishCommitteeMeeting,
    loadCommitteeMeetings,
  } = useCommitteeContext();

  console.log(
    committeePublishedMeetingData,
    "committeePublishedMeetingDatacommitteePublishedMeetingData",
  );

  const { setIsQuickMeetingView } = useNewMeetingContext();

  // ─── Local state ──────────────────────────────────────────────────────────
  const [selectedValues, setSelectedValues] = useState(DEFAULT_STATUS_VALUES);

  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [organizerNameSort, setOrganizerNameSort] = useState(null);
  const [meetingTimeSort, setMeetingTimeSort] = useState(null);
  const [meetingDateSort, setMeetingDateSort] = useState(null);
  const [meetingTypeSort, setMeetingTypeSort] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isDownloadAvailable] = useState(false);
  const [downloadMeetingRecord] = useState(null);

  const {
    handleViewMeeting,
    handleJoinMeeting,
    handleEditMeeting,
    onClickDownloadIcon,
    handleClickDownloadBtn,
    handleClickViewMinutes,
    handleTableChange,
  } = useMeetingListActions({
    setMeetingTitle,
    setMeetingTitleSort,
    setOrganizerNameSort,
    setMeetingTimeSort,
    setMeetingDateSort,
  });

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
    [t],
  );

  useEffect(() => {
    if (!validatencryptedstringState) return;

    try {
      const {
        key,
        value: {
          attendeeId,
          meetingStatusId,
          isQuickMeeting,
          videoCallUrl,
          isVideo,
          talkGroupId,
          isChat,
          isMinutePublished,
          meetingTitle,
          standardMeetingType,
          commmitteeGroupID,
          userID,
          organizationID,
          meetingID,
        },
      } = validatencryptedstringState;

      if (
        key === "committee_viewMeeting_action" ||
        key === "committee_meetingStr_action" ||
        key === "committee_meetingUpd_action"
      ) {
        if (meetingStatusId === 10) {
          const role =
            Number(attendeeId) === 2
              ? "Participant"
              : Number(attendeeId) === 4
                ? "Agenda Contributor"
                : "Organizer";

          const meetingId = Number(meetingID);

          if (isQuickMeeting) {
            dispatch(
              joinMeetingApi(
                navigate,
                t,
                {
                  VideoCallURL: videoCallUrl,
                  FK_MDID: Number(meetingId),
                  DateTime: getCurrentDateTimeUTC(),
                },
                "JoinQuickMeetingFromListing",
                {
                  record: null,
                  setIsQuickMeetingView,
                },
              ),
            );

            dispatch(validateStringMeetingEmail_clear());

            return;
          } else {
            // Set state synchronously BEFORE dispatch — no stale closure issue
            localStorage.setItem("videoCallURL", videoCallUrl);
            setVideoTalk({
              isChat: isChat,
              isVideoCall: isVideo,
              talkGroupID: talkGroupId,
            });

            setEditorRole({
              status: meetingStatusId,
              role,
              isPrimaryOrganizer: false,
            });

            dispatch(
              joinMeetingApi(
                navigate,
                t,
                {
                  VideoCallURL: videoCallUrl,
                  FK_MDID: Number(meetingId),
                  DateTime: getCurrentDateTimeUTC(),
                },
                "CommitteeJoinMeetingFromListing",
                {
                  role,
                  isQuickMeeting: isQuickMeeting,
                  record: { isQuickMeeting, title: meetingTitle },
                },
              ),
            );
          }

          dispatch(validateStringMeetingEmail_clear());

          return;
        }
        // Quick Meeting
        if (isQuickMeeting) {
          dispatch(
            getViewMeetingByMeetingIdApi(
              navigate,
              t,
              { MeetingID: meetingID },
              "ViewQuickMeetingFromListing",
              { setIsQuickMeetingView },
            ),
          );
          dispatch(validateStringMeetingEmail_clear());

          return;
        } else {
          // Advanced Meeting
          const role =
            Number(attendeeId) === 2
              ? "Participant"
              : Number(attendeeId) === 4
                ? "Agenda Contributor"
                : "Organizer";

          setEditorRole({
            status: meetingStatusId,
            role,
            isPrimaryOrganizer: false,
          });
          dispatch(setViewTab("meetingDetails"));

          dispatch(
            setCurrentMeetingInfo({
              meetingID: meetingID,
              meetingTitle: meetingTitle,
              // mapFolderId: 0,
            }),
          );
          dispatch(toggleViewMeetingModal(true));
          dispatch(validateStringMeetingEmail_clear());

          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [validatencryptedstringState]);

  useEffect(() => {
    if (state !== null) {
      try {
        const meetingNotificationRouting = async () => {
          const { message = "", response = null } = state;

          let obj = {
            isQuickMeeting: response.isQuickMeeting,
            pK_MDID: response.MeetingID,
            isParticipant: response.attendeeRole === "Participant",
            isAgendaContributor: response.attendeeRole === "AgendaContributor",
            isOrganizer: response.attendeeRole === "Organizer",
            isPrimaryOrganizer: false,
            status: response.meetingStatusID,
            videoCallURL: response.videoCallUrl,
            isChat: response.isChat,
            isVideoCall: response.isVideoCall,
            talkGroupID: response.talkGroupID,
          };

          if (message === "proposedmeeting") {
            await loadCommitteeMeetings({
              PublishedMeetings: false,
              ProposedMeetings: true,
            });

            // setCurrentCommitteeMeetingTabActive(2);
          }
          if (message === "ViewMeeting") {
            await loadCommitteeMeetings({
              PublishedMeetings: true,
              ProposedMeetings: false,
            });

            handleViewMeeting(obj);
          }
          if (message === "JoinMeeting") {
            await loadCommitteeMeetings({
              PublishedMeetings: true,
              ProposedMeetings: false,
            });

            handleJoinMeeting(obj);
          }

          if (message === "MeetingPollCreated") {
            await loadCommitteeMeetings({
              PublishedMeetings: true,
              ProposedMeetings: false,
            });
            handleViewMeeting(obj, "polls");
          }

          if (message === "MeetingListing") {
            await loadCommitteeMeetings({
              PublishedMeetings: true,
              ProposedMeetings: false,
            });
          }
          navigate(pathname, {
            replace: true,
            state: null,
          });
        };
        meetingNotificationRouting();
      } catch (error) {}
    }
  }, [state]);

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
          t,
        ),
      ),
      dispatch(GetAllUsers(navigate, uid, orgId, t)),
      dispatch(GetAllUsersGroupsRoomsList(navigate, uid, orgId, t)),
    ]);
  };

  // ─── View Agenda ─────────────────────────────────────────────────────────
  const handleViewAgenda = async (record) => {
    try {
      const statusNum = Number(record.status);

      if (statusNum === STATUS.ACTIVE) {
        handleJoinMeeting(record);

        return;
      }

      if (record.isQuickMeeting) {
        await dispatch(
          getViewMeetingByMeetingIdApi(
            navigate,
            t,
            { MeetingID: record.pK_MDID },
            "ViewQuickMeetingFromListing",
            {
              setIsQuickMeetingView,
            },
          ),
        );
        return;
      }

      dispatch(
        setCurrentMeetingInfo({
          meetingID: record.pK_MDID,
        }),
      );
      dispatch(toggleViewMeetingModal(true));
      setEditorRole((prev) => ({
        ...prev,
        status: record.status,
        role: record.isParticipant
          ? "Participant"
          : record.isAgendaContributor
            ? "Agenda Contributor"
            : "Organizer",
        isPrimaryOrganizer: record.isPrimaryOrganizer,
      }));
    } catch (error) {}
  };

  // ─── Edit Meeting ─────────────────────────────────────────────────────────


  // ─── Other actions ────────────────────────────────────────────────────────

  const handleClickViewAgenda = (record) => {
    handleViewAgenda(record);
    setVideoTalk(buildVideoTalk(record));
    setEditorRole(buildEditorRole(record));
    // dispatch(emailRouteID(3));
    // dispatch(setViewTab("Agenda"));
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
        record.isChat &&
        record.talkGroupID !== 0,
      viewAgenda:
        (status === STATUS.ENDED ||
          status === STATUS.UPCOMING ||
          status === STATUS.ACTIVE) &&
        (isOrganizer || isAgendaContributor || isParticipant) &&
        !record.isQuickMeeting,
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
        setVideoTalk(buildVideoTalk(record));
        // dispatch(setViewTab("meetingDetails"));
        setMeetingLocalStorage(record);
        // localStorage.setItem("currentMeetingID", record.pK_MDID);
        setEditorRole({
          status: "10",
          role: "Organizer",
          isPrimaryOrganizer: record.isPrimaryOrganizer,
        });
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
              },
            ),
          );

          return;
        } else {
          dispatch(
            UpdateMeetingStatusApi(
              navigate,
              t,
              {
                MeetingID: Number(record.pK_MDID),
                StatusID: 10,
              },
              "startQuickMeetingFromMainListing",
              {
                record,
                setIsQuickMeetingView,
              },
            ),
          );
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
        handleViewMeeting(record, "meetingDetails");
        setVideoTalk(buildVideoTalk(record));
        setEditorRole(buildEditorRole(record));
        setMeetingLocalStorage(record);
        dispatch(
          setCurrentMeetingInfo({
            meetingID: record.pK_MDID,
          }),
        );
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
              handleViewMeeting(record, "meetingDetails");
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
            <span className={styles.columnValue}>
              {`${moment(start).format("hh:mm a")} - ${moment(end).format(
                "hh:mm a",
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
              parseDateTime(record.dateOfMeeting + record.meetingStartTime),
            ).format("Do MMM, YYYY")}
          </span>
        ),
      },

      // ── Meeting Type ──
      {
        title: (
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <span>{t("Type")}</span>
            {/* <img
              src={
                meetingTypeSort === null
                  ? DoubleArrowIcon
                  : meetingTypeSort === "ascend"
                    ? ArrowDownIcon
                    : ArrowUpIcon
              }
              alt='Meeting type Sort Icon'
            /> */}
          </div>
        ),
        dataIndex: "type",
        key: "type",
        width: 125,
        align: "center",
        ellipsis: true,
        render: (text, record) => {
          if (record.isQuickMeeting) {
            return (
              <span className={styles.columnValue}>{t("Quick-meeting")}</span>
            );
          }
          return (
            <span className={styles.columnValue}>{t("Advance-meeting")}</span>
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
            dateOfMeeting + meetingStartTime,
          );
          const minutesDifference = Math.floor(
            (meetingDateObj - currentDateObj) / (1000 * 60),
          );
          const meetingCurrentStatus = Number(status);
          const isButtonShown = startMeetingButton.find(
            (btn) => Number(btn.meetingID) === Number(pK_MDID),
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
                        canStartMeeting ? "START_MEETING" : "EDIT_MEETING",
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

  const handleChangePaginationPublishedMeeting = (currentPage, pageSize) => {
    setCurrentPagePublishCommitteeMeeting(currentPage);
    setCurrentLengthPublishCommitteeMeeting(pageSize);
    dispatch(
      getMeetingByCommitteeIdApi(navigate, t, {
        CommitteeID: Number(localStorage.getItem("ViewCommitteeID")),
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber: Number(currentPage),
        Length: Number(pageSize),
        PublishedMeetings: true,
        ProposedMeetings: false,
      }),
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div className='position-relative'>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className={styles["MainMeetingTablePublished"]}>
            <Table
              onChange={handleTableChange}
              className='MeetingTable'
              column={columns}
              size='small'
              rows={committeePublishedMeetingData}
              sticky={true}
              pagination={false}
              locale={{ emptyText: <EmptyTableComponent /> }}
              scroll={{
                y: 350,
              }}
            />
          </Col>
          {committeePublishedMeetingData.length > 0 && (
            <Col className={styles["Meeting_Publish_Pagination"]}>
              <div className='d-flex justify-content-center mt-2 '>
                <Row className={styles["PaginationStyle-Meeting"]}>
                  <Col
                    className={"pagination-groups-table"}
                    sm={12}
                    md={12}
                    lg={12}>
                    <CustomPagination
                      current={currentPagePublishCommitteeMeeting}
                      showSizer={true}
                      onChange={handleChangePaginationPublishedMeeting}
                      pageSizeOptionsValues={["30", "50", "100"]}
                      total={committeePublishedMeetingDataRecord}
                      pageSize={currentLengthPublishCommitteeMeeting}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          )}
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
        {downloadVideoRecordingModal && (
          <MeetingRecording title={meetingTitle} />
        )}
      </div>
    </>
  );
};

export default CommitteePublishedMeetingList;
