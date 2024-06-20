import React from "react";
import styles from "./ModalDeleteFIle.module.css";
import { Modal, Button } from "../../../components/elements";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const ModalDeleteFile = ({
  fileDelete,
  setFileDeleted,
  handleClickDeleteFileFunc,
  handleCancelFileDelete,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        show={fileDelete}
        onHide={() => {
          setFileDeleted(false);
        }}
        setShow={setFileDeleted}
        // ButtonTitle={ModalTitle}
        modalFooterClassName="d-block"
        centered
        // size={setRenamefolder === true ? "md" : "md"}
        ModalBody={
          <>
            <Row>
              {/* <Col lg={2} md={2} sm={2}></Col> */}
              <Col lg={12} md={12} sm={12} className="text-center">
                <span className={styles["information_text"]}>
                  {t("Are-you-sure-you-want-to-delete-the-file")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row className="my-3 ">
              <Col
                lg={12}
                sm={12}
                md={12}
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("No")}
                  className={styles["No"]}
                  onClick={handleCancelFileDelete}
                />

                <Button
                  text={t("Yes")}
                  className={styles["Yes"]}
                  onClick={handleClickDeleteFileFunc}
                />
              </Col>
            </Row>
          </>
        }
      />
    </>
  );
};

export default ModalDeleteFile;
