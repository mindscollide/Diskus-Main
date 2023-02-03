import React, { useState, useRef } from "react";
import "./CustomerInformation.module.css";
import "./../../../../i18n";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  TextField,
  Paper,
  Modal,
} from "../../../../components/elements";
import styles from "./CustomerInformation.module.css";
import CountryDropdown from "country-dropdown-with-flags-for-react";
import { Scrollbars } from "react-custom-scrollbars";
import ErrorBar from "../../../authentication/sign_up/errorbar/ErrorBar";
import Title from "antd/lib/skeleton/Title";

const CustomerInformation = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();

  const Name = useRef(null);
  const CountryDropdowns = useRef(null);
  const Address1 = useRef(null);
  const Address2 = useRef(null);
  const State = useRef(null);
  const City = useRef(null);
  const ZipCode = useRef(null);
  const ContactName = useRef(null);
  const ContactEmail = useRef(null);
  const Number = useRef(null);
  const ReferrenceNumber = useRef(null);

  const [isUpdateButton, setIsUpdateButton] = useState(false);
  const [customerSection, setCustomerSection] = useState({
    Name: "",
    CountryDropdowns: "",
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
  const handleKeyEnter = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

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
              {t("Customer-Information")}
            </label>
          </Col>
        </Row>

        <Col md={8} lg={8} sm={12} xs={12} className={styles["customerINformation"]}>
          <div className={styles["Customer-Information-Scroller-container"]}>
            <Col md={10} lg={10} sm={12}>
              {/* Company name Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Company")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex align-items-center justify-content-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Name-field"]}
                    ref={Name}
                    onKeyDown={(event) => handleKeyEnter(event, Address1)}
                    placeholder={t("Company-Name")}
                    disabled
                    applyClass="form-control2"
                    change={customerInfoHandler}
                    name="Name"
                  />
                  <label className="mx-3">
                    <u> </u>
                  </label>
                </Col>
              </Row>
              {/* Country Name Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Country")}
                  </label>
                </Col>

                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex align-items-center justify-content-center gap-3 mb-2"
                >
                  <PhoneInput
                    placeholder={t("Enter-Phone-Number")}
                    name="CountryDropdowns"
                    ref={CountryDropdowns}
                    onKeyDown={(event) => handleKeyEnter(event, Name)}
                    preferredCountries={["pk", "us"]}
                    countryCodeEditable={false}
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* Address 1 Name field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Address-1")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={Address1}
                    onKeyDown={(event) => handleKeyEnter(event, Address2)}
                    maxLength={100}
                    name="Address1"
                    placeholder={t("Address-1")}
                    applyClass="form-control2"
                    onChange={customerInfoHandler}
                    value={customerSection.Address1 || ""}
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* Address 2 Name field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Address-2")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={Address2}
                    onKeyDown={(event) => handleKeyEnter(event, State)}
                    maxLength={100}
                    placeholder={t("Address-2")}
                    name="Address2"
                    onChange={customerInfoHandler}
                    value={customerSection.Address2 || ""}
                    applyClass="form-control2"
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* State Name field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("State")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={State}
                    onKeyDown={(event) => handleKeyEnter(event, City)}
                    maxLength={70}
                    placeholder={t("State")}
                    applyClass="form-control2"
                    onChange={customerInfoHandler}
                    value={customerSection.State || ""}
                    name="State"
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* City Name Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("City")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={City}
                    onKeyDown={(event) => handleKeyEnter(event, ZipCode)}
                    placeholder={t("City")}
                    maxLength={70}
                    applyClass="form-control2"
                    name="City"
                    onChange={customerInfoHandler}
                    value={customerSection.City || ""}
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* Postal Code */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Postal-/-ZipCode")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={ZipCode}
                    onKeyDown={(event) =>
                      handleKeyEnter(event, ContactName)
                    }
                    maxLength={10}
                    placeholder={t("Postal-/-ZipCode")}
                    applyClass="form-control2"
                    name="ZipCode"
                    onChange={customerInfoHandler}
                    value={customerSection.ZipCode || ""}
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* Contact Name Field*/}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Contact-Name")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={ContactName}
                    onKeyDown={(event) => handleKeyEnter(event, Number)}
                    maxLength={100}
                    placeholder={t("Contact-Name")}
                    applyClass="form-control2"
                    name="ContactName"
                    onChange={customerInfoHandler}
                    value={customerSection.ContactName || ""}
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* Contact Email Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Contact-Email")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    label={"Contact"}
                    ref={ContactEmail}
                    onKeyDown={(event) => handleKeyEnter(event, Number)}
                    maxLength={160}
                    placeholder={t("Contact-Email")}
                    applyClass="form-control2"
                    disabled
                  />
                  <label className="mx-3">
                    <u></u>
                  </label>
                </Col>
              </Row>
              {/* Number  */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Number")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={Number}
                    onKeyDown={(event) => handleKeyEnter(event, Address1)}
                    maxLength={50}
                    placeholder={t("Number")}
                    applyClass="form-control2"
                    name="Number"
                    onChange={customerInfoHandler}
                    value={customerSection.Number || ""}
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("Edit")}</u>
                  </label>
                </Col>
              </Row>
              {/* Reference Number */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Referrence-Number")}
                  </label>
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="mt-3 d-flex justfiy-content-center align-items-center gap-3 mb-2"
                >
                  <Form.Control
                    className={styles["formcontrol-Address1-field"]}
                    ref={ReferrenceNumber}
                    onKeyDown={(event) => handleKeyEnter(event, Name)}
                    placeholder={t("Referrence-Number")}
                    applyClass="form-control2"
                    disabled
                  />
                  <label className={styles["editLink"]}>
                    <u>{t("")}</u>
                  </label>
                  <label className="mx-3"></label>
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
                              {t("Do-you-want-update?")}
                            </p>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </>
                }
                ModalFooter={
                  <>
                    {isUpdateButton ? (
                      <>
                        <Row className={styles["modalUpdateted-2"]}>
                          <Col
                            lg={6}
                            md={6}
                            sm={6}
                            xs={12}
                            className="text-center"
                          >
                            <Button
                              onClick={cancelHandler}
                              className={styles["modalCancelBtn"]}
                              text={t("Cancel")}
                            />
                          </Col>
                          <Col
                            lg={6}
                            md={6}
                            sm={6}
                            xs={12}
                            className="text-start"
                          >
                            <Button
                              className={styles["modalProceedBtn"]}
                              text={t("Proceed")}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </>
                }
              />
            </Col>
          </div>

        </Col>
        <Row>
          <Col sm={12} md={7} lg={7}>
            <Row className="my-4">
              <Col
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="d-flex justify-content-start"
              >
                <Button
                  text={t("Revert")}
                  className={styles["btnRevert"]}
                />
              </Col>
              <Col
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Update")}
                  className={styles["btnUpdate"]}
                  onClick={confirmationUpdateHandler}
                />
              </Col>
            </Row>
          </Col>
        </Row>

      </Container>
    </>
  );
};

export default CustomerInformation;
