/**
 * @module oneToOneMessage
 * @description Utility functions that transform raw Socket.io / API message
 * payloads into normalised local state arrays for the Talk chat window.
 * Covers one-to-one messages, group messages, unread counts, star/unstar
 * toggling, and group creation / updation events.
 */

/**
 * Normalises a raw array of one-to-one message objects and stores the result
 * in local component state. Splits pipe-delimited `frMessages` strings into
 * arrays where applicable.
 *
 * @param {Function} setAllOtoMessages - React state setter for the OTO messages array.
 * @param {Array<Object>} allotomessages - Raw one-to-one message objects from the API or socket.
 * @returns {void}
 */
export const oneToOneMessages = (setAllOtoMessages, allotomessages) => {
  let allMessagesArr = []
  allotomessages.map((messagesData) => {
    if (
      messagesData.frMessages !== 'Direct Message' &&
      messagesData.frMessages.length > 0 &&
      messagesData.frMessages !== undefined &&
      typeof messagesData.frMessages !== 'object'
    ) {
      messagesData.frMessages = messagesData.frMessages.split('|')
    }
    allMessagesArr.push({
      attachmentLocation: messagesData.attachmentLocation,
      blockCount: messagesData.blockCount,
      broadcastName: messagesData.broadcastName,
      currDate: messagesData.currDate,
      fileGeneratedName: messagesData.fileGeneratedName,
      fileName: messagesData.fileName,
      frMessages: messagesData.frMessages,
      isFlag: messagesData.isFlag,
      messageBody: messagesData.messageBody,
      messageCount: messagesData.messageCount,
      messageID: messagesData.messageID,
      messageStatus: messagesData.messageStatus,
      receivedDate: messagesData.receivedDate,
      receiverID: messagesData.receiverID,
      receiverName: messagesData.receiverName,
      seenDate: messagesData.seenDate,
      senderID: messagesData.senderID,
      senderName: messagesData.senderName,
      sentDate: messagesData.sentDate,
      shoutAll: messagesData.shoutAll,
      uid: messagesData.uid,
      sourceMessageBody: messagesData.sourceMessageBody,
      sourceMessageId: messagesData.sourceMessageId,
    })
  })
  return setAllOtoMessages([...allMessagesArr])
}

/**
 * Normalises a raw array of group message objects and stores the result in
 * local component state. Splits pipe-delimited `frMessages` strings into
 * arrays where applicable.
 *
 * @param {Array<Object>} allGroupMessagesReducer - Raw group message objects from the Redux store.
 * @param {Function} setAllGroupMessages - React state setter for the group messages array.
 * @returns {void}
 */
export const groupMessages = (allGroupMessagesReducer, setAllGroupMessages) => {
  let allGroupMessagesArr = []
  allGroupMessagesReducer.map((messagesData) => {
    if (
      messagesData.frMessages !== 'Direct Message' &&
      messagesData.frMessages.length > 0 &&
      messagesData.frMessages !== undefined &&
      typeof messagesData.frMessages !== 'object'
    ) {
      messagesData.frMessages = messagesData.frMessages.split('|')
    }
    allGroupMessagesArr.push({
      attachmentLocation: messagesData.attachmentLocation,
      currDate: messagesData.currDate,
      fileGeneratedName: messagesData.fileGeneratedName,
      fileName: messagesData.fileName,
      frMessages: messagesData.frMessages,
      isFlag: messagesData.isFlag,
      messageBody: messagesData.messageBody,
      messageCount: messagesData.messageCount,
      messageID: messagesData.messageID,
      receiverID: messagesData.receiverID,
      senderID: messagesData.senderID,
      senderName: messagesData.senderName,
      sentDate: messagesData.sentDate,
      shoutAll: messagesData.shoutAll,
      sourceMessageBody: messagesData.sourceMessageBody,
      sourceMessageId: messagesData.sourceMessageId,
    })
  })
  return setAllGroupMessages([...allGroupMessagesArr])
}

/**
 * Updates the notification count for the active chat when a Socket.io unread
 * message count event arrives whose chatID matches the currently open chat.
 *
 * @param {Object} talkStateData - The Talk Redux state slice containing socket data.
 * @param {Object} allChatData - The currently active chat record.
 * @param {Function} setAllChatData - React state setter for the active chat record.
 * @returns {void}
 */
export const unreadMessageCountFunction = (
  talkStateData,
  allChatData,
  setAllChatData,
) => {
  const mqttUnreadMessageCount =
    talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0]
  const mqttUnreadMessageData = {
    userID: mqttUnreadMessageCount.userID,
    channelID: mqttUnreadMessageCount.channelID,
    chatID: mqttUnreadMessageCount.chatID,
    chatType: mqttUnreadMessageCount.chatType,
    chatCount: mqttUnreadMessageCount.chatCount,
    otoCount: mqttUnreadMessageCount.otoCount,
    groupCount: mqttUnreadMessageCount.groupCount,
    roomCount: mqttUnreadMessageCount.roomCount,
    totalCount: mqttUnreadMessageCount.totalCount,
  }
  if (mqttUnreadMessageData.chatID === allChatData.id) {
    const updatedAllChatData = {
      ...allChatData,
      notiCount: mqttUnreadMessageData.chatCount,
    }
    setAllChatData(updatedAllChatData)
  }
}

