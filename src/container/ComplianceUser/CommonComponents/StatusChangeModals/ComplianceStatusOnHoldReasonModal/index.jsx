import React, { useState } from "react";
import { Button, Modal } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import styles from "./complianceStatusOnHoldReasonModal.module.css";
import { TextAreafieldwithCount } from "../../../../../components/elements/input_field/Input_field_withCount";

const ComplianceStatusChangeResonReasonModal = ({
  view,
  handleProceedButtonView,
}) => {
  const { t } = useTranslation();
  const {
    complianceStatusChangeReasonModal,
    setComplianceStatusChangeReasonModal,
    complianceOnHoldReasonState,
    setComplianceOnHoldReasonState,
    setComplianceDetailsState,
    tempSelectComplianceStatus,
    resetModalStates,
    complianceDetailsState,
  } = useComplianceContext();

  const handleCloseButton = () => {
    if (complianceDetailsState.status.value === 7)
      setComplianceStatusChangeReasonModal(false);
    else {
      resetModalStates();
    }
  };
  const handleProceedButton = () => {
    console.log(complianceOnHoldReasonState, "complianceOnHoldReasonState");
    setComplianceStatusChangeReasonModal(false);
    setComplianceDetailsState((prev) => ({
      ...prev,
      status: tempSelectComplianceStatus,
    }));
  };

  const handleValueChange = (event) => {
    const { value } = event.target;

    // Remove leading spaces
    const trimmedValue = value.replace(/^\s+/, "");

    setComplianceOnHoldReasonState(trimmedValue);
  };

  return (
    <Modal
      show={complianceStatusChangeReasonModal}
      setShow={setComplianceStatusChangeReasonModal}
      modalFooterClassName={"d-block border-0"}
      // modalHeaderClassName={"d-block border-0"}
      modalTitleClassName={styles.StatusTitle}
      contentClassName={styles["StatusChangeModal"]}
      onHide={handleCloseButton}
      ModalTitle={t("Enter Reason")}
      closeButton={true}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <TextAreafieldwithCount
                label={
                  <>
                    {t("Reason")}
                    <span className={styles["sterick"]}>{" *"}</span>
                  </>
                }
                labelClass={styles["labelStyle"]}
                placeholder={t("Reason")}
                showCount={true}
                maxLength={500}
                onChange={handleValueChange}
                name="reason"
                preFixClas={"AddEditAuthorityCounterInputFieldTextArea"}
                value={complianceOnHoldReasonState}
              />
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex justify-content-center gap-2"
            >
              <Button
                text={t("Close")}
                className={styles["ProceedButtonStyles"]}
                onClick={handleCloseButton}
              />
              <Button
                text={t("Proceed")}
                className={styles["CancelButton"]}
                onClick={view ? handleProceedButtonView : handleProceedButton}
                disableBtn={complianceOnHoldReasonState === ""}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ComplianceStatusChangeResonReasonModal;
