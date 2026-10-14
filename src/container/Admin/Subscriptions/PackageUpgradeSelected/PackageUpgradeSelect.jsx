import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UpgradePackageDetail from "../../../../components/elements/upgradePackageDetail/UpgradePackageDetail";
import { useTranslation } from "react-i18next";

const PackageUpgradeSelect = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Row>
        <Col sm={12} md={12} lg={12} className="fs-4 text-center my-4">
          {t("Select-package")}
        </Col>
        <Col sm={12} md={12} lg={12}>
          <UpgradePackageDetail />
        </Col>
      </Row>
    </Container>
  );
};

export default PackageUpgradeSelect;
