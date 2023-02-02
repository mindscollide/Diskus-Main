import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import {
  Notification,
  PaymentActivity,
  Table,
} from "../../../../components/elements";
import { cleareMessage } from "../../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
const Summary = () => {
  const { Authreducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();
  const columns = [
    {
      title: t("Invoice-#"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("Due-Date"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("Invoice-Amount"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("Balance-Due"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("Late-Charges"),
      dataIndex: "title",
      key: "title",
    },
  ];
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
  return (
    <Fragment>
      <Container>
        <PaymentActivity
          PaymentActivityBoxTitle={t("Summary")}
          PaymentActivityTitle={t("Section-of-Account-Summary")}
          ColOneKey={t("Balance-Due")}
          ColTwoKey={t("Next-Invoice-Estimate")}
          ColThreeKey={t("Next-Payment-Due-Date")}
          ColOneValue={t("05") + "$"}
          ColTwoValue={t("50") + "$"}
          ColThreeValue="12-04-23"
        />
        <PaymentActivity
          PaymentActivityBoxTitle={t("Account-Activity")}
          PaymentActivityTitle={t("Last-Payment")}
          ColOneKey={t("Invoice-#")}
          ColTwoKey={t("Payment-Received-Date")}
          ColThreeKey={t("Paid-Amount")}
          ColOneValue="123456"
          ColTwoValue="11-Dec-2022"
          ColThreeValue={t("50") + "$"}
        />
        <Row>
          <Col sm={12} md={12} lg={12} className="border my-2">
            <Col sm={12} md={12} lg={12} className="fs-4 fw-bold mt-3">
              {t("Open-Invoice")}
            </Col>
            <Col sm={12} md={12} lg={12}>
              <Table column={columns} />
            </Col>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </Fragment>
  );
};

export default Summary;
