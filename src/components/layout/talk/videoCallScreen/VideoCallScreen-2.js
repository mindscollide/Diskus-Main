import React, { useEffect, useState } from "react";
import "./VideoCallScreen.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Dash, X, ArrowsAngleExpand } from "react-bootstrap-icons";
import { TextField, Button, Modal, Loader } from "../../../elements";
import { Checkbox } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";
import VideoIncoming from "../../../../container/videoIncoming/VideoIncoming";

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
import SearchIcon from "../../../../assets/images/Search-Icon.png";
import GroupIcon from "../../../../assets/images/newElements/Peoplegroup.png";
import EmojiIcon from "../../../../assets/images/Emoji-Select-Icon.png";
import ChatPlus from "../../../../assets/images/newElements/chatPlus.png";
import SendIcon from "../../../../assets/images/newElements/sendIcon.png";
import videoAvatar from "../../../../assets/images/newElements/VideoAvatar.png";
import videoEndIcons from "../../../../assets/images/newElements/VideoEndIcon.png";
import videoAttendIcon from "../../../../assets/images/newElements/VideoAttendIcon.png";
import Gmail from "../../../../assets/images/newElements/GmailPic.png";
import Google from "../../../../assets/images/newElements/GooglePic.png";
import img10 from "../../../../assets/images/10.png";
import ScreenShare from "../../../../assets/images/newElements/ScreenShareIcon.png";
import HandRaise from "../../../../assets/images/newElements/HandRaiseIcon.svg";
import Board from "../../../../assets/images/newElements/WhiteBoard.svg";
import ThreeDots from "../../../../assets/images/newElements/ThreeDotsIcon.svg";
import CallEndRedIcon from "../../../../assets/images/newElements/CallRedIcon.svg";
import ChatNonActive from "../../../../assets/images/newElements/ChatIconNonActive.svg";
import NoteNonActive from "../../../../assets/images/newElements/NoteIconNonActive.svg";
import Note_2NonActive from "../../../../assets/images/newElements/Note_2NonActive.svg";
import NonActiveVideo from "../../../../assets/images/newElements/NonActiveVideo.svg";
import NonActiveMic from "../../../../assets/images/newElements/NonActiveMic.svg";
import NonActiveScreenShare from "../../../../assets/images/newElements/NonActiveScreenShare.svg";
import NonActiveHand from "../../../../assets/images/newElements/NonActiveHandRaise.svg";
import NonActiveBoard from "../../../../assets/images/newElements/NonActiveWhiteBoard.svg";
import NonActiveDots from "../../../../assets/images/newElements/NonActiveThreeDots.svg";
import NonActiveCall from "../../../../assets/images/newElements/NonActiveRedCall.svg";
import ActiveChat from "../../../../assets/images/newElements/ActiveChatIcon.svg";
import ActiveNote from "../../../../assets/images/newElements/ActiveNoteIcon.svg";
import ActiveNote2 from "../../../../assets/images/newElements/ActiveNote2Icon.svg";
import ActiveVideo from "../../../../assets/images/newElements/ActiveVideoIcon.svg";
import ActiveMic from "../../../../assets/images/newElements/ActiveMicIcon.svg";
import ActiveScreenShare from "../../../../assets/images/newElements/ActiveScreenShareIcon.svg";
import ActiveHandRaise from "../../../../assets/images/newElements/ActiveHandRaiseIcon.svg";
import ActiveBoard from "../../../../assets/images/newElements/ActiveBoardIcon.svg";
import ActiveDots from "../../../../assets/images/newElements/ActiveDotsIcon.svg";
import MinToNormalIcon from "../../../../assets/images/newElements/Min-to-normal-Icon.svg";

import MultipleAvatar1 from "../../../../assets/images/newElements/MultipleVideoAvatar-1.png";
import MultipleAvatar2 from "../../../../assets/images/newElements/MultipleVideoAvatar-2.png";
import MultipleAvatar3 from "../../../../assets/images/newElements/MultipleVideoAvatar-3.png";

import Avatar2 from "../../../../assets/images/newElements/Avatar2.png";
import {
  setMaximizeVideoCallBox,
  setMinimizeVideoCallBox,
  setOpenVideoCallBox,
  setNormalVideoCallBox,
  setGroupVideoPanel,
  setCloseVideoCallBox,
  setVideoIncomingCall,
} from "../../../../store/actions/VideoCalling_actions";
import VideoPanelMinimize from "./videoCallPanels/videoCallMinimizePanel";

