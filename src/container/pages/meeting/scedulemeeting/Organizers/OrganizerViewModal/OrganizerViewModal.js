import React from "react";
import styles from "./OrganizerViewModal.module.css";
import { Button, Table } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserProposedWiseApi,
  showSceduleProposedMeeting,
  getUserWiseProposedDatesMainApi,
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
} from "../../../../../../store/actions/NewMeetingActions";
import { useEffect, useState } from "react";
import SceduleProposedmeeting from "../../meetingDetails/UnpublishedProposedMeeting/SceduleProposedMeeting/SceduleProposedmeeting";

const OrganizerViewModal = ({ setViewProposeOrganizerPoll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let userID = localStorage.getItem("userID");

  const userWiseMeetingProposed = useSelector(
    (state) => state.NewMeetingreducer.userWiseMeetingProposed
  );
  const sceduleproposedMeeting = useSelector(
    (state) => state.NewMeetingreducer.sceduleproposedMeeting
  );
  const getUserProposedOrganizerData = useSelector(
    (state) => state.NewMeetingreducer.getUserProposedOrganizerData
  );

  let viewProposeDatePollMeetingID = Number(
    localStorage.getItem("viewProposeDatePollMeetingID")
  );

  const [organizerRows, setOrganizerRows] = useState([]);
  const [initialOrganizerRows, setInitialOrganizerRows] = useState([]);
  const [proposedDates, setProposedDates] = useState([]);

  // dispatch Api in useEffect
  useEffect(() => {
    let Data = {
      MeetingID: Number(viewProposeDatePollMeetingID),
    };
    dispatch(getUserWiseProposedDatesMainApi(navigate, t, Data));
  }, []);

  // for rendering data in table
  useEffect(() => {
    if (
      getUserProposedOrganizerData !== null &&
      getUserProposedOrganizerData !== undefined &&
      getUserProposedOrganizerData.length > 0
    ) {
      let ProposeDates;

      getUserProposedOrganizerData.forEach((datesData, index) => {
        const uniqueData = new Set(
          datesData.selectedProposedDates.map(JSON.stringify)
        );
        ProposeDates = Array.from(uniqueData).map(JSON.parse);
      });
      setProposedDates(ProposeDates);
      setInitialOrganizerRows(getUserProposedOrganizerData);
    } else {
      setInitialOrganizerRows([]);
    }
  }, [getUserProposedOrganizerData]);

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

    setOrganizerRows(newOrganizerRows);
  }, [initialOrganizerRows]);

  const cancelHandler = () => {
    setViewProposeOrganizerPoll(false);
    dispatch(scheduleMeetingPageFlag(false));
    dispatch(viewProposeDateMeetingPageFlag(false));
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    dispatch(viewProposeOrganizerMeetingPageFlag(false));
    dispatch(proposeNewMeetingPageFlag(false));
    if (meetingpageRow !== null && meetingPageCurrent !== null) {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber: Number(meetingPageCurrent),
        Length: Number(meetingpageRow),
        PublishedMeetings: false,
      };
      dispatch(searchNewUserMeeting(navigate, searchData, t));
    }
  };

  const handleViewPollClick = () => {
    dispatch(showSceduleProposedMeeting(true));
  };

  return (
    <section>
      <Row className='mt-2'>
        <Col
          lg={12}
          md={12}
          sm={12}
          className='d-flex align-items-center align-items-center gap-3'>
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
                className='d-flex justify-content-end'>
                <Button
                  text={t("Cancel")}
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
                className='d-flex justify-content-center mt-3'>
                <Button
                  text={t("View-poll")}
                  onClick={handleViewPollClick}
                  className={styles["view-poll-organizer-btn"]}
                />
              </Col>
            </Row>
          </Paper>
          {sceduleproposedMeeting ? (
            <SceduleProposedmeeting
              organizerRows={organizerRows}
              proposedDates={proposedDates}
            />
          ) : null}
        </Col>
      </Row>
    </section>
  );
};

export default OrganizerViewModal;
