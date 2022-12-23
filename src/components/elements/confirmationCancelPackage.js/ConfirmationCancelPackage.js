import React, { useState } from 'react'
import styles from './ConfirmationCancelPackage.module.css'
import { Container, Row, Col, Card, CheckBox, Form, FormCheck, ProgressBar } from 'react-bootstrap'

import Button from '../../elements/button/Button'
import { Link, useLocation } from 'react-router-dom'
import WarningMessageBox from '../warning_message/WarningMessageBox'
const ConfirmationCancelPackage = ({ onClickCancelNowBtn, onClickProceedBtn, forrevokeCancel }) => {

    return (
        <Container>
            <Card className={styles["UpgradePackageCard"]}>
                <Row>

                    <Col sm={12} md={4} lg={4} className="border-right-0 position-relative">
                        <Col sm={12} md={12} lg={12} className="mb-4">

                            <h3 className={styles["packageheading"]}>Premium</h3>
                            <h4 className='text-center fw-900 m-0 p-0'>$55/month</h4>
                            <p className='mx-auto text-center m-0 p-0'>Annually Subscription</p>
                        </Col>
                        <Row className="mt-5">
                            <Col sm={12} md={12} lg={12} className="text-center text-uppercase fw-bold my-2">Users</Col>
                            <Col sm={12} md={12} lg={12}><ProgressBar now={2} max={3} className={styles["ExecutiveMembersRange"]} /></Col>
                            <Col sm={12} md={12} lg={12} className="text-center my-2">2 of 3 Executives</Col>
                            <Col sm={12} md={12} lg={12}  ><ProgressBar now={1} max={2} className={styles["BoardMembersRange"]} /></Col>
                            <Col sm={12} md={12} lg={12} className="text-center my-2">1 to 2 Board memebers</Col>
                        </Row>
                        <Col sm={12} md={12} lg={12}>
                            <span className={styles["lineBar_cancelSub"]}></span>
                        </Col>
                    </Col>


                    <Col sm={12} md={8} lg={8} >

                        <Row>
                            <Col sm={12} md={7} lg={7} className="mx-auto mt-5 d-flex justify-content-center">

                                <WarningMessageBox />
                            </Col>
                            <Col sm={12} lg={12} md={12} className={styles["upgradePackageAmoutnandList"]}>

                                <p className='fw-900 m-0'>What is the reason for your leaving?</p>
                                <Form.Group className="mb-2" >
                                    <Form.Check type="checkbox" className='user-select-none my-2' label="It's too costly" />
                                    <Form.Check type="checkbox" className='user-select-none my-2' label="I found another product that fulfills my needs" />
                                    <Form.Check type="checkbox" className='user-select-none my-2' label="I don't use it enough" />
                                    <Form.Check type="checkbox" className='user-select-none my-2' label="Others" />
                                </Form.Group>

                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Row>
                                    {forrevokeCancel ?
                                        <>
                                            <Col sm={12} md={12} lg={12} className="d-flex justify-content-center my-2">
                                                <Button text="Proceed with Cancellation" onClick={onClickCancelNowBtn} className={styles["proceedwithCancelatioBtn"]} />
                                            </Col>
                                            <Col sm={12} md={12} lg={12} className="d-flex justify-content-center">
                                                <Link to="" className='text-black text-decoration-underline text-center'>Go Back</Link>
                                            </Col>
                                        </>
                                        :
                                        <>
                                            <Col sm={12} md={6} lg={6} className="d-flex justify-content-center"><Button text="Cancel" onClick={onClickCancelNowBtn} className={styles["CancelNowBtn"]} /></Col>
                                            <Col sm={12} md={6} lg={6}><Button text="Proceed" className={styles["ProceedBtn"]} onClick={onClickProceedBtn} /></Col>
                                        </>}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Container >
    )
}

export default ConfirmationCancelPackage