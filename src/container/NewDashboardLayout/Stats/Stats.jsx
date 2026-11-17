import React, { useEffect, useState, useMemo } from "react";
import styles from "./Stats.module.css";
import { Row, Col } from "react-bootstrap";
import UpcomingMeeting from "../UpcomingMeetings/UpcomingMeeting";
import PendingTasks from "../PendingTasks/PendingTasks";
import PendingApproval from "../PendingApproval/PendingApproval";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDashbardTaskDataApi } from "../../../store/actions/ToDoList_action";
import { getDashbardMeetingDataApi } from "../../../store/actions/NewMeetingActions";
import { getDashbardPendingApprovalDataApi } from "../../../store/actions/workflow_actions";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import { convertToArabicNumerals } from "../../../commen/functions/regex";
import { useCountUp } from "../../../commen/functions/useCountUp";

const Stats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const getDashboardMeetingData = useSelector(
    (state) => state.NewMeetingreducer.getDashboardMeetingData
  );
  const getDashboardTaskData = useSelector(
    (state) => state.toDoListReducer.getDashboardTaskData
  );
  const getDashboardTaskCountMQTT = useSelector(
    (state) => state.toDoListReducer.getDashboardTaskCountMQTT
  );
  const getDashboardPendingApprovalData = useSelector(
    (state) => state.SignatureWorkFlowReducer.getDashboardPendingApprovalData
  );


  console.log(getDashboardTaskCountMQTT, "getDashboardTaskDatagetDashboardTaskData")
  const [counts, setCounts] = useState({
    totalMeetingCount: 0,
    upcomingMeetingCount: 0,
    totalTaskCount: 0,
    upComingTaskCount: 0,
    totalPendingApprovalCount: 0,
    upComingApprovalCount: 0,
  });

  useEffect(() => {
    try {
      dispatch(getDashbardMeetingDataApi(navigate, t));
      if (checkFeatureIDAvailability(14)) {
        dispatch(getDashbardTaskDataApi(navigate, t));
      }
      dispatch(getDashbardPendingApprovalDataApi(navigate, t));
    } catch (error) {
      console.error("src/container/NewDashboardLayout/Stats/Stats.js:", error);
    }
  }, []);

  useEffect(() => {
    if (getDashboardMeetingData) {
      const { totalNumberOfMeetings, numberOfUpcommingMeetings } =
        getDashboardMeetingData;
      setCounts((prevCounts) => ({
        ...prevCounts,
        totalMeetingCount: totalNumberOfMeetings,
        upcomingMeetingCount: numberOfUpcommingMeetings,
      }));
    }
  }, [getDashboardMeetingData]);

  useEffect(() => {
    if (getDashboardTaskData) {
      const { totalNumberOfToDoList, totalNumberOfAssignedToDoList } =
        getDashboardTaskData;
      setCounts((prevCounts) => ({
        ...prevCounts,
        totalTaskCount: totalNumberOfToDoList,
        upComingTaskCount: totalNumberOfAssignedToDoList,
      }));
    }
  }, [getDashboardTaskData]);

  useEffect(() => {
    if (getDashboardTaskCountMQTT !== null) {
      try {
        const { totalNumberOfToDoList, totalNumberOfAssignedToDoList } =
          getDashboardTaskCountMQTT;
        setCounts((prevCounts) => ({
          ...prevCounts,
          totalTaskCount: totalNumberOfToDoList,
          upComingTaskCount: totalNumberOfAssignedToDoList,
        }));
      } catch (error) {
        console.error("src/container/NewDashboardLayout/Stats/Stats.js:", error);
      }
    }
  }, [getDashboardTaskCountMQTT]);

  useEffect(() => {
    if (getDashboardPendingApprovalData) {
      const { pendingApprovalsCount, totalApprovalsCount } =
        getDashboardPendingApprovalData;
      setCounts((prevCounts) => ({
        ...prevCounts,
        totalPendingApprovalCount: totalApprovalsCount,
        upComingApprovalCount: pendingApprovalsCount,
      }));
    }
  }, [getDashboardPendingApprovalData]);

  // the numbers count up to their value when the data arrives (and tick over
  // when a live update changes them); `counts` stays the real value and is
  // what the colour / "empty" decisions below use
  const shown = {
    upcomingMeetingCount: useCountUp(counts.upcomingMeetingCount),
    totalMeetingCount: useCountUp(counts.totalMeetingCount),
    upComingTaskCount: useCountUp(counts.upComingTaskCount),
    totalTaskCount: useCountUp(counts.totalTaskCount),
    upComingApprovalCount: useCountUp(counts.upComingApprovalCount),
    totalPendingApprovalCount: useCountUp(counts.totalPendingApprovalCount),
  };

  const progressBarData = useMemo(
    () => [
      {
        now: shown.upcomingMeetingCount,
        max: shown.totalMeetingCount,
        realNow: counts.upcomingMeetingCount,
        realMax: counts.totalMeetingCount,
        className:
          counts.upcomingMeetingCount === 0 && counts.totalMeetingCount === 0
            ? styles["dashboard_progress_upcomingmeeting_R"]
            : styles["dashboard_progress_upcomingmeeting"],
      },
      {
        now: shown.upComingTaskCount,
        max: shown.totalTaskCount,
        realNow: counts.upComingTaskCount,
        realMax: counts.totalTaskCount,
        className:
          counts.upComingTaskCount === 0 && counts.totalTaskCount === 0
            ? styles["dashboard_progress_upcomingTask_R"]
            : styles["dashboard_progress_upcomingTask"],
      },
      {
        now: shown.upComingApprovalCount,
        max: shown.totalPendingApprovalCount,
        realNow: counts.upComingApprovalCount,
        realMax: counts.totalPendingApprovalCount,
        className:
          counts.upComingApprovalCount === 0 &&
          counts.totalPendingApprovalCount === 0
            ? styles["dashboard_progress_upcomingApproval_R"]
            : styles["dashboard_progress_upcomingApproval"],
      },
    ],
    [counts, shown.upcomingMeetingCount, shown.totalMeetingCount, shown.upComingTaskCount, shown.totalTaskCount, shown.upComingApprovalCount, shown.totalPendingApprovalCount]
  );

  let locale = localStorage.getItem("i18nextLng");

  return (
    <Row>
      <Col sm={12} md={6} lg={6}>
        <Row>
          <Col
            sm={12}
            md={4}
            lg={4}
            className={`d-flex justify-content-center align-items-center ${styles["statItem"]}`}>
            <UpcomingMeeting meetingValue={shown.upcomingMeetingCount} />
          </Col>
          <Col
            sm={12}
            md={4}
            lg={4}
            className={`d-flex justify-content-center align-items-center ${styles["statItem"]}`}>
            <PendingTasks taskValue={shown.upComingTaskCount} />
          </Col>
          <Col
            sm={12}
            md={4}
            lg={4}
            className={`d-flex justify-content-center align-items-center ${styles["statItem"]}`}>
            <PendingApproval pendingAppr={shown.upComingApprovalCount} />
          </Col>
        </Row>
      </Col>
      <Col
        sm={12}
        md={6}
        lg={6}
        className={`d-flex flex-column gap-3 ${styles["ProgressBarContains"]}`}>
        {progressBarData.map((bar, index) => {
          // the fill is sized from the REAL values and eased by the CSS width
          // transition (smooth); only the label text counts up
          let nowValue = Number(bar.realMax) - Number(bar.realNow);
          let calculateValue = nowValue === 0 ? bar.realMax : nowValue;
          // decided on the real values, so the bar doesn't flip to its grey
          // "equal" look while the numbers are still counting
          let checkisbothValueisEqual = bar.realMax === bar.realNow;

          return (
            <ProgressBar
              key={index}
              now={checkisbothValueisEqual ? 0 : calculateValue}
              max={bar.realMax}
              label={`${convertToArabicNumerals(
                bar.now,
                locale
              )}/${convertToArabicNumerals(bar.max, locale)}`}
              className={
                checkisbothValueisEqual
                  ? styles["dashboard_progress_upcomingmeeting_R"]
                  : bar.className
              }
            />
          );
        })}
      </Col>
    </Row>
  );
};

export default Stats;
