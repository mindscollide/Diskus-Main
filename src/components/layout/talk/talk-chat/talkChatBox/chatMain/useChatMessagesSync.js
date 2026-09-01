import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  oneToOneMessages,
  groupMessages,
  unreadMessageCountFunction,
  groupCreationFunction,
  markStarUnstarFunction,
  groupUpdationFunction,
} from "../../functions/oneToOneMessage";
import { InsertOTOMessages, activeChat } from "../../../../../../store/actions/Talk_action";
import { retryFlagState } from "../../../../../../store/actions/Talk_Feature_actions";

/**
 * Owns allMessages/allChatData and the ~17 effects that keep them in sync
 * with Redux (REST loads + MQTT socket events) and with the retry queue for
 * messages sent while offline. Extracted from chatMain.js's message-sync
 * useEffects — only the effect *orchestration* moved here; the actual
 * transform logic still lives in functions/oneToOneMessage.js and is called
 * exactly as chatMain did before.
 *
 * `uploadFileTalk` is passed in because it's owned by the composer (still in
 * chatMain.js) but needed here to re-dispatch queued OTO sends.
 */
function useChatMessagesSync({ uploadFileTalk }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { talkStateData, talkFeatureStates } = useSelector((state) => state);
  const currentUserId = localStorage.getItem("userID");
  const currentConnection = JSON.parse(
    localStorage.getItem("MqttConnectionState"),
  );

  const [allMessages, setAllMessages] = useState([]);
  const [allChatData, setAllChatData] = useState([]);

  // 1. Mirrors the sidebar's chat list into allChatData (read by
  // groupCreationFunction/groupUpdationFunction/unreadMessageCountFunction).
  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setAllChatData(
        talkStateData?.AllUserChats?.AllUserChatsData?.allMessages,
      );
    }
  }, [talkStateData?.AllUserChats?.AllUserChatsData?.allMessages]);

  // 2. Main loader: converts the O/G/B raw Redux message payload into
  // allMessages whenever the active chat's data changes.
  useEffect(() => {
    let allChatMessages = talkStateData.AllMessagesData;

    if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      talkStateData.ActiveChatData.messageType === "O"
    ) {
      oneToOneMessages(setAllMessages, allChatMessages.oneToOneMessages);
    } else if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      talkStateData.ActiveChatData.messageType === "G"
    ) {
      groupMessages(allChatMessages.groupMessages, setAllMessages);
    } else if (
      allChatMessages !== undefined &&
      allChatMessages !== null &&
      talkStateData.ActiveChatData.messageType === "B"
    ) {
      let allBroadcastMessagesArr = [];
      if (
        allChatMessages.broadcastMessages !== undefined &&
        allChatMessages.broadcastMessages !== null &&
        allChatMessages.broadcastMessages.length !== 0
      ) {
        allChatMessages.broadcastMessages.map((messagesData) => {
          if (messagesData.frMessages !== "Direct Message") {
            messagesData.frMessages = messagesData.frMessages.split("|");
          }
          allBroadcastMessagesArr.push({
            messageID: messagesData.messageID,
            senderID: messagesData.senderID,
            receiverID: messagesData.receiverID,
            messageBody: messagesData.messageBody,
            senderName: messagesData.senderName,
            isFlag: messagesData.isFlag,
            sentDate: messagesData.sentDate,
            currDate: messagesData.currDate,
            fileGeneratedName: messagesData.fileGeneratedName,
            fileName: messagesData.fileName,
            frMessages: messagesData.frMessages,
            broadcastName: messagesData.broadcastName,
            messageCount: messagesData.messageCount,
            attachmentLocation: messagesData.attachmentLocation,
            base64Image: messagesData.base64Image,
            attachmentId: messagesData.attachmentId,
            sourceMessageBody: messagesData.sourceMessageBody,
            sourceMessageId: messagesData.sourceMessageId,
          });
        });
      } else {
        allBroadcastMessagesArr = [];
      }
      setAllMessages([...allBroadcastMessagesArr]);
    }
  }, [talkStateData.AllMessagesData]);

  // 3. MQTT block-user event → refresh ActiveChatData with isBlock:1.
  useEffect(() => {
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.length !== 0
    ) {
      let mqttBlockedUserData =
        talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.data[0];
      let activeChatData = {
        id: talkStateData.ActiveChatData.id,
        fullName: talkStateData.ActiveChatData.fullName,
        imgURL: talkStateData.ActiveChatData.imgURL,
        messageBody: talkStateData.ActiveChatData.messageBody,
        messageDate: talkStateData.ActiveChatData.messageDate,
        notiCount: talkStateData.ActiveChatData.notiCount,
        messageType: talkStateData.ActiveChatData.messageType,
        isOnline: talkStateData.ActiveChatData.isOnline,
        companyName: talkStateData.ActiveChatData.companyName,
        sentDate: talkStateData.ActiveChatData.sentDate,
        receivedDate: talkStateData.ActiveChatData.receivedDate,
        seenDate: talkStateData.ActiveChatData.seenDate,
        attachmentLocation: talkStateData.ActiveChatData.attachmentLocation,
        senderID: talkStateData.ActiveChatData.senderID,
        admin: talkStateData.ActiveChatData.admin,
        isBlock: 1,
      };
      if (talkStateData.ActiveChatData.id === mqttBlockedUserData.blockUserID) {
        dispatch(activeChat(activeChatData));
      }
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser]);

  // 4. MQTT unblock-user event → refresh ActiveChatData with isBlock:0.
  useEffect(() => {
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.length !==
        0
    ) {
      let mqttUnblockedUserData =
        talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.data[0];
      let activeChatData = {
        id: talkStateData.ActiveChatData.id,
        fullName: talkStateData.ActiveChatData.fullName,
        imgURL: talkStateData.ActiveChatData.imgURL,
        messageBody: talkStateData.ActiveChatData.messageBody,
        messageDate: talkStateData.ActiveChatData.messageDate,
        notiCount: talkStateData.ActiveChatData.notiCount,
        messageType: talkStateData.ActiveChatData.messageType,
        isOnline: talkStateData.ActiveChatData.isOnline,
        companyName: talkStateData.ActiveChatData.companyName,
        sentDate: talkStateData.ActiveChatData.sentDate,
        receivedDate: talkStateData.ActiveChatData.receivedDate,
        seenDate: talkStateData.ActiveChatData.seenDate,
        attachmentLocation: talkStateData.ActiveChatData.attachmentLocation,
        senderID: talkStateData.ActiveChatData.senderID,
        admin: talkStateData.ActiveChatData.admin,
        isBlock: 0,
      };
      if (
        talkStateData.ActiveChatData.id === mqttUnblockedUserData.blockUserID
      ) {
        dispatch(activeChat(activeChatData));
      }
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser]);

  // 5. MQTT star-message event.
  useEffect(() => {
    if (
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== null &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== undefined &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage.length !== 0
    ) {
      let mqttStarMessageData =
        talkStateData.talkSocketDataStarUnstar.socketStarMessage;
      if (Object.keys(mqttStarMessageData) !== null) {
        if (mqttStarMessageData.messageType === "O") {
          let messageOtoStarred = allMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID,
          );
          if (messageOtoStarred !== undefined) {
            if (messageOtoStarred.isFlag === 1) {
              messageOtoStarred.isFlag = 0;
            } else if (messageOtoStarred.isFlag === 0) {
              messageOtoStarred.isFlag = 1;
            }
            setAllMessages(
              allMessages.map((data) =>
                data.messageID === messageOtoStarred.messageID
                  ? messageOtoStarred
                  : data,
              ),
            );
          }
        } else if (mqttStarMessageData.messageType === "G") {
          let messageGroupStarred = allMessages.find(
            (item) => item.messageID === mqttStarMessageData.messageID,
          );
          if (messageGroupStarred !== undefined) {
            if (messageGroupStarred.isFlag === 1) {
              messageGroupStarred.isFlag = 0;
            } else if (messageGroupStarred.isFlag === 0) {
              messageGroupStarred.isFlag = 1;
            }
            setAllMessages(
              allMessages.map((data) =>
                data.messageID === messageGroupStarred.messageID
                  ? messageGroupStarred
                  : data,
              ),
            );
          }
        }
      }
    }
  }, [talkStateData?.talkSocketDataStarUnstar?.socketStarMessage]);

  // 6. MQTT unstar-message event (via the shared helper — same guarded
  // pattern as #5, kept in oneToOneMessage.js since it's also reused there).
  useEffect(() => {
    if (
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage !== null &&
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage !==
        undefined &&
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage.length !== 0
    ) {
      markStarUnstarFunction(
        talkStateData,
        allChatData,
        setAllMessages,
        allMessages,
        allMessages,
        setAllMessages,
      );
    }
  }, [talkStateData?.talkSocketDataStarUnstar?.socketUnstarMessage]);

  // 7. MQTT group-created event.
  useEffect(() => {
    if (
      talkStateData.talkSocketGroupCreation.groupCreatedData !== null &&
      talkStateData.talkSocketGroupCreation.groupCreatedData !== undefined &&
      talkStateData.talkSocketGroupCreation.groupCreatedData.length !== 0
    ) {
      groupCreationFunction(talkStateData, setAllChatData, allChatData);
    }
  }, [talkStateData?.talkSocketGroupCreation?.groupCreatedData]);

  // 8. MQTT group-updated event.
  useEffect(() => {
    if (
      talkStateData.talkSocketGroupUpdation.groupUpdatedData !== null &&
      talkStateData.talkSocketGroupUpdation.groupUpdatedData !== undefined &&
      talkStateData.talkSocketGroupUpdation.groupUpdatedData.length !== 0
    ) {
      groupUpdationFunction(talkStateData, setAllChatData, allChatData);
    }
  }, [talkStateData?.talkSocketGroupUpdation?.groupUpdatedData]);

  // 9. Unread-count MQTT event.
  useEffect(() => {
    if (
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !== null &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !==
        undefined &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData.length !== 0
    ) {
      unreadMessageCountFunction(talkStateData, allChatData, setAllChatData);
    }
  }, [
    talkStateData?.talkSocketData?.socketInsertOTOMessageData,
    talkStateData?.talkSocketUnreadMessageCount?.unreadMessageData,
  ]);

  // 10. Message-status ack (Sent/Delivered/Seen ticks + timestamps).
  useEffect(() => {
    if (
      talkStateData?.MessageStatusUpdateData.MessageStatusUpdateResponse !==
        null &&
      talkStateData?.MessageStatusUpdateData.MessageStatusUpdateResponse !==
        undefined &&
      talkStateData?.MessageStatusUpdateData.MessageStatusUpdateResponse
        .length !== 0
    ) {
      const acknowledgedMessages =
        talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse.data;

      if (Array.isArray(acknowledgedMessages)) {
        const updatedAllOtoMessages = allMessages.map((message) => {
          const matchingAcknowledgedMessage = acknowledgedMessages.find(
            (acknowledgedMessage) =>
              acknowledgedMessage.messageID === message.messageID,
          );

          if (matchingAcknowledgedMessage) {
            return {
              ...message,
              messageStatus: matchingAcknowledgedMessage.messageStatus,
              sentDate: matchingAcknowledgedMessage.sentDate,
              receivedDate: matchingAcknowledgedMessage.receivedDate,
              seenDate: matchingAcknowledgedMessage.seenDate,
              currDate: matchingAcknowledgedMessage.currDate,
            };
          }
          return message;
        });
        setAllMessages(updatedAllOtoMessages);
      }
    }
  }, [talkStateData?.MessageStatusUpdateData?.MessageStatusUpdateResponse]);

  // 11. MQTT insert OTO (1:1) message — reconciles the optimistic local
  // message with the server copy (matched by uid), and purges the matching
  // entry from the localStorage retry queues.
  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertOTOMessageData !== null &&
      talkStateData.talkSocketData.socketInsertOTOMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertOTOMessageData.length !== 0
    ) {
      let mqttResponseSingleMessage =
        talkStateData.talkSocketData.socketInsertOTOMessageData.data[0];

      const uidToMatch = mqttResponseSingleMessage.uid;

      const existingMessages =
        JSON.parse(localStorage.getItem("singleMessageObject")) || [];

      const existingChatMessages =
        JSON.parse(localStorage.getItem("chatMessagesLocal")) || [];

      const updatedMessages = existingMessages.filter((message) => {
        return message.TalkRequest.Message.UID !== uidToMatch;
      });

      const updatedChatMessages = existingChatMessages.filter((message) => {
        return message.uid !== uidToMatch;
      });

      localStorage.setItem(
        "singleMessageObject",
        JSON.stringify(updatedMessages),
      );

      localStorage.setItem(
        "chatMessagesLocal",
        JSON.stringify(updatedChatMessages),
      );

      if (
        talkStateData.ActiveChatData.id ===
        talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
          .receiverID
      ) {
        let frMessages = mqttResponseSingleMessage.frMessages;

        if (
          frMessages !== "Direct Message" &&
          frMessages.length > 0 &&
          frMessages !== undefined &&
          typeof frMessages !== "object"
        ) {
          frMessages = frMessages.split("|");
        }
        let insertMqttOtoMessageData = {
          attachmentLocation: mqttResponseSingleMessage.attachmentLocation,
          base64Image: mqttResponseSingleMessage.base64Image,
          attachmentId: mqttResponseSingleMessage.attachmentId,
          blockCount: 0,
          broadcastName: mqttResponseSingleMessage.broadcastName,
          currDate: mqttResponseSingleMessage.currDate,
          fileGeneratedName: mqttResponseSingleMessage.fileGeneratedName,
          fileName: mqttResponseSingleMessage.fileName,
          frMessages: frMessages,
          isFlag: 0,
          messageBody: mqttResponseSingleMessage.messageBody,
          messageCount: 0,
          messageID: mqttResponseSingleMessage.messageID,
          messageStatus: mqttResponseSingleMessage.messageStatus,
          receivedDate: mqttResponseSingleMessage.receivedDate,
          receiverID: mqttResponseSingleMessage.receiverID,
          receiverName: mqttResponseSingleMessage.receiverName,
          seenDate: mqttResponseSingleMessage.seenDate,
          senderID: mqttResponseSingleMessage.senderID,
          senderName: mqttResponseSingleMessage.senderName,
          sentDate: mqttResponseSingleMessage.sentDate,
          shoutAll: mqttResponseSingleMessage.shoutAll,
          uid: mqttResponseSingleMessage.uid,
          sourceMessageBody: mqttResponseSingleMessage.sourceMessageBody,
          isRetry: false,
        };

        setAllMessages((prevAllMessages) => {
          const updatedMessages = prevAllMessages.map((message) => {
            if (message.uid === insertMqttOtoMessageData.uid) {
              return {
                ...message,
                ...insertMqttOtoMessageData,
              };
            }
            return message;
          });

          const isUIDInArray = updatedMessages.some(
            (message) => message.uid === insertMqttOtoMessageData.uid,
          );
          if (!isUIDInArray) {
            updatedMessages.push(insertMqttOtoMessageData);
          }

          return updatedMessages;
        });
      } else if (
        parseInt(currentUserId) ===
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            .receiverID &&
        talkStateData.ActiveChatData.id ===
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            .senderID
      ) {
        let frMessages = mqttResponseSingleMessage.frMessages;

        if (
          frMessages !== "Direct Message" &&
          frMessages.length > 0 &&
          frMessages !== undefined &&
          typeof frMessages !== "object"
        ) {
          frMessages = frMessages.split("|");
        }
        let insertMqttOtoMessageData = {
          attachmentLocation: mqttResponseSingleMessage.attachmentLocation,
          base64Image: mqttResponseSingleMessage.base64Image,
          attachmentId: mqttResponseSingleMessage.attachmentId,
          blockCount: 0,
          broadcastName: mqttResponseSingleMessage.broadcastName,
          currDate: mqttResponseSingleMessage.currDate,
          fileGeneratedName: mqttResponseSingleMessage.fileGeneratedName,
          fileName: mqttResponseSingleMessage.fileName,
          frMessages: frMessages,
          isFlag: 0,
          messageBody: mqttResponseSingleMessage.messageBody,
          messageCount: 0,
          messageID: mqttResponseSingleMessage.messageID,
          messageStatus: mqttResponseSingleMessage.messageStatus,
          receivedDate: mqttResponseSingleMessage.receivedDate,
          receiverID: mqttResponseSingleMessage.receiverID,
          receiverName: mqttResponseSingleMessage.receiverName,
          seenDate: mqttResponseSingleMessage.seenDate,
          senderID: mqttResponseSingleMessage.senderID,
          senderName: mqttResponseSingleMessage.senderName,
          sentDate: mqttResponseSingleMessage.sentDate,
          shoutAll: mqttResponseSingleMessage.shoutAll,
          uid: mqttResponseSingleMessage.uid,
          isRetry: false,
          sourceMessageBody: mqttResponseSingleMessage.sourceMessageBody,
        };
        setAllMessages((prevAllMessages) => {
          const updatedMessages = prevAllMessages.map((message) => {
            if (message.uid === insertMqttOtoMessageData.uid) {
              return {
                ...message,
                ...insertMqttOtoMessageData,
              };
            }
            return message;
          });

          const isUIDInArray = updatedMessages.some(
            (message) => message.uid === insertMqttOtoMessageData.uid,
          );
          if (!isUIDInArray) {
            updatedMessages.push(insertMqttOtoMessageData);
          }

          return updatedMessages;
        });
      }
    }
  }, [talkStateData.talkSocketData.socketInsertOTOMessageData]);

  // 12. MQTT insert group message — only appends when the message's
  // receiverID matches the currently-open group (fixed earlier to stop
  // cross-group leaks; see the inline note).
  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertGroupMessageData !== null &&
      talkStateData.talkSocketData.socketInsertGroupMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertGroupMessageData.length !== 0
    ) {
      let mqttInsertGroupMessageData =
        talkStateData.talkSocketData.socketInsertGroupMessageData.data[0];
      let frMessages = mqttInsertGroupMessageData.frMessages;
      if (
        frMessages !== "Direct Message" &&
        frMessages.length > 0 &&
        frMessages !== undefined &&
        typeof frMessages !== "object"
      ) {
        frMessages = frMessages.split("|");
      }
      if (talkStateData.ActiveChatData.messageType === "G") {
        if (
          mqttInsertGroupMessageData.senderID !== undefined &&
          mqttInsertGroupMessageData.senderID !== null &&
          mqttInsertGroupMessageData.senderID !== 0 &&
          mqttInsertGroupMessageData.senderID !== "" &&
          mqttInsertGroupMessageData.senderID !== "0" &&
          talkStateData.ActiveChatData.id ===
            mqttInsertGroupMessageData.receiverID
        ) {
          let insertMqttGroupMessageData = {
            messageID: mqttInsertGroupMessageData.messageID,
            senderID: mqttInsertGroupMessageData.senderID,
            receiverID: mqttInsertGroupMessageData.receiverID,
            messageBody: mqttInsertGroupMessageData.messageBody,
            senderName: mqttInsertGroupMessageData.senderName,
            isFlag: 0,
            sentDate: mqttInsertGroupMessageData.sentDate,
            currDate: mqttInsertGroupMessageData.currDate,
            fileGeneratedName: mqttInsertGroupMessageData.fileGeneratedName,
            fileName: mqttInsertGroupMessageData.fileName,
            shoutAll: mqttInsertGroupMessageData.shoutAll,
            frMessages: frMessages,
            messageCount: 0,
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            base64Image: mqttInsertGroupMessageData.base64Image,
            attachmentId: mqttInsertGroupMessageData.attachmentId,
            uid: mqttInsertGroupMessageData.uid,
            isRetry: false,
            sourceMessageBody: mqttInsertGroupMessageData.sourceMessageBody,
          };
          setAllMessages((prevAllMessages) => {
            const updatedMessages = prevAllMessages.map((message) => {
              if (message.uid === insertMqttGroupMessageData.uid) {
                return {
                  ...message,
                  ...insertMqttGroupMessageData,
                };
              }
              return message;
            });

            const isUIDInArray = updatedMessages.some(
              (message) => message.uid === insertMqttGroupMessageData.uid,
            );
            if (!isUIDInArray) {
              updatedMessages.push(insertMqttGroupMessageData);
            }

            return updatedMessages;
          });
        }
        // A message whose receiverID doesn't match the currently open group
        // must NOT be appended here — allMessages belongs only to the active
        // chat window. Any other group's unread badge/preview is owned by
        // the sidebar list (recentChats.js), which has its own MQTT listener.
      }
    }
  }, [talkStateData.talkSocketData.socketInsertGroupMessageData]);

  // 13. MQTT insert broadcast message. Kept as the pre-existing no-op —
  // broadcast chats currently rely on a full reload rather than incremental
  // push; the intended payload shape isn't visible from this file alone, so
  // this isn't silently "completed" as part of the extraction.
  useEffect(() => {
    if (
      talkStateData.talkSocketInsertBroadcastMessage
        .MessageSendBroadcastResponseData !== null &&
      talkStateData.talkSocketInsertBroadcastMessage
        .MessageSendBroadcastResponseData !== undefined &&
      talkStateData.talkSocketInsertBroadcastMessage
        .MessageSendBroadcastResponseData.length !== 0
    ) {
      try {
        if (talkStateData.ActiveChatData.messageType === "B") {
        }
      } catch {}
    }
  }, [
    talkStateData.talkSocketInsertBroadcastMessage
      .MessageSendBroadcastResponseData,
  ]);

  // 14. MQTT message-delete event (O/G/B).
  useEffect(() => {
    if (
      talkStateData.MqttMessageDeleteData !== null &&
      talkStateData.MqttMessageDeleteData !== undefined &&
      talkStateData.MqttMessageDeleteData.length !== 0
    ) {
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === "O") {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID,
        );
        setAllMessages(updatedMessages);
      }
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === "G") {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID,
        );
        setAllMessages(updatedMessages);
      }
      if (talkStateData.MqttMessageDeleteData.data[0].messageType === "B") {
        const updatedMessages = allMessages.filter(
          (message) =>
            message.messageID !==
            talkStateData.MqttMessageDeleteData.data[0].messageID,
        );
        setAllMessages(updatedMessages);
      }
    }
  }, [talkStateData?.MqttMessageDeleteData]);

  // 15. Marks queued/undelivered messages isRetry:true from the
  // singleMessageObject localStorage queue.
  useEffect(() => {
    if (talkFeatureStates.RetryFlagState === true) {
      const storedSingleMessageObject =
        JSON.parse(localStorage.getItem("singleMessageObject")) || [];
      const uidSet = new Set(
        storedSingleMessageObject.map((item) => item.TalkRequest.Message.UID),
      );
      const updatedAllMessages = allMessages.map((message) => {
        if (uidSet.has(message.uid)) {
          return {
            ...message,
            isRetry: true,
          };
        }
        return message;
      });
      setAllMessages(updatedAllMessages);
    }
  }, [talkFeatureStates.RetryFlagState]);

  // 16. While offline, polls every 5s to re-dispatch queued OTO sends, and
  // gives up (flips retryFlagState) after 20s. Cleanup preserved exactly.
  useEffect(() => {
    let singleMessageObject = JSON.parse(
      localStorage.getItem("singleMessageObject"),
    );

    let interval;

    if (currentConnection === false) {
      interval = setInterval(() => {
        if (singleMessageObject.length !== 0) {
          let otoMessageLocal = JSON.parse(
            localStorage.getItem("singleMessageObject"),
          );

          if (Array.isArray(otoMessageLocal)) {
            for (let i = 0; i < otoMessageLocal.length; i++) {
              dispatch(
                InsertOTOMessages(
                  navigate,
                  otoMessageLocal[i],
                  uploadFileTalk,
                  t,
                ),
              );
            }
          }
        }
      }, 5000);

      setTimeout(() => {
        dispatch(retryFlagState(true));
        clearInterval(interval);
      }, 20000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentConnection, allMessages]);

  // 17. Once every message has isRetry:false, clears the retry flag.
  useEffect(() => {
    const allObjectsHaveIsRetryFalse = allMessages.every(
      (message) => !message.isRetry,
    );

    if (allObjectsHaveIsRetryFalse) {
      dispatch(retryFlagState(false));
    }
  }, [allMessages.length]);

  return { allMessages, setAllMessages, allChatData, setAllChatData };
}

export default useChatMessagesSync;
