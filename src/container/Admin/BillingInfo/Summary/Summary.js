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
  const closeModal = () => {
    setActivateBlur(false);
    setLoader(false);
    navigate("/");
  };

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
          <Col sm={12} md={12} lg={12} className="border my-2 bg-white">
            <Col sm={12} md={12} lg={12} className="fs-6 ms-3 fw-900 mt-2">
              {t("Open-Invoice")}
            </Col>
            <Col sm={12} md={12} lg={12} className="my-1">
              <Table column={columns} />
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
              <Row className=" mt-4">
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  sm={12}
                 
                >
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <ExclamationTriangleFill className={styles["allowModalIcon"]} size={60} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label className={styles["deleteModal-message"]}>
                        The organization subscription is not active. Please contact
                        your admin
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
                    text={t("Ok-Title")}
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
