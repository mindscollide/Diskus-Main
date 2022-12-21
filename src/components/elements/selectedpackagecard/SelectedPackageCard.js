import React, { useState } from 'react'
import styles from './SelectPackageCard.module.css'
import { Container, Row, Col } from 'react-bootstrap'
const SelectedPackageCard = ({PackageHeading, RowsData}) => {
    const [rows, setRows ] = useState([])
    return (
        <Row>
            <Col className='bg-white py-3 border' sm={12} md={12} lg={12} >
                <Container className={styles["selected_package_Container"]}>
                    <Row>
                        <Col sm={12} md={12} lg={12} className="fs-5 mb-4 fw-bold">
                            {PackageHeading}
                        </Col>
                    </Row>
                    {RowsData}
            
             
            

                </Container>
            </Col>
        </Row>
    )
}

export default SelectedPackageCard