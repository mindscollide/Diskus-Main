import React from "react";
import styles from "./UpdatedCancelSubscription.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, TableToDo } from "../../../../../components/elements";
import { Col, Container, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
const UpdatedCancelSubscription = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const CancelSubscriptionDetails = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Subscription-number")}
        </span>
      ),
      width: 100,
      dataIndex: "SubscriptionNumber",
      key: "SubscriptionNumber",
      ellipsis: true,
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Subscription-Date")}
        </span>
      ),
      dataIndex: "SubscriptionDate",
      key: "SubscriptionDate",
      width: 100,
      ellipsis: true,
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Expiry-Date")}
        </span>
      ),
      width: 100,
      ellipsis: true,
      dataIndex: "ExpiryDate",
      key: "ExpiryDate",
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Duration")}
        </span>
      ),
      dataIndex: "Duration",
      key: "Duration",
      ellipsis: true,
      align: "center",
      width: 100,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Essential")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Licenses")}
          </span>
        </span>
      ),
      dataIndex: "EssentialLisences",
      key: "EssentialLisences",
      ellipsis: true,
      align: "center",
      width: 100,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Professional")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Licenses")}
          </span>
        </span>
      ),
      dataIndex: "ProfessionalLisences",
      key: "ProfessionalLisences",
      ellipsis: true,
      align: "center",
      width: 100,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Premium")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Licenses")}
          </span>
        </span>
      ),
      dataIndex: "PremiumLisences",
      key: "PremiumLisences",
      ellipsis: true,
      align: "center",
      width: 100,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Total-charges")}
          <span className="pakageselectionSpanUsermanagement">
            {t("in-US$")}
          </span>
        </span>
      ),
      dataIndex: "TotalCharges",
      key: "TotalCharges",
      width: 100,
      align: "center",
      ellipsis: true,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Cancel")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Subscription")}
          </span>
        </span>
      ),
      dataIndex: "CancelSubscription",
      key: "CancelSubscription",
      width: 100,
      align: "center",
      ellipsis: true,
    },
  ];

  let Data = [
    {
      key: "1",
      SubscriptionNumber: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>
            203-345-98-1
          </span>
        </>
      ),
      SubscriptionDate: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>
            22 December 2023
          </span>
        </>
      ),
      ExpiryDate: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>
            14 December 2023
          </span>
        </>
      ),
      Duration: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>12 months</span>
        </>
      ),
      EssentialLisences: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>10</span>
        </>
      ),
      ProfessionalLisences: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>5</span>
        </>
      ),
      PremiumLisences: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>2</span>
        </>
      ),
      TotalCharges: (
        <>
          <span className={styles["SubscritionNumber_Styles"]}>$500</span>
        </>
      ),
      CancelSubscription: (
        <>
          <Button
            text={t("Cancel-subscription")}
            className={styles["DowngradeButton_styles"]}
            // onClick={handleDowngradeOption}
          />
        </>
      ),
    },
  ];

  const defaultRow = {
    SubscriptionNumber: (
      <span className={styles["TableheadingTotal"]}>{t("Total")}</span>
    ),
    SubscriptionDate: "",
    ExpiryDate: "",
    Duration: "",
    EssentialLisences: (
      <>
        <span className={styles["TableheadingTotal"]}>29</span>
      </>
    ),
    ProfessionalLisences: (
      <>
        <span className={styles["TableheadingTotal"]}>30</span>
      </>
    ),
    PremiumLisences: (
      <>
        <span className={styles["TableheadingTotal"]}>15</span>
      </>
    ),
    TotalCharges: (
      <>
        <span className={styles["TableheadingTotal"]}>$3000</span>
      </>
    ),
    CancelSubscription: "",
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-center"
        >
          <span className={styles["SubscriptionDetialsheading"]}>
            {t("Cancel-subscription")}
          </span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} xs={12}>
          <TableToDo
            column={CancelSubscriptionDetails}
            className={"SubscriptionExpiryTableStyles"}
            rows={[...Data, defaultRow]}
            pagination={false}
            footer={false}
            scroll={{
              x: "hidden",
              y: "60vh",
            }}
            id="SubscriptionExpiry"
            rowHoverBg="none"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatedCancelSubscription;
