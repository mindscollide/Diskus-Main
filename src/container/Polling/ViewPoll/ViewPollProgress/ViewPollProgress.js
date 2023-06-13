import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Modal, Button, Checkbox } from "../../../../components/elements";
import AlarmClock from "../../../../assets/images/AlarmOptions.svg";
import styles from "./ViewPollProgress.module.css";
import profile from "../../../../assets/images/profile_polls.svg";
import BlackCrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import { Progress } from "antd";
import { useTranslation } from "react-i18next";

const ViewPollProgress = ({
  showViewProgress,
  setShowViewProgress,
  percent,
}) => {
  const [viewpollMembers, setViewPollmembers] = useState([
    {
      id: 1,
      name: "Saad Fudda",
    },
    {
      id: 2,
      name: "Saif ul islam",
    },
    {
      id: 3,
      name: "Owais Wajid kha",
    },
    {
      id: 4,
      name: "Huzeifa Jahangir",
    },
    {
      id: 5,
      name: "Ali mamdani",
    },
    {
      id: 6,
      name: "Syed Ali raza",
    },
    {
      id: 7,
      name: "Talha Yameen khan",
    },
    {
      id: 8,
      name: "Aun Naqvi",
    },
    {
      id: 9,
      name: "Hussain Raza",
    },
    {
      id: 11,
      name: "jawad Faisal",
    },
    {
      id: 12,
      name: "Waseem",
    },
  ]);
  const [checkboxesState, setCheckboxesState] = useState({
    checkedYes: false,
    checkedNO: false,
  });

  const HandleCheckBoxYes = () => {
    setCheckboxesState({
      ...checkboxesState,
      checkedYes: !checkboxesState.checkedYes,
    });
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
        show={showViewProgress}
        setShow={setShowViewProgress}
        modalTitleClassName={styles["ModalHeader_View_poll_progress"]}
        modalHeaderClassName={
          styles["ModalRequestHeader_polling_View_modal_progress"]
        }
        modalFooterClassName={"d-block"}
        onHide={() => {
          setShowViewProgress(false);
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
                      {t("Due-date-on")} <span>34 May 2023</span>
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
                    setShowViewProgress(false);
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
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <span className={styles["ViewTitleTOShowOnProgress"]}>
                          Did you receive the material In a sufficient time for
                          you to prepare for the board meeting, Including agenda
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
                          Yes<span>(20)</span>
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
                    <Checkbox
                      checked={checkboxesState.checkedYes}
                      onChange={HandleCheckBoxYes}
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
                  <Col lg={11} md={11} sm={12} className="m-0 p-0">
                    <span className={styles["Yes_ViewProgress"]}>
                      NO <span>(9)</span>
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
                      checked={checkboxesState.checkedNO}
                      onChange={HandleCheckBoxNo}
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
                    <span>Mutiple Answer Allowed</span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12} className="d-flex m-0 p-0">
                    <span className={styles["Participants_Heading"]}>
                      {t("Participants")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-0">
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
                          <Col lg={6} md={6} sm={12} className="mt-2 ">
                            <Row className="m-0 p-0">
                              <Col lg={12} md={12} sm={12}>
                                <Row className={styles["Card_border2"]}>
                                  <Col sm={12} md={12} lg={12}>
                                    <img
                                      src={profile}
                                      width="33px"
                                      height="33px"
                                    />
                                    <span className={styles["Name_cards"]}>
                                      {data.name}
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
                        setShowViewProgress(false);
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
