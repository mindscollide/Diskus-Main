import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Col, Container, Row } from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import styles from "./ManageUsers.module.css";

import searchicon from "../../../../../assets/images/searchicon.svg";
import EditIcon2 from "../../../../../assets/images/Edit-Icon-blck.png";
import BlackCrossIcon from "../../../../../assets/images/BlackCrossIconModals.svg";
import whiteCrossIcon from "../../../../../assets/images/WhiteCrossIcon.svg";
import greenCheck from "../../../../../assets/images/greenCheck.svg";

import {
  Button,
  Checkbox,
  Table,
  TextField,
} from "../../../../../components/elements";

import {
  showDeleteUsersModal,
  showEditUserModal,
} from "../../../../../store/actions/UserMangementModalActions";

import {
  AllOrganizationsUsersApi,
  getOrganizationPackageUserStatsAPI,
} from "../../../../../store/actions/UserManagementActions";

import { checkFeatureIDAvailability } from "../../../../../commen/functions/utils";

import { validateEmailEnglishAndArabicFormat } from "../../../../../commen/functions/validations";

import useSnackbar from "../../../../../components/elements/snack_bar/useSnackbar";

import DeleteUserModal from "../../ModalsUserManagement/DeleteUserModal/DeleteUserModal";

import EditUserModal from "../../ModalsUserManagement/EditUserModal/EditUserModal";

import SuccessfullyUpdateModal from "../../ModalsUserManagement/SuccessFullyUpdatedModal/SuccessfullyUpdateModal";

const INITIAL_SEARCH_DETAILS = {
  Name: "",
  Email: "",
  searchIsAdmin: false,
  Status: {
    value: "",
    label: "",
  },
};

const INITIAL_MANAGE_USER_SEARCH = {
  searchValue: "",
};

