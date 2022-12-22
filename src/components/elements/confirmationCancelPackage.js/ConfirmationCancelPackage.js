import React from 'react'
import styles from './ConfirmationCancelPackage.module.css'
import { Container, Row, Col, Card } from 'react-bootstrap'

import Button from '../../elements/button/Button'
import { useLocation } from 'react-router-dom'
import WarningMessageBox from '../warning_message/WarningMessageBox'
const ConfirmationCancelPackage = () => {
    const location = useLocation()
    return (
        <Container>
            <Card className={styles["UpgradePackageCard"]}>
                <Row>

                    <Col sm={12} md={4} lg={4} className="border-right-0 position-relative">
                        <Col sm={12} md={12} lg={12}>

                            <h3 className={styles["packageheading"]}>Premium</h3>
                            <h4 className='text-center fw-900 m-0 p-0'>$55/month</h4>
                            <p className='mx-auto text-center m-0 p-0'>Annually Subscription</p>
                        </Col>
                        <Row>
                            <Col sm={12} md={12} lg={12} className="text-center text-uppercase fw-bold my-2">Users</Col>
                            <Col sm={12} md={12} lg={12} className="m-0 p-0 w-100" ><input type="range" maxLength={3} minLength={1} className={styles["ExecutiveMembersRange"]} /></Col>
                            <Col sm={12} md={12} lg={12} className="m-0">2 of 3 Executives</Col>
                            <Col sm={12} md={12} lg={12} className="m-0 p-0 w-100" ><input type="range" maxLength={3} minLength={1} className={styles["BoardMembersRange"]} /></Col>
                            <Col sm={12} md={12} lg={12} className="m-0">1 to 2 Board memebers</Col>
                        </Row>
                        <Col sm={12} md={12} lg={12}>
                            <span className={styles["lineBar"]}></span>
                        </Col>
                    </Col>


                    <Col sm={12} md={8} lg={8} >

                        <Row>
                            <Col sm={12} md={7} lg={7} className="mx-auto d-flex justify-content-center">

                                <WarningMessageBox />
                            </Col>
                            <Col sm={12} lg={12} md={12} className={styles["upgradePackageAmoutnandList"]}>
                                <h4>Included Features</h4>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                                <ul>
                                    <li>Get More Users</li>
                                    <li>Theme customization</li>
                                    <li>Marketing tools</li>
                                    <li>Analytics</li>
                                </ul>
                            </Col>

                            <Col sm={12} lg={12} md={12} className="d-flex justify-content-end">
                                <Button text="Upgrade" className={styles["UpgradeBtnCard"]} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Container >
    )
}

export default ConfirmationCancelPackage