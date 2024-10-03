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
import { validateEncryptGuestVideoMainApi } from "../../../../../store/actions/Guest_Video";
import { useSelector } from "react-redux";
import Helper from "../../../../../commen/functions/history_logout";
import { mqttConnectionGuestUser } from "../../../../../commen/functions/mqttconnection_guest";

const GuestVideoCall = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let guestUserId = sessionStorage.getItem("GuestUserID");

  const validateData = useSelector(
    (state) => state.GuestVideoReducer.validateData
  );

  let guestVideoClient = Helper.guestSocket;
  const onConnectionLost = () => {
    setTimeout(mqttConnectionGuestUser(guestUserId), 3000);
  };
  const onMessageArrived = (msg) => {
    let data = JSON.parse(msg.payloadString);
    console.log(data, "datadatadata");
  };

  useEffect(() => {
    if (guestVideoClient !== null) {
      guestVideoClient.onConnectionLost = onConnectionLost;
      guestVideoClient.onMessageArrived = onMessageArrived;
    } else {
      console.log(guestUserId, "guestUserIdguestUserId");
    }
  }, [guestVideoClient, guestUserId]);

  console.log(validateData, "GuestVideoReducerGuestVideoReducer");

  // extract meeting ID state
  const [extractMeetingId, setExtractMeetingId] = useState(0);

  // extract Meeting Title
  const [extractMeetingTitle, setExtractMeetingTitle] = useState("");

  console.log(
    { extractMeetingId, extractMeetingTitle },
    "extractMeetingTitleextractMeetingTitle"
  );

  const [actionValue, setActionValue] = useState("");
  const location = useLocation();
  console.log(actionValue, "actionValueactionValueactionValue");

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

      {validateData === null ? (
        <>
          <div className="Main-Guest-Video">
            <GuestVideoEnded />
          </div>
        </>
      ) : (
        <>
          <div className="Main-Guest-Video">
            <GuestJoinVideo
              extractMeetingId={extractMeetingId}
              extractMeetingTitle={extractMeetingTitle}
            />
          </div>
          {/* <GuestVideoEnded /> */}
        </>
      )}
    </>
  );
};

export default GuestVideoCall;
