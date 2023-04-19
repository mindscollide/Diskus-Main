import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalOptions.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../components/elements";

const ModalOptions = ({ ModalTitle, UploadOptions, setUploadOptions }) => {
  console.log(UploadOptions, "uploadOptionsmodal");
  const { t } = useTranslation();
  const closebtn = async () => {
    setUploadOptions(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={UploadOptions}
          onHide={() => {
            setUploadOptions(false);
          }}
          setShow={setUploadOptions}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={UploadOptions === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Upload_options_Heading"]}>
                      Upload Options
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <p className={styles["paragrapgh"]}>
                      An item named
                      <span className={styles["paragraph_fileName"]}>
                        "Dairalogo"
                      </span>
                      already exists in this location. Do you want to replace
                      the file you're moving? Replacing the file won’t change
                      the sharing settings
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start gap-3"
                  >
                    <Form.Check type="radio" name="TwoFactor" />
                    <span className={styles["Options"]}>
                      Replace existing file
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start gap-3"
                  >
                    <Form.Check type="radio" name="TwoFactor" />
                    <span className={styles["Options"]}>Keep Both files</span>
                  </Col>
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
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_button_UploadFile"]}
                  />

                  <Button
                    text={t("Upload")}
                    className={styles["Create_button_UploadFile"]}
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

export default ModalOptions;
