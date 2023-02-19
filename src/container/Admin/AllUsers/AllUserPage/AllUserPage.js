import React, { useState, useRef, useMemo, useEffect } from "react";
import styles from "./AllUserPage.module.css";
import Paymenthistoryhamberge from "../../../../assets/images/newElements/paymenthistoryhamberge.png";
import countryList from "react-select-country-list";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { dataSet } from "./../EditUser/EditData";
import EditIcon from "../../../../assets/images/Edit-Icon.png";
import PlusIcon from "../../../../assets/images/Plus-Icon.png";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import {
  Button,
  TextField,
  Paper,
  FilterBar,
  SearchInput,
  Table,
  Modal,
  Loader,
  Notification,
} from "../../../../components/elements";
import { Container, Row, Col, Form } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import { AllUserAction } from "../../../../store/actions/Admin_AddUser";
import { cleareMessage } from "../../../../store/actions/Admin_AddUser";
import {
  validateEmail,
  validationEmail,
} from "../../../../commen/functions/validations";
import {
  GetAllUserRoles,
  GetAllUserStatus,
} from "../../../../store/actions/RolesList";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { adminReducer, roleListReducer } = state;
  const [rows, setRows] = useState([]);

  const [allUserData, setAllUserData] = useState([
    // {
    //   Names: "JawadFaisal",
    //   Designation: "Owais Graham",
    //   Emails: "OwaisGraham@gmail.com",
    //   OrganizationRole: "JawadFaisal",
    //   UserRole: "AAC",
    //   UserStatus: "true",
    // },
    // {
    //   Names: "AunNaqvi",
    //   Designation: "Talha jasson",
    //   Emails: "Talhajasson@gmail.com",
    //   OrganizationRole: "Aunnaqvi",
    //   UserRole: "BCA",
    //   UserStatus: "true",
    // },
    // {
    //   Names: "BilalZaidi",
    //   Designation: "Bilal George",
    //   Emails: "BilalGeorge@gmail.com",
    //   OrganizationRole: "BilalZaidi",
    //   UserRole: "DCA",
    //   UserStatus: "true",
    // },
    // {
    //   Names: "AunNaqvi",
    //   Designation: "Leanne Graham",
    //   Emails: "LeanneGraham@gmail.com",
    //   OrganizationRole: "Aunnaqvi",
    //   UserRole: "PCA",
    //   UserStatus: "true",
    // },
    // {
    //   Names: "JawadFaisal",
    //   Designation: "Aun Naqvi",
    //   Emails: "AunRaza23@gmail.com",
    //   OrganizationRole: "JawadFaisal",
    //   UserRole: "MCA",
    //   UserStatus: "true",
    // },
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
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [userRolesListNameOptions, setUserRolesListNameOptions] = useState([]);
  const [userStatusListOptions, setUserStatusListOptions] = useState([]);
  const [organaizationRolesOptions, setOrganaizationRolesOptions] = useState(
    []
  );

  const [forSearchOrganization, setForSearchOrganization] = useState([]);
  const [forSearchUserStatus, setForSearchUserStatus] = useState([]);
  const [forSearchtUserRole, setForSearchUserRole] = useState([]);

  //state for FilterbarModal
  const [filterFieldSection, setFilterFieldSection] = useState({
    Names: "",
    OrganizationRoles: "",
    UserRoles: "",
    UserStatus: "",
    Emails: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
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
          Names: valueCheck.trimStart(),
        });
      }
    } else if (name === "Names" && value === "") {
      setFilterFieldSection({
        ...filterFieldSection,
        Names: "",
      });
    }

    if (name === "Emails" && value !== "") {
      let valuenew = value.trimStart();
      if (valuenew !== "") {
        if (validationEmail(valuenew)) {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: valuenew.trimStart(),
              errorMessage: "",
              errorStatus: false,
            },
          });
        } else {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: valuenew.trimStart(),
              errorMessage: "Email Should be in Email Format",
              errorStatus: true,
            },
          });
        }
      }
    } else if (name === "Emails" && value === "") {
      setFilterFieldSection({
        ...filterFieldSection,
        Emails: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  //for Alluser reset handler

  const userResetHandler = () => {
    setFilterFieldSection({
      Names: "",
      OrganizationRoles: "",
      UserStatus: "",
      UserRoles: "",
      Emails: "",
    });
    setForSearchOrganization([]);
    setForSearchUserStatus([]);
    setForSearchUserRole([]);
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
    setFilterFieldSection({
      Names: "",
      OrganizationRoles: "",
      UserStatus: "",
      UserRoles: "",
      Emails: "",
    });
    setForSearchOrganization([]);
    setForSearchUserStatus([]);
    setForSearchUserRole([]);

    // setFilterFieldSection("");
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
      render: (text, record) => {
        if (record.UserStatus === "Closed") {
          return (
            <p className={`${"Disabled-Close"} ${styles["User-title-col"]}`}>
              {text}
            </p>
          );
        } else {
          return <p className={styles["User-title-col"]}>{text}</p>;
        }
      },
    },
    {
      title: t("Designation"),
      dataIndex: "Designation",
      key: "Designation",
      align: "left",
      sorter: (a, b) => a.Designation.localeCompare(b.Designation.toLowerCase),
      render: (text, record) => {
        if (record.UserStatus === "Closed") {
          return (
            <p className={`${"Disabled-Close"} ${styles["userDesgination"]}`}>
              {text}
            </p>
          );
        } else {
          return <p className={styles["userDesgination"]}>{text}</p>;
        }
      },
    },
    {
      title: t("Email"),
      dataIndex: "Emails",
      key: "Emails",
      align: "left",
      render: (text, record) => {
        if (record.UserStatus === "Closed") {
          return <p className="Disabled-Close">{text}</p>;
        } else {
          return <a href={`mailto:${text}`}>{text}</a>;
        }
      },
    },

    {
      title: t("Organization-role"),
      dataIndex: "OrganizationRole",
      key: "OrganizationRole",
      align: "left",
      sorter: (a, b) =>
        a.OrganizationRole.localeCompare(b.OrganizationRole.toLowerCase),
      render: (text, record) => {
        if (record.UserStatus === "Closed") {
          return (
            <p className={`${"Disabled-Close"} ${styles["userOrganization"]}`}>
              {text}
            </p>
          );
        } else {
          return <p className={styles["userOrganization"]}>{text}</p>;
        }
      },
    },
    {
      title: t("User-role"),
      dataIndex: "UserRole",
      key: "UserRole",
      align: "left",
      render: (text, record) => {
        if (record.UserStatus === "Closed") {
          return (
            <p className={`${"Disabled-Close"} ${styles["userOrganization"]}`}>
              {text}
            </p>
          );
        } else {
          return <p className={styles["userOrganization"]}>{text}</p>;
        }
      },
    },
    {
      title: t("User-status"),
      dataIndex: "User-status",
      key: "User-status",
      align: "left",
      render: (text, record) => {
        console.log("UserStatusText", text, record);
        if (record.UserStatus === "Enabled") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-enabled"></span>
                <p className="m-0 userName">{record.UserStatus}</p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Disabled") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-disabled"></span>
                <p className="m-0 userName">{record.UserStatus}</p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Locked") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-locked"></span>
                <p className="m-0 userName">{record.UserStatus}</p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Dormant") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-dormant"></span>
                <p className="m-0 userName">{record.UserStatus}</p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Closed") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-closed"></span>
                <p className="m-0 Disabled-Close userName">
                  {record.UserStatus}
                </p>
              </div>
            </>
          );
        }
      },
    },
  ];
  useEffect(() => {
    let OrganizationID = localStorage.getItem("organizationID");
    let RequestingUserID = localStorage.getItem("userID");
    let newData = {
      OrganizationID: parseInt(OrganizationID),
      RequestingUserID: parseInt(RequestingUserID),
    };
    dispatch(AllUserAction(newData, t));
    dispatch(GetAllUserRoles(t));
    dispatch(GetAllUserStatus(t));
  }, []);

  useEffect(() => {
    console.log("setAllUserData", adminReducer.AllOrganizationUserList);
    if (
      Object.keys(adminReducer.AllOrganizationUserList).length > 0 &&
      adminReducer.AllOrganizationUserList != undefined &&
      adminReducer.AllOrganizationUserList != null
    ) {
      console.log("setAllUserData", adminReducer.AllOrganizationUserList);

      let tem = [];
      adminReducer.AllOrganizationUserList.map((data, index) => {
        let convertValue = {
          Names: data.userName,
          OrganizationRole: data.organizationRole,
          EnableRoles: data.email,
          UserRole: data.userRole,
          Emails: data.email,
          Designation: data.designation,
          OrganizationRoleID: data.organizationRoleID,
          UserID: data.userID,
          UserRoleID: data.userRoleID,
          UserStatus: data.userStatus,
          UserStatusID: data.userStatusID,
        };
        tem.push(convertValue);
      });
      console.log("setAllUserData", tem);
      setAllUserData(tem);
    }
  }, [adminReducer.AllOrganizationUserList]);

  useEffect(() => {
    if (adminReducer.ResponseMessage != "") {
      setOpen({
        ...open,
        open: true,
        message: adminReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    }
  }, [adminReducer.ResponseMessage]);

  const searchFunc = () => {
    var y = [...allUserData];
    let x = y.filter((a) => {
      console.log("filter", a);
      return (
        (filterFieldSection.Names != ""
          ? a.Names.toLowerCase().includes(
              filterFieldSection.Names.toLowerCase()
            )
          : a.Names) &&
        (filterFieldSection.Emails.value != ""
          ? a.Emails.toLowerCase().includes(
              filterFieldSection.Emails.value.toLowerCase()
            )
          : a.filterFieldSection.Emails.value) &&
        (filterFieldSection.OrganizationRoles != ""
          ? a.OrganizationRole === filterFieldSection.OrganizationRoles
          : a.OrganizationRole) &&
        (filterFieldSection.UserRoles != ""
          ? a.UserRole === filterFieldSection.UserRoles
          : a.UserRole) &&
        (filterFieldSection.UserStatus != ""
          ? a.UserStatus === filterFieldSection.UserStatus
          : a.UserStatus)
      );
    });

    console.log("filteredData", x);

    setRows([...x]);
    setFilterBarModal(false);
    setFilterFieldSection({
      Names: "",
      OrganizationRoles: "",
      UserStatus: "",
      UserRoles: "",
      Emails: "",
    });
    setForSearchOrganization([]);
    setForSearchUserStatus([]);
    setForSearchUserRole([]);
    setFilterBarModal(false);
  };

  // to change select border color functionality
  const borderChanges = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #e1e1e1 !important",
      borderRadius: "2px !important",
      boxShadow: "0 !important",

      "&:focus-within": {
        border: "1px solid #000000 !important",
      },
    }),
  };

  const onAllSearch = (e) => {
    let value = e.target.value;
    var y = [...allUserData];
    let x = y.filter((a) => {
      console.log("filter", a);
      return (
        (value != ""
          ? a.Names.toLowerCase().includes(value.toLowerCase())
          : a.Names) ||
        (value != ""
          ? a.Emails.toLowerCase().includes(value.toLowerCase())
          : a.Emails) ||
        (value != ""
          ? a.Designation.toLowerCase().includes(value.toLowerCase())
          : a.Designation) ||
        (value != ""
          ? a.OrganizationRole.toLowerCase().includes(value.toLowerCase())
          : a.OrganizationRole) ||
        (value != ""
          ? a.UserRole.toLowerCase().includes(value.toLowerCase())
          : a.UserRole) ||
        (value != ""
          ? a.UserStatus.toLowerCase().includes(value.toLowerCase())
          : a.UserStatus)
      );
    });

    console.log("filteredData", x);

    setRows([...x]);
  };
  useEffect(() => {
    if (Object.keys(filterFieldSection).length > 0) {
      var newData = [...allUserData];
      setRows(newData);
    }
  }, [allUserData]);

  useEffect(() => {
    let tem = [];
    if (Object.keys(roleListReducer.OrganaizationRolesList).length > 0) {
      roleListReducer.OrganaizationRolesList.map((data, index) => {
        let op = { value: data.pK_OrganizationRoleID, label: data.roleName };
        tem.push(op);
      });
      setOrganaizationRolesOptions(tem);
    }
  }, [roleListReducer.OrganaizationRolesList]);

  useEffect(() => {
    let tem = [];
    if (Object.keys(roleListReducer.UserRolesList).length > 0) {
      roleListReducer.UserRolesList.map((data, index) => {
        let op = { value: data.pK_URID, label: data.roleName };
        tem.push(op);
      });

      setUserRolesListNameOptions(tem);
    }
  }, [roleListReducer.UserRolesList]);

  useEffect(() => {
    let tem = [];
    console.log("abcd", roleListReducer.UserStatusList);
    if (Object.keys(roleListReducer.UserStatusList).length > 0) {
      roleListReducer.UserStatusList.map((data, index) => {
        let op = { value: data.pK_UserStatusID, label: data.statusName };
        tem.push(op);
      });

      setUserStatusListOptions(tem);
    }
  }, [roleListReducer.UserStatusList]);

  useEffect(() => {
    let tem = [];
    if (Object.keys(roleListReducer.UserRolesList).length > 0) {
      roleListReducer.UserRolesList.map((data, index) => {
        let op = { value: data.pK_URID, label: data.roleName };
        tem.push(op);
      });

      setUserRolesListNameOptions(tem);
    }
  }, [roleListReducer.UserRolesList]);

  const OrganaizationRoleHandler = (selectedOptions) => {
    setForSearchOrganization(selectedOptions);
    if (Object.keys(selectedOptions).length > 0) {
      setFilterFieldSection({
        ...filterFieldSection,
        OrganizationRoles: selectedOptions.label,
      });
    }
  };

  const UserRoleHandler = (selectedOptions) => {
    setForSearchUserRole(selectedOptions);
    if (Object.keys(selectedOptions).length > 0) {
      setFilterFieldSection({
        ...filterFieldSection,
        UserRoles: selectedOptions.label,
      });
    }
  };

  const StatusHandler = (selectedOptions) => {
    setForSearchUserStatus(selectedOptions);
    if (Object.keys(selectedOptions).length > 0) {
      setFilterFieldSection({
        ...filterFieldSection,
        UserStatus: selectedOptions.label,
      });
    }
  };

  return (
    <Container>
      <Row className={"mt-3"}>
        <Col lg={3} md={3} sm={6} xs={12}>
          <label className={styles["Edit-Main-Heading"]}>{t("All-user")}</label>
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
            placeholder={"Title..."}
            className="mx-2"
            labelClass="filter"
            change={onAllSearch}
          />
          <div className={styles["filterModal"]}>
            <img
              src={Paymenthistoryhamberge}
              width={20}
              height={20}
              onClick={openFilterModal}
            />
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
            text={"+" + " " + t("Add-users")}
            onClick={gotoAddUser}
            // icon={<PlusLg />}
            // iconClass="Plus-Icon"
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
            className="AllUserTable"
          />
        </Col>
      </Row>
      {adminReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      <Modal
        show={filterBarModal}
        setShow={() => {
          setFilterBarModal();
        }}
        ButtonTitle={ModalTitle}
        centered
        size={"md"}
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
                        type="email"
                        placeholder={t("Email")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.Emails.value || ""}
                      />
                      <Row>
                        <Col>
                          <p
                            className={
                              filterFieldSection.Emails.errorStatus
                                ? ` ${styles["errorMessage-AllUser"]} `
                                : `${styles["errorMessage-AllUser_hidden"]}`
                            }
                          >
                            {filterFieldSection.Emails.errorMessage}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={OrganizationRoles}
                        onKeyDown={(event) => enterKeyHandler(event, UserRoles)}
                        options={organaizationRolesOptions}
                        onChange={OrganaizationRoleHandler}
                        placeholder={t("Organization-role")}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        applyClass="form-control2"
                        name="OrganizationRoles"
                        value={forSearchOrganization}
                        styles={borderChanges}
                      />
                      {/* <Select
                        ref={OrganizationRoles}
                        onKeyDown={(event) => enterKeyHandler(event, UserRoles)}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        name="OrganizationRoles"
                        placeholder={t("Please-select")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.OrganizationRoles}
                      /> */}
                    </Col>

                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={UserRoles}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, UserStatus)
                        }
                        options={userRolesListNameOptions}
                        onChange={UserRoleHandler}
                        placeholder={t("User-role")}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        applyClass="form-control2"
                        value={forSearchtUserRole}
                        name="UserRoles"
                        styles={borderChanges}
                      />
                      {/* <Select
                        ref={UserRoles}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, EnableRoles)
                        }
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        name="UserRoles"
                        placeholder={t("Please-select")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.UserRoles}
                      /> */}
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={UserStatus}
                        onKeyDown={(event) => enterKeyHandler(event, Names)}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        options={userStatusListOptions}
                        name="User-status"
                        placeholder={t("User-status")}
                        applyClass="form-control2"
                        onChange={StatusHandler}
                        value={forSearchUserStatus}
                        styles={borderChanges}
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
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end gap-4 "
                  >
                    <Button
                      text={t("Reset")}
                      className={styles["icon-modal-ResetBtn"]}
                      onClick={userResetHandler}
                    />
                    <Button
                      className={styles["icon-modal-SearchBtn"]}
                      text={t("Search")}
                      onClick={searchFunc}
                    />
                  </Col>

                  {/* <Col
                    lg={3}
                    md={3}
                    sm={12}
                    xs={12}
                    
                  >
                    
                  </Col> */}
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
