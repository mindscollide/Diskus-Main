import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./CongratsScreen.module.css";
import { useTour } from "@reactour/tour";
import NavigationButtons from "../navigtionbuttonsforscreen5/NavigationButtonsforcongrats";
import { Meeting } from "../Meeting/Meeting";
import AllDoneLogo from "../../../../assets/images/newElements/onboard_logopng.png";

const Congrats = ({ message }) => {
  const { currentStep } = useTour();

  return (
    <Container data-tut="congrats-screen">
      <Row>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <Col sm={12} className="px-1">
            <Meeting pageSize={1} pagination={false} />
          </Col>
          <Col sm={12} className="All-Done-Congrats-Screen">
            <img
              draggable="false"
              style={{ marginBottom: "20px" }}
              src={AllDoneLogo}
              width="150"
              height="150"
              alt=""
            />
            <h3>{message}</h3>
          </Col>
        </Col>
      </Row>
      <Row>{currentStep === 5 && <NavigationButtons />}</Row>
    </Container>
  );
};

export default Congrats;
