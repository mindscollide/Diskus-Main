import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

const SpinComponent = () => {
  const auth = useSelector((state) => state.auth);
  const assignees = useSelector((state) => state.assignees);
  const CommitteeReducer = useSelector((state) => state.CommitteeReducer);
  const toDoListReducer = useSelector((state) => state.toDoListReducer);
  const getTodosStatus = useSelector((state) => state.getTodosStatus);
  const downloadReducer = useSelector((state) => state.downloadReducer);
  const todoStatus = useSelector((state) => state.todoStatus);
  const uploadReducer = useSelector((state) => state.uploadReducer);
  const settingReducer = useSelector((state) => state.settingReducer);
  const fAQsReducer = useSelector((state) => state.fAQsReducer);
  const meetingIdReducer = useSelector((state) => state.meetingIdReducer);
  const calendarReducer = useSelector((state) => state.calendarReducer);
  const postAssigneeComments = useSelector(
    (state) => state.postAssigneeComments
  );
  const VideoChatReducer = useSelector((state) => state.VideoChatReducer);
  const minuteofMeetingReducer = useSelector(
    (state) => state.minuteofMeetingReducer
  );
  const countryNamesReducer = useSelector((state) => state.countryNamesReducer);
  const GetSubscriptionPackage = useSelector(
    (state) => state.GetSubscriptionPackage
  );
  const Authreducer = useSelector((state) => state.Authreducer);
  const roleListReducer = useSelector((state) => state.roleListReducer);
  const NotesReducer = useSelector((state) => state.NotesReducer);
  const GroupsReducer = useSelector((state) => state.GroupsReducer);
  const ResolutionReducer = useSelector((state) => state.ResolutionReducer);
  const RealtimeNotification = useSelector(
    (state) => state.RealtimeNotification
  );
  const OrganizationBillingReducer = useSelector(
    (state) => state.OrganizationBillingReducer
  );
  const PollsReducer = useSelector((state) => state.PollsReducer);
  const NewMeetingreducer = useSelector((state) => state.NewMeetingreducer);
  const LanguageReducer = useSelector((state) => state.LanguageReducer);
  const webViewer = useSelector((state) => state.webViewer);
  const MeetingOrganizersReducer = useSelector(
    (state) => state.MeetingOrganizersReducer
  );
  const MeetingAgendaReducer = useSelector(
    (state) => state.MeetingAgendaReducer
  );
  const attendanceMeetingReducer = useSelector(
    (state) => state.attendanceMeetingReducer
  );
  const actionMeetingReducer = useSelector(
    (state) => state.actionMeetingReducer
  );
  const AgendaWiseAgendaListReducer = useSelector(
    (state) => state.AgendaWiseAgendaListReducer
  );
  const DataRoomReducer = useSelector((state) => state.DataRoomReducer);
  const DataRoomFileAndFoldersDetailsReducer = useSelector(
    (state) => state.DataRoomFileAndFoldersDetailsReducer
  );
  const SignatureWorkFlowReducer = useSelector(
    (state) => state.SignatureWorkFlowReducer
  );
  const UserMangementReducer = useSelector(
    (state) => state.UserMangementReducer
  );

  const ManageAuthorityReducer = useSelector(
    (state) => state.ManageAuthorityReducer
  );
  const adminReducer = useSelector((state) => state.adminReducer);
  const UserReportReducer = useSelector((state) => state.UserReportReducer);
  const MinutesReducer = useSelector((state) => state.MinutesReducer);
  const ComplianceReducer = useSelector(
    (state) => state.ComplainceSettingReducerReducer
  );
  const [showLoader, setShowLoader] = useState(false);
  const DashboardRoute =
    window.location.pathname === "/Diskus" ||
    window.location.pathname === "/Diskus/";
  console.log({ NewMeetingreducer }, "NewMeetingreducerNewMeetingreducer");
  const isLoading = [
    NewMeetingreducer?.Loading,
    auth?.Loading,
    assignees?.Loading,
    MeetingOrganizersReducer?.LoadingMeetingOrganizer,
    MeetingOrganizersReducer?.Loading,
    PollsReducer?.Loading,
    CommitteeReducer?.Loading,
    toDoListReducer?.Loading,
    todoStatus?.Loading,
    getTodosStatus?.Loading,
    MeetingAgendaReducer?.Loading,
    actionMeetingReducer?.Loading,
    AgendaWiseAgendaListReducer?.loading,
    downloadReducer?.Loading,
    attendanceMeetingReducer?.Loading,
    webViewer?.Loading,
    LanguageReducer?.Loading,
    uploadReducer?.Loading,
    settingReducer?.Loading,
    fAQsReducer?.Loading,
    meetingIdReducer?.Loading,
    calendarReducer?.Loading,
    postAssigneeComments?.Loading,
    VideoChatReducer?.Loading,
    minuteofMeetingReducer?.Loading,
    countryNamesReducer?.Loading,
    GetSubscriptionPackage?.Loading,
    Authreducer?.Loading,
    roleListReducer?.Loading,
    NotesReducer?.Loading,
    GroupsReducer?.Loading,
    GroupsReducer?.getAllLoading,
    ResolutionReducer?.Loading,
    RealtimeNotification?.Loading,
    OrganizationBillingReducer?.Loading,
    DataRoomReducer?.Loading,
    MinutesReducer?.Loading,
    // UserManagementModals?.Loading,
    DataRoomFileAndFoldersDetailsReducer?.Loading,
    SignatureWorkFlowReducer?.Loading,
    adminReducer?.Loading,
    UserReportReducer?.Loading,
    UserMangementReducer?.Loading,
    ManageAuthorityReducer?.Loading,
    ComplianceReducer?.Loading,
  ].some((loading) => loading);

  useEffect(() => {
    let timeout;

    if (
      toDoListReducer.taskFromDashboard !== 0 ||
      NotesReducer.notesFromDashboard !== 0 ||
      meetingIdReducer?.moreEventsLoader ||
      (isLoading && !DashboardRoute)
    ) {
      setShowLoader(true); // Show loader
    } else {
      // Hide loader after a short delay when loading completes
      timeout = setTimeout(() => {
        setShowLoader(false);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [
    isLoading,
    DashboardRoute,
    toDoListReducer?.taskFromDashboard,
    NotesReducer?.notesFromDashboard,
    meetingIdReducer?.moreEventsLoader,
  ]);

  if (showLoader) {
    return (
      <section className="spinLoaderMain">
        <Spin size="large" tip="Loading" />
      </section>
    );
  } else {
    return null;
  }
};

export default SpinComponent;
