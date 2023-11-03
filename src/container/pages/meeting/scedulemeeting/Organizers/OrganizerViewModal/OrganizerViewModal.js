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
import { useNavigate } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { getUserProposedWiseApi } from "../../../../../../store/actions/NewMeetingActions";
import { useEffect, useState } from "react";

import moment from "moment";

const OrganizerViewModal = ({ setViewProposeOrganizerPoll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //reducer call from Attendance_Reducers
  const { NewMeetingreducer } = useSelector((state) => state);
  console.log(NewMeetingreducer, "attendanceMeetingReducer");

  let meetingID = Number(localStorage.getItem("meetingID"));

  const [organizerRows, setOrganizerRows] = useState([]);
  console.log(organizerRows, "attendenceRowsattendenceRows");

  const organizerColumn = [
    {
      dataIndex: "userName",
      key: "userName",
      render: (text) => (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>{text}</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>{text}</span>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>Hussain Raza</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>CTO</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      dataIndex: "OtherData",
      key: "OtherData",
      render: (text) => (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>Syed Ali Raza</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>CFO</span>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>Hussain Raza</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>CTO</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  // for rendering data in table
  useEffect(() => {
    if (
      NewMeetingreducer.userWiseMeetingProposed !== null &&
      NewMeetingreducer.userWiseMeetingProposed !== undefined &&
      NewMeetingreducer.userWiseMeetingProposed.length > 0
    ) {
      setOrganizerRows(NewMeetingreducer.userWiseMeetingProposed);
    } else {
      setOrganizerRows([]);
    }
  }, [NewMeetingreducer.userWiseMeetingProposed]);

  console.log(
    NewMeetingreducer.userWiseMeetingProposed,
    "NewMeetingreduceruserWiseMeetingProposed"
  );

  // dispatch Api in useEffect
  useEffect(() => {
    let proposedData = {
      MeetingID: meetingID,
    };
    dispatch(getUserProposedWiseApi(navigate, t, proposedData));
  }, []);

  const cancelHandler = () => {
    setViewProposeOrganizerPoll(false);
  };

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
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={"Cancel"}
                  onClick={cancelHandler}
                  className={styles["Cancel_Button_ProposeOrganizer"]}
                />
              </Col>
            </Row>
            <Table
              //   rows={organizerData}
              column={organizerColumn}
              pagination={false}
            />
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default OrganizerViewModal;
