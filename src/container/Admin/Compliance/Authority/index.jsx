// ========================
// React & Library Imports
// ========================
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { useDispatch } from "react-redux";

// ========================
// Styles & Assets Imports
// ========================
import styles from "./manageAuthority.module.css";
import {
  Button,
  Notification,
  TextField,
} from "../../../../components/elements";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import searchicon from "../../../../assets/images/searchicon.svg";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import deleteIcon from "../../../../assets/images/Icon material-delete.png";
import editIcon from "../../../../assets/images/Icon material-edit.png";
import noAuthorityImg from "../../../../assets/images/No Authority Availbale.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/SorterIconDescend.png";
import DefaultSortIcon from "../../../../assets/images/sortingIcons/Double Arrow2.svg";

//Asscending & Descending States

// ========================
// Components & Redux Actions
// ========================
import CustomTable from "../../../../components/elements/table/Table";
import { showDeleteAuthorityModal } from "../../../../store/actions/ManageAuthoriyAction";
import DeleteAuthorityModal from "../CommonFunctions/DeleteAuthorityModal";
import AddEditViewAuthorityModal from "./addEditAuthority";

// ========================
// Context
// ========================
import { useAuthorityContext } from "../../../../context/AuthorityContext";
import {
  GetAllAuthorityAPI,
  GetAuthorityByIDAPI,
  setInactiveStatusData,
  setActiveStatusData,
  setDeleteStatusData,
  setAuthorityCreatedData,
  setAuthorityUpdatedData,
  clearAuthorityMessage,
} from "../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import { useTableScrollBottom } from "../CommonFunctions/reusableFunctions";

