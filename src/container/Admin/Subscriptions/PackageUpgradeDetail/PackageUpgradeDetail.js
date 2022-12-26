import React from "react";
import styles from "./PackageUpgradeDetail.module.css";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import UpgradePackageDetail from "../../../../components/elements/upgradePackageDetail/UpgradePackageDetail";
const PackageUpgradeDetail = () => {
  //for Translation
  const { t } = useTranslation();
  return (
    <Container className="py-3">
      <Row>
        <Col sm={12} md={12} lg={12} className="text-center fs-3 fw-500 mb-4">
          {t("Upgrade-Your-Package")}
        </Col>
      </Row>
      <Row>
        <Col sm={12} lg={12} md={12} className="mb-4">
          <UpgradePackageDetail />
        </Col>
        <Col
          sm={12}
          md={12}
          lg={12}
          className="d-flex justify-content-center text-decoration-underline"
        >
          <Link className="text-black fs-5" to="/Diskus/Admin/UpgradePackage">
            {t("Back")}
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default PackageUpgradeDetail;
