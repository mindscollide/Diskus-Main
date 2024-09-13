import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ModalRenameFile.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal, TextField } from "../../../components/elements";
import {
  FileisExist2,
  FolderisExistRename,
} from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ModalRenameFile = ({
  showrenameFile,
  setShowRenameFile,
  isRenameFileData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState({
    FileName: "",
    FileId: 0,
  });
  console.log(isRenameFileData, "folderDatafolderDatafolderData");
  useEffect(() => {
    try {
      if (isRenameFileData !== null && isRenameFileData !== undefined) {
        setFileData({
          FileName: isRenameFileData.name,
          FileId: isRenameFileData.id,
        });
      }
    } catch (error) {}
  }, [isRenameFileData]);

  const saveButton = () => {
    if (fileData.FileName !== "") {
      dispatch(FileisExist2(navigate, fileData, t, setShowRenameFile));
    }
  };

  const CloseButton = () => {
    setShowRenameFile(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={showrenameFile}
          onHide={() => {
            setShowRenameFile(false);
          }}
          setShow={setShowRenameFile}
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
                      value={fileData.FileName}
                      placeholder={t("Rename")}
                      labelclass="textFieldSearch d-none"
                      maxLength={290}
                      change={(e) =>
                        setFileData({
                          ...fileData,
                          FileName: e.target.value,
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

export default ModalRenameFile;
