import React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import styles from './CancelSub.module.css'
import PackageCard from '../../../../components/elements/packageselection/PackageCards'
import { Button } from "../../../../components/elements";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";


const CancelSubs = () => {

  const {t} = useTranslation();
  return <Container className="py-4">
    <Row>
      <Col sm={12} md={12} lg={12} className="text-center text-capatlize fw-bold fs-3 my-3" >
        {t("Cancel-Subscription")}
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6} lg={6} className="d-flex justify-content-center align-items-center mt-2 mx-auto">
        <PackageCard packageTitle={t("Silver")} para="jklsdjfklasjfaskfhakfjash fkas fhasjkf haskjfhasdkf lashdfkjas hfklasfhlas jkfhasjkfa hk" selectedPackageAmount="50" SelectedPackgeSubscription="Annually" />
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6} lg={6} className="mx-auto my-4">
        <Row>
          <Col sm={12} md={6} lg={6} >
            <Button text={t("Cancel-Now")} className={styles["CancelNowBtn"]} />
          </Col>
          <Col sm={12} md={6} lg={6}>
            <Button text={t("Completion-Of-Contract")} className={styles["CompleteContract"]} />
          </Col>
        </Row>
      </Col>
    </Row>
  </Container >;
};

export default CancelSubs;
