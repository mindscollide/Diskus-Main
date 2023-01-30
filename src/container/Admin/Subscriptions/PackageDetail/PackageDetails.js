import React, { useState } from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/elements";
import PackageCard from "../../../../components/elements/packageselection/PackageCards";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./PackageDetail.module.css";
const PackageDetails = () => {
  const [isPackageDetail, setPackageDetail] = useState({
    PackageTitle: "Hello",
    PackageExpiryDate: "",
    PackageSubscriptionDate: "",
    PackageAmount: "",
    PackageDescription: "",
    UsersRangeExecutive: 5,
    UsersRangeBoardMembers: 5

  })
  //for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigatetoUpgrade = () => {
    navigate("/Diskus/Admin/UpgradePackage");
  };
  return (
    <Container>
      <Row>
        <Col sm={12} lg={12} md={12} className="text-center my-4">
          <h2>{t("PackageDetails")}</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={5} lg={5} className="mb-3">
          <Card className={styles["packagecard"]}>
            <Row>
              <Col sm={12}>
                <h4 className="text-center">{isPackageDetail.PackageTitle}</h4>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <div
                  className={`${styles["packagecard_priceBox_container"]}`}
                >
                  <div className={styles["selectedPackage_priceDetails"]}>
                    <div className={styles["packagecard_disoucntprice"]}>
                      <h4 className="d-flex justify-content-center align-items-center mt-2">
                        ${isPackageDetail.PackageAmount}/<p>{t("month")}</p>
                      </h4>
                      <p
                        className={
                          styles["selectedpackagecard_disoucntprice_para"]
                        }
                      >
                        {t("subscriptions")}{" "}
                      </p>
                    </div>
                  </div>
                </div>

              </Col>
              <Col sm={12} className="my-3">
                <Row>
                  <Col sm={12} md={6} lg={6} className="text-center m-0 p-0 ">
                    <p className="border m-0 p-0">{t("Subscription-Date")}</p>
                    <p className="border">{isPackageDetail.PackageSubscriptionDate}</p>
                  </Col>
                  <Col sm={12} md={6} lg={6} className="text-center m-0 p-0 ">
                    <p className="border m-0 p-0">{t("ExpiryDate")}</p>
                    <p className="border">{isPackageDetail.PackageExpiryDate}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} lg={12} className={styles["selected-package-text"]}>
                <p>{isPackageDetail.PackageDescription}</p>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <div className={styles["packagecard_usersallows"]}>
                  <Row>
                    <Col sm={12}>
                      <Row>
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="text-center text-uppercase fw-bold my-2"
                        >
                          {t("Users")}
                        </Col>
                        <Col sm={12} md={12} lg={12} className="m-0 p-0">
                          <ProgressBar
                            now={2}
                            max={isPackageDetail.UsersRangeBoardMembers}
                            className={styles["ExecutiveMembersRange"]}
                          />
                        </Col>
                        <Col sm={12} md={12} lg={12} className="m-0">
                          2 of 3 Executives
                        </Col>
                        <Col sm={12} md={12} lg={12} className="m-0 p-0">
                          <ProgressBar
                            now={1}
                            max={isPackageDetail.UsersRangeExecutive}
                            className={styles["BoardMembersRange"]}
                          />
                        </Col>
                        <Col sm={12} md={12} lg={12} className="m-0">
                          1 to 2 Board memebers
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col sm={12} md={7} lg={7} className="mb-3">
          <Col
            className={` ${styles["upgrade_planBox"]
              } ${"border py-5 px-5 bg-white h-100"}`}
            sm={12}
            md={12}
            lg={12}
          >
            <h4 className="fw-900 mt-4">{t("Upgrade-your-Plan!")}</h4>
            <p className="mb-5">
              {t("Get-more-features-by-upgrading-your-plan")}
            </p>
            <ul className="mt-5">
              <li>{t("Get-More-Users")}</li>
              <li>{t("Theme-customization")}</li>
              <li>{t("Marketing-tools")}</li>
              <li>{t("Analytics")}</li>
            </ul>
            <Button
              onClick={navigatetoUpgrade}
              text={t("Upgrade")}
              className={styles["upgrade_button"]}
            />
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default PackageDetails;
