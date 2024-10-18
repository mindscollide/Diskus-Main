import React, { useEffect } from "react";
import styles from "./ViewPoll.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { Modal, Button } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import AlarmClock from "../../../assets/images/AlarmOptions.svg";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setviewpollModal } from "../../../store/actions/Polls_actions";
import moment from "moment";
import { newTimeFormaterAsPerUTCTalkDate } from "../../../commen/functions/date_formater";

const ViewPoll = () => {
  const dispatch = useDispatch();
  const { PollsReducer } = useSelector((state) => state);

  const [viewpollMembers, setViewPollmembers] = useState([]);

  const [pollAnswersDetailsView, setPollAnswersDetailsView] = useState([]);
  const [viewPollsDetails, setViewPollsDetails] = useState({
    date: "",
    Title: "",
    allowmultipleanswers: false,
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      if (Object.keys(PollsReducer.Allpolls.poll.pollOptions).length > 0) {
        setPollAnswersDetailsView(PollsReducer.Allpolls.poll.pollOptions);
      }
    }
  }, [PollsReducer.Allpolls]);

  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      let users = [];
      if (Object.keys(PollsReducer.Allpolls.poll.pollParticipants).length > 0) {
        PollsReducer.Allpolls.poll.pollParticipants.map((data) => {
          users.push({
            emailAddress: data.emailAddress,
            userName: data.userName,
            profilePic: data.profilePicture,
          });
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
                    <img
                      draggable="false"
                      src={AlarmClock}
                      width="14.97px"
                      height="14.66px"
                      alt=""
                    />
                    <span className={styles["Due_Date_viewPoll"]}>
                      {t("Due-date-on")}{" "}
                      <span>
                        {newTimeFormaterAsPerUTCTalkDate(viewPollsDetails.date)}
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
                  alt=""
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
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={`${styles["BOx_for_yes"]} d-flex`}
                  >
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        {viewPollsDetails.Title.length > 100 ? (
                          // Add d-flex class and justify-content-center to center the text
                          <div
                            className={`${styles["scrollable-title"]} d-flex justify-content-center`}
                          >
                            {viewPollsDetails.Title}
                          </div>
                        ) : (
                          // Add d-flex class and align-items-center to center the text
                          <div
                            className={`${styles["scrollable-title2"]} d-flex align-items-center`}
                          >
                            {viewPollsDetails.Title}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    className={styles["scroll-height"]}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                    {pollAnswersDetailsView.length > 0 &&
                      pollAnswersDetailsView.map((list, index) => {
                        return (
                          <>
                            <span className={`${styles["BOx_for_yes"]} d-flex`}>
                              {list.answer.length > 100 ? (
                                <div
                                  className={`${styles["scrollable-title"]} d-flex justify-content-center `}
                                >
                                  {list.answer}
                                </div>
                              ) : (
                                <div
                                  className={`${styles["scrollable-title2"]} d-flex align-items-center`}
                                >
                                  {list.answer}
                                </div>
                              )}
                            </span>
                          </>
                        );
                      })}
                  </Col>
                </Row>
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
                      {viewpollMembers.map((data) => {
                        return (
                          <Col lg={6} md={6} sm={12} className="mt-2">
                            <Row>
                              <Col lg={11} md={11} sm={12} className="m-0 p-0">
                                <Row className={styles["Card_border2"]}>
                                  <Col sm={12} md={12} lg={12}>
                                    <img
                                      draggable="false"
                                      src={`data:image/jpeg;base64,${data.profilePic.displayProfilePictureName}`}
                                      width="33px"
                                      height="33px"
                                      className="rounded-circle"
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
