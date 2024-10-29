import { Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import VideoCallLargeHeader from "../videoCallHeader/videoCallLargeHeader";
import VideoLargeBody from "../videoCallBody/VideoLargeBody";
import VideoMaxIncoming from "../videoCallBody/VideoMaxIncoming";
import VideoMaxOutgoing from "../videoCallBody/VideoMaxOutgoing";
import VideoMaxMultiple from "../videoCallBody/VideoMaxMultiple";
import VideoMaxChatMin from "../videoCallBody/VideoMaxChatMin";
import VideoLargePanelFooter from "../../talk-Video/videoPanel/videoLargePanelFooter/VideoLargePanelFooter";
import "./videoCallMaximizePanel.css";

const VideoPanelMaximize = () => {
  const VideoIncomingCallFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoIncomingCallFlag
  );
  const VideoOutgoingCallFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoOutgoingCallFlag
  );
  const VideoMultipleCallFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoMultipleCallFlag
  );
  return (
    <>
      <div className="max-video-panel">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <VideoCallLargeHeader />
            {VideoIncomingCallFlag === false &&
            VideoOutgoingCallFlag === false &&
            VideoMultipleCallFlag === false ? (
              <VideoLargeBody />
            ) : VideoIncomingCallFlag === true &&
              VideoOutgoingCallFlag === false &&
              VideoMultipleCallFlag === false ? (
              <VideoMaxIncoming />
            ) : VideoIncomingCallFlag === false &&
              VideoOutgoingCallFlag === true &&
              VideoMultipleCallFlag === false ? (
              <VideoMaxOutgoing />
            ) : VideoIncomingCallFlag === false &&
              VideoOutgoingCallFlag === false &&
              VideoMultipleCallFlag === true ? (
              <VideoMaxMultiple />
            ) : null}
            {/* <VideoLargePanelFooter /> */}
            <VideoMaxChatMin />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default VideoPanelMaximize;
