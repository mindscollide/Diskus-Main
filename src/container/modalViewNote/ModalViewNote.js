import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
} from "../../components/elements";
import { PlusSquareFill, Star } from "react-bootstrap-icons";
import StarIcon from "../../assets/images/Star.svg";
import hollowstar from "../../assets/images/Hollowstar.svg";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./ModalViewNote.module.css";
import { useDispatch, useSelector } from 'react-redux'
import Form from "react-bootstrap/Form";
import moment from "moment";
import FileIcon, { defaultStyles } from "react-file-icon";
import { newTimeFormaterAsPerUTC, _justShowDateformat } from "../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";

// import { countryName } from "../../AllUsers/AddUser/CountryJson";

const ModalViewNote = ({ ModalTitle, viewNotes, setViewNotes }) => {
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
  })
  //For Localization
  const { NotesReducer } = useSelector(state => state)
  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const { t } = useTranslation();
  const deleteNoteModalHandler = async () => {
    setIsUpdateNote(false);
    setIsDeleteNote(true);
  };
  useEffect(() => {
    if (NotesReducer.GetNotesByNotesId !== null && NotesReducer.GetNotesByNotesId !== undefined) {
      var html = NotesReducer.GetNotesByNotesId.description.outerHTML;  
      console.log("NotesReducer",html)
      var data = { html: html };
      console.log("NotesReducer",data)
      var newdescription = JSON.stringify(data)
      console.log("NotesReducer",newdescription)
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
      })
    }
  }, [NotesReducer.GetNotesByNotesId])
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

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
              <Container>
                <Row className="d-flex align-items-center">
                  <Col lg={12} md={12} sm={12} xs={12} className="d-flex  gap-2 align-items-center">
                    <p className={styles["Viewnote-heading"]}>View Note</p>
                    {notesData.isStarred ? <img src={hollowstar} width={17} height={17} className={styles["star-addnote"]} /> : <img className={styles["star-addnote"]} width={17} height={17} src={StarIcon} />}
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
                      Last modified On: {_justShowDateformat(notesData.date + notesData.time)} | {newTimeFormaterAsPerUTC(notesData.date + notesData.time)}
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
                    <p className={styles["modal-view-discription"]} dangerouslySetInnerHTML={{ __html: notesData.description }}>
                      {/* {notesData.description} */}
                    </p>
                  </Col>
                </Row>

                <Row >
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
                <Row>
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="todoModalCreateModal mt-2"
                  >
                    {notesData.notesAttachments.length > 0
                      ? notesData.notesAttachments.map(
                        (data, index) => {
                          console.log("tasksAttachments", data)
                          var ext =
                            data.displayAttachmentName.split(
                              "."
                            ).pop();

                          const first =
                            data.displayAttachmentName.split(
                              " "
                            )[0];
                          return (
                            <Col
                              sm={12}
                              lg={2}
                              md={2}
                              className={
                                styles[
                                "modaltodolist-attachment-icon"
                                ]
                              }
                            >
                              <FileIcon
                                extension={ext}
                                size={78}
                                labelColor={"rgba(97,114,214,1)"}
                              />

                              <p className="modaltodolist-attachment-text">
                                {first}
                              </p>
                            </Col>
                          );
                        }
                      )
                      : null}
                  </Col>
                </Row>
              </Container>
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
                    text="Close"
                    className={styles["close-note-modal-btn"]}
                    onClick={() => setViewNotes(false)}
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
