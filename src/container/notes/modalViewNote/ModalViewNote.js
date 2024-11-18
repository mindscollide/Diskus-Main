import React, { useState, useEffect } from "react";
import { Button, Modal, AttachmentViewer } from "../../../components/elements";
import StarIcon from "../../../assets/images/Star.svg";
import hollowstar from "../../../assets/images/Hollowstar.svg";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./ModalViewNote.module.css";
import { useSelector } from "react-redux";
import {
  newTimeFormaterAsPerUTC,
  _justShowDateformat,
} from "../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";

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
  const GetNotesByNotesId = useSelector(
    (state) => state.NotesReducer.GetNotesByNotesId
  );

  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (GetNotesByNotesId !== null && GetNotesByNotesId !== undefined) {
      try {
        setNotesData({
          date: GetNotesByNotesId.date,
          description: GetNotesByNotesId.description,
          fK_NotesStatus: GetNotesByNotesId.fK_NotesStatus,
          fK_OrganizationID: GetNotesByNotesId.fK_OrganizationID,
          fK_UserID: GetNotesByNotesId.fK_UserID,
          isAttachment: GetNotesByNotesId.isAttachment,
          isStarred: GetNotesByNotesId.isStarred,
          modifiedDate: GetNotesByNotesId.modifiedDate,
          modifiedTime: GetNotesByNotesId.modifiedTime,
          notesAttachments: GetNotesByNotesId.notesAttachments,
          notesStatus: GetNotesByNotesId.notesStatus,
          organizationName: GetNotesByNotesId.organizationName,
          pK_NotesID: GetNotesByNotesId.pK_NotesID,
          time: GetNotesByNotesId.time,
          title: GetNotesByNotesId.title,
          username: GetNotesByNotesId.username,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [GetNotesByNotesId]);

  const handleCloseViewModal = () => {
    if (flag) {
      setGetNoteID(0);
    }
    setViewNotes(false);
  };

  return (
    <>
      <Container>
        <Modal
          show={viewNotes}
          onHide={() => {
            setViewNotes(false);
          }}
          modalHeaderClassName={`${
            styles["header-modal-close-btn"]
          } ${"d-none"}`}
          setShow={setViewNotes}
          ButtonTitle={ModalTitle}
          centered
          modalFooterClassName={styles["modalViewNoteClass"]}
          size={isUpdateNote === true ? "md" : "md"}
          ModalBody={
            <>
              {/* <Row className="d-flex align-items-center">
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
                      alt=""
                      width={17}
                      height={17}
                      className={styles["star-addnote"]}
                    />
                  ) : (
                    <img
                      draggable="false"
                      className={styles["star-addnote"]}
                      alt=""
                      width={17}
                      height={17}
                      src={StarIcon}
                    />
                  )}
                </Col>
              </Row> */}

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
                  ></p>
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
                        return (
                          <Col sm={4} lg={4} md={4}>
                            <AttachmentViewer
                              data={data}
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
    </>
  );
};

export default ModalViewNote;
