import React, { useState } from 'react'
import styles from './PaymentForm.module.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ChevronCompactLeft, ChevronLeft } from 'react-bootstrap-icons'
import { Accordian, Button, TextField } from '../../../../components/elements'
import PayonnerLogo from '../../../../assets/images/payoneer-logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import DiskusnewRoundIconSignUp from '../../../../assets/images/newElements/Diskus_newRoundIcon_SignUp.svg'
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
                <Col sm={12} lg={10} md={10} className="mx-auto my-5" >
                    <h3 className={styles["paymentform_heading"]}>Choose Payment Method</h3>
                </Col>
                <Col sm={12} md={9} lg={9} className="mx-auto py-2 bg-white">
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
                                                <svg width="39.395" height="40.197" viewBox="0 0 39.395 40.197">
                                                    <g id="Group_632" data-name="Group 632">
                                                        <g id="Group_1677" data-name="Group 1677">
                                                            <g id="Group_630" data-name="Group 630">
                                                                <circle id="Ellipse_64" data-name="Ellipse 64" cx="13.928" cy="13.928" r="13.928" transform="translate(0 19.698) rotate(-45)" fill="#f6921a" />
                                                                <path id="Path_349" data-name="Path 349" d="M3067.639,3541.734c.176.056.338.1.5.158a2.409,2.409,0,0,1,1.728,2.088,4.241,4.241,0,0,1-.279,2.206,2.886,2.886,0,0,1-1.566,1.521,6.839,6.839,0,0,1-2,.493c-.248.029-.5.047-.747.064-.074.005-.094.028-.093.1,0,.792,0,1.583.009,2.374,0,.1-.021.135-.128.134-.438-.005-.875,0-1.314,0-.094,0-.129-.013-.129-.123,0-.776,0-1.552,0-2.328,0-.09-.02-.118-.113-.118-.343,0-.685,0-1.026-.007-.087,0-.116.021-.115.114.005.783,0,1.567.01,2.351,0,.094-.024.115-.116.113-.446,0-.891,0-1.337,0-.093,0-.116-.023-.116-.115,0-.788-.005-1.575,0-2.363,0-.1-.022-.131-.125-.131-.975,0-1.952,0-2.927,0-.094,0-.106-.022-.092-.108.094-.553.186-1.106.271-1.661.014-.089.046-.108.133-.107.365,0,.729.026,1.094-.006a.534.534,0,0,0,.517-.567q0-1.694-.006-3.389c0-1.161-.013-2.321-.007-3.48a.79.79,0,0,0-.72-.8,7.811,7.811,0,0,0-.875-.017c-.124,0-.247,0-.369.006-.056,0-.083,0-.082-.07,0-.507,0-1.014,0-1.521,0-.1.061-.08.114-.08.546,0,1.09-.006,1.636-.007.432,0,.862-.006,1.291,0,.092,0,.122-.021.121-.118-.006-.776,0-1.552-.012-2.328,0-.1.026-.134.13-.133.434,0,.868.005,1.3,0,.11,0,.141.025.14.136,0,.76,0,1.521,0,2.283,0,.083.016.11.106.107.346-.011.691-.015,1.037-.015.094,0,.113-.035.112-.12q-.006-1.118-.008-2.236c0-.155,0-.156.153-.156.434,0,.868,0,1.3-.005.094,0,.114.026.114.116,0,.783.005,1.567,0,2.351,0,.094.029.115.114.123a6.647,6.647,0,0,1,2.039.454,2.436,2.436,0,0,1,1.386,1.224,2.8,2.8,0,0,1-.2,2.893,2.245,2.245,0,0,1-.74.632Zm-2.408,4.482a3.355,3.355,0,0,0,.747-.28,1.36,1.36,0,0,0,.8-1.226,1.378,1.378,0,0,0-.744-1.3,3.251,3.251,0,0,0-1.078-.361,12.91,12.91,0,0,0-2.506-.093c-.086,0-.067.051-.067.1q0,1.63.006,3.261c0,.079.028.095.1.094.269,0,.537,0,.806,0A8.72,8.72,0,0,0,3065.23,3546.216Zm-.547-4.992a2.892,2.892,0,0,0,.562-.2,1.277,1.277,0,0,0,.795-1.161,1.3,1.3,0,0,0-.738-1.27,2.855,2.855,0,0,0-.852-.273,10.259,10.259,0,0,0-2-.071c-.069,0-.08.035-.078.093,0,.238,0,.476,0,.714,0,.742,0,1.482,0,2.223,0,.077.021.11.1.1s.162,0,.242,0A7.965,7.965,0,0,0,3064.683,3541.225Z" transform="translate(-3043.82 -3522.809)" fill="#fefefd" />
                                                            </g>
                                                        </g>

                                                    </g>
                                                </svg>
                                                <svg width="27.857" height="40.037" viewBox="0 0 27.857 35.037">
                                                    <g id="Group_1675" data-name="Group 1675" transform="translate(-83.571 -5.16)">
                                                        <g id="Group_644" data-name="Group 644" transform="translate(83.571 5.16)">
                                                            <g id="Group_642" data-name="Group 642">
                                                                <circle id="Ellipse_67" data-name="Ellipse 67" cx="13.928" cy="13.928" r="13.928" fill="#f2b92c" />
                                                                <g id="Group_641" data-name="Group 641" transform="translate(3.885 3.888)">
                                                                    <path id="Path_409" data-name="Path 409" d="M4927.177,3485.321c.072.067.128.118.181.172q2.911,2.91,5.826,5.818c.165.164.143.249-.01.4-.633.618-1.261,1.241-1.875,1.878-.177.185-.265.151-.427-.011-1.142-1.156-2.3-2.3-3.438-3.458-.21-.213-.312-.2-.516,0-1.131,1.151-2.28,2.282-3.412,3.431-.191.194-.291.2-.481,0-.6-.629-1.224-1.244-1.848-1.851-.159-.154-.159-.237,0-.4q2.922-2.9,5.826-5.818C4927.053,3485.435,4927.109,3485.385,4927.177,3485.321Z" transform="translate(-4917.159 -3485.321)" fill="#fefdfb" />
                                                                    <path id="Path_410" data-name="Path 410" d="M4923.076,3766.176c.089.086.165.156.238.228,1.139,1.14,2.288,2.273,3.416,3.426.21.216.315.2.514-.007,1.129-1.149,2.282-2.281,3.411-3.431.194-.2.3-.2.486,0,.6.629,1.222,1.242,1.849,1.848.16.158.151.243,0,.4q-2.918,2.9-5.822,5.824c-.15.152-.225.133-.364-.006q-2.906-2.919-5.821-5.825c-.129-.128-.185-.208-.021-.368.655-.632,1.294-1.281,1.938-1.925C4922.948,3766.284,4923.007,3766.236,4923.076,3766.176Z" transform="translate(-4916.967 -3754.485)" fill="#fefdfb" />
                                                                    <path id="Path_411" data-name="Path 411" d="M4829.637,3678.387c-.062-.059-.109-.1-.153-.146-.653-.651-1.3-1.307-1.96-1.952-.134-.132-.134-.2,0-.336q.99-.967,1.956-1.956c.142-.145.215-.109.336.014q.957.972,1.928,1.93c.114.112.185.185.03.336-.672.652-1.327,1.319-1.987,1.979C4829.742,3678.3,4829.694,3678.338,4829.637,3678.387Z" transform="translate(-4827.423 -3666.053)" fill="#fefdfb" />
                                                                    <path id="Path_412" data-name="Path 412" d="M5016.6,3678c-.074-.067-.132-.117-.185-.17-.644-.643-1.282-1.292-1.935-1.926-.168-.164-.138-.253.014-.4q.959-.94,1.9-1.9c.146-.147.236-.187.4-.017.634.654,1.28,1.295,1.93,1.932.135.133.175.218.016.373-.661.644-1.308,1.3-1.962,1.954C5016.726,3677.892,5016.667,3677.938,5016.6,3678Z" transform="translate(-5006.585 -3665.637)" fill="#fefefe" />
                                                                    <path id="Path_413" data-name="Path 413" d="M5206.849,3676.246c-.066.07-.116.126-.169.18-.644.643-1.292,1.28-1.923,1.933-.158.161-.234.117-.364-.017-.628-.639-1.259-1.275-1.9-1.9-.16-.155-.157-.239,0-.394.643-.624,1.274-1.26,1.9-1.9.13-.134.21-.172.363-.013.632.652,1.282,1.289,1.925,1.932C5206.733,3676.121,5206.785,3676.177,5206.849,3676.246Z" transform="translate(-5186.762 -3666.176)" fill="#fefdfb" />
                                                                </g>
                                                            </g>

                                                        </g>
                                                    </g>
                                                </svg>
                                                <svg width="27.857" height="40.681" viewBox="0 0 27.857 34.681">
                                                    <g id="Group_1676" data-name="Group 1676" transform="translate(-44.99 -5.515)">
                                                        <g id="Group_636" data-name="Group 636" transform="translate(44.99 5.515)">
                                                            <g id="Group_634" data-name="Group 634">
                                                                <circle id="Ellipse_65" data-name="Ellipse 65" cx="13.928" cy="13.928" r="13.928" fill="#fff" />
                                                                <g id="Group_633" data-name="Group 633" transform="translate(6.744 2.228)">
                                                                    <path id="Path_357" data-name="Path 357" d="M3969.267,3665a.018.018,0,0,0,.01,0,.513.513,0,0,1,.163-.083l.941-.429.827-.376.952-.433.806-.367.958-.435.812-.369.947-.43c.232-.107.464-.211.7-.317.024-.011.047-.035.08-.019a.067.067,0,0,1,.007.019.629.629,0,0,1,0,.08v7.308a.177.177,0,0,1-.016.106c-.216-.127-.433-.253-.649-.381l-5.553-3.282q-.491-.292-.982-.58Z" transform="translate(-3969.267 -3653.084)" fill="#393939" />
                                                                    <path id="Path_358" data-name="Path 358" d="M4141.691,3470.723v-7.462c0-.017,0-.034,0-.05a.276.276,0,0,1-.006-.075v-8.457c0-.032-.016-.073.025-.1q.234.382.465.765,3.328,5.524,6.656,11.047c.015.024.026.049.042.074-.032.017-.061,0-.085-.016l-.548-.249-1.076-.49-1.074-.488c-.36-.165-.725-.332-1.086-.495l-1.059-.481q-.543-.248-1.093-.5l-1.056-.481a.308.308,0,0,1-.031-.015c-.03-.013-.048-.007-.048.03v.062q0,3.627,0,7.253c0,.037.011.077-.015.111C4141.7,3470.722,4141.7,3470.727,4141.691,3470.723Z" transform="translate(-4134.506 -3454.559)" fill="#343434" />
                                                                    <path id="Path_359" data-name="Path 359" d="M4142.136,3669.672v-7.422c0-.082,0-.081.078-.045l1.24.564.822.375c.4.18.792.358,1.188.539l.68.311c.326.147.651.3.976.443.227.1.453.208.681.31l.955.434.526.238a.114.114,0,0,0,.026.008c0,.032-.028.033-.045.042l-3.6,2.131-3.432,2.029A.2.2,0,0,1,4142.136,3669.672Z" transform="translate(-4134.94 -3653.516)" fill="#141414" />
                                                                    <path id="Path_360" data-name="Path 360" d="M4141.441,3777.918l1.5-.89,4.259-2.514,1.347-.794c.016-.009.028-.026.05-.021,0,.022-.016.033-.027.048q-3.546,5-7.094,9.994c-.015.018-.016.051-.05.048a.2.2,0,0,1-.019-.095q0-2.84,0-5.678C4141.411,3777.982,4141.4,3777.943,4141.441,3777.918Z" transform="translate(-4134.243 -3760.39)" fill="#3c3c3b" />
                                                                    <path id="Path_361" data-name="Path 361" d="M3976.6,3777.491a.149.149,0,0,0-.01.083q0,2.855,0,5.708c0,.026,0,.053,0,.079-.1-.125-.188-.258-.281-.388l-2.454-3.458-2.448-3.451-1.952-2.75-.042-.062c.042.023.071.038.1.054l4.23,2.5,2.813,1.663A.411.411,0,0,0,3976.6,3777.491Z" transform="translate(-3969.405 -3759.962)" fill="#8b8b8b" />
                                                                    <path id="Path_362" data-name="Path 362" d="M4141.451,3454.011c-.018.021-.009.048-.009.071q0,4.241,0,8.478c0,.026.009.054-.01.078h0a.079.079,0,0,1-.02-.058c0-.023,0-.046,0-.069v-8.381a.3.3,0,0,1,.021-.14l.011,0Z" transform="translate(-4134.245 -3453.986)" fill="#393939" />
                                                                    <path id="Path_363" data-name="Path 363" d="M3976.695,3454.052v8.625a.2.2,0,0,1,0,.024c-.338.153-.674.308-1.012.463-.357.163-.715.324-1.071.487l-1.852.84-1.294.589q-.958.438-1.918.873a.155.155,0,0,1-.027.007c.107-.18.212-.361.32-.54q1.372-2.279,2.746-4.558,1.753-2.908,3.507-5.82c.193-.32.385-.64.579-.959A.285.285,0,0,1,3976.695,3454.052Z" transform="translate(-3969.509 -3454.049)" fill="#8b8b8b" />
                                                                </g>
                                                            </g>

                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div>
                                                asdasd
                                            </div>
                                            <div>
                                                asjkdhasjkd
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