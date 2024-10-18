import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UpgradePackageDetail from "../../../../components/elements/upgradePackageDetail/UpgradePackageDetail";

const PackageUpgradeSelect = () => {
  return (
    <Container>
      <Row>
        <Col sm={12} md={12} lg={12} className="fs-4 text-center my-4">
          Select Package
        </Col>
        <Col sm={12} md={12} lg={12}>
          <UpgradePackageDetail />
        </Col>
      </Row>
    </Container>
  );
};

export default PackageUpgradeSelect;
