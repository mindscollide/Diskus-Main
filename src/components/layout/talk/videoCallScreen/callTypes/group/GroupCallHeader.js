import React, { useContext, useEffect } from "react";
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
import TileView from "./../../../talk-Video/video-images/Tile View 1 Purple.svg";
import SidebarView from "./../../../talk-Video/video-images/Tile View 3 Purple.svg";
import MicOn from "./../../../talk-Video/video-images/Mic Enabled Purple.svg";
import VideoOn from "../../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import MicOff from "../../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import ChatIcon from "./../../../talk-Video/video-images/Chat Purple.svg";
import CallEndRedIcon from "./../../../talk-Video/video-images/Call End Red.svg";
import NormalizeIcon from "./../../../talk-Video/video-images/Collapse.svg";
import RaiseHand from "./../../../talk-Video/video-images/Raise Hand Purple.svg";
import LowerHand from "./../../../talk-Video/video-images/Raise Hand White.svg";
import CopyLink from "./../../../talk-Video/video-images/Copy Link Purple.svg";
import ActiveParticipantIcon from "./../../../talk-Video/video-images/Users White.svg";
import ParticipantsIcon from "./../../../talk-Video/video-images/Users Purple.svg";
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
  participantWaitingListBox,
  toggleParticipantsVisibility,
  screenShareTriggeredGlobally,
  isSharedScreenTriggeredApi,
} from "../../../../../../store/actions/VideoFeature_actions";
import { LeaveCall } from "../../../../../../store/actions/VideoMain_actions";
import {
  getMeetingGuestVideoMainApi,
  raiseUnRaisedHandMainApi,
} from "../../../../../../store/actions/Guest_Video";
import { MeetingContext } from "../../../../../../context/MeetingContext";
import { useVideoCallEngine } from "../../../../../../hooks/videoCall/useVideoCallEngine";
import useSnackbar from "../../../../../elements/snack_bar/useSnackbar";

/**
 * Group call toolbar. Extracted from videoCallNormalHeader.js — see
 * C:\Users\Administrator\.claude\plans\swift-moseying-sloth.md Phase 3.
 * No recording or host-transfer controls (meeting-video only), but unlike
 * OneToOneCallHeader this DOES need raise-hand, copy-invite-link, and the
 * multi-participant roster popup — a group call always has those.
 *
 * Leave/end reuses the same `leaveCallForNonMeating(0)`-derived logic as
 * OneToOneCallHeader (the original's non-meeting leave path never actually
 * branched on 1:1 vs. group), plus clears the group roster lists that
 * `leaveCallForNonMeating`'s real cleanup also clears and this port had not
 * needed for 1:1.
 *
 * Participant popup: ported from the original's ~320-line participant-count
 * block, keeping only the branches that fire when `callTypeID === 2`
 * (dropping every meeting-video/presenter clause, which never applies here).
 */
