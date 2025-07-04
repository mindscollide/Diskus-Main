import React, { useEffect, useState } from "react";
import styles from "./SignUpOrganizationUM.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Spinner, Container, Row, Col, Form } from "react-bootstrap";
import DiskusnewRoundIconSignUp from "../../../../assets/images/newElements/DiskusWhiteGroupIcon.svg";
import { Button, TextField } from "../../../../components/elements";
import { validateEmailEnglishAndArabicFormat } from "../../../../commen/functions/validations";
import { countryNameforPhoneNumber } from "../../../Admin/AllUsers/AddUser/CountryJson";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import ReactFlagsSelect from "react-flags-select";
import { Check2 } from "react-bootstrap-icons";
import {
  LoginFlowRoutes,
  signUpFlowRoutes,
  signUpOrganizationAndPakageSelection,
} from "../../../../store/actions/UserManagementActions";
import {
  checkEmailExsist,
  checkOraganisation,
} from "../../../../store/actions/Admin_Organization";
import { setLoader } from "../../../../store/actions/Auth2_actions";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const SignUpOrganizationUM = ({ setStoredStep }) => {
  const { t } = useTranslation();

  const countryNamesReducerCountryNamesData = useSelector(
    (state) => state.countryNamesReducer.CountryNamesData
  );

  const adminReducerOrganisationCheckData = useSelector(
    (state) => state.adminReducer.OrganisationCheck
  );

  const adminReducerEmailCheckData = useSelector(
    (state) => state.adminReducer.EmailCheck
  );

  const adminReducerOrganizationCheckSpinnerData = useSelector(
    (state) => state.adminReducer.OrganizationCheckSpinner
  );

  const adminReducerEmailCheckSpinnerData = useSelector(
    (state) => state.adminReducer.EmailCheckSpinner
  );

  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let packageSubscriptionDetail = JSON.parse(
    localStorage.getItem("packageSubscriptionDetail")
  );

  const [signUpDetails, setSignUpDetails] = useState({
    CompanyName: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    CountryName: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Address1: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Address2: {
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
    PostalCode: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    FullName: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    PhoneNumber: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    FK_CCID: 230,
    PhoneNumberCountryID: 212,
  });
  const [isFreeTrail, setIsFreeTrail] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [isCompanyNameUnique, setCompanyNameUnique] = useState(false);
  const [isEmailUnique, setEmailUnique] = useState(false);
  const [countryNames, setCountryNames] = useState([]);
  const [companyNameValidate, setCompanyNameValidate] = useState(false);
  const [companyNameValidateError, setCompanyNameValidateError] = useState("");
  const [companyEmailValidate, setCompanyEmailValidate] = useState(false);
  const [companyEmailValidateError, setCompanyEmailValidateError] =
    useState("");
  const [againCall, setAgainCall] = useState(false);

  const [selected, setSelected] = useState("US");

  // onselect for reactflagselect country dropdown
  const [select, setSelect] = useState("");

  useEffect(() => {
    if (location.state !== null) {
      if (location.state.freeTrail) {
        setIsFreeTrail(true);
      }
    }
  }, [location.state]);

  const countryOnSelect = (code) => {
    setSelect(code);
    let a = Object.values(countryNames).find((obj) => {
      return obj.shortCode === code;
    });
    console.log("aaaa", a);
    if (a !== undefined) {
      setSelect(code);
      setSignUpDetails({
        ...signUpDetails,
        CountryName: {
          value: a.pK_WorldCountryID,
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      setSelect("");
      setSignUpDetails({
        ...signUpDetails,
        CountryName: {
          value: "",
          errorMessage: t("Country-id-not-found"),
          errorStatus: false,
        },
      });
    }
  };

  const handleSelect = (country) => {
    setSelected(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary === country;
    });
    setSignUpDetails({
      ...signUpDetails,
      FK_CCID: a.id,
      PhoneNumberCountryID: a.id,
    });
  };

  useEffect(() => {
    dispatch(getCountryNamesAction(navigate, t));

    let findUSCountryID = countryNameforPhoneNumber.US.id;
    let findUSCountryCode = countryNameforPhoneNumber.US.primary;
    setSignUpDetails({
      ...signUpDetails,
      PhoneNumberCountryID: findUSCountryID,
    });
    setSelected(findUSCountryCode);
  }, []);

  const handeEmailvlidate = () => {
    if (signUpDetails.Email.value !== "") {
      if (validateEmailEnglishAndArabicFormat(signUpDetails.Email.value)) {
        dispatch(
          checkEmailExsist(
            setCompanyEmailValidate,
            setCompanyEmailValidateError,
            signUpDetails,
            t,
            setEmailUnique
          )
        );
      } else {
        setEmailUnique(false);
        setSignUpDetails({
          ...signUpDetails,
          Email: {
            value: signUpDetails.Email.value,
            errorMessage: t("Enter-valid-email-address"),
            errorStatus: true,
          },
        });
      }
    } else {
      setEmailUnique(false);
      setSignUpDetails({
        ...signUpDetails,
        Email: {
          value: "",
          errorMessage: t("Enter-email-address"),
          errorStatus: true,
        },
      });
    }
  };

  const signupValuesChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "CompanyName" && value !== "") {
      setSignUpDetails({
        ...signUpDetails,
        CompanyName: {
          value: value.trimStart(),
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else if (name === "CompanyName" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        CompanyName: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "Address1" && value !== "") {
      if (value !== "") {
        setSignUpDetails({
          ...signUpDetails,
          Address1: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Address1" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        Address1: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "Address2" && value !== "") {
      if (value !== "") {
        setSignUpDetails({
          ...signUpDetails,
          Address2: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Address2" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        Address2: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "State" && value !== "") {
      const valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          State: {
            value: valueCheck.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "State" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        State: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "City" && value !== "") {
      const valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          City: {
            value: valueCheck.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "City" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        City: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "PostalCode" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          PostalCode: {
            value: valueCheck.trimStart(),
            errorMessage: "Postal Code is Required",
            errorStatus: false,
          },
        });
      }
    } else if (name === "PostalCode" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        PostalCode: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "FullName" && value !== "") {
      const valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          FullName: {
            value: valueCheck.trimStart(),
            errorMessage: "Full Name is required",
            errorStatus: false,
          },
        });
      }
    } else if (name === "FullName" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        FullName: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "Email" && value !== "") {
      if (value !== "") {
        setSignUpDetails({
          ...signUpDetails,
          Email: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Email" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "PhoneNumber" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          PhoneNumber: {
            value: valueCheck.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "PhoneNumber" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        PhoneNumber: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  const handlerSignup = async () => {
    console.log("handlerSignup", isFreeTrail);
    if (isFreeTrail === true) {
      if (
        signUpDetails.CompanyName.value !== "" &&
        signUpDetails.FullName.value !== "" &&
        signUpDetails.Email.value !== "" &&
        signUpDetails.PhoneNumber.value !== "" &&
        signUpDetails.CountryName.value !== ""
      ) {
        if (validateEmailEnglishAndArabicFormat(signUpDetails.Email.value)) {
          if (
            adminReducerOrganisationCheckData !== false &&
            adminReducerEmailCheckData !== false
          ) {
            let PackageID = localStorage.getItem("PackageID");
            let tenureOfSuscriptionID = localStorage.getItem(
              "TenureOfSuscriptionID"
            );

            let data = {
              TenureOfSubscriptionID: JSON.parse(tenureOfSuscriptionID),
              Organization: {
                OrganizationName: signUpDetails.CompanyName.value,
                FK_WorldCountryID: signUpDetails.CountryName.value,
                ContactPersonName: signUpDetails.FullName.value,
                ContactPersonEmail: signUpDetails.Email.value,
                ContactPersonNumber: signUpDetails.PhoneNumber.value,
                FK_NumberWorldCountryID: JSON.parse(
                  signUpDetails.PhoneNumberCountryID
                ),
                CustomerReferenceNumber: "",
                PersonalNumber: signUpDetails.PhoneNumber.value,
                OrganizationAddress1: signUpDetails.Address1.value,
                OrganizationAddress2: signUpDetails.Address2.value,
                City: signUpDetails.City.value,
                StateProvince: signUpDetails.State.value,
                PostalCode: signUpDetails.PostalCode.value,
                TimeZoneID: 1,
              },
              Packages: [{ PackageID: Number(PackageID), HeadCount: 20 }],
            };
            dispatch(signUpOrganizationAndPakageSelection(data, navigate, t));
          } else {
            await dispatch(setLoader(true));
            await dispatch(
              checkOraganisation(
                setCompanyNameValidate,
                setCompanyNameValidateError,
                signUpDetails,
                t,
                setCompanyNameUnique
              )
            );
            handeEmailvlidate();
            setAgainCall(true);
          }
        } else {
          showMessage(t("Email-should-be-in-email-format"), "error", setOpen);
        }
      } else {
        setSignUpDetails({
          ...signUpDetails,
          // CompanyName: {
          //   value: signUpDetails.CompanyName.value,
          //   errorMessage:
          //     signUpDetails.CompanyName.value === ""
          //       ? `${(t("Company-name-is-required"), locale)}`
          //       : signUpDetails.CompanyName.errorMessage,
          //   errorStatus:
          //     signUpDetails.CompanyName.value === ""
          //       ? true
          //       : signUpDetails.CompanyName.errorStatus,
          // },
          CountryName: {
            value: signUpDetails.CountryName.value,
            errorMessage:
              signUpDetails.CountryName.value === ""
                ? t("Please-select-country")
                : signUpDetails.CountryName.errorMessage,
            errorStatus:
              signUpDetails.CountryName.value === ""
                ? true
                : signUpDetails.CountryName.errorStatus,
          },
          Address1: {
            value: signUpDetails.Address1.value,
            errorMessage:
              signUpDetails.Address1.value === ""
                ? t("Address-1-is-required")
                : signUpDetails.Address1.errorMessage,
            errorStatus:
              signUpDetails.Address1.value === ""
                ? true
                : signUpDetails.Address1.errorStatus,
          },
          Address2: {
            value: signUpDetails.Address2.value,
            errorMessage:
              signUpDetails.Address2.value === ""
                ? t("Address-2-is-required")
                : signUpDetails.Address2.errorMessage,
            errorStatus:
              signUpDetails.Address2.value === ""
                ? true
                : signUpDetails.Address2.errorStatus,
          },
          State: {
            value: signUpDetails.State.value,
            errorMessage: "",
          },
          City: {
            value: signUpDetails.City.value,
            errorMessage: "",
          },
          PostalCode: {
            value: signUpDetails.PostalCode.value,
            errorMessage: "",
          },
          FullName: {
            value: signUpDetails.FullName.value,
            errorMessage:
              signUpDetails.FullName.value === ""
                ? t("Full-name-is-required")
                : signUpDetails.FullName.errorMessage,
            errorStatus:
              signUpDetails.FullName.value === ""
                ? true
                : signUpDetails.FullName.errorStatus,
          },
          Email: {
            value: signUpDetails.Email.value,
            errorMessage:
              signUpDetails.Email.value === ""
                ? t("Email-address-is-required")
                : signUpDetails.Email.errorMessage,
            errorStatus: signUpDetails.Email.errorStatus,
          },
          PhoneNumber: {
            value: signUpDetails.PhoneNumber.value,
            errorMessage:
              signUpDetails.PhoneNumber.value === ""
                ? t("Phone-number-is-required")
                : signUpDetails.PhoneNumber.errorMessage,
            errorStatus:
              signUpDetails.PhoneNumber.value === ""
                ? true
                : signUpDetails.PhoneNumber.errorStatus,
          },
        });

        showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
      }
    } else {
      //if its not a free trial in User Management
      if (
        signUpDetails.CompanyName.value !== "" &&
        signUpDetails.FullName.value !== "" &&
        signUpDetails.Email.value !== "" &&
        signUpDetails.PhoneNumber.value !== "" &&
        signUpDetails.CountryName.value !== ""
      ) {
        if (validateEmailEnglishAndArabicFormat(signUpDetails.Email.value)) {
          if (
            adminReducerOrganisationCheckData !== false &&
            adminReducerEmailCheckData !== false
          ) {
            let data = {
              TenureOfSubscriptionID: Number(
                packageSubscriptionDetail.TenureOfSubscriptionID
              ),
              Organization: {
                OrganizationName: signUpDetails.CompanyName.value,
                FK_WorldCountryID: JSON.parse(signUpDetails.CountryName.value),
                ContactPersonName: signUpDetails.FullName.value,
                ContactPersonEmail: signUpDetails.Email.value,
                ContactPersonNumber: signUpDetails.PhoneNumber.value,
                FK_NumberWorldCountryID: JSON.parse(
                  signUpDetails.PhoneNumberCountryID
                ),
                CustomerReferenceNumber: "",
                PersonalNumber: signUpDetails.PhoneNumber.value,
                OrganizationAddress1: signUpDetails.Address1.value,
                OrganizationAddress2: signUpDetails.Address2.value,
                City: signUpDetails.City.value,
                StateProvince: signUpDetails.State.value,
                PostalCode: signUpDetails.PostalCode.value,
                TimeZoneID: 1,
              },
              Packages: packageSubscriptionDetail.Packages,
            };
            dispatch(signUpOrganizationAndPakageSelection(data, navigate, t));
          } else {
            await dispatch(setLoader(true));
            await dispatch(
              checkOraganisation(
                setCompanyNameValidate,
                setCompanyNameValidateError,
                signUpDetails,
                t,
                setCompanyNameUnique
              )
            );
            handeEmailvlidate();
            setAgainCall(true);
          }
        } else {
          showMessage(t("Email-should-be-in-email-format"), "error", setOpen);
        }
      } else {
        setSignUpDetails({
          ...signUpDetails,
          CompanyName: {
            value: signUpDetails.CompanyName.value,
            errorMessage:
              signUpDetails.CompanyName.value === ""
                ? t("Company-name-is-required")
                : signUpDetails.CompanyName.errorMessage,
            errorStatus:
              signUpDetails.CompanyName.value === ""
                ? true
                : signUpDetails.CompanyName.errorStatus,
          },
          CountryName: {
            value: signUpDetails.CountryName.value,
            errorMessage:
              signUpDetails.CountryName.value === ""
                ? t("Country-name-is-required")
                : signUpDetails.CountryName.errorMessage,
            errorStatus:
              signUpDetails.CountryName.value === ""
                ? true
                : signUpDetails.CountryName.errorStatus,
          },
          Address1: {
            value: signUpDetails.Address1.value,
            errorMessage:
              signUpDetails.Address1.value === ""
                ? t("Address-1-is-required")
                : signUpDetails.Address1.errorMessage,
            errorStatus:
              signUpDetails.Address1.value === ""
                ? true
                : signUpDetails.Address1.errorStatus,
          },
          Address2: {
            value: signUpDetails.Address2.value,
            errorMessage:
              signUpDetails.Address2.value === ""
                ? t("Address-2-is-required")
                : signUpDetails.Address2.errorMessage,
            errorStatus:
              signUpDetails.Address2.value === ""
                ? true
                : signUpDetails.Address2.errorStatus,
          },
          State: {
            value: signUpDetails.State.value,
            errorMessage: "",
          },
          City: {
            value: signUpDetails.City.value,
            errorMessage: "",
          },
          PostalCode: {
            value: signUpDetails.PostalCode.value,
            errorMessage: "",
          },
          FullName: {
            value: signUpDetails.FullName.value,
            errorMessage:
              signUpDetails.FullName.value === ""
                ? t("Full-name-is-required")
                : signUpDetails.FullName.errorMessage,
            errorStatus:
              signUpDetails.FullName.value === ""
                ? true
                : signUpDetails.FullName.errorStatus,
          },
          Email: {
            value: signUpDetails.Email.value,
            errorMessage:
              signUpDetails.Email.value === ""
                ? t("Email-address-is-required")
                : signUpDetails.Email.errorMessage,
            errorStatus: signUpDetails.Email.errorStatus,
          },
          PhoneNumber: {
            value: signUpDetails.PhoneNumber.value,
            errorMessage:
              signUpDetails.PhoneNumber.value === ""
                ? t("Phone-number-is-required")
                : signUpDetails.PhoneNumber.errorMessage,
            errorStatus:
              signUpDetails.PhoneNumber.value === ""
                ? true
                : signUpDetails.PhoneNumber.errorStatus,
          },
        });
        showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
      }
    }
  };

  useEffect(() => {
    if (companyNameValidateError !== "") {
      setSignUpDetails({
        ...signUpDetails,
        CompanyName: {
          value: signUpDetails.CompanyName.value,
          errorMessage: companyNameValidateError,
          errorStatus: companyNameValidate,
        },
      });
    }
  }, [companyNameValidate, companyNameValidateError]);

  useEffect(() => {
    if (companyEmailValidateError !== " ") {
      setSignUpDetails({
        ...signUpDetails,
        Email: {
          value: signUpDetails.Email.value,
          errorMessage: companyEmailValidateError,
          errorStatus: companyEmailValidate,
        },
      });
    }
  }, [companyEmailValidate, companyEmailValidateError]);

  useEffect(() => {
    if (
      againCall &&
      adminReducerOrganisationCheckData &&
      adminReducerEmailCheckData
    ) {
      setAgainCall(false);
    } else {
      setAgainCall(false);
    }
  }, [
    againCall,
    adminReducerOrganisationCheckData,
    adminReducerEmailCheckData,
  ]);

  useEffect(() => {
    if (
      countryNamesReducerCountryNamesData !== null &&
      countryNamesReducerCountryNamesData !== undefined
    ) {
      setCountryNames(countryNamesReducerCountryNamesData);
    }
  }, [countryNamesReducerCountryNamesData]);

  const onClickLink = async () => {
    if (isFreeTrail === true) {
      localStorage.removeItem("SignupFlowPageRoute");
      localStorage.setItem("LoginFlowPageRoute", 1);
      await dispatch(LoginFlowRoutes(1));
      navigate("/");
    } else {
      setStoredStep(1);
      localStorage.setItem("SignupFlowPageRoute", 1);
      await dispatch(signUpFlowRoutes(1));
    }
  };

  return (
    <>
      <Container
        fluid
        className={`${"SignupOrganization"} ${styles["signUp_Container"]}`}
      >
        <Row className="position-relative">
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col sm={12} lg={7} md={7} className={styles["signUp_LeftSection"]}>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["sigup_form_leftSection"]}
            >
              <Row>
                <Col
                  sm={12}
                  lg={12}
                  md={12}
                  className={styles["signUpform_bg"]}
                >
                  {/* Oranization form */}
                  <h4 className={styles["signup_organization_title"]}>
                    {t("Organization-details")}
                  </h4>
                  <Row className="mb-3">
                    <Col
                      sm={12}
                      lg={6}
                      md={6}
                      className={styles["checkOrganization"]}
                    >
                      <Row>
                        <span className={styles["Heading"]}>
                          {t("Company-name")}
                          <span className={styles["RedSteric"]}>*</span>
                        </span>
                      </Row>
                      <TextField
                        onBlur={() => {
                          dispatch(
                            checkOraganisation(
                              setCompanyNameValidate,
                              setCompanyNameValidateError,
                              signUpDetails,
                              t,
                              setCompanyNameUnique
                            )
                          );
                        }}
                        autofill
                        labelclass="d-none"
                        applyClass={"sign-up-textfield-input MontserratMedium"}
                        placeholder={t("Company-name")}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.CompanyName.value || ""}
                        name="CompanyName"
                        maxLength={150}
                      />
                      <Row>
                        <Col>
                          {!isCompanyNameUnique && (
                            <p
                              className={
                                (signUpDetails.CompanyName.errorStatus &&
                                  signUpDetails.CompanyName.value === "") ||
                                signUpDetails.CompanyName.errorMessage !== ""
                                  ? ` ${styles["errorMessageCompany"]} `
                                  : `${styles["errorMessageCompany_hidden"]}`
                              }
                            >
                              {signUpDetails.CompanyName.value === ""
                                ? t("Company-name-is-required")
                                : signUpDetails.CompanyName.errorMessage}
                            </p>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={1} lg={1}>
                      {adminReducerOrganizationCheckSpinnerData ? (
                        <Spinner
                          className={styles["checkOrganiationSpinner"]}
                        />
                      ) : null}
                      {isCompanyNameUnique && (
                        <Check2 className={styles["isCompanyNameUnique"]} />
                      )}
                    </Col>
                    <Col
                      sm={12}
                      lg={5}
                      md={5}
                      className={styles["react-flag-Info-Signup"]}
                    >
                      <Row>
                        <span className={styles["Heading"]}>
                          {t("Country")}
                        </span>
                      </Row>
                      <ReactFlagsSelect
                        disabled={countryNames.length === 0 ? true : false}
                        selected={select}
                        className={
                          countryNames.length === 0
                            ? styles["country_ids_disabled"]
                            : styles["country_ids"]
                        }
                        onSelect={countryOnSelect}
                        searchable={true}
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              signUpDetails.CountryName.errorStatus &&
                              signUpDetails.CountryName.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {signUpDetails.CountryName.value === ""
                              ? t("Please-select-country")
                              : signUpDetails.CountryName.errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12}>
                      <Row>
                        <span className={styles["Heading"]}>
                          {t("Address")}
                        </span>
                      </Row>
                      <TextField
                        labelclass="d-none"
                        placeholder={t("Address")}
                        maxLength={100}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Address1.value || ""}
                        name="Address1"
                        applyClass="form-control2 MontserratMedium"
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={12} md={4} lg={4}>
                      <Row>
                        <span className={styles["Heading"]}>
                          {t("State-province")}
                        </span>
                      </Row>
                      <TextField
                        labelclass="d-none"
                        placeholder={t("State-province")}
                        maxLength={70}
                        change={signupValuesChangeHandler}
                        name="State"
                        value={signUpDetails.State.value || ""}
                        applyClass="form-control2 MontserratMedium"
                      />
                      <Row>
                        <Col>
                          <p className={styles["errorMessage_hidden"]}></p>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <Row>
                        <span className={styles["Heading"]}>{t("City")}</span>
                      </Row>
                      <TextField
                        labelclass="d-none"
                        placeholder={t("City")}
                        name="City"
                        maxLength={70}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.City.value || ""}
                        applyClass="form-control2 MontserratMedium"
                      />
                      <Row>
                        <Col>
                          <p className={styles["errorMessage_hidden"]}></p>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <Row>
                        <span className={styles["Heading"]}>
                          {t("Postal-zipcode")}
                        </span>
                      </Row>
                      <TextField
                        labelclass="d-none"
                        placeholder={t("Postal-zipcode")}
                        maxLength={10}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.PostalCode.value || ""}
                        name="PostalCode"
                        applyClass="form-control2 MontserratMedium"
                      />
                      <Row>
                        <Col>
                          <p className={styles["errorMessage_hidden"]}></p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {/* Admin Details form */}
                  <h4 className={styles["signup_admin_title"]}>
                    {t("Admin-details")}
                  </h4>
                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12}>
                      <Row>
                        <span className={styles["Heading"]}>
                          {t("Full-name")}
                          <span className={styles["RedSteric"]}>*</span>
                        </span>
                      </Row>
                      <TextField
                        labelclass="d-none"
                        placeholder={t("Full-name")}
                        name="FullName"
                        change={signupValuesChangeHandler}
                        value={signUpDetails.FullName.value || ""}
                        applyClass={
                          styles["SignUp_inputField MontserratMedium"]
                        }
                        maxLength={200}
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              signUpDetails.FullName.errorStatus &&
                              signUpDetails.FullName.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {signUpDetails.FullName.value === ""
                              ? t("Full-name-is-required")
                              : signUpDetails.FullName.errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={5} lg={5} className={styles["checkEmail"]}>
                      <Row>
                        <span className={styles["Heading"]}>
                          {t("Email")}
                          <span className={styles["RedSteric"]}>*</span>
                        </span>
                      </Row>
                      <TextField
                        onBlur={() => {
                          handeEmailvlidate();
                        }}
                        labelclass="d-none"
                        placeholder={t("Work-email-address")}
                        name="Email"
                        type="email"
                        maxLength={160}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Email.value || ""}
                        applyClass="form-control2 MontserratMedium"
                      />
                      <Row>
                        <Col>
                          {!isEmailUnique && (
                            <p
                              className={
                                (signUpDetails.Email.errorStatus &&
                                  signUpDetails.Email.value === "") ||
                                signUpDetails.Email.errorMessage !== ""
                                  ? ` ${styles["errorMessage"]} `
                                  : `${styles["errorMessage_hidden"]}`
                              }
                            >
                              {signUpDetails.Email.value === ""
                                ? t("Email-address-is-required")
                                : signUpDetails.Email.errorMessage}
                            </p>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={1} lg={1} className="position-relative">
                      {adminReducerEmailCheckSpinnerData ? (
                        <Spinner className={styles["checkEmailSpinner"]} />
                      ) : null}
                      {isEmailUnique && (
                        <Check2 className={styles["isEmailUnique"]} />
                      )}
                    </Col>
                    <Col
                      sm={12}
                      md={6}
                      lg={6}
                      className={styles["phoneNumber"]}
                    >
                      <Row>
                        <Row>
                          <span className={styles["Heading"]}>
                            {t("Phone-number")}
                            <span className={styles["RedSteric"]}>*</span>
                          </span>
                        </Row>
                        <Col
                          lg={3}
                          md={3}
                          sm={12}
                          className={styles["react-flag-Signup"]}
                        >
                          <ReactFlagsSelect
                            fullWidth={false}
                            selected={selected}
                            onSelect={handleSelect}
                            searchable={true}
                            placeholder={"Select Co...."}
                            customLabels={countryNameforPhoneNumber}
                            className={styles["dropdown-countrylist"]}
                          />
                        </Col>
                        <Col
                          lg={9}
                          md={9}
                          sm={10}
                          className="d-flex justify-content-end"
                        >
                          <Form.Control
                            className={styles["Form-PhoneInput-field"]}
                            name="PhoneNumber"
                            placeholder={t("Enter-phone-number")}
                            applyClass="form-control2"
                            maxLength={15}
                            minLength={4}
                            onChange={signupValuesChangeHandler}
                            value={signUpDetails.PhoneNumber.value || ""}
                          />
                        </Col>
                        <Row>
                          <Col>
                            <p
                              className={
                                signUpDetails.PhoneNumber.errorStatus &&
                                signUpDetails.PhoneNumber.value === ""
                                  ? ` ${styles["errorMessage"]} `
                                  : `${styles["errorMessage_hidden"]}`
                              }
                            >
                              {signUpDetails.PhoneNumber.value === ""
                                ? t("Phone-number-is-required")
                                : signUpDetails.PhoneNumber.errorMessage}
                            </p>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col
                  sm={7}
                  md={7}
                  lg={7}
                  className="d-flex justify-content-start align-items-center"
                >
                  <span
                    onClick={onClickLink}
                    className={styles["signUp_goBack"]}
                  >
                    {t("Go-back")}
                  </span>
                </Col>
                <Col
                  sm={5}
                  md={5}
                  lg={5}
                  className="d-flex justify-content-end align-items-center"
                >
                  <Button
                    text={t("Next")}
                    onClick={handlerSignup}
                    className={styles["signUp_NextBtn"]}
                  />
                </Col>
              </Row>
            </Col>
          </Col>
          <Col sm={12} lg={5} md={5} className={styles["signUp_rightSection"]}>
            <img
              draggable="false"
              src={DiskusnewRoundIconSignUp}
              width="500px"
              alt=""
              className={styles["rightsection_roundLogo"]}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUpOrganizationUM;
