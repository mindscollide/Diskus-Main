import React, { useEffect, useState } from "react";
import styles from "./BillingMethodUserManagement.module.css";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Col, Container, Row } from "react-bootstrap";
import { Step, Stepper } from "react-form-stepper";
import { Button } from "../../../../components/elements";
import BillProcessStepOne from "./BillProcessStepOne/BillProcessStepOne";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import BillProcessStepTwo from "./BillProcessStepTwo/BillProcessStepTwo";
import BillProcessStepThree from "./BillProcessStepThree/BillProcessStepThree";
import BillProcessStepFour from "./BillProcessStepFour/BillProcessStepFour";
import { useSelector } from "react-redux";
import ThankForPayment from "../ModalsUserManagement/ThankForPaymentModal/ThankForPayment";
import {
  showFailedPaymentModal,
  showThankYouPaymentModal,
} from "../../../../store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import PaymentFailedModal from "../ModalsUserManagement/PaymentFailedModal/PaymentFailedModal";
const BillingMethodUsermanagement = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);

  const [activeStep, setActiveStep] = useState(0);

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep >= 3) {
        dispatch(showThankYouPaymentModal(true));
        return prevActiveStep;
      } else {
        return prevActiveStep < 4 ? prevActiveStep + 1 : prevActiveStep;
      }
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    //Enable payment failed modal
    // dispatch(showFailedPaymentModal(true));
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
      <Row className="position-relative">
        <Col className={styles["languageSelector"]}>
          <LanguageSelector />
        </Col>
      </Row>
      <Row>
        <Col lg={1} md={1} sm={12} xs={12}></Col>
        <Col lg={10} md={10} sm={12} xs={12}>
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
                        activeStep >= 3
                          ? "payment-methodActive"
                          : "payment-method"
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
        </Col>
        <Col lg={1} md={1} sm={12} xs={12}></Col>
      </Row>
      {UserManagementModals.thanksForPaymentModal && <ThankForPayment />}
      {UserManagementModals.paymentProceedFailed && <PaymentFailedModal />}
    </Container>
  );
};

export default BillingMethodUsermanagement;