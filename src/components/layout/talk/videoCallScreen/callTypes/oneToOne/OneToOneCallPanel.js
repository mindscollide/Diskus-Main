import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../videoCallPanels/videoCallNormalPanel.css";
import { LoaderPanelVideoScreen } from "../../../../../elements";
import VideoOutgoing from "../../videoCallBody/VideoMaxOutgoing";
import {
  endIndexUrl,
  extractedUrl,
  generateURLCaller,
  generateURLParticipant,
} from "../../../../../../commen/functions/urlVideoCalls";
import { isSharedScreenTriggeredApi } from "../../../../../../store/actions/VideoFeature_actions";
import { disableZoomBeforeJoinSession } from "../../../../../../store/actions/VideoFeature_actions";
import { initiateVideoCallFail } from "../../../../../../store/actions/VideoMain_actions";
import { useTalkContext } from "../../../../../../context/TalkContext";
import {
  useVideoCallEngine,
  validateRoomID,
} from "../../../../../../hooks/videoCall/useVideoCallEngine";
import OneToOneCallHeader from "./OneToOneCallHeader";

/**
 * One-to-one call video surface. Extracted from videoCallNormalPanel.js
 * (which still handles group/meeting/presenter calls) — see
 * C:\Users\Administrator\.claude\plans\swift-moseying-sloth.md Phase 2.
 * Only the plain 1:1 branches of that file's logic are ported here; the
 * meeting-video, group-roster, and presenter-view code paths were left out
 * on purpose since none of them apply to a 1:1 call.
 */
