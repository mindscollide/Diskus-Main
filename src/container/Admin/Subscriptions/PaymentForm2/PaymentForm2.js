import React, { useEffect, useState } from "react";
import styles from "./PaymentForm2.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronLeft, ChevronRight, X } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Button, Loader } from "../../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { getSubscriptionUpgradePaymentCompleteApi } from "../../../../store/actions/Admin_PackageDetail";
const PaymentForm2 = () => {
  const { t, i18n } = useTranslation();
  const { Authreducer, LanguageReducer } = useSelector((state) => state);
  const [totalAmount, setTotalAmount] = useState(0);
  let PaymentAmount = JSON.parse(localStorage.getItem("PaymentAmount"));
  useEffect(() => {
    if (PaymentAmount !== null && PaymentAmount !== undefined) {
      setTotalAmount(PaymentAmount);
    }
  }, [PaymentAmount]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

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
              </Row>
            </Col>
          </Col>
        </Row>
      </Container>
      {/* {Authreducer.Loading || (LanguageReducer.Loading && <Loader />)} */}
    </>
  );
};

export default PaymentForm2;
