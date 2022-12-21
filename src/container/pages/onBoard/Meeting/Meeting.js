import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Paperclip, CameraVideo } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

import { Table } from "../../../../components/elements";
import { useTranslation } from "react-i18next";

export const Meeting = ({ style, pageSize, pagination }) => {
  //For Localization
  const { t } = useTranslation();

  const rowsData = [
    {
      title: t("Routine-Check-Title"),
      status: "Active",
      host: t("Host-Name-Title"),
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
  ];
  const rows = [
    {
      title: t("Routine-Check-Title"),
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Board Member Executive Meeting",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },

    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Board Member Executive Meeting",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
    {
      title: "Routine Check",
      status: "Not-Active",
      host: "Mr. Yaqoob",
      date_time: "9: 00 , 16 May 2020",
      attach: true,
      video: true,
      edit: true,
    },
  ];
  const columns = [
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        return status === "Active" ? (
          <span size="small" className="activebtn">
            Active
          </span>
        ) : (
          "Upcoming"
        );
      },
    },
    {
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
    },
    {
      title: t("Date-Or-Time"),
      dataIndex: "date_time",
      key: "date_time",
    },
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (id, edit) => {
        return id === true && <NavLink to="#">Edit</NavLink>;
      },
    },
  ];

  return (
    <Container className={style}>
      <Row>
        <Col className="heading h6 color-primary fw-600  mt-3">
          {t("Meetings")}
        </Col>
      </Row>
      <Row className="mx-1">
        <Col>
          {" "}
          <Table
            column={columns}
            className="onBoardTable"
            rows={rowsData}
            pagination={pagination}
            // pagination={{
            //   // defaultPageSize: 1,
            //   defaultPageSize: pageSize,
            // }}
          />
        </Col>
      </Row>

      {/* <Header heading="Meetings" button={true} user="Yaqoob" currentUserImage={userImage}  /> */}
    </Container>
  );
};
