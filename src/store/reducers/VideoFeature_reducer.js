import * as actions from '../action_types'

const initialState = {
  videoChatPanel: false,
  contactVideoFlag: false,
  recentVideoFlag: false,
  videoChatSearchFlag: false,
}

const videoFeatureReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.VIDEO_CHAT_FLAG: {
      return {
        ...state,
        videoChatPanel: action.response,
      }
    }

    case actions.CONTACT_VIDEO_FLAG: {
      return {
        ...state,
        contactVideoFlag: action.response,
      }
    }

    case actions.RECENT_VIDEO_FLAG: {
      return {
        ...state,
        recentVideoFlag: action.response,
      }
    }

    case actions.VIDEO_CHAT_SEARCH_FLAG: {
      return {
        ...state,
        videoChatSearchFlag: action.response,
      }
    }

    default:
      return { ...state }
  }
}
export default videoFeatureReducer
