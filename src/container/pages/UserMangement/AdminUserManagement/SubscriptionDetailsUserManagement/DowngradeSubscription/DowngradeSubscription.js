import React, { useEffect, useState } from "react";
import styles from "./DowngradeSubscription.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Button,
  Loader,
  TableToDo,
  TextField,
} from "../../../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GetOrganizationSelectedPackagesByOrganizationIDApi,
  getOrganizationWalletApi,
} from "../../../../../../store/actions/UserManagementActions";
import { useSelector } from "react-redux";
import { render } from "@testing-library/react";
const DowngradeSubscription = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { UserMangementReducer } = useSelector((state) => state);
  //Data States
  const [downgradeSubsData, setDowngradeSubsData] = useState([]);
  const [textFieldValues, setTextFieldValues] = useState({});
  const [walletData, setWalletData] = useState(null);

  //Calling Wallet and Selected pakage Api
  useEffect(() => {
    try {
      dispatch(GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t));
      dispatch(getOrganizationWalletApi(navigate, t));
    } catch (error) {
      console.log(error, "errorerror");
    }
  }, []);

  //Extracting Data for Table Selected pakages
  useEffect(() => {
    try {
      if (
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData !==
          null &&
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData !==
          undefined
      ) {
        const data =
          UserMangementReducer.organizationSelectedPakagesByOrganizationIDData;
        if (data && data.organizationSubscriptions) {
          let subscriptionData = [];

          data.organizationSubscriptions.forEach((subscription) => {
            if (subscription.organizationSelectedPackages) {
              subscription.organizationSelectedPackages.forEach(
                (packageItem) => {
                  subscriptionData.push(packageItem);
                }
              );
            }
          });

          setDowngradeSubsData(subscriptionData);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [UserMangementReducer.organizationSelectedPakagesByOrganizationIDData]);

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
      render: (text, record) => {
        console.log(record, "recordrecordrecord");
        if (record.IsDefaultRow) {
          return (
            <>
              <span className={styles["TableheadingTotal"]}>Total</span>
            </>
          );
        } else {
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {record.name}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {record.price}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {record.headCount}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {record.allotedUsers}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {record.headCount - record.allotedUsers}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          const handleTextFieldChange = (e, recordId) => {
            const { value } = e.target;
            // Allow only numeric input
            if (/^\d*$/.test(value)) {
              setTextFieldValues((prevValues) => {
                const updatedValues = {
                  ...prevValues,
                  [recordId]: value,
                };
                console.log(updatedValues, "updatedValues");
                return updatedValues;
              });
            }
          };

          return (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <TextField
                    labelClass="d-none"
                    applyClass="PakageDetails"
                    value={
                      textFieldValues[
                        record.pK_OrganizationsSelectedPackageID
                      ] || ""
                    }
                    change={(e) =>
                      handleTextFieldChange(
                        e,
                        record.pK_OrganizationsSelectedPackageID
                      )
                    }
                  />
                </Col>
              </Row>
            </>
          );
        }
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return <></>;
        }
      },
    },
  ];

  const defaultRow = {
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
    IsDefaultRow: true,
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
              rows={[...downgradeSubsData, defaultRow]}
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
        {UserMangementReducer.Loading ? <Loader /> : null}
      </section>
    </>
  );
};

export default DowngradeSubscription;
