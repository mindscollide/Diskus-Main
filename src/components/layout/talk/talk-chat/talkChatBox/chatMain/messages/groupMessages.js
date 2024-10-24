import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Keywords from "react-keywords";
import { Row, Col } from "react-bootstrap";
import { TextField } from "../../../../../../elements";
import { Checkbox } from "antd";
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from "../../../../../../../commen/functions/date_formater";
import { groupMessages } from "../../../functions/oneToOneMessage";
import { filesUrlTalk } from "../../../../../../../commen/apis/Api_ends_points";
import DropDownIcon from "../../../../../../../assets/images/dropdown-icon.png";
import DocumentIcon from "../../../../../../../assets/images/Document-Icon.png";
import DownloadIcon from "../../../../../../../assets/images/Download-Icon.png";
import StarredMessageIcon from "../../../../../../../assets/images/Starred-Message-Icon.png";
import DoubleTickIcon from "../../../../../../../assets/images/DoubleTick-Icon.png";
import DoubleTickDeliveredIcon from "../../../../../../../assets/images/DoubleTickDelivered-Icon.png";
import SingleTickIcon from "../../../../../../../assets/images/SingleTick-Icon.png";
import TimerIcon from "../../../../../../../assets/images/Timer-Icon.png";
import DropDownChatIcon from "../../../../../../../assets/images/dropdown-icon-chatmessage.png";

