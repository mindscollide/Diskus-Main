import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Notification } from "./../../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./UserProfile.module.css";
import Form from "react-bootstrap/Form";
import {
  countryName,
  countryNameforPhoneNumber,
} from "../../Admin/AllUsers/AddUser/CountryJson";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateuserprofile } from "../../../store/actions/GetUserSetting";
import AvatarEditorComponent from "../../../components/elements/imageUploader/ImageUploader";
import { showMessage } from "../../../components/elements/snack_bar/utill";

const UserProfileModal = ({ ModalTitle, user, setUser }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  console.log(userProfileEdit.ProfilePicture, "");
  const [nameEnable, setNameEanble] = useState(true);
  const [erorbar, setErrorBar] = useState(false);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [designationEnable, setDesignationEnable] = useState(true);
  const [selectedNonEditCountry, setSelectedNonEditCountry] = useState("");
  const [mobileEnable, setMobileEnable] = useState(true);
  const [message, setMessege] = useState("");
  const state = useSelector((state) => state);
  const { settingReducer } = state;
  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary === country;
    });

    setUserProfileEdit({
      ...userProfileEdit,
      CountyCode: a.id,
    });
  };

  //For Localization
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  // for edit User Input Fields
  const Name = useRef(null);
  const Designation = useRef(null);
  const Mobile = useRef(null);

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
        setMessege(t("(Maximum-character-100.-alpha-numeric-field)"));
      }
    } else if (name === "Designation" && value === "") {
      setUserProfileEdit({
        ...userProfileEdit,
        Designation: "",
      });
      setMessege("");
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
        CountyCode: UserData.numberWorldCountry.fK_NumberWorldCountryID,
        SelectFlag: "",
        ProfilePicture: {
          PK_UPPID: UserData.profilePicture.pK_UPPID,
          DisplayProfilePictureName:
            UserData.profilePicture.displayProfilePictureName,
          OrignalProfilePictureName:
            UserData.profilePicture.orignalProfilePictureName,
        },
      };

      //
      setMessege("");
      setMobileEnable(true);
      setDesignationEnable(true);
      setNameEanble(true);

      setUserProfileEdit(data);
      setSelectedCountry(UserData.numberWorldCountry.fK_NumberWorldCountryID);
      let a = Object.values(countryNameforPhoneNumber).find((obj) => {
        return (
          Number(obj.id) ===
          Number(UserData.numberWorldCountry.fK_NumberWorldCountryID)
        );
      });
      setSelectedNonEditCountry(a.secondary);
      setSelected(a.primary);
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
    setMobileEnable(false);
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
      setMessege("");
      setMobileEnable(true);
      setDesignationEnable(true);
      setNameEanble(true);
      let UserData = settingReducer.GetUserDetailsResponse;
      let data = {
        Name: UserData.name,
        Designation: UserData.designation,
        Mobile: UserData.mobileNumber,
        CountyCode: UserData.numberWorldCountry.fK_NumberWorldCountryID,
        ProfilePicture: {
          PK_UPPID: UserData.profilePicture.pK_UPPID,
          DisplayProfilePictureName:
            UserData.profilePicture.displayProfilePictureName,
          OrignalProfilePictureName:
            UserData.profilePicture.orignalProfilePictureName,
        },
      };

      setUserProfileEdit(data);
      setSelectedCountry(UserData.numberWorldCountry.fK_NumberWorldCountryID);
      let a = Object.values(countryName).find((obj) => {
        return obj.secondary === UserData.numberWorldCountry.code;
      });
      setSelected(a.primary);

      setSelectedNonEditCountry(a.secondary);
    }
  }, [settingReducer.GetUserDetailsResponse]);

  useEffect(() => {
    if (currentLanguage !== undefined) {
      if (currentLanguage === "en") {
      } else if (currentLanguage === "ar") {
      }
    }
  }, [currentLanguage]);

  const updateuserprofiledata = () => {
    if (
      userProfileEdit.Name !== "" &&
      userProfileEdit.Designation !== "" &&
      userProfileEdit.Mobile !== ""
    ) {
      setErrorBar(false);
      let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
      let userID = JSON.parse(localStorage.getItem("userID"));
      if (
        userProfileEdit.Designation !== "" &&
        userProfileEdit.Name !== "" &&
        userProfileEdit.CountyCode !== 0 &&
        userProfileEdit.Mobile !== ""
      ) {
        let userInformation = {
          UserID: userID,
          OrganizationID: OrganizationID,
          Name: userProfileEdit.Name,
          Designation: userProfileEdit.Designation,
          MobileNumber: userProfileEdit.Mobile,
          ProfilePicture: userProfileEdit.ProfilePicture,
          FK_NumberWorldCountryID: userProfileEdit.CountyCode,
        };
        setMessege("");
        setMobileEnable(true);
        setDesignationEnable(true);
        setNameEanble(true);
        dispatch(
          updateuserprofile(
            navigate,
            userInformation,
            t,
            setMobileEnable,
            setDesignationEnable,
            setNameEanble,
            setUser
          )
        );
      }
    } else {
      setErrorBar(true);
      showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
    }
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
                    <AvatarEditorComponent
                      pictureObj={userProfileEdit.ProfilePicture}
                      setUserProfileEdit={setUserProfileEdit}
                    />
                  </Col>
                </Row>

                <Row className={styles["User-bottom-line"]}>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <p className={styles["Name-label-User"]}>{t("Name")}</p>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={12} className="user-Profile">
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

                  <Row>
                    <Col className="d-flex justify-content-center">
                      <p
                        className={
                          erorbar && userProfileEdit.Name === ""
                            ? styles["errorMessage"]
                            : styles["errorMessage_hidden"]
                        }
                      >
                        {t("Profile-name-is-required")}
                      </p>
                    </Col>
                  </Row>
                </Row>

                <Row className={styles["User-bottom-line2"]}>
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <p className={styles["Designation-label-User"]}>
                      {t("Designation")}
                    </p>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={12} className="user-Profile">
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

                <Row>
                  <Col className="d-flex justify-content-center">
                    <p
                      className={
                        erorbar && userProfileEdit.Designation === ""
                          ? styles["errorMessage-Designation-user"]
                          : styles["errorMessage_hidden-Designation-user"]
                      }
                    >
                      {t("Profile-designation-is-required")}
                    </p>
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={4} md={4} sm={12} xs={12} className="mb-0 mt-2">
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
                        fullWidth={false}
                        selected={selected}
                        onSelect={handleSelect}
                        searchable={true}
                        placeholder={"Select Co...."}
                        customLabels={countryNameforPhoneNumber}
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
                    <Col
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      className="user-Profile mt-1"
                    >
                      <Form.Control
                        ref={Mobile}
                        onKeyDown={(event) => enterKeyHandler(event, Name)}
                        name="Mobile"
                        value={userProfileEdit.Mobile || ""}
                        autocomplete="off"
                        onChange={userProfileEditHandler}
                        maxLength={15}
                        minLength={4}
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

                  <Row>
                    <Col className="d-flex justify-content-center">
                      <p
                        className={
                          erorbar && userProfileEdit.Mobile === ""
                            ? styles["errorMessage-Mobile-user"]
                            : styles["errorMessage_hidden-Mobile-user"]
                        }
                      >
                        {t("Mobile-number-is-required")}
                      </p>
                    </Col>
                  </Row>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mb-4 mt-5">
                <Col lg={6} md={6} sm={6} xs={12}>
                  <Button
                    text={t("Reset")}
                    onClick={userProfileReset}
                    className={styles["reset-User-btn"]}
                  />
                </Col>

                <Col lg={6} md={6} sm={6} xs={12}>
                  <Button
                    text={t("Save")}
                    onClick={updateuserprofiledata}
                    className={styles["save-User-btn"]}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default UserProfileModal;
