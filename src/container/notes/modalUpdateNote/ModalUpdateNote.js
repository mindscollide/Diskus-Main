import React, { useState, useEffect, useRef } from "react";
import {
  AttachmentViewer,
  Button,
  Modal,
  Notification,
} from "../../../components/elements";
import CustomUpload from "../../../components/elements/upload/Upload";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUpdateNote.module.css";
import Form from "react-bootstrap/Form";
import {
  DeleteNotesDocumentsAPI,
  saveFilesNotesApi,
  SaveNotesDocumentAPI,
  UpdateNotesAPI,
  uploadDocumentsNotesApi,
} from "../../../store/actions/Notes_actions";
import { useTranslation } from "react-i18next";

import {
  newTimeFormaterAsPerUTC,
  _justShowDateformat,
} from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { validateInput } from "../../../commen/functions/regex";
import {
  maxFileSize,
  removeHTMLTagsAndTruncate,
} from "../../../commen/functions/utils";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import { Spin } from "antd";
import { isFileSizeValid } from "../../../commen/functions/convertFileSizeInMB";

const ModalUpdateNote = ({ ModalTitle, setUpdateNotes, updateNotes, flag }) => {
  //For Localization
  const { NotesReducer } = useSelector((state) => state);
  const retriveDocsSpinner = useSelector(
    (state) => state.DataRoomReducer.Loading
  );
  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const editorRef = useRef(null);
  const [updateConfirmation, setUpdateConfirmation] = useState(false);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const [erorbar, setErrorBar] = useState(false);
  const { t } = useTranslation();
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [attachments, setAttachments] = useState([]);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [isdescription, setDescription] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Getting Notes Files Data From Global State
  const RetrieveDocsNotes = useSelector(
    (state) => state.NotesReducer.retrieveNotesDocumentData
  );

  //Extracting the Folder ID from CreateUpdateNotes DataRoom Map
  //GlobalState For Folder ID Against the Notes Created
  const NotesReducerFolderID = useSelector(
    (state) => state.NotesReducer.createUpdateNotesDataRoomMapData
  );

  //Extrating Files Data of Particular Notes
  const [previousIDs, setPreviousIDs] = useState([]);

  useEffect(() => {
    try {
      if (RetrieveDocsNotes && RetrieveDocsNotes !== null) {
        if (RetrieveDocsNotes.data.length > 0) {
          let retirveArray = [];
          let PrevIds = [];
          RetrieveDocsNotes.data.forEach((docsData, docsDataindex) => {
            retirveArray.push({
              pK_FileID: docsData.pK_FileID,
              DisplayAttachmentName: docsData.displayFileName,
              fk_UserID: docsData.fK_UserID,
            });

            PrevIds.push({
              pK_FileID: docsData.pK_FileID,
              DisplayAttachmentName: docsData.displayFileName,
            });
          });
          setAttachments(retirveArray);
          setPreviousIDs(PrevIds);
        }
      }
    } catch (error) {}
  }, [RetrieveDocsNotes]);

  const [addNoteFields, setAddNoteFields] = useState({
    Title: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Description: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    createdDate: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    createdTime: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    ModifiedDate: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    ModifieTime: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    PK_NotesID: 0,
    FK_NotesStatusID: 0,
  });
  const deleteNoteModalHandler = async () => {
    setIsUpdateNote(false);
    setIsDeleteNote(true);
  };

  const [isStarred, setIsStarrted] = useState(false);

  //For Adding Additional Components in the React Quill
  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);

  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic", "Montserrat"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);

  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        [{ font: ["impact", "courier", "comic", "Montserrat"] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
      handlers: {},
    },
    clipboard: {
      matchVisual: true,
    },
  };

  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  //For Deleting the particular File
  const deleteFilefromAttachments = (data, index) => {
    setAttachments((filesData) => {
      return filesData.filter(
        (fileData, index) =>
          fileData.DisplayAttachmentName !== data.DisplayAttachmentName
      );
    });
    setPreviousIDs((prevFilesData) => {
      return prevFilesData.filter(
        (prevdata, index) =>
          prevdata.DisplayAttachmentName !== data.DisplayAttachmentName
      );
    });
    if (Object.values(fileForSend).length > 0) {
      setFileForSend((filesData) => {
        return filesData.filter(
          (fileData, index) => fileData.name !== data.DisplayAttachmentName
        );
      });
    }
  };

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const addNotesFieldHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("values", name, value);
    if (name === "Title" && value !== "") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setAddNoteFields({
          ...addNoteFields,
          Title: {
            value: valueCheck.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Title" && value === "") {
      setAddNoteFields({
        ...addNoteFields,
        Title: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  const onTextChange = (content, delta, source) => {
    const deltaOps = delta.ops || [];

    // Check if any image is being pasted
    const containsImage = deltaOps.some((op) => op.insert && op.insert.image);
    if (containsImage) {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      if (source === "user" && String(content).length >= 2500) {
        // Update state only if no image is detected in the content
        setAddNoteFields({
          ...addNoteFields,
          Description: {
            value: removeHTMLTagsAndTruncate(String(content), 2500),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setAddNoteFields({
          ...addNoteFields,
          Description: {
            value: content,
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    }
  };

  useEffect(() => {
    try {
      if (
        NotesReducer.GetNotesByNotesId !== null &&
        NotesReducer.GetNotesByNotesId !== undefined
      ) {
        console.log(
          NotesReducer.GetNotesByNotesId,
          "NotesReducerNotesReducerNotesReducer"
        );
        const {
          title,
          date,
          description,
          fK_NotesStatus,
          fK_OrganizationID,
          isAttachment,
          isStarred,
          modifiedDate,
          modifiedTime,
          notesAttachments,
          notesStatus,
          organizationName,
          pK_NotesID,
          time,
          username,
        } = NotesReducer.GetNotesByNotesId;
        console.log(
          {
            title,
            date,
            description,
            fK_NotesStatus,
            fK_OrganizationID,
            isAttachment,
            isStarred,
            modifiedDate,
            modifiedTime,
            notesAttachments,
            notesStatus,
            organizationName,
            pK_NotesID,
            time,
            username,
          },
          "titletitle"
        );
        setDescription(description);
        setAddNoteFields({
          ...addNoteFields,
          Title: {
            value: title,
            errorMessage: "",
            errorStatus: false,
          },
          createdDate: {
            value: NotesReducer.GetNotesByNotesId.date,
            errorMessage: "",
            errorStatus: false,
          },
          createdTime: {
            value: NotesReducer.GetNotesByNotesId.time,
            errorMessage: "",
            errorStatus: false,
          },
          ModifiedDate: {
            value: NotesReducer.GetNotesByNotesId.modifiedDate,
            errorMessage: "",
            errorStatus: false,
          },
          ModifieTime: {
            value: NotesReducer.GetNotesByNotesId.modifiedTime,
            errorMessage: "",
            errorStatus: false,
          },

          PK_NotesID: NotesReducer.GetNotesByNotesId.pK_NotesID,

          FK_NotesStatusID: NotesReducer.GetNotesByNotesId.fK_NotesStatus,
        });
        setIsStarrted(NotesReducer.GetNotesByNotesId.isStarred);
        let copyData = [];
        let newData = [];
        if (NotesReducer.GetNotesByNotesId.notesAttachments.length > 0) {
          NotesReducer.GetNotesByNotesId.notesAttachments.forEach(
            (data, index) => {
              copyData.push({
                DisplayAttachmentName: data.displayAttachmentName,
                originalAttachmentName: data.originalAttachmentName,
                fK_NotesID: data.fK_NotesID,
                pK_NAID: data.pK_NAID,
              });
              newData.push({
                DisplayAttachmentName: data.displayAttachmentName,
                OriginalAttachmentName: data.originalAttachmentName,
                FK_NotesID: data.fK_NotesID,
              });
            }
          );
          setAttachments(copyData);
          setTasksAttachments({
            TasksAttachments: newData,
          });
        }
      }
    } catch (error) {
      console.log(error, "GetNotesByNotesIdGetNotesByNotesId");
    }
  }, [NotesReducer.GetNotesByNotesId]);

  useEffect(() => {
    try {
      if (isdescription !== null) {
        setAddNoteFields({
          ...addNoteFields,
          Description: {
            value: isdescription,
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [isdescription]);

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    let filesArray = Object.values(data.target.files);
    let totalFiles = filesArray.length + attachments.length;
    let fileSizeArr = fileSize;
    let sizezero = true;
    let size = true;

    if (totalFiles > 10) {
      showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
      return;
    }
    filesArray.forEach((fileData, index) => {
      const { isMorethan } = isFileSizeValid(fileData.size);

      if (!isMorethan) {
        size = false;
      } else if (fileData.size === 0) {
        sizezero = false;
      }

      let fileExists = tasksAttachments.TasksAttachments.some(
        (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
      );

      if (!size) {
        showMessage(
          t("File-size-should-not-be-greater-than-1-5GB"),
          "error",
          setOpen
        );
      } else if (!sizezero) {
        showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
      } else if (fileExists) {
        showMessage(t("File-already-exists"), "error", setOpen);
      } else {
        let file = {
          DisplayAttachmentName: fileData.name,
          OriginalAttachmentName: fileData.name,
          fileSize: fileData.size,
        };
        setAttachments((prevAttachments) => [...prevAttachments, file]);
        fileSizeArr += fileData.size;
        setFileForSend((prevFiles) => [...prevFiles, fileData]);
        setFileSize(fileSizeArr);
      }
      // Update previousFileList to current fileList
      previousFileList = filesArray;
    });
  };
  let previousFileList = [];

  const notesSaveHandler = async () => {
    try {
      if (addNoteFields.Title.value !== "") {
        let createrID = localStorage.getItem("userID");
        let OrganizationID = localStorage.getItem("organizationID");
        let Data = {
          PK_NotesID: addNoteFields.PK_NotesID,
          Title: addNoteFields.Title.value,
          Description: addNoteFields.Description.value,
          isStarred: isStarred,
          FK_UserID: JSON.parse(createrID),
          FK_OrganizationID: JSON.parse(OrganizationID),
          FK_NotesStatusID: addNoteFields.FK_NotesStatusID,
        };
        dispatch(
          UpdateNotesAPI(
            navigate,
            Data,
            t,
            setIsUpdateNote,
            setIsDeleteNote,
            setUpdateNotes
          )
        );
      } else {
        setErrorBar(true);
        showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  //Updating the Notes Files
  const NotesDocumentCallUpload = async (folderID) => {
    let newFolder = [...previousIDs];
    let newfile = [];
    if (fileForSend.length > 0) {
      console.log(fileForSend, "fileForSendfileForSend");
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsNotesApi(
            navigate,
            t,
            newData,
            folderID,
            // newFolder,
            newfile
          )
        );
      });
      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      await dispatch(
        saveFilesNotesApi(navigate, t, newfile, folderID, newFolder)
      );
    }

    let Data = {
      NoteID: Number(addNoteFields.PK_NotesID),
      UpdateFileList: newFolder.map((data, index) => {
        return { PK_FileID: data.pK_FileID };
      }),
    };
    dispatch(
      SaveNotesDocumentAPI(
        navigate,
        Data,
        t,
        false,
        setCloseConfirmationBox,
        setUpdateNotes,
        2
      )
    );
  };
  console.log(NotesReducerFolderID, "NotesReducerFolderID");
  useEffect(() => {
    if (NotesReducerFolderID) {
      let folderIDCreated = NotesReducerFolderID;
      NotesDocumentCallUpload(folderIDCreated);
    }
  }, [NotesReducerFolderID]);

  const handleClickCancelDeleteModal = () => {
    setIsUpdateNote(true);
  };

  const deleteNotesHandler = (id) => {
    if (flag) {
      setUpdateNotes(false);
    }

    let DelNotesAttachmentData = {
      NoteID: Number(id),
    };
    dispatch(
      DeleteNotesDocumentsAPI(
        navigate,
        DelNotesAttachmentData,
        t,
        setUpdateNotes,
        id
      )
    );
  };

  return (
    <>
      <Container>
        <Modal
          show={updateNotes}
          onHide={() => {
            setCloseConfirmationBox(true);
            setIsDeleteNote(false);
            setIsUpdateNote(false);
          }}
          modalHeaderClassName={
            isDeleteNote === true || updateConfirmation === true
              ? "d-none"
              : isDeleteNote === false
              ? styles["header-UpdateNotesModal-close-btn"]
              : styles["header-UpdateNotesModal-close-btn"]
          }
          setShow={() => {
            setUpdateNotes();
          }}
          modalFooterClassName={styles["modalUpdateNotes"]}
          ButtonTitle={ModalTitle}
          centered
          size={
            isUpdateNote === true
              ? "md"
              : updateNotes === true
              ? "md"
              : closeConfirmationBox || updateConfirmation
              ? null
              : "md"
          }
          ModalBody={
            <>
              {isUpdateNote ? (
                <Container>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex align-items-center justify-content-start gap-3"
                    >
                      <p className={styles["UpdateNote-heading"]}>
                        {t("Update-note")}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start mb-0"
                    >
                      <p className={styles["date-updatenote"]}>
                        {t("Created-On")} :{" "}
                        {_justShowDateformat(
                          addNoteFields.createdDate.value +
                            addNoteFields.createdTime.value
                        )}{" "}
                        |{" "}
                        {newTimeFormaterAsPerUTC(
                          addNoteFields.createdDate.value +
                            addNoteFields.createdTime.value
                        )}
                      </p>
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <p className={styles["date-updatenote2"]}>
                        {t("Last-modified-on")} :{" "}
                        {_justShowDateformat(
                          addNoteFields.ModifiedDate.value +
                            addNoteFields.ModifieTime.value
                        )}{" "}
                        |{" "}
                        {newTimeFormaterAsPerUTC(
                          addNoteFields.ModifiedDate.value +
                            addNoteFields.ModifieTime.value
                        )}
                      </p>
                    </Col>
                  </Row>

                  <Row className={"modalNote-fields"}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Form.Control
                        placeholder={t("Meeting-with")}
                        applyClass="updateNotes_titleInput"
                        name="Title"
                        maxLength={290}
                        value={addNoteFields.Title.value || ""}
                        onChange={addNotesFieldHandler}
                      />

                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && addNoteFields.Title.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {t("Title-is-required")}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className={styles["QuillRow"]}>
                    <Col lg={12} md={12} sm={12} xs={12} className="mt-1">
                      <ReactQuill
                        ref={editorRef}
                        theme="snow"
                        value={addNoteFields.Description.value}
                        // defaultValue={addNoteFields.Description.value}
                        onChange={onTextChange}
                        modules={modules}
                        className={styles["quill-update-height"]}
                        style={{
                          direction: currentLanguage === "ar" ? "rtl" : "ltr",
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p
                        className={
                          erorbar && addNoteFields.Description.value === ""
                            ? ` ${styles["errorUpdateMessage_hidden"]} `
                            : `${styles["errorUpdateMessage_hidden"]}`
                        }
                      >
                        {t("Description-is-required")}
                      </p>
                    </Col>
                  </Row>

                  <Row className="mt-5">
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          className="d-flex justify-content-start"
                        >
                          <label className={styles["attached-title"]}>
                            {t("Attachement")}
                          </label>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          className="d-flex justify-content-start"
                        >
                          <span className={styles["Notes-upload-input"]}>
                            <CustomUpload
                              change={uploadFilesToDo}
                              multiple={true}
                              onClick={(event) => {
                                event.target.value = null;
                              }}
                              className="UploadFileButton"
                            />
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className={styles["notes-updates-attachment"]}
                        >
                          {retriveDocsSpinner ? (
                            <>
                              <section className="d-flex justify-content-center align-items-center p-3">
                                <Spin />
                              </section>
                            </>
                          ) : (
                            <>
                              {attachments.length > 0
                                ? attachments.map((data, index) => {
                                    return (
                                      <AttachmentViewer
                                        handleClickRemove={() =>
                                          deleteFilefromAttachments(data, index)
                                        }
                                        data={data}
                                        name={data.DisplayAttachmentName}
                                        id={0}
                                        fk_UID={Number(
                                          localStorage.getItem("userID")
                                        )}
                                      />
                                    );
                                  })
                                : null}
                            </>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              ) : isDeleteNote ? (
                <>
                  <Container>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["delete-note-modal-text"]}
                      >
                        <p>{t("Are-you-sure-you-want-to-delete-this-note")}?</p>
                      </Col>
                    </Row>
                  </Container>
                </>
              ) : closeConfirmationBox ? (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["Confirmationmodal_body_text"]}
                    >
                      {t("Are-you-sure-note-reset-closed")}
                    </Col>
                  </Row>
                </>
              ) : updateConfirmation ? (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["delete-note-modal-text"]}
                  >
                    <p>{t("Are-you-sure-you-want-to-update-this-note")}?</p>
                  </Col>
                </Row>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isUpdateNote ? (
                <Row className=" ">
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    className="d-flex gap-3 justify-content-end"
                  >
                    <Button
                      text={t("Delete")}
                      onClick={deleteNoteModalHandler}
                      className={styles["Delete-notes-Button"]}
                    />

                    <Button
                      text={t("Cancel")}
                      className={styles["cancel-Update-notes"]}
                      onClick={() => {
                        setCloseConfirmationBox(true);
                        setIsDeleteNote(false);
                        setIsUpdateNote(false);
                      }}
                    />

                    <Button
                      text={t("Update")}
                      type="submit"
                      onClick={() => {
                        setCloseConfirmationBox(false);
                        setIsDeleteNote(false);
                        setIsUpdateNote(false);
                        setUpdateConfirmation(true);
                      }}
                      className={styles["Update-notes-Button"]}
                    />
                  </Col>
                </Row>
              ) : isDeleteNote ? (
                <>
                  <Row className={styles["modal-row"]}>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-end "
                    >
                      <Button
                        text={t("Cancel")}
                        className={styles["cancel-note-modal-btn"]}
                        onClick={handleClickCancelDeleteModal}
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start "
                    >
                      <Button
                        text={t("Delete")}
                        className={styles["delete-note-modal-btn"]}
                        onClick={() =>
                          deleteNotesHandler(addNoteFields.PK_NotesID)
                        }
                      />
                    </Col>
                  </Row>
                </>
              ) : closeConfirmationBox ? (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center gap-3"
                    >
                      <Button
                        onClick={() => setIsUpdateNote(true)}
                        className={styles["cancel-Update-notes"]}
                        text={t("Cancel")}
                      />
                      <Button
                        onClick={() => setUpdateNotes(false)}
                        className={styles["Update-notes-Button"]}
                        text={t("Close")}
                      />
                    </Col>
                  </Row>
                </>
              ) : updateConfirmation ? (
                <Row className={styles["modal-row"]}>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end "
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["cancel-note-modal-btn"]}
                      onClick={() => {
                        setCloseConfirmationBox(false);
                        setIsDeleteNote(false);
                        setIsUpdateNote(true);
                        setUpdateConfirmation(false);
                      }}
                    />
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start "
                  >
                    <Button
                      text={t("Update")}
                      className={styles["delete-note-modal-btn"]}
                      onClick={notesSaveHandler}
                    />
                  </Col>
                </Row>
              ) : null}
            </>
          }
        />
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ModalUpdateNote;
