import React, { useEffect, useState } from "react";
import Header2 from "../../components/layout/header2/Header2";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  BoardDeckValidateURLAPI,
  clearMessegesUserManagement,
} from "../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Notification } from "../../components/elements";
import { showMessage } from "../../components/elements/snack_bar/utill";

const VideoMeetingBoardDeck = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const VideoURLdata = useSelector(
    (state) => state.UserMangementReducer.videoURLData
  );

  const responseMessage = useSelector(
    (state) => state.UserMangementReducer.ResponseMessage
  );

  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const getString = currentUrl.includes("action")
    ? currentUrl.includes("action")[1]
    : "";

  //State for Link of Videos
  const [videoLink, setVideoLink] = useState(null);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  console.log(videoLink, "videoLinkvideoLinkvideoLink");

  //Calling ValidateInput String Api
  useEffect(() => {
    try {
      if (code) {
        localStorage.setItem("VideoURl", code);
        window.close();
      } else if (getString !== "") {
        console.log("Payment_actionPayment_action");
        const videoStringValue = currentUrl.split("action=")[1];
        console.log(videoStringValue, "videoStringValuevideoStringValue");
        let data = {
          EncryptedString: videoStringValue,
        };
        dispatch(BoardDeckValidateURLAPI(navigate, t, data));
      }
    } catch {}
  }, []);

  //Extracting Data from the link
  useEffect(() => {
    try {
      if (VideoURLdata !== undefined && VideoURLdata !== null) {
        setVideoLink(VideoURLdata.filePath);
      }
    } catch (error) {
      console.log(error, "errorerror");
    }
  }, [VideoURLdata]);

  //DownLoad Options Disabled
  useEffect(() => {
    if (videoLink !== null) {
      try {
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

        return () => clearInterval(interval);
      } catch (error) {}
    }
    console.log(typeof videoLink, "current videoLink");
  }, [videoLink]);

  //Response meesege
  useEffect(() => {
    if (
      responseMessage !== "" &&
      responseMessage !== t("No-data-available") &&
      responseMessage !== t("Record-available")
    ) {
      showMessage(responseMessage, "success", setOpen);
      dispatch(clearMessegesUserManagement());
    } else {
      dispatch(clearMessegesUserManagement());
    }
  }, [responseMessage]);

  return (
    <>
      <Header2 isVideo={true} />
      {videoLink !== null && (
        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-center"
          >
            <video
              id="myVideo"
              width="600"
              height="350"
              autoPlay
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            >
              <source src={videoLink} type="video/mp4" />
            </video>
          </Col>
        </Row>
      )}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default VideoMeetingBoardDeck;
