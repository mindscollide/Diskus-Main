import React, { useState, useRef, useEffect } from "react";
import styles from "./AddUserMain.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Form, ProgressBar } from "react-bootstrap";
import { Checkbox, Spin } from "antd";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import "react-phone-input-2/lib/style.css";
import { Button } from "../../../../../components/elements";
import { countryNameforPhoneNumber } from "../../../../Admin/AllUsers/AddUser/CountryJson";
import { validateEmailEnglishAndArabicFormat } from "../../../../../commen/functions/validations";
import {
  getOrganizationPackageUserStatsAPI,
  AddOrganizationsUserApi,
  GetOrganizationSelectedPackagesByOrganizationIDApi,
} from "../../../../../store/actions/UserManagementActions";

const AddUserMain = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { UserMangementReducer } = useSelector((state) => state);
  console.log(
    UserMangementReducer.organizationSelectedPakagesByOrganizationIDData,
    "getOrganizationUserStatsGraph"
  );

  // organizationName from Local Storage
  const organizationName = localStorage.getItem("OrganizatioName");
  const organizationID = localStorage.getItem("organizationID");

  const [packageAssignedOption, setPackageAssignedOption] = useState([]);
  const [packageAssignedValue, setPackageAssignedValue] = useState([]);

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});
  const [graphData, setGraphData] = useState([]);
  console.log(graphData, "hbdhbabjajkdbhbca");

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
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },

    isAdmin: {
      value: false,
      errorMessage: "",
      errorStatus: false,
    },
    FK_NumberWorldCountryID: 0,
  });

  //For Now I set static data in this getOrganizationPackageUserStatsAPI Api
  useEffect(() => {
    let data = {
      OrganizationID: 554,
      RequestingUserID: 1196,
    };
    dispatch(getOrganizationPackageUserStatsAPI(navigate, t, data));

    let newdata = {
      OrganizationID: 569,
    };
    dispatch(
      GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t, newdata)
    );
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
        // Check if email is not empty
        if (validateEmailEnglishAndArabicFormat(value)) {
          // Check if email format is valid
          setUserAddMain({
            ...userAddMain,
            Email: {
              value: value.trimStart(),
              errorMessage: "", // Clear error message when email is valid
              errorStatus: false, // Set error status to false when email is valid
            },
          });
        } else {
          setUserAddMain({
            ...userAddMain,
            Email: {
              value: value.trimStart(),
              errorMessage: t("Enter-valid-email-address"), // Set error message when email is invalid
              errorStatus: true, // Set error status to true when email is invalid
            },
          });
        }
      } else {
        // Handle case when email is empty
        setUserAddMain({
          ...userAddMain,
          Email: {
            value: "",
            errorMessage: "", // Clear error message when email is empty
            errorStatus: false, // Set error status to false when email is empty
          },
        });
      }
    }
  };

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
        UserName: userAddMain.Name.value,
        // OrganizationName: "test new flow org",
        Designation: userAddMain.Designation.value,
        MobileNumber: userAddMain.MobileNumber.value,
        UserEmail: userAddMain.Email.value,
        // OrganizationID: 471,
        isAdmin: userAddMain.isAdmin.value,
        FK_NumberWorldCountryID: userAddMain.FK_NumberWorldCountryID,
        OrganizationSelectedPackageID: userAddMain.PackageAssigned.value,
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
        value: "",
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
  const handleAdminChange = (isChecked) => {
    setUserAddMain((prevState) => ({
      ...prevState,
      isAdmin: {
        ...prevState.isAdmin,
        value: isChecked,
      },
    }));
  };

  // handle select for country Flag
  const handleSelect = (country) => {
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

  useEffect(() => {
    if (
      UserMangementReducer.organizationSelectedPakagesByOrganizationIDData &&
      Object.keys(
        UserMangementReducer.organizationSelectedPakagesByOrganizationIDData
      ).length > 0
    ) {
      let temp = [];
      UserMangementReducer.organizationSelectedPakagesByOrganizationIDData.organizationSelectedPackages.map(
        (data, index) => {
          temp.push({
            value: data.pK_PackageID,
            label: data.name,
          });
        }
      );
      setPackageAssignedOption(temp);
    }
  }, [UserMangementReducer.organizationSelectedPakagesByOrganizationIDData]);

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
          value: "",
          errorMessage: t("Please-select-a-package"),
          errorStatus: true,
        },
      });
    }
  };

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
                          4 of 9 Users
                        </Col>
                      </Row>
                      <Row className="d-flex justify-content-center">
                        <Col lg={8} md={8} sm={8} xs={12}>
                          <ProgressBar
                            now={5}
                            max={10}
                            className={styles["AddProgressBar"]}
                          />
                        </Col>
                      </Row>

                      {/* <Row>
                        <Col>
                          {UserMangementReducer.getOrganizationUserStatsGraph &&
                            UserMangementReducer.getOrganizationUserStatsGraph
                              .selectedPackages &&
                            UserMangementReducer.getOrganizationUserStatsGraph.selectedPackages.map(
                              (packages, index) => (
                                <>
                                  <Row key={index}>
                                    <Col
                                      lg={8}
                                      md={8}
                                      sm={8}
                                      xs={12}
                                      className=""
                                    >
                                      <label
                                        className={styles["labelChart-Title"]}
                                      >
                                        {packages.name}
                                      </label>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} xs={12}>
                                      <label
                                        className={styles["labelChart-Number"]}
                                      >
                                        {`${packages.allotedUsers} /${packages.headCount}`}
                                      </label>
                                    </Col>
                                    <div
                                      className={styles["borderLine-title"]}
                                    />
                                  </Row>
                                  <Row>
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
                                        {UserMangementReducer
                                          .getOrganizationUserStatsGraph
                                          .selectedPackages[index + 1]?.name ||
                                          ""}
                                      </label>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} xs={12}>
                                      <label
                                        className={
                                          styles["Admin-labelChart-Number"]
                                        }
                                      >
                                        {`${
                                          UserMangementReducer
                                            .getOrganizationUserStatsGraph
                                            .selectedPackages[index + 1]
                                            ?.allotedUsers || ""
                                        } / ${
                                          UserMangementReducer
                                            .getOrganizationUserStatsGraph
                                            .selectedPackages[index + 1]
                                            ?.headCount || ""
                                        }`}
                                      </label>
                                    </Col>
                                    <div
                                      className={styles["borderLine-title"]}
                                    />
                                  </Row>
                                  <Row>
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
                                        {UserMangementReducer
                                          .getOrganizationUserStatsGraph
                                          .selectedPackages[index + 2]?.name ||
                                          ""}
                                      </label>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} xs={12}>
                                      <label
                                        className={
                                          styles["Admin-labelChart-Number"]
                                        }
                                      >
                                        {`${
                                          UserMangementReducer
                                            .getOrganizationUserStatsGraph
                                            .selectedPackages[index + 2]
                                            ?.allotedUsers || ""
                                        } / ${
                                          UserMangementReducer
                                            .getOrganizationUserStatsGraph
                                            .selectedPackages[index + 2]
                                            ?.headCount || ""
                                        }`}
                                      </label>
                                    </Col>
                                  </Row>
                                </>
                              )
                            )}
                        </Col>
                      </Row> */}

                      <Row>
                        <Col>
                          {UserMangementReducer.getOrganizationUserStatsGraph?.selectedPackages?.map(
                            (packages, index) => {
                              if (
                                packages.name !== "Professional" &&
                                packages.name !== "Premium"
                              ) {
                                return (
                                  <Row key={index}>
                                    <Col
                                      lg={8}
                                      md={8}
                                      sm={8}
                                      xs={12}
                                      className=""
                                    >
                                      <label
                                        className={styles["labelChart-Title"]}
                                      >
                                        {packages.name}
                                      </label>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} xs={12}>
                                      <label
                                        className={styles["labelChart-Number"]}
                                      >
                                        {`${packages.allotedUsers} / ${packages.headCount}`}
                                      </label>
                                    </Col>
                                    <div
                                      className={styles["borderLine-title"]}
                                    />
                                  </Row>
                                );
                              }
                              return null;
                            }
                          )}

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
                      {t("Waqas-associates")}
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
                        value={userAddMain.isAdmin.value}
                        onChange={(e) => handleAdminChange(e.target.checked)}
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
                          userAddMain.PackageAssigned.value === ""
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
      </Container>
    </>
  );
};

export default AddUserMain;
