import React from "react";
import styles from "./complianceCloseConfrmationModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { Button, Modal } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import ComplianceByMe from "../../Tabs/ComplainceByMe";
const ComplianceCloseConfirmationModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    closeConfirmationModal,
    setCloseConfirmationModal,
    setMainComplianceTabs,
    checkListTabs,
    setChecklistTabs,
  } = useComplianceContext();

  const handleYesButton = () => {
    // setMainComplianceTabs(2);
    // setChecklistTabs(0);
    setCloseConfirmationModal(false);
  };

  const handleNoButton = () => {
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
