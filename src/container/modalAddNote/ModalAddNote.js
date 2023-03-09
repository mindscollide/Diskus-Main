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
// import Form from "react-bootstrap/Form";

// import { countryName } from "../../AllUsers/AddUser/CountryJson";

const ModalAddNote = ({ ModalTitle, addNewModal, setAddNewModal }) => {
  //For Localization

  const [isAddNote, setIsAddNote] = useState(true);
  const [isCreateNote, setIsCreateNote] = useState(false);

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
  });

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

  const [text1, setText1] = useState("");

  const onTextChange = (textTyped, e) => {
    textTyped =
      textTyped.split(" ").length > 20
        ? `${textTyped.split(" ").splice(0, 3).join(" ")}</p>`
        : textTyped;
    console.log("textTyped", textTyped);
    setText1(textTyped);
    let name = e.target.name;
    if (name === "Description" && textTyped !== "") {
      let valueCheck = textTyped.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setAddNoteFields({
          ...addNoteFields,
          Description: {
            textTyped: valueCheck.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Description" && textTyped === "") {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          textTyped: "",
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

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);

  // var font = Quill.import("attributors/style/font");
  // font.whitelist = ["Montserrat"];
  // Quill.register(font, true);

  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);

  const modules = {
    toolbar: {
      container: [
        { font: ["impact", "courier", "comic"] },
        {
          size: ["14px", "16px", "18px"],
        },
        { header: [1, 2, 3, 4, 5, 6, false] },
        { color: [] },
        { background: [] },
        { align: [] },
        { bold: {} },
        { italic: {} },
        { underline: {} },
        { strike: {} },
        { script: "sub" },
        { script: "super" },
        { indent: "-1" },
        { indent: "+1" },
        { list: "ordered" },
        { list: "bullet" },
        { direction: "rtl" },
        { link: {} },
        { image: {} },
        { video: {} },
        { formula: {} },
        { clean: "all" },
      ],
      handlers: {},
    },
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
              : null
          }
          centered
          //   modalFooterClassName={styles["modal-userprofile-footer"]}
          size={isAddNote === true ? "md" : "md"}
          ModalBody={
            <>
              {isAddNote ? (
                <Container>
                  <Row>
                    <Col lg={3} md={3} sm={3} xs={12}>
                      <p className={styles["Addnote-heading"]}>Add Note</p>
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={12}
                      // className="d-flex justify-content-start"
                    >
                      <Star size={18} className={styles["star-addnote"]} />
                    </Col>
                    <Col lg={7} md={7} sm={7} xs={12}></Col>
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
                        Created On: 10-Dec-22 | 03:30pm
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

                  <Row className="mt-0">
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <ReactQuill
                        theme="snow"
                        value={text1}
                        onChange={onTextChange}
                        modules={modules}
                        className={styles["quill-height"]}
                      />

                      <Row className="mt-2">
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
                      </Row>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12} xs={12}>
                          <label className={styles["attached-title"]}>
                            Attachement
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12} xs={12}>
                          <span className={styles["Notes-upload-input"]}>
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
                  <Container>
                    <Row>
                      <Col lg={2} md={2} sm={2} />
                      <Col
                        lg={8}
                        md={8}
                        sm={8}
                        className={styles["create-note-modal-text"]}
                      >
                        <p>Are you sure you want to create this note</p>
                      </Col>
                      <Col lg={2} md={2} sm={2} />
                    </Row>
                  </Container>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isAddNote ? (
                <Row className="mb-1 p-1">
                  <Col lg={6} md={6} xs={12} className="mt-5">
                    <Button
                      variant={"Primary"}
                      text="Cancel"
                      className={styles["cancel-Add-notes"]}
                    />
                  </Col>

                  <Col lg={6} md={6} xs={12} className="mt-5">
                    <Button
                      variant={"Primary"}
                      text="Save"
                      onClick={notesSaveHandler}
                      type="submit"
                      className={styles["save-Add-notes"]}
                    />
                  </Col>
                </Row>
              ) : isCreateNote ? (
                <>
                  <Row className={styles["modal-row"]}>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start mb-3"
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
                      className="d-flex justify-content-center mb-3"
                    >
                      <Button
                        text="Proceed"
                        className={styles["proceed-create-modal-btn"]}
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
