import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  chatBoxActiveFlag,
  chatMessageSearchFlag,
  saveFlag,
  printFlag,
  emailFlag,
} from "../../../../../../store/actions/Talk_Feature_actions";
import SecurityIconMessasgeBox from "../../../../../../assets/images/SecurityIcon-MessasgeBox.png";
import MenuIcon from "../../../../../../assets/images/Menu-Chat-Icon.png";
import SecurityIcon from "../../../../../../assets/images/Security-Icon.png";
import SearchChatIcon from "../../../../../../assets/images/Search-Chat-Icon.png";
import VideoCallIcon from "../../../../../../assets/images/VideoCall-Icon.png";
import CloseChatIcon from "../../../../../../assets/images/Cross-Chat-Icon.png";
import SingleIcon from "../../../../../../assets/images/Single-Icon.png";
import GroupIcon from "../../../../../../assets/images/Group-Icon.png";
import ShoutIcon from "../../../../../../assets/images/Shout-Icon.png";

const ChatHeader = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { talkStateData, talkFeatureStates } = useSelector((state) => state);

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  //Dropdown state of chat menu (Dot wali)
  const [chatMenuActive, setChatMenuActive] = useState(false);
  const chatMenuRef = useRef(null);

  const closeChat = () => {
    dispatch(chatBoxActiveFlag(false));
  };

  //Managing that state, if show or hide
  const activateChatMenu = () => {
    setChatMenuActive(!chatMenuActive);
  };

  const handleOutsideClick = (event) => {
    if (
      chatMenuRef.current &&
      !chatMenuRef.current.contains(event.target) &&
      chatMenuActive
    ) {
      setChatMenuActive(false);
    }
  };

  // for save chat
  const modalHandlerSave = async (data) => {
    setChatMenuActive(false);
    dispatch(saveFlag(true));
    //
    // setSave(true)
    // setPrint(false)
    // setEmail(false)
    // setDeleteMessage(false)
    // setMessageInfo(false)
    // setShowGroupInfo(false)
  };

  // for print chat
  const modalHandlerPrint = async (e) => {
    setChatMenuActive(false);
    dispatch(printFlag(true));
    // setSave(false)
    // setPrint(true)
    // setEmail(false)
    // setDeleteMessage(false)
    // setMessageInfo(false)
    // setShowGroupInfo(false)
    // setChatMenuActive(false)
  };

  // for email chat
  const modalHandlerEmail = async (e) => {
    setChatMenuActive(false);
    dispatch(emailFlag(true));
    // setSave(false)
    // setPrint(false)
    // setEmail(true)
    // setDeleteMessage(false)
    // setMessageInfo(false)
    // setShowGroupInfo(false)
    // setChatMenuActive(false)
  };

  const leaveGroupHandlerChat = (record) => {
    // let data = {
    //   UserID: parseInt(currentUserId),
    //   GroupID: record.id,
    // }
    // dispatch(LeaveGroup(navigate, data, t))
    // setChatMenuActive(false)
  };

  const modalHandlerGroupInfo = () => {
    // let Data = {
    //   GroupID: activeChat.id,
    //   ChannelID: currentOrganizationId,
    // }
    // dispatch(GetAllPrivateGroupMembers(navigate, Data, t))
    // setShowGroupInfo(true)
    // setMessageInfo(false)
    // setShowGroupEdit(false)
    // setChatMenuActive(false)
  };

  const modalHandlerGroupEdit = () => {
    // let Data = {
    //   GroupID: activeChat.id,
    //   ChannelID: currentOrganizationId,
    // }
    // dispatch(GetAllPrivateGroupMembers(navigate, Data, t))
    // setShowGroupEdit(true)
    // setShowGroupInfo(false)
    // setMessageInfo(false)
    // setChatMenuActive(false)
  };

  const deleteShoutFunction = () => {
    // let Data = {
    //   TalkRequest: {
    //     UserID: parseInt(currentUserId),
    //     ChannelID: parseInt(currentOrganizationId),
    //     Group: {
    //       GroupID: activeChat.id,
    //     },
    //   },
    // }
    // dispatch(DeleteShout(navigate, Data, t))
    // setChatMenuActive(false)
  };

  const editShoutFunction = () => {
    // let Data = {
    //   TalkRequest: {
    //     BroadcastID: activeChat.id,
    //     ChannelID: parseInt(currentOrganizationId),
    //   },
    // }
    // dispatch(GetActiveUsersByBroadcastID(navigate, Data, t))
    // setShowShoutEdit(true)
    // setChatMenuActive(false)
  };

  const showChatSearchHandler = () => {
    if (talkFeatureStates.ChatMessagesSearchFlag === false) {
      dispatch(chatMessageSearchFlag(true));
    } else {
      dispatch(chatMessageSearchFlag(false));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [chatMenuActive]);

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div
            className={
              talkFeatureStates.SaveModalFlag === true ||
              talkFeatureStates.PrintModalFlag === true ||
              talkFeatureStates.EmailModalFlag === true
                ? // || deleteMessage === true
                  "chat-header applyBlur"
                : "chat-header"
            }
            // className="chat-header"
          >
            <Row>
              <Col lg={1} md={1} sm={12}>
                <div className="chat-profile-icon">
                  {talkStateData?.ActiveChatData?.messageType === "O" ? (
                    <img draggable="false" src={SingleIcon} width={25} />
                  ) : talkStateData?.ActiveChatData?.messageType === "G" ? (
                    <img draggable="false" src={GroupIcon} width={30} />
                  ) : talkStateData?.ActiveChatData?.messageType === "B" ? (
                    <img draggable="false" src={ShoutIcon} width={20} />
                  ) : null}
                  {/* <img draggable="false" src={SingleIcon} width={20} /> */}
                  {/* <span className="user-active-status"></span> */}
                </div>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <p className="chat-username chathead">
                  {talkStateData?.ActiveChatData?.fullName}
                </p>
              </Col>
              <Col lg={1} md={1} sm={12}>
                {" "}
                <div className="chat-box-icons">
                  <img draggable="false" src={SecurityIcon} />
                </div>
              </Col>
              <Col lg={1} md={1} sm={12}>
                {" "}
                <div className="chat-box-icons">
                  <img
                    draggable="false"
                    onClick={showChatSearchHandler}
                    src={SearchChatIcon}
                  />
                </div>
              </Col>
              <Col lg={1} md={1} sm={12}>
                {" "}
                <div
                  className="chat-box-icons positionRelative"
                  ref={chatMenuRef}
                >
                  <img
                    draggable="false"
                    src={MenuIcon}
                    onClick={activateChatMenu}
                  />
                  {chatMenuActive && (
                    <div className="dropdown-menus-chat">
                      {talkStateData?.ActiveChatData?.messageType === "O" && (
                        <>
                          <span
                            onClick={() =>
                              modalHandlerSave(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Save")}
                          </span>
                          <span
                            onClick={() =>
                              modalHandlerPrint(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Print")}
                          </span>
                          <span
                            style={{ borderBottom: "none" }}
                            onClick={() =>
                              modalHandlerEmail(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Email")}
                          </span>
                        </>
                      )}
                      {talkStateData?.ActiveChatData?.messageType === "G" && (
                        <>
                          <span
                            onClick={() =>
                              modalHandlerSave(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Save")}
                          </span>
                          <span
                            onClick={() =>
                              modalHandlerPrint(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Print")}
                          </span>
                          <span
                            onClick={() =>
                              modalHandlerEmail(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Email")}
                          </span>
                          <span onClick={modalHandlerGroupInfo}>
                            {t("Group-Info")}
                          </span>
                          <span>{t("Delete-Group")}</span>
                          <span
                            onClick={() =>
                              leaveGroupHandlerChat(
                                talkStateData.ActiveChatData
                              )
                            }
                          >
                            {t("Leave-Group")}
                          </span>
                          <span
                            style={{ borderBottom: "none" }}
                            onClick={modalHandlerGroupEdit}
                          >
                            {t("Edit-Info")}
                          </span>
                        </>
                      )}
                      {talkStateData?.ActiveChatData?.messageType === "B" && (
                        <>
                          <span
                            onClick={() =>
                              modalHandlerSave(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Save")}
                          </span>
                          <span
                            onClick={() =>
                              modalHandlerPrint(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Print")}
                          </span>
                          <span
                            onClick={() =>
                              modalHandlerEmail(talkStateData.ActiveChatData)
                            }
                          >
                            {t("Email")}
                          </span>
                          <span onClick={deleteShoutFunction}>
                            {t("Delete-Shout")}
                          </span>
                          <span onClick={editShoutFunction}>
                            {t("Edit-shout")}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Col>
              {activeCall === false ? (
                <Col lg={1} md={1} sm={12}>
                  <div className="chat-box-icons">
                    <img draggable="false" src={VideoCallIcon} />
                  </div>
                </Col>
              ) : null}
              <Col lg={1} md={1} sm={12}>
                {" "}
                <div className="chat-box-icons" onClick={closeChat}>
                  <img draggable="false" src={CloseChatIcon} />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} className="p-0">
          <div className="encryption-level-chat">
            <Row>
              <Col lg={7} md={7} sm={12}>
                <p className="level-heading">{t("Crypto-Level")}</p>
              </Col>
              <Col lg={5} md={5} sm={12} className="positionRelative">
                <p className="level">{t("NIAP-+-PQC")}</p>
                <span className="securityicon-box">
                  <img
                    draggable="false"
                    src={SecurityIconMessasgeBox}
                    style={{ width: "17px" }}
                  />
                </span>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ChatHeader;