const ManageAuthority = () => {
  // Translation hook for multi-language support
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  // Authority context values and setters
  const {
    setAuthorityViewState, // controls add/edit/view mode
    searchPayload, // stores all search fields
    setSearchPayload, // updates search fields
    searchbox, // controls advanced search box visibility
    setsearchbox, // toggles search box
    shortCodeSort,
    setShortCodeSort,
    authorityNameSort,
    setAuthorityNameSort,
    countrySort,
    setCountrySort,
    sectorSort,
    setSectorSort,
    setAddEditViewAuthoriyModal,
    addEditViewAuthoriyModal,
    setAuthorityId,
    statusFilter,
    setStatusFilter,
    countryNames,
    selectCountry,
    setSelectCountry,
  } = useAuthorityContext();
  const isLoadMoreRef = useRef(false);

  // Redux dispatcher
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  //row length on scroll
  const [recordsLength, setRecordLength] = useState(0);

  // Ref used to detect clicks outside the search box
  const searchBoxRef = useRef(null);

  const GetAllAuthority = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllAuthorities
  );
  const authorityRespnseMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ResponseMessage
  );
  const authorityseverityMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.severity
  );

  const authorityInactiveMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.SocketAuthorityInactive
  );

  const authorityActiveMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.SocketAuthorityActive
  );

  const authorityDeletedMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.SocketAuthorityDeleted
  );

  const authorityCreatedMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.SocketAuthorityCreated
  );

  const authorityUpdatedMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.SocketAuthorityUpdated
  );
  const { setHasReachedBottom } = useTableScrollBottom(() => {
    if (recordsLength !== data.length) {
      isLoadMoreRef.current = true;

      dispatch(
        GetAllAuthorityAPI(
          navigate,
          {
            ...searchPayload,
            sRow: data.length,
          },
          t
        )
      );
    }
  });
  // ========================
  // Modal Actions
  // ========================

  // Open Delete Authority confirmation modal
  const hanldeDeleteAuthorityModal = (authorityID) => {
    dispatch(showDeleteAuthorityModal(true));
    setAuthorityId(authorityID);
  };

  // Open Add Authority modal
  const handleAddAuthority = () => {
    setAddEditViewAuthoriyModal(true);
    setAuthorityViewState(1); // 1 = Add mode
  };

  // Open Edit Authority modal
  const handleEditAuthority = (authorityID) => {
    let Data = {
      authorityId: authorityID,
    };
    dispatch(
      GetAuthorityByIDAPI(
        navigate,
        Data,
        t,
        setAddEditViewAuthoriyModal,
        setAuthorityViewState,
        setAuthorityId,
        2
      )
    );
  };

  // Open View Authority modal
  const handleViewAuthority = (authorityID) => {
    let Data = {
      authorityId: authorityID,
    };
    dispatch(
      GetAuthorityByIDAPI(
        navigate,
        Data,
        t,
        setAddEditViewAuthoriyModal,
        setAuthorityViewState,
        setAuthorityId,
        3
      )
    );
  };

  // ========================
  // Initial UseEffect
  // ========================
  useEffect(() => {
    dispatch(GetAllAuthorityAPI(navigate, searchPayload, t));
    dispatch(getCountryNamesAction(navigate, t));
  }, []);

  // ========================
  // Click Outside Search Box
  // ========================
  useEffect(() => {
    // Close search box when user clicks outside
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setsearchbox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!GetAllAuthority) {
      if (!isLoadMoreRef.current) {
        setData([]);
      }
      return;
    }

    const { authorityList, totalCount } = GetAllAuthority;

    setRecordLength(totalCount);

    if (isLoadMoreRef.current) {
      // ✅ APPEND safely
      setData((prev) => [...prev, ...authorityList]);
      isLoadMoreRef.current = false;
    } else {
      // ✅ REPLACE safely
      setData(authorityList);
    }
  }, [GetAllAuthority]);

  // MQTT For Authority Inactive
  useEffect(() => {
    if (!authorityInactiveMessage) return;

    setData((prevData) =>
      prevData.map((authority) =>
        authority?.authorityId ===
        authorityInactiveMessage.authority.authorityId
          ? {
              ...authority,
              status: authorityInactiveMessage.authority.status,
            }
          : authority
      )
    );
    dispatch(setInactiveStatusData(null));
  }, [authorityInactiveMessage]);

  // MQTT For Authority Active
  useEffect(() => {
    if (!authorityActiveMessage) return;

    setData((prevData) =>
      prevData.map((authority) =>
        authority?.authorityId === authorityActiveMessage.authority.authorityId
          ? {
              ...authority,
              status: authorityActiveMessage.authority.status,
            }
          : authority
      )
    );
    dispatch(setActiveStatusData(null));
  }, [authorityActiveMessage]);

  // MQTT For Authority Delete
  useEffect(() => {
    if (!authorityDeletedMessage) return;

    const deletedAuthorityId = authorityDeletedMessage?.authority?.authorityId;

    if (!deletedAuthorityId) return;

    setData((prevData) =>
      prevData.filter(
        (authority) => authority.authorityId !== deletedAuthorityId
      )
    );

    // optional: update total record count if you are tracking it
    setRecordLength((prev) => Math.max(prev - 1, 0));

    dispatch(setDeleteStatusData(null));
  }, [authorityDeletedMessage]);

  // AuthorityCreated MQTT

  // MQTT For Authority Create
  useEffect(() => {
    if (!authorityCreatedMessage) return;

    const newAuthority = authorityCreatedMessage?.authority;
    if (!newAuthority?.authorityId) return;

    setData((prevData) => {
      // ✅ Prevent duplicate insertion
      const alreadyExists = prevData.some(
        (a) => a.authorityId === newAuthority.authorityId
      );

      if (alreadyExists) return prevData;

      // ✅ Add new authority at top (or bottom if you prefer)
      return [newAuthority, ...prevData];
    });

    // ✅ Update total record count
    setRecordLength((prev) => prev + 1);

    // ✅ Clear redux MQTT state
    dispatch(setAuthorityCreatedData(null));
  }, [authorityCreatedMessage]);

  // MQTT For Authority Updated
  useEffect(() => {
    if (!authorityUpdatedMessage) return;

    setData((prevData) =>
      prevData.map((authority) =>
        authority?.authorityId === authorityUpdatedMessage.authority.authorityId
          ? {
              ...authority,
              shortCode: authorityUpdatedMessage.authority.shortCode,
              authorityName: authorityUpdatedMessage.authority.authorityName,
              countryName: authorityUpdatedMessage.authority.countryName,
              sector: authorityUpdatedMessage.authority.sector,
              status: authorityUpdatedMessage.authority.status,
            }
          : authority
      )
    );
    dispatch(setAuthorityUpdatedData(null));
  }, [authorityUpdatedMessage]);

  const resetTable = () => {
    isLoadMoreRef.current = false;
    setHasReachedBottom(false);
    setRecordLength(0);
    setData([]);
  };

  useEffect(() => {
    resetTable();
    dispatch(GetAllAuthorityAPI(navigate, searchPayload, t));
  }, []);

  useEffect(() => {
    if (
      authorityRespnseMessage !== null &&
      authorityRespnseMessage !== undefined &&
      authorityRespnseMessage !== "" &&
      authorityseverityMessage !== null
    ) {
      try {
        showMessage(authorityRespnseMessage, authorityseverityMessage, setOpen);
        setTimeout(() => {
          dispatch(clearAuthorityMessage());
        }, 4000);
      } catch (error) {}
    }
  }, [authorityRespnseMessage, authorityseverityMessage]);

  // ========================
  // Table Columns Definition
  // ========================
  const columnsAuthority = useMemo(
    () => [
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Short-code")}
            {shortCodeSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : shortCodeSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),

        dataIndex: "shortCode",
        key: "shortCode",
        width: "15%",
        align: "left",
        ellipsis: true,
        sorter: (a, b) =>
          shortCodeSort === "descend"
            ? b.shortCode
                ?.toLowerCase()
                .localeCompare(a.shortCode?.toLowerCase())
            : shortCodeSort === "ascend"
            ? a.shortCode
                ?.toLowerCase()
                .localeCompare(b.shortCode?.toLowerCase())
            : null,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Authority-name")}
            {authorityNameSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : authorityNameSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "authorityName",
        key: "authorityName",
        width: "25%",
        ellipsis: true,
        align: "left",
        sorter: (a, b) =>
          authorityNameSort === "descend"
            ? b.authorityName
                ?.toLowerCase()
                .localeCompare(a.authorityName?.toLowerCase())
            : authorityNameSort === "ascend"
            ? a.authorityName
                ?.toLowerCase()
                .localeCompare(b.authorityName?.toLowerCase())
            : a.authorityName
                ?.toLowerCase()
                .localeCompare(b.authorityName?.toLowerCase()),
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Country")}
            {countrySort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : countrySort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        sorter: (a, b) =>
          countrySort === "descend"
            ? b.countryName
                ?.toLowerCase()
                .localeCompare(a.countryName?.toLowerCase())
            : countrySort === "ascend"
            ? a.countryName
                ?.toLowerCase()
                .localeCompare(b.countryName?.toLowerCase())
            : a.countryName
                ?.toLowerCase()
                .localeCompare(b.countryName?.toLowerCase()),

        dataIndex: "countryName",
        key: "countryName",
        width: "12%",
        align: "left",
        ellipsis: true,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Sector")}
            {sectorSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : sectorSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        sorter: (a, b) =>
          sectorSort === "descend"
            ? b.sector?.toLowerCase().localeCompare(a.sector?.toLowerCase())
            : sectorSort === "ascend"
            ? a.sector?.toLowerCase().localeCompare(b.sector?.toLowerCase())
            : null,

        dataIndex: "sector",
        key: "sector",
        width: "18%",
        align: "left",
        ellipsis: true,
      },
      {
        title: t("Status"),
        dataIndex: "status",
        key: "status",
        width: "10%",
        align: "center",
        ellipsis: true,
        filters: [
          { text: "Active", value: "Active" },
          { text: "Inactive", value: "Inactive" },
        ],
        filteredValue: statusFilter || null, // ✅ controls filter state

        onFilter: (value, record) => {
          return record.status === value;
        },
        filterIcon: () => (
          <ChevronDown className="filter-chevron-icon-todolist" />
        ),
      },
      {
        title: t(""),
        dataIndex: "Delete",
        key: "Delete",
        width: "20%",

        // Action buttons column
        render: (text, record) => {
          return (
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end align-items-center gap-4"
              >
                {/* Delete Authority */}
                <img
                  className="cursor-pointer"
                  draggable="false"
                  alt=""
                  src={deleteIcon}
                  onClick={() => hanldeDeleteAuthorityModal(record.authorityId)}
                />

                {/* Edit Authority */}
                <img
                  className="cursor-pointer"
                  draggable="false"
                  alt=""
                  src={editIcon}
                  onClick={() => handleEditAuthority(record.authorityId)}
                />

                {/* View Authority */}
                <Button
                  text={t("View-details")}
                  className={styles["viewAuthorityBtn"]}
                  onClick={() => handleViewAuthority(record.authorityId)}
                />
              </Col>
            </Row>
          );
        },
      },
    ],
    [t, shortCodeSort, authorityNameSort, countrySort, sectorSort, statusFilter] // Re-render columns when language changes
  );

  // Tracks whether Enter key search was triggered
  const [enterpressed, setEnterpressed] = useState(true);

  // ========================
  // Search Actions
  // ========================

  // Close advanced search box
  const handleCrossSearchBox = () => {
    setsearchbox(false);
  };

  // // Handle Enter key search
  const handleKeyDownSearchAuthority = (e) => {
    if (e.key === "Enter" && searchPayload.authorityTitle.trim() !== "") {
      setEnterpressed(true);

      const updatedPayload = {
        ...searchPayload,
        authorityName: searchPayload.authorityTitle,
        authorityTitle: searchPayload.authorityTitle,
      };

      setSearchPayload(updatedPayload);
      dispatch(GetAllAuthorityAPI(navigate, updatedPayload, t));
    }
  };

  // Handle all search input changes
  const handleSearchAuthority = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // Prevent leading spaces
    const trimmedValue = value.trimStart();

    if (name === "shortCode") {
      setSearchPayload({ ...searchPayload, shortCode: trimmedValue });
    }
    if (name === "authorityName") {
      setSearchPayload({ ...searchPayload, authorityName: trimmedValue });
    }
    if (name === "country") {
      setSearchPayload({ ...searchPayload, country: trimmedValue });
    }
    if (name === "sector") {
      setSearchPayload({ ...searchPayload, sector: trimmedValue });
    }
    if (name === "authorityTitle") {
      setSearchPayload({ ...searchPayload, authorityTitle: trimmedValue });
    }
  };

  // Reset all search fields
  const handleResetAuthorityButton = () => {
    setHasReachedBottom(false);
    setRecordLength(0);
    setData([]);
    setSearchPayload({
      shortCode: "",
      authorityName: "",
      countryId: 0,
      sector: "",
      authorityTitle: "",
      sRow: 0,
      length: 10,
    });
    setSelectCountry({
      value: 0,
      label: "",
    });
    const Data = {
      authorityName: "",
      shortCode: "",
      countryId: 0,
      sector: "",
      sRow: 0,
      length: 10,
    };
    dispatch(GetAllAuthorityAPI(navigate, Data, t));
    setsearchbox(false);
  };

  // Trigger search button action
  const handleSearchAuthorityButton = () => {
    setHasReachedBottom(false);
    setData([]);
    setRecordLength(0);

    setSearchPayload({
      ...searchPayload,
      sRow: 0,
      length: 10,
    });
    dispatch(GetAllAuthorityAPI(navigate, searchPayload, t));
  };

  // Open advanced search box
  const handleSearchBoxOpen = () => {
    setsearchbox(!searchbox);

    // Move title search into authority name when opening search box
    if (searchPayload.authorityTitle !== "") {
      setSearchPayload({
        ...searchPayload,
        authorityName: searchPayload.authorityTitle,
        authorityTitle: "",
      });
    }
  };

  const resetAllSorts = () => {
    setShortCodeSort(null);
    setAuthorityNameSort(null);
    setCountrySort(null);
    setSectorSort(null);
  };

  const handleChangeAuthorityFilerSorter = (pagination, filters, sorter) => {
    console.log(
      pagination,
      filters,
      sorter,
      "handleChangeAuthorityFilerSorterhandleChangeAuthorityFilerSorter"
    );
    // 🔁 Reset all icons first
    resetAllSorts();

    if (sorter.columnKey === "shortCode") {
      setShortCodeSort(sorter.order);
    }

    if (sorter.columnKey === "authorityName") {
      setAuthorityNameSort(sorter.order);
    }
    if (sorter.columnKey === "countryName") {
      console.log(sorter, "shortCodeSortshortCodeSort");
      setCountrySort(sorter.order);
    }
    if (sorter.columnKey === "sector") {
      setSectorSort(sorter.order);
    }
    // ✅ Status filter
    if (filters?.status) {
      setStatusFilter(filters.status); // ["Active"] | ["Inactive"] | null
    }
  };

  const handleChangeCountry = (event) => {
    setSelectCountry(event);
    setSearchPayload({
      ...searchPayload,
      countryId: event.value,
    });
  };

  // Memoized rows for table
  const rowsData = useMemo(() => {
    return data;
  }, [data]);

  console.log(rowsData, "rowsDatarowsData");
  // ========================
  // JSX Rendering
  // ========================

  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col lg={6} md={6} sm={12} xs={12}>
            <div className="d-flex gap-3 align-items-center w-100 justify-content-start">
              <label className={styles["Auhtority-Main-Heading"]}>
                {t("Authorities")}
              </label>
              <Button
                text={t("Add-authority")}
                icon={<Plus width={20} height={20} fontWeight={800} />}
                className={styles["AddAuthorityButton"]}
                onClick={handleAddAuthority}
              />
            </div>
          </Col>
          <Col lg={1} md={1} sm={false} xs={12}></Col>
          <Col
            lg={5}
            md={5}
            sm={12}
            xs={12}
            className="justify-content-end  align-items-center "
          >
            <span ref={searchBoxRef} className="position-relative">
              <TextField
                placeholder={t("Authority-name")}
                name={"authorityTitle"}
                disable={searchbox}
                value={searchPayload.authorityTitle}
                onKeyDown={handleKeyDownSearchAuthority}
                applyClass={"PollingSearchInput"}
                maxLength={100}
                labelclass="d-none"
                change={handleSearchAuthority}
                inputicon={
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-2 align-items-center"
                      >
                        {searchPayload.authorityTitle && enterpressed ? (
                          <>
                            <img
                              src={BlackCrossIcon}
                              className="cursor-pointer"
                              draggable="false"
                              alt=""
                              onClick={handleResetAuthorityButton}
                            />
                          </>
                        ) : null}
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
                iconclassname={styles["SearchIconClass"]}
              />

              {searchbox ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className={styles["SearchBoxAuthority"]}
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
                            alt="Cross Icon"
                            className="cursor-pointer"
                            onClick={handleCrossSearchBox}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <TextField
                            labelclass={"d-none"}
                            placeholder={t("Authority-name")}
                            maxLength={100}
                            name={"authorityName"}
                            value={searchPayload.authorityName}
                            type="text"
                            applyClass={"usermanagementTextField"}
                            change={handleSearchAuthority}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <TextField
                            labelclass={"d-none"}
                            placeholder={t("Short-code")}
                            maxLength={10}
                            name={"shortCode"}
                            value={searchPayload.shortCode}
                            type="text"
                            applyClass={"usermanagementTextField"}
                            change={handleSearchAuthority}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-4">
                        <Col lg={6} md={6} sm={12} xs={12}>
                          <Select
                            value={
                              selectCountry?.value !== 0 ? selectCountry : null
                            }
                            options={countryNames}
                            onChange={handleChangeCountry}
                            placeholder="Country"
                          />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                          <TextField
                            labelclass={"d-none"}
                            placeholder={t("Sector")}
                            name={"sector"}
                            maxLength={50}
                            applyClass={"usermanagementTextField"}
                            type="text"
                            value={searchPayload.sector}
                            change={handleSearchAuthority}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          className="d-flex justify-content-end gap-2 align-items-center"
                        >
                          <Button
                            text={t("Reset")}
                            className={styles["ResetButtonSearchBox"]}
                            onClick={handleResetAuthorityButton}
                          />
                          <Button
                            text={t("Search")}
                            className={styles["SearchButtonSearchBox"]}
                            onClick={handleSearchAuthorityButton}
                            disableBtn={
                              searchPayload.shortCode === "" &&
                              searchPayload.authorityName === "" &&
                              searchPayload.country === "" &&
                              searchPayload.sector === "" &&
                              searchPayload.authorityTitle === ""
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
            </span>
          </Col>
        </Row>
        {rowsData.length > 0 ? (
          <CustomTable
            column={columnsAuthority}
            className="Authority_Table mt-3"
            rows={rowsData}
            scroll={{ x: "scroll", y: 500 }}
            pagination={false}
            onChange={handleChangeAuthorityFilerSorter}
          />
        ) : (
          <>
            <section
              style={{
                minHeight: "500px",
              }}
              className="w-100  d-flex justify-content-center align-items-center flex-column"
            >
              <Row className="mt-3 ">
                <Col
                  lg={12}
                  ms={12}
                  sm={12}
                  className="d-flex justify-content-center align-items-center"
                >
                  <img draggable={false} src={noAuthorityImg} alt="" />
                </Col>
              </Row>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["EmptyAuthorityState_heading"]}>
                    {searchPayload.shortCode !== "" ||
                    searchPayload.authorityName !== "" ||
                    searchPayload.countryId !== 0 ||
                    searchPayload.sector !== "" ||
                    searchPayload.authorityTitle !== ""
                      ? t("No-matching-records.")
                      : t("No-authority-available")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["EmptyAuthorityState_subHeading"]}>
                    {t("You-dont-have-any-authority-at-the-moment")}
                  </span>
                </Col>
              </Row>
            </section>
          </>
        )}
      </Container>
      <Notification open={open} setOpen={setOpen} />
      <DeleteAuthorityModal />
      {addEditViewAuthoriyModal ? <AddEditViewAuthorityModal /> : null}
    </>
  );
};

export default ManageAuthority;
