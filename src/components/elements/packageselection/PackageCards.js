import React, { useState } from 'react'
import styles from './PackageCards.module.css'
import { useLocation } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
const PackageCards = ({ packageTitle, actualAmount, discountAmount, selectedPackageAmount, SelectedPackgeSubscription }) => {
    const [annualPackageShow, setAnnualPackageShow] = useState(false)
    const location = useLocation()
    const handleManualPackage = () => {
        setAnnualPackageShow(false)
    }
    const handleAnnualPackage = () => {
        setAnnualPackageShow(true)
    }
    return (
        <Row className='g-4'>
            <Col sm={12}>
                <Card className={styles["packagecard"]}>
                    <Row>
                        <Col sm={12}>
                            <h4 className='text-center'>{packageTitle}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            {location.pathname === "/packageselection" ? <><div className={`${styles["packagecard_priceBox_container"]}`}>
                                <div className={styles["packagecard_one"]}>
                                    <div className={styles["packagecard_pricebox"]}>
                                        <h4 className='d-flex justify-content-center align-items-center  h-100'>${actualAmount}/<p >month</p></h4>
                                    </div>
                                    <div className='d-flex'>
                                        <span className='border border-1 w-100' onClick={handleManualPackage}>Monthly</span><span className=' border border-1 w-100' onClick={handleAnnualPackage}>Annually</span>
                                    </div>
                                </div>
                                <div className={annualPackageShow ? `${styles["packagecard_two"]}` : ` ${styles["packagecard_two_visible"]}`}>
                                    <div className={styles["packagecard_disoucntprice"]}>
                                        <p className={styles["packagecard_disoucntprice_para"]}>Pay Only</p>
                                        <h4 className='d-flex justify-content-center align-items-center mt-2'>${discountAmount}/<p >month</p></h4>
                                        <p className={styles["packagecard_disoucntprice_para"]}>for First Year</p>
                                    </div>
                                </div>
                            </div>
                            </> : <>
                                <div className={`${styles["packagecard_priceBox_container"]}`}>
                                    <div className={styles["selectedPackage_priceDetails"]} >
                                        <div className={styles["packagecard_disoucntprice"]}>
                                            <h4 className='d-flex justify-content-center align-items-center mt-2'>${selectedPackageAmount}/<p >month</p></h4>
                                            <p className={styles["selectedpackagecard_disoucntprice_para"]}>{`${SelectedPackgeSubscription}`} subscription  </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles["selected-package-text"]}>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eros augue, suscipit nec dictum et, sodales nec odio. Cras mauris libero, suscipit nec finibus convallis, suscipit ut purus. In iaculis sapien a diam blandit dignissim. Integer et nisl nis</p>
                                </div>
                            </>}
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <div className={styles["packagecard_usersallows"]}>
                                <h6 className={styles["packagecard_usersallows_heading"]}>Allowed Users</h6>
                               <Row>
                                <Col sm={12} md={6} lg={6} className="m-0 p-0">
                                    <p className={styles["packagecard_usersallows_members"]} >Board Members</p>
                                    <span>02</span>
                                </Col>
                                <Col sm={12} md={6} lg={6} className="m-0 p-0" >
                                    <p className={styles["packagecard_usersallows_members"]}>Executives</p>
                                    <span>03</span>
                                </Col>

                               </Row>
                                {/* <Row>
                                    <Col className={styles["packagecard_usersallows_members"]}>
                                        <p>Board Members</p>
                                    </Col>
                                    <Col className={styles["packagecard_usersallows_members"]}>
                                        <p>Executives</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className={styles["packagecard_usersallows_members_value"]}>02</Col>
                                    <Col className={styles["packagecard_usersallows_members_value"]}>03</Col>
                                </Row> */}
                                <Row className='mt-4 m-0'>
                                    {location.pathname === "/selectedpackage" ? null : <>  <Col sm={12}  >
                                        <Button className={styles["packagecard_btn"]}> Package</Button></Col>
                                        <Col><a >View Package Details</a></Col></>}
                                </Row>
                                {/* <Row>
                                    <Col className={styles["packagecard_usersallows_members_value"]}>02</Col>
                                    <Col className={styles["packagecard_usersallows_members_value"]}>03</Col>
                                </Row>
                                <Row className='mt-4 m-0'>
                                    <Col sm={12} >
                                        <Button className={styles["packagecard_btn"]}> Package</Button></Col>
                                    <Col><a >View Package Details</a></Col>
                                </Row> */}
                            </div>
                        </Col>
                    </Row>
                </Card></Col>
        </Row >
    )
}

export default PackageCards