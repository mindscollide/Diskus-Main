import React, { useState, useRef, useEffect } from "react";
import styles from "./AddUser.module.css";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import { Spin } from "antd";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { validationEmail } from "../../../../commen/functions/validations";
import PhoneInput from "react-phone-input-2";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import VerticalBarGraph from "@chartiful/react-vertical-bar-graph";
// import { Bar } from "react-chartjs-2";
import "react-phone-input-2/lib/style.css";
import {
  Button,
  TextField,
  Notification,
  Paper,
  Modal,
} from "../../../../components/elements";
import { borderRadius } from "@mui/system";

const AddUser = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();
  const [errorBar, setErrorBar] = useState(false);
  const [allowLimitModal, setAllowedLimitModal] = useState(false);
  const [emailVerifyModal, setEmailVerifyModal] = useState(false);

  //for spinner in bar chart
  const [loading, setLoading] = useState(true);
  const [dataa, setDataa] = useState([]);

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
    Name: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Organization: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Designation: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    CountryCode: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    MobileNumber: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    OrganizationRole: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    UserRole: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
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
          Name: { value: valueCheck, errorMessage: "", errorStatus: false },
        });
      }
    } else if (name === "Name" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Name: { value: "", errorMessage: "", errorStatus: false },
      });
    }
    if (name === "Designation" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          Designation: {
            value: valueCheck,
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Designation" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Designation: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "MobileNumber" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          MobileNumber: {
            value: valueCheck,
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "MobileNumber" && value === "") {
      setAddUserSection({
        ...addUserSection,
        MobileNumber: { value: "", errorMessage: "", errorStatus: false },
      });
    }
    if (name === "Email" && value !== "") {
      console.log("valuevalueemailvaluevalueemail", value);
      if (value !== "") {
        setAddUserSection({
          ...addUserSection,
          Email: {
            value: value,
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Email" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: true,
        },
      });
    }
  };

  const handleClick = () => {
    if (
      addUserSection.Name.value !== "" &&
      addUserSection.Organization !== "" &&
      addUserSection.Designation.value !== "" &&
      addUserSection.MobileNumber.value !== "" &&
      addUserSection.OrganizationRole.value !== "" &&
      addUserSection.UserRole.value !== "" &&
      addUserSection.Email.value !== ""
    ) {
      if (validationEmail(addUserSection.Email.value) === true) {
        // navigate("/Diskus/Admin/CustomerInformation");
      } else {
        setOpen({
          ...open,
          open: true,
          message: t("Email-should-be-in-Email-Format"),
        });
      }
    } else {
      setAddUserSection({
        ...addUserSection,
        Name: {
          value: addUserSection.Name.value,
          errorMessage: "Name is required",
          errorStatus: true,
        },
        Designation: {
          value: addUserSection.Designation.value,
          errorMessage: "Desgination is required",
          errorStatus: true,
        },
        MobileNumber: {
          value: addUserSection.MobileNumber.value,
          errorMessage: "Mobile Number is required",
          errorStatus: true,
        },
        Email: {
          value: addUserSection.Email.value,
          errorMessage: "Email is required",
          errorStatus: true,
        },
      });
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
    // setEmailVerifyModal(true);
  };

  // for Reset Button modal
  const resetModalHandler = async () => {
    setAllowedLimitModal(true);
  };

  // data for react google bar chart
  const data = [
    ["Element", "Users", { role: "style" }, { role: "annotation" }],
    [
      "Enabled Users",
      4,
      "stroke-color: #ccc; stroke-opacity: 0.8 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
      "04",
    ], // RGB value
    [
      "Disabled Users",
      1,
      "stroke-color: #ccc; stroke-opacity: 0.8 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
      "01",
    ], // English color name
    [
      "Locked Users",
      2,
      "stroke-color: #ccc; stroke-opacity: 0.6 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
      "02",
    ],
    [
      "Dormant Users",
      3,
      "stroke-color: #ccc; stroke-opacity: 0.6 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
      "03",
    ], // CSS-style declaration
  ];

  //for remove the grid from backgroun
  const options = {
    backgroundColor: "transparent",
    border: "1px solid #ffffff",
    strokeWidth: "10px",
    hAxis: {
      viewWindow: {
        min: 0, // for space horizontally between bar
        max: 4, // for space horizontally between bar
      },
      textStyle: {
        color: "#000000", // this will change the color of the text to white
        fontSize: 12, // this will change the font size of the text to 12px
      },
    },

    vAxis: {
      viewWindow: {
        min: 0, // for space vertically between bar
        max: 5, // for space vertically between bar
      },
      textPosition: "none",
      gridlines: {
        count: 0,
        background: "transparent",
      },
    },

    bar: {
      groupWidth: "95%",
    },
    radius: {
      rx: "10px",
    },
  };
  // for spinner in bar chart
  useEffect(() => {
    async function fetchData() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDataa(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Container>
        {/* <Paper className={styles["papercolor-adduser"]}> */}
        <Row>
          <Col lg={6} md={6} sm={12} xs={12} className="mt-4">
            <Container>
              <>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="mt-2">
                    <label className={styles["addUser-Heading"]}>
                      Add User
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col lg={9} md={9} sm={12} xs={12} className="mt-2">
                    <div className={styles["chartbarBorder-adduser"]}>
                      {loading ? (
                        <div>
                          <Row className="mt-5 mb-5">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              xs={12}
                              className="d-flex justify-content-end ms-4 mt-5 mb-5"
                            >
                              <Spin />
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <Chart
                          chartType="ColumnChart"
                          width="100%"
                          height="300px"
                          radius={10}
                          data={data}
                          options={options}
                        />
                      )}

                      <Row className="d-flex justify-content-center">
                        <Col lg={8} md={8} sm={8} xs={12}>
                          <ProgressBar
                            now={10}
                            max={10}
                            className={styles["AddProgressBar"]}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          lg={8}
                          md={8}
                          sm={8}
                          xs={12}
                          className="d-flex justify-content-center"
                        >
                          <label className={styles["Total-labelChart-Title"]}>
                            Total Allowed Users
                          </label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                          <label className={styles["labelChart-Number"]}>
                            10
                          </label>
                        </Col>
                        <div className={styles["borderLine-title"]} />
                      </Row>

                      <Row>
                        <Col
                          lg={8}
                          md={8}
                          sm={8}
                          xs={12}
                          className="d-flex justify-content-center"
                        >
                          <label className={styles["labelChart-Title"]}>
                            Board Members
                          </label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                          <label className={styles["labelChart-Number"]}>
                            4 / 10
                          </label>
                        </Col>
                        <div className={styles["borderLine-title"]} />
                      </Row>

                      <Row>
                        <Col
                          lg={8}
                          md={8}
                          sm={8}
                          xs={12}
                          className="d-flex justify-content-center"
                        >
                          <label className={styles["Admin-labelChart-Title"]}>
                            Admin Members
                          </label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                          <label className={styles["Admin-labelChart-Number"]}>
                            7 / 10
                          </label>
                        </Col>
                        <div className={styles["borderLine-title"]} />
                      </Row>

                      <Row>
                        <Col
                          lg={8}
                          md={8}
                          sm={8}
                          xs={12}
                          className="d-flex justify-content-center"
                        >
                          <label className={styles["labelChart-Remain-Title"]}>
                            Executive Members
                          </label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                          <label className={styles["labelChart-RemainNum"]}>
                            00
                          </label>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={3} md={3} sm={12} xs={12} />
                </Row>
              </>
            </Container>
          </Col>

          <Col lg={6} md={6} sm={12} xs={12} className="ms-auto">
            {/* <Form> */}
            <Container className="mt-5">
              <>
                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel1"]}>
                      {t("Name")}
                    </label>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row>
                      <Col sm={12} md={12} lg={12}>
                        <Form.Control
                          className={styles["formcontrol-name-fieldssss"]}
                          ref={Name}
                          onKeyDown={(event) =>
                            enterKeyHandler(event, Designation)
                          }
                          name="Name"
                          placeholder={t("Name")}
                          maxLength={200}
                          applyClass="form-control2"
                          onChange={AddUserHandler}
                          value={addUserSection.Name.value}
                        />
                      </Col>
                      <Col sm={12} md={12} lg={12}>
                        <p
                          className={
                            addUserSection.Name.errorStatus &&
                            addUserSection.Name.value === ""
                              ? ` ${styles["errorMessage"]} `
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {addUserSection.Name.errorMessage}
                        </p>{" "}
                      </Col>
                    </Row>
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
                      value={addUserSection.Organization.value}
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
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row>
                      <Col sm={12} md={12} lg={12}>
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
                          value={addUserSection.Designation.value}
                        />
                      </Col>
                      <Col sm={12} md={12} lg={12}>
                        <p
                          className={
                            addUserSection.Designation.errorStatus &&
                            addUserSection.Designation.value === ""
                              ? ` ${styles["errorMessage"]} `
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {addUserSection.Designation.errorMessage}
                        </p>
                      </Col>
                    </Row>
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
                    <label className={styles["addUserlabel4"]}>
                      {t("Mobile")}
                    </label>
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
                      value={addUserSection.MobileNumber.value}
                      name="MobileNumber"
                      countryCodeEditable={false}
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
                    <label className={styles["addUserlabel6"]}>
                      {t("User-Role")}
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
                    <label className={styles["addUserlabel7"]}>
                      {t("Email")}
                    </label>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row>
                      <Col sm={12} md={12} lg={12}>
                        <Form.Control
                          className={styles["formcontrol-name-fieldssss"]}
                          name="Email"
                          ref={Email}
                          placeholder="Email"
                          onChange={AddUserHandler}
                          value={addUserSection.Email.value}
                          onKeyDown={(event) => enterKeyHandler(event, Name)}
                          maxLength={160}
                          applyClass="form-control2"
                        />
                      </Col>
                      <Col sm={12} md={12} lg={12}>
                        <p
                          className={
                            addUserSection.Email.errorStatus &&
                            addUserSection.Email.value === ""
                              ? ` ${styles["errorMessage"]} `
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {addUserSection.Email.errorMessage}
                        </p>
                      </Col>
                    </Row>
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
                      className={styles["add-User-Reset-btn"]}
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
                      onClick={handleClick}
                      className={styles["Add-User-btnReset"]}
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
                          <Row className="mt-2">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <ExclamationTriangleFill size={50} />
                            </Col>
                          </Row>
                          <Row>
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
