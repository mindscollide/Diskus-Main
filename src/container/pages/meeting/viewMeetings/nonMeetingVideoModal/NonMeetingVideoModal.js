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
} from "../../../../../store/actions/VideoFeature_actions";
import { LeaveCall } from "../../../../../store/actions/VideoMain_actions";

const NonMeetingVideoModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const nonMeetingVideoCheckModal = useSelector(
    (state) => state.videoFeatureReducer.nonMeetingVideo
  );

  //handle NO button
  const onClickOnNoMeetingModal = () => {
    dispatch(nonMeetingVideoGlobalModal(false));
  };

  // handle click on Yes Meeting Modal
  const onClickOnYesMeetingModal = async () => {
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    localStorage.setItem("activeCall", false);
    localStorage.setItem("initiateVideoCall", false);
    // localStorage.setItem("isCaller", false);
    localStorage.setItem("isMeeting", true);

    //Before Joining the Meeting Video we should need to make a LeaveCall for Dashboard Video
    let currentOrganization = Number(localStorage.getItem("organizationID"));
    let initiateCallRoomID = String(localStorage.getItem("initiateCallRoomID"));
    let currentCallType = Number(localStorage.getItem("CallType"));
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
      let currentMeeting = localStorage.getItem("currentMeetingID");
      let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
      let data = {
        MeetingId: Number(currentMeeting),
        VideoCallURL: String(currentMeetingVideoURL),
        IsMuted: false,
        HideVideo: false,
      };
      dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
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
                  {t("Are-You-Sure-you-Want-to-Leave-video")}
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
