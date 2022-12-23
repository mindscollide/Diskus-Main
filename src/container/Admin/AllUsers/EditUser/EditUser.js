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
import { FilterSquare } from "react-bootstrap-icons";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);

  const {t} = useTranslation();

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

  //state for FilterbarModal
  const [filterSection, setFilterSection] = useState({
    Name: "",
    OrganizationRole: "",
    UserRole: "",
    Email: "",
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
      title: t("Mobile"),
      dataIndex: "Mobile",
      key: "Mobile",
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
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
    },
  ];

  return (
    <Container>
      <Row className={styles["filterdrow"]}>
        <Col lg={3} md={3} sm={6} xs={12}>
          <label className={styles["Edit-Main-Heading"]}>{t("Edit-User")}</label>
        </Col>
        <Col lg={5} md={5}  sm={6} xs={12} className={styles["searchbar-textfield"]}>
          <TextField
            applyClass="form-control2"
            className="mx-2"
            labelClass="filter"
          />
          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "30px",
              fontSize: "21px",
            }}
          >
            <FilterSquare onClick={openFilterModal} />
          </div>
        </Col>
        <Col lg={3} md={3}  sm={6} xs={12} className="d-flex justify-content-end">
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
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: rowSize,
              }}
            />
          </Col>
        </div>
      </Row>

      <Modal
        show={editModal || isUpdateSuccessfully || filterBarModal}
        setShow={() => {
          setEditModal();
          setFilterBarModal();
          setIsUpdateSuccessfully();
        }}
        ButtonTitle={ModalTitle}
        centered
        size={editModal && isUpdateSuccessfully && filterBarModal === "sm"}
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
                        Edit
                      </label>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>Name</p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        ref={Name}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, Designation)
                        }
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
                      <p className={styles["Edit-Name-label"]}>Designation</p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
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
                      <p className={styles["Edit-Name-label"]}>Mobile</p>
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-center align-items-center"
                    >
                      {/* <Form.Control
                        className={styles["formcontrol-names-fields"]}
                        ref={Mobile}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRole)
                        }
                        maxLength={50}
                        applyClass="form-control2"
                        name="Mobile"
                        onChange={EditUserHandler}
                        value={editUserSection.Mobile}
                      /> */}
                      <PhoneInput
                        // defaultCountry="PK"
                        // options={options}
                        // className={styles["formcontrol-phone-fields"]}
                        // ref={Mobile}
                        // onKeyDown={(event) =>
                        //   enterKeyHandler(event, OrganizationRole)
                        // }
                        // maxLength={50}
                        // name="Mobile"
                        // placeholder="Enter Phone Number"
                        // value={value}
                        // onChange={setValue}
                        ref={Mobile}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRole)
                        }
                        className={styles["formcontrol-phone-fields"]}
                        name="Mobile"
                        defaultCountry="PK"
                        maxLength={10}
                        placeholder="Enter Phone Number"
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
                        Organization Role
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Select
                        name="OrganizationRole"
                        ref={OrganizationRole}
                        onKeyDown={(event) => enterKeyHandler(event, UserRole)}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder="Please Select"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>User Role</p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Select
                        ref={UserRole}
                        onKeyDown={(event) => enterKeyHandler(event, Name)}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder="Please Select"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>Email</p>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        disabled
                        applyClass="form-control2"
                        className={styles["formcontrol-names-fields"]}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text="Update"
                        onClick={closeOnUpdateBtn}
                        className={styles["Edit-Update-Btn"]}
                      />
                    </Col>
                  </Row>
                </Container>
              </>
            ) : isUpdateSuccessfully ? (
              <>
                <Row>
                  <Col lg={2} md={2} sm={12} />
                  <Col
                    lg={8}
                    md={8}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <label className={styles["successfull-label"]}>
                      Changes Successfully Updated !
                    </label>
                  </Col>
                  <Col lg={2} md={2} sm={12} />
                </Row>

                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className={styles["Ok-Successfull-btn"]}
                      text="ok"
                      onClick={closeUpdateSuccessFull}
                    />
                  </Col>
                </Row>
              </>
            ) : filterBarModal ? (
              <>
                <Container>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Form.Control
                        className={styles["formcontrol-fieldfor-filtermodal"]}
                        ref={Name}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRole)
                        }
                        name="Name"
                        placeholder="Name"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={OrganizationRole}
                        onKeyDown={(event) => enterKeyHandler(event, UserRole)}
                        className={styles["formcontrol-fieldselectfor-filtermodal"]}
                        placeholder="Please Select"
                        applyClass="form-control2"
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={UserRole}
                        onKeyDown={(event) => enterKeyHandler(event, Email)}
                        className={styles["formcontrol-fieldselectfor-filtermodal"]}
                        placeholder="Please Select"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Form.Control
                        className={styles["formcontrol-fieldfor-filtermodal"]}
                        ref={Email}
                        onKeyDown={(event) => enterKeyHandler(event, Name)}
                        name="Email"
                        placeholder="Email"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col
                      lg={9}
                      md={9}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text="Reset"
                        className={styles["icon-modal-ResetBtn"]}
                        // onClick={closeOnUpdateBtn}
                      />
                    </Col>

                    <Col
                      lg={3}
                      md={3}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        className={styles["icon-modal-ResetBtn"]}
                        text="Search"
                      />
                    </Col>
                  </Row>
                </Container>
              </>
            ) : null}
          </>
        }
      />
    </Container>
  );
};

export default EditUser;
