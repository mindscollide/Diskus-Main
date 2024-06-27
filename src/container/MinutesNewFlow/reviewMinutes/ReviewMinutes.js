import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Importing translation hook
import styles from "./ReviewMinutes.module.css"; // Importing CSS module
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import { Paper, Button } from "../../../components/elements";
import {
  reviewMinutesPage,
  pendingApprovalPage,
  rejectCommentModal,
  editCommentModal,
  deleteCommentModal,
  currentMeetingMinutesToReview,
} from "../../../store/actions/Minutes_action";
import DefaultAvatar from "./../Images/avatar.png";
import RejectCommentModal from "./rejectCommentModal/RejectCommentModal";
import EditCommentModal from "./editCommentModal/EditCommentModal";
import DeleteCommentModal from "./deleteCommentModal/DeleteCommentModal";
import { GetMinutesForReviewerByMeetingId } from "../../../store/actions/Minutes_action";
import {
  convertDateToGMTMinute,
  convertToGMTMinuteTime,
} from "../../../commen/functions/time_formatter";

// Functional component for pending approvals section
const ReviewMinutes = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  const { MinutesReducer } = useSelector((state) => state);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [reviewWrapperScroll, setReviewWrapperScroll] = useState(false);

  const [minutesAgenda, setMinutesAgenda] = useState([]);
  const [minutesAgendaHierarchy, setMinutesAgendaHierarchy] = useState([]);
  const [minutesGeneral, setMinutesGeneral] = useState([]);
  const [minutesToReview, setMinutesToReview] = useState(0);

  const divRef = useRef(null);

  const countActorBundleStatusID2 = (data) => {
    let count = 0;
    // Traverse generalMinutes
    if (data.generalMinutes) {
      data.generalMinutes.forEach((minute) => {
        if (minute.actorBundleStatusID === 2) {
          count++;
        }
      });
    }
    // Traverse agendaMinutes
    if (data.agendaMinutes) {
      data.agendaMinutes.forEach((minute) => {
        if (minute.actorBundleStatusID === 2) {
          count++;
        }
        // Check version history in agendaMinutes
        if (minute.agendaMinutesVersionHistory) {
          minute.agendaMinutesVersionHistory.forEach((history) => {
            if (history.actorBundleStatusID === 2) {
              count++;
            }
          });
        }
      });
    }
    return count;
  };

  useEffect(() => {
    const div = divRef.current;

    if (div.scrollHeight > div.clientHeight) {
      console.log("Div has scroll");
      setReviewWrapperScroll(true);
    } else {
      console.log("Div doesn't have scroll");
      setReviewWrapperScroll(false);
    }
  }, []); // This effect runs once after the component mounts

  useEffect(() => {
    let Data = {
      MeetingID: MinutesReducer?.currentMeetingMinutesToReviewData?.meetingID,
    };
    dispatch(GetMinutesForReviewerByMeetingId(Data, navigate, t));
    // return () => {
    //   dispatch(currentMeetingMinutesToReview(null));
    // };
  }, []);

  useEffect(() => {
    try {
      if (
        MinutesReducer.GetMinutesForReviewerByMeetingIdData !== null &&
        MinutesReducer.GetMinutesForReviewerByMeetingIdData !== undefined &&
        MinutesReducer.GetMinutesForReviewerByMeetingIdData.length !== 0
      ) {
        let reducerData = MinutesReducer.GetMinutesForReviewerByMeetingIdData;
        setMinutesAgenda(reducerData.agendaMinutes);
        setMinutesAgendaHierarchy(reducerData.agendaHierarchyList);
        setMinutesGeneral(reducerData.generalMinutes);
        setMinutesToReview(countActorBundleStatusID2(reducerData));
      } else {
        setMinutesAgenda([]);
        setMinutesAgendaHierarchy([]);
        setMinutesGeneral([]);
        setMinutesToReview([]);
      }
    } catch {}
  }, [MinutesReducer.GetMinutesForReviewerByMeetingIdData]);

  console.log("MinutesReducerMinutesReducer", MinutesReducer);

  return (
    <section className={styles["pendingApprovalContainer"]}>
      {/* Container for pending approval section */}
      <Row className="my-3 d-flex align-items-center">
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {MinutesReducer.currentMeetingMinutesToReviewData.title}
          </span>
        </Col>
      </Row>
      <Paper className={styles["pendingApprovalPaper"]}>
        {/* Paper component for styling */}
        <div className={styles["main-wrapper"]}>
          <Row className="py-3 mx-50">
            <Col sm={12} md={6} lg={6}>
              <span className={styles["pendingApprovalHeading"]}>
                {t("Review Minutes")}
              </span>
            </Col>
            <Col
              sm={12}
              md={6}
              lg={6}
              className="justify-content-end d-flex align-items-center"
            >
              <span className={styles["No-of-reviews"]}>
                {t("Remaining-minutes-to-review") + minutesToReview}
              </span>
              <Button text={t("Accept All")} className={styles["Accept-all"]} />
            </Col>
          </Row>
          <div
            className={
              reviewWrapperScroll
                ? styles["review-minutes-wrapper-scroll"]
                : styles["review-minutes-wrapper"]
            }
            ref={divRef}
          >
            {/* CONTENT */}

            {minutesAgenda.map((data, index) => {
              console.log("minutesAgenda", data);
              return (
                <>
                  <Row className="mx-50">
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        {data.agendaTitle}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      {data.agendaMinutesVersionHistory.length === 0 ? null : (
                        <div
                          className={
                            styles["version-control-wrapper-with-more"]
                          }
                        >
                          <span className={styles["with-text"]}>
                            {data.versionNumber}.0
                          </span>
                        </div>
                      )}
                      <div
                        className={
                          data.actorBundleStatusID === 3
                            ? styles["uploaded-details-accepted"]
                            : data.actorBundleStatusID === 4
                            ? styles["uploaded-details-rejected"]
                            : styles["uploaded-details"]
                        }
                      >
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: data.minutesDetails,
                              }}
                              className={styles["minutes-text"]}
                            ></p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
                                <span className={styles["bar-line"]}></span>
                                <p className={styles["uploadedbyuser"]}>
                                  {t("Uploaded-by")}
                                </p>
                                <div className={styles["gap-ti"]}>
                                  <img
                                    src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                    className={styles["Image"]}
                                    alt=""
                                    draggable={false}
                                  />
                                  <p className={styles["agendaCreater"]}>
                                    {data.userName}
                                  </p>
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className="d-grid justify-content-end p-0"
                              >
                                {data.actorBundleStatusID === 3 ? (
                                  <Button
                                    text={t("Accepted")}
                                    className={styles["Accepted-comment"]}
                                    disableBtn={true}
                                  />
                                ) : data.actorBundleStatusID === 2 ? (
                                  <Button
                                    text={t("Accept")}
                                    className={styles["Accept-comment"]}
                                  />
                                ) : data.actorBundleStatusID === 4 ? (
                                  <Button
                                    text={t("Accept")}
                                    className={styles["Reject-comment"]}
                                  />
                                ) : null}

                                {data.actorBundleStatusID === 3 ? (
                                  <Button
                                    text={t("Reject")}
                                    className={styles["Reject-comment"]}
                                    disableBtn={true}
                                  />
                                ) : data.actorBundleStatusID === 2 ? (
                                  <Button
                                    text={t("Reject")}
                                    className={styles["Reject-comment"]}
                                    onClick={() =>
                                      dispatch(rejectCommentModal(true))
                                    }
                                  />
                                ) : data.actorBundleStatusID === 4 ? (
                                  <>
                                    <Button
                                      text={t("Rejected")}
                                      className={styles["Rejected-comment"]}
                                    />

                                    <Button
                                      text={t("Hide-comment")}
                                      className={styles["Reject-comment"]}
                                      onClick={() =>
                                        dispatch(rejectCommentModal(true))
                                      }
                                    />
                                  </>
                                ) : null}
                              </Col>
                            </Row>

                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p className={styles["time-uploader"]}>
                                  {convertToGMTMinuteTime(data.lastUpdatedTime)}
                                  ,
                                </p>
                                <p className={styles["date-uploader"]}>
                                  {convertDateToGMTMinute(data.lastUpdatedDate)}
                                </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  {data.agendaMinutesVersionHistory
                    .slice()
                    .reverse()
                    .map((historyData, index) => {
                      return (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="position-relative"
                            >
                              {historyData.declinedReviews.length === 0 ? (
                                <div
                                  className={
                                    index === 0
                                      ? styles[
                                          "version-control-wrapper-with-more"
                                        ]
                                      : styles[
                                          "version-control-wrapper-with-more-last"
                                        ]
                                  }
                                >
                                  <span className={styles["with-text"]}>
                                    {historyData.versionNumber}.0
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className={
                                    index === 0
                                      ? styles["version-control-wrapper"]
                                      : styles["version-control-wrapper-last"]
                                  }
                                ></div>
                              )}
                              <div
                                className={
                                  historyData.actorBundleStatusID === 3
                                    ? styles["uploaded-details-accepted"]
                                    : historyData.actorBundleStatusID === 4 &&
                                      historyData.declinedReviews.length === 0
                                    ? styles["uploaded-details-rejected"]
                                    : styles["uploaded-details"]
                                }
                              >
                                <Row className={styles["inherit-height"]}>
                                  <Col lg={8} md={8} sm={12}>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: historyData.minutesDetails,
                                      }}
                                      className={styles["minutes-text"]}
                                    ></p>
                                  </Col>
                                  <Col
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <Row className="m-0">
                                      <Col
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        className="p-0"
                                      >
                                        <span
                                          className={styles["bar-line"]}
                                        ></span>
                                        <p className={styles["uploadedbyuser"]}>
                                          {historyData.declinedReviews
                                            .length === 0
                                            ? t("Uploaded-by")
                                            : t("Reviewed-by")}
                                        </p>
                                        <div className={styles["gap-ti"]}>
                                          <img
                                            src={`data:image/jpeg;base64,${minutesAgenda[0].userProfilePicture.displayProfilePictureName}`}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <p
                                            className={styles["agendaCreater"]}
                                          >
                                            {minutesAgenda[0].userName}
                                          </p>
                                        </div>
                                      </Col>
                                      {historyData.declinedReviews.length ===
                                      0 ? (
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={12}
                                          className="d-grid justify-content-end p-0"
                                        >
                                          {historyData.actorBundleStatusID ===
                                          3 ? (
                                            <Button
                                              text={t("Accepted")}
                                              className={
                                                styles["Accepted-comment"]
                                              }
                                              disableBtn={true}
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            2 ? (
                                            <Button
                                              text={t("Accept")}
                                              className={
                                                styles["Accept-comment"]
                                              }
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            4 ? (
                                            <Button
                                              text={t("Accept")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                            />
                                          ) : null}

                                          {historyData.actorBundleStatusID ===
                                          3 ? (
                                            <Button
                                              text={t("Reject")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                              disableBtn={true}
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            2 ? (
                                            <Button
                                              text={t("Reject")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                              onClick={() =>
                                                dispatch(
                                                  rejectCommentModal(true)
                                                )
                                              }
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            4 ? (
                                            <>
                                              <Button
                                                text={t("Rejected")}
                                                className={
                                                  styles["Rejected-comment"]
                                                }
                                              />

                                              <Button
                                                text={t("Hide-comment")}
                                                className={
                                                  styles["Reject-comment"]
                                                }
                                                onClick={() =>
                                                  dispatch(
                                                    rejectCommentModal(true)
                                                  )
                                                }
                                              />
                                            </>
                                          ) : null}
                                        </Col>
                                      ) : (
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={12}
                                          className="d-grid justify-content-end p-0"
                                        >
                                          <Button
                                            onClick={() =>
                                              dispatch(editCommentModal(true))
                                            }
                                            text={t("Edit")}
                                            className={styles["Reject-comment"]}
                                          />
                                          <Button
                                            onClick={() =>
                                              dispatch(deleteCommentModal(true))
                                            }
                                            text={t("Delete")}
                                            className={styles["Reject-comment"]}
                                          />
                                        </Col>
                                      )}
                                    </Row>

                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <p className={styles["time-uploader"]}>
                                          {convertToGMTMinuteTime(
                                            historyData.lastUpdatedTime
                                          )}
                                          ,
                                        </p>
                                        <p className={styles["date-uploader"]}>
                                          {convertDateToGMTMinute(
                                            historyData.lastUpdatedDate
                                          )}
                                        </p>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                </>
              );
            })}

            {minutesGeneral.map((data, index) => {
              console.log("minutesGeneral", data);
              return (
                <>
                  <Row className="mx-50">
                    <Col lg={12} md={12} sm={12}>
                      <p className={styles["Parent-title-heading"]}>
                        {index + 1 + ". " + t("General-minutes")}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      {data.generalMinutesVersionHistory.length === 0 ? null : (
                        <div
                          className={
                            styles["version-control-wrapper-with-more"]
                          }
                        >
                          <span className={styles["with-text"]}>
                            {data.versionNumber}.0
                          </span>
                        </div>
                      )}
                      <div
                        className={
                          data.actorBundleStatusID === 3
                            ? styles["uploaded-details-accepted"]
                            : data.actorBundleStatusID === 4
                            ? styles["uploaded-details-rejected"]
                            : styles["uploaded-details"]
                        }
                      >
                        <Row className={styles["inherit-height"]}>
                          <Col lg={8} md={8} sm={12}>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: data.minutesDetails,
                              }}
                              className={styles["minutes-text"]}
                            ></p>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={6} md={6} sm={12} className="p-0">
                                <span className={styles["bar-line"]}></span>
                                <p className={styles["uploadedbyuser"]}>
                                  {t("Uploaded-by")}
                                </p>
                                <div className={styles["gap-ti"]}>
                                  <img
                                    src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                    className={styles["Image"]}
                                    alt=""
                                    draggable={false}
                                  />
                                  <p className={styles["agendaCreater"]}>
                                    {data.userName}
                                  </p>
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={12}
                                className="d-grid justify-content-end p-0"
                              >
                                {data.actorBundleStatusID === 3 ? (
                                  <Button
                                    text={t("Accepted")}
                                    className={styles["Accepted-comment"]}
                                    disableBtn={true}
                                  />
                                ) : data.actorBundleStatusID === 2 ? (
                                  <Button
                                    text={t("Accept")}
                                    className={styles["Accept-comment"]}
                                  />
                                ) : data.actorBundleStatusID === 4 ? (
                                  <Button
                                    text={t("Accept")}
                                    className={styles["Reject-comment"]}
                                  />
                                ) : null}

                                {data.actorBundleStatusID === 3 ? (
                                  <Button
                                    text={t("Reject")}
                                    className={styles["Reject-comment"]}
                                    disableBtn={true}
                                  />
                                ) : data.actorBundleStatusID === 2 ? (
                                  <Button
                                    text={t("Reject")}
                                    className={styles["Reject-comment"]}
                                    onClick={() =>
                                      dispatch(rejectCommentModal(true))
                                    }
                                  />
                                ) : data.actorBundleStatusID === 4 ? (
                                  <>
                                    <Button
                                      text={t("Rejected")}
                                      className={styles["Rejected-comment"]}
                                    />

                                    <Button
                                      text={t("Hide-comment")}
                                      className={styles["Reject-comment"]}
                                      onClick={() =>
                                        dispatch(rejectCommentModal(true))
                                      }
                                    />
                                  </>
                                ) : null}
                              </Col>
                            </Row>

                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <p className={styles["time-uploader"]}>
                                  {convertToGMTMinuteTime(data.lastUpdatedTime)}
                                  ,
                                </p>
                                <p className={styles["date-uploader"]}>
                                  {convertDateToGMTMinute(data.lastUpdatedDate)}
                                </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  {data.generalMinutesVersionHistory
                    .slice()
                    .reverse()
                    .map((historyData, index) => {
                      return (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="position-relative"
                            >
                              {historyData.declinedReviews.length === 0 ? (
                                <div
                                  className={
                                    index === 0
                                      ? styles[
                                          "version-control-wrapper-with-more"
                                        ]
                                      : styles[
                                          "version-control-wrapper-with-more-last"
                                        ]
                                  }
                                >
                                  <span className={styles["with-text"]}>
                                    {historyData.versionNumber}.0
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className={
                                    index === 0
                                      ? styles["version-control-wrapper"]
                                      : styles["version-control-wrapper-last"]
                                  }
                                ></div>
                              )}
                              <div
                                className={
                                  historyData.actorBundleStatusID === 3
                                    ? styles["uploaded-details-accepted"]
                                    : historyData.actorBundleStatusID === 4 &&
                                      historyData.declinedReviews.length === 0
                                    ? styles["uploaded-details-rejected"]
                                    : styles["uploaded-details"]
                                }
                              >
                                <Row className={styles["inherit-height"]}>
                                  <Col lg={8} md={8} sm={12}>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: historyData.minutesDetails,
                                      }}
                                      className={styles["minutes-text"]}
                                    ></p>
                                  </Col>
                                  <Col
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <Row className="m-0">
                                      <Col
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        className="p-0"
                                      >
                                        <span
                                          className={styles["bar-line"]}
                                        ></span>
                                        <p className={styles["uploadedbyuser"]}>
                                          {historyData.declinedReviews
                                            .length === 0
                                            ? t("Uploaded-by")
                                            : t("Reviewed-by")}
                                        </p>
                                        <div className={styles["gap-ti"]}>
                                          <img
                                            src={`data:image/jpeg;base64,${minutesAgenda[0].userProfilePicture.displayProfilePictureName}`}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <p
                                            className={styles["agendaCreater"]}
                                          >
                                            {minutesAgenda[0].userName}
                                          </p>
                                        </div>
                                      </Col>
                                      {historyData.declinedReviews.length ===
                                      0 ? (
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={12}
                                          className="d-grid justify-content-end p-0"
                                        >
                                          {historyData.actorBundleStatusID ===
                                          3 ? (
                                            <Button
                                              text={t("Accepted")}
                                              className={
                                                styles["Accepted-comment"]
                                              }
                                              disableBtn={true}
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            2 ? (
                                            <Button
                                              text={t("Accept")}
                                              className={
                                                styles["Accept-comment"]
                                              }
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            4 ? (
                                            <Button
                                              text={t("Accept")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                            />
                                          ) : null}

                                          {historyData.actorBundleStatusID ===
                                          3 ? (
                                            <Button
                                              text={t("Reject")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                              disableBtn={true}
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            2 ? (
                                            <Button
                                              text={t("Reject")}
                                              className={
                                                styles["Reject-comment"]
                                              }
                                              onClick={() =>
                                                dispatch(
                                                  rejectCommentModal(true)
                                                )
                                              }
                                            />
                                          ) : historyData.actorBundleStatusID ===
                                            4 ? (
                                            <>
                                              <Button
                                                text={t("Rejected")}
                                                className={
                                                  styles["Rejected-comment"]
                                                }
                                              />

                                              <Button
                                                text={t("Hide-comment")}
                                                className={
                                                  styles["Reject-comment"]
                                                }
                                                onClick={() =>
                                                  dispatch(
                                                    rejectCommentModal(true)
                                                  )
                                                }
                                              />
                                            </>
                                          ) : null}
                                        </Col>
                                      ) : (
                                        <Col
                                          lg={6}
                                          md={6}
                                          sm={12}
                                          className="d-grid justify-content-end p-0"
                                        >
                                          <Button
                                            onClick={() =>
                                              dispatch(editCommentModal(true))
                                            }
                                            text={t("Edit")}
                                            className={styles["Reject-comment"]}
                                          />
                                          <Button
                                            onClick={() =>
                                              dispatch(deleteCommentModal(true))
                                            }
                                            text={t("Delete")}
                                            className={styles["Reject-comment"]}
                                          />
                                        </Col>
                                      )}
                                    </Row>

                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <p className={styles["time-uploader"]}>
                                          {convertToGMTMinuteTime(
                                            historyData.lastUpdatedTime
                                          )}
                                          ,
                                        </p>
                                        <p className={styles["date-uploader"]}>
                                          {convertDateToGMTMinute(
                                            historyData.lastUpdatedDate
                                          )}
                                        </p>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                </>
              );
            })}
          </div>

          <Row className="mx-50">
            <Col
              lg={12}
              md={12}
              sm={12}
              className={currentLanguage === "ar" ? "text-start" : "text-end"}
            >
              <Button
                onClick={() => {
                  dispatch(reviewMinutesPage(false));
                  dispatch(pendingApprovalPage(true));
                }}
                text={t("Cancel")}
                className={styles["Cancel"]}
              />
              <Button
                text={t("Submit-review")}
                className={styles["Submit-review"]}
              />
            </Col>
          </Row>
        </div>
      </Paper>
      {MinutesReducer.rejectCommentModal ? <RejectCommentModal /> : null}
      {MinutesReducer.editCommentModal ? <EditCommentModal /> : null}
      {MinutesReducer.deleteCommentModal ? <DeleteCommentModal /> : null}
    </section>
  );
};

export default ReviewMinutes; // Exporting pending approval component
