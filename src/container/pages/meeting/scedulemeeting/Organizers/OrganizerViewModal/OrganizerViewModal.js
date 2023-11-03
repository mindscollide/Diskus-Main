import React from "react";
import styles from "./OrganizerViewModal.module.css";
import {
  Button,
  Checkbox,
  Notification,
  Table,
} from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import moment from "moment";

const OrganizerViewModal = ({ setViewProposeDatePoll }) => {
  const { t } = useTranslation();

  const organizerData = [
    {
      userName: "Nothing",
      OtherData: "Aunnaqvi",
    },
  ];

  const organizerColumn = [
    {
      dataIndex: "userName",
      key: "userName",
      //   render: (text) => (
      //     <>
      //       <Row>
      //         <Col lg={12} md={12} sm={12}>
      //           <span>Syed Ali Raza</span>
      //         </Col>
      //       </Row>
      //       <Row>
      //         <Col lg={12} md={12} sm={12}>
      //           <span>CFO</span>
      //         </Col>
      //       </Row>
      //     </>
      //   ),
    },
    {
      dataIndex: "OtherData",
      key: "OtherData",
      //   render: (text) => (
      //     <>
      //       <Row>
      //         <Col lg={12} md={12} sm={12}>
      //           <span>Syed Ali Raza</span>
      //         </Col>
      //       </Row>
      //       <Row>
      //         <Col lg={12} md={12} sm={12}>
      //           <span>CFO</span>
      //         </Col>
      //       </Row>
      //     </>
      //   ),
    },
  ];

  return (
    <section>
      <Row className="mt-2">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex align-items-center align-items-center gap-3"
        >
          <span className={styles["Prposed_Meeting_heading"]}>
            {t("Organizer-View")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["Paper_styling"]}>
            <Table rows={organizerData} column={organizerColumn} />
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default OrganizerViewModal;
