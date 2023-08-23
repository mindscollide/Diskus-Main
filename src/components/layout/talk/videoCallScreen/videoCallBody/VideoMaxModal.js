import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Button, Modal } from "../../../../elements";
import { Checkbox } from "antd";
import Google from "../../../../../assets/images/newElements/GooglePic.png";
import Gmail from "../../../../../assets/images/newElements/GmailPic.png";
import "./VideoMaxModal.css";

const VideoMaxModal = ({ videoModal, setVideoModal }) => {
  //for modal
  //   const [videoModal, setVideoModal] = useState(false);

  //for tabs in modal
  const [isChrome, setIsChrome] = useState(true);
  const [isWindow, setIsWindow] = useState(false);
  const [isEntireScreen, setIsEntireScreen] = useState(false);

  //for close modal
  const handleModalClose = async () => {
    setVideoModal(false);
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

  return (
    <>
      <Modal
        show={videoModal}
        setShow={() => {
          setVideoModal();
        }}
        onHide={handleModalClose}
        modalHeaderClassName="header-Video-max-Modal-close-btn"
        className={"videoModal-max"}
        modalFooterClassName="modal-Video-max-footer"
        centered
        size="md"
        ModalBody={
          <>
            {videoModal ? (
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
                          ? "btn btn-primary isChrome-max-top-btn"
                          : "btn btn-outline-primary isChrome-max-top-btn-Outline"
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
                          ? "btn btn-primary isWindow-top-max-btn"
                          : "btn btn-outline-primary isWindow-top-max-btn-Outline"
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
                          ? "btn btn-primary Entire-top-max-btn"
                          : "btn btn-outline-primary Entire-top-max-btn-Outline"
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
                        <img
                          src={Gmail}
                          width={160}
                          height={30}
                          alt="Gmail Pic"
                        />
                      </Col>
                      <Col lg={4} md={4} sm={4} />

                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        className="d-flex justify-content-end"
                      >
                        <img src={Google} alt="Google Pic" />
                      </Col>
                    </Row>
                  </>
                ) : isWindow ? (
                  <>
                    <Row className="for-max-space-top">
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
                        // className="d-flex justify-content-start"
                      >
                        <img
                          src={Google}
                          width={165}
                          height={130}
                          alt="Google Pic"
                        />
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <img
                          src={Google}
                          width={165}
                          height={130}
                          alt="Google Pic"
                        />
                      </Col>

                      <Col lg={4} md={4} sm={4}>
                        <img
                          src={Google}
                          width={165}
                          height={130}
                          alt="Google Pic"
                        />
                      </Col>
                    </Row>
                  </>
                ) : isEntireScreen ? (
                  <>
                    <Row className="for-max-space-top">
                      <Col lg={12} md={12} sm={12}>
                        <img
                          src={Google}
                          width={540}
                          height={300}
                          alt="Google Pic"
                        />
                      </Col>
                    </Row>
                  </>
                ) : null}
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
                        <Button
                          text="Cancel"
                          className="cancel-video-max-modal-btn"
                        />
                      </Col>

                      <Col lg={3} md={3} sm={3}>
                        <Button
                          text="Share"
                          className="share-video-max-modal-btn"
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
                          className="cancel-video-max-modal-btn"
                        />
                      </Col>

                      <Col lg={3} md={3} sm={3}>
                        <Button
                          text="Share"
                          className="share-video-max-modal-btn"
                        />
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
                        <Button
                          text="Cancel"
                          className="cancel-video-max-modal-btn"
                        />
                      </Col>

                      <Col lg={3} md={3} sm={3}>
                        <Button
                          text="Share"
                          className="share-video-max-modal-btn"
                        />
                      </Col>
                    </Row>
                  </>
                ) : null}
              </>
            ) : null}
          </>
        }
      />
    </>
  );
};

export default VideoMaxModal;
