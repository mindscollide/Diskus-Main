import React, { useState } from "react";
import styles from "./ViewVoteModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "../../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { Chart } from "react-google-charts";
import profile from "../../../../../../../assets/images/newprofile.png";
import down from "../../../../../../../assets/images/arrdown.png";
import { showviewVotesAgenda } from "../../../../../../../store/actions/NewMeetingActions";
import { Progress } from "antd";
const ViewVoteModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [enablePieChart, setEnablePieChart] = useState(false);

  const data = [
    {
      key: "1",
      Answer: (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["YesPercentage"]}>YES</span>
          </Col>
        </Row>
      ),
      Percentage: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Progress className="VoteModalAgenda" percent={30} size="small" />
            </Col>
          </Row>
        </>
      ),
      Vote: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["NoOfVotes"]}>04</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      Answer: (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["YesPercentage"]}>{t("NO")}</span>
          </Col>
        </Row>
      ),
      Percentage: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Progress
                className="NOProgressViewModal"
                percent={70}
                size="small"
              />
            </Col>
          </Row>
        </>
      ),
      Vote: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["NoOfVotes"]}>03</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "3",
      Answer: (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["YesPercentage"]}>{t("Abstain")}</span>
          </Col>
        </Row>
      ),
      Percentage: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <img
                src={profile}
                height="22px"
                width="22px"
                className={styles["Image"]}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Progress
                className="AbstainProgressViewModal"
                percent={10}
                size="small"
              />
            </Col>
          </Row>
        </>
      ),
      Vote: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["NoOfVotes"]}>0</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const EnablePieChart = () => {
    setEnablePieChart(true);
  };

  const DisablePieChart = () => {
    setEnablePieChart(false);
  };
  const [tablerowsData, setTablerowsData] = useState(data);
  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <span className={styles["Title"]}>{t("Answer")}</span>
              <img src={down} height="18.04px" width="8.19px" />
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Answer",
      key: "Answer",
      width: "55px",
    },
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <span className={styles["Title"]}>{t("Percentage")}</span>
              <img src={down} height="18.04px" width="8.19px" />
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Percentage",
      key: "Percentage",
      width: "240px",
    },
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <span className={styles["Title"]}>{t("Vote")}</span>
              <img src={down} height="18.04px" width="8.19px" />
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Vote",
      key: "Vote",
      width: "55px",
    },
  ];

  return (
    <section>
      <Modal
        show={NewMeetingreducer.viewVotesAgenda}
        setShow={dispatch(showviewVotesAgenda)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showviewVotesAgenda(false));
        }}
        size={"lg"}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["HeadingViewVoteModal"]}>
                  {t("Was-the-introduction-satisfactory")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                <Button
                  text={t("Bar-graph")}
                  className={styles["BargraphButton"]}
                  onClick={DisablePieChart}
                />
                <Button
                  text={t("Pie-graph")}
                  className={styles["BargraphButton"]}
                  onClick={EnablePieChart}
                />
              </Col>
            </Row>
            {enablePieChart === true ? (
              <>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <section className={styles["BackGroundForDonutChart"]}>
                      <Chart
                        width={"600px"}
                        height={"300px"}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                          ["Category", "Votes"],
                          ["Yes", 50],
                          ["No", 30],
                          ["Abstain", 20],
                        ]}
                        options={{
                          title: "Vote Distribution",
                          pieHole: 0.4, // Adjust the value to control the size of the hole (0 to 1)
                          colors: ["#4ADEDE", "#6172D6", "#F16B6B"],
                        }}
                        rootProps={{ "data-testid": "1" }}
                      />
                    </section>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <section className={styles["TranForm"]}>
                      <Chart
                        width={"600px"}
                        height={"300px"}
                        chartType="ColumnChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                          [
                            "Category",
                            "Votes",
                            { role: "style" },
                            { role: "annotation" },
                          ],
                          ["Yes", 50, "#4ADEDE", " "], // Empty string for annotation
                          ["No", 30, "#6172D6", " "], // Empty string for annotation
                          ["Abstain", 20, "#F16B6B", " "], // Empty string for annotation
                        ]}
                        options={{
                          title: "Vote Distribution",
                          hAxis: {
                            title: "Category",
                          },
                          vAxis: {
                            title: "Votes",
                          },
                          legend: { position: "none" },
                          colors: ["#4ADEDE", "#6172D6", "#F16B6B"],
                          annotations: {
                            textStyle: {
                              fontSize: 12, // Adjust the font size as needed
                            },
                          },
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
                  scroll={{ y: "15vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={tablerowsData}
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
