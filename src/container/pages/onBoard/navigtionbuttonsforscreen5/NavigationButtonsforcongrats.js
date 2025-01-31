import React from "react";
import { useTour } from "@reactour/tour";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import "./NavigationButtonsforCong.css";
import { Button } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { handleNavigation } from "../../../../commen/functions/utils";
import { useDispatch } from "react-redux";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentStep, setCurrentStep } = useTour();
  const dispatch = useDispatch();
  // const handleRoute = () => {}
  return (
    <>
      <div className='skipButtons-onboardFinal_screen5'>
        <Row className=''>
          <Col className=''>
            <Button
              text={t("Prev")}
              icon={<ChevronLeft />}
              className='skipButtons-onboard_screen5'
              onClick={() => setCurrentStep(currentStep - 1)}
            />
          </Col>
          <Col className=''>
            <Button
              text={t("Next")}
              icon2={<ChevronRight />}
              className='skipButtons-onboard_screen5'
              onClick={() => setCurrentStep(currentStep + 1)}
            />
          </Col>
        </Row>
        <Row>
          <Col
            onClick={() => handleNavigation(navigate, false, dispatch)}
            className='d-flex justify-content-center mt-2'>
            <h3 className='tour-skip'>SKIP DEMO</h3>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default NavigationButtons;
