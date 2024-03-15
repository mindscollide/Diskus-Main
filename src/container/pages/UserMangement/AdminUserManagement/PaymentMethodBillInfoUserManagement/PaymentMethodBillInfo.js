import React from "react";
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
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <TextField placeholder={t("Last-name")} />
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
                      <span className={styles["nameStyles"]}>{t("CVV")} </span>
                    </>
                  }
                  placeholder={t("CVV")}
                />
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
