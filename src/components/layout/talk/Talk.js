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
  showCancelModalmeetingDeitals,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
  viewMeetingFlag,
  uploadGlobalFlag,
  LeaveCurrentMeeting,
  currentMeetingStatus,
} from "../../../store/actions/NewMeetingActions";
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
import { getCurrentDateTimeUTC } from "../../../commen/functions/date_formater.js";
import PendingApprovalIcon from "../../../assets/images/Pending-approval.png";
import PendingApprovalWhiteIcon from "../../../assets/images/Pending-Approval-White.png";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import TalkChat from "./talk-chat/Talk-Chat";
import TalkNew from "./talk-chat/Talk-New";
import TalkVideo from "./talk-Video/TalkVideo";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ModalAddNote from "../../../container/notes/modalAddNote/ModalAddNote";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import {
  GetMinuteReviewPendingApprovalsByReviewerId,
  GetMinuteReviewPendingApprovalsStatsByReviewerId,
} from "../../../store/actions/Minutes_action.js";
import { convertNumbersInString } from "../../../commen/functions/regex";

const Talk = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notesModal, setNotesModal] = useState(false);

  //Getting api result from the reducer
  const AllUserChats = useSelector((state) => state.talkStateData.AllUserChats);
  const talkSocketUnreadMessageCount = useSelector(
    (state) => state.talkStateData.talkSocketUnreadMessageCount
  );

  const VideoChatPanelReducer = useSelector(
    (state) => state.videoFeatureReducer.VideoChatPanel
  );
  const MissedCallCountData = useSelector(
    (state) => state.VideoMainReducer.MissedCallCountData
  );
  const MissedCallCountMqttData = useSelector(
    (state) => state.VideoMainReducer.MissedCallCountMqttData
  );
  const ActiveChatBoxGS = useSelector(
    (state) => state.talkFeatureStates.ActiveChatBoxGS
  );

  const scheduleMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.scheduleMeetingPageFlag
  );
  const viewProposeDateMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewProposeDateMeetingPageFlag
  );
  const viewAdvanceMeetingPublishPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingPublishPageFlag
  );
  const viewAdvanceMeetingUnpublishPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag
  );
  const viewProposeOrganizerMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewProposeOrganizerMeetingPageFlag
  );
  const proposeNewMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.proposeNewMeetingPageFlag
  );
  const viewMeetingFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewMeetingFlag
  );

  const CurrentMeetingStatus = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingStatus
  );

  const PendingApprovalCountData = useSelector(
    (state) => state.MinutesReducer.PendingApprovalCountData
  );

  let currentMeeting = Number(localStorage.getItem("currentMeetingID"));

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
    if (VideoChatPanelReducer === false) {
      dispatch(videoChatPanel(true));
      dispatch(contactVideoFlag(false));
      dispatch(recentVideoFlag(true));
      setActiveVideoIcon(true);
      dispatch(activeChatBoxGS(false));
      dispatch(globalChatsSearchFlag(false));
      dispatch(videoChatSearchFlag(false));
    } else if (ActiveChatBoxGS === true) {
      setActiveVideoIcon(true);
      dispatch(privateGroupChatFlag(false));
      dispatch(privateChatFlag(false));
      dispatch(videoChatPanel(true));
      dispatch(contactVideoFlag(false));
      dispatch(recentVideoFlag(true));
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

  const handleMeetingPendingApprovals = async () => {
    if (
      (scheduleMeetingPageFlagReducer === true ||
        viewProposeDateMeetingPageFlagReducer === true ||
        viewAdvanceMeetingPublishPageFlagReducer === true ||
        viewAdvanceMeetingUnpublishPageFlagReducer === true ||
        viewProposeOrganizerMeetingPageFlagReducer === true ||
        proposeNewMeetingPageFlagReducer === true) &&
      viewMeetingFlagReducer === false
    ) {
      dispatch(showCancelModalmeetingDeitals(true));
      localStorage.setItem("navigateLocation", "Minutes");
      console.log("This Check");
    } else {
      navigate("/DisKus/Minutes");
      // let newData = { sRow: 0, Length: 10 };
      // await dispatch(
      //   GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t)
      // );
      // await dispatch(
      //   GetMinuteReviewPendingApprovalsByReviewerId(newData, navigate, t)
      // );
      dispatch(showCancelModalmeetingDeitals(false));
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
      dispatch(viewMeetingFlag(false));
      console.log("This Check");
      let Data = {
        FK_MDID: Number(currentMeeting),
        DateTime: getCurrentDateTimeUTC(),
      };
      if (CurrentMeetingStatus === 10) {
        dispatch(LeaveCurrentMeeting(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
        console.log("This Check");
      }
    }
    console.log("This Check");
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
    setActiveVideoIcon(false);
    if (ActiveChatBoxGS === false) {
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
      dispatch(
        GetAllUserChats(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      dispatch(headerShowHideStatus(true));
      dispatch(footerShowHideStatus(true));
      dispatch(activeChatBoxGS(true));
      dispatch(globalChatsSearchFlag(false));
    } else {
      dispatch(videoChatPanel(false));
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

  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);

  //Setting state data of global response all chat to chatdata
  useEffect(() => {
    if (
      AllUserChats.AllUserChatsData !== undefined &&
      AllUserChats.AllUserChatsData !== null &&
      AllUserChats.AllUserChatsData.length !== 0
    ) {
      setUnreadMessageCount(
        AllUserChats?.AllUserChatsData?.unreadMessageCount[0]?.totalCount
      );
    }
  }, [AllUserChats?.AllUserChatsData?.unreadMessageCount]);

  //MQTT Unread Message Count
  useEffect(() => {
    if (
      talkSocketUnreadMessageCount.unreadMessageData !== undefined &&
      talkSocketUnreadMessageCount.unreadMessageData !== null &&
      talkSocketUnreadMessageCount.unreadMessageData.length !== 0
    ) {
      let mqttUnreadMessageCount =
        talkSocketUnreadMessageCount.unreadMessageData;
      if (Object.keys(mqttUnreadMessageCount) !== null) {
        setUnreadMessageCount(mqttUnreadMessageCount.data[0].totalCount);
      } else {
        setUnreadMessageCount(
          AllUserChats?.AllUserChatsData?.unreadMessageCount[0]?.totalCount
        );
      }
    }
  }, [
    talkSocketUnreadMessageCount.unreadMessageData,
    AllUserChats?.AllUserChatsData?.unreadMessageCount,
  ]);

  //Setting state data of global response all chat to chatdata
  useEffect(() => {
    if (
      MissedCallCountData !== undefined &&
      MissedCallCountData !== null &&
      Object.keys(MissedCallCountData).length !== 0
    ) {
      setMissedCallCount(MissedCallCountData?.missedCallCount);
    }
  }, [MissedCallCountData?.missedCallCount]);

  useEffect(() => {
    if (
      PendingApprovalCountData !== null &&
      PendingApprovalCountData !== undefined
    ) {
      setPendingApprovalCount(PendingApprovalCountData);
    } else {
      setPendingApprovalCount(0);
    }
  }, [PendingApprovalCountData]);

  //MQTT Unread Message Count
  useEffect(() => {
    if (
      MissedCallCountMqttData !== undefined &&
      MissedCallCountMqttData !== null &&
      Object.keys(MissedCallCountMqttData).length !== 0
    ) {
      let missedCallCountMqtt = MissedCallCountMqttData.missedCallCount;
      if (Object.keys(missedCallCountMqtt) !== null) {
        setMissedCallCount(missedCallCountMqtt);
      } else {
        setMissedCallCount(MissedCallCountData.missedCallCount);
      }
    }
  }, [MissedCallCountMqttData.missedCallCount]);

  let totalValue;
  useEffect(() => {
    try {
      if (checkFeatureIDAvailability(4) && checkFeatureIDAvailability(3)) {
        totalValue = Number(missedCallCount) + Number(unreadMessageCount);
      } else if (checkFeatureIDAvailability(4)) {
        totalValue = Number(missedCallCount);
      } else if (checkFeatureIDAvailability(3)) {
        totalValue = Number(unreadMessageCount);
      }
    } catch {}
  }, []);

  console.log("totalValueTotalValue", totalValue);

  useEffect(() => {
    if (VideoChatPanelReducer === false) {
      setActiveVideoIcon(false);
    } else {
      setActiveVideoIcon(true);
    }
  }, [VideoChatPanelReducer]);

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
  //   if (ActiveChatBoxGS === true) {
  //     setSubIcons(true)
  //   }
  // }, [ActiveChatBoxGS])

  return (
    <>
      <div ref={videoPanelRef} className={"talk_nav" + " " + currentLang}>
        {ActiveChatBoxGS === true ? (
          <TalkNew />
        ) : activeVideoIcon === true ? (
          <TalkVideo />
        ) : null}

        <div className={subIcons ? "talk-nav-icons" : "border-0"}>
          {/* {checkFeatureIDAvailability(4) ? ( */}
          <Tooltip placement="leftTop" title={t("Pending-approvals")}>
            <div
              className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}
              onClick={handleMeetingPendingApprovals}
            >
              {/* <span className="talk-count"></span> */}
              {/* <span className={"talk-count"}> */}
              <span className={pendingApprovalCount === 0 ? "" : "talk-count"}>
                {pendingApprovalCount === 0
                  ? ""
                  : convertNumbersInString(pendingApprovalCount, currentLang)}
              </span>
              <svg
                width="35"
                height="36"
                viewBox="0 0 35 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34.5444 10.0637C34.5607 9.86789 34.5199 9.66398 34.4465 9.47637C34.3731 9.29693 34.2508 9.12563 34.1203 9.00328C32.0729 6.98043 30.0093 4.90863 27.9864 2.87762C27.8559 2.7308 27.701 2.62476 27.5133 2.54319C27.3584 2.47794 27.1952 2.44531 26.975 2.44531H26.9669C24.1039 2.45347 21.2816 2.45347 18.6633 2.45347H12.5214C12.4398 2.45347 12.3664 2.44531 12.293 2.44531C11.9586 2.44531 11.6323 2.50241 11.3223 2.6166C10.9471 2.75527 10.5964 2.98365 10.3109 3.26914C10.0254 3.55462 9.79704 3.90536 9.65837 4.28872C9.51971 4.67209 9.46261 5.07176 9.49524 5.44697V18.0735L9.41367 18.098C9.18529 18.1632 8.94874 18.2285 8.67141 18.3019C8.1657 18.4243 7.65183 18.5792 7.14611 18.7668C5.43321 19.4438 3.96501 20.6673 3.01068 22.2334C2.04003 23.7832 1.59957 25.6348 1.74639 27.4537C1.90137 29.4113 2.72519 31.2629 4.0792 32.6821C5.36796 34.0525 7.10533 34.9742 8.96505 35.2841L9.691 35.3983H32.1056L32.3176 35.3412C32.4808 35.3004 32.6439 35.2433 32.7907 35.1862C33.3291 34.9742 33.7777 34.6071 34.0958 34.1259C34.4139 33.6365 34.5607 33.0818 34.5363 32.519C34.5444 30.2107 34.5444 27.8534 34.5444 25.5777V19.9169C34.5363 16.6787 34.5363 13.3345 34.5444 10.0637ZM28.0843 5.47144L31.5183 8.9054H28.0843V5.47144ZM10.3598 33.6772C8.51644 33.6772 6.77906 32.9595 5.47399 31.6544C4.16893 30.3575 3.45114 28.6201 3.44298 26.7767C3.44298 25.8631 3.61427 24.9741 3.96501 24.1258C4.31575 23.2856 4.8133 22.5271 5.46584 21.8827C6.11022 21.2302 6.86063 20.7244 7.70893 20.3737C8.54906 20.0311 9.42999 19.8517 10.3435 19.8517V19.4438L10.368 19.8517C12.2114 19.8517 13.9406 20.5776 15.2457 21.8827C16.5508 23.1878 17.2686 24.917 17.2686 26.7604C17.2686 28.6038 16.5508 30.3412 15.2457 31.6462C13.9406 32.9513 12.2033 33.6772 10.3598 33.6772ZM32.8233 32.4456C32.8397 32.6169 32.8233 32.7882 32.7663 32.9431C32.7173 33.0981 32.6194 33.2449 32.5052 33.3591C32.3829 33.4815 32.2442 33.5712 32.0811 33.6283C31.9669 33.6691 31.8445 33.6854 31.714 33.6854C31.6733 33.6854 31.6325 33.6854 31.5427 33.6772H15.4659C15.7514 33.4896 16.0287 33.2776 16.2734 33.041C17.758 31.6381 18.7123 29.7457 18.9488 27.7147L18.957 27.625H28.9897C29.1039 27.625 29.2181 27.6168 29.3486 27.5924C29.5444 27.5434 29.7157 27.4292 29.838 27.2661C29.9604 27.103 30.0174 26.899 29.993 26.687C29.9767 26.4749 29.8788 26.2873 29.732 26.1405C29.577 26.0018 29.3812 25.9121 29.1528 25.9039H19.0059L18.9978 25.8224C18.9407 25.6103 18.8836 25.3982 18.8428 25.2025C18.7368 24.7457 18.6063 24.2807 18.4513 23.824C18.28 23.3835 18.0924 22.9594 17.8803 22.5515L17.7743 22.3313C17.6845 22.1519 17.5867 21.9724 17.4725 21.8011H29.0631C29.1365 21.8011 29.2181 21.793 29.316 21.7766C29.5199 21.7359 29.6993 21.6217 29.8217 21.4585C29.9522 21.2954 30.0093 21.0915 30.0011 20.8794C29.9848 20.6592 29.8869 20.4634 29.732 20.3166C29.577 20.1698 29.3731 20.0882 29.1692 20.0801C29.006 20.0719 28.8184 20.0719 28.5982 20.0719H23.8918C21.4366 20.0719 18.8102 20.0719 16.1837 20.0637C15.9472 20.0637 15.7188 19.9903 15.5312 19.8517C14.3485 18.9789 12.9537 18.4079 11.4936 18.204L11.2163 18.1632L11.2081 5.41434C11.1918 5.24305 11.2081 5.07992 11.2652 4.91679C11.3142 4.75365 11.4121 4.60683 11.5344 4.48448C11.6486 4.37029 11.7954 4.28057 11.9586 4.22347C12.0728 4.18269 12.1951 4.16637 12.3175 4.16637C12.3664 4.16637 12.4072 4.16637 12.5132 4.17453H26.3388V9.63135C26.3388 10.3247 26.6651 10.6509 27.3584 10.6509H32.8233V32.4456Z"
                  fill="url(#paint0_linear_1355_37628)"
                />
                <path
                  d="M30.0224 14.6665C30.0306 14.8052 30.0061 14.9439 29.949 15.0662C29.9082 15.1967 29.7859 15.3517 29.6309 15.4496C29.4922 15.5393 29.3373 15.5882 29.1741 15.5882H15.0141L14.9897 15.1804V15.5882C14.9081 15.5882 14.8347 15.5801 14.7531 15.5719C14.5247 15.523 14.3453 15.4088 14.2148 15.2375C14.0924 15.0662 14.0272 14.8623 14.0435 14.6502C14.068 14.4137 14.1822 14.2098 14.3534 14.0711C14.5084 13.9406 14.7042 13.8672 14.9081 13.8672H29.0926C29.2557 13.8672 29.3944 13.8998 29.5249 13.9569C29.6635 14.0303 29.7859 14.1282 29.8838 14.2587C29.9653 14.3892 30.0143 14.5197 30.0224 14.6665Z"
                  fill="url(#paint1_linear_1355_37628)"
                />
                <path
                  d="M14.0518 25.3473C12.9996 26.3914 9.63088 29.7683 9.63088 29.7683C9.46775 29.9314 9.24752 30.0211 9.01913 30.0374H8.98651C8.86416 30.0293 8.75812 30.0048 8.65208 29.9559C8.54605 29.9069 8.45632 29.8417 8.37476 29.7519C7.763 29.1565 7.11863 28.5121 6.47425 27.8514C6.409 27.7943 6.33558 27.6965 6.28664 27.5904C6.2377 27.4844 6.20508 27.3702 6.20508 27.2478C6.20508 27.1336 6.22139 27.0113 6.27033 26.9053C6.31111 26.7911 6.37637 26.6932 6.46609 26.6116C6.53135 26.5464 6.62107 26.4811 6.72711 26.4403C6.82499 26.3914 6.93918 26.3669 7.05337 26.3669C7.31439 26.3751 7.54277 26.4811 7.71406 26.6606C7.98323 26.9216 8.25241 27.1989 8.53789 27.4925L8.98651 27.9575C8.98651 27.9575 9.30462 27.6557 9.35356 27.6067L10.6505 26.3098C11.3846 25.5757 12.135 24.8171 12.8854 24.083C13.0485 23.9036 13.2932 23.7894 13.5542 23.7812C13.7663 23.7812 13.9539 23.8465 14.1007 23.977C14.2557 24.0994 14.3536 24.2788 14.3862 24.4746C14.4596 24.7601 14.3618 25.0455 14.0518 25.3473Z"
                  fill="url(#paint2_linear_1355_37628)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1355_37628"
                    x1="36.5578"
                    y1="19.6122"
                    x2="1.71707"
                    y2="19.6122"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#4ADEDE" />
                    <stop offset="1" stop-color="#6172D6" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_1355_37628"
                    x1="31.0024"
                    y1="14.7638"
                    x2="14.0402"
                    y2="14.7638"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#4ADEDE" />
                    <stop offset="1" stop-color="#6172D6" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_1355_37628"
                    x1="14.9117"
                    y1="27.0404"
                    x2="6.20466"
                    y2="27.0404"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#4ADEDE" />
                    <stop offset="1" stop-color="#6172D6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Tooltip>
          {/* ) : null} */}
          {checkFeatureIDAvailability(6) ? (
            <Tooltip placement="leftTop" title={t("Add-a-note")}>
              <div
                className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}
                onClick={handleOpenAddNotesModal}
              >
                <svg
                  id="Group_2034"
                  data-name="Group 2034"
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
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
          ) : null}
          {checkFeatureIDAvailability(4) ? (
            <Tooltip placement="leftTop" title={t("Video-call")}>
              <div
                // className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"
                className={
                  activeVideoIcon && subIcons
                    ? "talk_subIcon with-hover"
                    : !activeVideoIcon && subIcons
                    ? "talk_subIcon"
                    : "talk_subIcon_hidden"
                }
                onClick={videoIconClick}
              >
                {/* <span className="talk-count"></span> */}
                <span className={missedCallCount === 0 ? "" : "talk-count"}>
                  {missedCallCount === 0
                    ? ""
                    : convertNumbersInString(missedCallCount, currentLang)}
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
          {checkFeatureIDAvailability(3) ? (
            <Tooltip placement="leftTop" title={t("Chat")}>
              <div
                className={
                  ActiveChatBoxGS && subIcons
                    ? "talk_subIcon with-hover"
                    : !ActiveChatBoxGS && subIcons
                    ? "talk_subIcon"
                    : "talk_subIcon_hidden"
                }
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
          ) : null}
        </div>

        <div className="talk_Icon" onClick={showsubTalkIcons}>
          <span
            className={
              totalValue === 0 ||
              totalValue === undefined ||
              totalValue === null
                ? ""
                : "talk-count total"
            }
          >
            {totalValue === 0 || totalValue === undefined || totalValue === null
              ? ""
              : totalValue}
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
