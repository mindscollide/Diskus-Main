import React from "react";
import { Button } from "../../../../elements";
import GuestVideoHeader from "../GuestVideoHeader/GuestVideoHeader";
import "./GuestVideoScreen.css";

const GuestVideoScreen = () => {
  return (
    <>
      <GuestVideoHeader extractMeetingTitle={"abc"} />
      <div className="new-div">
        <div
          style={{
            position: "relative",
          }}
        >
          {/* <video ref={videoRef} className="video-size" /> */}
        </div>
      </div>
      {/* <Button text={"Close Div"} /> */}
    </>
  );
};

export default GuestVideoScreen;
