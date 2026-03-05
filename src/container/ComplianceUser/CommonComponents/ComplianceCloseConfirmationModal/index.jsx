import React from "react";
import styles from "./complianceCloseConfrmationModal.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { Button, Modal } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
const ComplianceCloseConfirmationModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    closeConfirmationModal,
    setCloseConfirmationModal,
    setMainComplianceTabs,
    setCreateEditComplaince,
    emptyComplianceState,
    checkListTabs,
    pendingNavigation,
    setPendingNavigation,
  } = useComplianceContext();

  const handleYesButton = () => {
    setMainComplianceTabs(2);
    setCloseConfirmationModal(false);
    setCreateEditComplaince(false);
    setMainComplianceTabs(2);
    emptyComplianceState();

    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleNoButton = () => {
    setCloseConfirmationModal(false);
    setPendingNavigation(null);
  };

  return (
    <Modal
      show={closeConfirmationModal}
      setShow={setCloseConfirmationModal}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"md"}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <div className={styles["ConfirmationHeading"]}>
                {checkListTabs === 1
                  ? t(
                      "All-your-changes-will-be-lost.-Are-you-sure-you-want-to-discard-your-changes",
                    )
                  : "You have unsaved changes. Do you want to save before leaving, or discard and lose your changes?"}
              </div>
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
                text={t("Yes")}
                className={styles["CancelButton"]}
                onClick={handleYesButton}
              />
              <Button
                text={t("No")}
                className={styles["ProceedButtonStyles"]}
                onClick={handleNoButton}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ComplianceCloseConfirmationModal;
