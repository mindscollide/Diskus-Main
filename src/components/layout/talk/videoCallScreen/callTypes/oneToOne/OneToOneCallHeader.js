import React, { useContext } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import { Button } from "@/components/elements";
import "../../videoCallHeader/videoCallHeader.css";
import ExpandIcon from "./../../../talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../talk-Video/video-images/Minimize Purple.svg";
import NonActiveScreenShare from "./../../../talk-Video/video-images/Screen Share Purple.svg";
import videoEndIcon from "./../../../talk-Video/video-images/Call End White.svg";
import TileView from "./../../../talk-Video/video-images/Tile View 1 Purple.svg";
import SidebarView from "./../../../talk-Video/video-images/Tile View 3 Purple.svg";
import MicOn from "./../../../talk-Video/video-images/Mic Enabled Purple.svg";
import VideoOn from "../../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import MicOff from "../../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import ChatIcon from "./../../../talk-Video/video-images/Chat Purple.svg";
import CallEndRedIcon from "./../../../talk-Video/video-images/Call End Red.svg";
import NormalizeIcon from "./../../../talk-Video/video-images/Collapse.svg";
import { checkFeatureIDAvailability } from "../../../../../../commen/functions/utils";
import {
  activeChat,
  GetOTOUserMessages,
} from "../../../../../../store/actions/Talk_action";
import {
  chatEnableNormalFlag,
  videoChatMessagesFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
  screenShareTriggeredGlobally,
  isSharedScreenTriggeredApi,
} from "../../../../../../store/actions/VideoFeature_actions";
import { LeaveCall } from "../../../../../../store/actions/VideoMain_actions";
import { MeetingContext } from "../../../../../../context/MeetingContext";
import { useVideoCallEngine } from "../../../../../../hooks/videoCall/useVideoCallEngine";

/**
 * One-to-one call toolbar. Extracted from videoCallNormalHeader.js — see
 * C:\Users\Administrator\.claude\plans\swift-moseying-sloth.md Phase 2.
 * No recording, raise-hand, host-transfer, or participant-list controls —
 * none of that applies to a 1:1 call.
 *
 * Leave/end is ported from what a 1:1 call ACTUALLY runs today: clicking
 * the end-call icon opens a confirm popup whose confirm button calls
 * `participantLeaveCall()` (editorRole.role is never "Organizer" for a 1:1
 * call, so the header's separate `leaveCall()` — reserved for meeting-video
 * MQTT/logout triggers — is never reached for this call type), which for a
 * non-meeting call falls through to `leaveCallForNonMeating(0)`. That core
 * (flag=0, no presenter re-join branch) is what's ported here as
 * `handleLeaveCall`.
 */
