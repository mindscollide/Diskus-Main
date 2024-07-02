import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./Summary.module.css";
import {
  Button,
  Modal,
  Notification,
  PaymentActivity,
  Table,
  Loader,
} from "../../../../components/elements";
import {
  cleareMessage,
  setLoader,
} from "../../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import VerificationFailedIcon from "./../../../../assets/images/failed.png";
import { getBillingInformationapi } from "../../../../store/actions/OrganizationBillings_actions";
import {
  newTimeFormaterAsPerUTCFullDate,
  _justShowDateformat,
  _justShowDateformatBilling,
} from "../../../../commen/functions/date_formater";
const Summary = () => {
  const navigate = useNavigate();
  const [activateBlur, setActivateBlur] = useState(false);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    BalanceDue: 0,
    NextInvoiceEstimate: 0,
    NextPaymentDueDate: "",
    AmountAfterDiscount: 0,
  });
  const [invoice, setInvoice] = useState([
    {
      balanceDue: 0,
      invoiceAmount: 0,
      invoiceCustomerNumber: "",
      invoiceDueDate: "",
      lateFeeCharged: 0,
    },
  ]);
  const [lastPayment, setLastPayment] = useState({
    Invoice: 0,
    PaymentReceivedDate: "",
    PaidAmount: 0,
  });
  const [accountActivity, setAccountActivity] = useState({
    LastPaymentInvoice: 0,
    LasyPaymentReceivedDate: "",
    LastPaidAmount: 0,
  });
  let Blur = localStorage.getItem("blur");

  useEffect(() => {
    if (Blur != undefined) {
      console.log("Blur", Blur);

      setActivateBlur(true);
    } else {
      console.log("Blur", Blur);

      setActivateBlur(false);
    }
  }, [Blur]);

  const { Authreducer, OrganizationBillingReducer, LanguageReducer } =
    useSelector((state) => state);
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (
      Authreducer.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer.VerifyOTPEmailResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-an-admin-user")
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
      Authreducer.EnterPasswordResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-an-admin-user")
    ) {
      setOpen({
        ...open,
        open: false,
        message: "",
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
      Authreducer.OrganizationCreateResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-an-admin-user")
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
      Authreducer.CreatePasswordResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-an-admin-user")
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
      Authreducer.GetSelectedPackageResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-an-admin-user")
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
      Authreducer.EmailValidationResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-an-admin-user")
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
  const closeModal = () => {
    setActivateBlur(false);
    dispatch(setLoader());
    navigate("/");
  };

  //handle PayInvoice button
  const handlePayInvoiceButton = () => {};

  const columns = [
    {
      title: t("Subscription#"),
      dataIndex: "Subscription",
      key: "Subscription",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Invoice-number"),
      dataIndex: "invoice",
      key: "invoice",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Due-date"),
      dataIndex: "duedate",
      key: "duedate",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Invoice-amount"),
      dataIndex: "invoiceamount",
      key: "invoiceamount",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Balance-due"),
      dataIndex: "balancedue",
      key: "balancedue",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Late-charges"),
      dataIndex: "latecharges",
      key: "latecharges",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Pay"),
      dataIndex: "Pay",
      key: "Pay",
      ellipsis: true,
      align: "center",
    },
  ];

  const data = [
    {
      key: "1",
      Subscription: (
        <>
          <span className={styles["SummarayOpenInvoiceRecords"]}>
            2024-08-24-991-150
          </span>
        </>
      ),
      invoice: (
        <>
          <span className={styles["SummarayOpenInvoiceRecords"]}>
            "John Brown"
          </span>
        </>
      ),
      duedate: (
        <>
          <span className={styles["SummarayOpenInvoiceRecords"]}>32</span>
        </>
      ),
      invoiceamount: (
        <>
          <span className={styles["SummarayOpenInvoiceRecords"]}>
            New York No. 1 Lake Park
          </span>
        </>
      ),
      balancedue: (
        <>
          <span className={styles["SummarayOpenInvoiceRecords"]}>York No.</span>
        </>
      ),
      latecharges: (
        <>
          <span className={styles["SummarayOpenInvoiceRecords"]}>Testttt</span>
        </>
      ),
      Pay: (
        <>
          <Button
            text={t("Pay-Invoice")}
            className={styles["Pay_invoice_button"]}
            onClick={handlePayInvoiceButton}
          />
        </>
      ),
    },
  ];
  useEffect(() => {
    try {
      if (OrganizationBillingReducer.getBillInformation !== null) {
        let Summary =
          OrganizationBillingReducer.getBillInformation.accountDetails;
        let lastpaymentDetail =
          OrganizationBillingReducer.getBillInformation.lastPayment;
        // let AccountActivityLastPayment = OrganizationBillingReducer.getBillInformation.
        console.log("SummarySummarySummary", Summary);
        console.log("SummarySummarySummary", lastpaymentDetail);
        console.log(
          "SummarySummarySummary",
          OrganizationBillingReducer.getBillInformation.invoice
        );
        console.log(
          "SummarySummarySummary",
          OrganizationBillingReducer.getBillInformation
        );
        setSummary({
          BalanceDue: Summary.balanceDue != 0 ? Summary.balanceDue : 0,
          NextInvoiceEstimate:
            Summary.nextAmountEstimate != 0 ? Summary.nextAmountEstimate : 0,
          NextPaymentDueDate: Summary.nextPaymentDate,
          AmountAfterDiscount: Summary.amountAfterDiscount,
        });

        let newInvoice = [];
        OrganizationBillingReducer.getBillInformation.invoice.map(
          (data, index) => {
            newInvoice.push({
              invoice: data.invoiceCustomerNumber,
              duedate: _justShowDateformatBilling(data.invoiceDueDate),
              invoiceamount: data.invoiceAmount,
              balancedue: data.balanceDue,
              latecharges: data.lateFeeCharged,
            });
          }
        );
        console.log("SummarySummarySummary", newInvoice);

        setRows([...newInvoice]);

        setLastPayment({
          Invoice: lastpaymentDetail.invoiceCustomerNumber,
          PaidAmount:
            lastpaymentDetail.paidAmount != 0
              ? lastpaymentDetail.paidAmount
              : 0,
          PaymentReceivedDate:
            lastpaymentDetail.paymentRecieveDate != ""
              ? lastpaymentDetail.paymentRecieveDate
              : "",
        });
      }
    } catch {
      console.log("error");
    }
  }, [OrganizationBillingReducer.getBillInformation]);
  console.log("SummarySummarySummary", rows);

  useEffect(() => {
    dispatch(getBillingInformationapi(navigate, t));
  }, []);
  return (
    <>
      <Fragment>
        <Container className="mt-3">
          <PaymentActivity
            PaymentActivityBoxTitle={t("Summary")}
            PaymentActivityTitle={t("Section-of-account-summary")}
            ColOneKey={t("Balance-duee")}
            ColTwoKey={t("Next-invoice-estimate")}
            ColThreeKey={t("Next-payment-due-date")}
            ColOneValue={
              summary.BalanceDue != 0 ? (
                <>$ {summary.BalanceDue}</>
              ) : (
                <>{summary.BalanceDue}</>
              )
            }
            ColTwoValue={
              summary.NextInvoiceEstimate != 0 ? (
                <>$ {summary.NextInvoiceEstimate}</>
              ) : (
                <>{summary.NextInvoiceEstimate}</>
              )
            }
            ColThreeValue={_justShowDateformatBilling(
              summary.NextPaymentDueDate
            )}
          />
          <PaymentActivity
            PaymentActivityBoxTitle={t("Account-activity")}
            PaymentActivityTitle={t("Last-payment")}
            ColOneKey={t("Invoice-number")}
            ColTwoKey={t("Payment-received-date")}
            ColThreeKey={t("Paid-amount")}
            ColOneValue={lastPayment.Invoice}
            ColTwoValue={_justShowDateformatBilling(
              lastPayment.PaymentReceivedDate
            )}
            ColThreeValue={
              lastPayment.PaidAmount !== 0 ? (
                <>$ {lastPayment.PaidAmount}</>
              ) : (
                <>{"--"}</>
              )
            }
          />
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="border-radius-4 border py-3 px-5 mt-3 my-2 bg-white"
            >
              <Col
                sm={12}
                md={12}
                lg={12}
                className={styles["PaymentActivitySubtitle"]}
              >
                {t("Open-invoice")}
              </Col>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="Summary-Table-Invoice my-1"
              >
                <Table rows={data} column={columns} />
              </Col>
            </Col>
          </Row>
        </Container>
        <Modal
          show={activateBlur}
          setShow={() => {
            setActivateBlur();
          }}
          ButtonTitle={"Block"}
          centered
          size={"md"}
          modalHeaderClassName="d-none"
          ModalBody={
            <>
              <>
                <Row className="mt-2">
                  <Col lg={12} md={12} xs={12} sm={12}>
                    <Row>
                      <Col className="d-flex justify-content-center">
                        <img
                          draggable="false"
                          src={VerificationFailedIcon}
                          className={styles["allowModalIcon"]}
                          width={60}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className={styles["deleteModal-message"]}>
                          {t(
                            "The-organization-subscription-is-not-active-please-contact-your-admin"
                          )}
                        </label>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            </>
          }
          ModalFooter={
            <>
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className={styles["Ok-Successfull-btn"]}
                      text={t("Ok")}
                      onClick={closeModal}
                    />
                  </Col>
                </Row>
              </Col>
            </>
          }
        />
        <Notification
          setOpen={setOpen}
          open={open.open}
          message={open.message}
        />
      </Fragment>
      {OrganizationBillingReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default Summary;
