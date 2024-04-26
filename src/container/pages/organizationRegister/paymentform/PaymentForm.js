import React, { useEffect, useState } from "react";
import styles from "./PaymentForm.module.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  ChevronCompactLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Accordian,
  Button,
  Loader,
  TextField,
} from "../../../../components/elements";
import PayonnerLogo from "../../../../assets/images/payoneer-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import DiskusnewRoundIconSignUp from "../../../../assets/images/newElements/Diskus_newRoundIcon_SignUp.svg";
import PaypalPaymentLogo from "../../../../assets/images/newElements/Paypal.svg";
import BinancePaymentCardLogo from "../../../../assets/images/newElements/BinancePaymentCardLogo.svg";
import BitcoinPaymentCardLogo from "../../../../assets/images/newElements/BitcoinPaymentCardLogo.svg";
import EtherumPaymentCardLogo from "../../../../assets/images/newElements/EtherumPaymentCardLogo.svg";
import MasterCard from "../../../../assets/images/newElements/Master_card.svg";
import LanguageChangeIcon from "../../../../assets/images/newElements/Language.svg";
import { useTranslation } from "react-i18next";
import { getSelectedPacakgeDetail } from "../../../../store/actions/Auth2_actions";
import Cookies from "js-cookie";

import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { subscriptionPaymentApi } from "../../../../store/actions/Admin_PackageDetail";
const PaymentForm = () => {
  const { t } = useTranslation();
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const [monthlyPackageShow, setMonthlyPackageShow] = useState(false);
  let currentLangugage =
    localStorage.getItem("i18nextLng") !== null
      ? localStorage.getItem("i18nextLng")
      : "en";
  const { Authreducer, LanguageReducer } = useSelector((state) => state);

  const [isSelectedPacakage, setSelectedPackage] = useState({
    PackageCategory: "",
    MonthlyAmount: "",
    AnnuallyAmount: "",
    DisountPer: "",
    OrderAmount: "",
  });
  const [BillDetails, setBillDetails] = useState({
    MonthlyBill: 0,
    TotalBill: 0,
    AnuallyDiscount: 0,
    InvoiceID: 0,
    OrganizationSubscriptionID: 0,
    AnuallyDiscountRate: 0,
    PaymentBeforeDiscount: 0,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (BillDetails.InvoiceID !== 0) {
      dispatch(subscriptionPaymentApi(navigate, BillDetails, t));
    }
  };

  useEffect(() => {
    dispatch(getSelectedPacakgeDetail(navigate, t));
  }, []);

  useEffect(() => {
    if (Authreducer.getSubscriptiondetails !== null) {
      setBillDetails({
        MonthlyBill: Authreducer.getSubscriptiondetails?.monthlyBill,
        TotalBill: Authreducer.getSubscriptiondetails?.totalBill,
        InvoiceID: Authreducer.getSubscriptiondetails?.pk_OrganizationInvoiceID,
        OrganizationSubscriptionID:
          Authreducer.getSubscriptiondetails?.pK_OrganizationSubscriptionID,
        AnuallyDiscountRate:
          Authreducer.getSubscriptiondetails?.firstYearDiscountPercentage,
        PaymentBeforeDiscount:
          Authreducer.getSubscriptiondetails?.amountBeforeDiscount,
      });
    }
  }, [Authreducer.getSubscriptiondetails]);

  useEffect(() => {
    if (Authreducer.GetSelectedPacakgeDetails !== null) {
      let packageData =
        Authreducer.GetSelectedPacakgeDetails.organizationSelectedPackage;
      if (packageData.fK_TenureOfSubscription === 1) {
        setAnnualPackageShow(true);
        setMonthlyPackageShow(false);
      } else {
        setAnnualPackageShow(false);
        setMonthlyPackageShow(true);
      }
      setSelectedPackage({
        ...isSelectedPacakage,
        PackageCategory: packageData.packageName,
        MonthlyAmount: packageData.packageActualPrice,
        AnnuallyAmount: "",
        AnnualyDiscountRate: packageData.yearlyPurchaseDiscountPercentage,
        DisountPer: "",
        OrderAmount: "",
        ActualAmount: packageData.packageActualPrice,
      });
    }
  }, [Authreducer.GetSelectedPacakgeDetails]);
  return (
    <>
      <Container className={styles["paymentformBackground"]}>
        <Row className="position-relative">
          <Col sm={12} md={12} lg={12} className={styles["bg_roundimage"]}>
            <img draggable="false" src={DiskusnewRoundIconSignUp} alt="" />
          </Col>
          <Col
            sm={12}
            lg={12}
            md={12}
            className="mx-auto mt-5 mb-4 col-lg-12 col-md-12 col-sm-12"
          >
            <h3
              className={`${"Payment-Method-Heading "} ${
                styles["paymentform_heading"]
              }`}
            >
              {t("Choose-payment-method")}
            </h3>
          </Col>
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
          <Col
            sm={12}
            md={10}
            lg={10}
            className="mx-auto border-radius-4 py-2 bg-white"
          >
            <Row>
              <Col
                sm={12}
                md={2}
                lg={2}
                className="mx-auto text-capatlize text-center my-3 d-flex justify-content-center align-items-center fs-3  bg-white"
              >
                {currentLangugage === "rtl" ? (
                  <ChevronRight
                    fontWeight="100px"
                    className={`${styles["goBackChevRon"]}`}
                  />
                ) : (
                  <ChevronLeft
                    fontWeight="100px"
                    className={`${styles["goBackChevRon"]}`}
                  />
                )}{" "}
                <Link
                  to="/selectedpackage"
                  className={`${styles["goBackChevRon"]}`}
                >
                  {t("Go-back")}
                </Link>
              </Col>
              <Col
                sm={12}
                md={10}
                lg={10}
                className="mx-auto text-center border-radius-4 py-3 bg-white"
              >
                <Col
                  sm={12}
                  md={10}
                  lg={10}
                  className="border  border-radius-4 py-3"
                >
                  <h6
                    className="Satisfaction-Guaranteed MontserratBold-700 text-uppercase"
                    style={{ color: "#5A5A5A" }}
                  >
                    {t("Satisfaction-guaranteed")}
                  </h6>
                  <p
                    className="Satisfaction-Message  m-0 p-0"
                    style={{ color: "#5A5A5A" }}
                  >
                    {t(
                      "If-youre-not-completely-with-purhcase-contact-our-Diskus-Guides-24/7/365-and-well-make-it-right"
                    )}
                  </p>
                </Col>
              </Col>
            </Row>

            <Col sm={12} md={12} lg={12} className="mx-auto">
              <Row>
                <Col
                  sm={12}
                  md={6}
                  lg={6}
                  className={`${styles["paymentpricecardBox"]} ${" my-3 mx-0"}`}
                >
                  <div
                    className={`${styles["packagecard_priceBox_container"]}`}
                  >
                    <div className={styles["packagecard_one"]}>
                      <div className={styles["packagecard_pricebox"]}>
                        <h4 className="MontserratBold-700 d-flex justify-content-center align-items-center ">
                          {isSelectedPacakage.PackageCategory}
                        </h4>
                      </div>
                      <div className={styles["PackagesButtons"]}>
                        <span
                          className={
                            monthlyPackageShow
                              ? styles["spanActive"]
                              : styles["span-formontly"]
                          }
                          // onClick={handleManualPackage}
                        >
                          {/* Monthly */}
                          {t("Monthly")}
                        </span>
                        <span
                          className={
                            annualPackageShow
                              ? styles["spanActive"]
                              : styles["span-forAnnually"]
                          }
                          // onClick={handleAnnualPackage}
                        >
                          {/* Annually */}
                          {t("Annually")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles["pricesuffle"]}>
                    <span
                      className={
                        annualPackageShow
                          ? "MontserratBold-700 fs-3 visible color-5a5a5a Arabicstyles "
                          : "MontserratBold-700 fs-4 invisible Arabicstyles  "
                      }
                    >
                      ${BillDetails.TotalBill}/
                      <span className="fs-6">
                        {monthlyPackageShow ? t("Monthly") : t("Annually")}
                      </span>
                    </span>

                    <br />
                    <span
                      className={
                        annualPackageShow
                          ? "MontserratBold-700 fs-6 text-decoration-line-through color-5a5a5a Arabicstyles  "
                          : "MontserratBold-700 fs-4 color-5a5a5a Arabicstyles"
                      }
                    >
                      ${BillDetails.PaymentBeforeDiscount}/
                      <span className="text-xs ">{t("Annually")}</span>
                    </span>
                  </div>
                  {annualPackageShow && (
                    <>
                      <div
                        className={`${
                          styles["disount_per"]
                        } ${"MontserratMedium-500 text-center border w-25 mx-auto mb-3 fs-4"}`}
                      >
                        <span className={styles["Arabic_Styles_Percent"]}>
                          {BillDetails.AnuallyDiscountRate}% {t("off")}
                        </span>
                      </div>
                      <div className={styles["descriptionline"]}>
                        <p className={styles["descriptiontext"]}>
                          {t("Renews-December-2023-for-Rs-$35/mo-($420 total)")}
                          <X />
                        </p>
                      </div>
                    </>
                  )}
                </Col>
                <Col sm={12} md={6} lg={6} className=" my-3 p-4">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className={`${
                      styles["Ordersummaryheading"]
                    } ${"MontserratMedium-500"}`}
                  >
                    {t("Order-summary")}
                  </Col>
                  <Col
                    sm={12}
                    md={11}
                    lg={11}
                    className={styles["paymentdetailbox"]}
                  >
                    <Row>
                      <Col
                        sm={12}
                        md={6}
                        lg={6}
                        className="d-flex align-items-center Subtotal-Text"
                      >
                        {t("Subtotal-pkr")}
                      </Col>
                      <Col
                        sm={12}
                        md={6}
                        lg={6}
                        className="Subtotal-Value d-flex justify-content-end  text-white"
                      >
                        ${BillDetails.TotalBill}
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex mt-4 justify-content-center"
                  >
                    <Button
                      text={t("Payment-proceed")}
                      onClick={handleSubmit}
                      className={styles["PaymentFormSubmitPayment"]}
                    />
                  </Col>
                  {/* <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="MontserratMedium-500 text-center small Arabicstyles_Subtotal_Not_include_taxes"
                  >
                    {t("Subtotal-does-not-include-applicable-taxes")}
                  </Col> */}
                  {/* <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={` ${"MontserratMedium-500 mt-2"} ${styles["link_text"]
                      }`}
                  >
                    <Link to="">{t("Have-a-promo-code")}</Link>
                  </Col> */}
                  {/* <Col
                    className={` ${"MontserratMedium-500 mt-2"} ${styles["link_text"]
                      }`}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                    <Link to="">{t("View-all-promo-codes")}</Link>
                  </Col> */}
                  {/* <Col sm={12} md={12} lg={12} className="mt-4">
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={styles["paymentoptions"]}
                      >
                        <div>
                          <figure>
                            <img draggable="false" src={BitcoinPaymentCardLogo} />
                            <figcaption className="MontserratMedium-500 font-sizepaymentmethodcaption">
                              {t("Bitcoin")}
                            </figcaption>
                          </figure>
                          <figure>
                            <img draggable="false" src={EtherumPaymentCardLogo} />
                            <figcaption className="MontserratMedium-500 font-sizepaymentmethodcaption">
                              {t("Ethereum")}
                            </figcaption>
                          </figure>
                          <figure>
                            <img draggable="false" src={BinancePaymentCardLogo} />
                            <figcaption className="MontserratMedium-500 font-sizepaymentmethodcaption">
                              {t("Binance")}
                            </figcaption>
                          </figure>
                        </div>
                        <div>
                          <figure>
                            <img draggable="false" src={PaypalPaymentLogo} />
                            <figcaption></figcaption>
                          </figure>
                        </div>
                        <div>
                          <figure>
                            <img draggable="false" src={MasterCard} />
                            <figcaption></figcaption>
                          </figure>
                        </div>
                      </Col>
                    </Row>
                  </Col> */}
                  {/* <Col
                    className=" text-center mt-2 Saved_money_Tagline"
                    style={{ color: "5a5a5a" }}
                    md={12}
                    sm={12}
                    lg={12}
                  >
                    {t("Nice-you-saved-$5/-month-on-you-subscription")}
                  </Col> */}
                </Col>
              </Row>
            </Col>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default PaymentForm;
