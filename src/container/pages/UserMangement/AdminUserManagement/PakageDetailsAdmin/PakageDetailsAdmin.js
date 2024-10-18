import React from "react";
import styles from "./PakageDetailsAdmin.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, Loader, TableToDo } from "../../../../../components/elements";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetOrganizationSelectedPackagesByOrganizationIDApi } from "../../../../../store/actions/UserManagementActions";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { _justShowDateformat } from "../../../../../commen/functions/date_formater";

const PakageDetailsAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { UserMangementReducer } = useSelector((state) => state);

  // organizationSubscriptions
  const [packageDetails, setPackageDetails] = useState({
    PackageSubscriptionDate: "",
    PackageExpiryDate: "",
    PackageName: "",
  });

  // get organizationID from localStorage

  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Package-details")}
        </span>
      ),
      width: 100,
      dataIndex: "Pakagedetails",
      key: "Pakagedetails",
      ellipsis: true,
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
      ellipsis: true,
      align: "center",
    },
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Number-of-licenses")}
        </span>
      ),
      width: 100,
      ellipsis: true,
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
      ellipsis: true,
      align: "center",
      width: 100,
    },
  ];

  useEffect(() => {
    dispatch(GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t));
  }, []);

  useEffect(() => {
    let detailPackages =
      UserMangementReducer.organizationSelectedPakagesByOrganizationIDData;
    if (detailPackages !== null && detailPackages !== undefined) {
      detailPackages.organizationSubscriptions?.map((subscription) => {
        console.log(subscription, "subscriptionsubscription");
        setPackageDetails((prevState) => ({
          ...prevState,
          PackageSubscriptionDate: subscription.subscriptionStartDate,
          PackageExpiryDate: subscription.subscriptionExpiryDate,
          PackageName: subscription.organizationSelectedPackages
            .map((pkg) => pkg.name)
            .join(", "),
        }));
      });
    }
  }, [UserMangementReducer.organizationSelectedPakagesByOrganizationIDData]);

  // table data in which Package details should be shown
  const organizationPackages =
    UserMangementReducer.organizationSelectedPakagesByOrganizationIDData
      ?.organizationSubscriptions;

  let Data = [];

  if (organizationPackages) {
    organizationPackages.map((subscription) => {
      Data = subscription.organizationSelectedPackages.map((packages) => ({
        Pakagedetails: (
          <span className={styles["Tableheading"]}>{packages.name}</span>
        ),
        Chargesperlicense: (
          <span className={styles["ChargesPerLicesense"]}>
            {packages.price}
          </span>
        ),
        Numberoflicenses: (
          <span className={styles["ChargesPerLicesense"]}>
            {packages.headCount}
          </span>
        ),
        Yearlycharges: (
          <span className={styles["ChargesPerLicesense"]}>
            {packages.price * packages.headCount * 12}
          </span>
        ),
      }));
    });
  }

  // counter of Number of license and Yearly Charges
  let totalLicenses = 0;
  let totalYearlyCharges = 0;

  UserMangementReducer.organizationSelectedPakagesByOrganizationIDData?.organizationSubscriptions.map(
    (packageses) => {
      packageses.organizationSelectedPackages.map((totals) => {
        let totalofLicences = totals.headCount;
        let totalOfYearlyPrices = totals.price * totals.headCount * 12;
        totalLicenses += totalofLicences;
        totalYearlyCharges += totalOfYearlyPrices;
      });
    }
  );

  const defaultRow = {
    Pakagedetails: (
      <span className={styles["TableheadingTotal"]}>{t("Total")}</span>
    ),
    Numberoflicenses: (
      <span className={styles["ChargesPerLicesensetotal"]}>
        {totalLicenses}
      </span>
    ),
    Yearlycharges: (
      <span className={styles["ChargesPerLicesensetotal"]}>
        {totalYearlyCharges}
      </span>
    ),
  };

  const upgradeOnclickHandler = () => {
    if (UserMangementReducer.organizationSelectedPakagesByOrganizationIDData) {
      const organizationSelectedVariable =
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData.organizationSubscriptions?.map(
          (subscription) => subscription.organizationSelectedPackages
        );
      console.log(organizationSelectedVariable, "organizationSelectedVariable");
      if (organizationSelectedVariable) {
        navigate("/Admin/PackageDetailUMupgrade", {
          state: {
            organizationSelectedPackages: organizationSelectedVariable,
          },
        });
      } else {
        // Handle if organizationSelectedPackages is empty
      }
    }
  };

  return (
    <Container className="p-3">
      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-center"
        >
          <span className={styles["PakageDetailsHeading"]}>
            {t("Package-details")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
          <Card className={styles["packagecard"]}>
            <Row className="mt-3">
              <Col sm={12}></Col>
            </Row>
            <div className={styles["side-card-packagedetail"]}>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["UpgradePlanHeading"]}>
                    {t("Upgrade-your-plan")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Row className="mt-4">
                    <Col xs={12} sm={12} md={2} lg={2}></Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={8}
                      lg={8}
                      className="text-center m-0 p-0 "
                    >
                      <p className={styles["subcriptionkey_1"]}>
                        {t("Subscription-date")}
                      </p>
                      <p className={styles["subcriptionvalue_1"]}>
                        {_justShowDateformat(
                          packageDetails.PackageSubscriptionDate + "000000"
                        )}
                      </p>
                    </Col>
                    <Col xs={12} sm={12} md={2} lg={2}></Col>
                  </Row>
                  <Row className="mt-4">
                    <Col xs={12} sm={12} md={2} lg={2}></Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={8}
                      lg={8}
                      className="text-center m-0 p-0 "
                    >
                      <p className={styles["subcriptionkey_2"]}>
                        {t("Expiry-date")}
                      </p>
                      <p className={styles["subcriptionvalue_2"]}>
                        {_justShowDateformat(
                          packageDetails.PackageExpiryDate + "000000"
                        )}
                      </p>
                    </Col>
                    <Col xs={12} sm={12} md={2} lg={2}></Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-center"
                >
                  <Button
                    text={t("Upgrade")}
                    className={styles["UpdateButtonPakageDetails"]}
                    onClick={upgradeOnclickHandler}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xl={8} lg={8} md={8} sm={12} xs={12}>
          <Card className={styles["DetailsCard"]}>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12} xs={12}></Col>
            </Row>
            <Row className="mt-5">
              <Col lg={12} md={12} sm={12} xs={12}>
                <TableToDo
                  column={ColumnsPakageSelection}
                  className={"package-TablePakageSelection"}
                  rows={[...Data, defaultRow]}
                  pagination={false}
                  footer={false}
                  scroll={{
                    x: "hidden",
                  }}
                  id="UpgradePakageDetails"
                  rowHoverBg="none"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {UserMangementReducer.Loading ? <Loader /> : null}
    </Container>
  );
};

export default PakageDetailsAdmin;
