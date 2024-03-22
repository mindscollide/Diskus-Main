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

const AddUserMain = () => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

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
      groupWidth: "95%",
    },
  };

  const data = [
    ["Category", "Value"],
    ["Enabled User", 50],
    ["Disabled User", 30],
    ["Locked User", 80],
    ["Dorment User", 60],
  ];

  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary == country;
    });
  };

  return (
    <>
      <Container>
        {/* <Paper className={styles["papercolor-adduser"]}> */}
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
                        data={data}
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
                          {t("4-of-9-Users")}
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
                            {t("Board-member")}
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
                            {t("Admin-member")}
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
                            {t("Client-member")}
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
            style={{ marginTop: "10px" }}
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
                      placeholder={t("Name")}
                      maxLength={200}
                      applyClass="form-control2"
                    />
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
                      <span className={styles["aesterick-color"]}> *</span>
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
                      <span className={styles["aesterick-color"]}> *</span>
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
                      placeholder={t("Designation")}
                      maxLength={200}
                      applyClass="form-control2"
                    />
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
                          name="MobileNumber"
                        />
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
                  </Col>

                  <Col lg={6} md={6} sm={6}>
                    <label className={styles["label-styling"]}>
                      {t("Email")}{" "}
                      <span className={styles["aesterick-color"]}> *</span>
                    </label>
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      name="Name"
                      placeholder={t("Name")}
                      maxLength={200}
                      applyClass="form-control2"
                    />
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
                    ></Button>
                    <Button
                      className={styles["Add-User-Create"]}
                      text={t("Create")}
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
