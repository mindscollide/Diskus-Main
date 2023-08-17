import * as actions from '../action_types'

const videoChatPanel = (response) => {
  return {
    type: actions.VIDEO_CHAT_FLAG,
    response: response,
  }
}

const contactVideoFlag = (response) => {
  return {
    type: actions.CONTACT_VIDEO_FLAG,
    response: response,
  }
}

const recentVideoFlag = (response) => {
  return {
    type: actions.RECENT_VIDEO_FLAG,
    response: response,
  }
}

const videoChatSearchFlag = (response) => {
  return {
    type: actions.VIDEO_CHAT_SEARCH_FLAG,
    response: response,
  }
}

export {
  videoChatPanel,
  contactVideoFlag,
  recentVideoFlag,
  videoChatSearchFlag,
}
