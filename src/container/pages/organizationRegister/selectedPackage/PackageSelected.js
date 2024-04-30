import React, { useState, useEffect } from "react";
import styles from "./PackageSelected.module.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import SelectedPackageCard from "../../../../components/elements/selectedpackagecard/SelectedPackageCard";
import { Button, Loader, Notification } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  cleareMessage,
  getSelectedPacakgeDetail,
} from "../../../../store/actions/Auth2_actions";
import LanguageChangeIcon from "../../../../assets/images/newElements/Language.svg";
import Cookies from "js-cookie";
import { getCountryNamesAction } from "../../../../store/actions/GetCountryNames";
import { isHTML } from "../../../../commen/functions/html_formater";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";

const PackageSelected = () => {
  const { Authreducer, countryNamesReducer, LanguageReducer } = useSelector(
    (state) => state
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [organizationData, setOrganizationData] = useState({
    Company: "",
    Country: "",
    Address1: "",
    Address2: "",
    Email: "",
    State: "",
    City: "",
    PostalCode: "",
  });
  const [totalBillAmount, setTotalBillAmount] = useState({
    MonthlyBill: 0,
    TotalBill: 0,
  });

  const [organizationDataRole, setorganizationDataRole] = useState({});
  const [countryData, setCountyData] = useState("");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [organizationDataSelectedPackage, setorganizationDataSelectedPackage] =
    useState({
      PackageTitle: "",
      SelectedPackageAmount: "",
      PackageAllowedBoardMembers: "",
      PackageAllowedAdminMembers: "",
      PackageDescriptive: "",
      TenureSubscription: 0,
    });
  const [organizationDataSubscription, setorganizationDataSubscription] =
    useState({});
  const [
    organizationDataSubscriptionType,
    setorganizationDataSubscriptionType,
  ] = useState({});
  const { t, i18n } = useTranslation();
  // Languages
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
    localStorage.setItem("i18nextLng", lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  let currentLanguage = localStorage.getItem("i18nextLng");
  const [packageSelectedData, setPackageSelectedData] = useState({
    Company: "",
    Country: "",
    Address1: "",
    Address2: "",
    Email: "",
    State: "",
    City: "",
    PostalCode: "",
  });

  useEffect(() => {
    localStorage.removeItem("flagForSelectedPackeg");
  }, []);
  const dataCallForDetails = async () => {
    await dispatch(getCountryNamesAction(navigate, t));
    dispatch(getSelectedPacakgeDetail(navigate, t));
  };

  useEffect(() => {
    dataCallForDetails();
  }, []);

  useEffect(() => {
    let countryNameValue;
    if (
      countryNamesReducer.CountryNamesData !== null &&
      countryNamesReducer.CountryNamesData !== undefined &&
      Authreducer.GetSelectedPacakgeDetails !== undefined &&
      Authreducer.GetSelectedPacakgeDetails !== null
    ) {
      countryNameValue = countryNamesReducer.CountryNamesData.find(
        (data, index) => {
          console.log(
            "fK_WorldCountryID",
            Authreducer.GetSelectedPacakgeDetails.organization.fK_WorldCountryID
          );

          return (
            Authreducer.GetSelectedPacakgeDetails?.organization
              .fK_WorldCountryID === data.pK_WorldCountryID
          );
        }
      );

      setCountyData(countryNameValue?.countryName);
    }
    if (
      Authreducer.GetSelectedPacakgeDetails !== null &&
      Authreducer.GetSelectedPacakgeDetails !== undefined
    ) {
      let Organizationdata = {
        Company:
          Authreducer.GetSelectedPacakgeDetails?.organization.organizationName,
        Country: countryNameValue?.countryName,
        Address1:
          Authreducer.GetSelectedPacakgeDetails?.organization
            .organizationAddress1,
        Address2:
          Authreducer.GetSelectedPacakgeDetails?.organization
            .organizationAddress2,
        Email:
          Authreducer.GetSelectedPacakgeDetails?.organization
            .contactPersonEmail,
        State:
          Authreducer.GetSelectedPacakgeDetails?.organization.stateProvince,
        City: Authreducer.GetSelectedPacakgeDetails?.organization.city,
        PostalCode:
          Authreducer.GetSelectedPacakgeDetails?.organization.postalCode,
      };
      setPackageSelectedData(Organizationdata);
      let PackageDetails = {
        PackageTitle:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageName,
        SelectedPackageAmount:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageActualPrice,
        PackageAllowedBoardMembers:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageAllowedBoardMemberUsers,
        PackageAllowedAdminMembers:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageAllowedAdminUsers,
        PackageDescriptive:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .packageDescriptiveDetails,
        TenureSubscription:
          Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
            .fK_TenureOfSubscription,
      };
      console.log(
        "packageDetailpackageDetailpackageDetailpackageDetail",
        Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage
          .packageDescriptiveDetails
      );
      setorganizationDataSelectedPackage(PackageDetails);
    }
  }, [Authreducer.GetSelectedPacakgeDetails]);

  useEffect(() => {
    if (Authreducer.getSubscriptiondetails !== null) {
      setTotalBillAmount({
        TotalBill: Authreducer.getSubscriptiondetails?.totalBill,
        MonthlyBill: Authreducer.getSubscriptiondetails?.monthlyBill,
      });
    } else {
      setTotalBillAmount({
        TotalBill: 0,
        MonthlyBill: 0,
      });
    }
  }, [Authreducer.getSubscriptiondetails]);
  const goBacktoSignUp = () => {
    localStorage.setItem("flagForSelectedPackeg", true);
    navigate("/packageselection");
  };
  const goForPayment = () => {
    navigate("/paymentForm");
  };

  useEffect(() => {
    if (
      Authreducer.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("Record-found") &&
      Authreducer.VerifyOTPEmailResponseMessage !== undefined &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("2fa-verification") &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("2fa-enabled")
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
      Authreducer.EnterPasswordResponseMessage !== t("Record-found") &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-an-admin-user") &&
      Authreducer.EnterPasswordResponseMessage !== t("2fa-enabled") &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user") &&
      Authreducer.EnterPasswordResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !== t("2fa-verification") &&
      Authreducer.EnterPasswordResponseMessage !== t("2fa-enabled")
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
      Authreducer.OrganizationCreateResponseMessage !== t("Record-found") &&
      Authreducer.OrganizationCreateResponseMessage !== undefined &&
      Authreducer.OrganizationCreateResponseMessage !== t("2fa-verification") &&
      Authreducer.OrganizationCreateResponseMessage !== t("2fa-enabled")
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
      Authreducer.CreatePasswordResponseMessage !== t("Record-found") &&
      Authreducer.CreatePasswordResponseMessage !==
        t("The-user-is-an-admin-user") &&
      Authreducer.CreatePasswordResponseMessage !== t("2fa-enabled") &&
      Authreducer.CreatePasswordResponseMessage !==
        t("Tthe-user-is-a-partial-admin-user") &&
      Authreducer.CreatePasswordResponseMessage !==
        t("The-user-is-not-an-admin-user") &&
      Authreducer.CreatePasswordResponseMessage !==
        t("User-is-not-a-new-user-the-user-is-a-partial-admin-user") &&
      Authreducer.CreatePasswordResponseMessage !==
        t("User-is-not-a-new-user-the-user-is-not-an-admin-user") &&
      Authreducer.CreatePasswordResponseMessage !== undefined &&
      Authreducer.CreatePasswordResponseMessage !== t("2fa-verification") &&
      Authreducer.CreatePasswordResponseMessage !== t("2fa-enabled")
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
      Authreducer.GetSelectedPackageResponseMessage !== t("Record-found") &&
      Authreducer.GetSelectedPackageResponseMessage !== undefined &&
      Authreducer.GetSelectedPackageResponseMessage !== t("2fa-verification") &&
      Authreducer.GetSelectedPackageResponseMessage !== t("2fa-enabled")
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
      Authreducer.EmailValidationResponseMessage !== t("Record-found") &&
      Authreducer.EmailValidationResponseMessage !== undefined &&
      Authreducer.EmailValidationResponseMessage !== t("2fa-verification") &&
      Authreducer.EmailValidationResponseMessage !== t("2fa-enabled")
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
      <Row></Row>
      <Container>
        <Row>
          <Col sm={12} lg={10} md={10} className="mx-auto my-auto">
            <Row className="position-relative">
              <Col className="d-flex justify-content-center mb-3 mt-5">
                <h2 className={styles["selectedpackagepage_heading"]}>
                  {t("Subscription-details")}
                </h2>
              </Col>
              <Col className={styles["languageSelector"]}>
                <LanguageSelector />
              </Col>
            </Row>
            <Row>
              <Col sm={12} lg={5} md={5}>
                <Card className={styles["packagecard"]}>
                  <Row>
                    <Col sm={12}>
                      <h4
                        className={`${"text-center"} ${
                          styles["selectPackage_title"]
                        }`}
                      >
                        {organizationDataSelectedPackage.PackageTitle}
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <div
                        className={`${styles["packagecard_priceBox_container"]}`}
                      >
                        <div className={styles["selectedPackage_priceDetails"]}>
                          <div className={styles["packagecard_disoucntprice"]}>
                            <h4 className="selected-amount d-flex justify-content-center align-items-end text-capitalize mb-2">
                              ${totalBillAmount.TotalBill}/
                              <p className=" m-0 p-0">
                                {organizationDataSelectedPackage.TenureSubscription ===
                                1
                                  ? t("Annually")
                                  : organizationDataSelectedPackage.TenureSubscription ===
                                    2
                                  ? t("Month")
                                  : null}
                              </p>
                            </h4>
                            <p
                              className={
                                styles["selectedpackagecard_disoucntprice_para"]
                              }
                            >
                              {t("Subscription")}{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div
                    className={`${"MontserratMedium-500"} ${
                      styles["selected-package-text"]
                    }`}
                  >
                    {isHTML(
                      organizationDataSelectedPackage.PackageDescriptive
                    ) ? (
                      <Col>
                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              organizationDataSelectedPackage.PackageDescriptive,
                          }}
                        ></p>{" "}
                      </Col>
                    ) : (
                      <Col>
                        :{" "}
                        <p>
                          {organizationDataSelectedPackage.PackageDescriptive}
                        </p>
                      </Col>
                    )}
                  </div>
                  <Col sm={12}>
                    <div className={styles["packagecard_usersallows"]}>
                      <Row>
                        <Col sm={12}>
                          <Col className={styles["packagecard_usersallows"]}>
                            <h1
                              className={`${"MontserratBold-700"} ${
                                styles["packagecard_usersallows_heading"]
                              }`}
                            >
                              {t("Allowed-users")}
                            </h1>
                            <Row className="mx-auto">
                              <Col sm={12} md={6} lg={6}>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["package_membersHeading"]}
                                >
                                  {t("Board-members")}
                                </Col>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={`${"MontserratBold-700"} ${
                                    styles["package_membersHeading_values"]
                                  }`}
                                >
                                  {
                                    organizationDataSelectedPackage.PackageAllowedBoardMembers
                                  }
                                </Col>
                              </Col>
                              <Col sm={12} md={6} lg={6}>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["package_membersHeading"]}
                                >
                                  {t("Admin-member")}
                                </Col>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={`${"MontserratBold-700"} ${
                                    styles["package_membersHeading_values"]
                                  }`}
                                >
                                  {
                                    organizationDataSelectedPackage.PackageAllowedAdminMembers
                                  }
                                </Col>
                              </Col>
                            </Row>
                          </Col>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Card>
              </Col>
              <Col sm={12} lg={7} md={7}>
                <SelectedPackageCard
                  RowsData={
                    <>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("Company")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.Company}
                          </p>
                        </Col>
                      </Row>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("Country")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.Country}
                          </p>
                        </Col>
                      </Row>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("Address1")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.Address1}
                          </p>
                        </Col>
                      </Row>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("Address2")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.Address2}
                          </p>
                        </Col>
                      </Row>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("Email")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.Email}
                          </p>
                        </Col>
                      </Row>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("State")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.State}
                          </p>
                        </Col>
                      </Row>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("City")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.City}
                          </p>
                        </Col>
                      </Row>
                      <Row className={styles["selected_package_details"]}>
                        <Col sm={4}>
                          <p className="details-labels ">
                            {t("Postal-zipcode")}
                          </p>
                        </Col>
                        <Col sm={8}>
                          <p className="details-user-signup MontserratRegular">
                            {packageSelectedData.PostalCode}
                          </p>
                        </Col>
                      </Row>
                    </>
                  }
                />
              </Col>
            </Row>
            <Row className="my-3">
              <Col
                sm={12}
                md={6}
                lg={6}
                className="d-flex justify-content-start"
              >
                <Button
                  text={t("Change-package")}
                  onClick={goBacktoSignUp}
                  className={styles["goBack_SelectedPackage"]}
                />
              </Col>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="d-flex justify-content-end p-0"
              >
                <Button
                  text={t("Process-to-payment")}
                  onClick={goForPayment}
                  className={styles["ProcessToPayment_SelectedPackage"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
        <Notification
          setOpen={setOpen}
          open={open.open}
          message={open.message}
        />
      </Container>
    </>
  );
};

export default PackageSelected;
