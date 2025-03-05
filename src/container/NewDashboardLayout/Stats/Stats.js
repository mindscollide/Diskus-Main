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
    } catch {
      console.log("Error");
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
      } catch (error) {}
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

  const progressBarData = useMemo(
    () => [
      {
        now: counts.upcomingMeetingCount,
        max: counts.totalMeetingCount,
        className:
          counts.upcomingMeetingCount === 0 && counts.totalMeetingCount === 0
            ? styles["dashboard_progress_upcomingmeeting_R"]
            : styles["dashboard_progress_upcomingmeeting"],
      },
      {
        now: counts.upComingTaskCount,
        max: counts.totalTaskCount,
        className:
          counts.upComingTaskCount === 0 && counts.totalTaskCount === 0
            ? styles["dashboard_progress_upcomingTask_R"]
            : styles["dashboard_progress_upcomingTask"],
      },
      {
        now: counts.upComingApprovalCount,
        max: counts.totalPendingApprovalCount,
        className:
          counts.upComingApprovalCount === 0 &&
          counts.totalPendingApprovalCount === 0
            ? styles["dashboard_progress_upcomingApproval_R"]
            : styles["dashboard_progress_upcomingApproval"],
      },
    ],
    [counts]
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
            className='d-flex justify-content-center align-items-center'>
            <UpcomingMeeting meetingValue={counts.upcomingMeetingCount} />
          </Col>
          <Col
            sm={12}
            md={4}
            lg={4}
            className='d-flex justify-content-center align-items-center'>
            <PendingTasks taskValue={counts.upComingTaskCount} />
          </Col>
          <Col
            sm={12}
            md={4}
            lg={4}
            className='d-flex justify-content-center align-items-center'>
            <PendingApproval pendingAppr={counts.upComingApprovalCount} />
          </Col>
        </Row>
      </Col>
      <Col
        sm={12}
        md={6}
        lg={6}
        className={`d-flex flex-column gap-3 ${styles["ProgressBarContains"]}`}>
        {progressBarData.map((bar, index) => {
          let nowValue = Number(bar.max) - Number(bar.now);
          let calculateValue = nowValue === 0 ? bar.max : nowValue;
          let checkisbothValueisEqual = bar.max === bar.now;
          console.log(
            checkisbothValueisEqual,
            nowValue,
            calculateValue,
            bar,
            typeof bar.max,
            typeof bar.now,
            "progressBarData"
          );

          return (
            <ProgressBar
              now={checkisbothValueisEqual ? 0 : calculateValue}
              max={bar.max}
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
