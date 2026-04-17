import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../../../elements";
import GuestVideoHeader from "../GuestVideoHeader/GuestVideoHeader";
import "./GuestVideoScreen.css";

/**
 * @component GuestVideoScreen
 * @description Wrapper layout component for the active guest video call screen
 * (navigation state 2). Retrieves the meeting title from
 * `GuestVideoReducer.validateData` and renders `GuestVideoHeader` inside a
 * fluid container, passing down the video iframe URL, meeting title, and room
 * ID required for the in-call control bar and participant management.
 *
 * @param {string} videoUrlName - Fully resolved URL of the third-party video
 *   provider iframe to embed in the call screen.
 * @param {string} roomId - The video room identifier forwarded to
 *   `GuestVideoHeader` for use in API calls such as mute-self and end-call.
 */
const GuestVideoScreen = ({ videoUrlName, roomId }) => {
  const frameRef = useRef(null);
  // let videoUrl = sessionStorage.getItem("videoUrl");
  // let roomId = sessionStorage.getItem("roomId");
  const validateData = useSelector(
    (state) => state.GuestVideoReducer.validateData
  );

  const [meetingTitle, setMeetingTitle] = useState("");

  useEffect(() => {
    if (validateData !== null && validateData !== undefined) {
      setMeetingTitle(validateData.meetingTitle);
    } else {
      setMeetingTitle("");
    }
  }, [validateData]);

  return (
    <>
      <Container fluid>
        <GuestVideoHeader
          videoUrlName={videoUrlName}
          extractMeetingTitle={meetingTitle}
          roomId={roomId}
        />
      </Container>
    </>
  );
};

export default GuestVideoScreen;
