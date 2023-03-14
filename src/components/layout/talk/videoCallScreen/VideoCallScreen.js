import React, { useState } from "react";
import "./VideoCallScreen.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Dash, X, ArrowsAngleExpand } from "react-bootstrap-icons";
import { TextField, Button } from "../../../../components/elements";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideoIncoming from "../../../../container/videoIncoming/VideoIncoming";
import { VideoOutgoing } from "../../../../container/videoOutgoing/VideoOutgoing";
import { VideoMultiple } from "../../../../container/videoMultiple/VideoMultiple";
import { VideoMultipleScreens } from "../../../../container/videoMultipleScreens/VideoScreens";

// import { TextField, Button } from "../../components/elements";
import MicVideo from "../../../../assets/images/newElements/micVideo.png";
import VideoCallIcon from "../../../../assets/images/newElements/VideoIconExpand.png";
import CallEndIcon from "../../../../assets/images/newElements/CallEndVideoIcon.png";
import MinimizeVideoIcon from "../../../../assets/images/newElements/MinimizeVideoIcon.png";
import MinimizeMicIcon from "../../../../assets/images/newElements/MinimizeMicIcon.png";
import MinimizeCallIcon from "../../../../assets/images/newElements/MinimizeIconCallIcon.png";
import MinimizeExpandIcon from "../../../../assets/images/newElements/MinimizeExpandIcon.png";
import MinimizeCloseIcon from "../../../../assets/images/newElements/minimizeCloseIcon.png";

import videoChatIcon from "../../../../assets/images/newElements/videolowopacity.svg";
import videoMikeIcon from "../../../../assets/images/newElements/miclowopacity.svg";
import videoScreenIcon from "../../../../assets/images/newElements/videoChatScreenIcon.svg";
import videoPalmIcon from "../../../../assets/images/newElements/handlowopacity.svg";
import videoNotesIcon from "../../../../assets/images/newElements/videoChatNoteIcon.svg";
import videoHamburgerIcon from "../../../../assets/images/newElements/videoChatHamburgerIcon.svg";
import videoEndIcon from "../../../../assets/images/newElements/videoChatCallCutIcon.svg";

import ExpandIcon from "../../../../assets/images/newElements/ExpandColorfullIcon.png";
import MinimizeIcon from "../../../../assets/images/newElements/MinimizeIcon.png";

import ChatIconVideo from "../../../../assets/images/newElements/ChatIcon-Video.svg";
import NoteOne from "../../../../assets/images/newElements/noteopacityfullscreen.svg";
import NoteTwo from "../../../../assets/images/newElements/note-2-lowopacity.svg";
import SecurityIconMessasgeBox from "../../../../assets/images/SecurityIcon-MessasgeBox.png";
import ChatSendIcon from "../../../../assets/images/Chat-Send-Icon.png";
import CustomUploadChat from "../../../elements/chat_upload/Chat-Upload";
import SearchIcon from "../../../../assets/images/Search-Icon.png";
import GroupIcon from "../../../../assets/images/newElements/Peoplegroup.png";
import EmojiIcon from "../../../../assets/images/Emoji-Select-Icon.png";
import ChatPlus from "../../../../assets/images/newElements/chatPlus.png";
import SendIcon from "../../../../assets/images/newElements/sendIcon.png";
import videoAvatar from "../../../../assets/images/newElements/VideoAvatar.png";
import videoEndIcons from "../../../../assets/images/newElements/VideoEndIcon.png";
import videoAttendIcon from "../../../../assets/images/newElements/VideoAttendIcon.png";

import MultipleAvatar1 from "../../../../assets/images/newElements/MultipleVideoAvatar-1.png";
import MultipleAvatar2 from "../../../../assets/images/newElements/MultipleVideoAvatar-2.png";
import MultipleAvatar3 from "../../../../assets/images/newElements/MultipleVideoAvatar-3.png";

import Avatar2 from "../../../../assets/images/newElements/Avatar2.png";
import {
  setMaximizeVideoCallBox,
  setMinimizeVideoCallBox,
  setOpenVideoCallBox,
  setCloseVideoCallBox,
  setVideoIncomingCall,
} from "../../../../store/actions/VideoCalling_actions";
// import { Collapse, TextField } from "@material-ui/core";
// import videoAvatar from "../../assets/images/newElements/VideoAvatar.png";
// import videoAttendIcon from "../../assets/images/newElements/VideoAttendIcon.png";

