import React from "react";
import styles from "./RequestExtentionModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { showRequestExtentionModal } from "../../../../../store/actions/UserMangementModalActions";
import { Col, Row } from "react-bootstrap";
import crossicon from "../../../../../assets/images/BlackCrossIconModals.svg";
import { Button, Modal } from "../../../../../components/elements";
const RequestExtensionModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { UserManagementModals } = useSelector((state) => state);

  const UserManagementModalsrequestExtentionModalData = useSelector(
    (state) => state.UserManagementModals.requestExtentionModal
  );

  const yesBtnFunctionality = () => {
    dispatch(showRequestExtentionModal(false));
  };

  const handleCrossIcon = () => {
    dispatch(showRequestExtentionModal(false));
  };

  return (
    <section>
      <Modal
        show={UserManagementModalsrequestExtentionModalData}
        setShow={dispatch(showRequestExtentionModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showRequestExtentionModal(false));
        }}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end align-items-center"
              >
                <img
                  src={crossicon}
                  alt=""
                  onClick={handleCrossIcon}
                  className="cursor-pointer"
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Advance_permission_Confirmation"]}>
                  {t("We-have-extended-your-trial-for-another-week")}
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
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("Ok")}
                  className={styles["No_confirmation"]}
                  onClick={yesBtnFunctionality}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default RequestExtensionModal;
