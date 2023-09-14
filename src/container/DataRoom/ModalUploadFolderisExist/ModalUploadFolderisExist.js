import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "../ModalUploadOptions_Folder/ModalOptions_Folder.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../../../components/elements";
import { useDispatch } from "react-redux";
import { FolderisExist_success } from "../../../store/actions/FolderUploadDataroom";

const ModalOptionsisExistFolder = ({
  isFolderExist,
  setIsFolderExist,
  directoryNames,
  setFolderUploadOptions,
  folderUploadOptions,
  detaUplodingForFOlder,
  setDetaUplodingForFOlder,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleUploadFolder = async () => {
    if (isFolderExist) {
      await dispatch(FolderisExist_success(null));
    }
  };
  const onHideModal = async () => {
    setIsFolderExist(false);
    const updatedArray = [...detaUplodingForFOlder]; // Create a shallow copy of the array
    updatedArray.pop(); // Remove the last object
    setDetaUplodingForFOlder(updatedArray);
    await dispatch(FolderisExist_success(null));

  };
  return (
    <>
      <Container>
        <Modal
          show={isFolderExist}
          onHide={() => {onHideModal()}}
          setShow={setIsFolderExist}
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
                        "{directoryNames}"
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
                    onClick={onHideModal}
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

export default ModalOptionsisExistFolder;
