/**
 * @file ParticipantInfoShareFolder.js
 * @description Card component that displays a participant's profile picture, name, designation, and an icon within the share-folder modal.
 */

import React from "react";
import styles from "./ParticpantInfoShareFolder.module.css";
import { Col, Row } from "react-bootstrap";

/**
 * Shows a participant's avatar, name, designation, and an optional icon (e.g., permission level indicator).
 * @param {{ participantname: string, particiapantdesignation: string, icon: JSX.Element, userPic: string, You: boolean }} props
 * @returns {JSX.Element}
 */
const ParticipantInfoShareFolder = ({
  participantname,
  particiapantdesignation,
  icon,
  userPic,
  You,
}) => {
  return (
    <Row className="mt-3">
      <Col lg={3} md={3} sm={3} className="position-relative">
        <img
          src={`data:image/jpeg;base64,${userPic}`}
          width="34px"
          alt=""
          height="35px"
          className={styles["profile_image_shareFolder_modal"]}
          draggable="false"
        />
        {icon}
      </Col>
      <Col lg={8} md={8} sm={8} className={styles["Space_limit"]}>
        <Row className="mt-1">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["nameparticipant"]}>{participantname}</span>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["participant_designation"]}>
              {particiapantdesignation}
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ParticipantInfoShareFolder;
