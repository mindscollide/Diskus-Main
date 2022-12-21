import React, { useState } from "react";
import styles from "./AddUser.module.css";
import { Container, Row, Col, Form, Card, ListGroup } from "react-bootstrap";
import Select from "react-select";
import { validationEmail } from "../../../../commen/functions/validations";
import {
  Button,
  TextField,
  Paper,
  Modal,
} from "../../../../components/elements";

const AddUser = ({ show, setShow, ModalTitle }) => {
  const [allowLimitModal, setAllowedLimitModal] = useState(false);
  const [emailVerifyModal, setEmailVerifyModal] = useState(false);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  // states for Adduser card
  const [addUserCardSection, setAddUserCardSection] = useState({
    TotalAllowedUser: "",
    EnableUser: "",
    DisableUser: "",
    LockedUser: "",
    DormantUser: "",
  });

  // states for Adduser Fields Section
  const [addUserSection, setAddUserSection] = useState({
    Name: "",
    Organization: "",
    Designation: "",
    CountryCode: "",
    MobileNumber: "",
    OrganizationRole: "",
    UserRole: "",
    Email: "",
  });

  const AddUserHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Name" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          Name: valueCheck,
        });
      }
    } else if (name === "Name" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Name: "",
      });
    }

    if (name === "Designation" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          Designation: valueCheck,
        });
      }
    } else if (name === "Designation" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Designation: "",
      });
    }

    if (name === "MobileNumber" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          MobileNumber: valueCheck,
        });
      }
    } else if (name === "MobileNumber" && value === "") {
      setAddUserSection({
        ...addUserSection,
        MobileNumber: "",
      });
    }

    if (name === "Email" && value !== "") {
      console.log("valuevalueemailvaluevalueemail", value);
      // let valueCheck = value.replace(/[^\d]/g, "");
      // if (valueCheck !== "") {
      setAddUserSection({
        ...addUserSection,
        Email: value,
      });
      // }
    } else if (name === "Email" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Email: "",
      });
    }
  };

  const emailHandler = () => {
    if (addUserSection.Email !== "") {
      if (validationEmail(addUserSection.Email) === true) {
        // navigate("/packageselection");
      } else {
        setOpen({
          ...open,
          open: true,
          message: "Email should be in Email Format",
        });
      }
    }
  };

  // for OK button IN Create modal
  const okCreateHandler = () => {
    setEmailVerifyModal(false);
  };

  //for OK button IN AllowLimit modal
  const okResetHandler = () => {
    setAllowedLimitModal(false);
  };

  // for Create Button modal
  const createModalHandler = async () => {
    setEmailVerifyModal(true);
  };

  // for Reset Button modal
  const resetModalHandler = async () => {
    setAllowedLimitModal(true);
  };

  return (
    <>
      <Container>
        {/* <Paper className={styles["papercolor-adduser"]}> */}
        <Row>
          <Col sm={6} className="ml-auto">
            <Container>
              <>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Card className={styles["card-width-Background"]}>
                      <Card.Header className={styles["card-header-adduser"]}>
                        Add User
                      </Card.Header>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={12}>
                    <Card className={styles["card-listgroup-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        Total Allowed Users
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col lg={6} md={6} sm={12}>
                    <label className={styles["label-addUser"]}>10</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={12}>
                    <Card className={styles["card-enabled-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        Enabled Users
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col lg={6} md={6} sm={12}>
                    <label className={styles["label-others"]}>02</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={12}>
                    <Card className={styles["card-disable-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        Disabled Users
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col lg={6} md={6} sm={12}>
                    <label className={styles["label-others"]}>03</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={12}>
                    <Card className={styles["card-locked-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        Locked Users
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col lg={6} md={6} sm={12}>
                    <label className={styles["label-others"]}>02</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={12}>
                    <Card className={styles["card-dorment-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        Dorment Users
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col lg={6} md={6} sm={12}>
                    <label className={styles["label-others"]}>03</label>
                  </Col>
                </Row>
              </>
            </Container>
          </Col>

          <Col sm={6} className="ms-auto">
            {/* <Form> */}
            <Container className="mt-5">
              {/* <>
                  <legend className={styles["adduser_legend"]}>Add Users</legend>
                  <Row className="mt-4">
                    <Col sm={12} lg={4} md={4}>
                      <TextField
                        placeholder="Name"
                        change={AddUserHandler}
                        maxLength={200}
                        name="Name"
                        value={addUserSection.Name || ""}
                        applyClass="form-control2"
                      />
                    </Col>

                    <Col sm={12} lg={4} md={4}>
                      <TextField
                        placeholder="Organization"
                        applyClass="form-control2"
                      />
                    </Col>

                    <Col sm={12} lg={4} md={4}>
                      <TextField
                        placeholder="Designation"
                        maxLength={200}
                        applyClass="form-control2"
                        change={AddUserHandler}
                        name="Designation"
                        value={addUserSection.Designation || ""}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={12} md={6} lg={6}>
                      <TextField
                        placeholder="Country Code"
                        applyClass="form-control2"
                      />
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                      <TextField
                        maxLength={50}
                        placeholder="Mobile #"
                        applyClass="form-control2"
                        change={AddUserHandler}
                        name="MobileNumber"
                        value={addUserSection.MobileNumber || ""}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={4} md={4} sm={12}>
                      <Form.Control
                        as="select"
                        applyClass="form-control2"
                        className={styles["selectBox-AddUser"]}
                      >
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                      </Form.Control>
                    </Col>

                    <Col lg={4} md={4} sm={12}>
                      <Form.Control
                        as="select"
                        applyClass="form-control2"
                        className={styles["selectBox-AddUser"]}
                      >
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                      </Form.Control>
                    </Col>

                    <Col lg={4} md={4} sm={12}>
                      <TextField
                        maxLength={160}
                        placeholder="Email"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>
                </> */}

              <>
                <Row>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel1"]}>Name</label>
                  </Col>

                  <Col lg={3} md={3} sm={12}></Col>

                  <Col lg={6} md={6} sm={12}>
                    <TextField
                      name="Name"
                      placeholder="Name"
                      maxLength={200}
                      applyClass="form-control2"
                      change={AddUserHandler}
                      value={addUserSection.Name}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel2"]}>
                      Organization
                    </label>
                  </Col>

                  <Col lg={3} md={3} sm={12}></Col>

                  <Col lg={6} md={6} sm={12}>
                    <TextField
                      placeholder="Organization"
                      applyClass="form-control2"
                      disable
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel3"]}>
                      Designation
                    </label>
                  </Col>

                  <Col lg={3} md={3} sm={12}></Col>

                  <Col lg={6} md={6} sm={12}>
                    <TextField
                      name="Designation"
                      placeholder="Designation"
                      maxLength={200}
                      applyClass="form-control2"
                      change={AddUserHandler}
                      value={addUserSection.Designation}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel4"]}>Mobile</label>
                  </Col>

                  <Col lg={3} md={3} sm={12}></Col>

                  <Col lg={6} md={6} sm={12}>
                    <TextField
                      name="MobileNumber"
                      placeholder="Enter Phone Number"
                      maxLength={50}
                      applyClass="form-control2"
                      change={AddUserHandler}
                      value={addUserSection.MobileNumber}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel5"]}>
                      Organization Role
                    </label>
                  </Col>

                  <Col lg={3} md={3} sm={12}></Col>

                  <Col lg={6} md={6} sm={12}>
                    <Select
                      placeholder="Please Select One Option"
                      className={styles["selectbox-height-organization"]}
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel6"]}>User Role</label>
                  </Col>

                  <Col lg={3} md={3} sm={12}></Col>

                  <Col lg={6} md={6} sm={12}>
                    <Select
                      placeholder="Please Select One Option"
                      className={styles["selectbox-height-organization"]}
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel7"]}>Email</label>
                  </Col>

                  <Col lg={3} md={3} sm={12}></Col>

                  <Col lg={6} md={6} sm={12}>
                    <TextField maxLength={160} applyClass="form-control2" />
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      onClick={resetModalHandler}
                      className={styles["btnReset"]}
                      text="Reset"
                    ></Button>
                  </Col>

                  <Col lg={6} md={6} sm={12}></Col>
                  <Col lg={3} md={3} sm={12}>
                    <Button
                      onClick={createModalHandler}
                      className={styles["btnCreate"]}
                      text="Create"
                    ></Button>
                  </Col>
                </Row>

                <Modal
                  show={emailVerifyModal || allowLimitModal}
                  setShow={() => {
                    setAllowedLimitModal();
                    setEmailVerifyModal();
                  }}
                  ButtonTitle={ModalTitle}
                  centered
                  size={emailVerifyModal && allowLimitModal === "sm"}
                  ModalBody={
                    <>
                      {emailVerifyModal ? (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <p
                                className={
                                  styles["verification-email-modal-title"]
                                }
                              >
                                Verification Email Sent!
                              </p>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <p
                                className={
                                  styles["verification-email-modal-paragraph"]
                                }
                              >
                                Please Check Your Inbox. Email send to:
                              </p>
                            </Col>
                          </Row>

                          <Row>
                            <Col lg={5} md={5} sm={12} />
                            <Col lg={2} md={2} sm={12}>
                              <Button
                                className={styles["Ok-modal-btn"]}
                                text="Ok"
                                onClick={okCreateHandler}
                              />
                            </Col>
                            <Col lg={5} md={5} sm={12} />
                          </Row>
                        </>
                      ) : allowLimitModal ? (
                        <>
                          <Row className="mt-4">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <p className={styles["allow-limit-modal-title"]}>
                                You have reached the allowed Limit
                              </p>
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col lg={5} md={5} sm={12} />
                            <Col lg={2} md={2} sm={12}>
                              <Button
                                className={styles["Ok-modal-btn"]}
                                text="Ok"
                                onClick={okResetHandler}
                              />
                            </Col>
                            <Col lg={5} md={5} sm={12} />
                          </Row>
                        </>
                      ) : null}
                    </>
                  }
                />
              </>
            </Container>
            {/* </Form> */}
          </Col>
        </Row>
        {/* </Paper> */}
      </Container>
    </>
  );
};

export default AddUser;