const ManageUsers = () => {
  // ============================================================
  // Hooks
  // ============================================================

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [, SnackBar] = useSnackbar();

  // ============================================================
  // Local Storage Values
  // ============================================================

  const currentLanguage = localStorage.getItem("i18nextLng");

  const organizationID = Number(localStorage.getItem("organizationID"));

  const userID = Number(localStorage.getItem("userID"));

  const isTrial = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("isTrial")) || false;
    } catch {
      return false;
    }
  }, []);

  // ============================================================
  // Redux Selectors
  // ============================================================

  const organizationUserStats = useSelector(
    (state) => state.UserMangementReducer.getOrganizationUserStatsGraph,
  );

  const allOrganizationUsersData = useSelector(
    (state) => state.UserMangementReducer.allOrganizationUsersData,
  );

  const deleteUsersModal = useSelector(
    (state) => state.UserManagementModals.deleteUsersModal,
  );

  const editUserModal = useSelector(
    (state) => state.UserManagementModals.editUserModal,
  );

  const successfullyUpdated = useSelector(
    (state) => state.UserManagementModals.successfullyUpdated,
  );

  // ============================================================
  // Local State
  // ============================================================

  const [searchbox, setSearchbox] = useState(false);

  const [userTrialAlert, setUserTrialAlert] = useState(true);

  const [showSearches, setShowSearches] = useState(false);

  const [editModalData, setEditModalData] = useState(null);

  const [deleteModalData, setDeleteModalData] = useState(null);

  const [enterPressed, setEnterPressed] = useState(false);

  const [manageUserSearch, setManageUserSearch] = useState(
    INITIAL_MANAGE_USER_SEARCH,
  );

  const [searchDetails, setSearchDetails] = useState(INITIAL_SEARCH_DETAILS);

  const [emailError, setEmailError] = useState("");

  /*
   * We keep displayedUsers separately because your existing
   * UI supports two search methods:
   *
   * 1. Search field + Enter
   * 2. Advanced search popup
   *
   * This keeps the existing behavior predictable while
   * removing unnecessary API refetches.
   */
  const [displayedUsers, setDisplayedUsers] = useState([]);

  // ============================================================
  // Derived Redux Data
  // ============================================================

  const organizationUsers = useMemo(() => {
    const users = allOrganizationUsersData?.organizationUsers;

    return Array.isArray(users) ? users : [];
  }, [allOrganizationUsersData]);

  const selectedPackageDetails = useMemo(() => {
    const details = organizationUserStats?.selectedPackageDetails;

    return Array.isArray(details) ? details : [];
  }, [organizationUserStats]);

  const selectedUserPackageDetails = useMemo(() => {
    const details = allOrganizationUsersData?.selectedPackageDetails;

    return Array.isArray(details) ? details : [];
  }, [allOrganizationUsersData]);

  // ============================================================
  // Derived Counts
  // ============================================================

  const totalUserCount = useMemo(() => {
    return selectedPackageDetails.reduce((total, item) => {
      const headCount = Number(item?.headCount ?? 0);

      const packageAllotedUsers = Number(item?.packageAllotedUsers ?? 0);

      return total + (headCount - packageAllotedUsers);
    }, 0);
  }, [selectedPackageDetails]);

  const headCount = useMemo(() => {
    if (selectedUserPackageDetails.length === 0) {
      return 0;
    }

    /*
     * Your old code used forEach + setHeadCount(),
     * so effectively the last package value was used.
     *
     * We retain that exact result without triggering
     * additional renders.
     */
    return Number(
      selectedUserPackageDetails[selectedUserPackageDetails.length - 1]
        ?.headCount ?? 0,
    );
  }, [selectedUserPackageDetails]);

  // ============================================================
  // API Loading
  // ============================================================

  const fetchOrganizationUsers = useCallback(() => {
    const data = {
      OrganizationID: organizationID,
      RequestingUserID: userID,
    };

    dispatch(AllOrganizationsUsersApi(navigate, t, data));
  }, [dispatch, navigate, organizationID, userID, t]);

  useEffect(() => {
    try {
      fetchOrganizationUsers();

      dispatch(getOrganizationPackageUserStatsAPI(navigate, t));
    } catch (error) {
      console.error("Error loading organization users:", error);
    }

    return () => {
      setUserTrialAlert(true);
      setShowSearches(false);
    };

    /*
     * Intentional mount-only behavior.
     *
     * The previous component used
     * flagForStopRerendring state only to achieve
     * the same thing.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // Sync Redux Users With Table
  // ============================================================

  useEffect(() => {
    setDisplayedUsers(organizationUsers);
  }, [organizationUsers]);

  // ============================================================
  // Navigation
  // ============================================================

  const handleAddusers = useCallback(() => {
    if (isTrial) {
      navigate("/Admin/AddUsers");
      return;
    }

    navigate("/Admin/AddUsersUsermanagement");
  }, [isTrial, navigate]);

  // ============================================================
  // Edit/Delete Modals
  // ============================================================

  const handleDeleteModal = useCallback(
    (record) => {
      setDeleteModalData(record);

      dispatch(showDeleteUsersModal(true));
    },
    [dispatch],
  );

  const handleClickEditIcon = useCallback(
    (record) => {
      setEditModalData(record);

      dispatch(showEditUserModal(true));
    },
    [dispatch],
  );

  // ============================================================
  // Search Popup
  // ============================================================

  const handleSearchBoxOpen = useCallback(() => {
    setSearchbox((previous) => !previous);

    setManageUserSearch((previous) => ({
      ...previous,
      searchValue: "",
    }));
  }, []);

  const handleCrossSearchBox = useCallback(() => {
    setSearchbox(false);
  }, []);

  // ============================================================
  // Trial Alert
  // ============================================================

  const handleTrialAlertRemove = useCallback(() => {
    setUserTrialAlert(false);
  }, []);

  // ============================================================
  // Advanced Search Inputs
  // ============================================================

  const resetGridIfSearchEmpty = useCallback(
    (updatedSearchDetails) => {
      const hasAnyFilter =
        Boolean(updatedSearchDetails.Name?.trim()) ||
        Boolean(updatedSearchDetails.Email?.trim()) ||
        Boolean(updatedSearchDetails.Status?.value) ||
        updatedSearchDetails.searchIsAdmin;

      if (!hasAnyFilter) {
        setDisplayedUsers(organizationUsers);
        setShowSearches(false);
        setEnterPressed(false);
        setEmailError("");
      }
    },
    [organizationUsers],
  );

  const handleSearchBox = useCallback(
    (e) => {
      const { name, value } = e.target;

      // NAME
      if (name === "Name") {
        // Allow only alphabets and spaces
        const isValidName = /^[A-Za-z\s]*$/.test(value);

        if (!isValidName) return;

        setSearchDetails((previous) => {
          const updated = {
            ...previous,
            Name: value, // Don't trim, otherwise user can't type spaces
          };

          resetGridIfSearchEmpty(updated);

          return updated;
        });

        return;
      }

      // EMAIL
      if (name === "Email") {
        // ❌ Don't allow spaces anywhere in email
        if (/\s/.test(value)) return;

        setSearchDetails((previous) => {
          const updated = {
            ...previous,
            Email: value,
          };

          resetGridIfSearchEmpty(updated);

          return updated;
        });
      }
    },
    [resetGridIfSearchEmpty],
  );
  // ============================================================
  // Status Options
  // ============================================================

  const statusOptions = useMemo(
    () => [
      {
        value: "Enabled",
        label: t("Enabled"),
      },
      {
        value: "Disabled",
        label: t("Disabled"),
      },
      {
        value: "Locked",
        label: t("Locked"),
      },
      {
        value: "Closed",
        label: t("Closed"),
      },
      {
        value: "Dormant",
        label: t("Dormant"),
      },

      /*
       * Kept because it exists in your original code.
       * Remove this option if "Delete" is not a real
       * backend userStatus.
       */
      {
        value: "Delete",
        label: t("Delete"),
      },
    ],
    [t],
  );

  const handleStatusChange = useCallback(
    (selectedOption) => {
      setSearchDetails((previous) => {
        const updated = {
          ...previous,
          Status: selectedOption || {
            value: "",
            label: "",
          },
        };

        resetGridIfSearchEmpty(updated);

        return updated;
      });
    },
    [resetGridIfSearchEmpty],
  );

  // ============================================================
  // Admin Checkbox
  // ============================================================

  const handleSearchIsAdmin = useCallback(() => {
    setSearchDetails((previous) => {
      const updated = {
        ...previous,
        searchIsAdmin: !previous.searchIsAdmin,
      };

      resetGridIfSearchEmpty(updated);

      return updated;
    });
  }, [resetGridIfSearchEmpty]);

  // ============================================================
  // Advanced Search
  // ============================================================

  const handleSearch = useCallback(() => {
    const emailInput = searchDetails.Email?.trim() || "";

    if (emailInput && !validateEmailEnglishAndArabicFormat(emailInput)) {
      setEmailError(t("Enter-valid-email-address"));

      return;
    }

    setEmailError("");

    const nameInput = searchDetails.Name?.trim().toLowerCase() || "";

    const normalizedEmail = emailInput.toLowerCase();

    /*
     * IMPORTANT:
     * Use Status.value instead of Status.label.
     *
     * label is translated UI text while value
     * corresponds to backend data.
     */
    const statusInput = searchDetails.Status?.value?.trim().toLowerCase() || "";

    const filteredData = organizationUsers.filter((user) => {
      const userName = user?.userName?.toLowerCase() || "";

      const userEmail = user?.email?.toLowerCase() || "";

      const userStatus = user?.userStatus?.toLowerCase() || "";

      const matchesName = !nameInput || userName.includes(nameInput);

      const matchesEmail =
        !normalizedEmail || userEmail.includes(normalizedEmail);

      const matchesStatus = !statusInput || userStatus === statusInput;

      const matchesAdmin =
        !searchDetails.searchIsAdmin || user?.userRole === "AdminUser";

      /*
       * Advanced filters normally represent:
       *
       * Name AND Email AND Status AND Admin
       *
       * The old implementation used .some(), meaning
       * Name OR Email OR Status OR Admin.
       */
      return matchesName && matchesEmail && matchesStatus && matchesAdmin;
    });

    setDisplayedUsers(filteredData);

    const hasAnyFilter =
      Boolean(searchDetails.Name) ||
      Boolean(searchDetails.Email) ||
      Boolean(searchDetails.Status?.value) ||
      searchDetails.searchIsAdmin;

    setShowSearches(hasAnyFilter);

    setSearchbox(false);

    /*
     * Advanced search is different from the simple
     * Enter search, so reset the simple-search state.
     */
    setEnterPressed(false);
  }, [organizationUsers, searchDetails, t]);

  // ============================================================
  // Reset Advanced Search
  // ============================================================

  const handleResetButton = useCallback(() => {
    setSearchDetails({
      ...INITIAL_SEARCH_DETAILS,
    });

    setManageUserSearch({
      ...INITIAL_MANAGE_USER_SEARCH,
    });

    setDisplayedUsers(organizationUsers);

    setShowSearches(false);
    setEnterPressed(false);
    setEmailError("");
  }, [organizationUsers]);

  // ============================================================
  // Simple Search Input
  // ============================================================

  const handleSeachFieldManageUsers = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name !== "SearchVal") {
        return;
      }

      setManageUserSearch({
        searchValue: value,
      });

      setSearchDetails((previous) => ({
        ...previous,
        Name: value.trimStart(),
      }));

      setEnterPressed(false);

      // ✅ When input becomes empty, show all users
      if (value.trim() === "") {
        setDisplayedUsers(organizationUsers);
        setShowSearches(false);
      }
    },
    [organizationUsers],
  );

  // ============================================================
  // Simple Search - Enter Key
  // ============================================================

  const handleKeyDownSearchManageUsers = useCallback(
    (e) => {
      if (e.key !== "Enter") {
        return;
      }

      const searchValue =
        manageUserSearch.searchValue?.trim().toLowerCase() || "";

      const filteredData = organizationUsers.filter((user) => {
        if (!searchValue) {
          return true;
        }

        return user?.userName?.toLowerCase().includes(searchValue) || false;
      });

      setEnterPressed(true);
      setShowSearches(Boolean(searchValue));

      setDisplayedUsers(filteredData);

      setSearchbox(false);
    },
    [manageUserSearch.searchValue, organizationUsers],
  );

  // ============================================================
  // Reset Main Username Search
  // ============================================================

  const handleResettingPage = useCallback(() => {
    setManageUserSearch({
      ...INITIAL_MANAGE_USER_SEARCH,
    });

    setSearchDetails((previous) => ({
      ...previous,
      Name: "",
    }));

    setDisplayedUsers(organizationUsers);

    setShowSearches(false);
    setEnterPressed(false);
    setEmailError("");
  }, [organizationUsers]);

  // ============================================================
  // Remove Search Chip
  // ============================================================

  const handleRemoveSearchSnippet = useCallback(
    (identifier) => {
      const nextSearchDetails = {
        ...searchDetails,
        [identifier]: "",
      };

      setSearchDetails(nextSearchDetails);

      if (identifier === "Name") {
        setManageUserSearch({
          searchValue: "",
        });

        setEnterPressed(false);
      }

      const nameInput = nextSearchDetails.Name?.trim().toLowerCase() || "";

      const emailInput = nextSearchDetails.Email?.trim().toLowerCase() || "";

      const statusInput =
        nextSearchDetails.Status?.value?.trim().toLowerCase() || "";

      const filteredData = organizationUsers.filter((user) => {
        const userName = user?.userName?.toLowerCase() || "";

        const userEmail = user?.email?.toLowerCase() || "";

        const userStatus = user?.userStatus?.toLowerCase() || "";

        const matchesName = !nameInput || userName.includes(nameInput);

        const matchesEmail = !emailInput || userEmail.includes(emailInput);

        const matchesStatus = !statusInput || userStatus === statusInput;

        const matchesAdmin =
          !nextSearchDetails.searchIsAdmin || user?.userRole === "AdminUser";

        return matchesName && matchesEmail && matchesStatus && matchesAdmin;
      });

      setDisplayedUsers(filteredData);

      const hasAnyFilter =
        Boolean(nextSearchDetails.Name) ||
        Boolean(nextSearchDetails.Email) ||
        Boolean(nextSearchDetails.Status?.value) ||
        nextSearchDetails.searchIsAdmin;

      setShowSearches(hasAnyFilter);
    },
    [searchDetails, organizationUsers],
  );

  // ============================================================
  // User Status Renderer
  // ============================================================

  const renderUserStatus = useCallback(
    (status) => {
      switch (status) {
        case "Enabled":
          return (
            <div className='d-flex'>
              <span className='userstatus-signal-enabled' />

              <p className='m-0 userName FontArabicRegular'>{t("Enabled")}</p>
            </div>
          );

        case "Disabled":
          return (
            <div className='d-flex'>
              <span className='userstatus-signal-disabled' />

              <p className='m-0 userName FontArabicRegular'>{t("Disabled")}</p>
            </div>
          );

        case "Dormant":
          return (
            <div className='d-flex'>
              <span className='userstatus-signal-dormant' />

              <p className='m-0 userName FontArabicRegular'>{t("Dormant")}</p>
            </div>
          );

        case "Locked":
          return (
            <div className='d-flex'>
              <span className='userstatus-signal-locked' />

              <p className='m-0 userName FontArabicRegular'>{t("Locked")}</p>
            </div>
          );

        case "Closed":
          return (
            <div className='d-flex'>
              <span className='userstatus-signal-closed' />

              <p className='m-0 Disabled-Close userName FontArabicRegular'>
                {t("Closed")}
              </p>
            </div>
          );

        default:
          return null;
      }
    },
    [t],
  );

  // ============================================================
  // Table Columns
  // ============================================================

  const ManageUsersColumn = useMemo(
    () => [
      {
        title: t("Name"),
        dataIndex: "userName",
        key: "userName",

        align: currentLanguage === "en" ? "left" : "right",

        ellipsis: true,

        sorter: (a, b) => {
          if (a?.userName && b?.userName) {
            return a.userName.localeCompare(b.userName);
          }

          return 0;
        },

        render: (_, record) => (
          <span className={styles["NameStylesTable"]}>{record?.userName}</span>
        ),
      },

      {
        title: t("Designation"),
        dataIndex: "designation",
        key: "designation",

        align: currentLanguage === "en" ? "left" : "right",

        ellipsis: true,

        sorter: (a, b) => {
          if (a?.designation && b?.designation) {
            return a.designation.localeCompare(b.designation);
          }

          return 0;
        },

        render: (_, record) => (
          <span className={styles["DesignationStyles"]}>
            {record?.designation}
          </span>
        ),
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",

        align: currentLanguage === "en" ? "left" : "right",

        ellipsis: true,

        render: (_, record) => (
          <span className={styles["DesignationStyles"]}>{record?.email}</span>
        ),
      },

      {
        title: t("Is-admin-also"),
        dataIndex: "userRole",
        key: "userRole",

        align: currentLanguage === "en" ? "center" : "right",

        ellipsis: true,

        sorter: (a, b) => {
          if (a?.userRole && b?.userRole) {
            return a.userRole.localeCompare(b.userRole);
          }

          return 0;
        },

        render: (_, record) =>
          record?.userRole === "AdminUser" ? (
            <img src={greenCheck} alt='' />
          ) : null,
      },

      {
        title: t("User-status"),
        dataIndex: "userStatus",
        key: "userStatus",

        align: currentLanguage === "en" ? "left" : "right",

        ellipsis: true,

        render: (_, record) => renderUserStatus(record?.userStatus),
      },

      {
        title: t(""),
        dataIndex: "Delete",
        key: "Delete",

        align: currentLanguage === "en" ? "center" : "right",

        render: (_, record) => (
          <>
            {checkFeatureIDAvailability(27) ? (
              <div className='edit-icon-edituser icon-edit-list icon-size-one beachGreen'>
                <i>
                  <img
                    draggable='false'
                    alt=''
                    src={EditIcon2}
                    onClick={() => handleClickEditIcon(record)}
                  />
                </i>
              </div>
            ) : null}

            {checkFeatureIDAvailability(31) ? (
              <i
                style={{
                  cursor: "pointer",
                  color: "#000",
                }}>
                <Trash size={22} onClick={() => handleDeleteModal(record)} />
              </i>
            ) : null}
          </>
        ),
      },
    ],
    [
      currentLanguage,
      handleClickEditIcon,
      handleDeleteModal,
      renderUserStatus,
      t,
    ],
  );

  // ============================================================
  // JSX
  // ============================================================

  return (
    <Container>
      {/* ======================================================
          Header
      ====================================================== */}

      <Row className='mt-3 row'>
        <Col
          lg={6}
          md={6}
          sm={6}
          xs={12}
          className='d-flex gap-4 align-items-center'>
          <label className={styles["Edit-Main-Heading"]}>
            {t("Manage-user")}
          </label>

          {checkFeatureIDAvailability(26) && totalUserCount > 0 ? (
            <Button
              text={t("Add-users")}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              className={styles["AddUsersButton"]}
              onClick={handleAddusers}
            />
          ) : null}
        </Col>

        <Col lg={1} md={1} sm={1} xs={12} />

        {/* ====================================================
            Search Section
        ==================================================== */}

        <Col
          lg={5}
          md={5}
          sm={5}
          xs={12}
          className='justify-content-end d-block align-items-center m-0 p-0'>
          <span className='position-relative'>
            <TextField
              placeholder={t("Search-on-user-name")}
              name='SearchVal'
              value={manageUserSearch.searchValue}
              onKeyDown={handleKeyDownSearchManageUsers}
              applyClass='PollingSearchInput'
              labelclass='d-none'
              change={handleSeachFieldManageUsers}
              inputicon={
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className='d-flex gap-2 align-items-center'>
                      {manageUserSearch.searchValue && enterPressed ? (
                        <img
                          src={BlackCrossIcon}
                          className='cursor-pointer'
                          draggable='false'
                          alt=''
                          onClick={handleResettingPage}
                        />
                      ) : null}

                      <img
                        src={searchicon}
                        alt=''
                        className={styles["Search_Bar_icon_class"]}
                        draggable='false'
                        onClick={handleSearchBoxOpen}
                      />
                    </Col>
                  </Row>
                </>
              }
              iconclassname={styles["SearchIconClass"]}
            />

            {/* ================================================
                Advanced Search Popup
            ================================================ */}

            {searchbox ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={styles["SearchBoxManageUsers"]}>
                    <Row className='mt-2'>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className='d-flex justify-content-end align-items-center'>
                        <img
                          src={BlackCrossIcon}
                          alt='Cross Icon'
                          className='cursor-pointer'
                          onClick={handleCrossSearchBox}
                        />
                      </Col>
                    </Row>

                    {/* Name */}

                    <Row className='mt-4'>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          labelclass='d-none'
                          placeholder={t("Name")}
                          name='Name'
                          value={searchDetails.Name}
                          type='text'
                          applyClass='usermanagementTextField'
                          change={handleSearchBox}
                        />
                      </Col>
                    </Row>

                    {/* Email + Status */}

                    <Row className='mt-4'>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          labelclass='d-none'
                          placeholder={t("Email")}
                          name='Email'
                          applyClass='usermanagementTextField'
                          type='email'
                          value={searchDetails.Email}
                          change={handleSearchBox}
                        />
                      </Col>

                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Select
                          placeholder={t("Status")}
                          options={statusOptions}
                          value={searchDetails.Status}
                          onChange={handleStatusChange}
                        />
                      </Col>

                      <Row>
                        <Col>
                          {emailError && (
                            <div className={styles["errorMessage"]}>
                              {emailError}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Row>

                    {/* Admin + Buttons */}

                    <Row className='mt-4'>
                      <Col
                        lg={5}
                        md={5}
                        sm={12}
                        xs={12}
                        className='flex-column flex-wrap'>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Organization-role")}
                        </span>

                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className='d-flex gap-2'>
                            <Checkbox
                              classNameCheckBoxP='m-0 p-0'
                              checked={searchDetails.searchIsAdmin}
                              onChange={handleSearchIsAdmin}
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
                        className='d-flex justify-content-end gap-2 align-items-center'>
                        <Button
                          text={t("Reset")}
                          className={styles["ResetButtonSearchBox"]}
                          onClick={handleResetButton}
                        />

                        <Button
                          text={t("Search")}
                          className={styles["SearchButtonSearchBox"]}
                          onClick={handleSearch}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : null}

            {/* ================================================
                Search Chips
            ================================================ */}

            <Row className='mt-1'>
              <Col lg={12} md={12} sm={12} className='d-flex gap-2 flex-wrap'>
                {showSearches && searchDetails.Name !== "" ? (
                  <div className={styles["SearchablesItems"]}>
                    <span className={styles["Searches"]}>
                      {searchDetails.Name}
                    </span>

                    <img
                      src={whiteCrossIcon}
                      alt='White Cross'
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
                      alt='White Cross'
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

      {/* ======================================================
          Trial Alert
      ====================================================== */}

      {isTrial && (
        <>
          <Row
            className={`mt-3 ${
              userTrialAlert ? styles["fadeIn"] : styles["fadeOut"]
            }`}>
            <Col lg={12} md={12} sm={12} className={styles["RedSrtip"]}>
              <Row>
                <Col lg={11} md={11} sm={12} xs={12}>
                  <span className={styles["RedStripContent"]}>
                    {t("Maximum")}
                    &nbsp;
                    <span>{headCount}</span>
                    &nbsp;
                    <span>{t("Users-can-be-created-in-trial-version")}</span>
                  </span>
                </Col>

                <Col
                  lg={1}
                  md={1}
                  sm={12}
                  xs={12}
                  className='d-flex justify-content-end'>
                  <img
                    src={BlackCrossIcon}
                    alt='Black Cross'
                    className='cursor-pointer'
                    width={13}
                    onClick={handleTrialAlertRemove}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}

      {/* ======================================================
          Users Table
      ====================================================== */}

      <Row className={styles["tablecolumnrow"]}>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Table
            rows={displayedUsers}
            column={ManageUsersColumn}
            scroll={{ y: 400 }}
            pagination={false}
            className='EditUserModal'
          />
        </Col>
      </Row>

      {/* ======================================================
          Modals
      ====================================================== */}

      {deleteUsersModal && (
        <DeleteUserModal deleteModalData={deleteModalData} />
      )}

      {editUserModal && <EditUserModal editModalData={editModalData} />}

      {successfullyUpdated && (
        <SuccessfullyUpdateModal editModalData={editModalData} />
      )}

      {SnackBar}
    </Container>
  );
};

export default ManageUsers;
