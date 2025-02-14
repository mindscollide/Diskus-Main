import React, { useEffect, useState } from "react";
import styles from "./Votepoll.module.css";
import {
  Modal,
  Button,
  Checkbox,
  Notification,
  CustomRadio2,
} from "../../../components/elements";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { useTranslation } from "react-i18next";
import { Progress } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setVotePollModal,
  UpdatedCastVoteAPI,
} from "../../../store/actions/Polls_actions";
import { showMessage } from "../../../components/elements/snack_bar/utill";
import { convertToArabicNumerals } from "../../../commen/functions/regex";
const Votepoll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const PollsReducerAllpolls = useSelector(
    (state) => state.PollsReducer.Allpolls
  );
  const PollsReducerisVotePollModal = useSelector(
    (state) => state.PollsReducer.isVotePollModal
  );
  let userID = localStorage.getItem("userID");
  const { t } = useTranslation();
  const [pollsOption, setPollsOption] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [viewProgressPollsDetails, setViewProgressPollsDetails] = useState({
    PollID: 0,
    PollTitle: "",
    Date: "",
    AllowMultipleAnswers: false,
    answer: [],
  });

  useEffect(() => {
    if (PollsReducerAllpolls !== null && PollsReducerAllpolls !== undefined) {
      let pollData = PollsReducerAllpolls.poll;
      let pollDetails = pollData.pollDetails;
      let pollOptions = pollData.pollOptions;
      let selectedAnswers = pollData.selectedAnswers;
      console.log(pollData, "pollDatapollDatapollDatapollData");
      if (pollOptions.length > 0) {
        setPollsOption(pollOptions);
      }

      if (Object.keys(pollDetails).length > 0) {
        setViewProgressPollsDetails({
          ...viewProgressPollsDetails,
          PollTitle: pollDetails.pollTitle,
          Date: pollDetails.dueDate,
          AllowMultipleAnswers: pollDetails.allowMultipleAnswers,
          PollID: pollDetails.pollID,
          answer: selectedAnswers.map((answer) => answer.pollAnswerID),
        });
      }
    }
  }, [PollsReducerAllpolls]);

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

  const handleCheckBoxForOneOnly = (e) => {
    let value = e.target.value;

    setViewProgressPollsDetails({
      ...viewProgressPollsDetails,
      answer: [value],
    });
  };

  const handleForCheck = (value) => {
    let findID = viewProgressPollsDetails.answer.find((data) => data === value);
    if (findID !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmitVote = () => {
    if (viewProgressPollsDetails.answer.length > 0) {
      let data = {
        PollID: viewProgressPollsDetails.PollID,
        UserID: parseInt(userID),
        PollOptionIDs: viewProgressPollsDetails.answer,
        IsCratedFromMainPoll: true,
      };

      dispatch(UpdatedCastVoteAPI(navigate, data, t));
    } else {
      // open sncak bar for atleast select one option
      showMessage(t("Required-atleast-one-vote"), "error", setOpen);
    }
  };

  return (
    <>
      <Container>
        <Modal
          show={PollsReducerisVotePollModal}
          setShow={dispatch(setVotePollModal)}
          onHide={() => {
            dispatch(setVotePollModal(false));
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
                    className={styles["Vote_Poll_cross_ICon"]}
                    height="16px"
                    width="16px"
                    onClick={() => {
                      dispatch(setVotePollModal(false));
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles["OverAll_padding"]}>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="m-0 p-0">
                      <span className={styles["Vote_poll_Heading"]}>
                        {t("Vote-poll")}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={`${styles["BOx_for_yes"]} d-flex`}
                    >
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          {viewProgressPollsDetails.PollTitle.length > 100 ? (
                            // Add d-flex class and justify-content-center to center the text
                            <div
                              className={`${styles["scrollable-title"]} d-flex justify-content-center`}
                            >
                              {viewProgressPollsDetails.PollTitle}
                            </div>
                          ) : (
                            // Add d-flex class and align-items-center to center the text
                            <div
                              className={`${styles["scrollable-title2"]} d-flex align-items-center`}
                            >
                              {viewProgressPollsDetails.PollTitle}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {pollsOption.length > 2 ? (
                    <>
                      <Row className={styles["Scroller_View_Poll_Published"]}>
                        <Col lg={12} ms={12} sm={12}>
                          {pollsOption.length > 0 ? (
                            pollsOption.map((data, index) => {
                              return (
                                <>
                                  <Row key={index}>
                                    <Col lg={1} md={1} sm={12}></Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={12}
                                      className="m-0 p-0"
                                    >
                                      <span className={styles["Yes_Vote_poll"]}>
                                        {data.answer}{" "}
                                        <span>
                                          (
                                          {convertToArabicNumerals(
                                            data.totalVotes,
                                            CurrentLanguage
                                          )}
                                          )
                                        </span>
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col
                                      lg={1}
                                      ms={1}
                                      sm={12}
                                      className={
                                        styles["CheckBox_ViewProgressPolls"]
                                      }
                                    >
                                      {viewProgressPollsDetails.AllowMultipleAnswers ===
                                      true ? (
                                        <Checkbox
                                          name={data.pollAnswerID}
                                          checked={handleForCheck(
                                            data.pollAnswerID
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
                                        />
                                      )}
                                    </Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={12}
                                      className={
                                        styles["Progress_bar_view_polls"]
                                      }
                                    >
                                      <Progress
                                        className="Progress_bar_Polls"
                                        percent={data.votePercentage}
                                        status="active"
                                      />
                                    </Col>
                                  </Row>
                                </>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row className={styles["Scroller_View_Poll_Published"]}>
                        <Col lg={12} ms={12} sm={12}>
                          {pollsOption.length > 0 ? (
                            pollsOption.map((data, index) => {
                              return (
                                <>
                                  <Row key={index}>
                                    <Col lg={1} md={1} sm={12}></Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={12}
                                      className="m-0 p-0"
                                    >
                                      <span className={styles["Yes_Vote_poll"]}>
                                        {data.answer}
                                        <span>
                                          (
                                          {convertToArabicNumerals(
                                            data.totalVotes,
                                            CurrentLanguage
                                          )}
                                          )
                                        </span>
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col
                                      lg={1}
                                      ms={1}
                                      sm={12}
                                      className={
                                        styles["CheckBox_ViewProgressPolls"]
                                      }
                                    >
                                      {viewProgressPollsDetails.AllowMultipleAnswers ===
                                      true ? (
                                        <Checkbox
                                          name={data.pollAnswerID}
                                          checked={handleForCheck(
                                            data.pollAnswerID
                                          )}
                                          onChange={(e) => handleCheckBoxYes(e)}
                                          classNameCheckBoxP="d-none"
                                        />
                                      ) : (
                                        <CustomRadio2
                                          value={
                                            viewProgressPollsDetails.answer
                                          }
                                          Optios={data.pollAnswerID}
                                          className="custom-radio"
                                          onChange={handleCheckBoxForOneOnly}
                                        />
                                      )}
                                    </Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={12}
                                      className={
                                        styles["Progress_bar_view_polls"]
                                      }
                                    >
                                      <Progress
                                        className="Progress_bar_Polls"
                                        percent={data.votePercentage}
                                        status="active"
                                      />
                                    </Col>
                                  </Row>
                                </>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}

                  {viewProgressPollsDetails.AllowMultipleAnswers === true ? (
                    <Row>
                      <Col lg={1} md={1} sm={1}></Col>
                      <Col
                        lg={11}
                        sm={11}
                        md={12}
                        className="d-flex justify-content-start m-0 p-0 mt-2"
                      >
                        <span className={styles["Multiple_vote_poll"]}>
                          {t("You-can-select-multiple-options")}
                        </span>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
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
                  className={styles["OverAll_padding"]}
                >
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="m-0 p-0 d-flex gap-2"
                    >
                      <Button
                        text={t("Close")}
                        className={styles["Close_Btn_votepoll"]}
                        onClick={() => {
                          dispatch(setVotePollModal(false));
                        }}
                      />
                      <Button
                        text={t("Submit")}
                        className={styles["Submit_btn_votepoll"]}
                        onClick={handleSubmitVote}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Votepoll;
