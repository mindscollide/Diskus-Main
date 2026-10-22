import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalCancelUpload.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";

const ModalCancelUpload = ({
  canselingDetaUplodingForFOlder,
  setCanselingDetaUplodingForFOlder,
  CanceUploadinFromModalTrue,
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setCanselingDetaUplodingForFOlder(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={canselingDetaUplodingForFOlder}
          onHide={() => {
            setCanselingDetaUplodingForFOlder(false);
          }}
          setShow={setCanselingDetaUplodingForFOlder}
          modalFooterClassName="d-block"
          centered
          size={canselingDetaUplodingForFOlder === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Cancel_Upload_options_Heading"]}>
                      {t("Cancel-upload")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <p className={styles["paragrapgh"]}>
                      {t(
                        "Your-upload-is-not-complete-would-you-like-to-cancel-the-upload"
                      )}
                    </p>
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
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={t("Continue-upload")}
                    className={styles["Continue_Upload_button_UploadFile"]}
                    onClick={closebtn}
                  />

                  <Button
                    text={t("Cancel-upload")}
                    className={styles["Cancel_Upload_button_UploadFile"]}
                    onClick={CanceUploadinFromModalTrue}
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
