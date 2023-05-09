import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalAddFolder.module.css";
import { useTranslation } from "react-i18next";
import {
  Button,
  InputSearchFilter,
  Modal,
  TextField,
} from "../../../components/elements";
import { useDispatch } from 'react-redux'
import { style } from "@mui/system";
import { createFolderApi } from "../../../store/actions/DataRoom_actions";
const ModalAddFolder = ({ addfolder, setAddfolder }) => {
  const { t } = useTranslation();
  const [FolderName, setFolderName] = useState({
    content: "",
    errorMessage: "",
    errorStatus: false
  })
  const dispatch = useDispatch()
  const closebtn = async () => {
    setAddfolder(false);
  };
  const handleAddFolder = () => {
    if (FolderName.content !== "") {
      dispatch(createFolderApi(FolderName.content, t, setAddfolder))
    } else {
      setFolderName({
        content: "",
        errorMessage: "Folder name should not be empty",
        errorStatus: true
      })
    }
  }
  const handleChangeFolderName = e => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("namevalue", name, value)
    let valueCheck = value.replace("/^[a-zA-Z0-9]+$/g", "")
    console.log(valueCheck)
    if (name === "FolderName" && valueCheck !== "") {
      setFolderName({
        content: valueCheck,
        errorMessage: "",
        errorStatus: false
      })
    } else {
      setFolderName({
        content: "",
        errorMessage: "Folder should have alpha numeric special character",
        errorStatus: true
      })
    }
  }

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
          size={addfolder === true ? "md" : "md"}
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
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      width="455px"
                      name="FolderName"
                      value={FolderName.content}
                      placeholder={t("Name")}
                      labelClass="textFieldSearch d-none"
                      change={handleChangeFolderName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p
                      className={
                        FolderName.errorStatus &&
                          FolderName.content === ""
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
                    disableBtn={FolderName !== "" ? false : true}
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
