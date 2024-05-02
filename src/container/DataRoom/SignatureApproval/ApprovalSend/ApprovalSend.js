import React from "react";
import styles from "./ApprovalSend.module.css";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { TableToDo } from "../../../../components/elements";
import { Col, Row } from "react-bootstrap";
const ApprovalSend = () => {
  const { t } = useTranslation();
  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      title: t("File-name"),
      dataIndex: "name",
      key: "name",
      className: "nameParticipant",
      width: "200px",
      ellipsis: true,
      render: (text, record) => (
        <p
          //   onClick={() => {
          //     dispatch(reviewMinutesPage(true));
          //     dispatch(pendingApprovalPage(false));
          //   }}
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
      title: t("Signatories"),
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
      title: t("Sent-on"),
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
        { text: t("Draft"), value: "Draft" },
        { text: t("Pending-Signature"), value: "Pending" },
        { text: t("Signed"), value: "Signed" },
        { text: t("Declined"), value: "Decline" },
      ],
      onFilter: (value, record) => record.status === value,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => {
        console.log(text, "texttexttext");
        return (
          <p
            className={
              text === "Draft"
                ? styles["DraftStatus"]
                : text === "Pending"
                ? styles["pendingStatus"]
                : text === "Signed"
                ? styles["SignedStatus"]
                : styles["DeclineStatus"]
            }
          >
            {text}
          </p>
        );
      },
    },
  ];

  // Data for rows of the pending approval table
  const rowsPendingApproval = [
    {
      key: "1",
      name: "Board Member Executive Meeting from Boss's and hahahahahaha",
      userEmail: "john.doe@example.com",
      status: "Draft",
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
      status: "Decline",
      leaveTime: "11-01-2024 | 05:00 PM",
    },
    {
      key: "2",
      name: "Stock and Shareholders Meeting",
      userEmail: "jane.smith@example.com",
      status: "Signed",
      leaveTime: "11-01-2024 | 04:30 PM",
    },
    {
      key: "3",
      name: "Board Member Executive Meeting from Boss's",
      userEmail: "michael.johnson@example.com",
      status: "Decline",
      leaveTime: "11-01-2024 | 05:15 PM",
    },
    {
      key: "4",
      name: "Board Member Executive Meeting from Boss's",
      userEmail: "emily.brown@example.com",
      status: "Signed",
      leaveTime: "11-01-2024 | 05:45 PM",
    },
    // Add more data as needed
  ];
  return (
    <>
      {" "}
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
      </Row>
    </>
  );
};

export default ApprovalSend;
