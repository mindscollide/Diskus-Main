import React, { useState } from "react";
import styles from "./PaymentMethodBillInfo.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import paypal from "../../../../../assets/images/paypal.svg";
import visa from "../../../../../assets/images/Visa.svg";
import Creditcard from "../../../../../assets/images/creditcard.svg";
import AmericanExpress from "../../../../../assets/images/American express.svg";
import { Button, TextField } from "../../../../../components/elements";
const PaymentMethodBillInfo = () => {
  const { t } = useTranslation();

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

  // onChange Method
  const PaymentDetailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Name" && value !== "") {
      setPaymentMethods({
        ...paymentMethods,
        Name: {
          value: value.trimStart(),
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else if (name === "Name" && value === "") {
      setPaymentMethods({
        ...paymentMethods,
        Name: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "LastName" && value !== "") {
      setPaymentMethods({
        ...paymentMethods,
        LastName: {
          value: value.trimStart(),
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else if (name === "LastName" && value === "") {
      setPaymentMethods({
        ...paymentMethods,
        LastName: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "CreditCardNumber" && value !== "") {
      const creditCardRegex = /^(?:\d[ -]*?){13,16}$/;
      if (creditCardRegex.test(value)) {
        // Input matches credit card pattern
        setPaymentMethods({
          ...paymentMethods,
          CreditCardNumber: {
            value: value.trim(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        // Input doesn't match credit card pattern
        setPaymentMethods({
          ...paymentMethods,
          CreditCardNumber: {
            value: value.replace(/[^0-9-]/g, ""), // Remove non-numeric characters
            errorMessage: "",
            errorStatus: true,
          },
        });
      }
    } else if (name === "CreditCardNumber" && value === "") {
      setPaymentMethods({
        ...paymentMethods,
        CreditCardNumber: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "CreditCardExpiration" && value !== "") {
      const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format

      if (expirationDateRegex.test(value)) {
        // Input matches the expected format
        setPaymentMethods({
          ...paymentMethods,
          CardExpirationDate: {
            value: value.trim(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        // Input doesn't match the expected format
        setPaymentMethods({
          ...paymentMethods,
          CardExpirationDate: {
            value: value.replace(/[^0-9/]/g, ""), // Remove non-numeric characters except '/'
            errorMessage: "",
            errorStatus: true,
          },
        });
      }
    } else if (name === "CreditCardExpiration" && value === "") {
      // If the value is empty, reset the state
      setPaymentMethods({
        ...paymentMethods,
        CardExpirationDate: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "CVV" && value !== "") {
      if (value !== "") {
        setPaymentMethods({
          ...paymentMethods,
          CVV: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "CVV" && value === "") {
      setPaymentMethods({
        ...paymentMethods,
        CVV: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  //Confirm Billing Details

  const handleConfirmBillingDetails = () => {
    if (
      paymentMethods.Name.value !== "" &&
      paymentMethods.LastName.value !== "" &&
      paymentMethods.CreditCardNumber.value !== "" &&
      paymentMethods.CardExpirationDate.value !== "" &&
      paymentMethods.CVV.value !== ""
    ) {
      return;
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
  };
  return (
    <Container className={styles["ContainerStylesPaymentHistory"]}>
      <Row>
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-center"
        >
          <span className={styles["PaymentMethodHeading"]}>
            {t("Payment-method")}
          </span>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={2} lg={2} md={2} sm={12} xs={12}></Col>
        <Col xl={8} lg={8} md={8} sm={12} xs={12}>
          <Card className={styles["PaymentHiistoryCardStyling"]}>
            <Row className="mt-2">
              <Col lg={6} md={6} sm={12} xs={12}>
                <TextField
                  placeholder={t("First-name")}
                  label={
                    <>
                      <span className={styles["nameStyles"]}>{t("Name")}</span>
                    </>
                  }
                  value={paymentMethods.Name.value}
                  name="Name"
                  change={PaymentDetailsHandler}
                />{" "}
                <Row>
                  <Col>
                    <p
                      className={
                        paymentMethods.Name.value === ""
                          ? ` ${styles["errorMessage"]} `
                          : `${styles["errorMessage_hidden"]}`
                      }
                    >
                      {paymentMethods.Name.errorMessage}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <TextField
                  placeholder={t("Last-name")}
                  name="LastName"
                  value={paymentMethods.LastName.value}
                  change={PaymentDetailsHandler}
                />{" "}
                <Row>
                  <Col>
                    <p
                      className={
                        paymentMethods.LastName.value === ""
                          ? ` ${styles["errorMessage"]} `
                          : `${styles["errorMessage_hidden"]}`
                      }
                    >
                      {paymentMethods.LastName.errorMessage}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12} xs={12}>
                <TextField
                  placeholder={t("Credit-card-number")}
                  label={
                    <>
                      <span className={styles["nameStyles"]}>
                        {t("Credit-card-number")}
                      </span>
                    </>
                  }
                  value={paymentMethods.CreditCardNumber.value}
                  name="CreditCardNumber"
                  change={PaymentDetailsHandler}
                />{" "}
                <Row>
                  <Col>
                    <p
                      className={
                        paymentMethods.CreditCardNumber.value === ""
                          ? ` ${styles["errorMessage"]} `
                          : `${styles["errorMessage_hidden"]}`
                      }
                    >
                      {paymentMethods.CreditCardNumber.errorMessage}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={6} md={6} sm={12} xs={12}>
                <TextField
                  label={
                    <>
                      <span className={styles["nameStyles"]}>
                        {t("Card-expiration-date")}{" "}
                      </span>
                    </>
                  }
                  placeholder={t("00/00")}
                  name="CreditCardExpiration"
                  value={paymentMethods.CardExpirationDate.value}
                  change={PaymentDetailsHandler}
                />{" "}
                <Row>
                  <Col>
                    <p
                      className={
                        paymentMethods.CardExpirationDate.value === ""
                          ? ` ${styles["errorMessage"]} `
                          : `${styles["errorMessage_hidden"]}`
                      }
                    >
                      {paymentMethods.CardExpirationDate.errorMessage}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <TextField
                  label={
                    <>
                      <span className={styles["nameStyles"]}>{t("CVV")} </span>
                    </>
                  }
                  name="CVV"
                  placeholder={t("CVV")}
                  value={paymentMethods.CVV.value}
                  change={PaymentDetailsHandler}
                />{" "}
                <Row>
                  <Col>
                    <p
                      className={
                        paymentMethods.CVV.value === ""
                          ? ` ${styles["errorMessage"]} `
                          : `${styles["errorMessage_hidden"]}`
                      }
                    >
                      {paymentMethods.CVV.errorMessage}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12} xs={12} className="d-flex gap-2">
                <img src={paypal} alt="" />
                <img src={visa} alt="" />
                <img src={Creditcard} alt="" />
                <img src={AmericanExpress} alt="" />
              </Col>
            </Row>
            <Row className="mt-5">
              <Col
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Back")}
                  className={styles["BackButtonPaymentMethod"]}
                />
                <Button
                  text={t("Confirm-billing-details")}
                  className={styles["ConfirmBillingDetails"]}
                  onClick={handleConfirmBillingDetails}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={2} lg={2} md={2} sm={12} xs={12}></Col>
      </Row>
    </Container>
  );
};

export default PaymentMethodBillInfo;
