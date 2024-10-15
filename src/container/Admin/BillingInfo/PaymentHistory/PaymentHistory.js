import React, { useState, useRef, useMemo, useEffect } from "react";
import styles from "./PaymentHistory.module.css";
import countryList from "react-select-country-list";
import "react-phone-input-2/lib/style.css";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import Paymenthistoryhamberge from "../../../../assets/images/newElements/paymenthistoryhamberge.png";
import Select from "react-select";
import {
  Button,
  Checkbox,
  Table,
  Modal,
  Notification,
  Loader,
} from "../../../../components/elements";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  removeDashesFromDate,
  _justShowDateformatBilling,
  convertGMTDateintoUTC,
} from "../../../../commen/functions/date_formater";
import { invoiceandpaymenthistory } from "../../../../store/actions/OrganizationBillings_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getPaymentMethodApi from "../../../../store/actions/Admin_PaymentMethod";
import searchPaymentHistoryApi from "../../../../store/actions/Admin_SearchPaymentHistory";
import { Spin } from "antd";
import moment from "moment";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const EditUser = ({ show, setShow, ModalTitle }) => {
  const { OrganizationBillingReducer, adminReducer, LanguageReducer } =
    useSelector((state) => state);
  console.log(adminReducer, "adminReduceradminReduceradminReducer");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([]);
  let currentLanguage = localStorage.getItem("i18nextLng");
  moment.locale(currentLanguage);

  // for payment history
  const [paymentHistoryModal, setPaymentHistoryModal] = useState(false);
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const { t } = useTranslation();

  const [rowSize, setRowSize] = useState(50);
  const [rows, setRows] = useState([]);

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
  console.log(
    paymentInvoiceSection,
    "paymentInvoiceSectionpaymentInvoiceSectionpaymentInvoiceSection"
  );
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");
  const [paymentMethodValue, setPaymentMethodValue] = useState({
    label: "",
    value: 0,
  });
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
      // let valueCheck = value.replace(/[^0-9]/g, "");
      // if (valueCheck !== "") {
      setpaymentInvoiceSection({
        ...paymentInvoiceSection,
        Invoice: value.trimStart(),
      });
      // }
    } else if (name === "Invoice" && value === "") {
      setpaymentInvoiceSection({
        ...paymentInvoiceSection,
        Invoice: "",
      });
    }
  };

  //Open payment history modal

  const openPaymentModal = async () => {};

  // open delete modal on search button

  const iconModalHandler = async (e) => {
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
    setLateSurcharge(false);
    setPaymentMethodValue({
      label: "",
      value: 0,
    });
  };

  const resetPaymentHandler = () => {
    let Data = {
      InvoiceNo: "",
      InvoiceStartDate: "",
      InvoiceEndDate: "",
      PaymentStartDate: "",
      PaymentEndDate: "",
      PaymentID: 0,
      IsLateSurcharge: true,
    };
    dispatch(
      searchPaymentHistoryApi(navigate, Data, t, setPaymentHistoryModal, 1)
    );
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
    setPaymentMethodValue({
      value: 0,
      label: "",
    });
  };
  // convertGMTDateintoUTC

  const searchPaymentHandler = () => {
    let Data = {
      InvoiceNo: paymentInvoiceSection.Invoice,
      InvoiceStartDate:
        invoiceStartDate !== "" ? convertGMTDateintoUTC(invoiceStartDate) : "",
      InvoiceEndDate:
        invoiceEndDate !== "" ? convertGMTDateintoUTC(invoiceEndDate) : "",
      PaymentStartDate:
        paymentStartDate !== "" ? convertGMTDateintoUTC(paymentStartDate) : "",
      PaymentEndDate:
        paymentEndDate !== "" ? convertGMTDateintoUTC(paymentEndDate) : "",
      PaymentID: paymentMethodValue.value,
      IsLateSurcharge: lateSurcharge,
    };
    dispatch(
      searchPaymentHistoryApi(navigate, Data, t, setPaymentHistoryModal, 1)
    );
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
    setPaymentMethodValue({
      value: 0,
      label: "",
    });
  };

  const EditUserColumn = [
    {
      title: (
        <span className={styles["tableColLabel"]}>{t("Invoice-number")}</span>
      ),
      dataIndex: "InvoiceNo",
      key: "InvoiceNo",
      align: "left",
      render: (text, record) => {
        return (
          <>
            <span className={styles["NameStylesTable"]}>{text}</span>
          </>
        );
      },
    },
    {
      title: (
        <span className={styles["tableColLabel"]}>{t("Invoice-date")}</span>
      ),
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      align: "center",
      render: (text, data) => {
        return (
          <>
            <span className={styles["DesignationStyles"]}>
              {_justShowDateformatBilling(text)}
            </span>
          </>
        );
      },
    },
    {
      title: (
        <span className={styles["tableColLabel"]}>{t("Payment-date")}</span>
      ),
      dataIndex: "paymentdate",
      key: "paymentdate",
      align: "center",
      render: (text, data) => {
        return (
          <>
            <span className={styles["DesignationStyles"]}>
              {_justShowDateformatBilling(text)}
            </span>
          </>
        );
      },
    },
    {
      title: t("Paid-amount"),
      dataIndex: "paidamount",
      key: "paidamount",
      align: "center",
      render: (text, data) => {
        return (
          <>
            <span className={styles["DesignationStyles"]}>${text}</span>
          </>
        );
      },
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

  const handleChangePaymentMethod = (data) => {
    setpaymentInvoiceSection({
      ...paymentInvoiceSection,
      PaymentBy: data.value,
    });
    setPaymentMethodValue({
      ...paymentMethodValue,
      label: data.label,
      value: data.value,
    });
  };
  console.log(
    paymentMethodValue,
    "paymentMethodValuepaymentMethodValuepaymentMethodValue"
  );

  function onChangeSurcharge(e) {
    setLateSurcharge(e.target.checked);
  }
  const handleSearchInvoice = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "InvoiceNum" && value !== "") {
      // let valueCheck = value.replace(/[^0-9]/g, "")
      // if (valueCheck !== "") {
      setInvoiceNumber(value);
      // }
    } else if (name === "InvoiceNum" && value === "") {
      setInvoiceNumber("");
    }
  };
  // useEffect(() => {
  //   if (OrganizationBillingReducer.getInvoiceAndPaymentHistory !== null) {
  //     console.log(
  //       OrganizationBillingReducer,
  //       "OrganizationBillingReducer.paymentInfoOrganizationBillingReducer.paymentInfo"
  //     );
  //     let paymentHistoryData = [];
  //     if (OrganizationBillingReducer.getInvoiceAndPaymentHistory !== null) {
  //       OrganizationBillingReducer.getInvoiceAndPaymentHistory.paymentInfo.paymentHistory.map(
  //         (data, index) => {
  //           paymentHistoryData.push({
  //             InvoiceNo: data.invoiceCustomerNumber,
  //             invoiceDate: data.invoiceDate,
  //             paymentdate: data.paymentRecieveDate,
  //             paidamount: data.paidAmount,
  //           });
  //         }
  //       );
  //     }
  //     setRows(paymentHistoryData);
  //   }
  // }, [OrganizationBillingReducer.getInvoiceAndPaymentHistory]);

  useEffect(() => {
    try {
      if (adminReducer.searchPaymentHistory !== null) {
        let getPaymentHistory =
          adminReducer?.searchPaymentHistory?.paymentInfo?.paymentHistory;
        if (getPaymentHistory.length > 0) {
          let newArr = [];
          getPaymentHistory.map((data, index) => {
            newArr.push({
              InvoiceNo: data.invoiceCustomerNumber,
              invoiceDate: data.invoiceDate,
              paymentdate: data.paymentRecieveDate,
              paidamount: data.paidAmount,
            });
          });
          setRows(newArr);
        } else {
          setRows([]);
        }
      } else {
        setRows([]);
      }
    } catch (error) {}
  }, [adminReducer.searchPaymentHistory]);

  useEffect(() => {
    try {
      if (
        adminReducer.PaymentMethods !== null &&
        adminReducer.PaymentMethods.length > 0
      ) {
        let newArr = [];
        adminReducer.PaymentMethods.map((data, index) => {
          newArr.push({
            label: data.methodName,
            value: data.pK_PaymentMethodID,
          });
        });
        setPaymentMethods(newArr);
      }
    } catch (error) {}
    return () => {
      setPaymentMethodValue({
        ...paymentMethodValue,
        label: "",
        value: 0,
      });
    };
  }, [adminReducer.PaymentMethods]);

  useEffect(() => {
    let Data = {
      InvoiceNo: "",
      InvoiceStartDate: "",
      InvoiceEndDate: "",
      PaymentStartDate: "",
      PaymentEndDate: "",
      PaymentID: 0,
      IsLateSurcharge: true,
    };
    dispatch(
      searchPaymentHistoryApi(navigate, Data, t, setPaymentHistoryModal)
    );
    // dispatch(invoiceandpaymenthistory(navigate, t));
    dispatch(getPaymentMethodApi(navigate, t));
  }, []);

  const handleSubmitSearchInvoice = (e) => {
    e.preventDefault();
    if (InvoiceNumber.trim() !== "") {
      let Data = {
        InvoiceNo: InvoiceNumber,
        InvoiceStartDate: "",
        InvoiceEndDate: "",
        PaymentStartDate: "",
        PaymentEndDate: "",
        PaymentID: 0,
        IsLateSurcharge: true,
      };
      dispatch(searchPaymentHistoryApi(navigate, Data, t));
    } else {
      let Data = {
        InvoiceNo: "",
        InvoiceStartDate: "",
        InvoiceEndDate: "",
        PaymentStartDate: "",
        PaymentEndDate: "",
        PaymentID: 0,
        IsLateSurcharge: true,
      };
      dispatch(searchPaymentHistoryApi(navigate, Data, t));
    }
  };

  useEffect(() => {
    if (
      adminReducer.ResponseMessage !== "" &&
      adminReducer.ResponseMessage !== t("No-data-available")
    ) {
      showMessage(adminReducer.ResponseMessage, "success", setOpen);
    }
  }, [adminReducer.ResponseMessage]);

  useEffect(() => {
    if (
      OrganizationBillingReducer.ResponseMessage !== "" &&
      OrganizationBillingReducer.ResponseMessage !== t("No-data-available")
    ) {
      showMessage(
        OrganizationBillingReducer.ResponseMessage,
        "success",
        setOpen
      );
    }
  }, [OrganizationBillingReducer.ResponseMessage]);

  return (
    <>
      <Container>
        <Row className={styles["filterdrow"]}>
          <Col
            lg={7}
            md={7}
            sm={12}
            xs={12}
            className="d-flex gap-3 align-items-center"
          >
            <label className={styles["Edit-Main-Heading"]}>
              {t("Payment-history")}
            </label>
            <Button text={"Download"} className={styles["DownloadButton"]} />
          </Col>
          <Col
            lg={5}
            md={5}
            sm={12}
            xs={12}
            className={styles["searchbar-textfield"]}
          >
            <Form onSubmit={handleSubmitSearchInvoice}>
              <Form.Control
                className={styles["paymenthistory_searchbar"]}
                labelclass="filter"
                name="InvoiceNum"
                value={InvoiceNumber || ""}
                onChange={handleSearchInvoice}
                placeholder={t("Invoice-number")}
              />
            </Form>
            <div className={styles["filterModal"]}>
              <img
                draggable="false"
                src={Paymenthistoryhamberge}
                width={20}
                height={20}
                onClick={iconModalHandler}
              />
            </div>
          </Col>
        </Row>

        <Row className={styles["tablecolumnrow"]}>
          <Col lg={12} md={12} sm={12}>
            <Table
              column={EditUserColumn}
              rows={rows}
              className={styles["paymentHistoryTable"]}
              loading={{ indicator: <Spin />, spinning: adminReducer?.Spinner }}
              // scroll={{ x: 'max-content' }}
              pagination={false}
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
                    <span className="modal-labels mt-3 FontArabicRegular">
                      {t("Invoice-start")}
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
                    <span className="modal-labels mt-3 FontArabicRegular">
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
                    <span className="modal-labels mt-3 FontArabicRegular">
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
                    <span className="modal-labels mt-3 FontArabicRegular">
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
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="Select-box-column mt-2 FontArabicRegular"
                  >
                    <Select
                      ref={PaymentBy}
                      onKeyDown={(event) => enterHandler(event, Invoice)}
                      applyClass="form-control2"
                      options={paymentMethods}
                      onChange={handleChangePaymentMethod}
                      placeholder={t("Payment-by")}
                      name="PaymentBy"
                    />
                  </Col>

                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="mt-2 d-flex justify-content-end mt-4"
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
                        onClick={searchPaymentHandler}
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
      {OrganizationBillingReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default EditUser;
