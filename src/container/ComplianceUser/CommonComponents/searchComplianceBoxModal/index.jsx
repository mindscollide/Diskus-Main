import React, { useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { listOfComplianceByCreatorApi } from "../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import searchicon from "../../../../assets/images/searchicon.svg";
import styles from "./searchComplianceBoxModal.module.css";
const SearchComplianceBoxModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Search States
  const searchBoxRef = useRef(null);
  const [searchbox, setsearchbox] = useState(false);
  const [searchCompliancePayload, setSearchCompliancePayload] = useState({
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
  const [enterpressed, setEnterpressed] = useState(true);

  //   Functions
  const handleKeyDownSearchAuthority = (e) => {
    if (
      e.key === "Enter" &&
      searchCompliancePayload.complianceTitle.trim() !== ""
    ) {
      setEnterpressed(true);

      const updatedPayload = {
        ...searchCompliancePayload,
        complianceTitle: searchCompliancePayload.complianceTitle,
        // authorityTitle: searchPayload.authorityTitle,
      };

      setSearchCompliancePayload(updatedPayload);
      dispatch(listOfComplianceByCreatorApi(navigate, updatedPayload, t));
    }
  };
  const handleSearchCompliance = (e) => {
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
    if (name === "authorityShortCode") {
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        authorityShortCode: trimmedValue,
      });
    }
    // if (name === "Tags") {
    //   setSearchCompliancePayload({
    //     ...searchCompliancePayload,
    //     Tags: trimmedValue,
    //   });
    // }
    // if (name === "sector") {
    //   setSearchCompliancePayload({ ...searchCompliancePayload, sector: trimmedValue });
    // }
    // if (name === "authorityTitle") {
    //   setSearchCompliancePayload({ ...searchCompliancePayload, authorityTitle: trimmedValue });
    // }
  };
  // Reset all search fields
  const handleResetComplianceButton = () => {
    // setHasReachedBottom(false);
    // setRecordLength(0);
    // setData([]);
    setSearchCompliancePayload({
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
    // setSelectCountry({
    //   value: 0,
    //   label: "",
    // });
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
    dispatch(listOfComplianceByCreatorApi(navigate, Data, t));
    setsearchbox(false);
  };
  // Open advanced search box
  const handleSearchBoxOpen = () => {
    setsearchbox(!searchbox);

    // Move title search into authority name when opening search box
    if (searchCompliancePayload.complianceTitle !== "") {
      setSearchCompliancePayload({
        ...searchCompliancePayload,
        complianceTitle: searchCompliancePayload.complianceTitle,
        // authorityTitle: "",
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
        <Col
          lg={5}
          md={5}
          sm={12}
          xs={12}
          className="justify-content-end  align-items-center "
        >
          <span ref={searchBoxRef} className="position-relative">
            <TextField
              placeholder={t("Search")}
              name={"comlianceTitle"}
              disable={searchbox}
              value={searchCompliancePayload.complianceTitle}
              onKeyDown={handleKeyDownSearchAuthority}
              applyClass={"PollingSearchInput"}
              maxLength={100}
              labelclass="d-none"
              change={handleSearchCompliance}
              inputicon={
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      {searchCompliancePayload.complianceTitle &&
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
                          placeholder={t("Authority-name")}
                          maxLength={100}
                          name={"authorityName"}
                          value={searchCompliancePayload.complianceTitle}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleSearchCompliance}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <TextField
                          labelclass={"d-none"}
                          placeholder={t("Short-code")}
                          maxLength={10}
                          name={"shortCode"}
                          value={searchCompliancePayload.authorityShortCode}
                          type="text"
                          applyClass={"usermanagementTextField"}
                          change={handleSearchCompliance}
                        />
                      </Col>
                    </Row>

                    {/* <Row className="mt-4">
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
                    </Row> */}
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
                            searchCompliancePayload.authorityShortCode === ""
                            // searchPayload.country === "" &&
                            // searchPayload.sector === "" &&
                            // searchPayload.authorityTitle === ""
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
