import React, { useEffect } from "react";
import styles from "./BillingMethodUserManagement.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Step, Stepper } from "react-form-stepper";
const BillingMethodUsermanagement = () => {
  const { t } = useTranslation();
  //React Stepper Numbers manuipulation
  useEffect(() => {
    const firstvaue = document.querySelector(".StepButtonContent-d1-0-3-7");
    const secondvaue = document.querySelector(".StepButtonContent-d3-0-3-13");
    const thirdvaue = document.querySelector(".StepButtonContent-d5-0-3-21");

    const fourthvaue = document.querySelector(".StepButtonContent-d7-0-3-27");

    console.log(
      firstvaue,
      secondvaue,
      thirdvaue,
      fourthvaue,
      "firstvauefirstvaue"
    );
    if (firstvaue) {
      // Set the new value
      firstvaue.innerText = "01";
    }
    if (secondvaue) {
      secondvaue.innerText = "02";
    }
    if (thirdvaue) {
      thirdvaue.innerText = "03";
    }
    if (fourthvaue) {
      fourthvaue.innerText = "04";
    }
  }, []);
  return (
    <section>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span className={styles["BillingDetailsHeading"]}>
            {t("Billing-details")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Stepper activeStep={1}>
            <Step label={t("Billing-contact")} />
            <Step label={t("Billing-address")} />
            <Step label={t("Pakage-details")} />
            <Step label={t("Payment-method")} />
          </Stepper>
        </Col>
      </Row>
    </section>
  );
};

export default BillingMethodUsermanagement;
