import React, { useEffect, useState } from "react";
import { Col, Row, ProgressBar } from "react-bootstrap";
import styles from "./ReviewSignature.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import DescendIcon from "../../../MinutesNewFlow/Images/SorterIconDescend.png";
import AscendIcon from "../../../MinutesNewFlow/Images/SorterIconAscend.png";
import ArrowDownIcon from "../../../MinutesNewFlow/Images/Arrow-down.png";
import ArrowUpIcon from "../../../MinutesNewFlow/Images/Arrow-up.png";
import { ChevronDown } from "react-bootstrap-icons";
import ReviewSignatureEmptyImage from "../../../../assets/images/Review&Sign_EmptyState.png";
import {
  Button,
  Notification,
  TableToDo,
} from "../../../../components/elements";
import {
  getFileExtension,
  getIconSource,
} from "../../SearchFunctionality/option";
import { useNavigate } from "react-router-dom";
import {
  clearWorkFlowResponseMessage,
  getAllPendingApprovalStatusApi,
  getAllPendingApprovalsSignaturesApi,
  getAllPendingApprovalsStatsApi,
  getAllSignatoriesStatusWise_Api,
  validateEncryptedStringSignatureDataApi,
} from "../../../../store/actions/workflow_actions";
import { useSelector } from "react-redux";
import {
  SignatureandPendingApprovalDateTIme,
  utcConvertintoGMT,
} from "../../../../commen/functions/date_formater";
import InfiniteScroll from "react-infinite-scroll-component";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
import { convertToArabicNumerals } from "../../../../commen/functions/regex";
import { Checkbox, Dropdown, Menu } from "antd";
import SignatoriesListModal from '../ApprovalSend/SignatoriesList/SignatoriesListModal'
const ReviewSignature = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const {
    getAllPendingForApprovalStats,
    listOfPendingForApprovalSignatures,
    getAllPendingApprovalStatuses,
    ResponseMessage,
  } = useSelector((state) => state.SignatureWorkFlowReducer);
  const workflowsignaturedocument = useSelector(
    (state) => state.SignatureWorkFlowReducer.workflowsignaturedocument
  );

  const workflowsignaturedocumentActionByMe = useSelector(
    (state) =>
      state.SignatureWorkFlowReducer.workflowsignaturedocumentActionByMe
  );

  const signatureDocumentStatusChangeForSignees = useSelector(
    (state) =>
      state.SignatureWorkFlowReducer.signatureDocumentStatusChangeForSignees
  );
  console.log(
    signatureDocumentStatusChangeForSignees,
    "signatureDocumentStatusChangeForSigneessignatureDocumentStatusChangeForSignees"
  );
  // signatureDocumentStatusChangeForSignees
  const navigate = useNavigate();
  const [approvalStats, setApprovalStats] = useState({
    declined: 0,
    declinedPercentage: 0,
    pending: 0,
    pendingPercentage: 0,
    signed: 0,
    signedPercentage: 0,
  });
  console.log(approvalStats, "approvalStatsapprovalStats");
  const [reviewSignature, setReviewSignature] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [signatoriesList, setSignatoriesList] = useState(false);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");
  const docSignAction = localStorage.getItem("docSignAction");
  const docSignedAction = localStorage.getItem("docSignedAction");

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [reviewAndSignatureStatus, setReviewAndSignatureStatus] = useState([]);
  const [defaultreviewAndSignatureStatus, setDefaultReviewAndSignatureStatus] =
    useState([]);

  const [totalRecords, setTotalRecords] = useState(null);
  const [totalDataLnegth, setTotalDataLength] = useState(0);
  const [isScrollling, setIsScrolling] = useState(false);
  const [sortFileNameBy, setSortFileNameBy] = useState(null);

  const [sortOrderRequestBy, setSortOrderRequestBy] = useState(null);
  const [sortOrderDateTime, setSortOrderDateTime] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([
    "Pending Signature",
    "Signed",
    "Declined",
  ]);

  const filters = [
    { text: t("Pending"), value: "Pending Signature" },
    { text: t("Signed"), value: "Signed" },
    { text: t("Declined"), value: "Declined" },
  ];

  useEffect(() => {
    const callFunc = async () => {
      await dispatch(getAllPendingApprovalsStatsApi(navigate, t));
      let newData = { IsCreator: false };
      await dispatch(getAllPendingApprovalStatusApi(navigate, t, newData, 1));
    };
    callFunc();
  }, []);

  useEffect(() => {
    if (docSignAction !== null) {
      let Data = {
        EncryptedString: docSignAction,
      };
      dispatch(validateEncryptedStringSignatureDataApi(Data, navigate, t, 1));
    }
  }, [docSignAction]);

  useEffect(() => {
    if (docSignedAction !== null) {
      let Data = {
        EncryptedString: docSignedAction,
      };
      dispatch(validateEncryptedStringSignatureDataApi(Data, navigate, t, 2));
    }
  }, [docSignedAction]);

  const handleClickOpenSigatureDoc = (record) => {
    if (record.status === "Pending Signature") {
      let reponseData = JSON.stringify(record.fileID);
      window.open(
        `/#/Diskus/signeddocument?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    } else {
      let reponseData = JSON.stringify(record.fileID);
      window.open(
        `/#/Diskus/viewSignDocument?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  //Filteration Table

  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  console.log(originalData, "originalDataoriginalDataoriginalData");

  const handleApplyFilter = () => {
    const filteredData = originalData.filter((item) =>
      selectedValues.includes(item.status.toString())
    );
    setReviewSignature(filteredData);
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(["Pending Signature", "Signed", "Declined"]);
    setReviewSignature(originalData);
    setVisible(false);
  };

  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}>
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex gap-3 align-items-center justify-content-center'>
        <Button
          text={"Reset"}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text={"Ok"}
          disableBtn={selectedValues.length === 0}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  const handleClickSignatoriesList = (record) => {
    console.log(record, "handleClickSignatoriesListhandleClickSignatoriesList");
    // setSignatureListVal(value);
    // setSignatoriesList(true);
    let Data = { WorkFlowID: record.workFlowID, FileID: record.fileID };
    dispatch(
      getAllSignatoriesStatusWise_Api(navigate, t, Data, setSignatoriesList)
    );
  };

  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      title: (
        <>
          <span className='d-flex  gap-2 align-items-center'>
            {t("Document-name")}
            {sortFileNameBy === "descend" ? (
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
      width: "300px",
      align: "start",
      ellipsis: true,
      sorter: (a, b) =>
        a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase()),
      onHeaderCell: () => ({
        onClick: () => {
          setSortFileNameBy((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p
          className='cursor-pointer m-0 text-truncate d-flex gap-2 align-items-center'
          onClick={() => handleClickOpenSigatureDoc(record)}>
          <img
            width={"25px"}
            height={"25px"}
            src={getIconSource(getFileExtension(text))}
          />
          <span>{text}</span>
        </p>
      ),
    },
    {
      // Column for signatories
      title: (
        <>
          <span className='d-flex gap-2 justify-content-center'>
            {t("Signatories")}
          </span>
        </>
      ),
      dataIndex: "numberOfSignatories",
      key: "numberOfSignatories",
      ellipsis: true,
      width: "20%",
      align: "center",

      render: (text, record) => {
        return (
          <span
            onClick={() => handleClickSignatoriesList(record)}
            className={
              styles["signatories_vale"]
            }>{` ${text} Signatories`}</span>
        );
      },
    },
    {
      title: (
        <>
          <span className='d-flex justify-content-center gap-2 align-items-center'>
            {t("Requested-by")}{" "}
            {sortOrderRequestBy === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
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
        <span
          className={
            " d-flex align-items-center gap-2 justify-content-center "
          }>
          <img
            src={`data:image/jpeg;base64,${record.creatorImg}`}
            width={22}
            height={22}
            className='rounded-circle '
            alt=''
          />
          <span>{text}</span>
        </span>
      ),
    },
    {
      title: (
        <>
          <span className='d-flex justify-content-center gap-2 align-items-center'>
            {t("Sent-on")}{" "}
            {sortOrderDateTime === "descend" ? (
              <img src={ArrowUpIcon} alt='' />
            ) : (
              <img src={ArrowDownIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "createdOn",
      key: "createdOn",
      className: "leaveTimeParticipant",
      width: "180px",
      ellipsis: true,
      sorter: (a, b) =>
        utcConvertintoGMT(a.sentOn) - utcConvertintoGMT(b.sentOn),
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
        <p className={"m-0"}>
          {SignatureandPendingApprovalDateTIme(text, CurrentLanguage)}
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
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown
          className='filter-chevron-icon-todolist'
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}>
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        const { actorStatusID, status } = record;
        return (
          <p
            className={
              status?.toLowerCase() === "Pending Signature".toLowerCase()
                ? styles["pendingStatus"]
                : status?.toLowerCase() === "Signed".toLowerCase()
                ? styles["signedStatus"]
                : status?.toLowerCase() === "Declined".toLowerCase()
                ? styles["declineStatus"]
                : styles["draftStatus"]
            }>
            {status?.toLowerCase() === "Pending Signature".toLowerCase()
              ? t("Signature-pending")
              : status}
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
            setOriginalData([...pendingApprovals, ...reviewSignature]);
            setTotalRecords(totalCount);
            setTotalDataLength((prev) => prev + pendingApprovals.length);
          } else {
            setTotalRecords(totalCount);
            setTotalDataLength(pendingApprovals.length);

            setReviewSignature(pendingApprovals);
            setOriginalData(pendingApprovals);
          }
        }
      } catch (error) {}
    }
  }, [listOfPendingForApprovalSignatures]);

  useEffect(() => {
    try {
      if (workflowsignaturedocument !== null) {
        const { data } = workflowsignaturedocument;
        let findIfExist = reviewSignature.find(
          (reviewSignatureData, index) =>
            reviewSignatureData.workFlowID === data.workFlowID
        );
        console.log(findIfExist, "findIfExistfindIfExist");
        if (findIfExist === undefined) {
          setReviewSignature([data, ...reviewSignature]);
          setOriginalData([data, originalData]);
          // setTotalRecords(totalCount);
          setTotalDataLength((prev) => prev + 1);
        }
      }
    } catch (error) {}
  }, [workflowsignaturedocument]);

  useEffect(() => {
    try {
      if (workflowsignaturedocumentActionByMe !== null) {
        const { data } = workflowsignaturedocumentActionByMe;
        setReviewSignature((reviewSignatureCopy) =>
          reviewSignatureCopy.map((data2) =>
            data2.workFlowID === data.workFlowID
              ? {
                  ...data2,
                  status: data.status,
                  actorStatusID: data.actorStatusID,
                }
              : data2
          )
        );
      }
    } catch (error) {
      console.error("Error updating review signature data:", error);
    }
  }, [workflowsignaturedocumentActionByMe]);
  useEffect(() => {
    try {
      if (signatureDocumentStatusChangeForSignees !== null) {
        const { data } = signatureDocumentStatusChangeForSignees;
        setReviewSignature((reviewSignatureCopy) =>
          reviewSignatureCopy.map((data2) =>
            data2.workFlowID === data.workFlowID
              ? {
                  ...data2,
                  status: data.status,
                  workFlowStatusID: data.workFlowStatusID,
                }
              : data2
          )
        );
      }
    } catch (error) {
      console.error("Error updating review signature data:", error);
    }
  }, [signatureDocumentStatusChangeForSignees]);

  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== null &&
      ResponseMessage !== undefined
    ) {
      showMessage(ResponseMessage, "error", setOpen);
      dispatch(clearWorkFlowResponseMessage());
    }
  }, [ResponseMessage]);
  console.log(reviewSignature, "reviewSignaturereviewSignature");
  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className={styles["progressWrapper"]}>
            <Row>
              <Col lg={6} md={6} sm={12}>
                <ProgressBar
                  style={{
                    height: "30px",
                    borderRadius: "20px",
                  }}>
                  <ProgressBar
                    style={{
                      backgroundColor: "#55ce5c",
                    }}
                    label={`${convertToArabicNumerals(
                      approvalStats.signedPercentage,
                      currentLanguage
                    )}%`}
                    now={approvalStats.signedPercentage}
                    key={1}
                  />
                  <ProgressBar
                    style={{
                      backgroundColor: "#ffc300",
                    }}
                    label={`${convertToArabicNumerals(
                      approvalStats.pendingPercentage,
                      currentLanguage
                    )}%`}
                    now={approvalStats.pendingPercentage}
                    key={2}
                  />
                  <ProgressBar
                    style={{
                      backgroundColor: "#F16B6B",
                    }}
                    label={`${convertToArabicNumerals(
                      approvalStats.declinedPercentage,
                      currentLanguage
                    )}%`}
                    now={approvalStats.declinedPercentage}
                    key={3}
                  />
                </ProgressBar>
              </Col>
              <Col lg={6} md={6} sm={12} className='d-flex'>
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-signed"]}>
                  <span className={styles["numeric-value"]}>
                    {convertToArabicNumerals(
                      approvalStats.signed,
                      currentLanguage
                    )}
                  </span>
                  <span className={styles["value"]}>{t("Signed")}</span>
                </div>
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-pending"]}>
                  <span className={styles["numeric-value"]}>
                    {convertToArabicNumerals(
                      approvalStats.pending,
                      currentLanguage
                    )}
                  </span>
                  <span className={styles["value"]}>{t("Pending")}</span>
                </div>
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-decline"]}>
                  <span className={styles["numeric-value"]}>
                    {convertToArabicNumerals(
                      approvalStats.declined,
                      currentLanguage
                    )}
                  </span>
                  <span className={styles["value"]}>{t("Declined")}</span>
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
            height={"50vh"}>
            <TableToDo
              sortDirections={["descend", "ascend"]}
              column={pendingApprovalColumns}
              className={"PendingApprovalsTable"}
              sticky={true}
              showHeader={true}
              locale={{
                emptyText: (
                  <>
                    <section className='d-flex flex-column align-items-center justify-content-center mt-3'>
                      <img
                        src={ReviewSignatureEmptyImage}
                        width={"250px"}
                        alt=''
                      />
                      <span className={styles["ReviewMinutes_emptyTitle"]}>
                        {t("No-document-to-review")}
                      </span>
                      <span className={styles["ReviewMinutes_emptyTitle_tag"]}>
                        {t("No-document-awaiting-review-and-signature")}
                      </span>
                    </section>
                  </>
                ),
              }}
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
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
      {signatoriesList && (
        <SignatoriesListModal
          signatories_List={signatoriesList}
          setSignatoriesList={setSignatoriesList}
        />
      )}
    </>
  );
};

export default ReviewSignature;
