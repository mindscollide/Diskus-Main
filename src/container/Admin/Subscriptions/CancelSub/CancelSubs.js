import React, { useState } from "react";
import { Container, Row, Col, Card, Form, ProgressBar } from "react-bootstrap";
import styles from "./CancelSub.module.css";

import PackageCard from "../../../../components/elements/packageselection/PackageCards";
import "./../../../../i18n";
import { Modal } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { Button, WarningMessageBox } from "../../../../components/elements";
import UpgradePackageDetail from "../../../../components/elements/upgradePackageDetail/UpgradePackageDetail";
import { Link } from "react-router-dom";

const CancelSubs = () => {
  const { t } = useTranslation();
  const [cancelDailogBox, setCancelDailogBox] = useState(false);
  const [forrevokeCancel, setForRevokeCancel] = useState(false);
  const [enableTextArea, setEnableTextArea] = useState(false)
  const handleClickCancelNowBtn = () => {
    setCancelDailogBox(!cancelDailogBox);
  };
  const handleClickCompleteContractBtn = () => { 
    setCancelDailogBox(!cancelDailogBox);
  };
  return (
    <Container className="py-4 position-relative">
      <Row>
        <Col
          sm={12}
          md={12}
          lg={12}
          className="text-center text-capatlize fw-bold fs-3 my-3"
        >
          {t("Cancel-Subscription")}
        </Col>
      </Row>
      <Row>
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex justify-content-center align-items-center mt-2 mx-auto"
        >
          <PackageCard
            packageTitle={t("Silver")}
            para="jklsdjfklasjfaskfhakfjash fkas fhasjkf haskjfhasdkf lashdfkjas hfklasfhlas jkfhasjkfa hk"
            selectedPackageAmount={t("50")}
            SelectedPackgeSubscription={t("Annually")}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={6} lg={6} className="mx-auto my-4">
          <Row>
            <Col sm={12} md={6} lg={6}>
              <Button
                text={t("Cancel-Now")}
                onClick={handleClickCancelNowBtn}
                className={styles["CancelNowBtn"]}
              />
            </Col>
            <Col sm={12} md={6} lg={6}>
              <Button
                text={t("Completion-Of-Contract")}
                className={styles["CompleteContract"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        show={cancelDailogBox}
        setShow={setCancelDailogBox}
        modalBodyClassName={styles["CancelSubModal"]}
        size="xl"
        modalHeaderClassName={styles["CancelSubHeaderModal"]}
        ModalBody={(
          <Card className={styles["UpgradePackageCard"]}>
            <Row>
              <Col
                sm={12}
                md={4}
                lg={4}
                className="border-right-0 position-relative"
              >
                <Col sm={12} md={12} lg={12} className="mb-4">
                  <h3 className={styles["packageheading"]}>{t("Premium")}</h3>
                  <h4 className="text-center fw-900 m-0 p-0">
                    ${t("55")}/{t("month")}
                  </h4>
                  <p className="mx-auto text-center m-0 p-0">
                    {t("Annually-subscription")}
                  </p>
                </Col>
                <Row className="mt-5">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="text-center text-uppercase fw-bold my-2"
                  >
                    {t("Users")}
                  </Col>
                  <Col sm={12} md={12} lg={12}>
                    <ProgressBar
                      now={2}
                      max={3}
                      className={styles["ExecutiveMembersRange"]}
                    />
                  </Col>
                  <Col sm={12} md={12} lg={12} className="text-center my-2">
                    {t("2-of-3-Executives")}
                  </Col>
                  <Col sm={12} md={12} lg={12}>
                    <ProgressBar
                      now={1}
                      max={2}
                      className={styles["BoardMembersRange"]}
                    />
                  </Col>
                  <Col sm={12} md={12} lg={12} className="text-center my-2">
                    {t("1-to-2-Board-memebers")}
                  </Col>
                </Row>
                <Col sm={12} md={12} lg={12}>
                  <span className={styles["lineBar_cancelSub"]}></span>
                </Col>
              </Col>

              <Col sm={12} md={8} lg={8}>
                <Row className="ms-3">
                  <Col
                    sm={12}
                    md={7}
                    lg={7}
                    className="mx-auto my-5 d-flex justify-content-center"
                  >
                    <WarningMessageBox />
                  </Col>
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className={styles["upgradePackageAmoutnandList"]}
                  >
                    <p className="fw-900 m-0">
                      {t("What-is-the-reason-for-your-leaving?")}
                    </p>
                    <Form.Group className="mb-2">
                      <Form.Check
                        type="checkbox"
                        className="user-select-none my-2"
                        label={t("Its-too-costly")}
                      />
                      <Form.Check
                        type="checkbox"
                        className="user-select-none my-2"
                        label={t("I-found-another-product-that-fulfills-my-needs")}
                      />
                      <Form.Check
                        type="checkbox"
                        className="user-select-none my-2"
                        label={t("I-dont-use-it-enough")}
                      />
                      <Form.Check
                        type="checkbox"
                        className="user-select-none my-2"
                        label={t("Others")}
                        onClick={() => setEnableTextArea(!enableTextArea)}
                      />
                      <Form.Control disabled={enableTextArea ? false : true} as="textarea" className={styles["CancelSubModalTextArea"]}></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={12} lg={12} className="mt-4 mb-3">
                    <Row>
                      {forrevokeCancel ? (
                        <>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="d-flex justify-content-center my-2"
                          >
                            <Button
                              text="Proceed with Cancellation"
                              onClick={handleClickCancelNowBtn}
                              className={styles["proceedwithCancelatioBtn"]}
                            />
                          </Col>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="d-flex justify-content-center"
                          >
                            <Link
                              to=""
                              className="text-black text-decoration-underline text-center"
                            >
                              Go Back
                            </Link>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col
                            sm={12}
                            md={6}
                            lg={6}
                            className="d-flex justify-content-center"
                          >
                            <Button
                              text={t("Cancel")}
                              onClick={handleClickCancelNowBtn}
                              className={styles["CancelNowBtn"]}
                            />
                          </Col>
                          <Col sm={12} md={6} lg={6}>
                            <Button
                              text={t("Proceed")}
                              type="submit"
                              className={styles["ProceedBtn"]}
                              onClick={handleClickCompleteContractBtn}
                            />
                          </Col>
                        </>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )}
      />

    </Container>
  );
};

export default CancelSubs;
