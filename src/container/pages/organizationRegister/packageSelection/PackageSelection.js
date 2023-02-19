import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PackageCards from "../../../../components/elements/packageselection/PackageCards";
import SilverPackage from "./../../../../assets/images/Silver-Package.png";
import GoldPackage from "./../../../../assets/images/Gold-Package.png";
import PremiumPackage from "./../../../../assets/images/Premium-Package.png";
import styles from "./PackageSelection.module.css";
import Button from "../../../../components/elements/button/Button";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import PackageCardRibbon from "../../../../assets/images/newElements/PackageCardRibbon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  cleareMessageSubsPac,
  getSubscriptionDetails,
} from "../../../../store/actions/GetSubscriptionPackages";
import Loader from "../../../../components/elements/loader/Loader";
import {
  cleareMessage,
  organizationPackageReselection,
  setLoader,
} from "../../../../store/actions/Auth2_actions";
import { Notification } from "../../../../components/elements";
const PackageSelection = () => {
  const navigate = useNavigate();
  const { GetSubscriptionPackage, Authreducer } = useSelector((state) => state);
  console.log(
    "GetSubscriptionPackageGetSubscriptionPackage",
    GetSubscriptionPackage
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const { t, i18n } = useTranslation();
  const [currentPackageId, setCurrentPackageId] = useState(0);
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const [monthlyPackageShow, setMonthlyPackageShow] = useState(true);
  const [packageDetail, setPackageDetail] = useState([
    {
      PackageName: "",
      PackageID: 0,
      MontlyPackageAmount: 0,
      AnnuallyPackageAmount: 0,
      BoardMembers: 0,
      AdminMembers: 0,
      PackageDescription: "",
      PackageBadgeColor: "",
      PackageAnuallyDiscountAmount: 0,
      PackageVisibility: false,
    },
  ]);
  const handleManualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    setAnnualPackageShow(false);
    setMonthlyPackageShow(true);
  };

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  let currentLanguage = localStorage.getItem("i18nextLng");

  // translate Languages end

  const handleAnnualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    console.log(packageId);
    setAnnualPackageShow(true);
    setMonthlyPackageShow(false);
  };

  let flagForSelectedPackeg = localStorage.getItem("flagForSelectedPackeg");

  const handleClickPackage = (id) => {
    localStorage.setItem("PackageID", JSON.parse(id));
    if (flagForSelectedPackeg != undefined) {
      // dispatch(setLoader(true));
      dispatch(organizationPackageReselection(id, navigate, t));
    } else {
      dispatch(setLoader(true));
      navigate("/signuporganization");
    }
  };

  const calculateAnnuallyPrice = (ActualPrice, YearlyDiscountPercentage) => {
    let calculateAnnuallyPerAmount =
      (ActualPrice * 12 * YearlyDiscountPercentage) / 100;
    let calculateActualYearlyAmount = ActualPrice * 12;
    let annuallyAmount =
      calculateActualYearlyAmount - calculateAnnuallyPerAmount;
    return annuallyAmount.toFixed() / 12;
  };

  useEffect(() => {
    dispatch(getSubscriptionDetails(t));
  }, []);

  useEffect(() => {
    if (GetSubscriptionPackage.PackageDetails.length > 0) {
      let packageData = [];
      GetSubscriptionPackage.PackageDetails.map((data, index) => {
        console.log(data, "Datadatadata");
        packageData.push({
          PackageID: data.pK_SubscriptionPackageID,
          PackageName: data.packageName,
          MontlyPackageAmount: data.packageActualPrice,
          AnnuallyPackageAmount: data.yearlyPurchaseDiscountPercentage,
          BoardMembers: data.packageAllowedBoardMemberUsers,
          AdminMembers: data.packageAllowedAdminUsers,
          PackageDescription: data.packageDescriptiveDetails,
          PackageBadgeColor: data.badgeColor,
          PackageVisibility: data.isPackageActive,
          PackageAnuallyDiscountAmount: calculateAnnuallyPrice(
            data.packageActualPrice,
            data.yearlyPurchaseDiscountPercentage
          ).toFixed(2),
        });
        if (index === 0) {
          setCurrentPackageId(data.pK_SubscriptionPackageID);
        }
      });

      setPackageDetail(packageData);
    }
  }, [GetSubscriptionPackage]);

  useEffect(() => {
    console.log("currentLocale", GetSubscriptionPackage.ResponseMessage);
    console.log("currentLocale", GetSubscriptionPackage.ResponseMessage !== "");
    if (
      GetSubscriptionPackage.ResponseMessage !== "" &&
      GetSubscriptionPackage.ResponseMessage !== undefined &&
      GetSubscriptionPackage.ResponseMessage !== t("Record-found")
    ) {
      setOpen({
        open: true,
        message: GetSubscriptionPackage.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);
      dispatch(cleareMessageSubsPac());
    } else {
      dispatch(cleareMessageSubsPac());
    }
  }, [GetSubscriptionPackage.ResponseMessage]);

  useEffect(() => {
    if (
      Authreducer.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.VerifyOTPEmailResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      Authreducer.EnterPasswordResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EnterPasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      Authreducer.OrganizationCreateResponseMessage !== "" &&
      Authreducer.OrganizationCreateResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      Authreducer.CreatePasswordResponseMessage !== "" &&
      Authreducer.CreatePasswordResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.CreatePasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      Authreducer.GetSelectedPackageResponseMessage !== "" &&
      Authreducer.GetSelectedPackageResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.GetSelectedPackageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      Authreducer.EmailValidationResponseMessage !== "" &&
      Authreducer.EmailValidationResponseMessage !== t("Record-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EmailValidationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);
  return (
    <>
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <select
              className={styles["Package-select-language"]}
              onChange={handleChangeLocale}
              value={language}
            >
              {languages.map(({ name, code }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="mt-4">
            <h2
              className={`${"MontserratSemiBold"} ${
                styles["packageselection_heading"]
              }`}
            >
              Select Package
            </h2>
          </Col>
        </Row>
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles["packageselection_bar"]}
          >
            enjoy extra discount on first annual subscription
          </Col>
        </Row>
        <Row className="mt-3 p-0">
          {packageDetail.length > 0 ? (
            packageDetail.map((data, index) => {
              console.log(data, "PackageData");
              return (
                <Col
                  sm={12}
                  lg={4}
                  md={4}
                  className="my-2"
                  key={data.pK_SubscriptionPackageID}
                >
                  <Row className="g-4">
                    <Col sm={12}>
                      <Card className={styles["packagecard"]}>
                        <Row>
                          <Col sm={12}>
                            {data.PackageName === "gold" ? (
                              <>
                                <img
                                  className={styles["package-icon"]}
                                  src={GoldPackage}
                                  alt=""
                                />
                                <h4 className={styles["package_title"]}>
                                  {data.PackageName}
                                </h4>{" "}
                              </>
                            ) : data.PackageName === "basic" ? (
                              <>
                                {" "}
                                <img
                                  className={styles["package-icon"]}
                                  src={SilverPackage}
                                  alt=""
                                />
                                <h4 className={styles["package_title"]}>
                                  {data.PackageName}
                                </h4>{" "}
                              </>
                            ) : data.PackageName === "premium" ? (
                              <>
                                <img
                                  className={styles["package-icon"]}
                                  src={PremiumPackage}
                                  alt=""
                                />
                                <h4 className={styles["package_title"]}>
                                  {data.PackageName}
                                </h4>{" "}
                              </>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="my-0">
                          <Col sm={false} md={2} lg={2}></Col>
                          <Col sm={12} md={8} lg={8} className={"m-1"}>
                            <div className={monthlyPackageShow
                                    ? `${styles["packagecard_pricebox"]}`
                                    : currentPackageId === data.PackageID
                                    ? `${styles["packagecard_pricebox_Active"]}`
                                    : `${styles["packagecard_pricebox"]}`}>
                              <h4
                                className={
                                  monthlyPackageShow
                                    ? `${styles["package_actualPrice"]}`
                                    : currentPackageId === data.PackageID
                                    ? `${styles["package_actualPrice_active"]}`
                                    : `${styles["package_actualPrice"]}`
                                }
                              >
                                ${data.MontlyPackageAmount}/
                                <p className={styles["package_actualPrice_p"]}>
                                  {t("Month")}
                                </p>
                              </h4>
                            </div>
                          </Col>
                          <Col sm={false} md={2} lg={2}></Col>
                        </Row>
                        <Row>
                          <Col sm={false} md={2} lg={2}></Col>
                          <Col sm={12} md={8} lg={8} className={"m-1"}>
                            <div className="d-flex">
                              <span
                                className={
                                  monthlyPackageShow
                                    ? `${styles["spanActive"]}`
                                    : monthlyPackageShow &&
                                      currentPackageId === data.PackageID
                                    ? `${styles["spanActive"]}`
                                    : monthlyPackageShow &&
                                      currentPackageId === data.PackageID
                                    ? `${styles["spanActive"]}`
                                    : `${styles["span-formontly"]}`
                                }
                                onClick={() =>
                                  handleManualPackage(data.PackageID)
                                }
                              >
                                {t("Monthly")}
                              </span>
                              <span
                                className={
                                  annualPackageShow &&
                                  currentPackageId === data.PackageID
                                    ? `${styles["spanActive"]}`
                                    : `${styles["span-foranually"]}`
                                }
                                onClick={() =>
                                  handleAnnualPackage(data.PackageID)
                                }
                              >
                                {t("Annually")}
                              </span>
                            </div>
                          </Col>
                          <Col sm={false} md={2} lg={2}></Col>
                        </Row>
                        <Row>
                          <Col sm={false} md={2} lg={2}></Col>
                          <Col sm={12} md={8} lg={8} className="m-1">
                            <div
                              className={
                                annualPackageShow &&
                                currentPackageId === data.PackageID
                                  ? `${styles["packagecard_two"]} `
                                  : ` ${styles["packagecard_two_visible"]} `
                              }
                            >
                              <Col
                                className={styles["packagecard_disoucntprice"]}
                              >
                                <p
                                  className={
                                    styles["packagecard_disoucntprice_para"]
                                  }
                                >
                                  {t("Pay-only")}
                                </p>
                                <h4 className="d-flex justify-content-center align-items-center m-0">
                                  <p
                                    className={styles["package_AnuallyAmount"]}
                                  >
                                    ${data.PackageAnuallyDiscountAmount}/
                                  </p>
                                  <p className={styles["packageAnuallyMonth"]}>
                                    {" "}
                                    {t("Month")}
                                  </p>
                                </h4>
                                <p
                                  className={
                                    styles["packagecard_disoucntprice_para"]
                                  }
                                >
                                  {t("For-first-year")}
                                </p>
                              </Col>
                            </div>
                          </Col>
                          <Col sm={false} md={2} lg={2}></Col>
                        </Row>
                        <Row>
                          <Col sm={12}>
                            <div className={styles["packagecard_usersallows"]}>
                              <Row>
                                <Col sm={12}>
                                  <Col
                                    className={
                                      styles["packagecard_usersallows"]
                                    }
                                  >
                                    <h6
                                      className={
                                        styles[
                                          "packagecard_usersallows_heading"
                                        ]
                                      }
                                    >
                                      {t("Allowed-users")}
                                    </h6>
                                    <Row className="mx-auto">
                                      <Col sm={12} md={6} lg={6}>
                                        <Col
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className={
                                            styles["package_membersHeading"]
                                          }
                                        >
                                          Board Members
                                        </Col>
                                        <Col
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className={
                                            styles[
                                              "package_membersHeading_values"
                                            ]
                                          }
                                        >
                                          {data.BoardMembers}
                                        </Col>
                                      </Col>
                                      <Col sm={12} md={6} lg={6}>
                                        <Col
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className={
                                            styles["package_membersHeading"]
                                          }
                                        >
                                          Admin Users
                                        </Col>
                                        <Col
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          className={
                                            styles[
                                              "package_membersHeading_values"
                                            ]
                                          }
                                        >
                                          {data.AdminMembers}
                                        </Col>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col className={styles["selected-package-text"]}>
                            <p>{data.packageDescriptiveDetails}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12}>
                            <Button
                              text={"Select Package"}
                              className={styles["packagecard_btn"]}
                              onClick={() => handleClickPackage(data.PackageID)}
                            />
                          </Col>
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
        {flagForSelectedPackeg ? (
          <></>
        ) : (
          <Row>
            <Col className="d-flex justify-content-center ">
              <Link to="/" className={styles["goBackPackageSelectionBtn"]}>
                Go Back
              </Link>
            </Col>
          </Row>
        )}

        {GetSubscriptionPackage.Loading ? (
          <Loader />
        ) : Authreducer.Loading ? (
          <Loader />
        ) : null}
        <Notification
          open={open.open}
          message={open.message}
          setOpen={open.open}
        />
      </Container>
    </>
  );
};

export default PackageSelection;
