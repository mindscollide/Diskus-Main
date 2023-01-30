import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";
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

import "react-phone-input-2/lib/style.css";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import { useDispatch, useSelector } from "react-redux";
import getSubscriptionDetailsAction from "../../../../store/actions/GetSubscriptionPackages";
import { createOrganization } from "../../../../store/actions/Auth2_actions";
import { useTranslation } from "react-i18next";
import {
  checkEmailExsist,
  checkOraganisation,
} from "../../../../store/actions/Admin_Organization";
import { adminReducer } from "../../../../store/reducers";

const Signup = () => {
  const { t } = useTranslation();
  const {
    countryNamesReducer,
    GetSubscriptionPackage,
    Authreducer,
    adminReducer,
  } = useSelector((state) => state);
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companynameCheckbox, setCompanyNameCheckbox] = useState(false);
  const [emailNameCheckbox, setEmailNameCheckBox] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [countryValue, setCountryValue] = useState({
    label: "",
    value: "",
  });
  const [countryNames, setCountryNames] = useState([]);
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
        dispatch(checkEmailExsist(signUpDetails, setSignUpDetails, t));
      } else {
        setSignUpDetails({
          ...signUpDetails,
          Email: {
            value: signUpDetails.Email.value,
            errorMessage: t("Enter Valid Email Address"),
            errorStatus: true,
          },
        });
      }
    } else {
      setSignUpDetails({
        ...signUpDetails,
        Email: {
          value: "",
          errorMessage: t("Enter Email Address"),
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
          value: value,
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
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          Address1: {
            value: valueCheck,
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
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          Address2: {
            value: valueCheck,
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
            value: valueCheck,
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
            value: valueCheck,
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
            value: valueCheck,
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
            value: valueCheck,
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
            value: value,
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
    if (name === "PhoneNumber") {
      console.log(value, "phone number");
      if (value !== "") {
        setSignUpDetails({
          ...signUpDetails,
          PhoneNumber: {
            value: value,
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
  const companyNameCheckBox = () => {
    setCompanyNameCheckbox(!companynameCheckbox);
  };
  const emailAddress = () => {
    setEmailNameCheckBox(!emailNameCheckbox);
  };
  const handlerSignup = () => {
    console.log(
      "signUpDetails",
      signUpDetails.CompanyName.value,
      signUpDetails.CountryName.value,
      signUpDetails.Address1.value,
      signUpDetails.Address2.value,
      signUpDetails.State.value,
      signUpDetails.City.value,
      signUpDetails.PostalCode.value,
      signUpDetails.FullName.value,
      signUpDetails.Email.value,
      signUpDetails.PhoneNumber.value,
      signUpDetails.FullName.value,
      adminReducer.OrganisationCheck,
      adminReducer.EmailCheck
    );
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
        console.log(
          "validationEmail",
          adminReducer.OrganisationCheck,
          adminReducer.EmailCheck
        );
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
          // console.log("data", data);
          dispatch(createOrganization(data, navigate, t));
          // navigate("/packageselection");
        } else {
          setOpen({
            ...open,
            open: true,
            message: t("Please Enter Valid Data"),
          });
        }
      } else {
        setOpen({
          ...open,
          open: true,
          message: t("Email should be in Email Format"),
        });
      }
    } else {
      setSignUpDetails({
        ...signUpDetails,
        CompanyName: {
          value: signUpDetails.CompanyName.value,
          errorMessage:
            signUpDetails.CompanyName.value === ""
              ? t("Company Name is Required")
              : signUpDetails.CompanyName.value,
          errorStatus:
            signUpDetails.CompanyName.value === ""
              ? true
              : signUpDetails.CompanyName.errorStatus,
        },
        CountryName: {
          value: signUpDetails.CountryName.value,
          errorMessage:
            signUpDetails.CountryName.value === ""
              ? t("Country Name is Required")
              : signUpDetails.CountryName.value,
          errorStatus:
            signUpDetails.CountryName.value === ""
              ? true
              : signUpDetails.CountryName.errorStatus,
        },
        Address1: {
          value: signUpDetails.Address1.value,
          errorMessage:
            signUpDetails.Address1.value === ""
              ? t("Address # 1 is Required")
              : signUpDetails.Address1.value,
          errorStatus:
            signUpDetails.Address1.value === ""
              ? true
              : signUpDetails.Address1.errorStatus,
        },
        Address2: {
          value: signUpDetails.Address2.value,
          errorMessage:
            signUpDetails.Address2.value === ""
              ? t("Address # 2 is Required")
              : signUpDetails.Address2.value,
          errorStatus:
            signUpDetails.Address2.value === ""
              ? true
              : signUpDetails.Address2.errorStatus,
        },
        State: {
          value: signUpDetails.State.value,
          errorMessage:
            signUpDetails.State.value === ""
              ? t("State Name is Required")
              : signUpDetails.State.value,
          errorStatus:
            signUpDetails.State.value === ""
              ? true
              : signUpDetails.State.errorStatus,
        },
        City: {
          value: signUpDetails.City.value,
          errorMessage:
            signUpDetails.City.value === ""
              ? t("City Name is Required")
              : signUpDetails.City.value,
          errorStatus:
            signUpDetails.City.value === ""
              ? true
              : signUpDetails.City.errorStatus,
        },
        PostalCode: {
          value: signUpDetails.PostalCode.value,
          errorMessage:
            signUpDetails.PostalCode.value === ""
              ? t("Postal Code is Required")
              : signUpDetails.PostalCode.value,
          errorStatus:
            signUpDetails.PostalCode.value === ""
              ? true
              : signUpDetails.PostalCode.errorStatus,
        },
        FullName: {
          value: signUpDetails.FullName.value,
          errorMessage:
            signUpDetails.FullName.value === ""
              ? t("Full Name is Required")
              : signUpDetails.FullName.value,
          errorStatus:
            signUpDetails.FullName.value === ""
              ? true
              : signUpDetails.FullName.errorStatus,
        },
        Email: {
          value: signUpDetails.Email.value,
          errorMessage:
            signUpDetails.Email.value === ""
              ? t("Email Address is Required")
              : signUpDetails.Email.value,
          errorStatus: true,
        },
        PhoneNumber: {
          value: signUpDetails.PhoneNumber.value,
          errorMessage:
            signUpDetails.PhoneNumber.value === ""
              ? t("Phone Number is Required")
              : signUpDetails.PhoneNumber.value,
          errorStatus:
            signUpDetails.PhoneNumber.value === ""
              ? true
              : signUpDetails.PhoneNumber.errorStatus,
        },
      });
      setOpen({
        ...open,
        open: true,
        message: t("Please fill all the fields"),
      });
    }
  };

  useEffect(() => {
    dispatch(getCountryNamesAction());
  }, []);
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
  }, []);
  return (
    <>
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
                    Organization Details
                  </h4>
                  <Row className="mb-3">
                    <Col sm={12} lg={7} md={7}>
                      <TextField
                        onBlur={() => {
                          dispatch(
                            checkOraganisation(
                              signUpDetails,
                              setSignUpDetails,
                              t
                            )
                          );
                        }}
                        labelClass="d-none"
                        className
                        placeholder="Company Name"
                        change={signupValuesChangeHandler}
                        value={signUpDetails.CompanyName.value || ""}
                        name="CompanyName"
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
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
                        </Col>
                      </Row>
                    </Col>

                    <Col sm={12} lg={5} md={5}>
                      <Form.Select
                        placeholder="Country"
                        onChange={countryNameChangeHandler}
                      >
                        <option value="" disabled selected>
                          Country Name
                        </option>
                        {countryNames.map((data, index) => {
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
                        placeholder="Address #1"
                        maxLength={100}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Address1.value || ""}
                        name="Address1"
                        applyClass="form-control2"
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
                        placeholder="Address #2"
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
                        placeholder="State/Province"
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
                        placeholder="City"
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
                        placeholder="Postal Code/Zip Code"
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
                    Admin Details
                  </h4>
                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12}>
                      <TextField
                        labelClass="d-none"
                        placeholder="Full Name"
                        name="FullName"
                        change={signupValuesChangeHandler}
                        value={signUpDetails.FullName.value || ""}
                        applyClass="form-control2"
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
                    <Col sm={12} md={6} lg={6}>
                      <TextField
                        onBlur={() => {
                          handeEmailvlidate();
                        }}
                        labelClass="d-none"
                        placeholder="Email"
                        name="Email"
                        type="email"
                        maxLength={160}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Email.value || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              (signUpDetails.Email.errorStatus &&
                                signUpDetails.Email.value === "") ||
                              signUpDetails.Email.errorMessage != ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {signUpDetails.Email.errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>

                    <Col
                      sm={12}
                      md={6}
                      lg={6}
                      className={styles["phoneNumber"]}
                    >
                      <PhoneInput
                        // onKeyDown={(event) =>
                        //   enterKeyHandler(event, OrganizationRole)
                        // }
                        onChange={phoneNumberChangeHandler}
                        className={styles["formcontrol-Phone-field"]}
                        maxLength={10}
                        // placeholder={t("Enter-Phone-Number")}
                        // change={AddUserHandler}
                        value={signUpDetails.PhoneNumber.value || ""}
                        name="PhoneNumber"
                        countryCodeEditable={false}
                        dropdownClass={styles["dropdown-countrylist"]}
                      />

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
                      {" "}
                      Go Back
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
