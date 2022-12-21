import React from 'react'
import styles from './PaymentForm.module.css'
import { Container, Row, Col } from 'react-bootstrap'

import { Accordian, Button, TextField } from '../../../../components/elements'
import PayonnerLogo from '../../../../assets/images/payoneer-logo.svg'
import { useNavigate } from 'react-router-dom'
const PaymentForm = () => {
    const navigate = useNavigate()
    const goBack = () => {
        navigate("/selectedpackage")
    }
    return (
        <Container>
            <Row>
                <Col sm={12} lg={8} md={8} className={`${"border mx-auto mt-5 p-5 "} ${styles["paymentform_Container"]}`}>
                    <Row>
                        <Col sm={12} lg={8} md={8} className={styles["paymentform_heading"]}>
                            Choose Payment Method
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={8} md={8} className="mx-auto mt-5">
                            <Accordian AccordioonHeader={(
                                <Row>
                                    <Col sm={12} md={12} lg={12}>Payonner</Col>
                                </Row>
                            )}
                                AccordioonBody={(
                                    <>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Name on Card</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Credit Card Number</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Expiry Date</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">CVC</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center"></Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><Button className={styles["Payment_Paynow_btn"]} text="Pay Now" /></Col>
                                        </Row>
                                    </>
                                )}
                            />
                            <Accordian AccordioonHeader={(
                                <Row>
                                    <Col sm={12} md={12} lg={12}>Crypto Currency</Col>
                                </Row>
                            )}
                                AccordioonBody={(
                                    <>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Name on Card</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Credit Card Number</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Expiry Date</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">CVC</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center"></Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><Button className={styles["Payment_Paynow_btn"]} text="Pay Now" /></Col>
                                        </Row>
                                    </>
                                )}
                            />
                            <Accordian AccordioonHeader={(
                                <Row>
                                    <Col sm={12} md={12} lg={12}>Credit Card</Col>
                                </Row>
                            )}
                                AccordioonBody={(
                                    <>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Name on Card</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Credit Card Number</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">Expiry Date</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center">CVC</Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><TextField applyClass="form-control2" /></Col>
                                        </Row>
                                        <Row className='d-flex align-items-center my-2'>
                                            <Col sm={12} md={4} lg={4} className="d-flex align-items-center"></Col>
                                            <Col sm={12} md={8} lg={8} className="f-0"><Button className={styles["Payment_Paynow_btn"]} text="Pay Now" /></Col>
                                        </Row>
                                    </>
                                )} />
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row>
                <Col sm={12} lg={8} md={8} className="d-flex justify-content-start mx-auto mt-2" >
                    <Button className={styles["Paymentpage_Back_btn"]} onClick={goBack} text="Back" />
                </Col>
            </Row>
        </Container>
    )
}

export default PaymentForm