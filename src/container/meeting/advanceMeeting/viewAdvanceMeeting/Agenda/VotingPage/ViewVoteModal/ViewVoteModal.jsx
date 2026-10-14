import React, { useState, useEffect } from "react";
import styles from "./ViewVoteModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "../../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { showviewVotesAgenda } from "../../../../../../../store/actions/NewMeetingActions";
import { ViewAgendaVotingResults } from "../../../../../../../store/actions/MeetingAgenda_action";
import { Progress } from "antd";
import PieChart from "./PieChart/pieChart";
import BarGraph from "./BarGraph/barGraph";

const ViewVoteModal = ({ advanceMeetingModalID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const viewVotesAgenda = useSelector(
    (state) => state.NewMeetingreducer.viewVotesAgenda
  );
  const GetCurrentAgendaDetails = useSelector(
    (state) => state.MeetingAgendaReducer.GetCurrentAgendaDetails
  );
  const ViewAgendaVotingResultData = useSelector(
    (state) => state.MeetingAgendaReducer.ViewAgendaVotingResultData
  );
  const [enablePieChart, setEnablePieChart] = useState(false);
  const [votingResults, setVotingResults] = useState([]);

  const [pieChartData, setPieChartData] = useState([]);

  const colorCodes = [
    "#4ADEDE",
    "#6172D6",
    "#F16B6B",
    "#FFFF99",
    "#E6E6FA",
    "#FFDAB9",
    "#FFB6C1",
    "#40E0D0",
    "#996515",
    "#C0C0C0",
    "#00FFFF",
    "#C8A2C8",
    "#DA70D6",
    "#800020",
    "#FFD700",
  ];
  const EnablePieChart = () => setEnablePieChart(true);
  const DisablePieChart = () => setEnablePieChart(false);

  // Table Columns
  const MeetingColoumns = [
    {
      title: t("Answer"),
      dataIndex: "answer",
      key: "answer",
      width: "100px",
      render: (text) => <span className={styles["YesPercentage"]}>{text}</span>,
      sorter: (a, b) =>
        a?.answer.toLowerCase().localeCompare(b?.answer.toLowerCase()),
    },
    {
      title: t("Percentage"),
      dataIndex: "percentage",
      key: "percentage",
      width: "170px",
      render: (text, record) => {
        const twoColors = {
          "100%": record.color,
        };
        return (
          <>
            <Row>
              <Col className='d-flex gap-2'>
                {record.participantsVoted &&
                  record.participantsVoted.map((participant, index) => (
                    <img
                      key={index}
                      alt=''
                      src={`data:image/jpeg;base64,${participant.userProfilePicture.displayProfilePictureName}`}
                      height='22px'
                      width='22px'
                      className={styles["Image"]}
                    />
                  ))}
              </Col>
            </Row>
            <Row className='mt-1'>
              <Col>
                <Progress percent={text} size='small' strokeColor={twoColors} />
              </Col>
            </Row>
          </>
        );
      },

      sorter: (a, b) => a.percentage - b.percentage,
    },
    {
      title: t("Vote"),
      dataIndex: "votes",
      key: "votes",
      width: "55px",
      align: "center",
      render: (text) => <span className={styles["NoOfVotes"]}>{text}</span>,
      sorter: (a, b) => a.votes - b.votes,
    },
  ];

  useEffect(() => {
    if (!GetCurrentAgendaDetails) return;

    let Data = {
      AgendaVotingID: GetCurrentAgendaDetails.agendaVotingID,
      MeetingID: advanceMeetingModalID,
    };
    dispatch(ViewAgendaVotingResults(Data, navigate, t));
  }, []);

  // Prepare chart data
  useEffect(() => {
    const results = ViewAgendaVotingResultData?.votingResults;
    if (!results || results.length === 0) {
      setVotingResults([]);
      return;
    }

    // Format for recharts
    setVotingResults(
      results.map((r, index) => ({
        answer: r.answer || "N/A",
        votes: r.votes || 0,
        percentage: r.percentage || 0,
        participantsVoted: r.participantsVoted || [],
        color: colorCodes[index],
      }))
    );
    setPieChartData(
      results.map((r, index) => ({
        name: r.answer || "N/A",
        value: r.votes || 0,
        fill: colorCodes[index],
      }))
    );
  }, [ViewAgendaVotingResultData]);

  return (
    <section>
      <Modal
        show={viewVotesAgenda}
        setShow={dispatch(showviewVotesAgenda)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-none"}
        onHide={() => dispatch(showviewVotesAgenda(false))}
        size={"lg"}
        ModalBody={
          <>
            <Row>
              <Col>
                <span className={styles["HeadingViewVoteModal"]}>
                  {ViewAgendaVotingResultData?.votingQuestion}
                </span>
              </Col>
            </Row>

            {/* Buttons */}
            <Row className='mt-2'>
              <Col className='d-flex gap-2'>
                <Button
                  text={t("Bar-graph")}
                  className={
                    enablePieChart
                      ? styles["BargraphButton"]
                      : styles["BargraphButtonActive"]
                  }
                  onClick={DisablePieChart}
                />

                <Button
                  text={t("Pie-graph")}
                  className={
                    enablePieChart
                      ? styles["BargraphButtonActive"]
                      : styles["BargraphButton"]
                  }
                  onClick={EnablePieChart}
                />
              </Col>
            </Row>

            {/* PIE / DONUT CHART */}
            {enablePieChart ? (
              <Row className='mt-3'>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className='d-flex justify-content-center '
                  style={{
                    maxHeight: "40vh",
                    outline: "none",
                  }}>
                  <PieChart data={pieChartData} />
                </Col>
              </Row>
            ) : (
              // BAR CHART
              <Row className='mt-3'>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  style={{
                    outline: "none",
                  }}
                  className='d-flex justify-content-center'>
                  <BarGraph data={votingResults} />
                </Col>
              </Row>
            )}

            {/* TABLE */}
            <Row className='mt-3'>
              <Col>
                <Table
                  column={MeetingColoumns}
                  scroll={{ y: "25vh" }}
                  pagination={false}
                  className='Polling_table'
                  rows={votingResults}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default ViewVoteModal;
