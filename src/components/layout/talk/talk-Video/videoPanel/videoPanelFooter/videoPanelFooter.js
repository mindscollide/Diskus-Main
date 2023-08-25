import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import { Button } from '../../../../../elements'
import './videoPanelFooter.css'
import VideoCallWhiteIcon from './../../../../../../assets/images/Video-White-Icon.png'

const VideoPanelFooter = () => {
  const dispatch = useDispatch()

  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      <Container>
        <Row>
          <Col>
            <div className="group-call">
              <Button
                text="Group Call"
                className="group-btn"
                // onClick={() => anotherVideoPanelHandler(true)}
                icon2={<img src={VideoCallWhiteIcon} />}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default VideoPanelFooter
