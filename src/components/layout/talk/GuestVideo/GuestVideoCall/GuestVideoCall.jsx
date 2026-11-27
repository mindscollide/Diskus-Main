import React, { useEffect, useRef, useState } from "react";
import GuestJoinVideo from "../GuestJoinVideo/GuestJoinVideo";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import "./GuestVideoCall.css";
import GuestVideoHeader from "../GuestVideoHeader/GuestVideoHeader";
import GuestVideoEnded from "../GuestVideoEnded/GuestVideoEnded";
import { extractActionFromUrl } from "../../../../../commen/functions/utils";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  getVideoCallParticipantGuestSuccess,
  guestLeaveMeetingVideoApi,
  guestEmptySession,
  getGuestMeetingLeaveData,
  getGuestPresentationWaitingLeaveData,
  leaveMeetingVideoWaitingRoomGuestMainApi,
  guestHostEmailUpdated,
  joinPresenterViewGuestMainApi,
  leavePresenterViewGuestMainApi,
  guestVideoNavigationScreen,
  hideUnHideVideoByHost,
  hideUnHideVideoParticipantsorGuest,
  makeStreamStop,
  muteUnMuteByHost,
  muteUnMuteParticipantsorGuest,
  muteUnMuteParticipantsorGuestbyHost,
  raisedUnRaisedParticipantsGuest,
  setVideoCameraGuest,
  setVoiceControleGuest,
  setVoiceControleGuestForAllbyHost,
  setGuestVideoHostByGuid,
  validateEncryptGuestVideoMainApi,
} from "../../../../../store/actions/Guest_Video";
import { useSelector } from "react-redux";
import Helper from "../../../../../commen/functions/history_logout";
import useSnackbar from "../../../../elements/snack_bar/useSnackbar";
import { meetingApi } from "../../../../../commen/apis/Api_ends_points";
import {
  guestLeaveMeetingVideo,
  guestLeavePresentationWaitingRoom,
  leaveGuestPresenterView,
} from "../../../../../commen/apis/Api_config";
import GuestVideoScreen from "../GuestVideoScreen/GuestVideoScreen";
import GuestVideoReject from "../GuestVideoReject/GuestVideoReject";
import {
  participanMuteUnMuteMeeting,
  participantWaitingList,
} from "../../../../../store/actions/VideoFeature_actions";
import GuestRemoveByHost from "../GuestRemoveByHost/GuestRemoveByHost";
import VideoCallNotStarteded from "../VIdeoCallNotStarted";
import VideoCallNotPublishedYet from "../VIdeoCallNotPublishYet";
import GuestPresentationEnded from "../GuestPresentationEnded/GuestPresentationEnded";

/**
 * @component GuestVideoCall
 * @description Root orchestrator component for the guest video call flow.
 * Manages the complete guest lifecycle: validating the encrypted invite URL,
 * establishing and maintaining the MQTT Socket.io connection for real-time
 * events, and routing between the five navigation screens based on
 * `GuestVideoReducer.guestVideoNavigationData`:
 *  - 1: Join lobby (`GuestJoinVideo`)
 *  - 2: Active call (`GuestVideoScreen`)
 *  - 3: Entry rejected (`GuestVideoReject`)
 *  - 4: Meeting ended (`GuestVideoEnded`)
 *  - 5: Removed by host (`GuestRemoveByHost`)
 *
 * Handles all inbound MQTT messages (approval, rejection, mute/unmute,
 * video hide/show, raise/lower hand, participant join/leave, host-ended call,
 * and forced guest leave), dispatching the appropriate Redux actions to keep
 * guest and participant state in sync. Also performs a cleanup leave-call API
 * call when the page is reloaded mid-session.
 */
