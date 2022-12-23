import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import styles from "./WarningMessageBox.module.css";
const WarningMessageBox = () => {
    return (
        <Row>
            <Col sm={12} lg={12} md={12} className={styles["ErrorMessageBox"]}>
                <Row>
                    <Col sm={12} lg={12} md={12} className={styles["warning_heading"]}><span className='me-2'>&#9888;</span>Warning</Col>
                    <Col sm={12} lg={12} md={12} className="text-justify">
                        You have selected for cancellation of subscription at the end of your term which is at “ 18-Dec-23 ”. You can always opt out by selecting the revoke Cancellation Option from the same screen.
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default WarningMessageBox