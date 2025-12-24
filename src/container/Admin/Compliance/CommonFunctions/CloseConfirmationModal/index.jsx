import React from "react";
import styles from "./closeConfrmationModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
// import { deleteOrganizationUserAPI } from "../../../../../store/actions/UserManagementActions";
import { showDeleteAuthorityModal } from "../../../../../store/actions/ManageAuthoriyAction";
import { useAuthorityContext } from "../../../../../context/AuthorityContext";
const CloseConfirmationModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { closeConfirmationModal, setCloseConfirmationModal } =
    useAuthorityContext();

  const handleCancelButton = () => {
    dispatch(showDeleteAuthorityModal(false));
  };

  const handleProceedButton = () => {};

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
                {t("Confirmation")}
              </div>
              <div className={styles["ConfirmationHeading"]}>
                {t(
                  "“All your changes will be lost. Are you sure you want to discard them?"
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

export default CloseConfirmationModal;
