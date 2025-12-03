import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ResultMessage,
  LoaderPanel,
  TextField,
} from "../../../../elements";
import {
  GetBlockedUsers,
  BlockUnblockUser,
} from "../../../../../store/actions/Talk_action";
import { Spin } from "antd";
import SingleIcon from "../../../../../assets/images/Single-Icon.png";
import BlockedContactsIcon from "../../../../../assets/images/Blocked-Contacts.png";
import { useTranslation } from "react-i18next";

const BlockedUsersList = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { talkFeatureStates, talkStateData } = useSelector((state) => state);

  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");

  //Blocked Users State
  const [blockedUsersData, setBlockedUsersData] = useState([]);
  const [searchChatValue, setSearchChatValue] = useState("");

  //Calling API
  useEffect(() => {
    dispatch(
      GetBlockedUsers(navigate, currentUserId, currentOrganizationId, t)
    );
  }, []);

  const unblockblockContactHandler = (record) => {
    let Data = {
      senderID: currentUserId,
      channelID: currentOrganizationId,
      opponentUserId: record.id,
    };
    dispatch(BlockUnblockUser(navigate, Data, t));
  };

  useEffect(() => {
    if (
      talkStateData.BlockedUsers.BlockedUsersData !== undefined &&
      talkStateData.BlockedUsers.BlockedUsersData !== null &&
      talkStateData.BlockedUsers.BlockedUsersData.length !== 0
    ) {
      setBlockedUsersData(
        talkStateData?.BlockedUsers?.BlockedUsersData?.blockedUsers
      );
    } else {
      setBlockedUsersData([]);
    }
  }, [talkStateData?.BlockedUsers?.BlockedUsersData]);

  //Search Chats
  const searchChat = (e) => {
    setSearchChatValue(e);
    try {
      if (
        talkStateData.BlockedUsers.BlockedUsersData !== undefined &&
        talkStateData.BlockedUsers.BlockedUsersData !== null &&
        talkStateData.BlockedUsers.BlockedUsersData.length !== 0
      ) {
        if (e !== "") {
          let filteredData =
            talkStateData.BlockedUsers.BlockedUsersData.blockedUsers.filter(
              (value) => {
                return value.fullName.toLowerCase().includes(e.toLowerCase());
              }
            );

          if (filteredData.length === 0) {
            setBlockedUsersData(
              talkStateData.BlockedUsers.BlockedUsersData.blockedUsers
            );
          } else {
            setBlockedUsersData(filteredData);
          }
        } else if (e === "" || e === null) {
          let data = talkStateData.BlockedUsers.BlockedUsersData.blockedUsers;
          setSearchChatValue("");
          setBlockedUsersData(data);
        }
      }
    } catch {}
  };

  

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

      const updatedBlockedUsersData = blockedUsersData.filter(
        (user) => user.id !== mqttUnblockedResponse.blockUserID
      );
      setBlockedUsersData(updatedBlockedUsersData);
    }
  }, [talkStateData.talkSocketDataUserBlockUnblock.socketUnblockUser]);

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
      {talkStateData.BlockedUsers.Loading === true &&
      blockedUsersData.length === 0 ? (
        <>
          {/* <Spin className="talk-overallchat-spinner" /> */}
          <LoaderPanel
            message={t("Safeguarding-your-data-to-enhance-the-experience")}
          />
        </>
      ) : talkStateData.BlockedUsers.Loading === false &&
        blockedUsersData !== undefined &&
        blockedUsersData !== null &&
        blockedUsersData.length > 0 ? (
        blockedUsersData.map((dataItem) => {
          return (
            <>
              <Row className="single-chat">
                <Col lg={2} md={2} sm={2} className="bottom-border">
                  <div className="chat-profile-icon">
                    <img draggable="false" src={SingleIcon} width={25} />
                  </div>
                </Col>
                <Col lg={10} md={10} sm={10} className="bottom-border  ">
                  <div className="chat-block blocked-users d-flex align-items-start ">
                    <p className="chat-username blocked-users m-0">
                      {" "}
                      {dataItem.fullName}
                    </p>
                    <Button
                      className="MontserratRegular Unblock-btn"
                      text="Unblock"
                      onClick={() => unblockblockContactHandler(dataItem)}
                    />
                  </div>
                </Col>
              </Row>
            </>
          );
        })
      ) : talkStateData.BlockedUsers.Loading === false &&
        blockedUsersData.length === 0 ? (
        <ResultMessage
          icon={<img src={BlockedContactsIcon} width={250} />}
          title={"Your blocked list is empty"}
          className="emptyRecentChats"
        />
      ) : null}
    </>
  );
};

export default BlockedUsersList;
