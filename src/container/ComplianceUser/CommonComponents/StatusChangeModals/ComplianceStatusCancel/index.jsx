import React, { useEffect, useState } from "react";
import { Button, Modal, Radio } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import styles from "./complianceStatusCancel.module.css";

import CustomRadioGroup from "../../../../../components/elements/radio/CustomRadioGroup";
import ComplianceStatusChangeResonReasonModal from "../ComplianceStatusOnHoldReasonModal";
// import ComplianceStatusOnHoldReasonModal from "../ComplianceStatusOnHoldReasonModal";

const ComplianceStatusCancelModal = () => {
  const { t } = useTranslation();
  const [selectOptions, setSelectOption] = useState(0);
  const {
    complianceCancelModal,
    setComplianceCancelModal,
    setComplianceStatusChangeReasonModal,
    setComplianceCancelSelectOption,
    resetModalStates,
    complianceDetailsState,
    complianceOnHoldSelectOption,
  } = useComplianceContext();

  console.log(selectOptions, "selectOptionsselectOptions");

  const handleCloseButton = () => {
    setSelectOption(0);
    resetModalStates();
  };
  const handleProceedButton = () => {
    console.log(selectOptions, "selectOptionsvalue");
    setSelectOption(0);
    setComplianceCancelModal(false);
    setComplianceStatusChangeReasonModal(true);
    setComplianceCancelSelectOption(selectOptions);
  };

  useEffect(() => {
    return () => {
      setSelectOption(0);
    };
  }, []);

  return (
    <>
      <Modal
        show={complianceCancelModal}
        setShow={setComplianceCancelModal}
        modalFooterClassName={"d-block border-0"}
        // modalHeaderClassName={"d-block border-0"}
        modalHeaderClassName={"cancelComplianceHeader"}
        modalBodyClassName={"cancelCompliancebody"}
        modalTitleClassName={styles.StatusTitle}
        contentClassName={styles["StatusChangeModal"]}
        onHide={handleCloseButton}
        ModalTitle={t("Cancel-compliance?")}
        closeButton={true}
        ModalBody={
          <>
            <div className={styles.confirmationMessage}>
              {t(
                "Once-cancelled,-this-compliance-cannot-be-Re-opened-or-moved-back-to-In-Progress"
              )}
            </div>
            <div className="mt-4">
              <CustomRadioGroup
                radioButtonClass={styles.radioBtnStyle}
                defaultValue={selectOptions}
                className="complianceRadioButton"
                value={selectOptions}
                onChange={(event) => setSelectOption(event.target.value)}
                options={[
                  {
                    label: t("Cancel-compliance-only"),
                    value: 0,
                  },
                  {
                    label: t("Cancel-compliance-with-associated-items"),
                    value: 1,
                  },
                ]}
              />
            </div>
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
                  text={t("Cancel")}
                  className={styles["CancelButton"]}
                  onClick={handleCloseButton}
                />
                <Button
                  text={t("Confirm-action")}
                  className={styles["ProceedButtonStyles"]}
                  onClick={handleProceedButton}
                />
              </Col>
            </Row>
          </>
        }
      />
      <ComplianceStatusChangeResonReasonModal />
    </>
  );
};

export default ComplianceStatusCancelModal;
