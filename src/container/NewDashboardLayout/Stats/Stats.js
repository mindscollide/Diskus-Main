import React, { useEffect, useState } from "react";
import styles from "./Stats.module.css";
import { Row, Col } from "react-bootstrap";
import UpcomingMeeting from "../UpcomingMeetings/UpcomingMeeting";
import PendingTasks from "../PendingTasks/PendingTasks";
import PendingApproval from "../PendingApproval/PendingApproval";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useDispatch } from "react-redux";
import { GetWeeklyMeetingsCount } from "../../../store/actions/GetMeetingUserId";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GetWeeklyToDoCount } from "../../../store/actions/ToDoList_action";
import { getPendingApprovalStatsThisWeekApi } from "../../../store/actions/Minutes_action";
const Stats = () => {
  const { meetingIdReducer, toDoListReducer, MinutesReducer } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  let createrID = localStorage.getItem("userID");
  const [totalMeetingCount, setTotalMeetingCount] = useState(0);
  const [upcomingMeetingCount, setUpcomingMeetingCount] = useState(0);
  const [totalTaskCount, setTotalTaskCount] = useState(0);
  const [upComingTaskCount, setUpcomingTaskCount] = useState(0);
  const [totalPendingApprovalCount, setTotalPendingApprovalCount] = useState(0);
  const [upComingApprovalCount, setUpcomingApprovalCount] = useState(0);

  useEffect(() => {
    let Data2 = {
      UserID: parseInt(createrID),
    };
    dispatch(getPendingApprovalStatsThisWeekApi(Data2, navigate, t));
    dispatch(GetWeeklyToDoCount(navigate, Data2, t));
    dispatch(GetWeeklyMeetingsCount(navigate, Number(createrID), t));
  }, []);
  useEffect(() => {
    const { TotalMeetingCountThisWeek, TotalNumberOfUpcommingMeetingsInWeek } =
      meetingIdReducer;

    if (
      TotalMeetingCountThisWeek != null &&
      TotalNumberOfUpcommingMeetingsInWeek != null
    ) {
      if (
        TotalMeetingCountThisWeek !== 0 ||
        TotalNumberOfUpcommingMeetingsInWeek !== 0
      ) {
        setTotalMeetingCount(TotalMeetingCountThisWeek);
        setUpcomingMeetingCount(TotalNumberOfUpcommingMeetingsInWeek);
      }
    }

    console.log(
      typeof TotalMeetingCountThisWeek,
      typeof TotalNumberOfUpcommingMeetingsInWeek,
      "meetingIdReducermeetingIdReducer"
    );
  }, [
    meetingIdReducer.TotalMeetingCountThisWeek,
    meetingIdReducer.TotalNumberOfUpcommingMeetingsInWeek,
  ]);

  useEffect(() => {
    const { TotalTodoCountThisWeek, TotalNumberOfUpcommingTodoInWeek } =
      toDoListReducer;

    if (
      TotalTodoCountThisWeek != null &&
      TotalNumberOfUpcommingTodoInWeek != null
    ) {
      if (
        TotalTodoCountThisWeek !== 0 ||
        TotalNumberOfUpcommingTodoInWeek !== 0
      ) {
        setTotalTaskCount(TotalTodoCountThisWeek);
        setUpcomingTaskCount(TotalNumberOfUpcommingTodoInWeek);
      }
    }

    console.log(
      TotalTodoCountThisWeek,
      TotalNumberOfUpcommingTodoInWeek,
      "toDoListReducertoDoListReducer"
    );
  }, [
    toDoListReducer.TotalTodoCountThisWeek,
    toDoListReducer.TotalNumberOfUpcommingTodoInWeek,
  ]);

  useEffect(() => {
    if (MinutesReducer.PendingApprovalStatsThisWeek != null) {
      const { pendingApprovalsCount, totalApprovalsCount } =
        MinutesReducer.PendingApprovalStatsThisWeek;

      console.log(
        pendingApprovalsCount,
        totalApprovalsCount,
        "pendingApprovalsCountpendingApprovalsCountpendingApprovalsCount"
      );

      try {
        setTotalPendingApprovalCount(totalApprovalsCount);
        setUpcomingApprovalCount(pendingApprovalsCount);
      } catch (error) {
        console.log(error, "error");
      }
    }
  }, [MinutesReducer.PendingApprovalStatsThisWeek]);

  return (
    <>
      <Row>
        <Col sm={12} md={6} lg={6}>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["Stats_title"]}>This Week</span>
            </Col>
            <Col sm={12} md={12} lg={12}>
              <Row>
                <Col
                  sm={12}
                  md={4}
                  lg={4}
                  className='d-flex justify-content-center align-items-center'>
                  <UpcomingMeeting meetingValue={upcomingMeetingCount} />
                </Col>
                <Col
                  sm={12}
                  md={4}
                  lg={4}
                  className='d-flex justify-content-center align-items-center'>
                  <PendingTasks taskValue={upComingTaskCount} />
                </Col>
                <Col
                  sm={12}
                  md={4}
                  lg={4}
                  className='d-flex justify-content-center align-items-center'>
                  <PendingApproval pendingAppr={upComingApprovalCount} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          sm={12}
          md={6}
          lg={6}
          className={` d-flex flex-column gap-3 ${styles["ProgressBarContains"]}`}>
          <ProgressBar
            now={upcomingMeetingCount}
            max={totalMeetingCount}
            label={`${upcomingMeetingCount}/${totalMeetingCount}`}
            className={
              upcomingMeetingCount === 0
                ? styles["dashboard_progress_upcomingmeeting_R"]
                : styles["dashboard_progress_upcomingmeeting"]
            }
          />
          <ProgressBar
            now={upComingTaskCount}
            max={totalTaskCount}
            label={`${upComingTaskCount}/${totalTaskCount}`}
            className={
              upComingTaskCount === 0
                ? styles["dashboard_progress_upcomingTask_R"]
                : styles["dashboard_progress_upcomingTask"]
            }
          />
          <ProgressBar
            now={upComingApprovalCount}
            max={totalPendingApprovalCount}
            label={`${upComingApprovalCount}/${totalPendingApprovalCount}`}
            className={
              upComingApprovalCount === 0
                ? styles["dashboard_progress_upcomingApproval_R"]
                : styles["dashboard_progress_upcomingApproval"]
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default Stats;
