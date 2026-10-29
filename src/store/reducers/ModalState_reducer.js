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
  isAdvanceMeetingRoute: null,
  isProposedMeetingRoute: null,

  // ─── Unsaved Changes Modal ───────────────────────────────────────────────
  isUnsavedChangesModal: false,

  // ─── Leave Meeting Modal ─────────────────────────────────────────────────
  isLeaveMeetingModal: false,

  // ─── End Meeting Modal ───────────────────────────────────────────────────
  isEndMeetingModal: false,

  // ─── Create & Edit / View Meeting Tabs ───────────────────────────────────
  // One string per screen: the name of the tab that is showing.
  //   create/edit: meetingDetails | organizers | agendaContributors | participants
  //                | agenda | meetingMaterial | minutes | actionsPage | polls | attendance
  //   view:        meetingDetails | organizers | agendaContributors | participants
  //                | agenda | agendaViewer | minutes | actionsPage | polls | attendance
  //                | attendees | isRecording
  createEditActiveTab: "meetingDetails",
  viewActiveTab: "meetingDetails",
  isParticiapntRespondProposedMeeting: false,
  isOrganizerRespondProposedMeeting: false,
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

    case actions.SET_PROPOSED_MEETING_ROUTE: {
      return { ...state, isProposedMeetingRoute: action.payload };
    }
    case actions.TOGGLE_UNSAVED_CHANGES_MODAL:
      return { ...state, isUnsavedChangesModal: action.payload };

    case actions.TOGGLE_LEAVE_MEETING_MODAL:
      return { ...state, isLeaveMeetingModal: action.payload };

    case actions.TOGGLE_END_MEETING_MODAL:
      return { ...state, isEndMeetingModal: action.payload };
    // ─── Create & Edit Meeting Tabs ──────────────────────────────────────────────
    case actions.PARTICIPANT_RESPOND_PROPOSED_MEETING_DATES: {
      return { ...state, isParticiapntRespondProposedMeeting: action.payload };
    }
    case actions.ORGANIZER_RESPONSE_PROPOSED_MEETING_DATES: {
      return { ...state, isOrganizerRespondProposedMeeting: action.payload };
    }
    case actions.SET_CREATE_EDIT_TAB:
      return { ...state, createEditActiveTab: action.payload };

    case actions.RESET_CREATE_EDIT_TABS:
      return { ...state, createEditActiveTab: "meetingDetails" };

    // ─── View Meeting Tabs ────────────────────────────────────────────────────────

    case actions.SET_VIEW_TAB:
      return { ...state, viewActiveTab: action.payload };

    case actions.RESET_VIEW_TABS:
      return { ...state, viewActiveTab: "meetingDetails" };

    default:
      return { ...state };
  }
};

export default ModalStatesReducer;
