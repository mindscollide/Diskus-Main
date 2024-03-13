import React, { useEffect, useState } from "react";
import styles from "./BillingMethodUserManagement.module.css";
import { useTranslation } from "react-i18next";
import { Col, Container, Row } from "react-bootstrap";
import { Step, Stepper } from "react-form-stepper";
import { Button } from "../../../../components/elements";
import BillProcessStepOne from "./BillProcessStepOne/BillProcessStepOne";
import BillProcessStepTwo from "./BillProcessStepTwo/BillProcessStepTwo";
import BillProcessStepThree from "./BillProcessStepThree/BillProcessStepThree";
import BillProcessStepFour from "./BillProcessStepFour/BillProcessStepFour";
const BillingMethodUsermanagement = () => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep < 4 ? prevActiveStep + 1 : prevActiveStep
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
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
    <Container className={styles["sectionStyling"]}>
      <Row className="mt-4">
        <Col
          lg={12}
          md={12}
          sm={12}
          XS={12}
          className="d-flex justify-content-center"
        >
          <span className={styles["BillingDetailsHeading"]}>
            {t("Billing-details")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Stepper activeStep={activeStep}>
            <Step
              label={
                <span
                  className={
                    activeStep >= 0
                      ? "billing-contactActive"
                      : "billing-contact"
                  }
                >
                  {t("Billing-contact")}
                </span>
              }
            />
            <Step
              label={
                <span
                  className={
                    activeStep >= 1
                      ? "billing-addressActive"
                      : "billing-address"
                  }
                >
                  {t("Billing-address")}
                </span>
              }
            />
            <Step
              label={
                <span
                  className={
                    activeStep >= 2
                      ? "package-detailsActive"
                      : "package-details"
                  }
                >
                  {t("Package-details")}
                </span>
              }
            />
            <Step
              label={
                <span
                  className={
                    activeStep >= 3 ? "payment-methodActive" : "payment-method"
                  }
                >
                  {t("Payment-method")}
                </span>
              }
            />
          </Stepper>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          {activeStep === 0 ? (
            <BillProcessStepOne />
          ) : activeStep === 1 ? (
            <>
              <BillProcessStepTwo />
            </>
          ) : activeStep === 2 ? (
            <>
              <BillProcessStepThree />
            </>
          ) : activeStep === 3 ? (
            <>
              <>
                <BillProcessStepFour />
              </>
            </>
          ) : null}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Back")}
            className={styles["BackbuttonBillingMethod"]}
            onClick={handleBack}
          />
          <Button
            text={t("Next")}
            className={styles["NextbuttonBillingMethod"]}
            onClick={handleNext}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default BillingMethodUsermanagement;
