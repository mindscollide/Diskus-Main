import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalCancelUpload.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";

const ModalCancelUpload = ({ ModalTitle, cancellupload, setcancellupload }) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setcancellupload(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={cancellupload}
          onHide={() => {
            setcancellupload(false);
          }}
          setShow={setcancellupload}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={cancellupload === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={2} md={2} sm={2}></Col>
                  <Col lg={8} md={8} sm={8}>
                    <span className={styles["Cancel_Upload_options_Heading"]}>
                      {t("Cancel-upload")}
                    </span>
                  </Col>
                  <Col lg={2} md={2} sm={2}></Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}></Col>
                  <Col lg={8} md={8} sm={8}>
                    <p className={styles["paragrapgh"]}>
                      {t(
                        "Your-upload-is-not-complete-would-you-like-to-cancel-the-upload"
                      )}
                    </p>
                  </Col>
                  <Col lg={2} md={2} sm={2}></Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mt-3 mb-4">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={t("Continue-upload")}
                    className={styles["Continue_Upload_button_UploadFile"]}
                  />

                  <Button
                    text={t("Cancel-upload")}
                    className={styles["Cancel_Upload_button_UploadFile"]}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalCancelUpload;
