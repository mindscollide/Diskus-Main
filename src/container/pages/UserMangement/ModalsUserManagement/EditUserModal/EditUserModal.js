import React, { useEffect, useState } from "react";
import styles from "./EditUserModal.module.css";
import { useTranslation } from "react-i18next";
import ReactFlagsSelect from "react-flags-select";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Modal,
  TextField,
} from "../../../../../components/elements";
import { Col, Form, Row } from "react-bootstrap";
import { showEditUserModal } from "../../../../../store/actions/UserMangementModalActions";
import {
  EditOrganizationsUserApi,
  getOrganizationPackageUserStatsAPI,
} from "../../../../../store/actions/UserManagementActions";
import { useNavigate } from "react-router-dom";
import { regexOnlyCharacters } from "../../../../../commen/functions/regex";
import { countryNameforPhoneNumber } from "../../../../Admin/AllUsers/AddUser/CountryJson";
const EditUserModal = ({ editModalData }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let isTrialCheck = localStorage.getItem("isTrial") === "true" ? true : false;

  console.log(typeof isTrialCheck, "isTrialCheck");

  const UserManagementModalseditUserModalData = useSelector(
    (state) => state.UserManagementModals.editUserModal
  );

  const UserMangementReducergetOrganizationUserStatsGraphData = useSelector(
    (state) => state.UserMangementReducer.getOrganizationUserStatsGraph
  );

  let organizationID = localStorage.getItem("organizationID");

  const [packageAssignedValue, setPackageAssignedValue] = useState([]);
  const [packageAssignedOption, setPackageAssignedOption] = useState([]);
  const findCountryCodeByMobileCode = (mobileCode) => {
    for (const countryCode in countryNameforPhoneNumber) {
      if (countryNameforPhoneNumber[countryCode].secondary === mobileCode) {
        return countryCode;
      }
    }
    return "US";
  };
  // Initialize selected country using the find function
  const initialCountryCode = findCountryCodeByMobileCode(
    editModalData.mobileCode
  );
  const [selected, setSelected] = useState(initialCountryCode);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [editPakageID, setEditPakageID] = useState(0);
  console.log(editPakageID, "editPakageIDeditPakageIDeditPakageID");
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
    MobileNumber: {
      value: editModalData.mobileNumber,
      errorMessage: "",
      errorStatus: false,
    },
    Email: editModalData.email,
    isAdminUser: editModalData.userRoleID === 4 ? 4 : 3,
  });

  //ByDefault Pakage Selected

  useEffect(() => {
    if (editModalData && packageAssignedOption.length > 0) {
      const defaultOption = packageAssignedOption.find(
        (option) => option.value === editModalData.userAllotedPackageID
      );
      setEditPakageID(editModalData.userAllotedPackageID);
      setPackageAssignedValue(defaultOption);
    }
  }, [editModalData, packageAssignedOption]);

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

  const [userStatusID, setUserStatusID] = useState(userStatus.value);

  //For Now I set static data in this getOrganizationPackageUserStatsAPI Api
  useEffect(() => {
    dispatch(getOrganizationPackageUserStatsAPI(navigate, t));
  }, []);

  useEffect(() => {
    // Update state when the editModalData.userStatus changes
    setUserStatus(findOptionByValue(editModalData.userStatus));
  }, [editModalData.userStatus]);

  // Update selected state when editModalData.mobileCode changes
  useEffect(() => {
    if (editModalData.mobileCode) {
      const countryCode = findCountryCodeByMobileCode(editModalData.mobileCode);
      setSelected(countryCode);
    }
  }, [editModalData.mobileCode]);

  // package assigned option dropdown useEffect it will disable option when packageAllotedUsers greater then headCount
  useEffect(() => {
    if (
      UserMangementReducergetOrganizationUserStatsGraphData &&
      Object.keys(UserMangementReducergetOrganizationUserStatsGraphData)
        .length > 0
    ) {
      let temp = [];
      UserMangementReducergetOrganizationUserStatsGraphData.selectedPackageDetails.forEach(
        (data) => {
          temp.push({
            value: data.pK_PackageID,
            label: data.name,
            isDisabled: data.packageAllotedUsers > data.headCount,
          });
        }
      );
      setPackageAssignedOption(temp);
    }
  }, [UserMangementReducergetOrganizationUserStatsGraphData]);

  // Handler for when an option is selected.
  const handleSelectChange = async (selectedOption) => {
    setUserStatus(selectedOption);
    setUserStatusID(selectedOption.value);
  };

  // Handle the country selection
  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
  };

  const handleUpdateModal = (e) => {
    let name = e.target.name;
    let value = e.target.value;

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

    if (name === "MobileNumber" && value !== "") {
      if (/^\d+$/.test(value) || value === "") {
        // Check if value contains only digits or is empty
        setEditUserModalValues({
          ...editUserModalValues,
          MobileNumber: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setEditUserModalValues({
          ...editUserModalValues,
          MobileNumber: {
            value: editModalData.mobileNumber,
            errorMessage: "",
            errorStatus: true,
          },
        });
      }
    } else if (name === "MobileNumber" && value === "") {
      setEditUserModalValues({
        ...editUserModalValues,
        MobileNumber: {
          value: "",
          errorMessage: "",
          errorStatus: true,
        },
      });
    }
  };

  const handleUpdateButton = () => {
    if (
      editUserModalValues.Name.value !== "" &&
      editUserModalValues.Desgiantion.value !== "" &&
      editUserModalValues.MobileNumber.value !== ""
    ) {
      let data = {
        UserID: Number(editModalData.userID),
        StatusID: Number(userStatusID),
        UserName: editUserModalValues.Name.value,
        Designation: editUserModalValues.Desgiantion.value,
        MobileNumber: editUserModalValues.MobileNumber.value,
        RoleID: editUserModalValues.isAdminUser,
        OrganizationID: Number(organizationID),
        PackageID: isTrialCheck ? 4 : Number(editPakageID),
        FK_NumberWorldCountryID: Number(editModalData.fK_WorldCountryID),
      };
      //The True is The Flag for AllOrganization User After Editing the User
      dispatch(EditOrganizationsUserApi(navigate, t, data, true));
    } else {
      setEditUserModalValues({
        ...editUserModalValues,
        Name: {
          value: editUserModalValues.Name.value,
          errorMessage: t("Please-enter-full-name"),
          errorStatus: editUserModalValues.Name.errorStatus,
        },

        Desgiantion: {
          value: editUserModalValues.Desgiantion.value,
          errorMessage: t("Please-enter-designation"),
          errorStatus: editUserModalValues.Desgiantion.errorStatus,
        },
        MobileNumber: {
          value: editUserModalValues.MobileNumber.value,
          errorMessage: t("Please-enter-mobile-number"),
          errorStatus: editUserModalValues.Name.errorStatus,
        },
      });
    }
  };

  const handleIsAdminCheckbox = (e) => {
    setEditUserModalValues((prevState) => ({
      ...prevState,
      isAdminUser: e.target.checked ? 4 : 3,
    }));
  };

  const handlePackageAssigned = async (selectedOption) => {
    setPackageAssignedValue(selectedOption);
    setEditPakageID(selectedOption.value);
  };

  return (
    <section>
      <Modal
        show={UserManagementModalseditUserModalData}
        setShow={dispatch(showEditUserModal)}
        modalFooterClassName={"d-block border-0"}
        modalHeaderClassName={"d-block border-0"}
        onHide={() => {
          dispatch(showEditUserModal(false));
        }}
        ModalBody={
          <>
            <section className={styles["ModalAlignmnet"]}>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
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
                    <Col>
                      <p
                        className={
                          editUserModalValues.Name.value === ""
                            ? ` ${styles["errorMessage"]}`
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {editUserModalValues.Name.errorMessage}
                      </p>
                    </Col>
                  </Row>
                  <Row>
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
                    <Col>
                      <p
                        className={
                          editUserModalValues.Desgiantion.value === ""
                            ? ` ${styles["errorMessage"]}`
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {editUserModalValues.Desgiantion.errorMessage}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <label className={styles["label-styling"]}>
                      {t("Mobile-number")}{" "}
                      <span className={styles["aesterick-color"]}> *</span>
                    </label>
                    <Col
                      lg={3}
                      md={3}
                      sm={3}
                      xs={12}
                      className={styles["react-flag"]}
                    >
                      <ReactFlagsSelect
                        name="reactFlag"
                        fullWidth={false}
                        selected={selected} // Set the selected value from state
                        selectedSize={8}
                        className="menu-flags"
                        onSelect={handleSelect}
                        searchable={true}
                        placeholder={"Select Co...."}
                        customLabels={countryNameforPhoneNumber}
                      />
                    </Col>
                    <Col lg={9} md={9} sm={9} xs={12}>
                      <Form.Control
                        placeholder={t("Enter-phone-number")}
                        className={styles["formcontrol-Phone-Input-Textfield"]}
                        applyClass="form-control2"
                        maxLength={15}
                        minLength={4}
                        onChange={handleUpdateModal}
                        value={editUserModalValues.MobileNumber.value}
                        name="MobileNumber"
                      />
                      <Col>
                        <p
                          className={
                            editUserModalValues.MobileNumber.value === ""
                              ? ` ${styles["errorMessage"]}`
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {editUserModalValues.MobileNumber.errorMessage}
                        </p>
                      </Col>
                    </Col>
                  </Row>
                  <Row>
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
                            checked={editUserModalValues.isAdminUser === 4}
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
                  {isTrialCheck === false && (
                    <>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <label className={styles["label-styling"]}>
                            {t("Package-assigned")}{" "}
                            <span className={styles["aesterick-color"]}>*</span>
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Select
                            name="PackageAssigned"
                            value={packageAssignedValue}
                            options={packageAssignedOption}
                            onChange={handlePackageAssigned}
                            placeholder={t("Please-select-one-option")}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
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
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className={styles["ModalAlignmnet"]}>
              <Row>
                <Col
                  lg={12}
                  md={12}
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
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default EditUserModal;
