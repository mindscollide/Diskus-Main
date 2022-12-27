import React, { useState } from "react";
import styles from "./UpgradePackageCard.module.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Button } from "../../elements";
import "./../../../i18n";
import { useTranslation } from "react-i18next";
const UpgradePackageCard = ({ onClick }) => {
  //for translation
  const { t } = useTranslation();
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const handleManualPackage = () => {
    setAnnualPackageShow(false);
  };
  const handleAnnualPackage = () => {
    setAnnualPackageShow(true);
  };
  return (
    <Container>
      <Card className={styles["UpgradePackageCard"]}>
        <Row>
          <Col
            sm={12}
            md={4}
            lg={4}
            className="border-right-0 position-relative"
          >
            <h3 className={styles["packageheading"]}>{t("Gold")}</h3>
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
                <del>${t("40")}/</del>
                <span className="fs-6">{t("month")}</span>
              </h2>
            ) : (
              <h2>
                {" "}
                {t("40")}/<span className="fs-6">{t("month")}</span>
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
                    ${"100"}/<p>{t("month")}</p>
                  </h4>
                  <p className={styles["packagecard_disoucntprice_para"]}>
                    {t("forFirstYear")}
                  </p>
                </div>
              </div>
              <Button
                text={t("Upgrade")}
                onClick={onClick}
                className={styles["UpgradeBtnCard"]}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default UpgradePackageCard;
