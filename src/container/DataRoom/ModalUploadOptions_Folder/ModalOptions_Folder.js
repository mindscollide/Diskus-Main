import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalOptions_Folder.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";
import { createFolderApi } from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ModalOptionsFolder = ({
  isExistFolder,
  setIsExistFolder,
  setAddfolder,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [folderUploadOptions, setFolderUploadOptions] = useState(1);
  let folderName = localStorage.getItem("folderName");

  const handleUploadFolder = async () => {
    await dispatch(
      createFolderApi(
        navigate,
        folderName,
        t,
        setAddfolder,
        folderUploadOptions,
        setIsExistFolder
      )
    );
  };
  return (
    <>
      <Container>
        <Modal
          show={isExistFolder}
          onHide={() => {
            setIsExistFolder(false);
          }}
          setShow={setIsExistFolder}
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
                        "{folderName}"
                      </span>{" "}
                      {t("Already-exists-in-this-location-folder")}
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
                      checked={folderUploadOptions === 1 ? true : false}
                      onChange={() => setFolderUploadOptions(1)}
                      name="dataroomfiles"
                    />
                    <span className={styles["Options"]}>
                      {t("Replace-existing-folder")}
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
                      checked={folderUploadOptions === 2 ? true : false}
                      onChange={() => setFolderUploadOptions(2)}
                      name="dataroomfiles"
                    />
                    <span className={styles["Options"]}>
                      {t("Keep-both-folders")}
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
                    onClick={() => setIsExistFolder(false)}
                  />

                  <Button
                    text={t("Upload")}
                    onClick={handleUploadFolder}
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

export default ModalOptionsFolder;
