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
} from "../../../../components/elements";
import {
  cleareMessage,
  setLoader,
} from "../../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VerificationFailedIcon from "./../../../../assets/images/failed.png";
import { getBillingInformationapi } from "../../../../store/actions/OrganizationBillings_actions";
import {
  _justShowDateformat,
  _justShowDateformatBilling,
} from "../../../../commen/functions/date_formater";
import searchPaymentHistoryApi from "../../../../store/actions/Admin_SearchPaymentHistory";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
import { convertToArabicNumerals } from "../../../../commen/functions/regex";
const Summary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let Blur = localStorage.getItem("blur");
  let organizationID = localStorage.getItem("organizationID");

  const getBillInformation = useSelector(
    (state) => state.OrganizationBillingReducer.getBillInformation
  );
  const VerifyOTPEmailResponseMessage = useSelector(
    (state) => state.Authreducer.VerifyOTPEmailResponseMessage
  );
  const EnterPasswordResponseMessage = useSelector(
    (state) => state.Authreducer.EnterPasswordResponseMessage
  );
  const OrganizationCreateResponseMessage = useSelector(
    (state) => state.Authreducer.OrganizationCreateResponseMessage
  );
  const CreatePasswordResponseMessage = useSelector(
    (state) => state.Authreducer.CreatePasswordResponseMessage
  );
  const EmailValidationResponseMessage = useSelector(
    (state) => state.Authreducer.EmailValidationResponseMessage
  );
  const GetSelectedPackageResponseMessage = useSelector(
    (state) => state.Authreducer.GetSelectedPackageResponseMessage
  );
  const searchPaymentHistory = useSelector(
    (state) => state.adminReducer.searchPaymentHistory
  );
  const [activateBlur, setActivateBlur] = useState(false);

  const [rows, setRows] = useState([]);

  const [summary, setSummary] = useState({
    BalanceDue: 0,
    NextInvoiceEstimate: 0,
    NextPaymentDueDate: "",
    AmountAfterDiscount: 0,
  });

  const [lastPayment, setLastPayment] = useState({
    Invoice: 0,
    PaymentReceivedDate: "",
    PaidAmount: 0,
  });

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  //Open Invoice Table State
  const [openInvoiceRecords, setOpenInvoiceRecords] = useState([]);
  useEffect(() => {
    if (Blur !== null) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

  //Invoice and payment History Api Call
  useEffect(() => {
    try {
      let Data = {
        OrganizationID: Number(organizationID),
        InvoiceNo: "",
        InvoiceStartDate: "",
        InvoiceEndDate: "",
        PaymentStartDate: "",
        PaymentEndDate: "",
        PaymentID: 1,
        IsLateSurcharge: false,
      };
      dispatch(searchPaymentHistoryApi(navigate, Data, t, false, false));
    } catch (error) {}
  }, []);

  //Extracting the data of payment and Invoice Details
  useEffect(() => {
    try {
      if (searchPaymentHistory !== null && searchPaymentHistory !== undefined) {
        setOpenInvoiceRecords(searchPaymentHistory.paymentInfo.paymentHistory);
      }
    } catch (error) {}
  }, [searchPaymentHistory]);

  useEffect(() => {
    if (
      VerifyOTPEmailResponseMessage !== "" &&
      VerifyOTPEmailResponseMessage !== undefined &&
      EnterPasswordResponseMessage !== t("The-user-is-an-admin-user")
    ) {
      showMessage(VerifyOTPEmailResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (
      EnterPasswordResponseMessage !== "" &&
      EnterPasswordResponseMessage !== undefined &&
      EnterPasswordResponseMessage !== t("The-user-is-an-admin-user")
    ) {
      showMessage(EnterPasswordResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (
      OrganizationCreateResponseMessage !== "" &&
      OrganizationCreateResponseMessage !== undefined &&
      EnterPasswordResponseMessage !== t("The-user-is-an-admin-user")
    ) {
      showMessage(OrganizationCreateResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else if (
      CreatePasswordResponseMessage !== "" &&
      CreatePasswordResponseMessage !== undefined &&
      EnterPasswordResponseMessage !== t("The-user-is-an-admin-user")
    ) {
      showMessage(CreatePasswordResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else if (
      GetSelectedPackageResponseMessage !== "" &&
      GetSelectedPackageResponseMessage !== undefined &&
      EnterPasswordResponseMessage !== t("The-user-is-an-admin-user")
    ) {
      showMessage(GetSelectedPackageResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else if (
      EmailValidationResponseMessage !== "" &&
      EmailValidationResponseMessage !== undefined &&
      EnterPasswordResponseMessage !== t("The-user-is-an-admin-user")
    ) {
      showMessage(EmailValidationResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    EnterPasswordResponseMessage,
    VerifyOTPEmailResponseMessage,
    OrganizationCreateResponseMessage,
    CreatePasswordResponseMessage,
    EmailValidationResponseMessage,
    GetSelectedPackageResponseMessage,
  ]);
  const closeModal = () => {
    setActivateBlur(false);
    dispatch(setLoader());
    navigate("/");
  };

  const columns = [
    {
      title: t("Subscription#"),
      dataIndex: "subscriptionNumber",
      key: "subscriptionNumber",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Invoice-number"),
      dataIndex: "invoiceCustomerNumber",
      key: "invoiceCustomerNumber",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Due-date"),
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      ellipsis: true,
      align: "center",
      render: (text, Record) => {
        return (
          <span className='text-truncate d-block'>
            {_justShowDateformat(text)}
          </span>
        );
      },
    },
    {
      title: t("Invoice-amount"),
      dataIndex: "paidAmount",
      key: "paidAmount",
      ellipsis: true,
      align: "center",
      render: (text, Record) => {
        return (
          <span className='text-truncate d-block'>
            {convertToArabicNumerals(text)}
          </span>
        );
      },
    },
    {
      title: t("Balance-due"),
      dataIndex: "balancedue",
      key: "balancedue",
      ellipsis: true,
      align: "center",
      render: (text, Record) => {
        return (
          <span className='text-truncate d-block'>
            {convertToArabicNumerals(text)}
          </span>
        );
      },
    },
    {
      title: t("Late-charges"),
      dataIndex: "latecharges",
      key: "latecharges",
      ellipsis: true,
      align: "center",
      render: (text, Record) => {
        return (
          <span className='text-truncate d-block'>
            {convertToArabicNumerals(text)}
          </span>
        );
      },
    },
    {
      title: t("Pay"),
      dataIndex: "Pay",
      key: "Pay",
      ellipsis: true,
      align: "center",
    },
  ];

  useEffect(() => {
    try {
      if (getBillInformation !== null) {
        let Summary = getBillInformation.accountDetails;
        let lastpaymentDetail = getBillInformation.lastPayment;

        setSummary({
          BalanceDue: Summary.balanceDue !== 0 ? Summary.balanceDue : 0,
          NextInvoiceEstimate:
            Summary.nextAmountEstimate !== 0 ? Summary.nextAmountEstimate : 0,
          NextPaymentDueDate: Summary.nextPaymentDate,
          AmountAfterDiscount: Summary.amountAfterDiscount,
        });

        let newInvoice = [];
        getBillInformation.invoice.forEach((data) => {
          newInvoice.push({
            invoice: data.invoiceCustomerNumber,
            duedate: _justShowDateformatBilling(data.invoiceDueDate),
            invoiceamount: data.invoiceAmount,
            balancedue: data.balanceDue,
            latecharges: data.lateFeeCharged,
          });
        });

        setRows([...newInvoice]);

        setLastPayment({
          Invoice: lastpaymentDetail.invoiceCustomerNumber,
          PaidAmount:
            lastpaymentDetail.paidAmount !== 0
              ? lastpaymentDetail.paidAmount
              : 0,
          PaymentReceivedDate:
            lastpaymentDetail.paymentRecieveDate !== ""
              ? lastpaymentDetail.paymentRecieveDate
              : "",
        });
      }
    } catch {}
  }, [getBillInformation]);

  useEffect(() => {
    dispatch(getBillingInformationapi(navigate, t));
  }, []);
  return (
    <>
      <Fragment>
        <Container className='mt-3'>
          <PaymentActivity
            PaymentActivityBoxTitle={t("Summary")}
            PaymentActivityTitle={t("Section-of-account-summary")}
            ColOneKey={t("Balance-duee")}
            ColTwoKey={t("Next-invoice-estimate")}
            ColThreeKey={t("Next-payment-due-date")}
            ColOneValue={
              summary.BalanceDue !== 0 ? (
                <>$ {convertToArabicNumerals(summary.BalanceDue)}</>
              ) : (
                <>{summary.BalanceDue}</>
              )
            }
            ColTwoValue={
              summary.NextInvoiceEstimate !== 0 ? (
                <>$ {summary.NextInvoiceEstimate}</>
              ) : (
                <>{summary.NextInvoiceEstimate}</>
              )
            }
            ColThreeValue={
              _justShowDateformatBilling(summary.NextPaymentDueDate) !==
              "Invalid date"
                ? _justShowDateformatBilling(summary.NextPaymentDueDate)
                : "--"
            }
          />
          <PaymentActivity
            PaymentActivityBoxTitle={t("Account-activity")}
            PaymentActivityTitle={t("Last-payment")}
            ColOneKey={t("Invoice-number")}
            ColTwoKey={t("Payment-received-date")}
            ColThreeKey={t("Paid-amount")}
            ColOneValue={lastPayment.Invoice}
            ColTwoValue={
              _justShowDateformatBilling(lastPayment.PaymentReceivedDate) !==
              "Invalid date"
                ? _justShowDateformatBilling(lastPayment.PaymentReceivedDate)
                : "--"
            }
            ColThreeValue={
              lastPayment.PaidAmount !== 0 ? (
                <>$ {convertToArabicNumerals(lastPayment.PaidAmount)}</>
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
              className='border-radius-4 border py-3 px-5 mt-3 my-2 bg-white'>
              <Col
                sm={12}
                md={12}
                lg={12}
                className={styles["PaymentActivitySubtitle"]}>
                {t("Open-invoice")}
              </Col>
              <Col
                sm={12}
                md={12}
                lg={12}
                className='Summary-Table-Invoice my-1'>
                <Table rows={openInvoiceRecords} column={columns} />
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
          modalHeaderClassName='d-none'
          ModalBody={
            <>
              <>
                <Row className='mt-2'>
                  <Col lg={12} md={12} xs={12} sm={12}>
                    <Row>
                      <Col className='d-flex justify-content-center'>
                        <img
                          draggable='false'
                          alt=''
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
                <Row className='mb-3'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-center'>
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
        <Notification open={open} setOpen={setOpen} />
      </Fragment>
    </>
  );
};

export default Summary;
