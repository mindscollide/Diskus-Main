import React, { useContext } from "react";
import styles from "./NewEndMeetingModal.module.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../components/elements";
import {
  LeaveCurrentMeeting,
  LeaveMeetingVideo,
  showEndMeetingModal,
} from "../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { getCurrentDateTimeUTC } from "../../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../context/MeetingContext";
import {
  isSharedScreenTriggeredApi,
  leavePresenterViewMainApi,
  leavePresenterViewMainApiTest,
  participantWaitingListBox,
  screenShareTriggeredGlobally,
  setRaisedUnRaisedParticiant,
  stopPresenterViewMainApi,
  stopPresenterViewMainApiTest,
  toggleParticipantsVisibility,
} from "../../../../store/actions/VideoFeature_actions";

const NewEndMeetingModal = () => {
  const {
    setCancelConfirmationModal,
    setEditorRole,
    setAdvanceMeetingModalID,
    setViewAdvanceMeetingModal,
    advanceMeetingModalID,
  } = useMeetingContext();

  const {
    startRecordingState,
    pauseRecordingState,
    resumeRecordingState,
    stopRecordingState,
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    setStopRecordingState,
    iframeRef,
  } = useContext(MeetingContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );
  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterStartedFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterStartedFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare
  );

  const endMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.endMeetingModal
  );

  //When Host Stop Recording
  const onHandleClickForStopRecording = () => {
    console.log("RecordingStopMsgFromIframe");
    setStartRecordingState(true);
    setPauseRecordingState(false);
    setResumeRecordingState(false);
    setStopRecordingState(false);

    let isCaller = JSON.parse(localStorage.getItem("isCaller"));
    let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    let CallType = Number(localStorage.getItem("CallType"));

    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    if (isZoomEnabled) {
      if (
        (isMeeting && isMeetingVideo && isMeetingVideoHostCheck) ||
        (presenterViewFlag && presenterViewHostFlag)
      ) {
        console.log("RecordingStopMsgFromIframe");
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
          console.log("RecordingStopMsgFromIframe");
        }
      } else {
        if (isCaller) {
          if (CallType === 1 || CallType === 2) {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(
                "RecordingStopMsgFromIframe",
                "*"
              );
              console.log("RecordingStopMsgFromIframe");
            }
          }
        }
      }
    }
  };

  const handleClickContinue = async () => {
    // setCancelConfirmationModal(false);

    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let newRoomID = localStorage.getItem("newRoomId");
    let isGuid = localStorage.getItem("isGuid");
    let participantUID = localStorage.getItem("participantUID");
    let UID = isMeetingVideoHostCheck ? isGuid : participantUID;
    let newName = localStorage.getItem("name");
    let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
    let participantRoomId = localStorage.getItem("participantRoomId");
    let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
    let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    let isSharedSceenEnable = JSON.parse(
      localStorage.getItem("isSharedSceenEnable")
    );

    if (presenterViewHostFlag || presenterViewJoinFlag) {
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );
      let participantUID = localStorage.getItem("participantUID");
      let roomID = localStorage.getItem("acceptedRoomID");
      let currentUserName = localStorage.getItem("name");
      let isGuid = localStorage.getItem("isGuid");
      let RoomID = presenterViewFlag
        ? roomID
        : isMeetingVideoHostCheck
        ? newRoomID
        : participantRoomId;
      let UID = isMeetingVideoHostCheck ? isGuid : participantUID;
      dispatch(participantWaitingListBox(false));
      dispatch(toggleParticipantsVisibility(false));
      // if (presenterMeetingId === currentMeeting) {
      console.log("Check Stop");
      if (presenterViewHostFlag) {
        if (presenterStartedFlag) {
          let data = {
            MeetingID: currentMeetingID,
            RoomID: RoomID,
          };
          sessionStorage.setItem("StopPresenterViewAwait", true);
          console.log(data, "presenterViewJoinFlag");
          await dispatch(stopPresenterViewMainApiTest(navigate, t, data, 0));
        } else {
          let data = {
            RoomID: String(RoomID),
            UserGUID: String(UID),
            Name: String(currentUserName),
          };
          await dispatch(leavePresenterViewMainApiTest(navigate, t, data, 2));
        }
      } else if (presenterViewJoinFlag) {
        sessionStorage.removeItem("alreadyInMeetingVideo");
        let data = {
          RoomID: String(callAcceptedRoomID),
          UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
          Name: String(currentUserName),
        };
        await dispatch(leavePresenterViewMainApiTest(navigate, t, data, 1));
      }
    }
    if (isMeeting) {
      if (isMeetingVideo && isMeetingVideoHostCheck) {
        onHandleClickForStopRecording();
        console.log("busyCall");

        // For Stop Screen Share If Host Stop in Meeting Video
        if (isZoomEnabled) {
          if (isSharedSceenEnable && !globallyScreenShare) {
            console.log("busyCall");
            let data = {
              RoomID: newRoomID,
              ShareScreen: false,
              UID: UID,
            };
            dispatch(screenShareTriggeredGlobally(false));
            dispatch(isSharedScreenTriggeredApi(navigate, t, data));
          }
        }
        console.log("busyCall");
        let Data = {
          RoomID: String(newRoomID),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        await dispatch(LeaveMeetingVideo(Data, navigate, t, 4));
      } else if (isMeetingVideo) {
        console.log("busyCall");

        // For Stop Screen Share If Non Host Stop in Meeting Video
        if (isZoomEnabled) {
          if (isSharedSceenEnable && !globallyScreenShare) {
            console.log("busyCall");
            let data = {
              RoomID: participantRoomId,
              ShareScreen: false,
              UID: UID,
            };
            dispatch(screenShareTriggeredGlobally(false));
            dispatch(isSharedScreenTriggeredApi(navigate, t, data));
          }
        }

        let Data = {
          RoomID: String(participantRoomId),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        await dispatch(setRaisedUnRaisedParticiant(false));
        await dispatch(LeaveMeetingVideo(Data, navigate, t, 4));
      }
    }

    let leaveMeetingData = {
      FK_MDID: Number(advanceMeetingModalID),
      DateTime: getCurrentDateTimeUTC(),
    };
    await dispatch(
      LeaveCurrentMeeting(
        navigate,
        t,
        leaveMeetingData,
        false,
        false,
        setEditorRole,
        setAdvanceMeetingModalID,
        setViewAdvanceMeetingModal,
        setCancelConfirmationModal
      )
    );
    localStorage.removeItem("NotificationAdvanceMeetingID");
    localStorage.removeItem("QuickMeetingCheckNotification");
    localStorage.removeItem("viewadvanceMeetingPolls");
    localStorage.removeItem("NotificationClickPollID");
    localStorage.removeItem("AdvanceMeetingOperations");
    localStorage.removeItem("NotificationClickTaskID");
    localStorage.removeItem("viewadvanceMeetingTask");
    localStorage.setItem("isMeeting", false);
  };
  const handleClickDiscard = () => {
    console.log("NewEndLeaveMeeting");
    localStorage.setItem("navigateLocation", "Meeting");
    dispatch(showEndMeetingModal(false));
  };
  return (
    <section>
      <Modal
        show={endMeetingModal}
        setShow={dispatch(showEndMeetingModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        backdrop="static"
        keyboard={false}
        className={styles["classOfMeetingModal"]}
        onHide={() => {
          dispatch(showEndMeetingModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["EndMeetingTextStyles"]}>
                  {t("Are-you-sure-you-want-to-leave")}
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["EndMeetingTextStyles"]}>
                  {t("The-meeting")}
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
                  text={t("No")}
                  className={styles["Yes_unsave_File_Upload"]}
                  onClick={handleClickDiscard}
                />
                <Button
                  text={t("Yes")}
                  className={styles["No_unsave_File_Upload"]}
                  onClick={handleClickContinue}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default NewEndMeetingModal;
