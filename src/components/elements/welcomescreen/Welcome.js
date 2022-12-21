import React from "react";
import Logo from "../../../assets/images/diskuslogo-forsigncard.svg";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Welcome.module.css";

const Loader = () => {
  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <h3>Welcome To</h3>
          <img src={Logo} />

          <div className={styles["line"]}>
            <p>Your one-step solution to meeting management</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
