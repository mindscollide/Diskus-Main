import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import ScreenShareEnabled from "../../../../../assets/images/Recent Activity Icons/Video/ScreenShareEnabled.png";
import Raisehandselected from "../../../../../assets/images/Recent Activity Icons/Video/Raisehandselected.png";
import SpeakerView from "../../../../../assets/images/Recent Activity Icons/Video/SpeakerView.png";
import ParticipantSelected from "../../../../../assets/images/Recent Activity Icons/Video/ParticipantSelected.png";

import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import Screenshare from "../../../../../assets/images/Recent Activity Icons/Video/Screenshare.png";
import RaiseHand from "../../../../../assets/images/Recent Activity Icons/Video/RaiseHand.png";
import TileView from "../../../../../assets/images/Recent Activity Icons/Video/TileView.png";
import Participant from "../../../../../assets/images/Recent Activity Icons/Video/Participant.png";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import "./GuestVideoHeader.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  muteUnMuteParticipantMainApi,
  raiseUnRaisedHandMainApi,
} from "../../../../../store/actions/Guest_Video";
import { useSelector } from "react-redux";

const GuestVideoHeader = ({ extractMeetingTitle, roomId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const joinGuestData = useSelector(
    (state) => state.GuestVideoReducer.joinGuestData
  );

  console.log(joinGuestData.guestGuid, "lahaahhahbskjsdajksdasjkdasjhkdb");

  const [micOn, setMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [isRaiseHand, setIsRaiseHand] = useState(false);
  const [isSpeakerView, setIsSpeakerView] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  const openMicStatus = () => {
    setMicOn(!micOn);
    let data = {
      UID: String(joinGuestData.guestGuid),
      IsMuted: micOn ? true : false,
    };

    // Wrap the data object in an array and create the request structure
    let requestData = {
      MuteUnMuteList: [data],
    };
    // Dispatch the API call with the structured request data
    dispatch(muteUnMuteParticipantMainApi(navigate, t, requestData));
  };

  const openVideoStatus = () => {
    setIsVideoOn(!isVideoOn);
  };

  const openScreenShare = () => {
    setIsScreenShare(!isScreenShare);
  };

  const openRaiseHand = () => {
    setIsRaiseHand(!isRaiseHand);
    let data = {
      RoomID: String(roomId),
      UID: String(joinGuestData.guestGuid),
      IsHandRaised: isRaiseHand ? true : false,
    };

    dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
  };

  const openSpeaker = () => {
    setIsSpeakerView(!isSpeakerView);
  };

  const openParticipant = () => {
    setIsParticipant(!isParticipant);
  };

  return (
    <>
      <Row className="mt-4">
        <Col lg={5} md={5} sm={12}>
          <p className="title-header-name">{extractMeetingTitle}</p>
        </Col>

        <Col lg={7} md={7} sm={12} className="d-flex justify-content-end gap-2">
          <div className="Guest-Icons-state">
            {micOn ? (
              <img
                src={MicOff}
                onClick={openMicStatus}
                className="cursor-pointer"
              />
            ) : (
              <img
                src={MicOn2}
                onClick={openMicStatus}
                className="cursor-pointer"
              />
            )}
          </div>
          <div className="Guest-Icons-state">
            {isVideoOn ? (
              <img src={VideoOff} onClick={openVideoStatus} />
            ) : (
              <img src={VideoOn2} onClick={openVideoStatus} />
            )}
          </div>
          <div className="Guest-Icons-state">
            {isScreenShare ? (
              <img src={ScreenShareEnabled} onClick={openScreenShare} />
            ) : (
              <img src={Screenshare} onClick={openScreenShare} />
            )}
          </div>
          <div className="Guest-Icons-state">
            {isRaiseHand ? (
              <img src={Raisehandselected} onClick={openRaiseHand} />
            ) : (
              <img src={RaiseHand} onClick={openRaiseHand} />
            )}
          </div>

          <div className="Guest-Icons-state">
            {isSpeakerView ? (
              <img src={SpeakerView} onClick={openSpeaker} />
            ) : (
              <img src={TileView} onClick={openSpeaker} />
            )}
          </div>
          <div className="Guest-Icons-state-Participant">
            {isParticipant ? (
              <>
                <img src={ParticipantSelected} onClick={openParticipant} />
                <div className="New-List-Participants">
                  {/* Your additional div content here */}
                  <Row>
                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      className="d-flex justify-content-start"
                    >
                      <p>Sarah Thompson</p>
                    </Col>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      className="d-flex justify-content-end"
                    >
                      <img src={RaiseHand} width="13px" height="16px" />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      className="d-flex justify-content-start"
                    >
                      <p>Michael Davis</p>
                    </Col>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      className="d-flex justify-content-end"
                    >
                      <img src={RaiseHand} width="13px" height="16px" />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      className="d-flex justify-content-start"
                    >
                      <p>Emily Parkor</p>
                    </Col>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      className="d-flex justify-content-end"
                    >
                      <img src={RaiseHand} width="13px" height="16px" />
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <img src={Participant} onClick={openParticipant} />
            )}
          </div>
          <div className="Guest-Icons-state">
            <img src={EndCall} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GuestVideoHeader;
