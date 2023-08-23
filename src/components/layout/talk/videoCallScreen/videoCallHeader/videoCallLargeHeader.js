import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import {
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
} from '../../../../../store/actions/VideoFeature_actions'
import MinimizeIcon from '../../../../../assets/images/newElements/MinimizeIcon.png'
import NormalizeIcon from '../../../../../assets/images/newElements/Normalize-Icon.png'

const VideoCallLargeHeader = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  const dispatch = useDispatch()

  const normalizeScreen = () => {
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
  }

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
          src={NormalizeIcon}
          alt="Maximize Icon"
          onClick={normalizeScreen}
        />
      </Col>
      <Col lg={1} md={1} sm={12} />
    </Row>
  )
}

export default VideoCallLargeHeader
