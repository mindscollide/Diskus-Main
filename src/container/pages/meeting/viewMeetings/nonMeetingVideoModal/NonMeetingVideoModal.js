import React, { useState, useEffect } from "react";
import styles from "./NonMeetingVideoModal.module.css";
import { Col, Row, Container } from "react-bootstrap";
import { Button, Modal } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getParticipantMeetingJoinMainApi,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  nonMeetingVideoGlobalModal,
  normalizeVideoPanelFlag,
  presenterViewGlobalState,
  stopPresenterViewMainApi,
} from "../../../../../store/actions/VideoFeature_actions";
import {
  LeaveCall,
  VideoCallResponse,
} from "../../../../../store/actions/VideoMain_actions";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const NonMeetingVideoModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    setLeaveOneToOne,
    joinPresenterForOneToOneOrGroup,
    startPresenterViewOrLeaveOneToOne,
    setLeavePresenterViewToJoinOneToOne,
    setPresenterForOneToOneOrGroup,
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    startRecordingState,
    pauseRecordingState,
    resumeRecordingState,
    stopRecordingState,
    setStopRecordingState,
    iframeRef,
    setIsVisible,
  } = useMeetingContext();
  const nonMeetingVideoCheckModal = useSelector(
    (state) => state.videoFeatureReducer.nonMeetingVideo
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  let currentMeeting = localStorage.getItem("currentMeetingID");
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  let isCaller = JSON.parse(localStorage.getItem("isCaller"));
  let CallType = Number(localStorage.getItem("CallType"));
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let isMeetingVideoHostChecker = JSON.parse(
    localStorage.getItem("isMeetingVideoHostChecker")
  );

  let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let initiateCallRoomID = String(localStorage.getItem("initiateCallRoomID"));
  let currentCallType = Number(localStorage.getItem("callTypeID"));

  const onHandleClickForStopRecording = () => {
    return new Promise((resolve) => {
      console.log("RecordingStopMsgFromIframe");

      setStartRecordingState(true);
      setPauseRecordingState(false);
      setResumeRecordingState(false);
      setStopRecordingState(false);

      if (isZoomEnabled) {
        const iframe = iframeRef.current;

        const sendMessage = () => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
            console.log("RecordingStopMsgFromIframe");
          }

          // Slight delay to allow iframe to process the message
          setTimeout(() => {
            resolve();
          }, 100);
        };

        // Host-specific path
        if (
          isMeeting &&
          isMeetingVideo &&
          isMeetingVideoHostChecker &&
          !presenterViewJoinFlag &&
          !presenterViewHostFlag
        ) {
          setTimeout(sendMessage, 1000); // 1s delay for host
        } else {
          if (isCaller && (CallType === 1 || CallType === 2)) {
            sendMessage(); // Immediate for caller
          } else {
            resolve(); // If none of the conditions matched, resolve immediately
          }
        }
      } else {
        resolve(); // Zoom not enabled, no message needed
      }
    });
  };

  //handle NO button
  const onClickOnNoMeetingModal = () => {
    let JoinpresenterForonetoone = JSON.parse(
      localStorage.getItem("JoinpresenterForonetoone")
    );

    dispatch(nonMeetingVideoGlobalModal(false));
    if (JoinpresenterForonetoone) {
      localStorage.removeItem("JoinpresenterForonetoone");
      dispatch(presenterViewGlobalState(currentMeeting, true, false, false));
    } else if (joinPresenterForOneToOneOrGroup) {
      dispatch(presenterViewGlobalState(currentMeeting, true, false, false));
    } else if (presenterViewFlag && !presenterViewHostFlag) {
      dispatch(presenterViewGlobalState(currentMeeting, true, false, false));
    }
  };

  // handle click on Yes Meeting Modal
  const onClickOnYesMeetingModal = async () => {
    console.log("busyCall");
    let JoinpresenterForonetoone = JSON.parse(
      localStorage.getItem("JoinpresenterForonetoone")
    );
    let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
    if (JoinpresenterForonetoone) {
      dispatch(nonMeetingVideoGlobalModal(false));
      localStorage.removeItem("JoinpresenterForonetoone");
      setPresenterForOneToOneOrGroup(true);
      console.log("setLeaveOneToOne");
      setLeaveOneToOne(true);
    } else if (joinPresenterForOneToOneOrGroup) {
      console.log("busyCall");
      await dispatch(nonMeetingVideoGlobalModal(false));
      console.log("setLeaveOneToOne");
      setLeaveOneToOne(true);
    } else if (startPresenterViewOrLeaveOneToOne) {
      console.log("busyCall");
      await dispatch(nonMeetingVideoGlobalModal(false));
      console.log("setLeaveOneToOne");
      setLeaveOneToOne(true);
    } else if (
      presenterViewFlag &&
      (presenterViewHostFlag || presenterViewJoinFlag)
    ) {
      console.log("busyCall");
      if (isZoomEnabled) {
        if (pauseRecordingState || resumeRecordingState) {
          console.log("busyCall");
          await onHandleClickForStopRecording();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      setIsVisible(false);
      setLeavePresenterViewToJoinOneToOne(true);
      await dispatch(nonMeetingVideoGlobalModal(false));
    } else if (
      activeCallState &&
      (currentCallType === 1 || currentCallType === 2)
    ) {
      console.log("busyCall");
      await dispatch(nonMeetingVideoGlobalModal(false));
      console.log("setLeaveOneToOne");
      setLeaveOneToOne(true);
    } else {
      console.log("busyCall");
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("initiateVideoCall", false);
      // localStorage.setItem("isCaller", false);
      // localStorage.setItem("isMeeting", true);

      //Before Joining the Meeting Video we should need to make a LeaveCall for Dashboard Video

      if (isZoomEnabled) {
        if (pauseRecordingState || resumeRecordingState) {
          console.log("busyCall");
          await onHandleClickForStopRecording();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      let Data = {
        OrganizationID: currentOrganization,
        RoomID: initiateCallRoomID,
        IsCaller: true,
        CallTypeID: currentCallType,
      };
      await console.log("Check LeaveCall new");
      dispatch(LeaveCall(Data, navigate, t));
      await dispatch(nonMeetingVideoGlobalModal(false));

      // Get The NoneMeetingVideoCall check if true then it'll make a hit for getParticipantMeetingJoinApi
      let getVideoCallMeeting = JSON.parse(
        sessionStorage.getItem("NonMeetingVideoCall")
      );
      if (getVideoCallMeeting) {
        let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
        let data = {
          MeetingId: Number(currentMeeting),
          VideoCallURL: String(currentMeetingVideoURL),
          IsMuted: false,
          HideVideo: false,
        };
        dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
      }
    }
  };

  return (
    <section>
      <Modal
        show={nonMeetingVideoCheckModal}
        setShow={dispatch(nonMeetingVideoGlobalModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        className={styles["modal-background-modal"]}
        onHide={() => {
          dispatch(nonMeetingVideoGlobalModal(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["NonMeetingVideo-Message"]}>
                  {presenterViewFlag && presenterViewHostFlag ? (
                    <>{t("Are-you-sure-you-want-to-stop-presenter-view")}</>
                  ) : activeCallState && currentCallType === 1 ? (
                    <>{t("Are-You-Sure-you-Want-to-Leave-One-to-One")}</>
                  ) : activeCallState && currentCallType === 2 ? (
                    <>{t("Are-You-Sure-you-Want-to-Leave-group-call")}</>
                  ) : (
                    <>{t("Are-You-Sure-you-Want-to-Leave-video")}</>
                  )}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={"Yes"}
                  className={styles["Yes-ButtonFor-NonMeetingVideo"]}
                  onClick={onClickOnYesMeetingModal}
                />
                <Button
                  text={"No"}
                  className={styles["No-ButtonFor-NonMeetingVideo"]}
                  onClick={onClickOnNoMeetingModal}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default NonMeetingVideoModal;
