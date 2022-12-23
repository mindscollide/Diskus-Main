import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/elements";
import PackageCard from "../../../../components/elements/packageselection/PackageCards";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./PackageDetail.module.css";
const PackageDetails = () => {
  //for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigatetoUpgrade = () => {
    navigate("/Diskus/Admin/UpgradePackage")
  }
  return (<Container >
    <Row>
      <Col sm={12} lg={12} md={12} className="text-center my-4"><h2>{t("PackageDetails")}</h2></Col>
    </Row>
    <Row >
      <Col sm={12} md={5} lg={5} className="mb-3">
        <PackageCard packageTitle={t("Silver")} para="jklsdjfklasjfaskfhakfjash fkas fhasjkf haskjfhasdkf lashdfkjas hfklasfhlas jkfhasjkfa hk" selectedPackageAmount="50" SelectedPackgeSubscription="Annually" />
      </Col>
      <Col sm={12} md={7} lg={7} className="mb-3">
        <Col className={` ${styles["upgrade_planBox"]} ${"border py-5 px-5 bg-white h-100"}`} sm={12} md={12} lg={12}>
          <h4 className="fw-900 mt-4">{t("Upgrade-your-Plan!")}</h4>
          <p className="mb-5">{t("Get-more-features-by-upgrading-your-plan")}</p>
          <ul className="mt-5">
            <li>{t("Get-More-Users")}</li>
            <li>{t("Theme-customization")}</li>
            <li>{t("Marketing-tools")}</li>
            <li>{t("Analytics")}</li>
          </ul>
          <Button onClick={navigatetoUpgrade} text={t("Upgrade")} className={styles["upgrade_button"]} />
        </Col>
      </Col>
    </Row>
  </Container>
  );
};

export default PackageDetails;
