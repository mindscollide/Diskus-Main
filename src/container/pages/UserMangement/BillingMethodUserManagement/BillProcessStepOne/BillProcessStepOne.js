import React, { useState } from "react";
import styles from "./BillProcessStepOne.module.css";
import BillingFrame from "../../../../../assets/images/BillingContactFrame.svg";
import { Col, Container, Row } from "react-bootstrap";
import { TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
const BillProcessStepOne = ({
  billingContactDetails,
  setBillingContactDetails,
}) => {
  const { t } = useTranslation();

  const billingContactDetailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Name" && value !== "") {
      setBillingContactDetails({
        ...billingContactDetails,
        Name: {
          value: value.trimStart(),
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else if (name === "Name" && value === "") {
      setBillingContactDetails({
        ...billingContactDetails,
        Name: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "LastName" && value !== "") {
      setBillingContactDetails({
        ...billingContactDetails,
        LastName: {
          value: value.trimStart(),
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else if (name === "LastName" && value === "") {
      setBillingContactDetails({
        ...billingContactDetails,
        LastName: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "CompanyName" && value !== "") {
      if (value !== "") {
        setBillingContactDetails({
          ...billingContactDetails,
          CompanyName: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "CompanyName" && value === "") {
      setBillingContactDetails({
        ...billingContactDetails,
        CompanyName: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "Email" && value !== "") {
      if (value !== "") {
        setBillingContactDetails({
          ...billingContactDetails,
          Email: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Email" && value === "") {
      setBillingContactDetails({
        ...billingContactDetails,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
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
                  <TextField
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Name")}
                        </span>
                      </>
                    }
                    placeholder={t("First-name")}
                    name="Name"
                    change={billingContactDetailsHandler}
                  />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Last-name")}
                    name="LastName"
                    change={billingContactDetailsHandler}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Company-name")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Company-name")}
                        </span>
                      </>
                    }
                    name="CompanyName"
                    change={billingContactDetailsHandler}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Email")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Email")}{" "}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                    name="Email"
                    change={billingContactDetailsHandler}
                  />
                  <Row>
                    <Col>
                      <p
                        className={
                          billingContactDetails.Email.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {billingContactDetails.Email.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Contact")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Contact")}{" "}
                          <span className={styles["stericClass"]}>*</span>
                        </span>
                      </>
                    }
                  />
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
              <img src={BillingFrame} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BillProcessStepOne;