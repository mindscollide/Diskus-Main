import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Bullseye } from "react-bootstrap-icons";
import styles from "./CongratsScreen.module.css";
import { useTour } from "@reactour/tour";
import NavigationButtons from "../navigtionbuttonsforscreen5/NavigationButtonsforcongrats";
import { Meeting } from "../Meeting/Meeting";
import { Navigate } from "react-router-dom";
import Home from "../../../pages/home/Home";
import AllDoneLogo from "../../../../assets/images/newElements/onboard_logopng.png";

const Congrats = ({ message }) => {
  const { setIsOpen, setCurrentStep, currentStep } = useTour();
  const navigate = useNavigate();

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

          {/* <Row className="w-75">
            <Col sm={12}>
              <button
                className="btn btn-md btn-outline-primary"
   
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                End Tour
              </button>
            
            </Col>
          </Row> */}
        </Col>
      </Row>
      <Row>{currentStep === 5 && <NavigationButtons />}</Row>
    </Container>
  );
};

export default Congrats;
