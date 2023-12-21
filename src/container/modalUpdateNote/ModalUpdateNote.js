import React, { useState, useEffect } from "react";
import { Button, Modal, Notification } from "../../components/elements";
import FileIcon, { defaultStyles } from "react-file-icon";
import CustomUpload from "./../../components/elements/upload/Upload";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUpdateNote.module.css";
import { FileUploadToDo } from "../../store/actions/Upload_action";
import Form from "react-bootstrap/Form";
import {
  deleteNotesApi,
  UpdateNotesAPI,
} from "../../store/actions/Notes_actions";
// import { countryName } from "../../AllUsers/AddUser/CountryJson";
import { useTranslation } from "react-i18next";
import StarIcon from "../../assets/images/Star.svg";
import hollowstar from "../../assets/images/Hollowstar.svg";
import {
  newTimeFormaterAsPerUTC,
  _justShowDateformat,
} from "../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { validateInput } from "../../commen/functions/regex";

const ModalUpdateNote = ({ ModalTitle, setUpdateNotes, updateNotes, flag }) => {
  //For Localization
  const { NotesReducer, uploadReducer } = useSelector((state) => state);
  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const [updateConfirmation, setUpdateConfirmation] = useState(false);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const [erorbar, setErrorBar] = useState(false);
  const { t } = useTranslation();
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [attachments, setAttachments] = useState([]);
  let currentLanguage = localStorage.getItem("i18nextLng");

  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = [...tasksAttachments.TasksAttachments];
    let removeFilefromAttachments = attachments.findIndex(
      (attacData, index) =>
        data.displayAttachmentName === attacData.displayAttachmentName
    );
    let copyattachments = [...attachments];
    let fileSizefound = fileSize - data.fileSize;
    let fileForSendingIndex = fileForSend.findIndex(
      (newData, index) => newData.name === data.displayAttachmentName
    );
    copyattachments.splice(removeFilefromAttachments, 1);
    searchIndex.splice(index, 1);
    fileForSend.splice(fileForSendingIndex, 1);
    setFileForSend(fileForSend);
    setFileSize(fileSizefound);
    setAttachments(copyattachments);
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: searchIndex,
    });
  };

  const [open, setOpen] = useState({
    open: false,
    message: "",
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

  //State management of the Quill Editor
  const onTextChange = (content, delta, source, editor) => {
    const maxLength = 2800; // Maximum allowed characters
    const plainText = content.replace(/(<([^>]+)>)/gi, "");
    const textLength = plainText.length;

    if (textLength > maxLength && source === "user") {
      // If the text length exceeds the limit and the change is from user input
      const diff = textLength - maxLength;
      const truncatedContent = plainText.substring(0, plainText.length - diff);

      const currentSelection = editor.getSelection(true);
      const truncatedSelection = Math.max(currentSelection.index - diff, 0);

      editor.setText(truncatedContent); // Set the text to the truncated version
      editor.setSelection(truncatedSelection); // Set cursor to the correct position after truncation
      editor.formatText(truncatedSelection, diff, "color", "transparent"); // Hide extra characters

      // Show an alert indicating the character limit
      alert(
        `Character limit (${maxLength}) reached. Excess characters will be removed.`
      );
    }

    if (source === "user" && plainText !== "") {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: content,
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    // } else {
    //   setAddNoteFields({
    //     ...addNoteFields,
    //     Description: {
    //       value: "",
    //       errorMessage: "",
    //       errorStatus: true,
    //     },
    //   });
    // }
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
        setAddNoteFields({
          ...addNoteFields,
          Title: {
            value: NotesReducer.GetNotesByNotesId.title,
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
          Description: {
            value: NotesReducer.GetNotesByNotesId.description,
            errorMessage: "",
            errorStatus: false,
          },
          PK_NotesID: NotesReducer.GetNotesByNotesId.pK_NotesID,

          FK_NotesStatusID: NotesReducer.GetNotesByNotesId.fK_NotesStatus,
        });
        setIsStarrted(NotesReducer.GetNotesByNotesId.isStarred);
        let copyData = [...attachments];
        let newData = [];
        if (NotesReducer.GetNotesByNotesId.notesAttachments.length > 0) {
          NotesReducer.GetNotesByNotesId.notesAttachments.map((data, index) => {
            copyData.push({
              displayAttachmentName: data.displayAttachmentName,
              originalAttachmentName: data.originalAttachmentName,
              fK_NotesID: data.fK_NotesID,
              pK_NAID: data.pK_NAID,
            });
            newData.push({
              DisplayAttachmentName: data.displayAttachmentName,
              OriginalAttachmentName: data.originalAttachmentName,
              FK_NotesID: data.fK_NotesID,
            });
          });
          setAttachments(copyData);
          setTasksAttachments({
            TasksAttachments: newData,
          });
        }
      }
    } catch (error) {}
  }, [NotesReducer.GetNotesByNotesId]);

  // console.log(first);

  console.log(tasksAttachments, "tasksAttachmentstasksAttachments");
  const uploadFilesToDo = (data) => {
    let fileSizeArr;
    if (attachments.length === 10) {
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
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      let file = attachments;
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
            if (filename.displayAttachmentName === uploadedFile.name) {
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
                message: t("File-already-exists"),
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
            let data = {
              displayAttachmentName: uploadedFile.name,
              originalAttachmentName: uploadedFile.name,
              fK_NotesID: 0,
              pK_NAID: 0,
            };
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            setAttachments([...attachments, data]);
          }
        } else {
          console.log("uploadedFile 12");

          let size;
          let sizezero;
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
            let data = {
              displayAttachmentName: uploadedFile.name,
              originalAttachmentName: uploadedFile.name,
              fK_NotesID: 0,
              pK_NAID: 0,
            };
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            setAttachments([...attachments, data]);
          }
        }
      }
    }
  };

  const notesSaveHandler = async () => {
    try {
      if (addNoteFields.Title.value !== "") {
        if (Object.keys(fileForSend).length > 0) {
          let newfiles = [...tasksAttachments.TasksAttachments];
          console.log(newfiles, "newfilesnewfiles");
          const uploadPromises = fileForSend.map((newData, index) => {
            let flag = fileForSend.length !== index + 1;
            // Return the promise from FileUploadToDo
            return dispatch(
              FileUploadToDo(navigate, newData, t, newfiles, flag)
            );
          });

          // Wait for all uploadPromises to resolve
          await Promise.all(uploadPromises);
          console.log(newfiles, "newfilesnewfiles");
          setErrorBar(false);
          let createrID = localStorage.getItem("userID");
          let OrganizationID = localStorage.getItem("organizationID");
          let notesAttachment = [];
          newfiles.map((data, index) => {
            notesAttachment.push({
              DisplayAttachmentName: data.DisplayAttachmentName,
              OriginalAttachmentName: data.OriginalAttachmentName,
              FK_NotesID:
                data.FK_NotesID !== null && data.FK_NotesID !== undefined
                  ? data.FK_NotesID
                  : 0,
            });
          });
          let Data = {
            PK_NotesID: addNoteFields.PK_NotesID,
            Title: addNoteFields.Title.value,
            Description: addNoteFields.Description.value,
            isStarred: isStarred,
            FK_UserID: JSON.parse(createrID),
            FK_OrganizationID: JSON.parse(OrganizationID),
            FK_NotesStatusID: addNoteFields.FK_NotesStatusID,
            NotesAttachments: notesAttachment,
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
          setErrorBar(false);
          // setUpdateNotesModalHomePage(false);
          let createrID = localStorage.getItem("userID");
          let OrganizationID = localStorage.getItem("organizationID");
          let notesAttachment = [];
          let copData = [...tasksAttachments.TasksAttachments];
          copData.map((data, index) => {
            notesAttachment.push({
              DisplayAttachmentName: data.DisplayAttachmentName,
              OriginalAttachmentName: data.OriginalAttachmentName,
              FK_NotesID:
                data.FK_NotesID !== null && data.FK_NotesID !== undefined
                  ? data.FK_NotesID
                  : 0,
            });
          });
          let Data = {
            PK_NotesID: addNoteFields.PK_NotesID,
            Title: addNoteFields.Title.value,
            Description: addNoteFields.Description.value,
            isStarred: isStarred,
            FK_UserID: JSON.parse(createrID),
            FK_OrganizationID: JSON.parse(OrganizationID),
            FK_NotesStatusID: addNoteFields.FK_NotesStatusID,
            NotesAttachments: notesAttachment,
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
        }
      } else {
        setErrorBar(true);
        setOpen({
          open: true,
          message: t("Please-fill-all-the-fields"),
        });
      }
    } catch {}
  };

  const handleClickCancelDeleteModal = () => {
    setIsUpdateNote(true);
  };

  const deleteNotesHandler = (id) => {
    if (flag) {
      setUpdateNotes(false);
    }
    dispatch(deleteNotesApi(navigate, id, t, setUpdateNotes));
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
          //   modalFooterClassName={styles["modal-userprofile-footer"]}
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
                        {/* {t("Update-note")} */}
                      </p>
                      {isStarred ? (
                        <img
                          draggable="false"
                          src={hollowstar}
                          className={styles["star-updatenote"]}
                          alt=""
                          onClick={() => setIsStarrted(!isStarred)}
                        />
                      ) : (
                        <img
                          draggable="false"
                          className={styles["star-updatenote"]}
                          src={StarIcon}
                          alt=""
                          onClick={() => setIsStarrted(!isStarred)}
                        />
                      )}
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
                        theme="snow"
                        value={addNoteFields.Description.value || ""}
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
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      // className="d-flex justify-content-start"
                    >
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
                          {attachments.length > 0
                            ? attachments.map((data, index) => {
                                var ext = data.displayAttachmentName
                                  .split(".")
                                  .pop();

                                const first =
                                  data.displayAttachmentName.split(" ")[0];
                                return (
                                  <Col
                                    sm={12}
                                    lg={2}
                                    md={2}
                                    className={
                                      styles["modaltodolist-attachment-icon"]
                                    }
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
                                        labelColor={"rgba(102, 102, 224)"}
                                      />
                                    ) : ext === "txt" ? (
                                      <FileIcon
                                        extension={"txt"}
                                        size={78}
                                        type={"document"}
                                        labelColor={"rgba(52, 120, 199)"}
                                      />
                                    ) : ext === "jpg" ? (
                                      <FileIcon
                                        extension={"jpg"}
                                        size={78}
                                        type={"image"}
                                        labelColor={"rgba(102, 102, 224)"}
                                      />
                                    ) : ext === "jpeg" ? (
                                      <FileIcon
                                        extension={"jpeg"}
                                        size={78}
                                        type={"image"}
                                        labelColor={"rgba(102, 102, 224)"}
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
                                    <span
                                      className={
                                        styles["deleteUpdateNoteAttachment"]
                                      }
                                    >
                                      <img
                                        draggable="false"
                                        src={deleteButtonCreateMeeting}
                                        width={15}
                                        height={15}
                                        onClick={() =>
                                          deleteFilefromAttachments(data, index)
                                        }
                                      />
                                    </span>
                                    <p className="modaltodolist-attachment-text">
                                      {first}
                                    </p>
                                  </Col>
                                );
                              })
                            : null}
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
                      // onClick={notesSaveHandler}
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
                      // onClick={handleClickCancelDeleteModal}
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
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ModalUpdateNote;
