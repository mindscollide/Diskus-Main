/**
 * NonMeetingVideoModal
 *
 * This modal is responsible for handling confirmation before:
 * - Leaving one-to-one call
 * - Leaving group call
 * - Leaving presenter view
 * - Leaving dashboard video
 * - Joining a meeting while another video session is active
 *
 * It handles multiple video states:
 * - Zoom recording stop
 * - Presenter view transitions
 * - Active call cleanup
 * - Dispatching leave call APIs
 */

import React from "react";
import styles from "./NonMeetingVideoModal.module.css";
import { Col, Row } from "react-bootstrap";
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
} from "../../../../../store/actions/VideoFeature_actions";

import { LeaveCall } from "../../../../../store/actions/VideoMain_actions";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const NonMeetingVideoModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Context values from MeetingContext
   * These control presenter view, recording state, and one-to-one/group transitions
   */
  const {
    setLeaveOneToOne,
    joinPresenterForOneToOneOrGroup,
    startPresenterViewOrLeaveOneToOne,
    setLeavePresenterViewToJoinOneToOne,
    setPresenterForOneToOneOrGroup,
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    pauseRecordingState,
    resumeRecordingState,
    setStopRecordingState,
    iframeRef,
    setIsVisible,
  } = useMeetingContext();

  /**
   * Redux Selectors
   */
  const nonMeetingVideoCheckModal = useSelector(
    (state) => state.videoFeatureReducer.nonMeetingVideo,
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag,
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag,
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag,
  );

  /**
   * LocalStorage values
   * These are used to determine current video session type and behavior
   */
  let currentMeeting = localStorage.getItem("currentMeetingID");
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  let isCaller = JSON.parse(localStorage.getItem("isCaller"));
  let CallType = Number(localStorage.getItem("CallType"));
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let isMeetingVideoHostChecker = JSON.parse(
    localStorage.getItem("isMeetingVideoHostChecker"),
  );

  let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let initiateCallRoomID = String(localStorage.getItem("initiateCallRoomID"));
  let currentCallType = Number(localStorage.getItem("callTypeID"));

  /**
   * Stops Zoom recording if active.
   * Sends postMessage to iframe to stop recording.
   * Returns Promise to ensure execution completes before proceeding.
   */
  const onHandleClickForStopRecording = () => {
    return new Promise((resolve) => {
      console.log("Stopping Recording from iframe");

      // Reset recording states
      setStartRecordingState(true);
      setPauseRecordingState(false);
      setResumeRecordingState(false);
      setStopRecordingState(false);

      if (isZoomEnabled) {
        const iframe = iframeRef.current;

        const sendMessage = () => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
          }

          // Small delay to ensure iframe processes message
          setTimeout(() => {
            resolve();
          }, 100);
        };

        /**
         * Host-specific delay handling
         * Host needs slight delay before stopping recording
         */
        if (
          isMeeting &&
          isMeetingVideo &&
          isMeetingVideoHostChecker &&
          !presenterViewJoinFlag &&
          !presenterViewHostFlag
        ) {
          setTimeout(sendMessage, 1000);
        } else {
          if (isCaller && (CallType === 1 || CallType === 2)) {
            sendMessage();
          } else {
            resolve();
          }
        }
      } else {
        resolve();
      }
    });
  };

  /**
   * NO Button Handler
   * Closes modal and restores presenter view if required
   */
  const onClickOnNoMeetingModal = () => {
    let JoinpresenterForonetoone = JSON.parse(
      localStorage.getItem("JoinpresenterForonetoone"),
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

  /**
   * YES Button Handler
   * This is the main logic handler.
   * Handles multiple cases:
   * - Leaving presenter view
   * - Leaving one-to-one
   * - Leaving group call
   * - Stopping recording
   * - Cleaning active call
   * - Joining meeting video after cleanup
   */
  const onClickOnYesMeetingModal = async () => {
    let JoinpresenterForonetoone = JSON.parse(
      localStorage.getItem("JoinpresenterForonetoone"),
    );

    if (JoinpresenterForonetoone) {
      dispatch(nonMeetingVideoGlobalModal(false));
      localStorage.removeItem("JoinpresenterForonetoone");
      setPresenterForOneToOneOrGroup(true);
      setLeaveOneToOne(true);
    } else if (

    /**
     * Presenter View Active Case
     */
      presenterViewFlag &&
      (presenterViewHostFlag || presenterViewJoinFlag)
    ) {
      if (isZoomEnabled && (pauseRecordingState || resumeRecordingState)) {
        await onHandleClickForStopRecording();
      }

      setIsVisible(false);
      setLeavePresenterViewToJoinOneToOne(true);
      await dispatch(nonMeetingVideoGlobalModal(false));
    } else if (

    /**
     * Active One-to-One or Group Call Case
     */
      activeCallState &&
      (currentCallType === 1 || currentCallType === 2)
    ) {
      await dispatch(nonMeetingVideoGlobalModal(false));
      setLeaveOneToOne(true);
    } else {

    /**
     * Default Case:
     * Cleanup dashboard video and leave call
     */
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));

      localStorage.setItem("activeCall", false);
      sessionStorage.setItem("activeCallSessionforOtoandGroup", false);
      localStorage.setItem("initiateVideoCall", false);

      if (isZoomEnabled && (pauseRecordingState || resumeRecordingState)) {
        await onHandleClickForStopRecording();
      }

      let Data = {
        OrganizationID: currentOrganization,
        RoomID: initiateCallRoomID,
        IsCaller: true,
        CallTypeID: currentCallType,
      };

      dispatch(LeaveCall(Data, navigate, t));
      await dispatch(nonMeetingVideoGlobalModal(false));
    }
  };

  /**
   * Modal UI
   * Dynamic message based on call/presenter state
   */
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
          <Row>
            <Col lg={12}>
              <span className={styles["NonMeetingVideo-Message"]}>
                {presenterViewFlag && presenterViewHostFlag
                  ? t("Are-you-sure-you-want-to-stop-presenter-view")
                  : activeCallState && currentCallType === 1
                    ? t("Are-You-Sure-you-Want-to-Leave-One-to-One")
                    : activeCallState && currentCallType === 2
                      ? t("Are-You-Sure-you-Want-to-Leave-group-call")
                      : t("Are-You-Sure-you-Want-to-Leave-video")}
              </span>
            </Col>
          </Row>
        }
        ModalFooter={
          <Row>
            <Col className="d-flex justify-content-center gap-2">
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
        }
      />
    </section>
  );
};

export default NonMeetingVideoModal;
