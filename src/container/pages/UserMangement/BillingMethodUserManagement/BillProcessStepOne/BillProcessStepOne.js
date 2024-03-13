import React from "react";
import styles from "./BillProcessStepOne.module.css";
import BillingFrame from "../../../../../assets/images/BillingContactFrame.svg";
import { Col, Container, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
const BillProcessStepOne = () => {
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
                  <TextField
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Name")}
                        </span>
                      </>
                    }
                    placeholder={t("First-name")}
                  />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField placeholder={t("Last-name")} />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Company-name")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Company-name")}
                        </span>
                      </>
                    }
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Email")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Email")}{" "}
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
              <img src={BillingFrame} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BillProcessStepOne;
