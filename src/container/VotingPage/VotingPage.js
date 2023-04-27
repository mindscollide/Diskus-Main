import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import thumbsup from "../../assets/images/thumbsup.svg";
import thumbsdown from "../../assets/images/thumbsdown.svg";
import result from "../../assets/images/result.svg";
import { Paper } from "@material-ui/core";
import Clock from "../../assets/images/Clock.svg";
import line from "../../assets/images/line.png";
import Abstain from "../../assets/images/Abstain.svg";
import { Chart } from "react-google-charts";
import { Button } from "./../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./VotingPage.module.css";
import EmployeeinfoCard from "../../components/elements/Employeeinfocard/EmployeeinfoCard";
import { useSelector } from "react-redux";
const VotingPage = ({ setVoteresolution, voteresolution }) => {
  const { t } = useTranslation();
  const { ResolutionReducer } = useSelector(state => state)

  const [approved, setApproved] = useState(0);
  const [nonApproved, setNonApproved] = useState(0);
  const [pending, setPending] = useState(0);
  const [abstain, setAbstain] = useState(0)
  const [totalVoters, setTotalVoters] = useState(0)
  const [voter, setVoter] = useState([])
  const [decision, setDecision] = useState("")
  const options = {
    backgroundColor: "transparent",
    border: "1px solid #ffffff",
    // strokeWidth: "10px",
    hAxis: {
      viewWindow: {
        min: 0, // for space horizontally between bar
        max: 4, // for space horizontally between bar
      },
      textStyle: {
        color: "#000000",
        // this will change the color of the text to white
        fontSize: 11, // this will change the font size of the text to 12px
      },
    },
    legend: "none",
    vAxis: {
      textPosition: "none",
      gridlines: {
        count: 0,
        background: "transparent",
      },
    },

    bar: {
      groupWidth: "95%",
    },
  };
  const data = [
    ["Year", "Visitations", { role: "style" }],
    [
      "Approved",
      approved,

      "stroke-color: #6DE595; stroke-opacity: 1 ;  fill-color: #6DE595; fill-opacity:1",
    ],
    [
      "Non-Approved",
      nonApproved,

      "stroke-color: #F16B6B; stroke-opacity: 1 ; stroke-color:#F16B6B; fill-color: #F16B6B; fill-opacity:1; text-color:#F16B6B",
    ],
    [
      "Pending",
      pending,
      "stroke-color: #000; stroke-opacity: 1 ; stroke-color:#000000; fill-color: #000000; fill-opacity:1",
    ],
    [
      "Abstain",
      abstain,
      "stroke-color: #000; stroke-color:#949494;  stroke-width: 4; fill-color: #949494 ; fill-opacity:1",
    ],
  ];
  useEffect(() => {
    console.log(ResolutionReducer.getVoteDetailsByID
      , "ResolutionReducerResolutionReducerResolutionReducer")
    if (ResolutionReducer.getVoteDetailsByID !== null) {
      let resolutionresult = ResolutionReducer.getVoteDetailsByID
      setApproved(resolutionresult.approvedVotes)
      setAbstain()
      setPending(resolutionresult.pendingVoters)
      setNonApproved(resolutionresult.nonApprovedVotes)
      setTotalVoters(resolutionresult.totalVoters)
      setDecision(resolutionresult.decision)
      setVoter(resolutionresult.voters)
    }
  }, [ResolutionReducer.getResolutionResult])
  return (
    <Container>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Vote_Heading"]}>{t("Vote")}</span>
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["VotingPage_paper"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                    <span className={styles["Sub_heading_VoteResolution"]}>
                      {t(
                        "Authorizations-of-officials-for-handling-foreign-exchange."
                      )}
                    </span>
                    <span>
                      <img src={result} height="30.97px" width="20.96px" />
                    </span>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={7} md={7} sm={7}>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Gray_Border_box"]}
                      >
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span
                              className={styles["Your_vote_voteresolution"]}
                            >
                              {"Your-vote"}
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex gap-3 justify-content-center"
                          >
                            <Button
                              text={t("Abstain")}
                              icon={
                                <img src={Abstain} width="20px" height="20px" />
                              }
                              className={styles["Abstain_btn_vote_resolution"]}
                            />
                            <Button
                              text={t("Not-approved")}
                              icon={
                                <img
                                  src={thumbsdown}
                                  width="20px"
                                  height="20px"
                                />
                              }
                              className={
                                styles["Notapproved_btn_voteresolution"]
                              }
                            />
                            <Button
                              text={t("Approved")}
                              icon={
                                <img
                                  src={thumbsup}
                                  width="20px"
                                  height="20px"
                                />
                              }
                              className={styles["approved_btn_voteresolution"]}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Voters_voteResolution"]}>
                          {t("Voters")}
                        </span>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Scroller_voteresolution"]}
                      >
                        <Row>
                          <Col lg={6} md={6} sm={6}>
                            <EmployeeinfoCard
                              Employeename="Saad Fudda"
                              Employeeemail="Saadfudda@gmail.com"
                              Icon={
                                <img
                                  src={thumbsup}
                                  width="20px"
                                  height="20px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <EmployeeinfoCard
                              Employeename="Saad Fudda"
                              Employeeemail="Saadfudda@gmail.com"
                              Icon={
                                <img
                                  src={thumbsup}
                                  width="20px"
                                  height="20px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col lg={6} md={6} sm={6}>
                            <EmployeeinfoCard
                              Employeename="Saad Fudda"
                              Employeeemail="Saadfudda@gmail.com"
                              Icon={
                                <img
                                  src={thumbsup}
                                  width="20px"
                                  height="20px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <EmployeeinfoCard
                              Employeename="Saad Fudda"
                              Employeeemail="Saadfudda@gmail.com"
                              Icon={
                                <img
                                  src={thumbsup}
                                  width="20px"
                                  height="20px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col lg={6} md={6} sm={6}>
                            <EmployeeinfoCard
                              Employeename="Saad Fudda"
                              Employeeemail="Saadfudda@gmail.com"
                              Icon={
                                <img
                                  src={thumbsup}
                                  width="20px"
                                  height="20px"
                                />
                              }
                            />
                          </Col>
                          <Col lg={6} md={6} sm={6}>
                            <EmployeeinfoCard
                              Employeename="Saad Fudda"
                              Employeeemail="Saadfudda@gmail.com"
                              Icon={
                                <img
                                  src={thumbsup}
                                  width="20px"
                                  height="20px"
                                />
                              }
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    lg={1}
                    md={1}
                    sm={false}
                    className="d-flex justify-content-center"
                  >
                    <img src={line} height="547px" />
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={
                              styles["Pending_status_voteResolutionBox"]
                            }
                          >
                            <Row className="mt-4">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span>
                                  <img
                                    src={Clock}
                                    height="37px"
                                    width="36.98px"
                                  />
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <span
                                  className={styles["Status_voteResolutioin"]}
                                >
                                  {t("Pending")}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <Chart
                          chartType="ColumnChart"
                          width="100%"
                          height="250px"
                          radius={10}
                          data={data}
                          options={options}
                          className={styles["Addchart"]}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <span className={styles["Total_voters_voteResolution"]}>
                          {"Total-voters"}
                          <span
                            className={styles["No_of_Votes_voteResolution"]}
                          >
                            08
                          </span>
                        </span>
                      </Col>
                    </Row>

                    <Row className="mt-5">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-3 justify-content-end"
                      >
                        <Button
                          text={t("Close")}
                          className={styles["close_btn_VoteResolution"]}
                          onClick={() => setVoteresolution(false)}
                        />
                        <Button
                          text={t("Save")}
                          className={styles["save_btn_VoteResolution"]}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default VotingPage;
