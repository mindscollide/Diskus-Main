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
// import { deleteOrganizationUserAPI } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { showAddEditViewAuthorityModal } from "../../../../../store/actions/ManageAuthoriyAction";
import CustomSwitch from "../../../../../components/elements/switch_button/Switch";
import Select from "react-select";
import { useAuthorityContext } from "../../../../../context/AuthorityContext";
import { getCountryNamesAction } from "../../../../../store/actions/GetCountryNames";
import { countryNameforPhoneNumber } from "../../../AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";
const AddEditViewAuthorityModal = ({ modalName }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { authorityViewState, setAuthorityViewState } = useAuthorityContext();

  const [countryNames, setCountryNames] = useState([]);
  const [selectCountry, setSelectCountry] = useState(null);
  const [selected, setSelected] = useState("US");

  console.log(selectCountry, "selectCountryselectCountry");
  // TEMPORARY DATA
  const [authorityDetails, setAuthorityDetails] = useState({
    name: "Pakistan Stock Exchange",
    shortCode: "PSX",
    description:
      "Pakistan Stock Exchange (PSX) is the primary securities exchange in Pakistan, providing a transparent platform for trading in stocks, bonds, and other instruments. It operates under the oversight of SECP.",
    sector: "Securities Regulation",
    website: "https://www.psx.com.pk",
    country: "Pakistan",
    address: "Stock Exchange Building, Stock Exchange Road, Karachi, Pakistan",
    contactPersonName: "Hamza Shahzad",
    email: "info@psx.com.pk",
    phone: "+1-111-001-122",
    status: false,
  });

  const navigate = useNavigate();

  //   let userID = localStorage.getItem("userID");

  //   let organizationID = localStorage.getItem("organizationID");
  const countryNamesReducerCountryNamesData = useSelector(
    (state) => state.countryNamesReducer.CountryNamesData
  );

  const addEditViewAuthorityModal = useSelector(
    (state) => state.ManageAuthorityReducer.addEditViewAuthorityModal
  );

  // Initial useEffect
  useEffect(() => {
    dispatch(getCountryNamesAction(navigate, t));

    return () => {
      setSelectCountry(null);
      setCountryNames([]);
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

  const handleSelect = (country) => {
    setSelected(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary === country;
    });
    // setSignUpDetails({
    //   ...signUpDetails,
    //   FK_CCID: a.id,
    //   PhoneNumberCountryID: a.id,
    // });
  };

  const handleCancelButton = () => {
    dispatch(showAddEditViewAuthorityModal(false));
  };

  const handleAddAuthority = () => {
    const Data = {
      name: "Pakistan Stock Exchange",
      shortCode: "PSX",
      description:
        "Pakistan Stock Exchange (PSX) is the primary securities exchange in Pakistan, providing a transparent platform for trading in stocks, bonds, and other instruments. It operates under the oversight of SECP.",
      sector: "Securities Regulation",
      website: "https://www.psx.com.pk",
      country: "Pakistan",
      address:
        "Stock Exchange Building, Stock Exchange Road, Karachi, Pakistan",
      contactPersonName: "Hamza Shahzad",
      email: "info@psx.com.pk",
      phone: "+1-111-001-122",
      // status: false,
    };
    console.log(Data, "add authority");
  };
  const handleUpdateAuthority = () => {
    const Data = {
      name: "Pakistan Stock Exchange",
      shortCode: "PSX",
      description:
        "Pakistan Stock Exchange (PSX) is the primary securities exchange in Pakistan, providing a transparent platform for trading in stocks, bonds, and other instruments. It operates under the oversight of SECP.",
      sector: "Securities Regulation",
      website: "https://www.psx.com.pk",
      country: "Pakistan",
      address:
        "Stock Exchange Building, Stock Exchange Road, Karachi, Pakistan",
      contactPersonName: "Hamza Shahzad",
      email: "info@psx.com.pk",
      phone: "+1-111-001-122",
      // status: false,
    };
    console.log(Data, "add authority");
  };

  return (
    <Modal
      show={addEditViewAuthorityModal}
      setShow={dispatch(showAddEditViewAuthorityModal)}
      modalFooterClassName={styles["addEditViewAuthorityModal_Footer"]}
      modalHeaderClassName={styles["addEditViewAuthorityModal_Header"]}
      modalBodyClassName={styles["addEditViewAuthorityModal_Body"]}
      modalTitleClassName={styles["AuthortyModalTitle"]}
      contentClassName={styles["addEditViewAuthorityModal_Content"]}
      size={"xl"}
      onHide={() => {
        dispatch(showAddEditViewAuthorityModal(false));
      }}
      ModalTitle={
        authorityViewState === 1
          ? t("Add-authority")
          : authorityViewState === 2
          ? t("Edit-authority")
          : t("View-authority")
      }
      closeButton={true}
      ModalBody={
        <>
          <section>
            <Row>
              <Col sm={12} md={10} lg={10}>
                <TextField
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
                  applyClass={
                    authorityViewState === 3
                      ? "viewField"
                      : "AddEditAuthorityInputField"
                  }
                  value={authorityDetails.website}
                  labelclass={styles["labelStyle"]}
                />
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
                    <span>{authorityDetails.country}</span>
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
                  applyClass={
                    authorityViewState === 3
                      ? "viewField"
                      : "AddEditAuthorityInputField"
                  }
                  value={authorityDetails.email}
                  labelclass={styles["labelStyle"]}
                />
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
                    <TextField
                      placeholder={t("Phone")}
                      applyClass={
                        authorityViewState === 3
                          ? "viewField"
                          : "AddEditAuthorityInputField2"
                      }
                      value={authorityDetails.phone}
                      labelclass={"d-none"}
                    />
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
                  <CustomSwitch checkedValue={authorityDetails.status} />
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
          </section>
        </>
      }
      ModalFooter={
        <>
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
                />
              )}
              {authorityViewState === 2 && (
                <Button
                  text={t("Update")}
                  className={styles["AddButtonStyles"]}
                  onClick={handleUpdateAuthority}
                />
              )}
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default AddEditViewAuthorityModal;
