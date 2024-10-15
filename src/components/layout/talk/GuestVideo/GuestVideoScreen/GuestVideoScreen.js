import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../../../elements";
import GuestVideoHeader from "../GuestVideoHeader/GuestVideoHeader";
import "./GuestVideoScreen.css";

const GuestVideoScreen = ({ videoUrlName, roomId }) => {
  const frameRef = useRef(null);

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
