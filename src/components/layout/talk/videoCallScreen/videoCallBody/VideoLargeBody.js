import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Avatar2 from '../../../../../assets/images/newElements/Avatar2.png'
import './VideoLargeBody.css'

const VideoLargeBody = () => {
  return (
    <>
      <Row>
        <Col lg={11} md={11} sm={12}>
          <Row>
            <Col lg={6} md={6} sm={12}>
              <div className="normal-avatar-large">
                <img
                  src={Avatar2}
                  alt="Avatar Pic One"
                  // className="img-fluid"
                />
              </div>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <div className="normal-avatar-large">
                <img
                  src={Avatar2}
                  alt="Avatar Pic One"
                  // className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default VideoLargeBody
