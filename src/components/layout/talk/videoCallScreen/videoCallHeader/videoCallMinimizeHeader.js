import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Button } from "./../../../../elements";
import videoEndIcon from "../../../../../assets/images/newElements/VideoEndIcon.png";
import { Tooltip } from "antd";
import "./videoCallHeader.css";
import {
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  minimizeParticipantPopup,
} from "../../../../../store/actions/VideoFeature_actions";
import MinimizeScreenShare from "../../../../../assets/images/newElements/MinimizeScreenShare.png";
import MinimizeParticipant from "../../../../../assets/images/newElements/MinimizeParticipants.png";
import MinimizeMicIcon from "../../../../../assets/images/newElements/MinimizeMicIcon.png";
import MinimizeExpandIcon from "../../../../../assets/images/newElements/MinimizeExpandIcon.png";
import MinimizeVideoIcon from "../../../../../assets/images/newElements/MinimizeVideoIcon.png";
import CallEndRedIcon from "../../../../../assets/images/newElements/CallRedIcon.svg";
import MinToNormalIcon from "../../../../../assets/images/newElements/Min-to-normal-Icon.svg";
import ActiveParticipantIcon from "../../../../../assets/images/Active-Participant-Icon.png";
import MicOffIcon from "../../../../../assets/images/Mic-OFF-WB.svg";
import VideoOffIcon from "../../../../../assets/images/Video-OFF-WB.svg";

import { LeaveCall } from "../../../../../store/actions/VideoMain_actions";

