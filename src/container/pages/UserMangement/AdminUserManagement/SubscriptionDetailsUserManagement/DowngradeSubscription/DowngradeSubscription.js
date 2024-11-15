import React, { useEffect, useState } from "react";
import styles from "./DowngradeSubscription.module.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Button,
  TableToDo,
  TextField,
} from "../../../../../../components/elements";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  downgradeOrganizationSubscriptionApi,
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
import { convertToArabicNumerals } from "../../../../../../commen/functions/regex";
const DowngradeSubscription = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();

  let locale = localStorage.getItem("i18nextLng");

  const { subscriptionDetails } = location.state;

  const UserMangementReducergetOrganizationWalletData = useSelector(
    (state) => state.UserMangementReducer.getOrganizationWallet
  );

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
  const [headCountEntered, setHeadCountEntered] = useState({});

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

      const initialHeadCountEntered = {};
      subscriptionDetails.organizationSelectedPackages.forEach((pkg) => {
        initialHeadCountEntered[pkg.pK_OrganizationsSelectedPackageID] = false;
      });
      setHeadCountEntered(initialHeadCountEntered);
    }
  }, [subscriptionDetails]);

  console.log(
    downgradeSubsData,
    "downgradeSubsDatadowngradeSubsDatadowngradeSubsData"
  );

  //Extracting Wallet Data
  useEffect(() => {
    try {
      if (
        UserMangementReducergetOrganizationWalletData !== null &&
        UserMangementReducergetOrganizationWalletData !== undefined
      ) {
        setWalletData({
          walletamount:
            UserMangementReducergetOrganizationWalletData.organizationWallet
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
      // Update textFieldValues state
      setTextFieldValues((prevValues) => ({
        ...prevValues,
        [recordId]: value,
      }));

      // Update headCountEntered state
      setHeadCountEntered((prevEntered) => ({
        ...prevEntered,
        [recordId]: value !== "" && parseInt(value, 10) > 0,
      }));
    } else {
      // Handle case when value is not numeric (e.g., clearing the text field)
      setTextFieldValues((prevValues) => ({
        ...prevValues,
        [recordId]: "",
      }));

      // Update headCountEntered state when value is cleared
      setHeadCountEntered((prevEntered) => ({
        ...prevEntered,
        [recordId]: false,
      }));
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

  //Table Columns Downgrade pakage
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
        if (record && record.IsDefaultRow) {
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
        if (record && record.IsDefaultRow) {
          // Get the total charges only once, assuming you have access to the original data
          const totalCharges = calculateTotalChargesDowngradeSubscription(
            subscriptionDetails.organizationSelectedPackages
          );
          return (
            <span className={styles["TableheadingTotal"]}>
              {convertToArabicNumerals(totalCharges, locale)}
            </span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {convertToArabicNumerals(record.price, locale)}
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
        if (record && record.IsDefaultRow) {
          const totalHeadCount = calculateTotalHeadCountDowngradeSubscription(
            subscriptionDetails.organizationSelectedPackages
          );
          return (
            <span className={styles["TableheadingTotal"]}>
              {convertToArabicNumerals(totalHeadCount, locale)}
            </span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {convertToArabicNumerals(record.headCount, locale)}
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
        if (record && record.IsDefaultRow) {
          // Get the total alloted users only once, assuming you have access to the original data
          const totalAllotedUsers =
            calculateTotalAllotedUsersDowngradeSubscription(
              subscriptionDetails.organizationSelectedPackages
            );
          return (
            <span className={styles["TableheadingTotal"]}>
              {convertToArabicNumerals(totalAllotedUsers, locale)}
            </span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {convertToArabicNumerals(record.allotedUsers, locale)}
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
        console.log(record, "recordrecordrecord");
        if (record && record.IsDefaultRow) {
          // Get the total not utilized only once, assuming you have access to the original data
          const totalNotUtilized =
            calculateTotalNotUtilizedDowngradeSubscription(
              subscriptionDetails.organizationSelectedPackages
            );
          return (
            <span className={styles["TableheadingTotal"]}>
              {convertToArabicNumerals(totalNotUtilized, locale)}
            </span>
          );
        } else {
          return (
            <span className={styles["SubscritionNumber_Styles"]}>
              {convertToArabicNumerals(
                record.headCount - record.allotedUsers,
                locale
              )}
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
        if (record && record.IsDefaultRow) {
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
                    labelclass="d-none"
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
        if (record && record.IsDefaultRow) {
          const totaltransfertowallet = calculateTotalTransferAmount(
            downgradeSubsData,
            textFieldValues
          );
          return (
            <>
              <span className={styles["TableheadingTotal"]}>
                {convertToArabicNumerals(totaltransfertowallet, locale)}
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
                {convertToArabicNumerals(transferAmount, locale)}
              </span>
            </>
          );
        }
      },
    },
  ];

  //Default Row Check
  const defaultRow = {
    IsDefaultRow: true,
  };

  // Handle onClick Downgrade button
  const handelOnClickDownGradeButton = () => {
    let packagesHeadCounts = [];
    subscriptionDetails.organizationSelectedPackages.forEach((pkg) => {
      if (headCountEntered[pkg.pK_OrganizationsSelectedPackageID]) {
        packagesHeadCounts.push({
          PackageID: pkg.fK_PackageID,
          HeadCount: parseInt(
            textFieldValues[pkg.pK_OrganizationsSelectedPackageID],
            10
          ),
        });
      }
    });

    const data = {
      OrganizationSubscriptionID:
        subscriptionDetails.pK_OrganizationsSubscriptionID,
      PackagesHeadCounts: packagesHeadCounts,
    };

    dispatch(downgradeOrganizationSubscriptionApi(navigate, t, data));
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
              disableBtn={
                !Object.values(headCountEntered).some((entered) => entered)
              }
              className={styles["Downgrade_Button_Styles"]}
              onClick={handelOnClickDownGradeButton}
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default DowngradeSubscription;
