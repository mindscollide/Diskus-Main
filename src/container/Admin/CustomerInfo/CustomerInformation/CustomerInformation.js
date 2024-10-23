import React, { useState, useRef, useEffect } from "react";
import "./CustomerInformation.module.css";
import "./../../../../i18n";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import ReactFlagsSelect from "react-flags-select";
import {
  countryName,
  countryNameforPhoneNumber,
} from "../../AllUsers/AddUser/CountryJson";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Modal,
  Loader,
  Notification,
} from "../../../../components/elements";
import styles from "./CustomerInformation.module.css";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import { useDispatch, useSelector } from "react-redux";
import {
  customerInfoOrganizationDetails,
  updateCustomerOrganizationProfileDetail,
} from "../../../../store/actions/Admin_Customer_Information";
import { cleareMessage } from "../../../../store/actions/Admin_AddUser";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const CustomerInformation = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { countryNamesReducer, adminReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  const [countryNames, setCountryNames] = useState([]);
  const Name = useRef(null);
  const CountryDropdowns = useRef(null);
  const Address1 = useRef(null);
  const Address2 = useRef(null);
  const State = useRef(null);
  const City = useRef(null);
  const ZipCode = useRef(null);
  const ContactName = useRef(null);
  const ContactEmail = useRef(null);
  const Number = useRef(null);
  const ReferrenceNumber = useRef(null);

  const [isUpdateButton, setIsUpdateButton] = useState(false);
  const [customerSection, setCustomerSection] = useState({
    OrganizationName: "",
    FK_WorldCountryID: "",
    Address1: "",
    Address2: "",
    State: "",
    City: "",
    ZipCode: "",
    ContactName: "",
    ContactEmail: "",
    Number: "",
    ReferrenceNumber: "",
    FK_CCID: 0,
    CountryID: 0,
    fK_NumberWorldCountryID: 0,
  });

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedNonEditCountry, setSelectedNonEditCountry] = useState("");

  // For enables CustomerInfo Edit Text
  const [countrySelectEnable, setCountrySelectEnable] = useState(true);
  const [addressEnable, setAddressEnable] = useState(true);
  const [addressTwoEnable, setAddressTwoEnable] = useState(true);
  const [stateEnable, setStateEnable] = useState(true);
  const [cityEnable, setCityEnable] = useState(true);
  const [postalEnable, setPostalEnable] = useState(true);
  const [contactNameEnable, setContactNameEnable] = useState(true);
  const [numberEnable, setNumberEnable] = useState(true);
  const [select, setSelect] = useState("");
  const [selectCountryFullName, setSelectCountryFullName] = useState("");
  const [isFlagEnable, setIsFlagEnable] = useState(true);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // for edit countryname field
  const countrySelectHandler = () => {
    setCountrySelectEnable(false);
    CountryDropdowns.current.focus();
  };

  // for edit Address field
  const addressHandler = () => {
    setAddressEnable(false);
    Address1.current.focus();
  };

  // for edit Address field
  const addressTwoHandler = () => {
    setAddressTwoEnable(false);
    Address2.current.focus();
  };

  // for edit state field
  const stateHandler = () => {
    setStateEnable(false);
    State.current.focus();
  };

  // for edit city field
  const cityHandler = () => {
    setCityEnable(false);
    City.current.focus();
  };

  // for edit postal field
  const postalHandler = () => {
    setPostalEnable(false);
    ZipCode.current.focus();
  };

  // for edit contactName field
  const contactHandler = () => {
    setContactNameEnable(false);
    ContactName.current.focus();
  };

  // for edit contactName field
  const numberHandler = () => {
    setNumberEnable(false);
    Number.current.focus();
  };

  const handleSelect = (country) => {
    setSelected(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary == country;
    });

    setCustomerSection({
      ...customerSection,
      fK_NumberWorldCountryID: a.id,
    });
  };

  const customerInfoHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Name" && value !== "") {
      setCustomerSection({
        ...customerSection,
        OrganizationName: "",
      });
    } else if (name === "Name" && value === "") {
      setCustomerSection({
        ...customerSection,
        OrganizationName: "",
      });
    }

    if (name === "Address1" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z0-9 ]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          Address1: valueCheck.trimStart(),
        });
      }
    } else if (name === "Address1" && value === "") {
      setCustomerSection({
        ...customerSection,
        Address1: "",
      });
    }

    if (name === "Address2" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z0-9 ]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          Address2: valueCheck.trimStart(),
        });
      }
    } else if (name === "Address2" && value === "") {
      setCustomerSection({
        ...customerSection,
        Address2: "",
      });
    }

    if (name === "State" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          State: valueCheck.trimStart(),
        });
      }
    } else if (name === "State" && value === "") {
      setCustomerSection({
        ...customerSection,
        State: "",
      });
    }

    if (name === "City" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          City: valueCheck.trimStart(),
        });
      }
    } else if (name === "City" && value === "") {
      setCustomerSection({
        ...customerSection,
        City: "",
      });
    }

    if (name === "ZipCode" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          ZipCode: valueCheck.trimStart(),
        });
      }
    } else if (name === "ZipCode" && value === "") {
      setCustomerSection({
        ...customerSection,
        ZipCode: "",
      });
    }

    if (name === "ContactName" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");

      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          ContactName: valueCheck.trimStart(),
        });
      }
    } else if (name === "ContactName" && value === "") {
      setCustomerSection({
        ...customerSection,
        ContactName: "",
      });
    }

    if (name === "Number" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setCustomerSection({
          ...customerSection,
          Number: valueCheck,
        });
      }
    } else if (name === "Number" && value === "") {
      setCustomerSection({
        ...customerSection,
        Number: "",
      });
    }
  };

  //for enter key handler
  const handleKeyEnter = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  //For cancel button handler
  const cancelHandler = () => {
    setIsUpdateButton(false);
  };

  // for revert button
  const handleRevertBtn = () => {
    setCountrySelectEnable(true);
    setAddressEnable(true);
    setAddressTwoEnable(true);
    setStateEnable(true);
    setCityEnable(true);
    setPostalEnable(true);
    setContactNameEnable(true);
    setNumberEnable(true);
    setIsFlagEnable(true);

    if (
      adminReducer.CustomerInformationData !== null &&
      adminReducer.CustomerInformationData !== undefined &&
      Object.keys(adminReducer.CustomerInformationData).length > 0 &&
      countryNamesReducer.CountryNamesData !== null &&
      Object.keys(countryNamesReducer.CountryNamesData).length > 0 &&
      countryNamesReducer.CountryNamesData !== undefined
    ) {
      setCountryNames(countryNamesReducer.CountryNamesData);
      let customerdata = adminReducer.CustomerInformationData;
      let countryNamesArray = countryNamesReducer.CountryNamesData;

      let Data = {
        OrganizationName: customerdata.organization.organizationName,
        FK_WorldCountryID: customerdata.organization.fK_WorldCountryID,
        Address1: customerdata.organization.organizationAddress1,
        Address2: customerdata.organization.organizationAddress2,
        State: customerdata.organization.stateProvince,
        City: customerdata.organization.city,
        ZipCode: customerdata.organization.postalCode,
        ContactName: customerdata.organization.contactPersonName,
        ContactEmail: customerdata.organization.contactPersonEmail,
        Number: customerdata.organization.contactPersonNumber,
        ReferrenceNumber: customerdata.organization.customerReferenceNumber,
        fK_NumberWorldCountryID:
          customerdata.organization.numberWorldCountry.fK_NumberWorldCountryID,
      };
      let countryNamesCode = Object.values(countryNamesArray).find((obj) => {
        return (
          obj.pK_WorldCountryID == customerdata.organization.fK_WorldCountryID
        );
      });

      setSelectCountryFullName(countryNamesCode.countryName);
      setSelect(countryNamesCode.shortCode);

      let a = Object.values(countryNameforPhoneNumber).find((obj) => {
        return (
          obj.id ==
          customerdata.organization.numberWorldCountry.fK_NumberWorldCountryID
        );
      });

      setSelected(a.primary);
      setSelectedCountry(a.secondary);
      if (a != undefined) {
        setSelectedNonEditCountry(a.secondary);
      } else {
        setSelectedNonEditCountry("US");
      }
      setCustomerSection(Data);
    }
  };

  // for update Customer information
  const updateOrganizationLevelSettings = () => {
    setIsUpdateButton(false);
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    let customerInformation = {
      OrganizationName: customerSection.OrganizationName,
      FK_WorldCountryID: parseInt(customerSection.FK_WorldCountryID),
      ContactPersonName: customerSection.ContactName,
      ContactPersonEmail: customerSection.ContactEmail,
      ContactPersonNumber: customerSection.Number,
      OrganizationAddress1: customerSection.Address1,
      OrganizationAddress2: customerSection.Address2,
      City: customerSection.City,
      StateProvince: customerSection.State,
      PostalCode: customerSection.ZipCode,
      OrganizationID: OrganizationID,
      fK_NumberWorldCountryID: customerSection.fK_NumberWorldCountryID,
    };

    dispatch(
      updateCustomerOrganizationProfileDetail(navigate, customerInformation, t)
    );
    setCountrySelectEnable(true);
    setAddressEnable(true);
    setAddressTwoEnable(true);
    setStateEnable(true);
    setCityEnable(true);
    setPostalEnable(true);
    setContactNameEnable(true);
    setNumberEnable(true);
    setIsFlagEnable(true);
    if (
      adminReducer.CustomerInformationData !== null &&
      adminReducer.CustomerInformationData !== undefined
    ) {
      let customerdata = adminReducer.CustomerInformationData;
      let a = Object.values(countryNameforPhoneNumber).find((obj) => {
        return (
          obj.id ==
          customerdata.organization.numberWorldCountry.fK_NumberWorldCountryID
        );
      });
      if (a != undefined) {
        setSelectedNonEditCountry(a.secondary);
      } else {
        setSelectedNonEditCountry("+1");
      }
      setCustomerSection({
        ...customerSection,
        FK_WorldCountryID: customerdata.organization.fK_WorldCountryID,
        Address1: customerdata.organization.organizationAddress1,
        Address2: customerdata.organization.organizationAddress2,
        State: customerdata.organization.stateProvince,
        City: customerdata.organization.city,
        ZipCode: customerdata.organization.postalCode,
        ContactName: customerdata.organization.contactPersonName,
        Number: customerdata.organization.contactPersonNumber,
        OrganizationName: customerdata.organization.organizationName,
        ContactEmail: customerdata.organization.contactPersonEmail,
        ReferrenceNumber: "",
      });
    }
  };

  const confirmationUpdateHandler = async () => {
    setIsUpdateButton(true);
  };

  const countryNameChangeHandler = (value) => {
    setSelect(value);
    let a;
    try {
      a = Object.values(countryNames).find((obj) => {
        return obj.shortCode == value;
      });
    } catch {}

    setCustomerSection({
      ...customerSection,
      ["FK_WorldCountryID"]: parseInt(a.pK_WorldCountryID),
    });
  };
  const callAPI = async () => {
    await dispatch(getCountryNamesAction(navigate, t));
    dispatch(customerInfoOrganizationDetails(navigate, t));
  };
  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    if (
      adminReducer.CustomerInformationData !== null &&
      adminReducer.CustomerInformationData !== undefined &&
      Object.keys(adminReducer.CustomerInformationData).length > 0 &&
      countryNamesReducer.CountryNamesData !== null &&
      Object.keys(countryNamesReducer.CountryNamesData).length > 0 &&
      countryNamesReducer.CountryNamesData !== undefined
    ) {
      setCountryNames(countryNamesReducer.CountryNamesData);
      let customerdata = adminReducer.CustomerInformationData;
      let countryNamesArray = countryNamesReducer.CountryNamesData;

      let Data = {
        OrganizationName: customerdata.organization.organizationName,
        FK_WorldCountryID: customerdata.organization.fK_WorldCountryID,
        Address1: customerdata.organization.organizationAddress1,
        Address2: customerdata.organization.organizationAddress2,
        State: customerdata.organization.stateProvince,
        City: customerdata.organization.city,
        ZipCode: customerdata.organization.postalCode,
        ContactName: customerdata.organization.contactPersonName,
        ContactEmail: customerdata.organization.contactPersonEmail,
        Number: customerdata.organization.contactPersonNumber,
        ReferrenceNumber: customerdata.organization.customerReferenceNumber,
        fK_NumberWorldCountryID:
          customerdata.organization.numberWorldCountry.fK_NumberWorldCountryID,
      };
      let countryNamesCode = Object.values(countryNamesArray).find((obj) => {
        return (
          obj.pK_WorldCountryID == customerdata.organization.fK_WorldCountryID
        );
      });

      setSelectCountryFullName(countryNamesCode.countryName);
      setSelect(countryNamesCode.shortCode);

      let a = Object.values(countryNameforPhoneNumber).find((obj) => {
        return (
          obj.id ==
          customerdata.organization.numberWorldCountry.fK_NumberWorldCountryID
        );
      });

      setSelected(a.primary);
      setSelectedCountry(a.secondary);
      if (a != undefined) {
        setSelectedNonEditCountry(a.secondary);
      } else {
        setSelectedNonEditCountry("US");
      }
      setCustomerSection(Data);
    }
  }, [
    adminReducer.CustomerInformationData,
    countryNamesReducer.CountryNamesData,
  ]);

  useEffect(() => {
    if (adminReducer.UpdateCustomerInformationResponseMessage !== "") {
      showMessage(
        adminReducer.UpdateCustomerInformationResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    }
  }, [adminReducer.UpdateCustomerInformationResponseMessage]);

  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col lg={12} md={12} sm={12}>
            <label className={styles["customerheading"]}>
              {t("Customer-information")}
            </label>
          </Col>
        </Row>

        <Col
          md={8}
          lg={8}
          sm={12}
          xs={12}
          className={styles["customerINformation"]}
        >
          <div className={styles["Customer-Information-Scroller-container"]}>
            <Col md={10} lg={10} sm={12}>
              {/* Company name Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Company")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3 mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        className={styles["formcontrol-Name-field"]}
                        ref={Name}
                        onKeyDown={(event) => handleKeyEnter(event, Address1)}
                        placeholder={t("Company-name")}
                        disabled={true}
                        applyClass="form-control2"
                        change={customerInfoHandler}
                        name="Name"
                        value={customerSection.OrganizationName}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}></Col>
                  </Row>
                </Col>
              </Row>
              {/* Country Name Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Country")}
                  </label>
                </Col>

                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col
                      sm={12}
                      md={10}
                      lg={10}
                      className={styles["react-Country-Dropdown"]}
                    >
                      {countrySelectEnable ? (
                        <span className={styles["react-Country-Dropdown-span"]}>
                          {selectCountryFullName}
                        </span>
                      ) : (
                        <ReactFlagsSelect
                          selected={select}
                          onSelect={countryNameChangeHandler}
                          searchable={true}
                          value={select}
                        />
                      )}
                    </Col>

                    <Col sm={12} md={2} lg={2}>
                      <label className={styles["editLink"]}>
                        <u onClick={countrySelectHandler}>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Address 1 Name field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Address-1")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        disabled={addressEnable ? true : false}
                        className={
                          addressEnable
                            ? `${styles["formcontrol-Addressone-field_disabled"]}`
                            : `${styles["formcontrol-Addressone-field"]}`
                        }
                        ref={Address1}
                        onKeyDown={(event) => handleKeyEnter(event, Address2)}
                        maxLength={100}
                        name="Address1"
                        placeholder={t("Address-1")}
                        onChange={customerInfoHandler}
                        value={customerSection.Address1 || ""}
                      />
                      <span className={styles["address_bottom_line"]}>
                        {!addressEnable
                          ? `${t("maximum-characters-100-alpha-numeric-field")}`
                          : null}
                      </span>
                      {/* )} */}
                    </Col>
                    <Col sm={12} md={2} lg={2}>
                      <label
                        className={styles["editLink"]}
                        onClick={addressHandler}
                      >
                        <u>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Address 2 Name field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Address-2")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        disabled={addressTwoEnable ? true : false}
                        className={
                          addressTwoEnable
                            ? `${styles["formcontrol-Addresstwo-field_disabled"]}`
                            : `${styles["formcontrol-Addresstwo-field"]}`
                        }
                        ref={Address2}
                        onKeyDown={(event) => handleKeyEnter(event, State)}
                        maxLength={100}
                        placeholder={t("Address-2")}
                        name="Address2"
                        onChange={customerInfoHandler}
                        value={customerSection.Address2 || ""}
                      />
                      <span className={styles["address_bottom_line"]}>
                        {!addressTwoEnable
                          ? `${t("maximum-characters-100-alpha-numeric-field")}`
                          : ""}
                      </span>
                    </Col>
                    <Col sm={12} md={2} lg={2}>
                      <label className={styles["editLink"]}>
                        <u onClick={addressTwoHandler}>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* State Name field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>{t("State")}</label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        disabled={stateEnable ? true : false}
                        className={
                          stateEnable
                            ? `${styles["formcontrol-State-field_disabled"]}`
                            : `${styles["formcontrol-State-field"]}`
                        }
                        ref={State}
                        onKeyDown={(event) => handleKeyEnter(event, City)}
                        maxLength={70}
                        placeholder={t("State")}
                        onChange={customerInfoHandler}
                        value={customerSection.State || ""}
                        name="State"
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}>
                      <label className={styles["editLink"]}>
                        <u onClick={stateHandler}>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* City Name Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>{t("City")}</label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        disabled={cityEnable ? true : false}
                        className={
                          cityEnable
                            ? `${styles["formcontrol-City-field_disabled"]}`
                            : `${styles["formcontrol-City-field"]}`
                        }
                        ref={City}
                        onKeyDown={(event) => handleKeyEnter(event, ZipCode)}
                        placeholder={t("City")}
                        maxLength={70}
                        name="City"
                        onChange={customerInfoHandler}
                        value={customerSection.City || ""}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}>
                      <label className={styles["editLink"]}>
                        <u onClick={cityHandler}>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Postal Code */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Postal-zipcode")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        disabled={postalEnable ? true : false}
                        className={
                          postalEnable
                            ? `${styles["formcontrol-ZipCode-field_disabled"]}`
                            : `${styles["formcontrol-ZipCode-field"]}`
                        }
                        ref={ZipCode}
                        onKeyDown={(event) =>
                          handleKeyEnter(event, ContactName)
                        }
                        maxLength={10}
                        placeholder={t("Postal-zipcode")}
                        name="ZipCode"
                        onChange={customerInfoHandler}
                        value={customerSection.ZipCode || ""}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}>
                      <label className={styles["editLink"]}>
                        <u onClick={postalHandler}>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Contact Name Field*/}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Contact-name")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        disabled={contactNameEnable ? true : false}
                        className={
                          contactNameEnable
                            ? `${styles["formcontrol-ContactName-field_disabled"]}`
                            : `${styles["formcontrol-ContactName-field"]}`
                        }
                        ref={ContactName}
                        onKeyDown={(event) => handleKeyEnter(event, Number)}
                        maxLength={100}
                        placeholder={t("Contact-name")}
                        name="ContactName"
                        onChange={customerInfoHandler}
                        value={customerSection.ContactName || ""}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}>
                      <label className={styles["editLink"]}>
                        <u onClick={contactHandler}>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Contact Email Field */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Contact-email")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-2">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        className={styles["formcontrol-Address1-field"]}
                        label={"Contact"}
                        disabled={true}
                        ref={ContactEmail}
                        name={"ContactEmail"}
                        value={customerSection.ContactEmail}
                        onKeyDown={(event) => handleKeyEnter(event, Number)}
                        maxLength={160}
                        placeholder={t("Contact-email")}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}></Col>
                  </Row>
                </Col>
              </Row>
              {/* Number  */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start mb-2"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Number")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-2  mb-2">
                  <Row>
                    {numberEnable ? null : (
                      <Col
                        sm={12}
                        md={3}
                        lg={3}
                        className={styles["react-flag-Info"]}
                      >
                        <ReactFlagsSelect
                          fullWidth={false}
                          selected={selected}
                          onSelect={handleSelect}
                          searchable={true}
                          placeholder={"Select Co...."}
                          customLabels={countryName}
                        />
                      </Col>
                    )}
                    {numberEnable ? (
                      <Col sm={12} md={10} lg={10} className="mt-2">
                        <span className={styles["span-on-number"]}>
                          {selectedNonEditCountry +
                            " " +
                            customerSection.Number}
                        </span>
                      </Col>
                    ) : (
                      <Col sm={12} md={7} lg={7} className="mt-1 mb-0">
                        <Form.Control
                          ref={Number}
                          className={`${styles["formcontrol-Number-field"]}`}
                          name="Number"
                          maxLength={15}
                          minLength={4}
                          onChange={customerInfoHandler}
                          value={customerSection.Number || ""}
                        />
                      </Col>
                    )}

                    <Col sm={12} md={2} lg={2}>
                      <label
                        className={styles["edit-Number-Link"]}
                        onClick={numberHandler}
                      >
                        <u>{t("Edit")}</u>
                      </label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Reference Number */}
              <Row className={styles["lineOnBottom"]}>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-start"
                >
                  <label className={styles["CompanyTitle"]}>
                    {t("Referrence-number")}
                  </label>
                </Col>
                <Col lg={7} md={7} sm={12} xs={12} className="mt-3  mb-4">
                  <Row>
                    <Col sm={12} md={10} lg={10}>
                      <Form.Control
                        className={styles["formcontrol-Address1-field"]}
                        ref={ReferrenceNumber}
                        onKeyDown={(event) => handleKeyEnter(event, Name)}
                        placeholder={t("Referrence-number")}
                        applyClass="form-control2"
                        disabled={true}
                        value={customerSection.ReferrenceNumber || ""}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}></Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </div>
        </Col>
        <Row>
          <Col sm={12} md={7} lg={7}>
            <Row className="my-4">
              <Col
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="d-flex justify-content-start"
              >
                <Button
                  text={t("Revert")}
                  className={styles["btnRevert"]}
                  onClick={handleRevertBtn}
                />
              </Col>
              <Col
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Update")}
                  className={styles["btnUpdate"]}
                  onClick={confirmationUpdateHandler}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          show={isUpdateButton}
          setShow={setIsUpdateButton}
          ButtonTitle={ModalTitle}
          modalHeaderClassName={styles["modalHeaderUpdate"]}
          modalBodyClassName={styles["modalUpdatemodal"]}
          modalFooterClassName={styles["customerInfoModal"]}
          centered
          size={isUpdateButton === "sm"}
          ModalBody={
            <>
              {isUpdateButton ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["modalUpdateText"]}>
                        {t("Do-you-want-to-proceed-with-the-update")}
                      </p>
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isUpdateButton ? (
                <>
                  <Row className={styles["modalUpdateted-2"]}>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className={"text-end" + " " + currentLanguage}
                    >
                      <Button
                        onClick={cancelHandler}
                        className={styles["modalCancelBtn"]}
                        text={t("Cancel")}
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className={"text-start" + " " + currentLanguage}
                    >
                      <Button
                        className={styles["modalProceedBtn"]}
                        text={t("Proceed")}
                        onClick={updateOrganizationLevelSettings}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
        />
      </Container>
      {adminReducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default CustomerInformation;
