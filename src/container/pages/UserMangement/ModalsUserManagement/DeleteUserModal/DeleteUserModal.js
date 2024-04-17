import React from "react";
import styles from "./DeleteUserModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { showDeleteUsersModal } from "../../../../../store/actions/UserMangementModalActions";
import { Col, Row } from "react-bootstrap";
import { deleteOrganizationUserAPI } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
const DeleteUserModal = ({ deleteModalData }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let userID = localStorage.getItem("userID");

  let organizationID = localStorage.getItem("organizationID");

  const { UserManagementModals } = useSelector((state) => state);

  const handleCancelButton = () => {
    dispatch(showDeleteUsersModal(false));
  };

  const handleProceedButton = () => {
    let data = {
      OrganizationID: Number(organizationID),
      RequestingUserID: Number(userID),
      UserID: Number(deleteModalData.userID),
    };
    dispatch(deleteOrganizationUserAPI(navigate, t, data));
  };

  return (
    <section>
      <Modal
        show={UserManagementModals.deleteUsersModal}
        setShow={dispatch(showDeleteUsersModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showDeleteUsersModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                <span className={styles["ConfirmationHeading"]}>
                  {t("Are-you-sure-you-want-to-delete-this-user")}
                </span>
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
                  text={t("Proceed")}
                  className={styles["ProceedButtonStyles"]}
                  onClick={handleProceedButton}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default DeleteUserModal;
