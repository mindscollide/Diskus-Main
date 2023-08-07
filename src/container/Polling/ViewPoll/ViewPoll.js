import React, { useEffect } from "react";
import styles from "./ViewPoll.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { Modal, Button, TextField } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import AlarmClock from "../../../assets/images/AlarmOptions.svg";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import profile from "../../../assets/images/profile_polls.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setviewpollModal } from "../../../store/actions/Polls_actions";
import moment from "moment";

const ViewPoll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { PollsReducer } = useSelector((state) => state);
  console.log(PollsReducer, "PollsReducerPollsReducerPollsReducerPollsReducer");
  const [viewpollMembers, setViewPollmembers] = useState([]);
  const [pollAnswersDetailsView, setPollAnswersDetailsView] = useState([]);
  const [viewPollsDetails, setViewPollsDetails] = useState({
    date: "",
    Title: "",
    allowmultipleanswers: false,
  });
  const { t } = useTranslation();

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");

    return newDate;
  };

  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      let pollanswers = [];
      if (Object.keys(PollsReducer.Allpolls.poll.pollOptions).length > 0) {
        setPollAnswersDetailsView(PollsReducer.Allpolls.poll.pollOptions);
      }
    }
  }, [PollsReducer.Allpolls]);

  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      let users = [];
      if (Object.keys(PollsReducer.Allpolls.poll.pollParticipants).length > 0) {
        PollsReducer.Allpolls.poll.pollParticipants.map((data, index) => {
          users.push(data.userName);
        });
      }
      setViewPollsDetails({
        ...viewPollsDetails,
        date: PollsReducer.Allpolls.poll.pollDetails.dueDate,
        Title: PollsReducer.Allpolls.poll.pollDetails.pollTitle,
        allowmultipleanswers:
          PollsReducer.Allpolls.poll.pollDetails.allowMultipleAnswers,
      });
      setViewPollmembers(users);
    }
  }, [PollsReducer.Allpolls]);
  return (
    <Container>
      <Modal
        show={PollsReducer.viewPollModal}
        setShow={dispatch(setviewpollModal)}
        modalTitleClassName={styles["ModalHeader_View_poll"]}
        modalHeaderClassName={styles["ModalRequestHeader_polling_View_modal"]}
        modalBodyClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(setviewpollModal(false));
        }}
        ModalTitle={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["BackGroundStrip_viewPoll"]}
              >
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2"
                  >
                    <img src={AlarmClock} width="14.97px" height="14.66px" />
                    <span className={styles["Due_Date_viewPoll"]}>
                      {t("Due-date-on")}{" "}
                      <span>
                        {changeDateStartHandler2(viewPollsDetails.date)}
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
                  src={BlackCrossIcon}
                  width="16px"
                  height="16px"
                  className={styles["View_cross_icon"]}
                  onClick={() => {
                    dispatch(setviewpollModal(false));
                  }}
                />
              </Col>
            </Row>
            <Row className={styles["OverallPadding"]}>
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
                    <span className={styles["View_poll_heading"]}>
                      {t("View-poll")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      applyClass={"PollingCViewText"}
                      labelClass="d-none"
                      maxLength={500}
                      value={viewPollsDetails.Title}
                      disable={true}
                    />
                  </Col>
                </Row>

                {pollAnswersDetailsView.map((data, index) => {
                  return (
                    <Row className="mt-2" key={index}>
                      <Col
                        lg={12}
                        sm={12}
                        md={12}
                        className="mt-2"
                      >
                        <TextField
                          applyClass={"PollingCViewText"}
                          labelClass="d-none"
                          maxLength={500}
                          value={data.answer}
                          disable={true}
                        />
                      </Col>
                    </Row>
                  );
                })}

                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
                    <span className={styles["Multiple_viewModal"]}>
                      {viewPollsDetails.allowmultipleanswers === true
                        ? "Multiple Answers Allowed"
                        : ""}
                    </span>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
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
                          <Col lg={6} md={6} sm={12} className="mt-2">
                            <Row>
                              <Col lg={11} md={11} sm={12} className="m-0 p-0">
                                <Row className={styles["Card_border2"]}>
                                  <Col sm={12} md={12} lg={12}>
                                    <img
                                      src={profile}
                                      width="33px"
                                      height="33px"
                                    />
                                    <span className={styles["Name_cards"]}>
                                      {data}
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
              <Col lg={12} md={12} sm={12} className={styles["OverallPadding"]}>
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end m-0 p-0"
                  >
                    <Button
                      text={t("Close")}
                      className={styles["Close_btn_ViewPoll"]}
                      onClick={() => {
                        dispatch(setviewpollModal(false));
                      }}
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

export default ViewPoll;
