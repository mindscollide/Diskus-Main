import React from "react";
import styles from "./CreateAdditionalUsersModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { showCreateAddtionalUsersModal } from "../../../../../store/actions/UserMangementModalActions";
import { Checkbox, Modal, TextField } from "../../../../../components/elements";
import crossicon from "../../../../../assets/images/BlackCrossIconModals.svg";
import { Col, Row } from "react-bootstrap";
const CreateAddtionalUsersModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);

  const handleCrossIcon = () => {
    dispatch(showCreateAddtionalUsersModal(false));
  };
  return (
    <section>
      <Modal
        show={UserManagementModals.createAdditionalModals}
        setShow={dispatch(showCreateAddtionalUsersModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showCreateAddtionalUsersModal(false));
        }}
        ModalTitle={
          <>
            {" "}
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
              <Col lg={12} md={12} sm={12}>
                <span className={styles["AddtionalUserheading"]}>
                  {t("Create-addtional-users")}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <TextField
                  placeholder={t("Full-name")}
                  label={
                    <>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["NameCreateAddtional"]}>
                            {t("Name")}{" "}
                            <span className={styles["Steric"]}>*</span>
                          </span>
                        </Col>
                      </Row>
                    </>
                  }
                  applyClass={"updateNotes_titleInput"}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex flex-column flex-wrap"
              >
                <span className={styles["NameCreateAddtional"]}>
                  {t("Organization")}
                </span>
                <span className={styles["NameClass"]}>Waqas Associates</span>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <Row>
                  <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                    <Checkbox classNameDiv="" />
                    <span className={styles["AdminAlsoClass"]}>
                      {t("Is-admin-also")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalFooter={<></>}
      />
    </section>
  );
};

export default CreateAddtionalUsersModal;
