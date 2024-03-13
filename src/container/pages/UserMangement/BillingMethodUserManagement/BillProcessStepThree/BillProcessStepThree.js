import React from "react";
import styles from "./BillProcessStepThree.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { TableToDo } from "../../../../../components/elements";
const BillProcessStepThree = () => {
  const { t } = useTranslation();
  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Pakage-details")}
        </span>
      ),
      width: 100,
      dataIndex: "Pakagedetails",
      key: "Pakagedetails",
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Charges-per-license-US$")}
        </span>
      ),
      dataIndex: "Chargesperlicense",
      key: "Chargesperlicense",
      width: 100,
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Number-of-licenses")}
        </span>
      ),
      width: 100,
      dataIndex: "Numberoflicenses",
      key: "Numberoflicenses",
      align: "center",
    },

    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Yearly-charges-in")}
        </span>
      ),
      dataIndex: "Yearlycharges",
      key: "Yearlycharges",
      align: "center",
      width: 100,
    },
  ];
  return (
    <Container>
      <Row>
        <Col
          lg={9}
          md={9}
          sm={12}
          xs={12}
          className={styles["outerBoxForBilling"]}
        >
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <TableToDo
                column={ColumnsPakageSelection}
                className={"Billing_TablePakageSelection"}
                pagination={false}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={3} md={3} sm={12} xs={12}></Col>
      </Row>
    </Container>
  );
};

export default BillProcessStepThree;
