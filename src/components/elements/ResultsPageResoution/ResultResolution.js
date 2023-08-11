import React, { useState, useEffect } from "react";
import styles from "./ResultResolution.module.css";
import { Paper } from "@material-ui/core";
import { Col, Container, Row } from "react-bootstrap";
import result from "../../../assets/images/result.svg";
import Abstain from "../../../assets/images/Abstain.svg";
import Clock from "../../../assets/images/Clock.svg";
import line from "../../../assets/images/line.png";
import thumbsup from "../../../assets/images/thumbsup.svg";
import Tie from "../../../assets/images/Tie.svg";
import thumbsdown from "../../../assets/images/thumbsdown.svg";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import { TextField, Button } from "./../../../components/elements";
import EmployeeinfoCard from "../Employeeinfocard/EmployeeinfoCard";
import { useSelector, useDispatch } from "react-redux";
import { closeResolutionApi } from "../../../store/actions/Resolution_actions";
import { resolutionResultTable } from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import SeceretBallotingIcon from '../../../assets/images/resolutions/Secret_Balloting_icon.svg'

const ResultResolution = ({ setResultresolution, resultresolution }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { ResolutionReducer } = useSelector((state) => state);
  const [resolutionTitle, setResolutionTitle] = useState("");
  const [approved, setApproved] = useState(0);
  const [resolutionID, setResolutionID] = useState(0);
  const [nonApproved, setNonApproved] = useState(0);
  const [pending, setPending] = useState(0);
  const [abstain, setAbstain] = useState(0);
  const [votingMethod, setVotingMethod] = useState("")
  console.log(votingMethod, "votingMethodvotingMethod")
  const [notes, setNotes] = useState("");
  const [totalVoters, setTotalVoters] = useState(0);
  const [decisionDateExpiry, setDesicionDateExpiry] = useState(false);
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
      t("Approved"),
      approved,

      "stroke-color: #6DE595; stroke-opacity: 1 ;  fill-color: #6DE595; fill-opacity:1",
    ],
    [
      t("Non-approved"),
      nonApproved,

      "stroke-color: #F16B6B; stroke-opacity: 1 ; stroke-color:#F16B6B; fill-color: #F16B6B; fill-opacity:1; text-color:#F16B6B",
    ],
    [
      t("Pending"),
      pending,
      "stroke-color: #000; stroke-opacity: 1 ; stroke-color:#000000; fill-color: #000000; fill-opacity:1",
    ],
    [
      t("Abstain"),
      abstain,
      "stroke-color: #000; stroke-color:#949494;  stroke-width: 4; fill-color: #949494 ; fill-opacity:1",
    ],
  ];
  const closeResolutionHandleClick = () => {
    dispatch(
      closeResolutionApi(navigate, resolutionID, 2, notes, t, setResultresolution)
    );
  };
  useEffect(() => {
    console.log(
      ResolutionReducer.getResolutionResult,
      "ResolutionReducerResolutionReducerResolutionReducer"
    );
    try {
      if (ResolutionReducer.getResolutionResult !== null) {
        let resolutionresult = ResolutionReducer.getResolutionResult;
        setApproved(resolutionresult.approvedVotes);
        setAbstain();

        setVotingMethod(resolutionresult.votingMethod)
        setPending(resolutionresult.pendingVoters);
        setNonApproved(resolutionresult.nonApprovedVotes);
        setTotalVoters(resolutionresult.totalVoters);
        setDecision(resolutionresult.decision);
        setVoter(resolutionresult.voters);
        setResolutionID(resolutionresult.resolutionID);
        setResolutionTitle(resolutionresult.resolutionTite);
        let newDate = new Date();
        let DecisionDateExpiry = resolutionResultTable(
          resolutionresult.decisionAnnouncementDateTime
        );
        if (DecisionDateExpiry < newDate) {
          setDesicionDateExpiry(true);
        } else {
          setDesicionDateExpiry(false);
        }
      }
    } catch (error) {

    }

  }, [ResolutionReducer.getResolutionResult]);
  return (
    <section>
      <Row className="my-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Result_Heading_resolution"]}>
            {t("Result")}
          </span>
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["Result_page_paper"]}>
            <Row>
              <Col lg={6} md={6} sm={12} className="d-flex gap-2">
                <span className={styles["results_paper_heading"]}>
                  {resolutionTitle || ""} {" "}{votingMethod === "Secret Balloting" ? <img src={SeceretBallotingIcon} height="23.19px" width="23.19px" /> : <img src={result} height="23.19px" width="23.19px" />}
                </span>

              </Col>
              <Col sm={12} md={6} lg={6} className="d-flex align-items-center justify-content-end">
                <span className={styles["voting_method_heading"]}>{t("Voting-method") + " : "}   </span>  <span className={styles["voting_methong_value"]}> {votingMethod === "Secret Balloting" ? t("Secret-balloting") : t("Show-of-hands")}</span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={4} md={4} sm={12}>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["yellow_border_box"]}
                      >
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <img
                              src={
                                decision.toLowerCase() ===
                                  "Approved".toLowerCase()
                                  ? Clock
                                  : decision.toLowerCase() ===
                                    "Not Approved".toLowerCase()
                                    ? thumbsdown
                                    : decision.toLowerCase() ===
                                      "Pending".toLowerCase()
                                      ? Clock
                                      : decision.toLowerCase() ===
                                        "tie".toLowerCase()
                                        ? Tie
                                        : null
                              }
                              width="36.98px"
                              height="37px"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["status_vote_resolution"]}>
                              {decision}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
                    <Chart
                      // controls={false}
                      chartType="ColumnChart"
                      width="450px"
                      height="250px"
                      radius={10}
                      data={data}
                      options={options}
                      className={styles["Addchart"]}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <span className={styles["Total_voters"]}>
                      {t("Total-voters")}
                      <span className={styles["No_of_Votes"]}>
                        {totalVoters}
                      </span>
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col
                lg={1}
                md={1}
                sm={false}
                className="d-flex justify-content-center"
              >
                <span className={styles["line_Resultesolution"]}></span>
              </Col>
              <Col lg={7} md={7} sm={12}>
                <Row className="mt-5">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["voters_heading_result"]}>
                      {t("Voters")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Result-Screen_scroller"]}
                  >
                    <Row>
                      {voter.length > 0
                        ? voter.map((data, index) => {
                          console.log(data, "datadatadata");
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
                                  Icon={
                                    <img
                                      src={
                                        data.fK_VotingStatus_ID === 1
                                          ? thumbsup
                                          : data.fK_VotingStatus_ID === 2
                                            ? thumbsdown
                                            : data.fK_VotingStatus_ID === 3
                                              ? Clock
                                              : data.fK_VotingStatus_ID === 4
                                                ? Abstain
                                                : null
                                      }
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
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="CreateMeetingInput FontArabicRegular "
                  >
                    <TextField
                      applyClass="text-area-close-resolution"
                      type="text"
                      as={"textarea"}
                      size={400}
                      rows="5"
                      placeholder={t("Note")}
                      required={true}
                      maxLength={500}
                      change={(e) => setNotes(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2 mt-4"
                  >
                    <Button
                      text={t("Close")}
                      className={styles["Close_Btn_Resultresolution"]}
                      onClick={() => setResultresolution(false)}
                    />
                    <Button
                      text={t("Close-resolution")}
                      className={
                        styles["Close_resolution_Btn_Resultresolution"]
                      }
                      disableBtn={decisionDateExpiry ? true : false}
                      onClick={closeResolutionHandleClick}
                    />
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

export default ResultResolution;
