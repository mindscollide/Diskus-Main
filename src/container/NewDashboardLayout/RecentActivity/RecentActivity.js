import React, { useEffect, useState } from "react";
import styles from "./RecentActivity.module.css";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { ResultMessage } from "../../../components/elements";
import TodoMessageIcon1 from "../../../assets/images/DashboardNewTodo.svg";
import TimeAgo from "timeago-react";
import { forRecentActivity } from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getNotifications } from "../../../store/actions/GetUserNotification";
import { useTranslation } from "react-i18next";
import DemoIcon from "../../../assets/images/Recent Activity Icons/Task/Added In Task.png";

const RecentActivity = () => {
  const { settingReducer } = useSelector((state) => state);
  const [recentActivityData, setRecentActivityData] = useState([]);
  let createrID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNotifications(navigate, Number(createrID), t));
  }, []);
  useEffect(() => {
    if (Object.keys(settingReducer.RecentActivityData).length > 0) {
      setRecentActivityData(settingReducer.RecentActivityData);
    }
  }, [settingReducer.RecentActivityData]);

  useEffect(() => {
    if (
      settingReducer.SocketRecentActivityData !== null &&
      settingReducer.SocketRecentActivityData !== undefined &&
      Object.keys(settingReducer.SocketRecentActivityData).length > 0
    ) {
      setRecentActivityData([
        settingReducer.SocketRecentActivityData,
        ...recentActivityData,
      ]);
    }
  }, [settingReducer.SocketRecentActivityData]);

  return (
    <>
      {" "}
      <span className={styles["RecentActivity_Title"]}>Recent Activity</span>
      <div className={styles["RecentAcitivy_newDashboard"]}>
        {" "}
        {settingReducer.Spinner === true ? (
          <>
            <section className="d-flex justify-content-center align-items-center">
              <Spin />
            </section>
          </>
        ) : recentActivityData.length === 0 ? (
          <ResultMessage
            icon={
              <img
                src={TodoMessageIcon1}
                width={200}
                alt=""
                draggable="false"
              />
            }
            className="recent-activity-text"
          />
        ) : recentActivityData !== null && recentActivityData !== undefined ? (
          recentActivityData.map((recentActivityData) => {
            return (
              <>
                <div className="d-flex justify-content-start align-items-start gap-3">
                  {recentActivityData.notificationTypes.pK_NTID === 1 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 2 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 3 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 4 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 5 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 6 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 7 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 8 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 9 ? (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  ) : (
                    <img src={DemoIcon} width={45} height={45} alt="" />
                  )}
                  {recentActivityData.notificationTypes.description}
                </div>
                <p className="d-flex justify-content-end  me-1">
                  {
                    <TimeAgo
                      datetime={forRecentActivity(
                        recentActivityData.creationDateTime
                      )}
                      locale="en"
                    />
                  }
                </p>
              </>
            );
          })
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
};

export default RecentActivity;