const VideoCallScreen = ({
  videoHandlerforInisiateCall,
  anotherVideoPanelHandler,
}) => {
  const navigate = useNavigate();

  const {
    videoCall,
    meetingIdReducer,
    toDoListReducer,
    calendarReducer,
    NotesReducer,
    settingReducer,
  } = useSelector((state) => state);
  const [visible, setVisible] = useState(true);
  const [maximumScreenHeight, setMaximumScreenHeight] = useState(false);
  const [isvideoScreen, setIsVideoScreen] = useState(true);

  // for open chat div
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [isMinuteOpen, setIsMinuteOpen] = useState(false);

  //for modal
  const [videoModal, setVideoModal] = useState(false);

  //for tabs in modal
  const [isChrome, setIsChrome] = useState(true);
  const [isWindow, setIsWindow] = useState(false);
  const [isEntireScreen, setIsEntireScreen] = useState(false);

  //for sm modal open in multiple user screen
  const [micModal, setMicModal] = useState(false);

  //for sm modal two radio button
  const [droidCamAudio, setDroidCamAudio] = useState(false);
  const [realCamAudio, setRealCamAudio] = useState(false);

  //for icons chat active or non active
  const [isActiveIcon, setIsActiveIcon] = useState(false);

  //for icon note active or non active
  const [isNoteActive, setIsNoteActive] = useState(false);

  //for icon note_2 active or non active
  const [isNote2Active, setIsNote2Active] = useState(false);

  //for full screens bottom icons active or non active
  const [isVideoIconActive, setIsVideoIconActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isScreenActive, setIsScreenActive] = useState(false);
  const [isHandActive, setIsHandActive] = useState(false);
  const [isBoardActive, setIsBoardActive] = useState(false);
  const [isDotsActive, setIsDotsActive] = useState(false);

  //for popover on dots
  const [isPopOver, setIsPopOver] = useState(false);

  const onChangeMicHandler = (e) => {
    setRealCamAudio(false);
    setDroidCamAudio(true);
  };

  const onChangeMicTwoHandler = (e) => {
    setDroidCamAudio(false);
    setRealCamAudio(true);
  };

  const micModalOpenHandler = async () => {
    setMicModal(true);
  };

  const onClickPopOverHandler = async () => {
    setIsPopOver(true);
  };

  const dispatch = useDispatch();
  const closeVideoHandlerOfCall = (flag) => {
    dispatch(setOpenVideoCallBox(flag));
  };

  // for close videoGroup video panel
  const closeVideoGroupPanel = (flag) => {
    localStorage.removeItem("VideoPanelGroup");
    dispatch(setGroupVideoPanel(flag));
  };

  const maximizeScreen = (flag) => {
    dispatch(setMaximizeVideoCallBox(!videoCall.maximizeVideoCall));
    dispatch(setMinimizeVideoCallBox(false));
    setIsChatOpen(false);
    setIsAgendaOpen(false);
    setIsMinuteOpen(false);
  };
  const minimizeScreen = (flag) => {
    dispatch(setMinimizeVideoCallBox(!videoCall.minmizeVideoCall));
    dispatch(setMaximizeVideoCallBox(false));
  };

  const normalScreen = (flag) => {
    dispatch(setNormalVideoCallBox(!videoCall.normalVideoCall));
    dispatch(setMaximizeVideoCallBox(false));
    dispatch(setMinimizeVideoCallBox(false));
  };
  //

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

  const changeIsChrome = async () => {
    setIsChrome(true);
    setIsWindow(false);
    setIsEntireScreen(false);
  };

  const navigateToWindow = async () => {
    setIsWindow(true);
    setIsChrome(false);
    setIsEntireScreen(false);
  };

  const navigateToEntire = async () => {
    setIsEntireScreen(true);
    setIsWindow(false);
    setIsChrome(false);
  };

  //for close modal
  const handleModalClose = async () => {
    setVideoModal(false);
    setMicModal(false);
  };

  //for open modal
  const openChromeModal = () => {
    setVideoModal(true);
  };
  let videoGroupPanel = localStorage.getItem("VideoPanelGroup");
  const [isVideoPanel, setVideoPanel] = useState(false);
  useEffect(() => {
    if (videoGroupPanel !== undefined) {
      setVideoPanel(videoGroupPanel);
    }
  }, [videoGroupPanel]);

  useEffect(() => {
    if (meetingIdReducer.Loading === true) {
      dispatch(setMinimizeVideoCallBox(true));
      dispatch(setGroupVideoPanel(false));
    } else if (meetingIdReducer.Loading === false) {
      dispatch(setMinimizeVideoCallBox(false));
      dispatch(setGroupVideoPanel(true));
    }
  }, [meetingIdReducer.Loading]);

  useEffect(() => {
    if (toDoListReducer.Loading === true) {
      dispatch(setMinimizeVideoCallBox(true));
      dispatch(setGroupVideoPanel(false));
    } else if (toDoListReducer.Loading === false) {
      dispatch(setMinimizeVideoCallBox(false));
      dispatch(setGroupVideoPanel(true));
    }
  }, [toDoListReducer.Loading]);

  useEffect(() => {
    if (calendarReducer.Loading === true) {
      dispatch(setMinimizeVideoCallBox(true));
      dispatch(setGroupVideoPanel(false));
    } else if (calendarReducer.Loading === false) {
      dispatch(setMinimizeVideoCallBox(false));
      dispatch(setGroupVideoPanel(true));
    }
  }, [calendarReducer.Loading]);

  useEffect(() => {
    if (NotesReducer.Loading === true) {
      dispatch(setMinimizeVideoCallBox(true));
      dispatch(setGroupVideoPanel(false));
    } else if (NotesReducer.Loading === false) {
      dispatch(setMinimizeVideoCallBox(false));
      dispatch(setGroupVideoPanel(true));
    }
  }, [NotesReducer.Loading]);

  useEffect(() => {
    if (settingReducer.Loading === true) {
      dispatch(setMinimizeVideoCallBox(true));
      dispatch(setGroupVideoPanel(false));
    } else if (settingReducer.Loading === false) {
      dispatch(setMinimizeVideoCallBox(false));
      dispatch(setGroupVideoPanel(true));
    }
  }, [settingReducer.Loading]);

  // const VideoCallForVideoIcon = (flag) => {
  //
  //   dispatch(setOpenVideoCallBox(flag));
  //   dispatch(setMaximizeVideoCallBox(false));
  //   dispatch(setMinimizeVideoCallBox(false));
  // };

  // const VideoCallForGroupIcon = (flag) => {
  //   dispatch(setOpenVideoCallBox(flag));
  //   dispatch(setMaximizeVideoCallBox(false));
  //   dispatch(setMinimizeVideoCallBox(false));
  // };

  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  return (
    <>
      <Row>
        {videoCall.openVideoCall === true ? (
          <>
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
              <>
                <Row className="mt-2 mb-4">
                  <Col lg={3} md={3} sm={3} className="mt-1">
                    <p className="title-heading">IT Departmental Meeting</p>
                  </Col>

                  {videoCall.minmizeVideoCall === true ? (
                    <>
                      <Col lg={6} md={6} sm={6}>
                        <div className="minimize-screen-on-bottom">
                          <img src={MinimizeVideoIcon} />
                          <img src={MinimizeMicIcon} />
                          <img
                            src={CallEndRedIcon}
                            onClick={() => closeVideoHandlerOfCall(false)}
                          />
                        </div>
                      </Col>
                    </>
                  ) : videoCall.maximizeVideoCall === true ? (
                    <>
                      <Col lg={6} md={6} sm={6}></Col>
                    </>
                  ) : (
                    <>
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="normal-screen-top-icons"
                      >
                        <img src={VideoCallIcon} />
                        <img src={MicVideo} />
                        <img src={ScreenShare} />
                        <img src={HandRaise} />
                        <img src={Board} />
                        <img src={ThreeDots} />
                        <img
                          src={CallEndRedIcon}
                          onClick={() => closeVideoHandlerOfCall(false)}
                        />
                      </Col>
                    </>
                  )}

                  {videoCall.minmizeVideoCall === true ? (
                    <>
                      <Col
                        lg={3}
                        md={3}
                        sm={3}
                        className="minimize-expand-icon"
                      >
                        <img
                          width={22}
                          src={MinToNormalIcon}
                          onClick={() => normalScreen(true)}
                        />

                        <img
                          width={15}
                          src={MinimizeExpandIcon}
                          onClick={() => maximizeScreen(true)}
                        />
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col lg={3} md={3} sm={3} className="top-right-icons">
                        <img
                          width={20}
                          src={MinimizeIcon}
                          onClick={() => minimizeScreen(true)}
                        />
                        <img
                          width={17}
                          src={ExpandIcon}
                          onClick={() => maximizeScreen(true)}
                        />
                      </Col>
                    </>
                  )}
                </Row>

                {imageIncomingCall === true ? (
                  <div className="image-videoSingle-calling-click">
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
                  <div className="image-videoSingle-calling-click">
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
                  <Row>
                    {videoCall.maximizeVideoCall === true ? (
                      <>
                        <Col lg={8} md={8} sm={8}>
                          <img src={Avatar2} className="full-screen-image" />
                        </Col>
                        <Col lg={3} md={3} sm={3}>
                          <img src={Avatar2} className="full-screen-image-2" />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col
                          lg={11}
                          md={11}
                          sm={11}
                          className="two-images-before-expand"
                        >
                          <img
                            src={Avatar2}
                            width={550}
                            height={280}
                            // className="two-images-before-expand"
                          />
                          <img
                            src={Avatar2}
                            width={550}
                            height={280}
                            // className="two-images-before-expand"
                          />
                        </Col>
                      </>
                    )}

                    {videoCall.maximizeVideoCall === true ? (
                      <>
                        <Col lg={1} md={1} sm={1} className="positionRelative">
                          <div className="fullScreen-video-side-icons">
                            <div onClick={() => setIsActiveIcon(!isActiveIcon)}>
                              {isActiveIcon ? (
                                <img
                                  src={ActiveChat}
                                  onClick={onClickCloseChatHandler}
                                />
                              ) : (
                                <img
                                  src={ChatNonActive}
                                  onClick={onClickCloseChatHandler}
                                />
                              )}
                            </div>

                            <div onClick={() => setIsNoteActive(!isNoteActive)}>
                              {isNoteActive ? (
                                <img
                                  src={ActiveNote}
                                  onClick={onClickNoteIconHandler}
                                />
                              ) : (
                                <img
                                  src={NoteNonActive}
                                  onClick={onClickNoteIconHandler}
                                />
                              )}
                            </div>

                            <div
                              onClick={() => setIsNote2Active(!isNote2Active)}
                            >
                              {isNote2Active ? (
                                <img
                                  src={ActiveNote2}
                                  onClick={onClickMinutesHandler}
                                />
                              ) : (
                                <img
                                  src={Note_2NonActive}
                                  onClick={onClickMinutesHandler}
                                />
                              )}
                            </div>
                          </div>
                        </Col>
                      </>
                    ) : videoCall.minmizeVideoCall === true ? (
                      <>
                        <Row>
                          <Col></Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Col lg={1} md={1} sm={1} className="video-side-icons">
                          <div onClick={() => setIsActiveIcon(!isActiveIcon)}>
                            {isActiveIcon ? (
                              <img
                                src={ActiveChat}
                                onClick={onClickCloseChatHandler}
                              />
                            ) : (
                              <img
                                src={ChatNonActive}
                                onClick={onClickCloseChatHandler}
                              />
                            )}
                          </div>

                          <div onClick={() => setIsNoteActive(!isNoteActive)}>
                            {isNoteActive ? (
                              <img
                                src={ActiveNote}
                                onClick={onClickNoteIconHandler}
                              />
                            ) : (
                              <img
                                src={NoteNonActive}
                                onClick={onClickNoteIconHandler}
                              />
                            )}
                          </div>

                          <div onClick={() => setIsNote2Active(!isNote2Active)}>
                            {isNote2Active ? (
                              <img
                                src={ActiveNote2}
                                onClick={onClickMinutesHandler}
                              />
                            ) : (
                              <img
                                src={Note_2NonActive}
                                onClick={onClickMinutesHandler}
                              />
                            )}
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                )}
                {videoCall.maximizeVideoCall === true ? (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="full-screen-bottom-images"
                      >
                        <div
                          onClick={() =>
                            setIsVideoIconActive(!isVideoIconActive)
                          }
                          className="videoNonActive-border"
                        >
                          {isVideoIconActive ? (
                            <img
                              src={ActiveVideo}
                              onClick={videoCallingIncominCall}
                            />
                          ) : (
                            <img
                              onClick={videoCallingIncominCall}
                              src={NonActiveVideo}
                            />
                          )}
                        </div>

                        <div onClick={() => setIsMicActive(!isMicActive)}>
                          {isMicActive ? (
                            <img
                              src={ActiveMic}
                              onClick={videoCallingOutgoingCall}
                            />
                          ) : (
                            <img
                              src={NonActiveMic}
                              onClick={videoCallingOutgoingCall}
                            />
                          )}
                        </div>

                        <div onClick={() => setIsScreenActive(!isScreenActive)}>
                          {isScreenActive ? (
                            <img
                              src={ActiveScreenShare}
                              onClick={videoMultipleScreen}
                            />
                          ) : (
                            <img
                              src={NonActiveScreenShare}
                              onClick={videoMultipleScreen}
                            />
                          )}
                        </div>

                        <div
                          onClick={() => setIsHandActive(!isHandActive)}
                          className="handraise-border"
                        >
                          {isHandActive ? (
                            <img src={ActiveHandRaise} />
                          ) : (
                            <img src={NonActiveHand} />
                          )}
                        </div>

                        <div onClick={() => setIsBoardActive(!isBoardActive)}>
                          {isBoardActive ? (
                            <img src={ActiveBoard} onClick={openChromeModal} />
                          ) : (
                            <img
                              src={NonActiveBoard}
                              onClick={openChromeModal}
                            />
                          )}
                        </div>

                        <div onClick={() => setIsDotsActive(!isDotsActive)}>
                          {isDotsActive ? (
                            <img src={ActiveDots} />
                          ) : (
                            <img src={NonActiveDots} />
                          )}
                        </div>

                        <img
                          src={NonActiveCall}
                          onClick={micModalOpenHandler}
                        />
                      </Col>
                    </Row>
                  </>
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
                                <img
                                  src={SearchIcon}
                                  style={{ width: "17px" }}
                                />
                              </Col>
                              <Col lg={1} md={1} sm={1}>
                                <img
                                  src={MinimizeIcon}
                                  style={{ width: "17px" }}
                                />
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
                                      <p className="level-NIAP">NIAP + PQC</p>

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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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

                {videoCall.minmizeVideoCall === false &&
                videoCall.maximizeVideoCall === false ? (
                  <>
                    {isChatOpen === true ? (
                      <>
                        <div className={"chatmedium-messenger-IsOpen"}>
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
                                <img
                                  src={SearchIcon}
                                  style={{ width: "17px" }}
                                />
                              </Col>
                              <Col lg={1} md={1} sm={1}>
                                <img
                                  src={MinimizeIcon}
                                  style={{ width: "17px" }}
                                />
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
                                      <p className="level-NIAP">NIAP + PQC</p>

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
                        <div className="isAgendamedium-div-changes">
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                        <div className="isMinutesmedium-div-changes">
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
                              </p>
                            </Col>
                            <Col lg={1} md={1} sm={1} />
                          </Row>

                          <Row>
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                              className="minutesmedium-video-field"
                            >
                              <Form.Control
                                // className="chat-message-input"
                                placeholder={"Type a Message"}
                              />
                            </Col>
                            <Col lg={2} md={2} sm={2}>
                              <img
                                src={SendIcon}
                                className="minutesmedium-video-sendIcon"
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
          </>
        ) : videoCall.openGroupVideopanel === true || isVideoPanel ? (
          <>
            <Col
              sm={12}
              md={11}
              lg={11}
              className={
                videoCall.maximizeVideoCall
                  ? "videoCallGroupScreen-maximizeVideoCall"
                  : videoCall.minmizeVideoCall
                  ? "videoCallGroupScreen-minmizeVideoCall"
                  : "videoCallGroupScreen"
              }
            >
              <>
                <Row className="mt-2 mb-4">
                  <Col lg={3} md={3} sm={3} className="mt-1">
                    <p className="title-heading">Group Meeting Video</p>
                  </Col>
                  {videoCall.minmizeVideoCall === true ? (
                    <>
                      <Col lg={7} md={7} sm={7}>
                        <div className="minimize-screen-on-bottom">
                          <img src={MinimizeVideoIcon} />
                          <img src={MinimizeMicIcon} />
                          <img
                            src={CallEndRedIcon}
                            onClick={() => closeVideoGroupPanel(false)}
                          />
                        </div>
                      </Col>
                    </>
                  ) : videoCall.maximizeVideoCall === true ? (
                    <>
                      <Col lg={6} md={6} sm={6}></Col>
                    </>
                  ) : (
                    <>
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="normal-screen-top-icons"
                      >
                        <img src={VideoCallIcon} />
                        <img src={MicVideo} />
                        <img src={ScreenShare} />
                        <img src={HandRaise} />
                        <img src={Board} />
                        <img src={ThreeDots} />
                        <img
                          src={CallEndRedIcon}
                          onClick={() => closeVideoGroupPanel(false)}
                        />
                      </Col>
                    </>
                  )}

                  {videoCall.minmizeVideoCall === true ? (
                    <>
                      {/* <Col lg={2} md={2} sm={2} /> */}
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className="minimizeGroup-expand-icon"
                      >
                        <img
                          width={22}
                          src={MinToNormalIcon}
                          onClick={() => normalScreen(true)}
                        />

                        <img
                          width={15}
                          src={MinimizeExpandIcon}
                          // className="minimize-expand-icon"
                          onClick={() => maximizeScreen(true)}
                        />
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col lg={3} md={3} sm={3} className="top-right-icons">
                        <img
                          width={20}
                          src={MinimizeIcon}
                          onClick={() => minimizeScreen(true)}
                        />
                        <img
                          width={17}
                          src={ExpandIcon}
                          onClick={() => maximizeScreen(true)}
                        />
                      </Col>
                    </>
                  )}
                </Row>

                {imageIncomingCall === true ? (
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
                    <Container className="multiple-videoGroup-screens">
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
                  <Row>
                    {videoCall.maximizeVideoCall === true ? (
                      <>
                        <Col lg={8} md={8} sm={8}>
                          <img src={Avatar2} className="full-screen-image" />
                        </Col>
                        <Col lg={4} md={4} sm={4}>
                          <img src={Avatar2} className="full-screen-image-2" />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="two-images-before-expand"
                        >
                          <img
                            src={Avatar2}
                            width={550}
                            height={280}
                            // className="two-images-before-expand"
                          />
                          <img
                            src={Avatar2}
                            width={550}
                            height={280}
                            // className="two-images-before-expand"
                          />
                        </Col>
                      </>
                    )}

                    {/* {videoCall.maximizeVideoCall === true ? (
                        <>
                          <Col
                            lg={1}
                            md={1}
                            sm={1}
                            className="positionRelative"
                          ></Col>
                        </>
                      ) : null} */}
                  </Row>
                )}

                {videoCall.maximizeVideoCall === true ? (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="full-screen-bottom-images"
                      >
                        <div
                          onClick={() =>
                            setIsVideoIconActive(!isVideoIconActive)
                          }
                        >
                          {isVideoIconActive ? (
                            <img
                              src={ActiveVideo}
                              onClick={videoCallingIncominCall}
                            />
                          ) : (
                            <img
                              onClick={videoCallingIncominCall}
                              src={NonActiveVideo}
                              className="videoNonActive-border"
                            />
                          )}
                        </div>

                        <div onClick={() => setIsMicActive(!isMicActive)}>
                          {isMicActive ? (
                            <img
                              src={ActiveMic}
                              onClick={videoCallingOutgoingCall}
                            />
                          ) : (
                            <img
                              src={NonActiveMic}
                              onClick={videoCallingOutgoingCall}
                            />
                          )}
                        </div>

                        <div onClick={() => setIsScreenActive(!isScreenActive)}>
                          {isScreenActive ? (
                            <img
                              src={ActiveScreenShare}
                              onClick={videoMultipleScreen}
                            />
                          ) : (
                            <img
                              src={NonActiveScreenShare}
                              onClick={videoMultipleScreen}
                            />
                          )}
                        </div>

                        <div
                          onClick={() => setIsHandActive(!isHandActive)}
                          className="handraise-border "
                        >
                          {isHandActive ? (
                            <img src={ActiveHandRaise} />
                          ) : (
                            <img src={NonActiveHand} />
                          )}
                        </div>

                        <div onClick={() => setIsBoardActive(!isBoardActive)}>
                          {isBoardActive ? (
                            <img src={ActiveBoard} onClick={openChromeModal} />
                          ) : (
                            <img
                              src={NonActiveBoard}
                              onClick={openChromeModal}
                            />
                          )}
                        </div>

                        {isPopOver === true ? (
                          <>
                            <Popover
                              content={content}
                              title="Title"
                              trigger="click"
                            >
                              <Button>Click me</Button>
                            </Popover>
                          </>
                        ) : null}

                        <div onClick={() => setIsDotsActive(!isDotsActive)}>
                          {isDotsActive ? (
                            <img
                              src={ActiveDots}
                              onClick={onClickPopOverHandler}
                            />
                          ) : (
                            <img src={NonActiveDots} />
                          )}
                        </div>

                        <img
                          src={NonActiveCall}
                          onClick={micModalOpenHandler}
                        />
                      </Col>
                    </Row>
                  </>
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
                                <img
                                  src={SearchIcon}
                                  style={{ width: "17px" }}
                                />
                              </Col>
                              <Col lg={1} md={1} sm={1}>
                                <img
                                  src={MinimizeIcon}
                                  style={{ width: "17px" }}
                                />
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
                                      <p className="level-NIAP">NIAP + PQC</p>

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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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

                {videoCall.minmizeVideoCall === false &&
                videoCall.maximizeVideoCall === false ? (
                  <>
                    {isChatOpen === true ? (
                      <>
                        <div className={"chatmedium-messenger-IsOpen"}>
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
                                <img
                                  src={SearchIcon}
                                  style={{ width: "17px" }}
                                />
                              </Col>
                              <Col lg={1} md={1} sm={1}>
                                <img
                                  src={MinimizeIcon}
                                  style={{ width: "17px" }}
                                />
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
                                      <p className="level-NIAP">NIAP + PQC</p>

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
                        <div className="isAgendamedium-div-changes">
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.
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
                        <div className="isMinutesmedium-div-changes">
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
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
                                Agenda Comes in here. It can have as much info
                                as it can hold.Agenda Comes in here. It can have
                                as much info as it can hold.Agenda Comes in
                                here. It can have as much info as it can hold.
                              </p>
                            </Col>
                            <Col lg={1} md={1} sm={1} />
                          </Row>

                          <Row>
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                              className="minutesmedium-video-field"
                            >
                              <Form.Control
                                // className="chat-message-input"
                                placeholder={"Type a Message"}
                              />
                            </Col>
                            <Col lg={2} md={2} sm={2}>
                              <img
                                src={SendIcon}
                                className="minutesmedium-video-sendIcon"
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
          </>
        ) : null}
      </Row>

      <Modal
        show={videoModal || micModal}
        setShow={() => {
          setVideoModal();
          setMicModal();
        }}
        onHide={handleModalClose}
        modalHeaderClassName="header-Video-Modal-close-btn"
        className={
          micModal === true ? "modaldialog micModal-size" : "videoModal"
        }
        modalFooterClassName="modal-userprofile-footer"
        centered
        size="md"
        ModalBody={
          <>
            {videoModal ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="modaltop-three-buttons"
                  >
                    <Button
                      className={
                        isChrome
                          ? "btn btn-primary isChrome-top-btn"
                          : "btn btn-outline-primary isChrome-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text="Chrome"
                      onClick={changeIsChrome}
                    />

                    <Button
                      className={
                        isWindow
                          ? "btn btn-primary isWindow-top-btn"
                          : "btn btn-outline-primary isWindow-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text="Window"
                      onClick={navigateToWindow}
                    />

                    <Button
                      className={
                        isEntireScreen
                          ? "btn btn-primary Entire-top-btn"
                          : "btn btn-outline-primary Entire-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text="Entire Screen"
                      onClick={navigateToEntire}
                    ></Button>
                  </Col>
                  {/* <Col lg={2} md={2} sm={2} xs={12} className="p-0"></Col> */}
                </Row>

                {isChrome ? (
                  <>
                    <Row className="mt-5">
                      <Col
                        lg={2}
                        md={2}
                        sm={2}
                        className="d-flex justify-content-start"
                      >
                        <img src={Gmail} width={160} height={30} />
                      </Col>
                      <Col lg={4} md={4} sm={4} />

                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={Google} />
                      </Col>
                    </Row>
                  </>
                ) : isWindow ? (
                  <>
                    <Row className="for-space-top">
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
                        // className="d-flex justify-content-start"
                      >
                        <img src={Google} width={165} height={130} />
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <img src={Google} width={165} height={130} />
                      </Col>

                      <Col lg={4} md={4} sm={4}>
                        <img src={Google} width={165} height={130} />
                      </Col>
                    </Row>
                  </>
                ) : isEntireScreen ? (
                  <>
                    <Row className="for-space-top">
                      <Col lg={12} md={12} sm={12}>
                        <img src={Google} width={540} height={300} />
                      </Col>
                    </Row>
                  </>
                ) : null}
              </>
            ) : micModal ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <p className="choose-modal-title">Choose Your Microphone</p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col sm={12} md={1} lg={1}>
                    {" "}
                    <img
                      width={"15px"}
                      className={
                        !droidCamAudio ? "mic_image" : "mic_image_active "
                      }
                      src={img10}
                      alt=""
                    />
                  </Col>
                  <Col sm={12} md={9} lg={9}>
                    {" "}
                    <span
                      className={
                        !droidCamAudio
                          ? "Enable-DroidCam_active"
                          : "Enable-DroidCam"
                      }
                    >
                      <p className="mic-radio-title">
                        Microphone (DroidCam Virtual Audio)
                      </p>
                    </span>
                  </Col>
                  <Col
                    sm={12}
                    md={2}
                    lg={2}
                    className="d-flex justify-content-end"
                  >
                    <Form.Check type="radio" onChange={onChangeMicHandler} />
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} md={1} lg={1}>
                    {" "}
                    <img
                      width={"15px"}
                      className={
                        !realCamAudio ? "mic_image" : "mic_image_active "
                      }
                      src={img10}
                      alt=""
                    />
                  </Col>
                  <Col sm={12} md={9} lg={9}>
                    {" "}
                    <span
                      className={
                        !realCamAudio
                          ? "Enable-DroidCam_active"
                          : "Enable-DroidCam"
                      }
                    >
                      <p className="mic-radio-title">
                        Microphone (Realtek(R) Audio)
                      </p>
                    </span>
                  </Col>
                  <Col
                    sm={12}
                    md={2}
                    lg={2}
                    className="d-flex justify-content-end"
                  >
                    <Form.Check type="radio" onChange={onChangeMicTwoHandler} />
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
        ModalFooter={
          <>
            {videoModal ? (
              <>
                {isChrome ? (
                  <>
                    <Row className="mt-5 mb-3">
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
                        className="d-flex justify-content-start mt-2"
                      >
                        <Checkbox />
                        <p>Select Tab Audio</p>
                      </Col>
                      <Col lg={2} md={2} sm={2} />
                      <Col
                        lg={3}
                        md={3}
                        sm={3}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          text="Cancel"
                          className="cancel-video-modal-btn"
                        />
                      </Col>

                      <Col lg={3} md={3} sm={3}>
                        <Button
                          text="Share"
                          className="share-video-modal-btn"
                        />
                      </Col>
                    </Row>
                  </>
                ) : isWindow ? (
                  <>
                    <Row className="mt-5 mb-3">
                      <Col lg={6} md={6} sm={6} />
                      <Col
                        lg={3}
                        md={3}
                        sm={3}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          text="Cancel"
                          className="cancel-video-modal-btn"
                        />
                      </Col>
                      <Col lg={3} md={3} sm={3}>
                        <Button
                          text="Share"
                          className="share-video-modal-btn"
                        />
                      </Col>
                    </Row>
                  </>
                ) : isEntireScreen ? (
                  <>
                    <Row className="mt-3 mb-4">
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
                        className="d-flex justify-content-start mt-3"
                      >
                        <Checkbox />
                        <p>Share System Audio </p>
                      </Col>
                      <Col lg={2} md={2} sm={2} />
                      <Col
                        lg={3}
                        md={3}
                        sm={3}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          text="Cancel"
                          className="cancel-video-modal-btn"
                        />
                      </Col>

                      <Col lg={3} md={3} sm={3}>
                        <Button
                          text="Share"
                          className="share-video-modal-btn"
                        />
                      </Col>
                    </Row>
                  </>
                ) : null}
              </>
            ) : micModal ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button text="Join" className="Join-Btn" />
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
      />
    </>
  );
};

export default VideoCallScreen;
