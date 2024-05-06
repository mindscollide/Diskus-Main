import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import thumbsup from "../../assets/images/thumbsup.svg";
import thumbsdown from "../../assets/images/thumbsdown.svg";
import result from "../../assets/images/result.svg";
import { Paper } from "@material-ui/core";
import Clock from "../../assets/images/Clock.svg";
import line from "../../assets/images/line.png";
import VoterSecretBalloting from "../../assets/images/Voter_Secret_Balloting.svg";
import Abstain from "../../assets/images/Abstain.svg";
import Tie from "../../assets/images/Tie.svg";

import { Chart } from "react-google-charts";
import { Button, Notification } from "./../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./VotingPage.module.css";
import EmployeeinfoCard from "../../components/elements/Employeeinfocard/EmployeeinfoCard";
import SeceretBallotingIcon from "../../assets/images/resolutions/Secret_Balloting_icon.svg";
import { useSelector, useDispatch } from "react-redux";
import { updateVoteApi } from "../../store/actions/Resolution_actions";
import { useNavigate } from "react-router-dom";
const VotingPage = ({ setVoteresolution, voteresolution, voterID }) => {
  const { t } = useTranslation();
  const { ResolutionReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [voteDetails, setVoteDetails] = useState({
    ResolutionTitle: "",
    ResolutionMethod: "",
  });
  // const [voterID, setVoterID] = useState(0);
  const [approved, setApproved] = useState(0);
  const [nonApproved, setNonApproved] = useState(0);
  const [pending, setPending] = useState(0);
  const [abstain, setAbstain] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [isResolutionTitle, setResolutionTitle] = useState("");
  const [isVotingMethod, setVotingMethod] = useState("");
  const [isVotingMethodId, setVotingMethodId] = useState(0);
  const [voteId, setVoteId] = useState(1);
  const [voter, setVoter] = useState([]);
  const userID = JSON.parse(localStorage.getItem("userID"));
  const [decision, setDecision] = useState("");
  const [decisionId, setDecisionId] = useState(0);
  console.log(decisionId, "decisionIddecisionIddecisionId")
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
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
    let Data = {
      PK_RV_ID: voterID,
      FK_VotingStatusID: voteId,
    };
    dispatch(updateVoteApi(navigate, Data, t, setVoteresolution));
  };
  useEffect(() => {
    if (ResolutionReducer.getVoteDetailsByID !== null) {
      try {
        let getVoteresult = ResolutionReducer.getVoteDetailsByID;
        setResolutionTitle(getVoteresult.resolutionTite);
        setVotingMethod(getVoteresult.votingMethod);
        setVotingMethodId(getVoteresult.votingMethodID);
        setApproved(getVoteresult.approvedVotes);
        setAbstain(0);
        setPending(getVoteresult.pendingVoters);
        setNonApproved(getVoteresult.nonApprovedVotes);
        setTotalVoters(getVoteresult.totalVoters);
        setDecision(getVoteresult.decision);
        setVoter(getVoteresult.voters);

        setDecisionId(getVoteresult.decisionID);
      } catch (error) {
        console.log(error);
      }
    }
  }, [ResolutionReducer.getVoteDetailsByID]);
  return (
    <>
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
                        {isVotingMethodId === 2 ? (
                          <img
                            src={SeceretBallotingIcon}
                            height="23.19px"
                            width="23.19px"
                          />
                        ) : (
                          <img
                            src={result}
                            height="23.19px"
                            width="23.19px"
                            draggable="false"
                            alt=""
                          />
                        )}
                        {/* <img src={result} height="23.19px" width="23.19px" /> */}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col lg={7} md={7} sm={12}>
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
                          <Row className="mt-4 FontArabicRegular">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex gap-3 justify-content-center "
                            >
                              <Button
                                text={t("Abstain")}
                                icon={
                                  <img
                                    src={Abstain}
                                    width="20px"
                                    height="20px"
                                    alt=""
                                  />
                                }
                                className={
                                  voteId === 4
                                    ? styles[
                                        "Abstain_btn_vote_resolution_Active"
                                      ]
                                    : styles["Abstain_btn_vote_resolution"]
                                }
                                onClick={() => isAbstainBtn(4)}
                              />
                              <Button
                                text={t("Not-approved")}
                                icon={
                                  <img
                                    src={thumbsdown}
                                    width="20px"
                                    height="20px"
                                    alt=""
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
                                    alt=""
                                  />
                                }
                                onClick={() => isApprovedBtn(1)}
                                className={
                                  voteId === 1
                                    ? styles[
                                        "approved_btn_voteresolution_Active"
                                      ]
                                    : styles["approved_btn_voteresolution"]
                                }
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={6} md={6} sm={12}>
                          <span className={styles["Voters_voteResolution"]}>
                            {t("Voters")}
                          </span>
                        </Col>
                        <Col
                          sm={12}
                          md={6}
                          lg={6}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <span className={styles["voting_method_heading"]}>
                            {t("Voting-method") + " : "}{" "}
                          </span>{" "}
                          <span className={styles["voting_methong_value"]}>
                            {" "}
                            {isVotingMethodId === 2
                              ? t("Secret-balloting")
                              : t("Show-of-hands")}
                          </span>
                        </Col>
                      </Row>
                      {isVotingMethodId === 2 ? (
                        <>
                          <Row>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className={styles["VotingMethods_box"]}
                            >
                              <img
                                src={VoterSecretBalloting}
                                alt=""
                                draggable="false"
                              />
                              <span className={styles["voting_method_heading"]}>
                                {t("Voting-method") + " : "}{" "}
                              </span>{" "}
                              <span className={styles["voting_methong_value"]}>
                                {t("Secret-balloting")}
                              </span>
                            </Col>
                          </Row>
                        </>
                      ) : isVotingMethodId === 1 ? (
                        <>
                          <Row className="mt-3">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["Scroller_voteresolution"]}
                            >
                              <Row>
                                {voter.length > 0
                                  ? voter.map((data, index) => {
                                      return (
                                        <>
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            key={data.pK_RV_ID}
                                            className="mt-1"
                                          >
                                            <EmployeeinfoCard
                                              Employeename={data.username}
                                              Employeeemail={data.email}
                                              EmployeePic={data.base64Img}
                                              Icon={
                                                <img
                                                  src={
                                                    data.fK_VotingStatus_ID ===
                                                    1
                                                      ? thumbsup
                                                      : data.fK_VotingStatus_ID ===
                                                        2
                                                      ? thumbsdown
                                                      : data.fK_VotingStatus_ID ===
                                                        3
                                                      ? Clock
                                                      : data.fK_VotingStatus_ID ===
                                                        4
                                                      ? Abstain
                                                      : null
                                                  }
                                                  alt=""
                                                  width="20px"
                                                  height="20px"
                                                  // onClick={() =>
                                                  //   setVoterID(data.pK_RV_ID)
                                                  // }
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
                      <span className={styles["line_voteResolution"]}></span>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="px-3">
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
                                // Pending State
                                decisionId === 1
                                  ? styles["pending_state"]
                                  : // Approved State
                                  decisionId === 2
                                  ? styles["approved_state"]
                                  : // Not Approved State
                                  decisionId === 3
                                  ? styles["notApproved_state"]
                                  : decisionId === 4
                                  ? // Tie State
                                    styles["Tie_state"]
                                  : null
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
                                      src={
                                        decisionId === 1
                                          ? Clock
                                          : decisionId === 2
                                          ? thumbsup
                                          : decisionId === 3
                                          ? thumbsdown
                                          : decisionId === 4
                                          ? Tie
                                          : null
                                      }
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
                                    {Number(decisionId) === 1
                                      ? t("Pending")
                                      : Number(decisionId) === 2
                                      ? t("Approved")
                                      : Number(decisionId) === 3
                                      ? t("Not-approved")
                                      : Number(decisionId) === 4
                                      ? t("Tie")
                                      : ""}
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
                          <span
                            className={styles["Total_voters_voteResolution"]}
                          >
                            {t("Total-voters")}
                            <span
                              className={styles["No_of_Votes_voteResolution"]}
                            >
                              {totalVoters || 0}
                            </span>
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-5">
                        <Col
                          lg={11}
                          md={11}
                          sm={11}
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
                            disableBtn={voteId === 0 ? true : false}
                          />
                        </Col>
                        <Col lg={1} md={1} sm={1}></Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Paper>
          </Col>
        </Row>
      </section>
      <Notification message={open.message} open={open.flag} setOpen={setOpen} />
    </>
  );
};

export default VotingPage;
