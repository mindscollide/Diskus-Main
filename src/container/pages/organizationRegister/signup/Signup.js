import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Notification,
  TextField,
  Checkbox,
} from "../../../../components/elements";
import ErrorBar from "../../../authentication/sign_up/errorbar/ErrorBar";
import DiskusnewRoundIconSignUp from "../../../../assets/images/newElements/Diskus_newRoundIcon_SignUp.svg";
import {
  validationEmail,
  stringValidation,
  onlyNumberValidation,
} from "../../../../commen/functions/validations";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    CompanyName: "",
    CountryName: "",
    Address1: "",
    Address2: "",
    State: "",
    City: "",
    PostalCode: "",
    FullName: "",
    Email: "",
    PhoneNumber: "",
  });
  const navigate = useNavigate();
  const [errorBar, setErrorBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("There was something wrong");
  const [companynameCheckbox, setCompanyNameCheckbox] = useState(false);
  const [emailNameCheckbox, setEmailNameCheckBox] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const countryNameChangeHandler = (event) => {
    setSignUpDetails({
      ...signUpDetails,
      CountryName: event.target.value,
    });
  };

  const signupValuesChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "CompanyName" && value !== "") {
      setErrorBar(false);
      setSignUpDetails({
        ...signUpDetails,
        CompanyName: value,
      });
    } else if (name === "CompanyName" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        CompanyName: "",
      });
    }
    if (name === "Address1" && value !== "") {
      let valueCheck = value.replace(/[^a-z0-9]/gi, "");
      setErrorBar(false);
      setSignUpDetails({
        ...signUpDetails,
        Address1: valueCheck,
      });
    } else if (name === "Address1" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        Address1: "",
      });
    }
    if (name === "Address2" && value !== "") {
      let valueCheck = value.replace(/[^a-z0-9]/gi, "");
      setErrorBar(false);
      setSignUpDetails({
        ...signUpDetails,
        Address2: valueCheck,
      });
    } else if (name === "Address2" && value === "") {
      setSignUpDetails({
        ...signUpDetails,
        Address2: "",
      });
    }
    if (name === "State" && value !== "") {
      setErrorBar(false);
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          State: valueCheck,
        });
      }
    } else if (name === "State" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        State: "",
      });
    }
    if (name === "City" && value !== "") {
      setErrorBar(false);
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          City: valueCheck,
        });
      }
    } else if (name === "City" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        City: "",
      });
    }
    if (name === "PostalCode" && value !== "") {
      setErrorBar(false);
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          PostalCode: valueCheck,
        });
      }
    } else if (name === "PostalCode" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        PostalCode: "",
      });
    }
    if (name === "FullName" && value !== "") {
      setErrorBar(false);
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          FullName: valueCheck,
        });
      }
    } else if (name === "FullName" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        FullName: "",
      });
    }
    if (name === "Email" && value !== "") {
      setErrorBar(false);
      console.log("valuevalueemailvaluevalueemail", value);
      setSignUpDetails({
        ...signUpDetails,
        Email: value,
      });
    } else if (name === "Email" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        Email: "",
      });
    }
    if (name === "PhoneNumber" && value !== "") {
      setErrorBar(false);
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setSignUpDetails({
          ...signUpDetails,
          PhoneNumber: valueCheck,
        });
      }
    } else if (name === "PhoneNumber" && value === "") {
      setErrorBar(true);
      setSignUpDetails({
        ...signUpDetails,
        PhoneNumber: "",
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
    if (
      signUpDetails.CompanyName !== "" &&
      signUpDetails.CountryName !== "" &&
      signUpDetails.Address1 !== "" &&
      signUpDetails.Address2 !== "" &&
      signUpDetails.State !== "" &&
      signUpDetails.City !== "" &&
      signUpDetails.PostalCode !== "" &&
      signUpDetails.FullName !== "" &&
      signUpDetails.Email !== "" &&
      signUpDetails.PhoneNumber !== "" &&
      signUpDetails.FullName !== ""
    ) {
      if (validationEmail(signUpDetails.Email) === true) {
        navigate("/packageselection");
      } else {
        setOpen({
          ...open,
          open: true,
          message: "Email should be in Email Format",
        });
      }
      setErrorBar(false);
    } else {
      setErrorBar(true);
      setOpen({
        ...open,
        open: true,
        message: "Please fill all the fields",
      });
    }
  };
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
                        labelClass="d-none"
                        className
                        placeholder="Company Name"
                        change={signupValuesChangeHandler}
                        value={signUpDetails.CompanyName || ""}
                        name="CompanyName"
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.CompanyName === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} lg={1} md={1} className="com_name_checkbox">
                      <Checkbox
                        classNameDiv="checkboxParentClass mt-2"
                        checked={companynameCheckbox}
                        onChange={companyNameCheckBox}
                      />
                    </Col>
                    <Col sm={12} lg={4} md={4}>
                      <Form.Control
                        as="select"
                        value={signUpDetails.CountryName || ""}
                        onChange={countryNameChangeHandler}
                      >
                        <option value="DICTUM">Dictamen</option>
                        <option value="CONSTANCY">Constancia</option>
                        <option value="COMPLEMENT">Complemento</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12}>
                      <TextField
                        labelClass="d-none"
                        placeholder="Address #1"
                        maxLength={100}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Address1 || ""}
                        name="Address1"
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.Address1 === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
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
                        value={signUpDetails.Address2 || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.Address2 === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
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
                        value={signUpDetails.State || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.State === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
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
                        value={signUpDetails.City || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.City === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
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
                        value={signUpDetails.PostalCode || ""}
                        name="PostalCode"
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.PostalCode === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
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
                        value={signUpDetails.FullName || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.FullName === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12} md={6} lg={6}>
                      <TextField
                        labelClass="d-none"
                        placeholder="Email"
                        name="Email"
                        type="email"
                        maxLength={160}
                        change={signupValuesChangeHandler}
                        value={signUpDetails.Email || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.Email === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={12} md={1} lg={1} className="email_checkbox">
                      <Checkbox
                        classNameDiv="checkboxParentClass"
                        checked={emailNameCheckbox}
                        onChange={emailAddress}
                      />
                    </Col>
                    <Col sm={12} md={5} lg={5}>
                      <TextField
                        labelClass="d-none"
                        placeholder="Enter your phone number"
                        maxLength={50}
                        change={signupValuesChangeHandler}
                        name="PhoneNumber"
                        value={signUpDetails.PhoneNumber || ""}
                        applyClass="form-control2"
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              errorBar && signUpDetails.PhoneNumber === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {errorMessage}
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
                    Go Back
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
    </>
  );
};

export default Signup;
