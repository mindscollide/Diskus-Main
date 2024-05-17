import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./PackageSelection.module.css";
import Button from "../../../../components/elements/button/Button";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
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
import { isHTML } from "../../../../commen/functions/html_formater";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
const PackageSelection = () => {
  const navigate = useNavigate();
  const { GetSubscriptionPackage, Authreducer, LanguageReducer } = useSelector(
    (state) => state
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
      yearlyDiscountedPrice: 0,
      FirstYearDiscountedPrice: 0,
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

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  // translate Languages end

  const handleAnnualPackage = (packageId) => {
    setCurrentPackageId(packageId);
    setAnnualPackageShow(true);
    setMonthlyPackageShow(false);
  };

  let flagForSelectedPackeg = localStorage.getItem("flagForSelectedPackeg");

  const handleClickPackage = (id) => {
    localStorage.setItem("PackageID", JSON.parse(id));

    if (flagForSelectedPackeg != undefined) {
      // dispatch(setLoader(true));
      if (annualPackageShow === true) {
        if (currentPackageId === id) {
          // anually packege
          localStorage.setItem("TenureOfSuscriptionID", JSON.parse(1));

          dispatch(organizationPackageReselection(id, 1, navigate, t));
        } else {
          // monthly packege
          localStorage.setItem("TenureOfSuscriptionID", JSON.parse(2));

          dispatch(organizationPackageReselection(id, 2, navigate, t));
        }
      } else {
        // monthly packege
        localStorage.setItem("TenureOfSuscriptionID", JSON.parse(2));

        dispatch(organizationPackageReselection(id, 2, navigate, t));
      }
    } else {
      if (annualPackageShow === true) {
        if (currentPackageId === id) {
          // anually packege
          localStorage.setItem("TenureOfSuscriptionID", JSON.parse(1));

          dispatch(setLoader(true));
        } else {
          // monthly packege
          localStorage.setItem("TenureOfSuscriptionID", JSON.parse(2));

          dispatch(setLoader(true));
        }
      } else {
        localStorage.setItem("TenureOfSuscriptionID", JSON.parse(2));

        dispatch(setLoader(true));
      }

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
    dispatch(getSubscriptionDetails(navigate, t));
  }, []);

  useEffect(() => {
    if (GetSubscriptionPackage.PackageDetails.length > 0) {
      let packageData = [];
      GetSubscriptionPackage.PackageDetails.map((data, index) => {
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
          yearlyDiscountedPrice: data.yearlyDiscountedPrice,
          FirstYearDiscountedPrice: data.firstYearDiscountedPrice,
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
    if (
      GetSubscriptionPackage.ResponseMessage !== "" &&
      GetSubscriptionPackage.ResponseMessage !== undefined &&
      GetSubscriptionPackage.ResponseMessage !== "" &&
      GetSubscriptionPackage.ResponseMessage !== t("Data-available")
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
      Authreducer.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("Data-available")
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
      Authreducer.EnterPasswordResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !== t("Data-available")
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
      Authreducer.OrganizationCreateResponseMessage !== "" &&
      Authreducer.OrganizationCreateResponseMessage !== t("Data-available")
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
      Authreducer.CreatePasswordResponseMessage !== "" &&
      Authreducer.CreatePasswordResponseMessage !== t("Data-available")
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
      Authreducer.GetSelectedPackageResponseMessage !== "" &&
      Authreducer.GetSelectedPackageResponseMessage !== t("Data-available")
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
      Authreducer.EmailValidationResponseMessage !== "" &&
      Authreducer.EmailValidationResponseMessage !== t("Data-available")
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
        <Row className="position-relative">
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="mt-4">
            <h2 className={styles["packageselection_heading"]}>
              {t("Select-package")}
            </h2>
          </Col>
        </Row>
        <Row className="m-0">
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles["packageselection_bar"]}
          >
            {t("Enjoy-extra-discount-on-first-annual-subscription")}
          </Col>
        </Row>
        <Row className="mt-3 ">
          {packageDetail.length > 0 ? (
            packageDetail.map((data, index) => {
              let packageColorPath1 =
                data.PackageBadgeColor.split("_SEPERATOR_")[0];
              let packageColorPath2 =
                data.PackageBadgeColor.split("_SEPERATOR_")[1];
              return (
                <Col
                  sm={12}
                  lg={4}
                  md={4}
                  className={index === 1 && index === 3 ? "p-0" : "my-2"}
                  key={data.pK_SubscriptionPackageID}
                >
                  <Row className="g-4">
                    <Col sm={12} className={styles["packageCardBox"]}>
                      <Card className={styles["packagecard"]}>
                        <Row>
                          <Col sm={12}>
                            <>
                              <span className="icon-star package-icon-style">
                                <span
                                  className="path1"
                                  style={{ color: packageColorPath1 }}
                                ></span>
                                <span
                                  className="path2"
                                  style={{ color: packageColorPath2 }}
                                ></span>
                                <span
                                  className="path3"
                                  style={{ color: packageColorPath2 }}
                                ></span>
                              </span>
                              <h4 className={styles["package_title"]}>
                                {/* {t("Gold")} */}
                                {data.PackageName}
                              </h4>{" "}
                            </>
                          </Col>
                        </Row>
                        <Row className="my-0">
                          <Col sm={false} md={2} lg={2}></Col>
                          <Col sm={12} md={8} lg={8} className={"m-1"}>
                            <div
                              className={
                                monthlyPackageShow
                                  ? `${styles["packagecard_pricebox"]}`
                                  : currentPackageId === data.PackageID
                                  ? `${styles["packagecard_pricebox_Active"]}`
                                  : `${styles["packagecard_pricebox"]}`
                              }
                            >
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
                                    ? `${styles["span-formontly"]}`
                                    : monthlyPackageShow === false &&
                                      currentPackageId !== data.PackageID
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
                                    ${data.FirstYearDiscountedPrice}/
                                  </p>
                                  <p className={styles["packageAnuallyMonth"]}>
                                    {t("Month")}
                                  </p>
                                </h4>
                                <p
                                  className={
                                    styles["packagecard_disoucntprice_para"]
                                  }
                                >
                                  {t("For-first-year-then")}
                                </p>
                                <h4 className="d-flex justify-content-center align-items-center m-0">
                                  <p
                                    className={styles["package_AnuallyAmount"]}
                                  >
                                    ${data.yearlyDiscountedPrice}/
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
                                  {t("For-recurring-years")}
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
                                          {t("Board-members")}
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
                                          {t("Admin-member")}
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
                          {isHTML(data.PackageDescription) ? (
                            <Col className={styles["selected-package-texts"]}>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: data.PackageDescription,
                                }}
                              ></p>
                            </Col>
                          ) : (
                            <Col className={styles["selected-package-text"]}>
                              <p>{data.PackageDescription}</p>
                            </Col>
                          )}
                        </Row>
                        <Row>
                          <Col sm={12}>
                            <Button
                              text={t("Select-package")}
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
                {t("Go-back")}
              </Link>
            </Col>
          </Row>
        )}

        {GetSubscriptionPackage.Loading ||
        LanguageReducer.Loading ||
        Authreducer.Loading ? (
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
