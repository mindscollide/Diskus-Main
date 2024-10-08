import React from "react";
import styles from "./UpdateSecond.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { Modal, Button, MultiDatePicker } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import AlarmClock from "../../../assets/images/AlarmOptions.svg";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import gregorian_en from "react-date-object/locales/gregorian_en";
import gregorian from "react-date-object/calendars/gregorian";
import profile from "../../../assets/images/profile_polls.svg";
import { useState } from "react";

const UpdateSecond = ({
  showUpdateAfterPublished,
  setShowUpdateAfterPublished,
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
  const { t } = useTranslation();
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  return (
    <Container>
      <Modal
        show={showUpdateAfterPublished}
        setShow={setShowUpdateAfterPublished}
        modalTitleClassName={styles["ModalHeader_View_poll"]}
        modalHeaderClassName={styles["ModalRequestHeader_polling_View_modal"]}
        modalFooterClassName={"d-block"}
        onHide={() => {
          setShowUpdateAfterPublished(false);
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
                    className="d-flex justify-content-center gap-2 align-items-center"
                  >
                    <img
                      draggable="false"
                      alt=""
                      src={AlarmClock}
                      width="14.97px"
                      height="14.66px"
                    />
                    <span className={styles["Due_Date_viewPoll"]}>
                      {t("Due-date-on")} <span>34 May 2023</span>
                    </span>
                    <MultiDatePicker
                      name="MeetingDate"
                      check={true}
                      calendar={calendarValue}
                      locale={localValue}
                    />
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
                  alt=""
                  width="16px"
                  height="16px"
                  className={styles["View_cross_icon"]}
                  onClick={() => {
                    setShowUpdateAfterPublished(false);
                  }}
                />
              </Col>
            </Row>
            <Row className={styles["OverallPadding"]}>
              <Col lg={12} md={12} sm={12}>
                <Row>
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
                    <span className={styles["View_poll_heading"]}>
                      {t("Update-poll")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Box_ViewPoll_after_publish"]}
                  >
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["View_Title"]}>
                          Did you receive the material In a sufficient time for
                          you to prepare for the board meeting, Including agenda
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["BOx_for_yes"]}
                  >
                    <Row>
                      <Col
                        lg={12}
                        sm={12}
                        md={12}
                        className="d-flex align-items-center mt-2"
                      >
                        <span>{t("Yes")}</span>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["BOx_for_yes"]}
                  >
                    <Row>
                      <Col
                        lg={12}
                        sm={12}
                        md={12}
                        className="d-flex align-items-center mt-2"
                      >
                        <span>{t("No")}</span>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
                    <span className={styles["Multiple_viewModal"]}>
                      Multiple Answers Allowed
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
                                      draggable="false"
                                      alt=""
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
              <Col lg={12} md={12} sm={12} className={styles["OverallPadding"]}>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2 m-0 p-0"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["Close_btn_ViewPoll"]}
                      onClick={() => {
                        setShowUpdateAfterPublished(false);
                      }}
                    />
                    <Button
                      text={t("Update")}
                      className={styles["Update_btn_Published"]}
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

export default UpdateSecond;
