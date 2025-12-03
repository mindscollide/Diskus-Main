import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { newTimeFormaterAsPerUTCTalkDate } from "../../../../../commen/functions/date_formater";
import { Spin } from "antd";
import { GetAllStarredMessages } from "../../../../../store/actions/Talk_action";
import SingleIcon from "../../../../../assets/images/Single-Icon.png";
import StarredMessageIcon from "../../../../../assets/images/Starred-Message-Icon.png";
import StarredMessages from "../../../../../assets/images/Starred-Messages.png";
import { ResultMessage, LoaderPanel, TextField } from "../../../../elements";

const StarredMessagesList = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { talkStateData, talkFeatureStates } = useSelector((state) => state);

  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");

  const date = new Date();
  //CURRENT DATE TIME UTC

  //YESTERDAY'S DATE
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1); // Subtract 1 day

  const [allStarredMessagesData, setAllStarredMessagesData] = useState([]);
  const [searchChatValue, setSearchChatValue] = useState("");

  useEffect(() => {
    let data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
      },
    };
    dispatch(GetAllStarredMessages(data, t, navigate));
  }, []);

  useEffect(() => {
    if (
      talkStateData.AllStarMessagesData.AllStarMessagesResponse !== undefined &&
      talkStateData.AllStarMessagesData.AllStarMessagesResponse !== null &&
      talkStateData.AllStarMessagesData.AllStarMessagesResponse.length !== 0
    ) {
      setAllStarredMessagesData(
        talkStateData.AllStarMessagesData.AllStarMessagesResponse.flagMessages
      );
    } else {
      setAllStarredMessagesData([]);
    }
  }, [talkStateData.AllStarMessagesData.AllStarMessagesResponse]);

  //Search Chats
  const searchChat = (e) => {
    setSearchChatValue(e);
    try {
      if (
        talkStateData.AllStarMessagesData.AllStarMessagesResponse !==
          undefined &&
        talkStateData.AllStarMessagesData.AllStarMessagesResponse !== null &&
        talkStateData.AllStarMessagesData.AllStarMessagesResponse.length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.AllStarMessagesData.AllStarMessagesResponse.flagMessages.filter(
              (value) => {
                return value.messageBody
                  .toLowerCase()
                  .includes(e.toLowerCase());
              }
            );

          if (filteredData.length === 0) {
            setAllStarredMessagesData(
              talkStateData.AllStarMessagesData.AllStarMessagesResponse
                .flagMessages
            );
          } else {
            setAllStarredMessagesData(filteredData);
          }
        } else if (e === "" || e === null) {
          let data =
            talkStateData.AllStarMessagesData.AllStarMessagesResponse
              .flagMessages;
          setSearchChatValue("");
          setAllStarredMessagesData(data);
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== null &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage !== undefined &&
      talkStateData.talkSocketDataStarUnstar.socketStarMessage.length !== 0
    ) {
      const starredMessage =
        talkStateData.talkSocketDataStarUnstar.socketStarMessage;
      if (starredMessage.messageType === "O") {
        let allMessages = talkStateData.AllMessagesData.oneToOneMessages;
        const matchingMessages = allMessages.filter(
          (message) => message.messageID === starredMessage.messageID
        );

        const messagesWithSameMessageID = matchingMessages;

        let updatedStarredMessage = {
          messageID: messagesWithSameMessageID[0].messageID,
          senderID: messagesWithSameMessageID[0].senderID,
          receiverID: messagesWithSameMessageID[0].receiverID,
          messageBody: messagesWithSameMessageID[0].messageBody,
          senderName: messagesWithSameMessageID[0].senderName,
          receiverName: messagesWithSameMessageID[0].receiverName,
          isFlag: messagesWithSameMessageID[0].isFlag,
          sentDate: messagesWithSameMessageID[0].sentDate,
          receivedDate: messagesWithSameMessageID[0].receivedDate,
          seenDate: messagesWithSameMessageID[0].seenDate,
          currDate: messagesWithSameMessageID[0].currDate,
          fileGeneratedName: messagesWithSameMessageID[0].fileGeneratedName,
          fileName: messagesWithSameMessageID[0].fileName,
          attachmentLocation: messagesWithSameMessageID[0].attachmentLocation,
          messageType: messagesWithSameMessageID[0].messageType,
        };

        const updatedData = [updatedStarredMessage, ...allStarredMessagesData];
        setAllStarredMessagesData(updatedData);
      } else if (starredMessage.messageType === "G") {
        let allMessages = talkStateData.AllMessagesData.groupMessages;
        const matchingMessages = allMessages.filter(
          (message) => message.messageID === starredMessage.messageID
        );

        const messagesWithSameMessageID = matchingMessages;

        let updatedStarredMessage = {
          messageID: messagesWithSameMessageID[0].messageID,
          senderID: messagesWithSameMessageID[0].senderID,
          receiverID: messagesWithSameMessageID[0].receiverID,
          messageBody: messagesWithSameMessageID[0].messageBody,
          senderName: messagesWithSameMessageID[0].senderName,
          receiverName: messagesWithSameMessageID[0].receiverName,
          isFlag: messagesWithSameMessageID[0].isFlag,
          sentDate: messagesWithSameMessageID[0].sentDate,
          receivedDate: messagesWithSameMessageID[0].receivedDate,
          seenDate: messagesWithSameMessageID[0].seenDate,
          currDate: messagesWithSameMessageID[0].currDate,
          fileGeneratedName: messagesWithSameMessageID[0].fileGeneratedName,
          fileName: messagesWithSameMessageID[0].fileName,
          attachmentLocation: messagesWithSameMessageID[0].attachmentLocation,
          messageType: messagesWithSameMessageID[0].messageType,
        };

        const updatedData = [updatedStarredMessage, ...allStarredMessagesData];
        setAllStarredMessagesData(updatedData);
      }
    }
  }, [talkStateData.talkSocketDataStarUnstar.socketStarMessage]);

  useEffect(() => {
    if (
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage !== null &&
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage !==
        undefined &&
      talkStateData.talkSocketDataStarUnstar.socketUnstarMessage.length !== 0
    ) {
      let unstarredMessage =
        talkStateData.talkSocketDataStarUnstar.socketUnstarMessage;
      const updatedData = allStarredMessagesData.filter(
        (message) => message.messageID !== unstarredMessage.messageID
      );
      setAllStarredMessagesData(updatedData);
    }
  }, [talkStateData.talkSocketDataStarUnstar.socketUnstarMessage]);

  

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
      {talkStateData.AllStarMessagesData.Loading === true &&
      allStarredMessagesData.length === 0 ? (
        <>
          {/* <Spin className="talk-overallchat-spinner" /> */}
          <LoaderPanel
            message={t("Safeguarding-your-data-to-enhance-the-experience")}
          />
        </>
      ) : talkStateData.AllStarMessagesData.Loading === false &&
        allStarredMessagesData !== undefined &&
        allStarredMessagesData !== null &&
        allStarredMessagesData.length > 0 ? (
        allStarredMessagesData.map((dataItem, index) => {
          return (
            <>
              <Row className="single-chat">
                <Col sm={2} md={2} lg={2}>
                  <div className="chat-profile-icon ">
                    <img draggable="false" src={SingleIcon} width={25} />
                  </div>
                </Col>
                <Col sm={10} md={10} lg={10}>
                  <div className="chat-block">
                    <p className="chat-username starred-message m-0">
                      {dataItem.senderName}
                    </p>
                    <div
                      className={
                        dataItem.senderID === parseInt(currentUserId)
                          ? "sender-message-star"
                          : "reply-message"
                      }
                    >
                      <p className="m-0">{dataItem.messageBody}</p>
                      <div className="starred-icon-date">
                        <span>
                          <img
                            draggable="false"
                            src={StarredMessageIcon}
                            alt=""
                          />
                        </span>
                        <p className="m-0">
                          {" "}
                          {dataItem.sentDate !== ""
                            ? newTimeFormaterAsPerUTCTalkDate(dataItem.sentDate)
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          );
        })
      ) : talkStateData.AllStarMessagesData.Loading === false &&
        allStarredMessagesData.length === 0 ? (
        <ResultMessage
          icon={<img src={StarredMessages} width={250} />}
          title={
            "You haven't starred any messages yet. Mark important messages for quick access"
          }
          className="emptyRecentChats"
        />
      ) : null}
    </>
  );
};

export default StarredMessagesList;
