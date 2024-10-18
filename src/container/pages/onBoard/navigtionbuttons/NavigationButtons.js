import React from "react";
import { useTour } from "@reactour/tour";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import "./NavigationButtons.css";
import { Button } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  showModalOnboard,
  showIsDetailOnboard,
  showIsAttendeesOnboard,
  showModalStepsOnboard,
} from "../../../../store/actions/OnBoardStates";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NavigationButtons = () => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useTour();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { OnBoardModal } = state;
  const goNextStep = () => {
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
        <div className="containerforButtons-onboard_forscreen1">
          <Row className="">
            {currentStep !== 0 ? (
              <Col className="">
                <Button
                  text={t("Prev")}
                  icon={
                    <ChevronLeft
                      size={16}
                      width={22}
                      className="for-icon-prev-btn"
                    />
                  }
                  className="skipButtons-onboard_forscreen1"
                  onClick={goPrevStep}
                />
              </Col>
            ) : (
              <Col className=""> </Col>
            )}

            <Col>
              {currentLanguage === "ar" ? (
                <Button
                  text={t("Next")}
                  className="skipButtons-onboard_forscreen2"
                  icon2={<ChevronRight size={16} width={22} />}
                  onClick={goNextStep}
                  locale="ar"
                />
              ) : (
                <Button
                  text={t("Next")}
                  icon2={
                    <ChevronRight
                      size={16}
                      width={22}
                      className="for-icon-next-btn"
                    />
                  }
                  className="skipButtons-onboard_forscreen2"
                  onClick={goNextStep}
                  locale="en"
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col
              onClick={() => navigate("/Diskus")}
              className="d-flex justify-content-center mt-2"
            >
              <h3 className={"tour-skip_demo" + " " + currentLanguage}>
                {t("Skip-demo")}
              </h3>
            </Col>
          </Row>
        </div>
      ) : null}
    </>
  );
};

export default NavigationButtons;
