import React, { useState } from "react";
import styles from "./PresenterMeetingView.module.css";
import { Col, Row, Container, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import VideoOn from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOnMinimize from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Video Enabled.svg";
import MicOn from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Mic Enabled.svg";
import MicOn2 from "./../../../../../components/layout/talk/talk-Video/video-images/Mic Enabled Purple.svg";
import RaiseHand from "./../../../../../components/layout/talk/talk-Video/video-images/Raise Hand Purple.svg";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import NonActiveScreenShare from "./../../../../../components/layout/talk/talk-Video/video-images/Screen Share Purple.svg";
import TileView from "./../../../../../components/layout/talk/talk-Video/video-images/Tile View 1 Purple.svg";
import CopyLink from "./../../../../../components/layout/talk/talk-Video/video-images/Copy Link Purple.svg";
import ParticipantsIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Users Purple.svg";
import ExpandIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Purple.svg";
import CallEndRedIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Call End Red.svg";
import PauseWhite from "../../../../../assets/images/Recent Activity Icons/Video/PauseWhite.png";
import WhiteParticipant from "../../../../../assets/images/Recent Activity Icons/Video/WhiteParticipant.png";
import ScreenShareWhite from "../../../../../assets/images/Recent Activity Icons/Video/ScreenShareWhite.png";
import NormalizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Collapse.svg";
import ExpandIconWhite from "../../../../../assets/images/Recent Activity Icons/Video/ExpandIconWhite.png";

import Raisehandselected from "../../../../../assets/images/Recent Activity Icons/Video/Raisehandselected.png";
import GreyCollapse from "../../../../../assets/images/Recent Activity Icons/Video/GreyCollapse.png";
import GreyCopylink from "../../../../../assets/images/Recent Activity Icons/Video/GreyCopylink.png";
import GreyHandRaise from "../../../../../assets/images/Recent Activity Icons/Video/GreyHandRaise.png";
import GreyMinimize from "../../../../../assets/images/Recent Activity Icons/Video/GreyMinimize.png";
import GreyParticipants from "../../../../../assets/images/Recent Activity Icons/Video/GreyParticipants.png";
import GreyScreenShare from "../../../../../assets/images/Recent Activity Icons/Video/GreyScreenShare.png";
import GreyTile from "../../../../../assets/images/Recent Activity Icons/Video/GreyTile.png";

import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import {
  minimizePresenterGlobalState,
  presenterModalLeave,
  startPresenterGlobal,
} from "../../../../../store/actions/VideoFeature_actions";

const PresenterMeetingView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //For Minimize State Reducer
  const minimizePresenterReducer = useSelector(
    (state) => state.videoFeatureReducer.minimizePresenterReducer
  );

  // slow Presenter internet connection Reducer
  const slowPresenterInternet = useSelector(
    (state) => state.videoFeatureReducer.slowPresenterInternet
  );

  let meetingTitleName = localStorage.getItem("meetingTitle");
  let meetingVideoCheck = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck")
  );

  const [participantListPresenter, setParticipantListPresenter] =
    useState(false);

  const onClickMinimize = () => {
    dispatch(minimizePresenterGlobalState(true));
  };

  const onClickMaximize = () => {
    dispatch(minimizePresenterGlobalState(false));
  };

  const onClickParticipantPresenter = () => {
    setParticipantListPresenter(!participantListPresenter);
  };

  const onClickLeavePresentation = () => {
    dispatch(minimizePresenterGlobalState(false));
    dispatch(startPresenterGlobal(false));
    dispatch(presenterModalLeave(false));
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
                  {meetingVideoCheck ? (
                    <>
                      <Col
                        lg={6}
                        md={6}
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
                          {meetingTitleName.length !== null &&
                          meetingTitleName.length > 50
                            ? `${meetingTitleName.substring(0, 50)}...`
                            : meetingTitleName}
                        </p>
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={12}
                        className={styles["Presenter-Images"]}
                      >
                        {minimizePresenterReducer && (
                          <Tooltip placement="topRight" title={t("Pause")}>
                            <img src={PauseWhite} alt="Pause" />
                          </Tooltip>
                        )}
                        {minimizePresenterReducer ? (
                          <Tooltip placement="topRight" title={t("Mic-enable")}>
                            <img src={MicOn} alt="Mic" />
                          </Tooltip>
                        ) : (
                          <Tooltip placement="topRight" title={t("Mic-enable")}>
                            <img src={MicOff} alt="Mic" />
                          </Tooltip>
                        )}
                        {minimizePresenterReducer ? (
                          <Tooltip
                            placement="topRight"
                            title={t("Enable-video")}
                          >
                            <img src={VideoOnMinimize} alt="Video" />
                          </Tooltip>
                        ) : (
                          <Tooltip
                            placement="topRight"
                            title={t("Enable-video")}
                          >
                            <img src={VideoOff} alt="Video" />
                          </Tooltip>
                        )}
                        <Tooltip placement="topRight" title={t("Participants")}>
                          <img
                            src={
                              minimizePresenterReducer
                                ? WhiteParticipant
                                : ParticipantsIcon
                            }
                            alt="Participants"
                            className="cursor-pointer"
                            onClick={onClickParticipantPresenter}
                          />
                          <div className={"position-relative"}>
                            {participantListPresenter ? (
                              <>
                                <div
                                  className={
                                    minimizePresenterReducer
                                      ? styles["participants-minimize-list"]
                                      : styles["participants-list-presenter"]
                                  }
                                >
                                  <Row>
                                    <Col
                                      lg={8}
                                      md={8}
                                      sm={12}
                                      className="d-flex justify-content-start"
                                    >
                                      <p>Asad Jaffri</p>
                                    </Col>
                                    <Col
                                      lg={4}
                                      md={4}
                                      sm={12}
                                      className="d-flex justify-content-end gap-3"
                                    >
                                      <img
                                        src={MicOn2}
                                        alt="Mic"
                                        width="20px"
                                        height="20px"
                                      />
                                      <img
                                        src={RaiseHand}
                                        alt="RaiseHand"
                                        width="20px"
                                        height="20px"
                                      />
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col
                                      lg={8}
                                      md={8}
                                      sm={12}
                                      className="d-flex justify-content-start"
                                    >
                                      <p>Mehdi Hassan</p>
                                    </Col>
                                    <Col
                                      lg={4}
                                      md={4}
                                      sm={12}
                                      className="d-flex justify-content-end gap-3"
                                    >
                                      <img
                                        src={MicOn2}
                                        alt="Mic"
                                        width="20px"
                                        height="20px"
                                      />
                                      <img
                                        src={RaiseHand}
                                        alt="RaiseHand"
                                        width="20px"
                                        height="20px"
                                      />
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col
                                      lg={8}
                                      md={8}
                                      sm={12}
                                      className="d-flex justify-content-start"
                                    >
                                      <p>Ali Raza Mamdani</p>
                                    </Col>
                                    <Col
                                      lg={4}
                                      md={4}
                                      sm={12}
                                      className="d-flex justify-content-end gap-3"
                                    >
                                      <img
                                        src={MicOn2}
                                        alt="Mic"
                                        width="20px"
                                        height="20px"
                                      />
                                      <img
                                        src={RaiseHand}
                                        alt="RaiseHand"
                                        width="20px"
                                        height="20px"
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </Tooltip>
                        {!minimizePresenterReducer && (
                          <Tooltip placement="topRight" title={t("Layout")}>
                            <img src={TileView} alt="Layout" />
                          </Tooltip>
                        )}
                        <Tooltip placement="topRight" title={t("Copy-link")}>
                          <img src={CopyLink} alt="CopyLink" />
                          {/* <CopyLinkIcon /> */}
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
                    </>
                  ) : (
                    <>
                      <Col
                        lg={6}
                        md={6}
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
                          {meetingTitleName.length !== null &&
                          meetingTitleName.length > 50
                            ? `${meetingTitleName.substring(0, 50)}...`
                            : meetingTitleName}
                        </p>
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={12}
                        className={styles["Presenter-Images"]}
                      >
                        <Tooltip placement="topRight" title={t("Mic-enable")}>
                          <img src={MicOff} alt="Mic" />
                        </Tooltip>

                        <Tooltip placement="topRight" title={t("Enable-video")}>
                          <img src={VideoOff} alt="Video" />
                        </Tooltip>
                        <Tooltip placement="topRight" title={t("Participants")}>
                          <img
                            src={
                              minimizePresenterReducer
                                ? WhiteParticipant
                                : GreyParticipants
                            }
                            alt="Participants"
                            className="cursor-pointer"
                          />
                        </Tooltip>
                        {!minimizePresenterReducer && (
                          <Tooltip placement="topRight" title={t("Layout")}>
                            <img src={GreyTile} alt="Layout" />
                          </Tooltip>
                        )}
                        <Tooltip placement="topRight" title={t("Copy-link")}>
                          <img src={GreyCopylink} alt="CopyLink" />
                        </Tooltip>
                        {!minimizePresenterReducer && (
                          <Tooltip placement="topRight" title={t("Hand-raise")}>
                            <img src={GreyHandRaise} alt="HandRaise" />
                          </Tooltip>
                        )}
                        <Tooltip placement="topRight" title={t("Screen-share")}>
                          <img
                            src={
                              minimizePresenterReducer
                                ? ScreenShareWhite
                                : GreyScreenShare
                            }
                            alt="ScreenShare"
                          />
                        </Tooltip>
                        {!minimizePresenterReducer && (
                          <Tooltip placement="topRight" title={t("Minimize")}>
                            <img
                              src={GreyMinimize}
                              alt="GreyMinimize"
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
                                : GreyCollapse
                            }
                            alt="Expand"
                            className={styles["presenter-img-cursor"]}
                            onClick={onClickMaximize}
                          />
                        </Tooltip>

                        {!minimizePresenterReducer && (
                          <Tooltip placement="topRight" title={t("End Call")}>
                            <img
                              src={CallEndRedIcon}
                              alt="End Call"
                              className={styles["presenter-img-cursor"]}
                              onClick={onClickLeavePresentation}
                            />
                          </Tooltip>
                        )}
                      </Col>
                    </>
                  )}
                </Row>

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
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default PresenterMeetingView;
