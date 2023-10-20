import * as actions from '../action_types'

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
}

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

    default:
      return { ...state }
  }
}

export default MeetingOrganizersReducer
