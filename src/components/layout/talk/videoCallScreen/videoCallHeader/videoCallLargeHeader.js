import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import "./videoCallHeader.css";
import {
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  agendaEnableNormalFlag,
  chatEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
} from "../../../../../store/actions/VideoFeature_actions";
import MinimizeIcon from "../../../../../assets/images/newElements/MinimizeIcon.png";
import NormalizeIcon from "../../../../../assets/images/newElements/Normalize-Icon.png";
import ChatNonActive from "../../../../../assets/images/newElements/ChatIconNonActive.svg";
import ActiveChat from "../../../../../assets/images/newElements/ActiveChatIcon.svg";
import CallEndRedIcon from "../../../../../assets/images/newElements/CallRedIcon.svg";

const VideoCallLargeHeader = () => {
  const dispatch = useDispatch();

  const [isActiveIcon, setIsActiveIcon] = useState(false);

  const normalizeScreen = () => {
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
  };

  const minimizeVideoPanel = () => {
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(true));
    dispatch(normalizeVideoPanelFlag(false));
  };

  const onClickCloseChatHandler = () => {
    if (isActiveIcon === false) {
      dispatch(chatEnableNormalFlag(true));
      setIsActiveIcon(true);
      dispatch(agendaEnableNormalFlag(false));
      dispatch(minutesMeetingEnableNormalFlag(false));
    } else {
      dispatch(chatEnableNormalFlag(false));
      setIsActiveIcon(false);
      dispatch(agendaEnableNormalFlag(false));
      dispatch(minutesMeetingEnableNormalFlag(false));
    }
  };

  const closeVideoPanel = () => {
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    
    localStorage.setItem("activeCall", false);
  };

  return (
    <Row className="mt-2 mb-0">
      <Col lg={12} md={12} sm={12} className="d-flex justify-content-end gap-3">
        {isActiveIcon ? (
          <img
            width={30}
            src={ActiveChat}
            onClick={onClickCloseChatHandler}
            alt=""
          />
        ) : (
          <img
            width={30}
            src={ChatNonActive}
            onClick={onClickCloseChatHandler}
            alt=""
          />
        )}
        <img src={CallEndRedIcon} onClick={closeVideoPanel} alt="" />
        <img
          width={20}
          src={MinimizeIcon}
          alt="Minimize Icon"
          className="minimize_icon-class"
          onClick={minimizeVideoPanel}
        />
        <img
          width={17}
          src={NormalizeIcon}
          alt="Maximize Icon"
          className="normalize-Icon-Large"
          onClick={normalizeScreen}
        />
      </Col>
    </Row>
  );
};

export default VideoCallLargeHeader;
