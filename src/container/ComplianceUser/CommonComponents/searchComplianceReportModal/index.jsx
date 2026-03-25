import React, { useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import {
  ComplianceReportListingAPI,
  listOfComplianceByCreatorApi,
  SearchComplianceForMeApi,
} from "../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import searchicon from "../../../../assets/images/searchicon.svg";
import styles from "./SearchComplianceReportModal.module.css";
import { DatePicker } from "antd";
import Select from "react-select";
import { useComplianceContext } from "../../../../context/ComplianceContext";

const SearchComplianceReportModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Search States
  const searchBoxRef = useRef(null);
  const [enterpressed, setEnterpressed] = useState(true);

  const {
    searchComplianceReportPayload,
    setSearchComplianceReportPayload,
    setComplianceReportList,
    searchbox,
    setsearchbox,
  } = useComplianceContext();

  /* ---------------------------------- */
  /* Helpers                            */
  /* ---------------------------------- */

  const REPORT_TYPE_MAP = {
    "end of compliance": 1,
    "end-of-compliance": 1,
    "end of compliance reports": 1,

    quarterly: 2,
    "quarterly reports": 2,

    accumulative: 3,
    "accumulative reports": 3,
  };

  const mapReportTypeTextToIds = (text = "") => {
    if (!text) return "";

    // convert to array safely
    const tokens = Array.isArray(text)
      ? text
      : text
          .toLowerCase()
          .split(",")
          .map((t) => t.trim());

    const ids = tokens.map((token) => REPORT_TYPE_MAP[token]).filter(Boolean);

    return ids.length ? ids.join(",") : "";
  };

  const buildApiPayload = () => ({
    //Api Function
    reportTitle:
      searchComplianceReportPayload.reportTitle ||
      searchComplianceReportPayload.reportTitleOutside ||
      "",
    reportTypeIds: searchComplianceReportPayload.reportType?.value || "",
    generatedOnStartDate: searchComplianceReportPayload.dueDateFrom || "",
    generatedOnEndDate: searchComplianceReportPayload.dueDateTo || "",
    length: searchComplianceReportPayload.length || 10,
    sRow: searchComplianceReportPayload.sRow || 0,
  });

  const hitSearchApi = () => {
    const data = buildApiPayload();
    setComplianceReportList([]);
    dispatch(ComplianceReportListingAPI(navigate, data, t));
    setsearchbox(false);
    setEnterpressed(false);
  };

  /* ---------------------------------- */
  /* Events                             */
  /* ---------------------------------- */

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setEnterpressed(true);
      hitSearchApi();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trimStart();

    setSearchComplianceReportPayload((prev) => ({
      ...prev,
      [name]: trimmedValue,
    }));
  };

  const handleReset = () => {
    const resetState = {
      reportTitle: "",
      reportTitleOutside: "",
      reportType: "",
      dueDateFrom: "",
      dueDateTo: "",
      sRow: 0,
      length: 10,
    };

    setSearchComplianceReportPayload(resetState);
    setComplianceReportList([]);
    setsearchbox(false);

    dispatch(
      ComplianceReportListingAPI(
        navigate,
        {
          reportTitle: "",
          reportTypeIds: "",
          generatedOnStartDate: "",
          generatedOnEndDate: "",
          length: 10,
          sRow: 0,
        },
        t
      )
    );
  };

  // Open advanced search box
  const handleSearchBoxOpen = () => {
    setsearchbox(!searchbox);
  };
  // Close advanced search box
  const handleCrossSearchBox = () => {
    setsearchbox(false);
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <span ref={searchBoxRef} className="position-relative">
            <TextField
              placeholder={t(
                "Report-title.click-the-icon-to-view-more-options"
              )}
              name={"reportTitleOutside"}
              disable={searchbox}
              value={searchComplianceReportPayload?.reportTitleOutside}
              onKeyDown={handleKeyDown}
              applyClass={"PollingSearchInput"}
              maxLength={100}
              labelclass="d-none"
              change={handleChange}
              inputicon={
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      {searchComplianceReportPayload?.reportTitleOutside &&
                      enterpressed ? (
                        <>
                          <img
                            src={BlackCrossIcon}
                            className="cursor-pointer"
                            draggable="false"
                            alt=""
                            onClick={handleReset}
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
                          placeholder={t("Report-title")}
                          maxLength={100}
                          name={"reportTitle"}
                          value={searchComplianceReportPayload?.reportTitle}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleChange}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Select
                          placeholder={t("Report-type")}
                          className="usermanagementTextField"
                          value={
                            searchComplianceReportPayload?.reportType || null
                          }
                          onChange={(value) =>
                            setSearchComplianceReportPayload((prev) => ({
                              ...prev,
                              reportType: value,
                            }))
                          }
                          options={[
                            {
                              label: "End of Compliance",
                              value: 1,
                            },
                            {
                              label: "Quarterly",
                              value: 2,
                            },
                            {
                              label: "Accumulative",
                              value: 3,
                            },
                          ]}
                          allowClear
                        />
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <TextField
                          labelclass={"d-none"}
                          placeholder={t("generated-on")}
                          maxLength={100}
                          name={"generatedOn"}
                          value={searchComplianceReportPayload?.reportTitle}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleChange}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <DatePicker.RangePicker
                          format="DD/MM/YYYY"
                          placeholder={["Start Date", "End Date"]}
                          allowEmpty={[true, true]}
                          className="custom-range-picker"
                          separator="-"
                          onChange={(dates) => {
                            setSearchComplianceReportPayload((prev) => ({
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
                          onClick={handleReset}
                        />
                        <Button
                          text={t("Search")}
                          className={styles["SearchButtonSearchBox"]}
                          onClick={hitSearchApi}
                          disableBtn={
                            searchComplianceReportPayload.reportTitle === "" &&
                            searchComplianceReportPayload.reportType === "" &&
                            searchComplianceReportPayload.dueDateFrom === "" &&
                            searchComplianceReportPayload.dueDateTo === ""
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

export default SearchComplianceReportModal;
