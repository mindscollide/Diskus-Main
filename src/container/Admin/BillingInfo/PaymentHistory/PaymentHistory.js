import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./PaymentHistory.module.css";
import {
  CameraVideo,
  ChatDotsFill,
  Search,
  ArrowRight,
  ChevronDown,
  ArrowLeft,
} from "react-bootstrap-icons";
import moment from "moment";
import AttachmentIcon from "../../../../assets/images/Icon-metro-attachment.png";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  Loader,
  ResultMessage,
  Paper,
  Button,
  Notification,
  TextField,
  CustomDatePicker,
} from "./../../../../components/elements/";
import { useSelector, useDispatch } from "react-redux";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import PaymentInvoiceFilterModal from "./../../../../container/Admin/paymentinvoicefiltermodal/PaymentInvoiceFilterModal";

const PaymentHistory = () => {
  //For Localization
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [editFlag, setEditFlag] = useState(false);

  const iconModalHandler = async (e) => {
    //  await dispatch(allAssignessList(1));
    await setShow(true);
  };

  const columns = [
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

  return (
    <>
      <Container>
        <Row className="d-flex justify-content-start align-items-center margin-bottom-20 mt-3">
          <Col lg={3} md={3} sm={12}>
            <h1 className="Meeting-heading">{t("Payment-History")}</h1>
          </Col>
          <Col lg={1} md={1} sm={12}></Col>
          <Col lg={6} md={6} sm={12} className="positionRelative">
            <TextField
              applyClass="form-control2"
              className="mx-2"
              placeholder={t("Invoice-#")}
              labelClass="filter"
              name="HostName"
              // value={searchData.HostName}
              // change={searchHandler}
            />
            <div className="icon-text-alignment">
              <CameraVideo onClick={iconModalHandler} />
            </div>
          </Col>
          <Col lg={2} md={2} sm={12}></Col>
        </Row>
        <Row className="mx-1 meeting-table-row">
          <Col>
            <Table
              column={columns}
              className="hello"
              pagination={{pageSize: 50,  showSizeChanger: true, pageSizeOptions: ['100 ', '150', '200'] }}
              // onChange={tableChangeHandler}
              // rows={rows}
              // key={flag}
            />
          </Col>
        </Row>
      </Container>
      <PaymentInvoiceFilterModal
        show={show}
        setShow={setShow}
        editFlag={editFlag}
        setEditFlag={setEditFlag}
      />
    </>
  );
};
export default PaymentHistory;
