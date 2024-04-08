import React, { useEffect, useState } from "react";
import styles from "./PakageDetailsUserManagement.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../../../components/elements/loader/Loader";
import Card from "react-bootstrap/Card";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Button,
  TableToDo,
  TextField,
  Notification,
} from "../../../../components/elements";
import {
  LoginFlowRoutes,
  getAllUserTypePackagesApi,
} from "../../../../store/actions/UserManagementActions";
import { render } from "@testing-library/react";
import { regexOnlyNumbers } from "../../../../commen/functions/regex";
const PakageDetailsUserManagement = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { UserMangementReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  //States
  const [tableData, setTableData] = useState([]);
  const [lisence, setlisence] = useState({
    TotalLisence: "",
  });
  const [packageDetail, setPackageDetail] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  //get All user pakages Api call
  useEffect(() => {
    try {
      dispatch(getAllUserTypePackagesApi(navigate, t));
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  //Fetching the data for pakage selection
  useEffect(() => {
    try {
      if (UserMangementReducer.getAllUserTypePackagesData !== []) {
        setPackageDetail(
          UserMangementReducer.getAllUserTypePackagesData.packages
        );
        setTableData(UserMangementReducer.getAllUserTypePackagesData.packages);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [UserMangementReducer.getAllUserTypePackagesData]);

  // translate Languages start
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

  const ColumnsPakageSelection = [
    {
      title: (
        <span className="pakageselectionSpanUsermanagement">
          {t("Pakage-details")}
        </span>
      ),
      width: 100,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, response) => {
        return (
          <>
            <span className={styles["Tableheading"]}>{response.name}</span>
          </>
        );
      },
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Charges-per")}
          <span className="pakageselectionSpanUsermanagement">
            {t("License-US$")}
          </span>
        </span>
      ),
      dataIndex: "price",
      key: "price",
      width: 100,
      align: "center",
      render: (text, response) => {
        return (
          <>
            <span className={styles["ChargesPerLicesense"]}>
              {response.price}
            </span>
          </>
        );
      },
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Number")}
          <span className="pakageselectionSpanUsermanagement">
            {t("of-licenses")}
          </span>
        </span>
      ),
      width: 100,
      dataIndex: "Numberoflicenses",
      key: "Numberoflicenses",
      align: "center",
      render: (text, row) => {
        if (row.shouldDisplayTextField) {
          return;
        } else {
          if (row.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>
                {row.Numberoflicenses}
              </span>
            );
          } else {
            const handleChange = (newValue) => {
              const newData = tableData.map((item) => {
                console.log(item, "itemitem");
                if (item.pK_PackageID === row.pK_PackageID) {
                  return { ...item, licenseCount: newValue };
                }
                return item;
              });
              setTableData(newData);
            };

            return (
              <Row>
                <Col className="d-flex justify-content-center">
                  <TextField
                    labelClass="d-none"
                    applyClass="PakageDetails"
                    name="noofLisence"
                    value={row.licenseCount || ""}
                    change={(e) => handleChange(e.target.value)}
                  />
                </Col>
              </Row>
            );
          }
        }
      },
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Monthly")}
          <span className="pakageselectionSpanUsermanagement">
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "Monthlycharges",
      key: "Monthlycharges",
      width: 100,
      align: "center",
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Quarterly")}
          <span className="pakageselectionSpanUsermanagement">
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "Quarterlycharges",
      key: "Quarterlycharges",
      align: "center",
      width: 100,
    },
    {
      title: (
        <span className="d-flex flex-column flex-wrap pakageselectionSpanUsermanagement">
          {t("Yearly")}
          <span className="pakageselectionSpanUsermanagement">
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "Yearlycharges",
      key: "Yearlycharges",
      align: "center",
      width: 100,
    },
  ];

  const defaultRow = {
    Pakagedetails: <span className={styles["TableheadingTotal"]}>Total</span>,
    Numberoflicenses: <span className={styles["ChargesPerLicesense"]}>43</span>,
    Monthlycharges: (
      <span className={styles["ChargesPerLicesense"]}>5,786</span>
    ),
    Quarterlycharges: (
      <span className={styles["ChargesPerLicesense"]}>2,718</span>
    ),
    Yearlycharges: <span className={styles["ChargesPerLicesense"]}>3,072</span>,
  };

  console.log(lisence.TotalLisence, "TotalLisence");

  const handlePayNowClick = () => {
    localStorage.setItem("signupCurrentPage", 2);
    navigate("/Signup");
  };

  const defaultRowWithButtons = {
    Monthlycharges: (
      <>
        <span className={styles["ButtonsArabicStylesSpan"]}>
          <Button
            text={t("Pay-now")}
            className={styles["PayNowButtons"]}
            onClick={handlePayNowClick}
          />
        </span>
      </>
    ),
    Quarterlycharges: (
      <>
        <span className={styles["ButtonsArabicStylesSpan"]}>
          <Button
            text={t("Pay-now")}
            className={styles["PayNowButtons"]}
            onClick={handlePayNowClick}
          />
        </span>
      </>
    ),
    Yearlycharges: (
      <>
        <span className={styles["ButtonsArabicStylesSpan"]}>
          <Button
            text={t("Pay-now")}
            className={styles["PayNowButtons"]}
            onClick={handlePayNowClick}
          />
        </span>
      </>
    ),
    shouldDisplayTextField: true,
  };

  //Calculating the totals

  const calculateTotals = (data) => {
    const totalLicenses = tableData.reduce(
      (total, row) => total + (Number(row.licenseCount) || 0),
      0
    );

    // Return an object with the totals that can be used as a row in your table.
    return {
      name: "Total",
      Numberoflicenses: totalLicenses,
    };
  };
  const totalRow = {
    ...calculateTotals(tableData),
    isTotalRow: true,
  };
  //Handle Goback Function
  const onClickLink = () => {
    localStorage.removeItem("signupCurrentPage", 1);
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
    navigate("/");
  };

  return (
    <Container>
      <Row className="position-relative">
        <Col className={styles["languageSelector"]}>
          <LanguageSelector />
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="mt-4">
          <h2
            className={`${"MontserratSemiBold"} ${
              styles["packageselection_heading"]
            }`}
          >
            {t("Diskus-pakage-details")}
          </h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-center">
          <span className={styles["PerUserheading"]}>
            {t("Per-user-per-month-billed-annually")}
          </span>
        </Col>
      </Row>
      <Row className="mt-3 ">
        {packageDetail.length > 0 ? (
          packageDetail.map((data, index) => {
            return (
              <Col
                sm={12}
                lg={4}
                md={4}
                className={index === 1 && index === 3 ? "p-0" : "my-2"}
              >
                <Row className="g-4">
                  <Col sm={12} className={styles["packageCardBox"]}>
                    <Card className={styles["packagecard"]}>
                      <Row className="mt-3">
                        <Col sm={12}>
                          <>
                            <span className="icon-star package-icon-style">
                              <span
                                className="path1"
                                // style={{ color: packageColorPath1 }}
                              ></span>
                              <span
                                className="path2"
                                // style={{ color: packageColorPath2 }}
                              ></span>
                              <span
                                className="path3"
                                // style={{ color: packageColorPath2 }}
                              ></span>
                            </span>
                            <span className={styles["package_title"]}>
                              {/* {t("Gold")} */}
                              {/* {data.PackageName} */}
                              {data.name}
                            </span>{" "}
                          </>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col sm={false} md={2} lg={2}></Col>
                        <Col sm={12} md={8} lg={8}>
                          <div className={styles["packagecard_pricebox"]}>
                            <span className={styles["package_actualPrice"]}>
                              ${data.price}/
                              <p className={styles["package_actualPrice_p"]}>
                                {t("Month")}
                              </p>
                            </span>
                          </div>
                        </Col>
                        <Col sm={false} md={2} lg={2}></Col>
                      </Row>{" "}
                      <Row className="mt-3">
                        {" "}
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col lg={11} md={11} sm={11} xs={12}>
                          <span className={styles["MeetingHeading"]}>
                            {t("Meeting")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <section
                          className={styles["Scroller_PakagesSelectionCard"]}
                        >
                          {data.packageFeatures !== null &&
                          data.packageFeatures !== undefined
                            ? data.packageFeatures.map((features, index) => {
                                return (
                                  <>
                                    <Row>
                                      <Col lg={1} md={1} sm={1}></Col>
                                      <Col
                                        lg={11}
                                        md={11}
                                        sm={11}
                                        className="d-flex flex-column flex-wrap gap-3 mt-1"
                                      >
                                        <span className={styles["keypoints"]}>
                                          {features.name}
                                        </span>
                                      </Col>
                                    </Row>
                                  </>
                                );
                              })
                            : null}
                        </section>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Col>
            );
          })
        ) : (
          <Loader />
        )}
      </Row>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span className={styles["BillingHeading"]}>
            {t("Billing-calculator")}
          </span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <TableToDo
            column={ColumnsPakageSelection}
            className={"Billing_TablePakageSelection"}
            rows={[...tableData, totalRow, defaultRowWithButtons]}
            pagination={false}
            id="saif"
            rowHoverBg="none"
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span onClick={onClickLink} className={styles["signUp_goBack"]}>
            {t("Go-back")}
          </span>
        </Col>
      </Row>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {UserMangementReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </Container>
  );
};

export default PakageDetailsUserManagement;
