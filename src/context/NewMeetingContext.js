import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mqttMeetingData } from "../hooks/meetingResponse/response";
import { useTranslation } from "react-i18next";

/**
 * @context NewMeetingContext
 * @description Provides state management for the meetings listing and creation
 * flow. Handles paginated meeting records (synced with Redux search results and
 * real-time MQTT reminder notifications), filter state (status, meeting type,
 * date, title, host), loading indicators, and creation-mode flags for quick,
 * advanced, and proposed meetings.
 */
export const NewMeetingContext = createContext();

export const NewMeetingProvider = ({ children }) => {
  const { t } = useTranslation();
  const userID = localStorage.getItem("userID");

  // ============================================================
  // ---------------------- STATE ---------------------------------
  // ============================================================

  const [requestData, setRequestData] = useState({
    Date: "",
    Title: "",
    HostName: "",
    UserID: Number(userID),
    PageNumber: 1,
    Length: 30,
    PublishedMeetings:
      localStorage.getItem("MeetingCurrentView") &&
      Number(localStorage.getItem("MeetingCurrentView")) === 1,
    ProposedMeetings:
      localStorage.getItem("MeetingCurrentView") &&
      Number(localStorage.getItem("MeetingCurrentView")) === 2,
  });

  // --- Basic Meeting Information ---
  const [createdMeetingInfo, setCreatedMeetingInfo] = useState({
    meetingId: 0,
    meetingMapFolderId: 0,
    meetingTitle: "",
  });
  const [meetingMapFolderId, setMeetingMapFolderId] = useState(0);

  const [currentTab, setCurrentTab] = useState("1");

  // --- UI Visibility States ---
  const [isCreateEditMeeting, setIsCreateEditMeeting] = useState(false);
  // For Meeting we set value 1 and for edit meeting we will set 2
  const [isMeetingCreateOrEdit, setIsMeetingCreateOrEdit] = useState(1);
  const [isViewMeeting, setIsViewMeeting] = useState(false);
  const [isQuickMeetingCreate, setIsQuickMeetingCreate] = useState(false);
  const [isQuickMeetingUpdate, setIsQuickMeetingUpdate] = useState(false);
  const [isQuickMeetingView, setIsQuickMeetingView] = useState(false);

  // --- Categorized Meeting Data ---
  const [publishedMeetingData, setPublishedMeetingData] = useState([]);
  const [publishedMeetingDataRecord, setPublishedMeetingDataRecord] =
    useState(0);

  const [proposedMeetingData, setProposedMeetingData] = useState([]);
  const [proposedMeetingDataRecord, setProposedMeetingDataRecord] = useState(0);

  const [draftMeetingData, setDraftMeetingData] = useState([]);
  const [draftMeetingDataRecord, setDraftMeetingDataRecord] = useState(0);

  // --- Local Filtering and Data Management ---
  const [isMeetingTypeFilter, setMeetingTypeFilter] = useState([]);
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [startMeetingButton, setStartMeetingButton] = useState([]);

  const [responseByDate, setResponseByDate] = useState(false);

  // --- Search Filters ---
  const [searchFilters, setSearchFilters] = useState({
    Date: "",
    Title: "",
    HostName: "",
  });

  // --- Active Filter Selections ---
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([
    "10",
    "1",
    "9",
    "8",
    "4",
  ]);
  const [selectedMeetingTypeFilters, setSelectedMeetingTypeFilters] = useState([
    "1",
    "2",
    "3",
  ]);

  // --- UI State ---
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================
  // ---------------------- REDUX SELECTORS -----------------------
  // ============================================================

  const meetingReminderNotification = useSelector(
    (state) => state.NewMeetingreducer.meetingReminderNotification,
  );
  const meetingStatusPublishedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData,
  );
  const MeetingStatusSocket = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusSocket,
  );
  const MeetingStatusEnded = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusEnded,
  );
  const allMeetingsSocketData = useSelector(
    (state) => state.meetingIdReducer.allMeetingsSocketData,
  );
  const CommitteeMeetingMQTT = useSelector(
    (state) => state.meetingIdReducer.CommitteeMeetingMQTT,
  );
  const GroupMeetingMQTT = useSelector(
    (state) => state.meetingIdReducer.GroupMeetingMQTT,
  );
  const mqtMeetingPrRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqtMeetingPrRemoved,
  );
  const mqttMeetingPrAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingPrAdded,
  );
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings,
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes,
  );

  // ============================================================
  // ---------------------- HELPERS -------------------------------
  // ============================================================

  /**
   * Returns the active list + its setter based on the currently selected
   * MeetingCurrentView in localStorage. Falls back to published.
   */
  const getActiveMeetingListAndSetter = () => {
    const view = Number(localStorage.getItem("MeetingCurrentView"));
    switch (view) {
      case 2:
        return {
          list: proposedMeetingData,
          setList: setProposedMeetingData,
        };
      case 3:
        return {
          list: draftMeetingData,
          setList: setDraftMeetingData,
        };
      case 1:
      default:
        return {
          list: publishedMeetingData,
          setList: setPublishedMeetingData,
        };
    }
  };

  /**
   * Generic updater that updates a meeting in ALL three lists if it exists
   * in any of them. Useful when an MQTT/socket payload doesn't tell us which
   * tab/list the meeting belongs to.
   *
   * @param {number|string} meetingID
   * @param {Function} updateFn  (existingMeeting) => updatedMeeting
   */
  const updateMeetingInAllLists = (meetingID, updateFn) => {
    const id = Number(meetingID);

    const mapper = (item) =>
      Number(item.pK_MDID) === id ? updateFn(item) : item;

    setPublishedMeetingData((prev) => prev.map(mapper));
    setProposedMeetingData((prev) => prev.map(mapper));
    setDraftMeetingData((prev) => prev.map(mapper));
  };

  /**
   * Removes a meeting from all three lists.
   */
  const removeMeetingFromAllLists = (meetingID) => {
    const id = Number(meetingID);
    const filterFn = (item) => Number(item.pK_MDID) !== id;

    setPublishedMeetingData((prev) => prev.filter(filterFn));
    setProposedMeetingData((prev) => prev.filter(filterFn));
    setDraftMeetingData((prev) => prev.filter(filterFn));
  };

  // ============================================================
  // ---------------------- EFFECTS -------------------------------
  // ============================================================

  /**
   * Real-time meeting status updates coming from Redux notifications.
   * Updates the matching meeting's status across all lists and tracks
   * "Start Meeting" button visibility when the meeting becomes active.
   */
  useEffect(() => {
    if (meetingReminderNotification == null) return;

    try {
      const meetingData = meetingReminderNotification.meetingDetails;
      if (!meetingData?.pK_MDID) return;

      updateMeetingInAllLists(meetingData.pK_MDID, (item) => ({
        ...item,
        status: String(meetingData.statusID),
      }));

      // If meeting has started (status 1), enable the "Start Meeting" button for it
      if (meetingData.statusID === 1) {
        setStartMeetingButton((prev) => {
          // Avoid duplicates
          const exists = prev.some(
            (b) => Number(b.meetingID) === Number(meetingData.pK_MDID),
          );
          if (exists) return prev;
          return [
            ...prev,
            { meetingID: Number(meetingData.pK_MDID), showButton: true },
          ];
        });
      }
    } catch (error) {
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingReminderNotification]);

  /**
   * Handles MQTT payloads for newly published meetings. If the meeting
   * already exists in the active list, replace it; otherwise prepend it.
   */
  useEffect(() => {
    if (meetingStatusPublishedMqttData == null) return;

    const callMQTT = async () => {
      try {
        const meetingData = meetingStatusPublishedMqttData;
        const newMeetingData = await mqttMeetingData(meetingData, 1);
        const { list, setList } = getActiveMeetingListAndSetter();

        const indexToUpdate = list.findIndex(
          (obj) => Number(obj.pK_MDID) === Number(meetingData.pK_MDID),
        );

        if (indexToUpdate !== -1) {
          const updated = [...list];
          updated[indexToUpdate] = newMeetingData;
          setList(updated);
        } else {
          setList([newMeetingData, ...list]);
        }
      } catch (error) {
        
      }
    };

    callMQTT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingStatusPublishedMqttData]);

  /**
   * Listens for status-edit socket messages: "started" or "cancelled" variants.
   * Updates the meeting status across all lists and clears the start-button
   * tracking entry for that meeting.
   */
  useEffect(() => {
    if (MeetingStatusSocket == null) return;

    try {
      const messageLower = (MeetingStatusSocket.message || "").toLowerCase();
      const isStartedEdit = messageLower.includes(
        "meeting_status_edited_started",
      );
      const isCancelledEdit = messageLower.includes(
        "meeting_status_edited_cancelled",
      );

      if (!isStartedEdit && !isCancelledEdit) return;

      // Resolve status + ID — schema differs by event variant
      let meetingStatusID;
      let meetingID;

      if (
        Object.prototype.hasOwnProperty.call(MeetingStatusSocket, "meeting")
      ) {
        meetingStatusID = MeetingStatusSocket.meeting.status;
        meetingID = MeetingStatusSocket.meeting.pK_MDID;
      } else {
        meetingStatusID = MeetingStatusSocket.meetingStatusID;
        meetingID = MeetingStatusSocket.meetingID;
      }

      if (meetingID == null) return;

      updateMeetingInAllLists(meetingID, (item) => ({
        ...item,
        status: String(meetingStatusID),
      }));

      setStartMeetingButton((prev) =>
        prev.filter((btn) => Number(btn.meetingID) !== Number(meetingID)),
      );
    } catch (error) {
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MeetingStatusSocket]);

  /**
   * Handles "meeting ended" MQTT events. Replaces the meeting in all lists
   * with the latest payload and clears any start-button entry.
   */
  useEffect(() => {
    if (MeetingStatusEnded == null) return;

    try {
      const endMeetingData = MeetingStatusEnded.meeting;
      if (!endMeetingData?.pK_MDID) return;

      updateMeetingInAllLists(
        endMeetingData.pK_MDID,
        () => endMeetingData, // full replacement
      );

      setStartMeetingButton((prev) =>
        prev.filter(
          (btn) => Number(btn.meetingID) !== Number(endMeetingData.pK_MDID),
        ),
      );
    } catch (error) {
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MeetingStatusEnded]);

  /**
   * Generic "all meetings" socket stream. Replaces or prepends in the active
   * list depending on whether the meeting already exists.
   */
  useEffect(() => {
    if (allMeetingsSocketData == null) return;

    const updateMeeting = async () => {
      try {
        const meetingID = allMeetingsSocketData.pK_MDID;
        const newMeetingData = await mqttMeetingData(allMeetingsSocketData, 1);
        const { list, setList } = getActiveMeetingListAndSetter();

        const exists = list.some(
          (m) => Number(m.pK_MDID) === Number(meetingID),
        );

        if (exists) {
          setList(
            list.map((item) =>
              Number(item.pK_MDID) === Number(meetingID)
                ? newMeetingData
                : item,
            ),
          );
        } else {
          setList([newMeetingData, ...list]);
        }
      } catch (error) {
        
      }
    };

    updateMeeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMeetingsSocketData]);

  /**
   * Committee meeting MQTT updates — replaces the matching meeting across
   * all lists with the freshly received payload.
   */
  useEffect(() => {
    if (CommitteeMeetingMQTT === null) return;

    try {
      const meetingData = CommitteeMeetingMQTT.meeting;
      if (!meetingData?.pK_MDID) return;

      updateMeetingInAllLists(meetingData.pK_MDID, () => meetingData);
    } catch (error) {
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CommitteeMeetingMQTT]);

  /**
   * Group meeting MQTT updates — same shape as committee, replaces across
   * all lists.
   */
  useEffect(() => {
    if (GroupMeetingMQTT == null) return;

    try {
      const meetingData = GroupMeetingMQTT.meeting;
      if (!meetingData?.pK_MDID) return;

      updateMeetingInAllLists(meetingData.pK_MDID, () => meetingData);
    } catch (error) {
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GroupMeetingMQTT]);

  /**
   * When navigated here from the Calendar with `CalendaradvanceMeeting`
   * state, locate the corresponding meeting in the published list using
   * the cached currentMeetingID.
   */

  /**
   * Handles participant added / removed MQTT events. On "added", builds a
   * normalized meeting object and prepends it to the active list. On
   * "removed", filters the meeting out of all lists.
   */
  useEffect(() => {
    // ---- Participant ADDED ----
    if (mqttMeetingPrAdded != null) {
      try {
        const meetingData = mqttMeetingPrAdded;
        const newData = {
          dateOfMeeting: meetingData?.dateOfMeeting,
          host: meetingData?.host,
          isAttachment: false,
          isChat: false,
          isVideoCall: false,
          videoCallURL: meetingData?.videoCallURL,
          isQuickMeeting: meetingData?.isQuickMeeting,
          meetingAgenda: [],
          isOrganizer: meetingData?.attendeeRoleID === 1,
          isAgendaContributor: meetingData?.attendeeRoleID === 4,
          isParticipant: meetingData?.attendeeRoleID === 2,
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

        const { list, setList } = getActiveMeetingListAndSetter();
        setList([newData, ...list]);
      } catch (error) {
        
      }
    }

    // ---- Participant REMOVED ----
    if (mqtMeetingPrRemoved != null) {
      try {
        const meetingID = mqtMeetingPrRemoved.meetingID;
        if (meetingID != null) {
          removeMeetingFromAllLists(meetingID);
        }
      } catch (error) {
        
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mqttMeetingPrAdded, mqtMeetingPrRemoved]);

  /**
   * Synchronizes meeting search results from Redux into the right
   * categorized list (published/draft/proposed) based on the current view.
   * Also filters agendas by `canView` permission for the published view.
   */
  useEffect(() => {
    try {
      if (searchMeetings == null) {
        setPublishedMeetingData([]);
        setDraftMeetingData([]);
        setProposedMeetingData([]);
        return;
      }

      const view = Number(localStorage.getItem("MeetingCurrentView"));
      const meetings = searchMeetings.meetings || [];

      switch (view) {
        case 1: {
          // Published Meetings
          setPublishedMeetingDataRecord(searchMeetings.totalRecords || 0);
          setMinutesAgo(searchMeetings.meetingStartedMinuteAgo || 0);

          if (meetings.length > 0) {
            // Keep only agendas the current user is allowed to view
            const filtered = meetings.map((meeting) => ({
              ...meeting,
              meetingAgenda: (meeting.meetingAgenda || []).filter(
                (agenda) => agenda.objMeetingAgenda?.canView === true,
              ),
            }));
            setPublishedMeetingData(filtered);
          } else {
            setPublishedMeetingData([]);
          }
          break;
        }

        case 2: {
          // Proposed Meetings
          setProposedMeetingDataRecord(searchMeetings.totalRecords || 0);
          setMinutesAgo(searchMeetings.meetingStartedMinuteAgo || 0);
          setProposedMeetingData(meetings);
          break;
        }

        case 3: {
          // Draft Meetings
          setDraftMeetingDataRecord(searchMeetings.totalRecords || 0);
          setMinutesAgo(searchMeetings.meetingStartedMinuteAgo || 0);
          setDraftMeetingData(meetings);
          break;
        }

        default:
          break;
      }
    } catch (error) {
      
      setPublishedMeetingData([]);
      setDraftMeetingData([]);
      setProposedMeetingData([]);
      setPublishedMeetingDataRecord(0);
      setDraftMeetingDataRecord(0);
      setProposedMeetingDataRecord(0);
    }
  }, [searchMeetings, getALlMeetingTypes]);

  /**
   * Transforms the meeting types from Redux into the dropdown/filter shape
   * `{ text, value }`, prepending a default "Quick-meeting" option.
   */
  useEffect(() => {
    try {
      const types = getALlMeetingTypes?.meetingTypes;
      if (types === null) return;

      const meetingtypeFilter = [
        { value: "0", text: t("Quick-meeting") },
        ...types.map((data) => ({
          text: data.type,
          value: String(data.pK_MTID),
        })),
      ];

      setMeetingTypeFilter(meetingtypeFilter);
    } catch (error) {
      
    }
  }, [getALlMeetingTypes?.meetingTypes, t]);

  // ============================================================
  // ---------------------- CONTEXT VALUE -------------------------
  // ============================================================

  const statesData = {
    // Filters
    searchFilters,
    setSearchFilters,
    selectedStatusFilters,
    setSelectedStatusFilters,
    selectedMeetingTypeFilters,
    setSelectedMeetingTypeFilters,
    isMeetingTypeFilter,

    // Loading + meta
    isLoading,
    setIsLoading,
    minutesAgo,
    startMeetingButton,
    setStartMeetingButton,

    // Folder + created info
    meetingMapFolderId,
    setMeetingMapFolderId,
    createdMeetingInfo,
    setCreatedMeetingInfo,

    // Tabs
    currentTab,
    setCurrentTab,

    // Published
    publishedMeetingData,
    setPublishedMeetingData,
    publishedMeetingDataRecord,
    setPublishedMeetingDataRecord,

    // Proposed
    proposedMeetingData,
    setProposedMeetingData,
    proposedMeetingDataRecord,
    setProposedMeetingDataRecord,

    // Draft
    draftMeetingData,
    setDraftMeetingData,
    draftMeetingDataRecord,
    setDraftMeetingDataRecord,

    // UI flags
    isCreateEditMeeting,
    setIsCreateEditMeeting,
    isViewMeeting,
    setIsViewMeeting,
    isQuickMeetingCreate,
    setIsQuickMeetingCreate,
    isQuickMeetingUpdate,
    setIsQuickMeetingUpdate,
    isQuickMeetingView,
    setIsQuickMeetingView,
    isMeetingCreateOrEdit,
    setIsMeetingCreateOrEdit,
    responseByDate,
    setResponseByDate,
    // Request payload
    requestData,
    setRequestData,
  };

  return (
    <NewMeetingContext.Provider value={statesData}>
      {children}
    </NewMeetingContext.Provider>
  );
};

/**
 * @hook useNewMeetingContext
 * @description Consumes NewMeetingContext and returns all meeting listing and
 *   creation state values and setters. Throws if used outside NewMeetingProvider.
 */
export const useNewMeetingContext = () => {
  const context = useContext(NewMeetingContext);
  if (!context) {
    throw new Error(
      "useNewMeetingContext must be used within a NewMeetingProvider",
    );
  }
  return context;
};
