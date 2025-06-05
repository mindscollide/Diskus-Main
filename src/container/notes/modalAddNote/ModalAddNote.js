import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  Notification,
  AttachmentViewer,
} from "../../../components/elements";
import { Row, Col, Container, Form } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.snow.css";
import styles from "./ModalAddNote.module.css";
import { useDispatch } from "react-redux";
import CustomUpload from "../../../components/elements/upload/Upload";
import {
  saveFilesNotesApi,
  SaveNotesAPI,
  SaveNotesDocumentAPI,
  uploadDocumentsNotesApi,
} from "../../../store/actions/Notes_actions";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { validateInput } from "../../../commen/functions/regex";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import {
  maxFileSize,
  removeHTMLTagsAndTruncate,
} from "../../../commen/functions/utils";
import { useNotesContext } from "../../../context/NotesContext";
import { useSelector } from "react-redux";
import { isFileSizeValid } from "../../../commen/functions/convertFileSizeInMB";

const ModalAddNote = ({ ModalTitle }) => {
  //Context State for the Modal Globally Defined
  const { createNotesModal, setCreateNotesModal } = useNotesContext();

  //GlobalState For Folder ID Against the Notes Created
  const NotesReducerFolderID = useSelector(
    (state) => state.NotesReducer.createUpdateNotesDataRoomMapData
  );

  //For Localization
  let createrID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const NoteTitle = useRef(null);
  const editorRef = useRef(null);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  let OrganizationID = localStorage.getItem("organizationID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [isAddNote, setIsAddNote] = useState(true);
  const [isCreateNote, setIsCreateNote] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  console.log(fileForSend, "fileForSendfileForSend");
  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);

  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);
  const [isStarrted, setIsStarrted] = useState(false);
  // for add notes textfields states
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
    isStarrted: false,
  });

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments.TasksAttachments;
    setFileForSend((prev) => {
      return prev.filter((fileData, index) => {
        console.log(index, "fileDatafileData");
        return fileData.name !== data.DisplayAttachmentName;
      });
    });
    searchIndex.splice(index, 1);
    setTasksAttachments({
      ...tasksAttachments,
      TasksAttachments: searchIndex,
    });
  };

  //for textfields validation
  const addNotesFieldHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

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

  // for save button hit

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    let filesArray = Object.values(data.target.files);
    let totalFiles =
      filesArray.length + tasksAttachments.TasksAttachments.length;
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
          userID: Number(createrID),
        };
        setTasksAttachments((prevAttachments) => ({
          ...prevAttachments,
          TasksAttachments: [...prevAttachments.TasksAttachments, file],
        }));

        fileSizeArr += fileData.size;
        setFileForSend((prevFiles) => [...prevFiles, fileData]);
        setFileSize(fileSizeArr);
      }
      // Update previousFileList to current fileList
      previousFileList = filesArray;
    });
  };
  let previousFileList = [];
  const cancelNewNoteModal = () => {
    setCloseConfirmationBox(true);
    setIsCreateNote(false);
    setIsAddNote(false);
  };

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

  const handleClick = async () => {
    if (addNoteFields.Title.value !== "") {
      let Data = {
        Title: addNoteFields.Title.value,
        Description: addNoteFields.Description.value,
        isStarred: isStarrted,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
      };
      dispatch(SaveNotesAPI(navigate, Data, t));
    } else {
      setAddNoteFields({
        ...addNoteFields,
        Title: {
          value: addNoteFields.Title.value,
          errorMessage:
            addNoteFields.Title.value === ""
              ? t("Title-is-required")
              : addNoteFields.Title.errorMessage,
          errorStatus:
            addNoteFields.Title.value === ""
              ? true
              : addNoteFields.Title.errorStatus,
        },

        Description: {
          value: addNoteFields.Description.value,
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  //File For Send Work in Notes
  const NotesDocumentCallUpload = async (folderID) => {
    let newFolder = [];
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

    let notesID = localStorage.getItem("notesID");

    let Data = {
      NoteID: Number(notesID),
      UpdateFileList: newFolder.map((data, index) => {
        return { PK_FileID: data.pK_FileID };
      }),
    };
    dispatch(
      SaveNotesDocumentAPI(
        navigate,
        Data,
        t,
        setCreateNotesModal,
        false,
        false,
        1
      )
    );
  };

  useEffect(() => {
    if (NotesReducerFolderID) {
      let folderIDCreated = NotesReducerFolderID;
      NotesDocumentCallUpload(folderIDCreated);
    }
  }, [NotesReducerFolderID]);

  const enterKeyHandler = (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const quill = editorRef.current.getEditor();
      quill.root.setAttribute("autofocus", "");
      quill.focus();
    }
  };

  return (
    <>
        <Modal
          show={createNotesModal}
          onHide={() => {
            setCloseConfirmationBox(true);
            setIsCreateNote(false);
            setIsAddNote(false);
          }}
          setShow={setCreateNotesModal}
          ButtonTitle={ModalTitle}
          modalHeaderClassName={
            isCreateNote === true
              ? "d-none"
              : isCreateNote === false
              ? styles["header-AddNotesModal-close-btn"]
              : isAddNote
              ? styles["addNoteHeader"]
              : null
          }
          centered
          modalFooterClassName={styles["modal-userprofile-footer"]}
          size={
            isAddNote === true
              ? "md"
              : isCreateNote
              ? "md"
              : closeConfirmationBox
              ? null
              : "md"
          }
          ModalBody={
            <>
              {isAddNote ? (
                <>
                  <Row className="d-flex  align-items-center">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex align-items-center justify-content-start  gap-3"
                    >
                      <h2 className={styles["Addnote-heading"]}>
                        {t("Add-note")}
                      </h2>
                      {/* {isStarrted ? (
                        <Tooltip placement="topLeft" title={t("Starred")}>
                          <img
                            draggable="false"
                            src={hollowstar}
                            alt=""
                            className={styles["star-addnote-modal"]}
                            onClick={() => setIsStarrted(!isStarrted)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip placement="topLeft" title={t("Unstarred")}>
                          <img
                            draggable="false"
                            src={StarIcon}
                            alt=""
                            className={styles["star-addnote-modal"]}
                            onClick={() => setIsStarrted(!isStarrted)}
                          />
                        </Tooltip>
                      )} */}
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="modalAddNote-fields"
                    >
                      <Form.Control
                        placeholder={t("Note-title")}
                        className={styles["modal-Note-Title-Input"]}
                        name="Title"
                        ref={NoteTitle}
                        onKeyDown={(event) => enterKeyHandler(event, editorRef)}
                        maxLength={290}
                        value={addNoteFields.Title.value || ""}
                        onChange={addNotesFieldHandler}
                      />

                      <Row>
                        <Col>
                          <p
                            className={
                              addNoteFields.Title.errorStatus &&
                              addNoteFields.Title.value === ""
                                ? ` ${styles["errorNotesMessage"]} `
                                : `${styles["errorNotesMessage_hidden"]}`
                            }
                          >
                            {addNoteFields.Title.errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className={styles["Add-note-QuillRow"]}>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className={styles["Arabic_font_Applied"]}
                    >
                      <ReactQuill
                        ref={editorRef}
                        theme="snow"
                        value={addNoteFields.Description.value}
                        placeholder={t("Note-details")}
                        onChange={onTextChange}
                        modules={modules}
                        className={styles["quill-height-addNote"]}
                        style={{
                          direction: currentLanguage === "ar" ? "rtl" : "ltr",
                        }}
                      />

                      <Row className="mt-2">
                        <Col>
                          <p
                            className={
                              addNoteFields.Description.errorStatus &&
                              addNoteFields.Description.value === ""
                                ? ` ${styles["errorNotesMessage_description"]} `
                                : `${styles["errorNotesMessage_hidden_description"]}`
                            }
                          >
                            {addNoteFields.Description.errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          className="mb-3 mt-2"
                        >
                          <label className={styles["Add-Notes-Attachment"]}>
                            {t("Attachments")}
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12} xs={12}>
                          <span
                            className={styles["Notes-upload-input-AddModal"]}
                          >
                            <CustomUpload
                              change={uploadFilesToDo}
                              multiple={true}
                              onClick={(event) => {
                                event.target.value = null;
                              }}
                              className="UploadFileButton"
                            />

                            <Row>
                              <Col
                                sm={12}
                                lg={12}
                                md={12}
                                className={styles["notes-create-attachment"]}
                              >
                                {tasksAttachments.TasksAttachments.length > 0
                                  ? tasksAttachments.TasksAttachments.map(
                                      (data, index) => {
                                        return (
                                          <AttachmentViewer
                                            handleClickRemove={() =>
                                              deleteFilefromAttachments(
                                                data,
                                                index
                                              )
                                            }
                                            data={data}
                                            name={data.DisplayAttachmentName}
                                            id={0}
                                            fk_UID={data.userID}
                                          />
                                        );
                                      }
                                    )
                                  : null}
                              </Col>
                            </Row>
                          </span>
                        </Col>
                      </Row>
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
                      className={styles["Confirmationmodal_body_text"]}
                    >
                      {t("Are-you-sure-note-reset-closed")}
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isAddNote ? (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    className=" d-flex justify-content-end mt-2 gap-3"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["cancel-Add-notes-Modal"]}
                      onClick={cancelNewNoteModal}
                    />
                    <Button
                      text={t("Save")}
                      onClick={handleClick}
                      type="submit"
                      className={styles["save-Add-notes-Modal"]}
                    />
                  </Col>
                </Row>
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
                        onClick={() => setIsAddNote(true)}
                        className={styles["cancel-Add-notes-Modal"]}
                        text={t("Cancel")}
                      />
                      <Button
                        onClick={() => setCreateNotesModal(false)}
                        className={styles["close-Add-notes-Modal"]}
                        text={t("Close")}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
        />
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ModalAddNote;
