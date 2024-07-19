import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ReviewSignature.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import DescendIcon from "../../../MinutesNewFlow/Images/SorterIconDescend.png";
import AscendIcon from "../../../MinutesNewFlow/Images/SorterIconAscend.png";
import { ChevronDown } from "react-bootstrap-icons";
import { Notification, TableToDo } from "../../../../components/elements";
import {
  getFileExtension,
  getIconSource,
} from "../../SearchFunctionality/option";
import { useNavigate } from "react-router-dom";
import {
  clearWorkFlowResponseMessage,
  getAllPendingApprovalsSignaturesApi,
} from "../../../../store/actions/workflow_actions";
import { useSelector } from "react-redux";
import {
  SignatureandPendingApprovalDateTIme,
  utcConvertintoGMT,
} from "../../../../commen/functions/date_formater";
import { set } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
const ReviewSignature = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    getAllPendingForApprovalStats,
    listOfPendingForApprovalSignatures,
    getAllPendingApprovalStatuses,
    ResponseMessage,
  } = useSelector((state) => state.SignatureWorkFlowReducer);
  const navigate = useNavigate();
  const [approvalStats, setApprovalStats] = useState({
    declined: 0,
    declinedPercentage: 0,
    pending: 0,
    pendingPercentage: 0,
    signed: 0,
    signedPercentage: 0,
  });

  const [reviewSignature, setReviewSignature] = useState([]);
  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [isOpen, setIsOpen] = useState({
    open: true,
    message: "",
  });
  const [reviewAndSignatureStatus, setReviewAndSignatureStatus] = useState([]);
  const [defaultreviewAndSignatureStatus, setDefaultReviewAndSignatureStatus] =
    useState([]);

  const [totalRecords, setTotalRecords] = useState(null);
  const [totalDataLnegth, setTotalDataLength] = useState(0);
  const [isScrollling, setIsScrolling] = useState(false);
  const [sortOrderRequestBy, setSortOrderRequestBy] = useState(null);
  const [sortOrderDateTime, setSortOrderDateTime] = useState(null);
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
      minWidth: `${indexValue === "0" ? "100%" : "auto"}`,
    };

    return <span style={barStyle}>{percentageValue}</span>; // Display progress bar with percentage
  };

  const handleClickOpenSigatureDoc = (record) => {
    console.log(record, "signeddocumentsigneddocument");
    if (record.status === "Pending Signature") {
      let reponseData = JSON.stringify(record.fileID);
      window.open(
        `/#/DisKus/signeddocument?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    } else {
      let reponseData = JSON.stringify(record.fileID);
      window.open(
        `/#/DisKus/viewSignDocument?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      title: t("Document-name"),
      dataIndex: "fileName",
      key: "fileName",
      className: "nameParticipant",
      width: "300px",
      ellipsis: true,
      render: (text, record) => (
        <p
          className="cursor-pointer m-0 text-truncate d-flex gap-2 align-items-center"
          onClick={() => handleClickOpenSigatureDoc(record)}
        >
          <img src={getIconSource(getFileExtension(text))} />
          <span>{text}</span>
        </p>
      ),
    },
    {
      title: (
        <>
          {t("Requested-by")}{" "}
          {sortOrderRequestBy === "descend" ? (
            <img src={DescendIcon} alt="" />
          ) : (
            <img src={AscendIcon} alt="" />
          )}
        </>
      ),
      dataIndex: "creatorName",
      key: "creatorName",
      className: "emailParticipant",
      width: "180px",
      ellipsis: true,
      sorter: (a, b) =>
        a.creatorName.toLowerCase().localeCompare(b.creatorName.toLowerCase()),
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderRequestBy((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p
          className={
            "m-0 d-flex align-items-center gap-2 justify-content-start"
          }
        >
          <img
            src={`data:image/jpeg;base64,${record.creatorImg}`}
            width={22}
            height={22}
            className="rounded-circle "
          />
          <span>{text}</span>
        </p>
      ),
    },
    {
      title: (
        <>
          {t("Date-and-time")}{" "}
          {sortOrderDateTime === "descend" ? (
            <img src={DescendIcon} alt="" />
          ) : (
            <img src={AscendIcon} alt="" />
          )}
        </>
      ),
      dataIndex: "createdOn",
      key: "createdOn",
      className: "leaveTimeParticipant",
      width: "180px",
      ellipsis: true,
      sorter: (a, b) =>
        utcConvertintoGMT(a.deadline) - utcConvertintoGMT(b.deadline),
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderDateTime((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p className={"m-0"}>{SignatureandPendingApprovalDateTIme(text)}</p>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      className: "statusParticipant",
      width: "150px",
      filters: reviewAndSignatureStatus,
      defaultFilteredValue: defaultreviewAndSignatureStatus,
      onFilter: (value, record) => record.actorStatusID === value,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => {
        const { actorStatusID, status } = record;
        return (
          <p
            className={
              actorStatusID === 2
                ? styles["pendingStatus"]
                : actorStatusID === 3
                ? styles["signedStatus"]
                : actorStatusID === 4
                ? styles["declineStatus"]
                : styles["draftStatus"]
            }
          >
            {status}
          </p>
        );
      },
    },
  ];

  const handleScroll = async () => {
    console.log(
      totalDataLnegth <= totalRecords,
      totalDataLnegth,
      totalRecords,
      "handleScrollhandleScroll"
    );
    if (totalDataLnegth <= totalRecords) {
      setIsScrolling(true);
      let Data = { sRow: Number(totalDataLnegth), Length: 10 };
      console.log(Data, "handleScrollhandleScrollhandleScroll");
      await dispatch(getAllPendingApprovalsSignaturesApi(navigate, t, Data));
    }
  };

  useEffect(() => {
    if (
      getAllPendingApprovalStatuses !== null &&
      getAllPendingApprovalStatuses !== undefined
    ) {
      try {
        const { statusList } = getAllPendingApprovalStatuses;
        let statusValues = [];
        let defaultStatus = [];
        if (statusList.length > 0) {
          statusList.forEach((statusData, index) => {
            statusValues.push({
              text: statusData.statusName,
              value: Number(statusData.statusID),
            });
            defaultStatus.push(Number(statusData.statusID));
          });
          setReviewAndSignatureStatus(statusValues);
          setDefaultReviewAndSignatureStatus(defaultStatus);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [getAllPendingApprovalStatuses]);

  useEffect(() => {
    if (getAllPendingForApprovalStats !== null) {
      try {
        let { data } = getAllPendingForApprovalStats;

        setApprovalStats(data);
      } catch {}
    }
  }, [getAllPendingForApprovalStats]);

  useEffect(() => {
    if (listOfPendingForApprovalSignatures !== null) {
      try {
        let { pendingApprovals, totalCount } =
          listOfPendingForApprovalSignatures;
        if (Array.isArray(pendingApprovals) && pendingApprovals.length > 0) {
          if (isScrollling) {
            setIsScrolling(false);
            setReviewSignature([...pendingApprovals, ...reviewSignature]);
            setTotalRecords(totalCount);
            setTotalDataLength((prev) => prev + pendingApprovals.length);
          } else {
            setTotalRecords(totalCount);
            setTotalDataLength(pendingApprovals.length);

            setReviewSignature(pendingApprovals);
          }
        }
      } catch (error) {}
    }
  }, [listOfPendingForApprovalSignatures]);

  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== null &&
      ResponseMessage !== undefined
    ) {
      setIsOpen({
        message: ResponseMessage,
        open: true,
      });
      setTimeout(() => {
        setIsOpen({
          message: "",
          open: false,
        });
      }, 4000);
      dispatch(clearWorkFlowResponseMessage());
    }
  }, [ResponseMessage]);

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
                  {approvalStats.declined > 0 && (
                    <ProgressBar
                      width={approvalStats.declinedPercentage}
                      color="#F16B6B"
                      indexValue="0"
                      percentageValue={`${approvalStats.declinedPercentage}%`}
                    />
                  )}
                  {approvalStats.pending > 0 && (
                    <ProgressBar
                      width={approvalStats.pendingPercentage}
                      color="#FFC300"
                      indexValue="1"
                      percentageValue={`${approvalStats.pendingPercentage}%`}
                    />
                  )}
                  {approvalStats.signed > 0 && (
                    <ProgressBar
                      width={approvalStats.signedPercentage}
                      color="#55CE5C"
                      indexValue="2"
                      percentageValue={`${approvalStats.signedPercentage}%`}
                    />
                  )}
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
        <Col sm={12} md={12} lg={12}>
          {/* {reviewAndSignatureStatus.length > 0 && ( */}
          <InfiniteScroll
            dataLength={reviewSignature.length}
            next={handleScroll}
            hasMore={reviewSignature.length === totalRecords ? false : true}
            style={{
              overflowX: "hidden",
            }}
            height={"50vh"}
          >
            <TableToDo
              sortDirections={["descend", "ascend"]}
              column={pendingApprovalColumns}
              className={"PendingApprovalsTable"}
              rows={reviewSignature}
              // scroll={scroll}
              pagination={false}
              id={(record, index) =>
                index === reviewSignature.length - 1 ? "last-row-class" : ""
              }
            />
          </InfiniteScroll>
          {/* )} */}
        </Col>
      </Row>{" "}
      <Notification
        open={isOpen.open}
        message={isOpen.message}
        setOpen={setIsOpen}
      />
    </>
  );
};

export default ReviewSignature;
