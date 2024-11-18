import React, { useEffect, useState } from "react";
import { TourProvider, useTour } from "@reactour/tour";
// import {} from '@reactour/tour'
import { Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar/Sidebar";
import { Arrow90degDown } from "react-bootstrap-icons";
import Header from "./Header/Header";
import { TodoList } from "./Todolist/Todolist";
import OnBoardRoute from "./OnBoardRoutes";
import { Meeting } from "./Meeting/Meeting";
// import Steps from "../../../steps";
import Welcome from "./welcomescreen/WelcomeScreen";
import { useNavigate } from "react-router-dom";
import ScheduleUpArrow from "../../../../src/assets/images/newElements/Schedule_Up_arrow.png";
import ScheduleLeftArrow from "../../../../src/assets/images/newElements/Schedule-Left-Arrow.png";
import ScheduleRightArrow from "../../../../src/assets/images/newElements/Schedule-Arrow-Right.png";
import { ResultMessage, Button } from "../../../components/elements";

import { ArrowLeft, ArrowRight, ArrowUp } from "react-bootstrap-icons";

import { Popover } from "@reactour/popover";
import "./../../../steps.css";
import WelcomeScreen from "./welcomescreen/WelcomeScreen";
import Congrats from "./congratsscreen/CongratsScreen";
import FinalWelcomeScreen from "./welcomeBox/FinalWelcomeScreen";
import { useTranslation } from "react-i18next";

const OnBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [show, setShow] = useState(false);
  const { currentStep, setCurrentStep } = useTour();
  console.log("show in onboard", show);

  const circle = false;

  const onBoardSteps = [
    {
      selector: "[data-tut='welcomescreen']",
      content: () => (
        <>
          <Popover
            className="welcomePopver"
            children={<WelcomeScreen circle={true} />}
          />
        </>
      ),
    },
    {
      selector: "[data-tut='meeting-icon']",
      content: () => (
        <>
          <div className="dialog-box flex-column">
            <div className="d-flex align-items-center ml-5">
              <img
                draggable="false"
                width={70}
                alt=""
                src={ScheduleLeftArrow}
                className="meeting-icon-arrow"
              />
              <h4 className="Lets-start-meeting">
                {t("Lets-get-started-by-clicking-here")}
              </h4>
            </div>
          </div>
        </>
      ),
    },
    {
      selector: "[data-tut='meetingbtn']",
      content: () => (
        <div className="dialog1-box">
          <img
            draggable="false"
            src={ScheduleUpArrow}
            alt=""
            width={55}
            className="meeting-btn-arrow"
          />
          <h4 className="schedule-a-meeting-here">
            {t("Schedule-a-new-meeting-from-here")}
          </h4>
        </div>
      ),
    },
    {
      selector: "[data-tut='meeting-modal']",
      content: () => (
        <div className="dialog2-box">
          <h3 className="Fill-in-detail-modal">
            {t("Fill-in-the-details-here")}
          </h3>
          <img
            draggable="false"
            src={ScheduleRightArrow}
            alt=""
            width={70}
            className="meeting-modal-arrow"
          />
        </div>
      ),
    },

    {
      selector: "[data-tut='congrats-screen']",
      content: () => (
        <>
          <Popover
            className="welcomePopver"
            children={<Congrats message={t("All-done")} />}
          />
        </>
      ),
    },
    {
      selector: "[data-tut='finalwelcome-screen']",
      content: () => (
        <>
          <Popover
            className="welcomePopver"
            children={<FinalWelcomeScreen />}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <TourProvider
        onClickMask={({ currentStep, steps, setIsOpen }) => {
          if (currentStep === steps.length < 0) {
            setIsOpen(false);
          }
          // setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
        }}
        scrollSmooth={true}
        disableKeyboardNavigation={true}
        steps={onBoardSteps}
        maskClassName="tour-mask"
        showDots={false}
        showNavigation={false}
        showCloseButton={false}
        highlightedMaskClassName="hightlightmask"
        disableInteraction={false}
        disableBodyScroll={true}
      >
        <OnBoardRoute show={show} setShow={setShow} />
      </TourProvider>
    </>
  );
};
export default OnBoard;
