import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ResponseMessagesCom = () => {
  const state = useSelector((state) => state);
  let responseMessages = {
    auth: {
      ResponseMessage: "",
    },
    toDoListReducer: {
      ResponseMessage: "",
    },
    uploadReducer: {
      ResponseMessage: "",
    },
    fAQsReducer: {
      ResponseMessage: "",
    },
    meetingIdReducer: {
      ResponseMessage: "",
    },
    assignees: {
      ResponseMessage: "",
    },
    calendarReducer: {
      ResponseMessage: "",
    },
    todoStatus: {
      ResponseMessage: "",
    },
    downloadReducer: {
      ResponseMessage: "",
    },
    postAssigneeComments: {
      ResponseMessage: "",
    },
    minuteofMeetingReducer: {
      ResponseMessage: "",
    },
    countryNamesReducer: {
      ResponseMessage: "",
    },
    GetSubscriptionPackage: {
      ResponseMessage: "",
    },
    Authreducer: {
      ResponseMessage: "",
    },
    adminReducer: {
      ResponseMessage: "",
    },
    roleListReducer: {
      ResponseMessage: "",
    },
    getTodosStatus: {
      ResponseMessage: "",
    },
    NotesReducer: {
      ResponseMessage: "No Data Available",
    },
    CommitteeReducer: {
      ResponseMessage: "",
    },
    GroupsReducer: {
      ResponseMessage: "",
    },
    ResolutionReducer: {
      ResponseMessage: "",
    },
    OrganizationBillingReducer: {
      ResponseMessage: "",
    },
    DataRoomReducer: {
      ResponseMessage: "",
    },
    PollsReducer: {
      ResponseMessage: "",
    },
    NewMeetingreducer: {
      ResponseMessage: "",
    },
    LanguageReducer: {
      ResponseMessage: "",
    },
    VideoMainReducer: {
      ResponseMessage: "",
    },
    webViewer: {
      ResponseMessage: "",
    },
    MeetingOrganizersReducer: {
      ResponseMessage: "",
    },
    MeetingAgendaReducer: {
      ResponseMessage: "",
    },
    attendanceMeetingReducer: {
      ResponseMessage: "",
    },
    actionMeetingReducer: {
      ResponseMessage: "",
    },
    DataRoomFileAndFoldersDetailsReducer: {
      ResponseMessage: "",
    },
    UserReportReducer: {
      ResponseMessage: "",
    },
    SignatureWorkFlowReducer: {
      ResponseMessage: "",
    },
    UserManagementModals: {
      ResponseMessage: "",
    },
    UserMangementReducer: {
      ResponseMessage: "",
    },
  };

  return <div>ResponseMessagesCom</div>;
};

export default ResponseMessagesCom;
