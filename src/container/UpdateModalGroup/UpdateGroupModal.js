import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
  SelectBox,
} from "../../components/elements";

import { Row, Col, Container } from "react-bootstrap";
import styles from "./UpdateGroupModal.module.css";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";

const UpdateGroupModal = ({ ModalTitle, updateGroup, setUpadategroup }) => {
  const [updatemGroup, setUpdatemGroup] = useState(true);
  const [isdetailsbtn, setIsdetailsbtn] = useState(true);
  const [isMembers, setIsMembers] = useState(true);

  const changetoMembers = () => {
    setIsMembers(true);
    setIsdetailsbtn(false);
  };

  const changetodetails = () => {
    setIsMembers(false);
    setIsdetailsbtn(true);
  };

  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Modal
          show={updateGroup}
          onHide={() => {
            setUpadategroup(false);
          }}
          setShow={setUpadategroup}
          ButtonTitle={ModalTitle}
          centered
          size={updatemGroup === true ? "md" : "md"}
          ModalBody={
            <>
              <Container className=" color-5a5a5a">
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start "
                  >
                    <p className={styles["Update-Group-Heading"]}>
                      Update Group
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={6} sm={6} className="d-flex gap-3">
                    <Button
                      className={
                        "btn btn-outline-primary isAgenda-Schedule-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Details")}
                      onClick={changetodetails}
                    />
                    <Button
                      className={
                        "btn btn-outline-primary isAgenda-Schedule-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Members")}
                      onClick={changetoMembers}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={2} xs={12}></Col>
                  {isMembers ? null : (
                    <>
                      <Col
                        lg={4}
                        md={4}
                        sm={5}
                        xs={12}
                        className="CreateMeetingReminder "
                      >
                        <SelectBox
                          name="MeetingReminderID"
                          placeholder={t("Management")}
                          className="MeetingReminder"
                          required
                        />
                      </Col>
                    </>
                  )}
                </Row>
                {isdetailsbtn ? (
                  <>
                    <Row className="mt-1">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="CreateMeetingInput"
                      >
                        <TextField
                          applyClass="form-control2"
                          type="text"
                          placeholder={t("Task-title")}
                          required={true}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="CreateMeetingInput textAreaDiv"
                      >
                        <TextField
                          applyClass="form-control2 createmeetingtextarea"
                          type="text"
                          as={"textarea"}
                          rows="7"
                          placeholder={t("Description")}
                          required={true}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col lg={12} md={12} sm={12}></Col>
                    </Row>
                    <Row className="mt-5">
                      <Col lg={6} md={6} sm={6}>
                        <Form>
                          {["checkbox"].map((type) => (
                            <div key={`default-${type}`} className="mb-3">
                              <Form.Check
                                type={type}
                                id={`default-${type}`}
                                label={"Create Talk Group"}
                              />
                            </div>
                          ))}
                        </Form>
                      </Col>
                      <Col lg={3} md={3} sm={3}></Col>
                      <Col lg={3} md={3} sm={3}>
                        <Button
                          className={styles["UpdateGroup-Modal-btn"]}
                          text="Next"
                        />
                      </Col>
                    </Row>
                  </>
                ) : isMembers ? (
                  <>
                    <Row className="mt-4">
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        className="CreateMeetingReminder "
                      >
                        <SelectBox
                          name="MeetingReminderID"
                          placeholder={t("Select Members")}
                          className="MeetingReminder"
                          required
                        />
                      </Col>
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
                        xs={12}
                        className="CreateMeetingReminder "
                      >
                        <SelectBox
                          name="MeetingReminderID"
                          placeholder={t("Group Head")}
                          className="MeetingReminder"
                          required
                        />
                      </Col>
                      <Col lg={2} md={2} sm={2}>
                        <Button
                          className={
                            "btn btn-outline-primary isAgenda-Schedule-top-btn-Outline"
                          }
                          variant={"Primary"}
                          text={t("Add")}
                        />
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Container>
            </>
          }
          ModalFooter={<></>}
        />
      </Container>
    </>
  );
};

export default UpdateGroupModal;
