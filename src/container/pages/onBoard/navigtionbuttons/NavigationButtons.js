import React, { useState } from "react";
import { useTour } from "@reactour/tour";
import {
  ChevronLeft,
  ChevronRight,
  CurrencyBitcoin,
} from "react-bootstrap-icons";
// import "./NavigationButtons.css"
import { Button } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  showModalOnboard,
  showIsDetailOnboard,
  showIsAgendaOnboard,
  showIsAttendeesOnboard,
  showModalStepsOnboard,
} from "../../../../store/actions/OnBoardStates";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NavigationButtons = () => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  console.log("currentLanguage", currentLanguage, t);
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useTour();
  const [modalSteps, setModalSteps] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { OnBoardModal } = state;
  console.log("first");
  const goNextStep = () => {
    console.log("currentStep modalSteps", OnBoardModal.modalSteps);
    if (OnBoardModal.modalSteps) {
      if (OnBoardModal.show) {
        if (OnBoardModal.isDetails) {
          setCurrentStep(currentStep + 1);
          if (currentStep + 1 === 3) {
            dispatch(showModalOnboard(true));
            dispatch(showIsDetailOnboard(true));
            dispatch(showModalStepsOnboard(true));
          } else if (currentStep === 4) {
            dispatch(showModalOnboard(false));
            dispatch(showIsDetailOnboard(false));
            dispatch(showModalStepsOnboard(false));
          } else {
            dispatch(showModalStepsOnboard(false));
            dispatch(showModalOnboard(false));
            dispatch(showIsDetailOnboard(false));
            console.log("currentStep else", currentStep);
          }
        } else {
          dispatch(showIsDetailOnboard(false));
          dispatch(showModalOnboard(false));
          dispatch(showModalStepsOnboard(true));
        }
      }
    } else {
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 === 3) {
        dispatch(showModalOnboard(true));
        dispatch(showIsDetailOnboard(true));
        dispatch(showModalStepsOnboard(true));
      } else if (currentStep === 4) {
        dispatch(showModalOnboard(false));
        dispatch(showIsDetailOnboard(false));
        dispatch(showModalStepsOnboard(false));
      } else {
        dispatch(showModalStepsOnboard(false));
        dispatch(showModalOnboard(false));
        dispatch(showIsDetailOnboard(false));
        console.log("currentStep else", currentStep);
      }
    }
  };

  const goPrevStep = () => {
    setCurrentStep(currentStep - 1);
    if (currentStep - 1 != 3) {
      dispatch(showModalOnboard(false));
      dispatch(showModalStepsOnboard(false));
      dispatch(showIsDetailOnboard(true));
      dispatch(showIsAttendeesOnboard(false));
    } else {
      dispatch(showModalStepsOnboard(true));
      dispatch(showModalOnboard(true));
      dispatch(showIsDetailOnboard(true));
      dispatch(showIsAttendeesOnboard(false));
    }
  };
  useEffect(() => {
    console.log("currentstep", currentStep);
  }, [currentStep]);
  return (
    <>
      {currentStep !== 5 ? (
        <div className="skipButtons-onboard">
          <Row className="m-0 p-0">
            {currentStep !== 0 ? (
              <Col className="m-0 p-0">
                <Button
                  text={t("Previous-link-Button")}
                  icon={<ChevronLeft />}
                  className="skip-button"
                  onClick={goPrevStep}
                />
              </Col>
            ) : (
              <Col className="m-0 p-0"> </Col>
            )}

            {/* {currentStep.length < -1 } */}
            <Col className="m-0 p-0">
              <Button
                text={t("Next-link-Button")}
                icon2={<ChevronRight />}
                className="skip-button"
                onClick={goNextStep}
              />
            </Col>
          </Row>
          <Row>
            <Col
              onClick={() => navigate("/Diskus/home")}
              className="d-flex justify-content-center mt-2"
            >
              <h3 className={"tour-skip" + " " + currentLanguage}>
                {t("Skip-Demo-Link-Button")}
              </h3>
            </Col>
          </Row>
        </div>
      ) : null}
    </>
  );
};

export default NavigationButtons;
