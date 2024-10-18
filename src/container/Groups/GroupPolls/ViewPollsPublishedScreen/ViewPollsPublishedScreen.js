import React, { useState, useEffect } from "react";
import styles from "./ViewPollsPublishedScreen.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Button, Checkbox } from "../../../../components/elements";
import { Progress } from "antd";
import ViewVotesScreen from "../ViewVotes/ViewVotesScreen";
import { viewVotesApi } from "../../../../store/actions/Polls_actions";
import moment from "moment";
import { EditmeetingDateFormat } from "../../../../commen/functions/date_formater";

const ViewPollsPublishedScreen = ({ setViewPublishedPoll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { PollsReducer } = useSelector((state) => state);
  const [viewVotes, setviewVotes] = useState(false);

  const [pollParticipants, setPollParticipants] = useState([]);
  const [pollsOption, setPollsOption] = useState([]);

  const [viewPublishedPollDetails, setViewPublishedPollDetails] = useState({
    PollID: 0,
    PollTitle: "",
    Date: "",
    AllowMultipleAnswers: false,
    answer: [],
  });

  useEffect(() => {
    try {
      if (
        PollsReducer.Allpolls !== null &&
        PollsReducer.Allpolls !== undefined
      ) {
        let pollData = PollsReducer.Allpolls.poll;
        let pollDetails = pollData.pollDetails;
        let pollOptions = pollData.pollOptions;
        let pollParticipants = pollData.pollParticipants;

        if (pollOptions.length > 0) {
          setPollsOption(pollOptions);
        }
        if (pollParticipants.length > 0) {
          setPollParticipants(pollParticipants);
        }
        if (Object.keys(pollDetails).length > 0) {
          setViewPublishedPollDetails({
            ...viewPublishedPollDetails,
            PollTitle: pollDetails.pollTitle,
            Date: pollDetails.dueDate,
            AllowMultipleAnswers: pollDetails.allowMultipleAnswers,
            PollID: pollDetails.pollID,
          });
        }
      }
    } catch {}
  }, [PollsReducer.Allpolls]);

  const handleCancelButton = () => {
    setViewPublishedPoll(false);
  };

  const handleViewVotesScreen = () => {
    let data = {
      PollID: viewPublishedPollDetails.PollID,
    };
    dispatch(viewVotesApi(navigate, data, t, 1, setviewVotes));
  };
  return (
    <>
      {viewVotes ? (
        <ViewVotesScreen setviewVotes={setviewVotes} />
      ) : (
        <>
          <section>
            <Row>
              <Col lg={6} md={6} sm={12}>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Heading_vewPolls_Published"]}>
                      {viewPublishedPollDetails.PollTitle}
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
                      {pollsOption.length > 0
                        ? pollsOption.map((data, index) => {
                            return (
                              <>
                                <Col lg={12} md={12} sm={12} className="mt-2">
                                  <section>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <span
                                          className={
                                            styles["Messege_span_Class"]
                                          }
                                        >
                                          {data.answer}{" "}
                                          <span>{data.totalVotes}</span>
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
                                            <Checkbox disabled={true} />
                                            <Progress
                                              className="Progress_bar_Polls"
                                              percent={data.votePercentage}
                                              status="active"
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
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Date_Heading"]}>
                          {t("Due-date")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Date_Fetched"]}>
                          {viewPublishedPollDetails.Date !== "" && (
                            <>
                              {moment(
                                EditmeetingDateFormat(
                                  viewPublishedPollDetails?.Date
                                )
                              ).format("DD MMM YYYY")}
                            </>
                          )}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col lg={1} md={1} sm={1}></Col>
              <Col lg={5} md={5} sm={12}>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Participants"]}>
                      {"Participants"}
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
                      {pollParticipants.length > 0
                        ? pollParticipants.map((data, index) => {
                            return (
                              <>
                                <Col lg={6} md={6} sm={6} className="mt-2">
                                  <section className={styles["Partipants_box"]}>
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
                                          className={styles["Profile_Style"]}
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
                          })
                        : null}
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["Close_button_View"]}
                      onClick={handleCancelButton}
                    />
                    <Button
                      text={t("View-votes")}
                      className={styles["ViewVotes_button_View"]}
                      onClick={handleViewVotesScreen}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </section>
        </>
      )}
    </>
  );
};

export default ViewPollsPublishedScreen;
