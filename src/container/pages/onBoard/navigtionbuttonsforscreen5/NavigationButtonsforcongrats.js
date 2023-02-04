import React from 'react'
import { useTour } from '@reactour/tour'
import {ChevronLeft,ChevronRight } from 'react-bootstrap-icons'
import "./NavigationButtonsforCong.css"
import { Button } from '../../../../components/elements'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'


const NavigationButtons = () => {
    const navigate = useNavigate()
    const {currentStep, setCurrentStep} = useTour()
    console.log(currentStep, "currentStepcurrentStep")
    return (<>
         <div className="skipButtons-onboard">
            <Row className='m-0 p-0'>
                <Col className='m-0 p-0'><Button text="PREV" icon={<ChevronLeft />} className="skip-button" onClick={() => setCurrentStep(currentStep - 1)} /></Col>
                <Col className='m-0 p-0'><Button text="NEXT" icon2={<ChevronRight />} className="skip-button" onClick={() => setCurrentStep(currentStep + 1)} /></Col>
            </Row>
            <Row>
                <Col onClick={() => navigate("/Diskus/home")} className="d-flex justify-content-center mt-2" ><h3 className="tour-skip">SKIP DEMO</h3></Col>
            </Row>
        </div>
    </>
    )
}

export default NavigationButtons