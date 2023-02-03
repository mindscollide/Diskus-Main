import React from 'react'
import styles from './subscriptionwarningline.module.css';
import { Row, Col } from 'react-bootstrap'
const subscriptionwarningline = ({ text }) => {
  return (
    <Row className={styles["subscription_warning"]}>
      <Col className='d-flex justify-content-center my-2'>
        <span className={styles["warningIcon"]}>&#9888;</span><span className={styles["warnignMessage"]}>{text}</span>
      </Col>
    </Row>
  )
}

export default subscriptionwarningline