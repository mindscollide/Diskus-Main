import React, { useState, useRef, useMemo } from "react";
import styles from "./EditUser.module.css";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";

// import Select from "react-select";
import { Select } from "antd";
import {
  Button,
  TextField,
  Paper,
  FilterBar,
  SearchInput,
  Table,
  Modal,
} from "../../../../components/elements";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Sliders2 } from "react-bootstrap-icons";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);
  const [deleteEditModal, setDeleteEditModal] = useState(false);

  const [errorBar, setErrorBar] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState(
    "Name Field Is Empty"
  );
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    "Email Field Is Empty"
  );

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const { t } = useTranslation();

  const [rowSize, setRowSize] = useState(50);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSelect = (country) => {
    setSelectedCountry(country);
  };

  const [value, setValue] = useState();
  const options = useMemo(() => countryList().getData(), []);

  //for enter key
  const Name = useRef(null);
  const Designation = useRef(null);
  const CountryCode = useRef(null);
  const Mobile = useRef(null);
  const OrganizationRole = useRef(null);
  const UserRole = useRef(null);
  const Email = useRef(null);
  const UserStatus = useRef(null);
  const Names = useRef(null);
  const Emails = useRef(null);
  const OrganizationRoles = useRef(null);
  const UserRoles = useRef(null);
  const EnableRoles = useRef(null);

  //state for FilterbarModal
  const [filterSection, setFilterSection] = useState({
    Names: "",
    OrganizationRoles: "",
    EnableRoles: "",
    UserRoles: "",
    Emails: "",
  });

  //state for EditUser
  const [editUserSection, setEditUserSection] = useState({
    Name: "",
    Designation: "",
    CountryCode: "",
    Mobile: "",
    OrganizationRole: "",
    UserRole: "",
    Email: "",
    UserStatus: "",
  });

  //handler for enter key

  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

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

    //for Filter section

    if (name === "Names" && value !== "") {
      setErrorBar(false);
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setFilterSection({
          ...filterSection,
          Names: valueCheck,
        });
      }
    } else if (name === "Names" && value === "") {
      setErrorBar(true);
      setFilterSection({
        ...filterSection,
        Names: "",
      });
    }

    if (name === "Emails" && value !== "") {
      setErrorBar(false);
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setFilterSection({
          ...filterSection,
          Emails: valueCheck,
        });
      }
    } else if (name === "Emails" && value === "") {
      setErrorBar(true);
      setFilterSection({
        ...filterSection,
        Emails: "",
      });
    }
  };

  //close modal on update button it's created temperary to check modal
  const closeOnUpdateBtn = () => {
    setIsUpdateSuccessfully(true);
    setEditModal(false);
    setFilterBarModal(false);
  };

  //Open modal on reset button it's created temperary to check modal
  const openOnResetBtn = async () => {
    setEditModal(true);
    setEditUserSection("");
  };

  // Open Success modal after update the success
  const updateSuccessFull = async () => {
    setIsUpdateSuccessfully(true);
  };

  // Close Success modal
  const closeUpdateSuccessFull = () => {
    setIsUpdateSuccessfully(false);
  };

  //open filter modal on icon click
  const openFilterModal = async () => {
    setFilterBarModal(true);
    setFilterSection("");
  };

  //open delete modal on ok click
  const openDeleteModal = async () => {
    setDeleteEditModal(true);
    setFilterBarModal(false);
  };

  const handlerSearch = () => {
    if (filterSection.Names !== "" && filterSection.Emails !== "") {
      // if (validationEmail(signUpDetails.Email) === true) {
      //   navigate("/packageselection");
      // } else {
      //   setOpen({
      //     ...open,
      //     open: true,
      //     message: "Email should be in Email Format",
      //   });
      // }
      setErrorBar(true);
    } else {
      setErrorBar(true);
      setOpen({
        ...open,
        open: true,
        message: "Please fill all the fields",
      });
    }
  };

  const Option = [
    { value: 100, title: "100" },
    { value: 250, title: "250" },
    { value: 500, title: "500" },
  ];

  const EditUserColumn = [
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      align: "center",
    },
    {
      title: t("Designation"),
      dataIndex: "Designation",
      key: "Designation",
      align: "center",
    },
    {
      title: t("Email"),
      dataIndex: "Email",
      key: "Email",
      align: "center",
    },

    {
      title: t("Organization-Role"),
      dataIndex: "Organization Role",
      key: "Organization Role",
      align: "center",
    },
    {
      title: t("User-Role"),
      dataIndex: "User Role",
      key: "User Role",
      align: "center",
    },
    {
      title: t("UserStatus"),
      dataIndex: "UserStatus",
      key: "UserStatus",
      align: "center",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
    },
    {
      title: t("Delete"),
      dataIndex: "Delete",
      key: "Delete",
      align: "center",
    },
  ];

  return (
    <Container>
      <Row className={styles["filterdrow"]}>
        <Col lg={3} md={3} sm={6} xs={12}>
          <label className={styles["Edit-Main-Heading"]}>
            {t("Edit-User")}
          </label>
        </Col>
        <Col
          lg={6}
          md={6}
          sm={6}
          xs={12}
          className={styles["searchbar-textfield"]}
        >
          <TextField
            applyClass="form-control2"
            className="mx-2"
            labelClass="filter"
          />
          <div className={styles["filterModal"]}>
            <Sliders2 onClick={openFilterModal} />
          </div>
        </Col>
        <Col
          lg={3}
          md={3}
          sm={6}
          xs={12}
          className="d-flex justify-content-end"
        >
          <Button
            className={styles["btnEditReset"]}
            text={t("Reset")}
            onClick={openOnResetBtn}
          />
        </Col>

        {/* <Col lg={1} md={1} sm={12} className="d-flex justify-content-end">
          <Button
            className={styles["btnEditReset"]}
            text="Search"
            onClick={updateSuccessFull}
          />
        </Col> */}
      </Row>

      <Row className={styles["tablecolumnrow"]}>
        <div>
          <Select
            defaultValue={50}
            style={{ width: 120 }}
            onChange={(value) => setRowSize(value)}
          >
            <Option value={100}>100</Option>
            <Option value={250}>250</Option>
            <Option value={500}>500</Option>
          </Select>
          <Col lg={12} md={12} sm={12}>
            <Table
              column={EditUserColumn}
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: rowSize,
                showSizeChanger: true,
                pageSizeOptions: ["100 ", "150", "200"],
              }}
            />
          </Col>
        </div>
      </Row>

      <Modal
        show={
          editModal || isUpdateSuccessfully || filterBarModal || deleteEditModal
        }
        setShow={() => {
          setEditModal();
          setFilterBarModal();
          setIsUpdateSuccessfully();
          setDeleteEditModal();
        }}
        ButtonTitle={ModalTitle}
        centered
        size={
          editModal &&
          isUpdateSuccessfully &&
          filterBarModal &&
          deleteEditModal === "sm"
        }
        ModalBody={
          <>
            {editModal ? (
              <>
                <Container className={styles["Edit-modal-container"]}>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <label className={styles["Edit-label-heading"]}>
                        {t("Edit")}
                      </label>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Name")}</p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        ref={Name}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, Designation)
                        }
                        placeholder="Name"
                        className={styles["formcontrol-names-fields"]}
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        onChange={EditUserHandler}
                        value={editUserSection.Name}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Designation")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        placeholder="Designation"
                        className={styles["formcontrol-names-fields"]}
                        ref={Designation}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRole)
                        }
                        maxLength={200}
                        applyClass="form-control2"
                        name="Designation"
                        onChange={EditUserHandler}
                        value={editUserSection.Designation}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Mobile")}</p>
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <PhoneInput
                        ref={Mobile}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRole)
                        }
                        className={styles["formcontrol-phone-fields"]}
                        name="Mobile"
                        defaultCountry="PK"
                        maxLength={50}
                        placeholder={t("Enter-Phone-Number")}
                        onSelect={handleSelect}
                      />
                      {selectedCountry && (
                        <p>CODE : {selectedCountry.dialCode}</p>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Organization-Role")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Select
                        name="OrganizationRole"
                        ref={OrganizationRole}
                        onKeyDown={(event) => enterKeyHandler(event, UserRole)}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("User-Role")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Select
                        ref={UserRole}
                        onKeyDown={(event) => enterKeyHandler(event, Name)}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("UserStatus")}
                      </p>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Select
                        ref={UserStatus}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, UserStatus)
                        }
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Email")}</p>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        disabled
                        placeholder="Email"
                        applyClass="form-control2"
                        className={styles["formcontrol-names-fields"]}
                      />
                    </Col>
                  </Row>
                </Container>
              </>
            ) : isUpdateSuccessfully ? (
              <>
                <Row className="mb-3">
                  <Col lg={2} md={2} sm={12} />
                  <Col
                    lg={8}
                    md={8}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <label className={styles["successfull-label"]}>
                      {t("Successfully-Updated")}
                    </label>
                  </Col>
                  <Col lg={2} md={2} sm={12} />
                </Row>
              </>
            ) : filterBarModal ? (
              <>
                <Container>
                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Form.Control
                        labelClass="d-none"
                        className={styles["formcontrol-fieldfor-filtermodal"]}
                        ref={Names}
                        onKeyDown={(event) => enterKeyHandler(event, Emails)}
                        name="Names"
                        placeholder={t("Name")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterSection.Names}
                      />
                      {/* <Row>
                        <Col>
                          <p
                            className={
                              errorBar || filterSection.Names === ""
                                ? `${styles["name-error-Message"]}`
                                : `${styles["name-errorMessage_hidden"]}`
                            }
                          >
                            {nameErrorMessage}
                          </p>
                        </Col>
                      </Row> */}
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Form.Control
                        labelClass="d-none"
                        className={styles["formcontrol-fieldfor-filtermodal"]}
                        ref={Emails}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRoles)
                        }
                        name="Emails"
                        placeholder={t("Email")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterSection.Emails}
                      />
                      {/* <Row>
                        <Col>
                          <p
                            className={
                              errorBar || filterSection.Emails === ""
                                ? ` ${styles["name-error-Message"]}`
                                : `${styles["name-errorMessage_hidden"]}`
                            }
                          >
                            {emailErrorMessage}
                          </p>
                        </Col>
                      </Row> */}
                      
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={OrganizationRoles}
                        onKeyDown={(event) => enterKeyHandler(event, UserRoles)}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={UserRoles}
                        onKeyDown={(event) => enterKeyHandler(event, Names)}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        // ref={OrganizationRole}
                        // onKeyDown={(event) => enterKeyHandler(event, UserRole)}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        placeholder={t("Enabled Users")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>
                </Container>
              </>
            ) : deleteEditModal ? (
              <>
                <Row className="mb-3 mt-4">
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <label className={styles["deleteModal-message"]}>
                      Are you sure you want to delete user?
                    </label>
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
        ModalFooter={
          <>
            {editModal ? (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Update")}
                    onClick={closeOnUpdateBtn}
                    className={styles["Edit-Update-Btn"]}
                  />
                </Col>
              </Row>
            ) : isUpdateSuccessfully ? (
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className={styles["Ok-Successfull-btn"]}
                      text={t("Ok-Title")}
                      onClick={closeUpdateSuccessFull}
                    />
                  </Col>
                </Row>
              </Col>
            ) : filterBarModal ? (
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-4">
                  <Col
                    lg={9}
                    md={9}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Reset")}
                      className={styles["icon-filtermodal-ResetBtn"]}
                      // onClick={closeOnUpdateBtn}
                    />
                  </Col>

                  <Col
                    lg={3}
                    md={3}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      className={styles["icon-modal-ResetBtn"]}
                      text={t("Search")}
                      onClick={() => {
                        handlerSearch();
                        openDeleteModal();
                      }}
                      // onClick={openDeleteModal}
                    />
                  </Col>
                </Row>
              </Col>
            ) : deleteEditModal ? (
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-4">
                  <Col
                    lg={5}
                    md={5}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={"Cancel"}
                      className={styles["icon-modal-ResetBtn"]}
                      // onClick={closeOnUpdateBtn}
                    />
                  </Col>

                  <Col
                    lg={7}
                    md={7}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      className={styles["icon-filtermodal-SearrcchhBtn"]}
                      text={"Proceed with Deletion"}
                    />
                  </Col>
                </Row>
              </Col>
            ) : null}
          </>
        }
      />
    </Container>
  );
};

export default EditUser;