const VideoCallMinimizeHeader = ({ screenShareButton }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const participantPopupDisable = useRef(null);

  // state for participants
  const [currentParticipants, setCurrentParticipants] = useState([]);

  const [participantStatus, setParticipantStatus] = useState([]);

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  const [localMicStatus, setLocalMicStatus] = useState(micStatus);
  const [localVidStatus, setLocalVidStatus] = useState(vidStatus);

  let callerNameInitiate = localStorage.getItem("callerNameInitiate");
  let organizationName = localStorage.getItem("organizatioName");
  let currentUserName = localStorage.getItem("name");
  let callerName = localStorage.getItem("callerName");
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem("initiateVideoCall")
  );
  let recipentCalledID = Number(localStorage.getItem("recipentCalledID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let callerID = Number(localStorage.getItem("callerID"));
  let recipentID = Number(localStorage.getItem("recipentID"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let roomID = localStorage.getItem("acceptedRoomID");
  let callTypeID = Number(localStorage.getItem("callTypeID"));
  let initiateRoomID = localStorage.getItem("initiateCallRoomID");
  let callerObject = localStorage.getItem("callerStatusObject");
  let currentCallType = Number(localStorage.getItem("CallType"));
  let meetingTitle = localStorage.getItem("meetingTitle");

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const dispatch = useDispatch();

  const closeVideoPanel = () => {
    dispatch(leaveCallModal(false));
    localStorage.setItem("activeCall", false);
  };

  const normalizePanel = () => {
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
  };

  const maximizePanel = () => {
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(true));
    dispatch(minimizeVideoPanelFlag(false));
  };

  const openVideoPanel = () => {
    dispatch(leaveCallModal(true));
    // localStorage.setItem('activeCall', false)
  };

  // this handler is for close participant

  const closeParticipantHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (videoFeatureReducer.MinimizeParticipantPopupFlag === false) {
        dispatch(minimizeParticipantPopup(true));
      } else {
        dispatch(minimizeParticipantPopup(false));
      }
    }
  };

  //when user click outside then icon will be closed
  const handleOutsideClick = (event) => {
    if (
      participantPopupDisable.current &&
      !participantPopupDisable.current.contains(event.target) &&
      videoFeatureReducer.MinimizeParticipantPopupFlag
    ) {
      dispatch(minimizeParticipantPopup(false));
    }
  };

  useEffect(() => {
    if (
      VideoMainReducer.GroupCallRecipientsData !== undefined &&
      VideoMainReducer.GroupCallRecipientsData !== null &&
      VideoMainReducer.GroupCallRecipientsData.length !== 0
    ) {
      setCurrentParticipants(VideoMainReducer.GroupCallRecipientsData);
    } else {
      setCurrentParticipants([]);
    }
  }, [VideoMainReducer.GroupCallRecipientsData]);

  // this is for leave call group API

  const minimizeEndCallParticipant = () => {
    if (isMeeting === false) {
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: roomID,
        IsCaller: false,
        CallTypeID: callTypeID,
      };
      dispatch(LeaveCall(Data, navigate, t));
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("isMeetingVideo", false);
    } else if (isMeeting === true) {
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("isMeeting", false);
      localStorage.setItem("meetingTitle", "");
      localStorage.setItem("acceptedRecipientID", 0);
      localStorage.setItem("isMeetingVideo", false);
    }
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const cancelLeaveCallOption = () => {
    dispatch(leaveCallModal(false));
  };

  const minimizeLeaveCall = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
    localStorage.setItem("isCaller", false);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    setParticipantStatus([]);
    localStorage.setItem("activeCall", false);
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    dispatch(minimizeParticipantPopup(false));
    localStorage.setItem("isMeetingVideo", false);
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const disableMic = () => {
    console.log("Disable Mic");
    localStorage.setItem("MicOff", false);
    setLocalMicStatus(false);
  };

  const enableMic = () => {
    console.log("Enable Mic");
    localStorage.setItem("MicOff", true);
    setLocalMicStatus(true);
  };

  const disableVideo = () => {
    console.log("Disable Video");
    localStorage.setItem("VidOff", false);
    setLocalVidStatus(false);
  };

  const enableVideo = () => {
    console.log("Enable Video");
    localStorage.setItem("VidOff", true);
    setLocalVidStatus(true);
  };

  useEffect(() => {}, [localMicStatus, localVidStatus]);

  useEffect(() => {
    if (callerObject !== undefined && callerObject !== null) {
      let callerObjectObj = JSON.parse(callerObject);
      setParticipantStatus((prevStatus) => [callerObjectObj, ...prevStatus]);
    }
  }, [callerObject]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [videoFeatureReducer.MinimizeParticipantPopupFlag]);

  useEffect(() => {
    setLocalMicStatus(micStatus);
    setLocalVidStatus(vidStatus);
  }, [videoFeatureReducer.MinimizeVideoFlag]);

  return (
    <>
      <div className="videoCallGroupScreen-minmizeVideoCall">
        <Row className="mt-2 mb-4">
          {(currentCallType === 2 || callTypeID === 2) &&
          meetingTitle === "" ? (
            <Col
              lg={8}
              md={8}
              sm={12}
              className="mt-1 cursor-pointer"
              onClick={() => {
                dispatch(normalizeVideoPanelFlag(true));
                dispatch(minimizeVideoPanelFlag(false));
              }}
            >
              <p className="title-heading">{t("Group-call")}</p>
            </Col>
          ) : (currentCallType === 2 || callTypeID === 2) &&
            meetingTitle !== "" ? (
            <Col
              lg={8}
              md={8}
              sm={12}
              className="mt-1 cursor-pointer"
              onClick={() => {
                dispatch(normalizeVideoPanelFlag(true));
                dispatch(minimizeVideoPanelFlag(false));
              }}
            >
              <p className="title-heading">{meetingTitle}</p>
            </Col>
          ) : (
            <Col
              lg={8}
              md={8}
              sm={12}
              className="mt-1 cursor-pointer"
              onClick={() => {
                dispatch(normalizeVideoPanelFlag(true));
                dispatch(minimizeVideoPanelFlag(false));
              }}
            >
              <p className="title-heading">
                {currentUserName !==
                  VideoMainReducer.VideoRecipentData.userName &&
                Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
                initiateVideoCallFlag === true
                  ? VideoMainReducer.VideoRecipentData.userName ||
                    VideoMainReducer.VideoRecipentData.recipients[0].userName
                  : currentUserName !==
                      VideoMainReducer.VideoRecipentData.userName &&
                    Object.keys(VideoMainReducer.VideoRecipentData).length >
                      0 &&
                    initiateVideoCallFlag === false
                  ? VideoMainReducer.VideoRecipentData.userName ||
                    VideoMainReducer.VideoRecipentData.recipients[0].userName
                  : Object.keys(VideoMainReducer.VideoRecipentData).length === 0
                  ? callerName
                  : null}
              </p>
            </Col>
          )}
          {/* <Col lg={3} md={3} sm={12} className="mt-1">
            <p className="title-heading">
              {currentUserName !==
                VideoMainReducer.VideoRecipentData.userName &&
              Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
              initiateVideoCallFlag === true
                ? VideoMainReducer.VideoRecipentData.userName
                : currentUserName !==
                    VideoMainReducer.VideoRecipentData.userName &&
                  Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
                  initiateVideoCallFlag === false
                ? callerNameInitiate
                : Object.keys(VideoMainReducer.VideoRecipentData).length === 0
                ? callerName
                : null}
            </p>
          </Col> */}
          <Col lg={4} md={4} sm={12}>
            <div className="minimize-screen-on-bottom">
              {callerID === currentUserID &&
              (callTypeID === 2 || currentCallType === 2) ? (
                <div
                  className="positionRelative minimize-Participant-Toggle"
                  ref={participantPopupDisable}
                >
                  {videoFeatureReducer.MinimizeParticipantPopupFlag === true ? (
                    <>
                      <Tooltip placement="bottomLeft" title={t("Participants")}>
                        <img
                          className={
                            videoFeatureReducer.LeaveCallModalFlag === true
                              ? "grayScaleImage"
                              : "cursor-pointer"
                          }
                          src={ActiveParticipantIcon}
                          alt="Normal Screen Participant"
                          onClick={closeParticipantHandler}
                          height={30}
                          width={30}
                        />
                      </Tooltip>
                      <div
                        className="minimize-participants-list"
                        key={Math.random()}
                      >
                        <Row className="m-0">
                          <Col className="p-0" lg={8} md={8} sm={12}>
                            <p className="participant-name">
                              {currentUserName}
                            </p>
                          </Col>
                          <Col className="p-0" lg={4} md={4} sm={12}>
                            <p className="participant-state">Host</p>
                          </Col>
                        </Row>
                        {currentParticipants !== undefined &&
                        currentParticipants !== null &&
                        currentParticipants.length > 0
                          ? currentParticipants.map(
                              (participantData, index) => {
                                console.log(
                                  "participantStatus",
                                  participantStatus[0]
                                );
                                const matchingStatus =
                                  participantStatus[0].find(
                                    (status) =>
                                      status.RecipientID ===
                                        participantData.userID &&
                                      status.RoomID === initiateRoomID
                                  );
                                return (
                                  <Row className="m-0" key={index}>
                                    <Col className="p-0" lg={8} md={8} sm={12}>
                                      <p className="participant-name">
                                        {participantData.userName}
                                      </p>
                                    </Col>
                                    <Col className="p-0" lg={4} md={4} sm={12}>
                                      <p className="participant-state">
                                        {matchingStatus
                                          ? matchingStatus.CallStatus
                                          : "Calling..."}
                                      </p>
                                    </Col>
                                  </Row>
                                );
                              }
                            )
                          : null}
                        {/* <Button
                        className="add-participant-button"
                        text="Add Participants"
                        icon={
                          <img src={AddParticipantIcon} alt="participants" />
                        }
                        textClass="text-positioning"
                      /> */}
                      </div>
                    </>
                  ) : (
                    <Tooltip placement="bottomLeft" title={t("Participants")}>
                      <img
                        className={
                          videoFeatureReducer.LeaveCallModalFlag === true
                            ? "grayScaleImage"
                            : "cursor-pointer"
                        }
                        src={MinimizeParticipant}
                        onClick={closeParticipantHandler}
                        height={20}
                        alt={"Minimize Participant"}
                        width={25}
                      />
                    </Tooltip>
                  )}
                </div>
              ) : null}

              {/* <div className="screenShare-Toggle">
                <img
                  className={
                    videoFeatureReducer.LeaveCallModalFlag === true
                      ? "grayScaleImage"
                      : ""
                  }
                  onClick={screenShareButton}
                  src={MinimizeScreenShare}
                  alt="Minimize Screen Share"
                />
              </div> */}

              {/* <img src={MinimizeParticipant} alt="Mininmize Participants" /> */}
              {/* <img src={MinimizeScreenShare} alt="Mininmize Screen Icon" /> */}
              {localVidStatus === true ? (
                <Tooltip placement="bottomLeft" title={t("Disable-video")}>
                  <img
                    src={MinimizeVideoIcon}
                    className={"minimize-video-icon cursor-pointer"}
                    alt="Minimize Video Icon"
                    onClick={disableVideo}
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="bottomLeft" title={t("Enable-video")}>
                  <img
                    src={VideoOffIcon}
                    className={"minimize-video-icon cursor-pointer"}
                    alt="Minimize Video Icon"
                    onClick={enableVideo}
                  />
                </Tooltip>
              )}
              {localMicStatus === true ? (
                <Tooltip placement="bottomLeft" title={t("Disable-mic")}>
                  <img
                    className="cursor-pointer"
                    src={MinimizeMicIcon}
                    alt="Minimize Mic Icon"
                    onClick={disableMic}
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="bottomLeft" title={t("Enable-mic")}>
                  <img
                    className="cursor-pointer"
                    src={MicOffIcon}
                    alt="Minimize Mic Icon"
                    onClick={enableMic}
                  />
                </Tooltip>
              )}
              {videoFeatureReducer.LeaveCallModalFlag === true &&
              callerID === currentUserID ? (
                <Tooltip placement="bottomLeft" title={t("Cancel")}>
                  <img
                    width={25}
                    onClick={cancelLeaveCallOption}
                    src={videoEndIcon}
                    alt="Icon Video"
                    className="cursor-pointer"
                  />
                </Tooltip>
              ) : (videoFeatureReducer.LeaveCallModalFlag === false &&
                  callerID === currentUserID) ||
                callerID === 0 ? (
                <Tooltip placement="bottomLeft" title={t("End-call")}>
                  <img
                    width={25}
                    src={CallEndRedIcon}
                    onClick={openVideoPanel}
                    alt="Icon Video"
                    className="cursor-pointer"
                  />
                </Tooltip>
              ) : videoFeatureReducer.LeaveCallModalFlag === false &&
                callerID !== currentUserID ? (
                <Tooltip placement="bottomLeft" title={t("End-call")}>
                  <img
                    width={35}
                    src={CallEndRedIcon}
                    onClick={minimizeEndCallParticipant}
                    alt="Icon Video"
                    className="cursor-pointer"
                  />
                </Tooltip>
              ) : null}
              <Tooltip placement="bottomLeft" title={t("Normalize-screen")}>
                <img
                  src={MinToNormalIcon}
                  onClick={normalizePanel}
                  className="min-to-normal-icon cursor-pointer"
                  alt="Icon Video"
                />
              </Tooltip>
              <Tooltip placement="bottomLeft" title={t("Maximize-screen")}>
                <img
                  src={MinimizeExpandIcon}
                  // className="minimize-expand-icon"
                  onClick={maximizePanel}
                  className="min-to-max-icon cursor-pointer"
                  alt="Icon Video"
                />
              </Tooltip>
            </div>

            {/* <div className="minimizeGroup-expand-icon"> */}

            {/* </div> */}
          </Col>
          {/* <Col lg={2} md={2} sm={12}> */}
          {/* <div className="minimizeGroup-expand-icon">
              <img
                src={MinToNormalIcon}
                onClick={normalizePanel}
                className="min-to-normal-icon"
                alt="Icon Video"
              />

              <img
                src={MinimizeExpandIcon}
                // className="minimize-expand-icon"
                onClick={maximizePanel}
                className="min-to-max-icon"
                alt="Icon Video"
              />
            </div> */}
          {/* </Col> */}
        </Row>
      </div>

      <div>
        {videoFeatureReducer.LeaveCallModalFlag === true ? (
          <div className="minimize-leave-meeting-options leave-meeting-options-position">
            <div className="leave-meeting-options__inner">
              <Button
                className="leave-meeting-options__btn leave-meeting-red-button"
                text={
                  currentCallType === 1
                    ? t("End-call")
                    : t("End-call-for-everyone")
                }
                onClick={minimizeLeaveCall}
              />

              <Button
                className="leave-meeting-options__btn leave-meeting-gray-button"
                text="Cancel"
                onClick={closeVideoPanel}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default VideoCallMinimizeHeader;
