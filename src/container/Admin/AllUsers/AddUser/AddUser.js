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
      // addUserSection.MobileNumber !== "" &&
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
      groupWidth: "87%",
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

  // const config1 = {
  //   hasXAxisBackgroundLines: false,
  //   hasYAxisBackgroundLines: false,
  //   yAxisLabelStyle: {
  //     fontFamily: "system-ui, sans-serif",
  //   },
  //   xAxisLabelStyle: {
  //     position: "left",
  //     prefix: "$ ",
  //     fontFamily: "system-ui, sans-serif",
  //     fontSize: 4,
  //     paddingLeft: 4,
  //   },
  //   xAxisBackgroundLineStyle: {
  //     strokeWidth: 2,
  //     color: "red",
  //   },
  // };

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
                              sm={12}
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

                      <ProgressBar
                        now={10}
                        max={10}
                        className={styles["AddProgressBar"]}
                      />
                      <label className={styles["labelChart-Title"]}>
                        Total Allowed Users
                      </label>
                      <label className={styles["labelChart-Number"]}>10</label>
                      <div className={styles["borderLine-title"]} />

                      <label className={styles["labelChart-Title"]}>
                        Board Members
                      </label>
                      <label className={styles["labelChart-Number"]}>
                        4 / 10
                      </label>
                      <div className={styles["borderLine-title"]} />

                      <label className={styles["labelChart-Title"]}>
                        Admin Members
                      </label>
                      <label className={styles["Admin-labelChart-Number"]}>
                        7 / 10
                      </label>
                      <div className={styles["borderLine-title"]} />

                      <label className={styles["labelChart-Title"]}>
                        Executive Members
                      </label>
                      <label className={styles["Executive-labelChart-Number"]}>
                        5 / 10
                      </label>
                      <div className={styles["borderLine-title"]} />

                      <label className={styles["labelChart-Remain-Title"]}>
                        Remaining Users
                      </label>
                      <label className={styles["labelChart-RemainNum"]}>
                        00
                      </label>
                    </div>
                  </Col>
                  <Col lg={3} md={3} sm={12} xs={12} />
                </Row>
              </>
              {/* <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <div>
                    <VerticalBarGraph
                      data={[2, 8, 5, 4]}
                      labels={[
                        "Enabled User",
                        "Disabled User",
                        "Locked User",
                        "Dorment User",
                      ]}
                      width={450}
                      height={300}
                      barRadius={5}
                      barWidthPercentage={0.5}
                      barColor="#000000"
                      baseConfig={config1}
                      style={{
                        fontSize: 6,
                        marginBottom: 30,
                        padding: 10,
                        // border: "1px solid #000000",
                        // paddingTop: 20,
                        // borderRadius: 20,
                        // backgroundColor: `violet`
                        
                      }}
                    />

                    <ProgressBar
                      now={4}
                      max={10}
                      className={styles["AddProgressBar"]}
                    />
                    <Row>
                      <Col lg={11} md={11} sm={12} xs={12}>
                        <label>Total Allowed User</label>
                      </Col>
                      <Col lg={1} md={1} sm={12} xs={12}>
                        <label>10</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={11} md={11} sm={12} xs={12}>
                        <label>Remaining Users</label>
                      </Col>
                      <Col lg={1} md={1} sm={12} xs={12}>
                        <label>0</label>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row> */}

              {/* <>
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
              </> */}
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
                      value={addUserSection.MobileNumber}
                      name="MobileNumber"
                      countryCodeEditable={false}
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
                      placeholder="Email"
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
                      onClick={() => {
                        createModalHandler();
                        emailHandler();
                      }}
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
