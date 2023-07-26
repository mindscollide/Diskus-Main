import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Modal, Button, Checkbox } from "../../../../components/elements";
import AlarmClock from "../../../../assets/images/AlarmOptions.svg";
import styles from "./ViewPollProgress.module.css";
import profile from "../../../../assets/images/profile_polls.svg";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import { Progress } from "antd";
import { useTranslation } from "react-i18next";
import { setviewpollProgressModal } from "../../../../store/actions/Polls_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CustomRadio from "../../../../components/elements/radio/Radio";

const ViewPollProgress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { PollsReducer } = useSelector((state) => state);
  console.log(PollsReducer, "PollsReducerPollsReducerPollsReducerPollsReducer");
  const [viewProgressPollsDetails, setViewProgressPollsDetails] = useState({
    PollTitle: "",
    Date: "",
    AllowMultipleAnswers: false,
  });
  const [viewpollMembers, setViewPollmembers] = useState([]);
  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      let pollData = PollsReducer.Allpolls.poll.pollDetails;
      let memberpollsprogressView = [];
      if (Object.keys(PollsReducer.Allpolls.poll.pollParticipants).length > 0) {
        PollsReducer.Allpolls.poll.pollParticipants.map((data, index) => {
          console.log(data, "datadatadatadatadatadatadatadata");
          memberpollsprogressView.push(data);
        });
      }
      setViewPollmembers(memberpollsprogressView);
      setViewProgressPollsDetails({
        ...viewProgressPollsDetails,
        PollTitle: pollData.pollTitle,
        Date: pollData.dueDate,
        AllowMultipleAnswers: pollData.allowMultipleAnswers,
      });
    }
  }, [PollsReducer.Allpolls]);

  console.log(
    viewpollMembers,
    "viewpollMembersviewpollMembersviewpollMembersviewpollMembers"
  );

  console.log(
    viewProgressPollsDetails.PollTitle,
    "viewProgressPollsDetailsviewProgressPollsDetailsviewProgressPollsDetails"
  );
  const [checkboxesState, setCheckboxesState] = useState({
    checkedYes: false,
    checkedNO: false,
  });

  const HandleCheckBoxYes = () => {
    setCheckboxesState({
      ...checkboxesState,
      checkedYes: !checkboxesState.checkedYes,
    });
    console.log(checkboxesState.checkedYes, "checkedYescheckedYescheckedYes");
  };

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");

    return newDate;
  };

  const HandleCheckBoxNo = () => {
    setCheckboxesState({
      ...checkboxesState,
      checkedNO: !checkboxesState.checkedNO,
    });
  };
  const { t } = useTranslation();
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
                    <img src={AlarmClock} width="14.97px" height="14.66px" />
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
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Box_For_Title_toShow"]}
                  >
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <span className={styles["ViewTitleTOShowOnProgress"]}>
                          {viewProgressPollsDetails.PollTitle}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1} md={1} sm={12}></Col>
                  <Col lg={11} md={11} sm={12} className="m-0 p-0 ">
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Yes_ViewProgress"]}>
                          {t("Yes")}
                          <span>(20)</span>
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={1}
                    ms={1}
                    sm={12}
                    className={styles["CheckBox_ViewProgressPolls"]}
                  >
                    {/* <Checkbox
                      checked={checkboxesState.checkedYes}
                      onChange={HandleCheckBoxYes}
                      classNameCheckBoxP="d-none"
                    /> */}
                    {viewProgressPollsDetails.AllowMultipleAnswers === true ? (
                      ""
                    ) : (
                      <CustomRadio
                        change={HandleCheckBoxYes}
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
                      percent={59}
                      status="active"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={1} md={1} sm={1}></Col>
                  <Col lg={11} md={11} sm={12} className="m-0 p-0">
                    <span className={styles["Yes_ViewProgress"]}>
                      {t("NO")} <span>(9)</span>
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
                    {/* <Checkbox
                      checked={checkboxesState.checkedNO}
                      onChange={HandleCheckBoxNo}
                      classNameCheckBoxP="d-none"
                    /> */}
                    {viewProgressPollsDetails.AllowMultipleAnswers === true ? (
                      ""
                    ) : (
                      <CustomRadio
                        change={HandleCheckBoxYes}
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
                      percent={9}
                      status="active"
                    />
                  </Col>
                </Row>
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
