import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Importing translation hook
import {
  utcConvertintoGMT,
  newDateFormatterForMinutesPendingApproval,
} from "../../../commen/functions/date_formater";
import styles from "./PendingApprovals.module.css"; // Importing CSS module
import {
  pendingApprovalPage,
  reviewMinutesPage,
  GetMinuteReviewPendingApprovalsStatsByReviewerId,
  GetMinuteReviewPendingApprovalsByReviewerId,
  currentMeetingMinutesToReview,
} from "../../../store/actions/Minutes_action"; // Importing Page Change State
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import { Button, Paper, TableToDo } from "../../../components/elements"; // Importing custom components
import { ChevronDown } from "react-bootstrap-icons"; //Bootstrap Icon
import DescendIcon from "./../Images/SorterIconDescend.png";
import AscendIcon from "./../Images/SorterIconAscend.png";
import ArrowDownIcon from "./../Images/Arrow-down.png";
import ArrowUpIcon from "./../Images/Arrow-up.png";
import NoApprovals from "./../Images/No-Approvals.png";
import ReviewSignature from "../../DataRoom/SignatureApproval/ReviewAndSign/ReviewSignature";
import {
  getAllPendingApprovalStatusApi,
  getAllPendingApprovalsStatsApi,
} from "../../../store/actions/workflow_actions";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import ProgressStats from "../../../components/elements/progressStats/ProgressStats";

