import {
  MEETING_STATUS,
  PARTICIPANT_ROLE,
  MEETING_VIEWS,
} from "./meeting.constants";

export const isMeetingActive = (status) => {
  return Number(status) === MEETING_STATUS.ACTIVE;
};

export const isMeetingPublished = (status) => {
  return Number(status) === MEETING_STATUS.PUBLISHED;
};

export const getParticipantRole = (roleId) => {
  if (roleId === PARTICIPANT_ROLE.ORGANIZER) return "Organizer";
  if (roleId === PARTICIPANT_ROLE.PARTICIPANT) return "Participant";
  if (roleId === PARTICIPANT_ROLE.AGENDA_CONTRIBUTOR)
    return "Agenda Contributor";
  return "Organizer";
};

export const buildVideoTalk = (data) => ({
  isChat: data.isChat,
  isVideoCall: data.isVideoCall,
  talkGroupID: data.talkGroupID,
});

export const buildEditorRole = (data, role) => ({
  status: data.statusID || data.status,
  role: role,
  isPrimaryOrganizer: data.isPrimaryOrganizer || false,
});

export const getMeetingFilters = (view) => ({
  PublishedMeetings: view === MEETING_VIEWS.PUBLISHED,
  ProposedMeetings: view === MEETING_VIEWS.PROPOSED,
});
