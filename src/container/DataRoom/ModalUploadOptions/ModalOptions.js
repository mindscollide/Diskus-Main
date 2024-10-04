import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalOptions.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";
import {
  IsFileisExist,
  uploadDocumentsApi,
} from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ModalOptions = ({
  setTasksAttachments,
  tasksAttachments,
  tasksAttachmentsID,
  uploadOptionsmodal,
  setUploadOptions,
  setShowbarupload,
  showbarupload,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fileUploadOptions, setFileUploadOptions] = useState(1);

  const handleuploadFile = async () => {
    console.log("tasksAttachments", tasksAttachments[tasksAttachmentsID]);

    dispatch(
      uploadDocumentsApi(
        navigate,
        t,
        tasksAttachments[tasksAttachmentsID],
        tasksAttachments[tasksAttachmentsID].TaskId,
        setTasksAttachments,
        tasksAttachments,
        fileUploadOptions,
        setShowbarupload,
        showbarupload
      )
    );
    await dispatch(IsFileisExist(null));
    setUploadOptions(false);
  };
  let fileName = localStorage.getItem("fileName");
  const cancelButton = async () => {
    await dispatch(IsFileisExist(null));
    localStorage.removeItem("fileName");
    setUploadOptions(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={uploadOptionsmodal}
          onHide={() => {
            setUploadOptions(false);
          }}
          setShow={setUploadOptions}
          modalFooterClassName="d-block"
          centered
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
                      {t("An-item-named")}{" "}
                      <span className={styles["paragraph_fileName"]}>
                        "{fileName}"
                      </span>{" "}
                      {t("Already-exists-in-this-location")}
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
                    <Form.Check
                      type="radio"
                      checked={fileUploadOptions === 1 ? true : false}
                      onChange={() => setFileUploadOptions(1)}
                      name="dataroomfiles"
                    />
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
                    <Form.Check
                      type="radio"
                      checked={fileUploadOptions === 2 ? true : false}
                      onChange={() => setFileUploadOptions(2)}
                      name="dataroomfiles"
                    />
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
                    onClick={cancelButton}
                  />

                  <Button
                    text={t("Upload")}
                    onClick={handleuploadFile}
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
