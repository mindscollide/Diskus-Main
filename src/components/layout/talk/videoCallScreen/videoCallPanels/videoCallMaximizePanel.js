import { Row, Col, Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import VideoCallLargeHeader from '../videoCallHeader/videoCallLargeHeader'
import VideoLargeBody from '../videoCallBody/VideoLargeBody'
import VideoMaxIncoming from '../videoCallBody/VideoMaxIncoming'
import VideoMaxOutgoing from '../videoCallBody/VideoMaxOutgoing'
import VideoMaxMultiple from '../videoCallBody/VideoMaxMultiple'
import VideoMaxChatMin from '../videoCallBody/VideoMaxChatMin'
import VideoLargePanelFooter from '../../talk-Video/videoPanel/videoLargePanelFooter/VideoLargePanelFooter'
import './videoCallMaximizePanel.css'

const VideoPanelMaximize = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      <div className="max-video-panel">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <VideoCallLargeHeader />
            {videoFeatureReducer.VideoIncomingCallFlag === false &&
            videoFeatureReducer.VideoOutgoingCallFlag === false &&
            videoFeatureReducer.VideoMultipleCallFlag === false ? (
              <VideoLargeBody />
            ) : videoFeatureReducer.VideoIncomingCallFlag === true &&
              videoFeatureReducer.VideoOutgoingCallFlag === false &&
              videoFeatureReducer.VideoMultipleCallFlag === false ? (
              <VideoMaxIncoming />
            ) : videoFeatureReducer.VideoIncomingCallFlag === false &&
              videoFeatureReducer.VideoOutgoingCallFlag === true &&
              videoFeatureReducer.VideoMultipleCallFlag === false ? (
              <VideoMaxOutgoing />
            ) : videoFeatureReducer.VideoIncomingCallFlag === false &&
              videoFeatureReducer.VideoOutgoingCallFlag === false &&
              videoFeatureReducer.VideoMultipleCallFlag === true ? (
              <VideoMaxMultiple />
            ) : null}
            {/* <VideoLargePanelFooter /> */}
            <VideoMaxChatMin />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default VideoPanelMaximize
