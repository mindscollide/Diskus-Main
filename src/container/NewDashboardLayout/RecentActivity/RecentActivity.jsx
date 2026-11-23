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
// styles of classes used below that live in plain .css files (not CSS modules): without these imports a lazily loaded page loses them in production
import "../../pages/home/dashboard-module.css";

const RecentActivity = () => {
  const RecentActivityData = useSelector(
    (state) => state.settingReducer.RecentActivityData,
  );
  const SocketRecentActivityData = useSelector(
    (state) => state.settingReducer.SocketRecentActivityData,
  );
  const Spinner = useSelector((state) => state.settingReducer.Spinner);
  let currentLanguage = localStorage.getItem("i18nextLng") || "en";
  // start from what Redux already holds (e.g. coming back to the dashboard);
  // starting at [] showed the empty state for a frame and then popped the list in
  const [recentActivityData, setRecentActivityData] = useState(() =>
    RecentActivityData && Object.keys(RecentActivityData).length > 0
      ? RecentActivityData
      : [],
  );
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
      setRecentActivityData((prev) => [SocketRecentActivityData, ...prev]);
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
                alt=''
                draggable='false'
              />
            }
            className='recent-activity-text'
          />
        ) : (
          recentActivityData.map((activity) => {
            const { pK_NTID, description } = activity.notificationTypes;

            return (
              <React.Fragment key={activity.pK_NID}>
                <div className={styles["imageNotificationCard"]}>
                  <img src={DemoIcon} width={46} height={46} alt='' />
                  {description}
                </div>

                <p className='d-flex justify-content-end mx-1'>
                  {timePassed(
                    forRecentActivity(activity.creationDateTime),
                    currentLanguage,
                  )}
                </p>
              </React.Fragment>
            );
          })
        )}
      </div>
    </>
  );
};

export default RecentActivity;
