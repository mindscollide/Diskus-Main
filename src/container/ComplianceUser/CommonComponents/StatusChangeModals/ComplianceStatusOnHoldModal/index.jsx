import React, { useEffect, useState } from "react";
import { Button, Modal, Radio } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import styles from "./complianceStatusOnHoldModal.module.css";

import alertIcon from "../../../../../assets/images/Alert Icon.png";
import CustomRadioGroup from "../../../../../components/elements/radio/CustomRadioGroup";
import { values } from "lodash";
import ComplianceStatusChangeResonReasonModal from "../ComplianceStatusOnHoldReasonModal";

const CompliaceStatusOnHoldModal = ({ view, handleProceedButtonView }) => {
  const { t } = useTranslation();
  const [selectOptions, setSelectOption] = useState(0);
  const {
    complianceOnHoldModal,
    setComplianceOnHoldModal,
    setComplianceStatusChangeReasonModal,
    setComplianceOnHoldSelectOption,
    resetModalStates,
    complianceDetailsState,
    complianceOnHoldSelectOption,
    statusChangeType,
  } = useComplianceContext();

  console.log(selectOptions, "selectOptionsselectOptions");
  const handleCloseButton = () => {
    setSelectOption(0);
    resetModalStates();
  };
  const handleProceedButton = () => {
    console.log(selectOptions, "selectOptionsvalue");
    setSelectOption(0);
    setComplianceOnHoldModal(false);
    setComplianceStatusChangeReasonModal(true);
    setComplianceOnHoldSelectOption(selectOptions);
  };

  const handleProceedByViewButton = () => {
    setComplianceOnHoldSelectOption(selectOptions);
    handleProceedButtonView();
  };

  useEffect(() => {
    return () => {
      setSelectOption(0);
    };
  }, []);

  return (
    <>
      <Modal
        show={complianceOnHoldModal}
        setShow={setComplianceOnHoldModal}
        modalFooterClassName={"d-block border-0"}
        // modalHeaderClassName={"d-block border-0"}
        modalTitleClassName={styles.StatusTitle}
        contentClassName={styles["StatusChangeModal"]}
        onHide={handleCloseButton}
        ModalTitle={t("Select-option")}
        closeButton={true}
        ModalBody={
          <>
            <CustomRadioGroup
              radioButtonClass={styles.radioBtnStyle}
              defaultValue={selectOptions}
              className="complianceRadioButton"
              value={selectOptions}
              onChange={(event) => setSelectOption(event.target.value)}
              options={[
                {
                  label:
                    statusChangeType === "checklist"
                      ? t("Mark-Checklist-only")
                      : t("Mark-compliance-only"),
                  value: 0,
                },
                {
                  label:
                    statusChangeType === "checklist"
                      ? t("Mark-Checklist-with-associated-items")
                      : t("Mark-compliance-with-associated-items"),
                  value: 1,
                },
              ]}
            />
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
                  className={styles["CancelButton"]}
                  onClick={handleCloseButton}
                />
                <Button
                  text={t("Mark-on-hold")}
                  className={styles["ProceedButtonStyles"]}
                  onClick={
                    view ? handleProceedByViewButton : handleProceedButton
                  }
                />
              </Col>
            </Row>
          </>
        }
      />
      {/* <ComplianceStatusChangeResonReasonModal
        view={view}
        handleProceedButtonView={handleProceedButtonView}
      /> */}
      <ComplianceStatusChangeResonReasonModal />
    </>
  );
};

export default CompliaceStatusOnHoldModal;
