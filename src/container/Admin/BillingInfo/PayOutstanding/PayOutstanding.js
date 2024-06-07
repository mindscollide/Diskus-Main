import React, { Fragment, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { File, FilePdf, FilePdfFill } from "react-bootstrap-icons";
import { Button, Loader } from "../../../../components/elements";
import SelectedPackageCard from "../../../../components/elements/selectedpackagecard/SelectedPackageCard";
import "./../../../../i18n";
import PDFIcon from "../../../../assets/images/newElements/pdf.png";
import { useTranslation } from "react-i18next";
import styles from "./PayOutstanding.module.css";
import { useDispatch, useSelector } from "react-redux";
import CallingAssistant from "../../../../assets/images/CallingAssistant.svg";
import crossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import { getPayoutStandingInformation } from "../../../../store/actions/OrganizationBillings_actions";
import {
  _justShowDateformat,
  _justShowDateformatBilling,
} from "../../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { getInvocieHTMLApi } from "../../../../store/actions/Auth2_actions";

const PayOutstanding = () => {
  const { OrganizationBillingReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  // for translation
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payOutStanding, setPayOutStanding] = useState({
    Invoice: "",
    DueDate: "",
    InvoiceAmount: 0,
    LateCharges: 0,
    BalanceDue: 0,
    InvoiceID: 0,
  });
  console.log(payOutStanding, "payOutStandingpayOutStandingpayOutStanding");
  useEffect(() => {
    if (OrganizationBillingReducer.getPayoutStanding !== null) {
      let payOutStandingData = OrganizationBillingReducer.getPayoutStanding;
      setPayOutStanding({
        Invoice: payOutStandingData.invoiceCustomerNumber,
        DueDate:
          payOutStandingData.invoiceDueDate !== ""
            ? payOutStandingData.invoiceDueDate
            : "",
        InvoiceAmount:
          Number(payOutStandingData.invoiceAmount) !== 0
            ? payOutStandingData.invoiceAmount
            : 0,
        LateCharges:
          Number(payOutStandingData.lateFeeCharged) !== 0
            ? payOutStandingData.lateFeeCharged
            : 0,
        BalanceDue:
          Number(payOutStandingData.balanceDue) !== 0
            ? payOutStandingData.balanceDue
            : 0,
        InvoiceID: payOutStandingData.pK_OrganizationInvoiceID,
      });
    } else {
      setPayOutStanding({
        ...payOutStanding,
        Invoice: "",
        DueDate: "",
        InvoiceAmount: 0,
        LateCharges: 0,
        BalanceDue: 0,
        InvoiceID: 0,
      });
    }
  }, [OrganizationBillingReducer.getPayoutStanding]);

  useEffect(() => {
    dispatch(getPayoutStandingInformation(navigate, t));
  }, []);

  const hadlePayInvoiceButton = () => {
    // let newData = {
    //   FirstName: billingContactDetails.Name.value,
    //   LastName: billingContactDetails.LastName.value,
    //   Email: billingContactDetails.Email.value,
    //   Phone: billingContactDetails.Contact.value,
    //   Address: billingAddress.Address.value,
    //   Country: billingAddress.Country.value,
    //   City: billingAddress.City.value,
    //   Zip: billingAddress.PostalCode.value,
    //   OrderAmount: Number(totalYearlyCharges),
    //   OrderCurrency: "USD",
    //   OrderDescription: "An Order On Diskus",
    // };
    // dispatch(paymentInitiateMainApi(navigate, t, newData));
  };

  const handleViewInvoice = () => {
    let Data = {
      OrganizationID:
        localStorage.getItem("organizationID") !== null
          ? Number(localStorage.getItem("organizationID"))
          : 0,
      InvoiceID: Number(payOutStanding.InvoiceID),
      SubscriptionID:
        localStorage.getItem("organizationSubscriptionID") !== null
          ? Number(localStorage.getItem("organizationSubscriptionID"))
          : 0,
    };
    dispatch(getInvocieHTMLApi(navigate, t, Data));
  };

  return (
    <>
      <Container>
        <Row className="my-3 ">
          <Col sm={12} md={8} lg={8} className="d-flex justify-content-end">
            <section className={styles["PayoutStandingCard"]}>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className={styles["PayOutstanding_Heading"]}
                >
                  {t("Pay-outstanding")}
                </Col>
              </Row>
              <SelectedPackageCard
                PackageHeading={
                  <>
                    <span className={styles["OutStandingHeading"]}>
                      {t("Outstanding-invoice-details")}
                    </span>
                  </>
                }
                PackageHeadingClass={styles["PackageHeadingClassName"]}
                RowsData={
                  <>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p1"]}>
                          {t("Invoice") + "#"}
                        </p>
                      </Col>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p2"]}>
                          {payOutStanding.Invoice}
                        </p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p1"]}>
                          {t("Due-date")}
                        </p>
                      </Col>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p2"]}>
                          {_justShowDateformatBilling(payOutStanding.DueDate)}
                        </p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p1"]}>
                          {t("Invoice-amount")}
                        </p>
                      </Col>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p2"]}>
                          {payOutStanding.InvoiceAmount !== 0 ? (
                            <>$ {payOutStanding.InvoiceAmount}</>
                          ) : (
                            <>{payOutStanding.InvoiceAmount}</>
                          )}
                        </p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p1"]}>
                          {t("Late-charges")}
                        </p>
                      </Col>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p2"]}>
                          {payOutStanding.LateCharges !== 0 ? (
                            <>$ {payOutStanding.LateCharges}</>
                          ) : (
                            <>{payOutStanding.LateCharges}</>
                          )}
                        </p>
                      </Col>
                    </Row>
                    <Row className={styles["selected_package_details"]}>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p1"]}>
                          {t("Balance-due")}
                        </p>
                      </Col>
                      <Col sm={6}>
                        <p className={styles["selected_package_details_p2"]}>
                          {payOutStanding.BalanceDue !== 0 ? (
                            <>$ {payOutStanding.BalanceDue}</>
                          ) : (
                            <>{payOutStanding.BalanceDue}</>
                          )}
                        </p>
                      </Col>
                    </Row>
                  </>
                }
              />
              <Row>
                <Col sm={12} md={12} lg={12} className="mt-3 p-0">
                  <Button
                    text={t("Pay-invoice-now")}
                    className={styles["PayInvoiceButton"]}
                    onClick={hadlePayInvoiceButton}
                  />
                </Col>
              </Row>

              <Row className="p-0 my-2">
                <Col sm={12} md={6} lg={6} className="mt-2 ps-0">
                  <Button
                    text={t("View-invoice-detail")}
                    className={styles["viewInvocieButton"]}
                    onClick={handleViewInvoice}
                  />
                </Col>
                <Col sm={12} md={6} lg={6} className="mt-2 pe-0">
                  <Button
                    text={t("Download-invoice")}
                    className={styles["DownloadInvoiceButton"]}
                  />
                </Col>
              </Row>
            </section>
          </Col>
          <Col sm={12} md={1} lg={1}></Col>
          <Col sm={12} md={3} lg={3} className="d-flex justify-content-center">
            <section className={styles["Assistance"]}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <img src={crossIcon} alt="" className="cursor-pointer" />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-center"
                >
                  <img src={CallingAssistant} alt="" />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex flex-column flex-wrap text-center"
                >
                  <span className={styles["CallAssistantSubHeading"]}>
                    {t("If-you-need-any-assistance")}
                  </span>
                  <span className={styles["CallAssistantSubHeading"]}>
                    {t("Please-do-not-hesitate-to-email-us-at")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} className="text-center">
                  <span className={styles["BussniessmailStyles"]}>
                    {t("account@letsdiskus.com")}
                  </span>
                </Col>
              </Row>
            </section>
          </Col>
        </Row>
      </Container>
      {OrganizationBillingReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default PayOutstanding;
