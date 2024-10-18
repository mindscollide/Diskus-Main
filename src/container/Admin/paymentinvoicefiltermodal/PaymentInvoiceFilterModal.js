import React, { useState, useRef } from "react";
import "./PaymentInvoiceFilterModal.css";
import { Modal, Button, Checkbox } from "./../../../components/elements";
import "./../../../i18n";
import { useTranslation } from "react-i18next";
import { Row, Col, Container, Form } from "react-bootstrap";
import { Select } from "antd";

const PaymentInvoiceFilterModal = ({ ModalTitle, setShow, show }) => {
  const { t } = useTranslation();

  //state for modals
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccesModal] = useState(false);

  // ref to move on next field
  const Invoice = useRef(null);
  const InvoiceStart = useRef(null);
  const InvoiceEnd = useRef(null);
  const PaymentStart = useRef(null);
  const PaymentEnd = useRef(null);
  const PaymentBy = useRef(null);

  // Enter Handler to move on next field
  const enterHandler = (event, nextInput) => {
    if (event.key === "ENTER") {
      nextInput.current.focus();
    }
  };

  //state for EditUser
  const [paymentInvoiceSection, setpaymentInvoiceSection] = useState({
    Invoice: "",
    InvoiceStart: "",
    InvoiceEnd: "",
    PaymentStart: "",
    PaymentEnd: "",
    PaymentBy: "",
  });

  const EditUserHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Invoice" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setpaymentInvoiceSection({
          ...paymentInvoiceSection,
          Invoice: valueCheck,
        });
      }
    } else if (name === "Invoice" && value === "") {
      setpaymentInvoiceSection({
        ...paymentInvoiceSection,
        Invoice: "",
      });
    }
  };

  // open delete modal on search button
  const openDeleteModal = async () => {
    setDeleteConfirmModal(true);
    setShow(false);
  };

  return (
    <>
      <Container>
        <Modal
          show={show || deleteConfirmModal || deleteSuccessModal}
          setShow={() => {
            setShow();
            setDeleteConfirmModal();
            setDeleteSuccesModal();
          }}
          className="modaldialog createModalMeeting"
          ButtonTitle={ModalTitle}
          modalBodyClassName="modalMeetingCreateBody"
          modalFooterClassName="modalMeetingCreateFooter"
          modalHeaderClassName={"d-none"}
          centered
          size={"xl"}
          ModalBody={
            <>
              {show ? (
                <>
                  <Container className="container-payment">
                    <Row className="mt-5">
                      <Col
                        lg={9}
                        md={9}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-start"
                      >
                        <Form.Control
                          ref={Invoice}
                          name="Invoice"
                          onKeyDown={(event) =>
                            enterHandler(event, InvoiceStart)
                          }
                          applyClass="form-control2"
                          className="form-control-textfields"
                          placeholder={t("Invoice-#")}
                          onChange={EditUserHandler}
                          value={paymentInvoiceSection.Invoice}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg={4} md={4} sm={12} xs={12}>
                        <label className="date-range">Invoice Date Range</label>
                        <Select
                          ref={InvoiceStart}
                          onKeyDown={(event) => enterHandler(event, InvoiceEnd)}
                          name="InvoiceStart"
                          applyClass="form-control2"
                          className="payment-history-select"
                          placeholder="Start Date"
                          onChange={EditUserHandler}
                          value={paymentInvoiceSection.InvoiceStart}
                        />
                      </Col>
                      <Col
                        lg={1}
                        md={1}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-center mt-4"
                      >
                        <label className="date-range"> - </label>
                      </Col>

                      <Col lg={4} md={4} sm={12} xs={12} className="mt-4">
                        <Select
                          ref={InvoiceEnd}
                          onKeyDown={(event) =>
                            enterHandler(event, PaymentStart)
                          }
                          name="InvoiceEnd"
                          applyClass="form-control2"
                          className="payment-history-select"
                          placeholder="End Date"
                          value={paymentInvoiceSection.InvoiceEnd}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-5">
                      <Col lg={4} md={4} sm={12} xs={12}>
                        <Col></Col>
                        <label className="date-range">Payment Date Range</label>
                        <Select
                          name="PaymentStart"
                          ref={PaymentStart}
                          onKeyDown={(event) => enterHandler(event, PaymentEnd)}
                          applyClass="form-control2"
                          className="payment-history-select"
                          placeholder="Start Date"
                          value={paymentInvoiceSection.PaymentStart}
                        />
                      </Col>
                      <Col
                        lg={1}
                        md={1}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-center mt-4"
                      >
                        <label className="date-range"> - </label>
                      </Col>

                      <Col lg={4} md={4} sm={12} xs={12} className="mt-4">
                        <Select
                          name="PaymentEnd"
                          ref={PaymentBy}
                          onKeyDown={(event) => enterHandler(event, Invoice)}
                          applyClass="form-control2"
                          className="payment-history-select"
                          placeholder="End Date"
                          value={paymentInvoiceSection.PaymentEnd}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-5">
                      <Col lg={4} md={4} sm={12} xs={12}>
                        <Select
                          applyClass="form-control2"
                          className="payment-history-select"
                          placeholder="Payment By"
                          value={paymentInvoiceSection.PaymentBy}
                        />
                      </Col>

                      <Col
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        className="mt-1 d-flex justify-content-end"
                      >
                        <label className="surcharge">
                          With Late Surcharge{" "}
                        </label>
                      </Col>

                      <Col lg={3} md={3} sm={12} xs={12} className="mt-1">
                        <Checkbox />
                      </Col>
                    </Row>
                  </Container>
                </>
              ) : deleteConfirmModal ? (
                <>
                  <Container>
                    <>
                      <Row>
                        <Col lg={12} md={12} sm={12} xs={12}>
                          <label>
                            Are you sure you want to delete this account?
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6} md={6} sm={12} xs={12}>
                          <Button text="Delete" />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                          <Button text="Cancel" />
                        </Col>
                      </Row>
                    </>
                  </Container>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-4">
                  <Col
                    lg={9}
                    md={9}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text="Reset"
                      className="icon-PaymentHistory-ResetBtn"
                    />
                  </Col>

                  <Col
                    lg={3}
                    md={3}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      text="Search"
                      onClick={openDeleteModal}
                      className="icon-PaymentHistory-SearchBtn"
                    />
                  </Col>
                </Row>
              </Col>
            </>
          }
        />
      </Container>
    </>
  );
};

export default PaymentInvoiceFilterModal;
