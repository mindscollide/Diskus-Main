import React from "react";
import styles from "./deleteChecklistConfirmationModal.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { Button, Modal } from "../../../../components/elements";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DeleteCheckListAPI } from "../../../../store/actions/ComplainSettingActions";
const DeleteChecklistConfirmationModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    emptyComplianceState,
    deleteChecklistConfirmationModalState,
    setDeleteChecklistConfirmationModalState,
    deleteChecklistId,
    complianceInfo,
    resetModalStates,
  } = useComplianceContext();

  const handleYesButton = () => {
    try {
      const Data = {
        checklistId: deleteChecklistId,
      };
      console.log(Data, "handleDeleteChecklist");
      dispatch(
        DeleteCheckListAPI(
          navigate,
          Data,
          t,
          complianceInfo,
          setDeleteChecklistConfirmationModalState
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleNoButton = () => {
    setDeleteChecklistConfirmationModalState(false);
    resetModalStates();
  };

  return (
    <Modal
      show={deleteChecklistConfirmationModalState}
      setShow={setDeleteChecklistConfirmationModalState}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"md"}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <div className={styles["ConfirmationHeading"]}>
                {t(
                  "All-the-associated-tasks-within-this-checklist-will-also-be-deleted.-Are-you-sure-you-want-to-delete-this-checklist?"
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

export default DeleteChecklistConfirmationModal;
