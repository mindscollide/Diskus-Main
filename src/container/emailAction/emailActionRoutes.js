/**
 * Maps actionType strings (returned by ServiceManager.ValidateEmailActionToken)
 * to the localStorage key to store the payload and the route to navigate to.
 *
 * To add a new email action:
 *   1. Add an entry here with a unique ACTION_TYPE key
 *   2. Ensure the target page reads that localStorage key on mount
 */
export const EMAIL_ACTION_ROUTES = {
  // --- Meeting ---
  VIEW_MEETING: {
    key: "viewMeetingLink",
    route: "/Diskus/Meeting",
  },
  RSVP: {
    key: "RSVP",
    route: "/Diskus/Meeting/Useravailabilityformeeting",
  },
  MEETING_START: {
    key: "meetingStr",
    route: "/Diskus/Meeting",
  },
  MEETING_UPDATE: {
    key: "meetingUpd",
    route: "/Diskus/Meeting",
  },
  MEETING_CANCEL: {
    key: "meetingCanc",
    route: "/Diskus/Meeting",
  },
  MEETING_PROPOSED: {
    key: "meetingprop",
    route: "/Diskus/Meeting",
  },
  MEETING_PROPOSED_DATE_POLL: {
    key: "UserMeetPropoDatPoll",
    route: "/Diskus/Meeting",
  },
  MEETING_AGENDA_UPDATE: {
    key: "mtAgUpdate",
    route: "/Diskus/Meeting",
  },
  MEETING_MINUTE_COLLAB: {
    key: "meetingMin",
    route: "/Diskus/Meeting",
  },
  VIEW_SUBMITTED_MINUTES: {
    key: "reviewSubmittedMinutesLink",
    route: "/Diskus/Meeting",
  },
  VIEW_PUBLISH_MINUTES: {
    key: "viewPublishMinutesLink",
    route: "/Diskus/Meeting",
  },

  // --- Minutes ---
  VIEW_MINUTES: {
    key: "reviewMinutesLink",
    route: "/Diskus/Minutes",
  },
  SIGN_DOCUMENT: {
    key: "docSignAction",
    route: "/Diskus/Minutes",
  },
  SIGNED_DOCUMENT: {
    key: "docSignedAction",
    route: "/Diskus/Minutes",
  },

  // --- Data Room ---
  VIEW_DATAROOM: {
    key: "DataRoomEmail",
    route: "/Diskus/dataroom",
  },
  VIEW_FOLDER: {
    key: "viewFolderLink",
    route: "/Diskus/dataroom",
  },
  VIEW_DOCUMENT: {
    key: "documentViewer",
    route: "/Diskus/dataroom",
  },
  SIGNED_CR_DOCUMENT: {
    key: "docSignedCrAction",
    route: "/Diskus/dataroom",
  },

  // --- Polling ---
  POLL_EXPIRE: {
    key: "pollExpire",
    route: "/Diskus/polling",
  },
  POLL_PUBLISHED: {
    key: "poPub",
    route: "/Diskus/polling",
  },
  POLL_UPDATE: {
    key: "poUpda",
    route: "/Diskus/polling",
  },

  // --- Resolution ---
  RESOLUTION_REMINDER: {
    key: "resVot",
    route: "/Diskus/resolution",
  },
  RESOLUTION_VOTER: {
    key: "resVot",
    route: "/Diskus/resolution",
  },
  RESOLUTION_NON_VOTER: {
    key: "resNonVot",
    route: "/Diskus/resolution",
  },

  // --- Committee ---
  VIEW_COMMITTEE: {
    key: "committeeView_Id",
    route: "/Diskus/committee",
  },
  VIEW_COMMITTEE_LIST: {
    key: "committeeList",
    route: "/Diskus/committee",
  },

  // --- Groups ---
  VIEW_GROUP: {
    key: "groupView_Id",
    route: "/Diskus/groups",
  },
  VIEW_GROUP_LIST: {
    key: "groupList",
    route: "/Diskus/groups",
  },

  // --- Tasks ---
  VIEW_TASK: {
    key: "taskListView_Id",
    route: "/Diskus/todolist",
  },
  VIEW_TASK_LIST: {
    key: "taskListView",
    route: "/Diskus/todolist",
  },
};
