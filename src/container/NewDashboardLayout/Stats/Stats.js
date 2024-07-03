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
const Stats = () => {
  const { meetingIdReducer, toDoListReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  let createrID = localStorage.getItem("userID");
  const [counterValues, setCounterValues] = useState({
    UpcomingMeetingVal: 0,
    PendingTasksVal: 0,
    PendingApprovalVal: 0,
    UpcomingMeetingProgressVal: {
      totalCount: 0,
      RemainingCount: 0,
    },
    PendingTaskProgressVal: {
      totalCount: 0,
      RemainingCount: 0,
    },
    ApprovalPendingProgressVal: {
      totalCount: 0,
      RemainingCount: 0,
    },
  });
  console.log(
    { counterValues, meetingIdReducer },
    "counterValuescounterValues"
  );
  useEffect(() => {
    let Data2 = {
      UserID: parseInt(createrID),
    };
    dispatch(GetWeeklyToDoCount(navigate, Data2, t));
    dispatch(GetWeeklyMeetingsCount(navigate, Number(createrID), t));
  }, []);
  useEffect(() => {
    if (
      meetingIdReducer.TotalMeetingCountThisWeek !== 0 ||
      meetingIdReducer.TotalNumberOfUpcommingMeetingsInWeek !== 0
    ) {
      setCounterValues({
        ...counterValues,
        UpcomingMeetingVal: meetingIdReducer.TotalMeetingCountThisWeek,
        UpcomingMeetingProgressVal: {
          RemainingCount: meetingIdReducer.TotalNumberOfUpcommingMeetingsInWeek,
          totalCount: meetingIdReducer.TotalMeetingCountThisWeek,
        },
      });
    }
  }, [
    meetingIdReducer.TotalMeetingCountThisWeek,
    meetingIdReducer.TotalNumberOfUpcommingMeetingsInWeek,
  ]);

  useEffect(() => {
    if (
      toDoListReducer.TotalNumberOfUpcommingTodoInWeek !== 0 ||
      toDoListReducer.TotalTodoCountThisWeek !== 0
    ) {
      setCounterValues({
        ...counterValues,
        PendingTasksVal: toDoListReducer.TotalNumberOfUpcommingTodoInWeek,
        UpcomingMeetingProgressVal: {
          RemainingCount: toDoListReducer.TotalNumberOfUpcommingTodoInWeek,
          totalCount: toDoListReducer.TotalTodoCountThisWeek,
        },
      });
    }
  }, [
    toDoListReducer.TotalTodoCountThisWeek,
    toDoListReducer.TotalNumberOfUpcommingTodoInWeek,
  ]);
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
                  className="d-flex justify-content-center align-items-center"
                >
                  <UpcomingMeeting
                    meetingValue={counterValues.UpcomingMeetingVal}
                  />
                </Col>
                <Col
                  sm={12}
                  md={4}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <PendingTasks taskValue={counterValues.PendingTasksVal} />
                </Col>
                <Col
                  sm={12}
                  md={4}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <PendingApproval
                    pendingAppr={counterValues.PendingApprovalVal}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          sm={12}
          md={6}
          lg={6}
          className={` d-flex flex-column gap-3 ${styles["ProgressBarContains"]}`}
        >
          <ProgressBar
            now={Number(
              counterValues.UpcomingMeetingProgressVal.RemainingCount
            )}
            max={Number(counterValues?.UpcomingMeetingProgressVal?.totalCount)}
            label={`${counterValues?.UpcomingMeetingProgressVal?.RemainingCount}/${counterValues?.UpcomingMeetingProgressVal?.totalCount}`}
            className=" dashboard_progress_upcomingmeeting"
          />
          <ProgressBar
            now={counterValues.PendingTaskProgressVal.RemainingCount}
            max={counterValues.PendingTaskProgressVal.totalCount}
            label={`${counterValues?.PendingTaskProgressVal?.RemainingCount}/${counterValues?.PendingTaskProgressVal?.totalCount}`}
            className=" dashboard_progress_upcomingTask"
          />
          <ProgressBar
            now={counterValues.ApprovalPendingProgressVal.RemainingCount}
            max={counterValues.ApprovalPendingProgressVal.totalCount}
            label={`${counterValues.ApprovalPendingProgressVal.RemainingCount}/${counterValues.ApprovalPendingProgressVal.totalCount}`}
            className=" dashboard_progress_upcomingApproval"
          />
        </Col>
      </Row>
    </>
  );
};

export default Stats;
