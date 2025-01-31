import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import styles from "./FinalWelcomeScreen.module.css";
import { Paper } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { handleNavigation } from "../../../../commen/functions/utils";
import { useDispatch } from "react-redux";

const FinalWelcomeScreen = () => {
  //For Localization
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  let userName = localStorage.getItem("name");

  const handleClickNavigate = () => {
    handleNavigation(navigate, false, dispatch)
    document.body.style.overflow = ""
    // navigate("/Diskus")
  }
  return (
    <Container data-tut="finalwelcome-screen">
      <Row>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <section className={styles["finalwelcomescreen"]}>
            <Row className="mx-4">
              <Col sm={12} className="d-flex justify-content-start">
                <h3 className="fs-3 my-3">
                  {t("Hello")}, {userName}!
                </h3>
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={9} className="d-flex justify-content-start mr-3">
                    <p
                      className={`${"text-white fs-6 fw-normal"} ${
                        styles["text-justify-finalwelcomebox"]
                      }`}
                    >
                      <>
                        {t("You-have")} <strong>{t("3-meetings-today")}</strong>{" "}
                        {t("And")} <strong>{t("7-tasks")}</strong>{" "}
                        {t("To-complete-have-a-good-day")}
                      </>
                    </p>
                  </Col>
                  <Col sm={3}>
                    <ArrowRight
                      fontSize={38}
                      color="white"
                      cursor="pointer"
                      onClick={handleClickNavigate}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default FinalWelcomeScreen;
