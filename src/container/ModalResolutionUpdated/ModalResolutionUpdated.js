import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalResolutionUpdated.module.css";
import upcircle from "../../assets/images/upcircle.svg";
import updatetik from "../../assets/images/uptik.svg";
import { useTranslation } from "react-i18next";

import { Button, InputSearchFilter, Modal } from "../../components/elements";
import { style } from "@mui/system";
const ModalResolutionUpdated = ({
  ModalTitle,
  resolutionupdated,
  setResolutionupdated,
}) => {
  const { t } = useTranslation();
  const closebtn = async () => {
    setResolutionupdated(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={resolutionupdated}
          onHide={() => {
            setResolutionupdated(false);
          }}
          setShow={setResolutionupdated}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={resolutionupdated === true ? "md" : "md"}
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
                    <span>
                      <img src={upcircle} width="80px" height="80px" />
                    </span>
                    <span className={styles["Tik_arrow"]}>
                      <img src={updatetik} width="41.09px" height="35.02px" />
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
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["Heading_For_Updated_successfully"]}>
                    Resolution Updated
                  </span>
                </Col>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["Heading_Success_updateResolution"]}>
                    Successfully
                  </span>
                </Col>
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalResolutionUpdated;
