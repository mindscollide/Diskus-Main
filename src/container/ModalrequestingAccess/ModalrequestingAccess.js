import React, { useState } from "react";
import styles from "./ModalrequestingAccess.module.css";
import {
  Button,
  InputSearchFilter,
  Checkbox,
  SelectBox,
  Modal,
  TextField,
} from "../../components/elements";
import { useTranslation } from "react-i18next";
import newprofile from "../../assets/images/Mask Group 67.svg";
import failed from "../../assets/images/failed.png";
import { Col, Container, Row } from "react-bootstrap";
const ModalrequestingAccess = ({
  ModalTitle,
  requestingAccess,
  setRequestingAccess,
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setRequestingAccess(false);
  };
  return (
    <Container>
      <Modal
        show={requestingAccess}
        onHide={() => {
          setRequestingAccess(false);
        }}
        setShow={setRequestingAccess}
        ButtonTitle={ModalTitle}
        modalTitleClassName={styles["ModalHeader"]}
        modalHeaderClassName={styles["ModalRequestHeader"]}
        modalFooterClassName="d-block"
        centered
        size={requestingAccess === true ? "md" : "md"}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Red_bar_Background"]}
              >
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2"
                  >
                    <img
                      src={failed}
                      height="18px"
                      width="20px"
                      className={styles["Images"]}
                    />

                    <span className={styles["text_for"]}>
                      Saad fudda is outisde your organization
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Share_a_folder"]}>
                    Share a Folder
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}></Col>
              </Row>
            </Container>
          </>
        }
        ModalFooter={<></>}
      />
    </Container>
  );
};

export default ModalrequestingAccess;
