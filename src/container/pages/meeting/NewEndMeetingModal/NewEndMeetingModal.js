import React from "react";
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
import { useMeetingContext } from "../../../../context/MeetingContext";
import {
  leavePresenterViewMainApi,
  leavePresenterViewMainApiTest,
  participantWaitingListBox,
  setRaisedUnRaisedParticiant,
  stopPresenterViewMainApi,
  stopPresenterViewMainApiTest,
  toggleParticipantsVisibility,
} from "../../../../store/actions/VideoFeature_actions";

const NewEndMeetingModal = () => {
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
  const {
    setCancelConfirmationModal,
    setEditorRole,
    setAdvanceMeetingModalID,
    setViewAdvanceMeetingModal,
    advanceMeetingModalID,
  } = useMeetingContext();
  const endMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.endMeetingModal
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClickContinue = async () => {
    // setCancelConfirmationModal(false);

    let isMeeting = localStorage.getItem("isMeeting");
    let isMeetingVideo = localStorage.getItem("isMeetingVideo");
    let isMeetingVideoHostCheck = localStorage.getItem(
      "isMeetingVideoHostCheck"
    );
    let newRoomID = localStorage.getItem("newRoomId");
    let isGuid = localStorage.getItem("isGuid");
    let participantUID = localStorage.getItem("participantUID");
    let UID = isMeetingVideoHostCheck ? isGuid : participantUID;
    let newName = localStorage.getItem("name");
    let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
    let participantRoomId = localStorage.getItem("participantRoomId");
    let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");

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
    localStorage.removeItem("isMeeting");
  };
  const handleClickDiscard = () => {
    console.log("NewEndLeaveMeeting");

    dispatch(showEndMeetingModal(false));
  };
  return (
    <section>
      <Modal
        show={endMeetingModal}
        setShow={dispatch(showEndMeetingModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
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
