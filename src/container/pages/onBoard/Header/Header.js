import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./onBoardHeader.css";
import { useTour } from "@reactour/tour";
import TextField from "../../../../components/elements/input_field/Input_field";
import { Search } from "react-bootstrap-icons";
import { CustomDatePicker } from "../../../../components/elements";
import ModalMeeting from "../modalmeeting/ModalMeeting";
import { useTranslation } from "react-i18next";
import Header2 from "../../../../components/layout/header2/Header2";

const Header = ({ searchVisible }) => {
  const { t } = useTranslation();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/onboard") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [location.pathname]);

  const { currentStep } = useTour();
  const [isExpand, setExpand] = useState(false);
  const [isMeeting, setMeeting] = useState(false);
  const { setIsOpen } = useTour();
  const ShowHide = () => {
    setExpand(!isExpand);
  };
  useEffect(() => {
    
    
    location.pathname === "/onboard" ? setMeeting(true) : setMeeting(false);
    setIsOpen(true);
  }, [location]);

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12} className="header-navbar-show">
          <Header2 />
        </Col>
      </Row>
      <Container>
        <Row
          className={
            currentStep === 0 && currentStep === 1 && currentStep === 4
              ? "header-schedule-meeting-btn"
              : "header-schedule-meeting-btn-show"
          }
        >
          <Col
            sm={5}
            className="d-flex justify-content-start align-items-center mt-3"
          >
            {isMeeting && (
              <ModalMeeting ModalTitle={"+ " + t("Schedule-a-meeting")} />
            )}
          </Col>
          <Col sm={7} className="d-flex align-items-center justify-content-end">
            {isExpand && (
              <>
                <CustomDatePicker />
                <TextField width="200px" className="mx-2" placeholder="Task" />
                <TextField
                  width="200px"
                  className="mx-2"
                  placeholder="Assigned To"
                />
              </>
            )}
            {searchVisible && (
              <Search
                width="24px"
                height="24px"
                className="search-Icon"
                onClick={ShowHide}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Header;
