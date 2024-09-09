import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Keywords from "react-keywords";
import { Checkbox } from "antd";
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from "../../../../../../../commen/functions/date_formater";
import { oneToOneMessages } from "../../../functions/oneToOneMessage";
import { Row, Col } from "react-bootstrap";
import { TextField, Button, InputDatePicker } from "../../../../../../elements";
import {
  DateDisplayFormat,
  DateSendingFormat,
} from "../../../../../../../commen/functions/date_formater";
import {
  DownloadChat,
  pushMessageData,
  pushChatData,
  fileUploadData,
} from "../../../../../../../store/actions/Talk_action";
import {
  saveFlag,
  emailFlag,
  printFlag,
} from "../../../../../../../store/actions/Talk_Feature_actions";
import ChatFooter from "../../chatFooter/chatFooter";
import { filesUrlTalk } from "../../../../../../../commen/apis/Api_ends_points";
import FileImageUpload from "./../file-image-upload/file_image_upload";
import DropDownIcon from "../../../../../../../assets/images/dropdown-icon.png";
import DocumentIcon from "../../../../../../../assets/images/Document-Icon.png";
import DownloadIcon from "../../../../../../../assets/images/Download-Icon.png";
import StarredMessageIcon from "../../../../../../../assets/images/Starred-Message-Icon.png";
import DoubleTickIcon from "../../../../../../../assets/images/DoubleTick-Icon.png";
import DoubleTickDeliveredIcon from "../../../../../../../assets/images/DoubleTickDelivered-Icon.png";
import SingleTickIcon from "../../../../../../../assets/images/SingleTick-Icon.png";
import TimerIcon from "../../../../../../../assets/images/Timer-Icon.png";
import DropDownChatIcon from "../../../../../../../assets/images/dropdown-icon-chatmessage.png";
import { useTranslation } from "react-i18next";
import enUS from "antd/es/date-picker/locale/en_US";
import { checkURL } from "./utils";

