import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import { Spinner, Container, Row, Col, Form } from "react-bootstrap";
import { Check2 } from "react-bootstrap-icons";
import {
  Button,
  Notification,
  TextField,
  Checkbox,
  Loader,
} from "../../../../components/elements";
import DiskusnewRoundIconSignUp from "../../../../assets/images/newElements/Diskus_newRoundIcon_SignUp.svg";
import {
  validateEmail,
  validationEmail,
  validEmailAddress,
} from "../../../../commen/functions/validations";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "../../../../i18n";
import { countryName } from "../../../Admin/AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";
import LanguageChangeIcon from '../../../../assets/images/newElements/Language.svg'
import "react-phone-input-2/lib/style.css";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import { useDispatch, useSelector } from "react-redux";
import getSubscriptionDetailsAction from "../../../../store/actions/GetSubscriptionPackages";
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
import { adminReducer } from "../../../../store/reducers";

const Signup = () => {
  const { t, i18n } = useTranslation();
  const {
    countryNamesReducer,
    GetSubscriptionPackage,
    Authreducer,
    adminReducer,
  } = useSelector((state) => state);

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
  });
  console.log(signUpDetails, "signUpDetailssignUpDetailssignUpDetails")
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [countryValue, setCountryValue] = useState({
    label: "",
    value: "",
  });
  const [countryNames, setCountryNames] = useState([]);
  const [companyNameValidate, setCompanyNameValidate] = useState(false);
  const [companyNameValidateError, setCompanyNameValidateError] = useState("");
  const [companyEmailValidate, setCompanyEmailValidate] = useState(false);
  const [companyEmailValidateError, setCompanyEmailValidateError] =
    useState("");
    console.log("companyEmailValidateErrorcompanyEmailValidateError", companyEmailValidateError)
  const [againCall, setAgainCall] = useState(false);

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryName).find((obj) => {
      return obj.primary == country;
    });
    console.log("Selected-Values", a);
  };

  console.log("CountrySelected", selected);

  const countryNameChangeHandler = (event) => {
    console.log(event.target.value, "countryNamevalue");
    setSignUpDetails({
      ...signUpDetails,
      CountryName: {
        value: event.target.value,
        errorMessage: "",
        errorStatus: false,
      },
    });
    setCountryValue({
      label: event.label,
      value: event.value,
    });
  };

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);
  console.log("currentLocale", currentLocale);
  let currentLanguage = localStorage.getItem("i18nextLng");

  // translate Languages end

  const phoneNumberChangeHandler = (value, country, e, formattedValue) => {
    console.log(value, e.target.value);
    setSignUpDetails({
      ...signUpDetails,
      PhoneNumber: {
        value: e.target.value,
        errorMessage: "",
        errorStatus: false,
      },
    });
  };

  const handeEmailvlidate = () => {
    if (signUpDetails.Email.value !== "") {
      if (validateEmail(signUpDetails.Email.value)) {
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
    console.log(e.target, "phone number");
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
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
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
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
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
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
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
      console.log(value, "phone number");
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
    if (
      signUpDetails.CompanyName.value !== "" &&
      signUpDetails.CountryName.value !== "" &&
      signUpDetails.Address1.value !== "" &&
      signUpDetails.Address2.value !== "" &&
      signUpDetails.State.value !== "" &&
      signUpDetails.City.value !== "" &&
      signUpDetails.PostalCode.value !== "" &&
      signUpDetails.FullName.value !== "" &&
      signUpDetails.Email.value !== "" &&
      signUpDetails.PhoneNumber.value !== "" &&
      signUpDetails.FullName.value !== ""
    ) {
      if (validationEmail(signUpDetails.Email.value)) {
        if (
          adminReducer.OrganisationCheck != false &&
          adminReducer.EmailCheck != false
        ) {
          let PackageID = localStorage.getItem("PackageID");
          let data = {
            SelectedPackageID: JSON.parse(PackageID),
            Organization: {
              OrganizationName: signUpDetails.CompanyName.value,
              FK_WorldCountryID: JSON.parse(signUpDetails.CountryName.value),
              ContactPersonName: signUpDetails.FullName.value,
              ContactPersonEmail: signUpDetails.Email.value,
              ContactPersonNumber: signUpDetails.PhoneNumber.value,
              FK_NumberWorldCountryID: JSON.parse(
                signUpDetails.CountryName.value
              ),
              CustomerReferenceNumber: "",
              PersonalNumber: signUpDetails.PhoneNumber.value,
              OrganizationAddress1: signUpDetails.Address1.value,
              OrganizationAddress2: signUpDetails.Address2.value,
              City: signUpDetails.City.value,
              StateProvince: signUpDetails.State.value,
              PostalCode: signUpDetails.PostalCode.value,
              FK_SubscriptionStatusID: 0,
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
          await handeEmailvlidate();
          await setAgainCall(true);
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
          errorMessage:
            signUpDetails.State.value === ""
              ? t("State-name-is-required")
              : signUpDetails.State.errorMessage,
          errorStatus:
            signUpDetails.State.value === ""
              ? true
              : signUpDetails.State.errorStatus,
        },
        City: {
          value: signUpDetails.City.value,
          errorMessage:
            signUpDetails.City.value === ""
              ? t("City-name-is-required")
              : signUpDetails.City.errorMessage,
          errorStatus:
            signUpDetails.City.value === ""
              ? true
              : signUpDetails.City.errorStatus,
        },
        PostalCode: {
          value: signUpDetails.PostalCode.value,
          errorMessage:
            signUpDetails.PostalCode.value === ""
              ? t("Postal-code-is-required")
              : signUpDetails.PostalCode.errorMessage,
          errorStatus:
            signUpDetails.PostalCode.value === ""
              ? true
              : signUpDetails.PostalCode.errorStatus,
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
  };

  useEffect(() => {
    dispatch(getCountryNamesAction());
  }, []);

  useEffect(() => {
    if (companyNameValidateError != "") {
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
    console.log(companyEmailValidateError,companyEmailValidate, " checking" )
    if (companyEmailValidateError !== "") {
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
      let PackageID = localStorage.getItem("PackageID");
      let data = {
        SelectedPackageID: JSON.parse(PackageID),
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
        },
      };
      dispatch(createOrganization(data, navigate, t));
      setAgainCall(false);
    } else {
      setAgainCall(false);
      // dispatch(setLoader(false));
      console.log("setEmailUnique");
    }
  }, [againCall, adminReducer.OrganisationCheck, adminReducer.EmailCheck]);
  console.log("setEmailUnique", adminReducer.EmailCheck);

  useEffect(() => {
    if (
      countryNamesReducer.CountryNamesData !== null &&
      countryNamesReducer.CountryNamesData !== undefined
    ) {
      let newdata = [];
      countryNamesReducer.CountryNamesData.map((data, index) => {
        newdata.push({
          value: data.pK_WorldCountryID,
          label: data.countryName,
          isEnable: data.isCountryEnabled,
        });
      });
      setCountryNames(newdata);
    }
  }, [countryNamesReducer.Loading]);

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
  }, [Authreducer.Loading]);

  return (
    <>
 <Row>
        <Col className={styles["languageselect-box"]}>
   
          <select
            className={styles["select-language-signin"]}
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option key={code} value={code} className={styles["language_options"]}> 
                {name}
              </option>
            ))}
         
          </select>
          <img src={LanguageChangeIcon} className={styles["languageIcon"]} />
        </Col>
      </Row>
      <Container fluid className={styles["signUp_Container"]}>

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
                        className
                        placeholder={t("Company-name")}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.CompanyName.value || ""}
                        name="CompanyName"
                        applyClass=""
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
                    <Col sm={12} lg={5} md={5} className={styles["countrydropdown"]}>
                      <Form.Select
                        placeholder="Country"
                        onChange={countryNameChangeHandler}
                        className={styles["countrySelector"]}
                      >
                        <option value="" disabled selected>
                          {t("Country-name")}
                        </option>
                        {countryNames.map((data, index) => {
                          console.log(data, "data")
                          return (
                            <option value={data.value}>{data.label}</option>
                          );
                        })}
                      </Form.Select>
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
                        // applyClass="form-control2"
                      />
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
                        applyClass="form-control2"
                      />
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
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              signUpDetails.State.errorStatus &&
                                signUpDetails.State.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {signUpDetails.State.errorMessage}
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
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              signUpDetails.City.errorStatus &&
                                signUpDetails.City.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {signUpDetails.City.errorMessage}
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
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              signUpDetails.PostalCode.errorStatus &&
                                signUpDetails.PostalCode.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {signUpDetails.PostalCode.errorMessage}
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
                        applyClass={styles["SignUp_inputField"]}
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
                        placeholder={t("Email")}
                        name="Email"
                        type="email"
                        maxLength={160}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Email.value || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          {!isEmailUnique && (
                            <p
                              className={
                                (signUpDetails.Email.errorStatus &&
                                  signUpDetails.Email.value === "") ||
                                  (signUpDetails.Email.errorMessage !== "" &&
                                    signUpDetails.Email.errorMessage !==
                                    t("User-email-doesnt-exists"))
                                  ? ` ${styles["errorMessage"]} `
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
                            // onSelect={(code) => setSelected(code)}
                            onSelect={handleSelect}
                            searchable={true}
                            placeholder={"Select Co...."}
                            customLabels={countryName}
                            className={styles["dropdown-countrylist"]}
                          />
                        </Col>
                        <Col lg={9} md={9} sm={10} className="d-flex justify-content-end">
                          <Form.Control
                            className={styles["Form-PhoneInput-field"]}
                            // className={styles["formcontrol-PhoneInput-field"]}
                            name="PhoneNumber"
                            placeholder={t("Enter-phone-number")}
                            applyClass="form-control2"
                            maxLength={10}
                            onChange={signupValuesChangeHandler}
                            value={signUpDetails.PhoneNumber.value || ""}

                          // onChange={PhoneHandler}
                          // onChange={customerInfoHandler}
                          // value={customerSection.Number || ""}
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
                    <Link to="/packageSelection" color="black">
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
                      text="Next"
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
              src={DiskusnewRoundIconSignUp}
              width="600px"
              className={styles["rightsection_roundLogo"]}
            />
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {Authreducer.Loading && <Loader />}
      {console.log("loader", Authreducer.Loading)}
    </>
  );
};

export default Signup;
