/**
 * @file store.js
 * @description Redux store configuration.
 *
 * Features:
 * - Redux Toolkit `configureStore`
 * - Redux DevTools enabled conditionally
 * - Global reset on logout via `SET_INITIAL_ALLSTATE`
 * - Redux Thunk middleware
 * - Immutable check disabled for performance
 */

import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore } from "@reduxjs/toolkit";

import {
  authReducer,
  toDoListReducer,
  settingReducer,
  TodoStatus,
  postAssigneeComments,
  VideoChatReducer,
  minuteofMeetingReducer,
  adminReducer,
  countryNamesReducer,
  GetSubscriptionPackages,
  AuthReducer,
  getTodosStatus,
  NotesReducer,
  videoCallReducer,
  talkReducer,
  talkFeatureReducer,
  LanguageReducer,
  CommitteeReducer,
  GroupsReducer,
  ResolutionReducer,
  RealtimeNotificationReducer,
  OrganizationBillingReducer,
  MeetingOrganizersReducer,
  MeetingAgendaReducer,
  MinutesReducer,
  DataRoomReducer,
  PollsReducer,
  NewMeetingReducer,
  VideoMainReducer,
  videoFeatureReducer,
  AgendaWiseAgendaListReducer,
  downloadReducer,
  DataRoomFileAndFoldersDetailsReducer,
  UserReportReducer,
  SignatureWorkFlowReducer,
  GuestVideoReducer,
  assigneesReducer,
  calendarReducer,
  OnBoardModalStates,
  RoleListReducer,
  webViewerReducer,
} from "./reducers";

import * as actions from "./action_types";

import uploadReducer from "./reducers/Upload_reducer";
import fAQsReducer from "./reducers/Get_Faqs_reducer";
import meetingIdReducer from "./reducers/GetMeetingId_reducer";

// Attendance Reducers
import attendanceMeetingReducer from "./reducers/Attendance_Reducer";
import actionMeetingReducer from "./reducers/ActionMeeting_Reducer";

// User Management
import UserManagementModals from "./reducers/UserManagementModals";
import UserMangementReducer from "./reducers/UserManagementReducer";
import ManageAuthorityReducer from "./reducers/ManageAuthorityReducer";

// Compliance & Modal States
import ComplainceSettingReducerReducer from "./reducers/ComplainSettingReducer";
// import ModalStatesReducer from "./reducers/ModalState_reducer";

/**
 * Root application reducer
 */
const AppReducer = combineReducers({
  auth: authReducer,
  toDoListReducer,
  uploadReducer,
  settingReducer,
  fAQsReducer,
  meetingIdReducer,
  assignees: assigneesReducer,
  calendarReducer,
  OnBoardModal: OnBoardModalStates,
  todoStatus: TodoStatus,
  downloadReducer,
  postAssigneeComments,
  VideoChatReducer,
  videoFeatureReducer,
  minuteofMeetingReducer,
  countryNamesReducer,
  GetSubscriptionPackage: GetSubscriptionPackages,

  // Auth
  Authreducer: AuthReducer,

  // Admin
  adminReducer,
  roleListReducer: RoleListReducer,

  // Todo
  getTodosStatus,

  // Notes
  NotesReducer,

  // Video
  videoCall: videoCallReducer,
  VideoMainReducer,
  GuestVideoReducer,

  // Talk
  talkStateData: talkReducer,
  talkFeatureStates: talkFeatureReducer,

  // Committee / Groups / Resolution
  CommitteeReducer,
  GroupsReducer,
  ResolutionReducer,

  // Notifications
  RealtimeNotification: RealtimeNotificationReducer,

  // Billing
  OrganizationBillingReducer,

  // Data Room
  DataRoomReducer,
  DataRoomFileAndFoldersDetailsReducer,

  // Polls
  PollsReducer,

  // Meetings
  NewMeetingreducer: NewMeetingReducer,
  MeetingOrganizersReducer,
  MeetingAgendaReducer,
  MinutesReducer,
  AgendaWiseAgendaListReducer,

  // Attendance & Actions
  attendanceMeetingReducer,
  actionMeetingReducer,

  // Reports
  UserReportReducer,

  // Signature Workflow
  SignatureWorkFlowReducer,

  // Language
  LanguageReducer,

  // Web Viewer
  webViewer: webViewerReducer,

  // User Management
  UserManagementModals,
  UserMangementReducer,
  ManageAuthorityReducer,

  // Compliance
  ComplainceSettingReducerReducer,

  // Modal States
  // ModalStatesReducer,
});

