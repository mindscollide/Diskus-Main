import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { mqttMeetingData } from "../hooks/meetingResponse/response";

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
  const [isMeetingCreation, setIsMeetingCreation] = useState({
    isQuickMeeting: false,
    isAdvanceMeeting: false,
    isProposedMeeting: false,
  });
  const [currentTab, setCurrentTab] = useState("1");

  // --- UI Visibility States ---
  const [isCreateEditMeeting, setIsCreateEditMeeting] = useState(false);
  const [isViewMeeting, setIsViewMeeting] = useState(false);

  // --- Tab Visibility States for Create/Edit Mode ---
  const [isCreateEditMeetingTabs, setIsCreateEditMettingTabs] = useState({
    isDetailsTab: false,
    isOrganizerTab: false,
    isParticipantTab: false,
    isAgendaContributorTab: false,
    isAgendaTab: false,
    isAgendaViewerTab: false,
    isMinutesTab: false,
    isTasksTab: false,
    isPollsTab: false,
  });

  // --- Tab Visibility States for View Mode ---
  const [isViewMeetingTabs, setIsViewMeetingTabs] = useState({
    isDetailsTab: false,
    isOrganizerTab: false,
    isParticipantTab: false,
    isAgendaContributorTab: false,
    isAgendaTab: false,
    isAgendaViewerTab: false,
    isMinutesTab: false,
    isTasksTab: false,
    isPollsTab: false,
    isRecordingTab: false,
  });

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

  const [isPublishedMeeting, setIsPublishedMeeting] = useState(true);
  const [isDraftMeetings, setIsDraftMeetings] = useState(false);
  const [isProposedMeeting, setIsProposedMeeting] = useState(false);
  const [meetingData, setMeetingData] = useState([]);
  const [duplicatedMeetingData, setDuplicatedMeetingData] = useState([]);
  const [quickMeeting, setQuickMeeting] = useState(false);
  const [proposedNewMeeting, setProposedNewMeeting] = useState(false);
  const [isAdvanceMeetingCreate, setIsAdvanceMeetingCreate] = useState(false);
  const [isProposedMeetingCreate, setIsProposedMeetingCreate] = useState(false);
  const [totalMeetingRecords, setTotalMeetingRecords] = useState(0);
  const [meetingsRecords, setMeetingsRecords] = useState([]);
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [startMeetingButton, setStartMeetingButton] = useState([]);

  // --- Search Filters ---
  const [searchFilters, setSearchFilters] = useState({
    Date: "",
    Title: "",
    HostName: "",
    PageNumber: 1,
    Length: 30,
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
        setMeetingsRecords((rowsData) => {
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
          }
        } catch (error) {
          console.log(error);
          setMeetingsRecords([]);
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
    meetingData,
    setMeetingData,
    duplicatedMeetingData,
    setDuplicatedMeetingData,
    searchFilters,
    setSearchFilters,
    selectedStatusFilters,
    setSelectedStatusFilters,
    selectedMeetingTypeFilters,
    setSelectedMeetingTypeFilters,
    isLoading,
    setIsLoading,
    isPublishedMeeting,
    setIsPublishedMeeting,
    isDraftMeetings,
    setIsDraftMeetings,
    isProposedMeeting,
    setIsProposedMeeting,
    totalMeetingRecords,
    setTotalMeetingRecords,
    meetingsRecords,
    setMeetingsRecords,
    isMeetingTypeFilter,
    minutesAgo,
    startMeetingButton,
    quickMeeting,
    setQuickMeeting,
    proposedNewMeeting,
    setProposedNewMeeting,
    isAdvanceMeetingCreate,
    setIsAdvanceMeetingCreate,
    meetingMapFolderId,
    setMeetingMapFolderId,
    createdMeetingInfo,
    setCreatedMeetingInfo,
    isProposedMeetingCreate,
    setIsProposedMeetingCreate,
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
  };

  // Provide the state data to the context
  return (
    <NewMeetingContext.Provider value={statesData}>
      {children}
    </NewMeetingContext.Provider>
  );
};

/**
 * Custom hook to easily consume the NewMeetingContext.
 * Throws an error if used outside of a provider.
 */
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
