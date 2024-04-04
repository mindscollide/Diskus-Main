import React, { useState } from "react";
import styles from "./CreateAdditionalUsersModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import plusFaddes from "../../../../../assets/images/NewBluePLus.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import profile from "../../../../../assets/images/newprofile.png";
import { useSelector } from "react-redux";
import { showCreateAddtionalUsersModal } from "../../../../../store/actions/UserMangementModalActions";
import {
  Button,
  Checkbox,
  Modal,
  TextField,
} from "../../../../../components/elements";
import crossicon from "../../../../../assets/images/BlackCrossIconModals.svg";
import { Col, Row } from "react-bootstrap";
import EmployeeinfoCard from "../../../../../components/elements/Employeeinfocard/EmployeeinfoCard";
import { AddOrganizationsUserApi } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
const CreateAddtionalUsersModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let organzataionID = localStorage.getItem("OrganizationID");

  let OrganizatioName = localStorage.getItem("OrganizatioName");

  const { UserManagementModals } = useSelector((state) => state);

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
    const { Name, Email } = createAddionalUsers;
    if (Name.value && Email.value) {
      // Add member to the members array
      setMembers((prevMembers) => [
        ...prevMembers,
        { name: Name.value, email: Email.value },
      ]);

      // Reset the input fields
      setCreateAddionalUsers({
        ...createAddionalUsers,
        Name: { ...Name, value: "" },
        Email: { ...Email, value: "" },
      });
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
  const handleSkipButton = () => {
    dispatch(showCreateAddtionalUsersModal(false));
  };

  //handle Create button
  const handleCreatebutton = () => {
    let data = {
      UserName: createAddionalUsers.Name.value,
      OrganizationName: OrganizatioName,
      Designation: createAddionalUsers.Designation.value,
      MobileNumber: "",
      UserEmail: createAddionalUsers.Email.value,
      OrganizationID: organzataionID,
      isAdmin: true,
      FK_NumberWorldCountryID: 1,
      OrganizationSelectedPackageID: 4,
    };

    console.log(data, "AddOrganizationsUserApi");
    // dispatch(AddOrganizationsUserApi(navigate, t, data));
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
    });
  };

  return (
    <section>
      <Modal
        show={UserManagementModals.createAdditionalModals}
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
                  <span className={styles["NameClass"]}>Waqas Associates</span>
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
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
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
                                <EmployeeinfoCard
                                  Employeename={data?.name}
                                  Employeeemail={data?.email}
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
            </section>
          </>
        }
      />
    </section>
  );
};

export default CreateAddtionalUsersModal;
