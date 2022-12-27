import React, { useState, useEffect } from "react";
import "./PaymentInvoiceFilterModal.css";
import { Modal, TextField, Button } from "./../../../components/elements";
import "./../../../i18n";
import { useTranslation } from "react-i18next";
import { Row, Col, Container } from "react-bootstrap";
import Select from "react-select";


const PaymentInvoiceFilterModal = ({ ModalTitle, setShow, show }) => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  //state for EditUser
  const [editUserSection, setEditUserSection] = useState({
    Name: "",
    Designation: "",
    CountryCode: "",
    Mobile: "",
    OrganizationRole: "",
    UserRole: "",
    Email: "",
  });

  const EditUserHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Name" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setEditUserSection({
          ...editUserSection,
          Name: valueCheck,
        });
      }
    } else if (name === "Name" && value === "") {
      setEditUserSection({
        ...editUserSection,
        Name: "",
      });
    }

    if (name === "Designation" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setEditUserSection({
          ...editUserSection,
          Designation: valueCheck,
        });
      }
    } else if (name === "Designation" && value === "") {
      setEditUserSection({
        ...editUserSection,
        Designation: "",
      });
    }

    if (name === "Mobile" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setEditUserSection({
          ...editUserSection,
          Mobile: valueCheck,
        });
      }
    } else if (name === "Mobile" && value === "") {
      setEditUserSection({
        ...editUserSection,
        Mobile: "",
      });
    }
  };

  //close modal on update button it's created temperary to check modal
  const closeOnUpdateBtn = () => {
    setShow(false);
  };

  return (
    <>
      <Container>
        <Modal
          show={show}
          setShow={setShow}
          className="modaldialog createModalMeeting"
          ButtonTitle={ModalTitle}
          modalBodyClassName="modalMeetingCreateBody"
          modalFooterClassName="modalMeetingCreateFooter"
          modalHeaderClassName={"d-none"}
          centered
          size={"md"}
          ModalBody={
            <>
              <Container className="">
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <label className="">{t("Edit")}</label>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={5} md={5} sm={12}>
                    <p className="">{t("Name")}</p>
                  </Col>

                  <Col lg={7} md={7} sm={12}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Name"
                      change={EditUserHandler}
                      value={editUserSection.Name}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <p className="">{t("Designation")}</p>
                  </Col>

                  <Col lg={7} md={7} sm={12}>
                    <TextField
                      maxLength={200}
                      applyClass="form-control2"
                      name="Designation"
                      change={EditUserHandler}
                      value={editUserSection.Designation}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <p className="">{t("Mobile")}</p>
                  </Col>

                  <Col lg={7} md={7} sm={12}>
                    <TextField
                      maxLength={50}
                      applyClass="form-control2"
                      name="Mobile"
                      change={EditUserHandler}
                      value={editUserSection.Mobile}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <p className="">{t("Organization-Role")}</p>
                  </Col>

                  <Col lg={7} md={7} sm={12}>
                    <Select
                      className=""
                      placeholder={t("Please-Select")}
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <p className="">{t("User-Role")}</p>
                  </Col>

                  <Col lg={7} md={7} sm={12}>
                    <Select
                      className=""
                      placeholder={t("Please-Select")}
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <p className="">{t("Email")}</p>
                  </Col>
                  <Col lg={7} md={7} sm={12}>
                    <TextField disable applyClass="form-control2" />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Update")}
                      onClick={closeOnUpdateBtn}
                      className=""
                    />
                  </Col>
                </Row>
              </Container>
            </>
          }
        />
      </Container>
    </>
  );
};

export default PaymentInvoiceFilterModal;