const GroupCallHeader = ({
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
  const [show, SnackBar] = useSnackbar();

  const {
    videoTalk,
    groupVideoCallAccepted,
    setGroupVideoCallAccepted,
    groupCallParticipantList,
    setGroupCallParticipantList,
    unansweredCallParticipant,
    setUnansweredCallParticipant,
    inCallParticipantsList,
    setInCallParticipantsList,
    setVideoChatUnreadCount,
  } = useContext(MeetingContext);
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
  const ParticipantPopupFlag = useSelector(
    (state) => state.videoFeatureReducer.ParticipantPopupFlag,
  );
  const priticipantListModalFlagForHost = useSelector(
    (state) => state.videoFeatureReducer.participantWaitinglistBox,
  );
  const priticipantListModalFlagForNonHost = useSelector(
    (state) => state.videoFeatureReducer.participantsVisible,
  );
  const raisedUnRaisedParticipant = useSelector(
    (state) => state.videoFeatureReducer.raisedUnRaisedParticipant,
  );
  const pendingCallParticipantList = useSelector(
    (state) => state.videoFeatureReducer.pendingCallParticipantList,
  );
  const inCallParticipantList = useSelector(
    (state) => state.videoFeatureReducer.inCallParticipantList,
  );
  const VideoRecipentData = useSelector(
    (state) => state.VideoMainReducer.VideoRecipentData,
  );
  // guid -> boolean, maintained purely from the PARTICIPANT_RAISE_UNRAISE_HAND
  // MQTT payload (VideoFeature_reducer.js). Live debug logging confirmed
  // getAllParticipantMain only ever holds the current user's own record for a
  // plain group call (it's seeded by GetVideoCallParticipants, which — unlike
  // its name suggests — returns a single record, not the room's roster), so
  // matching against it could never find another participant. This map is
  // independent of that and is populated for every participant regardless.
  const raisedHandGuids = useSelector(
    (state) => state.videoFeatureReducer.raisedHandGuids,
  );

  const isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  const currentOrganization = Number(localStorage.getItem("organizationID"));
  const currentUserID = Number(localStorage.getItem("userID"));
  const currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
  const isCaller = JSON.parse(localStorage.getItem("isCaller"));
  const getMeetingHostInfo = JSON.parse(
    localStorage.getItem("meetinHostInfo"),
  );
  const callerID = Number(localStorage.getItem("callerID"));
  const callerNameInitiate = localStorage.getItem("callerNameInitiate");
  const organizationName = localStorage.getItem("organizatioName");
  const recipentCalledID = Number(localStorage.getItem("recipentCalledID"));

  const getCallTitle = () => t("Group-call");

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

  // Ported from the original's onClickCloseChatHandler: it only branches to
  // the meeting/presenter group chat when `isMeetingVideo || presenterViewFlag`
  // — neither is ever true for a plain group call, so a group call opens the
  // same one-to-one-style chat (keyed off `callerID`) that a 1:1 call does.
  // This matches production today, even though it means a group call's chat
  // button doesn't open a chat with every participant — flagged, not fixed.
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

  const raiseUnRaiseForParticipant = (flag) => {
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      const RoomID = localStorage.getItem("groupCallRoomId");
      const UID = isCaller
        ? localStorage.getItem("callerGuid")
        : localStorage.getItem("receipentGuid");
      dispatch(
        raiseUnRaisedHandMainApi(navigate, t, {
          RoomID: String(RoomID),
          UID: String(UID),
          IsHandRaised: flag,
        }),
      );
    }
  };

  const copyToClipboardd = () => {
    dispatch(
      getMeetingGuestVideoMainApi(navigate, t, {
        MeetingId: currentMeetingID,
      }),
    );
    show(t("Link-copied"), "success");
  };

  const isActiveInvitee = (p) => {
    const status = String(p?.callStatus || "").toLowerCase();
    return (
      !status.includes("reject") &&
      !status.includes("unanswer") &&
      !status.includes("declin")
    );
  };

  // Ported from the original header (it built these two Context lists
  // itself, from Redux, right inside the header component) — without this,
  // groupCallParticipantList/inCallParticipantsList never get populated and
  // the participant popup renders empty no matter what's actually happening
  // on the call.

  // Caller roster = in-call (accepted) + pending (still ringing), deduped by
  // userID. The caller never appears in the in-call/pending lists (they
  // didn't "accept" and aren't "ringing"), so seed their own entry first.
  useEffect(() => {
    const pending = (
      Array.isArray(pendingCallParticipantList) ? pendingCallParticipantList : []
    ).filter(isActiveInvitee);
    const inCall = Array.isArray(inCallParticipantList)
      ? inCallParticipantList
      : [];

    const mergedMap = new Map();
    if (isCaller) {
      mergedMap.set(currentUserID, {
        userID: currentUserID,
        name: localStorage.getItem("name"),
        callStatus: "In Call",
        isHost: true,
        isGuest: false,
        guid: "",
        videoCallParticipantsID: 0,
        email: localStorage.getItem("email"),
        roomID: "",
        raiseHand: false,
        mute: false,
        hideCamera: false,
        requestStatusID: 2,
        shareScreen: false,
      });
    }
    inCall.forEach((p) => {
      if (!mergedMap.has(p.userID)) mergedMap.set(p.userID, p);
    });
    pending.forEach((p) => {
      if (!mergedMap.has(p.userID)) mergedMap.set(p.userID, p);
    });

    setGroupCallParticipantList(Array.from(mergedMap.values()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCallParticipantList, inCallParticipantList, isCaller, currentUserID]);

  // Viewer roster — the backend in-call list as-is (already includes the
  // current user).
  useEffect(() => {
    if (Array.isArray(inCallParticipantList) && inCallParticipantList.length > 0) {
      setInCallParticipantsList(inCallParticipantList);
    } else {
      setInCallParticipantsList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inCallParticipantList]);

  // New addition (not a port): looks a roster row's live raise-hand status
  // up in raisedHandGuids by guid — see the reducer comment for why
  // getAllParticipantMain couldn't be used for this.
  const isParticipantHandRaised = (participant) => {
    if (!participant?.guid) return false;
    const result = raisedHandGuids?.[participant.guid] === true;
    // TEMP DEBUG — remove once raise-hand is confirmed working live.
    console.log(
      "[RaiseHandDebug] isParticipantHandRaised for",
      participant?.name,
      "guid:",
      participant?.guid,
      "-> result:",
      result,
      "| raisedHandGuids:",
      raisedHandGuids,
    );
    return result;
  };

  const closeParticipantHandler = (flag) => {
    if (flag === 1) {
      dispatch(participantWaitingListBox(!priticipantListModalFlagForHost));
    } else if (flag === 2) {
      dispatch(toggleParticipantsVisibility(!priticipantListModalFlagForNonHost));
    }
    if (isCaller && LeaveCallModalFlag === false) {
      dispatch(participantPopup(!ParticipantPopupFlag));
    }
  };

  // Ported from leaveCallForNonMeating(0) — see file header comment. Also
  // clears the group roster lists, which OneToOneCallHeader's copy of this
  // function didn't need (a 1:1 call has no roster).
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
      const currentCallType = Number(localStorage.getItem("CallType"));

      localStorage.removeItem("currentHostUserID");
      localStorage.removeItem("isHost");
      localStorage.removeItem("isNewHost");
      setGroupCallParticipantList([]);
      setGroupVideoCallAccepted([]);
      setUnansweredCallParticipant([]);

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

  const isViewer =
    !isCaller && !getMeetingHostInfo?.isHost && !getMeetingHostInfo?.isDashboard;

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

          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : !raisedUnRaisedParticipant
                  ? "inactive-state"
                  : "cursor-pointer active-state"
            }>
            <Tooltip
              placement='topRight'
              title={
                raisedUnRaisedParticipant ? t("Lower-hand") : t("Raise-hand")
              }>
              <img
                onClick={() =>
                  raiseUnRaiseForParticipant(!raisedUnRaisedParticipant)
                }
                src={raisedUnRaisedParticipant ? LowerHand : RaiseHand}
                alt='Raise Hand'
              />
            </Tooltip>
          </div>

          {getMeetingHostInfo?.isHost ? (
            <div
              className={
                LeaveCallModalFlag
                  ? "grayScaleImage"
                  : "screenShare-Toggle inactive-state"
              }>
              <Tooltip placement='topRight' title={t("Copy-link")}>
                <img onClick={copyToClipboardd} src={CopyLink} alt='Copy Link' />
              </Tooltip>
            </div>
          ) : null}

          <div className='position-relative'>
            {ParticipantPopupFlag === true ? (
              <>
                <div className='cursor-pointer active-state'>
                  <img
                    src={ActiveParticipantIcon}
                    onClick={() => {
                      if (isViewer) {
                        dispatch(participantPopup(false));
                        return;
                      }
                      const role = getMeetingHostInfo?.isHost ? 1 : 2;
                      closeParticipantHandler(role);
                    }}
                    alt='Active participants'
                  />
                </div>
                <div className='participants-list'>
                  {isViewer
                    ? (() => {
                        const inCallList = Array.isArray(inCallParticipantsList)
                          ? inCallParticipantsList
                          : [];
                        const pendingList = (
                          Array.isArray(pendingCallParticipantList)
                            ? pendingCallParticipantList
                            : []
                        ).filter(isActiveInvitee);
                        const mergedMap = new Map();
                        inCallList.forEach((participant) => {
                          mergedMap.set(participant.userID, {
                            ...participant,
                            callStatus: "In Call",
                          });
                        });
                        pendingList.forEach((participant) => {
                          if (!mergedMap.has(participant.userID)) {
                            mergedMap.set(participant.userID, {
                              ...participant,
                              callStatus: participant.callStatus || "Pending",
                            });
                          }
                        });
                        const mergedParticipants = Array.from(
                          mergedMap.values(),
                        );

                        console.log(mergedParticipants,currentUserID,)
                        // Same two-column row design as the caller's list
                        // below (name+hand on the left, status on the
                        // right) — kept the two consistent rather than the
                        // single-column layout this view used before.
                        return mergedParticipants.length > 0
                          ? mergedParticipants.map((participant, index) => (
                              <Row className='m-0' key={index}>
                                <Col
                                  className='p-0 d-flex align-items-center gap-1'
                                  lg={8}
                                  md={8}
                                  sm={12}>
                                  <p className='participant-name mb-0'>
                                    {participant.name}
                                    {participant.isHost && (
                                      <span className='ms-1'>(Caller)</span>
                                    )}
                                  </p>
                                  {(participant.userID === currentUserID
                                    ? raisedUnRaisedParticipant
                                    : isParticipantHandRaised(participant)) && (
                                    <img
                                      src={RaiseHand}
                                      alt='Hand raised'
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </Col>
                                <Col
                                  className='d-flex justify-content-end align-items-baseline gap-3 p-0'
                                  lg={4}
                                  md={4}
                                  sm={12}>
                                  <p className='participant-state'>
                                    {participant.callStatus}
                                  </p>
                                </Col>
                              </Row>
                            ))
                          : null;
                      })()
                    : isCaller && (
                        <>
                          {groupCallParticipantList !== null &&
                          groupCallParticipantList.length > 0
                            ? groupCallParticipantList.map(
                                (participantData, index) => {
                                  const displayStatus =
                                    participantData.callStatusID === 4
                                      ? t("Calling")
                                      : participantData.callStatus;
                                  const isMatchingParticipantUnanswered =
                                    unansweredCallParticipant.some(
                                      (user) =>
                                        user.recepientID ===
                                          participantData.userID &&
                                        user.recepientName ===
                                          participantData.name,
                                    );
                                  return (
                                    <Row className='m-0' key={index}>
                                      <Col
                                        className='p-0 d-flex align-items-center gap-1'
                                        lg={8}
                                        md={8}
                                        sm={12}>
                                        <p className='participant-name mb-0'>
                                          {participantData.name}
                                        </p>
                                        {/* The caller's own row is a locally-
                                        synthesized entry (guid: "" — there's
                                        no backend roster entry for "yourself"
                                        on the caller side), so it can never
                                        match anything in getAllParticipantMain
                                        by guid. Fall back to the caller's own
                                        toggle state (raisedUnRaisedParticipant)
                                        for that one row; every other row is a
                                        real participant and uses the normal
                                        guid lookup. */}
                                        {(participantData.userID === currentUserID
                                          ? raisedUnRaisedParticipant
                                          : isParticipantHandRaised(
                                              participantData,
                                            )) && (
                                          <img
                                            src={RaiseHand}
                                            alt='Hand raised'
                                            width={14}
                                            height={14}
                                          />
                                        )}
                                      </Col>
                                      <Col
                                        className='d-flex justify-content-end align-items-baseline gap-3 p-0'
                                        lg={4}
                                        md={4}
                                        sm={12}>
                                        {isMatchingParticipantUnanswered ? (
                                          <p className='participant-state'>
                                            {t("Unanswered")}
                                          </p>
                                        ) : (
                                          <p className='participant-state'>
                                            {displayStatus}
                                          </p>
                                        )}
                                      </Col>
                                    </Row>
                                  );
                                },
                              )
                            : null}
                        </>
                      )}
                </div>
              </>
            ) : (
              <Tooltip placement='topRight' title={t("Participants")}>
                <div
                  className={
                    LeaveCallModalFlag === true
                      ? "grayScaleImage"
                      : "inactive-state"
                  }>
                  <img
                    src={ParticipantsIcon}
                    onClick={() => {
                      if (isViewer) {
                        dispatch(participantPopup(!ParticipantPopupFlag));
                        return;
                      }
                      const role = getMeetingHostInfo?.isHost ? 1 : 2;
                      closeParticipantHandler(role);
                    }}
                    alt='Participants'
                  />
                </div>
              </Tooltip>
            )}
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
      {SnackBar}
    </>
  );
};

export default GroupCallHeader;
