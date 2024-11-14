import React, { useEffect, useState } from "react";
import styles from "./ApprovalSend.module.css";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { TableToDo } from "../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import DeleteIcon from "../../../../assets/images/delete_dataroom.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingOutlined } from "@ant-design/icons";
import EmtpyImage from "../../../../assets/images/SendApproval_emptyIcon.png";
import SorterIconAscend from "../../../../assets/images/approval_sorter_icon_ascend.svg";
import SorterIconDescend from "../../../../assets/images/approval_sorter_icon_descend.svg";
import SignatoriesListModal from "./SignatoriesList/SignatoriesListModal";
import {
  getFileExtension,
  getIconSource,
} from "../../SearchFunctionality/option";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { SignatureandPendingApprovalDateTIme } from "../../../../commen/functions/date_formater";
import {
  deleteSignatureFlowDocumentApi,
  getAllPendingApprovalStatusApi,
  getAllSignatoriesStatusWise_Api,
  getAllSignaturesDocumentsforCreatorApi,
} from "../../../../store/actions/workflow_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DescendIcon from "../../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/Arrow-up.png";

const ApprovalSend = () => {
  const { t } = useTranslation();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const SignatureWorkFlowReducer = useSelector(
    (state) => state.SignatureWorkFlowReducer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signatureListVal, setSignatureListVal] = useState(0);
  const [approvalsData, setApprovalsData] = useState([]);
  const [rowsDataLength, setDataLength] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [signatoriesList, setSignatoriesList] = useState(false);

  const [reviewAndSignatureStatus, setReviewAndSignatureStatus] = useState([]);
  const [defaultreviewAndSignatureStatus, setDefaultReviewAndSignatureStatus] =
    useState([]);
  const [fileNameSort, setFileNameSort] = useState(null);
  const [signatoriesSort, setSignatoriesSort] = useState(null);
  const [statusSort, setStatusSort] = useState(null);
  const [sentOnSort, setSentOnSort] = useState(null);

  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      // Column for file name
      title: (
        <>
          <span>
            {t("File-name")}
            {fileNameSort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "fileName",
      key: "fileName",
      className: "nameParticipant",
      align: "left",
      ellipsis: true,
      width: 200,
      sortDirections: ["ascend", "descend"],
      sortOrder: "ascend",
      sorter: (a, b) => b.name - a.name, // Custom sorter function for sorting by name
      onHeaderCell: () => ({
        onClick: () => {
          setFileNameSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        return (
          <span
            className='d-flex gap-2 align-items-center cursor-pointer'
            onClick={() => handleClickOpenDoc(record)}>
            <img src={getIconSource(getFileExtension(text))} />
            <p className={styles["fileName_Approvals"]}>{text}</p>
          </span>
        );
      },
    },
    {
      // Column for signatories
      title: (
        <>
          <span>
            {t("Signatories")}
            {fileNameSort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "numberOfSignatories",
      key: "numberOfSignatories",
      className: "signatories",
      ellipsis: true,
      sortOrder: "ascend",
      width: 150,
      align: "center",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => b.name - a.name,
      onHeaderCell: () => ({
        onClick: () => {
          setSignatoriesSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        console.log(
          text,
          record,
          "numberOfSignatoriesnumberOfSignatoriesnumberOfSignatories"
        );
        if (record?.workFlowStatusID === 4) {
          return (
            <span className={styles["status_draft_signatoriesList"]}></span>
          );
        } else {
          return (
            <span
              onClick={() => handleClickSignatoriesList(record)}
              className={
                styles["signatories_vale"]
              }>{` ${text} Signatories`}</span>
          );
        }
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
      render: (text, record) => {
        if (text === "-") {
          return <span className={styles["date_vale"]}>{text}</span>;
        } else {
          return (
            <span className={styles["date_vale"]}>
              {SignatureandPendingApprovalDateTIme(text, CurrentLanguage)}
            </span>
          );
        }
      },
    },
    {
      // Column for status
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,

      className: "statusParticipant",
      filters: reviewAndSignatureStatus,
      onFilter: (value, record) => Number(record.workFlowStatusID) === value,
      filterIcon: () => (
        <ChevronDown className='filter-chevron-icon-todolist' />
      ),
      render: (text, record) => {
        const { workFlowStatusID, status } = record;
        return (
          <p
            className={
              workFlowStatusID === 1
                ? styles["pendingStatus"]
                : workFlowStatusID === 2
                ? styles["signedStatus"]
                : workFlowStatusID === 3
                ? styles["declineStatus"]
                : styles["draftStatus"]
            }>
            {t(status)}
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
        if (Number(record?.workFlowStatusID) === 4) {
          return (
            <img
              src={DeleteIcon}
              className='cursor-pointer'
              onClick={() => deleteSignatureDocument(record)}
            />
          );
        }
      },
    },
  ];

  const handleClickSignatoriesList = (record) => {
    console.log(record, "handleClickSignatoriesListhandleClickSignatoriesList");
    // setSignatureListVal(value);
    // setSignatoriesList(true);
    let Data = { WorkFlowID: record.workFlowID, FileID: record.fileID };
    dispatch(
      getAllSignatoriesStatusWise_Api(navigate, t, Data, setSignatoriesList)
    );
  };

  const handleClickOpenDoc = (record) => {
    let reponseData = JSON.stringify(record.fileID);
    if (Number(record.workFlowStatusID) === 4) {
      window.open(
        `/#/DisKus/signatureviewer?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    } else if (Number(record.workFlowStatusID) === 1) {
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

  const deleteSignatureDocument = (record) => {
    let Data = { WorkFlowID: Number(record?.workFlowID) };
    dispatch(deleteSignatureFlowDocumentApi(navigate, t, Data));
  };

  useEffect(() => {
    if (SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator !== null) {
      try {
        let { signatureFlowDocumentsForCreator, totalCount } =
          SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator;
        if (
          Array.isArray(signatureFlowDocumentsForCreator) &&
          signatureFlowDocumentsForCreator.length > 0
        ) {
          if (isScrolling) {
            setIsScrolling(false);
            setApprovalsData([
              ...signatureFlowDocumentsForCreator,
              ...approvalsData,
            ]);
            if (
              totalCount !== undefined &&
              totalCount !== null &&
              totalCount !== 0
            ) {
              setTotalRecords(totalCount);
            }
            setPageNo((prev) => prev + 1);
            setDataLength(
              (prev) => prev + signatureFlowDocumentsForCreator.length
            );
          } else {
            setApprovalsData(signatureFlowDocumentsForCreator);
            if (
              totalCount !== undefined &&
              totalCount !== null &&
              totalCount !== 0
            ) {
              setTotalRecords(totalCount);
            }
            setPageNo(1);
            setDataLength(signatureFlowDocumentsForCreator.length);
          }
        }
      } catch (error) {
        console.log("Something Went Wrong", error);
        setApprovalsData([]);
        setTotalRecords(0);
        setPageNo(1);

        setDataLength(0);
        setIsScrolling(false);
      }
    } else {
      setIsScrolling(false);
    }
  }, [SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator]);

  useEffect(() => {
    if (
      SignatureWorkFlowReducer.getAllPendingApprovalStatuses !== null &&
      SignatureWorkFlowReducer.getAllPendingApprovalStatuses !== undefined
    ) {
      try {
        const { statusList } =
          SignatureWorkFlowReducer.getAllPendingApprovalStatuses;
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
  }, [SignatureWorkFlowReducer.getAllPendingApprovalStatuses]);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );
  console.log(
    rowsDataLength <= totalRecords,
    totalRecords,
    rowsDataLength,
    "handleScrollhandleScroll"
  );
  const handleScroll = async () => {
    console.log(
      rowsDataLength <= totalRecords,
      totalRecords,
      rowsDataLength,
      "handleScrollhandleScroll"
    );
    if (rowsDataLength <= totalRecords) {
      setIsScrolling(true);
      let Data = { sRow: Number(rowsDataLength), Length: 10 };
      await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
    }
  };
  return (
    <>
      {" "}
      <Row className='mb-2'>
        {approvalsData.length > 0 ? (
          <Col sm={12} md={12} lg={12} className='mt-3'>
            <InfiniteScroll
              dataLength={approvalsData.length}
              next={handleScroll}
              style={{
                overflowX: "hidden",
              }}
              hasMore={approvalsData.length === totalRecords ? false : true}
              height={"58vh"}
              endMessage=''
              loader={
                approvalsData.length <= totalRecords &&
                isScrolling && (
                  <>
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className='d-flex justify-content-center mt-2'>
                        <Spin indicator={antIcon} />
                      </Col>
                    </Row>
                  </>
                )
              }>
              <TableToDo
                sortDirections={["descend", "ascend"]}
                column={pendingApprovalColumns}
                className={"ApprovalsTable"}
                // prefClassName="ApprovalSending"
                rows={approvalsData}
                pagination={false}
                showHeader={true}
                id={(record, index) =>
                  index === approvalsData.length - 1 ? "last-row-class" : ""
                }
              />
            </InfiniteScroll>
          </Col>
        ) : (
          <Col
            sm={12}
            md={12}
            lg={12}
            className='d-flex justify-content-center align-items-center mt-2'>
            <section className={styles["ApprovalSend_emptyContainer"]}>
              <img className='d-flex justify-content-center' src={EmtpyImage} />
              <span className={styles["emptyState_title"]}>
                {t("Submit-document-for-approval")}
              </span>
              <span className={styles["emptyState_tagline"]}>
                {t(
                  "Ready-to-send-a-document-for-approval-this-tab-awaits-your-next-submission"
                )}
                !
              </span>
            </section>
          </Col>
        )}
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
