import React from "react";
import styles from "./BillProcessStepFour.module.css";
import { Col, Container, Row } from "react-bootstrap";
import paymentmethodIcon from "../../../../../assets/images/PaymentMethodIcon.svg";
import { useTranslation } from "react-i18next";
import { TextField } from "../../../../../components/elements";
import paypal from "../../../../../assets/images/paypal.svg";
import visa from "../../../../../assets/images/Visa.svg";
import Creditcard from "../../../../../assets/images/creditcard.svg";
import AmericanExpress from "../../../../../assets/images/American express.svg";
const BillProcessStepFour = ({ paymentMethods, setPaymentMethods }) => {
  const { t } = useTranslation();

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
                    placeholder={t("First-name")}
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Name")}
                        </span>
                      </>
                    }
                    name="Name"
                    value={paymentMethods.Name.value}
                    change={PaymentDetailsHandler}
                  />
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
                  />
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
                    name="CreditCardNumber"
                    value={paymentMethods.CreditCardNumber.value}
                    change={PaymentDetailsHandler}
                  />
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
                    name="CreditCardExpiration"
                    change={PaymentDetailsHandler}
                    value={paymentMethods.CardExpirationDate.value}
                    placeholder={t("00/00")}
                  />
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
                        <span className={styles["nameStyles"]}>
                          {t("CVV")}{" "}
                        </span>
                      </>
                    }
                    name="CVV"
                    change={PaymentDetailsHandler}
                    value={paymentMethods.CVV.value}
                    placeholder={t("CVV")}
                  />
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
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} xs={12} className="d-flex gap-2">
                  <img src={paypal} alt="" />
                  <img src={visa} alt="" />
                  <img src={Creditcard} alt="" />
                  <img src={AmericanExpress} alt="" />
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
              <img src={paymentmethodIcon} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BillProcessStepFour;
