import React, { useState } from "react";
import styles from "./BillProcessStepTwo.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import ReactFlagsSelect from "react-flags-select";
import locationImage from "../../../../../assets/images/Location.svg";
import {
  regexOnlyCharacters,
  regexOnlyNumbers,
} from "../../../../../commen/functions/regex";
const BillProcessStepTwo = ({ billingAddress, setBillingAddress }) => {
  const { t } = useTranslation();

  const [select, setSelect] = useState("");

  const [countryNames, setCountryNames] = useState([]);

  //onChange Method For Text Field
  const billingAddressDetailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "PostalCode" && value !== "") {
      let valueName = regexOnlyNumbers(value);
      if (valueName !== "") {
        setBillingAddress({
          ...billingAddress,
          PostalCode: {
            value: valueName.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "PostalCode" && value === "") {
      setBillingAddress({
        ...billingAddress,
        PostalCode: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "State" && value !== "") {
      let valueName = regexOnlyCharacters(value);
      if (valueName !== "") {
        setBillingAddress({
          ...billingAddress,
          State: {
            value: valueName.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "State" && value === "") {
      setBillingAddress({
        ...billingAddress,
        State: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "City" && value !== "") {
      let valueName = regexOnlyCharacters(value);
      if (valueName !== "") {
        setBillingAddress({
          ...billingAddress,
          City: {
            value: valueName.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "City" && value === "") {
      setBillingAddress({
        ...billingAddress,
        City: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "Address" && value !== "") {
      setBillingAddress({
        ...billingAddress,
        Address: {
          value: value.trimStart(),
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else if (name === "Address" && value === "") {
      setBillingAddress({
        ...billingAddress,
        Address: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  //Flag Selector
  const countryOnSelect = (code) => {
    setSelect(code);
    let a = Object.values(countryNames).find((obj) => {
      return obj.shortCode === code;
    });
    // setSignUpDetails({
    //   ...signUpDetails,
    //   CountryName: {
    //     value: a.pK_WorldCountryID,
    //     errorMessage: "",
    //     errorStatus: false,
    //   },
    // });
  };

  return (
    <Container>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className={styles["outerBoxForBilling"]}
        >
          <Row className="mt-5">
            <Col lg={7} md={7} sm={12} xs={12}>
              <Row className="mt-2">
                <Col lg={6} md={6} sm={12} xs={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <span className={styles["nameStyles"]}>
                        {t("Country")}
                        <span className={styles["stericClass"]}>*</span>
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className={styles["react-flag-Info-Signup"]}
                    >
                      <ReactFlagsSelect
                        selected={select}
                        onSelect={countryOnSelect}
                        searchable={true}
                        required={true}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Postal-zipcode*")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Postal-zipcode")}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                    change={billingAddressDetailsHandler}
                    value={billingAddress.PostalCode.value}
                    name="PostalCode"
                  />
                  <Row>
                    <Col>
                      <p
                        className={
                          billingAddress.PostalCode.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {billingAddress.PostalCode.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    placeholder={t("State-province*")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("State-province")}{" "}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                    value={billingAddress.State.value}
                    change={billingAddressDetailsHandler}
                    name="State"
                  />
                  <Row>
                    <Col>
                      <p
                        className={
                          billingAddress.State.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {billingAddress.State.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    placeholder={t("City*")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("City")}{" "}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                    value={billingAddress.City.value}
                    change={billingAddressDetailsHandler}
                    name="City"
                  />

                  <Row>
                    <Col>
                      <p
                        className={
                          billingAddress.City.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {billingAddress.City.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Address*")}
                    value={billingAddress.Address.value}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Address")}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                    change={billingAddressDetailsHandler}
                    name="Address"
                  />
                  <Row>
                    <Col>
                      <p
                        className={
                          billingAddress.Address.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {billingAddress.Address.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col
              lg={5}
              md={5}
              sm={12}
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <img src={locationImage} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BillProcessStepTwo;
