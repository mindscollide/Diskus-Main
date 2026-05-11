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
import ModalStatesReducer from "./reducers/ModalState_reducer";

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
  ModalStatesReducer,
});

/**
 * Global root reducer
 * Resets entire redux state on logout
 */
const rootReducer = (state, action) => {
  if (action.type === actions.SET_INITIAL_ALLSTATE) {
    state = undefined;
  }

  return AppReducer(state, action);
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