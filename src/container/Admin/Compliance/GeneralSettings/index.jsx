import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./generalSetting.module.css";
import { useTranslation } from "react-i18next";

const GeneralSetting = () => {
  const { t } = useTranslation();
  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col lg={6} md={6} sm={12} xs={12}>
            <div className="d-flex gap-3 align-items-center w-100 justify-content-start">
              <label className={styles["General_Setting-Main-Heading"]}>
                {t("General-setting")}
              </label>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GeneralSetting;