const VideoCallScreen = () =>
  //   {
  //   // closeButtonVideoCallFunc,
  //   openVideoScreen,
  //   setOpenVideoScreen,
  // }
  {
    const navigate = useNavigate();

    const { videoCall } = useSelector((state) => state);
    const [visible, setVisible] = useState(true);
    const [maximumScreenHeight, setMaximumScreenHeight] = useState(false);
    const [isvideoScreen, setIsVideoScreen] = useState(true);

    // for open chat div
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAgendaOpen, setIsAgendaOpen] = useState(false);
    const [isMinuteOpen, setIsMinuteOpen] = useState(false);

    const dispatch = useDispatch();
    const closeVideoHandlerOfCall = (flag) => {
      console.log("closeButtonVideoCallFunc");
      dispatch(setOpenVideoCallBox(flag));
    };
    console.log("closeButtonVideoCallFunc", videoCall.openVideoCall);

    const maximizeScreen = (flag) => {
      console.log("clicked");
      dispatch(setMaximizeVideoCallBox(!videoCall.maximizeVideoCall));
      dispatch(setMinimizeVideoCallBox(false));
      setIsChatOpen(false);
      setIsAgendaOpen(false);
      setIsMinuteOpen(false);
    };
    const minimizeScreen = (flag) => {
      console.log("minimizeScreen");
      dispatch(setMinimizeVideoCallBox(!videoCall.minmizeVideoCall));
      dispatch(setMaximizeVideoCallBox(false));
    };
    // console.log("minimizeScreen", videoCall);

    const onClickVideoChatHandler = async () => {
      setIsChatOpen(true);
      isAgendaOpen(false);
    };

    //for close Chat
    const onClickCloseChatHandler = async () => {
      if (isChatOpen === false) {
        setIsChatOpen(true);
      } else {
        setIsChatOpen(false);
      }
    };

    //for note onClose
    const onClickCloseAgendaHandler = async () => {
      setIsAgendaOpen(false);
    };

    //for close minutes
    const onClickCloseMinutesHandler = async () => {
      setIsMinuteOpen(false);
    };

    //for open note agenda
    const onClickNoteIconHandler = async () => {
      if (isAgendaOpen === false) {
        setIsAgendaOpen(true);
      } else {
        setIsAgendaOpen(false);
      }
    };

    //for open minutesmeeting
    const onClickMinutesHandler = async () => {
      if (isMinuteOpen === false) {
        setIsMinuteOpen(true);
      } else {
        setIsMinuteOpen(false);
      }
    };

    const navigateToVideoIncoming = () => {
      navigate("/Diskus/VideoIncoming");
    };

    const videoIncomingCallHandler = (flag) => {
      dispatch(setVideoIncomingCall(flag));
    };

    const [imageIncomingCall, setImageIncomingCall] = useState(false);

    const videoCallingIncominCall = () => {
      if (imageIncomingCall === false) {
        setImageIncomingCall(true);
      } else {
        setImageIncomingCall(false);
      }
    };

    const [outgoingCall, setOutgoingCall] = useState(false);

    const videoCallingOutgoingCall = () => {
      if (outgoingCall === false) {
        setOutgoingCall(true);
      } else {
        setOutgoingCall(false);
      }
    };

    const [multipleScreen, setMultipltScreen] = useState(false);
    const videoMultipleScreen = () => {
      if (multipleScreen === false) {
        setMultipltScreen(true);
      } else {
        setMultipltScreen(false);
      }
    };

    return (
      <Row>
        <Col
          sm={12}
          md={11}
          lg={11}
          className={
            videoCall.maximizeVideoCall
              ? "videoCallScreen-maximizeVideoCall"
              : videoCall.minmizeVideoCall
              ? "videoCallScreen-minmizeVideoCall"
              : "videoCallScreen"
          }
        >
          {/* {isvideoScreen === true ? ( */}
          <>
            <Row className="mt-3">
              <Col lg={3} md={3} sm={3}>
                <p className="title-heading">IT Departmental Meeting</p>
              </Col>

              {videoCall.minmizeVideoCall === true ? (
                <>
                  <Col lg={2} md={2} sm={2}>
                    <img src={MinimizeVideoIcon} width={25} />
                  </Col>
                  <Col lg={2} md={2} sm={2}>
                    <img
                      src={MinimizeMicIcon}
                      width={15}
                      className="minimize-mic-icon"
                    />
                  </Col>

                  <Col lg={2} md={2} sm={2}>
                    <img
                      src={MinimizeCallIcon}
                      width={28}
                      className="minimize-call-icon"
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col lg={2} md={2} sm={2}>
                    <img
                      src={VideoCallIcon}
                      width={25}
                      className="video-image"
                    />
                  </Col>
                  <Col lg={2} md={2} sm={2}>
                    <img src={MicVideo} width={18} className="mic-image" />
                  </Col>

                  <Col lg={2} md={2} sm={2}>
                    <img src={CallEndIcon} width={30} className="call-image" />
                  </Col>
                </>
              )}

              {/* <Col lg={1} md={1} sm={1}></Col> */}
              {videoCall.minmizeVideoCall === true ? (
                <Col></Col>
              ) : (
                <Col lg={1} md={1} sm={1}>
                  <img
                    width={20}
                    src={MinimizeIcon}
                    className="minimize-icon"
                    onClick={() => minimizeScreen(true)}
                  />
                </Col>
              )}

              {videoCall.minmizeVideoCall === true ? (
                <Col lg={1} md={1} sm={1}>
                  <img
                    width={15}
                    src={MinimizeExpandIcon}
                    className="minimize-expand-icon"
                    onClick={() => maximizeScreen(true)}
                  />
                </Col>
              ) : (
                <Col lg={1} md={1} sm={1}>
                  <img
                    width={17}
                    src={ExpandIcon}
                    className="expand-icon-maximize"
                    onClick={() => maximizeScreen(true)}
                  />
                </Col>
              )}

              {videoCall.minmizeVideoCall === true ? (
                <Col lg={1} md={1} sm={1}>
                  <img
                    width={15}
                    src={MinimizeCloseIcon}
                    className="minimize-close-icon"
                    onClick={() => closeVideoHandlerOfCall(false)}
                  />
                </Col>
              ) : (
                <Col lg={1} md={1} sm={1}>
                  <X
                    width={40}
                    onClick={() => closeVideoHandlerOfCall(false)}
                    className={"close-icon-maximize"}
                  />
                </Col>
              )}
            </Row>

            {imageIncomingCall === true ? (
              // <img
              //   src={Avatar2}
              //   width={1200}
              //   height={420}
              //   className="full-screen-image"
              // />

              <div className="image-video-calling-click">
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <img
                      src={videoAvatar}
                      className="image-video-calling-inside-image"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="someone-calling-title"
                  >
                    <p className="outgoing-call-text">Some One Calling</p>
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col sm={12} md={12} lg={12} className="calling-title">
                    <p className="calling-text">Calling...</p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    sm={6}
                    md={6}
                    lg={6}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      className="button-img"
                      icon={
                        <>
                          <img src={videoEndIcons} width={50} />
                        </>
                      }
                    ></Button>
                  </Col>

                  <Col
                    sm={6}
                    md={6}
                    lg={6}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      className="button-img"
                      icon={
                        <>
                          <img src={videoAttendIcon} width={50} />
                        </>
                      }
                    ></Button>
                  </Col>
                </Row>
              </div>
            ) : outgoingCall === true ? (
              <div className="image-video-calling-click">
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <img
                      src={videoAvatar}
                      className="image-video-calling-inside-image"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="someone-calling-title"
                  >
                    <p className="outgoing-call-text">Talha Qamar</p>
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col sm={12} md={12} lg={12} className="calling-title">
                    <p className="calling-text">Ringing...</p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className="button-img"
                      icon={
                        <>
                          <img src={videoEndIcons} width={50} />
                        </>
                      }
                    ></Button>
                  </Col>
                </Row>
              </div>
            ) : multipleScreen === true ? (
              <>
                <Container className="multiple-screens">
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="multiple-video-It-Title">
                        IT Departmental Meeting
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="multiple-video-waiting-title">
                        Waiting for the host to Start this meeting
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="multiple-host-title">Host</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={12} lg={12} className="avatar-column">
                      <img src={videoAvatar} width={150} />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={12} lg={12} className="outgoing-title">
                      <p className="Participants-text">Participants</p>
                    </Col>
                  </Row>

                  <div className="bottom-images-width">
                    <Row>
                      <Col lg={1} md={1} sm={1} />
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar1} width={80} />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img
                          src={videoAvatar}
                          width={80}
                          // onClick={micModalOpenHandler}
                        />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar2} width={80} />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar1} width={80} />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar3} width={80} />
                      </Col>
                      <Col lg={1} md={1} sm={1} />
                    </Row>
                  </div>
                </Container>
              </>
            ) : (
              <Row className="mt-2">
                {videoCall.maximizeVideoCall === true ? (
                  <>
                    <Col lg={8} md={8} sm={8}>
                      <img
                        src={Avatar2}
                        width={750}
                        height={420}
                        className="full-screen-image"
                      />
                    </Col>
                    <Col lg={2} md={2} sm={2}>
                      <img
                        src={Avatar2}
                        width={350}
                        height={200}
                        className="full-screen-image-2"
                      />
                    </Col>
                  </>
                ) : videoCall.openIncomingCall ? (
                  <VideoIncoming />
                ) : (
                  <>
                    <Col lg={5} md={5} sm={5}>
                      <img src={Avatar2} width={570} height={240} />
                    </Col>
                    <Col lg={5} md={5} sm={5}>
                      <img
                        src={Avatar2}
                        width={570}
                        height={240}
                        className="image-width-class"
                      />
                    </Col>
                  </>
                )}

                {videoCall.maximizeVideoCall === true ? (
                  <>
                    <Col lg={2} md={2} sm={2} className="mt-4">
                      <img
                        src={ChatIconVideo}
                        className="fullscreen-chat-icon"
                        size={10}
                        onClick={onClickCloseChatHandler}
                      />

                      <img
                        src={NoteOne}
                        className="fullscreen-note-icon"
                        size={10}
                        onClick={onClickNoteIconHandler}
                      />

                      <img
                        src={NoteTwo}
                        className="fullscreen-todo-icon"
                        size={10}
                        onClick={onClickMinutesHandler}
                      />
                    </Col>
                  </>
                ) : (
                  <>
                    <Col lg={2} md={2} sm={2} className="mt-4">
                      <img
                        src={ChatIconVideo}
                        className="video-side-chat-icons"
                        size={4}
                      />
                      <img
                        src={NoteOne}
                        className="video-side-Note-icons"
                        size={10}
                      />
                      <img
                        src={NoteTwo}
                        className="video-side-todo-icons"
                        size={10}
                      />
                    </Col>
                  </>
                )}
              </Row>
            )}

            {/* {outgoingCall === true ? (
              <div className="image-video-calling-click">
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <img
                      src={videoAvatar}
                      className="image-video-calling-inside-image"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="someone-calling-title"
                  >
                    <p className="outgoing-call-text">Talha Qamar</p>
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col sm={12} md={12} lg={12} className="calling-title">
                    <p className="calling-text">Ringing...</p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className="button-img"
                      icon={
                        <>
                          <img src={videoEndIcons} width={50} />
                        </>
                      }
                    ></Button>
                  </Col>
                </Row>
              </div>
            ) : null} */}

            {/* {multipleScreen === true ? (
              <>
                <Container className="videoOutgoing">
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="multiple-video-It-Title">
                        IT Departmental Meeting
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="multiple-video-waiting-title">
                        Waiting for the host to Start this meeting
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="multiple-host-title">Host</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={12} lg={12} className="avatar-column">
                      <img src={videoAvatar} width={150} />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={12} lg={12} className="outgoing-title">
                      <p className="Participants-text">Participants</p>
                    </Col>
                  </Row>

                  <div className="bottom-images-width">
                    <Row className="mt-5">
                      <Col lg={1} md={1} sm={1} />
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar1} width={100} />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img
                          src={videoAvatar}
                          width={100}
                          onClick={micModalOpenHandler}
                        />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar2} width={100} />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar1} width={100} />
                      </Col>
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className="d-flex justify-content-center"
                      >
                        <img src={MultipleAvatar3} width={100} />
                      </Col>
                      <Col lg={1} md={1} sm={1} />
                    </Row>
                  </div>
                </Container>
              </>
            ) : null} */}

            {videoCall.maximizeVideoCall === true ? (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="full-screen-bottom-images"
                >
                  <img onClick={videoCallingIncominCall} src={videoChatIcon} />
                  <img src={videoMikeIcon} onClick={videoCallingOutgoingCall} />
                  <img src={videoScreenIcon} onClick={videoMultipleScreen} />
                  <img src={videoPalmIcon} />
                  <img src={videoNotesIcon} />
                  <img
                    src={videoHamburgerIcon}
                    className="image-hamburger-opacity"
                  />
                  <img src={videoEndIcon} />
                </Col>
              </Row>
            ) : null}

            {videoCall.maximizeVideoCall === true ? (
              <>
                {isChatOpen === true ? (
                  <>
                    <div className={"chat-messenger-IsOpen"}>
                      <Container>
                        <Row className="mt-3">
                          <Col lg={2} md={2} sm={2}>
                            <img
                              src={GroupIcon}
                              className="video-chat-group-icon"
                            />
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <p className="video-chat-It-Heading">
                              IT Departmental Meeting
                            </p>
                          </Col>
                          <Col lg={1} md={1} sm={1}>
                            <img
                              src={SecurityIconMessasgeBox}
                              style={{ width: "17px" }}
                            />
                          </Col>
                          <Col lg={1} md={1} sm={1}>
                            <img src={SearchIcon} style={{ width: "17px" }} />
                          </Col>
                          <Col lg={1} md={1} sm={1}>
                            <img src={MinimizeIcon} style={{ width: "17px" }} />
                          </Col>
                          <Col lg={1} md={1} sm={1}>
                            <X
                              width={20}
                              className="video-chat-icon-inside"
                              onClick={onClickCloseChatHandler}
                            />
                          </Col>
                        </Row>
                        <Row className="video-crypto-row">
                          <Col lg={12} md={12} sm={12} className="p-0">
                            <div className="encryption-videoCalling-video-chat">
                              <Row>
                                <Col lg={7} md={7} sm={12}>
                                  <p className="level-videoCalling-heading">
                                    Crypto Level:
                                  </p>
                                </Col>
                                <Col
                                  lg={5}
                                  md={5}
                                  sm={12}
                                  className="positionRelative mt-1"
                                >
                                  <p className="level">NIAP + PQC</p>

                                  <span className="securityicon-Video-box">
                                    <img
                                      src={SecurityIconMessasgeBox}
                                      style={{ width: "17px" }}
                                    />
                                  </span>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>

                        <Row className="bottom-video-chat-input-div">
                          <Col lg={2} md={2} sm={2}>
                            <img src={EmojiIcon} />
                          </Col>
                          <Col lg={2} md={2} sm={2}>
                            <img
                              src={ChatPlus}
                              className="chat-inside-video-plus-img"
                            />
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={4}
                            className="chat-video-field"
                          >
                            <Form.Control
                              className="chat-message-input"
                              placeholder={"Type a Message"}
                            />
                          </Col>
                          <Col lg={2} md={2} sm={2}></Col>
                          <Col lg={2} md={2} sm={2}>
                            <img
                              src={SendIcon}
                              className="chat-inside-video-sendIcon-img"
                            />
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  </>
                ) : isAgendaOpen === true ? (
                  <>
                    <div className="isAgenda-div-changes">
                      <Row>
                        <Col lg={10} md={10} sm={10}>
                          <p className="Agenda-title-heading">Agenda</p>
                        </Col>

                        <Col lg={2} md={2} sm={2}>
                          <X
                            width={20}
                            className="agenda-Close-icon"
                            onClick={onClickCloseAgendaHandler}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={2} md={2} sm={2}>
                          <p className="agenda-count">1</p>
                        </Col>

                        <Col lg={8} md={8} sm={8}>
                          <p className="agenda-pargraph">
                            Agenda Comes in here. It can have as much info as it
                            can hold.
                          </p>
                        </Col>
                        <Col>
                          <img
                            width={15}
                            src={ChatPlus}
                            className="agenda-plus-icon"
                          />
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col lg={2} md={2} sm={2}>
                          <p className="agenda-count">2</p>
                        </Col>

                        <Col lg={8} md={8} sm={8}>
                          <p className="agenda-pargraph">
                            Agenda Comes in here. It can have as much info as it
                            can hold.
                          </p>
                        </Col>
                        <Col>
                          <img
                            width={15}
                            src={ChatPlus}
                            className="agenda-plus-icon"
                          />
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col lg={2} md={2} sm={2}>
                          <p className="agenda-count">3</p>
                        </Col>

                        <Col lg={8} md={8} sm={8}>
                          <p className="agenda-pargraph">
                            Agenda Comes in here. It can have as much info as it
                            can hold.
                          </p>
                        </Col>
                        <Col>
                          <img
                            width={15}
                            src={ChatPlus}
                            className="agenda-plus-icon"
                          />
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col lg={2} md={2} sm={2}>
                          <p className="agenda-count">4</p>
                        </Col>

                        <Col lg={8} md={8} sm={8}>
                          <p className="agenda-pargraph">
                            Agenda Comes in here. It can have as much info as it
                            can hold.
                          </p>
                        </Col>
                        <Col>
                          <img
                            width={15}
                            src={ChatPlus}
                            className="agenda-plus-icon"
                          />
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : isMinuteOpen === true ? (
                  <>
                    <div className="isMinutes-div-changes">
                      <Row>
                        <Col lg={10} md={10} sm={10}>
                          <p className="Agenda-title-heading">
                            MEETING MINUTES
                          </p>
                        </Col>

                        <Col lg={2} md={2} sm={2}>
                          <X
                            width={20}
                            className="agenda-Close-icon"
                            onClick={onClickCloseMinutesHandler}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col lg={2} md={2} sm={2}>
                          <p className="agenda-count">1</p>
                        </Col>

                        <Col lg={9} md={9} sm={9}>
                          <p className="isMinutes-paragraph">
                            Agenda Comes in here. It can have as much info as it
                            can hold.Agenda Comes in here. It can have as much
                            info as it can hold.Agenda Comes in here. It can
                            have as much info as it can hold.
                          </p>
                        </Col>
                        <Col lg={1} md={1} sm={1} />
                      </Row>

                      <Row className="mt-3">
                        <Col lg={2} md={2} sm={2}>
                          <p className="agenda-count">2</p>
                        </Col>

                        <Col lg={9} md={9} sm={9}>
                          <p className="isMinutes-paragraph">
                            Agenda Comes in here. It can have as much info as it
                            can hold.Agenda Comes in here. It can have as much
                            info as it can hold.Agenda Comes in here. It can
                            have as much info as it can hold.
                          </p>
                        </Col>
                        <Col lg={1} md={1} sm={1} />
                      </Row>

                      <Row className="mt-3">
                        <Col lg={2} md={2} sm={2}>
                          <p className="agenda-count">3</p>
                        </Col>

                        <Col lg={9} md={9} sm={9}>
                          <p className="isMinutes-paragraph">
                            Agenda Comes in here. It can have as much info as it
                            can hold.Agenda Comes in here. It can have as much
                            info as it can hold.Agenda Comes in here. It can
                            have as much info as it can hold.
                          </p>
                        </Col>
                        <Col lg={1} md={1} sm={1} />
                      </Row>

                      <Row>
                        <Col
                          lg={10}
                          md={10}
                          sm={10}
                          className="minutes-video-field"
                        >
                          <Form.Control
                            // className="chat-message-input"
                            placeholder={"Type a Message"}
                          />
                        </Col>
                        <Col lg={2} md={2} sm={2}>
                          <img
                            src={SendIcon}
                            className="minutes-video-sendIcon"
                          />
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : null}
              </>
            ) : null}

            {/* for show multiple screens  */}

            {videoCall.maximizeScreen === true ? (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <VideoIncoming />
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        </Col>
      </Row>
    );
  };

export default VideoCallScreen;
