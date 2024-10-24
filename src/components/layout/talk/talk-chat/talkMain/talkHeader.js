import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Container } from "react-bootstrap";
import SecurityEncryption from "./securityEncryption";
import { Select } from "antd";
import SearchIcon from "../../../../../assets/images/Search-Icon.png";
import SecurityIcon from "../../../../../assets/images/Security-Icon.png";
import {
  recentChatFlag,
  privateChatFlag,
  privateGroupChatFlag,
  starredMessageFlag,
  blockedUsersFlag,
  shoutallChatFlag,
  footerShowHideStatus,
  securityEncryptionStatus,
  globalChatsSearchFlag,
} from "../../../../../store/actions/Talk_Feature_actions";

const TalkHeader = () => {
  const { talkFeatureStates } = useSelector((state) => state);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //Translation
  const { t } = useTranslation();

  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");

  // Chat Filter Options
  const chatFilterOptions = [
    { className: "talk-chat-filter", label: t("Recent-Chats"), value: 1 },
    { className: "talk-chat-filter", label: t("Private-Message"), value: 2 },
    { className: "talk-chat-filter", label: t("Private-Group"), value: 3 },
    { className: "talk-chat-filter", label: t("Starred-Message"), value: 4 },
    { className: "talk-chat-filter", label: t("Shout-All"), value: 5 },
    { className: "talk-chat-filter", label: t("Blocked-User"), value: 6 },
  ];

  //Chat Filter State
  const [chatFilter, setChatFilter] = useState({
    value: 1,
    label: t("Recent-Chats"),
  });

  // for   select Chat Filter Name
  const [chatFilterName, setChatFilterName] = useState(t("Recent-Chats"));

  useEffect(() => {
    if (talkFeatureStates.RecentChatsFlag) {
      setChatFilter({
        label: t("Recent-Chats"),
        value: 1,
      });
      setChatFilterName(t("Recent-Chats"));
    } else if (talkFeatureStates.PrivateChatsFlag) {
      setChatFilter({
        label: t("Private-Message"),
        value: 2,
      });
      setChatFilterName(t("Private-Message"));
    } else if (talkFeatureStates.PrivateGroupChatsFlag) {
      setChatFilter({
        label: t("Private-Group"),
        value: 3,
      });
      setChatFilterName(t("Private-Group"));
    } else if (talkFeatureStates.StarredMessageFlag) {
      setChatFilter({
        label: t("Starred-Message"),
        value: 4,
      });
      setChatFilterName(t("Starred-Message"));
    } else if (talkFeatureStates.BlockedUsersFlag) {
      setChatFilter({
        label: t("Blocked-User"),
        value: 6,
      });
      setChatFilterName(t("Blocked-User"));
    } else if (talkFeatureStates.ShoutAllMessageFlag) {
      setChatFilter({
        label: t("Shout-All"),
        value: 5,
      });
      setChatFilterName(t("Shout-All"));
    }
  }, [talkFeatureStates]);

  // Onchange Select Filter
  const chatFilterHandler = (e, value) => {
    if (value.label != undefined) {
      // try {

      if (value.label != chatFilter.label) {
        if (Object.keys(chatFilterOptions).length > 0) {
          chatFilterOptions.filter((data, index) => {
            if (data.label === value.label) {
              setChatFilter({
                label: data.label,
                value: data.value,
              });
            }
          });
        }
        setChatFilterName(value.label);
      } else {
      }
      try {
        if (value.label !== chatFilter.label) {
          if (value.label === t("Recent-Chats")) {
            dispatch(privateChatFlag(false));
            dispatch(privateGroupChatFlag(false));
            dispatch(starredMessageFlag(false));
            dispatch(blockedUsersFlag(false));
            dispatch(shoutallChatFlag(false));
            dispatch(footerShowHideStatus(true));
            dispatch(recentChatFlag(true));
            // dispatch(
            //   GetAllUserChats(
            //     navigate,
            //     currentUserId,
            //     currentOrganizationId,
            //     t,
            //   ),
            // )
          } else if (value.label === t("Private-Message")) {
            dispatch(recentChatFlag(false));
            dispatch(privateGroupChatFlag(false));
            dispatch(starredMessageFlag(false));
            dispatch(blockedUsersFlag(false));
            dispatch(shoutallChatFlag(false));
            dispatch(footerShowHideStatus(true));
            dispatch(privateChatFlag(true));
          } else if (value.label === t("Private-Group")) {
            dispatch(recentChatFlag(false));
            dispatch(privateChatFlag(false));
            dispatch(starredMessageFlag(false));
            dispatch(blockedUsersFlag(false));
            dispatch(shoutallChatFlag(false));
            dispatch(privateGroupChatFlag(true));
            dispatch(footerShowHideStatus(true));
          } else if (value.label === t("Starred-Message")) {
            dispatch(recentChatFlag(false));
            dispatch(privateChatFlag(false));
            dispatch(privateGroupChatFlag(false));
            dispatch(blockedUsersFlag(false));
            dispatch(shoutallChatFlag(false));
            dispatch(footerShowHideStatus(false));
            dispatch(starredMessageFlag(true));
          } else if (value.label === t("Shout-All")) {
            dispatch(recentChatFlag(false));
            dispatch(privateChatFlag(false));
            dispatch(privateGroupChatFlag(false));
            dispatch(starredMessageFlag(false));
            dispatch(blockedUsersFlag(false));
            dispatch(shoutallChatFlag(true));
            dispatch(footerShowHideStatus(true));
          } else if (value.label === t("Blocked-User")) {
            dispatch(recentChatFlag(false));
            dispatch(privateChatFlag(false));
            dispatch(privateGroupChatFlag(false));
            dispatch(starredMessageFlag(false));
            dispatch(shoutallChatFlag(false));
            dispatch(footerShowHideStatus(false));
            dispatch(blockedUsersFlag(true));
          } else {
          }
        } else {
        }
      } catch {}
    }
  };

  const securityDialogue = () => {
    dispatch(securityEncryptionStatus(!talkFeatureStates.SecurityEncryption));
  };

  const activateGlobalSearch = () => {
    if (talkFeatureStates.GlobalChatsSearchFlag === false) {
      dispatch(globalChatsSearchFlag(true));
    } else {
      dispatch(globalChatsSearchFlag(false));
    }
  };

  return (
    <>
      {/* <Row className={deleteChat === false ? '' : 'applyBlur'}> */}
      <Container className="p-0">
        <Row>
          <Col lg={3} md={3} sm={12}>
            <Select
              options={chatFilterOptions}
              onChange={chatFilterHandler}
              className="chatFilter"
              popupClassName="talk-chat-filter"
              value={chatFilterName}
            />
          </Col>
          <Col lg={6} md={6} sm={12}></Col>
          <Col lg={1} md={1} sm={12} className="p-0"></Col>
          <Col lg={1} md={1} sm={12} className="p-0">
            <div className="chat-icons">
              <span style={{ cursor: "pointer" }} onClick={securityDialogue}>
                <img
                  draggable="false"
                  src={SecurityIcon}
                  className="img-cover"
                />
              </span>
            </div>
          </Col>
          <Col lg={1} md={1} sm={12} className="p-0">
            <div className="chat-icons" onClick={activateGlobalSearch}>
              <img draggable="false" src={SearchIcon} className="img-cover" />
            </div>
          </Col>
          {/* <Col lg={1} md={1} sm={12} className="p-0">
            <div className="chat-icons">
              <img
                draggable="false"
                src={FullScreenIcon}
                className="img-cover"
              />
            </div>
          </Col> */}
        </Row>
        {talkFeatureStates.SecurityEncryption === true ? (
          <SecurityEncryption />
        ) : null}
      </Container>
    </>
  );
};

export default TalkHeader;
