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
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GetOrganizationSelectedPackagesByOrganizationIDApi,
  getOrganizationWalletApi,
} from "../../../../../../store/actions/UserManagementActions";
import { useSelector } from "react-redux";
import {
  formatDateDownGradeSubscription,
  formatDateToDDMMYYYYDownGradeSubscription,
} from "../../../../../../commen/functions/date_formater";
import {
  calculateTotalAllotedUsersDowngradeSubscription,
  calculateTotalChargesDowngradeSubscription,
  calculateTotalHeadCountDowngradeSubscription,
  calculateTotalNotUtilizedDowngradeSubscription,
  calculateTotalReductionDowngradeSubscription,
} from "../../../../../../commen/functions/TableDataCalculation";

const DowngradeSubscription = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();

  const { subscriptionDetails } = location.state;

  console.log(subscriptionDetails, "subscriptionDetailssubscriptionDetails");

  const { UserMangementReducer } = useSelector((state) => state);

  console.log(UserMangementReducer.Loading, "UserMangementReducer");
  //Data States
  const [downgradeSubsData, setDowngradeSubsData] = useState([]);
  const [textFieldValues, setTextFieldValues] = useState({});
  const [walletData, setWalletData] = useState({
    walletamount: 0,
  });
  const [downgradeDetails, setDowngradeDetails] = useState({
    SubscriptionNumber: 0,
    subscriptionStartDate: "",
    ExpiryDate: "",
    tenure: "",
  });

  //Calling Wallet and Selected pakage Api
  useEffect(() => {
    try {
      dispatch(getOrganizationWalletApi(navigate, t));
    } catch (error) {
      console.log(error, "errorerror");
    }
  }, []);

  //Extracting Data for Table Selected pakages
  useEffect(() => {
    if (
      subscriptionDetails &&
      subscriptionDetails.organizationSelectedPackages
    ) {
      setDowngradeSubsData(subscriptionDetails.organizationSelectedPackages);
      const startdate = subscriptionDetails.subscriptionStartDate;
      const orgnizationID = subscriptionDetails.fK_OrganizationsID;
      const organizationSubscriptionID =
        subscriptionDetails.fK_SubscriptionStatusID;
      setDowngradeDetails({
        SubscriptionNumber: `${formatDateToDDMMYYYYDownGradeSubscription(
          startdate
        )}-${orgnizationID}-${organizationSubscriptionID}`,
        subscriptionStartDate: subscriptionDetails.subscriptionStartDate,
        ExpiryDate: subscriptionDetails.subscriptionExpiryDate,
        tenure: subscriptionDetails.tenure,
      });
    }
  }, [subscriptionDetails]);

  useEffect(() => {
    try {
      if (
        UserMangementReducer.getOrganizationWallet !== null &&
        UserMangementReducer.getOrganizationWallet !== undefined
      ) {
        console.log(
          UserMangementReducer.getOrganizationWallet,
          "getOrganizationWallet"
        );
        setWalletData({
          walletamount:
            UserMangementReducer.getOrganizationWallet.organizationWallet
              .walletAmount,
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  //handle Cancel Button
  const handleCancelButton = () => {
    navigate("/Admin/subscriptionDetailsUserManagement");
  };

  //lisence to Reduce text field

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

  //Calculating total for Transfer to wallet

  const calculateTotalTransferAmount = (data, textFieldValues) => {
    return data.reduce((acc, record) => {
      if (!record.IsDefaultRow) {
        const value =
          textFieldValues[record.pK_OrganizationsSelectedPackageID] || 0;
        const transferAmount = (parseInt(value, 10) || 0) * record.price;
        return acc + transferAmount;
      }
      return acc;
    }, 0);
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
      render: (text, record, index) => {
        if (record.IsDefaultRow) {
          // Get the total charges only once, assuming you have access to the original data
          const totalCharges = calculateTotalChargesDowngradeSubscription(
            subscriptionDetails.organizationSelectedPackages
          );
          return (
            <span className={styles["TableheadingTotal"]}>{totalCharges}</span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {record.price}
            </span>
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
          const totalHeadCount = calculateTotalHeadCountDowngradeSubscription(
            subscriptionDetails.organizationSelectedPackages
          );
          return (
            <span className={styles["TableheadingTotal"]}>
              {totalHeadCount}
            </span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {record.headCount}
            </span>
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
          // Get the total alloted users only once, assuming you have access to the original data
          const totalAllotedUsers =
            calculateTotalAllotedUsersDowngradeSubscription(
              subscriptionDetails.organizationSelectedPackages
            );
          return (
            <span className={styles["TableheadingTotal"]}>
              {totalAllotedUsers}
            </span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {record.allotedUsers}
            </span>
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
          // Get the total not utilized only once, assuming you have access to the original data
          const totalNotUtilized =
            calculateTotalNotUtilizedDowngradeSubscription(
              subscriptionDetails.organizationSelectedPackages
            );
          return (
            <span className={styles["TableheadingTotal"]}>
              {totalNotUtilized}
            </span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {record.headCount - record.allotedUsers}
            </span>
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
          const totalReduction =
            calculateTotalReductionDowngradeSubscription(textFieldValues);
          return (
            <span className={styles["TableheadingTotal"]}>
              {totalReduction}
            </span>
          );
        } else {
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
          const totaltransfertowallet = calculateTotalTransferAmount(
            downgradeSubsData,
            textFieldValues
          );
          return (
            <>
              <span className={styles["TableheadingTotal"]}>
                {totaltransfertowallet}
              </span>
            </>
          );
        } else {
          const value =
            textFieldValues[record.pK_OrganizationsSelectedPackageID] || 0;
          const transferAmount = (parseInt(value, 10) || 0) * record.price;

          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {transferAmount}
              </span>
            </>
          );
        }
      },
    },
  ];

  const defaultRow = {
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
                <span className={styles["amount_styles"]}>
                  {walletData.walletamount}$
                </span>
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
                <td>{downgradeDetails.SubscriptionNumber}</td>
                <td>
                  {formatDateDownGradeSubscription(
                    downgradeDetails.subscriptionStartDate
                  )}
                </td>
                <td>
                  {formatDateDownGradeSubscription(downgradeDetails.ExpiryDate)}
                </td>
                <td>{downgradeDetails.tenure}</td>
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
