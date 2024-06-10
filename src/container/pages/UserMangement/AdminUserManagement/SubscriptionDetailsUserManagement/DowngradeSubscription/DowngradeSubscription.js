import React from "react";
import styles from "./DowngradeSubscription.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Button,
  TableToDo,
  TextField,
} from "../../../../../../components/elements";
import { useNavigate } from "react-router-dom";
const DowngradeSubscription = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCancelButton = () => {
    navigate("/Admin/subscriptionDetailsUserManagement");
  };

  const downgradePakageTable = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Subscription-details")}
        </span>
      ),
      width: 100,
      dataIndex: "SubscriptionDetails",
      key: "SubscriptionDetails",
      ellipsis: true,
      align: "center",
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Charges-per")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Lisence-uS$")}
          </span>
        </span>
      ),
      dataIndex: "Chargesperlisences",
      key: "Chargesperlisences",
      width: 100,
      align: "center",
      ellipsis: true,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Lisence")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Purchased")}
          </span>
        </span>
      ),
      dataIndex: "lisencepurchased",
      key: "lisencepurchased",
      width: 100,
      align: "center",
      ellipsis: true,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Lisence")}
          <span className="pakageselectionSpanUsermanagement">
            {t("utilzed")}
          </span>
        </span>
      ),
      dataIndex: "lisenceutilized",
      key: "lisenceutilized",
      width: 100,
      align: "center",
      ellipsis: true,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Lisence")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Not-utilzed")}
          </span>
        </span>
      ),
      dataIndex: "lisencenotutilized",
      key: "lisencenotutilized",
      width: 100,
      align: "center",
      ellipsis: true,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Lisence")}
          <span className="pakageselectionSpanUsermanagement">
            {t("To-reduce")}
          </span>
        </span>
      ),
      dataIndex: "lisenceReduce",
      key: "lisenceReduce",
      width: 100,
      align: "center",
      ellipsis: true,
      render: () => {
        return (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <TextField labelClass="d-none" applyClass="PakageDetails" />
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Transfer")}
          <span className="pakageselectionSpanUsermanagement">
            {t("To-wallet-us$")}
          </span>
        </span>
      ),
      dataIndex: "Transfertowallet",
      key: "Transfertowallet",
      width: 100,
      align: "center",
      ellipsis: true,
    },
  ];

  const Data = [
    {
      key: "1",
      SubscriptionDetails: (
        <span className={styles["SubscritionNumber_Styles"]}>Basic Plan</span>
      ),
      Chargesperlisences: (
        <span className={styles["SubscritionNumber_Styles"]}>10</span>
      ),
      lisencepurchased: (
        <span className={styles["SubscritionNumber_Styles"]}>100</span>
      ),
      lisenceutilized: (
        <span className={styles["SubscritionNumber_Styles"]}>1000</span>
      ),
      lisencenotutilized: (
        <span className={styles["SubscritionNumber_Styles"]}>100</span>
      ),

      Transfertowallet: (
        <span className={styles["SubscritionNumber_Styles"]}>100</span>
      ),
    },
    {
      key: "2",
      SubscriptionDetails: (
        <span className={styles["SubscritionNumber_Styles"]}>Essential</span>
      ),
      Chargesperlisences: (
        <span className={styles["SubscritionNumber_Styles"]}>234</span>
      ),
      lisencepurchased: (
        <span className={styles["SubscritionNumber_Styles"]}>567</span>
      ),
      lisenceutilized: (
        <span className={styles["SubscritionNumber_Styles"]}>5345</span>
      ),
      lisencenotutilized: (
        <span className={styles["SubscritionNumber_Styles"]}>24</span>
      ),

      Transfertowallet: (
        <span className={styles["SubscritionNumber_Styles"]}>234</span>
      ),
    },
  ];

  const defaultRow = {
    key: "3",
    SubscriptionDetails: (
      <span className={styles["TableheadingTotal"]}>Total</span>
    ),
    Chargesperlisences: (
      <>
        <span className={styles["TableheadingTotal"]}>29</span>
      </>
    ),
    lisencepurchased: (
      <>
        <span className={styles["TableheadingTotal"]}>29</span>
      </>
    ),
    lisenceutilized: (
      <>
        <span className={styles["TableheadingTotal"]}>19</span>
      </>
    ),
    lisencenotutilized: (
      <>
        <span className={styles["TableheadingTotal"]}>09</span>
      </>
    ),
    lisenceReduce: "",
    Transfertowallet: (
      <>
        <span className={styles["TableheadingTotal"]}>129</span>
      </>
    ),
  };
  return (
    <>
      <section>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["background"]}>
              <span className={styles["amount_heading_styles"]}>
                {t("Your-current-wallet-balance-is")}
                <span className={styles["amount_styles"]}>195$</span>
              </span>
            </span>
          </Col>
        </Row>
      </section>
      <section className={styles["Subsection_styles"]}>
        <Row className="mt-2">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-center"
          >
            <span className={styles["Downgraded_Subscription_styles"]}>
              {t("Downgraded-this-subscription")}
            </span>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <table className={styles["Table_Styles"]}>
              <tr>
                <th>{t("Subscription-number")}</th>
                <th>{t("Subscription-date")}</th>
                <th>{t("Expiry-date")}</th>
                <th>{t("Duration")}</th>
              </tr>
              <tr>
                <td>2024-08-24-991-150</td>
                <td>22 December 2023</td>
                <td>21 December 2024</td>
                <td>Annual Subscription</td>
              </tr>
            </table>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <TableToDo
              column={downgradePakageTable}
              className={"DowngradeTableStyles"}
              rows={[...Data, defaultRow]}
              pagination={false}
              footer={false}
              scroll={{
                x: "hidden",
              }}
              id="DownGradeSubscription"
              rowHoverBg="none"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-3"
          >
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Button_Styles"]}
              onClick={handleCancelButton}
            />
            <Button
              text={t("Downgrade-now")}
              className={styles["Downgrade_Button_Styles"]}
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default DowngradeSubscription;
