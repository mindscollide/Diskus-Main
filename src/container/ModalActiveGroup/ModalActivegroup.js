import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./ModalActivegroup.module.css";

import { Button, Modal } from "../../components/elements";
const ModalActivegroup = ({ ModalTitle, Activegroup, setActivegroup }) => {
  const { t } = useTranslation();
  return (
    <>
      <Container>
        <Modal
          show={Activegroup}
          onHide={() => {
            setActivegroup(false);
          }}
          setShow={setActivegroup}
          ButtonTitle={ModalTitle}
          centered
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <span
                      className={styles["heading-modal-active-contfirmation"]}
                    >
                      {t("Are-you-sure-you-want-to")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <span
                      className={styles["heading-modal-active-contfirmation"]}
                    >
                      {t("Active-this-group?")}
                    </span>
                  </Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row>
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={t("Confirm")}
                    className={styles["Confirm-activegroup-modal"]}
                  />
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancell-activegroup-modal"]}
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

export default ModalActivegroup;
