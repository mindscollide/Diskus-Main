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
import {
  getUserProposedWiseApi,
  showSceduleProposedMeeting,
} from "../../../../../../store/actions/NewMeetingActions";
import { useEffect, useState } from "react";
import SceduleProposedmeeting from "../../meetingDetails/UnpublishedProposedMeeting/SceduleProposedMeeting/SceduleProposedmeeting";
import moment from "moment";

const OrganizerViewModal = ({ setViewProposeOrganizerPoll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //reducer call from Attendance_Reducers
  const { NewMeetingreducer } = useSelector((state) => state);
  console.log(NewMeetingreducer, "attendanceMeetingReducer");

  let meetingID = Number(localStorage.getItem("meetingID"));

  //scheduleProposedMeeting Modal open state
  const [showScheduleProposedMeeting, setShowScheduleProposedMeeting] =
    useState(false);
  console.log(
    showScheduleProposedMeeting,
    "showScheduleProposedMeetingshowScheduleProposedMeeting"
  );

  const [organizerRows, setOrganizerRows] = useState([]);
  const [initialOrganizerRows, setInitialOrganizerRows] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);
  console.log(organizerRows, "attendenceRowsattendenceRows");

  const [organizerColumnData, setOrganizerColumnData] = useState([
    {
      userName: "Mr Abdul Qadir",
      designation: "CFO",
      userEmail: "example1@company.com",
      title: "Manager",
    },
    {
      userName: "Mr Huzaeifa Jahangir",
      designation: "Team Lead",
      userEmail: "example2@company.com",
      title: "Lead",
    },
    // Add more data as needed
  ]);

  const organizerColumn = [
    {
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>{record.userName}</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>
                {record.designation}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      dataIndex: "userEmail",
      key: "userEmail",
      render: (text, record) => (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["PersonName"]}>{record.userEmail}</span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Designation"]}>{record.title}</span>
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
      let ProposeDates = [];

      NewMeetingreducer.userWiseMeetingProposed.forEach((datesData, index) => {
        datesData.selectedProposedDates.forEach((eachRecord, index) => {
          ProposeDates.push(eachRecord.proposedDate);
        });
      });
      setProposedDates(ProposeDates);
      setInitialOrganizerRows(NewMeetingreducer.userWiseMeetingProposed);
    } else {
      setInitialOrganizerRows([]);
    }
  }, [NewMeetingreducer.userWiseMeetingProposed]);

  useEffect(() => {
    const newOrganizerRows = [...initialOrganizerRows];

    // Find the maximum number of selectedProposedDates objects in initialOrganizerRows
    let maxSelectedProposedDates = 0;
    initialOrganizerRows.forEach((organizer) => {
      const numSelectedProposedDates = organizer.selectedProposedDates.length;
      if (numSelectedProposedDates > maxSelectedProposedDates) {
        maxSelectedProposedDates = numSelectedProposedDates;
      }
    });

    // Create an object with maxSelectedProposedDates empty selectedProposedDates
    const yourNewObject = {
      userID: 0,
      userName: "Total",
      designation: "",
      userEmail: "",
      title: "",
      selectedProposedDates: Array(maxSelectedProposedDates).fill({
        proposedDateID: 0,
        proposedDate: "",
        startTime: "",
        endTime: "",
        isSelected: false,
        isTotal: 0,
      }),
    };

    newOrganizerRows.push(yourNewObject);

    setOrganizerRows(newOrganizerRows);
  }, [initialOrganizerRows]);

  console.log(
    NewMeetingreducer.userWiseMeetingProposed,
    "NewMeetingreduceruserWiseMeetingProposed"
  );

  // dispatch Api in useEffect
  useEffect(() => {
    let proposedData = {
      MeetingID: 1828,
    };
    dispatch(getUserProposedWiseApi(navigate, t, proposedData));
  }, []);

  const cancelHandler = () => {
    setViewProposeOrganizerPoll(false);
  };

  const handleViewPollClick = () => {
    setShowScheduleProposedMeeting(true);
    dispatch(showSceduleProposedMeeting(true));
  };
  console.log(
    handleViewPollClick,
    "showScheduleProposedMeetingshowScheduleProposedMeeting"
  );

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
              rows={organizerRows}
              column={organizerColumn}
              pagination={false}
            />
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center mt-3"
              >
                <Button
                  text="View Poll"
                  onClick={handleViewPollClick}
                  className={styles["view-poll-organizer-btn"]}
                />
              </Col>
            </Row>
          </Paper>

          <SceduleProposedmeeting
            organizerRows={organizerRows}
            proposedDates={proposedDates}
          />
        </Col>
      </Row>
    </section>
  );
};

export default OrganizerViewModal;
