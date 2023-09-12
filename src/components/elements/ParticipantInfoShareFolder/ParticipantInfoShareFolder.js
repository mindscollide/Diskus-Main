import React from "react"
import styles from "./ParticpantInfoShareFolder.module.css"
import newprofile from "../../../assets/images/Mask Group 67.svg"
import { Col, Container, Row } from "react-bootstrap"
const ParticipantInfoShareFolder = ({
  participantname,
  particiapantdesignation,
  icon,
  userPic,
  You,
}) => {
  return (
    <Row className="mt-3">
      <Col lg={3} md={3} sm={3}>
        <img
          src={`data:image/jpeg;base64,${userPic}`}
          width="34px"
          alt=""
          height="35px"
          className={styles["profile_image_shareFolder_modal"]}
        />
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
      <Col lg={1} md={1} sm={1} className="d-flex align-items-center">
        {icon}
      </Col>
    </Row>
  )
}

export default ParticipantInfoShareFolder
