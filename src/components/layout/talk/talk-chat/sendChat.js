import {
  InsertOTOMessages,
  InsertPrivateGroupMessages,
  InsertBroadcastMessages,
  GetBroadcastMessages,
  activeChatID,
} from "../../../../store/actions/Talk_action";
import moment from "moment";
import { useDispatch } from "react-redux";
/**
 * @module sendChat
 * @description Provides the sendChatFunction utility that handles outbound
 * message dispatch for all Talk conversation types (one-to-one, group, and
 * broadcast/shout-all). It optimistically updates local state while
 * dispatching the appropriate Redux action to persist the message via the API.
 */

/**
 * Sends a chat message for the active conversation. Dispatches the correct
 * Redux action based on the conversation type ('O' = one-to-one, 'G' = group,
 * 'B' = broadcast/shout-all), optimistically appends the new message to local
 * state, moves the chat to the top of the chat list, and resets the message
 * composer fields.
 *
 * @param {Object} params - Named parameter object.
 * @param {Function} params.dispatch - Redux dispatch function.
 * @param {Function} params.t - i18next translation function.
 * @param {Function} params.setAllChatData - React state setter for the chat list.
 * @param {Array<Object>} params.allChatData - Current full chat list.
 * @param {Object} params.messageSendData - Payload object describing the outbound message.
 * @param {Function} params.setMessageSendData - React state setter for the message composer payload.
 * @param {Array<Object>} params.allBroadcastMessages - Current broadcast messages array.
 * @param {Function} params.setAllBroadcastMessages - React state setter for broadcast messages.
 * @param {Object} params.chatClickData - Metadata of the currently active chat/contact.
 * @param {Array<Object>} params.allGroupMessages - Current group messages array.
 * @param {Function} params.setAllGroupMessages - React state setter for group messages.
 * @param {Array<Object>} params.allOtoMessages - Current one-to-one messages array.
 * @param {Function} params.setAllOtoMessages - React state setter for OTO messages.
 * @param {string|null} params.uploadFileTalk - File upload reference passed to the OTO insert action.
 * @param {Object} params.activeChat - The active chat record (currently unused, reserved).
 * @returns {void}
 */
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
