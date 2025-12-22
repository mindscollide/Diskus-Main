import React, { useEffect, useState } from "react";
import styles from "./addEditAuthority.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  Button,
  Modal,
  TextArea,
  TextField,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomSwitch from "../../../../../components/elements/switch_button/Switch";
import Select from "react-select";
import { useAuthorityContext } from "../../../../../context/AuthorityContext";
import { countryNameforPhoneNumber } from "../../../AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";
import {
  AddAuthorityAPI,
  initialAddEditAuthority,
  UpdateAuthorityAPI,
} from "../../../../../store/actions/ComplainSettingActions";
const AddEditViewAuthorityModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    authorityViewState,
    setAuthorityViewState,
    setAddEditViewAuthoriyModal,
    addEditViewAuthoriyModal,
    searchPayload,
    setSearchPayload,
    setCloseConfirmationModal,
    setSelectCountry,
    setCountryNames,
    selectCountry,
    countryNames,
  } = useAuthorityContext();

  const [addViewAuthorityDetails, setAddViewAuthorityDetails] = useState(true);
  const [selected, setSelected] = useState("US");

  const GetAuthorityByAuthorityId = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAuthorityByID
  );

  const [authorityDetails, setAuthorityDetails] = useState({
    name: "",
    shortCode: "",
    description: "",
    sector: "",
    website: "",
    country: "",
    address: "",
    contactPersonName: "",
    email: "",
    phoneCode: "",
    phone: "",
    status: "",
    statusId: 0,
    authorityId: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    shortCode: "",
    country: "",
    email: "",
    website: "",
  });

  console.log({ authorityDetails, errors }, "authorityDetailsauthorityDetails");
  const navigate = useNavigate();

  //   let userID = localStorage.getItem("userID");

  //   let organizationID = localStorage.getItem("organizationID");
  const countryNamesReducerCountryNamesData = useSelector(
    (state) => state.countryNamesReducer.CountryNamesData
  );

  // Initial useEffect
  useEffect(() => {
    return () => {
      dispatch(initialAddEditAuthority());
    };
  }, []);

  useEffect(() => {
    if (
      countryNamesReducerCountryNamesData !== null &&
      countryNamesReducerCountryNamesData !== undefined
    ) {
      let newCountryMapData = countryNamesReducerCountryNamesData.map(
        (data, index) => {
          return {
            ...data,
            value: data.pK_WorldCountryID,
            label: data.countryName,
          };
        }
      );
      setCountryNames(newCountryMapData);
    }
    return () => {
      setSelectCountry(null);
    };
  }, [countryNamesReducerCountryNamesData]);

  useEffect(() => {
    if (
      GetAuthorityByAuthorityId !== null &&
      GetAuthorityByAuthorityId !== undefined
    ) {
      try {
        const { authority } = GetAuthorityByAuthorityId;
        console.log(authority, "authorityauthority");

        // Split phone only if it exists
        let phoneCode = "";
        let phoneNumber = "";
        let selectedCountryCode = "US"; // default fallback

        if (authority.phone) {
          const [code, number] = authority.phone.split("_");
          phoneCode = code || "";
          phoneNumber = number || "";

          // Find country for flag dropdown
          const countryObj = Object.values(countryNameforPhoneNumber).find(
            (item) => item.secondary === phoneCode
          );

          if (countryObj) {
            selectedCountryCode = countryObj.primary;
          }
        }

        setSelected(selectedCountryCode);

        let getCountryObj = countryNamesReducerCountryNamesData.find(
          (country) => country.pK_WorldCountryID === authority.countryId
        );

        if (getCountryObj) {
          getCountryObj = {
            ...getCountryObj,
            value: authority.countryId,
            label: getCountryObj.countryName,
          };
        }
        setSelectCountry(getCountryObj);

        console.log(getCountryObj, "getCountryObjgetCountryObj");

        setAuthorityDetails({
          ...authorityDetails,
          name: authority.authorityName,
          shortCode: authority.shortCode,
          sector: authority.sector,
          address: authority.address,
          website: authority.website,
          phone: phoneNumber, // number part only
          phoneCode: phoneCode, // store code separately
          status: authority.status,
          contactPersonName: authority.contactPersonName,
          description: authority.description,
          email: authority.email,
          authorityId: authority.authorityId,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [GetAuthorityByAuthorityId, countryNamesReducerCountryNamesData]);

  const handleSelect = (country) => {
    // console.log(country, "CountryIDCountryID");
    setSelected(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary === country;
    });
    setAuthorityDetails({
      ...authorityDetails,
      phoneCode: a.secondary,
    });
    console.log(a, "CountryIDCountryID");
    // setSignUpDetails({
    //   ...signUpDetails,
    //   FK_CCID: a.id,
    //   PhoneNumberCountryID: a.id,
    // });
  };

  const handleCancelButton = () => {
    setCloseConfirmationModal(true);
    setAddViewAuthorityDetails(false);
  };

  const handleConfirmationYesButton = () => {
    setAddViewAuthorityDetails(true);
    setCloseConfirmationModal(false);
    setAddEditViewAuthoriyModal(false);
  };

  const handleConfirmationNoButton = () => {
    setCloseConfirmationModal(false);
    setAddEditViewAuthoriyModal(true);
    setAddViewAuthorityDetails(true);
  };
  const handleChangeSwitchValue = (checked) => {
    console.log("Switch value:", checked); // true or false

    setAuthorityDetails((prev) => ({
      ...prev,
      status: checked ? "Active" : "Inactive", // update status accordingly
    }));
  };
  let isAllValid =
    errors.name === "" &&
    errors.shortCode === "" &&
    errors.website === "" &&
    errors.email === "" &&
    selectCountry !== null;
  console.log(isAllValid, "isAllValidisAllValid");
  const handleAddAuthority = () => {
    if (isAllValid) {
      const Data = {
        authorityName: authorityDetails.name.trim(),
        shortCode: authorityDetails.shortCode.trim(),
        description: authorityDetails.description.trim(),
        sector: authorityDetails.sector.trim(),
        website: authorityDetails.website.trim(),
        countryId: selectCountry.pK_WorldCountryID,
        address: authorityDetails.address.trim(),
        contactPersonName: authorityDetails.contactPersonName.trim(),
        email: authorityDetails.email.trim(),
        phone: `${authorityDetails.phoneCode}_${authorityDetails.phone.trim()}`,
      };
      console.log(Data, "add authority");

      dispatch(
        AddAuthorityAPI(
          navigate,
          Data,
          t,
          setAddEditViewAuthoriyModal,
          searchPayload,
          setSearchPayload
        )
      );
    }
  };
  const handleUpdateAuthority = () => {
    if (isAllValid) {
      const Data = {
        authorityId: authorityDetails.authorityId,
        authorityName: authorityDetails.name.trim(),
        shortCode: authorityDetails.shortCode.trim(),
        description: authorityDetails.description.trim(),
        sector: authorityDetails.sector.trim(),
        website: authorityDetails.website.trim(),
        countryId: selectCountry.pK_WorldCountryID,
        address: authorityDetails.address.trim(),
        contactPersonName: authorityDetails.contactPersonName.trim(),
        email: authorityDetails.email.trim(),
        phone: `${authorityDetails.phoneCode}_${authorityDetails.phone.trim()}`,
        statusId: authorityDetails.status === "Active" ? 1 : 2,
        isStatusChangedTo:
          GetAuthorityByAuthorityId?.authority?.status ===
          authorityDetails.status
            ? 0
            : authorityDetails.status === "Active"
            ? 1
            : 2,
      };
      console.log(Data, "Update authority");

      dispatch(
        UpdateAuthorityAPI(
          navigate,
          Data,
          t,
          setAddEditViewAuthoriyModal,
          searchPayload,
          setSearchPayload
        )
      );
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

  const phoneRegex = /^[0-9+\-() ]{0,20}$/;

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    console.log("handleValueChange", name, value);
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Authority Name is required";
        }
        break;

      case "shortCode":
        if (!value.trim()) {
          error = "Short Code is required";
        }
        break;

      case "website":
        if (value && !urlRegex.test(value)) {
          error = "Invalid website URL";
        }
        break;

      case "email":
        if (value && !emailRegex.test(value)) {
          error = "Invalid email format";
        }
        break;

      case "phone":
        if (!phoneRegex.test(value)) {
          return; // block invalid characters
        }
        break;

      default:
        break;
    }

    setAuthorityDetails((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    // EMAIL validation
    if (name === "email" && value) {
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Invalid email format",
        }));
      }
    }

    // WEBSITE validation
    if (name === "website" && value) {
      if (!urlRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          website: "Invalid website URL",
        }));
      }
    }

    // AUTHORITY NAME uniqueness (API placeholder)
    if (name === "authorityName" && value) {
      // call API here
      // checkAuthorityNameUnique(value)
    }

    // SHORT CODE uniqueness (API placeholder)
    if (name === "shortCode" && value) {
      // call API here
      // checkShortCodeUnique(value)
    }
  };

  return (
    <>
      <Modal
        show={addEditViewAuthoriyModal}
        setShow={setAddEditViewAuthoriyModal}
        modalFooterClassName={styles["addEditViewAuthorityModal_Footer"]}
        modalHeaderClassName={
          addViewAuthorityDetails
            ? styles["addEditViewAuthorityModal_Header"]
            : "d-none"
        }
        modalBodyClassName={
          addViewAuthorityDetails && styles["addEditViewAuthorityModal_Body"]
        }
        modalTitleClassName={styles["AuthortyModalTitle"]}
        contentClassName={styles["addEditViewAuthorityModal_Content"]}
        size={addViewAuthorityDetails && "xl"}
        onHide={() => {
          setCloseConfirmationModal(true);
          setAddViewAuthorityDetails(false);
        }}
        ModalTitle={
          !addViewAuthorityDetails
            ? null
            : authorityViewState === 1
            ? t("Add-authority")
            : authorityViewState === 2
            ? t("Edit-authority")
            : t("View-authority")
        }
        closeButton={true}
        ModalBody={
          <>
            <section>
              {addViewAuthorityDetails ? (
                <>
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <TextField
                        change={handleValueChange}
                        name="name"
                        maxLength={100}
                        placeholder={t("Authority-name")}
                        applyClass={
                          authorityViewState === 3
                            ? "viewField_Name"
                            : "AddEditAuthorityInputField"
                        }
                        value={authorityDetails.name}
                        label={
                          <>
                            {t("Authority-name")}
                            <span className={styles["sterick"]}>
                              {authorityViewState !== 3 ? " *" : ""}
                            </span>
                          </>
                        }
                        labelclass={styles["labelStyle"]}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}>
                      <TextField
                        maxLength={10}
                        change={handleValueChange}
                        name="shortCode"
                        placeholder={t("Short-code")}
                        applyClass={
                          authorityViewState === 3
                            ? "viewField_Name"
                            : "AddEditAuthorityInputField"
                        }
                        value={authorityDetails.shortCode}
                        label={
                          <>
                            {t("Short-code")}
                            <span className={styles["sterick"]}>
                              {authorityViewState !== 3 ? " *" : ""}
                            </span>
                          </>
                        }
                        labelclass={styles["labelStyle"]}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={12} md={12} lg={12}>
                      <TextArea
                        labelClassName={styles["labelStyle"]}
                        placeholder={t("Description")}
                        onChange={handleValueChange}
                        name="description"
                        applyClass={
                          authorityViewState === 3
                            ? "viewField"
                            : "AddEditAuthorityInputField_textArea"
                        }
                        value={authorityDetails.description}
                        label={t("Description")}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={12} md={4} lg={4}>
                      <TextField
                        placeholder={t("Sector")}
                        label={t("Sector")}
                        change={handleValueChange}
                        name="sector"
                        labelclass={styles["labelStyle"]}
                        applyClass={
                          authorityViewState === 3
                            ? "viewField"
                            : "AddEditAuthorityInputField"
                        }
                        value={authorityDetails.sector}
                      />
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <TextField
                        placeholder={t("Website")}
                        label={t("Website")}
                        change={handleValueChange}
                        onBlur={handleBlur}
                        name="website"
                        applyClass={
                          authorityViewState === 3
                            ? "viewField"
                            : "AddEditAuthorityInputField"
                        }
                        value={authorityDetails.website}
                        labelclass={styles["labelStyle"]}
                      />

                      <p
                        className={
                          errors && errors.website
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {errors.website}
                      </p>
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <div
                        className={`${styles["labelStyle"]} ${styles["Select_country_Authoriy_label"]}`}
                      >
                        {t("Country")}
                        <span className={styles["sterick"]}>
                          {authorityViewState !== 3 ? " *" : ""}
                        </span>
                      </div>
                      <div className={styles["Select_country_Authoriy_div"]}>
                        {authorityViewState === 3 ? (
                          <span>{selectCountry?.label}</span>
                        ) : (
                          <Select
                            isSearchable={true}
                            options={countryNames}
                            labelInValue={t("Country")}
                            onChange={(event) => setSelectCountry(event)}
                            value={selectCountry}
                            placeholder={t("Please-select-country")}
                            classNamePrefix="Select_country_Authoriy"
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={12} md={12} lg={12}>
                      <TextField
                        placeholder={t("Address")}
                        label={t("Address")}
                        change={handleValueChange}
                        name="address"
                        applyClass={
                          authorityViewState === 3
                            ? "viewField"
                            : "AddEditAuthorityInputField"
                        }
                        value={authorityDetails.address}
                        labelclass={styles["labelStyle"]}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={12} md={4} lg={4}>
                      <TextField
                        placeholder={t("Contact-person-name")}
                        label={t("Contact-person-name")}
                        change={handleValueChange}
                        name="contactPersonName"
                        applyClass={
                          authorityViewState === 3
                            ? "viewField"
                            : "AddEditAuthorityInputField"
                        }
                        value={authorityDetails.contactPersonName}
                        labelclass={styles["labelStyle"]}
                      />
                    </Col>
                    <Col sm={12} md={4} lg={4}>
                      <TextField
                        placeholder={t("Email")}
                        label={t("Email")}
                        change={handleValueChange}
                        onBlur={handleBlur}
                        name="email"
                        applyClass={
                          authorityViewState === 3
                            ? "viewField"
                            : "AddEditAuthorityInputField"
                        }
                        value={authorityDetails.email}
                        labelclass={styles["labelStyle"]}
                      />

                      <p
                        className={
                          errors && errors.email
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {errors.email}
                      </p>
                    </Col>

                    <Col lg={4} md={4} sm={12}>
                      <div
                        className={`${styles["labelStyle"]} ${styles["Select_Phone_Authoriy_label"]}`}
                      >
                        {t("Phone")}
                      </div>

                      <Row>
                        {authorityViewState !== 3 && (
                          <Col sm={4} md={4} lg={4} className=" pe-0">
                            <ReactFlagsSelect
                              fullWidth={false}
                              selected={selected}
                              onSelect={handleSelect}
                              searchable={true}
                              placeholder={"Select Co...."}
                              customLabels={countryNameforPhoneNumber}
                              className={styles["dropdown-countrylist"]}
                            />
                          </Col>
                        )}

                        <Col sm={8} md={8} lg={8} className=" me-0 pe-0">
                          {authorityViewState === 3 && (
                            <span className={styles["contactNumberView"]}>
                              {authorityDetails.phoneCode}
                              {authorityDetails.phone}
                            </span>
                          )}
                          {authorityViewState !== 3 && (
                            <TextField
                              placeholder={t("Phone")}
                              change={handleValueChange}
                              name="phone"
                              applyClass={
                                authorityViewState === 3
                                  ? "viewField"
                                  : "AddEditAuthorityInputField2"
                              }
                              value={authorityDetails.phone}
                              labelclass={"d-none"}
                            />
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {authorityViewState === 2 ? (
                    <Row className="mt-2">
                      <Col sm={12} md={12} lg={12}>
                        <span className={styles["labelStyleActive"]}>
                          {t("Active")}
                        </span>
                        <CustomSwitch
                          checkedValue={authorityDetails.status === "Active"}
                          onChange={handleChangeSwitchValue}
                        />
                      </Col>
                    </Row>
                  ) : authorityViewState === 3 ? (
                    <Row className="mt-2">
                      <Col sm={12} md={12} lg={12}>
                        <div className={styles["labelStyleActive"]}>
                          {t("Active")}
                        </div>
                        {authorityDetails.status === true ? (
                          <span className={styles["activeAuthorityStyle"]}>
                            Active
                          </span>
                        ) : (
                          <span className={styles["inactiveAuthorityStyle"]}>
                            InActive
                          </span>
                        )}
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="text-center"
                    >
                      <div className={styles["ConfirmationHeading"]}>
                        {t(
                          "All your changes will be lost. Are you sure you want to discard them?"
                        )}
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </section>
          </>
        }
        ModalFooter={
          <>
            {addViewAuthorityDetails ? (
              <>
                {" "}
                <Row className="mt-4">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className="d-flex justify-content-end gap-2 align-items-center"
                  >
                    {authorityViewState === 3 && (
                      <Button
                        text={t("Edit")}
                        className={styles["CancelButtonStyle"]}
                        onClick={() => setAuthorityViewState(2)}
                      />
                    )}

                    <Button
                      text={t("Cancel")}
                      className={styles["CancelButtonStyle"]}
                      onClick={handleCancelButton}
                    />
                    {authorityViewState === 1 && (
                      <Button
                        text={t("Add")}
                        className={styles["AddButtonStyles"]}
                        onClick={handleAddAuthority}
                        disableBtn={!isAllValid}
                      />
                    )}
                    {authorityViewState === 2 && (
                      <Button
                        text={t("Update")}
                        className={styles["AddButtonStyles"]}
                        disableBtn={!isAllValid}
                        onClick={handleUpdateAuthority}
                      />
                    )}
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center gap-2"
                  >
                    <Button
                      text={t("Yes")}
                      className={styles["AddButtonStyles"]}
                      onClick={handleConfirmationYesButton}
                    />
                    <Button
                      text={t("No")}
                      onClick={handleConfirmationNoButton}
                      className={styles["CancelButtonStyle"]}
                    />
                  </Col>
                </Row>
              </>
            )}
          </>
        }
      />
    </>
  );
};

export default AddEditViewAuthorityModal;
