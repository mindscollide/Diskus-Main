import React, { useEffect, useState } from "react";
import { Modal, Button } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./PollDetails.module.css";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { Col, Container, Row } from "react-bootstrap";
import { Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getPollsByPollIdApi,
  viewVotesDetailsModal,
} from "../../../store/actions/Polls_actions";
const PollDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const PollsReducerviewVotes = useSelector(
    (state) => state.PollsReducer.viewVotes
  );
  const PollsReducerviewVotesDetails = useSelector(
    (state) => state.PollsReducer.viewVotesDetails
  );
  const { t } = useTranslation();
  const [pollId, setPollId] = useState(0);
  let userID = localStorage.getItem("userID");
  const [pollTitle, setPollTitle] = useState("");
  const [pollAttendiesOpptionsVise, setPollAttendiesOpptionsVise] = useState(
    []
  );
  const [votePollDetailsOptions, setVotePollDetailsOptions] = useState([]);

  useEffect(() => {
    let vieVotePollDetails = PollsReducerviewVotes;
    let pollOptions = vieVotePollDetails.pollOptions;
    let pollAttendies = vieVotePollDetails.pollParticipants;
    let Options = [];

    if (vieVotePollDetails !== undefined && vieVotePollDetails !== null) {
      if (Object.keys(vieVotePollDetails).length > 0) {
        // for poll ID
        setPollId(vieVotePollDetails.pollDetails.pollID);

        // for poll Title
        setPollTitle(vieVotePollDetails.pollDetails.pollTitle);

        // for options
        if (Object.keys(pollOptions).length > 0) {
          pollOptions.forEach((data, index) => {
            Options.push(data);
          });
          setVotePollDetailsOptions(Options);
        }

        if (Object.keys(pollAttendies).length > 0) {
          setPollAttendiesOpptionsVise(pollAttendies);
        }
      }
    }
  }, [PollsReducerviewVotes]);

  const handleClosed = async () => {
    dispatch(viewVotesDetailsModal(false));
    // let data = {
    //   PollID: pollId,
    //   UserID: parseInt(userID),
    // };
    // dispatch(getPollsByPollIdApi(navigate, data, 3, t));
  };

  return (
    <Container>
      <Modal
        show={PollsReducerviewVotesDetails}
        setShow={dispatch(viewVotesDetailsModal)}
        onHide={() => {
          dispatch(viewVotesDetailsModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                <img
                  draggable="false"
                  src={BlackCrossIcon}
                  alt=""
                  className={styles["Cross_Icon_poll_Details"]}
                  width="16px"
                  height="16px"
                  onClick={() => {
                    dispatch(viewVotesDetailsModal(false));
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OVerall_Padding"]}
              >
                <Row>
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
                    <span className={styles["Poll_details_Heading"]}>
                      {t("Poll-Details")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={`${styles["BOx_for_yes"]} d-flex align-items-center`}
                  >
                    <span className={styles["scrollable-title"]}>
                      {" "}
                      {pollTitle}
                    </span>
                  </Col>
                </Row>
                {/* <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Box_For_Title_toShow"]}
                  >
                    <Row>
                      <Col lg={12} sm={12} md={12}>
                        <span className={styles["ViewTitleTOShowOnProgress"]}>
                          {pollTitle}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row> */}
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_Options"]}
                  >
                    {votePollDetailsOptions.map((data, index) => {
                      return (
                        <>
                          <Row className="mt-3" key={index}>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="m-0 p-0 d-flex gap-2"
                            >
                              <span className={styles["No-of-Yes-Answers"]}>
                                {data.answer} -{" "}
                                <span className={styles["no-Of-Yes"]}>
                                  {data.votePercentage}%
                                </span>
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12} className="m-0 p-0">
                              <Progress
                                percent={data.votePercentage}
                                className="pollsDetailsProgress"
                                status="active"
                              />
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12} className="mt-2 m-0 p-0">
                    <span className={styles["Participants_polls_Details"]}>
                      {t("Participants")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_participants"]}
                  >
                    {pollAttendiesOpptionsVise.map((data, index) => {
                      return (
                        <>
                          <Row className="mt-2" key={index}>
                            <Col lg={12} md={12} sm={12} className="m-0 p-0">
                              <span className={styles["Yes_voters"]}>
                                {data.answer +
                                  " " +
                                  "(" +
                                  data.totalVotes +
                                  ")"}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            {Object.keys(data.pollParticipants).length > 0
                              ? data.pollParticipants.map(
                                  (innerData, index) => {
                                    return (
                                      <>
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={12}
                                          className="mt-2"
                                          key={index}
                                        >
                                          <Row>
                                            <Col
                                              lg={11}
                                              md={11}
                                              sm={12}
                                              className="m-0 p-0"
                                            >
                                              <Row
                                                className={
                                                  styles["Card_border2"]
                                                }
                                              >
                                                <Col sm={12} md={12} lg={12}>
                                                  <img
                                                    draggable="false"
                                                    src={`data:image/jpeg;base64,${innerData.profilePicture.displayProfilePictureName}`}
                                                    width="33px"
                                                    height="33px"
                                                    className="rounded-circle"
                                                    alt=""
                                                  />
                                                  <span
                                                    className={
                                                      styles["Name_cards"]
                                                    }
                                                  >
                                                    {innerData.userName}
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    );
                                  }
                                )
                              : null}
                          </Row>
                        </>
                      );
                    })}
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OVerall_Padding"]}
              >
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end  m-0 p-0"
                  >
                    <Button
                      text={t("Close")}
                      className={styles["Class_Close"]}
                      onClick={() => handleClosed()}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        size={"md"}
      />
    </Container>
  );
};

export default PollDetails;
