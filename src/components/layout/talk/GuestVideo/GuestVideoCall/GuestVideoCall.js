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

const GuestVideoCall = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [actionValue, setActionValue] = useState("");
  const location = useLocation();
  console.log(actionValue, "actionValueactionValueactionValue");

  useEffect(() => {
    const data = {
      EncryptedString: actionValue,
    };

    dispatch(validateEncryptGuestVideoMainApi(navigate, t, data));
    // Check if the current route contains 'GuestVideoCall'
    if (location.pathname.includes("GuestVideoCall")) {
      // Add the class to the body
      document.body.classList.add("guest-video-call");
    } else {
      // Remove the class if the route doesn't contain 'GuestVideoCall'
      document.body.classList.remove("guest-video-call");
    }
    // Cleanup on component unmount or route change
    return () => {
      document.body.classList.remove("guest-video-call");
    };
  }, [location]);

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

  return (
    <>
      {/* <GuestVideoHeader /> */}

      <div className="Main-Guest-Video flex-column">
        <GuestJoinVideo />
        <p>{actionValue}</p>

        {/* <GuestVideoEnded /> */}
      </div>
    </>
  );
};

export default GuestVideoCall;
