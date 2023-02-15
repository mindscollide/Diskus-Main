import React, { useState } from "react";
import styles from "./ConfirmationCancelPackage.module.css";
import {
  Container,
  Row,
  Col,
  Card,
  CheckBox,
  Form,
  FormCheck,
  ProgressBar,
} from "react-bootstrap";
import "./../../../i18n";
import { useTranslation } from "react-i18next";
import Button from "../../elements/button/Button";
import { Link, useLocation } from "react-router-dom";
import WarningMessageBox from "../warning_message/WarningMessageBox";
const ConfirmationCancelPackage = ({
  onClickCancelNowBtn,
  onClickProceedBtn,
  forrevokeCancel,
}) => {
  // for translation
  const { t } = useTranslation();
  return (
    <Container>
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
                ${t("55")}/{t("Month")}
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
                {t("2-of-3-executives")}
              </Col>
              <Col sm={12} md={12} lg={12}>
                <ProgressBar
                  now={1}
                  max={2}
                  className={styles["BoardMembersRange"]}
                />
              </Col>
              <Col sm={12} md={12} lg={12} className="text-center my-2">
                {t("1-to-2-board-memebers")}
              </Col>
            </Row>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["lineBar_cancelSub"]}></span>
            </Col>
          </Col>

          <Col sm={12} md={8} lg={8}>
            <Row>
              <Col
                sm={12}
                md={7}
                lg={7}
                className="mx-auto mt-5 d-flex justify-content-center"
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
                  {t("What-is-the-reason-for-your-leaving")}
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
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={12} lg={12}>
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
                          text={t("Proceed-with-cancellation")}
                          onClick={onClickCancelNowBtn}
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
                          onClick={onClickCancelNowBtn}
                          className={styles["CancelNowBtn"]}
                        />
                      </Col>
                      <Col sm={12} md={6} lg={6}>
                        <Button
                          text={t("Proceed")}
                          className={styles["ProceedBtn"]}
                          onClick={onClickProceedBtn}
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
    </Container>
  );
};

export default ConfirmationCancelPackage;
