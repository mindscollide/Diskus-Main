import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ReviewSignature.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import UserImage from "../../../../assets/images/Userprofile-1.png";
import {
  pendingApprovalPage,
  reviewMinutesPage,
} from "../../../../store/actions/Minutes_action";
import { ChevronDown } from "react-bootstrap-icons";
import { TableToDo } from "../../../../components/elements";
import {
  getFileExtension,
  getIconSource,
} from "../../SearchFunctionality/option";
import { useNavigate } from "react-router-dom";
import {
  getAllPendingApprovalsSignaturesApi,
  getAllPendingApprovalsStatsApi,
} from "../../../../store/actions/workflow_actions";
import { useSelector } from "react-redux";
const ReviewSignature = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getAllPendingForApprovalStats, listOfPendingForApprovalSignatures } =
    useSelector((state) => state.SignatureWorkFlowReducer);
  const navigate = useNavigate();
  const [approvalStats, setApprovalStats] = useState({
    declined: 0,
    declinedPercentage: 0,
    pending: 0,
    pendingPercentage: 0,
    signed: 0,
    signedPercentage: 0,
  });

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

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
      title: t("Document-name"),
      dataIndex: "name",
      key: "name",
      className: "nameParticipant",
      width: "300px",
      ellipsis: true,
      render: (text, record) => (
        <p
          //   onClick={() => {
          //     dispatch(reviewMinutesPage(true));
          //     dispatch(pendingApprovalPage(false));
          //   }}
          //   className={
          //     record.status === "Expired"
          //       ? "cursor-pointer opacity-25 m-0 text-truncate"
          //       : "cursor-pointer m-0 text-truncate"
          //   }
          className="cursor-pointer m-0 text-truncate d-flex gap-2 align-items-center"
        >
          <img src={getIconSource(getFileExtension(text))} />
          <span>{text}</span>
        </p>
      ),
    },
    {
      title: t("Requested-by"),
      dataIndex: "RequestedUser",
      key: "RequestedUser",
      className: "emailParticipant",
      width: "180px",
      ellipsis: true,
      render: (text, record) => (
        <p
          className={
            "m-0 d-flex align-items-center gap-2 justify-content-start"
          }
        >
          <img
            src={UserImage}
            width={22}
            height={22}
            className="rounded-circle "
          />
          <span>{text}</span>
        </p>
      ),
    },
    {
      title: t("Date-and-time"),
      dataIndex: "dateTime",
      key: "dateTime",
      className: "leaveTimeParticipant",
      width: "180px",
      ellipsis: true,
      render: (text, record) => <p className={"m-0"}>{text}</p>,
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
        { text: t("Signed"), value: "Signed" },
        { text: t("Decline"), value: "Decline" },
      ],
      onFilter: (value, record) => record.status === value,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => (
        <p
          className={
            text === "Pending"
              ? styles["pendingStatus"]
              : text === "Signed"
              ? styles["signedStatus"]
              : styles["declineStatus"]
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
      name: "TestDocument123123123.pdf",
      RequestedUser: "john",
      status: "Pending",
      dateTime: "11-01-2024 | 05:00 PM",
    },
    {
      key: "2",
      name: "TestDocument1215345342234.pdf",
      RequestedUser: "john",
      status: "Decline",
      dateTime: "11-01-2024 | 05:00 PM",
    },
    {
      key: "3",
      name: "TestDocument12234234234.pdf",
      RequestedUser: "john",
      status: "Signed",
      dateTime: "11-01-2024 | 05:00 PM",
    },
    {
      key: "3",
      name: "TestDocument11231232.pdf",
      RequestedUser: "janem",
      status: "Signed",
      dateTime: "11-01-2024 | 04:30 PM",
    },
    {
      key: "4",
      name: "TestDocument11231232.pdf",
      RequestedUser: "michael",
      status: "Signed",
      dateTime: "11-01-2024 | 05:15 PM",
    },
    {
      key: "5",
      name: "TestDocument12123123.pdf",
      RequestedUser: "emily",
      status: "Decline",
      dateTime: "11-01-2024 | 05:45 PM",
    },
    // Add more data as needed
  ];

  useEffect(() => {
    dispatch(getAllPendingApprovalsStatsApi(navigate, t));
    let Data = { pageNo: 1, pageSize: 10 };
    dispatch(getAllPendingApprovalsSignaturesApi(navigate, t, Data));
  }, []);

  useEffect(() => {
    if (getAllPendingForApprovalStats !== null) {
      try {
        let { data } = getAllPendingForApprovalStats;
        console.log(
          data,
          "getAllPendingForApprovalStatsgetAllPendingForApprovalStats"
        );
        setApprovalStats(data);
      } catch {}
    }
  }, [getAllPendingForApprovalStats]);

  const formatValue = (value) => (value < 9 ? `0${value}` : value);
  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className={styles["progressWrapper"]}>
            <Row>
              <Col lg={6} md={6} sm={12}>
                <div className="d-flex  position-relative">
                  {/* Progress bars with different colors and percentages */}
                  <ProgressBar
                    width={approvalStats.signedPercentage}
                    color="#F16B6B"
                    indexValue="0"
                    percentageValue={`${approvalStats.signedPercentage}%`}
                  />
                  <ProgressBar
                    width={approvalStats.pendingPercentage}
                    color="#FFC300"
                    indexValue="1"
                    percentageValue={`${approvalStats.pendingPercentage}%`}
                  />
                  <ProgressBar
                    width={approvalStats.declinedPercentage}
                    color="#55CE5C"
                    indexValue="2"
                    percentageValue={`${approvalStats.declinedPercentage}%`}
                  />
                </div>
              </Col>
              <Col lg={6} md={6} sm={12} className="d-flex">
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-signed"]}>
                  <span className={styles["numeric-value"]}>
                    {formatValue(approvalStats.signed)}
                  </span>
                  <span className={styles["value"]}>Signed</span>
                </div>
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-pending"]}>
                  <span className={styles["numeric-value"]}>
                    {formatValue(approvalStats.pending)}
                  </span>
                  <span className={styles["value"]}>Pending</span>
                </div>
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-decline"]}>
                  <span className={styles["numeric-value"]}>
                    {formatValue(approvalStats.declined)}
                  </span>
                  <span className={styles["value"]}>Decline</span>
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
            scroll={rowsPendingApproval.length > 10 ? { y: 385 } : undefined}
            id={(record, index) =>
              index === rowsPendingApproval.length - 1 ? "last-row-class" : ""
            }
          />
        </Col>
      </Row>{" "}
    </>
  );
};

export default ReviewSignature;
