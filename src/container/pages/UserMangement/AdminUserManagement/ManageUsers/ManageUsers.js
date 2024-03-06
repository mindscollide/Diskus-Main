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
const ManageUsers = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);

  const [searchbox, setsearchbox] = useState(false);

  const [userTrialAlert, setUserTrialAlert] = useState(true);

  const [showSearches, setshowSearches] = useState(false);

  const [searchDetails, setsearchDetails] = useState({
    Name: "",
    Email: "",
    Status: {
      value: 0,
      label: "",
    },
  });

  useEffect(() => {
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
  }, []);

  const ManageUsersColumn = [
    {
      title: t("Name"),
      dataIndex: "Names",
      key: "Names",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.Names.localeCompare(b.Names.toLowerCase),
    },
    {
      title: t("Designation"),
      dataIndex: "Designation",
      key: "Designation",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => a.Designation.localeCompare(b.Designation.toLowerCase),
    },
    {
      title: t("Email"),
      dataIndex: "Emails",
      key: "Emails",
      align: "left",
      ellipsis: true,
    },
    {
      title: t("Is-admin-also"),
      dataIndex: "IsAdmin",
      key: "IsAdmin",
      align: "center",
      ellipsis: true,
      sorter: (a, b) =>
        a.OrganizationRole.localeCompare(b.OrganizationRole.toLowerCase),
    },

    {
      title: t("User-status"),
      dataIndex: "Userstatus",
      key: "Userstatus",
      align: "left",
      ellipsis: true,
    },
    {
      title: t(""),
      dataIndex: "Delete",
      key: "Delete",
      align: "center",
      render: () => {
        return (
          <>
            <div className="edit-icon-edituser icon-edit-list icon-size-one beachGreen">
              <i>
                <img
                  draggable="false"
                  alt=""
                  src={EditIcon2}
                  onClick={handleClickEditIcon}
                />
              </i>
            </div>
            <i style={{ cursor: "pointer", color: "#000" }}>
              <Trash size={22} onClick={handleDeleteModal} />
            </i>
          </>
        );
      },
    },
  ];

  const rows = [
    {
      Names: <span className={styles["NameStylesTable"]}>Saif</span>,
      Designation: (
        <span className={styles["DesignationStyles"]}>React Js Developer</span>
      ),
      Emails: (
        <span className={styles["DesignationStyles"]}>
          saifiiyousuf4002@gmail.com
        </span>
      ),
      IsAdmin: <img src={greenCheck} alt="" />,
      Userstatus: (
        <div className="d-flex">
          <span className="userstatus-signal-enabled"></span>
          <p className="m-0 userName FontArabicRegular">Enabled</p>
        </div>
      ),
    },
    {
      Names: (
        <span className={styles["NameStylesTable"]}>Muhammad Usama Khan</span>
      ),
      Designation: (
        <span className={styles["DesignationStyles"]}>React Js Developer</span>
      ),
      Emails: (
        <span className={styles["DesignationStyles"]}>Usama@gmail.com</span>
      ),
      IsAdmin: <img src={greenCheck} alt="" />,
      Userstatus: (
        <div className="d-flex">
          <span className="userstatus-signal-disabled"></span>
          <p className="m-0 userName FontArabicRegular">Disabled</p>
        </div>
      ),
    },
    {
      Names: <span className={styles["NameStylesTable"]}>Salar Shah</span>,
      Designation: (
        <span className={styles["DesignationStyles"]}>React Js Developer</span>
      ),
      Emails: (
        <span className={styles["DesignationStyles"]}>Salar@gmail.com</span>
      ),
      IsAdmin: <img src={greenCheck} alt="" />,
      Userstatus: (
        <div className="d-flex">
          <span className="userstatus-signal-locked"></span>
          <p className="m-0 userName FontArabicRegular">locked</p>
        </div>
      ),
    },
    {
      Names: <span className={styles["NameStylesTable"]}>Shoaib</span>,
      Designation: (
        <span className={styles["DesignationStyles"]}>React Js Developer</span>
      ),
      Emails: (
        <span className={styles["DesignationStyles"]}>Salar@gmail.com</span>
      ),
      IsAdmin: <img src={greenCheck} alt="" />,
      Userstatus: (
        <div className="d-flex">
          <span className="userstatus-signal-dormant"></span>
          <p className="m-0 userName FontArabicRegular">Dormant</p>
        </div>
      ),
    },
    {
      Names: <span className={styles["NameStylesTable"]}>Behram khan</span>,
      Designation: (
        <span className={styles["DesignationStyles"]}>React Js Developer</span>
      ),
      Emails: (
        <span className={styles["DesignationStyles"]}>Salar@gmail.com</span>
      ),
      IsAdmin: <img src={greenCheck} alt="" />,
      Userstatus: (
        <div className="d-flex">
          <span className="userstatus-signal-closed"></span>
          <p className="m-0 Disabled-Close userName FontArabicRegular">
            closed
          </p>
        </div>
      ),
    },
  ];

  const handleAddusers = () => {
    navigate("/Diskus/Admin/AddUsersUsermanagement");
  };

  const handleSearchBoxOpen = () => {
    setsearchbox(!searchbox);
  };

  const handleCrossSearchBox = () => {
    setsearchbox(false);
  };

  const handleTrialAlertRemove = () => {
    setUserTrialAlert(false);
  };

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

  const handleSearch = () => {
    setsearchbox(false);
    setshowSearches(true);
  };

  const handleRemoveSearchSnippet = () => {
    setshowSearches(false);
  };

  const handleResetButton = () => {
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

  const handleDeleteModal = () => {
    dispatch(showDeleteUsersModal(true));
  };

  const handleClickEditIcon = () => {
    dispatch(showEditUserModal(true));
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
                        <Select placeholder={t("Status")} />
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
                      onClick={handleRemoveSearchSnippet}
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
                      onClick={handleRemoveSearchSnippet}
                    />
                  </div>
                ) : null}
              </Col>
            </Row>
          </span>
        </Col>
      </Row>
      {userTrialAlert && (
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
            rows={rows}
            column={ManageUsersColumn}
            scroll={{ y: 400 }}
            pagination={false}
            className={"EditUserModal"}
          />
        </Col>
      </Row>
      {UserManagementModals.deleteUsersModal && <DeleteUserModal />}
      {UserManagementModals.editUserModal && <EditUserModal />}
    </Container>
  );
};

export default ManageUsers;
