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

const Stats = () => {
  const { NewMeetingreducer, toDoListReducer, SignatureWorkFlowReducer } =
    useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [counts, setCounts] = useState({
    totalMeetingCount: 0,
    upcomingMeetingCount: 0,
    totalTaskCount: 0,
    upComingTaskCount: 0,
    totalPendingApprovalCount: 0,
    upComingApprovalCount: 0,
  });

  useEffect(() => {
    dispatch(getDashbardMeetingDataApi(navigate, t));
    dispatch(getDashbardTaskDataApi(navigate, t));
    dispatch(getDashbardPendingApprovalDataApi(navigate, t));
  }, [dispatch, navigate, t]);

  useEffect(() => {
    if (NewMeetingreducer.getDashboardMeetingData) {
      const { totalNumberOfMeetings, numberOfUpcommingMeetings } =
        NewMeetingreducer.getDashboardMeetingData;
      setCounts((prevCounts) => ({
        ...prevCounts,
        totalMeetingCount: totalNumberOfMeetings,
        upcomingMeetingCount: numberOfUpcommingMeetings,
      }));
    }
  }, [NewMeetingreducer.getDashboardMeetingData]);

  useEffect(() => {
    if (toDoListReducer.getDashboardTaskData) {
      const { totalNumberOfToDoList, totalNumberOfAssignedToDoList } =
        toDoListReducer.getDashboardTaskData;
      setCounts((prevCounts) => ({
        ...prevCounts,
        totalTaskCount: totalNumberOfToDoList,
        upComingTaskCount: totalNumberOfAssignedToDoList,
      }));
    }
  }, [toDoListReducer.getDashboardTaskData]);

  useEffect(() => {
    if (SignatureWorkFlowReducer.getDashboardPendingApprovalData) {
      const { pendingApprovalsCount, totalApprovalsCount } =
        SignatureWorkFlowReducer.getDashboardPendingApprovalData;
      setCounts((prevCounts) => ({
        ...prevCounts,
        totalPendingApprovalCount: totalApprovalsCount,
        upComingApprovalCount: pendingApprovalsCount,
      }));
    }
  }, [SignatureWorkFlowReducer.getDashboardPendingApprovalData]);

  const progressBarData = useMemo(
    () => [
      {
        now: counts.upcomingMeetingCount,
        max: counts.totalMeetingCount,
        className:
          counts.upcomingMeetingCount === 0 && counts.totalMeetingCount >= 0
            ? styles["dashboard_progress_upcomingmeeting_R"]
            : styles["dashboard_progress_upcomingmeeting"],
      },
      {
        now: counts.upComingTaskCount,
        max: counts.totalTaskCount,
        className:
          counts.upComingTaskCount === 0 && counts.totalTaskCount >= 0
            ? styles["dashboard_progress_upcomingTask_R"]
            : styles["dashboard_progress_upcomingTask"],
      },
      {
        now: counts.upComingApprovalCount,
        max: counts.totalPendingApprovalCount,
        className:
          counts.upComingApprovalCount === 0 &&
          counts.totalPendingApprovalCount >= 0
            ? styles["dashboard_progress_upcomingApproval_R"]
            : styles["dashboard_progress_upcomingApproval"],
      },
    ],
    [counts]
  );

  return (
    <Row>
      <Col sm={12} md={6} lg={6}>
        <Row className="mt-1">
          <Col sm={12} md={12} lg={12}>
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
        </Row>
      </Col>
      <Col
        sm={12}
        md={6}
        lg={6}
        className={`d-flex flex-column gap-3 ${styles["ProgressBarContains"]}`}>
        {progressBarData.map((bar, index) => (
          <ProgressBar
            key={index}
            now={bar.now}
            max={bar.max}
            label={`${bar.now}/${bar.max}`}
            className={bar.className}
          />
        ))}
      </Col>
    </Row>
  );
};

export default Stats;
