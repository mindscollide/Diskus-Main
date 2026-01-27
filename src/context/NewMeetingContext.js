import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Create the Context
export const NewMeetingContext = createContext();

// Create a Provider component
export const NewMeetingProvider = ({ children }) => {
  // State for managing meeting data
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings,
  );
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes,
  );
  const [isMeetingTypeFilter, setMeetingTypeFilter] = useState([]);

  const [isPublishedMeeting, setIsPublishedMeeting] = useState(true);
  const [isDraftMeetings, setIsDraftMeetings] = useState(false);
  const [isProposedMeeting, setIsProposedMeeting] = useState(false);
  const [meetingData, setMeetingData] = useState([]);
  const [duplicatedMeetingData, setDuplicatedMeetingData] = useState([]);

  const [publishMeetingTotalRecords, setPublishedMeetingTotalRecords] =
    useState(0);
  const [publishMeetingData, setPublishedMeetingData] = useState([]);
  const [minutesAgo, setMinutesAgo] = useState(0);

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
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        setPublishedMeetingTotalRecords(searchMeetings.totalRecords);
        setMinutesAgo(searchMeetings.meetingStartedMinuteAgo);
        if (Object.keys(searchMeetings.meetings).length > 0) {
          // Create a deep copy of the meetings array
          let copyMeetingData = searchMeetings.meetings.map((meeting) => ({
            ...meeting,
            meetingAgenda: meeting.meetingAgenda.filter(
              (agenda) => agenda.objMeetingAgenda.canView,
            ),
          }));
          copyMeetingData.forEach((data) => {
            data.meetingAgenda = data.meetingAgenda.filter((agenda) => {
              return agenda.objMeetingAgenda.canView === true;
            });
          });
          console.log("handleViewMeeting", copyMeetingData);
          setPublishedMeetingData(copyMeetingData);
        }
      } else {
        setPublishedMeetingData([]);
      }
    } catch {}
  }, [searchMeetings]);

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
    publishMeetingTotalRecords,
    setPublishedMeetingTotalRecords,
    publishMeetingData,
    setPublishedMeetingData,
    isMeetingTypeFilter,
  };

  // Provide the state data to the context
  return (
    <NewMeetingContext.Provider value={statesData}>
      {children}
    </NewMeetingContext.Provider>
  );
};

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
