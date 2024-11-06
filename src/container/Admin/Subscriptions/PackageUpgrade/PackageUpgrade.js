import React, { useState, useEffect } from "react";
import { Container, Col, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Loader } from "../../../../components/elements";
import "./../../../../i18n";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styles from "../PackageUpgrade/PackageUpgrade.module.css";
import { packagesforUpgrade } from "../../../../store/actions/Admin_PackageUpgrade";
const PackageUpgrade = () => {
  const dispatch = useDispatch();
  const { GetSubscriptionPackage, LanguageReducer } = useSelector(
    (state) => state
  );

  const [currentPackageId, setCurrentPackageId] = useState(0);
  const [monthlyPackageShow, setMonthlyPackageShow] = useState(true);
  const [upgradePackage, setUpgradePackage] = useState([
    {
      PackageID: 0,
      PackageTitle: "",
      PackageExpiryDate: "",
      PackageSubscriptionDate: "",
      PackageAmount: "",
      PackageDescription: "",
      UsersRangeAdmin: 0,
      UsersRangeBoardMembers: 0,
      OtherUsersRange: 0,
      FirstYearDiscountCharges: 0,
      PackageAnuallyDiscountAmount: 0,
      YearlyDiscountedPrice: 0,
      FirstYearDiscountedPrice: 0,
      PackageBadgeColor: "",
    },
  ]);
  //for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [annualPackageShow, setAnnualPackageShow] = useState(false);

  useEffect(() => {
    if (performance.navigation.type === PerformanceNavigation.TYPE_RELOAD) {
      dispatch(packagesforUpgrade(navigate, t));
    }
  }, []);

  const handleManualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    setAnnualPackageShow(false);
    setMonthlyPackageShow(true);
  };

  const handleAnnualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    console.log(packageId);
    setAnnualPackageShow(true);
    setMonthlyPackageShow(false);
  };

  const selectUpgrade = (data) => {
    if (annualPackageShow === true) {
      if (currentPackageId === data.PackageID) {
        // anually packege
        localStorage.setItem("TenureOfSuscriptionID", JSON.parse(1));
      } else {
        // monthly packege
        localStorage.setItem("TenureOfSuscriptionID", JSON.parse(2));
      }
    } else {
      // monthly packege
      localStorage.setItem("TenureOfSuscriptionID", JSON.parse(2));
    }
    console.log(data, "updatedata");
    navigate("/Admin/UpgradePackageDetail", { state: data });
  };

  const calculateAnnuallyPrice = (ActualPrice, YearlyDiscountPercentage) => {
    let calculateAnnuallyPerAmount =
      (ActualPrice * 12 * YearlyDiscountPercentage) / 100;
    let calculateActualYearlyAmount = ActualPrice * 12;
    let annuallyAmount =
      calculateActualYearlyAmount - calculateAnnuallyPerAmount;
    return annuallyAmount.toFixed() / 12;
  };

  useEffect(() => {
    if (
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse.length >
        0 &&
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse !==
        null &&
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse !==
        undefined
    ) {
      let data = [];
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse.map(
        (packagedetails) => {
          data.push({
            PackageTitle: packagedetails.packageName,
            PackageExpiryDate: "",
            PackageSubscriptionDate: "",
            PackageAmount: packagedetails.packageActualPrice,
            PackageDescription: "",
            UsersRangeAdmin: packagedetails.packageAllowedAdminUsers,
            UsersRangeBoardMembers:
              packagedetails.packageAllowedBoardMemberUsers,
            OtherUsersRange: packagedetails.packageAllowedOtherUsers,
            FirstYearDiscountCharges:
              packagedetails.yearlyPurchaseDiscountPercentage,
            PackageID: packagedetails.pK_SubscriptionPackageID,
            YearlyDiscountedPrice: packagedetails.yearlyDiscountedPrice,
            FirstYearDiscountedPrice: packagedetails.firstYearDiscountedPrice,
            PackageAnuallyDiscountAmount: calculateAnnuallyPrice(
              packagedetails.packageActualPrice,
              packagedetails.yearlyPurchaseDiscountPercentage
            ).toFixed(2),
            PackageBadgeColor: packagedetails.badgeColor,
          });
        }
      );
      setUpgradePackage(data);
    }
  }, [GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse]);

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles["UpgradeYourPackageTitle"]}
          >
            {t("Upgrade-your-package")}
          </Col>
        </Row>
        <Row>
          {upgradePackage.length > 0 ? (
            <>
              {upgradePackage.map((data, index) => {
                let packageColorPath1 =
                  data.PackageBadgeColor.split("_SEPERATOR_")[0];
                let packageColorPath2 =
                  data.PackageBadgeColor.split("_SEPERATOR_")[1];
                console.log("datadata", data);
                return (
                  <>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="mb-4"
                      key={data.PackageID}
                    >
                      <Card className={styles["UpgradePackageCard"]}>
                        <Row>
                          <Col sm={12} md={12} lg={12}>
                            {data !== null && data !== undefined ? (
                              <>
                                <span class="icon-star package-icon-style">
                                  <span
                                    class="path1"
                                    style={{ color: packageColorPath1 }}
                                  ></span>
                                  <span
                                    class="path2"
                                    style={{ color: packageColorPath2 }}
                                  ></span>
                                  <span
                                    class="path3"
                                    style={{ color: packageColorPath2 }}
                                  ></span>
                                </span>
                              </>
                            ) : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            sm={12}
                            md={4}
                            lg={4}
                            className="border-right-0 position-relative"
                          >
                            <h3 className={styles["packageheading"]}>
                              {data.PackageTitle}
                            </h3>
                            <div className={styles["packageDetails"]}>
                              <p className={styles["packageDetails_P"]}>
                                {t("Get-more-users")}
                              </p>
                              <p className="text-center">
                                {data.UsersRangeBoardMembers}{" "}
                                {t("Board-members")}
                                <br />
                                {data.UsersRangeAdmin} {t("Executives")}{" "}
                                {t("And")}
                                <br /> {data.OtherUsersRange} {t("Other-users")}
                              </p>
                            </div>
                            <span className={styles["lineBar"]}></span>
                          </Col>
                          <Col
                            sm={12}
                            md={4}
                            lg={4}
                            className={styles["upgradePackageAmoutnandList"]}
                          >
                            {annualPackageShow &&
                            currentPackageId === data.PackageID ? (
                              <h2 className={styles["crossicon1"]}>
                                <del>${data.PackageAmount}/</del>
                                <span className="fs-6">{t("Month")}</span>
                              </h2>
                            ) : (
                              <h2 className={styles["crossicon"]}>
                                {" "}
                                ${data.PackageAmount}/
                                <span className="fs-6">{t("Month")}</span>
                              </h2>
                            )}
                            <ul>
                              <li>{t("Get-more-users")}</li>
                              <li>{t("Theme-customization")}</li>
                              <li>{t("Marketing-tools")}</li>
                              <li>{t("Analytics")}</li>
                            </ul>
                          </Col>
                          <Col sm={12} md={4} lg={4}>
                            <div
                              className={`${styles["packagecard_priceBox_container"]}`}
                            >
                              <Row>
                                <Col sm={false} md={2} lg={2}></Col>
                                <Col sm={12} md={8} lg={8} className={"m-1"}>
                                  <div className="d-flex">
                                    <span
                                      className={
                                        monthlyPackageShow
                                          ? `${styles["spanActive"]}`
                                          : monthlyPackageShow &&
                                            currentPackageId === data.PackageID
                                          ? `${styles["span-formontly"]}`
                                          : monthlyPackageShow === false &&
                                            currentPackageId != data.PackageID
                                          ? `${styles["spanActive"]}`
                                          : `${styles["span-formontly"]}`
                                      }
                                      onClick={() =>
                                        handleManualPackage(data.PackageID)
                                      }
                                    >
                                      {t("Monthly")}
                                    </span>
                                    <span
                                      className={
                                        annualPackageShow &&
                                        currentPackageId === data.PackageID
                                          ? `${styles["spanActive"]}`
                                          : `${styles["span-foranually"]}`
                                      }
                                      onClick={() =>
                                        handleAnnualPackage(data.PackageID)
                                      }
                                    >
                                      {t("Annually")}
                                    </span>
                                  </div>
                                </Col>
                                <Col sm={false} md={2} lg={2}></Col>
                              </Row>
                              <Row>
                                <Col sm={12} md={12} lg={12} className="mt-4">
                                  <div
                                    className={
                                      annualPackageShow &&
                                      currentPackageId === data.PackageID
                                        ? `${styles["packagecard_two"]} `
                                        : ` ${styles["packagecard_two_visible"]} `
                                    }
                                  >
                                    <Col
                                      className={
                                        styles["packagecard_disoucntprice"]
                                      }
                                    >
                                      <p
                                        className={
                                          styles[
                                            "packagecard_disoucntprice_text"
                                          ]
                                        }
                                      >
                                        {t("Pay-only")} <br />
                                        <b
                                          className={
                                            styles[
                                              "packagecard_disoucntprice_amount"
                                            ]
                                          }
                                        >
                                          ${data.FirstYearDiscountedPrice}/
                                        </b>{" "}
                                        {t("month")} <br />{" "}
                                        {t("For-first-year-then")}
                                        <br />
                                        <b
                                          className={
                                            styles[
                                              "packagecard_disoucntprice_amount"
                                            ]
                                          }
                                        >
                                          ${data.YearlyDiscountedPrice}/
                                        </b>{" "}
                                        {t("month")} <br />{" "}
                                        {t("For-recurring-years")}
                                      </p>
                                    </Col>
                                  </div>
                                </Col>
                              </Row>

                              <Button
                                text={t("Upgrade")}
                                onClick={() => selectUpgrade(data)}
                                className={styles["UpgradeBtnCard"]}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </Row>
      </Container>
      {/* {GetSubscriptionPackage.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null} */}
    </>
  );
};

export default PackageUpgrade;
