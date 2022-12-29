import React, { useState } from 'react'
import styles from './PaymentForm.module.css'
import { Container, Row, Col } from 'react-bootstrap'

import { Accordian, Button, TextField } from '../../../../components/elements'
import PayonnerLogo from '../../../../assets/images/payoneer-logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { t } from 'i18next'
const PaymentForm = () => {
    const [annualPackageShow, setAnnualPackageShow] = useState(false);
    const navigate = useNavigate()
    const goBack = () => {
        navigate("/selectedpackage")
    }
    const handleManualPackage = () => {
        setAnnualPackageShow(false)
    }
    const handleAnnualPackage = () => {
        setAnnualPackageShow(true)
    }
    return (
        <Container className={styles["paymentformBackground"]}>
            <Row >
                <Col sm={12} lg={12} md={12} className="d-flex justify-content-center my-5" >
                    <h3 className={styles["paymentform_heading"]}>Choose Payment Method</h3>
                </Col>
                <Col sm={12} md={10} lg={10} className="mx-auto">
                    <Row>
                        <Col sm={12} md={2} lg={2} className="mx-auto text-center  py-3 bg-white">
                           
                        </Col>
                        <Col sm={12} md={10} lg={10} className="mx-auto text-center  py-3 bg-white">
                            <h6 className='fw-900 text-uppercase'>satisfaction guaranteed</h6>
                            <p className='m-0 p-0'>If you're not completely with purhcase, contact our DiskUs Guides 24/7/365 and we'll make it right.</p>
                        </Col>
                    </Row>
                </Col>


                <Col sm={12} md={10} lg={10} className="mx-auto bg-white">
                    <Row>
                        <Col sm={12} md={6} lg={6} className={`${styles["paymentpricecardBox"]} ${" my-3 mx-0"}`}>
                            <div
                                className={`${styles["packagecard_priceBox_container"]}`}
                            >
                                <div className={styles["packagecard_one"]}>
                                    <div className={styles["packagecard_pricebox"]}>
                                        <h4 className="d-flex justify-content-center align-items-center h-100">
                                            GOLD
                                        </h4>
                                    </div>
                                    <div className="d-flex">
                                        <span
                                            className="border border-1 w-100"
                                            onClick={handleManualPackage}
                                        >
                                            {/* Monthly */}
                                            {t("Monthly")}
                                        </span>
                                        <span
                                            className=" border border-1 w-100"
                                            onClick={handleAnnualPackage}
                                        >
                                            {/* Annually */}
                                            {t("Annually")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles["pricesuffle"]}>
                                <span className={annualPackageShow ? 'fs-4 fw-bolder visible ' : 'fs-4 fw-bolder invisible '}>

                                    $35/<span className='fs-6'>month</span>
                                </span>

                                <br />
                                <span className={annualPackageShow ? "fs-6 text-decoration-line-through" : "fs-4 "}>
                                    $40/<span className='fs-6'>month</span>
                                </span>
                            </div>
                            <div className='text-center border w-25 mx-auto mb-3 fs-4'>
                                <span>13% off</span>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={6} className=" my-3 p-4">
                            <Col sm={12} lg={12} md={12} className='fs-5 ms-2' >
                                Order Summary
                            </Col>
                            <Col sm={12} md={11} lg={11} className={styles["paymentdetailbox"]}>
                                <Row>
                                    <Col sm={12} md={6} lg={6} className="fs-5">Subtotal (PKR)</Col>
                                    <Col sm={12} md={6} lg={6} className="d-flex justify-content-end fw-900 fs-4">$35</Col>
                                </Row>
                            </Col>
                            <Col sm={12} md={12} lg={12} className="text-center">
                                Subtotal does not include applicable taxes
                            </Col>
                            <Col sm={12} md={12} lg={12} className="text-center">
                                <Link to="">Have you promo code?</Link>
                            </Col>
                            <Col className="text-center" sm={12} md={12} lg={12}>
                                <Link to="">View all promo codes</Link>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Row>
                                    <Col sm={12} md={4} lg={4}></Col>
                                    <Col sm={12} md={4} lg={4}></Col>
                                    <Col sm={12} md={4} lg={4}></Col>
                                </Row>
                            </Col>
                            <Col className='text-center' md={12} sm={12} lg={12}>
                                Nice! You saved $5/ month on you subscription
                            </Col>
                        </Col>

                    </Row>
                </Col>
            </Row>
            <Row>
                <Col sm={12} lg={12} md={12} className="d-flex justify-content-center" >
                    <Link className={styles["Paymentpage_Back_btn"]} to="" >Back</Link>
                </Col>
            </Row>
        </Container>
    )
}

export default PaymentForm