import React, { useState, useRef, useMemo, useEffect } from "react";
import styles from "./AllUserPage.module.css";
import countryList from "react-select-country-list";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { dataSet } from "./../EditUser/EditData";
import EditIcon from "../../../../assets/images/Edit-Icon.png";

import Select from "react-select";
// import { Select } from "antd";
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

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  const [allUserData, setAllUserData] = useState([
    {
      Names: "JawadFaisal",
      Designation: "Owais Graham",
      Emails: "OwaisGraham@gmail.com",
      OrganizationRole: "JawadFaisal",
      UserRole: "AAC",
      UserStatus: "true",
    },
    {
      Names: "AunNaqvi",
      Designation: "Talha jasson",
      Emails: "Talhajasson@gmail.com",
      OrganizationRole: "Aunnaqvi",
      UserRole: "BCA",
      UserStatus: "true",
    },
    {
      Names: "BilalZaidi",
      Designation: "Bilal George",
      Emails: "BilalGeorge@gmail.com",
      OrganizationRole: "BilalZaidi",
      UserRole: "DCA",
      UserStatus: "true",
    },
    {
      Names: "AunNaqvi",
      Designation: "Leanne Graham",
      Emails: "LeanneGraham@gmail.com",
      OrganizationRole: "Aunnaqvi",
      UserRole: "PCA",
      UserStatus: "true",
    },
    {
      Names: "JawadFaisal",
      Designation: "Aun Naqvi",
      Emails: "AunRaza23@gmail.com",
      OrganizationRole: "JawadFaisal",
      UserRole: "MCA",
      UserStatus: "true",
    },
  ]);

  const [rowSize, setRowSize] = useState(50);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSelect = (country) => {
    setSelectedCountry(country);
  };

  //for fake dataSet
  const [Data, setData] = useState(dataSet);

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
  const [filterFieldSection, setFilterFieldSection] = useState({
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

    if (name === "Names" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setFilterFieldSection({
          ...filterFieldSection,
          Names: valueCheck,
        });
      }
    } else if (name === "Names" && value === "") {
      setFilterFieldSection({
        ...filterFieldSection,
        Names: "",
      });
    }

    if (name === "Emails" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setFilterFieldSection({
          ...filterFieldSection,
          Emails: valueCheck,
        });
      }
    } else if (name === "Emails" && value === "") {
      setFilterFieldSection({
        ...filterFieldSection,
        Emails: "",
      });
    }
  };

  //for Alluser reset handler

  const userResetHandler = () => {
    setFilterFieldSection({
      Names: "",
      OrganizationRoles: "",
      EnableRoles: "",
      UserRoles: "",
      Emails: "",
    });
  };

  //close modal on update button it's created temperary to check modal
  const closeOnUpdateBtn = () => {
    setIsUpdateSuccessfully(true);
    setEditModal(false);
    setFilterBarModal(false);
  };

  //open filter modal on icon click
  const openFilterModal = async () => {
    setFilterBarModal(true);
    setFilterFieldSection("");
  };

  // onclick AddUser User should be navigate to AddUser
  const gotoAddUser = () => {
    navigate("/Diskus/Admin/AddUser");
  };

  const Option = [
    { value: 100, title: "100" },
    { value: 250, title: "250" },
    { value: 500, title: "500" },
  ];

  const EditUserColumn = [
    {
      title: t("Name"),
      dataIndex: "Names",
      key: "Names",
      align: "left",
      sorter: (a, b) => a.Names.localeCompare(b.Names.toLowerCase),
    },
    {
      title: t("Designation"),
      dataIndex: "Designation",
      key: "Designation",
      align: "left",
      sorter: (a, b) => a.Designation.localeCompare(b.Designation.toLowerCase),
    },
    {
      title: t("Email"),
      dataIndex: "Emails",
      key: "Emails",
      align: "left",
    },

    {
      title: t("Organization-Role"),
      dataIndex: "OrganizationRole",
      key: "OrganizationRole",
      align: "left",
      sorter: (a, b) =>
        a.OrganizationRole.localeCompare(b.OrganizationRole.toLowerCase),
    },
    {
      title: t("User-Role"),
      dataIndex: "UserRole",
      key: "UserRole",
      align: "left",
    },
    {
      title: t("UserStatus"),
      dataIndex: "UserStatus",
      key: "UserStatus",
      align: "left",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "left",
      render: () => {
        return (
          <i>
            <img src={EditIcon} />
          </i>
        );
      },
    },
    // {
    //   title: t("Delete"),
    //   dataIndex: "Delete",
    //   key: "Delete",
    //   align: "center",
    // },
  ];

  const searchFunc = () => {
    let y = [...allUserData];
    // console.log(y, "items")
    let x = y.filter((a) => {
      if (
        filterFieldSection.Names === "" ||
        a.Names === filterFieldSection.Names
      ) {
        console.log("items", a);
        setFilterBarModal(false);
        return a;
      }
    });
    setAllUserData(x);

    console.log("items", x);
  };
  useEffect(() => {
    if (Object.keys(filterFieldSection).length > 0) {
      setRows(allUserData);
    }
  }, [allUserData]);

  return (
    <Container>
      <Row className={"mt-5"}>
        <Col lg={3} md={3} sm={6} xs={12}>
          <label className={styles["Edit-Main-Heading"]}>{t("All-User")}</label>
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
          sm={12}
          xs={12}
          className="d-flex justify-content-end"
        >
          <Button
            className={styles["AddUser-btn"]}
            text={t("Add User +")}
            onClick={gotoAddUser}
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
        <Col lg={12} md={12} sm={12}>
          <Table
            rows={rows}
            column={EditUserColumn}
            scroll={{ x: 400 }}
            pagination={{
              pageSize: rowSize,
              showSizeChanger: true,
              pageSizeOptions: ["100 ", "150", "200"],
            }}
          />
        </Col>
      </Row>

      <Modal
        show={filterBarModal}
        setShow={() => {
          setFilterBarModal();
        }}
        ButtonTitle={ModalTitle}
        centered
        size={filterBarModal === "sm"}
        ModalBody={
          <>
            {filterBarModal ? (
              <>
                <Container>
                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Form.Control
                        className={styles["formcontrol-fieldfor-filtermodal"]}
                        ref={Names}
                        onKeyDown={(event) => enterKeyHandler(event, Emails)}
                        name="Names"
                        placeholder={t("Name")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.Names}
                      />
                    </Col>

                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Form.Control
                        className={styles["formcontrol-fieldfor-filtermodal"]}
                        ref={Emails}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRoles)
                        }
                        name="Emails"
                        placeholder={t("Email")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.Emails}
                      />
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
                        name="OrganizationRoles"
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.OrganizationRoles}
                      />
                    </Col>

                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={UserRoles}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, EnableRoles)
                        }
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        name="UserRoles"
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.UserRoles}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={EnableRoles}
                        onKeyDown={(event) => enterKeyHandler(event, Names)}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        name="UserRoles"
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.UserRoles}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}></Col>
                  </Row>
                </Container>
              </>
            ) : null}
          </>
        }
        ModalFooter={
          <>
            {filterBarModal ? (
              <Col sm={12} md={12} lg={12}>
                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end mb-3"
                  >
                    <Button
                      text={t("Reset")}
                      className={styles["icon-modal-ResetBtn"]}
                      onClick={userResetHandler}
                    />
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start  mb-3"
                  >
                    <Button
                      className={styles["icon-modal-ResetBtn"]}
                      text={t("Search")}
                      onClick={searchFunc}
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
