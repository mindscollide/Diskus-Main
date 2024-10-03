import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../../../elements";
import GuestVideoHeader from "../GuestVideoHeader/GuestVideoHeader";
import "./GuestVideoScreen.css";

const GuestVideoScreen = () => {
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
        <GuestVideoHeader extractMeetingTitle={meetingTitle} />
        <div className="new-div">
          <div
            style={{
              position: "relative",
            }}
          >
            {/* <video ref={videoRef} className="video-size" /> */}
          </div>
        </div>
      </Container>
    </>
  );
};

export default GuestVideoScreen;
