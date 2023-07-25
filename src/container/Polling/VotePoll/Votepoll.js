import React, { useEffect, useState } from "react";
import styles from "./Votepoll.module.css";
import { Modal, Button, Checkbox } from "../../../components/elements";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { useSSR, useTranslation } from "react-i18next";
import { Progress } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { style } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Votepoll = ({ showVotePoll, setShowVotePoll }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { PollsReducer } = useSelector((state) => state);
  console.log(PollsReducer, "PollsReducerPollsReducerPollsReducerPollsReducer");
  const { t } = useTranslation();
  const [votePollUpdatedDetails, setvotePollUpdatedDetails] = useState({
    PollTitle: "",
  });

  useEffect(() => {
    if (PollsReducer.Allpolls !== null && PollsReducer.Allpolls !== undefined) {
      setvotePollUpdatedDetails({
        ...votePollUpdatedDetails,
        PollTitle: PollsReducer.Allpolls.poll.pollDetails.pollTitle,
      });
    }
  }, [PollsReducer.Allpolls]);
  console.log(votePollUpdatedDetails, "votePollUpdatedDetailsvotePollUp");

  const [votepollcheck, setVotepollcheck] = useState({
    checkedYes: false,
    checkedNo: false,
  });

  const HandleCheckNO = () => {
    setVotepollcheck({
      ...votepollcheck,
      checkedNo: !votepollcheck.checkedNo,
    });
  };

  const HandleCheckYes = () => {
    setVotepollcheck({
      ...votepollcheck,
      checkedYes: !votepollcheck.checkedYes,
    });
  };
  return (
    <Container>
      <Modal
        show={showVotePoll}
        setShow={setShowVotePoll}
        onHide={() => {
          setShowVotePoll(false);
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
                    setShowVotePoll(false);
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
                  <Col lg={12} md={12} sm={12} className={styles["Border_box"]}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        {votePollUpdatedDetails.pollTitle}
                        {/* <span className={styles["ViewTitleTOShowOnProgress"]}></span> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={1} md={1} sm={12}></Col>
                  <Col lg={11} md={11} sm={12} className="m-0 p-0">
                    <span className={styles["Yes_Vote_poll"]}>
                      {t("Yes")}
                      <span>(30)</span>
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
                    <Checkbox
                      checked={votepollcheck.checkedYes}
                      onChange={HandleCheckYes}
                      classNameCheckBoxP="d-none"
                    />
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
                  <Col lg={1} md={1} sm={12}></Col>
                  <Col lg={11} md={11} sm={12} className="m-0 p-0">
                    <span className={styles["Yes_Vote_poll"]}>
                      {t("No")}
                      <span>(20)</span>
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
                    <Checkbox
                      checked={votepollcheck.checkedNo}
                      onChange={HandleCheckNO}
                      classNameCheckBoxP="d-none"
                    />
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
                  <Col
                    lg={11}
                    sm={11}
                    md={12}
                    className="d-flex justify-content-start m-0 p-0 mt-2"
                  >
                    <span className={styles["Multiple_vote_poll"]}>
                      Mutiple Answer Allowed
                    </span>
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
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12} className="m-0 p-0 d-flex gap-2">
                    <Button
                      text={t("Close")}
                      className={styles["Close_Btn_votepoll"]}
                      onClick={() => {
                        setShowVotePoll(false);
                      }}
                    />
                    <Button
                      text={t("Submit")}
                      className={styles["Submit_btn_votepoll"]}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
      />
    </Container>
  );
};

export default Votepoll;
