import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalCancelDownload.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";

const ModalCancelDownload = ({
  ModalTitle,
  cancelDownload,
  setCancelDownload,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Modal
          show={cancelDownload}
          onHide={() => {
            setCancelDownload(false);
          }}
          setShow={setCancelDownload}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={cancelDownload === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={2} md={2} sm={2}></Col>
                  <Col lg={8} md={8} sm={8}>
                    <span className={styles["Cancel_download_options_Heading"]}>
                      {t("Cancel-download")}
                    </span>
                  </Col>
                  <Col lg={2} md={2} sm={2}></Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}></Col>
                  <Col lg={8} md={8} sm={8}>
                    <p className={styles["paragrapgh_Cancel_download"]}>
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
                    text={t("Continue-download")}
                    className={styles["Continue_Download_button_UploadFile"]}
                  />

                  <Button
                    text={t("Cancel-download")}
                    className={styles["Cancel_dowload_button_UploadFile"]}
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

export default ModalCancelDownload;
