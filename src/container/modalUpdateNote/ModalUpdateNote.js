import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
} from "../../components/elements";
import { PlusSquareFill, Star } from "react-bootstrap-icons";
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
import moment from "moment";
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
  TimeDisplayFormat,
  _justShowDateformat,
} from "../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { validateInput } from "../../commen/functions/regex";

const ModalUpdateNote = ({ ModalTitle, setUpdateNotes, updateNotes, flag }) => {
  //For Localization
  const { NotesReducer } = useSelector((state) => state);
  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const [erorbar, setErrorBar] = useState(false);
  const { t } = useTranslation();
  const [isCreateNote, setIsCreateNote] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
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
    let searchIndex = tasksAttachments.TasksAttachments;
    let fileSizefound = fileSize - data.fileSize;
    let fileForSendingIndex = fileForSend.findIndex(
      (newData, index) => newData.name === data.displayAttachmentName
    );
    searchIndex.splice(index, 1);
    fileForSend.splice(fileForSendingIndex, 1);
    setFileForSend(fileForSend);
    setFileSize(fileSizefound);
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

  //State management of the Quill Editor
  const onTextChange = (content, delta, source) => {
    console.log("content", content);
    const plainText = content.replace(/(<([^>]+)>)/gi, "");
    if (source === "user" && plainText !== "") {
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

  useEffect(() => {
    try {
      if (
        NotesReducer.GetNotesByNotesId !== null &&
        NotesReducer.GetNotesByNotesId !== undefined
      ) {
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
        setTasksAttachments({
          TasksAttachments: NotesReducer.GetNotesByNotesId.notesAttachments,
        });
      }
    } catch (error) {}
  }, [NotesReducer.GetNotesByNotesId]);

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
      console.log("uploadedFile", uploadedFile.name);
      let file = tasksAttachments.TasksAttachments;
      console.log("uploadedFile 12");
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
        console.log(
          "uploadedFile 22",
          uploadedFile.size,
          uploadedFile.size > 10485760
        );

        let data;
        let sizezero;
        let size;
        if (file.length > 0) {
          console.log("uploadedFile 12");

          file.map((filename, index) => {
            if (filename.DisplayFileName === uploadedFile.name) {
              data = false;
            }
          });
          if (uploadedFile.size > 10485760) {
            size = false;
          } else if (uploadedFile.size === 0) {
            sizezero = false;
          }
          console.log("uploadedFile 12", size);

          if (data === false) {
            console.log("uploadedFile 12");

            setTimeout(
              setOpen({
                open: true,
                message: t("File-already-exisit"),
              }),
              3000
            );
          } else if (size === false) {
            console.log("uploadedFile 12");

            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              }),
              3000
            );
          } else if (sizezero === false) {
            console.log("uploadedFile 12");

            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-zero"),
              }),
              3000
            );
          } else {
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            let fileData = {
              pK_NAID: 0,
              displayAttachmentName: uploadedFile.name,
              originalAttachmentName: uploadFilePath,
              dreationDateTime: "",
              fK_NotesID: 0,
              fileSize: uploadedFile.size,
            };
            setTasksAttachments({
              ["TasksAttachments"]: [
                ...tasksAttachments.TasksAttachments,
                fileData,
              ],
            });
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
            console.log("uploadedFile 12");

            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              }),
              3000
            );
          } else if (sizezero === false) {
            console.log("uploadedFile 12");

            setTimeout(
              setOpen({
                open: true,
                message: t("File-size-should-not-be-zero"),
              }),
              3000
            );
          } else {
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            let fileData = {
              pK_NAID: 0,
              displayAttachmentName: uploadedFile.name,
              originalAttachmentName: uploadFilePath,
              dreationDateTime: "",
              fK_NotesID: 0,
              fileSize: uploadedFile.size,
            };
            setTasksAttachments({
              ["TasksAttachments"]: [
                ...tasksAttachments.TasksAttachments,
                fileData,
              ],
            });
          }
        }
      }
    }
  };

  const notesSaveHandler = () => {
    try {
      if (addNoteFields.Title.value !== "") {
        let counter = fileForSend.length;
        if (Object.keys(fileForSend).length > 0) {
          const uploadFiles = (fileForSend) => {
            const uploadPromises = fileForSend.map((newData) => {
              dispatch(FileUploadToDo(navigate, newData, t));
            });
            return Promise.all(uploadPromises);
          };
          uploadFiles(fileForSend)
            .then((response) => {
              setErrorBar(false);
              let createrID = localStorage.getItem("userID");
              let OrganizationID = localStorage.getItem("organizationID");
              let notesAttachment = [];
              if (tasksAttachments.TasksAttachments.length > 0) {
                tasksAttachments.TasksAttachments.map((data, index) => {
                  console.log("datadata", data);
                  notesAttachment.push({
                    DisplayAttachmentName: data.displayAttachmentName,
                    OriginalAttachmentName: data.originalAttachmentName,
                  });
                });
              }
              console.log("check2");

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
              console.log("check2");

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
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setErrorBar(false);
          // setUpdateNotesModalHomePage(false);
          let createrID = localStorage.getItem("userID");
          let OrganizationID = localStorage.getItem("organizationID");
          let notesAttachment = [];
          console.log("setIsUpdateNotesetIsUpdateNote");

          if (tasksAttachments.TasksAttachments.length > 0) {
            tasksAttachments.TasksAttachments.map((data, index) => {
              console.log("datadata", data);
              notesAttachment.push({
                DisplayAttachmentName: data.displayAttachmentName,
                OriginalAttachmentName: data.originalAttachmentName,
              });
            });
          }
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
            isDeleteNote === true
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
              : closeConfirmationBox
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
                          src={hollowstar}
                          className={styles["star-updatenote"]}
                          onClick={() => setIsStarrted(!isStarred)}
                        />
                      ) : (
                        <img
                          className={styles["star-updatenote"]}
                          src={StarIcon}
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
                        maxLength={100}
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
                          {tasksAttachments.TasksAttachments.length > 0
                            ? tasksAttachments.TasksAttachments.map(
                                (data, index) => {
                                  console.log("tasksAttachments", data);
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
                      onClick={notesSaveHandler}
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
                        text={"Cancel"}
                      />
                      <Button
                        onClick={() => setUpdateNotes(false)}
                        className={styles["Update-notes-Button"]}
                        text={"Close"}
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

export default ModalUpdateNote;
