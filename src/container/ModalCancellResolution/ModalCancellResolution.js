import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalCancellResolution.module.css";
import { useTranslation } from "react-i18next";

import { Button, InputSearchFilter, Modal } from "../../components/elements";
import { style } from "@mui/system";
const ModalCancellResolution = ({
  ModalTitle,
  cancelresolution,
  setCancelresolution,
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setCancelresolution(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={cancelresolution}
          onHide={() => {
            setCancelresolution(false);
          }}
          setShow={setCancelresolution}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={cancelresolution === true ? "md" : "md"}
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
                    <span className={styles["Heading_For_Active_Sure"]}>
                      Are you sure You want to
                    </span>
                  </Col>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span className={styles["Heading_For_Active_Sure"]}>
                      Cancel this Resolution?
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
                    className={
                      styles["Confirm-activegroup-modal-cancel-button"]
                    }
                  />

                  <Button
                    text={t("Confirm")}
                    className={styles["Confirm-activegroup-modal"]}
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

export default ModalCancellResolution;
