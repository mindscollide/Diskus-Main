import React, { useEffect, useState } from "react";
import styles from "./CreateAdditionalUsersModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import plusFaddes from "../../../../../assets/images/NewBluePLus.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import { useSelector } from "react-redux";
import { showCreateAddtionalUsersModal } from "../../../../../store/actions/UserMangementModalActions";
import {
  Button,
  Checkbox,
  Modal,
  TextField,
  AddtionalUserCard,
} from "../../../../../components/elements";
import Cookies from "js-cookie";
import { Col, Row } from "react-bootstrap";
import { AddOrganizationsUserApi } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { validateEmailEnglishAndArabicFormat } from "../../../../../commen/functions/validations";
import { getPackageExpiryDetail } from "../../../../../store/actions/GetPackageExpirtyDetails";
const CreateAddtionalUsersModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  let organzataionID = localStorage.getItem("organizationID");

  let OrganizatioName = localStorage.getItem("organizatioName");

  const { UserManagementModals, UserMangementReducer } = useSelector(
    (state) => state
  );

  const UserManagementModalscreateAdditionalModalsData = useSelector(
    (state) => state.UserManagementModals.createAdditionalModals
  );

  const UserMangementReducerLoadingData = useSelector(
    (state) => state.UserMangementReducer.Loading
  );

  //States
  const [members, setMembers] = useState([]);
  const [createAddionalUsers, setCreateAddionalUsers] = useState({
    Name: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Designation: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    isAdminCheck: false,
  });

  //OnChange For Text Fields
  const createAddiotionalUsersHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Name" && value !== "") {
      setCreateAddionalUsers({
        ...createAddionalUsers,
        Name: {
          value: value.trimStart(),
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else if (name === "Name" && value === "") {
      setCreateAddionalUsers({
        ...createAddionalUsers,
        Name: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "Email" && value !== "") {
      if (value !== "") {
        setCreateAddionalUsers({
          ...createAddionalUsers,
          Email: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Email" && value === "") {
      setCreateAddionalUsers({
        ...createAddionalUsers,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "Designation" && value !== "") {
      if (value !== "") {
        setCreateAddionalUsers({
          ...createAddionalUsers,
          Designation: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Designation" && value === "") {
      setCreateAddionalUsers({
        ...createAddionalUsers,
        Designation: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  //Adding Addtional Users
  const handleAddMember = () => {
    const { Name, Email, isAdminCheck, Designation } = createAddionalUsers;
    if (Name.value && Email.value) {
      try {
        if (validateEmailEnglishAndArabicFormat(Email.value)) {
          // Add member to the members array
          setMembers((prevMembers) => [
            ...prevMembers,
            {
              UserName: Name.value,
              UserEmail: Email.value,
              OrganizationName: localStorage.getItem("organizatioName"),
              Designation: Designation.value,
              MobileNumber: "",
              OrganizationID: Number(localStorage.getItem("OrganizationID")),
              isAdmin: isAdminCheck,
              FK_NumberWorldCountryID: 153,
              OrganizationSelectedPackageID: Number(
                localStorage.getItem("organizationSelectedUserPackageID")
              ),
            },
          ]);
          setCreateAddionalUsers({
            Name: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },

            Email: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
            Designation: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },

            isAdminCheck: false,
          });
        } else {
          setCreateAddionalUsers((prevState) => ({
            ...prevState, // Spread the previous state to keep other values unchanged
            Email: {
              value: Email.value,
              errorMessage: t("Enter-valid-email-address"),
              errorStatus: true,
            },
          }));
        }
      } catch {}
    } else {
      // Optionally handle the case where Name or Email is empty
      // e.g., set error messages in createAddionalUsers
    }
  };
  //handle removing the addional Users
  const handleCrossIcon = (indexToRemove) => {
    setMembers((currentMembers) =>
      currentMembers.filter((_, index) => index !== indexToRemove)
    );
  };

  //Handle Skip Button
  const handleSkipButton = async () => {
    await dispatch(showCreateAddtionalUsersModal(false));

    await dispatch(getPackageExpiryDetail(navigate, Number(organzataionID), t));
    navigate("/Admin/ManageUsers");
  };

  //handle Create button
  const handleCreatebutton = async () => {
    if (Object.keys(members).length > 0) {
      let data = { UserDataList: members };
      await dispatch(
        getPackageExpiryDetail(navigate, Number(organzataionID), t)
      );
      await dispatch(AddOrganizationsUserApi(navigate, t, data, false));
    } else {
      // add notification that ad atleast one user
    }
  };

  //IsAdmin  Check
  const HandleCheck = () => {
    setCreateAddionalUsers({
      ...createAddionalUsers,
      isAdminCheck: !createAddionalUsers.isAdminCheck,
    });
  };

  return (
    <section>
      <Modal
        show={UserManagementModalscreateAdditionalModalsData}
        setShow={dispatch(showCreateAddtionalUsersModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showCreateAddtionalUsersModal(true));
        }}
        ModalBody={
          <>
            <section className={styles["Padding_Alignment"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["AddtionalUserheading"]}>
                    {t("Create-addtional-users")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col lg={12} md={12} sm={12} className={styles["RedSrtip"]}>
                  <span className={styles["RedStripContent"]}>
                    {t("Maximum-20-users-can-be-created-in-trial-version")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    name="Name"
                    value={createAddionalUsers.Name.value}
                    change={createAddiotionalUsersHandler}
                    placeholder={t("Full-name")}
                    label={
                      <>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["NameCreateAddtional"]}>
                              {t("Name")}{" "}
                              <span className={styles["Steric"]}>*</span>
                            </span>
                          </Col>
                        </Row>
                      </>
                    }
                    applyClass={"updateNotes_titleInput"}
                  />
                  <Row>
                    <Col>
                      <p
                        className={
                          createAddionalUsers.Name.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {createAddionalUsers.Name.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col lg={6} md={6} sm={12}>
                  <TextField
                    placeholder={t("Email")}
                    label={
                      <>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Email")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </>
                    }
                    applyClass={"updateNotes_titleInput"}
                    name="Email"
                    value={createAddionalUsers.Email.value}
                    change={createAddiotionalUsersHandler}
                  />
                  <Row>
                    <Col>
                      <p
                        className={
                          createAddionalUsers.Email.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {createAddionalUsers.Email.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>{" "}
                <Col lg={6} md={6} sm={12}>
                  <TextField
                    placeholder={t("Designation")}
                    label={
                      <>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Designation")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </>
                    }
                    applyClass={"updateNotes_titleInput"}
                    value={createAddionalUsers.Designation.value}
                    name="Designation"
                    change={createAddiotionalUsersHandler}
                  />
                  <Row>
                    <Col>
                      <p
                        className={
                          createAddionalUsers.Designation.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {createAddionalUsers.Designation.errorMessage}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex flex-column flex-wrap"
                >
                  <span className={styles["NameCreateAddtional"]}>
                    {t("Organization")}
                  </span>
                  <span className={styles["NameClass"]}>{OrganizatioName}</span>
                </Col>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="flex-column flex-wrap"
                >
                  <span className={styles["NameCreateAddtional"]}>
                    {t("Select-role")}
                  </span>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                      <Checkbox
                        classNameCheckBoxP="m-0 p-0"
                        classNameDiv=""
                        checked={createAddionalUsers.isAdminCheck}
                        onChange={HandleCheck}
                      />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("Is-admin-also")}
                      </span>
                    </Col>
                  </Row>
                </Col>{" "}
                <Col
                  lg={2}
                  md={2}
                  sm={12}
                  xs={12}
                  className={styles["buttonStyles"]}
                >
                  <Button
                    onClick={handleAddMember}
                    text={
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="d-flex justify-content-center align-items-center"
                          >
                            <img
                              src={plusFaddes}
                              alt=""
                              className={styles["PlusIcons"]}
                            />
                          </Col>
                        </Row>
                      </>
                    }
                    className={styles["Buttonclass"]}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={styles["Scroller_Users"]}
                >
                  <Row>
                    {members.map((data, index) => {
                      console.log(data, "membersmembersmembers");
                      return (
                        <>
                          <Col lg={6} md={6} sm={12} className="mt-2">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <AddtionalUserCard
                                  Employeename={data?.UserName}
                                  Employeeemail={data?.UserEmail}
                                  EmployeePic={data?.displayProfilePictureName}
                                  Icon={
                                    <img
                                      src={CrossIcon}
                                      width="18px"
                                      height="18px"
                                      alt=""
                                      draggable="false"
                                      className="cursor-pointer"
                                      onClick={() => handleCrossIcon(index)}
                                    />
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                        </>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className={styles["Padding_Alignment"]}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Skip")}
                    className={styles["SkipandResetButtonClass"]}
                    onClick={handleSkipButton}
                  />

                  <Button
                    text={t("Create")}
                    className={styles["CreateButtonClass"]}
                    onClick={handleCreatebutton}
                  />
                </Col>
              </Row>
            </section>{" "}
          </>
        }
      />
    </section>
  );
};

export default CreateAddtionalUsersModal;
