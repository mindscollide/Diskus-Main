import React, { useEffect, useState } from "react";
import styles from "./BillingMethodUserManagement.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Step, Stepper } from "react-form-stepper";
import { Button } from "../../../../components/elements";
import BillProcessStepOne from "./BillProcessStepOne/BillProcessStepOne";
const BillingMethodUsermanagement = () => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
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
          <Stepper activeStep={activeStep}>
            <Step label={t("Billing-contact")} />
            <Step label={t("Billing-address")} />
            <Step label={t("Pakage-details")} />
            <Step label={t("Payment-method")} />
          </Stepper>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          {activeStep === 0 ? (
            <BillProcessStepOne />
          ) : activeStep === 1 ? (
            <>step number two</>
          ) : activeStep === 2 ? (
            <>step number three</>
          ) : activeStep === 3 ? (
            <>
              <>step number four</>
            </>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col
          lg={11}
          md={11}
          sm={11}
          xs={11}
          className="d-flex justify-content-end gap-2 "
        >
          <Button
            text={t("Next")}
            className={styles["NextbuttonBillingMethod"]}
            onClick={handleNext}
          />
          <Button
            text={t("Back")}
            className={styles["BackbuttonBillingMethod"]}
            onClick={handleBack}
          />
        </Col>
      </Row>
    </section>
  );
};

export default BillingMethodUsermanagement;
