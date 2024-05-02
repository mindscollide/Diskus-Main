import React, { useState, useEffect } from "react";
import styles from "./AddUserMain.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { Checkbox, Spin } from "antd";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import "react-phone-input-2/lib/style.css";
import { Button, Loader } from "../../../../../components/elements";
import { countryNameforPhoneNumber } from "../../../../Admin/AllUsers/AddUser/CountryJson";
import { validateEmailEnglishAndArabicFormat } from "../../../../../commen/functions/validations";
import {
  getOrganizationPackageUserStatsAPI,
  AddOrganizationsUserApi,
  GetOrganizationSelectedPackagesByOrganizationIDApi,
} from "../../../../../store/actions/UserManagementActions";
import { checkEmailExsist } from "../../../../../store/actions/Admin_Organization";
import { Check2 } from "react-bootstrap-icons";

const AddUserMain = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { UserMangementReducer, adminReducer } = useSelector((state) => state);
  console.log(
    UserMangementReducer.organizationSelectedPakagesByOrganizationIDData,
    "organizationSelectedPakagesByOrganizationIDData"
  );

  // organizationName from Local Storage
  const organizationName = localStorage.getItem("organizatioName");
  const organizationID = localStorage.getItem("organizationID");
  const UserID = localStorage.getItem("userID");
  const [companyEmailValidateError, setCompanyEmailValidateError] =
    useState("");
  const [companyEmailValidate, setCompanyEmailValidate] = useState(false);
  const [packageAssignedOption, setPackageAssignedOption] = useState([]);
  const [packageAssignedValue, setPackageAssignedValue] = useState([]);
  const [isEmailUnique, setEmailUnique] = useState(false);
  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAddMain, setUserAddMain] = useState({
    Name: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    Designation: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    MobileNumber: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    PackageAssigned: {
      value: 0,
      errorMessage: "",
      errorStatus: false,
    },

    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    isAdmin: 3,
    FK_NumberWorldCountryID: 0,
  });

  const myStats = UserMangementReducer.getOrganizationUserStatsGraph?.userStats;
  console.log(myStats, "datatatataF");

  const userStats = useSelector(
    (state) => state.UserMangementReducer.getOrganizationUserStatsGraph
  );

  //For Now I set static data in this getOrganizationPackageUserStatsAPI Api
  useEffect(() => {
    dispatch(getOrganizationPackageUserStatsAPI(navigate, t));
  }, []);

  const addUserHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Name") {
      if (/^[A-Za-z\s]+$/.test(value) || value === "") {
        // Check if value contains only alphabetic characters or is empty
        setUserAddMain({
          ...userAddMain,
          Name: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setUserAddMain({
          ...userAddMain,
          Name: {
            value: userAddMain.Name.value,
            errorMessage: "",
            errorStatus: true,
          },
        });
      }
    }

    if (name === "Designation") {
      if (/^[A-Za-z\s]+$/.test(value) || value === "") {
        // Check if value contains only alphabetic characters or is empty
        setUserAddMain({
          ...userAddMain,
          Designation: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setUserAddMain({
          ...userAddMain,
          Designation: {
            value: userAddMain.Designation.value,
            errorMessage: "",
            errorStatus: true,
          },
        });
      }
    }

    if (name === "MobileNumber") {
      if (/^\d+$/.test(value) || value === "") {
        // Check if value contains only digits or is empty
        setUserAddMain({
          ...userAddMain,
          MobileNumber: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setUserAddMain({
          ...userAddMain,
          MobileNumber: {
            value: userAddMain.MobileNumber.value,
            errorMessage: "",
            errorStatus: true,
          },
        });
      }
    }

    if (name === "Email" && value !== "") {
      if (value !== "") {
        setUserAddMain({
          ...userAddMain,
          Email: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Email" && value === "") {
      setUserAddMain({
        ...userAddMain,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }

    // if (name === "Email" && value !== "") {
    //   if (value !== "") {
    //     // Check if email is not empty
    //     if (validateEmailEnglishAndArabicFormat(value)) {
    //       // Check if email format is valid
    //       setUserAddMain({
    //         ...userAddMain,
    //         Email: {
    //           value: value.trimStart(),
    //           errorMessage: "", // Clear error message when email is valid
    //           errorStatus: false, // Set error status to false when email is valid
    //         },
    //       });
    //     } else {
    //       setUserAddMain({
    //         ...userAddMain,
    //         Email: {
    //           value: value.trimStart(),
    //           errorMessage: t("Enter-valid-email-address"), // Set error message when email is invalid
    //           errorStatus: true, // Set error status to true when email is invalid
    //         },
    //       });
    //     }
    //   } else {
    //     // Handle case when email is empty
    //     setUserAddMain({
    //       ...userAddMain,
    //       Email: {
    //         value: "",
    //         errorMessage: "", // Clear error message when email is empty
    //         errorStatus: false, // Set error status to false when email is empty
    //       },
    //     });
    //   }
    // }
  };

  //Validating the Email
  const handeEmailvlidate = () => {
    if (userAddMain.Email.value !== "") {
      if (validateEmailEnglishAndArabicFormat(userAddMain.Email.value)) {
        dispatch(
          checkEmailExsist(
            setCompanyEmailValidate,
            setCompanyEmailValidateError,
            userAddMain,
            t,
            setEmailUnique
          )
        );
      } else {
        setEmailUnique(false);
        setUserAddMain({
          ...userAddMain,
          Email: {
            value: userAddMain.Email.value,
            errorMessage: t("Enter-valid-email-address"),
            errorStatus: true,
          },
        });
      }
    } else {
      setEmailUnique(false);
      setUserAddMain({
        ...userAddMain,
        Email: {
          value: "",
          errorMessage: t("Enter-email-address"),
          errorStatus: true,
        },
      });
    }
  };

  //Validate Email useEffect
  useEffect(() => {
    if (companyEmailValidateError !== " ") {
      setUserAddMain({
        ...userAddMain,
        Email: {
          value: userAddMain.Email.value,
          errorMessage: companyEmailValidateError,
          errorStatus: companyEmailValidate,
        },
      });
    }
  }, [companyEmailValidate, companyEmailValidateError]);

  // API hit on create button
  const handleCreate = async () => {
    if (
      userAddMain.Name.value !== "" &&
      userAddMain.Designation.value !== "" &&
      userAddMain.MobileNumber.value !== "" &&
      userAddMain.PackageAssigned.value !== "" &&
      userAddMain.Email.value !== ""
    ) {
      let createData = {
        UserDataList: [
          {
            UserName: userAddMain.Name.value,
            OrganizationName: organizationName,
            Designation: userAddMain.Designation.value,
            MobileNumber: userAddMain.MobileNumber.value,
            UserEmail: userAddMain.Email.value,
            OrganizationID: Number(organizationID),
            RoleID: userAddMain.isAdmin,
            FK_NumberWorldCountryID: userAddMain.FK_NumberWorldCountryID,
            PackageID: Number(userAddMain.PackageAssigned.value),
          },
        ],
      };
      await dispatch(AddOrganizationsUserApi(navigate, t, createData));
    } else {
      setUserAddMain({
        ...userAddMain,
        Name: {
          value: userAddMain.Name.value,
          errorMessage: t("Please-enter-full-name"),
          errorStatus: userAddMain.Name.errorStatus,
        },
        Designation: {
          value: userAddMain.Designation.value,
          errorMessage: t("Please-select-designation"),
          errorStatus: userAddMain.Designation.errorStatus,
        },
        MobileNumber: {
          value: userAddMain.MobileNumber.value,
          errorMessage: t("Please-enter-mobile-number"),
          errorStatus: userAddMain.MobileNumber.errorStatus,
        },
        PackageAssigned: {
          value: userAddMain.PackageAssigned.value,
          errorMessage: t("Please-select-a-package"),
          errorStatus: userAddMain.PackageAssigned.errorStatus,
        },
        Email: {
          ...userAddMain.Email,
          errorMessage:
            userAddMain.Email.value === ""
              ? t("Please-enter-email-address")
              : userAddMain.Email.errorMessage, // Retain previous error message if field is not empty
          errorStatus: userAddMain.Email.value === "",
        },
      });
    }
  };

  const handleReset = () => {
    setUserAddMain({
      ...userAddMain,
      Name: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },

      Designation: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },

      MobileNumber: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },

      PackageAssigned: {
        value: 0,
        errorMessage: "",
        errorStatus: false,
      },
      isAdmin: {
        value: false,
        errorMessage: "",
        errorStatus: false,
      },

      Email: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
    });
    setPackageAssignedValue([]);
  };

  //for remove the grid from backgroun
  const options = {
    backgroundColor: "transparent",
    border: "1px solid #ffffff",
    // strokeWidth: "10px",
    hAxis: {
      viewWindow: {
        min: 0, // for space horizontally between bar
        max: 4, // for space horizontally between bar
      },
      textStyle: {
        color: "#000000",
        // this will change the color of the text to white
        fontSize: 11, // this will change the font size of the text to 12px
      },
    },
    legend: "none",
    vAxis: {
      textPosition: "none",
      gridlines: {
        count: 0,
        background: "transparent",
      },
    },

    bar: {
      groupWidth: "90%",
      borderRadius: "10px",
    },
  };

  useEffect(() => {
    if (Object.keys(graphData).length > 0) {
      setLoading(false);
    } else {
      console.log("Noloading");
    }
  }, [graphData]);

  // useEffect to set data in graph
  useEffect(() => {
    if (
      UserMangementReducer.getOrganizationUserStatsGraph &&
      Object.keys(UserMangementReducer.getOrganizationUserStatsGraph).length > 0
    ) {
      const userStats =
        UserMangementReducer.getOrganizationUserStatsGraph.userStats;

      // Ensure that userStats object is not empty
      if (userStats) {
        const data = [
          ["Element", "Users", { role: "style" }, { role: "annotation" }],
          [
            "Enabled Users",
            parseInt(userStats.enabledUsers),
            "#6172D6",
            userStats.enabledUsers.toString(),
          ],
          [
            "Disabled Users",
            parseInt(userStats.disabledUsers),
            "#6172D6",
            userStats.disabledUsers.toString(),
          ],
          [
            "Locked Users",
            parseInt(userStats.lockedUsers),
            "#6172D6",
            userStats.lockedUsers.toString(),
          ],
          [
            "Dormant Users",
            parseInt(userStats.dormantUsers),
            "#6172D6",
            userStats.dormantUsers.toString(),
          ],
        ];

        setGraphData(data);
      }
    }
  }, [UserMangementReducer.getOrganizationUserStatsGraph]);

  //handle select for checkbox is Admin
  const handleAdminChange = () => {
    setUserAddMain((prevState) => ({
      ...prevState,
      isAdmin: prevState.isAdmin === 3 ? 4 : 3,
    }));
  };

  // handle select for country Flag
  const handleSelect = (country) => {
    console.log(country, "countrycountrycountry");
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary == country;
    });

    setUserAddMain({
      ...userAddMain,
      FK_NumberWorldCountryID: a.id,
    });
  };

  // package assigned option dropdown useEffect it will disable option when packageAllotedUsers greater then headCount
  useEffect(() => {
    if (
      UserMangementReducer.getOrganizationUserStatsGraph &&
      Object.keys(UserMangementReducer.getOrganizationUserStatsGraph).length > 0
    ) {
      let temp = [];
      UserMangementReducer.getOrganizationUserStatsGraph.selectedPackageDetails.map(
        (data, index) => {
          console.log(data, "packageDatapackageData");
          temp.push({
            value: data.pK_PackageID,
            label: data.name,
            isDisabled: data.packageAllotedUsers > data.headCount,
          });
        }
      );
      setPackageAssignedOption(temp);
    }
  }, [UserMangementReducer.getOrganizationUserStatsGraph]);

  // handler of package Assigned
  const handlePackageAssigned = async (selectedOption) => {
    setPackageAssignedValue(selectedOption);
    if (selectedOption && selectedOption.value) {
      setUserAddMain({
        ...userAddMain,
        PackageAssigned: {
          value: selectedOption.value,
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      setUserAddMain({
        ...userAddMain,
        PackageAssigned: {
          value: 0,
          errorMessage: t("Please-select-a-package"),
          errorStatus: true,
        },
      });
    }
  };

  // this is how I show alloted users and headcount
  const selectedPackages =
    UserMangementReducer.getOrganizationUserStatsGraph?.selectedPackageDetails;
  // Calculate total alloted users and headCount
  let totalAllotedUsers = 0;
  let totalHeadCount = 0;

  selectedPackages?.forEach((packages) => {
    totalAllotedUsers += packages.packageAllotedUsers;
    totalHeadCount += packages.headCount;
  });

  console.log(
    totalAllotedUsers,
    totalHeadCount,
    "totalAllotedUserstotalAllotedUsers"
  );

  return (
    <>
      <Container className={styles["container-main-class"]}>
        <Row className="Add-User-Limit">
          <Col lg={6} md={6} sm={12} xs={12} className="mt-2">
            <Container>
              <>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="mt-2">
                    <label className={styles["addUser-Heading"]}>
                      {t("Add-user")}
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col lg={9} md={9} sm={12} xs={12} className="mt-2">
                    <div className={styles["chartbarBorder-adduser"]}>
                      {loading ? (
                        <div>
                          <Row className="mt-5 mb-5">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              xs={12}
                              className="d-flex justify-content-end ms-4 mt-5 mb-5"
                            >
                              <Spin />
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <Chart
                          chartType="ColumnChart"
                          width="100%"
                          height="250px"
                          radius={10}
                          data={graphData}
                          options={options}
                          className={styles["Addchart"]}
                        />
                      )}

                      <Row className="d-flex justify-content-center">
                        <Col
                          lg={8}
                          md={8}
                          sm={8}
                          xs={12}
                          className="MontserratSemiBold-600 color-5a5a5a font-14 Saved_money_Tagline"
                        >
                          {Number(totalAllotedUsers)} {t("Of")}{" "}
                          {Number(totalHeadCount)} {t("Users")}
                        </Col>
                      </Row>
                      <Row className="d-flex justify-content-center">
                        <Col lg={8} md={8} sm={8} xs={12}>
                          <ProgressBar
                            now={totalAllotedUsers}
                            max={totalHeadCount}
                            className={styles["AddProgressBar"]}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <Row>
                            <Row>
                              <Col lg={8} md={8} sm={8} xs={12} className="">
                                <label className={styles["labelChart-Title"]}>
                                  {t("Enabled-users")}
                                </label>
                              </Col>
                              <Col lg={4} md={4} sm={4} xs={12}>
                                <label className={styles["labelChart-Number"]}>
                                  {`${
                                    myStats &&
                                    myStats !== null &&
                                    myStats?.enabledUsers
                                  } / ${totalHeadCount}`}
                                </label>
                              </Col>
                              <div className={styles["borderLine-title"]} />
                            </Row>
                            <Row>
                              <Col lg={8} md={8} sm={8} xs={12} className="">
                                <label className={styles["labelChart-Title"]}>
                                  {t("Disabled-users")}
                                </label>
                              </Col>
                              <Col lg={4} md={4} sm={4} xs={12}>
                                <label className={styles["labelChart-Number"]}>
                                  {`${
                                    myStats &&
                                    myStats !== null &&
                                    myStats?.disabledUsers
                                  } / ${totalHeadCount}`}
                                </label>
                              </Col>
                              <div className={styles["borderLine-title"]} />
                            </Row>
                            <Row>
                              <Col lg={8} md={8} sm={8} xs={12} className="">
                                <label className={styles["labelChart-Title"]}>
                                  {t("Locked-users")}
                                </label>
                              </Col>
                              <Col lg={4} md={4} sm={4} xs={12}>
                                <label className={styles["labelChart-Number"]}>
                                  {`${
                                    myStats &&
                                    myStats !== null &&
                                    myStats?.lockedUsers
                                  } / ${totalHeadCount}`}
                                </label>
                              </Col>
                              <div className={styles["borderLine-title"]} />
                            </Row>
                            <Row>
                              <Col lg={8} md={8} sm={8} xs={12} className="">
                                <label className={styles["labelChart-Title"]}>
                                  {t("Dorment-users")}
                                </label>
                              </Col>
                              <Col lg={4} md={4} sm={4} xs={12}>
                                <label className={styles["labelChart-Number"]}>
                                  {`${
                                    myStats &&
                                    myStats !== null &&
                                    myStats?.dormantUsers
                                  } / ${totalHeadCount}`}
                                </label>
                              </Col>
                              <div className={styles["borderLine-title"]} />
                            </Row>
                            {/* <Col lg={4} md={4} sm={4} xs={12}>
                              <label className={styles["labelChart-Number"]}>
                                {`${packages.allotedUsers} / ${packages.headCount}`}
                              </label>
                            </Col> */}
                          </Row>

                          {["Professional", "Premium"].map((packageName) => {
                            const packageData =
                              UserMangementReducer.getOrganizationUserStatsGraph?.selectedPackages?.find(
                                (packages) => packages.name === packageName
                              );

                            return (
                              packageData && (
                                <Row key={packageName}>
                                  <Col
                                    lg={8}
                                    md={8}
                                    sm={8}
                                    xs={12}
                                    className=""
                                  >
                                    <label
                                      className={
                                        styles["Admin-labelChart-Title"]
                                      }
                                    >
                                      {packageName}
                                    </label>
                                  </Col>
                                  <Col lg={4} md={4} sm={4} xs={12}>
                                    <label
                                      className={
                                        styles["Admin-labelChart-Number"]
                                      }
                                    >
                                      {`${packageData.allotedUsers} / ${packageData.headCount}`}
                                    </label>
                                  </Col>
                                  <div className={styles["borderLine-title"]} />
                                </Row>
                              )
                            );
                          })}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </>
            </Container>
          </Col>

          <Col
            lg={6}
            md={6}
            sm={12}
            xs={12}
            className="ms-auto"
            style={{ marginTop: "20px" }}
          >
            {/* <Form> */}
            <Container className="mt-5">
              <>
                <Row>
                  <label className={styles["label-styling"]}>
                    <span>
                      {t("Name")}{" "}
                      <span className={styles["aesterick-color"]}> *</span>
                    </span>
                  </label>
                  <Col lg={12} md={12} sm={12}>
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      name="Name"
                      value={userAddMain.Name.value}
                      placeholder={t("Name")}
                      maxLength={200}
                      onChange={addUserHandler}
                      applyClass="form-control2"
                    />
                    <Col>
                      <p
                        className={
                          userAddMain.Name.value === ""
                            ? ` ${styles["errorMessage"]}`
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {userAddMain.Name.errorMessage}
                      </p>
                    </Col>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className={styles["flex-direction-column"]}
                  >
                    <label className={styles["label-styling"]}>
                      {t("Organization")}{" "}
                    </label>
                    <span className={styles["associates-text"]}>
                      {/* {t("Waqas-associates")} */}
                      {organizationName}
                    </span>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className={styles["flex-direction-column"]}
                  >
                    <label className={styles["label-styling"]}>
                      {t("Organization-role")}{" "}
                    </label>

                    <span>
                      <Checkbox
                        checked={userAddMain.isAdmin === 4}
                        onChange={handleAdminChange}
                        classNameCheckBoxP="m-0 p-0"
                        classNameDiv=""
                      />
                      <label className={styles["checkbox-label"]}>
                        {t("is-admin-also")}
                      </label>
                    </span>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={6} md={6} sm={6}>
                    <label className={styles["label-styling"]}>
                      {t("Designations")}{" "}
                      <span className={styles["aesterick-color"]}> *</span>
                    </label>
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      name="Designation"
                      value={userAddMain.Designation.value}
                      placeholder={t("Designation")}
                      maxLength={200}
                      onChange={addUserHandler}
                      applyClass="form-control2"
                    />
                    <Col>
                      <p
                        className={
                          userAddMain.Designation.value === ""
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {userAddMain.Designation.errorMessage}
                      </p>
                    </Col>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={6}>
                    <Row>
                      <label className={styles["label-styling"]}>
                        {t("Mobile-number")}{" "}
                        <span className={styles["aesterick-color"]}> *</span>
                      </label>
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
                        xs={12}
                        className={styles["react-flag"]}
                      >
                        <ReactFlagsSelect
                          name="reactFlag"
                          fullWidth={false}
                          //   onOpen={handleDropdownOpen}
                          selected={selected}
                          selectedCountry={selectedCountry}
                          selectedSize={8}
                          onSelect={handleSelect}
                          searchable={true}
                          placeholder={"Select Co...."}
                          customLabels={countryNameforPhoneNumber}
                        />
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={12}>
                        <Form.Control
                          placeholder={t("Enter-phone-number")}
                          className={
                            styles["formcontrol-Phone-Input-Textfield"]
                          }
                          applyClass="form-control2"
                          maxLength={15}
                          minLength={4}
                          onChange={addUserHandler}
                          value={userAddMain.MobileNumber.value}
                          name="MobileNumber"
                        />
                        <Col>
                          <p
                            className={
                              userAddMain.MobileNumber.value === ""
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {userAddMain.MobileNumber.errorMessage}
                          </p>
                        </Col>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={6} md={6} sm={6} className="mt-1">
                    <label className={styles["label-styling"]}>
                      {t("Package-assigned")}{" "}
                      <span className={styles["aesterick-color"]}> *</span>
                    </label>
                    <Select
                      name="PackageAssigned"
                      value={packageAssignedValue}
                      options={packageAssignedOption}
                      onChange={handlePackageAssigned}
                      placeholder={t("Please-select-one-option")}
                    />
                    <Col>
                      <p
                        className={
                          userAddMain.PackageAssigned.value === 0
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {userAddMain.PackageAssigned.errorMessage}
                      </p>
                    </Col>
                  </Col>

                  <Col lg={6} md={6} sm={6}>
                    <label className={styles["label-styling"]}>
                      {t("Email")}{" "}
                      <span className={styles["aesterick-color"]}> *</span>
                    </label>
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      name="Email"
                      onBlur={() => {
                        handeEmailvlidate();
                      }}
                      onChange={addUserHandler}
                      value={userAddMain.Email.value}
                      placeholder={t("Email")}
                      maxLength={200}
                      applyClass="form-control2"
                    />
                    <Col>
                      <p
                        className={
                          userAddMain.Email.value === "" ||
                          userAddMain.Email.errorStatus
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {userAddMain.Email.errorMessage}
                      </p>
                    </Col>
                    {adminReducer.EmailCheckSpinner ? (
                      <Spinner className={styles["checkEmailSpinner"]} />
                    ) : null}
                    {isEmailUnique && (
                      <Check2 className={styles["isEmailUnique"]} />
                    )}
                  </Col>
                </Row>

                <Row className="mt-5 py-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    <Button
                      className={styles["add-User-Reset-btn"]}
                      text={t("Reset")}
                      onClick={handleReset}
                    ></Button>
                    <Button
                      className={styles["Add-User-Create"]}
                      text={t("Create")}
                      onClick={handleCreate}
                    ></Button>
                  </Col>
                </Row>
              </>
            </Container>
          </Col>
        </Row>
        {UserMangementReducer.Loading ? <Loader /> : null}
      </Container>
    </>
  );
};

export default AddUserMain;
