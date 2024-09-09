import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalRenameFolder.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal, TextField } from "../../../components/elements";
import { FolderisExistRename } from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ModalRenameFolder = ({
  renamefolder,
  setRenamefolder,
  setnotification,
  isRenameFolderData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [folderData, setFolderData] = useState({
    FolderName: "",
    folderId: 0,
  });

  useEffect(() => {
    if (isRenameFolderData !== null) {
      setFolderData({
        FolderName: isRenameFolderData.name,
        folderId: isRenameFolderData.id,
      });
    }
  }, [isRenameFolderData]);

  const saveButton = () => {
    // setRenamefolder(false);
    if (folderData.FolderName !== "") {
      // setnotification(true);
      dispatch(FolderisExistRename(navigate, folderData, t, setRenamefolder));
    }
  };

  const CloseButton = () => {
    setRenamefolder(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={renamefolder}
          onHide={() => {
            setRenamefolder(false);
          }}
          setShow={setRenamefolder}
          // ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          // size={setRenamefolder === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  {/* <Col lg={2} md={2} sm={2}></Col> */}
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Rename_Heading"]}>
                      {t("Rename")}
                    </span>
                  </Col>
                  {/* <Col lg={2} md={2} sm={2}></Col> */}
                </Row>
                <Row className="mt-3">
                  {/* <Col lg={2} md={2} sm={2}></Col> */}
                  <Col lg={12} md={12} sm={12} className="rename-modal-field">
                    <TextField
                      value={folderData.FolderName}
                      placeholder={t("Rename")}
                      labelclass="textFieldSearch d-none"
                      maxLength={290}
                      change={(e) =>
                        setFolderData({
                          ...folderData,
                          FolderName: e.target.value,
                        })
                      }
                    />
                  </Col>
                  {/* <Col lg={2} md={2} sm={2}></Col> */}
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mt-3 mb-4">
                {/* <Col lg={2} md={2} sm={2}></Col> */}
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["Cance_renameFolder"]}
                    onClick={CloseButton}
                  />

                  <Button
                    text={t("Save")}
                    className={styles["save_rename_folder"]}
                    onClick={saveButton}
                  />
                </Col>
                {/* <Col lg={2} md={2} sm={2}></Col> */}
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalRenameFolder;
