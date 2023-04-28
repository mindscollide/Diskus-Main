import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalDiscardResolution.module.css";
import { useTranslation } from "react-i18next";

import { Button, InputSearchFilter, Modal } from "../../components/elements";
import { style } from "@mui/system";
const ModalDiscardResolution = ({
  ModalTitle,
  discardresolution,
  setDiscardresolution,
  handleDiscardBtn
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setDiscardresolution(false);
  };
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
                      Are you sure You want to Discard
                    </span>
                  </Col>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span className={styles["Heading_For_Discard_resolution"]}>
                      the Resolution?
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
