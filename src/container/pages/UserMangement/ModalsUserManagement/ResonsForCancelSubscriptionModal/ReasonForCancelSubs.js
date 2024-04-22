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
const ReasonForCancelSubs = ({ completionContract }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { UserManagementModals, UserMangementReducer } = useSelector(
    (state) => state
  );

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

  //Get Cancel Subscription API Call
  useEffect(() => {
    dispatch(getCancelSubscriptionReasonApi(navigate, t));
  }, []);

  //Continue to Cancel Button
  const handleSubmitData = () => {
    if (selectedReasonIds.length === 0) {
      return; // Do not proceed further
    }

    const selectedReasons = cancelSubs.subscriptionCancellationReasons.filter(
      (reason) =>
        selectedReasonIds.includes(reason.pK_SubscriptionCancellationReasonID)
    );

    const cancellationReasons = selectedReasons.map((reason) => reason.reason);

    const subscriptionStatusID = completionContract ? 5 : 6;
    const data = {
      OrganizationID: 480,
      // mehdi said you send 6 to SubscriptionStatusID cause we only send 6 to cancel
      SubscriptionStatusID: subscriptionStatusID,
      CancellationReason: cancellationReasons.join("# "),
    };

    dispatch(cancelOrganizationSubApi(navigate, t, data));
  };

  //Data for Cancel Reason
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

  //Handle Nevermind Button
  const handleNeverMindButton = () => {
    dispatch(showReasonForLeavingModal(false));
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
                    onClick={handleNeverMindButton}
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
