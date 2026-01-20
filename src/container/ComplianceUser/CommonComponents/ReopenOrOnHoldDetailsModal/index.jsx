import React from "react";
import styles from "./ReopenOrOnHoldDetailsModal.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { Button, Modal } from "../../../../components/elements";
const ReopenOrOnHoldDetailsModal = () => {
  // ReopenOrOnHoldDetailsModal
  const { t } = useTranslation();

  const {
    closeConfirmationModal,
    setCloseConfirmationModal,
    setMainComplianceTabs,
    // setChecklistTabs,
    // setChecklistData,
    // setComplianceDetailsState,
    setCreateEditComplaince,
    // setChecklistCount,
    // setTaskCount,
    // setComplianceInfo,
    emptyComplianceState,
  } = useComplianceContext();

  const handleYesButton = () => {
    setMainComplianceTabs(2);
    setCloseConfirmationModal(false);
    setCreateEditComplaince(false);
    // // setChecklistTabs(0);
    // setChecklistCount(0);
    // setTaskCount(0);
    // setCloseConfirmationModal(false);
    // // take user back to ComplianceByMe screen
    // setChecklistData({
    //   checklistTitle: "",
    //   checklistDescription: "",
    //   checklistDueDate: "",
    // });
    // setComplianceDetailsState({
    //   complianceTitle: "",
    //   description: "",
    //   authorityId: 0,
    //   criticality: 0,
    //   dueDate: "",
    //   complianceDueDateForChecklist: "",
    //   tags: [],
    // });
    // setChecklistTabs(1);
    // setCreateEditComplaince(false);
    // setComplianceInfo({
    //   complianceId: 0,
    //   complianceName: "",
    // });
    setMainComplianceTabs(2);
    emptyComplianceState();
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
                  "All-your-changes-will-be-lost.-Are-you-sure-you-want-to-discard-your-changes"
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

export default ReopenOrOnHoldDetailsModal;
