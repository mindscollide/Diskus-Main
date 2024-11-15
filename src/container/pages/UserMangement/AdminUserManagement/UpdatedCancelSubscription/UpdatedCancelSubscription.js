import React, { useEffect, useState } from "react";
import styles from "./UpdatedCancelSubscription.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Loader, TableToDo } from "../../../../../components/elements";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { GetOrganizationSelectedPackagesByOrganizationIDApi } from "../../../../../store/actions/UserManagementActions";
import { useSelector } from "react-redux";
import {
  formatDateDownGradeSubscription,
  formatDateToDDMMYYYYDownGradeSubscription,
} from "../../../../../commen/functions/date_formater";
const UpdatedCancelSubscription = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { UserMangementReducer } = useSelector((state) => state);

  //Cancel Subscription Table Data
  const [cancelSubscription, setCancelSubscription] = useState([]);

  const handleCancelSubscriptionOption = (CancellationDetials) => {
    navigate("/Admin/CancelSubscriptionUserManagement", {
      state: { CancellationDetials },
    });
  };

  //Calling Get Organization Selected Pakages By Organization
  useEffect(() => {
    try {
      dispatch(GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t));
    } catch (error) {
      console.log(error, "errorerror");
    }
  }, []);

  //Extracting Data For Organization Pakage Details
  useEffect(() => {
    try {
      const data =
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData;
      if (data) {
        setCancelSubscription(data.organizationSubscriptions);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [UserMangementReducer.organizationSelectedPakagesByOrganizationIDData]);

  // Calculate total essential licenses count
  const totalEssentialLicenses = cancelSubscription.reduce((total, record) => {
    if (!record.IsDefaultRow) {
      const essentialPackage = record.organizationSelectedPackages?.find(
        (pkg) => pkg.name === "Essential"
      );
      if (essentialPackage) {
        return total + essentialPackage.headCount;
      }
    }
    return total;
  }, 0);

  // Calculate total essential licenses count
  const totalProfessionalLicenses = cancelSubscription.reduce(
    (total, record) => {
      if (!record.IsDefaultRow) {
        const essentialPackage = record.organizationSelectedPackages?.find(
          (pkg) => pkg.name === "Professional"
        );
        if (essentialPackage) {
          return total + essentialPackage.headCount;
        }
      }
      return total;
    },
    0
  );

  // Calculate total essential licenses count
  const totalPremiumLicenses = cancelSubscription.reduce((total, record) => {
    if (!record.IsDefaultRow) {
      const essentialPackage = record.organizationSelectedPackages?.find(
        (pkg) => pkg.name === "Premium"
      );
      if (essentialPackage) {
        return total + essentialPackage.headCount;
      }
    }
    return total;
  }, 0);

  //calculating the total of TotalCharges

  //Calculating the total of total charges
  const calculateTotalCharges = (dataSource) => {
    console.log(dataSource, "dataSourcedataSource");
    let totalCharges = dataSource.reduce((total, record) => {
      if (!record.IsDefaultRow) {
        const essentialPackage = record.organizationSelectedPackages?.find(
          (pkg) => pkg.name === "Essential"
        );
        const ProfessionalPackage = record.organizationSelectedPackages?.find(
          (pkg) => pkg.name === "Professional"
        );
        const PremiumPackage = record.organizationSelectedPackages?.find(
          (pkg) => pkg.name === "Premium"
        );

        const EssentialTotal = essentialPackage
          ? essentialPackage.headCount * essentialPackage.price
          : 0;

        const ProfessionalTotal = ProfessionalPackage
          ? ProfessionalPackage.headCount * ProfessionalPackage.price
          : 0;

        const PremiumTotal = PremiumPackage
          ? PremiumPackage.headCount * PremiumPackage.price
          : 0;

        return total + EssentialTotal + ProfessionalTotal + PremiumTotal;
      }
      return total;
    }, 0);

    return totalCharges;
  };

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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return (
            <>
              <span className={styles["TableheadingTotal"]}>{t("Total")}</span>
            </>
          );
        } else {
          let startdate = record.subscriptionStartDate;
          let orgnizationID = record.fK_OrganizationsID;
          let organizationSubscriptionID = record.fK_SubscriptionStatusID;
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {`${formatDateToDDMMYYYYDownGradeSubscription(
                  startdate
                )}-${orgnizationID}-${organizationSubscriptionID}`}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        console.log(record.organizationSelectedPackages, "recordrecord");
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <Row>
                <Col lg={12} md={12} sm={12} className="text-center">
                  <span className={styles["SubscritionNumber_Styles"]}>
                    {formatDateDownGradeSubscription(
                      record.subscriptionStartDate
                    )}
                  </span>
                </Col>
              </Row>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {formatDateDownGradeSubscription(record.subscriptionExpiryDate)}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {record.tenure}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return (
            <>
              <span className={styles["TableheadingTotal"]}>
                {totalEssentialLicenses}
              </span>
            </>
          );
        } else {
          const essentialPackage = record.organizationSelectedPackages?.find(
            (pkg) => pkg.name === "Essential"
          );
          const headCount = essentialPackage ? essentialPackage.headCount : 0;
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {headCount}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return (
            <>
              <span className={styles["TableheadingTotal"]}>
                {totalProfessionalLicenses}
              </span>
            </>
          );
        } else {
          const professionalPackage = record.organizationSelectedPackages?.find(
            (pkg) => pkg.name === "Professional"
          );
          const headCount = professionalPackage
            ? professionalPackage.headCount
            : 0;
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {headCount}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return (
            <>
              <span className={styles["TableheadingTotal"]}>
                {totalPremiumLicenses}
              </span>
            </>
          );
        } else {
          const premiumPackage = record.organizationSelectedPackages?.find(
            (pkg) => pkg.name === "Premium"
          );
          const headCount = premiumPackage ? premiumPackage.headCount : 0;
          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {headCount}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        console.log(record, "recordrecordrecord");
        if (record.IsDefaultRow) {
          const TotalChargesCancelSubscription =
            calculateTotalCharges(cancelSubscription);
          return (
            <>
              <span className={styles["TableheadingTotal"]}>
                {TotalChargesCancelSubscription}
              </span>
            </>
          );
        } else {
          const EssentialPackage = record.organizationSelectedPackages?.find(
            (pkg) => pkg.name === "Essential"
          );
          const ProfessionalPackage = record.organizationSelectedPackages?.find(
            (pkg) => pkg.name === "Professional"
          );

          const PremiumPackage = record.organizationSelectedPackages?.find(
            (pkg) => pkg.name === "Premium"
          );
          const EssentialTotal = EssentialPackage
            ? EssentialPackage.headCount * EssentialPackage.price
            : 0;
          const ProfessionalTotal = ProfessionalPackage
            ? ProfessionalPackage.headCount * ProfessionalPackage.price
            : 0;
          const PremiumTotal = PremiumPackage
            ? PremiumPackage.headCount * PremiumPackage.price
            : 0;

          return (
            <>
              <span className={styles["SubscritionNumber_Styles"]}>
                {EssentialTotal + ProfessionalTotal + PremiumTotal}
              </span>
            </>
          );
        }
      },
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
      render: (text, record) => {
        if (record.IsDefaultRow) {
          return <></>;
        } else {
          return (
            <>
              <Button
                text={t("Cancel-subscription")}
                className={styles["DowngradeButton_styles"]}
                onClick={() => handleCancelSubscriptionOption(record)}
              />
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
            rows={[...cancelSubscription, defaultRow]}
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
      {UserMangementReducer.Loading ? <Loader /> : null}
    </Container>
  );
};

export default UpdatedCancelSubscription;
