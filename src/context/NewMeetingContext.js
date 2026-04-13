import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { mqttMeetingData } from "../hooks/meetingResponse/response";
import { useTranslation } from "react-i18next";

/**
 * @context NewMeetingContext
 * @description Provides state management for the meetings listing and creation
 * flow. Handles paginated meeting records (synced with Redux search results and
 * real-time MQTT reminder notifications), filter state (status, meeting type,
 * date, title, host), loading indicators, and creation-mode flags for quick,
 * advanced, and proposed meetings.
 *
 * @provides {Array}    meetingsRecords               - Paginated list of meeting records currently displayed
 * @provides {number}   totalMeetingRecords           - Total count of meetings matching the current filters
 * @provides {Object}   searchFilters                 - Active search payload ({ Date, Title, HostName, PageNumber, Length })
 * @provides {Array<string>} selectedStatusFilters    - Array of active meeting status IDs for filtering
 * @provides {Array<string>} selectedMeetingTypeFilters - Array of active meeting type IDs for filtering
 * @provides {Array}    isMeetingTypeFilter           - Formatted meeting-type options for the filter dropdown
 * @provides {boolean}  isPublishedMeeting            - Whether the "published" meetings tab is active
 * @provides {boolean}  isDraftMeetings               - Whether the "draft" meetings tab is active
 * @provides {boolean}  isProposedMeeting             - Whether the "proposed" meetings tab is active
 * @provides {boolean}  isLoading                     - Whether a meeting list API call is in progress
 * @provides {number}   minutesAgo                    - Minutes since the earliest active meeting started
 * @provides {Array}    startMeetingButton            - Per-meeting start-button visibility flags
 * @provides {boolean}  quickMeeting                  - Whether the quick-meeting creation form is open
 * @provides {boolean}  proposedNewMeeting            - Whether the proposed-meeting creation form is open
 * @provides {boolean}  isAdvanceMeetingCreate        - Whether the advanced meeting creation flow is active
 * @provides {boolean}  isProposedMeetingCreate       - Whether the proposed meeting creation flow is active
 * @provides {number}   meetingMapFolderId            - Dataroom folder ID mapped to the current meeting
 * @provides {Object}   createdMeetingInfo            - ID and title of the most recently created meeting
 * @provides {Array}    duplicatedMeetingData         - Meeting data staged for duplication
 *
 * Usage:
 *   import { useNewMeetingContext } from '../context/NewMeetingContext';
 *   const { meetingsRecords, searchFilters, setSearchFilters } = useNewMeetingContext();
 */

/**
 * Context for managing meeting-related states across the application.
 * This context handles meeting creation, editing, viewing, and status synchronization.
 */
export const NewMeetingContext = createContext();

