import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalUpdateresolution.module.css";
import { useTranslation } from "react-i18next";

import { Button, InputSearchFilter, Modal } from "../../components/elements";
import { style } from "@mui/system";
const ModalUpdateresolution = ({
  ModalTitle,
  updateresolution,
  setUpdateresolution,
  handleUpdateResolution
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setUpdateresolution(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={updateresolution}
          onHide={() => {
            setUpdateresolution(false);
          }}
          setShow={setUpdateresolution}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={updateresolution === true ? "md" : "md"}
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
                    <span
                      className={styles["Heading_For_Update_resolution_Ask"]}
                    >
                      {t("Are-you-sure-you-want-to-update")}
                    </span>
                  </Col>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span
                      className={styles["Heading_For_Update_resolution_Ask"]}
                    >
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
                    className={styles["Discard_button_updateResolution_modal"]}
                    onClick={closebtn}
                  />

                  <Button
                    text={t("Confirm")}
                    className={styles["Confirm-updateResolution-modal"]}
                    onClick={handleUpdateResolution}
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

export default ModalUpdateresolution;
