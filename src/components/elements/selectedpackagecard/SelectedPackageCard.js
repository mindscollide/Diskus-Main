import React from "react";
import styles from "./SelectPackageCard.module.css";
import { Container, Row, Col } from "react-bootstrap";
const SelectedPackageCard = ({
  PackageHeading,
  RowsData,
  PackageHeadingClass,
}) => {
  return (
    <Row>
      <Col className={styles["payoutstandingBox"]} sm={12} md={12} lg={12}>
        <Container className={styles["selected_package_Container"]}>
          <Row>
            <Col sm={12} md={12} lg={12} className={PackageHeadingClass}>
              {PackageHeading}
            </Col>
          </Row>
          {RowsData}
        </Container>
      </Col>
    </Row>
  );
};

export default SelectedPackageCard;
