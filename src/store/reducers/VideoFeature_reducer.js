import * as actions from '../action_types'

const initialState = {
  VideoChatPanel: false,
  ContactVideoFlag: false,
  RecentVideoFlag: false,
  VideoChatSearchFlag: false,
  VideoCallOTOFlag: false,
  EndVideoCallFlag: false,
  VideoCallGroupFlag: false,
  VideoCallNormalScreenFlag: false,
  VideoCallMinimizeScreenFlag: false,
  VideoCallMaximizeScreenFlag: false,
  VideoCallNormalHeaderFlag: false,
  VideoCallMinimizeHeaderFlag: false,
  VideoCallMaximizeHeaderFlag: false,
  VideoIncomingCallFlag: false,
  VideoChatNormalFlag: false,
  VideoAgendaNormalFlag: false,
  VideoOutgoingCallFlag: false,
  VideoMultipleCallFlag: false,
  VideoChatOpenFlag: false,
  VideoAgendaOpenFlag: false,
  VideoMinutesOpenFlag: false,
  // MaximizeVideoPanel: false,
  // MinimizeVideoPanel: false,
}

const videoFeatureReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.VIDEO_CHAT_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoChatPanel: action.response,
      }
    }

    case actions.CONTACT_VIDEO_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        ContactVideoFlag: action.response,
      }
    }

    case actions.RECENT_VIDEO_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        RecentVideoFlag: action.response,
      }
    }

    case actions.VIDEO_CHAT_SEARCH_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoChatSearchFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_OTO_FLAG: {
      console.log(actions, 'actionnnnnsss')
      return {
        ...state,
        VideoCallOTOFlag: action.response,
      }
    }

    case actions.END_VIDEO_CALL_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        EndVideoCallFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_GROUP_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoCallGroupFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_NORMAL_SCREEN_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoCallNormalScreenFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_MINIMIZE_SCREEN_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoCallMinimizeScreenFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_MAXIMIZE_SCREEN_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoCallMaximizeScreenFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_NORMAL_HEADER_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoCallNormalHeaderFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_MINIMIZE_HEADER_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoCallMinimizeHeaderFlag: action.response,
      }
    }

    case actions.VIDEO_CALL_MAXIMIZE_HEADER_FLAG: {
      console.log(actions, 'actionnnnnsss')

      return {
        ...state,
        VideoCallMaximizeHeaderFlag: action.response,
      }
    }

    case actions.CHAT_ENABLE_NORMAL_FLAG: {
      console.log(actions, 'actionnnnnsss')
      return {
        ...state,
        VideoChatNormalFlag: action.response,
      }
    }

    case actions.AGENDA_ENABLE_NORMAL_FLAG: {
      console.log(actions, 'actionnnnnsss')
      return {
        ...state,
        VideoAgendaNormalFlag: action.response,
      }
    }

    case actions.VIDEO_INCOMING_CALL_MAX: {
      console.log(actions, 'actionnnnnsss')
      return {
        ...state,
        VideoIncomingCallFlag: action.response,
      }
    }

    case actions.VIDEO_OUTGOING_CALL_MAX: {
      return {
        ...state,
        VideoOutgoingCallFlag: action.response,
      }
    }

    case actions.VIDEO_MULTIPLE_CALL_MAX: {
      return {
        ...state,
        VideoMultipleCallFlag: action.response,
      }
    }

    case actions.VIDEO_MAX_CHAT_OPEN: {
      return {
        ...state,
        VideoChatOpenFlag: action.response,
      }
    }

    case actions.VIDEO_MAX_AGENDA_OPEN: {
      return {
        ...state,
        VideoAgendaOpenFlag: action.response,
      }
    }

    case actions.VIDEO_MAX_MINUTES_OPEN: {
      return {
        ...state,
        VideoMinutesOpenFlag: action.response,
      }
    }

    // case actions.MAXIMIZE_VIDEO_PANEL: {
    //   return {
    //     ...state,
    //     MaximizeVideoPanel: action.response,
    //   };
    // }

    // case actions.MINIMIZE_VIDEO_PANEL: {
    //   return {
    //     ...state,
    //     MinimizeVideoPanel: action.response,
    //   };
    // }

    default:
      return { ...state }
  }
}
export default videoFeatureReducer
