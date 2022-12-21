import { Container, Row, Col } from 'react-bootstrap'

import React from 'react'

const PaymentActivity = ({ PaymentActivityTitle, PaymentActivityBoxTitle, ColOneKey, ColTwoKey, ColThreeKey, ColOneValue, ColTwoValue, ColThreeValue }) => {
    return (

        <Row>
            <Col sm={12} md={12} lg={12} className="fs-4 fw-bold my-3">{PaymentActivityBoxTitle}</Col>
            <Col sm={12} lg={12} md={12} className="border py-3 px-5">
                <Col sm={12} md={12} lg={12} className="fs-5 fw-bold" >{PaymentActivityTitle}</Col>
                <Row className="mt-2">
                    <Col sm={12} md={4} lg={4}>{ColOneKey} <span className="fw-900">{ColOneValue}</span> </Col>
                    <Col sm={12} md={4} lg={4}>{ColTwoKey} <span className="fw-900">{ColTwoValue}</span> </Col>
                    <Col sm={12} md={4} lg={4}>{ColThreeKey} <span className="fw-900">{ColThreeValue}</span></Col>
                </Row>
            </Col>
        </Row>

    )
}

export default PaymentActivity