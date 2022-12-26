import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UpgradePackageCard } from "../../../../components/elements";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";

const PackageUpgrade = () => {
  //for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectUpgrade = () => {
    navigate("/Diskus/Admin/UpgradePackageDetail");
  };
  return (
    <Container className="py-5">
      <Row>
        <Col sm={12} md={12} lg={12} className="text-center fs-3 fw-500 mb-4">
          {t("Upgrade-Your-Package")}
        </Col>
      </Row>
      <Row>
        <Col sm={12} lg={12} md={12} className="mb-4">
          <UpgradePackageCard onClick={selectUpgrade} />
        </Col>
        <Col sm={12} lg={12} md={12}>
          <UpgradePackageCard onClick={selectUpgrade} />
        </Col>
      </Row>
    </Container>
  );
};

export default PackageUpgrade;
