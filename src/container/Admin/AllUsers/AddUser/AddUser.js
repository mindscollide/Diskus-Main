import React, { useState, useRef } from "react";
import styles from "./AddUser.module.css";
import { Container, Row, Col, Form, Card, ListGroup } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { validationEmail } from "../../../../commen/functions/validations";
import PhoneInput from "react-phone-input-2";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import "react-phone-input-2/lib/style.css";
import {
  Button,
  TextField,
  Notification,
  Paper,
  Modal,
} from "../../../../components/elements";

const AddUser = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();

  const [allowLimitModal, setAllowedLimitModal] = useState(false);
  const [emailVerifyModal, setEmailVerifyModal] = useState(false);

  const navigate = useNavigate();
  //For Enter Key
  const Name = useRef(null);
  const Organization = useRef(null);
  const Designation = useRef(null);
  const MobileNumber = useRef(null);
  const OrganizationRole = useRef(null);
  const UserRole = useRef(null);
  const Email = useRef(null);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const handleSelect = (country) => {
    setSelectedCountry(country);
  };

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

  // Enter key handler
  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  //Validate Handler
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
      setAddUserSection({
        ...addUserSection,
        Email: value,
      });
    } else if (name === "Email" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Email: "",
      });
    }
  };

  const emailHandler = () => {
    if (
      addUserSection.Name !== "" &&
      // addUserSection.Organization !== "" &&
      addUserSection.Designation !== "" &&
      addUserSection.MobileNumber !== "" &&
      // addUserSection.OrganizationRole !== "" &&
      // addUserSection.UserRole !== "" &&
      addUserSection.Email !== ""
    ) {
      if (validationEmail(addUserSection.Email) === true) {
        // navigate("/Diskus/Admin/CustomerInformation");
      } else {
        setOpen({
          ...open,
          open: true,
          message: t("Email-should-be-in-Email-Format"),
        });
      }
    } else {
      setOpen({
        ...open,
        open: true,
        message: t("Please-fill-fields"),
      });
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
          <Col lg={6} md={6} sm={12} xs={12} className="ml-auto">
            <Container>
              <>
                <Row>
                  <Col lg={12} md={12} xs={12}>
                    <Card className={styles["card-width-Background"]}>
                      <Card.Header className={styles["card-header-adduser"]}>
                        {t("Add-User")}
                      </Card.Header>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card className={styles["card-listgroup-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        {t("Total-Allowed-Users")}
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["label-addUser"]}>10</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card className={styles["card-enabled-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        {t("Enabled-Users")}
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["label-others"]}>02</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card className={styles["card-disable-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        {t("Disabled-Users")}
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["label-others"]}>03</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card className={styles["card-locked-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        {t("Locked-Users")}
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["label-others"]}>02</label>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card className={styles["card-dorment-user"]}>
                      <ListGroup.Item className={styles["card-texts"]}>
                        {t("Dorment-Users")}
                      </ListGroup.Item>
                    </Card>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["label-others"]}>03</label>
                  </Col>
                </Row>
              </>
            </Container>
          </Col>

          <Col lg={6} md={6} sm={12} xs={12} className="ms-auto">
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
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel1"]}>{t("Name")}</label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      ref={Name}
                      onKeyDown={(event) => enterKeyHandler(event, Designation)}
                      name="Name"
                      placeholder={t("Name")}
                      maxLength={200}
                      applyClass="form-control2"
                      onChange={AddUserHandler}
                      value={addUserSection.Name}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel2"]}>
                      {t("Organization")}
                    </label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      ref={Organization}
                      onKeyDown={(event) => enterKeyHandler(event, Designation)}
                      placeholder={t("Organization")}
                      applyClass="form-control2"
                      disabled
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel3"]}>
                      {t("Designation")}
                    </label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      ref={Designation}
                      onKeyDown={(event) =>
                        enterKeyHandler(event, OrganizationRole)
                      }
                      name="Designation"
                      placeholder={t("Designation")}
                      maxLength={200}
                      applyClass="form-control2"
                      onChange={AddUserHandler}
                      value={addUserSection.Designation}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel4"]}>{t("Mobile")}</label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    {/* <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      ref={MobileNumber}
                      onKeyDown={(event) =>
                        enterKeyHandler(event, OrganizationRole)
                      }
                      name="MobileNumber"
                      placeholder="Enter Phone Number"
                      maxLength={50}
                      applyClass="form-control2"
                      onChange={AddUserHandler}
                      value={addUserSection.MobileNumber}
                    /> */}
                    <PhoneInput
                      ref={MobileNumber}
                      onKeyDown={(event) =>
                        enterKeyHandler(event, OrganizationRole)
                      }
                      className={styles["formcontrol-Phone-field"]}
                      maxLength={10}
                      placeholder={t("Enter-Phone-Number")}
                      change={AddUserHandler}
                      value={addUserSection.MobileNumber}
                      name="MobileNumber"
                      // onSelect={handleSelect}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel5"]}>
                      {t("Organization-Role")}
                    </label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Select
                      ref={OrganizationRole}
                      onKeyDown={(event) => enterKeyHandler(event, UserRole)}
                      placeholder={t("Please-Select-One-Option")}
                      className={styles["selectbox-height-organization"]}
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel6"]}>{t("User-Role")}</label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Select
                      ref={UserRole}
                      onKeyDown={(event) => enterKeyHandler(event, Email)}
                      placeholder={t("Please-Select-One-Option")}
                      className={styles["selectbox-height-organization"]}
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel7"]}>{t("Email")}</label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      name="Email"
                      ref={Email}
                      onChange={AddUserHandler}
                      value={addUserSection.Email}
                      onKeyDown={(event) => enterKeyHandler(event, Name)}
                      maxLength={160}
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      onClick={resetModalHandler}
                      className={styles["btnReset"]}
                      text={t("Reset")}
                    ></Button>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      onClick={() => {
                        createModalHandler();
                        emailHandler();
                      }}
                      className={styles["btnReset"]}
                      text={t("Create")}
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
                                {t("Verification-Email-Sent")}
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
                                {t("Please-Check-Inbox")}
                              </p>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className="d-flex justify-content-center"
                            >
                              <Button
                                className={styles["Ok-modal-btn"]}
                                text={t("Ok-Title")}
                                onClick={okCreateHandler}
                              />
                            </Col>
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
                                {t("Allowed-Limit-Reached")}
                              </p>
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className="d-flex justify-content-center"
                            >
                              <Button
                                className={styles["Ok-modal-btn"]}
                                text={t("Ok-Title")}
                                onClick={okResetHandler}
                              />
                            </Col>
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
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default AddUser;
