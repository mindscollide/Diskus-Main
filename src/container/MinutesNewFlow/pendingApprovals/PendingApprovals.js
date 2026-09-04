import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Row, Col, ProgressBar } from "react-bootstrap";
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
import { Button, TableToDo } from "../../../components/elements"; // Importing custom components
import { ChevronDown } from "react-bootstrap-icons"; //Bootstrap Icon
import DescendIcon from "./../Images/SorterIconDescend.png";
import AscendIcon from "./../Images/SorterIconAscend.png";
import ArrowDownIcon from "./../Images/Arrow-down.png";
import ArrowUpIcon from "./../Images/Arrow-up.png";
import NoApprovals from "./../Images/No-Approvals.png";
import ReviewSignature from "../../DataRoom/SignatureApproval/ReviewAndSign/ReviewSignature";
import {
  validateEncryptedMinutesReviewerApi,
  validateEncryptedMinutesReviewer_clear,
} from "../../../store/actions/workflow_actions";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import { convertToArabicNumerals } from "../../../commen/functions/regex";
import { Checkbox, Dropdown, Menu } from "antd";
import { MeetingContext } from "../../../context/MeetingContext";
import { useTableScrollBottom } from "../../../commen/functions/useTableScrollBottom";

const DEFAULT_PENDING_APPROVALS_PAGE = { sRow: 0, Length: 10 };
const PENDING_APPROVALS_PAGE_LENGTH = 10;

