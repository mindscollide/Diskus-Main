import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
} from "../../components/elements";
import { PlusSquareFill, Star } from "react-bootstrap-icons";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./ModalViewNote.module.css";
import Form from "react-bootstrap/Form";
// import { countryName } from "../../AllUsers/AddUser/CountryJson";

const ModalViewNote = ({ ModalTitle, viewNotes, setViewNotes }) => {
  //For Localization
  const [isUpdateNote, setIsUpdateNote] = useState(true);
  const [isDeleteNote, setIsDeleteNote] = useState(false);

  const deleteNoteModalHandler = async () => {
    setIsUpdateNote(false);
    setIsDeleteNote(true);
  };

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  return (
    <>
      <Container>
        <Modal
          show={viewNotes}
          onHide={() => {
            setViewNotes(false);
          }}
          modalHeaderClassName={styles["header-modal-close-btn"]}
          setShow={setViewNotes}
          ButtonTitle={ModalTitle}
          centered
          //   modalFooterClassName={styles["modal-userprofile-footer"]}
          size={isUpdateNote === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <p className={styles["Viewnote-heading"]}>View Note</p>
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
                  <Col lg={6} md={6} sm={6} xs={12}></Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <p className={styles["date-updatenote"]}>
                      Last modified On: 09-Dec-22 | 03:30pm
                    </p>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}></Col>
                </Row>

                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <p className={styles["modal-View-title"]}>
                      Meeting with Mr. Yaqoob regarding Axis
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <p className={styles["modal-view-discription"]}>
                      1 : Discussion on Project Timelines and Milestones <br />
                      2: Identified Key Risks <br />
                      3: Mr.Yaqoob shared the attached documents and asked for
                      feedback <br />
                    </p>
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <p className={styles["modal-update-attachment-heading"]}>
                      Attachement
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <PlusSquareFill size={23} />
                  </Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mb-5">
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    variant={"Primary"}
                    text="Close"
                    className={styles["close-note-modal-btn"]}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalViewNote;
