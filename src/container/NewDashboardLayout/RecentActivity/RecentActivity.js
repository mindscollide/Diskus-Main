import React, { useEffect, useState } from "react";
import styles from "./RecentActivity.module.css";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { ResultMessage } from "../../../components/elements";
import TodoMessageIcon1 from "../../../assets/images/DashboardNewTodo.svg";
import {
  forRecentActivity,
  timePassed,
} from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getNotifications } from "../../../store/actions/GetUserNotification";
import { useTranslation } from "react-i18next";
import DemoIcon from "../../../assets/images/Recent Activity Icons/Task/Added In Task.png";

const RecentActivity = () => {
  const RecentActivityData = useSelector(
    (state) => state.settingReducer.RecentActivityData
  );
  const SocketRecentActivityData = useSelector(
    (state) => state.settingReducer.SocketRecentActivityData
  );
  const Spinner = useSelector((state) => state.settingReducer.Spinner);
  let currentLanguage = localStorage.getItem("i18nextLng") || "en";
  const [recentActivityData, setRecentActivityData] = useState([]);
  let createrID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNotifications(navigate, Number(createrID), t));
  }, []);
  useEffect(() => {
    if (Object.keys(RecentActivityData).length > 0) {
      setRecentActivityData(RecentActivityData);
    }
  }, [RecentActivityData]);

  useEffect(() => {
    if (
      SocketRecentActivityData !== null &&
      SocketRecentActivityData !== undefined &&
      Object.keys(SocketRecentActivityData).length > 0
    ) {
      setRecentActivityData([SocketRecentActivityData, ...recentActivityData]);
    }
  }, [SocketRecentActivityData]);

  return (
    <>
      <span className={styles["RecentActivity_Title"]}>
        {t("Recent-activity")}
      </span>
  
      <div className={styles["RecentAcitivy_newDashboard"]}>
        {Spinner ? (
          <section className={styles["dashboard_recentActivity_empty"]}>
            <Spin />
          </section>
        ) : !recentActivityData || recentActivityData.length === 0 ? (
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
        ) : (
          recentActivityData.map((activity) => {
            const { pK_NTID, description } = activity.notificationTypes;
            return (
              <div
                key={pK_NTID + activity.creationDateTime}
                className={styles["imageNotificationCard"]}
              >
                {/* Since all IDs use the same icon, you can simplify */}
                <img src={DemoIcon} width={46} height={46} alt="" />
  
                {description}
  
                <p className="d-flex justify-content-end mx-1">
                  {timePassed(
                    forRecentActivity(activity.creationDateTime),
                    currentLanguage
                  )}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
  
};

export default RecentActivity;
