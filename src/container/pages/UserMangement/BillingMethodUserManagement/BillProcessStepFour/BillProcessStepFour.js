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
const BillProcessStepFour = () => {
  const { t } = useTranslation();
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
                  />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                  <TextField />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    label={
                      <>
                        <span className={styles["nameStyles"]}>
                          {t("Credit-card-number")}
                        </span>
                      </>
                    }
                  />
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
                  />
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
                    placeholder={t("CVV")}
                  />
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
