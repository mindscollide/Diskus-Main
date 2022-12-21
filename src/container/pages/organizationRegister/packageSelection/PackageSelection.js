import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import PackageCards from '../../../../components/elements/packageselection/PackageCards';
import styles from './PackageSelection.module.css'
import Button from '../../../../components/elements/button/Button'
import { Link, useNavigate } from 'react-router-dom';

const PackageSelection = () => {
    const navigate = useNavigate()
    const goBack = () => {
        navigate("/signuporganization")
    }
    return (
        <Container>
            <Row>
                <Col sm={12} className="mt-4">
                    <h2 className={styles["packageselection_heading"]}>Select Package</h2>
                </Col>
            </Row>
            <Row>
                <Col sm={12} md={12} lg={12} className={styles["packageselection_bar"]}>
                    enjoy extra discount on first annual subscription
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col sm={4}>
                    <PackageCards packageTitle="Silver" actualAmount="50" discountAmount="" />
                </Col>
                <Col sm={4}>
                    <PackageCards packageTitle="Gold" actualAmount="40" discountAmount="35" />
                </Col>
                <Col sm={4} className="position-relative">
                    <PackageCards packageTitle="Premium" actualAmount="60" discountAmount="55" />
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center mt-3'>
                    <Link to="/" className={styles["goBackPackageSelectionBtn"]}> Go Back</Link>
                </Col>
            </Row>
        </Container>
    )
}

export default PackageSelection