import React, { useEffect, useState } from "react";
import styles from "./Votepoll.module.css";
import {
  Modal,
  Button,
  Checkbox,
  Notification,
} from "../../../components/elements";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { useSSR, useTranslation } from "react-i18next";
import { Progress } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { style } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  castVoteApi,
  setVotePollModal,
} from "../../../store/actions/Polls_actions";
import CustomRadio from "../../../components/elements/radio/Radio";
const Votepoll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { PollsReducer } = useSelector((state) => state);
  console.log(PollsReducer, "VotevoteVotevoteVotevoteVotevoteVotevoteVotevote");
  const { t } = useTranslation();
  const [pollsOption, setPollsOption] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [viewProgressPollsDetails, setViewProgressPollsDetails] = useState({
    PollID: 0,
    PollTitle: "",
    Date: "",
    AllowMultipleAnswers: false,
    answer: [],
  });

  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      let pollData = PollsReducer.Allpolls.poll;
      let pollDetails = pollData.pollDetails;
      let pollOptions = pollData.pollOptions;

      if (pollOptions.length > 0) {
        setPollsOption(pollOptions);
      }
      console.log("pollDetails", pollDetails);
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
  }, [PollsReducer.Allpolls]);

  const handleCheckBoxYes = (e) => {
    let checked = e.target.checked;
    let name = e.target.name;
    console.log(checked, "checkedYescheckedYescheckedYes");
    console.log(name, "checkedYescheckedYescheckedYes");
    let array = [...viewProgressPollsDetails.answer];
    if (checked) {
      array.push(name);
      setViewProgressPollsDetails({
        ...viewProgressPollsDetails,
        answer: array,
      });
    } else {
      const findID = viewProgressPollsDetails.answer.indexOf(name);
      if (findID != -1) {
        array.splice(findID, 1);
        setViewProgressPollsDetails({
          ...viewProgressPollsDetails,
          answer: array,
        });
      }
    }
  };
  console.log(
    viewProgressPollsDetails.answer,
    "checkedYescheckedYescheckedYes"
  );
  const handleForCheck = (value) => {
    let findID = viewProgressPollsDetails.answer.find(
      (data, index) => data === value
    );
    if (findID != undefined) {
      return true;
    } else {
      return false;
    }
  };
  let userID = localStorage.getItem("userID");
  const handleSubmitVote = () => {
    if (viewProgressPollsDetails.answer.length > 0) {
      let data = {
        PollID: viewProgressPollsDetails.PollID,
        UserID: parseInt(userID),
        PollOptionIDs: viewProgressPollsDetails.answer,
      };
      console.log(data, "submitvotesubmitvotesubmitvote");
      dispatch(castVoteApi(navigate, data, t));
    } else {
      // open sncak bar for atleast select one option
      setOpen({
        flag: true,
        message: t("Required-atleast-one-vote"),
      });
    }
  };

  return (
    <>
      <Container>
        <Modal
          show={PollsReducer.isVotePollModal}
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
                    src={BlackCrossIcon}
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
                      className={styles["Border_box"]}
                    >
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["ViewTitleTOShowOnProgress"]}>
                            {viewProgressPollsDetails.PollTitle}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {pollsOption.length > 0 ? (
                    pollsOption.map((data, index) => {
                      return (
                        <>
                          <Row>
                            <Col lg={1} md={1} sm={12}></Col>
                            <Col lg={11} md={11} sm={12} className="m-0 p-0">
                              <span className={styles["Yes_Vote_poll"]}>
                                {data.answer}
                                <span>({data.totalVotes})</span>
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={1}
                              ms={1}
                              sm={12}
                              className={styles["CheckBox_ViewProgressPolls"]}
                            >
                              {viewProgressPollsDetails.AllowMultipleAnswers ? (
                                <Checkbox
                                  name={data.pollAnswerID}
                                  checked={handleForCheck(data.pollAnswerID)}
                                  onChange={handleCheckBoxYes}
                                  classNameCheckBoxP="d-none"
                                />
                              ) : (
                                <CustomRadio
                                  checked={data.voted}
                                  change={handleCheckBoxYes}
                                  className={styles["Custom_radio_button"]}
                                />
                              )}
                            </Col>
                            <Col
                              lg={11}
                              md={11}
                              sm={12}
                              className={styles["Progress_bar_view_polls"]}
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
                          {t("Mutiple-answer-allowed")}
                        </span>
                      </Col>
                    </Row>
                  ) : null}
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
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default Votepoll;
