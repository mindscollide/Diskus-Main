import React, { useState, useEffect, useRef } from "react";
import "./Talk.css";
import { Triangle } from "react-bootstrap-icons";
import {
  GetAllUsers,
  GetAllUsersGroupsRoomsList,
  getAllUserChatsSuccess,
  GetAllUserChats,
} from "../../../store/actions/Talk_action";
import {
  recentChatFlag,
  headerShowHideStatus,
  footerShowHideStatus,
  createShoutAllScreen,
  addNewChatScreen,
  footerActionStatus,
  createGroupScreen,
  chatBoxActiveFlag,
  activeChatBoxGS,
  globalChatsSearchFlag,
  privateGroupChatFlag,
  privateChatFlag,
} from "../../../store/actions/Talk_Feature_actions";
import {
  participantPopup,
  videoChatPanel,
  recentVideoFlag,
  contactVideoFlag,
  videoChatSearchFlag,
} from "../../../store/actions/VideoFeature_actions";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import TalkChat from "./talk-chat/Talk-Chat";
import TalkNew from "./talk-chat/Talk-New";
import TalkVideo from "./talk-Video/TalkVideo";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ModalAddNote from "../../../container/modalAddNote/ModalAddNote";
import { openAddNotesModal } from "../../../store/actions/Notes_actions";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";

