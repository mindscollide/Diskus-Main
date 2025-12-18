// ========================
// React & Library Imports
// ========================
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// ========================
// Styles & Assets Imports
// ========================
import styles from "./manageAuthority.module.css";
import { Button, TextField } from "../../../../components/elements";
import { Plus } from "react-bootstrap-icons";
import searchicon from "../../../../assets/images/searchicon.svg";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import deleteIcon from "../../../../assets/images/Icon material-delete.png";
import editIcon from "../../../../assets/images/Icon material-edit.png";
import noAuthorityImg from "../../../../assets/images/No Authority Availbale.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/SorterIconDescend.png";

//Asscending & Descending States

// ========================
// Components & Redux Actions
// ========================
import CustomTable from "../../../../components/elements/table/Table";
import {
  showAddEditViewAuthorityModal,
  showDeleteAuthorityModal,
} from "../../../../store/actions/ManageAuthoriyAction";
import DeleteAuthorityModal from "../CommonFunctions/DeleteAuthorityModal";
import AddEditViewAuthorityModal from "./addEditAuthority";

// ========================
// Context
// ========================
import { useAuthorityContext } from "../../../../context/AuthorityContext";
import { GetAllAuthorityAPI } from "../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ManageAuthority = () => {
  // Translation hook for multi-language support
  const { t } = useTranslation();

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
    setAuthoritySort,
    countrySort,
    setCountrySort,
    sectorSort,
    setSectorSort,
  } = useAuthorityContext();

  // Redux dispatcher
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([
    {
      key: "1",
      shortCode: "PSX",
      name: "Pakistan Stock Exchange",
      country: "Pakistan",
      sector: "Security Regulation",
      status: "Active",
    },
    {
      key: "2",
      shortCode: "SBP",
      name: "State Bank of Pakistan",
      country: "Pakistan",
      sector: "Banking & Monetary Policy",
      status: "Active",
    },
    {
      key: "3",
      shortCode: "FBR",
      name: "Federal Board of Revenue",
      country: "Pakistan",
      sector: "Taxation",
      status: "Inactive",
    },
    {
      key: "4",
      shortCode: "NEPRA",
      name: "National Electric Power Regulatory Authority",
      country: "Pakistan",
      sector: "Energy Regulation",
      status: "Active",
    },
  ]);

  // Ref used to detect clicks outside the search box
  const searchBoxRef = useRef(null);

  const GetAllAuthority = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllAuthorities
  );
  console.log(GetAllAuthority, "GetAllAuthorityGetAllAuthority");
  // ========================
  // Modal Actions
  // ========================

  // Open Delete Authority confirmation modal
  const hanldeDeleteAuthorityModal = () =>
    dispatch(showDeleteAuthorityModal(true));

  // Open Add Authority modal
  const handleAddAuthority = () => {
    dispatch(showAddEditViewAuthorityModal(true));
    setAuthorityViewState(1); // 1 = Add mode
  };

  // Open Edit Authority modal
  const handleEditAuthority = () => {
    dispatch(showAddEditViewAuthorityModal(true));
    setAuthorityViewState(2); // 2 = Edit mode
  };

  // Open View Authority modal
  const handleViewAuthority = () => {
    dispatch(showAddEditViewAuthorityModal(true));
    setAuthorityViewState(3); // 3 = View mode
  };

  // ========================
  // Initial UseEffect
  // ========================
  useEffect(() => {
    const data = {
      shortCode: "",
      authorityName: "",
      countryId: 0,
      sector: "",
      sRow: 0,
      length: 10,
    };

    dispatch(GetAllAuthorityAPI(navigate, data, t));
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

  // ========================
  // Table Columns Definition
  // ========================
  const columnsAuthority = useMemo(
    () => [
      {
        title: (
          <>
            <span className="d-flex gap-2 align-items-center justify-content-start">
              {t("Short-code")}
              {shortCodeSort === "descend" ? (
                <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
              ) : (
                <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
              )}
            </span>
          </>
        ),

        dataIndex: "shortCode",
        key: "shortCode",
        width: "15%",
        align: "left",
        ellipsis: true,
        sortDirections: ["descend", "ascend"],
        onHeaderCell: () => ({
          onClick: () => {
            setShortCodeSort((order) => {
              if (order === "descend") return "ascend";
              if (order === "ascend") return "descend";
              return "descend";
            });
          },
        }),
      },
      {
        title: (
          <>
            <span className="d-flex gap-2 align-items-center justify-content-start">
              {t("Authority-name")}
              {authorityNameSort === "descend" ? (
                <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
              ) : (
                <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
              )}
            </span>
          </>
        ),
        onHeaderCell: () => ({
          onClick: () => {
            setAuthoritySort((order) => {
              if (order === "descend") return "ascend";
              if (order === "ascend") return "descend";
              return "descend";
            });
          },
        }),
        dataIndex: "name",
        key: "name",
        width: "25%",
        ellipsis: true,
        align: "left",
      },
      {
        title: (
          <>
            <span className="d-flex gap-2 align-items-center justify-content-start">
              {t("Country")}
              {countrySort === "descend" ? (
                <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
              ) : (
                <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
              )}
            </span>
          </>
        ),
        onHeaderCell: () => ({
          onClick: () => {
            setCountrySort((order) => {
              if (order === "descend") return "ascend";
              if (order === "ascend") return "descend";
              return "descend";
            });
          },
        }),
        dataIndex: "country",
        key: "country",
        width: "12%",
        align: "left",
        ellipsis: true,
      },
      {
        title: (
          <>
            <span className="d-flex gap-2 align-items-center justify-content-start">
              {t("Sector")}
              {sectorSort === "descend" ? (
                <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
              ) : (
                <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
              )}
            </span>
          </>
        ),
        onHeaderCell: () => ({
          onClick: () => {
            setSectorSort((order) => {
              if (order === "descend") return "ascend";
              if (order === "ascend") return "descend";
              return "descend";
            });
          },
        }),
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
                  onClick={hanldeDeleteAuthorityModal}
                />

                {/* Edit Authority */}
                <img
                  className="cursor-pointer"
                  draggable="false"
                  alt=""
                  src={editIcon}
                  onClick={handleEditAuthority}
                />

                {/* View Authority */}
                <Button
                  text={"View Details"}
                  className={styles["viewAuthorityBtn"]}
                  onClick={handleViewAuthority}
                />
              </Col>
            </Row>
          );
        },
      },
    ],
    [t] // Re-render columns when language changes
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

  // Handle Enter key search
  const handleKeyDownSearchAuthority = (e) => {
    if (e.key === "Enter") {
      if (searchPayload.authorityTitle !== "") {
        setEnterpressed(true);

        // Search payload sent to backend
        const Data = {
          authorityName: searchPayload.authorityTitle,
          shortCode: "",
          country: "",
          sector: "",
          sRow: 0,
          Length: 10,
        };
        console.log(Data, "Search Data");
      }
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
    setSearchPayload({
      shortCode: "",
      authorityName: "",
      authorityTitle: "",
      country: "",
      sector: "",
    });
  };

  // Trigger search button action
  const handleSearchAuthorityButton = () => {
    const Data = {
      shortCode: searchPayload.shortCode,
      authorityName: searchPayload.authorityName,
      country: searchPayload.country,
      sector: searchPayload.sector,
    };
    console.log(Data, "Search Data");
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

  // Memoized rows for table
  const rowsData = useMemo(() => {
    return data;
  }, [data]);

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
                {t("Authority")}
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
                          <TextField
                            labelclass={"d-none"}
                            placeholder={t("Country")}
                            maxLength={50}
                            name={"country"}
                            applyClass={"usermanagementTextField"}
                            type="text"
                            value={searchPayload.country}
                            change={handleSearchAuthority}
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
            scroll={{ x: "max-content", y: 500 }}
            pagination={false}
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
                {/* <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center align-items-center mt-5"
                >
                  <span className={styles["EmptyAuthorityState_heading"]}>
                    {t("No-authority-available")}
                  </span>
                </Col> */}
              </Row>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <span className={styles["EmptyAuthorityState_heading"]}>
                    {t("No-authority-available")}
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

      <DeleteAuthorityModal />
      <AddEditViewAuthorityModal />
    </>
  );
};

export default ManageAuthority;
