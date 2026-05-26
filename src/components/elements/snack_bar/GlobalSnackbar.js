import React from "react";
import useSnackbar from "./useSnackbar";

/**
 * GlobalSnackbar
 *
 * Drop this once inside your app layout (e.g. App.js or the root Layout component).
 * It watches every reducer's ResponseMessage + errorSeverity and automatically shows
 * a toast whenever any API action completes — no per-component snackbar wiring needed.
 *
 * @example
 *   // App.js or Layout.js
 *   import GlobalSnackbar from "components/elements/snack_bar/GlobalSnackbar";
 *   ...
 *   return (
 *     <>
 *       <GlobalSnackbar />
 *       <YourRoutes />
 *     </>
 *   );
 */

// Defined outside the component so the array reference is stable across renders
const WATCH_CONFIGS = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  {
    selector: (s) => s.auth.ResponseMessage,
    severitySelector: (s) => s.auth.errorSeverity,
  },
  {
    selector: (s) => s.Authreducer.ResponseMessage,
    severitySelector: (s) => s.Authreducer.errorSeverity,
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  {
    selector: (s) => s.adminReducer.ResponseMessage,
    severitySelector: (s) => s.adminReducer.errorSeverity,
  },

  // ── Meetings ──────────────────────────────────────────────────────────────
  {
    selector: (s) => s.NewMeetingreducer.ResponseMessage,
    severitySelector: (s) => s.NewMeetingreducer.errorSeverity,
  },
  {
    selector: (s) => s.MeetingAgendaReducer.ResponseMessage,
    severitySelector: (s) => s.MeetingAgendaReducer.errorSeverity,
  },
  {
    selector: (s) => s.MeetingOrganizersReducer.ResponseMessage,
    severitySelector: (s) => s.MeetingOrganizersReducer.errorSeverity,
  },
  {
    selector: (s) => s.MinutesReducer.ResponseMessage,
    severitySelector: (s) => s.MinutesReducer.errorSeverity,
  },
  {
    selector: (s) => s.minuteofMeetingReducer.ResponseMessage,
    severitySelector: (s) => s.minuteofMeetingReducer.errorSeverity,
  },
  {
    selector: (s) => s.attendanceMeetingReducer.ResponseMessage,
    severitySelector: (s) => s.attendanceMeetingReducer.errorSeverity,
  },
  {
    selector: (s) => s.actionMeetingReducer.ResponseMessage,
    severitySelector: (s) => s.actionMeetingReducer.errorSeverity,
  },
  {
    selector: (s) => s.meetingIdReducer.ResponseMessage,
    severitySelector: (s) => s.meetingIdReducer.errorSeverity,
  },

  // AgendaWise uses lowercase responseMessage
  {
    selector: (s) => s.AgendaWiseAgendaListReducer.responseMessage,
    severitySelector: (s) => s.AgendaWiseAgendaListReducer.errorSeverity,
  },

  // ── Polls ─────────────────────────────────────────────────────────────────
  {
    selector: (s) => s.PollsReducer.ResponseMessage,
    severitySelector: (s) => s.PollsReducer.errorSeverity,
  },

  // ── Data Room & Signatures ────────────────────────────────────────────────
  {
    selector: (s) => s.DataRoomReducer.ResponseMessage,
    severitySelector: (s) => s.DataRoomReducer.errorSeverity,
  },
  {
    selector: (s) => s.DataRoomFileAndFoldersDetailsReducer.ResponseMessage,
    severitySelector: (s) =>
      s.DataRoomFileAndFoldersDetailsReducer.errorSeverity,
  },
  {
    selector: (s) => s.SignatureWorkFlowReducer.ResponseMessage,
    severitySelector: (s) => s.SignatureWorkFlowReducer.errorSeverity,
  },

  // ── Committee / Groups / Resolution ───────────────────────────────────────
  {
    selector: (s) => s.CommitteeReducer.ResponseMessage,
    severitySelector: (s) => s.CommitteeReducer.errorSeverity,
  },
  {
    selector: (s) => s.GroupsReducer.ResponseMessage,
    severitySelector: (s) => s.GroupsReducer.errorSeverity,
  },
  {
    selector: (s) => s.ResolutionReducer.ResponseMessage,
    severitySelector: (s) => s.ResolutionReducer.errorSeverity,
  },

  // ── Compliance ────────────────────────────────────────────────────────────
  {
    selector: (s) => s.ComplainceSettingReducerReducer.ResponseMessage,
    severitySelector: (s) => s.ComplainceSettingReducerReducer.errorSeverity,
  },

  // ── ToDo & Notes ──────────────────────────────────────────────────────────
  {
    selector: (s) => s.toDoListReducer.ResponseMessage,
    severitySelector: (s) => s.toDoListReducer.errorSeverity,
  },
  {
    selector: (s) => s.getTodosStatus.ResponseMessage,
    severitySelector: (s) => s.getTodosStatus.errorSeverity,
  },
  {
    selector: (s) => s.todoStatus.ResponseMessage,
    severitySelector: (s) => s.todoStatus.errorSeverity,
  },
  {
    selector: (s) => s.postAssigneeComments.ResponseMessage,
    severitySelector: (s) => s.postAssigneeComments.errorSeverity,
  },
  {
    selector: (s) => s.NotesReducer.ResponseMessage,
    severitySelector: (s) => s.NotesReducer.errorSeverity,
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  {
    selector: (s) => s.settingReducer.ResponseMessage,
    severitySelector: (s) => s.settingReducer.errorSeverity,
  },

  // ── User Management ───────────────────────────────────────────────────────
  {
    selector: (s) => s.UserMangementReducer.ResponseMessage,
    severitySelector: (s) => s.UserMangementReducer.errorSeverity,
  },
  {
    selector: (s) => s.UserManagementModals.ResponseMessage,
    severitySelector: (s) => s.UserManagementModals.errorSeverity,
  },
  {
    selector: (s) => s.ManageAuthorityReducer.ResponseMessage,
    severitySelector: (s) => s.ManageAuthorityReducer.errorSeverity,
  },
  {
    selector: (s) => s.UserReportReducer.ResponseMessage,
    severitySelector: (s) => s.UserReportReducer.errorSeverity,
  },

  // ── Video & Talk ──────────────────────────────────────────────────────────
  {
    selector: (s) => s.VideoMainReducer.ResponseMessage,
    severitySelector: (s) => s.VideoMainReducer.errorSeverity,
  },
  {
    selector: (s) => s.videoFeatureReducer.ResponseMessage,
    severitySelector: (s) => s.videoFeatureReducer.errorSeverity,
  },
  {
    selector: (s) => s.GuestVideoReducer.ResponseMessage,
    severitySelector: (s) => s.GuestVideoReducer.errorSeverity,
  },
  {
    selector: (s) => s.talkStateData.ResponseMessage,
    severitySelector: (s) => s.talkStateData.errorSeverity,
  },

  // ── Billing & Subscriptions ───────────────────────────────────────────────
  {
    selector: (s) => s.OrganizationBillingReducer.ResponseMessage,
    severitySelector: (s) => s.OrganizationBillingReducer.errorSeverity,
  },
  {
    selector: (s) => s.GetSubscriptionPackage.ResponseMessage,
    severitySelector: (s) => s.GetSubscriptionPackage.errorSeverity,
  },

  // ── Misc ──────────────────────────────────────────────────────────────────
  {
    selector: (s) => s.uploadReducer.ResponseMessage,
    severitySelector: (s) => s.uploadReducer.errorSeverity,
  },
  {
    selector: (s) => s.downloadReducer.ResponseMessage,
    severitySelector: (s) => s.downloadReducer.errorSeverity,
  },
  {
    selector: (s) => s.LanguageReducer.ResponseMessage,
    severitySelector: (s) => s.LanguageReducer.errorSeverity,
  },
  {
    selector: (s) => s.roleListReducer.ResponseMessage,
    severitySelector: (s) => s.roleListReducer.errorSeverity,
  },
  {
    selector: (s) => s.assignees.ResponseMessage,
    severitySelector: (s) => s.assignees.errorSeverity,
  },
  {
    selector: (s) => s.calendarReducer.ResponseMessage,
    severitySelector: (s) => s.calendarReducer.errorSeverity,
  },
  {
    selector: (s) => s.countryNamesReducer.ResponseMessage,
    severitySelector: (s) => s.countryNamesReducer.errorSeverity,
  },
  {
    selector: (s) => s.fAQsReducer.ResponseMessage,
    severitySelector: (s) => s.fAQsReducer.errorSeverity,
  },
  {
    selector: (s) => s.webViewer.ResponseMessage,
    severitySelector: (s) => s.webViewer.errorSeverity,
  },
];

const GlobalSnackbar = () => {
  const [, SnackBar] = useSnackbar(WATCH_CONFIGS);
  return SnackBar;
};

export default GlobalSnackbar;
