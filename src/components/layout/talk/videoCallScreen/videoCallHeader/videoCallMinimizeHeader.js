import React from 'react'
import { Row, Col } from 'react-bootstrap'
import './videoCallHeader.css'
import MinimizeMicIcon from '../../../../../assets/images/newElements/MinimizeMicIcon.png'
import MinimizeExpandIcon from '../../../../../assets/images/newElements/MinimizeExpandIcon.png'
import MinimizeVideoIcon from '../../../../../assets/images/newElements/MinimizeVideoIcon.png'
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import MinToNormalIcon from '../../../../../assets/images/newElements/Min-to-normal-Icon.svg'

const VideoCallMinimizeHeader = ({ title }) => {
  return (
    <Row className="mt-2 mb-4">
      <Col lg={3} md={3} sm={12} className="mt-1">
        <p className="title-heading">{title}</p>
      </Col>
      <Col lg={7} md={7} sm={12}>
        <div className="minimize-screen-on-bottom">
          <img src={MinimizeVideoIcon} />
          <img src={MinimizeMicIcon} />
          <img
            src={CallEndRedIcon}
            // onClick={() => closeVideoGroupPanel(false)}
          />
        </div>
      </Col>
      <Col lg={2} md={2} sm={12}>
        <div className="minimizeGroup-expand-icon">
          <img
            src={MinToNormalIcon}
            //   onClick={() => normalScreen(true)}
          />

          <img
            src={MinimizeExpandIcon}
            // className="minimize-expand-icon"
            //   onClick={() => maximizeScreen(true)}
          />
        </div>
      </Col>
    </Row>
  )
}

export default VideoCallMinimizeHeader
