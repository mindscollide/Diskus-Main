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
import { validateEmailEnglishAndArabicFormat } from "../../../../commen/functions/validations";
const BillingMethodUsermanagement = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);

  const [activeComponent, setActiveComponent] = useState(
    "billingContactDetails"
  );

  const [emailConditionMet, setEmailConditionMet] = useState(false);

  const [paymentMethodPage, setPaymentMethodPage] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  console.log(activeStep, "checkStep");

  //Billing Contact States
  const [billingContactDetails, setBillingContactDetails] = useState({
    Name: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    LastName: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    CompanyName: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Contact: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
  });

  //Billing Address
  const [billingAddress, setBillingAddress] = useState({
    Country: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    PostalCode: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    State: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    City: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Address: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
  });

  //Payment method
  const [paymentMethods, setPaymentMethods] = useState({
    Name: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    LastName: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    CreditCardNumber: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    CardExpirationDate: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    CVV: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
  });

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

  console.log(billingContactDetails.Email, "billingContactDetails");
  const handleNext = () => {
    if (
      activeComponent === "billingContactDetails" &&
      billingContactDetails.Email.value !== "" &&
      validateEmailEnglishAndArabicFormat(billingContactDetails.Email.value)
    ) {
      setEmailConditionMet(true);
      setActiveComponent("billingAddress");
      // Email condition is satisfied
      setActiveStep((prevActiveStep) => {
        if (prevActiveStep >= 3) {
          dispatch(showThankYouPaymentModal(true));
          return prevActiveStep;
        } else {
          return prevActiveStep < 3 ? prevActiveStep + 1 : prevActiveStep;
        }
      });
    } else if (
      billingContactDetails.Email.value !== "" &&
      !validateEmailEnglishAndArabicFormat(billingContactDetails.Email.value)
    ) {
      setBillingContactDetails({
        ...billingContactDetails,
        Email: {
          value: billingContactDetails.Email.value,
          errorMessage: t("Enter-valid-email-address"),
          errorStatus: billingContactDetails.Email.errorStatus,
        },
      });
    } else {
      // Email condition is not satisfied
      setBillingContactDetails({
        ...billingContactDetails,
        Email: {
          value: billingContactDetails.Email.value,
          errorMessage: t("Email-address-is-required"),
          errorStatus: billingContactDetails.Email.errorStatus,
        },
      });
    }

    if (emailConditionMet) {
      if (
        activeComponent === "billingAddress" &&
        billingAddress.PostalCode.value !== "" &&
        billingAddress.State.value !== "" &&
        billingAddress.City.value !== "" &&
        billingAddress.Address.value !== ""
      ) {
        setActiveComponent("PakageDetails");
        setActiveStep((prevActiveStep) => {
          if (prevActiveStep >= 3) {
            dispatch(showThankYouPaymentModal(true));
            return prevActiveStep;
          } else {
            return prevActiveStep < 3 ? prevActiveStep + 1 : prevActiveStep;
          }
        });
      } else {
        // PostalCode condition is not satisfied
        setBillingAddress({
          ...billingAddress,
          Country: {
            value: billingAddress.Country.value,
            errorMessage: t("Please-select-country"),
            errorStatus: billingAddress.Country.errorStatus,
          },
          PostalCode: {
            value: billingAddress.PostalCode.value,
            errorMessage: t("Please add Postal/Zip code"),
            errorStatus: billingAddress.PostalCode.errorStatus,
          },
          State: {
            value: billingAddress.State.value,
            errorMessage: t("Please enter state/province"),
            errorStatus: billingAddress.State.errorStatus,
          },
          City: {
            value: billingAddress.City.value,
            errorMessage: t("Please enter city"),
            errorStatus: billingAddress.City.errorStatus,
          },
          Address: {
            value: billingAddress.Address.value,
            errorMessage: t("Please enter address"),
            errorStatus: billingAddress.Address.errorStatus,
          },
        });
      }
    }

    if (activeComponent === "PakageDetails") {
      setActiveComponent("PaymentMethods");
      setActiveStep((prevActiveStep) => {
        if (prevActiveStep >= 3) {
          dispatch(showThankYouPaymentModal(true));
          return prevActiveStep;
        } else {
          return prevActiveStep < 3 ? prevActiveStep + 1 : prevActiveStep;
        }
      });
      setPaymentMethodPage(true);
    }

    if (paymentMethodPage) {
      if (
        activeComponent === "PaymentMethods" &&
        paymentMethods.Name.value !== "" &&
        paymentMethods.LastName.value !== "" &&
        paymentMethods.CreditCardNumber.value !== "" &&
        paymentMethods.CardExpirationDate.value !== "" &&
        paymentMethods.CVV.value !== ""
      ) {
        setActiveComponent("billingAddress");
        setActiveStep((prevActiveStep) => {
          if (prevActiveStep >= 3) {
            dispatch(showThankYouPaymentModal(true));
            return prevActiveStep;
          } else {
            return prevActiveStep < 3 ? prevActiveStep + 1 : prevActiveStep;
          }
        });
      } else {
        setPaymentMethods({
          ...paymentMethods,
          Name: {
            value: paymentMethods.Name.value,
            errorMessage: t("Name Required"),
            errorStatus: paymentMethods.Name.errorStatus,
          },
          LastName: {
            value: paymentMethods.LastName.value,
            errorMessage: t("LastName Required"),
            errorStatus: paymentMethods.LastName.errorStatus,
          },
          CreditCardNumber: {
            value: paymentMethods.CreditCardNumber.value,
            errorMessage: t("Credit Card Number Required"),
            errorStatus: paymentMethods.CreditCardNumber.errorStatus,
          },
          CardExpirationDate: {
            value: paymentMethods.CardExpirationDate.value,
            errorMessage: t("Card Expiration Date Required"),
            errorStatus: paymentMethods.CardExpirationDate.errorStatus,
          },
          CVV: {
            value: paymentMethods.CVV.value,
            errorMessage: t("CVV Required"),
            errorStatus: paymentMethods.CVV.errorStatus,
          },
        });
      }
    }
  };

  const handleBack = () => {
    if (activeComponent === "PaymentMethods") {
      setActiveComponent("PakageDetails");
      setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    }

    if (activeComponent === "PakageDetails") {
      setActiveComponent("billingAddress");
      setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    }

    if (activeComponent === "billingAddress") {
      setActiveComponent("billingContactDetails");
      setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    }

    if (activeComponent === "billingContactDetails") {
      //Enable payment failed modal
      dispatch(showFailedPaymentModal(true));
    }
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
                {/* <Step
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
                /> */}
              </Stepper>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {activeStep === 0 &&
              activeComponent === "billingContactDetails" ? (
                <BillProcessStepOne
                  billingContactDetails={billingContactDetails}
                  setBillingContactDetails={setBillingContactDetails}
                />
              ) : activeStep === 1 && activeComponent === "billingAddress" ? (
                <>
                  <BillProcessStepTwo
                    billingAddress={billingAddress}
                    setBillingAddress={setBillingAddress}
                  />
                </>
              ) : activeStep === 2 && activeComponent === "PakageDetails" ? (
                <>
                  <BillProcessStepThree />
                </>
              ) : // : activeStep === 3 && activeComponent === "PaymentMethods" ? (
              //   <>
              //     <>
              //       <BillProcessStepFour
              //         paymentMethods={paymentMethods}
              //         setPaymentMethods={setPaymentMethods}
              //       />
              //     </>
              //   </>
              // )
              null}
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
                text={activeStep === 3 ? t("Confirm-payment") : t("Next")}
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
