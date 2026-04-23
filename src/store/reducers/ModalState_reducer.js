import * as actions from "../action_types";

const initialState = {
  // ─── Modal Visibility ────────────────────────────────────────────────────
  isCreateEditMeetingModal: false,
  isCreateEditQuickMeetingModal: false,
  isCreateEditProposedMeetingModal: false,
  isViewMeetingModal: false,
  isViewQuickMeetingModal: false,
  isViewProposedMeetingModal: false,

  // ─── Advance Meeting Route ───────────────────────────────────────────────
  // 1 = Create Main Advance Meeting, 2 = Edit Main Advance Meeting
  isAdvanceMeetingRoute: 1,

  // ─── Unsaved Changes Modal ───────────────────────────────────────────────
  isUnsavedChangesModal: false,

  // ─── Leave Meeting Modal ─────────────────────────────────────────────────
  isLeaveMeetingModal: false,

  // ─── End Meeting Modal ───────────────────────────────────────────────────
  isEndMeetingModal: false,

  // ─── Create & Edit Meeting Tabs ──────────────────────────────────────────
  // Only one should be true at a time
  createEditTabs: {
    meetingDetails: true, // default landing tab
    organizers: false,
    agendaContributors: false,
    participants: false,
    agenda: false,
    meetingMaterial: false,
    minutes: false,
    attendance: false,
    recording: false,
    polls: false,
    actions: false,
  },

  // ─── View Meeting Tabs ───────────────────────────────────────────────────
  // Only one should be true at a time
  viewTabs: {
    meetingDetails: true, // default landing tab
    organizers: false,
    agendaContributors: false,
    participants: false,
    agenda: false,
    agendaViewer: false,
    minutes: false,
    attendance: false,
    recording: false,
    polls: false,
    actions: false,
    attendees: false,
  },
};
const ModalStatesReducer = (state = initialState, action) => {
  switch (action.type) {
    // ─── Modal Toggles ─────────────────────────────────────────────────────

    case actions.TOGGLE_CREATE_EDIT_MEETING_MODAL:
      return { ...state, isCreateEditMeetingModal: action.payload };

    case actions.TOGGLE_CREATE_EDIT_QUICK_MEETING_MODAL:
      return { ...state, isCreateEditQuickMeetingModal: action.payload };

    case actions.TOGGLE_CREATE_EDIT_PROPOSED_MEETING_MODAL:
      return { ...state, isCreateEditProposedMeetingModal: action.payload };

    case actions.TOGGLE_VIEW_MEETING_MODAL:
      return { ...state, isViewMeetingModal: action.payload };

    case actions.TOGGLE_VIEW_QUICK_MEETING_MODAL:
      return { ...state, isViewQuickMeetingModal: action.payload };

    case actions.TOGGLE_VIEW_PROPOSED_MEETING_MODAL:
      return { ...state, isViewProposedMeetingModal: action.payload };

    case actions.SET_ADVANCE_MEETING_ROUTE:
      return { ...state, isAdvanceMeetingRoute: action.payload };

    case actions.TOGGLE_UNSAVED_CHANGES_MODAL:
      return { ...state, isUnsavedChangesModal: action.payload };

    case actions.TOGGLE_LEAVE_MEETING_MODAL:
      return { ...state, isLeaveMeetingModal: action.payload };

    case actions.TOGGLE_END_MEETING_MODAL:
      return { ...state, isEndMeetingModal: action.payload };
    // ─── Create & Edit Meeting Tabs ──────────────────────────────────────────────

    case actions.SET_CREATE_EDIT_TAB:
      return {
        ...state,
        createEditTabs: {
          meetingDetails: false,
          organizers: false,
          agendaContributors: false,
          participants: false,
          agenda: false,
          meetingMaterial: false,
          minutes: false,
          attendance: false,
          recording: false,
          polls: false,
          actions: false,
          [action.payload]: true,
        },
      };

    case actions.RESET_CREATE_EDIT_TABS:
      return {
        ...state,
        createEditTabs: {
          meetingDetails: true, // back to default
          organizers: false,
          agendaContributors: false,
          participants: false,
          agenda: false,
          agendaViewer: false,
          minutes: false,
          attendance: false,
          recording: false,
          polls: false,
          actions: false,
        },
      };

    // ─── View Meeting Tabs ────────────────────────────────────────────────────────

    case actions.SET_VIEW_TAB:
      return {
        ...state,
        viewTabs: {
          meetingDetails: false,
          organizers: false,
          agendaContributors: false,
          agenda: false,
          agendaViewer: false,
          minutes: false,
          attendance: false,
          recording: false,
          polls: false,
          actions: false,
          attendees: false,
          [action.payload]: true,
        },
      };

    case actions.RESET_VIEW_TABS:
      return {
        ...state,
        viewTabs: {
          meetingDetails: true,
          agendaContributors: false,
          agenda: false, // back to default
          agendaViewer: false,
          organizers: false,
          minutes: false,
          attendance: false,
          recording: false,
          polls: false,
          actions: false,
          attendees: false,
        },
      };

    default:
      return { ...state };
  }
};

export default ModalStatesReducer;
