import React, { useEffect, useState } from "react";
import styles from "./PaymentForm2.module.css";
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
import {
  getSubscriptionPaymentDetail,
  getSubscriptionUpgradePaymentCompleteApi,
} from "../../../../store/actions/Admin_PackageDetail";
const PaymentForm2 = () => {
  const { t, i18n } = useTranslation();
  const [annualPackageShow, setAnnualPackageShow] = useState(false);
  const [monthlyPackageShow, setMonthlyPackageShow] = useState(false);
  const { Authreducer, LanguageReducer } = useSelector((state) => state);
  console.log("AuthreducerAuthreducer", Authreducer);
  const [isSelectedPacakage, setSelectedPackage] = useState({
    PackageCategory: "",
    MonthlyAmount: "",
    AnnuallyAmount: "",
    DisountPer: "",
    OrderAmount: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  let PaymentAmount = JSON.parse(localStorage.getItem("PaymentAmount"));
  useEffect(() => {
    if (PaymentAmount !== null && PaymentAmount !== undefined) {
      setTotalAmount(PaymentAmount);
    }
  }, [PaymentAmount]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goBack = () => {
    navigate("/selectedpackage");
  };

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
  /// calcuate Anually price

  const handleSubmitforPayment = () => {
    dispatch(getSubscriptionUpgradePaymentCompleteApi(navigate, t));
  };

  useEffect(() => {
    if (Authreducer.getSubscriptionUpgradePaymentDetail !== null) {
      setTotalAmount(Authreducer.getSubscriptionUpgradePaymentDetail.totalBill);
    }
  }, [Authreducer.getSubscriptionUpgradePaymentDetail]);
  return (
    <>
      <Container className={styles["paymentformBackground"]}>
        <Row className="position-relative">
          {/* <Col sm={12} md={12} lg={12} className={styles["bg_roundimage"]}>
            <img draggable="false" src={DiskusnewRoundIconSignUp} alt="" />
          </Col> */}
          <Col
            sm={12}
            lg={12}
            md={12}
            className="mx-auto  mt-3 mb-4 col-lg-12 col-md-12 col-sm-12 "
          >
            <h3
              className={`${"Payment-Method-Heading "} ${
                styles["paymentform_heading"]
              }`}
            >
              {t("Choose-payment-method")}
            </h3>
          </Col>
          {/* <Col className={styles["languageSelector"]} >
            <LanguageSelector />
          </Col> */}
          <Col
            sm={12}
            md={12}
            lg={12}
            className={`${"mx-auto border-radius-4 py-2 bg-white"} ${
              styles["paymentbox"]
            }`}
          >
            <Row>
              <Col
                sm={12}
                md={2}
                lg={2}
                className="mx-auto text-capatlize text-center my-3 d-flex justify-content-center align-items-center fs-3  bg-white"
              >
                {currentLangObj.dir === "rtl" ? (
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
                  to="/Admin/PackageDetail"
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
                      ${totalAmount}
                    </Col>
                  </Row>
                </Col>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-center"
                >
                  <Button
                    text={t("Payment-proceed")}
                    onClick={handleSubmitforPayment}
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
                {/* <Col sm={12} md={12} lg={12} className="mt-4 d-flex justify-content-center">
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
              </Row>
            </Col>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading || (LanguageReducer.Loading && <Loader />)}
    </>
  );
};

export default PaymentForm2;
