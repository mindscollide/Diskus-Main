import React, { useState } from "react";
import Logo from "../../../../assets/images/diskuslogo-forsigncard.svg";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import styles from "./WelcomeScreen.module.css";
import { useTour } from "@reactour/tour";
import { useTranslation } from "react-i18next";

const Welcome = (props) => {
  console.log(props);
  //For Localization
  const { t } = useTranslation();
  // const [circle, setCircle] = useState(false)
  const { setCurrentStep, currentStep } = useTour();
  const increaseStep = () => {
    setCurrentStep(currentStep + 1);
    // setCircle(true)
  };

  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <h3>{t("Welcome-to-title")}</h3>
          <img src={Logo} />
          <p>{t("Your-one-stop-solution-to meeting management")}</p>
          {/* <Row className="w-75">
            <Col sm={12}>
              <ArrowRight
                fontSize={52}
                cursor="pointer"
                onClick={increaseStep}
              />
            </Col>
          </Row> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
