import React, { useEffect } from "react";
import Header2 from "../../components/layout/header2/Header2";
import { Col, Row } from "react-bootstrap";

const VideoMeetingBoardDeck = () => {
  useEffect(() => {
    const video = document.getElementById("myVideo");

    // Hide download option
    video.setAttribute("controlsList", "nodownload");

    // Continuously check and remove download attribute
    const interval = setInterval(() => {
      if (video.hasAttribute("controlsList")) {
        if (video.getAttribute("controlsList") !== "nodownload") {
          video.setAttribute("controlsList", "nodownload");
        }
      } else {
        video.setAttribute("controlsList", "nodownload");
      }
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);
  return (
    <>
      <Header2 isVideo={true} />
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <video
            id="myVideo"
            width="600"
            height="350"
            autoPlay
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>
        </Col>
      </Row>
    </>
  );
};

export default VideoMeetingBoardDeck;
