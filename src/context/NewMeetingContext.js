/**
 * @file NewMeetingContext.js
 * @description Manages UI and data state for the Meetings listing/dashboard page.
 * Handles the meetings list (published, draft, proposed), search filters, meeting
 * type filter options, pagination, loading state, and real-time meeting reminder
 * notifications received via Redux/MQTT.
 *
 * Exposed values (selected highlights):
 * - `meetingsRecords` {Array} - The current page of meeting records to display.
 * - `totalMeetingRecords` {number} - Total count of meetings matching current filters.
 * - `searchFilters` {object} - Active search criteria (Date, Title, HostName, PageNumber, Length).
 * - `selectedStatusFilters` {string[]} - Active meeting status filter IDs.
 * - `selectedMeetingTypeFilters` {string[]} - Active meeting type filter IDs.
 * - `isMeetingTypeFilter` {Array} - Meeting type options for the filter dropdown.
 * - `isPublishedMeeting`, `isDraftMeetings`, `isProposedMeeting` - Active tab flags.
 * - `quickMeeting`, `isAdvanceMeetingCreate`, `isProposedMeetingCreate` - Create-flow flags.
 * - `createdMeetingInfo` {object} - Identity ({meetingId, meetingTitle}) of the newly created meeting.
 * - `meetingMapFolderId` {number} - Folder ID associated with the meeting's document mapping.
 * - `isLoading` {boolean} - Whether a data fetch is in progress.
 *
 * Consumed by the meetings listing page, meeting search/filter controls, meeting
 * creation flows, and components that respond to live meeting status changes.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { mqttMeetingData } from "../hooks/meetingResponse/response";
import { useTranslation } from "react-i18next";

// Create the Context
export const NewMeetingContext = createContext();

/**
 * NewMeetingProvider component that supplies meetings list state, search/filter controls,
 * and real-time meeting reminder updates to the component tree via NewMeetingContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const NewMeetingProvider = ({ children }) => {
  const {t} = useTranslation()
  const [createdMeetingInfo, setCreatedMeetingInfo] = useState({
    meetingId: 0,
    meetingTitle: "",
  });
  const [meetingMapFolderId, setMeetingMapFolderId] = useState(0);

  // State for managing meeting data
  const meetingReminderNotification = useSelector(
    (state) => state.NewMeetingreducer.meetingReminderNotification
  );
  const meetingStatusPublishedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData
  );
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );
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

  // State for managing search filters
  const [searchFilters, setSearchFilters] = useState({
    Date: "",
    Title: "",
    HostName: "",
    PageNumber: 1,
    Length: 30,
  });

  // State for filter options
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

  // State for modals and UI
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (meetingReminderNotification !== null) {
      try {
        const meetingData = meetingReminderNotification.meetingDetails;
        console.log(meetingData, "meetingDetailsmeetingDetails");
        setMeetingsRecords((rowsData) => {
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

  useEffect(() => {
    try {
      if (
        searchMeetings !== null &&
        searchMeetings !== undefined &&
        getALlMeetingTypes?.meetingTypes
      ) {
        try {
          setTotalMeetingRecords(searchMeetings.totalRecords);
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
            setMeetingsRecords(copyMeetingData);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setMeetingsRecords([]);
      }
    } catch {}
  }, [searchMeetings, getALlMeetingTypes]);

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

  // Consolidate all states into a single object for easier passing to the context
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
    isProposedMeetingCreate, setIsProposedMeetingCreate
  };



  // Provide the state data to the context
  return (
    <NewMeetingContext.Provider value={statesData}>
      {children}
    </NewMeetingContext.Provider>
  );
};

/**
 * Custom hook to consume NewMeetingContext.
 * Must be used within a {@link NewMeetingProvider}.
 *
 * @returns {object} The meetings listing context state and setter functions.
 * @throws {Error} If used outside of a NewMeetingProvider.
 */
export const useNewMeetingContext = () => {
  // Access the context
  const context = useContext(NewMeetingContext);

  // Throw an error if the hook is used outside of the NewMeetingProvider
  if (!context) {
    throw new Error(
      "useNewMeetingContext must be used within a NewMeetingProvider"
    );
  }

  // Return the context data
  return context;
};
