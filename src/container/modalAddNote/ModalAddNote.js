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
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/elements/confirmationModal/ConfirmationModal";
import {
  regexOnlyForNumberNCharacters,
  validateInput,
} from "../../commen/functions/regex";
const ModalAddNote = ({ ModalTitle, addNewModal, setAddNewModal }) => {
  //For Localization
  const { uploadReducer } = useSelector((state) => state);
  let createrID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  let OrganizationID = localStorage.getItem("organizationID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [isAddNote, setIsAddNote] = useState(true);
  const [isCreateNote, setIsCreateNote] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
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
  console.log("fileSizefileSize", fileSize);
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
      let valueCheck = validateInput(value);
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
    const plainText = content.replace(/(<([^>]+)>)/gi, "");
    if (source === "user" && plainText != "") {
      console.log(content, "addNoteFieldsaddNoteFieldsaddNoteFields");

      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: content,
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: "",
          errorMessage: "",
          errorStatus: true,
        },
      });
    }
  };

  // for save button hit
  const notesSaveHandler = async () => {
    try {
      if (addNoteFields.Title.value !== "") {
        setIsAddNote(false);
        setIsCreateNote(true);
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
        setIsCreateNote(false);
        // setOpen({
        //   ...open,
        //   open: true,
        //   message: t("Field-should-not-be-empty"),
        // })
        // setTimeout(() => {
        //   setOpen({
        //     ...open,
        //     open: false,
        //     message: "",
        //   })
        // }, 3000)
      }
    } catch (error) {}
  };

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    let fileSizeArr;
    if (Object.keys(tasksAttachments.TasksAttachments).length === 10) {
      console.log("uploadedFile");
      setTimeout(
        setOpen({
          open: true,
          message: t("You-can-not-upload-more-then-10-files"),
        }),
        3000
      );
    } else if (fileSize >= 104857600) {
      setTimeout(
        setOpen({
          open: true,
          message: t("You-can-not-upload-more-then-100MB-files"),
        }),
        3000
      );
    } else {
      const uploadFilePath = data.target.value;
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      console.log("uploadedFile12", uploadedFile.name, ext, uploadedFile.size);
      let file = tasksAttachments.TasksAttachments;
      console.log("daatadaad", file);
      console.log(uploadedFile, "daatadaad");
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
        ext === "gif" ||
        ext === "csv"
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
          if (uploadedFile.size > 10485760) {
            size = false;
          } else if (uploadedFile.size === 0) {
            sizezero = false;
          }
          if (data === false) {
            setTimeout(
              setOpen({
                open: true,
                message: t("File-already-exisit"),
              }),
              3000
            );
          } else if (size === false) {
            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              }),
              3000
            );
          } else if (sizezero === false) {
            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-zero"),
              }),
              3000
            );
          } else {
            // dispatch(FileUploadToDo(uploadedFile, t));
            fileSizeArr = uploadedFile.size + fileSize;
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            let FileData = {
              PK_TAID: 0,
              DisplayAttachmentName: uploadedFile.name,
              OriginalAttachmentName: uploadFilePath,
              CreationDateTime: "",
              FK_TID: 0,
              fileSize: uploadedFile.size,
            };
            setTasksAttachments({
              TasksAttachments: [
                ...tasksAttachments.TasksAttachments,
                FileData,
              ],
            });
          }
        } else {
          if (uploadedFile.size > 10485760) {
            size = false;
          } else if (uploadedFile.size === 0) {
            sizezero = false;
          }
          if (size === false) {
            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              }),
              3000
            );
          } else if (sizezero === false) {
            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-zero"),
              }),
              3000
            );
          } else {
            // dispatch(FileUploadToDo(uploadedFile, t));
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            let FileData = {
              PK_TAID: 0,
              DisplayAttachmentName: uploadedFile.name,
              OriginalAttachmentName: uploadFilePath,
              CreationDateTime: "",
              FK_TID: 0,
              fileSize: uploadedFile.size,
            };
            setTasksAttachments({
              TasksAttachments: [
                ...tasksAttachments.TasksAttachments,
                FileData,
              ],
            });
          }
        }
      }
    }
  };

  const cancelNewNoteModal = () => {
    setCloseConfirmationBox(true);
    setIsCreateNote(false);
    setIsAddNote(false);
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

  const handleClick = async () => {
    if (addNoteFields.Title.value !== "") {
      if (Object.keys(fileForSend).length > 0) {
        let newfile = [];
        let newData = [];
        const uploadPromises = fileForSend.map((newData) => {
          return dispatch(FileUploadToDo(navigate, newData, t, newfile));
        });
        await Promise.all(uploadPromises);
        newfile.map((attachmentData, index) => {
          newData.push({
            DisplayAttachmentName: attachmentData.DisplayAttachmentName,
            OriginalAttachmentName: attachmentData.OriginalAttachmentName,
            FK_NotesID: 0,
          });
        });
        let Data = {
          Title: addNoteFields.Title.value,
          Description: addNoteFields.Description.value,
          isStarred: isStarrted,
          FK_UserID: JSON.parse(createrID),
          FK_OrganizationID: JSON.parse(OrganizationID),
          NotesAttachments: newData,
        };
        console.log(Data, "addNoteFieldsaddNoteFieldsaddNoteFields");
        dispatch(SaveNotesAPI(navigate, Data, t, setAddNewModal));
      } else {
        setAddNewModal(false);
        let notesAttachment = [];
        let Data = {
          Title: addNoteFields.Title.value,
          Description: addNoteFields.Description.value,
          isStarred: isStarrted,
          FK_UserID: JSON.parse(createrID),
          FK_OrganizationID: JSON.parse(OrganizationID),
          NotesAttachments: notesAttachment,
        };

        console.log(Data, "addNoteFieldsaddNoteFieldsaddNoteFields");
        dispatch(SaveNotesAPI(navigate, Data, t, setAddNewModal));
      }
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
      // setOpen({
      //   ...open,
      //   open: true,
      //   message: t("Field-should-not-be-empty"),
      // });
      // setTimeout(() => {
      //   setOpen({
      //     ...open,
      //     open: false,
      //     message: "",
      //   });
      // }, 3000);
    }
  };

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
      <Container>
        <Modal
          show={addNewModal}
          onHide={() => {
            setCloseConfirmationBox(true);
            setIsCreateNote(false);
            setIsAddNote(false);
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
                          draggable="false"
                          src={hollowstar}
                          alt=""
                          className={styles["star-addnote-modal"]}
                          onClick={() => setIsStarrted(!isStarrted)}
                        />
                      ) : (
                        <img
                          draggable="false"
                          src={StarIcon}
                          alt=""
                          className={styles["star-addnote-modal"]}
                          onClick={() => setIsStarrted(!isStarrted)}
                        />
                      )}
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
                        maxLength={100}
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
                                        console.log("extextext", ext);
                                        // let newext = JSON.parse(ext)
                                        // console.log("extextext", newext)

                                        return (
                                          <Col
                                            sm={12}
                                            lg={2}
                                            md={2}
                                            className="modaltodolist-attachment-icon"
                                          >
                                            {ext === "doc" ? (
                                              <FileIcon
                                                extension={"docx"}
                                                size={78}
                                                type={"document"}
                                                labelColor={"rgba(44, 88, 152)"}
                                              />
                                            ) : ext === "docx" ? (
                                              <FileIcon
                                                extension={"docx"}
                                                size={78}
                                                type={"font"}
                                                labelColor={"rgba(44, 88, 152)"}
                                              />
                                            ) : ext === "xls" ? (
                                              <FileIcon
                                                extension={"xls"}
                                                type={"spreadsheet"}
                                                size={78}
                                                labelColor={"rgba(16, 121, 63)"}
                                              />
                                            ) : ext === "xlsx" ? (
                                              <FileIcon
                                                extension={"xls"}
                                                type={"spreadsheet"}
                                                size={78}
                                                labelColor={"rgba(16, 121, 63)"}
                                              />
                                            ) : ext === "pdf" ? (
                                              <FileIcon
                                                extension={"pdf"}
                                                size={78}
                                                {...defaultStyles.pdf}
                                              />
                                            ) : ext === "png" ? (
                                              <FileIcon
                                                extension={"png"}
                                                size={78}
                                                type={"image"}
                                                labelColor={
                                                  "rgba(102, 102, 224)"
                                                }
                                              />
                                            ) : ext === "txt" ? (
                                              <FileIcon
                                                extension={"txt"}
                                                size={78}
                                                type={"document"}
                                                labelColor={
                                                  "rgba(52, 120, 199)"
                                                }
                                              />
                                            ) : ext === "jpg" ? (
                                              <FileIcon
                                                extension={"jpg"}
                                                size={78}
                                                type={"image"}
                                                labelColor={
                                                  "rgba(102, 102, 224)"
                                                }
                                              />
                                            ) : ext === "jpeg" ? (
                                              <FileIcon
                                                extension={"jpeg"}
                                                size={78}
                                                type={"image"}
                                                labelColor={
                                                  "rgba(102, 102, 224)"
                                                }
                                              />
                                            ) : ext === "gif" ? (
                                              <FileIcon
                                                extension={"gif"}
                                                size={78}
                                                {...defaultStyles.gif}
                                              />
                                            ) : (
                                              <FileIcon
                                                extension={ext}
                                                size={78}
                                                {...defaultStyles.ext}
                                              />
                                            )}

                                            <span className="deleteBtn">
                                              <img
                                                draggable="false"
                                                src={deleteButtonCreateMeeting}
                                                width={15}
                                                height={15}
                                                alt=""
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
                        onClick={() => setAddNewModal(false)}
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
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ModalAddNote;
