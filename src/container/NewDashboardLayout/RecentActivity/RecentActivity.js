import React, { useEffect, useState } from "react";
import styles from "./RecentActivity.module.css";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { Button, ResultMessage } from "../../../components/elements";
import TodoMessageIcon1 from "../../../assets/images/DashboardNewTodo.svg";
import { Col, Row } from "react-bootstrap";
import TimeAgo from "timeago-react";
import { forRecentActivity } from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getNotifications } from "../../../store/actions/GetUserNotification";
import { useTranslation } from "react-i18next";
import DemoIcon from "../../../assets/images/Recent Activity Icons/Task/Added In Task.png";
import approvalEmptyState from "../../../assets/images/Approval Empty state.svg";
import signatureIcon from "../../../assets/images/Signature.svg";
import ApprovalIcon from "../../../assets/images/Approval.svg";

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
      // setRecentActivityData([]);
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
      <span className={styles["RecentActivity_Title"]}>Pending Approval</span>
      <div
        className={
          recentActivityData.length === 0
            ? styles["RecentAcitivy_newDashboard_EmptyState"]
            : styles["RecentAcitivy_newDashboard"]
        }
      >
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
                src={approvalEmptyState}
                width={"155.37px"}
                height={"126.04px"}
                alt=""
                draggable="false"
              />
            }
            title={
              <span className={styles["Custom_TitleClassResult"]}>
                No approvals at the moment.
              </span>
            }
            className="recent-activity-text"
          />
        ) : recentActivityData !== null && recentActivityData !== undefined ? (
          recentActivityData.map((recentActivityData, index) => {
            console.log(
              recentActivityData,
              "recentActivityDatarecentActivityData"
            );
            return (
              <>
                <section className={styles["SectionPendingApprovals"]}>
                  <div className="d-flex justify-content-center align-items-center gap-1">
                    {recentActivityData.notificationTypes.pK_NTID === 1 ? (
                      <img src={ApprovalIcon} width={45} height={45} />
                    ) : recentActivityData.notificationTypes.pK_NTID === 2 ? (
                      <img src={signatureIcon} width={45} height={45} />
                    ) : (
                      <img src={signatureIcon} width={45} height={45} />
                    )}
                    <span className={styles["DescriptionSpan"]}>
                      industry. Lorem Ipsum has been the industry's standard
                      dummy text ever since the 1500s, when an unknown printer
                      took a galley
                      {/* {recentActivityData.notificationTypes.description} */}
                    </span>
                    {recentActivityData.notificationTypes.pK_NTID === 1 ? (
                      <>
                        <Button
                          text={t("Review-minutes")}
                          className={styles["ReviewMinutesClassButton"]}
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          text={t("Review-document")}
                          className={styles["ReviewMinutesClassButton"]}
                        />
                      </>
                    )}
                  </div>

                  <span className={styles["DateTimeStyles"]}>
                    {
                      <TimeAgo
                        datetime={forRecentActivity(
                          recentActivityData.creationDateTime
                        )}
                        locale="en"
                      />
                    }
                  </span>
                  <span className={styles["LineSpan"]}></span>
                </section>
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
