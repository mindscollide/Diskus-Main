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
import { useSelector } from "react-redux";
import ThankForPayment from "../ModalsUserManagement/ThankForPaymentModal/ThankForPayment";
import { useDispatch } from "react-redux";
import { validateEmailEnglishAndArabicFormat } from "../../../../commen/functions/validations";
import { paymentInitiateMainApi } from "../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
const BillingMethodUsermanagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const UserManagementModalsthanksForPaymentModalData = useSelector(
    (state) => state.UserManagementModals.thanksForPaymentModal
  );

  const countryNamesReducerCountryNamesDataData = useSelector(
    (state) => state.countryNamesReducer.CountryNamesData
  );

  const UserMangementReducerLoadingData = useSelector(
    (state) => state.UserMangementReducer.Loading
  );

  const LanguageReducerLoadingData = useSelector(
    (state) => state.LanguageReducer.Loading
  );

  let OrganizationSubscriptionID = localStorage.getItem(
    "organizationSubscriptionID"
  );

  const SignupPage = localStorage.getItem("SignupFlowPageRoute");

  const [activeComponent, setActiveComponent] = useState("PakageDetails");
  const [activeStep, setActiveStep] = useState(0);

  const [select, setSelect] = useState("");
  const [countryNames, setCountryNames] = useState([]);

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
    if (activeStep === 0 && activeComponent === "PakageDetails") {
      setActiveComponent("billingContactDetails");
      setActiveStep(1);
    } else if (
      activeStep === 1 &&
      activeComponent === "billingContactDetails"
    ) {
      if (billingContactDetails.Email.value !== "") {
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
          setActiveStep(2);
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
            value: "",
            errorMessage: t("Email-address-is-required"),
            errorStatus: true,
          },
        });
      }
    } else if (activeStep === 2 && activeComponent === "billingAddress") {
      if (
        billingAddress.PostalCode.value &&
        billingAddress.State.value &&
        billingAddress.City.value &&
        billingAddress.Address.value
      ) {
        setBillingAddress({
          ...billingAddress,
          Country: {
            value: billingAddress.Country.value,
            errorMessage: "",
            errorStatus: false,
          },
          PostalCode: {
            value: billingAddress.PostalCode.value,
            errorMessage: "",
            errorStatus: false,
          },
          State: {
            value: billingAddress.State.value,
            errorMessage: "",
            errorStatus: false,
          },
          City: {
            value: billingAddress.City.value,
            errorMessage: "",
            errorStatus: false,
          },
          Address: {
            value: billingAddress.Address.value,
            errorMessage: "",
            errorStatus: false,
          },
        });

        let newData = {
          OrganizationSubscriptionID: Number(OrganizationSubscriptionID),
          OrderDescription: "A Diskus License Order",
          OrganizationBillingInformation: {
            FirstName: billingContactDetails.Name.value,
            LastName: billingContactDetails.LastName.value,
            Email: billingContactDetails.Email.value,
            Phone: billingContactDetails.Contact.value,
            Address: billingAddress.Address.value,
            FK_WorldCountryID: 1,
            City: billingAddress.City.value,
            Zip: billingAddress.PostalCode.value,
          },
        };
        dispatch(paymentInitiateMainApi(navigate, t, newData));
      } else {
        setBillingAddress({
          ...billingAddress,
          Country: {
            value: billingAddress.Country.value,
            errorMessage: t("Please-select-country"),
            errorStatus: true,
          },
          PostalCode: {
            value: billingAddress.PostalCode.value,
            errorMessage: t("Please add Postal/Zip code"),
            errorStatus: true,
          },
          State: {
            value: billingAddress.State.value,
            errorMessage: t("Please enter state/province"),
            errorStatus: true,
          },
          City: {
            value: billingAddress.City.value,
            errorMessage: t("Please enter city"),
            errorStatus: true,
          },
          Address: {
            value: billingAddress.Address.value,
            errorMessage: t("Please enter address"),
            errorStatus: true,
          },
        });
      }
    }
  };

  const handleBack = () => {
    try {
      if (activeComponent === "PakageDetails") {
        setActiveComponent("billingAddress");
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
      } else if (activeComponent === "billingAddress") {
        setActiveComponent("billingContactDetails");
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
      } else if (activeComponent === "billingContactDetails") {
        setActiveComponent("PakageDetails");
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
      } else if (activeComponent === "PakageDetails") {
        setActiveComponent("PakageDetails");
      }
    } catch {
      console.log("error on back");
    }
  };

  // get Country Action Api
  useEffect(() => {
    dispatch(getCountryNamesAction(navigate, t));
  }, []);

  // to get country Names from Billing Step Two
  useEffect(() => {
    if (
      countryNamesReducerCountryNamesDataData !== null &&
      countryNamesReducerCountryNamesDataData !== undefined
    ) {
      setCountryNames(countryNamesReducerCountryNamesDataData);
    }
  }, [countryNamesReducerCountryNamesDataData]);

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
      {SignupPage === 5 ? (
        <>
          <Row className="position-relative">
            <Col className={styles["languageSelector"]}>
              <LanguageSelector />
            </Col>
          </Row>
        </>
      ) : null}
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
                      {t("Package-details")}
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
                      {t("Billing-contact")}
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
                      {t("Billing-address")}
                    </span>
                  }
                />
              </Stepper>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {activeStep === 0 && activeComponent === "PakageDetails" ? (
                <BillProcessStepThree />
              ) : activeStep === 1 &&
                activeComponent === "billingContactDetails" ? (
                <>
                  <BillProcessStepOne
                    billingContactDetails={billingContactDetails}
                    setBillingContactDetails={setBillingContactDetails}
                  />
                </>
              ) : activeStep === 2 && activeComponent === "billingAddress" ? (
                <>
                  <BillProcessStepTwo
                    billingAddress={billingAddress}
                    setBillingAddress={setBillingAddress}
                    countryOnSelect={countryOnSelect}
                    select={select}
                  />
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
              {activeComponent === "PakageDetails" ? null : (
                <Button
                  text={t("Back")}
                  className={styles["BackbuttonBillingMethod"]}
                  onClick={handleBack}
                />
              )}

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
      {UserManagementModalsthanksForPaymentModalData && <ThankForPayment />}
      {UserMangementReducerLoadingData || LanguageReducerLoadingData ? (
        <Loader />
      ) : null}
    </Container>
  );
};

export default BillingMethodUsermanagement;
