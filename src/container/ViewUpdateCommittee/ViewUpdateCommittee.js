import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import { Button } from "./../../../components/elements";
import { useState } from "react";
import Committee from "../../../container/Committee/Committee";
const ViewUpdateCommittee = () => {
  const [viewCommitteeClose, setViewCommitteeClose] = useState(true);

  const closebtn = async () => {
    setViewCommitteeClose(false);
  };
  return (
    <>
      {viewCommitteeClose ? (
        <>
          <Container className=" color-5a5a5a">
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["View-Committee-heading"]}>
                  View Committee
                </span>
              </Col>
            </Row>

            <Paper className={styles["View-Committee-paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["View-Committee-Subheading"]}>
                    Details
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Management-Heading-View-Committee"]}>
                    Management group for Discussion
                  </span>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col lg={12} md={12} sm={12}>
                  <p className={styles["paragraph-content-View-Committee"]}>
                    f type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged. It
                    was popularised in the 1960s with the release of Letraset
                    sheets containing
                  </p>
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["scroll-bar-ViewGroup"]}
                >
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["View-Committee-Head-Heading"]}>
                        Executive Memeber
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <Row>
                        <Col lg={1} md={1} sm={12}>
                          <img
                            src={Newprofile}
                            width={50}
                            draggable="false"
                            alt=""
                          />
                        </Col>
                        <Col
                          lg={11}
                          md={12}
                          sm={12}
                          className={styles["ViewCommittee-head-info"]}
                        >
                          <Row>
                            <Col lg={12} md={12} sm={12} className="mt-1">
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles["name-ViewCommittee-group"]
                                    }
                                  >
                                    Waleed Jabbar
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles["Designation-ViewCommittee-group"]
                                    }
                                  >
                                    Designer
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles["email-ViewCommittee-group"]
                                    }
                                  >
                                    <a>Waleed@gmail.com</a>
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <span
                        className={styles["members-ViewCommittee-group-page"]}
                      >
                        Regular Memebers
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={4} md={4} sm={4}>
                      <Row>
                        <Col lg={3} md={3} sm={12}>
                          <img
                            src={Newprofile}
                            width={50}
                            draggable="false"
                            alt=""
                          />
                        </Col>
                        <Col
                          lg={9}
                          md={9}
                          sm={12}
                          className={styles["ViewCommittee-head-info"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["name-ViewCommittee-group"]}
                              >
                                Waleed Jabbar
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Designation-ViewCommittee-group"]
                                }
                              >
                                Designer
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["email-ViewCommittee-group"]}
                              >
                                <a>Waleed@gmail.com</a>
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4} md={4} sm={4}>
                      <Row>
                        <Col lg={3} md={3} sm={12}>
                          <img
                            src={Newprofile}
                            width={50}
                            draggable="false"
                            alt=""
                          />
                        </Col>
                        <Col
                          lg={9}
                          md={9}
                          sm={12}
                          className={styles["ViewCommittee-head-info"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["name-ViewCommittee-group"]}
                              >
                                Waleed Jabbar
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Designation-ViewCommittee-group"]
                                }
                              >
                                Designer
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["email-ViewCommittee-group"]}
                              >
                                <a>Waleed@gmail.com</a>
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4} md={4} sm={4}>
                      <Row>
                        <Col lg={3} md={3} sm={12}>
                          <img
                            src={Newprofile}
                            width={50}
                            draggable="false"
                            alt=""
                          />
                        </Col>
                        <Col
                          lg={9}
                          md={9}
                          sm={12}
                          className={styles["ViewCommittee-head-info"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["name-ViewCommittee-group"]}
                              >
                                Waleed Jabbar
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Designation-ViewCommittee-group"]
                                }
                              >
                                Designer
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["email-ViewCommittee-group"]}
                              >
                                <a>Waleed@gmail.com</a>
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={4} md={4} sm={4}>
                      <Row>
                        <Col lg={3} md={3} sm={12}>
                          <img
                            src={Newprofile}
                            width={50}
                            draggable="false"
                            alt=""
                          />
                        </Col>
                        <Col
                          lg={9}
                          md={9}
                          sm={12}
                          className={styles["ViewCommittee-head-info"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["name-ViewCommittee-group"]}
                              >
                                Waleed Jabbar
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Designation-ViewCommittee-group"]
                                }
                              >
                                Designer
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["email-ViewCommittee-group"]}
                              >
                                <a>Waleed@gmail.com</a>
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4} md={4} sm={4}>
                      <Row>
                        <Col lg={3} md={3} sm={12}>
                          <img
                            src={Newprofile}
                            width={50}
                            draggable="false"
                            alt=""
                          />
                        </Col>
                        <Col
                          lg={9}
                          md={9}
                          sm={12}
                          className={styles["ViewCommittee-head-info"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["name-ViewCommittee-group"]}
                              >
                                Waleed Jabbar
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Designation-ViewCommittee-group"]
                                }
                              >
                                Designer
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["email-ViewCommittee-group"]}
                              >
                                <a>Waleed@gmail.com</a>
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4} md={4} sm={4}>
                      <Row>
                        <Col lg={3} md={3} sm={12}>
                          <img
                            src={Newprofile}
                            width={50}
                            draggable="false"
                            alt=""
                          />
                        </Col>
                        <Col
                          lg={9}
                          md={9}
                          sm={12}
                          className={styles["ViewCommittee-head-info"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["name-ViewCommittee-group"]}
                              >
                                Waleed Jabbar
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Designation-ViewCommittee-group"]
                                }
                              >
                                Designer
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["email-ViewCommittee-group"]}
                              >
                                <a>Waleed@gmail.com</a>
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={10} md={10} sm={12}></Col>
                <Col
                  lg={2}
                  md={2}
                  sm={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    className={styles["Close-ViewCommittee-btn"]}
                    text="Close"
                    onClick={closebtn}
                  />
                </Col>
              </Row>
            </Paper>
          </Container>
        </>
      ) : (
        <Committee />
      )}
    </>
  );
};

export default ViewUpdateCommittee;
