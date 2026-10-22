import React from "react";
import styles from "./EmptyState.module.css";
import { Container, Col, Row, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import emptyState from "../../../../../assets/images/EmptyUpgradePakage.svg";

const EmptyState = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/Admin/PackageDetail");
  };
  return (
    <Container>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span className={styles["UpgradeYourPakage"]}>
            {t("Upgrade-your-package")}
          </span>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <Card className={styles["UpgradePackageCard"]}>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <img
                  draggable="false"
                  src={emptyState}
                  height="205.59px"
                  width="344.2px"
                  alt=""
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Emplty_state_heading"]}>
                  {t("Enjoy-our-best-package")}
                </span>
              </Col>

              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Empty_State_SubHeading"]}>
                  {t("No-more-levels-to-climb")}
                </span>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span className={styles["Go_Back_Styles"]} onClick={handleGoBack}>
            {t("Go-back")}
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default EmptyState;
