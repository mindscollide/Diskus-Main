import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { UpgradePackageCard } from '../../../../components/elements'


const PackageUpgrade = () => {
  return (
    <Container className='py-5'>
      <Row>
      <Col sm={12} md={12} lg={12} className="text-center fs-3 fw-500 mb-4">Upgrade Your Package</Col>
    </Row>
      <Row>
        <Col sm={12} lg={12} md={12} className="mb-4">
          <UpgradePackageCard />
        </Col>
        <Col sm={12} lg={12} md={12}>
          <UpgradePackageCard />
        </Col>
      </Row>
    </Container>
  )
}

export default PackageUpgrade