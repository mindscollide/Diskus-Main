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
import { DatePicker } from "antd";
import { useComplianceContext } from "../../../../context/ComplianceContext";
const SearchComplianceBoxModal = ({ type = "byMe" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Search States
  const searchBoxRef = useRef(null);
  const [searchbox, setsearchbox] = useState(false);
  const [enterpressed, setEnterpressed] = useState(true);

  const {
    compliancebyMePayload,
    setComplianceByMePayload,
    setComplianceByMeList,
    // setComplianceByMeTotal,
    complianceForMePayload,
    setComplianceForMePayload,
    complianceForMeList,
    setComplianceForMeList,
  } = useComplianceContext();
  // Scroll

  // Determine which payload/list to use
  const payload =
    type === "byMe" ? compliancebyMePayload : complianceForMePayload;
  const setPayload =
    type === "byMe" ? setComplianceByMePayload : setComplianceForMePayload;
  const setList =
    type === "byMe" ? setComplianceByMeList : setComplianceForMeList;
  //   Functions
  const handleKeyDownSearchCompliance = (e) => {
    if (
      e.key === "Enter" &&
      compliancebyMePayload.complianceTitleOutside.trim() !== ""
    ) {
      setEnterpressed(true);

      const updatedPayload = {
        ...compliancebyMePayload,
        complianceTitle: compliancebyMePayload.complianceTitleOutside,
        complianceTitleOutside: compliancebyMePayload.complianceTitleOutside,
        pageNumber: 0,
        length: 10,
      };

      if (type === "byMe") {
        setComplianceByMePayload(updatedPayload);
        dispatch(listOfComplianceByCreatorApi(navigate, updatedPayload, t));
      } else {
        setComplianceForMePayload(updatedPayload);
        dispatch(SearchComplianceForMeApi(navigate, updatedPayload, t));
      }
    }
  };
  const handleChangeCompliance = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // Prevent leading spaces
    const trimmedValue = value.trimStart();

    if (name === "complianceTitle") {
      setComplianceByMePayload({
        ...compliancebyMePayload,
        complianceTitle: trimmedValue,
      });
    }
    if (name === "complianceTitleOutside") {
      setComplianceByMePayload({
        ...compliancebyMePayload,
        complianceTitleOutside: trimmedValue,
      });
    }
    if (name === "authorityShortCode") {
      setComplianceByMePayload({
        ...compliancebyMePayload,
        authorityShortCode: trimmedValue,
      });
    }
  };

  const handleSearchCompliance = () => {
    setList([]); // reset list
    setPayload({ ...payload, pageNumber: 0, length: 10 });

    if (type === "byMe") {
      dispatch(
        listOfComplianceByCreatorApi(
          navigate,
          { ...payload, pageNumber: 0, length: 10 },
          t
        )
      );
    } else {
      dispatch(
        SearchComplianceForMeApi(
          navigate,
          { ...payload, pageNumber: 0, length: 10 },
          t
        )
      );
    }
  };
  const handleResetComplianceButton = () => {
    // setHasReachedBottom(false);
    // setRecordLength(0);
    // setComplianceByMeList([]);
    // setComplianceByMeTotal(0);
    // setData([]);
    setComplianceByMePayload({
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
    if (type === "byMe") {
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
    if (compliancebyMePayload.complianceTitleOutside !== "") {
      setComplianceByMePayload({
        ...compliancebyMePayload,
        complianceTitle: compliancebyMePayload.complianceTitleOutside,
        complianceTitleOutside: "",
      });
    }
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
              placeholder={t("Search")}
              name={"complianceTitleOutside"}
              disable={searchbox}
              value={compliancebyMePayload.complianceTitleOutside}
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
                      {compliancebyMePayload.complianceTitleOutside &&
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
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <TextField
                          labelclass={"d-none"}
                          placeholder={t("Compliance-title")}
                          maxLength={100}
                          name={"complianceTitle"}
                          value={compliancebyMePayload.complianceTitle}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleChangeCompliance}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          labelclass={"d-none"}
                          placeholder={t("Authority-short-code")}
                          maxLength={10}
                          name={"authorityShortCode"}
                          value={compliancebyMePayload.authorityShortCode}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleChangeCompliance}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <DatePicker.RangePicker
                          format="DD/MM/YYYY"
                          placeholder={["Start Date", "End Date"]}
                          allowEmpty={[true, true]}
                          className="custom-range-picker"
                          separator="-"
                          onChange={(dates) => {
                            setComplianceByMePayload((prev) => ({
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
                          onClick={handleResetComplianceButton}
                        />
                        <Button
                          text={t("Search")}
                          className={styles["SearchButtonSearchBox"]}
                          onClick={handleSearchCompliance}
                          disableBtn={
                            compliancebyMePayload.complianceTitle === "" &&
                            compliancebyMePayload.authorityShortCode === "" &&
                            compliancebyMePayload.dueDateFrom === "" &&
                            compliancebyMePayload.dueDateTo === ""
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
