import React from "react";
import styles from "./ParticpantInfoShareFolder.module.css";
import { Col, Row } from "react-bootstrap";

/**
 * @component ParticipantInfoShareFolder
 * @description Displays a participant's profile picture, name, and designation within
 * the Share Folder modal. An overlay icon (e.g. an access-level badge or action button)
 * is rendered on top of the profile image. Used to list users who have or can be granted
 * access to a shared folder in the Diskus document management module.
 *
 * @param {string} props.participantname - Full name of the participant.
 * @param {string} props.particiapantdesignation - Job designation of the participant
 *   (note: prop name contains a typo — "particiapant" — matching the original interface).
 * @param {React.ReactNode} props.icon - An icon element rendered as an overlay on the
 *   profile picture, typically indicating permission level (e.g. owner, viewer).
 * @param {string} props.userPic - Base64-encoded JPEG string used as the profile picture.
 * @param {boolean} [props.You] - Flag indicating whether this participant is the currently
 *   logged-in user. Accepted as a prop but not yet rendered in the current implementation.
 *
 * @example
 * <ParticipantInfoShareFolder
 *   participantname="Fatima Noor"
 *   particiapantdesignation="Project Lead"
 *   icon={<OwnerBadge />}
 *   userPic={base64ImageString}
 *   You={true}
 * />
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
