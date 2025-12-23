import React from "react";
import styles from "./DeleteAuthorityModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
// import { deleteOrganizationUserAPI } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { showDeleteAuthorityModal } from "../../../../../store/actions/ManageAuthoriyAction";
import { useAuthorityContext } from "../../../../../context/AuthorityContext";
import { DeleteAuthorityAPI } from "../../../../../store/actions/ComplainSettingActions";
const DeleteAuthorityModal = () => {
  const { t } = useTranslation();

  const { authorityId, searchPayload } = useAuthorityContext();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //   let userID = localStorage.getItem("userID");

  //   let organizationID = localStorage.getItem("organizationID");

  const deleteAuthorityModal = useSelector(
    (state) => state.ManageAuthorityReducer.deleteAuthorityModal
  );

  const handleCancelButton = () => {
    dispatch(showDeleteAuthorityModal(false));
  };

  const handleProceedButton = () => {
    const data = {
      authorityId: authorityId,
    };
    dispatch(DeleteAuthorityAPI(navigate, data, t, searchPayload));
  };

  return (
    <Modal
      show={deleteAuthorityModal}
      setShow={dispatch(showDeleteAuthorityModal)}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"md"}
      onHide={() => {
        dispatch(showDeleteAuthorityModal(false));
      }}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <div className={styles["ConfirmationHeading"]}>
                {t("Do-you-want-to-delete-this-authority")}
              </div>
              <div className={styles["ConfirmationHeading"]}>
                {t("The-authority-will-be-permanently-deleted")}
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
                text={t("Cancel")}
                className={styles["CancelButton"]}
                onClick={handleCancelButton}
              />
              <Button
                text={t("Delete")}
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

export default DeleteAuthorityModal;
