import React, { useState, useEffect } from "react";
import { Container, Col, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UpgradePackageCard, Button } from "../../../../components/elements";
import "./../../../../i18n";
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next";
import styles from '../PackageUpgrade/PackageUpgrade.module.css'
import { packagesforUpgrade } from "../../../../store/actions/Admin_PackageUpgrade";

const PackageUpgrade = () => {
  const dispatch = useDispatch()
  const { GetSubscriptionPackage } = useSelector(state => state)
  console.log(GetSubscriptionPackage, "GetSubscriptionPackage")
  const [upgradePackage, setUpgradePackage] = useState([{
    PackageTitle: "Hello",
    PackageExpiryDate: "",
    PackageSubscriptionDate: "",
    PackageAmount: "",
    PackageDescription: "",
    UsersRangeAdmin: 0,
    UsersRangeBoardMembers: 0,
    OtherUsersRange: 0,
    FirstYearDiscountCharges: 0
  }])
  //for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const handleManualPackage = () => {
    setAnnualPackageShow(false);
  };
  const handleAnnualPackage = () => {
    setAnnualPackageShow(true);
  };
  const selectUpgrade = () => {
    navigate("/Diskus/Admin/UpgradePackageDetail");
  };
  useEffect(() => {
    dispatch(packagesforUpgrade(t))
  }, [])
  useEffect(() => {
    if (GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse.length > 0 && GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse !== null && GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse !== undefined) {
      let data = [];
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse.map((packagedetails, index) => {
        data.push({
          PackageTitle: packagedetails.packageName,
          PackageExpiryDate: "",
          PackageSubscriptionDate: "",
          PackageAmount: packagedetails.packageActualPrice,
          PackageDescription: "",
          UsersRangeAdmin: 0,
          UsersRangeBoardMembers: 0,
          OtherUsersRange: 0,
          FirstYearDiscountCharges: packagedetails.yearlyPurchaseDiscountPercentage
        })
      })
      setUpgradePackage(data)

    }
  }, [GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse])
  return (
    <Container className="py-5">
      <Row>
        <Col sm={12} md={12} lg={12} className="text-center fs-3 fw-500 mb-4">
          {t("Upgrade-Your-Package")}
        </Col>
      </Row>
      <Row>
        {upgradePackage.map((data, index) => {
          return (
            <>
              <Col sm={12} lg={12} md={12} className="mb-4">
                <Card className={styles["UpgradePackageCard"]}>
                  <Row>
                    <Col
                      sm={12}
                      md={4}
                      lg={4}
                      className="border-right-0 position-relative"
                    >
                      <h3 className={styles["packageheading"]}>{data.PackageTitle}</h3>
                      <div className={styles["packageDetails"]}>
                        <p>{t("GET-5-more-users")}</p>
                        <p>
                          {t("2-Board-Members")} <br /> {t("and-3-Executives")}
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
                      {annualPackageShow ? (
                        <h2 className={styles["crossicon"]}>
                          <del>${data.PackageAmount}/</del>
                          <span className="fs-6">{t("month")}</span>
                        </h2>
                      ) : (
                        <h2>
                          {" "}$
                          {data.PackageAmount}/<span className="fs-6">{t("month")}</span>
                        </h2>
                      )}
                      <ul>
                        <li>{t("Get-More-Users")}</li>
                        <li>{t("Theme-customization")}</li>
                        <li>{t("Marketing-tools")}</li>
                        <li>{t("Analytics")}</li>
                      </ul>
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <div className={`${styles["packagecard_priceBox_container"]}`}>
                        <div className={styles["packagecard_one"]}>
                          <div className="d-flex">
                            <span
                              className="border border-1 w-100"
                              onClick={handleManualPackage}
                            >
                              {t("Monthly")}
                            </span>
                            <span
                              className=" border border-1 w-100"
                              onClick={handleAnnualPackage}
                            >
                              {t("Annually")}
                            </span>
                          </div>
                        </div>
                        <div
                          className={
                            annualPackageShow
                              ? `${styles["packagecard_two"]}`
                              : ` ${styles["packagecard_two_visible"]}`
                          }
                        >
                          <div className={styles["packagecard_disoucntprice"]}>
                            <p className={styles["packagecard_disoucntprice_para"]}>
                              {t("PayOnly")}
                            </p>
                            <h4 className="d-flex justify-content-center align-items-center mt-2">
                              ${data.FirstYearDiscountCharges}/<p>{t("month")}</p>
                            </h4>
                            <p className={styles["packagecard_disoucntprice_para"]}>
                              {t("forFirstYear")}
                            </p>
                          </div>
                        </div>
                        <Button
                          text={t("Upgrade")}
                          // onClick={onClick}
                          className={styles["UpgradeBtnCard"]}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </>
          )
        })}

      </Row>
    </Container>
  );
};

export default PackageUpgrade;
