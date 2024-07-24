import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./updateVersionNotifyModal.module.css";
import { Button, Modal } from "../index";
const UpdateVersionNotifyModal = ({ updateVersion, setUpdateVersion }) => {
  const { t } = useTranslation();
  return (
    <Modal
      className={"updateVersion"}
      show={updateVersion}
      setShow={setUpdateVersion}
      onHide={() => setUpdateVersion(true)}
      modalFooterClassName={"d-block"}
      ModalBody={
        <>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["updateVersion_Title"]}>
              {t("Diskus-update-alert")}
            </Col>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["updateVersion_TagLine"]}>
              {t("A-new-update-for-diskus-is-now-available")}
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className='d-flex justify-content-center gap-2 align-items-center'>
              <Button
                text={t("Later")}
                className={styles["later_updateVersionButton"]}
                onClick={() => setUpdateVersion(false)}
              />
              <Button
                text={t("Update-now")}
                className={styles["update_updateVersionButton"]}
                onClick={() => window.location.reload()}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default UpdateVersionNotifyModal;
