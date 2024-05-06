import React, { useState } from "react";
import styles from "./ApprovalSend.module.css";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { TableToDo } from "../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import SorterIconAscend from "../../../../assets/images/approval_sorter_icon_ascend.svg";
import SorterIconDescend from "../../../../assets/images/approval_sorter_icon_descend.svg";
import SignatoriesListModal from "./SignatoriesList/SignatoriesListModal";
import {
  getFileExtension,
  getIconSource,
} from "../../SearchFunctionality/option";

const ApprovalSend = () => {
  const { t } = useTranslation();

  const [signatoriesList, setSignatoriesList] = useState(false);
  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      // Column for file name
      title: ({ sortColumns }) => {
        // Find the sorted column
        const sortedColumn = sortColumns?.find(
          ({ column }) => column.key === "name"
        );
        return (
          <div className="d-flex gap-2">
            {t("File-name")}
            {/* Display sorting icon based on the sorting order */}
            {sortedColumn ? (
              sortedColumn.order === "ascend" ? (
                <img
                  className={styles["Sort_icon_ascend"]}
                  src={SorterIconAscend}
                  alt="Ascending sort"
                />
              ) : (
                <img
                  className={styles["Sort_icon_descend"]}
                  src={SorterIconDescend}
                  alt="Descending sort"
                />
              )
            ) : null}
          </div>
        );
      },
      dataIndex: "name",
      key: "name",
      className: "nameParticipant",
      align: "left",
      ellipsis: true,
      sorter: (a, b) => b.name - a.name, // Custom sorter function for sorting by name
      render: (text, record) => {
        return (
          <span className="d-flex gap-2 align-items-center">
            <img src={getIconSource(getFileExtension(text))} />
            <p className={styles["fileName_Approvals"]}>{text}</p>
          </span>
        );
      },
    },
    {
      // Column for signatories
      title: t("Signatories"),
      dataIndex: "signatories",
      key: "signatories",
      className: "signatories",
      ellipsis: true,
      render: (text, record) => (
        <span
          onClick={() => setSignatoriesList(true)}
          className={styles["signatories_vale"]}
        >{` ${text} Signatories`}</span>
      ),
    },
    {
      // Column for sent-on date
      title: t("Sent-on"),
      dataIndex: "sendDate",
      key: "sendDate",
      className: "leaveTimeParticipant",
      ellipsis: true,
      render: (text, record) => (
        <span className={styles["date_vale"]}>{text}</span>
      ),
    },
    {
      // Column for status
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      className: "statusParticipant",
      filters: [
        // Filter options
        { text: t("Draft"), value: "Draft" },
        { text: t("Pending-Signature"), value: "Pending" },
        { text: t("Signed"), value: "Signed" },
        { text: t("Declined"), value: "Decline" },
      ],
      defaultFilteredValue: ["Draft", "Pending", "Signed", "Decline"],
      onFilter: (value, record) => record.status === value, // Filter function
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => {
        // Render status text with appropriate styles
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
      name: "abc.pdf",
      signatories: 10,
      status: "Draft",
      sendDate: "11-01-2024 | 05:00 PM",
    },
    {
      key: "2",
      name: "casdasd.pdf",
      signatories: 9,
      status: "Pending",
      sendDate: "11-01-2024 | 05:00 PM",
    },
    {
      key: "3",
      name: "bcdasdasd.pdf",
      signatories: 20,
      status: "Decline",
      sendDate: "11-01-2024 | 05:00 PM",
    },
    {
      key: "4",
      name: "ddd123123123.pdf",
      signatories: 4,
      status: "Signed",
      sendDate: "11-01-2024 | 04:30 PM",
    },
    {
      key: "5",
      name: "abcdsffg.pdf",
      signatories: 8,
      status: "Decline",
      sendDate: "11-01-2024 | 05:15 PM",
    },
    {
      key: "6",
      name: "abcasdADAdas.pdf",
      signatories: 16,
      status: "Signed",
      sendDate: "11-01-2024 | 05:45 PM",
    },
    // Add more data as needed
  ];
  return (
    <>
      {" "}
      <Row>
        <Col sm={12} md={12} lg={12} className="mt-3">
          <TableToDo
            sortDirections={["descend", "ascend"]}
            column={pendingApprovalColumns}
            className={"PendingApprovalsTable"}
            // prefClassName="ApprovalSending"
            rows={rowsPendingApproval}
            // scroll={scroll}
            pagination={false}
            scroll={
              rowsPendingApproval.length > 10
                ? { y: 385, x: "max-content" }
                : undefined
            }
            id={(record, index) =>
              index === rowsPendingApproval.length - 1 ? "last-row-class" : ""
            }
          />
        </Col>
      </Row>
      {signatoriesList && (
        <SignatoriesListModal
          signatoriesList={signatoriesList}
          setSignatoriesList={setSignatoriesList}
        />
      )}
    </>
  );
};

export default ApprovalSend;
