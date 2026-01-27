import React, { useEffect, useRef, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
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
  CheckComplianceTitleExistsAPI,
  EditComplianceAPI,
  GetAllAuthoritiesWithoutPaginationAPI,
  GetAllTagsByOrganizationIDAPI,
  GetComplianceChecklistsByComplianceIdAPI,
  GetComplianceChecklistsWithTasksByComplianceIdAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import { Button } from "../../../../../../components/elements";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { multiDatePickerDateChangIntoUTC } from "../../../../../../commen/functions/date_formater";
import ComplianceCloseConfirmationModal from "../../../../CommonComponents/ComplianceCloseConfirmationModal";
import { parseYYYYMMDDToEndOfDay } from "../../../../CommonComponents/commonFunctions";
import { Check2 } from "react-bootstrap-icons";
import AsyncCreatableSelect from "react-select/async-creatable";
import CompliaceStatusOnHoldModal from "../../../../CommonComponents/StatusChangeModals/ComplianceStatusOnHoldModal";

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
    complianceInfo,
    setChecklistCount,
    setTaskCount,
    setChecklistData,
    setAllowedComplianceStatusOptions,
    allowedComplianceStatusOptions,
    complianceOnHoldModal,
    setComplianceOnHoldModal,
  } = useComplianceContext();

  const { t } = useTranslation();
  const [tagsOptions, setTagsOptions] = useState([]);

  const [authorityOptions, setAuthorityOptions] = useState([]);
  const calendRef = useRef();

  const [errors, setErrors] = useState({
    complianceTitle: "",
  });
  const [isChecklistTitleExist, setIsChecklistTitleExist] = useState(null);
  const [tagInputActive, setTagInputActive] = useState(false);

  let currentLanguage = localStorage.getItem("i18nextLng");
  const getAllAuthorities = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllAuthoritiesDropdown
  );
  const GetAllTagsByOrganizationIDData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllTagsByOrganizationID
  );
  const viewComplianceByMeDetails = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ViewComplianceByMeDetails
  );

  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId
  );

  const getAllComplianceChecklistTask = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceId
  );

  console.log(tagsOptions, "GetAllTagsByOrganizationIDData");

  const criticalityOptions = [
    {
      label: "Low",
      value: 1,
    },
    {
      label: "Medium",
      value: 2,
    },
    {
      label: "High",
      value: 3,
    },
  ];

  useEffect(() => {
    dispatch(GetAllAuthoritiesWithoutPaginationAPI(navigate, t));
  }, []);

  useEffect(() => {
    if (viewComplianceByMeDetails !== null) {
      try {
        const {
          allowedComplianceStatuses,
          authority,
          checklistTasks,
          checklists,
          completedTasks,
          complianceId,
          complianceStatus,
          complianceTitle,
          createdBy,
          criticalityLevel,
          description,
          dueDate,
          isExecuted,
          progressPercent,
          showProgressBar,
          tags,
          totalTasks,
        } = viewComplianceByMeDetails;
        setComplianceInfo({
          complianceId: complianceId,
          complianceName: complianceTitle,
        });

        console.log(
          viewComplianceByMeDetails,
          "complianceDetailscomplianceDetails"
        );
        const selectedCriticality = criticalityOptions.find(
          (item) => item.label === criticalityLevel
        );
        setComplianceDetailsState((prev) => ({
          ...prev,
          complianceTitle: complianceTitle,
          complianceId: complianceId,
          description: description,
          authority: {
            ...authority,
            value: authority.authorityId,
            label: `${authority.authorityName} (${authority.authorityShortCode})`,
          },
          criticality: selectedCriticality,
          dueDate: parseYYYYMMDDToEndOfDay(dueDate),
          tags: tags,
          status: {
            value: complianceStatus.statusId,
            label: complianceStatus.statusName,
          },
        }));
        // setChecklistCount(checklists.length);
        // setTaskCount(totalTasks);
        if (allowedComplianceStatuses && allowedComplianceStatuses.length > 0) {
          const allowedStatuses = allowedComplianceStatuses.map(
            (data, index) => {
              return {
                ...data,
                value: data.statusId,
                label: data.statusName,
              };
            }
          );
          setAllowedComplianceStatusOptions(allowedStatuses);
        }
        if (complianceId !== 0) {
          let Data = {
            complianceId: complianceId,
          };
          dispatch(GetComplianceChecklistsByComplianceIdAPI(navigate, Data, t));
          dispatch(
            GetComplianceChecklistsWithTasksByComplianceIdAPI(navigate, Data, t)
          );
        }
      } catch (error) {}
    }
  }, [viewComplianceByMeDetails]);

  // setComplianceChecklistCount
  useEffect(() => {
    if (
      GetComplianceChecklistsByComplianceId &&
      GetComplianceChecklistsByComplianceId !== null
    ) {
      setChecklistCount(
        GetComplianceChecklistsByComplianceId.checklistList.length
      );
      // setGetCheckListData(GetComplianceChecklistsByComplianceId.checklistList);
      // 🔑 COLLAPSE ALL ACCORDIONS AFTER ADD
      // setExpandedCheckListIds([]);
    } else {
      setChecklistCount(0);
    }
  }, [GetComplianceChecklistsByComplianceId]);

  useEffect(() => {
    if (
      getAllComplianceChecklistTask &&
      getAllComplianceChecklistTask !== null
    ) {
      try {
        const checklistList = getAllComplianceChecklistTask.checklistList;
        const totalTaskCount = checklistList.reduce(
          (sum, checklist) => sum + (checklist.taskList?.length || 0),
          0
        );
        setTaskCount(totalTaskCount);
      } catch (error) {}
    }
  }, [getAllComplianceChecklistTask]);

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
        setTagsOptions([]);
        console.log(error);
      }
    } else {
      setTagsOptions([]);
    }
  }, [GetAllTagsByOrganizationIDData]);

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    let error = "";

    setComplianceDetailsState((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  //   tags Selection
  const [tagsValue, setTagsValue] = useState("");

  const MAX_TAG_LENGTH = 25;

  const handleInputChange = (newValue, actionMeta) => {
    if (actionMeta.action !== "input-change") return newValue;

    // remove leading spaces
    let trimmed = newValue.replace(/^\s+/, "");

    // enforce max length
    if (trimmed.length > MAX_TAG_LENGTH) {
      trimmed = trimmed.slice(0, MAX_TAG_LENGTH);
    }

    setTagsValue(trimmed);
    return trimmed;
  };

  const CharacterCountIndicator = ({ selectProps }) => {
    const length = selectProps.inputValue?.length || 0;

    return (
      <div
        style={{
          paddingRight: "8px",
          paddingTop: "20px",
          fontSize: "8px",
          fontFamily: "Montserrat",
          fontWeight: "600",
          color: length >= MAX_TAG_LENGTH ? "#f16b6b" : "#5a5a5a",
          whiteSpace: "nowrap",
        }}
      >
        {`${length} / ${MAX_TAG_LENGTH}`}
      </div>
    );
  };

  const handleCloseButton = () => {
    setCloseConfirmationModal(true);
  };

  const handleClickNextBtn = () => {
    if (complianceInfo.complianceId !== 0) {
      const tagsArr = complianceDetailsState.tags.map((data) => data.tagTitle);

      const Data = {
        complianceId: complianceInfo.complianceId,
        complianceTitle: complianceDetailsState.complianceTitle,
        description: complianceDetailsState.description,
        authorityId: complianceDetailsState.authority.value,
        criticality: complianceDetailsState.criticality.value,
        dueDate: multiDatePickerDateChangIntoUTC(
          complianceDetailsState.dueDate
        ),
        newStatusId: complianceDetailsState.status.value,
        tags: tagsArr,
        ReasonToMakeComplianceOnHold: "", // On Hold Compliance
        OnHoldAlongWithComplianceCheckListAndTask: 1, // On Hold Compliance Including Checklist and Task
      };

      console.log(Data, "updatedData");
      dispatch(EditComplianceAPI(navigate, Data, t, setChecklistTabs));
    } else {
      const tagsArr = complianceDetailsState.tags.map((data) => data.tagTitle);
      const Data = {
        complianceTitle: complianceDetailsState.complianceTitle,
        description: complianceDetailsState.description,
        authorityId: complianceDetailsState.authority.value,
        criticality: complianceDetailsState.criticality.value,
        dueDate: multiDatePickerDateChangIntoUTC(
          complianceDetailsState.dueDate
        ),
        tags: tagsArr,
      };
      dispatch(
        AddComplianceAPI(navigate, Data, t, setComplianceInfo, setChecklistTabs)
      );
    }
  };

  const changeComplainceDueDate = (date) => {
    let meetingDateValueFormat2 = new Date(date);
    meetingDateValueFormat2.setHours(23);
    meetingDateValueFormat2.setMinutes(59);
    meetingDateValueFormat2.setSeconds(58);

    console.log(meetingDateValueFormat2, "meetingDateValueFormat2");

    setComplianceDetailsState((prev) => ({
      ...prev,
      dueDate: meetingDateValueFormat2,
    }));
  };

  const handleBlur = (event) => {
    if (complianceAddEditViewState === 3) return;

    const { name, value } = event.target;

    if (name === "complianceTitle" && value) {
      const Data = {
        ComplianceTitle: complianceDetailsState.complianceTitle,
        AuthorityID: complianceDetailsState.authority.value,
      };

      dispatch(
        CheckComplianceTitleExistsAPI(
          navigate,
          Data,
          t,
          setIsChecklistTitleExist,
          setErrors
        )
      );
    }
  };

  const handleSelectAuthority = (event) => {
    if (complianceDetailsState.complianceTitle === "") {
      setComplianceDetailsState((prev) => ({
        ...prev,
        authority: event,
      }));
    } else if (complianceDetailsState.complianceTitle !== "") {
      setErrors({
        complianceTitle: "",
      });
      setComplianceDetailsState((prev) => ({
        ...prev,
        authority: event,
      }));
      const Data = {
        ComplianceTitle: complianceDetailsState.complianceTitle,
        AuthorityID: event.value,
      };

      dispatch(
        CheckComplianceTitleExistsAPI(
          navigate,
          Data,
          t,
          setIsChecklistTitleExist,
          setErrors
        )
      );
    }
  };

  // Working for Tags
  const loadOptions = async (inputValue) => {
    if (inputValue.length < 3) return [];

    const tags = await dispatch(
      GetAllTagsByOrganizationIDAPI(navigate, inputValue, t)
    );

    return tags.map((tag) => ({
      label: tag.tagTitle,
      value: tag.tagID,
    }));
  };

  const handleSelectTag = (option) => {
    if (!option) return;
    if (complianceDetailsState.tags.length >= 5) return;

    const exists = complianceDetailsState.tags.some(
      (tag) => tag.tagTitle.toLowerCase() === option.label.toLowerCase()
    );

    if (exists) return;

    setComplianceDetailsState((prev) => ({
      ...prev,
      tags: [
        ...prev.tags,
        {
          tagTitle: option.label,
          tagID: option.value || crypto.randomUUID(),
        },
      ],
    }));

    setTagsValue(""); // clear input
    setTagInputActive(false);
  };
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor:
        tagsValue.length >= MAX_TAG_LENGTH ? "#f16b6b" : base.borderColor,
      boxShadow:
        tagsValue.length >= MAX_TAG_LENGTH
          ? "#ff4d4f"
          : state.isFocused
          ? base.boxShadow
          : "none",
      "&:hover": {
        borderColor:
          tagsValue.length >= MAX_TAG_LENGTH ? "#f16b6b" : base.borderColor,
      },
    }),
  };

  // Status
  const handleChangeComplianceStatus = (event) => {
    console.log(event, "CompliaceStatusOnHoldModal");

    // status change to On Hold
    if (event.value === 7) setComplianceOnHoldModal(true);
    // Status chnage to In Progress
    else if (event.value === 2) {
      setComplianceDetailsState((prev) => ({
        ...prev,
        status: event,
      }));
    }
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
                onChange={handleSelectAuthority}
                value={complianceDetailsState.authority}
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
        <div className={styles["ConplianceTitleInput"]}>
          <InputfieldwithCount
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
            value={complianceDetailsState.complianceTitle}
            labelClass={styles["labelStyle"]}
            disabled={
              complianceDetailsState.authority.value === 0 ? true : false
            }
            onBlur={handleBlur}
          />
          {console.log(errors, "COmplainceError")}
          <p
            className={
              errors.complianceTitle
                ? styles["errorMessage-inLogin"]
                : styles["errorMessage-inLogin_hidden"]
            }
          >
            {errors.complianceTitle}
          </p>
        </div>
        <div className={styles["ConplianceTitleInput_loading"]}>
          {isChecklistTitleExist === true ? (
            <Spinner size="md" className={styles["SpinnerClass"]} />
          ) : isChecklistTitleExist === false ? (
            <Check2 className={styles["CheckIcon"]} />
          ) : null}
        </div>
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
            name="description"
            preFixClas={
              complianceAddEditViewState === 3
                ? "viewField_TextArea_Name"
                : "AddEditAuthorityCounterInputFieldTextArea"
            }
            value={complianceDetailsState.description}
            disabled={
              complianceDetailsState.authority.value === 0 ? true : false
            }
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
                onChange={(event) =>
                  setComplianceDetailsState((prev) => ({
                    ...prev,
                    criticality: event,
                  }))
                }
                value={complianceDetailsState.criticality}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Criticality") : ""
                }
                classNamePrefix="Select_country_Authoriy"
                isDisabled={
                  complianceDetailsState.authority.value === 0 ? true : false
                }
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
            value={complianceDetailsState.dueDate}
            format={"DD/MM/YYYY"}
            minDate={moment().toDate()}
            placeholder={t("Due-date")}
            render={
              <InputIcon
                placeholder={t("Due-date")}
                className={`${styles["datepicker_input"]} ${
                  complianceDetailsState.authority.value === 0
                    ? styles["disabledInput"]
                    : ""
                }`}
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
            disabled={
              complianceDetailsState.authority.value === 0 ? true : false
            }
          />
        </Col>
      </Row>

      {complianceAddEditViewState === 2 && (
        <Row className="mt-2">
          <Col sm={12} md={4} lg={4}>
            <div
              className={`${styles["labelStyle"]} ${styles["Select_label"]}`}
            >
              {t("Status")}
            </div>
            <div className={styles["Select_Authoriy_div"]}>
              <Select
                isSearchable={true}
                options={allowedComplianceStatusOptions}
                labelInValue={t("Status")}
                // onChange={(event) => setSelectCriticality(event)}

                onChange={handleChangeComplianceStatus}
                value={complianceDetailsState.status}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Status") : ""
                }
                classNamePrefix="Select_country_Authoriy"
                isDisabled={
                  complianceDetailsState.authority.value === 0 ? true : false
                }
              />
            </div>
          </Col>
        </Row>
      )}

      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <div className={styles["Select_Authoriy_div"]}>
            {complianceAddEditViewState === 3 ? (
              <span>{/* {selectCountry?.label} */}</span>
            ) : (
              <>
                <Row>
                  <Col sm={12} md={4} lg={4}>
                    <div
                      className={`${styles["labelStyle"]} ${styles["Select_label"]}`}
                    >
                      {t("Tags")}
                    </div>
                    <div className="w-100 position-relative mt-1">
                      <AsyncCreatableSelect
                        cacheOptions
                        loadOptions={loadOptions}
                        value={null}
                        inputValue={tagsValue}
                        onInputChange={handleInputChange}
                        onChange={handleSelectTag}
                        styles={selectStyles}
                        classNamePrefix="tagInputBoxStyle"
                        isDisabled={
                          complianceDetailsState.tags.length >= 5 ||
                          complianceDetailsState.authority.value === 0
                        }
                        maxMenuHeight={150}
                        placeholder="Type at least 3 characters..."
                        noOptionsMessage={({ inputValue }) =>
                          inputValue.length < 3
                            ? "No Tags"
                            : "No results, press Enter to add"
                        }
                        onFocus={() => setTagInputActive(true)}
                        onBlur={() => setTagInputActive(false)}
                        formatCreateLabel={(input) => `Add "${input}"`}
                        isOptionDisabled={(option) =>
                          complianceDetailsState.tags.some(
                            (tag) => tag.tagID === option.value
                          )
                        }
                        components={{
                          DropdownIndicator: CharacterCountIndicator,
                          IndicatorSeparator: null,
                        }}
                      />
                    </div>
                  </Col>
                  <Col
                    sm={12}
                    md={8}
                    lg={8}
                    className="d-flex justify-content-start align-items-end flex-wrap"
                  >
                    {/* Selected Tags Outside */}
                    {complianceDetailsState.tags.length > 0 &&
                      complianceDetailsState.tags.map((tag) => (
                        <Tag
                          key={tag.tagID}
                          closable
                          className={styles["tagsStyle"]}
                          onClose={() =>
                            setComplianceDetailsState((prev) => ({
                              ...prev,
                              tags: prev.tags.filter(
                                (t) => t.tagID !== tag.tagID
                              ),
                            }))
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
        {!tagInputActive && (
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
            complianceDetailsState.authority.value !== 0 &&
            complianceDetailsState.criticality.value !== 0 &&
            complianceDetailsState.dueDate !== "" &&
            complianceDetailsState.complianceTitle !== "" &&
            errors.complianceTitle === ""
              ? false
              : true
          }
        />
      </div>
      <ComplianceCloseConfirmationModal />
      <CompliaceStatusOnHoldModal />
    </>
  );
};

export default ComplainceDetails;
