import React, { useState } from "react";
import { Modal, Button, Checkbox } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./PollDetails.module.css";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { Col, Container, Row } from "react-bootstrap";
import profile from "../../../assets/images/profile_polls.svg";
import { Progress } from "antd";
const PollDetails = ({ showpollDetails, setShowpollDetails }) => {
  const [yesParticipants, setyesParticipants] = useState([
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
  ]);
  const [noParticipants, setNoParticipants] = useState([
    {
      id: 1,
      name: "Saad Fudda No",
    },
    {
      id: 2,
      name: "Saif ul islam No",
    },
    {
      id: 3,
      name: "Owais Wajid kha No",
    },
    {
      id: 4,
      name: "Huzeifa Jahangir No",
    },
    {
      id: 5,
      name: "Ali mamdani No",
    },
    {
      id: 6,
      name: "Syed Ali raza No",
    },
  ]);
  const { t } = useTranslation();
  return (
    <Container>
      <Modal
        show={showpollDetails}
        setShow={setShowpollDetails}
        onHide={() => {
          setShowpollDetails(false);
        }}
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={11} md={11} sm={12} className="m-0 p-0">
                  <span className={styles["Poll_details_Heading"]}>
                    {t("Poll-Details")}
                  </span>
                </Col>
                <Col lg={1} md={1} sm={12}>
                  <img
                    src={BlackCrossIcon}
                    width="16px"
                    height="16px"
                    onClick={() => {
                      setShowpollDetails(false);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
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
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12} className="m-0 p-0 d-flex gap-5">
                  <span className={styles["no-Of-Yes"]}>
                    9 - <span>{t("Yes")}</span>
                  </span>
                  <span className={styles["no-Of-No"]}>
                    2 - <span>{t("No")}</span>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12} className="m-0 p-0">
                  <Progress
                    percent={60}
                    className="pollsDetailsProgress"
                    status="active"
                  />
                </Col>
              </Row>
            </Container>
            <Row className="mt-2">
              <Col
                lg={12}
                sm={12}
                md={12}
                className={styles["border_bottom"]}
              ></Col>
            </Row>
            <Container>
              <Row className="">
                <Col lg={12} md={12} sm={12} className="mt-2 m-0 p-0">
                  <span className={styles["Participants_polls_Details"]}>
                    {t("Participants")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12} className="m-0 p-0 mt-2">
                  <span className={styles["Yes_voters"]}>{t("Yes")}</span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12} className={styles["Scroller-Yes"]}>
                  <Row>
                    {yesParticipants.map((data, index) => {
                      return (
                        <Col lg={6} md={6} sm={12} className="mt-2">
                          <Row className="m-0 p-0">
                            <Col lg={12} md={12} sm={12}>
                              <Row className={styles["Card_border2"]}>
                                <Col lg={12} md={12} sm={12}>
                                  <img
                                    src={profile}
                                    width="33px"
                                    height="33px"
                                    className={styles["Image"]}
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
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12} className="m-0 p-0">
                  <span className={styles["Yes_voters"]}>{t("No")}</span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12} className={styles["Scroller-Yes"]}>
                  <Row>
                    {noParticipants.map((data, index) => {
                      return (
                        <Col lg={6} md={6} sm={12} className="mt-2">
                          <Row className="m-0 p-0">
                            <Col lg={12} md={12} sm={12}>
                              <Row className={styles["Card_border2"]}>
                                <Col lg={12} md={12} sm={12}>
                                  <img
                                    src={profile}
                                    width="33px"
                                    height="33px"
                                    className={styles["Image"]}
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
            </Container>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end m-0 p-0"
              >
                <Button
                  text={t("Close")}
                  className={styles["Class_Close"]}
                  onClick={() => {
                    setShowpollDetails(false);
                  }}
                />
              </Col>
            </Row>
          </>
        }
        size={"md"}
      />
    </Container>
  );
};

export default PollDetails;
