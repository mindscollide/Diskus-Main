// Modal action creators — import and dispatch these from your components
import * as actions from "../action_types";

export const toggleCreateEditMeetingModal = (value) => ({
  type: actions.TOGGLE_CREATE_EDIT_MEETING_MODAL,
  payload: value,
});

export const toggleCreateEditQuickMeetingModal = (value) => ({
  type: actions.TOGGLE_CREATE_EDIT_QUICK_MEETING_MODAL,
  payload: value,
});

export const toggleCreateEditProposedMeetingModal = (value) => ({
  type: actions.TOGGLE_CREATE_EDIT_PROPOSED_MEETING_MODAL,
  payload: value,
});

export const toggleViewMeetingModal = (value) => ({
  type: actions.TOGGLE_VIEW_MEETING_MODAL,
  payload: value,
});

export const toggleViewQuickMeetingModal = (value) => ({
  type: actions.TOGGLE_VIEW_QUICK_MEETING_MODAL,
  payload: value,
});

export const toggleViewProposedMeetingModal = (value) => ({
  type: actions.TOGGLE_VIEW_PROPOSED_MEETING_MODAL,
  payload: value,
});

export const setAdvanceMeetingRoute = (value) => ({
  type: actions.SET_ADVANCE_MEETING_ROUTE,
  payload: value, // 1 = Create, 2 = Edit
});

export const toggleUnsavedChangesModal = (value) => ({
  type: actions.TOGGLE_UNSAVED_CHANGES_MODAL,
  payload: value,
});

export const toggleLeaveMeetingModal = (value) => ({
  type: actions.TOGGLE_LEAVE_MEETING_MODAL,
  payload: value,
});

export const toggleEndMeetingModal = (value) => ({
  type: actions.TOGGLE_END_MEETING_MODAL,
  payload: value,
});

// ─── Create & Edit Meeting Tabs ───────────────────────────────────────────────

export const setCreateEditTab = (tabName) => ({
  type: actions.SET_CREATE_EDIT_TAB,
  payload: tabName,
});

export const resetCreateEditTabs = () => ({
  type: actions.RESET_CREATE_EDIT_TABS,
});

// ─── View Meeting Tabs ────────────────────────────────────────────────────────

export const setViewTab = (tabName) => ({
  type: actions.SET_VIEW_TAB,
  payload: tabName,
});

export const resetViewTabs = () => ({
  type: actions.RESET_VIEW_TABS,
});
