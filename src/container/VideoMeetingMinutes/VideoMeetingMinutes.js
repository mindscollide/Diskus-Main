import React, { useState } from "react";
import styles from "./VideoMeetingMinutes.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { TextField, Button } from "../../components/elements";
const VideoMeetingMinutes = () => {
  const { VideoChatReducer } = useSelector((state) => state);
  const [minutes, setMinutes] = useState("");
  return (
    <Container>
      <Row>
        <Col sm={12} md={12} lg={12} className={styles["videochatContainer"]}>
          <Row>
            <Col sm={12}>
              <h3 className={styles["videochat-mainHeading"]}>Routine Check</h3>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={7} md={7} lg={7} className="bg-white">
              <Row>
                <Col sm={12}>
                  <h5 className={styles["minutes-recording"]}>
                    Meeting Minutes
                  </h5>
                </Col>
                <Col className={styles["meetingmeetininmeeting"]}>
                  <Row className="mx-2">
                    <Col
                      sm={12}
                      className="border my-2 py-1 d-flex justify-content-start flex-column"
                    >
                      <Row>
                        <Col sm={1}>
                          <span className={styles["agendaIndex"]}>1</span>
                        </Col>
                        <Col sm={11} className="d-flex">
                          <p className={styles["minutesDescription"]}>
                            Dummy Test
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col sm={12}>
                  <Row>
                    <Col
                      sm={11}
                      md={11}
                      lg={11}
                      className={styles["minutes-input"]}
                    >
                      <TextField
                        placeholder={"Type as"}
                        width={"520"}
                        value={minutes}
                        change={(e) => setMinutes(e.target.value)}
                      />
                    </Col>
                    <Col sm={1} md={1} lg={1} className={styles["arrow-icon"]}>
                      <ChevronRight
                        width={25}
                        height={35}
                        color={"white"}
                        className={styles["arrow-style"]}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col sm={5} className="d-flex justify-content-end align-items-end">
              <Button text="End Meeting" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoMeetingMinutes;
