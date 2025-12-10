export const oneToOneMessages = (setAllOtoMessages, allotomessages) => {
  let allMessagesArr = [];

  if (
    allotomessages !== undefined &&
    allotomessages !== null &&
    allotomessages.length !== 0
  ) {
    allMessagesArr = allotomessages.map((messagesData) => {
      let frMessages = messagesData.frMessages;

      if (
        frMessages !== "Direct Message" &&
        frMessages.length > 0 &&
        frMessages !== undefined &&
        typeof frMessages !== "object"
      ) {
        frMessages = frMessages.split("|");
      }

      return {
        attachmentLocation: messagesData.attachmentLocation,
        base64Image: messagesData.base64Image,
        attachmentId: messagesData.attachmentId,
        blockCount: messagesData.blockCount,
        broadcastName: messagesData.broadcastName,
        currDate: messagesData.currDate,
        fileGeneratedName: messagesData.fileGeneratedName,
        fileName: messagesData.fileName,
        frMessages: frMessages,
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
        isRetry: false,
      };
    });
  } else {
    allMessagesArr = [];
  }

  let unsentMessagesPushLocal =
    JSON.parse(localStorage.getItem("chatMessagesLocal")) || [];
  if (unsentMessagesPushLocal.length > 0) {
    const updatedAllMessages = [...allMessagesArr];
    unsentMessagesPushLocal.forEach((chatMessage) => {
      const existingMessageIndex = updatedAllMessages.findIndex(
        (message) => message.receiverID === chatMessage.receiverID
      );
      if (existingMessageIndex !== -1) {
        updatedAllMessages.push(chatMessage);
      }
    });
    return setAllOtoMessages([...updatedAllMessages]);
  } else {
    return setAllOtoMessages([...allMessagesArr]);
  }
};

export const groupMessages = (allGroupMessagesReducer, setAllGroupMessages) => {
  let allGroupMessagesArr = [];
  if (
    allGroupMessagesReducer !== undefined &&
    allGroupMessagesReducer !== null &&
    allGroupMessagesReducer.length !== 0
  ) {
    allGroupMessagesReducer.forEach((messagesData) => {
      if (
        messagesData.frMessages !== "Direct Message" &&
        messagesData.frMessages.length > 0 &&
        messagesData.frMessages !== undefined &&
        typeof messagesData.frMessages !== "object"
      ) {
        messagesData.frMessages = messagesData.frMessages.split("|");
      }
      allGroupMessagesArr.push({
        attachmentLocation: messagesData.attachmentLocation,
        base64Image: messagesData.base64Image,
        attachmentId: messagesData.attachmentId,
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
        isRetryFlag: false,
      });
    });
  } else {
    allGroupMessagesArr = [];
  }
  return setAllGroupMessages([...allGroupMessagesArr]);
};

export const unreadMessageCountFunction = (
  talkStateData,
  allChatData,
  setAllChatData
) => {
  const mqttUnreadMessageCount =
    talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0];
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
  };
  if (mqttUnreadMessageData.chatID === allChatData.id) {
    const updatedAllChatData = {
      ...allChatData,
      notiCount: mqttUnreadMessageData.chatCount,
    };
    setAllChatData(updatedAllChatData);
  }
};

export const markStarUnstarFunction = (
  talkStateData,
  allChatData,
  setAllOtoMessages,
  allOtoMessages,
  allGroupMessages,
  setAllGroupMessages
) => {
  let mqttUnStarMessageData =
    talkStateData.talkSocketDataStarUnstar.socketUnstarMessage;
  if (Object.keys(mqttUnStarMessageData) !== null) {
    if (mqttUnStarMessageData.messageType === "O") {
      let messageOtoUnStarred = allOtoMessages.find(
        (item) => item.messageID === mqttUnStarMessageData.messageID
      );
      if (messageOtoUnStarred !== undefined) {
        if (messageOtoUnStarred.isFlag === 1) {
          messageOtoUnStarred.isFlag = 0;
        } else if (messageOtoUnStarred.isFlag === 0) {
          messageOtoUnStarred.isFlag = 1;
        }
      }
      setAllOtoMessages(
        allOtoMessages.map((data) =>
          data.messageID === messageOtoUnStarred.messageID
            ? messageOtoUnStarred
            : data
        )
      );
    } else if (mqttUnStarMessageData.messageType === "G") {
      let messageGroupUnStarred = allGroupMessages.find(
        (item) => item.messageID === mqttUnStarMessageData.messageID
      );
      if (messageGroupUnStarred !== undefined) {
        if (messageGroupUnStarred.isFlag === 1) {
          messageGroupUnStarred.isFlag = 0;
        } else if (messageGroupUnStarred.isFlag === 0) {
          messageGroupUnStarred.isFlag = 1;
        }
      }
      setAllGroupMessages(
        allGroupMessages.map((data) =>
          data.messageID === messageGroupUnStarred.messageID
            ? messageGroupUnStarred
            : data
        )
      );
    }
  }
};

export const groupCreationFunction = (
  talkStateData,
  setAllChatData,
  allChatData
) => {
  let mqttCreatedGroup =
    talkStateData.talkSocketGroupCreation.groupCreatedData.data[0];
  let groupCreationDataMqtt = {
    admin: mqttCreatedGroup.admin,
    attachmentLocation: "",
    base64Image: "",
    attachmentId: 0,
    companyName: "",
    fullName: mqttCreatedGroup.fullName,
    id: mqttCreatedGroup.id,
    imgURL: mqttCreatedGroup.imgURL,
    isBlock: 0,
    isOnline: false,
    messageBody: mqttCreatedGroup.messageBody,
    messageDate: mqttCreatedGroup.messageDate,
    messageType: "G",
    notiCount: 0,
    receivedDate: "",
    seenDate: "",
    senderID: 0,
    sentDate: "",
  };
  if (Object.keys(groupCreationDataMqtt) !== null) {
    setAllChatData([groupCreationDataMqtt, ...allChatData]);
  } else {
  }
};

export const groupUpdationFunction = (
  talkStateData,
  setAllChatData,
  allChatData
) => {
  let mqttCreatedGroup =
    talkStateData.talkSocketGroupUpdation.groupUpdatedData.data[0];
  let groupUpdationDataMqtt = {
    admin: mqttCreatedGroup.admin,
    attachmentLocation: "",
    base64Image: "",
    attachmentId: 0,
    companyName: "",
    fullName: mqttCreatedGroup.fullName,
    id: mqttCreatedGroup.id,
    imgURL: mqttCreatedGroup.imgURL,
    isBlock: 0,
    isOnline: false,
    messageBody: mqttCreatedGroup.messageBody,
    messageDate: mqttCreatedGroup.messageDate,
    messageType: "G",
    notiCount: 0,
    receivedDate: "",
    seenDate: "",
    senderID: 0,
    sentDate: "",
  };
  if (Object.keys(groupUpdationDataMqtt) !== null) {
    setAllChatData([groupUpdationDataMqtt, ...allChatData]);
  } else {
  }
};
