import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalAddFolder.module.css";
import { useTranslation } from "react-i18next";

import {
  Button,
  InputSearchFilter,
  Modal,
  TextField,
} from "../../../components/elements";
import { style } from "@mui/system";
const ModalAddFolder = ({ ModalTitle, addfolder, setAddfolder }) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setAddfolder(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={addfolder}
          onHide={() => {
            setAddfolder(false);
          }}
          setShow={setAddfolder}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={addfolder === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["NewFolder_Heading"]}>
                      {t("New-folder")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      width="455px"
                      name="Title"
                      placeholder={t("Name")}
                      labelClass="textFieldSearch d-none"
                    />
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
                    className={styles["Cancel_button_AddFolder"]}
                  />

                  <Button
                    text={t("Create")}
                    className={styles["Create_button_AddFolder"]}
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

export default ModalAddFolder;
