import React, { useEffect, useState } from "react";
import styles from "./ViewPollsUnPublished.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../../../../../components/elements";
import moment from "moment";
import { EditmeetingDateFormat } from "../../../../../../commen/functions/date_formater";
const ViewPollsUnPublished = ({ setUnPublished }) => {
  const { t } = useTranslation();
  const { PollsReducer } = useSelector((state) => state);
  const [pollParticipants, setPollParticipants] = useState([]);
  const [pollsOption, setPollsOption] = useState([]);

  const [viewProgressPollsDetails, setViewProgressPollsDetails] = useState({
    PollID: 0,
    PollTitle: "",
    Date: "",
    AllowMultipleAnswers: false,
    answer: [],
  });

  const handleClosedButton = () => {
    setUnPublished(false);
  };
  useEffect(() => {
    try {
      if (
        PollsReducer.Allpolls !== null &&
        PollsReducer.Allpolls !== undefined
      ) {
        let pollData = PollsReducer.Allpolls.poll;
        let pollDetails = pollData.pollDetails;
        let pollOptions = pollData.pollOptions;
        let pollParticipants = pollData.pollParticipants;

        if (pollOptions.length > 0) {
          setPollsOption(pollOptions);
        }
        if (pollParticipants.length > 0) {
          setPollParticipants(pollParticipants);
        }
        if (Object.keys(pollDetails).length > 0) {
          setViewProgressPollsDetails({
            ...viewProgressPollsDetails,
            PollTitle: pollDetails.pollTitle,
            Date: pollDetails.dueDate,
            AllowMultipleAnswers: pollDetails.allowMultipleAnswers,
            PollID: pollDetails.pollID,
          });
        }
      }
    } catch {}
  }, [PollsReducer.Allpolls]);
  return (
    <section>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Heading_vewPolls_Published"]}>
                {viewProgressPollsDetails.PollTitle}
              </span>
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Scroller_View_Published_Polls"]}
            >
              <Row>
                {pollsOption.length > 0
                  ? pollsOption.map((data, index) => {
                      return (
                        <>
                          <Col lg={12} md={12} sm={12} className="mt-2">
                            <section className={styles["Options_messege"]}>
                              <Row className="mt-2">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["Messege_span_Class"]}
                                  >
                                    {data.answer}
                                  </span>
                                </Col>
                              </Row>
                            </section>
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Date_Heading"]}>
                    {t("Due-date")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Date_Fetched"]}>
                    {viewProgressPollsDetails.Date !== "" && (
                      <>
                        {moment(
                          EditmeetingDateFormat(viewProgressPollsDetails?.Date)
                        ).format("DD MMM YYYY")}
                      </>
                    )}
                  </span>
                </Col>
              </Row>
            </Col>
            {viewProgressPollsDetails.AllowMultipleAnswers === true ? (
              <Col
                lg={6}
                md={6}
                sm={6}
                className="d-flex justify-content-end align-items-center"
              >
                <span className={styles["Multiple_Answers_zstyles"]}>
                  {t("Multiple-answers-allowed")}
                </span>
              </Col>
            ) : (
              ""
            )}
          </Row>
        </Col>
        <Col lg={1} md={1} sm={1}></Col>
        <Col lg={5} md={5} sm={5}>
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Participants"]}>{"Participant"}</span>
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Scroller_View_Published_Polls"]}
            >
              <Row>
                {pollParticipants.length > 0
                  ? pollParticipants.map((data, index) => {
                      return (
                        <>
                          <Col lg={6} md={6} sm={6} className="mt-2">
                            <section className={styles["Partipants_box"]}>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex align-items-center gap-2"
                                >
                                  <img
                                    draggable={false}
                                    src={`data:image/jpeg;base64,${data?.profilePicture?.displayProfilePictureName}`}
                                    height="33px"
                                    alt=""
                                    width="33px"
                                    className={styles["Profile_Style"]}
                                  />
                                  <span className={styles["Participants_name"]}>
                                    {data.userName}
                                  </span>
                                </Col>
                              </Row>
                            </section>
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Row>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button
                text={t("Close")}
                className={styles["Close_button_View"]}
                onClick={handleClosedButton}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default ViewPollsUnPublished;
