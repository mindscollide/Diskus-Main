import { ArrowLeft, ArrowRight, ArrowUp } from "react-bootstrap-icons";
import { Popover } from "@reactour/popover";
import { Row, Col } from "react-bootstrap";
import "./steps.css";
import WelcomeScreen from "./container/pages/onBoard/welcomescreen/WelcomeScreen";

import Congrats from "./container/pages/onBoard/congratsscreen/CongratsScreen";
import FinalWelcomeScreen from "./container/pages/onBoard/welcomeBox/FinalWelcomeScreen";
import { useTranslation } from "react-i18next";

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
            <ArrowLeft className="meeting-icon-arrow" />
            <h4 className="fw-700 text-center">
              Let's get started by clicking here
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
        <ArrowUp className="meeting-btn-arrow" />
        <h4 className="fw-700">Schedule a new meeting from here</h4>
      </div>
    ),
    // observe: "[data-tut='show-modal']"
  },
  {
    selector: "[data-tut='meeting-modal']",
    content: () => (
      <div className="dialog2-box">
        <h3 className="fw-700">Fill in the details here</h3>
        <ArrowRight className="meeting-modal-arrow" />
      </div>
    ),
  },

  {
    selector: "[data-tut='congrats-screen']",
    content: () => (
      <>
        {/* <Mask className='congrats-mask' > */}
        <Popover
          className="welcomePopver"
          children={<Congrats message="All Done" />}
        />
        {/* </Mask> */}
      </>
    ),
  },
  {
    selector: "[data-tut='finalwelcome-screen']",
    content: () => (
      <>
        <Popover className="welcomePopver" children={<FinalWelcomeScreen />} />
      </>
    ),
  },
];

export default onBoardSteps;
