import React, { useEffect, useState } from "react";
import styles from "./PakageDetailsUserManagement.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../../../components/elements/loader/Loader";
import Card from "react-bootstrap/Card";
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
  cancelisTrailandSubscriptionApi,
  changeSelectPacakgeApi,
  getAllUserTypePackagesApi,
  LoginFlowRoutes,
  signUpFlowRoutes,
} from "../../../../store/actions/UserManagementActions";
import { calculateTotals } from "../../../../commen/functions/TableDataCalculation";

const PakageDetailsUserManagement = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const SignupPage = localStorage.getItem("SignupFlowPageRoute");
  const trialPage = localStorage.getItem("isTrial");
  let changePacakgeFlag = localStorage.getItem("changePacakgeFlag");

  const { UserMangementReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  //States
  const [tableData, setTableData] = useState([]);
  const [packageDetail, setPackageDetail] = useState([]);
  //get All user pakages Api call
  useEffect(() => {
    try {
      if (
        changePacakgeFlag !== null &&
        changePacakgeFlag !== undefined &&
        changePacakgeFlag
      ) {
        dispatch(getAllUserTypePackagesApi(navigate, t, true));
      } else {
        dispatch(getAllUserTypePackagesApi(navigate, t, false));
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, []);
  console.log("check error k");

  useEffect(() => {
    try {
      const pakageDetails = UserMangementReducer.getAllUserTypePackagesData;

      // Check if the package details object and its packages array exist and are not empty
      if (
        pakageDetails &&
        pakageDetails.packages &&
        pakageDetails.packages.length > 0
      ) {
        // Set package details state
        setPackageDetail(pakageDetails.packages);
        let newPackagesData = [];
        // Update table data by resetting the licenseCount to an empty string for each package
        pakageDetails.packages.forEach((packageData) => {
          newPackagesData.push({
            ...packageData,
            licenseCount: "",
          });
        });
        setTableData(newPackagesData);
      }
    } catch (error) {
      // Log any errors that occur
      console.log(error, "error");
    }
  }, [UserMangementReducer.getAllUserTypePackagesData]);

  //Fetching User headcounts data and set in the table
  useEffect(() => {
    if (UserMangementReducer.getAllSelectedPakagesData) {
      const { organizationSubscription } =
        UserMangementReducer.getAllSelectedPakagesData;

      if (
        organizationSubscription &&
        Array.isArray(organizationSubscription.organizationSelectedPackages)
      ) {
        organizationSubscription.organizationSelectedPackages.forEach(
          (packageData) => {
            setTableData((prevTableData) =>
              prevTableData.map((newData) => {
                if (newData.name === packageData.name) {
                  return {
                    ...newData,
                    licenseCount: String(packageData.headCount),
                  };
                }
                return newData;
              })
            );
          }
        );
      }
    }
  }, [UserMangementReducer.getAllSelectedPakagesData]);

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
        <span className='pakageselectionSpanUsermanagement'>
          {t("Package-details")}
        </span>
      ),
      width: 100,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (response) => {
        const { name } = calculateTotals(tableData);

        console.log("check error k", response);
        if (response?.isTotalRow) {
          return <span className={styles["ChargesPerLicesense"]}>{name}</span>;
        } else {
          return (
            <>
              <span className={styles["Tableheading"]}>{response?.name}</span>
            </>
          );
        }
      },
    },
    {
      title: (
        <span className='d-flex flex-column flex-wrap pakageselectionSpanUsermanagement'>
          {t("Charges-per")}
          <span className='pakageselectionSpanUsermanagement'>
            {t("License-US$")}
          </span>
        </span>
      ),
      dataIndex: "ChargesPerLisence",
      key: "ChargesPerLisence",
      width: 100,
      align: "center",
      render: (text, row) => {
        // Check if 'price' is available and greater than zero before rendering it
        if (row?.isTotalRow) {
          return;
        } else {
          return (
            <>
              <span className={styles["ChargesPerLicesense"]}>{row?.price}</span>
            </>
          );
        }
      },
    },
    {
      title: (
        <span className='d-flex flex-column flex-wrap pakageselectionSpanUsermanagement'>
          {t("Number")}
          <span className='pakageselectionSpanUsermanagement'>
            {t("of-licenses")}
          </span>
        </span>
      ),
      width: 100,
      dataIndex: "Numberoflicenses",
      key: "Numberoflicenses",
      align: "center",
      render: (row) => {
        const { Numberoflicenses } = calculateTotals(tableData);

        if (row?.shouldDisplayTextField) {
          return;
        } else {
          if (row?.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>
                {Numberoflicenses}
              </span>
            );
          } else {
            const handleChange = (newValue) => {
              const numericValue = newValue.replace(/\D/g, "");

              // Update state with numeric value
              const newData = tableData.map((item) => {
                return item?.pK_PackageID === row?.pK_PackageID
                  ? { ...item, licenseCount: numericValue }
                  : item;
              });
              setTableData(newData);
            };

            return (
              <Row>
                <Col className='d-flex justify-content-center'>
                  <TextField
                    labelclass='d-none'
                    applyClass='PakageDetails'
                    name='noofLisence'
                    maxLength={3}
                    value={row?.licenseCount}
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
        <span className='d-flex flex-column flex-wrap pakageselectionSpanUsermanagement'>
          {t("Monthly")}
          <span className='pakageselectionSpanUsermanagement'>
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "MonthCharges",
      key: "MonthCharges",
      width: 100,
      align: "center",
      render: (row) => {
        const { MonthCharges } = calculateTotals(tableData);
        const monthlyCharges =
          row?.price && row?.licenseCount ? row?.price * row?.licenseCount : 0;
        if (row?.shouldDisplayTextField) {
          return (
            <>
              <span className={styles["ButtonsArabicStylesSpan"]}>
                <Button
                  text={
                    changePacakgeFlag !== null &&
                    changePacakgeFlag !== undefined &&
                    changePacakgeFlag
                      ? t("Upgrade-now")
                      : t("Pay-now")
                  }
                  disableBtn={MonthCharges === 0 ? true : false}
                  className={styles["PayNowButtons"]}
                  onClick={() => handlePayNowClick(2)}
                />
              </span>
            </>
          );
        } else {
          if (row?.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>
                {MonthCharges}
              </span>
            );
          } else {
            return (
              <>
                <>
                  <span className={styles["ChargesPerLicesense"]}>
                    {monthlyCharges}
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
        <span className='d-flex flex-column flex-wrap pakageselectionSpanUsermanagement'>
          {t("Quarterly")}
          <span className='pakageselectionSpanUsermanagement'>
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "Quarterlycharges",
      key: "Quarterlycharges",
      align: "center",
      width: 100,
      render: (row) => {
        const { Quarterlycharges } = calculateTotals(tableData);

        const quarterlyCharges =
          row?.price && row?.licenseCount ? row?.price * row?.licenseCount * 3 : 0;
        if (row?.shouldDisplayTextField) {
          return (
            <>
              <span className={styles["ButtonsArabicStylesSpan"]}>
                <Button
                  text={
                    changePacakgeFlag !== null &&
                    changePacakgeFlag !== undefined &&
                    changePacakgeFlag
                      ? t("Upgrade-now")
                      : t("Pay-now")
                  }
                  disableBtn={Quarterlycharges === 0 ? true : false}
                  className={styles["PayNowButtons"]}
                  onClick={() => handlePayNowClick(3)}
                />
              </span>
            </>
          );
        } else {
          if (row?.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>
                {Quarterlycharges}
              </span>
            );
          } else {
            return (
              <>
                <span className={styles["ChargesPerLicesense"]}>
                  {quarterlyCharges}
                </span>
              </>
            );
          }
        }
      },
    },
    {
      title: (
        <span className='d-flex flex-column flex-wrap pakageselectionSpanUsermanagement'>
          {t("Yearly")}
          <span className='pakageselectionSpanUsermanagement'>
            {t("charges-in")}
          </span>
        </span>
      ),
      dataIndex: "YearlychargesTotal",
      key: "YearlychargesTotal",
      align: "center",
      width: 100,
      render: (row) => {
        const { YearlychargesTotal } = calculateTotals(tableData);

        const YearlyCharges =
          row?.price && row?.licenseCount ? row?.price * row?.licenseCount * 12 : 0;
        if (row?.shouldDisplayTextField) {
          return (
            <>
              <span className={styles["ButtonsArabicStylesSpan"]}>
                <Button
                  text={
                    changePacakgeFlag !== null &&
                    changePacakgeFlag !== undefined &&
                    changePacakgeFlag
                      ? t("Upgrade-now")
                      : t("Pay-now")
                  }
                  className={styles["PayNowButtons"]}
                  disableBtn={YearlychargesTotal === 0 ? true : false}
                  onClick={() => handlePayNowClick(1)}
                />
              </span>
            </>
          );
        } else {
          if (row?.isTotalRow) {
            return (
              <span className={styles["ChargesPerLicesense"]}>
                {YearlychargesTotal}
              </span>
            );
          } else {
            return (
              <>
                <span className={styles["ChargesPerLicesense"]}>
                  {YearlyCharges}
                </span>
              </>
            );
          }
        }
      },
    },
  ];

  //Pay Now B Button On Click
  const handlePayNowClick = (tenureOfSuscriptionID) => {
    let newArr = [];

    tableData.forEach((data, index) => {
      if (data?.licenseCount) {
        if (data?.licenseCount !== "") {
          newArr.push({
            PackageID: data?.pK_PackageID,
            HeadCount: Number(data.licenseCount),
          });
        }
      }
    });
    if (
      changePacakgeFlag !== null &&
      changePacakgeFlag !== undefined &&
      changePacakgeFlag
    ) {
      let requestData = {
        TenureOfSubscriptionID: Number(tenureOfSuscriptionID),
        Packages: newArr,
      };
      dispatch(
        changeSelectPacakgeApi(navigate, t, requestData, changePacakgeFlag)
      );
    } else {
      if (SignupPage) {
        let requestData = {
          TenureOfSubscriptionID: Number(tenureOfSuscriptionID),
          Packages: newArr,
        };
        localStorage.setItem(
          "packageSubscriptionDetail",
          JSON.stringify(requestData)
        );
        localStorage.setItem("SignupFlowPageRoute", 2);
        dispatch(signUpFlowRoutes(2));
        navigate("/Signup");
      } else if (Boolean(trialPage) === true) {
        let requestData = {
          TenureOfSubscriptionID: Number(tenureOfSuscriptionID),
          Packages: newArr,
        };
        dispatch(cancelisTrailandSubscriptionApi(navigate, t, requestData));
      } else {
        navigate("/Admin/PaymentFormUserManagement");
      }
    }
  };

  //For buttons default row flag
  const defaultRowWithButtons = {
    shouldDisplayTextField: true,
  };

  const showTotalValues = {
    isTotalRow: true,
  };

  //Handle Goback Function
  const onClickLink = () => {
    let token = localStorage.getItem("token");
    if (token == null) {
      dispatch(LoginFlowRoutes(1));
      localStorage.setItem("LoginFlowPageRoute", 1);
      navigate("/")
    } else {
      navigate("/Admin/subscriptionDetailsUserManagement");
    }
  };

  return (
    <Container>
      <Row>
        <Col sm={12} className='mt-4'>
          <h2
            className={`${"MontserratSemiBold"} ${
              styles["packageselection_heading"]
            }`}>
            {t("Diskus-pakage-details")}
          </h2>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12} className='d-flex justify-content-center'>
          <span className={styles["PerUserheading"]}>
            {t("Per-user-per-month-billed-annually")}
          </span>
        </Col>
      </Row>
      <Row className='mt-3 '>
        {packageDetail.length > 0 ? (
          packageDetail.map((data, index) => {
            return (
              <Col
                sm={12}
                lg={4}
                md={4}
                className={index === 1 && index === 3 ? "p-0" : "my-2"}>
                <Row className='g-4'>
                  <Col sm={12} className={styles["packageCardBox"]}>
                    <Card className={styles["packagecard"]}>
                      <Row className='mt-3'>
                        <Col sm={12}>
                          <>
                            <span className={styles["package_title"]}>
                              <p title={data.name}>{data.name}</p>
                            </span>{" "}
                          </>
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col sm={false} md={2} lg={2}></Col>
                        <Col sm={12} md={8} lg={8}>
                          <div className={styles["packagecard_pricebox"]}>
                            <span className={styles["package_actualPrice"]}>
                              ${data?.price}/
                              <p className={styles["package_actualPrice_p"]}>
                                {t("Month")}
                              </p>
                            </span>
                          </div>
                        </Col>
                        <Col sm={false} md={2} lg={2}></Col>
                      </Row>{" "}
                      <Row className='mt-3'>
                        {" "}
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col lg={11} md={11} sm={11} xs={12}>
                          <span className={styles["MeetingHeading"]}>
                            {t("Meeting")}
                          </span>
                        </Col>
                      </Row>
                      <Row className='mt-2'>
                        <section
                          className={styles["Scroller_PakagesSelectionCard"]}>
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
                                        className='d-flex flex-column flex-wrap gap-3 mt-1'>
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
      <Row className='mt-4'>
        <Col lg={12} md={12} sm={12} className='d-flex justify-content-center'>
          <span className={styles["BillingHeading"]}>
            {t("Billing-calculator")}
          </span>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col lg={12} md={12} sm={12}>
          <TableToDo
            column={ColumnsPakageSelection}
            className={"Billing_TablePakageSelection"}
            rows={[...tableData, showTotalValues, defaultRowWithButtons]}
            pagination={false}
            id='PakageDetailsTable'
            rowHoverBg='none'
          />
        </Col>
      </Row>
      <>
        {SignupPage ? (
          <>
            <Row className='mt-3 mb-3'>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-center'>
                <span onClick={onClickLink} className={styles["signUp_goBack"]}>
                  {t("Go-back")}
                </span>
              </Col>
            </Row>
          </>
        ) : null}
      </>
      {UserMangementReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </Container>
  );
};

export default PakageDetailsUserManagement;
