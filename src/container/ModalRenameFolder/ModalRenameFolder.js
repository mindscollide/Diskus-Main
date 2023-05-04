import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalRenameFolder.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal, TextField } from "../../components/elements";

const ModalRenameFolder = ({
  ModalTitle,
  renamefolder,
  setRenamefolder,
  setnotification,
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setRenamefolder(false);
  };
  const saveButton = () => {
    setRenamefolder(false);
    setnotification(true);
  };

  const CloseButton = () => {
    setRenamefolder(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={renamefolder}
          onHide={() => {
            setRenamefolder(false);
          }}
          setShow={setRenamefolder}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={setRenamefolder === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={2} md={2} sm={2}></Col>
                  <Col lg={8} md={8} sm={8}>
                    <span className={styles["Rename_Heading"]}>
                      {t("Rename")}
                    </span>
                  </Col>
                  <Col lg={2} md={2} sm={2}></Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}></Col>
                  <Col lg={8} md={8} sm={8} className="rename-modal-field">
                    <TextField
                      placeholder={t("Rename")}
                      labelClass="textFieldSearch d-none"
                    />
                  </Col>
                  <Col lg={2} md={2} sm={2}></Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mt-3 mb-4">
                <Col lg={2} md={2} sm={2}></Col>
                <Col
                  lg={8}
                  sm={8}
                  md={8}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["Cance_renameFolder"]}
                    onClick={CloseButton}
                  />

                  <Button
                    text={t("Save")}
                    className={styles["save_rename_folder"]}
                    onClick={saveButton}
                  />
                </Col>
                <Col lg={2} md={2} sm={2}></Col>
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalRenameFolder;
