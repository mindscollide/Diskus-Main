import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  Notification,
  AttachmentViewer,
} from "../../../components/elements";
import StarIcon from "../../../assets/images/Star.svg";
import hollowstar from "../../../assets/images/Hollowstar.svg";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./ModalViewNote.module.css";
import {  useSelector } from "react-redux";
import {
  newTimeFormaterAsPerUTC,
  _justShowDateformat,
} from "../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";
import { fileFormatforSignatureFlow } from "../../../commen/functions/utils";


const ModalViewNote = ({
  ModalTitle,
  viewNotes,
  setViewNotes,
  setGetNoteID,
  flag,
}) => {
  const [notesData, setNotesData] = useState({
    date: "",
    description: "",
    fK_NotesStatus: 0,
    fK_OrganizationID: 0,
    fK_UserID: 0,
    isAttachment: false,
    isStarred: false,
    modifiedDate: "",
    modifiedTime: "",
    notesAttachments: [],
    notesStatus: "",
    organizationName: "",
    pK_NotesID: 0,
    time: "",
    title: "",
    username: "",
  });
  //For Localization
  const { NotesReducer } = useSelector((state) => state);
  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const { t } = useTranslation();
  const deleteNoteModalHandler = async () => {
    setIsUpdateNote(false);
    setIsDeleteNote(true);
  };
  useEffect(() => {
    if (
      NotesReducer.GetNotesByNotesId !== null &&
      NotesReducer.GetNotesByNotesId !== undefined
    ) {
      var html = NotesReducer.GetNotesByNotesId.description.outerHTML;
      console.log("NotesReducer", html);
      var data = { html: html };
      console.log("NotesReducer", data);
      var newdescription = JSON.stringify(data);
      console.log("NotesReducer", newdescription);
      setNotesData({
        date: NotesReducer.GetNotesByNotesId.date,
        description: NotesReducer.GetNotesByNotesId.description,
        fK_NotesStatus: NotesReducer.GetNotesByNotesId.fK_NotesStatus,
        fK_OrganizationID: NotesReducer.GetNotesByNotesId.fK_OrganizationID,
        fK_UserID: NotesReducer.GetNotesByNotesId.fK_UserID,
        isAttachment: NotesReducer.GetNotesByNotesId.isAttachment,
        isStarred: NotesReducer.GetNotesByNotesId.isStarred,
        modifiedDate: NotesReducer.GetNotesByNotesId.modifiedDate,
        modifiedTime: NotesReducer.GetNotesByNotesId.modifiedTime,
        notesAttachments: NotesReducer.GetNotesByNotesId.notesAttachments,
        notesStatus: NotesReducer.GetNotesByNotesId.notesStatus,
        organizationName: NotesReducer.GetNotesByNotesId.organizationName,
        pK_NotesID: NotesReducer.GetNotesByNotesId.pK_NotesID,
        time: NotesReducer.GetNotesByNotesId.time,
        title: NotesReducer.GetNotesByNotesId.title,
        username: NotesReducer.GetNotesByNotesId.username,
      });
    }
  }, [NotesReducer.GetNotesByNotesId]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const handleCloseViewModal = () => {
    if (flag) {
      setGetNoteID(0);
    }
    setViewNotes(false);
  };
  const handleViewIcon = (data, ext) => {
    // let fileExtension = ["pdf", "doc", "docx", "xls", "xlsx"].includes(ext);
    if (fileFormatforSignatureFlow.includes(ext)) {
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(data)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };
  return (
    <>
      <Container>
        <Modal
          show={viewNotes}
          onHide={() => {
            setViewNotes(false);
          }}
          modalHeaderClassName={styles["header-modal-close-btn"]}
          setShow={setViewNotes}
          ButtonTitle={ModalTitle}
          centered
          modalFooterClassName={styles["modalViewNoteClass"]}
          //   modalFooterClassName={styles["modal-userprofile-footer"]}
          size={isUpdateNote === true ? "md" : "md"}
          ModalBody={
            <>
              <Row className="d-flex align-items-center">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex  gap-2 align-items-center"
                >
                  <p className={styles["Viewnote-heading"]}>{t("View-note")}</p>
                  {notesData.isStarred ? (
                    <img
                      draggable="false"
                      src={hollowstar}
                      width={17}
                      height={17}
                      className={styles["star-addnote"]}
                    />
                  ) : (
                    <img
                      draggable="false"
                      className={styles["star-addnote"]}
                      width={17}
                      height={17}
                      src={StarIcon}
                    />
                  )}
                </Col>
              </Row>

              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <p className={styles["date-updatenote"]}>
                    {t("Last-modified-On")}:{" "}
                    {_justShowDateformat(notesData.date + notesData.time)} |{" "}
                    {newTimeFormaterAsPerUTC(notesData.date + notesData.time)}
                  </p>
                </Col>
              </Row>

              <Row className="my-2">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <p className={styles["modal-View-title"]}>
                    {notesData.title}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <p
                    className={styles["modal-view-discription"]}
                    dangerouslySetInnerHTML={{
                      __html: notesData.description,
                    }}
                  >
                    {/* {notesData.description} */}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <p className={styles["modal-update-attachment-heading"]}>
                    {t("Attachments")}
                  </p>
                </Col>
              </Row>
              <section className={styles["NotesViewAttachment"]}>
              <Row>
                {notesData.notesAttachments.length > 0
                  ? notesData.notesAttachments.map((data, index) => {
                      console.log("tasksAttachments", data);
                      let ext = data.displayAttachmentName.split(".").pop();

                      const first = data.displayAttachmentName.split(" ")[0];
                      const pdfData = {
                        taskId: data.fK_NotesID,
                        attachmentID: data.pK_NAID,
                        fileName: data.displayAttachmentName,
                        commingFrom: 2,
                      };
                      const pdfDataJson = JSON.stringify(pdfData);
                      return (
                        <Col sm={4} lg={4} md={4}>
                          <AttachmentViewer
                            data={data}
                            // handleEyeIcon={() =>
                            //   handleViewIcon(pdfDataJson, ext)
                            // }
                            id={0}
                            name={data.displayAttachmentName}
                          />
                        </Col>
                      );
                    })
                  : null}
              </Row>
              </section>
            </>
          }
          ModalFooter={
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Close")}
                    className={styles["close-note-modal-btn"]}
                    onClick={handleCloseViewModal}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalViewNote;
