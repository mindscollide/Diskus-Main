import React from 'react'
import {  Row, Col } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'
import './videoCallNormalAgenda.css'
import ChatPlus from '../../../../../assets/images/newElements/chatPlus.png'

const VideoPanelNormalAgenda = () => {
  const onClickCloseAgendaHandler = () => {}

  return (
    <>
      <div className="isAgendamedium-div-changes">
        <Row>
          <Col lg={10} md={10} sm={10}>
            <p className="Agenda-title-heading">Agenda</p>
          </Col>

          <Col lg={2} md={2} sm={2}>
            <X
              width={20}
              className="agenda-Close-icon"
              onClick={onClickCloseAgendaHandler}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={2} md={2} sm={2}>
            <p className="agenda-count">1</p>
          </Col>

          <Col lg={8} md={8} sm={8}>
            <p className="agenda-pargraph">
              Agenda Comes in here. It can have as much info as it can hold.
            </p>
          </Col>
          <Col>
            <img width={15} src={ChatPlus} className="agenda-plus-icon" />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={2} md={2} sm={2}>
            <p className="agenda-count">2</p>
          </Col>

          <Col lg={8} md={8} sm={8}>
            <p className="agenda-pargraph">
              Agenda Comes in here. It can have as much info as it can hold.
            </p>
          </Col>
          <Col>
            <img width={15} src={ChatPlus} className="agenda-plus-icon" />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={2} md={2} sm={2}>
            <p className="agenda-count">3</p>
          </Col>

          <Col lg={8} md={8} sm={8}>
            <p className="agenda-pargraph">
              Agenda Comes in here. It can have as much info as it can hold.
            </p>
          </Col>
          <Col>
            <img width={15} src={ChatPlus} className="agenda-plus-icon" />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={2} md={2} sm={2}>
            <p className="agenda-count">4</p>
          </Col>

          <Col lg={8} md={8} sm={8}>
            <p className="agenda-pargraph">
              Agenda Comes in here. It can have as much info as it can hold.
            </p>
          </Col>
          <Col>
            <img width={15} src={ChatPlus} className="agenda-plus-icon" />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default VideoPanelNormalAgenda
