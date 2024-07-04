import React, { useEffect, useState } from "react";
import styles from "./RecentActivity.module.css";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { ResultMessage } from "../../../components/elements";
import TodoMessageIcon1 from "../../../assets/images/DashboardNewTodo.svg";
import { Col, Row } from "react-bootstrap";
import TimeAgo from "timeago-react";
import { forRecentActivity } from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getNotifications } from "../../../store/actions/GetUserNotification";
import { useTranslation } from "react-i18next";

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

  return (
    <>
      {" "}
      <span className={styles["RecentActivity_Title"]}>Recent Activity</span>
      <div className={styles["RecentAcitivy_newDashboard"]}>
        {" "}
        {settingReducer.Spinner === true ? (
          <Spin />
        ) : recentActivityData.length === 0 ? (
          <ResultMessage
            icon={
              <img
                src={TodoMessageIcon1}
                // className="recent-activity-icon"
                width={200}
                alt=""
                draggable="false"
              />
            }
            className="recent-activity-text"
          />
        ) : recentActivityData !== null && recentActivityData !== undefined ? (
          recentActivityData.map((recentActivityData, index) => {
            return (
              <>
                <Row>
                  <Col sm={2}>
                    {recentActivityData.notificationTypes.pK_NTID === 1 ? (
                      <div className="desc-notification-user ">
                        {/* Bell Notification SVG Code */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="28.132"
                          viewBox="0 0 22.476 28.132"
                        >
                          <g
                            id="Group_167"
                            data-name="Group 167"
                            transform="translate(-1407.762 -110)"
                          >
                            <g
                              id="Icon_ionic-ios-notifications-outline"
                              data-name="Icon ionic-ios-notifications-outline"
                              transform="translate(1400.987 106.069)"
                            >
                              <path
                                id="Path_2"
                                data-name="Path 2"
                                d="M20.37,28.336a.911.911,0,0,0-.893.717,1.762,1.762,0,0,1-.352.766,1.329,1.329,0,0,1-1.132.415,1.351,1.351,0,0,1-1.132-.415,1.762,1.762,0,0,1-.352-.766.911.911,0,0,0-.893-.717h0a.917.917,0,0,0-.893,1.118,3.142,3.142,0,0,0,3.27,2.609,3.136,3.136,0,0,0,3.27-2.609.92.92,0,0,0-.893-1.118Z"
                                fill="#fff"
                              />
                              <path
                                id="Path_3"
                                data-name="Path 3"
                                d="M28.969,24.764c-1.083-1.427-3.213-2.264-3.213-8.655,0-6.56-2.9-9.2-5.6-9.83-.253-.063-.436-.148-.436-.415v-.2a1.725,1.725,0,0,0-1.687-1.73h-.042a1.725,1.725,0,0,0-1.687,1.73v.2c0,.26-.183.352-.436.415-2.707.64-5.6,3.27-5.6,9.83,0,6.391-2.13,7.221-3.213,8.655A1.4,1.4,0,0,0,8.177,27H27.872A1.4,1.4,0,0,0,28.969,24.764Zm-2.742.408H9.83a.308.308,0,0,1-.232-.513,8.518,8.518,0,0,0,1.477-2.348,15.934,15.934,0,0,0,1.005-6.2,10.783,10.783,0,0,1,1.47-6.1A4.512,4.512,0,0,1,16.27,8.065a2.464,2.464,0,0,0,1.308-.738.556.556,0,0,1,.837-.014,2.547,2.547,0,0,0,1.322.752,4.512,4.512,0,0,1,2.721,1.941,10.783,10.783,0,0,1,1.47,6.1,15.934,15.934,0,0,0,1.005,6.2,8.615,8.615,0,0,0,1.512,2.384A.291.291,0,0,1,26.227,25.172Z"
                                fill="#fff"
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 2 ? (
                      <div className="desc-notification-user ">
                        {/* Meeting SVG COde */}
                        <svg
                          id="Group_169"
                          data-name="Group 169"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="25.206"
                          viewBox="0 0 30.798 25.206"
                        >
                          <path
                            id="Path_20"
                            data-name="Path 20"
                            d="M144.506,13.372a4.143,4.143,0,0,0-4.161-4.146c-7.479-.022-15.029-.022-22.441,0a4.192,4.192,0,0,0-4.153,4.153c-.026,3.5-.028,7.192,0,11.284a4.168,4.168,0,0,0,3.441,4.079,8.947,8.947,0,0,0,1,.11c.179.015.36.028.542.047l.587.058v.591c0,.32,0,.639,0,.956,0,.738.009,1.437-.009,2.152a1.5,1.5,0,0,0,2.616,1.233c1.409-1.14,2.849-2.29,4.241-3.4l1.42-1.133a2.4,2.4,0,0,1,3.084,0l1.839,1.472q1.965,1.571,3.928,3.145a1.469,1.469,0,0,0,2.5-1.2c-.007-.74-.006-1.474,0-2.251v-1.7h.956c.17,0,.315,0,.46,0a4.219,4.219,0,0,0,4.155-4.176C144.538,20.773,144.536,16.978,144.506,13.372Zm-2.871,11.092a1.468,1.468,0,0,1-.4,1.088,1.538,1.538,0,0,1-1.124.4c-.747-.006-1.492,0-2.238,0l-.058,0c-1.226,0-1.751.525-1.755,1.75v2.26L135,29.121l-1.047-.831c-.784-.622-1.524-1.209-2.255-1.809a2.14,2.14,0,0,0-1.489-.533c-.632.009-1.127.007-1.526,0a4.728,4.728,0,0,0-1.427.091,5.271,5.271,0,0,0-1.226.872c-.289.233-.637.518-1.073.859-.348.274-.695.552-1.083.861L122.2,29.966V27.69c-.006-1.215-.537-1.733-1.774-1.737l-.548,0c-.548,0-1.116-.006-1.669.006a1.573,1.573,0,0,1-1.17-.4,1.59,1.59,0,0,1-.421-1.181q.006-2.884,0-5.769,0-2.448,0-4.895c0-1.418.838-1.614,1.744-1.614q7.935,0,15.871,0l5.124,0c.248,0,.5,0,.745,0h.026a1.5,1.5,0,0,1,1.1.4,1.48,1.48,0,0,1,.406,1.1Q141.637,19.026,141.635,24.464Z"
                            transform="translate(-113.731 -9.21)"
                            fill="#fff"
                          />
                          <path
                            id="Path_89"
                            data-name="Path 89"
                            d="M7.666,8.328H22.7"
                            fill="none"
                            stroke="#fff"
                            stroke-linecap="round"
                            stroke-width="2"
                          />
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 3 ? (
                      <div className="desc-notification-user ">
                        {/* Attachment Pin SVG COde */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="26.281"
                          viewBox="0 0 22.996 26.281"
                        >
                          <path
                            id="Icon_metro-attachment"
                            data-name="Icon metro-attachment"
                            d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                            transform="translate(-3.535 -1.928)"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 4 ? (
                      <div className="desc-notification-user">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="26.281"
                          viewBox="0 0 22.996 26.281"
                        >
                          <path
                            id="Icon_metro-attachment"
                            data-name="Icon metro-attachment"
                            d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                            transform="translate(-3.535 -1.928)"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 5 ? (
                      <div className="desc-notification-user ">
                        {/* Cancel SVG Code */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="27.036"
                          viewBox="0 0 27.036 27.036"
                        >
                          <g
                            id="Group_170"
                            data-name="Group 170"
                            transform="translate(-1246.032 -210.482)"
                          >
                            <path
                              id="Path_90"
                              data-name="Path 90"
                              d="M1268.654,210.448l-24.207,24.207"
                              transform="translate(3 1.448)"
                              fill="none"
                              stroke="#fff"
                              stroke-linecap="round"
                              stroke-width="2"
                            />
                            <path
                              id="Path_91"
                              data-name="Path 91"
                              d="M1268.654,210.448l-24.207,24.207"
                              transform="translate(1036.998 1480.55) rotate(-90)"
                              fill="none"
                              stroke="#fff"
                              stroke-linecap="round"
                              stroke-width="2"
                            />
                          </g>
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 6 ? (
                      <div className="desc-notification-user ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="26.281"
                          viewBox="0 0 22.996 26.281"
                        >
                          <path
                            id="Icon_metro-attachment"
                            data-name="Icon metro-attachment"
                            d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                            transform="translate(-3.535 -1.928)"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 7 ? (
                      <div className="desc-notification-user ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="26.281"
                          viewBox="0 0 22.996 26.281"
                        >
                          <path
                            id="Icon_metro-attachment"
                            data-name="Icon metro-attachment"
                            d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                            transform="translate(-3.535 -1.928)"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 8 ? (
                      <div className="desc-notification-user ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="26.281"
                          viewBox="0 0 22.996 26.281"
                        >
                          <path
                            id="Icon_metro-attachment"
                            data-name="Icon metro-attachment"
                            d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                            transform="translate(-3.535 -1.928)"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    ) : recentActivityData.notificationTypes.pK_NTID === 9 ? (
                      <div className="desc-notification-user ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="26.281"
                          viewBox="0 0 22.996 26.281"
                        >
                          <path
                            id="Icon_metro-attachment"
                            data-name="Icon metro-attachment"
                            d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                            transform="translate(-3.535 -1.928)"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="desc-notification-user ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="26.281"
                          viewBox="0 0 22.996 26.281"
                        >
                          <path
                            id="Icon_metro-attachment"
                            data-name="Icon metro-attachment"
                            d="M19.8,10.322,18.135,8.656,9.8,16.99a3.536,3.536,0,0,0,5,5l10-10a5.894,5.894,0,0,0-8.336-8.334l-10.5,10.5-.022.022A8.22,8.22,0,0,0,17.569,25.8l.021-.022h0l7.169-7.168-1.668-1.666-7.169,7.167-.022.022a5.862,5.862,0,0,1-8.292-8.289l.023-.022v0l10.5-10.5a3.536,3.536,0,1,1,5,5l-10,10a1.179,1.179,0,1,1-1.668-1.666L19.8,10.322Z"
                            transform="translate(-3.535 -1.928)"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    )}
                  </Col>
                  <Col sm={10}>
                    <Row>
                      <Col sm={10} md={10} lg={10}>
                        {recentActivityData.notificationTypes.description}
                      </Col>
                      <Col sm={2} md={2} lg={2}>
                        {
                          <TimeAgo
                            datetime={forRecentActivity(
                              recentActivityData.creationDateTime
                            )}
                            locale="en"
                          />
                        }
                      </Col>
                    </Row>
                  </Col>
                </Row>
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
