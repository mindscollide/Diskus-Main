import React, { useState, useEffect } from "react";
import "./onboard_sidebar.css";
import { Container, Row, Col, Nav, Navbar } from "react-bootstrap";
import Logo from "../../../../assets/images/sidebar-menu-icon.png";
import { Link, useRouteMatch } from "react-router-dom";
import { useTour } from "@reactour/tour";
import MeetingIconSvg from "../../../../assets/images/newElements/MeetingIcon.svg";
import NewTodoIcon from "../../../../assets/images/newElements/newTodoIcon.svg";
import NewCalendarIcon from "../../../../assets/images/newElements/newCalenderIcon.svg";
import NewLockIcon from "../../../../assets/images/newElements/newlockIcon.svg";
// import { useSelector, useDispatch } from "react-redux";

const Sidebar = ({ Links, ui }) => {
  const { setCurrentStep, currentStep } = useTour();
  const IconBox = {
    width: "40px",
    height: "40px",
  };
  return (
    <>
      <Row className="m-0 p-0 sidebar-row">
        <Col sm={1} className="diskus-sidebar">
          <Nav className=" mb-5 p-0 d-flex justify-content-center align-items-center flex-column mt-5">
            {/* Meeting Menu */}
            {/* <Nav.Link
              // as={Link}
              // to="meeting"
              eventKey="link-1"

              className="m-0 p-0 "
              onClick={() => setCurrentStep(2)}
            >
              <i className="icon-meeting" data-tut='meeting-icon'></i>
            </Nav.Link> */}
            {/* Todo Menu */}
            {/* <Nav.Link
              as={Link}
              to="todo"
              eventKey="link-2"
              className="m-0 p-0 icon"
            >
              <i className="icon-note2" />
            </Nav.Link> */}
            {/* Calendar Menu */}
            {/* <Nav.Link
              as={Link}
              to="calendar"
              eventKey="link-3"
              className="m-0 p-0 icon"
            >
              <i className="icon-note" />
            </Nav.Link> */}
            {/* Meeting Menu */}
            <Nav.Link
              // as={Link}
              // to="meeting"
              className="m-0 p-0 ms-4"
              eventKey="link-2"
              onClick={() => setCurrentStep(2)}
            >
              <img
                draggable="false"
                src={MeetingIconSvg}
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
            </Nav.Link>
            {/* Todo Menu */}
            <Nav.Link
              // as={Link}
              // to="todolist"
              eventKey="link-3"
              className="m-0 p-0 ms-4"
            >
              <img
                draggable="false"
                src={NewTodoIcon}
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
              {/* <i className="icon-note2" /> */}
            </Nav.Link>
            {/* Calendar Menu */}
            <Nav.Link
              // as={Link}
              // to="calendar"
              eventKey="link-4"
              className="m-0 p-0 ms-4"
            >
              <img
                draggable="false"
                src={NewCalendarIcon}
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
              {/* <i className="icon-calendar" /> */}
            </Nav.Link>
            {/* FAQ Menu */}
            <Nav.Link
              // as={Link}
              // to="faq's"
              eventKey="link-5"
              className="m-0 p-0 ms-4"
              // className="m-0 p-0 icon"
              // onClick={() => setCurrentStep(currentStep + 1)}
            >
              <img
                draggable="false"
                src={NewLockIcon}
                data-tut="meeting-icon"
                className="meeting-icon-tut"
              />
              {/* <i className="icon-help help-icon-margin" data-tut="faq-icon" /> */}
            </Nav.Link>
            {/* Setting Menu */}
            <Nav.Link
              // as={Link}
              // to="setting"
              eventKey="link-6"
              // className="m-0 p-0 icon"
            >
              {/* <i className="icon-setting" /> */}
            </Nav.Link>
            {/* FAQ Menu */}
            {/* <Nav.Link
              // as={Link}
              // to="Miscellaneous"
              eventKey="link-4"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="m-0 p-0 icon"
            >
              <i className="icon-help" data-tut='faq-icon' />
            </Nav.Link> */}
            {/* Setting Menu */}
            {/* <Nav.Link
              as={Link}
              to="Setting"
              eventKey="link-5"
              className="m-0 p-0 icon"
            >
              <i className="icon-setting" />
            </Nav.Link> */}
          </Nav>
        </Col>
        <Col sm={11} className={""}></Col>
      </Row>
    </>
  );
};

export default Sidebar;
