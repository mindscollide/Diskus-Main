import React, { useState } from "react";
import styles from "./SendDocumentModal.module.css";
import { Button, Modal, TextField } from "../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import cross_signerEmail from "../../../../assets/images/cross_signerEmail.png";
import { t } from "i18next";
import DeleteButton from "../../../../assets/images/delete_dataroom.png";
import FolderIcon from "../../../../assets/images/folder_icon_gridview.svg";
import EditIcon from "../../../../assets/images/editicon.png";
import { validateEmailEnglishAndArabicFormat } from "../../../../commen/functions/validations";

const SendDocumentModal = ({
  sendDocumentModal,
  setSendDocumentModal,
  handleClickSendDocument,
  signersData,
  setMailers,
  setMailerInput,
  mailerInput,
  sendMessage,
  pdfResponceData,
  setSendMessage,
  setPdfResponceData,
}) => {
  console.log(signersData, "pdfResponceDatapdfResponceData");
  const [showCcUserInput, setShowCcUserInput] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  // const handleChangeAddCc = (event) => {
  //   const { name, value } = event.target;

  //   if (
  //     event.key === "Enter" ||
  //     event.type === "blur" ||
  //     event.type === "change"
  //   ) {
  //     if (value === "") {
  //       setValidEmail(true);
  //       return;
  //     }

  //     if (validateEmailEnglishAndArabicFormat(value)) {
  //       setMailers([...mailers, value]);
  //       setMailerInput("");
  //       setValidEmail(false);
  //     } else {
  //       setValidEmail(true);
  //     }
  //   }
  // };

  const handleChangeMessage = (event) => {
    console.log(event, "eventeventeventevent");
    const { value } = event.target;
    if (value !== "") {
      setSendMessage(value.trimStart());
    } else {
      setSendMessage("");
    }
  };
  return (
    <Modal
      show={sendDocumentModal}
      setShow={setSendDocumentModal}
      onHide={() => setSendDocumentModal(false)}
      size={"md"}
      ModalBody={
        <>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["sendDocument_Heading"]}>
              {t("Send-data-storage-retention-policy")}
            </Col>
            <Col sm={12} md={12} lg={12} className={styles["Email_Heading"]}>
              {t("Email-to-signer")}
            </Col>{" "}
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["signersEmailsData"]}>
              {signersData.current.length > 0 &&
                signersData.current.map((signerData, index) => {
                  return (
                    <span className={styles["signerEmail_box"]}>
                      <p className={styles["signerEmail"]}>
                        {signerData.EmailAddress}
                      </p>
                      {/* <img width={6} height={6} src={cross_signerEmail} /> */}
                    </span>
                  );
                })}

              {/* <span
                onClick={() => setShowCcUserInput(!showCcUserInput)}
                className={styles["AdduserCC"]}
              >
                + CC
              </span> */}
            </Col>
            <Col sm={12} md={12} lg={12} className='my-2'>
              {/* Message Box */}
              <TextField
                placeholder={"Message"}
                labelclass={styles["labelClassMessage"]}
                as={"textarea"}
                rows={5}
                change={(event) => handleChangeMessage(event)}
                value={sendMessage}
                label={t("Message (Optional)")}
              />
            </Col>
            {/* <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["SignedDocumentIcon"]}
            >
              <img src={FolderIcon} /> Signed Document
            </Col> */}
            <Col sm={12} md={12} lg={12} className='my-2'>
              {/* File Name and Save Signed Copy as Input Field */}
              <TextField
                labelclass={styles["labelClassMessage"]}
                label={t("Save Signed Copy as")}
                value={pdfResponceData?.title || ""}
                change={(event) =>
                  setPdfResponceData({
                    ...pdfResponceData,
                    title: event.target.value,
                  })
                }
              />
            </Col>
            {/* <Col sm={12} md={12} lg={12}>
              <div className="position-relative">
                <TextField
                  label={t("Location")}
                  applyClass={"sendDocumentInput"}
                  formParentClass={"d-block"}
                  labelclass={styles["labelClassEmail"]}
                />
                <span>
                  <img src={EditIcon} className={styles["sendDocumentIcon"]} />
                </span>
              </div>
            </Col> */}
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Col sm={12} md={12} lg={12} className='d-flex justify-content-end'>
            <Button
              className={styles["SendButton_SendDocument"]}
              text={t("Send")}
              onClick={handleClickSendDocument}
            />
          </Col>
        </>
      }
    />
  );
};

export default SendDocumentModal;
