import React, { useEffect, useState } from "react";
import styles from "./AddUsers.module.css";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AddUsericon from "../../../../../assets/images/AddusersIcon.svg";
import {
  Button,
  Checkbox,
  TextField,
  Loader,
} from "../../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { regexOnlyCharacters } from "../../../../../commen/functions/regex";
import { checkEmailExsist } from "../../../../../store/actions/Admin_Organization";
import { validateEmailEnglishAndArabicFormat } from "../../../../../commen/functions/validations";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Check2 } from "react-bootstrap-icons";
import {
  AddOrganizationsUserApi,
  GetOrganizationSelectedPackagesByOrganizationIDApi,
} from "../../../../../store/actions/UserManagementActions";
import { Numeral } from "numeral";
const AddUsers = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { UserMangementReducer } = useSelector((state) => state);

  let organizationID = localStorage.getItem("organizationID");

  const { adminReducer } = useSelector((state) => state);

  const [pakageID, setPakageID] = useState(0);
  const [worldCountryID, setWorldCountryID] = useState(0);
  const [isEmailUnique, setEmailUnique] = useState(false);
  const [companyEmailValidateError, setCompanyEmailValidateError] =
    useState("");
  const [companyEmailValidate, setCompanyEmailValidate] = useState(false);
  const [addUserFreeTrial, setAddUserFreeTrial] = useState({
    Name: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    Desgination: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    isAdmin: 3,
  });

  // before my changes there's an request data going init this API
  //Calling GetOrganizationSelectedPackagesByOrganizationID
  useEffect(() => {
    dispatch(GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t));
    return () => {
      setAddUserFreeTrial({
        Name: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },

        Desgination: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },

        Email: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
        isAdmin: 3,
      });
    };
  }, []);

  //Data from  GetOrganizationSelectedPackagesByOrganizationID
  useEffect(() => {
    if (
      UserMangementReducer.organizationSelectedPakagesByOrganizationIDData &&
      Object.keys(
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData
      ).length > 0
    ) {
      console.log(
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData,
        "UserMangementReducerUserMangementReducer"
      );
      setWorldCountryID(
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData
          .organization.fK_NumberWorldCountryID
      );
      UserMangementReducer.organizationSelectedPakagesByOrganizationIDData.organizationSubscriptions?.map(
        (data, index) => {
          data.organizationSelectedPackages?.map((packageData) => {
            console.log(
              packageData.pK_OrganizationsSelectedPackageID,
              "indexindexindex"
            );
            setPakageID(packageData.pK_OrganizationsSelectedPackageID);
          });
        }
      );
    }
  }, [UserMangementReducer.organizationSelectedPakagesByOrganizationIDData]);

  //Handle Change For TextFields
  const handleAddUsersFreeTrial = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    //Name Handle Change
    if (name === "Name" && value !== "") {
      let valueName = regexOnlyCharacters(value);
      if (valueName !== "") {
        setAddUserFreeTrial({
          ...addUserFreeTrial,
          Name: {
            value: valueName.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Name" && value === "") {
      setAddUserFreeTrial({
        ...addUserFreeTrial,
        Name: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    //Designation Handle Change
    if (name === "Desgiantion" && value !== "") {
      let valueName = regexOnlyCharacters(value);
      if (valueName !== "") {
        setAddUserFreeTrial({
          ...addUserFreeTrial,
          Desgination: {
            value: valueName.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Desgiantion" && value === "") {
      setAddUserFreeTrial({
        ...addUserFreeTrial,
        Desgination: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "Email" && value !== "") {
      if (value !== "") {
        setAddUserFreeTrial({
          ...addUserFreeTrial,
          Email: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Email" && value === "") {
      setAddUserFreeTrial({
        ...addUserFreeTrial,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  //Onchange for CheckBox IsAdmin
  const handleIsAdminCheckBox = () => {
    setAddUserFreeTrial((prevState) => ({
      ...prevState,
      isAdmin: prevState.isAdmin === 3 ? 4 : 3,
    }));
  };

  //Validating the Email
  const handeEmailvlidate = () => {
    if (addUserFreeTrial.Email.value !== "") {
      if (validateEmailEnglishAndArabicFormat(addUserFreeTrial.Email.value)) {
        dispatch(
          checkEmailExsist(
            setCompanyEmailValidate,
            setCompanyEmailValidateError,
            addUserFreeTrial,
            t,
            setEmailUnique
          )
        );
      } else {
        setEmailUnique(false);
        setAddUserFreeTrial({
          ...addUserFreeTrial,
          Email: {
            value: addUserFreeTrial.Email.value,
            errorMessage: t("Enter-valid-email-address"),
            errorStatus: true,
          },
        });
      }
    } else {
      setEmailUnique(false);
      setAddUserFreeTrial({
        ...addUserFreeTrial,
        Email: {
          value: "",
          errorMessage: t("Enter-email-address"),
          errorStatus: true,
        },
      });
    }
  };

  //Handle Cancel Button
  const handleCancelButton = () => {
    navigate("/Admin/ManageUsers");
  };

  //Validate Email useEffect
  useEffect(() => {
    if (companyEmailValidateError !== " ") {
      setAddUserFreeTrial({
        ...addUserFreeTrial,
        Email: {
          value: addUserFreeTrial.Email.value,
          errorMessage: companyEmailValidateError,
          errorStatus: companyEmailValidate,
        },
      });
    }
  }, [companyEmailValidate, companyEmailValidateError]);

  //Add User Function
  const handleAddUsers = () => {
    let data = {
      UserDataList: [
        {
          UserName: addUserFreeTrial.Name.value,
          OrganizationName: "",
          Designation: addUserFreeTrial.Desgination.value,
          MobileNumber: "",
          UserEmail: addUserFreeTrial.Email.value,
          OrganizationID: Number(organizationID),
          RoleID: addUserFreeTrial.isAdmin,
          FK_NumberWorldCountryID: Number(worldCountryID),
          OrganizationSelectedPackageID: Number(pakageID),
        },
      ],
    };
    dispatch(AddOrganizationsUserApi(navigate, t, data));
  };

  return (
    <Container className={styles["PageAlignment"]}>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} xs={12}>
          <span className={styles["AddUserheading"]}>{t("Add-user")}</span>
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={4} sm={12} xs={12}>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} xs={12}>
              <TextField
                placeholder={t("Full-name")}
                value={addUserFreeTrial.Name.value}
                name={"Name"}
                change={handleAddUsersFreeTrial}
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
            </Col>
          </Row>
          <Row className="mt-4">
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex flex-column flex-wrap"
            >
              <span className={styles["NameCreateAddtional"]}>
                {t("Organization")}
              </span>
              <span className={styles["NameClass"]}>Waqas Associates</span>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} className="flex-column flex-wrap">
              <span className={styles["NameCreateAddtional"]}>
                {t("Organization-role")}
              </span>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12} className="d-flex gap-2">
                  <Checkbox
                    classNameCheckBoxP="m-0 p-0"
                    classNameDiv=""
                    checked={addUserFreeTrial.isAdmin === 4}
                    onChange={handleIsAdminCheckBox}
                  />
                  <span className={styles["AdminAlsoClass"]}>
                    {t("Is-admin-also")}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} xs={12}>
              <TextField
                placeholder={t("Designation")}
                value={addUserFreeTrial.Desgination.value}
                name={"Desgiantion"}
                change={handleAddUsersFreeTrial}
                label={
                  <>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Designation")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </Col>
                    </Row>
                  </>
                }
                applyClass={"updateNotes_titleInput"}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={11} md={11} sm={12} xs={12}>
              <TextField
                onBlur={() => {
                  handeEmailvlidate();
                }}
                placeholder={t("Email")}
                value={addUserFreeTrial.Email.value}
                name={"Email"}
                change={handleAddUsersFreeTrial}
                label={
                  <>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Email")}{" "}
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
                  {!isEmailUnique && (
                    <p
                      className={
                        (addUserFreeTrial.Email.errorStatus &&
                          addUserFreeTrial.Email.value === "") ||
                        addUserFreeTrial.Email.errorMessage !== ""
                          ? // &&
                            //   signUpDetails.Email.errorMessage !==
                            //     t("User-email-doesnt-exists"))
                            ` ${styles["errorMessage"]} `
                          : `${styles["errorMessage_hidden"]}`
                      }
                    >
                      {addUserFreeTrial.Email.errorMessage}
                    </p>
                  )}
                </Col>
              </Row>
            </Col>
            <Col lg={1} md={1} sm={12} xs={12}>
              {adminReducer.EmailCheckSpinner ? (
                <Spinner className={styles["checkEmailSpinner"]} />
              ) : null}
              {isEmailUnique && <Check2 className={styles["isEmailUnique"]} />}
            </Col>
          </Row>
        </Col>
        <Col lg={8} md={8} sm={12} xs={12}>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex align-items-center justify-content-end"
            >
              <img src={AddUsericon} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Cancel")}
            className={styles["AddUserCancelButton"]}
            onClick={handleCancelButton}
          />

          <Button
            text={t("Create")}
            className={styles["AddUserCreateButton"]}
            onClick={handleAddUsers}
          />
        </Col>
      </Row>
      {UserMangementReducer.Loading ? <Loader /> : null}
    </Container>
  );
};

export default AddUsers;
