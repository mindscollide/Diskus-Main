import React, { useState } from "react";
import styles from "./VideoIncoming.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../components/elements";
import videoEndIcon from "../../assets/images/newElements/VideoEndIcon.png";
import videoAvatar from "../../assets/images/newElements/VideoAvatar.png";
import videoAttendIcon from "../../assets/images/newElements/VideoAttendIcon.png";

const VideoIncoming = () => {



  return (
    <Container className={styles["videoIncoming"]}>
      <Row className="mt-5">
        <Col sm={12} md={12} lg={12} className={styles["avatar-column"]}>
          <img src={videoAvatar} width={150}alt=""/>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col
          sm={12}
          md={12}
          lg={12}
          className={styles["someone-calling-title"]}
        >
          <p className={styles["outgoing-call-text"]}>Some One Calling</p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col sm={12} md={12} lg={12} className={styles["calling-title"]}>
          <p className={styles["calling-text"]}>Calling...</p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col sm={6} md={6} lg={6} className="d-flex justify-content-end">
          <Button
            className={styles["button-img"]}
            icon={
              <>
                <img src={videoEndIcon} width={50} alt=""/>
              </>
            }
          ></Button>
        </Col>

        <Col sm={6} md={6} lg={6} className="d-flex justify-content-start">
          <Button
            className={styles["button-img"]}
            icon={
              <>
                <img src={videoAttendIcon} width={50}alt="" />
              </>
            }
          ></Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoIncoming;
