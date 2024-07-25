import * as actions from "../action_types";
import {
  endIndexUrl,
  extractedUrl,
  generateURLParticipant,
} from "../../commen/functions/urlVideoCalls";
import { generateRandomGuest } from "../../commen/functions/urlVideoCalls";

const initialState = {
  LoadingParticipants: false,
  LoadingViewModal: false,
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
  deletPollsMeeting: false,
  editFlowDeletePollsMeeting: false,
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
  getAllAgendaContributorsIsPublished: false,
  getAllAgendaContributorsAllowRSVP: false,
  getAllSavedparticipants: [],
  getAllSavedparticipantsIsPublished: false,
  getAllSavedparticipantsAllowrsvp: false,
  sendNotificationOrganizerModal: false,
  getAllMeetingDetails: null,
  getPollsMeetingID: null,
  getMeetingusers: [],
  setMeetingProposeDate: [],
  getAllProposedDates: [],
  meetingResponse: [],
  meetingMaterialData: [],
  meetingMaterialIsPublished: false,
  agendaRights: null,
  attachmentsPermission: [],
  cancelViewModalMeetingDetails: false,
  generalMinutes: [],
  generalMinutesDocument: [],
  generalminutesDocumentForMeeting: [],
  addMinuteID: 0,
  agendaWiseMinutesReducer: null,
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
  nextConfirmModal: false,
  ShowPreviousModal: false,
  attendanceConfirmationModal: false,
  CurrentMeetingURL: "",
  getallDocumentsForAgendaWiseMinutes: [],
  UploadDocumentsResponse: [],
  SaveFolderResponse: null,
  meetingStatusProposedMqttData: null,
  meetingStatusPublishedMqttData: null,
  meetingStatusNotConductedMqttData: null,
  userAvailibilityData: null,
  CalendarDashboardEventData: null,

  scheduleMeetingPageFlag: false,
  viewProposeDateMeetingPageFlag: false,
  viewAdvanceMeetingPublishPageFlag: false,
  viewAdvanceMeetingUnpublishPageFlag: false,
  viewProposeOrganizerMeetingPageFlag: false,
  proposeNewMeetingPageFlag: false,
  getUserProposedOrganizerData: [],
  sideBarMeetingPopupState: false,
  viewMeetingFlag: false,

  meetingDetailsGlobalFlag: true,
  organizersGlobalFlag: false,
  agendaContributorsGlobalFlag: false,
  participantsGlobalFlag: false,
  agendaGlobalFlag: false,
  meetingMaterialGlobalFlag: false,
  minutesGlobalFlag: false,
  proposedMeetingDatesGlobalFlag: false,
  actionsGlobalFlag: false,
  pollsGlobalFlag: false,
  attendanceGlobalFlag: false,
  uploadGlobalFlag: false,

  endMeetingStatus: null,
  mqttMeetingAcAdded: null,
  mqttMeetingAcRemoved: null,
  mqttMeetingOrgAdded: null,
  mqttMeetingOrgRemoved: null,
  joinMeetingResponse: null,
  leaveMeetingResponse: null,
  currentMeetingStatus: 0,
  mqttMeetingPrAdded: null,
  mqtMeetingPrRemoved: null,
  validatencryptedstring: null,
  emailRouteID: 0,
  boardDeckModalData: false,
  boarddeckShareModal: false,
  boardDeckEmailModal: false,
};

const NewMeetingreducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.EMAIL_ROUTE_ID: {
      return {
        ...state,
        emailRouteID: action.response,
      };
    }
    case actions.CLEAR_MEETING_MESSAGES: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }
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

    case actions.DELETE_POLL_MEETING: {
      return {
        ...state,
        deletPollsMeeting: action.response,
      };
    }

    case actions.EDIT_FLOW_DELETE_POLL_MEETING: {
      return {
        ...state,
        editFlowDeletePollsMeeting: action.response,
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
        Loading: action.loader,
        getALlMeetingTypes: action.response,
      };
    }

    case actions.GET_ALL_MEETING_TYPES_NEW_FAILED: {
      return {
        ...state,
        Loading: action.loader,
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
        // Loading: false,
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
        // Loading: false,
        recurring: action.response,
        ResponseMessage: action.message,
        Loading: action.loader,
      };
    }

    case actions.GET_ALL_RECURRING_FAILED: {
      return {
        ...state,
        Loading: action.loader,
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
        Loading: true,
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
        Loading: action.loader,
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
        // LoadingParticipants: true,
      };
    }

    case actions.GET_ALL_SAVED_PARTICIPATNS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        // LoadingParticipants: false,

        getAllSavedparticipants: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_SAVED_PARTICIPATNS_ISPUBLISHED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllSavedparticipantsIsPublished: action.response,
      };
    }

    case actions.GET_ALL_SAVED_PARTICIPATNS_ALLOWRSVP: {
      return {
        ...state,
        Loading: false,
        getAllSavedparticipantsAllowrsvp: action.response,
      };
    }

    case actions.GET_ALL_SAVED_PARTICIPATNS_FAILED: {
      return {
        ...state,
        Loading: false,
        // LoadingParticipants: false,
        getAllSavedparticipants: [],
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_AGENDACONTRIBUTOR_INIT: {
      return {
        ...state,
        Loading: true,
        Loader2: true,
      };
    }
    case actions.GET_ALL_AGENDACONTRIBUTOR_SUCCESS: {
      return {
        ...state,
        Loading: false,
        Loader2: false,
        getAllAgendaContributors: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDACONTRIBUTOR_ISPUBLISHED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        Loader2: false,
        getAllAgendaContributorsIsPublished: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDACONTRIBUTOR_ALLOWRSVP: {
      return {
        ...state,
        Loading: false,
        Loader2: false,
        getAllAgendaContributorsAllowRSVP: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDACONTRIBUTOR_FAIL: {
      return {
        ...state,
        Loading: false,
        Loader2: false,

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
        LoadingViewModal: true,
      };
    }

    case actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_SUCCESS: {
      return {
        ...state,
        Loading: action.loader,
        LoadingViewModal: false,
        getAllMeetingDetails: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_FAILED: {
      return {
        ...state,
        Loading: false,
        LoadingViewModal: false,
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
        ResponseMessage: action.message,
      };
    }

    case actions.GET_POLLS_BY_MEETING_ID_FAILED: {
      return {
        ...state,
        Loading: false,
        getPollsMeetingID: null,
        ResponseMessage: action.message,
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
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_MEETING_USER_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
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
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SET_MEETING_POLLS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
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
        ResponseMessage: action.message,
      };
    }

    case actions.SET_MEETING_PROPOSED_DATE_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_PRPOSED_DATES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_PRPOSED_DATES_SUCCESS: {
      console.log("hello", action);

      return {
        ...state,
        Loading: action.loader,
        getAllProposedDates: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_PRPOSED_DATES_FAILED: {
      return {
        ...state,
        Loading: false,
        getAllProposedDates: [],
        ResponseMessage: action.message,
      };
    }
    case actions.CLEARE_ALL_PROPOSED_MEETING_DATES: {
      return {
        ...state,
        getAllProposedDates: [],
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
        ResponseMessage: action.message,
      };
    }

    case actions.SET_MEETING_RESPONSE_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
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
        meetingMaterialData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_MEETING_MATERIAL_ISPUBLISHED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        meetingMaterialIsPublished: action.response,
      };
    }

    case actions.GET_ALL_MEETING_MATERIAL_FAIL: {
      return {
        ...state,
        Loading: false,
        meetingMaterialData: [],
        ResponseMessage: action.message,
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
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_MEETING_AGENDA_LOCK_STATUS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
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
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDA_RIGHTS_FAILED: {
      return {
        ...state,
        Loading: false,
        agendaRights: null,
        ResponseMessage: action.message,
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
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_USER_ATTACHMENT_PERMISSION_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_GENERAL_MINTES_SUCCESS: {
      return {
        ...state,
        Loading: action.flag,
        generalMinutes: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_GENERAL_MINTES_FAILED: {
      return {
        ...state,
        Loading: false,
        generalMinutes: [],
        ResponseMessage: action.message,
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
        Loading: true,
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
        Loading: true,
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
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_GENERAL_MINUTES_METHOD_FAILED: {
      return {
        ...state,
        Loading: false,
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
        Loading: true,
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
        Loading: true,
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
        Loading: action.loader,
        agendaWiseMinutesReducer: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDA_WISE_MINUTES_FAILED: {
      return {
        ...state,
        Loading: false,
        agendaWiseMinutesReducer: null,
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
        Loading: action.loader,
        userWiseMeetingProposed: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_USER_WISE_PROPOSED_FAIL: {
      return {
        ...state,
        Loading: action.loader,
        userWiseMeetingProposed: [],
        ResponseMessage: action.message,
      };
    }

    // reducer for get proposed dates when organizer click on view poll
    case actions.GET_USER_PROPOSED_DATES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_USER_PROPOSED_DATES_SUCCESS: {
      return {
        ...state,
        Loading: action.loader,
        getUserProposedOrganizerData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_USER_PROPOSED_DATES_FAIL: {
      return {
        ...state,
        Loading: action.loader,
        getUserProposedOrganizerData: [],
        ResponseMessage: action.message,
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
        Loading: true,
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
        Loading: action.loader,
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

    case actions.NEXT_CONFIRMATION_MODAL: {
      return {
        ...state,
        nextConfirmModal: action.response,
      };
    }

    case actions.PREVIOUS_MODAL: {
      return {
        ...state,
        ShowPreviousModal: action.response,
      };
    }

    case actions.ATTENDENCE_ASSURANCE_MODAL: {
      return {
        ...state,
        attendanceConfirmationModal: action.response,
      };
    }

    case actions.GET_MEETING_URL_CLIPBOARD: {
      if (
        action.response !== "" &&
        action.response !== undefined &&
        action.response !== null
      ) {
        let currentVideoURL = action.response;

        let match = currentVideoURL.match(/RoomID=([^&]*)/);
        let roomID = match[1];
        let dynamicBaseURLCaller = localStorage.getItem(
          "videoBaseURLParticipant"
        );
        let randomGuestName = generateRandomGuest();
        let UserName = localStorage.getItem("name");
        const endIndexBaseURLCaller = endIndexUrl(dynamicBaseURLCaller);
        const extractedBaseURLCaller = extractedUrl(
          dynamicBaseURLCaller,
          endIndexBaseURLCaller
        );
        let resultedVideoURL = generateURLParticipant(
          extractedBaseURLCaller,
          randomGuestName,
          roomID
        );
        return {
          ...state,
          CurrentMeetingURL: resultedVideoURL,
        };
      } else {
        return {
          ...state,
          CurrentMeetingURL: "",
        };
      }
    }
    case actions.GET_ALL_AGENDAWISE_DOCUMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_AGENDAWISE_DOCUMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getallDocumentsForAgendaWiseMinutes: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_AGENDAWISE_DOCUMENT_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    //Upload docs

    case actions.UPLOAD_DOCUMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPLOAD_DOCUMENT_SUCCESS: {
      return {
        ...state,
        Loading: true,
        UploadDocumentsResponse: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.UPLOAD_DOCUMENT_FAILED: {
      return {
        ...state,
        Loading: false,
        UploadDocumentsResponse: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SAVED_FILES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVED_FILES_SUCCESS: {
      return {
        ...state,
        Loading: true,
        SaveFolderResponse: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVED_FILES_FAILED: {
      return {
        ...state,
        Loading: false,
        SaveFolderResponse: null,
        ResponseMessage: action.message,
      };
    }

    //INVITE TO COLLABORATE

    case actions.INVITE_TO_COLLABORATE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.INVITE_TO_COLLABORATE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.INVITE_TO_COLLABORATE_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.CLEARE_ALL_MEETING_STATE: {
      return {
        ...state,
        ResponseMessage: "",
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
        // getALlMeetingTypes: [],
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
        getPollsMeetingID: null,
        getMeetingusers: [],
        setMeetingProposeDate: [],
        getAllProposedDates: [],
        meetingResponse: [],
        meetingMaterialData: [],
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
        CurrentMeetingURL: "",
        getallDocumentsForAgendaWiseMinutes: [],
        getUserProposedOrganizerData: [],
      };
    }

    case actions.NEWMEETING_RESPONSEMESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

    case actions.CLEARE_MINUTS_DATA: {
      return {
        ...state,
        generalMinutes: [],
        generalminutesDocumentForMeeting: [],
      };
    }

    case actions.GET_GENERAL_MINTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.MQTT_MEETING_STATUS_PROPOSED: {
      return {
        ...state,
        meetingStatusProposedMqttData: action.response,
      };
    }

    case actions.MQTT_MEETING_STATUS_PUBLISHED: {
      console.log(
        action,
        "meetingStatusPublishedMqttmeetingStatusPublishedMqtt"
      );

      return {
        ...state,
        meetingStatusPublishedMqttData: action.response,
      };
    }

    case actions.MQTT_MEETING_AC_ADDED: {
      return {
        ...state,
        mqttMeetingAcAdded: action.response,
      };
    }

    case actions.MQTT_MEETING_AC_REMOVED: {
      return {
        ...state,
        mqttMeetingAcRemoved: action.response,
      };
    }

    case actions.MQTT_MEETING_ORG_ADDED: {
      return {
        ...state,
        mqttMeetingOrgAdded: action.response,
      };
    }

    case actions.MQTT_MEETING_ORG_REMOVED: {
      return {
        ...state,
        mqttMeetingOrgRemoved: action.response,
      };
    }

    case actions.MQTT_MEETING_STATUS_NOTCONDUCTED: {
      return {
        ...state,
        meetingStatusNotConductedMqttData: action.response,
      };
    }

    //Validate Empty String User Availibility For Meeting

    case actions.VALIDATE_EMPTY_STRING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.VALIDATE_EMPTY_STRING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        userAvailibilityData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.VALIDATE_EMPTY_STRING_FAILED: {
      return {
        ...state,
        Loading: false,
        userAvailibilityData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.DASHBOARD_CALENDAR_DATA: {
      return {
        ...state,
        CalendarDashboardEventData: action.response,
      };
    }

    case actions.SCHEDULE_NEW_MEETING_PAGE_FLAG: {
      return {
        ...state,
        scheduleMeetingPageFlag: action.response,
      };
    }

    case actions.VIEW_PROPOSED_DATE_MEETING_PAGE_FLAG: {
      return {
        ...state,
        viewProposeDateMeetingPageFlag: action.response,
      };
    }

    case actions.VIEW_ADVANCE_MEETING_PUBLISH_PAGE_FLAG: {
      return {
        ...state,
        viewAdvanceMeetingPublishPageFlag: action.response,
      };
    }

    case actions.VIEW_ADVANCE_MEETING_UNPUBLISH_PAGE_FLAG: {
      return {
        ...state,
        viewAdvanceMeetingUnpublishPageFlag: action.response,
      };
    }

    case actions.VIEW_PROPOSE_PRGANIZER_MEETING_PAGE_FLAG: {
      return {
        ...state,
        viewProposeOrganizerMeetingPageFlag: action.response,
      };
    }

    case actions.PROPOSE_NEW_MEETING_PAGE_FLAG: {
      return {
        ...state,
        proposeNewMeetingPageFlag: action.response,
      };
    }

    case actions.SIDEBAR_POPUP_ADVANCE_MEETING: {
      return {
        ...state,
        sideBarMeetingPopupState: action.response,
      };
    }

    case actions.VIEW_MEETING_FLAG: {
      return {
        ...state,
        viewMeetingFlag: action.response,
      };
    }

    case actions.MEETING_DETAILS_GLOBAL_FLAG: {
      return {
        ...state,
        meetingDetailsGlobalFlag: action.response,
      };
    }

    case actions.ORGANIZERS_GLOBAL_FLAG: {
      return {
        ...state,
        organizersGlobalFlag: action.response,
      };
    }

    case actions.AGENDA_CONTRIBUTORS_GLOBAL_FLAG: {
      return {
        ...state,
        agendaContributorsGlobalFlag: action.response,
      };
    }

    case actions.PARTICIPANTS_GLOBAL_FLAG: {
      return {
        ...state,
        participantsGlobalFlag: action.response,
      };
    }

    case actions.AGENDA_GLOBAL_FLAG: {
      return {
        ...state,
        agendaGlobalFlag: action.response,
      };
    }

    case actions.MEETING_MATERIAL_GLOBAL_FLAG: {
      return {
        ...state,
        meetingMaterialGlobalFlag: action.response,
      };
    }

    case actions.MINUTES_GLOBAL_FLAG: {
      return {
        ...state,
        minutesGlobalFlag: action.response,
      };
    }

    case actions.PROPOSED_MEETING_DATES_GLOBAL_FLAG: {
      return {
        ...state,
        proposedMeetingDatesGlobalFlag: action.response,
      };
    }

    case actions.ACTIONS_GLOBAL_FLAG: {
      return {
        ...state,
        actionsGlobalFlag: action.response,
      };
    }

    case actions.POLLS_GLOBAL_FLAG: {
      return {
        ...state,
        pollsGlobalFlag: action.response,
      };
    }

    case actions.ATTENDANCE_GLOBAL_FLAG: {
      return {
        ...state,
        attendanceGlobalFlag: action.response,
      };
    }

    case actions.UPLOAD_GLOBAL_FLAG: {
      return {
        ...state,
        uploadGlobalFlag: action.response,
      };
    }

    case actions.END_MEETING_STATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.END_MEETING_STATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        endMeetingStatus: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.END_MEETING_STATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        endMeetingStatus: null,
        ResponseMessage: action.message,
      };
    }

    case actions.JOIN_MEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.JOIN_MEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        joinMeetingResponse: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.JOIN_MEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        joinMeetingResponse: null,
        ResponseMessage: action.message,
      };
    }

    case actions.LEAVE_MEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.LEAVE_MEETING_SUCCESS_QUICK: {
      return {
        ...state,
        Loading: false,
        leaveMeetingResponse: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.LEAVE_MEETING_SUCCESS_ADVANCED: {
      return {
        ...state,
        // Loading: false,
        leaveMeetingResponse: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.LEAVE_MEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        leaveMeetingResponse: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CURRENT_MEETING_STATUS: {
      return {
        ...state,
        currentMeetingStatus: action.response,
      };
    }
    case actions.MQTT_MEETING_PAR_ADDED: {
      return {
        ...state,
        mqttMeetingPrAdded: action.response,
      };
    }
    case actions.MQTT_MEETING_PAR_REMOVED: {
      return {
        ...state,
        mqtMeetingPrRemoved: action.response,
      };
    }
    // validatencryptedstring
    case actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        validatencryptedstring: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_FAIL: {
      return {
        ...state,
        Loading: false,
        validatencryptedstring: null,
        ResponseMessage: action.message,
      };
    }

    case actions.BOARD_DECK_MODAL: {
      return {
        ...state,
        boardDeckModalData: action.response,
      };
    }

    case actions.BOARD_DECK_SHARE_MODAL: {
      return {
        ...state,
        boarddeckShareModal: action.response,
      };
    }

    case actions.BOARD_DECK_EMAIL_MODAL: {
      return {
        ...state,
        boardDeckEmailModal: action.response,
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default NewMeetingreducer;