// Provider component that wraps the parts of the app that need access to meeting states
export const NewMeetingProvider = ({ children }) => {
  let userID = localStorage.getItem("userID");
  const [requestData, setRequestData] = useState({
    Date: "",
    Title: "",
    HostName: "",
    UserID: Number(userID),
    PageNumber: 1,
    Length: 30,
    PublishedMeetings:
      localStorage.getItem("MeetingCurrentView") &&
      Number(localStorage.getItem("MeetingCurrentView")) === 1
        ? true
        : false,
    ProposedMeetings:
      localStorage.getItem("MeetingCurrentView") &&
      Number(localStorage.getItem("MeetingCurrentView")) === 2
        ? true
        : false,
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

  // --- Published Meeting Tracking ---
  const [publishedMeetingData, setPublishedMeetingData] = useState([]);
  const [publishedMeetingDataRecord, setPublishedMeetingDataRecord] =
    useState(0);

  // --- Categorized Meeting Data ---
  const [proposedMeetingData, setProposedMeetingData] = useState([]);
  const [proposedMeetingDataRecord, setProposedMeetingDataRecord] = useState(0);

  // --- Draft Meeting Data ---
  const [draftMeetingData, setDraftMeetingData] = useState([]);
  const [draftMeetingDataRecord, setDraftMeetingDataRecord] = useState(0);

  // --- Redux Selectors for Global State ---
  const meetingReminderNotification = useSelector(
    (state) => state.NewMeetingreducer.meetingReminderNotification,
  );
  const meetingStatusPublishedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData,
  );
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings,
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes,
  );

  // --- Local Filtering and Data Management ---
  const [isMeetingTypeFilter, setMeetingTypeFilter] = useState([]);

  const [minutesAgo, setMinutesAgo] = useState(0);
  const [startMeetingButton, setStartMeetingButton] = useState([]);

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

  /**
   * Effect to handle real-time meeting status updates coming from Redux (notifications).
   * It finds the meeting in the current list and updates its status.
   */
  useEffect(() => {
    if (meetingReminderNotification !== null) {
      try {
        const meetingData = meetingReminderNotification.meetingDetails;
        console.log(meetingData, "meetingDetailsmeetingDetails");
        setPublishedMeetingData((rowsData) => {
          // Find the index of the row that matches the ID
          const rowIndex = rowsData.findIndex(
            (rowData) => rowData.pK_MDID === meetingData.pK_MDID,
          );
          console.log(rowIndex, "rowIndexrowIndex");
          // If a matching row is found, create a new array with the updated row
          if (rowIndex !== -1) {
            const updatedRowsData = [...rowsData];

            // Update status string
            updatedRowsData[rowIndex] = {
              ...updatedRowsData[rowIndex],
              status: String(meetingData.statusID),
            };
            // If meeting has started (status 1), track it for showing the 'Start Meeting' button
            if (meetingData.statusID === 1) {
              setStartMeetingButton([
                ...startMeetingButton,
                { meetingID: Number(meetingData.pK_MDID), showButton: true },
              ]);
              // setStartMeetingData({
              //   ...startMeetingData,
              //   meetingID: Number(meetingData.pK_MDID),
              //   showButton: true,
              // });
            } else {
              // setStartMeetingData({
              //   ...startMeetingData,
              //   meetingID: null,
              //   showButton: false,
              // });
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

  /**
   * Effect to synchronize meeting searches and types from Redux.
   * Also handles filtering of agenda items based on user visibility permissions.
   */
  useEffect(() => {
    try {
      if (
        searchMeetings !== null &&
        searchMeetings !== undefined &&
        getALlMeetingTypes?.meetingTypes
      ) {
        try {
          switch (Number(localStorage.getItem("MeetingCurrentView"))) {
            case 1:
              // PublishMeeting
              setPublishedMeetingDataRecord(searchMeetings.totalRecords);
              setMinutesAgo(searchMeetings.meetingStartedMinuteAgo);
              if (Object.keys(searchMeetings.meetings).length > 0) {
                // Filter agendas based on canView permission
                let copyMeetingData = searchMeetings.meetings.map(
                  (meeting) => ({
                    ...meeting,
                    meetingAgenda: meeting.meetingAgenda.filter(
                      (agenda) => agenda.objMeetingAgenda.canView,
                    ),
                  }),
                );
                // Redundant check for canView to ensure deep filtering
                copyMeetingData.forEach((data) => {
                  data.meetingAgenda = data.meetingAgenda.filter((agenda) => {
                    return agenda.objMeetingAgenda.canView === true;
                  });
                });
                console.log("handleViewMeeting", copyMeetingData);
                setPublishedMeetingData(copyMeetingData);
              }
              break;
            case 3:
              // DraftMeeting
              setDraftMeetingDataRecord(searchMeetings.totalRecords);
              setMinutesAgo(searchMeetings.meetingStartedMinuteAgo);
              if (Object.keys(searchMeetings.meetings).length > 0) {
                setDraftMeetingData(searchMeetings.meetings);
              }
              break;
            case 2:
              // ProposedMeeting
              setProposedMeetingDataRecord(searchMeetings.totalRecords);
              setMinutesAgo(searchMeetings.meetingStartedMinuteAgo);
              if (Object.keys(searchMeetings.meetings).length > 0) {
                setProposedMeetingData(searchMeetings.meetings);
              }
              break;
            default:
          }
        } catch (error) {
          console.log(error);
          setPublishedMeetingData([]);
          setDraftMeetingData([]);
          setProposedMeetingData([]);
          setPublishedMeetingDataRecord(0);
          setDraftMeetingDataRecord(0);
          setProposedMeetingDataRecord(0);
        }
      } else {
        setPublishedMeetingData([]);
        setDraftMeetingData([]);
        setProposedMeetingData([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [searchMeetings, getALlMeetingTypes]);

  /**
   * Effect to transform meeting type data from Redux into a format suitable for UI filters/dropdowns.
   * Adds a default 'Quick-meeting' option.
   */
  useEffect(() => {
    try {
      if (
        getALlMeetingTypes?.meetingTypes !== null &&
        getALlMeetingTypes?.meetingTypes !== undefined
      ) {
        let meetingtypeFilter = [];
        let byDefault = {
          value: "0",
          text: t("Quick-meeting"),
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

  const joinMeetingAction = () => {
    try {
    } catch (error) {}
  };
  const leaveMeetingAction = () => {
    try {
    } catch (error) {}
  };

  const startMeetingAction = () => {
    try {
    } catch (error) {}
  };

  const publishMeetingAction = () => {
    try {
    } catch (error) {}
  };

  const deleteMeetingAction = () => {
    try {
    } catch (error) {}
  };

  const cancelMeetingAction = () => {
    try {
    } catch (error) {}
  };
  const viewMeetingAction = () => {
    try {
    } catch (error) {}
  };

  const editMeetingAction = () => {
    try {
    } catch (error) {}
  };
  // Object containing all states and setters to be passed through context value
  const statesData = {
    searchFilters,
    setSearchFilters,
    selectedStatusFilters,
    setSelectedStatusFilters,
    selectedMeetingTypeFilters,
    setSelectedMeetingTypeFilters,
    isLoading,
    setIsLoading,

    isMeetingTypeFilter,
    minutesAgo,
    startMeetingButton,
    meetingMapFolderId,
    setMeetingMapFolderId,
    createdMeetingInfo,
    setCreatedMeetingInfo,
    // New States
    currentTab,
    setCurrentTab,
    publishedMeetingData,
    setPublishedMeetingData,
    publishedMeetingDataRecord,
    setPublishedMeetingDataRecord,
    proposedMeetingData,
    setProposedMeetingData,
    proposedMeetingDataRecord,
    setProposedMeetingDataRecord,
    draftMeetingData,
    setDraftMeetingData,
    draftMeetingDataRecord,
    setDraftMeetingDataRecord,
    isCreateEditMeeting,
    setIsCreateEditMeeting,
    setIsViewMeeting,
    isViewMeeting,
    isQuickMeetingCreate,
    setIsQuickMeetingCreate,
    isQuickMeetingUpdate,
    setIsQuickMeetingUpdate,
    isQuickMeetingView,
    setIsQuickMeetingView,
    isMeetingCreateOrEdit,
    setIsMeetingCreateOrEdit,
    requestData,
    setRequestData,
  };

  // Provide the state data to the context
  return (
    <NewMeetingContext.Provider value={statesData}>
      {children}
    </NewMeetingContext.Provider>
  );
};

/**
 * @hook useNewMeetingContext
 * @description Consumes NewMeetingContext and returns all meeting listing and
 *   creation state values and setters. Throws an error if called outside of
 *   NewMeetingProvider.
 * @returns {Object} All meeting listing state values and setter functions from NewMeetingProvider
 */
// Custom Hook to consume the context
export const useNewMeetingContext = () => {
  // Access the context
  const context = useContext(NewMeetingContext);

  // Throw an error if the hook is used outside of the NewMeetingProvider
  if (!context) {
    throw new Error(
      "useNewMeetingContext must be used within a NewMeetingProvider",
    );
  }

  // Return the context data
  return context;
};
