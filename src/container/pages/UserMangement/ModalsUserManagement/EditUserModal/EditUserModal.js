import React, { useEffect, useState } from "react";
import styles from "./EditUserModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Modal,
  TextField,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import {
  showEditUserModal,
  showSucessfullyUpdatedModal,
} from "../../../../../store/actions/UserMangementModalActions";
import { EditOrganizationsUserApi } from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { regexOnlyCharacters } from "../../../../../commen/functions/regex";
const EditUserModal = ({ editModalData }) => {
  console.log(editModalData, "editModalDataeditModalData");
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { UserManagementModals } = useSelector((state) => state);

  let organizationID = localStorage.getItem("organizationID");

  const [editUserModalValues, setEditUserModalValues] = useState({
    Name: {
      value: editModalData.userName,
      errorMessage: "",
      errorStatus: false,
    },

    Desgiantion: {
      value: editModalData.designation,
      errorMessage: "",
      errorStatus: false,
    },
    Email: editModalData.email,
    isAdminUser: editModalData.userRoleID === 4 ? true : false,
  });

  const [userStatusID, setUserStatusID] = useState(0);

  //options for the dropdowm
  const options = [
    { value: 1, label: "Enabled" },
    { value: 2, label: "Disabled" },
    { value: 3, label: "Locked" },
    { value: 4, label: "Closed" },
    { value: 5, label: "Dormant" },
    { value: 6, label: "Delete" },
  ];

  const findOptionByValue = (value) => {
    switch (value.toString()) {
      case "Enabled":
        return options[0];
      case "Disabled":
        return options[1];
      case "Locked":
        return options[2];
      case "Closed":
        return options[3];
      case "Dormant":
        return options[4];
      case "Delete":
        return options[5];
      default:
        return options[0];
    }
  };

  // Initialize state with default value from editModalData
  const [userStatus, setUserStatus] = useState(() =>
    findOptionByValue(editModalData.userStatus)
  );

  useEffect(() => {
    // Update state when the editModalData.userStatus changes
    setUserStatus(findOptionByValue(editModalData.userStatus));
  }, [editModalData.userStatus]);

  // Handler for when an option is selected.
  const handleSelectChange = (selectedOption) => {
    console.log(selectedOption, "selectedOptionselectedOption");
    setUserStatus(selectedOption);
    setUserStatusID(selectedOption.value);
  };

  const handleUpdateModal = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log({ name, value }, "handleChangeSearchBoxValues");

    if (name === "Name" && value !== "") {
      let valueName = regexOnlyCharacters(value);
      if (valueName !== "") {
        setEditUserModalValues({
          ...editUserModalValues,
          Name: {
            value: valueName.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Name" && value === "") {
      setEditUserModalValues({
        ...editUserModalValues,
        Name: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    if (name === "Designation" && value !== "") {
      let valueName = regexOnlyCharacters(value);
      if (valueName !== "") {
        setEditUserModalValues({
          ...editUserModalValues,
          Desgiantion: {
            value: valueName.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Designation" && value === "") {
      setEditUserModalValues({
        ...editUserModalValues,
        Desgiantion: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  const handleUpdateButton = () => {
    let data = {
      UserID: Number(editModalData.userID),
      StatusID: Number(userStatusID),
      UserName: editUserModalValues.Name.value,
      Designation: editUserModalValues.Desgiantion.value,
      MobileNumber: "",
      isAdmin: editUserModalValues.isAdminUser,
      OrganizationID: Number(organizationID),
      OrganizationSelectedPackageID: Number(editModalData.userAllotedPackageID),
      FK_NumberWorldCountryID: Number(editModalData.fK_WorldCountryID),
    };
    //The True is The Flag for AllOrganization User After Editing the User
    dispatch(EditOrganizationsUserApi(navigate, t, data, true));
  };

  const handleIsAdminCheckbox = (e) => {
    setEditUserModalValues({
      ...editUserModalValues,
      isAdminUser: e.target.checked,
    });
  };
  return (
    <section>
      <Modal
        show={UserManagementModals.editUserModal}
        setShow={dispatch(showEditUserModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showEditUserModal(false));
        }}
        ModalBody={
          <>
            <section className={styles["ModalAlignmnet"]}>
              <Row>
                <Col lg={1} md={1} sm={12} xs={12}></Col>
                <Col lg={10} md={10} sm={12} xs={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <span className={styles["EditUsersHeading"]}>
                        {t("Edit-user")}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        placeholder={t("Full-name")}
                        name={"Name"}
                        value={editUserModalValues.Name.value}
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
                        change={handleUpdateModal}
                        applyClass={"updateNotes_titleInput"}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        placeholder={t("Designation")}
                        name={"Designation"}
                        value={editUserModalValues.Desgiantion.value}
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
                        change={handleUpdateModal}
                        applyClass={"updateNotes_titleInput"}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="flex-column flex-wrap"
                    >
                      <span className={styles["NameCreateAddtional"]}>
                        {t("Role")}
                      </span>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          className="d-flex gap-2"
                        >
                          <Checkbox
                            classNameCheckBoxP="m-0 p-0"
                            checked={editUserModalValues.isAdminUser}
                            onChange={handleIsAdminCheckbox}
                            classNameDiv=""
                          />
                          <span className={styles["AdminAlsoClass"]}>
                            {t("Is-admin-also")}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["NameCreateAddtional"]}>
                        {t("Status")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Select
                        value={userStatus}
                        onChange={handleSelectChange}
                        options={options}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex flex-column flex-wrap"
                    >
                      <span className={styles["NameCreateAddtional"]}>
                        {t("Organization")}
                      </span>
                      <span className={styles["EmailStyles"]}>
                        {editUserModalValues.Email}
                      </span>
                    </Col>
                  </Row>
                </Col>

                <Col lg={1} md={1} sm={12} xs={12}></Col>
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className={styles["ModalAlignmnet"]}>
              <Row>
                <Col lg={1} md={1} sm={12} xs={12}></Col>
                <Col
                  lg={10}
                  md={10}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text={t("Update")}
                    className={styles["EdituserModalUpdateButton"]}
                    onClick={handleUpdateButton}
                  />
                </Col>
                <Col lg={1} md={1} sm={12} xs={12}></Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default EditUserModal;
