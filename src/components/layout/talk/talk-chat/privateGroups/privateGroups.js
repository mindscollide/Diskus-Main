import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from "../../../../../commen/functions/date_formater";
import { ResultMessage, TextField } from "../../../../elements";
import { chatBoxActiveFlag } from "../../../../../store/actions/Talk_Feature_actions";
import {
  GetGroupMessages,
  activeChat,
  mqttGroupCreated,
} from "../../../../../store/actions/Talk_action";
import GroupIcon from "../../../../../assets/images/Group-Icon.png";
import DoubleTickIcon from "../../../../../assets/images/DoubleTick-Icon.png";
import DoubleTickDeliveredIcon from "../../../../../assets/images/DoubleTickDelivered-Icon.png";
import SingleTickIcon from "../../../../../assets/images/SingleTick-Icon.png";
import TimerIcon from "../../../../../assets/images/Timer-Icon.png";
import PrivateGroupIcon from "../../../../../assets/images/Private-Group.png";
import { useTranslation } from "react-i18next";

const PrivateGroups = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  //Current language
  let lang = localStorage.getItem("i18nextLng");

  const { talkStateData, talkFeatureStates } = useSelector((state) => state);

  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");

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

  //Private Messages State
  const [privateGroupsData, setPrivateGroupsData] = useState([]);
  const [searchChatValue, setSearchChatValue] = useState("");

  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      let privateGroupsMessages =
        talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
          (data, index) => data.messageType === "G"
        );
      setPrivateGroupsData(privateGroupsMessages);
    } else {
      setPrivateGroupsData([]);
    }
    return () => {
      setPrivateGroupsData([]);
    };
  }, [talkStateData.AllUserChats.AllUserChatsData]);

  const chatClick = (record) => {
    dispatch(chatBoxActiveFlag(true));
    console.log("chatClick Record", record);
    let chatGroupData = {
      UserID: parseInt(currentUserId),
      ChannelID: currentOrganizationId,
      GroupID: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    };
    dispatch(GetGroupMessages(navigate, chatGroupData, t));
    dispatch(activeChat(record));
  };

  console.log("PrivateGroupsData", privateGroupsData);

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
      setPrivateGroupsData((prev) => [newGroup, ...prev]);
      dispatch(mqttGroupCreated([]));
    }
    return () => {
      setPrivateGroupsData([]);
    };
  }, [talkStateData.talkSocketGroupCreation.groupCreatedData]);

  // to Automatically Remvoe the Group from the user if he has left the private group
  useEffect(() => {
    if (
      talkStateData.MqttGroupLeftData !== undefined &&
      talkStateData.MqttGroupLeftData !== null &&
      talkStateData.MqttGroupLeftData.length !== 0
    ) {
      console.log(talkStateData.MqttGroupLeftData, "MqttGroupLeftData");
      let leaveGroupData = talkStateData.MqttGroupLeftData.data[0];
      const indexToRemove = privateGroupsData.findIndex(
        (item) => item.id === leaveGroupData.groupID
      );
      console.log(leaveGroupData, "MqttGroupLeftData");
      console.log(privateGroupsData, "MqttGroupLeftData");
      // Check if the object was found
      if (indexToRemove !== -1) {
        // Remove the object from allChatData
        privateGroupsData.splice(indexToRemove, 1);
      }
    }
    // dispatch(mqttGroupLeft([]))
  }, [talkStateData.MqttGroupLeftData]);

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
                return (
                  value.fullName.toLowerCase().includes(e.toLowerCase()) &&
                  value.messageType === "G"
                );
              }
            );

          if (filteredData.length === 0) {
            let privateAllMessages =
              talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
                (data, index) => data.messageType === "G"
              );
            setPrivateGroupsData(privateAllMessages);
          } else {
            setPrivateGroupsData(filteredData);
          }
        } else if (e === "" || e === null) {
          let privateAllMessages =
            talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
              (data, index) => data.messageType === "G"
            );
          setPrivateGroupsData(privateAllMessages);
          setSearchChatValue("");
        }
      }
    } catch {}
  };

  console.log("TalkStateData PrivateGroupsData", { talkStateData });

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
      {privateGroupsData !== undefined &&
      privateGroupsData !== null &&
      privateGroupsData.length > 0 ? (
        privateGroupsData.map((dataItem) => {
          return (
            <Row className="single-chat">
              <Col lg={2} md={2} sm={2} className="bottom-border">
                <div className="chat-profile-icon">
                  {dataItem.messageType === "G" ? (
                    <>
                      <img
                        draggable="false"
                        src={GroupIcon}
                        width={35}
                        alt=""
                      />
                    </>
                  ) : null}
                </div>
              </Col>
              <Col lg={10} md={10} sm={10} className="bottom-border">
                <div className={"chat-block"}>
                  <p
                    onClick={() => chatClick(dataItem)}
                    className="chat-username m-0"
                  >
                    {" "}
                    {dataItem.fullName}
                  </p>
                  <p
                    onClick={() => chatClick(dataItem)}
                    className="chat-message m-0"
                  >
                    <span className="chat-tick-icon">
                      {dataItem.senderID === currentUserId &&
                      dataItem.sentDate === "" &&
                      dataItem.receivedDate === "" &&
                      dataItem.seenDate === "" ? (
                        <img
                          draggable="false"
                          src={TimerIcon}
                          className="img-cover"
                          alt=""
                        />
                      ) : dataItem.senderID === currentUserId &&
                        dataItem.sentDate !== "" &&
                        dataItem.receivedDate === "" &&
                        dataItem.seenDate === "" ? (
                        <img
                          draggable="false"
                          src={SingleTickIcon}
                          className="img-cover"
                          alt=""
                        />
                      ) : dataItem.senderID === currentUserId &&
                        dataItem.sentDate !== "" &&
                        dataItem.receivedDate !== "" &&
                        dataItem.seenDate === "" ? (
                        <img
                          draggable="false"
                          src={DoubleTickDeliveredIcon}
                          className="img-cover"
                          alt=""
                        />
                      ) : dataItem.senderID === currentUserId &&
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
                    {dataItem.messageBody}
                  </p>
                  <p
                    onClick={() => chatClick(dataItem)}
                    className="chat-date m-0"
                  >
                    {dataItem.messageDate.slice(0, 8) === currentUtcDate ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkTime(
                          dataItem.messageDate,
                          lang
                        )}
                      </>
                    ) : dataItem.messageDate.slice(0, 8) ===
                      yesterdayDateUtc ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(
                          dataItem.messageDate,
                          lang
                        ) + " "}
                        | {t("Yesterday")}
                      </>
                    ) : (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(
                          dataItem.messageDate,
                          lang
                        )}
                      </>
                    )}
                  </p>
                  {dataItem.notiCount > 0 ? (
                    <span className="new-message-count">
                      {dataItem.notiCount}
                    </span>
                  ) : null}
                </div>
              </Col>
            </Row>
          );
        })
      ) : (
        <ResultMessage
          icon={<img src={PrivateGroupIcon} width={250} alt="" />}
          title={
            "No private groups created. Create a group and chat with multiple friends at once"
          }
          className="emptyRecentChats"
        />
      )}
    </>
  );
};

export default PrivateGroups;
