import React, { useEffect, useState } from "react";
import styles from "./BillingMethodUserManagement.module.css";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Col, Container, Row } from "react-bootstrap";
import { Step, Stepper } from "react-form-stepper";
import { Button, Loader } from "../../../../components/elements";
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
import { paymentInitiateMainApi } from "../../../../store/actions/UserManagementActions";
import { json, useNavigate } from "react-router-dom";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import OpenPaymentForm from "../ModalsUserManagement/OpenPaymentForm/OpenPaymentForm";
const BillingMethodUsermanagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { UserManagementModals, UserMangementReducer, countryNamesReducer } =
    useSelector((state) => state);

  const [activeComponent, setActiveComponent] = useState(
    "billingContactDetails"
  );

  const [emailConditionMet, setEmailConditionMet] = useState(false);

  const [paymentMethodPage, setPaymentMethodPage] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  console.log(activeStep, "activeStepactiveStep");

  const [select, setSelect] = useState("");
  const [countryNames, setCountryNames] = useState([]);

  // states for open Iframe modal
  const [paymentSourceLink, setPaymentSourceLink] = useState(null);

  // update totalYearly from child component step three
  const [totalYearlyCharges, setTotalYearlyCharges] = useState(0);

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
  console.log(
    billingContactDetails,
    "billingContactDetailsbillingContactDetails"
  );

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
  console.log(billingAddress.Country.value, "billingAddressbillingAddress");

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

  // update totalYearly from child component step three
  const updateTotalYearlyCharges = (charges) => {
    setTotalYearlyCharges(charges);
  };

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
    if (activeStep === 0 && activeComponent === "billingContactDetails") {
      if (
        activeComponent === "billingContactDetails" &&
        billingContactDetails.Email.value !== ""
      ) {
        if (
          validateEmailEnglishAndArabicFormat(billingContactDetails.Email.value)
        ) {
          setBillingContactDetails({
            ...billingContactDetails,
            Email: {
              value: billingContactDetails.Email.value,
              errorMessage: "",
              errorStatus: billingContactDetails.Email.errorStatus,
            },
          });
          setActiveComponent("billingAddress");
          setActiveStep(1);
        } else {
          setBillingContactDetails({
            ...billingContactDetails,
            Email: {
              value: billingContactDetails.Email.value,
              errorMessage: t("Enter-valid-email-address"),
              errorStatus: billingContactDetails.Email.errorStatus,
            },
          });
        }
      } else {
        setBillingContactDetails({
          ...billingContactDetails,
          Email: {
            value: billingContactDetails.Email.value,
            errorMessage: t("Email-address-is-required"),
            errorStatus: billingContactDetails.Email.errorStatus,
          },
        });
      }
    } else if (activeStep === 1 && activeComponent === "billingAddress") {
      if (
        billingAddress.PostalCode.value !== "" &&
        billingAddress.State.value !== "" &&
        billingAddress.City.value !== "" &&
        billingAddress.Address.value !== ""
      ) {
        setBillingAddress({
          ...billingAddress,
          Country: {
            value: billingAddress.Country.value,
            errorMessage: "",
            errorStatus: billingAddress.Country.errorStatus,
          },
          PostalCode: {
            value: billingAddress.PostalCode.value,
            errorMessage: "",
            errorStatus: billingAddress.PostalCode.errorStatus,
          },
          State: {
            value: billingAddress.State.value,
            errorMessage: "",
            errorStatus: billingAddress.State.errorStatus,
          },
          City: {
            value: billingAddress.City.value,
            errorMessage: "",
            errorStatus: billingAddress.City.errorStatus,
          },
          Address: {
            value: billingAddress.Address.value,
            errorMessage: "",
            errorStatus: billingAddress.Address.errorStatus,
          },
        });
        setActiveComponent("PakageDetails");
        setActiveStep(2);
      } else {
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
    } else if (activeStep === 2 && activeComponent === "PakageDetails") {
      let newData = {
        FirstName: billingContactDetails.Name.value,
        LastName: billingContactDetails.LastName.value,
        Email: billingContactDetails.Email.value,
        Phone: billingContactDetails.Contact.value,
        Address: billingAddress.Address.value,
        Country: billingAddress.Country.value,
        City: billingAddress.City.value,
        Zip: billingAddress.PostalCode.value,
        OrderAmount: Number(totalYearlyCharges),
        OrderCurrency: "USD",
        OrderDescription: "An Order On Diskus",
      };
      dispatch(paymentInitiateMainApi(navigate, t, newData));
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

  // get Country Action Api
  useEffect(() => {
    dispatch(getCountryNamesAction(navigate, t));
  }, []);

  // to get country Names from Billing Step Two
  useEffect(() => {
    if (
      countryNamesReducer.CountryNamesData !== null &&
      countryNamesReducer.CountryNamesData !== undefined
    ) {
      console.log(countryNamesReducer.CountryNamesData, "countryOnSelect");
      setCountryNames(countryNamesReducer.CountryNamesData);
    }
  }, [countryNamesReducer.CountryNamesData]);

  //Flag Selector
  const countryOnSelect = (code) => {
    console.log(code, "countryOnSelect");
    setSelect(code);
    let a = Object.values(countryNames).find((obj) => {
      return obj.shortCode === code;
    });
    console.log(a, "countryOnSelect");
    setBillingAddress({
      ...billingAddress,
      Country: {
        value: a.shortCode,
        errorMessage: "",
        errorStatus: false, // Empty error message
      },
    });
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
                    countryOnSelect={countryOnSelect}
                    select={select}
                  />
                </>
              ) : activeStep === 2 && activeComponent === "PakageDetails" ? (
                <>
                  <BillProcessStepThree
                    updateTotalYearlyCharges={updateTotalYearlyCharges}
                  />
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
                // text={activeStep === 3 ? t("Confirm-payment") : t("Next")}
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