import React, { useState, useEffect } from "react";
import styles from "./NonMeetingVideoModal.module.css";
import { Col, Row, Container } from "react-bootstrap";
import { Button, Modal } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getParticipantMeetingJoinMainApi,
  incomingVideoCallFlag,
  joinPresenterViewMainApi,
  leavePresenterViewMainApi,
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

  let currentMeeting = localStorage.getItem("currentMeetingID");
  let acceptedRoomID = localStorage.getItem("acceptedRoomID");
  let currentUserId = Number(localStorage.getItem("userID"));
  let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
  let activeRoomID = localStorage.getItem("activeRoomID");
  let NewRoomID = localStorage.getItem("NewRoomID");
  let incomingRoomID = localStorage.getItem("NewRoomID");
  let callTypeID = Number(localStorage.getItem("callTypeID"));
  let getMeetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
  let isGuid = localStorage.getItem("isGuid");
  let participantUID = localStorage.getItem("participantUID");
  let meetingTitle = localStorage.getItem("meetingTitle");
  let videoCallURL = localStorage.getItem("videoCallURL");
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let newRoomId = localStorage.getItem("newRoomId");
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let initiateCallRoomID = String(localStorage.getItem("initiateCallRoomID"));
  let currentCallType = Number(localStorage.getItem("CallType"));

  //handle NO button
  const onClickOnNoMeetingModal = () => {
    dispatch(nonMeetingVideoGlobalModal(false));
    if (joinPresenterForOneToOneOrGroup) {
      dispatch(presenterViewGlobalState(currentMeeting, true, false, false));
    } else if (presenterViewFlag && !presenterViewHostFlag) {
      dispatch(presenterViewGlobalState(currentMeeting, true, false, false));
    }
  };

  // handle click on Yes Meeting Modal
  const onClickOnYesMeetingModal = async () => {
    console.log("busyCall");
    let currentCallType = Number(localStorage.getItem("CallType"));
    let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
    if (joinPresenterForOneToOneOrGroup) {
      console.log("busyCall");
      await dispatch(nonMeetingVideoGlobalModal(false));
      setLeaveOneToOne(true);
    } else if (startPresenterViewOrLeaveOneToOne) {
      console.log("busyCall");
      await dispatch(nonMeetingVideoGlobalModal(false));
      setLeaveOneToOne(true);
    } else if (presenterViewFlag && presenterViewHostFlag && !activeCallState) {
      console.log("busyCall");
      setLeavePresenterViewToJoinOneToOne(true);
      await dispatch(nonMeetingVideoGlobalModal(false));
    } else if (
      presenterViewFlag &&
      !presenterViewHostFlag &&
      !activeCallState
    ) {
      console.log("busyCall");
      setLeavePresenterViewToJoinOneToOne(true);
      await dispatch(nonMeetingVideoGlobalModal(false));
    } else if (activeCallState && currentCallType === 1) {
      console.log("busyCall");
      await dispatch(nonMeetingVideoGlobalModal(false));
      setLeaveOneToOne(true);
    } else {
      console.log("busyCall");
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("initiateVideoCall", false);
      // localStorage.setItem("isCaller", false);
      localStorage.setItem("isMeeting", true);

      //Before Joining the Meeting Video we should need to make a LeaveCall for Dashboard Video

      let Data = {
        OrganizationID: currentOrganization,
        RoomID: initiateCallRoomID,
        IsCaller: true,
        CallTypeID: currentCallType,
      };
      await dispatch(LeaveCall(Data, navigate, t));
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
