import React, { useState, useRef, useMemo, useEffect } from "react";
import styles from "./EditUser.module.css";
import { useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { dataSet } from "./EditData";
import EditIcon from "../../../../assets/images/Edit-Icon.png";
import {
  validateEmail,
  validationEmail,
} from "../../../../commen/functions/validations";
import { countryName } from "../../AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";

import { validationEmailAction } from "../../../../store/actions/Auth2_actions";

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
  Loader,
  Notification,
} from "../../../../components/elements";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Sliders2, Trash } from "react-bootstrap-icons";
import {
  AllUserAction,
  editUserAction,
  cleareMessage,
  deleteUserAction,
} from "../../../../store/actions/Admin_AddUser";
import {
  GetAllUserRoles,
  GetAllUserStatus,
} from "../../../../store/actions/RolesList";
import { useSelector, useDispatch } from "react-redux";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const navigate = useNavigate();
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);
  const [deleteEditModal, setDeleteEditModal] = useState(false);
  const [errorBar, setErrorBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { adminReducer, roleListReducer } = state;
  const [nameErrorMessage, setNameErrorMessage] = useState(
    "Name Field Is Empty"
  );
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    "Email Field Is Empty"
  );

  const [email, setEmail] = useState("");

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryName).find((obj) => {
      return obj.primary == country;
    });
    console.log("Selected-Values", a);
  };

  console.log("CountrySelected", selected);

  const { t } = useTranslation();

  const [rows, setRows] = useState([]);

  const [rowSize, setRowSize] = useState(50);

  const PhoneHandler = async (selectedOptions) => {
    if (selectedOptions.phone != "") {
      setEditUserSection({
        ...editUserSection,
        ["MobileNumber"]: selectedOptions.phone,
      });
    } else {
      setEditUserSection({
        ...editUserSection,
        ["MobileNumber"]: "",
      });
    }
  };
  const [value, setValue] = useState();
  const options = useMemo(() => countryList().getData(), []);

  const [allUserData, setAllUserData] = useState([]);

  //for enter key
  const Name = useRef(null);
  const Designation = useRef(null);
  const CountryCode = useRef(null);
  const MobileNumber = useRef(null);
  const OrganizationRole = useRef(null);
  const Names = useRef(null);
  const Emails = useRef(null);
  const OrganizationRoles = useRef(null);
  const UserRoles = useRef(null);
  const UserStatus = useRef(null);

  const [userRolesListNameOptions, setUserRolesListNameOptions] = useState([]);
  const [userStatusListOptions, setUserStatusListOptions] = useState([]);
  const [organaizationRolesOptions, setOrganaizationRolesOptions] = useState(
    []
  );

  const [editOrganization, setEditOrganization] = useState([]);
  const [editUserStatus, setEditUserStatus] = useState([]);
  const [editUserRole, setEditUserRole] = useState([]);

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

  //state for EditUser
  const [editUserSection, setEditUserSection] = useState({
    Name: "",
    Designation: "",
    MobileNumber: "",
    OrganizationRole: "",
    OrganizationRoleID: 0,
    UserRole: "",
    UserRoleID: 0,
    Email: "",
    UserStatus: "",
    UserStatusID: 0,
    UserID: 0,
  });

  //for reset handler

  const editResetHandler = () => {
    setFilterFieldSection({
      Names: "",
      Emails: "",
      OrganizationRoles: "",
      UserStatus: "",
      UserRoles: "",
    });
    setForSearchOrganization([]);
    setForSearchUserStatus([]);
    setForSearchUserRole([]);
  };

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
          Name: valueCheck.trimStart(),
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
          Designation: valueCheck.trimStart(),
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
        setFilterFieldSection({
          ...filterFieldSection,
          Names: valueCheck.trimStart(),
        });
      }
    } else if (name === "Names" && value === "") {
      setErrorBar(true);
      setFilterFieldSection({
        ...filterFieldSection,
        Names: "",
      });
    }

    if (name === "Emails" && value !== "") {
      if (value !== "") {
        if (validationEmail(value)) {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: value.trimStart(),
              errorMessage: "",
              errorStatus: false,
            },
          });
        } else {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: value,
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

  //close modal on update button it's created temperary to check modal
  const closeOnUpdateBtn = () => {
    setDeleteEditModal(false);
    setIsUpdateSuccessfully(false);
    setEditModal(false);
    setFilterBarModal(false);
  };
  const handleDelete = async () => {
    let RequestingUserID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    var dataForDelete = {
      OrganizationID: parseInt(OrganizationID),
      RequestingUserID: parseInt(RequestingUserID),
      UserID: parseInt(editUserSection.UserID),
    };
    console.log("dataForDelete", dataForDelete);

    let newData = {
      OrganizationID: parseInt(OrganizationID),
      RequestingUserID: parseInt(RequestingUserID),
    };
    await dispatch(
      deleteUserAction(dataForDelete, setDeleteEditModal, newData, t)
    );

    await dispatch(AllUserAction(newData, t));
  };

  //close modal on update button it's created temperary to check modal
  const handleUpdate = async () => {
    var updateData = {
      UserID: parseInt(editUserSection.UserID),
      StatusID: parseInt(editUserSection.UserStatusID),
      UserName: editUserSection.Name,
      Designation: editUserSection.Designation,
      MobileNumber: editUserSection.MobileNumber,
      OrganizationRoleID: parseInt(editUserSection.OrganizationRoleID),
      UserRoleID: parseInt(editUserSection.UserRoleID),
    };

    await dispatch(
      editUserAction(setIsUpdateSuccessfully, setEditModal, updateData, t)
    );
    let OrganizationID = localStorage.getItem("organizationID");
    let RequestingUserID = localStorage.getItem("userID");
    let newData = {
      OrganizationID: parseInt(OrganizationID),
      RequestingUserID: parseInt(RequestingUserID),
    };
    await dispatch(AllUserAction(newData, t));
    // setFilterBarModal(false);
  };

  //Open modal on reset button it's created temperary to check modal
  const openOnResetBtn = async (data) => {
    var editData = {
      Name: data.Names,
      Designation: data.Designation,
      MobileNumber: data.MobileNumber,
      OrganizationRole: data.OrganizationRole,
      OrganizationRoleID: data.OrganizationRoleID,
      UserRole: data.UserRole,
      Email: data.Emails,
      UserStatus: data.UserStatus,
      UserStatusID: data.UserStatusID,
      UserID: data.UserID,
      UserRoleID: data.UserRoleID,
    };
    var editorganization = {
      value: data.OrganizationRoleID,
      label: data.OrganizationRole,
    };
    await setEditOrganization(editorganization);
    var edituserrole = {
      value: data.UserRoleID,
      label: data.UserRole,
    };
    await setEditUserRole(edituserrole);
    var edituserstatus = {
      value: data.UserStatusID,
      label: data.UserStatus,
    };
    await setEditUserStatus(edituserstatus);

    await setEditUserSection(editData);
    console.log("openOnResetBtn", editData);
    setEditModal(true);
  };

  // Open Success modal after update the success
  const updateSuccessFull = async () => {
    setIsUpdateSuccessfully(true);
  };

  // Close Success modal
  const closeUpdateSuccessFull = () => {
    let OrganizationID = localStorage.getItem("organizationID");
    let RequestingUserID = localStorage.getItem("userID");
    let newData = {
      OrganizationID: parseInt(OrganizationID),
      RequestingUserID: parseInt(RequestingUserID),
    };
    dispatch(AllUserAction(newData, t, setIsUpdateSuccessfully));
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
  };

  //open delete modal on ok click
  const openDeleteModal = async (data) => {
    console.log("openDeleteModal", data);
    var editData = {
      Name: data.Names,
      Designation: data.Designation,
      MobileNumber: data.MobileNumber,
      OrganizationRole: data.OrganizationRole,
      OrganizationRoleID: data.OrganizationRoleID,
      UserRole: data.UserRole,
      Email: data.Emails,
      UserStatus: data.UserStatus,
      UserStatusID: data.UserStatusID,
      UserID: data.UserID,
      UserRoleID: data.UserRoleID,
    };
    console.log("openDeleteModal", editData);

    await setEditUserSection(editData);
    console.log("openOnResetBtn", editData);
    setDeleteEditModal(true);
    setFilterBarModal(false);
  };

  const handlerSearch = () => {
    if (filterFieldSection.Names !== "" && filterFieldSection.Emails !== "") {
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

  const EditUserColumn = [
    {
      title: t("Name"),
      dataIndex: "Names",
      key: "Names",
      align: "left",
      sorter: (a, b) => a.Names.localeCompare(b.Names.toLowerCase),
      render: (text, record) => {
        return <p className={styles["userName"]}>{text}</p>;
      },
    },
    {
      title: t("Designation"),
      dataIndex: "Designation",
      key: "Designation",
      align: "left",
      sorter: (a, b) => a.Designation.localeCompare(b.Designation.toLowerCase),
      render: (text, record) => {
        return <p className={styles["userDesgination"]}>{text}</p>;
      },
    },
    {
      title: t("Email"),
      dataIndex: "Emails",
      key: "Emails",
      align: "left",
      render: (text, record) => {
        return <p className={styles["userEmail"]}>{text}</p>;
      },
    },

    {
      title: t("Organization-Role"),
      dataIndex: "OrganizationRole",
      key: "OrganizationRole",
      align: "left",
      sorter: (a, b) =>
        a.OrganizationRole.localeCompare(b.OrganizationRole.toLowerCase),
      render: (text, record) => {
        return <p className={styles["userOrganization"]}>{text}</p>;
      },
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
      render: (text, record) => {
        console.log("UserStatusText", text);
        if (text === "Enabled") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-enabled"></span>
                <p className="m-0 userName">{text}</p>
              </div>
            </>
          );
        } else if (text === "Disabled") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-disabled"></span>
                <p className="m-0 userName">{text}</p>
              </div>
            </>
          );
        } else if (text === "Locked") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-locked"></span>
                <p className="m-0 userName">{text}</p>
              </div>
            </>
          );
        } else if (text === "Dormant") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-dormant"></span>
                <p className="m-0 userName">{text}</p>
              </div>
            </>
          );
        } else if (text === "Closed") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-closed"></span>
                <p className="m-0 userName">{text}</p>
              </div>
            </>
          );
        }
      },
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
      render: (text, record) => {
        return (
          <div
            onClick={() => {
              openOnResetBtn(record);
            }}
            style={{ cursor: "pointer" }}
            className="icon-edit-list icon-size-one beachGreen"
          >
            <i>
              <img src={EditIcon} />
            </i>
          </div>
        );
      },
    },
    {
      title: t("Delete"),
      dataIndex: "Delete",
      key: "Delete",
      align: "center",
      render: (text, record) => {
        return (
          <i style={{ cursor: "pointer" }}>
            <Trash
              size={22}
              onClick={() => {
                openDeleteModal(record);
              }}
            />
          </i>
        );
      },
    },
  ];

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
        (filterFieldSection.Emails.value !== ""
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
      setRows(allUserData);
    }
  }, [allUserData]);

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
          UserRole: data.userRole,
          Emails: data.email,
          Designation: data.designation,
          OrganizationRoleID: data.organizationRoleID,
          UserID: data.userID,
          UserRoleID: data.userRoleID,
          UserStatus: data.userStatus,
          UserStatusID: data.userStatusID,
          MobileNumber: data.mobileNumber,
        };
        tem.push(convertValue);
      });
      console.log("setAllUserData", tem);
      setAllUserData(tem);
    }
  }, [adminReducer.AllOrganizationUserList]);

  // useEffect(() => {
  //   if (adminReducer.ResponseMessage != "") {
  //     console.log("open", open);

  //     setTimeout(() => {
  //       setOpen({
  //         ...open,
  //         open: true,
  //         message: adminReducer.ResponseMessage,
  //       });
  //     }, 5000);
  //     dispatch(cleareMessage());
  //   }
  // }, [adminReducer.ResponseMessage]);
  useEffect(() => {
    if (adminReducer.UpdateOrganizationMessageResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: adminReducer.UpdateOrganizationMessageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (adminReducer.AllOrganizationResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: adminReducer.AllOrganizationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (adminReducer.DeleteOrganizationMessageResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: adminReducer.DeleteOrganizationMessageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (adminReducer.ResponseMessage !== "") {
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
    } else {
    }
  }, [
    adminReducer.UpdateOrganizationMessageResponseMessage,
    adminReducer.AllOrganizationResponseMessage,
    adminReducer.DeleteOrganizationMessageResponseMessage,
    adminReducer.ResponseMessage,
  ]);
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

  const UserRoleHandler = async (selectedOptions) => {
    setForSearchUserRole(selectedOptions);
    if (Object.keys(selectedOptions).length > 0) {
      setFilterFieldSection({
        ...filterFieldSection,
        UserRoles: selectedOptions.label,
      });
    }
  };

  const StatusHandler = async (selectedOptions) => {
    setForSearchUserStatus(selectedOptions);
    if (Object.keys(selectedOptions).length > 0) {
      setFilterFieldSection({
        ...filterFieldSection,
        UserRoles: selectedOptions.label,
      });
    }
  };

  const OrganaizationRoleHandler = async (selectedOptions) => {
    setForSearchOrganization(selectedOptions);
    if (Object.keys(selectedOptions).length > 0) {
      setFilterFieldSection({
        ...filterFieldSection,
        OrganizationRoles: selectedOptions.label,
      });
    }
  };

  const EditOrganaizationRoleHandler = async (selectedOptions) => {
    setEditOrganization(selectedOptions);
    if (Object.keys(selectedOptions).length > 0) {
      setEditUserSection({
        ...editUserSection,
        OrganizationRole: selectedOptions.label,
        OrganizationRoleID: selectedOptions.value,
      });
    }
  };

  const EditUserRoleHandler = async (selectedOptions) => {
    setEditUserRole(selectedOptions);

    if (Object.keys(selectedOptions).length > 0) {
      setEditUserSection({
        ...editUserSection,
        UserRole: selectedOptions.label,
        UserRoleID: selectedOptions.value,
      });
    }
  };

  const EditStatusHandler = async (selectedOptions) => {
    setEditUserStatus(selectedOptions);

    if (Object.keys(selectedOptions).length > 0) {
      setEditUserSection({
        ...editUserSection,
        UserStatus: selectedOptions.label,
        UserStatusID: selectedOptions.value,
      });
    }
  };

  return (
    <Container>
      <Row
        className={"mt-5  d-flex justify-content-start align-items-center p-0"}
      >
        <Col lg={3} md={3} sm={6} xs={12} className="m-0 p-0 ">
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
            className="mx-2 p-0"
            labelClass="filter"
            change={onAllSearch}
          />
          <div className={styles["filterModal"]}>
            <Sliders2 onClick={openFilterModal} />
          </div>
        </Col>
        {/* <Col
          lg={3}
          md={3}
          sm={12}
          xs={12}
          className="d-flex justify-content-end"
        >
          <Button
            className={styles["btnEditReset"]}
            text={t("Reset")}
            onClick={openOnResetBtn}
          />
        </Col> */}

        {/* <Col lg={1} md={1} sm={12} className="d-flex justify-content-end">
          <Button
            className={styles["btnEditReset"]}
            text="Search"
            onClick={updateSuccessFull}
          />
        </Col> */}
      </Row>

      <Row className={styles["tablecolumnrow"]}>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Table
            rows={rows}
            column={EditUserColumn}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: rowSize,
              showSizeChanger: true,
              pageSizeOptions: ["100 ", "150", "200"],
            }}
          />
        </Col>
      </Row>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {adminReducer.Loading ? <Loader /> : null}
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
            ? filterBarModal && deleteEditModal === "sm"
            : "md"
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
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <label className={styles["Edit-label-heading"]}>
                        {t("Edit")}
                      </label>
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Name")}</p>
                    </Col>

                    <Col lg={6} md={6} sm={12} xs={12}>
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
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Designation")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={12} xs={12}>
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

                  {/* <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Mobile")}</p>
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-center align-items-center "
                    >
                      <PhoneInput
                        ref={MobileNumber}
                        value={editUserSection.MobileNumber}
                        onChange={(phone) => PhoneHandler({ phone })}
                        className={styles["formcontrol-phone-fields"]}
                        name="Mobile"
                        defaultCountry="PK"
                        maxLength={50}
                        placeholder={t("Enter-Phone-Number")}
                        countryCodeEditable={false}
                      />
                    </Col>
                  </Row> */}

                  <Row className={styles["lineOnBottom"]}>
                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <label className={styles["Edit-Name-label"]}>
                        {t("Mobile")}
                      </label>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Row>
                        <Col
                          sm={12}
                          md={4}
                          lg={4}
                          className={styles["react-flag-Edit"]}
                        >
                          <ReactFlagsSelect
                            fullWidth={false}
                            selected={selected}
                            // onSelect={(code) => setSelected(code)}
                            onSelect={handleSelect}
                            placeholder={"Select Co...."}
                            customLabels={countryName}
                            searchable={true}
                            // onChange={(phone) => PhoneHandler({ phone })}
                            // className={styles["react-flag"]}
                          />
                        </Col>
                        <Col sm={12} md={8} lg={8}>
                          <Form.Control
                            className={styles["formcontrol-names-fields"]}
                            name="MobileNumber"
                            placeholder={"Enter Phone Number"}
                            applyClass="form-control2"
                            maxLength={10}
                            // onChange={PhoneHandler}
                            onChange={EditUserHandler}
                            value={editUserSection.MobileNumber || ""}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Organization-Role")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        name="OrganizationRole"
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        options={organaizationRolesOptions}
                        onChange={EditOrganaizationRoleHandler}
                        applyClass="form-control2"
                        value={editOrganization}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("User-Role")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        options={userRolesListNameOptions}
                        onChange={EditUserRoleHandler}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        value={editUserRole}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("UserStatus")}
                      </p>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        onChange={EditStatusHandler}
                        options={userStatusListOptions}
                        value={editUserStatus}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Email")}</p>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Form.Control
                        disabled
                        placeholder="Email"
                        applyClass="form-control2"
                        className={styles["formcontrol-names-fields"]}
                        value={editUserSection.Email}
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
                      {t("Successfully-updated")}
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
                        value={filterFieldSection.Names}
                      />
                      {/* <Row>
                        <Col>
                          <p
                            className={
                              errorBar || filterFieldSection.Names === ""
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
                        type="email"
                        placeholder={t("Email")}
                        applyClass="form-control2"
                        onChange={EditUserHandler}
                        value={filterFieldSection.Emails.value || ""}
                      />
                      {/* <Row>
                        <Col>
                          <p
                            className={
                              errorBar || filterFieldSection.Emails === ""
                                ? ` ${styles["name-error-Message"]}`
                                : `${styles["name-errorMessage_hidden"]}`
                            }
                          >
                            {emailErrorMessage}
                          </p>
                        </Col>
                      </Row> */}
                      <Row>
                        <Col>
                          <p
                            className={
                              filterFieldSection.Emails.errorStatus
                                ? ` ${styles["errorMessage-Edit"]} `
                                : `${styles["errorMessage-Edit_hidden"]}`
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
                        name="OrganizationRoles"
                        options={organaizationRolesOptions}
                        onChange={OrganaizationRoleHandler}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        value={forSearchOrganization}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={UserRoles}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, UserStatus)
                        }
                        name="UserRoles"
                        options={userRolesListNameOptions}
                        onChange={UserRoleHandler}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        value={forSearchtUserRole}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={UserStatus}
                        onKeyDown={(event) => enterKeyHandler(event, Names)}
                        options={userStatusListOptions}
                        onChange={StatusHandler}
                        name="UserStatus"
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        placeholder={t("User Status")}
                        applyClass="form-control2"
                        value={forSearchUserStatus}
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
                      {t("DeleteUserConfirmation")}
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
                    onClick={handleUpdate}
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
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end gap-3"
                  >
                    <Button
                      text={t("Reset")}
                      className={styles["icon-filtermodal-ResetBtn"]}
                      onClick={editResetHandler}
                      // onClick={closeOnUpdateBtn}
                    />
                    <Button
                      className={styles["icon-modal-ResetBtn"]}
                      text={t("Search")}
                      onClick={searchFunc}
                      // onClick={openDeleteModal}
                    />
                  </Col>
                </Row>
              </Col>
            ) : deleteEditModal ? (
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-4">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["icon-modal-ResetBtn"]}
                      onClick={closeOnUpdateBtn}
                    />
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      className={styles["icon-filtermodal-SearrcchhBtn"]}
                      text={t("Proceed")}
                      onClick={handleDelete}
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
