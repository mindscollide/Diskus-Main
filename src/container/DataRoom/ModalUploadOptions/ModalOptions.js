import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalOptions.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";
import { uploadDocumentsApi } from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ModalOptions = ({ ModalTitle, UploadOptions, setUploadOptions, uploadDocumentfile, setProgress, setRemainingTime, remainingTime, setShowbarupload, setTasksAttachments }) => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [fileUploadOptions, setFileUploadOptions] = useState(1);
  console.log(fileUploadOptions, "fileUploadOptionsfileUploadOptionsfileUploadOptions")

  const handleuploadFile = async () => {
    await dispatch(uploadDocumentsApi(navigate, uploadDocumentfile, t, setProgress, setRemainingTime, remainingTime, setShowbarupload, setTasksAttachments, fileUploadOptions, setUploadOptions))
    setUploadOptions(false)
  }
  let fileName = localStorage.getItem("fileName");
  return (
    <>
      <Container>
        <Modal
          show={UploadOptions}
          onHide={() => {
            setUploadOptions(false);
          }}
          setShow={setUploadOptions}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          // size={UploadOptions === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Upload_options_Heading"]}>
                      {t("Upload-options")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <p className={styles["paragrapgh"]}>
                      {t("An-item-named")} {" "}
                      <span className={styles["paragraph_fileName"]}>
                        "{fileName}"
                      </span>
                      {" "}  {t("Already-exists-in-this-location")}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={"d-flex justify-content-start gap-3"}
                  >
                    <Form.Check type="radio" checked={fileUploadOptions === 1 ? true : false} onChange={() => setFileUploadOptions(1)} name="dataroomfiles" />
                    <span className={styles["Options"]}>
                      {t("Replace-existing-file")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start gap-3"
                  >
                    <Form.Check type="radio" checked={fileUploadOptions === 2 ? true : false} onChange={() => setFileUploadOptions(2)} name="dataroomfiles" />
                    <span className={styles["Options"]}>
                      {t("Keep-both-files")}
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
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_button_UploadFile"]}
                    onClick={() => setUploadOptions(false)}
                  />

                  <Button
                    text={t("Upload")}
                    onClick={handleuploadFile}
                    // onClick={uploadOptionsonClickBtn}
                    className={styles["Create_button_UploadFile"]}
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

export default ModalOptions;
