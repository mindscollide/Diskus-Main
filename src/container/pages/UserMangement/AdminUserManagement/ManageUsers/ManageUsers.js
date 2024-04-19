import React, { useEffect, useState } from "react";
import styles from "./ManageUsers.module.css";
import searchicon from "../../../../../assets/images/searchicon.svg";
import EditIcon2 from "../../../../../assets/images/Edit-Icon-blck.png";
import { Col, Container, Row } from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";
import BlackCrossIcon from "../../../../../assets/images/BlackCrossIconModals.svg";
import whiteCrossIcon from "../../../../../assets/images/WhiteCrossIcon.svg";
import {
  Button,
  Checkbox,
  Table,
  TextField,
  Loader,
} from "../../../../../components/elements";
import greenCheck from "../../../../../assets/images/greenCheck.svg";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
  showDeleteUsersModal,
  showEditUserModal,
} from "../../../../../store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import DeleteUserModal from "../../ModalsUserManagement/DeleteUserModal/DeleteUserModal";
import { useSelector } from "react-redux";
import EditUserModal from "../../ModalsUserManagement/EditUserModal/EditUserModal";
import SuccessfullyUpdateModal from "../../ModalsUserManagement/SuccessFullyUpdatedModal/SuccessfullyUpdateModal";
import { AllOrganizationsUsersApi } from "../../../../../store/actions/UserManagementActions";
const ManageUsers = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let organizationID = localStorage.getItem("organizationID");

  let userID = localStorage.getItem("userID");

  const { UserMangementReducer, UserManagementModals } = useSelector(
    (state) => state
  );

  //States
  const [searchbox, setsearchbox] = useState(false);

  const [userTrialAlert, setUserTrialAlert] = useState(true);

  const [showSearches, setshowSearches] = useState(false);

  const [manageUserGrid, setManageUserGrid] = useState([]);

  const [editModalData, setEditModalData] = useState(null);

  const [deleteModalData, setDeleteModalData] = useState(null);

  const [searchDetails, setsearchDetails] = useState({
    Name: "",
    Email: "",
    Status: {
      value: "",
      label: "",
    },
  });

  const [flagForStopRerendring, setFlagForStopRerendring] = useState(false);

  //AllOrganizationsUsers Api
  useEffect(() => {
    if (!flagForStopRerendring) {
      try {
        let data = {
          OrganizationID: Number(organizationID),
          RequestingUserID: Number(userID),
        };
        dispatch(AllOrganizationsUsersApi(navigate, t, data));
      } catch {}
      setFlagForStopRerendring(true);
    }

    return () => {
      setUserTrialAlert(true);
      setshowSearches(false);
      setsearchDetails({
        Name: "",
        Email: "",
        Status: {
          value: 0,
          label: "",
        },
      });
    };
  }, [flagForStopRerendring]);

  //AllOrganizationsUsers Api Data
  useEffect(() => {
    const Users = UserMangementReducer.allOrganizationUsersData;
    if (
      Users &&
      Users.organizationUsers &&
      Users.organizationUsers.length > 0
    ) {
      setManageUserGrid(
        UserMangementReducer.allOrganizationUsersData.organizationUsers
      );
    } else {
      setManageUserGrid([]);
    }
  }, [UserMangementReducer.allOrganizationUsersData]);

  //Table Columns All Users
  const ManageUsersColumn = [
    {
      title: t("Name"),
      dataIndex: "userName",
      key: "userName",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.Names.localeCompare(b.Names.toLowerCase),
      render: (text, record) => {
        return (
          <>
            <span className={styles["NameStylesTable"]}>{record.userName}</span>
          </>
        );
      },
    },
    {
      title: t("Designation"),
      dataIndex: "designation",
      key: "designation",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.Designation.localeCompare(b.Designation.toLowerCase),
      render: (text, record) => {
        return (
          <>
            <span className={styles["DesignationStyles"]}>
              {record.designation}
            </span>
          </>
        );
      },
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      align: "left",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            <span className={styles["DesignationStyles"]}>{record.email}</span>
          </>
        );
      },
    },
    {
      title: t("Is-admin-also"),
      dataIndex: "userRole",
      key: "userRole",
      align: "center",
      ellipsis: true,
      sorter: (a, b) =>
        a.OrganizationRole.localeCompare(b.OrganizationRole.toLowerCase),
      render: (text, record) => {
        console.log(record, "recordrecordrecord");
        return (
          <>
            {(() => {
              if (record.userRole === "AdminUser") {
                return <img src={greenCheck} alt="" />;
              } else {
                return;
              }
            })()}
          </>
        );
      },
    },
    {
      title: "User Status",
      dataIndex: "userStatus",
      key: "userStatus",
      align: "left",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            {(() => {
              if (record.userStatus === "Enabled") {
                return (
                  <div className="d-flex">
                    <span className="userstatus-signal-enabled"></span>
                    <p className="m-0 userName FontArabicRegular">Enabled</p>
                  </div>
                );
              } else if (record.userStatus === "Disabled") {
                return (
                  <div className="d-flex">
                    <span className="userstatus-signal-disabled"></span>
                    <p className="m-0 userName FontArabicRegular">Disabled</p>
                  </div>
                );
              } else if (record.userStatus === "Dormant") {
                return (
                  <div className="d-flex">
                    <span className="userstatus-signal-dormant"></span>
                    <p className="m-0 userName FontArabicRegular">Dormant</p>
                  </div>
                );
              } else if (record.userStatus === "Locked") {
                return (
                  <div className="d-flex">
                    <span className="userstatus-signal-locked"></span>
                    <p className="m-0 userName FontArabicRegular">Locked</p>
                  </div>
                );
              } else if (record.userStatus === "Closed") {
                return (
                  <div className="d-flex">
                    <span className="userstatus-signal-closed"></span>
                    <p className="m-0 Disabled-Close userName FontArabicRegular">
                      Closed
                    </p>
                  </div>
                );
              } else {
              }
            })()}
          </>
        );
      },
    },
    {
      title: t(""),
      dataIndex: "Delete",
      key: "Delete",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <div className="edit-icon-edituser icon-edit-list icon-size-one beachGreen">
              <i>
                <img
                  draggable="false"
                  alt=""
                  src={EditIcon2}
                  onClick={() => handleClickEditIcon(record)}
                />
              </i>
            </div>
            <i style={{ cursor: "pointer", color: "#000" }}>
              <Trash size={22} onClick={() => handleDeleteModal(record)} />
            </i>
          </>
        );
      },
    },
  ];

  //navigating to Add user Page
  const handleAddusers = () => {
    if (JSON.parse(localStorage.getItem("isTrial"))) {
      navigate("/Admin/AddUsers");
    } else {
      navigate("/Admin/AddUsersUsermanagement");
    }
  };

  // opening of the search box
  const handleSearchBoxOpen = () => {
    setsearchbox(!searchbox);
  };

  //Closing  the search Box
  const handleCrossSearchBox = () => {
    setsearchbox(false);
  };

  //Red Strip Trial removed
  const handleTrialAlertRemove = () => {
    setUserTrialAlert(false);
  };

  //onChnage  of the Search Box Fields
  const handleSearchBox = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log({ name, value }, "handleChangeSearchBoxValues");

    if (name === "Name") {
      if (value !== "") {
        let valueCheck = /^[A-Za-z\s]*$/i.test(value);
        if (valueCheck) {
          setsearchDetails((prevState) => ({
            ...prevState,
            [name]: value.trim(),
          }));
        }
      } else {
        setsearchDetails((prevState) => ({
          ...prevState,
          Name: "",
        }));
      }
    } else if (name === "Email") {
      setsearchDetails((prevState) => ({
        ...prevState,
        Email: value.trim(),
      }));
    }
  };

  //manual filteration performed on the GRID
  // const handleSearch = () => {
  //   console.log("cliked");
  //   const filteredData =
  //     UserMangementReducer.allOrganizationUsersData.organizationUsers.filter(
  //       (user) => {
  //         console.log(user, "matchesStatusmatchesStatus");
  //         const matchesName =
  //           searchDetails.Name === "" ||
  //           user.userName
  //             .toLowerCase()
  //             .includes(searchDetails.Name.toLowerCase());
  //         const matchesEmail =
  //           searchDetails.Email === "" ||
  //           user.email
  //             .toLowerCase()
  //             .includes(searchDetails.Email.toLowerCase());

  //         const matchesStatus =
  //           searchDetails.Status === "" || // Assuming 'Status' holds the selected status from the dropdown
  //           user.userStatus === searchDetails.Status.value;

  //         return matchesName && matchesEmail;
  //       }
  //     );

  //   setManageUserGrid(filteredData);
  //   setsearchbox(false);
  //   setshowSearches(true);
  // };

  const handleSearch = () => {
    const filteredData =
      UserMangementReducer.allOrganizationUsersData.organizationUsers.filter(
        (user) => {
          const matchesName =
            searchDetails.Name === "" ||
            user.userName
              .toLowerCase()
              .includes(searchDetails.Name.toLowerCase());

          console.log(matchesName, "matchesName");

          const matchesEmail =
            searchDetails.Email === "" ||
            user.email
              .toLowerCase()
              .includes(searchDetails.Email.toLowerCase());

          const matchesStatus =
            searchDetails.Status === "" ||
            user.userStatus === searchDetails.Status.value;

          console.log(matchesStatus, "matchesStatus");

          if (matchesStatus) {
            return matchesStatus;
          } else {
            return matchesName && matchesEmail;
          }
        }
      );

    setManageUserGrid(filteredData);
    setsearchbox(false);
    setshowSearches(true);
  };

  //handle removing the searched snippets
  const handleRemoveSearchSnippet = (identifier) => {
    const updatedSearchDetails = { ...searchDetails, [identifier]: "" };
    setsearchDetails(updatedSearchDetails);

    if (!updatedSearchDetails.Name && !updatedSearchDetails.Email) {
      setshowSearches(false);
      let data = {
        OrganizationID: Number(organizationID),
        RequestingUserID: Number(userID),
      };
      dispatch(AllOrganizationsUsersApi(navigate, t, data));
    }
  };

  //Handle Reset Button
  const handleResetButton = () => {
    let data = {
      OrganizationID: Number(organizationID),
      RequestingUserID: Number(userID),
    };
    dispatch(AllOrganizationsUsersApi(navigate, t, data));
    setshowSearches(false);
    setsearchDetails({
      Name: "",
      Email: "",
      Status: {
        value: 0,
        label: "",
      },
    });
  };

  //Handle Delele user Modal
  const handleDeleteModal = (record) => {
    setDeleteModalData(record);
    dispatch(showDeleteUsersModal(true));
  };

  // handle Edit User Modal
  const handleClickEditIcon = (record) => {
    setEditModalData(record);
    dispatch(showEditUserModal(true));
  };

  //Options For Search

  const options = [
    { value: "Enabled", label: "Enabled" },
    { value: "Disabled", label: "Disabled" },
    { value: "Locked", label: "Locked" },
    { value: "Closed", label: "Closed" },
    { value: "Dormant", label: "Dormant" },
    { value: "Delete", label: "Delete" },
  ];

  const handleStatusChange = (selectedOption) => {
    setsearchDetails((prevDetails) => ({
      ...prevDetails,
      Status: selectedOption,
    }));
  };

  return (
    <Container>
      <Row className={"mt-3 row"}>
        <Col
          lg={6}
          md={6}
          sm={6}
          xs={12}
          className="d-flex gap-4 align-items-center"
        >
          <label className={styles["Edit-Main-Heading"]}>
            {t("Manage-user")}
          </label>
          <Button
            text={t("Add-users")}
            icon={<Plus width={20} height={20} fontWeight={800} />}
            className={styles["AddUsersButton"]}
            onClick={handleAddusers}
          />
        </Col>
        <Col
          lg={6}
          md={6}
          sm={6}
          xs={12}
          className="justify-content-end d-flex align-items-center"
        >
          <span className="position-relative">
            <TextField
              width={"502px"}
              placeholder={t("Search")}
              applyClass={"PollingSearchInput"}
              labelClass="d-none"
              inputicon={
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={searchicon}
                        alt=""
                        className={styles["Search_Bar_icon_class"]}
                        draggable="false"
                        onClick={handleSearchBoxOpen}
                      />
                    </Col>
                  </Row>
                </>
              }
              iconClassName={styles["SearchIconClass"]}
            />

            {searchbox ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={styles["SearchBoxManageUsers"]}
                  >
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-end align-items-center"
                      >
                        <img
                          src={BlackCrossIcon}
                          alt=""
                          className="cursor-pointer"
                          onClick={handleCrossSearchBox}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          labelClass={"d-none"}
                          placeholder={t("Name")}
                          name={"Name"}
                          value={searchDetails.Name}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleSearchBox}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          labelClass={"d-none"}
                          placeholder={t("Email")}
                          name={"Email"}
                          applyClass={"usermanagementTextField"}
                          type="email"
                          value={searchDetails.Email}
                          change={handleSearchBox}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Select
                          placeholder={t("Status")}
                          options={options}
                          value={searchDetails.Status}
                          onChange={handleStatusChange}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col
                        lg={5}
                        md={5}
                        sm={12}
                        xs={12}
                        className="flex-column flex-wrap"
                      >
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Organization-role")}
                        </span>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="d-flex gap-2"
                          >
                            <Checkbox
                              classNameCheckBoxP="m-0 p-0"
                              classNameDiv=""
                            />
                            <span className={styles["AdminAlsoClass"]}>
                              {t("Is-admin-also")}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                      <Col
                        lg={7}
                        md={7}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-end gap-2 align-items-center"
                      >
                        <Button
                          text={"Reset"}
                          className={styles["ResetButtonSearchBox"]}
                          onClick={handleResetButton}
                        />
                        <Button
                          text={"Search"}
                          className={styles["SearchButtonSearchBox"]}
                          onClick={handleSearch}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : null}
            <Row className="mt-1">
              <Col lg={12} md={12} sm={12} className="d-flex gap-2 flex-wrap">
                {showSearches && searchDetails.Name !== "" ? (
                  <div className={styles["SearchablesItems"]}>
                    <span className={styles["Searches"]}>
                      {searchDetails.Name}
                    </span>
                    <img
                      src={whiteCrossIcon}
                      alt=""
                      className={styles["CrossIcon_Class"]}
                      width={13}
                      onClick={() => handleRemoveSearchSnippet("Name")}
                    />
                  </div>
                ) : null}
                {showSearches && searchDetails.Email !== "" ? (
                  <div className={styles["SearchablesItems"]}>
                    <span className={styles["Searches"]}>
                      {searchDetails.Email}
                    </span>
                    <img
                      src={whiteCrossIcon}
                      alt=""
                      className={styles["CrossIcon_Class"]}
                      width={13}
                      onClick={() => handleRemoveSearchSnippet("Email")}
                    />
                  </div>
                ) : null}
              </Col>
            </Row>
          </span>
        </Col>
      </Row>
      {JSON.parse(localStorage.getItem("isTrial")) && (
        <>
          <Row
            className={`mt-3 ${
              userTrialAlert ? styles["fadeIn"] : styles["fadeOut"]
            }`}
          >
            <Col lg={12} md={12} sm={12} className={styles["RedSrtip"]}>
              <Row>
                <Col lg={11} md={11} sm={12} xs={12}>
                  <span className={styles["RedStripContent"]}>
                    {t("Maximum-20-users-can-be-created-in-trial-version")}
                  </span>
                </Col>
                <Col
                  lg={1}
                  md={1}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <img
                    src={BlackCrossIcon}
                    alt=""
                    className="cursor-pointer"
                    width={13}
                    onClick={handleTrialAlertRemove}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
      <Row className={styles["tablecolumnrow"]}>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Table
            rows={manageUserGrid}
            column={ManageUsersColumn}
            scroll={{ y: 400 }}
            pagination={false}
            className={"EditUserModal"}
          />
        </Col>
      </Row>
      {UserManagementModals.deleteUsersModal && (
        <DeleteUserModal deleteModalData={deleteModalData} />
      )}
      {UserManagementModals.editUserModal && (
        <EditUserModal editModalData={editModalData} />
      )}
      {UserManagementModals.successfullyUpdated && (
        <SuccessfullyUpdateModal editModalData={editModalData} />
      )}
      {UserMangementReducer.Loading ? <Loader /> : null}
    </Container>
  );
};

export default ManageUsers;
