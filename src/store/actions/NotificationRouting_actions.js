import * as actions from "../action_types";

export const MeetingProposedForOrganizerProposed = (payload) => {
  return {
    type: actions.MEETING_PROPOSED_FOR_ORGANIZER,
    payload,
  };
};

export const MeetingProposedForParticipantProposed = (payload) => {
  return {
    type: actions.MEETING_PROPOSED_FOR_PARTICIPANT,
    payload,
  };
};

export const ViewMeetingDetails = (payload) => {
  return {
    type: actions.MEETING_VIEW_DETAILS,
    payload,
  };
};
