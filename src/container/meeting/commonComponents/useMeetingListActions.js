import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeetingContext } from "../../../context/MeetingContext";
import { useNewMeetingContext } from "../../../context/NewMeetingContext";
import { getCurrentDateTimeUTC } from "../../../commen/functions/date_formater";
import {
  getMeetingDetailsByMeetingIdApi,
  getViewMeetingByMeetingIdApi,
  joinMeetingApi,
  setCurrentMeetingInfo,
  UpdateMeetingStatusApi,
} from "../../../store/actions/NewMeeting2.actions";
import {
  setViewTab,
  toggleViewMeetingModal,
} from "../../../store/actions/ModalStates_actions";
import {
  emailRouteID,
  getMeetingRecordingFilesApi,
} from "../../../store/actions/NewMeetingActions";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import {
  buildEditorRole,
  buildVideoTalk,
  setMeetingLocalStorage,
} from "./helpers";
import { MEETING_STATUS } from "./meeting.constants";

const STATUS_ACTIVE = 10;

const getAttendeeRole = (record) =>
  record.isAgendaContributor
    ? "Agenda Contributor"
    : record.isParticipant
      ? "Participant"
      : "Organizer";

// Shared by Committee/Group/Board published-meeting listings and the Board
// notification-routing effect — was previously copy-pasted 4x with drifting
// behavior (missing ACTIVE-status shortcut in one copy, a join payload key
// the reducer never read in two others). See "JoinMeetingFromListing" in
// NewMeeting2.actions.js for what the join payload actually consumes.
export const useMeetingListActions = ({
  setMeetingTitle,
  setMeetingTitleSort,
  setOrganizerNameSort,
  setMeetingTimeSort,
  setMeetingDateSort,
} = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setEditorRole, setVideoTalk, setDownloadVideoRecordingModal } =
    useMeetingContext();
  const { setIsQuickMeetingView, setIsQuickMeetingUpdate } =
    useNewMeetingContext();

  const handleJoinMeeting = async (record, activeTab = "agendaViewer") => {
    const role = getAttendeeRole(record);
    const meetingId = Number(record.pK_MDID);

    if (record.isQuickMeeting) {
      dispatch(
        joinMeetingApi(
          navigate,
          t,
          {
            VideoCallURL: record.videoCallURL,
            FK_MDID: meetingId,
            DateTime: getCurrentDateTimeUTC(),
          },
          "JoinQuickMeetingFromListing",
          { record, setIsQuickMeetingView },
        ),
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
          FK_MDID: meetingId,
          DateTime: getCurrentDateTimeUTC(),
        },
        "JoinMeetingFromListing",
        { role, record, setIsQuickMeetingView, activeTab },
      ),
    );
  };

  const handleViewMeeting = async (record, viewer = "meetingDetails") => {
    try {
      let tabActive = viewer === "polls" ? "polls" : "agendaViewer";
      if (Number(record.status) === STATUS_ACTIVE) {
        handleJoinMeeting(record, tabActive);
        return;
      }

      if (record.isQuickMeeting) {
        await dispatch(
          getViewMeetingByMeetingIdApi(
            navigate,
            t,
            { MeetingID: record.pK_MDID },
            "ViewQuickMeetingFromListing",
            { setIsQuickMeetingView },
          ),
        );
        return;
      }

      dispatch(setCurrentMeetingInfo({ meetingID: record.pK_MDID }));
      dispatch(toggleViewMeetingModal(true));
      dispatch(setViewTab(viewer));
      setEditorRole((prev) => ({
        ...prev,
        status: record.status,
        role: getAttendeeRole(record),
        isPrimaryOrganizer: record.isPrimaryOrganizer,
      }));
    } catch (error) {}
  };

  const handleStartMeeting = async (record) => {
    const meetingId = Number(record.pK_MDID);
    const startRequest = {
      MeetingID: meetingId,
      StatusID: MEETING_STATUS.ACTIVE,
    };

    if (!record.isQuickMeeting) {
      dispatch(
        UpdateMeetingStatusApi(
          navigate,
          t,
          startRequest,
          "startMeetingFromMainListing",
          { record },
        ),
      );

      setVideoTalk(buildVideoTalk(record));
      setMeetingLocalStorage(record);
      setEditorRole({
        status: String(MEETING_STATUS.ACTIVE),
        role: "Organizer",
        isPrimaryOrganizer: record.isPrimaryOrganizer,
      });
      return;
    }

    dispatch(
      UpdateMeetingStatusApi(
        navigate,
        t,
        startRequest,
        "startQuickMeetingFromMainListing",
        { record, setIsQuickMeetingView },
      ),
    );
  };

  const onClickDownloadIcon = (meetingID) => {
    dispatch(
      downloadAttendanceReportApi(navigate, t, {
        MeetingID: Number(meetingID),
      }),
    );
  };

  const handleClickDownloadBtn = (record) => {
    setMeetingTitle(record.meetingTitle);
    dispatch(
      getMeetingRecordingFilesApi(
        navigate,
        t,
        { MeetingID: record?.pK_MDID },
        setDownloadVideoRecordingModal,
      ),
    );
  };

  const handleClickViewMinutes = (record) => {
    setEditorRole(buildEditorRole(record));
    setVideoTalk(buildVideoTalk(record));
    dispatch(emailRouteID(5));
    dispatch(setViewTab("minutes"));
    localStorage.setItem("isMinutePublished", record.isMinutePublished);
  };

  const handleEditMeeting = async (record) => {
    const role = record.isAgendaContributor
      ? "Agenda Contributor"
      : "Organizer";
    const meetingId = Number(record.pK_MDID);
    const context = "EditMeetingFromMainListing";

    if (record.isQuickMeeting) {
      await dispatch(
        getViewMeetingByMeetingIdApi(
          navigate,
          t,
          { MeetingID: meetingId },
          "EditQuickMeetingFromMainListing",
          { setIsQuickMeetingUpdate },
        ),
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

    await dispatch(
      getMeetingDetailsByMeetingIdApi(
        navigate,
        t,
        { MeetingID: meetingId },
        context,
        { role, callFunc: () => {} },
      ),
    );
  };

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

  return {
    handleViewMeeting,
    handleJoinMeeting,
    handleStartMeeting,
    handleEditMeeting,
    onClickDownloadIcon,
    handleClickDownloadBtn,
    handleClickViewMinutes,
    handleTableChange,
  };
};
