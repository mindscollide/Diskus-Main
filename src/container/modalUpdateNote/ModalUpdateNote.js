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

const ModalUpdateNote = ({ ModalTitle, setUpdateNotes, updateNotes, flag }) => {
  //For Localization
  const { NotesReducer } = useSelector((state) => state);
  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const { t } = useTranslation();
  const [isCreateNote, setIsCreateNote] = useState(false);
  const dispatch = useDispatch();
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
    searchIndex.splice(index, 1);
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

  const notesSaveHandler = async () => {
    let creatorID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    let notesAttachment = [];
    if (tasksAttachments.TasksAttachments.length > 0) {
      tasksAttachments.TasksAttachments.map((data, index) => {
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
      FK_UserID: JSON.parse(creatorID),
      FK_OrganizationID: JSON.parse(OrganizationID),
      FK_NotesStatusID: addNoteFields.FK_NotesStatusID,
      NotesAttachments: notesAttachment,
    };
    if (flag) {
      setUpdateNotes(false);
    }
    dispatch(
      UpdateNotesAPI(Data, t, setIsUpdateNote, setIsDeleteNote, setUpdateNotes)
    );
  };

  //State management of the Quill Editor
  const onTextChange = (content, delta, source) => {
    if (source === "user") {
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

  useEffect(() => {
    if (
      NotesReducer.GetNotesByNotesId !== null &&
      NotesReducer.GetNotesByNotesId !== undefined
    ) {
      console.log("NotesReducer", NotesReducer.GetNotesByNotesId);
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
  }, [NotesReducer.GetNotesByNotesId]);

  const uploadFilesToDo = (data) => {
    if (Object.keys(tasksAttachments.TasksAttachments).length === 10) {
      console.log("uploadedFile");

      setTimeout(
        setOpen({
          open: true,
          message: t("You-can-not-upload-more-then-10-files"),
        }),
        3000
      );
    } else {
      const uploadFilePath = data.target.value;
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      console.log("uploadedFile", uploadedFile.name);
      let file = tasksAttachments.TasksAttachments;
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
            if (filename.DisplayFileName === uploadedFile.name) {
              data = false;
            }
          });
          if (uploadedFile.size > 1000000) {
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
          if (uploadedFile.size > 1000000) {
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
        if (size === false) {
          console.log("uploadedFile");

          setTimeout(
            setOpen({
              open: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          console.log("uploadedFile");

          setTimeout(
            setOpen({
              open: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else {
          file.push({
            PK_TAID: 0,
            displayAttachmentName: uploadedFile.name,
            originalAttachmentName: uploadFilePath,
            dreationDateTime: "",
            FK_TID: 0,
          });
          setTasksAttachments({ ["TasksAttachments"]: file });
        }
      }
    }
  };
  const handleClickCancelDeleteModal = () => {
    setIsUpdateNote(true);
    // setUpdateNotes(false)
    // setUpdateNotesModalHomePage(false)
  };
  console.log(moment(addNoteFields.createdTime.value, "HHmmss").format("LT"));
  const deleteNotesHandler = (id) => {
    console.log(id, "deleteiD");
    if (flag) {
      setUpdateNotes(false);
    }
    dispatch(deleteNotesApi(id, t, setUpdateNotes));
  };
  return (
    <>
      <Container>
        <Modal
          show={updateNotes}
          onHide={() => {
            setUpdateNotes(false);
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
            isUpdateNote === true ? "md" : updateNotes === true ? "md" : "md"
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
                        {t("Created-On")} : {" "}
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
                        placeholder="Meeting with Mr.Yaqoob regarding Axis"
                        applyClass="updateNotes_titleInput"
                        name="Title"
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

                  <Row className={styles["QuillRow"]}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <ReactQuill
                        theme="snow"
                        value={addNoteFields.Description.value}
                        // defaultValue={addNoteFields.Description.value}
                        onChange={onTextChange}
                        modules={modules}
                        className={styles["quill-update-height"]}
                      />
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
                            Attachement
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
                                      <FileIcon
                                        extension={ext}
                                        size={78}
                                        labelColor={"rgba(97,114,214,1)"}
                                        // {...defaultStyles.ext
                                      />
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
                        <p>Are you sure you want to delete this note?</p>
                      </Col>
                    </Row>
                  </Container>
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
                      text="Delete"
                      onClick={deleteNoteModalHandler}
                      className={styles["Delete-notes-Button"]}
                    />

                    <Button
                      text="Cancel"
                      className={styles["cancel-Update-notes"]}
                      onClick={() => {
                        setUpdateNotes(false);
                      }}
                    />

                    <Button
                      text="Update"
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
                        text="Cancel"
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
                        text="Delete"
                        className={styles["delete-note-modal-btn"]}
                        onClick={() =>
                          deleteNotesHandler(addNoteFields.PK_NotesID)
                        }
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalUpdateNote;
