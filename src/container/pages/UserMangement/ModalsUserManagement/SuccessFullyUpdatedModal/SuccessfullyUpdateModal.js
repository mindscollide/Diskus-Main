import React from "react";
import styles from "./SuccessfullyUpdateModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { showSucessfullyUpdatedModal } from "../../../../../store/actions/UserMangementModalActions";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const SuccessfullyUpdateModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);

  const handleOkButton = () => {
    dispatch(showSucessfullyUpdatedModal(false));
  };
  return (
    <section>
      <Modal
        show={UserManagementModals.successfullyUpdated}
        setShow={dispatch(showSucessfullyUpdatedModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"sm"}
        onHide={() => {
          dispatch(showSucessfullyUpdatedModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                <span className={styles["Sucessfully_Update_heading"]}>
                  {t("Successfully-updated")}
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
                className="d-flex justify-content-center"
              >
                <Button
                  text={t("Ok")}
                  className={styles["OkButton"]}
                  onClick={handleOkButton}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default SuccessfullyUpdateModal;