// All store slice keys that carry ResponseMessage / responseMessage.
// Used by the universal CLEAR_RESPONSE_MESSAGE handler below.
const RESPONSE_MESSAGE_SLICE_KEYS = [
  "auth",
  "Authreducer",
  "adminReducer",
  "toDoListReducer",
  "uploadReducer",
  "settingReducer",
  "fAQsReducer",
  "meetingIdReducer",
  "assignees",
  "calendarReducer",
  "downloadReducer",
  "postAssigneeComments",
  "videoFeatureReducer",
  "minuteofMeetingReducer",
  "countryNamesReducer",
  "GetSubscriptionPackage",
  "roleListReducer",
  "getTodosStatus",
  "todoStatus",
  "NotesReducer",
  "VideoMainReducer",
  "GuestVideoReducer",
  "talkStateData",
  "CommitteeReducer",
  "GroupsReducer",
  "ResolutionReducer",
  "OrganizationBillingReducer",
  "DataRoomReducer",
  "DataRoomFileAndFoldersDetailsReducer",
  "PollsReducer",
  "NewMeetingreducer",
  "MeetingOrganizersReducer",
  "MeetingAgendaReducer",
  "MinutesReducer",
  "AgendaWiseAgendaListReducer",
  "attendanceMeetingReducer",
  "actionMeetingReducer",
  "UserReportReducer",
  "SignatureWorkFlowReducer",
  "LanguageReducer",
  "webViewer",
  "UserManagementModals",
  "UserMangementReducer",
  "ManageAuthorityReducer",
  "ComplainceSettingReducerReducer",
];

/**
 * Global root reducer
 * Resets entire redux state on logout.
 * Handles CLEAR_RESPONSE_MESSAGE universally across all slices so that
 * GlobalSnackbar can clear consumed messages without per-reducer boilerplate.
 */
const rootReducer = (state, action) => {
  if (action.type === actions.SET_INITIAL_ALLSTATE) {
    state = undefined;
  }

  const newState = AppReducer(state, action);

  if (action.type === actions.CLEAR_RESPONSE_MESSAGE) {
    return RESPONSE_MESSAGE_SLICE_KEYS.reduce((acc, key) => {
      const slice = acc[key];
      if (!slice) return acc;
      const patch = {};
      if ("ResponseMessage" in slice) patch.ResponseMessage = "";
      if ("responseMessage" in slice) patch.responseMessage = "";
      if ("errorSeverity" in slice) patch.errorSeverity = null;
      return Object.keys(patch).length
        ? { ...acc, [key]: { ...slice, ...patch } }
        : acc;
    }, newState);
  }

  return newState;
};

/**
 * Redux DevTools enhancer
 */
const devTools =
  process.env.NODE_ENV !== "production"
    ? composeWithDevTools({
        trace: true,
        traceLimit: 25,
      })
    : undefined;

/**
 * Configure Redux Store
 */
const store = configureStore({
  reducer: rootReducer,

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: false,
      serializableCheck: false,
    }).concat(thunk),

  // enhancers: (getDefaultEnhancers) => {
  //   const enhancers = getDefaultEnhancers();

  //   if (devTools) {
  //     enhancers.push(devTools);
  //   }

  //   return enhancers;
  // },
});

export default store;