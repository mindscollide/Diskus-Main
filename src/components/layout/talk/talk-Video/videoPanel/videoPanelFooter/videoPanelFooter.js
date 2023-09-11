import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import { Button } from '../../../../../elements'
import './videoPanelFooter.css'
import VideoCallWhiteIcon from './../../../../../../assets/images/Video-White-Icon.png'

const VideoPanelFooter = ({ groupCallClick, groupbtnClassName }) => {
  const dispatch = useDispatch()

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  return (
    <>
      <Container>
        <Row>
          <Col>
            {VideoMainReducer.Loading === false ? (
              <div className="group-call">
                <Button
                  text="Group Call"
                  className={groupbtnClassName}
                  onClick={groupCallClick}
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
