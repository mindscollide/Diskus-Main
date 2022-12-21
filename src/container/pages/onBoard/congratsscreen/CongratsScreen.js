import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Bullseye } from "react-bootstrap-icons";
import styles from "./CongratsScreen.module.css";
import { useTour } from "@reactour/tour";
import NavigationButtons from "../navigtionbuttonsforscreen5/NavigationButtonsforcongrats";
import { Meeting } from "../Meeting/Meeting";
import { Navigate } from "react-router-dom";

const Congrats = ({ message }) => {
  const { setIsOpen, setCurrentStep, currentStep } = useTour();
  const navigate = useNavigate();

  return (
    <Container data-tut="congrats-screen">
      <Row>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <Col sm={12} className="px-1 bg-white">
            <Meeting pageSize={1} pagination={false} />
          </Col>
          <Col sm={12} className="gap-4 d-flex justify-content-center mb-3">
            <Bullseye fontSize={52} color="blue" cursor="pointer" />
            <Bullseye fontSize={42} color="blue" cursor="pointer" />
            {/* <Bullseye fontSize={32} color="blue" cursor="pointer" /> */}
          </Col>
          <Col sm={12} className="gap-4 d-flex justify-content-center mb-3">
            {/* <Bullseye fontSize={32} color="blue" cursor="pointer" /> */}
            <Bullseye fontSize={42} color="blue" cursor="pointer" />
            <Bullseye fontSize={52} color="blue" cursor="pointer" />
          </Col>

          <h3>{message}</h3>

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
      <Row>

          {currentStep === 5 && <NavigationButtons />}
      </Row>
    </Container>
  );
};

export default Congrats;
