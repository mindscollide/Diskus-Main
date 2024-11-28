import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from "../../../../../commen/functions/date_formater";
import { chatBoxActiveFlag } from "../../../../../store/actions/Talk_Feature_actions";
import {
  GetOTOUserMessages,
  GetGroupMessages,
  GetBroadcastMessages,
  activeChat,
  pushChatData,
  BlockUnblockUser,
  DeleteShout,
  LeaveGroup,
  GetAllUserChats,
  mqttGroupCreated,
  mqttGroupLeft,
} from "../../../../../store/actions/Talk_action";
import { Spin } from "antd";
import { TextField, ResultMessage, LoaderPanel } from "../../../../elements";
import SingleIcon from "../../../../../assets/images/Single-Icon.png";
import GroupIcon from "../../../../../assets/images/Group-Icon.png";
import ShoutIcon from "../../../../../assets/images/Shout-Icon.png";
import DoubleTickIcon from "../../../../../assets/images/DoubleTick-Icon.png";
import DoubleTickDeliveredIcon from "../../../../../assets/images/DoubleTickDelivered-Icon.png";
import SingleTickIcon from "../../../../../assets/images/SingleTick-Icon.png";
import TimerIcon from "../../../../../assets/images/Timer-Icon.png";
import DropDownIcon from "../../../../../assets/images/dropdown-icon.png";
import ClipIcon from "../../../../../assets/images/ClipIcon.png";
import NoRecentChatsIcon from "../../../../../assets/images/No-Recent-Chats.png";
import { useTranslation } from "react-i18next";

