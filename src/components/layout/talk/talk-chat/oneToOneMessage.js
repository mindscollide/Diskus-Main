export const oneToOneMessages = (
  allOtoMessages,
  setAllOtoMessages,
  allotomessages,
) => {
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
export const setAllChatDataFunction = (
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
export const setAllOtoMessagesFunction = (
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
export const setAllChatDataFunction2 = (
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
