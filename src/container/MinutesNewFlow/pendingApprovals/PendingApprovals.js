import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Importing translation hook
import styles from "./PendingApprovals.module.css"; // Importing CSS module
import {
  pendingApprovalPage,
  reviewMinutesPage,
} from "../../../store/actions/Minutes_action"; // Importing Page Change State
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import { Button, Paper, TableToDo } from "../../../components/elements"; // Importing custom components
import { ChevronDown } from "react-bootstrap-icons"; //Bootstrap Icon

// Functional component for pending approvals section
const PendingApproval = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  // State for tracking the active state of each button
  const [reviewMinutesActive, setReviewMinutesActive] = useState(true); // Default Review Minutes button to active
  const [reviewAndSignActive, setReviewAndSignActive] = useState(false);

  // Click handler for Review Minutes button
  const handleReviewMinutesClick = () => {
    setReviewMinutesActive(true); // Set Review Minutes button to active
    setReviewAndSignActive(false); // Set Review & Sign button to inactive
    // Your functionality for Review Minutes button
  };

  // Click handler for Review & Sign button
  const handleReviewAndSignClick = () => {
    setReviewMinutesActive(false); // Set Review Minutes button to inactive
    setReviewAndSignActive(true); // Set Review & Sign button to active
    // Your functionality for Review & Sign button
  };

  // ProgressBar component for visualizing progress
  const ProgressBar = ({ width, color, indexValue, percentageValue }) => {
    const barStyle = {
      background: color,
      height: "35px",
      width: `${width}%`,
      borderRadius: "25px",
      zIndex: indexValue,
      position: "absolute",
      textAlign: currentLanguage === "en" ? "right" : "left",
      fontFamily: "Montserrat",
      fontStyle: "normal",
      fontWeight: "800",
      fontSize: "16px",
      textTransform: "uppercase",
      color: "#FFFFFF",
      paddingTop: "5px",
      paddingRight: currentLanguage === "en" ? "10px" : "auto",
      paddingLeft: currentLanguage === "en" ? "auto" : "10px",
    };

    return <span style={barStyle}>{percentageValue}</span>; // Display progress bar with percentage
  };

  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      title: t("Meeting-title"),
      dataIndex: "name",
      key: "name",
      className: "nameParticipant",
      width: "200px",
      ellipsis: true,
      render: (text, record) => (
        <p
          onClick={() => {
            dispatch(reviewMinutesPage(true));
            dispatch(pendingApprovalPage(false));
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
      title: t("Review-requested-by"),
      dataIndex: "userEmail",
      key: "userEmail",
      className: "emailParticipant",
      width: "180px",
      ellipsis: true,
      render: (text, record) => (
        <p className={record.status === "Expired" ? "opacity-25 m-0" : "m-0"}>
          {text}
        </p>
      ),
    },
    {
      title: t("Submission-date-and-time"),
      dataIndex: "leaveTime",
      key: "leaveTime",
      className: "leaveTimeParticipant",
      width: "180px",
      ellipsis: true,
      render: (text, record) => (
        <p className={record.status === "Expired" ? "opacity-25 m-0" : "m-0"}>
          {text}
        </p>
      ),
      // render: (text, record) => convertAndFormatDateTimeGMT(text),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      className: "statusParticipant",
      width: "150px",
      filters: [
        { text: t("Pending"), value: "Pending" },
        { text: t("Expired"), value: "Expired" },
        { text: t("Reviewed"), value: "Reviewed" },
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

  // Data for rows of the pending approval table
  const rowsPendingApproval = [
    {
      key: "1",
      name: "Board Member Executive Meeting from Boss's and hahahahahaha",
      userEmail: "john.doe@example.com",
      status: "Pending",
      leaveTime: "11-01-2024 | 05:00 PM",
    },
    {
      key: "1",
      name: "IT Departmental Meeting",
      userEmail: "john.doe@example.com",
      status: "Pending",
      leaveTime: "11-01-2024 | 05:00 PM",
    },
    {
      key: "1",
      name: "John Doe",
      userEmail: "john.doe@example.com",
      status: "Reviewed",
      leaveTime: "11-01-2024 | 05:00 PM",
    },
    {
      key: "2",
      name: "Stock and Shareholders Meeting",
      userEmail: "jane.smith@example.com",
      status: "Expired",
      leaveTime: "11-01-2024 | 04:30 PM",
    },
    {
      key: "3",
      name: "Board Member Executive Meeting from Boss's",
      userEmail: "michael.johnson@example.com",
      status: "Expired",
      leaveTime: "11-01-2024 | 05:15 PM",
    },
    {
      key: "4",
      name: "Board Member Executive Meeting from Boss's",
      userEmail: "emily.brown@example.com",
      status: "Reviewed",
      leaveTime: "11-01-2024 | 05:45 PM",
    },
    // Add more data as needed
  ];

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
                  <Button
                    text="Review & Sign"
                    className={
                      reviewAndSignActive
                        ? styles.activeMinutes
                        : styles.inActiveMinutes
                    } // Apply active or inactive styles based on state
                    onClick={handleReviewAndSignClick} // Attach click handler
                  />
                </div>
              </Col>
            </Row>
            {reviewMinutesActive ? (
              <>
                {" "}
                <Row>
                  <Col>
                    <div className={styles["progressWrapper"]}>
                      <Row>
                        <Col lg={6} md={6} sm={12}>
                          <div className="d-flex positionRelative">
                            {/* Progress bars with different colors and percentages */}
                            <ProgressBar
                              width={100}
                              color="#F16B6B"
                              indexValue="0"
                              percentageValue={"60%"}
                            />
                            <ProgressBar
                              width={30}
                              color="#ffc300"
                              indexValue="1"
                              percentageValue={"30%"}
                            />
                            <ProgressBar
                              width={10}
                              color="#6172D6"
                              indexValue="2"
                              percentageValue={"10%"}
                            />
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="d-flex">
                          <span className={styles["line"]} />
                          <div
                            className={styles["progress-value-wrapper-purple"]}
                          >
                            <span className={styles["numeric-value"]}>03</span>
                            <span className={styles["value"]}>Reviewed</span>
                          </div>
                          <span className={styles["line"]} />
                          <div
                            className={styles["progress-value-wrapper-yellow"]}
                          >
                            <span className={styles["numeric-value"]}>03</span>
                            <span className={styles["value"]}>Pending</span>
                          </div>
                          <span className={styles["line"]} />
                          <div className={styles["progress-value-wrapper-red"]}>
                            <span className={styles["numeric-value"]}>02</span>
                            <span className={styles["value"]}>Expired</span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TableToDo
                      sortDirections={["descend", "ascend"]}
                      column={pendingApprovalColumns}
                      className={"PendingApprovalsTable"}
                      rows={rowsPendingApproval}
                      // scroll={scroll}
                      pagination={false}
                      scroll={
                        rowsPendingApproval.length > 10 ? { y: 385 } : undefined
                      }
                      id={(record, index) =>
                        index === rowsPendingApproval.length - 1
                          ? "last-row-class"
                          : ""
                      }
                    />
                  </Col>
                </Row>{" "}
              </>
            ) : null}
          </Container>
        </Paper>
    </section>
  );
};

export default PendingApproval; // Exporting pending approval component