const Talk = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NotesReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const [notesModal, setNotesModal] = useState(false);
  //Getting api result from the reducer
  const {
    talkStateData,
    videoFeatureReducer,
    VideoMainReducer,
    talkFeatureStates,
  } = useSelector((state) => state);

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  //Current User ID
  let currentUserId = localStorage.getItem("userID");

  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");

  // for sub menus Icons
  const [subIcons, setSubIcons] = useState(true);
  // const [activeChatBox, setActiveChatBox] = useState(false);

  //for video menu
  const [videoIcon, setVideoIcon] = useState(false);
  const [activeVideoIcon, setActiveVideoIcon] = useState(false);

  // for video Icon Click
  const videoIconClick = () => {
    if (videoFeatureReducer.VideoChatPanel === false) {
      dispatch(videoChatPanel(true));
      dispatch(contactVideoFlag(true));
      dispatch(recentVideoFlag(false));
      setActiveVideoIcon(true);
      dispatch(activeChatBoxGS(false));
      dispatch(globalChatsSearchFlag(false));
      dispatch(videoChatSearchFlag(false));
    } else {
      dispatch(videoChatPanel(false));
      setActiveVideoIcon(false);
      dispatch(activeChatBoxGS(false));
      dispatch(contactVideoFlag(false));
      dispatch(recentVideoFlag(false));
      dispatch(globalChatsSearchFlag(false));
      dispatch(videoChatSearchFlag(false));
    }
  };

  const showsubTalkIcons = () => {
    // setSubIcons(!subIcons)
    dispatch(activeChatBoxGS(false));
    setActiveVideoIcon(false);
    dispatch(globalChatsSearchFlag(false));
    dispatch(videoChatPanel(false));
  };

  //function for opening add notes modal

  const handleOpenAddNotesModal = () => {
    setNotesModal(true);
    // dispatch(openAddNotesModal(true));
  };

  let currentLang = localStorage.getItem("i18nextLng");

  const iconClick = () => {
    if (talkFeatureStates.ActiveChatBoxGS === false) {
      dispatch(createShoutAllScreen(false));
      dispatch(addNewChatScreen(false));
      dispatch(footerActionStatus(false));
      dispatch(createGroupScreen(false));
      dispatch(chatBoxActiveFlag(false));
      dispatch(recentChatFlag(true));
      dispatch(
        GetAllUsers(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      dispatch(
        GetAllUsersGroupsRoomsList(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      // dispatch(
      //   GetAllUserChats(
      //     navigate,
      //     parseInt(currentUserId),
      //     parseInt(currentOrganizationId),
      //     t
      //   )
      // );
      dispatch(headerShowHideStatus(true));
      dispatch(footerShowHideStatus(true));
      dispatch(activeChatBoxGS(true));
      dispatch(globalChatsSearchFlag(false));
    } else {
      dispatch(videoChatPanel(false));
      setActiveVideoIcon(false);
      dispatch(activeChatBoxGS(false));
      dispatch(contactVideoFlag(false));
      dispatch(recentVideoFlag(false));
      dispatch(privateGroupChatFlag(false));
      dispatch(privateChatFlag(false));
      dispatch(videoChatSearchFlag(false));
      dispatch(globalChatsSearchFlag(false));
      // dispatch(getAllUserChatsSuccess([], ""));
    }
  };

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const [missedCallCount, setMissedCallCount] = useState(0);

  //Setting state data of global response all chat to chatdata
  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setUnreadMessageCount(
        talkStateData?.AllUserChats?.AllUserChatsData?.unreadMessageCount[0]
          ?.totalCount
      );
    }
  }, [talkStateData?.AllUserChats?.AllUserChatsData?.unreadMessageCount]);

  //MQTT Unread Message Count
  useEffect(() => {
    if (
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !==
        undefined &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !== null &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData.length !== 0
    ) {
      let mqttUnreadMessageCount =
        talkStateData.talkSocketUnreadMessageCount.unreadMessageData;
      if (Object.keys(mqttUnreadMessageCount) !== null) {
        setUnreadMessageCount(mqttUnreadMessageCount.data[0].totalCount);
      } else {
        setUnreadMessageCount(
          talkStateData?.AllUserChats?.AllUserChatsData?.unreadMessageCount[0]
            ?.totalCount
        );
      }
    }
  }, [
    talkStateData.talkSocketUnreadMessageCount.unreadMessageData,
    talkStateData?.AllUserChats?.AllUserChatsData?.unreadMessageCount,
  ]);

  //Setting state data of global response all chat to chatdata
  useEffect(() => {
    if (
      VideoMainReducer.MissedCallCountData !== undefined &&
      VideoMainReducer.MissedCallCountData !== null &&
      Object.keys(VideoMainReducer.MissedCallCountData).length !== 0
    ) {
      setMissedCallCount(
        VideoMainReducer?.MissedCallCountData?.missedCallCount
      );
    }
  }, [VideoMainReducer?.MissedCallCountData?.missedCallCount]);

  //MQTT Unread Message Count
  useEffect(() => {
    if (
      VideoMainReducer.MissedCallCountMqttData !== undefined &&
      VideoMainReducer.MissedCallCountMqttData !== null &&
      Object.keys(VideoMainReducer.MissedCallCountMqttData).length !== 0
    ) {
      let missedCallCountMqtt =
        VideoMainReducer.MissedCallCountMqttData.missedCallCount;
      if (Object.keys(missedCallCountMqtt) !== null) {
        setMissedCallCount(missedCallCountMqtt);
      } else {
        setMissedCallCount(
          VideoMainReducer.MissedCallCountData.missedCallCount
        );
      }
    }
  }, [VideoMainReducer.MissedCallCountMqttData.missedCallCount]);

  let totalValue = Number(missedCallCount) + Number(unreadMessageCount);

  useEffect(() => {
    if (videoFeatureReducer.VideoChatPanel === false) {
      setActiveVideoIcon(false);
    } else {
      setActiveVideoIcon(true);
    }
  }, [videoFeatureReducer.VideoChatPanel]);

  const videoPanelRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (
      videoPanelRef.current &&
      !videoPanelRef.current.contains(event.target) &&
      activeVideoIcon
    ) {
      setActiveVideoIcon(false);
      dispatch(videoChatPanel(false));
      // dispatch(participantPopup(false))
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [activeVideoIcon]);

  useEffect(() => {
    if (activeCall === true) {
      dispatch(activeChatBoxGS(false));
    }
  }, [activeCall]);

  // useEffect(() => {
  //   if (talkFeatureStates.ActiveChatBoxGS === true) {
  //     setSubIcons(true)
  //   }
  // }, [talkFeatureStates.ActiveChatBoxGS])

  return (
    <>
      <div ref={videoPanelRef} className={"talk_nav" + " " + currentLang}>
        {talkFeatureStates.ActiveChatBoxGS === true ? (
          <TalkNew />
        ) : activeVideoIcon === true ? (
          <TalkVideo />
        ) : null}

        <div className={subIcons ? "talk-nav-icons" : "border-0"}>
          <Tooltip placement="leftTop" title={t("Add-a-note")}>
            <div
              className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}
              onClick={handleOpenAddNotesModal}
            >
              <svg
                id="Group_2034"
                data-name="Group 2034"
                xmlns="http://www.w3.org/2000/svg"
                width="30.237"
                height="39.841"
                viewBox="0 0 35.237 39.841"
              >
                <defs>
                  <linearGradient
                    id="linear-gradient"
                    x1="0.5"
                    x2="0.5"
                    y2="1"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0" stopColor="#4adede" />
                    <stop offset="1" stopColor="#6172d6" />
                  </linearGradient>
                </defs>
                <path
                  id="Path_626"
                  data-name="Path 626"
                  d="M-2698.652-1265.7"
                  transform="translate(2704.536 1299.632)"
                  stroke="#000"
                  strokeMiterlimit="10"
                  strokeWidth="44"
                  fill="url(#linear-gradient)"
                />
                <path
                  id="Path_627"
                  data-name="Path 627"
                  d="M-2768.777-1804.2v-2.6a3.285,3.285,0,0,0,3.282-3.281v-23.469a3.285,3.285,0,0,0-3.282-3.281h-23.469a3.285,3.285,0,0,0-3.281,3.281v23.469a3.285,3.285,0,0,0,3.281,3.281v2.6a5.891,5.891,0,0,1-5.884-5.884v-23.469a5.891,5.891,0,0,1,5.884-5.884h23.469a5.891,5.891,0,0,1,5.884,5.884v23.469A5.891,5.891,0,0,1-2768.777-1804.2Z"
                  transform="translate(2798.13 1839.435)"
                  fill="url(#linear-gradient)"
                />
                <path
                  id="Path_628"
                  data-name="Path 628"
                  d="M-2696.09-1353.713h-19.288a3.277,3.277,0,0,1-3.274-3.274v-5.262a3.277,3.277,0,0,1,3.274-3.274h19.288a3.277,3.277,0,0,1,3.273,3.274v5.262A3.277,3.277,0,0,1-2696.09-1353.713Zm-19.288-9.443a.909.909,0,0,0-.908.908v5.262a.909.909,0,0,0,.908.907h19.288a.909.909,0,0,0,.908-.907v-5.262a.909.909,0,0,0-.908-.908Z"
                  transform="translate(2723.353 1393.553)"
                  fill="url(#linear-gradient)"
                />
                <rect
                  id="Rectangle_830"
                  data-name="Rectangle 830"
                  width="22.914"
                  height="2.366"
                  rx="1.183"
                  transform="translate(5.884 8.173)"
                  fill="url(#linear-gradient)"
                />
                <rect
                  id="Rectangle_831"
                  data-name="Rectangle 831"
                  width="13.401"
                  height="2.366"
                  rx="1.183"
                  transform="translate(5.884 13.728)"
                  fill="url(#linear-gradient)"
                />
                <rect
                  id="Rectangle_832"
                  data-name="Rectangle 832"
                  width="9.027"
                  height="2.366"
                  rx="1.183"
                  transform="translate(5.884 19.977)"
                  fill="url(#linear-gradient)"
                />
              </svg>
            </div>
          </Tooltip>
          {checkFeatureIDAvailability(4) ? (
            <Tooltip placement="leftTop" title={t("Video-call")}>
              <div
                className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}
                onClick={videoIconClick}
              >
                {/* <span className="talk-count"></span> */}
                <span className={missedCallCount === 0 ? "" : "talk-count"}>
                  {missedCallCount === 0 ? "" : missedCallCount}
                </span>
                <svg
                  id="Icon_feather-video"
                  data-name="Icon feather-video"
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="29.4"
                  viewBox="0 0 44.65 29.4"
                >
                  <defs>
                    <linearGradient
                      id="linear-gradient"
                      x1="0.5"
                      x2="0.5"
                      y2="1"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0" stopColor="#4adede" />
                      <stop offset="1" stopColor="#6172d6" />
                    </linearGradient>
                  </defs>
                  <path
                    id="Union_4"
                    data-name="Union 4"
                    d="M5.171,29.4A5.176,5.176,0,0,1,0,24.23V5.169A5.175,5.175,0,0,1,5.171,0H26.136a5.175,5.175,0,0,1,5.171,5.169v6.891l11.2-8a1.357,1.357,0,0,1,2.147,1.1V24.23a1.359,1.359,0,0,1-2.147,1.1l-11.2-8V24.23A5.176,5.176,0,0,1,26.136,29.4ZM2.716,5.169V24.23a2.458,2.458,0,0,0,2.456,2.454H26.136a2.457,2.457,0,0,0,2.456-2.454V5.169a2.456,2.456,0,0,0-2.456-2.454H5.171A2.457,2.457,0,0,0,2.716,5.169ZM32.285,14.7l9.649,6.892V7.808Z"
                    fill="url(#linear-gradient)"
                  />
                </svg>
              </div>
            </Tooltip>
          ) : null}

          <Tooltip placement="leftTop" title={t("Chat")}>
            <div
              className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}
              onClick={iconClick}
            >
              <span className={unreadMessageCount === 0 ? "" : "talk-count"}>
                {unreadMessageCount === 0 ? "" : unreadMessageCount}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="36.444"
                viewBox="0 0 45.792 36.444"
              >
                <defs>
                  <linearGradient
                    id="linear-gradient"
                    x1="0.5"
                    x2="0.5"
                    y2="1"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0" stopColor="#4adede" />
                    <stop offset="1" stopColor="#6172d6" />
                  </linearGradient>
                </defs>
                <path
                  id="Union_5"
                  data-name="Union 5"
                  d="M43.57,36.263c-2.42-.734-4.843-1.464-7.258-2.213a1.106,1.106,0,0,0-.883.082,17.929,17.929,0,0,1-14.44.752,1.055,1.055,0,0,0-.7.018,14.376,14.376,0,0,1-11.919-.271,1.234,1.234,0,0,0-.791-.06c-1.916.555-3.82,1.148-5.731,1.717a1.349,1.349,0,0,1-1.825-1,2.072,2.072,0,0,1,.09-.916c.552-1.871,1.133-3.731,1.678-5.6a1.138,1.138,0,0,0-.045-.749A14.334,14.334,0,0,1,10.738,7.948c.555-.16,1.135-.234,1.7-.381a.963.963,0,0,0,.5-.306A18.017,18.017,0,0,1,43.415,26.228a.878.878,0,0,0-.054.583c.768,2.581,1.553,5.159,2.335,7.737a1.24,1.24,0,0,0,.1.192v.717c-.435.7-.753.986-1.288.986A3.347,3.347,0,0,1,43.57,36.263ZM8.946,31.8a11.517,11.517,0,0,0,4.878,1.468A10.875,10.875,0,0,0,17.186,33c-7.375-5.876-9.53-13.216-6.448-22.135,0,0,0,0-.008,0a.065.065,0,0,0-.04,0c-.057.015-.112.038-.167.059A11.346,11.346,0,0,0,6.032,14,11.491,11.491,0,0,0,4.482,27.27a1.914,1.914,0,0,1,.163,1.663c-.236.657-.417,1.334-.617,2-.19.634-.378,1.267-.583,1.959.186-.045.3-.065.408-.1,1.24-.373,2.482-.737,3.718-1.123a1.9,1.9,0,0,1,.568-.093A1.606,1.606,0,0,1,8.946,31.8ZM23.463,3.291A15.146,15.146,0,0,0,12.23,16.355a14.568,14.568,0,0,0,4.514,12.58A15.083,15.083,0,0,0,34.9,31.29a1.617,1.617,0,0,1,1.331-.135c.936.294,1.878.572,2.82.858L42.34,33c-.632-2.086-1.226-4.067-1.836-6.043a1.764,1.764,0,0,1,.154-1.458A15.106,15.106,0,0,0,42.4,15.487,15.329,15.329,0,0,0,27.358,2.765,14.673,14.673,0,0,0,23.463,3.291ZM21.186,24.5a1.382,1.382,0,1,1,.033-2.753c1.358-.005,2.713,0,4.069,0,1.327,0,2.655,0,3.98,0a1.384,1.384,0,1,1,.057,2.753q-2.1.009-4.205.009Q23.154,24.514,21.186,24.5Zm.05-5.084a1.4,1.4,0,0,1-1.508-1.174,1.352,1.352,0,0,1,.953-1.523,2.162,2.162,0,0,1,.617-.064q3.04-.005,6.077,0c2.086,0,4.171-.005,6.257,0a1.367,1.367,0,0,1,.545,2.633,1.97,1.97,0,0,1-.7.124q-3.708.006-7.415.006Q23.651,19.424,21.236,19.421Zm0-5.09a1.4,1.4,0,0,1-1.511-1.222,1.358,1.358,0,0,1,1.008-1.488,2.275,2.275,0,0,1,.575-.053q3.039-.005,6.078,0t6.078,0a1.393,1.393,0,1,1,.017,2.765l-6.122,0Z"
                  transform="translate(0 0)"
                  fill="url(#linear-gradient)"
                />
              </svg>
            </div>
          </Tooltip>
        </div>

        <div className="talk_Icon" onClick={showsubTalkIcons}>
          <span className={totalValue === 0 ? "" : "talk-count total"}>
            {totalValue === 0 ? "" : totalValue}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="36.444"
            viewBox="0 0 44.793 33.62"
          >
            <g
              id="Group_1673"
              data-name="Group 1673"
              transform="translate(-431 -643.948)"
            >
              <path
                id="Path_587"
                data-name="Path 587"
                d="M431,646.226c.058-.145.119-.289.172-.436a2.781,2.781,0,0,1,2.578-1.835c1.093-.015,2.187,0,3.281,0h35.344c2.03,0,2.7.462,3.418,2.362v.875a6.724,6.724,0,0,1-.3.812,2.744,2.744,0,0,1-2.416,1.547c-.174.01-.35,0-.525,0-12.67,0-25.34-.017-38.01.019-1.76.005-2.991-.552-3.539-2.294Z"
                fill="#fff"
              />
              <path
                id="Path_588"
                data-name="Path 588"
                d="M475.793,767.219a6.739,6.739,0,0,1-.3.812,2.744,2.744,0,0,1-2.416,1.547c-.174.01-.35,0-.525,0-12.67,0-25.34-.017-38.01.019-1.76.005-2.991-.552-3.539-2.294v-1.05c.062-.159.125-.318.186-.477a2.812,2.812,0,0,1,2.521-1.794c.175-.006.35,0,.525,0h38.143c2.028,0,2.7.464,3.418,2.362Z"
                transform="translate(0 -106.031)"
                fill="#fff"
              />
              <path
                id="Path_589"
                data-name="Path 589"
                d="M475.793,887.226a6.729,6.729,0,0,1-.3.812,2.744,2.744,0,0,1-2.416,1.547c-.174.01-.35,0-.525,0-12.67,0-25.34-.017-38.01.019-1.76.005-2.991-.552-3.539-2.294v-1.05c.058-.145.119-.289.173-.436a2.8,2.8,0,0,1,2.534-1.836c.175-.006.35,0,.525,0h38.143c2.028,0,2.7.464,3.418,2.362Z"
                transform="translate(0 -212.04)"
                fill="#fff"
              />
            </g>
          </svg>
        </div>
      </div>
      {notesModal && (
        <ModalAddNote addNewModal={notesModal} setAddNewModal={setNotesModal} />
      )}
    </>
  );
};

export default Talk;
