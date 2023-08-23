import React from 'react'
import { Row, Col } from 'react-bootstrap'
import ExpandIcon from '../../../../../assets/images/newElements/ExpandColorfullIcon.png'
import MinimizeIcon from '../../../../../assets/images/newElements/MinimizeIcon.png'

const VideoCallLargeHeader = () => {
  return (
    <Row className="mt-2 mb-0">
      <Col lg={11} md={11} sm={12} className="d-flex justify-content-end gap-3">
        <img
          width={20}
          src={MinimizeIcon}
          alt="Minimize Icon"
          className="minimize_icon-class"
          //   onClick={() => minimizeScreen(true)}
        />
        <img
          width={17}
          src={ExpandIcon}
          alt="Maximize Icon"
          //   onClick={() => maximizeScreen(true)}
        />
      </Col>
      <Col lg={1} md={1} sm={12} />
    </Row>
  )
}

export default VideoCallLargeHeader
