import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Notes.module.css";
import IconAttachment from "../../assets/images/Icon-Attachment.png";
import EditIcon from "../../assets/images/Edit-Icon.png";
import ModalViewNote from "../modalViewNote/ModalViewNote";
import ModalAddNote from "../modalAddNote/ModalAddNote";
import ModalUpdateNote from "../modalUpdateNote/ModalUpdateNote";
import ClipIcon from "../../assets/images/ClipIcon.png";
import StarIcon from "../../assets/images/starIcon.png";
import hollowstar from "../../assets/images/hollowStar.png";
import { Collapse } from "antd";
import FileIcon, { defaultStyles } from "react-file-icon";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Plus,
  Dash,
  StarFill,
  Paperclip,
} from "react-bootstrap-icons";
import {
  Button,
  Paper,
  Loader,
  TextField,
  Notification,
} from "../../components/elements";
import { end, left } from "@popperjs/core";
import { Accordion, AccordionSummary } from "@material-ui/core";
import { AccordionDetails, Typography } from "@mui/material";
import {
  ClearNotesResponseMessage,
  GetNotes,
  GetNotesByIdAPI,
} from "../../store/actions/Notes_actions";
import moment from "moment";

const Notes = () => {
  const [editFlag, setEditFlag] = useState(false);
  //Test Accordian states start

  const [selectedMarkerID, setSelectedMarkerID] = useState(0);
  const [expand, setExpand] = useState(false);
  const dispatch = useDispatch();
  const { NotesReducer } = useSelector((state) => state);
  const { Panel } = Collapse;
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  //Get Current User ID
  const { t } = useTranslation();
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  // for modal Add notes
  const [addNotes, setAddNotes] = useState(false);
  const toggleAcordion = (data, index) => {
    console.log(data, index, "toggleAcordion");
    setExpand((prev) => !prev);
  };
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [showStarIcon, setStarIcon] = useState(false);
  // for modal Update notes
  const [updateShow, setUpdateShow] = useState(false);
  const [notes, setNotes] = useState([
    {
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
    },
  ]);
  //for view modal notes
  const [viewModalShow, setViewModalShow] = useState(false);

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  // const genExtra = () => (
  //   <img src={EditIcon} width={15} onClick={editIconModal} alt="" />
  // );

  //for open Add User Notes Modal
  const modalAddUserModal = async (e) => {
    setAddNotes(true);
  };

  // for open Update User Notes Modal
  const editIconModal = async (id) => {
    // setUpdateShow(true);
    dispatch(GetNotesByIdAPI(id, t, setViewModalShow, setUpdateShow, 2));
  };
  useEffect(() => {
    setAddNotes(false);
    setViewModalShow(false);
    setUpdateShow(false);
  }, []);

  // render Notes Data
  useEffect(() => {
    if (
      NotesReducer.GetAllNotesResponse !== null &&
      NotesReducer.GetAllNotesResponse.length > 0
    ) {
      let notes = [];
      NotesReducer.GetAllNotesResponse.map((data, index) => {
        notes.push({
          date: data.date,
          description: data.description,
          fK_NotesStatus: data.fK_NotesStatus,
          fK_OrganizationID: data.fK_OrganizationID,
          fK_UserID: data.fK_UserID,
          isAttachment: data.isAttachment,
          isStarred: data.isStarred,
          modifiedDate: data.modifiedDate,
          modifiedTime: data.modifiedTime,
          notesAttachments: data.notesAttachments,
          notesStatus: data.notesStatus,
          organizationName: data.organizationName,
          pK_NotesID: data.pK_NotesID,
          time: data.time,
          title: data.title,
          username: data.username,
        });
      });
      setNotes(notes);
    }
  }, [NotesReducer.GetAllNotesResponse]);
  console.log("NotesReducerNotesReducer", NotesReducer);
  //for open View User Notes Modal
  const viewNotesModal = async (id) => {
    console.log(id, "viewNotesModalviewNotesModalviewNotesModal");
    dispatch(GetNotesByIdAPI(id, t, setViewModalShow, setUpdateShow, 1));
  };
  useEffect(() => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      UserID: parseInt(createrID),
      OrganizationID: JSON.parse(OrganizationID),
    };
    dispatch(GetNotes(Data, t));
  }, []);
  const ColorStarIcon = (id, index) => {
    setStarIcon(!showStarIcon);
  };
  const [isExpanded, setExpanded] = useState(false);
  const handleChangeExpanded = (id) => (event, newExpanded) => {
    setExpanded(newExpanded ? id : false);
  };
  useEffect(() => {
    if (
      NotesReducer.ResponseMessage !== "" &&
      NotesReducer.ResponseMessage !== "Data available"
    ) {
      setOpen({
        ...open,
        open: true,
        message: NotesReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen(
          {
            ...open,
            open: false,
            message: "",
          },
          4000
        );
      });
      dispatch(ClearNotesResponseMessage());
    }
  }, []);
  return (
    <>
      <Container className={styles["notescontainer"]}>
        <Row className="mt-4">
          <Col md={2} sm={2} lg={2} className={styles["notes-heading-size"]}>
            Notes
          </Col>

          <Col lg={3} md={3} sm={3} className={styles["create-note-btn"]}>
            <Button text=" + Create New Notes" onClick={modalAddUserModal} />
          </Col>
          <Col lg={7} md={7} sm={7}></Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} className={styles["notesViewContainer"]}>
            {/* Test Accordian Body Starts  */}
            {notes.length > 0 && notes !== null && notes !== undefined
              ? notes.map((data, index) => {
                  return (
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Accordion
                          expanded={isExpanded === JSON.parse(data.pK_NotesID)}
                          key={data.pK_NotesID}
                          onChange={handleChangeExpanded(data.pK_NotesID)}
                        >
                          <AccordionSummary
                            disableRipple={true}
                            disableTouchRipple={true}
                            focusRipple={false}
                            radioGroup={false}
                            expandIcon={
                              isExpanded === JSON.parse(data.pK_NotesID) ? (
                                <Dash className={styles["MinusIcon"]} />
                              ) : (
                                <Plus className={styles["PlusIcon"]} />
                              )
                            }
                            aria-controls="panel1a-content"
                            className="TestAccordian position-relative"
                            // IconButtonProps={{
                            //   onClick: toggleAcordion,
                            // }}
                          >
                            <Row>
                              <Col lg={6} md={6} sm={12}>
                                <div
                                  className={
                                    styles["header-of-collapse-material"]
                                  }
                                >
                                  <span
                                    onClick={() =>
                                      viewNotesModal(data.pK_NotesID)
                                    }
                                  >
                                    {data.title}
                                  </span>
                                </div>
                              </Col>
                              <Col
                                lg={3}
                                md={3}
                                sm={12}
                                className="d-flex gap-3 align-items-center"
                              >
                                <span
                                  onClick={() =>
                                    ColorStarIcon(data.pK_NotesID, index)
                                  }
                                >
                                  {showStarIcon ? (
                                    <img
                                      src={StarIcon}
                                      width={15}
                                      className={
                                        styles["starIcon-In-Collapse-material"]
                                      }
                                    />
                                  ) : (
                                    <img
                                      src={hollowstar}
                                      width={15}
                                      className={
                                        styles["starIcon-In-Collapse-material"]
                                      }
                                    />
                                  )}
                                </span>
                                <img
                                  src={ClipIcon}
                                  width={14}
                                  className={
                                    styles["attachIcon-In-Collapse-material"]
                                  }
                                />
                                <span
                                  className={
                                    styles["collapse-text-attached-material"]
                                  }
                                >
                                  {moment(data.date, "YYYYMMDD").format(
                                    "Do MMM, YYYY"
                                  )}{" "}
                                  |{" "}
                                  {moment(data.date, "YYYYMMDD").format("dddd")}
                                </span>
                              </Col>

                              <Col
                                lg={3}
                                md={3}
                                sm={12}
                                className={`${"d-flex justify-content-end align-items-center"} ${
                                  styles["editIconBox"]
                                }`}
                              >
                                <img
                                  src={EditIcon}
                                  width={12}
                                  className={
                                    styles["editIcon-In-Collapse-material"]
                                  }
                                  onClick={() => editIconModal(data.pK_NotesID)}
                                />
                              </Col>
                            </Row>
                          </AccordionSummary>

                          <AccordionDetails key={index}>
                            <Row>
                              <Col
                                sm={12}
                                lg={12}
                                md={12}
                                className="todoModalCreateModal mt-2"
                              >
                                {data.notesAttachments.length > 0
                                  ? data.notesAttachments.map((file, index) => {
                                      console.log("file ", file);
                                      var ext = file.displayAttachmentName
                                        .split(".")
                                        .pop();
                                      const first =
                                        file.displayAttachmentName.split(
                                          " "
                                        )[0];

                                      return (
                                        <Col
                                          sm={12}
                                          lg={2}
                                          md={2}
                                          className={
                                            styles[
                                              "modaltodolist-attachment-icon"
                                            ]
                                          }
                                        >
                                          <FileIcon
                                            extension={ext}
                                            size={78}
                                            labelColor={"rgba(97,114,214,1)"}
                                          />

                                          <p className="modaltodolist-attachment-text">
                                            {first}
                                          </p>
                                        </Col>
                                      );
                                    })
                                  : null}
                              </Col>
                            </Row>
                          </AccordionDetails>
                        </Accordion>
                      </Col>
                    </Row>
                  );
                })
              : null}
          </Col>
        </Row>
        {/* Test Accordian Ends  */}
      </Container>
      {addNotes ? (
        <ModalAddNote
          addNewModal={addNotes}
          setAddNewModal={setAddNotes}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
        />
      ) : null}

      {updateShow ? (
        <ModalUpdateNote
          updateNotes={updateShow}
          setUpdateNotes={setUpdateShow}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
        />
      ) : null}

      {viewModalShow ? (
        <ModalViewNote
          viewNotes={viewModalShow}
          setViewNotes={setViewModalShow}
        />
      ) : null}
      {NotesReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default Notes;
