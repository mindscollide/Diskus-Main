import React, { useState } from "react";
import "./VideoMeeting.css";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronRight, CameraVideo } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Modal, Checkbox } from "../../components/elements";
import videoChatIcon from "../../assets/images/newElements/VideochatNewIcon.svg";
import videoMikeIcon from "../../assets/images/newElements/videoChatMicIcon.svg";
import videoScreenIcon from "../../assets/images/newElements/videoChatScreenIcon.svg";
import videoPalmIcon from "../../assets/images/newElements/videoChatHandIcon.svg";
import videoNotesIcon from "../../assets/images/newElements/videoChatNoteIcon.svg";
import videoHamburgerIcon from "../../assets/images/newElements/videoChatHamburgerIcon.svg";
import videoEndIcon from "../../assets/images/newElements/videoChatCallCutIcon.svg";

import Gmail from "../../assets/images/newElements/GmailPic.png";
import Youtube from "../../assets/images/newElements/YoutubePic.png";
import Behance from "../../assets/images/newElements/BehancePic.png";
import Google from "../../assets/images/newElements/GooglePic.png";

import avatar from "../../assets/images/avatar.png";
import VideoIncoming from "../videoIncoming/VideoIncoming";

import Avatar2 from "../../assets/images/newElements/Avatar2.png";
import Avatar3 from "../../assets/images/newElements/Avatar3.png";

const VideoMeeting = ({ show, setShow, ModalTitle }) => {
  const navigate = useNavigate();

  //for modal
  const [videoModal, setVideoModal] = useState(false);

  //for tabs in modal
  const [isChrome, setIsChrome] = useState(true);
  const [isWindow, setIsWindow] = useState(false);
  const [isEntireScreen, setIsEntireScreen] = useState(false);

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
  };

  //for open modal
  const openChromeModal = () => {
    setVideoModal(true);
  };

  const { VideoChatReducer } = useSelector((state) => state);
  const [minutes, setMinutes] = useState("");

  const navigateToVideoIncoming = () => {
    navigate("/Diskus/VideoIncoming");
  };

  const navigateToVideoOutgoing = () => {
    navigate("/Diskus/VideoOutgoing");
  };

  const navigateToVideoMultiple = () => {
    navigate("/Diskus/VideoMultiple");
  };

  const navigateToMultipleScreens = () => {
    navigate("/Diskus/VideoScreens");
  };

  return (
    <>
      <Container>
        <Row>
          <Col sm={9} md={9} lg={9} className="videocalling">
            <img src={Avatar2} width={850} height={500} />
          </Col>
          <Col sm={3} md={3} lg={3} className="videoCalling-second-image">
            <img src={Avatar3} width={300} />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="d-flex justify-content-center">
            <div className="video-buttons">
              <Button
                className="video-img"
                icon={
                  <>
                    <img
                      src={videoChatIcon}
                      onClick={navigateToVideoIncoming}
                    />
                  </>
                }
              ></Button>

              <Button
                className="video-img"
                icon={
                  <>
                    <img
                      src={videoMikeIcon}
                      onClick={navigateToVideoOutgoing}
                    />
                  </>
                }
              ></Button>
              <Button
                className="video-img"
                icon={
                  <>
                    <img
                      src={videoScreenIcon}
                      onClick={navigateToVideoMultiple}
                    />
                  </>
                }
              ></Button>
              <Button
                className="video-img"
                icon={
                  <>
                    <img
                      src={videoPalmIcon}
                      onClick={navigateToMultipleScreens}
                    />
                  </>
                }
              ></Button>
              <Button
                className="video-img"
                icon={
                  <>
                    <img src={videoNotesIcon} />
                  </>
                }
              ></Button>
              <Button
                className="video-img"
                icon={
                  <>
                    <img src={videoHamburgerIcon} />
                  </>
                }
              ></Button>
              <Button
                className="video-img"
                icon={
                  <>
                    <img src={videoEndIcon} onClick={openChromeModal} />
                  </>
                }
              ></Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal
        show={videoModal}
        setShow={setVideoModal}
        onHide={handleModalClose}
        className="modaldialog videoModal"
        modalFooterClassName="modal-userprofile-footer"
        centered
        size="md"
        ModalBody={
          <>
            <Row>
              <Col
                lg={3}
                md={3}
                sm={3}
                xs={12}
                className="d-flex justify-content-center"
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
              </Col>
              <Col
                lg={3}
                md={3}
                sm={3}
                xs={12}
                className="d-flex justify-content-end"
              >
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
              </Col>
              <Col
                lg={4}
                md={4}
                sm={4}
                xs={12}
                className="d-flex justify-content-center"
              >
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
              <Col lg={2} md={2} sm={2} xs={12} className="p-0"></Col>
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
        }
        ModalFooter={
          <>
            {isChrome ? (
              <>
                <Row className="mt-5 mb-3">
                  <Col
                    lg={4}
                    md={4}
                    sm={4}
                    className="d-flex justify-content-start mt-3"
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
                    <Button text="Cancel" className="cancel-video-modal-btn" />
                  </Col>

                  <Col lg={3} md={3} sm={3}>
                    <Button text="Share" className="share-video-modal-btn" />
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
                    <Button text="Cancel" className="cancel-video-modal-btn" />
                  </Col>

                  <Col lg={3} md={3} sm={3}>
                    <Button text="Share" className="share-video-modal-btn" />
                  </Col>
                </Row>
              </>
            ) : isEntireScreen ? (
              <>
                <Row className="mt-5 mb-3">
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
                    <Button text="Cancel" className="cancel-video-modal-btn" />
                  </Col>

                  <Col lg={3} md={3} sm={3}>
                    <Button text="Share" className="share-video-modal-btn" />
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

export default VideoMeeting;
