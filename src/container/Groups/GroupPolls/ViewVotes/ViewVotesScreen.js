import React, { useEffect, useState } from "react";
import styles from "./ViewVoteScreen.module.css";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Progress } from "antd";
import { Button } from "../../../../components/elements";

const ViewVotesScreen = ({ setviewVotes }) => {
  const { PollsReducer } = useSelector((state) => state);
  const [pollId, setPollId] = useState(0);
  const [pollTitle, setPollTitle] = useState("");
  const [pollAttendiesOpptionsVise, setPollAttendiesOpptionsVise] = useState(
    []
  );
  const [votePollDetailsOptions, setVotePollDetailsOptions] = useState([]);

  useEffect(() => {
    if (
      PollsReducer.viewVotes !== null &&
      PollsReducer.viewVotes !== undefined
    ) {
      let vieVotePollDetails = PollsReducer.viewVotes;
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
    }
  }, [PollsReducer.viewVotes]);

  const handleViewVotesScreen = () => {
    setviewVotes(false);
  };

  return (
    <section>
      <Row>
        <Col lg={7} md={7} sm={12}>
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Heading_vewPolls_Published"]}>
                {pollTitle}
              </span>
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Scroller_View_Published_Polls"]}
            >
              <Row>
                {votePollDetailsOptions.length > 0
                  ? votePollDetailsOptions.map((data, index) => {
                      return (
                        <>
                          <Col lg={12} md={12} sm={12} className="mt-2">
                            <section>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["Messege_span_Class"]}
                                  >
                                    {data.answer}
                                    {""} <span>({data.totalVotes})</span>
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <Row>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex gap-3"
                                    >
                                      <Progress
                                        percent={data.votePercentage}
                                        status="active"
                                        className="pollsDetailsProgress"
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </section>
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col lg={5} md={5} sm={12}>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["viewVotes_container"]}
            >
              {pollAttendiesOpptionsVise.length > 0 &&
                pollAttendiesOpptionsVise.map((pollParticipantData, index) => {
                  return (
                    <>
                      <Row className="mt-3">
                        <Col lg={12} md={12} sm={12}>
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Participant_Count"]}>
                                {pollParticipantData.answer}{" "}
                                <span>({pollParticipantData.totalVotes})</span>
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            {pollParticipantData.pollParticipants.length > 0
                              ? pollParticipantData.pollParticipants.map(
                                  (data, index) => {
                                    return (
                                      <>
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={6}
                                          className={
                                            styles[
                                              "Scroller_View_Published_Polls"
                                            ]
                                          }
                                        >
                                          <section
                                            className={styles["Partipants_box"]}
                                          >
                                            <Row>
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                className="d-flex align-items-center gap-2"
                                              >
                                                <img
                                                  draggable={false}
                                                  src={`data:image/jpeg;base64,${data?.profilePicture?.displayProfilePictureName}`}
                                                  height="33px"
                                                  alt=""
                                                  width="33px"
                                                  className={
                                                    styles["Profile_Style"]
                                                  }
                                                />
                                                <span
                                                  className={
                                                    styles["Participants_name"]
                                                  }
                                                >
                                                  {data?.userName}
                                                </span>
                                              </Col>
                                            </Row>
                                          </section>
                                        </Col>
                                      </>
                                    );
                                  }
                                )
                              : null}
                          </Row>
                        </Col>
                      </Row>
                    </>
                  );
                })}
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button
                text={"Cancel"}
                className={styles["Cacnel_styles_button_view_Votes_screen"]}
                onClick={handleViewVotesScreen}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default ViewVotesScreen;
