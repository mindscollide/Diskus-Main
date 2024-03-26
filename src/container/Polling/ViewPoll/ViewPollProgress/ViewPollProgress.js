import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  Modal,
  Button,
  Checkbox,
  CustomRadio2,
  TextField,
} from "../../../../components/elements";
import AlarmClock from "../../../../assets/images/AlarmOptions.svg";
import styles from "./ViewPollProgress.module.css";
import profile from "../../../../assets/images/profile_polls.svg";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import { Progress } from "antd";
import { useTranslation } from "react-i18next";
import {
  setviewpollProgressModal,
  viewVotesApi,
} from "../../../../store/actions/Polls_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ViewPollProgress = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { PollsReducer } = useSelector((state) => state);
  const [viewProgressPollsDetails, setViewProgressPollsDetails] = useState({
    PollID: 0,
    PollTitle: "",
    Date: "",
    AllowMultipleAnswers: false,
  });
  const [checkboxesState, setCheckboxesState] = useState({
    checkedYes: true,
  });
  const [viewpollMembers, setViewPollmembers] = useState([]);
  const [pollsOption, setPollsOption] = useState([]);

  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      let pollData = PollsReducer.Allpolls.poll;
      let pollDetails = pollData.pollDetails;
      let pollParticipants = pollData.pollParticipants;
      let pollOptions = pollData.pollOptions;
      let pollSelectedAnswers = pollData.selectedAnswers;

      console.log(pollDetails, "pollDetailspollDetails");

      let memberpollsprogressView = [];
      let newOption = [];

      if (Object.keys(pollParticipants).length > 0) {
        pollParticipants.map((data, index) => {
          memberpollsprogressView.push(data);
        });
      }

      if (pollSelectedAnswers.length > 0) {
        pollOptions.map((newdata, index) => {
          let find = pollSelectedAnswers.find(
            (data, index) => data.pollAnswerID === newdata.pollAnswerID
          );
          if (find != undefined) {
            let changeOptionData = {
              answer: newdata.answer,
              pollAnswerID: newdata.pollAnswerID,
              totalVotes: newdata.totalVotes,
              votePercentage: newdata.votePercentage,
              voted: true,
            };
            newOption.push(changeOptionData);
          } else {
            let changeOptionData = {
              answer: newdata.answer,
              pollAnswerID: newdata.pollAnswerID,
              totalVotes: newdata.totalVotes,
              votePercentage: newdata.votePercentage,
              voted: false,
            };
            newOption.push(changeOptionData);
          }
        });
        setPollsOption(newOption);
      } else {
        pollOptions.map((newdata, index) => {
          let changeOptionData = {
            answer: newdata.answer,
            pollAnswerID: newdata.pollAnswerID,
            totalVotes: newdata.totalVotes,
            votePercentage: newdata.votePercentage,
            voted: false,
          };
          newOption.push(changeOptionData);
        });
        setPollsOption(newOption);
      }
      setViewPollmembers(memberpollsprogressView);
      setViewProgressPollsDetails({
        ...viewProgressPollsDetails,
        PollTitle: pollDetails.pollTitle,
        Date: pollDetails.dueDate,
        AllowMultipleAnswers: pollDetails.allowMultipleAnswers,
        PollID: pollDetails.pollID,
      });
    }
  }, [PollsReducer.Allpolls]);

  console.log(viewProgressPollsDetails.Date, "viewProgressPollsDetails");

  const changeDateStartHandler2 = (date) => {
    console.log(date, "viewProgressPollsDetails");
    let newDate = moment(date, "YYYYMMDDHHmmss").format("DD MMMM YYYY");
    console.log(newDate, "viewProgressPollsDetails");
    return newDate;
  };

  const handleViewVotes = () => {
    let data = {
      PollID: viewProgressPollsDetails.PollID,
    };
    dispatch(viewVotesApi(navigate, data, t));
  };

  return (
    <Container>
      <Modal
        show={PollsReducer.viewPollProgress}
        setShow={dispatch(setviewpollProgressModal)}
        modalTitleClassName={styles["ModalHeader_View_poll_progress"]}
        modalHeaderClassName={
          styles["ModalRequestHeader_polling_View_modal_progress"]
        }
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(setviewpollProgressModal(false));
        }}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["BackGround_strip_viewmodal_progress"]}
              >
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2"
                  >
                    <img
                      draggable="false"
                      src={AlarmClock}
                      width="14.97px"
                      height="14.66px"
                      alt=""
                    />
                    <span className={styles["ViewPRogressDueDate"]}>
                      {t("Due-date-on")}{" "}
                      <span>
                        {changeDateStartHandler2(viewProgressPollsDetails.Date)}
                      </span>
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
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
                  width="16px"
                  height="16px"
                  className={styles["View_cross_icon"]}
                  onClick={() => {
                    dispatch(setviewpollProgressModal(false));
                  }}
                />
              </Col>
            </Row>
            <Row className={styles["OverAll_padding"]}>
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
                    <span className={styles["View_poll_heading"]}>
                      {t("View-poll")}
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
                  // <Row className="mt-2">
                  <Row className={styles["Scroller_View_Poll_Published"]}>
                    <Col lg={12} ms={12} sm={12}>
                      {pollsOption.length > 0
                        ? pollsOption.map((data, index) => {
                            return (
                              <>
                                <Row key={index}>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={styles["Yes_ViewProgress"]}
                                    >
                                      {data.answer}{" "}
                                      <span>{"(" + data.totalVotes + ")"}</span>
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col
                                    lg={1}
                                    ms={1}
                                    sm={1}
                                    className={
                                      styles["CheckBox_ViewProgressPolls"]
                                    }
                                  >
                                    {viewProgressPollsDetails.AllowMultipleAnswers ===
                                    true ? (
                                      <Checkbox
                                        disabled={true}
                                        checked={data.voted}
                                        classNameCheckBoxP="d-none"
                                      />
                                    ) : data.voted ? (
                                      <CustomRadio2
                                        disabled={true}
                                        value={[data.pollAnswerID]}
                                        Optios={data.pollAnswerID}
                                      />
                                    ) : (
                                      <CustomRadio2
                                        disabled={true}
                                        value={[]}
                                        Optios={data.pollAnswerID}
                                      />
                                    )}
                                  </Col>
                                  <Col
                                    lg={11}
                                    md={11}
                                    sm={11}
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
                        : null}
                    </Col>
                  </Row>
                ) : (
                  <Row className={styles["Scroller_View_Poll_Published"]}>
                    <Col lg={12} ms={12} sm={12}>
                      {pollsOption.length > 0
                        ? pollsOption.map((data, index) => {
                            return (
                              <>
                                <Row>
                                  <Col lg={1} md={1} sm={12}></Col>
                                  <Col
                                    lg={11}
                                    md={11}
                                    sm={12}
                                    className="m-0 p-0 "
                                  >
                                    <Row className="mt-2">
                                      <Col lg={12} md={12} sm={12}>
                                        <span
                                          className={styles["Yes_ViewProgress"]}
                                        >
                                          {data.answer}
                                          <span>
                                            {"(" + data.totalVotes + ")"}
                                          </span>
                                        </span>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col
                                    lg={1}
                                    ms={1}
                                    sm={1}
                                    className={
                                      styles["CheckBox_ViewProgressPolls"]
                                    }
                                  >
                                    {viewProgressPollsDetails.AllowMultipleAnswers ===
                                    true ? (
                                      <Checkbox
                                        disabled={true}
                                        checked={data.voted}
                                        classNameCheckBoxP="d-none"
                                      />
                                    ) : data.voted ? (
                                      <CustomRadio2
                                        disabled={true}
                                        value={[data.pollAnswerID]}
                                        Optios={data.pollAnswerID}
                                      />
                                    ) : (
                                      <CustomRadio2
                                        disabled={true}
                                        value={[]}
                                        Optios={data.pollAnswerID}
                                      />
                                    )}
                                  </Col>
                                  <Col
                                    lg={10}
                                    md={10}
                                    sm={10}
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
                        : null}
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col lg={1} md={1} sm={1}></Col>
                  <Col
                    lg={11}
                    sm={11}
                    md={12}
                    className="d-flex justify-content-start m-0 p-0 mt-2"
                  >
                    <span className={styles["Multiple_answer"]}>
                      {viewProgressPollsDetails.AllowMultipleAnswers === true
                        ? "Mutiple Answer Allowed"
                        : null}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12} className="d-flex m-0 p-0">
                    <span className={styles["Participants_Heading"]}>
                      {t("Participants")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={
                      styles["Scroller_For_CreatePollModal2_View_poll"]
                    }
                  >
                    <Row>
                      {viewpollMembers.map((data, index) => {
                        return (
                          <Col
                            key={index}
                            lg={6}
                            md={6}
                            sm={12}
                            className="mt-2"
                          >
                            <Row>
                              <Col lg={11} md={11} sm={12} className="m-0 p-0">
                                <Row className={styles["Card_border2"]}>
                                  <Col sm={12} md={12} lg={12}>
                                    <img
                                      draggable="false"
                                      src={`data:image/jpeg;base64,${data.profilePicture.displayProfilePictureName}`}
                                      width="33px"
                                      height="33px"
                                      alt=""
                                    />
                                    <span className={styles["Name_cards"]}>
                                      {data.userName}
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        );
                      })}
                    </Row>
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
                className={styles["OverAll_padding"]}
              >
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2 m-0 p-0 "
                  >
                    <Button
                      text={t("Close")}
                      className={styles["Close_Button_viewprogress"]}
                      onClick={() => {
                        dispatch(setviewpollProgressModal(false));
                      }}
                    />
                    <Button
                      text={t("View-votes")}
                      className={styles["View_votes_btn"]}
                      onClick={handleViewVotes}
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

export default ViewPollProgress;
