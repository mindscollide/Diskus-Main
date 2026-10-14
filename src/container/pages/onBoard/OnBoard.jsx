import React, { useState } from "react";
import { TourProvider } from "@reactour/tour";
import OnBoardRoute from "./OnBoardRoutes";
import ScheduleUpArrow from "../../../../src/assets/images/newElements/Schedule_Up_arrow.png";
import ScheduleLeftArrow from "../../../../src/assets/images/newElements/Schedule-Left-Arrow.png";
import ScheduleRightArrow from "../../../../src/assets/images/newElements/Schedule-Arrow-Right.png";
import { Popover } from "@reactour/popover";
import "./../../../steps.css";
import WelcomeScreen from "./welcomescreen/WelcomeScreen";
import Congrats from "./congratsscreen/CongratsScreen";
import FinalWelcomeScreen from "./welcomeBox/FinalWelcomeScreen";
import { useTranslation } from "react-i18next";

const OnBoard = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

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
                alt=""
                width={70}
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
            alt=""
            src={ScheduleUpArrow}
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
            alt=""
            src={ScheduleRightArrow}
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
          if (currentStep === steps.length && steps.length < 0) {
            setIsOpen(false);
          }
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
