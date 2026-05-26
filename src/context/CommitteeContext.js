import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommitteeMeeting } from "../store/actions/GetMeetingUserId";
import {
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingNotConductedMQTT,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
  meetingStatusProposedMqtt,
  validateStringParticipantProposedApi,
  validateStringUserMeetingProposedDatesPollsApi,
} from "../store/actions/NewMeetingActions";
import {
  getAllUnpublishedMeetingData,
  mqttMeetingData,
} from "../hooks/meetingResponse/response";
import {
  toggleIsOrganizerProposedMeetingDates,
  toggleIsParticipantProposedMeetingDates,
} from "../store/actions/ModalStates_actions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const CommitteeContext = createContext();

export const CommitteeProvider = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [ViewCommitteePage, setViewCommitteePage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewVotes, setviewVotes] = useState(false);
  let MeetingProp = localStorage.getItem("meetingprop");
  let UserMeetPropoDatPoll = localStorage.getItem("UserMeetPropoDatPoll");
  const dispatch = useDispatch();
  // =========================
  // REDUX
  // =========================
  const getMeetingByCommitteeID = useSelector(
    (state) => state.NewMeetingreducer.getMeetingByCommitteeID,
  );
  const meetingStatusNotConductedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusNotConductedMqttData,
  );
  const committeeInfo = useSelector(
    (state) => state.CommitteeReducer.viewCommitteeDetails,
  );

  const mqttMeetingAcAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcAdded,
  );
  const mqttMeetingAcRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcRemoved,
  );
  const mqttMeetingOrgAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgAdded,
  );
  const mqttMeetingOrgRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgRemoved,
  );

  const meetingStatusProposedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusProposedMqttData,
  );
  const {
    CommitteeMeetingMQTT,
    MeetingStatusSocket,
    allMeetingsSocketData,
    MeetingStatusEnded,
  } = useSelector((state) => state.meetingIdReducer);

  // =========================
  // STATE
  // =========================
  const [
    currentCommitteeMeetingTabActive,
    setCurrentCommitteeMeetingTabActive,
  ] = useState(1);

  const [minutesAgo, setMinutesAgo] = useState(0);

  // Published
  const [committeePublishedMeetingData, setCommitteePublishedMeetingData] =
    useState([]);
  const [
    committeePublishedMeetingDataRecord,
    setCommitteePublishedMeetingDataRecord,
  ] = useState(0);

  // Proposed
  const [committeeProposedMeetingData, setCommitteeProposedMeetingData] =
    useState([]);
  const [
    committeeProposedMeetingDataRecord,
    setCommitteeProposedMeetingDataRecord,
  ] = useState(0);

  // Draft
  const [committeeDraftMeetingData, setCommitteeDraftMeetingData] = useState(
    [],
  );
  const [committeeDraftMeetingDataRecord, setCommitteeDraftMeetingDataRecord] =
    useState(0);

  // Quick Meeting
  const [isCommitteeCreateQuickMeeting, setIsCommitteeCreateQuickMeeting] =
    useState(false);
  const [isCommitteeUpdateQuickMeeting, setIsCommitteeUpateQuickMeeting] =
    useState(false);
  const [isCommitteeViewQuickMeeting, setIsCommitteeViewQuickMeeting] =
    useState(false);

  const [startMeetingButton, setStartMeetingButton] = useState([]);

  // =========================
  // HELPERS (same pattern)
  // =========================
  const getActiveListAndSetter = () => {
    switch (currentCommitteeMeetingTabActive) {
      case 2:
        return {
          list: committeeProposedMeetingData,
          setList: setCommitteeProposedMeetingData,
        };
      case 3:
        return {
          list: committeeDraftMeetingData,
          setList: setCommitteeDraftMeetingData,
        };
      case 1:
      default:
        return {
          list: committeePublishedMeetingData,
          setList: setCommitteePublishedMeetingData,
        };
    }
  };

  const updateMeetingInAllLists = (meetingID, updateFn) => {
    const mapper = (item) =>
      Number(item.pK_MDID) === Number(meetingID) ? updateFn(item) : item;

    setCommitteePublishedMeetingData((prev) => prev.map(mapper));
    setCommitteeProposedMeetingData((prev) => prev.map(mapper));
    setCommitteeDraftMeetingData((prev) => prev.map(mapper));
  };

  const removeMeetingFromAllLists = (meetingID) => {
    const filterFn = (item) => Number(item.pK_MDID) !== Number(meetingID);

    setCommitteePublishedMeetingData((prev) => prev.filter(filterFn));
    setCommitteeProposedMeetingData((prev) => prev.filter(filterFn));
    setCommitteeDraftMeetingData((prev) => prev.filter(filterFn));
  };

  // =========================
  // EFFECT (MAIN DATA SYNC)
  // =========================
  useEffect(() => {
    try {
      if (!getMeetingByCommitteeID) {
        setCommitteePublishedMeetingData([]);
        setCommitteeProposedMeetingData([]);
        setCommitteeDraftMeetingData([]);
        return;
      }

      const meetings = getMeetingByCommitteeID.meetings || [];

      setMinutesAgo(getMeetingByCommitteeID.meetingStartedMinuteAgo || 0);

      switch (currentCommitteeMeetingTabActive) {
        case 1:
          setCommitteePublishedMeetingData(meetings);
          setCommitteePublishedMeetingDataRecord(
            getMeetingByCommitteeID.totalRecords || 0,
          );
          break;

        case 2:
          setCommitteeProposedMeetingData(meetings);
          setCommitteeProposedMeetingDataRecord(
            getMeetingByCommitteeID.totalRecords || 0,
          );
          break;

        case 3:
          setCommitteeDraftMeetingData(meetings);
          setCommitteeDraftMeetingDataRecord(
            getMeetingByCommitteeID.totalRecords || 0,
          );
          break;

        default:
          break;
      }
    } catch (error) {}
  }, [getMeetingByCommitteeID, currentCommitteeMeetingTabActive]);

  useEffect(() => {
    try {
      if (!CommitteeMeetingMQTT) return;

      const callAddAndUpdateCommitteeMeeting = async () => {
        const { committeeID, meeting } = CommitteeMeetingMQTT;
        if (Number(committeeInfo.committeeID) !== Number(committeeID)) return;

        if (!meeting?.pK_MDID) return;

        const { list, setList } = getActiveListAndSetter();

        const newMeetingData = await mqttMeetingData(meeting, 1);

        const exists = list.some(
          (item) => Number(item.pK_MDID) === Number(meeting.pK_MDID),
        );

        if (exists) {
          setList((prev) =>
            prev.map((item) =>
              Number(item.pK_MDID) === Number(meeting.pK_MDID)
                ? newMeetingData
                : item,
            ),
          );
        } else {
          setList((prev) => [newMeetingData, ...prev]);
        }

        dispatch(createCommitteeMeeting(null));
      };

      callAddAndUpdateCommitteeMeeting();
    } catch (error) {
      console.log(error);
    }
  }, [CommitteeMeetingMQTT]);

  useEffect(() => {
    if (!MeetingStatusEnded) return;

    try {
      if (
        MeetingStatusEnded.message?.toLowerCase() ===
        "meeting_status_edited_end"
      ) {
        const meetingID = MeetingStatusEnded.meeting?.pK_MDID;

        if (!meetingID) return;

        updateMeetingInAllLists(meetingID, (item) => ({
          ...item,
          status: "9",
        }));
      }
    } catch (error) {}
  }, [MeetingStatusEnded]);

  // useEffect(() => {
  //   if (!allMeetingsSocketData) return;

  //   try {
  //     const updateMeetingSocket = async () => {
  //       const meetingID = allMeetingsSocketData.pK_MDID;
  //       const newMeetingData = await mqttMeetingData(allMeetingsSocketData, 1);

  //       if (!meetingID) return;
  //       updateMeetingInAllLists(meetingID, () => newMeetingData);
  //     };
  //     updateMeetingSocket();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [allMeetingsSocketData]);

  useEffect(() => {
    if (!meetingStatusNotConductedMqttData) return;

    try {
      const meetingDetails = meetingStatusNotConductedMqttData.meetingDetails;

      if (!meetingDetails?.pK_MDID) return;

      // OPTIONAL: filter by committee (recommended)
      if (
        Number(committeeInfo.committeeID) !==
        Number(meetingStatusNotConductedMqttData.committeeID)
      ) {
        return;
      }

      const meetingID = meetingDetails.pK_MDID;
      const statusID = meetingDetails.statusID;

      // ✅ Update meeting in all lists (Published / Proposed / Draft)
      updateMeetingInAllLists(meetingID, (item) => ({
        ...item,
        status: String(statusID),
      }));

      // ✅ OPTIONAL: Handle "Start Meeting" button state
      setStartMeetingButton((prev) => {
        const exists = prev.some(
          (b) => Number(b.meetingID) === Number(meetingID),
        );

        // If meeting started
        if (statusID === 1) {
          if (exists) return prev;

          return [...prev, { meetingID: Number(meetingID), showButton: true }];
        }

        // Otherwise remove it
        return prev.filter((b) => Number(b.meetingID) !== Number(meetingID));
      });

      // Reset MQTT
      dispatch(meetingNotConductedMQTT(null));
    } catch (error) {}
  }, [meetingStatusNotConductedMqttData]);

  // ─── MQTT: Agenda Contributor Added ───
  useEffect(() => {
    try {
      const callAddAgendaContributor = async () => {
        if (mqttMeetingAcAdded !== null && mqttMeetingAcAdded !== undefined) {
          let newObj = mqttMeetingAcAdded;
          try {
            let getData = await mqttMeetingData(newObj, 2);
            setCommitteeDraftMeetingData((prevData) => [getData, ...prevData]);
          } catch (error) {}
          dispatch(meetingAgendaContributorAdded(null));
          dispatch(meetingAgendaContributorRemoved(null));
          dispatch(meetingOrganizerAdded(null));
          dispatch(meetingOrganizerRemoved(null));
        }
      };
      callAddAgendaContributor();
    } catch (error) {}
  }, [mqttMeetingAcAdded]);

  // ─── MQTT: Agenda Contributor Removed ───
  useEffect(() => {
    if (mqttMeetingAcRemoved !== null && mqttMeetingAcRemoved !== undefined) {
      let meetingData = mqttMeetingAcRemoved;
      try {
        const updatedRows = committeeDraftMeetingData.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID,
        );
        setCommitteeDraftMeetingData(updatedRows);
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      } catch {}
    }
  }, [mqttMeetingAcRemoved]);

  // ─── MQTT: Organizer Added ───
  useEffect(() => {
    try {
      const callAddOrganizer = async () => {
        if (mqttMeetingOrgAdded !== null && mqttMeetingOrgAdded !== undefined) {
          let newObj = mqttMeetingOrgAdded;
          try {
            let getData = await mqttMeetingData(newObj, 2);
            setCommitteeDraftMeetingData((prevData) => [getData, ...prevData]);
          } catch (error) {}
          dispatch(meetingAgendaContributorAdded(null));
          dispatch(meetingAgendaContributorRemoved(null));
          dispatch(meetingOrganizerAdded(null));
          dispatch(meetingOrganizerRemoved(null));
        }
      };
      callAddOrganizer();
    } catch (error) {}
  }, [mqttMeetingOrgAdded]);

  // ─── MQTT: Organizer Removed ───
  useEffect(() => {
    if (mqttMeetingOrgRemoved !== null && mqttMeetingOrgRemoved !== undefined) {
      let meetingData = mqttMeetingOrgRemoved;
      try {
        const updatedRows = committeeDraftMeetingData.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID,
        );
        setCommitteeDraftMeetingData(updatedRows);
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      } catch {}
    }
  }, [mqttMeetingOrgRemoved]);

  useEffect(() => {
    if (
      meetingStatusProposedMqttData !== null &&
      meetingStatusProposedMqttData !== undefined
    ) {
      try {
        const updateMeetingData = async () => {
          let meetingData = meetingStatusProposedMqttData;

          const indexToUpdate = committeeProposedMeetingData.findIndex(
            (obj) => obj.pK_MDID === meetingData.pK_MDID,
          );

          // Fetching unpublished meeting data
          let getMeetingDataArray = await getAllUnpublishedMeetingData(
            [meetingData],
            1,
          );

          // Assuming getMeetingDataArray is an array with a single object
          const getMeetingData = getMeetingDataArray[0];
          // Check if the meeting exists in the current meetingsRecords

          if (indexToUpdate !== -1) {
            let updatedRows = [...committeeProposedMeetingData];

            updatedRows[indexToUpdate] = getMeetingData;

            setCommitteeProposedMeetingData(updatedRows);
          } else {
            let updatedRows = [getMeetingData, ...committeeProposedMeetingData];

            setCommitteeProposedMeetingData(updatedRows);
            setCommitteeProposedMeetingDataRecord((prev) => prev + 1);
          }
        };
        updateMeetingData();
        dispatch(meetingStatusProposedMqtt(null));
      } catch (error) {}
    }
  }, [meetingStatusProposedMqttData]);

  useEffect(() => {
    try {
      if (MeetingStatusSocket !== null) {
        const { message, meetingStatusID, meetingID } = MeetingStatusSocket;

        if (
          message
            .toLowerCase()
            .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
        ) {
          const { list, setList } = getActiveListAndSetter();
          setList((prev) =>
            prev.filter((item) => Number(item.pK_MDID) !== Number(meetingID)),
          );
        }
      }
    } catch (error) {}
  }, [MeetingStatusSocket]);

  // useEffect(() => {
  //   if (MeetingProp !== null) {
  //     const callApi = async () => {
  //       try {
  //         let getApiResponse = await validateStringParticipantProposedApi(
  //           MeetingProp,
  //           navigate,
  //           t,
  //         )(dispatch); // Ensure you're passing dispatch here
  //         if (getApiResponse) {
  //           localStorage.setItem(
  //             "viewProposeDatePollMeetingID",
  //             getApiResponse.meetingID,
  //           );
  //           localStorage.removeItem("meetingprop");
  //           // setResponseByDate(getApiResponse.deadline);
  //           dispatch(toggleIsParticipantProposedMeetingDates(true));
  //         }
  //       } catch (error) {
  //
  //         localStorage.removeItem("meetingprop");
  //       }
  //     };

  //     callApi();
  //   }
  // }, [MeetingProp]); // Add `dispatch` to the dependency array

  // useEffect(() => {
  //   if (UserMeetPropoDatPoll !== null) {
  //     try {
  //       const callApi1 = async () => {
  //         try {
  //           let getApiResponse =
  //             await validateStringUserMeetingProposedDatesPollsApi(
  //               UserMeetPropoDatPoll,
  //               navigate,
  //               t,
  //             )(dispatch); // Ensure you're passing dispatch here

  //           if (getApiResponse) {
  //             localStorage.setItem(
  //               "viewProposeDatePollMeetingID",
  //               getApiResponse.meetingID,
  //             );
  //             localStorage.removeItem("UserMeetPropoDatPoll");
  //             dispatch(toggleIsOrganizerProposedMeetingDates(true));
  //           }
  //         } catch (error) {
  //
  //           localStorage.removeItem("UserMeetPropoDatPoll");
  //         }
  //       };

  //       callApi1();
  //     } catch (error) {}
  //   }
  // }, [UserMeetPropoDatPoll]);

  // =========================
  // CONTEXT VALUE
  // =========================
  return (
    <CommitteeContext.Provider
      value={{
        minutesAgo,

        currentCommitteeMeetingTabActive,
        setCurrentCommitteeMeetingTabActive,

        committeePublishedMeetingData,
        committeePublishedMeetingDataRecord,

        committeeProposedMeetingData,
        committeeProposedMeetingDataRecord,

        committeeDraftMeetingData,
        committeeDraftMeetingDataRecord,

        // expose setters if needed
        setCommitteePublishedMeetingData,
        setCommitteeProposedMeetingData,
        setCommitteeDraftMeetingData,

        // helpers (important for MQTT reuse)
        updateMeetingInAllLists,
        removeMeetingFromAllLists,

        startMeetingButton,

        ViewCommitteePage,
        setViewCommitteePage,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </CommitteeContext.Provider>
  );
};

// Hook
export const useCommitteeContext = () => {
  const context = useContext(CommitteeContext);

  if (!context) {
    throw new Error(
      "useCommitteeContext must be used within a CommitteeProvider",
    );
  }

  return context;
};
