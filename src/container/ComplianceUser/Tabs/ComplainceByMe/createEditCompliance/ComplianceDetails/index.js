import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
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
  AddComplianceAPI,
  GetAllAuthoritiesWithoutPaginationAPI,
  GetAllTagsByOrganizationIDAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import { Button } from "../../../../../../components/elements";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { multiDatePickerDateChangIntoUTC } from "../../../../../../commen/functions/date_formater";
import ComplianceCloseConfirmationModal from "../../../../CommonComponents/ComplianceCloseConfirmationModal";
import { parseUTCDateString } from "../../../../CommonComponents/commonFunctions";
const ComplainceDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    complianceAddEditViewState,
    setCloseConfirmationModal,
    setComplianceInfo,
    setChecklistTabs,
    complianceDetailsState,
    setComplianceDetailsState,
  } = useComplianceContext();
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [selectAuthority, setSelectAuthority] = useState("");
  const [authorityOptions, setAuthorityOptions] = useState([]);
  const calendRef = useRef();
  const [complianceDetails, setComplianceDetails] = useState({
    complianceTitle: "",
    complianceDescription: "",
  });
  const [selectCriticality, setSelectCriticality] = useState("");
  const [complianceDueDate, setComplianceDueDate] = useState("");
  const [errors, setErrors] = useState({});

  let currentLanguage = localStorage.getItem("i18nextLng");
  const getAllAuthorities = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllAuthoritiesDropdown
  );
  const GetAllTagsByOrganizationIDData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllTagsByOrganizationID
  );

  const criticalityOptions = [
    {
      label: "High",
      value: 1,
    },
    {
      label: "Medium",
      value: 2,
    },
    {
      label: "Low",
      value: 3,
    },
  ];

  useEffect(() => {
    dispatch(GetAllAuthoritiesWithoutPaginationAPI(navigate, t));
  }, []);

  // GetAllAuthority
  useEffect(() => {
    if (getAllAuthorities && getAllAuthorities !== null) {
      try {
        const { authorityList } = getAllAuthorities;

        let allAuthority = authorityList.map((data, index) => {
          return {
            ...data,
            value: data.authorityID,
            label: data.authorityName,
          };
        });
        setAuthorityOptions(allAuthority);
      } catch (error) {
        console.log(error);
      }
    }
  }, [getAllAuthorities]);

  useEffect(() => {
    if (
      GetAllTagsByOrganizationIDData !== null &&
      GetAllTagsByOrganizationIDData !== undefined
    ) {
      try {
        setTagsOptions(GetAllTagsByOrganizationIDData.tags);
      } catch (error) {
        console.log(error);
      }
    } else {
      setTagsOptions([]);
    }
  }, [GetAllTagsByOrganizationIDData]);

  useEffect(() => {
    if (!complianceDetailsState) return;

    // ✅ Set Authority (react-select needs full object)
    if (
      complianceDetailsState.authorityId !== 0 &&
      authorityOptions.length > 0
    ) {
      const selectedAuthority = authorityOptions.find(
        (item) => item.value === complianceDetailsState.authorityId
      );
      setSelectAuthority(selectedAuthority || "");
    }

    // ✅ Set Criticality
    if (complianceDetailsState.criticality !== 0) {
      const selectedCriticality = criticalityOptions.find(
        (item) => item.value === complianceDetailsState.criticality
      );
      setSelectCriticality(selectedCriticality || "");
    }

    // ✅ Due Date FIX
    if (complianceDetailsState.dueDate) {
      const parsedDate = parseUTCDateString(complianceDetailsState.dueDate);
      setComplianceDueDate(parsedDate);
    }

    // ✅ Set Title & Description
    setComplianceDetails({
      complianceTitle: complianceDetailsState.complianceTitle || "",
      complianceDescription: complianceDetailsState.description || "",
    });

    // ✅ Set Tags (if coming from API/state)
    if (Array.isArray(complianceDetailsState.tags)) {
      const mappedTags = complianceDetailsState.tags.map((tag, index) => ({
        tagTitle: tag,
        tagID: index + 1,
      }));
      setSelectedTags(mappedTags);
    }
  }, [complianceDetailsState, authorityOptions]);

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

  const handleChangeTags = (event) => {
    const { value } = event.target;
    const trimVal = value.trimStart();
    setTagsValue(trimVal);
    if (trimVal <= 2) {
      setTagsOptions([]);
    }
    if (trimVal.length >= 3) {
      console.log("Api Trigger");
      dispatch(GetAllTagsByOrganizationIDAPI(navigate, trimVal, t));
    }
  };

  const handleAddTagsKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      tagsValue.length >= 3 &&
      // tagsOptions.length === 0 &&
      selectedTags.length < 5
    ) {
      const isSelected = selectedTags.some(
        (selectedTag) => selectedTag.tagTitle === tagsValue
      );
      if (!isSelected) {
        setSelectedTags([
          ...selectedTags,
          { tagTitle: tagsValue, tagID: Math.random(Math.floor()) * 5 },
        ]);
        setTagsValue("");
        setTagsOptions([]);
      }
    }
  };

  const handleAddTags = (option) => {
    // setSelectedTags((prev) => [...prev, option]);

    const isSelected = selectedTags.some(
      (selectedTag) => selectedTag.tagTitle === tagsValue
    );
    if (!isSelected) {
      setSelectedTags([...selectedTags, option]);
      setTagsValue("");
      setTagsOptions([]);
    }
  };
  const handleCloseButton = () => {
    // if (complianceAddEditViewState === 3) {
    //   setAddEditViewAuthoriyModal(false);
    //   setAddViewAuthorityDetails(true);
    // }
    setCloseConfirmationModal(true);
    // setAddViewAuthorityDetails(false);
  };

  const handleClickNextBtn = () => {
    const tagsArr = selectedTags.map((data) => data.tagTitle);

    const Data = {
      complianceTitle: complianceDetails.complianceTitle,
      description: complianceDetails.complianceDescription,
      authorityId: selectAuthority.value,
      criticality: selectCriticality.value,
      dueDate: multiDatePickerDateChangIntoUTC(complianceDueDate),
      tags: tagsArr,
    };
    setComplianceDetailsState(Data);
    dispatch(
      AddComplianceAPI(navigate, Data, t, setComplianceInfo, setChecklistTabs)
    );
  };

  const changeComplainceDueDate = (date) => {
    let meetingDateValueFormat2 = new Date(date);
    meetingDateValueFormat2.setHours(23);
    meetingDateValueFormat2.setMinutes(59);
    meetingDateValueFormat2.setSeconds(58);
    setComplianceDueDate(meetingDateValueFormat2);
  };
  return (
    <>
      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
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
                options={authorityOptions}
                labelInValue={t("Authority")}
                onChange={(event) => {
                  setSelectAuthority(event);
                }}
                value={selectAuthority}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Authority") : ""
                }
                classNamePrefix="Select_country_Authoriy"
              />
            )}
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={11} md={11} lg={11}>
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
            disabled={selectAuthority === ""}
          />
          {/* <p
            className={
              errors.name
                ? styles["errorMessage-inLogin"]
                : styles["errorMessage-inLogin_hidden"]
            }
          >
            {errors.name}
          </p> */}
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
            disabled={selectAuthority === ""}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={6} lg={6}>
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
                options={criticalityOptions}
                labelInValue={t("Criticality")}
                onChange={(event) => setSelectCriticality(event)}
                value={selectCriticality}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Criticality") : ""
                }
                classNamePrefix="Select_country_Authoriy"
                isDisabled={selectAuthority === ""}
              />
            )}
          </div>
        </Col>
        <Col sm={12} md={6} lg={6}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Due-date")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <DatePicker
            value={complianceDueDate}
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
            calendar={gregorian}
            locale={currentLanguage === "en" ? gregorian_en : gregorian_ar}
            ref={calendRef}
            onFocusedDateChange={changeComplainceDueDate}
            onChange={changeComplainceDueDate}
            disabled={selectAuthority === ""}
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
                        disabled={
                          selectAuthority === ""
                            ? true
                            : selectedTags.length === 5
                            ? true
                            : false
                        }
                        value={tagsValue}
                        onChange={handleChangeTags}
                        onKeyDown={handleAddTagsKeyDown}
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
                      {tagsOptions.length > 0 && (
                        <div className={styles["TagsOptionsBox"]}>
                          {tagsOptions.map((tag) => {
                            const isSelected = selectedTags.some(
                              (selectedTag) => selectedTag.tagID === tag.tagID
                            );

                            return (
                              <p
                                key={tag.tagID} // unique key
                                className={`${styles["TagsOption_Value"]} ${
                                  isSelected ? styles["tagDisabled"] : ""
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
                    className="d-flex justify-content-start align-items-end flex-wrap"
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
                              selectedTags.filter((t) => t.tagID !== tag.tagID)
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
      <Row>
        {tagsOptions.length === 0 && (
          <div className={styles["limitLabel"]}>{t("Add-upto-5-tags")}</div>
        )}
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
          onClick={handleClickNextBtn}
          disableBtn={
            complianceDetails.complianceTitle !== "" &&
            complianceDetails.complianceDescription !== "" &&
            selectAuthority !== "" &&
            selectCriticality !== "" &&
            complianceDueDate !== ""
              ? false
              : true
          }
        />
      </div>
      <ComplianceCloseConfirmationModal />
    </>
  );
};

export default ComplainceDetails;
