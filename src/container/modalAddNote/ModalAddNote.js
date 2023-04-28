import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
} from "../../components/elements";
import { Row, Col, Container, Dropdown, Form } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import "react-quill/dist/quill.snow.css";
import styles from "./ModalAddNote.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  FileUploadToDo,
  ResetAllFilesUpload,
} from "../../store/actions/Upload_action";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import CustomUpload from "./../../components/elements/upload/Upload";
import moment from "moment";
import { SaveNotesAPI } from "../../store/actions/Notes_actions";
import { useTranslation } from "react-i18next";
import StarIcon from "../../assets/images/Star.svg";
import hollowstar from "../../assets/images/Hollowstar.svg";
const ModalAddNote = ({ ModalTitle, addNewModal, setAddNewModal }) => {
  //For Localization
  const { uploadReducer } = useSelector((state) => state);
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  const [isAddNote, setIsAddNote] = useState(true);
  const [isCreateNote, setIsCreateNote] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const NoteTitle = useRef(null);
  const editorRef = useRef(null);
  
  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const date = new Date();
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
    searchIndex.splice(index, 1);
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: searchIndex,
    });
  };

  //for textfields validation
  const addNotesFieldHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("values", name, value);
    if (name === "Title" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      console.log(value, "Titlellee");

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
    if (source === "user") {
      console.log(JSON.stringify(content), "tasksAttachmentstasksAttachmentstasksAttachments");
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: content,
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  // for save button hit
  const notesSaveHandler = async () => {
    if (
      addNoteFields.Title.value !== "" &&
      addNoteFields.Description.value !== ""
    ) {
      setIsAddNote(false);
      setIsCreateNote(true);
    } else {
      setAddNoteFields({
        ...addNoteFields,
        Title: {
          value: addNoteFields.Title.value,
          errorMessage:
            addNoteFields.Title.value === ""
              ? "Title is required"
              : addNoteFields.Title.errorMessage,
          errorStatus:
            addNoteFields.Title.value === ""
              ? true
              : addNoteFields.Title.errorStatus,
        },

        Description: {
          value: addNoteFields.Description.value,
          errorMessage:
            addNoteFields.Description.value === ""
              ? "Description is required"
              : addNoteFields.Description.errorMessage,
          errorStatus:
            addNoteFields.Description.value === ""
              ? true
              : addNoteFields.Description.errorStatus,
        },
      });
      setIsCreateNote(false);
      setOpen({
        ...open,
        open: true,
        message: t("Field-should-not-be-empty"),
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);
    }
  };

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    const uploadFilePath = data.target.value;
    const uploadedFile = data.target.files[0];
    var ext = uploadedFile.name.split(".").pop();
    console.log("uploadedFile", uploadedFile.name, ext);
    let file = tasksAttachments.TasksAttachments;
    console.log("uploadedFile", file);
    if (
      ext === "doc" ||
      ext === "docx" ||
      ext === "xls" ||
      ext === "xlsx" ||
      ext === "pdf" ||
      ext === "png" ||
      ext === "txt" ||
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "gif"
    ) {
      let data;
      let sizezero;
      let size;
      if (file.length > 0) {
        file.map((filename, index) => {
          console.log("uploadedFile", filename);
          if (filename.DisplayAttachmentName === uploadedFile.name) {
            console.log(
              "uploadedFile",
              filename.DisplayAttachmentName === uploadedFile.name
            );
            data = false;
          }
        });
        if (uploadedFile.size > 10000000) {
          size = false;
        } else if (uploadedFile.size === 0) {
          sizezero = false;
        }
        if (data === false) {
        } else if (size === false) {
        } else if (sizezero === false) {
        } else {
          dispatch(FileUploadToDo(uploadedFile));
        }
      } else {
        let size;
        let sizezero;
        if (uploadedFile.size > 10000000) {
          size = false;
        } else if (uploadedFile.size === 0) {
          sizezero = false;
        }
        if (size === false) {
        } else if (sizezero === false) {
        } else {
          dispatch(FileUploadToDo(uploadedFile));
        }
      }
    }

    file.push({
      PK_TAID: 0,
      DisplayAttachmentName: uploadedFile.name,
      OriginalAttachmentName: uploadFilePath,
      CreationDateTime: "",
      FK_TID: 0,
    });
    setTasksAttachments({ ["TasksAttachments"]: file });
  };

  useEffect(() => {
    let newData = uploadReducer.uploadDocumentsList;
    let file = tasksAttachments.TasksAttachments;
  }, [uploadReducer.uploadDocumentsList]);
  const createModalHandler = async () => {
    setIsAddNote(false);
    // setIsCreateNote(true);
  };
  const cancelNewNoteModal = () => {
    setAddNewModal(false);
  };



  const modules = {
    toolbar: {
      container: [
        {
          size: ["14px", "16px", "18px"],
        },
        { font: ["impact", "courier", "comic", "Montserrat"] },
        { bold: {} },
        { italic: {} },
        { underline: {} },

        { color: [] },
        { background: [] },
        { align: [] },
        { list: "ordered" },
        { list: "bullet" },
      ],
      handlers: {},
    },
  };
  const handleClick = () => {
    if (
      addNoteFields.Title.value !== "" &&
      addNoteFields.Description.value !== ""
    ) {
      setAddNewModal(false)
      let notesAttachment = [];
      if (tasksAttachments.TasksAttachments.length > 0) {
        tasksAttachments.TasksAttachments.map((data, index) => {
          notesAttachment.push({
            DisplayAttachmentName: data.DisplayAttachmentName,
            OriginalAttachmentName: data.OriginalAttachmentName,
          });
        });
      }
      // let Dis=JSON.stringify(addNoteFields.Description.value)
      let Data = {
        Title: addNoteFields.Title.value,
        Description: addNoteFields.Description.value,
        isStarred: isStarrted,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
        NotesAttachments: notesAttachment,
      };

      dispatch(SaveNotesAPI(Data, t, setAddNewModal));
    } else {
    }
  };

  useEffect(() => {
    NoteTitle.current.focus();
  }, []);

  const enterKeyHandler = (event) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      const quill = editorRef.current.getEditor();
      quill.root.setAttribute('autofocus', '');
      quill.focus();
    }
  };
  return (
    <>
      <Container>
        <Modal
          show={addNewModal}
          onHide={() => {
            setAddNewModal(false);
          }}
          setShow={setAddNewModal}
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
          size={isAddNote === true ? "md" : isCreateNote ? "md" : "md"}
          ModalBody={
            <>
              {isAddNote ? (
                <Container>
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
                      {isStarrted ? (
                        <img
                          src={hollowstar}
                          className={styles["star-addnote-modal"]}
                          onClick={() => setIsStarrted(!isStarrted)}
                        />
                      ) : (
                        <img
                          src={StarIcon}
                          className={styles["star-addnote-modal"]}
                          onClick={() => setIsStarrted(!isStarrted)}
                        />
                      )}
                    </Col>
                  </Row>

                  {/* <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <p className={styles["date-addnote"]}>
                        {t("Created-on")}: {moment(date).format("Do-MMM-YYYY")}{" "}
                        | {moment(date).format("LT")}
                      </p>
                    </Col>
                  </Row> */}

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
                        className= {styles["modal-Note-Title-Input"]}
                        // className="modalAddNoteTitleInput"
                        name="Title"
                        ref={NoteTitle}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, editorRef)
                        }
                        maxLength={200}
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
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <ReactQuill
                      ref={editorRef}
                        theme="snow"
                        value={addNoteFields.Description.value}
                        placeholder={t("Note-details")}
                        onChange={onTextChange}
                        modules={modules}
                        className={styles["quill-height-addNote"]}
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
                            {t("Attachements")}
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
                                        var ext =
                                          data.DisplayAttachmentName.split(
                                            "."
                                          ).pop();

                                        const first =
                                          data.DisplayAttachmentName.split(
                                            " "
                                          )[0];
                                        return (
                                          <Col
                                            sm={12}
                                            lg={2}
                                            md={2}
                                            className="modaltodolist-attachment-icon"
                                          >
                                            <FileIcon
                                              extension={ext}
                                              size={78}
                                              labelColor={"rgba(97,114,214,1)"}
                                              // {...defaultStyles.ext}
                                            />
                                            <span className="deleteBtn">
                                              <img
                                                src={deleteButtonCreateMeeting}
                                                width={15}
                                                height={15}
                                                onClick={() =>
                                                  deleteFilefromAttachments(
                                                    data,
                                                    index
                                                  )
                                                }
                                              />
                                            </span>
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
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              ) : isCreateNote ? (
                <>
                  <Row>
                    {/* <Col lg={2} md={2} sm={2} /> */}
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["create-note-modal-text"]}
                    >
                      <p>
                        {t("Are-you-sure-you-want-to-create")} <br />{" "}
                        {t("this-note")}?
                      </p>
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
                      text="Cancel"
                      className={styles["cancel-Add-notes-Modal"]}
                      onClick={cancelNewNoteModal}
                    />
                    <Button
                      text="Save"
                      onClick={notesSaveHandler}
                      type="submit"
                      className={styles["save-Add-notes-Modal"]}
                    />
                  </Col>
                </Row>
              ) : isCreateNote ? (
                <>
                  <Row>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className={styles["createNoteModalCancelBtn"]}
                    >
                      <Button
                        text="Cancel"
                        className={styles["cancel-create-modal-btn"]}
                        onClick={() => {
                          setIsAddNote(true);
                          setIsCreateNote(false);
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
                        text="Proceed"
                        className={styles["proceed-create-modal-btn"]}
                        onClick={handleClick}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ModalAddNote;
