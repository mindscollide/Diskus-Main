import React, { useEffect, useState } from "react";
import { Modal, Button, Checkbox } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import styles from "./PollDetails.module.css";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { Col, Container, Row } from "react-bootstrap";
import profile from "../../../assets/images/profile_polls.svg";
import { Progress } from "antd";
import { style } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getPollsByPollIdApi,
  setviewpollProgressModal,
  viewVotesApi,
  viewVotesDetailsModal,
} from "../../../store/actions/Polls_actions";
const PollDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { PollsReducer } = useSelector((state) => state);
  const [yesParticipants, setyesParticipants] = useState([]);
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
  const [pollId, setPollId] = useState(0);
  let userID = localStorage.getItem("userID");

  useEffect(() => {
    let vieVotePollDetails = PollsReducer.viewVotes;
    console.log("handleClosed", vieVotePollDetails);

    if (vieVotePollDetails != undefined && vieVotePollDetails != null) {
      if (Object.keys(vieVotePollDetails).length > 0) {
        setPollId(vieVotePollDetails.pollDetails.pollID);
      }
    }
  }, [PollsReducer.viewVotes]);

  const handleClosed = async () => {
    let data = {
      PollID: pollId,
      UserID: parseInt(userID),
    };
    dispatch(getPollsByPollIdApi(navigate, data, 3, t));
    // await dispatch(setviewpollProgressModal(true));
  };
  return (
    <Container>
      <Modal
        show={PollsReducer.viewVotesDetails}
        setShow={dispatch(viewVotesDetailsModal)}
        onHide={() => {
          dispatch(viewVotesDetailsModal(false));
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
                  className={styles["Cross_Icon_poll_Details"]}
                  width="16px"
                  height="16px"
                  onClick={() => {
                    dispatch(viewVotesDetailsModal(false));
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OVerall_Padding"]}
              >
                <Row>
                  <Col lg={12} md={12} sm={12} className="m-0 p-0">
                    <span className={styles["Poll_details_Heading"]}>
                      {t("Poll-Details")}
                    </span>
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
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_Options"]}
                  >
                    <Row className="mt-3">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="m-0 p-0 d-flex gap-5"
                      >
                        <span className={styles["no-Of-Yes"]}>
                          Option 1 - 20%
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="m-0 p-0">
                        <Progress
                          percent={20}
                          className="pollsDetailsProgress"
                          status="active"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="m-0 p-0 d-flex gap-5"
                      >
                        <span className={styles["no-Of-Yes"]}>
                          Option 2 - 30%
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="m-0 p-0">
                        <Progress
                          percent={30}
                          className="pollsDetailsProgress"
                          status="active"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="m-0 p-0 d-flex gap-5"
                      >
                        <span className={styles["no-Of-Yes"]}>
                          Option 3 - 10%
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="m-0 p-0">
                        <Progress
                          percent={10}
                          className="pollsDetailsProgress"
                          status="active"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="m-0 p-0 d-flex gap-5"
                      >
                        <span className={styles["no-Of-Yes"]}>
                          Option 4 - 20%
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="m-0 p-0">
                        <Progress
                          percent={20}
                          className="pollsDetailsProgress"
                          status="active"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="m-0 p-0 d-flex gap-5"
                      >
                        <span className={styles["no-Of-Yes"]}>
                          Option 5 - 20%
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="m-0 p-0">
                        <Progress
                          percent={20}
                          className="pollsDetailsProgress"
                          status="active"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12} className="mt-2 m-0 p-0">
                    <span className={styles["Participants_polls_Details"]}>
                      {t("Participants")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_participants"]}
                  >
                    <Row>
                      <Col lg={12} md={12} sm={12} className="m-0 p-0 mt-2">
                        <span className={styles["Yes_voters"]}>{t("Yes")}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <Row>
                          {yesParticipants.map((data, index) => {
                            console.log(data, "datadatadatadata");
                            return (
                              <Col lg={6} md={6} sm={12} className="mt-2">
                                <Row>
                                  <Col
                                    lg={11}
                                    md={11}
                                    sm={12}
                                    className="m-0 p-0"
                                  >
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
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12} className="m-0 p-0">
                        <span className={styles["Yes_voters"]}>{t("No")}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <Row>
                          {noParticipants.map((data, index) => {
                            return (
                              <Col lg={6} md={6} sm={12} className="mt-2">
                                <Row>
                                  <Col
                                    lg={11}
                                    md={11}
                                    sm={12}
                                    className="m-0 p-0"
                                  >
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
                className={styles["OVerall_Padding"]}
              >
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end  m-0 p-0"
                  >
                    <Button
                      text={t("Close")}
                      className={styles["Class_Close"]}
                      onClick={() => handleClosed()}
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

export default PollDetails;
