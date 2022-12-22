import React from "react";
import { Container, Row, Col, Card } from 'react-bootstrap'
import styles from './CancelSub.module.css'
import PackageCard from '../../../../components/elements/packageselection/PackageCards'
import { Button, WarningMessageBox } from "../../../../components/elements";
import UpgradePackageDetail from "../../../../components/elements/upgradePackageDetail/UpgradePackageDetail";
import ConfirmationCancelPackage from "../../../../components/elements/confirmationCancelPackage.js/ConfirmationCancelPackage";

const CancelSubs = () => {
  return <Container className="py-4 position-relative">
    <Row>
      <Col sm={12} md={12} lg={12} className="text-center text-capatlize fw-bold fs-3 my-3" >
        Cancel Subscription
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6} lg={6} className="d-flex justify-content-center align-items-center mt-2 mx-auto">
        <PackageCard packageTitle={"Silver"} para="jklsdjfklasjfaskfhakfjash fkas fhasjkf haskjfhasdkf lashdfkjas hfklasfhlas jkfhasjkfa hk" selectedPackageAmount="50" SelectedPackgeSubscription="Annually" />
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6} lg={6} className="mx-auto my-4">
        <Row>
          <Col sm={12} md={6} lg={6} >
            <Button text="Cancel Now" className={styles["CancelNowBtn"]} />
          </Col>
          <Col sm={12} md={6} lg={6}>
            <Button text="Completion of Contract" className={styles["CompleteContract"]} />
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col className={styles["cancelBoxContainer"]}>
        <Row className={styles["cancelBoxCard"]}>
          <Col sm={12} md={12} lg={12}>
            <ConfirmationCancelPackage />
          </Col>
        </Row>
      </Col>
    </Row>
  </Container >;
};

export default CancelSubs;
