import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalresolutionRemove.module.css";
import { useTranslation } from "react-i18next";

import { Button, InputSearchFilter, Modal } from "../../../components/elements";
import { style } from "@mui/system";
const ModalresolutionRemove = ({
  ModalTitle,
  removeparticipant,
  setRemoveparticipant,
  VoterName,
  ProceedBtnFunction,
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setRemoveparticipant(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={removeparticipant}
          onHide={() => {
            setRemoveparticipant(false);
          }}
          setShow={setRemoveparticipant}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={removeparticipant === true ? "md" : "md"}
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
                    <span className={styles["Heading_For_Remove_participant"]}>
                      {t("Are-you-sure-you-want-to")}
                    </span>
                  </Col>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span className={styles["Heading_For_Remove_participant"]}>
                      {t("Remove")} {VoterName}?
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
                    className={styles["Discard_btn_removeParticipant_modal"]}
                    onClick={closebtn}
                  />

                  <Button
                    text={t("Proceed")}
                    className={styles["Proceed_btn_removeParticipant_modal"]}
                    onClick={ProceedBtnFunction}
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

export default ModalresolutionRemove;
