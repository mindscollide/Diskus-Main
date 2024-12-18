import React, { useEffect, useState } from "react";
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
  guestVideoNavigationScreen,
  hideUnHideVideoByHost,
  hideUnHideVideoParticipantsorGuest,
  hostEndVideoCallMeeting,
  muteUnMuteByHost,
  muteUnMuteParticipantsorGuest,
  raisedUnRaisedParticipantsGuest,
  setVideoCameraGuest,
  setVoiceControleGuest,
  validateEncryptGuestVideoMainApi,
} from "../../../../../store/actions/Guest_Video";
import { useSelector } from "react-redux";
import Helper from "../../../../../commen/functions/history_logout";
import { mqttConnectionGuestUser } from "../../../../../commen/functions/mqttconnection_guest";
import GuestVideoScreen from "../GuestVideoScreen/GuestVideoScreen";
import GuestVideoReject from "../GuestVideoReject/GuestVideoReject";
import { participantWaitingList } from "../../../../../store/actions/VideoFeature_actions";
import GuestRemoveByHost from "../GuestRemoveByHost/GuestRemoveByHost";

const GuestVideoCall = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  let guestUserId = sessionStorage.getItem("GuestUserID");

  const validateData = useSelector(
    (state) => state.GuestVideoReducer.validateData
  );
  const guestClient = useSelector(
    (state) => state.GuestVideoReducer.guestClient
  );
  const videoCameraGuest = useSelector(
    (state) => state.GuestVideoReducer.videoCameraGuest
  );
  const voiceControle = useSelector(
    (state) => state.GuestVideoReducer.voiceControle
  );

  const guestVideoNavigationData = useSelector(
    (state) => state.GuestVideoReducer.guestVideoNavigationData
  );
  const getAllParticipantGuest = useSelector(
    (state) => state.GuestVideoReducer.getAllParticipantGuest
  );
  // let viewState = sessionStorage.getItem("viewState");

  const [actionValue, setActionValue] = useState("");
  //video Url state
  const [videoUrl, setVideoUrl] = useState("");
  console.log(videoUrl, "videoUrlvideoUrl");
  // extract meeting ID state
  const [extractMeetingId, setExtractMeetingId] = useState(0);
  // extract Meeting Title
  const [extractMeetingTitle, setExtractMeetingTitle] = useState("");
  const [guestName, setGuestName] = useState("");
  const [roomId, setRoomId] = useState("");
  console.log(roomId, "guestName");

  function modifyUrl(url, isMute, isHideCamera, guestName) {
    let modifiedUrl = url.replace("$ParticipantFullName$", guestName);

    // Replace placeholders with actual values
    modifiedUrl = modifiedUrl.replace("$IsMute$", isMute.toString());
    modifiedUrl = modifiedUrl.replace(
      "$IsHideCamera$",
      isHideCamera.toString()
    );

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
        guestName
      );

      console.log(modifiedUrl, "updatedUrlupdatedUrlupdatedUrl");
      setVideoUrl(modifiedUrl); // Update the video URL with the actual name
    }
  }, [videoUrl, guestName, voiceControle, videoCameraGuest]);

  const onJoinNameChange = (name) => {
    setGuestName(name);
  };

  const onConnectionLost = () => {
    setTimeout(mqttConnectionGuestUser(guestUserId, dispatch), 3000);
  };

  const onMessageArrived = (msg) => {
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
            setVideoUrl(data.payload.videoUrl);
            setRoomId(data.payload.roomID);
            sessionStorage.setItem("roomId", data.payload.roomID);
            dispatch(guestVideoNavigationScreen(2));
          } else {
            dispatch(guestVideoNavigationScreen(3));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "REMOVED_FROM_MEETING".toLowerCase()
        ) {
          dispatch(setVideoCameraGuest(false));
          dispatch(setVoiceControleGuest(false));
          dispatch(guestVideoNavigationScreen(5));
        } else if (
          data.payload.message.toLowerCase() ===
          "MUTE_UNMUTE_PARTICIPANT".toLowerCase()
        ) {
          if (data.payload.isForAll) {
            // Dispatch to globally mute/unmute participants
            dispatch(setVoiceControleGuest(true));
          } else {
            // // Handle additional logic for individual mute/unmute, if needed
            // dispatch(muteUnMuteByHost(data.payload));
            dispatch(muteUnMuteParticipantsorGuest(data.payload));
          }

          console.log(data.payload, "guestDataGuestData");
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_VIDEO_JOIN_REQUEST_REJECTED".toLowerCase()
        ) {
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
          dispatch(muteUnMuteParticipantsorGuest(data.payload));
          console.log(data.payload, "guestDataGuestData");
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_NEW_PARTICIPANTS_JOINED".toLowerCase()
        ) {
          console.log(data, "JOINEDJOINEDJOINED");
          console.log(getAllParticipantGuest, "JOINEDJOINEDJOINED");
          dispatch(
            getVideoCallParticipantGuestSuccess(
              data.payload.newParticipants[0],
              "",
              2
            )
          );
        }else if (
          data.payload.message.toLowerCase() ===
          "PARTICIPANT_REMOVED_FROM_MEETING".toLowerCase()
        ) {
          console.log(data, "JOINEDJOINEDJOINED");
          console.log(getAllParticipantGuest, "JOINEDJOINEDJOINED");
          dispatch(
            getVideoCallParticipantGuestSuccess(
              data.payload.removedUID,
              "",
              3
            )
          );
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (guestClient !== null) {
      console.log(
        guestClient,
        "guestVideoClientguestVideoClientguestVideoClient"
      );
      guestClient.onConnectionLost = onConnectionLost;
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
        false
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

      {guestVideoNavigationData === 4 ? (
        <>
          <div className="Main-Guest-Video">
            <GuestVideoEnded />
          </div>
        </>
      ) : guestVideoNavigationData === 1 ? (
        <>
          <div className="Main-Guest-Video">
            <GuestJoinVideo
              extractMeetingId={extractMeetingId}
              extractMeetingTitle={extractMeetingTitle}
              onJoinNameChange={onJoinNameChange}
            />
          </div>
        </>
      ) : guestVideoNavigationData === 2 ? (
        <>
          <GuestVideoScreen videoUrlName={videoUrl} roomId={roomId} />
        </>
      ) : guestVideoNavigationData === 3 ? (
        <>
          <div className="Main-Guest-Video">
            <GuestVideoReject />
          </div>
        </>
      ) : guestVideoNavigationData === 5 ? (
        <>
          <div className="Main-Guest-Video">
            <GuestRemoveByHost />
          </div>
        </>
      ) : null}
    </>
  );
};

export default GuestVideoCall;
