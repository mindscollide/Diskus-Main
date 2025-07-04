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
      {" "}
      <span className={styles["RecentActivity_Title"]}>
        {t("Recent-activity")}
      </span>
      <div className={styles["RecentAcitivy_newDashboard"]}>
        {" "}
        {Spinner === true ? (
          <>
            <section className={styles["dashboard_recentActivity_empty"]}>
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
                <div
                  key={recentActivityData.notificationTypes.pK_NTID}
                  className={styles["imageNotificationCard"]}
                >
                  {recentActivityData.notificationTypes.pK_NTID === 1 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 2 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 3 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 4 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 5 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 6 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 7 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 8 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : recentActivityData.notificationTypes.pK_NTID === 9 ? (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  ) : (
                    <img src={DemoIcon} width={46} height={46} alt="" />
                  )}
                  {recentActivityData.notificationTypes.description}
                </div>
                <p className="d-flex justify-content-end  mx-1">
                  {timePassed(
                    forRecentActivity(recentActivityData.creationDateTime),
                    currentLanguage
                  )}
                </p>
              </>
            );
          })
        ) : null}
      </div>
    </>
  );
};

export default RecentActivity;
