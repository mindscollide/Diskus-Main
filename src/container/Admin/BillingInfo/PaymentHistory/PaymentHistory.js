import React, { useState, useRef, useMemo } from "react";
import styles from "./PaymentHistory.module.css";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";

import Select from "react-select";
// import { Select } from "antd";
import {
  Button,
  TextField,
  Checkbox,
  Paper,
  FilterBar,
  SearchInput,
  Table,
  Modal,
} from "../../../../components/elements";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  removeDashesFromDate,
  TimeDisplayFormat,
} from "../../../../commen/functions/date_formater";
import {
  Sliders2,
  Trash,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);
  const [deleteEditModal, setDeleteEditModal] = useState(false);

  // for payment history
  const [paymentHistoryModal, setPaymentHistoryModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccesModal] = useState(false);

  const [errorBar, setErrorBar] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState(
    "Name Field Is Empty"
  );
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    "Email Field Is Empty"
  );

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const { t } = useTranslation();

  const [rowSize, setRowSize] = useState(50);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSelect = (country) => {
    setSelectedCountry(country);
  };

  const [value, setValue] = useState();
  const options = useMemo(() => countryList().getData(), []);

  // ref to move on next field
  const Invoice = useRef(null);
  const InvoiceStart = useRef(null);
  const InvoiceEnd = useRef(null);
  const PaymentStart = useRef(null);
  const PaymentEnd = useRef(null);
  const PaymentBy = useRef(null);

  //state for FilterbarModal
  const [filterSection, setFilterSection] = useState({
    Names: "",
    OrganizationRoles: "",
    EnableRoles: "",
    UserRoles: "",
    Emails: "",
  });

  //state for EditUser
  const [editUserSection, setEditUserSection] = useState({
    Name: "",
    Designation: "",
    CountryCode: "",
    Mobile: "",
    OrganizationRole: "",
    UserRole: "",
    Email: "",
    UserStatus: "",
  });

  //state for EditUser
  const [paymentInvoiceSection, setpaymentInvoiceSection] = useState({
    Invoice: "",
    InvoiceStart: "",
    InvoiceEnd: "",
    PaymentStart: "",
    PaymentEnd: "",
    PaymentBy: "",
  });
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");

  const [paymentStartDate, setPaymentStartDate] = useState("");
  const [paymentEndDate, setPaymentEndDate] = useState("");

  // Enter Handler to move on next field
  const enterHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  const EditUserHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Invoice" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setpaymentInvoiceSection({
          ...paymentInvoiceSection,
          Invoice: valueCheck.trimStart(),
        });
      }
    } else if (name === "Invoice" && value === "") {
      setpaymentInvoiceSection({
        ...paymentInvoiceSection,
        Invoice: "",
      });
    }
  };

  //close modal on update button it's created temperary to check modal
  const closeOnUpdateBtn = () => {
    setShow(false);
    setDeleteConfirmModal(false);
  };

  //Open payment history modal

  const openPaymentModal = async () => {};

  // open delete modal on search button

  const openDeleteSuccess = async () => {
    setDeleteSuccesModal(true);
    setDeleteConfirmModal(false);
    setPaymentHistoryModal(false);
  };

  const openDeleteModal = async () => {
    setDeleteConfirmModal(true);
    setPaymentHistoryModal(false);
  };

  const iconModalHandler = async (e) => {
    //  await dispatch(allAssignessList(1));
    setDeleteConfirmModal(false);
    setPaymentHistoryModal(true);
    setpaymentInvoiceSection({
      Invoice: "",
      InvoiceStart: "",
      InvoiceEnd: "",
      PaymentStart: "",
      PaymentEnd: "",
      PaymentBy: "",
    });
    setInvoiceStartDate("");
    setInvoiceEndDate("");
    setPaymentStartDate("");
    setPaymentEndDate("");
  };

  const resetPaymentHandler = () => {
    setpaymentInvoiceSection({
      Invoice: "",
      InvoiceStart: "",
      InvoiceEnd: "",
      PaymentStart: "",
      PaymentEnd: "",
      PaymentBy: "",
    });
    setInvoiceStartDate("");
    setInvoiceEndDate("");
    setPaymentStartDate("");
    setPaymentEndDate("");
  };

  const handlerSearch = () => {
    if (filterSection.Names !== "" && filterSection.Emails !== "") {
      // if (validationEmail(signUpDetails.Email) === true) {
      //   navigate("/packageselection");
      // } else {
      //   setOpen({
      //     ...open,
      //     open: true,
      //     message: "Email should be in Email Format",
      //   });
      // }
      setErrorBar(true);
    } else {
      setErrorBar(true);
      setOpen({
        ...open,
        open: true,
        message: "Please fill all the fields",
      });
    }
  };

  const Option = [
    { value: 100, title: "100" },
    { value: 250, title: "250" },
    { value: 500, title: "500" },
  ];

  const EditUserColumn = [
    {
      // title: "Title",
      title: t("Invoice-#"),
      dataIndex: "title",
      key: "title",
      width: "150px",
    },
    {
      title: t("Invoice-Date"),
      dataIndex: "status",
      key: "status",
      width: "10rem",
    },
    {
      title: t("Payment-Date"),
      dataIndex: "host",
      key: "host",
      width: "10rem",
    },
    {
      title: t("Paid-Amount"),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "13rem",
    },
    {
      title: "",
      dataIndex: "attach",
      key: "attach",
      width: "5rem",
    },
  ];

  const dateHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("eee", name);

    setpaymentInvoiceSection({
      ...paymentInvoiceSection,
      [name]: removeDashesFromDate(value),
    });
    if (name === "InvoiceEnd") {
      setInvoiceEndDate(value);
    } else {
      setInvoiceStartDate(value);
    }
  };

  const paymentDateHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("eee", name);

    setpaymentInvoiceSection({
      ...paymentInvoiceSection,
      [name]: removeDashesFromDate(value),
    });
    if (name === "PaymentEnd") {
      setPaymentEndDate(value);
    } else {
      setPaymentStartDate(value);
    }
  };

  return (
    <Container>
      <Row className={styles["filterdrow"]}>
        <Col lg={4} md={4} sm={6} xs={12}>
          <label className={styles["Edit-Main-Heading"]}>
            {t("Payment-History")}
          </label>
        </Col>
        <Col
          lg={5}
          md={5}
          sm={6}
          xs={12}
          className={styles["searchbar-textfield"]}
        >
          <TextField
            applyClass="form-control2"
            className="mx-2"
            labelClass="filter"
          />
          <div className={styles["filterModal"]}>
            <Sliders2 onClick={iconModalHandler} />
          </div>
        </Col>
        <Col lg={3} md={3} sm={6} xs={12} />

        {/* <Col lg={1} md={1} sm={12} className="d-flex justify-content-end">
          <Button
            className={styles["btnEditReset"]}
            text="Search"
            onClick={updateSuccessFull}
          />
        </Col> */}
      </Row>

      <Row className={styles["tablecolumnrow"]}>
        <Col lg={12} md={12} sm={12}>
          <Table
            column={EditUserColumn}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: rowSize,
              showSizeChanger: true,
              pageSizeOptions: ["100 ", "150", "200"],
            }}
          />
        </Col>
      </Row>

      <Modal
        show={paymentHistoryModal || deleteConfirmModal || deleteSuccessModal}
        setShow={() => {
          setPaymentHistoryModal();
          setDeleteConfirmModal();
          setDeleteSuccesModal();
        }}
        ButtonTitle={ModalTitle}
        centered
        size={
          paymentHistoryModal &&
          deleteConfirmModal &&
          deleteSuccessModal === "lg"
        }
        ModalBody={
          <>
            {paymentHistoryModal ? (
              <>
                {/* <Container className={styles["Edit-modal-container"]}>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <label className={styles["Edit-label-heading"]}>
                        {t("Edit")}
                      </label>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Name")}</p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        ref={Name}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, Designation)
                        }
                        placeholder="Name"
                        className={styles["formcontrol-names-fields"]}
                        maxLength={200}
                        applyClass="form-control2"
                        name="Name"
                        onChange={EditUserHandler}
                        value={editUserSection.Name}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Designation")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        placeholder="Designation"
                        className={styles["formcontrol-names-fields"]}
                        ref={Designation}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRole)
                        }
                        maxLength={200}
                        applyClass="form-control2"
                        name="Designation"
                        onChange={EditUserHandler}
                        value={editUserSection.Designation}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Mobile")}</p>
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <PhoneInput
                        ref={Mobile}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, OrganizationRole)
                        }
                        className={styles["formcontrol-phone-fields"]}
                        name="Mobile"
                        defaultCountry="PK"
                        maxLength={50}
                        placeholder={t("Enter-Phone-Number")}
                        onSelect={handleSelect}
                      />
                      {selectedCountry && (
                        <p>CODE : {selectedCountry.dialCode}</p>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("Organization-Role")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Select
                        name="OrganizationRole"
                        ref={OrganizationRole}
                        onKeyDown={(event) => enterKeyHandler(event, UserRole)}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("User-Role")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Select
                        ref={UserRole}
                        onKeyDown={(event) => enterKeyHandler(event, Name)}
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>
                        {t("UserStatus")}
                      </p>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Select
                        ref={UserStatus}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, UserStatus)
                        }
                        className={styles["selectbox-Edit-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Edit-Name-label"]}>{t("Email")}</p>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        disabled
                        placeholder="Email"
                        applyClass="form-control2"
                        className={styles["formcontrol-names-fields"]}
                      />
                    </Col>
                  </Row>
                </Container> */}

                <Container className={styles["container-payment"]}>
                  <Row className="mt-2">
                    <Col
                      lg={9}
                      md={9}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <Form.Control
                        ref={Invoice}
                        onKeyDown={(event) => enterHandler(event, InvoiceStart)}
                        name="Invoice"
                        applyClass="form-control2"
                        className={styles["form-control-textfields"]}
                        placeholder="Invoice #"
                        onChange={EditUserHandler}
                        value={paymentInvoiceSection.Invoice}
                      />
                    </Col>
                  </Row>

                  {/* <Row className="mt-4">
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <label className={styles["date-range"]}>
                        Invoice Date Range
                      </label>
                      <Select
                        ref={InvoiceStart}
                        onKeyDown={(event) => enterHandler(event, InvoiceEnd)}
                        name="InvoiceStart"
                        applyClass="form-control2"
                        className={styles["payment-history-select"]}
                        placeholder="Start Date"
                        onChange={EditUserHandler}
                        value={paymentInvoiceSection.InvoiceStart}
                      />
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-center mt-4"
                    >
                      <label className={styles["date-range"]}> - </label>
                    </Col>

                    <Col lg={5} md={5} sm={12} xs={12} className="mt-4">
                      <Select
                        ref={InvoiceEnd}
                        onKeyDown={(event) => enterHandler(event, PaymentStart)}
                        name="InvoiceEnd"
                        applyClass="form-control2"
                        className={styles["payment-history-select"]}
                        placeholder="End Date"
                        value={paymentInvoiceSection.InvoiceEnd}
                      />

      
                    </Col>
                  </Row> */}

                  <Row className="mt-4">
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <span className="mt-3">InvoiceStart</span>
                      <Form.Control
                        ref={InvoiceStart}
                        onKeyDown={(event) => enterHandler(event, InvoiceEnd)}
                        className={
                          styles["InvoiceStart-Date-filtermodalmeeting"]
                        }
                        type="date"
                        name="InvoiceStart"
                        placeholder={t("InvoiceStart")}
                        applyClass="form-control2"
                        onChange={dateHandler}
                        value={invoiceStartDate}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <span className="mt-3">InvoiceEnd</span>
                      <Form.Label className="d-none"></Form.Label>
                      <Form.Control
                        ref={InvoiceEnd}
                        onKeyDown={(event) => enterHandler(event, PaymentStart)}
                        className={
                          styles["InvoiceStart-Date-filtermodalmeeting"]
                        }
                        type="date"
                        name="InvoiceEnd"
                        placeholder={t("InvoiceEnd")}
                        applyClass="form-control2"
                        onChange={dateHandler}
                        value={invoiceEndDate}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <span className="mt-3">PaymentStart</span>
                      <Form.Control
                        ref={PaymentStart}
                        onKeyDown={(event) => enterHandler(event, PaymentEnd)}
                        className={
                          styles["InvoiceStart-Date-filtermodalmeeting"]
                        }
                        type="date"
                        name="PaymentStart"
                        placeholder={t("PaymentStart")}
                        applyClass="form-control2"
                        onChange={paymentDateHandler}
                        value={paymentStartDate}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <span className="mt-3">PaymentEnd</span>
                      <Form.Label className="d-none"></Form.Label>
                      <Form.Control
                        ref={PaymentEnd}
                        onKeyDown={(event) => enterHandler(event, PaymentBy)}
                        className={
                          styles["InvoiceStart-Date-filtermodalmeeting"]
                        }
                        type="date"
                        name="PaymentEnd"
                        placeholder={t("PaymentEnd")}
                        applyClass="form-control2"
                        onChange={paymentDateHandler}
                        value={paymentEndDate}
                      />
                    </Col>
                  </Row>

                  {/* <Row className="mt-5 mb-2">
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <Col></Col>
                      <label className={styles["date-range"]}>
                        Payment Date Range
                      </label>
                      <Select
                        name="PaymentStart"
                        ref={PaymentStart}
                        onKeyDown={(event) => enterHandler(event, PaymentEnd)}
                        applyClass="form-control2"
                        className={styles["payment-history-select"]}
                        placeholder="Start Date"
                        value={paymentInvoiceSection.PaymentStart}
                      />
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      xs={12}
                      className="d-flex justify-content-center mt-4"
                    >
                      <label className={styles["date-range"]}> - </label>
                    </Col>

                    <Col lg={5} md={5} sm={12} xs={12} className="mt-4">
                      <Select
                        name="PaymentEnd"
                        ref={PaymentBy}
                        onKeyDown={(event) => enterHandler(event, Invoice)}
                        applyClass="form-control2"
                        className={styles["payment-history-select"]}
                        placeholder="End Date"
                        value={paymentInvoiceSection.PaymentEnd}
                      />
                    </Col>
                  </Row> */}

                  <Row className="mt-5">
                    <Col lg={5} md={5} sm={12} xs={12} className="mt-2">
                      <Select
                        ref={PaymentBy}
                        onKeyDown={(event) => enterHandler(event, Invoice)}
                        applyClass="form-control2"
                        className={styles["payment-history-select"]}
                        placeholder="Payment By"
                        value={paymentInvoiceSection.PaymentBy}
                        name="PaymentBy"
                      />
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      className="mt-3 d-flex justify-content-end"
                    >
                      <label className={styles["surcharge"]}>
                        With Late Surcharge{" "}
                      </label>
                    </Col>

                    <Col lg={1} md={1} sm={12} xs={12} className="mt-3">
                      <Checkbox />
                    </Col>
                  </Row>
                </Container>
              </>
            ) : deleteConfirmModal ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <ExclamationTriangleFill size={50} />
                  </Col>
                </Row>
                <Row className="mb-3 mt-4">
                  <Col lg={2} md={2} sm={12} />
                  <Col
                    lg={8}
                    md={8}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <label className={styles["successfull-label"]}>
                      {"Are You Sure You Want To Delete This Account ?"}
                    </label>
                  </Col>
                  <Col lg={2} md={2} sm={12} />
                </Row>
              </>
            ) : deleteSuccessModal ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Trash
                      size={60}
                      className={styles["Delete-Successfull-label"]}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={2} md={2} sm={12} />

                  <Col
                    lg={8}
                    md={8}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <label className={styles["Account-Deleted-label"]}>
                      {"Account Deleted"}
                    </label>
                  </Col>
                  <Col lg={2} md={2} sm={12} />
                </Row>

                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <label className={styles["Delete-Successfull-label"]}>
                      You are Always welcome to join DiskUs again !
                    </label>
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
        ModalFooter={
          <>
            {paymentHistoryModal ? (
              <>
                <Container>
                  <Col sm={12} md={12} lg={12}>
                    <Row className="mb-5">
                      <Col sm={12} md={12} lg={12} />
                      <Col
                        lg={9}
                        md={9}
                        sm={6}
                        xs={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          text="Reset"
                          className={styles["icon-PaymentHistory-ResetBtn"]}
                          onClick={resetPaymentHandler}
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
                          className={styles["icon-PaymentHistory-SearchBtn"]}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3" />
                  </Col>
                </Container>
              </>
            ) : deleteConfirmModal ? (
              <>
                <Container>
                  <Col sm={12} md={12} lg={12}>
                    <Row className="mb-5">
                      <Col sm={12} md={12} lg={12} />
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          text="Delete"
                          onClick={openDeleteSuccess}
                          className={styles["icon-PaymentHistory-ResetBtn"]}
                        />
                      </Col>

                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        className="d-flex justify-content-start"
                      >
                        <Button
                          text="Cancel"
                          className={styles["icon-PaymentHistory-SearchBtn"]}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3" />
                  </Col>
                </Container>
              </>
            ) : deleteSuccessModal ? (
              <>
                <Container>
                  <Col sm={12} md={12} lg={12}>
                    <Row className="mb-5 mt-5">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-center"
                      >
                        <Button
                          text="GO TO LOGIN SCREEN"
                          className={styles["icon-PaymentHistory-DeleteBtn"]}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3" />
                  </Col>
                </Container>
              </>
            ) : null}
          </>
        }
      />
    </Container>
  );
};

export default EditUser;
