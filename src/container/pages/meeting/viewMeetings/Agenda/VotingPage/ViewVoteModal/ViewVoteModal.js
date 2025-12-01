import React, { useState, useEffect } from "react";
import styles from "./ViewVoteModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "../../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { Chart } from "react-google-charts";
import { showviewVotesAgenda } from "../../../../../../../store/actions/NewMeetingActions";
import { ViewAgendaVotingResults } from "../../../../../../../store/actions/MeetingAgenda_action";
import { Progress } from "antd";
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

  const [votingResults, setVotingResults] = useState(null);

  const [pieChartData, setPieChartData] = useState([]);

  const [barChartData, setBarChartData] = useState([]);

  console.log(barChartData, "barChartDatabarChartDatabarChartData");

  const [currentAgendaDetails, setCurrentAgendaDetails] = useState([]);

  const colorCodes = [
    "#FF7F7F",
    "#98FB98",
    "#87CEEB",
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

  const EnablePieChart = () => {
    setEnablePieChart(true);
  };

  const DisablePieChart = () => {
    setEnablePieChart(false);
  };

  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='d-flex gap-2 align-items-center'>
              <span className={styles["Title"]}>{t("Answer")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "answer",
      key: "answer",
      width: "100px",
      render: (text) => (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["YesPercentage"]}>{text}</span>
          </Col>
        </Row>
      ),
      sorter: (a, b) => {
        return a?.answer.toLowerCase().localeCompare(b?.answer.toLowerCase());
      },
    },
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='d-flex gap-2 align-items-center'>
              <span className={styles["Title"]}>{t("Percentage")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "percentage",
      key: "percentage",
      width: "170px",
      render: (text, record) => (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
              {record.participantsVoted.map((participant, index) => (
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
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Progress
                className='VoteModalAgenda'
                percent={text}
                size='small'
              />
            </Col>
          </Row>
        </>
      ),
      sorter: (a, b) => {
        return a.percentage - b.percentage;
      },
    },
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='d-flex gap-2 align-items-center'>
              <span className={styles["Title"]}>{t("Vote")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "votes",
      key: "votes",
      width: "55px",
      render: (text, record) => (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["NoOfVotes"]}>{text}</span>
          </Col>
        </Row>
      ),
      sorter: (a, b) => {
        return a.votes - b.votes;
      },
    },
  ];

  useEffect(() => {
    if (
      GetCurrentAgendaDetails !== null &&
      GetCurrentAgendaDetails !== undefined &&
      GetCurrentAgendaDetails.length !== 0
    ) {
      setCurrentAgendaDetails(GetCurrentAgendaDetails);
    } else {
      setCurrentAgendaDetails([]);
    }
  }, [GetCurrentAgendaDetails]);

  useEffect(() => {
    let Data = {
      AgendaVotingID: GetCurrentAgendaDetails.agendaVotingID,
      MeetingID: advanceMeetingModalID,
    };
    dispatch(ViewAgendaVotingResults(Data, navigate, t));
  }, []);

  useEffect(() => {
    if (
      ViewAgendaVotingResultData !== null &&
      ViewAgendaVotingResultData !== undefined &&
      ViewAgendaVotingResultData.length !== 0
    ) {
      setPieChartData(
        ViewAgendaVotingResultData.votingResults.map((result) => [
          result.answer,
          result.votes,
        ])
      );
      setVotingResults(ViewAgendaVotingResultData.votingResults);
    } else {
      setVotingResults(null);
    }
  }, [ViewAgendaVotingResultData]);


  useEffect(() => {
    const chartDataArray = [["Category", "Votes", { role: "style" }]];

    pieChartData.forEach((dataPoint, index) => {
      const color = colorCodes[index % colorCodes.length];
      chartDataArray.push([dataPoint[0], dataPoint[1], color]);
    });

    setBarChartData(chartDataArray);
  }, [pieChartData]);

  return (
    <section>
      <Modal
        show={viewVotesAgenda}
        setShow={dispatch(showviewVotesAgenda)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-none"}
        onHide={() => {
          dispatch(showviewVotesAgenda(false));
        }}
        size={"lg"}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["HeadingViewVoteModal"]}>
                  {ViewAgendaVotingResultData?.votingQuestion}
                </span>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                <Button
                  text={t("Bar-graph")}
                  className={
                    enablePieChart === true
                      ? styles["BargraphButton"]
                      : styles["BargraphButtonActive"]
                  }
                  onClick={DisablePieChart}
                />
                <Button
                  text={t("Pie-graph")}
                  className={
                    enablePieChart === true
                      ? styles["BargraphButtonActive"]
                      : styles["BargraphButton"]
                  }
                  onClick={EnablePieChart}
                />
              </Col>
            </Row>
            {enablePieChart === true ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-center'>
                    <section className={styles["BackGroundForDonutChart"]}>
                      <Chart
                        width={"600px"}
                        height={"260px"}
                        chartType='PieChart'
                        loader={<div>Loading Chart</div>}
                        data={barChartData}
                        options={{
                          title: "Vote Distribution",
                          pieHole: 0.4, // Adjust the value to control the size of the hole (0 to 1)
                          colors: [
                            "#FF7F7F",
                            "#98FB98",
                            "#87CEEB",
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
                          ],
                        }}
                        rootProps={{ "data-testid": "1" }}
                      />
                    </section>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-center'>
                    <section className={styles["TranForm"]}>
                      <Chart
                        width={"600px"}
                        height={"260px"}
                        chartType='ColumnChart'
                        loader={<div>Loading Chart</div>}
                        data={barChartData}
                        options={{
                          title: "Vote Distribution",
                          hAxis: {
                            title: "Category",
                          },
                          vAxis: {
                            title: "Votes",
                            format: "0", // Ensures whole numbers on the Y-axis
                            ticks: [0, 1, 2, 3, 4, 5], // Define specific tick marks if needed
                          },
                          legend: { position: "none" },
                          colors: [
                            "#FF7F7F",
                            "#98FB98",
                            "#87CEEB",
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
                          ],
                        }}
                        rootProps={{ "data-testid": "1" }}
                      />
                    </section>
                  </Col>
                </Row>
              </>
            )}

            <Row>
              <Col lg={12} md={12} sm={12}>
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
