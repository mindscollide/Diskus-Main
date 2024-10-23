import React, { useState, useRef, useEffect } from "react";
import styles from "./EditUser.module.css";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import Paymenthistoryhamberge from "../../../../assets/images/newElements/paymenthistoryhamberge.png";
import { useTranslation } from "react-i18next";
import EditIcon2 from "../../../../assets/images/Edit-Icon-blck.png";
import { validateEmailEnglishAndArabicFormat } from "../../../../commen/functions/validations";
import {
  countryName,
  countryNameforPhoneNumber,
} from "../../AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";

import Select from "react-select";
import {
  Button,
  TextField,
  Table,
  Modal,
  Loader,
  Notification,
} from "../../../../components/elements";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
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
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const EditUser = ({ ModalTitle }) => {
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);
  const [deleteEditModal, setDeleteEditModal] = useState(false);
  const [errorBar, setErrorBar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const { adminReducer, roleListReducer } = state;

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

  console.log("CountrySelected", selected);

  const { t } = useTranslation();

  const [rows, setRows] = useState([]);

  const [allUserData, setAllUserData] = useState([]);

  //for enter key
  const Name = useRef(null);
  const Designation = useRef(null);
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
  const [isUserNotUpdate, setIsUserNotUpdate] = useState(false);
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
    FK_CCID: 0,
  });
  console.log("editUserSectioneditUserSectioneditUserSection", editUserSection);
  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary == country;
    });
    setEditUserSection({ ...editUserSection, FK_CCID: a.id });
    console.log("Selected-Values", a);
  };

  //for reset handler
  const editResetHandler = () => {
    setFilterFieldSection({
      Names: "",
      Emails: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationRoles: "",
      UserStatus: "",
      UserRoles: "",
      FK_CCID: 0,
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
    let value = e.target.value.trimStart();

    if (name === "Name" && value !== "") {
      if (value !== "") {
        if (value.length <= 100) {
          setEditUserSection({
            ...editUserSection,
            Name: value,
          });
        } else {
          setEditUserSection({
            ...editUserSection,
            Name: editUserSection.Name,
          });
        }
      }
    } else if (name === "Name" && value === "") {
      setEditUserSection({
        ...editUserSection,
        Name: "",
      });
    }
    if (name === "Designation" && value !== "") {
      if (value !== "") {
        if (value.length <= 100) {
          setEditUserSection({
            ...editUserSection,
            Designation: value,
          });
        } else {
          setEditUserSection({
            ...editUserSection,
            Designation: editUserSection.Designation,
          });
        }
      }
    } else if (name === "Designation" && value === "") {
      setEditUserSection({
        ...editUserSection,
        Designation: "",
      });
    }
    if (name === "MobileNumber" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setEditUserSection({
          ...editUserSection,
          MobileNumber: valueCheck,
        });
      }
    } else if (name === "MobileNumber" && value === "") {
      setEditUserSection({
        ...editUserSection,
        MobileNumber: "",
      });
    }

    //for Filter section
    if (name === "Names" && value !== "") {
      setErrorBar(false);
      if (value !== "") {
        if (value.length <= 100) {
          setFilterFieldSection({
            ...filterFieldSection,
            Names: value,
          });
        } else {
          setFilterFieldSection({
            ...filterFieldSection,
            Names: filterFieldSection.Names,
          });
        }
      }
    } else if (name === "Names" && value === "") {
      setErrorBar(true);
      setFilterFieldSection({
        ...filterFieldSection,
        Names: "",
      });
    }
    let value2 = e.target.value;
    let newValue = value2.trim();
    if (name === "Emails" && newValue !== "") {
      if (newValue.length <= 100) {
        if (validateEmailEnglishAndArabicFormat(newValue)) {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: newValue.trimStart(),
              errorMessage: "",
              errorStatus: false,
            },
          });
        } else {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: newValue.trimStart(),
              errorMessage: "Email Should be in Email Format",
              errorStatus: true,
            },
          });
        }
      } else {
        if (
          validateEmailEnglishAndArabicFormat(filterFieldSection.Emails.value)
        ) {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: filterFieldSection.Emails.value.trimStart(),
              errorMessage: "",
              errorStatus: false,
            },
          });
        } else {
          setFilterFieldSection({
            ...filterFieldSection,
            Emails: {
              value: filterFieldSection.Emails.value.trimStart(),
              errorMessage: filterFieldSection.Emails.errorMessage,
              errorStatus: filterFieldSection.Emails.errorStatus,
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
    let newData = {
      OrganizationID: parseInt(OrganizationID),
      RequestingUserID: parseInt(RequestingUserID),
    };
    await dispatch(
      deleteUserAction(navigate, dataForDelete, setDeleteEditModal, newData, t)
    );
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
      FK_NumberWorldCountryID: editUserSection.FK_CCID,
    };
    await dispatch(
      editUserAction(
        navigate,
        setIsUpdateSuccessfully,
        setEditModal,
        updateData,
        t,
        setIsUserNotUpdate
      )
    );
    let OrganizationID = localStorage.getItem("organizationID");
    let RequestingUserID = localStorage.getItem("userID");
    let newData = {
      OrganizationID: parseInt(OrganizationID),
      RequestingUserID: parseInt(RequestingUserID),
    };
    await dispatch(AllUserAction(navigate, newData, t));
  };

  //Open modal on reset button it's created temperary to check modal
  const openOnResetBtn = async (data) => {
    console.log("datadata", data);
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
      FK_CCID: data.pK_CCID,
    };
    var editorganization = {
      value: data.OrganizationRoleID,
      label: data.OrganizationRole,
    };
    let countryNameData = Object.values(countryNameforPhoneNumber).map(
      (countryFullData, index) => {
        return countryFullData;
      }
    );
    let selectedCountryFromObject = Object.values(countryNameData).find(
      (SlectedDataOfCountry, index) => {
        return SlectedDataOfCountry.id === data.CountryCode;
      }
    );
    setSelected(selectedCountryFromObject.primary);

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

  // Close Success modal
  const closeUpdateSuccessFull = () => {
    setIsUpdateSuccessfully(false);
  };

  //open filter modal on icon click
  const openFilterModal = async () => {
    setFilterBarModal(true);
    setFilterFieldSection({
      Names: "",
      OrganizationRoles: "",
      UserStatus: "",
      UserRoles: "",
      Emails: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
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

    await setEditUserSection(editData);
    setDeleteEditModal(true);
    setFilterBarModal(false);
  };

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
            <p
              className={`${"Disabled-Close"} ${
                styles["Edit-title-col-Name-Bold"]
              }`}
            >
              {text}
            </p>
          );
        } else {
          return <p className={styles["Edit-title-col-Name-Bold"]}>{text}</p>;
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
          return <p className="m-0 Disabled-Close">{text}</p>;
        } else {
          return (
            <a className={styles["edit-user-email"]} href={`mailto:${text}`}>
              {text}
            </a>
          );
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
                <p className="m-0 userName FontArabicRegular">
                  {record.UserStatus}
                </p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Disabled") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-disabled"></span>
                <p className="m-0 userName FontArabicRegular">
                  {record.UserStatus}
                </p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Locked") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-locked"></span>
                <p className="m-0 userName FontArabicRegular">
                  {record.UserStatus}
                </p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Dormant") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-dormant"></span>
                <p className="m-0 userName FontArabicRegular">
                  {record.UserStatus}
                </p>
              </div>
            </>
          );
        } else if (record.UserStatus === "Closed") {
          return (
            <>
              <div className="d-flex">
                <span className="userstatus-signal-closed"></span>
                <p className="m-0 Disabled-Close userName FontArabicRegular">
                  {record.UserStatus}
                </p>
              </div>
            </>
          );
        }
      },
    },
    {
      title: t(""),
      dataIndex: "Delete",
      key: "Delete",
      align: "center",
      render: (text, record) => {
        if (record.UserStatus === "Closed") {
          return <></>;
        } else {
          if (record.UserRoleID === 1) {
            return;
          } else {
            return (
              <>
                <div
                  onClick={() => {
                    openOnResetBtn(record);
                  }}
                  className="edit-icon-edituser icon-edit-list icon-size-one beachGreen"
                >
                  <i>
                    <img draggable="false" src={EditIcon2} alt="" />
                  </i>
                </div>
                <i style={{ cursor: "pointer", color: "#000" }}>
                  <Trash
                    size={22}
                    onClick={() => {
                      openDeleteModal(record);
                    }}
                  />
                </i>
              </>
            );
          }
        }
      },
    },
  ];
  const searchFunc = () => {
    var y = [...allUserData];
    console.log("filter", filterFieldSection);

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
          : a.Emails) &&
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

    console.log("filter", x);

    setRows([...x]);
    setFilterBarModal(false);
    setFilterFieldSection({
      Names: "",
      OrganizationRoles: "",
      UserStatus: "",
      UserRoles: "",
      Emails: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
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
    dispatch(AllUserAction(navigate, newData, t));
    dispatch(GetAllUserRoles(navigate, t));
    dispatch(GetAllUserStatus(navigate, t));
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
          CountryCode: data.fK_WorldCountryID,
        };
        tem.push(convertValue);
      });
      setAllUserData(tem);
    }
  }, [adminReducer.AllOrganizationUserList]);

  useEffect(() => {
    if (
      adminReducer.UpdateOrganizationMessageResponseMessage !== "" &&
      adminReducer.UpdateOrganizationMessageResponseMessage !==
        t("The-user-has-been-edited-successfully")
    ) {
      showMessage(
        adminReducer.UpdateOrganizationMessageResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (
      adminReducer.AllOrganizationResponseMessage !== "" &&
      adminReducer.AllOrganizationResponseMessage !== "" &&
      adminReducer.AllOrganizationResponseMessage !==
        t("The-user-has-been-edited-successfully")
    ) {
      showMessage(
        adminReducer.AllOrganizationResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (
      adminReducer.DeleteOrganizationMessageResponseMessage !== "" &&
      adminReducer.DeleteOrganizationMessageResponseMessage !== ""
    ) {
      showMessage(
        adminReducer.DeleteOrganizationMessageResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (
      adminReducer.ResponseMessage !== "" &&
      adminReducer.ResponseMessage !== "" &&
      adminReducer.ResponseMessage !==
        t("The-user-has-been-edited-successfully") &&
      adminReducer.ResponseMessage !==
        t("The-user-has-been-updated-but-the-status-has-not-been-updated")
    ) {
      showMessage(adminReducer.ResponseMessage, "success", setOpen);

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

  // to change select border color functionality
  const borderChanges = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #e1e1e1 !important",
      borderRadius: "4px !important",
      boxShadow: "0 !important",

      "&:focus-within": {
        border: "1px solid #e1e1e1 !important",
      },
    }),
  };

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
      console.log("StatusHandler", selectedOptions.label);

      setFilterFieldSection({
        ...filterFieldSection,
        UserStatus: selectedOptions.label,
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
    if (editUserRole != "") {
      if (selectedOptions.value === 4) {
        if (editUserSection.UserRoleID === 2) {
          setEditOrganization(selectedOptions);
          if (Object.keys(selectedOptions).length > 0) {
            setEditUserSection({
              ...editUserSection,
              OrganizationRole: selectedOptions.label,
              OrganizationRoleID: selectedOptions.value,
            });
          }
        } else {
          showMessage(
            t("This-user-role-can-not-be-organization-admin"),
            "error",
            setOpen
          );
          setEditOrganization("");
          setEditUserSection({
            ...editUserSection,
            OrganizationRole: "",
            OrganizationRoleID: 0,
          });
        }
      } else if (selectedOptions.value != 4) {
        if (editUserSection.UserRoleID != 2) {
          setEditOrganization(selectedOptions);
          if (Object.keys(selectedOptions).length > 0) {
            setEditUserSection({
              ...editUserSection,
              OrganizationRole: selectedOptions.label,
              OrganizationRoleID: selectedOptions.value,
            });
          }
        } else {
          showMessage(
            t("This-user-role-can-not-be-other-then-organization-admin"),
            "error",
            setOpen
          );
          setEditOrganization("");
          setEditUserSection({
            ...editUserSection,
            OrganizationRole: "",
            OrganizationRoleID: 0,
          });
        }
      } else {
      }
    } else {
      setEditOrganization(selectedOptions);
      if (Object.keys(selectedOptions).length > 0) {
        setEditUserSection({
          ...editUserSection,
          OrganizationRole: selectedOptions.label,
          OrganizationRoleID: selectedOptions.value,
        });
      }
    }
  };

  const EditUserRoleHandler = async (selectedOptions) => {
    if (editOrganization != "") {
      if (selectedOptions.value === 2) {
        if (editUserSection.OrganizationRoleID === 4) {
          setEditUserRole(selectedOptions);

          if (Object.keys(selectedOptions).length > 0) {
            setEditUserSection({
              ...editUserSection,
              UserRole: selectedOptions.label,
              UserRoleID: selectedOptions.value,
            });
          }
        } else {
          showMessage(
            t("elected-organaization-role-can-only-be-user"),
            "error",
            setOpen
          );
          setEditUserRole("");
          setEditUserSection({
            ...editUserSection,
            UserRole: "",
            UserRoleID: 0,
          });
        }
      } else if (parseInt(selectedOptions.value) != 2) {
        if (parseInt(editUserSection.OrganizationRoleID) != 4) {
          setEditUserRole(selectedOptions);

          if (Object.keys(selectedOptions).length > 0) {
            setEditUserSection({
              ...editUserSection,
              UserRole: selectedOptions.label,
              UserRoleID: selectedOptions.value,
            });
          }
        } else {
          showMessage(
            t("Selected-organaization-role-can-not-be-user"),
            "error",
            setOpen
          );
          setEditUserRole("");
          setEditUserSection({
            ...editUserSection,
            UserRole: "",
            UserRoleID: 0,
          });
        }
      }
    } else {
      setEditUserRole(selectedOptions);

      if (Object.keys(selectedOptions).length > 0) {
        setEditUserSection({
          ...editUserSection,
          UserRole: selectedOptions.label,
          UserRoleID: selectedOptions.value,
        });
      }
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

  const handleClose = () => {
    setFilterBarModal(false);
    setEditModal(false);
    setDeleteEditModal(false);
  };

  return (
    <Container>
      <Row className={"mt-3 row"}>
        <Col lg={3} md={3} sm={6} xs={12} className="m-0 p-0 ">
          <label className={styles["Edit-Main-Heading"]}>
            {t("Edit-user")}
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
            placeholder={t("Title")}
            className="mx-2 p-0"
            labelclass="filter"
            change={onAllSearch}
          />
          <div className={styles["filterModal"]}>
            <img
              draggable="false"
              src={Paymenthistoryhamberge}
              alt=""
              width={18}
              height={18}
              onClick={openFilterModal}
            />
          </div>
        </Col>
      </Row>

      <Row className={styles["tablecolumnrow"]}>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Table
            rows={rows}
            column={EditUserColumn}
            scroll={{ y: 400 }}
            pagination={false}
            className={"EditUserModal"}
          />
        </Col>
      </Row>
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
      {adminReducer.Loading ? <Loader /> : null}
      <Modal
        show={
          editModal ||
          isUpdateSuccessfully ||
          filterBarModal ||
          deleteEditModal ||
          isUserNotUpdate
        }
        setShow={() => {
          setEditModal();
          setFilterBarModal();
          setIsUpdateSuccessfully();
          setDeleteEditModal();
          setIsUserNotUpdate();
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
        modalBodyClassName="EditUserModalBody"
        modalParentClass="EditUserModal"
        modalFooterClassName="EditUserModalFooter"
        modalHeaderClassName="EditUserModalHeader"
        onHide={handleClose}
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
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Name")}</p>
                    </Col>

                    <Col lg={7} md={7} sm={12} xs={12}>
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
                      <span
                        className=" color-5a5a5a"
                        style={{ fontSize: "0.5rem" }}
                      >
                        ({t("Maximum-characters-200-alphabets-only")})
                      </span>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Designation")}
                      </p>
                    </Col>

                    <Col lg={7} md={7} sm={12} xs={12}>
                      <Form.Control
                        placeholder="Designation"
                        className={styles["formcontrol-names-fields"]}
                        ref={Designation}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, MobileNumber)
                        }
                        maxLength={200}
                        applyClass="form-control2"
                        name="Designation"
                        onChange={EditUserHandler}
                        value={editUserSection.Designation}
                      />
                    </Col>
                  </Row>

                  <Row className={styles["lineOnBottom"]}>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <label className={styles["Edit-Name-label"]}>
                        {t("Mobile")}
                      </label>
                    </Col>
                    <Col lg={7} md={7} sm={12} xs={12}>
                      <Row>
                        <Col
                          sm={12}
                          md={3}
                          lg={3}
                          className={styles["react-flag-Edit"]}
                        >
                          <ReactFlagsSelect
                            fullWidth={false}
                            selected={selected}
                            onSelect={handleSelect}
                            placeholder={"Select Co...."}
                            customLabels={countryName}
                            searchable={true}
                          />
                        </Col>
                        <Col sm={12} md={9} lg={9}>
                          <Form.Control
                            ref={MobileNumber}
                            onKeyDown={(event) =>
                              enterKeyHandler(event, OrganizationRole)
                            }
                            className={styles["formcontrol-names-fields"]}
                            name="MobileNumber"
                            placeholder={"Enter Phone Number"}
                            applyClass="form-control2"
                            maxLength={15}
                            minLength={4}
                            onChange={EditUserHandler}
                            value={editUserSection.MobileNumber || ""}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Organization-role")}
                      </p>
                    </Col>

                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      xs={12}
                      className="Edit-user-col"
                    >
                      <Select
                        name="OrganizationRole"
                        ref={OrganizationRole}
                        onKeyDown={(event) => enterKeyHandler(event, UserRoles)}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-select")}
                        options={organaizationRolesOptions}
                        onChange={EditOrganaizationRoleHandler}
                        applyClass="form-control2"
                        value={editOrganization}
                        styles={borderChanges}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("User-role")}
                      </p>
                    </Col>

                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      xs={12}
                      className="Edit-user-col"
                    >
                      <Select
                        ref={UserRoles}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, UserStatus)
                        }
                        options={userRolesListNameOptions}
                        onChange={EditUserRoleHandler}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-select")}
                        applyClass="form-control2"
                        value={editUserRole}
                        styles={borderChanges}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("User-status")}
                      </p>
                    </Col>
                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      xs={12}
                      className="Edit-user-col"
                    >
                      <Select
                        ref={UserStatus}
                        onKeyDown={(event) => enterKeyHandler(event, Name)}
                        onChange={EditStatusHandler}
                        options={userStatusListOptions}
                        value={editUserStatus}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-select")}
                        applyClass="form-control2"
                        styles={borderChanges}
                        minMenuHeight={130}
                        maxMenuHeight={130}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Email")}</p>
                    </Col>
                    <Col lg={7} md={7} sm={12} xs={12}>
                      <Form.Control
                        disabled
                        placeholder="Email"
                        applyClass="form-control2"
                        className={styles["formcontrol-Email-fields"]}
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
                        labelclass="d-none"
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
                        labelclass="d-none"
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
                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className="Edit-user-col"
                    >
                      <Select
                        ref={OrganizationRoles}
                        onKeyDown={(event) => enterKeyHandler(event, UserRoles)}
                        name="OrganizationRoles"
                        options={organaizationRolesOptions}
                        onChange={OrganaizationRoleHandler}
                        className={
                          styles["formcontrol-fieldselectfor-filtermodal"]
                        }
                        placeholder={t("Organization-role")}
                        applyClass="form-control2"
                        value={forSearchOrganization}
                        styles={borderChanges}
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className="Edit-user-col"
                    >
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
                        placeholder={t("User-role")}
                        applyClass="form-control2"
                        value={forSearchtUserRole}
                        styles={borderChanges}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className="Edit-user-col"
                    >
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
                      {t("Delete-user-confirmation")}
                    </label>
                  </Col>
                </Row>
              </>
            ) : isUserNotUpdate ? (
              <>
                <Row className="mb-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <label
                      className={styles["successfull-label-status-not-updated"]}
                    >
                      {t(
                        "Upgrade-your-package-to-enable-the-user-other-changes-if-any-are-updated"
                      )}
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
                  className="d-flex justify-content-center"
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
                      text={t("Ok")}
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
                      className={styles["icon-modal-ResetBtn"]}
                      onClick={editResetHandler}
                    />
                    <Button
                      className={styles["icon-modal-SearchBtn"]}
                      text={t("Search")}
                      onClick={searchFunc}
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
                      className={styles["ResetBtn-Edit-Dlt"]}
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
                      className={styles["ProceedBtn-Edit-Dlt"]}
                      text={t("Proceed")}
                      onClick={handleDelete}
                    />
                  </Col>
                </Row>
              </Col>
            ) : isUserNotUpdate ? (
              <>
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
                        text={t("Ok")}
                        onClick={() => setIsUserNotUpdate(false)}
                      />
                    </Col>
                  </Row>
                </Col>
              </>
            ) : null}
          </>
        }
      />
    </Container>
  );
};

export default EditUser;