const OneToOneCallPanel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeVideoIcon } = useTalkContext();
  const ActiveChatBoxGS = useSelector(
    (state) => state.talkFeatureStates.ActiveChatBoxGS,
  );

  const {
    iframeRef,
    callerURL,
    setCallerURL,
    toggleMic,
    toggleCamera,
    sendToIframe,
  } = useVideoCallEngine();

  const [isScreenActive, setIsScreenActive] = useState(false);
  const [showTile, setShowTile] = useState(false);

  const FullLoader = useSelector((state) => state.VideoMainReducer.FullLoader);
  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag,
  );
  const MaximizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeVideoFlag,
  );
  const MinimizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MinimizeVideoFlag,
  );
  const VideoChatPanel = useSelector(
    (state) => state.videoFeatureReducer.VideoChatPanel,
  );
  const VideoOutgoingCallFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoOutgoingCallFlag,
  );
  const LeaveCallModalFlag = useSelector(
    (state) => state.videoFeatureReducer.LeaveCallModalFlag,
  );
  const disableBeforeJoinZoom = useSelector(
    (state) => state.videoFeatureReducer.disableBeforeJoinZoom,
  );
  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare,
  );
  const InitiateVideoCallData = useSelector(
    (state) => state.VideoMainReducer.InitiateVideoCallData,
  );
  const VideoCallResponseData = useSelector(
    (state) => state.VideoMainReducer.VideoCallResponseData,
  );

  // Caller-side URL build — ported from videoCallNormalPanel.js's
  // `isMeeting === false` branch of its InitiateVideoCallData effect.
  useEffect(() => {
    try {
      if (Object.keys(InitiateVideoCallData).length === 0) return;
      const dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
      const endIdx = dynamicBaseURLCaller ? endIndexUrl(dynamicBaseURLCaller) : "";
      const extractedBaseURLCaller = endIdx
        ? extractedUrl(dynamicBaseURLCaller, endIdx)
        : "";
      const initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
      if (!initiateCallRoomID) return;
      const currentUserName = localStorage.getItem("name");
      const newurl = generateURLCaller(
        extractedBaseURLCaller,
        currentUserName,
        initiateCallRoomID,
        InitiateVideoCallData?.guid,
      );
      if (validateRoomID(newurl) && newurl !== callerURL) {
        setCallerURL(newurl);
        dispatch(initiateVideoCallFail(""));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InitiateVideoCallData]);

  // Receiver-side URL build — ported from videoCallNormalPanel.js's
  // `isMeeting === false` branch of its VideoCallResponseData effect.
  useEffect(() => {
    try {
      const dynamicBaseURLParticipant = localStorage.getItem(
        "videoBaseURLParticipant",
      );
      const endIdx = dynamicBaseURLParticipant
        ? endIndexUrl(dynamicBaseURLParticipant)
        : "";
      const extractedBaseURLParticipant = endIdx
        ? extractedUrl(dynamicBaseURLParticipant, endIdx)
        : "";
      const callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
      if (!callAcceptedRoomID || Number(callAcceptedRoomID) === 0) return;
      const currentUserName = localStorage.getItem("name");
      const newurl = generateURLParticipant(
        extractedBaseURLParticipant,
        currentUserName,
        callAcceptedRoomID,
        VideoCallResponseData?.guid,
      );
      if (validateRoomID(newurl) && newurl !== callerURL) {
        setCallerURL(newurl);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VideoCallResponseData]);

  // postMessage events from the iframe — only the subset that applies to a
  // plain 1:1 call (no meeting/presenter forks; see useVideoCallEngine.js
  // for why those were left out of the shared engine).
  useEffect(() => {
    const messageHandler = (event) => {
      if (event.origin !== process.env.REACT_APP_VIDEO_EVENTS) return;
      switch (event.data) {
        case "ScreenSharedMsgFromIframe": {
          setIsScreenActive(true);
          const isZoomEnabled = JSON.parse(
            localStorage.getItem("isZoomEnabled"),
          );
          if (isZoomEnabled) {
            const roomID = localStorage.getItem("acceptedRoomID");
            const userID = localStorage.getItem("userID");
            dispatch(
              isSharedScreenTriggeredApi(navigate, t, {
                RoomID: roomID,
                ShareScreen: true,
                UID: userID,
              }),
            );
          }
          break;
        }
        case "ScreenSharedStopMsgFromIframe": {
          setIsScreenActive(false);
          const isZoomEnabled = JSON.parse(
            localStorage.getItem("isZoomEnabled"),
          );
          const isSharedSceenEnable = JSON.parse(
            localStorage.getItem("isSharedSceenEnable"),
          );
          if (isZoomEnabled && isSharedSceenEnable && !globallyScreenShare) {
            const roomID = localStorage.getItem("acceptedRoomID");
            const userID = localStorage.getItem("userID");
            dispatch(
              isSharedScreenTriggeredApi(navigate, t, {
                RoomID: roomID,
                ShareScreen: false,
                UID: userID,
              }),
            );
          }
          break;
        }
        case "StreamConnected": {
          const isZoomEnabled = JSON.parse(
            localStorage.getItem("isZoomEnabled"),
          );
          if (isZoomEnabled) {
            setTimeout(() => {
              dispatch(disableZoomBeforeJoinSession(false));
            }, 4000);
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, [dispatch, navigate, t, globallyScreenShare]);

  const handleScreenShareButton = () => {
    const isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    if ((!isZoomEnabled || !disableBeforeJoinZoom) && !LeaveCallModalFlag) {
      sessionStorage.setItem("nonPresenter", true);
      sendToIframe("ScreenShare");
    }
  };

  const layoutCurrentChange = () => {
    const isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    if (isZoomEnabled && disableBeforeJoinZoom) return;
    if (LeaveCallModalFlag) return;
    const videoView = localStorage.getItem("VideoView");
    if (videoView === "Sidebar") {
      sendToIframe("TileView");
      localStorage.setItem("VideoView", "TileView");
      setShowTile(true);
    } else if (videoView === "TileView") {
      sendToIframe("SidebarView");
      localStorage.setItem("VideoView", "Sidebar");
      setShowTile(false);
    }
  };

  const baseClass =
    !NormalizeVideoFlag && !MinimizeVideoFlag && MaximizeVideoFlag
      ? "max-video-panel"
      : NormalizeVideoFlag && !MinimizeVideoFlag && !MaximizeVideoFlag
        ? VideoChatPanel
          ? "videoCallScreen"
          : "videoCallScreen "
        : "max-video-panel ";
  const finalClass =
    activeVideoIcon || ActiveChatBoxGS
      ? `${baseClass} more-zindexwithChatOpen`
      : baseClass;

  return (
    <Row>
      <Col sm={12} md={12} lg={12}>
        <div className={finalClass}>
          {FullLoader === true ? (
            <LoaderPanelVideoScreen />
          ) : (
            <>
              <OneToOneCallHeader
                screenShareButton={handleScreenShareButton}
                layoutCurrentChange={layoutCurrentChange}
                isScreenActive={isScreenActive}
                disableMic={toggleMic}
                disableVideo={toggleCamera}
                showTile={showTile}
                iframeCurrent={iframeRef.current}
              />
              {VideoOutgoingCallFlag && <VideoOutgoing />}
              <Row>
                <Col sm={12} md={12} lg={12}>
                  <div
                    className={
                      NormalizeVideoFlag && !MinimizeVideoFlag && !MaximizeVideoFlag
                        ? "normal-avatar"
                        : !NormalizeVideoFlag && !MinimizeVideoFlag && MaximizeVideoFlag
                          ? "normal-avatar-large"
                          : ""
                    }
                  >
                    {callerURL !== "" && (
                      <iframe
                        src={callerURL}
                        ref={iframeRef}
                        title="Live Video"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="camera; microphone; fullscreen; display-capture; cross-origin-isolated"
                        mozallowfullscreen="true"
                        webkitallowfullscreen="true"
                      />
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default OneToOneCallPanel;
