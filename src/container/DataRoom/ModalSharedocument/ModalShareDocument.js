import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Modal, Button } from "../../../components/elements";
import styles from "./ModalShareDocument.module.css";
import newprofile from "../../../assets/images/Mask Group 67.svg";
import star from "../../../assets/images/startd.png";
import download from "../../../assets/images/Icon feather-download.svg";
import pdf from "../../../assets/images/222.svg";
import { useTranslation } from "react-i18next";
const ModalShareDocument = ({ setInviteModal, inviteModal }) => {
  const { t } = useTranslation();
  // const [invitDocument, setInviteDocument] = useState(true)
  return (
    <>
      <Modal
        show={inviteModal}
        setShow={setInviteModal}
        onHide={() => {
          setInviteModal(false);
        }}
        size={"md"}
        closeButton
        modalFooterClassName={styles["shareDocument_footerClass"]}
        modalBodyClassName={styles["shareDocument_bodyClass"]}
        ModalBody={
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Shared_Document_Heading"]}>
                  Saad Fudda {t("Shared-a-document")}
                </span>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                <img
                  draggable="false"
                  src={newprofile}
                  height="40px"
                  width="41px"
                />
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Line-height"]}
                  >
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["InvitetoEdit_Heading"]}>
                          Saad Fudda (Saad@gmail.com)
                          {t("Has-invited-you-to")}
                          <span className={styles["Edit_options"]}>
                            {t("Edit")}
                          </span>{" "}
                          <span className={styles["InvitetoEdit_Heading"]}>
                            {t("The-following-document-until")} 27 Apr 2023,
                            11:59 GMT
                          </span>
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Box_for_attachments"]}
              >
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <Row>
                      <Col
                        lg={10}
                        md={10}
                        sm={10}
                        className="d-flex justify-content-start gap-2 "
                      >
                        <img
                          draggable="false"
                          src={pdf}
                          height="16px"
                          width="14.23px"
                        />
                        <span className={styles["File_name"]}>
                          Merger proposal for ABC Industries.pdf
                        </span>
                      </Col>
                      <Col
                        lg={2}
                        md={2}
                        sm={2}
                        className="d-flex justify-content-end gap-2 mt-1"
                      >
                        <img
                          draggable="false"
                          src={download}
                          height="11px"
                          width="12.15px"
                        />
                        <img
                          draggable="false"
                          src={star}
                          height="10.22px"
                          width="12.07px"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        }
        ModalFooter={
          <Row>
            <Col lg={11} md={11} sm={11} className="d-flex justify-content-end">
              <Button text={t("Open")} className={styles["Open_button"]} />
            </Col>
          </Row>
        }
      />
    </>
  );
};

export default ModalShareDocument;
