import React from "react";
import styles from "./complianceCloseConfrmationModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { Button, Modal } from "../../../../components/elements";
const ComplianceCloseConfirmationModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { closeConfirmationModal, setCloseConfirmationModal } =
    useComplianceContext();

  const handleCancelButton = () => {
    setCloseConfirmationModal(false);
  };

  const handleProceedButton = () => {
    setCloseConfirmationModal(false);
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
                {t(
                  "All your changes will be lost. Are you sure you want to discard them?"
                )}
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
                onClick={handleCancelButton}
              />
              <Button
                text={t("No")}
                className={styles["ProceedButtonStyles"]}
                onClick={handleProceedButton}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ComplianceCloseConfirmationModal;
