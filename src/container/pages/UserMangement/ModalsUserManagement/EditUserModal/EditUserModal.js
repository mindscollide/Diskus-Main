import React from "react";
import styles from "./EditUserModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Modal,
  TextField,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { showEditUserModal } from "../../../../../store/actions/UserMangementModalActions";
const EditUserModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);
  return (
    <section>
      <Modal
        show={UserManagementModals.editUserModal}
        setShow={dispatch(showEditUserModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showEditUserModal(false));
        }}
        ModalBody={
          <>
            <section className={styles["ModalAlignmnet"]}>
              <Row>
                <Col lg={1} md={1} sm={12} xs={12}></Col>
                <Col lg={10} md={10} sm={12} xs={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <span className={styles["EditUsersHeading"]}>
                        {t("Edit-user")}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12} xs={12}>
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
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        placeholder={t("Designation")}
                        label={
                          <>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["NameCreateAddtional"]}>
                                  {t("Designation")}{" "}
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
                      lg={12}
                      md={12}
                      sm={12}
                      className="flex-column flex-wrap"
                    >
                      <span className={styles["NameCreateAddtional"]}>
                        {t("Role")}
                      </span>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          className="d-flex gap-2"
                        >
                          <Checkbox
                            classNameCheckBoxP="m-0 p-0"
                            classNameDiv=""
                          />
                          <span className={styles["AdminAlsoClass"]}>
                            {t("Is-admin-also")}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["NameCreateAddtional"]}>
                        {t("Status")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Select />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex flex-column flex-wrap"
                    >
                      <span className={styles["NameCreateAddtional"]}>
                        {t("Organization")}
                      </span>
                      <span className={styles["EmailStyles"]}>
                        DerrickAdams@gmail.com
                      </span>
                    </Col>
                  </Row>
                </Col>

                <Col lg={1} md={1} sm={12} xs={12}></Col>
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className={styles["ModalAlignmnet"]}>
              <Row>
                <Col lg={1} md={1} sm={12} xs={12}></Col>
                <Col
                  lg={10}
                  md={10}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Update")}
                    className={styles["EdituserModalUpdateButton"]}
                  />
                </Col>
                <Col lg={1} md={1} sm={12} xs={12}></Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default EditUserModal;
