import * as actions from "../action_types";

const initialState = {
  MeetingProposedForOrganizer: null,
  MeetingProposedForParticipant: null,
  ViewMeetingDetails: null,
};

const NotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.MEETING_PROPOSED_FOR_ORGANIZER:
      return {
        ...state,
        MeetingProposedForOrganizer: action.payload,
      };

    case actions.MEETING_PROPOSED_FOR_PARTICIPANT:
      return {
        ...state,
        MeetingProposedForParticipant: action.payload,
      };

    case actions.MEETING_VIEW_DETAILS: {
      return {
        ...state,
        ViewMeetingDetails: action.payload,
      };
    }
    default:
      return { ...state };
  }
};

export default NotificationReducer;