const OtoMessages = () => {
  //Scroll down state
  const chatMessages = useRef();

  //Chat Message Feature
  const chatMessageRefs = useRef();

  const { talkStateData, talkFeatureStates } = useSelector((state) => state);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  //Translation
  const { t } = useTranslation();

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

  let currentUtcDate = currentDateTimeUtc.slice(0, 8);
  let currentUtcTime = currentDateTimeUtc.slice(8, 15);

  //YESTERDAY'S DATE
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1); // Subtract 1 day
  let changeDateFormatYesterday = moment(yesterdayDate).utc();
  let yesterdayDateUtc = moment(changeDateFormatYesterday).format("YYYYMMDD");

  var currentDateToday = moment().format("YYYYMMDD");

  const [searchChatWord, setSearchChatWord] = useState("");

  //Loading State
  const [isLoading, setIsLoading] = useState(true);

  //Enable Chat Feature Options
  const [chatFeatureActive, setChatFeatureActive] = useState(false);

  //all oto messages
  const [allOtoMessages, setAllOtoMessages] = useState([]);

  const [showCheckboxes, setShowCheckboxes] = useState(false);

  //Popup Options
  const [todayCheckState, setTodayCheckState] = useState(false);
  const [allCheckState, setAllCheckState] = useState(false);
  const [customCheckState, setCustomCheckState] = useState(false);

  // Modal Date States
  const [endDatedisable, setEndDatedisable] = useState(true);
  const [chatDateState, setChatDateState] = useState({
    StartDate: "",
    EndDate: "",
  });

  const highlight = (txt) => (
    <span style={{ background: "red", color: "#fff" }}>{txt}</span>
  );

  // on change checkbox today
  function onChangeToday(e) {
    setTodayCheckState(e.target.checked);
    setAllCheckState(false);
    setCustomCheckState(false);
  }

  // on change checkbox All
  function onChangeAll(e) {
    setAllCheckState(e.target.checked);
    setTodayCheckState(false);
    setCustomCheckState(false);
  }

  // on change checkbox Custom
  function onChangeCustom(e) {
    setCustomCheckState(e.target.checked);
    setTodayCheckState(false);
    setAllCheckState(false);
  }

  const onChangeDate = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (name === "StartDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
      setEndDatedisable(false);
    }
    if (name === "EndDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
    }
  };

  //Selected Option of the chat
  const chatFeatureSelected = (record, id) => {
    // dispatch(activeMessageID(record))
    // if (chatFeatureActive === false) {
    //   setChatFeatureActive(id)
    // } else {
    //   setChatFeatureActive(false)
    // }
  };

  //On Click of Forward Feature
  const forwardFeatureHandler = () => {
    // if (showCheckboxes === false) {
    //   setShowCheckboxes(true)
    // } else {
    //   setShowCheckboxes(false)
    // }
  };

  const downloadChat = () => {
    let Data = {
      TalkRequest: {
        AdditionalChatFunctionsModel: {
          MyID: parseInt(currentUserId),
          ChatID: talkStateData.ActiveChatData.id,
          ChatType: talkStateData.ActiveChatData.messageType,
          ChannelID: parseInt(currentOrganizationId),
          FromDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                allCheckState === true &&
                customCheckState === false
              ? "19700101"
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.StartDate
              : "",
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                allCheckState === true &&
                customCheckState === false
              ? "20991231"
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.EndDate
              : "",
        },
      },
    };
    dispatch(DownloadChat(Data, t, navigate));

    dispatch(saveFlag(false));
  };

  const printChat = () => {
    let Data = {
      TalkRequest: {
        AdditionalChatFunctionsModel: {
          MyID: parseInt(currentUserId),
          ChatID: talkStateData.ActiveChatData.id,
          ChatType: talkStateData.ActiveChatData.messageType,
          ChannelID: parseInt(currentOrganizationId),
          FromDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                allCheckState === true &&
                customCheckState === false
              ? "19700101"
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.StartDate
              : "",
          ToDate:
            todayCheckState === true &&
            allCheckState === false &&
            customCheckState === false
              ? currentDateToday
              : todayCheckState === false &&
                allCheckState === true &&
                customCheckState === false
              ? "20991231"
              : todayCheckState === false &&
                allCheckState === false &&
                customCheckState === true
              ? chatDateState.EndDate
              : "",
        },
      },
    };
    dispatch(DownloadChat(Data, t, navigate));

    dispatch(printFlag(false));
  };

  // Cancel Modal
  const handleCancel = () => {
    dispatch(saveFlag(false));
    dispatch(printFlag(false));
    dispatch(emailFlag(false));
    setTodayCheckState(false);
    setAllCheckState(false);
    setCustomCheckState(false);
    setChatDateState({
      ...chatDateState,
      StartDate: "",
      EndDate: "",
    });
    setEndDatedisable(true);
  };

  //chat messages

  useEffect(() => {
    let allotomessages =
      talkStateData.UserOTOMessages.UserOTOMessagesData.oneToOneMessages;

    if (allotomessages !== undefined) {
      oneToOneMessages(setAllOtoMessages, allotomessages);
    }
  }, [talkStateData.UserOTOMessages.UserOTOMessagesData]);

  useEffect(() => {
    if (talkFeatureStates.ChatMessagesSearchFlag) {
      setSearchChatWord("");
    }
  }, [talkFeatureStates?.ChatMessagesSearchFlag]);

  useEffect(() => {
    if (
      talkStateData.PushMessageData !== null &&
      talkStateData.PushMessageData !== undefined &&
      talkStateData.PushMessageData.length !== 0 &&
      Object.keys(talkStateData.PushMessageData).length !== 0
    ) {
      //
      // let newData = [...allOtoMessages]
      //
      // newData.push(talkStateData.PushMessageData)
      // setAllOtoMessages(newData)
      // dispatch(pushMessageData([]))
    }
  }, [allOtoMessages]);

  //Making Data from MQTT Response
  useEffect(() => {
    let responseTalkMqttOTO =
      talkStateData.talkSocketData.socketInsertOTOMessageData;
    if (
      responseTalkMqttOTO !== null &&
      responseTalkMqttOTO !== undefined &&
      responseTalkMqttOTO.length !== 0 &&
      Object.keys(responseTalkMqttOTO).length !== 0
    ) {
      if (talkFeatureStates.ChatBoxActiveFlag) {
        try {
          // Message Send Condition
          if (
            talkStateData.ActiveChatData.id ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .receiverID
          ) {
            let mqttInsertOtoMessageData =
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0];
            let insertMqttOtoMessageData = {
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              blockCount: 0,
              broadcastName: mqttInsertOtoMessageData.broadcastName,
              currDate: mqttInsertOtoMessageData.currDate,
              fileGeneratedName: mqttInsertOtoMessageData.fileGeneratedName,
              fileName: mqttInsertOtoMessageData.fileName,
              frMessages: mqttInsertOtoMessageData.frMessages,
              isFlag: 0,
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageCount: 0,
              messageID: mqttInsertOtoMessageData.messageID,
              messageStatus: mqttInsertOtoMessageData.messageStatus,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              receiverID: mqttInsertOtoMessageData.receiverID,
              receiverName: mqttInsertOtoMessageData.receiverName,
              seenDate: mqttInsertOtoMessageData.seenDate,
              senderID: mqttInsertOtoMessageData.senderID,
              senderName: mqttInsertOtoMessageData.senderName,
              sentDate: mqttInsertOtoMessageData.sentDate,
              shoutAll: mqttInsertOtoMessageData.shoutAll,
              uid: mqttInsertOtoMessageData.uid,
            };
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
            if (Object.keys(insertMqttOtoMessageData) !== null) {
              if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null
              ) {
                setAllOtoMessages((prevState) => {
                  const updatedMessages = [...prevState];
                  updatedMessages[updatedMessages.length - 1] =
                    insertMqttOtoMessageData;
                  return updatedMessages;
                });

                dispatch(pushChatData(allChatNewMessageOtoData));
              } else if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                insertMqttOtoMessageData.hasOwnProperty("messageBody") &&
                insertMqttOtoMessageData.messageBody !== undefined &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null &&
                allOtoMessages[allOtoMessages.length - 1].hasOwnProperty(
                  "messageBody"
                ) &&
                insertMqttOtoMessageData.messageBody !==
                  allOtoMessages[allOtoMessages.length - 1].messageBody
              ) {
                setAllOtoMessages([
                  ...allOtoMessages,
                  insertMqttOtoMessageData,
                ]);

                dispatch(pushChatData(allChatNewMessageOtoData));
              }
            } else {
              let allotomessages =
                talkStateData.UserOTOMessages.UserOTOMessagesData
                  .oneToOneMessages;
              if (allotomessages != undefined) {
                let allMessagesArr = [];
                allotomessages.map((messagesData) => {
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
                  });
                });
                setAllOtoMessages([...allMessagesArr]);
              }
            }
          }
          // Message Receive Condition
          else if (
            parseInt(currentUserId) ===
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .receiverID &&
            talkStateData.ActiveChatData.id ===
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .senderID
          ) {
            let mqttInsertOtoMessageData =
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0];
            let insertMqttOtoMessageData = {
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              blockCount: 0,
              broadcastName: mqttInsertOtoMessageData.broadcastName,
              currDate: mqttInsertOtoMessageData.currDate,
              fileGeneratedName: mqttInsertOtoMessageData.fileGeneratedName,
              fileName: mqttInsertOtoMessageData.fileName,
              frMessages: mqttInsertOtoMessageData.frMessages,
              isFlag: 0,
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageCount: 0,
              messageID: mqttInsertOtoMessageData.messageID,
              messageStatus: mqttInsertOtoMessageData.messageStatus,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              receiverID: mqttInsertOtoMessageData.receiverID,
              receiverName: mqttInsertOtoMessageData.receiverName,
              seenDate: mqttInsertOtoMessageData.seenDate,
              senderID: mqttInsertOtoMessageData.senderID,
              senderName: mqttInsertOtoMessageData.senderName,
              sentDate: mqttInsertOtoMessageData.sentDate,
              shoutAll: mqttInsertOtoMessageData.shoutAll,
              uid: mqttInsertOtoMessageData.uid,
            };
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
            if (Object.keys(insertMqttOtoMessageData) !== null) {
              if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                insertMqttOtoMessageData.hasOwnProperty("messageBody") &&
                insertMqttOtoMessageData.messageBody !== undefined &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null &&
                allOtoMessages[allOtoMessages.length - 1].hasOwnProperty(
                  "messageBody"
                ) &&
                allOtoMessages[allOtoMessages.length - 1].messageBody !==
                  undefined &&
                insertMqttOtoMessageData.messageBody !==
                  allOtoMessages[allOtoMessages.length - 1].messageBody
              ) {
                setAllOtoMessages([
                  ...allOtoMessages,
                  insertMqttOtoMessageData,
                ]);
                dispatch(pushChatData(allChatNewMessageOtoData));
              } else if (
                insertMqttOtoMessageData !== undefined &&
                insertMqttOtoMessageData !== null &&
                insertMqttOtoMessageData.hasOwnProperty("messageBody") &&
                insertMqttOtoMessageData.messageBody !== undefined &&
                allOtoMessages.length > 0 &&
                allOtoMessages[allOtoMessages.length - 1] !== undefined &&
                allOtoMessages[allOtoMessages.length - 1] !== null &&
                allOtoMessages[allOtoMessages.length - 1].hasOwnProperty(
                  "messageBody"
                ) &&
                insertMqttOtoMessageData.messageBody !==
                  allOtoMessages[allOtoMessages.length - 1].messageBody
              ) {
                setAllOtoMessages((prevState) => {
                  const updatedMessages = [...prevState];
                  updatedMessages[updatedMessages.length - 1] =
                    insertMqttOtoMessageData;
                  return updatedMessages;
                });

                dispatch(pushChatData(allChatNewMessageOtoData));
                // setAllChatData(updatedArray)
              }
            } else {
              let allotomessages =
                talkStateData.UserOTOMessages.UserOTOMessagesData
                  .oneToOneMessages;
              if (allotomessages != undefined) {
                let allMessagesArr = [];
                allotomessages.map((messagesData) => {
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
                  });
                });
                setAllOtoMessages([...allMessagesArr]);
              }
            }
          }
          // Kisi dusri chat ka message
          else if (
            parseInt(currentUserId) ===
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .receiverID &&
            talkStateData.ActiveChatData.id !==
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
                .senderID
          ) {
            // Chats unmatched scene

            let mqttInsertOtoMessageData =
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0];
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
      } else {
        let mqttInsertOtoMessageData =
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0];
        let allChatNewMessageOtoData = {
          id:
            parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
              ? mqttInsertOtoMessageData.receiverID
              : parseInt(currentUserId) === mqttInsertOtoMessageData.receiverID
              ? mqttInsertOtoMessageData.senderID
              : null,
          fullName:
            parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
              ? mqttInsertOtoMessageData.receiverName
              : parseInt(currentUserId) === mqttInsertOtoMessageData.receiverID
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
    }
    //
  }, [talkStateData.talkSocketData.socketInsertOTOMessageData]);

  return (
    <>
      {allOtoMessages !== undefined &&
      (allOtoMessages !== null) & (allOtoMessages.length !== 0)
        ? allOtoMessages.map((messageData, index) => {
            var ext = messageData.attachmentLocation
              ? messageData.attachmentLocation.split(".").pop()
              : "";
            if (messageData.senderID === parseInt(currentUserId)) {
              return (
                <>
                  {talkFeatureStates.SaveModalFlag === true ? (
                    <>
                      <div className="chat-menu-popups" key={index}>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {" "}
                            <div className="chat-modal-Heading">
                              <h1>{t("Save-Messages")}</h1>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <div className="chat-options">
                              <Checkbox
                                checked={todayCheckState}
                                onChange={onChangeToday}
                              >
                                {t("Today")}
                              </Checkbox>
                              <Checkbox
                                checked={allCheckState}
                                onChange={onChangeAll}
                              >
                                {t("All")}
                              </Checkbox>
                              <Checkbox
                                checked={customCheckState}
                                onChange={onChangeCustom}
                              >
                                {t("Custom")}
                              </Checkbox>
                            </div>
                            {customCheckState === true ? (
                              <Row>
                                <Col lg={1} md={1} sm={12}></Col>
                                <Col lg={5} md={5} sm={12}>
                                  <label style={{ marginLeft: "5px" }}>
                                    <b style={{ fontSize: "0.7rem" }}>
                                      {t("Date-from")}
                                    </b>
                                  </label>{" "}
                                  <InputDatePicker
                                    name="StartDate"
                                    size="large"
                                    width="100%"
                                    value={
                                      chatDateState.StartDate
                                        ? DateDisplayFormat(
                                            chatDateState.StartDate
                                          )
                                        : null
                                    }
                                    DateRange
                                    placeholder={t("Select-date")}
                                    change={onChangeDate}
                                    locale={enUS}
                                  />
                                </Col>
                                <Col lg={5} md={5} sm={12}>
                                  <label style={{ marginLeft: "5px" }}>
                                    <b style={{ fontSize: "0.7rem" }}>
                                      {t("Date-to")}
                                    </b>
                                  </label>
                                  <InputDatePicker
                                    name="EndDate"
                                    size="large"
                                    width="100%"
                                    value={
                                      chatDateState.EndDate
                                        ? DateDisplayFormat(
                                            chatDateState.EndDate
                                          )
                                        : null
                                    }
                                    DateRange
                                    placeholder={t("Select Date")}
                                    change={onChangeDate}
                                    disable={endDatedisable}
                                    locale={enUS}
                                  />
                                </Col>
                                <Col lg={1} md={1} sm={12}></Col>
                              </Row>
                            ) : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} md={12} sm={12} className="text-center">
                            <Button
                              className=" Ok-btn"
                              text={t("Okay")}
                              onClick={downloadChat}
                            />
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : talkFeatureStates.PrintModalFlag === true ? (
                    <>
                      <div className="chat-menu-popups" key={index}>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {" "}
                            <div className="chat-modal-Heading">
                              <h1>{t("Print-Messages")}</h1>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {" "}
                            <div className="chat-options">
                              <Checkbox
                                checked={todayCheckState}
                                onChange={onChangeToday}
                              >
                                {t("Today")}
                              </Checkbox>
                              <Checkbox
                                checked={allCheckState}
                                onChange={onChangeAll}
                              >
                                {t("All")}
                              </Checkbox>
                              <Checkbox
                                checked={customCheckState}
                                onChange={onChangeCustom}
                              >
                                {t("Custom")}
                              </Checkbox>
                            </div>
                            {customCheckState === true ? (
                              <Row>
                                <Col lg={6} md={6} sm={12}>
                                  <label style={{ marginLeft: "5px" }}>
                                    <b style={{ fontSize: "0.7rem" }}>
                                      {t("Date From")}
                                    </b>
                                  </label>{" "}
                                  <InputDatePicker
                                    name="StartDate"
                                    size="large"
                                    width="100%"
                                    value={
                                      chatDateState.StartDate
                                        ? DateDisplayFormat(
                                            chatDateState.StartDate
                                          )
                                        : null
                                    }
                                    DateRange
                                    placeholder={t("Select-Date")}
                                    change={onChangeDate}
                                  />
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                  <label style={{ marginLeft: "5px" }}>
                                    <b style={{ fontSize: "0.7rem" }}>
                                      {t("Date To")}
                                    </b>
                                  </label>
                                  <InputDatePicker
                                    name="EndDate"
                                    size="large"
                                    width="100%"
                                    value={
                                      chatDateState.EndDate
                                        ? DateDisplayFormat(
                                            chatDateState.EndDate
                                          )
                                        : null
                                    }
                                    DateRange
                                    placeholder={t("Select Date")}
                                    change={onChangeDate}
                                    disable={endDatedisable}
                                  />
                                </Col>
                              </Row>
                            ) : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} md={12} sm={12} className="text-center">
                            <Button
                              className=" Ok-btn"
                              text={t("Okay")}
                              onClick={printChat}
                            />
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : talkFeatureStates.EmailModalFlag === true ? (
                    <>
                      <div className="chat-menu-popups" key={index}>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {" "}
                            <div className="chat-modal-Heading">
                              <h1>{t("Email Messages")}</h1>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {" "}
                            <div className="chat-options">
                              <Checkbox
                                checked={todayCheckState}
                                onChange={onChangeToday}
                              >
                                {t("Today")}
                              </Checkbox>
                              <Checkbox
                                checked={allCheckState}
                                onChange={onChangeAll}
                              >
                                {t("All")}
                              </Checkbox>
                              <Checkbox
                                checked={customCheckState}
                                onChange={onChangeCustom}
                              >
                                {t("Custom")}
                              </Checkbox>
                            </div>
                            {customCheckState === true ? (
                              <Row>
                                <Col lg={6} md={6} sm={12}>
                                  <label style={{ marginLeft: "5px" }}>
                                    <b style={{ fontSize: "0.7rem" }}>
                                      {t("Date From")}
                                    </b>
                                  </label>{" "}
                                  <InputDatePicker
                                    name="StartDate"
                                    size="large"
                                    width="100%"
                                    value={
                                      chatDateState.StartDate
                                        ? DateDisplayFormat(
                                            chatDateState.StartDate
                                          )
                                        : null
                                    }
                                    DateRange
                                    placeholder={t("Select Date")}
                                    change={onChangeDate}
                                  />
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                  <label style={{ marginLeft: "5px" }}>
                                    <b style={{ fontSize: "0.7rem" }}>
                                      {t("Date To")}
                                    </b>
                                  </label>
                                  <InputDatePicker
                                    name="EndDate"
                                    size="large"
                                    width="100%"
                                    value={
                                      chatDateState.EndDate
                                        ? DateDisplayFormat(
                                            chatDateState.EndDate
                                          )
                                        : null
                                    }
                                    DateRange
                                    placeholder={t("Select Date")}
                                    change={onChangeDate}
                                    disable={endDatedisable}
                                  />
                                </Col>
                              </Row>
                            ) : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} md={12} sm={12} className="text-center">
                            <Button
                              className=" Ok-btn"
                              text={t("Okay")}
                              onClick={handleCancel}
                            />
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : null}
                  {/* : deleteMessage === true ? (
            <>
              <div className="chat-menu-popups">
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <div className="chat-modal-Heading">
                      <h1>Delete Messages</h1>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={2} md={2} sm={12}></Col>
                  <Col lg={4} md={4} sm={12}>
                    <Button
                      className=" Ok-btn"
                      text="Delete"
                      onClick={() => deleteSingleMessage(deleteMessageData)}
                    />
                  </Col>
                  <Col lg={4} md={4} sm={12}>
                    <Button
                      className=" White-btn"
                      text="Cancel"
                      onClick={handleCancel}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={12}></Col>
                </Row>
              </div>
            </>
          ) */}
                  {talkFeatureStates.ChatMessagesSearchFlag === true ? (
                    <>
                      <div className="chat-searchfield" key={index}>
                        <Row>
                          <Col>
                            <TextField
                              maxLength={200}
                              applyClass="form-control2"
                              name="Name"
                              change={(e) => setSearchChatWord(e.target.value)}
                              value={searchChatWord}
                              placeholder={t("Search Chat")}
                              labelclass={"d-none"}
                            />
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : null}
                  <div className="direct-chat-msg text-right mb-2 " key={index}>
                    <div className="direct-chat-text message-outbox message-box text-start">
                      <div
                        className="chatmessage-box-icons"
                        onClick={() =>
                          chatFeatureSelected(
                            messageData,
                            messageData.messageID
                          )
                        }
                        ref={chatMessageRefs}
                      >
                        <img
                          draggable="false"
                          className="dropdown-icon"
                          src={DropDownIcon}
                        />
                        {chatFeatureActive === messageData.messageID ? (
                          <div className="dropdown-menus-chatmessage">
                            <span
                            // onClick={() =>
                            //   replyFeatureHandler(messageData)
                            // }
                            >
                              {t("Reply")}
                            </span>
                            <span onClick={forwardFeatureHandler}>
                              {t("Forward")}
                            </span>
                            <span
                            // onClick={() =>
                            //   deleteFeatureHandler(messageData)
                            // }
                            >
                              {t("Delete")}
                            </span>
                            <span
                            // onClick={() =>
                            //   messageInfoHandler(messageData)
                            // }
                            >
                              {t("Message-Info")}
                            </span>
                            <span
                              // onClick={() =>
                              //   markUnmarkStarMessageHandler(
                              //     messageData,
                              //   )
                              // }
                              style={{
                                borderBottom: "none",
                              }}
                            >
                              {messageData.isFlag === 0 ? (
                                <>{t("Star-Message")}</>
                              ) : (
                                <>{t("Unstar-Message")}</>
                              )}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      {messageData.frMessages === "Direct Message" ? (
                        <>
                          {messageData.attachmentLocation !== "" &&
                          checkURL(messageData.attachmentLocation) ? (
                            <div className="image-thumbnail-chat">
                              <a
                                href={messageData.attachmentLocation}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  draggable="false"
                                  src={messageData.attachmentLocation}
                                  alt=""
                                />
                              </a>
                            </div>
                          ) : messageData.attachmentLocation !== "" &&
                            (ext === "doc" ||
                              ext === "docx" ||
                              ext === "xls" ||
                              ext === "xlsx" ||
                              ext === "pdf" ||
                              ext === "txt" ||
                              ext === "gif") ? (
                            <div className="file-uploaded-chat">
                              <img
                                draggable="false"
                                src={DocumentIcon}
                                alt=""
                              />
                              <span className="attached-file">
                                {messageData.attachmentLocation
                                  .substring(
                                    messageData.attachmentLocation.lastIndexOf(
                                      "/"
                                    ) + 1
                                  )
                                  .replace(/^\d+_/, "")}
                              </span>
                              <a
                                href={
                                  filesUrlTalk + messageData.attachmentLocation
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  draggable="false"
                                  src={DownloadIcon}
                                  alt=""
                                />
                              </a>
                            </div>
                          ) : messageData.attachmentLocation !== "" &&
                            (ext === "jpg" ||
                              ext === "png" ||
                              ext === "jpeg") ? (
                            <div className="image-thumbnail-chat">
                              <a
                                href={
                                  filesUrlTalk + messageData.attachmentLocation
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  draggable="false"
                                  src={
                                    filesUrlTalk +
                                    messageData.attachmentLocation
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                          ) : null}
                          <span className="direct-chat-body color-5a5a5a">
                            <Keywords value={searchChatWord} render={highlight}>
                              {messageData.messageBody}
                            </Keywords>
                          </span>
                        </>
                      ) : messageData.frMessages === "Broadcast Message" ? (
                        <>
                          {messageData.attachmentLocation !== "" &&
                          (ext === "jpg" || ext === "png" || ext === "jpeg") ? (
                            <div className="image-thumbnail-chat">
                              <a
                                href={
                                  filesUrlTalk + messageData.attachmentLocation
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  draggable="false"
                                  src={
                                    filesUrlTalk +
                                    messageData.attachmentLocation
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                          ) : messageData.attachmentLocation !== "" &&
                            (ext === "doc" ||
                              ext === "docx" ||
                              ext === "xls" ||
                              ext === "xlsx" ||
                              ext === "pdf" ||
                              ext === "txt" ||
                              ext === "gif") ? (
                            <div className="file-uploaded-chat">
                              <img
                                draggable="false"
                                src={DocumentIcon}
                                alt=""
                              />
                              <span className="attached-file">
                                {messageData.attachmentLocation
                                  .substring(
                                    messageData.attachmentLocation.lastIndexOf(
                                      "/"
                                    ) + 1
                                  )
                                  .replace(/^\d+_/, "")}
                              </span>
                              <a
                                href={
                                  filesUrlTalk + messageData.attachmentLocation
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  draggable="false"
                                  src={DownloadIcon}
                                  alt=""
                                />
                              </a>
                            </div>
                          ) : (
                            <div className="replied-message-send">
                              <p className="replied-message-sender m-0">
                                {messageData.frMessages[3]}
                              </p>
                              <p className="replied-message m-0">
                                {messageData.sourceMessageBody}
                              </p>
                            </div>
                          )}

                          <span
                            className="direct-chat-body color-5a5a5a"
                            key={index}
                          >
                            <Keywords value={searchChatWord} render={highlight}>
                              {messageData.messageBody}
                            </Keywords>
                          </span>
                        </>
                      ) : null}

                      <div className="d-flex mt-1 justify-content-end">
                        <div className="star-time-status ml-auto text-end">
                          <span className="starred-status">
                            {messageData.isFlag === 1 ? (
                              <img
                                draggable="false"
                                src={StarredMessageIcon}
                                alt=""
                              />
                            ) : null}
                          </span>
                          <span className="direct-chat-sent-time chat-datetime">
                            {messageData.sentDate.slice(0, 8) ===
                            currentUtcDate ? (
                              <>
                                {newTimeFormaterAsPerUTCTalkTime(
                                  messageData.sentDate
                                )}
                              </>
                            ) : messageData.sentDate.slice(0, 8) ===
                              yesterdayDateUtc ? (
                              <>
                                {newTimeFormaterAsPerUTCTalkDate(
                                  messageData.sentDate
                                ) + " "}
                                | {t("Yesterday")}
                              </>
                            ) : messageData.sentDate === "" ? null : (
                              <>
                                {newTimeFormaterAsPerUTCTalkDate(
                                  messageData.sentDate
                                )}
                              </>
                            )}
                          </span>
                          <div className="message-status">
                            {messageData.messageStatus === "Sent" ? (
                              <img
                                draggable="false"
                                src={SingleTickIcon}
                                alt=""
                              />
                            ) : messageData.messageStatus === "Delivered" ? (
                              <img
                                draggable="false"
                                src={DoubleTickDeliveredIcon}
                                alt=""
                              />
                            ) : messageData.messageStatus === "Seen" ? (
                              <img
                                draggable="false"
                                src={DoubleTickIcon}
                                alt=""
                              />
                            ) : messageData.messageStatus === "Undelivered" ? (
                              <img draggable="false" src={TimerIcon} alt="" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    {showCheckboxes === true ? (
                      <Checkbox
                        // checked={receiverCheckbox}
                        // checked={
                        //   messagesChecked.includes(messageData)
                        //     ? true
                        //     : false
                        // }
                        // onChange={() =>
                        //   messagesCheckedHandler(messageData, index)
                        // }
                        className="chat-message-checkbox-receiver"
                      />
                    ) : null}
                  </div>
                </>
              );
            } else if (messageData.senderID !== parseInt(currentUserId)) {
              return (
                <>
                  {talkFeatureStates.ChatMessagesSearchFlag === true ? (
                    <>
                      <div className="chat-searchfield">
                        <Row>
                          <Col>
                            <TextField
                              maxLength={200}
                              applyClass="form-control2"
                              name="Name"
                              change={(e) => setSearchChatWord(e.target.value)}
                              value={searchChatWord}
                              placeholder="Search Chat"
                              labelclass={"d-none"}
                            />
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : null}
                  <div className="direct-chat-msg text-left mb-2 " key={index}>
                    {showCheckboxes === true ? (
                      <Checkbox
                        // checked={
                        //   messagesChecked.includes(messageData)
                        //     ? true
                        //     : false
                        // }
                        // onChange={() =>
                        //   messagesCheckedHandler(messageData, index)
                        // }
                        className="chat-message-checkbox-sender"
                      />
                    ) : null}

                    <div className="direct-chat-text message-inbox message-box text-start">
                      <div
                        className="chatmessage-box-icons"
                        // onClick={() =>
                        //   chatFeatureSelected(
                        //     messageData,
                        //     messageData.messageID,
                        //   )
                        // }
                        ref={chatMessageRefs}
                      >
                        <img
                          draggable="false"
                          className="dropdown-icon"
                          src={DropDownChatIcon}
                        />
                        {chatFeatureActive === messageData.messageID ? (
                          <div className="dropdown-menus-chatmessage">
                            <span
                            // onClick={() =>
                            //   replyFeatureHandler(messageData)
                            // }
                            >
                              {t("Reply")}
                            </span>
                            <span onClick={forwardFeatureHandler}>Forward</span>
                            <span
                            // onClick={() =>
                            //   deleteFeatureHandler(messageData)
                            // }
                            >
                              {t("Delete")}
                            </span>
                            <span
                            // onClick={() =>
                            //   messageInfoHandler(messageData)
                            // }
                            >
                              {t("Message-Info")}
                            </span>
                            <span
                              // onClick={() =>
                              //   markUnmarkStarMessageHandler(messageData)
                              // }
                              style={{
                                borderBottom: "none",
                              }}
                            >
                              {messageData.isFlag === 0 ? (
                                <>{t("Star-Message")}</>
                              ) : (
                                <>{t("Unstar-Message")}</>
                              )}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      {messageData.frMessages === "Direct Message" ||
                      messageData.frMessages === "Broadcast Message" ? (
                        <>
                          {messageData.attachmentLocation !== "" &&
                          (ext === "jpg" || ext === "png" || ext === "jpeg") ? (
                            <div className="image-thumbnail-chat">
                              <a
                                href={
                                  filesUrlTalk + messageData.attachmentLocation
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  draggable="false"
                                  src={
                                    filesUrlTalk +
                                    messageData.attachmentLocation
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                          ) : messageData.attachmentLocation !== "" &&
                            (ext === "doc" ||
                              ext === "docx" ||
                              ext === "xls" ||
                              ext === "xlsx" ||
                              ext === "pdf" ||
                              ext === "txt" ||
                              ext === "gif") ? (
                            <div className="file-uploaded-chat received">
                              <img
                                draggable="false"
                                src={DocumentIcon}
                                alt=""
                              />
                              <span className="attached-file">
                                {messageData.attachmentLocation
                                  .substring(
                                    messageData.attachmentLocation.lastIndexOf(
                                      "/"
                                    ) + 1
                                  )
                                  .replace(/^\d+_/, "")}
                              </span>
                              <a
                                href={
                                  filesUrlTalk + messageData.attachmentLocation
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  draggable="false"
                                  src={DownloadIcon}
                                  alt=""
                                />
                              </a>
                            </div>
                          ) : null}
                          <span className="direct-chat-body color-white">
                            <Keywords value={searchChatWord} render={highlight}>
                              {messageData.messageBody}
                            </Keywords>
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="replied-message-receive">
                            <p className="replied-message-receiver m-0">
                              {messageData.frMessages[3]}
                            </p>
                            <p className="replied-message m-0">
                              {messageData.sourceMessageBody}
                            </p>
                          </div>
                          <span className="direct-chat-body color-white">
                            <Keywords value={searchChatWord} render={highlight}>
                              {messageData.messageBody}
                            </Keywords>
                          </span>
                        </>
                      )}
                      <div className="d-flex mt-1 justify-content-end">
                        <div className="star-time-status ml-auto text-end">
                          <span className="starred-status">
                            {messageData.isFlag === 1 ? (
                              <img
                                draggable="false"
                                src={StarredMessageIcon}
                                alt=""
                              />
                            ) : null}
                          </span>
                          <span className="direct-chat-sent-time chat-datetime">
                            {messageData.sentDate.slice(0, 8) ===
                            currentUtcDate ? (
                              <>
                                {newTimeFormaterAsPerUTCTalkTime(
                                  messageData.sentDate
                                )}
                              </>
                            ) : messageData.sentDate.slice(0, 8) ===
                              yesterdayDateUtc ? (
                              <>
                                {newTimeFormaterAsPerUTCTalkDate(
                                  messageData.sentDate
                                ) + " "}
                                | {t("Yesterday")}
                              </>
                            ) : (
                              <>
                                {newTimeFormaterAsPerUTCTalkDate(
                                  messageData.sentDate
                                )}
                              </>
                            )}
                          </span>
                          <div className="message-status"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }
          })
        : null}
      <ChatFooter
        allOtoMessages={allOtoMessages}
        setAllOtoMessages={setAllOtoMessages}
      />
    </>
  );
};

export default OtoMessages;
