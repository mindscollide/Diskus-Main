import React from "react";
import styles from "./PresenterMeetingView.module.css";
import { Col, Row, Container, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import VideoOn from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import NonActiveScreenShare from "./../../../../../components/layout/talk/talk-Video/video-images/Screen Share Purple.svg";
import TileView from "./../../../../../components/layout/talk/talk-Video/video-images/Tile View 1 Purple.svg";
import CopyLink from "./../../../../../components/layout/talk/talk-Video/video-images/Copy Link Purple.svg";
import ParticipantsIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Users Purple.svg";
import CallEndRedIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Call End Red.svg";
import ExpandIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Purple.svg";
import PauseWhite from "../../../../../assets/images/Recent Activity Icons/Video/PauseWhite.png";
import WhiteParticipant from "../../../../../assets/images/Recent Activity Icons/Video/WhiteParticipant.png";
import ScreenShareWhite from "../../../../../assets/images/Recent Activity Icons/Video/ScreenShareWhite.png";
import LoaderSpinner from "../../../../../assets/images/Recent Activity Icons/Video/Subtract.png";
import NormalizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Collapse.svg";
import ExpandIconWhite from "../../../../../assets/images/Recent Activity Icons/Video/ExpandIconWhite.png";

import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { minimizePresenterGlobalState } from "../../../../../store/actions/VideoFeature_actions";

const PresenterMeetingView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const minimizePresenterReducer = useSelector(
    (state) => state.videoFeatureReducer.minimizePresenterReducer
  );

  // slow Presenter internet connection Reducer
  const slowPresenterInternet = useSelector(
    (state) => state.videoFeatureReducer.slowPresenterInternet
  );

  console.log(slowPresenterInternet, "CheckInInInIn");

  const onClickMinimize = () => {
    dispatch(minimizePresenterGlobalState(true));
  };

  const onClickMaximize = () => {
    dispatch(minimizePresenterGlobalState(false));
  };

  return (
    <>
      <Container>
        <div
          className={
            minimizePresenterReducer
              ? styles["presenter-minimize-class"]
              : styles["Presenter-main-class"]
          }
        >
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div>
                <Row>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <p
                      className={
                        minimizePresenterReducer
                          ? styles["Presenter-Title-Minimize"]
                          : styles["Presenter-Title"]
                      }
                    >
                      {t("Meeting-Title-Here")}
                    </p>
                  </Col>
                  <Col
                    lg={8}
                    md={8}
                    sm={12}
                    className={styles["Presenter-Images"]}
                  >
                    {minimizePresenterReducer && (
                      <Tooltip placement="topRight" title={t("Pause")}>
                        <img src={PauseWhite} alt="Pause" />
                      </Tooltip>
                    )}
                    <Tooltip placement="topRight" title={t("Enable-video")}>
                      <img src={VideoOn} alt="Video" />
                    </Tooltip>
                    <Tooltip placement="topRight" title={t("Mic-enable")}>
                      <img src={MicOff} alt="Mic" />
                    </Tooltip>
                    <Tooltip placement="topRight" title={t("Screen-share")}>
                      <img
                        src={
                          minimizePresenterReducer
                            ? ScreenShareWhite
                            : NonActiveScreenShare
                        }
                        alt="ScreenShare"
                      />
                    </Tooltip>
                    {!minimizePresenterReducer && (
                      <Tooltip placement="topRight" title={t("Layout")}>
                        <img src={TileView} alt="Layout" />
                      </Tooltip>
                    )}
                    <Tooltip placement="topRight" title={t("Copy-link")}>
                      <img src={CopyLink} alt="CopyLink" />
                    </Tooltip>
                    <Tooltip placement="topRight" title={t("Participants")}>
                      <img
                        src={
                          minimizePresenterReducer
                            ? WhiteParticipant
                            : ParticipantsIcon
                        }
                        alt="Participants"
                      />
                    </Tooltip>
                    {!minimizePresenterReducer && (
                      <Tooltip placement="topRight" title={t("Minimize")}>
                        <img
                          src={MinimizeIcon}
                          alt="Minimize"
                          onClick={onClickMinimize}
                          className={styles["presenter-img-cursor"]}
                        />
                      </Tooltip>
                    )}
                    <Tooltip placement="topRight" title={t("Expand")}>
                      <img
                        src={
                          minimizePresenterReducer
                            ? ExpandIconWhite
                            : NormalizeIcon
                        }
                        alt="Expand"
                        className={styles["presenter-img-cursor"]}
                        onClick={onClickMaximize}
                      />
                    </Tooltip>
                  </Col>
                </Row>

                {!minimizePresenterReducer && (
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      {slowPresenterInternet !== "" ? (
                        <>
                          <div
                            className={styles["Slow-Internet-SpinnerPresenter"]}
                          >
                            <Row className={styles["spinner-row-class"]}>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center align-items-center"
                              >
                                <Spinner
                                  animation="border"
                                  variant="light"
                                  className={styles["custom-spinner"]}
                                />
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles["iframe-class-presenter"]}>
                            <h2>{t("Iframe")}</h2>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default PresenterMeetingView;
