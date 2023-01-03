import React, { useState } from 'react'
import styles from './PaymentForm.module.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ChevronCompactLeft, ChevronLeft } from 'react-bootstrap-icons'
import { Accordian, Button, TextField } from '../../../../components/elements'
import PayonnerLogo from '../../../../assets/images/payoneer-logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import DiskusnewRoundIconSignUp from '../../../../assets/images/newElements/Diskus_newRoundIcon_SignUp.svg'
import PaypalPaymentLogo from '../../../../assets/images/newElements/Paypal.svg'
import BinancePaymentCardLogo from '../../../../assets/images/newElements/BinancePaymentCardLogo.svg'
import BitcoinPaymentCardLogo from '../../../../assets/images/newElements/BitcoinPaymentCardLogo.svg'
import EtherumPaymentCardLogo from '../../../../assets/images/newElements/EtherumPaymentCardLogo.svg'
import MasterCard from '../../../../assets/images/newElements/Master_card.svg'
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
                <Col sm={12} md={12} lg={12} className={styles["bg_roundimage"]}>
                    <img src={DiskusnewRoundIconSignUp} alt="" />
                </Col>
                <Col sm={12} lg={12} md={12} className="mx-auto my-5" >
                    <h3 className={styles["paymentform_heading"]}>Choose Payment Method</h3>
                </Col>
                <Col sm={12} md={10} lg={10} className="mx-auto py-2 bg-white">
                    <Row>
                        <Col sm={12} md={2} lg={2} className="mx-auto text-capatlize text-center my-3  d-flex justify-content-center align-items-center fs-3  bg-white">
                            <ChevronLeft fontWeight="100px" className='fw-900 fs-4 me-2' /> <span className='fs-5 fw-900'>Go Back</span>
                        </Col>
                        <Col sm={12} md={10} lg={10} className="mx-auto text-center   py-3 bg-white">
                            <Col sm={12} md={10} lg={10} className="border rounded py-3">
                                <h6 className='fw-900 text-uppercase'>satisfaction guaranteed</h6>
                                <p className='m-0 p-0'>If you're not completely with purhcase, contact our DiskUs Guides 24/7/365 and we'll make it right.</p>
                            </Col>
                        </Col>
                    </Row>

                    <Col sm={12} md={12} lg={12} className="mx-auto">
                        <Row>
                            <Col sm={12} md={6} lg={6} className={`${styles["paymentpricecardBox"]} ${" my-3 mx-0"}`}>
                                <div
                                    className={`${styles["packagecard_priceBox_container"]}`}
                                >
                                    <div className={styles["packagecard_one"]}>
                                        <div className={styles["packagecard_pricebox"]}>
                                            <h4 className="d-flex justify-content-center align-items-center ">
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
                                <div className={`${styles["disount_per"]} ${'text-center border w-25 mx-auto mb-3 fs-4'}`}>
                                    <span>13% off</span>
                                </div>
                            </Col>
                            <Col sm={12} md={6} lg={6} className=" my-3 p-4">
                                <Col sm={12} lg={12} md={12} className={styles["Ordersummaryheading"]} >
                                    Order Summary
                                </Col>
                                <Col sm={12} md={11} lg={11} className={styles["paymentdetailbox"]}>
                                    <Row>
                                        <Col sm={12} md={6} lg={6} className="fs-5">Subtotal (PKR)</Col>
                                        <Col sm={12} md={6} lg={6} className="d-flex justify-content-end fw-900 fs-4">$35</Col>
                                    </Row>
                                </Col>
                                <Col sm={12} md={12} lg={12} className="text-center small ">
                                    Subtotal does not include applicable taxes
                                </Col>
                                <Col sm={12} md={12} lg={12} className={` ${"mt-2"} ${styles["link_text"]}`}>
                                    <Link to="">Have you promo code?</Link>
                                </Col>
                                <Col className={` ${styles["link_text"]}`} sm={12} md={12} lg={12} >
                                    <Link to="">View all promo codes</Link>
                                </Col>
                                <Col sm={12} md={12} lg={12} className="mt-4">
                                    <Row >
                                        <Col sm={12} md={12} lg={12} className={styles["paymentoptions"]}>
                                            <div>
                                                <figure>
                                                    <img src={BitcoinPaymentCardLogo} />
                                                    <figcaption>Bitcoin</figcaption>
                                                </figure>
                                                <figure>
                                                    <img src={EtherumPaymentCardLogo} />
                                                    <figcaption>Ethereum</figcaption>
                                                </figure>
                                                <figure>
                                                    <img src={BinancePaymentCardLogo} />
                                                    <figcaption>Binance</figcaption>
                                                </figure>
                                            </div>
                                            <div>
                                                <figure>
                                                    <img src={PaypalPaymentLogo} />
                                                    <figcaption></figcaption>
                                                </figure>
                                            </div>
                                            <div>
                                                <figure>
                                                    <img src={MasterCard} />
                                                    <figcaption></figcaption>
                                                </figure>
                                            </div>
                                        </Col>

                                    </Row>
                                </Col>
                                <Col className='text-center mt-2' md={12} sm={12} lg={12}>
                                    Nice! You saved $5/ month on you subscription
                                </Col>
                            </Col>

                        </Row>
                    </Col>
                </Col>


            </Row>

        </Container>
    )
}

export default PaymentForm