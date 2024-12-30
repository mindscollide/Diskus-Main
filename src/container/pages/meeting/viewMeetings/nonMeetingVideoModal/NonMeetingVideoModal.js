import React, { useState, useEffect } from "react";
import styles from "./NonMeetingVideoModal.module.css";
import { Col, Row, Container } from "react-bootstrap";
import { Button, Modal } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
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
  const onClickOnYesMeetingModal = () => {
    localStorage.setItem("isMeetingVideo", false);
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    const meetingHost = {
      isHost: false,
      isHostId: 0,
      isDashboardVideo: false,
    };
    localStorage.setItem("meetinHostInfo", JSON.stringify(meetingHost));
    let currentOrganization = Number(localStorage.getItem("organizationID"));
    let initiateCallRoomID = Number(localStorage.getItem("initiateCallRoomID"));
    let currentCallType = Number(localStorage.getItem("CallType"));

    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateCallRoomID,
      IsCaller: false,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
  };

  return (
    <section>
      <Modal
        show={nonMeetingVideoCheckModal}
        setShow={dispatch(nonMeetingVideoGlobalModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
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
