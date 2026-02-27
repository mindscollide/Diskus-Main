import React, { useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import {
  listOfComplianceByCreatorApi,
  SearchComplianceForMeApi,
} from "../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import searchicon from "../../../../assets/images/searchicon.svg";
import styles from "./searchComplianceBoxModal.module.css";
import { DatePicker, Select } from "antd";
import { useComplianceContext } from "../../../../context/ComplianceContext";

const SearchComplianceBoxModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Search States
  const searchBoxRef = useRef(null);
  const [enterpressed, setEnterpressed] = useState(true);

  const {
    setComplianceByMeList,
    setComplianceForMeList,
    complianceViewMode,
    setSearchCompliancePayload,
    searchCompliancePayload,
    searchbox,
    setsearchbox,
  } = useComplianceContext();
  // Scroll

  //   Functions
  // const handleKeyDownSearchCompliance = (e) => {
  //   if (
  //     (e.key === "Enter" &&
  //       complianceViewMode === "byMe" &&
  //       compliancebyMePayload.complianceTitleOutside.trim() !== "") ||
  //     (complianceViewMode === "forMe" &&
  //       compliancebyMePayload.complianceTitleOutside.trim() !== "")
  //   ) {
  //     setEnterpressed(true);

  //     const updatedPayload = {
  //       ...compliancebyMePayload,
  //       complianceTitle: compliancebyMePayload.complianceTitleOutside,
  //       complianceTitleOutside: compliancebyMePayload.complianceTitleOutside,
  //       pageNumber: 0,
  //       length: 10,
  //     };

  //     if (complianceViewMode === "byMe") {
  //       setComplianceByMePayload(updatedPayload);
  //       dispatch(listOfComplianceByCreatorApi(navigate, updatedPayload, t));
  //     } else if (complianceViewMode === "forMe") {
  //       setComplianceForMePayload(updatedPayload);
  //       dispatch(SearchComplianceForMeApi(navigate, updatedPayload, t));
  //     }
  //   }
  // };

  const handleKeyDownSearchCompliance = (e) => {
    if (e.key === "Enter")
      if (complianceViewMode === "byMe") {
        setEnterpressed(true);

        const updatedPayload = {
          ...searchCompliancePayload,
          complianceTitle: searchCompliancePayload.complianceTitleOutside,
          complianceTitleOutside:
            searchCompliancePayload.complianceTitleOutside,
          pageNumber: 0,
          length: 10,
        };
        setSearchCompliancePayload(updatedPayload);
        setComplianceByMeList([]);
        dispatch(listOfComplianceByCreatorApi(navigate, updatedPayload, t));
      } else if (complianceViewMode === "forMe") {
        console.log("here");
        setEnterpressed(true);

        const updatedPayload = {
          ...searchCompliancePayload,
          complianceTitle: searchCompliancePayload.complianceTitleOutside,
          complianceTitleOutside:
            searchCompliancePayload.complianceTitleOutside,
          pageNumber: 0,
          length: 10,
        };
        setSearchCompliancePayload(updatedPayload);
        setComplianceForMeList([]);
        dispatch(
          SearchComplianceForMeApi(
            navigate,
            updatedPayload,
            t,
            setComplianceForMeList,
          ),
        );
      }
  };

  const handleChangeCompliance = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // Prevent leading spaces
    const trimmedValue = value.trimStart();

    if (name === "complianceTitle") {
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        complianceTitle: trimmedValue,
      });
    }
    if (name === "complianceTitleOutside") {
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        complianceTitleOutside: trimmedValue,
      });
    }
    if (name === "authorityShortCode") {
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        authorityShortCode: trimmedValue,
      });
    }
  };

  const handleSearchCompliance = () => {
    if (complianceViewMode === "byMe") {
      setComplianceByMeList([]);
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        pageNumber: 0,
        length: 10,
      });
    } else if (complianceViewMode === "forMe") {
      setComplianceForMeList([]);
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        pageNumber: 0,
        length: 10,
      });
    }

    if (complianceViewMode === "byMe") {
      setComplianceByMeList([]);
      const Data = {
        complianceTitle: searchCompliancePayload.complianceTitle,
        dueDateFrom: searchCompliancePayload.dueDateFrom,
        dueDateTo: searchCompliancePayload.dueDateTo,
        authorityShortCode: searchCompliancePayload.authorityShortCode,
        tagsCSV:
          searchCompliancePayload.tagsCSV.length > 0
            ? searchCompliancePayload.tagsCSV.join(", ")
            : "",
        criticalityIds: [],
        statusIds: [],
        pageNumber: 0,
        length: 10,
      };
      console.log("dataforByme", Data);
      dispatch(listOfComplianceByCreatorApi(navigate, Data, t));
    } else if (complianceViewMode === "forMe") {
      setComplianceForMeList([]);
      const Data = {
        complianceTitle: searchCompliancePayload.complianceTitle,
        dueDateFrom: searchCompliancePayload.dueDateFrom,
        dueDateTo: searchCompliancePayload.dueDateTo,
        authorityShortCode: searchCompliancePayload.authorityShortCode,
        tagsCSV: "",
        criticalityIds: [],
        statusIds: [],
        pageNumber: 0,
        length: 10,
      };
      dispatch(SearchComplianceForMeApi(navigate, Data, t));
    }
  };
  const handleResetComplianceButton = () => {
    // setHasReachedBottom(false);
    // setRecordLength(0);
    // setComplianceByMeList([]);
    // setComplianceByMeTotal(0);
    // setData([]);
    setSearchCompliancePayload({
      complianceTitleOutside: "",
      complianceTitle: "",
      dueDateFrom: "",
      dueDateTo: "",
      authorityShortCode: "",
      tagsCSV: "",
      criticalityIds: [],
      statusIds: [],
      pageNumber: 0,
      length: 10,
    });

    const Data = {
      complianceTitle: "",
      dueDateFrom: "",
      dueDateTo: "",
      authorityShortCode: "",
      tagsCSV: "",
      criticalityIds: [],
      statusIds: [],
      pageNumber: 0,
      length: 10,
    };
    if (complianceViewMode === "byMe") {
      dispatch(listOfComplianceByCreatorApi(navigate, Data, t));
      setsearchbox(false);
    } else {
      dispatch(SearchComplianceForMeApi(navigate, Data, t));
      setsearchbox(false);
    }
  };
  // Open advanced search box
  const handleSearchBoxOpen = () => {
    setsearchbox(!searchbox);

    // Move title search into authority name when opening search box
    if (searchCompliancePayload.complianceTitleOutside !== "") {
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        complianceTitle: searchCompliancePayload.complianceTitleOutside,
        complianceTitleOutside: "",
      });
    }
  };
  // Close advanced search box
  const handleCrossSearchBox = () => {
    setsearchbox(false);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setSearchCompliancePayload({
      ...searchCompliancePayload,
      tagsCSV: value,
    });
  };

  // const handleSearch = (value) => {
  //   // remove leading spaces only
  //   const trimmed = value.replace(/^\s+/, "");

  //   if (value !== trimmed) {
  //     setSearchValue(trimmed);
  //   }
  // };
  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <span ref={searchBoxRef} className="position-relative">
            <TextField
              placeholder={t(
                "Compliance-title.click-the-icon-to-view-more-options",
              )}
              name={"complianceTitleOutside"}
              disable={searchbox}
              value={searchCompliancePayload.complianceTitleOutside}
              onKeyDown={handleKeyDownSearchCompliance}
              applyClass={"PollingSearchInput"}
              maxLength={100}
              labelclass="d-none"
              change={handleChangeCompliance}
              inputicon={
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      {searchCompliancePayload.complianceTitleOutside &&
                      enterpressed ? (
                        <>
                          <img
                            src={BlackCrossIcon}
                            className="cursor-pointer"
                            draggable="false"
                            alt=""
                            onClick={handleResetComplianceButton}
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
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          labelclass={"d-none"}
                          placeholder={t("Compliance-title")}
                          maxLength={100}
                          name={"complianceTitle"}
                          value={searchCompliancePayload.complianceTitle}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleChangeCompliance}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          labelclass={"d-none"}
                          placeholder={t("Authority-short-code")}
                          maxLength={10}
                          name={"authorityShortCode"}
                          value={searchCompliancePayload.authorityShortCode}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleChangeCompliance}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <DatePicker.RangePicker
                          format="DD/MM/YYYY"
                          placeholder={["Start Date", "End Date"]}
                          allowEmpty={[true, true]}
                          className="custom-range-picker"
                          separator="-"
                          onChange={(dates) => {
                            setSearchCompliancePayload((prev) => ({
                              ...prev,
                              dueDateFrom: dates?.[0]
                                ? dates[0].format("YYYYMMDD")
                                : "",
                              dueDateTo: dates?.[1]
                                ? dates[1].format("YYYYMMDD")
                                : "",
                            }));
                          }}
                          superNextIcon={false}
                          superPrevIcon={false}
                          inputReadOnly
                          dropdownClassName="complaicenClassDropdownd"
                        />
                      </Col>
                    </Row>
                    {complianceViewMode === "byMe" && (
                      <Row className="mt-2">
                        <Col sm={12} md={12} lg={12}>
                          <Select
                            className={`Select_Tags_search_ant ${styles["selectBoxStyle"]}`}
                            mode="tags"
                            style={{ width: "100%" }}
                            placeholder="Tags"
                            onChange={handleChange}
                            // onSearch={handleSearch}
                            value={
                              searchCompliancePayload.tagsCSV === ""
                                ? []
                                : searchCompliancePayload.tagsCSV
                            }
                            open={false}
                          />
                        </Col>
                      </Row>
                    )}

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
                          onClick={handleResetComplianceButton}
                        />
                        <Button
                          text={t("Search")}
                          className={styles["SearchButtonSearchBox"]}
                          onClick={handleSearchCompliance}
                          disableBtn={
                            searchCompliancePayload.complianceTitle === "" &&
                            searchCompliancePayload.authorityShortCode === "" &&
                            searchCompliancePayload.dueDateFrom === "" &&
                            searchCompliancePayload.dueDateTo === "" &&
                            searchCompliancePayload.tagsCSV === ""
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
    </>
  );
};

export default SearchComplianceBoxModal;
