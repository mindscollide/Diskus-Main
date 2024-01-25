import React, { useEffect, useState } from "react";
import styles from "./CastVotePollsMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Checkbox,
  CustomRadio2,
  Notification,
} from "../../../../../../components/elements";
import { Progress } from "antd";
import moment from "moment";
import { EditmeetingDateFormat } from "../../../../../../commen/functions/date_formater";
import { castVoteApi } from "../../../../../../store/actions/Polls_actions";
import { Radio3 } from "../../../../../../components/elements/radio/Radio3";

const CastVotePollsMeeting = ({ setvotePolls, currentMeeting }) => {
  const { t } = useTranslation();
  const { PollsReducer } = useSelector((state) => state);
  let userID = localStorage.getItem("userID");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pollParticipants, setPollParticipants] = useState([]);
  const [pollsOption, setPollsOption] = useState([]);

  const [viewProgressPollsDetails, setViewProgressPollsDetails] = useState({
    PollID: 0,
    PollTitle: "",
    Date: "",
    AllowMultipleAnswers: false,
    answer: [],
  });

  const handleSubmitVote = () => {
    if (viewProgressPollsDetails.answer.length > 0) {
      let data = {
        PollID: viewProgressPollsDetails.PollID,
        UserID: parseInt(userID),
        PollOptionIDs: viewProgressPollsDetails.answer,
      };
      console.log(data, "submitvotesubmitvotesubmitvote");
      dispatch(castVoteApi(navigate, data, t, 3, setvotePolls, currentMeeting));
    } else {
      // open sncak bar for atleast select one option
      setOpen({
        open: true,
        message: t("Required-atleast-one-vote"),
      });
    }
  };
  const handleForCheck = (value) => {
    let findID = viewProgressPollsDetails.answer.find(
      (data, index) => data === value
    );
    if (findID !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  const handleCheckBoxForOneOnly = (e) => {
    console.log(
      e,
      "handleCheckBoxForOneOnlyhandleCheckBoxForOneOnlyhandleCheckBoxForOneOnly"
    );
    let value = e.target.value;

    setViewProgressPollsDetails({
      ...viewProgressPollsDetails,
      answer: [value],
    });
  };
  const handleCheckBoxYes = (e) => {
    let checked = e.target.checked;
    let name = e.target.name;
    let array = [...viewProgressPollsDetails.answer];
    if (checked) {
      array.push(name);
      setViewProgressPollsDetails({
        ...viewProgressPollsDetails,
        answer: array,
      });
    } else {
      const findID = viewProgressPollsDetails.answer.indexOf(name);
      if (findID !== -1) {
        array.splice(findID, 1);
        setViewProgressPollsDetails({
          ...viewProgressPollsDetails,
          answer: array,
        });
      }
    }
  };
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
          setViewProgressPollsDetails({
            ...viewProgressPollsDetails,
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
    setvotePolls(false);
  };

  return (
    <>
      <section>
        <Row>
          <Col lg={6} md={6} sm={6}>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Heading_vewPolls_Published"]}>
                  {viewProgressPollsDetails.PollTitle}
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
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="mt-2"
                              key={index}
                            >
                              <section>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={styles["Messege_span_Class"]}
                                    >
                                      {data.answer}{" "}
                                      <span>({data.totalVotes})</span>
                                    </span>
                                  </Col>
                                  {/* <Col lg={2} md={2} sm={2}>
                                  <span className={styles["Percentage_Class"]}>
                                    59%
                                  </span>
                                </Col> */}
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
                                        {viewProgressPollsDetails.AllowMultipleAnswers ===
                                        true ? (
                                          <Checkbox
                                            name={data.pollAnswerID}
                                            checked={handleForCheck(
                                              data.pollAnswerIDW
                                            )}
                                            onChange={handleCheckBoxYes}
                                            classNameCheckBoxP="d-none"
                                          />
                                        ) : (
                                          <CustomRadio2
                                            value={
                                              viewProgressPollsDetails.answer
                                            }
                                            Optios={data.pollAnswerID}
                                            onChange={handleCheckBoxForOneOnly}

                                            // className={
                                            //   styles["Custom_radio_button"]
                                            // }
                                          />
                                        )}
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
            <Row className="mt-4">
              <Col lg={6} md={6} sm={6}>
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
                      {viewProgressPollsDetails.Date !== "" && (
                        <>
                          {moment(
                            EditmeetingDateFormat(
                              viewProgressPollsDetails?.Date + "000000"
                            )
                          ).format("DD MMM YYYY")}
                        </>
                      )}
                    </span>
                  </Col>
                </Row>
              </Col>
              {viewProgressPollsDetails.AllowMultipleAnswers === true ? (
                <Col
                  lg={6}
                  md={6}
                  sm={6}
                  className="d-flex justify-content-end align-items-center"
                >
                  <span className={styles["Multiple_Answers_zstyles"]}>
                    {t("Multiple-answers-allowed")}
                  </span>
                </Col>
              ) : (
                ""
              )}
            </Row>
          </Col>
          <Col lg={6} md={6} sm={12}>
            <Row>
              {pollParticipants.length > 0 &&
                pollParticipants.map((data, index) => {
                  return (
                    <Col lg={6} md={6} sm={6} className="mt-3">
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <section className={styles["Outer_Box_Members"]}>
                            <Row className="mt-2">
                              <Col
                                lg={10}
                                md={10}
                                sm={10}
                                className="d-flex gap-2 align-items-center"
                              >
                                <img
                                  src={`data:image/jpeg;base64,${data?.profilePicture?.displayProfilePictureName}`}
                                  draggable={false}
                                  height="33px"
                                  alt=""
                                  width="33px"
                                  className={styles["ProfileStyles"]}
                                />
                                <span className={styles["Name_Members"]}>
                                  {data.userName}
                                </span>
                              </Col>
                            </Row>
                          </section>
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Button_Cast_vote_polls_Meeting"]}
              onClick={handleCancelButton}
            />
            <Button
              text={t("Submit")}
              className={styles["Submit_Button_Cast_vote_polls_Meeting"]}
              onClick={handleSubmitVote}
            />
          </Col>
        </Row>
      </section>
      <Notification message={open.message} open={open.open} setOpen={setOpen} />
    </>
  );
};

export default CastVotePollsMeeting;
