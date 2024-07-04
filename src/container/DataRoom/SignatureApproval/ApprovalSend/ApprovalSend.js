import React, { useEffect, useState } from "react";
import styles from "./ApprovalSend.module.css";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { TableToDo } from "../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import DeleteIcon from "../../../../assets/images/delete_dataroom.png";
import SorterIconAscend from "../../../../assets/images/approval_sorter_icon_ascend.svg";
import SorterIconDescend from "../../../../assets/images/approval_sorter_icon_descend.svg";
import SignatoriesListModal from "./SignatoriesList/SignatoriesListModal";
import {
  getFileExtension,
  getIconSource,
} from "../../SearchFunctionality/option";
import { useSelector } from "react-redux";

const ApprovalSend = () => {
  const { t } = useTranslation();
  const SignatureWorkFlowReducer = useSelector(
    (state) => state.SignatureWorkFlowReducer
  );
  const currentView = JSON.parse(localStorage.getItem("setTableView"));
  const [signatureListVal, setSignatureListVal] = useState(0);
  const [approvalsData, setApprovalsData] = useState([]);
  console.log(approvalsData, "approvalsDataapprovalsDataapprovalsData");
  const [signatoriesList, setSignatoriesList] = useState(false);
  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      // Column for file name
      title: t("File-name"),
      dataIndex: "fileName",
      key: "fileName",
      className: "nameParticipant",
      align: "left",
      ellipsis: true,
      width: 200,
      sortDirections: ["ascend", "descend"],
      sortOrder: "ascend",
      sorter: (a, b) => b.name - a.name, // Custom sorter function for sorting by name
      render: (text, record) => {
        return (
          <span
            className="d-flex gap-2 align-items-center cursor-pointer"
            onClick={() => handleClickOpenDoc(record)}
          >
            <img src={getIconSource(getFileExtension(text))} />
            <p className={styles["fileName_Approvals"]}>{text}</p>
          </span>
        );
      },
    },
    {
      // Column for signatories
      title: t("Signatories"),
      dataIndex: "numberOfSignatories",
      key: "numberOfSignatories",
      className: "signatories",
      ellipsis: true,
      sortOrder: "ascend",
      width: 150,
      align: "center",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => b.name - a.name,
      render: (text, record) => {
        console.log(
          text,
          record,
          "numberOfSignatoriesnumberOfSignatoriesnumberOfSignatories"
        );
        return (
          <span
            // onClick={() => setSignatoriesList(true)}
            onClick={() =>
              handleClickSignatoriesList(record.numberOfSignatories)
            }
            className={styles["signatories_vale"]}
          >{` ${text} Signatories`}</span>
        );
      },
    },
    {
      // Column for sent-on date
      title: t("Sent-on"),
      dataIndex: "sentOn",
      key: "sentOn",
      className: "leaveTimeParticipant",

      width: 100,

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
      width: 150,

      className: "statusParticipant",
      filters: [
        // Filter options
        { text: t("Draft"), value: "Draft" },
        { text: t("Pending-Signature"), value: "Pending Signature" },
        { text: t("Signed"), value: "Signed" },
        { text: t("Declined"), value: "Decline" },
      ],
      defaultFilteredValue: ["Draft", "Pending Signature", "Signed", "Decline"],
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
                : text === "Pending Signature"
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
    {
      // Column for status
      title: "",
      dataIndex: "delete",
      key: "delete",
      align: "center",
      width: 50,
      render: (text, record) => {
        // Render status text with appropriate styles
        return <img src={DeleteIcon} />;
      },
    },
  ];

  const handleClickSignatoriesList = (value) => {
    setSignatureListVal(value);
    setSignatoriesList(true);
  };

  const handleClickOpenDoc = (record) => {
    if (record.status.toLowerCase() === "Draft".toLowerCase()) {
      let reponseData = JSON.stringify(record.fileID);
      window.open(
        `/#/DisKus/signatureviewer?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  useEffect(() => {
    if (SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator !== null) {
      try {
        let { signatureFlowDocumentsForCreator } =
          SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator;
        if (
          Array.isArray(signatureFlowDocumentsForCreator) &&
          signatureFlowDocumentsForCreator.length > 0
        ) {
          setApprovalsData(signatureFlowDocumentsForCreator);
        }
      } catch (error) {
        console.log("Something Went Wrong", error);
      }
    }
  }, [SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator]);
  
  return (
    <>
      {" "}
      <Row className="mb-2">
        <Col sm={12} md={12} lg={12} className="mt-3">
          <TableToDo
            sortDirections={["descend", "ascend"]}
            column={pendingApprovalColumns}
            className={"ApprovalsTable"}
            // prefClassName="ApprovalSending"
            rows={approvalsData}
            // scroll={scroll}
            pagination={false}
            scroll={
              approvalsData.length > 5
                ? { y: 385, x: "max-content" }
                : undefined
            }
            id={(record, index) =>
              index === approvalsData.length - 1 ? "last-row-class" : ""
            }
          />
        </Col>
      </Row>
      {signatoriesList && (
        <SignatoriesListModal
          signatories_List={signatoriesList}
          setSignatoriesList={setSignatoriesList}
          signatureListVal={signatureListVal}
        />
      )}
    </>
  );
};

export default ApprovalSend;