const RecentChats = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  //Current language
  let lang = localStorage.getItem("i18nextLng");

  const { talkFeatureStates, talkStateData } = useSelector((state) => state);

  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");

  const date = new Date();
  //CURRENT DATE TIME UTC
  let currentDateTime = new Date();
  let changeDateFormatCurrent = moment(currentDateTime).utc();
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    "YYYYMMDDHHmmss"
  );
  let currentUtcDate = currentDateTimeUtc.slice(0, 8);

  //YESTERDAY'S DATE
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1); // Subtract 1 day
  let changeDateFormatYesterday = moment(yesterdayDate).utc();
  let yesterdayDateUtc = moment(changeDateFormatYesterday).format("YYYYMMDD");

  const [allChatData, setAllChatData] = useState([]);
  const [updateAllChatData, setUpdateAllChatData] = useState(false);
  const [searchChatValue, setSearchChatValue] = useState("");

  //Dropdown state of chat head menu (Dropdown icon wali)
  const [chatHeadMenuActive, setChatHeadMenuActive] = useState(false);

  const [newGroupData, setNewGroupData] = useState([]);

  // useEffect(() => {
  //   dispatch(
  //     GetAllUserChats(navigate, currentUserId, currentOrganizationId, t)
  //   );
  // }, []);

  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setAllChatData(talkStateData.AllUserChats.AllUserChatsData.allMessages);
    } else {
      setAllChatData([]);
    }
  }, [talkStateData.AllUserChats.AllUserChatsData]);

  //Search Chats
  const searchChat = (e) => {
    setSearchChatValue(e);
    try {
      if (
        talkStateData.AllUserChats.AllUserChatsData !== undefined &&
        talkStateData.AllUserChats.AllUserChatsData !== null &&
        talkStateData.AllUserChats.AllUserChatsData.length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
              (value) => {
                return value.fullName.toLowerCase().includes(e.toLowerCase());
              }
            );

          if (filteredData.length === 0) {
            setAllChatData(
              talkStateData.AllUserChats.AllUserChatsData.allMessages
            );
          } else {
            setAllChatData(filteredData);
          }
        } else if (e === "" || e === null) {
          let data = talkStateData.AllUserChats.AllUserChatsData.allMessages;
          setSearchChatValue("");
          setAllChatData(data);
        }
      }
    } catch {}
  };

  //Managing that state of chat head, if show or hide
  const activateChatHeadMenu = (id) => {
    if (chatHeadMenuActive === false) {
      setChatHeadMenuActive(id);
    } else {
      setChatHeadMenuActive(false);
    }
  };

  const chatClick = (record) => {
    localStorage.setItem("ActiveChatType", record.messageType);
    localStorage.setItem("userNameChat", record.fullName);
    if (!talkFeatureStates.ChatBoxActiveFlag) {
      dispatch(chatBoxActiveFlag(true));
    }

    let chatOTOData = {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
      OpponentUserId: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    };

    let chatGroupData = {
      UserID: parseInt(currentUserId),
      ChannelID: currentOrganizationId,
      GroupID: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    };

    let broadcastMessagesData = {
      UserID: currentUserId,
      BroadcastID: record.id,
      NumberOfMessages: 10,
      OffsetMessage: 0,
    };
    try {
      if (record.messageType === "O") {
        dispatch(GetOTOUserMessages(navigate, chatOTOData, t));
      } else if (record.messageType === "G") {
        dispatch(GetGroupMessages(navigate, chatGroupData, t));
      } else if (record.messageType === "B") {
        dispatch(GetBroadcastMessages(navigate, broadcastMessagesData, t));
      }
      dispatch(activeChat(record));
    } catch (error) {
      //
    }
    localStorage.setItem("activeOtoChatID", record.id);
  };

  const unblockblockContactHandler = (record) => {
    let Data = {
      senderID: currentUserId,
      channelID: currentOrganizationId,
      opponentUserId: record.id,
    };
    dispatch(BlockUnblockUser(navigate, Data, t));
    setChatHeadMenuActive(false);
  };

  const leaveGroupHandler = (record) => {
    let data = {
      UserID: parseInt(currentUserId),
      GroupID: record.id,
    };
    dispatch(LeaveGroup(navigate, data, t));
    setChatHeadMenuActive(false);
  };

  const deleteShoutFunction = (record) => {
    let Data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
        Group: {
          GroupID: record.id,
        },
      },
    };
    dispatch(DeleteShout(navigate, Data, t));
    setChatHeadMenuActive(false);
  };

  useEffect(() => {
    try {
      if (allChatData.length !== 0) {
        const updatedChatData = [...allChatData]; // Create a copy of the array

        // Find the index of the chat to update or insert
        const index = updatedChatData.findIndex(
          (chat) => chat.id === talkStateData.PushChatData.id
        );

        if (index !== -1) {
          // Update the existing chat data
          updatedChatData[index] = {
            ...updatedChatData[index],
            ...talkStateData.PushChatData,
          };
        } else {
          // Insert the new chat data
          updatedChatData.push(talkStateData.PushChatData);
        }

        // Sort the updatedChatData array by messageDate in descending order
        updatedChatData.sort((a, b) => {
          const dateA = a.messageDate;
          const dateB = b.messageDate;

          // Convert custom date strings to numerical values for comparison
          const numericDateA = parseInt(
            `${dateA.slice(0, 8)}${dateA.slice(8)}`
          );
          const numericDateB = parseInt(
            `${dateB.slice(0, 8)}${dateB.slice(8)}`
          );

          return numericDateB - numericDateA;
        });

        // Set the state with the sorted updatedChatData
        setAllChatData(updatedChatData);
      } else if (
        allChatData.length === 0 &&
        talkStateData.PushChatData.length !== 0
      ) {
        setAllChatData((prevChatData) => [
          ...prevChatData,
          talkStateData.PushChatData,
        ]);
      }
    } catch (error) {
      console.log("ERROR");
    }
  }, [talkStateData.PushChatData]);

  //Making Data from MQTT Response
  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertOTOMessageData !== null &&
      talkStateData.talkSocketData.socketInsertOTOMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertOTOMessageData.length !== 0
    ) {
      try {
        let mqttInsertOtoMessageData =
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0];
        if (talkStateData.ActiveChatData.length === 0) {
          let allChatNewMessageOtoData = {
            id:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverID
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderID
                : null,
            fullName:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverName
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderName
                : null,
            imgURL: "O.jpg",
            messageBody: mqttInsertOtoMessageData.messageBody,
            messageDate: mqttInsertOtoMessageData.sentDate,
            notiCount: 0,
            messageType: "O",
            isOnline: true,
            isBlock: 0,
            companyName: "Tresmark",
            sentDate: mqttInsertOtoMessageData.sentDate,
            receivedDate: mqttInsertOtoMessageData.receivedDate,
            seenDate: mqttInsertOtoMessageData.seenDate,
            attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
            senderID: mqttInsertOtoMessageData.senderID,
            admin: 0,
          };

          dispatch(pushChatData(allChatNewMessageOtoData));
        } else if (
          talkStateData.ActiveChatData.id ===
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            .receiverID
        ) {
          let allChatNewMessageOtoData = {
            id:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverID
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderID
                : null,
            fullName:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverName
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderName
                : null,
            imgURL: "O.jpg",
            messageBody: mqttInsertOtoMessageData.messageBody,
            messageDate: mqttInsertOtoMessageData.sentDate,
            notiCount: 0,
            messageType: "O",
            isOnline: true,
            isBlock: 0,
            companyName: "Tresmark",
            sentDate: mqttInsertOtoMessageData.sentDate,
            receivedDate: mqttInsertOtoMessageData.receivedDate,
            seenDate: mqttInsertOtoMessageData.seenDate,
            attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
            senderID: mqttInsertOtoMessageData.senderID,
            admin: 0,
          };

          dispatch(pushChatData(allChatNewMessageOtoData));
        } else if (
          parseInt(currentUserId) ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .receiverID &&
          talkStateData.ActiveChatData.id ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID
        ) {
          let allChatNewMessageOtoData = {
            id:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverID
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderID
                : null,
            fullName:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverName
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderName
                : null,
            imgURL: "O.jpg",
            messageBody: mqttInsertOtoMessageData.messageBody,
            messageDate: mqttInsertOtoMessageData.sentDate,
            notiCount: 0,
            messageType: "O",
            isOnline: true,
            isBlock: 0,
            companyName: "Tresmark",
            sentDate: mqttInsertOtoMessageData.sentDate,
            receivedDate: mqttInsertOtoMessageData.receivedDate,
            seenDate: mqttInsertOtoMessageData.seenDate,
            attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
            senderID: mqttInsertOtoMessageData.senderID,
            admin: 0,
          };
          dispatch(pushChatData(allChatNewMessageOtoData));
        } else if (
          talkStateData.ActiveChatData.id !==
            mqttInsertOtoMessageData.senderID &&
          talkStateData.ActiveChatData.id !==
            mqttInsertOtoMessageData.receiverID
        ) {
          let allChatNewMessageOtoData = {
            id:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverID
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderID
                : null,
            fullName:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverName
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderName
                : null,
            imgURL: "O.jpg",
            messageBody: mqttInsertOtoMessageData.messageBody,
            messageDate: mqttInsertOtoMessageData.sentDate,
            notiCount: 0,
            messageType: "O",
            isOnline: true,
            isBlock: 0,
            companyName: "Tresmark",
            sentDate: mqttInsertOtoMessageData.sentDate,
            receivedDate: mqttInsertOtoMessageData.receivedDate,
            seenDate: mqttInsertOtoMessageData.seenDate,
            attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
            senderID: mqttInsertOtoMessageData.senderID,
            admin: 0,
          };
          dispatch(pushChatData(allChatNewMessageOtoData));
        }
      } catch {}
    }
    //
  }, [talkStateData.talkSocketData.socketInsertOTOMessageData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertGroupMessageData !== null &&
      talkStateData.talkSocketData.socketInsertGroupMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertGroupMessageData.length !== 0
    ) {
      try {
        let mqttInsertGroupMessageData =
          talkStateData.talkSocketData.socketInsertGroupMessageData.data[0];
        if (talkStateData.ActiveChatData.length === 0) {
          let newGroupMessageChat = {
            id: mqttInsertGroupMessageData.receiverID,
            fullName: mqttInsertGroupMessageData.groupName,
            imgURL: "O.jpg",
            messageBody: mqttInsertGroupMessageData.messageBody,
            messageDate: mqttInsertGroupMessageData.sentDate,
            notiCount: 0,
            messageType: "G",
            isOnline: true,
            companyName: "Tresmark",
            sentDate: mqttInsertGroupMessageData.sentDate,
            receivedDate: "",
            seenDate: "",
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            senderID: parseInt(currentUserId),
            admin: mqttInsertGroupMessageData.admin,
          };
          dispatch(pushChatData(newGroupMessageChat));
        } else if (
          talkStateData.ActiveChatData.messageType === "" &&
          talkStateData.ActiveChatData.id === 0
        ) {
          let newGroupMessageChat = {
            id: mqttInsertGroupMessageData.receiverID,
            fullName: mqttInsertGroupMessageData.groupName,
            imgURL: "O.jpg",
            messageBody: mqttInsertGroupMessageData.messageBody,
            messageDate: mqttInsertGroupMessageData.sentDate,
            notiCount: 0,
            messageType: "G",
            isOnline: true,
            companyName: "Tresmark",
            sentDate: mqttInsertGroupMessageData.sentDate,
            receivedDate: "",
            seenDate: "",
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            senderID: parseInt(currentUserId),
            admin: mqttInsertGroupMessageData.admin,
          };
          dispatch(pushChatData(newGroupMessageChat));
        } else if (
          mqttInsertGroupMessageData.senderID !== undefined &&
          mqttInsertGroupMessageData.senderID !== null &&
          mqttInsertGroupMessageData.senderID !== 0 &&
          mqttInsertGroupMessageData.senderID !== "" &&
          mqttInsertGroupMessageData.senderID !== "0" &&
          talkStateData.ActiveChatData.id ===
            mqttInsertGroupMessageData.receiverID
        ) {
          let newGroupMessageChat = {
            id: mqttInsertGroupMessageData.receiverID,
            fullName: mqttInsertGroupMessageData.groupName,
            imgURL: "O.jpg",
            messageBody: mqttInsertGroupMessageData.messageBody,
            messageDate: mqttInsertGroupMessageData.sentDate,
            notiCount: 0,
            messageType: "G",
            isOnline: true,
            companyName: "Tresmark",
            sentDate: mqttInsertGroupMessageData.sentDate,
            receivedDate: "",
            seenDate: "",
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            senderID: parseInt(currentUserId),
            admin: mqttInsertGroupMessageData.admin,
          };
          dispatch(pushChatData(newGroupMessageChat));
        }
        if (
          mqttInsertGroupMessageData.senderID !== undefined &&
          mqttInsertGroupMessageData.senderID !== null &&
          mqttInsertGroupMessageData.senderID !== 0 &&
          mqttInsertGroupMessageData.senderID !== "" &&
          mqttInsertGroupMessageData.senderID !== "0" &&
          talkStateData.ActiveChatData.id !==
            mqttInsertGroupMessageData.receiverID
        ) {
          let newGroupMessageChat = {
            id: mqttInsertGroupMessageData.receiverID,
            fullName: mqttInsertGroupMessageData.groupName,
            imgURL: "O.jpg",
            messageBody: mqttInsertGroupMessageData.messageBody,
            messageDate: mqttInsertGroupMessageData.sentDate,
            notiCount: 0,
            messageType: "G",
            isOnline: true,
            companyName: "Tresmark",
            sentDate: mqttInsertGroupMessageData.sentDate,
            receivedDate: "",
            seenDate: "",
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            senderID: parseInt(currentUserId),
            admin: mqttInsertGroupMessageData.admin,
          };
          dispatch(pushChatData(newGroupMessageChat));
        } else if (
          mqttInsertGroupMessageData.senderID !== undefined &&
          mqttInsertGroupMessageData.senderID !== null &&
          mqttInsertGroupMessageData.senderID !== 0 &&
          mqttInsertGroupMessageData.senderID !== "" &&
          mqttInsertGroupMessageData.senderID !== "0" &&
          parseInt(currentUserId) !== mqttInsertGroupMessageData.senderID
        ) {
          let newGroupMessageChat = {
            id: mqttInsertGroupMessageData.receiverID,
            fullName: mqttInsertGroupMessageData.groupName,
            imgURL: "O.jpg",
            messageBody: mqttInsertGroupMessageData.messageBody,
            messageDate: mqttInsertGroupMessageData.sentDate,
            notiCount: 0,
            messageType: "G",
            isOnline: true,
            companyName: "Tresmark",
            sentDate: mqttInsertGroupMessageData.sentDate,
            receivedDate: "",
            seenDate: "",
            attachmentLocation: mqttInsertGroupMessageData.attachmentLocation,
            senderID: parseInt(currentUserId),
            admin: mqttInsertGroupMessageData.admin,
          };
          dispatch(pushChatData(newGroupMessageChat));
        }
      } catch (error) {}
    }
  }, [talkStateData.talkSocketData.socketInsertGroupMessageData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !==
        undefined &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !== null &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData.length !== 0
    ) {
      let chatNotificationCount =
        talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0];
      let idActiveChat = Number(localStorage.getItem("activeOtoChatID"));
      if (idActiveChat === 0) {
        const updatedAllChatData = allChatData.map((chat) => {
          if (chat.id === chatNotificationCount.chatID) {
            chat.notiCount = chatNotificationCount.chatCount;
          }
          return chat;
        });
        setAllChatData(updatedAllChatData);
      } else if (
        talkStateData.ActiveChatData.id ===
        talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0]
          .chatID
      ) {
        const updatedAllChatData = allChatData.map((item) => {
          if (
            item.id ===
            talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0]
              .chatID
          ) {
            return {
              ...item,
              notiCount: 0,
            };
          }
          return item;
        });
        setAllChatData(updatedAllChatData);
      } else {
        const updatedAllChatData = allChatData.map((item) => {
          if (
            item.id ===
            talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0]
              .chatID
          ) {
            return {
              ...item,
              notiCount:
                talkStateData.talkSocketUnreadMessageCount.unreadMessageData
                  .data[0].chatCount,
            };
          }
          return item;
        });
        setAllChatData(updatedAllChatData);
      }
    }
  }, [talkStateData?.talkSocketUnreadMessageCount?.unreadMessageData]);

  useEffect(() => {
    if (
      talkStateData.talkSocketGroupCreation.groupCreatedData !== undefined &&
      talkStateData.talkSocketGroupCreation.groupCreatedData !== null &&
      talkStateData.talkSocketGroupCreation.groupCreatedData.length !== 0
    ) {
      let filterData =
        talkStateData.talkSocketGroupCreation.groupCreatedData.data[0];
      let newGroup = {
        id: filterData.id,
        fullName: filterData.fullName,
        imgURL: filterData.imgURL,
        messageBody: filterData.messageBody,
        messageDate: currentDateTimeUtc,
        notiCount: 0,
        messageType: "G",
        isOnline: false,
        isBlock: 0,
        companyName: "",
        sentDate: "",
        receivedDate: "",
        seenDate: "",
        attachmentLocation: "",
        senderID: 0,
        admin: filterData.admin,
      };
      let updatedArray = allChatData.map((obj) => {
        if (obj.id === newGroup.id) {
          return newGroup;
        } else {
          return obj;
        }
      });
      updatedArray = [
        newGroup,
        ...updatedArray.filter((obj) => obj.id !== newGroup.id),
      ];

      setAllChatData(updatedArray);
      dispatch(mqttGroupCreated([]));
    }
  }, [talkStateData.talkSocketGroupCreation.groupCreatedData]);

  useEffect(() => {
    if (
      talkStateData.MqttGroupLeftData !== undefined &&
      talkStateData.MqttGroupLeftData !== null &&
      talkStateData.MqttGroupLeftData.length !== 0
    ) {
      let leaveGroupData = talkStateData.MqttGroupLeftData.data[0];
      const indexToRemove = allChatData.findIndex(
        (item) => item.id === leaveGroupData.groupID
      );
      // Check if the object was found
      if (indexToRemove !== -1) {
        // Remove the object from allChatData
        allChatData.splice(indexToRemove, 1);
      }
    }
    // dispatch(mqttGroupLeft([]))
  }, [talkStateData.MqttGroupLeftData]);

  useEffect(() => {
    if (
      talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse !==
        null &&
      talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse !==
        undefined &&
      talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse
        .length !== 0
    ) {
      if (
        talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse.data
          .length !== 0
      ) {
        let latestMessageStatus =
          talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse
            .data[0];
        // Iterate through allChatData
        for (let i = 0; i < allChatData.length; i++) {
          if (allChatData[i].id === latestMessageStatus.receiverID) {
            // Update the relevant properties with values from latestMessageStatus
            allChatData[i].sentDate = latestMessageStatus.sentDate;
            allChatData[i].receivedDate = latestMessageStatus.receivedDate;
            allChatData[i].seenDate = latestMessageStatus.seenDate;
          }
        }
        setAllChatData(allChatData);
      }
    }
  }, [talkStateData.MessageStatusUpdateData.MessageStatusUpdateResponse]);

  useEffect(() => {
    // Check if the userID in mqttUnblockedResponse matches any id in allChatData
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.length !== 0
    ) {
      let mqttUnblockedResponse =
        talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser.data[0];

      const updatedAllChatData = allChatData.map((chatItem) => {
        if (chatItem.id === mqttUnblockedResponse.blockUserID) {
          // If there's a match, update the isBlock property

          return { ...chatItem, isBlock: mqttUnblockedResponse.isBlock };
        }
        return chatItem; // Keep other chat items unchanged
      });

      // Update the state with the modified allChatData
      setAllChatData(updatedAllChatData);
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketBlockUser]);

  useEffect(() => {
    // Check if the userID in mqttUnblockedResponse matches any id in allChatData
    if (
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !==
        undefined &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser !== null &&
      talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.length !==
        0
    ) {
      let mqttUnblockedResponse =
        talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser.data[0];

      const updatedAllChatData = allChatData.map((chatItem) => {
        if (chatItem.id === mqttUnblockedResponse.blockUserID) {
          // If there's a match, update the isBlock property
          return { ...chatItem, isBlock: mqttUnblockedResponse.isBlock };
        }
        return chatItem; // Keep other chat items unchanged
      });

      // Update the state with the modified allChatData
      setAllChatData(updatedAllChatData);
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser]);

  useEffect(() => {
    if (
      talkStateData.LastMessageDeletionObject !== undefined &&
      talkStateData.LastMessageDeletionObject !== null &&
      talkStateData.LastMessageDeletionObject.length !== 0
    ) {
      if (
        talkStateData.LastMessageDeletionObject.data[0].messageBody === "" &&
        talkStateData.LastMessageDeletionObject.data[0].chatID !== undefined
      ) {
        // const updatedAllChatData = allChatData.filter(
        //   (item) =>
        //     item.id !== talkStateData.LastMessageDeletionObject.data[0].chatID,
        // )
        //
        // setAllChatData(updatedAllChatData)
        // Find the index of the object in the stateWithMultipleObjects array that matches chatID
        const indexToRemove = allChatData.findIndex(
          (obj) =>
            obj.id === talkStateData.LastMessageDeletionObject.data[0].chatID
        );
        if (indexToRemove !== -1) {
          allChatData.splice(indexToRemove, 1);
        }
        setAllChatData(allChatData);
      } else if (
        talkStateData.LastMessageDeletionObject.data[0].messageBody !== "" &&
        talkStateData.LastMessageDeletionObject.data[0].chatID !== undefined
      ) {
        let data = {
          messageBody:
            talkStateData.LastMessageDeletionObject.data[0].messageBody,
          senderID: talkStateData.LastMessageDeletionObject.data[0].senderID,
          receiverID:
            talkStateData.LastMessageDeletionObject.data[0].receiverID,
          fk_ChannelID:
            talkStateData.LastMessageDeletionObject.data[0].fk_ChannelID,
          messageID: talkStateData.LastMessageDeletionObject.data[0].messageID,
          messageStatus:
            talkStateData.LastMessageDeletionObject.data[0].messageStatus,
          chatType: talkStateData.LastMessageDeletionObject.data[0].chatType,
          chatID: talkStateData.LastMessageDeletionObject.data[0].chatID,
          sentDate: talkStateData.LastMessageDeletionObject.data[0].sentDate,
          receivedDate:
            talkStateData.LastMessageDeletionObject.data[0].receivedDate,
          seenDate: talkStateData.LastMessageDeletionObject.data[0].seenDate,
        };
        // Find the index of the object with a matching ID in allChatData
        const index = allChatData.findIndex((item) => item.id === data.chatID);

        // Check if a matching object was found
        if (index !== -1) {
          // Update the properties in the matching object
          allChatData[index].messageBody = data.messageBody;
          allChatData[index].senderID = data.senderID;
          allChatData[index].sentDate = data.sentDate;
          allChatData[index].receivedDate = data.receivedDate;
          allChatData[index].seenDate = data.seenDate;
        }

        // Now allChatData contains the updated values if there was a match
        setAllChatData(allChatData);
      }
    }
  }, [talkStateData.LastMessageDeletionObject]);

  return (
    <>
      {talkFeatureStates.GlobalChatsSearchFlag === true ? (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <TextField
              maxLength={200}
              applyClass="form-control2"
              name="Name"
              change={(e) => {
                searchChat(e.target.value);
              }}
              value={searchChatValue}
              placeholder={t("Search-Chat")}
              labelclass={"d-none"}
            />
          </Col>
        </Row>
      ) : null}
      {talkStateData.AllUserChats.Loading === true &&
      allChatData.length === 0 ? (
        <>
          {/* <Spin className="talk-overallchat-spinner" /> */}
          <LoaderPanel
            message={t("Safeguarding-your-data-to-enhance-the-experience")}
          />
        </>
      ) : talkStateData.AllUserChats.Loading === false &&
        allChatData !== undefined &&
        allChatData !== null &&
        allChatData.length > 0 ? (
        allChatData.map((dataItem, index) => {
          return (
            <Row
              key={index}
              className="single-chat"
              onClick={() => chatClick(dataItem)}
            >
              <Col lg={2} md={2} sm={2} className="bottom-border">
                <div className="chat-profile-icon">
                  {dataItem.messageType === "O" ? (
                    <>
                      <img
                        draggable="false"
                        src={SingleIcon}
                        width={25}
                        alt=""
                      />
                    </>
                  ) : dataItem.messageType === "G" ? (
                    <>
                      <img
                        draggable="false"
                        src={GroupIcon}
                        width={35}
                        alt=""
                      />
                    </>
                  ) : dataItem.messageType === "B" ? (
                    <>
                      <img
                        draggable="false"
                        src={ShoutIcon}
                        width={25}
                        alt=""
                      />
                    </>
                  ) : (
                    <img draggable="false" src={SingleIcon} width={25} alt="" />
                  )}
                </div>
              </Col>
              <Col lg={10} md={10} sm={10} className="bottom-border">
                <div className={"chat-block"}>
                  <p
                    // onClick={() => chatClick(dataItem)}
                    className="chat-username m-0"
                  >
                    {" "}
                    {dataItem.fullName}
                  </p>
                  <p
                    // onClick={() => chatClick(dataItem)}
                    className="chat-message m-0"
                  >
                    {dataItem.messageType === "O" ? (
                      <span className="chat-tick-icon">
                        {dataItem.senderID === parseInt(currentUserId) &&
                        dataItem.sentDate === "" &&
                        dataItem.receivedDate === "" &&
                        dataItem.seenDate === "" ? (
                          <img
                            draggable="false"
                            src={TimerIcon}
                            className="img-cover"
                            alt=""
                          />
                        ) : dataItem.senderID === parseInt(currentUserId) &&
                          dataItem.sentDate !== "" &&
                          dataItem.receivedDate === "" &&
                          dataItem.seenDate === "" ? (
                          <img
                            draggable="false"
                            src={SingleTickIcon}
                            className="img-cover"
                            alt=""
                          />
                        ) : dataItem.senderID === parseInt(currentUserId) &&
                          dataItem.sentDate !== "" &&
                          dataItem.receivedDate !== "" &&
                          dataItem.seenDate === "" ? (
                          <img
                            draggable="false"
                            src={DoubleTickDeliveredIcon}
                            className="img-cover"
                            alt=""
                          />
                        ) : dataItem.senderID === parseInt(currentUserId) &&
                          dataItem.sentDate !== "" &&
                          dataItem.receivedDate !== "" &&
                          dataItem.seenDate !== "" ? (
                          <img
                            draggable="false"
                            src={DoubleTickIcon}
                            className="img-cover"
                            alt=""
                          />
                        ) : null}
                      </span>
                    ) : null}

                    {dataItem.messageBody === "" &&
                    dataItem.attachmentLocation !== "" ? (
                      <>
                        <span className="attachment-recent-chat">
                          <img draggable="false" src={ClipIcon} alt="" />
                          {dataItem.attachmentLocation
                            .substring(
                              dataItem.attachmentLocation.lastIndexOf("/") + 1
                            )
                            .replace(/^\d+_/, "")}
                        </span>
                      </>
                    ) : (
                      dataItem.messageBody
                    )}
                  </p>
                  <p
                    // onClick={() => chatClick(dataItem)}
                    className="chat-date m-0"
                  >
                    {dataItem.messageDate.slice(0, 8) === currentUtcDate &&
                    dataItem.messageDate !== "" &&
                    dataItem.messageDate !== undefined ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkTime(
                          dataItem.messageDate,
                          lang
                        )}
                      </>
                    ) : dataItem.messageDate.slice(0, 8) === yesterdayDateUtc &&
                      dataItem.messageDate !== "" &&
                      dataItem.messageDate !== undefined ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(
                          dataItem.messageDate,
                          lang
                        ) + " "}
                        | {t("Yesterday")}
                      </>
                    ) : (
                      <>
                        {dataItem.messageDate !== "" &&
                        dataItem.messageDate !== undefined
                          ? newTimeFormaterAsPerUTCTalkDate(
                              dataItem.messageDate,
                              lang
                            )
                          : ""}
                      </>
                    )}
                  </p>
                  {dataItem.notiCount > 0 ? (
                    <span className="new-message-count">
                      {dataItem.notiCount}
                    </span>
                  ) : null}
                  <div className="chathead-box-icons">
                    <img
                      draggable="false"
                      src={DropDownIcon}
                      alt=""
                      onClick={() => activateChatHeadMenu(dataItem.id)}
                    />
                    {chatHeadMenuActive === dataItem.id ? (
                      <div className="dropdown-menus-chathead">
                        {/* <span onClick={deleteChatHandler}>
                            Delete Chat
                          </span> */}
                        {dataItem.messageType === "O" &&
                        dataItem.isBlock === 0 ? (
                          <span
                            onClick={() => unblockblockContactHandler(dataItem)}
                            style={{ borderBottom: "none" }}
                          >
                            {t("Block")}
                          </span>
                        ) : dataItem.messageType === "O" &&
                          dataItem.isBlock === 1 ? (
                          <span
                            onClick={() => unblockblockContactHandler(dataItem)}
                            style={{ borderBottom: "none" }}
                          >
                            {t("Unblock")}
                          </span>
                        ) : dataItem.messageType === "G" &&
                          dataItem.isBlock === 0 ? (
                          <span
                            onClick={() => leaveGroupHandler(dataItem)}
                            style={{ borderBottom: "none" }}
                          >
                            {t("Leave-Group")}
                          </span>
                        ) : dataItem.messageType === "B" ? (
                          <span
                            onClick={() => deleteShoutFunction(dataItem)}
                            style={{ borderBottom: "none" }}
                          >
                            {t("Delete-Shout")}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Col>
            </Row>
          );
        })
      ) : talkStateData.AllUserChats.Loading === false &&
        allChatData.length === 0 ? (
        // <p>{t('No-Chats-Available')}</p>
        <ResultMessage
          icon={<img src={NoRecentChatsIcon} width={250} />}
          title={"It looks like you haven't made any recent chats"}
          className="emptyRecentChats"
        />
      ) : null}
    </>
  );
};

export default RecentChats;