// Functional component for pending approvals section
const PendingApproval = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  const { MinutesReducer } = useSelector((state) => state);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  // State for tracking the active state of each button
  const [reviewMinutesActive, setReviewMinutesActive] = useState(true); // Default Review Minutes button to active
  const [reviewAndSignActive, setReviewAndSignActive] = useState(false);
  const [progress, setProgress] = useState([]);
  const [sortOrderMeetingTitle, setSortOrderMeetingTitle] = useState(null);
  const [sortOrderReviewRequest, setSortOrderReviewRequest] = useState(null);
  const [sortOrderLeaveDateTime, setSortOrderLeaveDateTime] = useState(null);
  const [rowsPendingApproval, setRowsPendingApproval] = useState([]);

  // Click handler for Review Minutes button
  const handleReviewMinutesClick = async () => {
    let Data = { sRow: 0, Length: 10 };
    await dispatch(
      GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t)
    );
    await dispatch(
      GetMinuteReviewPendingApprovalsByReviewerId(Data, navigate, t)
    );
    setReviewMinutesActive(true); // Set Review Minutes button to active
    setReviewAndSignActive(false); // Set Review & Sign button to inactive
    // Your functionality for Review Minutes button
  };

  // Click handler for Review & Sign button
  const handleReviewAndSignClick = async () => {
    await dispatch(getAllPendingApprovalsStatsApi(navigate, t));
    let newData = { IsCreator: false };
    await dispatch(getAllPendingApprovalStatusApi(navigate, t, newData, 1));
    // let Data = { sRow: 0, Length: 10 };
    // await dispatch(getAllPendingApprovalsSignaturesApi(navigate, t, Data));

    setReviewMinutesActive(false); // Set Review Minutes button to inactive
    setReviewAndSignActive(true); // Set Review & Sign button to active
    // Your functionality for Review & Sign button
  };

  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      title: (
        <>
          <span>
            {t("Meeting-title")}{" "}
            {sortOrderMeetingTitle === "descend" ? (
              <img src={DescendIcon} alt="" />
            ) : (
              <img src={AscendIcon} alt="" />
            )}
          </span>
        </>
      ),
      dataIndex: "title",
      key: "title",
      className: "nameParticipant",
      width: "200px",
      ellipsis: true,
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      sortOrderMeetingTitle,
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderMeetingTitle((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p
          onClick={() => {
            if (record.status !== "Expired") {
              dispatch(reviewMinutesPage(true));
              dispatch(pendingApprovalPage(false));
              dispatch(currentMeetingMinutesToReview(record));
            }
          }}
          className={
            record.status === "Expired"
              ? "cursor-pointer opacity-25 m-0 text-truncate"
              : "cursor-pointer m-0 text-truncate"
          }
        >
          {text}
        </p>
      ),
    },
    {
      title: (
        <>
          <span>
            {t("Review-requested-by")}{" "}
            {sortOrderReviewRequest === "descend" ? (
              <img src={DescendIcon} alt="" />
            ) : (
              <img src={AscendIcon} alt="" />
            )}
          </span>
        </>
      ),
      dataIndex: "requestedBy",
      key: "requestedBy",
      className: "emailParticipant",
      width: "180px",
      ellipsis: true,
      sorter: (a, b) =>
        a.requestedBy.toLowerCase().localeCompare(b.requestedBy.toLowerCase()),
      sortOrderReviewRequest,
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderReviewRequest((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p className={record.status === "Expired" ? "opacity-25 m-0" : "m-0"}>
          {text}
        </p>
      ),
    },
    {
      title: (
        <>
          <span>
            {t("Submission-date")}{" "}
            {sortOrderLeaveDateTime === "descend" ? (
              <img src={ArrowDownIcon} alt="" />
            ) : (
              <img src={ArrowUpIcon} alt="" />
            )}
          </span>
        </>
      ),
      dataIndex: "deadline",
      key: "deadline",
      className: "leaveTimeParticipant",
      width: "140px",
      ellipsis: true,
      sorter: (a, b) =>
        utcConvertintoGMT(a.deadline) - utcConvertintoGMT(b.deadline),
      sortOrderLeaveDateTime,
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderLeaveDateTime((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p className={record.status === "Expired" ? "opacity-25 m-0" : "m-0"}>
          {newDateFormatterForMinutesPendingApproval(text)}
        </p>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      className: "statusParticipant",
      width: "150px",
      filters: [
        { text: t("Reviewed"), value: "Reviewed" },
        { text: t("Pending"), value: "Pending" },
        { text: t("Expired"), value: "Expired" },
      ],
      onFilter: (value, record) => record.status === value,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => (
        <p
          className={
            text === "Expired"
              ? styles["expiredStatus"]
              : text === "Pending"
              ? styles["pendingStatus"]
              : styles["reviewedStatus"]
          }
        >
          {text}
        </p>
      ),
    },
  ];

  useEffect(() => {
    let Data = { sRow: 0, Length: 10 };
    dispatch(GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t));
    dispatch(GetMinuteReviewPendingApprovalsByReviewerId(Data, navigate, t));
  }, []);

  useEffect(() => {
    if (
      MinutesReducer.GetMinuteReviewPendingApprovalsByReviewerIdData !== null &&
      MinutesReducer.GetMinuteReviewPendingApprovalsByReviewerIdData !==
        undefined &&
      MinutesReducer.GetMinuteReviewPendingApprovalsByReviewerIdData.length !==
        0
    ) {
      let reducerDataRow =
        MinutesReducer.GetMinuteReviewPendingApprovalsByReviewerIdData
          .pendingReviews;
      setRowsPendingApproval(reducerDataRow);
    } else {
      setRowsPendingApproval([]);
    }
  }, [MinutesReducer.GetMinuteReviewPendingApprovalsByReviewerIdData]);

  useEffect(() => {
    if (
      MinutesReducer.GetMinuteReviewPendingApprovalsStatsByReviewerIdData !==
        null &&
      MinutesReducer.GetMinuteReviewPendingApprovalsStatsByReviewerIdData !==
        undefined &&
      MinutesReducer.GetMinuteReviewPendingApprovalsStatsByReviewerIdData
        .length !== 0
    ) {
      let reducerData =
        MinutesReducer.GetMinuteReviewPendingApprovalsStatsByReviewerIdData
          .data;
      setProgress(reducerData);
    } else {
      setProgress([]);
    }
  }, [MinutesReducer.GetMinuteReviewPendingApprovalsStatsByReviewerIdData]);

  return (
    <section className={styles["pendingApprovalContainer"]}>
      {" "}
      {/* Container for pending approval section */}
      <Row className="my-3 d-flex align-items-center">
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {t("Pending-approval")}{" "}
            {/* Translation for pending approval heading */}
          </span>
        </Col>
      </Row>
      <Paper className={styles["pendingApprovalPaper"]}>
        {/* Paper component for styling */}
        <Container>
          <Row>
            <Col>
              <div className={styles["overallGap"]}>
                {/* Buttons for reviewing minutes */}
                <Button
                  text="Review Minutes"
                  className={
                    reviewMinutesActive
                      ? styles.activeMinutes
                      : styles.inActiveMinutes
                  } // Apply active or inactive styles based on state
                  onClick={handleReviewMinutesClick} // Attach click handler
                />
                {/* Review & Sign button */}
                {(checkFeatureIDAvailability(19) ||
                  checkFeatureIDAvailability(21)) && (
                  <Button
                    text="Review & Sign"
                    className={
                      reviewAndSignActive
                        ? styles.activeMinutes
                        : styles.inActiveMinutes
                    } // Apply active or inactive styles based on state
                    onClick={handleReviewAndSignClick} // Attach click handler
                  />
                )}
              </div>
            </Col>
          </Row>
          {reviewMinutesActive ? (
            <>
              {" "}
              <Row>
                <Col>
                  {rowsPendingApproval.length > 0 ? (
                    <>
                      <div className={styles["progressWrapper"]}>
                        <Row>
                          <Col lg={6} md={6} sm={12}>
                            <div className="d-flex positionRelative">
                              {/* Progress bars with different colors and percentages */}
                              <ProgressStats
                                FirstColor="#6172D6"
                                firstValue={progress.reviewedPercentage}
                                thirdValue={progress.expiredPercentage}
                                thirdColor="#F16B6B"
                                secondColor="#ffc300"
                                secondValue={progress.pendingPercentage}
                              />
                            </div>
                          </Col>
                          <Col lg={6} md={6} sm={12} className="d-flex">
                            <span className={styles["line"]} />
                            <div
                              className={
                                styles["progress-value-wrapper-purple"]
                              }
                            >
                              <span className={styles["numeric-value"]}>
                                {progress.reviewed}
                              </span>
                              <span className={styles["value"]}>
                                {t("Reviewed")}
                              </span>
                            </div>
                            <span className={styles["line"]} />
                            <div
                              className={
                                styles["progress-value-wrapper-yellow"]
                              }
                            >
                              <span className={styles["numeric-value"]}>
                                {progress.pending}
                              </span>
                              <span className={styles["value"]}>
                                {t("Pending")}
                              </span>
                            </div>
                            <span className={styles["line"]} />
                            <div
                              className={styles["progress-value-wrapper-red"]}
                            >
                              <span className={styles["numeric-value"]}>
                                {progress.expired}
                              </span>
                              <span className={styles["value"]}>
                                {t("Expired")}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col>
                          <TableToDo
                            sortDirections={["descend", "ascend"]}
                            column={pendingApprovalColumns}
                            className={"PendingApprovalsTable"}
                            rows={rowsPendingApproval}
                            pagination={false}
                            scroll={
                              rowsPendingApproval.length > 10
                                ? { y: 385 }
                                : undefined
                            }
                            id={(record, index) =>
                              index === rowsPendingApproval.length - 1
                                ? "last-row-class"
                                : ""
                            }
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <section
                      className={`${styles["emptyScreen-height"]} d-flex flex-column align-items-center justify-content-center`}
                    >
                      <img src={NoApprovals} alt="" />
                      <span className={styles["No-Approvals"]}>
                        {t("Approvals")}
                      </span>
                      <span className={styles["No-Approvals-Text"]}>
                        {t("No-pending-approvals-at-the-moment")}
                      </span>
                    </section>
                  )}
                </Col>
              </Row>
            </>
          ) : (
            <ReviewSignature />
          )}
        </Container>
      </Paper>
    </section>
  );
};

export default PendingApproval; // Exporting pending approval component
