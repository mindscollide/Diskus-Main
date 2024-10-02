import React, { useEffect } from "react";
import GuestJoinVideo from "../GuestJoinVideo/GuestJoinVideo";
import { useLocation } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import "./GuestVideoCall.css";
import GuestVideoHeader from "../GuestVideoHeader/GuestVideoHeader";
import GuestVideoEnded from "../GuestVideoEnded/GuestVideoEnded";

const GuestVideoCall = () => {
  const location = useLocation();

  useEffect(() => {
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

  return (
    <>
      {/* <GuestVideoHeader /> */}

      <div className="Main-Guest-Video">
        <GuestJoinVideo />
        {/* <GuestVideoEnded /> */}
      </div>
    </>
  );
};

export default GuestVideoCall;
