import {
  InsertOTOMessages,
  InsertPrivateGroupMessages,
  InsertBroadcastMessages,
  GetBroadcastMessages,
  activeChatID,
} from "../../../../store/actions/Talk_action";
import moment from "moment";
import { useDispatch } from "react-redux";
export const sendChatFunction = ({
  dispatch,
  t,
  setAllChatData,
  allChatData,
  messageSendData,
  setMessageSendData,
  allBroadcastMessages,
  setAllBroadcastMessages,
  chatClickData,
  allGroupMessages,
  setAllGroupMessages,
  allOtoMessages,
  setAllOtoMessages,
  uploadFileTalk,
  activeChat,
}) => {
  //   dispatch(activeChatID(activeChat))

  //Current User ID
  let currentUserId = localStorage.getItem("userID");

  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");

  //CURRENT DATE TIME UTC
  let currentDateTime = new Date();
  let changeDateFormatCurrent = moment(currentDateTime).utc();
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    "YYYYMMDDHHmmss"
  );

  if (messageSendData.Body !== "") {
    if (chatClickData.messageType === "O") {
      let Data = {
        TalkRequest: {
          ChannelID: parseInt(currentOrganizationId),
          Message: messageSendData,
        },
      };
      dispatch(InsertOTOMessages(Data, uploadFileTalk, t));

      let newMessageOto = {
        messageID: 0,
        senderID: parseInt(currentUserId),
        receiverID: parseInt(messageSendData.ReceiverID),
        messageBody: messageSendData.Body,
        senderName: "Ali Mamdani",
        receiverName: chatClickData.fullName,
        shoutAll: 0,
        frMessages: "Direct Message",
        broadcastName: "",
        isFlag: 0,
        sentDate: "",
        receivedDate: "",
        seenDate: "",
        currDate: currentDateTimeUtc,
        messageStatus: "Undelivered",
        fileGeneratedName: "",
        fileName: "",
        messageCount: 0,
        attachmentLocation: "",
        uid: "",
        blockCount: 0,
        sourceMessageBody: "Direct Message",
        sourceMessageId: 0,
      };

      let newChat = {
        id: parseInt(messageSendData.ReceiverID),
        fullName: chatClickData.fullName,
        imgURL: chatClickData.imgURL,
        messageBody: messageSendData.Body,
        messageDate: chatClickData.messageDate,
        notiCount: chatClickData.notiCount,
        messageType: chatClickData.messageType,
        isOnline: chatClickData.isOnline,
        isBlock: 0,
        companyName: chatClickData.companyName,
        sentDate: "",
        receivedDate: "",
        seenDate: "",
        attachmentLocation: messageSendData.AttachmentLocation,
        senderID: parseInt(messageSendData.SenderID),
        admin: chatClickData.admin,
      };
      setMessageSendData({
        ...messageSendData,
        SenderID: currentUserId.toString(),
        ReceiverID: messageSendData.ReceiverID,
        Body: "",
        MessageActivity: "Direct Message",
        FileName: "",
        FileGeneratedName: "",
        Extension: "",
        AttachmentLocation: "",
      });
      let updatedArray = allChatData.map((obj) => {
        if (obj.id === newChat.id) {
          return newChat;
        } else {
          return obj;
        }
      });
      updatedArray = [
        newChat,
        ...updatedArray.filter((obj) => obj.id !== newChat.id),
      ];
      setAllChatData(updatedArray);
      setAllOtoMessages([...allOtoMessages, newMessageOto]);
    } else if (chatClickData.messageType === "G") {
      let Data = {
        TalkRequest: {
          ChannelID: parseInt(currentOrganizationId),
          Message: messageSendData,
        },
      };
      dispatch(InsertPrivateGroupMessages(Data, t));

      let newMessageGroup = {
        messageID: 0,
        senderID: parseInt(currentUserId),
        receiverID: parseInt(messageSendData.ReceiverID),
        messageBody: messageSendData.Body,
        senderName: "Ali Mamdani",
        isFlag: 0,
        sentDate: currentDateTimeUtc,
        currDate: "",
        fileGeneratedName: "",
        fileName: "",
        shoutAll: 0,
        frMessages: "Direct Message",
        messageCount: 0,
        attachmentLocation: "",
        sourceMessageBody: "Direct Message",
        sourceMessageId: 0,
      };

      setAllGroupMessages([...allGroupMessages, newMessageGroup]);

      let newChat = {
        id: parseInt(messageSendData.ReceiverID),
        fullName: chatClickData.fullName,
        imgURL: chatClickData.imgURL,
        messageBody: messageSendData.Body,
        messageDate: chatClickData.messageDate,
        notiCount: chatClickData.notiCount,
        messageType: chatClickData.messageType,
        isOnline: chatClickData.isOnline,
        companyName: chatClickData.companyName,
        sentDate: "",
        receivedDate: "",
        seenDate: "",
        attachmentLocation: messageSendData.AttachmentLocation,
        senderID: parseInt(messageSendData.SenderID),
        admin: chatClickData.admin,
      };
      setMessageSendData({
        ...messageSendData,
        SenderID: currentUserId.toString(),
        ReceiverID: messageSendData.ReceiverID,
        Body: "",
        MessageActivity: "Direct Message",
        FileName: "",
        FileGeneratedName: "",
        Extension: "",
        AttachmentLocation: "",
      });
      let updatedArray = allChatData.map((obj) => {
        if (obj.id === newChat.id) {
          return newChat;
        } else {
          return obj;
        }
      });
      updatedArray = [
        newChat,
        ...updatedArray.filter((obj) => obj.id !== newChat.id),
      ];
      setAllChatData(updatedArray);
    } else if (chatClickData.messageType === "B") {
      let Data = {
        TalkRequest: {
          ChannelID: parseInt(currentOrganizationId),
          Message: messageSendData,
        },
      };
      dispatch(InsertBroadcastMessages(Data, t));
      let newMessage = {
        attachmentLocation: messageSendData.AttachmentLocation,
        blockCount: 0,
        broadcastName: "",
        currDate: currentDateTimeUtc,
        fileGeneratedName: messageSendData.FileGeneratedName,
        fileName: messageSendData.FileName,
        frMessages: "Direct Message",
        isFlag: 0,
        messageBody: messageSendData.Body,
        messageCount: 0,
        messageID: 0,
        messageStatus: "Undelivered",
        receivedDate: "",
        receiverID: parseInt(messageSendData.ReceiverID),
        receiverName: "",
        seenDate: "",
        senderID: parseInt(messageSendData.SenderID),
        senderName: "Muhammad Ovais",
        sentDate: "",
        shoutAll: 0,
        uid: "",
      };
      let newChat = {
        id: parseInt(messageSendData.ReceiverID),
        fullName: chatClickData.fullName,
        imgURL: chatClickData.imgURL,
        messageBody: messageSendData.Body,
        messageDate: chatClickData.messageDate,
        notiCount: chatClickData.notiCount,
        messageType: chatClickData.messageType,
        isOnline: chatClickData.isOnline,
        companyName: chatClickData.companyName,
        sentDate: "",
        receivedDate: "",
        seenDate: "",
        attachmentLocation: messageSendData.AttachmentLocation,
        senderID: parseInt(messageSendData.SenderID),
        admin: chatClickData.admin,
      };
      allBroadcastMessages.push(newMessage);
      setAllBroadcastMessages(allBroadcastMessages);
      setMessageSendData({
        ...messageSendData,
        SenderID: currentUserId.toString(),
        ReceiverID: messageSendData.ReceiverID,
        Body: "",
        MessageActivity: "Direct Message",
        FileName: "",
        FileGeneratedName: "",
        Extension: "",
        AttachmentLocation: "",
      });
      let updatedArray = allChatData.map((obj) => {
        if (obj.id === newChat.id) {
          return newChat;
        } else {
          return obj;
        }
      });
      setAllChatData(updatedArray);
      let broadcastMessagesData = {
        UserID: currentUserId,
        BroadcastID: newChat.id,
        NumberOfMessages: 10,
        OffsetMessage: 5,
      };
      dispatch(GetBroadcastMessages(broadcastMessagesData, t));
    } else {
    }
  } else {
  }
};
