import React, { useState, useRef } from "react";
import "./CustomerInformation.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  TextField,
  Paper,
  Modal,
} from "../../../../components/elements";
import styles from "./CustomerInformation.module.css";
import CountryDropdown from "country-dropdown-with-flags-for-react";
import ErrorBar from "../../../authentication/sign_up/errorbar/ErrorBar";
import Title from "antd/lib/skeleton/Title";

const CustomerInformation = ({ show, setShow, ModalTitle }) => {
  // const ContactEmail = useRef(null);

  const [isUpdateButton, setIsUpdateButton] = useState(false);
  const [customerSection, setCustomerSection] = useState({
    Name: "",
    CountryDropdown: "",
    Address1: "",
    Address2: "",
    State: "",
    City: "",
    ZipCode: "",
    ContactName: "",
    ContactEmail: "",
    Number: "",
    ReferrenceNumber: "",
  });

  const customerInfoHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Name" && value !== "") {
      setCustomerSection({
        ...customerSection,
        Name: "",
      });
    } else if (name === "Name" && value === "") {
      setCustomerSection({
        ...customerSection,
        Name: "",
      });
    }

    if (name === "Address1" && value !== "") {
      let valueCheck = value.replace(/[^0-9a-z]/gi, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          Address1: valueCheck,
        });
      }
    } else if (name === "Address1" && value === "") {
      setCustomerSection({
        ...customerSection,
        Address1: "",
      });
    }

    if (name === "Address2" && value !== "") {
      let valueCheck = value.replace(/[^0-9a-z]/gi, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          Address2: valueCheck,
        });
      }
    } else if (name === "Address2" && value === "") {
      setCustomerSection({
        ...customerSection,
        Address2: "",
      });
    }

    if (name === "State" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          State: valueCheck,
        });
      }
    } else if (name === "State" && value === "") {
      setCustomerSection({
        ...customerSection,
        State: "",
      });
    }

    if (name === "City" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          City: valueCheck,
        });
      }
    } else if (name === "City" && value === "") {
      setCustomerSection({
        ...customerSection,
        City: "",
      });
    }

    if (name === "ZipCode" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          ZipCode: valueCheck,
        });
      }
    } else if (name === "ZipCode" && value === "") {
      setCustomerSection({
        ...customerSection,
        ZipCode: "",
      });
    }

    if (name === "ContactName" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          ContactName: valueCheck,
        });
      }
    } else if (name === "ContactName" && value === "") {
      setCustomerSection({
        ...customerSection,
        ContactName: "",
      });
    }

    if (name === "Number" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          Number: valueCheck,
        });
      }
    } else if (name === "Number" && value === "") {
      setCustomerSection({
        ...customerSection,
        Number: "",
      });
    }
  };

  //for enter key handler

  // const handleKeyEnter = (event, nextInput) => {
  //   if (event.key === "Enter") {
  //     nextInput.current.focus();
  //   }
  // };

  //For cancel button handler
  const cancelHandler = () => {
    setIsUpdateButton(false);
  };

  const confirmationUpdateHandler = async () => {
    setIsUpdateButton(true);
  };

  // const getCountry =(event) =>{

  //     console.log("event",event)
  // }
  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col lg={12} md={12} sm={12}>
            <label className={styles["customerheading"]}>
              Customer Information
            </label>
          </Col>
        </Row>
        <Col sm={6} xs={12}>
          <div className={styles[""]}>
            <div className={styles["CustomerInfo_div"]}>
              <Paper>
                <Row>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>Company</label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      placeholder="Company Name"
                      disable
                      applyClass="form-control2"
                      change={customerInfoHandler}
                      name="Name"
                    />
                  </Col>

                  <Col lg={2} md={2} sm={12}></Col>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>Country</label>
                  </Col>
                  <Col lg={5} md={5} sm={12} className="mt-3">
                    <CountryDropdown
                      className={styles["countrydropdown"]}
                      preferredCountries={["pk", "us"]}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>Address 1</label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      maxLength={100}
                      name="Address1"
                      placeholder="Address #1"
                      applyClass="form-control2"
                      change={customerInfoHandler}
                      value={customerSection.Address1 || ""}
                    />
                  </Col>

                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>Address 2</label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      maxLength={100}
                      placeholder="Address #2"
                      name="Address2"
                      change={customerInfoHandler}
                      value={customerSection.Address2 || ""}
                      applyClass="form-control2"
                    />
                  </Col>

                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>State</label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      maxLength={70}
                      placeholder="State/Province"
                      applyClass="form-control2"
                      change={customerInfoHandler}
                      value={customerSection.State || ""}
                      name="State"
                    />
                  </Col>

                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>City</label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      placeholder="City"
                      maxLength={70}
                      applyClass="form-control2"
                      name="City"
                      change={customerInfoHandler}
                      value={customerSection.City || ""}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>
                      Postal / ZipCode
                    </label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      maxLength={10}
                      placeholder="Postal Code/Zip Code"
                      applyClass="form-control2"
                      name="ZipCode"
                      change={customerInfoHandler}
                      value={customerSection.ZipCode || ""}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>
                      Contact Name
                    </label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      maxLength={100}
                      placeholder="Contact Name"
                      applyClass="form-control2"
                      name="ContactName"
                      change={customerInfoHandler}
                      value={customerSection.ContactName || ""}
                    />
                  </Col>

                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>
                      Contact Email
                    </label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      // ref={ContactEmail}
                      // onKeyDown={(event) => handleKeyEnter(event, ContactEmail)}
                      maxLength={160}
                      placeholder="Contact Email"
                      applyClass="form-control2"
                      disable
                    />
                  </Col>

                  <Col lg={2} md={2} sm={12}></Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>Number</label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      maxLength={50}
                      placeholder="Number"
                      applyClass="form-control2"
                      name="Number"
                      change={customerInfoHandler}
                      value={customerSection.Number || ""}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={12}></Col>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["lineOnBottom"]}
                    ></Col>
                  </Row>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["CompanyTitle"]}>
                      Referrence Number
                    </label>
                  </Col>
                  <Col lg={5} md={5} sm={12}>
                    <TextField
                      placeholder="Reference Number "
                      applyClass="form-control2"
                      disable
                    />
                  </Col>

                  <Col lg={2} md={2} sm={12}>
                    <label className={styles["editLink"]}>
                      <u>Edit</u>
                    </label>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <Button text="Revert" className={styles["btnRevert"]} />
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text="Update"
                      className={styles["btnUpdate"]}
                      onClick={confirmationUpdateHandler}
                    />
                  </Col>
                </Row>

                <Modal
                  show={isUpdateButton}
                  setShow={setIsUpdateButton}
                  ButtonTitle={ModalTitle}
                  modalBodyClassName={styles["modalUpdatemodal"]}
                  // modalHeaderClassName={
                  //   isUpdateButton === true ? "d-none" : "modalUpdateted"
                  // }
                  centered
                  size={isUpdateButton === "sm"}
                  ModalBody={
                    <>
                      {isUpdateButton ? (
                        <>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["modalUpdateText"]}>
                                Do you want to Proceed with the update?
                              </p>
                            </Col>
                          </Row>
                          <Row className={styles["modalUpdateted-2"]}>
                            <Col lg={6} md={6} xs={12} className="text-center">
                              <Button
                                onClick={cancelHandler}
                                className={styles["modalCancelBtn"]}
                                text="Cancel"
                              />
                            </Col>
                            <Col lg={6} md={6} xs={12} className="text-center">
                              <Button
                                className={styles["modalProceedBtn"]}
                                text="Proceed"
                              />
                            </Col>
                          </Row>
                        </>
                      ) : null}
                    </>
                  }
                />
                <Row className="mt-3"></Row>
              </Paper>
            </div>
          </div>
        </Col>
      </Container>
    </>
  );
};

export default CustomerInformation;
