import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
} from "../../components/elements";
import { Option, PlusSquareFill, Star } from "react-bootstrap-icons";
import { Row, Col, Container, Dropdown } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import "react-quill/dist/quill.snow.css";
import styles from "./ModalAddNote.module.css";
import { useDispatch, useSelector } from "react-redux";
import { FileUploadToDo } from "../../store/actions/Upload_action";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import CustomUpload from "./../../components/elements/upload/Upload";
import moment from "moment";
import { SaveNotesAPI } from "../../store/actions/Notes_actions";
import { useTranslation } from 'react-i18next'

// import Form from "react-bootstrap/Form";

// import { countryName } from "../../AllUsers/AddUser/CountryJson";

const ModalAddNote = ({ ModalTitle, addNewModal, setAddNewModal }) => {
  //For Localization
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID")
  const [isAddNote, setIsAddNote] = useState(true);
  const [isCreateNote, setIsCreateNote] = useState(false);
  const { t } = useTranslation()
  const dispatch = useDispatch();

  //Upload File States
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

  const [text, setText] = useState("");
  const [text1, setText1] = useState("");
  // for add notes textfields states
  const [addNoteFields, setAddNoteFields] = useState({
    Title: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Description: {
      textTyped: "",
      errorMessage: "",
      errorStatus: false,
    },
  });
  console.log(addNoteFields, tasksAttachments, text1, "tasksAttachmentstasksAttachmentstasksAttachments")
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



  const onTextChange = (textTyped, e) => {
    textTyped =
      textTyped.split(" ").length > 20
        ? `${textTyped.split(" ").splice(0, 3).join(" ")}</p>`
        : textTyped;
    console.log("textTyped", textTyped);
    setText1(textTyped)
    setAddNoteFields({
      ...addNoteFields,
      Description: {
        textTyped: textTyped,
        errorMessage: "",
        errorStatus: false,
      },
    });

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
    }
  };

  //Upload File Handler
  const uploadFilesToDo = (data) => {
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

  const createModalHandler = async () => {
    setIsAddNote(false);
    // setIsCreateNote(true);
  };
  const cancelNewNoteModal = () => {
    setAddNewModal(false);
  }
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
    if (addNoteFields.Title.value !== "" && addNoteFields.Description.value !== "") {
      let notesAttachment = [];
      if (tasksAttachments.TasksAttachments.length > 0) {
        tasksAttachments.TasksAttachments.map((data, index) => {
          notesAttachment.push({
            DisplayAttachmentName: data.DisplayAttachmentName,
            OriginalAttachmentName: data.OriginalAttachmentName
          })
        })
      }
      let Data = {
        Title: addNoteFields.Title.value,
        Description: addNoteFields.Description.textTyped,
        isStarred: false,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
        NotesAttachments: notesAttachment
      }

      dispatch(SaveNotesAPI(Data, t, setAddNewModal))
    }
  }
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
                    <Col lg={3} md={3} sm={12} xs={12} className="d-flex align-items-center pe-0">
                      <p className={styles["Addnote-heading"]}>Add Note</p>
                    </Col>
                    <Col
                      lg={1}
                      md={1}
                      sm={1}
                      xs={12}
                      className="d-flex justify-content-start ps-0"
                    >
                      <Star size={18} className={styles["star-addnote-modal"]} />
                    </Col>
                    <Col lg={7} md={7} sm={7} xs={false}></Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <p className={styles["date-addnote"]}>
                        Created On: {moment(date).format("Do MMM, YYYY")} | {moment(date).format("LT")}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className={styles["modal-title-textfield"]}
                    >
                      <TextField
                        placeholder="Task Title"
                        applyClass="form-control2"
                        name="Title"
                        value={addNoteFields.Title.value || ""}
                        change={addNotesFieldHandler}
                      />

                      {/* <Row>
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
                      </Row> */}
                    </Col>
                  </Row>

                  <Row className={styles["Add-note-QuillRow"]}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <ReactQuill
                        theme="snow"
                        value={text1}
                        onChange={onTextChange}
                        modules={modules}
                        className={styles["quill-height-addNote"]}
                      />

                      {/* <Row className="mt-2">
                        <Col>
                          <p
                            className={
                              addNoteFields.Description.errorStatus &&
                                addNoteFields.Description.value === ""
                                ? ` ${styles["errorNotesDescription-Message"]} `
                                : `${styles["errorNotesDescription-Message_hidden"]}`
                            }
                          >
                            {addNoteFields.Description.errorMessage}
                          </p>
                        </Col>
                      </Row> */}
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                    >
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12} xs={12} className="mt-2">
                          <label className={styles["Add-Notes-Attachment"]}>
                            Attachement
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12} xs={12}>
                          <span className={styles["Notes-upload-input-AddModal"]}>
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
                                className="todoModalCreateModal"
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
                      <p>Are you sure you want to create <br /> this note?</p>
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isAddNote ? (
                <Row >
                  <Col lg={12} md={12} xs={12} className=" d-flex justify-content-end gap-4">
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
                  <Row >
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
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start mb-3"
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
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalAddNote;
