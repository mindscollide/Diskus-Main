import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  toggleIsOrganizerProposedMeetingDates,
  toggleIsParticipantProposedMeetingDates,
} from "../store/actions/ModalStates_actions";
import {
  meetingNotConductedMQTT,
  meetingStatusProposedMqtt,
  validateStringParticipantProposedApi,
  validateStringUserMeetingProposedDatesPollsApi,
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
} from "../store/actions/NewMeetingActions";
import { createGroupMeeting } from "../store/actions/GetMeetingUserId";
import {
  getAllUnpublishedMeetingData,
  mqttMeetingData,
} from "../hooks/meetingResponse/response";

/**
 * @context GroupContext
 * @description Provides UI state for the Groups module.
 */
export const GroupContext = createContext();

export const GroupsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ─── UI State ───
  const [ViewGroupPage, setViewGroupPage] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewVotes, setviewVotes] = useState(false);

  // ─── Redux Selectors ───
  const {
    GroupMeetingMQTT,
    allMeetingsSocketData,
    MeetingStatusEnded,
    MeetingStatusSocket,
  } = useSelector((state) => state.meetingIdReducer);

  const meetingStatusNotConductedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusNotConductedMqttData,
  );
  const groupInfo = useSelector(
    (state) => state.GroupsReducer?.viewGroupDetails,
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
  const getMeetingbyGroupID = useSelector(
    (state) => state.NewMeetingreducer.getMeetingbyGroupID,
  );

  // ─── Tab State ───
  const [currentGroupMeetingTabActive, setCurrentGroupMeetingTabActive] =
    useState(1);
  const [currentGroupMeetingPage, setCurrentGroupMeetingPage] = useState(1);
  const [currentGroupMeetingLength, setCurrentGroupMeetingLength] =
    useState(30);
  const [minutesAgo, setMinutesAgo] = useState(0);

  // ─── Meeting Lists ───
  const [groupPublishedMeetingData, setGroupPublishedMeetingData] = useState(
    [],
  );

  const [groupPublishedMeetingDataRecord, setGroupPublishedMeetingDataRecord] =
    useState(0);

  const [groupProposedMeetingData, setGroupProposedMeetingData] = useState([]);
  const [groupProposedMeetingDataRecord, setGroupProposedMeetingDataRecord] =
    useState(0);

  const [groupDraftMeetingData, setGroupDraftMeetingData] = useState([]);
  const [groupDraftMeetingDataRecord, setGroupDraftMeetingDataRecord] =
    useState(0);

  const [startMeetingButton, setStartMeetingButton] = useState([]);
  const ViewGroupID = localStorage.getItem("ViewGroupID");

  const meetingStatusPublishedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData,
  );

  const [currentViewGroupTabs, setCurrentViewGroupTabs] = useState(1);

  // =========================
  // HELPERS
  // =========================
  const getActiveListAndSetter = () => {
    switch (currentGroupMeetingTabActive) {
      case 2:
        return {
          list: groupProposedMeetingData,
          setList: setGroupProposedMeetingData,
        };
      case 3:
        return {
          list: groupDraftMeetingData,
          setList: setGroupDraftMeetingData,
        };
      case 1:
      default:
        return {
          list: groupPublishedMeetingData,
          setList: setGroupPublishedMeetingData,
        };
    }
  };

  const updateMeetingInAllLists = (meetingID, updateFn) => {
    const mapper = (item) =>
      Number(item.pK_MDID) === Number(meetingID) ? updateFn(item) : item;

    setGroupPublishedMeetingData((prev) => prev.map(mapper));
    setGroupProposedMeetingData((prev) => prev.map(mapper));
    setGroupDraftMeetingData((prev) => prev.map(mapper));
  };

  const removeMeetingFromAllLists = (meetingID) => {
    const filterFn = (item) => Number(item.pK_MDID) !== Number(meetingID);

    setGroupPublishedMeetingData((prev) => prev.filter(filterFn));
    setGroupProposedMeetingData((prev) => prev.filter(filterFn));
    setGroupDraftMeetingData((prev) => prev.filter(filterFn));
  };

  // =========================
  // EFFECT: MAIN DATA SYNC (from API)
  // =========================
  useEffect(() => {
    try {
      if (!getMeetingbyGroupID) {
        setGroupPublishedMeetingData([]);
        setGroupProposedMeetingData([]);
        setGroupDraftMeetingData([]);
        return;
      }
      console.log(
        { getMeetingbyGroupID, currentGroupMeetingTabActive },
        "getMeetingbyGroupIDgetMeetingbyGroupID",
      );
      const meetings = getMeetingbyGroupID.meetings || [];
      setMinutesAgo(getMeetingbyGroupID.meetingStartedMinuteAgo || 0);

      switch (currentGroupMeetingTabActive) {
        case 1:
          setGroupPublishedMeetingData(meetings);
          setGroupPublishedMeetingDataRecord(
            getMeetingbyGroupID.totalRecords || 0,
          );
          break;
        case 2:
          setGroupProposedMeetingData(meetings);
          setGroupProposedMeetingDataRecord(
            getMeetingbyGroupID.totalRecords || 0,
          );
          break;
        case 3:
          setGroupDraftMeetingData(meetings);
          setGroupDraftMeetingDataRecord(getMeetingbyGroupID.totalRecords || 0);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }, [getMeetingbyGroupID, currentGroupMeetingTabActive]);

  useEffect(() => {
    if (meetingStatusPublishedMqttData == null) return;

    const callMQTT = async () => {
      try {
        const meetingData = meetingStatusPublishedMqttData;
        const newMeetingData = await mqttMeetingData(meetingData, 1);

        const { list, setList } = getActiveListAndSetter();

        const indexToUpdate = list.findIndex(
          (obj) => Number(obj.pK_MDID) === Number(meetingData.pK_MDID),
        );

        // IF MEETING EXISTS IN DRAFT LIST THEN REMOVE IT
        const isExistInDraft = groupDraftMeetingData.some(
          (obj) => Number(obj.pK_MDID) === Number(meetingData.pK_MDID),
        );

        if (isExistInDraft) {
          if (indexToUpdate !== -1) {
            const updated = [...list];
            updated.splice(indexToUpdate, 1);
            setList(updated);
          }

          return;
        }

        // UPDATE EXISTING
        if (indexToUpdate !== -1) {
          const updated = [...list];
          updated[indexToUpdate] = newMeetingData;
          setList(updated);
        } else {
          // ADD NEW
          setList([newMeetingData, ...list]);
        }
      } catch (error) {}
    };

    callMQTT();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingStatusPublishedMqttData]);

  // =========================
  // EFFECT: GroupMeetingMQTT — handles new / updated meeting via MQTT
  // (Replaces the two duplicate effects from the original code)
  // =========================
  useEffect(() => {
    try {
      if (!GroupMeetingMQTT) return;

      const callAddAndUpdateGroupMeeting = async () => {
        const { groupID, meeting } = GroupMeetingMQTT;
        const incomingGroupID = Number(groupID);
        const currentGroupID = Number(groupInfo?.groupID ?? ViewGroupID);

        if (incomingGroupID !== currentGroupID) return;

        const meetingData = GroupMeetingMQTT.meeting;
        if (!meetingData?.pK_MDID) return;

        const { list, setList } = getActiveListAndSetter();

        const exists = list.some(
          (item) => Number(item.pK_MDID) === Number(meetingData.pK_MDID),
        );
        const newMeetingData = await mqttMeetingData(meeting, 1);

        if (exists) {
          setList((prev) =>
            prev.map((item) =>
              Number(item.pK_MDID) === Number(meetingData.pK_MDID)
                ? newMeetingData
                : item,
            ),
          );
        } else {
          setList((prev) => [newMeetingData, ...prev]);
        }

        dispatch(createGroupMeeting(null));
      };
      callAddAndUpdateGroupMeeting();
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GroupMeetingMQTT]);

  // =========================
  // EFFECT: MeetingStatusEnded
  // =========================
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MeetingStatusEnded]);

  // =========================
  // EFFECT: allMeetingsSocketData — update meeting in any list
  // =========================

  // =========================
  // EFFECT: meetingStatusNotConductedMqttData
  // =========================
  useEffect(() => {
    if (!meetingStatusNotConductedMqttData) return;

    try {
      const meetingDetails = meetingStatusNotConductedMqttData.meetingDetails;
      if (!meetingDetails?.pK_MDID) return;

      // Filter by group
      const incomingGroupID = Number(meetingStatusNotConductedMqttData.groupID);
      const currentGroupID = Number(groupInfo?.groupID ?? ViewGroupID);

      if (
        incomingGroupID &&
        currentGroupID &&
        incomingGroupID !== currentGroupID
      ) {
        return;
      }

      const meetingID = meetingDetails.pK_MDID;
      const statusID = meetingDetails.statusID;

      updateMeetingInAllLists(meetingID, (item) => ({
        ...item,
        status: String(statusID),
      }));

      // Handle "Start Meeting" button state
      setStartMeetingButton((prev) => {
        const exists = prev.some(
          (b) => Number(b.meetingID) === Number(meetingID),
        );

        if (statusID === 1) {
          if (exists) return prev;
          return [...prev, { meetingID: Number(meetingID), showButton: true }];
        }

        return prev.filter((b) => Number(b.meetingID) !== Number(meetingID));
      });

      dispatch(meetingNotConductedMQTT(null));
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingStatusNotConductedMqttData]);

  // =========================
  // EFFECT: MQTT — Agenda Contributor Added
  // =========================
  useEffect(() => {
    if (!mqttMeetingAcAdded) return;

    const callAddAgendaContributor = async () => {
      try {
        const getData = await mqttMeetingData(mqttMeetingAcAdded, 2);
        if (getData) {
          setGroupDraftMeetingData((prev) => [getData, ...prev]);
          setGroupDraftMeetingDataRecord((prev) => prev + 1);
        }
      } catch (error) {
      } finally {
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      }
    };

    callAddAgendaContributor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mqttMeetingAcAdded]);

  // =========================
  // EFFECT: MQTT — Agenda Contributor Removed
  // =========================
  useEffect(() => {
    if (!mqttMeetingAcRemoved?.pK_MDID) return;

    try {
      removeMeetingFromAllLists(mqttMeetingAcRemoved.pK_MDID);
      setGroupDraftMeetingDataRecord((prev) => Math.max(0, prev - 1));
    } catch (error) {
    } finally {
      dispatch(meetingAgendaContributorAdded(null));
      dispatch(meetingAgendaContributorRemoved(null));
      dispatch(meetingOrganizerAdded(null));
      dispatch(meetingOrganizerRemoved(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mqttMeetingAcRemoved]);

  // =========================
  // EFFECT: MQTT — Organizer Added
  // =========================
  useEffect(() => {
    if (!mqttMeetingOrgAdded) return;

    const callAddOrganizer = async () => {
      try {
        const getData = await mqttMeetingData(mqttMeetingOrgAdded, 2);
        if (getData) {
          setGroupDraftMeetingData((prev) => [getData, ...prev]);
          setGroupDraftMeetingDataRecord((prev) => prev + 1);
        }
      } catch (error) {
      } finally {
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      }
    };

    callAddOrganizer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mqttMeetingOrgAdded]);

  // =========================
  // EFFECT: MQTT — Organizer Removed
  // =========================
  useEffect(() => {
    if (!mqttMeetingOrgRemoved?.pK_MDID) return;

    try {
      removeMeetingFromAllLists(mqttMeetingOrgRemoved.pK_MDID);
      setGroupDraftMeetingDataRecord((prev) => Math.max(0, prev - 1));
    } catch (error) {
    } finally {
      dispatch(meetingAgendaContributorAdded(null));
      dispatch(meetingAgendaContributorRemoved(null));
      dispatch(meetingOrganizerAdded(null));
      dispatch(meetingOrganizerRemoved(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mqttMeetingOrgRemoved]);

  // =========================
  // EFFECT: meetingStatusProposedMqttData
  // =========================
  useEffect(() => {
    if (!meetingStatusProposedMqttData) return;

    const updateMeetingData = async () => {
      try {
        const meetingData = meetingStatusProposedMqttData;

        const getMeetingDataArray = await getAllUnpublishedMeetingData(
          [meetingData],
          1,
        );
        const getMeetingData = getMeetingDataArray?.[0];
        if (!getMeetingData) return;

        setGroupProposedMeetingData((prev) => {
          const indexToUpdate = prev.findIndex(
            (obj) => Number(obj.pK_MDID) === Number(meetingData.pK_MDID),
          );

          if (indexToUpdate !== -1) {
            const updated = [...prev];
            updated[indexToUpdate] = getMeetingData;
            return updated;
          }
          return [getMeetingData, ...prev];
        });

        // Only increment record count if it's a new entry
        // setGroupProposedMeetingData((prev) => {
        //   // (record updated separately below — guarded against duplicates)
        //   return prev;
        // });
      } catch (error) {
      } finally {
        dispatch(meetingStatusProposedMqtt(null));
      }
    };

    updateMeetingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // =========================
  // EFFECT: MeetingProp — participant proposed dates validation
  // =========================
  // useEffect(() => {
  //   if (!MeetingProp) return;

  //   const callApi = async () => {
  //     try {
  //       const getApiResponse = await validateStringParticipantProposedApi(
  //         MeetingProp,
  //         navigate,
  //         t,
  //       )(dispatch);

  //       if (getApiResponse) {
  //         localStorage.setItem(
  //           "viewProposeDatePollMeetingID",
  //           getApiResponse.meetingID,
  //         );
  //         localStorage.removeItem("meetingprop");
  //         dispatch(toggleIsParticipantProposedMeetingDates(true));
  //       }
  //     } catch (error) {
  //
  //       localStorage.removeItem("meetingprop");
  //     }
  //   };

  //   callApi();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [MeetingProp]);

  // =========================
  // EFFECT: UserMeetPropoDatPoll — organizer proposed dates validation
  // =========================
  // useEffect(() => {
  //   if (!UserMeetPropoDatPoll) return;

  //   const callApi1 = async () => {
  //     try {
  //       const getApiResponse =
  //         await validateStringUserMeetingProposedDatesPollsApi(
  //           UserMeetPropoDatPoll,
  //           navigate,
  //           t,
  //         )(dispatch);

  //       if (getApiResponse) {
  //         localStorage.setItem(
  //           "viewProposeDatePollMeetingID",
  //           getApiResponse.meetingID,
  //         );
  //         localStorage.removeItem("UserMeetPropoDatPoll");
  //         dispatch(toggleIsOrganizerProposedMeetingDates(true));
  //       }
  //     } catch (error) {
  //
  //       localStorage.removeItem("UserMeetPropoDatPoll");
  //     }
  //   };

  //   callApi1();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [UserMeetPropoDatPoll]);

  return (
    <GroupContext.Provider
      value={{
        // UI
        ViewGroupPage,
        setViewGroupPage,
        showModal,
        setShowModal,
        viewVotes,
        setviewVotes,

        // Tabs
        currentGroupMeetingTabActive,
        setCurrentGroupMeetingTabActive,
        minutesAgo,

        // Lists
        groupPublishedMeetingData,
        setGroupPublishedMeetingData,
        groupPublishedMeetingDataRecord,
        setGroupPublishedMeetingDataRecord,

        groupProposedMeetingData,
        setGroupProposedMeetingData,
        groupProposedMeetingDataRecord,
        setGroupProposedMeetingDataRecord,

        groupDraftMeetingData,
        setGroupDraftMeetingData,
        groupDraftMeetingDataRecord,
        setGroupDraftMeetingDataRecord,

        // Buttons
        startMeetingButton,
        setStartMeetingButton,

        // Pagination
        currentGroupMeetingPage,
        setCurrentGroupMeetingPage,
        currentGroupMeetingLength,
        setCurrentGroupMeetingLength,
        currentViewGroupTabs,
        setCurrentViewGroupTabs,
      }}>
      {children}
    </GroupContext.Provider>
  );
};

/**
 * @hook useGroupsContext
 */
export const useGroupsContext = () => {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroupsContext must be used within a GroupsProvider");
  }

  return context;
};
