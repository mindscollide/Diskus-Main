import React from "react";
import styles from "./PaymentMethodBillInfo.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const PaymentMethodBillInfo = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Row>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <span className={styles["PaymentMethodHeading"]}>
            {t("Payment-method")}
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentMethodBillInfo;
