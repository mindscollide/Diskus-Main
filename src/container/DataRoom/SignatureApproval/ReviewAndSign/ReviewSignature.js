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
import useSnackbar from "../../../../components/elements/snack_bar/useSnackbar";
import { convertToArabicNumerals } from "../../../../commen/functions/regex";
import { Checkbox, Dropdown, Menu } from "antd";
import SignatoriesListModal from "../ApprovalSend/SignatoriesList/SignatoriesListModal";
import { useTableScrollBottom } from "../../../../commen/functions/useTableScrollBottom";
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
  const workflowResponseMessage = useSelector((state) => state.webViewer);
  const globalState = useSelector((state) => state);

  const workflowsignaturedocument = useSelector(
    (state) => state.SignatureWorkFlowReducer.workflowsignaturedocument,
  );

  const workflowsignaturedocumentActionByMe = useSelector(
    (state) =>
      state.SignatureWorkFlowReducer.workflowsignaturedocumentActionByMe,
  );

  const signatureDocumentStatusChangeForSignees = useSelector(
    (state) =>
      state.SignatureWorkFlowReducer.signatureDocumentStatusChangeForSignees,
  );

  const signeeCounterData = useSelector(
    (state) => state.SignatureWorkFlowReducer.signeeCounterData,
  );

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
  const [originalData, setOriginalData] = useState([]);
  const [signatoriesList, setSignatoriesList] = useState(false);

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");
  const docSignAction = localStorage.getItem("docSignAction");
  const docSignedAction = localStorage.getItem("docSignedAction");

  const [show, SnackBar] = useSnackbar();
  const [reviewAndSignatureStatus, setReviewAndSignatureStatus] = useState([]);
  const [defaultreviewAndSignatureStatus, setDefaultReviewAndSignatureStatus] =
    useState([]);

  const [totalRecords, setTotalRecords] = useState(null);
  const [totalDataLnegth, setTotalDataLength] = useState(0);
  const [isScrollling, setIsScrolling] = useState(false);
  const [sortFileNameBy, setSortFileNameBy] = useState(null);

  const [sortOrderRequestBy, setSortOrderRequestBy] = useState(null);
  const [sortOrderDateTime, setSortOrderDateTime] = useState(null);

  // Ant Design's Table is in single-column-sort mode here (each `sorter` is
  // a plain function, not {multiple: N}), but each column's sortOrder was
  // being driven by its own independent state with nothing clearing the
  // other two — so sorting Document-name and then clicking Requested-by (or
  // Received-on) left two columns simultaneously "sorted" from antd's point
  // of view, which only honors one. toggleSort always clears the other two
  // sort states whenever a column header is clicked, so exactly one column
  // is ever controlled-sorted at a time.
  const toggleSort = (setter, otherSetters) => () => {
    otherSetters.forEach((otherSetter) => otherSetter(null));
    setter((order) => {
      if (order === "descend") return "ascend";
      if (order === "ascend") return null;
      return "descend";
    });
  };
  const [visible, setVisible] = useState(false);
  // selectedValues is the live checkbox state inside the (still open) filter
  // dropdown; appliedStatusFilter is what the table is actually filtered by
  // and only changes when "Ok" is clicked (or "Reset") — clicking a checkbox
  // must not touch the table until then.
  const [selectedValues, setSelectedValues] = useState([
    "Pending Signature",
    "Signed",
    "Declined",
  ]);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState([
    "Pending Signature",
    "Signed",
    "Declined",
  ]);

  const filters = [
    { text: t("Signature-pending"), value: "Pending Signature" },
    { text: t("Signed"), value: "Signed" },
    { text: t("Declined"), value: "Declined" },
  ];

  useEffect(() => {
    if (signeeCounterData) {
      // MQTT data has arrived – update the approvalStats state with the live counts
      setApprovalStats(signeeCounterData);
    }
  }, [signeeCounterData]);

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
        `/Diskus/signeddocument?documentID=${encodeURIComponent(reponseData)}`,
        "_blank",
        "noopener noreferrer",
      );
    } else {
      let reponseData = JSON.stringify(record.fileID);
      window.open(
        `/Diskus/viewSignDocument?documentID=${encodeURIComponent(
          reponseData,
        )}`,
        "_blank",
        "noopener noreferrer",
      );
    }
  };

  //Filteration Table

  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)],
    );
  };

  // reviewSignature is a pure derived view of originalData filtered by
  // appliedStatusFilter (see the effect below) — commits the checkbox
  // selection to the table only now, on Ok. Previously this recomputed
  // reviewSignature by hand, which was fine until the next scroll-triggered
  // page came in and overwrote it with unfiltered data (see the
  // listOfPendingForApprovalSignatures effect).
  const handleApplyFilter = () => {
    setAppliedStatusFilter(selectedValues);
    setVisible(false);
  };

  const resetFilter = () => {
    const defaultValues = ["Pending Signature", "Signed", "Declined"];
    setSelectedValues(defaultValues);
    setAppliedStatusFilter(defaultValues);
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
          onClick={() => handleMenuClick(filter.value)}
        >
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className="d-flex gap-3 align-items-center justify-content-center">
        <Button
          text={t("Reset")}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text={t("Ok")}
          disableBtn={selectedValues.length === 0}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  const handleClickSignatoriesList = (record) => {
    // setSignatureListVal(value);
    // setSignatoriesList(true);
    let Data = { WorkFlowID: record.workFlowID, FileID: record.fileID };
    dispatch(
      getAllSignatoriesStatusWise_Api(navigate, t, Data, setSignatoriesList),
    );
  };

  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      title: (
        <>
          <span className="d-flex  gap-2 align-items-center">
            {t("Document-name")}
            {sortFileNameBy === "descend" ? (
              <img src={DescendIcon} alt="" />
            ) : (
              <img src={AscendIcon} alt="" />
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
      sortOrder: sortFileNameBy,
      onHeaderCell: () => ({
        onClick: toggleSort(setSortFileNameBy, [
          setSortOrderRequestBy,
          setSortOrderDateTime,
        ]),
      }),
      render: (text, record) => (
        <p
          className="cursor-pointer m-0 text-truncate d-flex gap-2 align-items-center"
          onClick={() => handleClickOpenSigatureDoc(record)}
        >
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
          <span className="d-flex gap-2 justify-content-center">
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
            className={styles["signatories_vale"]}
          >{` ${text} ${t("Signatories")}`}</span>
        );
      },
    },
    {
      title: (
        <>
          <span className="d-flex justify-content-center gap-2 align-items-center">
            {t("Requested-by")}{" "}
            {sortOrderRequestBy === "descend" ? (
              <img src={DescendIcon} alt="" />
            ) : (
              <img src={AscendIcon} alt="" />
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
      sortOrder: sortOrderRequestBy,
      onHeaderCell: () => ({
        onClick: toggleSort(setSortOrderRequestBy, [
          setSortFileNameBy,
          setSortOrderDateTime,
        ]),
      }),
      render: (text, record) => (
        <span
          className={" d-flex align-items-center gap-2 justify-content-center "}
        >
          <img
            src={`data:image/jpeg;base64,${record.creatorImg}`}
            width={22}
            height={22}
            className="rounded-circle "
            alt=""
          />
          <span>{text}</span>
        </span>
      ),
    },
    {
      title: (
        <>
          <span className="d-flex justify-content-center gap-2 align-items-center">
            {t("Received-on")}{" "}
            {/* Up = latest-to-oldest (antd's "descend" here, since the
            sorter compares createdOn ascending — antd reverses that order
            for "descend", putting the most recent date first), Down =
            oldest-to-latest. This is the opposite of a plain A→Z/Z→A
            up/down convention, but is what a "received on" date column is
            expected to mean: most-recent-first when pointing up. Default
            (unsorted, null) also shows Up, since Up is this column's
            natural/expected starting state. */}
            {sortOrderDateTime === "ascend" ? (
              <img src={ArrowDownIcon} alt="" />
            ) : (
              <img src={ArrowUpIcon} alt="" />
            )}
          </span>
        </>
      ),
      dataIndex: "createdOn",
      key: "createdOn",
      className: "leaveTimeParticipant",
      width: "180px",
      ellipsis: true,
      // Was comparing a.sentOn/b.sentOn — a field this column's own
      // dataIndex/render never used ("createdOn" is what's actually
      // displayed). sentOn being undefined on every row made the comparator
      // always return NaN, which Array.sort() treats as "no change" — the
      // column looked entirely unsortable.
      sorter: (a, b) =>
        utcConvertintoGMT(a.createdOn) - utcConvertintoGMT(b.createdOn),
      sortOrder: sortOrderDateTime,
      onHeaderCell: () => ({
        onClick: toggleSort(setSortOrderDateTime, [
          setSortFileNameBy,
          setSortOrderRequestBy,
        ]),
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
          className="filter-chevron-icon-todolist"
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}
        >
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
            }
          >
            {status?.toLowerCase() === "Pending Signature".toLowerCase()
              ? t("Signature-pending")
              : status?.toLowerCase() === "Signed".toLowerCase()
                ? t("Signed")
                : status?.toLowerCase() === "Declined".toLowerCase()
                  ? t("Declined")
                  : status?.toLowerCase() === "draftStatus".toLowerCase()
                    ? t("draftStatus")
                    : null}
          </p>
        );
      },
    },
  ];

  // const handleScroll = async () => {
  //
  //   if (totalDataLnegth <= totalRecords) {
  //     setIsScrolling(true);
  //     let Data = { sRow: Number(totalDataLnegth), Length: 10 };
  //
  //     await dispatch(getAllPendingApprovalsSignaturesApi(navigate, t, Data));
  //   }
  // };

  // Was comparing reviewSignature.length (the FILTERED, currently-displayed
  // count) against totalRecords (the unfiltered total) — with any filter
  // narrower than "all statuses" those two can never be equal, so scrolling
  // to the bottom of a short filtered list kept re-firing this fetch with
  // the same sRow forever instead of recognizing every page was already
  // loaded. Compare against originalData.length (everything fetched so
  // far, unfiltered) instead.
  useTableScrollBottom(async () => {
    if (originalData.length < totalRecords) {
      setIsScrolling(true);
      let Data = { sRow: Number(totalDataLnegth), Length: 10 };
      await dispatch(getAllPendingApprovalsSignaturesApi(navigate, t, Data));
    }
  });

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
      } catch (error) {}
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

  // originalData is the single source of truth for every record fetched so
  // far (accumulated across scroll pages). reviewSignature — what the table
  // actually renders — is derived from it below, filtered by
  // selectedValues. Previously each of these effects wrote reviewSignature
  // directly (sometimes from originalData, sometimes from the already-
  // filtered reviewSignature itself), so the very next scroll-triggered
  // page load would splice unfiltered records back into the filtered view,
  // or — merging onto reviewSignature instead of originalData — silently
  // drop whatever the active filter had hidden. Only originalData is
  // written here now; the derived effect keeps reviewSignature in sync.
  useEffect(() => {
    if (listOfPendingForApprovalSignatures !== null) {
      try {
        let { pendingApprovals, totalCount } =
          listOfPendingForApprovalSignatures;
        if (Array.isArray(pendingApprovals) && pendingApprovals.length > 0) {
          if (isScrollling) {
            setIsScrolling(false);
            setOriginalData((prev) => [...prev, ...pendingApprovals]);
            setTotalRecords(totalCount);
            setTotalDataLength((prev) => prev + pendingApprovals.length);
          } else {
            setTotalRecords(totalCount);
            setTotalDataLength(pendingApprovals.length);
            setOriginalData(pendingApprovals);
          }
        }
      } catch (error) {}
    }
  }, [listOfPendingForApprovalSignatures]);

  useEffect(() => {
    setReviewSignature(
      originalData.filter((item) =>
        appliedStatusFilter.includes(item.status.toString()),
      ),
    );
  }, [originalData, appliedStatusFilter]);

  useEffect(() => {
    try {
      if (workflowsignaturedocument !== null) {
        const { data } = workflowsignaturedocument;
        let findIfExist = originalData.find(
          (originalDataItem) => originalDataItem.workFlowID === data.workFlowID,
        );

        if (findIfExist === undefined) {
          setOriginalData((prev) => [data, ...prev]);
          setTotalDataLength((prev) => prev + 1);
        }
      }
    } catch (error) {}
  }, [workflowsignaturedocument]);

  useEffect(() => {
    try {
      if (workflowsignaturedocumentActionByMe !== null) {
        const { data } = workflowsignaturedocumentActionByMe;

        setOriginalData((originalDataCopy) =>
          originalDataCopy.map((data2) =>
            data2.workFlowID === data.workFlowID
              ? {
                  ...data2,
                  status: data.status,
                  actorStatusID: data.actorStatusID,
                }
              : data2,
          ),
        );
      }
    } catch (error) {}
  }, [workflowsignaturedocumentActionByMe]);
  useEffect(() => {
    try {
      if (signatureDocumentStatusChangeForSignees !== null) {
        const { data } = signatureDocumentStatusChangeForSignees;
        setOriginalData((originalDataCopy) =>
          originalDataCopy.map((data2) =>
            data2.workFlowID === data.workFlowID
              ? {
                  ...data2,
                  status: data.status,
                  workFlowStatusID: data.workFlowStatusID,
                }
              : data2,
          ),
        );
      }
    } catch (error) {}
  }, [signatureDocumentStatusChangeForSignees]);

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
                  }}
                >
                  <ProgressBar
                    style={{
                      backgroundColor: "#55ce5c",
                    }}
                    label={`${convertToArabicNumerals(
                      approvalStats.signedPercentage,
                      currentLanguage,
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
                      currentLanguage,
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
                      currentLanguage,
                    )}%`}
                    now={approvalStats.declinedPercentage}
                    key={3}
                  />
                </ProgressBar>
              </Col>
              <Col lg={6} md={6} sm={12} className="d-flex">
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-signed"]}>
                  <span className={styles["numeric-value"]}>
                    {convertToArabicNumerals(
                      approvalStats.signed,
                      currentLanguage,
                    )}
                  </span>
                  <span className={styles["value"]}>{t("Signed")}</span>
                </div>
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-pending"]}>
                  <span className={styles["numeric-value"]}>
                    {convertToArabicNumerals(
                      approvalStats.pending,
                      currentLanguage,
                    )}
                  </span>
                  <span className={styles["value"]}>{t("Pending")}</span>
                </div>
                <span className={styles["line"]} />
                <div className={styles["progress-value-wrapper-decline"]}>
                  <span className={styles["numeric-value"]}>
                    {convertToArabicNumerals(
                      approvalStats.declined,
                      currentLanguage,
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
          {/* <InfiniteScroll
            dataLength={reviewSignature.length}
            next={handleScroll}
            hasMore={reviewSignature.length === totalRecords ? false : true}
            style={{
              overflowX: "hidden",
            }}
            height={"50vh"}
          > */}
          <TableToDo
            column={pendingApprovalColumns}
            className={"PendingApprovalsTable"}
            locale={{
              emptyText: (
                <>
                  <section className="d-flex flex-column align-items-center justify-content-center mt-3">
                    <img
                      src={ReviewSignatureEmptyImage}
                      width={"250px"}
                      alt=""
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
            scroll={{ y: "43vh", x: "100%" }}
            pagination={false}
            id={(record, index) =>
              index === reviewSignature.length - 1 ? "last-row-class" : ""
            }
          />
          {/* </InfiniteScroll> */}
          {/* )} */}
        </Col>
      </Row>{" "}
      {signatoriesList && (
        <SignatoriesListModal
          signatories_List={signatoriesList}
          setSignatoriesList={setSignatoriesList}
        />
      )}
      {SnackBar}
    </>
  );
};

export default ReviewSignature;
