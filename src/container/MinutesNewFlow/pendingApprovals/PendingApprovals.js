import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Container, ProgressBar } from "react-bootstrap";
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
  getAllPendingApprovalStatusApi,
  getAllPendingApprovalsStatsApi,
  validateEncryptedMinutesReviewerApi,
  validateEncryptedMinutesReviewer_clear,
} from "../../../store/actions/workflow_actions";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import { convertToArabicNumerals } from "../../../commen/functions/regex";
import { Checkbox, Dropdown, Menu } from "antd";

// Functional component for pending approvals section
const PendingApproval = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  const GetMinuteReviewPendingApprovalsByReviewerIdData = useSelector(
    (state) =>
      state.MinutesReducer.GetMinuteReviewPendingApprovalsByReviewerIdData
  );
  const GetMinuteReviewPendingApprovalsStatsByReviewerIdData = useSelector(
    (state) =>
      state.MinutesReducer.GetMinuteReviewPendingApprovalsStatsByReviewerIdData
  );

  const getMinutesReviewerData = useSelector(
    (state) =>
      state.SignatureWorkFlowReducer.validateEncryptedStringMinuteReviewData
  );
  console.log(getMinutesReviewerData, "getMinutesReviewerData");
  //Getting current Language
  let lang = localStorage.getItem("i18nextLng");

  // State for tracking the active state of each button
  const [reviewMinutesActive, setReviewMinutesActive] = useState(true); // Default Review Minutes button to active
  const [reviewAndSignActive, setReviewAndSignActive] = useState(false);
  const [progress, setProgress] = useState([]);
  const [sortOrderMeetingTitle, setSortOrderMeetingTitle] = useState(null);
  const [sortOrderReviewRequest, setSortOrderReviewRequest] = useState(null);
  const [sortOrderLeaveDateTime, setSortOrderLeaveDateTime] = useState(null);
  const [rowsPendingApproval, setRowsPendingApproval] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([
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
    let Data = { sRow: 0, Length: 10 };
    await dispatch(
      GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t)
    );
    await dispatch(
      GetMinuteReviewPendingApprovalsByReviewerId(Data, navigate, t)
    );
    setReviewMinutesActive(true); // Set Review Minutes button to active
    setReviewAndSignActive(false); // Set Review & Sign button to inactive
    // Your functionality for Review Minutes button
  };

  // Click handler for Review & Sign button
  const handleReviewAndSignClick = async () => {
    await dispatch(getAllPendingApprovalsStatsApi(navigate, t));
    let newData = { IsCreator: false };
    await dispatch(getAllPendingApprovalStatusApi(navigate, t, newData, 1));
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
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyFilter = () => {
    const filteredData = originalData.filter((item) =>
      selectedValues.includes(item.status.toString())
    );
    setRowsPendingApproval(filteredData);
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(["Reviewed", "Pending", "Expired"]);
    setRowsPendingApproval(originalData);
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
      sortOrderMeetingTitle,
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderMeetingTitle((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
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
      sortOrderReviewRequest,
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderReviewRequest((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
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
      sortOrderLeaveDateTime,
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrderLeaveDateTime((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
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
          {text}
        </p>
      ),
    },
  ];

  useEffect(() => {
    let Data = { sRow: 0, Length: 10 };
    dispatch(GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t));
    dispatch(GetMinuteReviewPendingApprovalsByReviewerId(Data, navigate, t));
    // Notification Click Rendering if Clicked on Notification Added you as Reviewer
    if (JSON.parse(localStorage.getItem("MinutesOperations")) === true) {
      dispatch(reviewMinutesPage(true));
      dispatch(pendingApprovalPage(false));
    }
    if (localStorage.getItem("reviewMinutesLink") !== null) {
      let Data = { EncryptedString: localStorage.getItem("reviewMinutesLink") };
      dispatch(validateEncryptedMinutesReviewerApi(Data, navigate, t));
    }
  }, []);

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

  useEffect(() => {
    if (
      GetMinuteReviewPendingApprovalsByReviewerIdData !== null &&
      GetMinuteReviewPendingApprovalsByReviewerIdData !== undefined &&
      GetMinuteReviewPendingApprovalsByReviewerIdData.length !== 0
    ) {
      let reducerDataRow =
        GetMinuteReviewPendingApprovalsByReviewerIdData.pendingReviews;
      setRowsPendingApproval(reducerDataRow);
      setOriginalData(reducerDataRow);
    } else {
      setRowsPendingApproval([]);
      setOriginalData([]);
    }
  }, [GetMinuteReviewPendingApprovalsByReviewerIdData]);

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
      <Row className='my-3 d-flex align-items-center'>
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
                            lang
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
                            lang
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
                            lang
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
                      scroll={
                        rowsPendingApproval.length > 10 ? { y: 385 } : undefined
                      }
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
