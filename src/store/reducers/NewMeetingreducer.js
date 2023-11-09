import * as actions from "../action_types";

const initialState = {
  Loading: false,
  meetingurlspinner: false,
  ResponseMessage: "",
  adduserModal: false,
  crossConfirmation: false,
  notifyOrganizors: false,
  agendaContributors: false,
  notifyAgendaContributors: false,
  participantModal: false,
  agendaItemRemoved: false,
  mainAgendaItemRemoved: false,
  advancePermissionModal: false,
  advancePermissionConfirmation: false,
  voteAgendaModal: false,
  voteConfirmationModal: false,
  importPreviousAgendaModal: false,
  enableProposedMeetingDate: false,
  prposedMeetingUnsavedModal: false,
  ImportPreviousMinutes: false,
  afterImportState: false,
  unsaveFileUploadMinutes: false,
  unsavedModalScratch: false,
  UnsavedButtonCreateScratch: false,
  unsavedModalImportAgenda: false,
  unsavedActions: false,
  removeTableModal: false,
  unsavedPollsMeeting: false,
  unsavedEditPollsMeeting: false,
  deleteMeetingModal: false,
  endMeetingModal: false,
  endForAllMeeting: false,
  sceduleproposedMeeting: false,
  viewVotesAgenda: false,
  castVoteAgendaPage: false,
  getALlMeetingTypes: [],
  meetingDetails: [],
  getAllReminderFrequency: [],
  recurring: [],
  searchMeetings: null,
  cancelModalMeetingDetails: false,
  cancelModalOrganizer: false,
  cancelAgendaContributor: false,
  cancelPartipants: false,
  cancelAgenda: false,
  cancelMeetingMaterial: false,
  cancelActions: false,
  cancelPolls: false,
  getAllCommitteeAndGroupPartcipants: [],
  getAllPartiicpantsRoles: [],
  getmeetingURL: null,
  saveMeetingParticipants: [],
  getAllAgendaContributors: [],
  getAllSavedparticipants: [],
  sendNotificationOrganizerModal: false,
  getAllMeetingDetails: null,
  getPollsMeetingID: [],
  getMeetingusers: [],
  setMeetingProposeDate: [],
  getAllProposedDates: [],
  meetingResponse: [],
  meetingMaterial: [],
  agendaRights: null,
  attachmentsPermission: [],
  cancelViewModalMeetingDetails: false,
  generalMinutes: [],
  generalMinutesDocument: [],
  generalminutesDocumentForMeeting: [],
  addMinuteID: 0,
  agendaWiseMinutesReducer: [],
  userWiseMeetingProposed: [],
  agendaWiseMinuteID: 0,
  RetriveAgendaWiseDocuments: [],
  setMeetingbyCommitteeID: null,
  getMeetingByCommitteeID: null,
  setMeetingByMeetingID: null,
  getMeetingbyGroupID: null,
  meetingDataRoomMapFolderID: 0,
  setCommitteewithMeetingID: null,
  getCommitteeByMeetingID: null,
  setGroupwithMeetingID: null,
  getGroupwithMeetingID: null,
  scheduleMeetingProposed: "",
  unsaveViewMinutesModal: false,
  unsavedViewPollsModal: false,
};

const NewMeetingreducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SEND_NOTIFICATION_ORGANIZORS_MODAL: {
      return {
        ...state,
        sendNotificationOrganizerModal: action.response,
      };
    }

    case actions.NEW_MEETING_ADDUSER_MODAL: {
      return {
        ...state,
        adduserModal: action.response,
      };
    }
    case actions.CROSS_CONFIRMATION_MODAL: {
      return {
        ...state,
        crossConfirmation: action.response,
      };
    }

    case actions.NOTIFY_ORGANIZORS_MODAL: {
      return {
        ...state,
        notifyOrganizors: action.response,
      };
    }

    case actions.ADD_AGENDA_CONTRIBUTORS: {
      return {
        ...state,
        agendaContributors: action.response,
      };
    }

    case actions.NOTIFY_AGENDA_CONTRIBUTORS: {
      return {
        ...state,
        notifyAgendaContributors: action.response,
      };
    }

    case actions.ADD_PARTICIPANTS_MODAL: {
      return {
        ...state,
        participantModal: action.response,
      };
    }

    case actions.AGENDA_ITEM_REMOVED: {
      return {
        ...state,
        agendaItemRemoved: action.response,
      };
    }

    case actions.MAIN_AGENDA_ITEM_REMOVED: {
      return {
        ...state,
        mainAgendaItemRemoved: action.response,
      };
    }

    case actions.ADVANCED_PERSMISSION_MODAL: {
      return {
        ...state,
        advancePermissionModal: action.response,
      };
    }

    case actions.ADVANCE_PERMISSION_CONFIRMATION: {
      return {
        ...state,
        advancePermissionConfirmation: action.response,
      };
    }

    case actions.VOTE_AGENDA_MODAL: {
      return {
        ...state,
        voteAgendaModal: action.response,
      };
    }

    case actions.VOTE_MODAL_CONFIRMATION: {
      return {
        ...state,
        voteConfirmationModal: action.response,
      };
    }

    case actions.IMPORT_PREVIOUS_AGENDA: {
      return {
        ...state,
        importPreviousAgendaModal: action.response,
      };
    }

    case actions.ENABLE_PROPOSED_MEETING_DATE: {
      return {
        ...state,
        enableProposedMeetingDate: action.response,
      };
    }

    case actions.PROPOSED_MEETING_SAVED_MODAL: {
      return {
        ...state,
        prposedMeetingUnsavedModal: action.response,
      };
    }

    case actions.IMPORT_PREVIOUS_MINUTES: {
      return {
        ...state,
        ImportPreviousMinutes: action.response,
      };
    }

    case actions.AFTER_IMPORT_STATE: {
      return {
        ...state,
        afterImportState: action.response,
      };
    }

    case actions.UNSAVE_MINUTES_FILEUPLOAD: {
      return {
        ...state,
        unsaveFileUploadMinutes: action.response,
      };
    }

    case actions.UNSAVED_CREATE_FROM_SCRATCH: {
      return {
        ...state,
        unsavedModalScratch: action.response,
      };
    }

    case actions.UNSAVED_BUTTON_CREATE_SCRATCH: {
      return {
        ...state,
        UnsavedButtonCreateScratch: action.response,
      };
    }

    case actions.UNSAVED_IMPORT_AGENDA: {
      return {
        ...state,
        unsavedModalImportAgenda: action.response,
      };
    }

    case actions.UNSAVED_MODAL_ACTIONS: {
      return {
        ...state,
        unsavedActions: action.response,
      };
    }

    case actions.REMOVED_TABLE_MODAL: {
      return {
        ...state,
        removeTableModal: action.response,
      };
    }

    case actions.UNSAVED_POLLS_MEETING: {
      return {
        ...state,
        unsavedPollsMeeting: action.response,
      };
    }

    case actions.UNSAVED_EDIT_POLL_MEETING: {
      return {
        ...state,
        unsavedEditPollsMeeting: action.response,
      };
    }

    case actions.DELETE_MEETING_MODAL: {
      return {
        ...state,
        deleteMeetingModal: action.response,
      };
    }

    case actions.END_MEETING_MODAL: {
      return {
        ...state,
        endMeetingModal: action.response,
      };
    }

    case actions.END_MEETING_FOR_ALL: {
      return {
        ...state,
        endForAllMeeting: action.response,
      };
    }

    case actions.SCEDULE_PROPOSED_MEETING: {
      return {
        ...state,
        sceduleproposedMeeting: action.response,
      };
    }

    case actions.VIEW_VOTE_AGENDA: {
      return {
        ...state,
        viewVotesAgenda: action.response,
      };
    }

    case actions.CAST_VOTE_AGENDA: {
      return {
        ...state,
        castVoteAgendaPage: action.response,
      };
    }
    // searchMeetings
    case actions.GET_SEARCH_NEW_MEETINGS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_SEARCH_NEW_MEETINGS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        searchMeetings: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_SEARCH_NEW_MEETINGS_FAIL: {
      return {
        ...state,
        Loading: false,
        searchMeetings: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_NEWMEETINGSTATE: {
      return {
        ...state,
        searchMeetings: null,
      };
    }

    case actions.GET_ALL_MEETING_TYPES_NEW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_MEETING_TYPES_NEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getALlMeetingTypes: action.response,
      };
    }

    case actions.GET_ALL_MEETING_TYPES_NEW_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MEETING_DETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_MEETING_DETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        meetingDetails: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MEETING_DETAILS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_REMINDER_FREQUENCY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_REMINDER_FREQUENCY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllReminderFrequency: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_REMINDER_FREQUENCY_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_RECURRING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_RECURRING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        recurring: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_RECURRING_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.CANCEL_BUTTON_MODAL_MEETING_DETIALS_TAB: {
      return {
        ...state,
        cancelModalMeetingDetails: action.response,
      };
    }

    case actions.CANCEL_BUTTON_MODAL_ORGANIZER: {
      return {
        ...state,
        cancelModalOrganizer: action.response,
      };
    }

    case actions.CANCEL_AGENDA_CONTRIBUTOR: {
      return {
        ...state,
        cancelAgendaContributor: action.response,
      };
    }

    case actions.CANCEL_PARTICIPANTS: {
      return {
        ...state,
        cancelPartipants: action.response,
      };
    }

    case actions.CANCEL_AGENDA: {
      return {
        ...state,
        cancelAgenda: action.response,
      };
    }

    case actions.CANCEL_MEETING_MATERIAL: {
      return {
        ...state,
        cancelMeetingMaterial: action.response,
      };
    }

    case actions.CANCEL_ACTIONS: {
      return {
        ...state,
        cancelActions: action.response,
      };
    }

    case actions.CANCEL_POLLS: {
      return {
        ...state,
        cancelPolls: action.response,
      };
    }

    case actions.ADD_MORE_PARTICIPANTS_MODAL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.ADD_MORE_PARTICIPANTS_MODAL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllCommitteeAndGroupPartcipants: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.ADD_MORE_PARTICIPANTS_MODAL_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_ROLES_PARTICIPANTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_ROLES_PARTICIPANTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllPartiicpantsRoles: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_ROLES_PARTICIPANTS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MEETING_URL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_MEETING_URL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getmeetingURL: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MEETING_URL_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MEETING_URL_SPINNER: {
      return {
        ...state,
        meetingurlspinner: action.response,
      };
    }

    case actions.SAVE_MEETING_PARTICIPANTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_MEETING_PARTICIPANTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveMeetingParticipants: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MEETING_PARTICIPANTS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_AGENDACONTRIBUTORS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_AGENDACONTRIBUTORS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_AGENDACONTRIBUTORS_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_SAVED_PARTICIPATNS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_SAVED_PARTICIPATNS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllSavedparticipants: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_SAVED_PARTICIPATNS_FAILED: {
      return {
        ...state,
        Loading: false,
        getAllSavedparticipants: [],
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_AGENDACONTRIBUTOR_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALL_AGENDACONTRIBUTOR_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllAgendaContributors: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDACONTRIBUTOR_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllAgendaContributors: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SEND_NOTIFICATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SEND_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SEND_NOTIFICATION_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllMeetingDetails: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_FAILED: {
      return {
        ...state,
        Loading: false,
        getAllMeetingDetails: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_POLLS_BY_MEETING_ID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_POLLS_BY_MEETING_ID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getPollsMeetingID: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_POLLS_BY_MEETING_ID_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ALL_MEETING_USER_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_MEETING_USER_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getMeetingusers: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ALL_MEETING_USER_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SET_MEETING_POLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SET_MEETING_POLLS_SUCCESS: {
      return {
        ...state,
        Loading: true,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SET_MEETING_POLLS_FAILED: {
      return {
        ...state,
        Loading: true,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SET_MEETING_PROPOSED_DATE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SET_MEETING_PROPOSED_DATE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        setMeetingProposeDate: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SET_MEETING_PROPOSED_DATE_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ALL_PRPOSED_DATES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_PRPOSED_DATES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllProposedDates: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ALL_PRPOSED_DATES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SET_MEETING_RESPONSE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SET_MEETING_RESPONSE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        meetingResponse: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SET_MEETING_RESPONSE_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    // Aun Work on Meeting Material Init
    case actions.GET_ALL_MEETING_MATERIAL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_MEETING_MATERIAL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        meetingMaterial: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ALL_MEETING_MATERIAL_FAIL: {
      return {
        ...state,
        Loading: false,
        meetingMaterial: [],
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.UPDATE_MEETING_AGENDA_LOCK_STATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPDATE_MEETING_AGENDA_LOCK_STATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.UPDATE_MEETING_AGENDA_LOCK_STATUS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ALL_AGENDA_RIGHTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_AGENDA_RIGHTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        agendaRights: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ALL_AGENDA_RIGHTS_FAILED: {
      return {
        ...state,
        Loading: false,
        agendaRights: null,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SAVE_USER_ATTACHMENT_PERMISSION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_USER_ATTACHMENT_PERMISSION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        attachmentsPermission: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SAVE_USER_ATTACHMENT_PERMISSION_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_GENERAL_MINTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_GENERAL_MINTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        generalMinutes: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_GENERAL_MINTES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_ADD_GENERAL_MINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ADD_GENERAL_MINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        addMinuteID: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ADD_GENERAL_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        addMinuteID: 0,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_GENERAL_MIN_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_GENERAL_MIN_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_GENERAL_MIN_DOCUMENTS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.RETRIEVE_DOCUMENT_GENERAL_MINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.RETRIEVE_DOCUMENT_GENERAL_MINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        generalMinutesDocument: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.RETRIEVE_DOCUMENT_GENERAL_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GENERAL_DOCUMENT_FOR_MEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GENERAL_DOCUMENT_FOR_MEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        generalminutesDocumentForMeeting: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GENERAL_DOCUMENT_FOR_MEETING_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_GENERAL_MINUTES_METHOD_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DELETE_GENERAL_MINUTES_METHOD_SUCCESS: {
      return {
        ...state,
        Loading: true,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_GENERAL_MINUTES_METHOD_FAILED: {
      return {
        ...state,
        Loading: true,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_GENERAL_MINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPDATE_GENERAL_MINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_GENERAL_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.AGENDA_WISE_MINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.AGENDA_WISE_MINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        agendaWiseMinuteID: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.AGENDA_WISE_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        agendaWiseMinuteID: 0,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_AGENDA_WISE_MINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DELETE_AGENDA_WISE_MINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_AGENDA_WISE_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_AGENDA_WISE_MINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPDATE_AGENDA_WISE_MINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_AGENDA_WISE_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDA_WISE_MINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_AGENDA_WISE_MINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        agendaWiseMinutesReducer: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDA_WISE_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_USER_WISE_PROPOSED_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_USER_WISE_PROPOSED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        userWiseMeetingProposed: action.response,
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.GET_USER_WISE_PROPOSED_FAIL: {
      return {
        ...state,
        Loading: false,
        userWiseMeetingProposed: [],
        ResponseMessage: action.ResponseMessage,
      };
    }

    case actions.SAVE_DOCUMENTS_AGENDA_WISE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_DOCUMENTS_AGENDA_WISE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_DOCUMENTS_AGENDA_WISE_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.RETRIVE_AGENDA_WISE_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.RETRIVE_AGENDA_WISE_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        RetriveAgendaWiseDocuments: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.RETRIVE_AGENDA_WISE_DOCUMENTS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_GENERAL_MINUTE_DCOUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DELETE_GENERAL_MINUTE_DCOUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_GENERAL_MINUTE_DCOUMENTS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_AGENDA_WISE_DOCUMENT_DELETE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DELETE_AGENDA_WISE_DOCUMENT_DELETE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_AGENDA_WISE_DOCUMENT_DELETE_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        meetingDataRoomMapFolderID: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_FAILED: {
      return {
        ...state,
        Loading: false,
        meetingDataRoomMapFolderID: 0,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_MEETING_USERS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPDATE_MEETING_USERS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }
    case actions.GETMEETINGBYCOMMITTEEID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETMEETINGBYCOMMITTEEID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getMeetingByCommitteeID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETMEETINGBYCOMMITTEEID_FAIL: {
      return {
        ...state,
        Loading: false,
        getMeetingByCommitteeID: null,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_MEETING_USERS_FAILED: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.SCHEDULE_MEETING_ON_SELECT_DATE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SCHEDULE_MEETING_ON_SELECT_DATE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        scheduleMeetingProposed: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SCHEDULE_MEETING_ON_SELECT_DATE_FAIL: {
      return {
        ...state,
        Loading: false,
        scheduleMeetingProposed: "",
        ResponseMessage: action.message,
      };
    }

    case actions.SETMEETINGBYCOMMITTEEID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SETMEETINGBYCOMMITTEEID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        setMeetingbyCommitteeID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SETMEETINGBYCOMMITTEEID_FAIL: {
      return {
        ...state,
        Loading: false,
        setMeetingbyCommitteeID: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GETMEETINGBYGROUPID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GETMEETINGBYGROUPID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getMeetingbyGroupID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETMEETINGBYGROUPID_FAIL: {
      return {
        ...state,
        Loading: false,
        getMeetingbyGroupID: null,
        ResponseMessage: action.message,
      };
    }

    case actions.SETMEETINGBYGROUPID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SETMEETINGBYGROUPID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        setMeetingByMeetingID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SETMEETINGBYGROUPID_FAIL: {
      return {
        ...state,
        Loading: false,
        setMeetingByMeetingID: null,
        ResponseMessage: action.message,
      };
    }

    case actions.UNSAVE_VIEW_MINTUES_MODAL: {
      return {
        ...state,
        unsaveViewMinutesModal: action.response,
      };
    }

    case actions.UNSAVED_VIEW_POLLS_MODAL: {
      return {
        ...state,
        unsavedViewPollsModal: action.response,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default NewMeetingreducer;
