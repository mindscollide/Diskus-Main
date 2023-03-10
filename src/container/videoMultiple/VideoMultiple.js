import React, { useState } from "react";
import "./VideoMultiple.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import { ChevronRight, CameraVideo, mic } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { TextField, Button, Modal } from "../../components/elements";
import videoEndIcon from "../../assets/images/newElements/VideoEndIcon.png";
import img10 from "../../assets/images/10.png";
import videoAvatar from "../../assets/images/newElements/VideoAvatar.png";
import MultipleAvatar1 from "../../assets/images/newElements/MultipleVideoAvatar-1.png";
import MultipleAvatar2 from "../../assets/images/newElements/MultipleVideoAvatar-2.png";
import MultipleAvatar3 from "../../assets/images/newElements/MultipleVideoAvatar-3.png";
import videoAttendIcon from "../../assets/images/newElements/VideoAttendIcon.png";

import avatar from "../../assets/images/avatar.png";

import MeetingVideoChatIcon from "../../assets/images/newElements/Icon feather-video1.png";

const VideoMultiple = ({ show, setShow, ModalTitle }) => {
  const { VideoChatReducer } = useSelector((state) => state);
  const [minutes, setMinutes] = useState("");

  const [droidCamAudio, setDroidCamAudio] = useState(false);
  const [realCamAudio, setRealCamAudio] = useState(false);
  const [micModal, setMicModal] = useState(false);

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

  const handleModalClose = async () => {
    setMicModal(false);
  };

  return (
    <>
      <Container className="videoOutgoing">
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-center"
          >
            <p className="multiple-video-It-Title">IT Departmental Meeting</p>
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
            <Col sm={2} md={2} lg={2} className="d-flex justify-content-center">
              <img src={MultipleAvatar1} width={100} />
            </Col>
            <Col sm={2} md={2} lg={2} className="d-flex justify-content-center">
              <img
                src={videoAvatar}
                width={100}
                onClick={micModalOpenHandler}
              />
            </Col>
            <Col sm={2} md={2} lg={2} className="d-flex justify-content-center">
              <img src={MultipleAvatar2} width={100} />
            </Col>
            <Col sm={2} md={2} lg={2} className="d-flex justify-content-center">
              <img src={MultipleAvatar1} width={100} />
            </Col>
            <Col sm={2} md={2} lg={2} className="d-flex justify-content-center">
              <img src={MultipleAvatar3} width={100} />
            </Col>
            <Col lg={1} md={1} sm={1} />
          </Row>
        </div>
      </Container>

      <Modal
        show={micModal}
        setShow={setMicModal}
        onHide={handleModalClose}
        modalHeaderClassName="header-Video-Modal-close-btn"
        className="modaldialog micModal-size"
        centered
        size="md"
        ModalBody={
          <>
            {micModal ? (
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
            {micModal ? (
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

export default VideoMultiple;
