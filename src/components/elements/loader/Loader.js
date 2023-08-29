import React, { useEffect } from "react";
import Logo from '../../../assets/images/newElements/Diskus_newLogo.svg'
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Loader.module.css";

const Loader = () => {

  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <img src={Logo} widt={100} height={100} />
          {localStorage.getItem("deleteContent") && <p className={styles["deleteOrganizationContent"]}>Please wait while we delete your organization relevant data…</p>}
          <div className={styles["loader-line"]}></div>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
