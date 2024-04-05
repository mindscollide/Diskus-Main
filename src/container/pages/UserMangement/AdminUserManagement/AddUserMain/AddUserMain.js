import React, { useState, useRef, useEffect } from "react";
import styles from "./AddUserMain.module.css";
import { useSelector, useDispatch } from "react-redux";
import { FormControl } from "react-bootstrap";
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
import {
  Button,
  Notification,
  Modal,
  Loader,
  Subscriptionwarninglimit,
} from "../../../../../components/elements";
import { countryNameforPhoneNumber } from "../../../../Admin/AllUsers/AddUser/CountryJson";
import { validateEmailEnglishAndArabicFormat } from "../../../../../commen/functions/validations";
import { getOrganizationPackageUserStatsAPI } from "../../../../../store/actions/UserManagementActions";

const AddUserMain = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { UserMangementReducer } = useSelector((state) => state);
  console.log(
    UserMangementReducer.getOrganizationUserStatsGraph,
    "getOrganizationUserStatsGraph"
  );

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});
  const [graphData, setGraphData] = useState([]);

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
  });

  //For Now I set static data in this getOrganizationPackageUserStatsAPI Api
  useEffect(() => {
    let data = {
      OrganizationID: 471,
      RequestingUserID: 1096,
    };
    dispatch(getOrganizationPackageUserStatsAPI(navigate, t, data));
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

  const handleCreate = () => {
    if (
      userAddMain.Name.value !== "" &&
      userAddMain.Designation.value !== "" &&
      userAddMain.MobileNumber.value !== "" &&
      userAddMain.PackageAssigned.value !== "" &&
      userAddMain.Email.value !== ""
    ) {
      alert("filled fields");
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

      Email: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
    });
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

  // const data = [
  //   // ["Category", "Value"],
  //   ["Element", "Users", { role: "style" }, { role: "annotation" }],
  //   ["Enabled Users", 50, "#6172D6", "50"],
  //   ["Disabled Users", 30, "#6172D6", "30"],
  //   ["Locked Users", 80, "#6172D6", "80"],
  //   ["Dormant Users", 60, "#6172D6", "60"],
  // ];

  // useEffect to set data in graph
  useEffect(() => {
    if (
      UserMangementReducer.getOrganizationUserStatsGraph !== null &&
      UserMangementReducer.getOrganizationUserStatsGraph !== undefined &&
      Object.keys(UserMangementReducer.getOrganizationUserStatsGraph).length > 0
    ) {
      const data = [
        // ["Category", "Value"],
        ["Element", "Users", { role: "style" }, { role: "annotation" }],
        [
          "Enabled Users",
          parseInt(
            UserMangementReducer.getOrganizationUserStatsGraph.enabledUsers
          ),
          "#6172D6",
          UserMangementReducer.getOrganizationUserStatsGraph.enabledUsers.toString(),
          ,
        ],
        [
          "Disabled Users",
          parseInt(
            UserMangementReducer.getOrganizationUserStatsGraph.disabledUsers
          ),
          "#6172D6",
          UserMangementReducer.getOrganizationUserStatsGraph.disabledUsers.toString(),
        ],
        [
          "Locked Users",
          parseInt(
            UserMangementReducer.getOrganizationUserStatsGraph.lockedUsers
          ),
          "#6172D6",
          UserMangementReducer.getOrganizationUserStatsGraph.lockedUsers.toString(),
          ,
        ],
        [
          "Dormant Users",
          parseInt(
            UserMangementReducer.getOrganizationUserStatsGraph.dormantUsers
          ),
          "#6172D6",
          UserMangementReducer.getOrganizationUserStatsGraph.dormantUsers.toString(),
        ],
      ];
      setGraphData(data);
    }
  }, [UserMangementReducer.getOrganizationUserStatsGraph]);

  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary == country;
    });
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
                      <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="250px"
                        radius={10}
                        data={graphData}
                        options={options}
                        className={styles["Addchart"]}
                      />
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

                      <Row>
                        <Col lg={8} md={8} sm={8} xs={12} className="">
                          <label className={styles["labelChart-Title"]}>
                            {t("Essential")}
                          </label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                          <label className={styles["labelChart-Number"]}>
                            {t("1/3")}
                          </label>
                        </Col>
                        <div className={styles["borderLine-title"]} />
                      </Row>
                      <Row>
                        <Col lg={8} md={8} sm={8} xs={12} className="">
                          <label className={styles["Admin-labelChart-Title"]}>
                            {t("Professional")}
                          </label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                          <label className={styles["Admin-labelChart-Number"]}>
                            {t("1/2")}
                          </label>
                        </Col>
                        <div className={styles["borderLine-title"]} />
                      </Row>
                      <Row>
                        <Col lg={8} md={8} sm={8} xs={12} className="">
                          <label
                            className={styles["Admin-labelChart-Title"]}
                            // className={styles["labelChart-Remain-Title"]}
                          >
                            {t("Premium")}
                          </label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={12}>
                          <label
                            // className={styles["labelChart-RemainNum"]}
                            className={styles["Admin-labelChart-Number"]}
                          >
                            {t("2/4")}
                          </label>
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
                      <Checkbox />
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
                    <Select />
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
