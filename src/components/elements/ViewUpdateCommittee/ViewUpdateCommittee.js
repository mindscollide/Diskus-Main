import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import { Button } from "./../../../components/elements";
import { useTranslation } from "react-i18next";
import Committee from "../../../container/Committee/Committee";
import { useDispatch, useSelector } from "react-redux";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
const ViewUpdateCommittee = ({ setViewGroupPage }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [viewCommitteeClose, setViewCommitteeClose] = useState(true);
  const { CommitteeReducer } = useSelector((state) => state);
  const [committeeData, setCommitteeData] = useState({
    committeeTitle: "",
    committeeDescription: "",
    isTalkGroup: false,
    committeeType: "",
    committeeStatus: 0,
    committeeID: 0,
    committeeMembers: [],
  });
  const closebtn = async () => {
    setViewGroupPage(false);
  };
  useEffect(() => {
    if (
      CommitteeReducer.getCommitteeByCommitteeID !== null &&
      CommitteeReducer.getCommitteeByCommitteeID !== undefined
    ) {
      let committeedetails = CommitteeReducer.getCommitteeByCommitteeID;
      setCommitteeData({
        committeeTitle: committeedetails.committeeTitle,
        committeeDescription: committeedetails.committeeDescription,
        isTalkGroup: committeedetails.isTalkChatGroup,
        committeeType: committeedetails.committeeType.committeeTypeId,
        committeeStatus: committeedetails.committeeStatus.committeeStatusID,
        committeeID: 0,
        committeeMembers: committeedetails.committeMembers,
      });
    }
  }, [CommitteeReducer.getCommitteeByCommitteeID]);

  useEffect(() => {
    let UserID = JSON.parse(localStorage.getItem("userID"));
    dispatch(allAssignessList(parseInt(UserID), t));
  }, []);

  return (
    <>
      <Container className="MontserratSemiBold-600 color-5a5a5a">
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["View-Committee-heading"]}>
              {t("View-committee")}
            </span>
          </Col>
        </Row>

        <Paper className={styles["View-Committee-paper"]}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["View-Committee-Subheading"]}>
                {t("Details")}
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Management-Heading-View-Committee"]}>
                {committeeData?.committeeTitle}
              </span>
            </Col>
          </Row>
          <Row className="mt-1">
            <Col lg={12} md={12} sm={12}>
              <p className={styles["paragraph-content-View-Committee"]}>
                {committeeData?.committeeDescription}
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
                    {t("Executive-member")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                {committeeData?.committeeMembers
                  .filter(
                    (filterData, index) =>
                      filterData.committeeRole.committeeRoleID === 2
                  )
                  .map((data, index) => {
                    return (
                      <Col lg={4} md={4} sm={12}>
                        <Row>
                          <Col lg={2} md={2} sm={12}>
                            <img src={Newprofile} width={50} />
                          </Col>
                          <Col
                            lg={9}
                            md={9}
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
                                      {data?.userName}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={
                                        styles[
                                          "Designation-ViewCommittee-group"
                                        ]
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
                    );
                  })}
              </Row>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["members-ViewCommittee-group-page"]}>
                    {t("Regular-members")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-2">
                {committeeData?.committeeMembers
                  .filter(
                    (filterData, index) =>
                      filterData.committeeRole.committeeRoleID === 1
                  )
                  .map((data, index) => {
                    return (
                      <Col lg={4} md={4} sm={12}>
                        <Row>
                          <Col lg={2} md={2} sm={12}>
                            <img src={Newprofile} width={50} />
                          </Col>
                          <Col
                            lg={9}
                            md={9}
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
                                      {data?.userName}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={
                                        styles[
                                          "Designation-ViewCommittee-group"
                                        ]
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
                    );
                  })}
              </Row>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={10} md={10} sm={12}></Col>
            <Col lg={2} md={2} sm={12} className="d-flex justify-content-end">
              <Button
                className={styles["Close-ViewCommittee-btn"]}
                text={t("Close")}
                onClick={closebtn}
              />
            </Col>
          </Row>
        </Paper>
      </Container>
    </>
  );
};

export default ViewUpdateCommittee;