/**
 * Toggles the star/unstar flag (`isFlag`) on a specific message in either the
 * OTO or group message list based on the Socket.io star/unstar event payload.
 *
 * @param {Object} talkStateData - The Talk Redux state slice containing socket star/unstar data.
 * @param {Object} allChatData - The currently active chat record (unused directly but passed for context).
 * @param {Function} setAllOtoMessages - React state setter for the OTO messages array.
 * @param {Array<Object>} allOtoMessages - Current OTO messages array.
 * @param {Array<Object>} allGroupMessages - Current group messages array.
 * @param {Function} setAllGroupMessages - React state setter for the group messages array.
 * @returns {void}
 */
export const markStarUnstarFunction = (
  talkStateData,
  allChatData,
  setAllOtoMessages,
  allOtoMessages,
  allGroupMessages,
  setAllGroupMessages,
) => {
  let mqttUnStarMessageData =
    talkStateData.talkSocketDataStarUnstar.socketUnstarMessage
  if (Object.keys(mqttUnStarMessageData) !== null) {
    if (mqttUnStarMessageData.messageType === 'O') {
      let messageOtoUnStarred = allOtoMessages.find(
        (item) => item.messageID === mqttUnStarMessageData.messageID,
      )
      if (messageOtoUnStarred !== undefined) {
        if (messageOtoUnStarred.isFlag === 1) {
          messageOtoUnStarred.isFlag = 0
        } else if (messageOtoUnStarred.isFlag === 0) {
          messageOtoUnStarred.isFlag = 1
        }
      }
      setAllOtoMessages(
        allOtoMessages.map((data) =>
          data.messageID === messageOtoUnStarred.messageID
            ? messageOtoUnStarred
            : data,
        ),
      )
    } else if (mqttUnStarMessageData.messageType === 'G') {
      let messageGroupUnStarred = allGroupMessages.find(
        (item) => item.messageID === mqttUnStarMessageData.messageID,
      )
      if (messageGroupUnStarred !== undefined) {
        if (messageGroupUnStarred.isFlag === 1) {
          messageGroupUnStarred.isFlag = 0
        } else if (messageGroupUnStarred.isFlag === 0) {
          messageGroupUnStarred.isFlag = 1
        }
      }
      setAllGroupMessages(
        allGroupMessages.map((data) =>
          data.messageID === messageGroupUnStarred.messageID
            ? messageGroupUnStarred
            : data,
        ),
      )
    }
  }
}

/**
 * Prepends a newly created group entry to the chat list when a Socket.io group
 * creation event is received.
 *
 * @param {Object} talkStateData - The Talk Redux state slice containing group creation socket data.
 * @param {Function} setAllChatData - React state setter for the full chat list.
 * @param {Array<Object>} allChatData - Current chat list array.
 * @returns {void}
 */
export const groupCreationFunction = (
  talkStateData,
  setAllChatData,
  allChatData,
) => {
  let mqttCreatedGroup =
    talkStateData.talkSocketGroupCreation.groupCreatedData.data[0]
  let groupCreationDataMqtt = {
    admin: mqttCreatedGroup.admin,
    attachmentLocation: '',
    companyName: '',
    fullName: mqttCreatedGroup.fullName,
    id: mqttCreatedGroup.id,
    imgURL: mqttCreatedGroup.imgURL,
    isBlock: 0,
    isOnline: false,
    messageBody: mqttCreatedGroup.messageBody,
    messageDate: mqttCreatedGroup.messageDate,
    messageType: 'G',
    notiCount: 0,
    receivedDate: '',
    seenDate: '',
    senderID: 0,
    sentDate: '',
  }
  if (Object.keys(groupCreationDataMqtt) !== null) {
    setAllChatData([groupCreationDataMqtt, ...allChatData])
  } else {
  }
}

/**
 * Prepends an updated group entry to the chat list when a Socket.io group
 * updation event is received, effectively moving the group to the top.
 *
 * @param {Object} talkStateData - The Talk Redux state slice containing group updation socket data.
 * @param {Function} setAllChatData - React state setter for the full chat list.
 * @param {Array<Object>} allChatData - Current chat list array.
 * @returns {void}
 */
export const groupUpdationFunction = (
  talkStateData,
  setAllChatData,
  allChatData,
) => {
  let mqttCreatedGroup =
    talkStateData.talkSocketGroupUpdation.groupUpdatedData.data[0]
  let groupUpdationDataMqtt = {
    admin: mqttCreatedGroup.admin,
    attachmentLocation: '',
    companyName: '',
    fullName: mqttCreatedGroup.fullName,
    id: mqttCreatedGroup.id,
    imgURL: mqttCreatedGroup.imgURL,
    isBlock: 0,
    isOnline: false,
    messageBody: mqttCreatedGroup.messageBody,
    messageDate: mqttCreatedGroup.messageDate,
    messageType: 'G',
    notiCount: 0,
    receivedDate: '',
    seenDate: '',
    senderID: 0,
    sentDate: '',
  }
  if (Object.keys(groupUpdationDataMqtt) !== null) {
    setAllChatData([groupUpdationDataMqtt, ...allChatData])
  } else {
  }
}
