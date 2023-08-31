import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import { Button } from '../../../../../elements'
import './videoPanelFooter.css'
import VideoCallWhiteIcon from './../../../../../../assets/images/Video-White-Icon.png'
import { incomingVideoCallFlag } from '../../../../../../store/actions/VideoFeature_actions'

const VideoPanelFooter = () => {
  const dispatch = useDispatch()

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  const incomingCall = () => {
    dispatch(incomingVideoCallFlag(true))
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            {VideoMainReducer.Loading === false ? (
              <div className="group-call">
                <Button
                  text="Group Call"
                  className="group-btn"
                  // onClick={incomingCall}
                  icon2={<img src={VideoCallWhiteIcon} />}
                />
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default VideoPanelFooter
