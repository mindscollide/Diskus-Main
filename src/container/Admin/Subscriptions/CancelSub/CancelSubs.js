import React, { useState } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap'
import styles from './CancelSub.module.css'
import PackageCard from '../../../../components/elements/packageselection/PackageCards'
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Button, WarningMessageBox } from "../../../../components/elements";
import UpgradePackageDetail from "../../../../components/elements/upgradePackageDetail/UpgradePackageDetail";
import ConfirmationCancelPackage from "../../../../components/elements/confirmationCancelPackage.js/ConfirmationCancelPackage";


const CancelSubs = () => {
  const { t } = useTranslation();
  const [cancelDailogBox, setCancelDailogBox] = useState(false)
  const [forrevokeCancel, setForRevokeCancel] = useState(false)
  const handleClickCancelNowBtn = () => {
    setCancelDailogBox(!cancelDailogBox)
  }
  const handleClickCompleteContractBtn = () => {

  }
  return (<Container className="py-4 position-relative">
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
          <Button text="Cancel Now" onClick={handleClickCancelNowBtn} className={styles["CancelNowBtn"]} />
          </Col>
          <Col sm={12} md={6} lg={6}>
          <Button text={t("Completion-Of-Contract")} className={styles["CompleteContract"]} />
          </Col>
        </Row>
      </Col>
    </Row>
    {cancelDailogBox && <Row>
      <Col className={styles["cancelBoxContainer"]}>
        <Row className={styles["cancelBoxCard"]}>
          <Col sm={12} md={12} lg={12}>
            <ConfirmationCancelPackage onClickCancelNowBtn={handleClickCancelNowBtn} forrevokeCancel={forrevokeCancel} />
          </Col>
        </Row>
      </Col>
    </Row>}

  </Container >)
};

export default CancelSubs;
