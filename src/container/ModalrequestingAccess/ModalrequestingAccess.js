import React, { useState } from "react";
import styles from "./ModalrequestingAccess.module.css";
import { Modal } from "../../components/elements";
import { useTranslation } from "react-i18next";
import newprofile from "../../assets/images/Mask Group 67.svg";
import { Button } from "../../components/elements";
import folder from "../../assets/images/333.svg";
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
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                  <img src={newprofile} height="29px" width="29px" />
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["Accessrequest"]}>
                        Saad Fudda is{" "}
                        <span className={styles["Bold_heading"]}>
                          {" "}
                          requesting access
                        </span>{" "}
                        to the folder
                      </span>
                    </Col>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Line_height"]}
                    >
                      <span className={styles["Email"]}>
                        SaadFudda@gmail.com
                      </span>
                    </Col>
                    <Col lg={12} md={12} sm={12} className="mt-3">
                      <span className={styles["Allow_Access"]}>
                        Please allow access
                      </span>
                    </Col>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Box_Folder"]}
                    >
                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center gap-2"
                        >
                          <img src={folder} height="12.46px" width="14.95px" />
                          <span className={styles["Folder_name"]}>
                            Folder 2
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text="Open Sharing Setting"
                    className={styles["Open_sharing_button"]}
                  />
                </Col>
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
