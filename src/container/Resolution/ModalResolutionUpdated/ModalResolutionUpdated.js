import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalResolutionUpdated.module.css";
import upcircle from "../../../assets/images/upcircle.svg";
import updatetik from "../../../assets/images/uptik.svg";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../components/elements";

const ModalResolutionUpdated = ({
  ModalTitle,
  resolutionupdated,
  setResolutionupdated,
}) => {
  const { t } = useTranslation();

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
                      <img
                        draggable="false"
                        alt=""
                        src={upcircle}
                        width="80px"
                        height="80px"
                      />
                    </span>
                    <span className={styles["Tik_arrow"]}>
                      <img
                        draggable="false"
                        alt=""
                        src={updatetik}
                        width="41.09px"
                        height="35.02px"
                      />
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
                    {t("Resolution-updated")}
                  </span>
                </Col>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["Heading_Success_updateResolution"]}>
                    {t("Successfully")}
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
