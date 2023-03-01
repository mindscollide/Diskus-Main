import React, { useState, useRef, useEffect } from "react";
import UserProfileSetting from "../../../../src/assets/images/Userprofile-1.png";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
  Loader,
} from "./../../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./UserProfile.module.css";
import Form from "react-bootstrap/Form";
// import { countryName } from "../../AllUsers/AddUser/CountryJson";
import { countryName } from "../../Admin/AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import { style } from "@mui/system";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUserDetails,
  settingClearMessege,
  updateuserprofile,
} from "../../../store/actions/GetUserSetting";
import settingReducer from "../../../store/reducers/Setting_reducer";

const UserProfileModal = ({
  ModalTitle,
  user,
  setUser,
  userProfileModal,
  setUserProfileModal,
  calenderFlag,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // states for UserProfile
  const [userProfileEdit, setUserProfileEdit] = useState({
    Name: "",
    Designation: "",
    Mobile: "",
    CountyCode: 0,
    ProfilePicture: {
      PK_UPPID: 0,
      DisplayProfilePictureName: "",
      OrignalProfilePictureName: "",
    },
  });

  //For Localization
  const { t } = useTranslation();

  // for enable states
  const [nameEnable, setNameEanble] = useState(true);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [designationEnable, setDesignationEnable] = useState(true);
  const [selectedNonEditCountry, setSelectedNonEditCountry] = useState("");
  const [mobileEnable, setMobileEnable] = useState(true);
  const [isFlagEnable, setIsFlagEnable] = useState(false);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [message, setMessege] = useState("");
  const state = useSelector((state) => state);
  const { countryNamesReducer, settingReducer } = state;
  console.log("settingReducer", settingReducer);

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

  const handleSelect = (country) => {
    console.log(country, "country");
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryName).find((obj) => {
      return obj.primary == country;
    });
    console.log("Selected-Values", a, country);
    setUserProfileEdit({
      ...userProfileEdit,
      CountyCode: a.id,
    });
  };

  //For Localization
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  // for edit User Input Fields
  const Name = useRef(null);
  const Designation = useRef(null);
  const Mobile = useRef(null);
  const SelectFlag = useRef(null);

  // for UserProfile edit handler
  const userProfileEditHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Name" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setUserProfileEdit({
          ...userProfileEdit,
          Name: valueCheck.trimStart(),
        });
      }
    } else if (name === "Name" && value === "") {
      setUserProfileEdit({
        ...userProfileEdit,
        Name: "",
      });
    }

    if (name === "Designation" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setUserProfileEdit({
          ...userProfileEdit,
          Designation: valueCheck.trimStart(),
        });
        setMessege("");
      }
    } else if (name === "Designation" && value === "") {
      setUserProfileEdit({
        ...userProfileEdit,
        Designation: "",
      });
      setMessege(t("(Maximum-character-100.-alpha-numeric-field)"));
    }

    if (name === "Mobile" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setUserProfileEdit({
          ...userProfileEdit,
          Mobile: valueCheck.trimStart(),
        });
      }
    } else if (name === "Mobile" && value === "") {
      setUserProfileEdit({
        ...userProfileEdit,
        Mobile: "",
      });
    }
  };

  // Reset Input fields
  const userProfileReset = () => {
    if (
      settingReducer.GetUserDetailsResponse !== null &&
      settingReducer.GetUserDetailsResponse !== undefined
    ) {
      let UserData = settingReducer.GetUserDetailsResponse;

      let data = {
        Name: UserData.name,
        Designation: UserData.designation,
        Mobile: UserData.mobileNumber,
        CountyCode: UserData.countryCode.pK_CCID,
        SelectFlag: "",
        ProfilePicture: {
          PK_UPPID: UserData.profilePicture.pK_UPPID,
          DisplayProfilePictureName:
            UserData.profilePicture.displayProfilePictureName,
          OrignalProfilePictureName:
            UserData.profilePicture.orignalProfilePictureName,
        },
      };

      setMessege("");
      setMobileEnable(true);
      setDesignationEnable(true);
      setNameEanble(true);
      console.log("UserData", UserData);
      setSelected(UserData.organization.countryCode.code);
      setUserProfileEdit(data);
      setSelectedNonEditCountry(a.secondary);
      setSelectedCountry(UserData.organization.countryCode.code);
      let a = Object.values(countryName).find((obj) => {
        return obj.primary == UserData.organization.countryCode.code;
      });
      console.log("Selected-Values", a.secondary);
    }
  };

  // for edit name field
  const nameHandler = () => {
    Name.current.disabled = false;
    Name.current.focus();
    setNameEanble(false);
  };

  //for edit Designation field
  const designationHandler = () => {
    Designation.current.disabled = false;
    Designation.current.focus();
    setDesignationEnable(false);
  };

  //for edit Mobile field
  const mobileHandler = () => {
    // Mobile.current.disabled = false;
    // Mobile.current.focus();
    setMobileEnable(false);
    // setIsFlagEnable(true);
  };

  //for next enter key
  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  useEffect(() => {
    if (
      settingReducer.GetUserDetailsResponse !== null &&
      settingReducer.GetUserDetailsResponse !== undefined
    ) {
      let UserData = settingReducer.GetUserDetailsResponse;
      let data = {
        Name: UserData.name,
        Designation: UserData.designation,
        Mobile: UserData.mobileNumber,
        CountyCode: UserData.countryCode.pK_CCID,
        ProfilePicture: {
          PK_UPPID: UserData.profilePicture.pK_UPPID,
          DisplayProfilePictureName:
            UserData.profilePicture.displayProfilePictureName,
          OrignalProfilePictureName:
            UserData.profilePicture.orignalProfilePictureName,
        },
      };
      console.log("UserData", UserData);

      setUserProfileEdit(data);
      setSelected(UserData.countryCode.code);
      setSelectedCountry(UserData.countryCode.code);
      let a = Object.values(countryName).find((obj) => {
        console.log(obj, "Selected-Values");
        return obj.primary === UserData.countryCode.code;
      });
      console.log("Selected-Values", a);
      setSelectedNonEditCountry(a.secondary);
    }
  }, [settingReducer.GetUserDetailsResponse]);

  useEffect(() => {
    if (currentLanguage != undefined) {
      if (currentLanguage === "en") {
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setLocalValue(arabic_ar);
      }
    }
  }, [currentLanguage]);

  const updateuserprofiledata = () => {
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    let userID = JSON.parse(localStorage.getItem("userID"));
    let userInformation = {
      UserID: userID,
      OrganizationID: OrganizationID,
      Name: userProfileEdit.Name,
      Designation: userProfileEdit.Designation,
      MobileNumber: userProfileEdit.Mobile,
      ProfilePicture: userProfileEdit.ProfilePicture,
      FK_CCID: userProfileEdit.CountyCode,
    };

    dispatch(updateuserprofile(userInformation, t));
  };

  return (
    <>
      <Container>
        <Modal
          show={user}
          onHide={() => setUser(false)}
          setShow={setUser}
          ButtonTitle={ModalTitle}
          modalBodyClassName={styles["Modalsize"]}
          centered
          modalFooterClassName={styles["modal-userprofile-footer"]}
          modalHeaderClassName={styles["modal-header-class"]}
          size={"md"}
          className={styles["userProfileModal"]}
          ModalBody={
            <>
              <Container className={styles["user-container"]}>
                <Row className="mb-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <img
                      src={UserProfileSetting}
                      value={userProfileEdit.ProfilePicture}
                      width={100}
                    />
                  </Col>
                </Row>

                <Row className={styles["User-bottom-line"]}>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <p className={styles["Name-label-User"]}>{t("Name")}</p>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      disabled={nameEnable ? true : false}
                      ref={Name}
                      onKeyDown={(event) => enterKeyHandler(event, Designation)}
                      name="Name"
                      maxLength={200}
                      autocomplete="off"
                      value={userProfileEdit.Name}
                      onChange={userProfileEditHandler}
                      placeholder={t("Enter-name")}
                      applyClass="form-control2"
                      className={
                        nameEnable
                          ? `${styles["text-fields-name-disabled"]}`
                          : `${styles["text-fields-name"]}`
                      }
                    />
                  </Col>

                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <p
                      className={styles["label-Edit-user"]}
                      onClick={nameHandler}
                    >
                      {t("Edit")}
                    </p>
                  </Col>
                </Row>

                <Row className={styles["User-bottom-line2"]}>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <p className={styles["Designation-label-User"]}>
                      {t("Designation")}
                    </p>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      ref={Designation}
                      onKeyDown={(event) => enterKeyHandler(event, Mobile)}
                      name="Designation"
                      value={userProfileEdit.Designation}
                      autocomplete="off"
                      onChange={userProfileEditHandler}
                      disabled={designationEnable ? true : false}
                      maxLength={200}
                      placeholder={t("Enter-designation")}
                      applyClass="form-control2"
                      className={
                        designationEnable
                          ? `${styles["text-fields-designation-disabled"]}`
                          : `${styles["text-fields-designation"]}`
                      }
                    />
                  </Col>

                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <p
                      className={styles["label-Edit-user"]}
                      onClick={designationHandler}
                    >
                      {t("Edit")}
                    </p>
                  </Col>
                  <Row className={styles["ErrorMessege"]}>
                    <Col lg={12} md={12} sm={12} xs={12} className="d-flex">
                      {message}
                    </Col>
                  </Row>
                </Row>

                <Row className="mt-1">
                  <Col lg={4} md={4} sm={12} xs={12} className="mb-5 mt-2">
                    <p className={styles["Mobile-label-User"]}>{t("Mobile")}</p>
                  </Col>

                  {mobileEnable ? null : (
                    <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={12}
                      className={styles["react-User-Profile"]}
                    >
                      <ReactFlagsSelect
                        // disabled={!isFlagEnable}
                        fullWidth={false}
                        selected={selected}
                        onSelect={handleSelect}
                        searchable={true}
                        placeholder={"Select Co...."}
                        customLabels={countryName}
                        className={styles["userProfileFlagSelect"]}
                      />
                    </Col>
                  )}
                  {mobileEnable ? (
                    <Col sm={12} md={6} lg={6} className="mt-2 ">
                      <span className={styles["span-on-number-on-userprofile"]}>
                        {selectedNonEditCountry + " " + userProfileEdit.Mobile}
                      </span>
                    </Col>
                  ) : (
                    <Col lg={4} md={4} sm={12} xs={12} className="mt-1">
                      <Form.Control
                        ref={Mobile}
                        onKeyDown={(event) => enterKeyHandler(event, Name)}
                        name="Mobile"
                        // disabled={mobileEnable ? true : false}
                        value={userProfileEdit.Mobile || ""}
                        autocomplete="off"
                        onChange={userProfileEditHandler}
                        maxLength={10}
                        placeholder={t("Enter-number")}
                        applyClass="form-control2"
                        className={
                          mobileEnable
                            ? `${styles["text-fields-Mobile-disabled"]}`
                            : `${styles["text-fields-Mobile"]}`
                        }
                      />
                    </Col>
                  )}

                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className="d-flex justify-content-end mt-2"
                  >
                    <p
                      className={styles["label-Edit-user-mobile"]}
                      onClick={mobileHandler}
                    >
                      {t("Edit")}
                    </p>
                  </Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mb-4">
                <Col lg={6} md={6} sm={6} xs={12}>
                  <Button
                    text="Reset"
                    onClick={userProfileReset}
                    className={styles["reset-User-btn"]}
                  />
                </Col>

                <Col lg={6} md={6} sm={6} xs={12}>
                  <Button
                    text="Save"
                    onClick={updateuserprofiledata}
                    className={styles["save-User-btn"]}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      {settingReducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default UserProfileModal;
