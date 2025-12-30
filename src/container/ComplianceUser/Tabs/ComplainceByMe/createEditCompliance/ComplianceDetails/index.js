import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  InputfieldwithCount,
  TextAreafieldwithCount,
} from "../../../../../../components/elements/input_field/Input_field_withCount";
import styles from "./complianceDetails.module.css";
import { useComplianceContext } from "../../../../../../context/ComplianceContext";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { Tag } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  GetAllAuthoritiesWithoutPaginationAPI,
  GetAllTagsByOrganizationIDAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import { Button } from "../../../../../../components/elements";

const ComplainceDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    complianceAddEditViewState,
    setComplianceAddEditViewState,
    closeConfirmationModal,
    setCloseConfirmationModal,
  } = useComplianceContext();
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);

  console.log(selectedTags, "selectedTags");
  const calendRef = useRef();

  const [complianceDetails, setComplianceDetails] = useState({
    complianceTitle: "",
    complianceDescription: "",
    // shortCode: "",
    // sector: "",
    // website: "",
    // country: "",
    // address: "",
    // contactPersonName: "",
    // email: "",
    // phoneCode: "",
    // phone: "",
    // status: "",
    // statusId: 0,
    // authorityId: 0,
  });
  const [errors, setErrors] = useState({
    complianceTitle: "",
    // shortCode: "",
    // country: "",
    // email: "",
    // website: "",
  });

  const getAllAuthorities = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllAuthoritiesDropdown
  );

  const GetAllTagsByOrganizationIDData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllTagsByOrganizationID
  );
  console.log(GetAllTagsByOrganizationIDData, "getAllTags");

  useEffect(() => {
    dispatch(GetAllAuthoritiesWithoutPaginationAPI(navigate, t));
  }, []);

  useEffect(() => {
    if (
      GetAllTagsByOrganizationIDData !== null &&
      GetAllTagsByOrganizationIDData !== undefined
    ) {
      try {
        console.log();
        // setSelectedTags(GetAllTagsByOrganizationIDData.tags);
        setTagsOptions(GetAllTagsByOrganizationIDData.tags);
      } catch (error) {
        console.log(error);
      }
    } else {
      setTagsOptions([]);
    }
  }, [GetAllTagsByOrganizationIDData]);
  const handleValueChange = (event) => {
    const { name, value } = event.target;
    console.log("handleValueChange", name, value);
    let error = "";

    switch (name) {
      case "complienceTitle":
        if (!value.trim()) {
          error = "Compliance Title is required";
        }
        break;
      case "complianceDescription":
        if (!value.trim()) {
          error = "Compliance Description is required";
        }
        break;

      //   case "shortCode":
      //     setIsShortCodeExist(null);
      //     if (!value.trim()) {
      //       error = "Short Code is required";
      //     }
      //     break;

      //   case "website":
      //     if (value && !urlRegex.test(value)) {
      //       error = "Invalid website URL";
      //     }
      //     break;

      //   case "email":
      //     if (value && !emailRegex.test(value)) {
      //       error = "Invalid email format";
      //     }
      //     break;

      //   case "phone":
      //     if (!phoneRegex.test(value)) {
      //       return; // block invalid characters
      //     }
      //     break;

      default:
        break;
    }

    setComplianceDetails((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  //   tags Selection
  const [tagsValue, setTagsValue] = useState("");
  //   const tagOptions = [
  //     { label: "Apple", value: "apple" },
  //     { label: "Banana", value: "banana" },
  //     { label: "Orange", value: "orange" },
  //   ];
  //   const handleSelectTags = (value) => {
  //     if (!selectedTags.includes(value)) {
  //       setSelectedTags([...selectedTags, value]);
  //     }
  //   };

  //   const handleRemoveTags = (value) => {
  //     setSelectedTags(selectedTags.filter((v) => v !== value));
  //   };

  const handleChangeTags = (event) => {
    const { value } = event.target;
    setTagsValue(value);
    if (value <= 2) {
      setTagsOptions([]);
    }
    if (value.trimStart().length >= 3) {
      console.log("Api Trigger");
      dispatch(GetAllTagsByOrganizationIDAPI(navigate, value, t));
    }
  };

  const [options, setOptions] = useState([]);

  // This simulates your API call
  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    // Example: Filter or fetch from your tags API
    const allTags = [
      { label: "Compliance Documentation", value: "compliance" },
      { label: "Internal Risk Assessment", value: "risk" },
      { label: "Regulatory Filing", value: "regulatory" },
      { label: "Audit Ready", value: "audit" },
      { label: "Risk Management", value: "risk-mgmt" },
    ];

    const filtered = allTags
      .filter((tag) => tag.label.toLowerCase().includes(value.toLowerCase()))
      .map((tag) => ({ label: tag.label, value: tag.value }));

    setOptions(filtered);
  };

  const handleSelect = (value, option) => {
    // Check for duplicates
    if (!selectedTags.find((tag) => tag.value === option.value)) {
      setSelectedTags([...selectedTags, option]);
    }
  };

  const handleRemove = (tagValue) => {
    setSelectedTags(selectedTags.filter((tag) => tag.value !== tagValue));
  };

  const handleAddTags = (option) => {
    setSelectedTags((prev) => [...prev, option]);
  };
  const handleCloseButton = () => {
    // if (complianceAddEditViewState === 3) {
    //   setAddEditViewAuthoriyModal(false);
    //   setAddViewAuthorityDetails(true);
    // }
    setCloseConfirmationModal(true);
    // setAddViewAuthorityDetails(false);
  };
  return (
    <>
      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <InputfieldwithCount
            // label={t("Compliance-title")}
            label={
              <>
                {t("Compliance-title")}
                <span className={styles["sterick"]}>
                  {complianceAddEditViewState !== 3 ? " *" : ""}
                </span>
              </>
            }
            placeholder={
              complianceAddEditViewState !== 3 ? t("Compliance-title") : ""
            }
            showCount={complianceAddEditViewState === 3 ? false : true}
            maxLength={100}
            onChange={handleValueChange}
            name="complianceTitle"
            preFixClas={
              complianceAddEditViewState === 3
                ? "viewField_Name"
                : "AddEditAuthorityCounterInputField"
            }
            value={complianceDetails.complianceTitle}
            labelClass={styles["labelStyle"]}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <TextAreafieldwithCount
            label={
              <>
                {t("compliance-description")}
                <span className={styles["sterick"]}>
                  {complianceAddEditViewState !== 3 ? " *" : ""}
                </span>
              </>
            }
            labelClass={styles["labelStyle"]}
            placeholder={
              complianceAddEditViewState !== 3
                ? t("compliance-description")
                : ""
            }
            showCount={complianceAddEditViewState === 3 ? false : true}
            maxLength={500}
            onChange={handleValueChange}
            name="complianceDescription"
            preFixClas={
              complianceAddEditViewState === 3
                ? "viewField_TextArea_Name"
                : "AddEditAuthorityCounterInputFieldTextArea"
            }
            value={complianceDetails.complianceDescription}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={4} lg={4}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Authority")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <div className={styles["Select_Authoriy_div"]}>
            {complianceAddEditViewState === 3 ? (
              <span>{/* {selectCountry?.label} */}</span>
            ) : (
              <Select
                isSearchable={true}
                // options={countryNames}
                labelInValue={t("Authority")}
                // onChange={(event) => setSelectCountry(event)}
                // value={selectCountry}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Authority") : ""
                }
                classNamePrefix="Select_country_Authoriy"
              />
            )}
          </div>
        </Col>
        <Col sm={12} md={4} lg={4}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Criticality")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <div className={styles["Select_Authoriy_div"]}>
            {complianceAddEditViewState === 3 ? (
              <span>{/* {selectCountry?.label} */}</span>
            ) : (
              <Select
                isSearchable={true}
                // options={countryNames}
                labelInValue={t("Criticality")}
                // onChange={(event) => setSelectCountry(event)}
                // value={selectCountry}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Criticality") : ""
                }
                classNamePrefix="Select_country_Authoriy"
              />
            )}
          </div>
        </Col>
        <Col sm={12} md={4} lg={4}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Due-date")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <DatePicker
            //   value={agendaDueDate}
            format={"DD/MM/YYYY"}
            minDate={moment().toDate()}
            placeholder={t("Due-date")}
            render={
              <InputIcon
                placeholder={t("Due-date")}
                className={styles["datepicker_input"]}
              />
            }
            editable={false}
            className="datePickerTodoCreate2"
            containerClassName={"Complaince_createEditDueDate"}
            onOpenPickNewDate={true}
            inputMode=""
            calendarPosition="bottom-center"
            //   calendar={calendarValue}
            //   locale={localValue}
            ref={calendRef}
            //   onFocusedDateChange={changeDateActionCreate}
            //   onChange={changeDateActionCreate}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <div className={styles["Select_Authoriy_div"]}>
            {complianceAddEditViewState === 3 ? (
              <span>{/* {selectCountry?.label} */}</span>
            ) : (
              <>
                <Row>
                  <Col sm={12} md={4} lg={4}>
                    <div className="w-100 position-relative">
                      <InputfieldwithCount
                        value={tagsValue}
                        onChange={handleChangeTags}
                        label={<>{t("Tags")}</>}
                        labelClass={styles["labelStyle"]}
                        maxLength={25}
                        placeholder={
                          complianceAddEditViewState !== 3 ? t("Add-tag") : ""
                        }
                        preFixClas={
                          complianceAddEditViewState === 3
                            ? "viewField_Name"
                            : "AddEditAuthorityCounterInputField"
                        }
                      />

                      {/* Show dropdown only if there are matching options */}
                      {tagsOptions.filter((tag) =>
                        tag.tagTitle
                          .toLowerCase()
                          .includes(tagsValue.toLowerCase())
                      ).length > 0 && (
                        <div className={styles["TagsOptionsBox"]}>
                          {tagsOptions
                            .filter((tag) =>
                              tag.tagTitle
                                .toLowerCase()
                                .includes(tagsValue.toLowerCase())
                            )
                            .map((tag) => {
                              const isSelected = tagsValue.includes(
                                tag.tagTitle
                              );
                              return (
                                <p
                                  key={tag.id} // unique key
                                  className={`${styles["TagsOption_Value"]} ${
                                    isSelected ? styles["boldTag"] : ""
                                  }`}
                                  onClick={() =>
                                    !isSelected && handleAddTags(tag)
                                  }
                                >
                                  {tag.tagTitle}
                                </p>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col
                    sm={12}
                    md={8}
                    lg={8}
                    className="d-flex justify-content-start align-items-end"
                  >
                    {/* Selected Tags Outside */}
                    {selectedTags.length > 0 &&
                      selectedTags.map((tag) => (
                        <Tag
                          key={tag.tagID}
                          closable
                          className={styles["tagsStyle"]}
                          onClose={() =>
                            setSelectedTags(
                              selectedTags.filter((t) => t.value !== tag.value)
                            )
                          }
                        >
                          {tag.tagTitle}
                        </Tag>
                      ))}
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>
      </Row>
      <div className={styles["buttonPosition"]}>
        <Button
          text={t("Close")}
          className={styles["Compliance_CloseButton"]}
          onClick={handleCloseButton}
        />
        <Button
          text={t("Next")}
          className={styles["Compliance_NextButton"]}
          // onClick={updateOrganizationLevelSettings}
        />
      </div>
    </>
  );
};

export default ComplainceDetails;
