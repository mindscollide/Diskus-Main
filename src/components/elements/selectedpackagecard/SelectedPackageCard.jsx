import React from "react";
import styles from "./SelectPackageCard.module.css";
import { Container, Row, Col } from "react-bootstrap";
/**
 * @component SelectedPackageCard
 * @description A layout card that renders a titled container for displaying details
 * of the currently selected subscription package. The heading and body rows are
 * fully controlled by the parent via props, making this a purely presentational
 * wrapper component.
 *
 * @param {React.ReactNode} PackageHeading - Content rendered as the card heading (text or JSX).
 * @param {React.ReactNode} RowsData - Body content (typically one or more Bootstrap Row elements)
 *   rendered inside the container below the heading.
 * @param {string} PackageHeadingClass - CSS class name(s) applied to the heading column.
 *
 * @example
 * <SelectedPackageCard
 *   PackageHeading="Premium Plan"
 *   PackageHeadingClass="fw-bold text-center"
 *   RowsData={<Row><Col>Detail content</Col></Row>}
 * />
 */
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
