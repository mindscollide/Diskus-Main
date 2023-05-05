import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import thumbsup from "../../assets/images/thumbsup.svg";
import thumbsdown from "../../assets/images/thumbsdown.svg";
import result from "../../assets/images/Path 1708.svg";
import { Paper } from "@material-ui/core";
import Clock from "../../assets/images/Clock.svg";
import line from "../../assets/images/line.png";
import VoterSecretBalloting from "../../assets/images/Voter_Secret_Balloting.svg";
import Abstain from "../../assets/images/Abstain.svg";
import { Chart } from "react-google-charts";
import { Button } from "./../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./VotingPage.module.css";
import EmployeeinfoCard from "../../components/elements/Employeeinfocard/EmployeeinfoCard";

import { useSelector, useDispatch } from "react-redux";
import { updateVoteApi } from "../../store/actions/Resolution_actions";
const VotingPage = ({ setVoteresolution, voteresolution }) => {
  const { t } = useTranslation();
  const { ResolutionReducer } = useSelector((state) => state);
  const dispatch = useDispatch()
  const [voteDetails, setVoteDetails] = useState({
    ResolutionTitle: "",
    ResolutionMethod: "",
  });
  const [approved, setApproved] = useState(0);
  const [nonApproved, setNonApproved] = useState(0);
  const [pending, setPending] = useState(0);
  const [abstain, setAbstain] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [isResolutionTitle, setResolutionTitle] = useState("");
  const [isVotingMethod, setVotingMethod] = useState("");
  const [voteId, setVoteId] = useState(1);
  const [isAbstain, setIsAbstain] = useState(false);
  const [notApproved, setNotApproved] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [voter, setVoter] = useState([]);
  const [decision, setDecision] = useState("");
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

  const isApprovedBtn = (statusID) => {
    setVoteId(statusID);
  };
  const isNotApprovedBtn = (statusID) => {
    setVoteId(statusID);
  };
  const isAbstainBtn = (statusID) => {
    setVoteId(statusID);
  };
  const handleUpdateVote = () => {
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
      PK_RV_ID: userID,
      FK_VotingStatusID: voteId
    }
    dispatch(updateVoteApi(Data,t,setVoteresolution))

  }
  useEffect(() => {
    if (ResolutionReducer.getVoteDetailsByID !== null) {
      let getVoteresult = ResolutionReducer.getVoteDetailsByID;
      setResolutionTitle(getVoteresult.resolutionTite);
      setVotingMethod(getVoteresult.votingMethod);
      setApproved(getVoteresult.approvedVotes);
      setAbstain();
      setPending(getVoteresult.pendingVoters);
      setNonApproved(getVoteresult.nonApprovedVotes);
      setTotalVoters(getVoteresult.totalVoters);
      setDecision(getVoteresult.decision);
      setVoter(getVoteresult.voters);
    }
  }, [ResolutionReducer.getVoteDetailsByID]);
  return (
    <section>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Vote_Heading"]}>{t("Vote")}</span>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["VotingPage_paper"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex gap-3 align-items-center"
                  >
                    <span className={styles["Sub_heading_VoteResolution"]}>
                      {isResolutionTitle || ""}
                    </span>
                    <span>
                      <img src={result} height="23.19px" width="23.19px" />
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
                              {t("Your-vote")}
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
                              className={
                                voteId === 3
                                  ? styles["Abstain_btn_vote_resolution_Active"]
                                  : styles["Abstain_btn_vote_resolution"]
                              }
                              onClick={() => isAbstainBtn(3)}
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
                                voteId === 2
                                  ? styles[
                                  "Notapproved_btn_voteresolution_Active"
                                  ]
                                  : styles["Notapproved_btn_voteresolution"]
                              }
                              onClick={() => isNotApprovedBtn(2)}
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
                              onClick={() => isApprovedBtn(1)}
                              className={
                                voteId === 1
                                  ? styles["approved_btn_voteresolution_Active"]
                                  : styles["approved_btn_voteresolution"]
                              }
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
                    {isVotingMethod === "Secret Balloting" ? (
                      <>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={styles["VotingMethods_box"]}
                          >
                            <img src={VoterSecretBalloting} />
                            <span>
                              {t("Voting-method")} {isVotingMethod || ""}
                            </span>
                          </Col>
                        </Row>
                      </>
                    ) : voteDetails.ResolutionMethod === "Show of Hands" ? (
                      <>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Scroller_voteresolution"]}
                          >
                            <Row>
                              {voter.length > 0
                                ? voter.map((data, index) => {
                                  console.log(data, "datadadadasdad");
                                  return (
                                    <>
                                      <Col
                                        lg={6}
                                        md={6}
                                        sm={6}
                                        key={data.pK_RV_ID}
                                      >
                                        <EmployeeinfoCard
                                          Employeename={data.username}
                                          Employeeemail={data.email}
                                          Icon={
                                            <img
                                              src={thumbsup}
                                              width="20px"
                                              height="20px"
                                            />
                                          }
                                        />
                                      </Col>
                                    </>
                                  );
                                })
                                : null}
                            </Row>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      ""
                    )}
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
                          {t("Total-voters")}
                          <span
                            className={styles["No_of_Votes_voteResolution"]}
                          >
                            {totalVoters || 0}
                          </span>
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
                                  {decision || ""}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
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
                          onClick={handleUpdateVote}
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
    </section>
  );
};

export default VotingPage;
