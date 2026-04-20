/**
 * @file MeetingOrganizers_reducer.js
 * @description Redux reducer for the `meetingOrganizers` slice. Manages
 * meeting organiser data: fetching committees/users/groups, saving and
 * updating organiser assignments, notification dispatch, and UI flags
 * for save/edit modes.
 */
import * as actions from '../action_types'

/**
 * @type {object}
 * @property {boolean} Loading                      - Global loading flag.
 * @property {Array}   AllUserCommitteesGroupsData  - Combined users, committees, and groups list.
 * @property {Array}   MeetingOrganizersData        - Organiser objects for the current meeting.
 * @property {Array}   SelectedMeetingOrganizersData - Currently selected organiser entries.
 * @property {Array}   SaveMeetingOrganizersData    - Result of the save-organizers API.
 * @property {boolean} SaveMeetingFlag              - Flag indicating a save operation is in progress.
 * @property {boolean} EditMeetingFlag              - Flag indicating an edit operation is in progress.
 */
const initialState = {
  Loading: false,
  ResponseMessage: '',
  SaveMeetingOrganizersData: [],
  AllUserCommitteesGroupsData: [],
  MeetingOrganizersData: [],
  SelectedMeetingOrganizersData: [],
  LoadingMeetingOrganizer: false,
  MeetingStatusUpdateData: [],
  AllMeetingOrganizersData: [],
  SaveMeetingFlag: false,
  EditMeetingFlag: false,
  NotificationSendData: [],
  NotificationUpdateData: [],
}

/**
 * Reducer for the `meetingOrganizers` slice.
 * Handles fetching committees/users/groups, saving/updating organiser
 * assignments, sending notifications, and managing save/edit flags.
 *
 * @param {object} state  - Current meetingOrganizers state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const MeetingOrganizersReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GETALLCOMMITTEESUSERSANDGROUPS_INIT: {
      return {
        ...state,
        Loading: true,
      }
    }
    case actions.GETALLCOMMITTEESUSERSANDGROUPS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AllUserCommitteesGroupsData: action.response,
        ResponseMessage: action.message,
      }
    }
    case actions.GETALLCOMMITTEESUSERSANDGROUPS_FAIL: {
      return {
        ...state,
        Loading: false,
        AllUserCommitteesGroupsData: [],
        ResponseMessage: action.message,
      }
    }

    case actions.GET_MEETING_ORGANIZERS: {
      return {
        ...state,
        MeetingOrganizersData: action.response,
      }
    }

    case actions.SELECTED_MEETING_ORGANIZERS: {
      return {
        ...state,
        SelectedMeetingOrganizersData: action.response,
      }
    }

    case actions.SAVE_MEETINGORGANIZERS_INIT: {
      return {
        ...state,
        LoadingMeetingOrganizer: true,
      }
    }
    case actions.SAVE_MEETINGORGANIZERS_SUCCESS: {
      return {
        ...state,
        LoadingMeetingOrganizer: false,
        SaveMeetingOrganizersData: action.response,
        ResponseMessage: action.message,
      }
    }
    case actions.SAVE_MEETINGORGANIZERS_FAIL: {
      return {
        ...state,
        LoadingMeetingOrganizer: false,
        SaveMeetingOrganizersData: [],
        ResponseMessage: action.message,
      }
    }

    case actions.CLEAR_RESPONSEMESSAGE_MO: {
      return {
        ...state,
        ResponseMessage: action.message,
      }
    }

    case actions.UPDATE_ORGANIZERSMEETING_INIT: {
      return {
        ...state,
        Loading: true,
      }
    }
    case actions.UPDATE_ORGANIZERSMEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        MeetingStatusUpdateData: action.response,
        ResponseMessage: action.message,
      }
    }
    case actions.UPDATE_ORGANIZERSMEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        MeetingStatusUpdateData: [],
        ResponseMessage: action.message,
      }
    }

    case actions.GETALLMEETINGORGANIZERS_INIT: {
      return {
        ...state,
        Loading: true,
      }
    }
    case actions.GETALLMEETINGORGANIZERS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AllMeetingOrganizersData: action.response,
        ResponseMessage: action.message,
      }
    }
    case actions.GETALLMEETINGORGANIZERS_FAIL: {
      return {
        ...state,
        Loading: false,
        AllMeetingOrganizersData: [],
        ResponseMessage: action.message,
      }
    }

    case actions.SAVE_MEETING_FLAG: {
      return {
        ...state,
        SaveMeetingFlag: action.response,
      }
    }

    case actions.EDIT_MEETING_FLAG: {
      return {
        ...state,
        EditMeetingFlag: action.response,
      }
    }

    case actions.NOTIFICATION_SEND_DATA: {
      return {
        ...state,
        NotificationSendData: action.response,
      }
    }

    case actions.NOTIFICATION_UPDATE_DATA: {
      return {
        ...state,
        NotificationUpdateData: action.response,
      }
    }

    case actions.SEND_NOTIFICATION_ORGANIZER_INIT: {
      return {
        ...state,
        Loading: true,
      }
    }

    case actions.SEND_NOTIFICATION_ORGANIZER_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      }
    }

    case actions.SEND_NOTIFICATION_ORGANIZER_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      }
    }

    default:
      return { ...state }
  }
}

export default MeetingOrganizersReducer