const GuestVideoCall = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  let guestUserId = sessionStorage.getItem("GuestUserID");
  let MeetingId = Number(sessionStorage.getItem("MeetingId"));

  const validateData = useSelector(
    (state) => state.GuestVideoReducer.validateData,
  );
  const guestClient = useSelector(
    (state) => state.GuestVideoReducer.guestClient,
  );
  const videoCameraGuest = useSelector(
    (state) => state.GuestVideoReducer.videoCameraGuest,
  );
  const voiceControle = useSelector(
    (state) => state.GuestVideoReducer.voiceControle,
  );

  const guestVideoNavigationData = useSelector(
    (state) => state.GuestVideoReducer.guestVideoNavigationData,
  );
  const getAllParticipantGuest = useSelector(
    (state) => state.GuestVideoReducer.getAllParticipantGuest,
  );
  // The MQTT handler is bound once, so it reads the current screen through a ref
  const guestScreenRef = useRef(guestVideoNavigationData);
  guestScreenRef.current = guestVideoNavigationData;
  // Blocks a second JoinGuestPresenterView while the first one is still in flight
  const presentationAutoJoinRef = useRef(false);
  const [showToast, SnackBar] = useSnackbar();
  // Blocks a second GuestLeaveMeetingVideoWaitingRoom while the first is in flight
  const waitingRoomLeaveRef = useRef(false);
  // Bumped when the waiting-room leave succeeded: the lobby then sends the presentation request
  const [autoJoinSignal, setAutoJoinSignal] = useState(0);
  // Bumped when a meeting-video guest moves into the presentation (same roomId, so roomId alone cannot remount the header)
  const [callSessionKey, setCallSessionKey] = useState(0);
  // let viewState = sessionStorage.getItem("viewState");

  const [actionValue, setActionValue] = useState("");
  //video Url state
  const [videoUrl, setVideoUrl] = useState("");
  console.log(actionValue, "videoUrlvideoUrl");
  // extract meeting ID state
  const [extractMeetingId, setExtractMeetingId] = useState(0);
  // extract Meeting Title
  const [extractMeetingTitle, setExtractMeetingTitle] = useState("");
  const [guestName, setGuestName] = useState("");
  const [roomId, setRoomId] = useState("");
  console.log(guestVideoNavigationData, "guestName");

  function modifyUrl(url, isMute, isHideCamera, guestName) {
    let modifiedUrl = url.replace("$ParticipantFullName$", guestName);

    // Replace placeholders with actual values
    modifiedUrl = modifiedUrl.replace("$IsMute$", isMute.toString());
    modifiedUrl = modifiedUrl.replace(
      "$IsHideCamera$",
      isHideCamera.toString(),
    );

    // Zoom iframe URLs (identified by sessionKey) have no placeholders. The
    // Zoom app applies isMute / isHideCamera when its audio and camera start,
    // so pass the lobby choices through so the call starts in that state.
    try {
      const parsedUrl = new URL(modifiedUrl);
      if (parsedUrl.searchParams.has("sessionKey")) {
        parsedUrl.searchParams.set("isMute", String(Boolean(isMute)));
        parsedUrl.searchParams.set(
          "isHideCamera",
          String(Boolean(isHideCamera)),
        );
        modifiedUrl = parsedUrl.toString();
      }
    } catch (error) {
      console.error(
        "src/components/layout/talk/GuestVideo/GuestVideoCall/GuestVideoCall.js:",
        error,
      );
    }

    return modifiedUrl;
  }
  useEffect(() => {
    console.log(voiceControle, "updatedUrlupdatedUrlupdatedUrl");
    console.log(videoCameraGuest, "updatedUrlupdatedUrlupdatedUrl");
    if (videoUrl && guestName) {
      const modifiedUrl = modifyUrl(
        videoUrl,
        voiceControle,
        videoCameraGuest,
        guestName,
      );

      console.log(modifiedUrl, "updatedUrlupdatedUrlupdatedUrl");
      setVideoUrl(modifiedUrl); // Update the video URL with the actual name
    }
  }, [videoUrl, guestName, voiceControle, videoCameraGuest]);

  const onJoinNameChange = (name) => {
    setGuestName(name);
  };

  const onMessageArrived = async (msg) => {
    try {
      console.log(msg, "msgmsgmsgmsg");
      let data = JSON.parse(msg.payloadString);
      console.log(data, "datadatadata");

      if (data.action === "Meeting") {
        if (
          data.payload.message.toLowerCase() ===
          "MEETING_VIDEO_JOIN_REQUEST_APPROVED".toLowerCase()
        ) {
          if (data.payload.isAccepted === true) {
            // Meeting room, kept for GuestLeaveMeetingVideo after the guest moves into a presentation
            sessionStorage.setItem(
              "guestMeetingRoomId",
              String(data.payload.roomID),
            );
            // Needed later by JoinGuestPresenterView when a presentation starts
            if (data.payload.videoCallUrl) {
              sessionStorage.setItem(
                "guestVideoCallUrl",
                String(data.payload.videoCallUrl),
              );
            }
            setVideoUrl(data.payload.videoUrl);
            setRoomId(data.payload.roomID);
            sessionStorage.setItem("roomId", data.payload.roomID);
            dispatch(makeStreamStop(true, 2));
            // dispatch(guestVideoNavigationScreen(2));
          } else {
            // Denied: guest never joined, so refresh must not call leave API
            sessionStorage.removeItem("hasJoined");
            dispatch(makeStreamStop(true, 3));
            // dispatch(guestVideoNavigationScreen(3));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "PRESENTATION_JOIN_REQUEST_APPROVED".toLowerCase()
        ) {
          // Presenter admitted this guest: register with JoinPresenterView first, then open the call
          if (data.payload.isAccepted === true) {
            const approved = data.payload;
            dispatch(
              joinPresenterViewGuestMainApi(
                {
                  VideoCallURL: String(approved.videoCallUrl),
                  WasInVideo: false,
                  IsGuest: true,
                  UID: String(approved.uid),
                },
                () => {
                  // Remember this guest is in a presentation so a later rejoin lobby shows the presentation view
                  sessionStorage.setItem("guestInPresentation", "true");
                  setVideoUrl(approved.videoUrl);
                  setRoomId(approved.roomID);
                  sessionStorage.setItem("roomId", approved.roomID);
                  dispatch(makeStreamStop(true, 2));
                },
                () => {
                  // Could not join: hasJoined stays so a refresh still clears the waiting entry
                  dispatch(makeStreamStop(true, 3));
                },
              ),
            );
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_PRESENTATION_STARTED".toLowerCase()
        ) {
          const videoCallUrl = sessionStorage.getItem("guestVideoCallUrl");
          // Guest waiting for approval in the meeting video (joined, still on the lobby, not a presentation guest):
          // leave that waiting room, then the lobby sends the presentation join request on its own
          if (
            guestScreenRef.current === 1 &&
            sessionStorage.getItem("hasJoined") === "true" &&
            sessionStorage.getItem("guestInPresentation") !== "true" &&
            !waitingRoomLeaveRef.current
          ) {
            showToast(t("Guest-presentation-started"), "info");
            if (!videoCallUrl) {
              console.error(
                "GuestLeaveMeetingVideoWaitingRoom not sent: videoCallUrl missing",
              );
            } else {
              waitingRoomLeaveRef.current = true;
              dispatch(
                leaveMeetingVideoWaitingRoomGuestMainApi(
                  navigate,
                  t,
                  {
                    VideoCallURL: String(videoCallUrl),
                    MeetingID: Number(
                      data.payload.meetingID ||
                        sessionStorage.getItem("MeetingId"),
                    ),
                    UserGUID: String(sessionStorage.getItem("GuestUserID")),
                  },
                  () => {
                    waitingRoomLeaveRef.current = false;
                    // The waiting entry is gone, so a refresh must not call a leave API for it
                    sessionStorage.removeItem("hasJoined");
                    // Tells the lobby to send JoinPresentationGuestRequest
                    setAutoJoinSignal((n) => n + 1);
                  },
                  () => {
                    waitingRoomLeaveRef.current = false;
                  },
                ),
              );
            }
          }
          // A guest already inside the meeting video joins the presentation automatically (no waiting room)
          if (
            guestScreenRef.current === 2 &&
            sessionStorage.getItem("guestInPresentation") !== "true" &&
            !presentationAutoJoinRef.current
          ) {
            if (!videoCallUrl) {
              console.error(
                "JoinGuestPresenterView not sent: videoCallUrl missing from MEETING_VIDEO_JOIN_REQUEST_APPROVED",
              );
            } else {
              const presentationRoomId = String(data.payload.roomID);
              presentationAutoJoinRef.current = true;
              dispatch(
                joinPresenterViewGuestMainApi(
                  {
                    VideoCallURL: String(videoCallUrl),
                    WasInVideo: true,
                    RoomID: presentationRoomId,
                    IsMuted: true,
                    HideVideo: true,
                    UID: String(sessionStorage.getItem("GuestUserID")),
                  },
                  (result) => {
                    presentationAutoJoinRef.current = false;
                    // Flag and room are set before the iframe switches so the header remounts with presentation state
                    sessionStorage.setItem("guestInPresentation", "true");
                    // Marks a guest who is still in the meeting video: leaving or stopping must also leave the meeting video
                    sessionStorage.setItem("guestPresentationFromVideo", "true");
                    sessionStorage.setItem(
                      "roomId",
                      String(result?.roomID || presentationRoomId),
                    );
                    // Mic and camera stay off in a presentation
                    dispatch(setVoiceControleGuest(true));
                    dispatch(setVideoCameraGuest(true));
                    setRoomId(String(result?.roomID || presentationRoomId));
                    if (result?.videoURL) setVideoUrl(result.videoURL);
                    // Remount the header: mic/camera icons read the off state and GetVideoCallParticipants runs again
                    setCallSessionKey((k) => k + 1);
                  },
                  () => {
                    // Stay in the meeting video if the join failed
                    presentationAutoJoinRef.current = false;
                  },
                ),
              );
            }
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "PRESENTATION_JOIN_REQUEST_REJECTED".toLowerCase()
        ) {
          // Presenter declined: guest never joined, so refresh must not call leave API
          sessionStorage.removeItem("isWaiting");
          sessionStorage.removeItem("hasJoined");
          dispatch(guestVideoNavigationScreen(9));
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_PRESENTATION_STOPPED".toLowerCase()
        ) {
          // Only a guest that is part of the presentation (waiting, inside, or left/removed from it) gets the "presentation ended" screen
          const screen = guestScreenRef.current;
          if (
            sessionStorage.getItem("guestInPresentation") === "true" &&
            (screen === 1 || screen === 2 || screen === 5)
          ) {
            // The presentation is over, so refresh must not call a leave API
            // A guest who came from the meeting video is still in it, so leave it too (screen stays "presentation ended")
            const meetingLeaveData = getGuestMeetingLeaveData();
            if (meetingLeaveData && screen === 2) {
              dispatch(
                guestLeaveMeetingVideoApi(navigate, t, meetingLeaveData, false, true),
              );
            }
            sessionStorage.removeItem("guestPresentationFromVideo");
            sessionStorage.removeItem("hasJoined");
            sessionStorage.removeItem("isZoomEnabled");
            dispatch(setVideoCameraGuest(false));
            dispatch(setVoiceControleGuest(false));
            dispatch(guestVideoNavigationScreen(8));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "GUEST_REMOVED_FROM_PRESENTATION".toLowerCase()
        ) {
          // Presenter removed this guest: same cleanup as a meeting removal, but the removed screen and rejoin lobby use the presentation view
          // A guest who came from the meeting video is still in it, so leave it too (screen stays "removed")
          const meetingLeaveData = getGuestMeetingLeaveData();
          if (meetingLeaveData && guestScreenRef.current === 2) {
            dispatch(
              guestLeaveMeetingVideoApi(navigate, t, meetingLeaveData, false, true),
            );
          }
          sessionStorage.removeItem("guestPresentationFromVideo");
          sessionStorage.setItem("isLeftCheck", false);
          sessionStorage.removeItem("isZoomEnabled");
          sessionStorage.removeItem("hasJoined");
          sessionStorage.setItem("guestInPresentation", "true");
          sessionStorage.setItem("removedFromPresentation", "true");
          dispatch(setVideoCameraGuest(false));
          dispatch(setVoiceControleGuest(false));
          dispatch(guestVideoNavigationScreen(5));
        } else if (
          data.payload.message.toLowerCase() ===
          "REMOVED_FROM_MEETING".toLowerCase()
        ) {
          sessionStorage.removeItem("removedFromPresentation");
          sessionStorage.setItem("isLeftCheck", false);
          sessionStorage.removeItem("isZoomEnabled");
          // Removed by host: guest is already out, so refresh must not call leave API
          sessionStorage.removeItem("hasJoined");
          dispatch(setVideoCameraGuest(false));
          dispatch(setVoiceControleGuest(false));
          dispatch(guestVideoNavigationScreen(5));
        } else if (
          data.payload.message.toLowerCase() ===
          "MUTE_UNMUTE_PARTICIPANT".toLowerCase()
        ) {
          if (data.payload.isForAll) {
            // Dispatch to globally mute/unmute participants
            // dispatch(setVoiceControleGuest(true));
            console.log("data formute", data);
            dispatch(
              setVoiceControleGuestForAllbyHost(true, data.payload.isMuted),
            );
          } else {
            // // Handle additional logic for individual mute/unmute, if needed
            // dispatch(muteUnMuteByHost(data.payload));

            dispatch(muteUnMuteParticipantsorGuestbyHost(true));
            dispatch(muteUnMuteParticipantsorGuest(data.payload));
          }

          console.log(data.payload, "guestDataGuestData");
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_VIDEO_JOIN_REQUEST_REJECTED".toLowerCase()
        ) {
          sessionStorage.removeItem("isWaiting");
          // Denied: guest never joined, so refresh must not call leave API
          sessionStorage.removeItem("hasJoined");
          dispatch(guestVideoNavigationScreen(3));
        } else if (
          data.payload.message.toLowerCase() ===
          "HIDE_UNHIDE_PARTICIPANT_VIDEO".toLowerCase()
        ) {
          dispatch(hideUnHideVideoByHost(data.payload));
          console.log(data.payload, "guestDataGuestDataVideo");
        }
        // below MQTT is imagined will replace this soon
        else if (
          data.payload.message.toLowerCase() ===
          "HOST_END_VIDEO_CALL_MEETING".toLowerCase()
        ) {
          dispatch(guestVideoNavigationScreen(4));
          console.log(data.payload, "guestDataGuestData");
        } else if (
          data.payload.message.toLowerCase() ===
          "PARTICIPANT_RAISE_UNRAISE_HAND".toLowerCase()
        ) {
          dispatch(raisedUnRaisedParticipantsGuest(data.payload));
          console.log(data.payload, "guestDataGuestData");
        } else if (
          data.payload.message.toLowerCase() ===
          "HIDE_UNHIDE_VIDEO_BY_PARTICIPANT".toLowerCase()
        ) {
          dispatch(hideUnHideVideoParticipantsorGuest(data.payload));
          console.log(data.payload, "guestDataGuestData");
        } else if (
          data.payload.message.toLowerCase() ===
          "MUTE_UNMUTE_AUDIO_BY_PARTICIPANT".toLowerCase()
        ) {
          // dispatch(participanMuteUnMuteMeeting(data.payload, false));
          dispatch(muteUnMuteParticipantsorGuest(data.payload));
          console.log(data.payload, "guestDataGuestData");
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_NEW_PARTICIPANTS_JOINED".toLowerCase()
        ) {
          console.log(data, "JOINEDJOINEDJOINED");
          console.log(getAllParticipantGuest, "JOINEDJOINEDJOINED");
          // Append every participant in the batch, not just the first
          dispatch(
            getVideoCallParticipantGuestSuccess(
              data.payload.newParticipants,
              "",
              2,
            ),
          );
        } else if (
          data.payload.message.toLowerCase() ===
          "PRESENTATION_NEW_PARTICIPANTS_JOINED".toLowerCase()
        ) {
          // Presenter admitted more people: append them to the guest's roster (same guid is replaced, not duplicated)
          dispatch(
            getVideoCallParticipantGuestSuccess(
              data.payload.newParticipants,
              "",
              2,
            ),
          );
        } else if (
          data.payload.message.toLowerCase() ===
          "PRESENTATION_PARTICIPANT_JOINED".toLowerCase()
        ) {
          // Single-participant version of the same event
          dispatch(
            getVideoCallParticipantGuestSuccess(
              data.payload.newParticipant,
              "",
              2,
            ),
          );
        } else if (
          data.payload.message.toLowerCase() ===
          "PRESENTATION_PARTICIPANT_LEFT".toLowerCase()
        ) {
          // A presentation participant (user or guest) left: drop them from the guest's roster by guid
          dispatch(
            getVideoCallParticipantGuestSuccess(data.payload.uid, "", 3),
          );
        } else if (
          data.payload.message.toLowerCase() ===
          "PARTICIPANT_REMOVED_FROM_PRESENTATION".toLowerCase()
        ) {
          // Presenter removed someone: backend sends their guid in removedUID
          dispatch(
            getVideoCallParticipantGuestSuccess(
              data.payload.removedUID ??
                data.payload.guid ??
                data.payload.UID ??
                data.payload.uid,
              "",
              3,
            ),
          );
        } else if (
          data.payload.message.toLowerCase() ===
          "PARTICIPANT_REMOVED_FROM_MEETING".toLowerCase()
        ) {
          console.log(data, "JOINEDJOINEDJOINED");
          console.log(getAllParticipantGuest, "JOINEDJOINEDJOINED");
          dispatch(
            getVideoCallParticipantGuestSuccess(data.payload.removedUID, "", 3),
          );
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_VIDEO_END_FOR_GUEST".toLowerCase()
        ) {
          let guestName = sessionStorage.getItem("guestName");
          let roomId = sessionStorage.getItem("roomId");
          let GuestUserID = sessionStorage.getItem("GuestUserID");
          let data = {
            RoomID: String(roomId),
            UID: String(GuestUserID),
            Name: String(guestName),
            MeetingID: MeetingId,
          };
          sessionStorage.setItem("isLeftCheck", true);
          await dispatch(guestLeaveMeetingVideoApi(navigate, t, data));
        } else if (
          data.payload.message.toLowerCase() ===
          "EMPTY_SESSION_FOR_GUEST".toLowerCase()
        ) {
          // Only a guest inside the call leaves; the header runs the normal leave
          if (guestScreenRef.current === 2) {
            dispatch(guestEmptySession(true));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_PARTICIPANT_LEFT".toLowerCase()
        ) {
          console.log(data.payload, "JOINEDJOINEDJOINED");
          console.log(getAllParticipantGuest, "JOINEDJOINEDJOINED");
          dispatch(
            getVideoCallParticipantGuestSuccess(data.payload.uid, "", 3),
          );
        } else if (
          data.payload.message.toLowerCase() ===
          "AUTO_TRANSFER_HOST_TO_PARTICIPANT_NOTIFY".toLowerCase()
        ) {
          // Host left: show "(Host)" next to the new host in the guest's list
          const newHost = data.payload.newHost;
          if (newHost?.guid) {
            dispatch(setGuestVideoHostByGuid(newHost.guid));
            // Rejoin after leaving must send the current host's email, not the first host's
            dispatch(guestHostEmailUpdated(newHost.email));
            sessionStorage.setItem(
              "currentmeetingHost",
              JSON.stringify([{ guid: newHost.guid, userID: newHost.userID }]),
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "src/components/layout/talk/GuestVideo/GuestVideoCall/GuestVideoCall.js:",
        error,
      );
    }
  };

  useEffect(() => {
    if (guestClient !== null) {
      console.log(
        guestClient,
        "guestVideoClientguestVideoClientguestVideoClient",
      );
      // Reconnect is handled by mqttConnectionGuestUser's own onConnectionLost
      // (3s delay); overriding it here reconnected immediately.
      guestClient.onMessageArrived = onMessageArrived;
    } else {
      console.log(guestUserId, "guestUserIdguestUserId");
    }
  }, [guestClient, guestUserId]);

  // useEffect(() => {
  //   if (viewState !== null && viewState !== 0) {
  //     dispatch(guestVideoNavigationScreen(Number(viewState)));
  //   } else {
  //     sessionStorage.setItem("viewState", 1);
  //     dispatch(guestVideoNavigationScreen(1));
  //   }
  // }, []);

  // get the String from API
  useEffect(() => {
    const extractActionFromCurrentUrl = () => {
      const url = window.location.href; // Get the current full URL
      const action = extractActionFromUrl(url); // Use the utility function to extract the action value
      setActionValue(action);
    };
    extractActionFromCurrentUrl();
    // Optionally, you can listen for URL hash changes if needed
    window.addEventListener("hashchange", extractActionFromCurrentUrl, false);
    // Cleanup event listener
    return () => {
      window.removeEventListener(
        "hashchange",
        extractActionFromCurrentUrl,
        false,
      );
    };
  }, []);

  // Api Hit Validate Encrypted Guest Video
  useEffect(() => {
    if (actionValue) {
      let data = {
        EncryptedString: actionValue,
      };
      dispatch(validateEncryptGuestVideoMainApi(navigate, t, data));
    }
    // if (validateData !== null && validateData !== undefined) {
    //   setExtractMeetingId(validateData.meetingId);
    //   setExtractMeetingTitle(validateData.meetingTitle);
    // } else {
    //   setExtractMeetingId(0);
    //   setExtractMeetingTitle("");
    // }
  }, [actionValue]);

  useEffect(() => {
    const isPageRefresh =
      window.performance &&
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    // Stored as a string: "false" is truthy, so compare explicitly
    const hasJoined = sessionStorage.getItem("hasJoined") === "true";

    if (isPageRefresh && hasJoined && validateData) {
      const getGuestUid = sessionStorage.getItem("GuestUserID");
      const getMeetingId = sessionStorage.getItem("MeetingId");
      const getGuestName = sessionStorage.getItem("guestName");
      const getRoomId = sessionStorage.getItem("roomID");
      console.log(getRoomId, "getRoomIdgetRoomId");

      const data = {
        RoomID: String(getRoomId),
        UID: String(getGuestUid),
        Name: String(getGuestName),
        MeetingID: Number(getMeetingId),
      };

      if (sessionStorage.getItem("guestInPresentation") === "true") {
        // Refreshed inside a presentation: leave it with LeavePresenterView (room is the presentation room saved at approval)
        dispatch(
          leavePresenterViewGuestMainApi(
            navigate,
            t,
            {
              RoomID: String(sessionStorage.getItem("roomId") || getRoomId),
              UserGUID: String(getGuestUid),
              Name: String(getGuestName),
            },
            getGuestMeetingLeaveData(),
          ),
        );
      } else {
        dispatch(guestLeaveMeetingVideoApi(navigate, t, data));
      }
      sessionStorage.removeItem("hasJoined");
    }
  }, [validateData]);

  // Tab/window close (and refresh): the page is unloading, so a normal axios
  // call would be cancelled. Send the leave request with fetch `keepalive`.
  // `hasJoined` is cleared right after, so the post-reload leave above (and a
  // second pagehide) doesn't hit the API twice.
  useEffect(() => {
    const onPageHide = () => {
      if (sessionStorage.getItem("hasJoined") !== "true") return;
      try {
        const inPresentation =
          sessionStorage.getItem("guestInPresentation") === "true";
        const roomID = String(
          sessionStorage.getItem("roomId") || sessionStorage.getItem("roomID"),
        );
        // Still waiting for the presenter (lobby screen, presentation request sent, not admitted): leave the waiting room
        const waitingLeaveData =
          inPresentation && guestScreenRef.current === 1
            ? getGuestPresentationWaitingLeaveData()
            : null;
        // LeaveGuestPresenterView takes only RoomID, UserGUID and Name; GuestLeaveMeetingVideo keeps its own payload
        const data = waitingLeaveData
          ? waitingLeaveData
          : inPresentation
            ? {
                RoomID: roomID,
                UserGUID: String(sessionStorage.getItem("GuestUserID")),
                Name: String(sessionStorage.getItem("guestName")),
              }
            : {
                RoomID: roomID,
                UID: String(sessionStorage.getItem("GuestUserID")),
                Name: String(sessionStorage.getItem("guestName")),
                MeetingID: Number(sessionStorage.getItem("MeetingId")),
              };
        const form = new FormData();
        form.append(
          "RequestMethod",
          waitingLeaveData
            ? guestLeavePresentationWaitingRoom.RequestMethod
            : inPresentation
              ? leaveGuestPresenterView.RequestMethod
              : guestLeaveMeetingVideo.RequestMethod,
        );
        form.append("RequestData", JSON.stringify(data));
        fetch(meetingApi, { method: "POST", body: form, keepalive: true });
        // Guest who came from the meeting video: leave the meeting video right after the presentation
        const meetingLeaveData = inPresentation
          ? getGuestMeetingLeaveData()
          : null;
        if (meetingLeaveData) {
          const meetingForm = new FormData();
          meetingForm.append(
            "RequestMethod",
            guestLeaveMeetingVideo.RequestMethod,
          );
          meetingForm.append("RequestData", JSON.stringify(meetingLeaveData));
          fetch(meetingApi, {
            method: "POST",
            body: meetingForm,
            keepalive: true,
          });
          sessionStorage.removeItem("guestPresentationFromVideo");
        }
        sessionStorage.removeItem("hasJoined");
      } catch (error) {
        console.error(
          "src/components/layout/talk/GuestVideo/GuestVideoCall/GuestVideoCall.js:",
          error,
        );
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  useEffect(() => {
    if (validateData !== null && validateData !== undefined) {
      setExtractMeetingId(validateData.meetingId);
      setExtractMeetingTitle(validateData.meetingTitle);
    } else {
      setExtractMeetingId(0);
      setExtractMeetingTitle("");
    }
  }, [validateData]);

  useEffect(() => {
    if (location.pathname.includes("GuestVideoCall")) {
      document.body.classList.add("guest-video-call");
    } else {
      document.body.classList.remove("guest-video-call");
    }
    return () => {
      document.body.classList.remove("guest-video-call");
    };
  }, [location]);

  return (
    <>
      {/* <GuestVideoHeader /> */}
      {SnackBar}

      {guestVideoNavigationData === 4 ? (
        <>
          <div className='Main-Guest-Video'>
            <GuestVideoEnded />
          </div>
        </>
      ) : guestVideoNavigationData === 1 ? (
        <>
          <div className='Main-Guest-Video'>
            <GuestJoinVideo
              extractMeetingId={extractMeetingId}
              extractMeetingTitle={extractMeetingTitle}
              onJoinNameChange={onJoinNameChange}
              autoJoinPresentationSignal={autoJoinSignal}
            />
          </div>
        </>
      ) : guestVideoNavigationData === 2 ? (
        <>
          {/* key: moving from meeting video into a presentation remounts the header so mic/camera state and participants reload */}
          <GuestVideoScreen
            key={`${roomId}-${callSessionKey}`}
            videoUrlName={videoUrl}
            roomId={roomId}
          />
        </>
      ) : guestVideoNavigationData === 3 ? (
        <>
          <div className='Main-Guest-Video'>
            <GuestVideoReject />
          </div>
        </>
      ) : guestVideoNavigationData === 5 ? (
        <>
          <div className='Main-Guest-Video'>
            <GuestRemoveByHost />
          </div>
        </>
      ) : guestVideoNavigationData === 6 ? (
          <VideoCallNotStarteded />
      ) : guestVideoNavigationData === 7 ? (
        <VideoCallNotPublishedYet />
      ) : guestVideoNavigationData === 8 ? (
        <div className='Main-Guest-Video'>
          <GuestPresentationEnded />
        </div>
      ) : guestVideoNavigationData === 9 ? (
        <div className='Main-Guest-Video'>
          <GuestVideoReject isPresentation />
        </div>
      ) : null}
    </>
  );
};

export default GuestVideoCall;
