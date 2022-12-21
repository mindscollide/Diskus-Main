import React, { useState } from "react";
import styles from "./EditUser.module.css";
import Select from "react-select";
import {
  Button,
  TextField,
  Paper,
  FilterBar,
  SearchInput,
  Table,
  Modal,
} from "../../../../components/elements";
import { Container, Row, Col } from "react-bootstrap";
import { FilterSquare } from "react-bootstrap-icons";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);

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

  const options = [
    { value: 1, title: "Select Roles" },
    { value: 2, title: "Name" },
    { value: 3, title: "Email" },
    { value: 4, title: "Organization Role" },
    { value: 5, title: "User Role " },
  ];

  const EditUserColumn = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      align: "center",
    },
    {
      title: "Designation",
      dataIndex: "Designation",
      key: "Designation",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      align: "center",
    },
    {
      title: "Mobile#",
      dataIndex: "Mobile#",
      key: "Mobile#",
      align: "center",
    },
    {
      title: "Organization Role",
      dataIndex: "Organization Role",
      key: "Organization Role",
      align: "center",
    },
    {
      title: "User Role",
      dataIndex: "User Role",
      key: "User Role",
      align: "center",
    },
    {
      title: "Edit",
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
    },
  ];

  return (
    <Container>
      <Row className={styles["filterdrow"]}>
        <Col lg={3} md={3} sm={12}>
          <label className={styles["Edit-Main-Heading"]}>Edit user</label>
        </Col>
        <Col lg={7} md={7} sm={12} className={styles["searchbar-textfield"]}>
          <TextField
            placeholder="Title"
            applyClass="form-control2"
            className="mx-2"
            labelClass="filter"
          />
          <div
            style={{
              position: "absolute",
              top: "18px",
              right: "30px",
              fontSize: "21px",
            }}
          >
            <FilterSquare onClick={openFilterModal} />
          </div>
        </Col>
        <Col lg={1} md={1} sm={12} className="d-flex justify-content-end">
          <Button
            className={styles["btnEditReset"]}
            text="Reset"
            onClick={openOnResetBtn}
          />
        </Col>

        <Col lg={1} md={1} sm={12} className="d-flex justify-content-end">
          <Button
            className={styles["btnEditReset"]}
            text="Search"
            onClick={updateSuccessFull}
          />
        </Col>
      </Row>

      <Row className={styles["tablecolumnrow"]}>
        <Col lg={12} md={12} sm={12}>
          <Table
            column={EditUserColumn}
            scroll={{ x: "max-content" }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "30"],
            }}
          />
        </Col>
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
                      sm={12}
                      className="d-flex justify-content-start"
                    >
                      <label className={styles["Edit-label-heading"]}>
                        Edit
                      </label>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={5} md={5} sm={12}>
                      <p className={styles["Edit-Name-label"]}>Name</p>
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
                      <p className={styles["Edit-Name-label"]}>Designation</p>
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
                      <p className={styles["Edit-Name-label"]}>Mobile</p>
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
                      <p className={styles["Edit-Name-label"]}>
                        Organization Role
                      </p>
                    </Col>

                    <Col lg={7} md={7} sm={12}>
                      <Select
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder="Please Select"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={5} md={5} sm={12}>
                      <p className={styles["Edit-Name-label"]}>User Role</p>
                    </Col>

                    <Col lg={7} md={7} sm={12}>
                      <Select
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder="Please Select"
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={5} md={5} sm={12}>
                      <p className={styles["Edit-Name-label"]}>Email</p>
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
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      name="Name"
                      placeholder="Name"
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={12}>
                    <Select
                      className={styles["selectbox-Edit-organizationrole"]}
                      placeholder="Please Select"
                      applyClass="form-control2"
                    />
                  </Col>
                  <Col lg={6} md={6} sm={12}>
                    <Select
                      className={styles["selectbox-Edit-organizationrole"]}
                      placeholder="Please Select"
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      name="Name"
                      placeholder="Name"
                      applyClass="form-control2"
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={9}
                    md={9}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button text="Reset" onClick={closeOnUpdateBtn} />
                  </Col>

                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
                    <Button text="Search" />
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
      />
    </Container>
  );
};

export default EditUser;
