import React, { useEffect, useState } from "react";
import styles from "./PackageDetailsUMUpgrade.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../../../../components/elements/loader/Loader";
import Card from "react-bootstrap/Card";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Button,
  Notification,
  TableToDo,
  TextField,
} from "../../../../../components/elements";
import {
  getAllUserTypePackagesApi,
  LoginFlowRoutes,
} from "../../../../../store/actions/UserManagementActions";
const PakageDetailsUMUpgrade = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { UserMangementReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  //States
  const [tableData, setTableData] = useState([]);
  const [packageTableData, setPackageTableData] = useState([]);
  const [lisence, setlisence] = useState({
    TotalLisence: "",
  });
  const [packageDetail, setPackageDetail] = useState([]);
  console.log(packageDetail, "packageDetailpackageDetail");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const [organizationPackagePrice, setOrganizationPackagePrice] = useState([]);
  console.log(organizationPackagePrice, "organizationPackagePrice");

  //get All user pakages Api call
  useEffect(() => {
    try {
      dispatch(getAllUserTypePackagesApi(navigate, t));
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  useEffect(() => {
    // Check if organizationSelectedPackages are present in the location state
    if (location.state && location.state.organizationSelectedPackages) {
      const selectedPackages = location.state.organizationSelectedPackages;
      const prices = selectedPackages.map((packages) => packages.price); // Extract prices from packages
      setOrganizationPackagePrice(prices);
      const newData = selectedPackages.map((packages) => ({
        name: packages.name,
        price: packages.price,
        ...packages,
      }));
      setPackageTableData(newData);
    } else {
      setPackageTableData([]);
    }
  }, [location.state]);

  //Fetching the data for pakage selection
  useEffect(() => {
    try {
      const pakageDetails = UserMangementReducer.getAllUserTypePackagesData;
      if (
        pakageDetails &&
        pakageDetails.packages &&
        pakageDetails.packages.length > 0
      ) {
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
        // Check if 'price' is available and greater than zero before rendering it
        if (response.isTotalRow) {
          return;
        } else {
          return (
            <>
              <span className={styles["ChargesPerLicesense"]}>
                {response.price}
              </span>
            </>
          );
        }
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
      render: (text, row, index) => {
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
              if (newValue === "" || /^\d+$/.test(newValue)) {
                const newData = tableData.map((item, i) => {
                  if (i === index) {
                    // Check if the index matches the current row
                    return { ...item, licenseCount: newValue };
                  }
                  return item;
                });
                console.log(newData, "newDatanewData");
                setTableData(newData);
              }
            };
            const priceValue = organizationPackagePrice[index] || "";
            console.log(priceValue, "priceValueeeee");
            return (
              <Row>
                <Col className="d-flex justify-content-center">
                  <TextField
                    labelClass="d-none"
                    applyClass="PakageDetails_UMUpgrade"
                    name="noofLisence"
                    maxLength={3}
                    value={Number(priceValue)}
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
      dataIndex: "price",
      key: "price",
      width: 100,
      align: "center",
      render: (text, row, index) => {
        console.log(row, "Monthlycharges");
        const monthlyCharges =
          row.price &&
          !isNaN(row.price) &&
          !isNaN(organizationPackagePrice[index])
            ? row.price * Number(organizationPackagePrice[index])
            : 0;
        console.log(monthlyCharges, "licenseCount");
        if (row.shouldDisplayTextField) {
          return (
            <>
              <span className={styles["ButtonsArabicStylesSpan"]}>
                <Button
                  text={t("Pay-now")}
                  className={styles["PayNowButtons"]}
                  // onClick={handlePayNowClick}
                />
              </span>
            </>
          );
        } else {
          if (row.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>{text}</span>
            );
          } else {
            return (
              <>
                <>
                  <span className={styles["ChargesPerLicesense"]}>
                    {Number(monthlyCharges)}
                  </span>
                </>
              </>
            );
          }
        }
      },
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
      render: (text, row, index) => {
        const quarterlyCharges =
          row.price &&
          !isNaN(row.price) &&
          !isNaN(organizationPackagePrice[index])
            ? row.price * Number(organizationPackagePrice[index]) * 3
            : 0;
        if (row.shouldDisplayTextField) {
          return (
            <>
              <span className={styles["ButtonsArabicStylesSpan"]}>
                <Button
                  text={t("Pay-now")}
                  className={styles["PayNowButtons"]}
                  // onClick={handlePayNowClick}
                />
              </span>
            </>
          );
        } else {
          if (row.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>{text}</span>
            );
          } else {
            return (
              <>
                <span className={styles["ChargesPerLicesense"]}>
                  {Number(quarterlyCharges)}
                </span>
              </>
            );
          }
        }
      },
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
      dataIndex: "YearlychargesTotal",
      key: "YearlychargesTotal",
      align: "center",
      width: 100,
      render: (text, row, index) => {
        const YearlyCharges =
          row.price &&
          !isNaN(row.price) &&
          !isNaN(organizationPackagePrice[index])
            ? row.price * Number(organizationPackagePrice[index]) * 12
            : 0;
        if (row.shouldDisplayTextField) {
          return (
            <>
              <span className={styles["ButtonsArabicStylesSpan"]}>
                <Button
                  text={t("Pay-now")}
                  className={styles["PayNowButtons"]}
                  // onClick={handlePayNowClick}
                />
              </span>
            </>
          );
        } else {
          if (row.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>{text}</span>
            );
          } else {
            return (
              <>
                <span className={styles["ChargesPerLicesense"]}>
                  {Number(YearlyCharges)}
                </span>
              </>
            );
          }
        }
      },
    },
  ];

  //Pay Now B Button On Click
  const handlePayNowClick = () => {
    localStorage.setItem("signupCurrentPage", 2);
    navigate("/Signup");
  };

  //For buttons default row flag
  const defaultRowWithButtons = {
    shouldDisplayTextField: true,
  };

  //Calculating the totals
  const calculateTotals = (data) => {
    const totalOrganizationPackagePrice = organizationPackagePrice.reduce(
      (total, value) => total + Number(value || 0),
      0
    );

    // Calculate total monthly charges
    const totalMonthlyCharges = data.reduce((total, row, index) => {
      const monthlyCharge =
        row.price &&
        !isNaN(row.price) &&
        !isNaN(organizationPackagePrice[index])
          ? row.price * Number(organizationPackagePrice[index])
          : 0;
      return total + monthlyCharge;
    }, 0);

    const totalQuarterlyCharges = data.reduce((total, row, index) => {
      const quarterlyCharge =
        row.price &&
        !isNaN(row.price) &&
        !isNaN(organizationPackagePrice[index])
          ? row.price * Number(organizationPackagePrice[index]) * 3
          : 0; // Multiply by 3 for quarterly
      return total + quarterlyCharge;
    }, 0);

    const totalYearlyCharges = data.reduce((total, row, index) => {
      const yearlyCharge =
        row.price &&
        !isNaN(row.price) &&
        !isNaN(organizationPackagePrice[index])
          ? row.price * Number(organizationPackagePrice[index]) * 12
          : 0; // Multiply by 12 for yearly
      return total + yearlyCharge;
    }, 0);

    // Return an object with the totals that can be used as a row in your table.
    return {
      name: "Total",
      Numberoflicenses: Number(totalOrganizationPackagePrice),
      price: Number(totalMonthlyCharges),
      Quarterlycharges: Number(totalQuarterlyCharges),
      YearlychargesTotal: Number(totalYearlyCharges),
    };
  };

  //Total row Flag
  const totalRow = {
    ...calculateTotals(tableData),
    isTotalRow: true,
  };

  //Handle Goback Function
  const onClickLink = () => {
    navigate("/Admin/PackageDetailsUserManagement");
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
        {packageDetail && packageDetail?.length > 0 ? (
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
                            {/* <span className="icon-star package-icon-style">
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
                            </span> */}
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

export default PakageDetailsUMUpgrade;
