import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalAddFolder.module.css";
import { useTranslation } from "react-i18next";
import { Button, Modal, TextField } from "../../../components/elements";
import { useDispatch } from "react-redux";
import { FolderisExist } from "../../../store/actions/DataRoom_actions";
import { useNavigate } from "react-router-dom";

const ModalAddFolder = ({ addfolder, setAddfolder, setIsExistFolder }) => {
  const { t } = useTranslation();
  const [FolderName, setFolderName] = useState({
    content: "",
    errorMessage: "",
    errorStatus: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closebtn = async () => {
    setAddfolder(false);
  };
  const handleAddFolder = () => {
    if (FolderName.content !== "") {
      dispatch(
        FolderisExist(
          navigate,
          FolderName.content,
          t,
          setAddfolder,
          0,
          setIsExistFolder
        )
      );
    } else {
      setFolderName({
        content: "",
        errorMessage: t("Folder-name-should-not-be-empty"),
        errorStatus: true,
      });
    }
  };
  const handleChangeFolderName = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("namevalue", name, value);
    let valueCheck = value.replace("/^[a-zA-Z0-9]+$/g", "");
    console.log(valueCheck);
    if (name === "FolderName" && valueCheck !== "") {
      setFolderName({
        content: valueCheck.trimStart(),
        errorMessage: "",
        errorStatus: false,
      });
    } else {
      setFolderName({
        content: "",
        errorMessage: "Folder should have alpha numeric special character",
        errorStatus: true,
      });
    }
  };

  return (
    <>
      <Container>
        <Modal
          show={addfolder}
          onHide={() => {
            setAddfolder(false);
          }}
          setShow={setAddfolder}
          modalFooterClassName="d-block"
          centered
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["NewFolder_Heading"]}>
                      {t("New-folder")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12} className="rename-modal-field">
                    <TextField
                      width="455px"
                      name="FolderName"
                      value={FolderName.content}
                      maxLength={290}
                      placeholder={t("Folder-name")}
                      labelclass="textFieldSearch d-none"
                      change={handleChangeFolderName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p
                      className={
                        FolderName.errorStatus && FolderName.content === ""
                          ? ` ${styles["errorMessage"]} `
                          : `${styles["errorMessage_hidden"]}`
                      }
                    >
                      {FolderName.errorMessage}
                    </p>
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
                    className={styles["Cancel_button_AddFolder"]}
                    onClick={closebtn}
                  />

                  <Button
                    text={t("Create")}
                    className={styles["Create_button_AddFolder"]}
                    onClick={handleAddFolder}
                    disableBtn={FolderName.content !== "" ? false : true}
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

export default ModalAddFolder;
