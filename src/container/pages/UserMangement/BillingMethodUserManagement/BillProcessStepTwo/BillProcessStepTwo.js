import React from "react";
import styles from "./BillProcessStepTwo.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import locationImage from "../../../../../assets/images/Location.svg";
const BillProcessStepTwo = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className={styles["outerBoxForBilling"]}
        >
          <Row className="mt-5">
            <Col lg={7} md={7} sm={12} xs={12}>
              <Row className="mt-2">
                <Col lg={6} md={6} sm={12} xs={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <span className={styles["nameStyles"]}>
                        {t("Country")}
                        <span className={styles["stericClass"]}>*</span>
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Select placeholder={t("Country")} />
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Postal-zipcode")}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("State-province")}{" "}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                  />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("City")}{" "}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Address")}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                  />
                </Col>
              </Row>
            </Col>
            <Col
              lg={5}
              md={5}
              sm={12}
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <img src={locationImage} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BillProcessStepTwo;
