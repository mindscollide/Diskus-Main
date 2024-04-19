import React, { useState, useEffect } from "react";
import styles from "./ReasonForCancelSubs.module.css";
import { Button, Modal } from "../../../../../components/elements";
import { showReasonForLeavingModal } from "../../../../../store/actions/UserMangementModalActions";
import { useTranslation } from "react-i18next";
import { Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  getCancelSubscriptionReasonApi,
  cancelOrganizationSubApi,
} from "../../../../../store/actions/UserManagementActions";
const ReasonForCancelSubs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { UserManagementModals, UserMangementReducer } = useSelector(
    (state) => state
  );

  // get organization ID from Local staorage
  const organizationID = localStorage.getItem("organizationID");

  // state for cancel Subscription
  const [cancelSubs, setCancelSubs] = useState([]);
  console.log(cancelSubs, "cancelSubscancelSubs");

  const [selectedReasonIds, setSelectedReasonIds] = useState([]);

  // state for checkbox
  const [checkboxCancel, setCheckboxCancel] = useState({
    isCheckbox: {
      value: false,
      errorMessage: "",
      errorStatus: false,
    },
  });

  console.log(
    checkboxCancel.isCheckbox,
    "cancelSubReasonDatacancelSubReasonData"
  );

  useEffect(() => {
    dispatch(getCancelSubscriptionReasonApi(navigate, t));
  }, []);

  const handleSubmitData = () => {
    if (selectedReasonIds.length === 0) {
      return; // Do not proceed further
    }

    const selectedReasons = cancelSubs.subscriptionCancellationReasons.filter(
      (reason) =>
        selectedReasonIds.includes(reason.pK_SubscriptionCancellationReasonID)
    );

    const cancellationReasons = selectedReasons.map((reason) => reason.reason);

    const data = {
      OrganizationID: 480,
      // mehdi said you send 6 to SubscriptionStatusID cause we only send 6 to cancel
      SubscriptionStatusID: 6,
      CancellationReason: cancellationReasons.join("# "),
    };

    dispatch(cancelOrganizationSubApi(navigate, t, data));
  };

  useEffect(() => {
    if (
      UserMangementReducer.cancelSubReasonData !== null &&
      UserMangementReducer.cancelSubReasonData !== undefined &&
      UserMangementReducer.cancelSubReasonData.length !== 0
    ) {
      setCancelSubs(UserMangementReducer.cancelSubReasonData);
    } else {
      setCancelSubs([]);
    }
  }, [UserMangementReducer.cancelSubReasonData]);

  // handle select for checkbox is Admin
  const handleCancelSubCheckbox = (isChecked, reasonId) => {
    if (isChecked) {
      setSelectedReasonIds((prevSelectedIds) => [...prevSelectedIds, reasonId]);
    } else {
      setSelectedReasonIds((prevSelectedIds) =>
        prevSelectedIds.filter((id) => id !== reasonId)
      );
    }
  };

  //handle select for checkbox is Admin
  // const handleCancelSubCheckbox = (isChecked) => {
  //   setCheckboxCancel((prevState) => ({
  //     ...prevState,
  //     isCheckbox: {
  //       ...prevState.isCheckbox,
  //       value: isChecked,
  //     },
  //   }));
  // };

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
                <span className={styles["appliedScroller"]}>
                  {cancelSubs.subscriptionCancellationReasons !== undefined &&
                  cancelSubs.subscriptionCancellationReasons !== null &&
                  cancelSubs.subscriptionCancellationReasons.length > 0
                    ? cancelSubs.subscriptionCancellationReasons.map((data) => (
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          className="d-flex gap-2 mt-3"
                          key={data.pK_SubscriptionCancellationReasonID}
                        >
                          <Checkbox
                            classNameCheckBoxP="m-0 p-0"
                            classNameDiv=""
                            value={checkboxCancel.isCheckbox.value}
                            onChange={(e) =>
                              handleCancelSubCheckbox(
                                e.target.checked,
                                data.pK_SubscriptionCancellationReasonID
                              )
                            }
                            // Handle checkbox state and actions here
                          />
                          <span className={styles["AdminAlsoClass"]}>
                            {data.reason}
                          </span>
                        </Col>
                      ))
                    : null}
                </span>
              </Row>

              {/* <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={styles["appliedScroller"]}
                >
                  {cancelSubs.subscriptionCancellationReasons.map(
                    (data, index) => {
                      {
                        console.log(data, "adadadddad");
                      }
                    }
                  )}

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
              </Row> */}
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
                    onClick={handleSubmitData}
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
