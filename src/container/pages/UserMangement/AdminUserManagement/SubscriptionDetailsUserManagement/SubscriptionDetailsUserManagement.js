import React, { useEffect, useState } from "react";
import styles from "./SubscriptionDetailsUserManagement.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, TableToDo } from "../../../../../components/elements";
import { Plus } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import {
  GetOrganizationSelectedPackagesByOrganizationIDApi,
  signUpFlowRoutes,
} from "../../../../../store/actions/UserManagementActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  formatDateDownGradeSubscription,
  formatDateToDDMMYYYYDownGradeSubscription,
} from "../../../../../commen/functions/date_formater";
import { convertToArabicNumerals } from "../../../../../commen/functions/regex";
const SubscriptionDetailsUserManagement = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let Locale = localStorage.getItem("i18nextLng");

  const UserMangementReducerorganizationSelectedPakagesByOrganizationIDData =
    useSelector(
      (state) =>
        state.UserMangementReducer
          .organizationSelectedPakagesByOrganizationIDData
    );

  //Subscription Details Table Data
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);

  const handleDowngradeOption = (subscriptionDetails) => {
    navigate("/Admin/downgradeSubscription", {
      state: { subscriptionDetails },
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
        UserMangementReducerorganizationSelectedPakagesByOrganizationIDData;
      if (data) {
        setSubscriptionDetails(data.organizationSubscriptions);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [UserMangementReducerorganizationSelectedPakagesByOrganizationIDData]);

  // Calculate total essential licenses count
  const totalEssentialLicenses = subscriptionDetails.reduce((total, record) => {
    try {
      if (!record.IsDefaultRow) {
        const essentialPackage = record.organizationSelectedPackages?.find(
          (pkg) => pkg.name === "Essential"
        );
        if (essentialPackage) {
          return total + essentialPackage.headCount;
        }
      }
      return total;
    } catch (error) {
      console.error("totalEssentialLicenses", error);
    }
  }, 0);

  // Calculate total essential licenses count
  const totalProfessionalLicenses = subscriptionDetails.reduce(
    (total, record) => {
      try {
        if (!record.IsDefaultRow) {
          const essentialPackage = record.organizationSelectedPackages?.find(
            (pkg) => pkg.name === "Professional"
          );
          if (essentialPackage) {
            return total + essentialPackage.headCount;
          }
        }
        return total;
      } catch (error) {
        console.error("totalProfessionalLicenses", error);
      }
    },
    0
  );

  // Calculate total essential licenses count
  const totalPremiumLicenses = subscriptionDetails.reduce((total, record) => {
    try {
      if (!record.IsDefaultRow) {
        const essentialPackage = record.organizationSelectedPackages?.find(
          (pkg) => pkg.name === "Premium"
        );
        if (essentialPackage) {
          return total + essentialPackage.headCount;
        }
      }
      return total;
    } catch (error) {
      console.error("totalPremiumLicenses", error);
    }
  }, 0);

  //Calculating the total of total charges
  const calculateTotalCharges = (dataSource) => {
    let totalCharges = dataSource.reduce((total, record) => {
      try {
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
      } catch (error) {
        console.error("calculateTotalCharges", error);
      }
    }, 0);

    return totalCharges;
  };

  const SubscriptionDetails = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Subscription-number")}
        </span>
      ),
      width: 150,
      dataIndex: "SubscriptionNumber",
      key: "SubscriptionNumber",
      ellipsis: true,
      align: Locale === "en" ? "center" : "center",
      render: (text, record) => {
        try {
          if (record.IsDefaultRow) {
            return (
              <>
                <span className={styles["TableheadingTotal_Main_Heading"]}>
                  {t("Total")}
                </span>
              </>
            );
          } else {
            let startdate = record.subscriptionStartDate;
            let orgnizationID = record.fK_OrganizationsID;
            let organizationSubscriptionID = record.fK_SubscriptionStatusID;
            return (
              <>
                <span className={styles["SubscritionNumber_Styles"]}>
                  {convertToArabicNumerals(
                    `${formatDateToDDMMYYYYDownGradeSubscription(
                      startdate
                    )}-${orgnizationID}-${organizationSubscriptionID}`,
                    Locale
                  )}
                </span>
              </>
            );
          }
        } catch (error) {
          console.error(error);
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
      width: 150,
      ellipsis: true,
      align: Locale === "en" ? "center" : "right",
      render: (text, record) => {
        try {
          if (record.IsDefaultRow) {
            return <></>;
          } else {
            return (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["SubscritionNumber_Styles"]}>
                      {formatDateDownGradeSubscription(
                        record.subscriptionStartDate,
                        Locale
                      )}
                    </span>
                  </Col>
                </Row>
              </>
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Expiry-Date")}
        </span>
      ),
      width: 150,
      ellipsis: true,
      dataIndex: "ExpiryDate",
      key: "ExpiryDate",
      align: Locale === "en" ? "left" : "right",
      render: (text, record) => {
        try {
          if (record.IsDefaultRow) {
            return <></>;
          } else {
            return (
              <>
                <span className={styles["SubscritionNumber_Styles"]}>
                  {formatDateDownGradeSubscription(
                    record.subscriptionExpiryDate,
                    Locale
                  )}
                </span>
              </>
            );
          }
        } catch (error) {
          console.error(error);
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
      align: Locale === "en" ? "center" : "right",
      width: 100,
      render: (text, record) => {
        try {
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
        } catch (error) {
          console.error(error);
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
      dataIndex: "EssentialLicenses",
      key: "EssentialLicenses",
      ellipsis: true,
      align: "center",
      width: 100,
      render: (text, record) => {
        try {
          if (record.IsDefaultRow) {
            return (
              <>
                <span className={styles["TableheadingTotal"]}>
                  {convertToArabicNumerals(totalEssentialLicenses, Locale)}
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
                  {convertToArabicNumerals(headCount, Locale)}
                </span>
              </>
            );
          }
        } catch (error) {
          console.error(error);
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
      dataIndex: "ProfessionalLicenses",
      key: "ProfessionalLicenses",
      ellipsis: true,
      align: "center",
      width: 100,
      render: (text, record) => {
        try {
          if (record.IsDefaultRow) {
            return (
              <>
                <span className={styles["TableheadingTotal"]}>
                  {convertToArabicNumerals(totalProfessionalLicenses, Locale)}
                </span>
              </>
            );
          } else {
            const professionalPackage =
              record.organizationSelectedPackages?.find(
                (pkg) => pkg.name === "Professional"
              );
            const headCount = professionalPackage
              ? professionalPackage.headCount
              : 0;
            return (
              <>
                <span className={styles["SubscritionNumber_Styles"]}>
                  {convertToArabicNumerals(headCount, Locale)}
                </span>
              </>
            );
          }
        } catch (error) {
          console.error(error);
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
      dataIndex: "PremiumLicenses",
      key: "PremiumLicenses",
      ellipsis: true,
      align: "center",
      width: 100,
      render: (text, record) => {
        try {
          if (record.IsDefaultRow) {
            return (
              <>
                <span className={styles["TableheadingTotal"]}>
                  {convertToArabicNumerals(totalPremiumLicenses, Locale)}
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
                  {convertToArabicNumerals(headCount, Locale)}
                </span>
              </>
            );
          }
        } catch (error) {
          console.error(error);
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
        try {
          if (record.IsDefaultRow) {
            const totalCharges = calculateTotalCharges(subscriptionDetails);

            return (
              <span className={styles["TableheadingTotal"]}>
                {convertToArabicNumerals(totalCharges, Locale)}
              </span>
            );
          } else {
            const essentialPackage = record.organizationSelectedPackages?.find(
              (pkg) => pkg.name === "Essential"
            );
            const ProfessionalPackage =
              record.organizationSelectedPackages?.find(
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
            return (
              <>
                <span className={styles["SubscritionNumber_Styles"]}>
                  {convertToArabicNumerals(
                    EssentialTotal + ProfessionalTotal + PremiumTotal,
                    Locale
                  )}
                </span>
              </>
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Downgrade")}
          <span className="pakageselectionSpanUsermanagement">
            {t("Subscription")}
          </span>
        </span>
      ),
      dataIndex: "DowngradeSubscription",
      key: "DowngradeSubscription",
      width: 100,
      align: Locale === "en" ? "center" : "right",
      ellipsis: true,
      render: (text, record) => {
        try {
          if (record.IsDefaultRow) {
            return <></>;
          } else {
            return (
              <>
                <Button
                  text={"Downgrade"}
                  className={styles["DowngradeButton_styles"]}
                  onClick={() => handleDowngradeOption(record)}
                />
              </>
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
  ];

  const defaultRow = {
    IsDefaultRow: true,
  };

  //handle Create New Subscrription
  const handleCreateNewSubscription = () => {
    localStorage.setItem("SignupFlowPageRoute", 1);
    dispatch(signUpFlowRoutes(1));
    navigate("/Signup");
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex align-items-center gap-3"
        >
          <span className={styles["SubscriptionDetialsheading"]}>
            {t("Subscription-details")}
          </span>
          <Button
            text={t("Create-new-subscription")}
            icon={<Plus width={20} height={20} fontWeight={800} />}
            className={styles["Create_New_subscription_styles"]}
            onClick={handleCreateNewSubscription}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} xs={12}>
          <TableToDo
            column={SubscriptionDetails}
            className={"SubscriptionExpiryTableStyles"}
            rows={[...subscriptionDetails, defaultRow]}
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

export default SubscriptionDetailsUserManagement;