// Functional component for pending approvals section
const PendingApproval = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook
  const GetMinuteReviewPendingApprovalsByReviewerIdData = useSelector(
    (state) =>
      state.MinutesReducer.GetMinuteReviewPendingApprovalsByReviewerIdData,
  );
  const GetMinuteReviewPendingApprovalsStatsByReviewerIdData = useSelector(
    (state) =>
      state.MinutesReducer.GetMinuteReviewPendingApprovalsStatsByReviewerIdData,
  );
  const PendingApprovalCountDataData = useSelector(
    (state) => state.MinutesReducer.PendingApprovalCountData,
  );

  const getMinutesReviewerData = useSelector(
    (state) =>
      state.SignatureWorkFlowReducer.validateEncryptedStringMinuteReviewData,
  );

  //Getting current Language
  let lang = localStorage.getItem("i18nextLng");

  // State for tracking the active state of each button
  const [reviewMinutesActive, setReviewMinutesActive] = useState(true); // Default Review Minutes button to active
  const [reviewAndSignActive, setReviewAndSignActive] = useState(false);
  const [progress, setProgress] = useState([]);

  const { setPendingApprovalTabCount, pendingApprovalsTabCount } =
    useContext(MeetingContext);

  const [sortOrderMeetingTitle, setSortOrderMeetingTitle] = useState(null);
  const [sortOrderReviewRequest, setSortOrderReviewRequest] = useState(null);
  const [sortOrderLeaveDateTime, setSortOrderLeaveDateTime] = useState(null);
  const [rowsPendingApproval, setRowsPendingApproval] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isScrollingMinutes, setIsScrollingMinutes] = useState(false);

  const docSignAction = localStorage.getItem("docSignAction");
  const docSignedAction = localStorage.getItem("docSignedAction");
  // selectedValues is the live checkbox state inside the (still open) filter
  // dropdown; appliedStatusFilter is what the table is actually filtered by
  // and only changes when "Ok" is clicked (or "Reset") — clicking a checkbox
  // must not touch the table until then.
  const [selectedValues, setSelectedValues] = useState([
    "Reviewed",
    "Pending",
    "Expired",
  ]);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState([
    "Reviewed",
    "Pending",
    "Expired",
  ]);

  const filters = [
    { text: t("Reviewed"), value: "Reviewed" },
    { text: t("Pending"), value: "Pending" },
    { text: t("Expired"), value: "Expired" },
  ];

  // Click handler for Review Minutes button
  const handleReviewMinutesClick = async () => {
    let Data = DEFAULT_PENDING_APPROVALS_PAGE;
    await dispatch(
      GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t),
    );
    await dispatch(
      GetMinuteReviewPendingApprovalsByReviewerId(navigate, t, Data, "", {}),
    );
    setReviewMinutesActive(true); // Set Review Minutes button to active
    setReviewAndSignActive(false); // Set Review & Sign button to inactive
    // Your functionality for Review Minutes button
  };

  // Click handler for Review & Sign button
  const handleReviewAndSignClick = async () => {
    // let Data = { sRow: 0, Length: 10 };
    // await dispatch(getAllPendingApprovalsSignaturesApi(navigate, t, Data));

    setReviewMinutesActive(false); // Set Review Minutes button to inactive
    setReviewAndSignActive(true); // Set Review & Sign button to active
    // Your functionality for Review & Sign button
  };

  //Filteration Table

  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)],
    );
  };

  // rowsPendingApproval is a pure derived view of originalData filtered by
  // appliedStatusFilter (see the effect below) — commits the checkbox
  // selection to the table only now, on Ok. Previously this recomputed
  // rowsPendingApproval by hand, which only ever covered the single page
  // (Length: 10) fetched on mount — there was no scroll-triggered
  // pagination at all, so a filter could never show more than whatever
  // matched inside that first page, and reaching the end of that short
  // filtered list looked like the scrollbar being "stuck" (there was
  // nothing more to fetch on scroll — see useTableScrollBottom below,
  // which is new).
  const handleApplyFilter = () => {
    setAppliedStatusFilter(selectedValues);
    setVisible(false);
  };

  const resetFilter = () => {
    const defaultValues = ["Reviewed", "Pending", "Expired"];
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
          onClick={() => handleMenuClick(filter.value)}>
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex gap-3 align-items-center justify-content-center'>
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

  // Ant Design's Table is in single-column-sort mode here (each `sorter` is
  // a plain function, not {multiple: N}), but each column's sortOrder was
  // driven by its own independent state with nothing clearing the other
  // two — so sorting one column and then clicking another left two columns
  // simultaneously "sorted" from antd's point of view, which only honors
  // one. Clearing the other two sort states on every click keeps exactly
  // one column controlled-sorted at a time.
  const toggleSort = (setter, otherSetters = []) => () => {
    otherSetters.forEach((otherSetter) => otherSetter(null));
    setter((order) => {
      if (order === "descend") return "ascend";
      if (order === "ascend") return null;
      return "descend";
    });
  };

  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      title: (
        <>
          <span>
            {t("Meeting-title")}{" "}
            {sortOrderMeetingTitle === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "title",
      key: "title",
      align: lang === "en" ? "left" : "right",
      className: "nameParticipant",
      width: "200px",
      ellipsis: true,
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      sortOrder: sortOrderMeetingTitle,
      onHeaderCell: () => ({
        onClick: toggleSort(setSortOrderMeetingTitle, [
          setSortOrderReviewRequest,
          setSortOrderLeaveDateTime,
        ]),
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
          }>
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
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "requestedBy",
      key: "requestedBy",
      className: "emailParticipant",
      width: "180px",
      align: "center",
      ellipsis: true,
      sorter: (a, b) =>
        a.requestedBy.toLowerCase().localeCompare(b.requestedBy.toLowerCase()),
      sortOrder: sortOrderReviewRequest,
      onHeaderCell: () => ({
        onClick: toggleSort(setSortOrderReviewRequest, [
          setSortOrderMeetingTitle,
          setSortOrderLeaveDateTime,
        ]),
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
              <img src={ArrowDownIcon} alt='' />
            ) : (
              <img src={ArrowUpIcon} alt='' />
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
      sortOrder: sortOrderLeaveDateTime,
      onHeaderCell: () => ({
        onClick: toggleSort(setSortOrderLeaveDateTime, [
          setSortOrderMeetingTitle,
          setSortOrderReviewRequest,
        ]),
      }),
      render: (text, record) => (
        <p className={record.status === "Expired" ? "opacity-25 m-0" : "m-0"}>
          {newDateFormatterForMinutesPendingApproval(text, lang)}
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
      render: (text, record) => (
        <p
          className={
            text === "Expired"
              ? styles["expiredStatus"]
              : text === "Pending"
                ? styles["pendingStatus"]
                : styles["reviewedStatus"]
          }>
          {text === "Expired"
            ? t("Expired")
            : text === "Pending"
              ? t("Pending")
              : t("Reviewed")}
        </p>
      ),
    },
  ];

  const reviewMinutesLink = localStorage.getItem("reviewMinutesLink");

  useEffect(() => {
    let Data = DEFAULT_PENDING_APPROVALS_PAGE;
    dispatch(GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t));
    dispatch(GetMinuteReviewPendingApprovalsByReviewerId(navigate, t, Data, "", {}));
    // Notification Click Rendering if Clicked on Notification Added you as Reviewer
    if (JSON.parse(localStorage.getItem("MinutesOperations")) === true) {
      dispatch(reviewMinutesPage(true));
      dispatch(pendingApprovalPage(false));
    }
  }, []);

  useEffect(() => {
    if (reviewMinutesLink !== null) {
      let Data = { EncryptedString: reviewMinutesLink };
      dispatch(validateEncryptedMinutesReviewerApi(Data, navigate, t));
    }
  }, [reviewMinutesLink]);
  useEffect(() => {
    if (docSignAction !== null || docSignedAction !== null) {
      setReviewMinutesActive(false); // Set Review Minutes button to inactive
      setReviewAndSignActive(true); // Set Review & Sign button to active
    }
  }, [docSignAction, docSignedAction]);

  useEffect(() => {
    try {
      if (getMinutesReviewerData !== null) {
        const { data } = getMinutesReviewerData;
        if (data.status !== "Expired") {
          let record = {
            title: data.title,
            workFlowID: data.workFlowId,
            meetingID: data.meetingId,
            status: data.status,
            statusID: data.workFlowStatusId,
            deadline: data.deadline,
            isMinutePublished: false,
          };
          dispatch(reviewMinutesPage(true));
          dispatch(pendingApprovalPage(false));
          dispatch(currentMeetingMinutesToReview(record));
        }
        localStorage.removeItem("");
        dispatch(validateEncryptedMinutesReviewer_clear());
      }
    } catch (error) {}
  }, [getMinutesReviewerData]);

  // originalData accumulates every page fetched so far (unfiltered);
  // rowsPendingApproval — what the table renders — is derived from it below,
  // filtered by selectedValues. Previously this always REPLACED both with
  // just the latest page, so a scroll-triggered fetch of page 2 would wipe
  // out page 1 instead of appending to it.
  useEffect(() => {
    if (
      GetMinuteReviewPendingApprovalsByReviewerIdData !== null &&
      GetMinuteReviewPendingApprovalsByReviewerIdData !== undefined &&
      GetMinuteReviewPendingApprovalsByReviewerIdData.length !== 0
    ) {
      let reducerDataRow =
        GetMinuteReviewPendingApprovalsByReviewerIdData.pendingReviews;
      if (isScrollingMinutes) {
        setIsScrollingMinutes(false);
        setOriginalData((prev) => [...prev, ...(reducerDataRow || [])]);
      } else {
        setOriginalData(reducerDataRow || []);
      }
    } else {
      setOriginalData([]);
    }
  }, [GetMinuteReviewPendingApprovalsByReviewerIdData]);

  useEffect(() => {
    setRowsPendingApproval(
      originalData.filter((item) =>
        appliedStatusFilter.includes(item.status.toString()),
      ),
    );
  }, [originalData, appliedStatusFilter]);

  // The stats endpoint's three counts already sum to the true total record
  // count, so it's used here instead of requiring a totalCount field from
  // the paginated list endpoint itself. Fetches the next Length:10 page
  // once the table is scrolled to the bottom, as long as there's more data
  // than what's been loaded so far — mirrors the same pattern already used
  // by ReviewSignature.js (the Review & Sign tab) for its own pagination.
  const totalMinutesRecords =
    (progress.reviewed || 0) + (progress.pending || 0) + (progress.expired || 0);

  useTableScrollBottom(async () => {
    if (!reviewMinutesActive) return;
    if (originalData.length < totalMinutesRecords) {
      setIsScrollingMinutes(true);
      let Data = { sRow: originalData.length, Length: PENDING_APPROVALS_PAGE_LENGTH };
      await dispatch(
        GetMinuteReviewPendingApprovalsByReviewerId(navigate, t, Data, "", {}),
      );
    }
  });

  useEffect(() => {
    try {
      if (PendingApprovalCountDataData !== null) {
        const { pendingMinuteReviews, pendingSignatures } =
          PendingApprovalCountDataData;

        setPendingApprovalTabCount({
          pendingMinutes: pendingMinuteReviews,
          pendingSignature: pendingSignatures,
        });
      }
    } catch (error) {}
  }, [PendingApprovalCountDataData]);

  useEffect(() => {
    if (
      GetMinuteReviewPendingApprovalsStatsByReviewerIdData !== null &&
      GetMinuteReviewPendingApprovalsStatsByReviewerIdData !== undefined &&
      GetMinuteReviewPendingApprovalsStatsByReviewerIdData.length !== 0
    ) {
      let reducerData =
        GetMinuteReviewPendingApprovalsStatsByReviewerIdData.data;
      setProgress(reducerData);
    } else {
      setProgress({
        expired: 0,
        expiredPercentage: 0,
        pending: 0,
        pendingPercentage: 0,
        reviewed: 0,
        reviewedPercentage: 0,
      });
    }
  }, [GetMinuteReviewPendingApprovalsStatsByReviewerIdData]);

  return (
    <section className={styles["pendingApprovalContainer"]}>
      {" "}
      {/* Container for pending approval section */}
      <Row className='mb-2 d-flex align-items-center'>
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {t("Pending-approval")}{" "}
            {/* Translation for pending approval heading */}
          </span>
        </Col>
      </Row>
      <span className={styles["pendingApprovalPaper"]}>
        {/* Paper component for styling */}
        <Row>
          <Col>
            <div className={styles["overallGap"]}>
              {/* Buttons for reviewing minutes */}
              <Button
                text={t("Review-minutes")}
                icon={pendingApprovalsTabCount.pendingMinutes}
                iconClass={
                  reviewMinutesActive === false &&
                  pendingApprovalsTabCount.pendingMinutes !== 0
                    ? styles["pendingCountValue"]
                    : styles["pendingCountValue_hidden"]
                }
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
                  text={t("Review-&-sign")}
                  icon={pendingApprovalsTabCount.pendingSignature}
                  // iconClass={styles["pendingSignatureValue"]}
                  iconClass={
                    pendingApprovalsTabCount.pendingSignature !== 0 &&
                    !reviewAndSignActive
                      ? styles["pendingSignatureValue"]
                      : styles["pendingSignatureValue_hidden"]
                  }
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
                            backgroundColor: "#6172D6",
                          }}
                          label={`${convertToArabicNumerals(
                            progress.reviewedPercentage,
                            lang,
                          )}%`}
                          now={progress.reviewedPercentage}
                          key={1}
                        />
                        <ProgressBar
                          style={{
                            backgroundColor: "#ffc300",
                          }}
                          label={`${convertToArabicNumerals(
                            progress.pendingPercentage,
                            lang,
                          )}%`}
                          now={progress.pendingPercentage}
                          key={2}
                        />
                        <ProgressBar
                          style={{
                            backgroundColor: "#F16B6B",
                          }}
                          label={`${convertToArabicNumerals(
                            progress.expiredPercentage,
                            lang,
                          )}%`}
                          now={progress.expiredPercentage}
                          key={3}
                        />
                      </ProgressBar>
                    </Col>
                    <Col lg={6} md={6} sm={12} className='d-flex'>
                      <span className={styles["line"]} />
                      <div className={styles["progress-value-wrapper-purple"]}>
                        <span className={styles["numeric-value"]}>
                          {convertToArabicNumerals(progress.reviewed, lang)}
                        </span>
                        <span className={styles["value"]}>{t("Reviewed")}</span>
                      </div>
                      <span className={styles["line"]} />
                      <div className={styles["progress-value-wrapper-yellow"]}>
                        <span className={styles["numeric-value"]}>
                          {convertToArabicNumerals(progress.pending, lang)}
                        </span>
                        <span className={styles["value"]}>{t("Pending")}</span>
                      </div>
                      <span className={styles["line"]} />
                      <div className={styles["progress-value-wrapper-red"]}>
                        <span className={styles["numeric-value"]}>
                          {convertToArabicNumerals(progress.expired, lang)}
                        </span>
                        <span className={styles["value"]}>{t("Expired")}</span>
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
                      // scroll={
                      //   rowsPendingApproval.length > 10 ? { y: 385 } : undefined
                      // }
                      scroll={{ y: "42vh", x: "100%" }}
                      id={(record, index) =>
                        index === rowsPendingApproval.length - 1
                          ? "last-row-class"
                          : ""
                      }
                      locale={{
                        emptyText: (
                          <>
                            <section
                              className={`${styles["emptyScreen-height"]} d-flex flex-column align-items-center justify-content-center`}>
                              <img src={NoApprovals} alt='' />
                              <span className={styles["No-Approvals"]}>
                                {t("Approvals")}
                              </span>
                              <span className={styles["No-Approvals-Text"]}>
                                {t("No-pending-approvals-at-the-moment")}
                              </span>
                            </section>
                          </>
                        ),
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <ReviewSignature />
        )}
      </span>
    </section>
  );
};

export default PendingApproval; // Exporting pending approval component
