import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalDiscardResolution.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";
const ModalDiscardResolution = ({
  ModalTitle,
  discardresolution,
  setDiscardresolution,
  handleDiscardBtn,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Modal
          show={discardresolution}
          onHide={() => {
            setDiscardresolution(false);
          }}
          setShow={setDiscardresolution}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={discardresolution === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span className={styles["Heading_For_Discard_resolution"]}>
                      {t("Are-you-sure-you-want-to-discard")}
                    </span>
                  </Col>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span className={styles["Heading_For_Discard_resolution"]}>
                      {t("the-resolution")}
                    </span>
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
                    text={t("Discard")}
                    className={styles["Resolution-Discard-button"]}
                    onClick={handleDiscardBtn}
                  />

                  <Button
                    text={t("Cancel")}
                    className={styles["Resolution_cancell_discard"]}
                    onClick={() => setDiscardresolution(false)}
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

export default ModalDiscardResolution;
