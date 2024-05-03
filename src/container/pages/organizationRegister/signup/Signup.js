import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import { Spinner, Container, Row, Col, Form } from "react-bootstrap";
import { Check2 } from "react-bootstrap-icons";
import {
  Button,
  Notification,
  TextField,
  Loader,
} from "../../../../components/elements";
import DiskusnewRoundIconSignUp from "../../../../assets/images/newElements/Diskus_newRoundIcon_SignUp.svg";
import { validateEmailEnglishAndArabicFormat } from "../../../../commen/functions/validations";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../../i18n";
import { countryNameforPhoneNumber } from "../../../Admin/AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";
import "react-phone-input-2/lib/style.css";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrganization,
  setLoader,
} from "../../../../store/actions/Auth2_actions";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import {
  checkEmailExsist,
  checkOraganisation,
} from "../../../../store/actions/Admin_Organization";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";

const Signup = () => {
  const { t } = useTranslation();
  const { countryNamesReducer, Authreducer, adminReducer, LanguageReducer } =
    useSelector((state) => state);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCompanyNameUnique, setCompanyNameUnique] = useState(false);
  const [isEmailUnique, setEmailUnique] = useState(false);
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
  });

  const [countryNames, setCountryNames] = useState([]);
  const [companyNameValidate, setCompanyNameValidate] = useState(false);
  const [companyNameValidateError, setCompanyNameValidateError] = useState("");
  const [companyEmailValidate, setCompanyEmailValidate] = useState(false);
  const [companyEmailValidateError, setCompanyEmailValidateError] =
    useState("");
  const [againCall, setAgainCall] = useState(false);
  let PackageID = Number(localStorage.getItem("PackageID"));
  let tenureOfSuscriptionID = Number(
    localStorage.getItem("TenureOfSuscriptionID")
  );

  const [selected, setSelected] = useState("US");

  // onselect for reactflagselect country dropdown
  const [select, setSelect] = useState("");

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

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
    setSignUpDetails({
      ...signUpDetails,
      CountryName: {
        value: a.pK_WorldCountryID,
        errorMessage: "",
        errorStatus: false,
      },
    });
  };

  console.log(signUpDetails.CountryName, "CountryNameCountryNameCountryName");
  console.log(
    signUpDetails.CountryName.value,
    "CountryNameCountryNameCountryName"
  );

  const handleSelect = (country) => {
    setSelected(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary == country;
    });
    setSignUpDetails({
      ...signUpDetails,
      FK_CCID: a.id,
      PhoneNumberCountryID: a.id,
    });
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  // translate Languages end

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
      let valueCheck = value.replace(/[^a-z0-9]/gi, "");
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
      let valueCheck = value.replace(/[^a-z0-9]/gi, "");
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
      // let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setSignUpDetails({
          ...signUpDetails,
          State: {
            value: value.trimStart(),
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
      // let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setSignUpDetails({
          ...signUpDetails,
          City: {
            value: value.trimStart(),
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
      // let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setSignUpDetails({
          ...signUpDetails,
          FullName: {
            value: value.trimStart(),
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
    if (isFreeTrail === true) {
      if (
        signUpDetails.CompanyName.value !== "" &&
        signUpDetails.CountryName.value !== "" &&
        signUpDetails.Email.value !== "" &&
        signUpDetails.PhoneNumber.value !== "" &&
        signUpDetails.FullName.value !== "" &&
        signUpDetails.CountryName.value !== ""
      ) {
        if (validateEmailEnglishAndArabicFormat(signUpDetails.Email.value)) {
          if (
            adminReducer.OrganisationCheck !== false &&
            adminReducer.EmailCheck !== false
          ) {
            let data = {
              SelectedPackageID: PackageID,
              TenureOfSuscriptionID: tenureOfSuscriptionID,
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
                FK_SubscriptionStatusID: 0,
                // FK_CCID: signUpDetails.FK_CCID,
              },
            };
            dispatch(createOrganization(data, navigate, t));
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
          setOpen({
            ...open,
            open: true,
            message: t("Email-should-be-in-email-format"),
          });
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
        setOpen({
          ...open,
          open: true,
          message: t("Please-fill-all-the-fields"),
        });
      }
    } else {
      //if not free trial then with all checks

      if (
        signUpDetails.CompanyName.value !== "" &&
        signUpDetails.CountryName.value !== "" &&
        signUpDetails.Address1.value !== "" &&
        signUpDetails.Address2.value !== "" &&
        // signUpDetails.State.value !== "" &&
        // signUpDetails.City.value !== "" &&
        // signUpDetails.PostalCode.value !== "" &&
        // signUpDetails.FullName.value !== "" &&
        signUpDetails.Email.value !== "" &&
        signUpDetails.PhoneNumber.value !== "" &&
        signUpDetails.FullName.value !== ""
      ) {
        if (validateEmailEnglishAndArabicFormat(signUpDetails.Email.value)) {
          if (
            adminReducer.OrganisationCheck !== false &&
            adminReducer.EmailCheck !== false
          ) {
            let data = {
              SelectedPackageID: PackageID,
              TenureOfSuscriptionID: tenureOfSuscriptionID,
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
                FK_SubscriptionStatusID: 0,
                // FK_CCID: signUpDetails.FK_CCID,
              },
            };
            dispatch(createOrganization(data, navigate, t));
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
          setOpen({
            ...open,
            open: true,
            message: t("Email-should-be-in-email-format"),
          });
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
        setOpen({
          ...open,
          open: true,
          message: t("Please-fill-all-the-fields"),
        });
      }
    }
  };

  useEffect(() => {
    let findUSCountryID = countryNameforPhoneNumber.US.id;
    let findUSCountryCode = countryNameforPhoneNumber.US.primary;
    setSignUpDetails({
      ...signUpDetails,
      PhoneNumberCountryID: findUSCountryID,
    });
    setSelected(findUSCountryCode);
  }, []);

  useEffect(() => {
    dispatch(getCountryNamesAction(navigate, t));
  }, []);

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
      adminReducer.OrganisationCheck &&
      adminReducer.EmailCheck
    ) {
      let data = {
        SelectedPackageID: PackageID,
        TenureOfSuscriptionID: tenureOfSuscriptionID,
        Organization: {
          OrganizationName: signUpDetails.CompanyName.value,
          FK_WorldCountryID: JSON.parse(signUpDetails.CountryName.value),
          ContactPersonName: signUpDetails.FullName.value,
          ContactPersonEmail: signUpDetails.Email.value,
          ContactPersonNumber: signUpDetails.PhoneNumber.value,
          FK_NumberWorldCountryID: JSON.parse(signUpDetails.CountryName.value),
          CustomerReferenceNumber: "",
          PersonalNumber: signUpDetails.PhoneNumber.value,
          OrganizationAddress1: signUpDetails.Address1.value,
          OrganizationAddress2: signUpDetails.Address2.value,
          City: signUpDetails.City.value,
          StateProvince: signUpDetails.State.value,
          PostalCode: signUpDetails.PostalCode.value,
          FK_SubscriptionStatusID: 0,
          FK_CCID: signUpDetails.FK_CCID,
        },
      };
      dispatch(createOrganization(data, navigate, t));
      setAgainCall(false);
    } else {
      setAgainCall(false);
    }
  }, [againCall, adminReducer.OrganisationCheck, adminReducer.EmailCheck]);

  useEffect(() => {
    if (
      countryNamesReducer.CountryNamesData !== null &&
      countryNamesReducer.CountryNamesData !== undefined
    ) {
      setCountryNames(countryNamesReducer.CountryNamesData);
    }
  }, [countryNamesReducer.CountryNamesData]);

  useEffect(() => {
    if (Authreducer.OrganizationCreateResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
    } else {
      setOpen({
        ...open,
        open: false,
        message: "",
      });
    }
  }, [Authreducer.OrganizationCreateResponseMessage]);

  // to change select border color functionality
  const borderChanges = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #e1e1e1 !important",
      borderRadius: "4px !important",
      boxShadow: "0 !important",

      "&:focus-within": {
        border: "1px solid #e1e1e1 !important",
      },
    }),
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
                        labelClass="d-none"
                        applyClass={"sign-up-textfield-input MontserratMedium"}
                        placeholder={t("Company-name")}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.CompanyName.value || ""}
                        name="CompanyName"
                        // applyClass=""
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
                                  ? ` ${styles["errorMessage"]} `
                                  : `${styles["errorMessage_hidden"]}`
                              }
                            >
                              {signUpDetails.CompanyName.errorMessage}
                            </p>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={1} lg={1}>
                      {adminReducer.OrganizationCheckSpinner ? (
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
                      <ReactFlagsSelect
                        selected={select}
                        onSelect={countryOnSelect}
                        searchable={true}
                      />
                      <Row>
                        <Col>
                          <span
                            className={
                              signUpDetails.CountryName.errorStatus &&
                              signUpDetails.CountryName.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {signUpDetails.CountryName.errorMessage}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12}>
                      <TextField
                        labelClass="d-none"
                        placeholder={t("Address-1")}
                        maxLength={100}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Address1.value || ""}
                        name="Address1"
                        applyClass="form-control2 MontserratMedium"
                      />
                      {isFreeTrail !== true ? (
                        <>
                          <Row>
                            <Col>
                              <p
                                className={
                                  signUpDetails.Address1.errorStatus &&
                                  signUpDetails.Address1.value === ""
                                    ? ` ${styles["errorMessage"]} `
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {signUpDetails.Address1.errorMessage}
                              </p>
                            </Col>
                          </Row>
                        </>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12}>
                      <TextField
                        labelClass="d-none"
                        placeholder={t("Address-2")}
                        maxLength={100}
                        change={signupValuesChangeHandler}
                        name="Address2"
                        value={signUpDetails.Address2.value || ""}
                        applyClass="form-control2 MontserratMedium"
                      />
                      {isFreeTrail !== true ? (
                        <>
                          <Row>
                            <Col>
                              <p
                                className={
                                  signUpDetails.Address2.errorStatus &&
                                  signUpDetails.Address2.value === ""
                                    ? ` ${styles["errorMessage"]} `
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {signUpDetails.Address2.errorMessage}
                              </p>
                            </Col>
                          </Row>
                        </>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={4} lg={4}>
                      <TextField
                        labelClass="d-none"
                        placeholder={t("State-province")}
                        maxLength={70}
                        change={signupValuesChangeHandler}
                        name="State"
                        value={signUpDetails.State.value || ""}
                        applyClass="form-control2 MontserratMedium"
                      />
                      <Row>
                        <Col>
                          <p className={styles["errorMessage_hidden"]}>
                            {/* {signUpDetails.State.errorMessage} */}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <TextField
                        labelClass="d-none"
                        placeholder={t("City")}
                        name="City"
                        maxLength={70}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.City.value || ""}
                        applyClass="form-control2 MontserratMedium"
                      />
                      <Row>
                        <Col>
                          <p className={styles["errorMessage_hidden"]}>
                            {/* {signUpDetails.City.errorMessage} */}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <TextField
                        labelClass="d-none"
                        placeholder={t("Postal-zipcode")}
                        maxLength={10}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.PostalCode.value || ""}
                        name="PostalCode"
                        applyClass="form-control2 MontserratMedium"
                      />
                      <Row>
                        <Col>
                          <p className={styles["errorMessage_hidden"]}>
                            {/* {signUpDetails.PostalCode.errorMessage} */}
                          </p>
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
                      <TextField
                        labelClass="d-none"
                        placeholder={t("Full-name")}
                        name="FullName"
                        change={signupValuesChangeHandler}
                        value={signUpDetails.FullName.value || ""}
                        // applyClass="form-control2"
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
                            {signUpDetails.FullName.errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={5} lg={5} className={styles["checkEmail"]}>
                      <TextField
                        onBlur={() => {
                          handeEmailvlidate();
                        }}
                        labelClass="d-none"
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
                                  ? // &&
                                    //   signUpDetails.Email.errorMessage !==
                                    //     t("User-email-doesnt-exists"))
                                    ` ${styles["errorMessage"]} `
                                  : `${styles["errorMessage_hidden"]}`
                              }
                            >
                              {signUpDetails.Email.errorMessage}
                            </p>
                          )}
                        </Col>
                      </Row>
                      {/* <Spinner className={styles["checkEmailSpinner"]} /> */}
                    </Col>
                    <Col sm={12} md={1} lg={1}>
                      {adminReducer.EmailCheckSpinner ? (
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
                              {signUpDetails.PhoneNumber.errorMessage}
                            </p>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col
                  sm={12}
                  lg={12}
                  md={12}
                  className="d-flex justify-content-around p-0"
                >
                  <Col
                    sm={6}
                    md={6}
                    lg={6}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <span className={styles["signUp_goBack"]} />
                    <Link
                      to={isFreeTrail ? "/" : "/packageSelection"}
                      color="black"
                    >
                      {t("Go-back")}
                    </Link>
                  </Col>
                  <Col
                    sm={6}
                    md={6}
                    lg={6}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <Button
                      text={t("Next")}
                      onClick={handlerSignup}
                      className={styles["signUp_NextBtn"]}
                    />
                  </Col>
                </Col>
              </Row>
            </Col>
          </Col>
          <Col sm={12} lg={5} md={5} className={styles["signUp_rightSection"]}>
            <img
              draggable="false"
              src={DiskusnewRoundIconSignUp}
              width="600px"
              alt=""
              className={styles["rightsection_roundLogo"]}
            />
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default Signup;
