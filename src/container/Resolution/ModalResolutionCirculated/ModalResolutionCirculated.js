import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalResolutionCirculated.module.css";
import { useTranslation } from "react-i18next";

import { Button, InputSearchFilter, Modal } from "../../../components/elements";
import { style } from "@mui/system";
const ModalResolutionCirculated = ({
  circulateresolution,
  setcirculateresolution,
  handleCirculateResolution,
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setcirculateresolution(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={circulateresolution}
          onHide={() => {
            setcirculateresolution(false);
          }}
          setShow={setcirculateresolution}
          modalFooterClassName="d-block"
          centered
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
                      {t("Are-you-sure-you-want-to-circulate-this-resolution")}
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
                    onClick={closebtn}
                  />

                  <Button
                    text={t("Confirm")}
                    className={styles["Confirm-activegroup-modal"]}
                    onClick={handleCirculateResolution}
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

export default ModalResolutionCirculated;
