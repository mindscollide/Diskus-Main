import React from "react";
import styles from "./ReasonForCancelSubs.module.css";
import { Button, Checkbox, Modal } from "../../../../../components/elements";
import { showReasonForLeavingModal } from "../../../../../store/actions/UserMangementModalActions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
const ReasonForCancelSubs = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);
  return (
    <section>
      <Modal
        show={UserManagementModals.reasonForleavingModal}
        setShow={dispatch(showReasonForLeavingModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"lg"}
        onHide={() => {
          dispatch(showReasonForLeavingModal(false));
        }}
        ModalBody={
          <>
            <section className={styles["overAllAlignmentModal"]}>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <span className={styles["ResonseModalHeading"]}>
                    {t("Pleas-tell-us-your-main-reason-for-leaving-required")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={styles["appliedScroller"]}
                >
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t(
                          "Performance-is-poor-or-features-don’t-work-properly"
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("My-business-is-downsizing-or-reducing-its-budget")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t(
                          "I-am-not-leaving-i-am-using-another-account-or-made-a-new-one"
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("I-couldn’t-get-others-to-use-it")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t(
                          "My-business-didn’t-need-or-isn’t-ready-for-diskus-portal"
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("My-business-requires-that-I-use-a-different-tool")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t(
                          "It’s-missing-functionality-or-functionality-is-too-basic"
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("I-want-to-use-an-all-in-one-tool-for-my-business")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("I-didn’t-receive-enough-support-or-training")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("The-price-I-was-paying-changed")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("It’s-not-customizable-enough")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("I-am-restricted-by-feature-usage-limits")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("I-left-or-changed-positions-in-my-business")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("My-business-closed")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("I-never-got-started-or-set-up-correctly")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("It’s-too-expensive")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex gap-2"
                    >
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t(
                          "It’s-missing-an-integration-or-integration-is-too-basic"
                        )}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className={styles["overAllAlignmentModal"]}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Nevermind-take-me-back-to-my-account")}
                    className={styles["NevermindbuttonStyles"]}
                  />
                  <Button
                    text={t("Continue-to-cancel")}
                    className={styles["ContinurToCancelButton"]}
                  />
                </Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default ReasonForCancelSubs;