const GroupMessages = () => {
  //Chat Message Feature
  const chatMessageRefs = useRef();

  const { talkStateData, talkFeatureStates } = useSelector((state) => state);

  //Current User ID
  let currentUserId = localStorage.getItem("userID");

  const [searchChatWord, setSearchChatWord] = useState("");

  //Enable Chat Feature Options
  const [chatFeatureActive, setChatFeatureActive] = useState(false);

  //all oto messages
  const [allGroupMessages, setAllGroupMessages] = useState([]);

  const [showCheckboxes, setShowCheckboxes] = useState(false);

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

  const highlight = (txt) => (
    <span style={{ background: "red", color: "#fff" }}>{txt}</span>
  );

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

  useEffect(() => {
    let allGroupMessagesReducer =
      talkStateData.GroupMessages.GroupMessagesData.groupMessages;
    if (allGroupMessagesReducer !== undefined) {
      groupMessages(allGroupMessagesReducer, setAllGroupMessages);
    }
  }, [talkStateData.GroupMessages.GroupMessagesData]);

  return allGroupMessages.map((messageData, index) => {
    var ext = messageData.attachmentLocation.split(".").pop();
    if (messageData.senderID === parseInt(currentUserId)) {
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
                      placeholder={t("Search-Chat")}
                      labelclass={"d-none"}
                    />
                  </Col>
                </Row>
              </div>
            </>
          ) : null}
          <div className="direct-chat-msg text-right mb-2 ">
            <div className="direct-chat-text message-outbox message-box text-start">
              <p className="group-sender-name">{messageData.senderName}</p>
              <div
                className="chatmessage-box-icons"
                onClick={() =>
                  chatFeatureSelected(messageData, messageData.messageID)
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
                    <span onClick={() => replyFeatureHandler(messageData)}>
                      {t("Reply")}
                    </span>
                    <span onClick={forwardFeatureHandler}>Forward</span>
                    <span onClick={() => deleteFeatureHandler(messageData)}>
                      {t("Delete")}
                    </span>
                    <span onClick={() => messageInfoHandler(messageData)}>
                      {t("Message-Info")}
                    </span>
                    <span
                      onClick={() => markUnmarkStarMessageHandler(messageData)}
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
                        href={filesUrlTalk + messageData.attachmentLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          draggable="false"
                          src={filesUrlTalk + messageData.attachmentLocation}
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
                      <img draggable="false" src={DocumentIcon} alt="" />
                      <span className="attached-file">
                        {messageData.attachmentLocation
                          .substring(
                            messageData.attachmentLocation.lastIndexOf("/") + 1
                          )
                          .replace(/^\d+_/, "")}
                      </span>
                      <a
                        href={filesUrlTalk + messageData.attachmentLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img draggable="false" src={DownloadIcon} alt="" />
                      </a>
                    </div>
                  ) : null}
                  <span className="direct-chat-body color-5a5a5a">
                    <Keywords value={searchChatWord} render={highlight}>
                      {messageData.messageBody}
                    </Keywords>
                  </span>
                </>
              ) : (
                <>
                  <div className="replied-message-send">
                    <p className="replied-message-sender m-0">
                      {messageData.frMessages[3]}
                    </p>
                    <p className="replied-message m-0">
                      {messageData.sourceMessageBody}
                    </p>
                  </div>
                  <span className="direct-chat-body color-5a5a5a">
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
                      <img draggable="false" src={StarredMessageIcon} alt="" />
                    ) : null}
                  </span>
                  <span className="direct-chat-sent-time chat-datetime">
                    {messageData.sentDate.slice(0, 8) === currentUtcDate ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkTime(messageData.sentDate)}
                      </>
                    ) : messageData.sentDate.slice(0, 8) ===
                      yesterdayDateUtc ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(messageData.sentDate) +
                          " "}
                        | {t("Yesterday")}
                      </>
                    ) : (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(messageData.sentDate)}
                      </>
                    )}
                  </span>
                  <div className="message-status">
                    {messageData.messageStatus === "Sent" ? (
                      <img draggable="false" src={SingleTickIcon} alt="" />
                    ) : messageData.messageStatus === "Delivered" ? (
                      <img
                        draggable="false"
                        src={DoubleTickDeliveredIcon}
                        alt=""
                      />
                    ) : messageData.messageStatus === "Seen" ? (
                      <img draggable="false" src={DoubleTickIcon} alt="" />
                    ) : messageData.messageStatus === "Undelivered" ? (
                      <img draggable="false" src={TimerIcon} alt="" />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {showCheckboxes === true ? (
              <Checkbox
                checked={messagesChecked.includes(messageData) ? true : false}
                onChange={() => messagesCheckedHandler(messageData, index)}
                className="chat-message-checkbox-receiver"
              />
            ) : null}
          </div>
        </>
      );
    } else {
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
                      placeholder={t("Search Chat")}
                      labelclass={"d-none"}
                    />
                  </Col>
                </Row>
              </div>
            </>
          ) : null}
          <div className="direct-chat-msg text-left mb-2 ">
            {showCheckboxes === true ? (
              <Checkbox
                checked={messagesChecked.includes(messageData) ? true : false}
                onChange={() => messagesCheckedHandler(messageData, index)}
                className="chat-message-checkbox-sender"
              />
            ) : null}

            <div className="direct-chat-text message-inbox message-box text-start">
              <div
                className="chatmessage-box-icons"
                onClick={() =>
                  chatFeatureSelected(messageData, messageData.messageID)
                }
                ref={chatMessageRefs}
              >
                <img
                  draggable="false"
                  className="dropdown-icon"
                  src={DropDownChatIcon}
                />
                {chatFeatureActive === messageData.messageID ? (
                  <div className="dropdown-menus-chatmessage">
                    <span onClick={() => replyFeatureHandler(messageData)}>
                      {t("Reply")}
                    </span>
                    <span onClick={forwardFeatureHandler}>Forward</span>
                    <span onClick={() => deleteFeatureHandler(messageData)}>
                      {t("Delete")}
                    </span>
                    <span onClick={() => messageInfoHandler(messageData)}>
                      {t("Message-Info")}
                    </span>
                    <span
                      onClick={() => markUnmarkStarMessageHandler(messageData)}
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
                  <p className="group-sender-name">{messageData.senderName}</p>
                  <span className="direct-chat-body color-white">
                    <Keywords value={searchChatWord} render={highlight}>
                      {messageData.messageBody}
                    </Keywords>
                  </span>
                </>
              ) : (
                <>
                  <p className="group-sender-name">{messageData.senderName}</p>
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
                      <img draggable="false" src={StarredMessageIcon} alt="" />
                    ) : null}
                  </span>
                  <span className="direct-chat-sent-time chat-datetime">
                    {messageData.sentDate.slice(0, 8) === currentUtcDate ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkTime(messageData.sentDate)}
                      </>
                    ) : messageData.sentDate.slice(0, 8) ===
                      yesterdayDateUtc ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(messageData.sentDate) +
                          " "}
                        | {t("Yesterday")}
                      </>
                    ) : (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(messageData.sentDate)}
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
  });
};

export default GroupMessages;
