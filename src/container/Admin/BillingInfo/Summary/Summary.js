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
import { ExclamationTriangleFill } from "react-bootstrap-icons";
const Summary = () => {
  const navigate = useNavigate();
  const [activateBlur, setActivateBlur] = useState(false);

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

  const { Authreducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (Authreducer.VerifyOTPEmailResponseMessage !== "") {
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
    } else if (Authreducer.EnterPasswordResponseMessage !== "") {
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
    } else if (Authreducer.OrganizationCreateResponseMessage !== "") {
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
    } else if (Authreducer.CreatePasswordResponseMessage !== "") {
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
    } else if (Authreducer.GetSelectedPackageResponseMessage !== "") {
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
    } else if (Authreducer.EmailValidationResponseMessage !== "") {
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
    setLoader(false);
    navigate("/");
  };

  const columns = [
    {
      title: t("Invoice-number"),
      dataIndex: "invoice",
      key: "invoice",
    },
    {
      title: t("Due-date"),
      dataIndex: "duedate",
      key: "duedate",
    },
    {
      title: t("Invoice-amount"),
      dataIndex: "invoiceamount",
      key: "invoiceamount",
    },
    {
      title: t("Balance-due"),
      dataIndex: "balancedue",
      key: "balancedue",
    },
    {
      title: t("Late-charges"),
      dataIndex: "latecharges",
      key: "latecharges",
    },
  ];

  const data = [
    {
      key: "1",
      invoice: "John Brown",
      duedate: 32,
      invoiceamount: "New York No. 1 Lake Park",
      balancedue: "York No. ",
      latecharges: "Testttt",
    },
    {
      key: "2",
      invoice: "John Brown",
      duedate: 32,
      invoiceamount: "New York No. 1 Lake Park",
      balancedue: "York No. ",
      latecharges: "Testttt",
    },
    {
      key: "3",
      invoice: "John Brown",
      duedate: 32,
      invoiceamount: "New York No. 1 Lake Park",
      balancedue: "York No. ",
      latecharges: "Testttt",
    },
  ];

  return (
    <Fragment>
      <Container className="mt-3">
        <PaymentActivity
          PaymentActivityBoxTitle={t("Summary")}
          PaymentActivityTitle={t("Section-of-account-summary")}
          ColOneKey={t("Balance-duee")}
          ColTwoKey={t("Next-invoice-estimate")}
          ColThreeKey={t("Next-payment-due-date")}
          ColOneValue={t("05") + "$"}
          ColTwoValue={t("50") + "$"}
          ColThreeValue="12-04-23"
        />
        <PaymentActivity
          PaymentActivityBoxTitle={t("Account-activity")}
          PaymentActivityTitle={t("Last-payment")}
          ColOneKey={t("Invoice-number")}
          ColTwoKey={t("Payment-received-date")}
          ColThreeKey={t("Paid-amount")}
          ColOneValue="123456"
          ColTwoValue="11-Dec-2022"
          ColThreeValue={t("50") + "$"}
        />
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className="border py-3 px-5 mt-3 my-2 bg-white"
          >
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["PaymentActivitySubtitle"]}
            >
              {t("Open-invoice")}
            </Col>
            <Col sm={12} md={12} lg={12} className="Summary-Table-Invoice my-1">
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
        ModalBody={
          <>
            <>
              <Row className="mt-2">
                <Col lg={12} md={12} xs={12} sm={12}>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <ExclamationTriangleFill
                        className={styles["allowModalIcon"]}
                        size={60}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label className={styles["deleteModal-message"]}>
                        The organization subscription is not active. Please
                        contact your admin
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
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </Fragment>
  );
};

export default Summary;
