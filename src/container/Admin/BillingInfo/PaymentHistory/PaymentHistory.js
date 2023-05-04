import React, { useState, useRef, useMemo, useEffect } from "react";
import styles from "./PaymentHistory.module.css";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import Paymenthistoryhamberge from "../../../../assets/images/newElements/paymenthistoryhamberge.png";
import FailedIcon from "../../../../assets/images/failed.png";
import DeletedIcon from "../../../../assets/images/Deleted-Icon.png";
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
import { invoiceandpaymenthistory } from "../../../../store/actions/OrganizationBillings_actions";
import { useDispatch, useSelector } from "react-redux";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const { OrganizationBillingReducer } = useSelector(state => state)
  const [filterBarModal, setFilterBarModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();

  const [isUpdateSuccessfully, setIsUpdateSuccessfully] = useState(false);
  const [deleteEditModal, setDeleteEditModal] = useState(false);

  // for payment history
  const [paymentHistoryModal, setPaymentHistoryModal] = useState(false);


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
      let valueCheck = value.replace(/[^0-9]/g, "");
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



  //Open payment history modal

  const openPaymentModal = async () => { };

  // open delete modal on search button





  const iconModalHandler = async (e) => {
    //  await dispatch(allAssignessList(1));
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
    setLateSurcharge(false);
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
      title: (
        <span className={styles["tableColLabel"]}>{t("Invoice-number")}</span>
      ),
      dataIndex: "title",
      key: "title",
      width: "150px",
    },
    {
      title: (
        <span className={styles["tableColLabel"]}>{t("Invoice-date")}</span>
      ),
      dataIndex: "status",
      key: "status",
      width: "10rem",
    },
    {
      title: (
        <span className={styles["tableColLabel"]}>{t("Payment-date")}</span>
      ),
      dataIndex: "host",
      key: "host",
      width: "10rem",
    },
    {
      title: t("Paid-amount"),
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

  const dateHandler = (date) => {
    // let name = e.target.name;
    // let value = e.target.value;
    // console.log("eee", name);
    // setpaymentInvoiceSection({
    //   ...paymentInvoiceSection,
    //   [name]: removeDashesFromDate(value),
    // });
    // if (name === "InvoiceEnd") {
    //   setInvoiceEndDate(value);
    // } else {
    //   setInvoiceStartDate(value);
    // }
    // setpaymentInvoiceSection({
    //   ...paymentInvoiceSection,
    //   InvoiceStart: e.target.value,
    // });
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

  const handleClose = () => {
    setPaymentHistoryModal(false);
  };

  const [lateSurcharge, setLateSurcharge] = useState(false);

  function onChangeSurcharge(e) {
    setLateSurcharge(e.target.checked);
  }
  useEffect(() => {
    dispatch(invoiceandpaymenthistory(t))
  }, [])
  return (
    <Container>
      <Row className={styles["filterdrow"]}>
        <Col lg={4} md={4} sm={12} xs={12}>
          <label className={styles["Edit-Main-Heading"]}>
            {t("Payment-history")}
          </label>
        </Col>
        <Col
          lg={5}
          md={5}
          sm={12}
          xs={12}
          className={styles["searchbar-textfield"]}
        >
          <Form.Control
            className={styles["paymenthistory_searchbar"]}
            labelClass="filter"
            placeholder={t("Invoice-number")}
          />
          <div className={styles["filterModal"]}>
            <img
              src={Paymenthistoryhamberge}
              width={20}
              height={20}
              onClick={iconModalHandler}
            />
          </div>
        </Col>
        <Col lg={3} md={3} sm={false} xs={12} />
      </Row>

      <Row className={styles["tablecolumnrow"]}>
        <Col lg={12} md={12} sm={12}>
          <Table
            column={EditUserColumn}
            className={styles["paymentHistoryTable"]}
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
        show={paymentHistoryModal}
        setShow={() => {
          setPaymentHistoryModal();
        }}
        onHide={handleClose}
        ButtonTitle={ModalTitle}
        centered
        size="md"
        ModalBody={
          <>
            <Container className={styles["container-payment"]}>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
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
                    placeholder={t("Invoice-number")}
                    onChange={EditUserHandler}
                    value={paymentInvoiceSection.Invoice}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="PaymentHistory-Datpickers"
                >
                  <span className="modal-labels mt-3">
                    {t("InvoiceStart")}
                  </span>
                  <DatePicker
                    ref={InvoiceStart}
                    onKeyDown={(event) => enterHandler(event, InvoiceEnd)}
                    selected={invoiceStartDate}
                    onChange={(date) => setInvoiceStartDate(date)}
                    className="form-control"
                    name="InvoiceStart"
                    placeholder={t("InvoiceStart")}
                  />
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="PaymentHistory-Datpickers"
                >
                  <span className="modal-labels mt-3">
                    {t("Invoice-end")}
                  </span>
                  <Form.Label className="d-none"></Form.Label>
                  {/* <Form.Control
                        ref={InvoiceEnd}
                        onKeyDown={(event) => enterHandler(event, PaymentStart)}
                        className={
                          styles["InvoiceStart-Date-filtermodalmeeting"]
                        }
                        type="date"
                        placeholder={t("Invoice-end")}
                        applyClass="form-control2"
                        onChange={dateHandler}
                        value={invoiceEndDate}
                        name="InvoiceEnd"
                      /> */}
                  <DatePicker
                    ref={InvoiceEnd}
                    onKeyDown={(event) => enterHandler(event, PaymentStart)}
                    selected={invoiceEndDate}
                    onChange={(date) => setInvoiceEndDate(date)}
                    className="form-control"
                    name="InvoiceEnd"
                    placeholder={t("Invoice-end")}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="PaymentHistory-Datpickers"
                >
                  <span className="modal-labels mt-3">
                    {t("Payment-start")}
                  </span>
                  {/* <Form.Control
                        ref={PaymentStart}
                        onKeyDown={(event) => enterHandler(event, PaymentEnd)}
                        className={
                          styles["InvoiceStart-Date-filtermodalmeeting"]
                        }
                        type="date"
                        name="PaymentStart"
                        placeholder={t("Payment-start")}
                        applyClass="form-control2"
                        onChange={paymentDateHandler}
                        value={paymentStartDate}
                      /> */}
                  <DatePicker
                    ref={PaymentStart}
                    onKeyDown={(event) => enterHandler(event, PaymentEnd)}
                    selected={paymentStartDate}
                    onChange={(date) => setPaymentStartDate(date)}
                    className="form-control"
                    name="PaymentStart"
                    placeholder={t("Payment-start")}
                  />
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="PaymentHistory-Datpickers"
                >
                  <span className="modal-labels mt-3">
                    {t("Payment-end")}
                  </span>
                  <Form.Label className="d-none"></Form.Label>
                  {/* <Form.Control
                        ref={PaymentEnd}
                        onKeyDown={(event) => enterHandler(event, PaymentBy)}
                        className={
                          styles["InvoiceStart-Date-filtermodalmeeting"]
                        }
                        type="date"
                        name="PaymentEnd"
                        placeholder={t("Payment-end")}
                        applyClass="form-control2"
                        onChange={paymentDateHandler}
                        value={paymentEndDate}
                      /> */}
                  <DatePicker
                    ref={PaymentEnd}
                    onKeyDown={(event) => enterHandler(event, PaymentBy)}
                    selected={paymentEndDate}
                    onChange={(date) => setPaymentEndDate(date)}
                    className="form-control"
                    name="PaymentEnd"
                    placeholder={t("Payment-end")}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col lg={6} md={6} sm={12} xs={12} className="Select-box-column mt-2">
                  <Select
                    ref={PaymentBy}
                    onKeyDown={(event) => enterHandler(event, Invoice)}
                    applyClass="form-control2"
                    // className={"payment-history-select"}
                    placeholder={t("Payment-by")}
                    value={paymentInvoiceSection.PaymentBy}
                    name="PaymentBy"
                  />
                </Col>

                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="mt-2 d-flex justify-content-end"
                >
                  <label className={styles["surcharge"]}>
                    {t("With-late-surcharge")}
                  </label>
                </Col>

                <Col lg={1} md={1} sm={12} xs={12} className="mt-2">
                  <Checkbox
                    onChange={onChangeSurcharge}
                    checked={lateSurcharge}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
        modalHeaderClassName="Paymenthistorymodal"
        ModalFooter={
          <>
            <Container>
              <Col sm={12} md={12} lg={12}>
                <Row>
                  <Col sm={12} md={12} lg={12} />
                  <Col
                    lg={8}
                    md={8}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Reset")}
                      className={styles["icon-PaymentHistory-ResetBtn"]}
                      onClick={resetPaymentHandler}
                    />
                  </Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Search")}
                      className={styles["icon-PaymentHistory-SearchBtn"]}
                    />
                  </Col>
                </Row>
                <Row className="mb-3" />
              </Col>
            </Container>
          </>
        }
      />
    </Container>
  );
};

export default EditUser;