const OneToOneCallHeader = ({
  screenShareButton,
  layoutCurrentChange,
  isScreenActive,
  disableMic,
  disableVideo,
  showTile,
  iframeCurrent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { videoTalk, setVideoChatUnreadCount } = useContext(MeetingContext);
  const { mic, camera, resetMicCamera } = useVideoCallEngine();

  const MaximizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeVideoFlag,
  );
  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag,
  );
  const LeaveCallModalFlag = useSelector(
    (state) => state.videoFeatureReducer.LeaveCallModalFlag,
  );
  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare,
  );
  const disableBeforeJoinZoom = useSelector(
    (state) => state.videoFeatureReducer.disableBeforeJoinZoom,
  );
  const VideoChatMessagesFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoChatMessagesFlag,
  );
  const VideoRecipentData = useSelector(
    (state) => state.VideoMainReducer.VideoRecipentData,
  );

  const isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  const callerNameInitiate = localStorage.getItem("callerNameInitiate");
  const organizationName = localStorage.getItem("organizatioName");
  const callerID = Number(localStorage.getItem("callerID"));
  const currentUserID = Number(localStorage.getItem("userID"));
  const currentOrganization = Number(localStorage.getItem("organizationID"));
  const recipentCalledID = Number(localStorage.getItem("recipentCalledID"));
  const currentUserName = localStorage.getItem("name");
  const callerName = localStorage.getItem("callerName");

  // Ported from getMeetingTitle() — simplified to the branches that ever
  // apply to a 1:1 call (the meeting-video/group/presenter branches were
  // dropped, since those never fire for this call type).
  const getCallTitle = () => {
    if (
      currentUserName !== VideoRecipentData?.userName &&
      Object.keys(VideoRecipentData || {}).length > 0
    ) {
      return (
        VideoRecipentData.userName ||
        VideoRecipentData.recipients?.[0]?.userName
      );
    }
    if (Object.keys(VideoRecipentData || {}).length === 0) {
      return callerName;
    }
    return null;
  };

  const otoMaximizeVideoPanel = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(true));
      dispatch(minimizeVideoPanelFlag(false));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const minimizeVideoPanel = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const normalizeScreen = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(normalizeVideoPanelFlag(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
    }
  };

  const openVideoPanel = () => {
    dispatch(leaveCallModal(true));
  };

  const closeVideoPanel = () => {
    dispatch(leaveCallModal(false));
  };

  const onClickChatHandler = () => {
    if (LeaveCallModalFlag) return;
    if (VideoChatMessagesFlag === false) {
      const activeChatData =
        callerID === currentUserID
          ? {
              id: VideoRecipentData?.userID,
              fullName:
                VideoRecipentData?.recipients?.[0]?.userName ??
                VideoRecipentData?.userName ??
                "",
              imgURL: "",
              messageBody: "",
              messageDate: "",
              notiCount: 0,
              messageType: "O",
              isOnline: false,
              companyName: organizationName,
              sentDate: "",
              receivedDate: "",
              seenDate: "",
              attachmentLocation: "",
              senderID: currentUserID,
              admin: 0,
              isBlock: 0,
            }
          : {
              id: callerID,
              fullName: callerNameInitiate,
              imgURL: "",
              messageBody: "",
              messageDate: "",
              notiCount: 0,
              messageType: "O",
              isOnline: false,
              companyName: organizationName,
              sentDate: "",
              receivedDate: "",
              seenDate: "",
              attachmentLocation: "",
              senderID: currentUserID,
              admin: 0,
              isBlock: 0,
            };
      dispatch(activeChat(activeChatData));
      localStorage.setItem("ActiveChatType", "O");
      dispatch(chatEnableNormalFlag(true));
      dispatch(
        GetOTOUserMessages(
          navigate,
          {
            UserID: currentUserID,
            ChannelID: currentOrganization,
            OpponentUserId:
              callerID !== currentUserID ? callerID : recipentCalledID,
            NumberOfMessages: 50,
            OffsetMessage: 0,
          },
          t,
        ),
      );
      localStorage.setItem(
        "activeOtoChatID",
        callerID !== currentUserID ? callerID : recipentCalledID,
      );
      dispatch(videoChatMessagesFlag(true));
      if (setVideoChatUnreadCount) setVideoChatUnreadCount(0);
    } else {
      dispatch(videoChatMessagesFlag(false));
    }
  };

  // Ported from leaveCallForNonMeating(0) — see file header comment.
  const handleLeaveCall = async () => {
    try {
      if (iframeCurrent && iframeCurrent.contentWindow) {
        iframeCurrent.contentWindow.postMessage("leaveSession", "*");
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch {}

    try {
      const initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
      const acceptedRoomID = localStorage.getItem("acceptedRoomID");
      const activeRoomID = localStorage.getItem("activeRoomID");
      const isCaller = JSON.parse(localStorage.getItem("isCaller"));
      const currentCallType = Number(localStorage.getItem("CallType"));

      localStorage.removeItem("currentHostUserID");
      localStorage.removeItem("isHost");
      localStorage.removeItem("isNewHost");

      const isSharedSceenEnable = JSON.parse(
        localStorage.getItem("isSharedSceenEnable"),
      );
      if (isZoomEnabled && isSharedSceenEnable && !globallyScreenShare) {
        const userID = String(localStorage.getItem("userID"));
        dispatch(screenShareTriggeredGlobally(false));
        await dispatch(
          isSharedScreenTriggeredApi(navigate, t, {
            RoomID: acceptedRoomID,
            ShareScreen: false,
            UID: userID,
          }),
        );
      }

      const RoomID = isZoomEnabled
        ? isCaller
          ? String(initiateCallRoomID)
          : String(acceptedRoomID)
        : activeRoomID;

      await dispatch(
        LeaveCall(
          {
            OrganizationID: currentOrganization,
            RoomID: RoomID,
            IsCaller: isCaller ? true : false,
            CallTypeID: currentCallType,
          },
          navigate,
          t,
        ),
      );

      localStorage.setItem("isCaller", false);
      localStorage.setItem("isMeetingVideo", false);
      localStorage.setItem("callerStatusObject", JSON.stringify([]));
      localStorage.setItem("activeCall", false);
      sessionStorage.setItem("activeCallSessionforOtoandGroup", false);
      localStorage.setItem("acceptedRoomID", 0);
      localStorage.setItem("activeRoomID", 0);
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      dispatch(leaveCallModal(false));
      dispatch(participantPopup(false));
      resetMicCamera();
      sessionStorage.setItem("NonMeetingVideoCall", false);
    } catch {}
  };

  return (
    <>
      <Row className='mb-4'>
        <Col
          lg={6}
          md={6}
          sm={12}
          className='mt-1 d-flex justify-content-start align-items-center gap-2'>
          <p className='title-heading'>{getCallTitle()}</p>
        </Col>
        <Col
          lg={6}
          md={6}
          sm={12}
          className='d-flex align-items-center justify-content-end header-row'>
          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : !mic
                  ? "cursor-pointer active-state"
                  : "inactive-state"
            }>
            <Tooltip
              placement='topRight'
              title={mic ? t("Enable-mic") : t("Disable-mic")}>
              <img
                src={mic ? MicOn : MicOff}
                onClick={disableBeforeJoinZoom ? null : disableMic}
                alt='Mic'
              />
            </Tooltip>
          </div>

          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : !camera
                  ? "cursor-pointer active-state"
                  : "inactive-state"
            }>
            <Tooltip
              placement='topRight'
              title={camera ? t("Enable-video") : t("Disable-video")}>
              <img
                src={camera ? VideoOn : VideoOff}
                onClick={disableBeforeJoinZoom ? null : disableVideo}
                alt='Video'
              />
            </Tooltip>
          </div>

          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : globallyScreenShare
                  ? "presenterImage"
                  : "screenShare-Toggle inactive-state"
            }>
            <Tooltip
              placement='topRight'
              title={isScreenActive ? t("Stop-sharing") : t("Screen-share")}>
              <img
                onClick={!globallyScreenShare ? screenShareButton : null}
                src={NonActiveScreenShare}
                alt='Screen Share'
              />
            </Tooltip>
          </div>

          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : "screenShare-Toggle"
            }>
            <Tooltip placement='topRight' title={t("Layout")}>
              <img
                className='cursor-pointer'
                onClick={layoutCurrentChange}
                src={showTile ? TileView : SidebarView}
                alt='Layout Change'
              />
            </Tooltip>
          </div>

          {checkFeatureIDAvailability(3) && videoTalk?.isChat === true && (
            <div
              className={
                LeaveCallModalFlag || (isZoomEnabled && disableBeforeJoinZoom)
                  ? "grayScaleImage"
                  : "screenShare-Toggle inactive-state"
              }>
              <Tooltip placement='topRight' title={t("Chat")}>
                <img onClick={onClickChatHandler} src={ChatIcon} alt='Chat' />
              </Tooltip>
            </div>
          )}

          {LeaveCallModalFlag === false ? (
            <Tooltip title={t("End-call")}>
              <div className='inactive-state'>
                <img
                  className='cursor-pointer'
                  src={CallEndRedIcon}
                  onClick={openVideoPanel}
                  alt='End Call'
                />
              </div>
            </Tooltip>
          ) : null}

          <Tooltip title={t("Minimize")}>
            <div
              onClick={minimizeVideoPanel}
              className={
                LeaveCallModalFlag === true
                  ? "grayScaleImage"
                  : "inactive-state"
              }>
              <img src={MinimizeIcon} alt='Minimize' />
            </div>
          </Tooltip>

          {(NormalizeVideoFlag || MaximizeVideoFlag) && (
            <Tooltip title={NormalizeVideoFlag ? t("Expand") : t("Collapse")}>
              <div
                className={
                  LeaveCallModalFlag === true
                    ? "grayScaleImage"
                    : "inactive-state"
                }>
                <img
                  src={NormalizeVideoFlag ? ExpandIcon : NormalizeIcon}
                  onClick={
                    NormalizeVideoFlag ? otoMaximizeVideoPanel : normalizeScreen
                  }
                  alt={NormalizeVideoFlag ? "Expand" : "Collapse"}
                />
              </div>
            </Tooltip>
          )}
        </Col>
      </Row>

      {LeaveCallModalFlag === true && (
        <div className='leave-meeting-options leave-meeting-options-position'>
          <div className='leave-meeting-options__inner'>
            <Button
              className='leave-meeting-options__btn leave-meeting-red-button'
              text={t("End-call")}
              onClick={handleLeaveCall}
            />
            <Button
              className='leave-meeting-options__btn leave-meeting-gray-button'
              text={t("Cancel")}
              onClick={closeVideoPanel}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OneToOneCallHeader;
