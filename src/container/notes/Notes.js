import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Notes.module.css";
import IconAttachment from "../../assets/images/Icon-Attachment.png";
import EditIcon from "../../assets/images/Edit-Icon.png";
import ModalViewNote from "../modalViewNote/ModalViewNote";
import ModalAddNote from "../modalAddNote/ModalAddNote";
import ModalUpdateNote from "../modalUpdateNote/ModalUpdateNote";
import { Collapse } from "antd";
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
const Notes = () => {
  const [editFlag, setEditFlag] = useState(false);
  //Test Accordian states start
  const [expand, setExpand] = useState(false);

  const { Panel } = Collapse;
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  // for modal Add notes
  const [addNotes, setAddNotes] = useState(false);
  const toggleAcordion = () => {
    setExpand((prev) => !prev);
  };
  // for modal Update notes
  const [updateShow, setUpdateShow] = useState(false);

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
  const editIconModal = async (e) => {
    setUpdateShow(true);
  };

  //for open View User Notes Modal
  const viewNotesModal = async (e) => {
    setViewModalShow(true);
  };

  return (
    <>
      <Container className={styles["notescontainer"]}>
        <Row className="mt-4">
          <Col md={2} sm={2} lg={2} className={styles["notes-heading-size"]}>
            Notes
          </Col>

          <Col lg={3} md={3} sm={3} className={styles["create-note-btn"]}>
            <Button
              className={"btn btn-primary"}
              variant={"Primary"}
              text=" + Create New Notes"
              onClick={modalAddUserModal}
            />
          </Col>
          <Col lg={7} md={7} sm={7}></Col>
        </Row>

        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <Collapse
              className={styles["collapse-border"]}
              expandIcon={({ isActive }) =>
                isActive ? (
                  <Dash
                    className={styles["plus"]}
                    size={24}
                    onClick={viewNotesModal}
                  />
                ) : (
                  <Plus
                    className={styles["plus"]}
                    size={24}
                    onClick={viewNotesModal}
                  />
                )
              }
              expandIconPosition={end}
            >
              <Panel
                collapsible="icon"
                className={styles["Notes-text-In-header"]}
                header={
                  <div className={styles["header-of-collapse"]}>
                    <p>
                      Need to find out how much time will be needed to complete
                      this project, and what how are you when you are getting
                      how are you doing Need to find out how much time will be
                      needed to complete this project, and what how are you when
                      you are getting how are you doing Need to find out how
                      much time will be needed to complete this project, and
                      what how are you when you are getting how are you doing
                      Need to find out how much time will be needed to complete
                      this project, and what how are you when you are getting
                      how are you doing Need to find out how much time will be
                      needed to complete this project, and what how are you when
                      you are getting how are you doing Need to find out how
                      much time will be needed to complete this project, and
                      what how are you when you are getting how are you doing
                    </p>
                  </div>
                }
                key="1"
                extra={
                  <>
                    <Row>
                      <Col lg={2} md={2} sm={12}>
                        <StarFill
                          width={12}
                          className={styles["starIcon-In-Collapse"]}
                        />
                      </Col>
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        width={12}
                        className={styles["attachIcon-In-Collapse"]}
                      >
                        <Paperclip />
                      </Col>

                      <Col lg={6} md={6} sm={12}>
                        <div className={styles["collapse-text-attached"]}>
                          09-DEC-22 | Yesterday
                        </div>
                      </Col>
                      <Col lg={2} md={2} sm={12}>
                        <img
                          src={EditIcon}
                          width={12}
                          className={styles["editIcon-In-Collapse"]}
                          onClick={editIconModal}
                          alt=""
                        />
                      </Col>
                    </Row>
                  </>
                }
              >
                {text}
              </Panel>
            </Collapse>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <Collapse
              className={styles["collapse-border"]}
              expandIcon={({ isActive }) =>
                isActive ? (
                  <Dash
                    className={styles["plus"]}
                    size={24}
                    onClick={viewNotesModal}
                  />
                ) : (
                  <Plus
                    className={styles["plus"]}
                    size={24}
                    onClick={viewNotesModal}
                  />
                )
              }
              expandIconPosition={end}
            >
              <Panel
                collapsible="icon"
                className={styles["Notes-text-In-header"]}
                header={
                  <div className={styles["header-of-collapse"]}>
                    <p>
                      Need to find out how much time will be needed to complete
                      this project, and what how are you when you are getting
                      how are you doing Need to find out how much time will be
                      needed to complete this project, and what how are you when
                      you are getting how are you doing
                    </p>
                  </div>
                }
                key="1"
                extra={
                  <>
                    <Row>
                      <Col lg={2} md={2} sm={12}>
                        <StarFill
                          width={12}
                          className={styles["starIcon-In-Collapse"]}
                        />
                      </Col>
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        width={12}
                        className={styles["attachIcon-In-Collapse"]}
                      >
                        <Paperclip />
                      </Col>

                      <Col lg={6} md={6} sm={12}>
                        <div className={styles["collapse-text-attached"]}>
                          09-DEC-22 | Yesterday
                        </div>
                      </Col>
                      <Col lg={2} md={2} sm={12}>
                        <img
                          src={EditIcon}
                          width={12}
                          className={styles["editIcon-In-Collapse"]}
                          onClick={editIconModal}
                          alt=""
                        />
                      </Col>
                    </Row>
                  </>
                }
              >
                {text}
              </Panel>
            </Collapse>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <Collapse
              className={styles["collapse-border"]}
              expandIcon={({ isActive }) =>
                isActive ? (
                  <Dash
                    className={styles["plus"]}
                    size={24}
                    onClick={viewNotesModal}
                  />
                ) : (
                  <Plus
                    className={styles["plus"]}
                    size={24}
                    onClick={viewNotesModal}
                  />
                )
              }
              expandIconPosition={end}
            >
              <Panel
                collapsible="icon"
                className={styles["Notes-text-In-header"]}
                header={
                  <div className={styles["header-of-collapse"]}>
                    <p>
                      Need to find out how much time will be needed to complete
                      this project, and what how are you when you are getting
                      how are you doing Need to find out how much time will be
                      needed to complete this project, and what how are you when
                      you are getting how are you doing
                    </p>
                  </div>
                }
                key="1"
                extra={
                  <>
                    <Row>
                      <Col lg={2} md={2} sm={12}>
                        <StarFill
                          width={12}
                          className={styles["starIcon-In-Collapse"]}
                        />
                      </Col>
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        width={12}
                        className={styles["attachIcon-In-Collapse"]}
                      >
                        <Paperclip />
                      </Col>

                      <Col lg={6} md={6} sm={12}>
                        <div className={styles["collapse-text-attached"]}>
                          09-DEC-22 | Yesterday
                        </div>
                      </Col>
                      <Col lg={2} md={2} sm={12}>
                        <img
                          src={EditIcon}
                          width={12}
                          className={styles["editIcon-In-Collapse"]}
                          onClick={editIconModal}
                          alt=""
                        />
                      </Col>
                    </Row>
                  </>
                }
              >
                {text}
              </Panel>
            </Collapse>
          </Col>
        </Row>
        {/* Test Accordian Body Starts  */}
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <div>
              <Accordion expanded={expand}>
                <AccordionSummary
                  expandIcon={expand ? <Dash /> : <Plus />}
                  aria-controls="panel1a-content"
                  className={styles["TestAccordian"]}
                  IconButtonProps={{
                    onClick: toggleAcordion,
                  }}
                >
                  <div className={styles["header-of-collapse-material"]}>
                    <p>
                      Need to find out how much time will be needed to complete
                      this project, and what how are you when you are getting
                      how are you doing Need to find out how much time will be
                      needed to complete this project, and what how are you when
                      you are getting how are you doing Need to find out how
                      much time will be needed to complete this project, and
                      what how are you when you are getting how are you doing
                      Need to find out how much time will be needed to complete
                      this project, and what how are you when you are getting
                      how are you doing Need to find out how much time will be
                      needed to complete this project, and what how are you when
                      you are getting how are you doing Need to find out how
                      much time will be needed to complete this project, and
                      what how are you when you are getting how are you doing
                    </p>
                  </div>

                  <Row>
                    <Col lg={2} md={2} sm={12}>
                      <StarFill
                        width={12}
                        className={styles["starIcon-In-Collapse-material"]}
                      />
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      width={12}
                      className={styles["attachIcon-In-Collapse-material"]}
                    >
                      <Paperclip />
                    </Col>

                    <Col lg={5} md={5} sm={12}>
                      <div
                        className={styles["collapse-text-attached-material"]}
                      >
                        09-DEC-22 | Yesterday
                      </div>
                    </Col>
                    <Col lg={1} md={1} sm={12}>
                      <img
                        src={EditIcon}
                        width={12}
                        className={styles["editIcon-In-Collapse-material"]}
                        onClick={editIconModal}
                        alt=""
                      />
                    </Col>
                  </Row>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography>Greetings of the day :)</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
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
    </>
  );
};

export default Notes;
